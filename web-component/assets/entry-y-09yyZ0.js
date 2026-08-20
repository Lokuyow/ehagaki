var Pr = Array.isArray, Mr = Array.prototype.indexOf, ye = Array.prototype.includes, Lr = Array.from, Ge = Object.keys, Ke = Object.defineProperty, me = Object.getOwnPropertyDescriptor, Dr = Object.getOwnPropertyDescriptors, jr = Object.prototype, Fr = Array.prototype, Bt = Object.getPrototypeOf, Ct = Object.isExtensible;
function Si(e) {
  return typeof e == "function";
}
const Hr = () => {
};
function Br(e) {
  for (var t = 0; t < e.length; t++)
    e[t]();
}
function qt() {
  var e, t, r = new Promise((n, i) => {
    e = n, t = i;
  });
  return { promise: r, resolve: e, reject: t };
}
const $ = 2, ke = 4, Pe = 8, mt = 1 << 24, M = 16, B = 32, K = 64, ut = 128, I = 512, k = 1024, E = 2048, q = 4096, N = 8192, H = 16384, oe = 32768, Rt = 1 << 25, Oe = 65536, Xe = 1 << 17, qr = 1 << 18, pe = 1 << 19, Vt = 1 << 20, Ai = 1 << 25, de = 65536, Ze = 1 << 21, we = 1 << 22, re = 1 << 23, ue = Symbol("$state"), Vr = Symbol("legacy props"), Ti = Symbol(""), Yr = Symbol("attributes"), Ur = Symbol("class"), Wr = Symbol("style"), ft = Symbol("text"), qe = Symbol("form reset"), tt = new class extends Error {
  name = "StaleReactionError";
  message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), Ri = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml")
), Ii = 1, Me = 3, Le = 8;
function Gr(e) {
  throw new Error("https://svelte.dev/e/lifecycle_outside_component");
}
function Kr() {
  throw new Error("https://svelte.dev/e/async_derived_orphan");
}
function Ni(e, t, r) {
  throw new Error("https://svelte.dev/e/each_key_duplicate");
}
function Xr(e) {
  throw new Error("https://svelte.dev/e/effect_in_teardown");
}
function Zr() {
  throw new Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Jr(e) {
  throw new Error("https://svelte.dev/e/effect_orphan");
}
function Qr() {
  throw new Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function en() {
  throw new Error("https://svelte.dev/e/hydration_failed");
}
function Oi(e) {
  throw new Error("https://svelte.dev/e/props_invalid_value");
}
function tn() {
  throw new Error("https://svelte.dev/e/state_descriptors_fixed");
}
function rn() {
  throw new Error("https://svelte.dev/e/state_prototype_fixed");
}
function nn() {
  throw new Error("https://svelte.dev/e/state_unsafe_mutation");
}
function sn() {
  throw new Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
const zi = 1, Pi = 2, Mi = 4, Li = 8, Di = 16, ji = 1, Fi = 4, Hi = 8, Bi = 16, on = 1, an = 2, Yt = "[", Ut = "[!", It = "[?", Wt = "]", xe = {}, x = Symbol(), ln = "http://www.w3.org/1999/xhtml", qi = "http://www.w3.org/2000/svg", Vi = "http://www.w3.org/1998/Math/MathML", Yi = "@attach";
function cn() {
  console.warn("https://svelte.dev/e/derived_inert");
}
function rt(e) {
  console.warn("https://svelte.dev/e/hydration_mismatch");
}
function Ui() {
  console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function un() {
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
  return F(/* @__PURE__ */ J(b));
}
function Wi(e) {
  if (y) {
    if (/* @__PURE__ */ J(b) !== null)
      throw rt(), xe;
    b = e;
  }
}
function fn(e = 1) {
  if (y) {
    for (var t = e, r = b; t--; )
      r = /** @type {TemplateNode} */
      /* @__PURE__ */ J(r);
    b = r;
  }
}
function hn(e = !0) {
  for (var t = 0, r = b; ; ) {
    if (r.nodeType === Le) {
      var n = (
        /** @type {Comment} */
        r.data
      );
      if (n === Wt) {
        if (t === 0) return r;
        t -= 1;
      } else (n === Yt || n === Ut || // "[1", "[2", etc. for if blocks
      n[0] === "[" && !isNaN(Number(n.slice(1)))) && (t += 1);
    }
    var i = (
      /** @type {TemplateNode} */
      /* @__PURE__ */ J(r)
    );
    e && r.remove(), r = i;
  }
}
function Gi(e) {
  if (!e || e.nodeType !== Le)
    throw rt(), xe;
  return (
    /** @type {Comment} */
    e.data
  );
}
function Gt(e) {
  return e === this.v;
}
function dn(e, t) {
  return e != e ? t == t : e !== t || e !== null && typeof e == "object" || typeof e == "function";
}
function Kt(e) {
  return !dn(e, this.v);
}
let S = null;
function Ee(e) {
  S = e;
}
function Ki(e) {
  return (
    /** @type {T} */
    nt().get(e)
  );
}
function Xi(e, t) {
  return nt().set(e, t), t;
}
function Zi(e) {
  return nt().has(e);
}
function Ji() {
  return nt();
}
function pn(e, t = !1, r) {
  S = {
    p: S,
    i: !1,
    c: null,
    e: null,
    s: e,
    x: null,
    r: (
      /** @type {Effect} */
      v
    ),
    l: null
  };
}
function vn(e) {
  var t = (
    /** @type {ComponentContext} */
    S
  ), r = t.e;
  if (r !== null) {
    t.e = null;
    for (var n of r)
      _r(n);
  }
  return e !== void 0 && (t.x = e), t.i = !0, S = t.p, e ?? /** @type {T} */
  {};
}
function Xt() {
  return !0;
}
function nt(e) {
  return S === null && Gr(), S.c ??= new Map(_n(S) || void 0);
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
  le = [], Br(e);
}
function ne(e) {
  if (le.length === 0 && !Ie) {
    var t = le;
    queueMicrotask(() => {
      t === le && Zt();
    });
  }
  le.push(e);
}
function gn() {
  for (; le.length > 0; )
    Zt();
}
function Jt(e) {
  var t = v;
  if (t === null)
    return _.f |= re, e;
  if ((t.f & oe) === 0 && (t.f & ke) === 0)
    throw e;
  te(e, t);
}
function te(e, t) {
  for (; t !== null; ) {
    if ((t.f & ut) !== 0) {
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
const bn = -7169;
function w(e, t) {
  e.f = e.f & bn | t;
}
function yt(e) {
  (e.f & I) !== 0 || e.deps === null ? w(e, k) : w(e, q);
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
  (e.f & E) !== 0 ? t.add(e) : (e.f & q) !== 0 && r.add(e), Qt(e.deps), w(e, k);
}
let at = null, _e = null, g = null, ht = null, L = null, dt = null, Ie = !1, lt = !1, be = null, Ve = null;
var Nt = 0;
let mn = 1;
class X {
  id = mn++;
  /** True as soon as `#process` was called */
  #e = !1;
  linked = !0;
  /** @type {Batch | null} */
  #t = null;
  /** @type {Batch | null} */
  #o = null;
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
  #g = !1;
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
        w(i, q), r(i);
    }
    this.#h.add(t);
  }
  #_() {
    if (this.#e = !0, Nt++ > 1e3 && (this.#w(), wn()), !this.#y()) {
      for (const a of this.#d)
        this.#u.delete(a), w(a, E), this.schedule(a);
      for (const a of this.#u)
        w(a, q), this.schedule(a);
    }
    const t = this.#i;
    this.#i = [], this.apply();
    var r = be = [], n = [], i = Ve = [];
    for (const a of t)
      try {
        this.#k(a, r, n);
      } catch (c) {
        throw ir(a), c;
      }
    if (g = null, i.length > 0) {
      var s = X.ensure();
      for (const a of i)
        s.schedule(a);
    }
    if (be = null, Ve = null, this.#y()) {
      this.#v(n), this.#v(r);
      for (const [a, c] of this.#f)
        nr(a, c);
      i.length > 0 && /** @type {unknown} */
      g.#_();
      return;
    }
    const o = this.#x();
    if (o) {
      o.#b(this);
      return;
    }
    this.#d.clear(), this.#u.clear();
    for (const a of this.#c) a(this);
    this.#c.clear(), ht = this, Ot(n), Ot(r), ht = null, this.#l?.resolve();
    var l = (
      /** @type {Batch | null} */
      /** @type {unknown} */
      g
    );
    if (this.linked && this.#r === 0 && this.#w(), this.#i.length > 0) {
      l === null && (l = this, this.#m());
      const a = l;
      a.#i.push(...this.#i.filter((c) => !a.#i.includes(c)));
    }
    l !== null && l.#_();
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
      var s = i.f, o = (s & (B | K)) !== 0, l = o && (s & k) !== 0, a = l || (s & N) !== 0 || this.#f.has(i);
      if (!a && i.fn !== null) {
        o ? i.f ^= k : (s & ke) !== 0 ? r.push(i) : je(i) && ((s & M) !== 0 && this.#u.add(i), Se(i));
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
      const s = this.async_deriveds.get(n);
      s && i.promise.then(s.resolve);
    }
    const r = (n) => {
      var i = n.reactions;
      if (i !== null)
        for (const l of i) {
          var s = l.f;
          if ((s & $) !== 0)
            r(
              /** @type {Derived} */
              l
            );
          else {
            var o = (
              /** @type {Effect} */
              l
            );
            s & (we | M) && !this.async_deriveds.has(o) && (this.#u.delete(o), w(o, E), this.schedule(o));
          }
        }
    };
    for (const n of this.current.keys())
      r(n);
    this.oncommit(() => t.discard()), t.#w(), g = this, this.#_();
  }
  /**
   * @param {Effect[]} effects
   */
  #v(t) {
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
    t.v !== x && !this.previous.has(t) && this.previous.set(t, t.v), (t.f & re) === 0 && (this.current.set(t, [r, n]), L?.set(t, r)), this.is_fork || (t.v = r);
  }
  activate() {
    g = this;
  }
  deactivate() {
    g = null, L = null;
  }
  flush() {
    try {
      lt = !0, g = this, this.#_();
    } finally {
      Nt = 0, dt = null, be = null, Ve = null, lt = !1, g = null, L = null, fe.clear();
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
  #E() {
    this.#w();
    for (let u = at; u !== null; u = u.#o) {
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
                (h.f & (M | we)) !== 0 ? u.schedule(h) : u.#v([h]);
              });
          u.activate();
          var s = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map();
          for (var l of r)
            rr(l, i, s, o);
          o = /* @__PURE__ */ new Map();
          var a = [...u.current.keys()].filter(
            (f) => this.current.has(f) ? (
              /** @type {[any, boolean]} */
              this.current.get(f)[0] !== f.v
            ) : !0
          );
          if (a.length > 0)
            for (const f of this.#p)
              (f.f & (H | N | Xe)) === 0 && kt(f, a, o) && ((f.f & (we | M)) !== 0 ? (w(f, E), u.schedule(f)) : u.#d.add(f));
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
    this.#g || (this.#g = !0, ne(() => {
      this.#g = !1, this.linked && this.flush();
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
    return (this.#l ??= qt()).promise;
  }
  static ensure() {
    if (g === null) {
      const t = g = new X();
      t.#m(), !lt && !Ie && ne(() => {
        t.#e || t.flush();
      });
    }
    return g;
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
    if (dt = t, t.b?.is_pending && (t.f & (ke | Pe | mt)) !== 0 && (t.f & oe) === 0) {
      t.b.defer_effect(t);
      return;
    }
    for (var r = t; r.parent !== null; ) {
      r = r.parent;
      var n = r.f;
      if (be !== null && r === v && (_ === null || (_.f & $) === 0))
        return;
      if ((n & (K | B)) !== 0) {
        if ((n & k) === 0)
          return;
        r.f ^= k;
      }
    }
    this.#i.push(r);
  }
  #m() {
    _e === null ? at = _e = this : (_e.#o = this, this.#t = _e), _e = this;
  }
  #w() {
    var t = this.#t, r = this.#o;
    t === null ? at = r : t.#o = r, r === null ? _e = t : r.#t = t, this.linked = !1;
  }
}
function tr(e) {
  var t = Ie;
  Ie = !0;
  try {
    for (var r; ; ) {
      if (gn(), g === null)
        return (
          /** @type {T} */
          r
        );
      g.flush();
    }
  } finally {
    Ie = t;
  }
}
function wn() {
  try {
    Qr();
  } catch (e) {
    te(e, dt);
  }
}
let U = null;
function Ot(e) {
  var t = e.length;
  if (t !== 0) {
    for (var r = 0; r < t; ) {
      var n = e[r++];
      if ((n.f & (H | N)) === 0 && je(n) && (U = /* @__PURE__ */ new Set(), Se(n), n.deps === null && n.first === null && n.nodes === null && n.teardown === null && n.ac === null && mr(n), U?.size > 0)) {
        fe.clear();
        for (const i of U) {
          if ((i.f & (H | N)) !== 0) continue;
          const s = [i];
          let o = i.parent;
          for (; o !== null; )
            U.has(o) && (U.delete(o), s.push(o)), o = o.parent;
          for (let l = s.length - 1; l >= 0; l--) {
            const a = s[l];
            (a.f & (H | N)) === 0 && Se(a);
          }
        }
        U.clear();
      }
    }
    U = null;
  }
}
function rr(e, t, r, n) {
  if (!r.has(e) && (r.add(e), e.reactions !== null))
    for (const i of e.reactions) {
      const s = i.f;
      (s & $) !== 0 ? rr(
        /** @type {Derived} */
        i,
        t,
        r,
        n
      ) : (s & (we | M)) !== 0 && (s & E) === 0 && kt(i, t, n) && (w(i, E), xt(
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
  g.schedule(e);
}
function nr(e, t) {
  if (!((e.f & B) !== 0 && (e.f & k) !== 0)) {
    (e.f & E) !== 0 ? t.d.push(e) : (e.f & q) !== 0 && t.m.push(e), w(e, k);
    for (var r = e.first; r !== null; )
      nr(r, t), r = r.next;
  }
}
function ir(e) {
  w(e, k);
  for (var t = e.first; t !== null; )
    ir(t), t = t.next;
}
function yn(e) {
  let t = 0, r = De(0), n;
  return () => {
    St() && (G(r), gr(() => (t === 0 && (n = Vn(() => e(() => Ne(r)))), t += 1, () => {
      ne(() => {
        t -= 1, t === 0 && (n?.(), n = void 0, Ne(r));
      });
    })));
  };
}
var kn = Oe | pe;
function xn(e, t, r, n) {
  new En(e, t, r, n);
}
class En {
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
  #o;
  /** @type {((anchor: Node) => void)} */
  #c;
  /** @type {Effect} */
  #s;
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
  #g = yn(() => (this.#h = De(this.#i), () => {
    this.#h = null;
  }));
  /**
   * @param {TemplateNode} node
   * @param {BoundaryProps} props
   * @param {((anchor: Node) => void)} children
   * @param {((error: unknown) => unknown) | undefined} [transform_error]
   */
  constructor(t, r, n, i) {
    this.#e = t, this.#o = r, this.#c = (s) => {
      var o = (
        /** @type {Effect} */
        v
      );
      o.b = this, o.f |= ut, n(s);
    }, this.parent = /** @type {Effect} */
    v.b, this.transform_error = i ?? this.parent?.transform_error ?? ((s) => s), this.#s = Dn(() => {
      if (y) {
        const s = (
          /** @type {Comment} */
          this.#t
        );
        wt();
        const o = s.data === Ut;
        if (s.data.startsWith(It)) {
          const a = JSON.parse(s.data.slice(It.length));
          this.#_(a);
        } else o ? this.#k() : this.#y();
      } else
        this.#x();
    }, kn), y && (this.#e = b);
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
  #_(t) {
    const r = this.#o.failed;
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
    const t = this.#o.pending;
    t && (this.is_pending = !0, this.#r = ae(() => t(this.#e)), ne(() => {
      var r = this.#l = document.createDocumentFragment(), n = Z();
      r.append(n), this.#a = this.#v(() => ae(() => this.#c(n))), this.#p === 0 && (this.#e.before(r), this.#l = null, Ye(
        /** @type {Effect} */
        this.#r,
        () => {
          this.#r = null;
        }
      ), this.#b(
        /** @type {Batch} */
        g
      ));
    }));
  }
  #x() {
    try {
      if (this.is_pending = this.has_pending_snippet(), this.#p = 0, this.#i = 0, this.#a = ae(() => {
        this.#c(this.#e);
      }), this.#p > 0) {
        var t = this.#l = document.createDocumentFragment();
        Hn(this.#a, t);
        const r = (
          /** @type {(anchor: Node) => void} */
          this.#o.pending
        );
        this.#r = ae(() => r(this.#e));
      } else
        this.#b(
          /** @type {Batch} */
          g
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
    return !!this.#o.pending;
  }
  /**
   * @template T
   * @param {() => T} fn
   */
  #v(t) {
    var r = v, n = _, i = S;
    V(this.#s), z(this.#s), Ee(this.#s.ctx);
    try {
      return X.ensure(), t();
    } catch (s) {
      return Jt(s), null;
    } finally {
      V(r), z(n), Ee(i);
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
    return this.#g(), G(
      /** @type {Source<number>} */
      this.#h
    );
  }
  /** @param {unknown} error */
  error(t) {
    if (!this.#o.onerror && !this.#o.failed)
      throw t;
    g?.is_fork ? (this.#a && g.skip_effect(this.#a), this.#r && g.skip_effect(this.#r), this.#n && g.skip_effect(this.#n), g.on_fork_commit(() => {
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
    ), fn(), F(hn()));
    var r = this.#o.onerror;
    let n = this.#o.failed;
    var i = !1, s = !1;
    const o = () => {
      if (i) {
        un();
        return;
      }
      i = !0, s && sn(), this.#n !== null && Ye(this.#n, () => {
        this.#n = null;
      }), this.#v(() => {
        this.#x();
      });
    }, l = (a) => {
      try {
        s = !0, r?.(a, o), s = !1;
      } catch (c) {
        te(c, this.#s && this.#s.parent);
      }
      n && (this.#n = this.#v(() => {
        try {
          return ae(() => {
            var c = (
              /** @type {Effect} */
              v
            );
            c.b = this, c.f |= ut, n(
              this.#e,
              () => a,
              () => o
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
    ne(() => {
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
function $n(e, t, r, n) {
  const i = Et;
  var s = e.filter((h) => !h.settled);
  if (r.length === 0 && s.length === 0) {
    n(t.map(i));
    return;
  }
  var o = (
    /** @type {Effect} */
    v
  ), l = Sn(), a = s.length === 1 ? s[0].promise : s.length > 1 ? Promise.all(s.map((h) => h.promise)) : null;
  function c(h) {
    if ((o.f & H) === 0) {
      l();
      try {
        n(h);
      } catch (d) {
        te(d, o);
      }
      Je();
    }
  }
  var u = sr();
  if (r.length === 0) {
    a.then(() => c(t.map(i))).finally(u);
    return;
  }
  function f() {
    Promise.all(r.map((h) => /* @__PURE__ */ An(h))).then((h) => c([...t.map(i), ...h])).catch((h) => te(h, o)).finally(u);
  }
  a ? a.then(() => {
    l(), f(), Je();
  }) : f();
}
function Sn() {
  var e = (
    /** @type {Effect} */
    v
  ), t = _, r = S, n = (
    /** @type {Batch} */
    g
  );
  return function(s = !0) {
    V(e), z(t), Ee(r), s && (e.f & H) === 0 && (n?.activate(), n?.apply());
  };
}
function Je(e = !0) {
  V(null), z(null), Ee(null), e && g?.deactivate();
}
function sr() {
  var e = (
    /** @type {Effect} */
    v
  ), t = (
    /** @type {Boundary} */
    e.b
  ), r = (
    /** @type {Batch} */
    g
  ), n = t.is_rendered();
  return t.update_pending_count(1, r), r.increment(n, e), () => {
    t.update_pending_count(-1, r), r.decrement(n, e);
  };
}
// @__NO_SIDE_EFFECTS__
function Et(e) {
  var t = $ | E;
  return v !== null && (v.f |= pe), {
    ctx: S,
    deps: null,
    effects: null,
    equals: Gt,
    f: t,
    fn: e,
    reactions: null,
    rv: 0,
    v: (
      /** @type {V} */
      x
    ),
    wv: 0,
    parent: v,
    ac: null
  };
}
const He = Symbol("obsolete");
// @__NO_SIDE_EFFECTS__
function An(e, t, r) {
  let n = (
    /** @type {Effect | null} */
    v
  );
  n === null && Kr();
  var i = (
    /** @type {Promise<V>} */
    /** @type {unknown} */
    void 0
  ), s = De(
    /** @type {V} */
    x
  ), o = !_, l = /* @__PURE__ */ new Set();
  return Ln(() => {
    var a = (
      /** @type {Effect} */
      v
    ), c = qt();
    i = c.promise;
    try {
      Promise.resolve(e()).then(c.resolve, (d) => {
        d !== tt && c.reject(d);
      }).finally(Je);
    } catch (d) {
      c.reject(d), Je();
    }
    var u = (
      /** @type {Batch} */
      g
    );
    if (o) {
      if ((a.f & oe) !== 0)
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
      f?.(), l.delete(c), p !== He && (u.activate(), p ? (s.f |= re, et(s, p)) : ((s.f & re) !== 0 && (s.f ^= re), et(s, d)), u.deactivate());
    };
    c.promise.then(h, (d) => h(null, d || "unknown"));
  }), vr(() => {
    for (const a of l)
      a.reject(He);
  }), new Promise((a) => {
    function c(u) {
      function f() {
        u === i ? a(s) : c(i);
      }
      u.then(f, f);
    }
    c(i);
  });
}
// @__NO_SIDE_EFFECTS__
function Qi(e) {
  const t = /* @__PURE__ */ Et(e);
  return kr(t), t;
}
// @__NO_SIDE_EFFECTS__
function es(e) {
  const t = /* @__PURE__ */ Et(e);
  return t.equals = Kt, t;
}
function Tn(e) {
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
  var t, r = v, n = e.parent;
  if (!se && n !== null && (n.f & (H | N)) !== 0)
    return cn(), e.v;
  V(n);
  try {
    e.f &= ~de, Tn(e), t = Sr(e);
  } finally {
    V(r);
  }
  return t;
}
function or(e) {
  var t = $t(e);
  if (!e.equals(t) && (e.wv = Er(), (!g?.is_fork || e.deps === null) && (g !== null ? (g.capture(e, t, !0), ht?.capture(e, t, !0)) : e.v = t, e.deps === null))) {
    w(e, k);
    return;
  }
  se || (L !== null ? (St() || g?.is_fork) && L.set(e, t) : yt(e));
}
function Cn(e) {
  if (e.effects !== null)
    for (const t of e.effects)
      (t.teardown || t.ac) && (t.teardown?.(), t.ac?.abort(tt), t.teardown = Hr, t.ac = null, ze(t, 0), At(t));
}
function ar(e) {
  if (e.effects !== null)
    for (const t of e.effects)
      t.teardown && Se(t);
}
let Qe = /* @__PURE__ */ new Set();
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
function Rn(e, t = !1, r = !0) {
  const n = De(e);
  return t || (n.equals = Kt), n;
}
function ee(e, t, r = !1) {
  _ !== null && // since we are untracking the function inside `$inspect.with` we need to add this check
  // to ensure we error if state is set inside an inspect effect
  (!D || (_.f & Xe) !== 0) && Xt() && (_.f & ($ | M | we | Xe)) !== 0 && (O === null || !ye.call(O, e)) && nn();
  let n = r ? Te(t) : t;
  return et(e, n, Ve);
}
function et(e, t, r = null) {
  if (!e.equals(t)) {
    fe.set(e, se ? t : e.v);
    var n = X.ensure();
    if (n.capture(e, t), (e.f & $) !== 0) {
      const i = (
        /** @type {Derived} */
        e
      );
      (e.f & E) !== 0 && $t(i), L === null && yt(i);
    }
    e.wv = Er(), cr(e, E, r), v !== null && (v.f & k) !== 0 && (v.f & (B | K)) === 0 && (R === null ? Bn([e]) : R.push(e)), !n.is_fork && Qe.size > 0 && !lr && In();
  }
  return t;
}
function In() {
  lr = !1;
  for (const e of Qe) {
    (e.f & k) !== 0 && w(e, q);
    let t;
    try {
      t = je(e);
    } catch {
      t = !0;
    }
    t && Se(e);
  }
  Qe.clear();
}
function Ne(e) {
  ee(e, e.v + 1);
}
function cr(e, t, r) {
  var n = e.reactions;
  if (n !== null)
    for (var i = n.length, s = 0; s < i; s++) {
      var o = n[s], l = o.f, a = (l & E) === 0;
      if (a && w(o, t), (l & Xe) !== 0)
        Qe.add(
          /** @type {Effect} */
          o
        );
      else if ((l & $) !== 0) {
        var c = (
          /** @type {Derived} */
          o
        );
        L?.delete(c), (l & de) === 0 && (l & I && (v === null || (v.f & Ze) === 0) && (o.f |= de), cr(c, q, r));
      } else if (a) {
        var u = (
          /** @type {Effect} */
          o
        );
        (l & M) !== 0 && U !== null && U.add(u), r !== null ? r.push(u) : xt(u);
      }
    }
}
function Te(e) {
  if (typeof e != "object" || e === null || ue in e)
    return e;
  const t = Bt(e);
  if (t !== jr && t !== Fr)
    return e;
  var r = /* @__PURE__ */ new Map(), n = Pr(e), i = /* @__PURE__ */ Q(0), s = he, o = (l) => {
    if (he === s)
      return l();
    var a = _, c = he;
    z(null), Dt(s);
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
        (!("value" in c) || c.configurable === !1 || c.enumerable === !1 || c.writable === !1) && tn();
        var u = r.get(a);
        return u === void 0 ? o(() => {
          var f = /* @__PURE__ */ Q(c.value);
          return r.set(a, f), f;
        }) : ee(u, c.value, !0), !0;
      },
      deleteProperty(l, a) {
        var c = r.get(a);
        if (c === void 0) {
          if (a in l) {
            const u = o(() => /* @__PURE__ */ Q(x));
            r.set(a, u), Ne(i);
          }
        } else
          ee(c, x), Ne(i);
        return !0;
      },
      get(l, a, c) {
        if (a === ue)
          return e;
        var u = r.get(a), f = a in l;
        if (u === void 0 && (!f || me(l, a)?.writable) && (u = o(() => {
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
        if (c !== void 0 || v !== null && (!u || me(l, a)?.writable)) {
          c === void 0 && (c = o(() => {
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
            p !== void 0 ? ee(p, x) : d in l && (p = o(() => /* @__PURE__ */ Q(x)), r.set(d + "", p));
          }
        if (f === void 0)
          (!h || me(l, a)?.writable) && (f = o(() => /* @__PURE__ */ Q(void 0)), ee(f, Te(c)), r.set(a, f));
        else {
          h = f.v !== x;
          var m = o(() => Te(c));
          ee(f, m);
        }
        var T = Reflect.getOwnPropertyDescriptor(l, a);
        if (T?.set && T.set.call(u, c), !h) {
          if (n && typeof a == "string") {
            var Y = (
              /** @type {Source<number>} */
              r.get("length")
            ), ve = Number(a);
            Number.isInteger(ve) && ve >= Y.v && ee(Y, ve + 1);
          }
          Ne(i);
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
        rn();
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
function ts(e, t) {
  return Object.is(zt(e), zt(t));
}
var Pt, ur, fr, hr;
function pt() {
  if (Pt === void 0) {
    Pt = window, ur = /Firefox/.test(navigator.userAgent);
    var e = Element.prototype, t = Node.prototype, r = Text.prototype;
    fr = me(t, "firstChild").get, hr = me(t, "nextSibling").get, Ct(e) && (e[Ur] = void 0, e[Yr] = null, e[Wr] = void 0, e.__e = void 0), Ct(r) && (r[ft] = void 0);
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
function rs(e, t) {
  if (!y)
    return /* @__PURE__ */ $e(e);
  var r = /* @__PURE__ */ $e(b);
  if (r === null)
    r = b.appendChild(Z());
  else if (t && r.nodeType !== Me) {
    var n = Z();
    return r?.before(n), F(n), n;
  }
  return t && it(
    /** @type {Text} */
    r
  ), F(r), r;
}
function ns(e, t = !1) {
  if (!y) {
    var r = /* @__PURE__ */ $e(e);
    return r instanceof Comment && r.data === "" ? /* @__PURE__ */ J(r) : r;
  }
  if (t) {
    if (b?.nodeType !== Me) {
      var n = Z();
      return b?.before(n), F(n), n;
    }
    it(
      /** @type {Text} */
      b
    );
  }
  return b;
}
function is(e, t = 1, r = !1) {
  let n = y ? b : e;
  for (var i; t--; )
    i = n, n = /** @type {TemplateNode} */
    /* @__PURE__ */ J(n);
  if (!y)
    return n;
  if (r) {
    if (n?.nodeType !== Me) {
      var s = Z();
      return n === null ? i?.after(s) : n.before(s), F(s), s;
    }
    it(
      /** @type {Text} */
      n
    );
  }
  return F(n), n;
}
function Nn(e) {
  e.textContent = "";
}
function ss() {
  return !1;
}
function dr(e, t, r) {
  return (
    /** @type {T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : Element} */
    document.createElementNS(t ?? ln, e, void 0)
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
function os(e, t) {
  if (t) {
    const r = document.body;
    e.autofocus = !0, ne(() => {
      document.activeElement === r && e.focus();
    });
  }
}
let Mt = !1;
function On() {
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
function st(e) {
  var t = _, r = v;
  z(null), V(null);
  try {
    return e();
  } finally {
    z(t), V(r);
  }
}
function as(e, t, r, n = r) {
  e.addEventListener(t, () => st(r));
  const i = (
    /** @type {any} */
    e[qe]
  );
  i ? e[qe] = () => {
    i(), n(!0);
  } : e[qe] = () => n(!0), On();
}
function pr(e) {
  v === null && (_ === null && Jr(), Zr()), se && Xr();
}
function zn(e, t) {
  var r = t.last;
  r === null ? t.last = t.first = e : (r.next = e, e.prev = r, t.last = e);
}
function P(e, t) {
  var r = v;
  r !== null && (r.f & N) !== 0 && (e |= N);
  var n = {
    ctx: S,
    deps: null,
    nodes: null,
    f: e | E | I,
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
  g?.register_created_effect(n);
  var i = n;
  if ((e & ke) !== 0)
    be !== null ? be.push(n) : X.ensure().schedule(n);
  else if (t !== null) {
    try {
      Se(n);
    } catch (o) {
      throw j(n), o;
    }
    i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && // either `null`, or a singular child
    (i.f & pe) === 0 && (i = i.first, (e & M) !== 0 && (e & Oe) !== 0 && i !== null && (i.f |= Oe));
  }
  if (i !== null && (i.parent = r, r !== null && zn(i, r), _ !== null && (_.f & $) !== 0 && (e & K) === 0)) {
    var s = (
      /** @type {Derived} */
      _
    );
    (s.effects ??= []).push(i);
  }
  return n;
}
function St() {
  return _ !== null && !D;
}
function vr(e) {
  const t = P(Pe, null);
  return w(t, k), t.teardown = e, t;
}
function ls(e) {
  pr();
  var t = (
    /** @type {Effect} */
    v.f
  ), r = !_ && (t & B) !== 0 && (t & oe) === 0;
  if (r) {
    var n = (
      /** @type {ComponentContext} */
      S
    );
    (n.e ??= []).push(e);
  } else
    return _r(e);
}
function _r(e) {
  return P(ke | Vt, e);
}
function cs(e) {
  return pr(), P(Pe | Vt, e);
}
function Pn(e) {
  X.ensure();
  const t = P(K | pe, e);
  return () => {
    j(t);
  };
}
function Mn(e) {
  X.ensure();
  const t = P(K | pe, e);
  return (r = {}) => new Promise((n) => {
    r.outro ? Ye(t, () => {
      j(t), n(void 0);
    }) : (j(t), n(void 0));
  });
}
function us(e) {
  return P(ke, e);
}
function Ln(e) {
  return P(we | pe, e);
}
function gr(e, t = 0) {
  return P(Pe | t, e);
}
function fs(e, t = [], r = [], n = []) {
  $n(n, t, r, (i) => {
    P(Pe, () => e(...i.map(G)));
  });
}
function Dn(e, t = 0) {
  var r = P(M | t, e);
  return r;
}
function hs(e, t = 0) {
  var r = P(mt | t, e);
  return r;
}
function ae(e) {
  return P(B | pe, e);
}
function br(e) {
  var t = e.teardown;
  if (t !== null) {
    const r = se, n = _;
    Lt(!0), z(null);
    try {
      t.call(null);
    } finally {
      Lt(r), z(n);
    }
  }
}
function At(e, t = !1) {
  var r = e.first;
  for (e.first = e.last = null; r !== null; ) {
    const i = r.ac;
    i !== null && st(() => {
      i.abort(tt);
    });
    var n = r.next;
    (r.f & K) !== 0 ? r.parent = null : j(r, t), r = n;
  }
}
function jn(e) {
  for (var t = e.first; t !== null; ) {
    var r = t.next;
    (t.f & B) === 0 && j(t), t = r;
  }
}
function j(e, t = !0) {
  var r = !1;
  (t || (e.f & qr) !== 0) && e.nodes !== null && e.nodes.end !== null && (Fn(
    e.nodes.start,
    /** @type {TemplateNode} */
    e.nodes.end
  ), r = !0), w(e, Rt), At(e, t && !r), ze(e, 0);
  var n = e.nodes && e.nodes.t;
  if (n !== null)
    for (const s of n)
      s.stop();
  br(e), e.f ^= Rt, e.f |= H;
  var i = e.parent;
  i !== null && i.first !== null && mr(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Fn(e, t) {
  for (; e !== null; ) {
    var r = e === t ? null : /* @__PURE__ */ J(e);
    e.remove(), e = r;
  }
}
function mr(e) {
  var t = e.parent, r = e.prev, n = e.next;
  r !== null && (r.next = n), n !== null && (n.prev = r), t !== null && (t.first === e && (t.first = n), t.last === e && (t.last = r));
}
function Ye(e, t, r = !0) {
  var n = [];
  wr(e, n, !0);
  var i = () => {
    r && j(e), t && t();
  }, s = n.length;
  if (s > 0) {
    var o = () => --s || i();
    for (var l of n)
      l.out(o);
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
      var s = i.next;
      if ((i.f & K) === 0) {
        var o = (i.f & Oe) !== 0 || // If this is a branch effect without a block effect parent,
        // it means the parent block effect was pruned. In that case,
        // transparency information was transferred to the branch effect.
        (i.f & B) !== 0 && (e.f & M) !== 0;
        wr(i, t, o ? r : !1);
      }
      i = s;
    }
  }
}
function ds(e) {
  yr(e, !0);
}
function yr(e, t) {
  if ((e.f & N) !== 0) {
    e.f ^= N, (e.f & k) === 0 && (w(e, E), X.ensure().schedule(e));
    for (var r = e.first; r !== null; ) {
      var n = r.next, i = (r.f & Oe) !== 0 || (r.f & B) !== 0;
      yr(r, i ? t : !1), r = n;
    }
    var s = e.nodes && e.nodes.t;
    if (s !== null)
      for (const o of s)
        (o.is_global || t) && o.in();
  }
}
function Hn(e, t) {
  if (e.nodes)
    for (var r = e.nodes.start, n = e.nodes.end; r !== null; ) {
      var i = r === n ? null : /* @__PURE__ */ J(r);
      t.append(r), r = i;
    }
}
let Ue = !1, se = !1;
function Lt(e) {
  se = e;
}
let _ = null, D = !1;
function z(e) {
  _ = e;
}
let v = null;
function V(e) {
  v = e;
}
let O = null;
function kr(e) {
  _ !== null && (O === null ? O = [e] : O.push(e));
}
let A = null, C = 0, R = null;
function Bn(e) {
  R = e;
}
let xr = 1, ce = 0, he = ce;
function Dt(e) {
  he = e;
}
function Er() {
  return ++xr;
}
function je(e) {
  var t = e.f;
  if ((t & E) !== 0)
    return !0;
  if (t & $ && (e.f &= ~de), (t & q) !== 0) {
    for (var r = (
      /** @type {Value[]} */
      e.deps
    ), n = r.length, i = 0; i < n; i++) {
      var s = r[i];
      if (je(
        /** @type {Derived} */
        s
      ) && or(
        /** @type {Derived} */
        s
      ), s.wv > e.wv)
        return !0;
    }
    (t & I) !== 0 && // During time traveling we don't want to reset the status so that
    // traversal of the graph in the other batches still happens
    L === null && w(e, k);
  }
  return !1;
}
function $r(e, t, r = !0) {
  var n = e.reactions;
  if (n !== null && !(O !== null && ye.call(O, e)))
    for (var i = 0; i < n.length; i++) {
      var s = n[i];
      (s.f & $) !== 0 ? $r(
        /** @type {Derived} */
        s,
        t,
        !1
      ) : t === s && (r ? w(s, E) : (s.f & k) !== 0 && w(s, q), xt(
        /** @type {Effect} */
        s
      ));
    }
}
function Sr(e) {
  var t = A, r = C, n = R, i = _, s = O, o = S, l = D, a = he, c = e.f;
  A = /** @type {null | Value[]} */
  null, C = 0, R = null, _ = (c & (B | K)) === 0 ? e : null, O = null, Ee(e.ctx), D = !1, he = ++ce, e.ac !== null && (st(() => {
    e.ac.abort(tt);
  }), e.ac = null);
  try {
    e.f |= Ze;
    var u = (
      /** @type {Function} */
      e.fn
    ), f = u();
    e.f |= oe;
    var h = e.deps, d = g?.is_fork;
    if (A !== null) {
      var p;
      if (d || ze(e, C), h !== null && C > 0)
        for (h.length = C + A.length, p = 0; p < A.length; p++)
          h[C + p] = A[p];
      else
        e.deps = h = A;
      if (St() && (e.f & I) !== 0)
        for (p = C; p < h.length; p++)
          (h[p].reactions ??= []).push(e);
    } else !d && h !== null && C < h.length && (ze(e, C), h.length = C);
    if (Xt() && R !== null && !D && h !== null && (e.f & ($ | q | E)) === 0)
      for (p = 0; p < /** @type {Source[]} */
      R.length; p++)
        $r(
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
    return Jt(m);
  } finally {
    e.f ^= Ze, A = t, C = r, R = n, _ = i, O = s, Ee(o), D = l, he = a;
  }
}
function qn(e, t) {
  let r = t.reactions;
  if (r !== null) {
    var n = Mr.call(r, e);
    if (n !== -1) {
      var i = r.length - 1;
      i === 0 ? r = t.reactions = null : (r[n] = r[i], r.pop());
    }
  }
  if (r === null && (t.f & $) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
  // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
  // allows us to skip the expensive work of disconnecting and immediately reconnecting it
  (A === null || !ye.call(A, t))) {
    var s = (
      /** @type {Derived} */
      t
    );
    (s.f & I) !== 0 && (s.f ^= I, s.f &= ~de), s.v !== x && yt(s), Cn(s), ze(s, 0);
  }
}
function ze(e, t) {
  var r = e.deps;
  if (r !== null)
    for (var n = t; n < r.length; n++)
      qn(e, r[n]);
}
function Se(e) {
  var t = e.f;
  if ((t & H) === 0) {
    w(e, k);
    var r = v, n = Ue;
    v = e, Ue = !0;
    try {
      (t & (M | mt)) !== 0 ? jn(e) : At(e), br(e);
      var i = Sr(e);
      e.teardown = typeof i == "function" ? i : null, e.wv = xr;
      var s;
    } finally {
      Ue = n, v = r;
    }
  }
}
async function ps() {
  await Promise.resolve(), tr();
}
function G(e) {
  var t = e.f, r = (t & $) !== 0;
  if (_ !== null && !D) {
    var n = v !== null && (v.f & H) !== 0;
    if (!n && (O === null || !ye.call(O, e))) {
      var i = _.deps;
      if ((_.f & Ze) !== 0)
        e.rv < ce && (e.rv = ce, A === null && i !== null && i[C] === e ? C++ : A === null ? A = [e] : A.push(e));
      else {
        (_.deps ??= []).push(e);
        var s = e.reactions;
        s === null ? e.reactions = [_] : ye.call(s, _) || s.push(_);
      }
    }
  }
  if (se && fe.has(e))
    return fe.get(e);
  if (r) {
    var o = (
      /** @type {Derived} */
      e
    );
    if (se) {
      var l = o.v;
      return ((o.f & k) === 0 && o.reactions !== null || Tr(o)) && (l = $t(o)), fe.set(o, l), l;
    }
    var a = (o.f & I) === 0 && !D && _ !== null && (Ue || (_.f & I) !== 0), c = (o.f & oe) === 0;
    je(o) && (a && (o.f |= I), or(o)), a && !c && (ar(o), Ar(o));
  }
  if (L?.has(e))
    return L.get(e);
  if ((e.f & re) !== 0)
    throw e.v;
  return e.v;
}
function Ar(e) {
  if (e.f |= I, e.deps !== null)
    for (const t of e.deps)
      (t.reactions ??= []).push(e), (t.f & $) !== 0 && (t.f & I) === 0 && (ar(
        /** @type {Derived} */
        t
      ), Ar(
        /** @type {Derived} */
        t
      ));
}
function Tr(e) {
  if (e.v === x) return !0;
  if (e.deps === null) return !1;
  for (const t of e.deps)
    if (fe.has(t) || (t.f & $) !== 0 && Tr(
      /** @type {Derived} */
      t
    ))
      return !0;
  return !1;
}
function Vn(e) {
  var t = D;
  try {
    return D = !0, e();
  } finally {
    D = t;
  }
}
function vs(e) {
  if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
    if (ue in e)
      vt(e);
    else if (!Array.isArray(e))
      for (let t in e) {
        const r = e[t];
        typeof r == "object" && r && ue in r && vt(r);
      }
  }
}
function vt(e, t = /* @__PURE__ */ new Set()) {
  if (typeof e == "object" && e !== null && // We don't want to traverse DOM elements
  !(e instanceof EventTarget) && !t.has(e)) {
    t.add(e), e instanceof Date && e.getTime();
    for (let n in e)
      try {
        vt(e[n], t);
      } catch {
      }
    const r = Bt(e);
    if (r !== Object.prototype && r !== Array.prototype && r !== Map.prototype && r !== Set.prototype && r !== Date.prototype) {
      const n = Dr(r);
      for (let i in n) {
        const s = n[i].get;
        if (s)
          try {
            s.call(e);
          } catch {
          }
      }
    }
  }
}
function _s(e) {
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
function gs(e) {
  return Yn.includes(e);
}
const Un = {
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
function bs(e) {
  return e = e.toLowerCase(), Un[e] ?? e;
}
const Wn = ["touchstart", "touchmove"];
function Gn(e) {
  return Wn.includes(e);
}
const Kn = (
  /** @type {const} */
  ["textarea", "script", "style", "title"]
);
function ms(e) {
  return Kn.includes(
    /** @type {typeof RAW_TEXT_ELEMENTS[number]} */
    e
  );
}
const Ce = Symbol("events"), Cr = /* @__PURE__ */ new Set(), _t = /* @__PURE__ */ new Set();
function ws(e) {
  if (!y) return;
  e.removeAttribute("onload"), e.removeAttribute("onerror");
  const t = e.__e;
  t !== void 0 && (e.__e = void 0, queueMicrotask(() => {
    e.isConnected && e.dispatchEvent(t);
  }));
}
function Rr(e, t, r, n = {}) {
  function i(s) {
    if (n.capture || gt.call(t, s), !s.cancelBubble)
      return st(() => r?.call(this, s));
  }
  return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? ne(() => {
    t.addEventListener(e, i, n);
  }) : t.addEventListener(e, i, n), i;
}
function ys(e, t, r, n = {}) {
  var i = Rr(t, e, r, n);
  return () => {
    e.removeEventListener(t, i, n);
  };
}
function ks(e, t, r, n, i) {
  var s = { capture: n, passive: i }, o = Rr(e, t, r, s);
  (t === document.body || // @ts-ignore
  t === window || // @ts-ignore
  t === document || // Firefox has quirky behavior, it can happen that we still get "canplay" events when the element is already removed
  t instanceof HTMLMediaElement) && vr(() => {
    t.removeEventListener(e, o, s);
  });
}
function xs(e, t, r) {
  (t[Ce] ??= {})[e] = r;
}
function Es(e) {
  for (var t = 0; t < e.length; t++)
    Cr.add(e[t]);
  for (var r of _t)
    r(e);
}
let jt = null;
function gt(e) {
  var t = this, r = (
    /** @type {Node} */
    t.ownerDocument
  ), n = e.type, i = e.composedPath?.() || [], s = (
    /** @type {null | Element} */
    i[0] || e.target
  );
  jt = e;
  var o = 0, l = jt === e && e[Ce];
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
    a <= c && (o = a);
  }
  if (s = /** @type {Element} */
  i[o] || e.target, s !== t) {
    Ke(e, "currentTarget", {
      configurable: !0,
      get() {
        return s || r;
      }
    });
    var u = _, f = v;
    z(null), V(null);
    try {
      for (var h, d = []; s !== null; ) {
        var p = s.assignedSlot || s.parentNode || /** @type {any} */
        s.host || null;
        try {
          var m = s[Ce]?.[n];
          m != null && (!/** @type {any} */
          s.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
          // -> the target could not have been disabled because it emits the event in the first place
          e.target === s) && m.call(s, e);
        } catch (T) {
          h ? d.push(T) : h = T;
        }
        if (e.cancelBubble || p === t || p === null)
          break;
        s = p;
      }
      if (h) {
        for (let T of d)
          queueMicrotask(() => {
            throw T;
          });
        throw h;
      }
    } finally {
      e[Ce] = t, delete e.currentTarget, z(u), V(f);
    }
  }
}
const Xn = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", {
    /** @param {string} html */
    createHTML: (e) => e
  })
);
function Zn(e) {
  return (
    /** @type {string} */
    Xn?.createHTML(e) ?? e
  );
}
function Jn(e) {
  var t = dr("template");
  return t.innerHTML = Zn(e.replaceAll("<!>", "<!---->")), t.content;
}
function ie(e, t) {
  var r = (
    /** @type {Effect} */
    v
  );
  r.nodes === null && (r.nodes = { start: e, end: t, a: null, t: null });
}
// @__NO_SIDE_EFFECTS__
function $s(e, t) {
  var r = (t & on) !== 0, n = (t & an) !== 0, i, s = !e.startsWith("<!>");
  return () => {
    if (y)
      return ie(b, null), b;
    i === void 0 && (i = Jn(s ? e : "<!>" + e), r || (i = /** @type {TemplateNode} */
    /* @__PURE__ */ $e(i)));
    var o = (
      /** @type {TemplateNode} */
      n || ur ? document.importNode(i, !0) : i.cloneNode(!0)
    );
    if (r) {
      var l = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ $e(o)
      ), a = (
        /** @type {TemplateNode} */
        o.lastChild
      );
      ie(l, a);
    } else
      ie(o, o);
    return o;
  };
}
function Ss(e = "") {
  if (!y) {
    var t = Z(e + "");
    return ie(t, t), t;
  }
  var r = b;
  return r.nodeType !== Me ? (r.before(r = Z()), F(r)) : it(
    /** @type {Text} */
    r
  ), ie(r, r), r;
}
function As() {
  if (y)
    return ie(b, null), b;
  var e = document.createDocumentFragment(), t = document.createComment(""), r = Z();
  return e.append(t, r), ie(t, r), e;
}
function Qn(e, t) {
  if (y) {
    var r = (
      /** @type {Effect & { nodes: EffectNodes }} */
      v
    );
    ((r.f & oe) === 0 || r.nodes.end === null) && (r.nodes.end = b), wt();
    return;
  }
  e !== null && e.before(
    /** @type {Node} */
    t
  );
}
function Ts() {
  if (y && b && b.nodeType === Le && b.textContent?.startsWith("$")) {
    const e = b.textContent.substring(1);
    return wt(), e;
  }
  return (window.__svelte ??= {}).uid ??= 1, `c${window.__svelte.uid++}`;
}
function Cs(e, t) {
  var r = t == null ? "" : typeof t == "object" ? `${t}` : t;
  r !== /** @type {any} */
  (e[ft] ??= e.nodeValue) && (e[ft] = r, e.nodeValue = `${r}`);
}
function Tt(e, t) {
  return Ir(e, t);
}
function ei(e, t) {
  pt(), t.intro = t.intro ?? !1;
  const r = t.target, n = y, i = b;
  try {
    for (var s = /* @__PURE__ */ $e(r); s && (s.nodeType !== Le || /** @type {Comment} */
    s.data !== Yt); )
      s = /* @__PURE__ */ J(s);
    if (!s)
      throw xe;
    Fe(!0), F(
      /** @type {Comment} */
      s
    );
    const o = Ir(e, { ...t, anchor: s });
    return Fe(!1), /**  @type {Exports} */
    o;
  } catch (o) {
    if (o instanceof Error && o.message.split(`
`).some((l) => l.startsWith("https://svelte.dev/e/")))
      throw o;
    return o !== xe && console.warn("Failed to hydrate: ", o), t.recover === !1 && en(), pt(), Nn(r), Fe(!1), Tt(e, t);
  } finally {
    Fe(n), F(i);
  }
}
const Be = /* @__PURE__ */ new Map();
function Ir(e, { target: t, anchor: r, props: n = {}, events: i, context: s, intro: o = !0, transformError: l }) {
  pt();
  var a = void 0, c = Mn(() => {
    var u = r ?? t.appendChild(Z());
    xn(
      /** @type {TemplateNode} */
      u,
      {
        pending: () => {
        }
      },
      (d) => {
        pn({});
        var p = (
          /** @type {ComponentContext} */
          S
        );
        if (s && (p.c = s), i && (n.$$events = i), y && ie(
          /** @type {TemplateNode} */
          d,
          null
        ), a = e(d, n) || {}, y && (v.nodes.end = b, b === null || b.nodeType !== Le || /** @type {Comment} */
        b.data !== Wt))
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
          var T = Gn(m);
          for (const ot of [t, document]) {
            var Y = Be.get(ot);
            Y === void 0 && (Y = /* @__PURE__ */ new Map(), Be.set(ot, Y));
            var ve = Y.get(m);
            ve === void 0 ? (ot.addEventListener(m, gt, { passive: T }), Y.set(m, 1)) : Y.set(m, ve + 1);
          }
        }
      }
    };
    return h(Lr(Cr)), _t.add(h), () => {
      for (var d of f)
        for (const T of [t, document]) {
          var p = (
            /** @type {Map<string, number>} */
            Be.get(T)
          ), m = (
            /** @type {number} */
            p.get(d)
          );
          --m == 0 ? (T.removeEventListener(d, gt), p.delete(d), p.size === 0 && Be.delete(T)) : p.set(d, m);
        }
      _t.delete(h), u !== r && u.parentNode?.removeChild(u);
    };
  });
  return bt.set(a, c), a;
}
let bt = /* @__PURE__ */ new WeakMap();
function Nr(e, t) {
  const r = bt.get(e);
  return r ? (bt.delete(e), r(t)) : Promise.resolve();
}
function ti(e) {
  return new ri(e);
}
class ri {
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
    var r = /* @__PURE__ */ new Map(), n = (s, o) => {
      var l = /* @__PURE__ */ Rn(o, !1, !1);
      return r.set(s, l), l;
    };
    const i = new Proxy(
      { ...t.props || {}, $$events: {} },
      {
        get(s, o) {
          return G(r.get(o) ?? n(o, Reflect.get(s, o)));
        },
        has(s, o) {
          return o === Vr ? !0 : (G(r.get(o) ?? n(o, Reflect.get(s, o))), Reflect.has(s, o));
        },
        set(s, o, l) {
          return ee(r.get(o) ?? n(o, l), l), Reflect.set(s, o, l);
        }
      }
    );
    this.#t = (t.hydrate ? ei : Tt)(t.component, {
      target: t.target,
      anchor: t.anchor,
      props: i,
      context: t.context,
      intro: t.intro ?? !1,
      recover: t.recover,
      transformError: t.transformError
    }), (!t?.props?.$$host || t.sync === !1) && tr(), this.#e = i.$$events;
    for (const s of Object.keys(this.#t))
      s === "$set" || s === "$destroy" || s === "$on" || Ke(this, s, {
        get() {
          return this.#t[s];
        },
        /** @param {any} value */
        set(o) {
          this.#t[s] = o;
        },
        enumerable: !0
      });
    this.#t.$set = /** @param {Record<string, any>} next */
    (s) => {
      Object.assign(i, s);
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
let Or;
typeof HTMLElement == "function" && (Or = class extends HTMLElement {
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
          const s = dr("slot");
          n !== "default" && (s.name = n), Qn(i, s);
        };
      };
      if (await Promise.resolve(), !this.$$cn || this.$$c)
        return;
      const t = {}, r = ni(this);
      for (const n of this.$$s)
        n in r && (n === "default" && !this.$$d.children ? (this.$$d.children = e(n), t.default = !0) : t[n] = e(n));
      for (const n of this.attributes) {
        const i = this.$$g_p(n.name);
        i in this.$$d || (this.$$d[i] = We(i, n.value, this.$$p_d, "toProp"));
      }
      for (const n in this.$$p_d)
        !(n in this.$$d) && this[n] !== void 0 && (this.$$d[n] = this[n], delete this[n]);
      this.$$c = ti({
        component: this.$$ctor,
        target: this.$$shadowRoot || this,
        props: {
          ...this.$$d,
          $$slots: t,
          $$host: this
        }
      }), this.$$me = Pn(() => {
        gr(() => {
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
          const s = this.$$c.$on(n, i);
          this.$$l_u.set(i, s);
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
function ni(e) {
  const t = {};
  return e.childNodes.forEach((r) => {
    t[
      /** @type {Element} node */
      r.slot || "default"
    ] = !0;
  }), t;
}
function Rs(e, t, r, n, i, s) {
  let o = class extends Or {
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
    Ke(o.prototype, l, {
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
    Ke(o.prototype, l, {
      get() {
        return this.$$c?.[l];
      }
    });
  }), e.element = /** @type {any} */
  o, o;
}
let zr;
const ii = "ehagaki.web-component.v1:", ge = /* @__PURE__ */ new Map(), si = {
  get length() {
    return ge.size;
  },
  clear() {
    ge.clear();
  },
  getItem(e) {
    return ge.get(e) ?? null;
  },
  key(e) {
    return [...ge.keys()][e] ?? null;
  },
  removeItem(e) {
    ge.delete(e);
  },
  setItem(e, t) {
    ge.set(e, String(t));
  }
};
function oi() {
  if (typeof globalThis < "u") {
    const e = globalThis.localStorage;
    if (e)
      return e;
  }
  return si;
}
function ai() {
  return zr ?? oi();
}
function li(e) {
  zr = e;
}
function ct(e, t) {
  const r = [];
  for (let n = 0; n < e.length; n += 1) {
    const i = e.key(n);
    i?.startsWith(t) && r.push(i.slice(t.length));
  }
  return r;
}
function ci(e, t) {
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
function ui(e) {
  return ci(
    e,
    ii
  );
}
function fi() {
  return {
    style: {
      setProperty: () => {
      },
      removeProperty: () => "",
      getPropertyValue: () => ""
    }
  };
}
function hi() {
  const e = typeof window < "u" ? window : void 0, t = e?.document, r = t?.documentElement ?? fi(), n = t?.body ?? r;
  return {
    storage: ai(),
    window: e,
    document: t,
    domRoot: t,
    styleTarget: r,
    layoutTarget: n,
    overlayTarget: n,
    themeTarget: r,
    layoutMode: "viewport",
    assetBase: e?.location?.href ? new URL(".", e.location.href) : void 0,
    // The implicit browser runtime retains the historic PWA behavior.
    // The Web Component entry explicitly opts out before importing App.
    serviceWorkerEnabled: !0,
    externalInputEnabled: !0,
    historyEnabled: !0,
    localNsecAuthEnabled: !0
  };
}
let Re = hi();
function di(e) {
  return Re = {
    ...Re,
    ...e
  }, li(Re.storage), Re;
}
function Is() {
  return Re;
}
const pi = ":root{--app-root-height: 100%;--app-root-top: 0px;--app-root-overflow-y: visible;--app-main-height: 100svh;--app-body-position: static;--app-body-inset: auto;--app-body-width: auto;--app-overlay-position: fixed;--app-overscroll-behavior: auto;--footer-height: 66px;--footer-bottom: 0px;--keyboard-height: 0px;--mobile-dialog-viewport-top: 0px;--mobile-dialog-viewport-height: 100dvh;--mobile-dialog-center-y: 43dvh;--keyboard-button-bar-height: 50px;--keyboard-button-bar-bottom: 66px;--main-content-keyboard-adjustment: var(--keyboard-height);--reason-input-base-height: 50px;--reason-input-height: 0px;--reason-input-bottom: 116px;--main-content-top-spacing: 6px;--composer-bottom-reserved-height: 116px;--accent-color-default: hsl(152, 74%, 43%);--accent-color: var(--accent-color-default);--theme: var(--accent-color);--text-black: hsl(0, 0%, 24%);--nostr-bg: hsl(270, 100%, 98%);--yellow: hsl(50, 100%, 50%);--danger: hsl(0, 84%, 60%);--darker: rgba(0, 0, 0, .8);--dark-gray: hsl(0, 0%, 66%);--light-gray: hsl(0, 0%, 83%);--surface-bg: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 94%)) 8%, hsl(0, 0%, 94%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 12%)) 8%, hsl(0, 0%, 12%)) );--surface-input: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 100%)) 5%, hsl(0, 0%, 100%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 19%)) 5%, hsl(0, 0%, 19%)) );--surface-footer: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 82%)) 12%, hsl(0, 0%, 82%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 10%)) 12%, hsl(0, 0%, 10%)) );--surface-buttonbar: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 91%)) 10%, hsl(0, 0%, 91%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 28%)) 10%, hsl(0, 0%, 28%)) );--surface-button: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 92%)) 8%, hsl(0, 0%, 92%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 25%)) 8%, hsl(0, 0%, 25%)) );--surface-button-border: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 75%)) 14%, hsl(0, 0%, 75%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 30%)) 14%, hsl(0, 0%, 30%)) );--surface-button-preview-action: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 74%)) 12%, hsl(0, 0%, 74%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 36%)) 12%, hsl(0, 0%, 36%)) );--surface-border: light-dark( color-mix(in srgb, var(--base-color, var(--light-gray)) 14%, var(--light-gray)), color-mix(in srgb, var(--base-color, dimgray) 14%, dimgray) );--surface-border-hr: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 84%)) 10%, hsl(0, 0%, 84%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 30%)) 10%, hsl(0, 0%, 30%)) );--surface-border-hr-light: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 92%)) 7%, hsl(0, 0%, 92%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 20%)) 7%, hsl(0, 0%, 20%)) );--surface-dialog: light-dark( color-mix(in srgb, var(--base-color, white) 5%, white), color-mix(in srgb, var(--base-color, hsl(0, 0%, 14%)) 5%, hsl(0, 0%, 14%)) );--surface-window: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 95%)) 5%, hsl(0, 0%, 95%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 14%)) 5%, hsl(0, 0%, 14%)) );--bg: var(--surface-bg);--bg-input: var(--surface-input);--bg-footer: var(--surface-footer);--bg-translucent: light-dark(#EDEDEDcc, #212121cc);--bg-buttonbar: var(--surface-buttonbar);--btn-bg: var(--surface-button);--btn-bg2: light-dark(color-mix(in srgb, var(--btn-bg), black 6%), color-mix(in srgb, var(--btn-bg), white 10%));--btn-bg3: light-dark(color-mix(in srgb, var(--btn-bg), black 11%), color-mix(in srgb, var(--btn-bg), white 20%));--btn-border: var(--surface-button-border);--btn-hover-bg: light-dark(rgba(50, 50, 50, .12), rgba(255, 255, 255, .12));--btn-post-preview-action: var(--surface-button-preview-action);--border: var(--surface-border);--border-hr: var(--surface-border-hr);--border-hr-light: var(--surface-border-hr-light);--semantic-text: light-dark(hsl(0, 0%, 24%), hsl(0, 0%, 90%));--text: var(--semantic-text);--text-light: light-dark(hsl(0, 0%, 46%), hsl(0, 0%, 75%));--text-muted: light-dark(hsl(0, 0%, 60%), hsl(0, 0%, 55%));--text-red: light-dark(hsl(0, 99%, 45%), hsl(0, 99%, 69%));--text-r: light-dark(#e6e6e6, #3D3D3D);--semantic-link: light-dark(#1a0dab, #99c3ff);--link: var(--semantic-link);--link-visited: light-dark(#681da8, #c58af9);--dialog-bg: var(--surface-dialog);--dialog-bg2: light-dark(color-mix(in srgb, var(--dialog-bg), black 6%), color-mix(in srgb, var(--dialog-bg), white 10%));--dialog-bg3: light-dark(color-mix(in srgb, var(--dialog-bg), black 11%), color-mix(in srgb, var(--dialog-bg), white 16%));--dialog-bg-overlay: light-dark(rgba(0, 0, 0, .6), rgba(0, 0, 0, .8));--window: var(--surface-window);--svg: light-dark(hsl(0, 0%, 36%), hsl(0, 0%, 90%));--svg-light: var(--text-light);--shadow: light-dark(rgba(0, 0, 0, .1), rgba(255, 255, 255, .1));--hagaki: light-dark(hsl(0, 77%, 56%), hsl(5, 99%, 71%));--hashtag-text: light-dark(#106BC7, #65B1FC);--hashtag-bg: light-dark(#106BC71a, #65B1FC1a);--toggle-bg: var(--svg);--toggle-circle: var(--dialog-bg);--message-success-bg: hsl(200, 39%, 96%);--message-success-color: hsl(210, 60%, 40%);--message-success-border: hsl(210, 48%, 70%);--message-error-bg: hsl(351, 99%, 96%);--message-error-color: hsl(351, 99%, 32%);--message-error-border: hsl(351, 99%, 70%);--message-warning-bg: hsl(38, 100%, 95%);--message-warning-color: hsl(30, 90%, 35%);--message-warning-border: hsl(38, 90%, 65%);--message-flavor-bg: hsl(125, 39%, 94%);--message-flavor-color: hsl(123, 46%, 32%);--message-flavor-border: hsl(125, 39%, 70%);--message-tips-bg: hsl(270, 50%, 96%);--message-tips-color: hsl(270, 55%, 38%);--message-tips-border: hsl(270, 45%, 70%);font-family:system-ui,-apple-system,Segoe UI,Hiragino Sans,Hiragino Kaku Gothic ProN,Meiryo,sans-serif;font-weight:400;color-scheme:light dark;color:var(--text);background-color:var(--bg);font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}*{font-family:inherit;box-sizing:border-box}html,body,#app{height:var(--app-root-height);overflow-x:hidden;overflow-y:var(--app-root-overflow-y);overscroll-behavior-y:var(--app-overscroll-behavior)}#app{position:var(--app-body-position);top:var(--app-root-top);left:0;right:0;width:var(--app-body-width)}body{margin:0;position:var(--app-body-position);inset:var(--app-body-inset);width:var(--app-body-width);color:var(--text);background-color:var(--bg);overflow-wrap:anywhere;word-break:auto-phrase;line-break:strict}a{--link-hover-color: light-dark(color-mix(in srgb, var(--link), black 30%), color-mix(in srgb, var(--link), white 30%));font-weight:500;color:var(--link);-webkit-tap-highlight-color:transparent;text-decoration:none;border-radius:6px}a:active{opacity:1}h2,h3{color:var(--text-light)}.card{padding:2em}button,[role=button],select{display:inline-flex;align-items:center;justify-content:center;height:100%;padding:0;font-size:1rem;font-weight:500;line-height:normal;color:var(--text);background-color:inherit;border:none;cursor:pointer;text-decoration:none;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;--button-selected-bg: light-dark(color-mix(in srgb, var(--btn-bg), black 18%), color-mix(in srgb, var(--btn-bg), white 22%));--button-hover-bg: light-dark(color-mix(in srgb, var(--btn-bg), black 4%), color-mix(in srgb, var(--btn-bg), white 5%));--button-hover-color: light-dark(color-mix(in srgb, var(--text), black 40%), color-mix(in srgb, var(--text), white 50%));--button-selected-hover-bg: light-dark(color-mix(in srgb, var(--btn-bg), black 20%), color-mix(in srgb, var(--btn-bg), white 30%));--button-selected-hover-color: light-dark(color-mix(in srgb, var(--text), black 20%), color-mix(in srgb, var(--text), white 30%))}:is(button,[role=button],select):disabled{opacity:.3;cursor:not-allowed}:is(button,[role=button],select):disabled.loading{opacity:1}button>*{pointer-events:none}button:active:not(:disabled),[role=button]:active{scale:.98;transition:scale .1s cubic-bezier(0,1,.5,1)}@media(prefers-reduced-motion:reduce){button:active:not(:disabled),[role=button]:active{scale:1;transition:none}}span{-webkit-tap-highlight-color:transparent}select{border-radius:6px}.svg-icon{-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-size:contain;mask-size:contain;-webkit-mask-position:center;mask-position:center;background-color:var(--svg);display:inline-block;inline-size:var(--icon-size, 28px);block-size:var(--icon-size, 28px);--icon-hover-color: light-dark(color-mix(in srgb, var(--svg), black 40%), color-mix(in srgb, var(--svg), white 50%));--icon-selected-hover-color: light-dark(color-mix(in srgb, var(--svg), black 20%), color-mix(in srgb, var(--svg), white 30%))}.tooltip-content{--tooltip-padding: 12px;--tooltip-font-size: 1rem;--tooltip-line-height: normal;--tooltip-z-index: 100;--tooltip-max-width: none;background:var(--dialog-bg);color:var(--text);border:1px solid var(--border);border-radius:6px;padding:var(--tooltip-padding);font-size:var(--tooltip-font-size);line-height:var(--tooltip-line-height);z-index:var(--tooltip-z-index);max-width:var(--tooltip-max-width)}.post-preview-tooltip-content{--tooltip-z-index: 10000;z-index:10000!important}:root:is(.light,.dark) button.selected:where(:not(:disabled)),:root:is(.light,.dark) button:where([data-state=active]){background-color:var(--button-selected-bg)}@media(hover:hover)and (pointer:fine){a:hover{text-decoration:underline}:root:is(.light,.dark) button:where(:hover:not(:disabled)),:root:is(.light,.dark) [role=button]:where(:hover:not([aria-disabled=true])),:root:is(.light,.dark) select:where(:hover:not(:disabled)){background-color:var(--button-hover-bg);color:var(--button-hover-color)}:is(:root:is(.light,.dark) button:where(:hover:not(:disabled)),:root:is(.light,.dark) [role=button]:where(:hover:not([aria-disabled=true])),:root:is(.light,.dark) select:where(:hover:not(:disabled))) .svg-icon{background-color:var(--icon-hover-color)}:root:is(.light,.dark) button.selected:where(:hover:not(:disabled)),:root:is(.light,.dark) button:where([data-state=active]:hover:not(:disabled)){background-color:var(--button-selected-hover-bg);color:var(--button-selected-hover-color)}:is(:root:is(.light,.dark) button.selected:where(:hover:not(:disabled)),:root:is(.light,.dark) button:where([data-state=active]:hover:not(:disabled))) .svg-icon{background-color:var(--icon-selected-hover-color)}:root:is(.light,.dark) a:hover{color:var(--link-hover-color)}}.setting-section{display:flex;flex-direction:column}.setting-row{display:flex;flex-direction:row;align-items:stretch;justify-content:space-between;min-height:50px}.setting-label{font-size:1rem;font-weight:500;line-height:1.3;display:flex;align-items:center;justify-content:flex-start;white-space:pre-line}.setting-control{display:flex;align-items:stretch;justify-content:flex-end;height:auto;margin-block:auto}", vi = ".pswp{--pswp-bg: #000;--pswp-placeholder-bg: #222;--pswp-root-z-index: 100000;--pswp-preloader-color: rgba(79, 79, 79, .4);--pswp-preloader-color-secondary: rgba(255, 255, 255, .9);--pswp-icon-color: #fff;--pswp-icon-color-secondary: #4f4f4f;--pswp-icon-stroke-color: #4f4f4f;--pswp-icon-stroke-width: 2px;--pswp-error-text-color: var(--pswp-icon-color)}.pswp{position:fixed;top:0;left:0;width:100%;height:100%;z-index:var(--pswp-root-z-index);display:none;touch-action:none;outline:0;opacity:.003;contain:layout style size;-webkit-tap-highlight-color:rgba(0,0,0,0)}.pswp:focus{outline:0}.pswp *{box-sizing:border-box}.pswp img{max-width:none}.pswp--open{display:block}.pswp,.pswp__bg{transform:translateZ(0);will-change:opacity}.pswp__bg{opacity:.005;background:var(--pswp-bg)}.pswp,.pswp__scroll-wrap{overflow:hidden}.pswp__scroll-wrap,.pswp__bg,.pswp__container,.pswp__item,.pswp__content,.pswp__img,.pswp__zoom-wrap{position:absolute;top:0;left:0;width:100%;height:100%}.pswp__img,.pswp__zoom-wrap{width:auto;height:auto}.pswp--click-to-zoom.pswp--zoom-allowed .pswp__img{cursor:-webkit-zoom-in;cursor:-moz-zoom-in;cursor:zoom-in}.pswp--click-to-zoom.pswp--zoomed-in .pswp__img{cursor:move;cursor:-webkit-grab;cursor:-moz-grab;cursor:grab}.pswp--click-to-zoom.pswp--zoomed-in .pswp__img:active{cursor:-webkit-grabbing;cursor:-moz-grabbing;cursor:grabbing}.pswp--no-mouse-drag.pswp--zoomed-in .pswp__img,.pswp--no-mouse-drag.pswp--zoomed-in .pswp__img:active,.pswp__img{cursor:-webkit-zoom-out;cursor:-moz-zoom-out;cursor:zoom-out}.pswp__container,.pswp__img,.pswp__button,.pswp__counter{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.pswp__item{z-index:1;overflow:hidden}.pswp__hidden{display:none!important}.pswp__content{pointer-events:none}.pswp__content>*{pointer-events:auto}.pswp__error-msg-container{display:grid}.pswp__error-msg{margin:auto;font-size:1em;line-height:1;color:var(--pswp-error-text-color)}.pswp .pswp__hide-on-close{opacity:.005;will-change:opacity;transition:opacity var(--pswp-transition-duration) cubic-bezier(.4,0,.22,1);z-index:10;pointer-events:none}.pswp--ui-visible .pswp__hide-on-close{opacity:1;pointer-events:auto}.pswp__button{position:relative;display:block;width:50px;height:60px;padding:0;margin:0;overflow:hidden;cursor:pointer;background:none;border:0;box-shadow:none;opacity:.85;-webkit-appearance:none;-webkit-touch-callout:none}.pswp__button:hover,.pswp__button:active,.pswp__button:focus{transition:none;padding:0;background:none;border:0;box-shadow:none;opacity:1}.pswp__button:disabled{opacity:.3;cursor:auto}.pswp__icn{fill:var(--pswp-icon-color);color:var(--pswp-icon-color-secondary)}.pswp__icn{position:absolute;top:14px;left:9px;width:32px;height:32px;overflow:hidden;pointer-events:none}.pswp__icn-shadow{stroke:var(--pswp-icon-stroke-color);stroke-width:var(--pswp-icon-stroke-width);fill:none}.pswp__icn:focus{outline:0}div.pswp__img--placeholder,.pswp__img--with-bg{background:var(--pswp-placeholder-bg)}.pswp__top-bar{position:absolute;left:0;top:0;width:100%;height:60px;display:flex;flex-direction:row;justify-content:flex-end;z-index:10;pointer-events:none!important}.pswp__top-bar>*{pointer-events:auto;will-change:opacity}.pswp__button--close{margin-right:6px}.pswp__button--arrow{position:absolute;width:75px;height:100px;top:50%;margin-top:-50px}.pswp__button--arrow:disabled{display:none;cursor:default}.pswp__button--arrow .pswp__icn{top:50%;margin-top:-30px;width:60px;height:60px;background:none;border-radius:0}.pswp--one-slide .pswp__button--arrow{display:none}.pswp--touch .pswp__button--arrow{visibility:hidden}.pswp--has_mouse .pswp__button--arrow{visibility:visible}.pswp__button--arrow--prev{right:auto;left:0}.pswp__button--arrow--next{right:0}.pswp__button--arrow--next .pswp__icn{left:auto;right:14px;transform:scaleX(-1)}.pswp__button--zoom{display:none}.pswp--zoom-allowed .pswp__button--zoom{display:block}.pswp--zoomed-in .pswp__zoom-icn-bar-v{display:none}.pswp__preloader{position:relative;overflow:hidden;width:50px;height:60px;margin-right:auto}.pswp__preloader .pswp__icn{opacity:0;transition:opacity .2s linear;animation:pswp-clockwise .6s linear infinite}.pswp__preloader--active .pswp__icn{opacity:.85}@keyframes pswp-clockwise{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.pswp__counter{height:30px;margin-top:15px;margin-inline-start:20px;font-size:14px;line-height:30px;color:var(--pswp-icon-color);text-shadow:1px 1px 3px var(--pswp-icon-color-secondary);opacity:.85}.pswp--one-slide .pswp__counter{display:none}", Ft = "ehagaki-composer", _i = 1;
function gi(e) {
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
const bi = "--ehagaki-icon-", mi = /--ehagaki-icon-([0-9a-f]+)/g;
function wi(e) {
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
    for (const s of i.textContent?.matchAll(mi) ?? [])
      n.add(s[0]);
  for (const i of n) {
    const s = wi(i.slice(bi.length));
    s && t.style.setProperty(
      i,
      `url("${new URL(`icons/${s}`, r).href}")`
    );
  }
}
let Ae = null;
function W(e, t) {
  const r = new Error(t);
  return r.name = e, r;
}
function yi(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function ki(e) {
  if (!yi(e))
    throw W("initialization_failed", "Invalid settings payload.");
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
  for (const [i, s] of Object.entries(e)) {
    if (!n.has(i))
      throw W("initialization_failed", "Invalid settings payload.");
    if (i in t) {
      const o = t[i];
      if (typeof s != "string" || !o.has(s))
        throw W("initialization_failed", "Invalid settings payload.");
    } else {
      if (r.has(i) && typeof s != "boolean")
        throw W("initialization_failed", "Invalid settings payload.");
      if (i === "uploadEndpoint" && typeof s != "string")
        throw W("initialization_failed", "Invalid settings payload.");
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
function Ei() {
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
class $i extends HTMLElement {
  static get observedAttributes() {
    return ["asset-base"];
  }
  #e = null;
  #t = null;
  #o = null;
  #c = null;
  #s = null;
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
  attributeChangedCallback() {
  }
  connectedCallback() {
    if (!this.#o) {
      if (Ae && Ae !== this) {
        const t = W(
          "multiple_instances_unsupported",
          "Only one ehagaki-composer can be connected in a document."
        );
        this.fail("multiple_instances_unsupported", t.message, t);
        return;
      }
      this.#r !== "pending" && (this.#a = this.createReadyPromise(), this.#r = "pending"), Ae = this, this.#o = this.mountApp();
    }
  }
  disconnectedCallback() {
    this.#l += 1, this.#i?.disconnect(), this.#i = null, Ae === this && (Ae = null), this.#t && (Nr(this.#t), this.#t = null), this.#e = null, this.#o = null, this.#r === "pending" && (this.#r = "rejected", this.#s?.(W("disconnected", "Component was disconnected before it became ready.")));
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
    return this.enqueue(async () => this.requireApp().setEmbedSettings(ki(t)));
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
      n.textContent = `${xi(pi)}
${vi}
${Ei()}`;
      const i = document.createElement("div");
      i.className = "ehagaki-web-component-shell";
      const s = document.createElement("div");
      s.className = "ehagaki-web-component-app";
      const o = document.createElement("div");
      o.className = "ehagaki-web-component-overlays ehagaki-app-root", i.append(s, o), r.append(n, i);
      const l = new URL(
        this.assetBase ?? "./",
        import.meta.url
      );
      this.#i = new MutationObserver(() => {
        Ht(r, i, l);
      }), this.#i.observe(r, {
        childList: !0,
        subtree: !0
      }), di({
        storage: ui(window.localStorage),
        window,
        document,
        domRoot: r,
        styleTarget: i,
        layoutTarget: i,
        overlayTarget: o,
        themeTarget: this,
        layoutMode: "container",
        assetBase: l,
        serviceWorkerEnabled: !1,
        externalInputEnabled: !1,
        historyEnabled: !1,
        localNsecAuthEnabled: !1
      });
      const { default: a } = await import("./App-B-vAJu8d.js").then((c) => c.f9);
      if (!this.isConnected || t !== this.#l || (this.#t = Tt(a, {
        target: s,
        props: {
          notificationPort: gi(this),
          onInitialized: () => {
            !this.isConnected || t !== this.#l || (this.#r = "resolved", this.#c?.(), this.dispatchSafeEvent("ehagaki-ready", { apiVersion: _i }));
          }
        }
      }), Ht(r, i, l), this.#e = this.#t, !this.isConnected || t !== this.#l)) return;
    } catch {
      this.fail("initialization_failed", "eHagaki Composer could not be initialized.");
    }
  }
  requireApp() {
    if (!this.#e)
      throw W("initialization_failed", "eHagaki Composer is not ready.");
    return this.#e;
  }
  enqueue(t) {
    const r = this.#n.then(async () => (await this.whenReady(), t()));
    return this.#n = r.then(() => {
    }, () => {
    }), r;
  }
  fail(t, r, n = W(t, r)) {
    this.#r = "rejected", this.#s?.(n), this.dispatchSafeEvent("ehagaki-initialization-error", { code: t, message: r });
  }
}
customElements.get(Ft) || customElements.define(Ft, $i);
export {
  ie as $,
  Yi as A,
  F as B,
  Fe as C,
  Mi as D,
  Oe as E,
  et as F,
  Ai as G,
  Ni as H,
  es as I,
  Lr as J,
  zi as K,
  Di as L,
  De as M,
  Pi as N,
  H as O,
  N as P,
  ne as Q,
  B as R,
  Li as S,
  Nn as T,
  $e as U,
  Ut as V,
  Le as W,
  Wt as X,
  J as Y,
  fs as Z,
  v as _,
  G as a,
  As as a$,
  Fn as a0,
  dr as a1,
  qi as a2,
  Vi as a3,
  rt as a4,
  xe as a5,
  Yt as a6,
  Ii as a7,
  ms as a8,
  us as a9,
  ue as aA,
  Et as aB,
  se as aC,
  Si as aD,
  Vr as aE,
  me as aF,
  Oi as aG,
  Fi as aH,
  ji as aI,
  Te as aJ,
  Hi as aK,
  Bi as aL,
  Gr as aM,
  ls as aN,
  ai as aO,
  Qi as aP,
  Q as aQ,
  he as aR,
  Ne as aS,
  yn as aT,
  ys as aU,
  Zi as aV,
  Ki as aW,
  Xi as aX,
  cs as aY,
  ps as aZ,
  pn as a_,
  gr as aa,
  vs as ab,
  hs as ac,
  Ur as ad,
  Wr as ae,
  Ui as af,
  ts as ag,
  as as ah,
  $n as ai,
  Ti as aj,
  Yr as ak,
  ln as al,
  Dr as am,
  Ri as an,
  _s as ao,
  xs as ap,
  Es as aq,
  Rr as ar,
  os as as,
  bs as at,
  x as au,
  qe as av,
  On as aw,
  gs as ax,
  S as ay,
  Rt as az,
  ee as b,
  ns as b0,
  Qn as b1,
  vn as b2,
  tr as b3,
  Rs as b4,
  Ts as b5,
  rs as b6,
  Wi as b7,
  $s as b8,
  Ji as b9,
  Tt as ba,
  Nr as bb,
  Pn as bc,
  is as bd,
  ws as be,
  fn as bf,
  Ss as bg,
  Cs as bh,
  Is as bi,
  ks as bj,
  _i as bk,
  Ft as bl,
  $i as bm,
  ds as c,
  Ke as d,
  j as e,
  Z as f,
  Bt as g,
  ae as h,
  Pr as i,
  g as j,
  Hn as k,
  ss as l,
  Rn as m,
  Hr as n,
  jr as o,
  Ye as p,
  y as q,
  Br as r,
  dn as s,
  vr as t,
  Vn as u,
  b as v,
  Dn as w,
  wt as x,
  Gi as y,
  hn as z
};
