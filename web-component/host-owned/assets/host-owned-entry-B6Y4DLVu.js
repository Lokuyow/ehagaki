const Pi = "ehagaki-composer", Qp = 1, Mi = Symbol.for("ehagaki-composer.distribution");
function tc(e, t) {
  const n = globalThis, r = n[Mi];
  if (r && r !== e)
    throw new Error(
      `Cannot import the ${e} eHagaki Composer distribution after ${r} in the same document.`
    );
  n[Mi] = e;
  const i = customElements.get(Pi);
  if (!i) {
    customElements.define(Pi, t);
    return;
  }
  if (i !== t)
    throw new Error("ehagaki-composer is already defined by a different distribution.");
}
const Eo = !1;
var nc = Array.isArray, rc = Array.prototype.indexOf, Pt = Array.prototype.includes, ic = Array.from, Cn = Object.keys, Ln = Object.defineProperty, Lt = Object.getOwnPropertyDescriptor, oc = Object.getOwnPropertyDescriptors, sc = Object.prototype, ac = Array.prototype, xo = Object.getPrototypeOf, Ui = Object.isExtensible;
function eg(e) {
  return typeof e == "function";
}
const cc = () => {
};
function lc(e) {
  for (var t = 0; t < e.length; t++)
    e[t]();
}
function ko() {
  var e, t, n = new Promise((r, i) => {
    e = r, t = i;
  });
  return { promise: n, resolve: e, reject: t };
}
const ie = 2, Mt = 4, an = 8, Hr = 1 << 24, ke = 16, Be = 32, Ke = 64, Er = 128, be = 512, Q = 1024, ne = 2048, Ne = 4096, ye = 8192, Te = 16384, ut = 32768, zi = 1 << 25, nn = 65536, On = 1 << 17, uc = 1 << 18, kt = 1 << 19, Ao = 1 << 20, tg = 1 << 25, Et = 65536, Tn = 1 << 21, Ot = 1 << 22, rt = 1 << 23, bt = Symbol("$state"), fc = Symbol("legacy props"), ng = Symbol(""), dc = Symbol("attributes"), hc = Symbol("class"), pc = Symbol("style"), xr = Symbol("text"), rg = Symbol("form reset"), Kn = new class extends Error {
  name = "StaleReactionError";
  message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), og = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml")
), sg = 1, cn = 3, ln = 8;
function gc(e) {
  throw new Error("https://svelte.dev/e/lifecycle_outside_component");
}
function wc() {
  throw new Error("https://svelte.dev/e/async_derived_orphan");
}
function ag(e, t, n) {
  throw new Error("https://svelte.dev/e/each_key_duplicate");
}
function bc(e) {
  throw new Error("https://svelte.dev/e/effect_in_teardown");
}
function yc() {
  throw new Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function mc(e) {
  throw new Error("https://svelte.dev/e/effect_orphan");
}
function vc() {
  throw new Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function _c() {
  throw new Error("https://svelte.dev/e/hydration_failed");
}
function cg(e) {
  throw new Error("https://svelte.dev/e/props_invalid_value");
}
function Ec() {
  throw new Error("https://svelte.dev/e/state_descriptors_fixed");
}
function xc() {
  throw new Error("https://svelte.dev/e/state_prototype_fixed");
}
function kc() {
  throw new Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Ac() {
  throw new Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
const lg = 1, ug = 2, fg = 4, dg = 8, hg = 16, pg = 1, gg = 4, wg = 8, bg = 16, Sc = 1, Ic = 2, So = "[", Io = "[!", Di = "[?", Ro = "]", Ut = {}, te = Symbol(), Rc = "http://www.w3.org/1999/xhtml", yg = "http://www.w3.org/2000/svg", mg = "http://www.w3.org/1998/Math/MathML", vg = "@attach";
function $c() {
  console.warn("https://svelte.dev/e/derived_inert");
}
function Zn(e) {
  console.warn("https://svelte.dev/e/hydration_mismatch");
}
function _g() {
  console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function Cc() {
  console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
let J = !1;
function gn(e) {
  J = e;
}
let U;
function Re(e) {
  if (e === null)
    throw Zn(), Ut;
  return U = e;
}
function jr() {
  return Re(/* @__PURE__ */ Ge(U));
}
function Eg(e) {
  if (J) {
    if (/* @__PURE__ */ Ge(U) !== null)
      throw Zn(), Ut;
    U = e;
  }
}
function Lc(e = 1) {
  if (J) {
    for (var t = e, n = U; t--; )
      n = /** @type {TemplateNode} */
      /* @__PURE__ */ Ge(n);
    U = n;
  }
}
function Oc(e = !0) {
  for (var t = 0, n = U; ; ) {
    if (n.nodeType === ln) {
      var r = (
        /** @type {Comment} */
        n.data
      );
      if (r === Ro) {
        if (t === 0) return n;
        t -= 1;
      } else (r === So || r === Io || // "[1", "[2", etc. for if blocks
      r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
    }
    var i = (
      /** @type {TemplateNode} */
      /* @__PURE__ */ Ge(n)
    );
    e && n.remove(), n = i;
  }
}
function xg(e) {
  if (!e || e.nodeType !== ln)
    throw Zn(), Ut;
  return (
    /** @type {Comment} */
    e.data
  );
}
function $o(e) {
  return e === this.v;
}
function Tc(e, t) {
  return e != e ? t == t : e !== t || e !== null && typeof e == "object" || typeof e == "function";
}
function Co(e) {
  return !Tc(e, this.v);
}
let Bc = !1, ce = null;
function zt(e) {
  ce = e;
}
function kg(e) {
  return (
    /** @type {T} */
    Wn().get(e)
  );
}
function Ag(e, t) {
  return Wn().set(e, t), t;
}
function Sg(e) {
  return Wn().has(e);
}
function Ig() {
  return Wn();
}
function Nc(e, t = !1, n) {
  ce = {
    p: ce,
    i: !1,
    c: null,
    e: null,
    s: e,
    x: null,
    r: (
      /** @type {Effect} */
      T
    ),
    l: null
  };
}
function Pc(e) {
  var t = (
    /** @type {ComponentContext} */
    ce
  ), n = t.e;
  if (n !== null) {
    t.e = null;
    for (var r of n)
      Xo(r);
  }
  return e !== void 0 && (t.x = e), t.i = !0, ce = t.p, e ?? /** @type {T} */
  {};
}
function Lo() {
  return !0;
}
function Wn(e) {
  return ce === null && gc(), ce.c ??= new Map(Mc(ce) || void 0);
}
function Mc(e) {
  let t = e.p;
  for (; t !== null; ) {
    const n = t.c;
    if (n !== null)
      return n;
    t = t.p;
  }
  return null;
}
let ht = [];
function Oo() {
  var e = ht;
  ht = [], lc(e);
}
function yt(e) {
  if (ht.length === 0 && !Jt) {
    var t = ht;
    queueMicrotask(() => {
      t === ht && Oo();
    });
  }
  ht.push(e);
}
function Uc() {
  for (; ht.length > 0; )
    Oo();
}
function To(e) {
  var t = T;
  if (t === null)
    return B.f |= rt, e;
  if ((t.f & ut) === 0 && (t.f & Mt) === 0)
    throw e;
  tt(e, t);
}
function tt(e, t) {
  for (; t !== null; ) {
    if ((t.f & Er) !== 0) {
      if ((t.f & ut) === 0)
        throw e;
      try {
        t.b.error(e);
        return;
      } catch (n) {
        e = n;
      }
    }
    t = t.parent;
  }
  throw e;
}
const zc = -7169;
function W(e, t) {
  e.f = e.f & zc | t;
}
function qr(e) {
  (e.f & be) !== 0 || e.deps === null ? W(e, Q) : W(e, Ne);
}
function Bo(e) {
  if (e !== null)
    for (const t of e)
      (t.f & ie) === 0 || (t.f & Et) === 0 || (t.f ^= Et, Bo(
        /** @type {Derived} */
        t.deps
      ));
}
function No(e, t, n) {
  (e.f & ne) !== 0 ? t.add(e) : (e.f & Ne) !== 0 && n.add(e), Bo(e.deps), W(e, Q);
}
let sr = null, St = null, M = null, kr = null, Ae = null, Ar = null, Jt = !1, ar = !1, $t = null, En = null;
var Hi = 0;
let Dc = 1;
class Ze {
  id = Dc++;
  /** True as soon as `#process` was called */
  #e = !1;
  linked = !0;
  /** @type {Batch | null} */
  #t = null;
  /** @type {Batch | null} */
  #i = null;
  /** @type {Map<Effect, ReturnType<typeof deferred<any>>>} */
  async_deriveds = /* @__PURE__ */ new Map();
  /**
   * The current values of any signals that are updated in this batch.
   * Tuple format: [value, is_derived] (note: is_derived is false for deriveds, too, if they were overridden via assignment)
   * They keys of this map are identical to `this.#previous`
   * @type {Map<Value, [any, boolean]>}
   */
  current = /* @__PURE__ */ new Map();
  /**
   * The values of any signals (sources and deriveds) that are updated in this batch _before_ those updates took place.
   * They keys of this map are identical to `this.#current`
   * @type {Map<Value, any>}
   */
  previous = /* @__PURE__ */ new Map();
  /**
   * Async effects which this batch doesn't take into account anymore when calculating blockers,
   * as it has a value for it already.
   * @type {Set<Effect>}
   */
  unblocked = /* @__PURE__ */ new Set();
  /**
   * When the batch is committed (and the DOM is updated), we need to remove old branches
   * and append new ones by calling the functions added inside (if/each/key/etc) blocks
   * @type {Set<(batch: Batch) => void>}
   */
  #u = /* @__PURE__ */ new Set();
  /**
   * If a fork is discarded, we need to destroy any effects that are no longer needed
   * @type {Set<(batch: Batch) => void>}
   */
  #n = /* @__PURE__ */ new Set();
  /**
   * Callbacks that should run only when a fork is committed.
   * @type {Set<(batch: Batch) => void>}
   */
  #o = /* @__PURE__ */ new Set();
  /**
   * The number of async effects that are currently in flight
   */
  #r = 0;
  /**
   * Async effects that are currently in flight, _not_ inside a pending boundary
   * @type {Map<Effect, number>}
   */
  #s = /* @__PURE__ */ new Map();
  /**
   * A deferred that resolves when the batch is committed, used with `settled()`
   * TODO replace with Promise.withResolvers once supported widely enough
   * @type {{ promise: Promise<void>, resolve: (value?: any) => void, reject: (reason: unknown) => void } | null}
   */
  #l = null;
  /**
   * The root effects that need to be flushed
   * @type {Effect[]}
   */
  #a = [];
  /**
   * Effects created while this batch was active.
   * @type {Effect[]}
   */
  #c = [];
  /**
   * Deferred effects (which run after async work has completed) that are DIRTY
   * @type {Set<Effect>}
   */
  #f = /* @__PURE__ */ new Set();
  /**
   * Deferred effects that are MAYBE_DIRTY
   * @type {Set<Effect>}
   */
  #h = /* @__PURE__ */ new Set();
  /**
   * A map of branches that still exist, but will be destroyed when this batch
   * is committed — we skip over these during `process`.
   * The value contains child effects that were dirty/maybe_dirty before being reset,
   * so they can be rescheduled if the branch survives.
   * @type {Map<Effect, { d: Effect[], m: Effect[] }>}
   */
  #p = /* @__PURE__ */ new Map();
  /**
   * Inverse of #skipped_branches which we need to tell prior batches to unskip them when committing
   * @type {Set<Effect>}
   */
  #d = /* @__PURE__ */ new Set();
  is_fork = !1;
  #b = !1;
  #_() {
    if (this.is_fork) return !0;
    for (const r of this.#s.keys()) {
      for (var t = r, n = !1; t.parent !== null; ) {
        if (this.#p.has(t)) {
          n = !0;
          break;
        }
        t = t.parent;
      }
      if (!n)
        return !0;
    }
    return !1;
  }
  /**
   * Add an effect to the #skipped_branches map and reset its children
   * @param {Effect} effect
   */
  skip_effect(t) {
    this.#p.has(t) || this.#p.set(t, { d: [], m: [] }), this.#d.delete(t);
  }
  /**
   * Remove an effect from the #skipped_branches map and reschedule
   * any tracked dirty/maybe_dirty child effects
   * @param {Effect} effect
   * @param {(e: Effect) => void} callback
   */
  unskip_effect(t, n = (r) => this.schedule(r)) {
    var r = this.#p.get(t);
    if (r) {
      this.#p.delete(t);
      for (var i of r.d)
        W(i, ne), n(i);
      for (i of r.m)
        W(i, Ne), n(i);
    }
    this.#d.add(t);
  }
  #w() {
    if (this.#e = !0, Hi++ > 1e3 && (this.#v(), Hc()), !this.#_()) {
      for (const a of this.#f)
        this.#h.delete(a), W(a, ne), this.schedule(a);
      for (const a of this.#h)
        W(a, Ne), this.schedule(a);
    }
    const t = this.#a;
    this.#a = [], this.apply();
    var n = $t = [], r = [], i = En = [];
    for (const a of t)
      try {
        this.#E(a, n, r);
      } catch (u) {
        throw zo(a), u;
      }
    if (M = null, i.length > 0) {
      var o = Ze.ensure();
      for (const a of i)
        o.schedule(a);
    }
    if ($t = null, En = null, this.#_()) {
      this.#g(r), this.#g(n);
      for (const [a, u] of this.#p)
        Uo(a, u);
      i.length > 0 && /** @type {unknown} */
      M.#w();
      return;
    }
    const s = this.#x();
    if (s) {
      s.#y(this);
      return;
    }
    this.#f.clear(), this.#h.clear();
    for (const a of this.#u) a(this);
    this.#u.clear(), kr = this, ji(r), ji(n), kr = null, this.#l?.resolve();
    var c = (
      /** @type {Batch | null} */
      /** @type {unknown} */
      M
    );
    if (this.linked && this.#r === 0 && this.#v(), this.#a.length > 0) {
      c === null && (c = this, this.#m());
      const a = c;
      a.#a.push(...this.#a.filter((u) => !a.#a.includes(u)));
    }
    c !== null && c.#w();
  }
  /**
   * Traverse the effect tree, executing effects or stashing
   * them for later execution as appropriate
   * @param {Effect} root
   * @param {Effect[]} effects
   * @param {Effect[]} render_effects
   */
  #E(t, n, r) {
    t.f ^= Q;
    for (var i = t.first; i !== null; ) {
      var o = i.f, s = (o & (Be | Ke)) !== 0, c = s && (o & Q) !== 0, a = c || (o & ye) !== 0 || this.#p.has(i);
      if (!a && i.fn !== null) {
        s ? i.f ^= Q : (o & Mt) !== 0 ? n.push(i) : fn(i) && ((o & ke) !== 0 && this.#h.add(i), Ht(i));
        var u = i.first;
        if (u !== null) {
          i = u;
          continue;
        }
      }
      for (; i !== null; ) {
        var f = i.next;
        if (f !== null) {
          i = f;
          break;
        }
        i = i.parent;
      }
    }
  }
  #x() {
    for (var t = this.#t; t !== null; ) {
      if (!t.is_fork) {
        for (const [n, [, r]] of this.current)
          if (t.current.has(n) && !r)
            return t;
      }
      t = t.#t;
    }
    return null;
  }
  /**
   * @param {Batch} batch
   */
  #y(t) {
    for (const [r, i] of t.current)
      !this.previous.has(r) && t.previous.has(r) && this.previous.set(r, t.previous.get(r)), this.current.set(r, i);
    for (const [r, i] of t.async_deriveds) {
      const o = this.async_deriveds.get(r);
      o && i.promise.then(o.resolve);
    }
    const n = (r) => {
      var i = r.reactions;
      if (i !== null)
        for (const c of i) {
          var o = c.f;
          if ((o & ie) !== 0)
            n(
              /** @type {Derived} */
              c
            );
          else {
            var s = (
              /** @type {Effect} */
              c
            );
            o & (Ot | ke) && !this.async_deriveds.has(s) && (this.#h.delete(s), W(s, ne), this.schedule(s));
          }
        }
    };
    for (const r of this.current.keys())
      n(r);
    this.oncommit(() => t.discard()), t.#v(), M = this, this.#w();
  }
  /**
   * @param {Effect[]} effects
   */
  #g(t) {
    for (var n = 0; n < t.length; n += 1)
      No(t[n], this.#f, this.#h);
  }
  /**
   * Associate a change to a given source with the current
   * batch, noting its previous and current values
   * @param {Value} source
   * @param {any} value
   * @param {boolean} [is_derived]
   */
  capture(t, n, r = !1) {
    t.v !== te && !this.previous.has(t) && this.previous.set(t, t.v), (t.f & rt) === 0 && (this.current.set(t, [n, r]), Ae?.set(t, n)), this.is_fork || (t.v = n);
  }
  activate() {
    M = this;
  }
  deactivate() {
    M = null, Ae = null;
  }
  flush() {
    try {
      ar = !0, M = this, this.#w();
    } finally {
      Hi = 0, Ar = null, $t = null, En = null, ar = !1, M = null, Ae = null, mt.clear();
    }
  }
  discard() {
    for (const t of this.#n) t(this);
    this.#n.clear(), this.#o.clear(), this.#v();
  }
  /**
   * @param {Effect} effect
   */
  register_created_effect(t) {
    this.#c.push(t);
  }
  #k() {
    this.#v();
    for (let f = sr; f !== null; f = f.#i) {
      var t = f.id < this.id, n = [];
      for (const [h, [b, p]] of this.current) {
        if (f.current.has(h)) {
          var r = (
            /** @type {[any, boolean]} */
            f.current.get(h)[0]
          );
          if (t && b !== r)
            f.current.set(h, [b, p]);
          else
            continue;
        }
        n.push(h);
      }
      if (t)
        for (const [h, b] of this.async_deriveds) {
          const p = f.async_deriveds.get(h);
          p && b.promise.then(p.resolve);
        }
      if (f.#e) {
        var i = [...f.current.keys()].filter((h) => !this.current.has(h));
        if (i.length === 0)
          t && f.discard();
        else if (n.length > 0) {
          if (t)
            for (const h of this.#d)
              f.unskip_effect(h, (b) => {
                (b.f & (ke | Ot)) !== 0 ? f.schedule(b) : f.#g([b]);
              });
          f.activate();
          var o = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map();
          for (var c of n)
            Mo(c, i, o, s);
          s = /* @__PURE__ */ new Map();
          var a = [...f.current.keys()].filter(
            (h) => this.current.has(h) ? (
              /** @type {[any, boolean]} */
              this.current.get(h)[0] !== h.v
            ) : !0
          );
          if (a.length > 0)
            for (const h of this.#c)
              (h.f & (Te | ye | On)) === 0 && Vr(h, a, s) && ((h.f & (Ot | ke)) !== 0 ? (W(h, ne), f.schedule(h)) : f.#f.add(h));
          if (f.#a.length > 0) {
            f.apply();
            for (var u of f.#a)
              f.#E(u, [], []);
            f.#a = [];
          }
          f.deactivate();
        }
      }
    }
  }
  /**
   * @param {boolean} blocking
   * @param {Effect} effect
   */
  increment(t, n) {
    if (this.#r += 1, t) {
      let r = this.#s.get(n) ?? 0;
      this.#s.set(n, r + 1);
    }
  }
  /**
   * @param {boolean} blocking
   * @param {Effect} effect
   */
  decrement(t, n) {
    if (this.#r -= 1, t) {
      let r = this.#s.get(n) ?? 0;
      r === 1 ? this.#s.delete(n) : this.#s.set(n, r - 1);
    }
    this.#b || (this.#b = !0, yt(() => {
      this.#b = !1, this.linked && this.flush();
    }));
  }
  /**
   * @param {Set<Effect>} dirty_effects
   * @param {Set<Effect>} maybe_dirty_effects
   */
  transfer_effects(t, n) {
    for (const r of t)
      this.#f.add(r);
    for (const r of n)
      this.#h.add(r);
    t.clear(), n.clear();
  }
  /** @param {(batch: Batch) => void} fn */
  oncommit(t) {
    this.#u.add(t);
  }
  /** @param {(batch: Batch) => void} fn */
  ondiscard(t) {
    this.#n.add(t);
  }
  /** @param {(batch: Batch) => void} fn */
  on_fork_commit(t) {
    this.#o.add(t);
  }
  run_fork_commit_callbacks() {
    for (const t of this.#o) t(this);
    this.#o.clear();
  }
  settled() {
    return (this.#l ??= ko()).promise;
  }
  static ensure() {
    if (M === null) {
      const t = M = new Ze();
      t.#m(), !ar && !Jt && yt(() => {
        t.#e || t.flush();
      });
    }
    return M;
  }
  apply() {
    {
      Ae = null;
      return;
    }
  }
  /**
   *
   * @param {Effect} effect
   */
  schedule(t) {
    if (Ar = t, t.b?.is_pending && (t.f & (Mt | an | Hr)) !== 0 && (t.f & ut) === 0) {
      t.b.defer_effect(t);
      return;
    }
    for (var n = t; n.parent !== null; ) {
      n = n.parent;
      var r = n.f;
      if ($t !== null && n === T && (B === null || (B.f & ie) === 0))
        return;
      if ((r & (Ke | Be)) !== 0) {
        if ((r & Q) === 0)
          return;
        n.f ^= Q;
      }
    }
    this.#a.push(n);
  }
  #m() {
    St === null ? sr = St = this : (St.#i = this, this.#t = St), St = this;
  }
  #v() {
    var t = this.#t, n = this.#i;
    t === null ? sr = n : t.#i = n, n === null ? St = t : n.#t = t, this.linked = !1;
  }
}
function Po(e) {
  var t = Jt;
  Jt = !0;
  try {
    for (var n; ; ) {
      if (Uc(), M === null)
        return (
          /** @type {T} */
          n
        );
      M.flush();
    }
  } finally {
    Jt = t;
  }
}
function Hc() {
  try {
    vc();
  } catch (e) {
    tt(e, Ar);
  }
}
let He = null;
function ji(e) {
  var t = e.length;
  if (t !== 0) {
    for (var n = 0; n < t; ) {
      var r = e[n++];
      if ((r.f & (Te | ye)) === 0 && fn(r) && (He = /* @__PURE__ */ new Set(), Ht(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && es(r), He?.size > 0)) {
        mt.clear();
        for (const i of He) {
          if ((i.f & (Te | ye)) !== 0) continue;
          const o = [i];
          let s = i.parent;
          for (; s !== null; )
            He.has(s) && (He.delete(s), o.push(s)), s = s.parent;
          for (let c = o.length - 1; c >= 0; c--) {
            const a = o[c];
            (a.f & (Te | ye)) === 0 && Ht(a);
          }
        }
        He.clear();
      }
    }
    He = null;
  }
}
function Mo(e, t, n, r) {
  if (!n.has(e) && (n.add(e), e.reactions !== null))
    for (const i of e.reactions) {
      const o = i.f;
      (o & ie) !== 0 ? Mo(
        /** @type {Derived} */
        i,
        t,
        n,
        r
      ) : (o & (Ot | ke)) !== 0 && (o & ne) === 0 && Vr(i, t, r) && (W(i, ne), Fr(
        /** @type {Effect} */
        i
      ));
    }
}
function Vr(e, t, n) {
  const r = n.get(e);
  if (r !== void 0) return r;
  if (e.deps !== null)
    for (const i of e.deps) {
      if (Pt.call(t, i))
        return !0;
      if ((i.f & ie) !== 0 && Vr(
        /** @type {Derived} */
        i,
        t,
        n
      ))
        return n.set(
          /** @type {Derived} */
          i,
          !0
        ), !0;
    }
  return n.set(e, !1), !1;
}
function Fr(e) {
  M.schedule(e);
}
function Uo(e, t) {
  if (!((e.f & Be) !== 0 && (e.f & Q) !== 0)) {
    (e.f & ne) !== 0 ? t.d.push(e) : (e.f & Ne) !== 0 && t.m.push(e), W(e, Q);
    for (var n = e.first; n !== null; )
      Uo(n, t), n = n.next;
  }
}
function zo(e) {
  W(e, Q);
  for (var t = e.first; t !== null; )
    zo(t), t = t.next;
}
function jc(e) {
  let t = 0, n = un(0), r;
  return () => {
    Gr() && (qe(n), Jo(() => (t === 0 && (r = ul(() => e(() => Qt(n)))), t += 1, () => {
      yt(() => {
        t -= 1, t === 0 && (r?.(), r = void 0, Qt(n));
      });
    })));
  };
}
var qc = nn | kt;
function Vc(e, t, n, r) {
  new Fc(e, t, n, r);
}
class Fc {
  /** @type {Boundary | null} */
  parent;
  is_pending = !1;
  /**
   * API-level transformError transform function. Transforms errors before they reach the `failed` snippet.
   * Inherited from parent boundary, or defaults to identity.
   * @type {(error: unknown) => unknown}
   */
  transform_error;
  /** @type {TemplateNode} */
  #e;
  /** @type {TemplateNode | null} */
  #t = J ? U : null;
  /** @type {BoundaryProps} */
  #i;
  /** @type {((anchor: Node) => void)} */
  #u;
  /** @type {Effect} */
  #n;
  /** @type {Effect | null} */
  #o = null;
  /** @type {Effect | null} */
  #r = null;
  /** @type {Effect | null} */
  #s = null;
  /** @type {DocumentFragment | null} */
  #l = null;
  #a = 0;
  #c = 0;
  #f = !1;
  /** @type {Set<Effect>} */
  #h = /* @__PURE__ */ new Set();
  /** @type {Set<Effect>} */
  #p = /* @__PURE__ */ new Set();
  /**
   * A source containing the number of pending async deriveds/expressions.
   * Only created if `$effect.pending()` is used inside the boundary,
   * otherwise updating the source results in needless `Batch.ensure()`
   * calls followed by no-op flushes
   * @type {Source<number> | null}
   */
  #d = null;
  #b = jc(() => (this.#d = un(this.#a), () => {
    this.#d = null;
  }));
  /**
   * @param {TemplateNode} node
   * @param {BoundaryProps} props
   * @param {((anchor: Node) => void)} children
   * @param {((error: unknown) => unknown) | undefined} [transform_error]
   */
  constructor(t, n, r, i) {
    this.#e = t, this.#i = n, this.#u = (o) => {
      var s = (
        /** @type {Effect} */
        T
      );
      s.b = this, s.f |= Er, r(o);
    }, this.parent = /** @type {Effect} */
    T.b, this.transform_error = i ?? this.parent?.transform_error ?? ((o) => o), this.#n = il(() => {
      if (J) {
        const o = (
          /** @type {Comment} */
          this.#t
        );
        jr();
        const s = o.data === Io;
        if (o.data.startsWith(Di)) {
          const a = JSON.parse(o.data.slice(Di.length));
          this.#w(a);
        } else s ? this.#E() : this.#_();
      } else
        this.#x();
    }, qc), J && (this.#e = U);
  }
  #_() {
    try {
      this.#o = ft(() => this.#u(this.#e));
    } catch (t) {
      this.error(t);
    }
  }
  /**
   * @param {unknown} error The deserialized error from the server's hydration comment
   */
  #w(t) {
    const n = this.#i.failed;
    n && (this.#s = ft(() => {
      n(
        this.#e,
        () => t,
        () => () => {
        }
      );
    }));
  }
  #E() {
    const t = this.#i.pending;
    t && (this.is_pending = !0, this.#r = ft(() => t(this.#e)), yt(() => {
      var n = this.#l = document.createDocumentFragment(), r = We();
      n.append(r), this.#o = this.#g(() => ft(() => this.#u(r))), this.#c === 0 && (this.#e.before(n), this.#l = null, xn(
        /** @type {Effect} */
        this.#r,
        () => {
          this.#r = null;
        }
      ), this.#y(
        /** @type {Batch} */
        M
      ));
    }));
  }
  #x() {
    try {
      if (this.is_pending = this.has_pending_snippet(), this.#c = 0, this.#a = 0, this.#o = ft(() => {
        this.#u(this.#e);
      }), this.#c > 0) {
        var t = this.#l = document.createDocumentFragment();
        al(this.#o, t);
        const n = (
          /** @type {(anchor: Node) => void} */
          this.#i.pending
        );
        this.#r = ft(() => n(this.#e));
      } else
        this.#y(
          /** @type {Batch} */
          M
        );
    } catch (n) {
      this.error(n);
    }
  }
  /**
   * @param {Batch} batch
   */
  #y(t) {
    this.is_pending = !1, t.transfer_effects(this.#h, this.#p);
  }
  /**
   * Defer an effect inside a pending boundary until the boundary resolves
   * @param {Effect} effect
   */
  defer_effect(t) {
    No(t, this.#h, this.#p);
  }
  /**
   * Returns `false` if the effect exists inside a boundary whose pending snippet is shown
   * @returns {boolean}
   */
  is_rendered() {
    return !this.is_pending && (!this.parent || this.parent.is_rendered());
  }
  has_pending_snippet() {
    return !!this.#i.pending;
  }
  /**
   * @template T
   * @param {() => T} fn
   */
  #g(t) {
    var n = T, r = B, i = ce;
    Pe(this.#n), ve(this.#n), zt(this.#n.ctx);
    try {
      return Ze.ensure(), t();
    } catch (o) {
      return To(o), null;
    } finally {
      Pe(n), ve(r), zt(i);
    }
  }
  /**
   * Updates the pending count associated with the currently visible pending snippet,
   * if any, such that we can replace the snippet with content once work is done
   * @param {1 | -1} d
   * @param {Batch} batch
   */
  #k(t, n) {
    if (!this.has_pending_snippet()) {
      this.parent && this.parent.#k(t, n);
      return;
    }
    this.#c += t, this.#c === 0 && (this.#y(n), this.#r && xn(this.#r, () => {
      this.#r = null;
    }), this.#l && (this.#e.before(this.#l), this.#l = null));
  }
  /**
   * Update the source that powers `$effect.pending()` inside this boundary,
   * and controls when the current `pending` snippet (if any) is removed.
   * Do not call from inside the class
   * @param {1 | -1} d
   * @param {Batch} batch
   */
  update_pending_count(t, n) {
    this.#k(t, n), this.#a += t, !(!this.#d || this.#f) && (this.#f = !0, yt(() => {
      this.#f = !1, this.#d && Pn(this.#d, this.#a);
    }));
  }
  get_effect_pending() {
    return this.#b(), qe(
      /** @type {Source<number>} */
      this.#d
    );
  }
  /** @param {unknown} error */
  error(t) {
    if (!this.#i.onerror && !this.#i.failed)
      throw t;
    M?.is_fork ? (this.#o && M.skip_effect(this.#o), this.#r && M.skip_effect(this.#r), this.#s && M.skip_effect(this.#s), M.on_fork_commit(() => {
      this.#m(t);
    })) : this.#m(t);
  }
  /**
   * @param {unknown} error
   */
  #m(t) {
    this.#o && (Ie(this.#o), this.#o = null), this.#r && (Ie(this.#r), this.#r = null), this.#s && (Ie(this.#s), this.#s = null), J && (Re(
      /** @type {TemplateNode} */
      this.#t
    ), Lc(), Re(Oc()));
    var n = this.#i.onerror;
    let r = this.#i.failed;
    var i = !1, o = !1;
    const s = () => {
      if (i) {
        Cc();
        return;
      }
      i = !0, o && Ac(), this.#s !== null && xn(this.#s, () => {
        this.#s = null;
      }), this.#g(() => {
        this.#x();
      });
    }, c = (a) => {
      try {
        o = !0, n?.(a, s), o = !1;
      } catch (u) {
        tt(u, this.#n && this.#n.parent);
      }
      r && (this.#s = this.#g(() => {
        try {
          return ft(() => {
            var u = (
              /** @type {Effect} */
              T
            );
            u.b = this, u.f |= Er, r(
              this.#e,
              () => a,
              () => s
            );
          });
        } catch (u) {
          return tt(
            u,
            /** @type {Effect} */
            this.#n.parent
          ), null;
        }
      }));
    };
    yt(() => {
      var a;
      try {
        a = this.transform_error(t);
      } catch (u) {
        tt(u, this.#n && this.#n.parent);
        return;
      }
      a !== null && typeof a == "object" && typeof /** @type {any} */
      a.then == "function" ? a.then(
        c,
        /** @param {unknown} e */
        (u) => tt(u, this.#n && this.#n.parent)
      ) : c(a);
    });
  }
}
function Kc(e, t, n, r) {
  const i = Kr;
  var o = e.filter((b) => !b.settled);
  if (n.length === 0 && o.length === 0) {
    r(t.map(i));
    return;
  }
  var s = (
    /** @type {Effect} */
    T
  ), c = Zc(), a = o.length === 1 ? o[0].promise : o.length > 1 ? Promise.all(o.map((b) => b.promise)) : null;
  function u(b) {
    if ((s.f & Te) === 0) {
      c();
      try {
        r(b);
      } catch (p) {
        tt(p, s);
      }
      Bn();
    }
  }
  var f = Do();
  if (n.length === 0) {
    a.then(() => u(t.map(i))).finally(f);
    return;
  }
  function h() {
    Promise.all(n.map((b) => /* @__PURE__ */ Wc(b))).then((b) => u([...t.map(i), ...b])).catch((b) => tt(b, s)).finally(f);
  }
  a ? a.then(() => {
    c(), h(), Bn();
  }) : h();
}
function Zc() {
  var e = (
    /** @type {Effect} */
    T
  ), t = B, n = ce, r = (
    /** @type {Batch} */
    M
  );
  return function(o = !0) {
    Pe(e), ve(t), zt(n), o && (e.f & Te) === 0 && (r?.activate(), r?.apply());
  };
}
function Bn(e = !0) {
  Pe(null), ve(null), zt(null), e && M?.deactivate();
}
function Do() {
  var e = (
    /** @type {Effect} */
    T
  ), t = (
    /** @type {Boundary} */
    e.b
  ), n = (
    /** @type {Batch} */
    M
  ), r = t.is_rendered();
  return t.update_pending_count(1, n), n.increment(r, e), () => {
    t.update_pending_count(-1, n), n.decrement(r, e);
  };
}
// @__NO_SIDE_EFFECTS__
function Kr(e) {
  var t = ie | ne;
  return T !== null && (T.f |= kt), {
    ctx: ce,
    deps: null,
    effects: null,
    equals: $o,
    f: t,
    fn: e,
    reactions: null,
    rv: 0,
    v: (
      /** @type {V} */
      te
    ),
    wv: 0,
    parent: T,
    ac: null
  };
}
const wn = Symbol("obsolete");
// @__NO_SIDE_EFFECTS__
function Wc(e, t, n) {
  let r = (
    /** @type {Effect | null} */
    T
  );
  r === null && wc();
  var i = (
    /** @type {Promise<V>} */
    /** @type {unknown} */
    void 0
  ), o = un(
    /** @type {V} */
    te
  ), s = !B, c = /* @__PURE__ */ new Set();
  return rl(() => {
    var a = (
      /** @type {Effect} */
      T
    ), u = ko();
    i = u.promise;
    try {
      Promise.resolve(e()).then(u.resolve, (p) => {
        p !== Kn && u.reject(p);
      }).finally(Bn);
    } catch (p) {
      u.reject(p), Bn();
    }
    var f = (
      /** @type {Batch} */
      M
    );
    if (s) {
      if ((a.f & ut) !== 0)
        var h = Do();
      if (
        /** @type {Boundary} */
        r.b.is_rendered()
      )
        f.async_deriveds.get(a)?.reject(wn);
      else
        for (const p of c.values())
          p.reject(wn);
      c.add(u), f.async_deriveds.set(a, u);
    }
    const b = (p, l = void 0) => {
      h?.(), c.delete(u), l !== wn && (f.activate(), l ? (o.f |= rt, Pn(o, l)) : ((o.f & rt) !== 0 && (o.f ^= rt), Pn(o, p)), f.deactivate());
    };
    u.promise.then(b, (p) => b(null, p || "unknown"));
  }), Yo(() => {
    for (const a of c)
      a.reject(wn);
  }), new Promise((a) => {
    function u(f) {
      function h() {
        f === i ? a(o) : u(i);
      }
      f.then(h, h);
    }
    u(i);
  });
}
// @__NO_SIDE_EFFECTS__
function Rg(e) {
  const t = /* @__PURE__ */ Kr(e);
  return rs(t), t;
}
// @__NO_SIDE_EFFECTS__
function $g(e) {
  const t = /* @__PURE__ */ Kr(e);
  return t.equals = Co, t;
}
function Gc(e) {
  var t = e.effects;
  if (t !== null) {
    e.effects = null;
    for (var n = 0; n < t.length; n += 1)
      Ie(
        /** @type {Effect} */
        t[n]
      );
  }
}
function Zr(e) {
  var t, n = T, r = e.parent;
  if (!at && r !== null && (r.f & (Te | ye)) !== 0)
    return $c(), e.v;
  Pe(r);
  try {
    e.f &= ~Et, Gc(e), t = as(e);
  } finally {
    Pe(n);
  }
  return t;
}
function Ho(e) {
  var t = Zr(e);
  if (!e.equals(t) && (e.wv = os(), (!M?.is_fork || e.deps === null) && (M !== null ? (M.capture(e, t, !0), kr?.capture(e, t, !0)) : e.v = t, e.deps === null))) {
    W(e, Q);
    return;
  }
  at || (Ae !== null ? (Gr() || M?.is_fork) && Ae.set(e, t) : qr(e));
}
function Yc(e) {
  if (e.effects !== null)
    for (const t of e.effects)
      (t.teardown || t.ac) && (t.teardown?.(), t.ac?.abort(Kn), t.teardown = cc, t.ac = null, rn(t, 0), Yr(t));
}
function jo(e) {
  if (e.effects !== null)
    for (const t of e.effects)
      t.teardown && Ht(t);
}
let Nn = /* @__PURE__ */ new Set();
const mt = /* @__PURE__ */ new Map();
let qo = !1;
function un(e, t) {
  var n = {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v: e,
    reactions: null,
    equals: $o,
    rv: 0,
    wv: 0
  };
  return n;
}
// @__NO_SIDE_EFFECTS__
function Ye(e, t) {
  const n = un(e);
  return rs(n), n;
}
// @__NO_SIDE_EFFECTS__
function Xc(e, t = !1, n = !0) {
  const r = un(e);
  return t || (r.equals = Co), r;
}
function Qe(e, t, n = !1) {
  B !== null && // since we are untracking the function inside `$inspect.with` we need to add this check
  // to ensure we error if state is set inside an inspect effect
  (!Se || (B.f & On) !== 0) && Lo() && (B.f & (ie | ke | Ot | On)) !== 0 && (me === null || !Pt.call(me, e)) && kc();
  let r = n ? Gt(t) : t;
  return Pn(e, r, En);
}
function Pn(e, t, n = null) {
  if (!e.equals(t)) {
    mt.set(e, at ? t : e.v);
    var r = Ze.ensure();
    if (r.capture(e, t), (e.f & ie) !== 0) {
      const i = (
        /** @type {Derived} */
        e
      );
      (e.f & ne) !== 0 && Zr(i), Ae === null && qr(i);
    }
    e.wv = os(), Vo(e, ne, n), T !== null && (T.f & Q) !== 0 && (T.f & (Be | Ke)) === 0 && (we === null ? cl([e]) : we.push(e)), !r.is_fork && Nn.size > 0 && !qo && Jc();
  }
  return t;
}
function Jc() {
  qo = !1;
  for (const e of Nn) {
    (e.f & Q) !== 0 && W(e, Ne);
    let t;
    try {
      t = fn(e);
    } catch {
      t = !0;
    }
    t && Ht(e);
  }
  Nn.clear();
}
function Qt(e) {
  Qe(e, e.v + 1);
}
function Vo(e, t, n) {
  var r = e.reactions;
  if (r !== null)
    for (var i = r.length, o = 0; o < i; o++) {
      var s = r[o], c = s.f, a = (c & ne) === 0;
      if (a && W(s, t), (c & On) !== 0)
        Nn.add(
          /** @type {Effect} */
          s
        );
      else if ((c & ie) !== 0) {
        var u = (
          /** @type {Derived} */
          s
        );
        Ae?.delete(u), (c & Et) === 0 && (c & be && (T === null || (T.f & Tn) === 0) && (s.f |= Et), Vo(u, Ne, n));
      } else if (a) {
        var f = (
          /** @type {Effect} */
          s
        );
        (c & ke) !== 0 && He !== null && He.add(f), n !== null ? n.push(f) : Fr(f);
      }
    }
}
function Gt(e) {
  if (typeof e != "object" || e === null || bt in e)
    return e;
  const t = xo(e);
  if (t !== sc && t !== ac)
    return e;
  var n = /* @__PURE__ */ new Map(), r = nc(e), i = /* @__PURE__ */ Ye(0), o = vt, s = (c) => {
    if (vt === o)
      return c();
    var a = B, u = vt;
    ve(null), Ki(o);
    var f = c();
    return ve(a), Ki(u), f;
  };
  return r && n.set("length", /* @__PURE__ */ Ye(
    /** @type {any[]} */
    e.length
  )), new Proxy(
    /** @type {any} */
    e,
    {
      defineProperty(c, a, u) {
        (!("value" in u) || u.configurable === !1 || u.enumerable === !1 || u.writable === !1) && Ec();
        var f = n.get(a);
        return f === void 0 ? s(() => {
          var h = /* @__PURE__ */ Ye(u.value);
          return n.set(a, h), h;
        }) : Qe(f, u.value, !0), !0;
      },
      deleteProperty(c, a) {
        var u = n.get(a);
        if (u === void 0) {
          if (a in c) {
            const f = s(() => /* @__PURE__ */ Ye(te));
            n.set(a, f), Qt(i);
          }
        } else
          Qe(u, te), Qt(i);
        return !0;
      },
      get(c, a, u) {
        if (a === bt)
          return e;
        var f = n.get(a), h = a in c;
        if (f === void 0 && (!h || Lt(c, a)?.writable) && (f = s(() => {
          var p = Gt(h ? c[a] : te), l = /* @__PURE__ */ Ye(p);
          return l;
        }), n.set(a, f)), f !== void 0) {
          var b = qe(f);
          return b === te ? void 0 : b;
        }
        return Reflect.get(c, a, u);
      },
      getOwnPropertyDescriptor(c, a) {
        var u = Reflect.getOwnPropertyDescriptor(c, a);
        if (u && "value" in u) {
          var f = n.get(a);
          f && (u.value = qe(f));
        } else if (u === void 0) {
          var h = n.get(a), b = h?.v;
          if (h !== void 0 && b !== te)
            return {
              enumerable: !0,
              configurable: !0,
              value: b,
              writable: !0
            };
        }
        return u;
      },
      has(c, a) {
        if (a === bt)
          return !0;
        var u = n.get(a), f = u !== void 0 && u.v !== te || Reflect.has(c, a);
        if (u !== void 0 || T !== null && (!f || Lt(c, a)?.writable)) {
          u === void 0 && (u = s(() => {
            var b = f ? Gt(c[a]) : te, p = /* @__PURE__ */ Ye(b);
            return p;
          }), n.set(a, u));
          var h = qe(u);
          if (h === te)
            return !1;
        }
        return f;
      },
      set(c, a, u, f) {
        var h = n.get(a), b = a in c;
        if (r && a === "length")
          for (var p = u; p < /** @type {Source<number>} */
          h.v; p += 1) {
            var l = n.get(p + "");
            l !== void 0 ? Qe(l, te) : p in c && (l = s(() => /* @__PURE__ */ Ye(te)), n.set(p + "", l));
          }
        if (h === void 0)
          (!b || Lt(c, a)?.writable) && (h = s(() => /* @__PURE__ */ Ye(void 0)), Qe(h, Gt(u)), n.set(a, h));
        else {
          b = h.v !== te;
          var d = s(() => Gt(u));
          Qe(h, d);
        }
        var w = Reflect.getOwnPropertyDescriptor(c, a);
        if (w?.set && w.set.call(f, u), !b) {
          if (r && typeof a == "string") {
            var g = (
              /** @type {Source<number>} */
              n.get("length")
            ), y = Number(a);
            Number.isInteger(y) && y >= g.v && Qe(g, y + 1);
          }
          Qt(i);
        }
        return !0;
      },
      ownKeys(c) {
        qe(i);
        var a = Reflect.ownKeys(c).filter((h) => {
          var b = n.get(h);
          return b === void 0 || b.v !== te;
        });
        for (var [u, f] of n)
          f.v !== te && !(u in c) && a.push(u);
        return a;
      },
      setPrototypeOf() {
        xc();
      }
    }
  );
}
function qi(e) {
  try {
    if (e !== null && typeof e == "object" && bt in e)
      return e[bt];
  } catch {
  }
  return e;
}
function Cg(e, t) {
  return Object.is(qi(e), qi(t));
}
var Vi, Fo, Ko, Zo;
function Sr() {
  if (Vi === void 0) {
    Vi = window, Fo = /Firefox/.test(navigator.userAgent);
    var e = Element.prototype, t = Node.prototype, n = Text.prototype;
    Ko = Lt(t, "firstChild").get, Zo = Lt(t, "nextSibling").get, Ui(e) && (e[hc] = void 0, e[dc] = null, e[pc] = void 0, e.__e = void 0), Ui(n) && (n[xr] = void 0);
  }
}
function We(e = "") {
  return document.createTextNode(e);
}
// @__NO_SIDE_EFFECTS__
function Dt(e) {
  return (
    /** @type {TemplateNode | null} */
    Ko.call(e)
  );
}
// @__NO_SIDE_EFFECTS__
function Ge(e) {
  return (
    /** @type {TemplateNode | null} */
    Zo.call(e)
  );
}
function Lg(e, t) {
  if (!J)
    return /* @__PURE__ */ Dt(e);
  var n = /* @__PURE__ */ Dt(U);
  if (n === null)
    n = U.appendChild(We());
  else if (t && n.nodeType !== cn) {
    var r = We();
    return n?.before(r), Re(r), r;
  }
  return t && Gn(
    /** @type {Text} */
    n
  ), Re(n), n;
}
function Og(e, t = !1) {
  if (!J) {
    var n = /* @__PURE__ */ Dt(e);
    return n instanceof Comment && n.data === "" ? /* @__PURE__ */ Ge(n) : n;
  }
  if (t) {
    if (U?.nodeType !== cn) {
      var r = We();
      return U?.before(r), Re(r), r;
    }
    Gn(
      /** @type {Text} */
      U
    );
  }
  return U;
}
function Tg(e, t = 1, n = !1) {
  let r = J ? U : e;
  for (var i; t--; )
    i = r, r = /** @type {TemplateNode} */
    /* @__PURE__ */ Ge(r);
  if (!J)
    return r;
  if (n) {
    if (r?.nodeType !== cn) {
      var o = We();
      return r === null ? i?.after(o) : r.before(o), Re(o), o;
    }
    Gn(
      /** @type {Text} */
      r
    );
  }
  return Re(r), r;
}
function Qc(e) {
  e.textContent = "";
}
function Bg() {
  return !1;
}
function Wo(e, t, n) {
  return (
    /** @type {T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : Element} */
    document.createElementNS(t ?? Rc, e, void 0)
  );
}
function Gn(e) {
  if (
    /** @type {string} */
    e.nodeValue.length < 65536
  )
    return;
  let t = e.nextSibling;
  for (; t !== null && t.nodeType === cn; )
    t.remove(), e.nodeValue += /** @type {string} */
    t.nodeValue, t = e.nextSibling;
}
function Wr(e) {
  var t = B, n = T;
  ve(null), Pe(null);
  try {
    return e();
  } finally {
    ve(t), Pe(n);
  }
}
function Go(e) {
  T === null && (B === null && mc(), yc()), at && bc();
}
function el(e, t) {
  var n = t.last;
  n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function Ee(e, t) {
  var n = T;
  n !== null && (n.f & ye) !== 0 && (e |= ye);
  var r = {
    ctx: ce,
    deps: null,
    nodes: null,
    f: e | ne | be,
    first: null,
    fn: t,
    last: null,
    next: null,
    parent: n,
    b: n && n.b,
    prev: null,
    teardown: null,
    wv: 0,
    ac: null
  };
  M?.register_created_effect(r);
  var i = r;
  if ((e & Mt) !== 0)
    $t !== null ? $t.push(r) : Ze.ensure().schedule(r);
  else if (t !== null) {
    try {
      Ht(r);
    } catch (s) {
      throw Ie(r), s;
    }
    i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && // either `null`, or a singular child
    (i.f & kt) === 0 && (i = i.first, (e & ke) !== 0 && (e & nn) !== 0 && i !== null && (i.f |= nn));
  }
  if (i !== null && (i.parent = n, n !== null && el(i, n), B !== null && (B.f & ie) !== 0 && (e & Ke) === 0)) {
    var o = (
      /** @type {Derived} */
      B
    );
    (o.effects ??= []).push(i);
  }
  return r;
}
function Gr() {
  return B !== null && !Se;
}
function Yo(e) {
  const t = Ee(an, null);
  return W(t, Q), t.teardown = e, t;
}
function Ng(e) {
  Go();
  var t = (
    /** @type {Effect} */
    T.f
  ), n = !B && (t & Be) !== 0 && (t & ut) === 0;
  if (n) {
    var r = (
      /** @type {ComponentContext} */
      ce
    );
    (r.e ??= []).push(e);
  } else
    return Xo(e);
}
function Xo(e) {
  return Ee(Mt | Ao, e);
}
function Pg(e) {
  return Go(), Ee(an | Ao, e);
}
function tl(e) {
  Ze.ensure();
  const t = Ee(Ke | kt, e);
  return () => {
    Ie(t);
  };
}
function nl(e) {
  Ze.ensure();
  const t = Ee(Ke | kt, e);
  return (n = {}) => new Promise((r) => {
    n.outro ? xn(t, () => {
      Ie(t), r(void 0);
    }) : (Ie(t), r(void 0));
  });
}
function Mg(e) {
  return Ee(Mt, e);
}
function rl(e) {
  return Ee(Ot | kt, e);
}
function Jo(e, t = 0) {
  return Ee(an | t, e);
}
function Ug(e, t = [], n = [], r = []) {
  Kc(r, t, n, (i) => {
    Ee(an, () => e(...i.map(qe)));
  });
}
function il(e, t = 0) {
  var n = Ee(ke | t, e);
  return n;
}
function zg(e, t = 0) {
  var n = Ee(Hr | t, e);
  return n;
}
function ft(e) {
  return Ee(Be | kt, e);
}
function Qo(e) {
  var t = e.teardown;
  if (t !== null) {
    const n = at, r = B;
    Fi(!0), ve(null);
    try {
      t.call(null);
    } finally {
      Fi(n), ve(r);
    }
  }
}
function Yr(e, t = !1) {
  var n = e.first;
  for (e.first = e.last = null; n !== null; ) {
    const i = n.ac;
    i !== null && Wr(() => {
      i.abort(Kn);
    });
    var r = n.next;
    (n.f & Ke) !== 0 ? n.parent = null : Ie(n, t), n = r;
  }
}
function ol(e) {
  for (var t = e.first; t !== null; ) {
    var n = t.next;
    (t.f & Be) === 0 && Ie(t), t = n;
  }
}
function Ie(e, t = !0) {
  var n = !1;
  (t || (e.f & uc) !== 0) && e.nodes !== null && e.nodes.end !== null && (sl(
    e.nodes.start,
    /** @type {TemplateNode} */
    e.nodes.end
  ), n = !0), W(e, zi), Yr(e, t && !n), rn(e, 0);
  var r = e.nodes && e.nodes.t;
  if (r !== null)
    for (const o of r)
      o.stop();
  Qo(e), e.f ^= zi, e.f |= Te;
  var i = e.parent;
  i !== null && i.first !== null && es(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function sl(e, t) {
  for (; e !== null; ) {
    var n = e === t ? null : /* @__PURE__ */ Ge(e);
    e.remove(), e = n;
  }
}
function es(e) {
  var t = e.parent, n = e.prev, r = e.next;
  n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function xn(e, t, n = !0) {
  var r = [];
  ts(e, r, !0);
  var i = () => {
    n && Ie(e), t && t();
  }, o = r.length;
  if (o > 0) {
    var s = () => --o || i();
    for (var c of r)
      c.out(s);
  } else
    i();
}
function ts(e, t, n) {
  if ((e.f & ye) === 0) {
    e.f ^= ye;
    var r = e.nodes && e.nodes.t;
    if (r !== null)
      for (const c of r)
        (c.is_global || n) && t.push(c);
    for (var i = e.first; i !== null; ) {
      var o = i.next;
      if ((i.f & Ke) === 0) {
        var s = (i.f & nn) !== 0 || // If this is a branch effect without a block effect parent,
        // it means the parent block effect was pruned. In that case,
        // transparency information was transferred to the branch effect.
        (i.f & Be) !== 0 && (e.f & ke) !== 0;
        ts(i, t, s ? n : !1);
      }
      i = o;
    }
  }
}
function Dg(e) {
  ns(e, !0);
}
function ns(e, t) {
  if ((e.f & ye) !== 0) {
    e.f ^= ye, (e.f & Q) === 0 && (W(e, ne), Ze.ensure().schedule(e));
    for (var n = e.first; n !== null; ) {
      var r = n.next, i = (n.f & nn) !== 0 || (n.f & Be) !== 0;
      ns(n, i ? t : !1), n = r;
    }
    var o = e.nodes && e.nodes.t;
    if (o !== null)
      for (const s of o)
        (s.is_global || t) && s.in();
  }
}
function al(e, t) {
  if (e.nodes)
    for (var n = e.nodes.start, r = e.nodes.end; n !== null; ) {
      var i = n === r ? null : /* @__PURE__ */ Ge(n);
      t.append(n), n = i;
    }
}
let kn = !1, at = !1;
function Fi(e) {
  at = e;
}
let B = null, Se = !1;
function ve(e) {
  B = e;
}
let T = null;
function Pe(e) {
  T = e;
}
let me = null;
function rs(e) {
  B !== null && (me === null ? me = [e] : me.push(e));
}
let ue = null, pe = 0, we = null;
function cl(e) {
  we = e;
}
let is = 1, pt = 0, vt = pt;
function Ki(e) {
  vt = e;
}
function os() {
  return ++is;
}
function fn(e) {
  var t = e.f;
  if ((t & ne) !== 0)
    return !0;
  if (t & ie && (e.f &= ~Et), (t & Ne) !== 0) {
    for (var n = (
      /** @type {Value[]} */
      e.deps
    ), r = n.length, i = 0; i < r; i++) {
      var o = n[i];
      if (fn(
        /** @type {Derived} */
        o
      ) && Ho(
        /** @type {Derived} */
        o
      ), o.wv > e.wv)
        return !0;
    }
    (t & be) !== 0 && // During time traveling we don't want to reset the status so that
    // traversal of the graph in the other batches still happens
    Ae === null && W(e, Q);
  }
  return !1;
}
function ss(e, t, n = !0) {
  var r = e.reactions;
  if (r !== null && !(me !== null && Pt.call(me, e)))
    for (var i = 0; i < r.length; i++) {
      var o = r[i];
      (o.f & ie) !== 0 ? ss(
        /** @type {Derived} */
        o,
        t,
        !1
      ) : t === o && (n ? W(o, ne) : (o.f & Q) !== 0 && W(o, Ne), Fr(
        /** @type {Effect} */
        o
      ));
    }
}
function as(e) {
  var t = ue, n = pe, r = we, i = B, o = me, s = ce, c = Se, a = vt, u = e.f;
  ue = /** @type {null | Value[]} */
  null, pe = 0, we = null, B = (u & (Be | Ke)) === 0 ? e : null, me = null, zt(e.ctx), Se = !1, vt = ++pt, e.ac !== null && (Wr(() => {
    e.ac.abort(Kn);
  }), e.ac = null);
  try {
    e.f |= Tn;
    var f = (
      /** @type {Function} */
      e.fn
    ), h = f();
    e.f |= ut;
    var b = e.deps, p = M?.is_fork;
    if (ue !== null) {
      var l;
      if (p || rn(e, pe), b !== null && pe > 0)
        for (b.length = pe + ue.length, l = 0; l < ue.length; l++)
          b[pe + l] = ue[l];
      else
        e.deps = b = ue;
      if (Gr() && (e.f & be) !== 0)
        for (l = pe; l < b.length; l++)
          (b[l].reactions ??= []).push(e);
    } else !p && b !== null && pe < b.length && (rn(e, pe), b.length = pe);
    if (Lo() && we !== null && !Se && b !== null && (e.f & (ie | Ne | ne)) === 0)
      for (l = 0; l < /** @type {Source[]} */
      we.length; l++)
        ss(
          we[l],
          /** @type {Effect} */
          e
        );
    if (i !== null && i !== e) {
      if (pt++, i.deps !== null)
        for (let d = 0; d < n; d += 1)
          i.deps[d].rv = pt;
      if (t !== null)
        for (const d of t)
          d.rv = pt;
      we !== null && (r === null ? r = we : r.push(.../** @type {Source[]} */
      we));
    }
    return (e.f & rt) !== 0 && (e.f ^= rt), h;
  } catch (d) {
    return To(d);
  } finally {
    e.f ^= Tn, ue = t, pe = n, we = r, B = i, me = o, zt(s), Se = c, vt = a;
  }
}
function ll(e, t) {
  let n = t.reactions;
  if (n !== null) {
    var r = rc.call(n, e);
    if (r !== -1) {
      var i = n.length - 1;
      i === 0 ? n = t.reactions = null : (n[r] = n[i], n.pop());
    }
  }
  if (n === null && (t.f & ie) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
  // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
  // allows us to skip the expensive work of disconnecting and immediately reconnecting it
  (ue === null || !Pt.call(ue, t))) {
    var o = (
      /** @type {Derived} */
      t
    );
    (o.f & be) !== 0 && (o.f ^= be, o.f &= ~Et), o.v !== te && qr(o), Yc(o), rn(o, 0);
  }
}
function rn(e, t) {
  var n = e.deps;
  if (n !== null)
    for (var r = t; r < n.length; r++)
      ll(e, n[r]);
}
function Ht(e) {
  var t = e.f;
  if ((t & Te) === 0) {
    W(e, Q);
    var n = T, r = kn;
    T = e, kn = !0;
    try {
      (t & (ke | Hr)) !== 0 ? ol(e) : Yr(e), Qo(e);
      var i = as(e);
      e.teardown = typeof i == "function" ? i : null, e.wv = is;
      var o;
      Eo && Bc && (e.f & ne) !== 0 && e.deps;
    } finally {
      kn = r, T = n;
    }
  }
}
async function Hg() {
  await Promise.resolve(), Po();
}
function qe(e) {
  var t = e.f, n = (t & ie) !== 0;
  if (B !== null && !Se) {
    var r = T !== null && (T.f & Te) !== 0;
    if (!r && (me === null || !Pt.call(me, e))) {
      var i = B.deps;
      if ((B.f & Tn) !== 0)
        e.rv < pt && (e.rv = pt, ue === null && i !== null && i[pe] === e ? pe++ : ue === null ? ue = [e] : ue.push(e));
      else {
        (B.deps ??= []).push(e);
        var o = e.reactions;
        o === null ? e.reactions = [B] : Pt.call(o, B) || o.push(B);
      }
    }
  }
  if (at && mt.has(e))
    return mt.get(e);
  if (n) {
    var s = (
      /** @type {Derived} */
      e
    );
    if (at) {
      var c = s.v;
      return ((s.f & Q) === 0 && s.reactions !== null || ls(s)) && (c = Zr(s)), mt.set(s, c), c;
    }
    var a = (s.f & be) === 0 && !Se && B !== null && (kn || (B.f & be) !== 0), u = (s.f & ut) === 0;
    fn(s) && (a && (s.f |= be), Ho(s)), a && !u && (jo(s), cs(s));
  }
  if (Ae?.has(e))
    return Ae.get(e);
  if ((e.f & rt) !== 0)
    throw e.v;
  return e.v;
}
function cs(e) {
  if (e.f |= be, e.deps !== null)
    for (const t of e.deps)
      (t.reactions ??= []).push(e), (t.f & ie) !== 0 && (t.f & be) === 0 && (jo(
        /** @type {Derived} */
        t
      ), cs(
        /** @type {Derived} */
        t
      ));
}
function ls(e) {
  if (e.v === te) return !0;
  if (e.deps === null) return !1;
  for (const t of e.deps)
    if (mt.has(t) || (t.f & ie) !== 0 && ls(
      /** @type {Derived} */
      t
    ))
      return !0;
  return !1;
}
function ul(e) {
  var t = Se;
  try {
    return Se = !0, e();
  } finally {
    Se = t;
  }
}
function jg(e) {
  if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
    if (bt in e)
      Ir(e);
    else if (!Array.isArray(e))
      for (let t in e) {
        const n = e[t];
        typeof n == "object" && n && bt in n && Ir(n);
      }
  }
}
function Ir(e, t = /* @__PURE__ */ new Set()) {
  if (typeof e == "object" && e !== null && // We don't want to traverse DOM elements
  !(e instanceof EventTarget) && !t.has(e)) {
    t.add(e), e instanceof Date && e.getTime();
    for (let r in e)
      try {
        Ir(e[r], t);
      } catch {
      }
    const n = xo(e);
    if (n !== Object.prototype && n !== Array.prototype && n !== Map.prototype && n !== Set.prototype && n !== Date.prototype) {
      const r = oc(n);
      for (let i in r) {
        const o = r[i].get;
        if (o)
          try {
            o.call(e);
          } catch {
          }
      }
    }
  }
}
function qg(e) {
  return e.endsWith("capture") && e !== "gotpointercapture" && e !== "lostpointercapture";
}
const fl = [
  "beforeinput",
  "click",
  "change",
  "dblclick",
  "contextmenu",
  "focusin",
  "focusout",
  "input",
  "keydown",
  "keyup",
  "mousedown",
  "mousemove",
  "mouseout",
  "mouseover",
  "mouseup",
  "pointerdown",
  "pointermove",
  "pointerout",
  "pointerover",
  "pointerup",
  "touchend",
  "touchmove",
  "touchstart"
];
function Vg(e) {
  return fl.includes(e);
}
const dl = {
  // no `class: 'className'` because we handle that separately
  formnovalidate: "formNoValidate",
  ismap: "isMap",
  nomodule: "noModule",
  playsinline: "playsInline",
  readonly: "readOnly",
  defaultvalue: "defaultValue",
  defaultchecked: "defaultChecked",
  srcobject: "srcObject",
  novalidate: "noValidate",
  allowfullscreen: "allowFullscreen",
  disablepictureinpicture: "disablePictureInPicture",
  disableremoteplayback: "disableRemotePlayback"
};
function Fg(e) {
  return e = e.toLowerCase(), dl[e] ?? e;
}
const hl = ["touchstart", "touchmove"];
function pl(e) {
  return hl.includes(e);
}
const gl = (
  /** @type {const} */
  ["textarea", "script", "style", "title"]
);
function Kg(e) {
  return gl.includes(
    /** @type {typeof RAW_TEXT_ELEMENTS[number]} */
    e
  );
}
const Yt = Symbol("events"), us = /* @__PURE__ */ new Set(), Rr = /* @__PURE__ */ new Set();
function Zg(e) {
  if (!J) return;
  e.removeAttribute("onload"), e.removeAttribute("onerror");
  const t = e.__e;
  t !== void 0 && (e.__e = void 0, queueMicrotask(() => {
    e.isConnected && e.dispatchEvent(t);
  }));
}
function fs(e, t, n, r = {}) {
  function i(o) {
    if (r.capture || $r.call(t, o), !o.cancelBubble)
      return Wr(() => n?.call(this, o));
  }
  return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? yt(() => {
    t.addEventListener(e, i, r);
  }) : t.addEventListener(e, i, r), i;
}
function Wg(e, t, n, r = {}) {
  var i = fs(t, e, n, r);
  return () => {
    e.removeEventListener(t, i, r);
  };
}
function Gg(e, t, n, r, i) {
  var o = { capture: r, passive: i }, s = fs(e, t, n, o);
  (t === document.body || // @ts-ignore
  t === window || // @ts-ignore
  t === document || // Firefox has quirky behavior, it can happen that we still get "canplay" events when the element is already removed
  t instanceof HTMLMediaElement) && Yo(() => {
    t.removeEventListener(e, s, o);
  });
}
function Yg(e, t, n) {
  (t[Yt] ??= {})[e] = n;
}
function Xg(e) {
  for (var t = 0; t < e.length; t++)
    us.add(e[t]);
  for (var n of Rr)
    n(e);
}
let Zi = null;
function $r(e) {
  var t = this, n = (
    /** @type {Node} */
    t.ownerDocument
  ), r = e.type, i = e.composedPath?.() || [], o = (
    /** @type {null | Element} */
    i[0] || e.target
  );
  Zi = e;
  var s = 0, c = Zi === e && e[Yt];
  if (c) {
    var a = i.indexOf(c);
    if (a !== -1 && (t === document || t === /** @type {any} */
    window)) {
      e[Yt] = t;
      return;
    }
    var u = i.indexOf(t);
    if (u === -1)
      return;
    a <= u && (s = a);
  }
  if (o = /** @type {Element} */
  i[s] || e.target, o !== t) {
    Ln(e, "currentTarget", {
      configurable: !0,
      get() {
        return o || n;
      }
    });
    var f = B, h = T;
    ve(null), Pe(null);
    try {
      for (var b, p = []; o !== null; ) {
        var l = o.assignedSlot || o.parentNode || /** @type {any} */
        o.host || null;
        try {
          var d = o[Yt]?.[r];
          d != null && (!/** @type {any} */
          o.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
          // -> the target could not have been disabled because it emits the event in the first place
          e.target === o) && d.call(o, e);
        } catch (w) {
          b ? p.push(w) : b = w;
        }
        if (e.cancelBubble || l === t || l === null)
          break;
        o = l;
      }
      if (b) {
        for (let w of p)
          queueMicrotask(() => {
            throw w;
          });
        throw b;
      }
    } finally {
      e[Yt] = t, delete e.currentTarget, ve(f), Pe(h);
    }
  }
}
const wl = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", {
    /** @param {string} html */
    createHTML: (e) => e
  })
);
function bl(e) {
  return (
    /** @type {string} */
    wl?.createHTML(e) ?? e
  );
}
function yl(e) {
  var t = Wo("template");
  return t.innerHTML = bl(e.replaceAll("<!>", "<!---->")), t.content;
}
function it(e, t) {
  var n = (
    /** @type {Effect} */
    T
  );
  n.nodes === null && (n.nodes = { start: e, end: t, a: null, t: null });
}
// @__NO_SIDE_EFFECTS__
function Jg(e, t) {
  var n = (t & Sc) !== 0, r = (t & Ic) !== 0, i, o = !e.startsWith("<!>");
  return () => {
    if (J)
      return it(U, null), U;
    i === void 0 && (i = yl(o ? e : "<!>" + e), n || (i = /** @type {TemplateNode} */
    /* @__PURE__ */ Dt(i)));
    var s = (
      /** @type {TemplateNode} */
      r || Fo ? document.importNode(i, !0) : i.cloneNode(!0)
    );
    if (n) {
      var c = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ Dt(s)
      ), a = (
        /** @type {TemplateNode} */
        s.lastChild
      );
      it(c, a);
    } else
      it(s, s);
    return s;
  };
}
function Qg(e = "") {
  if (!J) {
    var t = We(e + "");
    return it(t, t), t;
  }
  var n = U;
  return n.nodeType !== cn ? (n.before(n = We()), Re(n)) : Gn(
    /** @type {Text} */
    n
  ), it(n, n), n;
}
function e0() {
  if (J)
    return it(U, null), U;
  var e = document.createDocumentFragment(), t = document.createComment(""), n = We();
  return e.append(t, n), it(t, n), e;
}
function ml(e, t) {
  if (J) {
    var n = (
      /** @type {Effect & { nodes: EffectNodes }} */
      T
    );
    ((n.f & ut) === 0 || n.nodes.end === null) && (n.nodes.end = U), jr();
    return;
  }
  e !== null && e.before(
    /** @type {Node} */
    t
  );
}
function t0() {
  if (J && U && U.nodeType === ln && U.textContent?.startsWith("$")) {
    const e = U.textContent.substring(1);
    return jr(), e;
  }
  return (window.__svelte ??= {}).uid ??= 1, `c${window.__svelte.uid++}`;
}
function n0(e, t) {
  var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
  n !== /** @type {any} */
  (e[xr] ??= e.nodeValue) && (e[xr] = n, e.nodeValue = `${n}`);
}
function Xr(e, t) {
  return ds(e, t);
}
function vl(e, t) {
  Sr(), t.intro = t.intro ?? !1;
  const n = t.target, r = J, i = U;
  try {
    for (var o = /* @__PURE__ */ Dt(n); o && (o.nodeType !== ln || /** @type {Comment} */
    o.data !== So); )
      o = /* @__PURE__ */ Ge(o);
    if (!o)
      throw Ut;
    gn(!0), Re(
      /** @type {Comment} */
      o
    );
    const s = ds(e, { ...t, anchor: o });
    return gn(!1), /**  @type {Exports} */
    s;
  } catch (s) {
    if (s instanceof Error && s.message.split(`
`).some((c) => c.startsWith("https://svelte.dev/e/")))
      throw s;
    return s !== Ut && console.warn("Failed to hydrate: ", s), t.recover === !1 && _c(), Sr(), Qc(n), gn(!1), Xr(e, t);
  } finally {
    gn(r), Re(i);
  }
}
const bn = /* @__PURE__ */ new Map();
function ds(e, { target: t, anchor: n, props: r = {}, events: i, context: o, intro: s = !0, transformError: c }) {
  Sr();
  var a = void 0, u = nl(() => {
    var f = n ?? t.appendChild(We());
    Vc(
      /** @type {TemplateNode} */
      f,
      {
        pending: () => {
        }
      },
      (p) => {
        Nc({});
        var l = (
          /** @type {ComponentContext} */
          ce
        );
        if (o && (l.c = o), i && (r.$$events = i), J && it(
          /** @type {TemplateNode} */
          p,
          null
        ), a = e(p, r) || {}, J && (T.nodes.end = U, U === null || U.nodeType !== ln || /** @type {Comment} */
        U.data !== Ro))
          throw Zn(), Ut;
        Pc();
      },
      c
    );
    var h = /* @__PURE__ */ new Set(), b = (p) => {
      for (var l = 0; l < p.length; l++) {
        var d = p[l];
        if (!h.has(d)) {
          h.add(d);
          var w = pl(d);
          for (const m of [t, document]) {
            var g = bn.get(m);
            g === void 0 && (g = /* @__PURE__ */ new Map(), bn.set(m, g));
            var y = g.get(d);
            y === void 0 ? (m.addEventListener(d, $r, { passive: w }), g.set(d, 1)) : g.set(d, y + 1);
          }
        }
      }
    };
    return b(ic(us)), Rr.add(b), () => {
      for (var p of h)
        for (const w of [t, document]) {
          var l = (
            /** @type {Map<string, number>} */
            bn.get(w)
          ), d = (
            /** @type {number} */
            l.get(p)
          );
          --d == 0 ? (w.removeEventListener(p, $r), l.delete(p), l.size === 0 && bn.delete(w)) : l.set(p, d);
        }
      Rr.delete(b), f !== n && f.parentNode?.removeChild(f);
    };
  });
  return Cr.set(a, u), a;
}
let Cr = /* @__PURE__ */ new WeakMap();
function hs(e, t) {
  const n = Cr.get(e);
  return n ? (Cr.delete(e), n(t)) : Promise.resolve();
}
function _l(e) {
  return new El(e);
}
class El {
  /** @type {any} */
  #e;
  /** @type {Record<string, any>} */
  #t;
  /**
   * @param {ComponentConstructorOptions & {
   *  component: any;
   * }} options
   */
  constructor(t) {
    var n = /* @__PURE__ */ new Map(), r = (o, s) => {
      var c = /* @__PURE__ */ Xc(s, !1, !1);
      return n.set(o, c), c;
    };
    const i = new Proxy(
      { ...t.props || {}, $$events: {} },
      {
        get(o, s) {
          return qe(n.get(s) ?? r(s, Reflect.get(o, s)));
        },
        has(o, s) {
          return s === fc ? !0 : (qe(n.get(s) ?? r(s, Reflect.get(o, s))), Reflect.has(o, s));
        },
        set(o, s, c) {
          return Qe(n.get(s) ?? r(s, c), c), Reflect.set(o, s, c);
        }
      }
    );
    this.#t = (t.hydrate ? vl : Xr)(t.component, {
      target: t.target,
      anchor: t.anchor,
      props: i,
      context: t.context,
      intro: t.intro ?? !1,
      recover: t.recover,
      transformError: t.transformError
    }), (!t?.props?.$$host || t.sync === !1) && Po(), this.#e = i.$$events;
    for (const o of Object.keys(this.#t))
      o === "$set" || o === "$destroy" || o === "$on" || Ln(this, o, {
        get() {
          return this.#t[o];
        },
        /** @param {any} value */
        set(s) {
          this.#t[o] = s;
        },
        enumerable: !0
      });
    this.#t.$set = /** @param {Record<string, any>} next */
    (o) => {
      Object.assign(i, o);
    }, this.#t.$destroy = () => {
      hs(this.#t);
    };
  }
  /** @param {Record<string, any>} props */
  $set(t) {
    this.#t.$set(t);
  }
  /**
   * @param {string} event
   * @param {(...args: any[]) => any} callback
   * @returns {any}
   */
  $on(t, n) {
    this.#e[t] = this.#e[t] || [];
    const r = (...i) => n.call(this, ...i);
    return this.#e[t].push(r), () => {
      this.#e[t] = this.#e[t].filter(
        /** @param {any} fn */
        (i) => i !== r
      );
    };
  }
  $destroy() {
    this.#t.$destroy();
  }
}
let ps;
typeof HTMLElement == "function" && (ps = class extends HTMLElement {
  /** The Svelte component constructor */
  $$ctor;
  /** Slots */
  $$s;
  /** @type {any} The Svelte component instance */
  $$c;
  /** Whether or not the custom element is connected */
  $$cn = !1;
  /** @type {Record<string, any>} Component props data */
  $$d = {};
  /** `true` if currently in the process of reflecting component props back to attributes */
  $$r = !1;
  /** @type {Record<string, CustomElementPropDefinition>} Props definition (name, reflected, type etc) */
  $$p_d = {};
  /** @type {Record<string, EventListenerOrEventListenerObject[]>} Event listeners */
  $$l = {};
  /** @type {Map<EventListenerOrEventListenerObject, Function>} Event listener unsubscribe functions */
  $$l_u = /* @__PURE__ */ new Map();
  /** @type {any} The managed render effect for reflecting attributes */
  $$me;
  /** @type {ShadowRoot | null} The ShadowRoot of the custom element */
  $$shadowRoot = null;
  /**
   * @param {*} $$componentCtor
   * @param {*} $$slots
   * @param {ShadowRootInit | undefined} shadow_root_init
   */
  constructor(e, t, n) {
    super(), this.$$ctor = e, this.$$s = t, n && (this.$$shadowRoot = this.attachShadow(n));
  }
  /**
   * @param {string} type
   * @param {EventListenerOrEventListenerObject} listener
   * @param {boolean | AddEventListenerOptions} [options]
   */
  addEventListener(e, t, n) {
    if (this.$$l[e] = this.$$l[e] || [], this.$$l[e].push(t), this.$$c) {
      const r = this.$$c.$on(e, t);
      this.$$l_u.set(t, r);
    }
    super.addEventListener(e, t, n);
  }
  /**
   * @param {string} type
   * @param {EventListenerOrEventListenerObject} listener
   * @param {boolean | AddEventListenerOptions} [options]
   */
  removeEventListener(e, t, n) {
    if (super.removeEventListener(e, t, n), this.$$c) {
      const r = this.$$l_u.get(t);
      r && (r(), this.$$l_u.delete(t));
    }
  }
  async connectedCallback() {
    if (this.$$cn = !0, !this.$$c) {
      let e = function(r) {
        return (i) => {
          const o = Wo("slot");
          r !== "default" && (o.name = r), ml(i, o);
        };
      };
      if (await Promise.resolve(), !this.$$cn || this.$$c)
        return;
      const t = {}, n = xl(this);
      for (const r of this.$$s)
        r in n && (r === "default" && !this.$$d.children ? (this.$$d.children = e(r), t.default = !0) : t[r] = e(r));
      for (const r of this.attributes) {
        const i = this.$$g_p(r.name);
        i in this.$$d || (this.$$d[i] = An(i, r.value, this.$$p_d, "toProp"));
      }
      for (const r in this.$$p_d)
        !(r in this.$$d) && this[r] !== void 0 && (this.$$d[r] = this[r], delete this[r]);
      this.$$c = _l({
        component: this.$$ctor,
        target: this.$$shadowRoot || this,
        props: {
          ...this.$$d,
          $$slots: t,
          $$host: this
        }
      }), this.$$me = tl(() => {
        Jo(() => {
          this.$$r = !0;
          for (const r of Cn(this.$$c)) {
            if (!this.$$p_d[r]?.reflect) continue;
            this.$$d[r] = this.$$c[r];
            const i = An(
              r,
              this.$$d[r],
              this.$$p_d,
              "toAttribute"
            );
            i == null ? this.removeAttribute(this.$$p_d[r].attribute || r) : this.setAttribute(this.$$p_d[r].attribute || r, i);
          }
          this.$$r = !1;
        });
      });
      for (const r in this.$$l)
        for (const i of this.$$l[r]) {
          const o = this.$$c.$on(r, i);
          this.$$l_u.set(i, o);
        }
      this.$$l = {};
    }
  }
  // We don't need this when working within Svelte code, but for compatibility of people using this outside of Svelte
  // and setting attributes through setAttribute etc, this is helpful
  /**
   * @param {string} attr
   * @param {string} _oldValue
   * @param {string} newValue
   */
  attributeChangedCallback(e, t, n) {
    this.$$r || (e = this.$$g_p(e), this.$$d[e] = An(e, n, this.$$p_d, "toProp"), this.$$c?.$set({ [e]: this.$$d[e] }));
  }
  disconnectedCallback() {
    this.$$cn = !1, Promise.resolve().then(() => {
      !this.$$cn && this.$$c && (this.$$c.$destroy(), this.$$me(), this.$$c = void 0);
    });
  }
  /**
   * @param {string} attribute_name
   */
  $$g_p(e) {
    return Cn(this.$$p_d).find(
      (t) => this.$$p_d[t].attribute === e || !this.$$p_d[t].attribute && t.toLowerCase() === e
    ) || e;
  }
});
function An(e, t, n, r) {
  const i = n[e]?.type;
  if (t = i === "Boolean" && typeof t != "boolean" ? t != null : t, !r || !n[e])
    return t;
  if (r === "toAttribute")
    switch (i) {
      case "Object":
      case "Array":
        return t == null ? null : JSON.stringify(t);
      case "Boolean":
        return t ? "" : null;
      case "Number":
        return t ?? null;
      default:
        return t;
    }
  else
    switch (i) {
      case "Object":
      case "Array":
        return t && JSON.parse(t);
      case "Boolean":
        return t;
      // conversion already handled above
      case "Number":
        return t != null ? +t : t;
      default:
        return t;
    }
}
function xl(e) {
  const t = {};
  return e.childNodes.forEach((n) => {
    t[
      /** @type {Element} node */
      n.slot || "default"
    ] = !0;
  }), t;
}
function r0(e, t, n, r, i, o) {
  let s = class extends ps {
    constructor() {
      super(e, n, i), this.$$p_d = t;
    }
    static get observedAttributes() {
      return Cn(t).map(
        (c) => (t[c].attribute || c).toLowerCase()
      );
    }
  };
  return Cn(t).forEach((c) => {
    Ln(s.prototype, c, {
      get() {
        return this.$$c && c in this.$$c ? this.$$c[c] : this.$$d[c];
      },
      set(a) {
        a = An(c, a, t), this.$$d[c] = a;
        var u = this.$$c;
        if (u) {
          var f = Lt(u, c)?.get;
          f ? u[c] = a : u.$set({ [c]: a });
        }
      }
    });
  }), r.forEach((c) => {
    Ln(s.prototype, c, {
      get() {
        return this.$$c?.[c];
      }
    });
  }), e.element = /** @type {any} */
  s, s;
}
let gs;
const kl = "ehagaki.web-component.v1:", It = /* @__PURE__ */ new Map(), Al = {
  get length() {
    return It.size;
  },
  clear() {
    It.clear();
  },
  getItem(e) {
    return It.get(e) ?? null;
  },
  key(e) {
    return [...It.keys()][e] ?? null;
  },
  removeItem(e) {
    It.delete(e);
  },
  setItem(e, t) {
    It.set(e, String(t));
  }
};
function Sl() {
  if (typeof globalThis < "u") {
    const e = globalThis.localStorage;
    if (e)
      return e;
  }
  return Al;
}
function Il() {
  return gs ?? Sl();
}
function Rl(e) {
  gs = e;
}
function cr(e, t) {
  const n = [];
  for (let r = 0; r < e.length; r += 1) {
    const i = e.key(r);
    i?.startsWith(t) && n.push(i.slice(t.length));
  }
  return n;
}
function $l(e, t) {
  return {
    get length() {
      return cr(e, t).length;
    },
    clear() {
      const n = cr(e, t);
      for (const r of n)
        e.removeItem(`${t}${r}`);
    },
    getItem(n) {
      return e.getItem(`${t}${n}`);
    },
    key(n) {
      return cr(e, t)[n] ?? null;
    },
    removeItem(n) {
      e.removeItem(`${t}${n}`);
    },
    setItem(n, r) {
      e.setItem(`${t}${n}`, String(r));
    }
  };
}
function Cl(e) {
  return $l(
    e,
    kl
  );
}
function Ll() {
  return {
    style: {
      setProperty: () => {
      },
      removeProperty: () => "",
      getPropertyValue: () => ""
    }
  };
}
function Ol() {
  const e = typeof window < "u" ? window : void 0, t = e?.document, n = t?.documentElement ?? Ll(), r = t?.body ?? n;
  return {
    storage: Il(),
    window: e,
    document: t,
    domRoot: t,
    styleTarget: n,
    layoutTarget: r,
    overlayTarget: r,
    themeTarget: n,
    layoutMode: "viewport",
    runtimeKind: "standalone",
    appHomeHref: "./",
    assetBase: e?.location?.href ? new URL(".", e.location.href) : void 0,
    // The implicit browser runtime retains the historic PWA behavior.
    // The Web Component entry explicitly opts out before importing App.
    serviceWorkerEnabled: !0,
    externalInputEnabled: !0,
    historyEnabled: !0,
    localNsecAuthEnabled: !0,
    // Startup NIP-07 sign-in stays opt-in so an installed extension does
    // not prompt merely because a page was opened.
    autoLoginNip07Enabled: !1
  };
}
let Xt = Ol();
function Tl(e) {
  return Xt = {
    ...Xt,
    ...e
  }, Rl(Xt.storage), Xt;
}
function i0() {
  return Xt;
}
function Jr(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function ct(e, t = "") {
  if (!Number.isSafeInteger(e) || e < 0) {
    const n = t && `"${t}" `;
    throw new Error(`${n}expected integer >= 0, got ${e}`);
  }
}
function D(e, t, n = "") {
  const r = Jr(e), i = e?.length, o = t !== void 0;
  if (!r || o && i !== t) {
    const s = n && `"${n}" `, c = o ? ` of length ${t}` : "", a = r ? `length=${i}` : `type=${typeof e}`;
    throw new Error(s + "expected Uint8Array" + c + ", got " + a);
  }
  return e;
}
function Yn(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash must wrapped by utils.createHasher");
  ct(e.outputLen), ct(e.blockLen);
}
function Mn(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function Bl(e, t) {
  D(e, void 0, "digestInto() output");
  const n = t.outputLen;
  if (e.length < n)
    throw new Error('"digestInto() output" expected to be of length >=' + n);
}
function on(...e) {
  for (let t = 0; t < e.length; t++)
    e[t].fill(0);
}
function lr(e) {
  return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function Ce(e, t) {
  return e << 32 - t | e >>> t;
}
const ws = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", Nl = /* @__PURE__ */ Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function q(e) {
  if (D(e), ws)
    return e.toHex();
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += Nl[e[n]];
  return t;
}
const ze = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Wi(e) {
  if (e >= ze._0 && e <= ze._9)
    return e - ze._0;
  if (e >= ze.A && e <= ze.F)
    return e - (ze.A - 10);
  if (e >= ze.a && e <= ze.f)
    return e - (ze.a - 10);
}
function G(e) {
  if (typeof e != "string")
    throw new Error("hex string expected, got " + typeof e);
  if (ws)
    return Uint8Array.fromHex(e);
  const t = e.length, n = t / 2;
  if (t % 2)
    throw new Error("hex string expected, got unpadded hex of length " + t);
  const r = new Uint8Array(n);
  for (let i = 0, o = 0; i < n; i++, o += 2) {
    const s = Wi(e.charCodeAt(o)), c = Wi(e.charCodeAt(o + 1));
    if (s === void 0 || c === void 0) {
      const a = e[o] + e[o + 1];
      throw new Error('hex string expected, got non-hex character "' + a + '" at index ' + o);
    }
    r[i] = s * 16 + c;
  }
  return r;
}
function de(...e) {
  let t = 0;
  for (let r = 0; r < e.length; r++) {
    const i = e[r];
    D(i), t += i.length;
  }
  const n = new Uint8Array(t);
  for (let r = 0, i = 0; r < e.length; r++) {
    const o = e[r];
    n.set(o, i), i += o.length;
  }
  return n;
}
function Pl(e, t = {}) {
  const n = (i, o) => e(o).update(i).digest(), r = e(void 0);
  return n.outputLen = r.outputLen, n.blockLen = r.blockLen, n.create = (i) => e(i), Object.assign(n, t), Object.freeze(n);
}
function Ft(e = 32) {
  const t = typeof globalThis == "object" ? globalThis.crypto : null;
  if (typeof t?.getRandomValues != "function")
    throw new Error("crypto.getRandomValues must be defined");
  return t.getRandomValues(new Uint8Array(e));
}
const Ml = (e) => ({
  oid: Uint8Array.from([6, 9, 96, 134, 72, 1, 101, 3, 4, 2, e])
});
function Ul(e, t, n) {
  return e & t ^ ~e & n;
}
function zl(e, t, n) {
  return e & t ^ e & n ^ t & n;
}
class Dl {
  blockLen;
  outputLen;
  padOffset;
  isLE;
  // For partial updates less than block size
  buffer;
  view;
  finished = !1;
  length = 0;
  pos = 0;
  destroyed = !1;
  constructor(t, n, r, i) {
    this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = i, this.buffer = new Uint8Array(t), this.view = lr(this.buffer);
  }
  update(t) {
    Mn(this), D(t);
    const { view: n, buffer: r, blockLen: i } = this, o = t.length;
    for (let s = 0; s < o; ) {
      const c = Math.min(i - this.pos, o - s);
      if (c === i) {
        const a = lr(t);
        for (; i <= o - s; s += i)
          this.process(a, s);
        continue;
      }
      r.set(t.subarray(s, s + c), this.pos), this.pos += c, s += c, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Mn(this), Bl(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: o } = this;
    let { pos: s } = this;
    n[s++] = 128, on(this.buffer.subarray(s)), this.padOffset > i - s && (this.process(r, 0), s = 0);
    for (let h = s; h < i; h++)
      n[h] = 0;
    r.setBigUint64(i - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const c = lr(t), a = this.outputLen;
    if (a % 4)
      throw new Error("_sha2: outputLen must be aligned to 32bit");
    const u = a / 4, f = this.get();
    if (u > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let h = 0; h < u; h++)
      c.setUint32(4 * h, f[h], o);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t ||= new this.constructor(), t.set(...this.get());
    const { blockLen: n, buffer: r, length: i, finished: o, destroyed: s, pos: c } = this;
    return t.destroyed = s, t.finished = o, t.length = i, t.pos = c, i % n && t.buffer.set(r), t;
  }
  clone() {
    return this._cloneInto();
  }
}
const Xe = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Hl = /* @__PURE__ */ Uint32Array.from([
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
]), Je = /* @__PURE__ */ new Uint32Array(64);
class jl extends Dl {
  constructor(t) {
    super(64, t, 8, !1);
  }
  get() {
    const { A: t, B: n, C: r, D: i, E: o, F: s, G: c, H: a } = this;
    return [t, n, r, i, o, s, c, a];
  }
  // prettier-ignore
  set(t, n, r, i, o, s, c, a) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = i | 0, this.E = o | 0, this.F = s | 0, this.G = c | 0, this.H = a | 0;
  }
  process(t, n) {
    for (let h = 0; h < 16; h++, n += 4)
      Je[h] = t.getUint32(n, !1);
    for (let h = 16; h < 64; h++) {
      const b = Je[h - 15], p = Je[h - 2], l = Ce(b, 7) ^ Ce(b, 18) ^ b >>> 3, d = Ce(p, 17) ^ Ce(p, 19) ^ p >>> 10;
      Je[h] = d + Je[h - 7] + l + Je[h - 16] | 0;
    }
    let { A: r, B: i, C: o, D: s, E: c, F: a, G: u, H: f } = this;
    for (let h = 0; h < 64; h++) {
      const b = Ce(c, 6) ^ Ce(c, 11) ^ Ce(c, 25), p = f + b + Ul(c, a, u) + Hl[h] + Je[h] | 0, d = (Ce(r, 2) ^ Ce(r, 13) ^ Ce(r, 22)) + zl(r, i, o) | 0;
      f = u, u = a, a = c, c = s + p | 0, s = o, o = i, i = r, r = p + d | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, o = o + this.C | 0, s = s + this.D | 0, c = c + this.E | 0, a = a + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, i, o, s, c, a, u, f);
  }
  roundClean() {
    on(Je);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), on(this.buffer);
  }
}
class ql extends jl {
  // We cannot use array here since array allows indexing by variable
  // which means optimizer/compiler cannot use registers.
  A = Xe[0] | 0;
  B = Xe[1] | 0;
  C = Xe[2] | 0;
  D = Xe[3] | 0;
  E = Xe[4] | 0;
  F = Xe[5] | 0;
  G = Xe[6] | 0;
  H = Xe[7] | 0;
  constructor() {
    super(32);
  }
}
const Me = /* @__PURE__ */ Pl(
  () => new ql(),
  /* @__PURE__ */ Ml(1)
);
const Qr = /* @__PURE__ */ BigInt(0), Lr = /* @__PURE__ */ BigInt(1);
function Un(e, t = "") {
  if (typeof e != "boolean") {
    const n = t && `"${t}" `;
    throw new Error(n + "expected boolean, got type=" + typeof e);
  }
  return e;
}
function bs(e) {
  if (typeof e == "bigint") {
    if (!Sn(e))
      throw new Error("positive bigint expected, got " + e);
  } else
    ct(e);
  return e;
}
function yn(e) {
  const t = bs(e).toString(16);
  return t.length & 1 ? "0" + t : t;
}
function ys(e) {
  if (typeof e != "string")
    throw new Error("hex string expected, got " + typeof e);
  return e === "" ? Qr : BigInt("0x" + e);
}
function dn(e) {
  return ys(q(e));
}
function ms(e) {
  return ys(q(Vl(D(e)).reverse()));
}
function ei(e, t) {
  ct(t), e = bs(e);
  const n = G(e.toString(16).padStart(t * 2, "0"));
  if (n.length !== t)
    throw new Error("number too large");
  return n;
}
function vs(e, t) {
  return ei(e, t).reverse();
}
function Vl(e) {
  return Uint8Array.from(e);
}
function Fl(e) {
  return Uint8Array.from(e, (t, n) => {
    const r = t.charCodeAt(0);
    if (t.length !== 1 || r > 127)
      throw new Error(`string contains non-ASCII character "${e[n]}" with code ${r} at position ${n}`);
    return r;
  });
}
const Sn = (e) => typeof e == "bigint" && Qr <= e;
function Kl(e, t, n) {
  return Sn(e) && Sn(t) && Sn(n) && t <= e && e < n;
}
function Zl(e, t, n, r) {
  if (!Kl(t, n, r))
    throw new Error("expected valid " + e + ": " + n + " <= n < " + r + ", got " + t);
}
function Wl(e) {
  let t;
  for (t = 0; e > Qr; e >>= Lr, t += 1)
    ;
  return t;
}
const ti = (e) => (Lr << BigInt(e)) - Lr;
function Gl(e, t, n) {
  if (ct(e, "hashLen"), ct(t, "qByteLen"), typeof n != "function")
    throw new Error("hmacFn must be a function");
  const r = (w) => new Uint8Array(w), i = Uint8Array.of(), o = Uint8Array.of(0), s = Uint8Array.of(1), c = 1e3;
  let a = r(e), u = r(e), f = 0;
  const h = () => {
    a.fill(1), u.fill(0), f = 0;
  }, b = (...w) => n(u, de(a, ...w)), p = (w = i) => {
    u = b(o, w), a = b(), w.length !== 0 && (u = b(s, w), a = b());
  }, l = () => {
    if (f++ >= c)
      throw new Error("drbg: tried max amount of iterations");
    let w = 0;
    const g = [];
    for (; w < t; ) {
      a = b();
      const y = a.slice();
      g.push(y), w += a.length;
    }
    return de(...g);
  };
  return (w, g) => {
    h(), p(w);
    let y;
    for (; !(y = g(l())); )
      p();
    return h(), y;
  };
}
function ni(e, t = {}, n = {}) {
  if (!e || typeof e != "object")
    throw new Error("expected valid options object");
  function r(o, s, c) {
    const a = e[o];
    if (c && a === void 0)
      return;
    const u = typeof a;
    if (u !== s || a === null)
      throw new Error(`param "${o}" is invalid: expected ${s}, got ${u}`);
  }
  const i = (o, s) => Object.entries(o).forEach(([c, a]) => r(c, a, s));
  i(t, !1), i(n, !0);
}
function Gi(e) {
  const t = /* @__PURE__ */ new WeakMap();
  return (n, ...r) => {
    const i = t.get(n);
    if (i !== void 0)
      return i;
    const o = e(n, ...r);
    return t.set(n, o), o;
  };
}
const he = /* @__PURE__ */ BigInt(0), le = /* @__PURE__ */ BigInt(1), gt = /* @__PURE__ */ BigInt(2), _s = /* @__PURE__ */ BigInt(3), Es = /* @__PURE__ */ BigInt(4), xs = /* @__PURE__ */ BigInt(5), Yl = /* @__PURE__ */ BigInt(7), ks = /* @__PURE__ */ BigInt(8), Xl = /* @__PURE__ */ BigInt(9), As = /* @__PURE__ */ BigInt(16);
function xe(e, t) {
  const n = e % t;
  return n >= he ? n : t + n;
}
function ge(e, t, n) {
  let r = e;
  for (; t-- > he; )
    r *= r, r %= n;
  return r;
}
function Yi(e, t) {
  if (e === he)
    throw new Error("invert: expected non-zero number");
  if (t <= he)
    throw new Error("invert: expected positive modulus, got " + t);
  let n = xe(e, t), r = t, i = he, o = le;
  for (; n !== he; ) {
    const c = r / n, a = r % n, u = i - o * c;
    r = n, n = a, i = o, o = u;
  }
  if (r !== le)
    throw new Error("invert: does not exist");
  return xe(i, t);
}
function ri(e, t, n) {
  if (!e.eql(e.sqr(t), n))
    throw new Error("Cannot find square root");
}
function Ss(e, t) {
  const n = (e.ORDER + le) / Es, r = e.pow(t, n);
  return ri(e, r, t), r;
}
function Jl(e, t) {
  const n = (e.ORDER - xs) / ks, r = e.mul(t, gt), i = e.pow(r, n), o = e.mul(t, i), s = e.mul(e.mul(o, gt), i), c = e.mul(o, e.sub(s, e.ONE));
  return ri(e, c, t), c;
}
function Ql(e) {
  const t = Xn(e), n = Is(e), r = n(t, t.neg(t.ONE)), i = n(t, r), o = n(t, t.neg(r)), s = (e + Yl) / As;
  return (c, a) => {
    let u = c.pow(a, s), f = c.mul(u, r);
    const h = c.mul(u, i), b = c.mul(u, o), p = c.eql(c.sqr(f), a), l = c.eql(c.sqr(h), a);
    u = c.cmov(u, f, p), f = c.cmov(b, h, l);
    const d = c.eql(c.sqr(f), a), w = c.cmov(u, f, d);
    return ri(c, w, a), w;
  };
}
function Is(e) {
  if (e < _s)
    throw new Error("sqrt is not defined for small field");
  let t = e - le, n = 0;
  for (; t % gt === he; )
    t /= gt, n++;
  let r = gt;
  const i = Xn(e);
  for (; Xi(i, r) === 1; )
    if (r++ > 1e3)
      throw new Error("Cannot find square root: probably non-prime P");
  if (n === 1)
    return Ss;
  let o = i.pow(r, t);
  const s = (t + le) / gt;
  return function(a, u) {
    if (a.is0(u))
      return u;
    if (Xi(a, u) !== 1)
      throw new Error("Cannot find square root");
    let f = n, h = a.mul(a.ONE, o), b = a.pow(u, t), p = a.pow(u, s);
    for (; !a.eql(b, a.ONE); ) {
      if (a.is0(b))
        return a.ZERO;
      let l = 1, d = a.sqr(b);
      for (; !a.eql(d, a.ONE); )
        if (l++, d = a.sqr(d), l === f)
          throw new Error("Cannot find square root");
      const w = le << BigInt(f - l - 1), g = a.pow(h, w);
      f = l, h = a.sqr(g), b = a.mul(b, h), p = a.mul(p, g);
    }
    return p;
  };
}
function eu(e) {
  return e % Es === _s ? Ss : e % ks === xs ? Jl : e % As === Xl ? Ql(e) : Is(e);
}
const tu = [
  "create",
  "isValid",
  "is0",
  "neg",
  "inv",
  "sqrt",
  "sqr",
  "eql",
  "add",
  "sub",
  "mul",
  "pow",
  "div",
  "addN",
  "subN",
  "mulN",
  "sqrN"
];
function nu(e) {
  const t = {
    ORDER: "bigint",
    BYTES: "number",
    BITS: "number"
  }, n = tu.reduce((r, i) => (r[i] = "function", r), t);
  return ni(e, n), e;
}
function ru(e, t, n) {
  if (n < he)
    throw new Error("invalid exponent, negatives unsupported");
  if (n === he)
    return e.ONE;
  if (n === le)
    return t;
  let r = e.ONE, i = t;
  for (; n > he; )
    n & le && (r = e.mul(r, i)), i = e.sqr(i), n >>= le;
  return r;
}
function Rs(e, t, n = !1) {
  const r = new Array(t.length).fill(n ? e.ZERO : void 0), i = t.reduce((s, c, a) => e.is0(c) ? s : (r[a] = s, e.mul(s, c)), e.ONE), o = e.inv(i);
  return t.reduceRight((s, c, a) => e.is0(c) ? s : (r[a] = e.mul(s, r[a]), e.mul(s, c)), o), r;
}
function Xi(e, t) {
  const n = (e.ORDER - le) / gt, r = e.pow(t, n), i = e.eql(r, e.ONE), o = e.eql(r, e.ZERO), s = e.eql(r, e.neg(e.ONE));
  if (!i && !o && !s)
    throw new Error("invalid Legendre symbol result");
  return i ? 1 : o ? 0 : -1;
}
function iu(e, t) {
  t !== void 0 && ct(t);
  const n = t !== void 0 ? t : e.toString(2).length, r = Math.ceil(n / 8);
  return { nBitLength: n, nByteLength: r };
}
class ou {
  ORDER;
  BITS;
  BYTES;
  isLE;
  ZERO = he;
  ONE = le;
  _lengths;
  _sqrt;
  // cached sqrt
  _mod;
  constructor(t, n = {}) {
    if (t <= he)
      throw new Error("invalid field: expected ORDER > 0, got " + t);
    let r;
    this.isLE = !1, n != null && typeof n == "object" && (typeof n.BITS == "number" && (r = n.BITS), typeof n.sqrt == "function" && (this.sqrt = n.sqrt), typeof n.isLE == "boolean" && (this.isLE = n.isLE), n.allowedLengths && (this._lengths = n.allowedLengths?.slice()), typeof n.modFromBytes == "boolean" && (this._mod = n.modFromBytes));
    const { nBitLength: i, nByteLength: o } = iu(t, r);
    if (o > 2048)
      throw new Error("invalid field: expected ORDER of <= 2048 bytes");
    this.ORDER = t, this.BITS = i, this.BYTES = o, this._sqrt = void 0, Object.preventExtensions(this);
  }
  create(t) {
    return xe(t, this.ORDER);
  }
  isValid(t) {
    if (typeof t != "bigint")
      throw new Error("invalid field element: expected bigint, got " + typeof t);
    return he <= t && t < this.ORDER;
  }
  is0(t) {
    return t === he;
  }
  // is valid and invertible
  isValidNot0(t) {
    return !this.is0(t) && this.isValid(t);
  }
  isOdd(t) {
    return (t & le) === le;
  }
  neg(t) {
    return xe(-t, this.ORDER);
  }
  eql(t, n) {
    return t === n;
  }
  sqr(t) {
    return xe(t * t, this.ORDER);
  }
  add(t, n) {
    return xe(t + n, this.ORDER);
  }
  sub(t, n) {
    return xe(t - n, this.ORDER);
  }
  mul(t, n) {
    return xe(t * n, this.ORDER);
  }
  pow(t, n) {
    return ru(this, t, n);
  }
  div(t, n) {
    return xe(t * Yi(n, this.ORDER), this.ORDER);
  }
  // Same as above, but doesn't normalize
  sqrN(t) {
    return t * t;
  }
  addN(t, n) {
    return t + n;
  }
  subN(t, n) {
    return t - n;
  }
  mulN(t, n) {
    return t * n;
  }
  inv(t) {
    return Yi(t, this.ORDER);
  }
  sqrt(t) {
    return this._sqrt || (this._sqrt = eu(this.ORDER)), this._sqrt(this, t);
  }
  toBytes(t) {
    return this.isLE ? vs(t, this.BYTES) : ei(t, this.BYTES);
  }
  fromBytes(t, n = !1) {
    D(t);
    const { _lengths: r, BYTES: i, isLE: o, ORDER: s, _mod: c } = this;
    if (r) {
      if (!r.includes(t.length) || t.length > i)
        throw new Error("Field.fromBytes: expected " + r + " bytes, got " + t.length);
      const u = new Uint8Array(i);
      u.set(t, o ? 0 : u.length - t.length), t = u;
    }
    if (t.length !== i)
      throw new Error("Field.fromBytes: expected " + i + " bytes, got " + t.length);
    let a = o ? ms(t) : dn(t);
    if (c && (a = xe(a, s)), !n && !this.isValid(a))
      throw new Error("invalid field element: outside of range 0..ORDER");
    return a;
  }
  // TODO: we don't need it here, move out to separate fn
  invertBatch(t) {
    return Rs(this, t);
  }
  // We can't move this out because Fp6, Fp12 implement it
  // and it's unclear what to return in there.
  cmov(t, n, r) {
    return r ? n : t;
  }
}
function Xn(e, t = {}) {
  return new ou(e, t);
}
function $s(e) {
  if (typeof e != "bigint")
    throw new Error("field order must be bigint");
  const t = e.toString(2).length;
  return Math.ceil(t / 8);
}
function Cs(e) {
  const t = $s(e);
  return t + Math.ceil(t / 2);
}
function Ls(e, t, n = !1) {
  D(e);
  const r = e.length, i = $s(t), o = Cs(t);
  if (r < 16 || r < o || r > 1024)
    throw new Error("expected " + o + "-1024 bytes of input, got " + r);
  const s = n ? ms(e) : dn(e), c = xe(s, t - le) + le;
  return n ? vs(c, i) : ei(c, i);
}
const jt = /* @__PURE__ */ BigInt(0), wt = /* @__PURE__ */ BigInt(1);
function zn(e, t) {
  const n = t.negate();
  return e ? n : t;
}
function Ji(e, t) {
  const n = Rs(e.Fp, t.map((r) => r.Z));
  return t.map((r, i) => e.fromAffine(r.toAffine(n[i])));
}
function Os(e, t) {
  if (!Number.isSafeInteger(e) || e <= 0 || e > t)
    throw new Error("invalid window size, expected [1.." + t + "], got W=" + e);
}
function ur(e, t) {
  Os(e, t);
  const n = Math.ceil(t / e) + 1, r = 2 ** (e - 1), i = 2 ** e, o = ti(e), s = BigInt(e);
  return { windows: n, windowSize: r, mask: o, maxNumber: i, shiftBy: s };
}
function Qi(e, t, n) {
  const { windowSize: r, mask: i, maxNumber: o, shiftBy: s } = n;
  let c = Number(e & i), a = e >> s;
  c > r && (c -= o, a += wt);
  const u = t * r, f = u + Math.abs(c) - 1, h = c === 0, b = c < 0, p = t % 2 !== 0;
  return { nextN: a, offset: f, isZero: h, isNeg: b, isNegF: p, offsetF: u };
}
const fr = /* @__PURE__ */ new WeakMap(), Ts = /* @__PURE__ */ new WeakMap();
function dr(e) {
  return Ts.get(e) || 1;
}
function eo(e) {
  if (e !== jt)
    throw new Error("invalid wNAF");
}
class su {
  BASE;
  ZERO;
  Fn;
  bits;
  // Parametrized with a given Point class (not individual point)
  constructor(t, n) {
    this.BASE = t.BASE, this.ZERO = t.ZERO, this.Fn = t.Fn, this.bits = n;
  }
  // non-const time multiplication ladder
  _unsafeLadder(t, n, r = this.ZERO) {
    let i = t;
    for (; n > jt; )
      n & wt && (r = r.add(i)), i = i.double(), n >>= wt;
    return r;
  }
  /**
   * Creates a wNAF precomputation window. Used for caching.
   * Default window size is set by `utils.precompute()` and is equal to 8.
   * Number of precomputed points depends on the curve size:
   * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
   * - 𝑊 is the window size
   * - 𝑛 is the bitlength of the curve order.
   * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
   * @param point Point instance
   * @param W window size
   * @returns precomputed point tables flattened to a single array
   */
  precomputeWindow(t, n) {
    const { windows: r, windowSize: i } = ur(n, this.bits), o = [];
    let s = t, c = s;
    for (let a = 0; a < r; a++) {
      c = s, o.push(c);
      for (let u = 1; u < i; u++)
        c = c.add(s), o.push(c);
      s = c.double();
    }
    return o;
  }
  /**
   * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
   * More compact implementation:
   * https://github.com/paulmillr/noble-secp256k1/blob/47cb1669b6e506ad66b35fe7d76132ae97465da2/index.ts#L502-L541
   * @returns real and fake (for const-time) points
   */
  wNAF(t, n, r) {
    if (!this.Fn.isValid(r))
      throw new Error("invalid scalar");
    let i = this.ZERO, o = this.BASE;
    const s = ur(t, this.bits);
    for (let c = 0; c < s.windows; c++) {
      const { nextN: a, offset: u, isZero: f, isNeg: h, isNegF: b, offsetF: p } = Qi(r, c, s);
      r = a, f ? o = o.add(zn(b, n[p])) : i = i.add(zn(h, n[u]));
    }
    return eo(r), { p: i, f: o };
  }
  /**
   * Implements ec unsafe (non const-time) multiplication using precomputed tables and w-ary non-adjacent form.
   * @param acc accumulator point to add result of multiplication
   * @returns point
   */
  wNAFUnsafe(t, n, r, i = this.ZERO) {
    const o = ur(t, this.bits);
    for (let s = 0; s < o.windows && r !== jt; s++) {
      const { nextN: c, offset: a, isZero: u, isNeg: f } = Qi(r, s, o);
      if (r = c, !u) {
        const h = n[a];
        i = i.add(f ? h.negate() : h);
      }
    }
    return eo(r), i;
  }
  getPrecomputes(t, n, r) {
    let i = fr.get(n);
    return i || (i = this.precomputeWindow(n, t), t !== 1 && (typeof r == "function" && (i = r(i)), fr.set(n, i))), i;
  }
  cached(t, n, r) {
    const i = dr(t);
    return this.wNAF(i, this.getPrecomputes(i, t, r), n);
  }
  unsafe(t, n, r, i) {
    const o = dr(t);
    return o === 1 ? this._unsafeLadder(t, n, i) : this.wNAFUnsafe(o, this.getPrecomputes(o, t, r), n, i);
  }
  // We calculate precomputes for elliptic curve point multiplication
  // using windowed method. This specifies window size and
  // stores precomputed values. Usually only base point would be precomputed.
  createCache(t, n) {
    Os(n, this.bits), Ts.set(t, n), fr.delete(t);
  }
  hasCache(t) {
    return dr(t) !== 1;
  }
}
function au(e, t, n, r) {
  let i = t, o = e.ZERO, s = e.ZERO;
  for (; n > jt || r > jt; )
    n & wt && (o = o.add(i)), r & wt && (s = s.add(i)), i = i.double(), n >>= wt, r >>= wt;
  return { p1: o, p2: s };
}
function to(e, t, n) {
  if (t) {
    if (t.ORDER !== e)
      throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
    return nu(t), t;
  } else
    return Xn(e, { isLE: n });
}
function cu(e, t, n = {}, r) {
  if (r === void 0 && (r = e === "edwards"), !t || typeof t != "object")
    throw new Error(`expected valid ${e} CURVE object`);
  for (const a of ["p", "n", "h"]) {
    const u = t[a];
    if (!(typeof u == "bigint" && u > jt))
      throw new Error(`CURVE.${a} must be positive bigint`);
  }
  const i = to(t.p, n.Fp, r), o = to(t.n, n.Fn, r), c = ["Gx", "Gy", "a", "b"];
  for (const a of c)
    if (!i.isValid(t[a]))
      throw new Error(`CURVE.${a} must be valid field element of CURVE.Fp`);
  return t = Object.freeze(Object.assign({}, t)), { CURVE: t, Fp: i, Fn: o };
}
function Bs(e, t) {
  return function(r) {
    const i = e(r);
    return { secretKey: i, publicKey: t(i) };
  };
}
class Ns {
  oHash;
  iHash;
  blockLen;
  outputLen;
  finished = !1;
  destroyed = !1;
  constructor(t, n) {
    if (Yn(t), D(n, void 0, "key"), this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const r = this.blockLen, i = new Uint8Array(r);
    i.set(n.length > r ? t.create().update(n).digest() : n);
    for (let o = 0; o < i.length; o++)
      i[o] ^= 54;
    this.iHash.update(i), this.oHash = t.create();
    for (let o = 0; o < i.length; o++)
      i[o] ^= 106;
    this.oHash.update(i), on(i);
  }
  update(t) {
    return Mn(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    Mn(this), D(t, this.outputLen, "output"), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t ||= Object.create(Object.getPrototypeOf(this), {});
    const { oHash: n, iHash: r, finished: i, destroyed: o, blockLen: s, outputLen: c } = this;
    return t = t, t.finished = i, t.destroyed = o, t.blockLen = s, t.outputLen = c, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  clone() {
    return this._cloneInto();
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const hn = (e, t, n) => new Ns(e, t).update(n).digest();
hn.create = (e, t) => new Ns(e, t);
const no = (e, t) => (e + (e >= 0 ? t : -t) / Ps) / t;
function lu(e, t, n) {
  const [[r, i], [o, s]] = t, c = no(s * e, n), a = no(-i * e, n);
  let u = e - c * r - a * o, f = -c * i - a * s;
  const h = u < Ve, b = f < Ve;
  h && (u = -u), b && (f = -f);
  const p = ti(Math.ceil(Wl(n) / 2)) + Tt;
  if (u < Ve || u >= p || f < Ve || f >= p)
    throw new Error("splitScalar (endomorphism): failed, k=" + e);
  return { k1neg: h, k1: u, k2neg: b, k2: f };
}
function Or(e) {
  if (!["compact", "recovered", "der"].includes(e))
    throw new Error('Signature format must be "compact", "recovered", or "der"');
  return e;
}
function hr(e, t) {
  const n = {};
  for (let r of Object.keys(t))
    n[r] = e[r] === void 0 ? t[r] : e[r];
  return Un(n.lowS, "lowS"), Un(n.prehash, "prehash"), n.format !== void 0 && Or(n.format), n;
}
class uu extends Error {
  constructor(t = "") {
    super(t);
  }
}
const et = {
  // asn.1 DER encoding utils
  Err: uu,
  // Basic building block is TLV (Tag-Length-Value)
  _tlv: {
    encode: (e, t) => {
      const { Err: n } = et;
      if (e < 0 || e > 256)
        throw new n("tlv.encode: wrong tag");
      if (t.length & 1)
        throw new n("tlv.encode: unpadded data");
      const r = t.length / 2, i = yn(r);
      if (i.length / 2 & 128)
        throw new n("tlv.encode: long form length too big");
      const o = r > 127 ? yn(i.length / 2 | 128) : "";
      return yn(e) + o + i + t;
    },
    // v - value, l - left bytes (unparsed)
    decode(e, t) {
      const { Err: n } = et;
      let r = 0;
      if (e < 0 || e > 256)
        throw new n("tlv.encode: wrong tag");
      if (t.length < 2 || t[r++] !== e)
        throw new n("tlv.decode: wrong tlv");
      const i = t[r++], o = !!(i & 128);
      let s = 0;
      if (!o)
        s = i;
      else {
        const a = i & 127;
        if (!a)
          throw new n("tlv.decode(long): indefinite length not supported");
        if (a > 4)
          throw new n("tlv.decode(long): byte length is too big");
        const u = t.subarray(r, r + a);
        if (u.length !== a)
          throw new n("tlv.decode: length bytes not complete");
        if (u[0] === 0)
          throw new n("tlv.decode(long): zero leftmost byte");
        for (const f of u)
          s = s << 8 | f;
        if (r += a, s < 128)
          throw new n("tlv.decode(long): not minimal encoding");
      }
      const c = t.subarray(r, r + s);
      if (c.length !== s)
        throw new n("tlv.decode: wrong value length");
      return { v: c, l: t.subarray(r + s) };
    }
  },
  // https://crypto.stackexchange.com/a/57734 Leftmost bit of first byte is 'negative' flag,
  // since we always use positive integers here. It must always be empty:
  // - add zero byte if exists
  // - if next byte doesn't have a flag, leading zero is not allowed (minimal encoding)
  _int: {
    encode(e) {
      const { Err: t } = et;
      if (e < Ve)
        throw new t("integer: negative integers are not allowed");
      let n = yn(e);
      if (Number.parseInt(n[0], 16) & 8 && (n = "00" + n), n.length & 1)
        throw new t("unexpected DER parsing assertion: unpadded hex");
      return n;
    },
    decode(e) {
      const { Err: t } = et;
      if (e[0] & 128)
        throw new t("invalid signature integer: negative");
      if (e[0] === 0 && !(e[1] & 128))
        throw new t("invalid signature integer: unnecessary leading zero");
      return dn(e);
    }
  },
  toSig(e) {
    const { Err: t, _int: n, _tlv: r } = et, i = D(e, void 0, "signature"), { v: o, l: s } = r.decode(48, i);
    if (s.length)
      throw new t("invalid signature: left bytes after parsing");
    const { v: c, l: a } = r.decode(2, o), { v: u, l: f } = r.decode(2, a);
    if (f.length)
      throw new t("invalid signature: left bytes after parsing");
    return { r: n.decode(c), s: n.decode(u) };
  },
  hexFromSig(e) {
    const { _tlv: t, _int: n } = et, r = t.encode(2, n.encode(e.r)), i = t.encode(2, n.encode(e.s)), o = r + i;
    return t.encode(48, o);
  }
}, Ve = BigInt(0), Tt = BigInt(1), Ps = BigInt(2), mn = BigInt(3), fu = BigInt(4);
function du(e, t = {}) {
  const n = cu("weierstrass", e, t), { Fp: r, Fn: i } = n;
  let o = n.CURVE;
  const { h: s, n: c } = o;
  ni(t, {}, {
    allowInfinityPoint: "boolean",
    clearCofactor: "function",
    isTorsionFree: "function",
    fromBytes: "function",
    toBytes: "function",
    endo: "object"
  });
  const { endo: a } = t;
  if (a && (!r.is0(o.a) || typeof a.beta != "bigint" || !Array.isArray(a.basises)))
    throw new Error('invalid endo: expected "beta": bigint and "basises": array');
  const u = Us(r, i);
  function f() {
    if (!r.isOdd)
      throw new Error("compression is not supported: Field does not have .isOdd()");
  }
  function h(O, E, _) {
    const { x: v, y: x } = E.toAffine(), A = r.toBytes(v);
    if (Un(_, "isCompressed"), _) {
      f();
      const I = !r.isOdd(x);
      return de(Ms(I), A);
    } else
      return de(Uint8Array.of(4), A, r.toBytes(x));
  }
  function b(O) {
    D(O, void 0, "Point");
    const { publicKey: E, publicKeyUncompressed: _ } = u, v = O.length, x = O[0], A = O.subarray(1);
    if (v === E && (x === 2 || x === 3)) {
      const I = r.fromBytes(A);
      if (!r.isValid(I))
        throw new Error("bad point: is not on curve, wrong x");
      const S = d(I);
      let k;
      try {
        k = r.sqrt(S);
      } catch (F) {
        const j = F instanceof Error ? ": " + F.message : "";
        throw new Error("bad point: is not on curve, sqrt error" + j);
      }
      f();
      const R = r.isOdd(k);
      return (x & 1) === 1 !== R && (k = r.neg(k)), { x: I, y: k };
    } else if (v === _ && x === 4) {
      const I = r.BYTES, S = r.fromBytes(A.subarray(0, I)), k = r.fromBytes(A.subarray(I, I * 2));
      if (!w(S, k))
        throw new Error("bad point: is not on curve");
      return { x: S, y: k };
    } else
      throw new Error(`bad point: got length ${v}, expected compressed=${E} or uncompressed=${_}`);
  }
  const p = t.toBytes || h, l = t.fromBytes || b;
  function d(O) {
    const E = r.sqr(O), _ = r.mul(E, O);
    return r.add(r.add(_, r.mul(O, o.a)), o.b);
  }
  function w(O, E) {
    const _ = r.sqr(E), v = d(O);
    return r.eql(_, v);
  }
  if (!w(o.Gx, o.Gy))
    throw new Error("bad curve params: generator point");
  const g = r.mul(r.pow(o.a, mn), fu), y = r.mul(r.sqr(o.b), BigInt(27));
  if (r.is0(r.add(g, y)))
    throw new Error("bad curve params: a or b");
  function m(O, E, _ = !1) {
    if (!r.isValid(E) || _ && r.is0(E))
      throw new Error(`bad point coordinate ${O}`);
    return E;
  }
  function C(O) {
    if (!(O instanceof L))
      throw new Error("Weierstrass Point expected");
  }
  function ae(O) {
    if (!a || !a.basises)
      throw new Error("no endo");
    return lu(O, a.basises, i.ORDER);
  }
  const z = Gi((O, E) => {
    const { X: _, Y: v, Z: x } = O;
    if (r.eql(x, r.ONE))
      return { x: _, y: v };
    const A = O.is0();
    E == null && (E = A ? r.ONE : r.inv(x));
    const I = r.mul(_, E), S = r.mul(v, E), k = r.mul(x, E);
    if (A)
      return { x: r.ZERO, y: r.ZERO };
    if (!r.eql(k, r.ONE))
      throw new Error("invZ was invalid");
    return { x: I, y: S };
  }), V = Gi((O) => {
    if (O.is0()) {
      if (t.allowInfinityPoint && !r.is0(O.Y))
        return;
      throw new Error("bad point: ZERO");
    }
    const { x: E, y: _ } = O.toAffine();
    if (!r.isValid(E) || !r.isValid(_))
      throw new Error("bad point: x or y not field elements");
    if (!w(E, _))
      throw new Error("bad point: equation left != right");
    if (!O.isTorsionFree())
      throw new Error("bad point: not in prime-order subgroup");
    return !0;
  });
  function Y(O, E, _, v, x) {
    return _ = new L(r.mul(_.X, O), _.Y, _.Z), E = zn(v, E), _ = zn(x, _), E.add(_);
  }
  class L {
    // base / generator point
    static BASE = new L(o.Gx, o.Gy, r.ONE);
    // zero / infinity / identity point
    static ZERO = new L(r.ZERO, r.ONE, r.ZERO);
    // 0, 1, 0
    // math field
    static Fp = r;
    // scalar field
    static Fn = i;
    X;
    Y;
    Z;
    /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
    constructor(E, _, v) {
      this.X = m("x", E), this.Y = m("y", _, !0), this.Z = m("z", v), Object.freeze(this);
    }
    static CURVE() {
      return o;
    }
    /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
    static fromAffine(E) {
      const { x: _, y: v } = E || {};
      if (!E || !r.isValid(_) || !r.isValid(v))
        throw new Error("invalid affine point");
      if (E instanceof L)
        throw new Error("projective point not allowed");
      return r.is0(_) && r.is0(v) ? L.ZERO : new L(_, v, r.ONE);
    }
    static fromBytes(E) {
      const _ = L.fromAffine(l(D(E, void 0, "point")));
      return _.assertValidity(), _;
    }
    static fromHex(E) {
      return L.fromBytes(G(E));
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    /**
     *
     * @param windowSize
     * @param isLazy true will defer table computation until the first multiplication
     * @returns
     */
    precompute(E = 8, _ = !0) {
      return X.createCache(this, E), _ || this.multiply(mn), this;
    }
    // TODO: return `this`
    /** A point on curve is valid if it conforms to equation. */
    assertValidity() {
      V(this);
    }
    hasEvenY() {
      const { y: E } = this.toAffine();
      if (!r.isOdd)
        throw new Error("Field doesn't support isOdd");
      return !r.isOdd(E);
    }
    /** Compare one point to another. */
    equals(E) {
      C(E);
      const { X: _, Y: v, Z: x } = this, { X: A, Y: I, Z: S } = E, k = r.eql(r.mul(_, S), r.mul(A, x)), R = r.eql(r.mul(v, S), r.mul(I, x));
      return k && R;
    }
    /** Flips point to one corresponding to (x, -y) in Affine coordinates. */
    negate() {
      return new L(this.X, r.neg(this.Y), this.Z);
    }
    // Renes-Costello-Batina exception-free doubling formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 3
    // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
    double() {
      const { a: E, b: _ } = o, v = r.mul(_, mn), { X: x, Y: A, Z: I } = this;
      let S = r.ZERO, k = r.ZERO, R = r.ZERO, $ = r.mul(x, x), F = r.mul(A, A), j = r.mul(I, I), N = r.mul(x, A);
      return N = r.add(N, N), R = r.mul(x, I), R = r.add(R, R), S = r.mul(E, R), k = r.mul(v, j), k = r.add(S, k), S = r.sub(F, k), k = r.add(F, k), k = r.mul(S, k), S = r.mul(N, S), R = r.mul(v, R), j = r.mul(E, j), N = r.sub($, j), N = r.mul(E, N), N = r.add(N, R), R = r.add($, $), $ = r.add(R, $), $ = r.add($, j), $ = r.mul($, N), k = r.add(k, $), j = r.mul(A, I), j = r.add(j, j), $ = r.mul(j, N), S = r.sub(S, $), R = r.mul(j, F), R = r.add(R, R), R = r.add(R, R), new L(S, k, R);
    }
    // Renes-Costello-Batina exception-free addition formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 1
    // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
    add(E) {
      C(E);
      const { X: _, Y: v, Z: x } = this, { X: A, Y: I, Z: S } = E;
      let k = r.ZERO, R = r.ZERO, $ = r.ZERO;
      const F = o.a, j = r.mul(o.b, mn);
      let N = r.mul(_, A), K = r.mul(v, I), re = r.mul(x, S), $e = r.add(_, v), Z = r.add(A, I);
      $e = r.mul($e, Z), Z = r.add(N, K), $e = r.sub($e, Z), Z = r.add(_, x);
      let oe = r.add(A, S);
      return Z = r.mul(Z, oe), oe = r.add(N, re), Z = r.sub(Z, oe), oe = r.add(v, x), k = r.add(I, S), oe = r.mul(oe, k), k = r.add(K, re), oe = r.sub(oe, k), $ = r.mul(F, Z), k = r.mul(j, re), $ = r.add(k, $), k = r.sub(K, $), $ = r.add(K, $), R = r.mul(k, $), K = r.add(N, N), K = r.add(K, N), re = r.mul(F, re), Z = r.mul(j, Z), K = r.add(K, re), re = r.sub(N, re), re = r.mul(F, re), Z = r.add(Z, re), N = r.mul(K, Z), R = r.add(R, N), N = r.mul(oe, Z), k = r.mul($e, k), k = r.sub(k, N), N = r.mul($e, K), $ = r.mul(oe, $), $ = r.add($, N), new L(k, R, $);
    }
    subtract(E) {
      return this.add(E.negate());
    }
    is0() {
      return this.equals(L.ZERO);
    }
    /**
     * Constant time multiplication.
     * Uses wNAF method. Windowed method may be 10% faster,
     * but takes 2x longer to generate and consumes 2x memory.
     * Uses precomputes when available.
     * Uses endomorphism for Koblitz curves.
     * @param scalar by which the point would be multiplied
     * @returns New point
     */
    multiply(E) {
      const { endo: _ } = t;
      if (!i.isValidNot0(E))
        throw new Error("invalid scalar: out of range");
      let v, x;
      const A = (I) => X.cached(this, I, (S) => Ji(L, S));
      if (_) {
        const { k1neg: I, k1: S, k2neg: k, k2: R } = ae(E), { p: $, f: F } = A(S), { p: j, f: N } = A(R);
        x = F.add(N), v = Y(_.beta, $, j, I, k);
      } else {
        const { p: I, f: S } = A(E);
        v = I, x = S;
      }
      return Ji(L, [v, x])[0];
    }
    /**
     * Non-constant-time multiplication. Uses double-and-add algorithm.
     * It's faster, but should only be used when you don't care about
     * an exposed secret key e.g. sig verification, which works over *public* keys.
     */
    multiplyUnsafe(E) {
      const { endo: _ } = t, v = this;
      if (!i.isValid(E))
        throw new Error("invalid scalar: out of range");
      if (E === Ve || v.is0())
        return L.ZERO;
      if (E === Tt)
        return v;
      if (X.hasCache(this))
        return this.multiply(E);
      if (_) {
        const { k1neg: x, k1: A, k2neg: I, k2: S } = ae(E), { p1: k, p2: R } = au(L, v, A, S);
        return Y(_.beta, k, R, x, I);
      } else
        return X.unsafe(v, E);
    }
    /**
     * Converts Projective point to affine (x, y) coordinates.
     * @param invertedZ Z^-1 (inverted zero) - optional, precomputation is useful for invertBatch
     */
    toAffine(E) {
      return z(this, E);
    }
    /**
     * Checks whether Point is free of torsion elements (is in prime subgroup).
     * Always torsion-free for cofactor=1 curves.
     */
    isTorsionFree() {
      const { isTorsionFree: E } = t;
      return s === Tt ? !0 : E ? E(L, this) : X.unsafe(this, c).is0();
    }
    clearCofactor() {
      const { clearCofactor: E } = t;
      return s === Tt ? this : E ? E(L, this) : this.multiplyUnsafe(s);
    }
    isSmallOrder() {
      return this.multiplyUnsafe(s).is0();
    }
    toBytes(E = !0) {
      return Un(E, "isCompressed"), this.assertValidity(), p(L, this, E);
    }
    toHex(E = !0) {
      return q(this.toBytes(E));
    }
    toString() {
      return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
    }
  }
  const ee = i.BITS, X = new su(L, t.endo ? Math.ceil(ee / 2) : ee);
  return L.BASE.precompute(8), L;
}
function Ms(e) {
  return Uint8Array.of(e ? 2 : 3);
}
function Us(e, t) {
  return {
    secretKey: t.BYTES,
    publicKey: 1 + e.BYTES,
    publicKeyUncompressed: 1 + 2 * e.BYTES,
    publicKeyHasPrefix: !0,
    signature: 2 * t.BYTES
  };
}
function hu(e, t = {}) {
  const { Fn: n } = e, r = t.randomBytes || Ft, i = Object.assign(Us(e.Fp, n), { seed: Cs(n.ORDER) });
  function o(p) {
    try {
      const l = n.fromBytes(p);
      return n.isValidNot0(l);
    } catch {
      return !1;
    }
  }
  function s(p, l) {
    const { publicKey: d, publicKeyUncompressed: w } = i;
    try {
      const g = p.length;
      return l === !0 && g !== d || l === !1 && g !== w ? !1 : !!e.fromBytes(p);
    } catch {
      return !1;
    }
  }
  function c(p = r(i.seed)) {
    return Ls(D(p, i.seed, "seed"), n.ORDER);
  }
  function a(p, l = !0) {
    return e.BASE.multiply(n.fromBytes(p)).toBytes(l);
  }
  function u(p) {
    const { secretKey: l, publicKey: d, publicKeyUncompressed: w } = i;
    if (!Jr(p) || "_lengths" in n && n._lengths || l === d)
      return;
    const g = D(p, void 0, "key").length;
    return g === d || g === w;
  }
  function f(p, l, d = !0) {
    if (u(p) === !0)
      throw new Error("first arg must be private key");
    if (u(l) === !1)
      throw new Error("second arg must be public key");
    const w = n.fromBytes(p);
    return e.fromBytes(l).multiply(w).toBytes(d);
  }
  const h = {
    isValidSecretKey: o,
    isValidPublicKey: s,
    randomSecretKey: c
  }, b = Bs(c, a);
  return Object.freeze({ getPublicKey: a, getSharedSecret: f, keygen: b, Point: e, utils: h, lengths: i });
}
function pu(e, t, n = {}) {
  Yn(t), ni(n, {}, {
    hmac: "function",
    lowS: "boolean",
    randomBytes: "function",
    bits2int: "function",
    bits2int_modN: "function"
  }), n = Object.assign({}, n);
  const r = n.randomBytes || Ft, i = n.hmac || ((_, v) => hn(t, _, v)), { Fp: o, Fn: s } = e, { ORDER: c, BITS: a } = s, { keygen: u, getPublicKey: f, getSharedSecret: h, utils: b, lengths: p } = hu(e, n), l = {
    prehash: !0,
    lowS: typeof n.lowS == "boolean" ? n.lowS : !0,
    format: "compact",
    extraEntropy: !1
  }, d = c * Ps < o.ORDER;
  function w(_) {
    const v = c >> Tt;
    return _ > v;
  }
  function g(_, v) {
    if (!s.isValidNot0(v))
      throw new Error(`invalid signature ${_}: out of range 1..Point.Fn.ORDER`);
    return v;
  }
  function y() {
    if (d)
      throw new Error('"recovered" sig type is not supported for cofactor >2 curves');
  }
  function m(_, v) {
    Or(v);
    const x = p.signature, A = v === "compact" ? x : v === "recovered" ? x + 1 : void 0;
    return D(_, A);
  }
  class C {
    r;
    s;
    recovery;
    constructor(v, x, A) {
      if (this.r = g("r", v), this.s = g("s", x), A != null) {
        if (y(), ![0, 1, 2, 3].includes(A))
          throw new Error("invalid recovery id");
        this.recovery = A;
      }
      Object.freeze(this);
    }
    static fromBytes(v, x = l.format) {
      m(v, x);
      let A;
      if (x === "der") {
        const { r: R, s: $ } = et.toSig(D(v));
        return new C(R, $);
      }
      x === "recovered" && (A = v[0], x = "compact", v = v.subarray(1));
      const I = p.signature / 2, S = v.subarray(0, I), k = v.subarray(I, I * 2);
      return new C(s.fromBytes(S), s.fromBytes(k), A);
    }
    static fromHex(v, x) {
      return this.fromBytes(G(v), x);
    }
    assertRecovery() {
      const { recovery: v } = this;
      if (v == null)
        throw new Error("invalid recovery id: must be present");
      return v;
    }
    addRecoveryBit(v) {
      return new C(this.r, this.s, v);
    }
    recoverPublicKey(v) {
      const { r: x, s: A } = this, I = this.assertRecovery(), S = I === 2 || I === 3 ? x + c : x;
      if (!o.isValid(S))
        throw new Error("invalid recovery id: sig.r+curve.n != R.x");
      const k = o.toBytes(S), R = e.fromBytes(de(Ms((I & 1) === 0), k)), $ = s.inv(S), F = z(D(v, void 0, "msgHash")), j = s.create(-F * $), N = s.create(A * $), K = e.BASE.multiplyUnsafe(j).add(R.multiplyUnsafe(N));
      if (K.is0())
        throw new Error("invalid recovery: point at infinify");
      return K.assertValidity(), K;
    }
    // Signatures should be low-s, to prevent malleability.
    hasHighS() {
      return w(this.s);
    }
    toBytes(v = l.format) {
      if (Or(v), v === "der")
        return G(et.hexFromSig(this));
      const { r: x, s: A } = this, I = s.toBytes(x), S = s.toBytes(A);
      return v === "recovered" ? (y(), de(Uint8Array.of(this.assertRecovery()), I, S)) : de(I, S);
    }
    toHex(v) {
      return q(this.toBytes(v));
    }
  }
  const ae = n.bits2int || function(v) {
    if (v.length > 8192)
      throw new Error("input is too large");
    const x = dn(v), A = v.length * 8 - a;
    return A > 0 ? x >> BigInt(A) : x;
  }, z = n.bits2int_modN || function(v) {
    return s.create(ae(v));
  }, V = ti(a);
  function Y(_) {
    return Zl("num < 2^" + a, _, Ve, V), s.toBytes(_);
  }
  function L(_, v) {
    return D(_, void 0, "message"), v ? D(t(_), void 0, "prehashed message") : _;
  }
  function ee(_, v, x) {
    const { lowS: A, prehash: I, extraEntropy: S } = hr(x, l);
    _ = L(_, I);
    const k = z(_), R = s.fromBytes(v);
    if (!s.isValidNot0(R))
      throw new Error("invalid private key");
    const $ = [Y(R), Y(k)];
    if (S != null && S !== !1) {
      const K = S === !0 ? r(p.secretKey) : S;
      $.push(D(K, void 0, "extraEntropy"));
    }
    const F = de(...$), j = k;
    function N(K) {
      const re = ae(K);
      if (!s.isValidNot0(re))
        return;
      const $e = s.inv(re), Z = e.BASE.multiply(re).toAffine(), oe = s.create(Z.x);
      if (oe === Ve)
        return;
      const pn = s.create($e * s.create(j + oe * R));
      if (pn === Ve)
        return;
      let Bi = (Z.x === oe ? 0 : 2) | Number(Z.y & Tt), Ni = pn;
      return A && w(pn) && (Ni = s.neg(pn), Bi ^= 1), new C(oe, Ni, d ? void 0 : Bi);
    }
    return { seed: F, k2sig: N };
  }
  function X(_, v, x = {}) {
    const { seed: A, k2sig: I } = ee(_, v, x);
    return Gl(t.outputLen, s.BYTES, i)(A, I).toBytes(x.format);
  }
  function O(_, v, x, A = {}) {
    const { lowS: I, prehash: S, format: k } = hr(A, l);
    if (x = D(x, void 0, "publicKey"), v = L(v, S), !Jr(_)) {
      const R = _ instanceof C ? ", use sig.toBytes()" : "";
      throw new Error("verify expects Uint8Array signature" + R);
    }
    m(_, k);
    try {
      const R = C.fromBytes(_, k), $ = e.fromBytes(x);
      if (I && R.hasHighS())
        return !1;
      const { r: F, s: j } = R, N = z(v), K = s.inv(j), re = s.create(N * K), $e = s.create(F * K), Z = e.BASE.multiplyUnsafe(re).add($.multiplyUnsafe($e));
      return Z.is0() ? !1 : s.create(Z.x) === F;
    } catch {
      return !1;
    }
  }
  function E(_, v, x = {}) {
    const { prehash: A } = hr(x, l);
    return v = L(v, A), C.fromBytes(_, "recovered").recoverPublicKey(v).toBytes();
  }
  return Object.freeze({
    keygen: u,
    getPublicKey: f,
    getSharedSecret: h,
    utils: b,
    lengths: p,
    Point: e,
    sign: X,
    verify: O,
    recoverPublicKey: E,
    Signature: C,
    hash: t
  });
}
const Jn = {
  p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: BigInt(1),
  a: BigInt(0),
  b: BigInt(7),
  Gx: BigInt("0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"),
  Gy: BigInt("0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8")
}, gu = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  basises: [
    [BigInt("0x3086d221a7d46bcde86c90e49284eb15"), -BigInt("0xe4437ed6010e88286f547fa90abfe4c3")],
    [BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), BigInt("0x3086d221a7d46bcde86c90e49284eb15")]
  ]
}, wu = /* @__PURE__ */ BigInt(0), Tr = /* @__PURE__ */ BigInt(2);
function bu(e) {
  const t = Jn.p, n = BigInt(3), r = BigInt(6), i = BigInt(11), o = BigInt(22), s = BigInt(23), c = BigInt(44), a = BigInt(88), u = e * e * e % t, f = u * u * e % t, h = ge(f, n, t) * f % t, b = ge(h, n, t) * f % t, p = ge(b, Tr, t) * u % t, l = ge(p, i, t) * p % t, d = ge(l, o, t) * l % t, w = ge(d, c, t) * d % t, g = ge(w, a, t) * w % t, y = ge(g, c, t) * d % t, m = ge(y, n, t) * f % t, C = ge(m, s, t) * l % t, ae = ge(C, r, t) * u % t, z = ge(ae, Tr, t);
  if (!Dn.eql(Dn.sqr(z), e))
    throw new Error("Cannot find square root");
  return z;
}
const Dn = Xn(Jn.p, { sqrt: bu }), At = /* @__PURE__ */ du(Jn, {
  Fp: Dn,
  endo: gu
}), ii = /* @__PURE__ */ pu(At, Me), ro = {};
function Hn(e, ...t) {
  let n = ro[e];
  if (n === void 0) {
    const r = Me(Fl(e));
    n = de(r, r), ro[e] = n;
  }
  return Me(de(n, ...t));
}
const oi = (e) => e.toBytes(!0).slice(1), si = (e) => e % Tr === wu;
function Br(e) {
  const { Fn: t, BASE: n } = At, r = t.fromBytes(e), i = n.multiply(r);
  return { scalar: si(i.y) ? r : t.neg(r), bytes: oi(i) };
}
function zs(e) {
  const t = Dn;
  if (!t.isValidNot0(e))
    throw new Error("invalid x: Fail if x ≥ p");
  const n = t.create(e * e), r = t.create(n * e + BigInt(7));
  let i = t.sqrt(r);
  si(i) || (i = t.neg(i));
  const o = At.fromAffine({ x: e, y: i });
  return o.assertValidity(), o;
}
const en = dn;
function Ds(...e) {
  return At.Fn.create(en(Hn("BIP0340/challenge", ...e)));
}
function io(e) {
  return Br(e).bytes;
}
function yu(e, t, n = Ft(32)) {
  const { Fn: r } = At, i = D(e, void 0, "message"), { bytes: o, scalar: s } = Br(t), c = D(n, 32, "auxRand"), a = r.toBytes(s ^ en(Hn("BIP0340/aux", c))), u = Hn("BIP0340/nonce", a, o, i), { bytes: f, scalar: h } = Br(u), b = Ds(f, o, i), p = new Uint8Array(64);
  if (p.set(f, 0), p.set(r.toBytes(r.create(h + b * s)), 32), !Hs(p, i, o))
    throw new Error("sign: Invalid signature produced");
  return p;
}
function Hs(e, t, n) {
  const { Fp: r, Fn: i, BASE: o } = At, s = D(e, 64, "signature"), c = D(t, void 0, "message"), a = D(n, 32, "publicKey");
  try {
    const u = zs(en(a)), f = en(s.subarray(0, 32));
    if (!r.isValidNot0(f))
      return !1;
    const h = en(s.subarray(32, 64));
    if (!i.isValidNot0(h))
      return !1;
    const b = Ds(i.toBytes(f), oi(u), c), p = o.multiplyUnsafe(h).add(u.multiplyUnsafe(i.neg(b))), { x: l, y: d } = p.toAffine();
    return !(p.is0() || !si(d) || l !== f);
  } catch {
    return !1;
  }
}
const Kt = /* @__PURE__ */ (() => {
  const n = (r = Ft(48)) => Ls(r, Jn.n);
  return {
    keygen: Bs(n, io),
    getPublicKey: io,
    sign: yu,
    verify: Hs,
    Point: At,
    utils: {
      randomSecretKey: n,
      taggedHash: Hn,
      lift_x: zs,
      pointToBytes: oi
    },
    lengths: {
      secretKey: 32,
      publicKey: 32,
      publicKeyHasPrefix: !1,
      signature: 64,
      seed: 48
    }
  };
})();
function ai(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function mu(e) {
  if (!ai(e))
    throw new Error("Uint8Array expected");
}
function js(e, t) {
  return Array.isArray(t) ? t.length === 0 ? !0 : e ? t.every((n) => typeof n == "string") : t.every((n) => Number.isSafeInteger(n)) : !1;
}
function vu(e) {
  if (typeof e != "function")
    throw new Error("function expected");
  return !0;
}
function xt(e, t) {
  if (typeof t != "string")
    throw new Error(`${e}: string expected`);
  return !0;
}
function ci(e) {
  if (!Number.isSafeInteger(e))
    throw new Error(`invalid integer: ${e}`);
}
function Nr(e) {
  if (!Array.isArray(e))
    throw new Error("array expected");
}
function jn(e, t) {
  if (!js(!0, t))
    throw new Error(`${e}: array of strings expected`);
}
function qs(e, t) {
  if (!js(!1, t))
    throw new Error(`${e}: array of numbers expected`);
}
// @__NO_SIDE_EFFECTS__
function Vs(...e) {
  const t = (o) => o, n = (o, s) => (c) => o(s(c)), r = e.map((o) => o.encode).reduceRight(n, t), i = e.map((o) => o.decode).reduce(n, t);
  return { encode: r, decode: i };
}
// @__NO_SIDE_EFFECTS__
function Fs(e) {
  const t = typeof e == "string" ? e.split("") : e, n = t.length;
  jn("alphabet", t);
  const r = new Map(t.map((i, o) => [i, o]));
  return {
    encode: (i) => (Nr(i), i.map((o) => {
      if (!Number.isSafeInteger(o) || o < 0 || o >= n)
        throw new Error(`alphabet.encode: digit index outside alphabet "${o}". Allowed: ${e}`);
      return t[o];
    })),
    decode: (i) => (Nr(i), i.map((o) => {
      xt("alphabet.decode", o);
      const s = r.get(o);
      if (s === void 0)
        throw new Error(`Unknown letter: "${o}". Allowed: ${e}`);
      return s;
    }))
  };
}
// @__NO_SIDE_EFFECTS__
function Ks(e = "") {
  return xt("join", e), {
    encode: (t) => (jn("join.decode", t), t.join(e)),
    decode: (t) => (xt("join.decode", t), t.split(e))
  };
}
// @__NO_SIDE_EFFECTS__
function _u(e, t = "=") {
  return ci(e), xt("padding", t), {
    encode(n) {
      for (jn("padding.encode", n); n.length * e % 8; )
        n.push(t);
      return n;
    },
    decode(n) {
      jn("padding.decode", n);
      let r = n.length;
      if (r * e % 8)
        throw new Error("padding: invalid, string should have whole number of bytes");
      for (; r > 0 && n[r - 1] === t; r--)
        if ((r - 1) * e % 8 === 0)
          throw new Error("padding: invalid, string has too much padding");
      return n.slice(0, r);
    }
  };
}
const Zs = (e, t) => t === 0 ? e : Zs(t, e % t), qn = /* @__NO_SIDE_EFFECTS__ */ (e, t) => e + (t - Zs(e, t)), In = /* @__PURE__ */ (() => {
  let e = [];
  for (let t = 0; t < 40; t++)
    e.push(2 ** t);
  return e;
})();
function Pr(e, t, n, r) {
  if (Nr(e), t <= 0 || t > 32)
    throw new Error(`convertRadix2: wrong from=${t}`);
  if (n <= 0 || n > 32)
    throw new Error(`convertRadix2: wrong to=${n}`);
  if (/* @__PURE__ */ qn(t, n) > 32)
    throw new Error(`convertRadix2: carry overflow from=${t} to=${n} carryBits=${/* @__PURE__ */ qn(t, n)}`);
  let i = 0, o = 0;
  const s = In[t], c = In[n] - 1, a = [];
  for (const u of e) {
    if (ci(u), u >= s)
      throw new Error(`convertRadix2: invalid data word=${u} from=${t}`);
    if (i = i << t | u, o + t > 32)
      throw new Error(`convertRadix2: carry overflow pos=${o} from=${t}`);
    for (o += t; o >= n; o -= n)
      a.push((i >> o - n & c) >>> 0);
    const f = In[o];
    if (f === void 0)
      throw new Error("invalid carry");
    i &= f - 1;
  }
  if (i = i << n - o & c, !r && o >= t)
    throw new Error("Excess padding");
  if (!r && i > 0)
    throw new Error(`Non-zero padding: ${i}`);
  return r && o > 0 && a.push(i >>> 0), a;
}
// @__NO_SIDE_EFFECTS__
function Ws(e, t = !1) {
  if (ci(e), e <= 0 || e > 32)
    throw new Error("radix2: bits should be in (0..32]");
  if (/* @__PURE__ */ qn(8, e) > 32 || /* @__PURE__ */ qn(e, 8) > 32)
    throw new Error("radix2: carry overflow");
  return {
    encode: (n) => {
      if (!ai(n))
        throw new Error("radix2.encode input should be Uint8Array");
      return Pr(Array.from(n), 8, e, !t);
    },
    decode: (n) => (qs("radix2.decode", n), Uint8Array.from(Pr(n, e, 8, t)))
  };
}
function oo(e) {
  return vu(e), function(...t) {
    try {
      return e.apply(null, t);
    } catch {
    }
  };
}
const Eu = typeof Uint8Array.from([]).toBase64 == "function" && typeof Uint8Array.fromBase64 == "function", xu = (e, t) => {
  xt("base64", e);
  const n = /^[A-Za-z0-9=+/]+$/, r = "base64";
  if (e.length > 0 && !n.test(e))
    throw new Error("invalid base64");
  return Uint8Array.fromBase64(e, { alphabet: r, lastChunkHandling: "strict" });
}, lt = Eu ? {
  encode(e) {
    return mu(e), e.toBase64();
  },
  decode(e) {
    return xu(e);
  }
} : /* @__PURE__ */ Vs(/* @__PURE__ */ Ws(6), /* @__PURE__ */ Fs("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), /* @__PURE__ */ _u(6), /* @__PURE__ */ Ks("")), Mr = /* @__PURE__ */ Vs(/* @__PURE__ */ Fs("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), /* @__PURE__ */ Ks("")), so = [996825010, 642813549, 513874426, 1027748829, 705979059];
function Zt(e) {
  const t = e >> 25;
  let n = (e & 33554431) << 5;
  for (let r = 0; r < so.length; r++)
    (t >> r & 1) === 1 && (n ^= so[r]);
  return n;
}
function ao(e, t, n = 1) {
  const r = e.length;
  let i = 1;
  for (let o = 0; o < r; o++) {
    const s = e.charCodeAt(o);
    if (s < 33 || s > 126)
      throw new Error(`Invalid prefix (${e})`);
    i = Zt(i) ^ s >> 5;
  }
  i = Zt(i);
  for (let o = 0; o < r; o++)
    i = Zt(i) ^ e.charCodeAt(o) & 31;
  for (let o of t)
    i = Zt(i) ^ o;
  for (let o = 0; o < 6; o++)
    i = Zt(i);
  return i ^= n, Mr.encode(Pr([i % In[30]], 30, 5, !1));
}
// @__NO_SIDE_EFFECTS__
function ku(e) {
  const t = e === "bech32" ? 1 : 734539939, n = /* @__PURE__ */ Ws(5), r = n.decode, i = n.encode, o = oo(r);
  function s(h, b, p = 90) {
    xt("bech32.encode prefix", h), ai(b) && (b = Array.from(b)), qs("bech32.encode", b);
    const l = h.length;
    if (l === 0)
      throw new TypeError(`Invalid prefix length ${l}`);
    const d = l + 7 + b.length;
    if (p !== !1 && d > p)
      throw new TypeError(`Length ${d} exceeds limit ${p}`);
    const w = h.toLowerCase(), g = ao(w, b, t);
    return `${w}1${Mr.encode(b)}${g}`;
  }
  function c(h, b = 90) {
    xt("bech32.decode input", h);
    const p = h.length;
    if (p < 8 || b !== !1 && p > b)
      throw new TypeError(`invalid string length: ${p} (${h}). Expected (8..${b})`);
    const l = h.toLowerCase();
    if (h !== l && h !== h.toUpperCase())
      throw new Error("String must be lowercase or uppercase");
    const d = l.lastIndexOf("1");
    if (d === 0 || d === -1)
      throw new Error('Letter "1" must be present between prefix and data only');
    const w = l.slice(0, d), g = l.slice(d + 1);
    if (g.length < 6)
      throw new Error("Data must be at least 6 characters long");
    const y = Mr.decode(g).slice(0, -6), m = ao(w, y, t);
    if (!g.endsWith(m))
      throw new Error(`Invalid checksum in ${h}: expected "${m}"`);
    return { prefix: w, words: y };
  }
  const a = oo(c);
  function u(h) {
    const { prefix: b, words: p } = c(h, !1);
    return { prefix: b, words: p, bytes: r(p) };
  }
  function f(h, b) {
    return s(h, i(b));
  }
  return {
    encode: s,
    decode: c,
    encodeFromBytes: f,
    decodeToBytes: u,
    decodeUnsafe: a,
    fromWords: r,
    fromWordsUnsafe: o,
    toWords: i
  };
}
const qt = /* @__PURE__ */ ku("bech32");
function Au(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function co(e) {
  if (typeof e != "boolean")
    throw new Error(`boolean expected, not ${e}`);
}
function pr(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error("positive integer expected, got " + e);
}
function fe(e, t, n = "") {
  const r = Au(e), i = e?.length, o = t !== void 0;
  if (!r || o && i !== t) {
    const s = n && `"${n}" `, c = o ? ` of length ${t}` : "", a = r ? `length=${i}` : `type=${typeof e}`;
    throw new Error(s + "expected Uint8Array" + c + ", got " + a);
  }
  return e;
}
function se(e) {
  return new Uint32Array(e.buffer, e.byteOffset, Math.floor(e.byteLength / 4));
}
function Vt(...e) {
  for (let t = 0; t < e.length; t++)
    e[t].fill(0);
}
const Su = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Iu(e, t) {
  return e.buffer === t.buffer && // best we can do, may fail with an obscure Proxy
  e.byteOffset < t.byteOffset + t.byteLength && // a starts before b end
  t.byteOffset < e.byteOffset + e.byteLength;
}
function Gs(e, t) {
  if (Iu(e, t) && e.byteOffset < t.byteOffset)
    throw new Error("complex overlap of input and output is not supported");
}
function Ru(e, t) {
  if (t == null || typeof t != "object")
    throw new Error("options must be defined");
  return Object.assign(e, t);
}
function $u(e, t) {
  if (e.length !== t.length)
    return !1;
  let n = 0;
  for (let r = 0; r < e.length; r++)
    n |= e[r] ^ t[r];
  return n === 0;
}
const Cu = /* @__NO_SIDE_EFFECTS__ */ (e, t) => {
  function n(r, ...i) {
    if (fe(r, void 0, "key"), !Su)
      throw new Error("Non little-endian hardware is not yet supported");
    if (e.nonceLength !== void 0) {
      const f = i[0];
      fe(f, e.varSizeNonce ? void 0 : e.nonceLength, "nonce");
    }
    const o = e.tagLength;
    o && i[1] !== void 0 && fe(i[1], void 0, "AAD");
    const s = t(r, ...i), c = (f, h) => {
      if (h !== void 0) {
        if (f !== 2)
          throw new Error("cipher output not supported");
        fe(h, void 0, "output");
      }
    };
    let a = !1;
    return {
      encrypt(f, h) {
        if (a)
          throw new Error("cannot encrypt() twice with same key + nonce");
        return a = !0, fe(f), c(s.encrypt.length, h), s.encrypt(f, h);
      },
      decrypt(f, h) {
        if (fe(f), o && f.length < o)
          throw new Error('"ciphertext" expected length bigger than tagLength=' + o);
        return c(s.decrypt.length, h), s.decrypt(f, h);
      }
    };
  }
  return Object.assign(n, e), n;
};
function Ys(e, t, n = !0) {
  if (t === void 0)
    return new Uint8Array(e);
  if (t.length !== e)
    throw new Error('"output" expected Uint8Array of length ' + e + ", got: " + t.length);
  if (n && !Bt(t))
    throw new Error("invalid output, must be aligned");
  return t;
}
function Bt(e) {
  return e.byteOffset % 4 === 0;
}
function _t(e) {
  return Uint8Array.from(e);
}
const ot = 16, Lu = 283;
function Ou(e) {
  if (![16, 24, 32].includes(e.length))
    throw new Error('"aes key" expected Uint8Array of length 16/24/32, got length=' + e.length);
}
function li(e) {
  return e << 1 ^ Lu & -(e >> 7);
}
function Ct(e, t) {
  let n = 0;
  for (; t > 0; t >>= 1)
    n ^= e & -(t & 1), e = li(e);
  return n;
}
const Ur = /* @__PURE__ */ (() => {
  const e = new Uint8Array(256);
  for (let n = 0, r = 1; n < 256; n++, r ^= li(r))
    e[n] = r;
  const t = new Uint8Array(256);
  t[0] = 99;
  for (let n = 0; n < 255; n++) {
    let r = e[255 - n];
    r |= r << 8, t[e[n]] = (r ^ r >> 4 ^ r >> 5 ^ r >> 6 ^ r >> 7 ^ 99) & 255;
  }
  return Vt(e), t;
})(), Tu = /* @__PURE__ */ Ur.map((e, t) => Ur.indexOf(t)), Bu = (e) => e << 24 | e >>> 8, gr = (e) => e << 8 | e >>> 24;
function Xs(e, t) {
  if (e.length !== 256)
    throw new Error("Wrong sbox length");
  const n = new Uint32Array(256).map((u, f) => t(e[f])), r = n.map(gr), i = r.map(gr), o = i.map(gr), s = new Uint32Array(256 * 256), c = new Uint32Array(256 * 256), a = new Uint16Array(256 * 256);
  for (let u = 0; u < 256; u++)
    for (let f = 0; f < 256; f++) {
      const h = u * 256 + f;
      s[h] = n[u] ^ r[f], c[h] = i[u] ^ o[f], a[h] = e[u] << 8 | e[f];
    }
  return { sbox: e, sbox2: a, T0: n, T1: r, T2: i, T3: o, T01: s, T23: c };
}
const ui = /* @__PURE__ */ Xs(Ur, (e) => Ct(e, 3) << 24 | e << 16 | e << 8 | Ct(e, 2)), Js = /* @__PURE__ */ Xs(Tu, (e) => Ct(e, 11) << 24 | Ct(e, 13) << 16 | Ct(e, 9) << 8 | Ct(e, 14)), Nu = /* @__PURE__ */ (() => {
  const e = new Uint8Array(16);
  for (let t = 0, n = 1; t < 16; t++, n = li(n))
    e[t] = n;
  return e;
})();
function Qs(e) {
  fe(e);
  const t = e.length;
  Ou(e);
  const { sbox2: n } = ui, r = [];
  Bt(e) || r.push(e = _t(e));
  const i = se(e), o = i.length, s = (a) => Oe(n, a, a, a, a), c = new Uint32Array(t + 28);
  c.set(i);
  for (let a = o; a < c.length; a++) {
    let u = c[a - 1];
    a % o === 0 ? u = s(Bu(u)) ^ Nu[a / o - 1] : o > 6 && a % o === 4 && (u = s(u)), c[a] = c[a - o] ^ u;
  }
  return Vt(...r), c;
}
function Pu(e) {
  const t = Qs(e), n = t.slice(), r = t.length, { sbox2: i } = ui, { T0: o, T1: s, T2: c, T3: a } = Js;
  for (let u = 0; u < r; u += 4)
    for (let f = 0; f < 4; f++)
      n[u + f] = t[r - u - 4 + f];
  Vt(t);
  for (let u = 4; u < r - 4; u++) {
    const f = n[u], h = Oe(i, f, f, f, f);
    n[u] = o[h & 255] ^ s[h >>> 8 & 255] ^ c[h >>> 16 & 255] ^ a[h >>> 24];
  }
  return n;
}
function nt(e, t, n, r, i, o) {
  return e[n << 8 & 65280 | r >>> 8 & 255] ^ t[i >>> 8 & 65280 | o >>> 24 & 255];
}
function Oe(e, t, n, r, i) {
  return e[t & 255 | n & 65280] | e[r >>> 16 & 255 | i >>> 16 & 65280] << 16;
}
function lo(e, t, n, r, i) {
  const { sbox2: o, T01: s, T23: c } = ui;
  let a = 0;
  t ^= e[a++], n ^= e[a++], r ^= e[a++], i ^= e[a++];
  const u = e.length / 4 - 2;
  for (let l = 0; l < u; l++) {
    const d = e[a++] ^ nt(s, c, t, n, r, i), w = e[a++] ^ nt(s, c, n, r, i, t), g = e[a++] ^ nt(s, c, r, i, t, n), y = e[a++] ^ nt(s, c, i, t, n, r);
    t = d, n = w, r = g, i = y;
  }
  const f = e[a++] ^ Oe(o, t, n, r, i), h = e[a++] ^ Oe(o, n, r, i, t), b = e[a++] ^ Oe(o, r, i, t, n), p = e[a++] ^ Oe(o, i, t, n, r);
  return { s0: f, s1: h, s2: b, s3: p };
}
function Mu(e, t, n, r, i) {
  const { sbox2: o, T01: s, T23: c } = Js;
  let a = 0;
  t ^= e[a++], n ^= e[a++], r ^= e[a++], i ^= e[a++];
  const u = e.length / 4 - 2;
  for (let l = 0; l < u; l++) {
    const d = e[a++] ^ nt(s, c, t, i, r, n), w = e[a++] ^ nt(s, c, n, t, i, r), g = e[a++] ^ nt(s, c, r, n, t, i), y = e[a++] ^ nt(s, c, i, r, n, t);
    t = d, n = w, r = g, i = y;
  }
  const f = e[a++] ^ Oe(o, t, i, r, n), h = e[a++] ^ Oe(o, n, t, i, r), b = e[a++] ^ Oe(o, r, n, t, i), p = e[a++] ^ Oe(o, i, r, n, t);
  return { s0: f, s1: h, s2: b, s3: p };
}
function Uu(e) {
  if (fe(e), e.length % ot !== 0)
    throw new Error("aes-(cbc/ecb).decrypt ciphertext should consist of blocks with size " + ot);
}
function zu(e, t, n) {
  fe(e);
  let r = e.length;
  const i = r % ot;
  if (!t && i !== 0)
    throw new Error("aec/(cbc-ecb): unpadded plaintext with disabled padding");
  Bt(e) || (e = _t(e));
  const o = se(e);
  if (t) {
    let c = ot - i;
    c || (c = ot), r = r + c;
  }
  n = Ys(r, n), Gs(e, n);
  const s = se(n);
  return { b: o, o: s, out: n };
}
function Du(e, t) {
  if (!t)
    return e;
  const n = e.length;
  if (!n)
    throw new Error("aes/pcks5: empty ciphertext not allowed");
  const r = e[n - 1];
  if (r <= 0 || r > 16)
    throw new Error("aes/pcks5: wrong padding");
  const i = e.subarray(0, -r);
  for (let o = 0; o < r; o++)
    if (e[n - o - 1] !== r)
      throw new Error("aes/pcks5: wrong padding");
  return i;
}
function Hu(e) {
  const t = new Uint8Array(16), n = se(t);
  t.set(e);
  const r = ot - e.length;
  for (let i = ot - r; i < ot; i++)
    t[i] = r;
  return n;
}
const ea = /* @__PURE__ */ Cu({ blockSize: 16, nonceLength: 16 }, function(t, n, r = {}) {
  const i = !r.disablePadding;
  return {
    encrypt(o, s) {
      const c = Qs(t), { b: a, o: u, out: f } = zu(o, i, s);
      let h = n;
      const b = [c];
      Bt(h) || b.push(h = _t(h));
      const p = se(h);
      let l = p[0], d = p[1], w = p[2], g = p[3], y = 0;
      for (; y + 4 <= a.length; )
        l ^= a[y + 0], d ^= a[y + 1], w ^= a[y + 2], g ^= a[y + 3], { s0: l, s1: d, s2: w, s3: g } = lo(c, l, d, w, g), u[y++] = l, u[y++] = d, u[y++] = w, u[y++] = g;
      if (i) {
        const m = Hu(o.subarray(y * 4));
        l ^= m[0], d ^= m[1], w ^= m[2], g ^= m[3], { s0: l, s1: d, s2: w, s3: g } = lo(c, l, d, w, g), u[y++] = l, u[y++] = d, u[y++] = w, u[y++] = g;
      }
      return Vt(...b), f;
    },
    decrypt(o, s) {
      Uu(o);
      const c = Pu(t);
      let a = n;
      const u = [c];
      Bt(a) || u.push(a = _t(a));
      const f = se(a);
      s = Ys(o.length, s), Bt(o) || u.push(o = _t(o)), Gs(o, s);
      const h = se(o), b = se(s);
      let p = f[0], l = f[1], d = f[2], w = f[3];
      for (let g = 0; g + 4 <= h.length; ) {
        const y = p, m = l, C = d, ae = w;
        p = h[g + 0], l = h[g + 1], d = h[g + 2], w = h[g + 3];
        const { s0: z, s1: V, s2: Y, s3: L } = Mu(c, p, l, d, w);
        b[g++] = z ^ y, b[g++] = V ^ m, b[g++] = Y ^ C, b[g++] = L ^ ae;
      }
      return Vt(...u), Du(s, i);
    }
  };
}), ta = (e) => Uint8Array.from(e.split(""), (t) => t.charCodeAt(0)), ju = ta("expand 16-byte k"), qu = ta("expand 32-byte k"), Vu = se(ju), Fu = se(qu);
function P(e, t) {
  return e << t | e >>> 32 - t;
}
function zr(e) {
  return e.byteOffset % 4 === 0;
}
const vn = 64, Ku = 16, na = 2 ** 32 - 1, uo = Uint32Array.of();
function Zu(e, t, n, r, i, o, s, c) {
  const a = i.length, u = new Uint8Array(vn), f = se(u), h = zr(i) && zr(o), b = h ? se(i) : uo, p = h ? se(o) : uo;
  for (let l = 0; l < a; s++) {
    if (e(t, n, r, f, s, c), s >= na)
      throw new Error("arx: counter overflow");
    const d = Math.min(vn, a - l);
    if (h && d === vn) {
      const w = l / 4;
      if (l % 4 !== 0)
        throw new Error("arx: invalid block position");
      for (let g = 0, y; g < Ku; g++)
        y = w + g, p[y] = b[y] ^ f[g];
      l += vn;
      continue;
    }
    for (let w = 0, g; w < d; w++)
      g = l + w, o[g] = i[g] ^ u[w];
    l += d;
  }
}
function Wu(e, t) {
  const { allowShortKeys: n, extendNonceFn: r, counterLength: i, counterRight: o, rounds: s } = Ru({ allowShortKeys: !1, counterLength: 8, counterRight: !1, rounds: 20 }, t);
  if (typeof e != "function")
    throw new Error("core must be a function");
  return pr(i), pr(s), co(o), co(n), (c, a, u, f, h = 0) => {
    fe(c, void 0, "key"), fe(a, void 0, "nonce"), fe(u, void 0, "data");
    const b = u.length;
    if (f === void 0 && (f = new Uint8Array(b)), fe(f, void 0, "output"), pr(h), h < 0 || h >= na)
      throw new Error("arx: counter overflow");
    if (f.length < b)
      throw new Error(`arx: output (${f.length}) is shorter than data (${b})`);
    const p = [];
    let l = c.length, d, w;
    if (l === 32)
      p.push(d = _t(c)), w = Fu;
    else if (l === 16 && n)
      d = new Uint8Array(32), d.set(c), d.set(c, 16), w = Vu, p.push(d);
    else
      throw fe(c, 32, "arx key"), new Error("invalid key size");
    zr(a) || p.push(a = _t(a));
    const g = se(d);
    if (r) {
      if (a.length !== 24)
        throw new Error("arx: extended nonce must be 24 bytes");
      r(w, g, se(a.subarray(0, 16)), g), a = a.subarray(16);
    }
    const y = 16 - i;
    if (y !== a.length)
      throw new Error(`arx: nonce must be ${y} or 16 bytes`);
    if (y !== 12) {
      const C = new Uint8Array(12);
      C.set(a, o ? 0 : 12 - a.length), a = C, p.push(a);
    }
    const m = se(a);
    return Zu(e, w, g, m, u, f, h, s), Vt(...p), f;
  };
}
function Gu(e, t, n, r, i, o = 20) {
  let s = e[0], c = e[1], a = e[2], u = e[3], f = t[0], h = t[1], b = t[2], p = t[3], l = t[4], d = t[5], w = t[6], g = t[7], y = i, m = n[0], C = n[1], ae = n[2], z = s, V = c, Y = a, L = u, ee = f, X = h, O = b, E = p, _ = l, v = d, x = w, A = g, I = y, S = m, k = C, R = ae;
  for (let F = 0; F < o; F += 2)
    z = z + ee | 0, I = P(I ^ z, 16), _ = _ + I | 0, ee = P(ee ^ _, 12), z = z + ee | 0, I = P(I ^ z, 8), _ = _ + I | 0, ee = P(ee ^ _, 7), V = V + X | 0, S = P(S ^ V, 16), v = v + S | 0, X = P(X ^ v, 12), V = V + X | 0, S = P(S ^ V, 8), v = v + S | 0, X = P(X ^ v, 7), Y = Y + O | 0, k = P(k ^ Y, 16), x = x + k | 0, O = P(O ^ x, 12), Y = Y + O | 0, k = P(k ^ Y, 8), x = x + k | 0, O = P(O ^ x, 7), L = L + E | 0, R = P(R ^ L, 16), A = A + R | 0, E = P(E ^ A, 12), L = L + E | 0, R = P(R ^ L, 8), A = A + R | 0, E = P(E ^ A, 7), z = z + X | 0, R = P(R ^ z, 16), x = x + R | 0, X = P(X ^ x, 12), z = z + X | 0, R = P(R ^ z, 8), x = x + R | 0, X = P(X ^ x, 7), V = V + O | 0, I = P(I ^ V, 16), A = A + I | 0, O = P(O ^ A, 12), V = V + O | 0, I = P(I ^ V, 8), A = A + I | 0, O = P(O ^ A, 7), Y = Y + E | 0, S = P(S ^ Y, 16), _ = _ + S | 0, E = P(E ^ _, 12), Y = Y + E | 0, S = P(S ^ Y, 8), _ = _ + S | 0, E = P(E ^ _, 7), L = L + ee | 0, k = P(k ^ L, 16), v = v + k | 0, ee = P(ee ^ v, 12), L = L + ee | 0, k = P(k ^ L, 8), v = v + k | 0, ee = P(ee ^ v, 7);
  let $ = 0;
  r[$++] = s + z | 0, r[$++] = c + V | 0, r[$++] = a + Y | 0, r[$++] = u + L | 0, r[$++] = f + ee | 0, r[$++] = h + X | 0, r[$++] = b + O | 0, r[$++] = p + E | 0, r[$++] = l + _ | 0, r[$++] = d + v | 0, r[$++] = w + x | 0, r[$++] = g + A | 0, r[$++] = y + I | 0, r[$++] = m + S | 0, r[$++] = C + k | 0, r[$++] = ae + R | 0;
}
const ra = /* @__PURE__ */ Wu(Gu, {
  counterRight: !1,
  counterLength: 4,
  allowShortKeys: !1
});
function Yu(e, t, n) {
  return Yn(e), n === void 0 && (n = new Uint8Array(e.outputLen)), hn(e, n, t);
}
const wr = /* @__PURE__ */ Uint8Array.of(0), fo = /* @__PURE__ */ Uint8Array.of();
function Xu(e, t, n, r = 32) {
  Yn(e), ct(r, "length");
  const i = e.outputLen;
  if (r > 255 * i)
    throw new Error("Length must be <= 255*HashLen");
  const o = Math.ceil(r / i);
  n === void 0 ? n = fo : D(n, void 0, "info");
  const s = new Uint8Array(o * i), c = hn.create(e, t), a = c._cloneInto(), u = new Uint8Array(c.outputLen);
  for (let f = 0; f < o; f++)
    wr[0] = f + 1, a.update(f === 0 ? fo : u).update(n).update(wr).digestInto(u), s.set(u, i * f), c._cloneInto(a);
  return c.destroy(), a.destroy(), on(u, wr), s.slice(0, r);
}
var Ju = Object.defineProperty, H = (e, t) => {
  for (var n in t)
    Ju(e, n, { get: t[n], enumerable: !0 });
}, Rt = Symbol("verified"), Qu = (e) => e instanceof Object;
function Qn(e) {
  if (!Qu(e) || typeof e.kind != "number" || typeof e.content != "string" || typeof e.created_at != "number" || typeof e.pubkey != "string" || !e.pubkey.match(/^[a-f0-9]{64}$/) || !Array.isArray(e.tags))
    return !1;
  for (let t = 0; t < e.tags.length; t++) {
    let n = e.tags[t];
    if (!Array.isArray(n))
      return !1;
    for (let r = 0; r < n.length; r++)
      if (typeof n[r] != "string")
        return !1;
  }
  return !0;
}
var ia = {};
H(ia, {
  binarySearch: () => fi,
  bytesToHex: () => q,
  hexToBytes: () => G,
  insertEventIntoAscendingList: () => nf,
  insertEventIntoDescendingList: () => tf,
  mergeReverseSortedLists: () => rf,
  normalizeURL: () => ef,
  utf8Decoder: () => Fe,
  utf8Encoder: () => _e
});
var Fe = new TextDecoder("utf-8"), _e = new TextEncoder();
function ef(e) {
  try {
    e.indexOf("://") === -1 && (e = "wss://" + e);
    let t = new URL(e);
    return t.protocol === "http:" ? t.protocol = "ws:" : t.protocol === "https:" && (t.protocol = "wss:"), t.pathname = t.pathname.replace(/\/+/g, "/"), t.pathname.endsWith("/") && (t.pathname = t.pathname.slice(0, -1)), (t.port === "80" && t.protocol === "ws:" || t.port === "443" && t.protocol === "wss:") && (t.port = ""), t.searchParams.sort(), t.hash = "", t.toString();
  } catch {
    throw new Error(`Invalid URL: ${e}`);
  }
}
function tf(e, t) {
  const [n, r] = fi(e, (i) => t.id === i.id ? 0 : t.created_at === i.created_at ? -1 : i.created_at - t.created_at);
  return r || e.splice(n, 0, t), e;
}
function nf(e, t) {
  const [n, r] = fi(e, (i) => t.id === i.id ? 0 : t.created_at === i.created_at ? -1 : t.created_at - i.created_at);
  return r || e.splice(n, 0, t), e;
}
function fi(e, t) {
  let n = 0, r = e.length - 1;
  for (; n <= r; ) {
    const i = Math.floor((n + r) / 2), o = t(e[i]);
    if (o === 0)
      return [i, !0];
    o < 0 ? r = i - 1 : n = i + 1;
  }
  return [n, !1];
}
function rf(e, t) {
  const n = new Array(e.length + t.length);
  n.length = 0;
  let r = 0, i = 0, o = [];
  for (; r < e.length && i < t.length; ) {
    let s;
    if (e[r]?.created_at > t[i]?.created_at ? (s = e[r], r++) : (s = t[i], i++), n.length > 0 && n[n.length - 1].created_at === s.created_at) {
      if (o.includes(s.id))
        continue;
    } else
      o.length = 0;
    n.push(s), o.push(s.id);
  }
  for (; r < e.length; ) {
    const s = e[r];
    if (r++, n.length > 0 && n[n.length - 1].created_at === s.created_at) {
      if (o.includes(s.id))
        continue;
    } else
      o.length = 0;
    n.push(s), o.push(s.id);
  }
  for (; i < t.length; ) {
    const s = t[i];
    if (i++, n.length > 0 && n[n.length - 1].created_at === s.created_at) {
      if (o.includes(s.id))
        continue;
    } else
      o.length = 0;
    n.push(s), o.push(s.id);
  }
  return n;
}
var of = class {
  generateSecretKey() {
    return Kt.utils.randomSecretKey();
  }
  getPublicKey(e) {
    return q(Kt.getPublicKey(e));
  }
  finalizeEvent(e, t) {
    const n = e;
    return n.pubkey = q(Kt.getPublicKey(t)), n.id = tn(n), n.sig = q(Kt.sign(G(tn(n)), t)), n[Rt] = !0, n;
  }
  verifyEvent(e) {
    if (typeof e[Rt] == "boolean")
      return e[Rt];
    try {
      const t = tn(e);
      if (t !== e.id)
        return e[Rt] = !1, !1;
      const n = Kt.verify(G(e.sig), G(t), G(e.pubkey));
      return e[Rt] = n, n;
    } catch {
      return e[Rt] = !1, !1;
    }
  }
};
function sf(e) {
  if (!Qn(e))
    throw new Error("can't serialize event with wrong or missing properties");
  return JSON.stringify([0, e.pubkey, e.created_at, e.kind, e.tags, e.content]);
}
function tn(e) {
  let t = Me(_e.encode(sf(e)));
  return q(t);
}
var er = new of(), af = er.generateSecretKey, di = er.getPublicKey, Ue = er.finalizeEvent, tr = er.verifyEvent, cf = {};
H(cf, {
  Application: () => vd,
  BadgeAward: () => wf,
  BadgeDefinition: () => hd,
  BlockedRelaysList: () => Gf,
  BlossomServerList: () => nd,
  BookmarkList: () => Kf,
  Bookmarksets: () => ud,
  Calendar: () => Id,
  CalendarEventRSVP: () => Rd,
  ChannelCreation: () => ua,
  ChannelHideMessage: () => ha,
  ChannelMessage: () => da,
  ChannelMetadata: () => fa,
  ChannelMuteUser: () => pa,
  ChatMessage: () => bf,
  ClassifiedListing: () => xd,
  ClientAuth: () => wa,
  Comment: () => Sf,
  CommunitiesList: () => Zf,
  CommunityDefinition: () => Od,
  CommunityPostApproval: () => Bf,
  Contacts: () => hf,
  CreateOrUpdateProduct: () => wd,
  CreateOrUpdateStall: () => gd,
  Curationsets: () => fd,
  Date: () => Ad,
  DirectMessageRelaysList: () => ed,
  DraftClassifiedListing: () => kd,
  DraftLong: () => yd,
  Emojisets: () => md,
  EncryptedDirectMessage: () => pf,
  EventDeletion: () => gf,
  FavoriteRelays: () => Xf,
  FileMessage: () => mf,
  FileMetadata: () => Af,
  FileServerPreference: () => td,
  Followsets: () => ad,
  ForumThread: () => yf,
  GenericRepost: () => bi,
  Genericlists: () => cd,
  GiftWrap: () => ga,
  GroupMetadata: () => Td,
  HTTPAuth: () => yi,
  Handlerinformation: () => Ld,
  Handlerrecommendation: () => Cd,
  Highlights: () => Hf,
  InterestsList: () => Jf,
  Interestsets: () => pd,
  JobFeedback: () => Mf,
  JobRequest: () => Nf,
  JobResult: () => Pf,
  Label: () => Tf,
  LightningPubRPC: () => id,
  LiveChatMessage: () => If,
  LiveEvent: () => _d,
  LongFormArticle: () => bd,
  Metadata: () => ff,
  Mutelist: () => qf,
  NWCWalletInfo: () => rd,
  NWCWalletRequest: () => ba,
  NWCWalletResponse: () => od,
  NormalVideo: () => _f,
  NostrConnect: () => sd,
  OpenTimestamps: () => xf,
  Photo: () => vf,
  Pinlist: () => Vf,
  Poll: () => kf,
  PollResponse: () => jf,
  PrivateDirectMessage: () => la,
  ProblemTracker: () => Cf,
  ProfileBadges: () => dd,
  PublicChatsList: () => Wf,
  Reaction: () => wi,
  RecommendRelay: () => df,
  RelayList: () => Ff,
  RelayReview: () => $d,
  Relaysets: () => ld,
  Report: () => Lf,
  Reporting: () => Of,
  Repost: () => gi,
  Seal: () => ca,
  SearchRelaysList: () => Yf,
  ShortTextNote: () => aa,
  ShortVideo: () => Ef,
  Time: () => Sd,
  UserEmojiList: () => Qf,
  UserStatuses: () => Ed,
  Voice: () => Rf,
  VoiceComment: () => $f,
  Zap: () => Df,
  ZapGoal: () => Uf,
  ZapRequest: () => zf,
  classifyKind: () => lf,
  isAddressableKind: () => pi,
  isEphemeralKind: () => sa,
  isKind: () => uf,
  isRegularKind: () => oa,
  isReplaceableKind: () => hi
});
function oa(e) {
  return e < 1e4 && e !== 0 && e !== 3;
}
function hi(e) {
  return e === 0 || e === 3 || 1e4 <= e && e < 2e4;
}
function sa(e) {
  return 2e4 <= e && e < 3e4;
}
function pi(e) {
  return 3e4 <= e && e < 4e4;
}
function lf(e) {
  return oa(e) ? "regular" : hi(e) ? "replaceable" : sa(e) ? "ephemeral" : pi(e) ? "parameterized" : "unknown";
}
function uf(e, t) {
  const n = t instanceof Array ? t : [t];
  return Qn(e) && n.includes(e.kind) || !1;
}
var ff = 0, aa = 1, df = 2, hf = 3, pf = 4, gf = 5, gi = 6, wi = 7, wf = 8, bf = 9, yf = 11, ca = 13, la = 14, mf = 15, bi = 16, vf = 20, _f = 21, Ef = 22, ua = 40, fa = 41, da = 42, ha = 43, pa = 44, xf = 1040, ga = 1059, kf = 1068, Af = 1063, Sf = 1111, If = 1311, Rf = 1222, $f = 1244, Cf = 1971, Lf = 1984, Of = 1984, Tf = 1985, Bf = 4550, Nf = 5999, Pf = 6999, Mf = 7e3, Uf = 9041, zf = 9734, Df = 9735, Hf = 9802, jf = 1018, qf = 1e4, Vf = 10001, Ff = 10002, Kf = 10003, Zf = 10004, Wf = 10005, Gf = 10006, Yf = 10007, Xf = 10012, Jf = 10015, Qf = 10030, ed = 10050, td = 10096, nd = 10063, rd = 13194, id = 21e3, wa = 22242, ba = 23194, od = 23195, sd = 24133, yi = 27235, ad = 3e4, cd = 30001, ld = 30002, ud = 30003, fd = 30004, dd = 30008, hd = 30009, pd = 30015, gd = 30017, wd = 30018, bd = 30023, yd = 30024, md = 30030, vd = 30078, _d = 30311, Ed = 30315, xd = 30402, kd = 30403, Ad = 31922, Sd = 31923, Id = 31924, Rd = 31925, $d = 31987, Cd = 31989, Ld = 31990, Od = 34550, Td = 39e3, Bd = {};
H(Bd, {
  getHex64: () => mi,
  getInt: () => ya,
  getSubscriptionId: () => Nd,
  matchEventId: () => Pd,
  matchEventKind: () => Ud,
  matchEventPubkey: () => Md
});
function mi(e, t) {
  let n = t.length + 3, r = e.indexOf(`"${t}":`) + n, i = e.slice(r).indexOf('"') + r + 1;
  return e.slice(i, i + 64);
}
function ya(e, t) {
  let n = t.length, r = e.indexOf(`"${t}":`) + n + 3, i = e.slice(r), o = Math.min(i.indexOf(","), i.indexOf("}"));
  return parseInt(i.slice(0, o), 10);
}
function Nd(e) {
  let t = e.slice(0, 22).indexOf('"EVENT"');
  if (t === -1)
    return null;
  let n = e.slice(t + 7 + 1).indexOf('"');
  if (n === -1)
    return null;
  let r = t + 7 + 1 + n, i = e.slice(r + 1, 80).indexOf('"');
  if (i === -1)
    return null;
  let o = r + 1 + i;
  return e.slice(r + 1, o);
}
function Pd(e, t) {
  return t === mi(e, "id");
}
function Md(e, t) {
  return t === mi(e, "pubkey");
}
function Ud(e, t) {
  return t === ya(e, "kind");
}
var zd = {};
H(zd, {
  makeAuthEvent: () => Dd
});
function Dd(e, t) {
  return {
    kind: wa,
    created_at: Math.floor(Date.now() / 1e3),
    tags: [
      ["relay", e],
      ["challenge", t]
    ],
    content: ""
  };
}
var Hd;
try {
  Hd = WebSocket;
} catch {
}
var jd;
try {
  jd = WebSocket;
} catch {
}
var ma = {};
H(ma, {
  BECH32_REGEX: () => va,
  Bech32MaxSize: () => vi,
  NostrTypeGuard: () => qd,
  decode: () => nr,
  decodeNostrURI: () => Fd,
  encodeBytes: () => ir,
  naddrEncode: () => Xd,
  neventEncode: () => Yd,
  noteEncode: () => Wd,
  nprofileEncode: () => Gd,
  npubEncode: () => Zd,
  nsecEncode: () => Kd
});
var qd = {
  isNProfile: (e) => /^nprofile1[a-z\d]+$/.test(e || ""),
  isNEvent: (e) => /^nevent1[a-z\d]+$/.test(e || ""),
  isNAddr: (e) => /^naddr1[a-z\d]+$/.test(e || ""),
  isNSec: (e) => /^nsec1[a-z\d]{58}$/.test(e || ""),
  isNPub: (e) => /^npub1[a-z\d]{58}$/.test(e || ""),
  isNote: (e) => /^note1[a-z\d]+$/.test(e || ""),
  isNcryptsec: (e) => /^ncryptsec1[a-z\d]+$/.test(e || "")
}, vi = 5e3, va = /[\x21-\x7E]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/;
function Vd(e) {
  const t = new Uint8Array(4);
  return t[0] = e >> 24 & 255, t[1] = e >> 16 & 255, t[2] = e >> 8 & 255, t[3] = e & 255, t;
}
function Fd(e) {
  try {
    return e.startsWith("nostr:") && (e = e.substring(6)), nr(e);
  } catch {
    return { type: "invalid", data: null };
  }
}
function nr(e) {
  let { prefix: t, words: n } = qt.decode(e, vi), r = new Uint8Array(qt.fromWords(n));
  switch (t) {
    case "nprofile": {
      let i = br(r);
      if (!i[0]?.[0])
        throw new Error("missing TLV 0 for nprofile");
      if (i[0][0].length !== 32)
        throw new Error("TLV 0 should be 32 bytes");
      return {
        type: "nprofile",
        data: {
          pubkey: q(i[0][0]),
          relays: i[1] ? i[1].map((o) => Fe.decode(o)) : []
        }
      };
    }
    case "nevent": {
      let i = br(r);
      if (!i[0]?.[0])
        throw new Error("missing TLV 0 for nevent");
      if (i[0][0].length !== 32)
        throw new Error("TLV 0 should be 32 bytes");
      if (i[2] && i[2][0].length !== 32)
        throw new Error("TLV 2 should be 32 bytes");
      if (i[3] && i[3][0].length !== 4)
        throw new Error("TLV 3 should be 4 bytes");
      return {
        type: "nevent",
        data: {
          id: q(i[0][0]),
          relays: i[1] ? i[1].map((o) => Fe.decode(o)) : [],
          author: i[2]?.[0] ? q(i[2][0]) : void 0,
          kind: i[3]?.[0] ? parseInt(q(i[3][0]), 16) : void 0
        }
      };
    }
    case "naddr": {
      let i = br(r);
      if (!i[0]?.[0])
        throw new Error("missing TLV 0 for naddr");
      if (!i[2]?.[0])
        throw new Error("missing TLV 2 for naddr");
      if (i[2][0].length !== 32)
        throw new Error("TLV 2 should be 32 bytes");
      if (!i[3]?.[0])
        throw new Error("missing TLV 3 for naddr");
      if (i[3][0].length !== 4)
        throw new Error("TLV 3 should be 4 bytes");
      return {
        type: "naddr",
        data: {
          identifier: Fe.decode(i[0][0]),
          pubkey: q(i[2][0]),
          kind: parseInt(q(i[3][0]), 16),
          relays: i[1] ? i[1].map((o) => Fe.decode(o)) : []
        }
      };
    }
    case "nsec":
      return { type: t, data: r };
    case "npub":
    case "note":
      return { type: t, data: q(r) };
    default:
      throw new Error(`unknown prefix ${t}`);
  }
}
function br(e) {
  let t = {}, n = e;
  for (; n.length > 0; ) {
    let r = n[0], i = n[1], o = n.slice(2, 2 + i);
    if (n = n.slice(2 + i), o.length < i)
      throw new Error(`not enough data to read on TLV ${r}`);
    t[r] = t[r] || [], t[r].push(o);
  }
  return t;
}
function Kd(e) {
  return ir("nsec", e);
}
function Zd(e) {
  return ir("npub", G(e));
}
function Wd(e) {
  return ir("note", G(e));
}
function rr(e, t) {
  let n = qt.toWords(t);
  return qt.encode(e, n, vi);
}
function ir(e, t) {
  return rr(e, t);
}
function Gd(e) {
  let t = _i({
    0: [G(e.pubkey)],
    1: (e.relays || []).map((n) => _e.encode(n))
  });
  return rr("nprofile", t);
}
function Yd(e) {
  let t;
  e.kind !== void 0 && (t = Vd(e.kind));
  let n = _i({
    0: [G(e.id)],
    1: (e.relays || []).map((r) => _e.encode(r)),
    2: e.author ? [G(e.author)] : [],
    3: t ? [new Uint8Array(t)] : []
  });
  return rr("nevent", n);
}
function Xd(e) {
  let t = new ArrayBuffer(4);
  new DataView(t).setUint32(0, e.kind, !1);
  let n = _i({
    0: [_e.encode(e.identifier)],
    1: (e.relays || []).map((r) => _e.encode(r)),
    2: [G(e.pubkey)],
    3: [new Uint8Array(t)]
  });
  return rr("naddr", n);
}
function _i(e) {
  let t = [];
  return Object.entries(e).reverse().forEach(([n, r]) => {
    r.forEach((i) => {
      let o = new Uint8Array(i.length + 2);
      o.set([parseInt(n)], 0), o.set([i.length], 1), o.set(i, 2), t.push(o);
    });
  }), de(...t);
}
var Jd = {};
H(Jd, {
  decrypt: () => Qd,
  encrypt: () => _a
});
function _a(e, t, n) {
  const r = e instanceof Uint8Array ? e : G(e), i = ii.getSharedSecret(r, G("02" + t)), o = Ea(i);
  let s = Uint8Array.from(Ft(16)), c = _e.encode(n), a = ea(o, s).encrypt(c), u = lt.encode(new Uint8Array(a)), f = lt.encode(new Uint8Array(s.buffer));
  return `${u}?iv=${f}`;
}
function Qd(e, t, n) {
  const r = e instanceof Uint8Array ? e : G(e);
  let [i, o] = n.split("?iv="), s = ii.getSharedSecret(r, G("02" + t)), c = Ea(s), a = lt.decode(o), u = lt.decode(i), f = ea(c, a).decrypt(u);
  return Fe.decode(f);
}
function Ea(e) {
  return e.slice(1, 33);
}
var eh = {};
H(eh, {
  NIP05_REGEX: () => Ei,
  isNip05: () => th,
  isValid: () => ih,
  queryProfile: () => xa,
  searchDomain: () => rh,
  useFetchImplementation: () => nh
});
var Ei = /^(?:([\w.+-]+)@)?([\w_-]+(\.[\w_-]+)+)$/, th = (e) => Ei.test(e || ""), or;
try {
  or = fetch;
} catch {
}
function nh(e) {
  or = e;
}
async function rh(e, t = "") {
  try {
    const n = `https://${e}/.well-known/nostr.json?name=${t}`, r = await or(n, { redirect: "manual" });
    if (r.status !== 200)
      throw Error("Wrong response code");
    return (await r.json()).names;
  } catch {
    return {};
  }
}
async function xa(e) {
  const t = e.match(Ei);
  if (!t)
    return null;
  const [, n = "_", r] = t;
  try {
    const i = `https://${r}/.well-known/nostr.json?name=${n}`, o = await or(i, { redirect: "manual" });
    if (o.status !== 200)
      throw Error("Wrong response code");
    const s = await o.json(), c = s.names[n];
    return c ? { pubkey: c, relays: s.relays?.[c] } : null;
  } catch {
    return null;
  }
}
async function ih(e, t) {
  const n = await xa(t);
  return n ? n.pubkey === e : !1;
}
var oh = {};
H(oh, {
  parse: () => sh
});
function sh(e) {
  const t = {
    reply: void 0,
    root: void 0,
    mentions: [],
    profiles: [],
    quotes: []
  };
  let n, r;
  for (let i = e.tags.length - 1; i >= 0; i--) {
    const o = e.tags[i];
    if (o[0] === "e" && o[1]) {
      const [s, c, a, u, f] = o, h = {
        id: c,
        relays: a ? [a] : [],
        author: f
      };
      if (u === "root") {
        t.root = h;
        continue;
      }
      if (u === "reply") {
        t.reply = h;
        continue;
      }
      if (u === "mention") {
        t.mentions.push(h);
        continue;
      }
      n ? r = h : n = h, t.mentions.push(h);
      continue;
    }
    if (o[0] === "q" && o[1]) {
      const [s, c, a] = o;
      t.quotes.push({
        id: c,
        relays: a ? [a] : []
      });
    }
    if (o[0] === "p" && o[1]) {
      t.profiles.push({
        pubkey: o[1],
        relays: o[2] ? [o[2]] : []
      });
      continue;
    }
  }
  return t.root || (t.root = r || n || t.reply), t.reply || (t.reply = n || t.root), [t.reply, t.root].forEach((i) => {
    if (!i)
      return;
    let o = t.mentions.indexOf(i);
    if (o !== -1 && t.mentions.splice(o, 1), i.author) {
      let s = t.profiles.find((c) => c.pubkey === i.author);
      s && s.relays && (i.relays || (i.relays = []), s.relays.forEach((c) => {
        i.relays?.indexOf(c) === -1 && i.relays.push(c);
      }), s.relays = i.relays);
    }
  }), t.mentions.forEach((i) => {
    if (i.author) {
      let o = t.profiles.find((s) => s.pubkey === i.author);
      o && o.relays && (i.relays || (i.relays = []), o.relays.forEach((s) => {
        i.relays.indexOf(s) === -1 && i.relays.push(s);
      }), o.relays = i.relays);
    }
  }), t;
}
var ah = {};
H(ah, {
  fetchRelayInformation: () => lh,
  useFetchImplementation: () => ch
});
var ka;
try {
  ka = fetch;
} catch {
}
function ch(e) {
  ka = e;
}
async function lh(e) {
  return await (await fetch(e.replace("ws://", "http://").replace("wss://", "https://"), {
    headers: { Accept: "application/nostr+json" }
  })).json();
}
var uh = {};
H(uh, {
  getPow: () => fh,
  minePow: () => hh
});
function fh(e) {
  let t = 0;
  for (let n = 0; n < 64; n += 8) {
    const r = parseInt(e.substring(n, n + 8), 16);
    if (r === 0)
      t += 32;
    else {
      t += Math.clz32(r);
      break;
    }
  }
  return t;
}
function dh(e) {
  let t = 0;
  for (let n = 0; n < e.length; n++) {
    const r = e[n];
    if (r === 0)
      t += 8;
    else {
      t += Math.clz32(r) - 24;
      break;
    }
  }
  return t;
}
function hh(e, t) {
  let n = 0;
  const r = e, i = ["nonce", n.toString(), t.toString()];
  for (r.tags.push(i); ; ) {
    const o = Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3);
    o !== r.created_at && (n = 0, r.created_at = o), i[1] = (++n).toString();
    const s = Me(
      _e.encode(JSON.stringify([0, r.pubkey, r.created_at, r.kind, r.tags, r.content]))
    );
    if (dh(s) >= t) {
      r.id = q(s);
      break;
    }
  }
  return r;
}
var ph = {};
H(ph, {
  unwrapEvent: () => Sh,
  unwrapManyEvents: () => Ih,
  wrapEvent: () => Ma,
  wrapManyEvents: () => Ah
});
var gh = {};
H(gh, {
  createRumor: () => Ta,
  createSeal: () => Ba,
  createWrap: () => Na,
  unwrapEvent: () => Ii,
  unwrapManyEvents: () => Pa,
  wrapEvent: () => Vn,
  wrapManyEvents: () => xh
});
var wh = {};
H(wh, {
  decrypt: () => Si,
  encrypt: () => Ai,
  getConversationKey: () => xi,
  v2: () => _h
});
var Aa = 1, Sa = 65535;
function xi(e, t) {
  const n = ii.getSharedSecret(e, G("02" + t)).subarray(1, 33);
  return Yu(Me, n, _e.encode("nip44-v2"));
}
function Ia(e, t) {
  const n = Xu(Me, e, t, 76);
  return {
    chacha_key: n.subarray(0, 32),
    chacha_nonce: n.subarray(32, 44),
    hmac_key: n.subarray(44, 76)
  };
}
function ki(e) {
  if (!Number.isSafeInteger(e) || e < 1)
    throw new Error("expected positive integer");
  if (e <= 32)
    return 32;
  const t = 1 << Math.floor(Math.log2(e - 1)) + 1, n = t <= 256 ? 32 : t / 8;
  return n * (Math.floor((e - 1) / n) + 1);
}
function bh(e) {
  if (!Number.isSafeInteger(e) || e < Aa || e > Sa)
    throw new Error("invalid plaintext size: must be between 1 and 65535 bytes");
  const t = new Uint8Array(2);
  return new DataView(t.buffer).setUint16(0, e, !1), t;
}
function yh(e) {
  const t = _e.encode(e), n = t.length, r = bh(n), i = new Uint8Array(ki(n) - n);
  return de(r, t, i);
}
function mh(e) {
  const t = new DataView(e.buffer).getUint16(0), n = e.subarray(2, 2 + t);
  if (t < Aa || t > Sa || n.length !== t || e.length !== 2 + ki(t))
    throw new Error("invalid padding");
  return Fe.decode(n);
}
function Ra(e, t, n) {
  if (n.length !== 32)
    throw new Error("AAD associated data must be 32 bytes");
  const r = de(n, t);
  return hn(Me, e, r);
}
function vh(e) {
  if (typeof e != "string")
    throw new Error("payload must be a valid string");
  const t = e.length;
  if (t < 132 || t > 87472)
    throw new Error("invalid payload length: " + t);
  if (e[0] === "#")
    throw new Error("unknown encryption version");
  let n;
  try {
    n = lt.decode(e);
  } catch (o) {
    throw new Error("invalid base64: " + o.message);
  }
  const r = n.length;
  if (r < 99 || r > 65603)
    throw new Error("invalid data length: " + r);
  const i = n[0];
  if (i !== 2)
    throw new Error("unknown encryption version " + i);
  return {
    nonce: n.subarray(1, 33),
    ciphertext: n.subarray(33, -32),
    mac: n.subarray(-32)
  };
}
function Ai(e, t, n = Ft(32)) {
  const { chacha_key: r, chacha_nonce: i, hmac_key: o } = Ia(t, n), s = yh(e), c = ra(r, i, s), a = Ra(o, c, n);
  return lt.encode(de(new Uint8Array([2]), n, c, a));
}
function Si(e, t) {
  const { nonce: n, ciphertext: r, mac: i } = vh(e), { chacha_key: o, chacha_nonce: s, hmac_key: c } = Ia(t, n), a = Ra(c, r, n);
  if (!$u(a, i))
    throw new Error("invalid MAC");
  const u = ra(o, s, r);
  return mh(u);
}
var _h = {
  utils: {
    getConversationKey: xi,
    calcPaddedLen: ki
  },
  encrypt: Ai,
  decrypt: Si
}, Eh = 2880 * 60, $a = () => Math.round(Date.now() / 1e3), Ca = () => Math.round($a() - Math.random() * Eh), La = (e, t) => xi(e, t), Oa = (e, t, n) => Ai(JSON.stringify(e), La(t, n)), ho = (e, t) => JSON.parse(Si(e.content, La(t, e.pubkey)));
function Ta(e, t) {
  const n = {
    created_at: $a(),
    content: "",
    tags: [],
    ...e,
    pubkey: di(t)
  };
  return n.id = tn(n), n;
}
function Ba(e, t, n) {
  return Ue(
    {
      kind: ca,
      content: Oa(e, t, n),
      created_at: Ca(),
      tags: []
    },
    t
  );
}
function Na(e, t) {
  const n = af();
  return Ue(
    {
      kind: ga,
      content: Oa(e, n, t),
      created_at: Ca(),
      tags: [["p", t]]
    },
    n
  );
}
function Vn(e, t, n) {
  const r = Ta(e, t), i = Ba(r, t, n);
  return Na(i, n);
}
function xh(e, t, n) {
  if (!n || n.length === 0)
    throw new Error("At least one recipient is required.");
  const r = di(t), i = [Vn(e, t, r)];
  return n.forEach((o) => {
    i.push(Vn(e, t, o));
  }), i;
}
function Ii(e, t) {
  const n = ho(e, t);
  return ho(n, t);
}
function Pa(e, t) {
  let n = [];
  return e.forEach((r) => {
    n.push(Ii(r, t));
  }), n.sort((r, i) => r.created_at - i.created_at), n;
}
function kh(e, t, n, r) {
  const i = {
    created_at: Math.ceil(Date.now() / 1e3),
    kind: la,
    tags: [],
    content: t
  };
  return (Array.isArray(e) ? e : [e]).forEach(({ publicKey: s, relayUrl: c }) => {
    i.tags.push(c ? ["p", s, c] : ["p", s]);
  }), r && i.tags.push(["e", r.eventId, r.relayUrl || "", "reply"]), n && i.tags.push(["subject", n]), i;
}
function Ma(e, t, n, r, i) {
  const o = kh(t, n, r, i);
  return Vn(o, e, t.publicKey);
}
function Ah(e, t, n, r, i) {
  if (!t || t.length === 0)
    throw new Error("At least one recipient is required.");
  return [{ publicKey: di(e) }, ...t].map(
    (s) => Ma(e, s, n, r, i)
  );
}
var Sh = Ii, Ih = Pa, Rh = {};
H(Rh, {
  finishRepostEvent: () => $h,
  getRepostedEvent: () => Ch,
  getRepostedEventPointer: () => Ua
});
function $h(e, t, n, r) {
  let i;
  const o = [...e.tags ?? [], ["e", t.id, n], ["p", t.pubkey]];
  return t.kind === aa ? i = gi : (i = bi, o.push(["k", String(t.kind)])), Ue(
    {
      kind: i,
      tags: o,
      content: e.content === "" || t.tags?.find((s) => s[0] === "-") ? "" : JSON.stringify(t),
      created_at: e.created_at
    },
    r
  );
}
function Ua(e) {
  if (![gi, bi].includes(e.kind))
    return;
  let t, n;
  for (let r = e.tags.length - 1; r >= 0 && (t === void 0 || n === void 0); r--) {
    const i = e.tags[r];
    i.length >= 2 && (i[0] === "e" && t === void 0 ? t = i : i[0] === "p" && n === void 0 && (n = i));
  }
  if (t !== void 0)
    return {
      id: t[1],
      relays: [t[2], n?.[2]].filter((r) => typeof r == "string"),
      author: n?.[1]
    };
}
function Ch(e, { skipVerification: t } = {}) {
  const n = Ua(e);
  if (n === void 0 || e.content === "")
    return;
  let r;
  try {
    r = JSON.parse(e.content);
  } catch {
    return;
  }
  if (r.id === n.id && !(!t && !tr(r)))
    return r;
}
var Lh = {};
H(Lh, {
  NOSTR_URI_REGEX: () => Ri,
  parse: () => Th,
  test: () => Oh
});
var Ri = new RegExp(`nostr:(${va.source})`);
function Oh(e) {
  return typeof e == "string" && new RegExp(`^${Ri.source}$`).test(e);
}
function Th(e) {
  const t = e.match(new RegExp(`^${Ri.source}$`));
  if (!t)
    throw new Error(`Invalid Nostr URI: ${e}`);
  return {
    uri: t[0],
    value: t[1],
    decoded: nr(t[1])
  };
}
var Bh = {};
H(Bh, {
  finishReactionEvent: () => Nh,
  getReactedEventPointer: () => Ph
});
function Nh(e, t, n) {
  const r = t.tags.filter((i) => i.length >= 2 && (i[0] === "e" || i[0] === "p"));
  return Ue(
    {
      ...e,
      kind: wi,
      tags: [...e.tags ?? [], ...r, ["e", t.id], ["p", t.pubkey]],
      content: e.content ?? "+"
    },
    n
  );
}
function Ph(e) {
  if (e.kind !== wi)
    return;
  let t, n;
  for (let r = e.tags.length - 1; r >= 0 && (t === void 0 || n === void 0); r--) {
    const i = e.tags[r];
    i.length >= 2 && (i[0] === "e" && t === void 0 ? t = i : i[0] === "p" && n === void 0 && (n = i));
  }
  if (!(t === void 0 || n === void 0))
    return {
      id: t[1],
      relays: [t[2], n[2]].filter((r) => r !== void 0),
      author: n[1]
    };
}
var Mh = {};
H(Mh, {
  parse: () => zh
});
var yr = /\W/m, po = /[^\w\/] |[^\w\/]$|$|,| /m, Uh = 42;
function* zh(e) {
  let t = [];
  if (typeof e != "string") {
    for (let o = 0; o < e.tags.length; o++) {
      const s = e.tags[o];
      s[0] === "emoji" && s.length >= 3 && t.push({ type: "emoji", shortcode: s[1], url: s[2] });
    }
    e = e.content;
  }
  const n = e.length;
  let r = 0, i = 0;
  e:
    for (; i < n; ) {
      const o = e.indexOf(":", i), s = e.indexOf("#", i);
      if (o === -1 && s === -1)
        break e;
      if (o === -1 || s >= 0 && s < o) {
        if (s === 0 || e[s - 1].match(yr)) {
          const c = e.slice(s + 1, s + Uh).match(yr), a = c ? s + 1 + c.index : n;
          yield { type: "text", text: e.slice(r, s) }, yield { type: "hashtag", value: e.slice(s + 1, a) }, i = a, r = i;
          continue e;
        }
        i = s + 1;
        continue e;
      }
      if (e.slice(o - 5, o) === "nostr") {
        const c = e.slice(o + 60).match(yr), a = c ? o + 60 + c.index : n;
        try {
          let u, { data: f, type: h } = nr(e.slice(o + 1, a));
          switch (h) {
            case "npub":
              u = { pubkey: f };
              break;
            case "note":
              u = { id: f };
              break;
            case "nsec":
              i = a + 1;
              continue;
            default:
              u = f;
          }
          r !== o - 5 && (yield { type: "text", text: e.slice(r, o - 5) }), yield { type: "reference", pointer: u }, i = a, r = i;
          continue e;
        } catch {
          i = o + 1;
          continue e;
        }
      } else if (e.slice(o - 5, o) === "https" || e.slice(o - 4, o) === "http") {
        const c = e.slice(o + 4).match(po), a = c ? o + 4 + c.index : n, u = e[o - 1] === "s" ? 5 : 4;
        try {
          let f = new URL(e.slice(o - u, a));
          if (f.hostname.indexOf(".") === -1)
            throw new Error("invalid url");
          if (r !== o - u && (yield { type: "text", text: e.slice(r, o - u) }), /\.(png|jpe?g|gif|webp|heic|svg)$/i.test(f.pathname)) {
            yield { type: "image", url: f.toString() }, i = a, r = i;
            continue e;
          }
          if (/\.(mp4|avi|webm|mkv|mov)$/i.test(f.pathname)) {
            yield { type: "video", url: f.toString() }, i = a, r = i;
            continue e;
          }
          if (/\.(mp3|aac|ogg|opus|wav|flac)$/i.test(f.pathname)) {
            yield { type: "audio", url: f.toString() }, i = a, r = i;
            continue e;
          }
          yield { type: "url", url: f.toString() }, i = a, r = i;
          continue e;
        } catch {
          i = a + 1;
          continue e;
        }
      } else if (e.slice(o - 3, o) === "wss" || e.slice(o - 2, o) === "ws") {
        const c = e.slice(o + 4).match(po), a = c ? o + 4 + c.index : n, u = e[o - 1] === "s" ? 3 : 2;
        try {
          let f = new URL(e.slice(o - u, a));
          if (f.hostname.indexOf(".") === -1)
            throw new Error("invalid ws url");
          r !== o - u && (yield { type: "text", text: e.slice(r, o - u) }), yield { type: "relay", url: f.toString() }, i = a, r = i;
          continue e;
        } catch {
          i = a + 1;
          continue e;
        }
      } else {
        for (let c = 0; c < t.length; c++) {
          const a = t[c];
          if (e[o + a.shortcode.length + 1] === ":" && e.slice(o + 1, o + a.shortcode.length + 1) === a.shortcode) {
            r !== o && (yield { type: "text", text: e.slice(r, o) }), yield a, i = o + a.shortcode.length + 2, r = i;
            continue e;
          }
        }
        i = o + 1;
        continue e;
      }
    }
  r !== n && (yield { type: "text", text: e.slice(r) });
}
var Dh = {};
H(Dh, {
  channelCreateEvent: () => Hh,
  channelHideMessageEvent: () => Vh,
  channelMessageEvent: () => qh,
  channelMetadataEvent: () => jh,
  channelMuteUserEvent: () => Fh
});
var Hh = (e, t) => {
  let n;
  if (typeof e.content == "object")
    n = JSON.stringify(e.content);
  else if (typeof e.content == "string")
    n = e.content;
  else
    return;
  return Ue(
    {
      kind: ua,
      tags: [...e.tags ?? []],
      content: n,
      created_at: e.created_at
    },
    t
  );
}, jh = (e, t) => {
  let n;
  if (typeof e.content == "object")
    n = JSON.stringify(e.content);
  else if (typeof e.content == "string")
    n = e.content;
  else
    return;
  return Ue(
    {
      kind: fa,
      tags: [["e", e.channel_create_event_id], ...e.tags ?? []],
      content: n,
      created_at: e.created_at
    },
    t
  );
}, qh = (e, t) => {
  const n = [["e", e.channel_create_event_id, e.relay_url, "root"]];
  return e.reply_to_channel_message_event_id && n.push(["e", e.reply_to_channel_message_event_id, e.relay_url, "reply"]), Ue(
    {
      kind: da,
      tags: [...n, ...e.tags ?? []],
      content: e.content,
      created_at: e.created_at
    },
    t
  );
}, Vh = (e, t) => {
  let n;
  if (typeof e.content == "object")
    n = JSON.stringify(e.content);
  else if (typeof e.content == "string")
    n = e.content;
  else
    return;
  return Ue(
    {
      kind: ha,
      tags: [["e", e.channel_message_event_id], ...e.tags ?? []],
      content: n,
      created_at: e.created_at
    },
    t
  );
}, Fh = (e, t) => {
  let n;
  if (typeof e.content == "object")
    n = JSON.stringify(e.content);
  else if (typeof e.content == "string")
    n = e.content;
  else
    return;
  return Ue(
    {
      kind: pa,
      tags: [["p", e.pubkey_to_mute], ...e.tags ?? []],
      content: n,
      created_at: e.created_at
    },
    t
  );
}, Kh = {};
H(Kh, {
  EMOJI_SHORTCODE_REGEX: () => za,
  matchAll: () => Zh,
  regex: () => $i,
  replaceAll: () => Wh
});
var za = /:(\w+):/, $i = () => new RegExp(`\\B${za.source}\\B`, "g");
function* Zh(e) {
  const t = e.matchAll($i());
  for (const n of t)
    try {
      const [r, i] = n;
      yield {
        shortcode: r,
        name: i,
        start: n.index,
        end: n.index + r.length
      };
    } catch {
    }
}
function Wh(e, t) {
  return e.replaceAll($i(), (n, r) => t({
    shortcode: n,
    name: r
  }));
}
var Gh = {};
H(Gh, {
  useFetchImplementation: () => Yh,
  validateGithub: () => Xh
});
var Ci;
try {
  Ci = fetch;
} catch {
}
function Yh(e) {
  Ci = e;
}
async function Xh(e, t, n) {
  try {
    return await (await Ci(`https://gist.github.com/${t}/${n}/raw`)).text() === `Verifying that I control the following Nostr public key: ${e}`;
  } catch {
    return !1;
  }
}
var Jh = {};
H(Jh, {
  makeNwcRequestEvent: () => ep,
  parseConnectionString: () => Qh
});
function Qh(e) {
  const { host: t, pathname: n, searchParams: r } = new URL(e), i = n || t, o = r.get("relay"), s = r.get("secret");
  if (!i || !o || !s)
    throw new Error("invalid connection string");
  return { pubkey: i, relay: o, secret: s };
}
async function ep(e, t, n) {
  const i = _a(t, e, JSON.stringify({
    method: "pay_invoice",
    params: {
      invoice: n
    }
  })), o = {
    kind: ba,
    created_at: Math.round(Date.now() / 1e3),
    content: i,
    tags: [["p", e]]
  };
  return Ue(o, t);
}
var tp = {};
H(tp, {
  normalizeIdentifier: () => np
});
function np(e) {
  return e = e.trim().toLowerCase(), e = e.normalize("NFKC"), Array.from(e).map((t) => new RegExp("\\p{Letter}", "u").test(t) || new RegExp("\\p{Number}", "u").test(t) ? t : "-").join("");
}
var rp = {};
H(rp, {
  getSatoshisAmountFromBolt11: () => lp,
  getZapEndpoint: () => op,
  makeZapReceipt: () => cp,
  makeZapRequest: () => sp,
  useFetchImplementation: () => ip,
  validateZapRequest: () => ap
});
var Li;
try {
  Li = fetch;
} catch {
}
function ip(e) {
  Li = e;
}
async function op(e) {
  try {
    let t = "", { lud06: n, lud16: r } = JSON.parse(e.content);
    if (r) {
      let [s, c] = r.split("@");
      t = new URL(`/.well-known/lnurlp/${s}`, `https://${c}`).toString();
    } else if (n) {
      let { words: s } = qt.decode(n, 1e3), c = qt.fromWords(s);
      t = Fe.decode(c);
    } else
      return null;
    let o = await (await Li(t)).json();
    if (o.allowsNostr && o.nostrPubkey)
      return o.callback;
  } catch {
  }
  return null;
}
function sp(e) {
  let t = {
    kind: 9734,
    created_at: Math.round(Date.now() / 1e3),
    content: e.comment || "",
    tags: [
      ["p", "pubkey" in e ? e.pubkey : e.event.pubkey],
      ["amount", e.amount.toString()],
      ["relays", ...e.relays]
    ]
  };
  if ("event" in e) {
    if (t.tags.push(["e", e.event.id]), hi(e.event.kind)) {
      const n = ["a", `${e.event.kind}:${e.event.pubkey}:`];
      t.tags.push(n);
    } else if (pi(e.event.kind)) {
      let n = e.event.tags.find(([i, o]) => i === "d" && o);
      if (!n)
        throw new Error("d tag not found or is empty");
      const r = ["a", `${e.event.kind}:${e.event.pubkey}:${n[1]}`];
      t.tags.push(r);
    }
    t.tags.push(["k", e.event.kind.toString()]);
  }
  return t;
}
function ap(e) {
  let t;
  try {
    t = JSON.parse(e);
  } catch {
    return "Invalid zap request JSON.";
  }
  if (!Qn(t))
    return "Zap request is not a valid Nostr event.";
  if (!tr(t))
    return "Invalid signature on zap request.";
  let n = t.tags.find(([o, s]) => o === "p" && s);
  if (!n)
    return "Zap request doesn't have a 'p' tag.";
  if (!n[1].match(/^[a-f0-9]{64}$/))
    return "Zap request 'p' tag is not valid hex.";
  let r = t.tags.find(([o, s]) => o === "e" && s);
  return r && !r[1].match(/^[a-f0-9]{64}$/) ? "Zap request 'e' tag is not valid hex." : t.tags.find(([o, s]) => o === "relays" && s) ? null : "Zap request doesn't have a 'relays' tag.";
}
function cp({
  zapRequest: e,
  preimage: t,
  bolt11: n,
  paidAt: r
}) {
  let i = JSON.parse(e), o = i.tags.filter(([c]) => c === "e" || c === "p" || c === "a"), s = {
    kind: 9735,
    created_at: Math.round(r.getTime() / 1e3),
    content: "",
    tags: [...o, ["P", i.pubkey], ["bolt11", n], ["description", e]]
  };
  return t && s.tags.push(["preimage", t]), s;
}
function lp(e) {
  if (e.length < 50)
    return 0;
  e = e.substring(0, 50);
  const t = e.lastIndexOf("1");
  if (t === -1)
    return 0;
  const n = e.substring(0, t);
  if (!n.startsWith("lnbc"))
    return 0;
  const r = n.substring(4);
  if (r.length < 1)
    return 0;
  const i = r[r.length - 1], o = i.charCodeAt(0) - 48, s = o >= 0 && o <= 9;
  let c = r.length - 1;
  if (s && c++, c < 1)
    return 0;
  const a = parseInt(r.substring(0, c));
  switch (i) {
    case "m":
      return a * 1e5;
    case "u":
      return a * 100;
    case "n":
      return a / 10;
    case "p":
      return a / 1e4;
    default:
      return a * 1e8;
  }
}
var up = {};
H(up, {
  Negentropy: () => Ha,
  NegentropyStorageVector: () => hp,
  NegentropySync: () => pp
});
var mr = 97, Nt = 32, Da = 16, dt = {
  Skip: 0,
  Fingerprint: 1,
  IdList: 2
}, je = class {
  _raw;
  length;
  constructor(e) {
    typeof e == "number" ? (this._raw = new Uint8Array(e), this.length = 0) : e instanceof Uint8Array ? (this._raw = new Uint8Array(e), this.length = e.length) : (this._raw = new Uint8Array(512), this.length = 0);
  }
  unwrap() {
    return this._raw.subarray(0, this.length);
  }
  get capacity() {
    return this._raw.byteLength;
  }
  extend(e) {
    if (e instanceof je && (e = e.unwrap()), typeof e.length != "number")
      throw Error("bad length");
    const t = e.length + this.length;
    if (this.capacity < t) {
      const n = this._raw, r = Math.max(this.capacity * 2, t);
      this._raw = new Uint8Array(r), this._raw.set(n);
    }
    this._raw.set(e, this.length), this.length += e.length;
  }
  shift() {
    const e = this._raw[0];
    return this._raw = this._raw.subarray(1), this.length--, e;
  }
  shiftN(e = 1) {
    const t = this._raw.subarray(0, e);
    return this._raw = this._raw.subarray(e), this.length -= e, t;
  }
};
function _n(e) {
  let t = 0;
  for (; ; ) {
    if (e.length === 0)
      throw Error("parse ends prematurely");
    let n = e.shift();
    if (t = t << 7 | n & 127, (n & 128) === 0)
      break;
  }
  return t;
}
function De(e) {
  if (e === 0)
    return new je(new Uint8Array([0]));
  let t = [];
  for (; e !== 0; )
    t.push(e & 127), e >>>= 7;
  t.reverse();
  for (let n = 0; n < t.length - 1; n++)
    t[n] |= 128;
  return new je(new Uint8Array(t));
}
function fp(e) {
  return Rn(e, 1)[0];
}
function Rn(e, t) {
  if (e.length < t)
    throw Error("parse ends prematurely");
  return e.shiftN(t);
}
var dp = class {
  buf;
  constructor() {
    this.setToZero();
  }
  setToZero() {
    this.buf = new Uint8Array(Nt);
  }
  add(e) {
    let t = 0, n = 0, r = new DataView(this.buf.buffer), i = new DataView(e.buffer);
    for (let o = 0; o < 8; o++) {
      let s = o * 4, c = r.getUint32(s, !0), a = i.getUint32(s, !0), u = c;
      u += t, u += a, u > 4294967295 && (n = 1), r.setUint32(s, u & 4294967295, !0), t = n, n = 0;
    }
  }
  negate() {
    let e = new DataView(this.buf.buffer);
    for (let n = 0; n < 8; n++) {
      let r = n * 4;
      e.setUint32(r, ~e.getUint32(r, !0));
    }
    let t = new Uint8Array(Nt);
    t[0] = 1, this.add(t);
  }
  getFingerprint(e) {
    let t = new je();
    return t.extend(this.buf), t.extend(De(e)), Me(t.unwrap()).subarray(0, Da);
  }
}, hp = class {
  items;
  sealed;
  constructor() {
    this.items = [], this.sealed = !1;
  }
  insert(e, t) {
    if (this.sealed)
      throw Error("already sealed");
    const n = G(t);
    if (n.byteLength !== Nt)
      throw Error("bad id size for added item");
    this.items.push({ timestamp: e, id: n });
  }
  seal() {
    if (this.sealed)
      throw Error("already sealed");
    this.sealed = !0, this.items.sort(vr);
    for (let e = 1; e < this.items.length; e++)
      if (vr(this.items[e - 1], this.items[e]) === 0)
        throw Error("duplicate item inserted");
  }
  unseal() {
    this.sealed = !1;
  }
  size() {
    return this._checkSealed(), this.items.length;
  }
  getItem(e) {
    if (this._checkSealed(), e >= this.items.length)
      throw Error("out of range");
    return this.items[e];
  }
  iterate(e, t, n) {
    this._checkSealed(), this._checkBounds(e, t);
    for (let r = e; r < t && n(this.items[r], r); ++r)
      ;
  }
  findLowerBound(e, t, n) {
    return this._checkSealed(), this._checkBounds(e, t), this._binarySearch(this.items, e, t, (r) => vr(r, n) < 0);
  }
  fingerprint(e, t) {
    let n = new dp();
    return n.setToZero(), this.iterate(e, t, (r) => (n.add(r.id), !0)), n.getFingerprint(t - e);
  }
  _checkSealed() {
    if (!this.sealed)
      throw Error("not sealed");
  }
  _checkBounds(e, t) {
    if (e > t || t > this.items.length)
      throw Error("bad range");
  }
  _binarySearch(e, t, n, r) {
    let i = n - t;
    for (; i > 0; ) {
      let o = t, s = Math.floor(i / 2);
      o += s, r(e[o]) ? (t = ++o, i -= s + 1) : i = s;
    }
    return t;
  }
}, Ha = class {
  storage;
  frameSizeLimit;
  lastTimestampIn;
  lastTimestampOut;
  constructor(e, t = 6e4) {
    if (t < 4096)
      throw Error("frameSizeLimit too small");
    this.storage = e, this.frameSizeLimit = t, this.lastTimestampIn = 0, this.lastTimestampOut = 0;
  }
  _bound(e, t) {
    return { timestamp: e, id: t || new Uint8Array(0) };
  }
  initiate() {
    let e = new je();
    return e.extend(new Uint8Array([mr])), this.splitRange(0, this.storage.size(), this._bound(Number.MAX_VALUE), e), q(e.unwrap());
  }
  reconcile(e, t, n) {
    const r = new je(G(e));
    this.lastTimestampIn = this.lastTimestampOut = 0;
    let i = new je();
    i.extend(new Uint8Array([mr]));
    let o = fp(r);
    if (o < 96 || o > 111)
      throw Error("invalid negentropy protocol version byte");
    if (o !== mr)
      throw Error("unsupported negentropy protocol version requested: " + (o - 96));
    let s = this.storage.size(), c = this._bound(0), a = 0, u = !1;
    for (; r.length !== 0; ) {
      let f = new je(), h = () => {
        u && (u = !1, f.extend(this.encodeBound(c)), f.extend(De(dt.Skip)));
      }, b = this.decodeBound(r), p = _n(r), l = a, d = this.storage.findLowerBound(a, s, b);
      if (p === dt.Skip)
        u = !0;
      else if (p === dt.Fingerprint) {
        let w = Rn(r, Da), g = this.storage.fingerprint(l, d);
        ja(w, g) !== 0 ? (h(), this.splitRange(l, d, b, f)) : u = !0;
      } else if (p === dt.IdList) {
        let w = _n(r), g = {};
        for (let y = 0; y < w; y++) {
          let m = Rn(r, Nt);
          g[q(m)] = m;
        }
        if (u = !0, this.storage.iterate(l, d, (y) => {
          let m = y.id;
          const C = q(m);
          return g[C] ? delete g[q(m)] : t?.(C), !0;
        }), n)
          for (let y of Object.values(g))
            n(q(y));
      } else
        throw Error("unexpected mode");
      if (this.exceededFrameSizeLimit(i.length + f.length)) {
        let w = this.storage.fingerprint(d, s);
        i.extend(this.encodeBound(this._bound(Number.MAX_VALUE))), i.extend(De(dt.Fingerprint)), i.extend(w);
        break;
      } else
        i.extend(f);
      a = d, c = b;
    }
    return i.length === 1 ? null : q(i.unwrap());
  }
  splitRange(e, t, n, r) {
    let i = t - e, o = 16;
    if (i < o * 2)
      r.extend(this.encodeBound(n)), r.extend(De(dt.IdList)), r.extend(De(i)), this.storage.iterate(e, t, (s) => (r.extend(s.id), !0));
    else {
      let s = Math.floor(i / o), c = i % o, a = e;
      for (let u = 0; u < o; u++) {
        let f = s + (u < c ? 1 : 0), h = this.storage.fingerprint(a, a + f);
        a += f;
        let b;
        if (a === t)
          b = n;
        else {
          let p, l;
          this.storage.iterate(a - 1, a + 1, (d, w) => (w === a - 1 ? p = d : l = d, !0)), b = this.getMinimalBound(p, l);
        }
        r.extend(this.encodeBound(b)), r.extend(De(dt.Fingerprint)), r.extend(h);
      }
    }
  }
  exceededFrameSizeLimit(e) {
    return e > this.frameSizeLimit - 200;
  }
  decodeTimestampIn(e) {
    let t = _n(e);
    return t = t === 0 ? Number.MAX_VALUE : t - 1, this.lastTimestampIn === Number.MAX_VALUE || t === Number.MAX_VALUE ? (this.lastTimestampIn = Number.MAX_VALUE, Number.MAX_VALUE) : (t += this.lastTimestampIn, this.lastTimestampIn = t, t);
  }
  decodeBound(e) {
    let t = this.decodeTimestampIn(e), n = _n(e);
    if (n > Nt)
      throw Error("bound key too long");
    let r = Rn(e, n);
    return { timestamp: t, id: r };
  }
  encodeTimestampOut(e) {
    if (e === Number.MAX_VALUE)
      return this.lastTimestampOut = Number.MAX_VALUE, De(0);
    let t = e;
    return e -= this.lastTimestampOut, this.lastTimestampOut = t, De(e + 1);
  }
  encodeBound(e) {
    let t = new je();
    return t.extend(this.encodeTimestampOut(e.timestamp)), t.extend(De(e.id.length)), t.extend(e.id), t;
  }
  getMinimalBound(e, t) {
    if (t.timestamp !== e.timestamp)
      return this._bound(t.timestamp);
    {
      let n = 0, r = t.id, i = e.id;
      for (let o = 0; o < Nt && r[o] === i[o]; o++)
        n++;
      return this._bound(t.timestamp, t.id.subarray(0, n + 1));
    }
  }
};
function ja(e, t) {
  for (let n = 0; n < e.byteLength; n++) {
    if (e[n] < t[n])
      return -1;
    if (e[n] > t[n])
      return 1;
  }
  return e.byteLength > t.byteLength ? 1 : e.byteLength < t.byteLength ? -1 : 0;
}
function vr(e, t) {
  return e.timestamp === t.timestamp ? ja(e.id, t.id) : e.timestamp - t.timestamp;
}
var pp = class {
  relay;
  storage;
  neg;
  filter;
  subscription;
  onhave;
  onneed;
  constructor(e, t, n, r = {}) {
    this.relay = e, this.storage = t, this.neg = new Ha(t), this.onhave = r.onhave, this.onneed = r.onneed, this.filter = n, this.subscription = this.relay.prepareSubscription([{}], { label: r.label || "negentropy" }), this.subscription.oncustom = (i) => {
      switch (i[0]) {
        case "NEG-MSG": {
          i.length < 3 && console.warn(`got invalid NEG-MSG from ${this.relay.url}: ${i}`);
          try {
            const o = this.neg.reconcile(i[2], this.onhave, this.onneed);
            o ? this.relay.send(`["NEG-MSG", "${this.subscription.id}", "${o}"]`) : (this.close(), r.onclose?.());
          } catch (o) {
            console.error("negentropy reconcile error:", o), r?.onclose?.(`reconcile error: ${o}`);
          }
          break;
        }
        case "NEG-CLOSE": {
          const o = i[2];
          console.warn("negentropy error:", o), r.onclose?.(o);
          break;
        }
        case "NEG-ERR":
          r.onclose?.();
      }
    };
  }
  async start() {
    const e = this.neg.initiate();
    this.relay.send(`["NEG-OPEN","${this.subscription.id}",${JSON.stringify(this.filter)},"${e}"]`);
  }
  close() {
    this.relay.send(`["NEG-CLOSE","${this.subscription.id}"]`), this.subscription.close();
  }
}, gp = {};
H(gp, {
  getToken: () => wp,
  hashPayload: () => Oi,
  unpackEventFromToken: () => Va,
  validateEvent: () => Ya,
  validateEventKind: () => Ka,
  validateEventMethodTag: () => Wa,
  validateEventPayloadTag: () => Ga,
  validateEventTimestamp: () => Fa,
  validateEventUrlTag: () => Za,
  validateToken: () => bp
});
var qa = "Nostr ";
async function wp(e, t, n, r = !1, i) {
  const o = {
    kind: yi,
    tags: [
      ["u", e],
      ["method", t]
    ],
    created_at: Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3),
    content: ""
  };
  i && o.tags.push(["payload", Oi(i)]);
  const s = await n(o);
  return (r ? qa : "") + lt.encode(_e.encode(JSON.stringify(s)));
}
async function bp(e, t, n) {
  const r = await Va(e).catch((o) => {
    throw o;
  });
  return await Ya(r, t, n).catch((o) => {
    throw o;
  });
}
async function Va(e) {
  if (!e)
    throw new Error("Missing token");
  e = e.replace(qa, "");
  const t = Fe.decode(lt.decode(e));
  if (!t || t.length === 0 || !t.startsWith("{"))
    throw new Error("Invalid token");
  return JSON.parse(t);
}
function Fa(e) {
  return e.created_at ? Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3) - e.created_at < 60 : !1;
}
function Ka(e) {
  return e.kind === yi;
}
function Za(e, t) {
  const n = e.tags.find((r) => r[0] === "u");
  return n ? n.length > 0 && n[1] === t : !1;
}
function Wa(e, t) {
  const n = e.tags.find((r) => r[0] === "method");
  return n ? n.length > 0 && n[1].toLowerCase() === t.toLowerCase() : !1;
}
function Oi(e) {
  const t = Me(_e.encode(JSON.stringify(e)));
  return q(t);
}
function Ga(e, t) {
  const n = e.tags.find((i) => i[0] === "payload");
  if (!n)
    return !1;
  const r = Oi(t);
  return n.length > 0 && n[1] === r;
}
async function Ya(e, t, n, r) {
  if (!tr(e))
    throw new Error("Invalid nostr event, signature invalid");
  if (!Ka(e))
    throw new Error("Invalid nostr event, kind invalid");
  if (!Fa(e))
    throw new Error("Invalid nostr event, created_at timestamp invalid");
  if (!Za(e, t))
    throw new Error("Invalid nostr event, url tag invalid");
  if (!Wa(e, n))
    throw new Error("Invalid nostr event, method tag invalid");
  if (r && typeof r == "object" && Object.keys(r).length > 0 && !Ga(e, r))
    throw new Error("Invalid nostr event, payload tag does not match request body hash");
  return !0;
}
const yp = [
  "wss://relay.nostr.band/",
  "wss://nrelay.c-stellar.net/",
  "wss://nrelay-jp.c-stellar.net/"
], go = /* @__PURE__ */ new Set(["ws:", "wss:"]), mp = new Set(yp);
class Fn {
  static EXTERNAL_INPUT_RELAY_LIMIT = 3;
  /**
   * リレーURLに末尾スラッシュを追加
   */
  static normalizeRelayUrl(t) {
    return t.endsWith("/") ? t : t + "/";
  }
  static normalizeExternalRelayUrl(t) {
    const n = this.normalizeExternalRelayUrlCandidate(t);
    return n && !this.isDecommissionedRelayUrl(t) ? n : null;
  }
  static filterDecommissionedRelayConfig(t) {
    return Array.isArray(t) ? t.filter((n) => !this.isDecommissionedRelayUrl(n)) : Object.fromEntries(
      Object.entries(t).filter(([n]) => !this.isDecommissionedRelayUrl(n))
    );
  }
  static hasRelayEntries(t) {
    return Array.isArray(t) ? t.length > 0 : Object.keys(t).length > 0;
  }
  static isDecommissionedRelayUrl(t) {
    const n = this.normalizeExternalRelayUrlCandidate(t);
    return n !== null && mp.has(n);
  }
  static normalizeExternalRelayUrlCandidate(t) {
    if (typeof t != "string")
      return null;
    const n = t.trim();
    if (!n)
      return null;
    try {
      if (n.includes("://")) {
        const o = new URL(n);
        if (!go.has(o.protocol) || o.username || o.password)
          return null;
      }
      const r = ia.normalizeURL(n), i = new URL(r);
      return !go.has(i.protocol) || !i.hostname || i.username || i.password ? null : r;
    } catch {
      return null;
    }
  }
  static sanitizeExternalRelayUrls(t, n = {}) {
    if (!t?.length)
      return [];
    const r = [], i = /* @__PURE__ */ new Set();
    for (const o of t) {
      const s = this.normalizeExternalRelayUrl(o);
      if (!(!s || i.has(s)) && (i.add(s), r.push(s), typeof n.limit == "number" && r.length >= n.limit))
        break;
    }
    return r;
  }
  /**
   * 複数のリレー設定をマージして正規化されたURL配列を返す
   */
  static mergeRelayConfigs(...t) {
    const n = /* @__PURE__ */ new Set();
    return t.forEach((r) => {
      const i = this.filterDecommissionedRelayConfig(r);
      Array.isArray(i) ? i.forEach((o) => n.add(this.normalizeRelayUrl(o))) : typeof i == "object" && Object.keys(i).forEach((o) => {
        n.add(this.normalizeRelayUrl(o));
      });
    }), Array.from(n);
  }
  /**
   * リレー設定からreadリレーのみを抽出
   */
  static extractReadRelays(t) {
    const n = this.filterDecommissionedRelayConfig(t);
    return Array.isArray(n) ? n.map((r) => this.normalizeRelayUrl(r)) : typeof n == "object" ? Object.keys(n).filter((r) => n[r]?.read !== !1).map((r) => this.normalizeRelayUrl(r)) : [];
  }
  /**
   * リレー設定からwriteリレーのみを抽出
   */
  static extractWriteRelays(t) {
    const n = this.filterDecommissionedRelayConfig(t);
    return Array.isArray(n) ? n.map((r) => this.normalizeRelayUrl(r)) : typeof n == "object" ? Object.keys(n).filter((r) => n[r]?.write !== !1).map((r) => this.normalizeRelayUrl(r)) : [];
  }
  /**
   * リレー設定から全リレーを抽出
   */
  static extractAllRelays(t) {
    const n = this.filterDecommissionedRelayConfig(t);
    return Array.isArray(n) ? n.map((r) => this.normalizeRelayUrl(r)) : typeof n == "object" ? Object.keys(n).map((r) => this.normalizeRelayUrl(r)) : [];
  }
}
function vp(e) {
  if (typeof e != "string" || !e.trim().includes("://"))
    return !1;
  try {
    const t = new URL(e.trim());
    return (t.protocol === "ws:" || t.protocol === "wss:") && !t.username && !t.password && Fn.normalizeExternalRelayUrl(e) !== null;
  } catch {
    return !1;
  }
}
function _p(e, t = {}) {
  try {
    const n = ma.decode(e);
    if (n.type === "nevent") {
      const r = n.data, i = Array.isArray(r.relays) ? r.relays : [];
      return t.relayValidation === "strict" && i.some((o) => !vp(o)) ? null : {
        eventId: r.id,
        relayHints: Fn.sanitizeExternalRelayUrls(
          i.filter((o) => typeof o == "string"),
          { limit: Fn.EXTERNAL_INPUT_RELAY_LIMIT }
        ),
        authorPubkey: r.author ?? null
      };
    }
    return n.type === "note" ? {
      eventId: n.data,
      relayHints: [],
      authorPubkey: null
    } : null;
  } catch {
    return null;
  }
}
function Ep(e) {
  return e.map((t) => [...t]);
}
function wo(e) {
  return {
    id: e.id,
    pubkey: e.pubkey,
    created_at: e.created_at,
    kind: e.kind,
    tags: Ep(e.tags),
    content: e.content,
    sig: e.sig
  };
}
function xp(e) {
  if (!e || typeof e != "object")
    return !1;
  const t = e;
  return typeof t.id == "string" && typeof t.pubkey == "string" && typeof t.kind == "number" && typeof t.content == "string" && typeof t.created_at == "number" && typeof t.sig == "string" && Array.isArray(t.tags) && t.tags.every(
    (n) => Array.isArray(n) && n.every((r) => typeof r == "string")
  );
}
var $n = { exports: {} }, kp = $n.exports, bo;
function Ap() {
  return bo || (bo = 1, (function(e) {
    (function(t) {
      const n = "(0?\\d+|0x[a-f0-9]+)", r = {
        fourOctet: new RegExp(`^${n}\\.${n}\\.${n}\\.${n}$`, "i"),
        threeOctet: new RegExp(`^${n}\\.${n}\\.${n}$`, "i"),
        twoOctet: new RegExp(`^${n}\\.${n}$`, "i"),
        longValue: new RegExp(`^${n}$`, "i")
      }, i = new RegExp("^0[0-7]+$", "i"), o = new RegExp("^0x[a-f0-9]+$", "i"), s = "%[0-9a-z]{1,}", c = "(?:[0-9a-f]+::?)+", a = {
        zoneIndex: new RegExp(s, "i"),
        native: new RegExp(`^(::)?(${c})?([0-9a-f]+)?(::)?(${s})?$`, "i"),
        deprecatedTransitional: new RegExp(`^(?:::)(${n}\\.${n}\\.${n}\\.${n}(${s})?)$`, "i"),
        transitional: new RegExp(`^((?:${c})|(?:::)(?:${c})?)${n}\\.${n}\\.${n}\\.${n}(${s})?$`, "i")
      };
      function u(l, d) {
        if (l.indexOf("::") !== l.lastIndexOf("::"))
          return null;
        let w = 0, g = -1, y = (l.match(a.zoneIndex) || [])[0], m, C;
        for (y && (y = y.substring(1), l = l.replace(/%.+$/, "")); (g = l.indexOf(":", g + 1)) >= 0; )
          w++;
        if (l.substr(0, 2) === "::" && w--, l.substr(-2, 2) === "::" && w--, w > d)
          return null;
        for (C = d - w, m = ":"; C--; )
          m += "0:";
        return l = l.replace("::", m), l[0] === ":" && (l = l.slice(1)), l[l.length - 1] === ":" && (l = l.slice(0, -1)), d = (function() {
          const ae = l.split(":"), z = [];
          for (let V = 0; V < ae.length; V++)
            z.push(parseInt(ae[V], 16));
          return z;
        })(), {
          parts: d,
          zoneId: y
        };
      }
      function f(l, d, w, g) {
        if (l.length !== d.length)
          throw new Error("ipaddr: cannot match CIDR for objects with different lengths");
        let y = 0, m;
        for (; g > 0; ) {
          if (m = w - g, m < 0 && (m = 0), l[y] >> m !== d[y] >> m)
            return !1;
          g -= w, y += 1;
        }
        return !0;
      }
      function h(l) {
        if (o.test(l))
          return parseInt(l, 16);
        if (l[0] === "0" && !isNaN(parseInt(l[1], 10))) {
          if (i.test(l))
            return parseInt(l, 8);
          throw new Error(`ipaddr: cannot parse ${l} as octal`);
        }
        return parseInt(l, 10);
      }
      function b(l, d) {
        for (; l.length < d; )
          l = `0${l}`;
        return l;
      }
      const p = {};
      p.IPv4 = (function() {
        function l(d) {
          if (d.length !== 4)
            throw new Error("ipaddr: ipv4 octet count should be 4");
          let w, g;
          for (w = 0; w < d.length; w++)
            if (g = d[w], !(0 <= g && g <= 255))
              throw new Error("ipaddr: ipv4 octet should fit in 8 bits");
          this.octets = d;
        }
        return l.prototype.SpecialRanges = {
          unspecified: [[new l([0, 0, 0, 0]), 8]],
          broadcast: [[new l([255, 255, 255, 255]), 32]],
          // RFC3171
          multicast: [[new l([224, 0, 0, 0]), 4]],
          // RFC3927
          linkLocal: [[new l([169, 254, 0, 0]), 16]],
          // RFC5735
          loopback: [[new l([127, 0, 0, 0]), 8]],
          // RFC6598
          carrierGradeNat: [[new l([100, 64, 0, 0]), 10]],
          // RFC1918
          private: [
            [new l([10, 0, 0, 0]), 8],
            [new l([172, 16, 0, 0]), 12],
            [new l([192, 168, 0, 0]), 16]
          ],
          // Reserved and testing-only ranges; RFCs 5735, 5737, 2544, 1700
          reserved: [
            [new l([192, 0, 0, 0]), 24],
            [new l([192, 0, 2, 0]), 24],
            [new l([192, 88, 99, 0]), 24],
            [new l([198, 18, 0, 0]), 15],
            [new l([198, 51, 100, 0]), 24],
            [new l([203, 0, 113, 0]), 24],
            [new l([240, 0, 0, 0]), 4]
          ],
          // RFC7534, RFC7535
          as112: [
            [new l([192, 175, 48, 0]), 24],
            [new l([192, 31, 196, 0]), 24]
          ],
          // RFC7450
          amt: [
            [new l([192, 52, 193, 0]), 24]
          ]
        }, l.prototype.kind = function() {
          return "ipv4";
        }, l.prototype.match = function(d, w) {
          let g;
          if (w === void 0 && (g = d, d = g[0], w = g[1]), d.kind() !== "ipv4")
            throw new Error("ipaddr: cannot match ipv4 address with non-ipv4 one");
          return f(this.octets, d.octets, 8, w);
        }, l.prototype.prefixLengthFromSubnetMask = function() {
          let d = 0, w = !1;
          const g = {
            0: 8,
            128: 7,
            192: 6,
            224: 5,
            240: 4,
            248: 3,
            252: 2,
            254: 1,
            255: 0
          };
          let y, m, C;
          for (y = 3; y >= 0; y -= 1)
            if (m = this.octets[y], m in g) {
              if (C = g[m], w && C !== 0)
                return null;
              C !== 8 && (w = !0), d += C;
            } else
              return null;
          return 32 - d;
        }, l.prototype.range = function() {
          return p.subnetMatch(this, this.SpecialRanges);
        }, l.prototype.toByteArray = function() {
          return this.octets.slice(0);
        }, l.prototype.toIPv4MappedAddress = function() {
          return p.IPv6.parse(`::ffff:${this.toString()}`);
        }, l.prototype.toNormalizedString = function() {
          return this.toString();
        }, l.prototype.toString = function() {
          return this.octets.join(".");
        }, l;
      })(), p.IPv4.broadcastAddressFromCIDR = function(l) {
        try {
          const d = this.parseCIDR(l), w = d[0].toByteArray(), g = this.subnetMaskFromPrefixLength(d[1]).toByteArray(), y = [];
          let m = 0;
          for (; m < 4; )
            y.push(parseInt(w[m], 10) | parseInt(g[m], 10) ^ 255), m++;
          return new this(y);
        } catch {
          throw new Error("ipaddr: the address does not have IPv4 CIDR format");
        }
      }, p.IPv4.isIPv4 = function(l) {
        return this.parser(l) !== null;
      }, p.IPv4.isValid = function(l) {
        try {
          return new this(this.parser(l)), !0;
        } catch {
          return !1;
        }
      }, p.IPv4.isValidCIDR = function(l) {
        try {
          return this.parseCIDR(l), !0;
        } catch {
          return !1;
        }
      }, p.IPv4.isValidFourPartDecimal = function(l) {
        return !!(p.IPv4.isValid(l) && l.match(/^(0|[1-9]\d*)(\.(0|[1-9]\d*)){3}$/));
      }, p.IPv4.isValidCIDRFourPartDecimal = function(l) {
        const d = l.match(/^(.+)\/(\d+)$/);
        return !p.IPv4.isValidCIDR(l) || !d ? !1 : p.IPv4.isValidFourPartDecimal(d[1]);
      }, p.IPv4.networkAddressFromCIDR = function(l) {
        let d, w, g, y, m;
        try {
          for (d = this.parseCIDR(l), g = d[0].toByteArray(), m = this.subnetMaskFromPrefixLength(d[1]).toByteArray(), y = [], w = 0; w < 4; )
            y.push(parseInt(g[w], 10) & parseInt(m[w], 10)), w++;
          return new this(y);
        } catch {
          throw new Error("ipaddr: the address does not have IPv4 CIDR format");
        }
      }, p.IPv4.parse = function(l) {
        const d = this.parser(l);
        if (d === null)
          throw new Error("ipaddr: string is not formatted like an IPv4 Address");
        return new this(d);
      }, p.IPv4.parseCIDR = function(l) {
        let d;
        if (d = l.match(/^(.+)\/(\d+)$/)) {
          const w = parseInt(d[2]);
          if (w >= 0 && w <= 32) {
            const g = [this.parse(d[1]), w];
            return Object.defineProperty(g, "toString", {
              value: function() {
                return this.join("/");
              }
            }), g;
          }
        }
        throw new Error("ipaddr: string is not formatted like an IPv4 CIDR range");
      }, p.IPv4.parser = function(l) {
        let d, w, g;
        if (d = l.match(r.fourOctet))
          return (function() {
            const y = d.slice(1, 6), m = [];
            for (let C = 0; C < y.length; C++)
              w = y[C], m.push(h(w));
            return m;
          })();
        if (d = l.match(r.longValue)) {
          if (g = h(d[1]), g > 4294967295 || g < 0)
            throw new Error("ipaddr: address outside defined range");
          return (function() {
            const y = [];
            let m;
            for (m = 0; m <= 24; m += 8)
              y.push(g >> m & 255);
            return y;
          })().reverse();
        } else return (d = l.match(r.twoOctet)) ? (function() {
          const y = d.slice(1, 4), m = [];
          if (g = h(y[1]), g > 16777215 || g < 0)
            throw new Error("ipaddr: address outside defined range");
          return m.push(h(y[0])), m.push(g >> 16 & 255), m.push(g >> 8 & 255), m.push(g & 255), m;
        })() : (d = l.match(r.threeOctet)) ? (function() {
          const y = d.slice(1, 5), m = [];
          if (g = h(y[2]), g > 65535 || g < 0)
            throw new Error("ipaddr: address outside defined range");
          return m.push(h(y[0])), m.push(h(y[1])), m.push(g >> 8 & 255), m.push(g & 255), m;
        })() : null;
      }, p.IPv4.subnetMaskFromPrefixLength = function(l) {
        if (l = parseInt(l), l < 0 || l > 32)
          throw new Error("ipaddr: invalid IPv4 prefix length");
        const d = [0, 0, 0, 0];
        let w = 0;
        const g = Math.floor(l / 8);
        for (; w < g; )
          d[w] = 255, w++;
        return g < 4 && (d[g] = Math.pow(2, l % 8) - 1 << 8 - l % 8), new this(d);
      }, p.IPv6 = (function() {
        function l(d, w) {
          let g, y;
          if (d.length === 16)
            for (this.parts = [], g = 0; g <= 14; g += 2)
              this.parts.push(d[g] << 8 | d[g + 1]);
          else if (d.length === 8)
            this.parts = d;
          else
            throw new Error("ipaddr: ipv6 part count should be 8 or 16");
          for (g = 0; g < this.parts.length; g++)
            if (y = this.parts[g], !(0 <= y && y <= 65535))
              throw new Error("ipaddr: ipv6 part should fit in 16 bits");
          w && (this.zoneId = w);
        }
        return l.prototype.SpecialRanges = {
          // RFC4291, here and after
          unspecified: [new l([0, 0, 0, 0, 0, 0, 0, 0]), 128],
          linkLocal: [new l([65152, 0, 0, 0, 0, 0, 0, 0]), 10],
          multicast: [new l([65280, 0, 0, 0, 0, 0, 0, 0]), 8],
          loopback: [new l([0, 0, 0, 0, 0, 0, 0, 1]), 128],
          uniqueLocal: [new l([64512, 0, 0, 0, 0, 0, 0, 0]), 7],
          ipv4Mapped: [new l([0, 0, 0, 0, 0, 65535, 0, 0]), 96],
          // RFC6666
          discard: [new l([256, 0, 0, 0, 0, 0, 0, 0]), 64],
          // RFC6145
          rfc6145: [new l([0, 0, 0, 0, 65535, 0, 0, 0]), 96],
          // RFC6052
          rfc6052: [new l([100, 65435, 0, 0, 0, 0, 0, 0]), 96],
          // RFC3056
          "6to4": [new l([8194, 0, 0, 0, 0, 0, 0, 0]), 16],
          // RFC6052, RFC6146
          teredo: [new l([8193, 0, 0, 0, 0, 0, 0, 0]), 32],
          // RFC5180
          benchmarking: [new l([8193, 2, 0, 0, 0, 0, 0, 0]), 48],
          // RFC7450
          amt: [new l([8193, 3, 0, 0, 0, 0, 0, 0]), 32],
          as112v6: [
            [new l([8193, 4, 274, 0, 0, 0, 0, 0]), 48],
            [new l([9760, 79, 32768, 0, 0, 0, 0, 0]), 48]
          ],
          deprecated: [new l([8193, 16, 0, 0, 0, 0, 0, 0]), 28],
          orchid2: [new l([8193, 32, 0, 0, 0, 0, 0, 0]), 28],
          droneRemoteIdProtocolEntityTags: [new l([8193, 48, 0, 0, 0, 0, 0, 0]), 28],
          reserved: [
            // RFC3849
            [new l([8193, 0, 0, 0, 0, 0, 0, 0]), 23],
            // RFC2928
            [new l([8193, 3512, 0, 0, 0, 0, 0, 0]), 32]
          ]
        }, l.prototype.isIPv4MappedAddress = function() {
          return this.range() === "ipv4Mapped";
        }, l.prototype.kind = function() {
          return "ipv6";
        }, l.prototype.match = function(d, w) {
          let g;
          if (w === void 0 && (g = d, d = g[0], w = g[1]), d.kind() !== "ipv6")
            throw new Error("ipaddr: cannot match ipv6 address with non-ipv6 one");
          return f(this.parts, d.parts, 16, w);
        }, l.prototype.prefixLengthFromSubnetMask = function() {
          let d = 0, w = !1;
          const g = {
            0: 16,
            32768: 15,
            49152: 14,
            57344: 13,
            61440: 12,
            63488: 11,
            64512: 10,
            65024: 9,
            65280: 8,
            65408: 7,
            65472: 6,
            65504: 5,
            65520: 4,
            65528: 3,
            65532: 2,
            65534: 1,
            65535: 0
          };
          let y, m;
          for (let C = 7; C >= 0; C -= 1)
            if (y = this.parts[C], y in g) {
              if (m = g[y], w && m !== 0)
                return null;
              m !== 16 && (w = !0), d += m;
            } else
              return null;
          return 128 - d;
        }, l.prototype.range = function() {
          return p.subnetMatch(this, this.SpecialRanges);
        }, l.prototype.toByteArray = function() {
          let d;
          const w = [], g = this.parts;
          for (let y = 0; y < g.length; y++)
            d = g[y], w.push(d >> 8), w.push(d & 255);
          return w;
        }, l.prototype.toFixedLengthString = function() {
          const d = (function() {
            const g = [];
            for (let y = 0; y < this.parts.length; y++)
              g.push(b(this.parts[y].toString(16), 4));
            return g;
          }).call(this).join(":");
          let w = "";
          return this.zoneId && (w = `%${this.zoneId}`), d + w;
        }, l.prototype.toIPv4Address = function() {
          if (!this.isIPv4MappedAddress())
            throw new Error("ipaddr: trying to convert a generic ipv6 address to ipv4");
          const d = this.parts.slice(-2), w = d[0], g = d[1];
          return new p.IPv4([w >> 8, w & 255, g >> 8, g & 255]);
        }, l.prototype.toNormalizedString = function() {
          const d = (function() {
            const g = [];
            for (let y = 0; y < this.parts.length; y++)
              g.push(this.parts[y].toString(16));
            return g;
          }).call(this).join(":");
          let w = "";
          return this.zoneId && (w = `%${this.zoneId}`), d + w;
        }, l.prototype.toRFC5952String = function() {
          const d = /((^|:)(0(:|$)){2,})/g, w = this.toNormalizedString();
          let g = 0, y = -1, m;
          for (; m = d.exec(w); )
            m[0].length > y && (g = m.index, y = m[0].length);
          return y < 0 ? w : `${w.substring(0, g)}::${w.substring(g + y)}`;
        }, l.prototype.toString = function() {
          return this.toRFC5952String();
        }, l;
      })(), p.IPv6.broadcastAddressFromCIDR = function(l) {
        try {
          const d = this.parseCIDR(l), w = d[0].toByteArray(), g = this.subnetMaskFromPrefixLength(d[1]).toByteArray(), y = [];
          let m = 0;
          for (; m < 16; )
            y.push(parseInt(w[m], 10) | parseInt(g[m], 10) ^ 255), m++;
          return new this(y);
        } catch (d) {
          throw new Error(`ipaddr: the address does not have IPv6 CIDR format (${d})`);
        }
      }, p.IPv6.isIPv6 = function(l) {
        return this.parser(l) !== null;
      }, p.IPv6.isValid = function(l) {
        if (typeof l == "string" && l.indexOf(":") === -1)
          return !1;
        try {
          const d = this.parser(l);
          return new this(d.parts, d.zoneId), !0;
        } catch {
          return !1;
        }
      }, p.IPv6.isValidCIDR = function(l) {
        if (typeof l == "string" && l.indexOf(":") === -1)
          return !1;
        try {
          return this.parseCIDR(l), !0;
        } catch {
          return !1;
        }
      }, p.IPv6.networkAddressFromCIDR = function(l) {
        let d, w, g, y, m;
        try {
          for (d = this.parseCIDR(l), g = d[0].toByteArray(), m = this.subnetMaskFromPrefixLength(d[1]).toByteArray(), y = [], w = 0; w < 16; )
            y.push(parseInt(g[w], 10) & parseInt(m[w], 10)), w++;
          return new this(y);
        } catch (C) {
          throw new Error(`ipaddr: the address does not have IPv6 CIDR format (${C})`);
        }
      }, p.IPv6.parse = function(l) {
        const d = this.parser(l);
        if (d.parts === null)
          throw new Error("ipaddr: string is not formatted like an IPv6 Address");
        return new this(d.parts, d.zoneId);
      }, p.IPv6.parseCIDR = function(l) {
        let d, w, g;
        if ((w = l.match(/^(.+)\/(\d+)$/)) && (d = parseInt(w[2]), d >= 0 && d <= 128))
          return g = [this.parse(w[1]), d], Object.defineProperty(g, "toString", {
            value: function() {
              return this.join("/");
            }
          }), g;
        throw new Error("ipaddr: string is not formatted like an IPv6 CIDR range");
      }, p.IPv6.parser = function(l) {
        let d, w, g, y, m, C;
        if (g = l.match(a.deprecatedTransitional))
          return this.parser(`::ffff:${g[1]}`);
        if (a.native.test(l))
          return u(l, 8);
        if ((g = l.match(a.transitional)) && (C = g[6] || "", d = g[1], g[1].endsWith("::") || (d = d.slice(0, -1)), d = u(d + C, 6), d.parts)) {
          for (m = [
            parseInt(g[2]),
            parseInt(g[3]),
            parseInt(g[4]),
            parseInt(g[5])
          ], w = 0; w < m.length; w++)
            if (y = m[w], !(0 <= y && y <= 255))
              return null;
          return d.parts.push(m[0] << 8 | m[1]), d.parts.push(m[2] << 8 | m[3]), {
            parts: d.parts,
            zoneId: d.zoneId
          };
        }
        return null;
      }, p.IPv6.subnetMaskFromPrefixLength = function(l) {
        if (l = parseInt(l), l < 0 || l > 128)
          throw new Error("ipaddr: invalid IPv6 prefix length");
        const d = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let w = 0;
        const g = Math.floor(l / 8);
        for (; w < g; )
          d[w] = 255, w++;
        return g < 16 && (d[g] = Math.pow(2, l % 8) - 1 << 8 - l % 8), new this(d);
      }, p.fromByteArray = function(l) {
        const d = l.length;
        if (d === 4)
          return new p.IPv4(l);
        if (d === 16)
          return new p.IPv6(l);
        throw new Error("ipaddr: the binary input is neither an IPv6 nor IPv4 address");
      }, p.isValid = function(l) {
        return p.IPv6.isValid(l) || p.IPv4.isValid(l);
      }, p.isValidCIDR = function(l) {
        return p.IPv6.isValidCIDR(l) || p.IPv4.isValidCIDR(l);
      }, p.parse = function(l) {
        if (p.IPv6.isValid(l))
          return p.IPv6.parse(l);
        if (p.IPv4.isValid(l))
          return p.IPv4.parse(l);
        throw new Error("ipaddr: the address has neither IPv6 nor IPv4 format");
      }, p.parseCIDR = function(l) {
        try {
          return p.IPv6.parseCIDR(l);
        } catch {
          try {
            return p.IPv4.parseCIDR(l);
          } catch {
            throw new Error("ipaddr: the address has neither IPv6 nor IPv4 CIDR format");
          }
        }
      }, p.process = function(l) {
        const d = this.parse(l);
        return d.kind() === "ipv6" && d.isIPv4MappedAddress() ? d.toIPv4Address() : d;
      }, p.subnetMatch = function(l, d, w) {
        let g, y, m, C;
        w == null && (w = "unicast");
        for (y in d)
          if (Object.prototype.hasOwnProperty.call(d, y)) {
            for (m = d[y], m[0] && !(m[0] instanceof Array) && (m = [m]), g = 0; g < m.length; g++)
              if (C = m[g], l.kind() === C[0].kind() && l.match.apply(l, C))
                return y;
          }
        return w;
      }, e.exports ? e.exports = p : t.ipaddr = p;
    })(kp);
  })($n)), $n.exports;
}
var yo = Ap();
function Xa(e) {
  const t = e ?? globalThis.location?.origin;
  if (!t) return null;
  try {
    return new URL(t);
  } catch {
    return null;
  }
}
function Sp(e) {
  return e.replace(/^\[/, "").replace(/\]$/, "").split("%")[0];
}
function Ja(e) {
  const t = Sp(e);
  if (!t || !yo.isValid(t))
    return !1;
  try {
    return yo.parse(t).range() !== "unicast";
  } catch {
    return !0;
  }
}
function Ip(e) {
  const t = e.trim().toLowerCase();
  return !(!t || t === "localhost" || t.endsWith(".localhost") || t.endsWith(".local") || Ja(t) || !t.includes("."));
}
function Rp(e) {
  const t = e.hostname.trim().toLowerCase();
  return t ? t === "localhost" || t.endsWith(".localhost") || t.endsWith(".local") ? !0 : Ja(t) : !1;
}
function $p(e, t) {
  return !!t && e.origin === t.origin;
}
function Ti(e, t = {}) {
  if (typeof e != "string") return null;
  const n = e.trim();
  if (!n) return null;
  let r;
  try {
    r = new URL(n);
  } catch {
    return null;
  }
  if (n.startsWith("//") || r.username || r.password)
    return null;
  const i = Xa(t.currentOrigin), s = $p(r, i) && !!i && Rp(i);
  if (r.protocol === "http:") {
    if (!s)
      return null;
  } else if (r.protocol !== "https:")
    return null;
  return !s && !Ip(r.hostname) ? null : (r.hash = "", r.toString());
}
function o0(e, t = {}) {
  if (!e) return !1;
  const n = Ti(e, t);
  if (!n) return !1;
  const r = Xa(t.currentOrigin);
  if (!r) return !1;
  try {
    return new URL(n).origin === r.origin;
  } catch {
    return !1;
  }
}
function s0(e, t = {}) {
  const n = Ti(e, t);
  if (!n) return "";
  const r = new URL(n);
  return r.searchParams.has("profile") || r.searchParams.set("profile", "true"), r.toString();
}
class Cp extends Error {
  constructor() {
    super("invalid_composer_context"), this.name = "EmbedComposerContextValidationError";
  }
}
function st() {
  throw new Cp();
}
function sn(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function Lp(e) {
  return /^[0-9a-f]{64}$/.test(e);
}
function Dr(e) {
  (typeof e != "string" || _p(e, { relayValidation: "strict" }) === null) && st();
}
function mo(e, t) {
  if (!Object.prototype.hasOwnProperty.call(e, t)) return;
  const n = e[t];
  n != null && (typeof n != "string" || n.trim().length === 0) && st();
}
function Op(e) {
  if (e != null) {
    if (sn(e) || st(), Dr(e.reference), e.relays !== void 0) {
      Array.isArray(e.relays) || st();
      for (const t of e.relays)
        (typeof t != "string" || Fn.sanitizeExternalRelayUrls([t], { limit: 1 }).length !== 1) && st();
    }
    mo(e, "name"), mo(e, "about");
  }
}
function a0(e) {
  if (sn(e) || st(), e.reply !== void 0 && e.reply !== null && Dr(e.reply), e.quotes !== void 0 && e.quotes !== null) {
    Array.isArray(e.quotes) || st();
    for (const t of e.quotes) Dr(t);
  }
  return e.content !== void 0 && e.content !== null && typeof e.content != "string" && st(), Op(e.channel), e;
}
function c0(e, t) {
  if (!sn(e))
    return {};
  const n = /* @__PURE__ */ new Map();
  for (const i of t) {
    const o = n.get(i.eventId);
    o ? o.push(i) : n.set(i.eventId, [i]);
  }
  const r = {};
  for (const [i, o] of n)
    try {
      if (!Object.prototype.hasOwnProperty.call(e, i))
        continue;
      const s = e[i];
      if (!xp(s))
        continue;
      const c = wo(s);
      if (!Qn(c) || tn(c) !== c.id || !tr(c) || c.id !== i || o.some(
        (a) => a.authorPubkey !== null && c.pubkey !== a.authorPubkey
      ))
        continue;
      r[i] = wo(c);
    } catch {
      continue;
    }
  return r;
}
function Tp(e) {
  if (!sn(e)) return {};
  const t = {};
  for (const [n, r] of Object.entries(e)) {
    if (!Lp(n) || !sn(r)) continue;
    const i = typeof r.displayName == "string" && r.displayName.trim() || null, o = typeof r.picture == "string" ? Ti(r.picture) : null;
    !i && !o || (t[n] = { displayName: i, picture: o });
  }
  return t;
}
const Bp = ":root{--app-root-height: 100%;--app-root-top: 0px;--app-root-overflow-y: visible;--app-main-height: 100svh;--app-body-position: static;--app-body-inset: auto;--app-body-width: auto;--app-overlay-position: fixed;--app-overscroll-behavior: auto;--footer-height: 66px;--footer-bottom: 0px;--keyboard-height: 0px;--mobile-dialog-viewport-top: 0px;--mobile-dialog-viewport-height: 100dvh;--mobile-dialog-center-y: 43dvh;--keyboard-button-bar-height: 50px;--keyboard-button-bar-bottom: 66px;--main-content-keyboard-adjustment: var(--keyboard-height);--reason-input-base-height: 50px;--reason-input-height: 0px;--reason-input-bottom: 116px;--main-content-top-spacing: 6px;--composer-bottom-reserved-height: 116px;--accent-color-default: hsl(152, 74%, 43%);--accent-color: var( --accent-color-forced, var(--accent-color-user, var(--accent-color-external-default, var(--accent-color-default))) );--accent-color-custom: var( --accent-color-forced, var(--accent-color-user, var(--accent-color-external-default)) );--accent-color-custom-inner: color-mix(in srgb, var(--accent-color-custom) 15%, white 85%);--accent-color-custom-face: color-mix(in srgb, var(--accent-color-custom) 40%, black 60%);--base-color: var( --base-color-forced, var(--base-color-user, var(--base-color-external-default)) );--theme: var(--accent-color);--text-black: hsl(0, 0%, 24%);--nostr-bg: hsl(270, 100%, 98%);--yellow: hsl(50, 100%, 50%);--danger: hsl(0, 84%, 60%);--darker: rgba(0, 0, 0, .8);--dark-gray: hsl(0, 0%, 66%);--light-gray: hsl(0, 0%, 83%);--base-color-surface-bg-light: color-mix(in srgb, var(--base-color) 18%, hsl(0, 0%, 97%));--base-color-surface-bg-dark: color-mix(in srgb, var(--base-color) 18%, hsl(0, 0%, 12%));--base-color-surface-editor-light: color-mix(in srgb, var(--base-color) 6%, hsl(0, 0%, 100%));--base-color-surface-editor-dark: color-mix(in srgb, var(--base-color) 9%, hsl(0, 0%, 22%));--base-color-surface-footer-light: color-mix(in srgb, var(--base-color) 34%, hsl(0, 0%, 86%));--base-color-surface-footer-dark: color-mix(in srgb, var(--base-color) 22%, hsl(0, 0%, 10%));--surface-bg: light-dark( var(--base-color-surface-bg-light, color-mix(in srgb, hsl(0, 0%, 94%) 18%, hsl(0, 0%, 94%))), var(--base-color-surface-bg-dark, color-mix(in srgb, hsl(0, 0%, 12%) 18%, hsl(0, 0%, 12%))) );--surface-input: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 100%)) 14%, hsl(0, 0%, 100%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 19%)) 14%, hsl(0, 0%, 19%)) );--surface-editor: light-dark( var(--base-color-surface-editor-light, var(--surface-input)), var(--base-color-surface-editor-dark, var(--surface-input)) );--surface-footer: light-dark( var(--base-color-surface-footer-light, color-mix(in srgb, hsl(0, 0%, 82%) 22%, hsl(0, 0%, 82%))), var(--base-color-surface-footer-dark, color-mix(in srgb, hsl(0, 0%, 10%) 22%, hsl(0, 0%, 10%))) );--surface-buttonbar: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 91%)) 20%, hsl(0, 0%, 91%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 28%)) 20%, hsl(0, 0%, 28%)) );--base-color-surface-button: color-mix(in srgb, var(--base-color) 24%, white);--surface-button: light-dark( var(--base-color-surface-button, hsl(0, 0%, 92%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 25%)) 18%, hsl(0, 0%, 25%)) );--surface-button-border: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 75%)) 24%, hsl(0, 0%, 75%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 30%)) 24%, hsl(0, 0%, 30%)) );--surface-button-preview-action: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 74%)) 22%, hsl(0, 0%, 74%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 36%)) 22%, hsl(0, 0%, 36%)) );--surface-border: light-dark( color-mix(in srgb, var(--base-color, var(--light-gray)) 24%, var(--light-gray)), color-mix(in srgb, var(--base-color, dimgray) 24%, dimgray) );--surface-border-hr: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 84%)) 20%, hsl(0, 0%, 84%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 30%)) 20%, hsl(0, 0%, 30%)) );--surface-border-hr-light: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 92%)) 16%, hsl(0, 0%, 92%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 20%)) 16%, hsl(0, 0%, 20%)) );--surface-dialog: light-dark( color-mix(in srgb, var(--base-color, white) 14%, white), color-mix(in srgb, var(--base-color, hsl(0, 0%, 14%)) 14%, hsl(0, 0%, 14%)) );--surface-window: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 95%)) 14%, hsl(0, 0%, 95%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 14%)) 14%, hsl(0, 0%, 14%)) );--bg: var(--surface-bg);--bg-input: var(--surface-input);--bg-footer: var(--surface-footer);--bg-translucent: light-dark(#EDEDEDcc, #212121cc);--bg-buttonbar: var(--surface-buttonbar);--base-color-footer-buttonbar-light: var(--base-color-surface-bg-light);--footer-buttonbar-bg: light-dark( var(--base-color-footer-buttonbar-light, var(--bg-buttonbar)), var(--bg-buttonbar) );--btn-bg: var(--surface-button);--btn-bg2: light-dark(color-mix(in srgb, var(--btn-bg), black 6%), color-mix(in srgb, var(--btn-bg), white 10%));--btn-bg3: light-dark(color-mix(in srgb, var(--btn-bg), black 11%), color-mix(in srgb, var(--btn-bg), white 20%));--btn-border: var(--surface-button-border);--btn-hover-bg: light-dark(rgba(50, 50, 50, .12), rgba(255, 255, 255, .12));--btn-post-preview-action: var(--surface-button-preview-action);--border: var(--surface-border);--border-hr: var(--surface-border-hr);--border-hr-light: var(--surface-border-hr-light);--semantic-text: light-dark(hsl(0, 0%, 24%), hsl(0, 0%, 90%));--text: var(--semantic-text);--text-light: light-dark(hsl(0, 0%, 46%), hsl(0, 0%, 75%));--text-muted: light-dark(hsl(0, 0%, 60%), hsl(0, 0%, 55%));--text-red: light-dark(hsl(0, 99%, 45%), hsl(0, 99%, 69%));--text-r: light-dark(#e6e6e6, #3D3D3D);--semantic-link: light-dark(#1a0dab, #99c3ff);--link: var(--semantic-link);--link-visited: light-dark(#681da8, #c58af9);--dialog-bg: var(--surface-dialog);--dialog-bg2: light-dark(color-mix(in srgb, var(--dialog-bg), black 6%), color-mix(in srgb, var(--dialog-bg), white 10%));--dialog-bg3: light-dark(color-mix(in srgb, var(--dialog-bg), black 11%), color-mix(in srgb, var(--dialog-bg), white 16%));--dialog-bg-overlay: light-dark(rgba(0, 0, 0, .6), rgba(0, 0, 0, .8));--window: var(--surface-window);--svg: light-dark(hsl(0, 0%, 36%), hsl(0, 0%, 90%));--svg-light: var(--text-light);--shadow: light-dark(rgba(0, 0, 0, .1), rgba(255, 255, 255, .1));--hagaki: light-dark(hsl(0, 77%, 56%), hsl(5, 99%, 71%));--hashtag-text: light-dark(#106BC7, #65B1FC);--hashtag-bg: light-dark(#106BC71a, #65B1FC1a);--toggle-bg: var(--svg);--toggle-circle: var(--dialog-bg);--message-success-bg: hsl(200, 39%, 96%);--message-success-color: hsl(210, 60%, 40%);--message-success-border: hsl(210, 48%, 70%);--message-error-bg: hsl(351, 99%, 96%);--message-error-color: hsl(351, 99%, 32%);--message-error-border: hsl(351, 99%, 70%);--message-warning-bg: hsl(38, 100%, 95%);--message-warning-color: hsl(30, 90%, 35%);--message-warning-border: hsl(38, 90%, 65%);--message-flavor-bg: hsl(125, 39%, 94%);--message-flavor-color: hsl(123, 46%, 32%);--message-flavor-border: hsl(125, 39%, 70%);--message-tips-bg: hsl(270, 50%, 96%);--message-tips-color: hsl(270, 55%, 38%);--message-tips-border: hsl(270, 45%, 70%);font-family:system-ui,-apple-system,Segoe UI,Hiragino Sans,Hiragino Kaku Gothic ProN,Meiryo,sans-serif;font-weight:400;color-scheme:light dark;color:var(--text);background-color:var(--bg);font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}*{font-family:inherit;box-sizing:border-box}html,body,#app{height:var(--app-root-height);overflow-x:hidden;overflow-y:var(--app-root-overflow-y);overscroll-behavior-y:var(--app-overscroll-behavior)}#app{position:var(--app-body-position);top:var(--app-root-top);left:0;right:0;width:var(--app-body-width)}body{margin:0;position:var(--app-body-position);inset:var(--app-body-inset);width:var(--app-body-width);color:var(--text);background-color:var(--bg);overflow-wrap:anywhere;word-break:auto-phrase;line-break:strict}a{--link-hover-color: light-dark(color-mix(in srgb, var(--link), black 30%), color-mix(in srgb, var(--link), white 30%));font-weight:500;color:var(--link);-webkit-tap-highlight-color:transparent;text-decoration:none;border-radius:6px}a:active{opacity:1}h2,h3{color:var(--text-light)}.card{padding:2em}button,[role=button],select{display:inline-flex;align-items:center;justify-content:center;height:100%;padding:0;font-size:1rem;font-weight:500;line-height:normal;color:var(--text);background-color:inherit;border:none;cursor:pointer;text-decoration:none;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;--button-selected-bg: light-dark(color-mix(in srgb, var(--btn-bg), black 18%), color-mix(in srgb, var(--btn-bg), white 22%));--button-hover-bg: light-dark(color-mix(in srgb, var(--btn-bg), black 4%), color-mix(in srgb, var(--btn-bg), white 5%));--button-hover-color: light-dark(color-mix(in srgb, var(--text), black 40%), color-mix(in srgb, var(--text), white 50%));--button-selected-hover-bg: light-dark(color-mix(in srgb, var(--btn-bg), black 20%), color-mix(in srgb, var(--btn-bg), white 30%));--button-selected-hover-color: light-dark(color-mix(in srgb, var(--text), black 20%), color-mix(in srgb, var(--text), white 30%))}:is(button,[role=button],select):disabled{opacity:.3;cursor:not-allowed}:is(button,[role=button],select):disabled.loading{opacity:1}button>*{pointer-events:none}button:active:not(:disabled),[role=button]:active{scale:.98;transition:scale .1s cubic-bezier(0,1,.5,1)}@media(prefers-reduced-motion:reduce){button:active:not(:disabled),[role=button]:active{scale:1;transition:none}}span{-webkit-tap-highlight-color:transparent}select{border-radius:6px}.svg-icon{-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-size:contain;mask-size:contain;-webkit-mask-position:center;mask-position:center;background-color:var(--svg);display:inline-block;inline-size:var(--icon-size, 28px);block-size:var(--icon-size, 28px);--icon-hover-color: light-dark(color-mix(in srgb, var(--svg), black 40%), color-mix(in srgb, var(--svg), white 50%));--icon-selected-hover-color: light-dark(color-mix(in srgb, var(--svg), black 20%), color-mix(in srgb, var(--svg), white 30%))}.tooltip-content{--tooltip-padding: 12px;--tooltip-font-size: 1rem;--tooltip-line-height: normal;--tooltip-z-index: 100;--tooltip-max-width: none;background:var(--dialog-bg);color:var(--text);border:1px solid var(--border);border-radius:6px;padding:var(--tooltip-padding);font-size:var(--tooltip-font-size);line-height:var(--tooltip-line-height);z-index:var(--tooltip-z-index);max-width:var(--tooltip-max-width)}.post-preview-tooltip-content{--tooltip-z-index: 10000;z-index:10000!important}:root:is(.light,.dark) button.selected:where(:not(:disabled)),:root:is(.light,.dark) button:where([data-state=active]){background-color:var(--button-selected-bg)}@media(hover:hover)and (pointer:fine){a:hover{text-decoration:underline}:root:is(.light,.dark) button:where(:hover:not(:disabled)),:root:is(.light,.dark) [role=button]:where(:hover:not([aria-disabled=true])),:root:is(.light,.dark) select:where(:hover:not(:disabled)){background-color:var(--button-hover-bg);color:var(--button-hover-color)}:is(:root:is(.light,.dark) button:where(:hover:not(:disabled)),:root:is(.light,.dark) [role=button]:where(:hover:not([aria-disabled=true])),:root:is(.light,.dark) select:where(:hover:not(:disabled))) .svg-icon{background-color:var(--icon-hover-color)}:root:is(.light,.dark) button.selected:where(:hover:not(:disabled)),:root:is(.light,.dark) button:where([data-state=active]:hover:not(:disabled)){background-color:var(--button-selected-hover-bg);color:var(--button-selected-hover-color)}:is(:root:is(.light,.dark) button.selected:where(:hover:not(:disabled)),:root:is(.light,.dark) button:where([data-state=active]:hover:not(:disabled))) .svg-icon{background-color:var(--icon-selected-hover-color)}:root:is(.light,.dark) a:hover{color:var(--link-hover-color)}}.setting-section{display:flex;flex-direction:column}.setting-row{display:flex;flex-direction:row;align-items:stretch;justify-content:space-between;min-height:50px}.setting-label{font-size:1rem;font-weight:500;line-height:1.3;display:flex;align-items:center;justify-content:flex-start;white-space:pre-line}.setting-control{display:flex;align-items:stretch;justify-content:flex-end;height:auto;margin-block:auto}", Np = ".pswp{--pswp-bg: #000;--pswp-placeholder-bg: #222;--pswp-root-z-index: 100000;--pswp-preloader-color: rgba(79, 79, 79, .4);--pswp-preloader-color-secondary: rgba(255, 255, 255, .9);--pswp-icon-color: #fff;--pswp-icon-color-secondary: #4f4f4f;--pswp-icon-stroke-color: #4f4f4f;--pswp-icon-stroke-width: 2px;--pswp-error-text-color: var(--pswp-icon-color)}.pswp{position:fixed;top:0;left:0;width:100%;height:100%;z-index:var(--pswp-root-z-index);display:none;touch-action:none;outline:0;opacity:.003;contain:layout style size;-webkit-tap-highlight-color:rgba(0,0,0,0)}.pswp:focus{outline:0}.pswp *{box-sizing:border-box}.pswp img{max-width:none}.pswp--open{display:block}.pswp,.pswp__bg{transform:translateZ(0);will-change:opacity}.pswp__bg{opacity:.005;background:var(--pswp-bg)}.pswp,.pswp__scroll-wrap{overflow:hidden}.pswp__scroll-wrap,.pswp__bg,.pswp__container,.pswp__item,.pswp__content,.pswp__img,.pswp__zoom-wrap{position:absolute;top:0;left:0;width:100%;height:100%}.pswp__img,.pswp__zoom-wrap{width:auto;height:auto}.pswp--click-to-zoom.pswp--zoom-allowed .pswp__img{cursor:-webkit-zoom-in;cursor:-moz-zoom-in;cursor:zoom-in}.pswp--click-to-zoom.pswp--zoomed-in .pswp__img{cursor:move;cursor:-webkit-grab;cursor:-moz-grab;cursor:grab}.pswp--click-to-zoom.pswp--zoomed-in .pswp__img:active{cursor:-webkit-grabbing;cursor:-moz-grabbing;cursor:grabbing}.pswp--no-mouse-drag.pswp--zoomed-in .pswp__img,.pswp--no-mouse-drag.pswp--zoomed-in .pswp__img:active,.pswp__img{cursor:-webkit-zoom-out;cursor:-moz-zoom-out;cursor:zoom-out}.pswp__container,.pswp__img,.pswp__button,.pswp__counter{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.pswp__item{z-index:1;overflow:hidden}.pswp__hidden{display:none!important}.pswp__content{pointer-events:none}.pswp__content>*{pointer-events:auto}.pswp__error-msg-container{display:grid}.pswp__error-msg{margin:auto;font-size:1em;line-height:1;color:var(--pswp-error-text-color)}.pswp .pswp__hide-on-close{opacity:.005;will-change:opacity;transition:opacity var(--pswp-transition-duration) cubic-bezier(.4,0,.22,1);z-index:10;pointer-events:none}.pswp--ui-visible .pswp__hide-on-close{opacity:1;pointer-events:auto}.pswp__button{position:relative;display:block;width:50px;height:60px;padding:0;margin:0;overflow:hidden;cursor:pointer;background:none;border:0;box-shadow:none;opacity:.85;-webkit-appearance:none;-webkit-touch-callout:none}.pswp__button:hover,.pswp__button:active,.pswp__button:focus{transition:none;padding:0;background:none;border:0;box-shadow:none;opacity:1}.pswp__button:disabled{opacity:.3;cursor:auto}.pswp__icn{fill:var(--pswp-icon-color);color:var(--pswp-icon-color-secondary)}.pswp__icn{position:absolute;top:14px;left:9px;width:32px;height:32px;overflow:hidden;pointer-events:none}.pswp__icn-shadow{stroke:var(--pswp-icon-stroke-color);stroke-width:var(--pswp-icon-stroke-width);fill:none}.pswp__icn:focus{outline:0}div.pswp__img--placeholder,.pswp__img--with-bg{background:var(--pswp-placeholder-bg)}.pswp__top-bar{position:absolute;left:0;top:0;width:100%;height:60px;display:flex;flex-direction:row;justify-content:flex-end;z-index:10;pointer-events:none!important}.pswp__top-bar>*{pointer-events:auto;will-change:opacity}.pswp__button--close{margin-right:6px}.pswp__button--arrow{position:absolute;width:75px;height:100px;top:50%;margin-top:-50px}.pswp__button--arrow:disabled{display:none;cursor:default}.pswp__button--arrow .pswp__icn{top:50%;margin-top:-30px;width:60px;height:60px;background:none;border-radius:0}.pswp--one-slide .pswp__button--arrow{display:none}.pswp--touch .pswp__button--arrow{visibility:hidden}.pswp--has_mouse .pswp__button--arrow{visibility:visible}.pswp__button--arrow--prev{right:auto;left:0}.pswp__button--arrow--next{right:0}.pswp__button--arrow--next .pswp__icn{left:auto;right:14px;transform:scaleX(-1)}.pswp__button--zoom{display:none}.pswp--zoom-allowed .pswp__button--zoom{display:block}.pswp--zoomed-in .pswp__zoom-icn-bar-v{display:none}.pswp__preloader{position:relative;overflow:hidden;width:50px;height:60px;margin-right:auto}.pswp__preloader .pswp__icn{opacity:0;transition:opacity .2s linear;animation:pswp-clockwise .6s linear infinite}.pswp__preloader--active .pswp__icn{opacity:.85}@keyframes pswp-clockwise{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.pswp__counter{height:30px;margin-top:15px;margin-inline-start:20px;font-size:14px;line-height:30px;color:var(--pswp-icon-color);text-shadow:1px 1px 3px var(--pswp-icon-color-secondary);opacity:.85}.pswp--one-slide .pswp__counter{display:none}";
function Pp(e) {
  return {
    notifyPostSuccess(t = {}) {
      return e.dispatchSafeEvent("ehagaki-post-success", {
        ...t,
        ...t.quotedEventIds ? { quotedEventIds: [...t.quotedEventIds] } : {}
      }), !0;
    },
    notifyPostError(t) {
      const n = typeof t == "object" && t?.code ? t.code : "post_failed";
      return e.dispatchSafeEvent("ehagaki-post-error", { code: n }), !0;
    },
    notifyComposerContextApplied() {
      return !0;
    },
    notifyComposerContextError(t) {
      return e.dispatchSafeEvent("ehagaki-initialization-error", {
        code: t.code,
        message: "Composer context could not be applied."
      }), !0;
    },
    notifyComposerContextUpdated(t) {
      return e.dispatchSafeEvent("ehagaki-composer-context-updated", {
        reply: t.reply,
        quotes: [...t.quotes],
        channel: t.channel ?? null
      }), !0;
    },
    notifySettingsApplied() {
      return !0;
    },
    notifySettingsError(t) {
      return e.dispatchSafeEvent("ehagaki-initialization-error", {
        code: t.code,
        message: "Settings could not be applied."
      }), !0;
    }
  };
}
const Mp = "--ehagaki-icon-", Up = /--ehagaki-icon-([0-9a-f]+)/g;
function zp(e) {
  if (e.length === 0 || e.length % 2 !== 0) return null;
  const t = Array.from(
    { length: e.length / 2 },
    (n, r) => String.fromCharCode(
      Number.parseInt(e.slice(r * 2, r * 2 + 2), 16)
    )
  ).join("");
  return /^[A-Za-z0-9._-]+\.svg$/.test(t) ? t : null;
}
function vo(e, t, n) {
  const r = /* @__PURE__ */ new Set();
  for (const i of e.querySelectorAll("style"))
    for (const o of i.textContent?.matchAll(Up) ?? [])
      r.add(o[0]);
  for (const i of r) {
    const o = zp(i.slice(Mp.length));
    o && t.style.setProperty(
      i,
      `url("${new URL(`icons/${o}`, n).href}")`
    );
  }
}
let Wt = null;
function Le(e, t) {
  const n = new Error(t);
  return n.name = e, n;
}
function Qa(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function Dp(e) {
  return !Qa(e) || !Object.hasOwn(e, "preloadedProfiles") ? e : {
    ...e,
    preloadedProfiles: Tp(e.preloadedProfiles)
  };
}
function Hp(e) {
  if (!Qa(e))
    throw Le("initialization_failed", "Invalid settings payload.");
  const t = {
    locale: /* @__PURE__ */ new Set(["ja", "en"]),
    themeMode: /* @__PURE__ */ new Set(["system", "light", "dark"]),
    imageQualityLevel: /* @__PURE__ */ new Set(["none", "low", "medium", "high"]),
    videoQualityLevel: /* @__PURE__ */ new Set(["none", "low", "medium", "high"]),
    imageCompressionLevel: /* @__PURE__ */ new Set(["none", "low", "medium", "high"]),
    videoCompressionLevel: /* @__PURE__ */ new Set(["none", "low", "medium", "high"])
  }, n = /* @__PURE__ */ new Set([
    "clientTagEnabled",
    "quoteNotificationEnabled",
    "replyNotificationEnabled",
    "mediaFreePlacement",
    "showMascot",
    "showFlavorText"
  ]), r = /* @__PURE__ */ new Set([
    ...Object.keys(t),
    ...n,
    "uploadEndpoint"
  ]);
  for (const [i, o] of Object.entries(e)) {
    if (!r.has(i))
      throw Le("initialization_failed", "Invalid settings payload.");
    if (i in t) {
      const s = t[i];
      if (typeof o != "string" || !s.has(o))
        throw Le("initialization_failed", "Invalid settings payload.");
    } else {
      if (n.has(i) && typeof o != "boolean")
        throw Le("initialization_failed", "Invalid settings payload.");
      if (i === "uploadEndpoint" && typeof o != "string")
        throw Le("initialization_failed", "Invalid settings payload.");
    }
  }
  return e;
}
function jp(e) {
  return e.replaceAll(/:root:is\(\s*\.light\s*,\s*\.dark\s*\)/g, ":host(:is(.light, .dark))").replaceAll(":root", ":host").replace(`html,
body,
#app`, `:host,
.ehagaki-web-component-shell`).replace("#app {", ".ehagaki-web-component-shell {").replace("body {", ".ehagaki-web-component-shell {");
}
function qp() {
  return `:host {
        display: block;
        --accent-color-forced: var(--ehagaki-accent-color);
        --base-color-forced: var(--ehagaki-base-color);
        --accent-color-external-default: var(--ehagaki-default-accent-color);
        --base-color-external-default: var(--ehagaki-default-base-color);
        --bg: var(--ehagaki-background, var(--surface-bg));
        --text: var(--ehagaki-text, var(--semantic-text));
        --border: var(--ehagaki-border, var(--surface-border));
        --link: var(--ehagaki-link, var(--semantic-link));
        --bg-input: var(--ehagaki-input-background, var(--surface-input));
        --bg-footer: var(--ehagaki-footer-background, var(--surface-footer));
        --dialog-bg: var(--ehagaki-dialog-background, var(--surface-dialog));
        font-family: var(--ehagaki-font-family, system-ui, sans-serif);
    }

    .ehagaki-web-component-shell {
        position: relative;
        container-type: inline-size;
        background: var(--bg);
    }

    .ehagaki-web-component-shell,
    .ehagaki-web-component-app {
        width: 100%;
        height: 100%;
        min-height: 0;
    }`;
}
class Vp extends HTMLElement {
  static get observedAttributes() {
    return ["asset-base", "auto-login"];
  }
  #e = null;
  #t = null;
  #i = null;
  #u = null;
  #n = null;
  #o = this.createReadyPromise();
  #r = "pending";
  #s = !1;
  #l = null;
  #a = Promise.resolve();
  #c = 0;
  #f = null;
  get editorIsEmpty() {
    return this.#l;
  }
  get assetBase() {
    return this.getAttribute("asset-base");
  }
  set assetBase(t) {
    if (t === null || t === "") {
      this.removeAttribute("asset-base");
      return;
    }
    this.setAttribute("asset-base", t);
  }
  /**
   * Opts into signing in with the host's `window.nostr` when startup restore
   * finds no session. Absent by default: reading the public key prompts.
   */
  get autoLogin() {
    return this.hasAttribute("auto-login");
  }
  set autoLogin(t) {
    this.toggleAttribute("auto-login", !!t);
  }
  attributeChangedCallback() {
  }
  connectedCallback() {
    if (this.onConnectionAttempt(), this.#l = null, this.#s = !1, this.#i) return;
    const t = this.getConnectionError();
    if (t) {
      const n = Le(t.code, t.message);
      this.fail("initialization_failed", n.message, n);
      return;
    }
    if (Wt && Wt !== this) {
      const n = Le(
        "multiple_instances_unsupported",
        "Only one ehagaki-composer can be connected in a document."
      );
      this.fail("multiple_instances_unsupported", n.message, n);
      return;
    }
    this.#r !== "pending" && (this.#o = this.createReadyPromise(), this.#r = "pending"), Wt = this, this.#i = this.mountApp();
  }
  disconnectedCallback() {
    this.#c += 1, this.#l = null, this.#s = !1, this.onDisconnected(), this.#f?.disconnect(), this.#f = null, Wt === this && (Wt = null), this.#t && (hs(this.#t), this.#t = null), this.#e = null, this.#i = null, this.#r === "pending" && (this.#r = "rejected", this.#n?.(Le("disconnected", "Component was disconnected before it became ready.")));
  }
  whenReady() {
    return this.#o;
  }
  setContext(t) {
    const n = Dp(t);
    return this.enqueue(async () => {
      await this.requireApp().setEmbedContext(n);
    });
  }
  setSettings(t) {
    return this.enqueue(async () => this.requireApp().setEmbedSettings(Hp(t)));
  }
  /** Focus the current Editor after the existing ready/operation boundary. */
  focusEditor() {
    return this.enqueue(async () => {
      this.requireApp().focusEditor();
    });
  }
  /** Blur the current Editor after the existing ready/operation boundary. */
  blurEditor() {
    return this.enqueue(async () => {
      this.requireApp().blurEditor();
    });
  }
  dispatchSafeEvent(t, n) {
    return this.dispatchEvent(new CustomEvent(t, {
      bubbles: !0,
      composed: !0,
      detail: n
    }));
  }
  createReadyPromise() {
    return new Promise((t, n) => {
      this.#u = t, this.#n = n;
    });
  }
  async mountApp() {
    const t = ++this.#c;
    try {
      const n = this.shadowRoot ?? this.attachShadow({ mode: "open" });
      n.replaceChildren();
      const r = document.createElement("style");
      r.textContent = `${jp(Bp)}
${Np}
${qp()}`;
      const i = document.createElement("div");
      i.className = "ehagaki-web-component-shell";
      const o = document.createElement("div");
      o.className = "ehagaki-web-component-app";
      const s = document.createElement("div");
      s.className = "ehagaki-web-component-overlays ehagaki-app-root", i.append(o, s), n.append(r, i);
      const c = new URL(
        this.assetBase ?? "./",
        import.meta.url
      );
      this.#f = new MutationObserver(() => {
        vo(n, i, c);
      }), this.#f.observe(n, {
        childList: !0,
        subtree: !0
      }), Tl({
        storage: Cl(window.localStorage),
        window,
        document,
        domRoot: n,
        styleTarget: i,
        layoutTarget: i,
        overlayTarget: s,
        themeTarget: this,
        layoutMode: "container",
        runtimeKind: "web-component",
        assetBase: c,
        serviceWorkerEnabled: !1,
        externalInputEnabled: !1,
        historyEnabled: !1,
        localNsecAuthEnabled: !1,
        autoLoginNip07Enabled: this.isAutoLoginNip07Enabled()
      });
      const { default: a } = await this.loadApp();
      if (!this.isConnected || t !== this.#c || (this.#t = Xr(a, {
        target: o,
        props: {
          notificationPort: Pp(this),
          onInitialized: () => {
            this.#h(t);
          },
          ...this.getAdditionalMountProps(t),
          onEditorEmptyChange: (u) => {
            this.#p(t, u);
          }
        }
      }), vo(n, i, c), this.#e = this.#t, !this.isConnected || t !== this.#c)) return;
    } catch {
      if (!this.isConnected || t !== this.#c) return;
      this.fail("initialization_failed", "eHagaki Composer could not be initialized.");
    }
  }
  requireApp() {
    if (!this.#e)
      throw Le("initialization_failed", "eHagaki Composer is not ready.");
    return this.#e;
  }
  /** Distribution-specific validation runs before the active-instance check. */
  onConnectionAttempt() {
  }
  getConnectionError() {
    return null;
  }
  onDisconnected() {
  }
  /** Full supports startup NIP-07; Lite overrides this runtime capability. */
  isAutoLoginNip07Enabled() {
    return this.autoLogin;
  }
  getAdditionalMountProps(t) {
    return {};
  }
  notifyPostComponentLoadFailure(t) {
    !this.isConnected || t !== this.#c || this.#r !== "pending" || this.fail("initialization_failed", "eHagaki Composer could not be initialized.");
  }
  enqueue(t) {
    const n = this.#a.then(async () => (await this.whenReady(), t()));
    return this.#a = n.then(() => {
    }, () => {
    }), n;
  }
  #h(t) {
    !this.isConnected || t !== this.#c || (this.#s = !0, this.#d(t));
  }
  #p(t, n) {
    if (!(!this.isConnected || t !== this.#c || typeof n != "boolean")) {
      if (this.#l === n) {
        this.#d(t);
        return;
      }
      this.#l = n, this.dispatchSafeEvent("ehagaki-editor-empty-change", { isEmpty: n }), this.#d(t);
    }
  }
  #d(t) {
    !this.isConnected || t !== this.#c || !this.#s || this.#l === null || this.#r !== "pending" || (this.#r = "resolved", this.#u?.(), this.dispatchSafeEvent("ehagaki-ready", { apiVersion: 1 }));
  }
  fail(t, n, r = Le(t, n)) {
    this.#r = "rejected", this.#n?.(r), this.dispatchSafeEvent("ehagaki-initialization-error", { code: t, message: n });
  }
}
function ec(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function _o(e) {
  return typeof e == "number" && Number.isSafeInteger(e) && e > 0;
}
const _r = {
  ctrl: 1,
  meta: 2,
  alt: 4,
  shift: 8
}, Fp = /* @__PURE__ */ new Set([
  "ctrl",
  "meta",
  "ctrlOrMeta",
  "alt",
  "shift"
]);
function Kp(e) {
  let t = 0;
  const n = e.includes("ctrlOrMeta");
  for (const r of e)
    r !== "ctrlOrMeta" && (t |= _r[r]);
  return n ? [t | _r.ctrl, t | _r.meta] : [t];
}
function Zp(e) {
  if (e === void 0) return;
  if (!Array.isArray(e))
    throw new TypeError("submitShortcuts must be an array when provided.");
  const t = /* @__PURE__ */ new Set(), n = [];
  for (const r of e) {
    if (!ec(r))
      throw new TypeError("Each submitShortcuts item must be an object.");
    if (typeof r.id != "string" || r.id.trim() === "")
      throw new TypeError("Each submitShortcuts item requires a non-blank string id.");
    if (!Array.isArray(r.modifiers) || r.modifiers.length === 0)
      throw new TypeError("Each submitShortcuts item requires a non-empty modifiers array.");
    const i = [], o = /* @__PURE__ */ new Set();
    for (const s of r.modifiers) {
      if (typeof s != "string" || !Fp.has(s))
        throw new TypeError("submitShortcuts contains an unknown modifier.");
      if (o.has(s))
        throw new TypeError("submitShortcuts cannot contain duplicate modifiers.");
      o.add(s), i.push(s);
    }
    if (i.includes("ctrlOrMeta") && (i.includes("ctrl") || i.includes("meta")))
      throw new TypeError("ctrlOrMeta cannot be combined with ctrl or meta.");
    for (const s of Kp(i)) {
      if (t.has(s))
        throw new TypeError("submitShortcuts cannot contain overlapping modifier states.");
      t.add(s);
    }
    n.push(Object.freeze({
      id: r.id,
      modifiers: Object.freeze([...i])
    }));
  }
  return Object.freeze(n);
}
function Wp(e) {
  if (!ec(e) || typeof e.submit != "function")
    throw new TypeError("Host-owned Composer requires a submit handler.");
  if (e.uploadMedia !== void 0 && typeof e.uploadMedia != "function")
    throw new TypeError("uploadMedia must be a function when provided.");
  if (e.contentWarningEnabled !== void 0 && typeof e.contentWarningEnabled != "boolean")
    throw new TypeError("contentWarningEnabled must be a boolean when provided.");
  if (e.hashtagPinEnabled !== void 0 && typeof e.hashtagPinEnabled != "boolean")
    throw new TypeError("hashtagPinEnabled must be a boolean when provided.");
  if (e.keyboardButtonBarEnabled !== void 0 && typeof e.keyboardButtonBarEnabled != "boolean")
    throw new TypeError("keyboardButtonBarEnabled must be a boolean when provided.");
  if (e.editorSubmitButtonEnabled !== void 0 && typeof e.editorSubmitButtonEnabled != "boolean")
    throw new TypeError("editorSubmitButtonEnabled must be a boolean when provided.");
  if (e.enterKeyBehavior !== void 0 && e.enterKeyBehavior !== "newline" && e.enterKeyBehavior !== "submit")
    throw new TypeError('enterKeyBehavior must be "newline" or "submit" when provided.');
  const t = e.editorMinLines !== void 0, n = e.editorMaxLines !== void 0;
  if (t !== n)
    throw new TypeError("editorMinLines and editorMaxLines must be provided together.");
  if (t && (!_o(e.editorMinLines) || !_o(e.editorMaxLines) || e.editorMinLines > e.editorMaxLines))
    throw new TypeError(
      "editorMinLines and editorMaxLines must be positive safe integers with editorMinLines <= editorMaxLines."
    );
  const r = e.submit, i = e.uploadMedia, o = e.editorMinLines, s = e.editorMaxLines, c = Zp(e.submitShortcuts);
  return {
    submit: r,
    ...i ? { uploadMedia: i } : {},
    ...e.contentWarningEnabled !== void 0 ? { contentWarningEnabled: e.contentWarningEnabled } : {},
    ...e.hashtagPinEnabled !== void 0 ? { hashtagPinEnabled: e.hashtagPinEnabled } : {},
    ...e.keyboardButtonBarEnabled !== void 0 ? { keyboardButtonBarEnabled: e.keyboardButtonBarEnabled } : {},
    ...e.editorSubmitButtonEnabled !== void 0 ? { editorSubmitButtonEnabled: e.editorSubmitButtonEnabled } : {},
    ...e.enterKeyBehavior !== void 0 ? { enterKeyBehavior: e.enterKeyBehavior } : {},
    ...c !== void 0 ? { submitShortcuts: c } : {},
    ...t ? {
      editorMinLines: o,
      editorMaxLines: s
    } : {}
  };
}
function Gp(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function Yp(e) {
  if (typeof e != "string") return !1;
  try {
    const t = new URL(e);
    return t.protocol === "http:" || t.protocol === "https:";
  } catch {
    return !1;
  }
}
function Xp(e) {
  if (!Array.isArray(e))
    throw new TypeError("Custom emoji catalog must be an array.");
  const t = /* @__PURE__ */ new Set(), n = [];
  for (const r of e) {
    if (!Gp(r) || typeof r.shortcode != "string" || !Yp(r.url))
      throw new TypeError("Custom emoji catalog contains an invalid item.");
    const i = r.shortcode.replace(/^:+|:+$/g, "").trim();
    if (!/^[\p{L}\p{N}_+-]{1,64}$/u.test(i))
      throw new TypeError("Custom emoji catalog contains an invalid shortcode.");
    const o = typeof r.setAddress == "string" && r.setAddress.trim() ? r.setAddress.trim() : null, s = `${i.toLowerCase()}\0${r.url}\0${o ?? ""}`;
    t.has(s) || (t.add(s), n.push({ shortcode: i, url: r.url, ...o ? { setAddress: o } : {} }));
  }
  return n;
}
class Jp extends Vp {
  #e = null;
  #t = [];
  #i = null;
  #u = !1;
  #n = null;
  #o = 0;
  /**
   * The current Host-owned Lite intrinsic height, or null when this mount
   * does not use editor auto-grow or has not measured yet.
   */
  get preferredHeight() {
    return this.#n;
  }
  /**
   * Selects Host-owned publication exactly once before this element's first
   * connection. Reconnection intentionally reuses this immutable choice.
   */
  configureHostOwned(t) {
    if (this.#u || this.#e)
      throw new DOMException(
        "Host-owned Composer configuration is immutable after it is set or connected.",
        "InvalidStateError"
      );
    this.#e = Wp(t);
  }
  setCustomEmojis(t) {
    if (!this.#e)
      return Promise.reject(new DOMException(
        "Custom emoji catalogs are available only in Host-owned mode.",
        "InvalidStateError"
      ));
    const n = Xp(t);
    return this.#t = n, this.enqueue(async () => {
      await this.requireApp().setHostCustomEmojis(n.map((i) => ({ ...i })));
    });
  }
  loadApp() {
    return import("./HostOwnedComposerLiteApp-DFFDo4k0.js").then((t) => t.H);
  }
  onConnectionAttempt() {
    this.#u = !0, this.#o += 1, this.#n = null;
  }
  getConnectionError() {
    return this.#e ? null : {
      code: "initialization_failed",
      message: "Host-owned Composer Lite requires configureHostOwned() before connection."
    };
  }
  onDisconnected() {
    this.#o += 1, this.#n = null, this.#i?.abort(), this.#i = null;
  }
  isAutoLoginNip07Enabled() {
    return !1;
  }
  getAdditionalMountProps() {
    if (!this.#e)
      throw new Error("Host-owned Composer Lite configuration is missing.");
    this.#i = new AbortController();
    const t = this.#o;
    return {
      hostOwnedConfig: {
        ...this.#e,
        customEmojis: this.#t.map((n) => ({ ...n })),
        signal: this.#i.signal
      },
      onPreferredHeightChange: (n) => {
        if (!this.isConnected || t !== this.#o || !Number.isFinite(n) || n <= 0)
          return;
        const r = Math.ceil(n);
        this.#n !== r && (this.#n = r, this.dispatchSafeEvent("ehagaki-preferred-height-change", { height: r }));
      }
    };
  }
}
tc("host-owned-lite", Jp);
export {
  T as $,
  vg as A,
  Oc as B,
  Re as C,
  gn as D,
  nn as E,
  rg as F,
  Pn as G,
  ag as H,
  $g as I,
  ic as J,
  ug as K,
  un as L,
  lg as M,
  hg as N,
  tg as O,
  fg as P,
  Te as Q,
  ye as R,
  Be as S,
  dg as T,
  Qc as U,
  Dt as V,
  Io as W,
  ln as X,
  Ro as Y,
  Ge as Z,
  Ug as _,
  qe as a,
  Pc as a$,
  it as a0,
  sl as a1,
  Wo as a2,
  yg as a3,
  mg as a4,
  Zn as a5,
  Ut as a6,
  So as a7,
  sg as a8,
  Kg as a9,
  eg as aA,
  fc as aB,
  Lt as aC,
  cg as aD,
  gg as aE,
  pg as aF,
  Gt as aG,
  wg as aH,
  bg as aI,
  gc as aJ,
  Ng as aK,
  Il as aL,
  Ye as aM,
  Rg as aN,
  vt as aO,
  Qt as aP,
  jc as aQ,
  Wg as aR,
  Sg as aS,
  kg as aT,
  Ag as aU,
  Pg as aV,
  Hg as aW,
  Nc as aX,
  e0 as aY,
  Og as aZ,
  ml as a_,
  Mg as aa,
  Jo as ab,
  jg as ac,
  zg as ad,
  hc as ae,
  pc as af,
  _g as ag,
  Cg as ah,
  Kc as ai,
  ng as aj,
  dc as ak,
  Rc as al,
  og as am,
  oc as an,
  qg as ao,
  Yg as ap,
  Xg as aq,
  fs as ar,
  Fg as as,
  te as at,
  Vg as au,
  ce as av,
  zi as aw,
  bt as ax,
  Kr as ay,
  at as az,
  Qe as b,
  Po as b0,
  r0 as b1,
  t0 as b2,
  Jg as b3,
  Lg as b4,
  Eg as b5,
  Ig as b6,
  Xr as b7,
  hs as b8,
  tl as b9,
  Tg as ba,
  Zg as bb,
  Qg as bc,
  n0 as bd,
  Lc as be,
  i0 as bf,
  Gg as bg,
  Ti as bh,
  Fn as bi,
  s0 as bj,
  o0 as bk,
  ma as bl,
  _p as bm,
  a0 as bn,
  c0 as bo,
  Tp as bp,
  Qp as bq,
  Pi as br,
  Jp as bs,
  Dg as c,
  Ln as d,
  Ie as e,
  We as f,
  xo as g,
  ft as h,
  nc as i,
  M as j,
  al as k,
  Bg as l,
  Xc as m,
  cc as n,
  sc as o,
  xn as p,
  yt as q,
  lc as r,
  Tc as s,
  Yo as t,
  ul as u,
  J as v,
  U as w,
  il as x,
  jr as y,
  xg as z
};
