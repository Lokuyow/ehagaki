const Ct = "ehagaki-composer", jo = 1, Mt = Symbol.for("ehagaki-composer.distribution");
function jr(e, t) {
  const r = globalThis, n = r[Mt];
  if (n && n !== e)
    throw new Error(
      `Cannot import the ${e} eHagaki Composer distribution after ${n} in the same document.`
    );
  r[Mt] = e;
  const o = customElements.get(Ct);
  if (!o) {
    customElements.define(Ct, t);
    return;
  }
  if (o !== t)
    throw new Error("ehagaki-composer is already defined by a different distribution.");
}
const qt = !1;
var Dr = Array.isArray, Hr = Array.prototype.indexOf, ye = Array.prototype.includes, Br = Array.from, We = Object.keys, Ye = Object.defineProperty, me = Object.getOwnPropertyDescriptor, Fr = Object.getOwnPropertyDescriptors, qr = Object.prototype, Vr = Array.prototype, Vt = Object.getPrototypeOf, Ot = Object.isExtensible;
function Do(e) {
  return typeof e == "function";
}
const Kr = () => {
};
function Ur(e) {
  for (var t = 0; t < e.length; t++)
    e[t]();
}
function Kt() {
  var e, t, r = new Promise((n, o) => {
    e = n, t = o;
  });
  return { promise: r, resolve: e, reject: t };
}
const $ = 2, Ee = 4, Ne = 8, _t = 1 << 24, P = 16, q = 32, G = 64, ct = 128, O = 512, E = 1024, x = 2048, V = 4096, R = 8192, F = 16384, ie = 32768, Rt = 1 << 25, Ie = 65536, Ge = 1 << 17, Wr = 1 << 18, pe = 1 << 19, Ut = 1 << 20, Ho = 1 << 25, de = 65536, Xe = 1 << 21, we = 1 << 22, re = 1 << 23, ce = Symbol("$state"), Yr = Symbol("legacy props"), Bo = Symbol(""), Gr = Symbol("attributes"), Xr = Symbol("class"), Zr = Symbol("style"), ut = Symbol("text"), Fo = Symbol("form reset"), et = new class extends Error {
  name = "StaleReactionError";
  message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), Vo = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml")
), Ko = 1, Pe = 3, ze = 8;
function Jr(e) {
  throw new Error("https://svelte.dev/e/lifecycle_outside_component");
}
function Qr() {
  throw new Error("https://svelte.dev/e/async_derived_orphan");
}
function Uo(e, t, r) {
  throw new Error("https://svelte.dev/e/each_key_duplicate");
}
function en(e) {
  throw new Error("https://svelte.dev/e/effect_in_teardown");
}
function tn() {
  throw new Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function rn(e) {
  throw new Error("https://svelte.dev/e/effect_orphan");
}
function nn() {
  throw new Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function on() {
  throw new Error("https://svelte.dev/e/hydration_failed");
}
function Wo(e) {
  throw new Error("https://svelte.dev/e/props_invalid_value");
}
function sn() {
  throw new Error("https://svelte.dev/e/state_descriptors_fixed");
}
function an() {
  throw new Error("https://svelte.dev/e/state_prototype_fixed");
}
function ln() {
  throw new Error("https://svelte.dev/e/state_unsafe_mutation");
}
function cn() {
  throw new Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
const Yo = 1, Go = 2, Xo = 4, Zo = 8, Jo = 16, Qo = 1, ei = 4, ti = 8, ri = 16, un = 1, fn = 2, Wt = "[", Yt = "[!", It = "[?", Gt = "]", ke = {}, k = Symbol(), hn = "http://www.w3.org/1999/xhtml", ni = "http://www.w3.org/2000/svg", oi = "http://www.w3.org/1998/Math/MathML", ii = "@attach";
function dn() {
  console.warn("https://svelte.dev/e/derived_inert");
}
function tt(e) {
  console.warn("https://svelte.dev/e/hydration_mismatch");
}
function si() {
  console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function pn() {
  console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
let y = !1;
function He(e) {
  y = e;
}
let _;
function H(e) {
  if (e === null)
    throw tt(), ke;
  return _ = e;
}
function mt() {
  return H(/* @__PURE__ */ J(_));
}
function ai(e) {
  if (y) {
    if (/* @__PURE__ */ J(_) !== null)
      throw tt(), ke;
    _ = e;
  }
}
function gn(e = 1) {
  if (y) {
    for (var t = e, r = _; t--; )
      r = /** @type {TemplateNode} */
      /* @__PURE__ */ J(r);
    _ = r;
  }
}
function bn(e = !0) {
  for (var t = 0, r = _; ; ) {
    if (r.nodeType === ze) {
      var n = (
        /** @type {Comment} */
        r.data
      );
      if (n === Gt) {
        if (t === 0) return r;
        t -= 1;
      } else (n === Wt || n === Yt || // "[1", "[2", etc. for if blocks
      n[0] === "[" && !isNaN(Number(n.slice(1)))) && (t += 1);
    }
    var o = (
      /** @type {TemplateNode} */
      /* @__PURE__ */ J(r)
    );
    e && r.remove(), r = o;
  }
}
function li(e) {
  if (!e || e.nodeType !== ze)
    throw tt(), ke;
  return (
    /** @type {Comment} */
    e.data
  );
}
function Xt(e) {
  return e === this.v;
}
function vn(e, t) {
  return e != e ? t == t : e !== t || e !== null && typeof e == "object" || typeof e == "function";
}
function Zt(e) {
  return !vn(e, this.v);
}
let _n = !1, S = null;
function xe(e) {
  S = e;
}
function ci(e) {
  return (
    /** @type {T} */
    rt().get(e)
  );
}
function ui(e, t) {
  return rt().set(e, t), t;
}
function fi(e) {
  return rt().has(e);
}
function hi() {
  return rt();
}
function mn(e, t = !1, r) {
  S = {
    p: S,
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
function wn(e) {
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
function Jt() {
  return !0;
}
function rt(e) {
  return S === null && Jr(), S.c ??= new Map(yn(S) || void 0);
}
function yn(e) {
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
function Qt() {
  var e = ae;
  ae = [], Ur(e);
}
function ue(e) {
  if (ae.length === 0 && !Oe) {
    var t = ae;
    queueMicrotask(() => {
      t === ae && Qt();
    });
  }
  ae.push(e);
}
function En() {
  for (; ae.length > 0; )
    Qt();
}
function er(e) {
  var t = g;
  if (t === null)
    return b.f |= re, e;
  if ((t.f & ie) === 0 && (t.f & Ee) === 0)
    throw e;
  te(e, t);
}
function te(e, t) {
  for (; t !== null; ) {
    if ((t.f & ct) !== 0) {
      if ((t.f & ie) === 0)
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
const kn = -7169;
function w(e, t) {
  e.f = e.f & kn | t;
}
function wt(e) {
  (e.f & O) !== 0 || e.deps === null ? w(e, E) : w(e, V);
}
function tr(e) {
  if (e !== null)
    for (const t of e)
      (t.f & $) === 0 || (t.f & de) === 0 || (t.f ^= de, tr(
        /** @type {Derived} */
        t.deps
      ));
}
function rr(e, t, r) {
  (e.f & x) !== 0 ? t.add(e) : (e.f & V) !== 0 && r.add(e), tr(e.deps), w(e, E);
}
let it = null, be = null, v = null, ft = null, z = null, ht = null, Oe = !1, st = !1, _e = null, qe = null;
var Lt = 0;
let xn = 1;
class X {
  id = xn++;
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
  #u = /* @__PURE__ */ new Set();
  /**
   * If a fork is discarded, we need to destroy any effects that are no longer needed
   * @type {Set<(batch: Batch) => void>}
   */
  #r = /* @__PURE__ */ new Set();
  /**
   * Callbacks that should run only when a fork is committed.
   * @type {Set<(batch: Batch) => void>}
   */
  #i = /* @__PURE__ */ new Set();
  /**
   * The number of async effects that are currently in flight
   */
  #n = 0;
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
  #c = null;
  /**
   * The root effects that need to be flushed
   * @type {Effect[]}
   */
  #a = [];
  /**
   * Effects created while this batch was active.
   * @type {Effect[]}
   */
  #l = [];
  /**
   * Deferred effects (which run after async work has completed) that are DIRTY
   * @type {Set<Effect>}
   */
  #f = /* @__PURE__ */ new Set();
  /**
   * Deferred effects that are MAYBE_DIRTY
   * @type {Set<Effect>}
   */
  #d = /* @__PURE__ */ new Set();
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
  #h = /* @__PURE__ */ new Set();
  is_fork = !1;
  #v = !1;
  #y() {
    if (this.is_fork) return !0;
    for (const n of this.#s.keys()) {
      for (var t = n, r = !1; t.parent !== null; ) {
        if (this.#p.has(t)) {
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
    this.#p.has(t) || this.#p.set(t, { d: [], m: [] }), this.#h.delete(t);
  }
  /**
   * Remove an effect from the #skipped_branches map and reschedule
   * any tracked dirty/maybe_dirty child effects
   * @param {Effect} effect
   * @param {(e: Effect) => void} callback
   */
  unskip_effect(t, r = (n) => this.schedule(n)) {
    var n = this.#p.get(t);
    if (n) {
      this.#p.delete(t);
      for (var o of n.d)
        w(o, x), r(o);
      for (o of n.m)
        w(o, V), r(o);
    }
    this.#h.add(t);
  }
  #b() {
    if (this.#e = !0, Lt++ > 1e3 && (this.#w(), $n()), !this.#y()) {
      for (const a of this.#f)
        this.#d.delete(a), w(a, x), this.schedule(a);
      for (const a of this.#d)
        w(a, V), this.schedule(a);
    }
    const t = this.#a;
    this.#a = [], this.apply();
    var r = _e = [], n = [], o = qe = [];
    for (const a of t)
      try {
        this.#E(a, r, n);
      } catch (c) {
        throw sr(a), c;
      }
    if (v = null, o.length > 0) {
      var i = X.ensure();
      for (const a of o)
        i.schedule(a);
    }
    if (_e = null, qe = null, this.#y()) {
      this.#g(n), this.#g(r);
      for (const [a, c] of this.#p)
        ir(a, c);
      o.length > 0 && /** @type {unknown} */
      v.#b();
      return;
    }
    const s = this.#k();
    if (s) {
      s.#_(this);
      return;
    }
    this.#f.clear(), this.#d.clear();
    for (const a of this.#u) a(this);
    this.#u.clear(), ft = this, Nt(n), Nt(r), ft = null, this.#c?.resolve();
    var l = (
      /** @type {Batch | null} */
      /** @type {unknown} */
      v
    );
    if (this.linked && this.#n === 0 && this.#w(), this.#a.length > 0) {
      l === null && (l = this, this.#m());
      const a = l;
      a.#a.push(...this.#a.filter((c) => !a.#a.includes(c)));
    }
    l !== null && l.#b();
  }
  /**
   * Traverse the effect tree, executing effects or stashing
   * them for later execution as appropriate
   * @param {Effect} root
   * @param {Effect[]} effects
   * @param {Effect[]} render_effects
   */
  #E(t, r, n) {
    t.f ^= E;
    for (var o = t.first; o !== null; ) {
      var i = o.f, s = (i & (q | G)) !== 0, l = s && (i & E) !== 0, a = l || (i & R) !== 0 || this.#p.has(o);
      if (!a && o.fn !== null) {
        s ? o.f ^= E : (i & Ee) !== 0 ? r.push(o) : De(o) && ((i & P) !== 0 && this.#d.add(o), Se(o));
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
  #k() {
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
  #_(t) {
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
            i & (we | P) && !this.async_deriveds.has(s) && (this.#d.delete(s), w(s, x), this.schedule(s));
          }
        }
    };
    for (const n of this.current.keys())
      r(n);
    this.oncommit(() => t.discard()), t.#w(), v = this, this.#b();
  }
  /**
   * @param {Effect[]} effects
   */
  #g(t) {
    for (var r = 0; r < t.length; r += 1)
      rr(t[r], this.#f, this.#d);
  }
  /**
   * Associate a change to a given source with the current
   * batch, noting its previous and current values
   * @param {Value} source
   * @param {any} value
   * @param {boolean} [is_derived]
   */
  capture(t, r, n = !1) {
    t.v !== k && !this.previous.has(t) && this.previous.set(t, t.v), (t.f & re) === 0 && (this.current.set(t, [r, n]), z?.set(t, r)), this.is_fork || (t.v = r);
  }
  activate() {
    v = this;
  }
  deactivate() {
    v = null, z = null;
  }
  flush() {
    try {
      st = !0, v = this, this.#b();
    } finally {
      Lt = 0, ht = null, _e = null, qe = null, st = !1, v = null, z = null, fe.clear();
    }
  }
  discard() {
    for (const t of this.#r) t(this);
    this.#r.clear(), this.#i.clear(), this.#w();
  }
  /**
   * @param {Effect} effect
   */
  register_created_effect(t) {
    this.#l.push(t);
  }
  #x() {
    this.#w();
    for (let u = it; u !== null; u = u.#o) {
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
                (h.f & (P | we)) !== 0 ? u.schedule(h) : u.#g([h]);
              });
          u.activate();
          var i = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map();
          for (var l of r)
            or(l, o, i, s);
          s = /* @__PURE__ */ new Map();
          var a = [...u.current.keys()].filter(
            (f) => this.current.has(f) ? (
              /** @type {[any, boolean]} */
              this.current.get(f)[0] !== f.v
            ) : !0
          );
          if (a.length > 0)
            for (const f of this.#l)
              (f.f & (F | R | Ge)) === 0 && yt(f, a, s) && ((f.f & (we | P)) !== 0 ? (w(f, x), u.schedule(f)) : u.#f.add(f));
          if (u.#a.length > 0) {
            u.apply();
            for (var c of u.#a)
              u.#E(c, [], []);
            u.#a = [];
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
      let n = this.#s.get(r) ?? 0;
      this.#s.set(r, n + 1);
    }
  }
  /**
   * @param {boolean} blocking
   * @param {Effect} effect
   */
  decrement(t, r) {
    if (this.#n -= 1, t) {
      let n = this.#s.get(r) ?? 0;
      n === 1 ? this.#s.delete(r) : this.#s.set(r, n - 1);
    }
    this.#v || (this.#v = !0, ue(() => {
      this.#v = !1, this.linked && this.flush();
    }));
  }
  /**
   * @param {Set<Effect>} dirty_effects
   * @param {Set<Effect>} maybe_dirty_effects
   */
  transfer_effects(t, r) {
    for (const n of t)
      this.#f.add(n);
    for (const n of r)
      this.#d.add(n);
    t.clear(), r.clear();
  }
  /** @param {(batch: Batch) => void} fn */
  oncommit(t) {
    this.#u.add(t);
  }
  /** @param {(batch: Batch) => void} fn */
  ondiscard(t) {
    this.#r.add(t);
  }
  /** @param {(batch: Batch) => void} fn */
  on_fork_commit(t) {
    this.#i.add(t);
  }
  run_fork_commit_callbacks() {
    for (const t of this.#i) t(this);
    this.#i.clear();
  }
  settled() {
    return (this.#c ??= Kt()).promise;
  }
  static ensure() {
    if (v === null) {
      const t = v = new X();
      t.#m(), !st && !Oe && ue(() => {
        t.#e || t.flush();
      });
    }
    return v;
  }
  apply() {
    {
      z = null;
      return;
    }
  }
  /**
   *
   * @param {Effect} effect
   */
  schedule(t) {
    if (ht = t, t.b?.is_pending && (t.f & (Ee | Ne | _t)) !== 0 && (t.f & ie) === 0) {
      t.b.defer_effect(t);
      return;
    }
    for (var r = t; r.parent !== null; ) {
      r = r.parent;
      var n = r.f;
      if (_e !== null && r === g && (b === null || (b.f & $) === 0))
        return;
      if ((n & (G | q)) !== 0) {
        if ((n & E) === 0)
          return;
        r.f ^= E;
      }
    }
    this.#a.push(r);
  }
  #m() {
    be === null ? it = be = this : (be.#o = this, this.#t = be), be = this;
  }
  #w() {
    var t = this.#t, r = this.#o;
    t === null ? it = r : t.#o = r, r === null ? be = t : r.#t = t, this.linked = !1;
  }
}
function nr(e) {
  var t = Oe;
  Oe = !0;
  try {
    for (var r; ; ) {
      if (En(), v === null)
        return (
          /** @type {T} */
          r
        );
      v.flush();
    }
  } finally {
    Oe = t;
  }
}
function $n() {
  try {
    nn();
  } catch (e) {
    te(e, ht);
  }
}
let W = null;
function Nt(e) {
  var t = e.length;
  if (t !== 0) {
    for (var r = 0; r < t; ) {
      var n = e[r++];
      if ((n.f & (F | R)) === 0 && De(n) && (W = /* @__PURE__ */ new Set(), Se(n), n.deps === null && n.first === null && n.nodes === null && n.teardown === null && n.ac === null && yr(n), W?.size > 0)) {
        fe.clear();
        for (const o of W) {
          if ((o.f & (F | R)) !== 0) continue;
          const i = [o];
          let s = o.parent;
          for (; s !== null; )
            W.has(s) && (W.delete(s), i.push(s)), s = s.parent;
          for (let l = i.length - 1; l >= 0; l--) {
            const a = i[l];
            (a.f & (F | R)) === 0 && Se(a);
          }
        }
        W.clear();
      }
    }
    W = null;
  }
}
function or(e, t, r, n) {
  if (!r.has(e) && (r.add(e), e.reactions !== null))
    for (const o of e.reactions) {
      const i = o.f;
      (i & $) !== 0 ? or(
        /** @type {Derived} */
        o,
        t,
        r,
        n
      ) : (i & (we | P)) !== 0 && (i & x) === 0 && yt(o, t, n) && (w(o, x), Et(
        /** @type {Effect} */
        o
      ));
    }
}
function yt(e, t, r) {
  const n = r.get(e);
  if (n !== void 0) return n;
  if (e.deps !== null)
    for (const o of e.deps) {
      if (ye.call(t, o))
        return !0;
      if ((o.f & $) !== 0 && yt(
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
function Et(e) {
  v.schedule(e);
}
function ir(e, t) {
  if (!((e.f & q) !== 0 && (e.f & E) !== 0)) {
    (e.f & x) !== 0 ? t.d.push(e) : (e.f & V) !== 0 && t.m.push(e), w(e, E);
    for (var r = e.first; r !== null; )
      ir(r, t), r = r.next;
  }
}
function sr(e) {
  w(e, E);
  for (var t = e.first; t !== null; )
    sr(t), t = t.next;
}
function Sn(e) {
  let t = 0, r = je(0), n;
  return () => {
    St() && (Y(r), mr(() => (t === 0 && (n = Yn(() => e(() => Re(r)))), t += 1, () => {
      ue(() => {
        t -= 1, t === 0 && (n?.(), n = void 0, Re(r));
      });
    })));
  };
}
var An = Ie | pe;
function Tn(e, t, r, n) {
  new Cn(e, t, r, n);
}
class Cn {
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
  #t = y ? _ : null;
  /** @type {BoundaryProps} */
  #o;
  /** @type {((anchor: Node) => void)} */
  #u;
  /** @type {Effect} */
  #r;
  /** @type {Effect | null} */
  #i = null;
  /** @type {Effect | null} */
  #n = null;
  /** @type {Effect | null} */
  #s = null;
  /** @type {DocumentFragment | null} */
  #c = null;
  #a = 0;
  #l = 0;
  #f = !1;
  /** @type {Set<Effect>} */
  #d = /* @__PURE__ */ new Set();
  /** @type {Set<Effect>} */
  #p = /* @__PURE__ */ new Set();
  /**
   * A source containing the number of pending async deriveds/expressions.
   * Only created if `$effect.pending()` is used inside the boundary,
   * otherwise updating the source results in needless `Batch.ensure()`
   * calls followed by no-op flushes
   * @type {Source<number> | null}
   */
  #h = null;
  #v = Sn(() => (this.#h = je(this.#a), () => {
    this.#h = null;
  }));
  /**
   * @param {TemplateNode} node
   * @param {BoundaryProps} props
   * @param {((anchor: Node) => void)} children
   * @param {((error: unknown) => unknown) | undefined} [transform_error]
   */
  constructor(t, r, n, o) {
    this.#e = t, this.#o = r, this.#u = (i) => {
      var s = (
        /** @type {Effect} */
        g
      );
      s.b = this, s.f |= ct, n(i);
    }, this.parent = /** @type {Effect} */
    g.b, this.transform_error = o ?? this.parent?.transform_error ?? ((i) => i), this.#r = Fn(() => {
      if (y) {
        const i = (
          /** @type {Comment} */
          this.#t
        );
        mt();
        const s = i.data === Yt;
        if (i.data.startsWith(It)) {
          const a = JSON.parse(i.data.slice(It.length));
          this.#b(a);
        } else s ? this.#E() : this.#y();
      } else
        this.#k();
    }, An), y && (this.#e = _);
  }
  #y() {
    try {
      this.#i = se(() => this.#u(this.#e));
    } catch (t) {
      this.error(t);
    }
  }
  /**
   * @param {unknown} error The deserialized error from the server's hydration comment
   */
  #b(t) {
    const r = this.#o.failed;
    r && (this.#s = se(() => {
      r(
        this.#e,
        () => t,
        () => () => {
        }
      );
    }));
  }
  #E() {
    const t = this.#o.pending;
    t && (this.is_pending = !0, this.#n = se(() => t(this.#e)), ue(() => {
      var r = this.#c = document.createDocumentFragment(), n = Z();
      r.append(n), this.#i = this.#g(() => se(() => this.#u(n))), this.#l === 0 && (this.#e.before(r), this.#c = null, Ve(
        /** @type {Effect} */
        this.#n,
        () => {
          this.#n = null;
        }
      ), this.#_(
        /** @type {Batch} */
        v
      ));
    }));
  }
  #k() {
    try {
      if (this.is_pending = this.has_pending_snippet(), this.#l = 0, this.#a = 0, this.#i = se(() => {
        this.#u(this.#e);
      }), this.#l > 0) {
        var t = this.#c = document.createDocumentFragment();
        Kn(this.#i, t);
        const r = (
          /** @type {(anchor: Node) => void} */
          this.#o.pending
        );
        this.#n = se(() => r(this.#e));
      } else
        this.#_(
          /** @type {Batch} */
          v
        );
    } catch (r) {
      this.error(r);
    }
  }
  /**
   * @param {Batch} batch
   */
  #_(t) {
    this.is_pending = !1, t.transfer_effects(this.#d, this.#p);
  }
  /**
   * Defer an effect inside a pending boundary until the boundary resolves
   * @param {Effect} effect
   */
  defer_effect(t) {
    rr(t, this.#d, this.#p);
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
  #g(t) {
    var r = g, n = b, o = S;
    K(this.#r), L(this.#r), xe(this.#r.ctx);
    try {
      return X.ensure(), t();
    } catch (i) {
      return er(i), null;
    } finally {
      K(r), L(n), xe(o);
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
    this.#l += t, this.#l === 0 && (this.#_(r), this.#n && Ve(this.#n, () => {
      this.#n = null;
    }), this.#c && (this.#e.before(this.#c), this.#c = null));
  }
  /**
   * Update the source that powers `$effect.pending()` inside this boundary,
   * and controls when the current `pending` snippet (if any) is removed.
   * Do not call from inside the class
   * @param {1 | -1} d
   * @param {Batch} batch
   */
  update_pending_count(t, r) {
    this.#x(t, r), this.#a += t, !(!this.#h || this.#f) && (this.#f = !0, ue(() => {
      this.#f = !1, this.#h && Qe(this.#h, this.#a);
    }));
  }
  get_effect_pending() {
    return this.#v(), Y(
      /** @type {Source<number>} */
      this.#h
    );
  }
  /** @param {unknown} error */
  error(t) {
    if (!this.#o.onerror && !this.#o.failed)
      throw t;
    v?.is_fork ? (this.#i && v.skip_effect(this.#i), this.#n && v.skip_effect(this.#n), this.#s && v.skip_effect(this.#s), v.on_fork_commit(() => {
      this.#m(t);
    })) : this.#m(t);
  }
  /**
   * @param {unknown} error
   */
  #m(t) {
    this.#i && (D(this.#i), this.#i = null), this.#n && (D(this.#n), this.#n = null), this.#s && (D(this.#s), this.#s = null), y && (H(
      /** @type {TemplateNode} */
      this.#t
    ), gn(), H(bn()));
    var r = this.#o.onerror;
    let n = this.#o.failed;
    var o = !1, i = !1;
    const s = () => {
      if (o) {
        pn();
        return;
      }
      o = !0, i && cn(), this.#s !== null && Ve(this.#s, () => {
        this.#s = null;
      }), this.#g(() => {
        this.#k();
      });
    }, l = (a) => {
      try {
        i = !0, r?.(a, s), i = !1;
      } catch (c) {
        te(c, this.#r && this.#r.parent);
      }
      n && (this.#s = this.#g(() => {
        try {
          return se(() => {
            var c = (
              /** @type {Effect} */
              g
            );
            c.b = this, c.f |= ct, n(
              this.#e,
              () => a,
              () => s
            );
          });
        } catch (c) {
          return te(
            c,
            /** @type {Effect} */
            this.#r.parent
          ), null;
        }
      }));
    };
    ue(() => {
      var a;
      try {
        a = this.transform_error(t);
      } catch (c) {
        te(c, this.#r && this.#r.parent);
        return;
      }
      a !== null && typeof a == "object" && typeof /** @type {any} */
      a.then == "function" ? a.then(
        l,
        /** @param {unknown} e */
        (c) => te(c, this.#r && this.#r.parent)
      ) : l(a);
    });
  }
}
function Mn(e, t, r, n) {
  const o = kt;
  var i = e.filter((h) => !h.settled);
  if (r.length === 0 && i.length === 0) {
    n(t.map(o));
    return;
  }
  var s = (
    /** @type {Effect} */
    g
  ), l = On(), a = i.length === 1 ? i[0].promise : i.length > 1 ? Promise.all(i.map((h) => h.promise)) : null;
  function c(h) {
    if ((s.f & F) === 0) {
      l();
      try {
        n(h);
      } catch (d) {
        te(d, s);
      }
      Ze();
    }
  }
  var u = ar();
  if (r.length === 0) {
    a.then(() => c(t.map(o))).finally(u);
    return;
  }
  function f() {
    Promise.all(r.map((h) => /* @__PURE__ */ Rn(h))).then((h) => c([...t.map(o), ...h])).catch((h) => te(h, s)).finally(u);
  }
  a ? a.then(() => {
    l(), f(), Ze();
  }) : f();
}
function On() {
  var e = (
    /** @type {Effect} */
    g
  ), t = b, r = S, n = (
    /** @type {Batch} */
    v
  );
  return function(i = !0) {
    K(e), L(t), xe(r), i && (e.f & F) === 0 && (n?.activate(), n?.apply());
  };
}
function Ze(e = !0) {
  K(null), L(null), xe(null), e && v?.deactivate();
}
function ar() {
  var e = (
    /** @type {Effect} */
    g
  ), t = (
    /** @type {Boundary} */
    e.b
  ), r = (
    /** @type {Batch} */
    v
  ), n = t.is_rendered();
  return t.update_pending_count(1, r), r.increment(n, e), () => {
    t.update_pending_count(-1, r), r.decrement(n, e);
  };
}
// @__NO_SIDE_EFFECTS__
function kt(e) {
  var t = $ | x;
  return g !== null && (g.f |= pe), {
    ctx: S,
    deps: null,
    effects: null,
    equals: Xt,
    f: t,
    fn: e,
    reactions: null,
    rv: 0,
    v: (
      /** @type {V} */
      k
    ),
    wv: 0,
    parent: g,
    ac: null
  };
}
const Be = Symbol("obsolete");
// @__NO_SIDE_EFFECTS__
function Rn(e, t, r) {
  let n = (
    /** @type {Effect | null} */
    g
  );
  n === null && Qr();
  var o = (
    /** @type {Promise<V>} */
    /** @type {unknown} */
    void 0
  ), i = je(
    /** @type {V} */
    k
  ), s = !b, l = /* @__PURE__ */ new Set();
  return Bn(() => {
    var a = (
      /** @type {Effect} */
      g
    ), c = Kt();
    o = c.promise;
    try {
      Promise.resolve(e()).then(c.resolve, (d) => {
        d !== et && c.reject(d);
      }).finally(Ze);
    } catch (d) {
      c.reject(d), Ze();
    }
    var u = (
      /** @type {Batch} */
      v
    );
    if (s) {
      if ((a.f & ie) !== 0)
        var f = ar();
      if (
        /** @type {Boundary} */
        n.b.is_rendered()
      )
        u.async_deriveds.get(a)?.reject(Be);
      else
        for (const d of l.values())
          d.reject(Be);
      l.add(c), u.async_deriveds.set(a, c);
    }
    const h = (d, p = void 0) => {
      f?.(), l.delete(c), p !== Be && (u.activate(), p ? (i.f |= re, Qe(i, p)) : ((i.f & re) !== 0 && (i.f ^= re), Qe(i, d)), u.deactivate());
    };
    c.promise.then(h, (d) => h(null, d || "unknown"));
  }), vr(() => {
    for (const a of l)
      a.reject(Be);
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
function di(e) {
  const t = /* @__PURE__ */ kt(e);
  return xr(t), t;
}
// @__NO_SIDE_EFFECTS__
function pi(e) {
  const t = /* @__PURE__ */ kt(e);
  return t.equals = Zt, t;
}
function In(e) {
  var t = e.effects;
  if (t !== null) {
    e.effects = null;
    for (var r = 0; r < t.length; r += 1)
      D(
        /** @type {Effect} */
        t[r]
      );
  }
}
function xt(e) {
  var t, r = g, n = e.parent;
  if (!oe && n !== null && (n.f & (F | R)) !== 0)
    return dn(), e.v;
  K(n);
  try {
    e.f &= ~de, In(e), t = Tr(e);
  } finally {
    K(r);
  }
  return t;
}
function lr(e) {
  var t = xt(e);
  if (!e.equals(t) && (e.wv = Sr(), (!v?.is_fork || e.deps === null) && (v !== null ? (v.capture(e, t, !0), ft?.capture(e, t, !0)) : e.v = t, e.deps === null))) {
    w(e, E);
    return;
  }
  oe || (z !== null ? (St() || v?.is_fork) && z.set(e, t) : wt(e));
}
function Ln(e) {
  if (e.effects !== null)
    for (const t of e.effects)
      (t.teardown || t.ac) && (t.teardown?.(), t.ac?.abort(et), t.teardown = Kr, t.ac = null, Le(t, 0), At(t));
}
function cr(e) {
  if (e.effects !== null)
    for (const t of e.effects)
      t.teardown && Se(t);
}
let Je = /* @__PURE__ */ new Set();
const fe = /* @__PURE__ */ new Map();
let ur = !1;
function je(e, t) {
  var r = {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v: e,
    reactions: null,
    equals: Xt,
    rv: 0,
    wv: 0
  };
  return r;
}
// @__NO_SIDE_EFFECTS__
function Q(e, t) {
  const r = je(e);
  return xr(r), r;
}
// @__NO_SIDE_EFFECTS__
function Nn(e, t = !1, r = !0) {
  const n = je(e);
  return t || (n.equals = Zt), n;
}
function ee(e, t, r = !1) {
  b !== null && // since we are untracking the function inside `$inspect.with` we need to add this check
  // to ensure we error if state is set inside an inspect effect
  (!j || (b.f & Ge) !== 0) && Jt() && (b.f & ($ | P | we | Ge)) !== 0 && (I === null || !ye.call(I, e)) && ln();
  let n = r ? Te(t) : t;
  return Qe(e, n, qe);
}
function Qe(e, t, r = null) {
  if (!e.equals(t)) {
    fe.set(e, oe ? t : e.v);
    var n = X.ensure();
    if (n.capture(e, t), (e.f & $) !== 0) {
      const o = (
        /** @type {Derived} */
        e
      );
      (e.f & x) !== 0 && xt(o), z === null && wt(o);
    }
    e.wv = Sr(), fr(e, x, r), g !== null && (g.f & E) !== 0 && (g.f & (q | G)) === 0 && (M === null ? Un([e]) : M.push(e)), !n.is_fork && Je.size > 0 && !ur && Pn();
  }
  return t;
}
function Pn() {
  ur = !1;
  for (const e of Je) {
    (e.f & E) !== 0 && w(e, V);
    let t;
    try {
      t = De(e);
    } catch {
      t = !0;
    }
    t && Se(e);
  }
  Je.clear();
}
function Re(e) {
  ee(e, e.v + 1);
}
function fr(e, t, r) {
  var n = e.reactions;
  if (n !== null)
    for (var o = n.length, i = 0; i < o; i++) {
      var s = n[i], l = s.f, a = (l & x) === 0;
      if (a && w(s, t), (l & Ge) !== 0)
        Je.add(
          /** @type {Effect} */
          s
        );
      else if ((l & $) !== 0) {
        var c = (
          /** @type {Derived} */
          s
        );
        z?.delete(c), (l & de) === 0 && (l & O && (g === null || (g.f & Xe) === 0) && (s.f |= de), fr(c, V, r));
      } else if (a) {
        var u = (
          /** @type {Effect} */
          s
        );
        (l & P) !== 0 && W !== null && W.add(u), r !== null ? r.push(u) : Et(u);
      }
    }
}
function Te(e) {
  if (typeof e != "object" || e === null || ce in e)
    return e;
  const t = Vt(e);
  if (t !== qr && t !== Vr)
    return e;
  var r = /* @__PURE__ */ new Map(), n = Dr(e), o = /* @__PURE__ */ Q(0), i = he, s = (l) => {
    if (he === i)
      return l();
    var a = b, c = he;
    L(null), Dt(i);
    var u = l();
    return L(a), Dt(c), u;
  };
  return n && r.set("length", /* @__PURE__ */ Q(
    /** @type {any[]} */
    e.length
  )), new Proxy(
    /** @type {any} */
    e,
    {
      defineProperty(l, a, c) {
        (!("value" in c) || c.configurable === !1 || c.enumerable === !1 || c.writable === !1) && sn();
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
            const u = s(() => /* @__PURE__ */ Q(k));
            r.set(a, u), Re(o);
          }
        } else
          ee(c, k), Re(o);
        return !0;
      },
      get(l, a, c) {
        if (a === ce)
          return e;
        var u = r.get(a), f = a in l;
        if (u === void 0 && (!f || me(l, a)?.writable) && (u = s(() => {
          var d = Te(f ? l[a] : k), p = /* @__PURE__ */ Q(d);
          return p;
        }), r.set(a, u)), u !== void 0) {
          var h = Y(u);
          return h === k ? void 0 : h;
        }
        return Reflect.get(l, a, c);
      },
      getOwnPropertyDescriptor(l, a) {
        var c = Reflect.getOwnPropertyDescriptor(l, a);
        if (c && "value" in c) {
          var u = r.get(a);
          u && (c.value = Y(u));
        } else if (c === void 0) {
          var f = r.get(a), h = f?.v;
          if (f !== void 0 && h !== k)
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
        var c = r.get(a), u = c !== void 0 && c.v !== k || Reflect.has(l, a);
        if (c !== void 0 || g !== null && (!u || me(l, a)?.writable)) {
          c === void 0 && (c = s(() => {
            var h = u ? Te(l[a]) : k, d = /* @__PURE__ */ Q(h);
            return d;
          }), r.set(a, c));
          var f = Y(c);
          if (f === k)
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
            p !== void 0 ? ee(p, k) : d in l && (p = s(() => /* @__PURE__ */ Q(k)), r.set(d + "", p));
          }
        if (f === void 0)
          (!h || me(l, a)?.writable) && (f = s(() => /* @__PURE__ */ Q(void 0)), ee(f, Te(c)), r.set(a, f));
        else {
          h = f.v !== k;
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
          Re(o);
        }
        return !0;
      },
      ownKeys(l) {
        Y(o);
        var a = Reflect.ownKeys(l).filter((f) => {
          var h = r.get(f);
          return h === void 0 || h.v !== k;
        });
        for (var [c, u] of r)
          u.v !== k && !(c in l) && a.push(c);
        return a;
      },
      setPrototypeOf() {
        an();
      }
    }
  );
}
function Pt(e) {
  try {
    if (e !== null && typeof e == "object" && ce in e)
      return e[ce];
  } catch {
  }
  return e;
}
function gi(e, t) {
  return Object.is(Pt(e), Pt(t));
}
var zt, hr, dr, pr;
function dt() {
  if (zt === void 0) {
    zt = window, hr = /Firefox/.test(navigator.userAgent);
    var e = Element.prototype, t = Node.prototype, r = Text.prototype;
    dr = me(t, "firstChild").get, pr = me(t, "nextSibling").get, Ot(e) && (e[Xr] = void 0, e[Gr] = null, e[Zr] = void 0, e.__e = void 0), Ot(r) && (r[ut] = void 0);
  }
}
function Z(e = "") {
  return document.createTextNode(e);
}
// @__NO_SIDE_EFFECTS__
function $e(e) {
  return (
    /** @type {TemplateNode | null} */
    dr.call(e)
  );
}
// @__NO_SIDE_EFFECTS__
function J(e) {
  return (
    /** @type {TemplateNode | null} */
    pr.call(e)
  );
}
function bi(e, t) {
  if (!y)
    return /* @__PURE__ */ $e(e);
  var r = /* @__PURE__ */ $e(_);
  if (r === null)
    r = _.appendChild(Z());
  else if (t && r.nodeType !== Pe) {
    var n = Z();
    return r?.before(n), H(n), n;
  }
  return t && nt(
    /** @type {Text} */
    r
  ), H(r), r;
}
function vi(e, t = !1) {
  if (!y) {
    var r = /* @__PURE__ */ $e(e);
    return r instanceof Comment && r.data === "" ? /* @__PURE__ */ J(r) : r;
  }
  if (t) {
    if (_?.nodeType !== Pe) {
      var n = Z();
      return _?.before(n), H(n), n;
    }
    nt(
      /** @type {Text} */
      _
    );
  }
  return _;
}
function _i(e, t = 1, r = !1) {
  let n = y ? _ : e;
  for (var o; t--; )
    o = n, n = /** @type {TemplateNode} */
    /* @__PURE__ */ J(n);
  if (!y)
    return n;
  if (r) {
    if (n?.nodeType !== Pe) {
      var i = Z();
      return n === null ? o?.after(i) : n.before(i), H(i), i;
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
function mi() {
  return !1;
}
function gr(e, t, r) {
  return (
    /** @type {T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : Element} */
    document.createElementNS(t ?? hn, e, void 0)
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
function $t(e) {
  var t = b, r = g;
  L(null), K(null);
  try {
    return e();
  } finally {
    L(t), K(r);
  }
}
function br(e) {
  g === null && (b === null && rn(), tn()), oe && en();
}
function jn(e, t) {
  var r = t.last;
  r === null ? t.last = t.first = e : (r.next = e, e.prev = r, t.last = e);
}
function N(e, t) {
  var r = g;
  r !== null && (r.f & R) !== 0 && (e |= R);
  var n = {
    ctx: S,
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
  v?.register_created_effect(n);
  var o = n;
  if ((e & Ee) !== 0)
    _e !== null ? _e.push(n) : X.ensure().schedule(n);
  else if (t !== null) {
    try {
      Se(n);
    } catch (s) {
      throw D(n), s;
    }
    o.deps === null && o.teardown === null && o.nodes === null && o.first === o.last && // either `null`, or a singular child
    (o.f & pe) === 0 && (o = o.first, (e & P) !== 0 && (e & Ie) !== 0 && o !== null && (o.f |= Ie));
  }
  if (o !== null && (o.parent = r, r !== null && jn(o, r), b !== null && (b.f & $) !== 0 && (e & G) === 0)) {
    var i = (
      /** @type {Derived} */
      b
    );
    (i.effects ??= []).push(o);
  }
  return n;
}
function St() {
  return b !== null && !j;
}
function vr(e) {
  const t = N(Ne, null);
  return w(t, E), t.teardown = e, t;
}
function wi(e) {
  br();
  var t = (
    /** @type {Effect} */
    g.f
  ), r = !b && (t & q) !== 0 && (t & ie) === 0;
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
  return N(Ee | Ut, e);
}
function yi(e) {
  return br(), N(Ne | Ut, e);
}
function Dn(e) {
  X.ensure();
  const t = N(G | pe, e);
  return () => {
    D(t);
  };
}
function Hn(e) {
  X.ensure();
  const t = N(G | pe, e);
  return (r = {}) => new Promise((n) => {
    r.outro ? Ve(t, () => {
      D(t), n(void 0);
    }) : (D(t), n(void 0));
  });
}
function Ei(e) {
  return N(Ee, e);
}
function Bn(e) {
  return N(we | pe, e);
}
function mr(e, t = 0) {
  return N(Ne | t, e);
}
function ki(e, t = [], r = [], n = []) {
  Mn(n, t, r, (o) => {
    N(Ne, () => e(...o.map(Y)));
  });
}
function Fn(e, t = 0) {
  var r = N(P | t, e);
  return r;
}
function xi(e, t = 0) {
  var r = N(_t | t, e);
  return r;
}
function se(e) {
  return N(q | pe, e);
}
function wr(e) {
  var t = e.teardown;
  if (t !== null) {
    const r = oe, n = b;
    jt(!0), L(null);
    try {
      t.call(null);
    } finally {
      jt(r), L(n);
    }
  }
}
function At(e, t = !1) {
  var r = e.first;
  for (e.first = e.last = null; r !== null; ) {
    const o = r.ac;
    o !== null && $t(() => {
      o.abort(et);
    });
    var n = r.next;
    (r.f & G) !== 0 ? r.parent = null : D(r, t), r = n;
  }
}
function qn(e) {
  for (var t = e.first; t !== null; ) {
    var r = t.next;
    (t.f & q) === 0 && D(t), t = r;
  }
}
function D(e, t = !0) {
  var r = !1;
  (t || (e.f & Wr) !== 0) && e.nodes !== null && e.nodes.end !== null && (Vn(
    e.nodes.start,
    /** @type {TemplateNode} */
    e.nodes.end
  ), r = !0), w(e, Rt), At(e, t && !r), Le(e, 0);
  var n = e.nodes && e.nodes.t;
  if (n !== null)
    for (const i of n)
      i.stop();
  wr(e), e.f ^= Rt, e.f |= F;
  var o = e.parent;
  o !== null && o.first !== null && yr(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Vn(e, t) {
  for (; e !== null; ) {
    var r = e === t ? null : /* @__PURE__ */ J(e);
    e.remove(), e = r;
  }
}
function yr(e) {
  var t = e.parent, r = e.prev, n = e.next;
  r !== null && (r.next = n), n !== null && (n.prev = r), t !== null && (t.first === e && (t.first = n), t.last === e && (t.last = r));
}
function Ve(e, t, r = !0) {
  var n = [];
  Er(e, n, !0);
  var o = () => {
    r && D(e), t && t();
  }, i = n.length;
  if (i > 0) {
    var s = () => --i || o();
    for (var l of n)
      l.out(s);
  } else
    o();
}
function Er(e, t, r) {
  if ((e.f & R) === 0) {
    e.f ^= R;
    var n = e.nodes && e.nodes.t;
    if (n !== null)
      for (const l of n)
        (l.is_global || r) && t.push(l);
    for (var o = e.first; o !== null; ) {
      var i = o.next;
      if ((o.f & G) === 0) {
        var s = (o.f & Ie) !== 0 || // If this is a branch effect without a block effect parent,
        // it means the parent block effect was pruned. In that case,
        // transparency information was transferred to the branch effect.
        (o.f & q) !== 0 && (e.f & P) !== 0;
        Er(o, t, s ? r : !1);
      }
      o = i;
    }
  }
}
function $i(e) {
  kr(e, !0);
}
function kr(e, t) {
  if ((e.f & R) !== 0) {
    e.f ^= R, (e.f & E) === 0 && (w(e, x), X.ensure().schedule(e));
    for (var r = e.first; r !== null; ) {
      var n = r.next, o = (r.f & Ie) !== 0 || (r.f & q) !== 0;
      kr(r, o ? t : !1), r = n;
    }
    var i = e.nodes && e.nodes.t;
    if (i !== null)
      for (const s of i)
        (s.is_global || t) && s.in();
  }
}
function Kn(e, t) {
  if (e.nodes)
    for (var r = e.nodes.start, n = e.nodes.end; r !== null; ) {
      var o = r === n ? null : /* @__PURE__ */ J(r);
      t.append(r), r = o;
    }
}
let Ke = !1, oe = !1;
function jt(e) {
  oe = e;
}
let b = null, j = !1;
function L(e) {
  b = e;
}
let g = null;
function K(e) {
  g = e;
}
let I = null;
function xr(e) {
  b !== null && (I === null ? I = [e] : I.push(e));
}
let A = null, C = 0, M = null;
function Un(e) {
  M = e;
}
let $r = 1, le = 0, he = le;
function Dt(e) {
  he = e;
}
function Sr() {
  return ++$r;
}
function De(e) {
  var t = e.f;
  if ((t & x) !== 0)
    return !0;
  if (t & $ && (e.f &= ~de), (t & V) !== 0) {
    for (var r = (
      /** @type {Value[]} */
      e.deps
    ), n = r.length, o = 0; o < n; o++) {
      var i = r[o];
      if (De(
        /** @type {Derived} */
        i
      ) && lr(
        /** @type {Derived} */
        i
      ), i.wv > e.wv)
        return !0;
    }
    (t & O) !== 0 && // During time traveling we don't want to reset the status so that
    // traversal of the graph in the other batches still happens
    z === null && w(e, E);
  }
  return !1;
}
function Ar(e, t, r = !0) {
  var n = e.reactions;
  if (n !== null && !(I !== null && ye.call(I, e)))
    for (var o = 0; o < n.length; o++) {
      var i = n[o];
      (i.f & $) !== 0 ? Ar(
        /** @type {Derived} */
        i,
        t,
        !1
      ) : t === i && (r ? w(i, x) : (i.f & E) !== 0 && w(i, V), Et(
        /** @type {Effect} */
        i
      ));
    }
}
function Tr(e) {
  var t = A, r = C, n = M, o = b, i = I, s = S, l = j, a = he, c = e.f;
  A = /** @type {null | Value[]} */
  null, C = 0, M = null, b = (c & (q | G)) === 0 ? e : null, I = null, xe(e.ctx), j = !1, he = ++le, e.ac !== null && ($t(() => {
    e.ac.abort(et);
  }), e.ac = null);
  try {
    e.f |= Xe;
    var u = (
      /** @type {Function} */
      e.fn
    ), f = u();
    e.f |= ie;
    var h = e.deps, d = v?.is_fork;
    if (A !== null) {
      var p;
      if (d || Le(e, C), h !== null && C > 0)
        for (h.length = C + A.length, p = 0; p < A.length; p++)
          h[C + p] = A[p];
      else
        e.deps = h = A;
      if (St() && (e.f & O) !== 0)
        for (p = C; p < h.length; p++)
          (h[p].reactions ??= []).push(e);
    } else !d && h !== null && C < h.length && (Le(e, C), h.length = C);
    if (Jt() && M !== null && !j && h !== null && (e.f & ($ | V | x)) === 0)
      for (p = 0; p < /** @type {Source[]} */
      M.length; p++)
        Ar(
          M[p],
          /** @type {Effect} */
          e
        );
    if (o !== null && o !== e) {
      if (le++, o.deps !== null)
        for (let m = 0; m < r; m += 1)
          o.deps[m].rv = le;
      if (t !== null)
        for (const m of t)
          m.rv = le;
      M !== null && (n === null ? n = M : n.push(.../** @type {Source[]} */
      M));
    }
    return (e.f & re) !== 0 && (e.f ^= re), f;
  } catch (m) {
    return er(m);
  } finally {
    e.f ^= Xe, A = t, C = r, M = n, b = o, I = i, xe(s), j = l, he = a;
  }
}
function Wn(e, t) {
  let r = t.reactions;
  if (r !== null) {
    var n = Hr.call(r, e);
    if (n !== -1) {
      var o = r.length - 1;
      o === 0 ? r = t.reactions = null : (r[n] = r[o], r.pop());
    }
  }
  if (r === null && (t.f & $) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
  // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
  // allows us to skip the expensive work of disconnecting and immediately reconnecting it
  (A === null || !ye.call(A, t))) {
    var i = (
      /** @type {Derived} */
      t
    );
    (i.f & O) !== 0 && (i.f ^= O, i.f &= ~de), i.v !== k && wt(i), Ln(i), Le(i, 0);
  }
}
function Le(e, t) {
  var r = e.deps;
  if (r !== null)
    for (var n = t; n < r.length; n++)
      Wn(e, r[n]);
}
function Se(e) {
  var t = e.f;
  if ((t & F) === 0) {
    w(e, E);
    var r = g, n = Ke;
    g = e, Ke = !0;
    try {
      (t & (P | _t)) !== 0 ? qn(e) : At(e), wr(e);
      var o = Tr(e);
      e.teardown = typeof o == "function" ? o : null, e.wv = $r;
      var i;
      qt && _n && (e.f & x) !== 0 && e.deps;
    } finally {
      Ke = n, g = r;
    }
  }
}
async function Si() {
  await Promise.resolve(), nr();
}
function Y(e) {
  var t = e.f, r = (t & $) !== 0;
  if (b !== null && !j) {
    var n = g !== null && (g.f & F) !== 0;
    if (!n && (I === null || !ye.call(I, e))) {
      var o = b.deps;
      if ((b.f & Xe) !== 0)
        e.rv < le && (e.rv = le, A === null && o !== null && o[C] === e ? C++ : A === null ? A = [e] : A.push(e));
      else {
        (b.deps ??= []).push(e);
        var i = e.reactions;
        i === null ? e.reactions = [b] : ye.call(i, b) || i.push(b);
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
      return ((s.f & E) === 0 && s.reactions !== null || Mr(s)) && (l = xt(s)), fe.set(s, l), l;
    }
    var a = (s.f & O) === 0 && !j && b !== null && (Ke || (b.f & O) !== 0), c = (s.f & ie) === 0;
    De(s) && (a && (s.f |= O), lr(s)), a && !c && (cr(s), Cr(s));
  }
  if (z?.has(e))
    return z.get(e);
  if ((e.f & re) !== 0)
    throw e.v;
  return e.v;
}
function Cr(e) {
  if (e.f |= O, e.deps !== null)
    for (const t of e.deps)
      (t.reactions ??= []).push(e), (t.f & $) !== 0 && (t.f & O) === 0 && (cr(
        /** @type {Derived} */
        t
      ), Cr(
        /** @type {Derived} */
        t
      ));
}
function Mr(e) {
  if (e.v === k) return !0;
  if (e.deps === null) return !1;
  for (const t of e.deps)
    if (fe.has(t) || (t.f & $) !== 0 && Mr(
      /** @type {Derived} */
      t
    ))
      return !0;
  return !1;
}
function Yn(e) {
  var t = j;
  try {
    return j = !0, e();
  } finally {
    j = t;
  }
}
function Ai(e) {
  if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
    if (ce in e)
      pt(e);
    else if (!Array.isArray(e))
      for (let t in e) {
        const r = e[t];
        typeof r == "object" && r && ce in r && pt(r);
      }
  }
}
function pt(e, t = /* @__PURE__ */ new Set()) {
  if (typeof e == "object" && e !== null && // We don't want to traverse DOM elements
  !(e instanceof EventTarget) && !t.has(e)) {
    t.add(e), e instanceof Date && e.getTime();
    for (let n in e)
      try {
        pt(e[n], t);
      } catch {
      }
    const r = Vt(e);
    if (r !== Object.prototype && r !== Array.prototype && r !== Map.prototype && r !== Set.prototype && r !== Date.prototype) {
      const n = Fr(r);
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
function Ti(e) {
  return e.endsWith("capture") && e !== "gotpointercapture" && e !== "lostpointercapture";
}
const Gn = [
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
function Ci(e) {
  return Gn.includes(e);
}
const Xn = {
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
function Mi(e) {
  return e = e.toLowerCase(), Xn[e] ?? e;
}
const Zn = ["touchstart", "touchmove"];
function Jn(e) {
  return Zn.includes(e);
}
const Qn = (
  /** @type {const} */
  ["textarea", "script", "style", "title"]
);
function Oi(e) {
  return Qn.includes(
    /** @type {typeof RAW_TEXT_ELEMENTS[number]} */
    e
  );
}
const Ce = Symbol("events"), Or = /* @__PURE__ */ new Set(), gt = /* @__PURE__ */ new Set();
function Ri(e) {
  if (!y) return;
  e.removeAttribute("onload"), e.removeAttribute("onerror");
  const t = e.__e;
  t !== void 0 && (e.__e = void 0, queueMicrotask(() => {
    e.isConnected && e.dispatchEvent(t);
  }));
}
function Rr(e, t, r, n = {}) {
  function o(i) {
    if (n.capture || bt.call(t, i), !i.cancelBubble)
      return $t(() => r?.call(this, i));
  }
  return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? ue(() => {
    t.addEventListener(e, o, n);
  }) : t.addEventListener(e, o, n), o;
}
function Ii(e, t, r, n = {}) {
  var o = Rr(t, e, r, n);
  return () => {
    e.removeEventListener(t, o, n);
  };
}
function Li(e, t, r, n, o) {
  var i = { capture: n, passive: o }, s = Rr(e, t, r, i);
  (t === document.body || // @ts-ignore
  t === window || // @ts-ignore
  t === document || // Firefox has quirky behavior, it can happen that we still get "canplay" events when the element is already removed
  t instanceof HTMLMediaElement) && vr(() => {
    t.removeEventListener(e, s, i);
  });
}
function Ni(e, t, r) {
  (t[Ce] ??= {})[e] = r;
}
function Pi(e) {
  for (var t = 0; t < e.length; t++)
    Or.add(e[t]);
  for (var r of gt)
    r(e);
}
let Ht = null;
function bt(e) {
  var t = this, r = (
    /** @type {Node} */
    t.ownerDocument
  ), n = e.type, o = e.composedPath?.() || [], i = (
    /** @type {null | Element} */
    o[0] || e.target
  );
  Ht = e;
  var s = 0, l = Ht === e && e[Ce];
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
    Ye(e, "currentTarget", {
      configurable: !0,
      get() {
        return i || r;
      }
    });
    var u = b, f = g;
    L(null), K(null);
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
      e[Ce] = t, delete e.currentTarget, L(u), K(f);
    }
  }
}
const eo = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", {
    /** @param {string} html */
    createHTML: (e) => e
  })
);
function to(e) {
  return (
    /** @type {string} */
    eo?.createHTML(e) ?? e
  );
}
function ro(e) {
  var t = gr("template");
  return t.innerHTML = to(e.replaceAll("<!>", "<!---->")), t.content;
}
function ne(e, t) {
  var r = (
    /** @type {Effect} */
    g
  );
  r.nodes === null && (r.nodes = { start: e, end: t, a: null, t: null });
}
// @__NO_SIDE_EFFECTS__
function zi(e, t) {
  var r = (t & un) !== 0, n = (t & fn) !== 0, o, i = !e.startsWith("<!>");
  return () => {
    if (y)
      return ne(_, null), _;
    o === void 0 && (o = ro(i ? e : "<!>" + e), r || (o = /** @type {TemplateNode} */
    /* @__PURE__ */ $e(o)));
    var s = (
      /** @type {TemplateNode} */
      n || hr ? document.importNode(o, !0) : o.cloneNode(!0)
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
function ji(e = "") {
  if (!y) {
    var t = Z(e + "");
    return ne(t, t), t;
  }
  var r = _;
  return r.nodeType !== Pe ? (r.before(r = Z()), H(r)) : nt(
    /** @type {Text} */
    r
  ), ne(r, r), r;
}
function Di() {
  if (y)
    return ne(_, null), _;
  var e = document.createDocumentFragment(), t = document.createComment(""), r = Z();
  return e.append(t, r), ne(t, r), e;
}
function no(e, t) {
  if (y) {
    var r = (
      /** @type {Effect & { nodes: EffectNodes }} */
      g
    );
    ((r.f & ie) === 0 || r.nodes.end === null) && (r.nodes.end = _), mt();
    return;
  }
  e !== null && e.before(
    /** @type {Node} */
    t
  );
}
function Hi() {
  if (y && _ && _.nodeType === ze && _.textContent?.startsWith("$")) {
    const e = _.textContent.substring(1);
    return mt(), e;
  }
  return (window.__svelte ??= {}).uid ??= 1, `c${window.__svelte.uid++}`;
}
function Bi(e, t) {
  var r = t == null ? "" : typeof t == "object" ? `${t}` : t;
  r !== /** @type {any} */
  (e[ut] ??= e.nodeValue) && (e[ut] = r, e.nodeValue = `${r}`);
}
function Tt(e, t) {
  return Ir(e, t);
}
function oo(e, t) {
  dt(), t.intro = t.intro ?? !1;
  const r = t.target, n = y, o = _;
  try {
    for (var i = /* @__PURE__ */ $e(r); i && (i.nodeType !== ze || /** @type {Comment} */
    i.data !== Wt); )
      i = /* @__PURE__ */ J(i);
    if (!i)
      throw ke;
    He(!0), H(
      /** @type {Comment} */
      i
    );
    const s = Ir(e, { ...t, anchor: i });
    return He(!1), /**  @type {Exports} */
    s;
  } catch (s) {
    if (s instanceof Error && s.message.split(`
`).some((l) => l.startsWith("https://svelte.dev/e/")))
      throw s;
    return s !== ke && console.warn("Failed to hydrate: ", s), t.recover === !1 && on(), dt(), zn(r), He(!1), Tt(e, t);
  } finally {
    He(n), H(o);
  }
}
const Fe = /* @__PURE__ */ new Map();
function Ir(e, { target: t, anchor: r, props: n = {}, events: o, context: i, intro: s = !0, transformError: l }) {
  dt();
  var a = void 0, c = Hn(() => {
    var u = r ?? t.appendChild(Z());
    Tn(
      /** @type {TemplateNode} */
      u,
      {
        pending: () => {
        }
      },
      (d) => {
        mn({});
        var p = (
          /** @type {ComponentContext} */
          S
        );
        if (i && (p.c = i), o && (n.$$events = o), y && ne(
          /** @type {TemplateNode} */
          d,
          null
        ), a = e(d, n) || {}, y && (g.nodes.end = _, _ === null || _.nodeType !== ze || /** @type {Comment} */
        _.data !== Gt))
          throw tt(), ke;
        wn();
      },
      l
    );
    var f = /* @__PURE__ */ new Set(), h = (d) => {
      for (var p = 0; p < d.length; p++) {
        var m = d[p];
        if (!f.has(m)) {
          f.add(m);
          var T = Jn(m);
          for (const ot of [t, document]) {
            var U = Fe.get(ot);
            U === void 0 && (U = /* @__PURE__ */ new Map(), Fe.set(ot, U));
            var ge = U.get(m);
            ge === void 0 ? (ot.addEventListener(m, bt, { passive: T }), U.set(m, 1)) : U.set(m, ge + 1);
          }
        }
      }
    };
    return h(Br(Or)), gt.add(h), () => {
      for (var d of f)
        for (const T of [t, document]) {
          var p = (
            /** @type {Map<string, number>} */
            Fe.get(T)
          ), m = (
            /** @type {number} */
            p.get(d)
          );
          --m == 0 ? (T.removeEventListener(d, bt), p.delete(d), p.size === 0 && Fe.delete(T)) : p.set(d, m);
        }
      gt.delete(h), u !== r && u.parentNode?.removeChild(u);
    };
  });
  return vt.set(a, c), a;
}
let vt = /* @__PURE__ */ new WeakMap();
function Lr(e, t) {
  const r = vt.get(e);
  return r ? (vt.delete(e), r(t)) : Promise.resolve();
}
function io(e) {
  return new so(e);
}
class so {
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
          return Y(r.get(s) ?? n(s, Reflect.get(i, s)));
        },
        has(i, s) {
          return s === Yr ? !0 : (Y(r.get(s) ?? n(s, Reflect.get(i, s))), Reflect.has(i, s));
        },
        set(i, s, l) {
          return ee(r.get(s) ?? n(s, l), l), Reflect.set(i, s, l);
        }
      }
    );
    this.#t = (t.hydrate ? oo : Tt)(t.component, {
      target: t.target,
      anchor: t.anchor,
      props: o,
      context: t.context,
      intro: t.intro ?? !1,
      recover: t.recover,
      transformError: t.transformError
    }), (!t?.props?.$$host || t.sync === !1) && nr(), this.#e = o.$$events;
    for (const i of Object.keys(this.#t))
      i === "$set" || i === "$destroy" || i === "$on" || Ye(this, i, {
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
      Lr(this.#t);
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
let Nr;
typeof HTMLElement == "function" && (Nr = class extends HTMLElement {
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
          const i = gr("slot");
          n !== "default" && (i.name = n), no(o, i);
        };
      };
      if (await Promise.resolve(), !this.$$cn || this.$$c)
        return;
      const t = {}, r = ao(this);
      for (const n of this.$$s)
        n in r && (n === "default" && !this.$$d.children ? (this.$$d.children = e(n), t.default = !0) : t[n] = e(n));
      for (const n of this.attributes) {
        const o = this.$$g_p(n.name);
        o in this.$$d || (this.$$d[o] = Ue(o, n.value, this.$$p_d, "toProp"));
      }
      for (const n in this.$$p_d)
        !(n in this.$$d) && this[n] !== void 0 && (this.$$d[n] = this[n], delete this[n]);
      this.$$c = io({
        component: this.$$ctor,
        target: this.$$shadowRoot || this,
        props: {
          ...this.$$d,
          $$slots: t,
          $$host: this
        }
      }), this.$$me = Dn(() => {
        mr(() => {
          this.$$r = !0;
          for (const n of We(this.$$c)) {
            if (!this.$$p_d[n]?.reflect) continue;
            this.$$d[n] = this.$$c[n];
            const o = Ue(
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
    this.$$r || (e = this.$$g_p(e), this.$$d[e] = Ue(e, r, this.$$p_d, "toProp"), this.$$c?.$set({ [e]: this.$$d[e] }));
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
    return We(this.$$p_d).find(
      (t) => this.$$p_d[t].attribute === e || !this.$$p_d[t].attribute && t.toLowerCase() === e
    ) || e;
  }
});
function Ue(e, t, r, n) {
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
function ao(e) {
  const t = {};
  return e.childNodes.forEach((r) => {
    t[
      /** @type {Element} node */
      r.slot || "default"
    ] = !0;
  }), t;
}
function Fi(e, t, r, n, o, i) {
  let s = class extends Nr {
    constructor() {
      super(e, r, o), this.$$p_d = t;
    }
    static get observedAttributes() {
      return We(t).map(
        (l) => (t[l].attribute || l).toLowerCase()
      );
    }
  };
  return We(t).forEach((l) => {
    Ye(s.prototype, l, {
      get() {
        return this.$$c && l in this.$$c ? this.$$c[l] : this.$$d[l];
      },
      set(a) {
        a = Ue(l, a, t), this.$$d[l] = a;
        var c = this.$$c;
        if (c) {
          var u = me(c, l)?.get;
          u ? c[l] = a : c.$set({ [l]: a });
        }
      }
    });
  }), n.forEach((l) => {
    Ye(s.prototype, l, {
      get() {
        return this.$$c?.[l];
      }
    });
  }), e.element = /** @type {any} */
  s, s;
}
let Pr;
const lo = "ehagaki.web-component.v1:", ve = /* @__PURE__ */ new Map(), co = {
  get length() {
    return ve.size;
  },
  clear() {
    ve.clear();
  },
  getItem(e) {
    return ve.get(e) ?? null;
  },
  key(e) {
    return [...ve.keys()][e] ?? null;
  },
  removeItem(e) {
    ve.delete(e);
  },
  setItem(e, t) {
    ve.set(e, String(t));
  }
};
function uo() {
  if (typeof globalThis < "u") {
    const e = globalThis.localStorage;
    if (e)
      return e;
  }
  return co;
}
function fo() {
  return Pr ?? uo();
}
function ho(e) {
  Pr = e;
}
function at(e, t) {
  const r = [];
  for (let n = 0; n < e.length; n += 1) {
    const o = e.key(n);
    o?.startsWith(t) && r.push(o.slice(t.length));
  }
  return r;
}
function po(e, t) {
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
function go(e) {
  return po(
    e,
    lo
  );
}
function bo() {
  return {
    style: {
      setProperty: () => {
      },
      removeProperty: () => "",
      getPropertyValue: () => ""
    }
  };
}
function vo() {
  const e = typeof window < "u" ? window : void 0, t = e?.document, r = t?.documentElement ?? bo(), n = t?.body ?? r;
  return {
    storage: fo(),
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
let Me = vo();
function _o(e) {
  return Me = {
    ...Me,
    ...e
  }, ho(Me.storage), Me;
}
function qi() {
  return Me;
}
const mo = ":root{--app-root-height: 100%;--app-root-top: 0px;--app-root-overflow-y: visible;--app-main-height: 100svh;--app-body-position: static;--app-body-inset: auto;--app-body-width: auto;--app-overlay-position: fixed;--app-overscroll-behavior: auto;--footer-height: 66px;--footer-bottom: 0px;--keyboard-height: 0px;--mobile-dialog-viewport-top: 0px;--mobile-dialog-viewport-height: 100dvh;--mobile-dialog-center-y: 43dvh;--keyboard-button-bar-height: 50px;--keyboard-button-bar-bottom: 66px;--main-content-keyboard-adjustment: var(--keyboard-height);--reason-input-base-height: 50px;--reason-input-height: 0px;--reason-input-bottom: 116px;--main-content-top-spacing: 6px;--composer-bottom-reserved-height: 116px;--accent-color-default: hsl(152, 74%, 43%);--accent-color: var( --accent-color-forced, var(--accent-color-user, var(--accent-color-external-default, var(--accent-color-default))) );--accent-color-custom: var( --accent-color-forced, var(--accent-color-user, var(--accent-color-external-default)) );--accent-color-custom-inner: color-mix(in srgb, var(--accent-color-custom) 15%, white 85%);--accent-color-custom-face: color-mix(in srgb, var(--accent-color-custom) 40%, black 60%);--base-color: var( --base-color-forced, var(--base-color-user, var(--base-color-external-default)) );--theme: var(--accent-color);--text-black: hsl(0, 0%, 24%);--nostr-bg: hsl(270, 100%, 98%);--yellow: hsl(50, 100%, 50%);--danger: hsl(0, 84%, 60%);--darker: rgba(0, 0, 0, .8);--dark-gray: hsl(0, 0%, 66%);--light-gray: hsl(0, 0%, 83%);--base-color-surface-bg-light: color-mix(in srgb, var(--base-color) 18%, hsl(0, 0%, 97%));--base-color-surface-bg-dark: color-mix(in srgb, var(--base-color) 18%, hsl(0, 0%, 12%));--base-color-surface-editor-light: color-mix(in srgb, var(--base-color) 6%, hsl(0, 0%, 100%));--base-color-surface-editor-dark: color-mix(in srgb, var(--base-color) 9%, hsl(0, 0%, 22%));--base-color-surface-footer-light: color-mix(in srgb, var(--base-color) 34%, hsl(0, 0%, 86%));--base-color-surface-footer-dark: color-mix(in srgb, var(--base-color) 22%, hsl(0, 0%, 10%));--surface-bg: light-dark( var(--base-color-surface-bg-light, color-mix(in srgb, hsl(0, 0%, 94%) 18%, hsl(0, 0%, 94%))), var(--base-color-surface-bg-dark, color-mix(in srgb, hsl(0, 0%, 12%) 18%, hsl(0, 0%, 12%))) );--surface-input: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 100%)) 14%, hsl(0, 0%, 100%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 19%)) 14%, hsl(0, 0%, 19%)) );--surface-editor: light-dark( var(--base-color-surface-editor-light, var(--surface-input)), var(--base-color-surface-editor-dark, var(--surface-input)) );--surface-footer: light-dark( var(--base-color-surface-footer-light, color-mix(in srgb, hsl(0, 0%, 82%) 22%, hsl(0, 0%, 82%))), var(--base-color-surface-footer-dark, color-mix(in srgb, hsl(0, 0%, 10%) 22%, hsl(0, 0%, 10%))) );--surface-buttonbar: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 91%)) 20%, hsl(0, 0%, 91%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 28%)) 20%, hsl(0, 0%, 28%)) );--base-color-surface-button: color-mix(in srgb, var(--base-color) 24%, white);--surface-button: light-dark( var(--base-color-surface-button, hsl(0, 0%, 92%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 25%)) 18%, hsl(0, 0%, 25%)) );--surface-button-border: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 75%)) 24%, hsl(0, 0%, 75%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 30%)) 24%, hsl(0, 0%, 30%)) );--surface-button-preview-action: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 74%)) 22%, hsl(0, 0%, 74%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 36%)) 22%, hsl(0, 0%, 36%)) );--surface-border: light-dark( color-mix(in srgb, var(--base-color, var(--light-gray)) 24%, var(--light-gray)), color-mix(in srgb, var(--base-color, dimgray) 24%, dimgray) );--surface-border-hr: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 84%)) 20%, hsl(0, 0%, 84%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 30%)) 20%, hsl(0, 0%, 30%)) );--surface-border-hr-light: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 92%)) 16%, hsl(0, 0%, 92%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 20%)) 16%, hsl(0, 0%, 20%)) );--surface-dialog: light-dark( color-mix(in srgb, var(--base-color, white) 14%, white), color-mix(in srgb, var(--base-color, hsl(0, 0%, 14%)) 14%, hsl(0, 0%, 14%)) );--surface-window: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 95%)) 14%, hsl(0, 0%, 95%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 14%)) 14%, hsl(0, 0%, 14%)) );--bg: var(--surface-bg);--bg-input: var(--surface-input);--bg-footer: var(--surface-footer);--bg-translucent: light-dark(#EDEDEDcc, #212121cc);--bg-buttonbar: var(--surface-buttonbar);--base-color-footer-buttonbar-light: var(--base-color-surface-bg-light);--footer-buttonbar-bg: light-dark( var(--base-color-footer-buttonbar-light, var(--bg-buttonbar)), var(--bg-buttonbar) );--btn-bg: var(--surface-button);--btn-bg2: light-dark(color-mix(in srgb, var(--btn-bg), black 6%), color-mix(in srgb, var(--btn-bg), white 10%));--btn-bg3: light-dark(color-mix(in srgb, var(--btn-bg), black 11%), color-mix(in srgb, var(--btn-bg), white 20%));--btn-border: var(--surface-button-border);--btn-hover-bg: light-dark(rgba(50, 50, 50, .12), rgba(255, 255, 255, .12));--btn-post-preview-action: var(--surface-button-preview-action);--border: var(--surface-border);--border-hr: var(--surface-border-hr);--border-hr-light: var(--surface-border-hr-light);--semantic-text: light-dark(hsl(0, 0%, 24%), hsl(0, 0%, 90%));--text: var(--semantic-text);--text-light: light-dark(hsl(0, 0%, 46%), hsl(0, 0%, 75%));--text-muted: light-dark(hsl(0, 0%, 60%), hsl(0, 0%, 55%));--text-red: light-dark(hsl(0, 99%, 45%), hsl(0, 99%, 69%));--text-r: light-dark(#e6e6e6, #3D3D3D);--semantic-link: light-dark(#1a0dab, #99c3ff);--link: var(--semantic-link);--link-visited: light-dark(#681da8, #c58af9);--dialog-bg: var(--surface-dialog);--dialog-bg2: light-dark(color-mix(in srgb, var(--dialog-bg), black 6%), color-mix(in srgb, var(--dialog-bg), white 10%));--dialog-bg3: light-dark(color-mix(in srgb, var(--dialog-bg), black 11%), color-mix(in srgb, var(--dialog-bg), white 16%));--dialog-bg-overlay: light-dark(rgba(0, 0, 0, .6), rgba(0, 0, 0, .8));--window: var(--surface-window);--svg: light-dark(hsl(0, 0%, 36%), hsl(0, 0%, 90%));--svg-light: var(--text-light);--shadow: light-dark(rgba(0, 0, 0, .1), rgba(255, 255, 255, .1));--hagaki: light-dark(hsl(0, 77%, 56%), hsl(5, 99%, 71%));--hashtag-text: light-dark(#106BC7, #65B1FC);--hashtag-bg: light-dark(#106BC71a, #65B1FC1a);--toggle-bg: var(--svg);--toggle-circle: var(--dialog-bg);--message-success-bg: hsl(200, 39%, 96%);--message-success-color: hsl(210, 60%, 40%);--message-success-border: hsl(210, 48%, 70%);--message-error-bg: hsl(351, 99%, 96%);--message-error-color: hsl(351, 99%, 32%);--message-error-border: hsl(351, 99%, 70%);--message-warning-bg: hsl(38, 100%, 95%);--message-warning-color: hsl(30, 90%, 35%);--message-warning-border: hsl(38, 90%, 65%);--message-flavor-bg: hsl(125, 39%, 94%);--message-flavor-color: hsl(123, 46%, 32%);--message-flavor-border: hsl(125, 39%, 70%);--message-tips-bg: hsl(270, 50%, 96%);--message-tips-color: hsl(270, 55%, 38%);--message-tips-border: hsl(270, 45%, 70%);font-family:system-ui,-apple-system,Segoe UI,Hiragino Sans,Hiragino Kaku Gothic ProN,Meiryo,sans-serif;font-weight:400;color-scheme:light dark;color:var(--text);background-color:var(--bg);font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}*{font-family:inherit;box-sizing:border-box}html,body,#app{height:var(--app-root-height);overflow-x:hidden;overflow-y:var(--app-root-overflow-y);overscroll-behavior-y:var(--app-overscroll-behavior)}#app{position:var(--app-body-position);top:var(--app-root-top);left:0;right:0;width:var(--app-body-width)}body{margin:0;position:var(--app-body-position);inset:var(--app-body-inset);width:var(--app-body-width);color:var(--text);background-color:var(--bg);overflow-wrap:anywhere;word-break:auto-phrase;line-break:strict}a{--link-hover-color: light-dark(color-mix(in srgb, var(--link), black 30%), color-mix(in srgb, var(--link), white 30%));font-weight:500;color:var(--link);-webkit-tap-highlight-color:transparent;text-decoration:none;border-radius:6px}a:active{opacity:1}h2,h3{color:var(--text-light)}.card{padding:2em}button,[role=button],select{display:inline-flex;align-items:center;justify-content:center;height:100%;padding:0;font-size:1rem;font-weight:500;line-height:normal;color:var(--text);background-color:inherit;border:none;cursor:pointer;text-decoration:none;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;--button-selected-bg: light-dark(color-mix(in srgb, var(--btn-bg), black 18%), color-mix(in srgb, var(--btn-bg), white 22%));--button-hover-bg: light-dark(color-mix(in srgb, var(--btn-bg), black 4%), color-mix(in srgb, var(--btn-bg), white 5%));--button-hover-color: light-dark(color-mix(in srgb, var(--text), black 40%), color-mix(in srgb, var(--text), white 50%));--button-selected-hover-bg: light-dark(color-mix(in srgb, var(--btn-bg), black 20%), color-mix(in srgb, var(--btn-bg), white 30%));--button-selected-hover-color: light-dark(color-mix(in srgb, var(--text), black 20%), color-mix(in srgb, var(--text), white 30%))}:is(button,[role=button],select):disabled{opacity:.3;cursor:not-allowed}:is(button,[role=button],select):disabled.loading{opacity:1}button>*{pointer-events:none}button:active:not(:disabled),[role=button]:active{scale:.98;transition:scale .1s cubic-bezier(0,1,.5,1)}@media(prefers-reduced-motion:reduce){button:active:not(:disabled),[role=button]:active{scale:1;transition:none}}span{-webkit-tap-highlight-color:transparent}select{border-radius:6px}.svg-icon{-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-size:contain;mask-size:contain;-webkit-mask-position:center;mask-position:center;background-color:var(--svg);display:inline-block;inline-size:var(--icon-size, 28px);block-size:var(--icon-size, 28px);--icon-hover-color: light-dark(color-mix(in srgb, var(--svg), black 40%), color-mix(in srgb, var(--svg), white 50%));--icon-selected-hover-color: light-dark(color-mix(in srgb, var(--svg), black 20%), color-mix(in srgb, var(--svg), white 30%))}.tooltip-content{--tooltip-padding: 12px;--tooltip-font-size: 1rem;--tooltip-line-height: normal;--tooltip-z-index: 100;--tooltip-max-width: none;background:var(--dialog-bg);color:var(--text);border:1px solid var(--border);border-radius:6px;padding:var(--tooltip-padding);font-size:var(--tooltip-font-size);line-height:var(--tooltip-line-height);z-index:var(--tooltip-z-index);max-width:var(--tooltip-max-width)}.post-preview-tooltip-content{--tooltip-z-index: 10000;z-index:10000!important}:root:is(.light,.dark) button.selected:where(:not(:disabled)),:root:is(.light,.dark) button:where([data-state=active]){background-color:var(--button-selected-bg)}@media(hover:hover)and (pointer:fine){a:hover{text-decoration:underline}:root:is(.light,.dark) button:where(:hover:not(:disabled)),:root:is(.light,.dark) [role=button]:where(:hover:not([aria-disabled=true])),:root:is(.light,.dark) select:where(:hover:not(:disabled)){background-color:var(--button-hover-bg);color:var(--button-hover-color)}:is(:root:is(.light,.dark) button:where(:hover:not(:disabled)),:root:is(.light,.dark) [role=button]:where(:hover:not([aria-disabled=true])),:root:is(.light,.dark) select:where(:hover:not(:disabled))) .svg-icon{background-color:var(--icon-hover-color)}:root:is(.light,.dark) button.selected:where(:hover:not(:disabled)),:root:is(.light,.dark) button:where([data-state=active]:hover:not(:disabled)){background-color:var(--button-selected-hover-bg);color:var(--button-selected-hover-color)}:is(:root:is(.light,.dark) button.selected:where(:hover:not(:disabled)),:root:is(.light,.dark) button:where([data-state=active]:hover:not(:disabled))) .svg-icon{background-color:var(--icon-selected-hover-color)}:root:is(.light,.dark) a:hover{color:var(--link-hover-color)}}.setting-section{display:flex;flex-direction:column}.setting-row{display:flex;flex-direction:row;align-items:stretch;justify-content:space-between;min-height:50px}.setting-label{font-size:1rem;font-weight:500;line-height:1.3;display:flex;align-items:center;justify-content:flex-start;white-space:pre-line}.setting-control{display:flex;align-items:stretch;justify-content:flex-end;height:auto;margin-block:auto}", wo = ".pswp{--pswp-bg: #000;--pswp-placeholder-bg: #222;--pswp-root-z-index: 100000;--pswp-preloader-color: rgba(79, 79, 79, .4);--pswp-preloader-color-secondary: rgba(255, 255, 255, .9);--pswp-icon-color: #fff;--pswp-icon-color-secondary: #4f4f4f;--pswp-icon-stroke-color: #4f4f4f;--pswp-icon-stroke-width: 2px;--pswp-error-text-color: var(--pswp-icon-color)}.pswp{position:fixed;top:0;left:0;width:100%;height:100%;z-index:var(--pswp-root-z-index);display:none;touch-action:none;outline:0;opacity:.003;contain:layout style size;-webkit-tap-highlight-color:rgba(0,0,0,0)}.pswp:focus{outline:0}.pswp *{box-sizing:border-box}.pswp img{max-width:none}.pswp--open{display:block}.pswp,.pswp__bg{transform:translateZ(0);will-change:opacity}.pswp__bg{opacity:.005;background:var(--pswp-bg)}.pswp,.pswp__scroll-wrap{overflow:hidden}.pswp__scroll-wrap,.pswp__bg,.pswp__container,.pswp__item,.pswp__content,.pswp__img,.pswp__zoom-wrap{position:absolute;top:0;left:0;width:100%;height:100%}.pswp__img,.pswp__zoom-wrap{width:auto;height:auto}.pswp--click-to-zoom.pswp--zoom-allowed .pswp__img{cursor:-webkit-zoom-in;cursor:-moz-zoom-in;cursor:zoom-in}.pswp--click-to-zoom.pswp--zoomed-in .pswp__img{cursor:move;cursor:-webkit-grab;cursor:-moz-grab;cursor:grab}.pswp--click-to-zoom.pswp--zoomed-in .pswp__img:active{cursor:-webkit-grabbing;cursor:-moz-grabbing;cursor:grabbing}.pswp--no-mouse-drag.pswp--zoomed-in .pswp__img,.pswp--no-mouse-drag.pswp--zoomed-in .pswp__img:active,.pswp__img{cursor:-webkit-zoom-out;cursor:-moz-zoom-out;cursor:zoom-out}.pswp__container,.pswp__img,.pswp__button,.pswp__counter{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.pswp__item{z-index:1;overflow:hidden}.pswp__hidden{display:none!important}.pswp__content{pointer-events:none}.pswp__content>*{pointer-events:auto}.pswp__error-msg-container{display:grid}.pswp__error-msg{margin:auto;font-size:1em;line-height:1;color:var(--pswp-error-text-color)}.pswp .pswp__hide-on-close{opacity:.005;will-change:opacity;transition:opacity var(--pswp-transition-duration) cubic-bezier(.4,0,.22,1);z-index:10;pointer-events:none}.pswp--ui-visible .pswp__hide-on-close{opacity:1;pointer-events:auto}.pswp__button{position:relative;display:block;width:50px;height:60px;padding:0;margin:0;overflow:hidden;cursor:pointer;background:none;border:0;box-shadow:none;opacity:.85;-webkit-appearance:none;-webkit-touch-callout:none}.pswp__button:hover,.pswp__button:active,.pswp__button:focus{transition:none;padding:0;background:none;border:0;box-shadow:none;opacity:1}.pswp__button:disabled{opacity:.3;cursor:auto}.pswp__icn{fill:var(--pswp-icon-color);color:var(--pswp-icon-color-secondary)}.pswp__icn{position:absolute;top:14px;left:9px;width:32px;height:32px;overflow:hidden;pointer-events:none}.pswp__icn-shadow{stroke:var(--pswp-icon-stroke-color);stroke-width:var(--pswp-icon-stroke-width);fill:none}.pswp__icn:focus{outline:0}div.pswp__img--placeholder,.pswp__img--with-bg{background:var(--pswp-placeholder-bg)}.pswp__top-bar{position:absolute;left:0;top:0;width:100%;height:60px;display:flex;flex-direction:row;justify-content:flex-end;z-index:10;pointer-events:none!important}.pswp__top-bar>*{pointer-events:auto;will-change:opacity}.pswp__button--close{margin-right:6px}.pswp__button--arrow{position:absolute;width:75px;height:100px;top:50%;margin-top:-50px}.pswp__button--arrow:disabled{display:none;cursor:default}.pswp__button--arrow .pswp__icn{top:50%;margin-top:-30px;width:60px;height:60px;background:none;border-radius:0}.pswp--one-slide .pswp__button--arrow{display:none}.pswp--touch .pswp__button--arrow{visibility:hidden}.pswp--has_mouse .pswp__button--arrow{visibility:visible}.pswp__button--arrow--prev{right:auto;left:0}.pswp__button--arrow--next{right:0}.pswp__button--arrow--next .pswp__icn{left:auto;right:14px;transform:scaleX(-1)}.pswp__button--zoom{display:none}.pswp--zoom-allowed .pswp__button--zoom{display:block}.pswp--zoomed-in .pswp__zoom-icn-bar-v{display:none}.pswp__preloader{position:relative;overflow:hidden;width:50px;height:60px;margin-right:auto}.pswp__preloader .pswp__icn{opacity:0;transition:opacity .2s linear;animation:pswp-clockwise .6s linear infinite}.pswp__preloader--active .pswp__icn{opacity:.85}@keyframes pswp-clockwise{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.pswp__counter{height:30px;margin-top:15px;margin-inline-start:20px;font-size:14px;line-height:30px;color:var(--pswp-icon-color);text-shadow:1px 1px 3px var(--pswp-icon-color-secondary);opacity:.85}.pswp--one-slide .pswp__counter{display:none}";
function yo(e) {
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
const Eo = "--ehagaki-icon-", ko = /--ehagaki-icon-([0-9a-f]+)/g;
function xo(e) {
  if (e.length === 0 || e.length % 2 !== 0) return null;
  const t = Array.from(
    { length: e.length / 2 },
    (r, n) => String.fromCharCode(
      Number.parseInt(e.slice(n * 2, n * 2 + 2), 16)
    )
  ).join("");
  return /^[A-Za-z0-9._-]+\.svg$/.test(t) ? t : null;
}
function Bt(e, t, r) {
  const n = /* @__PURE__ */ new Set();
  for (const o of e.querySelectorAll("style"))
    for (const i of o.textContent?.matchAll(ko) ?? [])
      n.add(i[0]);
  for (const o of n) {
    const i = xo(o.slice(Eo.length));
    i && t.style.setProperty(
      o,
      `url("${new URL(`icons/${i}`, r).href}")`
    );
  }
}
let Ae = null;
function B(e, t) {
  const r = new Error(t);
  return r.name = e, r;
}
function $o(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function So(e) {
  if (!$o(e))
    throw B("initialization_failed", "Invalid settings payload.");
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
      throw B("initialization_failed", "Invalid settings payload.");
    if (o in t) {
      const s = t[o];
      if (typeof i != "string" || !s.has(i))
        throw B("initialization_failed", "Invalid settings payload.");
    } else {
      if (r.has(o) && typeof i != "boolean")
        throw B("initialization_failed", "Invalid settings payload.");
      if (o === "uploadEndpoint" && typeof i != "string")
        throw B("initialization_failed", "Invalid settings payload.");
    }
  }
  return e;
}
function Ao(e) {
  return e.replaceAll(/:root:is\(\s*\.light\s*,\s*\.dark\s*\)/g, ":host(:is(.light, .dark))").replaceAll(":root", ":host").replace(`html,
body,
#app`, `:host,
.ehagaki-web-component-shell`).replace("#app {", ".ehagaki-web-component-shell {").replace("body {", ".ehagaki-web-component-shell {");
}
function To() {
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
class Co extends HTMLElement {
  static get observedAttributes() {
    return ["asset-base", "auto-login"];
  }
  #e = null;
  #t = null;
  #o = null;
  #u = null;
  #r = null;
  #i = this.createReadyPromise();
  #n = "pending";
  #s = !1;
  #c = null;
  #a = Promise.resolve();
  #l = 0;
  #f = null;
  get editorIsEmpty() {
    return this.#c;
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
    if (this.onConnectionAttempt(), this.#c = null, this.#s = !1, this.#o) return;
    const t = this.getConnectionError();
    if (t) {
      const r = B(t.code, t.message);
      this.fail("initialization_failed", r.message, r);
      return;
    }
    if (Ae && Ae !== this) {
      const r = B(
        "multiple_instances_unsupported",
        "Only one ehagaki-composer can be connected in a document."
      );
      this.fail("multiple_instances_unsupported", r.message, r);
      return;
    }
    this.#n !== "pending" && (this.#i = this.createReadyPromise(), this.#n = "pending"), Ae = this, this.#o = this.mountApp();
  }
  disconnectedCallback() {
    this.#l += 1, this.#c = null, this.#s = !1, this.onDisconnected(), this.#f?.disconnect(), this.#f = null, Ae === this && (Ae = null), this.#t && (Lr(this.#t), this.#t = null), this.#e = null, this.#o = null, this.#n === "pending" && (this.#n = "rejected", this.#r?.(B("disconnected", "Component was disconnected before it became ready.")));
  }
  whenReady() {
    return this.#i;
  }
  setContext(t) {
    return this.enqueue(async () => {
      await this.requireApp().setEmbedContext(t);
    });
  }
  setSettings(t) {
    return this.enqueue(async () => this.requireApp().setEmbedSettings(So(t)));
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
  dispatchSafeEvent(t, r) {
    return this.dispatchEvent(new CustomEvent(t, {
      bubbles: !0,
      composed: !0,
      detail: r
    }));
  }
  createReadyPromise() {
    return new Promise((t, r) => {
      this.#u = t, this.#r = r;
    });
  }
  async mountApp() {
    const t = ++this.#l;
    try {
      const r = this.shadowRoot ?? this.attachShadow({ mode: "open" });
      r.replaceChildren();
      const n = document.createElement("style");
      n.textContent = `${Ao(mo)}
${wo}
${To()}`;
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
      this.#f = new MutationObserver(() => {
        Bt(r, o, l);
      }), this.#f.observe(r, {
        childList: !0,
        subtree: !0
      }), _o({
        storage: go(window.localStorage),
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
          notificationPort: yo(this),
          onInitialized: () => {
            this.#d(t);
          },
          ...this.getAdditionalMountProps(t),
          onEditorEmptyChange: (c) => {
            this.#p(t, c);
          }
        }
      }), Bt(r, o, l), this.#e = this.#t, !this.isConnected || t !== this.#l)) return;
    } catch {
      if (!this.isConnected || t !== this.#l) return;
      this.fail("initialization_failed", "eHagaki Composer could not be initialized.");
    }
  }
  requireApp() {
    if (!this.#e)
      throw B("initialization_failed", "eHagaki Composer is not ready.");
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
    !this.isConnected || t !== this.#l || this.#n !== "pending" || this.fail("initialization_failed", "eHagaki Composer could not be initialized.");
  }
  enqueue(t) {
    const r = this.#a.then(async () => (await this.whenReady(), t()));
    return this.#a = r.then(() => {
    }, () => {
    }), r;
  }
  #d(t) {
    !this.isConnected || t !== this.#l || (this.#s = !0, this.#h(t));
  }
  #p(t, r) {
    if (!(!this.isConnected || t !== this.#l || typeof r != "boolean")) {
      if (this.#c === r) {
        this.#h(t);
        return;
      }
      this.#c = r, this.dispatchSafeEvent("ehagaki-editor-empty-change", { isEmpty: r }), this.#h(t);
    }
  }
  #h(t) {
    !this.isConnected || t !== this.#l || !this.#s || this.#c === null || this.#n !== "pending" || (this.#n = "resolved", this.#u?.(), this.dispatchSafeEvent("ehagaki-ready", { apiVersion: 1 }));
  }
  fail(t, r, n = B(t, r)) {
    this.#n = "rejected", this.#r?.(n), this.dispatchSafeEvent("ehagaki-initialization-error", { code: t, message: r });
  }
}
function zr(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function Ft(e) {
  return typeof e == "number" && Number.isSafeInteger(e) && e > 0;
}
const lt = {
  ctrl: 1,
  meta: 2,
  alt: 4,
  shift: 8
}, Mo = /* @__PURE__ */ new Set([
  "ctrl",
  "meta",
  "ctrlOrMeta",
  "alt",
  "shift"
]);
function Oo(e) {
  let t = 0;
  const r = e.includes("ctrlOrMeta");
  for (const n of e)
    n !== "ctrlOrMeta" && (t |= lt[n]);
  return r ? [t | lt.ctrl, t | lt.meta] : [t];
}
function Ro(e) {
  if (e === void 0) return;
  if (!Array.isArray(e))
    throw new TypeError("submitShortcuts must be an array when provided.");
  const t = /* @__PURE__ */ new Set(), r = [];
  for (const n of e) {
    if (!zr(n))
      throw new TypeError("Each submitShortcuts item must be an object.");
    if (typeof n.id != "string" || n.id.trim() === "")
      throw new TypeError("Each submitShortcuts item requires a non-blank string id.");
    if (!Array.isArray(n.modifiers) || n.modifiers.length === 0)
      throw new TypeError("Each submitShortcuts item requires a non-empty modifiers array.");
    const o = [], i = /* @__PURE__ */ new Set();
    for (const s of n.modifiers) {
      if (typeof s != "string" || !Mo.has(s))
        throw new TypeError("submitShortcuts contains an unknown modifier.");
      if (i.has(s))
        throw new TypeError("submitShortcuts cannot contain duplicate modifiers.");
      i.add(s), o.push(s);
    }
    if (o.includes("ctrlOrMeta") && (o.includes("ctrl") || o.includes("meta")))
      throw new TypeError("ctrlOrMeta cannot be combined with ctrl or meta.");
    for (const s of Oo(o)) {
      if (t.has(s))
        throw new TypeError("submitShortcuts cannot contain overlapping modifier states.");
      t.add(s);
    }
    r.push(Object.freeze({
      id: n.id,
      modifiers: Object.freeze([...o])
    }));
  }
  return Object.freeze(r);
}
function Io(e) {
  if (!zr(e) || typeof e.submit != "function")
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
  const t = e.editorMinLines !== void 0, r = e.editorMaxLines !== void 0;
  if (t !== r)
    throw new TypeError("editorMinLines and editorMaxLines must be provided together.");
  if (t && (!Ft(e.editorMinLines) || !Ft(e.editorMaxLines) || e.editorMinLines > e.editorMaxLines))
    throw new TypeError(
      "editorMinLines and editorMaxLines must be positive safe integers with editorMinLines <= editorMaxLines."
    );
  const n = e.submit, o = e.uploadMedia, i = e.editorMinLines, s = e.editorMaxLines, l = Ro(e.submitShortcuts);
  return {
    submit: n,
    ...o ? { uploadMedia: o } : {},
    ...e.contentWarningEnabled !== void 0 ? { contentWarningEnabled: e.contentWarningEnabled } : {},
    ...e.hashtagPinEnabled !== void 0 ? { hashtagPinEnabled: e.hashtagPinEnabled } : {},
    ...e.keyboardButtonBarEnabled !== void 0 ? { keyboardButtonBarEnabled: e.keyboardButtonBarEnabled } : {},
    ...e.editorSubmitButtonEnabled !== void 0 ? { editorSubmitButtonEnabled: e.editorSubmitButtonEnabled } : {},
    ...e.enterKeyBehavior !== void 0 ? { enterKeyBehavior: e.enterKeyBehavior } : {},
    ...l !== void 0 ? { submitShortcuts: l } : {},
    ...t ? {
      editorMinLines: i,
      editorMaxLines: s
    } : {}
  };
}
function Lo(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function No(e) {
  if (typeof e != "string") return !1;
  try {
    const t = new URL(e);
    return t.protocol === "http:" || t.protocol === "https:";
  } catch {
    return !1;
  }
}
function Po(e) {
  if (!Array.isArray(e))
    throw new TypeError("Custom emoji catalog must be an array.");
  const t = /* @__PURE__ */ new Set(), r = [];
  for (const n of e) {
    if (!Lo(n) || typeof n.shortcode != "string" || !No(n.url))
      throw new TypeError("Custom emoji catalog contains an invalid item.");
    const o = n.shortcode.replace(/^:+|:+$/g, "").trim();
    if (!/^[\p{L}\p{N}_+-]{1,64}$/u.test(o))
      throw new TypeError("Custom emoji catalog contains an invalid shortcode.");
    const i = typeof n.setAddress == "string" && n.setAddress.trim() ? n.setAddress.trim() : null, s = `${o.toLowerCase()}\0${n.url}\0${i ?? ""}`;
    t.has(s) || (t.add(s), r.push({ shortcode: o, url: n.url, ...i ? { setAddress: i } : {} }));
  }
  return r;
}
class zo extends Co {
  #e = null;
  #t = [];
  #o = null;
  #u = !1;
  #r = null;
  #i = 0;
  /**
   * The current Host-owned Lite intrinsic height, or null when this mount
   * does not use editor auto-grow or has not measured yet.
   */
  get preferredHeight() {
    return this.#r;
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
    this.#e = Io(t);
  }
  setCustomEmojis(t) {
    if (!this.#e)
      return Promise.reject(new DOMException(
        "Custom emoji catalogs are available only in Host-owned mode.",
        "InvalidStateError"
      ));
    const r = Po(t);
    return this.#t = r, this.enqueue(async () => {
      await this.requireApp().setHostCustomEmojis(r.map((o) => ({ ...o })));
    });
  }
  loadApp() {
    return import("./HostOwnedComposerLiteApp-BHzf9-vD.js").then((t) => t.H);
  }
  onConnectionAttempt() {
    this.#u = !0, this.#i += 1, this.#r = null;
  }
  getConnectionError() {
    return this.#e ? null : {
      code: "initialization_failed",
      message: "Host-owned Composer Lite requires configureHostOwned() before connection."
    };
  }
  onDisconnected() {
    this.#i += 1, this.#r = null, this.#o?.abort(), this.#o = null;
  }
  isAutoLoginNip07Enabled() {
    return !1;
  }
  getAdditionalMountProps() {
    if (!this.#e)
      throw new Error("Host-owned Composer Lite configuration is missing.");
    this.#o = new AbortController();
    const t = this.#i;
    return {
      hostOwnedConfig: {
        ...this.#e,
        customEmojis: this.#t.map((r) => ({ ...r })),
        signal: this.#o.signal
      },
      onPreferredHeightChange: (r) => {
        if (!this.isConnected || t !== this.#i || !Number.isFinite(r) || r <= 0)
          return;
        const n = Math.ceil(r);
        this.#r !== n && (this.#r = n, this.dispatchSafeEvent("ehagaki-preferred-height-change", { height: n }));
      }
    };
  }
}
jr("host-owned-lite", zo);
export {
  g as $,
  ii as A,
  bn as B,
  H as C,
  He as D,
  Ie as E,
  Fo as F,
  Qe as G,
  Uo as H,
  pi as I,
  Br as J,
  Go as K,
  je as L,
  Yo as M,
  Jo as N,
  Ho as O,
  Xo as P,
  F as Q,
  R,
  q as S,
  Zo as T,
  zn as U,
  $e as V,
  Yt as W,
  ze as X,
  Gt as Y,
  J as Z,
  ki as _,
  Y as a,
  wn as a$,
  ne as a0,
  Vn as a1,
  gr as a2,
  ni as a3,
  oi as a4,
  tt as a5,
  ke as a6,
  Wt as a7,
  Ko as a8,
  Oi as a9,
  Do as aA,
  Yr as aB,
  me as aC,
  Wo as aD,
  ei as aE,
  Qo as aF,
  Te as aG,
  ti as aH,
  ri as aI,
  Jr as aJ,
  wi as aK,
  fo as aL,
  Q as aM,
  di as aN,
  he as aO,
  Re as aP,
  Sn as aQ,
  Ii as aR,
  fi as aS,
  ci as aT,
  ui as aU,
  yi as aV,
  Si as aW,
  mn as aX,
  Di as aY,
  vi as aZ,
  no as a_,
  Ei as aa,
  mr as ab,
  Ai as ac,
  xi as ad,
  Xr as ae,
  Zr as af,
  si as ag,
  gi as ah,
  Mn as ai,
  Bo as aj,
  Gr as ak,
  hn as al,
  Vo as am,
  Fr as an,
  Ti as ao,
  Ni as ap,
  Pi as aq,
  Rr as ar,
  Mi as as,
  k as at,
  Ci as au,
  S as av,
  Rt as aw,
  ce as ax,
  kt as ay,
  oe as az,
  ee as b,
  nr as b0,
  Fi as b1,
  Hi as b2,
  zi as b3,
  bi as b4,
  ai as b5,
  hi as b6,
  Tt as b7,
  Lr as b8,
  Dn as b9,
  _i as ba,
  Ri as bb,
  ji as bc,
  Bi as bd,
  gn as be,
  qi as bf,
  Li as bg,
  jo as bh,
  Ct as bi,
  zo as bj,
  $i as c,
  Ye as d,
  D as e,
  Z as f,
  Vt as g,
  se as h,
  Dr as i,
  v as j,
  Kn as k,
  mi as l,
  Nn as m,
  Kr as n,
  qr as o,
  Ve as p,
  ue as q,
  Ur as r,
  vn as s,
  vr as t,
  Yn as u,
  y as v,
  _ as w,
  Fn as x,
  mt as y,
  li as z
};
