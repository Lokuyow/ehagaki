import { b6 as wp, b7 as ud, b8 as xp, b9 as _p, ba as Ac, bb as Ep, bc as $p, bd as kp, be as Ap, bf as Sp, Q as Et, bg as Cp, aV as hd, N as ht, bh as Pr, bi as Sc, bj as Ao, bk as So, bl as fd, bm as pd, bn as gd, bo as Cc, M as Mo, aK as jt, W as Ro, U as Vn, _ as ls, $ as Bo, a0 as fr, T as Ja, aZ as Cr, b0 as Ip, aS as en, bp as Ks, bq as Na, br as el, bs as Ni, bt as Ma, bu as Ra, an as vd, bv as ur, a as os, bw as tl, b3 as cs, S as Tp, bx as nl, by as Lp, a$ as Dp, bz as Ic, bA as Op, bB as Np, bC as Mp, bD as Rp, bE as Tc, bF as Bp, a_ as Lc, aQ as Up, s as nt, bG as Mn, bH as Dc, bI as Ba, bJ as Oc, bK as Pp, bL as Nc, bM as zp, bN as Hp, bO as qp, bP as Mc, bQ as jp, bR as Fp, bS as Qs, bT as Zp, X as Vp, bU as Ii, aY as Ti, bV as Rc, bW as Wp, bX as Gp, bY as Kp, bZ as Qp, b_ as Bc, b$ as Yp, c0 as Xp, c1 as Jp } from "./App-B2pbRRzr.js";
import { aS as Te, a as x, b as Se, b0 as Ns, b1 as ln, b2 as wt, b3 as ge, b4 as Ms, b6 as Rs, b7 as bd, bf as G, b5 as ft, ba as He, b8 as L, n as md, b9 as T, Z as Ue, bi as he, bh as Ot, bk as Uc, bj as Ut, aT as nn, aK as zr, aO as Er, aq as yd, ap as hr, ay as eg, bD as Pc } from "./entry-DeBeimY8.js";
import { D as tg, a as ng } from "./DialogWrapper-QD3vI8wE.js";
import { I as $r } from "./InfoPopoverButton-DfvvmEwI.js";
const wd = Sp({ component: "switch", parts: ["root", "thumb"] }), vl = new wp("Switch.Root");
class bl {
  static create(e) {
    return vl.set(new bl(e));
  }
  opts;
  attachment;
  constructor(e) {
    this.opts = e, this.attachment = ud(e.ref), this.onkeydown = this.onkeydown.bind(this), this.onclick = this.onclick.bind(this);
  }
  #e() {
    this.opts.checked.current = !this.opts.checked.current;
  }
  onkeydown(e) {
    !(e.key === xp || e.key === _p) || this.opts.disabled.current || (e.preventDefault(), this.#e());
  }
  onclick(e) {
    this.opts.disabled.current || this.#e();
  }
  #t = Te(() => ({
    "data-disabled": Ac(this.opts.disabled.current),
    "data-state": Ep(this.opts.checked.current),
    "data-required": Ac(this.opts.required.current)
  }));
  get sharedProps() {
    return x(this.#t);
  }
  set sharedProps(e) {
    Se(this.#t, e);
  }
  #n = Te(() => ({ checked: this.opts.checked.current }));
  get snippetProps() {
    return x(this.#n);
  }
  set snippetProps(e) {
    Se(this.#n, e);
  }
  #r = Te(() => ({
    ...this.sharedProps,
    id: this.opts.id.current,
    role: "switch",
    disabled: Ap(this.opts.disabled.current),
    "aria-checked": kp(this.opts.checked.current),
    "aria-required": $p(this.opts.required.current),
    [wd.root]: "",
    onclick: this.onclick,
    onkeydown: this.onkeydown,
    ...this.attachment
  }));
  get props() {
    return x(this.#r);
  }
  set props(e) {
    Se(this.#r, e);
  }
}
class ml {
  static create() {
    return new ml(vl.get());
  }
  root;
  #e = Te(() => this.root.opts.name.current !== void 0);
  get shouldRender() {
    return x(this.#e);
  }
  set shouldRender(e) {
    Se(this.#e, e);
  }
  constructor(e) {
    this.root = e;
  }
  #t = Te(() => ({
    type: "checkbox",
    name: this.root.opts.name.current,
    value: this.root.opts.value.current,
    checked: this.root.opts.checked.current,
    disabled: this.root.opts.disabled.current,
    required: this.root.opts.required.current
  }));
  get props() {
    return x(this.#t);
  }
  set props(e) {
    Se(this.#t, e);
  }
}
class yl {
  static create(e) {
    return new yl(e, vl.get());
  }
  opts;
  root;
  attachment;
  constructor(e, t) {
    this.opts = e, this.root = t, this.attachment = ud(e.ref);
  }
  #e = Te(() => ({ checked: this.root.opts.checked.current }));
  get snippetProps() {
    return x(this.#e);
  }
  set snippetProps(e) {
    Se(this.#e, e);
  }
  #t = Te(() => ({
    ...this.root.sharedProps,
    id: this.opts.id.current,
    [wd.thumb]: "",
    ...this.attachment
  }));
  get props() {
    return x(this.#t);
  }
  set props(e) {
    Se(this.#t, e);
  }
}
function xd(n, e) {
  Ns(e, !0);
  const t = ml.create();
  var r = ln(), i = wt(r);
  {
    var a = (c) => {
      Cp(c, hd(() => t.props));
    };
    Et(i, (c) => {
      t.shouldRender && c(a);
    });
  }
  ge(n, r), Ms();
}
Rs(xd, {}, [], [], { mode: "open" });
var rg = He("<button><!></button>"), sg = He("<!> <!>", 1);
function Br(n, e) {
  const t = bd();
  Ns(e, !0);
  let r = ht(e, "child", 7), i = ht(e, "children", 7), a = ht(e, "ref", 15, null), c = ht(e, "id", 23, () => Ao(t)), d = ht(e, "disabled", 7, !1), h = ht(e, "required", 7, !1), g = ht(e, "checked", 15, !1), b = ht(e, "value", 7, "on"), m = ht(e, "name", 7, void 0), v = ht(e, "type", 7, "button"), D = ht(e, "onCheckedChange", 7, Sc), C = gd(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "child",
    "children",
    "ref",
    "id",
    "disabled",
    "required",
    "checked",
    "value",
    "name",
    "type",
    "onCheckedChange"
  ]);
  const E = bl.create({
    checked: Pr(() => g(), (q) => {
      g(q), D()?.(q);
    }),
    disabled: Pr(() => d() ?? !1),
    required: Pr(() => h()),
    value: Pr(() => b()),
    name: Pr(() => m()),
    id: Pr(() => c()),
    ref: Pr(() => a(), (q) => a(q))
  }), N = Te(() => pd(C, E.props, { type: v() }));
  var V = {
    get child() {
      return r();
    },
    set child(q) {
      r(q), ft();
    },
    get children() {
      return i();
    },
    set children(q) {
      i(q), ft();
    },
    get ref() {
      return a();
    },
    set ref(q = null) {
      a(q), ft();
    },
    get id() {
      return c();
    },
    set id(q = Ao(t)) {
      c(q), ft();
    },
    get disabled() {
      return d();
    },
    set disabled(q = !1) {
      d(q), ft();
    },
    get required() {
      return h();
    },
    set required(q = !1) {
      h(q), ft();
    },
    get checked() {
      return g();
    },
    set checked(q = !1) {
      g(q), ft();
    },
    get value() {
      return b();
    },
    set value(q = "on") {
      b(q), ft();
    },
    get name() {
      return m();
    },
    set name(q = void 0) {
      m(q), ft();
    },
    get type() {
      return v();
    },
    set type(q = "button") {
      v(q), ft();
    },
    get onCheckedChange() {
      return D();
    },
    set onCheckedChange(q = Sc) {
      D(q), ft();
    }
  }, H = sg(), re = wt(H);
  {
    var de = (q) => {
      var K = ln(), S = wt(K);
      {
        let $ = Te(() => ({ props: x(N), ...E.snippetProps }));
        So(S, r, () => x($));
      }
      ge(q, K);
    }, ee = (q) => {
      var K = rg();
      fd(K, () => ({ ...x(N) }));
      var S = L(K);
      So(S, () => i() ?? md, () => E.snippetProps), T(K), ge(q, K);
    };
    Et(re, (q) => {
      r() ? q(de) : q(ee, -1);
    });
  }
  var te = G(re, 2);
  return xd(te, {}), ge(n, H), Ms(V);
}
Rs(
  Br,
  {
    child: {},
    children: {},
    ref: {},
    id: {},
    disabled: {},
    required: {},
    checked: {},
    value: {},
    name: {},
    type: {},
    onCheckedChange: {}
  },
  [],
  [],
  { mode: "open" }
);
var ig = He("<span><!></span>");
function Ur(n, e) {
  const t = bd();
  Ns(e, !0);
  let r = ht(e, "child", 7), i = ht(e, "children", 7), a = ht(e, "ref", 15, null), c = ht(e, "id", 23, () => Ao(t)), d = gd(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "child",
    "children",
    "ref",
    "id"
  ]);
  const h = yl.create({
    id: Pr(() => c()),
    ref: Pr(() => a(), (E) => a(E))
  }), g = Te(() => pd(d, h.props));
  var b = {
    get child() {
      return r();
    },
    set child(E) {
      r(E), ft();
    },
    get children() {
      return i();
    },
    set children(E) {
      i(E), ft();
    },
    get ref() {
      return a();
    },
    set ref(E = null) {
      a(E), ft();
    },
    get id() {
      return c();
    },
    set id(E = Ao(t)) {
      c(E), ft();
    }
  }, m = ln(), v = wt(m);
  {
    var D = (E) => {
      var N = ln(), V = wt(N);
      {
        let H = Te(() => ({ props: x(g), ...h.snippetProps }));
        So(V, r, () => x(H));
      }
      ge(E, N);
    }, C = (E) => {
      var N = ig();
      fd(N, () => ({ ...x(g) }));
      var V = L(N);
      So(V, () => i() ?? md, () => h.snippetProps), T(N), ge(E, N);
    };
    Et(v, (E) => {
      r() ? E(D) : E(C, -1);
    });
  }
  return ge(n, m), Ms(b);
}
Rs(Ur, { child: {}, children: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var og = { 203: (n, e) => {
  function t(S) {
    if (!Number.isSafeInteger(S)) throw new Error(`Wrong integer: ${S}`);
  }
  function r(...S) {
    const $ = (F, Z) => (Y) => F(Z(Y)), A = Array.from(S).reverse().reduce(((F, Z) => F ? $(F, Z.encode) : Z.encode), void 0), P = S.reduce(((F, Z) => F ? $(F, Z.decode) : Z.decode), void 0);
    return { encode: A, decode: P };
  }
  function i(S) {
    return { encode: ($) => {
      if (!Array.isArray($) || $.length && typeof $[0] != "number") throw new Error("alphabet.encode input should be an array of numbers");
      return $.map(((A) => {
        if (t(A), A < 0 || A >= S.length) throw new Error(`Digit index outside alphabet: ${A} (alphabet: ${S.length})`);
        return S[A];
      }));
    }, decode: ($) => {
      if (!Array.isArray($) || $.length && typeof $[0] != "string") throw new Error("alphabet.decode input should be array of strings");
      return $.map(((A) => {
        if (typeof A != "string") throw new Error(`alphabet.decode: not string element=${A}`);
        const P = S.indexOf(A);
        if (P === -1) throw new Error(`Unknown letter: "${A}". Allowed: ${S}`);
        return P;
      }));
    } };
  }
  function a(S = "") {
    if (typeof S != "string") throw new Error("join separator should be string");
    return { encode: ($) => {
      if (!Array.isArray($) || $.length && typeof $[0] != "string") throw new Error("join.encode input should be array of strings");
      for (let A of $) if (typeof A != "string") throw new Error(`join.encode: non-string input=${A}`);
      return $.join(S);
    }, decode: ($) => {
      if (typeof $ != "string") throw new Error("join.decode input should be string");
      return $.split(S);
    } };
  }
  function c(S, $ = "=") {
    if (t(S), typeof $ != "string") throw new Error("padding chr should be string");
    return { encode(A) {
      if (!Array.isArray(A) || A.length && typeof A[0] != "string") throw new Error("padding.encode input should be array of strings");
      for (let P of A) if (typeof P != "string") throw new Error(`padding.encode: non-string input=${P}`);
      for (; A.length * S % 8; ) A.push($);
      return A;
    }, decode(A) {
      if (!Array.isArray(A) || A.length && typeof A[0] != "string") throw new Error("padding.encode input should be array of strings");
      for (let F of A) if (typeof F != "string") throw new Error(`padding.decode: non-string input=${F}`);
      let P = A.length;
      if (P * S % 8) throw new Error("Invalid padding: string should have whole number of bytes");
      for (; P > 0 && A[P - 1] === $; P--) if (!((P - 1) * S % 8)) throw new Error("Invalid padding: string has too much padding");
      return A.slice(0, P);
    } };
  }
  function d(S) {
    if (typeof S != "function") throw new Error("normalize fn should be function");
    return { encode: ($) => $, decode: ($) => S($) };
  }
  function h(S, $, A) {
    if ($ < 2) throw new Error(`convertRadix: wrong from=${$}, base cannot be less than 2`);
    if (A < 2) throw new Error(`convertRadix: wrong to=${A}, base cannot be less than 2`);
    if (!Array.isArray(S)) throw new Error("convertRadix: data should be array");
    if (!S.length) return [];
    let P = 0;
    const F = [], Z = Array.from(S);
    for (Z.forEach(((Y) => {
      if (t(Y), Y < 0 || Y >= $) throw new Error(`Wrong integer: ${Y}`);
    })); ; ) {
      let Y = 0, se = !0;
      for (let pe = P; pe < Z.length; pe++) {
        const ve = Z[pe], ce = $ * Y + ve;
        if (!Number.isSafeInteger(ce) || $ * Y / $ !== Y || ce - ve != $ * Y) throw new Error("convertRadix: carry overflow");
        if (Y = ce % A, Z[pe] = Math.floor(ce / A), !Number.isSafeInteger(Z[pe]) || Z[pe] * A + Y !== ce) throw new Error("convertRadix: carry overflow");
        se && (Z[pe] ? se = !1 : P = pe);
      }
      if (F.push(Y), se) break;
    }
    for (let Y = 0; Y < S.length - 1 && S[Y] === 0; Y++) F.push(0);
    return F.reverse();
  }
  Object.defineProperty(e, "__esModule", { value: !0 }), e.bytes = e.stringToBytes = e.str = e.bytesToString = e.hex = e.utf8 = e.bech32m = e.bech32 = e.base58check = e.base58xmr = e.base58xrp = e.base58flickr = e.base58 = e.base64url = e.base64 = e.base32crockford = e.base32hex = e.base32 = e.base16 = e.utils = e.assertNumber = void 0, e.assertNumber = t;
  const g = (S, $) => $ ? g($, S % $) : S, b = (S, $) => S + ($ - g(S, $));
  function m(S, $, A, P) {
    if (!Array.isArray(S)) throw new Error("convertRadix2: data should be array");
    if ($ <= 0 || $ > 32) throw new Error(`convertRadix2: wrong from=${$}`);
    if (A <= 0 || A > 32) throw new Error(`convertRadix2: wrong to=${A}`);
    if (b($, A) > 32) throw new Error(`convertRadix2: carry overflow from=${$} to=${A} carryBits=${b($, A)}`);
    let F = 0, Z = 0;
    const Y = 2 ** A - 1, se = [];
    for (const pe of S) {
      if (t(pe), pe >= 2 ** $) throw new Error(`convertRadix2: invalid data word=${pe} from=${$}`);
      if (F = F << $ | pe, Z + $ > 32) throw new Error(`convertRadix2: carry overflow pos=${Z} from=${$}`);
      for (Z += $; Z >= A; Z -= A) se.push((F >> Z - A & Y) >>> 0);
      F &= 2 ** Z - 1;
    }
    if (F = F << A - Z & Y, !P && Z >= $) throw new Error("Excess padding");
    if (!P && F) throw new Error(`Non-zero padding: ${F}`);
    return P && Z > 0 && se.push(F >>> 0), se;
  }
  function v(S) {
    return t(S), { encode: ($) => {
      if (!($ instanceof Uint8Array)) throw new Error("radix.encode input should be Uint8Array");
      return h(Array.from($), 256, S);
    }, decode: ($) => {
      if (!Array.isArray($) || $.length && typeof $[0] != "number") throw new Error("radix.decode input should be array of strings");
      return Uint8Array.from(h($, S, 256));
    } };
  }
  function D(S, $ = !1) {
    if (t(S), S <= 0 || S > 32) throw new Error("radix2: bits should be in (0..32]");
    if (b(8, S) > 32 || b(S, 8) > 32) throw new Error("radix2: carry overflow");
    return { encode: (A) => {
      if (!(A instanceof Uint8Array)) throw new Error("radix2.encode input should be Uint8Array");
      return m(Array.from(A), 8, S, !$);
    }, decode: (A) => {
      if (!Array.isArray(A) || A.length && typeof A[0] != "number") throw new Error("radix2.decode input should be array of strings");
      return Uint8Array.from(m(A, S, 8, $));
    } };
  }
  function C(S) {
    if (typeof S != "function") throw new Error("unsafeWrapper fn should be function");
    return function(...$) {
      try {
        return S.apply(null, $);
      } catch {
      }
    };
  }
  function E(S, $) {
    if (t(S), typeof $ != "function") throw new Error("checksum fn should be function");
    return { encode(A) {
      if (!(A instanceof Uint8Array)) throw new Error("checksum.encode: input should be Uint8Array");
      const P = $(A).slice(0, S), F = new Uint8Array(A.length + S);
      return F.set(A), F.set(P, A.length), F;
    }, decode(A) {
      if (!(A instanceof Uint8Array)) throw new Error("checksum.decode: input should be Uint8Array");
      const P = A.slice(0, -S), F = $(P).slice(0, S), Z = A.slice(-S);
      for (let Y = 0; Y < S; Y++) if (F[Y] !== Z[Y]) throw new Error("Invalid checksum");
      return P;
    } };
  }
  e.utils = { alphabet: i, chain: r, checksum: E, radix: v, radix2: D, join: a, padding: c }, e.base16 = r(D(4), i("0123456789ABCDEF"), a("")), e.base32 = r(D(5), i("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), c(5), a("")), e.base32hex = r(D(5), i("0123456789ABCDEFGHIJKLMNOPQRSTUV"), c(5), a("")), e.base32crockford = r(D(5), i("0123456789ABCDEFGHJKMNPQRSTVWXYZ"), a(""), d(((S) => S.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1")))), e.base64 = r(D(6), i("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), c(6), a("")), e.base64url = r(D(6), i("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), c(6), a(""));
  const N = (S) => r(v(58), i(S), a(""));
  e.base58 = N("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"), e.base58flickr = N("123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"), e.base58xrp = N("rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz");
  const V = [0, 2, 3, 5, 6, 7, 9, 10, 11];
  e.base58xmr = { encode(S) {
    let $ = "";
    for (let A = 0; A < S.length; A += 8) {
      const P = S.subarray(A, A + 8);
      $ += e.base58.encode(P).padStart(V[P.length], "1");
    }
    return $;
  }, decode(S) {
    let $ = [];
    for (let A = 0; A < S.length; A += 11) {
      const P = S.slice(A, A + 11), F = V.indexOf(P.length), Z = e.base58.decode(P);
      for (let Y = 0; Y < Z.length - F; Y++) if (Z[Y] !== 0) throw new Error("base58xmr: wrong padding");
      $ = $.concat(Array.from(Z.slice(Z.length - F)));
    }
    return Uint8Array.from($);
  } }, e.base58check = (S) => r(E(4, (($) => S(S($)))), e.base58);
  const H = r(i("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), a("")), re = [996825010, 642813549, 513874426, 1027748829, 705979059];
  function de(S) {
    const $ = S >> 25;
    let A = (33554431 & S) << 5;
    for (let P = 0; P < re.length; P++) ($ >> P & 1) == 1 && (A ^= re[P]);
    return A;
  }
  function ee(S, $, A = 1) {
    const P = S.length;
    let F = 1;
    for (let Z = 0; Z < P; Z++) {
      const Y = S.charCodeAt(Z);
      if (Y < 33 || Y > 126) throw new Error(`Invalid prefix (${S})`);
      F = de(F) ^ Y >> 5;
    }
    F = de(F);
    for (let Z = 0; Z < P; Z++) F = de(F) ^ 31 & S.charCodeAt(Z);
    for (let Z of $) F = de(F) ^ Z;
    for (let Z = 0; Z < 6; Z++) F = de(F);
    return F ^= A, H.encode(m([F % 2 ** 30], 30, 5, !1));
  }
  function te(S) {
    const $ = S === "bech32" ? 1 : 734539939, A = D(5), P = A.decode, F = A.encode, Z = C(P);
    function Y(se, pe = 90) {
      if (typeof se != "string") throw new Error("bech32.decode input should be string, not " + typeof se);
      if (se.length < 8 || pe !== !1 && se.length > pe) throw new TypeError(`Wrong string length: ${se.length} (${se}). Expected (8..${pe})`);
      const ve = se.toLowerCase();
      if (se !== ve && se !== se.toUpperCase()) throw new Error("String must be lowercase or uppercase");
      const ce = (se = ve).lastIndexOf("1");
      if (ce === 0 || ce === -1) throw new Error('Letter "1" must be present between prefix and data only');
      const Ee = se.slice(0, ce), me = se.slice(ce + 1);
      if (me.length < 6) throw new Error("Data must be at least 6 characters long");
      const Ce = H.decode(me).slice(0, -6), je = ee(Ee, Ce, $);
      if (!me.endsWith(je)) throw new Error(`Invalid checksum in ${se}: expected "${je}"`);
      return { prefix: Ee, words: Ce };
    }
    return { encode: function(se, pe, ve = 90) {
      if (typeof se != "string") throw new Error("bech32.encode prefix should be string, not " + typeof se);
      if (!Array.isArray(pe) || pe.length && typeof pe[0] != "number") throw new Error("bech32.encode words should be array of numbers, not " + typeof pe);
      const ce = se.length + 7 + pe.length;
      if (ve !== !1 && ce > ve) throw new TypeError(`Length ${ce} exceeds limit ${ve}`);
      return `${se = se.toLowerCase()}1${H.encode(pe)}${ee(se, pe, $)}`;
    }, decode: Y, decodeToBytes: function(se) {
      const { prefix: pe, words: ve } = Y(se, !1);
      return { prefix: pe, words: ve, bytes: P(ve) };
    }, decodeUnsafe: C(Y), fromWords: P, fromWordsUnsafe: Z, toWords: F };
  }
  e.bech32 = te("bech32"), e.bech32m = te("bech32m"), e.utf8 = { encode: (S) => new TextDecoder().decode(S), decode: (S) => new TextEncoder().encode(S) }, e.hex = r(D(4), i("0123456789abcdef"), a(""), d(((S) => {
    if (typeof S != "string" || S.length % 2) throw new TypeError(`hex.decode: expected string, got ${typeof S} with length ${S.length}`);
    return S.toLowerCase();
  })));
  const q = { utf8: e.utf8, hex: e.hex, base16: e.base16, base32: e.base32, base64: e.base64, base64url: e.base64url, base58: e.base58, base58xmr: e.base58xmr }, K = `Invalid encoding type. Available types: ${Object.keys(q).join(", ")}`;
  e.bytesToString = (S, $) => {
    if (typeof S != "string" || !q.hasOwnProperty(S)) throw new TypeError(K);
    if (!($ instanceof Uint8Array)) throw new TypeError("bytesToString() expects Uint8Array");
    return q[S].encode($);
  }, e.str = e.bytesToString, e.stringToBytes = (S, $) => {
    if (!q.hasOwnProperty(S)) throw new TypeError(K);
    if (typeof $ != "string") throw new TypeError("stringToBytes() expects string");
    return q[S].decode($);
  }, e.bytes = e.stringToBytes;
}, 806: (n, e, t) => {
  t.d(e, { A: () => d });
  var r = t(601), i = t.n(r), a = t(314), c = t.n(a)()(i());
  c.push([n.id, `.zap-sender.with-comment {
  border-radius: 6px 6px 0 0;
}

/* Color Classes Generator */
[class*="zap-amount-"] .zap-sender {
  border-radius: 6px;
}

[class*="zap-amount-"] .zap-sender.with-comment {
  border-radius: 6px 6px 0 0;
}

[class*="zap-amount-"] .zap-details {
  padding-top: 8px;
  padding-bottom: 8px;
}

/* Amount-based Styles */
.zap-amount-100 .zap-sender {
  background-color: var(--zap-100);
}

.zap-amount-200 .zap-sender {
  background-color: var(--zap-200);
}

.zap-amount-500 .zap-sender {
  background-color: var(--zap-500);
}

.zap-amount-1k .zap-sender {
  background-color: var(--zap-1k);
}

.zap-amount-2k .zap-sender {
  background-color: var(--zap-2k);
}

.zap-amount-5k .zap-sender {
  background-color: var(--zap-5k);
}

.zap-amount-10k .zap-sender {
  background-color: var(--zap-10k);
}

/* Details Background Colors */
.zap-amount-100 .zap-details {
  background-color: var(--zap-100-light);
}

.zap-amount-200 .zap-details {
  background-color: var(--zap-200-light);
}

.zap-amount-500 .zap-details {
  background-color: var(--zap-500-light);
}

.zap-amount-1k .zap-details {
  background-color: var(--zap-1k-light);
}

.zap-amount-2k .zap-details {
  background-color: var(--zap-2k-light);
}

.zap-amount-5k .zap-details {
  background-color: var(--zap-5k-light);
}

.zap-amount-10k .zap-details {
  background-color: var(--zap-10k-light);
}

/* Dark Text Colors */
.zap-amount-100,
.zap-amount-2k,
.zap-amount-5k,
.zap-amount-10k {
  .zap-amount {
    color: var(--text-light);
  }

  .sender-name {
    color: var(--text-light-secondary);
  }

  .sender-pubkey {
    color: var(--text-light-tertiary);
  }

  .zap-comment {
    color: var(--text-light);
  }
}

/* Light Text Colors */
.zap-amount-200,
.zap-amount-500,
.zap-amount-1k {
  .zap-amount {
    color: var(--text-dark);
  }

  .sender-name {
    color: var(--text-dark-secondary);
  }

  .sender-pubkey {
    color: var(--text-dark-tertiary);
  }

  .zap-comment {
    color: var(--text-dark);
  }
}`, ""]);
  const d = c;
}, 540: (n, e, t) => {
  t.r(e), t.d(e, { default: () => g });
  var r = t(601), i = t.n(r), a = t(314), c = t.n(a), d = t(806), h = c()(i());
  h.i(d.A), h.push([n.id, `/* styles.css */

:host {
  --main-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  --main-text: Black;
  --pubkey-text: #888;
  --custom-title-text: #555;
  --stats-item-text: #333;
  --name-text: #444;
  --dialog-bg: #ffffff;
  --zap-stats-bg: #edf2f7;
  --hover-bg: #edf2f7;
  --border: #ddd;
  --skeleton: #fdfdfd;
  --skeleton2: #e2e5ec;
  --zap-stats-skeleton-bg: #bbc5cf;
  --new-mark: #22c55e;

  /* Zap Amount Colors */
  --zap-100: #1565c0;
  --zap-200: #00b8d4;
  --zap-500: #00bfa5;
  --zap-1k: #ffb300;
  --zap-2k: #e65100;
  --zap-5k: #c2185b;
  --zap-10k: #d00000;

  /* Light Variants */
  --zap-100-light: #1e88e5;
  --zap-200-light: #00e5ff;
  --zap-500-light: #1de9b6;
  --zap-1k-light: #ffca28;
  --zap-2k-light: #f57c00;
  --zap-5k-light: #e91e63;
  --zap-10k-light: #e62117;

  /* Text Colors */
  --text-light: #ffffff;
  --text-light-secondary: rgba(255, 255, 255, 0.9);
  --text-light-tertiary: rgba(255, 255, 255, 0.5);
  --text-dark: #000000;
  --text-dark-secondary: rgba(0, 0, 0, 0.7);
  --text-dark-tertiary: rgba(0, 0, 0, 0.5);
}

* {
  box-sizing: border-box;
}

button {
  color: var(--main-text);
  background: none;
  border: none;
  cursor: pointer;
}

.dialog {
  font-family: var(--main-font);
  color: var(--main-text);
  font-size: medium;
  font-weight: normal;
  max-height: 700px;
  height: 100dvh;
  width: 360px;
  margin: auto;
  padding: 0;
  border: none;
  border-radius: 10px;
  background: var(--dialog-bg);
  display: flex;
  flex-direction: column;
}

.close-dialog-button {
  color: var(--custom-title-text);
  font-size: 16px;
  font-weight: 500;
  position: absolute;
  right: 0;
  width: 2.625rem;
  height: 2.625rem;
  border: none;
  border-radius: 50%;
  background: none;
  cursor: pointer;
  padding: 10px;
  text-align: center;
}

.close-dialog-button:hover {
  background-color: var(--hover-bg);
}

.dialog-title {
  height: 42px;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  & a {
    font-size: 0.9rem;
    font-weight: normal;
    color: var(--pubkey-text);
    text-decoration: none;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
  }

  & a:hover {
    text-decoration: underline;
  }
}

.dialog-title.custom-title a {
  color: var(--custom-title-text);
  font-weight: 600;
  font-size: 1rem;
}

.zap-stats {
  min-height: 80px;
  padding: 6px 14px;
  background: var(--zap-stats-bg);
  border-radius: 6px;
  display: grid;
  grid-template-columns: 90px 1fr 40px;
  grid-template-rows: repeat(3, 1fr);
  gap: 4px;
  margin: 0 8px;

  .stats-item {
    height: 23px;
    color: var(--stats-item-text);
    font-size: 0.9rem;

    .number {
      font-size: 1.1rem;
      font-weight: 500;
    }

    .number.skeleton {
      width: 100%;
      background: linear-gradient(90deg,
          var(--skeleton) 0%,
          var(--zap-stats-skeleton-bg) 50%,
          var(--skeleton) 100%);
      background-size: 200% 100%;
    }
  }
}

.stats-item:nth-child(3n + 1) {
  justify-content: flex-start;
}

.stats-item:nth-child(3n + 2),
.stats-item:nth-child(3n + 3) {
  justify-content: flex-end;
}

.text-muted {
  margin-right: 16px;
  opacity: 0.4;
}

.dialog-zap-list {
  list-style-type: none;
  margin: 10px 0;
  padding: 0 6px;
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  scroll-behavior: smooth;

  /* スクロールバーのスタイリング */
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    transition: background 0.2s;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.2);
  }

  /* Firefox用のスクロールバースタイル */
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.1) transparent;
}

.zap-list-item {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--border);
  padding: 4px 0;
}

.zap-content {
  display: flex;
  flex-direction: column;
}

.reference-container {
  display: flex;
  flex-direction: column;
}

.zap-sender {
  gap: 12px;
  height: 46px;
  justify-content: space-between;
  padding: 6px;
}

.sender-icon {
  flex-shrink: 0;

  & img {
    width: 100%;
    height: 100%;
    border-radius: 4px;
    object-fit: cover;
    object-position: center;
  }
}

.sender-icon.is-new::before {
  content: "";
  position: absolute;
  top: -4px;
  left: -4px;
  width: 8px;
  height: 8px;
  background-color: var(--new-mark);
  border: 1px solid #fff;
  border-radius: 50%;
  z-index: 1;
  animation: pulse 2500ms cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  50% {
    opacity: 0.3;
  }
}

.sender-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  overflow: hidden;
  min-width: 0;
}

.sender-name {
  font-size: 0.9375rem;
  font-weight: bold;
  color: var(--name-text);
}

.sender-pubkey {
  font-size: 0.625rem;
  color: var(--pubkey-text);
  margin-top: -1px;
}

.zap-amount {
  font-size: 0.8rem;
  white-space: nowrap;
  flex-shrink: 0;

  .number {
    font-size: 1.4rem;
    font-weight: 500;
    text-align: right;
  }
}

.zap-details {
  padding: 2px 8px;
  border-radius: 0 0 6px 6px;
  margin: 0;
}

.zap-comment {
  font-size: 0.9375rem;
  margin: 0;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  max-width: 100%;
}

.no-zaps-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}

.no-zaps-message {
  text-align: center;
  color: var(--pubkey-text);
  font-size: 1.8rem;
  font-weight: 700;
}

.zap-reference {
  padding: 2px 0 2px 12px;
  margin: 0;
  font-size: 0.875rem;
  color: var(--pubkey-text);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.reference-arrow {
  flex-shrink: 0;

  img {
    height: 16px;
    width: auto;
  }
}

.reference-text {
  font-size: 0.75rem;
  margin: 0 2px;
  flex-grow: 1;
}

.reference-link {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1.5rem;
  width: 2.6rem;
  text-decoration: none;
  border-left: 1px solid var(--border);
  flex-shrink: 0;

  & img {
    height: 20px;
    width: auto;
  }
}

.zap-placeholder-name {
  height: 30px;
  width: 140px;
}

.zap-placeholder-name.skeleton {
  width: 120px;
  height: 19px;
  margin: 2px 0;
}

.skeleton {
  color: transparent;
  border-radius: 2px;
  background: linear-gradient(90deg,
      var(--skeleton) 0%,
      var(--skeleton2) 50%,
      var(--skeleton) 100%);
  background-size: 200% 100%;
  animation: loading-animation 3.5s infinite;
  opacity: 0.7;
}

@keyframes loading-animation {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

/* 共通のテキストオーバーフロー処理 */
.dialog-title,
.sender-name,
.sender-pubkey,
.reference-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 共通のフレックスボックス設定 */
.zap-sender,
.stats-item,
.zap-details,
.reference-link,
.zap-reference {
  display: flex;
  align-items: center;
}

/* 共通のアイコンサイズ */
.zap-placeholder-icon,
.sender-icon {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  position: relative;
}

.load-more-trigger {
  height: 40px;
  margin: 10px 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid var(--zap-stats-bg);
  border-top: 3px solid var(--pubkey-text);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}`, ""]);
  const g = h;
}, 314: (n) => {
  n.exports = function(e) {
    var t = [];
    return t.toString = function() {
      return this.map((function(r) {
        var i = "", a = r[5] !== void 0;
        return r[4] && (i += "@supports (".concat(r[4], ") {")), r[2] && (i += "@media ".concat(r[2], " {")), a && (i += "@layer".concat(r[5].length > 0 ? " ".concat(r[5]) : "", " {")), i += e(r), a && (i += "}"), r[2] && (i += "}"), r[4] && (i += "}"), i;
      })).join("");
    }, t.i = function(r, i, a, c, d) {
      typeof r == "string" && (r = [[null, r, void 0]]);
      var h = {};
      if (a) for (var g = 0; g < this.length; g++) {
        var b = this[g][0];
        b != null && (h[b] = !0);
      }
      for (var m = 0; m < r.length; m++) {
        var v = [].concat(r[m]);
        a && h[v[0]] || (d !== void 0 && (v[5] === void 0 || (v[1] = "@layer".concat(v[5].length > 0 ? " ".concat(v[5]) : "", " {").concat(v[1], "}")), v[5] = d), i && (v[2] && (v[1] = "@media ".concat(v[2], " {").concat(v[1], "}")), v[2] = i), c && (v[4] ? (v[1] = "@supports (".concat(v[4], ") {").concat(v[1], "}"), v[4] = c) : v[4] = "".concat(c)), t.push(v));
      }
    }, t;
  };
}, 601: (n) => {
  n.exports = function(e) {
    return e[1];
  };
}, 705: (n, e, t) => {
  const { bech32: r, hex: i, utf8: a } = t(203), c = { bech32: "bc", pubKeyHash: 0, scriptHash: 5, validWitnessVersions: [0] }, d = { bech32: "tb", pubKeyHash: 111, scriptHash: 196, validWitnessVersions: [0] }, h = { bech32: "tbs", pubKeyHash: 111, scriptHash: 196, validWitnessVersions: [0] }, g = { bech32: "bcrt", pubKeyHash: 111, scriptHash: 196, validWitnessVersions: [0] }, b = { bech32: "sb", pubKeyHash: 63, scriptHash: 123, validWitnessVersions: [0] }, m = ["option_data_loss_protect", "initial_routing_sync", "option_upfront_shutdown_script", "gossip_queries", "var_onion_optin", "gossip_queries_ex", "option_static_remotekey", "payment_secret", "basic_mpp", "option_support_large_channel"], v = { m: BigInt(1e3), u: BigInt(1e6), n: BigInt(1e9), p: BigInt(1e12) }, D = BigInt("2100000000000000000"), C = BigInt(1e11), E = { payment_hash: 1, payment_secret: 16, description: 13, payee: 19, description_hash: 23, expiry: 6, min_final_cltv_expiry: 24, fallback_address: 9, route_hint: 3, feature_bits: 5, metadata: 27 }, N = {};
  for (let ee = 0, te = Object.keys(E); ee < te.length; ee++) {
    const q = te[ee], K = E[te[ee]].toString();
    N[K] = q;
  }
  const V = { 1: (ee) => i.encode(r.fromWordsUnsafe(ee)), 16: (ee) => i.encode(r.fromWordsUnsafe(ee)), 13: (ee) => a.encode(r.fromWordsUnsafe(ee)), 19: (ee) => i.encode(r.fromWordsUnsafe(ee)), 23: (ee) => i.encode(r.fromWordsUnsafe(ee)), 27: (ee) => i.encode(r.fromWordsUnsafe(ee)), 6: re, 24: re, 3: function(ee) {
    const te = [];
    let q, K, S, $, A, P = r.fromWordsUnsafe(ee);
    for (; P.length > 0; ) q = i.encode(P.slice(0, 33)), K = i.encode(P.slice(33, 41)), S = parseInt(i.encode(P.slice(41, 45)), 16), $ = parseInt(i.encode(P.slice(45, 49)), 16), A = parseInt(i.encode(P.slice(49, 51)), 16), P = P.slice(51), te.push({ pubkey: q, short_channel_id: K, fee_base_msat: S, fee_proportional_millionths: $, cltv_expiry_delta: A });
    return te;
  }, 5: function(ee) {
    const te = ee.slice().reverse().map(((S) => [!!(1 & S), !!(2 & S), !!(4 & S), !!(8 & S), !!(16 & S)])).reduce(((S, $) => S.concat($)), []);
    for (; te.length < 2 * m.length; ) te.push(!1);
    const q = {};
    m.forEach(((S, $) => {
      let A;
      A = te[2 * $] ? "required" : te[2 * $ + 1] ? "supported" : "unsupported", q[S] = A;
    }));
    const K = te.slice(2 * m.length);
    return q.extra_bits = { start_bit: 2 * m.length, bits: K, has_required: K.reduce(((S, $, A) => A % 2 != 0 ? S || !1 : S || $), !1) }, q;
  } };
  function H(ee) {
    return (te) => ({ tagCode: parseInt(ee), words: r.encode("unknown", te, Number.MAX_SAFE_INTEGER) });
  }
  function re(ee) {
    return ee.reverse().reduce(((te, q, K) => te + q * Math.pow(32, K)), 0);
  }
  function de(ee, te) {
    let q, K;
    if (ee.slice(-1).match(/^[munp]$/)) q = ee.slice(-1), K = ee.slice(0, -1);
    else {
      if (ee.slice(-1).match(/^[^munp0-9]$/)) throw new Error("Not a valid multiplier for the amount");
      K = ee;
    }
    if (!K.match(/^\d+$/)) throw new Error("Not a valid human readable amount");
    const S = BigInt(K), $ = q ? S * C / v[q] : S * C;
    if (q === "p" && S % BigInt(10) !== BigInt(0) || $ > D) throw new Error("Amount is outside of valid range");
    return te ? $.toString() : $;
  }
  n.exports = { decode: function(ee, te) {
    if (typeof ee != "string") throw new Error("Lightning Payment Request must be string");
    if (ee.slice(0, 2).toLowerCase() !== "ln") throw new Error("Not a proper lightning payment request");
    const q = [], K = r.decode(ee, Number.MAX_SAFE_INTEGER);
    ee = ee.toLowerCase();
    const S = K.prefix;
    let $ = K.words, A = ee.slice(S.length + 1), P = $.slice(-104);
    $ = $.slice(0, -104);
    let F = S.match(/^ln(\S+?)(\d*)([a-zA-Z]?)$/);
    if (F && !F[2] && (F = S.match(/^ln(\S+)$/)), !F) throw new Error("Not a proper lightning payment request");
    q.push({ name: "lightning_network", letters: "ln" });
    const Z = F[1];
    let Y;
    if (te) {
      if (te.bech32 === void 0 || te.pubKeyHash === void 0 || te.scriptHash === void 0 || !Array.isArray(te.validWitnessVersions)) throw new Error("Invalid network");
      Y = te;
    } else switch (Z) {
      case c.bech32:
        Y = c;
        break;
      case d.bech32:
        Y = d;
        break;
      case h.bech32:
        Y = h;
        break;
      case g.bech32:
        Y = g;
        break;
      case b.bech32:
        Y = b;
    }
    if (!Y || Y.bech32 !== Z) throw new Error("Unknown coin bech32 prefix");
    q.push({ name: "coin_network", letters: Z, value: Y });
    const se = F[2];
    let pe;
    se ? (pe = de(se + F[3], !0), q.push({ name: "amount", letters: F[2] + F[3], value: pe })) : pe = null, q.push({ name: "separator", letters: "1" });
    const ve = re($.slice(0, 7));
    let ce, Ee, me, Ce;
    for ($ = $.slice(7), q.push({ name: "timestamp", letters: A.slice(0, 7), value: ve }), A = A.slice(7); $.length > 0; ) {
      const ke = $[0].toString();
      ce = N[ke] || "unknown_tag", Ee = V[ke] || H(ke), $ = $.slice(1), me = re($.slice(0, 2)), $ = $.slice(2), Ce = $.slice(0, me), $ = $.slice(me), q.push({ name: ce, tag: A[0], letters: A.slice(0, 3 + me), value: Ee(Ce) }), A = A.slice(3 + me);
    }
    q.push({ name: "signature", letters: A.slice(0, 104), value: i.encode(r.fromWordsUnsafe(P)) }), A = A.slice(104), q.push({ name: "checksum", letters: A });
    let je = { paymentRequest: ee, sections: q, get expiry() {
      let ke = q.find(((Ge) => Ge.name === "expiry"));
      if (ke) return Xe("timestamp") + ke.value;
    }, get route_hints() {
      return q.filter(((ke) => ke.name === "route_hint")).map(((ke) => ke.value));
    } };
    for (let ke in E) ke !== "route_hint" && Object.defineProperty(je, ke, { get: () => Xe(ke) });
    return je;
    function Xe(ke) {
      let Ge = q.find(((pt) => pt.name === ke));
      return Ge ? Ge.value : void 0;
    }
  }, hrpToMillisat: de };
}, 0: (n, e, t) => {
  var r = t(540);
  r && r.__esModule && (r = r.default), n.exports = typeof r == "string" ? r : r.toString();
} }, zc = {};
function xn(n) {
  var e = zc[n];
  if (e !== void 0) return e.exports;
  var t = zc[n] = { id: n, exports: {} };
  return og[n](t, t.exports, xn), t.exports;
}
xn.n = (n) => {
  var e = n && n.__esModule ? () => n.default : () => n;
  return xn.d(e, { a: e }), e;
}, xn.d = (n, e) => {
  for (var t in e) xn.o(e, t) && !xn.o(n, t) && Object.defineProperty(n, t, { enumerable: !0, get: e[t] });
}, xn.o = (n, e) => Object.prototype.hasOwnProperty.call(n, e), xn.r = (n) => {
  typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(n, "__esModule", { value: !0 });
};
var Lr = {};
xn.d(Lr, { vQ: () => We, ZM: () => qi, yk: () => Re, h0: () => Ds, n_: () => Rh, Xz: () => eb, Uv: () => ji, fU: () => Fi, Dw: () => Sr });
var rl = {};
xn.r(rl), xn.d(rl, { OG: () => El, My: () => ei, Ph: () => Bn, lX: () => xl, Id: () => Os, fg: () => Sd, qj: () => wn, aT: () => Ui, lq: () => us, z: () => _l, Q5: () => Pi });
var sl = {};
xn.r(sl), xn.d(sl, { Relay: () => Bu, SimplePool: () => _v, finalizeEvent: () => gr, fj: () => Tu, generateSecretKey: () => gu, getEventHash: () => Mi, getFilterLimit: () => pv, getPublicKey: () => Nl, kinds: () => vu, matchFilter: () => Cu, matchFilters: () => Iu, mergeFilters: () => fv, nip04: () => zu, nip05: () => ju, nip10: () => Zu, nip11: () => Vu, nip13: () => Wu, nip18: () => Qu, nip19: () => Uu, nip21: () => Xu, nip25: () => Ju, nip27: () => eh, nip28: () => th, nip30: () => nh, nip39: () => sh, nip42: () => Ou, nip44: () => ih, nip47: () => dh, nip57: () => uh, nip59: () => hh, nip98: () => xh, parseReferences: () => Lv, serializeEvent: () => pu, sortEvents: () => Yg, utils: () => uu, validateEvent: () => Fo, verifiedSymbol: () => as, verifyEvent: () => ci });
var ag = xn(705);
function Hc(n) {
  if (!Number.isSafeInteger(n) || n < 0) throw new Error(`Wrong positive integer: ${n}`);
}
function _d(n, ...e) {
  if (!(n instanceof Uint8Array)) throw new Error("Expected Uint8Array");
  if (e.length > 0 && !e.includes(n.length)) throw new Error(`Expected Uint8Array of length ${e}, not of length=${n.length}`);
}
function lg(n) {
  if (typeof n != "function" || typeof n.create != "function") throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Hc(n.outputLen), Hc(n.blockLen);
}
function Co(n, e = !0) {
  if (n.destroyed) throw new Error("Hash instance has been destroyed");
  if (e && n.finished) throw new Error("Hash#digest() has already been called");
}
function cg(n, e) {
  _d(n);
  const t = e.outputLen;
  if (n.length < t) throw new Error(`digestInto() expects output buffer of length at least ${t}`);
}
const Ua = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0, Ed = (n) => n instanceof Uint8Array, Pa = (n) => new DataView(n.buffer, n.byteOffset, n.byteLength), xr = (n, e) => n << 32 - e | n >>> e;
if (new Uint8Array(new Uint32Array([287454020]).buffer)[0] !== 68) throw new Error("Non little-endian hardware is not supported");
function wl(n) {
  if (typeof n == "string" && (n = (function(e) {
    if (typeof e != "string") throw new Error("utf8ToBytes expected string, got " + typeof e);
    return new Uint8Array(new TextEncoder().encode(e));
  })(n)), !Ed(n)) throw new Error("expected Uint8Array, got " + typeof n);
  return n;
}
class $d {
  clone() {
    return this._cloneInto();
  }
}
function dg(n) {
  const e = (r) => n().update(wl(r)).digest(), t = n();
  return e.outputLen = t.outputLen, e.blockLen = t.blockLen, e.create = () => n(), e;
}
function kd(n = 32) {
  if (Ua && typeof Ua.getRandomValues == "function") return Ua.getRandomValues(new Uint8Array(n));
  throw new Error("crypto.getRandomValues must be defined");
}
class ug extends $d {
  constructor(e, t, r, i) {
    super(), this.blockLen = e, this.outputLen = t, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Pa(this.buffer);
  }
  update(e) {
    Co(this);
    const { view: t, buffer: r, blockLen: i } = this, a = (e = wl(e)).length;
    for (let c = 0; c < a; ) {
      const d = Math.min(i - this.pos, a - c);
      if (d !== i) r.set(e.subarray(c, c + d), this.pos), this.pos += d, c += d, this.pos === i && (this.process(t, 0), this.pos = 0);
      else {
        const h = Pa(e);
        for (; i <= a - c; c += i) this.process(h, c);
      }
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Co(this), cg(e, this), this.finished = !0;
    const { buffer: t, view: r, blockLen: i, isLE: a } = this;
    let { pos: c } = this;
    t[c++] = 128, this.buffer.subarray(c).fill(0), this.padOffset > i - c && (this.process(r, 0), c = 0);
    for (let m = c; m < i; m++) t[m] = 0;
    (function(m, v, D, C) {
      if (typeof m.setBigUint64 == "function") return m.setBigUint64(v, D, C);
      const E = BigInt(32), N = BigInt(4294967295), V = Number(D >> E & N), H = Number(D & N), re = C ? 4 : 0, de = C ? 0 : 4;
      m.setUint32(v + re, V, C), m.setUint32(v + de, H, C);
    })(r, i - 8, BigInt(8 * this.length), a), this.process(r, 0);
    const d = Pa(e), h = this.outputLen;
    if (h % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
    const g = h / 4, b = this.get();
    if (g > b.length) throw new Error("_sha2: outputLen bigger than state");
    for (let m = 0; m < g; m++) d.setUint32(4 * m, b[m], a);
  }
  digest() {
    const { buffer: e, outputLen: t } = this;
    this.digestInto(e);
    const r = e.slice(0, t);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: t, buffer: r, length: i, finished: a, destroyed: c, pos: d } = this;
    return e.length = i, e.pos = d, e.finished = a, e.destroyed = c, i % t && e.buffer.set(r), e;
  }
}
const hg = (n, e, t) => n & e ^ n & t ^ e & t, fg = new Uint32Array([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]), ns = new Uint32Array([1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225]), rs = new Uint32Array(64);
class pg extends ug {
  constructor() {
    super(64, 32, 8, !1), this.A = 0 | ns[0], this.B = 0 | ns[1], this.C = 0 | ns[2], this.D = 0 | ns[3], this.E = 0 | ns[4], this.F = 0 | ns[5], this.G = 0 | ns[6], this.H = 0 | ns[7];
  }
  get() {
    const { A: e, B: t, C: r, D: i, E: a, F: c, G: d, H: h } = this;
    return [e, t, r, i, a, c, d, h];
  }
  set(e, t, r, i, a, c, d, h) {
    this.A = 0 | e, this.B = 0 | t, this.C = 0 | r, this.D = 0 | i, this.E = 0 | a, this.F = 0 | c, this.G = 0 | d, this.H = 0 | h;
  }
  process(e, t) {
    for (let v = 0; v < 16; v++, t += 4) rs[v] = e.getUint32(t, !1);
    for (let v = 16; v < 64; v++) {
      const D = rs[v - 15], C = rs[v - 2], E = xr(D, 7) ^ xr(D, 18) ^ D >>> 3, N = xr(C, 17) ^ xr(C, 19) ^ C >>> 10;
      rs[v] = N + rs[v - 7] + E + rs[v - 16] | 0;
    }
    let { A: r, B: i, C: a, D: c, E: d, F: h, G: g, H: b } = this;
    for (let v = 0; v < 64; v++) {
      const D = b + (xr(d, 6) ^ xr(d, 11) ^ xr(d, 25)) + ((m = d) & h ^ ~m & g) + fg[v] + rs[v] | 0, C = (xr(r, 2) ^ xr(r, 13) ^ xr(r, 22)) + hg(r, i, a) | 0;
      b = g, g = h, h = d, d = c + D | 0, c = a, a = i, i = r, r = D + C | 0;
    }
    var m;
    r = r + this.A | 0, i = i + this.B | 0, a = a + this.C | 0, c = c + this.D | 0, d = d + this.E | 0, h = h + this.F | 0, g = g + this.G | 0, b = b + this.H | 0, this.set(r, i, a, c, d, h, g, b);
  }
  roundClean() {
    rs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
const il = dg((() => new pg())), gg = (BigInt(0), BigInt(1)), vg = BigInt(2), Uo = (n) => n instanceof Uint8Array, bg = Array.from({ length: 256 }, ((n, e) => e.toString(16).padStart(2, "0")));
function ei(n) {
  if (!Uo(n)) throw new Error("Uint8Array expected");
  let e = "";
  for (let t = 0; t < n.length; t++) e += bg[n[t]];
  return e;
}
function Ad(n) {
  if (typeof n != "string") throw new Error("hex string expected, got " + typeof n);
  return BigInt(n === "" ? "0" : `0x${n}`);
}
function Ui(n) {
  if (typeof n != "string") throw new Error("hex string expected, got " + typeof n);
  const e = n.length;
  if (e % 2) throw new Error("padded hex string expected, got unpadded hex of length " + e);
  const t = new Uint8Array(e / 2);
  for (let r = 0; r < t.length; r++) {
    const i = 2 * r, a = n.slice(i, i + 2), c = Number.parseInt(a, 16);
    if (Number.isNaN(c) || c < 0) throw new Error("Invalid byte sequence");
    t[r] = c;
  }
  return t;
}
function Bn(n) {
  return Ad(ei(n));
}
function xl(n) {
  if (!Uo(n)) throw new Error("Uint8Array expected");
  return Ad(ei(Uint8Array.from(n).reverse()));
}
function us(n, e) {
  return Ui(n.toString(16).padStart(2 * e, "0"));
}
function _l(n, e) {
  return us(n, e).reverse();
}
function wn(n, e, t) {
  let r;
  if (typeof e == "string") try {
    r = Ui(e);
  } catch (a) {
    throw new Error(`${n} must be valid hex string, got "${e}". Cause: ${a}`);
  }
  else {
    if (!Uo(e)) throw new Error(`${n} must be hex string or Uint8Array`);
    r = Uint8Array.from(e);
  }
  const i = r.length;
  if (typeof t == "number" && i !== t) throw new Error(`${n} expected ${t} bytes, got ${i}`);
  return r;
}
function Os(...n) {
  const e = new Uint8Array(n.reduce(((r, i) => r + i.length), 0));
  let t = 0;
  return n.forEach(((r) => {
    if (!Uo(r)) throw new Error("Uint8Array expected");
    e.set(r, t), t += r.length;
  })), e;
}
const El = (n) => (vg << BigInt(n - 1)) - gg, za = (n) => new Uint8Array(n), qc = (n) => Uint8Array.from(n);
function Sd(n, e, t) {
  if (typeof n != "number" || n < 2) throw new Error("hashLen must be a number");
  if (typeof e != "number" || e < 2) throw new Error("qByteLen must be a number");
  if (typeof t != "function") throw new Error("hmacFn must be a function");
  let r = za(n), i = za(n), a = 0;
  const c = () => {
    r.fill(1), i.fill(0), a = 0;
  }, d = (...b) => t(i, r, ...b), h = (b = za()) => {
    i = d(qc([0]), b), r = d(), b.length !== 0 && (i = d(qc([1]), b), r = d());
  }, g = () => {
    if (a++ >= 1e3) throw new Error("drbg: tried 1000 values");
    let b = 0;
    const m = [];
    for (; b < e; ) {
      r = d();
      const v = r.slice();
      m.push(v), b += r.length;
    }
    return Os(...m);
  };
  return (b, m) => {
    let v;
    for (c(), h(b); !(v = m(g())); ) h();
    return c(), v;
  };
}
const mg = { bigint: (n) => typeof n == "bigint", function: (n) => typeof n == "function", boolean: (n) => typeof n == "boolean", string: (n) => typeof n == "string", stringOrUint8Array: (n) => typeof n == "string" || n instanceof Uint8Array, isSafeInteger: (n) => Number.isSafeInteger(n), array: (n) => Array.isArray(n), field: (n, e) => e.Fp.isValid(n), hash: (n) => typeof n == "function" && Number.isSafeInteger(n.outputLen) };
function Pi(n, e, t = {}) {
  const r = (i, a, c) => {
    const d = mg[a];
    if (typeof d != "function") throw new Error(`Invalid validator "${a}", expected function`);
    const h = n[i];
    if (!(c && h === void 0 || d(h, n))) throw new Error(`Invalid param ${String(i)}=${h} (${typeof h}), expected ${a}`);
  };
  for (const [i, a] of Object.entries(e)) r(i, a, !1);
  for (const [i, a] of Object.entries(t)) r(i, a, !0);
  return n;
}
const cn = BigInt(0), Qt = BigInt(1), Is = BigInt(2), yg = BigInt(3), Ha = BigInt(4), jc = BigInt(5), Fc = BigInt(8);
BigInt(9), BigInt(16);
function vn(n, e) {
  const t = n % e;
  return t >= cn ? t : e + t;
}
function wg(n, e, t) {
  if (t <= cn || e < cn) throw new Error("Expected power/modulo > 0");
  if (t === Qt) return cn;
  let r = Qt;
  for (; e > cn; ) e & Qt && (r = r * n % t), n = n * n % t, e >>= Qt;
  return r;
}
function er(n, e, t) {
  let r = n;
  for (; e-- > cn; ) r *= r, r %= t;
  return r;
}
function ol(n, e) {
  if (n === cn || e <= cn) throw new Error(`invert: expected positive integers, got n=${n} mod=${e}`);
  let t = vn(n, e), r = e, i = cn, a = Qt;
  for (; t !== cn; ) {
    const c = r / t, d = r % t, h = i - a * c;
    r = t, t = d, i = a, a = h;
  }
  if (r !== Qt) throw new Error("invert: does not exist");
  return vn(i, e);
}
function xg(n) {
  if (n % Ha === yg) {
    const e = (n + Qt) / Ha;
    return function(t, r) {
      const i = t.pow(r, e);
      if (!t.eql(t.sqr(i), r)) throw new Error("Cannot find square root");
      return i;
    };
  }
  if (n % Fc === jc) {
    const e = (n - jc) / Fc;
    return function(t, r) {
      const i = t.mul(r, Is), a = t.pow(i, e), c = t.mul(r, a), d = t.mul(t.mul(c, Is), a), h = t.mul(c, t.sub(d, t.ONE));
      if (!t.eql(t.sqr(h), r)) throw new Error("Cannot find square root");
      return h;
    };
  }
  return (function(e) {
    const t = (e - Qt) / Is;
    let r, i, a;
    for (r = e - Qt, i = 0; r % Is === cn; r /= Is, i++) ;
    for (a = Is; a < e && wg(a, t, e) !== e - Qt; a++) ;
    if (i === 1) {
      const d = (e + Qt) / Ha;
      return function(h, g) {
        const b = h.pow(g, d);
        if (!h.eql(h.sqr(b), g)) throw new Error("Cannot find square root");
        return b;
      };
    }
    const c = (r + Qt) / Is;
    return function(d, h) {
      if (d.pow(h, t) === d.neg(d.ONE)) throw new Error("Cannot find square root");
      let g = i, b = d.pow(d.mul(d.ONE, a), r), m = d.pow(h, c), v = d.pow(h, r);
      for (; !d.eql(v, d.ONE); ) {
        if (d.eql(v, d.ZERO)) return d.ZERO;
        let D = 1;
        for (let E = d.sqr(v); D < g && !d.eql(E, d.ONE); D++) E = d.sqr(E);
        const C = d.pow(b, Qt << BigInt(g - D - 1));
        b = d.sqr(C), m = d.mul(m, C), v = d.mul(v, b), g = D;
      }
      return m;
    };
  })(n);
}
const _g = ["create", "isValid", "is0", "neg", "inv", "sqrt", "sqr", "eql", "add", "sub", "mul", "pow", "div", "addN", "subN", "mulN", "sqrN"];
function Cd(n, e) {
  const t = e !== void 0 ? e : n.toString(2).length;
  return { nBitLength: t, nByteLength: Math.ceil(t / 8) };
}
function Id(n) {
  if (typeof n != "bigint") throw new Error("field order must be bigint");
  const e = n.toString(2).length;
  return Math.ceil(e / 8);
}
function Zc(n) {
  const e = Id(n);
  return e + Math.ceil(e / 2);
}
class Td extends $d {
  constructor(e, t) {
    super(), this.finished = !1, this.destroyed = !1, lg(e);
    const r = wl(t);
    if (this.iHash = e.create(), typeof this.iHash.update != "function") throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const i = this.blockLen, a = new Uint8Array(i);
    a.set(r.length > i ? e.create().update(r).digest() : r);
    for (let c = 0; c < a.length; c++) a[c] ^= 54;
    this.iHash.update(a), this.oHash = e.create();
    for (let c = 0; c < a.length; c++) a[c] ^= 106;
    this.oHash.update(a), a.fill(0);
  }
  update(e) {
    return Co(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Co(this), _d(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: t, iHash: r, finished: i, destroyed: a, blockLen: c, outputLen: d } = this;
    return e.finished = i, e.destroyed = a, e.blockLen = c, e.outputLen = d, e.oHash = t._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const Ld = (n, e, t) => new Td(n, e).update(t).digest();
Ld.create = (n, e) => new Td(n, e);
const Eg = BigInt(0), qa = BigInt(1);
function Dd(n) {
  return Pi(n.Fp, _g.reduce(((e, t) => (e[t] = "function", e)), { ORDER: "bigint", MASK: "bigint", BYTES: "isSafeInteger", BITS: "isSafeInteger" })), Pi(n, { n: "bigint", h: "bigint", Gx: "field", Gy: "field" }, { nBitLength: "isSafeInteger", nByteLength: "isSafeInteger" }), Object.freeze({ ...Cd(n.n, n.nBitLength), ...n, p: n.Fp.ORDER });
}
const { Ph: $g, aT: kg } = rl, Ls = { Err: class extends Error {
  constructor(n = "") {
    super(n);
  }
}, _parseInt(n) {
  const { Err: e } = Ls;
  if (n.length < 2 || n[0] !== 2) throw new e("Invalid signature integer tag");
  const t = n[1], r = n.subarray(2, t + 2);
  if (!t || r.length !== t) throw new e("Invalid signature integer: wrong length");
  if (128 & r[0]) throw new e("Invalid signature integer: negative");
  if (r[0] === 0 && !(128 & r[1])) throw new e("Invalid signature integer: unnecessary leading zero");
  return { d: $g(r), l: n.subarray(t + 2) };
}, toSig(n) {
  const { Err: e } = Ls, t = typeof n == "string" ? kg(n) : n;
  if (!(t instanceof Uint8Array)) throw new Error("ui8a expected");
  let r = t.length;
  if (r < 2 || t[0] != 48) throw new e("Invalid signature tag");
  if (t[1] !== r - 2) throw new e("Invalid signature: incorrect length");
  const { d: i, l: a } = Ls._parseInt(t.subarray(2)), { d: c, l: d } = Ls._parseInt(a);
  if (d.length) throw new e("Invalid signature: left bytes after parsing");
  return { r: i, s: c };
}, hexFromSig(n) {
  const e = (g) => 8 & Number.parseInt(g[0], 16) ? "00" + g : g, t = (g) => {
    const b = g.toString(16);
    return 1 & b.length ? `0${b}` : b;
  }, r = e(t(n.s)), i = e(t(n.r)), a = r.length / 2, c = i.length / 2, d = t(a), h = t(c);
  return `30${t(c + a + 4)}02${h}${i}02${d}${r}`;
} }, qr = BigInt(0), tr = BigInt(1), Vc = (BigInt(2), BigInt(3));
BigInt(4);
function Ag(n) {
  const e = (function(C) {
    const E = Dd(C);
    Pi(E, { a: "field", b: "field" }, { allowedPrivateKeyLengths: "array", wrapPrivateKey: "boolean", isTorsionFree: "function", clearCofactor: "function", allowInfinityPoint: "boolean", fromBytes: "function", toBytes: "function" });
    const { endo: N, Fp: V, a: H } = E;
    if (N) {
      if (!V.eql(H, V.ZERO)) throw new Error("Endomorphism can only be defined for Koblitz curves that have a=0");
      if (typeof N != "object" || typeof N.beta != "bigint" || typeof N.splitScalar != "function") throw new Error("Expected endomorphism with beta: bigint and splitScalar: function");
    }
    return Object.freeze({ ...E });
  })(n), { Fp: t } = e, r = e.toBytes || ((C, E, N) => {
    const V = E.toAffine();
    return Os(Uint8Array.from([4]), t.toBytes(V.x), t.toBytes(V.y));
  }), i = e.fromBytes || ((C) => {
    const E = C.subarray(1);
    return { x: t.fromBytes(E.subarray(0, t.BYTES)), y: t.fromBytes(E.subarray(t.BYTES, 2 * t.BYTES)) };
  });
  function a(C) {
    const { a: E, b: N } = e, V = t.sqr(C), H = t.mul(V, C);
    return t.add(t.add(H, t.mul(C, E)), N);
  }
  if (!t.eql(t.sqr(e.Gy), a(e.Gx))) throw new Error("bad generator point: equation left != right");
  function c(C) {
    return typeof C == "bigint" && qr < C && C < e.n;
  }
  function d(C) {
    if (!c(C)) throw new Error("Expected valid bigint: 0 < bigint < curve.n");
  }
  function h(C) {
    const { allowedPrivateKeyLengths: E, nByteLength: N, wrapPrivateKey: V, n: H } = e;
    if (E && typeof C != "bigint") {
      if (C instanceof Uint8Array && (C = ei(C)), typeof C != "string" || !E.includes(C.length)) throw new Error("Invalid key");
      C = C.padStart(2 * N, "0");
    }
    let re;
    try {
      re = typeof C == "bigint" ? C : Bn(wn("private key", C, N));
    } catch {
      throw new Error(`private key must be ${N} bytes, hex or bigint, not ${typeof C}`);
    }
    return V && (re = vn(re, H)), d(re), re;
  }
  const g = /* @__PURE__ */ new Map();
  function b(C) {
    if (!(C instanceof m)) throw new Error("ProjectivePoint expected");
  }
  class m {
    constructor(E, N, V) {
      if (this.px = E, this.py = N, this.pz = V, E == null || !t.isValid(E)) throw new Error("x required");
      if (N == null || !t.isValid(N)) throw new Error("y required");
      if (V == null || !t.isValid(V)) throw new Error("z required");
    }
    static fromAffine(E) {
      const { x: N, y: V } = E || {};
      if (!E || !t.isValid(N) || !t.isValid(V)) throw new Error("invalid affine point");
      if (E instanceof m) throw new Error("projective point not allowed");
      const H = (re) => t.eql(re, t.ZERO);
      return H(N) && H(V) ? m.ZERO : new m(N, V, t.ONE);
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    static normalizeZ(E) {
      const N = t.invertBatch(E.map(((V) => V.pz)));
      return E.map(((V, H) => V.toAffine(N[H]))).map(m.fromAffine);
    }
    static fromHex(E) {
      const N = m.fromAffine(i(wn("pointHex", E)));
      return N.assertValidity(), N;
    }
    static fromPrivateKey(E) {
      return m.BASE.multiply(h(E));
    }
    _setWindowSize(E) {
      this._WINDOW_SIZE = E, g.delete(this);
    }
    assertValidity() {
      if (this.is0()) {
        if (e.allowInfinityPoint && !t.is0(this.py)) return;
        throw new Error("bad point: ZERO");
      }
      const { x: E, y: N } = this.toAffine();
      if (!t.isValid(E) || !t.isValid(N)) throw new Error("bad point: x or y not FE");
      const V = t.sqr(N), H = a(E);
      if (!t.eql(V, H)) throw new Error("bad point: equation left != right");
      if (!this.isTorsionFree()) throw new Error("bad point: not in prime-order subgroup");
    }
    hasEvenY() {
      const { y: E } = this.toAffine();
      if (t.isOdd) return !t.isOdd(E);
      throw new Error("Field doesn't support isOdd");
    }
    equals(E) {
      b(E);
      const { px: N, py: V, pz: H } = this, { px: re, py: de, pz: ee } = E, te = t.eql(t.mul(N, ee), t.mul(re, H)), q = t.eql(t.mul(V, ee), t.mul(de, H));
      return te && q;
    }
    negate() {
      return new m(this.px, t.neg(this.py), this.pz);
    }
    double() {
      const { a: E, b: N } = e, V = t.mul(N, Vc), { px: H, py: re, pz: de } = this;
      let ee = t.ZERO, te = t.ZERO, q = t.ZERO, K = t.mul(H, H), S = t.mul(re, re), $ = t.mul(de, de), A = t.mul(H, re);
      return A = t.add(A, A), q = t.mul(H, de), q = t.add(q, q), ee = t.mul(E, q), te = t.mul(V, $), te = t.add(ee, te), ee = t.sub(S, te), te = t.add(S, te), te = t.mul(ee, te), ee = t.mul(A, ee), q = t.mul(V, q), $ = t.mul(E, $), A = t.sub(K, $), A = t.mul(E, A), A = t.add(A, q), q = t.add(K, K), K = t.add(q, K), K = t.add(K, $), K = t.mul(K, A), te = t.add(te, K), $ = t.mul(re, de), $ = t.add($, $), K = t.mul($, A), ee = t.sub(ee, K), q = t.mul($, S), q = t.add(q, q), q = t.add(q, q), new m(ee, te, q);
    }
    add(E) {
      b(E);
      const { px: N, py: V, pz: H } = this, { px: re, py: de, pz: ee } = E;
      let te = t.ZERO, q = t.ZERO, K = t.ZERO;
      const S = e.a, $ = t.mul(e.b, Vc);
      let A = t.mul(N, re), P = t.mul(V, de), F = t.mul(H, ee), Z = t.add(N, V), Y = t.add(re, de);
      Z = t.mul(Z, Y), Y = t.add(A, P), Z = t.sub(Z, Y), Y = t.add(N, H);
      let se = t.add(re, ee);
      return Y = t.mul(Y, se), se = t.add(A, F), Y = t.sub(Y, se), se = t.add(V, H), te = t.add(de, ee), se = t.mul(se, te), te = t.add(P, F), se = t.sub(se, te), K = t.mul(S, Y), te = t.mul($, F), K = t.add(te, K), te = t.sub(P, K), K = t.add(P, K), q = t.mul(te, K), P = t.add(A, A), P = t.add(P, A), F = t.mul(S, F), Y = t.mul($, Y), P = t.add(P, F), F = t.sub(A, F), F = t.mul(S, F), Y = t.add(Y, F), A = t.mul(P, Y), q = t.add(q, A), A = t.mul(se, Y), te = t.mul(Z, te), te = t.sub(te, A), A = t.mul(Z, P), K = t.mul(se, K), K = t.add(K, A), new m(te, q, K);
    }
    subtract(E) {
      return this.add(E.negate());
    }
    is0() {
      return this.equals(m.ZERO);
    }
    wNAF(E) {
      return D.wNAFCached(this, g, E, ((N) => {
        const V = t.invertBatch(N.map(((H) => H.pz)));
        return N.map(((H, re) => H.toAffine(V[re]))).map(m.fromAffine);
      }));
    }
    multiplyUnsafe(E) {
      const N = m.ZERO;
      if (E === qr) return N;
      if (d(E), E === tr) return this;
      const { endo: V } = e;
      if (!V) return D.unsafeLadder(this, E);
      let { k1neg: H, k1: re, k2neg: de, k2: ee } = V.splitScalar(E), te = N, q = N, K = this;
      for (; re > qr || ee > qr; ) re & tr && (te = te.add(K)), ee & tr && (q = q.add(K)), K = K.double(), re >>= tr, ee >>= tr;
      return H && (te = te.negate()), de && (q = q.negate()), q = new m(t.mul(q.px, V.beta), q.py, q.pz), te.add(q);
    }
    multiply(E) {
      d(E);
      let N, V, H = E;
      const { endo: re } = e;
      if (re) {
        const { k1neg: de, k1: ee, k2neg: te, k2: q } = re.splitScalar(H);
        let { p: K, f: S } = this.wNAF(ee), { p: $, f: A } = this.wNAF(q);
        K = D.constTimeNegate(de, K), $ = D.constTimeNegate(te, $), $ = new m(t.mul($.px, re.beta), $.py, $.pz), N = K.add($), V = S.add(A);
      } else {
        const { p: de, f: ee } = this.wNAF(H);
        N = de, V = ee;
      }
      return m.normalizeZ([N, V])[0];
    }
    multiplyAndAddUnsafe(E, N, V) {
      const H = m.BASE, re = (ee, te) => te !== qr && te !== tr && ee.equals(H) ? ee.multiply(te) : ee.multiplyUnsafe(te), de = re(this, N).add(re(E, V));
      return de.is0() ? void 0 : de;
    }
    toAffine(E) {
      const { px: N, py: V, pz: H } = this, re = this.is0();
      E == null && (E = re ? t.ONE : t.inv(H));
      const de = t.mul(N, E), ee = t.mul(V, E), te = t.mul(H, E);
      if (re) return { x: t.ZERO, y: t.ZERO };
      if (!t.eql(te, t.ONE)) throw new Error("invZ was invalid");
      return { x: de, y: ee };
    }
    isTorsionFree() {
      const { h: E, isTorsionFree: N } = e;
      if (E === tr) return !0;
      if (N) return N(m, this);
      throw new Error("isTorsionFree() has not been declared for the elliptic curve");
    }
    clearCofactor() {
      const { h: E, clearCofactor: N } = e;
      return E === tr ? this : N ? N(m, this) : this.multiplyUnsafe(e.h);
    }
    toRawBytes(E = !0) {
      return this.assertValidity(), r(m, this, E);
    }
    toHex(E = !0) {
      return ei(this.toRawBytes(E));
    }
  }
  m.BASE = new m(e.Gx, e.Gy, t.ONE), m.ZERO = new m(t.ZERO, t.ONE, t.ZERO);
  const v = e.nBitLength, D = /* @__PURE__ */ (function(C, E) {
    const N = (H, re) => {
      const de = re.negate();
      return H ? de : re;
    }, V = (H) => ({ windows: Math.ceil(E / H) + 1, windowSize: 2 ** (H - 1) });
    return { constTimeNegate: N, unsafeLadder(H, re) {
      let de = C.ZERO, ee = H;
      for (; re > Eg; ) re & qa && (de = de.add(ee)), ee = ee.double(), re >>= qa;
      return de;
    }, precomputeWindow(H, re) {
      const { windows: de, windowSize: ee } = V(re), te = [];
      let q = H, K = q;
      for (let S = 0; S < de; S++) {
        K = q, te.push(K);
        for (let $ = 1; $ < ee; $++) K = K.add(q), te.push(K);
        q = K.double();
      }
      return te;
    }, wNAF(H, re, de) {
      const { windows: ee, windowSize: te } = V(H);
      let q = C.ZERO, K = C.BASE;
      const S = BigInt(2 ** H - 1), $ = 2 ** H, A = BigInt(H);
      for (let P = 0; P < ee; P++) {
        const F = P * te;
        let Z = Number(de & S);
        de >>= A, Z > te && (Z -= $, de += qa);
        const Y = F, se = F + Math.abs(Z) - 1, pe = P % 2 != 0, ve = Z < 0;
        Z === 0 ? K = K.add(N(pe, re[Y])) : q = q.add(N(ve, re[se]));
      }
      return { p: q, f: K };
    }, wNAFCached(H, re, de, ee) {
      const te = H._WINDOW_SIZE || 1;
      let q = re.get(H);
      return q || (q = this.precomputeWindow(H, te), te !== 1 && re.set(H, ee(q))), this.wNAF(te, q, de);
    } };
  })(m, e.endo ? Math.ceil(v / 2) : v);
  return { CURVE: e, ProjectivePoint: m, normPrivateKeyToScalar: h, weierstrassEquation: a, isWithinCurveOrder: c };
}
function Sg(n) {
  const e = (function(S) {
    const $ = Dd(S);
    return Pi($, { hash: "hash", hmac: "function", randomBytes: "function" }, { bits2int: "function", bits2int_modN: "function", lowS: "boolean" }), Object.freeze({ lowS: !0, ...$ });
  })(n), { Fp: t, n: r } = e, i = t.BYTES + 1, a = 2 * t.BYTES + 1;
  function c(S) {
    return vn(S, r);
  }
  function d(S) {
    return ol(S, r);
  }
  const { ProjectivePoint: h, normPrivateKeyToScalar: g, weierstrassEquation: b, isWithinCurveOrder: m } = Ag({ ...e, toBytes(S, $, A) {
    const P = $.toAffine(), F = t.toBytes(P.x), Z = Os;
    return A ? Z(Uint8Array.from([$.hasEvenY() ? 2 : 3]), F) : Z(Uint8Array.from([4]), F, t.toBytes(P.y));
  }, fromBytes(S) {
    const $ = S.length, A = S[0], P = S.subarray(1);
    if ($ !== i || A !== 2 && A !== 3) {
      if ($ === a && A === 4)
        return { x: t.fromBytes(P.subarray(0, t.BYTES)), y: t.fromBytes(P.subarray(t.BYTES, 2 * t.BYTES)) };
      throw new Error(`Point of length ${$} was invalid. Expected ${i} compressed bytes or ${a} uncompressed bytes`);
    }
    {
      const Z = Bn(P);
      if (!(qr < (F = Z) && F < t.ORDER)) throw new Error("Point is not on curve");
      const Y = b(Z);
      let se = t.sqrt(Y);
      return !(1 & ~A) != ((se & tr) === tr) && (se = t.neg(se)), { x: Z, y: se };
    }
    var F;
  } }), v = (S) => ei(us(S, e.nByteLength));
  function D(S) {
    return S > r >> tr;
  }
  const C = (S, $, A) => Bn(S.slice($, A));
  class E {
    constructor($, A, P) {
      this.r = $, this.s = A, this.recovery = P, this.assertValidity();
    }
    static fromCompact($) {
      const A = e.nByteLength;
      return $ = wn("compactSignature", $, 2 * A), new E(C($, 0, A), C($, A, 2 * A));
    }
    static fromDER($) {
      const { r: A, s: P } = Ls.toSig(wn("DER", $));
      return new E(A, P);
    }
    assertValidity() {
      if (!m(this.r)) throw new Error("r must be 0 < r < CURVE.n");
      if (!m(this.s)) throw new Error("s must be 0 < s < CURVE.n");
    }
    addRecoveryBit($) {
      return new E(this.r, this.s, $);
    }
    recoverPublicKey($) {
      const { r: A, s: P, recovery: F } = this, Z = re(wn("msgHash", $));
      if (F == null || ![0, 1, 2, 3].includes(F)) throw new Error("recovery id invalid");
      const Y = F === 2 || F === 3 ? A + e.n : A;
      if (Y >= t.ORDER) throw new Error("recovery id 2 or 3 invalid");
      const se = 1 & F ? "03" : "02", pe = h.fromHex(se + v(Y)), ve = d(Y), ce = c(-Z * ve), Ee = c(P * ve), me = h.BASE.multiplyAndAddUnsafe(pe, ce, Ee);
      if (!me) throw new Error("point at infinify");
      return me.assertValidity(), me;
    }
    hasHighS() {
      return D(this.s);
    }
    normalizeS() {
      return this.hasHighS() ? new E(this.r, c(-this.s), this.recovery) : this;
    }
    toDERRawBytes() {
      return Ui(this.toDERHex());
    }
    toDERHex() {
      return Ls.hexFromSig({ r: this.r, s: this.s });
    }
    toCompactRawBytes() {
      return Ui(this.toCompactHex());
    }
    toCompactHex() {
      return v(this.r) + v(this.s);
    }
  }
  const N = { isValidPrivateKey(S) {
    try {
      return g(S), !0;
    } catch {
      return !1;
    }
  }, normPrivateKeyToScalar: g, randomPrivateKey: () => {
    const S = Zc(e.n);
    return (function($, A, P = !1) {
      const F = $.length, Z = Id(A), Y = Zc(A);
      if (F < 16 || F < Y || F > 1024) throw new Error(`expected ${Y}-1024 bytes of input, got ${F}`);
      const se = vn(P ? Bn($) : xl($), A - Qt) + Qt;
      return P ? _l(se, Z) : us(se, Z);
    })(e.randomBytes(S), e.n);
  }, precompute: (S = 8, $ = h.BASE) => ($._setWindowSize(S), $.multiply(BigInt(3)), $) };
  function V(S) {
    const $ = S instanceof Uint8Array, A = typeof S == "string", P = ($ || A) && S.length;
    return $ ? P === i || P === a : A ? P === 2 * i || P === 2 * a : S instanceof h;
  }
  const H = e.bits2int || function(S) {
    const $ = Bn(S), A = 8 * S.length - e.nBitLength;
    return A > 0 ? $ >> BigInt(A) : $;
  }, re = e.bits2int_modN || function(S) {
    return c(H(S));
  }, de = El(e.nBitLength);
  function ee(S) {
    if (typeof S != "bigint") throw new Error("bigint expected");
    if (!(qr <= S && S < de)) throw new Error(`bigint expected < 2^${e.nBitLength}`);
    return us(S, e.nByteLength);
  }
  function te(S, $, A = q) {
    if (["recovered", "canonical"].some(((Ce) => Ce in A))) throw new Error("sign() legacy options not supported");
    const { hash: P, randomBytes: F } = e;
    let { lowS: Z, prehash: Y, extraEntropy: se } = A;
    Z == null && (Z = !0), S = wn("msgHash", S), Y && (S = wn("prehashed msgHash", P(S)));
    const pe = re(S), ve = g($), ce = [ee(ve), ee(pe)];
    if (se != null) {
      const Ce = se === !0 ? F(t.BYTES) : se;
      ce.push(wn("extraEntropy", Ce));
    }
    const Ee = Os(...ce), me = pe;
    return { seed: Ee, k2sig: function(Ce) {
      const je = H(Ce);
      if (!m(je)) return;
      const Xe = d(je), ke = h.BASE.multiply(je).toAffine(), Ge = c(ke.x);
      if (Ge === qr) return;
      const pt = c(Xe * c(me + Ge * ve));
      if (pt === qr) return;
      let ae = (ke.x === Ge ? 0 : 2) | Number(ke.y & tr), Je = pt;
      return Z && D(pt) && (Je = (function(Yt) {
        return D(Yt) ? c(-Yt) : Yt;
      })(pt), ae ^= 1), new E(Ge, Je, ae);
    } };
  }
  const q = { lowS: e.lowS, prehash: !1 }, K = { lowS: e.lowS, prehash: !1 };
  return h.BASE._setWindowSize(8), { CURVE: e, getPublicKey: function(S, $ = !0) {
    return h.fromPrivateKey(S).toRawBytes($);
  }, getSharedSecret: function(S, $, A = !0) {
    if (V(S)) throw new Error("first arg must be private key");
    if (!V($)) throw new Error("second arg must be public key");
    return h.fromHex($).multiply(g(S)).toRawBytes(A);
  }, sign: function(S, $, A = q) {
    const { seed: P, k2sig: F } = te(S, $, A), Z = e;
    return Sd(Z.hash.outputLen, Z.nByteLength, Z.hmac)(P, F);
  }, verify: function(S, $, A, P = K) {
    const F = S;
    if ($ = wn("msgHash", $), A = wn("publicKey", A), "strict" in P) throw new Error("options.strict was renamed to lowS");
    const { lowS: Z, prehash: Y } = P;
    let se, pe;
    try {
      if (typeof F == "string" || F instanceof Uint8Array) try {
        se = E.fromDER(F);
      } catch (ke) {
        if (!(ke instanceof Ls.Err)) throw ke;
        se = E.fromCompact(F);
      }
      else {
        if (typeof F != "object" || typeof F.r != "bigint" || typeof F.s != "bigint") throw new Error("PARSE");
        {
          const { r: ke, s: Ge } = F;
          se = new E(ke, Ge);
        }
      }
      pe = h.fromHex(A);
    } catch (ke) {
      if (ke.message === "PARSE") throw new Error("signature must be Signature instance, Uint8Array or hex string");
      return !1;
    }
    if (Z && se.hasHighS()) return !1;
    Y && ($ = e.hash($));
    const { r: ve, s: ce } = se, Ee = re($), me = d(ce), Ce = c(Ee * me), je = c(ve * me), Xe = h.BASE.multiplyAndAddUnsafe(pe, Ce, je)?.toAffine();
    return !!Xe && c(Xe.x) === ve;
  }, ProjectivePoint: h, Signature: E, utils: N };
}
function Cg(n) {
  return { hash: n, hmac: (e, ...t) => Ld(n, e, (function(...r) {
    const i = new Uint8Array(r.reduce(((c, d) => c + d.length), 0));
    let a = 0;
    return r.forEach(((c) => {
      if (!Ed(c)) throw new Error("Uint8Array expected");
      i.set(c, a), a += c.length;
    })), i;
  })(...t)), randomBytes: kd };
}
const Po = BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"), Io = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"), Od = BigInt(1), To = BigInt(2), Wc = (n, e) => (n + e / To) / e;
function Nd(n) {
  const e = Po, t = BigInt(3), r = BigInt(6), i = BigInt(11), a = BigInt(22), c = BigInt(23), d = BigInt(44), h = BigInt(88), g = n * n * n % e, b = g * g * n % e, m = er(b, t, e) * b % e, v = er(m, t, e) * b % e, D = er(v, To, e) * g % e, C = er(D, i, e) * D % e, E = er(C, a, e) * C % e, N = er(E, d, e) * E % e, V = er(N, h, e) * N % e, H = er(V, d, e) * E % e, re = er(H, t, e) * b % e, de = er(re, c, e) * C % e, ee = er(de, r, e) * g % e, te = er(ee, To, e);
  if (!al.eql(al.sqr(te), n)) throw new Error("Cannot find square root");
  return te;
}
const al = (function(n, e, t = !1, r = {}) {
  if (n <= cn) throw new Error(`Expected Field ORDER > 0, got ${n}`);
  const { nBitLength: i, nByteLength: a } = Cd(n, e);
  if (a > 2048) throw new Error("Field lengths over 2048 bytes are not supported");
  const c = xg(n), d = Object.freeze({ ORDER: n, BITS: i, BYTES: a, MASK: El(i), ZERO: cn, ONE: Qt, create: (h) => vn(h, n), isValid: (h) => {
    if (typeof h != "bigint") throw new Error("Invalid field element: expected bigint, got " + typeof h);
    return cn <= h && h < n;
  }, is0: (h) => h === cn, isOdd: (h) => (h & Qt) === Qt, neg: (h) => vn(-h, n), eql: (h, g) => h === g, sqr: (h) => vn(h * h, n), add: (h, g) => vn(h + g, n), sub: (h, g) => vn(h - g, n), mul: (h, g) => vn(h * g, n), pow: (h, g) => (function(b, m, v) {
    if (v < cn) throw new Error("Expected power > 0");
    if (v === cn) return b.ONE;
    if (v === Qt) return m;
    let D = b.ONE, C = m;
    for (; v > cn; ) v & Qt && (D = b.mul(D, C)), C = b.sqr(C), v >>= Qt;
    return D;
  })(d, h, g), div: (h, g) => vn(h * ol(g, n), n), sqrN: (h) => h * h, addN: (h, g) => h + g, subN: (h, g) => h - g, mulN: (h, g) => h * g, inv: (h) => ol(h, n), sqrt: r.sqrt || ((h) => c(d, h)), invertBatch: (h) => (function(g, b) {
    const m = new Array(b.length), v = b.reduce(((C, E, N) => g.is0(E) ? C : (m[N] = C, g.mul(C, E))), g.ONE), D = g.inv(v);
    return b.reduceRight(((C, E, N) => g.is0(E) ? C : (m[N] = g.mul(C, m[N]), g.mul(C, E))), D), m;
  })(d, h), cmov: (h, g, b) => b ? g : h, toBytes: (h) => t ? _l(h, a) : us(h, a), fromBytes: (h) => {
    if (h.length !== a) throw new Error(`Fp.fromBytes: expected ${a}, got ${h.length}`);
    return t ? xl(h) : Bn(h);
  } });
  return Object.freeze(d);
})(Po, void 0, void 0, { sqrt: Nd }), ii = (function(n, e) {
  const t = (r) => Sg({ ...n, ...Cg(r) });
  return Object.freeze({ ...t(e), create: t });
})({ a: BigInt(0), b: BigInt(7), Fp: al, n: Io, Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"), Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"), h: BigInt(1), lowS: !0, endo: { beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"), splitScalar: (n) => {
  const e = Io, t = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -Od * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), i = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), a = t, c = BigInt("0x100000000000000000000000000000000"), d = Wc(a * n, e), h = Wc(-r * n, e);
  let g = vn(n - d * t - h * i, e), b = vn(-d * r - h * a, e);
  const m = g > c, v = b > c;
  if (m && (g = e - g), v && (b = e - b), g > c || b > c) throw new Error("splitScalar: Endomorphism failed, k=" + n);
  return { k1neg: m, k1: g, k2neg: v, k2: b };
} } }, il), zo = BigInt(0), Md = (n) => typeof n == "bigint" && zo < n && n < Po, Gc = {};
function Lo(n, ...e) {
  let t = Gc[n];
  if (t === void 0) {
    const r = il(Uint8Array.from(n, ((i) => i.charCodeAt(0))));
    t = Os(r, r), Gc[n] = t;
  }
  return il(Os(t, ...e));
}
const $l = (n) => n.toRawBytes(!0).slice(1), ll = (n) => us(n, 32), ja = (n) => vn(n, Po), zi = (n) => vn(n, Io), kl = ii.ProjectivePoint;
function cl(n) {
  let e = ii.utils.normPrivateKeyToScalar(n), t = kl.fromPrivateKey(e);
  return { scalar: t.hasEvenY() ? e : zi(-e), bytes: $l(t) };
}
function Rd(n) {
  if (!Md(n)) throw new Error("bad x: need 0 < x < p");
  const e = ja(n * n);
  let t = Nd(ja(e * n + BigInt(7)));
  t % To !== zo && (t = ja(-t));
  const r = new kl(n, t, Od);
  return r.assertValidity(), r;
}
function Bd(...n) {
  return zi(Bn(Lo("BIP0340/challenge", ...n)));
}
function Ig(n) {
  return cl(n).bytes;
}
function Tg(n, e, t = kd(32)) {
  const r = wn("message", n), { bytes: i, scalar: a } = cl(e), c = wn("auxRand", t, 32), d = ll(a ^ Bn(Lo("BIP0340/aux", c))), h = Lo("BIP0340/nonce", d, i, r), g = zi(Bn(h));
  if (g === zo) throw new Error("sign failed: k is zero");
  const { bytes: b, scalar: m } = cl(g), v = Bd(b, i, r), D = new Uint8Array(64);
  if (D.set(b, 0), D.set(ll(zi(m + v * a)), 32), !Ud(D, r, i)) throw new Error("sign: Invalid signature produced");
  return D;
}
function Ud(n, e, t) {
  const r = wn("signature", n, 64), i = wn("message", e), a = wn("publicKey", t, 32);
  try {
    const b = Rd(Bn(a)), m = Bn(r.subarray(0, 32));
    if (!Md(m)) return !1;
    const v = Bn(r.subarray(32, 64));
    if (!(typeof (g = v) == "bigint" && zo < g && g < Io)) return !1;
    const D = Bd(ll(m), $l(b), i), C = (c = b, d = v, h = zi(-D), kl.BASE.multiplyAndAddUnsafe(c, d, h));
    return !(!C || !C.hasEvenY() || C.toAffine().x !== m);
  } catch {
    return !1;
  }
  var c, d, h, g;
}
const kr = { getPublicKey: Ig, sign: Tg, verify: Ud, utils: { randomPrivateKey: ii.utils.randomPrivateKey, lift_x: Rd, pointToBytes: $l, numberToBytesBE: us, bytesToNumberBE: Bn, taggedHash: Lo, mod: vn } }, Fa = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0, Al = (n) => n instanceof Uint8Array, Za = (n) => new DataView(n.buffer, n.byteOffset, n.byteLength), _r = (n, e) => n << 32 - e | n >>> e;
if (new Uint8Array(new Uint32Array([287454020]).buffer)[0] !== 68) throw new Error("Non little-endian hardware is not supported");
const Lg = Array.from({ length: 256 }, ((n, e) => e.toString(16).padStart(2, "0")));
function rn(n) {
  if (!Al(n)) throw new Error("Uint8Array expected");
  let e = "";
  for (let t = 0; t < n.length; t++) e += Lg[n[t]];
  return e;
}
function ti(n) {
  if (typeof n != "string") throw new Error("hex string expected, got " + typeof n);
  const e = n.length;
  if (e % 2) throw new Error("padded hex string expected, got unpadded hex of length " + e);
  const t = new Uint8Array(e / 2);
  for (let r = 0; r < t.length; r++) {
    const i = 2 * r, a = n.slice(i, i + 2), c = Number.parseInt(a, 16);
    if (Number.isNaN(c) || c < 0) throw new Error("Invalid byte sequence");
    t[r] = c;
  }
  return t;
}
function Hi(n) {
  if (typeof n == "string" && (n = (function(e) {
    if (typeof e != "string") throw new Error("utf8ToBytes expected string, got " + typeof e);
    return new Uint8Array(new TextEncoder().encode(e));
  })(n)), !Al(n)) throw new Error("expected Uint8Array, got " + typeof n);
  return n;
}
function Ho(...n) {
  const e = new Uint8Array(n.reduce(((r, i) => r + i.length), 0));
  let t = 0;
  return n.forEach(((r) => {
    if (!Al(r)) throw new Error("Uint8Array expected");
    e.set(r, t), t += r.length;
  })), e;
}
class Pd {
  clone() {
    return this._cloneInto();
  }
}
function zd(n) {
  const e = (r) => n().update(Hi(r)).digest(), t = n();
  return e.outputLen = t.outputLen, e.blockLen = t.blockLen, e.create = () => n(), e;
}
function Hd(n = 32) {
  if (Fa && typeof Fa.getRandomValues == "function") return Fa.getRandomValues(new Uint8Array(n));
  throw new Error("crypto.getRandomValues must be defined");
}
function Va(n) {
  if (!Number.isSafeInteger(n) || n < 0) throw new Error(`Wrong positive integer: ${n}`);
}
function Kc(n, ...e) {
  if (!(n instanceof Uint8Array)) throw new Error("Expected Uint8Array");
  if (e.length > 0 && !e.includes(n.length)) throw new Error(`Expected Uint8Array of length ${e}, not of length=${n.length}`);
}
const Dg = { number: Va, bool: function(n) {
  if (typeof n != "boolean") throw new Error(`Expected boolean, not ${n}`);
}, bytes: Kc, hash: function(n) {
  if (typeof n != "function" || typeof n.create != "function") throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Va(n.outputLen), Va(n.blockLen);
}, exists: function(n, e = !0) {
  if (n.destroyed) throw new Error("Hash instance has been destroyed");
  if (e && n.finished) throw new Error("Hash#digest() has already been called");
}, output: function(n, e) {
  Kc(n);
  const t = e.outputLen;
  if (n.length < t) throw new Error(`digestInto() expects output buffer of length at least ${t}`);
} }, Ir = Dg;
class Og extends Pd {
  constructor(e, t, r, i) {
    super(), this.blockLen = e, this.outputLen = t, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Za(this.buffer);
  }
  update(e) {
    Ir.exists(this);
    const { view: t, buffer: r, blockLen: i } = this, a = (e = Hi(e)).length;
    for (let c = 0; c < a; ) {
      const d = Math.min(i - this.pos, a - c);
      if (d !== i) r.set(e.subarray(c, c + d), this.pos), this.pos += d, c += d, this.pos === i && (this.process(t, 0), this.pos = 0);
      else {
        const h = Za(e);
        for (; i <= a - c; c += i) this.process(h, c);
      }
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Ir.exists(this), Ir.output(e, this), this.finished = !0;
    const { buffer: t, view: r, blockLen: i, isLE: a } = this;
    let { pos: c } = this;
    t[c++] = 128, this.buffer.subarray(c).fill(0), this.padOffset > i - c && (this.process(r, 0), c = 0);
    for (let m = c; m < i; m++) t[m] = 0;
    (function(m, v, D, C) {
      if (typeof m.setBigUint64 == "function") return m.setBigUint64(v, D, C);
      const E = BigInt(32), N = BigInt(4294967295), V = Number(D >> E & N), H = Number(D & N), re = C ? 4 : 0, de = C ? 0 : 4;
      m.setUint32(v + re, V, C), m.setUint32(v + de, H, C);
    })(r, i - 8, BigInt(8 * this.length), a), this.process(r, 0);
    const d = Za(e), h = this.outputLen;
    if (h % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
    const g = h / 4, b = this.get();
    if (g > b.length) throw new Error("_sha2: outputLen bigger than state");
    for (let m = 0; m < g; m++) d.setUint32(4 * m, b[m], a);
  }
  digest() {
    const { buffer: e, outputLen: t } = this;
    this.digestInto(e);
    const r = e.slice(0, t);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: t, buffer: r, length: i, finished: a, destroyed: c, pos: d } = this;
    return e.length = i, e.pos = d, e.finished = a, e.destroyed = c, i % t && e.buffer.set(r), e;
  }
}
const Ng = (n, e, t) => n & e ^ n & t ^ e & t, Mg = new Uint32Array([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]), ss = new Uint32Array([1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225]), is = new Uint32Array(64);
class qd extends Og {
  constructor() {
    super(64, 32, 8, !1), this.A = 0 | ss[0], this.B = 0 | ss[1], this.C = 0 | ss[2], this.D = 0 | ss[3], this.E = 0 | ss[4], this.F = 0 | ss[5], this.G = 0 | ss[6], this.H = 0 | ss[7];
  }
  get() {
    const { A: e, B: t, C: r, D: i, E: a, F: c, G: d, H: h } = this;
    return [e, t, r, i, a, c, d, h];
  }
  set(e, t, r, i, a, c, d, h) {
    this.A = 0 | e, this.B = 0 | t, this.C = 0 | r, this.D = 0 | i, this.E = 0 | a, this.F = 0 | c, this.G = 0 | d, this.H = 0 | h;
  }
  process(e, t) {
    for (let v = 0; v < 16; v++, t += 4) is[v] = e.getUint32(t, !1);
    for (let v = 16; v < 64; v++) {
      const D = is[v - 15], C = is[v - 2], E = _r(D, 7) ^ _r(D, 18) ^ D >>> 3, N = _r(C, 17) ^ _r(C, 19) ^ C >>> 10;
      is[v] = N + is[v - 7] + E + is[v - 16] | 0;
    }
    let { A: r, B: i, C: a, D: c, E: d, F: h, G: g, H: b } = this;
    for (let v = 0; v < 64; v++) {
      const D = b + (_r(d, 6) ^ _r(d, 11) ^ _r(d, 25)) + ((m = d) & h ^ ~m & g) + Mg[v] + is[v] | 0, C = (_r(r, 2) ^ _r(r, 13) ^ _r(r, 22)) + Ng(r, i, a) | 0;
      b = g, g = h, h = d, d = c + D | 0, c = a, a = i, i = r, r = D + C | 0;
    }
    var m;
    r = r + this.A | 0, i = i + this.B | 0, a = a + this.C | 0, c = c + this.D | 0, d = d + this.E | 0, h = h + this.F | 0, g = g + this.G | 0, b = b + this.H | 0, this.set(r, i, a, c, d, h, g, b);
  }
  roundClean() {
    is.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class Rg extends qd {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const Bs = zd((() => new qd()));
zd((() => new Rg()));
function oi(n) {
  if (!Number.isSafeInteger(n)) throw new Error(`Wrong integer: ${n}`);
}
function Fr(...n) {
  const e = (i, a) => (c) => i(a(c)), t = Array.from(n).reverse().reduce(((i, a) => i ? e(i, a.encode) : a.encode), void 0), r = n.reduce(((i, a) => i ? e(i, a.decode) : a.decode), void 0);
  return { encode: t, decode: r };
}
function Zr(n) {
  return { encode: (e) => {
    if (!Array.isArray(e) || e.length && typeof e[0] != "number") throw new Error("alphabet.encode input should be an array of numbers");
    return e.map(((t) => {
      if (oi(t), t < 0 || t >= n.length) throw new Error(`Digit index outside alphabet: ${t} (alphabet: ${n.length})`);
      return n[t];
    }));
  }, decode: (e) => {
    if (!Array.isArray(e) || e.length && typeof e[0] != "string") throw new Error("alphabet.decode input should be array of strings");
    return e.map(((t) => {
      if (typeof t != "string") throw new Error(`alphabet.decode: not string element=${t}`);
      const r = n.indexOf(t);
      if (r === -1) throw new Error(`Unknown letter: "${t}". Allowed: ${n}`);
      return r;
    }));
  } };
}
function Vr(n = "") {
  if (typeof n != "string") throw new Error("join separator should be string");
  return { encode: (e) => {
    if (!Array.isArray(e) || e.length && typeof e[0] != "string") throw new Error("join.encode input should be array of strings");
    for (let t of e) if (typeof t != "string") throw new Error(`join.encode: non-string input=${t}`);
    return e.join(n);
  }, decode: (e) => {
    if (typeof e != "string") throw new Error("join.decode input should be string");
    return e.split(n);
  } };
}
function Do(n, e = "=") {
  if (oi(n), typeof e != "string") throw new Error("padding chr should be string");
  return { encode(t) {
    if (!Array.isArray(t) || t.length && typeof t[0] != "string") throw new Error("padding.encode input should be array of strings");
    for (let r of t) if (typeof r != "string") throw new Error(`padding.encode: non-string input=${r}`);
    for (; t.length * n % 8; ) t.push(e);
    return t;
  }, decode(t) {
    if (!Array.isArray(t) || t.length && typeof t[0] != "string") throw new Error("padding.encode input should be array of strings");
    for (let i of t) if (typeof i != "string") throw new Error(`padding.decode: non-string input=${i}`);
    let r = t.length;
    if (r * n % 8) throw new Error("Invalid padding: string should have whole number of bytes");
    for (; r > 0 && t[r - 1] === e; r--) if (!((r - 1) * n % 8)) throw new Error("Invalid padding: string has too much padding");
    return t.slice(0, r);
  } };
}
function jd(n) {
  if (typeof n != "function") throw new Error("normalize fn should be function");
  return { encode: (e) => e, decode: (e) => n(e) };
}
function Qc(n, e, t) {
  if (e < 2) throw new Error(`convertRadix: wrong from=${e}, base cannot be less than 2`);
  if (t < 2) throw new Error(`convertRadix: wrong to=${t}, base cannot be less than 2`);
  if (!Array.isArray(n)) throw new Error("convertRadix: data should be array");
  if (!n.length) return [];
  let r = 0;
  const i = [], a = Array.from(n);
  for (a.forEach(((c) => {
    if (oi(c), c < 0 || c >= e) throw new Error(`Wrong integer: ${c}`);
  })); ; ) {
    let c = 0, d = !0;
    for (let h = r; h < a.length; h++) {
      const g = a[h], b = e * c + g;
      if (!Number.isSafeInteger(b) || e * c / e !== c || b - g != e * c) throw new Error("convertRadix: carry overflow");
      if (c = b % t, a[h] = Math.floor(b / t), !Number.isSafeInteger(a[h]) || a[h] * t + c !== b) throw new Error("convertRadix: carry overflow");
      d && (a[h] ? d = !1 : r = h);
    }
    if (i.push(c), d) break;
  }
  for (let c = 0; c < n.length - 1 && n[c] === 0; c++) i.push(0);
  return i.reverse();
}
const Fd = (n, e) => e ? Fd(e, n % e) : n, Oo = (n, e) => n + (e - Fd(n, e));
function dl(n, e, t, r) {
  if (!Array.isArray(n)) throw new Error("convertRadix2: data should be array");
  if (e <= 0 || e > 32) throw new Error(`convertRadix2: wrong from=${e}`);
  if (t <= 0 || t > 32) throw new Error(`convertRadix2: wrong to=${t}`);
  if (Oo(e, t) > 32) throw new Error(`convertRadix2: carry overflow from=${e} to=${t} carryBits=${Oo(e, t)}`);
  let i = 0, a = 0;
  const c = 2 ** t - 1, d = [];
  for (const h of n) {
    if (oi(h), h >= 2 ** e) throw new Error(`convertRadix2: invalid data word=${h} from=${e}`);
    if (i = i << e | h, a + e > 32) throw new Error(`convertRadix2: carry overflow pos=${a} from=${e}`);
    for (a += e; a >= t; a -= t) d.push((i >> a - t & c) >>> 0);
    i &= 2 ** a - 1;
  }
  if (i = i << t - a & c, !r && a >= e) throw new Error("Excess padding");
  if (!r && i) throw new Error(`Non-zero padding: ${i}`);
  return r && a > 0 && d.push(i >>> 0), d;
}
function Bg(n) {
  return oi(n), { encode: (e) => {
    if (!(e instanceof Uint8Array)) throw new Error("radix.encode input should be Uint8Array");
    return Qc(Array.from(e), 256, n);
  }, decode: (e) => {
    if (!Array.isArray(e) || e.length && typeof e[0] != "number") throw new Error("radix.decode input should be array of strings");
    return Uint8Array.from(Qc(e, n, 256));
  } };
}
function hs(n, e = !1) {
  if (oi(n), n <= 0 || n > 32) throw new Error("radix2: bits should be in (0..32]");
  if (Oo(8, n) > 32 || Oo(n, 8) > 32) throw new Error("radix2: carry overflow");
  return { encode: (t) => {
    if (!(t instanceof Uint8Array)) throw new Error("radix2.encode input should be Uint8Array");
    return dl(Array.from(t), 8, n, !e);
  }, decode: (t) => {
    if (!Array.isArray(t) || t.length && typeof t[0] != "number") throw new Error("radix2.decode input should be array of strings");
    return Uint8Array.from(dl(t, n, 8, e));
  } };
}
function Yc(n) {
  if (typeof n != "function") throw new Error("unsafeWrapper fn should be function");
  return function(...e) {
    try {
      return n.apply(null, e);
    } catch {
    }
  };
}
Fr(hs(4), Zr("0123456789ABCDEF"), Vr(""));
Fr(hs(5), Zr("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), Do(5), Vr(""));
const fs = (Fr(hs(5), Zr("0123456789ABCDEFGHIJKLMNOPQRSTUV"), Do(5), Vr("")), Fr(hs(5), Zr("0123456789ABCDEFGHJKMNPQRSTVWXYZ"), Vr(""), jd(((n) => n.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1")))), Fr(hs(6), Zr("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), Do(6), Vr("")));
Fr(hs(6), Zr("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), Do(6), Vr(""));
const ul = (n) => Fr(Bg(58), Zr(n), Vr(""));
ul("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz");
ul("123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"), ul("rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz");
const hl = Fr(Zr("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), Vr("")), Xc = [996825010, 642813549, 513874426, 1027748829, 705979059];
function Li(n) {
  const e = n >> 25;
  let t = (33554431 & n) << 5;
  for (let r = 0; r < Xc.length; r++) (e >> r & 1) == 1 && (t ^= Xc[r]);
  return t;
}
function Jc(n, e, t = 1) {
  const r = n.length;
  let i = 1;
  for (let a = 0; a < r; a++) {
    const c = n.charCodeAt(a);
    if (c < 33 || c > 126) throw new Error(`Invalid prefix (${n})`);
    i = Li(i) ^ c >> 5;
  }
  i = Li(i);
  for (let a = 0; a < r; a++) i = Li(i) ^ 31 & n.charCodeAt(a);
  for (let a of e) i = Li(i) ^ a;
  for (let a = 0; a < 6; a++) i = Li(i);
  return i ^= t, hl.encode(dl([i % 2 ** 30], 30, 5, !1));
}
function Zd(n) {
  const e = n === "bech32" ? 1 : 734539939, t = hs(5), r = t.decode, i = t.encode, a = Yc(r);
  function c(d, h = 90) {
    if (typeof d != "string") throw new Error("bech32.decode input should be string, not " + typeof d);
    if (d.length < 8 || h !== !1 && d.length > h) throw new TypeError(`Wrong string length: ${d.length} (${d}). Expected (8..${h})`);
    const g = d.toLowerCase();
    if (d !== g && d !== d.toUpperCase()) throw new Error("String must be lowercase or uppercase");
    const b = (d = g).lastIndexOf("1");
    if (b === 0 || b === -1) throw new Error('Letter "1" must be present between prefix and data only');
    const m = d.slice(0, b), v = d.slice(b + 1);
    if (v.length < 6) throw new Error("Data must be at least 6 characters long");
    const D = hl.decode(v).slice(0, -6), C = Jc(m, D, e);
    if (!v.endsWith(C)) throw new Error(`Invalid checksum in ${d}: expected "${C}"`);
    return { prefix: m, words: D };
  }
  return { encode: function(d, h, g = 90) {
    if (typeof d != "string") throw new Error("bech32.encode prefix should be string, not " + typeof d);
    if (!Array.isArray(h) || h.length && typeof h[0] != "number") throw new Error("bech32.encode words should be array of numbers, not " + typeof h);
    const b = d.length + 7 + h.length;
    if (g !== !1 && b > g) throw new TypeError(`Length ${b} exceeds limit ${g}`);
    return `${d = d.toLowerCase()}1${hl.encode(h)}${Jc(d, h, e)}`;
  }, decode: c, decodeToBytes: function(d) {
    const { prefix: h, words: g } = c(d, !1);
    return { prefix: h, words: g, bytes: r(g) };
  }, decodeUnsafe: Yc(c), fromWords: r, fromWordsUnsafe: a, toWords: i };
}
const ni = Zd("bech32");
Zd("bech32m");
Fr(hs(4), Zr("0123456789abcdef"), Vr(""), jd(((n) => {
  if (typeof n != "string" || n.length % 2) throw new TypeError(`hex.decode: expected string, got ${typeof n} with length ${n.length}`);
  return n.toLowerCase();
})));
function Wa(n) {
  if (!Number.isSafeInteger(n) || n < 0) throw new Error(`positive integer expected, not ${n}`);
}
function ed(n) {
  if (typeof n != "boolean") throw new Error(`boolean expected, not ${n}`);
}
function Vd(n) {
  return n instanceof Uint8Array || n != null && typeof n == "object" && n.constructor.name === "Uint8Array";
}
function xt(n, ...e) {
  if (!Vd(n)) throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(n.length)) throw new Error(`Uint8Array expected of length ${e}, not of length=${n.length}`);
}
function ri(n, e = !0) {
  if (n.destroyed) throw new Error("Hash instance has been destroyed");
  if (e && n.finished) throw new Error("Hash#digest() has already been called");
}
function Sl(n, e) {
  xt(n);
  const t = e.outputLen;
  if (n.length < t) throw new Error(`digestInto() expects output buffer of length at least ${t}`);
}
const Cl = (n) => new Uint8Array(n.buffer, n.byteOffset, n.byteLength), ot = (n) => new Uint32Array(n.buffer, n.byteOffset, Math.floor(n.byteLength / 4)), qo = (n) => new DataView(n.buffer, n.byteOffset, n.byteLength);
if (new Uint8Array(new Uint32Array([287454020]).buffer)[0] !== 68) throw new Error("Non little-endian hardware is not supported");
function ps(n) {
  if (typeof n == "string") n = (function(e) {
    if (typeof e != "string") throw new Error("string expected, got " + typeof e);
    return new Uint8Array(new TextEncoder().encode(e));
  })(n);
  else {
    if (!Vd(n)) throw new Error("Uint8Array expected, got " + typeof n);
    n = n.slice();
  }
  return n;
}
function Il(n, e) {
  if (n.length !== e.length) return !1;
  let t = 0;
  for (let r = 0; r < n.length; r++) t |= n[r] ^ e[r];
  return t === 0;
}
const ai = (n, e) => (Object.assign(e, n), e);
function fl(n, e, t, r) {
  if (typeof n.setBigUint64 == "function") return n.setBigUint64(e, t, r);
  const i = BigInt(32), a = BigInt(4294967295), c = Number(t >> i & a), d = Number(t & a), h = r ? 4 : 0, g = r ? 0 : 4;
  n.setUint32(e + h, c, r), n.setUint32(e + g, d, r);
}
const Hr = 16, Tl = new Uint8Array(16), Ar = ot(Tl), nr = (n) => (n >>> 0 & 255) << 24 | (n >>> 8 & 255) << 16 | (n >>> 16 & 255) << 8 | n >>> 24 & 255;
class Wd {
  constructor(e, t) {
    this.blockLen = Hr, this.outputLen = Hr, this.s0 = 0, this.s1 = 0, this.s2 = 0, this.s3 = 0, this.finished = !1, xt(e = ps(e), 16);
    const r = qo(e);
    let i = r.getUint32(0, !1), a = r.getUint32(4, !1), c = r.getUint32(8, !1), d = r.getUint32(12, !1);
    const h = [];
    for (let V = 0; V < 128; V++) h.push({ s0: nr(i), s1: nr(a), s2: nr(c), s3: nr(d) }), { s0: i, s1: a, s2: c, s3: d } = { s3: (m = c) << 31 | (v = d) >>> 1, s2: (b = a) << 31 | m >>> 1, s1: (g = i) << 31 | b >>> 1, s0: g >>> 1 ^ 225 << 24 & -(1 & v) };
    var g, b, m, v;
    const D = ((V) => V > 65536 ? 8 : V > 1024 ? 4 : 2)(t || 1024);
    if (![1, 2, 4, 8].includes(D)) throw new Error(`ghash: wrong window size=${D}, should be 2, 4 or 8`);
    this.W = D;
    const C = 128 / D, E = this.windowSize = 2 ** D, N = [];
    for (let V = 0; V < C; V++) for (let H = 0; H < E; H++) {
      let re = 0, de = 0, ee = 0, te = 0;
      for (let q = 0; q < D; q++) {
        if (!(H >>> D - q - 1 & 1)) continue;
        const { s0: K, s1: S, s2: $, s3: A } = h[D * V + q];
        re ^= K, de ^= S, ee ^= $, te ^= A;
      }
      N.push({ s0: re, s1: de, s2: ee, s3: te });
    }
    this.t = N;
  }
  _updateBlock(e, t, r, i) {
    e ^= this.s0, t ^= this.s1, r ^= this.s2, i ^= this.s3;
    const { W: a, t: c, windowSize: d } = this;
    let h = 0, g = 0, b = 0, m = 0;
    const v = (1 << a) - 1;
    let D = 0;
    for (const C of [e, t, r, i]) for (let E = 0; E < 4; E++) {
      const N = C >>> 8 * E & 255;
      for (let V = 8 / a - 1; V >= 0; V--) {
        const H = N >>> a * V & v, { s0: re, s1: de, s2: ee, s3: te } = c[D * d + H];
        h ^= re, g ^= de, b ^= ee, m ^= te, D += 1;
      }
    }
    this.s0 = h, this.s1 = g, this.s2 = b, this.s3 = m;
  }
  update(e) {
    e = ps(e), ri(this);
    const t = ot(e), r = Math.floor(e.length / Hr), i = e.length % Hr;
    for (let a = 0; a < r; a++) this._updateBlock(t[4 * a + 0], t[4 * a + 1], t[4 * a + 2], t[4 * a + 3]);
    return i && (Tl.set(e.subarray(r * Hr)), this._updateBlock(Ar[0], Ar[1], Ar[2], Ar[3]), Ar.fill(0)), this;
  }
  destroy() {
    const { t: e } = this;
    for (const t of e) t.s0 = 0, t.s1 = 0, t.s2 = 0, t.s3 = 0;
  }
  digestInto(e) {
    ri(this), Sl(e, this), this.finished = !0;
    const { s0: t, s1: r, s2: i, s3: a } = this, c = ot(e);
    return c[0] = t, c[1] = r, c[2] = i, c[3] = a, e;
  }
  digest() {
    const e = new Uint8Array(Hr);
    return this.digestInto(e), this.destroy(), e;
  }
}
class Ug extends Wd {
  constructor(e, t) {
    const r = (function(i) {
      i.reverse();
      const a = 1 & i[15];
      let c = 0;
      for (let d = 0; d < i.length; d++) {
        const h = i[d];
        i[d] = h >>> 1 | c, c = (1 & h) << 7;
      }
      return i[0] ^= 225 & -a, i;
    })((e = ps(e)).slice());
    super(r, t), r.fill(0);
  }
  update(e) {
    e = ps(e), ri(this);
    const t = ot(e), r = e.length % Hr, i = Math.floor(e.length / Hr);
    for (let a = 0; a < i; a++) this._updateBlock(nr(t[4 * a + 3]), nr(t[4 * a + 2]), nr(t[4 * a + 1]), nr(t[4 * a + 0]));
    return r && (Tl.set(e.subarray(i * Hr)), this._updateBlock(nr(Ar[3]), nr(Ar[2]), nr(Ar[1]), nr(Ar[0])), Ar.fill(0)), this;
  }
  digestInto(e) {
    ri(this), Sl(e, this), this.finished = !0;
    const { s0: t, s1: r, s2: i, s3: a } = this, c = ot(e);
    return c[0] = t, c[1] = r, c[2] = i, c[3] = a, e.reverse();
  }
}
function Gd(n) {
  const e = (r, i) => n(i, r.length).update(ps(r)).digest(), t = n(new Uint8Array(16), 0);
  return e.outputLen = t.outputLen, e.blockLen = t.blockLen, e.create = (r, i) => n(r, i), e;
}
const td = Gd(((n, e) => new Wd(n, e))), Pg = Gd(((n, e) => new Ug(n, e))), Un = 16, _o = new Uint8Array(Un);
function Ll(n) {
  return n << 1 ^ 283 & -(n >> 7);
}
function Ys(n, e) {
  let t = 0;
  for (; e > 0; e >>= 1) t ^= n & -(1 & e), n = Ll(n);
  return t;
}
const pl = (() => {
  let n = new Uint8Array(256);
  for (let t = 0, r = 1; t < 256; t++, r ^= Ll(r)) n[t] = r;
  const e = new Uint8Array(256);
  e[0] = 99;
  for (let t = 0; t < 255; t++) {
    let r = n[255 - t];
    r |= r << 8, e[n[t]] = 255 & (r ^ r >> 4 ^ r >> 5 ^ r >> 6 ^ r >> 7 ^ 99);
  }
  return e;
})(), zg = pl.map(((n, e) => pl.indexOf(e))), Ga = (n) => n << 8 | n >>> 24;
function Kd(n, e) {
  if (n.length !== 256) throw new Error("Wrong sbox length");
  const t = new Uint32Array(256).map(((g, b) => e(n[b]))), r = t.map(Ga), i = r.map(Ga), a = i.map(Ga), c = new Uint32Array(65536), d = new Uint32Array(65536), h = new Uint16Array(65536);
  for (let g = 0; g < 256; g++) for (let b = 0; b < 256; b++) {
    const m = 256 * g + b;
    c[m] = t[g] ^ r[b], d[m] = i[g] ^ a[b], h[m] = n[g] << 8 | n[b];
  }
  return { sbox: n, sbox2: h, T0: t, T1: r, T2: i, T3: a, T01: c, T23: d };
}
const Dl = Kd(pl, ((n) => Ys(n, 3) << 24 | n << 16 | n << 8 | Ys(n, 2))), Qd = Kd(zg, ((n) => Ys(n, 11) << 24 | Ys(n, 13) << 16 | Ys(n, 9) << 8 | Ys(n, 14))), Hg = (() => {
  const n = new Uint8Array(16);
  for (let e = 0, t = 1; e < 16; e++, t = Ll(t)) n[e] = t;
  return n;
})();
function gs(n) {
  xt(n);
  const e = n.length;
  if (![16, 24, 32].includes(e)) throw new Error(`aes: wrong key size: should be 16, 24 or 32, got: ${e}`);
  const { sbox2: t } = Dl, r = ot(n), i = r.length, a = (h) => Tr(t, h, h, h, h), c = new Uint32Array(e + 28);
  c.set(r);
  for (let h = i; h < c.length; h++) {
    let g = c[h - 1];
    h % i == 0 ? g = a((d = g) << 24 | d >>> 8) ^ Hg[h / i - 1] : i > 6 && h % i == 4 && (g = a(g)), c[h] = c[h - i] ^ g;
  }
  var d;
  return c;
}
function Yd(n) {
  const e = gs(n), t = e.slice(), r = e.length, { sbox2: i } = Dl, { T0: a, T1: c, T2: d, T3: h } = Qd;
  for (let g = 0; g < r; g += 4) for (let b = 0; b < 4; b++) t[g + b] = e[r - g - 4 + b];
  e.fill(0);
  for (let g = 4; g < r - 4; g++) {
    const b = t[g], m = Tr(i, b, b, b, b);
    t[g] = a[255 & m] ^ c[m >>> 8 & 255] ^ d[m >>> 16 & 255] ^ h[m >>> 24];
  }
  return t;
}
function ds(n, e, t, r, i, a) {
  return n[t << 8 & 65280 | r >>> 8 & 255] ^ e[i >>> 8 & 65280 | a >>> 24 & 255];
}
function Tr(n, e, t, r, i) {
  return n[255 & e | 65280 & t] | n[r >>> 16 & 255 | i >>> 16 & 65280] << 16;
}
function rr(n, e, t, r, i) {
  const { sbox2: a, T01: c, T23: d } = Dl;
  let h = 0;
  e ^= n[h++], t ^= n[h++], r ^= n[h++], i ^= n[h++];
  const g = n.length / 4 - 2;
  for (let b = 0; b < g; b++) {
    const m = n[h++] ^ ds(c, d, e, t, r, i), v = n[h++] ^ ds(c, d, t, r, i, e), D = n[h++] ^ ds(c, d, r, i, e, t), C = n[h++] ^ ds(c, d, i, e, t, r);
    e = m, t = v, r = D, i = C;
  }
  return { s0: n[h++] ^ Tr(a, e, t, r, i), s1: n[h++] ^ Tr(a, t, r, i, e), s2: n[h++] ^ Tr(a, r, i, e, t), s3: n[h++] ^ Tr(a, i, e, t, r) };
}
function Xd(n, e, t, r, i) {
  const { sbox2: a, T01: c, T23: d } = Qd;
  let h = 0;
  e ^= n[h++], t ^= n[h++], r ^= n[h++], i ^= n[h++];
  const g = n.length / 4 - 2;
  for (let b = 0; b < g; b++) {
    const m = n[h++] ^ ds(c, d, e, i, r, t), v = n[h++] ^ ds(c, d, t, e, i, r), D = n[h++] ^ ds(c, d, r, t, e, i), C = n[h++] ^ ds(c, d, i, r, t, e);
    e = m, t = v, r = D, i = C;
  }
  return { s0: n[h++] ^ Tr(a, e, i, r, t), s1: n[h++] ^ Tr(a, t, e, i, r), s2: n[h++] ^ Tr(a, r, t, e, i), s3: n[h++] ^ Tr(a, i, r, t, e) };
}
function li(n, e) {
  if (!e) return new Uint8Array(n);
  if (xt(e), e.length < n) throw new Error(`aes: wrong destination length, expected at least ${n}, got: ${e.length}`);
  return e;
}
function qg(n, e, t, r) {
  xt(e, Un), xt(t);
  const i = t.length;
  r = li(i, r);
  const a = e, c = ot(a);
  let { s0: d, s1: h, s2: g, s3: b } = rr(n, c[0], c[1], c[2], c[3]);
  const m = ot(t), v = ot(r);
  for (let C = 0; C + 4 <= m.length; C += 4) {
    v[C + 0] = m[C + 0] ^ d, v[C + 1] = m[C + 1] ^ h, v[C + 2] = m[C + 2] ^ g, v[C + 3] = m[C + 3] ^ b;
    let E = 1;
    for (let N = a.length - 1; N >= 0; N--) E = E + (255 & a[N]) | 0, a[N] = 255 & E, E >>>= 8;
    ({ s0: d, s1: h, s2: g, s3: b } = rr(n, c[0], c[1], c[2], c[3]));
  }
  const D = Un * Math.floor(m.length / 4);
  if (D < i) {
    const C = new Uint32Array([d, h, g, b]), E = Cl(C);
    for (let N = D, V = 0; N < i; N++, V++) r[N] = t[N] ^ E[V];
  }
  return r;
}
function Di(n, e, t, r, i) {
  xt(t, Un), xt(r), i = li(r.length, i);
  const a = t, c = ot(a), d = qo(a), h = ot(r), g = ot(i), b = e ? 0 : 12, m = r.length;
  let v = d.getUint32(b, e), { s0: D, s1: C, s2: E, s3: N } = rr(n, c[0], c[1], c[2], c[3]);
  for (let H = 0; H + 4 <= h.length; H += 4) g[H + 0] = h[H + 0] ^ D, g[H + 1] = h[H + 1] ^ C, g[H + 2] = h[H + 2] ^ E, g[H + 3] = h[H + 3] ^ N, v = v + 1 >>> 0, d.setUint32(b, v, e), { s0: D, s1: C, s2: E, s3: N } = rr(n, c[0], c[1], c[2], c[3]);
  const V = Un * Math.floor(h.length / 4);
  if (V < m) {
    const H = new Uint32Array([D, C, E, N]), re = Cl(H);
    for (let de = V, ee = 0; de < m; de++, ee++) i[de] = r[de] ^ re[ee];
  }
  return i;
}
ai({ blockSize: 16, nonceLength: 16 }, (function(n, e) {
  function t(r, i) {
    const a = gs(n), c = e.slice(), d = qg(a, c, r, i);
    return a.fill(0), c.fill(0), d;
  }
  return xt(n), xt(e, Un), { encrypt: (r, i) => t(r, i), decrypt: (r, i) => t(r, i) };
}));
function Jd(n) {
  if (xt(n), n.length % Un != 0) throw new Error("aes/(cbc-ecb).decrypt ciphertext should consist of blocks with size 16");
}
function eu(n, e, t) {
  let r = n.length;
  const i = r % Un;
  if (!e && i !== 0) throw new Error("aec/(cbc-ecb): unpadded plaintext with disabled padding");
  const a = ot(n);
  if (e) {
    let d = Un - i;
    d || (d = Un), r += d;
  }
  const c = li(r, t);
  return { b: a, o: ot(c), out: c };
}
function tu(n, e) {
  if (!e) return n;
  const t = n.length;
  if (!t) throw new Error("aes/pcks5: empty ciphertext not allowed");
  const r = n[t - 1];
  if (r <= 0 || r > 16) throw new Error(`aes/pcks5: wrong padding byte: ${r}`);
  const i = n.subarray(0, -r);
  for (let a = 0; a < r; a++) if (n[t - a - 1] !== r) throw new Error("aes/pcks5: wrong padding");
  return i;
}
function nu(n) {
  const e = new Uint8Array(16), t = ot(e);
  e.set(n);
  const r = Un - n.length;
  for (let i = Un - r; i < Un; i++) e[i] = r;
  return t;
}
ai({ blockSize: 16 }, (function(n, e = {}) {
  xt(n);
  const t = !e.disablePadding;
  return { encrypt: (r, i) => {
    xt(r);
    const { b: a, o: c, out: d } = eu(r, t, i), h = gs(n);
    let g = 0;
    for (; g + 4 <= a.length; ) {
      const { s0: b, s1: m, s2: v, s3: D } = rr(h, a[g + 0], a[g + 1], a[g + 2], a[g + 3]);
      c[g++] = b, c[g++] = m, c[g++] = v, c[g++] = D;
    }
    if (t) {
      const b = nu(r.subarray(4 * g)), { s0: m, s1: v, s2: D, s3: C } = rr(h, b[0], b[1], b[2], b[3]);
      c[g++] = m, c[g++] = v, c[g++] = D, c[g++] = C;
    }
    return h.fill(0), d;
  }, decrypt: (r, i) => {
    Jd(r);
    const a = Yd(n), c = li(r.length, i), d = ot(r), h = ot(c);
    for (let g = 0; g + 4 <= d.length; ) {
      const { s0: b, s1: m, s2: v, s3: D } = Xd(a, d[g + 0], d[g + 1], d[g + 2], d[g + 3]);
      h[g++] = b, h[g++] = m, h[g++] = v, h[g++] = D;
    }
    return a.fill(0), tu(c, t);
  } };
}));
const ru = ai({ blockSize: 16, nonceLength: 16 }, (function(n, e, t = {}) {
  xt(n), xt(e, 16);
  const r = !t.disablePadding;
  return { encrypt: (i, a) => {
    const c = gs(n), { b: d, o: h, out: g } = eu(i, r, a), b = ot(e);
    let m = b[0], v = b[1], D = b[2], C = b[3], E = 0;
    for (; E + 4 <= d.length; ) m ^= d[E + 0], v ^= d[E + 1], D ^= d[E + 2], C ^= d[E + 3], { s0: m, s1: v, s2: D, s3: C } = rr(c, m, v, D, C), h[E++] = m, h[E++] = v, h[E++] = D, h[E++] = C;
    if (r) {
      const N = nu(i.subarray(4 * E));
      m ^= N[0], v ^= N[1], D ^= N[2], C ^= N[3], { s0: m, s1: v, s2: D, s3: C } = rr(c, m, v, D, C), h[E++] = m, h[E++] = v, h[E++] = D, h[E++] = C;
    }
    return c.fill(0), g;
  }, decrypt: (i, a) => {
    Jd(i);
    const c = Yd(n), d = ot(e), h = li(i.length, a), g = ot(i), b = ot(h);
    let m = d[0], v = d[1], D = d[2], C = d[3];
    for (let E = 0; E + 4 <= g.length; ) {
      const N = m, V = v, H = D, re = C;
      m = g[E + 0], v = g[E + 1], D = g[E + 2], C = g[E + 3];
      const { s0: de, s1: ee, s2: te, s3: q } = Xd(c, m, v, D, C);
      b[E++] = de ^ N, b[E++] = ee ^ V, b[E++] = te ^ H, b[E++] = q ^ re;
    }
    return c.fill(0), tu(h, r);
  } };
}));
ai({ blockSize: 16, nonceLength: 16 }, (function(n, e) {
  function t(r, i, a) {
    const c = gs(n), d = r.length;
    a = li(d, a);
    const h = ot(r), g = ot(a), b = i ? g : h, m = ot(e);
    let v = m[0], D = m[1], C = m[2], E = m[3];
    for (let V = 0; V + 4 <= h.length; ) {
      const { s0: H, s1: re, s2: de, s3: ee } = rr(c, v, D, C, E);
      g[V + 0] = h[V + 0] ^ H, g[V + 1] = h[V + 1] ^ re, g[V + 2] = h[V + 2] ^ de, g[V + 3] = h[V + 3] ^ ee, v = b[V++], D = b[V++], C = b[V++], E = b[V++];
    }
    const N = Un * Math.floor(h.length / 4);
    if (N < d) {
      ({ s0: v, s1: D, s2: C, s3: E } = rr(c, v, D, C, E));
      const V = Cl(new Uint32Array([v, D, C, E]));
      for (let H = N, re = 0; H < d; H++, re++) a[H] = r[H] ^ V[re];
      V.fill(0);
    }
    return c.fill(0), a;
  }
  return xt(n), xt(e, 16), { encrypt: (r, i) => t(r, !0, i), decrypt: (r, i) => t(r, !1, i) };
}));
function su(n, e, t, r, i) {
  const a = n.create(t, r.length + (i?.length || 0));
  i && a.update(i), a.update(r);
  const c = new Uint8Array(16), d = qo(c);
  return i && fl(d, 0, BigInt(8 * i.length), e), fl(d, 8, BigInt(8 * r.length), e), a.update(c), a.digest();
}
ai({ blockSize: 16, nonceLength: 12, tagLength: 16 }, (function(n, e, t) {
  if (xt(e), e.length === 0) throw new Error("aes/gcm: empty nonce");
  const r = 16;
  function i(c, d, h) {
    const g = su(td, !1, c, h, t);
    for (let b = 0; b < d.length; b++) g[b] ^= d[b];
    return g;
  }
  function a() {
    const c = gs(n), d = _o.slice(), h = _o.slice();
    if (Di(c, !1, h, h, d), e.length === 12) h.set(e);
    else {
      const g = _o.slice();
      fl(qo(g), 8, BigInt(8 * e.length), !1), td.create(d).update(e).update(g).digestInto(h);
    }
    return { xk: c, authKey: d, counter: h, tagMask: Di(c, !1, h, _o) };
  }
  return { encrypt: (c) => {
    xt(c);
    const { xk: d, authKey: h, counter: g, tagMask: b } = a(), m = new Uint8Array(c.length + r);
    Di(d, !1, g, c, m);
    const v = i(h, b, m.subarray(0, m.length - r));
    return m.set(v, c.length), d.fill(0), m;
  }, decrypt: (c) => {
    if (xt(c), c.length < r) throw new Error("aes/gcm: ciphertext less than tagLen (16)");
    const { xk: d, authKey: h, counter: g, tagMask: b } = a(), m = c.subarray(0, -16), v = c.subarray(-16);
    if (!Il(i(h, b, m), v)) throw new Error("aes/gcm: invalid ghash tag");
    const D = Di(d, !1, g, m);
    return h.fill(0), b.fill(0), d.fill(0), D;
  } };
}));
const Eo = (n, e, t) => (r) => {
  if (!Number.isSafeInteger(r) || e > r || r > t) throw new Error(`${n}: invalid value=${r}, must be [${e}..${t}]`);
};
ai({ blockSize: 16, nonceLength: 12, tagLength: 16 }, (function(n, e, t) {
  const r = Eo("AAD", 0, 68719476736), i = Eo("plaintext", 0, 2 ** 36), a = Eo("nonce", 12, 12), c = Eo("ciphertext", 16, 2 ** 36 + 16);
  function d() {
    const b = n.length;
    if (b !== 16 && b !== 24 && b !== 32) throw new Error(`key length must be 16, 24 or 32 bytes, got: ${b} bytes`);
    const m = gs(n), v = new Uint8Array(b), D = new Uint8Array(16), C = ot(e);
    let E = 0, N = C[0], V = C[1], H = C[2], re = 0;
    for (const de of [D, v].map(ot)) {
      const ee = ot(de);
      for (let te = 0; te < ee.length; te += 2) {
        const { s0: q, s1: K } = rr(m, E, N, V, H);
        ee[te + 0] = q, ee[te + 1] = K, E = ++re;
      }
    }
    return m.fill(0), { authKey: D, encKey: gs(v) };
  }
  function h(b, m, v) {
    const D = su(Pg, !0, m, v, t);
    for (let re = 0; re < 12; re++) D[re] ^= e[re];
    D[15] &= 127;
    const C = ot(D);
    let E = C[0], N = C[1], V = C[2], H = C[3];
    return { s0: E, s1: N, s2: V, s3: H } = rr(b, E, N, V, H), C[0] = E, C[1] = N, C[2] = V, C[3] = H, D;
  }
  function g(b, m, v) {
    let D = m.slice();
    return D[15] |= 128, Di(b, !0, D, v);
  }
  return xt(e), a(e.length), t && (xt(t), r(t.length)), { encrypt: (b) => {
    xt(b), i(b.length);
    const { encKey: m, authKey: v } = d(), D = h(m, v, b), C = new Uint8Array(b.length + 16);
    return C.set(D, b.length), C.set(g(m, D, b)), m.fill(0), v.fill(0), C;
  }, decrypt: (b) => {
    xt(b), c(b.length);
    const m = b.subarray(-16), { encKey: v, authKey: D } = d(), C = g(v, m, b.subarray(0, -16)), E = h(v, D, C);
    if (v.fill(0), D.fill(0), !Il(m, E)) throw new Error("invalid polyval tag");
    return C;
  } };
}));
const gn = (n, e) => 255 & n[e++] | (255 & n[e++]) << 8;
class jg {
  constructor(e) {
    this.blockLen = 16, this.outputLen = 16, this.buffer = new Uint8Array(16), this.r = new Uint16Array(10), this.h = new Uint16Array(10), this.pad = new Uint16Array(8), this.pos = 0, this.finished = !1, xt(e = ps(e), 32);
    const t = gn(e, 0), r = gn(e, 2), i = gn(e, 4), a = gn(e, 6), c = gn(e, 8), d = gn(e, 10), h = gn(e, 12), g = gn(e, 14);
    this.r[0] = 8191 & t, this.r[1] = 8191 & (t >>> 13 | r << 3), this.r[2] = 7939 & (r >>> 10 | i << 6), this.r[3] = 8191 & (i >>> 7 | a << 9), this.r[4] = 255 & (a >>> 4 | c << 12), this.r[5] = c >>> 1 & 8190, this.r[6] = 8191 & (c >>> 14 | d << 2), this.r[7] = 8065 & (d >>> 11 | h << 5), this.r[8] = 8191 & (h >>> 8 | g << 8), this.r[9] = g >>> 5 & 127;
    for (let b = 0; b < 8; b++) this.pad[b] = gn(e, 16 + 2 * b);
  }
  process(e, t, r = !1) {
    const i = r ? 0 : 2048, { h: a, r: c } = this, d = c[0], h = c[1], g = c[2], b = c[3], m = c[4], v = c[5], D = c[6], C = c[7], E = c[8], N = c[9], V = gn(e, t + 0), H = gn(e, t + 2), re = gn(e, t + 4), de = gn(e, t + 6), ee = gn(e, t + 8), te = gn(e, t + 10), q = gn(e, t + 12), K = gn(e, t + 14);
    let S = a[0] + (8191 & V), $ = a[1] + (8191 & (V >>> 13 | H << 3)), A = a[2] + (8191 & (H >>> 10 | re << 6)), P = a[3] + (8191 & (re >>> 7 | de << 9)), F = a[4] + (8191 & (de >>> 4 | ee << 12)), Z = a[5] + (ee >>> 1 & 8191), Y = a[6] + (8191 & (ee >>> 14 | te << 2)), se = a[7] + (8191 & (te >>> 11 | q << 5)), pe = a[8] + (8191 & (q >>> 8 | K << 8)), ve = a[9] + (K >>> 5 | i), ce = 0, Ee = ce + S * d + $ * (5 * N) + A * (5 * E) + P * (5 * C) + F * (5 * D);
    ce = Ee >>> 13, Ee &= 8191, Ee += Z * (5 * v) + Y * (5 * m) + se * (5 * b) + pe * (5 * g) + ve * (5 * h), ce += Ee >>> 13, Ee &= 8191;
    let me = ce + S * h + $ * d + A * (5 * N) + P * (5 * E) + F * (5 * C);
    ce = me >>> 13, me &= 8191, me += Z * (5 * D) + Y * (5 * v) + se * (5 * m) + pe * (5 * b) + ve * (5 * g), ce += me >>> 13, me &= 8191;
    let Ce = ce + S * g + $ * h + A * d + P * (5 * N) + F * (5 * E);
    ce = Ce >>> 13, Ce &= 8191, Ce += Z * (5 * C) + Y * (5 * D) + se * (5 * v) + pe * (5 * m) + ve * (5 * b), ce += Ce >>> 13, Ce &= 8191;
    let je = ce + S * b + $ * g + A * h + P * d + F * (5 * N);
    ce = je >>> 13, je &= 8191, je += Z * (5 * E) + Y * (5 * C) + se * (5 * D) + pe * (5 * v) + ve * (5 * m), ce += je >>> 13, je &= 8191;
    let Xe = ce + S * m + $ * b + A * g + P * h + F * d;
    ce = Xe >>> 13, Xe &= 8191, Xe += Z * (5 * N) + Y * (5 * E) + se * (5 * C) + pe * (5 * D) + ve * (5 * v), ce += Xe >>> 13, Xe &= 8191;
    let ke = ce + S * v + $ * m + A * b + P * g + F * h;
    ce = ke >>> 13, ke &= 8191, ke += Z * d + Y * (5 * N) + se * (5 * E) + pe * (5 * C) + ve * (5 * D), ce += ke >>> 13, ke &= 8191;
    let Ge = ce + S * D + $ * v + A * m + P * b + F * g;
    ce = Ge >>> 13, Ge &= 8191, Ge += Z * h + Y * d + se * (5 * N) + pe * (5 * E) + ve * (5 * C), ce += Ge >>> 13, Ge &= 8191;
    let pt = ce + S * C + $ * D + A * v + P * m + F * b;
    ce = pt >>> 13, pt &= 8191, pt += Z * g + Y * h + se * d + pe * (5 * N) + ve * (5 * E), ce += pt >>> 13, pt &= 8191;
    let ae = ce + S * E + $ * C + A * D + P * v + F * m;
    ce = ae >>> 13, ae &= 8191, ae += Z * b + Y * g + se * h + pe * d + ve * (5 * N), ce += ae >>> 13, ae &= 8191;
    let Je = ce + S * N + $ * E + A * C + P * D + F * v;
    ce = Je >>> 13, Je &= 8191, Je += Z * m + Y * b + se * g + pe * h + ve * d, ce += Je >>> 13, Je &= 8191, ce = (ce << 2) + ce | 0, ce = ce + Ee | 0, Ee = 8191 & ce, ce >>>= 13, me += ce, a[0] = Ee, a[1] = me, a[2] = Ce, a[3] = je, a[4] = Xe, a[5] = ke, a[6] = Ge, a[7] = pt, a[8] = ae, a[9] = Je;
  }
  finalize() {
    const { h: e, pad: t } = this, r = new Uint16Array(10);
    let i = e[1] >>> 13;
    e[1] &= 8191;
    for (let d = 2; d < 10; d++) e[d] += i, i = e[d] >>> 13, e[d] &= 8191;
    e[0] += 5 * i, i = e[0] >>> 13, e[0] &= 8191, e[1] += i, i = e[1] >>> 13, e[1] &= 8191, e[2] += i, r[0] = e[0] + 5, i = r[0] >>> 13, r[0] &= 8191;
    for (let d = 1; d < 10; d++) r[d] = e[d] + i, i = r[d] >>> 13, r[d] &= 8191;
    r[9] -= 8192;
    let a = (1 ^ i) - 1;
    for (let d = 0; d < 10; d++) r[d] &= a;
    a = ~a;
    for (let d = 0; d < 10; d++) e[d] = e[d] & a | r[d];
    e[0] = 65535 & (e[0] | e[1] << 13), e[1] = 65535 & (e[1] >>> 3 | e[2] << 10), e[2] = 65535 & (e[2] >>> 6 | e[3] << 7), e[3] = 65535 & (e[3] >>> 9 | e[4] << 4), e[4] = 65535 & (e[4] >>> 12 | e[5] << 1 | e[6] << 14), e[5] = 65535 & (e[6] >>> 2 | e[7] << 11), e[6] = 65535 & (e[7] >>> 5 | e[8] << 8), e[7] = 65535 & (e[8] >>> 8 | e[9] << 5);
    let c = e[0] + t[0];
    e[0] = 65535 & c;
    for (let d = 1; d < 8; d++) c = (e[d] + t[d] | 0) + (c >>> 16) | 0, e[d] = 65535 & c;
  }
  update(e) {
    ri(this);
    const { buffer: t, blockLen: r } = this, i = (e = ps(e)).length;
    for (let a = 0; a < i; ) {
      const c = Math.min(r - this.pos, i - a);
      if (c !== r) t.set(e.subarray(a, a + c), this.pos), this.pos += c, a += c, this.pos === r && (this.process(t, 0, !1), this.pos = 0);
      else for (; r <= i - a; a += r) this.process(e, a);
    }
    return this;
  }
  destroy() {
    this.h.fill(0), this.r.fill(0), this.buffer.fill(0), this.pad.fill(0);
  }
  digestInto(e) {
    ri(this), Sl(e, this), this.finished = !0;
    const { buffer: t, h: r } = this;
    let { pos: i } = this;
    if (i) {
      for (t[i++] = 1; i < 16; i++) t[i] = 0;
      this.process(t, 0, !0);
    }
    this.finalize();
    let a = 0;
    for (let c = 0; c < 8; c++) e[a++] = r[c] >>> 0, e[a++] = r[c] >>> 8;
    return e;
  }
  digest() {
    const { buffer: e, outputLen: t } = this;
    this.digestInto(e);
    const r = e.slice(0, t);
    return this.destroy(), r;
  }
}
(function(n) {
  const e = (r, i) => n(i).update(ps(r)).digest(), t = n(new Uint8Array(32));
  return e.outputLen = t.outputLen, e.blockLen = t.blockLen, e.create = (r) => n(r), e;
})(((n) => new jg(n)));
const iu = (n) => Uint8Array.from(n.split("").map(((e) => e.charCodeAt(0)))), Fg = iu("expand 16-byte k"), Zg = iu("expand 32-byte k"), Vg = ot(Fg), ou = ot(Zg);
ou.slice();
function De(n, e) {
  return n << e | n >>> 32 - e;
}
function Ka(n) {
  return n.byteOffset % 4 == 0;
}
const nd = 2 ** 32 - 1, rd = new Uint32Array();
function au(n, e) {
  const { allowShortKeys: t, extendNonceFn: r, counterLength: i, counterRight: a, rounds: c } = (function(d, h) {
    if (h == null || typeof h != "object") throw new Error("options must be defined");
    return Object.assign(d, h);
  })({ allowShortKeys: !1, counterLength: 8, counterRight: !1, rounds: 20 }, e);
  if (typeof n != "function") throw new Error("core must be a function");
  return Wa(i), Wa(c), ed(a), ed(t), (d, h, g, b, m = 0) => {
    xt(d), xt(h), xt(g);
    const v = g.length;
    if (b || (b = new Uint8Array(v)), xt(b), Wa(m), m < 0 || m >= nd) throw new Error("arx: counter overflow");
    if (b.length < v) throw new Error(`arx: output (${b.length}) is shorter than data (${v})`);
    const D = [];
    let C, E, N = d.length;
    if (N === 32) C = d.slice(), D.push(C), E = ou;
    else {
      if (N !== 16 || !t) throw new Error(`arx: invalid 32-byte key, got length=${N}`);
      C = new Uint8Array(32), C.set(d), C.set(d, 16), E = Vg, D.push(C);
    }
    Ka(h) || (h = h.slice(), D.push(h));
    const V = ot(C);
    if (r) {
      if (h.length !== 24) throw new Error("arx: extended nonce must be 24 bytes");
      r(E, V, ot(h.subarray(0, 16)), V), h = h.subarray(16);
    }
    const H = 16 - i;
    if (H !== h.length) throw new Error(`arx: nonce must be ${H} or 16 bytes`);
    if (H !== 12) {
      const de = new Uint8Array(12);
      de.set(h, a ? 0 : 12 - h.length), h = de, D.push(h);
    }
    const re = ot(h);
    for (!(function(de, ee, te, q, K, S, $, A) {
      const P = K.length, F = new Uint8Array(64), Z = ot(F), Y = Ka(K) && Ka(S), se = Y ? ot(K) : rd, pe = Y ? ot(S) : rd;
      for (let ve = 0; ve < P; $++) {
        if (de(ee, te, q, Z, $, A), $ >= nd) throw new Error("arx: counter overflow");
        const ce = Math.min(64, P - ve);
        if (Y && ce === 64) {
          const Ee = ve / 4;
          if (ve % 4 != 0) throw new Error("arx: invalid block position");
          for (let me, Ce = 0; Ce < 16; Ce++) me = Ee + Ce, pe[me] = se[me] ^ Z[Ce];
          ve += 64;
        } else {
          for (let Ee, me = 0; me < ce; me++) Ee = ve + me, S[Ee] = K[Ee] ^ F[me];
          ve += ce;
        }
      }
    })(n, E, V, re, g, b, m, c); D.length > 0; ) D.pop().fill(0);
    return b;
  };
}
function lu(n, e, t, r, i, a = 20) {
  let c = n[0], d = n[1], h = n[2], g = n[3], b = e[0], m = e[1], v = e[2], D = e[3], C = e[4], E = e[5], N = e[6], V = e[7], H = i, re = t[0], de = t[1], ee = t[2], te = c, q = d, K = h, S = g, $ = b, A = m, P = v, F = D, Z = C, Y = E, se = N, pe = V, ve = H, ce = re, Ee = de, me = ee;
  for (let je = 0; je < a; je += 2) te = te + $ | 0, ve = De(ve ^ te, 16), Z = Z + ve | 0, $ = De($ ^ Z, 12), te = te + $ | 0, ve = De(ve ^ te, 8), Z = Z + ve | 0, $ = De($ ^ Z, 7), q = q + A | 0, ce = De(ce ^ q, 16), Y = Y + ce | 0, A = De(A ^ Y, 12), q = q + A | 0, ce = De(ce ^ q, 8), Y = Y + ce | 0, A = De(A ^ Y, 7), K = K + P | 0, Ee = De(Ee ^ K, 16), se = se + Ee | 0, P = De(P ^ se, 12), K = K + P | 0, Ee = De(Ee ^ K, 8), se = se + Ee | 0, P = De(P ^ se, 7), S = S + F | 0, me = De(me ^ S, 16), pe = pe + me | 0, F = De(F ^ pe, 12), S = S + F | 0, me = De(me ^ S, 8), pe = pe + me | 0, F = De(F ^ pe, 7), te = te + A | 0, me = De(me ^ te, 16), se = se + me | 0, A = De(A ^ se, 12), te = te + A | 0, me = De(me ^ te, 8), se = se + me | 0, A = De(A ^ se, 7), q = q + P | 0, ve = De(ve ^ q, 16), pe = pe + ve | 0, P = De(P ^ pe, 12), q = q + P | 0, ve = De(ve ^ q, 8), pe = pe + ve | 0, P = De(P ^ pe, 7), K = K + F | 0, ce = De(ce ^ K, 16), Z = Z + ce | 0, F = De(F ^ Z, 12), K = K + F | 0, ce = De(ce ^ K, 8), Z = Z + ce | 0, F = De(F ^ Z, 7), S = S + $ | 0, Ee = De(Ee ^ S, 16), Y = Y + Ee | 0, $ = De($ ^ Y, 12), S = S + $ | 0, Ee = De(Ee ^ S, 8), Y = Y + Ee | 0, $ = De($ ^ Y, 7);
  let Ce = 0;
  r[Ce++] = c + te | 0, r[Ce++] = d + q | 0, r[Ce++] = h + K | 0, r[Ce++] = g + S | 0, r[Ce++] = b + $ | 0, r[Ce++] = m + A | 0, r[Ce++] = v + P | 0, r[Ce++] = D + F | 0, r[Ce++] = C + Z | 0, r[Ce++] = E + Y | 0, r[Ce++] = N + se | 0, r[Ce++] = V + pe | 0, r[Ce++] = H + ve | 0, r[Ce++] = re + ce | 0, r[Ce++] = de + Ee | 0, r[Ce++] = ee + me | 0;
}
const cu = au(lu, { counterRight: !1, counterLength: 4, allowShortKeys: !1 });
au(lu, { counterRight: !1, counterLength: 8, extendNonceFn: function(n, e, t, r) {
  let i = n[0], a = n[1], c = n[2], d = n[3], h = e[0], g = e[1], b = e[2], m = e[3], v = e[4], D = e[5], C = e[6], E = e[7], N = t[0], V = t[1], H = t[2], re = t[3];
  for (let ee = 0; ee < 20; ee += 2) i = i + h | 0, N = De(N ^ i, 16), v = v + N | 0, h = De(h ^ v, 12), i = i + h | 0, N = De(N ^ i, 8), v = v + N | 0, h = De(h ^ v, 7), a = a + g | 0, V = De(V ^ a, 16), D = D + V | 0, g = De(g ^ D, 12), a = a + g | 0, V = De(V ^ a, 8), D = D + V | 0, g = De(g ^ D, 7), c = c + b | 0, H = De(H ^ c, 16), C = C + H | 0, b = De(b ^ C, 12), c = c + b | 0, H = De(H ^ c, 8), C = C + H | 0, b = De(b ^ C, 7), d = d + m | 0, re = De(re ^ d, 16), E = E + re | 0, m = De(m ^ E, 12), d = d + m | 0, re = De(re ^ d, 8), E = E + re | 0, m = De(m ^ E, 7), i = i + g | 0, re = De(re ^ i, 16), C = C + re | 0, g = De(g ^ C, 12), i = i + g | 0, re = De(re ^ i, 8), C = C + re | 0, g = De(g ^ C, 7), a = a + b | 0, N = De(N ^ a, 16), E = E + N | 0, b = De(b ^ E, 12), a = a + b | 0, N = De(N ^ a, 8), E = E + N | 0, b = De(b ^ E, 7), c = c + m | 0, V = De(V ^ c, 16), v = v + V | 0, m = De(m ^ v, 12), c = c + m | 0, V = De(V ^ c, 8), v = v + V | 0, m = De(m ^ v, 7), d = d + h | 0, H = De(H ^ d, 16), D = D + H | 0, h = De(h ^ D, 12), d = d + h | 0, H = De(H ^ d, 8), D = D + H | 0, h = De(h ^ D, 7);
  let de = 0;
  r[de++] = i, r[de++] = a, r[de++] = c, r[de++] = d, r[de++] = N, r[de++] = V, r[de++] = H, r[de++] = re;
}, allowShortKeys: !1 });
class du extends Pd {
  constructor(e, t) {
    super(), this.finished = !1, this.destroyed = !1, Ir.hash(e);
    const r = Hi(t);
    if (this.iHash = e.create(), typeof this.iHash.update != "function") throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const i = this.blockLen, a = new Uint8Array(i);
    a.set(r.length > i ? e.create().update(r).digest() : r);
    for (let c = 0; c < a.length; c++) a[c] ^= 54;
    this.iHash.update(a), this.oHash = e.create();
    for (let c = 0; c < a.length; c++) a[c] ^= 106;
    this.oHash.update(a), a.fill(0);
  }
  update(e) {
    return Ir.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Ir.exists(this), Ir.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: t, iHash: r, finished: i, destroyed: a, blockLen: c, outputLen: d } = this;
    return e.finished = i, e.destroyed = a, e.blockLen = c, e.outputLen = d, e.oHash = t._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const jo = (n, e, t) => new du(n, e).update(t).digest();
function Wg(n, e, t) {
  return Ir.hash(n), jo(n, Hi(t), Hi(e));
}
jo.create = (n, e) => new du(n, e);
const Qa = new Uint8Array([0]), sd = new Uint8Array();
function Gg(n, e, t, r = 32) {
  if (Ir.hash(n), Ir.number(r), r > 255 * n.outputLen) throw new Error("Length should be <= 255*HashLen");
  const i = Math.ceil(r / n.outputLen);
  t === void 0 && (t = sd);
  const a = new Uint8Array(i * n.outputLen), c = jo.create(n, e), d = c._cloneInto(), h = new Uint8Array(c.outputLen);
  for (let g = 0; g < i; g++) Qa[0] = g + 1, d.update(g === 0 ? sd : h).update(t).update(Qa).digestInto(h), a.set(h, n.outputLen * g), c._cloneInto(d);
  return c.destroy(), d.destroy(), h.fill(0), Qa.fill(0), a.slice(0, r);
}
var Kg = Object.defineProperty, Ft = (n, e) => {
  for (var t in e) Kg(n, t, { get: e[t], enumerable: !0 });
}, as = Symbol("verified"), Qg = (n) => n instanceof Object;
function Fo(n) {
  if (!Qg(n) || typeof n.kind != "number" || typeof n.content != "string" || typeof n.created_at != "number" || typeof n.pubkey != "string" || !n.pubkey.match(/^[a-f0-9]{64}$/) || !Array.isArray(n.tags)) return !1;
  for (let e = 0; e < n.tags.length; e++) {
    let t = n.tags[e];
    if (!Array.isArray(t)) return !1;
    for (let r = 0; r < t.length; r++) if (typeof t[r] == "object") return !1;
  }
  return !0;
}
function Yg(n) {
  return n.sort(((e, t) => e.created_at !== t.created_at ? t.created_at - e.created_at : e.id.localeCompare(t.id)));
}
var uu = {};
Ft(uu, { Queue: () => fu, QueueNode: () => hu, binarySearch: () => Ol, insertEventIntoAscendingList: () => Jg, insertEventIntoDescendingList: () => Xg, normalizeURL: () => Xs, utf8Decoder: () => jr, utf8Encoder: () => pr });
var jr = new TextDecoder("utf-8"), pr = new TextEncoder();
function Xs(n) {
  n.indexOf("://") === -1 && (n = "wss://" + n);
  let e = new URL(n);
  return e.pathname = e.pathname.replace(/\/+/g, "/"), e.pathname.endsWith("/") && (e.pathname = e.pathname.slice(0, -1)), (e.port === "80" && e.protocol === "ws:" || e.port === "443" && e.protocol === "wss:") && (e.port = ""), e.searchParams.sort(), e.hash = "", e.toString();
}
function Xg(n, e) {
  const [t, r] = Ol(n, ((i) => e.id === i.id ? 0 : e.created_at === i.created_at ? -1 : i.created_at - e.created_at));
  return r || n.splice(t, 0, e), n;
}
function Jg(n, e) {
  const [t, r] = Ol(n, ((i) => e.id === i.id ? 0 : e.created_at === i.created_at ? -1 : e.created_at - i.created_at));
  return r || n.splice(t, 0, e), n;
}
function Ol(n, e) {
  let t = 0, r = n.length - 1;
  for (; t <= r; ) {
    const i = Math.floor((t + r) / 2), a = e(n[i]);
    if (a === 0) return [i, !0];
    a < 0 ? r = i - 1 : t = i + 1;
  }
  return [t, !1];
}
var hu = class {
  value;
  next = null;
  prev = null;
  constructor(n) {
    this.value = n;
  }
}, fu = class {
  first;
  last;
  constructor() {
    this.first = null, this.last = null;
  }
  enqueue(n) {
    const e = new hu(n);
    return this.last ? this.last === this.first ? (this.last = e, this.last.prev = this.first, this.first.next = e) : (e.prev = this.last, this.last.next = e, this.last = e) : (this.first = e, this.last = e), !0;
  }
  dequeue() {
    if (!this.first) return null;
    if (this.first === this.last) {
      const e = this.first;
      return this.first = null, this.last = null, e.value;
    }
    const n = this.first;
    return this.first = n.next, n.value;
  }
};
function pu(n) {
  if (!Fo(n)) throw new Error("can't serialize event with wrong or missing properties");
  return JSON.stringify([0, n.pubkey, n.created_at, n.kind, n.tags, n.content]);
}
function Mi(n) {
  return rn(Bs(pr.encode(pu(n))));
}
var Zo = new class {
  generateSecretKey() {
    return kr.utils.randomPrivateKey();
  }
  getPublicKey(n) {
    return rn(kr.getPublicKey(n));
  }
  finalizeEvent(n, e) {
    const t = n;
    return t.pubkey = rn(kr.getPublicKey(e)), t.id = Mi(t), t.sig = rn(kr.sign(Mi(t), e)), t[as] = !0, t;
  }
  verifyEvent(n) {
    if (typeof n[as] == "boolean") return n[as];
    const e = Mi(n);
    if (e !== n.id) return n[as] = !1, !1;
    try {
      const t = kr.verify(n.sig, e, n.pubkey);
      return n[as] = t, t;
    } catch {
      return n[as] = !1, !1;
    }
  }
}(), gu = Zo.generateSecretKey, Nl = Zo.getPublicKey, gr = Zo.finalizeEvent, ci = Zo.verifyEvent, vu = {};
function bu(n) {
  return 1e3 <= n && n < 1e4 || [1, 2, 4, 5, 6, 7, 8, 16, 40, 41, 42, 43, 44].includes(n);
}
function Ml(n) {
  return [0, 3].includes(n) || 1e4 <= n && n < 2e4;
}
function mu(n) {
  return 2e4 <= n && n < 3e4;
}
function Rl(n) {
  return 3e4 <= n && n < 4e4;
}
function e0(n) {
  return bu(n) ? "regular" : Ml(n) ? "replaceable" : mu(n) ? "ephemeral" : Rl(n) ? "parameterized" : "unknown";
}
function t0(n, e) {
  const t = e instanceof Array ? e : [e];
  return Fo(n) && t.includes(n.kind) || !1;
}
Ft(vu, { Application: () => tv, BadgeAward: () => l0, BadgeDefinition: () => G0, BlockedRelaysList: () => D0, BookmarkList: () => I0, Bookmarksets: () => Z0, Calendar: () => lv, CalendarEventRSVP: () => cv, ChannelCreation: () => wu, ChannelHideMessage: () => Eu, ChannelMessage: () => _u, ChannelMetadata: () => xu, ChannelMuteUser: () => $u, ClassifiedListing: () => sv, ClientAuth: () => Au, CommunitiesList: () => T0, CommunityDefinition: () => hv, CommunityPostApproval: () => m0, Contacts: () => i0, CreateOrUpdateProduct: () => Y0, CreateOrUpdateStall: () => Q0, Curationsets: () => V0, Date: () => ov, DirectMessageRelaysList: () => R0, DraftClassifiedListing: () => iv, DraftLong: () => J0, Emojisets: () => ev, EncryptedDirectMessage: () => o0, EventDeletion: () => a0, FileMetadata: () => h0, FileServerPreference: () => B0, Followsets: () => q0, GenericRepost: () => d0, Genericlists: () => j0, GiftWrap: () => ku, HTTPAuth: () => Pl, Handlerinformation: () => uv, Handlerrecommendation: () => dv, Highlights: () => k0, InterestsList: () => N0, Interestsets: () => K0, JobFeedback: () => x0, JobRequest: () => y0, JobResult: () => w0, Label: () => b0, LightningPubRPC: () => P0, LiveChatMessage: () => f0, LiveEvent: () => nv, LongFormArticle: () => X0, Metadata: () => n0, Mutelist: () => A0, NWCWalletInfo: () => U0, NWCWalletRequest: () => Su, NWCWalletResponse: () => z0, NostrConnect: () => H0, OpenTimestamps: () => u0, Pinlist: () => S0, PrivateDirectMessage: () => c0, ProblemTracker: () => p0, ProfileBadges: () => W0, PublicChatsList: () => L0, Reaction: () => Ul, RecommendRelay: () => s0, RelayList: () => C0, Relaysets: () => F0, Report: () => g0, Reporting: () => v0, Repost: () => Bl, Seal: () => yu, SearchRelaysList: () => O0, ShortTextNote: () => r0, Time: () => av, UserEmojiList: () => M0, UserStatuses: () => rv, Zap: () => $0, ZapGoal: () => _0, ZapRequest: () => E0, classifyKind: () => e0, isEphemeralKind: () => mu, isKind: () => t0, isParameterizedReplaceableKind: () => Rl, isRegularKind: () => bu, isReplaceableKind: () => Ml });
var n0 = 0, r0 = 1, s0 = 2, i0 = 3, o0 = 4, a0 = 5, Bl = 6, Ul = 7, l0 = 8, yu = 13, c0 = 14, d0 = 16, wu = 40, xu = 41, _u = 42, Eu = 43, $u = 44, u0 = 1040, ku = 1059, h0 = 1063, f0 = 1311, p0 = 1971, g0 = 1984, v0 = 1984, b0 = 1985, m0 = 4550, y0 = 5999, w0 = 6999, x0 = 7e3, _0 = 9041, E0 = 9734, $0 = 9735, k0 = 9802, A0 = 1e4, S0 = 10001, C0 = 10002, I0 = 10003, T0 = 10004, L0 = 10005, D0 = 10006, O0 = 10007, N0 = 10015, M0 = 10030, R0 = 10050, B0 = 10096, U0 = 13194, P0 = 21e3, Au = 22242, Su = 23194, z0 = 23195, H0 = 24133, Pl = 27235, q0 = 3e4, j0 = 30001, F0 = 30002, Z0 = 30003, V0 = 30004, W0 = 30008, G0 = 30009, K0 = 30015, Q0 = 30017, Y0 = 30018, X0 = 30023, J0 = 30024, ev = 30030, tv = 30078, nv = 30311, rv = 30315, sv = 30402, iv = 30403, ov = 31922, av = 31923, lv = 31924, cv = 31925, dv = 31989, uv = 31990, hv = 34550;
function Cu(n, e) {
  if (n.ids && n.ids.indexOf(e.id) === -1 || n.kinds && n.kinds.indexOf(e.kind) === -1 || n.authors && n.authors.indexOf(e.pubkey) === -1) return !1;
  for (let t in n) if (t[0] === "#") {
    let r = n[`#${t.slice(1)}`];
    if (r && !e.tags.find((([i, a]) => i === t.slice(1) && r.indexOf(a) !== -1))) return !1;
  }
  return !(n.since && e.created_at < n.since) && !(n.until && e.created_at > n.until);
}
function Iu(n, e) {
  for (let t = 0; t < n.length; t++) if (Cu(n[t], e)) return !0;
  return !1;
}
function fv(...n) {
  let e = {};
  for (let t = 0; t < n.length; t++) {
    let r = n[t];
    Object.entries(r).forEach((([i, a]) => {
      if (i === "kinds" || i === "ids" || i === "authors" || i[0] === "#") {
        e[i] = e[i] || [];
        for (let c = 0; c < a.length; c++) {
          let d = a[c];
          e[i].includes(d) || e[i].push(d);
        }
      }
    })), r.limit && (!e.limit || r.limit > e.limit) && (e.limit = r.limit), r.until && (!e.until || r.until > e.until) && (e.until = r.until), r.since && (!e.since || r.since < e.since) && (e.since = r.since);
  }
  return e;
}
function pv(n) {
  if (n.ids && !n.ids.length || n.kinds && !n.kinds.length || n.authors && !n.authors.length) return 0;
  for (const [e, t] of Object.entries(n)) if (e[0] === "#" && Array.isArray(t) && !t.length) return 0;
  return Math.min(Math.max(0, n.limit ?? 1 / 0), n.ids?.length ?? 1 / 0, n.authors?.length && n.kinds?.every(((e) => Ml(e))) ? n.authors.length * n.kinds.length : 1 / 0, n.authors?.length && n.kinds?.every(((e) => Rl(e))) && n["#d"]?.length ? n.authors.length * n.kinds.length * n["#d"].length : 1 / 0);
}
var Tu = {};
function Vo(n, e) {
  let t = e.length + 3, r = n.indexOf(`"${e}":`) + t, i = n.slice(r).indexOf('"') + r + 1;
  return n.slice(i, i + 64);
}
function Lu(n, e) {
  let t = e.length, r = n.indexOf(`"${e}":`) + t + 3, i = n.slice(r), a = Math.min(i.indexOf(","), i.indexOf("}"));
  return parseInt(i.slice(0, a), 10);
}
function Du(n) {
  let e = n.slice(0, 22).indexOf('"EVENT"');
  if (e === -1) return null;
  let t = n.slice(e + 7 + 1).indexOf('"');
  if (t === -1) return null;
  let r = e + 7 + 1 + t, i = n.slice(r + 1, 80).indexOf('"');
  if (i === -1) return null;
  let a = r + 1 + i;
  return n.slice(r + 1, a);
}
function gv(n, e) {
  return e === Vo(n, "id");
}
function vv(n, e) {
  return e === Vo(n, "pubkey");
}
function bv(n, e) {
  return e === Lu(n, "kind");
}
Ft(Tu, { getHex64: () => Vo, getInt: () => Lu, getSubscriptionId: () => Du, matchEventId: () => gv, matchEventKind: () => bv, matchEventPubkey: () => vv });
var Ou = {};
function Nu(n, e) {
  return { kind: Au, created_at: Math.floor(Date.now() / 1e3), tags: [["relay", n], ["challenge", e]], content: "" };
}
async function mv() {
  return new Promise(((n) => {
    const e = new MessageChannel(), t = () => {
      e.port1.removeEventListener("message", t), n();
    };
    e.port1.addEventListener("message", t), e.port2.postMessage(0), e.port1.start();
  }));
}
Ft(Ou, { makeAuthEvent: () => Nu });
var Mu, yv = (n) => (n[as] = !0, !0), zl = class {
  url;
  _connected = !1;
  onclose = null;
  onnotice = (n) => {
  };
  _onauth = null;
  baseEoseTimeout = 4400;
  connectionTimeout = 4400;
  publishTimeout = 4400;
  openSubs = /* @__PURE__ */ new Map();
  connectionTimeoutHandle;
  connectionPromise;
  openCountRequests = /* @__PURE__ */ new Map();
  openEventPublishes = /* @__PURE__ */ new Map();
  ws;
  incomingMessageQueue = new fu();
  queueRunning = !1;
  challenge;
  serial = 0;
  verifyEvent;
  _WebSocket;
  constructor(n, e) {
    this.url = Xs(n), this.verifyEvent = e.verifyEvent, this._WebSocket = e.websocketImplementation || WebSocket;
  }
  static async connect(n, e) {
    const t = new zl(n, e);
    return await t.connect(), t;
  }
  closeAllSubscriptions(n) {
    for (let [e, t] of this.openSubs) t.close(n);
    this.openSubs.clear();
    for (let [e, t] of this.openEventPublishes) t.reject(new Error(n));
    this.openEventPublishes.clear();
    for (let [e, t] of this.openCountRequests) t.reject(new Error(n));
    this.openCountRequests.clear();
  }
  get connected() {
    return this._connected;
  }
  async connect() {
    return this.connectionPromise || (this.challenge = void 0, this.connectionPromise = new Promise(((n, e) => {
      this.connectionTimeoutHandle = setTimeout((() => {
        e("connection timed out"), this.connectionPromise = void 0, this.onclose?.(), this.closeAllSubscriptions("relay connection timed out");
      }), this.connectionTimeout);
      try {
        this.ws = new this._WebSocket(this.url);
      } catch (t) {
        return void e(t);
      }
      this.ws.onopen = () => {
        clearTimeout(this.connectionTimeoutHandle), this._connected = !0, n();
      }, this.ws.onerror = (t) => {
        e(t.message || "websocket error"), this._connected && (this._connected = !1, this.connectionPromise = void 0, this.onclose?.(), this.closeAllSubscriptions("relay connection errored"));
      }, this.ws.onclose = async () => {
        this._connected && (this._connected = !1, this.connectionPromise = void 0, this.onclose?.(), this.closeAllSubscriptions("relay connection closed"));
      }, this.ws.onmessage = this._onmessage.bind(this);
    }))), this.connectionPromise;
  }
  async runQueue() {
    for (this.queueRunning = !0; this.handleNext() !== !1; ) await mv();
    this.queueRunning = !1;
  }
  handleNext() {
    const n = this.incomingMessageQueue.dequeue();
    if (!n) return !1;
    const e = Du(n);
    if (e) {
      const t = this.openSubs.get(e);
      if (!t) return;
      const r = Vo(n, "id"), i = t.alreadyHaveEvent?.(r);
      if (t.receivedEvent?.(this, r), i) return;
    }
    try {
      let t = JSON.parse(n);
      switch (t[0]) {
        case "EVENT": {
          const r = this.openSubs.get(t[1]), i = t[2];
          return void (this.verifyEvent(i) && Iu(r.filters, i) && r.onevent(i));
        }
        case "COUNT": {
          const r = t[1], i = t[2], a = this.openCountRequests.get(r);
          return void (a && (a.resolve(i.count), this.openCountRequests.delete(r)));
        }
        case "EOSE": {
          const r = this.openSubs.get(t[1]);
          return r ? void r.receivedEose() : void 0;
        }
        case "OK": {
          const r = t[1], i = t[2], a = t[3], c = this.openEventPublishes.get(r);
          return void (c && (i ? c.resolve(a) : c.reject(new Error(a)), this.openEventPublishes.delete(r)));
        }
        case "CLOSED": {
          const r = t[1], i = this.openSubs.get(r);
          return i ? (i.closed = !0, void i.close(t[2])) : void 0;
        }
        case "NOTICE":
          return void this.onnotice(t[1]);
        case "AUTH":
          return this.challenge = t[1], void this._onauth?.(t[1]);
      }
    } catch {
      return;
    }
  }
  async send(n) {
    if (!this.connectionPromise) throw new Error("sending on closed connection");
    this.connectionPromise.then((() => {
      this.ws?.send(n);
    }));
  }
  async auth(n) {
    if (!this.challenge) throw new Error("can't perform auth, no challenge was received");
    const e = await n(Nu(this.url, this.challenge)), t = new Promise(((r, i) => {
      this.openEventPublishes.set(e.id, { resolve: r, reject: i });
    }));
    return this.send('["AUTH",' + JSON.stringify(e) + "]"), t;
  }
  async publish(n) {
    const e = new Promise(((t, r) => {
      this.openEventPublishes.set(n.id, { resolve: t, reject: r });
    }));
    return this.send('["EVENT",' + JSON.stringify(n) + "]"), setTimeout((() => {
      const t = this.openEventPublishes.get(n.id);
      t && (t.reject(new Error("publish timed out")), this.openEventPublishes.delete(n.id));
    }), this.publishTimeout), e;
  }
  async count(n, e) {
    this.serial++;
    const t = e?.id || "count:" + this.serial, r = new Promise(((i, a) => {
      this.openCountRequests.set(t, { resolve: i, reject: a });
    }));
    return this.send('["COUNT","' + t + '",' + JSON.stringify(n).substring(1)), r;
  }
  subscribe(n, e) {
    const t = this.prepareSubscription(n, e);
    return t.fire(), t;
  }
  prepareSubscription(n, e) {
    this.serial++;
    const t = e.id || "sub:" + this.serial, r = new wv(this, t, n, e);
    return this.openSubs.set(t, r), r;
  }
  close() {
    this.closeAllSubscriptions("relay connection closed by us"), this._connected = !1, this.ws?.close();
  }
  _onmessage(n) {
    this.incomingMessageQueue.enqueue(n.data), this.queueRunning || this.runQueue();
  }
}, wv = class {
  relay;
  id;
  closed = !1;
  eosed = !1;
  filters;
  alreadyHaveEvent;
  receivedEvent;
  onevent;
  oneose;
  onclose;
  eoseTimeout;
  eoseTimeoutHandle;
  constructor(n, e, t, r) {
    this.relay = n, this.filters = t, this.id = e, this.alreadyHaveEvent = r.alreadyHaveEvent, this.receivedEvent = r.receivedEvent, this.eoseTimeout = r.eoseTimeout || n.baseEoseTimeout, this.oneose = r.oneose, this.onclose = r.onclose, this.onevent = r.onevent || ((i) => {
    });
  }
  fire() {
    this.relay.send('["REQ","' + this.id + '",' + JSON.stringify(this.filters).substring(1)), this.eoseTimeoutHandle = setTimeout(this.receivedEose.bind(this), this.eoseTimeout);
  }
  receivedEose() {
    this.eosed || (clearTimeout(this.eoseTimeoutHandle), this.eosed = !0, this.oneose?.());
  }
  close(n = "closed by caller") {
    !this.closed && this.relay.connected && (this.relay.send('["CLOSE",' + JSON.stringify(this.id) + "]"), this.closed = !0), this.relay.openSubs.delete(this.id), this.onclose?.(n);
  }
};
try {
  Mu = WebSocket;
} catch {
}
var Ru, Bu = class extends zl {
  constructor(n) {
    super(n, { verifyEvent: ci, websocketImplementation: Mu });
  }
  static async connect(n) {
    const e = new Bu(n);
    return await e.connect(), e;
  }
}, xv = class {
  relays = /* @__PURE__ */ new Map();
  seenOn = /* @__PURE__ */ new Map();
  trackRelays = !1;
  verifyEvent;
  trustedRelayURLs = /* @__PURE__ */ new Set();
  _WebSocket;
  constructor(n) {
    this.verifyEvent = n.verifyEvent, this._WebSocket = n.websocketImplementation;
  }
  async ensureRelay(n, e) {
    n = Xs(n);
    let t = this.relays.get(n);
    return t || (t = new zl(n, { verifyEvent: this.trustedRelayURLs.has(n) ? yv : this.verifyEvent, websocketImplementation: this._WebSocket }), e?.connectionTimeout && (t.connectionTimeout = e.connectionTimeout), this.relays.set(n, t)), await t.connect(), t;
  }
  close(n) {
    n.map(Xs).forEach(((e) => {
      this.relays.get(e)?.close();
    }));
  }
  subscribeMany(n, e, t) {
    return this.subscribeManyMap(Object.fromEntries(n.map(((r) => [r, e]))), t);
  }
  subscribeManyMap(n, e) {
    this.trackRelays && (e.receivedEvent = (m, v) => {
      let D = this.seenOn.get(v);
      D || (D = /* @__PURE__ */ new Set(), this.seenOn.set(v, D)), D.add(m);
    });
    const t = /* @__PURE__ */ new Set(), r = [], i = Object.keys(n).length, a = [];
    let c = (m) => {
      a[m] = !0, a.filter(((v) => v)).length === i && (e.oneose?.(), c = () => {
      });
    };
    const d = [];
    let h = (m, v) => {
      c(m), d[m] = v, d.filter(((D) => D)).length === i && (e.onclose?.(d), h = () => {
      });
    };
    const g = (m) => {
      if (e.alreadyHaveEvent?.(m)) return !0;
      const v = t.has(m);
      return t.add(m), v;
    }, b = Promise.all(Object.entries(n).map((async (m, v, D) => {
      if (D.indexOf(m) !== v) return void h(v, "duplicate url");
      let C, [E, N] = m;
      E = Xs(E);
      try {
        C = await this.ensureRelay(E, { connectionTimeout: e.maxWait ? Math.max(0.8 * e.maxWait, e.maxWait - 1e3) : void 0 });
      } catch (H) {
        return void h(v, H?.message || String(H));
      }
      let V = C.subscribe(N, { ...e, oneose: () => c(v), onclose: (H) => h(v, H), alreadyHaveEvent: g, eoseTimeout: e.maxWait });
      r.push(V);
    })));
    return { async close() {
      await b, r.forEach(((m) => {
        m.close();
      }));
    } };
  }
  subscribeManyEose(n, e, t) {
    const r = this.subscribeMany(n, e, { ...t, oneose() {
      r.close();
    } });
    return r;
  }
  async querySync(n, e, t) {
    return new Promise((async (r) => {
      const i = [];
      this.subscribeManyEose(n, [e], { ...t, onevent(a) {
        i.push(a);
      }, onclose(a) {
        r(i);
      } });
    }));
  }
  async get(n, e, t) {
    e.limit = 1;
    const r = await this.querySync(n, e, t);
    return r.sort(((i, a) => a.created_at - i.created_at)), r[0] || null;
  }
  publish(n, e) {
    return n.map(Xs).map((async (t, r, i) => {
      if (i.indexOf(t) !== r) return Promise.reject("duplicate url");
      let a = await this.ensureRelay(t);
      return a.publish(e).then(((c) => {
        if (this.trackRelays) {
          let d = this.seenOn.get(e.id);
          d || (d = /* @__PURE__ */ new Set(), this.seenOn.set(e.id, d)), d.add(a);
        }
        return c;
      }));
    }));
  }
  listConnectionStatus() {
    const n = /* @__PURE__ */ new Map();
    return this.relays.forEach(((e, t) => n.set(t, e.connected))), n;
  }
  destroy() {
    this.relays.forEach(((n) => n.close())), this.relays = /* @__PURE__ */ new Map();
  }
};
try {
  Ru = WebSocket;
} catch {
}
var _v = class extends xv {
  constructor() {
    super({ verifyEvent: ci, websocketImplementation: Ru });
  }
}, Uu = {};
Ft(Uu, { BECH32_REGEX: () => Pu, Bech32MaxSize: () => Hl, NostrTypeGuard: () => Ev, decode: () => Zi, encodeBytes: () => Go, naddrEncode: () => Iv, neventEncode: () => Cv, noteEncode: () => Av, nprofileEncode: () => Sv, npubEncode: () => kv, nsecEncode: () => $v });
var Ev = { isNProfile: (n) => /^nprofile1[a-z\d]+$/.test(n || ""), isNEvent: (n) => /^nevent1[a-z\d]+$/.test(n || ""), isNAddr: (n) => /^naddr1[a-z\d]+$/.test(n || ""), isNSec: (n) => /^nsec1[a-z\d]{58}$/.test(n || ""), isNPub: (n) => /^npub1[a-z\d]{58}$/.test(n || ""), isNote: (n) => /^note1[a-z\d]+$/.test(n || ""), isNcryptsec: (n) => /^ncryptsec1[a-z\d]+$/.test(n || "") }, Hl = 5e3, Pu = /[\x21-\x7E]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/;
function Zi(n) {
  let { prefix: e, words: t } = ni.decode(n, Hl), r = new Uint8Array(ni.fromWords(t));
  switch (e) {
    case "nprofile": {
      let i = Ya(r);
      if (!i[0]?.[0]) throw new Error("missing TLV 0 for nprofile");
      if (i[0][0].length !== 32) throw new Error("TLV 0 should be 32 bytes");
      return { type: "nprofile", data: { pubkey: rn(i[0][0]), relays: i[1] ? i[1].map(((a) => jr.decode(a))) : [] } };
    }
    case "nevent": {
      let i = Ya(r);
      if (!i[0]?.[0]) throw new Error("missing TLV 0 for nevent");
      if (i[0][0].length !== 32) throw new Error("TLV 0 should be 32 bytes");
      if (i[2] && i[2][0].length !== 32) throw new Error("TLV 2 should be 32 bytes");
      if (i[3] && i[3][0].length !== 4) throw new Error("TLV 3 should be 4 bytes");
      return { type: "nevent", data: { id: rn(i[0][0]), relays: i[1] ? i[1].map(((a) => jr.decode(a))) : [], author: i[2]?.[0] ? rn(i[2][0]) : void 0, kind: i[3]?.[0] ? parseInt(rn(i[3][0]), 16) : void 0 } };
    }
    case "naddr": {
      let i = Ya(r);
      if (!i[0]?.[0]) throw new Error("missing TLV 0 for naddr");
      if (!i[2]?.[0]) throw new Error("missing TLV 2 for naddr");
      if (i[2][0].length !== 32) throw new Error("TLV 2 should be 32 bytes");
      if (!i[3]?.[0]) throw new Error("missing TLV 3 for naddr");
      if (i[3][0].length !== 4) throw new Error("TLV 3 should be 4 bytes");
      return { type: "naddr", data: { identifier: jr.decode(i[0][0]), pubkey: rn(i[2][0]), kind: parseInt(rn(i[3][0]), 16), relays: i[1] ? i[1].map(((a) => jr.decode(a))) : [] } };
    }
    case "nsec":
      return { type: e, data: r };
    case "npub":
    case "note":
      return { type: e, data: rn(r) };
    default:
      throw new Error(`unknown prefix ${e}`);
  }
}
function Ya(n) {
  let e = {}, t = n;
  for (; t.length > 0; ) {
    let r = t[0], i = t[1], a = t.slice(2, 2 + i);
    if (t = t.slice(2 + i), a.length < i) throw new Error(`not enough data to read on TLV ${r}`);
    e[r] = e[r] || [], e[r].push(a);
  }
  return e;
}
function $v(n) {
  return Go("nsec", n);
}
function kv(n) {
  return Go("npub", ti(n));
}
function Av(n) {
  return Go("note", ti(n));
}
function Wo(n, e) {
  let t = ni.toWords(e);
  return ni.encode(n, t, Hl);
}
function Go(n, e) {
  return Wo(n, e);
}
function Sv(n) {
  return Wo("nprofile", ql({ 0: [ti(n.pubkey)], 1: (n.relays || []).map(((e) => pr.encode(e))) }));
}
function Cv(n) {
  let e;
  return n.kind !== void 0 && (e = (function(t) {
    const r = new Uint8Array(4);
    return r[0] = t >> 24 & 255, r[1] = t >> 16 & 255, r[2] = t >> 8 & 255, r[3] = 255 & t, r;
  })(n.kind)), Wo("nevent", ql({ 0: [ti(n.id)], 1: (n.relays || []).map(((t) => pr.encode(t))), 2: n.author ? [ti(n.author)] : [], 3: e ? [new Uint8Array(e)] : [] }));
}
function Iv(n) {
  let e = new ArrayBuffer(4);
  return new DataView(e).setUint32(0, n.kind, !1), Wo("naddr", ql({ 0: [pr.encode(n.identifier)], 1: (n.relays || []).map(((t) => pr.encode(t))), 2: [ti(n.pubkey)], 3: [new Uint8Array(e)] }));
}
function ql(n) {
  let e = [];
  return Object.entries(n).reverse().forEach((([t, r]) => {
    r.forEach(((i) => {
      let a = new Uint8Array(i.length + 2);
      a.set([parseInt(t)], 0), a.set([i.length], 1), a.set(i, 2), e.push(a);
    }));
  })), Ho(...e);
}
var Tv = /\bnostr:((note|npub|naddr|nevent|nprofile)1\w+)\b|#\[(\d+)\]/g;
function Lv(n) {
  let e = [];
  for (let t of n.content.matchAll(Tv)) if (t[2]) try {
    let { type: r, data: i } = Zi(t[1]);
    switch (r) {
      case "npub":
        e.push({ text: t[0], profile: { pubkey: i, relays: [] } });
        break;
      case "nprofile":
        e.push({ text: t[0], profile: i });
        break;
      case "note":
        e.push({ text: t[0], event: { id: i, relays: [] } });
        break;
      case "nevent":
        e.push({ text: t[0], event: i });
        break;
      case "naddr":
        e.push({ text: t[0], address: i });
    }
  } catch {
  }
  else if (t[3]) {
    let r = parseInt(t[3], 10), i = n.tags[r];
    if (!i) continue;
    switch (i[0]) {
      case "p":
        e.push({ text: t[0], profile: { pubkey: i[1], relays: i[2] ? [i[2]] : [] } });
        break;
      case "e":
        e.push({ text: t[0], event: { id: i[1], relays: i[2] ? [i[2]] : [] } });
        break;
      case "a":
        try {
          let [a, c, d] = i[1].split(":");
          e.push({ text: t[0], address: { identifier: d, pubkey: c, kind: parseInt(a, 10), relays: i[2] ? [i[2]] : [] } });
        } catch {
        }
    }
  }
  return e;
}
var zu = {};
async function Hu(n, e, t) {
  const r = n instanceof Uint8Array ? rn(n) : n, i = qu(ii.getSharedSecret(r, "02" + e));
  let a = Uint8Array.from(Hd(16)), c = pr.encode(t), d = ru(i, a).encrypt(c);
  return `${fs.encode(new Uint8Array(d))}?iv=${fs.encode(new Uint8Array(a.buffer))}`;
}
async function Dv(n, e, t) {
  const r = n instanceof Uint8Array ? rn(n) : n;
  let [i, a] = t.split("?iv="), c = qu(ii.getSharedSecret(r, "02" + e)), d = fs.decode(a), h = fs.decode(i), g = ru(c, d).decrypt(h);
  return jr.decode(g);
}
function qu(n) {
  return n.slice(1, 33);
}
Ft(zu, { decrypt: () => Dv, encrypt: () => Hu });
var ju = {};
Ft(ju, { NIP05_REGEX: () => jl, isNip05: () => Ov, isValid: () => Rv, queryProfile: () => Fu, searchDomain: () => Mv, useFetchImplementation: () => Nv });
var Ko, jl = /^(?:([\w.+-]+)@)?([\w_-]+(\.[\w_-]+)+)$/, Ov = (n) => jl.test(n || "");
try {
  Ko = fetch;
} catch {
}
function Nv(n) {
  Ko = n;
}
async function Mv(n, e = "") {
  try {
    const t = `https://${n}/.well-known/nostr.json?name=${e}`, r = await Ko(t, { redirect: "manual" });
    if (r.status !== 200) throw Error("Wrong response code");
    return (await r.json()).names;
  } catch {
    return {};
  }
}
async function Fu(n) {
  const e = n.match(jl);
  if (!e) return null;
  const [, t = "_", r] = e;
  try {
    const i = `https://${r}/.well-known/nostr.json?name=${t}`, a = await Ko(i, { redirect: "manual" });
    if (a.status !== 200) throw Error("Wrong response code");
    const c = await a.json(), d = c.names[t];
    return d ? { pubkey: d, relays: c.relays?.[d] } : null;
  } catch {
    return null;
  }
}
async function Rv(n, e) {
  const t = await Fu(e);
  return !!t && t.pubkey === n;
}
var Zu = {};
function Bv(n) {
  const e = { reply: void 0, root: void 0, mentions: [], profiles: [], quotes: [] };
  let t, r;
  for (let i = n.tags.length - 1; i >= 0; i--) {
    const a = n.tags[i];
    if (a[0] === "e" && a[1]) {
      const [c, d, h, g, b] = a, m = { id: d, relays: h ? [h] : [], author: b };
      if (g === "root") {
        e.root = m;
        continue;
      }
      if (g === "reply") {
        e.reply = m;
        continue;
      }
      if (g === "mention") {
        e.mentions.push(m);
        continue;
      }
      t ? r = m : t = m, e.mentions.push(m);
    } else {
      if (a[0] === "q" && a[1]) {
        const [c, d, h] = a;
        e.quotes.push({ id: d, relays: h ? [h] : [] });
      }
      a[0] === "p" && a[1] && e.profiles.push({ pubkey: a[1], relays: a[2] ? [a[2]] : [] });
    }
  }
  return e.root || (e.root = r || t || e.reply), e.reply || (e.reply = t || e.root), [e.reply, e.root].forEach(((i) => {
    if (!i) return;
    let a = e.mentions.indexOf(i);
    if (a !== -1 && e.mentions.splice(a, 1), i.author) {
      let c = e.profiles.find(((d) => d.pubkey === i.author));
      c && c.relays && (i.relays || (i.relays = []), c.relays.forEach(((d) => {
        i.relays?.indexOf(d) === -1 && i.relays.push(d);
      })), c.relays = i.relays);
    }
  })), e.mentions.forEach(((i) => {
    if (i.author) {
      let a = e.profiles.find(((c) => c.pubkey === i.author));
      a && a.relays && (i.relays || (i.relays = []), a.relays.forEach(((c) => {
        i.relays.indexOf(c) === -1 && i.relays.push(c);
      })), a.relays = i.relays);
    }
  })), e;
}
Ft(Zu, { parse: () => Bv });
var Vu = {};
Ft(Vu, { fetchRelayInformation: () => Pv, useFetchImplementation: () => Uv });
function Uv(n) {
}
async function Pv(n) {
  return await (await fetch(n.replace("ws://", "http://").replace("wss://", "https://"), { headers: { Accept: "application/nostr+json" } })).json();
}
var Wu = {};
function Gu(n) {
  let e = 0;
  for (let t = 0; t < 64; t += 8) {
    const r = parseInt(n.substring(t, t + 8), 16);
    if (r !== 0) {
      e += Math.clz32(r);
      break;
    }
    e += 32;
  }
  return e;
}
function zv(n, e) {
  let t = 0;
  const r = n, i = ["nonce", t.toString(), e.toString()];
  for (r.tags.push(i); ; ) {
    const a = Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3);
    if (a !== r.created_at && (t = 0, r.created_at = a), i[1] = (++t).toString(), r.id = Ku(r), Gu(r.id) >= e) break;
  }
  return r;
}
function Ku(n) {
  return rn(Bs(pr.encode(JSON.stringify([0, n.pubkey, n.created_at, n.kind, n.tags, n.content]))));
}
Ft(Wu, { fastEventHash: () => Ku, getPow: () => Gu, minePow: () => zv });
var Qu = {};
function Hv(n, e, t, r) {
  return gr({ kind: Bl, tags: [...n.tags ?? [], ["e", e.id, t], ["p", e.pubkey]], content: n.content === "" ? "" : JSON.stringify(e), created_at: n.created_at }, r);
}
function Yu(n) {
  if (n.kind !== Bl) return;
  let e, t;
  for (let r = n.tags.length - 1; r >= 0 && (e === void 0 || t === void 0); r--) {
    const i = n.tags[r];
    i.length >= 2 && (i[0] === "e" && e === void 0 ? e = i : i[0] === "p" && t === void 0 && (t = i));
  }
  return e !== void 0 ? { id: e[1], relays: [e[2], t?.[2]].filter(((r) => typeof r == "string")), author: t?.[1] } : void 0;
}
function qv(n, { skipVerification: e } = {}) {
  const t = Yu(n);
  if (t === void 0 || n.content === "") return;
  let r;
  try {
    r = JSON.parse(n.content);
  } catch {
    return;
  }
  return r.id === t.id && (e || ci(r)) ? r : void 0;
}
Ft(Qu, { finishRepostEvent: () => Hv, getRepostedEvent: () => qv, getRepostedEventPointer: () => Yu });
var Xu = {};
Ft(Xu, { NOSTR_URI_REGEX: () => Qo, parse: () => Fv, test: () => jv });
var Qo = new RegExp(`nostr:(${Pu.source})`);
function jv(n) {
  return typeof n == "string" && new RegExp(`^${Qo.source}$`).test(n);
}
function Fv(n) {
  const e = n.match(new RegExp(`^${Qo.source}$`));
  if (!e) throw new Error(`Invalid Nostr URI: ${n}`);
  return { uri: e[0], value: e[1], decoded: Zi(e[1]) };
}
var Ju = {};
function Zv(n, e, t) {
  const r = e.tags.filter(((i) => i.length >= 2 && (i[0] === "e" || i[0] === "p")));
  return gr({ ...n, kind: Ul, tags: [...n.tags ?? [], ...r, ["e", e.id], ["p", e.pubkey]], content: n.content ?? "+" }, t);
}
function Vv(n) {
  if (n.kind !== Ul) return;
  let e, t;
  for (let r = n.tags.length - 1; r >= 0 && (e === void 0 || t === void 0); r--) {
    const i = n.tags[r];
    i.length >= 2 && (i[0] === "e" && e === void 0 ? e = i : i[0] === "p" && t === void 0 && (t = i));
  }
  return e !== void 0 && t !== void 0 ? { id: e[1], relays: [e[2], t[2]].filter(((r) => r !== void 0)), author: t[1] } : void 0;
}
Ft(Ju, { finishReactionEvent: () => Zv, getReactedEventPointer: () => Vv });
var eh = {};
Ft(eh, { matchAll: () => Wv, regex: () => Fl, replaceAll: () => Gv });
var Fl = () => new RegExp(`\\b${Qo.source}\\b`, "g");
function* Wv(n) {
  const e = n.matchAll(Fl());
  for (const t of e) try {
    const [r, i] = t;
    yield { uri: r, value: i, decoded: Zi(i), start: t.index, end: t.index + r.length };
  } catch {
  }
}
function Gv(n, e) {
  return n.replaceAll(Fl(), ((t, r) => e({ uri: t, value: r, decoded: Zi(r) })));
}
var th = {};
Ft(th, { channelCreateEvent: () => Kv, channelHideMessageEvent: () => Xv, channelMessageEvent: () => Yv, channelMetadataEvent: () => Qv, channelMuteUserEvent: () => Jv });
var Kv = (n, e) => {
  let t;
  if (typeof n.content == "object") t = JSON.stringify(n.content);
  else {
    if (typeof n.content != "string") return;
    t = n.content;
  }
  return gr({ kind: wu, tags: [...n.tags ?? []], content: t, created_at: n.created_at }, e);
}, Qv = (n, e) => {
  let t;
  if (typeof n.content == "object") t = JSON.stringify(n.content);
  else {
    if (typeof n.content != "string") return;
    t = n.content;
  }
  return gr({ kind: xu, tags: [["e", n.channel_create_event_id], ...n.tags ?? []], content: t, created_at: n.created_at }, e);
}, Yv = (n, e) => {
  const t = [["e", n.channel_create_event_id, n.relay_url, "root"]];
  return n.reply_to_channel_message_event_id && t.push(["e", n.reply_to_channel_message_event_id, n.relay_url, "reply"]), gr({ kind: _u, tags: [...t, ...n.tags ?? []], content: n.content, created_at: n.created_at }, e);
}, Xv = (n, e) => {
  let t;
  if (typeof n.content == "object") t = JSON.stringify(n.content);
  else {
    if (typeof n.content != "string") return;
    t = n.content;
  }
  return gr({ kind: Eu, tags: [["e", n.channel_message_event_id], ...n.tags ?? []], content: t, created_at: n.created_at }, e);
}, Jv = (n, e) => {
  let t;
  if (typeof n.content == "object") t = JSON.stringify(n.content);
  else {
    if (typeof n.content != "string") return;
    t = n.content;
  }
  return gr({ kind: $u, tags: [["p", n.pubkey_to_mute], ...n.tags ?? []], content: t, created_at: n.created_at }, e);
}, nh = {};
Ft(nh, { EMOJI_SHORTCODE_REGEX: () => rh, matchAll: () => e1, regex: () => Zl, replaceAll: () => t1 });
var rh = /:(\w+):/, Zl = () => new RegExp(`\\B${rh.source}\\B`, "g");
function* e1(n) {
  const e = n.matchAll(Zl());
  for (const t of e) try {
    const [r, i] = t;
    yield { shortcode: r, name: i, start: t.index, end: t.index + r.length };
  } catch {
  }
}
function t1(n, e) {
  return n.replaceAll(Zl(), ((t, r) => e({ shortcode: t, name: r })));
}
var Vl, sh = {};
Ft(sh, { useFetchImplementation: () => n1, validateGithub: () => r1 });
try {
  Vl = fetch;
} catch {
}
function n1(n) {
  Vl = n;
}
async function r1(n, e, t) {
  try {
    return await (await Vl(`https://gist.github.com/${e}/${t}/raw`)).text() === `Verifying that I control the following Nostr public key: ${n}`;
  } catch {
    return !1;
  }
}
var ih = {};
Ft(ih, { decrypt: () => Ql, encrypt: () => Kl, getConversationKey: () => Wl, v2: () => i1 });
var oh = 1, ah = 65535;
function Wl(n, e) {
  const t = ii.getSharedSecret(n, "02" + e).subarray(1, 33);
  return Wg(Bs, t, "nip44-v2");
}
function lh(n, e) {
  const t = Gg(Bs, n, e, 76);
  return { chacha_key: t.subarray(0, 32), chacha_nonce: t.subarray(32, 44), hmac_key: t.subarray(44, 76) };
}
function Gl(n) {
  if (!Number.isSafeInteger(n) || n < 1) throw new Error("expected positive integer");
  if (n <= 32) return 32;
  const e = 1 << Math.floor(Math.log2(n - 1)) + 1, t = e <= 256 ? 32 : e / 8;
  return t * (Math.floor((n - 1) / t) + 1);
}
function s1(n) {
  const e = pr.encode(n), t = e.length;
  return Ho((function(r) {
    if (!Number.isSafeInteger(r) || r < oh || r > ah) throw new Error("invalid plaintext size: must be between 1 and 65535 bytes");
    const i = new Uint8Array(2);
    return new DataView(i.buffer).setUint16(0, r, !1), i;
  })(t), e, new Uint8Array(Gl(t) - t));
}
function ch(n, e, t) {
  if (t.length !== 32) throw new Error("AAD associated data must be 32 bytes");
  const r = Ho(t, e);
  return jo(Bs, n, r);
}
function Kl(n, e, t = Hd(32)) {
  const { chacha_key: r, chacha_nonce: i, hmac_key: a } = lh(e, t), c = s1(n), d = cu(r, i, c), h = ch(a, d, t);
  return fs.encode(Ho(new Uint8Array([2]), t, d, h));
}
function Ql(n, e) {
  const { nonce: t, ciphertext: r, mac: i } = (function(h) {
    if (typeof h != "string") throw new Error("payload must be a valid string");
    const g = h.length;
    if (g < 132 || g > 87472) throw new Error("invalid payload length: " + g);
    if (h[0] === "#") throw new Error("unknown encryption version");
    let b;
    try {
      b = fs.decode(h);
    } catch (D) {
      throw new Error("invalid base64: " + D.message);
    }
    const m = b.length;
    if (m < 99 || m > 65603) throw new Error("invalid data length: " + m);
    const v = b[0];
    if (v !== 2) throw new Error("unknown encryption version " + v);
    return { nonce: b.subarray(1, 33), ciphertext: b.subarray(33, -32), mac: b.subarray(-32) };
  })(n), { chacha_key: a, chacha_nonce: c, hmac_key: d } = lh(e, t);
  if (!Il(ch(d, r, t), i)) throw new Error("invalid MAC");
  return (function(h) {
    const g = new DataView(h.buffer).getUint16(0), b = h.subarray(2, 2 + g);
    if (g < oh || g > ah || b.length !== g || h.length !== 2 + Gl(g)) throw new Error("invalid padding");
    return jr.decode(b);
  })(cu(a, c, r));
}
var i1 = { utils: { getConversationKey: Wl, calcPaddedLen: Gl }, encrypt: Kl, decrypt: Ql }, dh = {};
function o1(n) {
  const { pathname: e, searchParams: t } = new URL(n), r = e, i = t.get("relay"), a = t.get("secret");
  if (!r || !i || !a) throw new Error("invalid connection string");
  return { pubkey: r, relay: i, secret: a };
}
async function a1(n, e, t) {
  const r = { method: "pay_invoice", params: { invoice: t } }, i = await Hu(e, n, JSON.stringify(r)), a = { kind: Su, created_at: Math.round(Date.now() / 1e3), content: i, tags: [["p", n]] };
  return gr(a, e);
}
Ft(dh, { makeNwcRequestEvent: () => a1, parseConnectionString: () => o1 });
var Yl, uh = {};
Ft(uh, { getZapEndpoint: () => c1, makeZapReceipt: () => h1, makeZapRequest: () => d1, useFetchImplementation: () => l1, validateZapRequest: () => u1 });
try {
  Yl = fetch;
} catch {
}
function l1(n) {
  Yl = n;
}
async function c1(n) {
  try {
    let e = "", { lud06: t, lud16: r } = JSON.parse(n.content);
    if (t) {
      let { words: c } = ni.decode(t, 1e3), d = ni.fromWords(c);
      e = jr.decode(d);
    } else {
      if (!r) return null;
      {
        let [c, d] = r.split("@");
        e = new URL(`/.well-known/lnurlp/${c}`, `https://${d}`).toString();
      }
    }
    let i = await Yl(e), a = await i.json();
    if (a.allowsNostr && a.nostrPubkey) return a.callback;
  } catch {
  }
  return null;
}
function d1({ profile: n, event: e, amount: t, relays: r, comment: i = "" }) {
  if (!t) throw new Error("amount not given");
  if (!n) throw new Error("profile not given");
  let a = { kind: 9734, created_at: Math.round(Date.now() / 1e3), content: i, tags: [["p", n], ["amount", t.toString()], ["relays", ...r]] };
  return e && a.tags.push(["e", e]), a;
}
function u1(n) {
  let e;
  try {
    e = JSON.parse(n);
  } catch {
    return "Invalid zap request JSON.";
  }
  if (!Fo(e)) return "Zap request is not a valid Nostr event.";
  if (!ci(e)) return "Invalid signature on zap request.";
  let t = e.tags.find((([i, a]) => i === "p" && a));
  if (!t) return "Zap request doesn't have a 'p' tag.";
  if (!t[1].match(/^[a-f0-9]{64}$/)) return "Zap request 'p' tag is not valid hex.";
  let r = e.tags.find((([i, a]) => i === "e" && a));
  return r && !r[1].match(/^[a-f0-9]{64}$/) ? "Zap request 'e' tag is not valid hex." : e.tags.find((([i, a]) => i === "relays" && a)) ? null : "Zap request doesn't have a 'relays' tag.";
}
function h1({ zapRequest: n, preimage: e, bolt11: t, paidAt: r }) {
  let i = JSON.parse(n), a = i.tags.filter((([d]) => d === "e" || d === "p" || d === "a")), c = { kind: 9735, created_at: Math.round(r.getTime() / 1e3), content: "", tags: [...a, ["P", i.pubkey], ["bolt11", t], ["description", n]] };
  return e && c.tags.push(["preimage", e]), c;
}
var hh = {};
Ft(hh, { createRumor: () => bh, createSeal: () => mh, createWrap: () => yh, unwrapEvent: () => wh, unwrapManyEvents: () => p1, wrapEvent: () => gl, wrapManyEvents: () => f1 });
var fh = () => Math.round(Date.now() / 1e3), ph = () => Math.round(fh() - 172800 * Math.random()), gh = (n, e) => Wl(n, e), vh = (n, e, t) => Kl(JSON.stringify(n), gh(e, t)), id = (n, e) => JSON.parse(Ql(n.content, gh(e, n.pubkey)));
function bh(n, e) {
  const t = { created_at: fh(), content: "", tags: [], ...n, pubkey: Nl(e) };
  return t.id = Mi(t), t;
}
function mh(n, e, t) {
  return gr({ kind: yu, content: vh(n, e, t), created_at: ph(), tags: [] }, e);
}
function yh(n, e) {
  const t = gu();
  return gr({ kind: ku, content: vh(n, t, e), created_at: ph(), tags: [["p", e]] }, t);
}
function gl(n, e, t) {
  return yh(mh(bh(n, e), e, t), t);
}
function f1(n, e, t) {
  if (!t || t.length === 0) throw new Error("At least one recipient is required.");
  const r = Nl(e), i = [gl(n, e, r)];
  return t.forEach(((a) => {
    i.push(gl(n, e, a));
  })), i;
}
function wh(n, e) {
  const t = id(n, e);
  return id(t, e);
}
function p1(n, e) {
  let t = [];
  return n.forEach(((r) => {
    t.push(wh(r, e));
  })), t.sort(((r, i) => r.created_at - i.created_at)), t;
}
var xh = {};
Ft(xh, { getToken: () => g1, hashPayload: () => Xl, unpackEventFromToken: () => Eh, validateEvent: () => Ih, validateEventKind: () => kh, validateEventMethodTag: () => Sh, validateEventPayloadTag: () => Ch, validateEventTimestamp: () => $h, validateEventUrlTag: () => Ah, validateToken: () => v1 });
var _h = "Nostr ";
async function g1(n, e, t, r = !1, i) {
  const a = { kind: Pl, tags: [["u", n], ["method", e]], created_at: Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3), content: "" };
  i && a.tags.push(["payload", Xl(i)]);
  const c = await t(a);
  return (r ? _h : "") + fs.encode(pr.encode(JSON.stringify(c)));
}
async function v1(n, e, t) {
  const r = await Eh(n).catch(((i) => {
    throw i;
  }));
  return await Ih(r, e, t).catch(((i) => {
    throw i;
  }));
}
async function Eh(n) {
  if (!n) throw new Error("Missing token");
  n = n.replace(_h, "");
  const e = jr.decode(fs.decode(n));
  if (!e || e.length === 0 || !e.startsWith("{")) throw new Error("Invalid token");
  return JSON.parse(e);
}
function $h(n) {
  return !!n.created_at && Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3) - n.created_at < 60;
}
function kh(n) {
  return n.kind === Pl;
}
function Ah(n, e) {
  const t = n.tags.find(((r) => r[0] === "u"));
  return !!t && t.length > 0 && t[1] === e;
}
function Sh(n, e) {
  const t = n.tags.find(((r) => r[0] === "method"));
  return !!t && t.length > 0 && t[1].toLowerCase() === e.toLowerCase();
}
function Xl(n) {
  return rn(Bs(pr.encode(JSON.stringify(n))));
}
function Ch(n, e) {
  const t = n.tags.find(((i) => i[0] === "payload"));
  if (!t) return !1;
  const r = Xl(e);
  return t.length > 0 && t[1] === r;
}
async function Ih(n, e, t, r) {
  if (!ci(n)) throw new Error("Invalid nostr event, signature invalid");
  if (!kh(n)) throw new Error("Invalid nostr event, kind invalid");
  if (!$h(n)) throw new Error("Invalid nostr event, created_at timestamp invalid");
  if (!Ah(n, e)) throw new Error("Invalid nostr event, url tag invalid");
  if (!Sh(n, t)) throw new Error("Invalid nostr event, method tag invalid");
  if (r && typeof r == "object" && Object.keys(r).length > 0 && !Ch(n, r)) throw new Error("Invalid nostr event, payload tag does not match request body hash");
  return !0;
}
const We = { LIBRARIES: { decodeBolt11: ag.decode, NostrTools: sl }, DEFAULT_OPTIONS: { theme: "light", colorMode: !0 }, BATCH_SIZE: 5, REQ_CONFIG: { INITIAL_LOAD_COUNT: 15, ADDITIONAL_LOAD_COUNT: 20 }, LOAD_TIMEOUT: 1e4, BUFFER_INTERVAL: 500, BUFFER_MIN_INTERVAL: 100, INFINITE_SCROLL: { ROOT_MARGIN: "400px", THRESHOLD: 0.1, DEBOUNCE_TIME: 500, RETRY_DELAY: 500 }, ZAP_CONFIG: { DEFAULT_LIMIT: 1, DEFAULT_COLOR_MODE: !0, ERRORS: { DIALOG_NOT_FOUND: "Zap dialog not found", BUTTON_NOT_FOUND: "Fetch button not found", DECODE_FAILED: "Failed to decode identifier" } }, ZAP_AMOUNT_CONFIG: { DEFAULT_COLOR_MODE: !0, THRESHOLDS: [{ value: 1e4, className: "zap-amount-10k" }, { value: 5e3, className: "zap-amount-5k" }, { value: 2e3, className: "zap-amount-2k" }, { value: 1e3, className: "zap-amount-1k" }, { value: 500, className: "zap-amount-500" }, { value: 200, className: "zap-amount-200" }, { value: 100, className: "zap-amount-100" }], DEFAULT_CLASS: "default-color", DISABLED_CLASS: "" }, DIALOG_CONFIG: { DEFAULT_TITLE: "To ", NO_ZAPS_MESSAGE: "No Zaps yet!<br>Send the first Zap!", DEFAULT_NO_ZAPS_DELAY: 1500, ZAP_LIST: { INITIAL_BATCH: 30, REMAINING_BATCH: 30, PROFILE_BATCH: 30, MIN_HEIGHT: "100px" } }, REQUEST_CONFIG: { METADATA_TIMEOUT: 2e4, REQUEST_TIMEOUT: 2e3, CACHE_DURATION: 3e5 }, PROFILE_CONFIG: { BATCH_SIZE: 20, BATCH_DELAY: 100, RELAYS: ["wss://relay.nostr.band", "wss://purplepag.es", "wss://relay.damus.io", "wss://nostr.wine", "wss://directory.yabu.me"] }, BATCH_CONFIG: { REFERENCE_PROCESSOR: { BATCH_SIZE: 20, BATCH_DELAY: 100 }, SUPPORTED_EVENT_KINDS: [1, 30023, 30030, 30009, 40, 42, 31990] }, BATCH_PROCESSOR_CONFIG: { DEFAULT_BATCH_SIZE: 20, DEFAULT_BATCH_DELAY: 100, DEFAULT_MAX_CACHE_AGE: 18e5, DEFAULT_RELAY_URLS: [], TIMEOUT_DURATION: 500 } };
class qi {
  constructor(e, t, r = null) {
    this.identifier = e, this.relayUrls = t, this.isColorModeEnabled = r === null ? We.ZAP_CONFIG.DEFAULT_COLOR_MODE : String(r).toLowerCase() === "true";
  }
  static determineColorMode(e) {
    if (!e || !e.hasAttribute("data-zap-color-mode")) return We.ZAP_CONFIG.DEFAULT_COLOR_MODE;
    const t = e.getAttribute("data-zap-color-mode");
    return t.toLowerCase() !== "true" && t.toLowerCase() !== "false" || t.toLowerCase() === "true";
  }
  static fromButton(e) {
    if (!e) throw new Error(We.ZAP_CONFIG.ERRORS.BUTTON_NOT_FOUND);
    const t = qi.determineColorMode(e);
    return new qi(e.getAttribute("data-nzv-id"), e.getAttribute("data-relay-urls").split(","), t);
  }
}
class Wr {
  constructor(e = 1e3) {
    this.cache = /* @__PURE__ */ new Map(), this.maxSize = e, this.accessOrder = /* @__PURE__ */ new Map();
  }
  set(e, t) {
    if (this.cache.size >= this.maxSize && !this.cache.has(e)) {
      const r = this.accessOrder.keys().next().value;
      this.cache.delete(r), this.accessOrder.delete(r);
    }
    return this.cache.set(e, t), this.accessOrder.delete(e), this.accessOrder.set(e, Date.now()), t;
  }
  get(e) {
    if (!this.cache.has(e)) return;
    const t = this.cache.get(e);
    return this.accessOrder.set(e, Date.now()), t;
  }
  has(e) {
    return this.cache.has(e);
  }
  delete(e) {
    this.cache.delete(e);
  }
  clear() {
    this.cache.clear();
  }
}
class Jl extends Wr {
  #e = /* @__PURE__ */ new Map();
  setProfile(e, t) {
    if (!e || !t) return;
    const r = this.get(e);
    r && r._eventCreatedAt && t._eventCreatedAt && !(t._eventCreatedAt > r._eventCreatedAt) || (this.set(e, t), this.#t(e, t));
  }
  #t(e, t) {
    this.#e.forEach(((r) => {
      try {
        r(e, t);
      } catch {
      }
    }));
  }
  subscribe(e) {
    if (typeof e != "function") return null;
    const t = Math.random().toString(36).substr(2, 9);
    return this.#e.set(t, e), () => this.#e.delete(t);
  }
  clearSubscriptions() {
    this.#e.clear();
  }
}
class b1 extends Wr {
  #e = /* @__PURE__ */ new Map();
  initializeView(e) {
    this.#e.set(e, { isInitialFetchComplete: !1, lastEventTime: null, isLoading: !1, batchProcessing: !1 });
  }
  getViewState(e) {
    return this.#e.get(e) || this.initializeView(e);
  }
  updateViewState(e, t) {
    const r = this.getViewState(e);
    return this.#e.set(e, { ...r, ...t }), this.#e.get(e);
  }
  getEvents(e) {
    return this.get(e) || [];
  }
  setEvents(e, t, r = !1) {
    const i = r ? this.getEvents(e) : [], a = new Map(t.map(((d) => [d.id, d]))), c = [...i.filter(((d) => !a.has(d.id))), ...t];
    this.set(e, c);
  }
  addEvent(e, t) {
    if (!t?.id) return !1;
    const r = this.getEvents(e);
    return !this.#t(r, t) && (r.push(t), r.sort(((i, a) => a.created_at - i.created_at)), this.setEvents(e, r, !0), !0);
  }
  #t(e, t) {
    return e.some(((r) => r.id === t.id || r.kind === t.kind && r.pubkey === t.pubkey && r.content === t.content && r.created_at === t.created_at));
  }
}
class m1 extends Wr {
  #e = /* @__PURE__ */ new Map();
  #t = /* @__PURE__ */ new Map();
  async getOrFetch(e, t) {
    const r = this.get(e);
    if (r) return r;
    const i = this.#e.get(e);
    if (i) return i;
    const a = t().then(((c) => (c && this.set(e, c), this.#e.delete(e), c))).catch(((c) => (this.#e.delete(e), null)));
    return this.#e.set(e, a), a;
  }
  clearPendingFetches() {
    this.#e.clear();
  }
  setComponent(e, t) {
    this.#t.set(e, t);
  }
  getComponent(e) {
    return this.#t.get(e);
  }
  clearComponents() {
    this.#t.clear();
  }
  clear() {
    super.clear(), this.clearPendingFetches(), this.clearComponents();
  }
}
class y1 extends Wr {
  #e = /* @__PURE__ */ new Map();
  #t = /* @__PURE__ */ new Map();
  setCached(e, t, r) {
    const i = `${e}:${t}`;
    this.set(i, { stats: r, timestamp: Date.now() }), this.updateViewStats(e, r);
  }
  getCached(e, t) {
    const r = `${e}:${t}`;
    return this.get(r);
  }
  updateViewStats(e, t) {
    t && this.#e.set(e, { ...t, lastUpdate: Date.now() });
  }
  getViewStats(e) {
    return this.#e.get(e);
  }
  clearViewStats(e) {
    this.#e.delete(e);
  }
  setNoZapsState(e, t) {
    this.#t.set(e, t);
  }
  hasNoZaps(e) {
    return this.#t.get(e) || !1;
  }
  clearNoZapsState(e) {
    this.#t.delete(e);
  }
  clear() {
    super.clear(), this.#e.clear(), this.#t.clear();
  }
}
class w1 extends Wr {
  hasDecoded(e) {
    return this.has(e);
  }
  setDecoded(e, t) {
    this.set(e, t);
  }
  getDecoded(e) {
    return this.get(e);
  }
}
class x1 extends Wr {
  initializeLoadState(e) {
    const t = { isInitialFetchComplete: !1, lastEventTime: null, isLoading: !1, currentCount: 0 };
    return this.set(e, t), t;
  }
  getLoadState(e) {
    return this.has(e) ? this.get(e) : this.initializeLoadState(e);
  }
  updateLoadState(e, t) {
    const r = { ...this.getLoadState(e), ...t };
    return this.set(e, r), r;
  }
  canLoadMore(e) {
    const t = this.getLoadState(e);
    return t && !t.isLoading && t.lastEventTime;
  }
  updateLoadProgress(e, t) {
    const r = this.getLoadState(e);
    return r.currentCount += t, this.updateLoadState(e, { currentCount: r.currentCount }), r.currentCount;
  }
}
class _1 extends Wr {
  setZapInfo(e, t) {
    this.set(e, t);
  }
  getZapInfo(e) {
    return this.get(e);
  }
  clearZapInfo(e) {
    this.delete(e);
  }
}
class E1 extends Jl {
  setImage(e, t) {
    e && t && this.set(e, { image: t, timestamp: Date.now() });
  }
  getImage(e) {
    return this.get(e)?.image;
  }
  hasImage(e) {
    return this.has(e);
  }
  clearExpired(e = 36e5) {
    const t = Date.now();
    for (const [r, i] of this.cache.entries()) t - i.timestamp > e && this.delete(r);
  }
}
class $1 extends Jl {
  #e = /* @__PURE__ */ new Map();
  setNip05(e, t) {
    e && this.set(e, { value: t, timestamp: Date.now(), verified: !0 });
  }
  getNip05(e) {
    return this.get(e)?.value;
  }
  setPendingVerification(e, t) {
    this.#e.set(e, t);
  }
  getPendingVerification(e) {
    return this.#e.get(e);
  }
  deletePendingVerification(e) {
    this.#e.delete(e);
  }
  clearPendingVerifications() {
    this.#e.clear();
  }
  clear() {
    super.clear(), this.clearPendingVerifications();
  }
}
class Ri {
  static #e = null;
  #t = null;
  #n = {};
  constructor() {
    if (Ri.#e) return Ri.#e;
    this.profileCache = new Jl(), this.zapEventCache = new b1(), this.referenceCache = new m1(), this.statsCache = new y1(), this.decodedCache = new w1(), this.loadStateCache = new x1(), this.zapInfoCache = new _1(), this.imageCache = new E1(), this.nip05Cache = new $1(), this.nip05PendingCache = new Wr(), this.#n = ["zapInfo", "uiComponent", "decoded", "nip05", "nip05PendingFetches", "zapLoadStates", "imageCache", "isEventIdentifier"].reduce(((e, t) => (e[t] = new Wr(), e)), {}), this.viewStats = /* @__PURE__ */ new Map(), this.viewStates = /* @__PURE__ */ new Map(), Ri.#e = this;
  }
  setProfile(e, t) {
    return this.profileCache.setProfile(e, t);
  }
  getProfile(e) {
    return this.profileCache.get(e);
  }
  subscribeToProfileUpdates(e) {
    return this.profileCache.subscribe(e);
  }
  initializeZapView(e) {
    return this.zapEventCache.initializeView(e);
  }
  getZapEvents(e) {
    return this.zapEventCache.getEvents(e);
  }
  setZapEvents(e, t, r) {
    return this.zapEventCache.setEvents(e, t, r);
  }
  addZapEvent(e, t) {
    return this.zapEventCache.addEvent(e, t);
  }
  getZapViewState(e) {
    return this.zapEventCache.getViewState(e);
  }
  updateZapViewState(e, t) {
    return this.zapEventCache.updateViewState(e, t);
  }
  setReference(e, t) {
    return this.referenceCache.set(e, t);
  }
  getReference(e) {
    return this.referenceCache.get(e);
  }
  getOrFetchReference(e, t) {
    return this.referenceCache.getOrFetch(e, t);
  }
  getReferenceComponent(e) {
    return this.referenceCache.getComponent(e);
  }
  setReferenceComponent(e, t) {
    return this.referenceCache.setComponent(e, t);
  }
  getCachedStats(e, t) {
    return this.statsCache.getCached(e, t);
  }
  updateStatsCache(e, t, r) {
    this.statsCache.setCached(e, t, r), this.statsCache.updateViewStats(e, r);
  }
  getViewStats(e) {
    return this.statsCache.getViewStats(e);
  }
  setNoZapsState(e, t) {
    return this.statsCache.setNoZapsState(e, t);
  }
  hasNoZaps(e) {
    return this.statsCache.hasNoZaps(e);
  }
  async processCachedData(e, t) {
    this.setRelayUrls(t.relayUrls);
    const r = this.getZapEvents(e), i = r.some(((a) => this.getReference(a.id)));
    return { stats: (await Promise.all([this.getCachedStats(e, t.identifier)]))[0], hasEnoughCachedEvents: r.length >= We.REQ_CONFIG.INITIAL_LOAD_COUNT, hasReferences: i };
  }
  hasDecoded(e) {
    return this.decodedCache.hasDecoded(e);
  }
  setDecoded(e, t) {
    return this.decodedCache.setDecoded(e, t);
  }
  getDecoded(e) {
    return this.decodedCache.getDecoded(e);
  }
  initializeLoadState(e) {
    return this.loadStateCache.initializeLoadState(e);
  }
  getLoadState(e) {
    return this.loadStateCache.getLoadState(e);
  }
  updateLoadState(e, t) {
    return this.loadStateCache.updateLoadState(e, t);
  }
  canLoadMore(e) {
    return this.loadStateCache.canLoadMore(e);
  }
  updateLoadProgress(e, t) {
    return this.loadStateCache.updateLoadProgress(e, t);
  }
  setZapInfo(e, t) {
    return this.zapInfoCache.setZapInfo(e, t);
  }
  getZapInfo(e) {
    return this.zapInfoCache.getZapInfo(e);
  }
  clearZapInfo(e) {
    return this.zapInfoCache.clearZapInfo(e);
  }
  setImageCache(e, t) {
    return this.imageCache.setImage(e, t);
  }
  getImageCache(e) {
    return this.imageCache.getImage(e);
  }
  hasImageCache(e) {
    return this.imageCache.hasImage(e);
  }
  setNip05(e, t) {
    return this.nip05Cache.setNip05(e, t);
  }
  getNip05(e) {
    return this.nip05Cache.getNip05(e);
  }
  setNip05PendingFetch(e, t) {
    this.nip05Cache.setPendingVerification(e, t);
  }
  getNip05PendingFetch(e) {
    return this.nip05Cache.getPendingVerification(e);
  }
  deleteNip05PendingFetch(e) {
    this.nip05Cache.deletePendingVerification(e);
  }
  getOrCreateViewState(e, t = {}) {
    return this.viewStates.has(e) || this.viewStates.set(e, { currentStats: null, ...t }), this.viewStates.get(e);
  }
  getViewState(e) {
    return this.getOrCreateViewState(e);
  }
  updateViewState(e, t) {
    const r = this.getOrCreateViewState(e);
    return this.viewStates.set(e, { ...r, ...t }), this.viewStates.get(e);
  }
  setCacheItem(e, t, r) {
    const i = this.#n[e];
    return i && t !== void 0 ? i.set(t, r) : null;
  }
  getCacheItem(e, t) {
    const r = this.#n[e];
    return r && t !== void 0 ? r.get(t) : null;
  }
  setRelayUrls(e) {
    this.#t = e;
  }
  getRelayUrls() {
    return this.#t;
  }
  clearAll() {
    this.profileCache.clear(), this.profileCache.clearSubscriptions(), this.zapEventCache.clear(), this.referenceCache.clear(), this.referenceCache.clearPendingFetches(), this.referenceCache.clearComponents(), this.statsCache.clear(), this.decodedCache.clear(), this.loadStateCache.clear(), this.zapInfoCache.clear(), this.imageCache.clear(), this.nip05Cache.clear(), this.nip05Cache.clearPendingVerifications(), Object.values(this.#n).forEach(((e) => e.clear())), this.viewStats.clear(), this.viewStates.clear();
  }
}
const Re = new Ri(), od = "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAyMDYuMzMgMjA2LjMzIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogICA8ZGVmcz4KICAgICAgPHN0eWxlPgogICAgICAgICAuY2xzLTEgewogICAgICAgICAgICBmaWxsOiBub25lOwogICAgICAgICB9CgogICAgICAgICAuY2xzLTIgewogICAgICAgICAgICBmaWxsOiAjZmZmOwogICAgICAgICB9CgogICAgICAgICAuY2xzLTMgewogICAgICAgICAgICBmaWxsOiAjNjY2OwogICAgICAgICB9CiAgICAgIDwvc3R5bGU+CiAgIDwvZGVmcz4KICAgPHBhdGggY2xhc3M9ImNscy0yIgogICAgICBkPSJtMjA2LjMzIDEzNC4zOWMwIDIwLjcxIDAgMzEuMDctMy41MyA0Mi4yMi00LjQzIDEyLjE3LTE0LjAyIDIxLjc2LTI2LjE5IDI2LjE5LTExLjE1IDMuNTMtMjEuNSAzLjUzLTQyLjIyIDMuNTNoLTYyLjQ2Yy0yMC43MSAwLTMxLjA2IDAtNDIuMjEtMy41My0xMi4xNy00LjQzLTIxLjc2LTE0LjAyLTI2LjE5LTI2LjE5LTMuNTMtMTEuMTUtMy41My0yMS41LTMuNTMtNDIuMjJ2LTYyLjQ2YzAtMjAuNzEgMC0zMS4wNyAzLjUzLTQyLjIyIDQuNDMtMTIuMTcgMTQuMDItMjEuNzYgMjYuMTktMjYuMTkgMTEuMTUtMy41MiAyMS41LTMuNTIgNDIuMjEtMy41Mmg2Mi40NmMyMC43MSAwIDMxLjA3IDAgNDIuMjIgMy41MiAxMi4xNyA0LjQzIDIxLjc2IDE0LjAyIDI2LjE5IDI2LjE5IDMuNTMgMTEuMTUgMy41MyAyMS41IDMuNTMgNDIuMjJ6IiAvPgogICA8cGF0aCBjbGFzcz0iY2xzLTMiCiAgICAgIGQ9Im0xODUuOTggOTEuMXY4My4yM2MwIDMuMTMtMi41NCA1LjY3LTUuNjcgNS42N2gtNjguMDRjLTMuMTMgMC01LjY3LTIuNTQtNS42Ny01LjY3di0xNS41YzAuMzEtMTkgMi4zMi0zNy4yIDYuNTQtNDUuNDggMi41My00Ljk4IDYuNy03LjY5IDExLjQ5LTkuMTQgOS4wNS0yLjcyIDI0LjkzLTAuODYgMzEuNjctMS4xOCAwIDAgMjAuMzYgMC44MSAyMC4zNi0xMC43MiAwLTkuMjgtOS4xLTguNTUtOS4xLTguNTUtMTAuMDMgMC4yNi0xNy42Ny0wLjQyLTIyLjYyLTIuMzctOC4yOS0zLjI2LTguNTctOS4yNC04LjYtMTEuMjQtMC40MS0yMy4xLTM0LjQ3LTI1Ljg3LTY0LjQ4LTIwLjE0LTMyLjgxIDYuMjQgMC4zNiA1My4yNyAwLjM2IDExNi4wNXY4LjM4Yy0wLjA2IDMuMDgtMi41NSA1LjU3LTUuNjUgNS41N2gtMzMuNjljLTMuMTMgMC01LjY3LTIuNTQtNS42Ny01LjY3di0xNDMuOTVjMC0zLjEzIDIuNTQtNS42NyA1LjY3LTUuNjdoMzEuNjdjMy4xMyAwIDUuNjcgMi41NCA1LjY3IDUuNjcgMCA0LjY1IDUuMjMgNy4yNCA5LjAxIDQuNTMgMTEuMzktOC4xNiAyNi4wMS0xMi41MSA0Mi4zNy0xMi41MSAzNi42NSAwIDY0LjM2IDIxLjM2IDY0LjM2IDY4LjY5em0tNjAuODQtMTYuODljMC02LjctNS40My0xMi4xMy0xMi4xMy0xMi4xM3MtMTIuMTMgNS40My0xMi4xMyAxMi4xMyA1LjQzIDEyLjEzIDEyLjEzIDEyLjEzIDEyLjEzLTUuNDMgMTIuMTMtMTIuMTN6IiAvPgo8L3N2Zz4=", k1 = (n) => typeof n == "string" && n.length > 0, A1 = (n) => {
  try {
    return window.NostrTools.nip19.decode(n);
  } catch {
    return null;
  }
}, S1 = (n, e, t) => {
  const r = { npub: () => ({ kinds: [9735], "#p": [e] }), note: () => ({ kinds: [9735], "#e": [e] }), nprofile: () => ({ kinds: [9735], "#p": [e.pubkey] }), nevent: () => ({ kinds: [9735], "#e": [e.id] }), naddr: () => ({ kinds: [9735], "#a": [`${e.kind}:${e.pubkey}:${e.identifier}`] }) }[n];
  if (!r) return null;
  const i = r();
  return i.limit = t ? We.REQ_CONFIG.ADDITIONAL_LOAD_COUNT : We.REQ_CONFIG.INITIAL_LOAD_COUNT, t && (i.until = t), { req: i };
};
function ad(n, e = null) {
  const t = `${n}:${e}`;
  if (Re.hasDecoded(t)) return Re.getDecoded(t);
  if (!k1(n)) throw new Error(We.ZAP_CONFIG.ERRORS.DECODE_FAILED);
  const r = A1(n);
  if (!r) return null;
  const i = S1(r.type, r.data, e);
  return i && Re.setDecoded(t, i), i;
}
function Th(n) {
  return n?.display_name || n?.name || "nameless";
}
async function C1(n, e) {
  if (!n || !e) return null;
  try {
    return (await window.NostrTools.nip05.queryProfile(n))?.pubkey === e ? n : null;
  } catch {
    return null;
  }
}
function ko(n) {
  return new Intl.NumberFormat().format(n);
}
function Lh(n) {
  if (!n || typeof n != "string") return "unknown";
  try {
    return `${window.NostrTools.nip19.decode(n).type.toLowerCase()}1${n.slice(5, 11)}...${n.slice(-4)}`;
  } catch {
    return "unknown";
  }
}
function Js(n) {
  const e = document.createElement("div");
  return e.textContent = n, e.innerHTML;
}
function I1(n) {
  try {
    return window.NostrTools.nip19.npubEncode(n);
  } catch {
    return null;
  }
}
function si(n) {
  if (!n || typeof n != "string") return !1;
  const e = `isEventIdentifier:${n}`, t = Re.getCacheItem("isEventIdentifier", e);
  if (t !== void 0) return t;
  const r = n.startsWith("note1") || n.startsWith("nevent1") || n.startsWith("naddr1");
  return Re.setCacheItem("isEventIdentifier", e, r), r;
}
async function T1(n) {
  const { pubkey: e, content: t } = (function(i) {
    const a = i.tags.find(((c) => c[0] === "description"))?.[1];
    if (!a) return { pubkey: null, content: "" };
    try {
      const c = L1(a);
      let d;
      try {
        d = JSON.parse(c);
      } catch {
        const g = c.match(/"pubkey"\s*:\s*"([^"]+)"|"content"\s*:\s*"([^"]+)"/g);
        if (!g) throw new Error("Invalid JSON structure");
        d = {}, g.forEach(((b) => {
          const [m, v] = b.split(":").map(((D) => D.trim().replace(/"/g, "")));
          d[m] = v;
        }));
      }
      let h = null;
      return d.pubkey && (h = typeof d.pubkey == "string" ? d.pubkey : String(d.pubkey)), { pubkey: h, content: typeof d.content == "string" ? d.content.trim() : "" };
    } catch {
      return { pubkey: null, content: "" };
    }
  })(n), r = await (async function(i) {
    const a = i.tags.find(((c) => c[0].toLowerCase() === "bolt11"))?.[1];
    if (!a) return "Amount: Unknown";
    try {
      const c = window.decodeBolt11(a), d = c.sections.find(((h) => h.name === "amount"))?.value;
      return d ? `${ko(Math.floor(d / 1e3))} sats` : "Amount: Unknown";
    } catch {
      return "Amount: Unknown";
    }
  })(n);
  return { pubkey: e, content: t, satsText: r };
}
function ld(n) {
  try {
    return window.NostrTools.nip19.decode(n);
  } catch {
    return null;
  }
}
function L1(n) {
  return n.replace(/[\u0000-\u001F\u007F-\u009F]/g, "").replace(/\\\\/g, "\\").replace(/\\(?!(["\\\/bfnrt]|u[0-9a-fA-F]{4}))/g, "").replace(/\\+(["\\/bfnrt])/g, "\\$1").replace(/\\u(?![0-9a-fA-F]{4})/g, "");
}
class D1 {
  constructor(e) {
    this.root = e;
  }
  displayStats(e) {
    requestAnimationFrame((() => {
      const t = this.root?.querySelector(".zap-stats");
      if (t) try {
        let r;
        r = e ? e.skeleton ? this.#e() : e.error ? this.createTimeoutStats() : this.createNormalStats(e) : this.createTimeoutStats(), t.innerHTML = r;
      } catch {
        t.innerHTML = this.createTimeoutStats();
      }
    }));
  }
  #e() {
    return `
      <div class="stats-item">Total Count</div>
      <div class="stats-item"><span class="number skeleton">...</span></div>
      <div class="stats-item">times</div>
      <div class="stats-item">Total Amount</div>
      <div class="stats-item"><span class="number skeleton">...</span></div>
      <div class="stats-item">sats</div>
      <div class="stats-item">Max Amount</div>
      <div class="stats-item"><span class="number skeleton">...</span></div>
      <div class="stats-item">sats</div>
    `;
  }
  createTimeoutStats() {
    return `
      <div class="stats-item">Total Count</div>
      <div class="stats-item"><span class="number text-muted">nostr.band</span></div>
      <div class="stats-item">times</div>
      <div class="stats-item">Total Amount</div>
      <div class="stats-item"><span class="number text-muted">Stats</span></div>
      <div class="stats-item">sats</div>
      <div class="stats-item">Max Amount</div>
      <div class="stats-item"><span class="number text-muted">Unavailable</span></div>
      <div class="stats-item">sats</div>
    `;
  }
  createNormalStats(e) {
    return `
      <div class="stats-item">Total Count</div>
      <div class="stats-item"><span class="number">${ko(e.count)}</span></div>
      <div class="stats-item">times</div>
      <div class="stats-item">Total Amount</div>
      <div class="stats-item"><span class="number">${ko(Math.floor(e.msats / 1e3))}</span></div>
      <div class="stats-item">sats</div>
      <div class="stats-item">Max Amount</div>
      <div class="stats-item"><span class="number">${ko(Math.floor(e.maxMsats / 1e3))}</span></div>
      <div class="stats-item">sats</div>
    `;
  }
}
class ec {
  constructor(e = {}) {
    this._validateOptions(e), this._initializeProperties(e);
  }
  _validateOptions(e) {
    if (!e.pool?.ensureRelay) throw new Error("Invalid pool object: ensureRelay method is required");
  }
  _initializeProperties(e) {
    this.pool = e.pool, this.batchSize = e.batchSize || We.BATCH_PROCESSOR_CONFIG.DEFAULT_BATCH_SIZE, this.batchDelay = e.batchDelay || We.BATCH_PROCESSOR_CONFIG.DEFAULT_BATCH_DELAY, this.relayUrls = e.relayUrls || We.BATCH_PROCESSOR_CONFIG.DEFAULT_RELAY_URLS, this.batchQueue = /* @__PURE__ */ new Set(), this.pendingFetches = /* @__PURE__ */ new Map(), this.resolvers = /* @__PURE__ */ new Map(), this.processingItems = /* @__PURE__ */ new Set(), this.batchTimer = null, this.eventCache = /* @__PURE__ */ new Map(), this.maxCacheAge = e.maxCacheAge || We.BATCH_PROCESSOR_CONFIG.DEFAULT_MAX_CACHE_AGE;
  }
  getOrCreateFetchPromise(e) {
    if (this.pendingFetches.has(e)) return this.pendingFetches.get(e);
    const t = new Promise(((r) => {
      this.resolvers.set(e, r);
    }));
    return this.pendingFetches.set(e, t), this.batchQueue.add(e), this._scheduleBatchProcess(), t;
  }
  _scheduleBatchProcess() {
    this.batchTimer || (this.batchTimer = setTimeout((() => {
      this.batchTimer = null, this._processBatchQueue();
    }), this.batchDelay));
  }
  async _processBatchQueue() {
    if (this.batchQueue.size === 0) return;
    const e = this._getBatchItems();
    await this._processBatch(e), this.batchQueue.size > 0 && this._scheduleBatchProcess();
  }
  _getBatchItems() {
    const e = Array.from(this.batchQueue).slice(0, this.batchSize);
    return e.forEach(((t) => {
      this.batchQueue.delete(t), this.processingItems.add(t);
    })), e;
  }
  async _processBatch(e) {
    try {
      await this.onBatchProcess(e);
    } catch (t) {
      this._handleBatchError(e, t);
    } finally {
      this._cleanupBatchItems(e);
    }
  }
  _handleBatchError(e, t) {
    e.forEach(((r) => this.resolveItem(r, null)));
  }
  _cleanupBatchItems(e) {
    e.forEach(((t) => {
      this.processingItems.delete(t), this.pendingFetches.delete(t), this.resolvers.delete(t);
    }));
  }
  resolveItem(e, t) {
    const r = this.resolvers.get(e);
    r && (r(t), this.resolvers.delete(e));
  }
  async onBatchProcess(e) {
    throw new Error("onBatchProcess must be implemented by derived class");
  }
  onBatchError(e, t) {
    e.forEach(((r) => this.resolveItem(r, null)));
  }
  _cleanup(e, t, r, i) {
    clearTimeout(e), t && t.close(), r.forEach(((a) => {
      !i.has(a) && this.resolvers.has(a) && this.resolveItem(a, null);
    }));
  }
  _getSubscriptionPool() {
    return this.pool;
  }
  async _createSubscriptionPromise(e, t, r, i) {
    if (t?.length) return new Promise(((a) => {
      const c = /* @__PURE__ */ new Set(), d = We.BATCH_PROCESSOR_CONFIG.TIMEOUT_DURATION;
      let h, g, b = !1;
      const m = () => {
        b || (b = !0, h && clearTimeout(h), g && g.close(), e.forEach(((v) => {
          c.has(v) || this.resolveItem(v, null);
        })), a());
      };
      g = this.pool.subscribeMany(t, r, { onevent: (v) => {
        try {
          b || (i(v, c), c.size === e.length && m());
        } catch {
        }
      }, oneose: () => {
        setTimeout(m, 100);
      }, onerror: (v) => {
      } }), h = setTimeout((() => {
        b || m();
      }), d);
    }));
    e.forEach(((a) => this.resolveItem(a, null)));
  }
  setRelayUrls(e) {
    this.relayUrls = Array.isArray(e) ? e : [];
  }
  getCachedItem(e) {
    const t = this.eventCache.get(e);
    return this._isValidCache(t) ? t.event : (this.eventCache.delete(e), null);
  }
  _isValidCache(e) {
    return !!e && Date.now() - e.timestamp <= this.maxCacheAge;
  }
  setCachedItem(e, t) {
    this.eventCache.set(e, { event: t, timestamp: Date.now() });
  }
}
class O1 extends ec {
  constructor(e = {}) {
    super(e);
  }
  async onBatchProcess(e) {
    if (!e?.length) return;
    const t = [{ ids: e.slice(0, this.batchSize) }];
    await this._createSubscriptionPromise(e, this.relayUrls, t, ((r, i) => {
      if (e.includes(r.id)) {
        const a = this.getCachedItem(r.id);
        (!a || r.created_at > a.created_at) && (this.setCachedItem(r.id, r), this.resolveItem(r.id, r), i.add(r.id));
      }
    }));
  }
}
class N1 extends ec {
  constructor(e = {}) {
    super(e);
  }
  _parseAtagValue(e) {
    const t = e.split(":");
    return t.length !== 3 ? null : { kind: parseInt(t[0]), pubkey: t[1], identifier: t[2] };
  }
  async onBatchProcess(e) {
    if (!e?.length) return;
    const t = [], r = { kinds: [], authors: [], "#d": [] };
    if (e.slice(0, this.batchSize).forEach(((a) => {
      const c = this._parseAtagValue(a);
      c ? (r.kinds.push(c.kind), r.authors.push(c.pubkey), r["#d"].push(c.identifier), t.push(a)) : this.resolveItem(a, null);
    })), t.length === 0) return;
    const i = [r];
    await this._createSubscriptionPromise(t, this.relayUrls, i, ((a, c) => {
      const d = t.find(((h) => {
        const g = this._parseAtagValue(h);
        return g && a.kind === g.kind && a.pubkey === g.pubkey && a.tags.some(((b) => b[0] === "d" && b[1] === g.identifier));
      }));
      if (d) {
        const h = this.getCachedItem(d);
        (!h || a.created_at > h.created_at) && (this.setCachedItem(d, a), this.resolveItem(d, a), c.add(d));
      }
    }));
  }
}
class M1 extends ec {
  constructor(e = {}) {
    const { simplePool: t, config: r } = e;
    super({ pool: t, batchSize: r.BATCH_SIZE || We.PROFILE_CONFIG.BATCH_SIZE, batchDelay: r.BATCH_DELAY || We.PROFILE_CONFIG.BATCH_DELAY, relayUrls: r.RELAYS || We.PROFILE_CONFIG.RELAYS, maxCacheAge: We.BATCH_PROCESSOR_CONFIG.DEFAULT_MAX_CACHE_AGE }), this.config = r;
  }
  async onBatchProcess(e) {
    if (!this.config.RELAYS?.length) throw new Error("No relays configured for profile fetch");
    const t = e.filter(((c) => {
      const d = this.getCachedItem(c);
      return !d || (this.resolveItem(c, d), !1);
    }));
    if (t.length === 0) return;
    const r = [{ kinds: [0], authors: t }], i = /* @__PURE__ */ new Map(), a = (c, d) => {
      const h = i.get(c.pubkey);
      (!h || c.created_at > h.created_at) && (i.set(c.pubkey, c), this.setCachedItem(c.pubkey, c)), d.add(c.pubkey);
    };
    try {
      await this._createSubscriptionPromise(t, this.config.RELAYS, r, a), t.forEach(((c) => {
        const d = i.get(c);
        this.resolveItem(c, d || null);
      }));
    } catch (c) {
      this.onBatchError(e, c);
    }
  }
}
var Ts = Symbol("verified");
function R1(n) {
  if (!(n instanceof Object) || typeof n.kind != "number" || typeof n.content != "string" || typeof n.created_at != "number" || typeof n.pubkey != "string" || !n.pubkey.match(/^[a-f0-9]{64}$/) || !Array.isArray(n.tags)) return !1;
  for (let e = 0; e < n.tags.length; e++) {
    let t = n.tags[e];
    if (!Array.isArray(t)) return !1;
    for (let r = 0; r < t.length; r++) if (typeof t[r] == "object") return !1;
  }
  return !0;
}
new TextDecoder("utf-8");
var B1 = new TextEncoder();
function Oi(n) {
  n.indexOf("://") === -1 && (n = "wss://" + n);
  let e = new URL(n);
  return e.pathname = e.pathname.replace(/\/+/g, "/"), e.pathname.endsWith("/") && (e.pathname = e.pathname.slice(0, -1)), (e.port === "80" && e.protocol === "ws:" || e.port === "443" && e.protocol === "wss:") && (e.port = ""), e.searchParams.sort(), e.hash = "", e.toString();
}
var U1 = class {
  value;
  next = null;
  prev = null;
  constructor(n) {
    this.value = n;
  }
}, P1 = class {
  first;
  last;
  constructor() {
    this.first = null, this.last = null;
  }
  enqueue(n) {
    const e = new U1(n);
    return this.last ? this.last === this.first ? (this.last = e, this.last.prev = this.first, this.first.next = e) : (e.prev = this.last, this.last.next = e, this.last = e) : (this.first = e, this.last = e), !0;
  }
  dequeue() {
    if (!this.first) return null;
    if (this.first === this.last) {
      const e = this.first;
      return this.first = null, this.last = null, e.value;
    }
    const n = this.first;
    return this.first = n.next, n.value;
  }
};
function Xa(n) {
  return rn(Bs(B1.encode((function(e) {
    if (!R1(e)) throw new Error("can't serialize event with wrong or missing properties");
    return JSON.stringify([0, e.pubkey, e.created_at, e.kind, e.tags, e.content]);
  })(n))));
}
var $o = new class {
  generateSecretKey() {
    return kr.utils.randomPrivateKey();
  }
  getPublicKey(n) {
    return rn(kr.getPublicKey(n));
  }
  finalizeEvent(n, e) {
    const t = n;
    return t.pubkey = rn(kr.getPublicKey(e)), t.id = Xa(t), t.sig = rn(kr.sign(Xa(t), e)), t[Ts] = !0, t;
  }
  verifyEvent(n) {
    if (typeof n[Ts] == "boolean") return n[Ts];
    const e = Xa(n);
    if (e !== n.id) return n[Ts] = !1, !1;
    try {
      const t = kr.verify(n.sig, e, n.pubkey);
      return n[Ts] = t, t;
    } catch {
      return n[Ts] = !1, !1;
    }
  }
}(), z1 = ($o.generateSecretKey, $o.getPublicKey, $o.finalizeEvent, $o.verifyEvent);
function H1(n, e) {
  if (n.ids && n.ids.indexOf(e.id) === -1 || n.kinds && n.kinds.indexOf(e.kind) === -1 || n.authors && n.authors.indexOf(e.pubkey) === -1) return !1;
  for (let t in n) if (t[0] === "#") {
    let r = n[`#${t.slice(1)}`];
    if (r && !e.tags.find((([i, a]) => i === t.slice(1) && r.indexOf(a) !== -1))) return !1;
  }
  return !(n.since && e.created_at < n.since) && !(n.until && e.created_at > n.until);
}
async function q1() {
  return new Promise(((n) => {
    const e = new MessageChannel(), t = () => {
      e.port1.removeEventListener("message", t), n();
    };
    e.port1.addEventListener("message", t), e.port2.postMessage(0), e.port1.start();
  }));
}
var Dh, j1 = (n) => (n[Ts] = !0, !0), Oh = class {
  url;
  _connected = !1;
  onclose = null;
  onnotice = (n) => {
  };
  _onauth = null;
  baseEoseTimeout = 4400;
  connectionTimeout = 4400;
  publishTimeout = 4400;
  openSubs = /* @__PURE__ */ new Map();
  connectionTimeoutHandle;
  connectionPromise;
  openCountRequests = /* @__PURE__ */ new Map();
  openEventPublishes = /* @__PURE__ */ new Map();
  ws;
  incomingMessageQueue = new P1();
  queueRunning = !1;
  challenge;
  serial = 0;
  verifyEvent;
  _WebSocket;
  constructor(n, e) {
    this.url = Oi(n), this.verifyEvent = e.verifyEvent, this._WebSocket = e.websocketImplementation || WebSocket;
  }
  static async connect(n, e) {
    const t = new Oh(n, e);
    return await t.connect(), t;
  }
  closeAllSubscriptions(n) {
    for (let [e, t] of this.openSubs) t.close(n);
    this.openSubs.clear();
    for (let [e, t] of this.openEventPublishes) t.reject(new Error(n));
    this.openEventPublishes.clear();
    for (let [e, t] of this.openCountRequests) t.reject(new Error(n));
    this.openCountRequests.clear();
  }
  get connected() {
    return this._connected;
  }
  async connect() {
    return this.connectionPromise || (this.challenge = void 0, this.connectionPromise = new Promise(((n, e) => {
      this.connectionTimeoutHandle = setTimeout((() => {
        e("connection timed out"), this.connectionPromise = void 0, this.onclose?.(), this.closeAllSubscriptions("relay connection timed out");
      }), this.connectionTimeout);
      try {
        this.ws = new this._WebSocket(this.url);
      } catch (t) {
        return void e(t);
      }
      this.ws.onopen = () => {
        clearTimeout(this.connectionTimeoutHandle), this._connected = !0, n();
      }, this.ws.onerror = (t) => {
        e(t.message || "websocket error"), this._connected && (this._connected = !1, this.connectionPromise = void 0, this.onclose?.(), this.closeAllSubscriptions("relay connection errored"));
      }, this.ws.onclose = async () => {
        this._connected && (this._connected = !1, this.connectionPromise = void 0, this.onclose?.(), this.closeAllSubscriptions("relay connection closed"));
      }, this.ws.onmessage = this._onmessage.bind(this);
    }))), this.connectionPromise;
  }
  async runQueue() {
    for (this.queueRunning = !0; this.handleNext() !== !1; ) await q1();
    this.queueRunning = !1;
  }
  handleNext() {
    const n = this.incomingMessageQueue.dequeue();
    if (!n) return !1;
    const e = (function(t) {
      let r = t.slice(0, 22).indexOf('"EVENT"');
      if (r === -1) return null;
      let i = t.slice(r + 7 + 1).indexOf('"');
      if (i === -1) return null;
      let a = r + 7 + 1 + i, c = t.slice(a + 1, 80).indexOf('"');
      if (c === -1) return null;
      let d = a + 1 + c;
      return t.slice(a + 1, d);
    })(n);
    if (e) {
      const t = this.openSubs.get(e);
      if (!t) return;
      const r = (function(a, c) {
        let d = c.length + 3, h = a.indexOf(`"${c}":`) + d, g = a.slice(h).indexOf('"') + h + 1;
        return a.slice(g, g + 64);
      })(n, "id"), i = t.alreadyHaveEvent?.(r);
      if (t.receivedEvent?.(this, r), i) return;
    }
    try {
      let t = JSON.parse(n);
      switch (t[0]) {
        case "EVENT": {
          const r = this.openSubs.get(t[1]), i = t[2];
          return void (this.verifyEvent(i) && (function(a, c) {
            for (let d = 0; d < a.length; d++) if (H1(a[d], c)) return !0;
            return !1;
          })(r.filters, i) && r.onevent(i));
        }
        case "COUNT": {
          const r = t[1], i = t[2], a = this.openCountRequests.get(r);
          return void (a && (a.resolve(i.count), this.openCountRequests.delete(r)));
        }
        case "EOSE": {
          const r = this.openSubs.get(t[1]);
          return r ? void r.receivedEose() : void 0;
        }
        case "OK": {
          const r = t[1], i = t[2], a = t[3], c = this.openEventPublishes.get(r);
          return void (c && (i ? c.resolve(a) : c.reject(new Error(a)), this.openEventPublishes.delete(r)));
        }
        case "CLOSED": {
          const r = t[1], i = this.openSubs.get(r);
          return i ? (i.closed = !0, void i.close(t[2])) : void 0;
        }
        case "NOTICE":
          return void this.onnotice(t[1]);
        case "AUTH":
          return this.challenge = t[1], void this._onauth?.(t[1]);
      }
    } catch {
      return;
    }
  }
  async send(n) {
    if (!this.connectionPromise) throw new Error("sending on closed connection");
    this.connectionPromise.then((() => {
      this.ws?.send(n);
    }));
  }
  async auth(n) {
    if (!this.challenge) throw new Error("can't perform auth, no challenge was received");
    const e = await n((function(r, i) {
      return { kind: 22242, created_at: Math.floor(Date.now() / 1e3), tags: [["relay", r], ["challenge", i]], content: "" };
    })(this.url, this.challenge)), t = new Promise(((r, i) => {
      this.openEventPublishes.set(e.id, { resolve: r, reject: i });
    }));
    return this.send('["AUTH",' + JSON.stringify(e) + "]"), t;
  }
  async publish(n) {
    const e = new Promise(((t, r) => {
      this.openEventPublishes.set(n.id, { resolve: t, reject: r });
    }));
    return this.send('["EVENT",' + JSON.stringify(n) + "]"), setTimeout((() => {
      const t = this.openEventPublishes.get(n.id);
      t && (t.reject(new Error("publish timed out")), this.openEventPublishes.delete(n.id));
    }), this.publishTimeout), e;
  }
  async count(n, e) {
    this.serial++;
    const t = e?.id || "count:" + this.serial, r = new Promise(((i, a) => {
      this.openCountRequests.set(t, { resolve: i, reject: a });
    }));
    return this.send('["COUNT","' + t + '",' + JSON.stringify(n).substring(1)), r;
  }
  subscribe(n, e) {
    const t = this.prepareSubscription(n, e);
    return t.fire(), t;
  }
  prepareSubscription(n, e) {
    this.serial++;
    const t = e.id || "sub:" + this.serial, r = new F1(this, t, n, e);
    return this.openSubs.set(t, r), r;
  }
  close() {
    this.closeAllSubscriptions("relay connection closed by us"), this._connected = !1, this.ws?.close();
  }
  _onmessage(n) {
    this.incomingMessageQueue.enqueue(n.data), this.queueRunning || this.runQueue();
  }
}, F1 = class {
  relay;
  id;
  closed = !1;
  eosed = !1;
  filters;
  alreadyHaveEvent;
  receivedEvent;
  onevent;
  oneose;
  onclose;
  eoseTimeout;
  eoseTimeoutHandle;
  constructor(n, e, t, r) {
    this.relay = n, this.filters = t, this.id = e, this.alreadyHaveEvent = r.alreadyHaveEvent, this.receivedEvent = r.receivedEvent, this.eoseTimeout = r.eoseTimeout || n.baseEoseTimeout, this.oneose = r.oneose, this.onclose = r.onclose, this.onevent = r.onevent || ((i) => {
    });
  }
  fire() {
    this.relay.send('["REQ","' + this.id + '",' + JSON.stringify(this.filters).substring(1)), this.eoseTimeoutHandle = setTimeout(this.receivedEose.bind(this), this.eoseTimeout);
  }
  receivedEose() {
    this.eosed || (clearTimeout(this.eoseTimeoutHandle), this.eosed = !0, this.oneose?.());
  }
  close(n = "closed by caller") {
    !this.closed && this.relay.connected && (this.relay.send('["CLOSE",' + JSON.stringify(this.id) + "]"), this.closed = !0), this.relay.openSubs.delete(this.id), this.onclose?.(n);
  }
}, Z1 = class {
  relays = /* @__PURE__ */ new Map();
  seenOn = /* @__PURE__ */ new Map();
  trackRelays = !1;
  verifyEvent;
  trustedRelayURLs = /* @__PURE__ */ new Set();
  _WebSocket;
  constructor(n) {
    this.verifyEvent = n.verifyEvent, this._WebSocket = n.websocketImplementation;
  }
  async ensureRelay(n, e) {
    n = Oi(n);
    let t = this.relays.get(n);
    return t || (t = new Oh(n, { verifyEvent: this.trustedRelayURLs.has(n) ? j1 : this.verifyEvent, websocketImplementation: this._WebSocket }), e?.connectionTimeout && (t.connectionTimeout = e.connectionTimeout), this.relays.set(n, t)), await t.connect(), t;
  }
  close(n) {
    n.map(Oi).forEach(((e) => {
      this.relays.get(e)?.close();
    }));
  }
  subscribeMany(n, e, t) {
    return this.subscribeManyMap(Object.fromEntries(n.map(((r) => [r, e]))), t);
  }
  subscribeManyMap(n, e) {
    this.trackRelays && (e.receivedEvent = (m, v) => {
      let D = this.seenOn.get(v);
      D || (D = /* @__PURE__ */ new Set(), this.seenOn.set(v, D)), D.add(m);
    });
    const t = /* @__PURE__ */ new Set(), r = [], i = Object.keys(n).length, a = [];
    let c = (m) => {
      a[m] = !0, a.filter(((v) => v)).length === i && (e.oneose?.(), c = () => {
      });
    };
    const d = [];
    let h = (m, v) => {
      c(m), d[m] = v, d.filter(((D) => D)).length === i && (e.onclose?.(d), h = () => {
      });
    };
    const g = (m) => {
      if (e.alreadyHaveEvent?.(m)) return !0;
      const v = t.has(m);
      return t.add(m), v;
    }, b = Promise.all(Object.entries(n).map((async (m, v, D) => {
      if (D.indexOf(m) !== v) return void h(v, "duplicate url");
      let C, [E, N] = m;
      E = Oi(E);
      try {
        C = await this.ensureRelay(E, { connectionTimeout: e.maxWait ? Math.max(0.8 * e.maxWait, e.maxWait - 1e3) : void 0 });
      } catch (H) {
        return void h(v, H?.message || String(H));
      }
      let V = C.subscribe(N, { ...e, oneose: () => c(v), onclose: (H) => h(v, H), alreadyHaveEvent: g, eoseTimeout: e.maxWait });
      r.push(V);
    })));
    return { async close() {
      await b, r.forEach(((m) => {
        m.close();
      }));
    } };
  }
  subscribeManyEose(n, e, t) {
    const r = this.subscribeMany(n, e, { ...t, oneose() {
      r.close();
    } });
    return r;
  }
  async querySync(n, e, t) {
    return new Promise((async (r) => {
      const i = [];
      this.subscribeManyEose(n, [e], { ...t, onevent(a) {
        i.push(a);
      }, onclose(a) {
        r(i);
      } });
    }));
  }
  async get(n, e, t) {
    e.limit = 1;
    const r = await this.querySync(n, e, t);
    return r.sort(((i, a) => a.created_at - i.created_at)), r[0] || null;
  }
  publish(n, e) {
    return n.map(Oi).map((async (t, r, i) => {
      if (i.indexOf(t) !== r) return Promise.reject("duplicate url");
      let a = await this.ensureRelay(t);
      return a.publish(e).then(((c) => {
        if (this.trackRelays) {
          let d = this.seenOn.get(e.id);
          d || (d = /* @__PURE__ */ new Set(), this.seenOn.set(e.id, d)), d.add(a);
        }
        return c;
      }));
    }));
  }
  listConnectionStatus() {
    const n = /* @__PURE__ */ new Map();
    return this.relays.forEach(((e, t) => n.set(t, e.connected))), n;
  }
  destroy() {
    this.relays.forEach(((n) => n.close())), this.relays = /* @__PURE__ */ new Map();
  }
};
try {
  Dh = WebSocket;
} catch {
}
var Nh = class extends Z1 {
  constructor() {
    super({ verifyEvent: z1, websocketImplementation: Dh });
  }
};
class Bi {
  static instance = null;
  #e;
  #t;
  #n = !0;
  #r;
  constructor() {
    return Bi.instance ? Bi.instance : (this.#i(), Bi.instance = this, this);
  }
  #i() {
    if (this.#e = We.PROFILE_CONFIG, this.#t = new Nh(), !this.#t?.ensureRelay) throw new Error("Failed to initialize SimplePool");
    this.#r = new M1({ simplePool: this.#t, config: { ...this.#e, RELAYS: this.#e.RELAYS || [] } });
  }
  get isInitialized() {
    return this.#n;
  }
  async fetchProfiles(e) {
    if (!Array.isArray(e) || e.length === 0) return [];
    const t = Date.now(), r = new Array(e.length), i = e.reduce(((a, c, d) => {
      const h = Re.getProfile(c);
      return this.#a(h, t) ? r[d] = h : a.push({ index: d, pubkey: c }), a;
    }), []);
    return i.length > 0 && await this.#s(i, r, e), r;
  }
  async processBatchProfiles(e) {
    const t = this.#l(e);
    if (t.length !== 0) try {
      await Promise.all([this.fetchProfiles(t), ...t.map(((r) => this.verifyNip05Async(r)))]);
    } catch {
    }
  }
  async verifyNip05Async(e) {
    const t = Re.getNip05(e);
    if (t !== void 0) return t;
    const r = Re.getNip05PendingFetch(e);
    if (r) return r;
    const i = this.#h(e);
    return Re.setNip05PendingFetch(e, i), i;
  }
  getNip05(e) {
    return Re.getNip05(e);
  }
  clearCache() {
    Re.clearAll(), this.#r.clearPendingFetches();
  }
  #a(e, t) {
    return e && e._lastUpdated && t - e._lastUpdated < 18e5;
  }
  #l(e) {
    return [...new Set(e?.map(((t) => t?.pubkey))?.filter(((t) => t && typeof t == "string" && t.length === 64)))];
  }
  async #s(e, t, r) {
    if (!e.length) return;
    const i = Date.now(), a = e.filter((({ pubkey: d }) => d && typeof d == "string" && d.length === 64));
    if (a.length === 0) return;
    const c = await Promise.all(a.map((({ pubkey: d }) => this.#o(d, i))));
    a.forEach((({ index: d }, h) => {
      d >= 0 && d < t.length && (t[d] = c[h], r[d] && Re.setProfile(r[d], c[h]));
    }));
  }
  async #o(e, t) {
    if (!e || typeof e != "string" || e.length !== 64) return this.#c();
    try {
      const r = { kinds: [0], authors: [e], limit: 1 }, i = await this.#r.getOrCreateFetchPromise(e, r);
      if (!i?.content) return this.#c();
      let a;
      try {
        a = JSON.parse(i.content);
      } catch {
        return this.#c();
      }
      return { ...a, name: Th(a) || "nameless", _lastUpdated: t, _eventCreatedAt: i.created_at };
    } catch {
      return this.#c();
    }
  }
  async #h(e) {
    try {
      const [t] = await this.fetchProfiles([e]);
      if (!t?.nip05) return Re.setNip05(e, null), null;
      const r = await Promise.race([C1(t.nip05, e), new Promise(((a, c) => setTimeout((() => c(new Error("NIP-05 timeout"))), 5e3)))]);
      if (!r) return Re.setNip05(e, null), null;
      const i = Js(r.startsWith("_@") ? r.slice(1) : r);
      return Re.setNip05(e, i), i;
    } catch {
      return Re.setNip05(e, null), null;
    } finally {
      Re.deleteNip05PendingFetch(e);
    }
  }
  #c() {
    return { name: "anonymous", display_name: "anonymous" };
  }
}
const ji = new Bi();
class V1 {
  async loadAndUpdate(e, t) {
    if (e) try {
      const r = t.querySelector(".sender-name"), i = t.querySelector(".zap-placeholder-name"), a = t.querySelector(".sender-icon"), c = a?.querySelector(".zap-placeholder-icon"), d = t.querySelector(".sender-pubkey");
      let h = Re.getProfile(e);
      const g = h ? Th(h) || "nameless" : "anonymous", b = h?.picture ? (function(m) {
        if (!m || typeof m != "string") return null;
        try {
          const v = new URL(m);
          return ["http:", "https:"].includes(v.protocol) ? v.href : null;
        } catch {
          return null;
        }
      })(h.picture) : null;
      this.#e(i, r, g), this.#n(c, a, b, g), this.#r(d, e);
    } catch {
      this.#i(t);
    }
  }
  #e(e, t, r) {
    e ? e.replaceWith(Object.assign(document.createElement("span"), { className: "sender-name", textContent: r })) : t && (t.textContent = r);
  }
  #t(e, t = "anonymous user's icon") {
    const r = `https://robohash.org/${e}.png?set=set5&bgset=bg2&size=128x128`, i = Re.getImageCache(r), a = Object.assign(document.createElement("img"), { alt: t, loading: "lazy", className: "profile-icon" });
    if (i) return a.src = r, a;
    const c = new Image();
    return c.onerror = () => {
      a.src = od, Re.setImageCache(r, od);
    }, c.onload = () => {
      Re.setImageCache(r, c);
    }, c.src = r, a.src = r, a;
  }
  #n(e, t, r, i) {
    if (e && t) {
      const a = (c) => {
        e.remove();
        const d = t.querySelector("img"), h = t.querySelector("a");
        d && d.remove(), h && h.remove();
        const g = c === "robohash" ? this.#t(t.closest("[data-pubkey]")?.dataset.pubkey, `${Js(i)}'s icon`) : Object.assign(document.createElement("img"), { src: c, alt: `${Js(i)}'s icon`, loading: "lazy", className: "profile-icon" }), b = t.closest("[data-pubkey]")?.dataset.pubkey;
        if (b) {
          const m = (function(D, C = []) {
            try {
              return window.NostrTools.nip19.nprofileEncode({ pubkey: D, relays: C });
            } catch {
              return null;
            }
          })(b), v = Object.assign(document.createElement("a"), { href: `https://njump.me/${m}`, target: "_blank", rel: "noopener noreferrer" });
          v.appendChild(g), t.appendChild(v);
        } else t.appendChild(g);
      };
      if (r) {
        const c = new Image();
        c.onload = () => {
          Re.setImageCache(r, c), a(r);
        }, c.onerror = () => {
          a("robohash");
        }, c.src = r;
      } else a("robohash");
    }
  }
  #r(e, t) {
    if (e && !e.getAttribute("data-nip05-updated")) {
      const r = ji.getNip05(t);
      r ? (e.textContent = r, e.setAttribute("data-nip05-updated", "true")) : ji.verifyNip05Async(t).then(((i) => {
        i && (e.textContent = i, e.setAttribute("data-nip05-updated", "true"));
      }));
    }
  }
  #i(e) {
    const t = e.querySelector(".zap-placeholder-icon");
    if (t) {
      const r = t.parentElement, i = e.closest("[data-pubkey]")?.dataset.pubkey;
      t.remove(), r.appendChild(this.#t(i));
    }
  }
  async updateProfileElement(e, t) {
    if (!e || !t) return;
    const r = e.querySelector(".sender-icon img, .zap-placeholder-icon");
    if (r) if (t.picture) {
      const a = document.createElement("img");
      a.alt = t.name || "Profile Picture", a.width = 32, a.height = 32, a.className = "profile-icon", a.onerror = () => {
        const c = e.getAttribute("data-pubkey");
        if (c) {
          const d = this.#t(c, t.name || "anonymous user");
          a.parentElement && a.parentElement.replaceChild(d, a);
        }
      }, a.src = t.picture, r.parentElement && r.parentElement.replaceChild(a, r);
    } else {
      const a = e.getAttribute("data-pubkey");
      if (a) {
        const c = this.#t(a, t.name || "anonymous user");
        r.parentElement && r.parentElement.replaceChild(c, r);
      }
    }
    const i = e.querySelector(".sender-name, .zap-placeholder-name");
    if (i && (i.textContent = t.display_name || t.name || "anonymous", i.className = "sender-name"), t.nip05) {
      const a = e.getAttribute("data-pubkey");
      if (a) {
        const c = e.querySelector('[data-nip05-target="true"]');
        c && await this.updateNip05Display(a, c);
      }
    }
  }
}
class Rn {
  static #e = { 1: "content", 30023: "title", 30030: "title", 30009: "name", 40: "content", 42: "name", 31990: "alt" };
  static #t = { UI_COMPONENTS: "Failed to create UI components:", ZAP_ITEM: "Failed to create zap item HTML:", REFERENCE: "Reference component creation failed:" };
  static createUIComponents(e, t, r) {
    try {
      const i = this.viewConfigs?.get(t), a = r || i?.identifier, c = si(a) ? null : this.#s(e);
      return { iconComponent: this.#n(), nameComponent: this.#h(e), pubkeyComponent: this.#c(e, a), referenceComponent: this.#f(c) };
    } catch {
      return this.#r();
    }
  }
  static #n() {
    return '<div class="zap-placeholder-icon skeleton"></div>';
  }
  static #r() {
    return { iconComponent: '<div class="zap-placeholder-icon skeleton"></div>', nameComponent: '<div class="zap-placeholder-name skeleton"></div>', pubkeyComponent: "", referenceComponent: "" };
  }
  static createReferenceComponent(e) {
    return this.#f(this.#s({ reference: e }));
  }
  static addReferenceToElement(e, t) {
    if (!this.#i(e, t)) return;
    const r = e.querySelector(".zap-content");
    this.#a(r, t);
  }
  static #i(e, t) {
    return e && t && e.querySelector(".zap-content");
  }
  static #a(e, t) {
    e.querySelectorAll(".zap-reference").forEach(((i) => i.remove()));
    const r = this.createReferenceComponent({ reference: t });
    e.insertAdjacentHTML("beforeend", r);
  }
  static getDialogTemplate() {
    return `
      <dialog class="dialog">
        <h2 class="dialog-title"><a href="#" target="_blank"></a></h2>
        <button class="close-dialog-button">X</button>
        <div class="zap-stats"></div>
        <ul class="dialog-zap-list"></ul>
      </dialog>
    `;
  }
  static createZapItemHTML(e, t, r, i) {
    try {
      const a = this.createUIComponents(e, r, i);
      return this.#l(e, t, a);
    } catch {
      return "";
    }
  }
  static createNoZapsMessageHTML(e) {
    return `
      <div class="no-zaps-container">
        <div class="no-zaps-message">${e}</div>
      </div>
    `;
  }
  static #l(e, t, r) {
    const [i, a] = e.satsText.split(" "), c = (d = e.created_at, Math.floor(Date.now() / 1e3) - d < 86400);
    var d;
    return `
      <div class="zap-content">
        <div class="zap-sender${e.comment ? " with-comment" : ""}" data-pubkey="${e.pubkey}">
          <div class="sender-icon${c ? " is-new" : ""}">
            ${r.iconComponent}
          </div>
          <div class="sender-info">
            ${r.nameComponent}
            ${r.pubkeyComponent}
          </div>
          <div class="zap-amount ${t}"><span class="number">${i}</span> ${a}</div>
        </div>
        ${e.comment ? `<div class="zap-details"><span class="zap-comment">${Js(e.comment)}</span></div>` : ""}
        ${r.referenceComponent}
      </div>
    `;
  }
  static #s(e) {
    if (!e) return null;
    if (this.#o(e)) return e;
    if (e.reference && typeof e.reference == "object") {
      if (e.reference.reference && this.#o(e.reference.reference)) return e.reference.reference;
      if (this.#o(e.reference)) return e.reference;
    }
    return null;
  }
  static #o(e) {
    return e && typeof e == "object" && "id" in e && "tags" in e && Array.isArray(e.tags) && "content" in e && "kind" in e;
  }
  static #h({ senderName: e }) {
    return e ? `<span class="sender-name">${Js(e)}</span>` : '<div class="zap-placeholder-name skeleton"></div>';
  }
  static #c({ pubkey: e, displayIdentifier: t, reference: r }, i) {
    const a = !si(i), c = `class="sender-pubkey" data-pubkey="${e}"`;
    return r && a ? `<span ${c}>${t}</span>` : `<span ${c} data-nip05-target="true">${t}</span>`;
  }
  static #f(e) {
    if (!this.#o(e)) return "";
    const t = e.id, r = Re.getReferenceComponent(t);
    if (r) return r;
    try {
      const i = this.#g(e), a = this.#p(e), c = this.#d(i, a);
      return Re.setReferenceComponent(t, c), c;
    } catch {
      return "";
    }
  }
  static #g(e) {
    if (!e?.tags) return "";
    if (e.kind === 31990) return this.#v(e) || "";
    const t = Array.isArray(e.tags) ? e.tags.find(((r) => Array.isArray(r) && r[0] === "d")) : null;
    return t ? `https://njump.me/${(function(r, i, a, c = []) {
      try {
        return window.NostrTools.nip19.naddrEncode({ kind: r, pubkey: i, identifier: a, relays: c });
      } catch {
        return null;
      }
    })(e.kind, e.pubkey, t[1])}` : e.id ? `https://njump.me/${(function(r, i, a, c = []) {
      try {
        return window.NostrTools.nip19.neventEncode({ id: r, kind: i, pubkey: a, relays: c });
      } catch {
        return null;
      }
    })(e.id, e.kind, e.pubkey)}` : "";
  }
  static #v(e) {
    const t = e.tags.filter(((i) => i[0] === "r"));
    return (t.find(((i) => !i.includes("source"))) || t[0])?.[1];
  }
  static #p(e) {
    if (!e) return "";
    const t = Rn.#e[e.kind];
    if (t) {
      const r = e.tags.find(((i) => Array.isArray(i) && i[0] === t));
      if (r && r[1]) return r[1];
    }
    if (e.kind === 40) try {
      return JSON.parse(e.content).name || e.content;
    } catch {
    }
    return e.content || "";
  }
  static #d(e, t) {
    return `
      <div class="zap-reference">
        <div class="reference-arrow">
          <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAtOTYwIDk2MCA5NjAiIHdpZHRoPSIyNHB4IiBmaWxsPSIjODg4Ij4NCiAgICA8cGF0aCBkPSJtNTYwLTEyMC01Ny01NyAxNDQtMTQzSDIwMHYtNDgwaDgwdjQwMGgzNjdMNTAzLTU0NGw1Ni01NyAyNDEgMjQxLTI0MCAyNDBaIiAvPg0KPC9zdmc+" alt="Reference" width="18" height="18" />
        </div>
        <div class="reference-text">${Js(t)}</div>
        <a href="${e}" target="_blank" class="reference-link">
          <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAtOTYwIDk2MCA5NjAiIHdpZHRoPSIyNHB4IiBmaWxsPSIjODg4Ij4NCiAgICA8cGF0aA0KICAgICAgICBkPSJNNDQwLTI4MEgyODBxLTgzIDAtMTQxLjUtNTguNVQ4MC00ODBxMC04MyA1OC41LTE0MS41VDI4MC02ODBoMTYwdjgwSDI4MHEtNTAgMC04NSAzNXQtMzUgODVxMCA1MCAzNSA4NXQ4NSAzNWgxNjB2ODBaTTMyMC00NDB2LTgwaDMyMHY4MEgzMjBabTIwMCAxNjB2LTgwaDE2MHE1MCAwIDg1LTM1dDM1LTg1cTAtNTAtMzUtODV0LTg1LTM1SDUyMHYtODBoMTYwcTgzIDAgMTQxLjUgNTguNVQ4ODAtNDgwcTAgODMtNTguNSAxNDEuNVQ2ODAtMjgwSDUyMFoiIC8+DQo8L3N2Zz4=" alt="Quick Reference" width="16" height="16" />
        </a>
      </div>
    `;
  }
  static ZapInfo = class {
    #u;
    constructor(e) {
      this.#u = e;
    }
    static async createFromEvent(e, t = {}) {
      return await new Rn.ZapInfo(e).extractInfo(t);
    }
    static getAmountColorClass(e, t) {
      return (t === void 0 ? We.ZAP_AMOUNT_CONFIG.DEFAULT_COLOR_MODE : t) ? this.#b(e) : We.ZAP_AMOUNT_CONFIG.DISABLED_CLASS;
    }
    static #b(e) {
      const { THRESHOLDS: t, DEFAULT_CLASS: r } = We.ZAP_AMOUNT_CONFIG;
      return t.find(((i) => e >= i.value))?.className || r;
    }
    async extractInfo(e = {}) {
      const t = this.#u.id, r = Re.getZapInfo(t);
      if (r) return r.colorClass = Rn.ZapInfo.getAmountColorClass(r.satsAmount, e.isColorModeEnabled), r;
      try {
        const { pubkey: a, content: c, satsText: d } = await T1(this.#u), h = parseInt(d.replace(/,/g, "").split(" ")[0], 10), g = typeof a == "string" ? a : null, b = this.#u.reference || null, m = { satsText: d, satsAmount: h, comment: c || "", pubkey: g || "", created_at: this.#u.created_at, displayIdentifier: g ? Lh(I1(g)) : "anonymous", senderName: null, senderIcon: null, reference: b, colorClass: Rn.ZapInfo.getAmountColorClass(h, e?.isColorModeEnabled) };
        return Re.setZapInfo(t, m), m;
      } catch {
        const c = { satsText: "Amount: Unknown", satsAmount: 0, comment: "", pubkey: "", created_at: this.#u.created_at, displayIdentifier: "anonymous", senderName: "anonymous", senderIcon: i, reference: null };
        return Re.setZapInfo(t, c), c;
      }
      var i;
    }
    static async batchExtractInfo(e, t = !0) {
      const r = /* @__PURE__ */ new Map();
      return await Promise.all(e.map((async (i) => {
        const a = new Rn.ZapInfo(i), c = await a.extractInfo({ isColorModeEnabled: t });
        r.set(i.id, c);
      }))), r;
    }
  };
  static viewConfigs = /* @__PURE__ */ new Map();
}
class W1 {
  constructor(e, t) {
    this.viewId = e, this.config = t;
  }
  async createListItem(e) {
    const t = await Rn.ZapInfo.createFromEvent(e, { isColorModeEnabled: this.config?.isColorModeEnabled }), r = document.createElement("li");
    return r.className = `zap-list-item ${t.colorClass}${t.comment ? " with-comment" : ""}`, r.setAttribute("data-pubkey", t.pubkey), e?.id && r.setAttribute("data-event-id", e.id), r.innerHTML = Rn.createZapItemHTML(t, t.colorClass, this.viewId), r.setAttribute("data-timestamp", e.created_at.toString()), { li: r, zapInfo: t };
  }
}
class G1 {
  constructor(e, t, r, i) {
    if (!e) throw new Error("shadowRoot is required");
    if (!i) throw new Error("config is required");
    this.shadowRoot = e, this.profileUI = t, this.viewId = r, this.config = i, this.itemBuilder = new W1(r, this.config), this.profileUpdateUnsubscribe = null, this.#g();
  }
  destroy() {
    this.profileUpdateUnsubscribe && (this.profileUpdateUnsubscribe(), this.profileUpdateUnsubscribe = null);
    const e = this.#e(".dialog-zap-list");
    e && (e.innerHTML = "");
  }
  #e(e) {
    return this.shadowRoot.querySelector(e);
  }
  getElementByEventId(e) {
    return this.#e(`.zap-list-item[data-event-id="${e}"]`);
  }
  async #t(e) {
    const t = this.#e(".dialog-zap-list");
    if (t) try {
      return this.#r(t), await e(t);
    } catch {
      t.children.length === 0 && this.showNoZapsMessage();
    }
  }
  #n(e, t) {
    const r = e.querySelector(".load-more-trigger");
    r && r.remove(), Array.from(t.children).forEach(((i) => {
      const a = i.getAttribute("data-event-id"), c = parseInt(i.getAttribute("data-timestamp"));
      let d = null;
      const h = Array.from(e.children);
      for (let g = 0; g < h.length; g++)
        if (c > parseInt(h[g].getAttribute("data-timestamp"))) {
          d = h[g];
          break;
        }
      e.querySelector(`.zap-list-item[data-event-id="${a}"]`) || (d ? e.insertBefore(i, d) : e.appendChild(i));
    })), r && e.appendChild(r);
  }
  #r(e) {
    const t = e.querySelector(".no-zaps-message");
    t && t.remove();
  }
  async #i(e, t) {
    return this.#t((async (r) => {
      const { li: i, zapInfo: a } = await this.itemBuilder.createListItem(e);
      return t(r, i), await this.#d(a.pubkey, i), { li: i, zapInfo: a };
    }));
  }
  async renderZapListFromCache(e) {
    if (!e?.length) return Re.setNoZapsState(this.viewId, !1), this.showNoZapsMessage();
    await this.#t((async (t) => {
      const { initialBatch: r, remainingBatch: i } = this.#a(e), { fragment: a, profileUpdates: c } = await this.#l(r);
      this.#n(t, a), i.length > 0 ? this.#s(i, t, c) : await this.#p(c);
    }));
  }
  #a(e) {
    const t = this.#b(e), r = We.DIALOG_CONFIG.ZAP_LIST.INITIAL_BATCH;
    return { initialBatch: t.slice(0, r), remainingBatch: t.slice(r) };
  }
  async #l(e) {
    const t = document.createDocumentFragment(), r = [];
    for (const i of e) {
      const { li: a, zapInfo: c } = await this.itemBuilder.createListItem(i);
      this.#m(i.id, a), t.appendChild(a), c.pubkey && r.push({ pubkey: c.pubkey, element: a });
    }
    return { fragment: t, profileUpdates: r };
  }
  #s(e, t, r) {
    if (!e.length) return;
    const i = We.DIALOG_CONFIG.ZAP_LIST.REMAINING_BATCH;
    let a = 0;
    const c = async () => {
      if (a >= e.length) return void await this.#p(r);
      const d = e.slice(a, a + i);
      await this.#o(d, t, r), a += i, setTimeout((() => c()), 0);
    };
    requestIdleCallback((() => c()));
  }
  async #o(e, t, r) {
    const i = document.createDocumentFragment();
    await Promise.all(e.map((async (c) => {
      const { li: d, zapInfo: h } = await this.itemBuilder.createListItem(c);
      this.#m(c.id, d), i.appendChild(d), h.pubkey && r.push({ pubkey: h.pubkey, element: d });
    })));
    const a = t.querySelector(".load-more-trigger");
    a && a.remove(), t.appendChild(i), a && t.appendChild(a), await new Promise(((c) => requestAnimationFrame(c)));
  }
  async prependZap(e) {
    return this.#i(e, ((t, r) => t.prepend(r)));
  }
  async appendZap(e) {
    return this.#i(e, ((t, r) => {
      const i = this.#f(t, e.created_at);
      i ? t.insertBefore(r, i) : t.appendChild(r);
    }));
  }
  async replacePlaceholderWithZap(e, t) {
    const r = this.#e(`[data-index="${t}"]`);
    if (this.#y(r)) try {
      const { zapInfo: i } = await this.itemBuilder.createListItem(e);
      this.#w(r, i, e.id), await this.#d(i.pubkey, r);
    } catch {
      r.remove();
    }
  }
  async showNoZapsMessage() {
    const e = this.#e(".dialog-zap-list");
    if (e) {
      if (Re.hasNoZaps(this.viewId)) return void this.#c(e);
      await this.#h() || (this.#c(e), Re.setNoZapsState(this.viewId, !0));
    }
  }
  async #h() {
    const e = this.config.noZapsDelay || We.DIALOG_CONFIG.DEFAULT_NO_ZAPS_DELAY;
    await new Promise(((r) => setTimeout(r, e)));
    const t = Re.getZapEvents(this.viewId);
    return !!t?.length && (await this.renderZapListFromCache(t), !0);
  }
  #c(e) {
    const t = this.config.noZapsMessage || We.DIALOG_CONFIG.NO_ZAPS_MESSAGE;
    e.innerHTML = Rn.createNoZapsMessageHTML(t), e.style.minHeight = We.DIALOG_CONFIG.ZAP_LIST.MIN_HEIGHT;
  }
  async batchUpdate(e, t = {}) {
    const r = this.#e(".dialog-zap-list");
    if (r) try {
      const i = new Map(Array.from(r.querySelectorAll(".zap-list-item")).map(((g) => [g.getAttribute("data-event-id"), g]))), a = this.#b(e), c = si(this.config.identifier), d = a.filter(((g) => {
        const b = i.get(g.id);
        return c ? !b : !b || g.reference && !b.querySelector(".zap-reference");
      }));
      if (d.length === 0 && !t.isFullUpdate) return;
      const h = document.createDocumentFragment();
      for (const g of d) {
        const { li: b, zapInfo: m } = await this.itemBuilder.createListItem(g);
        !c && g.reference && this.updateZapReference(g), h.appendChild(b), m.pubkey && await this.#d(m.pubkey, b);
      }
      this.#n(r, h);
    } catch {
    }
  }
  #f(e, t) {
    return Array.from(e.children).find(((r) => {
      const i = parseInt(r.getAttribute("data-timestamp") || "0");
      return t > i;
    }));
  }
  updateZapReference(e) {
    if (e?.id && e?.reference) try {
      const t = this.getElementByEventId(e.id);
      if (!t) return;
      Rn.addReferenceToElement(t, e.reference), Re.setReference(e.id, e.reference);
    } catch {
    }
  }
  #g() {
    this.profileUpdateUnsubscribe = Re.subscribeToProfileUpdates(this.#v.bind(this));
  }
  async #v(e, t) {
    const r = this.shadowRoot.querySelectorAll(`[data-pubkey="${e}"]`);
    await Promise.allSettled(Array.from(r).map(((i) => this.profileUI.updateProfileElement(i, t))));
  }
  async #p(e) {
    const t = We.DIALOG_CONFIG.ZAP_LIST.PROFILE_BATCH;
    for (let r = 0; r < e.length; r += t) {
      const i = e.slice(r, r + t);
      await Promise.all(i.map((({ pubkey: a, element: c }) => this.#d(a, c)))), await new Promise(((a) => requestAnimationFrame(a)));
    }
  }
  async #d(e, t) {
    e && await this.#u(e, t);
  }
  async #u(e, t) {
    if (e && t) try {
      await this.profileUI.loadAndUpdate(e, t);
    } catch {
    }
  }
  #b(e) {
    return [...new Map(e.map(((t) => [t.id, t]))).values()].sort(((t, r) => r.created_at - t.created_at));
  }
  #m(e, t) {
    if (si(this.config.identifier)) return;
    const r = Re.getReference(e);
    r && Rn.addReferenceToElement(t, r);
  }
  #y(e) {
    return e && e.classList.contains("placeholder");
  }
  #w(e, t, r) {
    const i = this.itemBuilder.getAmountColorClass(t.satsAmount);
    e.className = `zap-list-item ${i}${t.comment ? " with-comment" : ""}`, e.setAttribute("data-pubkey", t.pubkey), e.setAttribute("data-event-id", r), e.innerHTML = Rn.createZapItemHTML(t, i, this.viewId), e.removeAttribute("data-index");
  }
}
var K1 = xn(0), Q1 = xn.n(K1);
const Fi = new class {
  #e = /* @__PURE__ */ new Map();
  #t = /* @__PURE__ */ new Map();
  constructor() {
  }
  async getZapStats(n, e) {
    const t = await this.#n(e, n);
    if (t) return t;
    const r = await this.fetchStats(n);
    return r && Re.updateStatsCache(e, n, r), r;
  }
  async fetchStats(n) {
    try {
      const e = await this._fetchFromApi(n);
      return this._formatStats(e) || this.createTimeoutError();
    } catch (e) {
      return this.handleFetchError(e);
    }
  }
  createTimeoutError() {
    return { error: !0, timeout: !0 };
  }
  handleFetchError(n) {
    return { error: !0, timeout: n.message === "STATS_TIMEOUT" };
  }
  async _fetchFromApi(n) {
    const e = ld(n);
    if (!e) return null;
    const t = `https://api.nostr.band/v0/stats/${e.type === "npub" || e.type === "nprofile" ? "profile" : "event"}/${n}`, r = new AbortController(), i = setTimeout((() => r.abort()), We.REQUEST_CONFIG.REQUEST_TIMEOUT);
    try {
      return await (await fetch(t, { signal: r.signal })).json();
    } catch (a) {
      throw a.name === "AbortError" ? new Error("STATS_TIMEOUT") : a;
    } finally {
      clearTimeout(i);
    }
  }
  _formatStats(n) {
    if (!n?.stats) return null;
    const e = Object.values(n.stats)[0];
    return e ? { count: parseInt(e.zaps_received?.count || e.zaps?.count || 0, 10), msats: parseInt(e.zaps_received?.msats || e.zaps?.msats || 0, 10), maxMsats: parseInt(e.zaps_received?.max_msats || e.zaps?.max_msats || 0, 10) } : null;
  }
  async initializeStats(n, e, t = !1) {
    if (t && this.displayStats({ skeleton: !0 }, e), this.#t.has(e)) return this.#t.get(e);
    if (ld(n)?.type === "naddr") {
      const a = this.createTimeoutError();
      return this.displayStats(a, e), this.#e.set(e, a), a;
    }
    const i = (async () => {
      try {
        const a = await this.getZapStats(n, e);
        return a && (this.displayStats(a, e), this.#e.set(e, a)), a;
      } catch {
        return null;
      } finally {
        this.#t.delete(e);
      }
    })();
    return this.#t.set(e, i), i;
  }
  async #n(n, e) {
    const t = Re.getCachedStats(n, e), r = Date.now();
    return t && r - t.timestamp < We.REQUEST_CONFIG.CACHE_DURATION ? t.stats : null;
  }
  getCurrentStats(n) {
    return this.#e.get(n);
  }
  async handleZapEvent(n, e, t) {
    if (n?.isRealTimeEvent) try {
      const r = n.tags.find(((h) => h[0].toLowerCase() === "bolt11"))?.[1], i = this.extractAmountFromBolt11(r);
      if (i <= 0) return;
      const a = Re.getViewStats(e), c = { count: a?.count || 0, msats: a?.msats || 0, maxMsats: a?.maxMsats || 0 }, d = { count: c.count + 1, msats: c.msats + i, maxMsats: Math.max(c.maxMsats, i) };
      Re.updateStatsCache(e, t, d), this.#e.set(e, d), await this.displayStats(d, e), n.isStatsCalculated = !0, n.amountMsats = i;
    } catch {
    }
  }
  extractAmountFromBolt11(n) {
    try {
      const e = window.decodeBolt11(n);
      return parseInt(e.sections.find(((t) => t.name === "amount"))?.value ?? "0", 10);
    } catch {
      return 0;
    }
  }
  async displayStats(n, e) {
    try {
      await X1(n, e);
    } catch {
    }
  }
}(), Ds = new class {
  #e;
  #t;
  #n;
  #r;
  #i;
  #a;
  #l;
  constructor() {
    this.#e = new Nh(), this.#s(), this.#o();
  }
  #s() {
    this.#n = /* @__PURE__ */ new Map(), this.#r = /* @__PURE__ */ new Map(), this.#i = /* @__PURE__ */ new Map(), this.#t = !1;
  }
  #o() {
    const n = { pool: this.#e, batchSize: We.BATCH_CONFIG.REFERENCE_PROCESSOR.BATCH_SIZE, batchDelay: We.BATCH_CONFIG.REFERENCE_PROCESSOR.BATCH_DELAY };
    this.#a = new O1(n), this.#l = new N1(n);
  }
  #h(n) {
    this.#n.has(n) || this.#n.set(n, { zap: null }), this.#r.has(n) || this.#r.set(n, { isZapClosed: !1 });
  }
  #c(n, e, t, r) {
    this.#n.get(n).zap = this.#e.subscribeMany(e.relayUrls, [t.req], r);
  }
  #f(n) {
    return n && n.id && Array.isArray(n.tags);
  }
  #g(n, e) {
    return n && this.#i.delete(n), null;
  }
  async connectToRelays(n) {
    this.#t || ([this.#a, this.#l].forEach(((e) => e.setRelayUrls(n))), this.#t = !0);
  }
  subscribeToZaps(n, e, t, r) {
    try {
      this.#v(t), this.#h(n), this.#r.get(n).isZapClosed = !1, this.#c(n, e, t, this.#p(r));
    } catch (i) {
      this.#d("Subscription error", i);
    }
  }
  #v(n) {
    if (!n?.req?.kinds || !Array.isArray(n.req.kinds)) throw new Error("Invalid subscription settings");
  }
  async fetchReference(n, e, t) {
    try {
      if (!this.#f(e)) return null;
      const r = e.tags.find(((h) => Array.isArray(h) && h[0] === t));
      if (!r) return null;
      const i = t === "e" ? r[1] : `${r[1]}`, a = Re.getReference(i);
      if (a) return a;
      const c = this.#i.get(i);
      if (c) return c;
      const d = t === "e" ? this.#a : this.#l;
      try {
        const h = await d.getOrCreateFetchPromise(i);
        return h && Re.setReference(i, h), this.#i.delete(i), h;
      } finally {
        this.#i.delete(i);
      }
    } catch (r) {
      return this.#g(e?.id, r);
    }
  }
  #p(n) {
    const e = Math.floor(Date.now() / 1e3);
    return { ...n, onevent: (t) => {
      t.isRealTimeEvent = t.created_at >= e, n.onevent(t);
    }, oneose: n.oneose };
  }
  #d(n, e) {
    throw e;
  }
  get zapPool() {
    return this.#e;
  }
}(), { zapPool: dm } = Ds, Sr = new class {
  constructor() {
    this.viewConfigs = /* @__PURE__ */ new Map(), this.configStore = /* @__PURE__ */ new Map(), this.observers = /* @__PURE__ */ new Map(), this.#e = /* @__PURE__ */ new Map(), this.#t = /* @__PURE__ */ new Map();
  }
  #e;
  #t;
  setZapListUI(n) {
    this.zapListUI = n;
  }
  setViewConfig(n, e) {
    this.viewConfigs.set(n, e), Rn.viewConfigs.set(n, e), Re.initializeZapView(n);
  }
  getViewConfig(n) {
    return this.viewConfigs.get(n);
  }
  async updateEventReference(n, e) {
    try {
      const t = this.getViewConfig(e);
      if (!t?.relayUrls?.length || si(t?.identifier || "")) return !1;
      const r = await this._fetchEventReference(n, t);
      return !!r && (n.reference = r, !0);
    } catch {
      return !1;
    }
  }
  async _fetchEventReference(n, e) {
    const t = async () => {
      if (!n?.tags || !Array.isArray(n.tags)) return null;
      try {
        if (n.tags.find(((a) => Array.isArray(a) && a[0] === "a"))?.[1]) return await Ds.fetchReference(e.relayUrls, n, "a");
        const i = n.tags.find(((a) => Array.isArray(a) && a[0] === "e"));
        return i?.[1] && /^[0-9a-f]{64}$/.test(i[1].toLowerCase()) ? await Ds.fetchReference(e.relayUrls, n, "e") : null;
      } catch {
        return null;
      }
    };
    try {
      return await Re.getOrFetchReference(n.id, t);
    } catch {
      return null;
    }
  }
  async updateEventReferenceBatch(n, e) {
    const t = this.getViewConfig(e);
    if (!t?.relayUrls?.length || si(t?.identifier || "")) return;
    const r = n.map(((i) => this.updateEventReference(i, e)));
    await Promise.allSettled(r);
  }
  updateUIReferences(n) {
    this.zapListUI && n.forEach(((e) => {
      e.reference && this.zapListUI.updateZapReference(e);
    }));
  }
  async initializeSubscriptions(n, e) {
    try {
      if (!this._isValidFilter(n)) throw new Error("Invalid filter settings");
      const t = ad(n.identifier);
      if (!t) throw new Error(We.ZAP_CONFIG.ERRORS.DECODE_FAILED);
      this._initializeLoadState(e), this._showInitialLoadingSpinner(e);
      const { batchEvents: r, lastEventTime: i } = await this._collectInitialEvents(e, n, t);
      r?.length > 0 && this._processBatchEvents(r, e).catch(console.error), await this.finalizeInitialization(e, i);
    } catch (t) {
      throw t;
    }
  }
  _showInitialLoadingSpinner(n) {
    const e = this._getListElement(n);
    if (e) {
      const t = this._createLoadTrigger();
      e.appendChild(t);
    }
  }
  async finalizeInitialization(n, e) {
    const t = Re.getZapEvents(n), r = this._getListElement(n), i = Re.updateLoadState(n, { isInitialFetchComplete: !0, lastEventTime: e });
    await Promise.all([i, t.length === 0 ? this.zapListUI?.showNoZapsMessage() : null, t.length >= We.REQ_CONFIG.INITIAL_LOAD_COUNT ? this.setupInfiniteScroll(n) : null]), r?.querySelector(".load-more-trigger")?.remove();
  }
  _initializeLoadState(n) {
    Re.updateLoadState(n, { isInitialFetchComplete: !1, lastEventTime: null, isLoading: !1 });
  }
  _isValidFilter(n) {
    return n && n.relayUrls && Array.isArray(n.relayUrls) && n.relayUrls.length > 0 && n.identifier;
  }
  setupInfiniteScroll(n) {
    try {
      this._cleanupInfiniteScroll(n);
      const e = this._getListElement(n);
      if (!e) return;
      const t = this._createLoadTrigger();
      e.appendChild(t), this._observeLoadTrigger(t, n, e);
    } catch {
    }
  }
  _createLoadTrigger() {
    const n = document.createElement("div");
    n.className = "load-more-trigger";
    const e = document.createElement("div");
    return e.className = "loading-spinner", n.appendChild(e), n;
  }
  _observeLoadTrigger(n, e, t) {
    const r = new IntersectionObserver(((i) => this._handleIntersection(i[0], e)), { root: t, rootMargin: We.INFINITE_SCROLL.ROOT_MARGIN, threshold: We.INFINITE_SCROLL.THRESHOLD });
    r.observe(n), this.observers.set(e, r);
  }
  async _handleIntersection(n, e) {
    n.isIntersecting && (Re.getLoadState(e).isLoading ? setTimeout((() => {
      n.isIntersecting && this._handleIntersection(n, e);
    }), We.INFINITE_SCROLL.RETRY_DELAY) : this.loadMoreZaps(e).then(((t) => {
      t === 0 && this._cleanupInfiniteScroll(e);
    })).catch(((t) => {
      this._cleanupInfiniteScroll(e);
    })));
  }
  _cleanupInfiniteScroll(n) {
    const e = this.observers.get(n);
    if (!e) return;
    e.disconnect(), this._getListElement(n)?.querySelector(".load-more-trigger")?.remove(), this.observers.delete(n);
  }
  _getListElement(n) {
    return document.querySelector(`nzv-dialog[data-view-id="${n}"]`)?.shadowRoot?.querySelector(".dialog-zap-list");
  }
  async loadMoreZaps(n) {
    const e = Re.getLoadState(n), t = this.getViewConfig(n);
    if (!this._canLoadMore(e, t)) return 0;
    e.isLoading = !0;
    try {
      const r = await this._executeLoadMore(n, e, t);
      if (r > 0) {
        const i = Re.getZapEvents(n).slice(-r);
        await this.updateEventReferenceBatch(i, n), this.updateUIReferences(i);
      }
      return r;
    } finally {
      e.isLoading = !1;
    }
  }
  async _executeLoadMore(n, e, t) {
    const r = ad(t.identifier, e.lastEventTime);
    if (!r) return 0;
    const i = [], a = setTimeout((() => {
      i.length === 0 && this._cleanupInfiniteScroll(n);
    }), We.LOAD_TIMEOUT);
    try {
      return await this._collectEvents(n, t, r, i, We.REQ_CONFIG.ADDITIONAL_LOAD_COUNT, e), i.length > 0 && await this._processBatchEvents(i, n), i.length;
    } catch {
      return 0;
    } finally {
      clearTimeout(a);
    }
  }
  async _collectEvents(n, e, t, r, i, a) {
    return new Promise(((c, d) => {
      const h = setTimeout((() => d(new Error("Load timeout"))), We.LOAD_TIMEOUT);
      Ds.subscribeToZaps(n, e, t, { onevent: (g) => {
        g.created_at < a.lastEventTime && (r.push(g), a.lastEventTime = Math.min(a.lastEventTime, g.created_at), r.length >= i && (clearTimeout(h), c()));
      }, oneose: () => {
        clearTimeout(h), c();
      } });
    }));
  }
  async _collectInitialEvents(n, e, t) {
    const r = [];
    let i = null;
    return new Promise(((a) => {
      const c = this._setupBufferInterval(r, n), d = Ds.subscribeToZaps(n, e, t, { onevent: (h) => {
        const g = this._handleInitialEvent(h, r, i, n);
        g !== null && (i = g);
      }, oneose: () => {
        clearInterval(c), a({ batchEvents: [...r], lastEventTime: i });
      } });
      this.#e.set(n, { zap: d });
    }));
  }
  _handleInitialEvent(n, e, t, r) {
    const i = Math.min(t || n.created_at, n.created_at);
    if (Re.addZapEvent(r, n)) {
      if (e.push(n), this.updateEventReference(n, r).then(((a) => {
        a && this.zapListUI && n.reference && this.zapListUI.updateZapReference(n);
      })), n.isRealTimeEvent) {
        const a = this.getViewConfig(r);
        Fi.handleZapEvent(n, r, a?.identifier), this.zapListUI && this.zapListUI.prependZap(n).catch(console.error);
      }
      e.length >= We.BATCH_SIZE && this.zapListUI && this.zapListUI.batchUpdate(Re.getZapEvents(r)).catch(console.error);
    }
    return i;
  }
  async _processBatchEvents(n, e) {
    if (n?.length) {
      n.sort(((t, r) => r.created_at - t.created_at)), n.forEach(((t) => Re.addZapEvent(e, t)));
      try {
        await Promise.all([ji.processBatchProfiles(n)]);
      } catch {
      }
      await this._updateUI(n, e);
    }
  }
  async _updateUI(n, e) {
    this.zapListUI && await this.zapListUI.batchUpdate(n, { isFullUpdate: !0 });
  }
  _setupBufferInterval(n, e) {
    let t = 0;
    const r = We.BUFFER_MIN_INTERVAL;
    return setInterval((() => {
      const i = Date.now();
      n.length > 0 && i - t >= r && this.zapListUI && (this.zapListUI.batchUpdate(Re.getZapEvents(e), { isBufferUpdate: !0 }).catch(console.error), t = i);
    }), We.BUFFER_INTERVAL);
  }
  _canLoadMore(n, e) {
    return e && !n.isLoading && n.lastEventTime;
  }
  unsubscribe(n) {
    try {
      const e = this.#e.get(n);
      e?.zap && (e.zap(), e.zap = null), this.#t.set(n, { isZapClosed: !0 }), this._cleanupInfiniteScroll(n);
    } catch {
    }
  }
}();
class Y1 extends HTMLElement {
  #e;
  #t;
  constructor() {
    super(), this.attachShadow({ mode: "open" }), this.#e = { isInitialized: !1, theme: We.DEFAULT_OPTIONS.theme }, this.popStateHandler = (e) => {
      e.preventDefault(), this.#s(".dialog")?.open && this.closeDialog();
    };
  }
  async connectedCallback() {
    if (this.viewId = this.getAttribute("data-view-id"), this.viewId) {
      this.#t = this.#n();
      try {
        await this.#t, this.#e.isInitialized = !0;
        const e = Sr.getViewConfig(this.viewId);
        if (!e) throw new Error("Config is required for initialization");
        if (await this.#r(e), this.getAttribute("data-nzv-id")) {
          const t = await Fi.getCurrentStats(this.viewId);
          t && this.statsUI.displayStats(t);
        }
        this.#e.isInitialized = !0, this.dispatchEvent(new CustomEvent("dialog-initialized", { detail: { viewId: this.viewId } }));
      } catch {
      }
    }
  }
  async #n() {
    return new Promise(((e) => {
      const t = document.createElement("template");
      t.innerHTML = Rn.getDialogTemplate(), this.shadowRoot.appendChild(t.content.cloneNode(!0)), this.#i(), queueMicrotask((() => e()));
    }));
  }
  async #r(e) {
    const t = document.createElement("style");
    t.textContent = Q1(), this.shadowRoot.appendChild(t), this.statsUI = new D1(this.shadowRoot), this.profileUI = new V1(), this.zapListUI = new G1(this.shadowRoot, this.profileUI, this.viewId, e), Sr.setZapListUI(this.zapListUI);
    const r = Re.getZapEvents(this.viewId);
    r?.length ? await this.zapListUI.renderZapListFromCache(r) : this.zapListUI.showNoZapsMessage();
    const i = this.getAttribute("data-nzv-id");
    if (i) {
      const a = await Re.getCachedStats(this.viewId, i);
      if (a?.stats) this.statsUI.displayStats(a.stats);
      else {
        const c = await Fi.getCurrentStats(this.viewId);
        c && this.statsUI.displayStats(c);
      }
    }
  }
  static get observedAttributes() {
    return ["data-theme"];
  }
  #i() {
    const e = this.#s(".dialog");
    this.#s(".close-dialog-button").addEventListener("click", (() => this.closeDialog())), e.addEventListener("click", ((t) => {
      t.target === e && this.closeDialog();
    })), e.addEventListener("cancel", ((t) => {
      t.preventDefault(), this.closeDialog();
    })), document.addEventListener("keydown", ((t) => {
      if (e?.open) {
        if (t.key === "Escape") this.closeDialog();
        else if (t.key === " ") {
          t.preventDefault();
          const r = this.#s(".dialog-zap-list");
          r && (r.scrollTop += 0.8 * r.clientHeight);
        }
      }
    }));
  }
  attributeChangedCallback(e, t, r) {
    t !== r && e === "data-theme" && this.#a(r);
  }
  #a(e) {
    Re.updateThemeState(this.viewId, { theme: e }).isInitialized && this.#l();
  }
  #l() {
    const e = Re.getThemeState(this.viewId).theme === "dark" ? "dark-theme" : "light-theme";
    this.shadowRoot.host.classList.add(e);
  }
  async showDialog() {
    await this.#t;
    const e = this.#s(".dialog");
    e && !e.open && this.#e.isInitialized && (window.addEventListener("popstate", this.popStateHandler), e.showModal(), queueMicrotask((() => {
      document.activeElement && document.activeElement.blur();
    })), this.#o());
  }
  closeDialog() {
    const e = this.#s(".dialog");
    e?.open && (this.zapListUI?.destroy(), Sr.unsubscribe(this.viewId), e.close(), this.remove(), window.removeEventListener("popstate", this.popStateHandler));
  }
  displayZapStats(e) {
    this.statsUI.displayStats(e);
  }
  #s(e) {
    return this.shadowRoot.querySelector(e);
  }
  #o() {
    const e = this.getAttribute("data-view-id"), t = document.querySelector(`button[data-zap-view-id="${e}"]`);
    if (!t) return;
    const r = this.#s(".dialog-title"), i = this.#s(".dialog-title a");
    if (!i || !r) return;
    const a = t.getAttribute("data-title"), c = t.getAttribute("data-nzv-id");
    i.href = c ? `https://njump.me/${c}` : "#", a?.trim() ? (i.textContent = a, r.classList.add("custom-title")) : (i.textContent = We.DIALOG_CONFIG.DEFAULT_TITLE + Lh(c), r.classList.remove("custom-title"));
  }
  getOperations() {
    if (!this.#e.isInitialized) return null;
    const e = { closeDialog: () => this.closeDialog(), showDialog: () => this.showDialog() };
    return this.#e.isInitialized && Object.assign(e, { prependZap: (t) => this.zapListUI?.prependZap(t), displayZapStats: (t) => this.statsUI?.displayStats(t), showNoZapsMessage: () => this.zapListUI?.showNoZapsMessage() }), e;
  }
  async waitForInitialization() {
    return this.#t;
  }
}
customElements.define("nzv-dialog", Y1);
const No = { create: async (n, e) => {
  if (!n || !e) return Promise.reject(new Error("Invalid viewId or config"));
  Sr.setViewConfig(n, e);
  const t = document.querySelector(`nzv-dialog[data-view-id="${n}"]`);
  if (t) return t;
  const r = document.createElement("nzv-dialog");
  r.setAttribute("data-view-id", n), r.setAttribute("data-config", JSON.stringify(e));
  const i = document.querySelector(`button[data-zap-view-id="${n}"]`);
  return i?.getAttribute("data-nzv-id") && r.setAttribute("data-nzv-id", i.getAttribute("data-nzv-id")), document.body.appendChild(r), await r.waitForInitialization(), r;
}, get: (n) => document.querySelector(`nzv-dialog[data-view-id="${n}"]`), execute: (n, e, ...t) => {
  const r = No.get(n), i = r?.getOperations();
  return i ? i[e]?.(...t) ?? null : null;
} }, X1 = (n, e) => No.execute(e, "displayZapStats", n);
async function J1(n, e) {
  try {
    const t = qi.fromButton(n);
    if (!t) throw new Error("Failed to create config from button");
    if (Sr.setViewConfig(e, t), !await (async function(i) {
      try {
        const a = Sr.getViewConfig(i);
        if (!a) throw new Error(`View configuration not found for viewId: ${i}`);
        return Sr.setViewConfig(i, a), await No.create(i, a);
      } catch {
        return null;
      }
    })(e)) throw new Error(We.ZAP_CONFIG.ERRORS.DIALOG_NOT_FOUND);
    await (async function(i) {
      try {
        const a = No.get(i);
        if (!a) throw new Error("Dialog not found");
        await a.waitForInitialization();
        const c = a.getOperations();
        if (!c?.showDialog) throw new Error("Basic dialog operations not available");
        c.showDialog();
      } catch {
      }
    })(e), setTimeout((async () => {
      if (await (async function(i, a) {
        const c = Re.getZapEvents(i);
        if (c.length > 0) {
          const h = [...new Set(c.map(((g) => g.pubkey)))];
          ji.fetchProfiles(h);
        }
        const { hasEnoughCachedEvents: d } = await Re.processCachedData(i, a);
        return d && Sr.setupInfiniteScroll(i), d;
      })(e, t), !n.hasAttribute("data-initialized")) {
        const i = n.getAttribute("data-nzv-id");
        await Promise.all([Ds.connectToRelays(t.relayUrls), Sr.initializeSubscriptions(t, e), i ? Fi.initializeStats(i, e, !0) : Promise.resolve()]), n.setAttribute("data-initialized", "true");
      }
    }), 0);
  } catch {
  }
}
function Mh() {
  Object.entries(We.LIBRARIES).forEach((([n, e]) => {
    window[n] = e;
  })), document.querySelectorAll("button[data-nzv-id]").forEach(((n, e) => {
    if (n.hasAttribute("data-zap-view-id")) return;
    const t = `nostr-zap-view-${e}`;
    n.setAttribute("data-zap-view-id", t), n.hasAttribute("data-zap-color-mode") || n.setAttribute("data-zap-color-mode", We.ZAP_CONFIG.DEFAULT_COLOR_MODE), n.addEventListener("click", (() => J1(n, t)));
  }));
}
function Rh(n = {}) {
  Object.assign(We, n), typeof window < "u" && Mh();
}
function eb(n = {}) {
  return Rh(n);
}
typeof window < "u" && document.addEventListener("DOMContentLoaded", Mh);
Lr.vQ;
Lr.ZM;
Lr.yk;
Lr.h0;
Lr.n_;
var tb = Lr.Xz;
Lr.Uv;
Lr.fU;
Lr.Dw;
var cd = {}, dd;
function nb() {
  if (dd) return cd;
  dd = 1;
  var n = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof Cc < "u" ? Cc : {};
  function e(o) {
    return o && o.__esModule ? o.default : o;
  }
  var t = {}, r = {}, i = n.parcelRequire1faa;
  i == null && (i = function(o) {
    if (o in t)
      return t[o].exports;
    if (o in r) {
      var s = r[o];
      delete r[o];
      var l = { id: o, exports: {} };
      return t[o] = l, s.call(l.exports, l, l.exports), l.exports;
    }
    var u = new Error("Cannot find module '" + o + "'");
    throw u.code = "MODULE_NOT_FOUND", u;
  }, i.register = function(s, l) {
    r[s] = l;
  }, n.parcelRequire1faa = i), i.register("58QMB", function(o, s) {
    (function() {
      function l(w, k) {
        var R, W = Object.keys(k);
        for (R = 0; R < W.length; R++) w = w.replace(new RegExp("\\{" + W[R] + "\\}", "gi"), k[W[R]]);
        return w;
      }
      function u(w) {
        var k, R, W;
        if (!w) throw new Error("cannot create a random attribute name for an undefined object");
        k = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz", R = "";
        do
          for (R = "", W = 0; W < 12; W++) R += k[Math.floor(Math.random() * k.length)];
        while (w[R]);
        return R;
      }
      function f(w) {
        var k = {
          left: "start",
          right: "end",
          center: "middle",
          start: "start",
          end: "end"
        };
        return k[w] || k.start;
      }
      function p(w) {
        var k = {
          alphabetic: "alphabetic",
          hanging: "hanging",
          top: "text-before-edge",
          bottom: "text-after-edge",
          middle: "central"
        };
        return k[w] || k.alphabetic;
      }
      var _, y, U, X, z;
      z = (function(w, k) {
        var R, W, ne, ie = {};
        for (w = w.split(","), k = k || 10, R = 0; R < w.length; R += 2) W = "&" + w[R + 1] + ";", ne = parseInt(w[R], k), ie[W] = "&#" + ne + ";";
        return ie["\\xa0"] = "&#160;", ie;
      })("50,nbsp,51,iexcl,52,cent,53,pound,54,curren,55,yen,56,brvbar,57,sect,58,uml,59,copy,5a,ordf,5b,laquo,5c,not,5d,shy,5e,reg,5f,macr,5g,deg,5h,plusmn,5i,sup2,5j,sup3,5k,acute,5l,micro,5m,para,5n,middot,5o,cedil,5p,sup1,5q,ordm,5r,raquo,5s,frac14,5t,frac12,5u,frac34,5v,iquest,60,Agrave,61,Aacute,62,Acirc,63,Atilde,64,Auml,65,Aring,66,AElig,67,Ccedil,68,Egrave,69,Eacute,6a,Ecirc,6b,Euml,6c,Igrave,6d,Iacute,6e,Icirc,6f,Iuml,6g,ETH,6h,Ntilde,6i,Ograve,6j,Oacute,6k,Ocirc,6l,Otilde,6m,Ouml,6n,times,6o,Oslash,6p,Ugrave,6q,Uacute,6r,Ucirc,6s,Uuml,6t,Yacute,6u,THORN,6v,szlig,70,agrave,71,aacute,72,acirc,73,atilde,74,auml,75,aring,76,aelig,77,ccedil,78,egrave,79,eacute,7a,ecirc,7b,euml,7c,igrave,7d,iacute,7e,icirc,7f,iuml,7g,eth,7h,ntilde,7i,ograve,7j,oacute,7k,ocirc,7l,otilde,7m,ouml,7n,divide,7o,oslash,7p,ugrave,7q,uacute,7r,ucirc,7s,uuml,7t,yacute,7u,thorn,7v,yuml,ci,fnof,sh,Alpha,si,Beta,sj,Gamma,sk,Delta,sl,Epsilon,sm,Zeta,sn,Eta,so,Theta,sp,Iota,sq,Kappa,sr,Lambda,ss,Mu,st,Nu,su,Xi,sv,Omicron,t0,Pi,t1,Rho,t3,Sigma,t4,Tau,t5,Upsilon,t6,Phi,t7,Chi,t8,Psi,t9,Omega,th,alpha,ti,beta,tj,gamma,tk,delta,tl,epsilon,tm,zeta,tn,eta,to,theta,tp,iota,tq,kappa,tr,lambda,ts,mu,tt,nu,tu,xi,tv,omicron,u0,pi,u1,rho,u2,sigmaf,u3,sigma,u4,tau,u5,upsilon,u6,phi,u7,chi,u8,psi,u9,omega,uh,thetasym,ui,upsih,um,piv,812,bull,816,hellip,81i,prime,81j,Prime,81u,oline,824,frasl,88o,weierp,88h,image,88s,real,892,trade,89l,alefsym,8cg,larr,8ch,uarr,8ci,rarr,8cj,darr,8ck,harr,8dl,crarr,8eg,lArr,8eh,uArr,8ei,rArr,8ej,dArr,8ek,hArr,8g0,forall,8g2,part,8g3,exist,8g5,empty,8g7,nabla,8g8,isin,8g9,notin,8gb,ni,8gf,prod,8gh,sum,8gi,minus,8gn,lowast,8gq,radic,8gt,prop,8gu,infin,8h0,ang,8h7,and,8h8,or,8h9,cap,8ha,cup,8hb,int,8hk,there4,8hs,sim,8i5,cong,8i8,asymp,8j0,ne,8j1,equiv,8j4,le,8j5,ge,8k2,sub,8k3,sup,8k4,nsub,8k6,sube,8k7,supe,8kl,oplus,8kn,otimes,8l5,perp,8m5,sdot,8o8,lceil,8o9,rceil,8oa,lfloor,8ob,rfloor,8p9,lang,8pa,rang,9ea,loz,9j0,spades,9j3,clubs,9j5,hearts,9j6,diams,ai,OElig,aj,oelig,b0,Scaron,b1,scaron,bo,Yuml,m6,circ,ms,tilde,802,ensp,803,emsp,809,thinsp,80c,zwnj,80d,zwj,80e,lrm,80f,rlm,80j,ndash,80k,mdash,80o,lsquo,80p,rsquo,80q,sbquo,80s,ldquo,80t,rdquo,80u,bdquo,810,dagger,811,Dagger,81g,permil,81p,lsaquo,81q,rsaquo,85c,euro", 32), _ = {
        strokeStyle: {
          svgAttr: "stroke",
          canvas: "#000000",
          svg: "none",
          apply: "stroke"
        },
        fillStyle: {
          svgAttr: "fill",
          canvas: "#000000",
          svg: null,
          apply: "fill"
        },
        lineCap: {
          svgAttr: "stroke-linecap",
          canvas: "butt",
          svg: "butt",
          apply: "stroke"
        },
        lineJoin: {
          svgAttr: "stroke-linejoin",
          canvas: "miter",
          svg: "miter",
          apply: "stroke"
        },
        miterLimit: {
          svgAttr: "stroke-miterlimit",
          canvas: 10,
          svg: 4,
          apply: "stroke"
        },
        lineWidth: {
          svgAttr: "stroke-width",
          canvas: 1,
          svg: 1,
          apply: "stroke"
        },
        globalAlpha: {
          svgAttr: "opacity",
          canvas: 1,
          svg: 1,
          apply: "fill stroke"
        },
        font: {
          canvas: "10px sans-serif"
        },
        shadowColor: {
          canvas: "#000000"
        },
        shadowOffsetX: {
          canvas: 0
        },
        shadowOffsetY: {
          canvas: 0
        },
        shadowBlur: {
          canvas: 0
        },
        textAlign: {
          canvas: "start"
        },
        textBaseline: {
          canvas: "alphabetic"
        },
        lineDash: {
          svgAttr: "stroke-dasharray",
          canvas: [],
          svg: null,
          apply: "stroke"
        }
      }, U = function(w, k) {
        this.__root = w, this.__ctx = k;
      }, U.prototype.addColorStop = function(w, k) {
        var R, W, ne = this.__ctx.__createElement("stop");
        ne.setAttribute("offset", w), k.indexOf("rgba") !== -1 ? (R = /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d?\.?\d*)\s*\)/gi, W = R.exec(k), ne.setAttribute("stop-color", l("rgb({r},{g},{b})", {
          r: W[1],
          g: W[2],
          b: W[3]
        })), ne.setAttribute("stop-opacity", W[4])) : ne.setAttribute("stop-color", k), this.__root.appendChild(ne);
      }, X = function(w, k) {
        this.__root = w, this.__ctx = k;
      }, y = function(w) {
        var k, R = {
          width: 500,
          height: 500,
          enableMirroring: !1
        };
        if (arguments.length > 1 ? (k = R, k.width = arguments[0], k.height = arguments[1]) : k = w || R, !(this instanceof y)) return new y(k);
        this.width = k.width || R.width, this.height = k.height || R.height, this.enableMirroring = k.enableMirroring !== void 0 ? k.enableMirroring : R.enableMirroring, this.canvas = this, this.__document = k.document || document, k.ctx ? this.__ctx = k.ctx : (this.__canvas = this.__document.createElement("canvas"), this.__ctx = this.__canvas.getContext("2d")), this.__setDefaultStyles(), this.__stack = [
          this.__getStyleState()
        ], this.__groupStack = [], this.__root = this.__document.createElementNS("http://www.w3.org/2000/svg", "svg"), this.__root.setAttribute("version", 1.1), this.__root.setAttribute("xmlns", "http://www.w3.org/2000/svg"), this.__root.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink"), this.__root.setAttribute("width", this.width), this.__root.setAttribute("height", this.height), this.__ids = {}, this.__defs = this.__document.createElementNS("http://www.w3.org/2000/svg", "defs"), this.__root.appendChild(this.__defs), this.__currentElement = this.__document.createElementNS("http://www.w3.org/2000/svg", "g"), this.__root.appendChild(this.__currentElement);
      }, y.prototype.__createElement = function(w, k, R) {
        k === void 0 && (k = {});
        var W, ne, ie = this.__document.createElementNS("http://www.w3.org/2000/svg", w), be = Object.keys(k);
        for (R && (ie.setAttribute("fill", "none"), ie.setAttribute("stroke", "none")), W = 0; W < be.length; W++) ne = be[W], ie.setAttribute(ne, k[ne]);
        return ie;
      }, y.prototype.__setDefaultStyles = function() {
        var w, k, R = Object.keys(_);
        for (w = 0; w < R.length; w++) k = R[w], this[k] = _[k].canvas;
      }, y.prototype.__applyStyleState = function(w) {
        var k, R, W = Object.keys(w);
        for (k = 0; k < W.length; k++) R = W[k], this[R] = w[R];
      }, y.prototype.__getStyleState = function() {
        var w, k, R = {}, W = Object.keys(_);
        for (w = 0; w < W.length; w++) k = W[w], R[k] = this[k];
        return R;
      }, y.prototype.__applyStyleToCurrentElement = function(w) {
        var k = this.__currentElement, R = this.__currentElementsToStyle;
        R && (k.setAttribute(w, ""), k = R.element, R.children.forEach(function(vt) {
          vt.setAttribute(w, "");
        }));
        var W, ne, ie, be, fe, Ae, xe = Object.keys(_);
        for (W = 0; W < xe.length; W++) if (ne = _[xe[W]], ie = this[xe[W]], ne.apply) {
          if (ie instanceof X) {
            if (ie.__ctx) for (; ie.__ctx.__defs.childNodes.length; ) be = ie.__ctx.__defs.childNodes[0].getAttribute("id"), this.__ids[be] = be, this.__defs.appendChild(ie.__ctx.__defs.childNodes[0]);
            k.setAttribute(ne.apply, l("url(#{id})", {
              id: ie.__root.getAttribute("id")
            }));
          } else if (ie instanceof U) k.setAttribute(ne.apply, l("url(#{id})", {
            id: ie.__root.getAttribute("id")
          }));
          else if (ne.apply.indexOf(w) !== -1 && ne.svg !== ie)
            if (ne.svgAttr !== "stroke" && ne.svgAttr !== "fill" || ie.indexOf("rgba") === -1) {
              var we = ne.svgAttr;
              if (xe[W] === "globalAlpha" && (we = w + "-" + ne.svgAttr, k.getAttribute(we))) continue;
              k.setAttribute(we, ie);
            } else {
              fe = /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d?\.?\d*)\s*\)/gi, Ae = fe.exec(ie), k.setAttribute(ne.svgAttr, l("rgb({r},{g},{b})", {
                r: Ae[1],
                g: Ae[2],
                b: Ae[3]
              }));
              var Ie = Ae[4], Me = this.globalAlpha;
              Me != null && (Ie *= Me), k.setAttribute(ne.svgAttr + "-opacity", Ie);
            }
        }
      }, y.prototype.__closestGroupOrSvg = function(w) {
        return w = w || this.__currentElement, w.nodeName === "g" || w.nodeName === "svg" ? w : this.__closestGroupOrSvg(w.parentNode);
      }, y.prototype.getSerializedSvg = function(w) {
        var k, R, W, ne, ie, be, fe = new XMLSerializer().serializeToString(this.__root);
        if (be = /xmlns="http:\/\/www\.w3\.org\/2000\/svg".+xmlns="http:\/\/www\.w3\.org\/2000\/svg/gi, be.test(fe) && (fe = fe.replace('xmlns="http://www.w3.org/2000/svg', 'xmlns:xlink="http://www.w3.org/1999/xlink')), w) for (k = Object.keys(z), R = 0; R < k.length; R++) W = k[R], ne = z[W], ie = new RegExp(W, "gi"), ie.test(fe) && (fe = fe.replace(ie, ne));
        return fe;
      }, y.prototype.getSvg = function() {
        return this.__root;
      }, y.prototype.save = function() {
        var w = this.__createElement("g"), k = this.__closestGroupOrSvg();
        this.__groupStack.push(k), k.appendChild(w), this.__currentElement = w, this.__stack.push(this.__getStyleState());
      }, y.prototype.restore = function() {
        this.__currentElement = this.__groupStack.pop(), this.__currentElementsToStyle = null, this.__currentElement || (this.__currentElement = this.__root.childNodes[1]);
        var w = this.__stack.pop();
        this.__applyStyleState(w);
      }, y.prototype.__addTransform = function(w) {
        var k = this.__closestGroupOrSvg();
        if (k.childNodes.length > 0) {
          this.__currentElement.nodeName === "path" && (this.__currentElementsToStyle || (this.__currentElementsToStyle = {
            element: k,
            children: []
          }), this.__currentElementsToStyle.children.push(this.__currentElement), this.__applyCurrentDefaultPath());
          var R = this.__createElement("g");
          k.appendChild(R), this.__currentElement = R;
        }
        var W = this.__currentElement.getAttribute("transform");
        W ? W += " " : W = "", W += w, this.__currentElement.setAttribute("transform", W);
      }, y.prototype.scale = function(w, k) {
        k === void 0 && (k = w), this.__addTransform(l("scale({x},{y})", {
          x: w,
          y: k
        }));
      }, y.prototype.rotate = function(w) {
        var k = 180 * w / Math.PI;
        this.__addTransform(l("rotate({angle},{cx},{cy})", {
          angle: k,
          cx: 0,
          cy: 0
        }));
      }, y.prototype.translate = function(w, k) {
        this.__addTransform(l("translate({x},{y})", {
          x: w,
          y: k
        }));
      }, y.prototype.transform = function(w, k, R, W, ne, ie) {
        this.__addTransform(l("matrix({a},{b},{c},{d},{e},{f})", {
          a: w,
          b: k,
          c: R,
          d: W,
          e: ne,
          f: ie
        }));
      }, y.prototype.beginPath = function() {
        var w, k;
        this.__currentDefaultPath = "", this.__currentPosition = {}, w = this.__createElement("path", {}, !0), k = this.__closestGroupOrSvg(), k.appendChild(w), this.__currentElement = w;
      }, y.prototype.__applyCurrentDefaultPath = function() {
        var w = this.__currentElement;
        w.nodeName === "path" ? w.setAttribute("d", this.__currentDefaultPath) : console.error("Attempted to apply path command to node", w.nodeName);
      }, y.prototype.__addPathCommand = function(w) {
        this.__currentDefaultPath += " ", this.__currentDefaultPath += w;
      }, y.prototype.moveTo = function(w, k) {
        this.__currentElement.nodeName !== "path" && this.beginPath(), this.__currentPosition = {
          x: w,
          y: k
        }, this.__addPathCommand(l("M {x} {y}", {
          x: w,
          y: k
        }));
      }, y.prototype.closePath = function() {
        this.__currentDefaultPath && this.__addPathCommand("Z");
      }, y.prototype.lineTo = function(w, k) {
        this.__currentPosition = {
          x: w,
          y: k
        }, this.__currentDefaultPath.indexOf("M") > -1 ? this.__addPathCommand(l("L {x} {y}", {
          x: w,
          y: k
        })) : this.__addPathCommand(l("M {x} {y}", {
          x: w,
          y: k
        }));
      }, y.prototype.bezierCurveTo = function(w, k, R, W, ne, ie) {
        this.__currentPosition = {
          x: ne,
          y: ie
        }, this.__addPathCommand(l("C {cp1x} {cp1y} {cp2x} {cp2y} {x} {y}", {
          cp1x: w,
          cp1y: k,
          cp2x: R,
          cp2y: W,
          x: ne,
          y: ie
        }));
      }, y.prototype.quadraticCurveTo = function(w, k, R, W) {
        this.__currentPosition = {
          x: R,
          y: W
        }, this.__addPathCommand(l("Q {cpx} {cpy} {x} {y}", {
          cpx: w,
          cpy: k,
          x: R,
          y: W
        }));
      };
      var Q = function(w) {
        var k = Math.sqrt(w[0] * w[0] + w[1] * w[1]);
        return [
          w[0] / k,
          w[1] / k
        ];
      };
      y.prototype.arcTo = function(w, k, R, W, ne) {
        var ie = this.__currentPosition && this.__currentPosition.x, be = this.__currentPosition && this.__currentPosition.y;
        if (ie !== void 0 && be !== void 0) {
          if (ne < 0) throw new Error("IndexSizeError: The radius provided (" + ne + ") is negative.");
          if (ie === w && be === k || w === R && k === W || ne === 0) return void this.lineTo(w, k);
          var fe = Q([
            ie - w,
            be - k
          ]), Ae = Q([
            R - w,
            W - k
          ]);
          if (fe[0] * Ae[1] == fe[1] * Ae[0]) return void this.lineTo(w, k);
          var xe = fe[0] * Ae[0] + fe[1] * Ae[1], we = Math.acos(Math.abs(xe)), Ie = Q([
            fe[0] + Ae[0],
            fe[1] + Ae[1]
          ]), Me = ne / Math.sin(we / 2), vt = w + Me * Ie[0], O = k + Me * Ie[1], M = [
            -fe[1],
            fe[0]
          ], I = [
            Ae[1],
            -Ae[0]
          ], j = function(ye) {
            var oe = ye[0];
            return ye[1] >= 0 ? Math.acos(oe) : -Math.acos(oe);
          }, J = j(M), ue = j(I);
          this.lineTo(vt + M[0] * ne, O + M[1] * ne), this.arc(vt, O, ne, J, ue);
        }
      }, y.prototype.stroke = function() {
        this.__currentElement.nodeName === "path" && this.__currentElement.setAttribute("paint-order", "fill stroke markers"), this.__applyCurrentDefaultPath(), this.__applyStyleToCurrentElement("stroke");
      }, y.prototype.fill = function() {
        this.__currentElement.nodeName === "path" && this.__currentElement.setAttribute("paint-order", "stroke fill markers"), this.__applyCurrentDefaultPath(), this.__applyStyleToCurrentElement("fill");
      }, y.prototype.rect = function(w, k, R, W) {
        this.__currentElement.nodeName !== "path" && this.beginPath(), this.moveTo(w, k), this.lineTo(w + R, k), this.lineTo(w + R, k + W), this.lineTo(w, k + W), this.lineTo(w, k), this.closePath();
      }, y.prototype.fillRect = function(w, k, R, W) {
        var ne, ie;
        ne = this.__createElement("rect", {
          x: w,
          y: k,
          width: R,
          height: W,
          "shape-rendering": "crispEdges"
        }, !0), ie = this.__closestGroupOrSvg(), ie.appendChild(ne), this.__currentElement = ne, this.__applyStyleToCurrentElement("fill");
      }, y.prototype.strokeRect = function(w, k, R, W) {
        var ne, ie;
        ne = this.__createElement("rect", {
          x: w,
          y: k,
          width: R,
          height: W
        }, !0), ie = this.__closestGroupOrSvg(), ie.appendChild(ne), this.__currentElement = ne, this.__applyStyleToCurrentElement("stroke");
      }, y.prototype.__clearCanvas = function() {
        for (var w = this.__closestGroupOrSvg(), k = w.getAttribute("transform"), R = this.__root.childNodes[1], W = R.childNodes, ne = W.length - 1; ne >= 0; ne--) W[ne] && R.removeChild(W[ne]);
        this.__currentElement = R, this.__groupStack = [], k && this.__addTransform(k);
      }, y.prototype.clearRect = function(w, k, R, W) {
        if (w === 0 && k === 0 && R === this.width && W === this.height) return void this.__clearCanvas();
        var ne, ie = this.__closestGroupOrSvg();
        ne = this.__createElement("rect", {
          x: w,
          y: k,
          width: R,
          height: W,
          fill: "#FFFFFF"
        }, !0), ie.appendChild(ne);
      }, y.prototype.createLinearGradient = function(w, k, R, W) {
        var ne = this.__createElement("linearGradient", {
          id: u(this.__ids),
          x1: w + "px",
          x2: R + "px",
          y1: k + "px",
          y2: W + "px",
          gradientUnits: "userSpaceOnUse"
        }, !1);
        return this.__defs.appendChild(ne), new U(ne, this);
      }, y.prototype.createRadialGradient = function(w, k, R, W, ne, ie) {
        var be = this.__createElement("radialGradient", {
          id: u(this.__ids),
          cx: W + "px",
          cy: ne + "px",
          r: ie + "px",
          fx: w + "px",
          fy: k + "px",
          gradientUnits: "userSpaceOnUse"
        }, !1);
        return this.__defs.appendChild(be), new U(be, this);
      }, y.prototype.__parseFont = function() {
        var w = /^\s*(?=(?:(?:[-a-z]+\s*){0,2}(italic|oblique))?)(?=(?:(?:[-a-z]+\s*){0,2}(small-caps))?)(?=(?:(?:[-a-z]+\s*){0,2}(bold(?:er)?|lighter|[1-9]00))?)(?:(?:normal|\1|\2|\3)\s*){0,3}((?:xx?-)?(?:small|large)|medium|smaller|larger|[.\d]+(?:\%|in|[cem]m|ex|p[ctx]))(?:\s*\/\s*(normal|[.\d]+(?:\%|in|[cem]m|ex|p[ctx])))?\s*([-,\'\"\sa-z0-9]+?)\s*$/i, k = w.exec(this.font), R = {
          style: k[1] || "normal",
          size: k[4] || "10px",
          family: k[6] || "sans-serif",
          weight: k[3] || "normal",
          decoration: k[2] || "normal",
          href: null
        };
        return this.__fontUnderline === "underline" && (R.decoration = "underline"), this.__fontHref && (R.href = this.__fontHref), R;
      }, y.prototype.__wrapTextLink = function(w, k) {
        if (w.href) {
          var R = this.__createElement("a");
          return R.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", w.href), R.appendChild(k), R;
        }
        return k;
      }, y.prototype.__applyText = function(w, k, R, W) {
        var ne = this.__parseFont(), ie = this.__closestGroupOrSvg(), be = this.__createElement("text", {
          "font-family": ne.family,
          "font-size": ne.size,
          "font-style": ne.style,
          "font-weight": ne.weight,
          "text-decoration": ne.decoration,
          x: k,
          y: R,
          "text-anchor": f(this.textAlign),
          "dominant-baseline": p(this.textBaseline)
        }, !0);
        be.appendChild(this.__document.createTextNode(w)), this.__currentElement = be, this.__applyStyleToCurrentElement(W), ie.appendChild(this.__wrapTextLink(ne, be));
      }, y.prototype.fillText = function(w, k, R) {
        this.__applyText(w, k, R, "fill");
      }, y.prototype.strokeText = function(w, k, R) {
        this.__applyText(w, k, R, "stroke");
      }, y.prototype.measureText = function(w) {
        return this.__ctx.font = this.font, this.__ctx.measureText(w);
      }, y.prototype.arc = function(w, k, R, W, ne, ie) {
        if (W !== ne) {
          W %= 2 * Math.PI, ne %= 2 * Math.PI, W === ne && (ne = (ne + 2 * Math.PI - 1e-3 * (ie ? -1 : 1)) % (2 * Math.PI));
          var be = w + R * Math.cos(ne), fe = k + R * Math.sin(ne), Ae = w + R * Math.cos(W), xe = k + R * Math.sin(W), we = ie ? 0 : 1, Ie = 0, Me = ne - W;
          Me < 0 && (Me += 2 * Math.PI), Ie = ie ? Me > Math.PI ? 0 : 1 : Me > Math.PI ? 1 : 0, this.lineTo(Ae, xe), this.__addPathCommand(l("A {rx} {ry} {xAxisRotation} {largeArcFlag} {sweepFlag} {endX} {endY}", {
            rx: R,
            ry: R,
            xAxisRotation: 0,
            largeArcFlag: Ie,
            sweepFlag: we,
            endX: be,
            endY: fe
          })), this.__currentPosition = {
            x: be,
            y: fe
          };
        }
      }, y.prototype.clip = function() {
        var w = this.__closestGroupOrSvg(), k = this.__createElement("clipPath"), R = u(this.__ids), W = this.__createElement("g");
        this.__applyCurrentDefaultPath(), w.removeChild(this.__currentElement), k.setAttribute("id", R), k.appendChild(this.__currentElement), this.__defs.appendChild(k), w.setAttribute("clip-path", l("url(#{id})", {
          id: R
        })), w.appendChild(W), this.__currentElement = W;
      }, y.prototype.drawImage = function() {
        var w, k, R, W, ne, ie, be, fe, Ae, xe, we, Ie, Me, vt, O = Array.prototype.slice.call(arguments), M = O[0], I = 0, j = 0;
        if (O.length === 3) w = O[1], k = O[2], ne = M.width, ie = M.height, R = ne, W = ie;
        else if (O.length === 5) w = O[1], k = O[2], R = O[3], W = O[4], ne = M.width, ie = M.height;
        else {
          if (O.length !== 9) throw new Error("Invalid number of arguments passed to drawImage: " + arguments.length);
          I = O[1], j = O[2], ne = O[3], ie = O[4], w = O[5], k = O[6], R = O[7], W = O[8];
        }
        be = this.__closestGroupOrSvg(), this.__currentElement;
        var J = "translate(" + w + ", " + k + ")";
        if (M instanceof y) {
          if (fe = M.getSvg().cloneNode(!0), fe.childNodes && fe.childNodes.length > 1) {
            for (Ae = fe.childNodes[0]; Ae.childNodes.length; ) vt = Ae.childNodes[0].getAttribute("id"), this.__ids[vt] = vt, this.__defs.appendChild(Ae.childNodes[0]);
            if (xe = fe.childNodes[1]) {
              var ue, ye = xe.getAttribute("transform");
              ue = ye ? ye + " " + J : J, xe.setAttribute("transform", ue), be.appendChild(xe);
            }
          }
        } else M.nodeName !== "CANVAS" && M.nodeName !== "IMG" || (we = this.__createElement("image"), we.setAttribute("width", R), we.setAttribute("height", W), we.setAttribute("preserveAspectRatio", "none"), we.setAttribute("opacity", this.globalAlpha), (I || j || ne !== M.width || ie !== M.height) && (Ie = this.__document.createElement("canvas"), Ie.width = R, Ie.height = W, Me = Ie.getContext("2d"), Me.drawImage(M, I, j, ne, ie, 0, 0, R, W), M = Ie), we.setAttribute("transform", J), we.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", M.nodeName === "CANVAS" ? M.toDataURL() : M.originalSrc), be.appendChild(we));
      }, y.prototype.createPattern = function(w, k) {
        var R, W = this.__document.createElementNS("http://www.w3.org/2000/svg", "pattern"), ne = u(this.__ids);
        return W.setAttribute("id", ne), W.setAttribute("width", w.width), W.setAttribute("height", w.height), w.nodeName === "CANVAS" || w.nodeName === "IMG" ? (R = this.__document.createElementNS("http://www.w3.org/2000/svg", "image"), R.setAttribute("width", w.width), R.setAttribute("height", w.height), R.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", w.nodeName === "CANVAS" ? w.toDataURL() : w.getAttribute("src")), W.appendChild(R), this.__defs.appendChild(W)) : w instanceof y && (W.appendChild(w.__root.childNodes[1]), this.__defs.appendChild(W)), new X(W, this);
      }, y.prototype.setLineDash = function(w) {
        w && w.length > 0 ? this.lineDash = w.join(",") : this.lineDash = null;
      }, y.prototype.drawFocusRing = function() {
      }, y.prototype.createImageData = function() {
      }, y.prototype.getImageData = function() {
      }, y.prototype.putImageData = function() {
      }, y.prototype.globalCompositeOperation = function() {
      }, y.prototype.setTransform = function() {
      }, typeof window == "object" && (window.C2S = y), typeof o.exports == "object" && (o.exports = y);
    })(), (function() {
      function l(O, M, I) {
        this.mode = be.MODE_8BIT_BYTE, this.data = O, this.parsedData = [];
        for (var j = 0, J = this.data.length; j < J; j++) {
          var ue = [], ye = this.data.charCodeAt(j);
          M ? ue[0] = ye : ye > 65536 ? (ue[0] = 240 | (1835008 & ye) >>> 18, ue[1] = 128 | (258048 & ye) >>> 12, ue[2] = 128 | (4032 & ye) >>> 6, ue[3] = 128 | 63 & ye) : ye > 2048 ? (ue[0] = 224 | (61440 & ye) >>> 12, ue[1] = 128 | (4032 & ye) >>> 6, ue[2] = 128 | 63 & ye) : ye > 128 ? (ue[0] = 192 | (1984 & ye) >>> 6, ue[1] = 128 | 63 & ye) : ue[0] = ye, this.parsedData.push(ue);
        }
        this.parsedData = Array.prototype.concat.apply([], this.parsedData), I || this.parsedData.length == this.data.length || (this.parsedData.unshift(191), this.parsedData.unshift(187), this.parsedData.unshift(239));
      }
      function u(O, M) {
        this.typeNumber = O, this.errorCorrectLevel = M, this.modules = null, this.moduleCount = 0, this.dataCache = null, this.dataList = [];
      }
      function f(O, M) {
        if (O.length == z) throw new Error(O.length + "/" + M);
        for (var I = 0; I < O.length && O[I] == 0; ) I++;
        this.num = new Array(O.length - I + M);
        for (var j = 0; j < O.length - I; j++) this.num[j] = O[j + I];
      }
      function p(O, M) {
        this.totalCount = O, this.dataCount = M;
      }
      function _() {
        this.buffer = [], this.length = 0;
      }
      function y() {
        var O = !1, M = navigator.userAgent;
        if (/android/i.test(M)) {
          O = !0;
          var I = M.toString().match(/android ([0-9]\.[0-9])/i);
          I && I[1] && (O = parseFloat(I[1]));
        }
        return O;
      }
      function U(O, M) {
        for (var I = M.correctLevel, j = 1, J = X(O), ue = 0, ye = Me.length; ue < ye; ue++) {
          var oe = 0;
          switch (I) {
            case fe.L:
              oe = Me[ue][0];
              break;
            case fe.M:
              oe = Me[ue][1];
              break;
            case fe.Q:
              oe = Me[ue][2];
              break;
            case fe.H:
              oe = Me[ue][3];
          }
          if (J <= oe) break;
          j++;
        }
        if (j > Me.length) throw new Error("Too long data. the CorrectLevel." + [
          "M",
          "L",
          "H",
          "Q"
        ][I] + " limit length is " + oe);
        return M.version != 0 && (j <= M.version ? (j = M.version, M.runVersion = j) : (console.warn("QR Code version " + M.version + " too small, run version use " + j), M.runVersion = j)), j;
      }
      function X(O) {
        var M = encodeURI(O).toString().replace(/\%[0-9a-fA-F]{2}/g, "a");
        return M.length + (M.length != O.length ? 3 : 0);
      }
      var z, Q, w = typeof n == "object" && n && n.Object === Object && n, k = typeof self == "object" && self && self.Object === Object && self, R = w || k || Function("return this")(), W = s && !s.nodeType && s, ne = W && !0 && o && !o.nodeType && o, ie = R.QRCode;
      l.prototype = {
        getLength: function(O) {
          return this.parsedData.length;
        },
        write: function(O) {
          for (var M = 0, I = this.parsedData.length; M < I; M++) O.put(this.parsedData[M], 8);
        }
      }, u.prototype = {
        addData: function(O, M, I) {
          var j = new l(O, M, I);
          this.dataList.push(j), this.dataCache = null;
        },
        isDark: function(O, M) {
          if (O < 0 || this.moduleCount <= O || M < 0 || this.moduleCount <= M) throw new Error(O + "," + M);
          return this.modules[O][M][0];
        },
        getEye: function(O, M) {
          if (O < 0 || this.moduleCount <= O || M < 0 || this.moduleCount <= M) throw new Error(O + "," + M);
          var I = this.modules[O][M];
          if (I[1]) {
            var j = "P" + I[1] + "_" + I[2];
            return I[2] == "A" && (j = "A" + I[1]), {
              isDark: I[0],
              type: j
            };
          }
          return null;
        },
        getModuleCount: function() {
          return this.moduleCount;
        },
        make: function() {
          this.makeImpl(!1, this.getBestMaskPattern());
        },
        makeImpl: function(O, M) {
          this.moduleCount = 4 * this.typeNumber + 17, this.modules = new Array(this.moduleCount);
          for (var I = 0; I < this.moduleCount; I++) {
            this.modules[I] = new Array(this.moduleCount);
            for (var j = 0; j < this.moduleCount; j++) this.modules[I][j] = [];
          }
          this.setupPositionProbePattern(0, 0, "TL"), this.setupPositionProbePattern(this.moduleCount - 7, 0, "BL"), this.setupPositionProbePattern(0, this.moduleCount - 7, "TR"), this.setupPositionAdjustPattern("A"), this.setupTimingPattern(), this.setupTypeInfo(O, M), this.typeNumber >= 7 && this.setupTypeNumber(O), this.dataCache == null && (this.dataCache = u.createData(this.typeNumber, this.errorCorrectLevel, this.dataList)), this.mapData(this.dataCache, M);
        },
        setupPositionProbePattern: function(O, M, I) {
          for (var j = -1; j <= 7; j++) if (!(O + j <= -1 || this.moduleCount <= O + j)) for (var J = -1; J <= 7; J++) M + J <= -1 || this.moduleCount <= M + J || (0 <= j && j <= 6 && (J == 0 || J == 6) || 0 <= J && J <= 6 && (j == 0 || j == 6) || 2 <= j && j <= 4 && 2 <= J && J <= 4 ? (this.modules[O + j][M + J][0] = !0, this.modules[O + j][M + J][2] = I, this.modules[O + j][M + J][1] = j == -0 || J == -0 || j == 6 || J == 6 ? "O" : "I") : this.modules[O + j][M + J][0] = !1);
        },
        getBestMaskPattern: function() {
          for (var O = 0, M = 0, I = 0; I < 8; I++) {
            this.makeImpl(!0, I);
            var j = xe.getLostPoint(this);
            (I == 0 || O > j) && (O = j, M = I);
          }
          return M;
        },
        createMovieClip: function(O, M, I) {
          var j = O.createEmptyMovieClip(M, I);
          this.make();
          for (var J = 0; J < this.modules.length; J++) for (var ue = 1 * J, ye = 0; ye < this.modules[J].length; ye++) {
            var oe = 1 * ye, B = this.modules[J][ye][0];
            B && (j.beginFill(0, 100), j.moveTo(oe, ue), j.lineTo(oe + 1, ue), j.lineTo(oe + 1, ue + 1), j.lineTo(oe, ue + 1), j.endFill());
          }
          return j;
        },
        setupTimingPattern: function() {
          for (var O = 8; O < this.moduleCount - 8; O++) this.modules[O][6][0] == null && (this.modules[O][6][0] = O % 2 == 0);
          for (var M = 8; M < this.moduleCount - 8; M++) this.modules[6][M][0] == null && (this.modules[6][M][0] = M % 2 == 0);
        },
        setupPositionAdjustPattern: function(O) {
          for (var M = xe.getPatternPosition(this.typeNumber), I = 0; I < M.length; I++) for (var j = 0; j < M.length; j++) {
            var J = M[I], ue = M[j];
            if (this.modules[J][ue][0] == null) for (var ye = -2; ye <= 2; ye++) for (var oe = -2; oe <= 2; oe++) ye == -2 || ye == 2 || oe == -2 || oe == 2 || ye == 0 && oe == 0 ? (this.modules[J + ye][ue + oe][0] = !0, this.modules[J + ye][ue + oe][2] = O, this.modules[J + ye][ue + oe][1] = ye == -2 || oe == -2 || ye == 2 || oe == 2 ? "O" : "I") : this.modules[J + ye][ue + oe][0] = !1;
          }
        },
        setupTypeNumber: function(O) {
          for (var M = xe.getBCHTypeNumber(this.typeNumber), I = 0; I < 18; I++) {
            var j = !O && (M >> I & 1) == 1;
            this.modules[Math.floor(I / 3)][I % 3 + this.moduleCount - 8 - 3][0] = j;
          }
          for (var I = 0; I < 18; I++) {
            var j = !O && (M >> I & 1) == 1;
            this.modules[I % 3 + this.moduleCount - 8 - 3][Math.floor(I / 3)][0] = j;
          }
        },
        setupTypeInfo: function(O, M) {
          for (var I = this.errorCorrectLevel << 3 | M, j = xe.getBCHTypeInfo(I), J = 0; J < 15; J++) {
            var ue = !O && (j >> J & 1) == 1;
            J < 6 ? this.modules[J][8][0] = ue : J < 8 ? this.modules[J + 1][8][0] = ue : this.modules[this.moduleCount - 15 + J][8][0] = ue;
          }
          for (var J = 0; J < 15; J++) {
            var ue = !O && (j >> J & 1) == 1;
            J < 8 ? this.modules[8][this.moduleCount - J - 1][0] = ue : J < 9 ? this.modules[8][15 - J - 1 + 1][0] = ue : this.modules[8][15 - J - 1][0] = ue;
          }
          this.modules[this.moduleCount - 8][8][0] = !O;
        },
        mapData: function(O, M) {
          for (var I = -1, j = this.moduleCount - 1, J = 7, ue = 0, ye = this.moduleCount - 1; ye > 0; ye -= 2) for (ye == 6 && ye--; ; ) {
            for (var oe = 0; oe < 2; oe++) if (this.modules[j][ye - oe][0] == null) {
              var B = !1;
              ue < O.length && (B = (O[ue] >>> J & 1) == 1);
              var yt = xe.getMask(M, j, ye - oe);
              yt && (B = !B), this.modules[j][ye - oe][0] = B, J--, J == -1 && (ue++, J = 7);
            }
            if ((j += I) < 0 || this.moduleCount <= j) {
              j -= I, I = -I;
              break;
            }
          }
        }
      }, u.PAD0 = 236, u.PAD1 = 17, u.createData = function(O, M, I) {
        for (var j = p.getRSBlocks(O, M), J = new _(), ue = 0; ue < I.length; ue++) {
          var ye = I[ue];
          J.put(ye.mode, 4), J.put(ye.getLength(), xe.getLengthInBits(ye.mode, O)), ye.write(J);
        }
        for (var oe = 0, ue = 0; ue < j.length; ue++) oe += j[ue].dataCount;
        if (J.getLengthInBits() > 8 * oe) throw new Error("code length overflow. (" + J.getLengthInBits() + ">" + 8 * oe + ")");
        for (J.getLengthInBits() + 4 <= 8 * oe && J.put(0, 4); J.getLengthInBits() % 8 != 0; ) J.putBit(!1);
        for (; !(J.getLengthInBits() >= 8 * oe || (J.put(u.PAD0, 8), J.getLengthInBits() >= 8 * oe)); )
          J.put(u.PAD1, 8);
        return u.createBytes(J, j);
      }, u.createBytes = function(O, M) {
        for (var I = 0, j = 0, J = 0, ue = new Array(M.length), ye = new Array(M.length), oe = 0; oe < M.length; oe++) {
          var B = M[oe].dataCount, yt = M[oe].totalCount - B;
          j = Math.max(j, B), J = Math.max(J, yt), ue[oe] = new Array(B);
          for (var Qe = 0; Qe < ue[oe].length; Qe++) ue[oe][Qe] = 255 & O.buffer[Qe + I];
          I += B;
          var Kt = xe.getErrorCorrectPolynomial(yt), ze = new f(ue[oe], Kt.getLength() - 1), Dn = ze.mod(Kt);
          ye[oe] = new Array(Kt.getLength() - 1);
          for (var Qe = 0; Qe < ye[oe].length; Qe++) {
            var Cn = Qe + Dn.getLength() - ye[oe].length;
            ye[oe][Qe] = Cn >= 0 ? Dn.get(Cn) : 0;
          }
        }
        for (var Mr = 0, Qe = 0; Qe < M.length; Qe++) Mr += M[Qe].totalCount;
        for (var Zn = new Array(Mr), fn = 0, Qe = 0; Qe < j; Qe++) for (var oe = 0; oe < M.length; oe++) Qe < ue[oe].length && (Zn[fn++] = ue[oe][Qe]);
        for (var Qe = 0; Qe < J; Qe++) for (var oe = 0; oe < M.length; oe++) Qe < ye[oe].length && (Zn[fn++] = ye[oe][Qe]);
        return Zn;
      };
      for (var be = {
        MODE_NUMBER: 1,
        MODE_ALPHA_NUM: 2,
        MODE_8BIT_BYTE: 4,
        MODE_KANJI: 8
      }, fe = {
        L: 1,
        M: 0,
        Q: 3,
        H: 2
      }, Ae = {
        PATTERN000: 0,
        PATTERN001: 1,
        PATTERN010: 2,
        PATTERN011: 3,
        PATTERN100: 4,
        PATTERN101: 5,
        PATTERN110: 6,
        PATTERN111: 7
      }, xe = {
        PATTERN_POSITION_TABLE: [
          [],
          [
            6,
            18
          ],
          [
            6,
            22
          ],
          [
            6,
            26
          ],
          [
            6,
            30
          ],
          [
            6,
            34
          ],
          [
            6,
            22,
            38
          ],
          [
            6,
            24,
            42
          ],
          [
            6,
            26,
            46
          ],
          [
            6,
            28,
            50
          ],
          [
            6,
            30,
            54
          ],
          [
            6,
            32,
            58
          ],
          [
            6,
            34,
            62
          ],
          [
            6,
            26,
            46,
            66
          ],
          [
            6,
            26,
            48,
            70
          ],
          [
            6,
            26,
            50,
            74
          ],
          [
            6,
            30,
            54,
            78
          ],
          [
            6,
            30,
            56,
            82
          ],
          [
            6,
            30,
            58,
            86
          ],
          [
            6,
            34,
            62,
            90
          ],
          [
            6,
            28,
            50,
            72,
            94
          ],
          [
            6,
            26,
            50,
            74,
            98
          ],
          [
            6,
            30,
            54,
            78,
            102
          ],
          [
            6,
            28,
            54,
            80,
            106
          ],
          [
            6,
            32,
            58,
            84,
            110
          ],
          [
            6,
            30,
            58,
            86,
            114
          ],
          [
            6,
            34,
            62,
            90,
            118
          ],
          [
            6,
            26,
            50,
            74,
            98,
            122
          ],
          [
            6,
            30,
            54,
            78,
            102,
            126
          ],
          [
            6,
            26,
            52,
            78,
            104,
            130
          ],
          [
            6,
            30,
            56,
            82,
            108,
            134
          ],
          [
            6,
            34,
            60,
            86,
            112,
            138
          ],
          [
            6,
            30,
            58,
            86,
            114,
            142
          ],
          [
            6,
            34,
            62,
            90,
            118,
            146
          ],
          [
            6,
            30,
            54,
            78,
            102,
            126,
            150
          ],
          [
            6,
            24,
            50,
            76,
            102,
            128,
            154
          ],
          [
            6,
            28,
            54,
            80,
            106,
            132,
            158
          ],
          [
            6,
            32,
            58,
            84,
            110,
            136,
            162
          ],
          [
            6,
            26,
            54,
            82,
            110,
            138,
            166
          ],
          [
            6,
            30,
            58,
            86,
            114,
            142,
            170
          ]
        ],
        G15: 1335,
        G18: 7973,
        G15_MASK: 21522,
        getBCHTypeInfo: function(O) {
          for (var M = O << 10; xe.getBCHDigit(M) - xe.getBCHDigit(xe.G15) >= 0; ) M ^= xe.G15 << xe.getBCHDigit(M) - xe.getBCHDigit(xe.G15);
          return (O << 10 | M) ^ xe.G15_MASK;
        },
        getBCHTypeNumber: function(O) {
          for (var M = O << 12; xe.getBCHDigit(M) - xe.getBCHDigit(xe.G18) >= 0; ) M ^= xe.G18 << xe.getBCHDigit(M) - xe.getBCHDigit(xe.G18);
          return O << 12 | M;
        },
        getBCHDigit: function(O) {
          for (var M = 0; O != 0; ) M++, O >>>= 1;
          return M;
        },
        getPatternPosition: function(O) {
          return xe.PATTERN_POSITION_TABLE[O - 1];
        },
        getMask: function(O, M, I) {
          switch (O) {
            case Ae.PATTERN000:
              return (M + I) % 2 == 0;
            case Ae.PATTERN001:
              return M % 2 == 0;
            case Ae.PATTERN010:
              return I % 3 == 0;
            case Ae.PATTERN011:
              return (M + I) % 3 == 0;
            case Ae.PATTERN100:
              return (Math.floor(M / 2) + Math.floor(I / 3)) % 2 == 0;
            case Ae.PATTERN101:
              return M * I % 2 + M * I % 3 == 0;
            case Ae.PATTERN110:
              return (M * I % 2 + M * I % 3) % 2 == 0;
            case Ae.PATTERN111:
              return (M * I % 3 + (M + I) % 2) % 2 == 0;
            default:
              throw new Error("bad maskPattern:" + O);
          }
        },
        getErrorCorrectPolynomial: function(O) {
          for (var M = new f([
            1
          ], 0), I = 0; I < O; I++) M = M.multiply(new f([
            1,
            we.gexp(I)
          ], 0));
          return M;
        },
        getLengthInBits: function(O, M) {
          if (1 <= M && M < 10) switch (O) {
            case be.MODE_NUMBER:
              return 10;
            case be.MODE_ALPHA_NUM:
              return 9;
            case be.MODE_8BIT_BYTE:
            case be.MODE_KANJI:
              return 8;
            default:
              throw new Error("mode:" + O);
          }
          else if (M < 27) switch (O) {
            case be.MODE_NUMBER:
              return 12;
            case be.MODE_ALPHA_NUM:
              return 11;
            case be.MODE_8BIT_BYTE:
              return 16;
            case be.MODE_KANJI:
              return 10;
            default:
              throw new Error("mode:" + O);
          }
          else {
            if (!(M < 41)) throw new Error("type:" + M);
            switch (O) {
              case be.MODE_NUMBER:
                return 14;
              case be.MODE_ALPHA_NUM:
                return 13;
              case be.MODE_8BIT_BYTE:
                return 16;
              case be.MODE_KANJI:
                return 12;
              default:
                throw new Error("mode:" + O);
            }
          }
        },
        getLostPoint: function(O) {
          for (var M = O.getModuleCount(), I = 0, j = 0; j < M; j++) for (var J = 0; J < M; J++) {
            for (var ue = 0, ye = O.isDark(j, J), oe = -1; oe <= 1; oe++) if (!(j + oe < 0 || M <= j + oe)) for (var B = -1; B <= 1; B++) J + B < 0 || M <= J + B || oe == 0 && B == 0 || ye == O.isDark(j + oe, J + B) && ue++;
            ue > 5 && (I += 3 + ue - 5);
          }
          for (var j = 0; j < M - 1; j++) for (var J = 0; J < M - 1; J++) {
            var yt = 0;
            O.isDark(j, J) && yt++, O.isDark(j + 1, J) && yt++, O.isDark(j, J + 1) && yt++, O.isDark(j + 1, J + 1) && yt++, yt != 0 && yt != 4 || (I += 3);
          }
          for (var j = 0; j < M; j++) for (var J = 0; J < M - 6; J++) O.isDark(j, J) && !O.isDark(j, J + 1) && O.isDark(j, J + 2) && O.isDark(j, J + 3) && O.isDark(j, J + 4) && !O.isDark(j, J + 5) && O.isDark(j, J + 6) && (I += 40);
          for (var J = 0; J < M; J++) for (var j = 0; j < M - 6; j++) O.isDark(j, J) && !O.isDark(j + 1, J) && O.isDark(j + 2, J) && O.isDark(j + 3, J) && O.isDark(j + 4, J) && !O.isDark(j + 5, J) && O.isDark(j + 6, J) && (I += 40);
          for (var Qe = 0, J = 0; J < M; J++) for (var j = 0; j < M; j++) O.isDark(j, J) && Qe++;
          return I += Math.abs(100 * Qe / M / M - 50) / 5 * 10;
        }
      }, we = {
        glog: function(O) {
          if (O < 1) throw new Error("glog(" + O + ")");
          return we.LOG_TABLE[O];
        },
        gexp: function(O) {
          for (; O < 0; ) O += 255;
          for (; O >= 256; ) O -= 255;
          return we.EXP_TABLE[O];
        },
        EXP_TABLE: new Array(256),
        LOG_TABLE: new Array(256)
      }, Ie = 0; Ie < 8; Ie++) we.EXP_TABLE[Ie] = 1 << Ie;
      for (var Ie = 8; Ie < 256; Ie++) we.EXP_TABLE[Ie] = we.EXP_TABLE[Ie - 4] ^ we.EXP_TABLE[Ie - 5] ^ we.EXP_TABLE[Ie - 6] ^ we.EXP_TABLE[Ie - 8];
      for (var Ie = 0; Ie < 255; Ie++) we.LOG_TABLE[we.EXP_TABLE[Ie]] = Ie;
      f.prototype = {
        get: function(O) {
          return this.num[O];
        },
        getLength: function() {
          return this.num.length;
        },
        multiply: function(O) {
          for (var M = new Array(this.getLength() + O.getLength() - 1), I = 0; I < this.getLength(); I++) for (var j = 0; j < O.getLength(); j++) M[I + j] ^= we.gexp(we.glog(this.get(I)) + we.glog(O.get(j)));
          return new f(M, 0);
        },
        mod: function(O) {
          if (this.getLength() - O.getLength() < 0) return this;
          for (var M = we.glog(this.get(0)) - we.glog(O.get(0)), I = new Array(this.getLength()), j = 0; j < this.getLength(); j++) I[j] = this.get(j);
          for (var j = 0; j < O.getLength(); j++) I[j] ^= we.gexp(we.glog(O.get(j)) + M);
          return new f(I, 0).mod(O);
        }
      }, p.RS_BLOCK_TABLE = [
        [
          1,
          26,
          19
        ],
        [
          1,
          26,
          16
        ],
        [
          1,
          26,
          13
        ],
        [
          1,
          26,
          9
        ],
        [
          1,
          44,
          34
        ],
        [
          1,
          44,
          28
        ],
        [
          1,
          44,
          22
        ],
        [
          1,
          44,
          16
        ],
        [
          1,
          70,
          55
        ],
        [
          1,
          70,
          44
        ],
        [
          2,
          35,
          17
        ],
        [
          2,
          35,
          13
        ],
        [
          1,
          100,
          80
        ],
        [
          2,
          50,
          32
        ],
        [
          2,
          50,
          24
        ],
        [
          4,
          25,
          9
        ],
        [
          1,
          134,
          108
        ],
        [
          2,
          67,
          43
        ],
        [
          2,
          33,
          15,
          2,
          34,
          16
        ],
        [
          2,
          33,
          11,
          2,
          34,
          12
        ],
        [
          2,
          86,
          68
        ],
        [
          4,
          43,
          27
        ],
        [
          4,
          43,
          19
        ],
        [
          4,
          43,
          15
        ],
        [
          2,
          98,
          78
        ],
        [
          4,
          49,
          31
        ],
        [
          2,
          32,
          14,
          4,
          33,
          15
        ],
        [
          4,
          39,
          13,
          1,
          40,
          14
        ],
        [
          2,
          121,
          97
        ],
        [
          2,
          60,
          38,
          2,
          61,
          39
        ],
        [
          4,
          40,
          18,
          2,
          41,
          19
        ],
        [
          4,
          40,
          14,
          2,
          41,
          15
        ],
        [
          2,
          146,
          116
        ],
        [
          3,
          58,
          36,
          2,
          59,
          37
        ],
        [
          4,
          36,
          16,
          4,
          37,
          17
        ],
        [
          4,
          36,
          12,
          4,
          37,
          13
        ],
        [
          2,
          86,
          68,
          2,
          87,
          69
        ],
        [
          4,
          69,
          43,
          1,
          70,
          44
        ],
        [
          6,
          43,
          19,
          2,
          44,
          20
        ],
        [
          6,
          43,
          15,
          2,
          44,
          16
        ],
        [
          4,
          101,
          81
        ],
        [
          1,
          80,
          50,
          4,
          81,
          51
        ],
        [
          4,
          50,
          22,
          4,
          51,
          23
        ],
        [
          3,
          36,
          12,
          8,
          37,
          13
        ],
        [
          2,
          116,
          92,
          2,
          117,
          93
        ],
        [
          6,
          58,
          36,
          2,
          59,
          37
        ],
        [
          4,
          46,
          20,
          6,
          47,
          21
        ],
        [
          7,
          42,
          14,
          4,
          43,
          15
        ],
        [
          4,
          133,
          107
        ],
        [
          8,
          59,
          37,
          1,
          60,
          38
        ],
        [
          8,
          44,
          20,
          4,
          45,
          21
        ],
        [
          12,
          33,
          11,
          4,
          34,
          12
        ],
        [
          3,
          145,
          115,
          1,
          146,
          116
        ],
        [
          4,
          64,
          40,
          5,
          65,
          41
        ],
        [
          11,
          36,
          16,
          5,
          37,
          17
        ],
        [
          11,
          36,
          12,
          5,
          37,
          13
        ],
        [
          5,
          109,
          87,
          1,
          110,
          88
        ],
        [
          5,
          65,
          41,
          5,
          66,
          42
        ],
        [
          5,
          54,
          24,
          7,
          55,
          25
        ],
        [
          11,
          36,
          12,
          7,
          37,
          13
        ],
        [
          5,
          122,
          98,
          1,
          123,
          99
        ],
        [
          7,
          73,
          45,
          3,
          74,
          46
        ],
        [
          15,
          43,
          19,
          2,
          44,
          20
        ],
        [
          3,
          45,
          15,
          13,
          46,
          16
        ],
        [
          1,
          135,
          107,
          5,
          136,
          108
        ],
        [
          10,
          74,
          46,
          1,
          75,
          47
        ],
        [
          1,
          50,
          22,
          15,
          51,
          23
        ],
        [
          2,
          42,
          14,
          17,
          43,
          15
        ],
        [
          5,
          150,
          120,
          1,
          151,
          121
        ],
        [
          9,
          69,
          43,
          4,
          70,
          44
        ],
        [
          17,
          50,
          22,
          1,
          51,
          23
        ],
        [
          2,
          42,
          14,
          19,
          43,
          15
        ],
        [
          3,
          141,
          113,
          4,
          142,
          114
        ],
        [
          3,
          70,
          44,
          11,
          71,
          45
        ],
        [
          17,
          47,
          21,
          4,
          48,
          22
        ],
        [
          9,
          39,
          13,
          16,
          40,
          14
        ],
        [
          3,
          135,
          107,
          5,
          136,
          108
        ],
        [
          3,
          67,
          41,
          13,
          68,
          42
        ],
        [
          15,
          54,
          24,
          5,
          55,
          25
        ],
        [
          15,
          43,
          15,
          10,
          44,
          16
        ],
        [
          4,
          144,
          116,
          4,
          145,
          117
        ],
        [
          17,
          68,
          42
        ],
        [
          17,
          50,
          22,
          6,
          51,
          23
        ],
        [
          19,
          46,
          16,
          6,
          47,
          17
        ],
        [
          2,
          139,
          111,
          7,
          140,
          112
        ],
        [
          17,
          74,
          46
        ],
        [
          7,
          54,
          24,
          16,
          55,
          25
        ],
        [
          34,
          37,
          13
        ],
        [
          4,
          151,
          121,
          5,
          152,
          122
        ],
        [
          4,
          75,
          47,
          14,
          76,
          48
        ],
        [
          11,
          54,
          24,
          14,
          55,
          25
        ],
        [
          16,
          45,
          15,
          14,
          46,
          16
        ],
        [
          6,
          147,
          117,
          4,
          148,
          118
        ],
        [
          6,
          73,
          45,
          14,
          74,
          46
        ],
        [
          11,
          54,
          24,
          16,
          55,
          25
        ],
        [
          30,
          46,
          16,
          2,
          47,
          17
        ],
        [
          8,
          132,
          106,
          4,
          133,
          107
        ],
        [
          8,
          75,
          47,
          13,
          76,
          48
        ],
        [
          7,
          54,
          24,
          22,
          55,
          25
        ],
        [
          22,
          45,
          15,
          13,
          46,
          16
        ],
        [
          10,
          142,
          114,
          2,
          143,
          115
        ],
        [
          19,
          74,
          46,
          4,
          75,
          47
        ],
        [
          28,
          50,
          22,
          6,
          51,
          23
        ],
        [
          33,
          46,
          16,
          4,
          47,
          17
        ],
        [
          8,
          152,
          122,
          4,
          153,
          123
        ],
        [
          22,
          73,
          45,
          3,
          74,
          46
        ],
        [
          8,
          53,
          23,
          26,
          54,
          24
        ],
        [
          12,
          45,
          15,
          28,
          46,
          16
        ],
        [
          3,
          147,
          117,
          10,
          148,
          118
        ],
        [
          3,
          73,
          45,
          23,
          74,
          46
        ],
        [
          4,
          54,
          24,
          31,
          55,
          25
        ],
        [
          11,
          45,
          15,
          31,
          46,
          16
        ],
        [
          7,
          146,
          116,
          7,
          147,
          117
        ],
        [
          21,
          73,
          45,
          7,
          74,
          46
        ],
        [
          1,
          53,
          23,
          37,
          54,
          24
        ],
        [
          19,
          45,
          15,
          26,
          46,
          16
        ],
        [
          5,
          145,
          115,
          10,
          146,
          116
        ],
        [
          19,
          75,
          47,
          10,
          76,
          48
        ],
        [
          15,
          54,
          24,
          25,
          55,
          25
        ],
        [
          23,
          45,
          15,
          25,
          46,
          16
        ],
        [
          13,
          145,
          115,
          3,
          146,
          116
        ],
        [
          2,
          74,
          46,
          29,
          75,
          47
        ],
        [
          42,
          54,
          24,
          1,
          55,
          25
        ],
        [
          23,
          45,
          15,
          28,
          46,
          16
        ],
        [
          17,
          145,
          115
        ],
        [
          10,
          74,
          46,
          23,
          75,
          47
        ],
        [
          10,
          54,
          24,
          35,
          55,
          25
        ],
        [
          19,
          45,
          15,
          35,
          46,
          16
        ],
        [
          17,
          145,
          115,
          1,
          146,
          116
        ],
        [
          14,
          74,
          46,
          21,
          75,
          47
        ],
        [
          29,
          54,
          24,
          19,
          55,
          25
        ],
        [
          11,
          45,
          15,
          46,
          46,
          16
        ],
        [
          13,
          145,
          115,
          6,
          146,
          116
        ],
        [
          14,
          74,
          46,
          23,
          75,
          47
        ],
        [
          44,
          54,
          24,
          7,
          55,
          25
        ],
        [
          59,
          46,
          16,
          1,
          47,
          17
        ],
        [
          12,
          151,
          121,
          7,
          152,
          122
        ],
        [
          12,
          75,
          47,
          26,
          76,
          48
        ],
        [
          39,
          54,
          24,
          14,
          55,
          25
        ],
        [
          22,
          45,
          15,
          41,
          46,
          16
        ],
        [
          6,
          151,
          121,
          14,
          152,
          122
        ],
        [
          6,
          75,
          47,
          34,
          76,
          48
        ],
        [
          46,
          54,
          24,
          10,
          55,
          25
        ],
        [
          2,
          45,
          15,
          64,
          46,
          16
        ],
        [
          17,
          152,
          122,
          4,
          153,
          123
        ],
        [
          29,
          74,
          46,
          14,
          75,
          47
        ],
        [
          49,
          54,
          24,
          10,
          55,
          25
        ],
        [
          24,
          45,
          15,
          46,
          46,
          16
        ],
        [
          4,
          152,
          122,
          18,
          153,
          123
        ],
        [
          13,
          74,
          46,
          32,
          75,
          47
        ],
        [
          48,
          54,
          24,
          14,
          55,
          25
        ],
        [
          42,
          45,
          15,
          32,
          46,
          16
        ],
        [
          20,
          147,
          117,
          4,
          148,
          118
        ],
        [
          40,
          75,
          47,
          7,
          76,
          48
        ],
        [
          43,
          54,
          24,
          22,
          55,
          25
        ],
        [
          10,
          45,
          15,
          67,
          46,
          16
        ],
        [
          19,
          148,
          118,
          6,
          149,
          119
        ],
        [
          18,
          75,
          47,
          31,
          76,
          48
        ],
        [
          34,
          54,
          24,
          34,
          55,
          25
        ],
        [
          20,
          45,
          15,
          61,
          46,
          16
        ]
      ], p.getRSBlocks = function(O, M) {
        var I = p.getRsBlockTable(O, M);
        if (I == z) throw new Error("bad rs block @ typeNumber:" + O + "/errorCorrectLevel:" + M);
        for (var j = I.length / 3, J = [], ue = 0; ue < j; ue++) for (var ye = I[3 * ue + 0], oe = I[3 * ue + 1], B = I[3 * ue + 2], yt = 0; yt < ye; yt++) J.push(new p(oe, B));
        return J;
      }, p.getRsBlockTable = function(O, M) {
        switch (M) {
          case fe.L:
            return p.RS_BLOCK_TABLE[4 * (O - 1) + 0];
          case fe.M:
            return p.RS_BLOCK_TABLE[4 * (O - 1) + 1];
          case fe.Q:
            return p.RS_BLOCK_TABLE[4 * (O - 1) + 2];
          case fe.H:
            return p.RS_BLOCK_TABLE[4 * (O - 1) + 3];
          default:
            return z;
        }
      }, _.prototype = {
        get: function(O) {
          var M = Math.floor(O / 8);
          return (this.buffer[M] >>> 7 - O % 8 & 1) == 1;
        },
        put: function(O, M) {
          for (var I = 0; I < M; I++) this.putBit((O >>> M - I - 1 & 1) == 1);
        },
        getLengthInBits: function() {
          return this.length;
        },
        putBit: function(O) {
          var M = Math.floor(this.length / 8);
          this.buffer.length <= M && this.buffer.push(0), O && (this.buffer[M] |= 128 >>> this.length % 8), this.length++;
        }
      };
      var Me = [
        [
          17,
          14,
          11,
          7
        ],
        [
          32,
          26,
          20,
          14
        ],
        [
          53,
          42,
          32,
          24
        ],
        [
          78,
          62,
          46,
          34
        ],
        [
          106,
          84,
          60,
          44
        ],
        [
          134,
          106,
          74,
          58
        ],
        [
          154,
          122,
          86,
          64
        ],
        [
          192,
          152,
          108,
          84
        ],
        [
          230,
          180,
          130,
          98
        ],
        [
          271,
          213,
          151,
          119
        ],
        [
          321,
          251,
          177,
          137
        ],
        [
          367,
          287,
          203,
          155
        ],
        [
          425,
          331,
          241,
          177
        ],
        [
          458,
          362,
          258,
          194
        ],
        [
          520,
          412,
          292,
          220
        ],
        [
          586,
          450,
          322,
          250
        ],
        [
          644,
          504,
          364,
          280
        ],
        [
          718,
          560,
          394,
          310
        ],
        [
          792,
          624,
          442,
          338
        ],
        [
          858,
          666,
          482,
          382
        ],
        [
          929,
          711,
          509,
          403
        ],
        [
          1003,
          779,
          565,
          439
        ],
        [
          1091,
          857,
          611,
          461
        ],
        [
          1171,
          911,
          661,
          511
        ],
        [
          1273,
          997,
          715,
          535
        ],
        [
          1367,
          1059,
          751,
          593
        ],
        [
          1465,
          1125,
          805,
          625
        ],
        [
          1528,
          1190,
          868,
          658
        ],
        [
          1628,
          1264,
          908,
          698
        ],
        [
          1732,
          1370,
          982,
          742
        ],
        [
          1840,
          1452,
          1030,
          790
        ],
        [
          1952,
          1538,
          1112,
          842
        ],
        [
          2068,
          1628,
          1168,
          898
        ],
        [
          2188,
          1722,
          1228,
          958
        ],
        [
          2303,
          1809,
          1283,
          983
        ],
        [
          2431,
          1911,
          1351,
          1051
        ],
        [
          2563,
          1989,
          1423,
          1093
        ],
        [
          2699,
          2099,
          1499,
          1139
        ],
        [
          2809,
          2213,
          1579,
          1219
        ],
        [
          2953,
          2331,
          1663,
          1273
        ]
      ], vt = /* @__PURE__ */ (function() {
        return typeof CanvasRenderingContext2D < "u";
      })() ? (function() {
        function O() {
          if (this._htOption.drawer == "svg") {
            var ue = this._oContext.getSerializedSvg(!0);
            this.dataURL = ue, this._el.innerHTML = ue;
          } else try {
            var ye = this._elCanvas.toDataURL("image/png");
            this.dataURL = ye;
          } catch (oe) {
            console.error(oe);
          }
          this._htOption.onRenderingEnd && (this.dataURL || console.error("Can not get base64 data, please check: 1. Published the page and image to the server 2. The image request support CORS 3. Configured `crossOrigin:'anonymous'` option"), this._htOption.onRenderingEnd(this._htOption, this.dataURL));
        }
        function M(ue, ye) {
          var oe = this;
          if (oe._fFail = ye, oe._fSuccess = ue, oe._bSupportDataURI === null) {
            var B = document.createElement("img"), yt = function() {
              oe._bSupportDataURI = !1, oe._fFail && oe._fFail.call(oe);
            }, Qe = function() {
              oe._bSupportDataURI = !0, oe._fSuccess && oe._fSuccess.call(oe);
            };
            return B.onabort = yt, B.onerror = yt, B.onload = Qe, void (B.src = "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==");
          }
          oe._bSupportDataURI === !0 && oe._fSuccess ? oe._fSuccess.call(oe) : oe._bSupportDataURI === !1 && oe._fFail && oe._fFail.call(oe);
        }
        if (R._android && R._android <= 2.1) {
          var I = 1 / window.devicePixelRatio, j = CanvasRenderingContext2D.prototype.drawImage;
          CanvasRenderingContext2D.prototype.drawImage = function(ue, ye, oe, B, yt, Qe, Kt, ze, Dn) {
            if ("nodeName" in ue && /img/i.test(ue.nodeName)) for (var Cn = arguments.length - 1; Cn >= 1; Cn--) arguments[Cn] = arguments[Cn] * I;
            else ze === void 0 && (arguments[1] *= I, arguments[2] *= I, arguments[3] *= I, arguments[4] *= I);
            j.apply(this, arguments);
          };
        }
        var J = function(ue, ye) {
          this._bIsPainted = !1, this._android = y(), this._el = ue, this._htOption = ye, this._htOption.drawer == "svg" ? (this._oContext = {}, this._elCanvas = {}) : (this._elCanvas = document.createElement("canvas"), this._el.appendChild(this._elCanvas), this._oContext = this._elCanvas.getContext("2d")), this._bSupportDataURI = null, this.dataURL = null;
        };
        return J.prototype.draw = function(ue) {
          function ye() {
            B.quietZone > 0 && B.quietZoneColor && (ze.lineWidth = 0, ze.fillStyle = B.quietZoneColor, ze.fillRect(0, 0, Dn._elCanvas.width, B.quietZone), ze.fillRect(0, B.quietZone, B.quietZone, Dn._elCanvas.height - 2 * B.quietZone), ze.fillRect(Dn._elCanvas.width - B.quietZone, B.quietZone, B.quietZone, Dn._elCanvas.height - 2 * B.quietZone), ze.fillRect(0, Dn._elCanvas.height - B.quietZone, Dn._elCanvas.width, B.quietZone));
          }
          function oe(Mr) {
            function Zn(dr) {
              var pn = Math.round(B.width / 3.5), Nn = Math.round(B.height / 3.5);
              pn !== Nn && (pn = Nn), B.logoMaxWidth ? pn = Math.round(B.logoMaxWidth) : B.logoWidth && (pn = Math.round(B.logoWidth)), B.logoMaxHeight ? Nn = Math.round(B.logoMaxHeight) : B.logoHeight && (Nn = Math.round(B.logoHeight));
              var es, ts;
              dr.naturalWidth === void 0 ? (es = dr.width, ts = dr.height) : (es = dr.naturalWidth, ts = dr.naturalHeight), (B.logoMaxWidth || B.logoMaxHeight) && (B.logoMaxWidth && es <= pn && (pn = es), B.logoMaxHeight && ts <= Nn && (Nn = ts), es <= pn && ts <= Nn && (pn = es, Nn = ts));
              var Ta = (B.width + 2 * B.quietZone - pn) / 2, La = (B.height + B.titleHeight + 2 * B.quietZone - Nn) / 2, kc = Math.min(pn / es, Nn / ts), Da = es * kc, Oa = ts * kc;
              (B.logoMaxWidth || B.logoMaxHeight) && (pn = Da, Nn = Oa, Ta = (B.width + 2 * B.quietZone - pn) / 2, La = (B.height + B.titleHeight + 2 * B.quietZone - Nn) / 2), B.logoBackgroundTransparent || (ze.fillStyle = B.logoBackgroundColor, ze.fillRect(Ta, La, pn, Nn));
              var mp = ze.imageSmoothingQuality, yp = ze.imageSmoothingEnabled;
              ze.imageSmoothingEnabled = !0, ze.imageSmoothingQuality = "high", ze.drawImage(dr, Ta + (pn - Da) / 2, La + (Nn - Oa) / 2, Da, Oa), ze.imageSmoothingEnabled = yp, ze.imageSmoothingQuality = mp, ye(), Gs._bIsPainted = !0, Gs.makeImage();
            }
            B.onRenderingStart && B.onRenderingStart(B);
            for (var fn = 0; fn < yt; fn++) for (var On = 0; On < yt; On++) {
              var Jr = On * Qe + B.quietZone, Cs = fn * Kt + B.quietZone, Ci = Mr.isDark(fn, On), mn = Mr.getEye(fn, On), qt = B.dotScale;
              ze.lineWidth = 0;
              var Jt, yn;
              mn ? (Jt = B[mn.type] || B[mn.type.substring(0, 2)] || B.colorDark, yn = B.colorLight) : B.backgroundImage ? (yn = "rgba(0,0,0,0)", fn == 6 ? B.autoColor ? (Jt = B.timing_H || B.timing || B.autoColorDark, yn = B.autoColorLight) : Jt = B.timing_H || B.timing || B.colorDark : On == 6 ? B.autoColor ? (Jt = B.timing_V || B.timing || B.autoColorDark, yn = B.autoColorLight) : Jt = B.timing_V || B.timing || B.colorDark : B.autoColor ? (Jt = B.autoColorDark, yn = B.autoColorLight) : Jt = B.colorDark) : (Jt = fn == 6 ? B.timing_H || B.timing || B.colorDark : On == 6 && (B.timing_V || B.timing) || B.colorDark, yn = B.colorLight), ze.strokeStyle = Ci ? Jt : yn, ze.fillStyle = Ci ? Jt : yn, mn ? (qt = mn.type == "AO" ? B.dotScaleAO : mn.type == "AI" ? B.dotScaleAI : 1, B.backgroundImage && B.autoColor ? (Jt = (mn.type == "AO" ? B.AI : B.AO) || B.autoColorDark, yn = B.autoColorLight) : Jt = (mn.type == "AO" ? B.AI : B.AO) || Jt, Ci = mn.isDark, ze.fillRect(Jr + Qe * (1 - qt) / 2, B.titleHeight + Cs + Kt * (1 - qt) / 2, Qe * qt, Kt * qt)) : fn == 6 ? (qt = B.dotScaleTiming_H, ze.fillRect(Jr + Qe * (1 - qt) / 2, B.titleHeight + Cs + Kt * (1 - qt) / 2, Qe * qt, Kt * qt)) : On == 6 ? (qt = B.dotScaleTiming_V, ze.fillRect(Jr + Qe * (1 - qt) / 2, B.titleHeight + Cs + Kt * (1 - qt) / 2, Qe * qt, Kt * qt)) : (B.backgroundImage, ze.fillRect(Jr + Qe * (1 - qt) / 2, B.titleHeight + Cs + Kt * (1 - qt) / 2, Qe * qt, Kt * qt)), B.dotScale == 1 || mn || (ze.strokeStyle = B.colorLight);
            }
            if (B.title && (ze.fillStyle = B.titleBackgroundColor, ze.fillRect(B.quietZone, B.quietZone, B.width, B.titleHeight), ze.font = B.titleFont, ze.fillStyle = B.titleColor, ze.textAlign = "center", ze.fillText(B.title, this._elCanvas.width / 2, +B.quietZone + B.titleTop)), B.subTitle && (ze.font = B.subTitleFont, ze.fillStyle = B.subTitleColor, ze.fillText(B.subTitle, this._elCanvas.width / 2, +B.quietZone + B.subTitleTop)), B.logo) {
              var Rr = new Image(), Gs = this;
              Rr.onload = function() {
                Zn(Rr);
              }, Rr.onerror = function(dr) {
                console.error(dr);
              }, B.crossOrigin != null && (Rr.crossOrigin = B.crossOrigin), Rr.originalSrc = B.logo, Rr.src = B.logo;
            } else ye(), this._bIsPainted = !0, this.makeImage();
          }
          var B = this._htOption, yt = ue.getModuleCount(), Qe = Math.round(B.width / yt), Kt = Math.round((B.height - B.titleHeight) / yt);
          Qe <= 1 && (Qe = 1), Kt <= 1 && (Kt = 1), B.width = Qe * yt, B.height = Kt * yt + B.titleHeight, B.quietZone = Math.round(B.quietZone), this._elCanvas.width = B.width + 2 * B.quietZone, this._elCanvas.height = B.height + 2 * B.quietZone, this._htOption.drawer != "canvas" && (this._oContext = new C2S(this._elCanvas.width, this._elCanvas.height)), this.clear();
          var ze = this._oContext;
          ze.lineWidth = 0, ze.fillStyle = B.colorLight, ze.fillRect(0, 0, this._elCanvas.width, this._elCanvas.height), ze.clearRect(B.quietZone, B.quietZone, B.width, B.titleHeight);
          var Dn = this;
          if (B.backgroundImage) {
            var Cn = new Image();
            Cn.onload = function() {
              ze.globalAlpha = 1, ze.globalAlpha = B.backgroundImageAlpha;
              var Mr = ze.imageSmoothingQuality, Zn = ze.imageSmoothingEnabled;
              ze.imageSmoothingEnabled = !0, ze.imageSmoothingQuality = "high", ze.drawImage(Cn, 0, B.titleHeight, B.width + 2 * B.quietZone, B.height + 2 * B.quietZone - B.titleHeight), ze.imageSmoothingEnabled = Zn, ze.imageSmoothingQuality = Mr, ze.globalAlpha = 1, oe.call(Dn, ue);
            }, B.crossOrigin != null && (Cn.crossOrigin = B.crossOrigin), Cn.originalSrc = B.backgroundImage, Cn.src = B.backgroundImage;
          } else oe.call(Dn, ue);
        }, J.prototype.makeImage = function() {
          this._bIsPainted && M.call(this, O);
        }, J.prototype.isPainted = function() {
          return this._bIsPainted;
        }, J.prototype.clear = function() {
          this._oContext.clearRect(0, 0, this._elCanvas.width, this._elCanvas.height), this._bIsPainted = !1;
        }, J.prototype.remove = function() {
          this._oContext.clearRect(0, 0, this._elCanvas.width, this._elCanvas.height), this._bIsPainted = !1, this._el.innerHTML = "";
        }, J.prototype.round = function(ue) {
          return ue && Math.floor(1e3 * ue) / 1e3;
        }, J;
      })() : (function() {
        var O = function(M, I) {
          this._el = M, this._htOption = I;
        };
        return O.prototype.draw = function(M) {
          var I = this._htOption, j = this._el, J = M.getModuleCount(), ue = Math.round(I.width / J), ye = Math.round((I.height - I.titleHeight) / J);
          ue <= 1 && (ue = 1), ye <= 1 && (ye = 1), this._htOption.width = ue * J, this._htOption.height = ye * J + I.titleHeight, this._htOption.quietZone = Math.round(this._htOption.quietZone);
          var oe = [], B = "", yt = Math.round(ue * I.dotScale), Qe = Math.round(ye * I.dotScale);
          yt < 4 && (yt = 4, Qe = 4);
          var Kt = I.colorDark, ze = I.colorLight;
          if (I.backgroundImage) {
            I.autoColor ? (I.colorDark = "rgba(0, 0, 0, .6);filter:progid:DXImageTransform.Microsoft.Gradient(GradientType=0, StartColorStr='#99000000', EndColorStr='#99000000');", I.colorLight = "rgba(255, 255, 255, .7);filter:progid:DXImageTransform.Microsoft.Gradient(GradientType=0, StartColorStr='#B2FFFFFF', EndColorStr='#B2FFFFFF');") : I.colorLight = "rgba(0,0,0,0)";
            var Dn = '<div style="display:inline-block; z-index:-10;position:absolute;"><img src="' + I.backgroundImage + '" widht="' + (I.width + 2 * I.quietZone) + '" height="' + (I.height + 2 * I.quietZone) + '" style="opacity:' + I.backgroundImageAlpha + ";filter:alpha(opacity=" + 100 * I.backgroundImageAlpha + '); "/></div>';
            oe.push(Dn);
          }
          if (I.quietZone && (B = "display:inline-block; width:" + (I.width + 2 * I.quietZone) + "px; height:" + (I.width + 2 * I.quietZone) + "px;background:" + I.quietZoneColor + "; text-align:center;"), oe.push('<div style="font-size:0;' + B + '">'), oe.push('<table  style="font-size:0;border:0;border-collapse:collapse; margin-top:' + I.quietZone + 'px;" border="0" cellspacing="0" cellspadding="0" align="center" valign="middle">'), oe.push('<tr height="' + I.titleHeight + '" align="center"><td style="border:0;border-collapse:collapse;margin:0;padding:0" colspan="' + J + '">'), I.title) {
            var Cn = I.titleColor, Mr = I.titleFont;
            oe.push('<div style="width:100%;margin-top:' + I.titleTop + "px;color:" + Cn + ";font:" + Mr + ";background:" + I.titleBackgroundColor + '">' + I.title + "</div>");
          }
          I.subTitle && oe.push('<div style="width:100%;margin-top:' + (I.subTitleTop - I.titleTop) + "px;color:" + I.subTitleColor + "; font:" + I.subTitleFont + '">' + I.subTitle + "</div>"), oe.push("</td></tr>");
          for (var Zn = 0; Zn < J; Zn++) {
            oe.push('<tr style="border:0; padding:0; margin:0;" height="7">');
            for (var fn = 0; fn < J; fn++) {
              var On = M.isDark(Zn, fn), Jr = M.getEye(Zn, fn);
              if (Jr) {
                On = Jr.isDark;
                var Cs = Jr.type, Ci = I[Cs] || I[Cs.substring(0, 2)] || Kt;
                oe.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' + ue + "px;height:" + ye + 'px;"><span style="width:' + ue + "px;height:" + ye + "px;background-color:" + (On ? Ci : ze) + ';display:inline-block"></span></td>');
              } else {
                var mn = I.colorDark;
                Zn == 6 ? (mn = I.timing_H || I.timing || Kt, oe.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' + ue + "px;height:" + ye + "px;background-color:" + (On ? mn : ze) + ';"></td>')) : fn == 6 ? (mn = I.timing_V || I.timing || Kt, oe.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' + ue + "px;height:" + ye + "px;background-color:" + (On ? mn : ze) + ';"></td>')) : oe.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' + ue + "px;height:" + ye + 'px;"><div style="display:inline-block;width:' + yt + "px;height:" + Qe + "px;background-color:" + (On ? mn : I.colorLight) + ';"></div></td>');
              }
            }
            oe.push("</tr>");
          }
          if (oe.push("</table>"), oe.push("</div>"), I.logo) {
            var qt = new Image();
            I.crossOrigin != null && (qt.crossOrigin = I.crossOrigin), qt.src = I.logo;
            var Jt = I.width / 3.5, yn = I.height / 3.5;
            Jt != yn && (Jt = yn), I.logoWidth && (Jt = I.logoWidth), I.logoHeight && (yn = I.logoHeight);
            var Rr = "position:relative; z-index:1;display:table-cell;top:-" + ((I.height - I.titleHeight) / 2 + yn / 2 + I.quietZone) + "px;text-align:center; width:" + Jt + "px; height:" + yn + "px;line-height:" + Jt + "px; vertical-align: middle;";
            I.logoBackgroundTransparent || (Rr += "background:" + I.logoBackgroundColor), oe.push('<div style="' + Rr + '"><img  src="' + I.logo + '"  style="max-width: ' + Jt + "px; max-height: " + yn + 'px;" /> <div style=" display: none; width:1px;margin-left: -1px;"></div></div>');
          }
          I.onRenderingStart && I.onRenderingStart(I), j.innerHTML = oe.join("");
          var Gs = j.childNodes[0], dr = (I.width - Gs.offsetWidth) / 2, pn = (I.height - Gs.offsetHeight) / 2;
          dr > 0 && pn > 0 && (Gs.style.margin = pn + "px " + dr + "px"), this._htOption.onRenderingEnd && this._htOption.onRenderingEnd(this._htOption, null);
        }, O.prototype.clear = function() {
          this._el.innerHTML = "";
        }, O;
      })();
      Q = function(O, M) {
        if (this._htOption = {
          width: 256,
          height: 256,
          typeNumber: 4,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: fe.H,
          dotScale: 1,
          dotScaleTiming: 1,
          dotScaleTiming_H: z,
          dotScaleTiming_V: z,
          dotScaleA: 1,
          dotScaleAO: z,
          dotScaleAI: z,
          quietZone: 0,
          quietZoneColor: "rgba(0,0,0,0)",
          title: "",
          titleFont: "normal normal bold 16px Arial",
          titleColor: "#000000",
          titleBackgroundColor: "#ffffff",
          titleHeight: 0,
          titleTop: 30,
          subTitle: "",
          subTitleFont: "normal normal normal 14px Arial",
          subTitleColor: "#4F4F4F",
          subTitleTop: 60,
          logo: z,
          logoWidth: z,
          logoHeight: z,
          logoMaxWidth: z,
          logoMaxHeight: z,
          logoBackgroundColor: "#ffffff",
          logoBackgroundTransparent: !1,
          PO: z,
          PI: z,
          PO_TL: z,
          PI_TL: z,
          PO_TR: z,
          PI_TR: z,
          PO_BL: z,
          PI_BL: z,
          AO: z,
          AI: z,
          timing: z,
          timing_H: z,
          timing_V: z,
          backgroundImage: z,
          backgroundImageAlpha: 1,
          autoColor: !1,
          autoColorDark: "rgba(0, 0, 0, .6)",
          autoColorLight: "rgba(255, 255, 255, .7)",
          onRenderingStart: z,
          onRenderingEnd: z,
          version: 0,
          tooltip: !1,
          binary: !1,
          drawer: "canvas",
          crossOrigin: null,
          utf8WithoutBOM: !0
        }, typeof M == "string" && (M = {
          text: M
        }), M) for (var I in M) this._htOption[I] = M[I];
        this._htOption.title || this._htOption.subTitle || (this._htOption.titleHeight = 0), (this._htOption.version < 0 || this._htOption.version > 40) && (console.warn("QR Code version '" + this._htOption.version + "' is invalidate, reset to 0"), this._htOption.version = 0), (this._htOption.dotScale < 0 || this._htOption.dotScale > 1) && (console.warn(this._htOption.dotScale + " , is invalidate, dotScale must greater than 0, less than or equal to 1, now reset to 1. "), this._htOption.dotScale = 1), (this._htOption.dotScaleTiming < 0 || this._htOption.dotScaleTiming > 1) && (console.warn(this._htOption.dotScaleTiming + " , is invalidate, dotScaleTiming must greater than 0, less than or equal to 1, now reset to 1. "), this._htOption.dotScaleTiming = 1), this._htOption.dotScaleTiming_H ? (this._htOption.dotScaleTiming_H < 0 || this._htOption.dotScaleTiming_H > 1) && (console.warn(this._htOption.dotScaleTiming_H + " , is invalidate, dotScaleTiming_H must greater than 0, less than or equal to 1, now reset to 1. "), this._htOption.dotScaleTiming_H = 1) : this._htOption.dotScaleTiming_H = this._htOption.dotScaleTiming, this._htOption.dotScaleTiming_V ? (this._htOption.dotScaleTiming_V < 0 || this._htOption.dotScaleTiming_V > 1) && (console.warn(this._htOption.dotScaleTiming_V + " , is invalidate, dotScaleTiming_V must greater than 0, less than or equal to 1, now reset to 1. "), this._htOption.dotScaleTiming_V = 1) : this._htOption.dotScaleTiming_V = this._htOption.dotScaleTiming, (this._htOption.dotScaleA < 0 || this._htOption.dotScaleA > 1) && (console.warn(this._htOption.dotScaleA + " , is invalidate, dotScaleA must greater than 0, less than or equal to 1, now reset to 1. "), this._htOption.dotScaleA = 1), this._htOption.dotScaleAO ? (this._htOption.dotScaleAO < 0 || this._htOption.dotScaleAO > 1) && (console.warn(this._htOption.dotScaleAO + " , is invalidate, dotScaleAO must greater than 0, less than or equal to 1, now reset to 1. "), this._htOption.dotScaleAO = 1) : this._htOption.dotScaleAO = this._htOption.dotScaleA, this._htOption.dotScaleAI ? (this._htOption.dotScaleAI < 0 || this._htOption.dotScaleAI > 1) && (console.warn(this._htOption.dotScaleAI + " , is invalidate, dotScaleAI must greater than 0, less than or equal to 1, now reset to 1. "), this._htOption.dotScaleAI = 1) : this._htOption.dotScaleAI = this._htOption.dotScaleA, (this._htOption.backgroundImageAlpha < 0 || this._htOption.backgroundImageAlpha > 1) && (console.warn(this._htOption.backgroundImageAlpha + " , is invalidate, backgroundImageAlpha must between 0 and 1, now reset to 1. "), this._htOption.backgroundImageAlpha = 1), this._htOption.height = this._htOption.height + this._htOption.titleHeight, typeof O == "string" && (O = document.getElementById(O)), (!this._htOption.drawer || this._htOption.drawer != "svg" && this._htOption.drawer != "canvas") && (this._htOption.drawer = "canvas"), this._android = y(), this._el = O, this._oQRCode = null, this._htOption._element = O;
        var j = {};
        for (var I in this._htOption) j[I] = this._htOption[I];
        this._oDrawing = new vt(this._el, j), this._htOption.text && this.makeCode(this._htOption.text);
      }, Q.prototype.makeCode = function(O) {
        this._oQRCode = new u(U(O, this._htOption), this._htOption.correctLevel), this._oQRCode.addData(O, this._htOption.binary, this._htOption.utf8WithoutBOM), this._oQRCode.make(), this._htOption.tooltip && (this._el.title = O), this._oDrawing.draw(this._oQRCode);
      }, Q.prototype.makeImage = function() {
        typeof this._oDrawing.makeImage == "function" && (!this._android || this._android >= 3) && this._oDrawing.makeImage();
      }, Q.prototype.clear = function() {
        this._oDrawing.remove();
      }, Q.prototype.resize = function(O, M) {
        this._oDrawing._htOption.width = O, this._oDrawing._htOption.height = M, this._oDrawing.draw(this._oQRCode);
      }, Q.prototype.noConflict = function() {
        return R.QRCode === this && (R.QRCode = ie), Q;
      }, Q.CorrectLevel = fe, ne ? ((ne.exports = Q).QRCode = Q, W.QRCode = Q) : R.QRCode = Q;
    }).call(this);
  });
  var a = i("58QMB");
  var c = {};
  const d = BigInt(0), h = BigInt(1), g = BigInt(2), b = BigInt(3), m = BigInt(8), v = Object.freeze({
    a: d,
    b: BigInt(7),
    P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
    n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
    h,
    Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
    Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
    beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
  }), D = (o, s) => (o + s / g) / s, C = {
    beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
    splitScalar(o) {
      const { n: s } = v, l = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), u = -h * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), f = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), p = l, _ = BigInt("0x100000000000000000000000000000000"), y = D(p * o, s), U = D(-u * o, s);
      let X = ae(o - y * l - U * f, s), z = ae(-y * u - U * p, s);
      const Q = X > _, w = z > _;
      if (Q && (X = s - X), w && (z = s - z), X > _ || z > _) throw new Error("splitScalarEndo: Endomorphism failed, k=" + o);
      return {
        k1neg: Q,
        k1: X,
        k2neg: w,
        k2: z
      };
    }
  }, E = 32, N = 32, V = 32, H = E + 1, re = 2 * E + 1;
  function de(o) {
    const { a: s, b: l } = v, u = ae(o * o), f = ae(u * o);
    return ae(f + s * o + l);
  }
  const ee = v.a === d;
  class te extends Error {
    constructor(s) {
      super(s);
    }
  }
  function q(o) {
    if (!(o instanceof K)) throw new TypeError("JacobianPoint expected");
  }
  class K {
    constructor(s, l, u) {
      this.x = s, this.y = l, this.z = u;
    }
    static fromAffine(s) {
      if (!(s instanceof A)) throw new TypeError("JacobianPoint#fromAffine: expected Point");
      return s.equals(A.ZERO) ? K.ZERO : new K(s.x, s.y, h);
    }
    static toAffineBatch(s) {
      const l = _n(s.map((u) => u.z));
      return s.map((u, f) => u.toAffine(l[f]));
    }
    static normalizeZ(s) {
      return K.toAffineBatch(s).map(K.fromAffine);
    }
    equals(s) {
      q(s);
      const { x: l, y: u, z: f } = this, { x: p, y: _, z: y } = s, U = ae(f * f), X = ae(y * y), z = ae(l * X), Q = ae(p * U), w = ae(ae(u * y) * X), k = ae(ae(_ * f) * U);
      return z === Q && w === k;
    }
    negate() {
      return new K(this.x, ae(-this.y), this.z);
    }
    double() {
      const { x: s, y: l, z: u } = this, f = ae(s * s), p = ae(l * l), _ = ae(p * p), y = s + p, U = ae(g * (ae(y * y) - f - _)), X = ae(b * f), z = ae(X * X), Q = ae(z - g * U), w = ae(X * (U - Q) - m * _), k = ae(g * l * u);
      return new K(Q, w, k);
    }
    add(s) {
      q(s);
      const { x: l, y: u, z: f } = this, { x: p, y: _, z: y } = s;
      if (p === d || _ === d) return this;
      if (l === d || u === d) return s;
      const U = ae(f * f), X = ae(y * y), z = ae(l * X), Q = ae(p * U), w = ae(ae(u * y) * X), k = ae(ae(_ * f) * U), R = ae(Q - z), W = ae(k - w);
      if (R === d)
        return W === d ? this.double() : K.ZERO;
      const ne = ae(R * R), ie = ae(R * ne), be = ae(z * ne), fe = ae(W * W - ie - g * be), Ae = ae(W * (be - fe) - w * ie), xe = ae(f * y * R);
      return new K(fe, Ae, xe);
    }
    subtract(s) {
      return this.add(s.negate());
    }
    multiplyUnsafe(s) {
      const l = K.ZERO;
      if (typeof s == "bigint" && s === d) return l;
      let u = pt(s);
      if (u === h) return this;
      if (!ee) {
        let Q = l, w = this;
        for (; u > d; )
          u & h && (Q = Q.add(w)), w = w.double(), u >>= h;
        return Q;
      }
      let { k1neg: f, k1: p, k2neg: _, k2: y } = C.splitScalar(u), U = l, X = l, z = this;
      for (; p > d || y > d; )
        p & h && (U = U.add(z)), y & h && (X = X.add(z)), z = z.double(), p >>= h, y >>= h;
      return f && (U = U.negate()), _ && (X = X.negate()), X = new K(ae(X.x * C.beta), X.y, X.z), U.add(X);
    }
    precomputeWindow(s) {
      const l = ee ? 128 / s + 1 : 256 / s + 1, u = [];
      let f = this, p = f;
      for (let _ = 0; _ < l; _++) {
        p = f, u.push(p);
        for (let y = 1; y < 2 ** (s - 1); y++)
          p = p.add(f), u.push(p);
        f = p.double();
      }
      return u;
    }
    wNAF(s, l) {
      !l && this.equals(K.BASE) && (l = A.BASE);
      const u = l && l._WINDOW_SIZE || 1;
      if (256 % u) throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
      let f = l && $.get(l);
      f || (f = this.precomputeWindow(u), l && u !== 1 && (f = K.normalizeZ(f), $.set(l, f)));
      let p = K.ZERO, _ = K.BASE;
      const y = 1 + (ee ? 128 / u : 256 / u), U = 2 ** (u - 1), X = BigInt(2 ** u - 1), z = 2 ** u, Q = BigInt(u);
      for (let w = 0; w < y; w++) {
        const k = w * U;
        let R = Number(s & X);
        s >>= Q, R > U && (R -= z, s += h);
        const W = k, ne = k + Math.abs(R) - 1, ie = w % 2 !== 0, be = R < 0;
        R === 0 ? _ = _.add(S(ie, f[W])) : p = p.add(S(be, f[ne]));
      }
      return {
        p,
        f: _
      };
    }
    multiply(s, l) {
      let u = pt(s), f, p;
      if (ee) {
        const { k1neg: _, k1: y, k2neg: U, k2: X } = C.splitScalar(u);
        let { p: z, f: Q } = this.wNAF(y, l), { p: w, f: k } = this.wNAF(X, l);
        z = S(_, z), w = S(U, w), w = new K(ae(w.x * C.beta), w.y, w.z), f = z.add(w), p = Q.add(k);
      } else {
        const { p: _, f: y } = this.wNAF(u, l);
        f = _, p = y;
      }
      return K.normalizeZ([
        f,
        p
      ])[0];
    }
    toAffine(s) {
      const { x: l, y: u, z: f } = this, p = this.equals(K.ZERO);
      s == null && (s = p ? m : Pt(f));
      const _ = s, y = ae(_ * _), U = ae(y * _), X = ae(l * y), z = ae(u * U), Q = ae(f * _);
      if (p) return A.ZERO;
      if (Q !== h) throw new Error("invZ was invalid");
      return new A(X, z);
    }
  }
  K.BASE = new K(v.Gx, v.Gy, h), K.ZERO = new K(d, h, d);
  function S(o, s) {
    const l = s.negate();
    return o ? l : s;
  }
  const $ = /* @__PURE__ */ new WeakMap();
  class A {
    constructor(s, l) {
      this.x = s, this.y = l;
    }
    _setWindowSize(s) {
      this._WINDOW_SIZE = s, $.delete(this);
    }
    hasEvenY() {
      return this.y % g === d;
    }
    static fromCompressedHex(s) {
      const l = s.length === 32, u = ke(l ? s : s.subarray(1));
      if (!Ke(u)) throw new Error("Point is not on curve");
      const f = de(u);
      let p = Yt(f);
      const _ = (p & h) === h;
      l ? _ && (p = ae(-p)) : (s[0] & 1) === 1 !== _ && (p = ae(-p));
      const y = new A(u, p);
      return y.assertValidity(), y;
    }
    static fromUncompressedHex(s) {
      const l = ke(s.subarray(1, E + 1)), u = ke(s.subarray(E + 1, E * 2 + 1)), f = new A(l, u);
      return f.assertValidity(), f;
    }
    static fromHex(s) {
      const l = Ge(s), u = l.length, f = l[0];
      if (u === E) return this.fromCompressedHex(l);
      if (u === H && (f === 2 || f === 3)) return this.fromCompressedHex(l);
      if (u === re && f === 4) return this.fromUncompressedHex(l);
      throw new Error(`Point.fromHex: received invalid point. Expected 32-${H} compressed bytes or ${re} uncompressed bytes, not ${u}`);
    }
    static fromPrivateKey(s) {
      return A.BASE.multiply(lt(s));
    }
    static fromSignature(s, l, u) {
      const { r: f, s: p } = dt(l);
      if (![
        0,
        1,
        2,
        3
      ].includes(u)) throw new Error("Cannot recover: invalid recovery bit");
      const _ = Pn(Ge(s)), { n: y } = v, U = u === 2 || u === 3 ? f + y : f, X = Pt(U, y), z = ae(-_ * X, y), Q = ae(p * X, y), w = u & 1 ? "03" : "02", k = A.fromHex(w + Ee(U)), R = A.BASE.multiplyAndAddUnsafe(k, z, Q);
      if (!R) throw new Error("Cannot recover signature: point at infinify");
      return R.assertValidity(), R;
    }
    toRawBytes(s = !1) {
      return Xe(this.toHex(s));
    }
    toHex(s = !1) {
      const l = Ee(this.x);
      return s ? `${this.hasEvenY() ? "02" : "03"}${l}` : `04${l}${Ee(this.y)}`;
    }
    toHexX() {
      return this.toHex(!0).slice(2);
    }
    toRawX() {
      return this.toRawBytes(!0).slice(1);
    }
    assertValidity() {
      const s = "Point is not on elliptic curve", { x: l, y: u } = this;
      if (!Ke(l) || !Ke(u)) throw new Error(s);
      const f = ae(u * u), p = de(l);
      if (ae(f - p) !== d) throw new Error(s);
    }
    equals(s) {
      return this.x === s.x && this.y === s.y;
    }
    negate() {
      return new A(this.x, ae(-this.y));
    }
    double() {
      return K.fromAffine(this).double().toAffine();
    }
    add(s) {
      return K.fromAffine(this).add(K.fromAffine(s)).toAffine();
    }
    subtract(s) {
      return this.add(s.negate());
    }
    multiply(s) {
      return K.fromAffine(this).multiply(s, this).toAffine();
    }
    multiplyAndAddUnsafe(s, l, u) {
      const f = K.fromAffine(this), p = l === d || l === h || this !== A.BASE ? f.multiplyUnsafe(l) : f.multiply(l), _ = K.fromAffine(s).multiplyUnsafe(u), y = p.add(_);
      return y.equals(K.ZERO) ? void 0 : y.toAffine();
    }
  }
  A.BASE = new A(v.Gx, v.Gy), A.ZERO = new A(d, d);
  function P(o) {
    return Number.parseInt(o[0], 16) >= 8 ? "00" + o : o;
  }
  function F(o) {
    if (o.length < 2 || o[0] !== 2) throw new Error(`Invalid signature integer tag: ${ve(o)}`);
    const s = o[1], l = o.subarray(2, s + 2);
    if (!s || l.length !== s) throw new Error("Invalid signature integer: wrong length");
    if (l[0] === 0 && l[1] <= 127) throw new Error("Invalid signature integer: trailing length");
    return {
      data: ke(l),
      left: o.subarray(s + 2)
    };
  }
  function Z(o) {
    if (o.length < 2 || o[0] != 48) throw new Error(`Invalid signature tag: ${ve(o)}`);
    if (o[1] !== o.length - 2) throw new Error("Invalid signature: incorrect length");
    const { data: s, left: l } = F(o.subarray(2)), { data: u, left: f } = F(l);
    if (f.length) throw new Error(`Invalid signature: left bytes after parsing: ${ve(f)}`);
    return {
      r: s,
      s: u
    };
  }
  class Y {
    constructor(s, l) {
      this.r = s, this.s = l, this.assertValidity();
    }
    static fromCompact(s) {
      const l = s instanceof Uint8Array, u = "Signature.fromCompact";
      if (typeof s != "string" && !l) throw new TypeError(`${u}: Expected string or Uint8Array`);
      const f = l ? ve(s) : s;
      if (f.length !== 128) throw new Error(`${u}: Expected 64-byte hex`);
      return new Y(je(f.slice(0, 64)), je(f.slice(64, 128)));
    }
    static fromDER(s) {
      const l = s instanceof Uint8Array;
      if (typeof s != "string" && !l) throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
      const { r: u, s: f } = Z(l ? s : Xe(s));
      return new Y(u, f);
    }
    static fromHex(s) {
      return this.fromDER(s);
    }
    assertValidity() {
      const { r: s, s: l } = this;
      if (!_e(s)) throw new Error("Invalid Signature: r must be 0 < r < n");
      if (!_e(l)) throw new Error("Invalid Signature: s must be 0 < s < n");
    }
    hasHighS() {
      const s = v.n >> h;
      return this.s > s;
    }
    normalizeS() {
      return this.hasHighS() ? new Y(this.r, ae(-this.s, v.n)) : this;
    }
    toDERRawBytes() {
      return Xe(this.toDERHex());
    }
    toDERHex() {
      const s = P(Ce(this.s)), l = P(Ce(this.r)), u = s.length / 2, f = l.length / 2, p = Ce(u), _ = Ce(f);
      return `30${Ce(f + u + 4)}02${_}${l}02${p}${s}`;
    }
    toRawBytes() {
      return this.toDERRawBytes();
    }
    toHex() {
      return this.toDERHex();
    }
    toCompactRawBytes() {
      return Xe(this.toCompactHex());
    }
    toCompactHex() {
      return Ee(this.r) + Ee(this.s);
    }
  }
  function se(...o) {
    if (!o.every((u) => u instanceof Uint8Array)) throw new Error("Uint8Array list expected");
    if (o.length === 1) return o[0];
    const s = o.reduce((u, f) => u + f.length, 0), l = new Uint8Array(s);
    for (let u = 0, f = 0; u < o.length; u++) {
      const p = o[u];
      l.set(p, f), f += p.length;
    }
    return l;
  }
  const pe = Array.from({
    length: 256
  }, (o, s) => s.toString(16).padStart(2, "0"));
  function ve(o) {
    if (!(o instanceof Uint8Array)) throw new Error("Expected Uint8Array");
    let s = "";
    for (let l = 0; l < o.length; l++) s += pe[o[l]];
    return s;
  }
  const ce = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
  function Ee(o) {
    if (typeof o != "bigint") throw new Error("Expected bigint");
    if (!(d <= o && o < ce)) throw new Error("Expected number 0 <= n < 2^256");
    return o.toString(16).padStart(64, "0");
  }
  function me(o) {
    const s = Xe(Ee(o));
    if (s.length !== 32) throw new Error("Error: expected 32 bytes");
    return s;
  }
  function Ce(o) {
    const s = o.toString(16);
    return s.length & 1 ? `0${s}` : s;
  }
  function je(o) {
    if (typeof o != "string") throw new TypeError("hexToNumber: expected string, got " + typeof o);
    return BigInt(`0x${o}`);
  }
  function Xe(o) {
    if (typeof o != "string") throw new TypeError("hexToBytes: expected string, got " + typeof o);
    if (o.length % 2) throw new Error("hexToBytes: received invalid unpadded hex" + o.length);
    const s = new Uint8Array(o.length / 2);
    for (let l = 0; l < s.length; l++) {
      const u = l * 2, f = o.slice(u, u + 2), p = Number.parseInt(f, 16);
      if (Number.isNaN(p) || p < 0) throw new Error("Invalid byte sequence");
      s[l] = p;
    }
    return s;
  }
  function ke(o) {
    return je(ve(o));
  }
  function Ge(o) {
    return o instanceof Uint8Array ? Uint8Array.from(o) : Xe(o);
  }
  function pt(o) {
    if (typeof o == "number" && Number.isSafeInteger(o) && o > 0) return BigInt(o);
    if (typeof o == "bigint" && _e(o)) return o;
    throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
  }
  function ae(o, s = v.P) {
    const l = o % s;
    return l >= d ? l : s + l;
  }
  function Je(o, s) {
    const { P: l } = v;
    let u = o;
    for (; s-- > d; )
      u *= u, u %= l;
    return u;
  }
  function Yt(o) {
    const { P: s } = v, l = BigInt(6), u = BigInt(11), f = BigInt(22), p = BigInt(23), _ = BigInt(44), y = BigInt(88), U = o * o * o % s, X = U * U * o % s, z = Je(X, b) * X % s, Q = Je(z, b) * X % s, w = Je(Q, g) * U % s, k = Je(w, u) * w % s, R = Je(k, f) * k % s, W = Je(R, _) * R % s, ne = Je(W, y) * W % s, ie = Je(ne, _) * R % s, be = Je(ie, b) * X % s, fe = Je(be, p) * k % s, Ae = Je(fe, l) * U % s, xe = Je(Ae, g);
    if (xe * xe % s !== o) throw new Error("Cannot find square root");
    return xe;
  }
  function Pt(o, s = v.P) {
    if (o === d || s <= d) throw new Error(`invert: expected positive integers, got n=${o} mod=${s}`);
    let l = ae(o, s), u = s, f = d, p = h;
    for (; l !== d; ) {
      const y = u / l, U = u % l, X = f - p * y;
      u = l, l = U, f = p, p = X;
    }
    if (u !== h) throw new Error("invert: does not exist");
    return ae(f, s);
  }
  function _n(o, s = v.P) {
    const l = new Array(o.length), u = o.reduce((p, _, y) => _ === d ? p : (l[y] = p, ae(p * _, s)), h), f = Pt(u, s);
    return o.reduceRight((p, _, y) => _ === d ? p : (l[y] = ae(p * l[y], s), ae(p * _, s)), f), l;
  }
  function En(o) {
    const s = o.length * 8 - N * 8, l = ke(o);
    return s > 0 ? l >> BigInt(s) : l;
  }
  function Pn(o, s = !1) {
    const l = En(o);
    if (s) return l;
    const { n: u } = v;
    return l >= u ? l - u : l;
  }
  let Ve, it;
  class bt {
    constructor(s, l) {
      if (this.hashLen = s, this.qByteLen = l, typeof s != "number" || s < 2) throw new Error("hashLen must be a number");
      if (typeof l != "number" || l < 2) throw new Error("qByteLen must be a number");
      this.v = new Uint8Array(s).fill(1), this.k = new Uint8Array(s).fill(0), this.counter = 0;
    }
    hmac(...s) {
      return Fe.hmacSha256(this.k, ...s);
    }
    hmacSync(...s) {
      return it(this.k, ...s);
    }
    checkSync() {
      if (typeof it != "function") throw new te("hmacSha256Sync needs to be set");
    }
    incr() {
      if (this.counter >= 1e3) throw new Error("Tried 1,000 k values for sign(), all were invalid");
      this.counter += 1;
    }
    async reseed(s = new Uint8Array()) {
      this.k = await this.hmac(this.v, Uint8Array.from([
        0
      ]), s), this.v = await this.hmac(this.v), s.length !== 0 && (this.k = await this.hmac(this.v, Uint8Array.from([
        1
      ]), s), this.v = await this.hmac(this.v));
    }
    reseedSync(s = new Uint8Array()) {
      this.checkSync(), this.k = this.hmacSync(this.v, Uint8Array.from([
        0
      ]), s), this.v = this.hmacSync(this.v), s.length !== 0 && (this.k = this.hmacSync(this.v, Uint8Array.from([
        1
      ]), s), this.v = this.hmacSync(this.v));
    }
    async generate() {
      this.incr();
      let s = 0;
      const l = [];
      for (; s < this.qByteLen; ) {
        this.v = await this.hmac(this.v);
        const u = this.v.slice();
        l.push(u), s += this.v.length;
      }
      return se(...l);
    }
    generateSync() {
      this.checkSync(), this.incr();
      let s = 0;
      const l = [];
      for (; s < this.qByteLen; ) {
        this.v = this.hmacSync(this.v);
        const u = this.v.slice();
        l.push(u), s += this.v.length;
      }
      return se(...l);
    }
  }
  function _e(o) {
    return d < o && o < v.n;
  }
  function Ke(o) {
    return d < o && o < v.P;
  }
  function at(o, s, l, u = !0) {
    const { n: f } = v, p = Pn(o, !0);
    if (!_e(p)) return;
    const _ = Pt(p, f), y = A.BASE.multiply(p), U = ae(y.x, f);
    if (U === d) return;
    const X = ae(_ * ae(s + l * U, f), f);
    if (X === d) return;
    let z = new Y(U, X), Q = (y.x === z.r ? 0 : 2) | Number(y.y & h);
    return u && z.hasHighS() && (z = z.normalizeS(), Q ^= 1), {
      sig: z,
      recovery: Q
    };
  }
  function lt(o) {
    let s;
    if (typeof o == "bigint") s = o;
    else if (typeof o == "number" && Number.isSafeInteger(o) && o > 0) s = BigInt(o);
    else if (typeof o == "string") {
      if (o.length !== 2 * N) throw new Error("Expected 32 bytes of private key");
      s = je(o);
    } else if (o instanceof Uint8Array) {
      if (o.length !== N) throw new Error("Expected 32 bytes of private key");
      s = ke(o);
    } else throw new TypeError("Expected valid private key");
    if (!_e(s)) throw new Error("Expected private key: 0 < key < n");
    return s;
  }
  function gt(o) {
    return o instanceof A ? (o.assertValidity(), o) : A.fromHex(o);
  }
  function dt(o) {
    if (o instanceof Y)
      return o.assertValidity(), o;
    try {
      return Y.fromDER(o);
    } catch {
      return Y.fromCompact(o);
    }
  }
  function Ye(o, s = !1) {
    return A.fromPrivateKey(o).toRawBytes(s);
  }
  function Oe(o) {
    const s = o instanceof Uint8Array, l = typeof o == "string", u = (s || l) && o.length;
    return s ? u === H || u === re : l ? u === H * 2 || u === re * 2 : o instanceof A;
  }
  function $t(o, s, l = !1) {
    if (Oe(o)) throw new TypeError("getSharedSecret: first arg must be private key");
    if (!Oe(s)) throw new TypeError("getSharedSecret: second arg must be public key");
    const u = gt(s);
    return u.assertValidity(), u.multiply(lt(o)).toRawBytes(l);
  }
  function Mt(o) {
    const s = o.length > E ? o.slice(0, E) : o;
    return ke(s);
  }
  function Zt(o) {
    const s = Mt(o), l = ae(s, v.n);
    return Vt(l < d ? s : l);
  }
  function Vt(o) {
    return me(o);
  }
  function $n(o, s, l) {
    if (o == null) throw new Error(`sign: expected valid message hash, not "${o}"`);
    const u = Ge(o), f = lt(s), p = [
      Vt(f),
      Zt(u)
    ];
    if (l != null) {
      l === !0 && (l = Fe.randomBytes(E));
      const U = Ge(l);
      if (U.length !== E) throw new Error(`sign: Expected ${E} bytes of extra data`);
      p.push(U);
    }
    const _ = se(...p), y = Mt(u);
    return {
      seed: _,
      m: y,
      d: f
    };
  }
  function Wt(o, s) {
    const { sig: l, recovery: u } = o, { der: f, recovered: p } = Object.assign({
      canonical: !0,
      der: !0
    }, s), _ = f ? l.toDERRawBytes() : l.toCompactRawBytes();
    return p ? [
      _,
      u
    ] : _;
  }
  function In(o, s, l = {}) {
    const { seed: u, m: f, d: p } = $n(o, s, l.extraEntropy), _ = new bt(V, N);
    _.reseedSync(u);
    let y;
    for (; !(y = at(_.generateSync(), f, p, l.canonical)); ) _.reseedSync();
    return Wt(y, l);
  }
  const Nt = {
    strict: !0
  };
  function Tt(o, s, l, u = Nt) {
    let f;
    try {
      f = dt(o), s = Ge(s);
    } catch {
      return !1;
    }
    const { r: p, s: _ } = f;
    if (u.strict && f.hasHighS()) return !1;
    const y = Pn(s);
    let U;
    try {
      U = gt(l);
    } catch {
      return !1;
    }
    const { n: X } = v, z = Pt(_, X), Q = ae(y * z, X), w = ae(p * z, X), k = A.BASE.multiplyAndAddUnsafe(U, Q, w);
    return k ? ae(k.x, X) === p : !1;
  }
  function Rt(o) {
    return ae(ke(o), v.n);
  }
  class _t {
    constructor(s, l) {
      this.r = s, this.s = l, this.assertValidity();
    }
    static fromHex(s) {
      const l = Ge(s);
      if (l.length !== 64) throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${l.length}`);
      const u = ke(l.subarray(0, 32)), f = ke(l.subarray(32, 64));
      return new _t(u, f);
    }
    assertValidity() {
      const { r: s, s: l } = this;
      if (!Ke(s) || !_e(l)) throw new Error("Invalid signature");
    }
    toHex() {
      return Ee(this.r) + Ee(this.s);
    }
    toRawBytes() {
      return Xe(this.toHex());
    }
  }
  function Lt(o) {
    return A.fromPrivateKey(o).toRawX();
  }
  class zn {
    constructor(s, l, u = Fe.randomBytes()) {
      if (s == null) throw new TypeError(`sign: Expected valid message, not "${s}"`);
      this.m = Ge(s);
      const { x: f, scalar: p } = this.getScalar(lt(l));
      if (this.px = f, this.d = p, this.rand = Ge(u), this.rand.length !== 32) throw new TypeError("sign: Expected 32 bytes of aux randomness");
    }
    getScalar(s) {
      const l = A.fromPrivateKey(s), u = l.hasEvenY() ? s : v.n - s;
      return {
        point: l,
        scalar: u,
        x: l.toRawX()
      };
    }
    initNonce(s, l) {
      return me(s ^ ke(l));
    }
    finalizeNonce(s) {
      const l = ae(ke(s), v.n);
      if (l === d) throw new Error("sign: Creation of signature failed. k is zero");
      const { point: u, x: f, scalar: p } = this.getScalar(l);
      return {
        R: u,
        rx: f,
        k: p
      };
    }
    finalizeSig(s, l, u, f) {
      return new _t(s.x, ae(l + u * f, v.n)).toRawBytes();
    }
    error() {
      throw new Error("sign: Invalid signature produced");
    }
    async calc() {
      const { m: s, d: l, px: u, rand: f } = this, p = Fe.taggedHash, _ = this.initNonce(l, await p(kn.aux, f)), { R: y, rx: U, k: X } = this.finalizeNonce(await p(kn.nonce, _, u, s)), z = Rt(await p(kn.challenge, U, u, s)), Q = this.finalizeSig(y, X, z, l);
      return await Wn(Q, s, u) || this.error(), Q;
    }
    calcSync() {
      const { m: s, d: l, px: u, rand: f } = this, p = Fe.taggedHashSync, _ = this.initNonce(l, p(kn.aux, f)), { R: y, rx: U, k: X } = this.finalizeNonce(p(kn.nonce, _, u, s)), z = Rt(p(kn.challenge, U, u, s)), Q = this.finalizeSig(y, X, z, l);
      return Hn(Q, s, u) || this.error(), Q;
    }
  }
  async function bn(o, s, l) {
    return new zn(o, s, l).calc();
  }
  function Tn(o, s, l) {
    return new zn(o, s, l).calcSync();
  }
  function sr(o, s, l) {
    const u = o instanceof _t, f = u ? o : _t.fromHex(o);
    return u && f.assertValidity(), {
      ...f,
      m: Ge(s),
      P: gt(l)
    };
  }
  function ir(o, s, l, u) {
    const f = A.BASE.multiplyAndAddUnsafe(s, lt(l), ae(-u, v.n));
    return !(!f || !f.hasEvenY() || f.x !== o);
  }
  async function Wn(o, s, l) {
    try {
      const { r: u, s: f, m: p, P: _ } = sr(o, s, l), y = Rt(await Fe.taggedHash(kn.challenge, me(u), _.toRawX(), p));
      return ir(u, _, f, y);
    } catch {
      return !1;
    }
  }
  function Hn(o, s, l) {
    try {
      const { r: u, s: f, m: p, P: _ } = sr(o, s, l), y = Rt(Fe.taggedHashSync(kn.challenge, me(u), _.toRawX(), p));
      return ir(u, _, f, y);
    } catch (u) {
      if (u instanceof te) throw u;
      return !1;
    }
  }
  const dn = {
    Signature: _t,
    getPublicKey: Lt,
    sign: bn,
    verify: Wn,
    signSync: Tn,
    verifySync: Hn
  };
  A.BASE._setWindowSize(8);
  const Bt = {
    node: c,
    web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
  }, kn = {
    challenge: "BIP0340/challenge",
    aux: "BIP0340/aux",
    nonce: "BIP0340/nonce"
  }, An = {}, Fe = {
    bytesToHex: ve,
    hexToBytes: Xe,
    concatBytes: se,
    mod: ae,
    invert: Pt,
    isValidPrivateKey(o) {
      try {
        return lt(o), !0;
      } catch {
        return !1;
      }
    },
    _bigintTo32Bytes: me,
    _normalizePrivateKey: lt,
    hashToPrivateKey: (o) => {
      o = Ge(o);
      const s = N + 8;
      if (o.length < s || o.length > 1024) throw new Error("Expected valid bytes of private key as per FIPS 186");
      const l = ae(ke(o), v.n - h) + h;
      return me(l);
    },
    randomBytes: (o = 32) => {
      if (Bt.web) return Bt.web.getRandomValues(new Uint8Array(o));
      if (Bt.node) {
        const { randomBytes: s } = Bt.node;
        return Uint8Array.from(s(o));
      } else throw new Error("The environment doesn't have randomBytes function");
    },
    randomPrivateKey: () => Fe.hashToPrivateKey(Fe.randomBytes(N + 8)),
    precompute(o = 8, s = A.BASE) {
      const l = s === A.BASE ? s : new A(s.x, s.y);
      return l._setWindowSize(o), l.multiply(b), l;
    },
    sha256: async (...o) => {
      if (Bt.web) {
        const s = await Bt.web.subtle.digest("SHA-256", se(...o));
        return new Uint8Array(s);
      } else if (Bt.node) {
        const { createHash: s } = Bt.node, l = s("sha256");
        return o.forEach((u) => l.update(u)), Uint8Array.from(l.digest());
      } else throw new Error("The environment doesn't have sha256 function");
    },
    hmacSha256: async (o, ...s) => {
      if (Bt.web) {
        const l = await Bt.web.subtle.importKey("raw", o, {
          name: "HMAC",
          hash: {
            name: "SHA-256"
          }
        }, !1, [
          "sign"
        ]), u = se(...s), f = await Bt.web.subtle.sign("HMAC", l, u);
        return new Uint8Array(f);
      } else if (Bt.node) {
        const { createHmac: l } = Bt.node, u = l("sha256", o);
        return s.forEach((f) => u.update(f)), Uint8Array.from(u.digest());
      } else throw new Error("The environment doesn't have hmac-sha256 function");
    },
    sha256Sync: void 0,
    hmacSha256Sync: void 0,
    taggedHash: async (o, ...s) => {
      let l = An[o];
      if (l === void 0) {
        const u = await Fe.sha256(Uint8Array.from(o, (f) => f.charCodeAt(0)));
        l = se(u, u), An[o] = l;
      }
      return Fe.sha256(l, ...s);
    },
    taggedHashSync: (o, ...s) => {
      if (typeof Ve != "function") throw new te("sha256Sync is undefined, you need to set it");
      let l = An[o];
      if (l === void 0) {
        const u = Ve(Uint8Array.from(o, (f) => f.charCodeAt(0)));
        l = se(u, u), An[o] = l;
      }
      return Ve(l, ...s);
    },
    _JacobianPoint: K
  };
  Object.defineProperties(Fe, {
    sha256Sync: {
      configurable: !1,
      get() {
        return Ve;
      },
      set(o) {
        Ve || (Ve = o);
      }
    },
    hmacSha256Sync: {
      configurable: !1,
      get() {
        return it;
      },
      set(o) {
        it || (it = o);
      }
    }
  });
  var zt = {};
  Object.defineProperty(zt, "__esModule", {
    value: !0
  }), zt.sha224 = zt.sha256 = void 0;
  var qn = {};
  Object.defineProperty(qn, "__esModule", {
    value: !0
  }), qn.SHA2 = void 0;
  var et = {};
  Object.defineProperty(et, "__esModule", {
    value: !0
  }), et.output = et.exists = et.hash = et.bytes = et.bool = et.number = void 0;
  function or(o) {
    if (!Number.isSafeInteger(o) || o < 0) throw new Error(`Wrong positive integer: ${o}`);
  }
  et.number = or;
  function vr(o) {
    if (typeof o != "boolean") throw new Error(`Expected boolean, not ${o}`);
  }
  et.bool = vr;
  function rt(o, ...s) {
    if (!(o instanceof Uint8Array)) throw new TypeError("Expected Uint8Array");
    if (s.length > 0 && !s.includes(o.length)) throw new TypeError(`Expected Uint8Array of length ${s}, not of length=${o.length}`);
  }
  et.bytes = rt;
  function kt(o) {
    if (typeof o != "function" || typeof o.create != "function") throw new Error("Hash should be wrapped by utils.wrapConstructor");
    or(o.outputLen), or(o.blockLen);
  }
  et.hash = kt;
  function mt(o, s = !0) {
    if (o.destroyed) throw new Error("Hash instance has been destroyed");
    if (s && o.finished) throw new Error("Hash#digest() has already been called");
  }
  et.exists = mt;
  function sn(o, s) {
    rt(o);
    const l = s.outputLen;
    if (o.length < l) throw new Error(`digestInto() expects output buffer of length at least ${l}`);
  }
  et.output = sn;
  const Ze = {
    number: or,
    bool: vr,
    bytes: rt,
    hash: kt,
    exists: mt,
    output: sn
  };
  et.default = Ze;
  var le = {};
  Object.defineProperty(le, "__esModule", {
    value: !0
  }), le.randomBytes = le.wrapConstructorWithOpts = le.wrapConstructor = le.checkOpts = le.Hash = le.concatBytes = le.toBytes = le.utf8ToBytes = le.asyncLoop = le.nextTick = le.hexToBytes = le.bytesToHex = le.isLE = le.rotr = le.createView = le.u32 = le.u8 = void 0;
  var ut = {};
  Object.defineProperty(ut, "__esModule", {
    value: !0
  }), ut.crypto = void 0, ut.crypto = {
    node: void 0,
    web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
  };
  const At = (o) => new Uint8Array(o.buffer, o.byteOffset, o.byteLength);
  le.u8 = At;
  const on = (o) => new Uint32Array(o.buffer, o.byteOffset, Math.floor(o.byteLength / 4));
  le.u32 = on;
  const Dr = (o) => new DataView(o.buffer, o.byteOffset, o.byteLength);
  le.createView = Dr;
  const Us = (o, s) => o << 32 - s | o >>> s;
  if (le.rotr = Us, le.isLE = new Uint8Array(new Uint32Array([
    287454020
  ]).buffer)[0] === 68, !le.isLE) throw new Error("Non little-endian hardware is not supported");
  const Gr = Array.from({
    length: 256
  }, (o, s) => s.toString(16).padStart(2, "0"));
  function Ps(o) {
    if (!(o instanceof Uint8Array)) throw new Error("Uint8Array expected");
    let s = "";
    for (let l = 0; l < o.length; l++) s += Gr[o[l]];
    return s;
  }
  le.bytesToHex = Ps;
  function zs(o) {
    if (typeof o != "string") throw new TypeError("hexToBytes: expected string, got " + typeof o);
    if (o.length % 2) throw new Error("hexToBytes: received invalid unpadded hex");
    const s = new Uint8Array(o.length / 2);
    for (let l = 0; l < s.length; l++) {
      const u = l * 2, f = o.slice(u, u + 2), p = Number.parseInt(f, 16);
      if (Number.isNaN(p) || p < 0) throw new Error("Invalid byte sequence");
      s[l] = p;
    }
    return s;
  }
  le.hexToBytes = zs;
  const di = async () => {
  };
  le.nextTick = di;
  async function Yo(o, s, l) {
    let u = Date.now();
    for (let f = 0; f < o; f++) {
      l(f);
      const p = Date.now() - u;
      p >= 0 && p < s || (await (0, le.nextTick)(), u += p);
    }
  }
  le.asyncLoop = Yo;
  function ui(o) {
    if (typeof o != "string") throw new TypeError(`utf8ToBytes expected string, got ${typeof o}`);
    return new TextEncoder().encode(o);
  }
  le.utf8ToBytes = ui;
  function hi(o) {
    if (typeof o == "string" && (o = ui(o)), !(o instanceof Uint8Array)) throw new TypeError(`Expected input type is Uint8Array (got ${typeof o})`);
    return o;
  }
  le.toBytes = hi;
  function Vi(...o) {
    if (!o.every((u) => u instanceof Uint8Array)) throw new Error("Uint8Array list expected");
    if (o.length === 1) return o[0];
    const s = o.reduce((u, f) => u + f.length, 0), l = new Uint8Array(s);
    for (let u = 0, f = 0; u < o.length; u++) {
      const p = o[u];
      l.set(p, f), f += p.length;
    }
    return l;
  }
  le.concatBytes = Vi;
  class Wi {
    // Safe version that clones internal state
    clone() {
      return this._cloneInto();
    }
  }
  le.Hash = Wi;
  const fi = (o) => Object.prototype.toString.call(o) === "[object Object]" && o.constructor === Object;
  function Gi(o, s) {
    if (s !== void 0 && (typeof s != "object" || !fi(s))) throw new TypeError("Options should be object or undefined");
    return Object.assign(o, s);
  }
  le.checkOpts = Gi;
  function pi(o) {
    const s = (u) => o().update(hi(u)).digest(), l = o();
    return s.outputLen = l.outputLen, s.blockLen = l.blockLen, s.create = () => o(), s;
  }
  le.wrapConstructor = pi;
  function Ki(o) {
    const s = (u, f) => o(f).update(hi(u)).digest(), l = o({});
    return s.outputLen = l.outputLen, s.blockLen = l.blockLen, s.create = (u) => o(u), s;
  }
  le.wrapConstructorWithOpts = Ki;
  function Xo(o = 32) {
    if (ut.crypto.web) return ut.crypto.web.getRandomValues(new Uint8Array(o));
    if (ut.crypto.node) return new Uint8Array(ut.crypto.node.randomBytes(o).buffer);
    throw new Error("The environment doesn't have randomBytes function");
  }
  le.randomBytes = Xo;
  function Jo(o, s, l, u) {
    if (typeof o.setBigUint64 == "function") return o.setBigUint64(s, l, u);
    const f = BigInt(32), p = BigInt(4294967295), _ = Number(l >> f & p), y = Number(l & p), U = u ? 4 : 0, X = u ? 0 : 4;
    o.setUint32(s + U, _, u), o.setUint32(s + X, y, u);
  }
  class Qi extends le.Hash {
    constructor(s, l, u, f) {
      super(), this.blockLen = s, this.outputLen = l, this.padOffset = u, this.isLE = f, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(s), this.view = (0, le.createView)(this.buffer);
    }
    update(s) {
      et.default.exists(this);
      const { view: l, buffer: u, blockLen: f } = this;
      s = (0, le.toBytes)(s);
      const p = s.length;
      for (let _ = 0; _ < p; ) {
        const y = Math.min(f - this.pos, p - _);
        if (y === f) {
          const U = (0, le.createView)(s);
          for (; f <= p - _; _ += f) this.process(U, _);
          continue;
        }
        u.set(s.subarray(_, _ + y), this.pos), this.pos += y, _ += y, this.pos === f && (this.process(l, 0), this.pos = 0);
      }
      return this.length += s.length, this.roundClean(), this;
    }
    digestInto(s) {
      et.default.exists(this), et.default.output(s, this), this.finished = !0;
      const { buffer: l, view: u, blockLen: f, isLE: p } = this;
      let { pos: _ } = this;
      l[_++] = 128, this.buffer.subarray(_).fill(0), this.padOffset > f - _ && (this.process(u, 0), _ = 0);
      for (let Q = _; Q < f; Q++) l[Q] = 0;
      Jo(u, f - 8, BigInt(this.length * 8), p), this.process(u, 0);
      const y = (0, le.createView)(s), U = this.outputLen;
      if (U % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
      const X = U / 4, z = this.get();
      if (X > z.length) throw new Error("_sha2: outputLen bigger than state");
      for (let Q = 0; Q < X; Q++) y.setUint32(4 * Q, z[Q], p);
    }
    digest() {
      const { buffer: s, outputLen: l } = this;
      this.digestInto(s);
      const u = s.slice(0, l);
      return this.destroy(), u;
    }
    _cloneInto(s) {
      s || (s = new this.constructor()), s.set(...this.get());
      const { blockLen: l, buffer: u, length: f, finished: p, destroyed: _, pos: y } = this;
      return s.length = f, s.pos = y, s.finished = p, s.destroyed = _, f % l && s.buffer.set(u), s;
    }
  }
  qn.SHA2 = Qi;
  const ea = (o, s, l) => o & s ^ ~o & l, ta = (o, s, l) => o & s ^ o & l ^ s & l, na = new Uint32Array([
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298
  ]), Gn = new Uint32Array([
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ]), Kn = new Uint32Array(64);
  class gi extends qn.SHA2 {
    constructor() {
      super(64, 32, 8, !1), this.A = Gn[0] | 0, this.B = Gn[1] | 0, this.C = Gn[2] | 0, this.D = Gn[3] | 0, this.E = Gn[4] | 0, this.F = Gn[5] | 0, this.G = Gn[6] | 0, this.H = Gn[7] | 0;
    }
    get() {
      const { A: s, B: l, C: u, D: f, E: p, F: _, G: y, H: U } = this;
      return [
        s,
        l,
        u,
        f,
        p,
        _,
        y,
        U
      ];
    }
    // prettier-ignore
    set(s, l, u, f, p, _, y, U) {
      this.A = s | 0, this.B = l | 0, this.C = u | 0, this.D = f | 0, this.E = p | 0, this.F = _ | 0, this.G = y | 0, this.H = U | 0;
    }
    process(s, l) {
      for (let Q = 0; Q < 16; Q++, l += 4) Kn[Q] = s.getUint32(l, !1);
      for (let Q = 16; Q < 64; Q++) {
        const w = Kn[Q - 15], k = Kn[Q - 2], R = (0, le.rotr)(w, 7) ^ (0, le.rotr)(w, 18) ^ w >>> 3, W = (0, le.rotr)(k, 17) ^ (0, le.rotr)(k, 19) ^ k >>> 10;
        Kn[Q] = W + Kn[Q - 7] + R + Kn[Q - 16] | 0;
      }
      let { A: u, B: f, C: p, D: _, E: y, F: U, G: X, H: z } = this;
      for (let Q = 0; Q < 64; Q++) {
        const w = (0, le.rotr)(y, 6) ^ (0, le.rotr)(y, 11) ^ (0, le.rotr)(y, 25), k = z + w + ea(y, U, X) + na[Q] + Kn[Q] | 0, W = ((0, le.rotr)(u, 2) ^ (0, le.rotr)(u, 13) ^ (0, le.rotr)(u, 22)) + ta(u, f, p) | 0;
        z = X, X = U, U = y, y = _ + k | 0, _ = p, p = f, f = u, u = k + W | 0;
      }
      u = u + this.A | 0, f = f + this.B | 0, p = p + this.C | 0, _ = _ + this.D | 0, y = y + this.E | 0, U = U + this.F | 0, X = X + this.G | 0, z = z + this.H | 0, this.set(u, f, p, _, y, U, X, z);
    }
    roundClean() {
      Kn.fill(0);
    }
    destroy() {
      this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
    }
  }
  class vi extends gi {
    constructor() {
      super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
    }
  }
  zt.sha256 = (0, le.wrapConstructor)(() => new gi()), zt.sha224 = (0, le.wrapConstructor)(() => new vi());
  function br(o) {
    if (!Number.isSafeInteger(o)) throw new Error(`Wrong integer: ${o}`);
  }
  function Sn(...o) {
    const s = (f, p) => (_) => f(p(_)), l = Array.from(o).reverse().reduce((f, p) => f ? s(f, p.encode) : p.encode, void 0), u = o.reduce((f, p) => f ? s(f, p.decode) : p.decode, void 0);
    return {
      encode: l,
      decode: u
    };
  }
  function jn(o) {
    return {
      encode: (s) => {
        if (!Array.isArray(s) || s.length && typeof s[0] != "number") throw new Error("alphabet.encode input should be an array of numbers");
        return s.map((l) => {
          if (br(l), l < 0 || l >= o.length) throw new Error(`Digit index outside alphabet: ${l} (alphabet: ${o.length})`);
          return o[l];
        });
      },
      decode: (s) => {
        if (!Array.isArray(s) || s.length && typeof s[0] != "string") throw new Error("alphabet.decode input should be array of strings");
        return s.map((l) => {
          if (typeof l != "string") throw new Error(`alphabet.decode: not string element=${l}`);
          const u = o.indexOf(l);
          if (u === -1) throw new Error(`Unknown letter: "${l}". Allowed: ${o}`);
          return u;
        });
      }
    };
  }
  function Qn(o = "") {
    if (typeof o != "string") throw new Error("join separator should be string");
    return {
      encode: (s) => {
        if (!Array.isArray(s) || s.length && typeof s[0] != "string") throw new Error("join.encode input should be array of strings");
        for (let l of s) if (typeof l != "string") throw new Error(`join.encode: non-string input=${l}`);
        return s.join(o);
      },
      decode: (s) => {
        if (typeof s != "string") throw new Error("join.decode input should be string");
        return s.split(o);
      }
    };
  }
  function vs(o, s = "=") {
    if (br(o), typeof s != "string") throw new Error("padding chr should be string");
    return {
      encode(l) {
        if (!Array.isArray(l) || l.length && typeof l[0] != "string") throw new Error("padding.encode input should be array of strings");
        for (let u of l) if (typeof u != "string") throw new Error(`padding.encode: non-string input=${u}`);
        for (; l.length * o % 8; ) l.push(s);
        return l;
      },
      decode(l) {
        if (!Array.isArray(l) || l.length && typeof l[0] != "string") throw new Error("padding.encode input should be array of strings");
        for (let f of l) if (typeof f != "string") throw new Error(`padding.decode: non-string input=${f}`);
        let u = l.length;
        if (u * o % 8) throw new Error("Invalid padding: string should have whole number of bytes");
        for (; u > 0 && l[u - 1] === s; u--)
          if (!((u - 1) * o % 8)) throw new Error("Invalid padding: string has too much padding");
        return l.slice(0, u);
      }
    };
  }
  function bi(o) {
    if (typeof o != "function") throw new Error("normalize fn should be function");
    return {
      encode: (s) => s,
      decode: (s) => o(s)
    };
  }
  function Yi(o, s, l) {
    if (s < 2) throw new Error(`convertRadix: wrong from=${s}, base cannot be less than 2`);
    if (l < 2) throw new Error(`convertRadix: wrong to=${l}, base cannot be less than 2`);
    if (!Array.isArray(o)) throw new Error("convertRadix: data should be array");
    if (!o.length) return [];
    let u = 0;
    const f = [], p = Array.from(o);
    for (p.forEach((_) => {
      if (br(_), _ < 0 || _ >= s) throw new Error(`Wrong integer: ${_}`);
    }); ; ) {
      let _ = 0, y = !0;
      for (let U = u; U < p.length; U++) {
        const X = p[U], z = s * _ + X;
        if (!Number.isSafeInteger(z) || s * _ / s !== _ || z - X !== s * _) throw new Error("convertRadix: carry overflow");
        if (_ = z % l, p[U] = Math.floor(z / l), !Number.isSafeInteger(p[U]) || p[U] * l + _ !== z) throw new Error("convertRadix: carry overflow");
        if (y) p[U] ? y = !1 : u = U;
        else continue;
      }
      if (f.push(_), y) break;
    }
    for (let _ = 0; _ < o.length - 1 && o[_] === 0; _++) f.push(0);
    return f.reverse();
  }
  const mi = (o, s) => s ? mi(s, o % s) : o, bs = (o, s) => o + (s - mi(o, s));
  function ms(o, s, l, u) {
    if (!Array.isArray(o)) throw new Error("convertRadix2: data should be array");
    if (s <= 0 || s > 32) throw new Error(`convertRadix2: wrong from=${s}`);
    if (l <= 0 || l > 32) throw new Error(`convertRadix2: wrong to=${l}`);
    if (bs(s, l) > 32) throw new Error(`convertRadix2: carry overflow from=${s} to=${l} carryBits=${bs(s, l)}`);
    let f = 0, p = 0;
    const _ = 2 ** l - 1, y = [];
    for (const U of o) {
      if (br(U), U >= 2 ** s) throw new Error(`convertRadix2: invalid data word=${U} from=${s}`);
      if (f = f << s | U, p + s > 32) throw new Error(`convertRadix2: carry overflow pos=${p} from=${s}`);
      for (p += s; p >= l; p -= l) y.push((f >> p - l & _) >>> 0);
      f &= 2 ** p - 1;
    }
    if (f = f << l - p & _, !u && p >= s) throw new Error("Excess padding");
    if (!u && f) throw new Error(`Non-zero padding: ${f}`);
    return u && p > 0 && y.push(f >>> 0), y;
  }
  function yi(o) {
    return br(o), {
      encode: (s) => {
        if (!(s instanceof Uint8Array)) throw new Error("radix.encode input should be Uint8Array");
        return Yi(Array.from(s), 256, o);
      },
      decode: (s) => {
        if (!Array.isArray(s) || s.length && typeof s[0] != "number") throw new Error("radix.decode input should be array of strings");
        return Uint8Array.from(Yi(s, o, 256));
      }
    };
  }
  function Fn(o, s = !1) {
    if (br(o), o <= 0 || o > 32) throw new Error("radix2: bits should be in (0..32]");
    if (bs(8, o) > 32 || bs(o, 8) > 32) throw new Error("radix2: carry overflow");
    return {
      encode: (l) => {
        if (!(l instanceof Uint8Array)) throw new Error("radix2.encode input should be Uint8Array");
        return ms(Array.from(l), 8, o, !s);
      },
      decode: (l) => {
        if (!Array.isArray(l) || l.length && typeof l[0] != "number") throw new Error("radix2.decode input should be array of strings");
        return Uint8Array.from(ms(l, o, 8, s));
      }
    };
  }
  function wi(o) {
    if (typeof o != "function") throw new Error("unsafeWrapper fn should be function");
    return function(...s) {
      try {
        return o.apply(null, s);
      } catch {
      }
    };
  }
  function Xi(o, s) {
    if (br(o), typeof s != "function") throw new Error("checksum fn should be function");
    return {
      encode(l) {
        if (!(l instanceof Uint8Array)) throw new Error("checksum.encode: input should be Uint8Array");
        const u = s(l).slice(0, o), f = new Uint8Array(l.length + o);
        return f.set(l), f.set(u, l.length), f;
      },
      decode(l) {
        if (!(l instanceof Uint8Array)) throw new Error("checksum.decode: input should be Uint8Array");
        const u = l.slice(0, -o), f = s(u).slice(0, o), p = l.slice(-o);
        for (let _ = 0; _ < o; _++) if (f[_] !== p[_]) throw new Error("Invalid checksum");
        return u;
      }
    };
  }
  const Hs = {
    alphabet: jn,
    chain: Sn,
    checksum: Xi,
    radix: yi,
    radix2: Fn,
    join: Qn,
    padding: vs
  }, Ji = Sn(Fn(4), jn("0123456789ABCDEF"), Qn("")), ra = Sn(Fn(5), jn("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), vs(5), Qn(""));
  Sn(Fn(5), jn("0123456789ABCDEFGHIJKLMNOPQRSTUV"), vs(5), Qn("")), Sn(Fn(5), jn("0123456789ABCDEFGHJKMNPQRSTVWXYZ"), Qn(""), bi((o) => o.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1")));
  const Or = Sn(Fn(6), jn("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), vs(6), Qn("")), eo = Sn(Fn(6), jn("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), vs(6), Qn("")), ys = (o) => Sn(yi(58), jn(o), Qn("")), ws = ys("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz");
  ys("123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"), ys("rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz");
  const to = [
    0,
    2,
    3,
    5,
    6,
    7,
    9,
    10,
    11
  ], no = {
    encode(o) {
      let s = "";
      for (let l = 0; l < o.length; l += 8) {
        const u = o.subarray(l, l + 8);
        s += ws.encode(u).padStart(to[u.length], "1");
      }
      return s;
    },
    decode(o) {
      let s = [];
      for (let l = 0; l < o.length; l += 11) {
        const u = o.slice(l, l + 11), f = to.indexOf(u.length), p = ws.decode(u);
        for (let _ = 0; _ < p.length - f; _++)
          if (p[_] !== 0) throw new Error("base58xmr: wrong padding");
        s = s.concat(Array.from(p.slice(p.length - f)));
      }
      return Uint8Array.from(s);
    }
  }, sa = (o) => Sn(Xi(4, (s) => o(o(s))), ws), xs = Sn(jn("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), Qn("")), xi = [
    996825010,
    642813549,
    513874426,
    1027748829,
    705979059
  ];
  function Nr(o) {
    const s = o >> 25;
    let l = (o & 33554431) << 5;
    for (let u = 0; u < xi.length; u++) (s >> u & 1) === 1 && (l ^= xi[u]);
    return l;
  }
  function _i(o, s, l = 1) {
    const u = o.length;
    let f = 1;
    for (let p = 0; p < u; p++) {
      const _ = o.charCodeAt(p);
      if (_ < 33 || _ > 126) throw new Error(`Invalid prefix (${o})`);
      f = Nr(f) ^ _ >> 5;
    }
    f = Nr(f);
    for (let p = 0; p < u; p++) f = Nr(f) ^ o.charCodeAt(p) & 31;
    for (let p of s) f = Nr(f) ^ p;
    for (let p = 0; p < 6; p++) f = Nr(f);
    return f ^= l, xs.encode(ms([
      f % 2 ** 30
    ], 30, 5, !1));
  }
  function qs(o) {
    const s = o === "bech32" ? 1 : 734539939, l = Fn(5), u = l.decode, f = l.encode, p = wi(u);
    function _(z, Q, w = 90) {
      if (typeof z != "string") throw new Error(`bech32.encode prefix should be string, not ${typeof z}`);
      if (!Array.isArray(Q) || Q.length && typeof Q[0] != "number") throw new Error(`bech32.encode words should be array of numbers, not ${typeof Q}`);
      const k = z.length + 7 + Q.length;
      if (w !== !1 && k > w) throw new TypeError(`Length ${k} exceeds limit ${w}`);
      return z = z.toLowerCase(), `${z}1${xs.encode(Q)}${_i(z, Q, s)}`;
    }
    function y(z, Q = 90) {
      if (typeof z != "string") throw new Error(`bech32.decode input should be string, not ${typeof z}`);
      if (z.length < 8 || Q !== !1 && z.length > Q) throw new TypeError(`Wrong string length: ${z.length} (${z}). Expected (8..${Q})`);
      const w = z.toLowerCase();
      if (z !== w && z !== z.toUpperCase()) throw new Error("String must be lowercase or uppercase");
      z = w;
      const k = z.lastIndexOf("1");
      if (k === 0 || k === -1) throw new Error('Letter "1" must be present between prefix and data only');
      const R = z.slice(0, k), W = z.slice(k + 1);
      if (W.length < 6) throw new Error("Data must be at least 6 characters long");
      const ne = xs.decode(W).slice(0, -6), ie = _i(R, ne, s);
      if (!W.endsWith(ie)) throw new Error(`Invalid checksum in ${z}: expected "${ie}"`);
      return {
        prefix: R,
        words: ne
      };
    }
    const U = wi(y);
    function X(z) {
      const { prefix: Q, words: w } = y(z, !1);
      return {
        prefix: Q,
        words: w,
        bytes: u(w)
      };
    }
    return {
      encode: _,
      decode: y,
      decodeToBytes: X,
      decodeUnsafe: U,
      fromWords: u,
      fromWordsUnsafe: p,
      toWords: f
    };
  }
  const un = qs("bech32");
  qs("bech32m");
  const ia = {
    encode: (o) => new TextDecoder().decode(o),
    decode: (o) => new TextEncoder().encode(o)
  }, oa = Sn(Fn(4), jn("0123456789abcdef"), Qn(""), bi((o) => {
    if (typeof o != "string" || o.length % 2) throw new TypeError(`hex.decode: expected string, got ${typeof o} with length ${o.length}`);
    return o.toLowerCase();
  }));
  `${Object.keys({
    utf8: ia,
    hex: oa,
    base16: Ji,
    base32: ra,
    base64: Or,
    base64url: eo,
    base58: ws,
    base58xmr: no
  }).join(", ")}`;
  var _s = {};
  Object.defineProperty(_s, "__esModule", {
    value: !0
  }), _s.wordlist = void 0, _s.wordlist = `abandon
ability
able
about
above
absent
absorb
abstract
absurd
abuse
access
accident
account
accuse
achieve
acid
acoustic
acquire
across
act
action
actor
actress
actual
adapt
add
addict
address
adjust
admit
adult
advance
advice
aerobic
affair
afford
afraid
again
age
agent
agree
ahead
aim
air
airport
aisle
alarm
album
alcohol
alert
alien
all
alley
allow
almost
alone
alpha
already
also
alter
always
amateur
amazing
among
amount
amused
analyst
anchor
ancient
anger
angle
angry
animal
ankle
announce
annual
another
answer
antenna
antique
anxiety
any
apart
apology
appear
apple
approve
april
arch
arctic
area
arena
argue
arm
armed
armor
army
around
arrange
arrest
arrive
arrow
art
artefact
artist
artwork
ask
aspect
assault
asset
assist
assume
asthma
athlete
atom
attack
attend
attitude
attract
auction
audit
august
aunt
author
auto
autumn
average
avocado
avoid
awake
aware
away
awesome
awful
awkward
axis
baby
bachelor
bacon
badge
bag
balance
balcony
ball
bamboo
banana
banner
bar
barely
bargain
barrel
base
basic
basket
battle
beach
bean
beauty
because
become
beef
before
begin
behave
behind
believe
below
belt
bench
benefit
best
betray
better
between
beyond
bicycle
bid
bike
bind
biology
bird
birth
bitter
black
blade
blame
blanket
blast
bleak
bless
blind
blood
blossom
blouse
blue
blur
blush
board
boat
body
boil
bomb
bone
bonus
book
boost
border
boring
borrow
boss
bottom
bounce
box
boy
bracket
brain
brand
brass
brave
bread
breeze
brick
bridge
brief
bright
bring
brisk
broccoli
broken
bronze
broom
brother
brown
brush
bubble
buddy
budget
buffalo
build
bulb
bulk
bullet
bundle
bunker
burden
burger
burst
bus
business
busy
butter
buyer
buzz
cabbage
cabin
cable
cactus
cage
cake
call
calm
camera
camp
can
canal
cancel
candy
cannon
canoe
canvas
canyon
capable
capital
captain
car
carbon
card
cargo
carpet
carry
cart
case
cash
casino
castle
casual
cat
catalog
catch
category
cattle
caught
cause
caution
cave
ceiling
celery
cement
census
century
cereal
certain
chair
chalk
champion
change
chaos
chapter
charge
chase
chat
cheap
check
cheese
chef
cherry
chest
chicken
chief
child
chimney
choice
choose
chronic
chuckle
chunk
churn
cigar
cinnamon
circle
citizen
city
civil
claim
clap
clarify
claw
clay
clean
clerk
clever
click
client
cliff
climb
clinic
clip
clock
clog
close
cloth
cloud
clown
club
clump
cluster
clutch
coach
coast
coconut
code
coffee
coil
coin
collect
color
column
combine
come
comfort
comic
common
company
concert
conduct
confirm
congress
connect
consider
control
convince
cook
cool
copper
copy
coral
core
corn
correct
cost
cotton
couch
country
couple
course
cousin
cover
coyote
crack
cradle
craft
cram
crane
crash
crater
crawl
crazy
cream
credit
creek
crew
cricket
crime
crisp
critic
crop
cross
crouch
crowd
crucial
cruel
cruise
crumble
crunch
crush
cry
crystal
cube
culture
cup
cupboard
curious
current
curtain
curve
cushion
custom
cute
cycle
dad
damage
damp
dance
danger
daring
dash
daughter
dawn
day
deal
debate
debris
decade
december
decide
decline
decorate
decrease
deer
defense
define
defy
degree
delay
deliver
demand
demise
denial
dentist
deny
depart
depend
deposit
depth
deputy
derive
describe
desert
design
desk
despair
destroy
detail
detect
develop
device
devote
diagram
dial
diamond
diary
dice
diesel
diet
differ
digital
dignity
dilemma
dinner
dinosaur
direct
dirt
disagree
discover
disease
dish
dismiss
disorder
display
distance
divert
divide
divorce
dizzy
doctor
document
dog
doll
dolphin
domain
donate
donkey
donor
door
dose
double
dove
draft
dragon
drama
drastic
draw
dream
dress
drift
drill
drink
drip
drive
drop
drum
dry
duck
dumb
dune
during
dust
dutch
duty
dwarf
dynamic
eager
eagle
early
earn
earth
easily
east
easy
echo
ecology
economy
edge
edit
educate
effort
egg
eight
either
elbow
elder
electric
elegant
element
elephant
elevator
elite
else
embark
embody
embrace
emerge
emotion
employ
empower
empty
enable
enact
end
endless
endorse
enemy
energy
enforce
engage
engine
enhance
enjoy
enlist
enough
enrich
enroll
ensure
enter
entire
entry
envelope
episode
equal
equip
era
erase
erode
erosion
error
erupt
escape
essay
essence
estate
eternal
ethics
evidence
evil
evoke
evolve
exact
example
excess
exchange
excite
exclude
excuse
execute
exercise
exhaust
exhibit
exile
exist
exit
exotic
expand
expect
expire
explain
expose
express
extend
extra
eye
eyebrow
fabric
face
faculty
fade
faint
faith
fall
false
fame
family
famous
fan
fancy
fantasy
farm
fashion
fat
fatal
father
fatigue
fault
favorite
feature
february
federal
fee
feed
feel
female
fence
festival
fetch
fever
few
fiber
fiction
field
figure
file
film
filter
final
find
fine
finger
finish
fire
firm
first
fiscal
fish
fit
fitness
fix
flag
flame
flash
flat
flavor
flee
flight
flip
float
flock
floor
flower
fluid
flush
fly
foam
focus
fog
foil
fold
follow
food
foot
force
forest
forget
fork
fortune
forum
forward
fossil
foster
found
fox
fragile
frame
frequent
fresh
friend
fringe
frog
front
frost
frown
frozen
fruit
fuel
fun
funny
furnace
fury
future
gadget
gain
galaxy
gallery
game
gap
garage
garbage
garden
garlic
garment
gas
gasp
gate
gather
gauge
gaze
general
genius
genre
gentle
genuine
gesture
ghost
giant
gift
giggle
ginger
giraffe
girl
give
glad
glance
glare
glass
glide
glimpse
globe
gloom
glory
glove
glow
glue
goat
goddess
gold
good
goose
gorilla
gospel
gossip
govern
gown
grab
grace
grain
grant
grape
grass
gravity
great
green
grid
grief
grit
grocery
group
grow
grunt
guard
guess
guide
guilt
guitar
gun
gym
habit
hair
half
hammer
hamster
hand
happy
harbor
hard
harsh
harvest
hat
have
hawk
hazard
head
health
heart
heavy
hedgehog
height
hello
helmet
help
hen
hero
hidden
high
hill
hint
hip
hire
history
hobby
hockey
hold
hole
holiday
hollow
home
honey
hood
hope
horn
horror
horse
hospital
host
hotel
hour
hover
hub
huge
human
humble
humor
hundred
hungry
hunt
hurdle
hurry
hurt
husband
hybrid
ice
icon
idea
identify
idle
ignore
ill
illegal
illness
image
imitate
immense
immune
impact
impose
improve
impulse
inch
include
income
increase
index
indicate
indoor
industry
infant
inflict
inform
inhale
inherit
initial
inject
injury
inmate
inner
innocent
input
inquiry
insane
insect
inside
inspire
install
intact
interest
into
invest
invite
involve
iron
island
isolate
issue
item
ivory
jacket
jaguar
jar
jazz
jealous
jeans
jelly
jewel
job
join
joke
journey
joy
judge
juice
jump
jungle
junior
junk
just
kangaroo
keen
keep
ketchup
key
kick
kid
kidney
kind
kingdom
kiss
kit
kitchen
kite
kitten
kiwi
knee
knife
knock
know
lab
label
labor
ladder
lady
lake
lamp
language
laptop
large
later
latin
laugh
laundry
lava
law
lawn
lawsuit
layer
lazy
leader
leaf
learn
leave
lecture
left
leg
legal
legend
leisure
lemon
lend
length
lens
leopard
lesson
letter
level
liar
liberty
library
license
life
lift
light
like
limb
limit
link
lion
liquid
list
little
live
lizard
load
loan
lobster
local
lock
logic
lonely
long
loop
lottery
loud
lounge
love
loyal
lucky
luggage
lumber
lunar
lunch
luxury
lyrics
machine
mad
magic
magnet
maid
mail
main
major
make
mammal
man
manage
mandate
mango
mansion
manual
maple
marble
march
margin
marine
market
marriage
mask
mass
master
match
material
math
matrix
matter
maximum
maze
meadow
mean
measure
meat
mechanic
medal
media
melody
melt
member
memory
mention
menu
mercy
merge
merit
merry
mesh
message
metal
method
middle
midnight
milk
million
mimic
mind
minimum
minor
minute
miracle
mirror
misery
miss
mistake
mix
mixed
mixture
mobile
model
modify
mom
moment
monitor
monkey
monster
month
moon
moral
more
morning
mosquito
mother
motion
motor
mountain
mouse
move
movie
much
muffin
mule
multiply
muscle
museum
mushroom
music
must
mutual
myself
mystery
myth
naive
name
napkin
narrow
nasty
nation
nature
near
neck
need
negative
neglect
neither
nephew
nerve
nest
net
network
neutral
never
news
next
nice
night
noble
noise
nominee
noodle
normal
north
nose
notable
note
nothing
notice
novel
now
nuclear
number
nurse
nut
oak
obey
object
oblige
obscure
observe
obtain
obvious
occur
ocean
october
odor
off
offer
office
often
oil
okay
old
olive
olympic
omit
once
one
onion
online
only
open
opera
opinion
oppose
option
orange
orbit
orchard
order
ordinary
organ
orient
original
orphan
ostrich
other
outdoor
outer
output
outside
oval
oven
over
own
owner
oxygen
oyster
ozone
pact
paddle
page
pair
palace
palm
panda
panel
panic
panther
paper
parade
parent
park
parrot
party
pass
patch
path
patient
patrol
pattern
pause
pave
payment
peace
peanut
pear
peasant
pelican
pen
penalty
pencil
people
pepper
perfect
permit
person
pet
phone
photo
phrase
physical
piano
picnic
picture
piece
pig
pigeon
pill
pilot
pink
pioneer
pipe
pistol
pitch
pizza
place
planet
plastic
plate
play
please
pledge
pluck
plug
plunge
poem
poet
point
polar
pole
police
pond
pony
pool
popular
portion
position
possible
post
potato
pottery
poverty
powder
power
practice
praise
predict
prefer
prepare
present
pretty
prevent
price
pride
primary
print
priority
prison
private
prize
problem
process
produce
profit
program
project
promote
proof
property
prosper
protect
proud
provide
public
pudding
pull
pulp
pulse
pumpkin
punch
pupil
puppy
purchase
purity
purpose
purse
push
put
puzzle
pyramid
quality
quantum
quarter
question
quick
quit
quiz
quote
rabbit
raccoon
race
rack
radar
radio
rail
rain
raise
rally
ramp
ranch
random
range
rapid
rare
rate
rather
raven
raw
razor
ready
real
reason
rebel
rebuild
recall
receive
recipe
record
recycle
reduce
reflect
reform
refuse
region
regret
regular
reject
relax
release
relief
rely
remain
remember
remind
remove
render
renew
rent
reopen
repair
repeat
replace
report
require
rescue
resemble
resist
resource
response
result
retire
retreat
return
reunion
reveal
review
reward
rhythm
rib
ribbon
rice
rich
ride
ridge
rifle
right
rigid
ring
riot
ripple
risk
ritual
rival
river
road
roast
robot
robust
rocket
romance
roof
rookie
room
rose
rotate
rough
round
route
royal
rubber
rude
rug
rule
run
runway
rural
sad
saddle
sadness
safe
sail
salad
salmon
salon
salt
salute
same
sample
sand
satisfy
satoshi
sauce
sausage
save
say
scale
scan
scare
scatter
scene
scheme
school
science
scissors
scorpion
scout
scrap
screen
script
scrub
sea
search
season
seat
second
secret
section
security
seed
seek
segment
select
sell
seminar
senior
sense
sentence
series
service
session
settle
setup
seven
shadow
shaft
shallow
share
shed
shell
sheriff
shield
shift
shine
ship
shiver
shock
shoe
shoot
shop
short
shoulder
shove
shrimp
shrug
shuffle
shy
sibling
sick
side
siege
sight
sign
silent
silk
silly
silver
similar
simple
since
sing
siren
sister
situate
six
size
skate
sketch
ski
skill
skin
skirt
skull
slab
slam
sleep
slender
slice
slide
slight
slim
slogan
slot
slow
slush
small
smart
smile
smoke
smooth
snack
snake
snap
sniff
snow
soap
soccer
social
sock
soda
soft
solar
soldier
solid
solution
solve
someone
song
soon
sorry
sort
soul
sound
soup
source
south
space
spare
spatial
spawn
speak
special
speed
spell
spend
sphere
spice
spider
spike
spin
spirit
split
spoil
sponsor
spoon
sport
spot
spray
spread
spring
spy
square
squeeze
squirrel
stable
stadium
staff
stage
stairs
stamp
stand
start
state
stay
steak
steel
stem
step
stereo
stick
still
sting
stock
stomach
stone
stool
story
stove
strategy
street
strike
strong
struggle
student
stuff
stumble
style
subject
submit
subway
success
such
sudden
suffer
sugar
suggest
suit
summer
sun
sunny
sunset
super
supply
supreme
sure
surface
surge
surprise
surround
survey
suspect
sustain
swallow
swamp
swap
swarm
swear
sweet
swift
swim
swing
switch
sword
symbol
symptom
syrup
system
table
tackle
tag
tail
talent
talk
tank
tape
target
task
taste
tattoo
taxi
teach
team
tell
ten
tenant
tennis
tent
term
test
text
thank
that
theme
then
theory
there
they
thing
this
thought
three
thrive
throw
thumb
thunder
ticket
tide
tiger
tilt
timber
time
tiny
tip
tired
tissue
title
toast
tobacco
today
toddler
toe
together
toilet
token
tomato
tomorrow
tone
tongue
tonight
tool
tooth
top
topic
topple
torch
tornado
tortoise
toss
total
tourist
toward
tower
town
toy
track
trade
traffic
tragic
train
transfer
trap
trash
travel
tray
treat
tree
trend
trial
tribe
trick
trigger
trim
trip
trophy
trouble
truck
true
truly
trumpet
trust
truth
try
tube
tuition
tumble
tuna
tunnel
turkey
turn
turtle
twelve
twenty
twice
twin
twist
two
type
typical
ugly
umbrella
unable
unaware
uncle
uncover
under
undo
unfair
unfold
unhappy
uniform
unique
unit
universe
unknown
unlock
until
unusual
unveil
update
upgrade
uphold
upon
upper
upset
urban
urge
usage
use
used
useful
useless
usual
utility
vacant
vacuum
vague
valid
valley
valve
van
vanish
vapor
various
vast
vault
vehicle
velvet
vendor
venture
venue
verb
verify
version
very
vessel
veteran
viable
vibrant
vicious
victory
video
view
village
vintage
violin
virtual
virus
visa
visit
visual
vital
vivid
vocal
voice
void
volcano
volume
vote
voyage
wage
wagon
wait
walk
wall
walnut
want
warfare
warm
warrior
wash
wasp
waste
water
wave
way
wealth
weapon
wear
weasel
weather
web
wedding
weekend
weird
welcome
west
wet
whale
what
wheat
wheel
when
where
whip
whisper
wide
width
wife
wild
will
win
window
wine
wing
wink
winner
winter
wire
wisdom
wise
wish
witness
wolf
woman
wonder
wood
wool
word
work
world
worry
worth
wrap
wreck
wrestle
wrist
write
wrong
yard
year
yellow
you
young
youth
zebra
zero
zone
zoo`.split(`
`);
  var Xt = {};
  Object.defineProperty(Xt, "__esModule", {
    value: !0
  }), Xt.mnemonicToSeedSync = Xt.mnemonicToSeed = Xt.validateMnemonic = Xt.entropyToMnemonic = Xt.mnemonicToEntropy = Xt.generateMnemonic = void 0;
  var ar = {};
  Object.defineProperty(ar, "__esModule", {
    value: !0
  }), ar.pbkdf2Async = ar.pbkdf2 = void 0;
  var Yn = {};
  Object.defineProperty(Yn, "__esModule", {
    value: !0
  }), Yn.hmac = void 0;
  class ro extends le.Hash {
    constructor(s, l) {
      super(), this.finished = !1, this.destroyed = !1, et.default.hash(s);
      const u = (0, le.toBytes)(l);
      if (this.iHash = s.create(), typeof this.iHash.update != "function") throw new TypeError("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const f = this.blockLen, p = new Uint8Array(f);
      p.set(u.length > f ? s.create().update(u).digest() : u);
      for (let _ = 0; _ < p.length; _++) p[_] ^= 54;
      this.iHash.update(p), this.oHash = s.create();
      for (let _ = 0; _ < p.length; _++) p[_] ^= 106;
      this.oHash.update(p), p.fill(0);
    }
    update(s) {
      return et.default.exists(this), this.iHash.update(s), this;
    }
    digestInto(s) {
      et.default.exists(this), et.default.bytes(s, this.outputLen), this.finished = !0, this.iHash.digestInto(s), this.oHash.update(s), this.oHash.digestInto(s), this.destroy();
    }
    digest() {
      const s = new Uint8Array(this.oHash.outputLen);
      return this.digestInto(s), s;
    }
    _cloneInto(s) {
      s || (s = Object.create(Object.getPrototypeOf(this), {}));
      const { oHash: l, iHash: u, finished: f, destroyed: p, blockLen: _, outputLen: y } = this;
      return s.finished = f, s.destroyed = p, s.blockLen = _, s.outputLen = y, s.oHash = l._cloneInto(s.oHash), s.iHash = u._cloneInto(s.iHash), s;
    }
    destroy() {
      this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
    }
  }
  const so = (o, s, l) => new ro(o, s).update(l).digest();
  Yn.hmac = so, Yn.hmac.create = (o, s) => new ro(o, s);
  function js(o, s, l, u) {
    et.default.hash(o);
    const f = (0, le.checkOpts)({
      dkLen: 32,
      asyncTick: 10
    }, u), { c: p, dkLen: _, asyncTick: y } = f;
    if (et.default.number(p), et.default.number(_), et.default.number(y), p < 1) throw new Error("PBKDF2: iterations (c) should be >= 1");
    const U = (0, le.toBytes)(s), X = (0, le.toBytes)(l), z = new Uint8Array(_), Q = Yn.hmac.create(o, U), w = Q._cloneInto().update(X);
    return {
      c: p,
      dkLen: _,
      asyncTick: y,
      DK: z,
      PRF: Q,
      PRFSalt: w
    };
  }
  function Fs(o, s, l, u, f) {
    return o.destroy(), s.destroy(), u && u.destroy(), f.fill(0), l;
  }
  function Ei(o, s, l, u) {
    const { c: f, dkLen: p, DK: _, PRF: y, PRFSalt: U } = js(o, s, l, u);
    let X;
    const z = new Uint8Array(4), Q = (0, le.createView)(z), w = new Uint8Array(y.outputLen);
    for (let k = 1, R = 0; R < p; k++, R += y.outputLen) {
      const W = _.subarray(R, R + y.outputLen);
      Q.setInt32(0, k, !1), (X = U._cloneInto(X)).update(z).digestInto(w), W.set(w.subarray(0, W.length));
      for (let ne = 1; ne < f; ne++) {
        y._cloneInto(X).update(w).digestInto(w);
        for (let ie = 0; ie < W.length; ie++) W[ie] ^= w[ie];
      }
    }
    return Fs(y, U, _, X, w);
  }
  ar.pbkdf2 = Ei;
  async function io(o, s, l, u) {
    const { c: f, dkLen: p, asyncTick: _, DK: y, PRF: U, PRFSalt: X } = js(o, s, l, u);
    let z;
    const Q = new Uint8Array(4), w = (0, le.createView)(Q), k = new Uint8Array(U.outputLen);
    for (let R = 1, W = 0; W < p; R++, W += U.outputLen) {
      const ne = y.subarray(W, W + U.outputLen);
      w.setInt32(0, R, !1), (z = X._cloneInto(z)).update(Q).digestInto(k), ne.set(k.subarray(0, ne.length)), await (0, le.asyncLoop)(f - 1, _, (ie) => {
        U._cloneInto(z).update(k).digestInto(k);
        for (let be = 0; be < ne.length; be++) ne[be] ^= k[be];
      });
    }
    return Fs(U, X, y, z, k);
  }
  ar.pbkdf2Async = io;
  var tn = {};
  Object.defineProperty(tn, "__esModule", {
    value: !0
  }), tn.sha384 = tn.sha512_256 = tn.sha512_224 = tn.sha512 = tn.SHA512 = void 0;
  var Pe = {};
  Object.defineProperty(Pe, "__esModule", {
    value: !0
  }), Pe.add = Pe.toBig = Pe.split = Pe.fromBig = void 0;
  const Zs = BigInt(2 ** 32 - 1), $i = BigInt(32);
  function lr(o, s = !1) {
    return s ? {
      h: Number(o & Zs),
      l: Number(o >> $i & Zs)
    } : {
      h: Number(o >> $i & Zs) | 0,
      l: Number(o & Zs) | 0
    };
  }
  Pe.fromBig = lr;
  function ki(o, s = !1) {
    let l = new Uint32Array(o.length), u = new Uint32Array(o.length);
    for (let f = 0; f < o.length; f++) {
      const { h: p, l: _ } = lr(o[f], s);
      [l[f], u[f]] = [
        p,
        _
      ];
    }
    return [
      l,
      u
    ];
  }
  Pe.split = ki;
  const la = (o, s) => BigInt(o >>> 0) << $i | BigInt(s >>> 0);
  Pe.toBig = la;
  const ca = (o, s, l) => o >>> l, da = (o, s, l) => o << 32 - l | s >>> l, Le = (o, s, l) => o >>> l | s << 32 - l, Ne = (o, s, l) => o << 32 - l | s >>> l, $e = (o, s, l) => o << 64 - l | s >>> l - 32, qe = (o, s, l) => o >>> l - 32 | s << 64 - l, Be = (o, s) => s, ct = (o, s) => o, tt = (o, s, l) => o << l | s >>> 32 - l, st = (o, s, l) => s << l | o >>> 32 - l, Dt = (o, s, l) => s << l - 32 | o >>> 64 - l, St = (o, s, l) => o << l - 32 | s >>> 64 - l;
  function Ct(o, s, l, u) {
    const f = (s >>> 0) + (u >>> 0);
    return {
      h: o + l + (f / 2 ** 32 | 0) | 0,
      l: f | 0
    };
  }
  Pe.add = Ct;
  const It = (o, s, l) => (o >>> 0) + (s >>> 0) + (l >>> 0), Gt = (o, s, l, u) => s + l + u + (o / 2 ** 32 | 0) | 0, an = (o, s, l, u) => (o >>> 0) + (s >>> 0) + (l >>> 0) + (u >>> 0), hn = (o, s, l, u, f) => s + l + u + f + (o / 2 ** 32 | 0) | 0, Xn = (o, s, l, u, f) => (o >>> 0) + (s >>> 0) + (l >>> 0) + (u >>> 0) + (f >>> 0), Kr = (o, s, l, u, f, p) => s + l + u + f + p + (o / 2 ** 32 | 0) | 0, Es = {
    fromBig: lr,
    split: ki,
    toBig: Pe.toBig,
    shrSH: ca,
    shrSL: da,
    rotrSH: Le,
    rotrSL: Ne,
    rotrBH: $e,
    rotrBL: qe,
    rotr32H: Be,
    rotr32L: ct,
    rotlSH: tt,
    rotlSL: st,
    rotlBH: Dt,
    rotlBL: St,
    add: Ct,
    add3L: It,
    add3H: Gt,
    add4L: an,
    add4H: hn,
    add5H: Kr,
    add5L: Xn
  };
  Pe.default = Es;
  const [$s, Ai] = Pe.default.split([
    "0x428a2f98d728ae22",
    "0x7137449123ef65cd",
    "0xb5c0fbcfec4d3b2f",
    "0xe9b5dba58189dbbc",
    "0x3956c25bf348b538",
    "0x59f111f1b605d019",
    "0x923f82a4af194f9b",
    "0xab1c5ed5da6d8118",
    "0xd807aa98a3030242",
    "0x12835b0145706fbe",
    "0x243185be4ee4b28c",
    "0x550c7dc3d5ffb4e2",
    "0x72be5d74f27b896f",
    "0x80deb1fe3b1696b1",
    "0x9bdc06a725c71235",
    "0xc19bf174cf692694",
    "0xe49b69c19ef14ad2",
    "0xefbe4786384f25e3",
    "0x0fc19dc68b8cd5b5",
    "0x240ca1cc77ac9c65",
    "0x2de92c6f592b0275",
    "0x4a7484aa6ea6e483",
    "0x5cb0a9dcbd41fbd4",
    "0x76f988da831153b5",
    "0x983e5152ee66dfab",
    "0xa831c66d2db43210",
    "0xb00327c898fb213f",
    "0xbf597fc7beef0ee4",
    "0xc6e00bf33da88fc2",
    "0xd5a79147930aa725",
    "0x06ca6351e003826f",
    "0x142929670a0e6e70",
    "0x27b70a8546d22ffc",
    "0x2e1b21385c26c926",
    "0x4d2c6dfc5ac42aed",
    "0x53380d139d95b3df",
    "0x650a73548baf63de",
    "0x766a0abb3c77b2a8",
    "0x81c2c92e47edaee6",
    "0x92722c851482353b",
    "0xa2bfe8a14cf10364",
    "0xa81a664bbc423001",
    "0xc24b8b70d0f89791",
    "0xc76c51a30654be30",
    "0xd192e819d6ef5218",
    "0xd69906245565a910",
    "0xf40e35855771202a",
    "0x106aa07032bbd1b8",
    "0x19a4c116b8d2d0c8",
    "0x1e376c085141ab53",
    "0x2748774cdf8eeb99",
    "0x34b0bcb5e19b48a8",
    "0x391c0cb3c5c95a63",
    "0x4ed8aa4ae3418acb",
    "0x5b9cca4f7763e373",
    "0x682e6ff3d6b2b8a3",
    "0x748f82ee5defb2fc",
    "0x78a5636f43172f60",
    "0x84c87814a1f0ab72",
    "0x8cc702081a6439ec",
    "0x90befffa23631e28",
    "0xa4506cebde82bde9",
    "0xbef9a3f7b2c67915",
    "0xc67178f2e372532b",
    "0xca273eceea26619c",
    "0xd186b8c721c0c207",
    "0xeada7dd6cde0eb1e",
    "0xf57d4f7fee6ed178",
    "0x06f067aa72176fba",
    "0x0a637dc5a2c898a6",
    "0x113f9804bef90dae",
    "0x1b710b35131c471b",
    "0x28db77f523047d84",
    "0x32caab7b40c72493",
    "0x3c9ebe0a15c9bebc",
    "0x431d67c49c100d4c",
    "0x4cc5d4becb3e42b6",
    "0x597f299cfc657e2a",
    "0x5fcb6fab3ad6faec",
    "0x6c44198c4a475817"
  ].map((o) => BigInt(o))), mr = new Uint32Array(80), cr = new Uint32Array(80);
  class ks extends qn.SHA2 {
    constructor() {
      super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
    }
    // prettier-ignore
    get() {
      const { Ah: s, Al: l, Bh: u, Bl: f, Ch: p, Cl: _, Dh: y, Dl: U, Eh: X, El: z, Fh: Q, Fl: w, Gh: k, Gl: R, Hh: W, Hl: ne } = this;
      return [
        s,
        l,
        u,
        f,
        p,
        _,
        y,
        U,
        X,
        z,
        Q,
        w,
        k,
        R,
        W,
        ne
      ];
    }
    // prettier-ignore
    set(s, l, u, f, p, _, y, U, X, z, Q, w, k, R, W, ne) {
      this.Ah = s | 0, this.Al = l | 0, this.Bh = u | 0, this.Bl = f | 0, this.Ch = p | 0, this.Cl = _ | 0, this.Dh = y | 0, this.Dl = U | 0, this.Eh = X | 0, this.El = z | 0, this.Fh = Q | 0, this.Fl = w | 0, this.Gh = k | 0, this.Gl = R | 0, this.Hh = W | 0, this.Hl = ne | 0;
    }
    process(s, l) {
      for (let fe = 0; fe < 16; fe++, l += 4)
        mr[fe] = s.getUint32(l), cr[fe] = s.getUint32(l += 4);
      for (let fe = 16; fe < 80; fe++) {
        const Ae = mr[fe - 15] | 0, xe = cr[fe - 15] | 0, we = Pe.default.rotrSH(Ae, xe, 1) ^ Pe.default.rotrSH(Ae, xe, 8) ^ Pe.default.shrSH(Ae, xe, 7), Ie = Pe.default.rotrSL(Ae, xe, 1) ^ Pe.default.rotrSL(Ae, xe, 8) ^ Pe.default.shrSL(Ae, xe, 7), Me = mr[fe - 2] | 0, vt = cr[fe - 2] | 0, O = Pe.default.rotrSH(Me, vt, 19) ^ Pe.default.rotrBH(Me, vt, 61) ^ Pe.default.shrSH(Me, vt, 6), M = Pe.default.rotrSL(Me, vt, 19) ^ Pe.default.rotrBL(Me, vt, 61) ^ Pe.default.shrSL(Me, vt, 6), I = Pe.default.add4L(Ie, M, cr[fe - 7], cr[fe - 16]), j = Pe.default.add4H(I, we, O, mr[fe - 7], mr[fe - 16]);
        mr[fe] = j | 0, cr[fe] = I | 0;
      }
      let { Ah: u, Al: f, Bh: p, Bl: _, Ch: y, Cl: U, Dh: X, Dl: z, Eh: Q, El: w, Fh: k, Fl: R, Gh: W, Gl: ne, Hh: ie, Hl: be } = this;
      for (let fe = 0; fe < 80; fe++) {
        const Ae = Pe.default.rotrSH(Q, w, 14) ^ Pe.default.rotrSH(Q, w, 18) ^ Pe.default.rotrBH(Q, w, 41), xe = Pe.default.rotrSL(Q, w, 14) ^ Pe.default.rotrSL(Q, w, 18) ^ Pe.default.rotrBL(Q, w, 41), we = Q & k ^ ~Q & W, Ie = w & R ^ ~w & ne, Me = Pe.default.add5L(be, xe, Ie, Ai[fe], cr[fe]), vt = Pe.default.add5H(Me, ie, Ae, we, $s[fe], mr[fe]), O = Me | 0, M = Pe.default.rotrSH(u, f, 28) ^ Pe.default.rotrBH(u, f, 34) ^ Pe.default.rotrBH(u, f, 39), I = Pe.default.rotrSL(u, f, 28) ^ Pe.default.rotrBL(u, f, 34) ^ Pe.default.rotrBL(u, f, 39), j = u & p ^ u & y ^ p & y, J = f & _ ^ f & U ^ _ & U;
        ie = W | 0, be = ne | 0, W = k | 0, ne = R | 0, k = Q | 0, R = w | 0, { h: Q, l: w } = Pe.default.add(X | 0, z | 0, vt | 0, O | 0), X = y | 0, z = U | 0, y = p | 0, U = _ | 0, p = u | 0, _ = f | 0;
        const ue = Pe.default.add3L(O, I, J);
        u = Pe.default.add3H(ue, vt, M, j), f = ue | 0;
      }
      ({ h: u, l: f } = Pe.default.add(this.Ah | 0, this.Al | 0, u | 0, f | 0)), { h: p, l: _ } = Pe.default.add(this.Bh | 0, this.Bl | 0, p | 0, _ | 0), { h: y, l: U } = Pe.default.add(this.Ch | 0, this.Cl | 0, y | 0, U | 0), { h: X, l: z } = Pe.default.add(this.Dh | 0, this.Dl | 0, X | 0, z | 0), { h: Q, l: w } = Pe.default.add(this.Eh | 0, this.El | 0, Q | 0, w | 0), { h: k, l: R } = Pe.default.add(this.Fh | 0, this.Fl | 0, k | 0, R | 0), { h: W, l: ne } = Pe.default.add(this.Gh | 0, this.Gl | 0, W | 0, ne | 0), { h: ie, l: be } = Pe.default.add(this.Hh | 0, this.Hl | 0, ie | 0, be | 0), this.set(u, f, p, _, y, U, X, z, Q, w, k, R, W, ne, ie, be);
    }
    roundClean() {
      mr.fill(0), cr.fill(0);
    }
    destroy() {
      this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
  }
  tn.SHA512 = ks;
  class oo extends ks {
    constructor() {
      super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
    }
  }
  class As extends ks {
    constructor() {
      super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
    }
  }
  class Qr extends ks {
    constructor() {
      super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
    }
  }
  tn.sha512 = (0, le.wrapConstructor)(() => new ks()), tn.sha512_224 = (0, le.wrapConstructor)(() => new oo()), tn.sha512_256 = (0, le.wrapConstructor)(() => new As()), tn.sha384 = (0, le.wrapConstructor)(() => new Qr());
  const ao = (o) => o[0] === "あいこくしん";
  function lo(o) {
    if (typeof o != "string") throw new TypeError(`Invalid mnemonic type: ${typeof o}`);
    return o.normalize("NFKD");
  }
  function Si(o) {
    const s = lo(o), l = s.split(" ");
    if (![
      12,
      15,
      18,
      21,
      24
    ].includes(l.length)) throw new Error("Invalid mnemonic");
    return {
      nfkd: s,
      words: l
    };
  }
  function Ht(o) {
    et.default.bytes(o, 16, 20, 24, 28, 32);
  }
  function Jn(o, s = 128) {
    if (et.default.number(s), s % 32 !== 0 || s > 256) throw new TypeError("Invalid entropy");
    return uo((0, le.randomBytes)(s / 8), o);
  }
  Xt.generateMnemonic = Jn;
  const yr = (o) => {
    const s = 8 - o.length / 4;
    return new Uint8Array([
      (0, zt.sha256)(o)[0] >> s << s
    ]);
  };
  function Vs(o) {
    if (!Array.isArray(o) || o.length !== 2048 || typeof o[0] != "string") throw new Error("Worlist: expected array of 2048 strings");
    return o.forEach((s) => {
      if (typeof s != "string") throw new Error(`Wordlist: non-string element: ${s}`);
    }), Hs.chain(Hs.checksum(1, yr), Hs.radix2(11, !0), Hs.alphabet(o));
  }
  function co(o, s) {
    const { words: l } = Si(o), u = Vs(s).decode(l);
    return Ht(u), u;
  }
  Xt.mnemonicToEntropy = co;
  function uo(o, s) {
    return Ht(o), Vs(s).encode(o).join(ao(s) ? "　" : " ");
  }
  Xt.entropyToMnemonic = uo;
  function ua(o, s) {
    try {
      co(o, s);
    } catch {
      return !1;
    }
    return !0;
  }
  Xt.validateMnemonic = ua;
  const ho = (o) => lo(`mnemonic${o}`);
  function ha(o, s = "") {
    return (0, ar.pbkdf2Async)(tn.sha512, Si(o).nfkd, ho(s), {
      c: 2048,
      dkLen: 64
    });
  }
  Xt.mnemonicToSeed = ha;
  function fa(o, s = "") {
    return (0, ar.pbkdf2)(tn.sha512, Si(o).nfkd, ho(s), {
      c: 2048,
      dkLen: 64
    });
  }
  Xt.mnemonicToSeedSync = fa;
  var Yr = {};
  Object.defineProperty(Yr, "__esModule", {
    value: !0
  }), Yr.ripemd160 = Yr.RIPEMD160 = void 0;
  const zh = new Uint8Array([
    7,
    4,
    13,
    1,
    10,
    6,
    15,
    3,
    12,
    0,
    9,
    5,
    2,
    14,
    11,
    8
  ]), tc = Uint8Array.from({
    length: 16
  }, (o, s) => s), Hh = tc.map((o) => (9 * o + 5) % 16);
  let pa = [
    tc
  ], ga = [
    Hh
  ];
  for (let o = 0; o < 4; o++) for (let s of [
    pa,
    ga
  ]) s.push(s[o].map((l) => zh[l]));
  const nc = [
    [
      11,
      14,
      15,
      12,
      5,
      8,
      7,
      9,
      11,
      13,
      14,
      15,
      6,
      7,
      9,
      8
    ],
    [
      12,
      13,
      11,
      15,
      6,
      9,
      9,
      7,
      12,
      15,
      11,
      13,
      7,
      8,
      7,
      7
    ],
    [
      13,
      15,
      14,
      11,
      7,
      7,
      6,
      8,
      13,
      14,
      13,
      12,
      5,
      5,
      6,
      9
    ],
    [
      14,
      11,
      12,
      14,
      8,
      6,
      5,
      5,
      15,
      12,
      15,
      14,
      9,
      9,
      8,
      6
    ],
    [
      15,
      12,
      13,
      13,
      9,
      5,
      8,
      6,
      14,
      11,
      12,
      11,
      8,
      6,
      5,
      5
    ]
  ].map((o) => new Uint8Array(o)), qh = pa.map((o, s) => o.map((l) => nc[s][l])), jh = ga.map((o, s) => o.map((l) => nc[s][l])), Fh = new Uint32Array([
    0,
    1518500249,
    1859775393,
    2400959708,
    2840853838
  ]), Zh = new Uint32Array([
    1352829926,
    1548603684,
    1836072691,
    2053994217,
    0
  ]), fo = (o, s) => o << s | o >>> 32 - s;
  function rc(o, s, l, u) {
    return o === 0 ? s ^ l ^ u : o === 1 ? s & l | ~s & u : o === 2 ? (s | ~l) ^ u : o === 3 ? s & u | l & ~u : s ^ (l | ~u);
  }
  const po = new Uint32Array(16);
  class sc extends qn.SHA2 {
    constructor() {
      super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
    }
    get() {
      const { h0: s, h1: l, h2: u, h3: f, h4: p } = this;
      return [
        s,
        l,
        u,
        f,
        p
      ];
    }
    set(s, l, u, f, p) {
      this.h0 = s | 0, this.h1 = l | 0, this.h2 = u | 0, this.h3 = f | 0, this.h4 = p | 0;
    }
    process(s, l) {
      for (let k = 0; k < 16; k++, l += 4) po[k] = s.getUint32(l, !0);
      let u = this.h0 | 0, f = u, p = this.h1 | 0, _ = p, y = this.h2 | 0, U = y, X = this.h3 | 0, z = X, Q = this.h4 | 0, w = Q;
      for (let k = 0; k < 5; k++) {
        const R = 4 - k, W = Fh[k], ne = Zh[k], ie = pa[k], be = ga[k], fe = qh[k], Ae = jh[k];
        for (let xe = 0; xe < 16; xe++) {
          const we = fo(u + rc(k, p, y, X) + po[ie[xe]] + W, fe[xe]) + Q | 0;
          u = Q, Q = X, X = fo(y, 10) | 0, y = p, p = we;
        }
        for (let xe = 0; xe < 16; xe++) {
          const we = fo(f + rc(R, _, U, z) + po[be[xe]] + ne, Ae[xe]) + w | 0;
          f = w, w = z, z = fo(U, 10) | 0, U = _, _ = we;
        }
      }
      this.set(this.h1 + y + z | 0, this.h2 + X + w | 0, this.h3 + Q + f | 0, this.h4 + u + _ | 0, this.h0 + p + U | 0);
    }
    roundClean() {
      po.fill(0);
    }
    destroy() {
      this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
    }
  }
  Yr.RIPEMD160 = sc, Yr.ripemd160 = (0, le.wrapConstructor)(() => new sc()), Fe.hmacSha256Sync = (o, ...s) => (0, Yn.hmac)(zt.sha256, o, Fe.concatBytes(...s));
  const va = sa(zt.sha256);
  function ic(o) {
    return BigInt(`0x${(0, le.bytesToHex)(o)}`);
  }
  function Vh(o) {
    return (0, le.hexToBytes)(o.toString(16).padStart(64, "0"));
  }
  const Wh = (0, le.utf8ToBytes)("Bitcoin seed"), ba = {
    private: 76066276,
    public: 76067358
  }, ma = 2147483648, Gh = (o) => (0, Yr.ripemd160)((0, zt.sha256)(o)), Kh = (o) => (0, le.createView)(o).getUint32(0, !1), go = (o) => {
    if (!Number.isSafeInteger(o) || o < 0 || o > 2 ** 32 - 1) throw new Error(`Invalid number=${o}. Should be from 0 to 2 ** 32 - 1`);
    const s = new Uint8Array(4);
    return (0, le.createView)(s).setUint32(0, o, !1), s;
  };
  class Ss {
    constructor(s) {
      if (this.depth = 0, this.index = 0, this.chainCode = null, this.parentFingerprint = 0, !s || typeof s != "object") throw new Error("HDKey.constructor must not be called directly");
      if (this.versions = s.versions || ba, this.depth = s.depth || 0, this.chainCode = s.chainCode, this.index = s.index || 0, this.parentFingerprint = s.parentFingerprint || 0, !this.depth && (this.parentFingerprint || this.index))
        throw new Error("HDKey: zero depth with non-zero index/parent fingerprint");
      if (s.publicKey && s.privateKey) throw new Error("HDKey: publicKey and privateKey at same time.");
      if (s.privateKey) {
        if (!Fe.isValidPrivateKey(s.privateKey)) throw new Error("Invalid private key");
        this.privKey = typeof s.privateKey == "bigint" ? s.privateKey : ic(s.privateKey), this.privKeyBytes = Vh(this.privKey), this.pubKey = Ye(s.privateKey, !0);
      } else if (s.publicKey) this.pubKey = A.fromHex(s.publicKey).toRawBytes(!0);
      else throw new Error("HDKey: no public or private key provided");
      this.pubHash = Gh(this.pubKey);
    }
    get fingerprint() {
      if (!this.pubHash) throw new Error("No publicKey set!");
      return Kh(this.pubHash);
    }
    get identifier() {
      return this.pubHash;
    }
    get pubKeyHash() {
      return this.pubHash;
    }
    get privateKey() {
      return this.privKeyBytes || null;
    }
    get publicKey() {
      return this.pubKey || null;
    }
    get privateExtendedKey() {
      const s = this.privateKey;
      if (!s) throw new Error("No private key");
      return va.encode(this.serialize(this.versions.private, (0, le.concatBytes)(new Uint8Array([
        0
      ]), s)));
    }
    get publicExtendedKey() {
      if (!this.pubKey) throw new Error("No public key");
      return va.encode(this.serialize(this.versions.public, this.pubKey));
    }
    static fromMasterSeed(s, l = ba) {
      if ((0, et.bytes)(s), 8 * s.length < 128 || 8 * s.length > 512) throw new Error(`HDKey: wrong seed length=${s.length}. Should be between 128 and 512 bits; 256 bits is advised)`);
      const u = (0, Yn.hmac)(tn.sha512, Wh, s);
      return new Ss({
        versions: l,
        chainCode: u.slice(32),
        privateKey: u.slice(0, 32)
      });
    }
    static fromExtendedKey(s, l = ba) {
      const u = va.decode(s), f = (0, le.createView)(u), p = f.getUint32(0, !1), _ = {
        versions: l,
        depth: u[4],
        parentFingerprint: f.getUint32(5, !1),
        index: f.getUint32(9, !1),
        chainCode: u.slice(13, 45)
      }, y = u.slice(45), U = y[0] === 0;
      if (p !== l[U ? "private" : "public"]) throw new Error("Version mismatch");
      return U ? new Ss({
        ..._,
        privateKey: y.slice(1)
      }) : new Ss({
        ..._,
        publicKey: y
      });
    }
    static fromJSON(s) {
      return Ss.fromExtendedKey(s.xpriv);
    }
    derive(s) {
      if (!/^[mM]'?/.test(s)) throw new Error('Path must start with "m" or "M"');
      if (/^[mM]'?$/.test(s)) return this;
      const l = s.replace(/^[mM]'?\//, "").split("/");
      let u = this;
      for (const f of l) {
        const p = /^(\d+)('?)$/.exec(f);
        if (!p || p.length !== 3) throw new Error(`Invalid child index: ${f}`);
        let _ = +p[1];
        if (!Number.isSafeInteger(_) || _ >= ma) throw new Error("Invalid index");
        p[2] === "'" && (_ += ma), u = u.deriveChild(_);
      }
      return u;
    }
    deriveChild(s) {
      if (!this.pubKey || !this.chainCode) throw new Error("No publicKey or chainCode set");
      let l = go(s);
      if (s >= ma) {
        const y = this.privateKey;
        if (!y) throw new Error("Could not derive hardened child key");
        l = (0, le.concatBytes)(new Uint8Array([
          0
        ]), y, l);
      } else l = (0, le.concatBytes)(this.pubKey, l);
      const u = (0, Yn.hmac)(tn.sha512, this.chainCode, l), f = ic(u.slice(0, 32)), p = u.slice(32);
      if (!Fe.isValidPrivateKey(f)) throw new Error("Tweak bigger than curve order");
      const _ = {
        versions: this.versions,
        chainCode: p,
        depth: this.depth + 1,
        parentFingerprint: this.fingerprint,
        index: s
      };
      try {
        if (this.privateKey) {
          const y = Fe.mod(this.privKey + f, v.n);
          if (!Fe.isValidPrivateKey(y)) throw new Error("The tweak was out of range or the resulted private key is invalid");
          _.privateKey = y;
        } else {
          const y = A.fromHex(this.pubKey).add(A.fromPrivateKey(f));
          if (y.equals(A.ZERO)) throw new Error("The tweak was equal to negative P, which made the result key invalid");
          _.publicKey = y.toRawBytes(!0);
        }
        return new Ss(_);
      } catch {
        return this.deriveChild(s + 1);
      }
    }
    sign(s) {
      if (!this.privateKey) throw new Error("No privateKey set!");
      return (0, et.bytes)(s, 32), In(s, this.privKey, {
        canonical: !0,
        der: !1
      });
    }
    verify(s, l) {
      if ((0, et.bytes)(s, 32), (0, et.bytes)(l, 64), !this.publicKey) throw new Error("No publicKey set!");
      let u;
      try {
        u = Y.fromCompact(l);
      } catch {
        return !1;
      }
      return Tt(u, s, this.publicKey);
    }
    wipePrivateData() {
      return this.privKey = void 0, this.privKeyBytes && (this.privKeyBytes.fill(0), this.privKeyBytes = void 0), this;
    }
    toJSON() {
      return {
        xpriv: this.privateExtendedKey,
        xpub: this.publicExtendedKey
      };
    }
    serialize(s, l) {
      if (!this.chainCode) throw new Error("No chainCode set");
      return (0, et.bytes)(l, 33), (0, le.concatBytes)(go(s), new Uint8Array([
        this.depth
      ]), go(this.parentFingerprint), go(this.index), this.chainCode, l);
    }
  }
  var Qh = Object.defineProperty, Ln = (o, s) => {
    for (var l in s) Qh(o, l, {
      get: s[l],
      enumerable: !0
    });
  };
  function Yh() {
    return Fe.bytesToHex(Fe.randomPrivateKey());
  }
  function oc(o) {
    return Fe.bytesToHex(dn.getPublicKey(o));
  }
  var Xh = {};
  Ln(Xh, {
    insertEventIntoAscendingList: () => ef,
    insertEventIntoDescendingList: () => Jh,
    normalizeURL: () => ya,
    utf8Decoder: () => Xr,
    utf8Encoder: () => wr
  });
  var Xr = new TextDecoder("utf-8"), wr = new TextEncoder();
  function ya(o) {
    let s = new URL(o);
    return s.pathname = s.pathname.replace(/\/+/g, "/"), s.pathname.endsWith("/") && (s.pathname = s.pathname.slice(0, -1)), (s.port === "80" && s.protocol === "ws:" || s.port === "443" && s.protocol === "wss:") && (s.port = ""), s.searchParams.sort(), s.hash = "", s.toString();
  }
  function Jh(o, s) {
    let l = 0, u = o.length - 1, f, p = l;
    if (u < 0) p = 0;
    else if (s.created_at < o[u].created_at) p = u + 1;
    else if (s.created_at >= o[l].created_at) p = l;
    else for (; ; ) {
      if (u <= l + 1) {
        p = u;
        break;
      }
      if (f = Math.floor(l + (u - l) / 2), o[f].created_at > s.created_at) l = f;
      else if (o[f].created_at < s.created_at) u = f;
      else {
        p = f;
        break;
      }
    }
    return o[p]?.id !== s.id ? [
      ...o.slice(0, p),
      s,
      ...o.slice(p)
    ] : o;
  }
  function ef(o, s) {
    let l = 0, u = o.length - 1, f, p = l;
    if (u < 0) p = 0;
    else if (s.created_at > o[u].created_at) p = u + 1;
    else if (s.created_at <= o[l].created_at) p = l;
    else for (; ; ) {
      if (u <= l + 1) {
        p = u;
        break;
      }
      if (f = Math.floor(l + (u - l) / 2), o[f].created_at < s.created_at) l = f;
      else if (o[f].created_at > s.created_at) u = f;
      else {
        p = f;
        break;
      }
    }
    return o[p]?.id !== s.id ? [
      ...o.slice(0, p),
      s,
      ...o.slice(p)
    ] : o;
  }
  function tf(o, s) {
    let l = o;
    return l.pubkey = oc(s), l.id = wa(l), l.sig = sf(l, s), l;
  }
  function nf(o) {
    if (!xa(o)) throw new Error("can't serialize event with wrong or missing properties");
    return JSON.stringify([
      0,
      o.pubkey,
      o.created_at,
      o.kind,
      o.tags,
      o.content
    ]);
  }
  function wa(o) {
    let s = (0, zt.sha256)(wr.encode(nf(o)));
    return Fe.bytesToHex(s);
  }
  var rf = (o) => o instanceof Object;
  function xa(o) {
    if (!rf(o) || typeof o.kind != "number" || typeof o.content != "string" || typeof o.created_at != "number" || typeof o.pubkey != "string" || !o.pubkey.match(/^[a-f0-9]{64}$/) || !Array.isArray(o.tags)) return !1;
    for (let s = 0; s < o.tags.length; s++) {
      let l = o.tags[s];
      if (!Array.isArray(l)) return !1;
      for (let u = 0; u < l.length; u++)
        if (typeof l[u] == "object") return !1;
    }
    return !0;
  }
  function ac(o) {
    return dn.verifySync(o.sig, wa(o), o.pubkey);
  }
  function sf(o, s) {
    return Fe.bytesToHex(dn.signSync(wa(o), s));
  }
  function of(o, s) {
    if (o.ids && o.ids.indexOf(s.id) === -1 && !o.ids.some((l) => s.id.startsWith(l)) || o.kinds && o.kinds.indexOf(s.kind) === -1 || o.authors && o.authors.indexOf(s.pubkey) === -1 && !o.authors.some((l) => s.pubkey.startsWith(l)))
      return !1;
    for (let l in o) if (l[0] === "#") {
      let u = l.slice(1), f = o[`#${u}`];
      if (f && !s.tags.find(([p, _]) => p === l.slice(1) && f.indexOf(_) !== -1)) return !1;
    }
    return !(o.since && s.created_at < o.since || o.until && s.created_at >= o.until);
  }
  function af(o, s) {
    for (let l = 0; l < o.length; l++)
      if (of(o[l], s)) return !0;
    return !1;
  }
  var lf = {};
  Ln(lf, {
    getHex64: () => vo,
    getInt: () => lc,
    getSubscriptionId: () => cc,
    matchEventId: () => cf,
    matchEventKind: () => uf,
    matchEventPubkey: () => df
  });
  function vo(o, s) {
    let l = s.length + 3, u = o.indexOf(`"${s}":`) + l, f = o.slice(u).indexOf('"') + u + 1;
    return o.slice(f, f + 64);
  }
  function lc(o, s) {
    let l = s.length, u = o.indexOf(`"${s}":`) + l + 3, f = o.slice(u), p = Math.min(f.indexOf(","), f.indexOf("}"));
    return parseInt(f.slice(0, p), 10);
  }
  function cc(o) {
    let s = o.slice(0, 22).indexOf('"EVENT"');
    if (s === -1) return null;
    let l = o.slice(s + 7 + 1).indexOf('"');
    if (l === -1) return null;
    let u = s + 7 + 1 + l, f = o.slice(u + 1, 80).indexOf('"');
    if (f === -1) return null;
    let p = u + 1 + f;
    return o.slice(u + 1, p);
  }
  function cf(o, s) {
    return s === vo(o, "id");
  }
  function df(o, s) {
    return s === vo(o, "pubkey");
  }
  function uf(o, s) {
    return s === lc(o, "kind");
  }
  var dc = () => ({
    connect: [],
    disconnect: [],
    error: [],
    notice: [],
    auth: []
  });
  function hf(o, s = {}) {
    let { listTimeout: l = 3e3, getTimeout: u = 3e3, countTimeout: f = 3e3 } = s;
    var p, _ = {}, y = dc(), U = {}, X = {}, z;
    async function Q() {
      return z || (z = new Promise((ie, be) => {
        try {
          p = new WebSocket(o);
        } catch (we) {
          be(we);
        }
        p.onopen = () => {
          y.connect.forEach((we) => we()), ie();
        }, p.onerror = () => {
          z = void 0, y.error.forEach((we) => we()), be();
        }, p.onclose = async () => {
          z = void 0, y.disconnect.forEach((we) => we());
        };
        let fe = [], Ae;
        p.onmessage = (we) => {
          fe.push(we.data), Ae || (Ae = setInterval(xe, 0));
        };
        function xe() {
          if (fe.length === 0) {
            clearInterval(Ae), Ae = null;
            return;
          }
          var we = fe.shift();
          if (!we) return;
          let Ie = cc(we);
          if (Ie) {
            let Me = _[Ie];
            if (Me && Me.alreadyHaveEvent && Me.alreadyHaveEvent(vo(we, "id"), o)) return;
          }
          try {
            let Me = JSON.parse(we);
            switch (Me[0]) {
              case "EVENT": {
                let I = Me[1], j = Me[2];
                xa(j) && _[I] && (_[I].skipVerification || ac(j)) && af(_[I].filters, j) && (_[I], (U[I]?.event || []).forEach((J) => J(j)));
                return;
              }
              case "COUNT":
                let vt = Me[1], O = Me[2];
                _[vt] && (U[vt]?.count || []).forEach((I) => I(O));
                return;
              case "EOSE": {
                let I = Me[1];
                I in U && (U[I].eose.forEach((j) => j()), U[I].eose = []);
                return;
              }
              case "OK": {
                let I = Me[1], j = Me[2], J = Me[3] || "";
                I in X && (j ? X[I].ok.forEach((ue) => ue()) : X[I].failed.forEach((ue) => ue(J)), X[I].ok = [], X[I].failed = []);
                return;
              }
              case "NOTICE":
                let M = Me[1];
                y.notice.forEach((I) => I(M));
                return;
              case "AUTH": {
                let I = Me[1];
                y.auth?.forEach((j) => j(I));
                return;
              }
            }
          } catch {
            return;
          }
        }
      }), z);
    }
    function w() {
      return p?.readyState === 1;
    }
    async function k() {
      w() || await Q();
    }
    async function R(ie) {
      let be = JSON.stringify(ie);
      if (!(!w() && (await new Promise((fe) => setTimeout(fe, 1e3)), !w())))
        try {
          p.send(be);
        } catch (fe) {
          console.log(fe);
        }
    }
    const W = (ie, { verb: be = "REQ", skipVerification: fe = !1, alreadyHaveEvent: Ae = null, id: xe = Math.random().toString().slice(2) } = {}) => {
      let we = xe;
      return _[we] = {
        id: we,
        filters: ie,
        skipVerification: fe,
        alreadyHaveEvent: Ae
      }, R([
        be,
        we,
        ...ie
      ]), {
        sub: (Ie, Me = {}) => W(Ie || ie, {
          skipVerification: Me.skipVerification || fe,
          alreadyHaveEvent: Me.alreadyHaveEvent || Ae,
          id: we
        }),
        unsub: () => {
          delete _[we], delete U[we], R([
            "CLOSE",
            we
          ]);
        },
        on: (Ie, Me) => {
          U[we] = U[we] || {
            event: [],
            count: [],
            eose: []
          }, U[we][Ie].push(Me);
        },
        off: (Ie, Me) => {
          let vt = U[we], O = vt[Ie].indexOf(Me);
          O >= 0 && vt[Ie].splice(O, 1);
        }
      };
    };
    function ne(ie, be) {
      if (!ie.id) throw new Error(`event ${ie} has no id`);
      let fe = ie.id;
      return R([
        be,
        ie
      ]), {
        on: (Ae, xe) => {
          X[fe] = X[fe] || {
            ok: [],
            failed: []
          }, X[fe][Ae].push(xe);
        },
        off: (Ae, xe) => {
          let we = X[fe];
          if (!we) return;
          let Ie = we[Ae].indexOf(xe);
          Ie >= 0 && we[Ae].splice(Ie, 1);
        }
      };
    }
    return {
      url: o,
      sub: W,
      on: (ie, be) => {
        y[ie].push(be), ie === "connect" && p?.readyState === 1 && be();
      },
      off: (ie, be) => {
        let fe = y[ie].indexOf(be);
        fe !== -1 && y[ie].splice(fe, 1);
      },
      list: (ie, be) => new Promise((fe) => {
        let Ae = W(ie, be), xe = [], we = setTimeout(() => {
          Ae.unsub(), fe(xe);
        }, l);
        Ae.on("eose", () => {
          Ae.unsub(), clearTimeout(we), fe(xe);
        }), Ae.on("event", (Ie) => {
          xe.push(Ie);
        });
      }),
      get: (ie, be) => new Promise((fe) => {
        let Ae = W([
          ie
        ], be), xe = setTimeout(() => {
          Ae.unsub(), fe(null);
        }, u);
        Ae.on("event", (we) => {
          Ae.unsub(), clearTimeout(xe), fe(we);
        });
      }),
      count: (ie) => new Promise((be) => {
        let fe = W(ie, {
          ...W,
          verb: "COUNT"
        }), Ae = setTimeout(() => {
          fe.unsub(), be(null);
        }, f);
        fe.on("count", (xe) => {
          fe.unsub(), clearTimeout(Ae), be(xe);
        });
      }),
      publish(ie) {
        return ne(ie, "EVENT");
      },
      auth(ie) {
        return ne(ie, "AUTH");
      },
      connect: k,
      close() {
        y = dc(), U = {}, X = {}, p.readyState === WebSocket.OPEN && p?.close();
      },
      get status() {
        return p?.readyState ?? 3;
      }
    };
  }
  var uc = class {
    _conn;
    _seenOn = {};
    eoseSubTimeout;
    getTimeout;
    constructor(o = {}) {
      this._conn = {}, this.eoseSubTimeout = o.eoseSubTimeout || 3400, this.getTimeout = o.getTimeout || 3400;
    }
    close(o) {
      o.forEach((s) => {
        let l = this._conn[ya(s)];
        l && l.close();
      });
    }
    async ensureRelay(o) {
      const s = ya(o);
      this._conn[s] || (this._conn[s] = hf(s, {
        getTimeout: this.getTimeout * 0.9,
        listTimeout: this.getTimeout * 0.9
      }));
      const l = this._conn[s];
      return await l.connect(), l;
    }
    sub(o, s, l) {
      let u = /* @__PURE__ */ new Set(), f = {
        ...l || {}
      };
      f.alreadyHaveEvent = (w, k) => {
        if (l?.alreadyHaveEvent?.(w, k)) return !0;
        let R = this._seenOn[w] || /* @__PURE__ */ new Set();
        return R.add(k), this._seenOn[w] = R, u.has(w);
      };
      let p = [], _ = /* @__PURE__ */ new Set(), y = /* @__PURE__ */ new Set(), U = o.length, X = !1, z = setTimeout(() => {
        X = !0;
        for (let w of y.values()) w();
      }, this.eoseSubTimeout);
      o.forEach(async (w) => {
        let k;
        try {
          k = await this.ensureRelay(w);
        } catch {
          W();
          return;
        }
        if (!k) return;
        let R = k.sub(s, f);
        R.on("event", (ne) => {
          u.add(ne.id);
          for (let ie of _.values()) ie(ne);
        }), R.on("eose", () => {
          X || W();
        }), p.push(R);
        function W() {
          if (U--, U === 0) {
            clearTimeout(z);
            for (let ne of y.values()) ne();
          }
        }
      });
      let Q = {
        sub(w, k) {
          return p.forEach((R) => R.sub(w, k)), Q;
        },
        unsub() {
          p.forEach((w) => w.unsub());
        },
        on(w, k) {
          w === "event" ? _.add(k) : w === "eose" && y.add(k);
        },
        off(w, k) {
          w === "event" ? _.delete(k) : w === "eose" && y.delete(k);
        }
      };
      return Q;
    }
    get(o, s, l) {
      return new Promise((u) => {
        let f = this.sub(o, [
          s
        ], l), p = setTimeout(() => {
          f.unsub(), u(null);
        }, this.getTimeout);
        f.on("event", (_) => {
          u(_), clearTimeout(p), f.unsub();
        });
      });
    }
    list(o, s, l) {
      return new Promise((u) => {
        let f = [], p = this.sub(o, s, l);
        p.on("event", (_) => {
          f.push(_);
        }), p.on("eose", () => {
          p.unsub(), u(f);
        });
      });
    }
    publish(o, s) {
      const l = o.map(async (f) => {
        let p;
        try {
          return p = await this.ensureRelay(f), p.publish(s);
        } catch {
          return {
            on() {
            },
            off() {
            }
          };
        }
      }), u = /* @__PURE__ */ new Map();
      return {
        on(f, p) {
          o.forEach(async (_, y) => {
            let U = await l[y], X = () => p(_);
            u.set(p, X), U.on(f, X);
          });
        },
        off(f, p) {
          o.forEach(async (_, y) => {
            let U = u.get(p);
            U && (await l[y]).off(f, U);
          });
        }
      };
    }
    seenOn(o) {
      return Array.from(this._seenOn[o]?.values?.() || []);
    }
  }, _a = {};
  Ln(_a, {
    decode: () => bo,
    naddrEncode: () => mf,
    neventEncode: () => bf,
    noteEncode: () => gf,
    nprofileEncode: () => vf,
    npubEncode: () => pf,
    nrelayEncode: () => yf,
    nsecEncode: () => ff
  });
  var Ws = 5e3;
  function bo(o) {
    let { prefix: s, words: l } = un.decode(o, Ws), u = new Uint8Array(un.fromWords(l));
    switch (s) {
      case "nprofile": {
        let f = mo(u);
        if (!f[0]?.[0]) throw new Error("missing TLV 0 for nprofile");
        if (f[0][0].length !== 32) throw new Error("TLV 0 should be 32 bytes");
        return {
          type: "nprofile",
          data: {
            pubkey: Fe.bytesToHex(f[0][0]),
            relays: f[1] ? f[1].map((p) => Xr.decode(p)) : []
          }
        };
      }
      case "nevent": {
        let f = mo(u);
        if (!f[0]?.[0]) throw new Error("missing TLV 0 for nevent");
        if (f[0][0].length !== 32) throw new Error("TLV 0 should be 32 bytes");
        if (f[2] && f[2][0].length !== 32) throw new Error("TLV 2 should be 32 bytes");
        return {
          type: "nevent",
          data: {
            id: Fe.bytesToHex(f[0][0]),
            relays: f[1] ? f[1].map((p) => Xr.decode(p)) : [],
            author: f[2]?.[0] ? Fe.bytesToHex(f[2][0]) : void 0
          }
        };
      }
      case "naddr": {
        let f = mo(u);
        if (!f[0]?.[0]) throw new Error("missing TLV 0 for naddr");
        if (!f[2]?.[0]) throw new Error("missing TLV 2 for naddr");
        if (f[2][0].length !== 32) throw new Error("TLV 2 should be 32 bytes");
        if (!f[3]?.[0]) throw new Error("missing TLV 3 for naddr");
        if (f[3][0].length !== 4) throw new Error("TLV 3 should be 4 bytes");
        return {
          type: "naddr",
          data: {
            identifier: Xr.decode(f[0][0]),
            pubkey: Fe.bytesToHex(f[2][0]),
            kind: parseInt(Fe.bytesToHex(f[3][0]), 16),
            relays: f[1] ? f[1].map((p) => Xr.decode(p)) : []
          }
        };
      }
      case "nrelay": {
        let f = mo(u);
        if (!f[0]?.[0]) throw new Error("missing TLV 0 for nrelay");
        return {
          type: "nrelay",
          data: Xr.decode(f[0][0])
        };
      }
      case "nsec":
      case "npub":
      case "note":
        return {
          type: s,
          data: Fe.bytesToHex(u)
        };
      default:
        throw new Error(`unknown prefix ${s}`);
    }
  }
  function mo(o) {
    let s = {}, l = o;
    for (; l.length > 0; ) {
      let u = l[0], f = l[1], p = l.slice(2, 2 + f);
      l = l.slice(2 + f), !(p.length < f) && (s[u] = s[u] || [], s[u].push(p));
    }
    return s;
  }
  function ff(o) {
    return Ea("nsec", o);
  }
  function pf(o) {
    return Ea("npub", o);
  }
  function gf(o) {
    return Ea("note", o);
  }
  function Ea(o, s) {
    let l = Fe.hexToBytes(s), u = un.toWords(l);
    return un.encode(o, u, Ws);
  }
  function vf(o) {
    let s = yo({
      0: [
        Fe.hexToBytes(o.pubkey)
      ],
      1: (o.relays || []).map((u) => wr.encode(u))
    }), l = un.toWords(s);
    return un.encode("nprofile", l, Ws);
  }
  function bf(o) {
    let s = yo({
      0: [
        Fe.hexToBytes(o.id)
      ],
      1: (o.relays || []).map((u) => wr.encode(u)),
      2: o.author ? [
        Fe.hexToBytes(o.author)
      ] : []
    }), l = un.toWords(s);
    return un.encode("nevent", l, Ws);
  }
  function mf(o) {
    let s = new ArrayBuffer(4);
    new DataView(s).setUint32(0, o.kind, !1);
    let l = yo({
      0: [
        wr.encode(o.identifier)
      ],
      1: (o.relays || []).map((f) => wr.encode(f)),
      2: [
        Fe.hexToBytes(o.pubkey)
      ],
      3: [
        new Uint8Array(s)
      ]
    }), u = un.toWords(l);
    return un.encode("naddr", u, Ws);
  }
  function yf(o) {
    let s = yo({
      0: [
        wr.encode(o)
      ]
    }), l = un.toWords(s);
    return un.encode("nrelay", l, Ws);
  }
  function yo(o) {
    let s = [];
    return Object.entries(o).forEach(([l, u]) => {
      u.forEach((f) => {
        let p = new Uint8Array(f.length + 2);
        p.set([
          parseInt(l)
        ], 0), p.set([
          f.length
        ], 1), p.set(f, 2), s.push(p);
      });
    }), Fe.concatBytes(...s);
  }
  var wf = {};
  Ln(wf, {
    decrypt: () => _f,
    encrypt: () => xf
  });
  async function xf(o, s, l) {
    const u = $t(o, "02" + s), f = hc(u);
    let p = Uint8Array.from((0, le.randomBytes)(16)), _ = wr.encode(l), y = await crypto.subtle.importKey("raw", f, {
      name: "AES-CBC"
    }, !1, [
      "encrypt"
    ]), U = await crypto.subtle.encrypt({
      name: "AES-CBC",
      iv: p
    }, y, _), X = Or.encode(new Uint8Array(U)), z = Or.encode(new Uint8Array(p.buffer));
    return `${X}?iv=${z}`;
  }
  async function _f(o, s, l) {
    let [u, f] = l.split("?iv="), p = $t(o, "02" + s), _ = hc(p), y = await crypto.subtle.importKey("raw", _, {
      name: "AES-CBC"
    }, !1, [
      "decrypt"
    ]), U = Or.decode(u), X = Or.decode(f), z = await crypto.subtle.decrypt({
      name: "AES-CBC",
      iv: X
    }, y, U);
    return Xr.decode(z);
  }
  function hc(o) {
    return o.slice(1, 33);
  }
  var Ef = {};
  Ln(Ef, {
    queryProfile: () => Af,
    searchDomain: () => kf,
    useFetchImplementation: () => $f
  });
  var wo;
  try {
    wo = fetch;
  } catch {
  }
  function $f(o) {
    wo = o;
  }
  async function kf(o, s = "") {
    try {
      return (await (await wo(`https://${o}/.well-known/nostr.json?name=${s}`)).json()).names;
    } catch {
      return {};
    }
  }
  async function Af(o) {
    let [s, l] = o.split("@");
    if (l || (l = s, s = "_"), !s.match(/^[A-Za-z0-9-_.]+$/) || !l.includes(".")) return null;
    let u;
    try {
      u = await (await wo(`https://${l}/.well-known/nostr.json?name=${s}`)).json();
    } catch {
      return null;
    }
    if (!u?.names?.[s]) return null;
    let f = u.names[s], p = u.relays?.[f] || [];
    return {
      pubkey: f,
      relays: p
    };
  }
  var Sf = {};
  Ln(Sf, {
    generateSeedWords: () => If,
    privateKeyFromSeedWords: () => Cf,
    validateWords: () => Tf
  });
  function Cf(o, s) {
    let u = Ss.fromMasterSeed((0, Xt.mnemonicToSeedSync)(o, s)).derive("m/44'/1237'/0'/0/0").privateKey;
    if (!u) throw new Error("could not derive private key");
    return Fe.bytesToHex(u);
  }
  function If() {
    return (0, Xt.generateMnemonic)(_s.wordlist);
  }
  function Tf(o) {
    return (0, Xt.validateMnemonic)(o, _s.wordlist);
  }
  var Lf = {};
  Ln(Lf, {
    parse: () => Df
  });
  function Df(o) {
    const s = {
      reply: void 0,
      root: void 0,
      mentions: [],
      profiles: []
    }, l = [];
    for (const u of o.tags)
      u[0] === "e" && u[1] && l.push(u), u[0] === "p" && u[1] && s.profiles.push({
        pubkey: u[1],
        relays: u[2] ? [
          u[2]
        ] : []
      });
    for (let u = 0; u < l.length; u++) {
      const f = l[u], [p, _, y, U] = f, X = {
        id: _,
        relays: y ? [
          y
        ] : []
      }, z = u === 0, Q = u === l.length - 1;
      if (U === "root") {
        s.root = X;
        continue;
      }
      if (U === "reply") {
        s.reply = X;
        continue;
      }
      if (U === "mention") {
        s.mentions.push(X);
        continue;
      }
      if (z) {
        s.root = X;
        continue;
      }
      if (Q) {
        s.reply = X;
        continue;
      }
      s.mentions.push(X);
    }
    return s;
  }
  var Of = {};
  Ln(Of, {
    getPow: () => Nf
  });
  function Nf(o) {
    return Mf(Fe.hexToBytes(o));
  }
  function Mf(o) {
    let s, l, u;
    for (l = 0, s = 0; l < o.length && (u = Rf(o[l]), s += u, u === 8); l++)
      ;
    return s;
  }
  function Rf(o) {
    let s = 0;
    if (o === 0) return 8;
    for (; o >>= 1; ) s++;
    return 7 - s;
  }
  var Bf = {};
  Ln(Bf, {
    BECH32_REGEX: () => fc,
    NOSTR_URI_REGEX: () => xo,
    parse: () => Pf,
    test: () => Uf
  });
  var fc = /[\x21-\x7E]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/, xo = new RegExp(`nostr:(${fc.source})`);
  function Uf(o) {
    return typeof o == "string" && new RegExp(`^${xo.source}$`).test(o);
  }
  function Pf(o) {
    const s = o.match(new RegExp(`^${xo.source}$`));
    if (!s) throw new Error(`Invalid Nostr URI: ${o}`);
    return {
      uri: s[0],
      value: s[1],
      decoded: bo(s[1])
    };
  }
  var zf = {};
  Ln(zf, {
    createDelegation: () => Hf,
    getDelegator: () => qf
  });
  function Hf(o, s) {
    let l = [];
    (s.kind || -1) >= 0 && l.push(`kind=${s.kind}`), s.until && l.push(`created_at<${s.until}`), s.since && l.push(`created_at>${s.since}`);
    let u = l.join("&");
    if (u === "") throw new Error("refusing to create a delegation without any conditions");
    let f = (0, zt.sha256)(wr.encode(`nostr:delegation:${s.pubkey}:${u}`)), p = Fe.bytesToHex(dn.signSync(f, o));
    return {
      from: oc(o),
      to: s.pubkey,
      cond: u,
      sig: p
    };
  }
  function qf(o) {
    let s = o.tags.find((y) => y[0] === "delegation" && y.length >= 4);
    if (!s) return null;
    let l = s[1], u = s[2], f = s[3], p = u.split("&");
    for (let y = 0; y < p.length; y++) {
      let [U, X, z] = p[y].split(/\b/);
      if (!(U === "kind" && X === "=" && o.kind === parseInt(z))) {
        if (U === "created_at" && X === "<" && o.created_at < parseInt(z)) continue;
        if (U === "created_at" && X === ">" && o.created_at > parseInt(z)) continue;
        return null;
      }
    }
    let _ = (0, zt.sha256)(wr.encode(`nostr:delegation:${o.pubkey}:${u}`));
    return dn.verifySync(f, _, l) ? l : null;
  }
  var jf = {};
  Ln(jf, {
    matchAll: () => Ff,
    regex: () => $a,
    replaceAll: () => Zf
  });
  var $a = () => new RegExp(`\\b${xo.source}\\b`, "g");
  function* Ff(o) {
    const s = o.matchAll($a());
    for (const l of s) {
      const [u, f] = l;
      yield {
        uri: u,
        value: f,
        decoded: bo(f),
        start: l.index,
        end: l.index + u.length
      };
    }
  }
  function Zf(o, s) {
    return o.replaceAll($a(), (l, u) => s({
      uri: l,
      value: u,
      decoded: bo(u)
    }));
  }
  var Vf = {};
  Ln(Vf, {
    useFetchImplementation: () => Wf,
    validateGithub: () => Gf
  });
  var ka;
  try {
    ka = fetch;
  } catch {
  }
  function Wf(o) {
    ka = o;
  }
  async function Gf(o, s, l) {
    try {
      return await (await ka(`https://gist.github.com/${s}/${l}/raw`)).text() === `Verifying that I control the following Nostr public key: ${o}`;
    } catch {
      return !1;
    }
  }
  var Kf = {};
  Ln(Kf, {
    authenticate: () => Qf
  });
  var Qf = async ({ challenge: o, relay: s, sign: l }) => {
    const u = {
      kind: 22242,
      created_at: Math.floor(Date.now() / 1e3),
      tags: [
        [
          "relay",
          s.url
        ],
        [
          "challenge",
          o
        ]
      ],
      content: ""
    }, f = s.auth(await l(u));
    return new Promise((p, _) => {
      f.on("ok", function y() {
        f.off("ok", y), p();
      }), f.on("failed", function y(U) {
        f.off("failed", y), _(U);
      });
    });
  }, Aa = {};
  Ln(Aa, {
    getZapEndpoint: () => Xf,
    makeZapReceipt: () => tp,
    makeZapRequest: () => Jf,
    useFetchImplementation: () => Yf,
    validateZapRequest: () => ep
  });
  var Sa;
  try {
    Sa = fetch;
  } catch {
  }
  function Yf(o) {
    Sa = o;
  }
  async function Xf(o) {
    try {
      let s = "", { lud06: l, lud16: u } = JSON.parse(o.content);
      if (l) {
        let { words: _ } = un.decode(l, 1e3), y = un.fromWords(_);
        s = Xr.decode(y);
      } else if (u) {
        let [_, y] = u.split("@");
        s = `https://${y}/.well-known/lnurlp/${_}`;
      } else return null;
      let p = await (await Sa(s)).json();
      if (p.allowsNostr && p.nostrPubkey) return p.callback;
    } catch {
    }
    return null;
  }
  function Jf({ profile: o, event: s, amount: l, relays: u, comment: f = "" }) {
    if (!l) throw new Error("amount not given");
    if (!o) throw new Error("profile not given");
    let p = {
      kind: 9734,
      created_at: Math.round(Date.now() / 1e3),
      content: f,
      tags: [
        [
          "p",
          o
        ],
        [
          "amount",
          l.toString()
        ],
        [
          "relays",
          ...u
        ]
      ]
    };
    return s && p.tags.push([
      "e",
      s
    ]), p;
  }
  function ep(o) {
    let s;
    try {
      s = JSON.parse(o);
    } catch {
      return "Invalid zap request JSON.";
    }
    if (!xa(s)) return "Zap request is not a valid Nostr event.";
    if (!ac(s)) return "Invalid signature on zap request.";
    let l = s.tags.find(([p, _]) => p === "p" && _);
    if (!l) return "Zap request doesn't have a 'p' tag.";
    if (!l[1].match(/^[a-f0-9]{64}$/)) return "Zap request 'p' tag is not valid hex.";
    let u = s.tags.find(([p, _]) => p === "e" && _);
    return u && !u[1].match(/^[a-f0-9]{64}$/) ? "Zap request 'e' tag is not valid hex." : s.tags.find(([p, _]) => p === "relays" && _) ? null : "Zap request doesn't have a 'relays' tag.";
  }
  function tp({ zapRequest: o, preimage: s, bolt11: l, paidAt: u }) {
    let p = JSON.parse(o).tags.filter(([y]) => y === "e" || y === "p" || y === "a"), _ = {
      kind: 9735,
      created_at: Math.round(u.getTime() / 1e3),
      content: "",
      tags: [
        ...p,
        [
          "bolt11",
          l
        ],
        [
          "description",
          o
        ]
      ]
    };
    return s && _.tags.push([
      "preimage",
      s
    ]), _;
  }
  Fe.hmacSha256Sync = (o, ...s) => (0, Yn.hmac)(zt.sha256, o, Fe.concatBytes(...s)), Fe.sha256Sync = (...o) => (0, zt.sha256)(Fe.concatBytes(...o));
  const np = (o) => _a.decode(o).data, pc = (o) => _a.decode(o).data;
  let gc = {};
  const rp = async (o) => {
    if (gc[o]) return gc[o];
    const s = new uc(), l = [
      "wss://relay.nostr.band",
      "wss://purplepag.es",
      "wss://relay.damus.io",
      "wss://nostr.wine"
    ];
    try {
      return await s.get(l, {
        authors: [
          o
        ],
        kinds: [
          0
        ]
      });
    } catch {
      throw new Error("failed to fetch user profile :(");
    } finally {
      s.close(l);
    }
  }, sp = (o) => JSON.parse(o.content), ip = async (o) => {
    const s = await Aa.getZapEndpoint(o);
    if (!s) throw new Error("failed to retrieve zap endpoint :(");
    return s;
  }, op = async (o, s) => {
    if (vc() && !s) try {
      return await window.nostr.signEvent(o);
    } catch {
    }
    return tf(o, Yh());
  }, ap = async ({ profile: o, nip19Target: s, amount: l, relays: u, comment: f, anon: p }) => {
    const _ = Aa.makeZapRequest({
      profile: o,
      event: s && s.startsWith("note") ? pc(s) : void 0,
      amount: l,
      relays: u,
      comment: f
    }), y = s && s.startsWith("naddr") ? pc(s) : void 0;
    if (y) {
      const U = y.relays ? y.relays.reduce((X, z) => `${z},${X}`, "") : "";
      _.tags.push([
        "a",
        `${y.kind}:${y.pubkey}:${y.identifier}`,
        U
      ]);
    }
    return (!vc() || p) && _.tags.push([
      "anon"
    ]), op(_, p);
  }, lp = async ({ zapEndpoint: o, amount: s, comment: l, authorId: u, nip19Target: f, normalizedRelays: p, anon: _ }) => {
    const y = await ap({
      profile: u,
      nip19Target: f,
      amount: s,
      relays: p,
      comment: l,
      anon: _
    });
    let U = `${o}?amount=${s}&nostr=${encodeURIComponent(JSON.stringify(y))}`;
    l && (U = `${U}&comment=${encodeURIComponent(l)}`);
    const X = await fetch(U), { pr: z, reason: Q, status: w } = await X.json();
    if (z) return z;
    throw w === "ERROR" ? new Error(Q ?? "Unable to fetch invoice") : new Error("Unable to fetch invoice");
  }, vc = () => window !== void 0 && window.nostr !== void 0, cp = ({ relays: o, invoice: s, onSuccess: l }) => {
    const u = new uc(), f = Array.from(/* @__PURE__ */ new Set([
      ...o,
      "wss://relay.nostr.band"
    ])), p = () => {
      u && u.close(f);
    }, _ = Math.round(Date.now() / 1e3), y = setInterval(() => {
      u.sub(f, [
        {
          kinds: [
            9735
          ],
          since: _
        }
      ]).on("event", (X) => {
        X.tags.find((z) => z[0] === "bolt11" && z[1] === s) && (l(), p(), clearInterval(y));
      });
    }, 5e3);
    return () => {
      p(), clearInterval(y);
    };
  }, bc = "nostrZap.", mc = "lightningUri", yc = () => typeof localStorage < "u", dp = (o) => {
    if (yc())
      return localStorage.getItem(`${bc}${o}`);
  }, up = (o, s) => {
    yc() && localStorage.setItem(`${bc}${o}`, s);
  }, hp = () => dp(mc), fp = (o) => up(mc, o);
  let Ca = null;
  const pp = (o) => {
    o = o.replace(/^#/, ""), o.length === 3 && (o = o.split("").map((p) => p + p).join(""));
    const s = parseInt(o, 16), l = s >> 16 & 255, u = s >> 8 & 255, f = s & 255;
    return {
      r: l,
      g: u,
      b: f
    };
  }, gp = ({ r: o, g: s, b: l }) => (o * 299 + s * 587 + l * 114) / 1e3, wc = (o) => {
    const s = pp(o);
    return gp(s) < 128 ? "#fff" : "#000";
  }, Ia = (o) => {
    const s = document.createElement("dialog");
    return s.classList.add("nostr-zap-dialog"), s.innerHTML = o, s.addEventListener("click", function({ clientX: l, clientY: u }) {
      const { left: f, right: p, top: _, bottom: y } = s.getBoundingClientRect();
      l === 0 && u === 0 || (l < f || l > p || u < _ || u > y) && s.close();
    }), Ca.appendChild(s), s;
  }, vp = ({ dialogHeader: o, invoice: s, relays: l, buttonColor: u }) => {
    const f = hp(), _ = Ia(`
        <button class="close-button">X</button>
        ${o}
        <div class="qrcode">
          <div class="overlay">copied invoice to clipboard</div>
        </div>
        <p>click QR code to copy invoice</p>
        <select name="lightning-wallet">
          ${[
      {
        label: "Default Wallet",
        value: "lightning:"
      },
      {
        label: "Strike",
        value: "strike:lightning:"
      },
      {
        label: "Cash App",
        value: "https://cash.app/launch/lightning/"
      },
      {
        label: "Muun",
        value: "muun:"
      },
      {
        label: "Blue Wallet",
        value: "bluewallet:lightning:"
      },
      {
        label: "Wallet of Satoshi",
        value: "walletofsatoshi:lightning:"
      },
      {
        label: "Zebedee",
        value: "zebedee:lightning:"
      },
      {
        label: "Zeus LN",
        value: "zeusln:lightning:"
      },
      {
        label: "Phoenix",
        value: "phoenix://"
      },
      {
        label: "Breez",
        value: "breez:"
      },
      {
        label: "Bitcoin Beach",
        value: "bitcoinbeach://"
      },
      {
        label: "Blixt",
        value: "blixtwallet:lightning:"
      },
      {
        label: "River",
        value: "river://"
      }
    ].map(({ label: w, value: k }) => `<option value="${k}" ${f === k ? "selected" : ""}>${w}</option>`).join("")}
        </select>
        <button class="cta-button"
          ${u ? `style="background-color: ${u}; color: ${wc(u)}"` : ""} 
        >Open Wallet</button>
      `), y = _.querySelector(".qrcode"), U = _.querySelector('select[name="lightning-wallet"]'), X = _.querySelector(".cta-button"), z = y.querySelector(".overlay"), Q = cp({
      relays: l,
      invoice: s,
      onSuccess: () => {
        _.close();
      }
    });
    return new (/* @__PURE__ */ e(a))(y, {
      text: s,
      quietZone: 10
    }), y.addEventListener("click", function() {
      navigator.clipboard.writeText(s), z.classList.add("show"), setTimeout(() => z.classList.remove("show"), 2e3);
    }), X.addEventListener("click", function() {
      fp(U.value), window.location.href = `${U.value}${s}`;
    }), _.addEventListener("close", function() {
      Q(), _.remove();
    }), _.querySelector(".close-button").addEventListener("click", function() {
      _.close();
    }), _;
  }, bp = async ({ npub: o, nip19Target: s, relays: l, buttonColor: u, anon: f }) => {
    const p = (Ie) => `${Ie.substring(0, 12)}...${Ie.substring(Ie.length - 12)}`, _ = l ? l.split(",") : [
      "wss://relay.nostr.band",
      "wss://relay.damus.io",
      "wss://nos.lol"
    ], y = np(o), U = rp(y), X = "https://pbs.twimg.com/profile_images/1604195803748306944/LxHDoJ7P_400x400.jpg", z = async () => {
      const { picture: Ie, display_name: Me, name: vt } = sp(await U);
      return `
      <h2>${Me || vt}</h2>
        <img
          src="${Ie || X}"
          width="80"
          height="80"
          alt="nostr user avatar"
        />
      <p>${p(s || o)}</p>
    `;
    }, Q = Ia(`
      <button class="close-button">X</button>
      <div class="dialog-header-container">
        <h2 class="skeleton-placeholder"></h2>
          <img
            src="${X}"
            width="80"
            height="80"
            alt="placeholder avatar"
          />
        <p class="skeleton-placeholder"></p>
      </div>
      <div class="preset-zap-options-container">
        <button data-value="21">21 ⚡️</button>
        <button data-value="69">69 ⚡️</button>
        <button data-value="420">420 ⚡️</button>
        <button data-value="1337">1337 ⚡️</button>
        <button data-value="5000">5k ⚡️</button>
        <button data-value="10000">10k ⚡️</button>
        <button data-value="21000">21k ⚡️</button>
        <button data-value="1000000">1M ⚡️</button>
      </div>
      <form>
        <input name="amount" type="number" placeholder="amount in sats" required />
        <input name="comment" placeholder="optional comment" />
        <button class="cta-button" 
          ${u ? `style="background-color: ${u}; color: ${wc(u)}"` : ""} 
          type="submit" disabled>Zap</button>
      </form>
    `), w = Q.querySelector(".preset-zap-options-container"), k = Q.querySelector("form"), R = Q.querySelector('input[name="amount"]'), W = Q.querySelector('input[name="comment"]'), ne = Q.querySelector('button[type="submit"]'), ie = Q.querySelector(".dialog-header-container"), be = (Ie) => {
      Q.close(), xc(Ie, o).showModal();
    };
    z().then((Ie) => {
      ie.innerHTML = Ie, ne.disabled = !1;
    }).catch(be);
    const fe = () => {
      ne.disabled = !0, ne.innerHTML = '<div class="spinner">Loading</div>';
    }, Ae = () => {
      ne.disabled = !1, ne.innerHTML = "Zap";
    }, xe = (Ie) => {
      R.value = Ie;
    };
    Q.addEventListener("close", function() {
      Ae(), k.reset();
    }), Q.querySelector(".close-button").addEventListener("click", function() {
      Q.close();
    }), w.addEventListener("click", function(Ie) {
      Ie.target.matches("button") && (xe(Ie.target.getAttribute("data-value")), R.focus());
    });
    const we = U.then(ip);
    return k.addEventListener("submit", async function(Ie) {
      Ie.preventDefault(), fe();
      const Me = Number(R.value) * 1e3, vt = W.value;
      try {
        const O = await lp({
          zapEndpoint: await we,
          amount: Me,
          comment: vt,
          authorId: y,
          nip19Target: s,
          normalizedRelays: _,
          anon: f
        }), M = async () => {
          const I = vp({
            dialogHeader: await z(),
            invoice: O,
            relays: _,
            buttonColor: u
          }), j = I.querySelector(".cta-button");
          Q.close(), I.showModal(), j.focus();
        };
        if (window.webln) try {
          await window.webln.enable(), await window.webln.sendPayment(O), Q.close();
        } catch {
          M();
        }
        else M();
      } catch (O) {
        be(O);
      }
    }), Q;
  }, xc = (o, s) => {
    const l = Ia(`
    <button class="close-button">X</button>
    <p class="error-message">${o}</p>
    <a href="https://nosta.me/${s}" target="_blank">
      <button class="cta-button">View Nostr Profile</button>
    </a>
  `);
    return l.addEventListener("close", function() {
      l.remove();
    }), l.querySelector(".close-button").addEventListener("click", function() {
      l.close();
    }), l;
  }, _c = async ({ npub: o, noteId: s, naddr: l, relays: u, cachedAmountDialog: f, buttonColor: p, anon: _ }) => {
    let y = f;
    try {
      return y || (y = await bp({
        npub: o,
        nip19Target: l || s,
        relays: u,
        buttonColor: p,
        anon: _
      })), y.showModal(), window.matchMedia("(max-height: 932px)").matches || y.querySelector('input[name="amount"]').focus(), y;
    } catch (U) {
      y && y.close(), xc(U, o).showModal();
    }
  }, Ec = (o) => {
    let s = null, l = null;
    o.addEventListener("click", async function() {
      const u = o.getAttribute("data-npub"), f = o.getAttribute("data-note-id"), p = o.getAttribute("data-naddr"), _ = o.getAttribute("data-relays"), y = o.getAttribute("data-button-color"), U = o.getAttribute("data-anon") === "true";
      l && (l.npub !== u || l.noteId !== f || l.naddr !== p || l.relays !== _ || l.buttonColor !== y || l.anon !== U) && (s = null), l = {
        npub: u,
        noteId: f,
        naddr: p,
        relays: _,
        buttonColor: y,
        anon: U
      }, s = await _c({
        npub: u,
        noteId: f,
        naddr: p,
        relays: _,
        cachedAmountDialog: s,
        buttonColor: y,
        anon: U
      });
    });
  }, $c = (o) => {
    document.querySelectorAll(o || "[data-npub]").forEach(Ec);
  };
  return (() => {
    const o = document.createElement("style");
    o.innerHTML = `
      .nostr-zap-dialog {
        width: 424px;
        min-width: 376px;
        margin: auto;
        box-sizing: content-box;
        border: none;
        border-radius: 10px;
        padding: 36px;
        text-align: center;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        background-color: white;
      }
      .nostr-zap-dialog[open],
      .nostr-zap-dialog form {
        display: block;
        max-width: fit-content;
      }
      .nostr-zap-dialog form {
        padding: 0;
        width: 100%;
      }
      .nostr-zap-dialog img {
        display: inline;
        border-radius: 50%;
      }
      .nostr-zap-dialog h2 {
        font-size: 1.5em;
        font-weight: bold;
        color: black;
      }
      .nostr-zap-dialog p {
        font-size: 1em;
        font-weight: normal;
        color: black;
      }
      .nostr-zap-dialog h2,
      .nostr-zap-dialog p,
      .nostr-zap-dialog .skeleton-placeholder {
        margin: 4px;
        word-wrap: break-word;
      }
      .nostr-zap-dialog button {
        background-color: inherit;
        padding: 12px 0;
        border-radius: 5px;
        border: none;
        font-size: 16px;
        cursor: pointer;
        border: 1px solid rgb(226, 232, 240);
        width: 100px;
        max-width: 100px;
        max-height: 52px;
        white-space: nowrap;
        color: black;
        box-sizing: border-box;
      }
      .nostr-zap-dialog button:hover {
        background-color: #edf2f7;
      }
      .nostr-zap-dialog button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .nostr-zap-dialog .cta-button {
        background-color: #7f00ff;
        color: #fff;
        width: 100%;
        max-width: 100%;
        margin-top: 16px;
      }
      .nostr-zap-dialog .cta-button:hover {
        background-color: indigo;
      }
      .nostr-zap-dialog .close-button {
        background-color: inherit;
        color: black;
        border-radius: 50%;
        width: 42px;
        height: 42px;
        position: absolute;
        top: 8px;
        right: 8px;
        padding: 12px;
        border: none;
      }
      .nostr-zap-dialog .preset-zap-options-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin: 24px 0 8px 0;
        height: 120px;
      }
      .nostr-zap-dialog input {
        padding: 12px;
        border-radius: 5px;
        border: none;
        font-size: 16px;
        width: 100%;
        max-width: 100%;
        background-color: #f7fafc;
        color: #1a202c;
        box-shadow: none;
        box-sizing: border-box;
        margin-bottom: 16px;
        border: 1px solid lightgray;
      }
      .nostr-zap-dialog .spinner {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .nostr-zap-dialog .spinner:after {
        content: " ";
        display: block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 4px solid #fff;
        border-color: #fff transparent #fff transparent;
        animation: nostr-zap-dialog-spinner 1.2s linear infinite;
        margin-left: 8px;
      }
      .nostr-zap-dialog .error-message {
        text-align: left;
        color: red;
        margin-top: 8px;
      }
      .nostr-zap-dialog .qrcode {
        position: relative;
        display: inline-block;
        margin-top: 24px;
      }
      .nostr-zap-dialog .qrcode .overlay {
        position: absolute;
        color: white;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(127, 17, 224, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
      }
      .nostr-zap-dialog .qrcode .overlay.show {
        opacity: 1;
      }
      @keyframes nostr-zap-dialog-spinner {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
      @keyframes nostr-zap-dialog-skeleton-pulse {
        0% {
          opacity: 0.6;
        }
        50% {
          opacity: 0.8;
        }
        100% {
          opacity: 0.6;
        }
      }
      .nostr-zap-dialog .skeleton-placeholder {
        animation-name: nostr-zap-dialog-skeleton-pulse;
        animation-duration: 1.5s;
        animation-iteration-count: infinite;
        animation-timing-function: ease-in-out;
        background-color: #e8e8e8;
        border-radius: 4px;
        margin: 4px auto;
      }
      .nostr-zap-dialog p.skeleton-placeholder {
        height: 20px;
        width: 200px;
      }
      .nostr-zap-dialog h2.skeleton-placeholder {
        height: 28px;
        width: 300px;
      }
      .nostr-zap-dialog select[name="lightning-wallet"] {
        appearance: none;
        background-color: white;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="%232D3748" width="24" height="24" viewBox="0 0 24 24"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" /></svg>');
        background-repeat: no-repeat;
        background-position: right 0.7rem center;
        background-size: 16px;
        border: 1px solid #CBD5E0;
        padding: 0.5rem 1rem;
        font-size: 1rem;
        border-radius: 0.25rem;
        width: 100%;
        margin-top: 24px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        cursor: pointer;
      }
      .nostr-zap-dialog select[name="lightning-wallet"]:focus {
        outline: none;
        border-color: #4FD1C5;
        box-shadow: 0 0 0 2px #4FD1C5;
      }
      @media only screen and (max-width: 480px) {
        .nostr-zap-dialog {
          padding: 18px;
        }

        .nostr-zap-dialog button {
          width: 92px;
          max-width: 92px;
        }
      }
      @media only screen and (max-width: 413px) {
        .nostr-zap-dialog {
          min-width: 324px;
        }
        .nostr-zap-dialog button {
          width: 78px;
          max-width: 78px;
        }
      }
  `;
    const s = document.createElement("div");
    document.body.appendChild(s), Ca = s.attachShadow({
      mode: "open"
    }), Ca.appendChild(o);
  })(), $c(), window.nostrZap = {
    init: _c,
    initTarget: Ec,
    initTargets: $c
  }, cd;
}
nb();
var rb = He('<div class="rotate-right-icon svg-icon svelte-1x7qm6n"></div> <span class="btn-text"> </span>', 1), sb = He('<span class="host-relay-note svelte-1x7qm6n"> </span>'), ib = He('<span class="relay-toggle-icon svelte-1x7qm6n" aria-label="toggle"><!></span> ', 1), ob = He('<span class="relay-check-icon svg-icon svelte-1x7qm6n" aria-hidden="true"></span>'), ab = He('<span class="relay-check-icon svg-icon svelte-1x7qm6n" aria-hidden="true"></span>'), lb = He('<div class="relay-copy-icon svg-icon svelte-1x7qm6n" aria-hidden="true"></div>'), cb = He('<li class="svelte-1x7qm6n"><span class="relay-url svelte-1x7qm6n"> </span> <span><!></span> <span><!></span> <div class="relay-copy-cell svelte-1x7qm6n"><!></div></li>'), db = He('<div class="relay-list-header svelte-1x7qm6n" aria-hidden="true"><span> </span> <span> </span> <span> </span> <span class="relay-copy-column" aria-hidden="true"></span></div> <ul class="svelte-1x7qm6n"></ul>', 1), ub = He('<span style="color: #888;"> </span>'), hb = He('<div class="relay-list svelte-1x7qm6n"><!></div>'), fb = He('<div class="setting-section"><div class="setting-row"><div class="setting-label-with-icon svelte-1x7qm6n"><span class="setting-menu-icon setting-menu-mask-icon relay-refresh-setting-icon svelte-1x7qm6n" aria-hidden="true"></span> <span class="setting-label"> </span></div> <div class="setting-control"><!></div></div> <div class="setting-info svelte-1x7qm6n"><!> <!> <!></div></div>');
const pb = {
  hash: "svelte-1x7qm6n",
  code: `.setting-label-with-icon.svelte-1x7qm6n {flex:1 1 auto;}.relay-refresh-setting-icon.svelte-1x7qm6n {mask-image:var(--ehagaki-icon-73796e635f323464705f4533453345335f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.setting-info.svelte-1x7qm6n {margin-inline-start:10px;.relay-toggle-label {min-height:44px;padding:10px;--btn-bg: transparent;}}.host-relay-note.svelte-1x7qm6n {display:block;margin:0 10px 4px;color:var(--text-light);font-size:0.8125rem;}.rotate-right-icon.svelte-1x7qm6n {mask-image:var(--ehagaki-icon-726566726573685f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.relay-list.svelte-1x7qm6n {margin-inline-start:10px;.relay-list-header:where(.svelte-1x7qm6n),
        li:where(.svelte-1x7qm6n) {display:grid;grid-template-columns:minmax(0, 1fr) 48px 52px 44px;align-items:center;column-gap:8px;}.relay-list-header:where(.svelte-1x7qm6n) {margin-top:6px;padding-bottom:4px;border-bottom:1px solid var(--border-hr);color:var(--text-light);font-size:0.8125rem;font-weight:600;}ul:where(.svelte-1x7qm6n) {margin:0;padding-inline-start:0;font-size:0.9375rem;list-style:none;}li:where(.svelte-1x7qm6n) {color:var(--text-light);padding:6px 0;border-bottom:1px solid var(--border-hr);}li:where(.svelte-1x7qm6n):last-child {border-bottom:none;}.relay-url:where(.svelte-1x7qm6n) {min-width:0;overflow-wrap:anywhere;}.relay-copy-cell:where(.svelte-1x7qm6n) {display:flex;justify-content:flex-end;min-width:0;}button.relay-copy-btn.copy {width:44px;height:44px;min-width:44px;min-height:44px;padding:0;}.relay-copy-icon:where(.svelte-1x7qm6n) {width:20px;height:20px;}.relay-capability:where(.svelte-1x7qm6n) {color:var(--text-light);font-weight:700;text-align:center;}.relay-capability.enabled:where(.svelte-1x7qm6n) {color:var(--theme);}.relay-check-icon:where(.svelte-1x7qm6n) {display:inline-block;width:20px;height:20px;vertical-align:middle;mask-image:var(--ehagaki-icon-636865636b5f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}}.relay-toggle-icon.svelte-1x7qm6n {font-size:1.2rem;color:gray;}`
};
function Bh(n, e) {
  Ns(e, !0), Mo(n, pb);
  const t = () => ls(Bo, "$_", r), [r, i] = Ro();
  let a = ht(e, "relayConfig", 7), c = ht(e, "showRelays", 7), d = ht(e, "onToggleShowRelays", 7), h = ht(e, "onRefreshRelaysAndProfile", 7), g = ht(e, "hostRelayConfigActive", 7, !1);
  function b(P) {
    return P ? Array.isArray(P) ? P.map((F) => ({
      url: Uc.normalizeRelayUrl(F),
      read: !0,
      write: !0
    })) : Object.entries(P).map(([F, Z]) => ({
      url: Uc.normalizeRelayUrl(F),
      read: Z.read,
      write: Z.write
    })) : [];
  }
  let m = Te(() => b(a()));
  async function v(P, F) {
    return F.stopPropagation(), Ip(P, "URL", navigator, window);
  }
  var D = {
    get relayConfig() {
      return a();
    },
    set relayConfig(P) {
      a(P), ft();
    },
    get showRelays() {
      return c();
    },
    set showRelays(P) {
      c(P), ft();
    },
    get onToggleShowRelays() {
      return d();
    },
    set onToggleShowRelays(P) {
      d(P), ft();
    },
    get onRefreshRelaysAndProfile() {
      return h();
    },
    set onRefreshRelaysAndProfile(P) {
      h(P), ft();
    },
    get hostRelayConfigActive() {
      return g();
    },
    set hostRelayConfigActive(P = !1) {
      g(P), ft();
    }
  }, C = fb(), E = L(C), N = L(E), V = G(L(N), 2), H = L(V, !0);
  T(V), T(N);
  var re = G(N, 2), de = L(re);
  {
    let P = Te(() => g() ? t()("settingsDialog.refresh_profile") || "プロフィール再取得" : t()("settingsDialog.refresh_relays_and_profile") || "再取得");
    jt(de, {
      variant: "default",
      shape: "rounded",
      contentLayout: "iconText",
      className: "refresh-relays-profile-btn",
      onClick: () => h()?.(),
      get ariaLabel() {
        return x(P);
      },
      children: (F, Z) => {
        var Y = rb(), se = wt(Y), pe = G(se, 2), ve = L(pe, !0);
        T(pe), Ue(
          (ce, Ee) => {
            Vn(se, "aria-label", ce), he(ve, Ee);
          },
          [
            () => g() ? t()("settingsDialog.refresh_profile") || "プロフィール再取得" : t()("settingsDialog.refresh") || "更新",
            () => g() ? t()("settingsDialog.refresh_profile") || "プロフィール再取得" : t()("settingsDialog.refresh") || "更新"
          ]
        ), ge(F, Y);
      },
      $$slots: { default: !0 }
    });
  }
  T(re), T(E);
  var ee = G(E, 2), te = L(ee);
  {
    var q = (P) => {
      var F = sb(), Z = L(F, !0);
      T(F), Ue((Y) => he(Z, Y), [
        () => t()("settingsDialog.host_relay_config") || "ホストから一時的に指定されています"
      ]), ge(P, F);
    };
    Et(te, (P) => {
      g() && P(q);
    });
  }
  var K = G(te, 2);
  {
    let P = Te(() => t()("settingsDialog.toggle_relay_list") || "リレーリストの表示切替");
    jt(K, {
      variant: "default",
      shape: "rounded",
      className: "relay-toggle-label",
      get onClick() {
        return d();
      },
      get "aria-pressed"() {
        return c();
      },
      get ariaLabel() {
        return x(P);
      },
      children: (F, Z) => {
        var Y = ib(), se = wt(Y), pe = L(se);
        {
          var ve = (me) => {
            var Ce = Ot("▼");
            ge(me, Ce);
          }, ce = (me) => {
            var Ce = Ot("▶");
            ge(me, Ce);
          };
          Et(pe, (me) => {
            c() ? me(ve) : me(ce, -1);
          });
        }
        T(se);
        var Ee = G(se);
        Ue((me) => he(Ee, ` ${me ?? ""}`), [() => t()("settingsDialog.relay_list") || "リレーリスト"]), ge(F, Y);
      },
      $$slots: { default: !0 }
    });
  }
  var S = G(K, 2);
  {
    var $ = (P) => {
      var F = hb(), Z = L(F);
      {
        var Y = (pe) => {
          var ve = db(), ce = wt(ve), Ee = L(ce), me = L(Ee, !0);
          T(Ee);
          var Ce = G(Ee, 2), je = L(Ce, !0);
          T(Ce);
          var Xe = G(Ce, 2), ke = L(Xe, !0);
          T(Xe), Ut(2), T(ce);
          var Ge = G(ce, 2);
          fr(Ge, 21, () => x(m), Cr, (pt, ae) => {
            var Je = cb(), Yt = L(Je), Pt = L(Yt, !0);
            T(Yt);
            var _n = G(Yt, 2);
            let En;
            var Pn = L(_n);
            {
              var Ve = (Ye) => {
                var Oe = ob();
                ge(Ye, Oe);
              }, it = (Ye) => {
                var Oe = Ot("–");
                ge(Ye, Oe);
              };
              Et(Pn, (Ye) => {
                x(ae).read ? Ye(Ve) : Ye(it, -1);
              });
            }
            T(_n);
            var bt = G(_n, 2);
            let _e;
            var Ke = L(bt);
            {
              var at = (Ye) => {
                var Oe = ab();
                ge(Ye, Oe);
              }, lt = (Ye) => {
                var Oe = Ot("–");
                ge(Ye, Oe);
              };
              Et(Ke, (Ye) => {
                x(ae).write ? Ye(at) : Ye(lt, -1);
              });
            }
            T(bt);
            var gt = G(bt, 2), dt = L(gt);
            {
              let Ye = Te(() => `${t()("settingsDialog.copy_relay_url") || "リレーURLをコピー"}: ${x(ae).url}`), Oe = Te(() => t()("common.copySuccess"));
              jt(dt, {
                variant: "copy",
                shape: "circle",
                className: "relay-copy-btn",
                get ariaLabel() {
                  return x(Ye);
                },
                onClick: ($t) => v(x(ae).url, $t),
                get floatingMessage() {
                  return x(Oe);
                },
                children: ($t, Mt) => {
                  var Zt = lb();
                  ge($t, Zt);
                },
                $$slots: { default: !0 }
              });
            }
            T(gt), T(Je), Ue(
              (Ye, Oe) => {
                he(Pt, x(ae).url), En = Ja(_n, 1, "relay-capability svelte-1x7qm6n", null, En, { enabled: x(ae).read }), Vn(_n, "aria-label", Ye), _e = Ja(bt, 1, "relay-capability svelte-1x7qm6n", null, _e, { enabled: x(ae).write }), Vn(bt, "aria-label", Oe);
              },
              [
                () => x(ae).read ? t()("settingsDialog.relay_read_enabled") || "Read enabled" : t()("settingsDialog.relay_read_disabled") || "Read disabled",
                () => x(ae).write ? t()("settingsDialog.relay_write_enabled") || "Write enabled" : t()("settingsDialog.relay_write_disabled") || "Write disabled"
              ]
            ), ge(pt, Je);
          }), T(Ge), Ue(
            (pt, ae, Je) => {
              he(me, pt), he(je, ae), he(ke, Je);
            },
            [
              () => t()("settingsDialog.relay") || "リレー",
              () => t()("settingsDialog.relay_read") || "Read",
              () => t()("settingsDialog.relay_write") || "Write"
            ]
          ), ge(pe, ve);
        }, se = (pe) => {
          var ve = ub(), ce = L(ve, !0);
          T(ve), Ue((Ee) => he(ce, Ee), [() => t()("settingsDialog.no_relay_info") || "リレー情報なし"]), ge(pe, ve);
        };
        Et(Z, (pe) => {
          x(m).length > 0 ? pe(Y) : pe(se, -1);
        });
      }
      T(F), ge(P, F);
    };
    Et(S, (P) => {
      c() && P($);
    });
  }
  T(ee), T(C), Ue((P) => he(H, P), [
    () => g() ? t()("settingsDialog.refresh_profile") || "プロフィール再取得" : t()("settingsDialog.refresh_relays_and_profile") || "リレーリスト・プロフィール再取得"
  ]), ge(n, C);
  var A = Ms(D);
  return i(), A;
}
Rs(
  Bh,
  {
    relayConfig: {},
    showRelays: {},
    onToggleShowRelays: {},
    onRefreshRelaysAndProfile: {},
    hostRelayConfigActive: {}
  },
  [],
  [],
  { mode: "open" }
);
var gb = He('<table class="popover-table svelte-7juqqk"><thead class="svelte-7juqqk"><tr class="svelte-7juqqk"><th class="svelte-7juqqk"> </th><th class="svelte-7juqqk"> </th><th class="svelte-7juqqk"> </th></tr></thead><tbody class="svelte-7juqqk"><tr class="svelte-7juqqk"><td class="svelte-7juqqk"> </td><td class="svelte-7juqqk"> </td><td class="svelte-7juqqk"> </td></tr><tr class="svelte-7juqqk"><td class="svelte-7juqqk"> </td><td class="svelte-7juqqk"> </td><td class="svelte-7juqqk"> </td></tr><tr class="svelte-7juqqk"><td class="svelte-7juqqk"> </td><td class="svelte-7juqqk"> </td><td class="svelte-7juqqk"> </td></tr></tbody></table> <p class="popover-note svelte-7juqqk"> </p>', 1), vb = He('<div class="radio-pair svelte-7juqqk"></div>'), bb = He('<table class="popover-table svelte-7juqqk"><thead class="svelte-7juqqk"><tr class="svelte-7juqqk"><th class="svelte-7juqqk"> </th><th class="svelte-7juqqk"> </th></tr></thead><tbody class="svelte-7juqqk"><tr class="svelte-7juqqk"><td class="svelte-7juqqk"> </td><td class="svelte-7juqqk"> </td></tr><tr class="svelte-7juqqk"><td class="svelte-7juqqk"> </td><td class="svelte-7juqqk"> </td></tr><tr class="svelte-7juqqk"><td class="svelte-7juqqk"> </td><td class="svelte-7juqqk"> </td></tr></tbody></table>'), mb = He('<div class="radio-pair svelte-7juqqk"></div>'), yb = He('<div class="setting-section svelte-7juqqk"><div class="setting-row compression-setting-row svelte-7juqqk"><div class="setting-label-wrapper svelte-7juqqk"><div class="setting-label-with-icon svelte-7juqqk"><span class="setting-menu-icon setting-menu-mask-icon image-quality-icon svelte-7juqqk" aria-hidden="true"></span> <span class="setting-label"> </span></div> <!></div> <!></div></div> <div class="setting-section svelte-7juqqk"><div class="setting-row compression-setting-row svelte-7juqqk"><div class="setting-label-wrapper svelte-7juqqk"><div class="setting-label-with-icon svelte-7juqqk"><span class="setting-menu-icon setting-menu-mask-icon video-quality-icon svelte-7juqqk" aria-hidden="true"></span> <span class="setting-label"> </span></div> <!></div> <!></div></div>', 1);
const wb = {
  hash: "svelte-7juqqk",
  code: `.setting-label-wrapper.svelte-7juqqk {display:flex;align-items:center;gap:4px;flex-wrap:wrap;flex:1 1 auto;min-width:0;}.setting-label-with-icon.svelte-7juqqk {flex:0 1 auto;max-width:calc(100% - 48px);}.image-quality-icon.svelte-7juqqk {mask-image:var(--ehagaki-icon-696d6167655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.video-quality-icon.svelte-7juqqk {mask-image:var(--ehagaki-icon-6d6f7669655f323464705f4533453345335f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}

    @media (max-width: 430px) {.compression-setting-row.svelte-7juqqk {flex-direction:column;align-items:stretch;gap:8px;}.compression-setting-row > .setting-control.radio-group {width:100%;justify-content:flex-end;margin-block:0;}
    }.popover-table {border-collapse:collapse;font-size:1rem;th.svelte-7juqqk,
        td.svelte-7juqqk {padding:4px 8px;text-align:start;}th.svelte-7juqqk {font-weight:600;border-bottom:1px solid var(--border);}td.svelte-7juqqk {font-weight:normal;}}.popover-note.svelte-7juqqk {max-width:320px;margin:8px 0 0;color:var(--text-secondary);font-size:0.875rem;line-height:1.5;}.radio-group {display:flex;gap:4px;flex-wrap:wrap;button {font-size:0.875rem;padding:10px;min-height:50px;min-width:44px;font-weight:normal;}}.radio-pair.svelte-7juqqk {display:flex;gap:4px;}`
};
function Uh(n, e) {
  Ns(e, !0), Mo(n, wb);
  const t = () => ls(Bo, "$_", r), [r, i] = Ro();
  let a = ht(e, "compressionPairs", 7), c = ht(e, "selectedCompression", 7), d = ht(e, "onCompressionChange", 7), h = ht(e, "videoCompressionPairs", 7), g = ht(e, "selectedVideoCompression", 7), b = ht(e, "onVideoCompressionChange", 7);
  var m = {
    get compressionPairs() {
      return a();
    },
    set compressionPairs(Z) {
      a(Z), ft();
    },
    get selectedCompression() {
      return c();
    },
    set selectedCompression(Z) {
      c(Z), ft();
    },
    get onCompressionChange() {
      return d();
    },
    set onCompressionChange(Z) {
      d(Z), ft();
    },
    get videoCompressionPairs() {
      return h();
    },
    set videoCompressionPairs(Z) {
      h(Z), ft();
    },
    get selectedVideoCompression() {
      return g();
    },
    set selectedVideoCompression(Z) {
      g(Z), ft();
    },
    get onVideoCompressionChange() {
      return b();
    },
    set onVideoCompressionChange(Z) {
      b(Z), ft();
    }
  }, v = yb(), D = wt(v), C = L(D), E = L(C), N = L(E), V = G(L(N), 2), H = L(V, !0);
  T(V), T(N);
  var re = G(N, 2);
  {
    let Z = Te(() => t()("settingsDialog.image_compression_settings_description"));
    $r(re, {
      side: "top",
      get ariaLabel() {
        return x(Z);
      },
      children: (Y, se) => {
        var pe = gb(), ve = wt(pe), ce = L(ve), Ee = L(ce), me = L(Ee), Ce = L(me, !0);
        T(me);
        var je = G(me), Xe = L(je, !0);
        T(je);
        var ke = G(je), Ge = L(ke, !0);
        T(ke), T(Ee), T(ce);
        var pt = G(ce), ae = L(pt), Je = L(ae), Yt = L(Je, !0);
        T(Je);
        var Pt = G(Je), _n = L(Pt);
        T(Pt);
        var En = G(Pt), Pn = L(En);
        T(En), T(ae);
        var Ve = G(ae), it = L(Ve), bt = L(it, !0);
        T(it);
        var _e = G(it), Ke = L(_e);
        T(_e);
        var at = G(_e), lt = L(at);
        T(at), T(Ve);
        var gt = G(Ve), dt = L(gt), Ye = L(dt, !0);
        T(dt);
        var Oe = G(dt), $t = L(Oe);
        T(Oe);
        var Mt = G(Oe), Zt = L(Mt);
        T(Mt), T(gt), T(pt), T(ve);
        var Vt = G(ve, 2), $n = L(Vt, !0);
        T(Vt), Ue(
          (Wt, In, Nt, Tt, Rt, _t, Lt, zn, bn, Tn) => {
            he(Ce, Wt), he(Xe, In), he(Ge, Nt), he(Yt, Tt), he(_n, `${Ks.high.maxWidthOrHeight}px`), he(Pn, `${Rt ?? ""}%`), he(bt, _t), he(Ke, `${Ks.medium.maxWidthOrHeight}px`), he(lt, `${Lt ?? ""}%`), he(Ye, zn), he($t, `${Ks.low.maxWidthOrHeight}px`), he(Zt, `${bn ?? ""}%`), he($n, Tn);
          },
          [
            () => t()("settingsDialog.info_header_setting"),
            () => t()("settingsDialog.info_header_pixels"),
            () => t()("settingsDialog.info_header_quality"),
            () => t()("settingsDialog.quality_high"),
            () => Math.round(Ks.high.initialQuality * 100),
            () => t()("settingsDialog.quality_medium"),
            () => Math.round(Ks.medium.initialQuality * 100),
            () => t()("settingsDialog.quality_low"),
            () => Math.round(Ks.low.initialQuality * 100),
            () => t()("settingsDialog.image_short_edge_protection_note", {
              values: {
                aspectRatio: Na.aspectRatioThreshold,
                pixels: Na.minShortEdge,
                megapixels: Na.maxMegapixels
              }
            })
          ]
        ), ge(Y, pe);
      },
      $$slots: { default: !0 }
    });
  }
  T(E);
  var de = G(E, 2);
  {
    let Z = Te(() => t()("settingsDialog.image_quality_setting"));
    en(de, () => el, (Y, se) => {
      se(Y, {
        class: "setting-control radio-group",
        name: "compression",
        orientation: "horizontal",
        get value() {
          return c();
        },
        get "aria-label"() {
          return x(Z);
        },
        get onValueChange() {
          return d();
        },
        children: (pe, ve) => {
          var ce = ln(), Ee = wt(ce);
          fr(Ee, 17, a, Cr, (me, Ce) => {
            var je = vb();
            fr(je, 21, () => x(Ce), Cr, (Xe, ke) => {
              Ni(Xe, {
                get value() {
                  return x(ke).value;
                },
                variant: "default",
                shape: "rounded",
                get ariaLabel() {
                  return x(ke).label;
                },
                children: (Ge, pt) => {
                  Ut();
                  var ae = Ot();
                  Ue(() => he(ae, x(ke).label)), ge(Ge, ae);
                },
                $$slots: { default: !0 }
              });
            }), T(je), ge(me, je);
          }), ge(pe, ce);
        },
        $$slots: { default: !0 }
      });
    });
  }
  T(C), T(D);
  var ee = G(D, 2), te = L(ee), q = L(te), K = L(q), S = G(L(K), 2), $ = L(S, !0);
  T(S), T(K);
  var A = G(K, 2);
  {
    let Z = Te(() => t()("settingsDialog.video_compression_settings_description"));
    $r(A, {
      side: "top",
      get ariaLabel() {
        return x(Z);
      },
      children: (Y, se) => {
        var pe = bb(), ve = L(pe), ce = L(ve), Ee = L(ce), me = L(Ee, !0);
        T(Ee);
        var Ce = G(Ee), je = L(Ce, !0);
        T(Ce), T(ce), T(ve);
        var Xe = G(ve), ke = L(Xe), Ge = L(ke), pt = L(Ge, !0);
        T(Ge);
        var ae = G(Ge), Je = L(ae);
        T(ae), T(ke);
        var Yt = G(ke), Pt = L(Yt), _n = L(Pt, !0);
        T(Pt);
        var En = G(Pt), Pn = L(En);
        T(En), T(Yt);
        var Ve = G(Yt), it = L(Ve), bt = L(it, !0);
        T(it);
        var _e = G(it), Ke = L(_e);
        T(_e), T(Ve), T(Xe), T(pe), Ue(
          (at, lt, gt, dt, Ye) => {
            he(me, at), he(je, lt), he(pt, gt), he(Je, `${Ma.high.maxSize ?? ""}px`), he(_n, dt), he(Pn, `${Ma.medium.maxSize ?? ""}px`), he(bt, Ye), he(Ke, `${Ma.low.maxSize ?? ""}px`);
          },
          [
            () => t()("settingsDialog.info_header_setting"),
            () => t()("settingsDialog.info_header_pixels"),
            () => t()("settingsDialog.quality_high"),
            () => t()("settingsDialog.quality_medium"),
            () => t()("settingsDialog.quality_low")
          ]
        ), ge(Y, pe);
      },
      $$slots: { default: !0 }
    });
  }
  T(q);
  var P = G(q, 2);
  {
    let Z = Te(() => t()("settingsDialog.video_quality_setting"));
    en(P, () => el, (Y, se) => {
      se(Y, {
        class: "setting-control radio-group",
        name: "videoCompression",
        orientation: "horizontal",
        get value() {
          return g();
        },
        get "aria-label"() {
          return x(Z);
        },
        get onValueChange() {
          return b();
        },
        children: (pe, ve) => {
          var ce = ln(), Ee = wt(ce);
          fr(Ee, 17, h, Cr, (me, Ce) => {
            var je = mb();
            fr(je, 21, () => x(Ce), Cr, (Xe, ke) => {
              Ni(Xe, {
                get value() {
                  return x(ke).value;
                },
                variant: "default",
                shape: "rounded",
                get ariaLabel() {
                  return x(ke).label;
                },
                children: (Ge, pt) => {
                  Ut();
                  var ae = Ot();
                  Ue(() => he(ae, x(ke).label)), ge(Ge, ae);
                },
                $$slots: { default: !0 }
              });
            }), T(je), ge(me, je);
          }), ge(pe, ce);
        },
        $$slots: { default: !0 }
      });
    });
  }
  T(te), T(ee), Ue(
    (Z, Y) => {
      he(H, Z), he($, Y);
    },
    [
      () => t()("settingsDialog.image_quality_setting"),
      () => t()("settingsDialog.video_quality_setting")
    ]
  ), ge(n, v);
  var F = Ms(m);
  return i(), F;
}
Rs(
  Uh,
  {
    compressionPairs: {},
    selectedCompression: {},
    onCompressionChange: {},
    videoCompressionPairs: {},
    selectedVideoCompression: {},
    onVideoCompressionChange: {}
  },
  [],
  [],
  { mode: "open" }
);
var xb = He("<option> </option>"), _b = He("<option> </option>"), Eb = He('<div class="url-clear-input-icon svg-icon svelte-odrb59" aria-hidden="true"></div>'), $b = He('<span class="form-error svelte-odrb59" role="alert"> </span>'), kb = He('<div class="destination-form svelte-odrb59"><label class="svelte-odrb59"><span> </span> <select class="svelte-odrb59"><option>custom</option><optgroup label="Blossom"></optgroup><optgroup label="NIP-96"></optgroup></select></label> <label class="svelte-odrb59"><span> </span> <select class="svelte-odrb59"><option>Blossom</option><option>NIP-96 legacy</option><option>Custom HTTP</option></select></label> <div class="url-field svelte-odrb59"><label for="upload-destination-url-input" class="svelte-odrb59"><span>URL</span></label> <div class="url-input-shell svelte-odrb59"><input id="upload-destination-url-input" class="upload-destination-url-input svelte-odrb59" inputmode="url"/> <!></div> <!></div> <div class="checkbox-group svelte-odrb59"><label class="checkbox-row svelte-odrb59"><input type="checkbox" class="svelte-odrb59"/> <span> </span></label> <label class="checkbox-row svelte-odrb59"><input type="checkbox" class="svelte-odrb59"/> <span> </span></label></div> <div class="form-actions svelte-odrb59"><!> <!></div></div>'), Ab = He('<span class="btn-text"> </span>'), Sb = He('<span class="badge default-badge svelte-odrb59"> </span>'), Cb = He('<span class="badge muted svelte-odrb59"> </span>'), Ib = He('<button type="button" class="mime-toggle svelte-odrb59"> </button>'), Tb = He('<span class="arrow-up-icon svg-icon svelte-odrb59"></span>'), Lb = He('<span class="arrow-down-icon svg-icon svelte-odrb59"></span>'), Db = He('<div class="blossom-test-popover svelte-odrb59"><p class="svelte-odrb59"> </p> <p class="svelte-odrb59"> </p></div>'), Ob = He("<div> </div>"), Nb = He('<div class="destination-row svelte-odrb59"><div class="destination-main svelte-odrb59"><div class="destination-content svelte-odrb59"><div class="destination-title svelte-odrb59"><span> </span> <!> <!></div> <div class="destination-meta svelte-odrb59"> </div> <div class="destination-meta mime-meta svelte-odrb59"><span> </span> <!></div></div> <div class="destination-order-actions svelte-odrb59"><!> <!></div></div> <div class="destination-actions svelte-odrb59"><!> <!> <!> <!> <!></div> <!></div> <!>', 1), Mb = He('<div class="bud03-popover svelte-odrb59"><p class="svelte-odrb59"> </p> <p class="svelte-odrb59"> </p> <p class="svelte-odrb59"> </p></div>'), Rb = He('<div class="test-result svelte-odrb59"> </div>'), Bb = He('<div class="panel-actions svelte-odrb59"><!> <!> <!> <!></div> <!>', 1), Ub = He('<div class="upload-panel svelte-odrb59"><!> <!></div>'), Pb = He('<div class="setting-section upload-destination-section svelte-odrb59"><div class="setting-row"><div class="setting-label-group"><div class="setting-label-with-icon"><span class="setting-menu-icon setting-menu-mask-icon upload-destination-setting-icon svelte-odrb59" aria-hidden="true"></span> <span class="upload-destination-label-copy svelte-odrb59"><span class="setting-label"> </span> <span class="upload-summary svelte-odrb59"> </span></span></div></div> <div class="setting-control"><!></div></div> <!></div>');
const zb = {
  hash: "svelte-odrb59",
  code: `.upload-destination-section.svelte-odrb59 {display:flex;flex-direction:column;gap:12px;}.upload-destination-setting-icon.svelte-odrb59 {mask-image:var(--ehagaki-icon-636c6f75645f75706c6f61645f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.upload-destination-label-copy.svelte-odrb59 {display:flex;flex-direction:column;min-width:0;}.upload-summary.svelte-odrb59,
    .destination-meta.svelte-odrb59 {color:var(--text-light);font-size:0.875rem;}.mime-meta.svelte-odrb59 {display:flex;align-items:baseline;flex-wrap:wrap;gap:6px;overflow-wrap:anywhere;}.mime-toggle.svelte-odrb59 {border:none;background:transparent;color:var(--link);cursor:pointer;font:inherit;padding:0;text-decoration:underline;}.upload-panel.svelte-odrb59 {display:flex;flex-direction:column;gap:12px;}.destination-row.svelte-odrb59,
    .destination-form.svelte-odrb59 {border:1px solid var(--border);border-radius:8px;padding:10px;display:flex;flex-direction:column;gap:8px;}.destination-title.svelte-odrb59 {display:flex;align-items:center;flex-wrap:wrap;gap:6px;font-weight:600;}.destination-main.svelte-odrb59 {display:flex;align-items:flex-start;justify-content:space-between;gap:8px;flex-wrap:wrap;}.destination-content.svelte-odrb59 {min-width:0;display:flex;flex:1 1 220px;flex-direction:column;gap:4px;}.destination-order-actions.svelte-odrb59 {display:flex;flex-shrink:0;gap:4px;.destination-order-button {display:inline-flex;align-items:center;justify-content:center;min-width:44px;min-height:44px;padding:0;}}.arrow-up-icon.svelte-odrb59 {mask-image:var(--ehagaki-icon-6172726f775f64726f705f75705f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.arrow-down-icon.svelte-odrb59 {mask-image:var(--ehagaki-icon-6172726f775f64726f705f646f776e5f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.badge.svelte-odrb59 {border:1px solid var(--border);border-radius:999px;padding:2px 7px;font-size:0.75rem;font-weight:400;}.badge.default-badge.svelte-odrb59 {background-color:var(--theme);border-color:var(--theme);color:white;font-weight:500;}.badge.muted.svelte-odrb59 {opacity:0.6;}.destination-actions.svelte-odrb59,
    .form-actions.svelte-odrb59,
    .panel-actions.svelte-odrb59 {display:flex;align-items:center;flex-wrap:wrap;gap:6px;}.test-result.svelte-odrb59 {font-size:0.875rem;color:var(--text-light);}.test-result.error.svelte-odrb59 {color:#c62828;}.form-error.svelte-odrb59 {color:#c62828;font-size:0.875rem;}.bud03-popover.svelte-odrb59 {display:flex;flex-direction:column;gap:8px;font-size:0.875rem;line-height:1.5;}.bud03-popover.svelte-odrb59 p:where(.svelte-odrb59) {margin:0;}.blossom-test-popover.svelte-odrb59 {display:flex;flex-direction:column;gap:8px;font-size:0.875rem;line-height:1.5;}.blossom-test-popover.svelte-odrb59 p:where(.svelte-odrb59) {margin:0;}label.svelte-odrb59 {display:flex;flex-direction:column;gap:4px;font-size:0.875rem;}.url-field.svelte-odrb59 {display:flex;flex-direction:column;gap:4px;font-size:0.875rem;}.url-input-shell.svelte-odrb59 {position:relative;display:flex;align-items:center;min-width:0;}.upload-destination-url-input.svelte-odrb59 {flex:1 1 auto;min-width:0;min-height:46px;padding:8px 47px 8px 10px;border:1px solid var(--border);border-radius:4px;background:var(--bg-input);color:var(--text);font:inherit;outline:none;}.upload-destination-url-input.svelte-odrb59:focus-visible {outline:2px solid var(--theme);outline-offset:-1px;}.ehagaki-app-root button.upload-destination-url-clear-button {position:absolute;inset-block:50%;inset-inline-end:2px;transform:translateY(-50%);display:inline-flex;align-items:center;justify-content:center;width:46px;height:46px;padding:0;--btn-bg: transparent;background-color:transparent;background-image:none;border:none;color:var(--text-muted);z-index:1;}.ehagaki-app-root button.upload-destination-url-clear-button:hover:not(:disabled),
    .ehagaki-app-root button.upload-destination-url-clear-button:active:not(:disabled),
    .ehagaki-app-root button.upload-destination-url-clear-button:focus-visible,
    .ehagaki-app-root button.upload-destination-url-clear-button:disabled {--btn-bg: transparent;background-color:transparent;background-image:none;border:none;color:var(--text-muted);}.ehagaki-app-root button.upload-destination-url-clear-button:focus-visible {outline:2px solid var(--theme);outline-offset:2px;}.upload-destination-url-clear-button .svg-icon {--svg: currentColor;width:24px;height:24px;}.url-clear-input-icon.svelte-odrb59 {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.checkbox-group.svelte-odrb59 {display:flex;align-items:center;flex-wrap:wrap;gap:16px;}.checkbox-row.svelte-odrb59 {flex-direction:row;align-items:center;gap:8px;min-height:32px;}.checkbox-row.svelte-odrb59 input[type="checkbox"]:where(.svelte-odrb59) {width:24px;height:24px;min-height:24px;margin:0;padding:0;accent-color:var(--theme);}input.svelte-odrb59,
    select.svelte-odrb59 {width:100%;min-height:42px;padding:8px 10px;border:1px solid var(--border);border-radius:4px;background:var(--bg-input);color:var(--text);font:inherit;font-size:1rem;}input.svelte-odrb59:focus-visible,
    select.svelte-odrb59:focus-visible {outline:2px solid var(--theme);outline-offset:-1px;}`
};
function Ph(n, e) {
  Ns(e, !0), Mo(n, zb);
  const t = () => ls(Bo, "$_", r), [r, i] = Ro(), a = (_e) => {
    var Ke = kb(), at = L(Ke), lt = L(at), gt = L(lt, !0);
    T(lt);
    var dt = G(lt, 2), Ye = L(dt);
    Ye.value = Ye.__value = "custom";
    var Oe = G(Ye);
    fr(Oe, 21, () => q, Cr, (rt, kt) => {
      var mt = xb(), sn = L(mt, !0);
      T(mt);
      var Ze = {};
      Ue(() => {
        he(sn, x(kt).name), Ze !== (Ze = x(kt).id) && (mt.value = (mt.__value = x(kt).id) ?? "");
      }), ge(rt, mt);
    }), T(Oe);
    var $t = G(Oe);
    fr($t, 21, () => K, Cr, (rt, kt) => {
      var mt = _b(), sn = L(mt, !0);
      T(mt);
      var Ze = {};
      Ue(() => {
        he(sn, x(kt).name), Ze !== (Ze = x(kt).id) && (mt.value = (mt.__value = x(kt).id) ?? "");
      }), ge(rt, mt);
    }), T($t), T(dt);
    var Mt;
    tl(dt), T(at);
    var Zt = G(at, 2), Vt = L(Zt), $n = L(Vt, !0);
    T(Vt);
    var Wt = G(Vt, 2), In = L(Wt);
    In.value = In.__value = "blossom";
    var Nt = G(In);
    Nt.value = Nt.__value = "nip96";
    var Tt = G(Nt);
    Tt.value = Tt.__value = "custom-http", T(Wt), T(Zt);
    var Rt = G(Zt, 2), _t = G(L(Rt), 2), Lt = L(_t);
    cs(Lt), Tp(Lt, (rt) => Se(m, rt), () => x(m));
    var zn = G(Lt, 2);
    {
      var bn = (rt) => {
        {
          let kt = Te(() => t()("clearInput") || "入力内容を消去");
          jt(rt, {
            type: "button",
            className: "upload-destination-url-clear-button",
            variant: "default",
            shape: "square",
            contentLayout: "icon",
            get ariaLabel() {
              return x(kt);
            },
            onClick: pe,
            get onmousedown() {
              return Lc;
            },
            get ontouchstart() {
              return Lc;
            },
            children: (mt, sn) => {
              var Ze = Eb();
              ge(mt, Ze);
            },
            $$slots: { default: !0 }
          });
        }
      }, Tn = Te(() => x(v).serverUrl.trim().length > 0);
      Et(zn, (rt) => {
        x(Tn) && rt(bn);
      });
    }
    T(_t);
    var sr = G(_t, 2);
    {
      var ir = (rt) => {
        var kt = $b(), mt = L(kt, !0);
        T(kt), Ue(() => he(mt, x(C))), ge(rt, kt);
      };
      Et(sr, (rt) => {
        x(C) && rt(ir);
      });
    }
    T(Rt);
    var Wn = G(Rt, 2), Hn = L(Wn), dn = L(Hn);
    cs(dn);
    var Bt = G(dn, 2), kn = L(Bt, !0);
    T(Bt), T(Hn);
    var An = G(Hn, 2), Fe = L(An);
    cs(Fe);
    var zt = G(Fe, 2), qn = L(zt, !0);
    T(zt), T(An), T(Wn);
    var et = G(Wn, 2), or = L(et);
    {
      let rt = Te(() => !x(v).serverUrl.trim());
      jt(or, {
        variant: "primary",
        shape: "rounded",
        onClick: ve,
        get disabled() {
          return x(rt);
        },
        children: (kt, mt) => {
          Ut();
          var sn = Ot();
          Ue((Ze) => he(sn, Ze), [() => t()("settingsDialog.uploadDestinationSave") || "保存"]), ge(kt, sn);
        },
        $$slots: { default: !0 }
      });
    }
    var vr = G(or, 2);
    jt(vr, {
      variant: "default",
      shape: "rounded",
      onClick: Z,
      children: (rt, kt) => {
        Ut();
        var mt = Ot();
        Ue((sn) => he(mt, sn), [() => t()("postComponent.cancel") || "キャンセル"]), ge(rt, mt);
      },
      $$slots: { default: !0 }
    }), T(et), T(Ke), Ue(
      (rt, kt, mt, sn) => {
        he(gt, rt), Mt !== (Mt = x(v).presetId) && (dt.value = (dt.__value = x(v).presetId) ?? "", nl(dt, x(v).presetId)), he($n, kt), he(kn, mt), he(qn, sn);
      },
      [
        () => t()("settingsDialog.uploadDestinationPreset") || "プリセット",
        () => t()("settingsDialog.uploadDestinationProtocol") || "Protocol",
        () => t()("settingsDialog.uploadDestinationEnabled") || "有効",
        () => t()("settingsDialog.uploadDestinationDefault") || "既定"
      ]
    ), hr("change", dt, (rt) => se(rt.currentTarget.value)), hr("change", Wt, () => Se(C, null)), Lp(Wt, () => x(v).protocol, (rt) => x(v).protocol = rt), hr("input", Lt, () => Se(C, null)), Dp(Lt, () => x(v).serverUrl, (rt) => x(v).serverUrl = rt), Ic(dn, () => x(v).enabled, (rt) => x(v).enabled = rt), Ic(Fe, () => x(v).isDefault, (rt) => x(v).isDefault = rt), ge(_e, Ke);
  };
  let c = ht(e, "rxNostr", 7, null);
  const d = {
    id: "",
    protocol: "blossom",
    serverUrl: "",
    presetId: "custom",
    enabled: !0,
    isDefault: !0
  };
  let h = nn(!1), g = nn(!1), b = nn(null), m = nn(null), v = nn(zr({ ...d })), D = nn(null), C = nn(null), E = nn(zr({})), N = Te(() => ur.value), V = nn(null), H = Te(() => os.value.isAuthenticated && os.value.pubkey || null), re = Te(() => !!(c() && x(H)));
  const de = new Map(Ra.map((_e) => [_e.id, _e])), ee = [
    "blossom-band",
    "cdn-nostrcheck-me",
    "nostr-download",
    "blossom-primal-net"
  ], te = [
    "nostr-build",
    "nostrcheck-me",
    "share-yabu-me",
    "nostpic-com",
    "files-sovbit-host"
  ], q = ee.map((_e) => de.get(_e)), K = te.map((_e) => de.get(_e));
  vd(() => {
    Se(V, x(H), !0), ur.load(x(V));
  }), Er(() => {
    x(V) !== x(H) && (Se(V, x(H), !0), ur.load(x(V)));
  });
  function S(_e) {
    if (!_e) return t()("settingsDialog.uploadDestinationUnknown") || "未確認";
    const Ke = ["B", "KB", "MB", "GB"];
    let at = _e, lt = 0;
    for (; at >= 1024 && lt < Ke.length - 1; )
      at /= 1024, lt += 1;
    return `${at.toFixed(at >= 10 || lt === 0 ? 0 : 1)} ${Ke[lt]}`;
  }
  function $(_e) {
    const Ke = _e.capabilities.supportedMimeTypes;
    return Ke.length ? x(E)[_e.id] || Ke.length <= 3 ? Ke.join(", ") : `${Ke.slice(0, 3).join(", ")} +${Ke.length - 3}` : t()("settingsDialog.uploadDestinationUnknown") || "未確認";
  }
  function A(_e) {
    return _e.capabilities.supportedMimeTypes.length > 3;
  }
  function P(_e) {
    Se(
      E,
      {
        ...x(E),
        [_e]: !x(E)[_e]
      },
      !0
    );
  }
  function F() {
    Se(v, { ...d }, !0), Se(C, null), Se(g, !0), Se(b, null), Se(h, !0);
  }
  function Z() {
    Se(g, !1), Se(b, null), Se(C, null);
  }
  function Y(_e) {
    if (x(b) === _e.id) {
      Z();
      return;
    }
    Se(
      v,
      {
        id: _e.id,
        protocol: _e.protocol,
        serverUrl: _e.serverUrl,
        presetId: _e.presetId ?? "custom",
        enabled: _e.enabled,
        isDefault: _e.isDefault
      },
      !0
    ), Se(C, null), Se(g, !0), Se(b, _e.id, !0), Se(h, !0);
  }
  function se(_e) {
    if (x(v).presetId = _e, Se(C, null), _e === "custom") {
      x(v).serverUrl = "";
      return;
    }
    const Ke = Ra.find((at) => at.id === _e);
    Ke && (x(v).protocol = Ke.protocol, x(v).serverUrl = Ke.serverUrl);
  }
  function pe() {
    x(v).serverUrl = "", x(v).presetId = "custom", Se(C, null), setTimeout(
      () => {
        x(m)?.focus({ preventScroll: !0 });
      },
      0
    );
  }
  async function ve() {
    const _e = Date.now(), Ke = Ra.find((Wt) => Wt.id === x(v).presetId), at = x(N).destinations.find((Wt) => Wt.id === x(v).id), lt = x(v).serverUrl || Ke?.serverUrl || "", gt = x(v).protocol;
    let dt = Op(lt);
    if (gt === "nip96")
      try {
        dt = Np(lt).url;
      } catch {
        Se(C, t()("settingsDialog.uploadDestinationInvalidNip96Url") || "有効な絶対 HTTP(S) URL を入力してください", !0);
        return;
      }
    Se(C, null);
    const Ye = Mp({ protocol: gt, presetId: x(v).presetId, serverUrl: dt }), Oe = gt === "nip96" ? Ye?.resolvedUploadUrl ?? null : null, $t = Rp({
      serverUrl: dt,
      resolvedUploadUrl: Oe,
      fallbackName: Ke?.name ?? at?.name ?? "Custom NIP-96",
      protocol: gt,
      presetId: x(v).presetId
    }), Mt = Ke && !at ? {
      ...Tc({
        preset: Ke,
        pubkeyHex: x(H),
        isDefault: x(v).isDefault || x(N).destinations.length === 0,
        now: _e
      }),
      name: $t,
      serverUrl: dt,
      enabled: x(v).enabled
    } : at ?? Tc({
      preset: Ke ?? {
        id: "custom",
        name: $t,
        protocol: x(v).protocol,
        serverUrl: x(v).serverUrl,
        capabilities: Bp
      },
      pubkeyHex: x(H),
      isDefault: x(v).isDefault || x(N).destinations.length === 0,
      now: _e
    }), {
      resolvedUploadUrl: Zt,
      ...Vt
    } = Mt, $n = {
      ...Vt,
      name: $t,
      protocol: gt,
      serverUrl: dt,
      presetId: x(v).presetId,
      enabled: x(v).enabled,
      isDefault: x(v).isDefault,
      updatedAt: _e,
      ...Oe ? { resolvedUploadUrl: Oe } : {}
    };
    await ur.save($n), Se(g, !1), Se(b, null);
  }
  async function ce(_e) {
    Se(D, _e.id, !0);
    try {
      await ur.test(_e);
    } finally {
      Se(D, null);
    }
  }
  async function Ee(_e) {
    x(b) === _e.id && (Se(g, !1), Se(b, null)), await ur.delete(_e.id, x(H));
  }
  async function me() {
    !c() || !x(H) || await ur.fetchBud03(c(), x(H));
  }
  async function Ce() {
    !c() || !x(H) || await ur.publishBud03(c(), x(H));
  }
  var je = {
    get rxNostr() {
      return c();
    },
    set rxNostr(_e = null) {
      c(_e), ft();
    }
  }, Xe = Pb(), ke = L(Xe), Ge = L(ke), pt = L(Ge), ae = G(L(pt), 2), Je = L(ae), Yt = L(Je, !0);
  T(Je);
  var Pt = G(Je, 2), _n = L(Pt, !0);
  T(Pt), T(ae), T(pt), T(Ge);
  var En = G(Ge, 2), Pn = L(En);
  jt(Pn, {
    variant: "default",
    shape: "rounded",
    contentLayout: "text",
    className: "upload-destination-manage-btn",
    onClick: () => Se(h, !x(h)),
    children: (_e, Ke) => {
      var at = Ab(), lt = L(at, !0);
      T(at), Ue((gt) => he(lt, gt), [
        () => x(h) ? t()("settingsDialog.uploadDestinationClose") || "閉じる" : t()("settingsDialog.uploadDestinationManage") || "管理"
      ]), ge(_e, at);
    },
    $$slots: { default: !0 }
  }), T(En), T(ke);
  var Ve = G(ke, 2);
  {
    var it = (_e) => {
      var Ke = Ub(), at = L(Ke);
      fr(at, 17, () => x(N).destinations, Cr, (Ye, Oe) => {
        var $t = Nb(), Mt = wt($t), Zt = L(Mt), Vt = L(Zt), $n = L(Vt), Wt = L($n), In = L(Wt, !0);
        T(Wt);
        var Nt = G(Wt, 2);
        {
          var Tt = (Ze) => {
            var le = Sb(), ut = L(le, !0);
            T(le), Ue((At) => he(ut, At), [
              () => t()("settingsDialog.uploadDestinationDefault") || "既定"
            ]), ge(Ze, le);
          };
          Et(Nt, (Ze) => {
            x(Oe).isDefault && Ze(Tt);
          });
        }
        var Rt = G(Nt, 2);
        {
          var _t = (Ze) => {
            var le = Cb(), ut = L(le, !0);
            T(le), Ue((At) => he(ut, At), [
              () => t()("settingsDialog.uploadDestinationDisabled") || "無効"
            ]), ge(Ze, le);
          };
          Et(Rt, (Ze) => {
            x(Oe).enabled || Ze(_t);
          });
        }
        T($n);
        var Lt = G($n, 2), zn = L(Lt);
        T(Lt);
        var bn = G(Lt, 2), Tn = L(bn), sr = L(Tn, !0);
        T(Tn);
        var ir = G(Tn, 2);
        {
          var Wn = (Ze) => {
            var le = Ib(), ut = L(le, !0);
            T(le), Ue((At) => he(ut, At), [
              () => x(E)[x(Oe).id] ? t()("settingsDialog.uploadDestinationMimeCollapse") || "折りたたむ" : t()("settingsDialog.uploadDestinationMimeExpand") || "すべて表示"
            ]), hr("click", le, () => P(x(Oe).id)), ge(Ze, le);
          }, Hn = Te(() => A(x(Oe)));
          Et(ir, (Ze) => {
            x(Hn) && Ze(Wn);
          });
        }
        T(bn), T(Vt);
        var dn = G(Vt, 2), Bt = L(dn);
        {
          let Ze = Te(() => t()("settingsDialog.uploadDestinationMoveUp") || "Up"), le = Te(() => x(N).destinations[0]?.id === x(Oe).id);
          jt(Bt, {
            variant: "default",
            shape: "rounded",
            className: "destination-order-button",
            get ariaLabel() {
              return x(Ze);
            },
            onClick: () => ur.move(x(Oe).id, "up", x(H)),
            get disabled() {
              return x(le);
            },
            children: (ut, At) => {
              var on = Tb();
              ge(ut, on);
            },
            $$slots: { default: !0 }
          });
        }
        var kn = G(Bt, 2);
        {
          let Ze = Te(() => t()("settingsDialog.uploadDestinationMoveDown") || "Down"), le = Te(() => x(N).destinations[x(N).destinations.length - 1]?.id === x(Oe).id);
          jt(kn, {
            variant: "default",
            shape: "rounded",
            className: "destination-order-button",
            get ariaLabel() {
              return x(Ze);
            },
            onClick: () => ur.move(x(Oe).id, "down", x(H)),
            get disabled() {
              return x(le);
            },
            children: (ut, At) => {
              var on = Lb();
              ge(ut, on);
            },
            $$slots: { default: !0 }
          });
        }
        T(dn), T(Zt);
        var An = G(Zt, 2), Fe = L(An);
        jt(Fe, {
          variant: "default",
          shape: "rounded",
          onClick: () => ur.setDefault(x(Oe).id, x(H)),
          get disabled() {
            return x(Oe).isDefault;
          },
          children: (Ze, le) => {
            Ut();
            var ut = Ot();
            Ue((At) => he(ut, At), [
              () => t()("settingsDialog.uploadDestinationSetDefault") || "既定"
            ]), ge(Ze, ut);
          },
          $$slots: { default: !0 }
        });
        var zt = G(Fe, 2);
        jt(zt, {
          variant: "default",
          shape: "rounded",
          onClick: () => Y(x(Oe)),
          children: (Ze, le) => {
            Ut();
            var ut = Ot();
            Ue((At) => he(ut, At), [
              () => x(g) && x(b) === x(Oe).id ? t()("settingsDialog.uploadDestinationClose") || "閉じる" : t()("settingsDialog.uploadDestinationEdit") || "編集"
            ]), ge(Ze, ut);
          },
          $$slots: { default: !0 }
        });
        var qn = G(zt, 2);
        {
          let Ze = Te(() => x(D) === x(Oe).id);
          jt(qn, {
            variant: "default",
            shape: "rounded",
            onClick: () => ce(x(Oe)),
            get disabled() {
              return x(Ze);
            },
            children: (le, ut) => {
              Ut();
              var At = Ot();
              Ue((on) => he(At, on), [
                () => x(D) === x(Oe).id ? t()("settingsDialog.uploadDestinationTesting") || "確認中" : t()("settingsDialog.uploadDestinationTest") || "接続テスト"
              ]), ge(le, At);
            },
            $$slots: { default: !0 }
          });
        }
        var et = G(qn, 2);
        {
          let Ze = Te(() => x(N).destinations.length <= 1);
          jt(et, {
            variant: "default",
            shape: "rounded",
            onClick: () => Ee(x(Oe)),
            get disabled() {
              return x(Ze);
            },
            children: (le, ut) => {
              Ut();
              var At = Ot();
              Ue((on) => he(At, on), [() => t()("settingsDialog.uploadDestinationDelete") || "削除"]), ge(le, At);
            },
            $$slots: { default: !0 }
          });
        }
        var or = G(et, 2);
        {
          var vr = (Ze) => {
            {
              let le = Te(() => t()("settingsDialog.uploadDestinationBlossomTestInfoLabel") || "Blossom 接続テストの説明");
              $r(Ze, {
                side: "top",
                sideOffset: 4,
                get ariaLabel() {
                  return x(le);
                },
                children: (ut, At) => {
                  var on = Db(), Dr = L(on), Us = L(Dr, !0);
                  T(Dr);
                  var Gr = G(Dr, 2), Ps = L(Gr, !0);
                  T(Gr), T(on), Ue(
                    (zs, di) => {
                      he(Us, zs), he(Ps, di);
                    },
                    [
                      () => t()("settingsDialog.uploadDestinationBlossomTestInfoNoUpload") || "このテストでは実際のファイルをアップロードせず、HEAD /upload でアップロード可否を確認します。",
                      () => t()("settingsDialog.uploadDestinationBlossomTestInfoAuthorization") || "Blossom の仕様上、確認に必要な署名で upload 権限が要求される場合があります。"
                    ]
                  ), ge(ut, on);
                },
                $$slots: { default: !0 }
              });
            }
          };
          Et(or, (Ze) => {
            x(Oe).protocol === "blossom" && Ze(vr);
          });
        }
        T(An);
        var rt = G(An, 2);
        {
          var kt = (Ze) => {
            var le = Ob();
            let ut;
            var At = L(le, !0);
            T(le), Ue(
              (on) => {
                ut = Ja(le, 1, "test-result svelte-odrb59", null, ut, {
                  error: !x(N).testResults[x(Oe).id].success
                }), he(At, on);
              },
              [
                () => x(N).testResults[x(Oe).id].message || (x(N).testResults[x(Oe).id].success ? t()("settingsDialog.uploadDestinationTestSuccess") || "接続テストに成功しました" : "")
              ]
            ), ge(Ze, le);
          };
          Et(rt, (Ze) => {
            (x(N).testResults[x(Oe).id]?.message || x(N).testResults[x(Oe).id]?.success) && Ze(kt);
          });
        }
        T(Mt);
        var mt = G(Mt, 2);
        {
          var sn = (Ze) => {
            a(Ze);
          };
          Et(mt, (Ze) => {
            x(g) && x(b) === x(Oe).id && Ze(sn);
          });
        }
        Ue(
          (Ze, le) => {
            he(In, x(Oe).name), he(zn, `${x(Oe).protocol ?? ""} / ${Ze ?? ""}`), he(sr, le);
          },
          [
            () => S(x(Oe).capabilities.maxUploadSize),
            () => $(x(Oe))
          ]
        ), ge(Ye, $t);
      });
      var lt = G(at, 2);
      {
        var gt = (Ye) => {
          a(Ye);
        }, dt = (Ye) => {
          var Oe = Bb(), $t = wt(Oe), Mt = L($t);
          jt(Mt, {
            variant: "default",
            shape: "rounded",
            onClick: F,
            children: (Nt, Tt) => {
              Ut();
              var Rt = Ot();
              Ue((_t) => he(Rt, _t), [() => t()("settingsDialog.uploadDestinationAdd") || "追加"]), ge(Nt, Rt);
            },
            $$slots: { default: !0 }
          });
          var Zt = G(Mt, 2);
          {
            let Nt = Te(() => !x(re) || x(N).bud03Fetching);
            jt(Zt, {
              variant: "default",
              shape: "rounded",
              onClick: me,
              get disabled() {
                return x(Nt);
              },
              children: (Tt, Rt) => {
                Ut();
                var _t = Ot();
                Ue((Lt) => he(_t, Lt), [
                  () => x(N).bud03Fetching ? t()("settingsDialog.uploadDestinationBud03Fetching") || "BUD-03 取得中" : t()("settingsDialog.uploadDestinationBud03Fetch") || "BUD-03 から取得"
                ]), ge(Tt, _t);
              },
              $$slots: { default: !0 }
            });
          }
          var Vt = G(Zt, 2);
          {
            let Nt = Te(() => !x(re) || x(N).bud03Publishing || !x(N).destinations.some((Tt) => Tt.protocol === "blossom" && Tt.enabled));
            jt(Vt, {
              variant: "default",
              shape: "rounded",
              onClick: Ce,
              get disabled() {
                return x(Nt);
              },
              children: (Tt, Rt) => {
                Ut();
                var _t = Ot();
                Ue((Lt) => he(_t, Lt), [
                  () => x(N).bud03Publishing ? t()("settingsDialog.uploadDestinationBud03Publishing") || "BUD-03 publish 中" : t()("settingsDialog.uploadDestinationBud03Publish") || "BUD-03 へ publish"
                ]), ge(Tt, _t);
              },
              $$slots: { default: !0 }
            });
          }
          var $n = G(Vt, 2);
          {
            let Nt = Te(() => t()("settingsDialog.uploadDestinationBud03InfoLabel") || "BUD-03 の説明");
            $r($n, {
              side: "top",
              get ariaLabel() {
                return x(Nt);
              },
              children: (Tt, Rt) => {
                var _t = Mb(), Lt = L(_t), zn = L(Lt, !0);
                T(Lt);
                var bn = G(Lt, 2), Tn = L(bn, !0);
                T(bn);
                var sr = G(bn, 2), ir = L(sr, !0);
                T(sr), T(_t), Ue(
                  (Wn, Hn, dn) => {
                    he(zn, Wn), he(Tn, Hn), he(ir, dn);
                  },
                  [
                    () => t()("settingsDialog.uploadDestinationBud03InfoScope") || "BUD-03 は Blossom のアップロード先だけを kind 10063 の server tag として保存します。NIP-96 と Custom HTTP は publish 対象外です。",
                    () => t()("settingsDialog.uploadDestinationBud03InfoOrder") || "publish 時は有効な Blossom アップロード先をこの一覧の順番で保存し、先頭のアップロード先が優先されます。",
                    () => t()("settingsDialog.uploadDestinationBud03InfoFetch") || "BUD-03 から取得すると、Blossom のアップロード先だけを取得結果で置き換えます。"
                  ]
                ), ge(Tt, _t);
              },
              $$slots: { default: !0 }
            });
          }
          T($t);
          var Wt = G($t, 2);
          {
            var In = (Nt) => {
              var Tt = Rb(), Rt = L(Tt, !0);
              T(Tt), Ue(() => he(Rt, x(N).bud03Status)), ge(Nt, Tt);
            };
            Et(Wt, (Nt) => {
              x(N).bud03Status && Nt(In);
            });
          }
          ge(Ye, Oe);
        };
        Et(lt, (Ye) => {
          x(g) && !x(b) ? Ye(gt) : x(g) || Ye(dt, 1);
        });
      }
      T(Ke), ge(_e, Ke);
    };
    Et(Ve, (_e) => {
      x(h) && _e(it);
    });
  }
  T(Xe), Ue(
    (_e, Ke) => {
      he(Yt, _e), he(_n, Ke);
    },
    [
      () => t()("settingsDialog.upload_destination") || "アップロード先",
      () => x(N).defaultDestination?.name || t()("settingsDialog.uploadDestinationNone") || "未設定"
    ]
  ), ge(n, Xe);
  var bt = Ms(je);
  return i(), bt;
}
yd(["change", "input", "click"]);
Rs(Ph, { rxNostr: {} }, [], [], { mode: "open" });
var Hb = He('<div class="xmark-icon svg-icon svelte-1ud3sov" aria-hidden="true"></div>'), qb = He('<div class="help-icon svg-icon svelte-1ud3sov" aria-hidden="true"></div>'), jb = He('<div class="github-icon svg-icon svelte-1ud3sov" aria-hidden="true"></div>'), Fb = He('<div class="rotate-right-icon svg-icon svelte-1ud3sov" aria-hidden="true"></div> <span class="btn-text svelte-1ud3sov"> </span>', 1), Zb = He('<div class="setting-section svelte-1ud3sov"><div class="setting-row sw-update-row svelte-1ud3sov"><div class="setting-control svelte-1ud3sov"><!></div></div></div>'), Vb = He('<span class="btn-text svelte-1ud3sov"> </span>'), Wb = He("<!> <!> <!>", 1), Gb = He('<span class="form-error svelte-1ud3sov" role="alert"> </span>'), Kb = He('<span class="form-error svelte-1ud3sov" role="alert"> </span>'), Qb = He('<div class="setting-section color-settings-section svelte-1ud3sov"><span class="setting-menu-icon setting-menu-mask-icon color-settings-icon svelte-1ud3sov" aria-hidden="true"></span> <div class="color-settings-content svelte-1ud3sov"><div class="setting-label-with-icon color-settings-heading svelte-1ud3sov"><span class="setting-label svelte-1ud3sov"> </span></div> <div class="color-setting-row svelte-1ud3sov"><div class="setting-label-group svelte-1ud3sov"><label class="setting-label svelte-1ud3sov" for="accent-color-input"> </label> <span class="setting-description svelte-1ud3sov"> </span></div> <div class="color-setting-controls svelte-1ud3sov"><input type="color" class="svelte-1ud3sov"/> <input id="accent-color-input" class="color-hex-input svelte-1ud3sov" type="text" inputmode="text" autocomplete="off"/></div></div> <!> <div class="color-setting-row svelte-1ud3sov"><div class="setting-label-group svelte-1ud3sov"><label class="setting-label svelte-1ud3sov" for="base-color-input"> </label> <span class="setting-description svelte-1ud3sov"> </span></div> <div class="color-setting-controls svelte-1ud3sov"><input type="color" class="svelte-1ud3sov"/> <input id="base-color-input" class="color-hex-input svelte-1ud3sov" type="text" inputmode="text" autocomplete="off" placeholder="#RRGGBB"/></div></div> <!> <!></div></div>'), Yb = He('<option class="svelte-1ud3sov"> </option>'), Xb = He('<label class="footer-shortcut-slot svelte-1ud3sov"><span class="svelte-1ud3sov"> </span> <select class="footer-shortcut-select svelte-1ud3sov"><option class="svelte-1ud3sov"> </option><!></select></label>'), Jb = He('<option class="svelte-1ud3sov"> </option>'), em = He('<span class="form-error svelte-1ud3sov" role="alert"> </span>'), tm = He('<div class="external-nostr-client-custom-url svelte-1ud3sov"><label for="external-nostr-client-custom-url-input" class="setting-label svelte-1ud3sov"> </label> <span id="external-nostr-client-custom-url-description" class="setting-description svelte-1ud3sov"> </span> <input id="external-nostr-client-custom-url-input" type="url" inputmode="url" aria-describedby="external-nostr-client-custom-url-description" class="svelte-1ud3sov"/> <!></div>'), nm = He('<div class="settings-header svelte-1ud3sov"><div class="first-row svelte-1ud3sov"><div class="site-title svelte-1ud3sov"><span class="site-name svelte-1ud3sov">eHagaki</span> <span class="cache-version svelte-1ud3sov"> </span></div> <div class="author-info svelte-1ud3sov"><span class="svelte-1ud3sov"> </span><a href="https://lokuyow.github.io/" target="_blank" rel="noopener noreferrer" class="svelte-1ud3sov"> </a></div></div> <div class="second-row svelte-1ud3sov"><!> <!> <div class="svelte-1ud3sov"><div class="zap-view-btn-group svelte-1ud3sov"><button class="zap-btn svelte-1ud3sov" data-npub="npub1a3pvwe2p3v7mnjz6hle63r628wl9w567aw7u23fzqs062v5vqcqqu3sgh3" data-note-id="naddr1qqxnzde4xsunzwpnxymrgwpsqgswcsk8v4qck0deepdtluag3a9rh0jh2d0wh0w9g53qg8a9x2xqvqqrqsqqql8kt67m30" data-relays="wss://nos.lol,wss://nostr.bitcoiner.social,wss://relay.nostr.wirednet.jp,wss://yabu.me">Support</button> <span class="divider svelte-1ud3sov"></span> <button class="view-btn svelte-1ud3sov" data-title="Thanks for the Support!" data-nzv-id="naddr1qqxnzde4xsunzwpnxymrgwpsqgswcsk8v4qck0deepdtluag3a9rh0jh2d0wh0w9g53qg8a9x2xqvqqrqsqqql8kt67m30" data-zap-color-mode="true" data-relay-urls="wss://nos.lol,wss://nostr.bitcoiner.social,wss://relay.nostr.wirednet.jp,wss://yabu.me">View</button></div></div></div></div> <div class="modal-body svelte-1ud3sov"><!> <div class="setting-section svelte-1ud3sov"><div class="setting-row svelte-1ud3sov"><div class="setting-label-with-icon svelte-1ud3sov"><span class="setting-menu-icon setting-menu-mask-icon language-setting-icon svelte-1ud3sov" aria-hidden="true"></span> <span class="setting-label svelte-1ud3sov"> </span></div> <div class="setting-control svelte-1ud3sov"><!></div></div></div> <!> <!> <div class="setting-section svelte-1ud3sov"><div class="setting-row svelte-1ud3sov"><div class="setting-label-with-icon svelte-1ud3sov"><span class="setting-menu-icon setting-menu-mask-icon theme-setting-icon svelte-1ud3sov" aria-hidden="true"></span> <span id="theme-mode-label" class="setting-label svelte-1ud3sov"> </span></div> <!></div></div> <!> <div class="setting-section svelte-1ud3sov"><div class="setting-row svelte-1ud3sov"><div class="setting-label-with-icon svelte-1ud3sov"><span class="setting-menu-icon setting-menu-mask-icon media-placement-setting-icon svelte-1ud3sov" aria-hidden="true"></span> <span id="media-free-placement-label" class="setting-label svelte-1ud3sov"> </span></div> <div class="setting-control svelte-1ud3sov"><!></div></div></div> <div class="hide-mascot-flavor-group svelte-1ud3sov"><div class="setting-section svelte-1ud3sov"><div class="setting-row setting-row-with-note svelte-1ud3sov"><div class="setting-label-group svelte-1ud3sov"><div class="setting-label-row svelte-1ud3sov"><div class="setting-label-with-icon svelte-1ud3sov"><img class="setting-menu-icon mascot-setting-icon svelte-1ud3sov" alt="" aria-hidden="true"/> <span id="hide-mascot-label" class="setting-label svelte-1ud3sov"> </span></div> <!></div></div> <div class="setting-control svelte-1ud3sov"><!></div></div></div> <div class="setting-section svelte-1ud3sov"><div class="setting-row setting-row-with-note svelte-1ud3sov"><div class="setting-label-group svelte-1ud3sov"><div class="setting-label-row svelte-1ud3sov"><div class="setting-label-with-icon svelte-1ud3sov"><span class="setting-menu-icon setting-menu-mask-icon flavor-setting-icon svelte-1ud3sov" aria-hidden="true"></span> <span id="hide-flavor-text-label" class="setting-label svelte-1ud3sov"> </span></div> <!></div></div> <div class="setting-control svelte-1ud3sov"><!></div></div></div></div> <div class="notification-group svelte-1ud3sov"><div class="setting-section svelte-1ud3sov"><div class="setting-row setting-row-with-note svelte-1ud3sov"><div class="setting-label-group svelte-1ud3sov"><div class="setting-label-row svelte-1ud3sov"><div class="setting-label-with-icon svelte-1ud3sov"><span class="setting-menu-icon setting-menu-mask-icon quote-setting-icon svelte-1ud3sov" aria-hidden="true"></span> <span id="quote-notification-label" class="setting-label svelte-1ud3sov"> </span></div> <!></div></div> <div class="setting-control svelte-1ud3sov"><!></div></div></div> <div class="setting-section svelte-1ud3sov"><div class="setting-row setting-row-with-note svelte-1ud3sov"><div class="setting-label-group svelte-1ud3sov"><div class="setting-label-row svelte-1ud3sov"><div class="setting-label-with-icon svelte-1ud3sov"><span class="setting-menu-icon setting-menu-mask-icon reply-setting-icon svelte-1ud3sov" aria-hidden="true"></span> <span id="reply-notification-label" class="setting-label svelte-1ud3sov"> </span></div> <!></div></div> <div class="setting-control svelte-1ud3sov"><!></div></div></div></div> <div class="setting-section svelte-1ud3sov"><div class="setting-row svelte-1ud3sov"><div class="setting-label-with-icon svelte-1ud3sov"><span class="setting-menu-icon setting-menu-mask-icon client-tag-setting-icon svelte-1ud3sov" aria-hidden="true"></span> <span id="client-tag-label" class="setting-label svelte-1ud3sov"> </span></div> <div class="setting-control svelte-1ud3sov"><!></div></div></div> <div class="setting-section svelte-1ud3sov"><div class="setting-row svelte-1ud3sov"><div class="setting-label-group svelte-1ud3sov"><div class="setting-label-row svelte-1ud3sov"><div class="setting-label-with-icon svelte-1ud3sov"><span class="setting-menu-icon setting-menu-mask-icon fail-closed-content-warning-setting-icon svelte-1ud3sov" aria-hidden="true"></span> <span id="fail-closed-content-warning-label" class="setting-label svelte-1ud3sov"> </span></div> <!></div></div> <div class="setting-control svelte-1ud3sov"><!></div></div></div> <div class="setting-section footer-shortcut-settings svelte-1ud3sov"><div class="setting-label-with-icon footer-shortcuts-setting-heading svelte-1ud3sov"><span class="setting-menu-icon setting-menu-mask-icon footer-shortcuts-setting-icon svelte-1ud3sov" aria-hidden="true"></span> <span class="setting-label svelte-1ud3sov"> </span></div> <div class="footer-shortcut-slots svelte-1ud3sov"></div></div> <div class="setting-section svelte-1ud3sov"><div class="setting-row setting-row-with-note svelte-1ud3sov"><div class="setting-label-group svelte-1ud3sov"><div class="setting-label-row svelte-1ud3sov"><div class="setting-label-with-icon svelte-1ud3sov"><span class="setting-menu-icon setting-menu-mask-icon external-nostr-client-setting-icon svelte-1ud3sov" aria-hidden="true"></span> <span id="external-nostr-client-label" class="setting-label svelte-1ud3sov"> </span></div> <!></div></div> <select class="setting-control external-nostr-client-select svelte-1ud3sov" id="external-nostr-client-select" aria-labelledby="external-nostr-client-label"></select></div> <!></div> <!></div>', 1);
const rm = {
  hash: "svelte-1ud3sov",
  code: `.settings-dialog :where(button:not(.bui-switch)) {min-inline-size:44px;min-block-size:44px;}

    /* SettingsDialog固有: paddingなしのdialog-content */.settings-dialog .dialog-content {padding:0;}.xmark-icon.svelte-1ud3sov {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.settings-header.svelte-1ud3sov {display:flex;flex-direction:column;align-items:center;justify-content:space-between;font-weight:bold;font-size:1.3rem;width:100%;padding:8px 12px;gap:2px;border-bottom:1px solid var(--border-hr);}.first-row.svelte-1ud3sov,
    .second-row.svelte-1ud3sov {display:flex;align-items:center;}.first-row.svelte-1ud3sov {justify-content:space-between;width:100%;gap:10px;}.second-row.svelte-1ud3sov {justify-content:flex-end;width:100%;gap:4px;}.site-title.svelte-1ud3sov {display:flex;align-items:baseline;gap:8px;.site-name:where(.svelte-1ud3sov) {font-size:1.5rem;font-weight:bold;letter-spacing:0.5px;}.cache-version:where(.svelte-1ud3sov) {font-size:1rem;color:var(--text-light);}}.github-link-btn.circle,
    .help-btn.circle {width:44px;height:44px;min-width:44px;min-height:44px;--btn-bg: var(--dialog-bg);}.github-link-btn.circle {.github-icon.svelte-1ud3sov {mask-image:var(--ehagaki-icon-6769746875622d6d61726b2e737667);width:26px;height:26px;}}.help-btn.circle {.help-icon {mask-image:var(--ehagaki-icon-68656c705f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);width:30px;height:30px;}}.zap-view-btn-group.svelte-1ud3sov {display:inline-flex;height:44px;min-height:44px;.zap-btn:where(.svelte-1ud3sov),
        .view-btn:where(.svelte-1ud3sov) {min-width:70px;min-height:44px;height:44px;background:var(--btn-bg);}.zap-btn:where(.svelte-1ud3sov) {border-radius:6px 0 0 6px;border-right-color:transparent;padding:0 10px 0 13px;}.divider:where(.svelte-1ud3sov) {width:1px;background-color:var(--border);}.view-btn:where(.svelte-1ud3sov) {border-radius:0 6px 6px 0;border-left-color:transparent;padding:0 14px 0 12px;}}.author-info.svelte-1ud3sov {display:flex;align-items:center;font-size:0.9375rem;color:var(--text-light);gap:4px;}.author-info.svelte-1ud3sov a:where(.svelte-1ud3sov) {color:var(--text-light);text-decoration:underline;}.modal-body.svelte-1ud3sov {padding:16px;display:flex;flex-direction:column;gap:20px;width:100%;overflow-y:auto;}.footer-shortcut-slots.svelte-1ud3sov {display:flex;flex-direction:column;gap:12px;padding-inline-start:calc(24px + var(--setting-label-icon-gap));}.footer-shortcut-slot.svelte-1ud3sov {display:flex;align-items:center;justify-content:space-between;gap:12px;}.footer-shortcut-select.svelte-1ud3sov {flex:0 1 260px;min-width:0;min-height:44px;padding:8px 32px 8px 10px;border:1px solid var(--border);border-radius:6px;background:var(--dialog-bg);color:var(--text);}.setting-label-with-icon.svelte-1ud3sov {flex:1 1 auto;}.language-setting-icon.svelte-1ud3sov {mask-image:var(--ehagaki-icon-7472616e736c6174655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.theme-setting-icon.svelte-1ud3sov {mask-image:var(--ehagaki-icon-636f6e74726173745f323464705f4533453345335f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.media-placement-setting-icon.svelte-1ud3sov {mask-image:var(--ehagaki-icon-6f70656e5f776974685f323464705f4533453345335f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.color-settings-icon.svelte-1ud3sov {mask-image:var(--ehagaki-icon-636f6c6f72735f323464705f4533453345335f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.external-nostr-client-setting-icon.svelte-1ud3sov {mask-image:var(--ehagaki-icon-6f70656e5f696e5f6e65775f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.footer-shortcuts-setting-icon.svelte-1ud3sov {mask-image:var(--ehagaki-icon-766572746963616c5f616c69676e5f626f74746f6d5f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.mascot-setting-icon.svelte-1ud3sov {filter:grayscale(1);object-fit:contain;}.flavor-setting-icon.svelte-1ud3sov {mask-image:var(--ehagaki-icon-636861745f323464705f4533453345335f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.quote-setting-icon.svelte-1ud3sov {mask-image:var(--ehagaki-icon-666f726d61745f71756f74655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.reply-setting-icon.svelte-1ud3sov {mask-image:var(--ehagaki-icon-636861745f627562626c655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.client-tag-setting-icon.svelte-1ud3sov {mask-image:var(--ehagaki-icon-6c6162656c5f323464705f4533453345335f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.fail-closed-content-warning-setting-icon.svelte-1ud3sov {mask-image:var(--ehagaki-icon-7669736962696c6974795f6f66665f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.setting-row-with-note.svelte-1ud3sov {align-items:flex-start;}.setting-label-group.svelte-1ud3sov,
    .hide-mascot-flavor-group.svelte-1ud3sov,
    .notification-group.svelte-1ud3sov {display:flex;flex-direction:column;}.setting-label-group.svelte-1ud3sov {gap:4px;min-width:0;margin-block:auto;}.external-nostr-client-select.svelte-1ud3sov {min-width:160px;min-height:44px;padding:8px 32px 8px 10px;border:1px solid var(--border);border-radius:6px;background:var(--dialog-bg);color:var(--text);font:inherit;}.external-nostr-client-custom-url.svelte-1ud3sov {display:flex;flex-direction:column;gap:6px;margin-top:12px;}.external-nostr-client-custom-url.svelte-1ud3sov input:where(.svelte-1ud3sov) {width:100%;min-height:44px;padding:8px 10px;border:1px solid var(--border);border-radius:6px;background:var(--dialog-bg);color:var(--text);font:inherit;}.external-nostr-client-custom-url.svelte-1ud3sov input[aria-invalid="true"]:where(.svelte-1ud3sov) {border-color:var(--danger);}.setting-description.svelte-1ud3sov {color:var(--text-muted);font-size:0.875rem;line-height:1.4;}.form-error.svelte-1ud3sov {color:var(--danger);font-size:0.875rem;line-height:1.4;}.setting-label-row.svelte-1ud3sov {display:inline-flex;align-items:center;gap:6px;flex-wrap:wrap;}.setting-label-row.svelte-1ud3sov .setting-label-with-icon:where(.svelte-1ud3sov) {flex:0 1 auto;max-width:calc(100% - 50px);}.rotate-right-icon.svelte-1ud3sov {mask-image:var(--ehagaki-icon-726566726573685f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.bui-switch {position:relative;display:inline-block;width:90px;height:44px;--btn-bg: var(--toggle-bg);background-color:var(--btn-bg);opacity:0.2;border-radius:50px;border:none;padding:0;cursor:pointer;transition:opacity 0.2s;flex-shrink:0;

        @media (hover: hover) and (pointer: fine) {&:hover:not(:disabled) {opacity:0.15;background:var(--btn-bg);transition:none;}
        }}button.bui-switch[data-state="checked"] {opacity:1;

        @media (hover: hover) and (pointer: fine) {&:hover:not(:disabled) {opacity:0.9;}
        }}.bui-switch[data-disabled] {cursor:not-allowed;opacity:0.5;}.bui-switch-thumb {position:absolute;display:block;height:38px;width:38px;left:3px;bottom:3px;background-color:var(--toggle-circle);translate:0 0;transition:translate 0.2s cubic-bezier(0, 1, 0.5, 1);border-radius:50%;}.bui-switch[data-state="checked"] .bui-switch-thumb {translate:46px 0;}

    @media (prefers-reduced-motion: reduce) {.bui-switch {transition:none;}.bui-switch-thumb {transition:none;}
    }.sw-update-btn.primary {height:54px;width:auto;padding:12px 10px 12px 8px;flex-shrink:0;}.sw-update-row.svelte-1ud3sov {justify-content:flex-end;}.sw-update-btn:disabled {opacity:0.6;}.theme-mode-group {display:flex;gap:4px;flex-wrap:nowrap;button {min-width:74px;min-height:50px;padding:8px 10px;font-size:0.875rem;font-weight:normal;}}.color-settings-section.svelte-1ud3sov {gap:10px;}.color-settings-section.svelte-1ud3sov {display:grid;grid-template-columns:24px minmax(0, 1fr);column-gap:16px;align-items:start;}.color-settings-content.svelte-1ud3sov {display:flex;flex-direction:column;gap:10px;min-width:0;}.color-settings-heading.svelte-1ud3sov {min-height:24px;}.color-setting-row.svelte-1ud3sov,
    .color-setting-controls.svelte-1ud3sov {display:flex;gap:10px;}.color-setting-row.svelte-1ud3sov {align-items:center;justify-content:space-between;}.color-setting-controls.svelte-1ud3sov {align-items:center;flex-shrink:0;}.color-setting-controls.svelte-1ud3sov input[type="color"]:where(.svelte-1ud3sov) {width:44px;height:44px;padding:2px;border:1px solid var(--border);border-radius:6px;background:var(--dialog-bg);cursor:pointer;}.color-hex-input.svelte-1ud3sov {width:104px;min-height:44px;padding:8px 10px;border:1px solid var(--border);border-radius:6px;background:var(--dialog-bg);color:var(--text);font:inherit;}.color-hex-input[aria-invalid="true"].svelte-1ud3sov {border-color:var(--danger);}.reset-theme-colors-btn.rounded {align-self:flex-end;min-height:44px;}

    @media (max-width: 430px) {.color-setting-row.svelte-1ud3sov {align-items:flex-start;flex-direction:column;}.color-setting-controls.svelte-1ud3sov {align-self:flex-end;}
    }`
};
function sm(n, e) {
  Ns(e, !0), Mo(n, rm);
  const t = () => ls(Bo, "$_", d), r = () => ls(Yp, "$swUpdateStatus", d), i = () => ls(Xp, "$dbUpgradeBlocked", d), a = () => ls(qp, "$locale", d), c = () => ls(Wp, "$swNeedRefresh", d), [d, h] = Ro();
  let g = ht(e, "show", 15, !1), b = ht(e, "onClose", 7), m = ht(e, "onRefreshRelaysAndProfile", 7, () => {
  }), v = ht(e, "hostRelayConfigActive", 7, !1), D = ht(e, "onOpenWelcomeDialog", 7, void 0), C = ht(e, "rxNostr", 7, null);
  function E() {
    g(!1), b()?.();
  }
  Up(() => g(), E, !0);
  let N = Te(() => Rc(t())), V = Te(() => Rc(t())), H = Te(() => Mc(x(N), 2)), re = Te(() => Mc(x(V), 2)), de = nn(zr(nt.clientTagEnabled)), ee = nn(zr(nt.externalNostrClient)), te = nn(zr(nt.externalNostrClientCustomUrl)), q = nn(null), K = nn(zr(nt.quoteNotificationEnabled)), S = nn(zr(nt.replyNotificationEnabled));
  const $ = "#1dbf73", A = "#808080";
  let P = nn(zr(Mn.accentColor ?? $)), F = nn(zr(Mn.baseColor ?? "")), Z = nn(null), Y = nn(null), se = Te(() => !nt.showMascot || !nt.showFlavorText), pe = Te(() => Hp.value), ve = Te(() => jp.value), ce = Te(() => Ba.value), Ee = Te(() => Bc.value), me = Te(() => r() === "installing"), Ce = Te(i), je = Te(() => Gp.required), Xe = Te(() => x(je) || r() === "ready" && !x(Ce));
  function ke() {
    if (x(je)) {
      Kp();
      return;
    }
    Qp(Jp, (Ve) => Bc.set(Ve));
  }
  vd(() => {
    nt.reload(), Se(de, nt.clientTagEnabled, !0), Se(ee, nt.externalNostrClient, !0), Se(te, nt.externalNostrClientCustomUrl, !0), Se(K, nt.quoteNotificationEnabled, !0), Se(S, nt.replyNotificationEnabled, !0), Mn.reload(), Se(P, Mn.accentColor ?? $, !0), Se(F, Mn.baseColor ?? "", !0), Pp(), !v() && os.value?.pubkey && os.value?.isAuthenticated && Oc(os.value.pubkey);
  }), Er(() => {
    Se(de, nt.clientTagEnabled, !0);
  }), Er(() => {
    x(ee) !== nt.externalNostrClient && (nt.externalNostrClient = x(ee));
  }), Er(() => {
    if (x(te) !== nt.externalNostrClientCustomUrl) {
      const Ve = Dc(x(te));
      Ve && (nt.externalNostrClientCustomUrl = Ve);
    }
  }), Er(() => {
    Se(K, nt.quoteNotificationEnabled, !0);
  }), Er(() => {
    Se(S, nt.replyNotificationEnabled, !0);
  }), Er(() => {
    x(de) !== nt.clientTagEnabled && (nt.clientTagEnabled = x(de));
  }), Er(() => {
    x(S) !== nt.replyNotificationEnabled && (nt.replyNotificationEnabled = x(S));
  }), Er(() => {
    x(K) !== nt.quoteNotificationEnabled && (nt.quoteNotificationEnabled = x(K));
  }), Er(() => {
    if (!g()) {
      Ba.set(!1);
      return;
    }
    os.value?.pubkey && os.value?.isAuthenticated && Oc(os.value.pubkey), (async () => (await eg(), tb(), window.nostrZap?.initTargets()))();
  });
  function Ge() {
    nt.locale = a() === "ja" ? "en" : "ja";
  }
  function pt(Ve, it) {
    const bt = it.currentTarget.value;
    Qs.set({
      ...Qs.value,
      [Ve]: bt || null
    });
  }
  function ae(Ve) {
    Se(te, Ve, !0);
    const it = Dc(Ve);
    Se(
      q,
      it ? null : t()("settingsDialog.external_nostr_client_invalid_url"),
      !0
    ), it && (nt.externalNostrClientCustomUrl = it);
  }
  function Je(Ve, it) {
    Ve === "accent" ? Se(P, it, !0) : Se(F, it, !0);
    const bt = Ii(it);
    bt && (Ve === "accent" ? (Se(P, Mn.setAccentColor(bt) ?? it, !0), Se(Z, null)) : (Se(F, Mn.setBaseColor(bt) ?? it, !0), Se(Y, null)));
  }
  function Yt(Ve) {
    const it = Ve === "accent" ? x(P) : x(F), bt = Ve === "accent" ? Mn.accentColor : Mn.baseColor, Ke = Ve === "base" && !it && !bt || Ii(it) ? null : t()("settingsDialog.invalid_hex_color");
    Ve === "accent" ? Se(Z, Ke, !0) : Se(Y, Ke, !0);
  }
  function Pt(Ve, it) {
    const bt = Ii(it);
    bt && (Ve === "accent" ? (Se(P, Mn.setAccentColor(bt) ?? bt, !0), Se(Z, null)) : (Se(F, Mn.setBaseColor(bt) ?? bt, !0), Se(Y, null)));
  }
  function _n() {
    Mn.reset(), Se(P, $), Se(F, ""), Se(Z, null), Se(Y, null);
  }
  var En = {
    get show() {
      return g();
    },
    set show(Ve = !1) {
      g(Ve), ft();
    },
    get onClose() {
      return b();
    },
    set onClose(Ve) {
      b(Ve), ft();
    },
    get onRefreshRelaysAndProfile() {
      return m();
    },
    set onRefreshRelaysAndProfile(Ve = () => {
    }) {
      m(Ve), ft();
    },
    get hostRelayConfigActive() {
      return v();
    },
    set hostRelayConfigActive(Ve = !1) {
      v(Ve), ft();
    },
    get onOpenWelcomeDialog() {
      return D();
    },
    set onOpenWelcomeDialog(Ve = void 0) {
      D(Ve), ft();
    },
    get rxNostr() {
      return C();
    },
    set rxNostr(Ve = null) {
      C(Ve), ft();
    }
  };
  {
    const Ve = (_e) => {
      var Ke = ln(), at = wt(Ke);
      {
        const lt = (gt, dt) => {
          let Ye = () => dt?.().props;
          {
            let Oe = Te(() => t()("global.close"));
            jt(gt, hd(Ye, {
              className: "modal-close",
              shape: "square",
              get ariaLabel() {
                return x(Oe);
              },
              children: ($t, Mt) => {
                var Zt = Hb();
                ge($t, Zt);
              },
              $$slots: { default: !0 }
            }));
          }
        };
        en(at, () => ng, (gt, dt) => {
          dt(gt, { child: lt, $$slots: { child: !0 } });
        });
      }
      ge(_e, Ke);
    };
    let it = Te(() => t()("settings") || "設定"), bt = Te(() => t()("settingsDialog.image_quality_setting"));
    tg(n, {
      onOpenChange: (_e) => !_e && E(),
      get title() {
        return x(it);
      },
      get description() {
        return x(bt);
      },
      contentClass: "settings-dialog",
      footerVariant: "close-button",
      get open() {
        return g();
      },
      set open(_e) {
        g(_e);
      },
      footer: Ve,
      children: (_e, Ke) => {
        var at = nm(), lt = wt(at), gt = L(lt), dt = L(gt), Ye = G(L(dt), 2), Oe = L(Ye, !0);
        T(Ye), T(dt);
        var $t = G(dt, 2), Mt = L($t), Zt = L(Mt, !0);
        T(Mt);
        var Vt = G(Mt), $n = L(Vt, !0);
        T(Vt), T($t), T(gt);
        var Wt = G(gt, 2), In = L(Wt);
        jt(In, {
          shape: "circle",
          variant: "default",
          className: "help-btn",
          onClick: () => {
            E(), D()?.();
          },
          ariaLabel: "Help",
          children: (Le, Ne) => {
            var $e = qb();
            ge(Le, $e);
          },
          $$slots: { default: !0 }
        });
        var Nt = G(In, 2);
        jt(Nt, {
          shape: "circle",
          variant: "default",
          className: "github-link-btn",
          onClick: () => window.open("https://github.com/Lokuyow/ehagaki", "_blank", "noopener"),
          ariaLabel: "GitHub Repository",
          children: (Le, Ne) => {
            var $e = jb();
            ge(Le, $e);
          },
          $$slots: { default: !0 }
        }), Ut(2), T(Wt), T(lt);
        var Tt = G(lt, 2), Rt = L(Tt);
        {
          var _t = (Le) => {
            var Ne = Zb(), $e = L(Ne), qe = L($e), Be = L(qe);
            {
              let ct = Te(() => x(Ee) || x(me) && !x(je) ? "loading" : ""), tt = Te(() => x(Ee) || !x(Xe)), st = Te(() => x(je) ? t()("staleAsset.reload") : t()("settingsDialog.update_app") || "アプリを更新");
              jt(Be, {
                variant: "primary",
                shape: "rounded",
                contentLayout: "iconText",
                get className() {
                  return `sw-update-btn ${x(ct) ?? ""}`;
                },
                onClick: ke,
                get disabled() {
                  return x(tt);
                },
                get ariaLabel() {
                  return x(st);
                },
                children: (Dt, St) => {
                  var Ct = ln(), It = wt(Ct);
                  {
                    var Gt = (hn) => {
                      {
                        let Xn = Te(() => x(me) ? t()("settingsDialog.sw_update_installing_short") || "インストール中..." : t()("settingsDialog.updating") || "更新中...");
                        Vp(hn, {
                          showLoader: !0,
                          loaderSize: 32,
                          get text() {
                            return x(Xn);
                          }
                        });
                      }
                    }, an = (hn) => {
                      var Xn = Fb(), Kr = G(wt(Xn), 2), Es = L(Kr, !0);
                      T(Kr), Ue(($s) => he(Es, $s), [
                        () => x(je) ? t()("staleAsset.reload") : t()("settingsDialog.update_app") || "更新"
                      ]), ge(hn, Xn);
                    };
                    Et(It, (hn) => {
                      x(Ee) || x(me) && !x(je) ? hn(Gt) : hn(an, -1);
                    });
                  }
                  ge(Dt, Ct);
                },
                $$slots: { default: !0 }
              });
            }
            T(qe), T($e), T(Ne), ge(Le, Ne);
          };
          Et(Rt, (Le) => {
            (c() || x(je)) && Le(_t);
          });
        }
        var Lt = G(Rt, 2), zn = L(Lt), bn = L(zn), Tn = G(L(bn), 2), sr = L(Tn, !0);
        T(Tn), T(bn);
        var ir = G(bn, 2), Wn = L(ir);
        jt(Wn, {
          variant: "default",
          shape: "rounded",
          contentLayout: "text",
          className: "lang-btn",
          onClick: Ge,
          children: (Le, Ne) => {
            var $e = Vb(), qe = L($e, !0);
            T($e), Ue((Be) => he(qe, Be), [() => t()("settingsDialog.change") || "変更"]), ge(Le, $e);
          },
          $$slots: { default: !0 }
        }), T(ir), T(zn), T(Lt);
        var Hn = G(Lt, 2);
        Uh(Hn, {
          get compressionPairs() {
            return x(H);
          },
          get selectedCompression() {
            return nt.imageQualityLevel;
          },
          onCompressionChange: (Le) => nt.imageQualityLevel = Le,
          get videoCompressionPairs() {
            return x(re);
          },
          get selectedVideoCompression() {
            return nt.videoQualityLevel;
          },
          onVideoCompressionChange: (Le) => nt.videoQualityLevel = Le
        });
        var dn = G(Hn, 2);
        Ph(dn, {
          get rxNostr() {
            return C();
          }
        });
        var Bt = G(dn, 2), kn = L(Bt), An = L(kn), Fe = G(L(An), 2), zt = L(Fe, !0);
        T(Fe), T(An);
        var qn = G(An, 2);
        en(qn, () => el, (Le, Ne) => {
          Ne(Le, {
            class: "setting-control theme-mode-group",
            name: "themeMode",
            orientation: "horizontal",
            get value() {
              return Nc.value;
            },
            "aria-labelledby": "theme-mode-label",
            onValueChange: ($e) => Nc.set($e),
            children: ($e, qe) => {
              var Be = Wb(), ct = wt(Be);
              {
                let Dt = Te(() => t()("settingsDialog.theme_system") || "システム");
                Ni(ct, {
                  value: "system",
                  variant: "default",
                  shape: "rounded",
                  get ariaLabel() {
                    return x(Dt);
                  },
                  children: (St, Ct) => {
                    Ut();
                    var It = Ot();
                    Ue((Gt) => he(It, Gt), [() => t()("settingsDialog.theme_system") || "システム"]), ge(St, It);
                  },
                  $$slots: { default: !0 }
                });
              }
              var tt = G(ct, 2);
              {
                let Dt = Te(() => t()("settingsDialog.theme_light") || "ライト");
                Ni(tt, {
                  value: "light",
                  variant: "default",
                  shape: "rounded",
                  get ariaLabel() {
                    return x(Dt);
                  },
                  children: (St, Ct) => {
                    Ut();
                    var It = Ot();
                    Ue((Gt) => he(It, Gt), [() => t()("settingsDialog.theme_light") || "ライト"]), ge(St, It);
                  },
                  $$slots: { default: !0 }
                });
              }
              var st = G(tt, 2);
              {
                let Dt = Te(() => t()("settingsDialog.theme_dark") || "ダーク");
                Ni(st, {
                  value: "dark",
                  variant: "default",
                  shape: "rounded",
                  get ariaLabel() {
                    return x(Dt);
                  },
                  children: (St, Ct) => {
                    Ut();
                    var It = Ot();
                    Ue((Gt) => he(It, Gt), [() => t()("settingsDialog.theme_dark") || "ダーク"]), ge(St, It);
                  },
                  $$slots: { default: !0 }
                });
              }
              ge($e, Be);
            },
            $$slots: { default: !0 }
          });
        }), T(kn), T(Bt);
        var et = G(Bt, 2);
        {
          var or = (Le) => {
            var Ne = Qb(), $e = G(L(Ne), 2), qe = L($e), Be = L(qe), ct = L(Be, !0);
            T(Be), T(qe);
            var tt = G(qe, 2), st = L(tt), Dt = L(st), St = L(Dt, !0);
            T(Dt);
            var Ct = G(Dt, 2), It = L(Ct, !0);
            T(Ct), T(st);
            var Gt = G(st, 2), an = L(Gt);
            cs(an);
            var hn = G(an, 2);
            cs(hn), T(Gt), T(tt);
            var Xn = G(tt, 2);
            {
              var Kr = (Ht) => {
                var Jn = Gb(), yr = L(Jn, !0);
                T(Jn), Ue(() => he(yr, x(Z))), ge(Ht, Jn);
              };
              Et(Xn, (Ht) => {
                x(Z) && Ht(Kr);
              });
            }
            var Es = G(Xn, 2), $s = L(Es), Ai = L($s), mr = L(Ai, !0);
            T(Ai);
            var cr = G(Ai, 2), ks = L(cr, !0);
            T(cr), T($s);
            var oo = G($s, 2), As = L(oo);
            cs(As);
            var Qr = G(As, 2);
            cs(Qr), T(oo), T(Es);
            var ao = G(Es, 2);
            {
              var lo = (Ht) => {
                var Jn = Kb(), yr = L(Jn, !0);
                T(Jn), Ue(() => he(yr, x(Y))), ge(Ht, Jn);
              };
              Et(ao, (Ht) => {
                x(Y) && Ht(lo);
              });
            }
            var Si = G(ao, 2);
            jt(Si, {
              variant: "default",
              shape: "rounded",
              className: "reset-theme-colors-btn",
              onClick: _n,
              children: (Ht, Jn) => {
                Ut();
                var yr = Ot();
                Ue((Vs) => he(yr, Vs), [() => t()("settingsDialog.reset_colors")]), ge(Ht, yr);
              },
              $$slots: { default: !0 }
            }), T($e), T(Ne), Ue(
              (Ht, Jn, yr, Vs, co, uo, ua, ho, ha, fa, Yr) => {
                he(ct, Ht), he(St, Jn), he(It, yr), Vn(an, "aria-label", Vs), Ti(an, co), Vn(hn, "aria-label", uo), Ti(hn, x(P)), Vn(hn, "aria-invalid", x(Z) ? "true" : "false"), he(mr, ua), he(ks, ho), Vn(As, "aria-label", ha), Ti(As, fa), Vn(Qr, "aria-label", Yr), Ti(Qr, x(F)), Vn(Qr, "aria-invalid", x(Y) ? "true" : "false");
              },
              [
                () => t()("settingsDialog.color"),
                () => t()("settingsDialog.accent_color"),
                () => t()("settingsDialog.accent_color_description"),
                () => t()("settingsDialog.accent_color_picker"),
                () => Ii(Mn.accentColor) ?? $,
                () => t()("settingsDialog.accent_color_hex"),
                () => t()("settingsDialog.base_color"),
                () => t()("settingsDialog.base_color_description"),
                () => t()("settingsDialog.base_color_picker"),
                () => Ii(Mn.baseColor) ?? A,
                () => t()("settingsDialog.base_color_hex")
              ]
            ), hr("input", an, (Ht) => Pt("accent", Ht.currentTarget.value)), hr("input", hn, (Ht) => Je("accent", Ht.currentTarget.value)), Pc("blur", hn, () => Yt("accent")), hr("input", As, (Ht) => Pt("base", Ht.currentTarget.value)), hr("input", Qr, (Ht) => Je("base", Ht.currentTarget.value)), Pc("blur", Qr, () => Yt("base")), ge(Le, Ne);
          };
          Et(et, (Le) => {
            Le(or);
          });
        }
        var vr = G(et, 2), rt = L(vr), kt = L(rt), mt = G(L(kt), 2), sn = L(mt, !0);
        T(mt), T(kt);
        var Ze = G(kt, 2), le = L(Ze);
        en(le, () => Br, (Le, Ne) => {
          Ne(Le, {
            class: "bui-switch",
            "aria-labelledby": "media-free-placement-label",
            get checked() {
              return nt.mediaFreePlacement;
            },
            set checked($e) {
              nt.mediaFreePlacement = $e;
            },
            children: ($e, qe) => {
              var Be = ln(), ct = wt(Be);
              en(ct, () => Ur, (tt, st) => {
                st(tt, { class: "bui-switch-thumb" });
              }), ge($e, Be);
            },
            $$slots: { default: !0 }
          });
        }), T(Ze), T(rt), T(vr);
        var ut = G(vr, 2), At = L(ut), on = L(At), Dr = L(on), Us = L(Dr), Gr = L(Us), Ps = L(Gr), zs = G(Ps, 2), di = L(zs, !0);
        T(zs), T(Gr);
        var Yo = G(Gr, 2);
        {
          let Le = Te(() => t()("settingsDialog.hide_mascot_description"));
          $r(Yo, {
            side: "top",
            sideOffset: 8,
            get ariaLabel() {
              return x(Le);
            },
            children: (Ne, $e) => {
              Ut();
              var qe = Ot();
              Ue((Be) => he(qe, Be), [
                () => t()("settingsDialog.hide_mascot_note") || "オンにすると左上のマスコットを隠し、フレーバーテキストもあわせて非表示にします。"
              ]), ge(Ne, qe);
            },
            $$slots: { default: !0 }
          });
        }
        T(Us), T(Dr);
        var ui = G(Dr, 2), hi = L(ui);
        {
          let Le = Te(() => !nt.showMascot);
          en(hi, () => Br, (Ne, $e) => {
            $e(Ne, {
              class: "bui-switch",
              get checked() {
                return x(Le);
              },
              onCheckedChange: (qe) => nt.showMascot = !qe,
              "aria-labelledby": "hide-mascot-label",
              children: (qe, Be) => {
                var ct = ln(), tt = wt(ct);
                en(tt, () => Ur, (st, Dt) => {
                  Dt(st, { class: "bui-switch-thumb" });
                }), ge(qe, ct);
              },
              $$slots: { default: !0 }
            });
          });
        }
        T(ui), T(on), T(At);
        var Vi = G(At, 2), Wi = L(Vi), fi = L(Wi), Gi = L(fi), pi = L(Gi), Ki = G(L(pi), 2), Xo = L(Ki, !0);
        T(Ki), T(pi);
        var Jo = G(pi, 2);
        {
          let Le = Te(() => t()("settingsDialog.hide_flavor_text_description"));
          $r(Jo, {
            side: "top",
            sideOffset: 8,
            get ariaLabel() {
              return x(Le);
            },
            children: (Ne, $e) => {
              Ut();
              var qe = Ot();
              Ue((Be) => he(qe, Be), [
                () => nt.showMascot ? t()("settingsDialog.hide_flavor_text_note") || "オンにすると info のフレーバーテキストだけを隠します。success / error / tips は簡素な表示で残ります。" : t()("settingsDialog.hide_flavor_text_note_included") || "マスコットを非表示にしている間は、この設定も自動でオンになります。"
              ]), ge(Ne, qe);
            },
            $$slots: { default: !0 }
          });
        }
        T(Gi), T(fi);
        var Qi = G(fi, 2), ea = L(Qi);
        {
          var ta = (Le) => {
            var Ne = ln(), $e = wt(Ne);
            en($e, () => Br, (qe, Be) => {
              Be(qe, {
                class: "bui-switch",
                get checked() {
                  return x(se);
                },
                disabled: !0,
                "aria-labelledby": "hide-flavor-text-label",
                children: (ct, tt) => {
                  var st = ln(), Dt = wt(st);
                  en(Dt, () => Ur, (St, Ct) => {
                    Ct(St, { class: "bui-switch-thumb" });
                  }), ge(ct, st);
                },
                $$slots: { default: !0 }
              });
            }), ge(Le, Ne);
          }, na = (Le) => {
            var Ne = ln(), $e = wt(Ne);
            en($e, () => Br, (qe, Be) => {
              Be(qe, {
                class: "bui-switch",
                get checked() {
                  return x(se);
                },
                onCheckedChange: (ct) => nt.showFlavorText = !ct,
                "aria-labelledby": "hide-flavor-text-label",
                children: (ct, tt) => {
                  var st = ln(), Dt = wt(st);
                  en(Dt, () => Ur, (St, Ct) => {
                    Ct(St, { class: "bui-switch-thumb" });
                  }), ge(ct, st);
                },
                $$slots: { default: !0 }
              });
            }), ge(Le, Ne);
          };
          Et(ea, (Le) => {
            nt.showMascot ? Le(na, -1) : Le(ta);
          });
        }
        T(Qi), T(Wi), T(Vi), T(ut);
        var Gn = G(ut, 2), Kn = L(Gn), gi = L(Kn), vi = L(gi), br = L(vi), Sn = L(br), jn = G(L(Sn), 2), Qn = L(jn, !0);
        T(jn), T(Sn);
        var vs = G(Sn, 2);
        {
          let Le = Te(() => t()("settingsDialog.quote_notification_description"));
          $r(vs, {
            side: "top",
            sideOffset: 8,
            get ariaLabel() {
              return x(Le);
            },
            children: (Ne, $e) => {
              Ut();
              var qe = Ot();
              Ue((Be) => he(qe, Be), [
                () => t()("settingsDialog.quote_notification_note") || "引用投稿時、引用元の投稿者への通知をデフォルトで有効にします"
              ]), ge(Ne, qe);
            },
            $$slots: { default: !0 }
          });
        }
        T(br), T(vi);
        var bi = G(vi, 2), Yi = L(bi);
        en(Yi, () => Br, (Le, Ne) => {
          Ne(Le, {
            class: "bui-switch",
            "aria-labelledby": "quote-notification-label",
            get checked() {
              return x(K);
            },
            set checked($e) {
              Se(K, $e, !0);
            },
            children: ($e, qe) => {
              var Be = ln(), ct = wt(Be);
              en(ct, () => Ur, (tt, st) => {
                st(tt, { class: "bui-switch-thumb" });
              }), ge($e, Be);
            },
            $$slots: { default: !0 }
          });
        }), T(bi), T(gi), T(Kn);
        var mi = G(Kn, 2), bs = L(mi), ms = L(bs), yi = L(ms), Fn = L(yi), wi = G(L(Fn), 2), Xi = L(wi, !0);
        T(wi), T(Fn);
        var Hs = G(Fn, 2);
        {
          let Le = Te(() => t()("settingsDialog.reply_notification_description"));
          $r(Hs, {
            side: "top",
            sideOffset: 8,
            get ariaLabel() {
              return x(Le);
            },
            children: (Ne, $e) => {
              Ut();
              var qe = Ot();
              Ue((Be) => he(qe, Be), [
                () => t()("settingsDialog.reply_notification_note") || "リプライ時にリプライツリー内のほかの参加者をデフォルトで通知対象に含めます"
              ]), ge(Ne, qe);
            },
            $$slots: { default: !0 }
          });
        }
        T(yi), T(ms);
        var Ji = G(ms, 2), ra = L(Ji);
        en(ra, () => Br, (Le, Ne) => {
          Ne(Le, {
            class: "bui-switch",
            "aria-labelledby": "reply-notification-label",
            get checked() {
              return x(S);
            },
            set checked($e) {
              Se(S, $e, !0);
            },
            children: ($e, qe) => {
              var Be = ln(), ct = wt(Be);
              en(ct, () => Ur, (tt, st) => {
                st(tt, { class: "bui-switch-thumb" });
              }), ge($e, Be);
            },
            $$slots: { default: !0 }
          });
        }), T(Ji), T(bs), T(mi), T(Gn);
        var Or = G(Gn, 2), eo = L(Or), ys = L(eo), ws = G(L(ys), 2), to = L(ws, !0);
        T(ws), T(ys);
        var no = G(ys, 2), sa = L(no);
        en(sa, () => Br, (Le, Ne) => {
          Ne(Le, {
            class: "bui-switch",
            "aria-labelledby": "client-tag-label",
            get checked() {
              return x(de);
            },
            set checked($e) {
              Se(de, $e, !0);
            },
            children: ($e, qe) => {
              var Be = ln(), ct = wt(Be);
              en(ct, () => Ur, (tt, st) => {
                st(tt, { class: "bui-switch-thumb" });
              }), ge($e, Be);
            },
            $$slots: { default: !0 }
          });
        }), T(no), T(eo), T(Or);
        var xs = G(Or, 2), xi = L(xs), Nr = L(xi), _i = L(Nr), qs = L(_i), un = G(L(qs), 2), ia = L(un, !0);
        T(un), T(qs);
        var oa = G(qs, 2);
        {
          let Le = Te(() => t()("settingsDialog.fail_closed_content_warning_info_label"));
          $r(oa, {
            side: "top",
            sideOffset: 8,
            get ariaLabel() {
              return x(Le);
            },
            children: (Ne, $e) => {
              Ut();
              var qe = Ot();
              Ue((Be) => he(qe, Be), [
                () => t()("settingsDialog.fail_closed_content_warning_info")
              ]), ge(Ne, qe);
            },
            $$slots: { default: !0 }
          });
        }
        T(_i), T(Nr);
        var aa = G(Nr, 2), _s = L(aa);
        en(_s, () => Br, (Le, Ne) => {
          Ne(Le, {
            class: "bui-switch",
            get checked() {
              return nt.failClosedContentWarning;
            },
            onCheckedChange: ($e) => nt.failClosedContentWarning = $e,
            "aria-labelledby": "fail-closed-content-warning-label",
            children: ($e, qe) => {
              var Be = ln(), ct = wt(Be);
              en(ct, () => Ur, (tt, st) => {
                st(tt, { class: "bui-switch-thumb" });
              }), ge($e, Be);
            },
            $$slots: { default: !0 }
          });
        }), T(aa), T(xi), T(xs);
        var Xt = G(xs, 2), ar = L(Xt), Yn = G(L(ar), 2), ro = L(Yn, !0);
        T(Yn), T(ar);
        var so = G(ar, 2);
        fr(so, 20, () => ["left", "right"], Cr, (Le, Ne) => {
          const $e = Te(() => Ne);
          var qe = Xb(), Be = L(qe), ct = L(Be, !0);
          T(Be);
          var tt = G(Be, 2), st = L(tt), Dt = L(st, !0);
          T(st), st.value = st.__value = "";
          var St = G(st);
          fr(St, 17, () => Fp, (It) => It.id, (It, Gt) => {
            var an = Yb(), hn = L(an, !0);
            T(an);
            var Xn = {};
            Ue(
              (Kr) => {
                an.disabled = x(Gt).id === Qs.value[x($e) === "left" ? "right" : "left"], he(hn, Kr), Xn !== (Xn = x(Gt).id) && (an.value = (an.__value = x(Gt).id) ?? "");
              },
              [() => t()(x(Gt).labelKey)]
            ), ge(It, an);
          }), T(tt);
          var Ct;
          tl(tt), T(qe), Ue(
            (It, Gt) => {
              Vn(qe, "for", `footer-shortcut-${x($e)}`), he(ct, It), Vn(tt, "id", `footer-shortcut-${x($e)}`), he(Dt, Gt), Ct !== (Ct = Qs.value[x($e)] ?? "") && (tt.value = (tt.__value = Qs.value[x($e)] ?? "") ?? "", nl(tt, Qs.value[x($e)] ?? ""));
            },
            [
              () => t()(`settingsDialog.footer_shortcuts_${x($e)}`),
              () => t()("settingsDialog.footer_shortcuts_none")
            ]
          ), hr("change", tt, (It) => pt(x($e), It)), ge(Le, qe);
        }), T(so), T(Xt);
        var js = G(Xt, 2), Fs = L(js), Ei = L(Fs), io = L(Ei), tn = L(io), Pe = G(L(tn), 2), Zs = L(Pe, !0);
        T(Pe), T(tn);
        var $i = G(tn, 2);
        {
          let Le = Te(() => t()("settingsDialog.external_nostr_client_description"));
          $r($i, {
            get ariaLabel() {
              return x(Le);
            },
            children: (Ne, $e) => {
              Ut();
              var qe = Ot();
              Ue((Be) => he(qe, Be), [
                () => t()("settingsDialog.external_nostr_client_description")
              ]), ge(Ne, qe);
            },
            $$slots: { default: !0 }
          });
        }
        T(io), T(Ei);
        var lr = G(Ei, 2);
        fr(lr, 21, () => Zp, Cr, (Le, Ne) => {
          var $e = Jb(), qe = L($e, !0);
          T($e);
          var Be = {};
          Ue(
            (ct) => {
              he(qe, ct), Be !== (Be = x(Ne)) && ($e.value = ($e.__value = x(Ne)) ?? "");
            },
            [
              () => x(Ne) === "custom" ? t()("settingsDialog.external_nostr_client_custom") : x(Ne) === "nostter" ? "nostter" : x(Ne) === "njump" ? "njump" : x(Ne)[0].toUpperCase() + x(Ne).slice(1)
            ]
          ), ge(Le, $e);
        }), T(lr);
        var ki;
        tl(lr), T(Fs);
        var la = G(Fs, 2);
        {
          var ca = (Le) => {
            var Ne = tm(), $e = L(Ne), qe = L($e, !0);
            T($e);
            var Be = G($e, 2), ct = L(Be, !0);
            T(Be);
            var tt = G(Be, 2);
            cs(tt);
            var st = G(tt, 2);
            {
              var Dt = (St) => {
                var Ct = em(), It = L(Ct, !0);
                T(Ct), Ue(() => he(It, x(q))), ge(St, Ct);
              };
              Et(st, (St) => {
                x(q) && St(Dt);
              });
            }
            T(Ne), Ue(
              (St, Ct) => {
                he(qe, St), he(ct, Ct), Ti(tt, x(te)), Vn(tt, "aria-invalid", x(q) ? "true" : "false");
              },
              [
                () => t()("settingsDialog.external_nostr_client_custom_url"),
                () => t()("settingsDialog.external_nostr_client_custom_url_description")
              ]
            ), hr("input", tt, (St) => ae(St.currentTarget.value)), ge(Le, Ne);
          };
          Et(la, (Le) => {
            x(ee) === "custom" && Le(ca);
          });
        }
        T(js);
        var da = G(js, 2);
        Bh(da, {
          get relayConfig() {
            return x(ve);
          },
          get showRelays() {
            return x(ce);
          },
          onToggleShowRelays: () => Ba.set(!x(ce)),
          get onRefreshRelaysAndProfile() {
            return m();
          },
          get hostRelayConfigActive() {
            return v();
          }
        }), T(Tt), Ue(
          (Le, Ne, $e, qe, Be, ct, tt, st, Dt, St, Ct, It, Gt, an) => {
            he(Oe, x(pe) ? `v${x(pe)}` : ""), he(Zt, Le), he($n, Ne), he(sr, $e), he(zt, qe), he(sn, Be), Vn(Ps, "src", ct), he(di, tt), he(Xo, st), he(Qn, Dt), he(Xi, St), he(to, Ct), he(ia, It), he(ro, Gt), he(Zs, an), ki !== (ki = x(ee)) && (lr.value = (lr.__value = x(ee)) ?? "", nl(lr, x(ee)));
          },
          [
            () => t()("settingsDialog.author_info") || "制作：",
            () => t()("settingsDialog.author_name") || " Lokuyow",
            () => t()("settingsDialog.language"),
            () => t()("settingsDialog.theme_mode") || "カラーテーマ",
            () => t()("settingsDialog.media_bottom_mode") || "メディア自由配置モード",
            () => zp("ehagaki_icon.svg"),
            () => t()("settingsDialog.hide_mascot_label") || "きってんを非表示",
            () => t()("settingsDialog.hide_flavor_text_label") || "フレーバーテキストを非表示",
            () => t()("settingsDialog.quote_notification_label") || "引用元の投稿者に通知",
            () => t()("settingsDialog.reply_notification_label") || "返信先以外にも通知",
            () => t()("settingsDialog.client_tag_label") || "投稿詳細にクライアント名をつける（Client tag）",
            () => t()("settingsDialog.fail_closed_content_warning_label"),
            () => t()("settingsDialog.footer_shortcuts"),
            () => t()("settingsDialog.external_nostr_client")
          ]
        ), hr("change", lr, (Le) => {
          Se(ee, Le.currentTarget.value, !0), Se(q, null);
        }), ge(_e, at);
      },
      $$slots: { footer: !0, default: !0 }
    });
  }
  var Pn = Ms(En);
  return h(), Pn;
}
yd(["input", "change"]);
Rs(
  sm,
  {
    show: {},
    onClose: {},
    onRefreshRelaysAndProfile: {},
    hostRelayConfigActive: {},
    onOpenWelcomeDialog: {},
    rxNostr: {}
  },
  [],
  [],
  { mode: "open" }
);
export {
  sm as default
};
