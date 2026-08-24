const Ct = "ehagaki-composer", Oi = 1, Tt = Symbol.for("ehagaki-composer.distribution");
function Pr(e, t) {
  const r = globalThis, n = r[Tt];
  if (n && n !== e)
    throw new Error(
      `Cannot import the ${e} eHagaki Composer distribution after ${n} in the same document.`
    );
  r[Tt] = e;
  const i = customElements.get(Ct);
  if (!i) {
    customElements.define(Ct, t);
    return;
  }
  if (i !== t)
    throw new Error("ehagaki-composer is already defined by a different distribution.");
}
const Ft = !1;
var Lr = Array.isArray, Dr = Array.prototype.indexOf, ye = Array.prototype.includes, jr = Array.from, Ye = Object.keys, Ge = Object.defineProperty, me = Object.getOwnPropertyDescriptor, Hr = Object.getOwnPropertyDescriptors, Fr = Object.prototype, qr = Array.prototype, qt = Object.getPrototypeOf, Rt = Object.isExtensible;
function Ni(e) {
  return typeof e == "function";
}
const Br = () => {
};
function Vr(e) {
  for (var t = 0; t < e.length; t++)
    e[t]();
}
function Bt() {
  var e, t, r = new Promise((n, i) => {
    e = n, t = i;
  });
  return { promise: r, resolve: e, reject: t };
}
const $ = 2, ke = 4, ze = 8, _t = 1 << 24, P = 16, B = 32, K = 64, lt = 128, O = 512, k = 1024, x = 2048, V = 4096, N = 8192, q = 16384, oe = 32768, Ot = 1 << 25, Ie = 65536, Ke = 1 << 17, Ur = 1 << 18, pe = 1 << 19, Vt = 1 << 20, Ii = 1 << 25, de = 65536, Xe = 1 << 21, we = 1 << 22, re = 1 << 23, ce = Symbol("$state"), Wr = Symbol("legacy props"), Mi = Symbol(""), Yr = Symbol("attributes"), Gr = Symbol("class"), Kr = Symbol("style"), ct = Symbol("text"), zi = Symbol("form reset"), et = new class extends Error {
  name = "StaleReactionError";
  message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), Li = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml")
), Di = 1, Pe = 3, Le = 8;
function Xr(e) {
  throw new Error("https://svelte.dev/e/lifecycle_outside_component");
}
function Zr() {
  throw new Error("https://svelte.dev/e/async_derived_orphan");
}
function ji(e, t, r) {
  throw new Error("https://svelte.dev/e/each_key_duplicate");
}
function Jr(e) {
  throw new Error("https://svelte.dev/e/effect_in_teardown");
}
function Qr() {
  throw new Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function en(e) {
  throw new Error("https://svelte.dev/e/effect_orphan");
}
function tn() {
  throw new Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function rn() {
  throw new Error("https://svelte.dev/e/hydration_failed");
}
function Hi(e) {
  throw new Error("https://svelte.dev/e/props_invalid_value");
}
function nn() {
  throw new Error("https://svelte.dev/e/state_descriptors_fixed");
}
function on() {
  throw new Error("https://svelte.dev/e/state_prototype_fixed");
}
function sn() {
  throw new Error("https://svelte.dev/e/state_unsafe_mutation");
}
function an() {
  throw new Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
const Fi = 1, qi = 2, Bi = 4, Vi = 8, Ui = 16, Wi = 1, Yi = 4, Gi = 8, Ki = 16, ln = 1, cn = 2, Ut = "[", Wt = "[!", Nt = "[?", Yt = "]", Ee = {}, E = Symbol(), un = "http://www.w3.org/1999/xhtml", Xi = "http://www.w3.org/2000/svg", Zi = "http://www.w3.org/1998/Math/MathML", Ji = "@attach";
function fn() {
  console.warn("https://svelte.dev/e/derived_inert");
}
function tt(e) {
  console.warn("https://svelte.dev/e/hydration_mismatch");
}
function Qi() {
  console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function hn() {
  console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
let y = !1;
function He(e) {
  y = e;
}
let b;
function H(e) {
  if (e === null)
    throw tt(), Ee;
  return b = e;
}
function bt() {
  return H(/* @__PURE__ */ J(b));
}
function eo(e) {
  if (y) {
    if (/* @__PURE__ */ J(b) !== null)
      throw tt(), Ee;
    b = e;
  }
}
function dn(e = 1) {
  if (y) {
    for (var t = e, r = b; t--; )
      r = /** @type {TemplateNode} */
      /* @__PURE__ */ J(r);
    b = r;
  }
}
function pn(e = !0) {
  for (var t = 0, r = b; ; ) {
    if (r.nodeType === Le) {
      var n = (
        /** @type {Comment} */
        r.data
      );
      if (n === Yt) {
        if (t === 0) return r;
        t -= 1;
      } else (n === Ut || n === Wt || // "[1", "[2", etc. for if blocks
      n[0] === "[" && !isNaN(Number(n.slice(1)))) && (t += 1);
    }
    var i = (
      /** @type {TemplateNode} */
      /* @__PURE__ */ J(r)
    );
    e && r.remove(), r = i;
  }
}
function to(e) {
  if (!e || e.nodeType !== Le)
    throw tt(), Ee;
  return (
    /** @type {Comment} */
    e.data
  );
}
function Gt(e) {
  return e === this.v;
}
function gn(e, t) {
  return e != e ? t == t : e !== t || e !== null && typeof e == "object" || typeof e == "function";
}
function Kt(e) {
  return !gn(e, this.v);
}
let vn = !1, A = null;
function xe(e) {
  A = e;
}
function ro(e) {
  return (
    /** @type {T} */
    rt().get(e)
  );
}
function no(e, t) {
  return rt().set(e, t), t;
}
function io(e) {
  return rt().has(e);
}
function oo() {
  return rt();
}
function _n(e, t = !1, r) {
  A = {
    p: A,
    i: !1,
    c: null,
    e: null,
    s: e,
    x: null,
    r: (
      /** @type {Effect} */
      g
    ),
    l: null
  };
}
function bn(e) {
  var t = (
    /** @type {ComponentContext} */
    A
  ), r = t.e;
  if (r !== null) {
    t.e = null;
    for (var n of r)
      vr(n);
  }
  return e !== void 0 && (t.x = e), t.i = !0, A = t.p, e ?? /** @type {T} */
  {};
}
function Xt() {
  return !0;
}
function rt(e) {
  return A === null && Xr(), A.c ??= new Map(mn(A) || void 0);
}
function mn(e) {
  let t = e.p;
  for (; t !== null; ) {
    const r = t.c;
    if (r !== null)
      return r;
    t = t.p;
  }
  return null;
}
let ae = [];
function Zt() {
  var e = ae;
  ae = [], Vr(e);
}
function ue(e) {
  if (ae.length === 0 && !Oe) {
    var t = ae;
    queueMicrotask(() => {
      t === ae && Zt();
    });
  }
  ae.push(e);
}
function wn() {
  for (; ae.length > 0; )
    Zt();
}
function Jt(e) {
  var t = g;
  if (t === null)
    return v.f |= re, e;
  if ((t.f & oe) === 0 && (t.f & ke) === 0)
    throw e;
  te(e, t);
}
function te(e, t) {
  for (; t !== null; ) {
    if ((t.f & lt) !== 0) {
      if ((t.f & oe) === 0)
        throw e;
      try {
        t.b.error(e);
        return;
      } catch (r) {
        e = r;
      }
    }
    t = t.parent;
  }
  throw e;
}
const yn = -7169;
function w(e, t) {
  e.f = e.f & yn | t;
}
function mt(e) {
  (e.f & O) !== 0 || e.deps === null ? w(e, k) : w(e, V);
}
function Qt(e) {
  if (e !== null)
    for (const t of e)
      (t.f & $) === 0 || (t.f & de) === 0 || (t.f ^= de, Qt(
        /** @type {Derived} */
        t.deps
      ));
}
function er(e, t, r) {
  (e.f & x) !== 0 ? t.add(e) : (e.f & V) !== 0 && r.add(e), Qt(e.deps), w(e, k);
}
let ot = null, ve = null, _ = null, ut = null, L = null, ft = null, Oe = !1, st = !1, be = null, Be = null;
var It = 0;
let kn = 1;
class X {
  id = kn++;
  /** True as soon as `#process` was called */
  #e = !1;
  linked = !0;
  /** @type {Batch | null} */
  #t = null;
  /** @type {Batch | null} */
  #r = null;
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
  #c = /* @__PURE__ */ new Set();
  /**
   * If a fork is discarded, we need to destroy any effects that are no longer needed
   * @type {Set<(batch: Batch) => void>}
   */
  #s = /* @__PURE__ */ new Set();
  /**
   * Callbacks that should run only when a fork is committed.
   * @type {Set<(batch: Batch) => void>}
   */
  #a = /* @__PURE__ */ new Set();
  /**
   * The number of async effects that are currently in flight
   */
  #n = 0;
  /**
   * Async effects that are currently in flight, _not_ inside a pending boundary
   * @type {Map<Effect, number>}
   */
  #i = /* @__PURE__ */ new Map();
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
  #o = [];
  /**
   * Effects created while this batch was active.
   * @type {Effect[]}
   */
  #p = [];
  /**
   * Deferred effects (which run after async work has completed) that are DIRTY
   * @type {Set<Effect>}
   */
  #d = /* @__PURE__ */ new Set();
  /**
   * Deferred effects that are MAYBE_DIRTY
   * @type {Set<Effect>}
   */
  #u = /* @__PURE__ */ new Set();
  /**
   * A map of branches that still exist, but will be destroyed when this batch
   * is committed — we skip over these during `process`.
   * The value contains child effects that were dirty/maybe_dirty before being reset,
   * so they can be rescheduled if the branch survives.
   * @type {Map<Effect, { d: Effect[], m: Effect[] }>}
   */
  #f = /* @__PURE__ */ new Map();
  /**
   * Inverse of #skipped_branches which we need to tell prior batches to unskip them when committing
   * @type {Set<Effect>}
   */
  #h = /* @__PURE__ */ new Set();
  is_fork = !1;
  #_ = !1;
  #y() {
    if (this.is_fork) return !0;
    for (const n of this.#i.keys()) {
      for (var t = n, r = !1; t.parent !== null; ) {
        if (this.#f.has(t)) {
          r = !0;
          break;
        }
        t = t.parent;
      }
      if (!r)
        return !0;
    }
    return !1;
  }
  /**
   * Add an effect to the #skipped_branches map and reset its children
   * @param {Effect} effect
   */
  skip_effect(t) {
    this.#f.has(t) || this.#f.set(t, { d: [], m: [] }), this.#h.delete(t);
  }
  /**
   * Remove an effect from the #skipped_branches map and reschedule
   * any tracked dirty/maybe_dirty child effects
   * @param {Effect} effect
   * @param {(e: Effect) => void} callback
   */
  unskip_effect(t, r = (n) => this.schedule(n)) {
    var n = this.#f.get(t);
    if (n) {
      this.#f.delete(t);
      for (var i of n.d)
        w(i, x), r(i);
      for (i of n.m)
        w(i, V), r(i);
    }
    this.#h.add(t);
  }
  #v() {
    if (this.#e = !0, It++ > 1e3 && (this.#w(), En()), !this.#y()) {
      for (const a of this.#d)
        this.#u.delete(a), w(a, x), this.schedule(a);
      for (const a of this.#u)
        w(a, V), this.schedule(a);
    }
    const t = this.#o;
    this.#o = [], this.apply();
    var r = be = [], n = [], i = Be = [];
    for (const a of t)
      try {
        this.#k(a, r, n);
      } catch (c) {
        throw ir(a), c;
      }
    if (_ = null, i.length > 0) {
      var o = X.ensure();
      for (const a of i)
        o.schedule(a);
    }
    if (be = null, Be = null, this.#y()) {
      this.#g(n), this.#g(r);
      for (const [a, c] of this.#f)
        nr(a, c);
      i.length > 0 && /** @type {unknown} */
      _.#v();
      return;
    }
    const s = this.#E();
    if (s) {
      s.#b(this);
      return;
    }
    this.#d.clear(), this.#u.clear();
    for (const a of this.#c) a(this);
    this.#c.clear(), ut = this, Mt(n), Mt(r), ut = null, this.#l?.resolve();
    var l = (
      /** @type {Batch | null} */
      /** @type {unknown} */
      _
    );
    if (this.linked && this.#n === 0 && this.#w(), this.#o.length > 0) {
      l === null && (l = this, this.#m());
      const a = l;
      a.#o.push(...this.#o.filter((c) => !a.#o.includes(c)));
    }
    l !== null && l.#v();
  }
  /**
   * Traverse the effect tree, executing effects or stashing
   * them for later execution as appropriate
   * @param {Effect} root
   * @param {Effect[]} effects
   * @param {Effect[]} render_effects
   */
  #k(t, r, n) {
    t.f ^= k;
    for (var i = t.first; i !== null; ) {
      var o = i.f, s = (o & (B | K)) !== 0, l = s && (o & k) !== 0, a = l || (o & N) !== 0 || this.#f.has(i);
      if (!a && i.fn !== null) {
        s ? i.f ^= k : (o & ke) !== 0 ? r.push(i) : je(i) && ((o & P) !== 0 && this.#u.add(i), Ae(i));
        var c = i.first;
        if (c !== null) {
          i = c;
          continue;
        }
      }
      for (; i !== null; ) {
        var u = i.next;
        if (u !== null) {
          i = u;
          break;
        }
        i = i.parent;
      }
    }
  }
  #E() {
    for (var t = this.#t; t !== null; ) {
      if (!t.is_fork) {
        for (const [r, [, n]] of this.current)
          if (t.current.has(r) && !n)
            return t;
      }
      t = t.#t;
    }
    return null;
  }
  /**
   * @param {Batch} batch
   */
  #b(t) {
    for (const [n, i] of t.current)
      !this.previous.has(n) && t.previous.has(n) && this.previous.set(n, t.previous.get(n)), this.current.set(n, i);
    for (const [n, i] of t.async_deriveds) {
      const o = this.async_deriveds.get(n);
      o && i.promise.then(o.resolve);
    }
    const r = (n) => {
      var i = n.reactions;
      if (i !== null)
        for (const l of i) {
          var o = l.f;
          if ((o & $) !== 0)
            r(
              /** @type {Derived} */
              l
            );
          else {
            var s = (
              /** @type {Effect} */
              l
            );
            o & (we | P) && !this.async_deriveds.has(s) && (this.#u.delete(s), w(s, x), this.schedule(s));
          }
        }
    };
    for (const n of this.current.keys())
      r(n);
    this.oncommit(() => t.discard()), t.#w(), _ = this, this.#v();
  }
  /**
   * @param {Effect[]} effects
   */
  #g(t) {
    for (var r = 0; r < t.length; r += 1)
      er(t[r], this.#d, this.#u);
  }
  /**
   * Associate a change to a given source with the current
   * batch, noting its previous and current values
   * @param {Value} source
   * @param {any} value
   * @param {boolean} [is_derived]
   */
  capture(t, r, n = !1) {
    t.v !== E && !this.previous.has(t) && this.previous.set(t, t.v), (t.f & re) === 0 && (this.current.set(t, [r, n]), L?.set(t, r)), this.is_fork || (t.v = r);
  }
  activate() {
    _ = this;
  }
  deactivate() {
    _ = null, L = null;
  }
  flush() {
    try {
      st = !0, _ = this, this.#v();
    } finally {
      It = 0, ft = null, be = null, Be = null, st = !1, _ = null, L = null, fe.clear();
    }
  }
  discard() {
    for (const t of this.#s) t(this);
    this.#s.clear(), this.#a.clear(), this.#w();
  }
  /**
   * @param {Effect} effect
   */
  register_created_effect(t) {
    this.#p.push(t);
  }
  #x() {
    this.#w();
    for (let u = ot; u !== null; u = u.#r) {
      var t = u.id < this.id, r = [];
      for (const [f, [h, d]] of this.current) {
        if (u.current.has(f)) {
          var n = (
            /** @type {[any, boolean]} */
            u.current.get(f)[0]
          );
          if (t && h !== n)
            u.current.set(f, [h, d]);
          else
            continue;
        }
        r.push(f);
      }
      if (t)
        for (const [f, h] of this.async_deriveds) {
          const d = u.async_deriveds.get(f);
          d && h.promise.then(d.resolve);
        }
      if (u.#e) {
        var i = [...u.current.keys()].filter((f) => !this.current.has(f));
        if (i.length === 0)
          t && u.discard();
        else if (r.length > 0) {
          if (t)
            for (const f of this.#h)
              u.unskip_effect(f, (h) => {
                (h.f & (P | we)) !== 0 ? u.schedule(h) : u.#g([h]);
              });
          u.activate();
          var o = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map();
          for (var l of r)
            rr(l, i, o, s);
          s = /* @__PURE__ */ new Map();
          var a = [...u.current.keys()].filter(
            (f) => this.current.has(f) ? (
              /** @type {[any, boolean]} */
              this.current.get(f)[0] !== f.v
            ) : !0
          );
          if (a.length > 0)
            for (const f of this.#p)
              (f.f & (q | N | Ke)) === 0 && wt(f, a, s) && ((f.f & (we | P)) !== 0 ? (w(f, x), u.schedule(f)) : u.#d.add(f));
          if (u.#o.length > 0) {
            u.apply();
            for (var c of u.#o)
              u.#k(c, [], []);
            u.#o = [];
          }
          u.deactivate();
        }
      }
    }
  }
  /**
   * @param {boolean} blocking
   * @param {Effect} effect
   */
  increment(t, r) {
    if (this.#n += 1, t) {
      let n = this.#i.get(r) ?? 0;
      this.#i.set(r, n + 1);
    }
  }
  /**
   * @param {boolean} blocking
   * @param {Effect} effect
   */
  decrement(t, r) {
    if (this.#n -= 1, t) {
      let n = this.#i.get(r) ?? 0;
      n === 1 ? this.#i.delete(r) : this.#i.set(r, n - 1);
    }
    this.#_ || (this.#_ = !0, ue(() => {
      this.#_ = !1, this.linked && this.flush();
    }));
  }
  /**
   * @param {Set<Effect>} dirty_effects
   * @param {Set<Effect>} maybe_dirty_effects
   */
  transfer_effects(t, r) {
    for (const n of t)
      this.#d.add(n);
    for (const n of r)
      this.#u.add(n);
    t.clear(), r.clear();
  }
  /** @param {(batch: Batch) => void} fn */
  oncommit(t) {
    this.#c.add(t);
  }
  /** @param {(batch: Batch) => void} fn */
  ondiscard(t) {
    this.#s.add(t);
  }
  /** @param {(batch: Batch) => void} fn */
  on_fork_commit(t) {
    this.#a.add(t);
  }
  run_fork_commit_callbacks() {
    for (const t of this.#a) t(this);
    this.#a.clear();
  }
  settled() {
    return (this.#l ??= Bt()).promise;
  }
  static ensure() {
    if (_ === null) {
      const t = _ = new X();
      t.#m(), !st && !Oe && ue(() => {
        t.#e || t.flush();
      });
    }
    return _;
  }
  apply() {
    {
      L = null;
      return;
    }
  }
  /**
   *
   * @param {Effect} effect
   */
  schedule(t) {
    if (ft = t, t.b?.is_pending && (t.f & (ke | ze | _t)) !== 0 && (t.f & oe) === 0) {
      t.b.defer_effect(t);
      return;
    }
    for (var r = t; r.parent !== null; ) {
      r = r.parent;
      var n = r.f;
      if (be !== null && r === g && (v === null || (v.f & $) === 0))
        return;
      if ((n & (K | B)) !== 0) {
        if ((n & k) === 0)
          return;
        r.f ^= k;
      }
    }
    this.#o.push(r);
  }
  #m() {
    ve === null ? ot = ve = this : (ve.#r = this, this.#t = ve), ve = this;
  }
  #w() {
    var t = this.#t, r = this.#r;
    t === null ? ot = r : t.#r = r, r === null ? ve = t : r.#t = t, this.linked = !1;
  }
}
function tr(e) {
  var t = Oe;
  Oe = !0;
  try {
    for (var r; ; ) {
      if (wn(), _ === null)
        return (
          /** @type {T} */
          r
        );
      _.flush();
    }
  } finally {
    Oe = t;
  }
}
function En() {
  try {
    tn();
  } catch (e) {
    te(e, ft);
  }
}
let Y = null;
function Mt(e) {
  var t = e.length;
  if (t !== 0) {
    for (var r = 0; r < t; ) {
      var n = e[r++];
      if ((n.f & (q | N)) === 0 && je(n) && (Y = /* @__PURE__ */ new Set(), Ae(n), n.deps === null && n.first === null && n.nodes === null && n.teardown === null && n.ac === null && mr(n), Y?.size > 0)) {
        fe.clear();
        for (const i of Y) {
          if ((i.f & (q | N)) !== 0) continue;
          const o = [i];
          let s = i.parent;
          for (; s !== null; )
            Y.has(s) && (Y.delete(s), o.push(s)), s = s.parent;
          for (let l = o.length - 1; l >= 0; l--) {
            const a = o[l];
            (a.f & (q | N)) === 0 && Ae(a);
          }
        }
        Y.clear();
      }
    }
    Y = null;
  }
}
function rr(e, t, r, n) {
  if (!r.has(e) && (r.add(e), e.reactions !== null))
    for (const i of e.reactions) {
      const o = i.f;
      (o & $) !== 0 ? rr(
        /** @type {Derived} */
        i,
        t,
        r,
        n
      ) : (o & (we | P)) !== 0 && (o & x) === 0 && wt(i, t, n) && (w(i, x), yt(
        /** @type {Effect} */
        i
      ));
    }
}
function wt(e, t, r) {
  const n = r.get(e);
  if (n !== void 0) return n;
  if (e.deps !== null)
    for (const i of e.deps) {
      if (ye.call(t, i))
        return !0;
      if ((i.f & $) !== 0 && wt(
        /** @type {Derived} */
        i,
        t,
        r
      ))
        return r.set(
          /** @type {Derived} */
          i,
          !0
        ), !0;
    }
  return r.set(e, !1), !1;
}
function yt(e) {
  _.schedule(e);
}
function nr(e, t) {
  if (!((e.f & B) !== 0 && (e.f & k) !== 0)) {
    (e.f & x) !== 0 ? t.d.push(e) : (e.f & V) !== 0 && t.m.push(e), w(e, k);
    for (var r = e.first; r !== null; )
      nr(r, t), r = r.next;
  }
}
function ir(e) {
  w(e, k);
  for (var t = e.first; t !== null; )
    ir(t), t = t.next;
}
function xn(e) {
  let t = 0, r = De(0), n;
  return () => {
    $t() && (G(r), _r(() => (t === 0 && (n = Wn(() => e(() => Ne(r)))), t += 1, () => {
      ue(() => {
        t -= 1, t === 0 && (n?.(), n = void 0, Ne(r));
      });
    })));
  };
}
var $n = Ie | pe;
function An(e, t, r, n) {
  new Sn(e, t, r, n);
}
class Sn {
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
  #t = y ? b : null;
  /** @type {BoundaryProps} */
  #r;
  /** @type {((anchor: Node) => void)} */
  #c;
  /** @type {Effect} */
  #s;
  /** @type {Effect | null} */
  #a = null;
  /** @type {Effect | null} */
  #n = null;
  /** @type {Effect | null} */
  #i = null;
  /** @type {DocumentFragment | null} */
  #l = null;
  #o = 0;
  #p = 0;
  #d = !1;
  /** @type {Set<Effect>} */
  #u = /* @__PURE__ */ new Set();
  /** @type {Set<Effect>} */
  #f = /* @__PURE__ */ new Set();
  /**
   * A source containing the number of pending async deriveds/expressions.
   * Only created if `$effect.pending()` is used inside the boundary,
   * otherwise updating the source results in needless `Batch.ensure()`
   * calls followed by no-op flushes
   * @type {Source<number> | null}
   */
  #h = null;
  #_ = xn(() => (this.#h = De(this.#o), () => {
    this.#h = null;
  }));
  /**
   * @param {TemplateNode} node
   * @param {BoundaryProps} props
   * @param {((anchor: Node) => void)} children
   * @param {((error: unknown) => unknown) | undefined} [transform_error]
   */
  constructor(t, r, n, i) {
    this.#e = t, this.#r = r, this.#c = (o) => {
      var s = (
        /** @type {Effect} */
        g
      );
      s.b = this, s.f |= lt, n(o);
    }, this.parent = /** @type {Effect} */
    g.b, this.transform_error = i ?? this.parent?.transform_error ?? ((o) => o), this.#s = Hn(() => {
      if (y) {
        const o = (
          /** @type {Comment} */
          this.#t
        );
        bt();
        const s = o.data === Wt;
        if (o.data.startsWith(Nt)) {
          const a = JSON.parse(o.data.slice(Nt.length));
          this.#v(a);
        } else s ? this.#k() : this.#y();
      } else
        this.#E();
    }, $n), y && (this.#e = b);
  }
  #y() {
    try {
      this.#a = se(() => this.#c(this.#e));
    } catch (t) {
      this.error(t);
    }
  }
  /**
   * @param {unknown} error The deserialized error from the server's hydration comment
   */
  #v(t) {
    const r = this.#r.failed;
    r && (this.#i = se(() => {
      r(
        this.#e,
        () => t,
        () => () => {
        }
      );
    }));
  }
  #k() {
    const t = this.#r.pending;
    t && (this.is_pending = !0, this.#n = se(() => t(this.#e)), ue(() => {
      var r = this.#l = document.createDocumentFragment(), n = Z();
      r.append(n), this.#a = this.#g(() => se(() => this.#c(n))), this.#p === 0 && (this.#e.before(r), this.#l = null, Ve(
        /** @type {Effect} */
        this.#n,
        () => {
          this.#n = null;
        }
      ), this.#b(
        /** @type {Batch} */
        _
      ));
    }));
  }
  #E() {
    try {
      if (this.is_pending = this.has_pending_snippet(), this.#p = 0, this.#o = 0, this.#a = se(() => {
        this.#c(this.#e);
      }), this.#p > 0) {
        var t = this.#l = document.createDocumentFragment();
        Bn(this.#a, t);
        const r = (
          /** @type {(anchor: Node) => void} */
          this.#r.pending
        );
        this.#n = se(() => r(this.#e));
      } else
        this.#b(
          /** @type {Batch} */
          _
        );
    } catch (r) {
      this.error(r);
    }
  }
  /**
   * @param {Batch} batch
   */
  #b(t) {
    this.is_pending = !1, t.transfer_effects(this.#u, this.#f);
  }
  /**
   * Defer an effect inside a pending boundary until the boundary resolves
   * @param {Effect} effect
   */
  defer_effect(t) {
    er(t, this.#u, this.#f);
  }
  /**
   * Returns `false` if the effect exists inside a boundary whose pending snippet is shown
   * @returns {boolean}
   */
  is_rendered() {
    return !this.is_pending && (!this.parent || this.parent.is_rendered());
  }
  has_pending_snippet() {
    return !!this.#r.pending;
  }
  /**
   * @template T
   * @param {() => T} fn
   */
  #g(t) {
    var r = g, n = v, i = A;
    U(this.#s), M(this.#s), xe(this.#s.ctx);
    try {
      return X.ensure(), t();
    } catch (o) {
      return Jt(o), null;
    } finally {
      U(r), M(n), xe(i);
    }
  }
  /**
   * Updates the pending count associated with the currently visible pending snippet,
   * if any, such that we can replace the snippet with content once work is done
   * @param {1 | -1} d
   * @param {Batch} batch
   */
  #x(t, r) {
    if (!this.has_pending_snippet()) {
      this.parent && this.parent.#x(t, r);
      return;
    }
    this.#p += t, this.#p === 0 && (this.#b(r), this.#n && Ve(this.#n, () => {
      this.#n = null;
    }), this.#l && (this.#e.before(this.#l), this.#l = null));
  }
  /**
   * Update the source that powers `$effect.pending()` inside this boundary,
   * and controls when the current `pending` snippet (if any) is removed.
   * Do not call from inside the class
   * @param {1 | -1} d
   * @param {Batch} batch
   */
  update_pending_count(t, r) {
    this.#x(t, r), this.#o += t, !(!this.#h || this.#d) && (this.#d = !0, ue(() => {
      this.#d = !1, this.#h && Qe(this.#h, this.#o);
    }));
  }
  get_effect_pending() {
    return this.#_(), G(
      /** @type {Source<number>} */
      this.#h
    );
  }
  /** @param {unknown} error */
  error(t) {
    if (!this.#r.onerror && !this.#r.failed)
      throw t;
    _?.is_fork ? (this.#a && _.skip_effect(this.#a), this.#n && _.skip_effect(this.#n), this.#i && _.skip_effect(this.#i), _.on_fork_commit(() => {
      this.#m(t);
    })) : this.#m(t);
  }
  /**
   * @param {unknown} error
   */
  #m(t) {
    this.#a && (j(this.#a), this.#a = null), this.#n && (j(this.#n), this.#n = null), this.#i && (j(this.#i), this.#i = null), y && (H(
      /** @type {TemplateNode} */
      this.#t
    ), dn(), H(pn()));
    var r = this.#r.onerror;
    let n = this.#r.failed;
    var i = !1, o = !1;
    const s = () => {
      if (i) {
        hn();
        return;
      }
      i = !0, o && an(), this.#i !== null && Ve(this.#i, () => {
        this.#i = null;
      }), this.#g(() => {
        this.#E();
      });
    }, l = (a) => {
      try {
        o = !0, r?.(a, s), o = !1;
      } catch (c) {
        te(c, this.#s && this.#s.parent);
      }
      n && (this.#i = this.#g(() => {
        try {
          return se(() => {
            var c = (
              /** @type {Effect} */
              g
            );
            c.b = this, c.f |= lt, n(
              this.#e,
              () => a,
              () => s
            );
          });
        } catch (c) {
          return te(
            c,
            /** @type {Effect} */
            this.#s.parent
          ), null;
        }
      }));
    };
    ue(() => {
      var a;
      try {
        a = this.transform_error(t);
      } catch (c) {
        te(c, this.#s && this.#s.parent);
        return;
      }
      a !== null && typeof a == "object" && typeof /** @type {any} */
      a.then == "function" ? a.then(
        l,
        /** @param {unknown} e */
        (c) => te(c, this.#s && this.#s.parent)
      ) : l(a);
    });
  }
}
function Cn(e, t, r, n) {
  const i = kt;
  var o = e.filter((h) => !h.settled);
  if (r.length === 0 && o.length === 0) {
    n(t.map(i));
    return;
  }
  var s = (
    /** @type {Effect} */
    g
  ), l = Tn(), a = o.length === 1 ? o[0].promise : o.length > 1 ? Promise.all(o.map((h) => h.promise)) : null;
  function c(h) {
    if ((s.f & q) === 0) {
      l();
      try {
        n(h);
      } catch (d) {
        te(d, s);
      }
      Ze();
    }
  }
  var u = or();
  if (r.length === 0) {
    a.then(() => c(t.map(i))).finally(u);
    return;
  }
  function f() {
    Promise.all(r.map((h) => /* @__PURE__ */ Rn(h))).then((h) => c([...t.map(i), ...h])).catch((h) => te(h, s)).finally(u);
  }
  a ? a.then(() => {
    l(), f(), Ze();
  }) : f();
}
function Tn() {
  var e = (
    /** @type {Effect} */
    g
  ), t = v, r = A, n = (
    /** @type {Batch} */
    _
  );
  return function(o = !0) {
    U(e), M(t), xe(r), o && (e.f & q) === 0 && (n?.activate(), n?.apply());
  };
}
function Ze(e = !0) {
  U(null), M(null), xe(null), e && _?.deactivate();
}
function or() {
  var e = (
    /** @type {Effect} */
    g
  ), t = (
    /** @type {Boundary} */
    e.b
  ), r = (
    /** @type {Batch} */
    _
  ), n = t.is_rendered();
  return t.update_pending_count(1, r), r.increment(n, e), () => {
    t.update_pending_count(-1, r), r.decrement(n, e);
  };
}
// @__NO_SIDE_EFFECTS__
function kt(e) {
  var t = $ | x;
  return g !== null && (g.f |= pe), {
    ctx: A,
    deps: null,
    effects: null,
    equals: Gt,
    f: t,
    fn: e,
    reactions: null,
    rv: 0,
    v: (
      /** @type {V} */
      E
    ),
    wv: 0,
    parent: g,
    ac: null
  };
}
const Fe = Symbol("obsolete");
// @__NO_SIDE_EFFECTS__
function Rn(e, t, r) {
  let n = (
    /** @type {Effect | null} */
    g
  );
  n === null && Zr();
  var i = (
    /** @type {Promise<V>} */
    /** @type {unknown} */
    void 0
  ), o = De(
    /** @type {V} */
    E
  ), s = !v, l = /* @__PURE__ */ new Set();
  return jn(() => {
    var a = (
      /** @type {Effect} */
      g
    ), c = Bt();
    i = c.promise;
    try {
      Promise.resolve(e()).then(c.resolve, (d) => {
        d !== et && c.reject(d);
      }).finally(Ze);
    } catch (d) {
      c.reject(d), Ze();
    }
    var u = (
      /** @type {Batch} */
      _
    );
    if (s) {
      if ((a.f & oe) !== 0)
        var f = or();
      if (
        /** @type {Boundary} */
        n.b.is_rendered()
      )
        u.async_deriveds.get(a)?.reject(Fe);
      else
        for (const d of l.values())
          d.reject(Fe);
      l.add(c), u.async_deriveds.set(a, c);
    }
    const h = (d, p = void 0) => {
      f?.(), l.delete(c), p !== Fe && (u.activate(), p ? (o.f |= re, Qe(o, p)) : ((o.f & re) !== 0 && (o.f ^= re), Qe(o, d)), u.deactivate());
    };
    c.promise.then(h, (d) => h(null, d || "unknown"));
  }), gr(() => {
    for (const a of l)
      a.reject(Fe);
  }), new Promise((a) => {
    function c(u) {
      function f() {
        u === i ? a(o) : c(i);
      }
      u.then(f, f);
    }
    c(i);
  });
}
// @__NO_SIDE_EFFECTS__
function so(e) {
  const t = /* @__PURE__ */ kt(e);
  return kr(t), t;
}
// @__NO_SIDE_EFFECTS__
function ao(e) {
  const t = /* @__PURE__ */ kt(e);
  return t.equals = Kt, t;
}
function On(e) {
  var t = e.effects;
  if (t !== null) {
    e.effects = null;
    for (var r = 0; r < t.length; r += 1)
      j(
        /** @type {Effect} */
        t[r]
      );
  }
}
function Et(e) {
  var t, r = g, n = e.parent;
  if (!ie && n !== null && (n.f & (q | N)) !== 0)
    return fn(), e.v;
  U(n);
  try {
    e.f &= ~de, On(e), t = Ar(e);
  } finally {
    U(r);
  }
  return t;
}
function sr(e) {
  var t = Et(e);
  if (!e.equals(t) && (e.wv = xr(), (!_?.is_fork || e.deps === null) && (_ !== null ? (_.capture(e, t, !0), ut?.capture(e, t, !0)) : e.v = t, e.deps === null))) {
    w(e, k);
    return;
  }
  ie || (L !== null ? ($t() || _?.is_fork) && L.set(e, t) : mt(e));
}
function Nn(e) {
  if (e.effects !== null)
    for (const t of e.effects)
      (t.teardown || t.ac) && (t.teardown?.(), t.ac?.abort(et), t.teardown = Br, t.ac = null, Me(t, 0), At(t));
}
function ar(e) {
  if (e.effects !== null)
    for (const t of e.effects)
      t.teardown && Ae(t);
}
let Je = /* @__PURE__ */ new Set();
const fe = /* @__PURE__ */ new Map();
let lr = !1;
function De(e, t) {
  var r = {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v: e,
    reactions: null,
    equals: Gt,
    rv: 0,
    wv: 0
  };
  return r;
}
// @__NO_SIDE_EFFECTS__
function Q(e, t) {
  const r = De(e);
  return kr(r), r;
}
// @__NO_SIDE_EFFECTS__
function In(e, t = !1, r = !0) {
  const n = De(e);
  return t || (n.equals = Kt), n;
}
function ee(e, t, r = !1) {
  v !== null && // since we are untracking the function inside `$inspect.with` we need to add this check
  // to ensure we error if state is set inside an inspect effect
  (!D || (v.f & Ke) !== 0) && Xt() && (v.f & ($ | P | we | Ke)) !== 0 && (I === null || !ye.call(I, e)) && sn();
  let n = r ? Ce(t) : t;
  return Qe(e, n, Be);
}
function Qe(e, t, r = null) {
  if (!e.equals(t)) {
    fe.set(e, ie ? t : e.v);
    var n = X.ensure();
    if (n.capture(e, t), (e.f & $) !== 0) {
      const i = (
        /** @type {Derived} */
        e
      );
      (e.f & x) !== 0 && Et(i), L === null && mt(i);
    }
    e.wv = xr(), cr(e, x, r), g !== null && (g.f & k) !== 0 && (g.f & (B | K)) === 0 && (R === null ? Vn([e]) : R.push(e)), !n.is_fork && Je.size > 0 && !lr && Mn();
  }
  return t;
}
function Mn() {
  lr = !1;
  for (const e of Je) {
    (e.f & k) !== 0 && w(e, V);
    let t;
    try {
      t = je(e);
    } catch {
      t = !0;
    }
    t && Ae(e);
  }
  Je.clear();
}
function Ne(e) {
  ee(e, e.v + 1);
}
function cr(e, t, r) {
  var n = e.reactions;
  if (n !== null)
    for (var i = n.length, o = 0; o < i; o++) {
      var s = n[o], l = s.f, a = (l & x) === 0;
      if (a && w(s, t), (l & Ke) !== 0)
        Je.add(
          /** @type {Effect} */
          s
        );
      else if ((l & $) !== 0) {
        var c = (
          /** @type {Derived} */
          s
        );
        L?.delete(c), (l & de) === 0 && (l & O && (g === null || (g.f & Xe) === 0) && (s.f |= de), cr(c, V, r));
      } else if (a) {
        var u = (
          /** @type {Effect} */
          s
        );
        (l & P) !== 0 && Y !== null && Y.add(u), r !== null ? r.push(u) : yt(u);
      }
    }
}
function Ce(e) {
  if (typeof e != "object" || e === null || ce in e)
    return e;
  const t = qt(e);
  if (t !== Fr && t !== qr)
    return e;
  var r = /* @__PURE__ */ new Map(), n = Lr(e), i = /* @__PURE__ */ Q(0), o = he, s = (l) => {
    if (he === o)
      return l();
    var a = v, c = he;
    M(null), Dt(o);
    var u = l();
    return M(a), Dt(c), u;
  };
  return n && r.set("length", /* @__PURE__ */ Q(
    /** @type {any[]} */
    e.length
  )), new Proxy(
    /** @type {any} */
    e,
    {
      defineProperty(l, a, c) {
        (!("value" in c) || c.configurable === !1 || c.enumerable === !1 || c.writable === !1) && nn();
        var u = r.get(a);
        return u === void 0 ? s(() => {
          var f = /* @__PURE__ */ Q(c.value);
          return r.set(a, f), f;
        }) : ee(u, c.value, !0), !0;
      },
      deleteProperty(l, a) {
        var c = r.get(a);
        if (c === void 0) {
          if (a in l) {
            const u = s(() => /* @__PURE__ */ Q(E));
            r.set(a, u), Ne(i);
          }
        } else
          ee(c, E), Ne(i);
        return !0;
      },
      get(l, a, c) {
        if (a === ce)
          return e;
        var u = r.get(a), f = a in l;
        if (u === void 0 && (!f || me(l, a)?.writable) && (u = s(() => {
          var d = Ce(f ? l[a] : E), p = /* @__PURE__ */ Q(d);
          return p;
        }), r.set(a, u)), u !== void 0) {
          var h = G(u);
          return h === E ? void 0 : h;
        }
        return Reflect.get(l, a, c);
      },
      getOwnPropertyDescriptor(l, a) {
        var c = Reflect.getOwnPropertyDescriptor(l, a);
        if (c && "value" in c) {
          var u = r.get(a);
          u && (c.value = G(u));
        } else if (c === void 0) {
          var f = r.get(a), h = f?.v;
          if (f !== void 0 && h !== E)
            return {
              enumerable: !0,
              configurable: !0,
              value: h,
              writable: !0
            };
        }
        return c;
      },
      has(l, a) {
        if (a === ce)
          return !0;
        var c = r.get(a), u = c !== void 0 && c.v !== E || Reflect.has(l, a);
        if (c !== void 0 || g !== null && (!u || me(l, a)?.writable)) {
          c === void 0 && (c = s(() => {
            var h = u ? Ce(l[a]) : E, d = /* @__PURE__ */ Q(h);
            return d;
          }), r.set(a, c));
          var f = G(c);
          if (f === E)
            return !1;
        }
        return u;
      },
      set(l, a, c, u) {
        var f = r.get(a), h = a in l;
        if (n && a === "length")
          for (var d = c; d < /** @type {Source<number>} */
          f.v; d += 1) {
            var p = r.get(d + "");
            p !== void 0 ? ee(p, E) : d in l && (p = s(() => /* @__PURE__ */ Q(E)), r.set(d + "", p));
          }
        if (f === void 0)
          (!h || me(l, a)?.writable) && (f = s(() => /* @__PURE__ */ Q(void 0)), ee(f, Ce(c)), r.set(a, f));
        else {
          h = f.v !== E;
          var m = s(() => Ce(c));
          ee(f, m);
        }
        var C = Reflect.getOwnPropertyDescriptor(l, a);
        if (C?.set && C.set.call(u, c), !h) {
          if (n && typeof a == "string") {
            var W = (
              /** @type {Source<number>} */
              r.get("length")
            ), ge = Number(a);
            Number.isInteger(ge) && ge >= W.v && ee(W, ge + 1);
          }
          Ne(i);
        }
        return !0;
      },
      ownKeys(l) {
        G(i);
        var a = Reflect.ownKeys(l).filter((f) => {
          var h = r.get(f);
          return h === void 0 || h.v !== E;
        });
        for (var [c, u] of r)
          u.v !== E && !(c in l) && a.push(c);
        return a;
      },
      setPrototypeOf() {
        on();
      }
    }
  );
}
function zt(e) {
  try {
    if (e !== null && typeof e == "object" && ce in e)
      return e[ce];
  } catch {
  }
  return e;
}
function lo(e, t) {
  return Object.is(zt(e), zt(t));
}
var Pt, ur, fr, hr;
function ht() {
  if (Pt === void 0) {
    Pt = window, ur = /Firefox/.test(navigator.userAgent);
    var e = Element.prototype, t = Node.prototype, r = Text.prototype;
    fr = me(t, "firstChild").get, hr = me(t, "nextSibling").get, Rt(e) && (e[Gr] = void 0, e[Yr] = null, e[Kr] = void 0, e.__e = void 0), Rt(r) && (r[ct] = void 0);
  }
}
function Z(e = "") {
  return document.createTextNode(e);
}
// @__NO_SIDE_EFFECTS__
function $e(e) {
  return (
    /** @type {TemplateNode | null} */
    fr.call(e)
  );
}
// @__NO_SIDE_EFFECTS__
function J(e) {
  return (
    /** @type {TemplateNode | null} */
    hr.call(e)
  );
}
function co(e, t) {
  if (!y)
    return /* @__PURE__ */ $e(e);
  var r = /* @__PURE__ */ $e(b);
  if (r === null)
    r = b.appendChild(Z());
  else if (t && r.nodeType !== Pe) {
    var n = Z();
    return r?.before(n), H(n), n;
  }
  return t && nt(
    /** @type {Text} */
    r
  ), H(r), r;
}
function uo(e, t = !1) {
  if (!y) {
    var r = /* @__PURE__ */ $e(e);
    return r instanceof Comment && r.data === "" ? /* @__PURE__ */ J(r) : r;
  }
  if (t) {
    if (b?.nodeType !== Pe) {
      var n = Z();
      return b?.before(n), H(n), n;
    }
    nt(
      /** @type {Text} */
      b
    );
  }
  return b;
}
function fo(e, t = 1, r = !1) {
  let n = y ? b : e;
  for (var i; t--; )
    i = n, n = /** @type {TemplateNode} */
    /* @__PURE__ */ J(n);
  if (!y)
    return n;
  if (r) {
    if (n?.nodeType !== Pe) {
      var o = Z();
      return n === null ? i?.after(o) : n.before(o), H(o), o;
    }
    nt(
      /** @type {Text} */
      n
    );
  }
  return H(n), n;
}
function zn(e) {
  e.textContent = "";
}
function ho() {
  return !1;
}
function dr(e, t, r) {
  return (
    /** @type {T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : Element} */
    document.createElementNS(t ?? un, e, void 0)
  );
}
function nt(e) {
  if (
    /** @type {string} */
    e.nodeValue.length < 65536
  )
    return;
  let t = e.nextSibling;
  for (; t !== null && t.nodeType === Pe; )
    t.remove(), e.nodeValue += /** @type {string} */
    t.nodeValue, t = e.nextSibling;
}
function xt(e) {
  var t = v, r = g;
  M(null), U(null);
  try {
    return e();
  } finally {
    M(t), U(r);
  }
}
function pr(e) {
  g === null && (v === null && en(), Qr()), ie && Jr();
}
function Pn(e, t) {
  var r = t.last;
  r === null ? t.last = t.first = e : (r.next = e, e.prev = r, t.last = e);
}
function z(e, t) {
  var r = g;
  r !== null && (r.f & N) !== 0 && (e |= N);
  var n = {
    ctx: A,
    deps: null,
    nodes: null,
    f: e | x | O,
    first: null,
    fn: t,
    last: null,
    next: null,
    parent: r,
    b: r && r.b,
    prev: null,
    teardown: null,
    wv: 0,
    ac: null
  };
  _?.register_created_effect(n);
  var i = n;
  if ((e & ke) !== 0)
    be !== null ? be.push(n) : X.ensure().schedule(n);
  else if (t !== null) {
    try {
      Ae(n);
    } catch (s) {
      throw j(n), s;
    }
    i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && // either `null`, or a singular child
    (i.f & pe) === 0 && (i = i.first, (e & P) !== 0 && (e & Ie) !== 0 && i !== null && (i.f |= Ie));
  }
  if (i !== null && (i.parent = r, r !== null && Pn(i, r), v !== null && (v.f & $) !== 0 && (e & K) === 0)) {
    var o = (
      /** @type {Derived} */
      v
    );
    (o.effects ??= []).push(i);
  }
  return n;
}
function $t() {
  return v !== null && !D;
}
function gr(e) {
  const t = z(ze, null);
  return w(t, k), t.teardown = e, t;
}
function po(e) {
  pr();
  var t = (
    /** @type {Effect} */
    g.f
  ), r = !v && (t & B) !== 0 && (t & oe) === 0;
  if (r) {
    var n = (
      /** @type {ComponentContext} */
      A
    );
    (n.e ??= []).push(e);
  } else
    return vr(e);
}
function vr(e) {
  return z(ke | Vt, e);
}
function go(e) {
  return pr(), z(ze | Vt, e);
}
function Ln(e) {
  X.ensure();
  const t = z(K | pe, e);
  return () => {
    j(t);
  };
}
function Dn(e) {
  X.ensure();
  const t = z(K | pe, e);
  return (r = {}) => new Promise((n) => {
    r.outro ? Ve(t, () => {
      j(t), n(void 0);
    }) : (j(t), n(void 0));
  });
}
function vo(e) {
  return z(ke, e);
}
function jn(e) {
  return z(we | pe, e);
}
function _r(e, t = 0) {
  return z(ze | t, e);
}
function _o(e, t = [], r = [], n = []) {
  Cn(n, t, r, (i) => {
    z(ze, () => e(...i.map(G)));
  });
}
function Hn(e, t = 0) {
  var r = z(P | t, e);
  return r;
}
function bo(e, t = 0) {
  var r = z(_t | t, e);
  return r;
}
function se(e) {
  return z(B | pe, e);
}
function br(e) {
  var t = e.teardown;
  if (t !== null) {
    const r = ie, n = v;
    Lt(!0), M(null);
    try {
      t.call(null);
    } finally {
      Lt(r), M(n);
    }
  }
}
function At(e, t = !1) {
  var r = e.first;
  for (e.first = e.last = null; r !== null; ) {
    const i = r.ac;
    i !== null && xt(() => {
      i.abort(et);
    });
    var n = r.next;
    (r.f & K) !== 0 ? r.parent = null : j(r, t), r = n;
  }
}
function Fn(e) {
  for (var t = e.first; t !== null; ) {
    var r = t.next;
    (t.f & B) === 0 && j(t), t = r;
  }
}
function j(e, t = !0) {
  var r = !1;
  (t || (e.f & Ur) !== 0) && e.nodes !== null && e.nodes.end !== null && (qn(
    e.nodes.start,
    /** @type {TemplateNode} */
    e.nodes.end
  ), r = !0), w(e, Ot), At(e, t && !r), Me(e, 0);
  var n = e.nodes && e.nodes.t;
  if (n !== null)
    for (const o of n)
      o.stop();
  br(e), e.f ^= Ot, e.f |= q;
  var i = e.parent;
  i !== null && i.first !== null && mr(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function qn(e, t) {
  for (; e !== null; ) {
    var r = e === t ? null : /* @__PURE__ */ J(e);
    e.remove(), e = r;
  }
}
function mr(e) {
  var t = e.parent, r = e.prev, n = e.next;
  r !== null && (r.next = n), n !== null && (n.prev = r), t !== null && (t.first === e && (t.first = n), t.last === e && (t.last = r));
}
function Ve(e, t, r = !0) {
  var n = [];
  wr(e, n, !0);
  var i = () => {
    r && j(e), t && t();
  }, o = n.length;
  if (o > 0) {
    var s = () => --o || i();
    for (var l of n)
      l.out(s);
  } else
    i();
}
function wr(e, t, r) {
  if ((e.f & N) === 0) {
    e.f ^= N;
    var n = e.nodes && e.nodes.t;
    if (n !== null)
      for (const l of n)
        (l.is_global || r) && t.push(l);
    for (var i = e.first; i !== null; ) {
      var o = i.next;
      if ((i.f & K) === 0) {
        var s = (i.f & Ie) !== 0 || // If this is a branch effect without a block effect parent,
        // it means the parent block effect was pruned. In that case,
        // transparency information was transferred to the branch effect.
        (i.f & B) !== 0 && (e.f & P) !== 0;
        wr(i, t, s ? r : !1);
      }
      i = o;
    }
  }
}
function mo(e) {
  yr(e, !0);
}
function yr(e, t) {
  if ((e.f & N) !== 0) {
    e.f ^= N, (e.f & k) === 0 && (w(e, x), X.ensure().schedule(e));
    for (var r = e.first; r !== null; ) {
      var n = r.next, i = (r.f & Ie) !== 0 || (r.f & B) !== 0;
      yr(r, i ? t : !1), r = n;
    }
    var o = e.nodes && e.nodes.t;
    if (o !== null)
      for (const s of o)
        (s.is_global || t) && s.in();
  }
}
function Bn(e, t) {
  if (e.nodes)
    for (var r = e.nodes.start, n = e.nodes.end; r !== null; ) {
      var i = r === n ? null : /* @__PURE__ */ J(r);
      t.append(r), r = i;
    }
}
let Ue = !1, ie = !1;
function Lt(e) {
  ie = e;
}
let v = null, D = !1;
function M(e) {
  v = e;
}
let g = null;
function U(e) {
  g = e;
}
let I = null;
function kr(e) {
  v !== null && (I === null ? I = [e] : I.push(e));
}
let S = null, T = 0, R = null;
function Vn(e) {
  R = e;
}
let Er = 1, le = 0, he = le;
function Dt(e) {
  he = e;
}
function xr() {
  return ++Er;
}
function je(e) {
  var t = e.f;
  if ((t & x) !== 0)
    return !0;
  if (t & $ && (e.f &= ~de), (t & V) !== 0) {
    for (var r = (
      /** @type {Value[]} */
      e.deps
    ), n = r.length, i = 0; i < n; i++) {
      var o = r[i];
      if (je(
        /** @type {Derived} */
        o
      ) && sr(
        /** @type {Derived} */
        o
      ), o.wv > e.wv)
        return !0;
    }
    (t & O) !== 0 && // During time traveling we don't want to reset the status so that
    // traversal of the graph in the other batches still happens
    L === null && w(e, k);
  }
  return !1;
}
function $r(e, t, r = !0) {
  var n = e.reactions;
  if (n !== null && !(I !== null && ye.call(I, e)))
    for (var i = 0; i < n.length; i++) {
      var o = n[i];
      (o.f & $) !== 0 ? $r(
        /** @type {Derived} */
        o,
        t,
        !1
      ) : t === o && (r ? w(o, x) : (o.f & k) !== 0 && w(o, V), yt(
        /** @type {Effect} */
        o
      ));
    }
}
function Ar(e) {
  var t = S, r = T, n = R, i = v, o = I, s = A, l = D, a = he, c = e.f;
  S = /** @type {null | Value[]} */
  null, T = 0, R = null, v = (c & (B | K)) === 0 ? e : null, I = null, xe(e.ctx), D = !1, he = ++le, e.ac !== null && (xt(() => {
    e.ac.abort(et);
  }), e.ac = null);
  try {
    e.f |= Xe;
    var u = (
      /** @type {Function} */
      e.fn
    ), f = u();
    e.f |= oe;
    var h = e.deps, d = _?.is_fork;
    if (S !== null) {
      var p;
      if (d || Me(e, T), h !== null && T > 0)
        for (h.length = T + S.length, p = 0; p < S.length; p++)
          h[T + p] = S[p];
      else
        e.deps = h = S;
      if ($t() && (e.f & O) !== 0)
        for (p = T; p < h.length; p++)
          (h[p].reactions ??= []).push(e);
    } else !d && h !== null && T < h.length && (Me(e, T), h.length = T);
    if (Xt() && R !== null && !D && h !== null && (e.f & ($ | V | x)) === 0)
      for (p = 0; p < /** @type {Source[]} */
      R.length; p++)
        $r(
          R[p],
          /** @type {Effect} */
          e
        );
    if (i !== null && i !== e) {
      if (le++, i.deps !== null)
        for (let m = 0; m < r; m += 1)
          i.deps[m].rv = le;
      if (t !== null)
        for (const m of t)
          m.rv = le;
      R !== null && (n === null ? n = R : n.push(.../** @type {Source[]} */
      R));
    }
    return (e.f & re) !== 0 && (e.f ^= re), f;
  } catch (m) {
    return Jt(m);
  } finally {
    e.f ^= Xe, S = t, T = r, R = n, v = i, I = o, xe(s), D = l, he = a;
  }
}
function Un(e, t) {
  let r = t.reactions;
  if (r !== null) {
    var n = Dr.call(r, e);
    if (n !== -1) {
      var i = r.length - 1;
      i === 0 ? r = t.reactions = null : (r[n] = r[i], r.pop());
    }
  }
  if (r === null && (t.f & $) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
  // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
  // allows us to skip the expensive work of disconnecting and immediately reconnecting it
  (S === null || !ye.call(S, t))) {
    var o = (
      /** @type {Derived} */
      t
    );
    (o.f & O) !== 0 && (o.f ^= O, o.f &= ~de), o.v !== E && mt(o), Nn(o), Me(o, 0);
  }
}
function Me(e, t) {
  var r = e.deps;
  if (r !== null)
    for (var n = t; n < r.length; n++)
      Un(e, r[n]);
}
function Ae(e) {
  var t = e.f;
  if ((t & q) === 0) {
    w(e, k);
    var r = g, n = Ue;
    g = e, Ue = !0;
    try {
      (t & (P | _t)) !== 0 ? Fn(e) : At(e), br(e);
      var i = Ar(e);
      e.teardown = typeof i == "function" ? i : null, e.wv = Er;
      var o;
      Ft && vn && (e.f & x) !== 0 && e.deps;
    } finally {
      Ue = n, g = r;
    }
  }
}
async function wo() {
  await Promise.resolve(), tr();
}
function G(e) {
  var t = e.f, r = (t & $) !== 0;
  if (v !== null && !D) {
    var n = g !== null && (g.f & q) !== 0;
    if (!n && (I === null || !ye.call(I, e))) {
      var i = v.deps;
      if ((v.f & Xe) !== 0)
        e.rv < le && (e.rv = le, S === null && i !== null && i[T] === e ? T++ : S === null ? S = [e] : S.push(e));
      else {
        (v.deps ??= []).push(e);
        var o = e.reactions;
        o === null ? e.reactions = [v] : ye.call(o, v) || o.push(v);
      }
    }
  }
  if (ie && fe.has(e))
    return fe.get(e);
  if (r) {
    var s = (
      /** @type {Derived} */
      e
    );
    if (ie) {
      var l = s.v;
      return ((s.f & k) === 0 && s.reactions !== null || Cr(s)) && (l = Et(s)), fe.set(s, l), l;
    }
    var a = (s.f & O) === 0 && !D && v !== null && (Ue || (v.f & O) !== 0), c = (s.f & oe) === 0;
    je(s) && (a && (s.f |= O), sr(s)), a && !c && (ar(s), Sr(s));
  }
  if (L?.has(e))
    return L.get(e);
  if ((e.f & re) !== 0)
    throw e.v;
  return e.v;
}
function Sr(e) {
  if (e.f |= O, e.deps !== null)
    for (const t of e.deps)
      (t.reactions ??= []).push(e), (t.f & $) !== 0 && (t.f & O) === 0 && (ar(
        /** @type {Derived} */
        t
      ), Sr(
        /** @type {Derived} */
        t
      ));
}
function Cr(e) {
  if (e.v === E) return !0;
  if (e.deps === null) return !1;
  for (const t of e.deps)
    if (fe.has(t) || (t.f & $) !== 0 && Cr(
      /** @type {Derived} */
      t
    ))
      return !0;
  return !1;
}
function Wn(e) {
  var t = D;
  try {
    return D = !0, e();
  } finally {
    D = t;
  }
}
function yo(e) {
  if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
    if (ce in e)
      dt(e);
    else if (!Array.isArray(e))
      for (let t in e) {
        const r = e[t];
        typeof r == "object" && r && ce in r && dt(r);
      }
  }
}
function dt(e, t = /* @__PURE__ */ new Set()) {
  if (typeof e == "object" && e !== null && // We don't want to traverse DOM elements
  !(e instanceof EventTarget) && !t.has(e)) {
    t.add(e), e instanceof Date && e.getTime();
    for (let n in e)
      try {
        dt(e[n], t);
      } catch {
      }
    const r = qt(e);
    if (r !== Object.prototype && r !== Array.prototype && r !== Map.prototype && r !== Set.prototype && r !== Date.prototype) {
      const n = Hr(r);
      for (let i in n) {
        const o = n[i].get;
        if (o)
          try {
            o.call(e);
          } catch {
          }
      }
    }
  }
}
function ko(e) {
  return e.endsWith("capture") && e !== "gotpointercapture" && e !== "lostpointercapture";
}
const Yn = [
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
function Eo(e) {
  return Yn.includes(e);
}
const Gn = {
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
function xo(e) {
  return e = e.toLowerCase(), Gn[e] ?? e;
}
const Kn = ["touchstart", "touchmove"];
function Xn(e) {
  return Kn.includes(e);
}
const Zn = (
  /** @type {const} */
  ["textarea", "script", "style", "title"]
);
function $o(e) {
  return Zn.includes(
    /** @type {typeof RAW_TEXT_ELEMENTS[number]} */
    e
  );
}
const Te = Symbol("events"), Tr = /* @__PURE__ */ new Set(), pt = /* @__PURE__ */ new Set();
function Ao(e) {
  if (!y) return;
  e.removeAttribute("onload"), e.removeAttribute("onerror");
  const t = e.__e;
  t !== void 0 && (e.__e = void 0, queueMicrotask(() => {
    e.isConnected && e.dispatchEvent(t);
  }));
}
function Rr(e, t, r, n = {}) {
  function i(o) {
    if (n.capture || gt.call(t, o), !o.cancelBubble)
      return xt(() => r?.call(this, o));
  }
  return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? ue(() => {
    t.addEventListener(e, i, n);
  }) : t.addEventListener(e, i, n), i;
}
function So(e, t, r, n = {}) {
  var i = Rr(t, e, r, n);
  return () => {
    e.removeEventListener(t, i, n);
  };
}
function Co(e, t, r, n, i) {
  var o = { capture: n, passive: i }, s = Rr(e, t, r, o);
  (t === document.body || // @ts-ignore
  t === window || // @ts-ignore
  t === document || // Firefox has quirky behavior, it can happen that we still get "canplay" events when the element is already removed
  t instanceof HTMLMediaElement) && gr(() => {
    t.removeEventListener(e, s, o);
  });
}
function To(e, t, r) {
  (t[Te] ??= {})[e] = r;
}
function Ro(e) {
  for (var t = 0; t < e.length; t++)
    Tr.add(e[t]);
  for (var r of pt)
    r(e);
}
let jt = null;
function gt(e) {
  var t = this, r = (
    /** @type {Node} */
    t.ownerDocument
  ), n = e.type, i = e.composedPath?.() || [], o = (
    /** @type {null | Element} */
    i[0] || e.target
  );
  jt = e;
  var s = 0, l = jt === e && e[Te];
  if (l) {
    var a = i.indexOf(l);
    if (a !== -1 && (t === document || t === /** @type {any} */
    window)) {
      e[Te] = t;
      return;
    }
    var c = i.indexOf(t);
    if (c === -1)
      return;
    a <= c && (s = a);
  }
  if (o = /** @type {Element} */
  i[s] || e.target, o !== t) {
    Ge(e, "currentTarget", {
      configurable: !0,
      get() {
        return o || r;
      }
    });
    var u = v, f = g;
    M(null), U(null);
    try {
      for (var h, d = []; o !== null; ) {
        var p = o.assignedSlot || o.parentNode || /** @type {any} */
        o.host || null;
        try {
          var m = o[Te]?.[n];
          m != null && (!/** @type {any} */
          o.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
          // -> the target could not have been disabled because it emits the event in the first place
          e.target === o) && m.call(o, e);
        } catch (C) {
          h ? d.push(C) : h = C;
        }
        if (e.cancelBubble || p === t || p === null)
          break;
        o = p;
      }
      if (h) {
        for (let C of d)
          queueMicrotask(() => {
            throw C;
          });
        throw h;
      }
    } finally {
      e[Te] = t, delete e.currentTarget, M(u), U(f);
    }
  }
}
const Jn = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", {
    /** @param {string} html */
    createHTML: (e) => e
  })
);
function Qn(e) {
  return (
    /** @type {string} */
    Jn?.createHTML(e) ?? e
  );
}
function ei(e) {
  var t = dr("template");
  return t.innerHTML = Qn(e.replaceAll("<!>", "<!---->")), t.content;
}
function ne(e, t) {
  var r = (
    /** @type {Effect} */
    g
  );
  r.nodes === null && (r.nodes = { start: e, end: t, a: null, t: null });
}
// @__NO_SIDE_EFFECTS__
function Oo(e, t) {
  var r = (t & ln) !== 0, n = (t & cn) !== 0, i, o = !e.startsWith("<!>");
  return () => {
    if (y)
      return ne(b, null), b;
    i === void 0 && (i = ei(o ? e : "<!>" + e), r || (i = /** @type {TemplateNode} */
    /* @__PURE__ */ $e(i)));
    var s = (
      /** @type {TemplateNode} */
      n || ur ? document.importNode(i, !0) : i.cloneNode(!0)
    );
    if (r) {
      var l = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ $e(s)
      ), a = (
        /** @type {TemplateNode} */
        s.lastChild
      );
      ne(l, a);
    } else
      ne(s, s);
    return s;
  };
}
function No(e = "") {
  if (!y) {
    var t = Z(e + "");
    return ne(t, t), t;
  }
  var r = b;
  return r.nodeType !== Pe ? (r.before(r = Z()), H(r)) : nt(
    /** @type {Text} */
    r
  ), ne(r, r), r;
}
function Io() {
  if (y)
    return ne(b, null), b;
  var e = document.createDocumentFragment(), t = document.createComment(""), r = Z();
  return e.append(t, r), ne(t, r), e;
}
function ti(e, t) {
  if (y) {
    var r = (
      /** @type {Effect & { nodes: EffectNodes }} */
      g
    );
    ((r.f & oe) === 0 || r.nodes.end === null) && (r.nodes.end = b), bt();
    return;
  }
  e !== null && e.before(
    /** @type {Node} */
    t
  );
}
function Mo() {
  if (y && b && b.nodeType === Le && b.textContent?.startsWith("$")) {
    const e = b.textContent.substring(1);
    return bt(), e;
  }
  return (window.__svelte ??= {}).uid ??= 1, `c${window.__svelte.uid++}`;
}
function zo(e, t) {
  var r = t == null ? "" : typeof t == "object" ? `${t}` : t;
  r !== /** @type {any} */
  (e[ct] ??= e.nodeValue) && (e[ct] = r, e.nodeValue = `${r}`);
}
function St(e, t) {
  return Or(e, t);
}
function ri(e, t) {
  ht(), t.intro = t.intro ?? !1;
  const r = t.target, n = y, i = b;
  try {
    for (var o = /* @__PURE__ */ $e(r); o && (o.nodeType !== Le || /** @type {Comment} */
    o.data !== Ut); )
      o = /* @__PURE__ */ J(o);
    if (!o)
      throw Ee;
    He(!0), H(
      /** @type {Comment} */
      o
    );
    const s = Or(e, { ...t, anchor: o });
    return He(!1), /**  @type {Exports} */
    s;
  } catch (s) {
    if (s instanceof Error && s.message.split(`
`).some((l) => l.startsWith("https://svelte.dev/e/")))
      throw s;
    return s !== Ee && console.warn("Failed to hydrate: ", s), t.recover === !1 && rn(), ht(), zn(r), He(!1), St(e, t);
  } finally {
    He(n), H(i);
  }
}
const qe = /* @__PURE__ */ new Map();
function Or(e, { target: t, anchor: r, props: n = {}, events: i, context: o, intro: s = !0, transformError: l }) {
  ht();
  var a = void 0, c = Dn(() => {
    var u = r ?? t.appendChild(Z());
    An(
      /** @type {TemplateNode} */
      u,
      {
        pending: () => {
        }
      },
      (d) => {
        _n({});
        var p = (
          /** @type {ComponentContext} */
          A
        );
        if (o && (p.c = o), i && (n.$$events = i), y && ne(
          /** @type {TemplateNode} */
          d,
          null
        ), a = e(d, n) || {}, y && (g.nodes.end = b, b === null || b.nodeType !== Le || /** @type {Comment} */
        b.data !== Yt))
          throw tt(), Ee;
        bn();
      },
      l
    );
    var f = /* @__PURE__ */ new Set(), h = (d) => {
      for (var p = 0; p < d.length; p++) {
        var m = d[p];
        if (!f.has(m)) {
          f.add(m);
          var C = Xn(m);
          for (const it of [t, document]) {
            var W = qe.get(it);
            W === void 0 && (W = /* @__PURE__ */ new Map(), qe.set(it, W));
            var ge = W.get(m);
            ge === void 0 ? (it.addEventListener(m, gt, { passive: C }), W.set(m, 1)) : W.set(m, ge + 1);
          }
        }
      }
    };
    return h(jr(Tr)), pt.add(h), () => {
      for (var d of f)
        for (const C of [t, document]) {
          var p = (
            /** @type {Map<string, number>} */
            qe.get(C)
          ), m = (
            /** @type {number} */
            p.get(d)
          );
          --m == 0 ? (C.removeEventListener(d, gt), p.delete(d), p.size === 0 && qe.delete(C)) : p.set(d, m);
        }
      pt.delete(h), u !== r && u.parentNode?.removeChild(u);
    };
  });
  return vt.set(a, c), a;
}
let vt = /* @__PURE__ */ new WeakMap();
function Nr(e, t) {
  const r = vt.get(e);
  return r ? (vt.delete(e), r(t)) : Promise.resolve();
}
function ni(e) {
  return new ii(e);
}
class ii {
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
    var r = /* @__PURE__ */ new Map(), n = (o, s) => {
      var l = /* @__PURE__ */ In(s, !1, !1);
      return r.set(o, l), l;
    };
    const i = new Proxy(
      { ...t.props || {}, $$events: {} },
      {
        get(o, s) {
          return G(r.get(s) ?? n(s, Reflect.get(o, s)));
        },
        has(o, s) {
          return s === Wr ? !0 : (G(r.get(s) ?? n(s, Reflect.get(o, s))), Reflect.has(o, s));
        },
        set(o, s, l) {
          return ee(r.get(s) ?? n(s, l), l), Reflect.set(o, s, l);
        }
      }
    );
    this.#t = (t.hydrate ? ri : St)(t.component, {
      target: t.target,
      anchor: t.anchor,
      props: i,
      context: t.context,
      intro: t.intro ?? !1,
      recover: t.recover,
      transformError: t.transformError
    }), (!t?.props?.$$host || t.sync === !1) && tr(), this.#e = i.$$events;
    for (const o of Object.keys(this.#t))
      o === "$set" || o === "$destroy" || o === "$on" || Ge(this, o, {
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
      Nr(this.#t);
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
  $on(t, r) {
    this.#e[t] = this.#e[t] || [];
    const n = (...i) => r.call(this, ...i);
    return this.#e[t].push(n), () => {
      this.#e[t] = this.#e[t].filter(
        /** @param {any} fn */
        (i) => i !== n
      );
    };
  }
  $destroy() {
    this.#t.$destroy();
  }
}
let Ir;
typeof HTMLElement == "function" && (Ir = class extends HTMLElement {
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
  constructor(e, t, r) {
    super(), this.$$ctor = e, this.$$s = t, r && (this.$$shadowRoot = this.attachShadow(r));
  }
  /**
   * @param {string} type
   * @param {EventListenerOrEventListenerObject} listener
   * @param {boolean | AddEventListenerOptions} [options]
   */
  addEventListener(e, t, r) {
    if (this.$$l[e] = this.$$l[e] || [], this.$$l[e].push(t), this.$$c) {
      const n = this.$$c.$on(e, t);
      this.$$l_u.set(t, n);
    }
    super.addEventListener(e, t, r);
  }
  /**
   * @param {string} type
   * @param {EventListenerOrEventListenerObject} listener
   * @param {boolean | AddEventListenerOptions} [options]
   */
  removeEventListener(e, t, r) {
    if (super.removeEventListener(e, t, r), this.$$c) {
      const n = this.$$l_u.get(t);
      n && (n(), this.$$l_u.delete(t));
    }
  }
  async connectedCallback() {
    if (this.$$cn = !0, !this.$$c) {
      let e = function(n) {
        return (i) => {
          const o = dr("slot");
          n !== "default" && (o.name = n), ti(i, o);
        };
      };
      if (await Promise.resolve(), !this.$$cn || this.$$c)
        return;
      const t = {}, r = oi(this);
      for (const n of this.$$s)
        n in r && (n === "default" && !this.$$d.children ? (this.$$d.children = e(n), t.default = !0) : t[n] = e(n));
      for (const n of this.attributes) {
        const i = this.$$g_p(n.name);
        i in this.$$d || (this.$$d[i] = We(i, n.value, this.$$p_d, "toProp"));
      }
      for (const n in this.$$p_d)
        !(n in this.$$d) && this[n] !== void 0 && (this.$$d[n] = this[n], delete this[n]);
      this.$$c = ni({
        component: this.$$ctor,
        target: this.$$shadowRoot || this,
        props: {
          ...this.$$d,
          $$slots: t,
          $$host: this
        }
      }), this.$$me = Ln(() => {
        _r(() => {
          this.$$r = !0;
          for (const n of Ye(this.$$c)) {
            if (!this.$$p_d[n]?.reflect) continue;
            this.$$d[n] = this.$$c[n];
            const i = We(
              n,
              this.$$d[n],
              this.$$p_d,
              "toAttribute"
            );
            i == null ? this.removeAttribute(this.$$p_d[n].attribute || n) : this.setAttribute(this.$$p_d[n].attribute || n, i);
          }
          this.$$r = !1;
        });
      });
      for (const n in this.$$l)
        for (const i of this.$$l[n]) {
          const o = this.$$c.$on(n, i);
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
  attributeChangedCallback(e, t, r) {
    this.$$r || (e = this.$$g_p(e), this.$$d[e] = We(e, r, this.$$p_d, "toProp"), this.$$c?.$set({ [e]: this.$$d[e] }));
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
    return Ye(this.$$p_d).find(
      (t) => this.$$p_d[t].attribute === e || !this.$$p_d[t].attribute && t.toLowerCase() === e
    ) || e;
  }
});
function We(e, t, r, n) {
  const i = r[e]?.type;
  if (t = i === "Boolean" && typeof t != "boolean" ? t != null : t, !n || !r[e])
    return t;
  if (n === "toAttribute")
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
function oi(e) {
  const t = {};
  return e.childNodes.forEach((r) => {
    t[
      /** @type {Element} node */
      r.slot || "default"
    ] = !0;
  }), t;
}
function Po(e, t, r, n, i, o) {
  let s = class extends Ir {
    constructor() {
      super(e, r, i), this.$$p_d = t;
    }
    static get observedAttributes() {
      return Ye(t).map(
        (l) => (t[l].attribute || l).toLowerCase()
      );
    }
  };
  return Ye(t).forEach((l) => {
    Ge(s.prototype, l, {
      get() {
        return this.$$c && l in this.$$c ? this.$$c[l] : this.$$d[l];
      },
      set(a) {
        a = We(l, a, t), this.$$d[l] = a;
        var c = this.$$c;
        if (c) {
          var u = me(c, l)?.get;
          u ? c[l] = a : c.$set({ [l]: a });
        }
      }
    });
  }), n.forEach((l) => {
    Ge(s.prototype, l, {
      get() {
        return this.$$c?.[l];
      }
    });
  }), e.element = /** @type {any} */
  s, s;
}
let Mr;
const si = "ehagaki.web-component.v1:", _e = /* @__PURE__ */ new Map(), ai = {
  get length() {
    return _e.size;
  },
  clear() {
    _e.clear();
  },
  getItem(e) {
    return _e.get(e) ?? null;
  },
  key(e) {
    return [..._e.keys()][e] ?? null;
  },
  removeItem(e) {
    _e.delete(e);
  },
  setItem(e, t) {
    _e.set(e, String(t));
  }
};
function li() {
  if (typeof globalThis < "u") {
    const e = globalThis.localStorage;
    if (e)
      return e;
  }
  return ai;
}
function ci() {
  return Mr ?? li();
}
function ui(e) {
  Mr = e;
}
function at(e, t) {
  const r = [];
  for (let n = 0; n < e.length; n += 1) {
    const i = e.key(n);
    i?.startsWith(t) && r.push(i.slice(t.length));
  }
  return r;
}
function fi(e, t) {
  return {
    get length() {
      return at(e, t).length;
    },
    clear() {
      const r = at(e, t);
      for (const n of r)
        e.removeItem(`${t}${n}`);
    },
    getItem(r) {
      return e.getItem(`${t}${r}`);
    },
    key(r) {
      return at(e, t)[r] ?? null;
    },
    removeItem(r) {
      e.removeItem(`${t}${r}`);
    },
    setItem(r, n) {
      e.setItem(`${t}${r}`, String(n));
    }
  };
}
function hi(e) {
  return fi(
    e,
    si
  );
}
function di() {
  return {
    style: {
      setProperty: () => {
      },
      removeProperty: () => "",
      getPropertyValue: () => ""
    }
  };
}
function pi() {
  const e = typeof window < "u" ? window : void 0, t = e?.document, r = t?.documentElement ?? di(), n = t?.body ?? r;
  return {
    storage: ci(),
    window: e,
    document: t,
    domRoot: t,
    styleTarget: r,
    layoutTarget: n,
    overlayTarget: n,
    themeTarget: r,
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
let Re = pi();
function gi(e) {
  return Re = {
    ...Re,
    ...e
  }, ui(Re.storage), Re;
}
function Lo() {
  return Re;
}
const vi = ":root{--app-root-height: 100%;--app-root-top: 0px;--app-root-overflow-y: visible;--app-main-height: 100svh;--app-body-position: static;--app-body-inset: auto;--app-body-width: auto;--app-overlay-position: fixed;--app-overscroll-behavior: auto;--footer-height: 66px;--footer-bottom: 0px;--keyboard-height: 0px;--mobile-dialog-viewport-top: 0px;--mobile-dialog-viewport-height: 100dvh;--mobile-dialog-center-y: 43dvh;--keyboard-button-bar-height: 50px;--keyboard-button-bar-bottom: 66px;--main-content-keyboard-adjustment: var(--keyboard-height);--reason-input-base-height: 50px;--reason-input-height: 0px;--reason-input-bottom: 116px;--main-content-top-spacing: 6px;--composer-bottom-reserved-height: 116px;--accent-color-default: hsl(152, 74%, 43%);--accent-color: var(--accent-color-default);--theme: var(--accent-color);--text-black: hsl(0, 0%, 24%);--nostr-bg: hsl(270, 100%, 98%);--yellow: hsl(50, 100%, 50%);--danger: hsl(0, 84%, 60%);--darker: rgba(0, 0, 0, .8);--dark-gray: hsl(0, 0%, 66%);--light-gray: hsl(0, 0%, 83%);--surface-bg: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 94%)) 18%, hsl(0, 0%, 94%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 12%)) 18%, hsl(0, 0%, 12%)) );--surface-input: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 100%)) 14%, hsl(0, 0%, 100%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 19%)) 14%, hsl(0, 0%, 19%)) );--surface-editor: var(--surface-input);--surface-footer: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 82%)) 22%, hsl(0, 0%, 82%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 10%)) 22%, hsl(0, 0%, 10%)) );--surface-buttonbar: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 91%)) 20%, hsl(0, 0%, 91%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 28%)) 20%, hsl(0, 0%, 28%)) );--surface-button: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 92%)) 18%, hsl(0, 0%, 92%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 25%)) 18%, hsl(0, 0%, 25%)) );--surface-button-border: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 75%)) 24%, hsl(0, 0%, 75%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 30%)) 24%, hsl(0, 0%, 30%)) );--surface-button-preview-action: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 74%)) 22%, hsl(0, 0%, 74%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 36%)) 22%, hsl(0, 0%, 36%)) );--surface-border: light-dark( color-mix(in srgb, var(--base-color, var(--light-gray)) 24%, var(--light-gray)), color-mix(in srgb, var(--base-color, dimgray) 24%, dimgray) );--surface-border-hr: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 84%)) 20%, hsl(0, 0%, 84%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 30%)) 20%, hsl(0, 0%, 30%)) );--surface-border-hr-light: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 92%)) 16%, hsl(0, 0%, 92%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 20%)) 16%, hsl(0, 0%, 20%)) );--surface-dialog: light-dark( color-mix(in srgb, var(--base-color, white) 14%, white), color-mix(in srgb, var(--base-color, hsl(0, 0%, 14%)) 14%, hsl(0, 0%, 14%)) );--surface-window: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 95%)) 14%, hsl(0, 0%, 95%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 14%)) 14%, hsl(0, 0%, 14%)) );--bg: var(--surface-bg);--bg-input: var(--surface-input);--bg-footer: var(--surface-footer);--bg-translucent: light-dark(#EDEDEDcc, #212121cc);--bg-buttonbar: var(--surface-buttonbar);--footer-buttonbar-bg: var(--bg-buttonbar);--btn-bg: var(--surface-button);--btn-bg2: light-dark(color-mix(in srgb, var(--btn-bg), black 6%), color-mix(in srgb, var(--btn-bg), white 10%));--btn-bg3: light-dark(color-mix(in srgb, var(--btn-bg), black 11%), color-mix(in srgb, var(--btn-bg), white 20%));--btn-border: var(--surface-button-border);--btn-hover-bg: light-dark(rgba(50, 50, 50, .12), rgba(255, 255, 255, .12));--btn-post-preview-action: var(--surface-button-preview-action);--border: var(--surface-border);--border-hr: var(--surface-border-hr);--border-hr-light: var(--surface-border-hr-light);--semantic-text: light-dark(hsl(0, 0%, 24%), hsl(0, 0%, 90%));--text: var(--semantic-text);--text-light: light-dark(hsl(0, 0%, 46%), hsl(0, 0%, 75%));--text-muted: light-dark(hsl(0, 0%, 60%), hsl(0, 0%, 55%));--text-red: light-dark(hsl(0, 99%, 45%), hsl(0, 99%, 69%));--text-r: light-dark(#e6e6e6, #3D3D3D);--semantic-link: light-dark(#1a0dab, #99c3ff);--link: var(--semantic-link);--link-visited: light-dark(#681da8, #c58af9);--dialog-bg: var(--surface-dialog);--dialog-bg2: light-dark(color-mix(in srgb, var(--dialog-bg), black 6%), color-mix(in srgb, var(--dialog-bg), white 10%));--dialog-bg3: light-dark(color-mix(in srgb, var(--dialog-bg), black 11%), color-mix(in srgb, var(--dialog-bg), white 16%));--dialog-bg-overlay: light-dark(rgba(0, 0, 0, .6), rgba(0, 0, 0, .8));--window: var(--surface-window);--svg: light-dark(hsl(0, 0%, 36%), hsl(0, 0%, 90%));--svg-light: var(--text-light);--shadow: light-dark(rgba(0, 0, 0, .1), rgba(255, 255, 255, .1));--hagaki: light-dark(hsl(0, 77%, 56%), hsl(5, 99%, 71%));--hashtag-text: light-dark(#106BC7, #65B1FC);--hashtag-bg: light-dark(#106BC71a, #65B1FC1a);--toggle-bg: var(--svg);--toggle-circle: var(--dialog-bg);--message-success-bg: hsl(200, 39%, 96%);--message-success-color: hsl(210, 60%, 40%);--message-success-border: hsl(210, 48%, 70%);--message-error-bg: hsl(351, 99%, 96%);--message-error-color: hsl(351, 99%, 32%);--message-error-border: hsl(351, 99%, 70%);--message-warning-bg: hsl(38, 100%, 95%);--message-warning-color: hsl(30, 90%, 35%);--message-warning-border: hsl(38, 90%, 65%);--message-flavor-bg: hsl(125, 39%, 94%);--message-flavor-color: hsl(123, 46%, 32%);--message-flavor-border: hsl(125, 39%, 70%);--message-tips-bg: hsl(270, 50%, 96%);--message-tips-color: hsl(270, 55%, 38%);--message-tips-border: hsl(270, 45%, 70%);font-family:system-ui,-apple-system,Segoe UI,Hiragino Sans,Hiragino Kaku Gothic ProN,Meiryo,sans-serif;font-weight:400;color-scheme:light dark;color:var(--text);background-color:var(--bg);font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}html[data-base-color-set=true]{--surface-bg: light-dark( color-mix(in srgb, var(--base-color) 18%, hsl(0, 0%, 97%)), color-mix(in srgb, var(--base-color) 18%, hsl(0, 0%, 12%)) );--surface-editor: light-dark( color-mix(in srgb, var(--base-color) 6%, hsl(0, 0%, 100%)), color-mix(in srgb, var(--base-color) 9%, hsl(0, 0%, 22%)) );--surface-footer: light-dark( color-mix(in srgb, var(--base-color) 34%, hsl(0, 0%, 86%)), color-mix(in srgb, var(--base-color) 22%, hsl(0, 0%, 10%)) );--footer-buttonbar-bg: light-dark(var(--bg), var(--bg-buttonbar))}*{font-family:inherit;box-sizing:border-box}html,body,#app{height:var(--app-root-height);overflow-x:hidden;overflow-y:var(--app-root-overflow-y);overscroll-behavior-y:var(--app-overscroll-behavior)}#app{position:var(--app-body-position);top:var(--app-root-top);left:0;right:0;width:var(--app-body-width)}body{margin:0;position:var(--app-body-position);inset:var(--app-body-inset);width:var(--app-body-width);color:var(--text);background-color:var(--bg);overflow-wrap:anywhere;word-break:auto-phrase;line-break:strict}a{--link-hover-color: light-dark(color-mix(in srgb, var(--link), black 30%), color-mix(in srgb, var(--link), white 30%));font-weight:500;color:var(--link);-webkit-tap-highlight-color:transparent;text-decoration:none;border-radius:6px}a:active{opacity:1}h2,h3{color:var(--text-light)}.card{padding:2em}button,[role=button],select{display:inline-flex;align-items:center;justify-content:center;height:100%;padding:0;font-size:1rem;font-weight:500;line-height:normal;color:var(--text);background-color:inherit;border:none;cursor:pointer;text-decoration:none;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;--button-selected-bg: light-dark(color-mix(in srgb, var(--btn-bg), black 18%), color-mix(in srgb, var(--btn-bg), white 22%));--button-hover-bg: light-dark(color-mix(in srgb, var(--btn-bg), black 4%), color-mix(in srgb, var(--btn-bg), white 5%));--button-hover-color: light-dark(color-mix(in srgb, var(--text), black 40%), color-mix(in srgb, var(--text), white 50%));--button-selected-hover-bg: light-dark(color-mix(in srgb, var(--btn-bg), black 20%), color-mix(in srgb, var(--btn-bg), white 30%));--button-selected-hover-color: light-dark(color-mix(in srgb, var(--text), black 20%), color-mix(in srgb, var(--text), white 30%))}:is(button,[role=button],select):disabled{opacity:.3;cursor:not-allowed}:is(button,[role=button],select):disabled.loading{opacity:1}button>*{pointer-events:none}button:active:not(:disabled),[role=button]:active{scale:.98;transition:scale .1s cubic-bezier(0,1,.5,1)}@media(prefers-reduced-motion:reduce){button:active:not(:disabled),[role=button]:active{scale:1;transition:none}}span{-webkit-tap-highlight-color:transparent}select{border-radius:6px}.svg-icon{-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-size:contain;mask-size:contain;-webkit-mask-position:center;mask-position:center;background-color:var(--svg);display:inline-block;inline-size:var(--icon-size, 28px);block-size:var(--icon-size, 28px);--icon-hover-color: light-dark(color-mix(in srgb, var(--svg), black 40%), color-mix(in srgb, var(--svg), white 50%));--icon-selected-hover-color: light-dark(color-mix(in srgb, var(--svg), black 20%), color-mix(in srgb, var(--svg), white 30%))}.tooltip-content{--tooltip-padding: 12px;--tooltip-font-size: 1rem;--tooltip-line-height: normal;--tooltip-z-index: 100;--tooltip-max-width: none;background:var(--dialog-bg);color:var(--text);border:1px solid var(--border);border-radius:6px;padding:var(--tooltip-padding);font-size:var(--tooltip-font-size);line-height:var(--tooltip-line-height);z-index:var(--tooltip-z-index);max-width:var(--tooltip-max-width)}.post-preview-tooltip-content{--tooltip-z-index: 10000;z-index:10000!important}:root:is(.light,.dark) button.selected:where(:not(:disabled)),:root:is(.light,.dark) button:where([data-state=active]){background-color:var(--button-selected-bg)}@media(hover:hover)and (pointer:fine){a:hover{text-decoration:underline}:root:is(.light,.dark) button:where(:hover:not(:disabled)),:root:is(.light,.dark) [role=button]:where(:hover:not([aria-disabled=true])),:root:is(.light,.dark) select:where(:hover:not(:disabled)){background-color:var(--button-hover-bg);color:var(--button-hover-color)}:is(:root:is(.light,.dark) button:where(:hover:not(:disabled)),:root:is(.light,.dark) [role=button]:where(:hover:not([aria-disabled=true])),:root:is(.light,.dark) select:where(:hover:not(:disabled))) .svg-icon{background-color:var(--icon-hover-color)}:root:is(.light,.dark) button.selected:where(:hover:not(:disabled)),:root:is(.light,.dark) button:where([data-state=active]:hover:not(:disabled)){background-color:var(--button-selected-hover-bg);color:var(--button-selected-hover-color)}:is(:root:is(.light,.dark) button.selected:where(:hover:not(:disabled)),:root:is(.light,.dark) button:where([data-state=active]:hover:not(:disabled))) .svg-icon{background-color:var(--icon-selected-hover-color)}:root:is(.light,.dark) a:hover{color:var(--link-hover-color)}}.setting-section{display:flex;flex-direction:column}.setting-row{display:flex;flex-direction:row;align-items:stretch;justify-content:space-between;min-height:50px}.setting-label{font-size:1rem;font-weight:500;line-height:1.3;display:flex;align-items:center;justify-content:flex-start;white-space:pre-line}.setting-control{display:flex;align-items:stretch;justify-content:flex-end;height:auto;margin-block:auto}", _i = ".pswp{--pswp-bg: #000;--pswp-placeholder-bg: #222;--pswp-root-z-index: 100000;--pswp-preloader-color: rgba(79, 79, 79, .4);--pswp-preloader-color-secondary: rgba(255, 255, 255, .9);--pswp-icon-color: #fff;--pswp-icon-color-secondary: #4f4f4f;--pswp-icon-stroke-color: #4f4f4f;--pswp-icon-stroke-width: 2px;--pswp-error-text-color: var(--pswp-icon-color)}.pswp{position:fixed;top:0;left:0;width:100%;height:100%;z-index:var(--pswp-root-z-index);display:none;touch-action:none;outline:0;opacity:.003;contain:layout style size;-webkit-tap-highlight-color:rgba(0,0,0,0)}.pswp:focus{outline:0}.pswp *{box-sizing:border-box}.pswp img{max-width:none}.pswp--open{display:block}.pswp,.pswp__bg{transform:translateZ(0);will-change:opacity}.pswp__bg{opacity:.005;background:var(--pswp-bg)}.pswp,.pswp__scroll-wrap{overflow:hidden}.pswp__scroll-wrap,.pswp__bg,.pswp__container,.pswp__item,.pswp__content,.pswp__img,.pswp__zoom-wrap{position:absolute;top:0;left:0;width:100%;height:100%}.pswp__img,.pswp__zoom-wrap{width:auto;height:auto}.pswp--click-to-zoom.pswp--zoom-allowed .pswp__img{cursor:-webkit-zoom-in;cursor:-moz-zoom-in;cursor:zoom-in}.pswp--click-to-zoom.pswp--zoomed-in .pswp__img{cursor:move;cursor:-webkit-grab;cursor:-moz-grab;cursor:grab}.pswp--click-to-zoom.pswp--zoomed-in .pswp__img:active{cursor:-webkit-grabbing;cursor:-moz-grabbing;cursor:grabbing}.pswp--no-mouse-drag.pswp--zoomed-in .pswp__img,.pswp--no-mouse-drag.pswp--zoomed-in .pswp__img:active,.pswp__img{cursor:-webkit-zoom-out;cursor:-moz-zoom-out;cursor:zoom-out}.pswp__container,.pswp__img,.pswp__button,.pswp__counter{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.pswp__item{z-index:1;overflow:hidden}.pswp__hidden{display:none!important}.pswp__content{pointer-events:none}.pswp__content>*{pointer-events:auto}.pswp__error-msg-container{display:grid}.pswp__error-msg{margin:auto;font-size:1em;line-height:1;color:var(--pswp-error-text-color)}.pswp .pswp__hide-on-close{opacity:.005;will-change:opacity;transition:opacity var(--pswp-transition-duration) cubic-bezier(.4,0,.22,1);z-index:10;pointer-events:none}.pswp--ui-visible .pswp__hide-on-close{opacity:1;pointer-events:auto}.pswp__button{position:relative;display:block;width:50px;height:60px;padding:0;margin:0;overflow:hidden;cursor:pointer;background:none;border:0;box-shadow:none;opacity:.85;-webkit-appearance:none;-webkit-touch-callout:none}.pswp__button:hover,.pswp__button:active,.pswp__button:focus{transition:none;padding:0;background:none;border:0;box-shadow:none;opacity:1}.pswp__button:disabled{opacity:.3;cursor:auto}.pswp__icn{fill:var(--pswp-icon-color);color:var(--pswp-icon-color-secondary)}.pswp__icn{position:absolute;top:14px;left:9px;width:32px;height:32px;overflow:hidden;pointer-events:none}.pswp__icn-shadow{stroke:var(--pswp-icon-stroke-color);stroke-width:var(--pswp-icon-stroke-width);fill:none}.pswp__icn:focus{outline:0}div.pswp__img--placeholder,.pswp__img--with-bg{background:var(--pswp-placeholder-bg)}.pswp__top-bar{position:absolute;left:0;top:0;width:100%;height:60px;display:flex;flex-direction:row;justify-content:flex-end;z-index:10;pointer-events:none!important}.pswp__top-bar>*{pointer-events:auto;will-change:opacity}.pswp__button--close{margin-right:6px}.pswp__button--arrow{position:absolute;width:75px;height:100px;top:50%;margin-top:-50px}.pswp__button--arrow:disabled{display:none;cursor:default}.pswp__button--arrow .pswp__icn{top:50%;margin-top:-30px;width:60px;height:60px;background:none;border-radius:0}.pswp--one-slide .pswp__button--arrow{display:none}.pswp--touch .pswp__button--arrow{visibility:hidden}.pswp--has_mouse .pswp__button--arrow{visibility:visible}.pswp__button--arrow--prev{right:auto;left:0}.pswp__button--arrow--next{right:0}.pswp__button--arrow--next .pswp__icn{left:auto;right:14px;transform:scaleX(-1)}.pswp__button--zoom{display:none}.pswp--zoom-allowed .pswp__button--zoom{display:block}.pswp--zoomed-in .pswp__zoom-icn-bar-v{display:none}.pswp__preloader{position:relative;overflow:hidden;width:50px;height:60px;margin-right:auto}.pswp__preloader .pswp__icn{opacity:0;transition:opacity .2s linear;animation:pswp-clockwise .6s linear infinite}.pswp__preloader--active .pswp__icn{opacity:.85}@keyframes pswp-clockwise{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.pswp__counter{height:30px;margin-top:15px;margin-inline-start:20px;font-size:14px;line-height:30px;color:var(--pswp-icon-color);text-shadow:1px 1px 3px var(--pswp-icon-color-secondary);opacity:.85}.pswp--one-slide .pswp__counter{display:none}";
function bi(e) {
  return {
    notifyPostSuccess(t = {}) {
      return e.dispatchSafeEvent("ehagaki-post-success", {
        ...t,
        ...t.quotedEventIds ? { quotedEventIds: [...t.quotedEventIds] } : {}
      }), !0;
    },
    notifyPostError(t) {
      const r = typeof t == "object" && t?.code ? t.code : "post_failed";
      return e.dispatchSafeEvent("ehagaki-post-error", { code: r }), !0;
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
const mi = "--ehagaki-icon-", wi = /--ehagaki-icon-([0-9a-f]+)/g;
function yi(e) {
  if (e.length === 0 || e.length % 2 !== 0) return null;
  const t = Array.from(
    { length: e.length / 2 },
    (r, n) => String.fromCharCode(
      Number.parseInt(e.slice(n * 2, n * 2 + 2), 16)
    )
  ).join("");
  return /^[A-Za-z0-9._-]+\.svg$/.test(t) ? t : null;
}
function Ht(e, t, r) {
  const n = /* @__PURE__ */ new Set();
  for (const i of e.querySelectorAll("style"))
    for (const o of i.textContent?.matchAll(wi) ?? [])
      n.add(o[0]);
  for (const i of n) {
    const o = yi(i.slice(mi.length));
    o && t.style.setProperty(
      i,
      `url("${new URL(`icons/${o}`, r).href}")`
    );
  }
}
let Se = null;
function F(e, t) {
  const r = new Error(t);
  return r.name = e, r;
}
function ki(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function Ei(e) {
  if (!ki(e))
    throw F("initialization_failed", "Invalid settings payload.");
  const t = {
    locale: /* @__PURE__ */ new Set(["ja", "en"]),
    themeMode: /* @__PURE__ */ new Set(["system", "light", "dark"]),
    imageQualityLevel: /* @__PURE__ */ new Set(["none", "low", "medium", "high"]),
    videoQualityLevel: /* @__PURE__ */ new Set(["none", "low", "medium", "high"]),
    imageCompressionLevel: /* @__PURE__ */ new Set(["none", "low", "medium", "high"]),
    videoCompressionLevel: /* @__PURE__ */ new Set(["none", "low", "medium", "high"])
  }, r = /* @__PURE__ */ new Set([
    "clientTagEnabled",
    "quoteNotificationEnabled",
    "replyNotificationEnabled",
    "mediaFreePlacement",
    "showMascot",
    "showFlavorText"
  ]), n = /* @__PURE__ */ new Set([
    ...Object.keys(t),
    ...r,
    "uploadEndpoint"
  ]);
  for (const [i, o] of Object.entries(e)) {
    if (!n.has(i))
      throw F("initialization_failed", "Invalid settings payload.");
    if (i in t) {
      const s = t[i];
      if (typeof o != "string" || !s.has(o))
        throw F("initialization_failed", "Invalid settings payload.");
    } else {
      if (r.has(i) && typeof o != "boolean")
        throw F("initialization_failed", "Invalid settings payload.");
      if (i === "uploadEndpoint" && typeof o != "string")
        throw F("initialization_failed", "Invalid settings payload.");
    }
  }
  return e;
}
function xi(e) {
  return e.replaceAll(/:root:is\(\s*\.light\s*,\s*\.dark\s*\)/g, ":host(:is(.light, .dark))").replaceAll(":root", ":host").replace(`html,
body,
#app`, `:host,
.ehagaki-web-component-shell`).replace("#app {", ".ehagaki-web-component-shell {").replace("body {", ".ehagaki-web-component-shell {");
}
function $i() {
  return `:host {
        display: block;
        --accent-color: var(--ehagaki-accent-color, var(--accent-color-default));
        --base-color: var(--ehagaki-base-color);
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
class Ai extends HTMLElement {
  static get observedAttributes() {
    return ["asset-base", "auto-login"];
  }
  #e = null;
  #t = null;
  #r = null;
  #c = null;
  #s = null;
  #a = this.createReadyPromise();
  #n = "pending";
  #i = Promise.resolve();
  #l = 0;
  #o = null;
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
    if (this.onConnectionAttempt(), this.#r) return;
    const t = this.getConnectionError();
    if (t) {
      const r = F(t.code, t.message);
      this.fail("initialization_failed", r.message, r);
      return;
    }
    if (Se && Se !== this) {
      const r = F(
        "multiple_instances_unsupported",
        "Only one ehagaki-composer can be connected in a document."
      );
      this.fail("multiple_instances_unsupported", r.message, r);
      return;
    }
    this.#n !== "pending" && (this.#a = this.createReadyPromise(), this.#n = "pending"), Se = this, this.#r = this.mountApp();
  }
  disconnectedCallback() {
    this.#l += 1, this.onDisconnected(), this.#o?.disconnect(), this.#o = null, Se === this && (Se = null), this.#t && (Nr(this.#t), this.#t = null), this.#e = null, this.#r = null, this.#n === "pending" && (this.#n = "rejected", this.#s?.(F("disconnected", "Component was disconnected before it became ready.")));
  }
  whenReady() {
    return this.#a;
  }
  setContext(t) {
    return this.enqueue(async () => {
      await this.requireApp().setEmbedContext(t);
    });
  }
  setSettings(t) {
    return this.enqueue(async () => this.requireApp().setEmbedSettings(Ei(t)));
  }
  dispatchSafeEvent(t, r) {
    return this.dispatchEvent(new CustomEvent(t, {
      bubbles: !0,
      composed: !0,
      detail: r
    }));
  }
  createReadyPromise() {
    return new Promise((t, r) => {
      this.#c = t, this.#s = r;
    });
  }
  async mountApp() {
    const t = ++this.#l;
    try {
      const r = this.shadowRoot ?? this.attachShadow({ mode: "open" });
      r.replaceChildren();
      const n = document.createElement("style");
      n.textContent = `${xi(vi)}
${_i}
${$i()}`;
      const i = document.createElement("div");
      i.className = "ehagaki-web-component-shell";
      const o = document.createElement("div");
      o.className = "ehagaki-web-component-app";
      const s = document.createElement("div");
      s.className = "ehagaki-web-component-overlays ehagaki-app-root", i.append(o, s), r.append(n, i);
      const l = new URL(
        this.assetBase ?? "./",
        import.meta.url
      );
      this.#o = new MutationObserver(() => {
        Ht(r, i, l);
      }), this.#o.observe(r, {
        childList: !0,
        subtree: !0
      }), gi({
        storage: hi(window.localStorage),
        window,
        document,
        domRoot: r,
        styleTarget: i,
        layoutTarget: i,
        overlayTarget: s,
        themeTarget: this,
        layoutMode: "container",
        runtimeKind: "web-component",
        assetBase: l,
        serviceWorkerEnabled: !1,
        externalInputEnabled: !1,
        historyEnabled: !1,
        localNsecAuthEnabled: !1,
        autoLoginNip07Enabled: this.isAutoLoginNip07Enabled()
      });
      const { default: a } = await this.loadApp();
      if (!this.isConnected || t !== this.#l || (this.#t = St(a, {
        target: o,
        props: {
          notificationPort: bi(this),
          onInitialized: () => {
            !this.isConnected || t !== this.#l || (this.#n = "resolved", this.#c?.(), this.dispatchSafeEvent("ehagaki-ready", { apiVersion: 1 }));
          },
          ...this.getAdditionalMountProps()
        }
      }), Ht(r, i, l), this.#e = this.#t, !this.isConnected || t !== this.#l)) return;
    } catch {
      this.fail("initialization_failed", "eHagaki Composer could not be initialized.");
    }
  }
  requireApp() {
    if (!this.#e)
      throw F("initialization_failed", "eHagaki Composer is not ready.");
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
  getAdditionalMountProps() {
    return {};
  }
  enqueue(t) {
    const r = this.#i.then(async () => (await this.whenReady(), t()));
    return this.#i = r.then(() => {
    }, () => {
    }), r;
  }
  fail(t, r, n = F(t, r)) {
    this.#n = "rejected", this.#s?.(n), this.dispatchSafeEvent("ehagaki-initialization-error", { code: t, message: r });
  }
}
function zr(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function Si(e) {
  if (typeof e != "string") return !1;
  try {
    const t = new URL(e);
    return t.protocol === "http:" || t.protocol === "https:";
  } catch {
    return !1;
  }
}
function Ci(e) {
  if (!zr(e) || typeof e.submit != "function")
    throw new TypeError("Host-owned Composer requires a submit handler.");
  if (e.uploadMedia !== void 0 && typeof e.uploadMedia != "function")
    throw new TypeError("uploadMedia must be a function when provided.");
  return {
    submit: e.submit,
    ...e.uploadMedia ? { uploadMedia: e.uploadMedia } : {}
  };
}
function Ti(e) {
  if (!Array.isArray(e))
    throw new TypeError("Custom emoji catalog must be an array.");
  const t = /* @__PURE__ */ new Set(), r = [];
  for (const n of e) {
    if (!zr(n) || typeof n.shortcode != "string" || !Si(n.url))
      throw new TypeError("Custom emoji catalog contains an invalid item.");
    const i = n.shortcode.replace(/^:+|:+$/g, "").trim();
    if (!/^[\p{L}\p{N}_+-]{1,64}$/u.test(i))
      throw new TypeError("Custom emoji catalog contains an invalid shortcode.");
    const o = typeof n.setAddress == "string" && n.setAddress.trim() ? n.setAddress.trim() : null, s = `${i.toLowerCase()}\0${n.url}\0${o ?? ""}`;
    t.has(s) || (t.add(s), r.push({ shortcode: i, url: n.url, ...o ? { setAddress: o } : {} }));
  }
  return r;
}
class Ri extends Ai {
  #e = null;
  #t = [];
  #r = null;
  #c = !1;
  /**
   * Selects Host-owned publication exactly once before this element's first
   * connection. Reconnection intentionally reuses this immutable choice.
   */
  configureHostOwned(t) {
    if (this.#c || this.#e)
      throw new DOMException(
        "Host-owned Composer configuration is immutable after it is set or connected.",
        "InvalidStateError"
      );
    this.#e = Ci(t);
  }
  setCustomEmojis(t) {
    if (!this.#e)
      return Promise.reject(new DOMException(
        "Custom emoji catalogs are available only in Host-owned mode.",
        "InvalidStateError"
      ));
    const r = Ti(t);
    return this.#t = r, this.enqueue(async () => {
      await this.requireApp().setHostCustomEmojis(r.map((i) => ({ ...i })));
    });
  }
  loadApp() {
    return import("./HostOwnedComposerLiteApp-CkN5W06E.js").then((t) => t.H);
  }
  onConnectionAttempt() {
    this.#c = !0;
  }
  getConnectionError() {
    return this.#e ? null : {
      code: "initialization_failed",
      message: "Host-owned Composer Lite requires configureHostOwned() before connection."
    };
  }
  onDisconnected() {
    this.#r?.abort(), this.#r = null;
  }
  isAutoLoginNip07Enabled() {
    return !1;
  }
  getAdditionalMountProps() {
    if (!this.#e)
      throw new Error("Host-owned Composer Lite configuration is missing.");
    return this.#r = new AbortController(), {
      hostOwnedConfig: {
        ...this.#e,
        customEmojis: this.#t.map((t) => ({ ...t })),
        signal: this.#r.signal
      }
    };
  }
}
Pr("host-owned-lite", Ri);
export {
  g as $,
  Ji as A,
  pn as B,
  H as C,
  He as D,
  Ie as E,
  zi as F,
  Qe as G,
  ji as H,
  ao as I,
  jr as J,
  qi as K,
  De as L,
  Fi as M,
  Ui as N,
  Ii as O,
  Bi as P,
  q as Q,
  N as R,
  B as S,
  Vi as T,
  zn as U,
  $e as V,
  Wt as W,
  Le as X,
  Yt as Y,
  J as Z,
  _o as _,
  G as a,
  bn as a$,
  ne as a0,
  qn as a1,
  dr as a2,
  Xi as a3,
  Zi as a4,
  tt as a5,
  Ee as a6,
  Ut as a7,
  Di as a8,
  $o as a9,
  Ni as aA,
  Wr as aB,
  me as aC,
  Hi as aD,
  Yi as aE,
  Wi as aF,
  Ce as aG,
  Gi as aH,
  Ki as aI,
  Xr as aJ,
  po as aK,
  ci as aL,
  Q as aM,
  so as aN,
  he as aO,
  Ne as aP,
  xn as aQ,
  So as aR,
  io as aS,
  ro as aT,
  no as aU,
  go as aV,
  wo as aW,
  _n as aX,
  Io as aY,
  uo as aZ,
  ti as a_,
  vo as aa,
  _r as ab,
  yo as ac,
  bo as ad,
  Gr as ae,
  Kr as af,
  Qi as ag,
  lo as ah,
  Cn as ai,
  Mi as aj,
  Yr as ak,
  un as al,
  Li as am,
  Hr as an,
  ko as ao,
  To as ap,
  Ro as aq,
  Rr as ar,
  xo as as,
  E as at,
  Eo as au,
  A as av,
  Ot as aw,
  ce as ax,
  kt as ay,
  ie as az,
  ee as b,
  tr as b0,
  Po as b1,
  Mo as b2,
  Oo as b3,
  co as b4,
  eo as b5,
  oo as b6,
  St as b7,
  Nr as b8,
  Ln as b9,
  fo as ba,
  Ao as bb,
  No as bc,
  zo as bd,
  dn as be,
  Lo as bf,
  Co as bg,
  Oi as bh,
  Ct as bi,
  Ri as bj,
  mo as c,
  Ge as d,
  j as e,
  Z as f,
  qt as g,
  se as h,
  Lr as i,
  _ as j,
  Bn as k,
  ho as l,
  In as m,
  Br as n,
  Fr as o,
  Ve as p,
  ue as q,
  Vr as r,
  gn as s,
  gr as t,
  Wn as u,
  y as v,
  b as w,
  Hn as x,
  bt as y,
  to as z
};
