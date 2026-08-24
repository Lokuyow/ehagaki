var Mr = Array.isArray, Lr = Array.prototype.indexOf, ye = Array.prototype.includes, Dr = Array.from, Ge = Object.keys, Ke = Object.defineProperty, me = Object.getOwnPropertyDescriptor, jr = Object.getOwnPropertyDescriptors, Fr = Object.prototype, Hr = Array.prototype, qt = Object.getPrototypeOf, Ct = Object.isExtensible;
function Ci(e) {
  return typeof e == "function";
}
const Br = () => {
};
function qr(e) {
  for (var t = 0; t < e.length; t++)
    e[t]();
}
function Vt() {
  var e, t, r = new Promise((n, i) => {
    e = n, t = i;
  });
  return { promise: r, resolve: e, reject: t };
}
const $ = 2, ke = 4, Pe = 8, mt = 1 << 24, M = 16, q = 32, K = 64, ut = 128, N = 512, k = 1024, E = 2048, V = 4096, I = 8192, B = 16384, se = 32768, Rt = 1 << 25, Oe = 65536, Xe = 1 << 17, Vr = 1 << 18, pe = 1 << 19, Yt = 1 << 20, Ri = 1 << 25, de = 65536, Je = 1 << 21, we = 1 << 22, re = 1 << 23, ue = Symbol("$state"), Yr = Symbol("legacy props"), Ni = Symbol(""), Ur = Symbol("attributes"), Wr = Symbol("class"), Gr = Symbol("style"), ft = Symbol("text"), qe = Symbol("form reset"), tt = new class extends Error {
  name = "StaleReactionError";
  message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), Oi = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml")
), zi = 1, Me = 3, Le = 8;
function Kr(e) {
  throw new Error("https://svelte.dev/e/lifecycle_outside_component");
}
function Xr() {
  throw new Error("https://svelte.dev/e/async_derived_orphan");
}
function Pi(e, t, r) {
  throw new Error("https://svelte.dev/e/each_key_duplicate");
}
function Jr(e) {
  throw new Error("https://svelte.dev/e/effect_in_teardown");
}
function Zr() {
  throw new Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Qr(e) {
  throw new Error("https://svelte.dev/e/effect_orphan");
}
function en() {
  throw new Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function tn() {
  throw new Error("https://svelte.dev/e/hydration_failed");
}
function Mi(e) {
  throw new Error("https://svelte.dev/e/props_invalid_value");
}
function rn() {
  throw new Error("https://svelte.dev/e/state_descriptors_fixed");
}
function nn() {
  throw new Error("https://svelte.dev/e/state_prototype_fixed");
}
function on() {
  throw new Error("https://svelte.dev/e/state_unsafe_mutation");
}
function sn() {
  throw new Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
const Li = 1, Di = 2, ji = 4, Fi = 8, Hi = 16, Bi = 1, qi = 4, Vi = 8, Yi = 16, an = 1, ln = 2, Ut = "[", Wt = "[!", Nt = "[?", Gt = "]", xe = {}, x = Symbol(), cn = "http://www.w3.org/1999/xhtml", Ui = "http://www.w3.org/2000/svg", Wi = "http://www.w3.org/1998/Math/MathML", Gi = "@attach";
function un() {
  console.warn("https://svelte.dev/e/derived_inert");
}
function rt(e) {
  console.warn("https://svelte.dev/e/hydration_mismatch");
}
function Ki() {
  console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function fn() {
  console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
let y = !1;
function Fe(e) {
  y = e;
}
let b;
function F(e) {
  if (e === null)
    throw rt(), xe;
  return b = e;
}
function wt() {
  return F(/* @__PURE__ */ Z(b));
}
function Xi(e) {
  if (y) {
    if (/* @__PURE__ */ Z(b) !== null)
      throw rt(), xe;
    b = e;
  }
}
function hn(e = 1) {
  if (y) {
    for (var t = e, r = b; t--; )
      r = /** @type {TemplateNode} */
      /* @__PURE__ */ Z(r);
    b = r;
  }
}
function dn(e = !0) {
  for (var t = 0, r = b; ; ) {
    if (r.nodeType === Le) {
      var n = (
        /** @type {Comment} */
        r.data
      );
      if (n === Gt) {
        if (t === 0) return r;
        t -= 1;
      } else (n === Ut || n === Wt || // "[1", "[2", etc. for if blocks
      n[0] === "[" && !isNaN(Number(n.slice(1)))) && (t += 1);
    }
    var i = (
      /** @type {TemplateNode} */
      /* @__PURE__ */ Z(r)
    );
    e && r.remove(), r = i;
  }
}
function Ji(e) {
  if (!e || e.nodeType !== Le)
    throw rt(), xe;
  return (
    /** @type {Comment} */
    e.data
  );
}
function Kt(e) {
  return e === this.v;
}
function pn(e, t) {
  return e != e ? t == t : e !== t || e !== null && typeof e == "object" || typeof e == "function";
}
function Xt(e) {
  return !pn(e, this.v);
}
let A = null;
function Ee(e) {
  A = e;
}
function Zi(e) {
  return (
    /** @type {T} */
    nt().get(e)
  );
}
function Qi(e, t) {
  return nt().set(e, t), t;
}
function eo(e) {
  return nt().has(e);
}
function to() {
  return nt();
}
function gn(e, t = !1, r) {
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
function vn(e) {
  var t = (
    /** @type {ComponentContext} */
    A
  ), r = t.e;
  if (r !== null) {
    t.e = null;
    for (var n of r)
      _r(n);
  }
  return e !== void 0 && (t.x = e), t.i = !0, A = t.p, e ?? /** @type {T} */
  {};
}
function Jt() {
  return !0;
}
function nt(e) {
  return A === null && Kr(), A.c ??= new Map(_n(A) || void 0);
}
function _n(e) {
  let t = e.p;
  for (; t !== null; ) {
    const r = t.c;
    if (r !== null)
      return r;
    t = t.p;
  }
  return null;
}
let le = [];
function Zt() {
  var e = le;
  le = [], qr(e);
}
function ne(e) {
  if (le.length === 0 && !Ne) {
    var t = le;
    queueMicrotask(() => {
      t === le && Zt();
    });
  }
  le.push(e);
}
function bn() {
  for (; le.length > 0; )
    Zt();
}
function Qt(e) {
  var t = g;
  if (t === null)
    return v.f |= re, e;
  if ((t.f & se) === 0 && (t.f & ke) === 0)
    throw e;
  te(e, t);
}
function te(e, t) {
  for (; t !== null; ) {
    if ((t.f & ut) !== 0) {
      if ((t.f & se) === 0)
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
const mn = -7169;
function w(e, t) {
  e.f = e.f & mn | t;
}
function yt(e) {
  (e.f & N) !== 0 || e.deps === null ? w(e, k) : w(e, V);
}
function er(e) {
  if (e !== null)
    for (const t of e)
      (t.f & $) === 0 || (t.f & de) === 0 || (t.f ^= de, er(
        /** @type {Derived} */
        t.deps
      ));
}
function tr(e, t, r) {
  (e.f & E) !== 0 ? t.add(e) : (e.f & V) !== 0 && r.add(e), er(e.deps), w(e, k);
}
let at = null, ve = null, _ = null, ht = null, L = null, dt = null, Ne = !1, lt = !1, be = null, Ve = null;
var It = 0;
let wn = 1;
class X {
  id = wn++;
  /** True as soon as `#process` was called */
  #e = !1;
  linked = !0;
  /** @type {Batch | null} */
  #t = null;
  /** @type {Batch | null} */
  #s = null;
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
  #o = /* @__PURE__ */ new Set();
  /**
   * Callbacks that should run only when a fork is committed.
   * @type {Set<(batch: Batch) => void>}
   */
  #a = /* @__PURE__ */ new Set();
  /**
   * The number of async effects that are currently in flight
   */
  #r = 0;
  /**
   * Async effects that are currently in flight, _not_ inside a pending boundary
   * @type {Map<Effect, number>}
   */
  #n = /* @__PURE__ */ new Map();
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
  #i = [];
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
    for (const n of this.#n.keys()) {
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
        w(i, E), r(i);
      for (i of n.m)
        w(i, V), r(i);
    }
    this.#h.add(t);
  }
  #v() {
    if (this.#e = !0, It++ > 1e3 && (this.#w(), yn()), !this.#y()) {
      for (const a of this.#d)
        this.#u.delete(a), w(a, E), this.schedule(a);
      for (const a of this.#u)
        w(a, V), this.schedule(a);
    }
    const t = this.#i;
    this.#i = [], this.apply();
    var r = be = [], n = [], i = Ve = [];
    for (const a of t)
      try {
        this.#k(a, r, n);
      } catch (c) {
        throw or(a), c;
      }
    if (_ = null, i.length > 0) {
      var o = X.ensure();
      for (const a of i)
        o.schedule(a);
    }
    if (be = null, Ve = null, this.#y()) {
      this.#g(n), this.#g(r);
      for (const [a, c] of this.#f)
        ir(a, c);
      i.length > 0 && /** @type {unknown} */
      _.#v();
      return;
    }
    const s = this.#x();
    if (s) {
      s.#b(this);
      return;
    }
    this.#d.clear(), this.#u.clear();
    for (const a of this.#c) a(this);
    this.#c.clear(), ht = this, Ot(n), Ot(r), ht = null, this.#l?.resolve();
    var l = (
      /** @type {Batch | null} */
      /** @type {unknown} */
      _
    );
    if (this.linked && this.#r === 0 && this.#w(), this.#i.length > 0) {
      l === null && (l = this, this.#m());
      const a = l;
      a.#i.push(...this.#i.filter((c) => !a.#i.includes(c)));
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
      var o = i.f, s = (o & (q | K)) !== 0, l = s && (o & k) !== 0, a = l || (o & I) !== 0 || this.#f.has(i);
      if (!a && i.fn !== null) {
        s ? i.f ^= k : (o & ke) !== 0 ? r.push(i) : je(i) && ((o & M) !== 0 && this.#u.add(i), Ae(i));
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
  #x() {
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
            o & (we | M) && !this.async_deriveds.has(s) && (this.#u.delete(s), w(s, E), this.schedule(s));
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
      tr(t[r], this.#d, this.#u);
  }
  /**
   * Associate a change to a given source with the current
   * batch, noting its previous and current values
   * @param {Value} source
   * @param {any} value
   * @param {boolean} [is_derived]
   */
  capture(t, r, n = !1) {
    t.v !== x && !this.previous.has(t) && this.previous.set(t, t.v), (t.f & re) === 0 && (this.current.set(t, [r, n]), L?.set(t, r)), this.is_fork || (t.v = r);
  }
  activate() {
    _ = this;
  }
  deactivate() {
    _ = null, L = null;
  }
  flush() {
    try {
      lt = !0, _ = this, this.#v();
    } finally {
      It = 0, dt = null, be = null, Ve = null, lt = !1, _ = null, L = null, fe.clear();
    }
  }
  discard() {
    for (const t of this.#o) t(this);
    this.#o.clear(), this.#a.clear(), this.#w();
  }
  /**
   * @param {Effect} effect
   */
  register_created_effect(t) {
    this.#p.push(t);
  }
  #E() {
    this.#w();
    for (let u = at; u !== null; u = u.#s) {
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
                (h.f & (M | we)) !== 0 ? u.schedule(h) : u.#g([h]);
              });
          u.activate();
          var o = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map();
          for (var l of r)
            nr(l, i, o, s);
          s = /* @__PURE__ */ new Map();
          var a = [...u.current.keys()].filter(
            (f) => this.current.has(f) ? (
              /** @type {[any, boolean]} */
              this.current.get(f)[0] !== f.v
            ) : !0
          );
          if (a.length > 0)
            for (const f of this.#p)
              (f.f & (B | I | Xe)) === 0 && kt(f, a, s) && ((f.f & (we | M)) !== 0 ? (w(f, E), u.schedule(f)) : u.#d.add(f));
          if (u.#i.length > 0) {
            u.apply();
            for (var c of u.#i)
              u.#k(c, [], []);
            u.#i = [];
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
    if (this.#r += 1, t) {
      let n = this.#n.get(r) ?? 0;
      this.#n.set(r, n + 1);
    }
  }
  /**
   * @param {boolean} blocking
   * @param {Effect} effect
   */
  decrement(t, r) {
    if (this.#r -= 1, t) {
      let n = this.#n.get(r) ?? 0;
      n === 1 ? this.#n.delete(r) : this.#n.set(r, n - 1);
    }
    this.#_ || (this.#_ = !0, ne(() => {
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
    this.#o.add(t);
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
    return (this.#l ??= Vt()).promise;
  }
  static ensure() {
    if (_ === null) {
      const t = _ = new X();
      t.#m(), !lt && !Ne && ne(() => {
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
    if (dt = t, t.b?.is_pending && (t.f & (ke | Pe | mt)) !== 0 && (t.f & se) === 0) {
      t.b.defer_effect(t);
      return;
    }
    for (var r = t; r.parent !== null; ) {
      r = r.parent;
      var n = r.f;
      if (be !== null && r === g && (v === null || (v.f & $) === 0))
        return;
      if ((n & (K | q)) !== 0) {
        if ((n & k) === 0)
          return;
        r.f ^= k;
      }
    }
    this.#i.push(r);
  }
  #m() {
    ve === null ? at = ve = this : (ve.#s = this, this.#t = ve), ve = this;
  }
  #w() {
    var t = this.#t, r = this.#s;
    t === null ? at = r : t.#s = r, r === null ? ve = t : r.#t = t, this.linked = !1;
  }
}
function rr(e) {
  var t = Ne;
  Ne = !0;
  try {
    for (var r; ; ) {
      if (bn(), _ === null)
        return (
          /** @type {T} */
          r
        );
      _.flush();
    }
  } finally {
    Ne = t;
  }
}
function yn() {
  try {
    en();
  } catch (e) {
    te(e, dt);
  }
}
let W = null;
function Ot(e) {
  var t = e.length;
  if (t !== 0) {
    for (var r = 0; r < t; ) {
      var n = e[r++];
      if ((n.f & (B | I)) === 0 && je(n) && (W = /* @__PURE__ */ new Set(), Ae(n), n.deps === null && n.first === null && n.nodes === null && n.teardown === null && n.ac === null && wr(n), W?.size > 0)) {
        fe.clear();
        for (const i of W) {
          if ((i.f & (B | I)) !== 0) continue;
          const o = [i];
          let s = i.parent;
          for (; s !== null; )
            W.has(s) && (W.delete(s), o.push(s)), s = s.parent;
          for (let l = o.length - 1; l >= 0; l--) {
            const a = o[l];
            (a.f & (B | I)) === 0 && Ae(a);
          }
        }
        W.clear();
      }
    }
    W = null;
  }
}
function nr(e, t, r, n) {
  if (!r.has(e) && (r.add(e), e.reactions !== null))
    for (const i of e.reactions) {
      const o = i.f;
      (o & $) !== 0 ? nr(
        /** @type {Derived} */
        i,
        t,
        r,
        n
      ) : (o & (we | M)) !== 0 && (o & E) === 0 && kt(i, t, n) && (w(i, E), xt(
        /** @type {Effect} */
        i
      ));
    }
}
function kt(e, t, r) {
  const n = r.get(e);
  if (n !== void 0) return n;
  if (e.deps !== null)
    for (const i of e.deps) {
      if (ye.call(t, i))
        return !0;
      if ((i.f & $) !== 0 && kt(
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
function xt(e) {
  _.schedule(e);
}
function ir(e, t) {
  if (!((e.f & q) !== 0 && (e.f & k) !== 0)) {
    (e.f & E) !== 0 ? t.d.push(e) : (e.f & V) !== 0 && t.m.push(e), w(e, k);
    for (var r = e.first; r !== null; )
      ir(r, t), r = r.next;
  }
}
function or(e) {
  w(e, k);
  for (var t = e.first; t !== null; )
    or(t), t = t.next;
}
function kn(e) {
  let t = 0, r = De(0), n;
  return () => {
    At() && (G(r), br(() => (t === 0 && (n = Yn(() => e(() => Ie(r)))), t += 1, () => {
      ne(() => {
        t -= 1, t === 0 && (n?.(), n = void 0, Ie(r));
      });
    })));
  };
}
var xn = Oe | pe;
function En(e, t, r, n) {
  new $n(e, t, r, n);
}
class $n {
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
  #s;
  /** @type {((anchor: Node) => void)} */
  #c;
  /** @type {Effect} */
  #o;
  /** @type {Effect | null} */
  #a = null;
  /** @type {Effect | null} */
  #r = null;
  /** @type {Effect | null} */
  #n = null;
  /** @type {DocumentFragment | null} */
  #l = null;
  #i = 0;
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
  #_ = kn(() => (this.#h = De(this.#i), () => {
    this.#h = null;
  }));
  /**
   * @param {TemplateNode} node
   * @param {BoundaryProps} props
   * @param {((anchor: Node) => void)} children
   * @param {((error: unknown) => unknown) | undefined} [transform_error]
   */
  constructor(t, r, n, i) {
    this.#e = t, this.#s = r, this.#c = (o) => {
      var s = (
        /** @type {Effect} */
        g
      );
      s.b = this, s.f |= ut, n(o);
    }, this.parent = /** @type {Effect} */
    g.b, this.transform_error = i ?? this.parent?.transform_error ?? ((o) => o), this.#o = jn(() => {
      if (y) {
        const o = (
          /** @type {Comment} */
          this.#t
        );
        wt();
        const s = o.data === Wt;
        if (o.data.startsWith(Nt)) {
          const a = JSON.parse(o.data.slice(Nt.length));
          this.#v(a);
        } else s ? this.#k() : this.#y();
      } else
        this.#x();
    }, xn), y && (this.#e = b);
  }
  #y() {
    try {
      this.#a = ae(() => this.#c(this.#e));
    } catch (t) {
      this.error(t);
    }
  }
  /**
   * @param {unknown} error The deserialized error from the server's hydration comment
   */
  #v(t) {
    const r = this.#s.failed;
    r && (this.#n = ae(() => {
      r(
        this.#e,
        () => t,
        () => () => {
        }
      );
    }));
  }
  #k() {
    const t = this.#s.pending;
    t && (this.is_pending = !0, this.#r = ae(() => t(this.#e)), ne(() => {
      var r = this.#l = document.createDocumentFragment(), n = J();
      r.append(n), this.#a = this.#g(() => ae(() => this.#c(n))), this.#p === 0 && (this.#e.before(r), this.#l = null, Ye(
        /** @type {Effect} */
        this.#r,
        () => {
          this.#r = null;
        }
      ), this.#b(
        /** @type {Batch} */
        _
      ));
    }));
  }
  #x() {
    try {
      if (this.is_pending = this.has_pending_snippet(), this.#p = 0, this.#i = 0, this.#a = ae(() => {
        this.#c(this.#e);
      }), this.#p > 0) {
        var t = this.#l = document.createDocumentFragment();
        Bn(this.#a, t);
        const r = (
          /** @type {(anchor: Node) => void} */
          this.#s.pending
        );
        this.#r = ae(() => r(this.#e));
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
    tr(t, this.#u, this.#f);
  }
  /**
   * Returns `false` if the effect exists inside a boundary whose pending snippet is shown
   * @returns {boolean}
   */
  is_rendered() {
    return !this.is_pending && (!this.parent || this.parent.is_rendered());
  }
  has_pending_snippet() {
    return !!this.#s.pending;
  }
  /**
   * @template T
   * @param {() => T} fn
   */
  #g(t) {
    var r = g, n = v, i = A;
    Y(this.#o), z(this.#o), Ee(this.#o.ctx);
    try {
      return X.ensure(), t();
    } catch (o) {
      return Qt(o), null;
    } finally {
      Y(r), z(n), Ee(i);
    }
  }
  /**
   * Updates the pending count associated with the currently visible pending snippet,
   * if any, such that we can replace the snippet with content once work is done
   * @param {1 | -1} d
   * @param {Batch} batch
   */
  #E(t, r) {
    if (!this.has_pending_snippet()) {
      this.parent && this.parent.#E(t, r);
      return;
    }
    this.#p += t, this.#p === 0 && (this.#b(r), this.#r && Ye(this.#r, () => {
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
  update_pending_count(t, r) {
    this.#E(t, r), this.#i += t, !(!this.#h || this.#d) && (this.#d = !0, ne(() => {
      this.#d = !1, this.#h && et(this.#h, this.#i);
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
    if (!this.#s.onerror && !this.#s.failed)
      throw t;
    _?.is_fork ? (this.#a && _.skip_effect(this.#a), this.#r && _.skip_effect(this.#r), this.#n && _.skip_effect(this.#n), _.on_fork_commit(() => {
      this.#m(t);
    })) : this.#m(t);
  }
  /**
   * @param {unknown} error
   */
  #m(t) {
    this.#a && (j(this.#a), this.#a = null), this.#r && (j(this.#r), this.#r = null), this.#n && (j(this.#n), this.#n = null), y && (F(
      /** @type {TemplateNode} */
      this.#t
    ), hn(), F(dn()));
    var r = this.#s.onerror;
    let n = this.#s.failed;
    var i = !1, o = !1;
    const s = () => {
      if (i) {
        fn();
        return;
      }
      i = !0, o && sn(), this.#n !== null && Ye(this.#n, () => {
        this.#n = null;
      }), this.#g(() => {
        this.#x();
      });
    }, l = (a) => {
      try {
        o = !0, r?.(a, s), o = !1;
      } catch (c) {
        te(c, this.#o && this.#o.parent);
      }
      n && (this.#n = this.#g(() => {
        try {
          return ae(() => {
            var c = (
              /** @type {Effect} */
              g
            );
            c.b = this, c.f |= ut, n(
              this.#e,
              () => a,
              () => s
            );
          });
        } catch (c) {
          return te(
            c,
            /** @type {Effect} */
            this.#o.parent
          ), null;
        }
      }));
    };
    ne(() => {
      var a;
      try {
        a = this.transform_error(t);
      } catch (c) {
        te(c, this.#o && this.#o.parent);
        return;
      }
      a !== null && typeof a == "object" && typeof /** @type {any} */
      a.then == "function" ? a.then(
        l,
        /** @param {unknown} e */
        (c) => te(c, this.#o && this.#o.parent)
      ) : l(a);
    });
  }
}
function An(e, t, r, n) {
  const i = Et;
  var o = e.filter((h) => !h.settled);
  if (r.length === 0 && o.length === 0) {
    n(t.map(i));
    return;
  }
  var s = (
    /** @type {Effect} */
    g
  ), l = Sn(), a = o.length === 1 ? o[0].promise : o.length > 1 ? Promise.all(o.map((h) => h.promise)) : null;
  function c(h) {
    if ((s.f & B) === 0) {
      l();
      try {
        n(h);
      } catch (d) {
        te(d, s);
      }
      Ze();
    }
  }
  var u = sr();
  if (r.length === 0) {
    a.then(() => c(t.map(i))).finally(u);
    return;
  }
  function f() {
    Promise.all(r.map((h) => /* @__PURE__ */ Tn(h))).then((h) => c([...t.map(i), ...h])).catch((h) => te(h, s)).finally(u);
  }
  a ? a.then(() => {
    l(), f(), Ze();
  }) : f();
}
function Sn() {
  var e = (
    /** @type {Effect} */
    g
  ), t = v, r = A, n = (
    /** @type {Batch} */
    _
  );
  return function(o = !0) {
    Y(e), z(t), Ee(r), o && (e.f & B) === 0 && (n?.activate(), n?.apply());
  };
}
function Ze(e = !0) {
  Y(null), z(null), Ee(null), e && _?.deactivate();
}
function sr() {
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
function Et(e) {
  var t = $ | E;
  return g !== null && (g.f |= pe), {
    ctx: A,
    deps: null,
    effects: null,
    equals: Kt,
    f: t,
    fn: e,
    reactions: null,
    rv: 0,
    v: (
      /** @type {V} */
      x
    ),
    wv: 0,
    parent: g,
    ac: null
  };
}
const He = Symbol("obsolete");
// @__NO_SIDE_EFFECTS__
function Tn(e, t, r) {
  let n = (
    /** @type {Effect | null} */
    g
  );
  n === null && Xr();
  var i = (
    /** @type {Promise<V>} */
    /** @type {unknown} */
    void 0
  ), o = De(
    /** @type {V} */
    x
  ), s = !v, l = /* @__PURE__ */ new Set();
  return Dn(() => {
    var a = (
      /** @type {Effect} */
      g
    ), c = Vt();
    i = c.promise;
    try {
      Promise.resolve(e()).then(c.resolve, (d) => {
        d !== tt && c.reject(d);
      }).finally(Ze);
    } catch (d) {
      c.reject(d), Ze();
    }
    var u = (
      /** @type {Batch} */
      _
    );
    if (s) {
      if ((a.f & se) !== 0)
        var f = sr();
      if (
        /** @type {Boundary} */
        n.b.is_rendered()
      )
        u.async_deriveds.get(a)?.reject(He);
      else
        for (const d of l.values())
          d.reject(He);
      l.add(c), u.async_deriveds.set(a, c);
    }
    const h = (d, p = void 0) => {
      f?.(), l.delete(c), p !== He && (u.activate(), p ? (o.f |= re, et(o, p)) : ((o.f & re) !== 0 && (o.f ^= re), et(o, d)), u.deactivate());
    };
    c.promise.then(h, (d) => h(null, d || "unknown"));
  }), vr(() => {
    for (const a of l)
      a.reject(He);
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
function ro(e) {
  const t = /* @__PURE__ */ Et(e);
  return xr(t), t;
}
// @__NO_SIDE_EFFECTS__
function no(e) {
  const t = /* @__PURE__ */ Et(e);
  return t.equals = Xt, t;
}
function Cn(e) {
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
function $t(e) {
  var t, r = g, n = e.parent;
  if (!oe && n !== null && (n.f & (B | I)) !== 0)
    return un(), e.v;
  Y(n);
  try {
    e.f &= ~de, Cn(e), t = Sr(e);
  } finally {
    Y(r);
  }
  return t;
}
function ar(e) {
  var t = $t(e);
  if (!e.equals(t) && (e.wv = $r(), (!_?.is_fork || e.deps === null) && (_ !== null ? (_.capture(e, t, !0), ht?.capture(e, t, !0)) : e.v = t, e.deps === null))) {
    w(e, k);
    return;
  }
  oe || (L !== null ? (At() || _?.is_fork) && L.set(e, t) : yt(e));
}
function Rn(e) {
  if (e.effects !== null)
    for (const t of e.effects)
      (t.teardown || t.ac) && (t.teardown?.(), t.ac?.abort(tt), t.teardown = Br, t.ac = null, ze(t, 0), St(t));
}
function lr(e) {
  if (e.effects !== null)
    for (const t of e.effects)
      t.teardown && Ae(t);
}
let Qe = /* @__PURE__ */ new Set();
const fe = /* @__PURE__ */ new Map();
let cr = !1;
function De(e, t) {
  var r = {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v: e,
    reactions: null,
    equals: Kt,
    rv: 0,
    wv: 0
  };
  return r;
}
// @__NO_SIDE_EFFECTS__
function Q(e, t) {
  const r = De(e);
  return xr(r), r;
}
// @__NO_SIDE_EFFECTS__
function Nn(e, t = !1, r = !0) {
  const n = De(e);
  return t || (n.equals = Xt), n;
}
function ee(e, t, r = !1) {
  v !== null && // since we are untracking the function inside `$inspect.with` we need to add this check
  // to ensure we error if state is set inside an inspect effect
  (!D || (v.f & Xe) !== 0) && Jt() && (v.f & ($ | M | we | Xe)) !== 0 && (O === null || !ye.call(O, e)) && on();
  let n = r ? Te(t) : t;
  return et(e, n, Ve);
}
function et(e, t, r = null) {
  if (!e.equals(t)) {
    fe.set(e, oe ? t : e.v);
    var n = X.ensure();
    if (n.capture(e, t), (e.f & $) !== 0) {
      const i = (
        /** @type {Derived} */
        e
      );
      (e.f & E) !== 0 && $t(i), L === null && yt(i);
    }
    e.wv = $r(), ur(e, E, r), g !== null && (g.f & k) !== 0 && (g.f & (q | K)) === 0 && (R === null ? qn([e]) : R.push(e)), !n.is_fork && Qe.size > 0 && !cr && In();
  }
  return t;
}
function In() {
  cr = !1;
  for (const e of Qe) {
    (e.f & k) !== 0 && w(e, V);
    let t;
    try {
      t = je(e);
    } catch {
      t = !0;
    }
    t && Ae(e);
  }
  Qe.clear();
}
function Ie(e) {
  ee(e, e.v + 1);
}
function ur(e, t, r) {
  var n = e.reactions;
  if (n !== null)
    for (var i = n.length, o = 0; o < i; o++) {
      var s = n[o], l = s.f, a = (l & E) === 0;
      if (a && w(s, t), (l & Xe) !== 0)
        Qe.add(
          /** @type {Effect} */
          s
        );
      else if ((l & $) !== 0) {
        var c = (
          /** @type {Derived} */
          s
        );
        L?.delete(c), (l & de) === 0 && (l & N && (g === null || (g.f & Je) === 0) && (s.f |= de), ur(c, V, r));
      } else if (a) {
        var u = (
          /** @type {Effect} */
          s
        );
        (l & M) !== 0 && W !== null && W.add(u), r !== null ? r.push(u) : xt(u);
      }
    }
}
function Te(e) {
  if (typeof e != "object" || e === null || ue in e)
    return e;
  const t = qt(e);
  if (t !== Fr && t !== Hr)
    return e;
  var r = /* @__PURE__ */ new Map(), n = Mr(e), i = /* @__PURE__ */ Q(0), o = he, s = (l) => {
    if (he === o)
      return l();
    var a = v, c = he;
    z(null), Dt(o);
    var u = l();
    return z(a), Dt(c), u;
  };
  return n && r.set("length", /* @__PURE__ */ Q(
    /** @type {any[]} */
    e.length
  )), new Proxy(
    /** @type {any} */
    e,
    {
      defineProperty(l, a, c) {
        (!("value" in c) || c.configurable === !1 || c.enumerable === !1 || c.writable === !1) && rn();
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
            const u = s(() => /* @__PURE__ */ Q(x));
            r.set(a, u), Ie(i);
          }
        } else
          ee(c, x), Ie(i);
        return !0;
      },
      get(l, a, c) {
        if (a === ue)
          return e;
        var u = r.get(a), f = a in l;
        if (u === void 0 && (!f || me(l, a)?.writable) && (u = s(() => {
          var d = Te(f ? l[a] : x), p = /* @__PURE__ */ Q(d);
          return p;
        }), r.set(a, u)), u !== void 0) {
          var h = G(u);
          return h === x ? void 0 : h;
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
          if (f !== void 0 && h !== x)
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
        if (a === ue)
          return !0;
        var c = r.get(a), u = c !== void 0 && c.v !== x || Reflect.has(l, a);
        if (c !== void 0 || g !== null && (!u || me(l, a)?.writable)) {
          c === void 0 && (c = s(() => {
            var h = u ? Te(l[a]) : x, d = /* @__PURE__ */ Q(h);
            return d;
          }), r.set(a, c));
          var f = G(c);
          if (f === x)
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
            p !== void 0 ? ee(p, x) : d in l && (p = s(() => /* @__PURE__ */ Q(x)), r.set(d + "", p));
          }
        if (f === void 0)
          (!h || me(l, a)?.writable) && (f = s(() => /* @__PURE__ */ Q(void 0)), ee(f, Te(c)), r.set(a, f));
        else {
          h = f.v !== x;
          var m = s(() => Te(c));
          ee(f, m);
        }
        var T = Reflect.getOwnPropertyDescriptor(l, a);
        if (T?.set && T.set.call(u, c), !h) {
          if (n && typeof a == "string") {
            var U = (
              /** @type {Source<number>} */
              r.get("length")
            ), ge = Number(a);
            Number.isInteger(ge) && ge >= U.v && ee(U, ge + 1);
          }
          Ie(i);
        }
        return !0;
      },
      ownKeys(l) {
        G(i);
        var a = Reflect.ownKeys(l).filter((f) => {
          var h = r.get(f);
          return h === void 0 || h.v !== x;
        });
        for (var [c, u] of r)
          u.v !== x && !(c in l) && a.push(c);
        return a;
      },
      setPrototypeOf() {
        nn();
      }
    }
  );
}
function zt(e) {
  try {
    if (e !== null && typeof e == "object" && ue in e)
      return e[ue];
  } catch {
  }
  return e;
}
function io(e, t) {
  return Object.is(zt(e), zt(t));
}
var Pt, fr, hr, dr;
function pt() {
  if (Pt === void 0) {
    Pt = window, fr = /Firefox/.test(navigator.userAgent);
    var e = Element.prototype, t = Node.prototype, r = Text.prototype;
    hr = me(t, "firstChild").get, dr = me(t, "nextSibling").get, Ct(e) && (e[Wr] = void 0, e[Ur] = null, e[Gr] = void 0, e.__e = void 0), Ct(r) && (r[ft] = void 0);
  }
}
function J(e = "") {
  return document.createTextNode(e);
}
// @__NO_SIDE_EFFECTS__
function $e(e) {
  return (
    /** @type {TemplateNode | null} */
    hr.call(e)
  );
}
// @__NO_SIDE_EFFECTS__
function Z(e) {
  return (
    /** @type {TemplateNode | null} */
    dr.call(e)
  );
}
function oo(e, t) {
  if (!y)
    return /* @__PURE__ */ $e(e);
  var r = /* @__PURE__ */ $e(b);
  if (r === null)
    r = b.appendChild(J());
  else if (t && r.nodeType !== Me) {
    var n = J();
    return r?.before(n), F(n), n;
  }
  return t && it(
    /** @type {Text} */
    r
  ), F(r), r;
}
function so(e, t = !1) {
  if (!y) {
    var r = /* @__PURE__ */ $e(e);
    return r instanceof Comment && r.data === "" ? /* @__PURE__ */ Z(r) : r;
  }
  if (t) {
    if (b?.nodeType !== Me) {
      var n = J();
      return b?.before(n), F(n), n;
    }
    it(
      /** @type {Text} */
      b
    );
  }
  return b;
}
function ao(e, t = 1, r = !1) {
  let n = y ? b : e;
  for (var i; t--; )
    i = n, n = /** @type {TemplateNode} */
    /* @__PURE__ */ Z(n);
  if (!y)
    return n;
  if (r) {
    if (n?.nodeType !== Me) {
      var o = J();
      return n === null ? i?.after(o) : n.before(o), F(o), o;
    }
    it(
      /** @type {Text} */
      n
    );
  }
  return F(n), n;
}
function On(e) {
  e.textContent = "";
}
function lo() {
  return !1;
}
function pr(e, t, r) {
  return (
    /** @type {T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : Element} */
    document.createElementNS(t ?? cn, e, void 0)
  );
}
function it(e) {
  if (
    /** @type {string} */
    e.nodeValue.length < 65536
  )
    return;
  let t = e.nextSibling;
  for (; t !== null && t.nodeType === Me; )
    t.remove(), e.nodeValue += /** @type {string} */
    t.nodeValue, t = e.nextSibling;
}
function co(e, t) {
  if (t) {
    const r = document.body;
    e.autofocus = !0, ne(() => {
      document.activeElement === r && e.focus();
    });
  }
}
let Mt = !1;
function zn() {
  Mt || (Mt = !0, document.addEventListener(
    "reset",
    (e) => {
      Promise.resolve().then(() => {
        if (!e.defaultPrevented)
          for (
            const t of
            /**@type {HTMLFormElement} */
            e.target.elements
          )
            t[qe]?.();
      });
    },
    // In the capture phase to guarantee we get noticed of it (no possibility of stopPropagation)
    { capture: !0 }
  ));
}
function ot(e) {
  var t = v, r = g;
  z(null), Y(null);
  try {
    return e();
  } finally {
    z(t), Y(r);
  }
}
function uo(e, t, r, n = r) {
  e.addEventListener(t, () => ot(r));
  const i = (
    /** @type {any} */
    e[qe]
  );
  i ? e[qe] = () => {
    i(), n(!0);
  } : e[qe] = () => n(!0), zn();
}
function gr(e) {
  g === null && (v === null && Qr(), Zr()), oe && Jr();
}
function Pn(e, t) {
  var r = t.last;
  r === null ? t.last = t.first = e : (r.next = e, e.prev = r, t.last = e);
}
function P(e, t) {
  var r = g;
  r !== null && (r.f & I) !== 0 && (e |= I);
  var n = {
    ctx: A,
    deps: null,
    nodes: null,
    f: e | E | N,
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
    (i.f & pe) === 0 && (i = i.first, (e & M) !== 0 && (e & Oe) !== 0 && i !== null && (i.f |= Oe));
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
function At() {
  return v !== null && !D;
}
function vr(e) {
  const t = P(Pe, null);
  return w(t, k), t.teardown = e, t;
}
function fo(e) {
  gr();
  var t = (
    /** @type {Effect} */
    g.f
  ), r = !v && (t & q) !== 0 && (t & se) === 0;
  if (r) {
    var n = (
      /** @type {ComponentContext} */
      A
    );
    (n.e ??= []).push(e);
  } else
    return _r(e);
}
function _r(e) {
  return P(ke | Yt, e);
}
function ho(e) {
  return gr(), P(Pe | Yt, e);
}
function Mn(e) {
  X.ensure();
  const t = P(K | pe, e);
  return () => {
    j(t);
  };
}
function Ln(e) {
  X.ensure();
  const t = P(K | pe, e);
  return (r = {}) => new Promise((n) => {
    r.outro ? Ye(t, () => {
      j(t), n(void 0);
    }) : (j(t), n(void 0));
  });
}
function po(e) {
  return P(ke, e);
}
function Dn(e) {
  return P(we | pe, e);
}
function br(e, t = 0) {
  return P(Pe | t, e);
}
function go(e, t = [], r = [], n = []) {
  An(n, t, r, (i) => {
    P(Pe, () => e(...i.map(G)));
  });
}
function jn(e, t = 0) {
  var r = P(M | t, e);
  return r;
}
function vo(e, t = 0) {
  var r = P(mt | t, e);
  return r;
}
function ae(e) {
  return P(q | pe, e);
}
function mr(e) {
  var t = e.teardown;
  if (t !== null) {
    const r = oe, n = v;
    Lt(!0), z(null);
    try {
      t.call(null);
    } finally {
      Lt(r), z(n);
    }
  }
}
function St(e, t = !1) {
  var r = e.first;
  for (e.first = e.last = null; r !== null; ) {
    const i = r.ac;
    i !== null && ot(() => {
      i.abort(tt);
    });
    var n = r.next;
    (r.f & K) !== 0 ? r.parent = null : j(r, t), r = n;
  }
}
function Fn(e) {
  for (var t = e.first; t !== null; ) {
    var r = t.next;
    (t.f & q) === 0 && j(t), t = r;
  }
}
function j(e, t = !0) {
  var r = !1;
  (t || (e.f & Vr) !== 0) && e.nodes !== null && e.nodes.end !== null && (Hn(
    e.nodes.start,
    /** @type {TemplateNode} */
    e.nodes.end
  ), r = !0), w(e, Rt), St(e, t && !r), ze(e, 0);
  var n = e.nodes && e.nodes.t;
  if (n !== null)
    for (const o of n)
      o.stop();
  mr(e), e.f ^= Rt, e.f |= B;
  var i = e.parent;
  i !== null && i.first !== null && wr(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Hn(e, t) {
  for (; e !== null; ) {
    var r = e === t ? null : /* @__PURE__ */ Z(e);
    e.remove(), e = r;
  }
}
function wr(e) {
  var t = e.parent, r = e.prev, n = e.next;
  r !== null && (r.next = n), n !== null && (n.prev = r), t !== null && (t.first === e && (t.first = n), t.last === e && (t.last = r));
}
function Ye(e, t, r = !0) {
  var n = [];
  yr(e, n, !0);
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
function yr(e, t, r) {
  if ((e.f & I) === 0) {
    e.f ^= I;
    var n = e.nodes && e.nodes.t;
    if (n !== null)
      for (const l of n)
        (l.is_global || r) && t.push(l);
    for (var i = e.first; i !== null; ) {
      var o = i.next;
      if ((i.f & K) === 0) {
        var s = (i.f & Oe) !== 0 || // If this is a branch effect without a block effect parent,
        // it means the parent block effect was pruned. In that case,
        // transparency information was transferred to the branch effect.
        (i.f & q) !== 0 && (e.f & M) !== 0;
        yr(i, t, s ? r : !1);
      }
      i = o;
    }
  }
}
function _o(e) {
  kr(e, !0);
}
function kr(e, t) {
  if ((e.f & I) !== 0) {
    e.f ^= I, (e.f & k) === 0 && (w(e, E), X.ensure().schedule(e));
    for (var r = e.first; r !== null; ) {
      var n = r.next, i = (r.f & Oe) !== 0 || (r.f & q) !== 0;
      kr(r, i ? t : !1), r = n;
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
      var i = r === n ? null : /* @__PURE__ */ Z(r);
      t.append(r), r = i;
    }
}
let Ue = !1, oe = !1;
function Lt(e) {
  oe = e;
}
let v = null, D = !1;
function z(e) {
  v = e;
}
let g = null;
function Y(e) {
  g = e;
}
let O = null;
function xr(e) {
  v !== null && (O === null ? O = [e] : O.push(e));
}
let S = null, C = 0, R = null;
function qn(e) {
  R = e;
}
let Er = 1, ce = 0, he = ce;
function Dt(e) {
  he = e;
}
function $r() {
  return ++Er;
}
function je(e) {
  var t = e.f;
  if ((t & E) !== 0)
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
      ) && ar(
        /** @type {Derived} */
        o
      ), o.wv > e.wv)
        return !0;
    }
    (t & N) !== 0 && // During time traveling we don't want to reset the status so that
    // traversal of the graph in the other batches still happens
    L === null && w(e, k);
  }
  return !1;
}
function Ar(e, t, r = !0) {
  var n = e.reactions;
  if (n !== null && !(O !== null && ye.call(O, e)))
    for (var i = 0; i < n.length; i++) {
      var o = n[i];
      (o.f & $) !== 0 ? Ar(
        /** @type {Derived} */
        o,
        t,
        !1
      ) : t === o && (r ? w(o, E) : (o.f & k) !== 0 && w(o, V), xt(
        /** @type {Effect} */
        o
      ));
    }
}
function Sr(e) {
  var t = S, r = C, n = R, i = v, o = O, s = A, l = D, a = he, c = e.f;
  S = /** @type {null | Value[]} */
  null, C = 0, R = null, v = (c & (q | K)) === 0 ? e : null, O = null, Ee(e.ctx), D = !1, he = ++ce, e.ac !== null && (ot(() => {
    e.ac.abort(tt);
  }), e.ac = null);
  try {
    e.f |= Je;
    var u = (
      /** @type {Function} */
      e.fn
    ), f = u();
    e.f |= se;
    var h = e.deps, d = _?.is_fork;
    if (S !== null) {
      var p;
      if (d || ze(e, C), h !== null && C > 0)
        for (h.length = C + S.length, p = 0; p < S.length; p++)
          h[C + p] = S[p];
      else
        e.deps = h = S;
      if (At() && (e.f & N) !== 0)
        for (p = C; p < h.length; p++)
          (h[p].reactions ??= []).push(e);
    } else !d && h !== null && C < h.length && (ze(e, C), h.length = C);
    if (Jt() && R !== null && !D && h !== null && (e.f & ($ | V | E)) === 0)
      for (p = 0; p < /** @type {Source[]} */
      R.length; p++)
        Ar(
          R[p],
          /** @type {Effect} */
          e
        );
    if (i !== null && i !== e) {
      if (ce++, i.deps !== null)
        for (let m = 0; m < r; m += 1)
          i.deps[m].rv = ce;
      if (t !== null)
        for (const m of t)
          m.rv = ce;
      R !== null && (n === null ? n = R : n.push(.../** @type {Source[]} */
      R));
    }
    return (e.f & re) !== 0 && (e.f ^= re), f;
  } catch (m) {
    return Qt(m);
  } finally {
    e.f ^= Je, S = t, C = r, R = n, v = i, O = o, Ee(s), D = l, he = a;
  }
}
function Vn(e, t) {
  let r = t.reactions;
  if (r !== null) {
    var n = Lr.call(r, e);
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
    (o.f & N) !== 0 && (o.f ^= N, o.f &= ~de), o.v !== x && yt(o), Rn(o), ze(o, 0);
  }
}
function ze(e, t) {
  var r = e.deps;
  if (r !== null)
    for (var n = t; n < r.length; n++)
      Vn(e, r[n]);
}
function Ae(e) {
  var t = e.f;
  if ((t & B) === 0) {
    w(e, k);
    var r = g, n = Ue;
    g = e, Ue = !0;
    try {
      (t & (M | mt)) !== 0 ? Fn(e) : St(e), mr(e);
      var i = Sr(e);
      e.teardown = typeof i == "function" ? i : null, e.wv = Er;
      var o;
    } finally {
      Ue = n, g = r;
    }
  }
}
async function bo() {
  await Promise.resolve(), rr();
}
function G(e) {
  var t = e.f, r = (t & $) !== 0;
  if (v !== null && !D) {
    var n = g !== null && (g.f & B) !== 0;
    if (!n && (O === null || !ye.call(O, e))) {
      var i = v.deps;
      if ((v.f & Je) !== 0)
        e.rv < ce && (e.rv = ce, S === null && i !== null && i[C] === e ? C++ : S === null ? S = [e] : S.push(e));
      else {
        (v.deps ??= []).push(e);
        var o = e.reactions;
        o === null ? e.reactions = [v] : ye.call(o, v) || o.push(v);
      }
    }
  }
  if (oe && fe.has(e))
    return fe.get(e);
  if (r) {
    var s = (
      /** @type {Derived} */
      e
    );
    if (oe) {
      var l = s.v;
      return ((s.f & k) === 0 && s.reactions !== null || Cr(s)) && (l = $t(s)), fe.set(s, l), l;
    }
    var a = (s.f & N) === 0 && !D && v !== null && (Ue || (v.f & N) !== 0), c = (s.f & se) === 0;
    je(s) && (a && (s.f |= N), ar(s)), a && !c && (lr(s), Tr(s));
  }
  if (L?.has(e))
    return L.get(e);
  if ((e.f & re) !== 0)
    throw e.v;
  return e.v;
}
function Tr(e) {
  if (e.f |= N, e.deps !== null)
    for (const t of e.deps)
      (t.reactions ??= []).push(e), (t.f & $) !== 0 && (t.f & N) === 0 && (lr(
        /** @type {Derived} */
        t
      ), Tr(
        /** @type {Derived} */
        t
      ));
}
function Cr(e) {
  if (e.v === x) return !0;
  if (e.deps === null) return !1;
  for (const t of e.deps)
    if (fe.has(t) || (t.f & $) !== 0 && Cr(
      /** @type {Derived} */
      t
    ))
      return !0;
  return !1;
}
function Yn(e) {
  var t = D;
  try {
    return D = !0, e();
  } finally {
    D = t;
  }
}
function mo(e) {
  if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
    if (ue in e)
      gt(e);
    else if (!Array.isArray(e))
      for (let t in e) {
        const r = e[t];
        typeof r == "object" && r && ue in r && gt(r);
      }
  }
}
function gt(e, t = /* @__PURE__ */ new Set()) {
  if (typeof e == "object" && e !== null && // We don't want to traverse DOM elements
  !(e instanceof EventTarget) && !t.has(e)) {
    t.add(e), e instanceof Date && e.getTime();
    for (let n in e)
      try {
        gt(e[n], t);
      } catch {
      }
    const r = qt(e);
    if (r !== Object.prototype && r !== Array.prototype && r !== Map.prototype && r !== Set.prototype && r !== Date.prototype) {
      const n = jr(r);
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
function wo(e) {
  return e.endsWith("capture") && e !== "gotpointercapture" && e !== "lostpointercapture";
}
const Un = [
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
function yo(e) {
  return Un.includes(e);
}
const Wn = {
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
function ko(e) {
  return e = e.toLowerCase(), Wn[e] ?? e;
}
const Gn = ["touchstart", "touchmove"];
function Kn(e) {
  return Gn.includes(e);
}
const Xn = (
  /** @type {const} */
  ["textarea", "script", "style", "title"]
);
function xo(e) {
  return Xn.includes(
    /** @type {typeof RAW_TEXT_ELEMENTS[number]} */
    e
  );
}
const Ce = Symbol("events"), Rr = /* @__PURE__ */ new Set(), vt = /* @__PURE__ */ new Set();
function Eo(e) {
  if (!y) return;
  e.removeAttribute("onload"), e.removeAttribute("onerror");
  const t = e.__e;
  t !== void 0 && (e.__e = void 0, queueMicrotask(() => {
    e.isConnected && e.dispatchEvent(t);
  }));
}
function Nr(e, t, r, n = {}) {
  function i(o) {
    if (n.capture || _t.call(t, o), !o.cancelBubble)
      return ot(() => r?.call(this, o));
  }
  return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? ne(() => {
    t.addEventListener(e, i, n);
  }) : t.addEventListener(e, i, n), i;
}
function $o(e, t, r, n = {}) {
  var i = Nr(t, e, r, n);
  return () => {
    e.removeEventListener(t, i, n);
  };
}
function Ao(e, t, r, n, i) {
  var o = { capture: n, passive: i }, s = Nr(e, t, r, o);
  (t === document.body || // @ts-ignore
  t === window || // @ts-ignore
  t === document || // Firefox has quirky behavior, it can happen that we still get "canplay" events when the element is already removed
  t instanceof HTMLMediaElement) && vr(() => {
    t.removeEventListener(e, s, o);
  });
}
function So(e, t, r) {
  (t[Ce] ??= {})[e] = r;
}
function To(e) {
  for (var t = 0; t < e.length; t++)
    Rr.add(e[t]);
  for (var r of vt)
    r(e);
}
let jt = null;
function _t(e) {
  var t = this, r = (
    /** @type {Node} */
    t.ownerDocument
  ), n = e.type, i = e.composedPath?.() || [], o = (
    /** @type {null | Element} */
    i[0] || e.target
  );
  jt = e;
  var s = 0, l = jt === e && e[Ce];
  if (l) {
    var a = i.indexOf(l);
    if (a !== -1 && (t === document || t === /** @type {any} */
    window)) {
      e[Ce] = t;
      return;
    }
    var c = i.indexOf(t);
    if (c === -1)
      return;
    a <= c && (s = a);
  }
  if (o = /** @type {Element} */
  i[s] || e.target, o !== t) {
    Ke(e, "currentTarget", {
      configurable: !0,
      get() {
        return o || r;
      }
    });
    var u = v, f = g;
    z(null), Y(null);
    try {
      for (var h, d = []; o !== null; ) {
        var p = o.assignedSlot || o.parentNode || /** @type {any} */
        o.host || null;
        try {
          var m = o[Ce]?.[n];
          m != null && (!/** @type {any} */
          o.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
          // -> the target could not have been disabled because it emits the event in the first place
          e.target === o) && m.call(o, e);
        } catch (T) {
          h ? d.push(T) : h = T;
        }
        if (e.cancelBubble || p === t || p === null)
          break;
        o = p;
      }
      if (h) {
        for (let T of d)
          queueMicrotask(() => {
            throw T;
          });
        throw h;
      }
    } finally {
      e[Ce] = t, delete e.currentTarget, z(u), Y(f);
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
function Zn(e) {
  return (
    /** @type {string} */
    Jn?.createHTML(e) ?? e
  );
}
function Qn(e) {
  var t = pr("template");
  return t.innerHTML = Zn(e.replaceAll("<!>", "<!---->")), t.content;
}
function ie(e, t) {
  var r = (
    /** @type {Effect} */
    g
  );
  r.nodes === null && (r.nodes = { start: e, end: t, a: null, t: null });
}
// @__NO_SIDE_EFFECTS__
function Co(e, t) {
  var r = (t & an) !== 0, n = (t & ln) !== 0, i, o = !e.startsWith("<!>");
  return () => {
    if (y)
      return ie(b, null), b;
    i === void 0 && (i = Qn(o ? e : "<!>" + e), r || (i = /** @type {TemplateNode} */
    /* @__PURE__ */ $e(i)));
    var s = (
      /** @type {TemplateNode} */
      n || fr ? document.importNode(i, !0) : i.cloneNode(!0)
    );
    if (r) {
      var l = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ $e(s)
      ), a = (
        /** @type {TemplateNode} */
        s.lastChild
      );
      ie(l, a);
    } else
      ie(s, s);
    return s;
  };
}
function Ro(e = "") {
  if (!y) {
    var t = J(e + "");
    return ie(t, t), t;
  }
  var r = b;
  return r.nodeType !== Me ? (r.before(r = J()), F(r)) : it(
    /** @type {Text} */
    r
  ), ie(r, r), r;
}
function No() {
  if (y)
    return ie(b, null), b;
  var e = document.createDocumentFragment(), t = document.createComment(""), r = J();
  return e.append(t, r), ie(t, r), e;
}
function ei(e, t) {
  if (y) {
    var r = (
      /** @type {Effect & { nodes: EffectNodes }} */
      g
    );
    ((r.f & se) === 0 || r.nodes.end === null) && (r.nodes.end = b), wt();
    return;
  }
  e !== null && e.before(
    /** @type {Node} */
    t
  );
}
function Io() {
  if (y && b && b.nodeType === Le && b.textContent?.startsWith("$")) {
    const e = b.textContent.substring(1);
    return wt(), e;
  }
  return (window.__svelte ??= {}).uid ??= 1, `c${window.__svelte.uid++}`;
}
function Oo(e, t) {
  var r = t == null ? "" : typeof t == "object" ? `${t}` : t;
  r !== /** @type {any} */
  (e[ft] ??= e.nodeValue) && (e[ft] = r, e.nodeValue = `${r}`);
}
function Tt(e, t) {
  return Ir(e, t);
}
function ti(e, t) {
  pt(), t.intro = t.intro ?? !1;
  const r = t.target, n = y, i = b;
  try {
    for (var o = /* @__PURE__ */ $e(r); o && (o.nodeType !== Le || /** @type {Comment} */
    o.data !== Ut); )
      o = /* @__PURE__ */ Z(o);
    if (!o)
      throw xe;
    Fe(!0), F(
      /** @type {Comment} */
      o
    );
    const s = Ir(e, { ...t, anchor: o });
    return Fe(!1), /**  @type {Exports} */
    s;
  } catch (s) {
    if (s instanceof Error && s.message.split(`
`).some((l) => l.startsWith("https://svelte.dev/e/")))
      throw s;
    return s !== xe && console.warn("Failed to hydrate: ", s), t.recover === !1 && tn(), pt(), On(r), Fe(!1), Tt(e, t);
  } finally {
    Fe(n), F(i);
  }
}
const Be = /* @__PURE__ */ new Map();
function Ir(e, { target: t, anchor: r, props: n = {}, events: i, context: o, intro: s = !0, transformError: l }) {
  pt();
  var a = void 0, c = Ln(() => {
    var u = r ?? t.appendChild(J());
    En(
      /** @type {TemplateNode} */
      u,
      {
        pending: () => {
        }
      },
      (d) => {
        gn({});
        var p = (
          /** @type {ComponentContext} */
          A
        );
        if (o && (p.c = o), i && (n.$$events = i), y && ie(
          /** @type {TemplateNode} */
          d,
          null
        ), a = e(d, n) || {}, y && (g.nodes.end = b, b === null || b.nodeType !== Le || /** @type {Comment} */
        b.data !== Gt))
          throw rt(), xe;
        vn();
      },
      l
    );
    var f = /* @__PURE__ */ new Set(), h = (d) => {
      for (var p = 0; p < d.length; p++) {
        var m = d[p];
        if (!f.has(m)) {
          f.add(m);
          var T = Kn(m);
          for (const st of [t, document]) {
            var U = Be.get(st);
            U === void 0 && (U = /* @__PURE__ */ new Map(), Be.set(st, U));
            var ge = U.get(m);
            ge === void 0 ? (st.addEventListener(m, _t, { passive: T }), U.set(m, 1)) : U.set(m, ge + 1);
          }
        }
      }
    };
    return h(Dr(Rr)), vt.add(h), () => {
      for (var d of f)
        for (const T of [t, document]) {
          var p = (
            /** @type {Map<string, number>} */
            Be.get(T)
          ), m = (
            /** @type {number} */
            p.get(d)
          );
          --m == 0 ? (T.removeEventListener(d, _t), p.delete(d), p.size === 0 && Be.delete(T)) : p.set(d, m);
        }
      vt.delete(h), u !== r && u.parentNode?.removeChild(u);
    };
  });
  return bt.set(a, c), a;
}
let bt = /* @__PURE__ */ new WeakMap();
function Or(e, t) {
  const r = bt.get(e);
  return r ? (bt.delete(e), r(t)) : Promise.resolve();
}
function ri(e) {
  return new ni(e);
}
class ni {
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
      var l = /* @__PURE__ */ Nn(s, !1, !1);
      return r.set(o, l), l;
    };
    const i = new Proxy(
      { ...t.props || {}, $$events: {} },
      {
        get(o, s) {
          return G(r.get(s) ?? n(s, Reflect.get(o, s)));
        },
        has(o, s) {
          return s === Yr ? !0 : (G(r.get(s) ?? n(s, Reflect.get(o, s))), Reflect.has(o, s));
        },
        set(o, s, l) {
          return ee(r.get(s) ?? n(s, l), l), Reflect.set(o, s, l);
        }
      }
    );
    this.#t = (t.hydrate ? ti : Tt)(t.component, {
      target: t.target,
      anchor: t.anchor,
      props: i,
      context: t.context,
      intro: t.intro ?? !1,
      recover: t.recover,
      transformError: t.transformError
    }), (!t?.props?.$$host || t.sync === !1) && rr(), this.#e = i.$$events;
    for (const o of Object.keys(this.#t))
      o === "$set" || o === "$destroy" || o === "$on" || Ke(this, o, {
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
      Or(this.#t);
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
let zr;
typeof HTMLElement == "function" && (zr = class extends HTMLElement {
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
          const o = pr("slot");
          n !== "default" && (o.name = n), ei(i, o);
        };
      };
      if (await Promise.resolve(), !this.$$cn || this.$$c)
        return;
      const t = {}, r = ii(this);
      for (const n of this.$$s)
        n in r && (n === "default" && !this.$$d.children ? (this.$$d.children = e(n), t.default = !0) : t[n] = e(n));
      for (const n of this.attributes) {
        const i = this.$$g_p(n.name);
        i in this.$$d || (this.$$d[i] = We(i, n.value, this.$$p_d, "toProp"));
      }
      for (const n in this.$$p_d)
        !(n in this.$$d) && this[n] !== void 0 && (this.$$d[n] = this[n], delete this[n]);
      this.$$c = ri({
        component: this.$$ctor,
        target: this.$$shadowRoot || this,
        props: {
          ...this.$$d,
          $$slots: t,
          $$host: this
        }
      }), this.$$me = Mn(() => {
        br(() => {
          this.$$r = !0;
          for (const n of Ge(this.$$c)) {
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
    return Ge(this.$$p_d).find(
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
function ii(e) {
  const t = {};
  return e.childNodes.forEach((r) => {
    t[
      /** @type {Element} node */
      r.slot || "default"
    ] = !0;
  }), t;
}
function zo(e, t, r, n, i, o) {
  let s = class extends zr {
    constructor() {
      super(e, r, i), this.$$p_d = t;
    }
    static get observedAttributes() {
      return Ge(t).map(
        (l) => (t[l].attribute || l).toLowerCase()
      );
    }
  };
  return Ge(t).forEach((l) => {
    Ke(s.prototype, l, {
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
    Ke(s.prototype, l, {
      get() {
        return this.$$c?.[l];
      }
    });
  }), e.element = /** @type {any} */
  s, s;
}
let Pr;
const oi = "ehagaki.web-component.v1:", _e = /* @__PURE__ */ new Map(), si = {
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
function ai() {
  if (typeof globalThis < "u") {
    const e = globalThis.localStorage;
    if (e)
      return e;
  }
  return si;
}
function li() {
  return Pr ?? ai();
}
function ci(e) {
  Pr = e;
}
function ct(e, t) {
  const r = [];
  for (let n = 0; n < e.length; n += 1) {
    const i = e.key(n);
    i?.startsWith(t) && r.push(i.slice(t.length));
  }
  return r;
}
function ui(e, t) {
  return {
    get length() {
      return ct(e, t).length;
    },
    clear() {
      const r = ct(e, t);
      for (const n of r)
        e.removeItem(`${t}${n}`);
    },
    getItem(r) {
      return e.getItem(`${t}${r}`);
    },
    key(r) {
      return ct(e, t)[r] ?? null;
    },
    removeItem(r) {
      e.removeItem(`${t}${r}`);
    },
    setItem(r, n) {
      e.setItem(`${t}${r}`, String(n));
    }
  };
}
function fi(e) {
  return ui(
    e,
    oi
  );
}
function hi() {
  return {
    style: {
      setProperty: () => {
      },
      removeProperty: () => "",
      getPropertyValue: () => ""
    }
  };
}
function di() {
  const e = typeof window < "u" ? window : void 0, t = e?.document, r = t?.documentElement ?? hi(), n = t?.body ?? r;
  return {
    storage: li(),
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
let Re = di();
function pi(e) {
  return Re = {
    ...Re,
    ...e
  }, ci(Re.storage), Re;
}
function Po() {
  return Re;
}
const gi = ":root{--app-root-height: 100%;--app-root-top: 0px;--app-root-overflow-y: visible;--app-main-height: 100svh;--app-body-position: static;--app-body-inset: auto;--app-body-width: auto;--app-overlay-position: fixed;--app-overscroll-behavior: auto;--footer-height: 66px;--footer-bottom: 0px;--keyboard-height: 0px;--mobile-dialog-viewport-top: 0px;--mobile-dialog-viewport-height: 100dvh;--mobile-dialog-center-y: 43dvh;--keyboard-button-bar-height: 50px;--keyboard-button-bar-bottom: 66px;--main-content-keyboard-adjustment: var(--keyboard-height);--reason-input-base-height: 50px;--reason-input-height: 0px;--reason-input-bottom: 116px;--main-content-top-spacing: 6px;--composer-bottom-reserved-height: 116px;--accent-color-default: hsl(152, 74%, 43%);--accent-color: var(--accent-color-default);--theme: var(--accent-color);--text-black: hsl(0, 0%, 24%);--nostr-bg: hsl(270, 100%, 98%);--yellow: hsl(50, 100%, 50%);--danger: hsl(0, 84%, 60%);--darker: rgba(0, 0, 0, .8);--dark-gray: hsl(0, 0%, 66%);--light-gray: hsl(0, 0%, 83%);--surface-bg: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 94%)) 18%, hsl(0, 0%, 94%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 12%)) 18%, hsl(0, 0%, 12%)) );--surface-input: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 100%)) 14%, hsl(0, 0%, 100%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 19%)) 14%, hsl(0, 0%, 19%)) );--surface-editor: var(--surface-input);--surface-footer: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 82%)) 22%, hsl(0, 0%, 82%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 10%)) 22%, hsl(0, 0%, 10%)) );--surface-buttonbar: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 91%)) 20%, hsl(0, 0%, 91%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 28%)) 20%, hsl(0, 0%, 28%)) );--surface-button: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 92%)) 18%, hsl(0, 0%, 92%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 25%)) 18%, hsl(0, 0%, 25%)) );--surface-button-border: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 75%)) 24%, hsl(0, 0%, 75%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 30%)) 24%, hsl(0, 0%, 30%)) );--surface-button-preview-action: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 74%)) 22%, hsl(0, 0%, 74%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 36%)) 22%, hsl(0, 0%, 36%)) );--surface-border: light-dark( color-mix(in srgb, var(--base-color, var(--light-gray)) 24%, var(--light-gray)), color-mix(in srgb, var(--base-color, dimgray) 24%, dimgray) );--surface-border-hr: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 84%)) 20%, hsl(0, 0%, 84%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 30%)) 20%, hsl(0, 0%, 30%)) );--surface-border-hr-light: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 92%)) 16%, hsl(0, 0%, 92%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 20%)) 16%, hsl(0, 0%, 20%)) );--surface-dialog: light-dark( color-mix(in srgb, var(--base-color, white) 14%, white), color-mix(in srgb, var(--base-color, hsl(0, 0%, 14%)) 14%, hsl(0, 0%, 14%)) );--surface-window: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 95%)) 14%, hsl(0, 0%, 95%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 14%)) 14%, hsl(0, 0%, 14%)) );--bg: var(--surface-bg);--bg-input: var(--surface-input);--bg-footer: var(--surface-footer);--bg-translucent: light-dark(#EDEDEDcc, #212121cc);--bg-buttonbar: var(--surface-buttonbar);--footer-buttonbar-bg: var(--bg-buttonbar);--btn-bg: var(--surface-button);--btn-bg2: light-dark(color-mix(in srgb, var(--btn-bg), black 6%), color-mix(in srgb, var(--btn-bg), white 10%));--btn-bg3: light-dark(color-mix(in srgb, var(--btn-bg), black 11%), color-mix(in srgb, var(--btn-bg), white 20%));--btn-border: var(--surface-button-border);--btn-hover-bg: light-dark(rgba(50, 50, 50, .12), rgba(255, 255, 255, .12));--btn-post-preview-action: var(--surface-button-preview-action);--border: var(--surface-border);--border-hr: var(--surface-border-hr);--border-hr-light: var(--surface-border-hr-light);--semantic-text: light-dark(hsl(0, 0%, 24%), hsl(0, 0%, 90%));--text: var(--semantic-text);--text-light: light-dark(hsl(0, 0%, 46%), hsl(0, 0%, 75%));--text-muted: light-dark(hsl(0, 0%, 60%), hsl(0, 0%, 55%));--text-red: light-dark(hsl(0, 99%, 45%), hsl(0, 99%, 69%));--text-r: light-dark(#e6e6e6, #3D3D3D);--semantic-link: light-dark(#1a0dab, #99c3ff);--link: var(--semantic-link);--link-visited: light-dark(#681da8, #c58af9);--dialog-bg: var(--surface-dialog);--dialog-bg2: light-dark(color-mix(in srgb, var(--dialog-bg), black 6%), color-mix(in srgb, var(--dialog-bg), white 10%));--dialog-bg3: light-dark(color-mix(in srgb, var(--dialog-bg), black 11%), color-mix(in srgb, var(--dialog-bg), white 16%));--dialog-bg-overlay: light-dark(rgba(0, 0, 0, .6), rgba(0, 0, 0, .8));--window: var(--surface-window);--svg: light-dark(hsl(0, 0%, 36%), hsl(0, 0%, 90%));--svg-light: var(--text-light);--shadow: light-dark(rgba(0, 0, 0, .1), rgba(255, 255, 255, .1));--hagaki: light-dark(hsl(0, 77%, 56%), hsl(5, 99%, 71%));--hashtag-text: light-dark(#106BC7, #65B1FC);--hashtag-bg: light-dark(#106BC71a, #65B1FC1a);--toggle-bg: var(--svg);--toggle-circle: var(--dialog-bg);--message-success-bg: hsl(200, 39%, 96%);--message-success-color: hsl(210, 60%, 40%);--message-success-border: hsl(210, 48%, 70%);--message-error-bg: hsl(351, 99%, 96%);--message-error-color: hsl(351, 99%, 32%);--message-error-border: hsl(351, 99%, 70%);--message-warning-bg: hsl(38, 100%, 95%);--message-warning-color: hsl(30, 90%, 35%);--message-warning-border: hsl(38, 90%, 65%);--message-flavor-bg: hsl(125, 39%, 94%);--message-flavor-color: hsl(123, 46%, 32%);--message-flavor-border: hsl(125, 39%, 70%);--message-tips-bg: hsl(270, 50%, 96%);--message-tips-color: hsl(270, 55%, 38%);--message-tips-border: hsl(270, 45%, 70%);font-family:system-ui,-apple-system,Segoe UI,Hiragino Sans,Hiragino Kaku Gothic ProN,Meiryo,sans-serif;font-weight:400;color-scheme:light dark;color:var(--text);background-color:var(--bg);font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}html[data-base-color-set=true]{--surface-bg: light-dark( color-mix(in srgb, var(--base-color) 18%, hsl(0, 0%, 97%)), color-mix(in srgb, var(--base-color) 18%, hsl(0, 0%, 12%)) );--surface-editor: light-dark( color-mix(in srgb, var(--base-color) 6%, hsl(0, 0%, 100%)), color-mix(in srgb, var(--base-color) 9%, hsl(0, 0%, 22%)) );--surface-footer: light-dark( color-mix(in srgb, var(--base-color) 34%, hsl(0, 0%, 86%)), color-mix(in srgb, var(--base-color) 22%, hsl(0, 0%, 10%)) );--footer-buttonbar-bg: light-dark(var(--bg), var(--bg-buttonbar))}*{font-family:inherit;box-sizing:border-box}html,body,#app{height:var(--app-root-height);overflow-x:hidden;overflow-y:var(--app-root-overflow-y);overscroll-behavior-y:var(--app-overscroll-behavior)}#app{position:var(--app-body-position);top:var(--app-root-top);left:0;right:0;width:var(--app-body-width)}body{margin:0;position:var(--app-body-position);inset:var(--app-body-inset);width:var(--app-body-width);color:var(--text);background-color:var(--bg);overflow-wrap:anywhere;word-break:auto-phrase;line-break:strict}a{--link-hover-color: light-dark(color-mix(in srgb, var(--link), black 30%), color-mix(in srgb, var(--link), white 30%));font-weight:500;color:var(--link);-webkit-tap-highlight-color:transparent;text-decoration:none;border-radius:6px}a:active{opacity:1}h2,h3{color:var(--text-light)}.card{padding:2em}button,[role=button],select{display:inline-flex;align-items:center;justify-content:center;height:100%;padding:0;font-size:1rem;font-weight:500;line-height:normal;color:var(--text);background-color:inherit;border:none;cursor:pointer;text-decoration:none;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;--button-selected-bg: light-dark(color-mix(in srgb, var(--btn-bg), black 18%), color-mix(in srgb, var(--btn-bg), white 22%));--button-hover-bg: light-dark(color-mix(in srgb, var(--btn-bg), black 4%), color-mix(in srgb, var(--btn-bg), white 5%));--button-hover-color: light-dark(color-mix(in srgb, var(--text), black 40%), color-mix(in srgb, var(--text), white 50%));--button-selected-hover-bg: light-dark(color-mix(in srgb, var(--btn-bg), black 20%), color-mix(in srgb, var(--btn-bg), white 30%));--button-selected-hover-color: light-dark(color-mix(in srgb, var(--text), black 20%), color-mix(in srgb, var(--text), white 30%))}:is(button,[role=button],select):disabled{opacity:.3;cursor:not-allowed}:is(button,[role=button],select):disabled.loading{opacity:1}button>*{pointer-events:none}button:active:not(:disabled),[role=button]:active{scale:.98;transition:scale .1s cubic-bezier(0,1,.5,1)}@media(prefers-reduced-motion:reduce){button:active:not(:disabled),[role=button]:active{scale:1;transition:none}}span{-webkit-tap-highlight-color:transparent}select{border-radius:6px}.svg-icon{-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-size:contain;mask-size:contain;-webkit-mask-position:center;mask-position:center;background-color:var(--svg);display:inline-block;inline-size:var(--icon-size, 28px);block-size:var(--icon-size, 28px);--icon-hover-color: light-dark(color-mix(in srgb, var(--svg), black 40%), color-mix(in srgb, var(--svg), white 50%));--icon-selected-hover-color: light-dark(color-mix(in srgb, var(--svg), black 20%), color-mix(in srgb, var(--svg), white 30%))}.tooltip-content{--tooltip-padding: 12px;--tooltip-font-size: 1rem;--tooltip-line-height: normal;--tooltip-z-index: 100;--tooltip-max-width: none;background:var(--dialog-bg);color:var(--text);border:1px solid var(--border);border-radius:6px;padding:var(--tooltip-padding);font-size:var(--tooltip-font-size);line-height:var(--tooltip-line-height);z-index:var(--tooltip-z-index);max-width:var(--tooltip-max-width)}.post-preview-tooltip-content{--tooltip-z-index: 10000;z-index:10000!important}:root:is(.light,.dark) button.selected:where(:not(:disabled)),:root:is(.light,.dark) button:where([data-state=active]){background-color:var(--button-selected-bg)}@media(hover:hover)and (pointer:fine){a:hover{text-decoration:underline}:root:is(.light,.dark) button:where(:hover:not(:disabled)),:root:is(.light,.dark) [role=button]:where(:hover:not([aria-disabled=true])),:root:is(.light,.dark) select:where(:hover:not(:disabled)){background-color:var(--button-hover-bg);color:var(--button-hover-color)}:is(:root:is(.light,.dark) button:where(:hover:not(:disabled)),:root:is(.light,.dark) [role=button]:where(:hover:not([aria-disabled=true])),:root:is(.light,.dark) select:where(:hover:not(:disabled))) .svg-icon{background-color:var(--icon-hover-color)}:root:is(.light,.dark) button.selected:where(:hover:not(:disabled)),:root:is(.light,.dark) button:where([data-state=active]:hover:not(:disabled)){background-color:var(--button-selected-hover-bg);color:var(--button-selected-hover-color)}:is(:root:is(.light,.dark) button.selected:where(:hover:not(:disabled)),:root:is(.light,.dark) button:where([data-state=active]:hover:not(:disabled))) .svg-icon{background-color:var(--icon-selected-hover-color)}:root:is(.light,.dark) a:hover{color:var(--link-hover-color)}}.setting-section{display:flex;flex-direction:column}.setting-row{display:flex;flex-direction:row;align-items:stretch;justify-content:space-between;min-height:50px}.setting-label{font-size:1rem;font-weight:500;line-height:1.3;display:flex;align-items:center;justify-content:flex-start;white-space:pre-line}.setting-control{display:flex;align-items:stretch;justify-content:flex-end;height:auto;margin-block:auto}", vi = ".pswp{--pswp-bg: #000;--pswp-placeholder-bg: #222;--pswp-root-z-index: 100000;--pswp-preloader-color: rgba(79, 79, 79, .4);--pswp-preloader-color-secondary: rgba(255, 255, 255, .9);--pswp-icon-color: #fff;--pswp-icon-color-secondary: #4f4f4f;--pswp-icon-stroke-color: #4f4f4f;--pswp-icon-stroke-width: 2px;--pswp-error-text-color: var(--pswp-icon-color)}.pswp{position:fixed;top:0;left:0;width:100%;height:100%;z-index:var(--pswp-root-z-index);display:none;touch-action:none;outline:0;opacity:.003;contain:layout style size;-webkit-tap-highlight-color:rgba(0,0,0,0)}.pswp:focus{outline:0}.pswp *{box-sizing:border-box}.pswp img{max-width:none}.pswp--open{display:block}.pswp,.pswp__bg{transform:translateZ(0);will-change:opacity}.pswp__bg{opacity:.005;background:var(--pswp-bg)}.pswp,.pswp__scroll-wrap{overflow:hidden}.pswp__scroll-wrap,.pswp__bg,.pswp__container,.pswp__item,.pswp__content,.pswp__img,.pswp__zoom-wrap{position:absolute;top:0;left:0;width:100%;height:100%}.pswp__img,.pswp__zoom-wrap{width:auto;height:auto}.pswp--click-to-zoom.pswp--zoom-allowed .pswp__img{cursor:-webkit-zoom-in;cursor:-moz-zoom-in;cursor:zoom-in}.pswp--click-to-zoom.pswp--zoomed-in .pswp__img{cursor:move;cursor:-webkit-grab;cursor:-moz-grab;cursor:grab}.pswp--click-to-zoom.pswp--zoomed-in .pswp__img:active{cursor:-webkit-grabbing;cursor:-moz-grabbing;cursor:grabbing}.pswp--no-mouse-drag.pswp--zoomed-in .pswp__img,.pswp--no-mouse-drag.pswp--zoomed-in .pswp__img:active,.pswp__img{cursor:-webkit-zoom-out;cursor:-moz-zoom-out;cursor:zoom-out}.pswp__container,.pswp__img,.pswp__button,.pswp__counter{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.pswp__item{z-index:1;overflow:hidden}.pswp__hidden{display:none!important}.pswp__content{pointer-events:none}.pswp__content>*{pointer-events:auto}.pswp__error-msg-container{display:grid}.pswp__error-msg{margin:auto;font-size:1em;line-height:1;color:var(--pswp-error-text-color)}.pswp .pswp__hide-on-close{opacity:.005;will-change:opacity;transition:opacity var(--pswp-transition-duration) cubic-bezier(.4,0,.22,1);z-index:10;pointer-events:none}.pswp--ui-visible .pswp__hide-on-close{opacity:1;pointer-events:auto}.pswp__button{position:relative;display:block;width:50px;height:60px;padding:0;margin:0;overflow:hidden;cursor:pointer;background:none;border:0;box-shadow:none;opacity:.85;-webkit-appearance:none;-webkit-touch-callout:none}.pswp__button:hover,.pswp__button:active,.pswp__button:focus{transition:none;padding:0;background:none;border:0;box-shadow:none;opacity:1}.pswp__button:disabled{opacity:.3;cursor:auto}.pswp__icn{fill:var(--pswp-icon-color);color:var(--pswp-icon-color-secondary)}.pswp__icn{position:absolute;top:14px;left:9px;width:32px;height:32px;overflow:hidden;pointer-events:none}.pswp__icn-shadow{stroke:var(--pswp-icon-stroke-color);stroke-width:var(--pswp-icon-stroke-width);fill:none}.pswp__icn:focus{outline:0}div.pswp__img--placeholder,.pswp__img--with-bg{background:var(--pswp-placeholder-bg)}.pswp__top-bar{position:absolute;left:0;top:0;width:100%;height:60px;display:flex;flex-direction:row;justify-content:flex-end;z-index:10;pointer-events:none!important}.pswp__top-bar>*{pointer-events:auto;will-change:opacity}.pswp__button--close{margin-right:6px}.pswp__button--arrow{position:absolute;width:75px;height:100px;top:50%;margin-top:-50px}.pswp__button--arrow:disabled{display:none;cursor:default}.pswp__button--arrow .pswp__icn{top:50%;margin-top:-30px;width:60px;height:60px;background:none;border-radius:0}.pswp--one-slide .pswp__button--arrow{display:none}.pswp--touch .pswp__button--arrow{visibility:hidden}.pswp--has_mouse .pswp__button--arrow{visibility:visible}.pswp__button--arrow--prev{right:auto;left:0}.pswp__button--arrow--next{right:0}.pswp__button--arrow--next .pswp__icn{left:auto;right:14px;transform:scaleX(-1)}.pswp__button--zoom{display:none}.pswp--zoom-allowed .pswp__button--zoom{display:block}.pswp--zoomed-in .pswp__zoom-icn-bar-v{display:none}.pswp__preloader{position:relative;overflow:hidden;width:50px;height:60px;margin-right:auto}.pswp__preloader .pswp__icn{opacity:0;transition:opacity .2s linear;animation:pswp-clockwise .6s linear infinite}.pswp__preloader--active .pswp__icn{opacity:.85}@keyframes pswp-clockwise{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.pswp__counter{height:30px;margin-top:15px;margin-inline-start:20px;font-size:14px;line-height:30px;color:var(--pswp-icon-color);text-shadow:1px 1px 3px var(--pswp-icon-color-secondary);opacity:.85}.pswp--one-slide .pswp__counter{display:none}", Ft = "ehagaki-composer", _i = 1;
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
function H(e, t) {
  const r = new Error(t);
  return r.name = e, r;
}
function ki(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function xi(e) {
  if (!ki(e))
    throw H("initialization_failed", "Invalid settings payload.");
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
      throw H("initialization_failed", "Invalid settings payload.");
    if (i in t) {
      const s = t[i];
      if (typeof o != "string" || !s.has(o))
        throw H("initialization_failed", "Invalid settings payload.");
    } else {
      if (r.has(i) && typeof o != "boolean")
        throw H("initialization_failed", "Invalid settings payload.");
      if (i === "uploadEndpoint" && typeof o != "string")
        throw H("initialization_failed", "Invalid settings payload.");
    }
  }
  return e;
}
function Ei(e) {
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
let Ai = class extends HTMLElement {
  static get observedAttributes() {
    return ["asset-base", "auto-login"];
  }
  #e = null;
  #t = null;
  #s = null;
  #c = null;
  #o = null;
  #a = this.createReadyPromise();
  #r = "pending";
  #n = Promise.resolve();
  #l = 0;
  #i = null;
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
    if (this.onConnectionAttempt(), this.#s) return;
    const t = this.getConnectionError();
    if (t) {
      const r = H(t.code, t.message);
      this.fail("initialization_failed", r.message, r);
      return;
    }
    if (Se && Se !== this) {
      const r = H(
        "multiple_instances_unsupported",
        "Only one ehagaki-composer can be connected in a document."
      );
      this.fail("multiple_instances_unsupported", r.message, r);
      return;
    }
    this.#r !== "pending" && (this.#a = this.createReadyPromise(), this.#r = "pending"), Se = this, this.#s = this.mountApp();
  }
  disconnectedCallback() {
    this.#l += 1, this.onDisconnected(), this.#i?.disconnect(), this.#i = null, Se === this && (Se = null), this.#t && (Or(this.#t), this.#t = null), this.#e = null, this.#s = null, this.#r === "pending" && (this.#r = "rejected", this.#o?.(H("disconnected", "Component was disconnected before it became ready.")));
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
    return this.enqueue(async () => this.requireApp().setEmbedSettings(xi(t)));
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
      this.#c = t, this.#o = r;
    });
  }
  async mountApp() {
    const t = ++this.#l;
    try {
      const r = this.shadowRoot ?? this.attachShadow({ mode: "open" });
      r.replaceChildren();
      const n = document.createElement("style");
      n.textContent = `${Ei(gi)}
${vi}
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
      this.#i = new MutationObserver(() => {
        Ht(r, i, l);
      }), this.#i.observe(r, {
        childList: !0,
        subtree: !0
      }), pi({
        storage: fi(window.localStorage),
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
      if (!this.isConnected || t !== this.#l || (this.#t = Tt(a, {
        target: o,
        props: {
          notificationPort: bi(this),
          onInitialized: () => {
            !this.isConnected || t !== this.#l || (this.#r = "resolved", this.#c?.(), this.dispatchSafeEvent("ehagaki-ready", { apiVersion: _i }));
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
      throw H("initialization_failed", "eHagaki Composer is not ready.");
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
    const r = this.#n.then(async () => (await this.whenReady(), t()));
    return this.#n = r.then(() => {
    }, () => {
    }), r;
  }
  fail(t, r, n = H(t, r)) {
    this.#r = "rejected", this.#o?.(n), this.dispatchSafeEvent("ehagaki-initialization-error", { code: t, message: r });
  }
};
class Si extends Ai {
  loadApp() {
    return import("./App-2yO7FIhW.js").then((t) => t.eJ);
  }
}
const Bt = Symbol.for("ehagaki-composer.distribution");
function Ti(e, t) {
  const r = globalThis, n = r[Bt];
  if (n && n !== e)
    throw new Error(
      `Cannot import the ${e} eHagaki Composer distribution after ${n} in the same document.`
    );
  r[Bt] = e;
  const i = customElements.get(Ft);
  if (!i) {
    customElements.define(Ft, t);
    return;
  }
  if (i !== t)
    throw new Error("ehagaki-composer is already defined by a different distribution.");
}
Ti("full", Si);
export {
  ie as $,
  Gi as A,
  F as B,
  Fe as C,
  ji as D,
  Oe as E,
  et as F,
  Ri as G,
  Pi as H,
  no as I,
  Dr as J,
  Li as K,
  Hi as L,
  De as M,
  Di as N,
  B as O,
  I as P,
  ne as Q,
  q as R,
  Fi as S,
  On as T,
  Z as U,
  $e as V,
  Wt as W,
  Le as X,
  Gt as Y,
  go as Z,
  g as _,
  G as a,
  No as a$,
  Hn as a0,
  pr as a1,
  Ui as a2,
  Wi as a3,
  rt as a4,
  xe as a5,
  Ut as a6,
  zi as a7,
  xo as a8,
  po as a9,
  ue as aA,
  Et as aB,
  oe as aC,
  Ci as aD,
  Yr as aE,
  me as aF,
  Mi as aG,
  qi as aH,
  Bi as aI,
  Te as aJ,
  Vi as aK,
  Yi as aL,
  Kr as aM,
  fo as aN,
  li as aO,
  ro as aP,
  Q as aQ,
  he as aR,
  Ie as aS,
  kn as aT,
  $o as aU,
  eo as aV,
  Zi as aW,
  Qi as aX,
  ho as aY,
  bo as aZ,
  gn as a_,
  br as aa,
  mo as ab,
  vo as ac,
  Wr as ad,
  Gr as ae,
  Ki as af,
  io as ag,
  uo as ah,
  An as ai,
  Ni as aj,
  Ur as ak,
  cn as al,
  jr as am,
  Oi as an,
  wo as ao,
  So as ap,
  To as aq,
  Nr as ar,
  co as as,
  ko as at,
  x as au,
  yo as av,
  qe as aw,
  zn as ax,
  A as ay,
  Rt as az,
  ee as b,
  so as b0,
  ei as b1,
  vn as b2,
  rr as b3,
  zo as b4,
  Io as b5,
  oo as b6,
  Xi as b7,
  Co as b8,
  to as b9,
  Tt as ba,
  Or as bb,
  Mn as bc,
  ao as bd,
  Eo as be,
  Ro as bf,
  Oo as bg,
  hn as bh,
  Po as bi,
  Ao as bj,
  _i as bk,
  Ft as bl,
  Si as bm,
  _o as c,
  Ke as d,
  j as e,
  J as f,
  qt as g,
  ae as h,
  Mr as i,
  _ as j,
  Bn as k,
  lo as l,
  Nn as m,
  Br as n,
  Fr as o,
  Ye as p,
  y as q,
  qr as r,
  pn as s,
  vr as t,
  Yn as u,
  b as v,
  jn as w,
  wt as x,
  Ji as y,
  dn as z
};
