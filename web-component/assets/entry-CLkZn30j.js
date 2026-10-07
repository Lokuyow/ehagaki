var bl = Array.isArray, ml = Array.prototype.indexOf, Ht = Array.prototype.includes, _l = Array.from, Un = Object.keys, Mn = Object.defineProperty, Pt = Object.getOwnPropertyDescriptor, El = Object.getOwnPropertyDescriptors, xl = Object.prototype, kl = Array.prototype, Mo = Object.getPrototypeOf, Ki = Object.isExtensible;
function gg(e) {
  return typeof e == "function";
}
const Al = () => {
};
function Il(e) {
  for (var t = 0; t < e.length; t++)
    e[t]();
}
function zo() {
  var e, t, n = new Promise((r, i) => {
    e = r, t = i;
  });
  return { promise: n, resolve: e, reject: t };
}
const ie = 2, Dt = 4, fn = 8, Yr = 1 << 24, Ie = 16, Be = 32, We = 64, Tr = 128, be = 512, Q = 1024, re = 2048, Ne = 4096, me = 8192, Pe = 16384, pt = 32768, Zi = 1 << 25, an = 65536, zn = 1 << 17, Rl = 1 << 18, Rt = 1 << 19, Ho = 1 << 20, yg = 1 << 25, At = 65536, Hn = 1 << 21, Bt = 1 << 22, st = 1 << 23, _t = Symbol("$state"), Sl = Symbol("legacy props"), wg = Symbol(""), $l = Symbol("attributes"), Cl = Symbol("class"), Tl = Symbol("style"), Lr = Symbol("text"), Rn = Symbol("form reset"), Jn = new class extends Error {
  name = "StaleReactionError";
  message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), bg = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml")
), mg = 1, dn = 3, hn = 8;
function Ll(e) {
  throw new Error("https://svelte.dev/e/lifecycle_outside_component");
}
function Ol() {
  throw new Error("https://svelte.dev/e/async_derived_orphan");
}
function _g(e, t, n) {
  throw new Error("https://svelte.dev/e/each_key_duplicate");
}
function Pl(e) {
  throw new Error("https://svelte.dev/e/effect_in_teardown");
}
function Bl() {
  throw new Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Nl(e) {
  throw new Error("https://svelte.dev/e/effect_orphan");
}
function Ul() {
  throw new Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Ml() {
  throw new Error("https://svelte.dev/e/hydration_failed");
}
function Eg(e) {
  throw new Error("https://svelte.dev/e/props_invalid_value");
}
function zl() {
  throw new Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Hl() {
  throw new Error("https://svelte.dev/e/state_prototype_fixed");
}
function Dl() {
  throw new Error("https://svelte.dev/e/state_unsafe_mutation");
}
function jl() {
  throw new Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
const xg = 1, kg = 2, Ag = 4, Ig = 8, Rg = 16, Sg = 1, $g = 4, Cg = 8, Tg = 16, Vl = 1, ql = 2, Do = "[", jo = "[!", Wi = "[?", Vo = "]", jt = {}, te = Symbol(), Fl = "http://www.w3.org/1999/xhtml", Lg = "http://www.w3.org/2000/svg", Og = "http://www.w3.org/1998/Math/MathML", Pg = "@attach";
function Kl() {
  console.warn("https://svelte.dev/e/derived_inert");
}
function Qn(e) {
  console.warn("https://svelte.dev/e/hydration_mismatch");
}
function Bg() {
  console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function Zl() {
  console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
let J = !1;
function mn(e) {
  J = e;
}
let M;
function Ce(e) {
  if (e === null)
    throw Qn(), jt;
  return M = e;
}
function Xr() {
  return Ce(/* @__PURE__ */ Je(M));
}
function Ng(e) {
  if (J) {
    if (/* @__PURE__ */ Je(M) !== null)
      throw Qn(), jt;
    M = e;
  }
}
function Wl(e = 1) {
  if (J) {
    for (var t = e, n = M; t--; )
      n = /** @type {TemplateNode} */
      /* @__PURE__ */ Je(n);
    M = n;
  }
}
function Gl(e = !0) {
  for (var t = 0, n = M; ; ) {
    if (n.nodeType === hn) {
      var r = (
        /** @type {Comment} */
        n.data
      );
      if (r === Vo) {
        if (t === 0) return n;
        t -= 1;
      } else (r === Do || r === jo || // "[1", "[2", etc. for if blocks
      r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
    }
    var i = (
      /** @type {TemplateNode} */
      /* @__PURE__ */ Je(n)
    );
    e && n.remove(), n = i;
  }
}
function Ug(e) {
  if (!e || e.nodeType !== hn)
    throw Qn(), jt;
  return (
    /** @type {Comment} */
    e.data
  );
}
function qo(e) {
  return e === this.v;
}
function Yl(e, t) {
  return e != e ? t == t : e !== t || e !== null && typeof e == "object" || typeof e == "function";
}
function Fo(e) {
  return !Yl(e, this.v);
}
let ce = null;
function Vt(e) {
  ce = e;
}
function Mg(e) {
  return (
    /** @type {T} */
    er().get(e)
  );
}
function zg(e, t) {
  return er().set(e, t), t;
}
function Hg(e) {
  return er().has(e);
}
function Dg() {
  return er();
}
function Xl(e, t = !1, n) {
  ce = {
    p: ce,
    i: !1,
    c: null,
    e: null,
    s: e,
    x: null,
    r: (
      /** @type {Effect} */
      O
    ),
    l: null
  };
}
function Jl(e) {
  var t = (
    /** @type {ComponentContext} */
    ce
  ), n = t.e;
  if (n !== null) {
    t.e = null;
    for (var r of n)
      ds(r);
  }
  return e !== void 0 && (t.x = e), t.i = !0, ce = t.p, e ?? /** @type {T} */
  {};
}
function Ko() {
  return !0;
}
function er(e) {
  return ce === null && Ll(), ce.c ??= new Map(Ql(ce) || void 0);
}
function Ql(e) {
  let t = e.p;
  for (; t !== null; ) {
    const n = t.c;
    if (n !== null)
      return n;
    t = t.p;
  }
  return null;
}
let wt = [];
function Zo() {
  var e = wt;
  wt = [], Il(e);
}
function at(e) {
  if (wt.length === 0 && !nn) {
    var t = wt;
    queueMicrotask(() => {
      t === wt && Zo();
    });
  }
  wt.push(e);
}
function ec() {
  for (; wt.length > 0; )
    Zo();
}
function Wo(e) {
  var t = O;
  if (t === null)
    return P.f |= st, e;
  if ((t.f & pt) === 0 && (t.f & Dt) === 0)
    throw e;
  it(e, t);
}
function it(e, t) {
  for (; t !== null; ) {
    if ((t.f & Tr) !== 0) {
      if ((t.f & pt) === 0)
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
const tc = -7169;
function W(e, t) {
  e.f = e.f & tc | t;
}
function Jr(e) {
  (e.f & be) !== 0 || e.deps === null ? W(e, Q) : W(e, Ne);
}
function Go(e) {
  if (e !== null)
    for (const t of e)
      (t.f & ie) === 0 || (t.f & At) === 0 || (t.f ^= At, Go(
        /** @type {Derived} */
        t.deps
      ));
}
function Yo(e, t, n) {
  (e.f & re) !== 0 ? t.add(e) : (e.f & Ne) !== 0 && n.add(e), Go(e.deps), W(e, Q);
}
let pr = null, $t = null, U = null, Or = null, Re = null, Pr = null, nn = !1, gr = !1, Lt = null, Sn = null;
var Gi = 0;
let nc = 1;
class Ge {
  id = nc++;
  /** True as soon as `#process` was called */
  #e = !1;
  linked = !0;
  /** @type {Batch | null} */
  #n = null;
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
  #t = /* @__PURE__ */ new Set();
  /**
   * If a fork is discarded, we need to destroy any effects that are no longer needed
   * @type {Set<(batch: Batch) => void>}
   */
  #l = /* @__PURE__ */ new Set();
  /**
   * Callbacks that should run only when a fork is committed.
   * @type {Set<(batch: Batch) => void>}
   */
  #c = /* @__PURE__ */ new Set();
  /**
   * The number of async effects that are currently in flight
   */
  #i = 0;
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
  #o = null;
  /**
   * The root effects that need to be flushed
   * @type {Effect[]}
   */
  #a = [];
  /**
   * Effects created while this batch was active.
   * @type {Effect[]}
   */
  #d = [];
  /**
   * Deferred effects (which run after async work has completed) that are DIRTY
   * @type {Set<Effect>}
   */
  #f = /* @__PURE__ */ new Set();
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
  #h = /* @__PURE__ */ new Map();
  /**
   * Inverse of #skipped_branches which we need to tell prior batches to unskip them when committing
   * @type {Set<Effect>}
   */
  #p = /* @__PURE__ */ new Set();
  is_fork = !1;
  #w = !1;
  #_() {
    if (this.is_fork) return !0;
    for (const r of this.#s.keys()) {
      for (var t = r, n = !1; t.parent !== null; ) {
        if (this.#h.has(t)) {
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
    this.#h.has(t) || this.#h.set(t, { d: [], m: [] }), this.#p.delete(t);
  }
  /**
   * Remove an effect from the #skipped_branches map and reschedule
   * any tracked dirty/maybe_dirty child effects
   * @param {Effect} effect
   * @param {(e: Effect) => void} callback
   */
  unskip_effect(t, n = (r) => this.schedule(r)) {
    var r = this.#h.get(t);
    if (r) {
      this.#h.delete(t);
      for (var i of r.d)
        W(i, re), n(i);
      for (i of r.m)
        W(i, Ne), n(i);
    }
    this.#p.add(t);
  }
  #y() {
    if (this.#e = !0, Gi++ > 1e3 && (this.#m(), rc()), !this.#_()) {
      for (const a of this.#f)
        this.#u.delete(a), W(a, re), this.schedule(a);
      for (const a of this.#u)
        W(a, Ne), this.schedule(a);
    }
    const t = this.#a;
    this.#a = [], this.apply();
    var n = Lt = [], r = [], i = Sn = [];
    for (const a of t)
      try {
        this.#E(a, n, r);
      } catch (u) {
        throw es(a), u;
      }
    if (U = null, i.length > 0) {
      var o = Ge.ensure();
      for (const a of i)
        o.schedule(a);
    }
    if (Lt = null, Sn = null, this.#_()) {
      this.#g(r), this.#g(n);
      for (const [a, u] of this.#h)
        Qo(a, u);
      i.length > 0 && /** @type {unknown} */
      U.#y();
      return;
    }
    const s = this.#x();
    if (s) {
      s.#v(this);
      return;
    }
    this.#f.clear(), this.#u.clear();
    for (const a of this.#t) a(this);
    this.#t.clear(), Or = this, Yi(r), Yi(n), Or = null, this.#o?.resolve();
    var l = (
      /** @type {Batch | null} */
      /** @type {unknown} */
      U
    );
    if (this.linked && this.#i === 0 && this.#m(), this.#a.length > 0) {
      l === null && (l = this, this.#b());
      const a = l;
      a.#a.push(...this.#a.filter((u) => !a.#a.includes(u)));
    }
    l !== null && l.#y();
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
      var o = i.f, s = (o & (Be | We)) !== 0, l = s && (o & Q) !== 0, a = l || (o & me) !== 0 || this.#h.has(i);
      if (!a && i.fn !== null) {
        s ? i.f ^= Q : (o & Dt) !== 0 ? n.push(i) : gn(i) && ((o & Ie) !== 0 && this.#u.add(i), Ft(i));
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
    for (var t = this.#n; t !== null; ) {
      if (!t.is_fork) {
        for (const [n, [, r]] of this.current)
          if (t.current.has(n) && !r)
            return t;
      }
      t = t.#n;
    }
    return null;
  }
  /**
   * @param {Batch} batch
   */
  #v(t) {
    for (const [r, i] of t.current)
      !this.previous.has(r) && t.previous.has(r) && this.previous.set(r, t.previous.get(r)), this.current.set(r, i);
    for (const [r, i] of t.async_deriveds) {
      const o = this.async_deriveds.get(r);
      o && i.promise.then(o.resolve);
    }
    const n = (r) => {
      var i = r.reactions;
      if (i !== null)
        for (const l of i) {
          var o = l.f;
          if ((o & ie) !== 0)
            n(
              /** @type {Derived} */
              l
            );
          else {
            var s = (
              /** @type {Effect} */
              l
            );
            o & (Bt | Ie) && !this.async_deriveds.has(s) && (this.#u.delete(s), W(s, re), this.schedule(s));
          }
        }
    };
    for (const r of this.current.keys())
      n(r);
    this.oncommit(() => t.discard()), t.#m(), U = this, this.#y();
  }
  /**
   * @param {Effect[]} effects
   */
  #g(t) {
    for (var n = 0; n < t.length; n += 1)
      Yo(t[n], this.#f, this.#u);
  }
  /**
   * Associate a change to a given source with the current
   * batch, noting its previous and current values
   * @param {Value} source
   * @param {any} value
   * @param {boolean} [is_derived]
   */
  capture(t, n, r = !1) {
    t.v !== te && !this.previous.has(t) && this.previous.set(t, t.v), (t.f & st) === 0 && (this.current.set(t, [n, r]), Re?.set(t, n)), this.is_fork || (t.v = n);
  }
  activate() {
    U = this;
  }
  deactivate() {
    U = null, Re = null;
  }
  flush() {
    try {
      gr = !0, U = this, this.#y();
    } finally {
      Gi = 0, Pr = null, Lt = null, Sn = null, gr = !1, U = null, Re = null, Et.clear();
    }
  }
  discard() {
    for (const t of this.#l) t(this);
    this.#l.clear(), this.#c.clear(), this.#m();
  }
  /**
   * @param {Effect} effect
   */
  register_created_effect(t) {
    this.#d.push(t);
  }
  #k() {
    this.#m();
    for (let f = pr; f !== null; f = f.#r) {
      var t = f.id < this.id, n = [];
      for (const [h, [w, y]] of this.current) {
        if (f.current.has(h)) {
          var r = (
            /** @type {[any, boolean]} */
            f.current.get(h)[0]
          );
          if (t && w !== r)
            f.current.set(h, [w, y]);
          else
            continue;
        }
        n.push(h);
      }
      if (t)
        for (const [h, w] of this.async_deriveds) {
          const y = f.async_deriveds.get(h);
          y && w.promise.then(y.resolve);
        }
      if (f.#e) {
        var i = [...f.current.keys()].filter((h) => !this.current.has(h));
        if (i.length === 0)
          t && f.discard();
        else if (n.length > 0) {
          if (t)
            for (const h of this.#p)
              f.unskip_effect(h, (w) => {
                (w.f & (Ie | Bt)) !== 0 ? f.schedule(w) : f.#g([w]);
              });
          f.activate();
          var o = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map();
          for (var l of n)
            Jo(l, i, o, s);
          s = /* @__PURE__ */ new Map();
          var a = [...f.current.keys()].filter(
            (h) => this.current.has(h) ? (
              /** @type {[any, boolean]} */
              this.current.get(h)[0] !== h.v
            ) : !0
          );
          if (a.length > 0)
            for (const h of this.#d)
              (h.f & (Pe | me | zn)) === 0 && Qr(h, a, s) && ((h.f & (Bt | Ie)) !== 0 ? (W(h, re), f.schedule(h)) : f.#f.add(h));
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
    if (this.#i += 1, t) {
      let r = this.#s.get(n) ?? 0;
      this.#s.set(n, r + 1);
    }
  }
  /**
   * @param {boolean} blocking
   * @param {Effect} effect
   */
  decrement(t, n) {
    if (this.#i -= 1, t) {
      let r = this.#s.get(n) ?? 0;
      r === 1 ? this.#s.delete(n) : this.#s.set(n, r - 1);
    }
    this.#w || (this.#w = !0, at(() => {
      this.#w = !1, this.linked && this.flush();
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
      this.#u.add(r);
    t.clear(), n.clear();
  }
  /** @param {(batch: Batch) => void} fn */
  oncommit(t) {
    this.#t.add(t);
  }
  /** @param {(batch: Batch) => void} fn */
  ondiscard(t) {
    this.#l.add(t);
  }
  /** @param {(batch: Batch) => void} fn */
  on_fork_commit(t) {
    this.#c.add(t);
  }
  run_fork_commit_callbacks() {
    for (const t of this.#c) t(this);
    this.#c.clear();
  }
  settled() {
    return (this.#o ??= zo()).promise;
  }
  static ensure() {
    if (U === null) {
      const t = U = new Ge();
      t.#b(), !gr && !nn && at(() => {
        t.#e || t.flush();
      });
    }
    return U;
  }
  apply() {
    {
      Re = null;
      return;
    }
  }
  /**
   *
   * @param {Effect} effect
   */
  schedule(t) {
    if (Pr = t, t.b?.is_pending && (t.f & (Dt | fn | Yr)) !== 0 && (t.f & pt) === 0) {
      t.b.defer_effect(t);
      return;
    }
    for (var n = t; n.parent !== null; ) {
      n = n.parent;
      var r = n.f;
      if (Lt !== null && n === O && (P === null || (P.f & ie) === 0))
        return;
      if ((r & (We | Be)) !== 0) {
        if ((r & Q) === 0)
          return;
        n.f ^= Q;
      }
    }
    this.#a.push(n);
  }
  #b() {
    $t === null ? pr = $t = this : ($t.#r = this, this.#n = $t), $t = this;
  }
  #m() {
    var t = this.#n, n = this.#r;
    t === null ? pr = n : t.#r = n, n === null ? $t = t : n.#n = t, this.linked = !1;
  }
}
function Xo(e) {
  var t = nn;
  nn = !0;
  try {
    for (var n; ; ) {
      if (ec(), U === null)
        return (
          /** @type {T} */
          n
        );
      U.flush();
    }
  } finally {
    nn = t;
  }
}
function rc() {
  try {
    Ul();
  } catch (e) {
    it(e, Pr);
  }
}
let je = null;
function Yi(e) {
  var t = e.length;
  if (t !== 0) {
    for (var n = 0; n < t; ) {
      var r = e[n++];
      if ((r.f & (Pe | me)) === 0 && gn(r) && (je = /* @__PURE__ */ new Set(), Ft(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && gs(r), je?.size > 0)) {
        Et.clear();
        for (const i of je) {
          if ((i.f & (Pe | me)) !== 0) continue;
          const o = [i];
          let s = i.parent;
          for (; s !== null; )
            je.has(s) && (je.delete(s), o.push(s)), s = s.parent;
          for (let l = o.length - 1; l >= 0; l--) {
            const a = o[l];
            (a.f & (Pe | me)) === 0 && Ft(a);
          }
        }
        je.clear();
      }
    }
    je = null;
  }
}
function Jo(e, t, n, r) {
  if (!n.has(e) && (n.add(e), e.reactions !== null))
    for (const i of e.reactions) {
      const o = i.f;
      (o & ie) !== 0 ? Jo(
        /** @type {Derived} */
        i,
        t,
        n,
        r
      ) : (o & (Bt | Ie)) !== 0 && (o & re) === 0 && Qr(i, t, r) && (W(i, re), ei(
        /** @type {Effect} */
        i
      ));
    }
}
function Qr(e, t, n) {
  const r = n.get(e);
  if (r !== void 0) return r;
  if (e.deps !== null)
    for (const i of e.deps) {
      if (Ht.call(t, i))
        return !0;
      if ((i.f & ie) !== 0 && Qr(
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
function ei(e) {
  U.schedule(e);
}
function Qo(e, t) {
  if (!((e.f & Be) !== 0 && (e.f & Q) !== 0)) {
    (e.f & re) !== 0 ? t.d.push(e) : (e.f & Ne) !== 0 && t.m.push(e), W(e, Q);
    for (var n = e.first; n !== null; )
      Qo(n, t), n = n.next;
  }
}
function es(e) {
  W(e, Q);
  for (var t = e.first; t !== null; )
    es(t), t = t.next;
}
function ic(e) {
  let t = 0, n = pn(0), r;
  return () => {
    ri() && (qe(n), hs(() => (t === 0 && (r = Rc(() => e(() => rn(n)))), t += 1, () => {
      at(() => {
        t -= 1, t === 0 && (r?.(), r = void 0, rn(n));
      });
    })));
  };
}
var oc = an | Rt;
function sc(e, t, n, r) {
  new ac(e, t, n, r);
}
class ac {
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
  #n = J ? M : null;
  /** @type {BoundaryProps} */
  #r;
  /** @type {((anchor: Node) => void)} */
  #t;
  /** @type {Effect} */
  #l;
  /** @type {Effect | null} */
  #c = null;
  /** @type {Effect | null} */
  #i = null;
  /** @type {Effect | null} */
  #s = null;
  /** @type {DocumentFragment | null} */
  #o = null;
  #a = 0;
  #d = 0;
  #f = !1;
  /** @type {Set<Effect>} */
  #u = /* @__PURE__ */ new Set();
  /** @type {Set<Effect>} */
  #h = /* @__PURE__ */ new Set();
  /**
   * A source containing the number of pending async deriveds/expressions.
   * Only created if `$effect.pending()` is used inside the boundary,
   * otherwise updating the source results in needless `Batch.ensure()`
   * calls followed by no-op flushes
   * @type {Source<number> | null}
   */
  #p = null;
  #w = ic(() => (this.#p = pn(this.#a), () => {
    this.#p = null;
  }));
  /**
   * @param {TemplateNode} node
   * @param {BoundaryProps} props
   * @param {((anchor: Node) => void)} children
   * @param {((error: unknown) => unknown) | undefined} [transform_error]
   */
  constructor(t, n, r, i) {
    this.#e = t, this.#r = n, this.#t = (o) => {
      var s = (
        /** @type {Effect} */
        O
      );
      s.b = this, s.f |= Tr, r(o);
    }, this.parent = /** @type {Effect} */
    O.b, this.transform_error = i ?? this.parent?.transform_error ?? ((o) => o), this.#l = _c(() => {
      if (J) {
        const o = (
          /** @type {Comment} */
          this.#n
        );
        Xr();
        const s = o.data === jo;
        if (o.data.startsWith(Wi)) {
          const a = JSON.parse(o.data.slice(Wi.length));
          this.#y(a);
        } else s ? this.#E() : this.#_();
      } else
        this.#x();
    }, oc), J && (this.#e = M);
  }
  #_() {
    try {
      this.#c = gt(() => this.#t(this.#e));
    } catch (t) {
      this.error(t);
    }
  }
  /**
   * @param {unknown} error The deserialized error from the server's hydration comment
   */
  #y(t) {
    const n = this.#r.failed;
    n && (this.#s = gt(() => {
      n(
        this.#e,
        () => t,
        () => () => {
        }
      );
    }));
  }
  #E() {
    const t = this.#r.pending;
    t && (this.is_pending = !0, this.#i = gt(() => t(this.#e)), at(() => {
      var n = this.#o = document.createDocumentFragment(), r = Ye();
      n.append(r), this.#c = this.#g(() => gt(() => this.#t(r))), this.#d === 0 && (this.#e.before(n), this.#o = null, $n(
        /** @type {Effect} */
        this.#i,
        () => {
          this.#i = null;
        }
      ), this.#v(
        /** @type {Batch} */
        U
      ));
    }));
  }
  #x() {
    try {
      if (this.is_pending = this.has_pending_snippet(), this.#d = 0, this.#a = 0, this.#c = gt(() => {
        this.#t(this.#e);
      }), this.#d > 0) {
        var t = this.#o = document.createDocumentFragment();
        kc(this.#c, t);
        const n = (
          /** @type {(anchor: Node) => void} */
          this.#r.pending
        );
        this.#i = gt(() => n(this.#e));
      } else
        this.#v(
          /** @type {Batch} */
          U
        );
    } catch (n) {
      this.error(n);
    }
  }
  /**
   * @param {Batch} batch
   */
  #v(t) {
    this.is_pending = !1, t.transfer_effects(this.#u, this.#h);
  }
  /**
   * Defer an effect inside a pending boundary until the boundary resolves
   * @param {Effect} effect
   */
  defer_effect(t) {
    Yo(t, this.#u, this.#h);
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
    var n = O, r = P, i = ce;
    Ue(this.#l), Ee(this.#l), Vt(this.#l.ctx);
    try {
      return Ge.ensure(), t();
    } catch (o) {
      return Wo(o), null;
    } finally {
      Ue(n), Ee(r), Vt(i);
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
    this.#d += t, this.#d === 0 && (this.#v(n), this.#i && $n(this.#i, () => {
      this.#i = null;
    }), this.#o && (this.#e.before(this.#o), this.#o = null));
  }
  /**
   * Update the source that powers `$effect.pending()` inside this boundary,
   * and controls when the current `pending` snippet (if any) is removed.
   * Do not call from inside the class
   * @param {1 | -1} d
   * @param {Batch} batch
   */
  update_pending_count(t, n) {
    this.#k(t, n), this.#a += t, !(!this.#p || this.#f) && (this.#f = !0, at(() => {
      this.#f = !1, this.#p && Vn(this.#p, this.#a);
    }));
  }
  get_effect_pending() {
    return this.#w(), qe(
      /** @type {Source<number>} */
      this.#p
    );
  }
  /** @param {unknown} error */
  error(t) {
    if (!this.#r.onerror && !this.#r.failed)
      throw t;
    U?.is_fork ? (this.#c && U.skip_effect(this.#c), this.#i && U.skip_effect(this.#i), this.#s && U.skip_effect(this.#s), U.on_fork_commit(() => {
      this.#b(t);
    })) : this.#b(t);
  }
  /**
   * @param {unknown} error
   */
  #b(t) {
    this.#c && ($e(this.#c), this.#c = null), this.#i && ($e(this.#i), this.#i = null), this.#s && ($e(this.#s), this.#s = null), J && (Ce(
      /** @type {TemplateNode} */
      this.#n
    ), Wl(), Ce(Gl()));
    var n = this.#r.onerror;
    let r = this.#r.failed;
    var i = !1, o = !1;
    const s = () => {
      if (i) {
        Zl();
        return;
      }
      i = !0, o && jl(), this.#s !== null && $n(this.#s, () => {
        this.#s = null;
      }), this.#g(() => {
        this.#x();
      });
    }, l = (a) => {
      try {
        o = !0, n?.(a, s), o = !1;
      } catch (u) {
        it(u, this.#l && this.#l.parent);
      }
      r && (this.#s = this.#g(() => {
        try {
          return gt(() => {
            var u = (
              /** @type {Effect} */
              O
            );
            u.b = this, u.f |= Tr, r(
              this.#e,
              () => a,
              () => s
            );
          });
        } catch (u) {
          return it(
            u,
            /** @type {Effect} */
            this.#l.parent
          ), null;
        }
      }));
    };
    at(() => {
      var a;
      try {
        a = this.transform_error(t);
      } catch (u) {
        it(u, this.#l && this.#l.parent);
        return;
      }
      a !== null && typeof a == "object" && typeof /** @type {any} */
      a.then == "function" ? a.then(
        l,
        /** @param {unknown} e */
        (u) => it(u, this.#l && this.#l.parent)
      ) : l(a);
    });
  }
}
function lc(e, t, n, r) {
  const i = ti;
  var o = e.filter((w) => !w.settled);
  if (n.length === 0 && o.length === 0) {
    r(t.map(i));
    return;
  }
  var s = (
    /** @type {Effect} */
    O
  ), l = cc(), a = o.length === 1 ? o[0].promise : o.length > 1 ? Promise.all(o.map((w) => w.promise)) : null;
  function u(w) {
    if ((s.f & Pe) === 0) {
      l();
      try {
        r(w);
      } catch (y) {
        it(y, s);
      }
      Dn();
    }
  }
  var f = ts();
  if (n.length === 0) {
    a.then(() => u(t.map(i))).finally(f);
    return;
  }
  function h() {
    Promise.all(n.map((w) => /* @__PURE__ */ uc(w))).then((w) => u([...t.map(i), ...w])).catch((w) => it(w, s)).finally(f);
  }
  a ? a.then(() => {
    l(), h(), Dn();
  }) : h();
}
function cc() {
  var e = (
    /** @type {Effect} */
    O
  ), t = P, n = ce, r = (
    /** @type {Batch} */
    U
  );
  return function(o = !0) {
    Ue(e), Ee(t), Vt(n), o && (e.f & Pe) === 0 && (r?.activate(), r?.apply());
  };
}
function Dn(e = !0) {
  Ue(null), Ee(null), Vt(null), e && U?.deactivate();
}
function ts() {
  var e = (
    /** @type {Effect} */
    O
  ), t = (
    /** @type {Boundary} */
    e.b
  ), n = (
    /** @type {Batch} */
    U
  ), r = t.is_rendered();
  return t.update_pending_count(1, n), n.increment(r, e), () => {
    t.update_pending_count(-1, n), n.decrement(r, e);
  };
}
// @__NO_SIDE_EFFECTS__
function ti(e) {
  var t = ie | re;
  return O !== null && (O.f |= Rt), {
    ctx: ce,
    deps: null,
    effects: null,
    equals: qo,
    f: t,
    fn: e,
    reactions: null,
    rv: 0,
    v: (
      /** @type {V} */
      te
    ),
    wv: 0,
    parent: O,
    ac: null
  };
}
const _n = Symbol("obsolete");
// @__NO_SIDE_EFFECTS__
function uc(e, t, n) {
  let r = (
    /** @type {Effect | null} */
    O
  );
  r === null && Ol();
  var i = (
    /** @type {Promise<V>} */
    /** @type {unknown} */
    void 0
  ), o = pn(
    /** @type {V} */
    te
  ), s = !P, l = /* @__PURE__ */ new Set();
  return mc(() => {
    var a = (
      /** @type {Effect} */
      O
    ), u = zo();
    i = u.promise;
    try {
      Promise.resolve(e()).then(u.resolve, (y) => {
        y !== Jn && u.reject(y);
      }).finally(Dn);
    } catch (y) {
      u.reject(y), Dn();
    }
    var f = (
      /** @type {Batch} */
      U
    );
    if (s) {
      if ((a.f & pt) !== 0)
        var h = ts();
      if (
        /** @type {Boundary} */
        r.b.is_rendered()
      )
        f.async_deriveds.get(a)?.reject(_n);
      else
        for (const y of l.values())
          y.reject(_n);
      l.add(u), f.async_deriveds.set(a, u);
    }
    const w = (y, c = void 0) => {
      h?.(), l.delete(u), c !== _n && (f.activate(), c ? (o.f |= st, Vn(o, c)) : ((o.f & st) !== 0 && (o.f ^= st), Vn(o, y)), f.deactivate());
    };
    u.promise.then(w, (y) => w(null, y || "unknown"));
  }), fs(() => {
    for (const a of l)
      a.reject(_n);
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
function jg(e) {
  const t = /* @__PURE__ */ ti(e);
  return vs(t), t;
}
// @__NO_SIDE_EFFECTS__
function Vg(e) {
  const t = /* @__PURE__ */ ti(e);
  return t.equals = Fo, t;
}
function fc(e) {
  var t = e.effects;
  if (t !== null) {
    e.effects = null;
    for (var n = 0; n < t.length; n += 1)
      $e(
        /** @type {Effect} */
        t[n]
      );
  }
}
function ni(e) {
  var t, n = O, r = e.parent;
  if (!ft && r !== null && (r.f & (Pe | me)) !== 0)
    return Kl(), e.v;
  Ue(r);
  try {
    e.f &= ~At, fc(e), t = Es(e);
  } finally {
    Ue(n);
  }
  return t;
}
function ns(e) {
  var t = ni(e);
  if (!e.equals(t) && (e.wv = ms(), (!U?.is_fork || e.deps === null) && (U !== null ? (U.capture(e, t, !0), Or?.capture(e, t, !0)) : e.v = t, e.deps === null))) {
    W(e, Q);
    return;
  }
  ft || (Re !== null ? (ri() || U?.is_fork) && Re.set(e, t) : Jr(e));
}
function dc(e) {
  if (e.effects !== null)
    for (const t of e.effects)
      (t.teardown || t.ac) && (t.teardown?.(), t.ac?.abort(Jn), t.teardown = Al, t.ac = null, ln(t, 0), ii(t));
}
function rs(e) {
  if (e.effects !== null)
    for (const t of e.effects)
      t.teardown && Ft(t);
}
let jn = /* @__PURE__ */ new Set();
const Et = /* @__PURE__ */ new Map();
let is = !1;
function pn(e, t) {
  var n = {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v: e,
    reactions: null,
    equals: qo,
    rv: 0,
    wv: 0
  };
  return n;
}
// @__NO_SIDE_EFFECTS__
function Qe(e, t) {
  const n = pn(e);
  return vs(n), n;
}
// @__NO_SIDE_EFFECTS__
function hc(e, t = !1, n = !0) {
  const r = pn(e);
  return t || (r.equals = Fo), r;
}
function nt(e, t, n = !1) {
  P !== null && // since we are untracking the function inside `$inspect.with` we need to add this check
  // to ensure we error if state is set inside an inspect effect
  (!Se || (P.f & zn) !== 0) && Ko() && (P.f & (ie | Ie | Bt | zn)) !== 0 && (_e === null || !Ht.call(_e, e)) && Dl();
  let r = n ? Qt(t) : t;
  return Vn(e, r, Sn);
}
function Vn(e, t, n = null) {
  if (!e.equals(t)) {
    Et.set(e, ft ? t : e.v);
    var r = Ge.ensure();
    if (r.capture(e, t), (e.f & ie) !== 0) {
      const i = (
        /** @type {Derived} */
        e
      );
      (e.f & re) !== 0 && ni(i), Re === null && Jr(i);
    }
    e.wv = ms(), os(e, re, n), O !== null && (O.f & Q) !== 0 && (O.f & (Be | We)) === 0 && (ve === null ? Ac([e]) : ve.push(e)), !r.is_fork && jn.size > 0 && !is && pc();
  }
  return t;
}
function pc() {
  is = !1;
  for (const e of jn) {
    (e.f & Q) !== 0 && W(e, Ne);
    let t;
    try {
      t = gn(e);
    } catch {
      t = !0;
    }
    t && Ft(e);
  }
  jn.clear();
}
function rn(e) {
  nt(e, e.v + 1);
}
function os(e, t, n) {
  var r = e.reactions;
  if (r !== null)
    for (var i = r.length, o = 0; o < i; o++) {
      var s = r[o], l = s.f, a = (l & re) === 0;
      if (a && W(s, t), (l & zn) !== 0)
        jn.add(
          /** @type {Effect} */
          s
        );
      else if ((l & ie) !== 0) {
        var u = (
          /** @type {Derived} */
          s
        );
        Re?.delete(u), (l & At) === 0 && (l & be && (O === null || (O.f & Hn) === 0) && (s.f |= At), os(u, Ne, n));
      } else if (a) {
        var f = (
          /** @type {Effect} */
          s
        );
        (l & Ie) !== 0 && je !== null && je.add(f), n !== null ? n.push(f) : ei(f);
      }
    }
}
function Qt(e) {
  if (typeof e != "object" || e === null || _t in e)
    return e;
  const t = Mo(e);
  if (t !== xl && t !== kl)
    return e;
  var n = /* @__PURE__ */ new Map(), r = bl(e), i = /* @__PURE__ */ Qe(0), o = xt, s = (l) => {
    if (xt === o)
      return l();
    var a = P, u = xt;
    Ee(null), to(o);
    var f = l();
    return Ee(a), to(u), f;
  };
  return r && n.set("length", /* @__PURE__ */ Qe(
    /** @type {any[]} */
    e.length
  )), new Proxy(
    /** @type {any} */
    e,
    {
      defineProperty(l, a, u) {
        (!("value" in u) || u.configurable === !1 || u.enumerable === !1 || u.writable === !1) && zl();
        var f = n.get(a);
        return f === void 0 ? s(() => {
          var h = /* @__PURE__ */ Qe(u.value);
          return n.set(a, h), h;
        }) : nt(f, u.value, !0), !0;
      },
      deleteProperty(l, a) {
        var u = n.get(a);
        if (u === void 0) {
          if (a in l) {
            const f = s(() => /* @__PURE__ */ Qe(te));
            n.set(a, f), rn(i);
          }
        } else
          nt(u, te), rn(i);
        return !0;
      },
      get(l, a, u) {
        if (a === _t)
          return e;
        var f = n.get(a), h = a in l;
        if (f === void 0 && (!h || Pt(l, a)?.writable) && (f = s(() => {
          var y = Qt(h ? l[a] : te), c = /* @__PURE__ */ Qe(y);
          return c;
        }), n.set(a, f)), f !== void 0) {
          var w = qe(f);
          return w === te ? void 0 : w;
        }
        return Reflect.get(l, a, u);
      },
      getOwnPropertyDescriptor(l, a) {
        var u = Reflect.getOwnPropertyDescriptor(l, a);
        if (u && "value" in u) {
          var f = n.get(a);
          f && (u.value = qe(f));
        } else if (u === void 0) {
          var h = n.get(a), w = h?.v;
          if (h !== void 0 && w !== te)
            return {
              enumerable: !0,
              configurable: !0,
              value: w,
              writable: !0
            };
        }
        return u;
      },
      has(l, a) {
        if (a === _t)
          return !0;
        var u = n.get(a), f = u !== void 0 && u.v !== te || Reflect.has(l, a);
        if (u !== void 0 || O !== null && (!f || Pt(l, a)?.writable)) {
          u === void 0 && (u = s(() => {
            var w = f ? Qt(l[a]) : te, y = /* @__PURE__ */ Qe(w);
            return y;
          }), n.set(a, u));
          var h = qe(u);
          if (h === te)
            return !1;
        }
        return f;
      },
      set(l, a, u, f) {
        var h = n.get(a), w = a in l;
        if (r && a === "length")
          for (var y = u; y < /** @type {Source<number>} */
          h.v; y += 1) {
            var c = n.get(y + "");
            c !== void 0 ? nt(c, te) : y in l && (c = s(() => /* @__PURE__ */ Qe(te)), n.set(y + "", c));
          }
        if (h === void 0)
          (!w || Pt(l, a)?.writable) && (h = s(() => /* @__PURE__ */ Qe(void 0)), nt(h, Qt(u)), n.set(a, h));
        else {
          w = h.v !== te;
          var d = s(() => Qt(u));
          nt(h, d);
        }
        var g = Reflect.getOwnPropertyDescriptor(l, a);
        if (g?.set && g.set.call(f, u), !w) {
          if (r && typeof a == "string") {
            var p = (
              /** @type {Source<number>} */
              n.get("length")
            ), v = Number(a);
            Number.isInteger(v) && v >= p.v && nt(p, v + 1);
          }
          rn(i);
        }
        return !0;
      },
      ownKeys(l) {
        qe(i);
        var a = Reflect.ownKeys(l).filter((h) => {
          var w = n.get(h);
          return w === void 0 || w.v !== te;
        });
        for (var [u, f] of n)
          f.v !== te && !(u in l) && a.push(u);
        return a;
      },
      setPrototypeOf() {
        Hl();
      }
    }
  );
}
function Xi(e) {
  try {
    if (e !== null && typeof e == "object" && _t in e)
      return e[_t];
  } catch {
  }
  return e;
}
function qg(e, t) {
  return Object.is(Xi(e), Xi(t));
}
var Ji, ss, as, ls;
function Br() {
  if (Ji === void 0) {
    Ji = window, ss = /Firefox/.test(navigator.userAgent);
    var e = Element.prototype, t = Node.prototype, n = Text.prototype;
    as = Pt(t, "firstChild").get, ls = Pt(t, "nextSibling").get, Ki(e) && (e[Cl] = void 0, e[$l] = null, e[Tl] = void 0, e.__e = void 0), Ki(n) && (n[Lr] = void 0);
  }
}
function Ye(e = "") {
  return document.createTextNode(e);
}
// @__NO_SIDE_EFFECTS__
function qt(e) {
  return (
    /** @type {TemplateNode | null} */
    as.call(e)
  );
}
// @__NO_SIDE_EFFECTS__
function Je(e) {
  return (
    /** @type {TemplateNode | null} */
    ls.call(e)
  );
}
function Fg(e, t) {
  if (!J)
    return /* @__PURE__ */ qt(e);
  var n = /* @__PURE__ */ qt(M);
  if (n === null)
    n = M.appendChild(Ye());
  else if (t && n.nodeType !== dn) {
    var r = Ye();
    return n?.before(r), Ce(r), r;
  }
  return t && tr(
    /** @type {Text} */
    n
  ), Ce(n), n;
}
function Kg(e, t = !1) {
  if (!J) {
    var n = /* @__PURE__ */ qt(e);
    return n instanceof Comment && n.data === "" ? /* @__PURE__ */ Je(n) : n;
  }
  if (t) {
    if (M?.nodeType !== dn) {
      var r = Ye();
      return M?.before(r), Ce(r), r;
    }
    tr(
      /** @type {Text} */
      M
    );
  }
  return M;
}
function Zg(e, t = 1, n = !1) {
  let r = J ? M : e;
  for (var i; t--; )
    i = r, r = /** @type {TemplateNode} */
    /* @__PURE__ */ Je(r);
  if (!J)
    return r;
  if (n) {
    if (r?.nodeType !== dn) {
      var o = Ye();
      return r === null ? i?.after(o) : r.before(o), Ce(o), o;
    }
    tr(
      /** @type {Text} */
      r
    );
  }
  return Ce(r), r;
}
function gc(e) {
  e.textContent = "";
}
function Wg() {
  return !1;
}
function cs(e, t, n) {
  return (
    /** @type {T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : Element} */
    document.createElementNS(t ?? Fl, e, void 0)
  );
}
function tr(e) {
  if (
    /** @type {string} */
    e.nodeValue.length < 65536
  )
    return;
  let t = e.nextSibling;
  for (; t !== null && t.nodeType === dn; )
    t.remove(), e.nodeValue += /** @type {string} */
    t.nodeValue, t = e.nextSibling;
}
function Gg(e, t) {
  if (t) {
    const n = document.body;
    e.autofocus = !0, at(() => {
      document.activeElement === n && e.focus();
    });
  }
}
let Qi = !1;
function yc() {
  Qi || (Qi = !0, document.addEventListener(
    "reset",
    (e) => {
      Promise.resolve().then(() => {
        if (!e.defaultPrevented)
          for (
            const t of
            /**@type {HTMLFormElement} */
            e.target.elements
          )
            t[Rn]?.();
      });
    },
    // In the capture phase to guarantee we get noticed of it (no possibility of stopPropagation)
    { capture: !0 }
  ));
}
function nr(e) {
  var t = P, n = O;
  Ee(null), Ue(null);
  try {
    return e();
  } finally {
    Ee(t), Ue(n);
  }
}
function Yg(e, t, n, r = n) {
  e.addEventListener(t, () => nr(n));
  const i = (
    /** @type {any} */
    e[Rn]
  );
  i ? e[Rn] = () => {
    i(), r(!0);
  } : e[Rn] = () => r(!0), yc();
}
function us(e) {
  O === null && (P === null && Nl(), Bl()), ft && Pl();
}
function wc(e, t) {
  var n = t.last;
  n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function ke(e, t) {
  var n = O;
  n !== null && (n.f & me) !== 0 && (e |= me);
  var r = {
    ctx: ce,
    deps: null,
    nodes: null,
    f: e | re | be,
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
  U?.register_created_effect(r);
  var i = r;
  if ((e & Dt) !== 0)
    Lt !== null ? Lt.push(r) : Ge.ensure().schedule(r);
  else if (t !== null) {
    try {
      Ft(r);
    } catch (s) {
      throw $e(r), s;
    }
    i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && // either `null`, or a singular child
    (i.f & Rt) === 0 && (i = i.first, (e & Ie) !== 0 && (e & an) !== 0 && i !== null && (i.f |= an));
  }
  if (i !== null && (i.parent = n, n !== null && wc(i, n), P !== null && (P.f & ie) !== 0 && (e & We) === 0)) {
    var o = (
      /** @type {Derived} */
      P
    );
    (o.effects ??= []).push(i);
  }
  return r;
}
function ri() {
  return P !== null && !Se;
}
function fs(e) {
  const t = ke(fn, null);
  return W(t, Q), t.teardown = e, t;
}
function Xg(e) {
  us();
  var t = (
    /** @type {Effect} */
    O.f
  ), n = !P && (t & Be) !== 0 && (t & pt) === 0;
  if (n) {
    var r = (
      /** @type {ComponentContext} */
      ce
    );
    (r.e ??= []).push(e);
  } else
    return ds(e);
}
function ds(e) {
  return ke(Dt | Ho, e);
}
function Jg(e) {
  return us(), ke(fn | Ho, e);
}
function vc(e) {
  Ge.ensure();
  const t = ke(We | Rt, e);
  return () => {
    $e(t);
  };
}
function bc(e) {
  Ge.ensure();
  const t = ke(We | Rt, e);
  return (n = {}) => new Promise((r) => {
    n.outro ? $n(t, () => {
      $e(t), r(void 0);
    }) : ($e(t), r(void 0));
  });
}
function Qg(e) {
  return ke(Dt, e);
}
function mc(e) {
  return ke(Bt | Rt, e);
}
function hs(e, t = 0) {
  return ke(fn | t, e);
}
function e0(e, t = [], n = [], r = []) {
  lc(r, t, n, (i) => {
    ke(fn, () => e(...i.map(qe)));
  });
}
function _c(e, t = 0) {
  var n = ke(Ie | t, e);
  return n;
}
function t0(e, t = 0) {
  var n = ke(Yr | t, e);
  return n;
}
function gt(e) {
  return ke(Be | Rt, e);
}
function ps(e) {
  var t = e.teardown;
  if (t !== null) {
    const n = ft, r = P;
    eo(!0), Ee(null);
    try {
      t.call(null);
    } finally {
      eo(n), Ee(r);
    }
  }
}
function ii(e, t = !1) {
  var n = e.first;
  for (e.first = e.last = null; n !== null; ) {
    const i = n.ac;
    i !== null && nr(() => {
      i.abort(Jn);
    });
    var r = n.next;
    (n.f & We) !== 0 ? n.parent = null : $e(n, t), n = r;
  }
}
function Ec(e) {
  for (var t = e.first; t !== null; ) {
    var n = t.next;
    (t.f & Be) === 0 && $e(t), t = n;
  }
}
function $e(e, t = !0) {
  var n = !1;
  (t || (e.f & Rl) !== 0) && e.nodes !== null && e.nodes.end !== null && (xc(
    e.nodes.start,
    /** @type {TemplateNode} */
    e.nodes.end
  ), n = !0), W(e, Zi), ii(e, t && !n), ln(e, 0);
  var r = e.nodes && e.nodes.t;
  if (r !== null)
    for (const o of r)
      o.stop();
  ps(e), e.f ^= Zi, e.f |= Pe;
  var i = e.parent;
  i !== null && i.first !== null && gs(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function xc(e, t) {
  for (; e !== null; ) {
    var n = e === t ? null : /* @__PURE__ */ Je(e);
    e.remove(), e = n;
  }
}
function gs(e) {
  var t = e.parent, n = e.prev, r = e.next;
  n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function $n(e, t, n = !0) {
  var r = [];
  ys(e, r, !0);
  var i = () => {
    n && $e(e), t && t();
  }, o = r.length;
  if (o > 0) {
    var s = () => --o || i();
    for (var l of r)
      l.out(s);
  } else
    i();
}
function ys(e, t, n) {
  if ((e.f & me) === 0) {
    e.f ^= me;
    var r = e.nodes && e.nodes.t;
    if (r !== null)
      for (const l of r)
        (l.is_global || n) && t.push(l);
    for (var i = e.first; i !== null; ) {
      var o = i.next;
      if ((i.f & We) === 0) {
        var s = (i.f & an) !== 0 || // If this is a branch effect without a block effect parent,
        // it means the parent block effect was pruned. In that case,
        // transparency information was transferred to the branch effect.
        (i.f & Be) !== 0 && (e.f & Ie) !== 0;
        ys(i, t, s ? n : !1);
      }
      i = o;
    }
  }
}
function n0(e) {
  ws(e, !0);
}
function ws(e, t) {
  if ((e.f & me) !== 0) {
    e.f ^= me, (e.f & Q) === 0 && (W(e, re), Ge.ensure().schedule(e));
    for (var n = e.first; n !== null; ) {
      var r = n.next, i = (n.f & an) !== 0 || (n.f & Be) !== 0;
      ws(n, i ? t : !1), n = r;
    }
    var o = e.nodes && e.nodes.t;
    if (o !== null)
      for (const s of o)
        (s.is_global || t) && s.in();
  }
}
function kc(e, t) {
  if (e.nodes)
    for (var n = e.nodes.start, r = e.nodes.end; n !== null; ) {
      var i = n === r ? null : /* @__PURE__ */ Je(n);
      t.append(n), n = i;
    }
}
let Cn = !1, ft = !1;
function eo(e) {
  ft = e;
}
let P = null, Se = !1;
function Ee(e) {
  P = e;
}
let O = null;
function Ue(e) {
  O = e;
}
let _e = null;
function vs(e) {
  P !== null && (_e === null ? _e = [e] : _e.push(e));
}
let de = null, ye = 0, ve = null;
function Ac(e) {
  ve = e;
}
let bs = 1, vt = 0, xt = vt;
function to(e) {
  xt = e;
}
function ms() {
  return ++bs;
}
function gn(e) {
  var t = e.f;
  if ((t & re) !== 0)
    return !0;
  if (t & ie && (e.f &= ~At), (t & Ne) !== 0) {
    for (var n = (
      /** @type {Value[]} */
      e.deps
    ), r = n.length, i = 0; i < r; i++) {
      var o = n[i];
      if (gn(
        /** @type {Derived} */
        o
      ) && ns(
        /** @type {Derived} */
        o
      ), o.wv > e.wv)
        return !0;
    }
    (t & be) !== 0 && // During time traveling we don't want to reset the status so that
    // traversal of the graph in the other batches still happens
    Re === null && W(e, Q);
  }
  return !1;
}
function _s(e, t, n = !0) {
  var r = e.reactions;
  if (r !== null && !(_e !== null && Ht.call(_e, e)))
    for (var i = 0; i < r.length; i++) {
      var o = r[i];
      (o.f & ie) !== 0 ? _s(
        /** @type {Derived} */
        o,
        t,
        !1
      ) : t === o && (n ? W(o, re) : (o.f & Q) !== 0 && W(o, Ne), ei(
        /** @type {Effect} */
        o
      ));
    }
}
function Es(e) {
  var t = de, n = ye, r = ve, i = P, o = _e, s = ce, l = Se, a = xt, u = e.f;
  de = /** @type {null | Value[]} */
  null, ye = 0, ve = null, P = (u & (Be | We)) === 0 ? e : null, _e = null, Vt(e.ctx), Se = !1, xt = ++vt, e.ac !== null && (nr(() => {
    e.ac.abort(Jn);
  }), e.ac = null);
  try {
    e.f |= Hn;
    var f = (
      /** @type {Function} */
      e.fn
    ), h = f();
    e.f |= pt;
    var w = e.deps, y = U?.is_fork;
    if (de !== null) {
      var c;
      if (y || ln(e, ye), w !== null && ye > 0)
        for (w.length = ye + de.length, c = 0; c < de.length; c++)
          w[ye + c] = de[c];
      else
        e.deps = w = de;
      if (ri() && (e.f & be) !== 0)
        for (c = ye; c < w.length; c++)
          (w[c].reactions ??= []).push(e);
    } else !y && w !== null && ye < w.length && (ln(e, ye), w.length = ye);
    if (Ko() && ve !== null && !Se && w !== null && (e.f & (ie | Ne | re)) === 0)
      for (c = 0; c < /** @type {Source[]} */
      ve.length; c++)
        _s(
          ve[c],
          /** @type {Effect} */
          e
        );
    if (i !== null && i !== e) {
      if (vt++, i.deps !== null)
        for (let d = 0; d < n; d += 1)
          i.deps[d].rv = vt;
      if (t !== null)
        for (const d of t)
          d.rv = vt;
      ve !== null && (r === null ? r = ve : r.push(.../** @type {Source[]} */
      ve));
    }
    return (e.f & st) !== 0 && (e.f ^= st), h;
  } catch (d) {
    return Wo(d);
  } finally {
    e.f ^= Hn, de = t, ye = n, ve = r, P = i, _e = o, Vt(s), Se = l, xt = a;
  }
}
function Ic(e, t) {
  let n = t.reactions;
  if (n !== null) {
    var r = ml.call(n, e);
    if (r !== -1) {
      var i = n.length - 1;
      i === 0 ? n = t.reactions = null : (n[r] = n[i], n.pop());
    }
  }
  if (n === null && (t.f & ie) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
  // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
  // allows us to skip the expensive work of disconnecting and immediately reconnecting it
  (de === null || !Ht.call(de, t))) {
    var o = (
      /** @type {Derived} */
      t
    );
    (o.f & be) !== 0 && (o.f ^= be, o.f &= ~At), o.v !== te && Jr(o), dc(o), ln(o, 0);
  }
}
function ln(e, t) {
  var n = e.deps;
  if (n !== null)
    for (var r = t; r < n.length; r++)
      Ic(e, n[r]);
}
function Ft(e) {
  var t = e.f;
  if ((t & Pe) === 0) {
    W(e, Q);
    var n = O, r = Cn;
    O = e, Cn = !0;
    try {
      (t & (Ie | Yr)) !== 0 ? Ec(e) : ii(e), ps(e);
      var i = Es(e);
      e.teardown = typeof i == "function" ? i : null, e.wv = bs;
      var o;
    } finally {
      Cn = r, O = n;
    }
  }
}
async function r0() {
  await Promise.resolve(), Xo();
}
function qe(e) {
  var t = e.f, n = (t & ie) !== 0;
  if (P !== null && !Se) {
    var r = O !== null && (O.f & Pe) !== 0;
    if (!r && (_e === null || !Ht.call(_e, e))) {
      var i = P.deps;
      if ((P.f & Hn) !== 0)
        e.rv < vt && (e.rv = vt, de === null && i !== null && i[ye] === e ? ye++ : de === null ? de = [e] : de.push(e));
      else {
        (P.deps ??= []).push(e);
        var o = e.reactions;
        o === null ? e.reactions = [P] : Ht.call(o, P) || o.push(P);
      }
    }
  }
  if (ft && Et.has(e))
    return Et.get(e);
  if (n) {
    var s = (
      /** @type {Derived} */
      e
    );
    if (ft) {
      var l = s.v;
      return ((s.f & Q) === 0 && s.reactions !== null || ks(s)) && (l = ni(s)), Et.set(s, l), l;
    }
    var a = (s.f & be) === 0 && !Se && P !== null && (Cn || (P.f & be) !== 0), u = (s.f & pt) === 0;
    gn(s) && (a && (s.f |= be), ns(s)), a && !u && (rs(s), xs(s));
  }
  if (Re?.has(e))
    return Re.get(e);
  if ((e.f & st) !== 0)
    throw e.v;
  return e.v;
}
function xs(e) {
  if (e.f |= be, e.deps !== null)
    for (const t of e.deps)
      (t.reactions ??= []).push(e), (t.f & ie) !== 0 && (t.f & be) === 0 && (rs(
        /** @type {Derived} */
        t
      ), xs(
        /** @type {Derived} */
        t
      ));
}
function ks(e) {
  if (e.v === te) return !0;
  if (e.deps === null) return !1;
  for (const t of e.deps)
    if (Et.has(t) || (t.f & ie) !== 0 && ks(
      /** @type {Derived} */
      t
    ))
      return !0;
  return !1;
}
function Rc(e) {
  var t = Se;
  try {
    return Se = !0, e();
  } finally {
    Se = t;
  }
}
function i0(e) {
  if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
    if (_t in e)
      Nr(e);
    else if (!Array.isArray(e))
      for (let t in e) {
        const n = e[t];
        typeof n == "object" && n && _t in n && Nr(n);
      }
  }
}
function Nr(e, t = /* @__PURE__ */ new Set()) {
  if (typeof e == "object" && e !== null && // We don't want to traverse DOM elements
  !(e instanceof EventTarget) && !t.has(e)) {
    t.add(e), e instanceof Date && e.getTime();
    for (let r in e)
      try {
        Nr(e[r], t);
      } catch {
      }
    const n = Mo(e);
    if (n !== Object.prototype && n !== Array.prototype && n !== Map.prototype && n !== Set.prototype && n !== Date.prototype) {
      const r = El(n);
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
function o0(e) {
  return e.endsWith("capture") && e !== "gotpointercapture" && e !== "lostpointercapture";
}
const Sc = [
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
function s0(e) {
  return Sc.includes(e);
}
const $c = {
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
function a0(e) {
  return e = e.toLowerCase(), $c[e] ?? e;
}
const Cc = ["touchstart", "touchmove"];
function Tc(e) {
  return Cc.includes(e);
}
const Lc = (
  /** @type {const} */
  ["textarea", "script", "style", "title"]
);
function l0(e) {
  return Lc.includes(
    /** @type {typeof RAW_TEXT_ELEMENTS[number]} */
    e
  );
}
const en = Symbol("events"), As = /* @__PURE__ */ new Set(), Ur = /* @__PURE__ */ new Set();
function c0(e) {
  if (!J) return;
  e.removeAttribute("onload"), e.removeAttribute("onerror");
  const t = e.__e;
  t !== void 0 && (e.__e = void 0, queueMicrotask(() => {
    e.isConnected && e.dispatchEvent(t);
  }));
}
function Is(e, t, n, r = {}) {
  function i(o) {
    if (r.capture || Mr.call(t, o), !o.cancelBubble)
      return nr(() => n?.call(this, o));
  }
  return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? at(() => {
    t.addEventListener(e, i, r);
  }) : t.addEventListener(e, i, r), i;
}
function u0(e, t, n, r = {}) {
  var i = Is(t, e, n, r);
  return () => {
    e.removeEventListener(t, i, r);
  };
}
function f0(e, t, n, r, i) {
  var o = { capture: r, passive: i }, s = Is(e, t, n, o);
  (t === document.body || // @ts-ignore
  t === window || // @ts-ignore
  t === document || // Firefox has quirky behavior, it can happen that we still get "canplay" events when the element is already removed
  t instanceof HTMLMediaElement) && fs(() => {
    t.removeEventListener(e, s, o);
  });
}
function d0(e, t, n) {
  (t[en] ??= {})[e] = n;
}
function h0(e) {
  for (var t = 0; t < e.length; t++)
    As.add(e[t]);
  for (var n of Ur)
    n(e);
}
let no = null;
function Mr(e) {
  var t = this, n = (
    /** @type {Node} */
    t.ownerDocument
  ), r = e.type, i = e.composedPath?.() || [], o = (
    /** @type {null | Element} */
    i[0] || e.target
  );
  no = e;
  var s = 0, l = no === e && e[en];
  if (l) {
    var a = i.indexOf(l);
    if (a !== -1 && (t === document || t === /** @type {any} */
    window)) {
      e[en] = t;
      return;
    }
    var u = i.indexOf(t);
    if (u === -1)
      return;
    a <= u && (s = a);
  }
  if (o = /** @type {Element} */
  i[s] || e.target, o !== t) {
    Mn(e, "currentTarget", {
      configurable: !0,
      get() {
        return o || n;
      }
    });
    var f = P, h = O;
    Ee(null), Ue(null);
    try {
      for (var w, y = []; o !== null; ) {
        var c = o.assignedSlot || o.parentNode || /** @type {any} */
        o.host || null;
        try {
          var d = o[en]?.[r];
          d != null && (!/** @type {any} */
          o.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
          // -> the target could not have been disabled because it emits the event in the first place
          e.target === o) && d.call(o, e);
        } catch (g) {
          w ? y.push(g) : w = g;
        }
        if (e.cancelBubble || c === t || c === null)
          break;
        o = c;
      }
      if (w) {
        for (let g of y)
          queueMicrotask(() => {
            throw g;
          });
        throw w;
      }
    } finally {
      e[en] = t, delete e.currentTarget, Ee(f), Ue(h);
    }
  }
}
const Oc = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", {
    /** @param {string} html */
    createHTML: (e) => e
  })
);
function Pc(e) {
  return (
    /** @type {string} */
    Oc?.createHTML(e) ?? e
  );
}
function Bc(e) {
  var t = cs("template");
  return t.innerHTML = Pc(e.replaceAll("<!>", "<!---->")), t.content;
}
function lt(e, t) {
  var n = (
    /** @type {Effect} */
    O
  );
  n.nodes === null && (n.nodes = { start: e, end: t, a: null, t: null });
}
// @__NO_SIDE_EFFECTS__
function p0(e, t) {
  var n = (t & Vl) !== 0, r = (t & ql) !== 0, i, o = !e.startsWith("<!>");
  return () => {
    if (J)
      return lt(M, null), M;
    i === void 0 && (i = Bc(o ? e : "<!>" + e), n || (i = /** @type {TemplateNode} */
    /* @__PURE__ */ qt(i)));
    var s = (
      /** @type {TemplateNode} */
      r || ss ? document.importNode(i, !0) : i.cloneNode(!0)
    );
    if (n) {
      var l = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ qt(s)
      ), a = (
        /** @type {TemplateNode} */
        s.lastChild
      );
      lt(l, a);
    } else
      lt(s, s);
    return s;
  };
}
function g0(e = "") {
  if (!J) {
    var t = Ye(e + "");
    return lt(t, t), t;
  }
  var n = M;
  return n.nodeType !== dn ? (n.before(n = Ye()), Ce(n)) : tr(
    /** @type {Text} */
    n
  ), lt(n, n), n;
}
function y0() {
  if (J)
    return lt(M, null), M;
  var e = document.createDocumentFragment(), t = document.createComment(""), n = Ye();
  return e.append(t, n), lt(t, n), e;
}
function Nc(e, t) {
  if (J) {
    var n = (
      /** @type {Effect & { nodes: EffectNodes }} */
      O
    );
    ((n.f & pt) === 0 || n.nodes.end === null) && (n.nodes.end = M), Xr();
    return;
  }
  e !== null && e.before(
    /** @type {Node} */
    t
  );
}
function w0() {
  if (J && M && M.nodeType === hn && M.textContent?.startsWith("$")) {
    const e = M.textContent.substring(1);
    return Xr(), e;
  }
  return (window.__svelte ??= {}).uid ??= 1, `c${window.__svelte.uid++}`;
}
function v0(e, t) {
  var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
  n !== /** @type {any} */
  (e[Lr] ??= e.nodeValue) && (e[Lr] = n, e.nodeValue = `${n}`);
}
function oi(e, t) {
  return Rs(e, t);
}
function Uc(e, t) {
  Br(), t.intro = t.intro ?? !1;
  const n = t.target, r = J, i = M;
  try {
    for (var o = /* @__PURE__ */ qt(n); o && (o.nodeType !== hn || /** @type {Comment} */
    o.data !== Do); )
      o = /* @__PURE__ */ Je(o);
    if (!o)
      throw jt;
    mn(!0), Ce(
      /** @type {Comment} */
      o
    );
    const s = Rs(e, { ...t, anchor: o });
    return mn(!1), /**  @type {Exports} */
    s;
  } catch (s) {
    if (s instanceof Error && s.message.split(`
`).some((l) => l.startsWith("https://svelte.dev/e/")))
      throw s;
    return s !== jt && console.warn("Failed to hydrate: ", s), t.recover === !1 && Ml(), Br(), gc(n), mn(!1), oi(e, t);
  } finally {
    mn(r), Ce(i);
  }
}
const En = /* @__PURE__ */ new Map();
function Rs(e, { target: t, anchor: n, props: r = {}, events: i, context: o, intro: s = !0, transformError: l }) {
  Br();
  var a = void 0, u = bc(() => {
    var f = n ?? t.appendChild(Ye());
    sc(
      /** @type {TemplateNode} */
      f,
      {
        pending: () => {
        }
      },
      (y) => {
        Xl({});
        var c = (
          /** @type {ComponentContext} */
          ce
        );
        if (o && (c.c = o), i && (r.$$events = i), J && lt(
          /** @type {TemplateNode} */
          y,
          null
        ), a = e(y, r) || {}, J && (O.nodes.end = M, M === null || M.nodeType !== hn || /** @type {Comment} */
        M.data !== Vo))
          throw Qn(), jt;
        Jl();
      },
      l
    );
    var h = /* @__PURE__ */ new Set(), w = (y) => {
      for (var c = 0; c < y.length; c++) {
        var d = y[c];
        if (!h.has(d)) {
          h.add(d);
          var g = Tc(d);
          for (const b of [t, document]) {
            var p = En.get(b);
            p === void 0 && (p = /* @__PURE__ */ new Map(), En.set(b, p));
            var v = p.get(d);
            v === void 0 ? (b.addEventListener(d, Mr, { passive: g }), p.set(d, 1)) : p.set(d, v + 1);
          }
        }
      }
    };
    return w(_l(As)), Ur.add(w), () => {
      for (var y of h)
        for (const g of [t, document]) {
          var c = (
            /** @type {Map<string, number>} */
            En.get(g)
          ), d = (
            /** @type {number} */
            c.get(y)
          );
          --d == 0 ? (g.removeEventListener(y, Mr), c.delete(y), c.size === 0 && En.delete(g)) : c.set(y, d);
        }
      Ur.delete(w), f !== n && f.parentNode?.removeChild(f);
    };
  });
  return zr.set(a, u), a;
}
let zr = /* @__PURE__ */ new WeakMap();
function Ss(e, t) {
  const n = zr.get(e);
  return n ? (zr.delete(e), n(t)) : Promise.resolve();
}
function Mc(e) {
  return new zc(e);
}
class zc {
  /** @type {any} */
  #e;
  /** @type {Record<string, any>} */
  #n;
  /**
   * @param {ComponentConstructorOptions & {
   *  component: any;
   * }} options
   */
  constructor(t) {
    var n = /* @__PURE__ */ new Map(), r = (o, s) => {
      var l = /* @__PURE__ */ hc(s, !1, !1);
      return n.set(o, l), l;
    };
    const i = new Proxy(
      { ...t.props || {}, $$events: {} },
      {
        get(o, s) {
          return qe(n.get(s) ?? r(s, Reflect.get(o, s)));
        },
        has(o, s) {
          return s === Sl ? !0 : (qe(n.get(s) ?? r(s, Reflect.get(o, s))), Reflect.has(o, s));
        },
        set(o, s, l) {
          return nt(n.get(s) ?? r(s, l), l), Reflect.set(o, s, l);
        }
      }
    );
    this.#n = (t.hydrate ? Uc : oi)(t.component, {
      target: t.target,
      anchor: t.anchor,
      props: i,
      context: t.context,
      intro: t.intro ?? !1,
      recover: t.recover,
      transformError: t.transformError
    }), (!t?.props?.$$host || t.sync === !1) && Xo(), this.#e = i.$$events;
    for (const o of Object.keys(this.#n))
      o === "$set" || o === "$destroy" || o === "$on" || Mn(this, o, {
        get() {
          return this.#n[o];
        },
        /** @param {any} value */
        set(s) {
          this.#n[o] = s;
        },
        enumerable: !0
      });
    this.#n.$set = /** @param {Record<string, any>} next */
    (o) => {
      Object.assign(i, o);
    }, this.#n.$destroy = () => {
      Ss(this.#n);
    };
  }
  /** @param {Record<string, any>} props */
  $set(t) {
    this.#n.$set(t);
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
    this.#n.$destroy();
  }
}
let $s;
typeof HTMLElement == "function" && ($s = class extends HTMLElement {
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
          const o = cs("slot");
          r !== "default" && (o.name = r), Nc(i, o);
        };
      };
      if (await Promise.resolve(), !this.$$cn || this.$$c)
        return;
      const t = {}, n = Hc(this);
      for (const r of this.$$s)
        r in n && (r === "default" && !this.$$d.children ? (this.$$d.children = e(r), t.default = !0) : t[r] = e(r));
      for (const r of this.attributes) {
        const i = this.$$g_p(r.name);
        i in this.$$d || (this.$$d[i] = Tn(i, r.value, this.$$p_d, "toProp"));
      }
      for (const r in this.$$p_d)
        !(r in this.$$d) && this[r] !== void 0 && (this.$$d[r] = this[r], delete this[r]);
      this.$$c = Mc({
        component: this.$$ctor,
        target: this.$$shadowRoot || this,
        props: {
          ...this.$$d,
          $$slots: t,
          $$host: this
        }
      }), this.$$me = vc(() => {
        hs(() => {
          this.$$r = !0;
          for (const r of Un(this.$$c)) {
            if (!this.$$p_d[r]?.reflect) continue;
            this.$$d[r] = this.$$c[r];
            const i = Tn(
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
    this.$$r || (e = this.$$g_p(e), this.$$d[e] = Tn(e, n, this.$$p_d, "toProp"), this.$$c?.$set({ [e]: this.$$d[e] }));
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
    return Un(this.$$p_d).find(
      (t) => this.$$p_d[t].attribute === e || !this.$$p_d[t].attribute && t.toLowerCase() === e
    ) || e;
  }
});
function Tn(e, t, n, r) {
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
function Hc(e) {
  const t = {};
  return e.childNodes.forEach((n) => {
    t[
      /** @type {Element} node */
      n.slot || "default"
    ] = !0;
  }), t;
}
function b0(e, t, n, r, i, o) {
  let s = class extends $s {
    constructor() {
      super(e, n, i), this.$$p_d = t;
    }
    static get observedAttributes() {
      return Un(t).map(
        (l) => (t[l].attribute || l).toLowerCase()
      );
    }
  };
  return Un(t).forEach((l) => {
    Mn(s.prototype, l, {
      get() {
        return this.$$c && l in this.$$c ? this.$$c[l] : this.$$d[l];
      },
      set(a) {
        a = Tn(l, a, t), this.$$d[l] = a;
        var u = this.$$c;
        if (u) {
          var f = Pt(u, l)?.get;
          f ? u[l] = a : u.$set({ [l]: a });
        }
      }
    });
  }), r.forEach((l) => {
    Mn(s.prototype, l, {
      get() {
        return this.$$c?.[l];
      }
    });
  }), e.element = /** @type {any} */
  s, s;
}
let Cs;
const Dc = "ehagaki.web-component.v1:", Ct = /* @__PURE__ */ new Map(), jc = {
  get length() {
    return Ct.size;
  },
  clear() {
    Ct.clear();
  },
  getItem(e) {
    return Ct.get(e) ?? null;
  },
  key(e) {
    return [...Ct.keys()][e] ?? null;
  },
  removeItem(e) {
    Ct.delete(e);
  },
  setItem(e, t) {
    Ct.set(e, String(t));
  }
};
function Vc() {
  if (typeof globalThis < "u") {
    const e = globalThis.localStorage;
    if (e)
      return e;
  }
  return jc;
}
function qc() {
  return Cs ?? Vc();
}
function Fc(e) {
  Cs = e;
}
function yr(e, t) {
  const n = [];
  for (let r = 0; r < e.length; r += 1) {
    const i = e.key(r);
    i?.startsWith(t) && n.push(i.slice(t.length));
  }
  return n;
}
function Kc(e, t) {
  return {
    get length() {
      return yr(e, t).length;
    },
    clear() {
      const n = yr(e, t);
      for (const r of n)
        e.removeItem(`${t}${r}`);
    },
    getItem(n) {
      return e.getItem(`${t}${n}`);
    },
    key(n) {
      return yr(e, t)[n] ?? null;
    },
    removeItem(n) {
      e.removeItem(`${t}${n}`);
    },
    setItem(n, r) {
      e.setItem(`${t}${n}`, String(r));
    }
  };
}
function Zc(e) {
  return Kc(
    e,
    Dc
  );
}
function Wc() {
  return {
    style: {
      setProperty: () => {
      },
      removeProperty: () => "",
      getPropertyValue: () => ""
    }
  };
}
function Gc() {
  const e = typeof window < "u" ? window : void 0, t = e?.document, n = t?.documentElement ?? Wc(), r = t?.body ?? n;
  return {
    storage: qc(),
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
let tn = Gc();
function Yc(e) {
  return tn = {
    ...tn,
    ...e
  }, Fc(tn.storage), tn;
}
function m0() {
  return tn;
}
function si(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function dt(e, t = "") {
  if (!Number.isSafeInteger(e) || e < 0) {
    const n = t && `"${t}" `;
    throw new Error(`${n}expected integer >= 0, got ${e}`);
  }
}
function H(e, t, n = "") {
  const r = si(e), i = e?.length, o = t !== void 0;
  if (!r || o && i !== t) {
    const s = n && `"${n}" `, l = o ? ` of length ${t}` : "", a = r ? `length=${i}` : `type=${typeof e}`;
    throw new Error(s + "expected Uint8Array" + l + ", got " + a);
  }
  return e;
}
function rr(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash must wrapped by utils.createHasher");
  dt(e.outputLen), dt(e.blockLen);
}
function qn(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function Xc(e, t) {
  H(e, void 0, "digestInto() output");
  const n = t.outputLen;
  if (e.length < n)
    throw new Error('"digestInto() output" expected to be of length >=' + n);
}
function cn(...e) {
  for (let t = 0; t < e.length; t++)
    e[t].fill(0);
}
function wr(e) {
  return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function Le(e, t) {
  return e << 32 - t | e >>> t;
}
const Ts = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", Jc = /* @__PURE__ */ Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function V(e) {
  if (H(e), Ts)
    return e.toHex();
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += Jc[e[n]];
  return t;
}
const He = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function ro(e) {
  if (e >= He._0 && e <= He._9)
    return e - He._0;
  if (e >= He.A && e <= He.F)
    return e - (He.A - 10);
  if (e >= He.a && e <= He.f)
    return e - (He.a - 10);
}
function G(e) {
  if (typeof e != "string")
    throw new Error("hex string expected, got " + typeof e);
  if (Ts)
    return Uint8Array.fromHex(e);
  const t = e.length, n = t / 2;
  if (t % 2)
    throw new Error("hex string expected, got unpadded hex of length " + t);
  const r = new Uint8Array(n);
  for (let i = 0, o = 0; i < n; i++, o += 2) {
    const s = ro(e.charCodeAt(o)), l = ro(e.charCodeAt(o + 1));
    if (s === void 0 || l === void 0) {
      const a = e[o] + e[o + 1];
      throw new Error('hex string expected, got non-hex character "' + a + '" at index ' + o);
    }
    r[i] = s * 16 + l;
  }
  return r;
}
function pe(...e) {
  let t = 0;
  for (let r = 0; r < e.length; r++) {
    const i = e[r];
    H(i), t += i.length;
  }
  const n = new Uint8Array(t);
  for (let r = 0, i = 0; r < e.length; r++) {
    const o = e[r];
    n.set(o, i), i += o.length;
  }
  return n;
}
function Qc(e, t = {}) {
  const n = (i, o) => e(o).update(i).digest(), r = e(void 0);
  return n.outputLen = r.outputLen, n.blockLen = r.blockLen, n.create = (i) => e(i), Object.assign(n, t), Object.freeze(n);
}
function Gt(e = 32) {
  const t = typeof globalThis == "object" ? globalThis.crypto : null;
  if (typeof t?.getRandomValues != "function")
    throw new Error("crypto.getRandomValues must be defined");
  return t.getRandomValues(new Uint8Array(e));
}
const eu = (e) => ({
  oid: Uint8Array.from([6, 9, 96, 134, 72, 1, 101, 3, 4, 2, e])
});
function tu(e, t, n) {
  return e & t ^ ~e & n;
}
function nu(e, t, n) {
  return e & t ^ e & n ^ t & n;
}
class ru {
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
    this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = i, this.buffer = new Uint8Array(t), this.view = wr(this.buffer);
  }
  update(t) {
    qn(this), H(t);
    const { view: n, buffer: r, blockLen: i } = this, o = t.length;
    for (let s = 0; s < o; ) {
      const l = Math.min(i - this.pos, o - s);
      if (l === i) {
        const a = wr(t);
        for (; i <= o - s; s += i)
          this.process(a, s);
        continue;
      }
      r.set(t.subarray(s, s + l), this.pos), this.pos += l, s += l, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    qn(this), Xc(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: o } = this;
    let { pos: s } = this;
    n[s++] = 128, cn(this.buffer.subarray(s)), this.padOffset > i - s && (this.process(r, 0), s = 0);
    for (let h = s; h < i; h++)
      n[h] = 0;
    r.setBigUint64(i - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const l = wr(t), a = this.outputLen;
    if (a % 4)
      throw new Error("_sha2: outputLen must be aligned to 32bit");
    const u = a / 4, f = this.get();
    if (u > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let h = 0; h < u; h++)
      l.setUint32(4 * h, f[h], o);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t ||= new this.constructor(), t.set(...this.get());
    const { blockLen: n, buffer: r, length: i, finished: o, destroyed: s, pos: l } = this;
    return t.destroyed = s, t.finished = o, t.length = i, t.pos = l, i % n && t.buffer.set(r), t;
  }
  clone() {
    return this._cloneInto();
  }
}
const et = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), iu = /* @__PURE__ */ Uint32Array.from([
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
]), tt = /* @__PURE__ */ new Uint32Array(64);
class ou extends ru {
  constructor(t) {
    super(64, t, 8, !1);
  }
  get() {
    const { A: t, B: n, C: r, D: i, E: o, F: s, G: l, H: a } = this;
    return [t, n, r, i, o, s, l, a];
  }
  // prettier-ignore
  set(t, n, r, i, o, s, l, a) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = i | 0, this.E = o | 0, this.F = s | 0, this.G = l | 0, this.H = a | 0;
  }
  process(t, n) {
    for (let h = 0; h < 16; h++, n += 4)
      tt[h] = t.getUint32(n, !1);
    for (let h = 16; h < 64; h++) {
      const w = tt[h - 15], y = tt[h - 2], c = Le(w, 7) ^ Le(w, 18) ^ w >>> 3, d = Le(y, 17) ^ Le(y, 19) ^ y >>> 10;
      tt[h] = d + tt[h - 7] + c + tt[h - 16] | 0;
    }
    let { A: r, B: i, C: o, D: s, E: l, F: a, G: u, H: f } = this;
    for (let h = 0; h < 64; h++) {
      const w = Le(l, 6) ^ Le(l, 11) ^ Le(l, 25), y = f + w + tu(l, a, u) + iu[h] + tt[h] | 0, d = (Le(r, 2) ^ Le(r, 13) ^ Le(r, 22)) + nu(r, i, o) | 0;
      f = u, u = a, a = l, l = s + y | 0, s = o, o = i, i = r, r = y + d | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, o = o + this.C | 0, s = s + this.D | 0, l = l + this.E | 0, a = a + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, i, o, s, l, a, u, f);
  }
  roundClean() {
    cn(tt);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), cn(this.buffer);
  }
}
class su extends ou {
  // We cannot use array here since array allows indexing by variable
  // which means optimizer/compiler cannot use registers.
  A = et[0] | 0;
  B = et[1] | 0;
  C = et[2] | 0;
  D = et[3] | 0;
  E = et[4] | 0;
  F = et[5] | 0;
  G = et[6] | 0;
  H = et[7] | 0;
  constructor() {
    super(32);
  }
}
const Me = /* @__PURE__ */ Qc(
  () => new su(),
  /* @__PURE__ */ eu(1)
);
const ai = /* @__PURE__ */ BigInt(0), Hr = /* @__PURE__ */ BigInt(1);
function Fn(e, t = "") {
  if (typeof e != "boolean") {
    const n = t && `"${t}" `;
    throw new Error(n + "expected boolean, got type=" + typeof e);
  }
  return e;
}
function Ls(e) {
  if (typeof e == "bigint") {
    if (!Ln(e))
      throw new Error("positive bigint expected, got " + e);
  } else
    dt(e);
  return e;
}
function xn(e) {
  const t = Ls(e).toString(16);
  return t.length & 1 ? "0" + t : t;
}
function Os(e) {
  if (typeof e != "string")
    throw new Error("hex string expected, got " + typeof e);
  return e === "" ? ai : BigInt("0x" + e);
}
function yn(e) {
  return Os(V(e));
}
function Ps(e) {
  return Os(V(au(H(e)).reverse()));
}
function li(e, t) {
  dt(t), e = Ls(e);
  const n = G(e.toString(16).padStart(t * 2, "0"));
  if (n.length !== t)
    throw new Error("number too large");
  return n;
}
function Bs(e, t) {
  return li(e, t).reverse();
}
function au(e) {
  return Uint8Array.from(e);
}
function lu(e) {
  return Uint8Array.from(e, (t, n) => {
    const r = t.charCodeAt(0);
    if (t.length !== 1 || r > 127)
      throw new Error(`string contains non-ASCII character "${e[n]}" with code ${r} at position ${n}`);
    return r;
  });
}
const Ln = (e) => typeof e == "bigint" && ai <= e;
function cu(e, t, n) {
  return Ln(e) && Ln(t) && Ln(n) && t <= e && e < n;
}
function uu(e, t, n, r) {
  if (!cu(t, n, r))
    throw new Error("expected valid " + e + ": " + n + " <= n < " + r + ", got " + t);
}
function fu(e) {
  let t;
  for (t = 0; e > ai; e >>= Hr, t += 1)
    ;
  return t;
}
const ci = (e) => (Hr << BigInt(e)) - Hr;
function du(e, t, n) {
  if (dt(e, "hashLen"), dt(t, "qByteLen"), typeof n != "function")
    throw new Error("hmacFn must be a function");
  const r = (g) => new Uint8Array(g), i = Uint8Array.of(), o = Uint8Array.of(0), s = Uint8Array.of(1), l = 1e3;
  let a = r(e), u = r(e), f = 0;
  const h = () => {
    a.fill(1), u.fill(0), f = 0;
  }, w = (...g) => n(u, pe(a, ...g)), y = (g = i) => {
    u = w(o, g), a = w(), g.length !== 0 && (u = w(s, g), a = w());
  }, c = () => {
    if (f++ >= l)
      throw new Error("drbg: tried max amount of iterations");
    let g = 0;
    const p = [];
    for (; g < t; ) {
      a = w();
      const v = a.slice();
      p.push(v), g += a.length;
    }
    return pe(...p);
  };
  return (g, p) => {
    h(), y(g);
    let v;
    for (; !(v = p(c())); )
      y();
    return h(), v;
  };
}
function ui(e, t = {}, n = {}) {
  if (!e || typeof e != "object")
    throw new Error("expected valid options object");
  function r(o, s, l) {
    const a = e[o];
    if (l && a === void 0)
      return;
    const u = typeof a;
    if (u !== s || a === null)
      throw new Error(`param "${o}" is invalid: expected ${s}, got ${u}`);
  }
  const i = (o, s) => Object.entries(o).forEach(([l, a]) => r(l, a, s));
  i(t, !1), i(n, !0);
}
function io(e) {
  const t = /* @__PURE__ */ new WeakMap();
  return (n, ...r) => {
    const i = t.get(n);
    if (i !== void 0)
      return i;
    const o = e(n, ...r);
    return t.set(n, o), o;
  };
}
const ge = /* @__PURE__ */ BigInt(0), ue = /* @__PURE__ */ BigInt(1), bt = /* @__PURE__ */ BigInt(2), Ns = /* @__PURE__ */ BigInt(3), Us = /* @__PURE__ */ BigInt(4), Ms = /* @__PURE__ */ BigInt(5), hu = /* @__PURE__ */ BigInt(7), zs = /* @__PURE__ */ BigInt(8), pu = /* @__PURE__ */ BigInt(9), Hs = /* @__PURE__ */ BigInt(16);
function Ae(e, t) {
  const n = e % t;
  return n >= ge ? n : t + n;
}
function we(e, t, n) {
  let r = e;
  for (; t-- > ge; )
    r *= r, r %= n;
  return r;
}
function oo(e, t) {
  if (e === ge)
    throw new Error("invert: expected non-zero number");
  if (t <= ge)
    throw new Error("invert: expected positive modulus, got " + t);
  let n = Ae(e, t), r = t, i = ge, o = ue;
  for (; n !== ge; ) {
    const l = r / n, a = r % n, u = i - o * l;
    r = n, n = a, i = o, o = u;
  }
  if (r !== ue)
    throw new Error("invert: does not exist");
  return Ae(i, t);
}
function fi(e, t, n) {
  if (!e.eql(e.sqr(t), n))
    throw new Error("Cannot find square root");
}
function Ds(e, t) {
  const n = (e.ORDER + ue) / Us, r = e.pow(t, n);
  return fi(e, r, t), r;
}
function gu(e, t) {
  const n = (e.ORDER - Ms) / zs, r = e.mul(t, bt), i = e.pow(r, n), o = e.mul(t, i), s = e.mul(e.mul(o, bt), i), l = e.mul(o, e.sub(s, e.ONE));
  return fi(e, l, t), l;
}
function yu(e) {
  const t = ir(e), n = js(e), r = n(t, t.neg(t.ONE)), i = n(t, r), o = n(t, t.neg(r)), s = (e + hu) / Hs;
  return (l, a) => {
    let u = l.pow(a, s), f = l.mul(u, r);
    const h = l.mul(u, i), w = l.mul(u, o), y = l.eql(l.sqr(f), a), c = l.eql(l.sqr(h), a);
    u = l.cmov(u, f, y), f = l.cmov(w, h, c);
    const d = l.eql(l.sqr(f), a), g = l.cmov(u, f, d);
    return fi(l, g, a), g;
  };
}
function js(e) {
  if (e < Ns)
    throw new Error("sqrt is not defined for small field");
  let t = e - ue, n = 0;
  for (; t % bt === ge; )
    t /= bt, n++;
  let r = bt;
  const i = ir(e);
  for (; so(i, r) === 1; )
    if (r++ > 1e3)
      throw new Error("Cannot find square root: probably non-prime P");
  if (n === 1)
    return Ds;
  let o = i.pow(r, t);
  const s = (t + ue) / bt;
  return function(a, u) {
    if (a.is0(u))
      return u;
    if (so(a, u) !== 1)
      throw new Error("Cannot find square root");
    let f = n, h = a.mul(a.ONE, o), w = a.pow(u, t), y = a.pow(u, s);
    for (; !a.eql(w, a.ONE); ) {
      if (a.is0(w))
        return a.ZERO;
      let c = 1, d = a.sqr(w);
      for (; !a.eql(d, a.ONE); )
        if (c++, d = a.sqr(d), c === f)
          throw new Error("Cannot find square root");
      const g = ue << BigInt(f - c - 1), p = a.pow(h, g);
      f = c, h = a.sqr(p), w = a.mul(w, h), y = a.mul(y, p);
    }
    return y;
  };
}
function wu(e) {
  return e % Us === Ns ? Ds : e % zs === Ms ? gu : e % Hs === pu ? yu(e) : js(e);
}
const vu = [
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
function bu(e) {
  const t = {
    ORDER: "bigint",
    BYTES: "number",
    BITS: "number"
  }, n = vu.reduce((r, i) => (r[i] = "function", r), t);
  return ui(e, n), e;
}
function mu(e, t, n) {
  if (n < ge)
    throw new Error("invalid exponent, negatives unsupported");
  if (n === ge)
    return e.ONE;
  if (n === ue)
    return t;
  let r = e.ONE, i = t;
  for (; n > ge; )
    n & ue && (r = e.mul(r, i)), i = e.sqr(i), n >>= ue;
  return r;
}
function Vs(e, t, n = !1) {
  const r = new Array(t.length).fill(n ? e.ZERO : void 0), i = t.reduce((s, l, a) => e.is0(l) ? s : (r[a] = s, e.mul(s, l)), e.ONE), o = e.inv(i);
  return t.reduceRight((s, l, a) => e.is0(l) ? s : (r[a] = e.mul(s, r[a]), e.mul(s, l)), o), r;
}
function so(e, t) {
  const n = (e.ORDER - ue) / bt, r = e.pow(t, n), i = e.eql(r, e.ONE), o = e.eql(r, e.ZERO), s = e.eql(r, e.neg(e.ONE));
  if (!i && !o && !s)
    throw new Error("invalid Legendre symbol result");
  return i ? 1 : o ? 0 : -1;
}
function _u(e, t) {
  t !== void 0 && dt(t);
  const n = t !== void 0 ? t : e.toString(2).length, r = Math.ceil(n / 8);
  return { nBitLength: n, nByteLength: r };
}
class Eu {
  ORDER;
  BITS;
  BYTES;
  isLE;
  ZERO = ge;
  ONE = ue;
  _lengths;
  _sqrt;
  // cached sqrt
  _mod;
  constructor(t, n = {}) {
    if (t <= ge)
      throw new Error("invalid field: expected ORDER > 0, got " + t);
    let r;
    this.isLE = !1, n != null && typeof n == "object" && (typeof n.BITS == "number" && (r = n.BITS), typeof n.sqrt == "function" && (this.sqrt = n.sqrt), typeof n.isLE == "boolean" && (this.isLE = n.isLE), n.allowedLengths && (this._lengths = n.allowedLengths?.slice()), typeof n.modFromBytes == "boolean" && (this._mod = n.modFromBytes));
    const { nBitLength: i, nByteLength: o } = _u(t, r);
    if (o > 2048)
      throw new Error("invalid field: expected ORDER of <= 2048 bytes");
    this.ORDER = t, this.BITS = i, this.BYTES = o, this._sqrt = void 0, Object.preventExtensions(this);
  }
  create(t) {
    return Ae(t, this.ORDER);
  }
  isValid(t) {
    if (typeof t != "bigint")
      throw new Error("invalid field element: expected bigint, got " + typeof t);
    return ge <= t && t < this.ORDER;
  }
  is0(t) {
    return t === ge;
  }
  // is valid and invertible
  isValidNot0(t) {
    return !this.is0(t) && this.isValid(t);
  }
  isOdd(t) {
    return (t & ue) === ue;
  }
  neg(t) {
    return Ae(-t, this.ORDER);
  }
  eql(t, n) {
    return t === n;
  }
  sqr(t) {
    return Ae(t * t, this.ORDER);
  }
  add(t, n) {
    return Ae(t + n, this.ORDER);
  }
  sub(t, n) {
    return Ae(t - n, this.ORDER);
  }
  mul(t, n) {
    return Ae(t * n, this.ORDER);
  }
  pow(t, n) {
    return mu(this, t, n);
  }
  div(t, n) {
    return Ae(t * oo(n, this.ORDER), this.ORDER);
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
    return oo(t, this.ORDER);
  }
  sqrt(t) {
    return this._sqrt || (this._sqrt = wu(this.ORDER)), this._sqrt(this, t);
  }
  toBytes(t) {
    return this.isLE ? Bs(t, this.BYTES) : li(t, this.BYTES);
  }
  fromBytes(t, n = !1) {
    H(t);
    const { _lengths: r, BYTES: i, isLE: o, ORDER: s, _mod: l } = this;
    if (r) {
      if (!r.includes(t.length) || t.length > i)
        throw new Error("Field.fromBytes: expected " + r + " bytes, got " + t.length);
      const u = new Uint8Array(i);
      u.set(t, o ? 0 : u.length - t.length), t = u;
    }
    if (t.length !== i)
      throw new Error("Field.fromBytes: expected " + i + " bytes, got " + t.length);
    let a = o ? Ps(t) : yn(t);
    if (l && (a = Ae(a, s)), !n && !this.isValid(a))
      throw new Error("invalid field element: outside of range 0..ORDER");
    return a;
  }
  // TODO: we don't need it here, move out to separate fn
  invertBatch(t) {
    return Vs(this, t);
  }
  // We can't move this out because Fp6, Fp12 implement it
  // and it's unclear what to return in there.
  cmov(t, n, r) {
    return r ? n : t;
  }
}
function ir(e, t = {}) {
  return new Eu(e, t);
}
function qs(e) {
  if (typeof e != "bigint")
    throw new Error("field order must be bigint");
  const t = e.toString(2).length;
  return Math.ceil(t / 8);
}
function Fs(e) {
  const t = qs(e);
  return t + Math.ceil(t / 2);
}
function Ks(e, t, n = !1) {
  H(e);
  const r = e.length, i = qs(t), o = Fs(t);
  if (r < 16 || r < o || r > 1024)
    throw new Error("expected " + o + "-1024 bytes of input, got " + r);
  const s = n ? Ps(e) : yn(e), l = Ae(s, t - ue) + ue;
  return n ? Bs(l, i) : li(l, i);
}
const Kt = /* @__PURE__ */ BigInt(0), mt = /* @__PURE__ */ BigInt(1);
function Kn(e, t) {
  const n = t.negate();
  return e ? n : t;
}
function ao(e, t) {
  const n = Vs(e.Fp, t.map((r) => r.Z));
  return t.map((r, i) => e.fromAffine(r.toAffine(n[i])));
}
function Zs(e, t) {
  if (!Number.isSafeInteger(e) || e <= 0 || e > t)
    throw new Error("invalid window size, expected [1.." + t + "], got W=" + e);
}
function vr(e, t) {
  Zs(e, t);
  const n = Math.ceil(t / e) + 1, r = 2 ** (e - 1), i = 2 ** e, o = ci(e), s = BigInt(e);
  return { windows: n, windowSize: r, mask: o, maxNumber: i, shiftBy: s };
}
function lo(e, t, n) {
  const { windowSize: r, mask: i, maxNumber: o, shiftBy: s } = n;
  let l = Number(e & i), a = e >> s;
  l > r && (l -= o, a += mt);
  const u = t * r, f = u + Math.abs(l) - 1, h = l === 0, w = l < 0, y = t % 2 !== 0;
  return { nextN: a, offset: f, isZero: h, isNeg: w, isNegF: y, offsetF: u };
}
const br = /* @__PURE__ */ new WeakMap(), Ws = /* @__PURE__ */ new WeakMap();
function mr(e) {
  return Ws.get(e) || 1;
}
function co(e) {
  if (e !== Kt)
    throw new Error("invalid wNAF");
}
class xu {
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
    for (; n > Kt; )
      n & mt && (r = r.add(i)), i = i.double(), n >>= mt;
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
    const { windows: r, windowSize: i } = vr(n, this.bits), o = [];
    let s = t, l = s;
    for (let a = 0; a < r; a++) {
      l = s, o.push(l);
      for (let u = 1; u < i; u++)
        l = l.add(s), o.push(l);
      s = l.double();
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
    const s = vr(t, this.bits);
    for (let l = 0; l < s.windows; l++) {
      const { nextN: a, offset: u, isZero: f, isNeg: h, isNegF: w, offsetF: y } = lo(r, l, s);
      r = a, f ? o = o.add(Kn(w, n[y])) : i = i.add(Kn(h, n[u]));
    }
    return co(r), { p: i, f: o };
  }
  /**
   * Implements ec unsafe (non const-time) multiplication using precomputed tables and w-ary non-adjacent form.
   * @param acc accumulator point to add result of multiplication
   * @returns point
   */
  wNAFUnsafe(t, n, r, i = this.ZERO) {
    const o = vr(t, this.bits);
    for (let s = 0; s < o.windows && r !== Kt; s++) {
      const { nextN: l, offset: a, isZero: u, isNeg: f } = lo(r, s, o);
      if (r = l, !u) {
        const h = n[a];
        i = i.add(f ? h.negate() : h);
      }
    }
    return co(r), i;
  }
  getPrecomputes(t, n, r) {
    let i = br.get(n);
    return i || (i = this.precomputeWindow(n, t), t !== 1 && (typeof r == "function" && (i = r(i)), br.set(n, i))), i;
  }
  cached(t, n, r) {
    const i = mr(t);
    return this.wNAF(i, this.getPrecomputes(i, t, r), n);
  }
  unsafe(t, n, r, i) {
    const o = mr(t);
    return o === 1 ? this._unsafeLadder(t, n, i) : this.wNAFUnsafe(o, this.getPrecomputes(o, t, r), n, i);
  }
  // We calculate precomputes for elliptic curve point multiplication
  // using windowed method. This specifies window size and
  // stores precomputed values. Usually only base point would be precomputed.
  createCache(t, n) {
    Zs(n, this.bits), Ws.set(t, n), br.delete(t);
  }
  hasCache(t) {
    return mr(t) !== 1;
  }
}
function ku(e, t, n, r) {
  let i = t, o = e.ZERO, s = e.ZERO;
  for (; n > Kt || r > Kt; )
    n & mt && (o = o.add(i)), r & mt && (s = s.add(i)), i = i.double(), n >>= mt, r >>= mt;
  return { p1: o, p2: s };
}
function uo(e, t, n) {
  if (t) {
    if (t.ORDER !== e)
      throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
    return bu(t), t;
  } else
    return ir(e, { isLE: n });
}
function Au(e, t, n = {}, r) {
  if (r === void 0 && (r = e === "edwards"), !t || typeof t != "object")
    throw new Error(`expected valid ${e} CURVE object`);
  for (const a of ["p", "n", "h"]) {
    const u = t[a];
    if (!(typeof u == "bigint" && u > Kt))
      throw new Error(`CURVE.${a} must be positive bigint`);
  }
  const i = uo(t.p, n.Fp, r), o = uo(t.n, n.Fn, r), l = ["Gx", "Gy", "a", "b"];
  for (const a of l)
    if (!i.isValid(t[a]))
      throw new Error(`CURVE.${a} must be valid field element of CURVE.Fp`);
  return t = Object.freeze(Object.assign({}, t)), { CURVE: t, Fp: i, Fn: o };
}
function Gs(e, t) {
  return function(r) {
    const i = e(r);
    return { secretKey: i, publicKey: t(i) };
  };
}
class Ys {
  oHash;
  iHash;
  blockLen;
  outputLen;
  finished = !1;
  destroyed = !1;
  constructor(t, n) {
    if (rr(t), H(n, void 0, "key"), this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const r = this.blockLen, i = new Uint8Array(r);
    i.set(n.length > r ? t.create().update(n).digest() : n);
    for (let o = 0; o < i.length; o++)
      i[o] ^= 54;
    this.iHash.update(i), this.oHash = t.create();
    for (let o = 0; o < i.length; o++)
      i[o] ^= 106;
    this.oHash.update(i), cn(i);
  }
  update(t) {
    return qn(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    qn(this), H(t, this.outputLen, "output"), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t ||= Object.create(Object.getPrototypeOf(this), {});
    const { oHash: n, iHash: r, finished: i, destroyed: o, blockLen: s, outputLen: l } = this;
    return t = t, t.finished = i, t.destroyed = o, t.blockLen = s, t.outputLen = l, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  clone() {
    return this._cloneInto();
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const wn = (e, t, n) => new Ys(e, t).update(n).digest();
wn.create = (e, t) => new Ys(e, t);
const fo = (e, t) => (e + (e >= 0 ? t : -t) / Xs) / t;
function Iu(e, t, n) {
  const [[r, i], [o, s]] = t, l = fo(s * e, n), a = fo(-i * e, n);
  let u = e - l * r - a * o, f = -l * i - a * s;
  const h = u < Fe, w = f < Fe;
  h && (u = -u), w && (f = -f);
  const y = ci(Math.ceil(fu(n) / 2)) + Nt;
  if (u < Fe || u >= y || f < Fe || f >= y)
    throw new Error("splitScalar (endomorphism): failed, k=" + e);
  return { k1neg: h, k1: u, k2neg: w, k2: f };
}
function Dr(e) {
  if (!["compact", "recovered", "der"].includes(e))
    throw new Error('Signature format must be "compact", "recovered", or "der"');
  return e;
}
function _r(e, t) {
  const n = {};
  for (let r of Object.keys(t))
    n[r] = e[r] === void 0 ? t[r] : e[r];
  return Fn(n.lowS, "lowS"), Fn(n.prehash, "prehash"), n.format !== void 0 && Dr(n.format), n;
}
class Ru extends Error {
  constructor(t = "") {
    super(t);
  }
}
const rt = {
  // asn.1 DER encoding utils
  Err: Ru,
  // Basic building block is TLV (Tag-Length-Value)
  _tlv: {
    encode: (e, t) => {
      const { Err: n } = rt;
      if (e < 0 || e > 256)
        throw new n("tlv.encode: wrong tag");
      if (t.length & 1)
        throw new n("tlv.encode: unpadded data");
      const r = t.length / 2, i = xn(r);
      if (i.length / 2 & 128)
        throw new n("tlv.encode: long form length too big");
      const o = r > 127 ? xn(i.length / 2 | 128) : "";
      return xn(e) + o + i + t;
    },
    // v - value, l - left bytes (unparsed)
    decode(e, t) {
      const { Err: n } = rt;
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
      const l = t.subarray(r, r + s);
      if (l.length !== s)
        throw new n("tlv.decode: wrong value length");
      return { v: l, l: t.subarray(r + s) };
    }
  },
  // https://crypto.stackexchange.com/a/57734 Leftmost bit of first byte is 'negative' flag,
  // since we always use positive integers here. It must always be empty:
  // - add zero byte if exists
  // - if next byte doesn't have a flag, leading zero is not allowed (minimal encoding)
  _int: {
    encode(e) {
      const { Err: t } = rt;
      if (e < Fe)
        throw new t("integer: negative integers are not allowed");
      let n = xn(e);
      if (Number.parseInt(n[0], 16) & 8 && (n = "00" + n), n.length & 1)
        throw new t("unexpected DER parsing assertion: unpadded hex");
      return n;
    },
    decode(e) {
      const { Err: t } = rt;
      if (e[0] & 128)
        throw new t("invalid signature integer: negative");
      if (e[0] === 0 && !(e[1] & 128))
        throw new t("invalid signature integer: unnecessary leading zero");
      return yn(e);
    }
  },
  toSig(e) {
    const { Err: t, _int: n, _tlv: r } = rt, i = H(e, void 0, "signature"), { v: o, l: s } = r.decode(48, i);
    if (s.length)
      throw new t("invalid signature: left bytes after parsing");
    const { v: l, l: a } = r.decode(2, o), { v: u, l: f } = r.decode(2, a);
    if (f.length)
      throw new t("invalid signature: left bytes after parsing");
    return { r: n.decode(l), s: n.decode(u) };
  },
  hexFromSig(e) {
    const { _tlv: t, _int: n } = rt, r = t.encode(2, n.encode(e.r)), i = t.encode(2, n.encode(e.s)), o = r + i;
    return t.encode(48, o);
  }
}, Fe = BigInt(0), Nt = BigInt(1), Xs = BigInt(2), kn = BigInt(3), Su = BigInt(4);
function $u(e, t = {}) {
  const n = Au("weierstrass", e, t), { Fp: r, Fn: i } = n;
  let o = n.CURVE;
  const { h: s, n: l } = o;
  ui(t, {}, {
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
  const u = Qs(r, i);
  function f() {
    if (!r.isOdd)
      throw new Error("compression is not supported: Field does not have .isOdd()");
  }
  function h(L, E, _) {
    const { x: m, y: x } = E.toAffine(), A = r.toBytes(m);
    if (Fn(_, "isCompressed"), _) {
      f();
      const R = !r.isOdd(x);
      return pe(Js(R), A);
    } else
      return pe(Uint8Array.of(4), A, r.toBytes(x));
  }
  function w(L) {
    H(L, void 0, "Point");
    const { publicKey: E, publicKeyUncompressed: _ } = u, m = L.length, x = L[0], A = L.subarray(1);
    if (m === E && (x === 2 || x === 3)) {
      const R = r.fromBytes(A);
      if (!r.isValid(R))
        throw new Error("bad point: is not on curve, wrong x");
      const I = d(R);
      let k;
      try {
        k = r.sqrt(I);
      } catch (F) {
        const j = F instanceof Error ? ": " + F.message : "";
        throw new Error("bad point: is not on curve, sqrt error" + j);
      }
      f();
      const S = r.isOdd(k);
      return (x & 1) === 1 !== S && (k = r.neg(k)), { x: R, y: k };
    } else if (m === _ && x === 4) {
      const R = r.BYTES, I = r.fromBytes(A.subarray(0, R)), k = r.fromBytes(A.subarray(R, R * 2));
      if (!g(I, k))
        throw new Error("bad point: is not on curve");
      return { x: I, y: k };
    } else
      throw new Error(`bad point: got length ${m}, expected compressed=${E} or uncompressed=${_}`);
  }
  const y = t.toBytes || h, c = t.fromBytes || w;
  function d(L) {
    const E = r.sqr(L), _ = r.mul(E, L);
    return r.add(r.add(_, r.mul(L, o.a)), o.b);
  }
  function g(L, E) {
    const _ = r.sqr(E), m = d(L);
    return r.eql(_, m);
  }
  if (!g(o.Gx, o.Gy))
    throw new Error("bad curve params: generator point");
  const p = r.mul(r.pow(o.a, kn), Su), v = r.mul(r.sqr(o.b), BigInt(27));
  if (r.is0(r.add(p, v)))
    throw new Error("bad curve params: a or b");
  function b(L, E, _ = !1) {
    if (!r.isValid(E) || _ && r.is0(E))
      throw new Error(`bad point coordinate ${L}`);
    return E;
  }
  function C(L) {
    if (!(L instanceof T))
      throw new Error("Weierstrass Point expected");
  }
  function ae(L) {
    if (!a || !a.basises)
      throw new Error("no endo");
    return Iu(L, a.basises, i.ORDER);
  }
  const z = io((L, E) => {
    const { X: _, Y: m, Z: x } = L;
    if (r.eql(x, r.ONE))
      return { x: _, y: m };
    const A = L.is0();
    E == null && (E = A ? r.ONE : r.inv(x));
    const R = r.mul(_, E), I = r.mul(m, E), k = r.mul(x, E);
    if (A)
      return { x: r.ZERO, y: r.ZERO };
    if (!r.eql(k, r.ONE))
      throw new Error("invZ was invalid");
    return { x: R, y: I };
  }), q = io((L) => {
    if (L.is0()) {
      if (t.allowInfinityPoint && !r.is0(L.Y))
        return;
      throw new Error("bad point: ZERO");
    }
    const { x: E, y: _ } = L.toAffine();
    if (!r.isValid(E) || !r.isValid(_))
      throw new Error("bad point: x or y not field elements");
    if (!g(E, _))
      throw new Error("bad point: equation left != right");
    if (!L.isTorsionFree())
      throw new Error("bad point: not in prime-order subgroup");
    return !0;
  });
  function Y(L, E, _, m, x) {
    return _ = new T(r.mul(_.X, L), _.Y, _.Z), E = Kn(m, E), _ = Kn(x, _), E.add(_);
  }
  class T {
    // base / generator point
    static BASE = new T(o.Gx, o.Gy, r.ONE);
    // zero / infinity / identity point
    static ZERO = new T(r.ZERO, r.ONE, r.ZERO);
    // 0, 1, 0
    // math field
    static Fp = r;
    // scalar field
    static Fn = i;
    X;
    Y;
    Z;
    /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
    constructor(E, _, m) {
      this.X = b("x", E), this.Y = b("y", _, !0), this.Z = b("z", m), Object.freeze(this);
    }
    static CURVE() {
      return o;
    }
    /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
    static fromAffine(E) {
      const { x: _, y: m } = E || {};
      if (!E || !r.isValid(_) || !r.isValid(m))
        throw new Error("invalid affine point");
      if (E instanceof T)
        throw new Error("projective point not allowed");
      return r.is0(_) && r.is0(m) ? T.ZERO : new T(_, m, r.ONE);
    }
    static fromBytes(E) {
      const _ = T.fromAffine(c(H(E, void 0, "point")));
      return _.assertValidity(), _;
    }
    static fromHex(E) {
      return T.fromBytes(G(E));
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
      return X.createCache(this, E), _ || this.multiply(kn), this;
    }
    // TODO: return `this`
    /** A point on curve is valid if it conforms to equation. */
    assertValidity() {
      q(this);
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
      const { X: _, Y: m, Z: x } = this, { X: A, Y: R, Z: I } = E, k = r.eql(r.mul(_, I), r.mul(A, x)), S = r.eql(r.mul(m, I), r.mul(R, x));
      return k && S;
    }
    /** Flips point to one corresponding to (x, -y) in Affine coordinates. */
    negate() {
      return new T(this.X, r.neg(this.Y), this.Z);
    }
    // Renes-Costello-Batina exception-free doubling formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 3
    // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
    double() {
      const { a: E, b: _ } = o, m = r.mul(_, kn), { X: x, Y: A, Z: R } = this;
      let I = r.ZERO, k = r.ZERO, S = r.ZERO, $ = r.mul(x, x), F = r.mul(A, A), j = r.mul(R, R), B = r.mul(x, A);
      return B = r.add(B, B), S = r.mul(x, R), S = r.add(S, S), I = r.mul(E, S), k = r.mul(m, j), k = r.add(I, k), I = r.sub(F, k), k = r.add(F, k), k = r.mul(I, k), I = r.mul(B, I), S = r.mul(m, S), j = r.mul(E, j), B = r.sub($, j), B = r.mul(E, B), B = r.add(B, S), S = r.add($, $), $ = r.add(S, $), $ = r.add($, j), $ = r.mul($, B), k = r.add(k, $), j = r.mul(A, R), j = r.add(j, j), $ = r.mul(j, B), I = r.sub(I, $), S = r.mul(j, F), S = r.add(S, S), S = r.add(S, S), new T(I, k, S);
    }
    // Renes-Costello-Batina exception-free addition formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 1
    // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
    add(E) {
      C(E);
      const { X: _, Y: m, Z: x } = this, { X: A, Y: R, Z: I } = E;
      let k = r.ZERO, S = r.ZERO, $ = r.ZERO;
      const F = o.a, j = r.mul(o.b, kn);
      let B = r.mul(_, A), K = r.mul(m, R), ne = r.mul(x, I), Te = r.add(_, m), Z = r.add(A, R);
      Te = r.mul(Te, Z), Z = r.add(B, K), Te = r.sub(Te, Z), Z = r.add(_, x);
      let oe = r.add(A, I);
      return Z = r.mul(Z, oe), oe = r.add(B, ne), Z = r.sub(Z, oe), oe = r.add(m, x), k = r.add(R, I), oe = r.mul(oe, k), k = r.add(K, ne), oe = r.sub(oe, k), $ = r.mul(F, Z), k = r.mul(j, ne), $ = r.add(k, $), k = r.sub(K, $), $ = r.add(K, $), S = r.mul(k, $), K = r.add(B, B), K = r.add(K, B), ne = r.mul(F, ne), Z = r.mul(j, Z), K = r.add(K, ne), ne = r.sub(B, ne), ne = r.mul(F, ne), Z = r.add(Z, ne), B = r.mul(K, Z), S = r.add(S, B), B = r.mul(oe, Z), k = r.mul(Te, k), k = r.sub(k, B), B = r.mul(Te, K), $ = r.mul(oe, $), $ = r.add($, B), new T(k, S, $);
    }
    subtract(E) {
      return this.add(E.negate());
    }
    is0() {
      return this.equals(T.ZERO);
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
      let m, x;
      const A = (R) => X.cached(this, R, (I) => ao(T, I));
      if (_) {
        const { k1neg: R, k1: I, k2neg: k, k2: S } = ae(E), { p: $, f: F } = A(I), { p: j, f: B } = A(S);
        x = F.add(B), m = Y(_.beta, $, j, R, k);
      } else {
        const { p: R, f: I } = A(E);
        m = R, x = I;
      }
      return ao(T, [m, x])[0];
    }
    /**
     * Non-constant-time multiplication. Uses double-and-add algorithm.
     * It's faster, but should only be used when you don't care about
     * an exposed secret key e.g. sig verification, which works over *public* keys.
     */
    multiplyUnsafe(E) {
      const { endo: _ } = t, m = this;
      if (!i.isValid(E))
        throw new Error("invalid scalar: out of range");
      if (E === Fe || m.is0())
        return T.ZERO;
      if (E === Nt)
        return m;
      if (X.hasCache(this))
        return this.multiply(E);
      if (_) {
        const { k1neg: x, k1: A, k2neg: R, k2: I } = ae(E), { p1: k, p2: S } = ku(T, m, A, I);
        return Y(_.beta, k, S, x, R);
      } else
        return X.unsafe(m, E);
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
      return s === Nt ? !0 : E ? E(T, this) : X.unsafe(this, l).is0();
    }
    clearCofactor() {
      const { clearCofactor: E } = t;
      return s === Nt ? this : E ? E(T, this) : this.multiplyUnsafe(s);
    }
    isSmallOrder() {
      return this.multiplyUnsafe(s).is0();
    }
    toBytes(E = !0) {
      return Fn(E, "isCompressed"), this.assertValidity(), y(T, this, E);
    }
    toHex(E = !0) {
      return V(this.toBytes(E));
    }
    toString() {
      return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
    }
  }
  const ee = i.BITS, X = new xu(T, t.endo ? Math.ceil(ee / 2) : ee);
  return T.BASE.precompute(8), T;
}
function Js(e) {
  return Uint8Array.of(e ? 2 : 3);
}
function Qs(e, t) {
  return {
    secretKey: t.BYTES,
    publicKey: 1 + e.BYTES,
    publicKeyUncompressed: 1 + 2 * e.BYTES,
    publicKeyHasPrefix: !0,
    signature: 2 * t.BYTES
  };
}
function Cu(e, t = {}) {
  const { Fn: n } = e, r = t.randomBytes || Gt, i = Object.assign(Qs(e.Fp, n), { seed: Fs(n.ORDER) });
  function o(y) {
    try {
      const c = n.fromBytes(y);
      return n.isValidNot0(c);
    } catch {
      return !1;
    }
  }
  function s(y, c) {
    const { publicKey: d, publicKeyUncompressed: g } = i;
    try {
      const p = y.length;
      return c === !0 && p !== d || c === !1 && p !== g ? !1 : !!e.fromBytes(y);
    } catch {
      return !1;
    }
  }
  function l(y = r(i.seed)) {
    return Ks(H(y, i.seed, "seed"), n.ORDER);
  }
  function a(y, c = !0) {
    return e.BASE.multiply(n.fromBytes(y)).toBytes(c);
  }
  function u(y) {
    const { secretKey: c, publicKey: d, publicKeyUncompressed: g } = i;
    if (!si(y) || "_lengths" in n && n._lengths || c === d)
      return;
    const p = H(y, void 0, "key").length;
    return p === d || p === g;
  }
  function f(y, c, d = !0) {
    if (u(y) === !0)
      throw new Error("first arg must be private key");
    if (u(c) === !1)
      throw new Error("second arg must be public key");
    const g = n.fromBytes(y);
    return e.fromBytes(c).multiply(g).toBytes(d);
  }
  const h = {
    isValidSecretKey: o,
    isValidPublicKey: s,
    randomSecretKey: l
  }, w = Gs(l, a);
  return Object.freeze({ getPublicKey: a, getSharedSecret: f, keygen: w, Point: e, utils: h, lengths: i });
}
function Tu(e, t, n = {}) {
  rr(t), ui(n, {}, {
    hmac: "function",
    lowS: "boolean",
    randomBytes: "function",
    bits2int: "function",
    bits2int_modN: "function"
  }), n = Object.assign({}, n);
  const r = n.randomBytes || Gt, i = n.hmac || ((_, m) => wn(t, _, m)), { Fp: o, Fn: s } = e, { ORDER: l, BITS: a } = s, { keygen: u, getPublicKey: f, getSharedSecret: h, utils: w, lengths: y } = Cu(e, n), c = {
    prehash: !0,
    lowS: typeof n.lowS == "boolean" ? n.lowS : !0,
    format: "compact",
    extraEntropy: !1
  }, d = l * Xs < o.ORDER;
  function g(_) {
    const m = l >> Nt;
    return _ > m;
  }
  function p(_, m) {
    if (!s.isValidNot0(m))
      throw new Error(`invalid signature ${_}: out of range 1..Point.Fn.ORDER`);
    return m;
  }
  function v() {
    if (d)
      throw new Error('"recovered" sig type is not supported for cofactor >2 curves');
  }
  function b(_, m) {
    Dr(m);
    const x = y.signature, A = m === "compact" ? x : m === "recovered" ? x + 1 : void 0;
    return H(_, A);
  }
  class C {
    r;
    s;
    recovery;
    constructor(m, x, A) {
      if (this.r = p("r", m), this.s = p("s", x), A != null) {
        if (v(), ![0, 1, 2, 3].includes(A))
          throw new Error("invalid recovery id");
        this.recovery = A;
      }
      Object.freeze(this);
    }
    static fromBytes(m, x = c.format) {
      b(m, x);
      let A;
      if (x === "der") {
        const { r: S, s: $ } = rt.toSig(H(m));
        return new C(S, $);
      }
      x === "recovered" && (A = m[0], x = "compact", m = m.subarray(1));
      const R = y.signature / 2, I = m.subarray(0, R), k = m.subarray(R, R * 2);
      return new C(s.fromBytes(I), s.fromBytes(k), A);
    }
    static fromHex(m, x) {
      return this.fromBytes(G(m), x);
    }
    assertRecovery() {
      const { recovery: m } = this;
      if (m == null)
        throw new Error("invalid recovery id: must be present");
      return m;
    }
    addRecoveryBit(m) {
      return new C(this.r, this.s, m);
    }
    recoverPublicKey(m) {
      const { r: x, s: A } = this, R = this.assertRecovery(), I = R === 2 || R === 3 ? x + l : x;
      if (!o.isValid(I))
        throw new Error("invalid recovery id: sig.r+curve.n != R.x");
      const k = o.toBytes(I), S = e.fromBytes(pe(Js((R & 1) === 0), k)), $ = s.inv(I), F = z(H(m, void 0, "msgHash")), j = s.create(-F * $), B = s.create(A * $), K = e.BASE.multiplyUnsafe(j).add(S.multiplyUnsafe(B));
      if (K.is0())
        throw new Error("invalid recovery: point at infinify");
      return K.assertValidity(), K;
    }
    // Signatures should be low-s, to prevent malleability.
    hasHighS() {
      return g(this.s);
    }
    toBytes(m = c.format) {
      if (Dr(m), m === "der")
        return G(rt.hexFromSig(this));
      const { r: x, s: A } = this, R = s.toBytes(x), I = s.toBytes(A);
      return m === "recovered" ? (v(), pe(Uint8Array.of(this.assertRecovery()), R, I)) : pe(R, I);
    }
    toHex(m) {
      return V(this.toBytes(m));
    }
  }
  const ae = n.bits2int || function(m) {
    if (m.length > 8192)
      throw new Error("input is too large");
    const x = yn(m), A = m.length * 8 - a;
    return A > 0 ? x >> BigInt(A) : x;
  }, z = n.bits2int_modN || function(m) {
    return s.create(ae(m));
  }, q = ci(a);
  function Y(_) {
    return uu("num < 2^" + a, _, Fe, q), s.toBytes(_);
  }
  function T(_, m) {
    return H(_, void 0, "message"), m ? H(t(_), void 0, "prehashed message") : _;
  }
  function ee(_, m, x) {
    const { lowS: A, prehash: R, extraEntropy: I } = _r(x, c);
    _ = T(_, R);
    const k = z(_), S = s.fromBytes(m);
    if (!s.isValidNot0(S))
      throw new Error("invalid private key");
    const $ = [Y(S), Y(k)];
    if (I != null && I !== !1) {
      const K = I === !0 ? r(y.secretKey) : I;
      $.push(H(K, void 0, "extraEntropy"));
    }
    const F = pe(...$), j = k;
    function B(K) {
      const ne = ae(K);
      if (!s.isValidNot0(ne))
        return;
      const Te = s.inv(ne), Z = e.BASE.multiply(ne).toAffine(), oe = s.create(Z.x);
      if (oe === Fe)
        return;
      const bn = s.create(Te * s.create(j + oe * S));
      if (bn === Fe)
        return;
      let qi = (Z.x === oe ? 0 : 2) | Number(Z.y & Nt), Fi = bn;
      return A && g(bn) && (Fi = s.neg(bn), qi ^= 1), new C(oe, Fi, d ? void 0 : qi);
    }
    return { seed: F, k2sig: B };
  }
  function X(_, m, x = {}) {
    const { seed: A, k2sig: R } = ee(_, m, x);
    return du(t.outputLen, s.BYTES, i)(A, R).toBytes(x.format);
  }
  function L(_, m, x, A = {}) {
    const { lowS: R, prehash: I, format: k } = _r(A, c);
    if (x = H(x, void 0, "publicKey"), m = T(m, I), !si(_)) {
      const S = _ instanceof C ? ", use sig.toBytes()" : "";
      throw new Error("verify expects Uint8Array signature" + S);
    }
    b(_, k);
    try {
      const S = C.fromBytes(_, k), $ = e.fromBytes(x);
      if (R && S.hasHighS())
        return !1;
      const { r: F, s: j } = S, B = z(m), K = s.inv(j), ne = s.create(B * K), Te = s.create(F * K), Z = e.BASE.multiplyUnsafe(ne).add($.multiplyUnsafe(Te));
      return Z.is0() ? !1 : s.create(Z.x) === F;
    } catch {
      return !1;
    }
  }
  function E(_, m, x = {}) {
    const { prehash: A } = _r(x, c);
    return m = T(m, A), C.fromBytes(_, "recovered").recoverPublicKey(m).toBytes();
  }
  return Object.freeze({
    keygen: u,
    getPublicKey: f,
    getSharedSecret: h,
    utils: w,
    lengths: y,
    Point: e,
    sign: X,
    verify: L,
    recoverPublicKey: E,
    Signature: C,
    hash: t
  });
}
const or = {
  p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: BigInt(1),
  a: BigInt(0),
  b: BigInt(7),
  Gx: BigInt("0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"),
  Gy: BigInt("0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8")
}, Lu = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  basises: [
    [BigInt("0x3086d221a7d46bcde86c90e49284eb15"), -BigInt("0xe4437ed6010e88286f547fa90abfe4c3")],
    [BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), BigInt("0x3086d221a7d46bcde86c90e49284eb15")]
  ]
}, Ou = /* @__PURE__ */ BigInt(0), jr = /* @__PURE__ */ BigInt(2);
function Pu(e) {
  const t = or.p, n = BigInt(3), r = BigInt(6), i = BigInt(11), o = BigInt(22), s = BigInt(23), l = BigInt(44), a = BigInt(88), u = e * e * e % t, f = u * u * e % t, h = we(f, n, t) * f % t, w = we(h, n, t) * f % t, y = we(w, jr, t) * u % t, c = we(y, i, t) * y % t, d = we(c, o, t) * c % t, g = we(d, l, t) * d % t, p = we(g, a, t) * g % t, v = we(p, l, t) * d % t, b = we(v, n, t) * f % t, C = we(b, s, t) * c % t, ae = we(C, r, t) * u % t, z = we(ae, jr, t);
  if (!Zn.eql(Zn.sqr(z), e))
    throw new Error("Cannot find square root");
  return z;
}
const Zn = ir(or.p, { sqrt: Pu }), St = /* @__PURE__ */ $u(or, {
  Fp: Zn,
  endo: Lu
}), di = /* @__PURE__ */ Tu(St, Me), ho = {};
function Wn(e, ...t) {
  let n = ho[e];
  if (n === void 0) {
    const r = Me(lu(e));
    n = pe(r, r), ho[e] = n;
  }
  return Me(pe(n, ...t));
}
const hi = (e) => e.toBytes(!0).slice(1), pi = (e) => e % jr === Ou;
function Vr(e) {
  const { Fn: t, BASE: n } = St, r = t.fromBytes(e), i = n.multiply(r);
  return { scalar: pi(i.y) ? r : t.neg(r), bytes: hi(i) };
}
function ea(e) {
  const t = Zn;
  if (!t.isValidNot0(e))
    throw new Error("invalid x: Fail if x ≥ p");
  const n = t.create(e * e), r = t.create(n * e + BigInt(7));
  let i = t.sqrt(r);
  pi(i) || (i = t.neg(i));
  const o = St.fromAffine({ x: e, y: i });
  return o.assertValidity(), o;
}
const on = yn;
function ta(...e) {
  return St.Fn.create(on(Wn("BIP0340/challenge", ...e)));
}
function po(e) {
  return Vr(e).bytes;
}
function Bu(e, t, n = Gt(32)) {
  const { Fn: r } = St, i = H(e, void 0, "message"), { bytes: o, scalar: s } = Vr(t), l = H(n, 32, "auxRand"), a = r.toBytes(s ^ on(Wn("BIP0340/aux", l))), u = Wn("BIP0340/nonce", a, o, i), { bytes: f, scalar: h } = Vr(u), w = ta(f, o, i), y = new Uint8Array(64);
  if (y.set(f, 0), y.set(r.toBytes(r.create(h + w * s)), 32), !na(y, i, o))
    throw new Error("sign: Invalid signature produced");
  return y;
}
function na(e, t, n) {
  const { Fp: r, Fn: i, BASE: o } = St, s = H(e, 64, "signature"), l = H(t, void 0, "message"), a = H(n, 32, "publicKey");
  try {
    const u = ea(on(a)), f = on(s.subarray(0, 32));
    if (!r.isValidNot0(f))
      return !1;
    const h = on(s.subarray(32, 64));
    if (!i.isValidNot0(h))
      return !1;
    const w = ta(i.toBytes(f), hi(u), l), y = o.multiplyUnsafe(h).add(u.multiplyUnsafe(i.neg(w))), { x: c, y: d } = y.toAffine();
    return !(y.is0() || !pi(d) || c !== f);
  } catch {
    return !1;
  }
}
const Yt = /* @__PURE__ */ (() => {
  const n = (r = Gt(48)) => Ks(r, or.n);
  return {
    keygen: Gs(n, po),
    getPublicKey: po,
    sign: Bu,
    verify: na,
    Point: St,
    utils: {
      randomSecretKey: n,
      taggedHash: Wn,
      lift_x: ea,
      pointToBytes: hi
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
function gi(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function Nu(e) {
  if (!gi(e))
    throw new Error("Uint8Array expected");
}
function ra(e, t) {
  return Array.isArray(t) ? t.length === 0 ? !0 : e ? t.every((n) => typeof n == "string") : t.every((n) => Number.isSafeInteger(n)) : !1;
}
function Uu(e) {
  if (typeof e != "function")
    throw new Error("function expected");
  return !0;
}
function It(e, t) {
  if (typeof t != "string")
    throw new Error(`${e}: string expected`);
  return !0;
}
function yi(e) {
  if (!Number.isSafeInteger(e))
    throw new Error(`invalid integer: ${e}`);
}
function qr(e) {
  if (!Array.isArray(e))
    throw new Error("array expected");
}
function Gn(e, t) {
  if (!ra(!0, t))
    throw new Error(`${e}: array of strings expected`);
}
function ia(e, t) {
  if (!ra(!1, t))
    throw new Error(`${e}: array of numbers expected`);
}
// @__NO_SIDE_EFFECTS__
function oa(...e) {
  const t = (o) => o, n = (o, s) => (l) => o(s(l)), r = e.map((o) => o.encode).reduceRight(n, t), i = e.map((o) => o.decode).reduce(n, t);
  return { encode: r, decode: i };
}
// @__NO_SIDE_EFFECTS__
function sa(e) {
  const t = typeof e == "string" ? e.split("") : e, n = t.length;
  Gn("alphabet", t);
  const r = new Map(t.map((i, o) => [i, o]));
  return {
    encode: (i) => (qr(i), i.map((o) => {
      if (!Number.isSafeInteger(o) || o < 0 || o >= n)
        throw new Error(`alphabet.encode: digit index outside alphabet "${o}". Allowed: ${e}`);
      return t[o];
    })),
    decode: (i) => (qr(i), i.map((o) => {
      It("alphabet.decode", o);
      const s = r.get(o);
      if (s === void 0)
        throw new Error(`Unknown letter: "${o}". Allowed: ${e}`);
      return s;
    }))
  };
}
// @__NO_SIDE_EFFECTS__
function aa(e = "") {
  return It("join", e), {
    encode: (t) => (Gn("join.decode", t), t.join(e)),
    decode: (t) => (It("join.decode", t), t.split(e))
  };
}
// @__NO_SIDE_EFFECTS__
function Mu(e, t = "=") {
  return yi(e), It("padding", t), {
    encode(n) {
      for (Gn("padding.encode", n); n.length * e % 8; )
        n.push(t);
      return n;
    },
    decode(n) {
      Gn("padding.decode", n);
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
const la = (e, t) => t === 0 ? e : la(t, e % t), Yn = /* @__NO_SIDE_EFFECTS__ */ (e, t) => e + (t - la(e, t)), On = /* @__PURE__ */ (() => {
  let e = [];
  for (let t = 0; t < 40; t++)
    e.push(2 ** t);
  return e;
})();
function Fr(e, t, n, r) {
  if (qr(e), t <= 0 || t > 32)
    throw new Error(`convertRadix2: wrong from=${t}`);
  if (n <= 0 || n > 32)
    throw new Error(`convertRadix2: wrong to=${n}`);
  if (/* @__PURE__ */ Yn(t, n) > 32)
    throw new Error(`convertRadix2: carry overflow from=${t} to=${n} carryBits=${/* @__PURE__ */ Yn(t, n)}`);
  let i = 0, o = 0;
  const s = On[t], l = On[n] - 1, a = [];
  for (const u of e) {
    if (yi(u), u >= s)
      throw new Error(`convertRadix2: invalid data word=${u} from=${t}`);
    if (i = i << t | u, o + t > 32)
      throw new Error(`convertRadix2: carry overflow pos=${o} from=${t}`);
    for (o += t; o >= n; o -= n)
      a.push((i >> o - n & l) >>> 0);
    const f = On[o];
    if (f === void 0)
      throw new Error("invalid carry");
    i &= f - 1;
  }
  if (i = i << n - o & l, !r && o >= t)
    throw new Error("Excess padding");
  if (!r && i > 0)
    throw new Error(`Non-zero padding: ${i}`);
  return r && o > 0 && a.push(i >>> 0), a;
}
// @__NO_SIDE_EFFECTS__
function ca(e, t = !1) {
  if (yi(e), e <= 0 || e > 32)
    throw new Error("radix2: bits should be in (0..32]");
  if (/* @__PURE__ */ Yn(8, e) > 32 || /* @__PURE__ */ Yn(e, 8) > 32)
    throw new Error("radix2: carry overflow");
  return {
    encode: (n) => {
      if (!gi(n))
        throw new Error("radix2.encode input should be Uint8Array");
      return Fr(Array.from(n), 8, e, !t);
    },
    decode: (n) => (ia("radix2.decode", n), Uint8Array.from(Fr(n, e, 8, t)))
  };
}
function go(e) {
  return Uu(e), function(...t) {
    try {
      return e.apply(null, t);
    } catch {
    }
  };
}
const zu = typeof Uint8Array.from([]).toBase64 == "function" && typeof Uint8Array.fromBase64 == "function", Hu = (e, t) => {
  It("base64", e);
  const n = /^[A-Za-z0-9=+/]+$/, r = "base64";
  if (e.length > 0 && !n.test(e))
    throw new Error("invalid base64");
  return Uint8Array.fromBase64(e, { alphabet: r, lastChunkHandling: "strict" });
}, ht = zu ? {
  encode(e) {
    return Nu(e), e.toBase64();
  },
  decode(e) {
    return Hu(e);
  }
} : /* @__PURE__ */ oa(/* @__PURE__ */ ca(6), /* @__PURE__ */ sa("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), /* @__PURE__ */ Mu(6), /* @__PURE__ */ aa("")), Kr = /* @__PURE__ */ oa(/* @__PURE__ */ sa("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), /* @__PURE__ */ aa("")), yo = [996825010, 642813549, 513874426, 1027748829, 705979059];
function Xt(e) {
  const t = e >> 25;
  let n = (e & 33554431) << 5;
  for (let r = 0; r < yo.length; r++)
    (t >> r & 1) === 1 && (n ^= yo[r]);
  return n;
}
function wo(e, t, n = 1) {
  const r = e.length;
  let i = 1;
  for (let o = 0; o < r; o++) {
    const s = e.charCodeAt(o);
    if (s < 33 || s > 126)
      throw new Error(`Invalid prefix (${e})`);
    i = Xt(i) ^ s >> 5;
  }
  i = Xt(i);
  for (let o = 0; o < r; o++)
    i = Xt(i) ^ e.charCodeAt(o) & 31;
  for (let o of t)
    i = Xt(i) ^ o;
  for (let o = 0; o < 6; o++)
    i = Xt(i);
  return i ^= n, Kr.encode(Fr([i % On[30]], 30, 5, !1));
}
// @__NO_SIDE_EFFECTS__
function Du(e) {
  const t = e === "bech32" ? 1 : 734539939, n = /* @__PURE__ */ ca(5), r = n.decode, i = n.encode, o = go(r);
  function s(h, w, y = 90) {
    It("bech32.encode prefix", h), gi(w) && (w = Array.from(w)), ia("bech32.encode", w);
    const c = h.length;
    if (c === 0)
      throw new TypeError(`Invalid prefix length ${c}`);
    const d = c + 7 + w.length;
    if (y !== !1 && d > y)
      throw new TypeError(`Length ${d} exceeds limit ${y}`);
    const g = h.toLowerCase(), p = wo(g, w, t);
    return `${g}1${Kr.encode(w)}${p}`;
  }
  function l(h, w = 90) {
    It("bech32.decode input", h);
    const y = h.length;
    if (y < 8 || w !== !1 && y > w)
      throw new TypeError(`invalid string length: ${y} (${h}). Expected (8..${w})`);
    const c = h.toLowerCase();
    if (h !== c && h !== h.toUpperCase())
      throw new Error("String must be lowercase or uppercase");
    const d = c.lastIndexOf("1");
    if (d === 0 || d === -1)
      throw new Error('Letter "1" must be present between prefix and data only');
    const g = c.slice(0, d), p = c.slice(d + 1);
    if (p.length < 6)
      throw new Error("Data must be at least 6 characters long");
    const v = Kr.decode(p).slice(0, -6), b = wo(g, v, t);
    if (!p.endsWith(b))
      throw new Error(`Invalid checksum in ${h}: expected "${b}"`);
    return { prefix: g, words: v };
  }
  const a = go(l);
  function u(h) {
    const { prefix: w, words: y } = l(h, !1);
    return { prefix: w, words: y, bytes: r(y) };
  }
  function f(h, w) {
    return s(h, i(w));
  }
  return {
    encode: s,
    decode: l,
    encodeFromBytes: f,
    decodeToBytes: u,
    decodeUnsafe: a,
    fromWords: r,
    fromWordsUnsafe: o,
    toWords: i
  };
}
const Zt = /* @__PURE__ */ Du("bech32");
function ju(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function vo(e) {
  if (typeof e != "boolean")
    throw new Error(`boolean expected, not ${e}`);
}
function Er(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error("positive integer expected, got " + e);
}
function he(e, t, n = "") {
  const r = ju(e), i = e?.length, o = t !== void 0;
  if (!r || o && i !== t) {
    const s = n && `"${n}" `, l = o ? ` of length ${t}` : "", a = r ? `length=${i}` : `type=${typeof e}`;
    throw new Error(s + "expected Uint8Array" + l + ", got " + a);
  }
  return e;
}
function se(e) {
  return new Uint32Array(e.buffer, e.byteOffset, Math.floor(e.byteLength / 4));
}
function Wt(...e) {
  for (let t = 0; t < e.length; t++)
    e[t].fill(0);
}
const Vu = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function qu(e, t) {
  return e.buffer === t.buffer && // best we can do, may fail with an obscure Proxy
  e.byteOffset < t.byteOffset + t.byteLength && // a starts before b end
  t.byteOffset < e.byteOffset + e.byteLength;
}
function ua(e, t) {
  if (qu(e, t) && e.byteOffset < t.byteOffset)
    throw new Error("complex overlap of input and output is not supported");
}
function Fu(e, t) {
  if (t == null || typeof t != "object")
    throw new Error("options must be defined");
  return Object.assign(e, t);
}
function Ku(e, t) {
  if (e.length !== t.length)
    return !1;
  let n = 0;
  for (let r = 0; r < e.length; r++)
    n |= e[r] ^ t[r];
  return n === 0;
}
const Zu = /* @__NO_SIDE_EFFECTS__ */ (e, t) => {
  function n(r, ...i) {
    if (he(r, void 0, "key"), !Vu)
      throw new Error("Non little-endian hardware is not yet supported");
    if (e.nonceLength !== void 0) {
      const f = i[0];
      he(f, e.varSizeNonce ? void 0 : e.nonceLength, "nonce");
    }
    const o = e.tagLength;
    o && i[1] !== void 0 && he(i[1], void 0, "AAD");
    const s = t(r, ...i), l = (f, h) => {
      if (h !== void 0) {
        if (f !== 2)
          throw new Error("cipher output not supported");
        he(h, void 0, "output");
      }
    };
    let a = !1;
    return {
      encrypt(f, h) {
        if (a)
          throw new Error("cannot encrypt() twice with same key + nonce");
        return a = !0, he(f), l(s.encrypt.length, h), s.encrypt(f, h);
      },
      decrypt(f, h) {
        if (he(f), o && f.length < o)
          throw new Error('"ciphertext" expected length bigger than tagLength=' + o);
        return l(s.decrypt.length, h), s.decrypt(f, h);
      }
    };
  }
  return Object.assign(n, e), n;
};
function fa(e, t, n = !0) {
  if (t === void 0)
    return new Uint8Array(e);
  if (t.length !== e)
    throw new Error('"output" expected Uint8Array of length ' + e + ", got: " + t.length);
  if (n && !Ut(t))
    throw new Error("invalid output, must be aligned");
  return t;
}
function Ut(e) {
  return e.byteOffset % 4 === 0;
}
function kt(e) {
  return Uint8Array.from(e);
}
const ct = 16, Wu = 283;
function Gu(e) {
  if (![16, 24, 32].includes(e.length))
    throw new Error('"aes key" expected Uint8Array of length 16/24/32, got length=' + e.length);
}
function wi(e) {
  return e << 1 ^ Wu & -(e >> 7);
}
function Ot(e, t) {
  let n = 0;
  for (; t > 0; t >>= 1)
    n ^= e & -(t & 1), e = wi(e);
  return n;
}
const Zr = /* @__PURE__ */ (() => {
  const e = new Uint8Array(256);
  for (let n = 0, r = 1; n < 256; n++, r ^= wi(r))
    e[n] = r;
  const t = new Uint8Array(256);
  t[0] = 99;
  for (let n = 0; n < 255; n++) {
    let r = e[255 - n];
    r |= r << 8, t[e[n]] = (r ^ r >> 4 ^ r >> 5 ^ r >> 6 ^ r >> 7 ^ 99) & 255;
  }
  return Wt(e), t;
})(), Yu = /* @__PURE__ */ Zr.map((e, t) => Zr.indexOf(t)), Xu = (e) => e << 24 | e >>> 8, xr = (e) => e << 8 | e >>> 24;
function da(e, t) {
  if (e.length !== 256)
    throw new Error("Wrong sbox length");
  const n = new Uint32Array(256).map((u, f) => t(e[f])), r = n.map(xr), i = r.map(xr), o = i.map(xr), s = new Uint32Array(256 * 256), l = new Uint32Array(256 * 256), a = new Uint16Array(256 * 256);
  for (let u = 0; u < 256; u++)
    for (let f = 0; f < 256; f++) {
      const h = u * 256 + f;
      s[h] = n[u] ^ r[f], l[h] = i[u] ^ o[f], a[h] = e[u] << 8 | e[f];
    }
  return { sbox: e, sbox2: a, T0: n, T1: r, T2: i, T3: o, T01: s, T23: l };
}
const vi = /* @__PURE__ */ da(Zr, (e) => Ot(e, 3) << 24 | e << 16 | e << 8 | Ot(e, 2)), ha = /* @__PURE__ */ da(Yu, (e) => Ot(e, 11) << 24 | Ot(e, 13) << 16 | Ot(e, 9) << 8 | Ot(e, 14)), Ju = /* @__PURE__ */ (() => {
  const e = new Uint8Array(16);
  for (let t = 0, n = 1; t < 16; t++, n = wi(n))
    e[t] = n;
  return e;
})();
function pa(e) {
  he(e);
  const t = e.length;
  Gu(e);
  const { sbox2: n } = vi, r = [];
  Ut(e) || r.push(e = kt(e));
  const i = se(e), o = i.length, s = (a) => Oe(n, a, a, a, a), l = new Uint32Array(t + 28);
  l.set(i);
  for (let a = o; a < l.length; a++) {
    let u = l[a - 1];
    a % o === 0 ? u = s(Xu(u)) ^ Ju[a / o - 1] : o > 6 && a % o === 4 && (u = s(u)), l[a] = l[a - o] ^ u;
  }
  return Wt(...r), l;
}
function Qu(e) {
  const t = pa(e), n = t.slice(), r = t.length, { sbox2: i } = vi, { T0: o, T1: s, T2: l, T3: a } = ha;
  for (let u = 0; u < r; u += 4)
    for (let f = 0; f < 4; f++)
      n[u + f] = t[r - u - 4 + f];
  Wt(t);
  for (let u = 4; u < r - 4; u++) {
    const f = n[u], h = Oe(i, f, f, f, f);
    n[u] = o[h & 255] ^ s[h >>> 8 & 255] ^ l[h >>> 16 & 255] ^ a[h >>> 24];
  }
  return n;
}
function ot(e, t, n, r, i, o) {
  return e[n << 8 & 65280 | r >>> 8 & 255] ^ t[i >>> 8 & 65280 | o >>> 24 & 255];
}
function Oe(e, t, n, r, i) {
  return e[t & 255 | n & 65280] | e[r >>> 16 & 255 | i >>> 16 & 65280] << 16;
}
function bo(e, t, n, r, i) {
  const { sbox2: o, T01: s, T23: l } = vi;
  let a = 0;
  t ^= e[a++], n ^= e[a++], r ^= e[a++], i ^= e[a++];
  const u = e.length / 4 - 2;
  for (let c = 0; c < u; c++) {
    const d = e[a++] ^ ot(s, l, t, n, r, i), g = e[a++] ^ ot(s, l, n, r, i, t), p = e[a++] ^ ot(s, l, r, i, t, n), v = e[a++] ^ ot(s, l, i, t, n, r);
    t = d, n = g, r = p, i = v;
  }
  const f = e[a++] ^ Oe(o, t, n, r, i), h = e[a++] ^ Oe(o, n, r, i, t), w = e[a++] ^ Oe(o, r, i, t, n), y = e[a++] ^ Oe(o, i, t, n, r);
  return { s0: f, s1: h, s2: w, s3: y };
}
function ef(e, t, n, r, i) {
  const { sbox2: o, T01: s, T23: l } = ha;
  let a = 0;
  t ^= e[a++], n ^= e[a++], r ^= e[a++], i ^= e[a++];
  const u = e.length / 4 - 2;
  for (let c = 0; c < u; c++) {
    const d = e[a++] ^ ot(s, l, t, i, r, n), g = e[a++] ^ ot(s, l, n, t, i, r), p = e[a++] ^ ot(s, l, r, n, t, i), v = e[a++] ^ ot(s, l, i, r, n, t);
    t = d, n = g, r = p, i = v;
  }
  const f = e[a++] ^ Oe(o, t, i, r, n), h = e[a++] ^ Oe(o, n, t, i, r), w = e[a++] ^ Oe(o, r, n, t, i), y = e[a++] ^ Oe(o, i, r, n, t);
  return { s0: f, s1: h, s2: w, s3: y };
}
function tf(e) {
  if (he(e), e.length % ct !== 0)
    throw new Error("aes-(cbc/ecb).decrypt ciphertext should consist of blocks with size " + ct);
}
function nf(e, t, n) {
  he(e);
  let r = e.length;
  const i = r % ct;
  if (!t && i !== 0)
    throw new Error("aec/(cbc-ecb): unpadded plaintext with disabled padding");
  Ut(e) || (e = kt(e));
  const o = se(e);
  if (t) {
    let l = ct - i;
    l || (l = ct), r = r + l;
  }
  n = fa(r, n), ua(e, n);
  const s = se(n);
  return { b: o, o: s, out: n };
}
function rf(e, t) {
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
function of(e) {
  const t = new Uint8Array(16), n = se(t);
  t.set(e);
  const r = ct - e.length;
  for (let i = ct - r; i < ct; i++)
    t[i] = r;
  return n;
}
const ga = /* @__PURE__ */ Zu({ blockSize: 16, nonceLength: 16 }, function(t, n, r = {}) {
  const i = !r.disablePadding;
  return {
    encrypt(o, s) {
      const l = pa(t), { b: a, o: u, out: f } = nf(o, i, s);
      let h = n;
      const w = [l];
      Ut(h) || w.push(h = kt(h));
      const y = se(h);
      let c = y[0], d = y[1], g = y[2], p = y[3], v = 0;
      for (; v + 4 <= a.length; )
        c ^= a[v + 0], d ^= a[v + 1], g ^= a[v + 2], p ^= a[v + 3], { s0: c, s1: d, s2: g, s3: p } = bo(l, c, d, g, p), u[v++] = c, u[v++] = d, u[v++] = g, u[v++] = p;
      if (i) {
        const b = of(o.subarray(v * 4));
        c ^= b[0], d ^= b[1], g ^= b[2], p ^= b[3], { s0: c, s1: d, s2: g, s3: p } = bo(l, c, d, g, p), u[v++] = c, u[v++] = d, u[v++] = g, u[v++] = p;
      }
      return Wt(...w), f;
    },
    decrypt(o, s) {
      tf(o);
      const l = Qu(t);
      let a = n;
      const u = [l];
      Ut(a) || u.push(a = kt(a));
      const f = se(a);
      s = fa(o.length, s), Ut(o) || u.push(o = kt(o)), ua(o, s);
      const h = se(o), w = se(s);
      let y = f[0], c = f[1], d = f[2], g = f[3];
      for (let p = 0; p + 4 <= h.length; ) {
        const v = y, b = c, C = d, ae = g;
        y = h[p + 0], c = h[p + 1], d = h[p + 2], g = h[p + 3];
        const { s0: z, s1: q, s2: Y, s3: T } = ef(l, y, c, d, g);
        w[p++] = z ^ v, w[p++] = q ^ b, w[p++] = Y ^ C, w[p++] = T ^ ae;
      }
      return Wt(...u), rf(s, i);
    }
  };
}), ya = (e) => Uint8Array.from(e.split(""), (t) => t.charCodeAt(0)), sf = ya("expand 16-byte k"), af = ya("expand 32-byte k"), lf = se(sf), cf = se(af);
function N(e, t) {
  return e << t | e >>> 32 - t;
}
function Wr(e) {
  return e.byteOffset % 4 === 0;
}
const An = 64, uf = 16, wa = 2 ** 32 - 1, mo = Uint32Array.of();
function ff(e, t, n, r, i, o, s, l) {
  const a = i.length, u = new Uint8Array(An), f = se(u), h = Wr(i) && Wr(o), w = h ? se(i) : mo, y = h ? se(o) : mo;
  for (let c = 0; c < a; s++) {
    if (e(t, n, r, f, s, l), s >= wa)
      throw new Error("arx: counter overflow");
    const d = Math.min(An, a - c);
    if (h && d === An) {
      const g = c / 4;
      if (c % 4 !== 0)
        throw new Error("arx: invalid block position");
      for (let p = 0, v; p < uf; p++)
        v = g + p, y[v] = w[v] ^ f[p];
      c += An;
      continue;
    }
    for (let g = 0, p; g < d; g++)
      p = c + g, o[p] = i[p] ^ u[g];
    c += d;
  }
}
function df(e, t) {
  const { allowShortKeys: n, extendNonceFn: r, counterLength: i, counterRight: o, rounds: s } = Fu({ allowShortKeys: !1, counterLength: 8, counterRight: !1, rounds: 20 }, t);
  if (typeof e != "function")
    throw new Error("core must be a function");
  return Er(i), Er(s), vo(o), vo(n), (l, a, u, f, h = 0) => {
    he(l, void 0, "key"), he(a, void 0, "nonce"), he(u, void 0, "data");
    const w = u.length;
    if (f === void 0 && (f = new Uint8Array(w)), he(f, void 0, "output"), Er(h), h < 0 || h >= wa)
      throw new Error("arx: counter overflow");
    if (f.length < w)
      throw new Error(`arx: output (${f.length}) is shorter than data (${w})`);
    const y = [];
    let c = l.length, d, g;
    if (c === 32)
      y.push(d = kt(l)), g = cf;
    else if (c === 16 && n)
      d = new Uint8Array(32), d.set(l), d.set(l, 16), g = lf, y.push(d);
    else
      throw he(l, 32, "arx key"), new Error("invalid key size");
    Wr(a) || y.push(a = kt(a));
    const p = se(d);
    if (r) {
      if (a.length !== 24)
        throw new Error("arx: extended nonce must be 24 bytes");
      r(g, p, se(a.subarray(0, 16)), p), a = a.subarray(16);
    }
    const v = 16 - i;
    if (v !== a.length)
      throw new Error(`arx: nonce must be ${v} or 16 bytes`);
    if (v !== 12) {
      const C = new Uint8Array(12);
      C.set(a, o ? 0 : 12 - a.length), a = C, y.push(a);
    }
    const b = se(a);
    return ff(e, g, p, b, u, f, h, s), Wt(...y), f;
  };
}
function hf(e, t, n, r, i, o = 20) {
  let s = e[0], l = e[1], a = e[2], u = e[3], f = t[0], h = t[1], w = t[2], y = t[3], c = t[4], d = t[5], g = t[6], p = t[7], v = i, b = n[0], C = n[1], ae = n[2], z = s, q = l, Y = a, T = u, ee = f, X = h, L = w, E = y, _ = c, m = d, x = g, A = p, R = v, I = b, k = C, S = ae;
  for (let F = 0; F < o; F += 2)
    z = z + ee | 0, R = N(R ^ z, 16), _ = _ + R | 0, ee = N(ee ^ _, 12), z = z + ee | 0, R = N(R ^ z, 8), _ = _ + R | 0, ee = N(ee ^ _, 7), q = q + X | 0, I = N(I ^ q, 16), m = m + I | 0, X = N(X ^ m, 12), q = q + X | 0, I = N(I ^ q, 8), m = m + I | 0, X = N(X ^ m, 7), Y = Y + L | 0, k = N(k ^ Y, 16), x = x + k | 0, L = N(L ^ x, 12), Y = Y + L | 0, k = N(k ^ Y, 8), x = x + k | 0, L = N(L ^ x, 7), T = T + E | 0, S = N(S ^ T, 16), A = A + S | 0, E = N(E ^ A, 12), T = T + E | 0, S = N(S ^ T, 8), A = A + S | 0, E = N(E ^ A, 7), z = z + X | 0, S = N(S ^ z, 16), x = x + S | 0, X = N(X ^ x, 12), z = z + X | 0, S = N(S ^ z, 8), x = x + S | 0, X = N(X ^ x, 7), q = q + L | 0, R = N(R ^ q, 16), A = A + R | 0, L = N(L ^ A, 12), q = q + L | 0, R = N(R ^ q, 8), A = A + R | 0, L = N(L ^ A, 7), Y = Y + E | 0, I = N(I ^ Y, 16), _ = _ + I | 0, E = N(E ^ _, 12), Y = Y + E | 0, I = N(I ^ Y, 8), _ = _ + I | 0, E = N(E ^ _, 7), T = T + ee | 0, k = N(k ^ T, 16), m = m + k | 0, ee = N(ee ^ m, 12), T = T + ee | 0, k = N(k ^ T, 8), m = m + k | 0, ee = N(ee ^ m, 7);
  let $ = 0;
  r[$++] = s + z | 0, r[$++] = l + q | 0, r[$++] = a + Y | 0, r[$++] = u + T | 0, r[$++] = f + ee | 0, r[$++] = h + X | 0, r[$++] = w + L | 0, r[$++] = y + E | 0, r[$++] = c + _ | 0, r[$++] = d + m | 0, r[$++] = g + x | 0, r[$++] = p + A | 0, r[$++] = v + R | 0, r[$++] = b + I | 0, r[$++] = C + k | 0, r[$++] = ae + S | 0;
}
const va = /* @__PURE__ */ df(hf, {
  counterRight: !1,
  counterLength: 4,
  allowShortKeys: !1
});
function pf(e, t, n) {
  return rr(e), n === void 0 && (n = new Uint8Array(e.outputLen)), wn(e, n, t);
}
const kr = /* @__PURE__ */ Uint8Array.of(0), _o = /* @__PURE__ */ Uint8Array.of();
function gf(e, t, n, r = 32) {
  rr(e), dt(r, "length");
  const i = e.outputLen;
  if (r > 255 * i)
    throw new Error("Length must be <= 255*HashLen");
  const o = Math.ceil(r / i);
  n === void 0 ? n = _o : H(n, void 0, "info");
  const s = new Uint8Array(o * i), l = wn.create(e, t), a = l._cloneInto(), u = new Uint8Array(l.outputLen);
  for (let f = 0; f < o; f++)
    kr[0] = f + 1, a.update(f === 0 ? _o : u).update(n).update(kr).digestInto(u), s.set(u, i * f), l._cloneInto(a);
  return l.destroy(), a.destroy(), cn(u, kr), s.slice(0, r);
}
var yf = Object.defineProperty, D = (e, t) => {
  for (var n in t)
    yf(e, n, { get: t[n], enumerable: !0 });
}, Tt = Symbol("verified"), wf = (e) => e instanceof Object;
function sr(e) {
  if (!wf(e) || typeof e.kind != "number" || typeof e.content != "string" || typeof e.created_at != "number" || typeof e.pubkey != "string" || !e.pubkey.match(/^[a-f0-9]{64}$/) || !Array.isArray(e.tags))
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
var ba = {};
D(ba, {
  binarySearch: () => bi,
  bytesToHex: () => V,
  hexToBytes: () => G,
  insertEventIntoAscendingList: () => mf,
  insertEventIntoDescendingList: () => bf,
  mergeReverseSortedLists: () => _f,
  normalizeURL: () => vf,
  utf8Decoder: () => Ke,
  utf8Encoder: () => xe
});
var Ke = new TextDecoder("utf-8"), xe = new TextEncoder();
function vf(e) {
  try {
    e.indexOf("://") === -1 && (e = "wss://" + e);
    let t = new URL(e);
    return t.protocol === "http:" ? t.protocol = "ws:" : t.protocol === "https:" && (t.protocol = "wss:"), t.pathname = t.pathname.replace(/\/+/g, "/"), t.pathname.endsWith("/") && (t.pathname = t.pathname.slice(0, -1)), (t.port === "80" && t.protocol === "ws:" || t.port === "443" && t.protocol === "wss:") && (t.port = ""), t.searchParams.sort(), t.hash = "", t.toString();
  } catch {
    throw new Error(`Invalid URL: ${e}`);
  }
}
function bf(e, t) {
  const [n, r] = bi(e, (i) => t.id === i.id ? 0 : t.created_at === i.created_at ? -1 : i.created_at - t.created_at);
  return r || e.splice(n, 0, t), e;
}
function mf(e, t) {
  const [n, r] = bi(e, (i) => t.id === i.id ? 0 : t.created_at === i.created_at ? -1 : t.created_at - i.created_at);
  return r || e.splice(n, 0, t), e;
}
function bi(e, t) {
  let n = 0, r = e.length - 1;
  for (; n <= r; ) {
    const i = Math.floor((n + r) / 2), o = t(e[i]);
    if (o === 0)
      return [i, !0];
    o < 0 ? r = i - 1 : n = i + 1;
  }
  return [n, !1];
}
function _f(e, t) {
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
var Ef = class {
  generateSecretKey() {
    return Yt.utils.randomSecretKey();
  }
  getPublicKey(e) {
    return V(Yt.getPublicKey(e));
  }
  finalizeEvent(e, t) {
    const n = e;
    return n.pubkey = V(Yt.getPublicKey(t)), n.id = sn(n), n.sig = V(Yt.sign(G(sn(n)), t)), n[Tt] = !0, n;
  }
  verifyEvent(e) {
    if (typeof e[Tt] == "boolean")
      return e[Tt];
    try {
      const t = sn(e);
      if (t !== e.id)
        return e[Tt] = !1, !1;
      const n = Yt.verify(G(e.sig), G(t), G(e.pubkey));
      return e[Tt] = n, n;
    } catch {
      return e[Tt] = !1, !1;
    }
  }
};
function xf(e) {
  if (!sr(e))
    throw new Error("can't serialize event with wrong or missing properties");
  return JSON.stringify([0, e.pubkey, e.created_at, e.kind, e.tags, e.content]);
}
function sn(e) {
  let t = Me(xe.encode(xf(e)));
  return V(t);
}
var ar = new Ef(), kf = ar.generateSecretKey, mi = ar.getPublicKey, ze = ar.finalizeEvent, lr = ar.verifyEvent, Af = {};
D(Af, {
  Application: () => Ud,
  BadgeAward: () => Of,
  BadgeDefinition: () => Cd,
  BlockedRelaysList: () => dd,
  BlossomServerList: () => bd,
  BookmarkList: () => cd,
  Bookmarksets: () => Rd,
  Calendar: () => qd,
  CalendarEventRSVP: () => Fd,
  ChannelCreation: () => Aa,
  ChannelHideMessage: () => Sa,
  ChannelMessage: () => Ra,
  ChannelMetadata: () => Ia,
  ChannelMuteUser: () => $a,
  ChatMessage: () => Pf,
  ClassifiedListing: () => Hd,
  ClientAuth: () => Ta,
  Comment: () => Vf,
  CommunitiesList: () => ud,
  CommunityDefinition: () => Gd,
  CommunityPostApproval: () => Xf,
  Contacts: () => Cf,
  CreateOrUpdateProduct: () => Od,
  CreateOrUpdateStall: () => Ld,
  Curationsets: () => Sd,
  Date: () => jd,
  DirectMessageRelaysList: () => wd,
  DraftClassifiedListing: () => Dd,
  DraftLong: () => Bd,
  Emojisets: () => Nd,
  EncryptedDirectMessage: () => Tf,
  EventDeletion: () => Lf,
  FavoriteRelays: () => pd,
  FileMessage: () => Nf,
  FileMetadata: () => jf,
  FileServerPreference: () => vd,
  Followsets: () => kd,
  ForumThread: () => Bf,
  GenericRepost: () => Ai,
  Genericlists: () => Ad,
  GiftWrap: () => Ca,
  GroupMetadata: () => Yd,
  HTTPAuth: () => Ii,
  Handlerinformation: () => Wd,
  Handlerrecommendation: () => Zd,
  Highlights: () => id,
  InterestsList: () => gd,
  Interestsets: () => Td,
  JobFeedback: () => ed,
  JobRequest: () => Jf,
  JobResult: () => Qf,
  Label: () => Yf,
  LightningPubRPC: () => _d,
  LiveChatMessage: () => qf,
  LiveEvent: () => Md,
  LongFormArticle: () => Pd,
  Metadata: () => Sf,
  Mutelist: () => sd,
  NWCWalletInfo: () => md,
  NWCWalletRequest: () => La,
  NWCWalletResponse: () => Ed,
  NormalVideo: () => Mf,
  NostrConnect: () => xd,
  OpenTimestamps: () => Hf,
  Photo: () => Uf,
  Pinlist: () => ad,
  Poll: () => Df,
  PollResponse: () => od,
  PrivateDirectMessage: () => ka,
  ProblemTracker: () => Zf,
  ProfileBadges: () => $d,
  PublicChatsList: () => fd,
  Reaction: () => ki,
  RecommendRelay: () => $f,
  RelayList: () => ld,
  RelayReview: () => Kd,
  Relaysets: () => Id,
  Report: () => Wf,
  Reporting: () => Gf,
  Repost: () => xi,
  Seal: () => xa,
  SearchRelaysList: () => hd,
  ShortTextNote: () => Ea,
  ShortVideo: () => zf,
  Time: () => Vd,
  UserEmojiList: () => yd,
  UserStatuses: () => zd,
  Voice: () => Ff,
  VoiceComment: () => Kf,
  Zap: () => rd,
  ZapGoal: () => td,
  ZapRequest: () => nd,
  classifyKind: () => If,
  isAddressableKind: () => Ei,
  isEphemeralKind: () => _a,
  isKind: () => Rf,
  isRegularKind: () => ma,
  isReplaceableKind: () => _i
});
function ma(e) {
  return e < 1e4 && e !== 0 && e !== 3;
}
function _i(e) {
  return e === 0 || e === 3 || 1e4 <= e && e < 2e4;
}
function _a(e) {
  return 2e4 <= e && e < 3e4;
}
function Ei(e) {
  return 3e4 <= e && e < 4e4;
}
function If(e) {
  return ma(e) ? "regular" : _i(e) ? "replaceable" : _a(e) ? "ephemeral" : Ei(e) ? "parameterized" : "unknown";
}
function Rf(e, t) {
  const n = t instanceof Array ? t : [t];
  return sr(e) && n.includes(e.kind) || !1;
}
var Sf = 0, Ea = 1, $f = 2, Cf = 3, Tf = 4, Lf = 5, xi = 6, ki = 7, Of = 8, Pf = 9, Bf = 11, xa = 13, ka = 14, Nf = 15, Ai = 16, Uf = 20, Mf = 21, zf = 22, Aa = 40, Ia = 41, Ra = 42, Sa = 43, $a = 44, Hf = 1040, Ca = 1059, Df = 1068, jf = 1063, Vf = 1111, qf = 1311, Ff = 1222, Kf = 1244, Zf = 1971, Wf = 1984, Gf = 1984, Yf = 1985, Xf = 4550, Jf = 5999, Qf = 6999, ed = 7e3, td = 9041, nd = 9734, rd = 9735, id = 9802, od = 1018, sd = 1e4, ad = 10001, ld = 10002, cd = 10003, ud = 10004, fd = 10005, dd = 10006, hd = 10007, pd = 10012, gd = 10015, yd = 10030, wd = 10050, vd = 10096, bd = 10063, md = 13194, _d = 21e3, Ta = 22242, La = 23194, Ed = 23195, xd = 24133, Ii = 27235, kd = 3e4, Ad = 30001, Id = 30002, Rd = 30003, Sd = 30004, $d = 30008, Cd = 30009, Td = 30015, Ld = 30017, Od = 30018, Pd = 30023, Bd = 30024, Nd = 30030, Ud = 30078, Md = 30311, zd = 30315, Hd = 30402, Dd = 30403, jd = 31922, Vd = 31923, qd = 31924, Fd = 31925, Kd = 31987, Zd = 31989, Wd = 31990, Gd = 34550, Yd = 39e3, Xd = {};
D(Xd, {
  getHex64: () => Ri,
  getInt: () => Oa,
  getSubscriptionId: () => Jd,
  matchEventId: () => Qd,
  matchEventKind: () => th,
  matchEventPubkey: () => eh
});
function Ri(e, t) {
  let n = t.length + 3, r = e.indexOf(`"${t}":`) + n, i = e.slice(r).indexOf('"') + r + 1;
  return e.slice(i, i + 64);
}
function Oa(e, t) {
  let n = t.length, r = e.indexOf(`"${t}":`) + n + 3, i = e.slice(r), o = Math.min(i.indexOf(","), i.indexOf("}"));
  return parseInt(i.slice(0, o), 10);
}
function Jd(e) {
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
function Qd(e, t) {
  return t === Ri(e, "id");
}
function eh(e, t) {
  return t === Ri(e, "pubkey");
}
function th(e, t) {
  return t === Oa(e, "kind");
}
var nh = {};
D(nh, {
  makeAuthEvent: () => rh
});
function rh(e, t) {
  return {
    kind: Ta,
    created_at: Math.floor(Date.now() / 1e3),
    tags: [
      ["relay", e],
      ["challenge", t]
    ],
    content: ""
  };
}
var ih;
try {
  ih = WebSocket;
} catch {
}
var oh;
try {
  oh = WebSocket;
} catch {
}
var Pa = {};
D(Pa, {
  BECH32_REGEX: () => Ba,
  Bech32MaxSize: () => Si,
  NostrTypeGuard: () => sh,
  decode: () => cr,
  decodeNostrURI: () => lh,
  encodeBytes: () => fr,
  naddrEncode: () => ph,
  neventEncode: () => hh,
  noteEncode: () => fh,
  nprofileEncode: () => dh,
  npubEncode: () => uh,
  nsecEncode: () => ch
});
var sh = {
  isNProfile: (e) => /^nprofile1[a-z\d]+$/.test(e || ""),
  isNEvent: (e) => /^nevent1[a-z\d]+$/.test(e || ""),
  isNAddr: (e) => /^naddr1[a-z\d]+$/.test(e || ""),
  isNSec: (e) => /^nsec1[a-z\d]{58}$/.test(e || ""),
  isNPub: (e) => /^npub1[a-z\d]{58}$/.test(e || ""),
  isNote: (e) => /^note1[a-z\d]+$/.test(e || ""),
  isNcryptsec: (e) => /^ncryptsec1[a-z\d]+$/.test(e || "")
}, Si = 5e3, Ba = /[\x21-\x7E]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/;
function ah(e) {
  const t = new Uint8Array(4);
  return t[0] = e >> 24 & 255, t[1] = e >> 16 & 255, t[2] = e >> 8 & 255, t[3] = e & 255, t;
}
function lh(e) {
  try {
    return e.startsWith("nostr:") && (e = e.substring(6)), cr(e);
  } catch {
    return { type: "invalid", data: null };
  }
}
function cr(e) {
  let { prefix: t, words: n } = Zt.decode(e, Si), r = new Uint8Array(Zt.fromWords(n));
  switch (t) {
    case "nprofile": {
      let i = Ar(r);
      if (!i[0]?.[0])
        throw new Error("missing TLV 0 for nprofile");
      if (i[0][0].length !== 32)
        throw new Error("TLV 0 should be 32 bytes");
      return {
        type: "nprofile",
        data: {
          pubkey: V(i[0][0]),
          relays: i[1] ? i[1].map((o) => Ke.decode(o)) : []
        }
      };
    }
    case "nevent": {
      let i = Ar(r);
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
          id: V(i[0][0]),
          relays: i[1] ? i[1].map((o) => Ke.decode(o)) : [],
          author: i[2]?.[0] ? V(i[2][0]) : void 0,
          kind: i[3]?.[0] ? parseInt(V(i[3][0]), 16) : void 0
        }
      };
    }
    case "naddr": {
      let i = Ar(r);
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
          identifier: Ke.decode(i[0][0]),
          pubkey: V(i[2][0]),
          kind: parseInt(V(i[3][0]), 16),
          relays: i[1] ? i[1].map((o) => Ke.decode(o)) : []
        }
      };
    }
    case "nsec":
      return { type: t, data: r };
    case "npub":
    case "note":
      return { type: t, data: V(r) };
    default:
      throw new Error(`unknown prefix ${t}`);
  }
}
function Ar(e) {
  let t = {}, n = e;
  for (; n.length > 0; ) {
    let r = n[0], i = n[1], o = n.slice(2, 2 + i);
    if (n = n.slice(2 + i), o.length < i)
      throw new Error(`not enough data to read on TLV ${r}`);
    t[r] = t[r] || [], t[r].push(o);
  }
  return t;
}
function ch(e) {
  return fr("nsec", e);
}
function uh(e) {
  return fr("npub", G(e));
}
function fh(e) {
  return fr("note", G(e));
}
function ur(e, t) {
  let n = Zt.toWords(t);
  return Zt.encode(e, n, Si);
}
function fr(e, t) {
  return ur(e, t);
}
function dh(e) {
  let t = $i({
    0: [G(e.pubkey)],
    1: (e.relays || []).map((n) => xe.encode(n))
  });
  return ur("nprofile", t);
}
function hh(e) {
  let t;
  e.kind !== void 0 && (t = ah(e.kind));
  let n = $i({
    0: [G(e.id)],
    1: (e.relays || []).map((r) => xe.encode(r)),
    2: e.author ? [G(e.author)] : [],
    3: t ? [new Uint8Array(t)] : []
  });
  return ur("nevent", n);
}
function ph(e) {
  let t = new ArrayBuffer(4);
  new DataView(t).setUint32(0, e.kind, !1);
  let n = $i({
    0: [xe.encode(e.identifier)],
    1: (e.relays || []).map((r) => xe.encode(r)),
    2: [G(e.pubkey)],
    3: [new Uint8Array(t)]
  });
  return ur("naddr", n);
}
function $i(e) {
  let t = [];
  return Object.entries(e).reverse().forEach(([n, r]) => {
    r.forEach((i) => {
      let o = new Uint8Array(i.length + 2);
      o.set([parseInt(n)], 0), o.set([i.length], 1), o.set(i, 2), t.push(o);
    });
  }), pe(...t);
}
var gh = {};
D(gh, {
  decrypt: () => yh,
  encrypt: () => Na
});
function Na(e, t, n) {
  const r = e instanceof Uint8Array ? e : G(e), i = di.getSharedSecret(r, G("02" + t)), o = Ua(i);
  let s = Uint8Array.from(Gt(16)), l = xe.encode(n), a = ga(o, s).encrypt(l), u = ht.encode(new Uint8Array(a)), f = ht.encode(new Uint8Array(s.buffer));
  return `${u}?iv=${f}`;
}
function yh(e, t, n) {
  const r = e instanceof Uint8Array ? e : G(e);
  let [i, o] = n.split("?iv="), s = di.getSharedSecret(r, G("02" + t)), l = Ua(s), a = ht.decode(o), u = ht.decode(i), f = ga(l, a).decrypt(u);
  return Ke.decode(f);
}
function Ua(e) {
  return e.slice(1, 33);
}
var wh = {};
D(wh, {
  NIP05_REGEX: () => Ci,
  isNip05: () => vh,
  isValid: () => _h,
  queryProfile: () => Ma,
  searchDomain: () => mh,
  useFetchImplementation: () => bh
});
var Ci = /^(?:([\w.+-]+)@)?([\w_-]+(\.[\w_-]+)+)$/, vh = (e) => Ci.test(e || ""), dr;
try {
  dr = fetch;
} catch {
}
function bh(e) {
  dr = e;
}
async function mh(e, t = "") {
  try {
    const n = `https://${e}/.well-known/nostr.json?name=${t}`, r = await dr(n, { redirect: "manual" });
    if (r.status !== 200)
      throw Error("Wrong response code");
    return (await r.json()).names;
  } catch {
    return {};
  }
}
async function Ma(e) {
  const t = e.match(Ci);
  if (!t)
    return null;
  const [, n = "_", r] = t;
  try {
    const i = `https://${r}/.well-known/nostr.json?name=${n}`, o = await dr(i, { redirect: "manual" });
    if (o.status !== 200)
      throw Error("Wrong response code");
    const s = await o.json(), l = s.names[n];
    return l ? { pubkey: l, relays: s.relays?.[l] } : null;
  } catch {
    return null;
  }
}
async function _h(e, t) {
  const n = await Ma(t);
  return n ? n.pubkey === e : !1;
}
var Eh = {};
D(Eh, {
  parse: () => xh
});
function xh(e) {
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
      const [s, l, a, u, f] = o, h = {
        id: l,
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
      const [s, l, a] = o;
      t.quotes.push({
        id: l,
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
      let s = t.profiles.find((l) => l.pubkey === i.author);
      s && s.relays && (i.relays || (i.relays = []), s.relays.forEach((l) => {
        i.relays?.indexOf(l) === -1 && i.relays.push(l);
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
var kh = {};
D(kh, {
  fetchRelayInformation: () => Ih,
  useFetchImplementation: () => Ah
});
var za;
try {
  za = fetch;
} catch {
}
function Ah(e) {
  za = e;
}
async function Ih(e) {
  return await (await fetch(e.replace("ws://", "http://").replace("wss://", "https://"), {
    headers: { Accept: "application/nostr+json" }
  })).json();
}
var Rh = {};
D(Rh, {
  getPow: () => Sh,
  minePow: () => Ch
});
function Sh(e) {
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
function $h(e) {
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
function Ch(e, t) {
  let n = 0;
  const r = e, i = ["nonce", n.toString(), t.toString()];
  for (r.tags.push(i); ; ) {
    const o = Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3);
    o !== r.created_at && (n = 0, r.created_at = o), i[1] = (++n).toString();
    const s = Me(
      xe.encode(JSON.stringify([0, r.pubkey, r.created_at, r.kind, r.tags, r.content]))
    );
    if ($h(s) >= t) {
      r.id = V(s);
      break;
    }
  }
  return r;
}
var Th = {};
D(Th, {
  unwrapEvent: () => Vh,
  unwrapManyEvents: () => qh,
  wrapEvent: () => Ja,
  wrapManyEvents: () => jh
});
var Lh = {};
D(Lh, {
  createRumor: () => Wa,
  createSeal: () => Ga,
  createWrap: () => Ya,
  unwrapEvent: () => Bi,
  unwrapManyEvents: () => Xa,
  wrapEvent: () => Xn,
  wrapManyEvents: () => Hh
});
var Oh = {};
D(Oh, {
  decrypt: () => Pi,
  encrypt: () => Oi,
  getConversationKey: () => Ti,
  v2: () => Mh
});
var Ha = 1, Da = 65535;
function Ti(e, t) {
  const n = di.getSharedSecret(e, G("02" + t)).subarray(1, 33);
  return pf(Me, n, xe.encode("nip44-v2"));
}
function ja(e, t) {
  const n = gf(Me, e, t, 76);
  return {
    chacha_key: n.subarray(0, 32),
    chacha_nonce: n.subarray(32, 44),
    hmac_key: n.subarray(44, 76)
  };
}
function Li(e) {
  if (!Number.isSafeInteger(e) || e < 1)
    throw new Error("expected positive integer");
  if (e <= 32)
    return 32;
  const t = 1 << Math.floor(Math.log2(e - 1)) + 1, n = t <= 256 ? 32 : t / 8;
  return n * (Math.floor((e - 1) / n) + 1);
}
function Ph(e) {
  if (!Number.isSafeInteger(e) || e < Ha || e > Da)
    throw new Error("invalid plaintext size: must be between 1 and 65535 bytes");
  const t = new Uint8Array(2);
  return new DataView(t.buffer).setUint16(0, e, !1), t;
}
function Bh(e) {
  const t = xe.encode(e), n = t.length, r = Ph(n), i = new Uint8Array(Li(n) - n);
  return pe(r, t, i);
}
function Nh(e) {
  const t = new DataView(e.buffer).getUint16(0), n = e.subarray(2, 2 + t);
  if (t < Ha || t > Da || n.length !== t || e.length !== 2 + Li(t))
    throw new Error("invalid padding");
  return Ke.decode(n);
}
function Va(e, t, n) {
  if (n.length !== 32)
    throw new Error("AAD associated data must be 32 bytes");
  const r = pe(n, t);
  return wn(Me, e, r);
}
function Uh(e) {
  if (typeof e != "string")
    throw new Error("payload must be a valid string");
  const t = e.length;
  if (t < 132 || t > 87472)
    throw new Error("invalid payload length: " + t);
  if (e[0] === "#")
    throw new Error("unknown encryption version");
  let n;
  try {
    n = ht.decode(e);
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
function Oi(e, t, n = Gt(32)) {
  const { chacha_key: r, chacha_nonce: i, hmac_key: o } = ja(t, n), s = Bh(e), l = va(r, i, s), a = Va(o, l, n);
  return ht.encode(pe(new Uint8Array([2]), n, l, a));
}
function Pi(e, t) {
  const { nonce: n, ciphertext: r, mac: i } = Uh(e), { chacha_key: o, chacha_nonce: s, hmac_key: l } = ja(t, n), a = Va(l, r, n);
  if (!Ku(a, i))
    throw new Error("invalid MAC");
  const u = va(o, s, r);
  return Nh(u);
}
var Mh = {
  utils: {
    getConversationKey: Ti,
    calcPaddedLen: Li
  },
  encrypt: Oi,
  decrypt: Pi
}, zh = 2880 * 60, qa = () => Math.round(Date.now() / 1e3), Fa = () => Math.round(qa() - Math.random() * zh), Ka = (e, t) => Ti(e, t), Za = (e, t, n) => Oi(JSON.stringify(e), Ka(t, n)), Eo = (e, t) => JSON.parse(Pi(e.content, Ka(t, e.pubkey)));
function Wa(e, t) {
  const n = {
    created_at: qa(),
    content: "",
    tags: [],
    ...e,
    pubkey: mi(t)
  };
  return n.id = sn(n), n;
}
function Ga(e, t, n) {
  return ze(
    {
      kind: xa,
      content: Za(e, t, n),
      created_at: Fa(),
      tags: []
    },
    t
  );
}
function Ya(e, t) {
  const n = kf();
  return ze(
    {
      kind: Ca,
      content: Za(e, n, t),
      created_at: Fa(),
      tags: [["p", t]]
    },
    n
  );
}
function Xn(e, t, n) {
  const r = Wa(e, t), i = Ga(r, t, n);
  return Ya(i, n);
}
function Hh(e, t, n) {
  if (!n || n.length === 0)
    throw new Error("At least one recipient is required.");
  const r = mi(t), i = [Xn(e, t, r)];
  return n.forEach((o) => {
    i.push(Xn(e, t, o));
  }), i;
}
function Bi(e, t) {
  const n = Eo(e, t);
  return Eo(n, t);
}
function Xa(e, t) {
  let n = [];
  return e.forEach((r) => {
    n.push(Bi(r, t));
  }), n.sort((r, i) => r.created_at - i.created_at), n;
}
function Dh(e, t, n, r) {
  const i = {
    created_at: Math.ceil(Date.now() / 1e3),
    kind: ka,
    tags: [],
    content: t
  };
  return (Array.isArray(e) ? e : [e]).forEach(({ publicKey: s, relayUrl: l }) => {
    i.tags.push(l ? ["p", s, l] : ["p", s]);
  }), r && i.tags.push(["e", r.eventId, r.relayUrl || "", "reply"]), n && i.tags.push(["subject", n]), i;
}
function Ja(e, t, n, r, i) {
  const o = Dh(t, n, r, i);
  return Xn(o, e, t.publicKey);
}
function jh(e, t, n, r, i) {
  if (!t || t.length === 0)
    throw new Error("At least one recipient is required.");
  return [{ publicKey: mi(e) }, ...t].map(
    (s) => Ja(e, s, n, r, i)
  );
}
var Vh = Bi, qh = Xa, Fh = {};
D(Fh, {
  finishRepostEvent: () => Kh,
  getRepostedEvent: () => Zh,
  getRepostedEventPointer: () => Qa
});
function Kh(e, t, n, r) {
  let i;
  const o = [...e.tags ?? [], ["e", t.id, n], ["p", t.pubkey]];
  return t.kind === Ea ? i = xi : (i = Ai, o.push(["k", String(t.kind)])), ze(
    {
      kind: i,
      tags: o,
      content: e.content === "" || t.tags?.find((s) => s[0] === "-") ? "" : JSON.stringify(t),
      created_at: e.created_at
    },
    r
  );
}
function Qa(e) {
  if (![xi, Ai].includes(e.kind))
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
function Zh(e, { skipVerification: t } = {}) {
  const n = Qa(e);
  if (n === void 0 || e.content === "")
    return;
  let r;
  try {
    r = JSON.parse(e.content);
  } catch {
    return;
  }
  if (r.id === n.id && !(!t && !lr(r)))
    return r;
}
var Wh = {};
D(Wh, {
  NOSTR_URI_REGEX: () => Ni,
  parse: () => Yh,
  test: () => Gh
});
var Ni = new RegExp(`nostr:(${Ba.source})`);
function Gh(e) {
  return typeof e == "string" && new RegExp(`^${Ni.source}$`).test(e);
}
function Yh(e) {
  const t = e.match(new RegExp(`^${Ni.source}$`));
  if (!t)
    throw new Error(`Invalid Nostr URI: ${e}`);
  return {
    uri: t[0],
    value: t[1],
    decoded: cr(t[1])
  };
}
var Xh = {};
D(Xh, {
  finishReactionEvent: () => Jh,
  getReactedEventPointer: () => Qh
});
function Jh(e, t, n) {
  const r = t.tags.filter((i) => i.length >= 2 && (i[0] === "e" || i[0] === "p"));
  return ze(
    {
      ...e,
      kind: ki,
      tags: [...e.tags ?? [], ...r, ["e", t.id], ["p", t.pubkey]],
      content: e.content ?? "+"
    },
    n
  );
}
function Qh(e) {
  if (e.kind !== ki)
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
var ep = {};
D(ep, {
  parse: () => np
});
var Ir = /\W/m, xo = /[^\w\/] |[^\w\/]$|$|,| /m, tp = 42;
function* np(e) {
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
        if (s === 0 || e[s - 1].match(Ir)) {
          const l = e.slice(s + 1, s + tp).match(Ir), a = l ? s + 1 + l.index : n;
          yield { type: "text", text: e.slice(r, s) }, yield { type: "hashtag", value: e.slice(s + 1, a) }, i = a, r = i;
          continue e;
        }
        i = s + 1;
        continue e;
      }
      if (e.slice(o - 5, o) === "nostr") {
        const l = e.slice(o + 60).match(Ir), a = l ? o + 60 + l.index : n;
        try {
          let u, { data: f, type: h } = cr(e.slice(o + 1, a));
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
        const l = e.slice(o + 4).match(xo), a = l ? o + 4 + l.index : n, u = e[o - 1] === "s" ? 5 : 4;
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
        const l = e.slice(o + 4).match(xo), a = l ? o + 4 + l.index : n, u = e[o - 1] === "s" ? 3 : 2;
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
        for (let l = 0; l < t.length; l++) {
          const a = t[l];
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
var rp = {};
D(rp, {
  channelCreateEvent: () => ip,
  channelHideMessageEvent: () => ap,
  channelMessageEvent: () => sp,
  channelMetadataEvent: () => op,
  channelMuteUserEvent: () => lp
});
var ip = (e, t) => {
  let n;
  if (typeof e.content == "object")
    n = JSON.stringify(e.content);
  else if (typeof e.content == "string")
    n = e.content;
  else
    return;
  return ze(
    {
      kind: Aa,
      tags: [...e.tags ?? []],
      content: n,
      created_at: e.created_at
    },
    t
  );
}, op = (e, t) => {
  let n;
  if (typeof e.content == "object")
    n = JSON.stringify(e.content);
  else if (typeof e.content == "string")
    n = e.content;
  else
    return;
  return ze(
    {
      kind: Ia,
      tags: [["e", e.channel_create_event_id], ...e.tags ?? []],
      content: n,
      created_at: e.created_at
    },
    t
  );
}, sp = (e, t) => {
  const n = [["e", e.channel_create_event_id, e.relay_url, "root"]];
  return e.reply_to_channel_message_event_id && n.push(["e", e.reply_to_channel_message_event_id, e.relay_url, "reply"]), ze(
    {
      kind: Ra,
      tags: [...n, ...e.tags ?? []],
      content: e.content,
      created_at: e.created_at
    },
    t
  );
}, ap = (e, t) => {
  let n;
  if (typeof e.content == "object")
    n = JSON.stringify(e.content);
  else if (typeof e.content == "string")
    n = e.content;
  else
    return;
  return ze(
    {
      kind: Sa,
      tags: [["e", e.channel_message_event_id], ...e.tags ?? []],
      content: n,
      created_at: e.created_at
    },
    t
  );
}, lp = (e, t) => {
  let n;
  if (typeof e.content == "object")
    n = JSON.stringify(e.content);
  else if (typeof e.content == "string")
    n = e.content;
  else
    return;
  return ze(
    {
      kind: $a,
      tags: [["p", e.pubkey_to_mute], ...e.tags ?? []],
      content: n,
      created_at: e.created_at
    },
    t
  );
}, cp = {};
D(cp, {
  EMOJI_SHORTCODE_REGEX: () => el,
  matchAll: () => up,
  regex: () => Ui,
  replaceAll: () => fp
});
var el = /:(\w+):/, Ui = () => new RegExp(`\\B${el.source}\\B`, "g");
function* up(e) {
  const t = e.matchAll(Ui());
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
function fp(e, t) {
  return e.replaceAll(Ui(), (n, r) => t({
    shortcode: n,
    name: r
  }));
}
var dp = {};
D(dp, {
  useFetchImplementation: () => hp,
  validateGithub: () => pp
});
var Mi;
try {
  Mi = fetch;
} catch {
}
function hp(e) {
  Mi = e;
}
async function pp(e, t, n) {
  try {
    return await (await Mi(`https://gist.github.com/${t}/${n}/raw`)).text() === `Verifying that I control the following Nostr public key: ${e}`;
  } catch {
    return !1;
  }
}
var gp = {};
D(gp, {
  makeNwcRequestEvent: () => wp,
  parseConnectionString: () => yp
});
function yp(e) {
  const { host: t, pathname: n, searchParams: r } = new URL(e), i = n || t, o = r.get("relay"), s = r.get("secret");
  if (!i || !o || !s)
    throw new Error("invalid connection string");
  return { pubkey: i, relay: o, secret: s };
}
async function wp(e, t, n) {
  const i = Na(t, e, JSON.stringify({
    method: "pay_invoice",
    params: {
      invoice: n
    }
  })), o = {
    kind: La,
    created_at: Math.round(Date.now() / 1e3),
    content: i,
    tags: [["p", e]]
  };
  return ze(o, t);
}
var vp = {};
D(vp, {
  normalizeIdentifier: () => bp
});
function bp(e) {
  return e = e.trim().toLowerCase(), e = e.normalize("NFKC"), Array.from(e).map((t) => new RegExp("\\p{Letter}", "u").test(t) || new RegExp("\\p{Number}", "u").test(t) ? t : "-").join("");
}
var mp = {};
D(mp, {
  getSatoshisAmountFromBolt11: () => Ip,
  getZapEndpoint: () => Ep,
  makeZapReceipt: () => Ap,
  makeZapRequest: () => xp,
  useFetchImplementation: () => _p,
  validateZapRequest: () => kp
});
var zi;
try {
  zi = fetch;
} catch {
}
function _p(e) {
  zi = e;
}
async function Ep(e) {
  try {
    let t = "", { lud06: n, lud16: r } = JSON.parse(e.content);
    if (r) {
      let [s, l] = r.split("@");
      t = new URL(`/.well-known/lnurlp/${s}`, `https://${l}`).toString();
    } else if (n) {
      let { words: s } = Zt.decode(n, 1e3), l = Zt.fromWords(s);
      t = Ke.decode(l);
    } else
      return null;
    let o = await (await zi(t)).json();
    if (o.allowsNostr && o.nostrPubkey)
      return o.callback;
  } catch {
  }
  return null;
}
function xp(e) {
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
    if (t.tags.push(["e", e.event.id]), _i(e.event.kind)) {
      const n = ["a", `${e.event.kind}:${e.event.pubkey}:`];
      t.tags.push(n);
    } else if (Ei(e.event.kind)) {
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
function kp(e) {
  let t;
  try {
    t = JSON.parse(e);
  } catch {
    return "Invalid zap request JSON.";
  }
  if (!sr(t))
    return "Zap request is not a valid Nostr event.";
  if (!lr(t))
    return "Invalid signature on zap request.";
  let n = t.tags.find(([o, s]) => o === "p" && s);
  if (!n)
    return "Zap request doesn't have a 'p' tag.";
  if (!n[1].match(/^[a-f0-9]{64}$/))
    return "Zap request 'p' tag is not valid hex.";
  let r = t.tags.find(([o, s]) => o === "e" && s);
  return r && !r[1].match(/^[a-f0-9]{64}$/) ? "Zap request 'e' tag is not valid hex." : t.tags.find(([o, s]) => o === "relays" && s) ? null : "Zap request doesn't have a 'relays' tag.";
}
function Ap({
  zapRequest: e,
  preimage: t,
  bolt11: n,
  paidAt: r
}) {
  let i = JSON.parse(e), o = i.tags.filter(([l]) => l === "e" || l === "p" || l === "a"), s = {
    kind: 9735,
    created_at: Math.round(r.getTime() / 1e3),
    content: "",
    tags: [...o, ["P", i.pubkey], ["bolt11", n], ["description", e]]
  };
  return t && s.tags.push(["preimage", t]), s;
}
function Ip(e) {
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
  let l = r.length - 1;
  if (s && l++, l < 1)
    return 0;
  const a = parseInt(r.substring(0, l));
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
var Rp = {};
D(Rp, {
  Negentropy: () => nl,
  NegentropyStorageVector: () => Cp,
  NegentropySync: () => Tp
});
var Rr = 97, Mt = 32, tl = 16, yt = {
  Skip: 0,
  Fingerprint: 1,
  IdList: 2
}, Ve = class {
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
    if (e instanceof Ve && (e = e.unwrap()), typeof e.length != "number")
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
function In(e) {
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
    return new Ve(new Uint8Array([0]));
  let t = [];
  for (; e !== 0; )
    t.push(e & 127), e >>>= 7;
  t.reverse();
  for (let n = 0; n < t.length - 1; n++)
    t[n] |= 128;
  return new Ve(new Uint8Array(t));
}
function Sp(e) {
  return Pn(e, 1)[0];
}
function Pn(e, t) {
  if (e.length < t)
    throw Error("parse ends prematurely");
  return e.shiftN(t);
}
var $p = class {
  buf;
  constructor() {
    this.setToZero();
  }
  setToZero() {
    this.buf = new Uint8Array(Mt);
  }
  add(e) {
    let t = 0, n = 0, r = new DataView(this.buf.buffer), i = new DataView(e.buffer);
    for (let o = 0; o < 8; o++) {
      let s = o * 4, l = r.getUint32(s, !0), a = i.getUint32(s, !0), u = l;
      u += t, u += a, u > 4294967295 && (n = 1), r.setUint32(s, u & 4294967295, !0), t = n, n = 0;
    }
  }
  negate() {
    let e = new DataView(this.buf.buffer);
    for (let n = 0; n < 8; n++) {
      let r = n * 4;
      e.setUint32(r, ~e.getUint32(r, !0));
    }
    let t = new Uint8Array(Mt);
    t[0] = 1, this.add(t);
  }
  getFingerprint(e) {
    let t = new Ve();
    return t.extend(this.buf), t.extend(De(e)), Me(t.unwrap()).subarray(0, tl);
  }
}, Cp = class {
  items;
  sealed;
  constructor() {
    this.items = [], this.sealed = !1;
  }
  insert(e, t) {
    if (this.sealed)
      throw Error("already sealed");
    const n = G(t);
    if (n.byteLength !== Mt)
      throw Error("bad id size for added item");
    this.items.push({ timestamp: e, id: n });
  }
  seal() {
    if (this.sealed)
      throw Error("already sealed");
    this.sealed = !0, this.items.sort(Sr);
    for (let e = 1; e < this.items.length; e++)
      if (Sr(this.items[e - 1], this.items[e]) === 0)
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
    return this._checkSealed(), this._checkBounds(e, t), this._binarySearch(this.items, e, t, (r) => Sr(r, n) < 0);
  }
  fingerprint(e, t) {
    let n = new $p();
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
}, nl = class {
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
    let e = new Ve();
    return e.extend(new Uint8Array([Rr])), this.splitRange(0, this.storage.size(), this._bound(Number.MAX_VALUE), e), V(e.unwrap());
  }
  reconcile(e, t, n) {
    const r = new Ve(G(e));
    this.lastTimestampIn = this.lastTimestampOut = 0;
    let i = new Ve();
    i.extend(new Uint8Array([Rr]));
    let o = Sp(r);
    if (o < 96 || o > 111)
      throw Error("invalid negentropy protocol version byte");
    if (o !== Rr)
      throw Error("unsupported negentropy protocol version requested: " + (o - 96));
    let s = this.storage.size(), l = this._bound(0), a = 0, u = !1;
    for (; r.length !== 0; ) {
      let f = new Ve(), h = () => {
        u && (u = !1, f.extend(this.encodeBound(l)), f.extend(De(yt.Skip)));
      }, w = this.decodeBound(r), y = In(r), c = a, d = this.storage.findLowerBound(a, s, w);
      if (y === yt.Skip)
        u = !0;
      else if (y === yt.Fingerprint) {
        let g = Pn(r, tl), p = this.storage.fingerprint(c, d);
        rl(g, p) !== 0 ? (h(), this.splitRange(c, d, w, f)) : u = !0;
      } else if (y === yt.IdList) {
        let g = In(r), p = {};
        for (let v = 0; v < g; v++) {
          let b = Pn(r, Mt);
          p[V(b)] = b;
        }
        if (u = !0, this.storage.iterate(c, d, (v) => {
          let b = v.id;
          const C = V(b);
          return p[C] ? delete p[V(b)] : t?.(C), !0;
        }), n)
          for (let v of Object.values(p))
            n(V(v));
      } else
        throw Error("unexpected mode");
      if (this.exceededFrameSizeLimit(i.length + f.length)) {
        let g = this.storage.fingerprint(d, s);
        i.extend(this.encodeBound(this._bound(Number.MAX_VALUE))), i.extend(De(yt.Fingerprint)), i.extend(g);
        break;
      } else
        i.extend(f);
      a = d, l = w;
    }
    return i.length === 1 ? null : V(i.unwrap());
  }
  splitRange(e, t, n, r) {
    let i = t - e, o = 16;
    if (i < o * 2)
      r.extend(this.encodeBound(n)), r.extend(De(yt.IdList)), r.extend(De(i)), this.storage.iterate(e, t, (s) => (r.extend(s.id), !0));
    else {
      let s = Math.floor(i / o), l = i % o, a = e;
      for (let u = 0; u < o; u++) {
        let f = s + (u < l ? 1 : 0), h = this.storage.fingerprint(a, a + f);
        a += f;
        let w;
        if (a === t)
          w = n;
        else {
          let y, c;
          this.storage.iterate(a - 1, a + 1, (d, g) => (g === a - 1 ? y = d : c = d, !0)), w = this.getMinimalBound(y, c);
        }
        r.extend(this.encodeBound(w)), r.extend(De(yt.Fingerprint)), r.extend(h);
      }
    }
  }
  exceededFrameSizeLimit(e) {
    return e > this.frameSizeLimit - 200;
  }
  decodeTimestampIn(e) {
    let t = In(e);
    return t = t === 0 ? Number.MAX_VALUE : t - 1, this.lastTimestampIn === Number.MAX_VALUE || t === Number.MAX_VALUE ? (this.lastTimestampIn = Number.MAX_VALUE, Number.MAX_VALUE) : (t += this.lastTimestampIn, this.lastTimestampIn = t, t);
  }
  decodeBound(e) {
    let t = this.decodeTimestampIn(e), n = In(e);
    if (n > Mt)
      throw Error("bound key too long");
    let r = Pn(e, n);
    return { timestamp: t, id: r };
  }
  encodeTimestampOut(e) {
    if (e === Number.MAX_VALUE)
      return this.lastTimestampOut = Number.MAX_VALUE, De(0);
    let t = e;
    return e -= this.lastTimestampOut, this.lastTimestampOut = t, De(e + 1);
  }
  encodeBound(e) {
    let t = new Ve();
    return t.extend(this.encodeTimestampOut(e.timestamp)), t.extend(De(e.id.length)), t.extend(e.id), t;
  }
  getMinimalBound(e, t) {
    if (t.timestamp !== e.timestamp)
      return this._bound(t.timestamp);
    {
      let n = 0, r = t.id, i = e.id;
      for (let o = 0; o < Mt && r[o] === i[o]; o++)
        n++;
      return this._bound(t.timestamp, t.id.subarray(0, n + 1));
    }
  }
};
function rl(e, t) {
  for (let n = 0; n < e.byteLength; n++) {
    if (e[n] < t[n])
      return -1;
    if (e[n] > t[n])
      return 1;
  }
  return e.byteLength > t.byteLength ? 1 : e.byteLength < t.byteLength ? -1 : 0;
}
function Sr(e, t) {
  return e.timestamp === t.timestamp ? rl(e.id, t.id) : e.timestamp - t.timestamp;
}
var Tp = class {
  relay;
  storage;
  neg;
  filter;
  subscription;
  onhave;
  onneed;
  constructor(e, t, n, r = {}) {
    this.relay = e, this.storage = t, this.neg = new nl(t), this.onhave = r.onhave, this.onneed = r.onneed, this.filter = n, this.subscription = this.relay.prepareSubscription([{}], { label: r.label || "negentropy" }), this.subscription.oncustom = (i) => {
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
}, Lp = {};
D(Lp, {
  getToken: () => Op,
  hashPayload: () => Hi,
  unpackEventFromToken: () => ol,
  validateEvent: () => fl,
  validateEventKind: () => al,
  validateEventMethodTag: () => cl,
  validateEventPayloadTag: () => ul,
  validateEventTimestamp: () => sl,
  validateEventUrlTag: () => ll,
  validateToken: () => Pp
});
var il = "Nostr ";
async function Op(e, t, n, r = !1, i) {
  const o = {
    kind: Ii,
    tags: [
      ["u", e],
      ["method", t]
    ],
    created_at: Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3),
    content: ""
  };
  i && o.tags.push(["payload", Hi(i)]);
  const s = await n(o);
  return (r ? il : "") + ht.encode(xe.encode(JSON.stringify(s)));
}
async function Pp(e, t, n) {
  const r = await ol(e).catch((o) => {
    throw o;
  });
  return await fl(r, t, n).catch((o) => {
    throw o;
  });
}
async function ol(e) {
  if (!e)
    throw new Error("Missing token");
  e = e.replace(il, "");
  const t = Ke.decode(ht.decode(e));
  if (!t || t.length === 0 || !t.startsWith("{"))
    throw new Error("Invalid token");
  return JSON.parse(t);
}
function sl(e) {
  return e.created_at ? Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3) - e.created_at < 60 : !1;
}
function al(e) {
  return e.kind === Ii;
}
function ll(e, t) {
  const n = e.tags.find((r) => r[0] === "u");
  return n ? n.length > 0 && n[1] === t : !1;
}
function cl(e, t) {
  const n = e.tags.find((r) => r[0] === "method");
  return n ? n.length > 0 && n[1].toLowerCase() === t.toLowerCase() : !1;
}
function Hi(e) {
  const t = Me(xe.encode(JSON.stringify(e)));
  return V(t);
}
function ul(e, t) {
  const n = e.tags.find((i) => i[0] === "payload");
  if (!n)
    return !1;
  const r = Hi(t);
  return n.length > 0 && n[1] === r;
}
async function fl(e, t, n, r) {
  if (!lr(e))
    throw new Error("Invalid nostr event, signature invalid");
  if (!al(e))
    throw new Error("Invalid nostr event, kind invalid");
  if (!sl(e))
    throw new Error("Invalid nostr event, created_at timestamp invalid");
  if (!ll(e, t))
    throw new Error("Invalid nostr event, url tag invalid");
  if (!cl(e, n))
    throw new Error("Invalid nostr event, method tag invalid");
  if (r && typeof r == "object" && Object.keys(r).length > 0 && !ul(e, r))
    throw new Error("Invalid nostr event, payload tag does not match request body hash");
  return !0;
}
const _0 = [
  "wss://purplepag.es/",
  "wss://directory.yabu.me/",
  "wss://indexer.coracle.social/",
  "wss://user.kindpag.es/"
], E0 = [
  "wss://nos.lol/",
  "wss://relay.nostr.wirednet.jp/",
  "wss://yabu.me/",
  "wss://x.kojira.io/"
], Bp = [
  "wss://relay.damus.io/",
  "wss://relay.nostr.band/",
  "wss://nrelay.c-stellar.net/",
  "wss://nrelay-jp.c-stellar.net/"
], ko = /* @__PURE__ */ new Set(["ws:", "wss:"]), Np = new Set(Bp);
class x0 {
  static parseKind10002Tags(t) {
    const n = {};
    return t.filter((r) => Array.isArray(r) && r.length >= 2 && r[0] === "r").forEach((r) => {
      const i = r[1];
      if (!i || typeof i != "string") return;
      let o = !0, s = !0;
      r.length > 2 && (r.length === 3 ? r[2] === "read" ? s = !1 : r[2] === "write" && (o = !1) : (o = r.includes("read"), s = r.includes("write"))), n[i] = { read: o, write: s };
    }), n;
  }
  static parseKind3Content(t) {
    try {
      const n = JSON.parse(t);
      return n && typeof n == "object" && !Array.isArray(n) ? n : null;
    } catch {
      return null;
    }
  }
  static isValidRelayConfig(t) {
    return t ? Array.isArray(t) ? t.every((n) => typeof n == "string") : typeof t == "object" ? Object.entries(t).every(
      ([n, r]) => typeof n == "string" && r && typeof r == "object" && "read" in r && "write" in r && typeof r.read == "boolean" && typeof r.write == "boolean"
    ) : !1 : !1;
  }
}
class Xe {
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
    return n !== null && Np.has(n);
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
        if (!ko.has(o.protocol) || o.username || o.password)
          return null;
      }
      const r = ba.normalizeURL(n), i = new URL(r);
      return !ko.has(i.protocol) || !i.hostname || i.username || i.password ? null : r;
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
function Up(e) {
  if (typeof e != "string" || !e.trim().includes("://"))
    return !1;
  try {
    const t = new URL(e.trim());
    return (t.protocol === "ws:" || t.protocol === "wss:") && !t.username && !t.password && Xe.normalizeExternalRelayUrl(e) !== null;
  } catch {
    return !1;
  }
}
function Mp(e, t = {}) {
  try {
    const n = Pa.decode(e);
    if (n.type === "nevent") {
      const r = n.data, i = Array.isArray(r.relays) ? r.relays : [];
      return t.relayValidation === "strict" && i.some((o) => !Up(o)) ? null : {
        eventId: r.id,
        relayHints: Xe.sanitizeExternalRelayUrls(
          i.filter((o) => typeof o == "string"),
          { limit: Xe.EXTERNAL_INPUT_RELAY_LIMIT }
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
const zp = /^[0-9a-f]{64}$/i;
function Ze(e) {
  return typeof e == "string" && zp.test(e);
}
function Ao(e, t) {
  const n = e.filter((r) => r[0] === t).map((r) => r[1]);
  if (n.length !== 0)
    return n.some((r) => typeof r != "string" || !r) || new Set(n).size !== 1 ? null : n[0];
}
function Io(e, t, n = {}) {
  const r = [];
  let i = !1;
  for (const s of t) {
    const l = e.filter((a) => a[0] === s);
    l.length > 1 && (i = !0);
    for (const a of l) {
      const u = a[1];
      !(s.toLowerCase() === "e" ? Ze(u) : typeof u == "string" && u.trim().length > 0) || (s === "E" || s === "e") && typeof a[3] == "string" && !Ze(a[3]) ? i = !0 : r.push([...a]);
    }
  }
  const o = n.allowAddressableVersionPair === !0 && r.length === 2 && r.filter((s) => s[0] === "a").length === 1 && r.filter((s) => s[0] === "e").length === 1;
  return r.length !== 1 && !o && (i = !0), { tags: r, invalid: i };
}
function Ro(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function So(e, t, n) {
  const r = t.filter((o) => o[0] === n).map((o) => o[3]).find((o) => Ze(o)) ?? null, i = e.some((o) => !Ze(o)) || !!r && !e.includes(r);
  return {
    pubkey: r ?? e.find((o) => Ze(o)) ?? null,
    invalid: i
  };
}
function Hp(e) {
  const t = {
    valid: !1,
    reason: "unsupported-kind",
    rootTags: [],
    rootKind: null,
    rootPubkey: null,
    rootEventId: null,
    parentTags: [],
    parentKind: null,
    parentPubkey: null,
    parentEventId: null,
    relayHints: []
  };
  if (e.kind !== 1111) return t;
  const n = e.tags, r = Io(n, ["E", "A", "I"]), i = Io(n, ["e", "a", "i"], {
    allowAddressableVersionPair: !0
  }), o = Ao(n, "K"), s = Ao(n, "k"), l = n.filter((p) => p[0] === "P").map((p) => p[1] ?? ""), a = n.filter((p) => p[0] === "p").map((p) => p[1] ?? ""), u = So(l, r.tags, "E"), f = So(a, i.tags, "e"), h = u.pubkey, w = f.pubkey, y = r.tags.find((p) => p[0] === "E")?.[1] ?? null, c = i.tags.find((p) => p[0] === "e")?.[1] ?? null, d = Xe.sanitizeExternalRelayUrls([
    ...r.tags.filter((p) => p[0] === "E" || p[0] === "A").map((p) => p[2]),
    ...i.tags.filter((p) => p[0] === "e" || p[0] === "a").map((p) => p[2])
  ]);
  let g = null;
  return r.invalid || r.tags.length !== 1 ? g = "invalid-root-reference" : i.invalid || i.tags.length === 0 ? g = "invalid-parent-reference" : !Ro(o) || !Ro(s) ? g = "missing-kind-tag" : l.length === 0 && r.tags[0]?.[0] !== "I" || a.length === 0 && i.tags[0]?.[0] !== "i" ? g = "missing-author-tag" : (u.invalid || f.invalid) && (g = "invalid-author-tag"), {
    valid: g === null,
    reason: g,
    rootTags: r.tags,
    rootKind: typeof o == "string" ? o : null,
    rootPubkey: h,
    rootEventId: y,
    parentTags: i.tags,
    parentKind: typeof s == "string" ? s : null,
    parentPubkey: w,
    parentEventId: c,
    relayHints: d
  };
}
const zt = {
  rootId: null,
  replyId: null,
  parentId: null,
  rootRelayHint: null,
  replyRelayHint: null,
  rootAuthorHint: null,
  replyAuthorHint: null,
  mentionEventIds: [],
  ignoredEventIds: [],
  relayHints: [],
  authorHints: [],
  isLegacy: !1,
  channelEventId: null,
  channelRelayHints: [],
  issues: []
};
function Di(e) {
  if (typeof e != "string")
    return null;
  const t = e.trim().toLowerCase();
  return t.length > 0 ? t : null;
}
function ji(e) {
  const t = e[1];
  if (!Ze(t))
    return null;
  const n = Xe.sanitizeExternalRelayUrls(
    typeof e[2] == "string" && e[2].length > 0 ? [e[2]] : [],
    { limit: 1 }
  )[0] ?? null, r = Ze(e[4]) ? e[4] : null;
  return {
    eventId: t,
    relayHint: n,
    marker: Di(e[3]),
    authorHint: r
  };
}
function le(e) {
  const t = /* @__PURE__ */ new Set(), n = [];
  for (const r of e)
    !r || t.has(r) || (t.add(r), n.push(r));
  return n;
}
function $o(e, t) {
  const n = e.filter(
    (s) => Array.isArray(s) && s[0] === "e" && Di(s[3]) === t
  ), r = n.map(ji).filter((s) => s !== null), i = le(r.map((s) => s.eventId)), o = i.length === 1 ? r.filter((s) => s.eventId === i[0]) : [];
  return {
    reference: o[0] ?? null,
    relayHints: le(o.map((s) => s.relayHint)),
    authorHints: le(o.map((s) => s.authorHint)),
    hasInvalidId: n.length !== r.length,
    hasConflict: i.length > 1
  };
}
function $r(e) {
  if (typeof e != "string")
    return null;
  const t = e.trim().toLowerCase();
  return t.length === 0 || Ze(t) ? null : t === "reply" || t === "root" ? t : "unknown";
}
function k0(e) {
  if (!e || e.kind !== 7)
    return null;
  const t = e.tags.filter(
    (o) => Array.isArray(o) && o[0] === "e" && Ze(o[1])
  );
  if (t.length === 0)
    return null;
  const n = [...t].reverse().find((o) => $r(o[3]) === "reply");
  if (n)
    return n[1];
  const r = [...t].reverse().find((o) => $r(o[3]) === null);
  if (r)
    return r[1];
  const i = [...t].reverse().find((o) => $r(o[3]) === "root");
  return i ? i[1] : t[t.length - 1][1];
}
function Dp(e) {
  if (!e || e.kind !== 1)
    return { ...zt };
  const t = e.tags.filter((w) => Array.isArray(w) && w[0] === "e").map(ji).filter((w) => w !== null);
  if (t.length === 0)
    return { ...zt };
  const n = t.find((w) => w.marker === "root") ?? null, r = [...t].reverse().find((w) => w.marker === "reply") ?? null, i = t.filter((w) => w.marker === "mention"), o = t.filter(
    (w) => w.marker !== null && w.marker !== "root" && w.marker !== "reply" && w.marker !== "mention"
  ), s = [n, r].filter(
    (w) => w !== null
  ), l = le(t.map((w) => w.relayHint)), a = le(t.map((w) => w.authorHint));
  if (s.length > 0)
    return {
      rootId: n?.eventId ?? null,
      replyId: r?.eventId ?? null,
      parentId: r?.eventId ?? n?.eventId ?? null,
      rootRelayHint: n?.relayHint ?? null,
      replyRelayHint: r?.relayHint ?? null,
      rootAuthorHint: n?.authorHint ?? null,
      replyAuthorHint: r?.authorHint ?? null,
      mentionEventIds: le(i.map((w) => w.eventId)),
      ignoredEventIds: le(o.map((w) => w.eventId)),
      relayHints: l,
      authorHints: a,
      isLegacy: !1,
      channelEventId: null,
      channelRelayHints: [],
      issues: []
    };
  const u = t.filter((w) => w.marker === null);
  if (u.length === 0)
    return {
      ...zt,
      mentionEventIds: le(i.map((w) => w.eventId)),
      ignoredEventIds: le(o.map((w) => w.eventId)),
      relayHints: l,
      authorHints: a
    };
  const f = u[0], h = u[u.length - 1];
  return {
    rootId: f.eventId,
    replyId: u.length > 1 ? h.eventId : null,
    parentId: h.eventId,
    rootRelayHint: f.relayHint,
    replyRelayHint: u.length > 1 ? h.relayHint : null,
    rootAuthorHint: f.authorHint,
    replyAuthorHint: u.length > 1 ? h.authorHint : null,
    mentionEventIds: le(i.map((w) => w.eventId)),
    ignoredEventIds: le(o.map((w) => w.eventId)),
    relayHints: l,
    authorHints: a,
    isLegacy: !0,
    channelEventId: null,
    channelRelayHints: [],
    issues: []
  };
}
function dl(e) {
  if (!e || e.kind !== 42)
    return { ...zt };
  const t = $o(e.tags, "root"), n = $o(e.tags, "reply"), r = e.tags.filter((h) => Array.isArray(h) && h[0] === "e").map(ji).filter((h) => h !== null), i = r.filter((h) => h.marker === "mention"), o = r.filter(
    (h) => h.marker !== null && h.marker !== "root" && h.marker !== "reply" && h.marker !== "mention"
  ), s = [];
  e.tags.some(
    (h) => Array.isArray(h) && h[0] === "e" && Di(h[3]) === "root"
  ) ? (!t.reference && !t.hasConflict || t.hasInvalidId) && s.push("invalid-channel-root") : s.push("missing-channel-root"), t.hasConflict && s.push("conflicting-channel-roots"), n.hasInvalidId && s.push("invalid-reply-target"), n.hasConflict && s.push("conflicting-reply-targets"), t.reference && n.reference && t.reference.eventId === n.reference.eventId && s.push("reply-target-is-channel");
  const l = !!t.reference && !t.hasConflict, a = !!n.reference && !n.hasConflict && !s.includes("reply-target-is-channel"), u = l ? t.relayHints : [], f = a ? n.relayHints : [];
  return {
    rootId: null,
    replyId: a ? n.reference?.eventId ?? null : null,
    parentId: a ? n.reference?.eventId ?? null : null,
    rootRelayHint: u[0] ?? null,
    replyRelayHint: f[0] ?? null,
    rootAuthorHint: l ? t.authorHints[0] ?? null : null,
    replyAuthorHint: a ? n.authorHints[0] ?? null : null,
    mentionEventIds: le(i.map((h) => h.eventId)),
    ignoredEventIds: le(o.map((h) => h.eventId)),
    relayHints: le([...u, ...f]),
    authorHints: le([
      ...l ? t.authorHints : [],
      ...a ? n.authorHints : []
    ]),
    isLegacy: !1,
    channelEventId: l ? t.reference?.eventId ?? null : null,
    channelRelayHints: u,
    issues: s
  };
}
function A0(e) {
  if (e?.kind === 1)
    return Dp(e);
  if (e?.kind === 42)
    return dl(e);
  if (e?.kind === 1111) {
    const t = Hp(e);
    return {
      ...zt,
      rootId: t.rootEventId,
      parentId: t.parentEventId,
      rootRelayHint: t.rootTags.find((n) => n[0] === "E" || n[0] === "A")?.[2] ?? null,
      replyRelayHint: t.parentTags.find((n) => n[0] === "e" || n[0] === "a")?.[2] ?? null,
      rootAuthorHint: t.rootPubkey,
      replyAuthorHint: t.parentPubkey,
      relayHints: t.relayHints,
      authorHints: [t.rootPubkey, t.parentPubkey].filter((n) => !!n),
      rootKind: t.rootKind,
      parentKind: t.parentKind,
      rootPubkey: t.rootPubkey,
      parentPubkey: t.parentPubkey,
      rootReferenceTags: t.rootTags.map((n) => [...n]),
      parentReferenceTags: t.parentTags.map((n) => [...n]),
      issues: t.valid ? [] : ["invalid-nip22-reference"]
    };
  }
  return { ...zt };
}
function I0(e) {
  return !!e.parentId && !e.issues.includes("conflicting-reply-targets") && !e.issues.includes("reply-target-is-channel") && !e.issues.includes("invalid-nip22-reference");
}
function hl(e) {
  return e.map((t) => [...t]);
}
function pl(e, t) {
  return !Array.isArray(e) || e.length !== t.length ? !1 : e.every((n, r) => !Array.isArray(n) || n.length !== t[r].length ? !1 : n.every((i, o) => i === t[r][o]));
}
function R0(e) {
  return {
    ...e,
    tags: hl(e.tags)
  };
}
function Co(e) {
  return {
    id: e.id,
    pubkey: e.pubkey,
    created_at: e.created_at,
    kind: e.kind,
    tags: hl(e.tags),
    content: e.content,
    sig: e.sig
  };
}
function gl(e) {
  if (!e || typeof e != "object")
    return !1;
  const t = e;
  return typeof t.id == "string" && typeof t.pubkey == "string" && typeof t.kind == "number" && typeof t.content == "string" && typeof t.created_at == "number" && typeof t.sig == "string" && Array.isArray(t.tags) && t.tags.every(
    (n) => Array.isArray(n) && n.every((r) => typeof r == "string")
  );
}
function S0(e, t) {
  if (!e || typeof e != "object")
    return !1;
  const n = e;
  return n.id === t.id && n.pubkey === t.pubkey && n.kind === t.kind && n.content === t.content && n.created_at === t.created_at && n.sig === t.sig && pl(n.tags, t.tags);
}
function $0(e) {
  if (e.kind !== 42)
    return {};
  const t = dl(e);
  return t.channelEventId ? {
    channelEventId: t.channelEventId,
    ...t.channelRelayHints.length > 0 ? { channelRelayHints: t.channelRelayHints } : {}
  } : {};
}
function C0(e, t) {
  return gl(e) && e.id === t.eventId && e.pubkey === t.pubkeyHex && e.kind === t.kind && e.content === t.content && e.created_at === t.createdAt && pl(e.tags, t.tags);
}
var Bn = { exports: {} }, jp = Bn.exports, To;
function Vp() {
  return To || (To = 1, (function(e) {
    (function(t) {
      const n = "(0?\\d+|0x[a-f0-9]+)", r = {
        fourOctet: new RegExp(`^${n}\\.${n}\\.${n}\\.${n}$`, "i"),
        threeOctet: new RegExp(`^${n}\\.${n}\\.${n}$`, "i"),
        twoOctet: new RegExp(`^${n}\\.${n}$`, "i"),
        longValue: new RegExp(`^${n}$`, "i")
      }, i = new RegExp("^0[0-7]+$", "i"), o = new RegExp("^0x[a-f0-9]+$", "i"), s = "%[0-9a-z]{1,}", l = "(?:[0-9a-f]+::?)+", a = {
        zoneIndex: new RegExp(s, "i"),
        native: new RegExp(`^(::)?(${l})?([0-9a-f]+)?(::)?(${s})?$`, "i"),
        deprecatedTransitional: new RegExp(`^(?:::)(${n}\\.${n}\\.${n}\\.${n}(${s})?)$`, "i"),
        transitional: new RegExp(`^((?:${l})|(?:::)(?:${l})?)${n}\\.${n}\\.${n}\\.${n}(${s})?$`, "i")
      };
      function u(c, d) {
        if (c.indexOf("::") !== c.lastIndexOf("::"))
          return null;
        let g = 0, p = -1, v = (c.match(a.zoneIndex) || [])[0], b, C;
        for (v && (v = v.substring(1), c = c.replace(/%.+$/, "")); (p = c.indexOf(":", p + 1)) >= 0; )
          g++;
        if (c.substr(0, 2) === "::" && g--, c.substr(-2, 2) === "::" && g--, g > d)
          return null;
        for (C = d - g, b = ":"; C--; )
          b += "0:";
        return c = c.replace("::", b), c[0] === ":" && (c = c.slice(1)), c[c.length - 1] === ":" && (c = c.slice(0, -1)), d = (function() {
          const ae = c.split(":"), z = [];
          for (let q = 0; q < ae.length; q++)
            z.push(parseInt(ae[q], 16));
          return z;
        })(), {
          parts: d,
          zoneId: v
        };
      }
      function f(c, d, g, p) {
        if (c.length !== d.length)
          throw new Error("ipaddr: cannot match CIDR for objects with different lengths");
        let v = 0, b;
        for (; p > 0; ) {
          if (b = g - p, b < 0 && (b = 0), c[v] >> b !== d[v] >> b)
            return !1;
          p -= g, v += 1;
        }
        return !0;
      }
      function h(c) {
        if (o.test(c))
          return parseInt(c, 16);
        if (c[0] === "0" && !isNaN(parseInt(c[1], 10))) {
          if (i.test(c))
            return parseInt(c, 8);
          throw new Error(`ipaddr: cannot parse ${c} as octal`);
        }
        return parseInt(c, 10);
      }
      function w(c, d) {
        for (; c.length < d; )
          c = `0${c}`;
        return c;
      }
      const y = {};
      y.IPv4 = (function() {
        function c(d) {
          if (d.length !== 4)
            throw new Error("ipaddr: ipv4 octet count should be 4");
          let g, p;
          for (g = 0; g < d.length; g++)
            if (p = d[g], !(0 <= p && p <= 255))
              throw new Error("ipaddr: ipv4 octet should fit in 8 bits");
          this.octets = d;
        }
        return c.prototype.SpecialRanges = {
          unspecified: [[new c([0, 0, 0, 0]), 8]],
          broadcast: [[new c([255, 255, 255, 255]), 32]],
          // RFC3171
          multicast: [[new c([224, 0, 0, 0]), 4]],
          // RFC3927
          linkLocal: [[new c([169, 254, 0, 0]), 16]],
          // RFC5735
          loopback: [[new c([127, 0, 0, 0]), 8]],
          // RFC6598
          carrierGradeNat: [[new c([100, 64, 0, 0]), 10]],
          // RFC1918
          private: [
            [new c([10, 0, 0, 0]), 8],
            [new c([172, 16, 0, 0]), 12],
            [new c([192, 168, 0, 0]), 16]
          ],
          // Reserved and testing-only ranges; RFCs 5735, 5737, 2544, 1700
          reserved: [
            [new c([192, 0, 0, 0]), 24],
            [new c([192, 0, 2, 0]), 24],
            [new c([192, 88, 99, 0]), 24],
            [new c([198, 18, 0, 0]), 15],
            [new c([198, 51, 100, 0]), 24],
            [new c([203, 0, 113, 0]), 24],
            [new c([240, 0, 0, 0]), 4]
          ],
          // RFC7534, RFC7535
          as112: [
            [new c([192, 175, 48, 0]), 24],
            [new c([192, 31, 196, 0]), 24]
          ],
          // RFC7450
          amt: [
            [new c([192, 52, 193, 0]), 24]
          ]
        }, c.prototype.kind = function() {
          return "ipv4";
        }, c.prototype.match = function(d, g) {
          let p;
          if (g === void 0 && (p = d, d = p[0], g = p[1]), d.kind() !== "ipv4")
            throw new Error("ipaddr: cannot match ipv4 address with non-ipv4 one");
          return f(this.octets, d.octets, 8, g);
        }, c.prototype.prefixLengthFromSubnetMask = function() {
          let d = 0, g = !1;
          const p = {
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
          let v, b, C;
          for (v = 3; v >= 0; v -= 1)
            if (b = this.octets[v], b in p) {
              if (C = p[b], g && C !== 0)
                return null;
              C !== 8 && (g = !0), d += C;
            } else
              return null;
          return 32 - d;
        }, c.prototype.range = function() {
          return y.subnetMatch(this, this.SpecialRanges);
        }, c.prototype.toByteArray = function() {
          return this.octets.slice(0);
        }, c.prototype.toIPv4MappedAddress = function() {
          return y.IPv6.parse(`::ffff:${this.toString()}`);
        }, c.prototype.toNormalizedString = function() {
          return this.toString();
        }, c.prototype.toString = function() {
          return this.octets.join(".");
        }, c;
      })(), y.IPv4.broadcastAddressFromCIDR = function(c) {
        try {
          const d = this.parseCIDR(c), g = d[0].toByteArray(), p = this.subnetMaskFromPrefixLength(d[1]).toByteArray(), v = [];
          let b = 0;
          for (; b < 4; )
            v.push(parseInt(g[b], 10) | parseInt(p[b], 10) ^ 255), b++;
          return new this(v);
        } catch {
          throw new Error("ipaddr: the address does not have IPv4 CIDR format");
        }
      }, y.IPv4.isIPv4 = function(c) {
        return this.parser(c) !== null;
      }, y.IPv4.isValid = function(c) {
        try {
          return new this(this.parser(c)), !0;
        } catch {
          return !1;
        }
      }, y.IPv4.isValidCIDR = function(c) {
        try {
          return this.parseCIDR(c), !0;
        } catch {
          return !1;
        }
      }, y.IPv4.isValidFourPartDecimal = function(c) {
        return !!(y.IPv4.isValid(c) && c.match(/^(0|[1-9]\d*)(\.(0|[1-9]\d*)){3}$/));
      }, y.IPv4.isValidCIDRFourPartDecimal = function(c) {
        const d = c.match(/^(.+)\/(\d+)$/);
        return !y.IPv4.isValidCIDR(c) || !d ? !1 : y.IPv4.isValidFourPartDecimal(d[1]);
      }, y.IPv4.networkAddressFromCIDR = function(c) {
        let d, g, p, v, b;
        try {
          for (d = this.parseCIDR(c), p = d[0].toByteArray(), b = this.subnetMaskFromPrefixLength(d[1]).toByteArray(), v = [], g = 0; g < 4; )
            v.push(parseInt(p[g], 10) & parseInt(b[g], 10)), g++;
          return new this(v);
        } catch {
          throw new Error("ipaddr: the address does not have IPv4 CIDR format");
        }
      }, y.IPv4.parse = function(c) {
        const d = this.parser(c);
        if (d === null)
          throw new Error("ipaddr: string is not formatted like an IPv4 Address");
        return new this(d);
      }, y.IPv4.parseCIDR = function(c) {
        let d;
        if (d = c.match(/^(.+)\/(\d+)$/)) {
          const g = parseInt(d[2]);
          if (g >= 0 && g <= 32) {
            const p = [this.parse(d[1]), g];
            return Object.defineProperty(p, "toString", {
              value: function() {
                return this.join("/");
              }
            }), p;
          }
        }
        throw new Error("ipaddr: string is not formatted like an IPv4 CIDR range");
      }, y.IPv4.parser = function(c) {
        let d, g, p;
        if (d = c.match(r.fourOctet))
          return (function() {
            const v = d.slice(1, 6), b = [];
            for (let C = 0; C < v.length; C++)
              g = v[C], b.push(h(g));
            return b;
          })();
        if (d = c.match(r.longValue)) {
          if (p = h(d[1]), p > 4294967295 || p < 0)
            throw new Error("ipaddr: address outside defined range");
          return (function() {
            const v = [];
            let b;
            for (b = 0; b <= 24; b += 8)
              v.push(p >> b & 255);
            return v;
          })().reverse();
        } else return (d = c.match(r.twoOctet)) ? (function() {
          const v = d.slice(1, 4), b = [];
          if (p = h(v[1]), p > 16777215 || p < 0)
            throw new Error("ipaddr: address outside defined range");
          return b.push(h(v[0])), b.push(p >> 16 & 255), b.push(p >> 8 & 255), b.push(p & 255), b;
        })() : (d = c.match(r.threeOctet)) ? (function() {
          const v = d.slice(1, 5), b = [];
          if (p = h(v[2]), p > 65535 || p < 0)
            throw new Error("ipaddr: address outside defined range");
          return b.push(h(v[0])), b.push(h(v[1])), b.push(p >> 8 & 255), b.push(p & 255), b;
        })() : null;
      }, y.IPv4.subnetMaskFromPrefixLength = function(c) {
        if (c = parseInt(c), c < 0 || c > 32)
          throw new Error("ipaddr: invalid IPv4 prefix length");
        const d = [0, 0, 0, 0];
        let g = 0;
        const p = Math.floor(c / 8);
        for (; g < p; )
          d[g] = 255, g++;
        return p < 4 && (d[p] = Math.pow(2, c % 8) - 1 << 8 - c % 8), new this(d);
      }, y.IPv6 = (function() {
        function c(d, g) {
          let p, v;
          if (d.length === 16)
            for (this.parts = [], p = 0; p <= 14; p += 2)
              this.parts.push(d[p] << 8 | d[p + 1]);
          else if (d.length === 8)
            this.parts = d;
          else
            throw new Error("ipaddr: ipv6 part count should be 8 or 16");
          for (p = 0; p < this.parts.length; p++)
            if (v = this.parts[p], !(0 <= v && v <= 65535))
              throw new Error("ipaddr: ipv6 part should fit in 16 bits");
          g && (this.zoneId = g);
        }
        return c.prototype.SpecialRanges = {
          // RFC4291, here and after
          unspecified: [new c([0, 0, 0, 0, 0, 0, 0, 0]), 128],
          linkLocal: [new c([65152, 0, 0, 0, 0, 0, 0, 0]), 10],
          multicast: [new c([65280, 0, 0, 0, 0, 0, 0, 0]), 8],
          loopback: [new c([0, 0, 0, 0, 0, 0, 0, 1]), 128],
          uniqueLocal: [new c([64512, 0, 0, 0, 0, 0, 0, 0]), 7],
          ipv4Mapped: [new c([0, 0, 0, 0, 0, 65535, 0, 0]), 96],
          // RFC6666
          discard: [new c([256, 0, 0, 0, 0, 0, 0, 0]), 64],
          // RFC6145
          rfc6145: [new c([0, 0, 0, 0, 65535, 0, 0, 0]), 96],
          // RFC6052
          rfc6052: [new c([100, 65435, 0, 0, 0, 0, 0, 0]), 96],
          // RFC3056
          "6to4": [new c([8194, 0, 0, 0, 0, 0, 0, 0]), 16],
          // RFC6052, RFC6146
          teredo: [new c([8193, 0, 0, 0, 0, 0, 0, 0]), 32],
          // RFC5180
          benchmarking: [new c([8193, 2, 0, 0, 0, 0, 0, 0]), 48],
          // RFC7450
          amt: [new c([8193, 3, 0, 0, 0, 0, 0, 0]), 32],
          as112v6: [
            [new c([8193, 4, 274, 0, 0, 0, 0, 0]), 48],
            [new c([9760, 79, 32768, 0, 0, 0, 0, 0]), 48]
          ],
          deprecated: [new c([8193, 16, 0, 0, 0, 0, 0, 0]), 28],
          orchid2: [new c([8193, 32, 0, 0, 0, 0, 0, 0]), 28],
          droneRemoteIdProtocolEntityTags: [new c([8193, 48, 0, 0, 0, 0, 0, 0]), 28],
          reserved: [
            // RFC3849
            [new c([8193, 0, 0, 0, 0, 0, 0, 0]), 23],
            // RFC2928
            [new c([8193, 3512, 0, 0, 0, 0, 0, 0]), 32]
          ]
        }, c.prototype.isIPv4MappedAddress = function() {
          return this.range() === "ipv4Mapped";
        }, c.prototype.kind = function() {
          return "ipv6";
        }, c.prototype.match = function(d, g) {
          let p;
          if (g === void 0 && (p = d, d = p[0], g = p[1]), d.kind() !== "ipv6")
            throw new Error("ipaddr: cannot match ipv6 address with non-ipv6 one");
          return f(this.parts, d.parts, 16, g);
        }, c.prototype.prefixLengthFromSubnetMask = function() {
          let d = 0, g = !1;
          const p = {
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
          let v, b;
          for (let C = 7; C >= 0; C -= 1)
            if (v = this.parts[C], v in p) {
              if (b = p[v], g && b !== 0)
                return null;
              b !== 16 && (g = !0), d += b;
            } else
              return null;
          return 128 - d;
        }, c.prototype.range = function() {
          return y.subnetMatch(this, this.SpecialRanges);
        }, c.prototype.toByteArray = function() {
          let d;
          const g = [], p = this.parts;
          for (let v = 0; v < p.length; v++)
            d = p[v], g.push(d >> 8), g.push(d & 255);
          return g;
        }, c.prototype.toFixedLengthString = function() {
          const d = (function() {
            const p = [];
            for (let v = 0; v < this.parts.length; v++)
              p.push(w(this.parts[v].toString(16), 4));
            return p;
          }).call(this).join(":");
          let g = "";
          return this.zoneId && (g = `%${this.zoneId}`), d + g;
        }, c.prototype.toIPv4Address = function() {
          if (!this.isIPv4MappedAddress())
            throw new Error("ipaddr: trying to convert a generic ipv6 address to ipv4");
          const d = this.parts.slice(-2), g = d[0], p = d[1];
          return new y.IPv4([g >> 8, g & 255, p >> 8, p & 255]);
        }, c.prototype.toNormalizedString = function() {
          const d = (function() {
            const p = [];
            for (let v = 0; v < this.parts.length; v++)
              p.push(this.parts[v].toString(16));
            return p;
          }).call(this).join(":");
          let g = "";
          return this.zoneId && (g = `%${this.zoneId}`), d + g;
        }, c.prototype.toRFC5952String = function() {
          const d = /((^|:)(0(:|$)){2,})/g, g = this.toNormalizedString();
          let p = 0, v = -1, b;
          for (; b = d.exec(g); )
            b[0].length > v && (p = b.index, v = b[0].length);
          return v < 0 ? g : `${g.substring(0, p)}::${g.substring(p + v)}`;
        }, c.prototype.toString = function() {
          return this.toRFC5952String();
        }, c;
      })(), y.IPv6.broadcastAddressFromCIDR = function(c) {
        try {
          const d = this.parseCIDR(c), g = d[0].toByteArray(), p = this.subnetMaskFromPrefixLength(d[1]).toByteArray(), v = [];
          let b = 0;
          for (; b < 16; )
            v.push(parseInt(g[b], 10) | parseInt(p[b], 10) ^ 255), b++;
          return new this(v);
        } catch (d) {
          throw new Error(`ipaddr: the address does not have IPv6 CIDR format (${d})`);
        }
      }, y.IPv6.isIPv6 = function(c) {
        return this.parser(c) !== null;
      }, y.IPv6.isValid = function(c) {
        if (typeof c == "string" && c.indexOf(":") === -1)
          return !1;
        try {
          const d = this.parser(c);
          return new this(d.parts, d.zoneId), !0;
        } catch {
          return !1;
        }
      }, y.IPv6.isValidCIDR = function(c) {
        if (typeof c == "string" && c.indexOf(":") === -1)
          return !1;
        try {
          return this.parseCIDR(c), !0;
        } catch {
          return !1;
        }
      }, y.IPv6.networkAddressFromCIDR = function(c) {
        let d, g, p, v, b;
        try {
          for (d = this.parseCIDR(c), p = d[0].toByteArray(), b = this.subnetMaskFromPrefixLength(d[1]).toByteArray(), v = [], g = 0; g < 16; )
            v.push(parseInt(p[g], 10) & parseInt(b[g], 10)), g++;
          return new this(v);
        } catch (C) {
          throw new Error(`ipaddr: the address does not have IPv6 CIDR format (${C})`);
        }
      }, y.IPv6.parse = function(c) {
        const d = this.parser(c);
        if (d.parts === null)
          throw new Error("ipaddr: string is not formatted like an IPv6 Address");
        return new this(d.parts, d.zoneId);
      }, y.IPv6.parseCIDR = function(c) {
        let d, g, p;
        if ((g = c.match(/^(.+)\/(\d+)$/)) && (d = parseInt(g[2]), d >= 0 && d <= 128))
          return p = [this.parse(g[1]), d], Object.defineProperty(p, "toString", {
            value: function() {
              return this.join("/");
            }
          }), p;
        throw new Error("ipaddr: string is not formatted like an IPv6 CIDR range");
      }, y.IPv6.parser = function(c) {
        let d, g, p, v, b, C;
        if (p = c.match(a.deprecatedTransitional))
          return this.parser(`::ffff:${p[1]}`);
        if (a.native.test(c))
          return u(c, 8);
        if ((p = c.match(a.transitional)) && (C = p[6] || "", d = p[1], p[1].endsWith("::") || (d = d.slice(0, -1)), d = u(d + C, 6), d.parts)) {
          for (b = [
            parseInt(p[2]),
            parseInt(p[3]),
            parseInt(p[4]),
            parseInt(p[5])
          ], g = 0; g < b.length; g++)
            if (v = b[g], !(0 <= v && v <= 255))
              return null;
          return d.parts.push(b[0] << 8 | b[1]), d.parts.push(b[2] << 8 | b[3]), {
            parts: d.parts,
            zoneId: d.zoneId
          };
        }
        return null;
      }, y.IPv6.subnetMaskFromPrefixLength = function(c) {
        if (c = parseInt(c), c < 0 || c > 128)
          throw new Error("ipaddr: invalid IPv6 prefix length");
        const d = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let g = 0;
        const p = Math.floor(c / 8);
        for (; g < p; )
          d[g] = 255, g++;
        return p < 16 && (d[p] = Math.pow(2, c % 8) - 1 << 8 - c % 8), new this(d);
      }, y.fromByteArray = function(c) {
        const d = c.length;
        if (d === 4)
          return new y.IPv4(c);
        if (d === 16)
          return new y.IPv6(c);
        throw new Error("ipaddr: the binary input is neither an IPv6 nor IPv4 address");
      }, y.isValid = function(c) {
        return y.IPv6.isValid(c) || y.IPv4.isValid(c);
      }, y.isValidCIDR = function(c) {
        return y.IPv6.isValidCIDR(c) || y.IPv4.isValidCIDR(c);
      }, y.parse = function(c) {
        if (y.IPv6.isValid(c))
          return y.IPv6.parse(c);
        if (y.IPv4.isValid(c))
          return y.IPv4.parse(c);
        throw new Error("ipaddr: the address has neither IPv6 nor IPv4 format");
      }, y.parseCIDR = function(c) {
        try {
          return y.IPv6.parseCIDR(c);
        } catch {
          try {
            return y.IPv4.parseCIDR(c);
          } catch {
            throw new Error("ipaddr: the address has neither IPv6 nor IPv4 CIDR format");
          }
        }
      }, y.process = function(c) {
        const d = this.parse(c);
        return d.kind() === "ipv6" && d.isIPv4MappedAddress() ? d.toIPv4Address() : d;
      }, y.subnetMatch = function(c, d, g) {
        let p, v, b, C;
        g == null && (g = "unicast");
        for (v in d)
          if (Object.prototype.hasOwnProperty.call(d, v)) {
            for (b = d[v], b[0] && !(b[0] instanceof Array) && (b = [b]), p = 0; p < b.length; p++)
              if (C = b[p], c.kind() === C[0].kind() && c.match.apply(c, C))
                return v;
          }
        return g;
      }, e.exports ? e.exports = y : t.ipaddr = y;
    })(jp);
  })(Bn)), Bn.exports;
}
var Lo = Vp();
function yl(e) {
  const t = e ?? globalThis.location?.origin;
  if (!t) return null;
  try {
    return new URL(t);
  } catch {
    return null;
  }
}
function qp(e) {
  return e.replace(/^\[/, "").replace(/\]$/, "").split("%")[0];
}
function wl(e) {
  const t = qp(e);
  if (!t || !Lo.isValid(t))
    return !1;
  try {
    return Lo.parse(t).range() !== "unicast";
  } catch {
    return !0;
  }
}
function Fp(e) {
  const t = e.trim().toLowerCase();
  return !(!t || t === "localhost" || t.endsWith(".localhost") || t.endsWith(".local") || wl(t) || !t.includes("."));
}
function Kp(e) {
  const t = e.hostname.trim().toLowerCase();
  return t ? t === "localhost" || t.endsWith(".localhost") || t.endsWith(".local") ? !0 : wl(t) : !1;
}
function Zp(e, t) {
  return !!t && e.origin === t.origin;
}
function vn(e, t = {}) {
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
  const i = yl(t.currentOrigin), s = Zp(r, i) && !!i && Kp(i);
  if (r.protocol === "http:") {
    if (!s)
      return null;
  } else if (r.protocol !== "https:")
    return null;
  return !s && !Fp(r.hostname) ? null : (r.hash = "", r.toString());
}
function T0(e, t = {}) {
  if (!e) return !1;
  const n = vn(e, t);
  if (!n) return !1;
  const r = yl(t.currentOrigin);
  if (!r) return !1;
  try {
    return new URL(n).origin === r.origin;
  } catch {
    return !1;
  }
}
function L0(e, t = {}) {
  const n = vn(e, t);
  if (!n) return "";
  const r = new URL(n);
  return r.searchParams.set("cb", Date.now().toString()), r.toString();
}
function O0(e, t = {}) {
  const n = vn(e, t);
  if (!n) return "";
  const r = new URL(n);
  return r.searchParams.set("profile", "true"), t.forceRemote && t.navigatorOnline !== !1 ? r.searchParams.has("cb") && r.searchParams.set("cb", Date.now().toString()) : r.searchParams.delete("cb"), r.toString();
}
function P0(e, t = {}) {
  const n = vn(e, t);
  if (!n) return "";
  const r = new URL(n);
  return r.searchParams.has("profile") || r.searchParams.set("profile", "true"), r.toString();
}
class Wp extends Error {
  constructor() {
    super("invalid_composer_context"), this.name = "EmbedComposerContextValidationError";
  }
}
function ut() {
  throw new Wp();
}
function un(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function Gp(e) {
  return /^[0-9a-f]{64}$/.test(e);
}
function Gr(e) {
  (typeof e != "string" || Mp(e, { relayValidation: "strict" }) === null) && ut();
}
function Oo(e, t) {
  if (!Object.prototype.hasOwnProperty.call(e, t)) return;
  const n = e[t];
  n != null && (typeof n != "string" || n.trim().length === 0) && ut();
}
function Yp(e) {
  if (e != null) {
    if (un(e) || ut(), Gr(e.reference), e.relays !== void 0) {
      Array.isArray(e.relays) || ut();
      for (const t of e.relays)
        (typeof t != "string" || Xe.sanitizeExternalRelayUrls([t], { limit: 1 }).length !== 1) && ut();
    }
    Oo(e, "name"), Oo(e, "about");
  }
}
function B0(e) {
  if (un(e) || ut(), e.reply !== void 0 && e.reply !== null && Gr(e.reply), e.quotes !== void 0 && e.quotes !== null) {
    Array.isArray(e.quotes) || ut();
    for (const t of e.quotes) Gr(t);
  }
  return e.content !== void 0 && e.content !== null && typeof e.content != "string" && ut(), Yp(e.channel), e;
}
function N0(e, t) {
  if (!un(e))
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
      if (!gl(s))
        continue;
      const l = Co(s);
      if (!sr(l) || sn(l) !== l.id || !lr(l) || l.id !== i || o.some(
        (a) => a.authorPubkey !== null && l.pubkey !== a.authorPubkey
      ))
        continue;
      r[i] = Co(l);
    } catch {
      continue;
    }
  return r;
}
function Xp(e) {
  if (!un(e)) return {};
  const t = {};
  for (const [n, r] of Object.entries(e)) {
    if (!Gp(n) || !un(r)) continue;
    const i = typeof r.displayName == "string" && r.displayName.trim() || null, o = typeof r.picture == "string" ? vn(r.picture) : null;
    !i && !o || (t[n] = { displayName: i, picture: o });
  }
  return t;
}
const Jp = ":root,:host{--setting-label-icon-gap: 16px;--app-root-height: 100%;--app-root-top: 0px;--app-root-overflow-y: visible;--app-main-height: 100svh;--app-body-position: static;--app-body-inset: auto;--app-body-width: auto;--app-overlay-position: fixed;--app-overscroll-behavior: auto;--footer-height: 66px;--footer-bottom: 0px;--keyboard-height: 0px;--mobile-dialog-viewport-top: 0px;--mobile-dialog-viewport-height: 100dvh;--mobile-dialog-center-y: 43dvh;--keyboard-button-bar-height: 50px;--keyboard-button-bar-bottom: 66px;--main-content-keyboard-adjustment: var(--keyboard-height);--reason-input-base-height: 50px;--reason-input-height: 0px;--reason-input-bottom: 116px;--main-content-top-spacing: 6px;--composer-bottom-reserved-height: 116px;--accent-color-default: hsl(152, 74%, 43%);--accent-color: var( --accent-color-forced, var(--accent-color-user, var(--accent-color-external-default, var(--accent-color-default))) );--accent-color-custom: var( --accent-color-forced, var(--accent-color-user, var(--accent-color-external-default)) );--accent-color-custom-inner: color-mix(in srgb, var(--accent-color-custom) 15%, white 85%);--accent-color-custom-face: color-mix(in srgb, var(--accent-color-custom) 40%, black 60%);--base-color: var( --base-color-forced, var(--base-color-user, var(--base-color-external-default)) );--theme: var(--accent-color);--text-black: hsl(0, 0%, 24%);--nostr-bg: hsl(270, 100%, 98%);--yellow: hsl(50, 100%, 50%);--danger: hsl(0, 84%, 60%);--darker: rgba(0, 0, 0, .8);--dark-gray: hsl(0, 0%, 66%);--light-gray: hsl(0, 0%, 83%);--base-color-surface-bg-light: color-mix(in srgb, var(--base-color) 18%, hsl(0, 0%, 97%));--base-color-surface-bg-dark: color-mix(in srgb, var(--base-color) 18%, hsl(0, 0%, 12%));--base-color-surface-editor-light: color-mix(in srgb, var(--base-color) 6%, hsl(0, 0%, 100%));--base-color-surface-editor-dark: color-mix(in srgb, var(--base-color) 9%, hsl(0, 0%, 22%));--base-color-surface-footer-light: color-mix(in srgb, var(--base-color) 34%, hsl(0, 0%, 86%));--base-color-surface-footer-dark: color-mix(in srgb, var(--base-color) 22%, hsl(0, 0%, 10%));--surface-bg: light-dark( var(--base-color-surface-bg-light, color-mix(in srgb, hsl(0, 0%, 94%) 18%, hsl(0, 0%, 94%))), var(--base-color-surface-bg-dark, color-mix(in srgb, hsl(0, 0%, 12%) 18%, hsl(0, 0%, 12%))) );--surface-input: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 100%)) 14%, hsl(0, 0%, 100%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 19%)) 14%, hsl(0, 0%, 19%)) );--surface-editor: light-dark( var(--base-color-surface-editor-light, var(--surface-input)), var(--base-color-surface-editor-dark, var(--surface-input)) );--surface-footer: light-dark( var(--base-color-surface-footer-light, color-mix(in srgb, hsl(0, 0%, 82%) 22%, hsl(0, 0%, 82%))), var(--base-color-surface-footer-dark, color-mix(in srgb, hsl(0, 0%, 10%) 22%, hsl(0, 0%, 10%))) );--surface-buttonbar: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 91%)) 20%, hsl(0, 0%, 91%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 28%)) 20%, hsl(0, 0%, 28%)) );--base-color-surface-button: color-mix(in srgb, var(--base-color) 24%, white);--surface-button: light-dark( var(--base-color-surface-button, hsl(0, 0%, 92%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 25%)) 18%, hsl(0, 0%, 25%)) );--surface-button-border: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 75%)) 24%, hsl(0, 0%, 75%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 30%)) 24%, hsl(0, 0%, 30%)) );--surface-button-preview-action: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 74%)) 22%, hsl(0, 0%, 74%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 36%)) 22%, hsl(0, 0%, 36%)) );--surface-border: light-dark( color-mix(in srgb, var(--base-color, var(--light-gray)) 24%, var(--light-gray)), color-mix(in srgb, var(--base-color, dimgray) 24%, dimgray) );--surface-border-hr: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 84%)) 20%, hsl(0, 0%, 84%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 30%)) 20%, hsl(0, 0%, 30%)) );--surface-border-hr-light: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 92%)) 16%, hsl(0, 0%, 92%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 20%)) 16%, hsl(0, 0%, 20%)) );--surface-dialog: light-dark( color-mix(in srgb, var(--base-color, white) 14%, white), color-mix(in srgb, var(--base-color, hsl(0, 0%, 14%)) 14%, hsl(0, 0%, 14%)) );--surface-window: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 95%)) 14%, hsl(0, 0%, 95%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 14%)) 14%, hsl(0, 0%, 14%)) );--bg: var(--surface-bg);--bg-input: var(--surface-input);--bg-footer: var(--surface-footer);--bg-translucent: light-dark(#EDEDEDcc, #212121cc);--bg-buttonbar: var(--surface-buttonbar);--base-color-footer-buttonbar-light: var(--base-color-surface-bg-light);--footer-buttonbar-bg: light-dark( var(--base-color-footer-buttonbar-light, var(--bg-buttonbar)), var(--bg-buttonbar) );--btn-bg: var(--surface-button);--btn-bg2: light-dark(color-mix(in srgb, var(--btn-bg), black 6%), color-mix(in srgb, var(--btn-bg), white 10%));--btn-bg3: light-dark(color-mix(in srgb, var(--btn-bg), black 11%), color-mix(in srgb, var(--btn-bg), white 20%));--btn-border: var(--surface-button-border);--btn-hover-bg: light-dark(rgba(50, 50, 50, .12), rgba(255, 255, 255, .12));--btn-post-preview-action: var(--surface-button-preview-action);--border: var(--surface-border);--border-hr: var(--surface-border-hr);--border-hr-light: var(--surface-border-hr-light);--semantic-text: light-dark(hsl(0, 0%, 24%), hsl(0, 0%, 90%));--text: var(--semantic-text);--text-light: light-dark(hsl(0, 0%, 46%), hsl(0, 0%, 75%));--text-muted: light-dark(hsl(0, 0%, 60%), hsl(0, 0%, 55%));--text-red: light-dark(hsl(0, 99%, 45%), hsl(0, 99%, 69%));--text-r: light-dark(#e6e6e6, #3D3D3D);--semantic-link: light-dark(#1a0dab, #99c3ff);--link: var(--semantic-link);--link-visited: light-dark(#681da8, #c58af9);--dialog-bg: var(--surface-dialog);--dialog-bg2: light-dark(color-mix(in srgb, var(--dialog-bg), black 6%), color-mix(in srgb, var(--dialog-bg), white 10%));--dialog-bg3: light-dark(color-mix(in srgb, var(--dialog-bg), black 11%), color-mix(in srgb, var(--dialog-bg), white 16%));--dialog-bg-overlay: light-dark(rgba(0, 0, 0, .6), rgba(0, 0, 0, .8));--window: var(--surface-window);--svg: light-dark(hsl(0, 0%, 36%), hsl(0, 0%, 90%));--svg-light: var(--text-light);--shadow: light-dark(rgba(0, 0, 0, .1), rgba(255, 255, 255, .1));--hagaki: light-dark(hsl(0, 77%, 56%), hsl(5, 99%, 71%));--hashtag-text: light-dark(#106BC7, #65B1FC);--hashtag-bg: light-dark(#106BC71a, #65B1FC1a);--toggle-bg: var(--svg);--toggle-circle: var(--dialog-bg);--message-success-bg: hsl(200, 39%, 96%);--message-success-color: hsl(210, 60%, 40%);--message-success-border: hsl(210, 48%, 70%);--message-error-bg: hsl(351, 99%, 96%);--message-error-color: hsl(351, 99%, 32%);--message-error-border: hsl(351, 99%, 70%);--message-warning-bg: hsl(38, 100%, 95%);--message-warning-color: hsl(30, 90%, 35%);--message-warning-border: hsl(38, 90%, 65%);--message-flavor-bg: hsl(125, 39%, 94%);--message-flavor-color: hsl(123, 46%, 32%);--message-flavor-border: hsl(125, 39%, 70%);--message-tips-bg: hsl(270, 50%, 96%);--message-tips-color: hsl(270, 55%, 38%);--message-tips-border: hsl(270, 45%, 70%);font-family:system-ui,-apple-system,Segoe UI,Hiragino Sans,Hiragino Kaku Gothic ProN,Meiryo,sans-serif;font-weight:400;color-scheme:light dark;color:var(--text);background-color:var(--bg);font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}*{font-family:inherit;box-sizing:border-box}html,body,#app{height:var(--app-root-height);overflow-x:hidden;overflow-y:var(--app-root-overflow-y);overscroll-behavior-y:var(--app-overscroll-behavior)}#app{position:var(--app-body-position);top:var(--app-root-top);left:0;right:0;width:var(--app-body-width)}body{margin:0;position:var(--app-body-position);inset:var(--app-body-inset);width:var(--app-body-width);color:var(--text);background-color:var(--bg);overflow-wrap:anywhere;word-break:auto-phrase;line-break:strict}a{--link-hover-color: light-dark(color-mix(in srgb, var(--link), black 30%), color-mix(in srgb, var(--link), white 30%));font-weight:500;color:var(--link);-webkit-tap-highlight-color:transparent;text-decoration:none;border-radius:6px}a:active{opacity:1}h2,h3{color:var(--text-light)}.card{padding:2em}button,[role=button],select{display:inline-flex;align-items:center;justify-content:center;height:100%;padding:0;font-size:1rem;font-weight:500;line-height:normal;color:var(--text);background-color:inherit;border:none;cursor:pointer;text-decoration:none;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;--button-selected-bg: light-dark(color-mix(in srgb, var(--btn-bg), black 18%), color-mix(in srgb, var(--btn-bg), white 22%));--button-hover-bg: light-dark(color-mix(in srgb, var(--btn-bg), black 4%), color-mix(in srgb, var(--btn-bg), white 5%));--button-hover-color: light-dark(color-mix(in srgb, var(--text), black 40%), color-mix(in srgb, var(--text), white 50%));--button-selected-hover-bg: light-dark(color-mix(in srgb, var(--btn-bg), black 20%), color-mix(in srgb, var(--btn-bg), white 30%));--button-selected-hover-color: light-dark(color-mix(in srgb, var(--text), black 20%), color-mix(in srgb, var(--text), white 30%))}:is(button,[role=button],select):disabled{opacity:.3;cursor:not-allowed}:is(button,[role=button],select):disabled.loading{opacity:1}button>*{pointer-events:none}button:active:not(:disabled),[role=button]:active{scale:.98;transition:scale .1s cubic-bezier(0,1,.5,1)}@media(prefers-reduced-motion:reduce){button:active:not(:disabled),[role=button]:active{scale:1;transition:none}}span{-webkit-tap-highlight-color:transparent}select{border-radius:6px}.svg-icon{-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-size:contain;mask-size:contain;-webkit-mask-position:center;mask-position:center;background-color:var(--svg);display:inline-block;inline-size:var(--icon-size, 28px);block-size:var(--icon-size, 28px);--icon-hover-color: light-dark(color-mix(in srgb, var(--svg), black 40%), color-mix(in srgb, var(--svg), white 50%));--icon-selected-hover-color: light-dark(color-mix(in srgb, var(--svg), black 20%), color-mix(in srgb, var(--svg), white 30%))}.tooltip-content{--tooltip-padding: 12px;--tooltip-font-size: 1rem;--tooltip-line-height: normal;--tooltip-z-index: 100;--tooltip-max-width: none;background:var(--dialog-bg);color:var(--text);border:1px solid var(--border);border-radius:6px;padding:var(--tooltip-padding);font-size:var(--tooltip-font-size);line-height:var(--tooltip-line-height);z-index:var(--tooltip-z-index);max-width:var(--tooltip-max-width)}.post-preview-tooltip-content{--tooltip-z-index: 10000;z-index:10000!important}:root:is(.light,.dark) button.selected:where(:not(:disabled)),:root:is(.light,.dark) button:where([data-state=active]){background-color:var(--button-selected-bg)}@media(hover:hover)and (pointer:fine){a:hover{text-decoration:underline}:root:is(.light,.dark) button:where(:hover:not(:disabled)),:root:is(.light,.dark) [role=button]:where(:hover:not([aria-disabled=true])),:root:is(.light,.dark) select:where(:hover:not(:disabled)){background-color:var(--button-hover-bg);color:var(--button-hover-color)}:is(:root:is(.light,.dark) button:where(:hover:not(:disabled)),:root:is(.light,.dark) [role=button]:where(:hover:not([aria-disabled=true])),:root:is(.light,.dark) select:where(:hover:not(:disabled))) .svg-icon{background-color:var(--icon-hover-color)}:root:is(.light,.dark) button.selected:where(:hover:not(:disabled)),:root:is(.light,.dark) button:where([data-state=active]:hover:not(:disabled)){background-color:var(--button-selected-hover-bg);color:var(--button-selected-hover-color)}:is(:root:is(.light,.dark) button.selected:where(:hover:not(:disabled)),:root:is(.light,.dark) button:where([data-state=active]:hover:not(:disabled))) .svg-icon{background-color:var(--icon-selected-hover-color)}:root:is(.light,.dark) a:hover{color:var(--link-hover-color)}}.setting-section{display:flex;flex-direction:column}.setting-row{display:flex;flex-direction:row;align-items:stretch;justify-content:space-between;min-height:50px}.setting-label{font-size:1rem;font-weight:500;line-height:1.3;display:flex;align-items:center;justify-content:flex-start;white-space:pre-line}.setting-label-with-icon{display:flex;align-items:center;gap:var(--setting-label-icon-gap);min-width:0}.setting-label-with-icon .setting-label{line-height:24px}.setting-menu-icon{display:inline-block;width:24px;height:24px;flex:0 0 24px;margin-block:1px}.setting-menu-mask-icon{background-color:currentColor;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:center;mask-position:center;-webkit-mask-size:contain;mask-size:contain}.setting-control{display:flex;align-items:stretch;justify-content:flex-end;height:auto;margin-block:auto}", Qp = ".pswp{--pswp-bg: #000;--pswp-placeholder-bg: #222;--pswp-root-z-index: 100000;--pswp-preloader-color: rgba(79, 79, 79, .4);--pswp-preloader-color-secondary: rgba(255, 255, 255, .9);--pswp-icon-color: #fff;--pswp-icon-color-secondary: #4f4f4f;--pswp-icon-stroke-color: #4f4f4f;--pswp-icon-stroke-width: 2px;--pswp-error-text-color: var(--pswp-icon-color)}.pswp{position:fixed;top:0;left:0;width:100%;height:100%;z-index:var(--pswp-root-z-index);display:none;touch-action:none;outline:0;opacity:.003;contain:layout style size;-webkit-tap-highlight-color:rgba(0,0,0,0)}.pswp:focus{outline:0}.pswp *{box-sizing:border-box}.pswp img{max-width:none}.pswp--open{display:block}.pswp,.pswp__bg{transform:translateZ(0);will-change:opacity}.pswp__bg{opacity:.005;background:var(--pswp-bg)}.pswp,.pswp__scroll-wrap{overflow:hidden}.pswp__scroll-wrap,.pswp__bg,.pswp__container,.pswp__item,.pswp__content,.pswp__img,.pswp__zoom-wrap{position:absolute;top:0;left:0;width:100%;height:100%}.pswp__img,.pswp__zoom-wrap{width:auto;height:auto}.pswp--click-to-zoom.pswp--zoom-allowed .pswp__img{cursor:-webkit-zoom-in;cursor:-moz-zoom-in;cursor:zoom-in}.pswp--click-to-zoom.pswp--zoomed-in .pswp__img{cursor:move;cursor:-webkit-grab;cursor:-moz-grab;cursor:grab}.pswp--click-to-zoom.pswp--zoomed-in .pswp__img:active{cursor:-webkit-grabbing;cursor:-moz-grabbing;cursor:grabbing}.pswp--no-mouse-drag.pswp--zoomed-in .pswp__img,.pswp--no-mouse-drag.pswp--zoomed-in .pswp__img:active,.pswp__img{cursor:-webkit-zoom-out;cursor:-moz-zoom-out;cursor:zoom-out}.pswp__container,.pswp__img,.pswp__button,.pswp__counter{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.pswp__item{z-index:1;overflow:hidden}.pswp__hidden{display:none!important}.pswp__content{pointer-events:none}.pswp__content>*{pointer-events:auto}.pswp__error-msg-container{display:grid}.pswp__error-msg{margin:auto;font-size:1em;line-height:1;color:var(--pswp-error-text-color)}.pswp .pswp__hide-on-close{opacity:.005;will-change:opacity;transition:opacity var(--pswp-transition-duration) cubic-bezier(.4,0,.22,1);z-index:10;pointer-events:none}.pswp--ui-visible .pswp__hide-on-close{opacity:1;pointer-events:auto}.pswp__button{position:relative;display:block;width:50px;height:60px;padding:0;margin:0;overflow:hidden;cursor:pointer;background:none;border:0;box-shadow:none;opacity:.85;-webkit-appearance:none;-webkit-touch-callout:none}.pswp__button:hover,.pswp__button:active,.pswp__button:focus{transition:none;padding:0;background:none;border:0;box-shadow:none;opacity:1}.pswp__button:disabled{opacity:.3;cursor:auto}.pswp__icn{fill:var(--pswp-icon-color);color:var(--pswp-icon-color-secondary)}.pswp__icn{position:absolute;top:14px;left:9px;width:32px;height:32px;overflow:hidden;pointer-events:none}.pswp__icn-shadow{stroke:var(--pswp-icon-stroke-color);stroke-width:var(--pswp-icon-stroke-width);fill:none}.pswp__icn:focus{outline:0}div.pswp__img--placeholder,.pswp__img--with-bg{background:var(--pswp-placeholder-bg)}.pswp__top-bar{position:absolute;left:0;top:0;width:100%;height:60px;display:flex;flex-direction:row;justify-content:flex-end;z-index:10;pointer-events:none!important}.pswp__top-bar>*{pointer-events:auto;will-change:opacity}.pswp__button--close{margin-right:6px}.pswp__button--arrow{position:absolute;width:75px;height:100px;top:50%;margin-top:-50px}.pswp__button--arrow:disabled{display:none;cursor:default}.pswp__button--arrow .pswp__icn{top:50%;margin-top:-30px;width:60px;height:60px;background:none;border-radius:0}.pswp--one-slide .pswp__button--arrow{display:none}.pswp--touch .pswp__button--arrow{visibility:hidden}.pswp--has_mouse .pswp__button--arrow{visibility:visible}.pswp__button--arrow--prev{right:auto;left:0}.pswp__button--arrow--next{right:0}.pswp__button--arrow--next .pswp__icn{left:auto;right:14px;transform:scaleX(-1)}.pswp__button--zoom{display:none}.pswp--zoom-allowed .pswp__button--zoom{display:block}.pswp--zoomed-in .pswp__zoom-icn-bar-v{display:none}.pswp__preloader{position:relative;overflow:hidden;width:50px;height:60px;margin-right:auto}.pswp__preloader .pswp__icn{opacity:0;transition:opacity .2s linear;animation:pswp-clockwise .6s linear infinite}.pswp__preloader--active .pswp__icn{opacity:.85}@keyframes pswp-clockwise{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.pswp__counter{height:30px;margin-top:15px;margin-inline-start:20px;font-size:14px;line-height:30px;color:var(--pswp-icon-color);text-shadow:1px 1px 3px var(--pswp-icon-color-secondary);opacity:.85}.pswp--one-slide .pswp__counter{display:none}", Po = "ehagaki-composer", eg = 1;
function tg(e) {
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
const ng = "--ehagaki-icon-", rg = /--ehagaki-icon-([0-9a-f]+)/g;
function ig(e) {
  if (e.length === 0 || e.length % 2 !== 0) return null;
  const t = Array.from(
    { length: e.length / 2 },
    (n, r) => String.fromCharCode(
      Number.parseInt(e.slice(r * 2, r * 2 + 2), 16)
    )
  ).join("");
  return /^[A-Za-z0-9._-]+\.svg$/.test(t) ? t : null;
}
function Bo(e, t, n) {
  const r = /* @__PURE__ */ new Set();
  for (const i of e.querySelectorAll("style"))
    for (const o of i.textContent?.matchAll(rg) ?? [])
      r.add(o[0]);
  for (const i of r) {
    const o = ig(i.slice(ng.length));
    o && t.style.setProperty(
      i,
      `url("${new URL(`icons/${o}`, n).href}")`
    );
  }
}
let Jt = null;
function fe(e, t) {
  const n = new Error(t);
  return n.name = e, n;
}
function No(e, t) {
  const n = new Error(t);
  return n.name = e, n;
}
function vl(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function og(e) {
  return !vl(e) || !Object.hasOwn(e, "preloadedProfiles") ? e : {
    ...e,
    preloadedProfiles: Xp(e.preloadedProfiles)
  };
}
function sg(e) {
  if (!vl(e))
    throw fe("initialization_failed", "Invalid settings payload.");
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
      throw fe("initialization_failed", "Invalid settings payload.");
    if (i in t) {
      const s = t[i];
      if (typeof o != "string" || !s.has(o))
        throw fe("initialization_failed", "Invalid settings payload.");
    } else {
      if (n.has(i) && typeof o != "boolean")
        throw fe("initialization_failed", "Invalid settings payload.");
      if (i === "uploadEndpoint" && typeof o != "string")
        throw fe("initialization_failed", "Invalid settings payload.");
    }
  }
  return e;
}
function ag(e) {
  return e.replaceAll(/:root:is\(\s*\.light\s*,\s*\.dark\s*\)/g, ":host(:is(.light, .dark))").replaceAll(":root", ":host").replace(`html,
body,
#app`, `:host,
.ehagaki-web-component-shell`).replace("#app {", ".ehagaki-web-component-shell {").replace("body {", ".ehagaki-web-component-shell {");
}
function lg() {
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
let cg = class extends HTMLElement {
  static get observedAttributes() {
    return ["asset-base", "auto-login"];
  }
  #e = null;
  #n = null;
  #r = null;
  #t = this.createReadyBoundary();
  #l = !1;
  #c = !1;
  #i = null;
  #s = Promise.resolve();
  #o = 0;
  #a = null;
  get editorIsEmpty() {
    return this.#i;
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
    if (this.onConnectionAttempt(), this.#i = null, this.#c = !1, this.#r) return;
    this.#t.state !== "pending" && (this.#t = this.createReadyBoundary());
    const t = this.#t, n = ++this.#o;
    t.token = n, t.active = !0, this.#l = !0;
    const r = this.getConnectionError();
    if (r) {
      const i = fe(r.code, r.message);
      this.fail("initialization_failed", i.message, i);
      return;
    }
    if (Jt && Jt !== this) {
      const i = fe(
        "multiple_instances_unsupported",
        "Only one ehagaki-composer can be connected in a document."
      );
      this.fail("multiple_instances_unsupported", i.message, i);
      return;
    }
    Jt = this, this.#r = this.mountApp(n);
  }
  disconnectedCallback() {
    if (this.#o += 1, this.#t.active = !1, this.#i = null, this.#c = !1, this.onDisconnected(), this.#a?.disconnect(), this.#a = null, Jt === this && (Jt = null), this.#n && (Ss(this.#n), this.#n = null), this.#e = null, this.#r = null, this.#t.state === "pending") {
      this.#t.state = "rejected";
      const t = fe("disconnected", "Component was disconnected before it became ready.");
      this.#t.reason = t, this.#t.reject(t);
    }
  }
  whenReady() {
    return this.#t.promise;
  }
  setContext(t) {
    const n = og(t);
    return this.enqueue(async () => {
      await this.requireApp().setEmbedContext(n);
    });
  }
  setSettings(t) {
    return this.enqueue(async () => this.requireApp().setEmbedSettings(sg(t)));
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
  createReadyBoundary() {
    let t, n;
    return {
      promise: new Promise((i, o) => {
        t = i, n = o;
      }),
      resolve: t,
      reject: n,
      state: "pending",
      token: null,
      active: !1
    };
  }
  async mountApp(t) {
    try {
      const n = this.shadowRoot ?? this.attachShadow({ mode: "open" });
      n.replaceChildren();
      const r = document.createElement("style");
      r.textContent = `${ag(Jp)}
${Qp}
${lg()}`;
      const i = document.createElement("div");
      i.className = "ehagaki-web-component-shell";
      const o = document.createElement("div");
      o.className = "ehagaki-web-component-app";
      const s = document.createElement("div");
      s.className = "ehagaki-web-component-overlays ehagaki-app-root", i.append(o, s), n.append(r, i);
      const l = new URL(
        this.assetBase ?? "./",
        import.meta.url
      );
      this.#a = new MutationObserver(() => {
        Bo(n, i, l);
      }), this.#a.observe(n, {
        childList: !0,
        subtree: !0
      }), Yc({
        storage: Zc(window.localStorage),
        window,
        document,
        domRoot: n,
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
      if (!this.isConnected || t !== this.#o || (this.#n = oi(a, {
        target: o,
        props: {
          notificationPort: tg(this),
          onInitialized: () => {
            this.#d(t);
          },
          ...this.getAdditionalMountProps(t),
          onEditorEmptyChange: (u) => {
            this.#f(t, u);
          }
        }
      }), Bo(n, i, l), this.#e = this.#n, !this.isConnected || t !== this.#o)) return;
    } catch {
      if (!this.isConnected || t !== this.#o) return;
      this.fail("initialization_failed", "eHagaki Composer could not be initialized.");
    }
  }
  requireApp() {
    if (!this.#e)
      throw fe("initialization_failed", "eHagaki Composer is not ready.");
    return this.#e;
  }
  /** Synchronous readiness snapshot for Full-only imperative operations. */
  requireCurrentReadyApp() {
    const t = this.#t;
    if (t.state === "rejected")
      throw t.reason ?? fe("initialization_failed", "eHagaki Composer could not be initialized.");
    if (!this.isConnected)
      throw this.#l ? fe("disconnected", "Component is disconnected.") : No("not_ready", "Call uploadFile() after whenReady() resolves.");
    if (t.state !== "resolved" || !t.active || t.token === null || t.token !== this.#o || !this.#e)
      throw No("not_ready", "Call uploadFile() after whenReady() resolves.");
    return { app: this.#e, generation: t.token };
  }
  isCurrentConnection(t) {
    return this.isConnected && t === this.#o && this.#t.active && this.#t.token === t && this.#t.state === "resolved";
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
    !this.isConnected || t !== this.#o || this.#t.state !== "pending" || this.fail("initialization_failed", "eHagaki Composer could not be initialized.");
  }
  enqueue(t) {
    const n = this.#t, r = this.#l && !this.isConnected, i = this.#s.then(async () => {
      if (r)
        throw fe("disconnected", "Component is disconnected.");
      if (await n.promise, !n.active || n.token === null || n.token !== this.#o || this.#t !== n || !this.isConnected)
        throw fe("disconnected", "Component was disconnected before the operation could run.");
      return t();
    });
    return this.#s = i.then(() => {
    }, () => {
    }), i;
  }
  #d(t) {
    !this.isConnected || t !== this.#o || (this.#c = !0, this.#u(t));
  }
  #f(t, n) {
    if (!(!this.isConnected || t !== this.#o || typeof n != "boolean")) {
      if (this.#i === n) {
        this.#u(t);
        return;
      }
      this.#i = n, this.dispatchSafeEvent("ehagaki-editor-empty-change", { isEmpty: n }), this.#u(t);
    }
  }
  #u(t) {
    !this.isConnected || t !== this.#o || !this.#c || this.#i === null || this.#t.state !== "pending" || (this.#t.state = "resolved", this.#t.resolve(), this.dispatchSafeEvent("ehagaki-ready", { apiVersion: eg }));
  }
  fail(t, n, r = fe(t, n)) {
    this.#t.state = "rejected", this.#t.active = !1, this.#t.reason = r, this.#t.reject(r), this.dispatchSafeEvent("ehagaki-initialization-error", { code: t, message: n });
  }
};
class Nn extends TypeError {
  constructor(t) {
    super(t), this.name = "HostRelayConfigError";
  }
}
function ug(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function fg(e) {
  if (!Array.isArray(e) || e.length === 0)
    throw new Nn("Host relay config must be a non-empty array.");
  const t = {};
  for (const n of e) {
    if (!ug(n) || Object.keys(n).some((i) => i !== "url" && i !== "read" && i !== "write") || typeof n.url != "string" || typeof n.read != "boolean" || typeof n.write != "boolean" || !n.read && !n.write)
      throw new Nn("Host relay config contains an invalid entry.");
    const r = Xe.normalizeExternalRelayUrl(n.url);
    if (!r || r in t)
      throw new Nn("Host relay config contains an invalid or duplicate URL.");
    t[r] = { read: n.read, write: n.write };
  }
  return t;
}
function dg(e) {
  return Array.isArray(e) ? e.map((t) => ({
    url: Xe.normalizeRelayUrl(t),
    read: !0,
    write: !0
  })) : Object.entries(e).map(([t, n]) => ({
    url: Xe.normalizeRelayUrl(t),
    read: n.read,
    write: n.write
  }));
}
function hr() {
  if (typeof DOMException < "u")
    return new DOMException("The operation was aborted.", "AbortError");
  const e = new Error("The operation was aborted.");
  return e.name = "AbortError", e;
}
function Vi(e) {
  if (e?.aborted) throw hr();
}
function M0(e, t) {
  return Vi(t), t ? new Promise((n, r) => {
    let i = !1;
    const o = () => t.removeEventListener("abort", s), s = () => {
      i || (i = !0, o(), r(hr()));
    }, l = (a) => {
      if (!i) {
        if (t.aborted) {
          s();
          return;
        }
        i = !0, o(), a();
      }
    };
    if (t.addEventListener("abort", s, { once: !0 }), t.aborted) {
      s();
      return;
    }
    Promise.resolve(e).then(
      (a) => l(() => n(a)),
      (a) => l(() => r(a))
    );
  }) : Promise.resolve(e);
}
function z0(e, t) {
  return Vi(t), t ? new Promise((n, r) => {
    const o = setTimeout(() => {
      t.removeEventListener("abort", s), n();
    }, e), s = () => {
      clearTimeout(o), t.removeEventListener("abort", s), r(hr());
    };
    t.addEventListener("abort", s, { once: !0 }), t.aborted && s();
  }) : new Promise((n) => setTimeout(n, e));
}
function Cr(e, t) {
  const n = new Error(t);
  return n.name = e, n;
}
class hg extends cg {
  #e;
  #n = null;
  #r = null;
  /** Full-only upload that returns a URL without touching Composer content or UI. */
  uploadFile(t, n) {
    let r;
    try {
      r = this.requireCurrentReadyApp();
    } catch (l) {
      return Promise.reject(l);
    }
    if (n?.signal?.aborted) return Promise.reject(hr());
    if (this.#r)
      return Promise.reject(Cr("upload_in_progress", "A file upload is already in progress."));
    const i = new AbortController(), o = {
      controller: i,
      generation: r.generation,
      disconnected: !1
    }, s = () => i.abort();
    return n?.signal?.addEventListener("abort", s, { once: !0 }), n?.signal?.aborted && s(), this.#r = o, (async () => {
      try {
        Vi(i.signal);
        const a = await r.app.uploadFileForHost(t, { signal: i.signal });
        if (!this.isCurrentConnection(o.generation))
          throw Cr("disconnected", "Component was disconnected during upload.");
        return a;
      } catch (l) {
        throw o.disconnected || !this.isCurrentConnection(o.generation) ? Cr("disconnected", "Component was disconnected during upload.") : l;
      } finally {
        n?.signal?.removeEventListener("abort", s), this.#r === o && (this.#r = null);
      }
    })();
  }
  onDisconnected() {
    this.#r && (this.#r.disconnected = !0, this.#r.controller.abort(), this.#r = null);
  }
  /**
   * A mount-scoped, nonpersistent default Relay Config for the Full embed.
   * Assign before connection; later assignments are retained for a recreated
   * element and never mutate an active Nostr session.
   */
  get relays() {
    return this.#e ? dg(this.#e) : void 0;
  }
  set relays(t) {
    if (t === void 0) {
      this.#e = void 0, this.#n = null;
      return;
    }
    try {
      this.#e = fg(t), this.#n = null;
    } catch (n) {
      this.#e = void 0, this.#n = n instanceof Nn ? n.message : "Invalid relays property.";
    }
  }
  loadApp() {
    return import("./App-Ck79ufzA.js").then((t) => t.eR);
  }
  getConnectionError() {
    return this.#n ? {
      code: "initialization_failed",
      message: this.#n
    } : super.getConnectionError();
  }
  getAdditionalMountProps(t) {
    return {
      ...this.#e ? { hostRelayConfig: this.#e } : {},
      onPostComponentLoadFailure: () => this.notifyPostComponentLoadFailure(t)
    };
  }
}
const Uo = Symbol.for("ehagaki-composer.distribution");
function pg(e, t) {
  const n = globalThis, r = n[Uo];
  if (r && r !== e)
    throw new Error(
      `Cannot import the ${e} eHagaki Composer distribution after ${r} in the same document.`
    );
  n[Uo] = e;
  const i = customElements.get(Po);
  if (!i) {
    customElements.define(Po, t);
    return;
  }
  if (i !== t)
    throw new Error("ehagaki-composer is already defined by a different distribution.");
}
pg("full", hg);
export {
  lt as $,
  Pg as A,
  Ce as B,
  mn as C,
  Ag as D,
  an as E,
  Vn as F,
  yg as G,
  _g as H,
  Vg as I,
  _l as J,
  xg as K,
  Rg as L,
  pn as M,
  kg as N,
  Pe as O,
  me as P,
  at as Q,
  Be as R,
  Ig as S,
  gc as T,
  Je as U,
  qt as V,
  jo as W,
  hn as X,
  Vo as Y,
  e0 as Z,
  O as _,
  qe as a,
  Jg as a$,
  xc as a0,
  cs as a1,
  Lg as a2,
  Og as a3,
  Qn as a4,
  jt as a5,
  Do as a6,
  mg as a7,
  l0 as a8,
  Qg as a9,
  Zi as aA,
  _t as aB,
  ti as aC,
  ft as aD,
  gg as aE,
  Sl as aF,
  Pt as aG,
  Eg as aH,
  $g as aI,
  Sg as aJ,
  Qt as aK,
  Cg as aL,
  Tg as aM,
  Ll as aN,
  Xg as aO,
  Pa as aP,
  mi as aQ,
  qc as aR,
  jg as aS,
  Qe as aT,
  xt as aU,
  rn as aV,
  ic as aW,
  u0 as aX,
  Hg as aY,
  Mg as aZ,
  zg as a_,
  hs as aa,
  i0 as ab,
  t0 as ac,
  Cl as ad,
  Tl as ae,
  Bg as af,
  qg as ag,
  Yg as ah,
  lc as ai,
  wg as aj,
  $l as ak,
  Fl as al,
  El as am,
  bg as an,
  o0 as ao,
  d0 as ap,
  h0 as aq,
  Is as ar,
  Gg as as,
  a0 as at,
  te as au,
  s0 as av,
  Rn as aw,
  yc as ax,
  r0 as ay,
  ce as az,
  nt as b,
  k0 as b$,
  Xl as b0,
  y0 as b1,
  Kg as b2,
  Nc as b3,
  Jl as b4,
  Xo as b5,
  b0 as b6,
  w0 as b7,
  Fg as b8,
  Ng as b9,
  Oh as bA,
  Lo as bB,
  x0 as bC,
  f0 as bD,
  P0 as bE,
  T0 as bF,
  vn as bG,
  _0 as bH,
  E0 as bI,
  O0 as bJ,
  L0 as bK,
  sr as bL,
  sn as bM,
  lr as bN,
  Vi as bO,
  M0 as bP,
  gl as bQ,
  Co as bR,
  A0 as bS,
  Mp as bT,
  z0 as bU,
  hr as bV,
  C0 as bW,
  $0 as bX,
  B0 as bY,
  N0 as bZ,
  Xp as b_,
  p0 as ba,
  Dg as bb,
  oi as bc,
  Ss as bd,
  vc as be,
  Zg as bf,
  c0 as bg,
  g0 as bh,
  v0 as bi,
  Wl as bj,
  Xe as bk,
  m0 as bl,
  di as bm,
  G as bn,
  pf as bo,
  Me as bp,
  Ku as bq,
  va as br,
  ht as bs,
  pe as bt,
  Gt as bu,
  Yt as bv,
  V as bw,
  gf as bx,
  wn as by,
  Af as bz,
  n0 as c,
  Ze as c0,
  I0 as c1,
  R0 as c2,
  Hp as c3,
  S0 as c4,
  dl as c5,
  eg as c6,
  Po as c7,
  hg as c8,
  Mn as d,
  $e as e,
  Ye as f,
  Mo as g,
  gt as h,
  bl as i,
  U as j,
  kc as k,
  Wg as l,
  hc as m,
  Al as n,
  xl as o,
  $n as p,
  J as q,
  Il as r,
  Yl as s,
  fs as t,
  Rc as u,
  M as v,
  _c as w,
  Xr as x,
  Ug as y,
  Gl as z
};
