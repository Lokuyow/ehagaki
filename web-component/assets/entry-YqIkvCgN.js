var Mr = Array.isArray, Lr = Array.prototype.indexOf, ye = Array.prototype.includes, Dr = Array.from, Ge = Object.keys, Ke = Object.defineProperty, me = Object.getOwnPropertyDescriptor, jr = Object.getOwnPropertyDescriptors, Fr = Object.prototype, Hr = Array.prototype, qt = Object.getPrototypeOf, Ct = Object.isExtensible;
function Ro(e) {
  return typeof e == "function";
}
const Br = () => {
};
function qr(e) {
  for (var t = 0; t < e.length; t++)
    e[t]();
}
function Vt() {
  var e, t, r = new Promise((n, o) => {
    e = n, t = o;
  });
  return { promise: r, resolve: e, reject: t };
}
const $ = 2, ke = 4, Pe = 8, mt = 1 << 24, M = 16, q = 32, K = 64, ut = 128, N = 512, k = 1024, E = 2048, V = 4096, I = 8192, B = 16384, se = 32768, Rt = 1 << 25, Oe = 65536, Xe = 1 << 17, Vr = 1 << 18, pe = 1 << 19, Yt = 1 << 20, No = 1 << 25, de = 65536, Je = 1 << 21, we = 1 << 22, re = 1 << 23, ue = Symbol("$state"), Yr = Symbol("legacy props"), Io = Symbol(""), Ur = Symbol("attributes"), Wr = Symbol("class"), Gr = Symbol("style"), ft = Symbol("text"), qe = Symbol("form reset"), tt = new class extends Error {
  name = "StaleReactionError";
  message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), zo = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml")
), Po = 1, Me = 3, Le = 8;
function Kr(e) {
  throw new Error("https://svelte.dev/e/lifecycle_outside_component");
}
function Xr() {
  throw new Error("https://svelte.dev/e/async_derived_orphan");
}
function Mo(e, t, r) {
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
function Lo(e) {
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
const Do = 1, jo = 2, Fo = 4, Ho = 8, Bo = 16, qo = 1, Vo = 4, Yo = 8, Uo = 16, an = 1, ln = 2, Ut = "[", Wt = "[!", Nt = "[?", Gt = "]", xe = {}, x = Symbol(), cn = "http://www.w3.org/1999/xhtml", Wo = "http://www.w3.org/2000/svg", Go = "http://www.w3.org/1998/Math/MathML", Ko = "@attach";
function un() {
  console.warn("https://svelte.dev/e/derived_inert");
}
function rt(e) {
  console.warn("https://svelte.dev/e/hydration_mismatch");
}
function Xo() {
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
function Jo(e) {
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
    var o = (
      /** @type {TemplateNode} */
      /* @__PURE__ */ Z(r)
    );
    e && r.remove(), r = o;
  }
}
function Zo(e) {
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
function Qo(e) {
  return (
    /** @type {T} */
    nt().get(e)
  );
}
function ei(e, t) {
  return nt().set(e, t), t;
}
function ti(e) {
  return nt().has(e);
}
function ri() {
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
  #i = /* @__PURE__ */ new Set();
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
      for (var o of n.d)
        w(o, E), r(o);
      for (o of n.m)
        w(o, V), r(o);
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
    const t = this.#o;
    this.#o = [], this.apply();
    var r = be = [], n = [], o = Ve = [];
    for (const a of t)
      try {
        this.#k(a, r, n);
      } catch (c) {
        throw ir(a), c;
      }
    if (_ = null, o.length > 0) {
      var i = X.ensure();
      for (const a of o)
        i.schedule(a);
    }
    if (be = null, Ve = null, this.#y()) {
      this.#g(n), this.#g(r);
      for (const [a, c] of this.#f)
        or(a, c);
      o.length > 0 && /** @type {unknown} */
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
    if (this.linked && this.#r === 0 && this.#w(), this.#o.length > 0) {
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
    for (var o = t.first; o !== null; ) {
      var i = o.f, s = (i & (q | K)) !== 0, l = s && (i & k) !== 0, a = l || (i & I) !== 0 || this.#f.has(o);
      if (!a && o.fn !== null) {
        s ? o.f ^= k : (i & ke) !== 0 ? r.push(o) : je(o) && ((i & M) !== 0 && this.#u.add(o), Ae(o));
        var c = o.first;
        if (c !== null) {
          o = c;
          continue;
        }
      }
      for (; o !== null; ) {
        var u = o.next;
        if (u !== null) {
          o = u;
          break;
        }
        o = o.parent;
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
    for (const [n, o] of t.current)
      !this.previous.has(n) && t.previous.has(n) && this.previous.set(n, t.previous.get(n)), this.current.set(n, o);
    for (const [n, o] of t.async_deriveds) {
      const i = this.async_deriveds.get(n);
      i && o.promise.then(i.resolve);
    }
    const r = (n) => {
      var o = n.reactions;
      if (o !== null)
        for (const l of o) {
          var i = l.f;
          if ((i & $) !== 0)
            r(
              /** @type {Derived} */
              l
            );
          else {
            var s = (
              /** @type {Effect} */
              l
            );
            i & (we | M) && !this.async_deriveds.has(s) && (this.#u.delete(s), w(s, E), this.schedule(s));
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
    for (const t of this.#i) t(this);
    this.#i.clear(), this.#a.clear(), this.#w();
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
        var o = [...u.current.keys()].filter((f) => !this.current.has(f));
        if (o.length === 0)
          t && u.discard();
        else if (r.length > 0) {
          if (t)
            for (const f of this.#h)
              u.unskip_effect(f, (h) => {
                (h.f & (M | we)) !== 0 ? u.schedule(h) : u.#g([h]);
              });
          u.activate();
          var i = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map();
          for (var l of r)
            nr(l, o, i, s);
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
    this.#i.add(t);
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
    this.#o.push(r);
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
        for (const o of W) {
          if ((o.f & (B | I)) !== 0) continue;
          const i = [o];
          let s = o.parent;
          for (; s !== null; )
            W.has(s) && (W.delete(s), i.push(s)), s = s.parent;
          for (let l = i.length - 1; l >= 0; l--) {
            const a = i[l];
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
    for (const o of e.reactions) {
      const i = o.f;
      (i & $) !== 0 ? nr(
        /** @type {Derived} */
        o,
        t,
        r,
        n
      ) : (i & (we | M)) !== 0 && (i & E) === 0 && kt(o, t, n) && (w(o, E), xt(
        /** @type {Effect} */
        o
      ));
    }
}
function kt(e, t, r) {
  const n = r.get(e);
  if (n !== void 0) return n;
  if (e.deps !== null)
    for (const o of e.deps) {
      if (ye.call(t, o))
        return !0;
      if ((o.f & $) !== 0 && kt(
        /** @type {Derived} */
        o,
        t,
        r
      ))
        return r.set(
          /** @type {Derived} */
          o,
          !0
        ), !0;
    }
  return r.set(e, !1), !1;
}
function xt(e) {
  _.schedule(e);
}
function or(e, t) {
  if (!((e.f & q) !== 0 && (e.f & k) !== 0)) {
    (e.f & E) !== 0 ? t.d.push(e) : (e.f & V) !== 0 && t.m.push(e), w(e, k);
    for (var r = e.first; r !== null; )
      or(r, t), r = r.next;
  }
}
function ir(e) {
  w(e, k);
  for (var t = e.first; t !== null; )
    ir(t), t = t.next;
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
  #i;
  /** @type {Effect | null} */
  #a = null;
  /** @type {Effect | null} */
  #r = null;
  /** @type {Effect | null} */
  #n = null;
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
  #_ = kn(() => (this.#h = De(this.#o), () => {
    this.#h = null;
  }));
  /**
   * @param {TemplateNode} node
   * @param {BoundaryProps} props
   * @param {((anchor: Node) => void)} children
   * @param {((error: unknown) => unknown) | undefined} [transform_error]
   */
  constructor(t, r, n, o) {
    this.#e = t, this.#s = r, this.#c = (i) => {
      var s = (
        /** @type {Effect} */
        g
      );
      s.b = this, s.f |= ut, n(i);
    }, this.parent = /** @type {Effect} */
    g.b, this.transform_error = o ?? this.parent?.transform_error ?? ((i) => i), this.#i = jn(() => {
      if (y) {
        const i = (
          /** @type {Comment} */
          this.#t
        );
        wt();
        const s = i.data === Wt;
        if (i.data.startsWith(Nt)) {
          const a = JSON.parse(i.data.slice(Nt.length));
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
      if (this.is_pending = this.has_pending_snippet(), this.#p = 0, this.#o = 0, this.#a = ae(() => {
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
    var r = g, n = v, o = A;
    Y(this.#i), z(this.#i), Ee(this.#i.ctx);
    try {
      return X.ensure(), t();
    } catch (i) {
      return Qt(i), null;
    } finally {
      Y(r), z(n), Ee(o);
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
    this.#E(t, r), this.#o += t, !(!this.#h || this.#d) && (this.#d = !0, ne(() => {
      this.#d = !1, this.#h && et(this.#h, this.#o);
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
    var o = !1, i = !1;
    const s = () => {
      if (o) {
        fn();
        return;
      }
      o = !0, i && sn(), this.#n !== null && Ye(this.#n, () => {
        this.#n = null;
      }), this.#g(() => {
        this.#x();
      });
    }, l = (a) => {
      try {
        i = !0, r?.(a, s), i = !1;
      } catch (c) {
        te(c, this.#i && this.#i.parent);
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
            this.#i.parent
          ), null;
        }
      }));
    };
    ne(() => {
      var a;
      try {
        a = this.transform_error(t);
      } catch (c) {
        te(c, this.#i && this.#i.parent);
        return;
      }
      a !== null && typeof a == "object" && typeof /** @type {any} */
      a.then == "function" ? a.then(
        l,
        /** @param {unknown} e */
        (c) => te(c, this.#i && this.#i.parent)
      ) : l(a);
    });
  }
}
function An(e, t, r, n) {
  const o = Et;
  var i = e.filter((h) => !h.settled);
  if (r.length === 0 && i.length === 0) {
    n(t.map(o));
    return;
  }
  var s = (
    /** @type {Effect} */
    g
  ), l = Sn(), a = i.length === 1 ? i[0].promise : i.length > 1 ? Promise.all(i.map((h) => h.promise)) : null;
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
    a.then(() => c(t.map(o))).finally(u);
    return;
  }
  function f() {
    Promise.all(r.map((h) => /* @__PURE__ */ Tn(h))).then((h) => c([...t.map(o), ...h])).catch((h) => te(h, s)).finally(u);
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
  return function(i = !0) {
    Y(e), z(t), Ee(r), i && (e.f & B) === 0 && (n?.activate(), n?.apply());
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
  var o = (
    /** @type {Promise<V>} */
    /** @type {unknown} */
    void 0
  ), i = De(
    /** @type {V} */
    x
  ), s = !v, l = /* @__PURE__ */ new Set();
  return Dn(() => {
    var a = (
      /** @type {Effect} */
      g
    ), c = Vt();
    o = c.promise;
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
      f?.(), l.delete(c), p !== He && (u.activate(), p ? (i.f |= re, et(i, p)) : ((i.f & re) !== 0 && (i.f ^= re), et(i, d)), u.deactivate());
    };
    c.promise.then(h, (d) => h(null, d || "unknown"));
  }), vr(() => {
    for (const a of l)
      a.reject(He);
  }), new Promise((a) => {
    function c(u) {
      function f() {
        u === o ? a(i) : c(o);
      }
      u.then(f, f);
    }
    c(o);
  });
}
// @__NO_SIDE_EFFECTS__
function ni(e) {
  const t = /* @__PURE__ */ Et(e);
  return xr(t), t;
}
// @__NO_SIDE_EFFECTS__
function oi(e) {
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
  if (!ie && n !== null && (n.f & (B | I)) !== 0)
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
  ie || (L !== null ? (At() || _?.is_fork) && L.set(e, t) : yt(e));
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
    fe.set(e, ie ? t : e.v);
    var n = X.ensure();
    if (n.capture(e, t), (e.f & $) !== 0) {
      const o = (
        /** @type {Derived} */
        e
      );
      (e.f & E) !== 0 && $t(o), L === null && yt(o);
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
    for (var o = n.length, i = 0; i < o; i++) {
      var s = n[i], l = s.f, a = (l & E) === 0;
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
  var r = /* @__PURE__ */ new Map(), n = Mr(e), o = /* @__PURE__ */ Q(0), i = he, s = (l) => {
    if (he === i)
      return l();
    var a = v, c = he;
    z(null), Dt(i);
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
            r.set(a, u), Ie(o);
          }
        } else
          ee(c, x), Ie(o);
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
          Ie(o);
        }
        return !0;
      },
      ownKeys(l) {
        G(o);
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
function ii(e, t) {
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
function si(e, t) {
  if (!y)
    return /* @__PURE__ */ $e(e);
  var r = /* @__PURE__ */ $e(b);
  if (r === null)
    r = b.appendChild(J());
  else if (t && r.nodeType !== Me) {
    var n = J();
    return r?.before(n), F(n), n;
  }
  return t && ot(
    /** @type {Text} */
    r
  ), F(r), r;
}
function ai(e, t = !1) {
  if (!y) {
    var r = /* @__PURE__ */ $e(e);
    return r instanceof Comment && r.data === "" ? /* @__PURE__ */ Z(r) : r;
  }
  if (t) {
    if (b?.nodeType !== Me) {
      var n = J();
      return b?.before(n), F(n), n;
    }
    ot(
      /** @type {Text} */
      b
    );
  }
  return b;
}
function li(e, t = 1, r = !1) {
  let n = y ? b : e;
  for (var o; t--; )
    o = n, n = /** @type {TemplateNode} */
    /* @__PURE__ */ Z(n);
  if (!y)
    return n;
  if (r) {
    if (n?.nodeType !== Me) {
      var i = J();
      return n === null ? o?.after(i) : n.before(i), F(i), i;
    }
    ot(
      /** @type {Text} */
      n
    );
  }
  return F(n), n;
}
function On(e) {
  e.textContent = "";
}
function ci() {
  return !1;
}
function pr(e, t, r) {
  return (
    /** @type {T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : Element} */
    document.createElementNS(t ?? cn, e, void 0)
  );
}
function ot(e) {
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
function ui(e, t) {
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
function it(e) {
  var t = v, r = g;
  z(null), Y(null);
  try {
    return e();
  } finally {
    z(t), Y(r);
  }
}
function fi(e, t, r, n = r) {
  e.addEventListener(t, () => it(r));
  const o = (
    /** @type {any} */
    e[qe]
  );
  o ? e[qe] = () => {
    o(), n(!0);
  } : e[qe] = () => n(!0), zn();
}
function gr(e) {
  g === null && (v === null && Qr(), Zr()), ie && Jr();
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
  var o = n;
  if ((e & ke) !== 0)
    be !== null ? be.push(n) : X.ensure().schedule(n);
  else if (t !== null) {
    try {
      Ae(n);
    } catch (s) {
      throw j(n), s;
    }
    o.deps === null && o.teardown === null && o.nodes === null && o.first === o.last && // either `null`, or a singular child
    (o.f & pe) === 0 && (o = o.first, (e & M) !== 0 && (e & Oe) !== 0 && o !== null && (o.f |= Oe));
  }
  if (o !== null && (o.parent = r, r !== null && Pn(o, r), v !== null && (v.f & $) !== 0 && (e & K) === 0)) {
    var i = (
      /** @type {Derived} */
      v
    );
    (i.effects ??= []).push(o);
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
function hi(e) {
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
function di(e) {
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
function pi(e) {
  return P(ke, e);
}
function Dn(e) {
  return P(we | pe, e);
}
function br(e, t = 0) {
  return P(Pe | t, e);
}
function gi(e, t = [], r = [], n = []) {
  An(n, t, r, (o) => {
    P(Pe, () => e(...o.map(G)));
  });
}
function jn(e, t = 0) {
  var r = P(M | t, e);
  return r;
}
function vi(e, t = 0) {
  var r = P(mt | t, e);
  return r;
}
function ae(e) {
  return P(q | pe, e);
}
function mr(e) {
  var t = e.teardown;
  if (t !== null) {
    const r = ie, n = v;
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
    const o = r.ac;
    o !== null && it(() => {
      o.abort(tt);
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
    for (const i of n)
      i.stop();
  mr(e), e.f ^= Rt, e.f |= B;
  var o = e.parent;
  o !== null && o.first !== null && wr(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
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
  var o = () => {
    r && j(e), t && t();
  }, i = n.length;
  if (i > 0) {
    var s = () => --i || o();
    for (var l of n)
      l.out(s);
  } else
    o();
}
function yr(e, t, r) {
  if ((e.f & I) === 0) {
    e.f ^= I;
    var n = e.nodes && e.nodes.t;
    if (n !== null)
      for (const l of n)
        (l.is_global || r) && t.push(l);
    for (var o = e.first; o !== null; ) {
      var i = o.next;
      if ((o.f & K) === 0) {
        var s = (o.f & Oe) !== 0 || // If this is a branch effect without a block effect parent,
        // it means the parent block effect was pruned. In that case,
        // transparency information was transferred to the branch effect.
        (o.f & q) !== 0 && (e.f & M) !== 0;
        yr(o, t, s ? r : !1);
      }
      o = i;
    }
  }
}
function _i(e) {
  kr(e, !0);
}
function kr(e, t) {
  if ((e.f & I) !== 0) {
    e.f ^= I, (e.f & k) === 0 && (w(e, E), X.ensure().schedule(e));
    for (var r = e.first; r !== null; ) {
      var n = r.next, o = (r.f & Oe) !== 0 || (r.f & q) !== 0;
      kr(r, o ? t : !1), r = n;
    }
    var i = e.nodes && e.nodes.t;
    if (i !== null)
      for (const s of i)
        (s.is_global || t) && s.in();
  }
}
function Bn(e, t) {
  if (e.nodes)
    for (var r = e.nodes.start, n = e.nodes.end; r !== null; ) {
      var o = r === n ? null : /* @__PURE__ */ Z(r);
      t.append(r), r = o;
    }
}
let Ue = !1, ie = !1;
function Lt(e) {
  ie = e;
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
    ), n = r.length, o = 0; o < n; o++) {
      var i = r[o];
      if (je(
        /** @type {Derived} */
        i
      ) && ar(
        /** @type {Derived} */
        i
      ), i.wv > e.wv)
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
    for (var o = 0; o < n.length; o++) {
      var i = n[o];
      (i.f & $) !== 0 ? Ar(
        /** @type {Derived} */
        i,
        t,
        !1
      ) : t === i && (r ? w(i, E) : (i.f & k) !== 0 && w(i, V), xt(
        /** @type {Effect} */
        i
      ));
    }
}
function Sr(e) {
  var t = S, r = C, n = R, o = v, i = O, s = A, l = D, a = he, c = e.f;
  S = /** @type {null | Value[]} */
  null, C = 0, R = null, v = (c & (q | K)) === 0 ? e : null, O = null, Ee(e.ctx), D = !1, he = ++ce, e.ac !== null && (it(() => {
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
    if (o !== null && o !== e) {
      if (ce++, o.deps !== null)
        for (let m = 0; m < r; m += 1)
          o.deps[m].rv = ce;
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
    e.f ^= Je, S = t, C = r, R = n, v = o, O = i, Ee(s), D = l, he = a;
  }
}
function Vn(e, t) {
  let r = t.reactions;
  if (r !== null) {
    var n = Lr.call(r, e);
    if (n !== -1) {
      var o = r.length - 1;
      o === 0 ? r = t.reactions = null : (r[n] = r[o], r.pop());
    }
  }
  if (r === null && (t.f & $) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
  // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
  // allows us to skip the expensive work of disconnecting and immediately reconnecting it
  (S === null || !ye.call(S, t))) {
    var i = (
      /** @type {Derived} */
      t
    );
    (i.f & N) !== 0 && (i.f ^= N, i.f &= ~de), i.v !== x && yt(i), Rn(i), ze(i, 0);
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
      var o = Sr(e);
      e.teardown = typeof o == "function" ? o : null, e.wv = Er;
      var i;
    } finally {
      Ue = n, g = r;
    }
  }
}
async function bi() {
  await Promise.resolve(), rr();
}
function G(e) {
  var t = e.f, r = (t & $) !== 0;
  if (v !== null && !D) {
    var n = g !== null && (g.f & B) !== 0;
    if (!n && (O === null || !ye.call(O, e))) {
      var o = v.deps;
      if ((v.f & Je) !== 0)
        e.rv < ce && (e.rv = ce, S === null && o !== null && o[C] === e ? C++ : S === null ? S = [e] : S.push(e));
      else {
        (v.deps ??= []).push(e);
        var i = e.reactions;
        i === null ? e.reactions = [v] : ye.call(i, v) || i.push(v);
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
function mi(e) {
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
      for (let o in n) {
        const i = n[o].get;
        if (i)
          try {
            i.call(e);
          } catch {
          }
      }
    }
  }
}
function wi(e) {
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
function yi(e) {
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
function ki(e) {
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
function xi(e) {
  return Xn.includes(
    /** @type {typeof RAW_TEXT_ELEMENTS[number]} */
    e
  );
}
const Ce = Symbol("events"), Rr = /* @__PURE__ */ new Set(), vt = /* @__PURE__ */ new Set();
function Ei(e) {
  if (!y) return;
  e.removeAttribute("onload"), e.removeAttribute("onerror");
  const t = e.__e;
  t !== void 0 && (e.__e = void 0, queueMicrotask(() => {
    e.isConnected && e.dispatchEvent(t);
  }));
}
function Nr(e, t, r, n = {}) {
  function o(i) {
    if (n.capture || _t.call(t, i), !i.cancelBubble)
      return it(() => r?.call(this, i));
  }
  return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? ne(() => {
    t.addEventListener(e, o, n);
  }) : t.addEventListener(e, o, n), o;
}
function $i(e, t, r, n = {}) {
  var o = Nr(t, e, r, n);
  return () => {
    e.removeEventListener(t, o, n);
  };
}
function Ai(e, t, r, n, o) {
  var i = { capture: n, passive: o }, s = Nr(e, t, r, i);
  (t === document.body || // @ts-ignore
  t === window || // @ts-ignore
  t === document || // Firefox has quirky behavior, it can happen that we still get "canplay" events when the element is already removed
  t instanceof HTMLMediaElement) && vr(() => {
    t.removeEventListener(e, s, i);
  });
}
function Si(e, t, r) {
  (t[Ce] ??= {})[e] = r;
}
function Ti(e) {
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
  ), n = e.type, o = e.composedPath?.() || [], i = (
    /** @type {null | Element} */
    o[0] || e.target
  );
  jt = e;
  var s = 0, l = jt === e && e[Ce];
  if (l) {
    var a = o.indexOf(l);
    if (a !== -1 && (t === document || t === /** @type {any} */
    window)) {
      e[Ce] = t;
      return;
    }
    var c = o.indexOf(t);
    if (c === -1)
      return;
    a <= c && (s = a);
  }
  if (i = /** @type {Element} */
  o[s] || e.target, i !== t) {
    Ke(e, "currentTarget", {
      configurable: !0,
      get() {
        return i || r;
      }
    });
    var u = v, f = g;
    z(null), Y(null);
    try {
      for (var h, d = []; i !== null; ) {
        var p = i.assignedSlot || i.parentNode || /** @type {any} */
        i.host || null;
        try {
          var m = i[Ce]?.[n];
          m != null && (!/** @type {any} */
          i.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
          // -> the target could not have been disabled because it emits the event in the first place
          e.target === i) && m.call(i, e);
        } catch (T) {
          h ? d.push(T) : h = T;
        }
        if (e.cancelBubble || p === t || p === null)
          break;
        i = p;
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
function oe(e, t) {
  var r = (
    /** @type {Effect} */
    g
  );
  r.nodes === null && (r.nodes = { start: e, end: t, a: null, t: null });
}
// @__NO_SIDE_EFFECTS__
function Ci(e, t) {
  var r = (t & an) !== 0, n = (t & ln) !== 0, o, i = !e.startsWith("<!>");
  return () => {
    if (y)
      return oe(b, null), b;
    o === void 0 && (o = Qn(i ? e : "<!>" + e), r || (o = /** @type {TemplateNode} */
    /* @__PURE__ */ $e(o)));
    var s = (
      /** @type {TemplateNode} */
      n || fr ? document.importNode(o, !0) : o.cloneNode(!0)
    );
    if (r) {
      var l = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ $e(s)
      ), a = (
        /** @type {TemplateNode} */
        s.lastChild
      );
      oe(l, a);
    } else
      oe(s, s);
    return s;
  };
}
function Ri(e = "") {
  if (!y) {
    var t = J(e + "");
    return oe(t, t), t;
  }
  var r = b;
  return r.nodeType !== Me ? (r.before(r = J()), F(r)) : ot(
    /** @type {Text} */
    r
  ), oe(r, r), r;
}
function Ni() {
  if (y)
    return oe(b, null), b;
  var e = document.createDocumentFragment(), t = document.createComment(""), r = J();
  return e.append(t, r), oe(t, r), e;
}
function eo(e, t) {
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
function Ii() {
  if (y && b && b.nodeType === Le && b.textContent?.startsWith("$")) {
    const e = b.textContent.substring(1);
    return wt(), e;
  }
  return (window.__svelte ??= {}).uid ??= 1, `c${window.__svelte.uid++}`;
}
function Oi(e, t) {
  var r = t == null ? "" : typeof t == "object" ? `${t}` : t;
  r !== /** @type {any} */
  (e[ft] ??= e.nodeValue) && (e[ft] = r, e.nodeValue = `${r}`);
}
function Tt(e, t) {
  return Ir(e, t);
}
function to(e, t) {
  pt(), t.intro = t.intro ?? !1;
  const r = t.target, n = y, o = b;
  try {
    for (var i = /* @__PURE__ */ $e(r); i && (i.nodeType !== Le || /** @type {Comment} */
    i.data !== Ut); )
      i = /* @__PURE__ */ Z(i);
    if (!i)
      throw xe;
    Fe(!0), F(
      /** @type {Comment} */
      i
    );
    const s = Ir(e, { ...t, anchor: i });
    return Fe(!1), /**  @type {Exports} */
    s;
  } catch (s) {
    if (s instanceof Error && s.message.split(`
`).some((l) => l.startsWith("https://svelte.dev/e/")))
      throw s;
    return s !== xe && console.warn("Failed to hydrate: ", s), t.recover === !1 && tn(), pt(), On(r), Fe(!1), Tt(e, t);
  } finally {
    Fe(n), F(o);
  }
}
const Be = /* @__PURE__ */ new Map();
function Ir(e, { target: t, anchor: r, props: n = {}, events: o, context: i, intro: s = !0, transformError: l }) {
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
        if (i && (p.c = i), o && (n.$$events = o), y && oe(
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
function ro(e) {
  return new no(e);
}
class no {
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
    var r = /* @__PURE__ */ new Map(), n = (i, s) => {
      var l = /* @__PURE__ */ Nn(s, !1, !1);
      return r.set(i, l), l;
    };
    const o = new Proxy(
      { ...t.props || {}, $$events: {} },
      {
        get(i, s) {
          return G(r.get(s) ?? n(s, Reflect.get(i, s)));
        },
        has(i, s) {
          return s === Yr ? !0 : (G(r.get(s) ?? n(s, Reflect.get(i, s))), Reflect.has(i, s));
        },
        set(i, s, l) {
          return ee(r.get(s) ?? n(s, l), l), Reflect.set(i, s, l);
        }
      }
    );
    this.#t = (t.hydrate ? to : Tt)(t.component, {
      target: t.target,
      anchor: t.anchor,
      props: o,
      context: t.context,
      intro: t.intro ?? !1,
      recover: t.recover,
      transformError: t.transformError
    }), (!t?.props?.$$host || t.sync === !1) && rr(), this.#e = o.$$events;
    for (const i of Object.keys(this.#t))
      i === "$set" || i === "$destroy" || i === "$on" || Ke(this, i, {
        get() {
          return this.#t[i];
        },
        /** @param {any} value */
        set(s) {
          this.#t[i] = s;
        },
        enumerable: !0
      });
    this.#t.$set = /** @param {Record<string, any>} next */
    (i) => {
      Object.assign(o, i);
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
    const n = (...o) => r.call(this, ...o);
    return this.#e[t].push(n), () => {
      this.#e[t] = this.#e[t].filter(
        /** @param {any} fn */
        (o) => o !== n
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
        return (o) => {
          const i = pr("slot");
          n !== "default" && (i.name = n), eo(o, i);
        };
      };
      if (await Promise.resolve(), !this.$$cn || this.$$c)
        return;
      const t = {}, r = oo(this);
      for (const n of this.$$s)
        n in r && (n === "default" && !this.$$d.children ? (this.$$d.children = e(n), t.default = !0) : t[n] = e(n));
      for (const n of this.attributes) {
        const o = this.$$g_p(n.name);
        o in this.$$d || (this.$$d[o] = We(o, n.value, this.$$p_d, "toProp"));
      }
      for (const n in this.$$p_d)
        !(n in this.$$d) && this[n] !== void 0 && (this.$$d[n] = this[n], delete this[n]);
      this.$$c = ro({
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
            const o = We(
              n,
              this.$$d[n],
              this.$$p_d,
              "toAttribute"
            );
            o == null ? this.removeAttribute(this.$$p_d[n].attribute || n) : this.setAttribute(this.$$p_d[n].attribute || n, o);
          }
          this.$$r = !1;
        });
      });
      for (const n in this.$$l)
        for (const o of this.$$l[n]) {
          const i = this.$$c.$on(n, o);
          this.$$l_u.set(o, i);
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
  const o = r[e]?.type;
  if (t = o === "Boolean" && typeof t != "boolean" ? t != null : t, !n || !r[e])
    return t;
  if (n === "toAttribute")
    switch (o) {
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
    switch (o) {
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
function oo(e) {
  const t = {};
  return e.childNodes.forEach((r) => {
    t[
      /** @type {Element} node */
      r.slot || "default"
    ] = !0;
  }), t;
}
function zi(e, t, r, n, o, i) {
  let s = class extends zr {
    constructor() {
      super(e, r, o), this.$$p_d = t;
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
const io = "ehagaki.web-component.v1:", _e = /* @__PURE__ */ new Map(), so = {
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
function ao() {
  if (typeof globalThis < "u") {
    const e = globalThis.localStorage;
    if (e)
      return e;
  }
  return so;
}
function lo() {
  return Pr ?? ao();
}
function co(e) {
  Pr = e;
}
function ct(e, t) {
  const r = [];
  for (let n = 0; n < e.length; n += 1) {
    const o = e.key(n);
    o?.startsWith(t) && r.push(o.slice(t.length));
  }
  return r;
}
function uo(e, t) {
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
function fo(e) {
  return uo(
    e,
    io
  );
}
function ho() {
  return {
    style: {
      setProperty: () => {
      },
      removeProperty: () => "",
      getPropertyValue: () => ""
    }
  };
}
function po() {
  const e = typeof window < "u" ? window : void 0, t = e?.document, r = t?.documentElement ?? ho(), n = t?.body ?? r;
  return {
    storage: lo(),
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
let Re = po();
function go(e) {
  return Re = {
    ...Re,
    ...e
  }, co(Re.storage), Re;
}
function Pi() {
  return Re;
}
const vo = ":root{--app-root-height: 100%;--app-root-top: 0px;--app-root-overflow-y: visible;--app-main-height: 100svh;--app-body-position: static;--app-body-inset: auto;--app-body-width: auto;--app-overlay-position: fixed;--app-overscroll-behavior: auto;--footer-height: 66px;--footer-bottom: 0px;--keyboard-height: 0px;--mobile-dialog-viewport-top: 0px;--mobile-dialog-viewport-height: 100dvh;--mobile-dialog-center-y: 43dvh;--keyboard-button-bar-height: 50px;--keyboard-button-bar-bottom: 66px;--main-content-keyboard-adjustment: var(--keyboard-height);--reason-input-base-height: 50px;--reason-input-height: 0px;--reason-input-bottom: 116px;--main-content-top-spacing: 6px;--composer-bottom-reserved-height: 116px;--accent-color-default: hsl(152, 74%, 43%);--accent-color: var( --accent-color-forced, var(--accent-color-user, var(--accent-color-external-default, var(--accent-color-default))) );--accent-color-custom: var( --accent-color-forced, var(--accent-color-user, var(--accent-color-external-default)) );--accent-color-custom-inner: color-mix(in srgb, var(--accent-color-custom) 15%, white 85%);--accent-color-custom-face: color-mix(in srgb, var(--accent-color-custom) 40%, black 60%);--base-color: var( --base-color-forced, var(--base-color-user, var(--base-color-external-default)) );--theme: var(--accent-color);--text-black: hsl(0, 0%, 24%);--nostr-bg: hsl(270, 100%, 98%);--yellow: hsl(50, 100%, 50%);--danger: hsl(0, 84%, 60%);--darker: rgba(0, 0, 0, .8);--dark-gray: hsl(0, 0%, 66%);--light-gray: hsl(0, 0%, 83%);--base-color-surface-bg-light: color-mix(in srgb, var(--base-color) 18%, hsl(0, 0%, 97%));--base-color-surface-bg-dark: color-mix(in srgb, var(--base-color) 18%, hsl(0, 0%, 12%));--base-color-surface-editor-light: color-mix(in srgb, var(--base-color) 6%, hsl(0, 0%, 100%));--base-color-surface-editor-dark: color-mix(in srgb, var(--base-color) 9%, hsl(0, 0%, 22%));--base-color-surface-footer-light: color-mix(in srgb, var(--base-color) 34%, hsl(0, 0%, 86%));--base-color-surface-footer-dark: color-mix(in srgb, var(--base-color) 22%, hsl(0, 0%, 10%));--surface-bg: light-dark( var(--base-color-surface-bg-light, color-mix(in srgb, hsl(0, 0%, 94%) 18%, hsl(0, 0%, 94%))), var(--base-color-surface-bg-dark, color-mix(in srgb, hsl(0, 0%, 12%) 18%, hsl(0, 0%, 12%))) );--surface-input: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 100%)) 14%, hsl(0, 0%, 100%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 19%)) 14%, hsl(0, 0%, 19%)) );--surface-editor: light-dark( var(--base-color-surface-editor-light, var(--surface-input)), var(--base-color-surface-editor-dark, var(--surface-input)) );--surface-footer: light-dark( var(--base-color-surface-footer-light, color-mix(in srgb, hsl(0, 0%, 82%) 22%, hsl(0, 0%, 82%))), var(--base-color-surface-footer-dark, color-mix(in srgb, hsl(0, 0%, 10%) 22%, hsl(0, 0%, 10%))) );--surface-buttonbar: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 91%)) 20%, hsl(0, 0%, 91%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 28%)) 20%, hsl(0, 0%, 28%)) );--base-color-surface-button: color-mix(in srgb, var(--base-color) 24%, white);--surface-button: light-dark( var(--base-color-surface-button, hsl(0, 0%, 92%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 25%)) 18%, hsl(0, 0%, 25%)) );--surface-button-border: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 75%)) 24%, hsl(0, 0%, 75%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 30%)) 24%, hsl(0, 0%, 30%)) );--surface-button-preview-action: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 74%)) 22%, hsl(0, 0%, 74%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 36%)) 22%, hsl(0, 0%, 36%)) );--surface-border: light-dark( color-mix(in srgb, var(--base-color, var(--light-gray)) 24%, var(--light-gray)), color-mix(in srgb, var(--base-color, dimgray) 24%, dimgray) );--surface-border-hr: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 84%)) 20%, hsl(0, 0%, 84%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 30%)) 20%, hsl(0, 0%, 30%)) );--surface-border-hr-light: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 92%)) 16%, hsl(0, 0%, 92%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 20%)) 16%, hsl(0, 0%, 20%)) );--surface-dialog: light-dark( color-mix(in srgb, var(--base-color, white) 14%, white), color-mix(in srgb, var(--base-color, hsl(0, 0%, 14%)) 14%, hsl(0, 0%, 14%)) );--surface-window: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 95%)) 14%, hsl(0, 0%, 95%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 14%)) 14%, hsl(0, 0%, 14%)) );--bg: var(--surface-bg);--bg-input: var(--surface-input);--bg-footer: var(--surface-footer);--bg-translucent: light-dark(#EDEDEDcc, #212121cc);--bg-buttonbar: var(--surface-buttonbar);--base-color-footer-buttonbar-light: var(--base-color-surface-bg-light);--footer-buttonbar-bg: light-dark( var(--base-color-footer-buttonbar-light, var(--bg-buttonbar)), var(--bg-buttonbar) );--btn-bg: var(--surface-button);--btn-bg2: light-dark(color-mix(in srgb, var(--btn-bg), black 6%), color-mix(in srgb, var(--btn-bg), white 10%));--btn-bg3: light-dark(color-mix(in srgb, var(--btn-bg), black 11%), color-mix(in srgb, var(--btn-bg), white 20%));--btn-border: var(--surface-button-border);--btn-hover-bg: light-dark(rgba(50, 50, 50, .12), rgba(255, 255, 255, .12));--btn-post-preview-action: var(--surface-button-preview-action);--border: var(--surface-border);--border-hr: var(--surface-border-hr);--border-hr-light: var(--surface-border-hr-light);--semantic-text: light-dark(hsl(0, 0%, 24%), hsl(0, 0%, 90%));--text: var(--semantic-text);--text-light: light-dark(hsl(0, 0%, 46%), hsl(0, 0%, 75%));--text-muted: light-dark(hsl(0, 0%, 60%), hsl(0, 0%, 55%));--text-red: light-dark(hsl(0, 99%, 45%), hsl(0, 99%, 69%));--text-r: light-dark(#e6e6e6, #3D3D3D);--semantic-link: light-dark(#1a0dab, #99c3ff);--link: var(--semantic-link);--link-visited: light-dark(#681da8, #c58af9);--dialog-bg: var(--surface-dialog);--dialog-bg2: light-dark(color-mix(in srgb, var(--dialog-bg), black 6%), color-mix(in srgb, var(--dialog-bg), white 10%));--dialog-bg3: light-dark(color-mix(in srgb, var(--dialog-bg), black 11%), color-mix(in srgb, var(--dialog-bg), white 16%));--dialog-bg-overlay: light-dark(rgba(0, 0, 0, .6), rgba(0, 0, 0, .8));--window: var(--surface-window);--svg: light-dark(hsl(0, 0%, 36%), hsl(0, 0%, 90%));--svg-light: var(--text-light);--shadow: light-dark(rgba(0, 0, 0, .1), rgba(255, 255, 255, .1));--hagaki: light-dark(hsl(0, 77%, 56%), hsl(5, 99%, 71%));--hashtag-text: light-dark(#106BC7, #65B1FC);--hashtag-bg: light-dark(#106BC71a, #65B1FC1a);--toggle-bg: var(--svg);--toggle-circle: var(--dialog-bg);--message-success-bg: hsl(200, 39%, 96%);--message-success-color: hsl(210, 60%, 40%);--message-success-border: hsl(210, 48%, 70%);--message-error-bg: hsl(351, 99%, 96%);--message-error-color: hsl(351, 99%, 32%);--message-error-border: hsl(351, 99%, 70%);--message-warning-bg: hsl(38, 100%, 95%);--message-warning-color: hsl(30, 90%, 35%);--message-warning-border: hsl(38, 90%, 65%);--message-flavor-bg: hsl(125, 39%, 94%);--message-flavor-color: hsl(123, 46%, 32%);--message-flavor-border: hsl(125, 39%, 70%);--message-tips-bg: hsl(270, 50%, 96%);--message-tips-color: hsl(270, 55%, 38%);--message-tips-border: hsl(270, 45%, 70%);font-family:system-ui,-apple-system,Segoe UI,Hiragino Sans,Hiragino Kaku Gothic ProN,Meiryo,sans-serif;font-weight:400;color-scheme:light dark;color:var(--text);background-color:var(--bg);font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}*{font-family:inherit;box-sizing:border-box}html,body,#app{height:var(--app-root-height);overflow-x:hidden;overflow-y:var(--app-root-overflow-y);overscroll-behavior-y:var(--app-overscroll-behavior)}#app{position:var(--app-body-position);top:var(--app-root-top);left:0;right:0;width:var(--app-body-width)}body{margin:0;position:var(--app-body-position);inset:var(--app-body-inset);width:var(--app-body-width);color:var(--text);background-color:var(--bg);overflow-wrap:anywhere;word-break:auto-phrase;line-break:strict}a{--link-hover-color: light-dark(color-mix(in srgb, var(--link), black 30%), color-mix(in srgb, var(--link), white 30%));font-weight:500;color:var(--link);-webkit-tap-highlight-color:transparent;text-decoration:none;border-radius:6px}a:active{opacity:1}h2,h3{color:var(--text-light)}.card{padding:2em}button,[role=button],select{display:inline-flex;align-items:center;justify-content:center;height:100%;padding:0;font-size:1rem;font-weight:500;line-height:normal;color:var(--text);background-color:inherit;border:none;cursor:pointer;text-decoration:none;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;--button-selected-bg: light-dark(color-mix(in srgb, var(--btn-bg), black 18%), color-mix(in srgb, var(--btn-bg), white 22%));--button-hover-bg: light-dark(color-mix(in srgb, var(--btn-bg), black 4%), color-mix(in srgb, var(--btn-bg), white 5%));--button-hover-color: light-dark(color-mix(in srgb, var(--text), black 40%), color-mix(in srgb, var(--text), white 50%));--button-selected-hover-bg: light-dark(color-mix(in srgb, var(--btn-bg), black 20%), color-mix(in srgb, var(--btn-bg), white 30%));--button-selected-hover-color: light-dark(color-mix(in srgb, var(--text), black 20%), color-mix(in srgb, var(--text), white 30%))}:is(button,[role=button],select):disabled{opacity:.3;cursor:not-allowed}:is(button,[role=button],select):disabled.loading{opacity:1}button>*{pointer-events:none}button:active:not(:disabled),[role=button]:active{scale:.98;transition:scale .1s cubic-bezier(0,1,.5,1)}@media(prefers-reduced-motion:reduce){button:active:not(:disabled),[role=button]:active{scale:1;transition:none}}span{-webkit-tap-highlight-color:transparent}select{border-radius:6px}.svg-icon{-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-size:contain;mask-size:contain;-webkit-mask-position:center;mask-position:center;background-color:var(--svg);display:inline-block;inline-size:var(--icon-size, 28px);block-size:var(--icon-size, 28px);--icon-hover-color: light-dark(color-mix(in srgb, var(--svg), black 40%), color-mix(in srgb, var(--svg), white 50%));--icon-selected-hover-color: light-dark(color-mix(in srgb, var(--svg), black 20%), color-mix(in srgb, var(--svg), white 30%))}.tooltip-content{--tooltip-padding: 12px;--tooltip-font-size: 1rem;--tooltip-line-height: normal;--tooltip-z-index: 100;--tooltip-max-width: none;background:var(--dialog-bg);color:var(--text);border:1px solid var(--border);border-radius:6px;padding:var(--tooltip-padding);font-size:var(--tooltip-font-size);line-height:var(--tooltip-line-height);z-index:var(--tooltip-z-index);max-width:var(--tooltip-max-width)}.post-preview-tooltip-content{--tooltip-z-index: 10000;z-index:10000!important}:root:is(.light,.dark) button.selected:where(:not(:disabled)),:root:is(.light,.dark) button:where([data-state=active]){background-color:var(--button-selected-bg)}@media(hover:hover)and (pointer:fine){a:hover{text-decoration:underline}:root:is(.light,.dark) button:where(:hover:not(:disabled)),:root:is(.light,.dark) [role=button]:where(:hover:not([aria-disabled=true])),:root:is(.light,.dark) select:where(:hover:not(:disabled)){background-color:var(--button-hover-bg);color:var(--button-hover-color)}:is(:root:is(.light,.dark) button:where(:hover:not(:disabled)),:root:is(.light,.dark) [role=button]:where(:hover:not([aria-disabled=true])),:root:is(.light,.dark) select:where(:hover:not(:disabled))) .svg-icon{background-color:var(--icon-hover-color)}:root:is(.light,.dark) button.selected:where(:hover:not(:disabled)),:root:is(.light,.dark) button:where([data-state=active]:hover:not(:disabled)){background-color:var(--button-selected-hover-bg);color:var(--button-selected-hover-color)}:is(:root:is(.light,.dark) button.selected:where(:hover:not(:disabled)),:root:is(.light,.dark) button:where([data-state=active]:hover:not(:disabled))) .svg-icon{background-color:var(--icon-selected-hover-color)}:root:is(.light,.dark) a:hover{color:var(--link-hover-color)}}.setting-section{display:flex;flex-direction:column}.setting-row{display:flex;flex-direction:row;align-items:stretch;justify-content:space-between;min-height:50px}.setting-label{font-size:1rem;font-weight:500;line-height:1.3;display:flex;align-items:center;justify-content:flex-start;white-space:pre-line}.setting-control{display:flex;align-items:stretch;justify-content:flex-end;height:auto;margin-block:auto}", _o = ".pswp{--pswp-bg: #000;--pswp-placeholder-bg: #222;--pswp-root-z-index: 100000;--pswp-preloader-color: rgba(79, 79, 79, .4);--pswp-preloader-color-secondary: rgba(255, 255, 255, .9);--pswp-icon-color: #fff;--pswp-icon-color-secondary: #4f4f4f;--pswp-icon-stroke-color: #4f4f4f;--pswp-icon-stroke-width: 2px;--pswp-error-text-color: var(--pswp-icon-color)}.pswp{position:fixed;top:0;left:0;width:100%;height:100%;z-index:var(--pswp-root-z-index);display:none;touch-action:none;outline:0;opacity:.003;contain:layout style size;-webkit-tap-highlight-color:rgba(0,0,0,0)}.pswp:focus{outline:0}.pswp *{box-sizing:border-box}.pswp img{max-width:none}.pswp--open{display:block}.pswp,.pswp__bg{transform:translateZ(0);will-change:opacity}.pswp__bg{opacity:.005;background:var(--pswp-bg)}.pswp,.pswp__scroll-wrap{overflow:hidden}.pswp__scroll-wrap,.pswp__bg,.pswp__container,.pswp__item,.pswp__content,.pswp__img,.pswp__zoom-wrap{position:absolute;top:0;left:0;width:100%;height:100%}.pswp__img,.pswp__zoom-wrap{width:auto;height:auto}.pswp--click-to-zoom.pswp--zoom-allowed .pswp__img{cursor:-webkit-zoom-in;cursor:-moz-zoom-in;cursor:zoom-in}.pswp--click-to-zoom.pswp--zoomed-in .pswp__img{cursor:move;cursor:-webkit-grab;cursor:-moz-grab;cursor:grab}.pswp--click-to-zoom.pswp--zoomed-in .pswp__img:active{cursor:-webkit-grabbing;cursor:-moz-grabbing;cursor:grabbing}.pswp--no-mouse-drag.pswp--zoomed-in .pswp__img,.pswp--no-mouse-drag.pswp--zoomed-in .pswp__img:active,.pswp__img{cursor:-webkit-zoom-out;cursor:-moz-zoom-out;cursor:zoom-out}.pswp__container,.pswp__img,.pswp__button,.pswp__counter{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.pswp__item{z-index:1;overflow:hidden}.pswp__hidden{display:none!important}.pswp__content{pointer-events:none}.pswp__content>*{pointer-events:auto}.pswp__error-msg-container{display:grid}.pswp__error-msg{margin:auto;font-size:1em;line-height:1;color:var(--pswp-error-text-color)}.pswp .pswp__hide-on-close{opacity:.005;will-change:opacity;transition:opacity var(--pswp-transition-duration) cubic-bezier(.4,0,.22,1);z-index:10;pointer-events:none}.pswp--ui-visible .pswp__hide-on-close{opacity:1;pointer-events:auto}.pswp__button{position:relative;display:block;width:50px;height:60px;padding:0;margin:0;overflow:hidden;cursor:pointer;background:none;border:0;box-shadow:none;opacity:.85;-webkit-appearance:none;-webkit-touch-callout:none}.pswp__button:hover,.pswp__button:active,.pswp__button:focus{transition:none;padding:0;background:none;border:0;box-shadow:none;opacity:1}.pswp__button:disabled{opacity:.3;cursor:auto}.pswp__icn{fill:var(--pswp-icon-color);color:var(--pswp-icon-color-secondary)}.pswp__icn{position:absolute;top:14px;left:9px;width:32px;height:32px;overflow:hidden;pointer-events:none}.pswp__icn-shadow{stroke:var(--pswp-icon-stroke-color);stroke-width:var(--pswp-icon-stroke-width);fill:none}.pswp__icn:focus{outline:0}div.pswp__img--placeholder,.pswp__img--with-bg{background:var(--pswp-placeholder-bg)}.pswp__top-bar{position:absolute;left:0;top:0;width:100%;height:60px;display:flex;flex-direction:row;justify-content:flex-end;z-index:10;pointer-events:none!important}.pswp__top-bar>*{pointer-events:auto;will-change:opacity}.pswp__button--close{margin-right:6px}.pswp__button--arrow{position:absolute;width:75px;height:100px;top:50%;margin-top:-50px}.pswp__button--arrow:disabled{display:none;cursor:default}.pswp__button--arrow .pswp__icn{top:50%;margin-top:-30px;width:60px;height:60px;background:none;border-radius:0}.pswp--one-slide .pswp__button--arrow{display:none}.pswp--touch .pswp__button--arrow{visibility:hidden}.pswp--has_mouse .pswp__button--arrow{visibility:visible}.pswp__button--arrow--prev{right:auto;left:0}.pswp__button--arrow--next{right:0}.pswp__button--arrow--next .pswp__icn{left:auto;right:14px;transform:scaleX(-1)}.pswp__button--zoom{display:none}.pswp--zoom-allowed .pswp__button--zoom{display:block}.pswp--zoomed-in .pswp__zoom-icn-bar-v{display:none}.pswp__preloader{position:relative;overflow:hidden;width:50px;height:60px;margin-right:auto}.pswp__preloader .pswp__icn{opacity:0;transition:opacity .2s linear;animation:pswp-clockwise .6s linear infinite}.pswp__preloader--active .pswp__icn{opacity:.85}@keyframes pswp-clockwise{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.pswp__counter{height:30px;margin-top:15px;margin-inline-start:20px;font-size:14px;line-height:30px;color:var(--pswp-icon-color);text-shadow:1px 1px 3px var(--pswp-icon-color-secondary);opacity:.85}.pswp--one-slide .pswp__counter{display:none}", Ft = "ehagaki-composer", bo = 1;
function mo(e) {
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
const wo = "--ehagaki-icon-", yo = /--ehagaki-icon-([0-9a-f]+)/g;
function ko(e) {
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
  for (const o of e.querySelectorAll("style"))
    for (const i of o.textContent?.matchAll(yo) ?? [])
      n.add(i[0]);
  for (const o of n) {
    const i = ko(o.slice(wo.length));
    i && t.style.setProperty(
      o,
      `url("${new URL(`icons/${i}`, r).href}")`
    );
  }
}
let Se = null;
function H(e, t) {
  const r = new Error(t);
  return r.name = e, r;
}
function xo(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function Eo(e) {
  if (!xo(e))
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
  for (const [o, i] of Object.entries(e)) {
    if (!n.has(o))
      throw H("initialization_failed", "Invalid settings payload.");
    if (o in t) {
      const s = t[o];
      if (typeof i != "string" || !s.has(i))
        throw H("initialization_failed", "Invalid settings payload.");
    } else {
      if (r.has(o) && typeof i != "boolean")
        throw H("initialization_failed", "Invalid settings payload.");
      if (o === "uploadEndpoint" && typeof i != "string")
        throw H("initialization_failed", "Invalid settings payload.");
    }
  }
  return e;
}
function $o(e) {
  return e.replaceAll(/:root:is\(\s*\.light\s*,\s*\.dark\s*\)/g, ":host(:is(.light, .dark))").replaceAll(":root", ":host").replace(`html,
body,
#app`, `:host,
.ehagaki-web-component-shell`).replace("#app {", ".ehagaki-web-component-shell {").replace("body {", ".ehagaki-web-component-shell {");
}
function Ao() {
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
let So = class extends HTMLElement {
  static get observedAttributes() {
    return ["asset-base", "auto-login"];
  }
  #e = null;
  #t = null;
  #s = null;
  #c = null;
  #i = null;
  #a = this.createReadyPromise();
  #r = "pending";
  #n = Promise.resolve();
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
    this.#l += 1, this.onDisconnected(), this.#o?.disconnect(), this.#o = null, Se === this && (Se = null), this.#t && (Or(this.#t), this.#t = null), this.#e = null, this.#s = null, this.#r === "pending" && (this.#r = "rejected", this.#i?.(H("disconnected", "Component was disconnected before it became ready.")));
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
    return this.enqueue(async () => this.requireApp().setEmbedSettings(Eo(t)));
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
      this.#c = t, this.#i = r;
    });
  }
  async mountApp() {
    const t = ++this.#l;
    try {
      const r = this.shadowRoot ?? this.attachShadow({ mode: "open" });
      r.replaceChildren();
      const n = document.createElement("style");
      n.textContent = `${$o(vo)}
${_o}
${Ao()}`;
      const o = document.createElement("div");
      o.className = "ehagaki-web-component-shell";
      const i = document.createElement("div");
      i.className = "ehagaki-web-component-app";
      const s = document.createElement("div");
      s.className = "ehagaki-web-component-overlays ehagaki-app-root", o.append(i, s), r.append(n, o);
      const l = new URL(
        this.assetBase ?? "./",
        import.meta.url
      );
      this.#o = new MutationObserver(() => {
        Ht(r, o, l);
      }), this.#o.observe(r, {
        childList: !0,
        subtree: !0
      }), go({
        storage: fo(window.localStorage),
        window,
        document,
        domRoot: r,
        styleTarget: o,
        layoutTarget: o,
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
        target: i,
        props: {
          notificationPort: mo(this),
          onInitialized: () => {
            !this.isConnected || t !== this.#l || (this.#r = "resolved", this.#c?.(), this.dispatchSafeEvent("ehagaki-ready", { apiVersion: bo }));
          },
          ...this.getAdditionalMountProps()
        }
      }), Ht(r, o, l), this.#e = this.#t, !this.isConnected || t !== this.#l)) return;
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
    this.#r = "rejected", this.#i?.(n), this.dispatchSafeEvent("ehagaki-initialization-error", { code: t, message: r });
  }
};
class To extends So {
  loadApp() {
    return import("./App-BnEIDDep.js").then((t) => t.eJ);
  }
}
const Bt = Symbol.for("ehagaki-composer.distribution");
function Co(e, t) {
  const r = globalThis, n = r[Bt];
  if (n && n !== e)
    throw new Error(
      `Cannot import the ${e} eHagaki Composer distribution after ${n} in the same document.`
    );
  r[Bt] = e;
  const o = customElements.get(Ft);
  if (!o) {
    customElements.define(Ft, t);
    return;
  }
  if (o !== t)
    throw new Error("ehagaki-composer is already defined by a different distribution.");
}
Co("full", To);
export {
  oe as $,
  Ko as A,
  F as B,
  Fe as C,
  Fo as D,
  Oe as E,
  et as F,
  No as G,
  Mo as H,
  oi as I,
  Dr as J,
  Do as K,
  Bo as L,
  De as M,
  jo as N,
  B as O,
  I as P,
  ne as Q,
  q as R,
  Ho as S,
  On as T,
  Z as U,
  $e as V,
  Wt as W,
  Le as X,
  Gt as Y,
  gi as Z,
  g as _,
  G as a,
  Ni as a$,
  Hn as a0,
  pr as a1,
  Wo as a2,
  Go as a3,
  rt as a4,
  xe as a5,
  Ut as a6,
  Po as a7,
  xi as a8,
  pi as a9,
  ue as aA,
  Et as aB,
  ie as aC,
  Ro as aD,
  Yr as aE,
  me as aF,
  Lo as aG,
  Vo as aH,
  qo as aI,
  Te as aJ,
  Yo as aK,
  Uo as aL,
  Kr as aM,
  hi as aN,
  lo as aO,
  ni as aP,
  Q as aQ,
  he as aR,
  Ie as aS,
  kn as aT,
  $i as aU,
  ti as aV,
  Qo as aW,
  ei as aX,
  di as aY,
  bi as aZ,
  gn as a_,
  br as aa,
  mi as ab,
  vi as ac,
  Wr as ad,
  Gr as ae,
  Xo as af,
  ii as ag,
  fi as ah,
  An as ai,
  Io as aj,
  Ur as ak,
  cn as al,
  jr as am,
  zo as an,
  wi as ao,
  Si as ap,
  Ti as aq,
  Nr as ar,
  ui as as,
  ki as at,
  x as au,
  yi as av,
  qe as aw,
  zn as ax,
  A as ay,
  Rt as az,
  ee as b,
  ai as b0,
  eo as b1,
  vn as b2,
  rr as b3,
  zi as b4,
  Ii as b5,
  si as b6,
  Jo as b7,
  Ci as b8,
  ri as b9,
  Tt as ba,
  Or as bb,
  Mn as bc,
  li as bd,
  Ei as be,
  Ri as bf,
  Oi as bg,
  hn as bh,
  Pi as bi,
  Ai as bj,
  bo as bk,
  Ft as bl,
  To as bm,
  _i as c,
  Ke as d,
  j as e,
  J as f,
  qt as g,
  ae as h,
  Mr as i,
  _ as j,
  Bn as k,
  ci as l,
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
  Zo as y,
  dn as z
};
