var fl = Array.isArray, dl = Array.prototype.indexOf, Mt = Array.prototype.includes, hl = Array.from, Nn = Object.keys, Un = Object.defineProperty, Ot = Object.getOwnPropertyDescriptor, pl = Object.getOwnPropertyDescriptors, gl = Object.prototype, yl = Array.prototype, Co = Object.getPrototypeOf, Vi = Object.isExtensible;
function sg(e) {
  return typeof e == "function";
}
const wl = () => {
};
function vl(e) {
  for (var t = 0; t < e.length; t++)
    e[t]();
}
function To() {
  var e, t, n = new Promise((r, i) => {
    e = r, t = i;
  });
  return { promise: n, resolve: e, reject: t };
}
const ie = 2, zt = 4, un = 8, Wr = 1 << 24, Ae = 16, Pe = 32, Ze = 64, $r = 128, ve = 512, Q = 1024, re = 2048, Ne = 4096, be = 8192, Be = 16384, ht = 32768, qi = 1 << 25, sn = 65536, Mn = 1 << 17, bl = 1 << 18, It = 1 << 19, Lo = 1 << 20, ag = 1 << 25, kt = 65536, zn = 1 << 21, Bt = 1 << 22, it = 1 << 23, mt = Symbol("$state"), ml = Symbol("legacy props"), lg = Symbol(""), _l = Symbol("attributes"), El = Symbol("class"), xl = Symbol("style"), Cr = Symbol("text"), In = Symbol("form reset"), Jn = new class extends Error {
  name = "StaleReactionError";
  message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), ug = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml")
), fg = 1, fn = 3, dn = 8;
function kl(e) {
  throw new Error("https://svelte.dev/e/lifecycle_outside_component");
}
function Al() {
  throw new Error("https://svelte.dev/e/async_derived_orphan");
}
function dg(e, t, n) {
  throw new Error("https://svelte.dev/e/each_key_duplicate");
}
function Il(e) {
  throw new Error("https://svelte.dev/e/effect_in_teardown");
}
function Rl() {
  throw new Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Sl(e) {
  throw new Error("https://svelte.dev/e/effect_orphan");
}
function $l() {
  throw new Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Cl() {
  throw new Error("https://svelte.dev/e/hydration_failed");
}
function hg(e) {
  throw new Error("https://svelte.dev/e/props_invalid_value");
}
function Tl() {
  throw new Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Ll() {
  throw new Error("https://svelte.dev/e/state_prototype_fixed");
}
function Ol() {
  throw new Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Bl() {
  throw new Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
const pg = 1, gg = 2, yg = 4, wg = 8, vg = 16, bg = 1, mg = 4, _g = 8, Eg = 16, Pl = 1, Nl = 2, Oo = "[", Bo = "[!", Fi = "[?", Po = "]", Ht = {}, te = Symbol(), Ul = "http://www.w3.org/1999/xhtml", xg = "http://www.w3.org/2000/svg", kg = "http://www.w3.org/1998/Math/MathML", Ag = "@attach";
function Ml() {
  console.warn("https://svelte.dev/e/derived_inert");
}
function Qn(e) {
  console.warn("https://svelte.dev/e/hydration_mismatch");
}
function Ig() {
  console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function zl() {
  console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
let J = !1;
function bn(e) {
  J = e;
}
let M;
function $e(e) {
  if (e === null)
    throw Qn(), Ht;
  return M = e;
}
function Gr() {
  return $e(/* @__PURE__ */ Ye(M));
}
function Rg(e) {
  if (J) {
    if (/* @__PURE__ */ Ye(M) !== null)
      throw Qn(), Ht;
    M = e;
  }
}
function Hl(e = 1) {
  if (J) {
    for (var t = e, n = M; t--; )
      n = /** @type {TemplateNode} */
      /* @__PURE__ */ Ye(n);
    M = n;
  }
}
function Dl(e = !0) {
  for (var t = 0, n = M; ; ) {
    if (n.nodeType === dn) {
      var r = (
        /** @type {Comment} */
        n.data
      );
      if (r === Po) {
        if (t === 0) return n;
        t -= 1;
      } else (r === Oo || r === Bo || // "[1", "[2", etc. for if blocks
      r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
    }
    var i = (
      /** @type {TemplateNode} */
      /* @__PURE__ */ Ye(n)
    );
    e && n.remove(), n = i;
  }
}
function Sg(e) {
  if (!e || e.nodeType !== dn)
    throw Qn(), Ht;
  return (
    /** @type {Comment} */
    e.data
  );
}
function No(e) {
  return e === this.v;
}
function jl(e, t) {
  return e != e ? t == t : e !== t || e !== null && typeof e == "object" || typeof e == "function";
}
function Uo(e) {
  return !jl(e, this.v);
}
let ce = null;
function Dt(e) {
  ce = e;
}
function $g(e) {
  return (
    /** @type {T} */
    er().get(e)
  );
}
function Cg(e, t) {
  return er().set(e, t), t;
}
function Tg(e) {
  return er().has(e);
}
function Lg() {
  return er();
}
function Vl(e, t = !1, n) {
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
function ql(e) {
  var t = (
    /** @type {ComponentContext} */
    ce
  ), n = t.e;
  if (n !== null) {
    t.e = null;
    for (var r of n)
      is(r);
  }
  return e !== void 0 && (t.x = e), t.i = !0, ce = t.p, e ?? /** @type {T} */
  {};
}
function Mo() {
  return !0;
}
function er(e) {
  return ce === null && kl(), ce.c ??= new Map(Fl(ce) || void 0);
}
function Fl(e) {
  let t = e.p;
  for (; t !== null; ) {
    const n = t.c;
    if (n !== null)
      return n;
    t = t.p;
  }
  return null;
}
let yt = [];
function zo() {
  var e = yt;
  yt = [], vl(e);
}
function ot(e) {
  if (yt.length === 0 && !en) {
    var t = yt;
    queueMicrotask(() => {
      t === yt && zo();
    });
  }
  yt.push(e);
}
function Kl() {
  for (; yt.length > 0; )
    zo();
}
function Ho(e) {
  var t = O;
  if (t === null)
    return B.f |= it, e;
  if ((t.f & ht) === 0 && (t.f & zt) === 0)
    throw e;
  nt(e, t);
}
function nt(e, t) {
  for (; t !== null; ) {
    if ((t.f & $r) !== 0) {
      if ((t.f & ht) === 0)
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
const Zl = -7169;
function W(e, t) {
  e.f = e.f & Zl | t;
}
function Yr(e) {
  (e.f & ve) !== 0 || e.deps === null ? W(e, Q) : W(e, Ne);
}
function Do(e) {
  if (e !== null)
    for (const t of e)
      (t.f & ie) === 0 || (t.f & kt) === 0 || (t.f ^= kt, Do(
        /** @type {Derived} */
        t.deps
      ));
}
function jo(e, t, n) {
  (e.f & re) !== 0 ? t.add(e) : (e.f & Ne) !== 0 && n.add(e), Do(e.deps), W(e, Q);
}
let hr = null, St = null, U = null, Tr = null, Ie = null, Lr = null, en = !1, pr = !1, Tt = null, Rn = null;
var Ki = 0;
let Wl = 1;
class We {
  id = Wl++;
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
  #p = /* @__PURE__ */ new Set();
  /**
   * If a fork is discarded, we need to destroy any effects that are no longer needed
   * @type {Set<(batch: Batch) => void>}
   */
  #i = /* @__PURE__ */ new Set();
  /**
   * Callbacks that should run only when a fork is committed.
   * @type {Set<(batch: Batch) => void>}
   */
  #l = /* @__PURE__ */ new Set();
  /**
   * The number of async effects that are currently in flight
   */
  #n = 0;
  /**
   * Async effects that are currently in flight, _not_ inside a pending boundary
   * @type {Map<Effect, number>}
   */
  #r = /* @__PURE__ */ new Map();
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
  #s = [];
  /**
   * Effects created while this batch was active.
   * @type {Effect[]}
   */
  #a = [];
  /**
   * Deferred effects (which run after async work has completed) that are DIRTY
   * @type {Set<Effect>}
   */
  #u = /* @__PURE__ */ new Set();
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
  #h = /* @__PURE__ */ new Map();
  /**
   * Inverse of #skipped_branches which we need to tell prior batches to unskip them when committing
   * @type {Set<Effect>}
   */
  #f = /* @__PURE__ */ new Set();
  is_fork = !1;
  #w = !1;
  #_() {
    if (this.is_fork) return !0;
    for (const r of this.#r.keys()) {
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
    this.#h.has(t) || this.#h.set(t, { d: [], m: [] }), this.#f.delete(t);
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
    this.#f.add(t);
  }
  #y() {
    if (this.#e = !0, Ki++ > 1e3 && (this.#m(), Gl()), !this.#_()) {
      for (const a of this.#u)
        this.#d.delete(a), W(a, re), this.schedule(a);
      for (const a of this.#d)
        W(a, Ne), this.schedule(a);
    }
    const t = this.#s;
    this.#s = [], this.apply();
    var n = Tt = [], r = [], i = Rn = [];
    for (const a of t)
      try {
        this.#E(a, n, r);
      } catch (u) {
        throw Ko(a), u;
      }
    if (U = null, i.length > 0) {
      var o = We.ensure();
      for (const a of i)
        o.schedule(a);
    }
    if (Tt = null, Rn = null, this.#_()) {
      this.#g(r), this.#g(n);
      for (const [a, u] of this.#h)
        Fo(a, u);
      i.length > 0 && /** @type {unknown} */
      U.#y();
      return;
    }
    const s = this.#x();
    if (s) {
      s.#v(this);
      return;
    }
    this.#u.clear(), this.#d.clear();
    for (const a of this.#p) a(this);
    this.#p.clear(), Tr = this, Zi(r), Zi(n), Tr = null, this.#c?.resolve();
    var l = (
      /** @type {Batch | null} */
      /** @type {unknown} */
      U
    );
    if (this.linked && this.#n === 0 && this.#m(), this.#s.length > 0) {
      l === null && (l = this, this.#b());
      const a = l;
      a.#s.push(...this.#s.filter((u) => !a.#s.includes(u)));
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
      var o = i.f, s = (o & (Pe | Ze)) !== 0, l = s && (o & Q) !== 0, a = l || (o & be) !== 0 || this.#h.has(i);
      if (!a && i.fn !== null) {
        s ? i.f ^= Q : (o & zt) !== 0 ? n.push(i) : pn(i) && ((o & Ae) !== 0 && this.#d.add(i), Vt(i));
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
            o & (Bt | Ae) && !this.async_deriveds.has(s) && (this.#d.delete(s), W(s, re), this.schedule(s));
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
      jo(t[n], this.#u, this.#d);
  }
  /**
   * Associate a change to a given source with the current
   * batch, noting its previous and current values
   * @param {Value} source
   * @param {any} value
   * @param {boolean} [is_derived]
   */
  capture(t, n, r = !1) {
    t.v !== te && !this.previous.has(t) && this.previous.set(t, t.v), (t.f & it) === 0 && (this.current.set(t, [n, r]), Ie?.set(t, n)), this.is_fork || (t.v = n);
  }
  activate() {
    U = this;
  }
  deactivate() {
    U = null, Ie = null;
  }
  flush() {
    try {
      pr = !0, U = this, this.#y();
    } finally {
      Ki = 0, Lr = null, Tt = null, Rn = null, pr = !1, U = null, Ie = null, _t.clear();
    }
  }
  discard() {
    for (const t of this.#i) t(this);
    this.#i.clear(), this.#l.clear(), this.#m();
  }
  /**
   * @param {Effect} effect
   */
  register_created_effect(t) {
    this.#a.push(t);
  }
  #k() {
    this.#m();
    for (let f = hr; f !== null; f = f.#o) {
      var t = f.id < this.id, n = [];
      for (const [h, [w, p]] of this.current) {
        if (f.current.has(h)) {
          var r = (
            /** @type {[any, boolean]} */
            f.current.get(h)[0]
          );
          if (t && w !== r)
            f.current.set(h, [w, p]);
          else
            continue;
        }
        n.push(h);
      }
      if (t)
        for (const [h, w] of this.async_deriveds) {
          const p = f.async_deriveds.get(h);
          p && w.promise.then(p.resolve);
        }
      if (f.#e) {
        var i = [...f.current.keys()].filter((h) => !this.current.has(h));
        if (i.length === 0)
          t && f.discard();
        else if (n.length > 0) {
          if (t)
            for (const h of this.#f)
              f.unskip_effect(h, (w) => {
                (w.f & (Ae | Bt)) !== 0 ? f.schedule(w) : f.#g([w]);
              });
          f.activate();
          var o = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map();
          for (var l of n)
            qo(l, i, o, s);
          s = /* @__PURE__ */ new Map();
          var a = [...f.current.keys()].filter(
            (h) => this.current.has(h) ? (
              /** @type {[any, boolean]} */
              this.current.get(h)[0] !== h.v
            ) : !0
          );
          if (a.length > 0)
            for (const h of this.#a)
              (h.f & (Be | be | Mn)) === 0 && Xr(h, a, s) && ((h.f & (Bt | Ae)) !== 0 ? (W(h, re), f.schedule(h)) : f.#u.add(h));
          if (f.#s.length > 0) {
            f.apply();
            for (var u of f.#s)
              f.#E(u, [], []);
            f.#s = [];
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
    if (this.#n += 1, t) {
      let r = this.#r.get(n) ?? 0;
      this.#r.set(n, r + 1);
    }
  }
  /**
   * @param {boolean} blocking
   * @param {Effect} effect
   */
  decrement(t, n) {
    if (this.#n -= 1, t) {
      let r = this.#r.get(n) ?? 0;
      r === 1 ? this.#r.delete(n) : this.#r.set(n, r - 1);
    }
    this.#w || (this.#w = !0, ot(() => {
      this.#w = !1, this.linked && this.flush();
    }));
  }
  /**
   * @param {Set<Effect>} dirty_effects
   * @param {Set<Effect>} maybe_dirty_effects
   */
  transfer_effects(t, n) {
    for (const r of t)
      this.#u.add(r);
    for (const r of n)
      this.#d.add(r);
    t.clear(), n.clear();
  }
  /** @param {(batch: Batch) => void} fn */
  oncommit(t) {
    this.#p.add(t);
  }
  /** @param {(batch: Batch) => void} fn */
  ondiscard(t) {
    this.#i.add(t);
  }
  /** @param {(batch: Batch) => void} fn */
  on_fork_commit(t) {
    this.#l.add(t);
  }
  run_fork_commit_callbacks() {
    for (const t of this.#l) t(this);
    this.#l.clear();
  }
  settled() {
    return (this.#c ??= To()).promise;
  }
  static ensure() {
    if (U === null) {
      const t = U = new We();
      t.#b(), !pr && !en && ot(() => {
        t.#e || t.flush();
      });
    }
    return U;
  }
  apply() {
    {
      Ie = null;
      return;
    }
  }
  /**
   *
   * @param {Effect} effect
   */
  schedule(t) {
    if (Lr = t, t.b?.is_pending && (t.f & (zt | un | Wr)) !== 0 && (t.f & ht) === 0) {
      t.b.defer_effect(t);
      return;
    }
    for (var n = t; n.parent !== null; ) {
      n = n.parent;
      var r = n.f;
      if (Tt !== null && n === O && (B === null || (B.f & ie) === 0))
        return;
      if ((r & (Ze | Pe)) !== 0) {
        if ((r & Q) === 0)
          return;
        n.f ^= Q;
      }
    }
    this.#s.push(n);
  }
  #b() {
    St === null ? hr = St = this : (St.#o = this, this.#t = St), St = this;
  }
  #m() {
    var t = this.#t, n = this.#o;
    t === null ? hr = n : t.#o = n, n === null ? St = t : n.#t = t, this.linked = !1;
  }
}
function Vo(e) {
  var t = en;
  en = !0;
  try {
    for (var n; ; ) {
      if (Kl(), U === null)
        return (
          /** @type {T} */
          n
        );
      U.flush();
    }
  } finally {
    en = t;
  }
}
function Gl() {
  try {
    $l();
  } catch (e) {
    nt(e, Lr);
  }
}
let je = null;
function Zi(e) {
  var t = e.length;
  if (t !== 0) {
    for (var n = 0; n < t; ) {
      var r = e[n++];
      if ((r.f & (Be | be)) === 0 && pn(r) && (je = /* @__PURE__ */ new Set(), Vt(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && as(r), je?.size > 0)) {
        _t.clear();
        for (const i of je) {
          if ((i.f & (Be | be)) !== 0) continue;
          const o = [i];
          let s = i.parent;
          for (; s !== null; )
            je.has(s) && (je.delete(s), o.push(s)), s = s.parent;
          for (let l = o.length - 1; l >= 0; l--) {
            const a = o[l];
            (a.f & (Be | be)) === 0 && Vt(a);
          }
        }
        je.clear();
      }
    }
    je = null;
  }
}
function qo(e, t, n, r) {
  if (!n.has(e) && (n.add(e), e.reactions !== null))
    for (const i of e.reactions) {
      const o = i.f;
      (o & ie) !== 0 ? qo(
        /** @type {Derived} */
        i,
        t,
        n,
        r
      ) : (o & (Bt | Ae)) !== 0 && (o & re) === 0 && Xr(i, t, r) && (W(i, re), Jr(
        /** @type {Effect} */
        i
      ));
    }
}
function Xr(e, t, n) {
  const r = n.get(e);
  if (r !== void 0) return r;
  if (e.deps !== null)
    for (const i of e.deps) {
      if (Mt.call(t, i))
        return !0;
      if ((i.f & ie) !== 0 && Xr(
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
function Jr(e) {
  U.schedule(e);
}
function Fo(e, t) {
  if (!((e.f & Pe) !== 0 && (e.f & Q) !== 0)) {
    (e.f & re) !== 0 ? t.d.push(e) : (e.f & Ne) !== 0 && t.m.push(e), W(e, Q);
    for (var n = e.first; n !== null; )
      Fo(n, t), n = n.next;
  }
}
function Ko(e) {
  W(e, Q);
  for (var t = e.first; t !== null; )
    Ko(t), t = t.next;
}
function Yl(e) {
  let t = 0, n = hn(0), r;
  return () => {
    ti() && (qe(n), os(() => (t === 0 && (r = bc(() => e(() => tn(n)))), t += 1, () => {
      ot(() => {
        t -= 1, t === 0 && (r?.(), r = void 0, tn(n));
      });
    })));
  };
}
var Xl = sn | It;
function Jl(e, t, n, r) {
  new Ql(e, t, n, r);
}
class Ql {
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
  #t = J ? M : null;
  /** @type {BoundaryProps} */
  #o;
  /** @type {((anchor: Node) => void)} */
  #p;
  /** @type {Effect} */
  #i;
  /** @type {Effect | null} */
  #l = null;
  /** @type {Effect | null} */
  #n = null;
  /** @type {Effect | null} */
  #r = null;
  /** @type {DocumentFragment | null} */
  #c = null;
  #s = 0;
  #a = 0;
  #u = !1;
  /** @type {Set<Effect>} */
  #d = /* @__PURE__ */ new Set();
  /** @type {Set<Effect>} */
  #h = /* @__PURE__ */ new Set();
  /**
   * A source containing the number of pending async deriveds/expressions.
   * Only created if `$effect.pending()` is used inside the boundary,
   * otherwise updating the source results in needless `Batch.ensure()`
   * calls followed by no-op flushes
   * @type {Source<number> | null}
   */
  #f = null;
  #w = Yl(() => (this.#f = hn(this.#s), () => {
    this.#f = null;
  }));
  /**
   * @param {TemplateNode} node
   * @param {BoundaryProps} props
   * @param {((anchor: Node) => void)} children
   * @param {((error: unknown) => unknown) | undefined} [transform_error]
   */
  constructor(t, n, r, i) {
    this.#e = t, this.#o = n, this.#p = (o) => {
      var s = (
        /** @type {Effect} */
        O
      );
      s.b = this, s.f |= $r, r(o);
    }, this.parent = /** @type {Effect} */
    O.b, this.transform_error = i ?? this.parent?.transform_error ?? ((o) => o), this.#i = hc(() => {
      if (J) {
        const o = (
          /** @type {Comment} */
          this.#t
        );
        Gr();
        const s = o.data === Bo;
        if (o.data.startsWith(Fi)) {
          const a = JSON.parse(o.data.slice(Fi.length));
          this.#y(a);
        } else s ? this.#E() : this.#_();
      } else
        this.#x();
    }, Xl), J && (this.#e = M);
  }
  #_() {
    try {
      this.#l = pt(() => this.#p(this.#e));
    } catch (t) {
      this.error(t);
    }
  }
  /**
   * @param {unknown} error The deserialized error from the server's hydration comment
   */
  #y(t) {
    const n = this.#o.failed;
    n && (this.#r = pt(() => {
      n(
        this.#e,
        () => t,
        () => () => {
        }
      );
    }));
  }
  #E() {
    const t = this.#o.pending;
    t && (this.is_pending = !0, this.#n = pt(() => t(this.#e)), ot(() => {
      var n = this.#c = document.createDocumentFragment(), r = Ge();
      n.append(r), this.#l = this.#g(() => pt(() => this.#p(r))), this.#a === 0 && (this.#e.before(n), this.#c = null, Sn(
        /** @type {Effect} */
        this.#n,
        () => {
          this.#n = null;
        }
      ), this.#v(
        /** @type {Batch} */
        U
      ));
    }));
  }
  #x() {
    try {
      if (this.is_pending = this.has_pending_snippet(), this.#a = 0, this.#s = 0, this.#l = pt(() => {
        this.#p(this.#e);
      }), this.#a > 0) {
        var t = this.#c = document.createDocumentFragment();
        yc(this.#l, t);
        const n = (
          /** @type {(anchor: Node) => void} */
          this.#o.pending
        );
        this.#n = pt(() => n(this.#e));
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
    this.is_pending = !1, t.transfer_effects(this.#d, this.#h);
  }
  /**
   * Defer an effect inside a pending boundary until the boundary resolves
   * @param {Effect} effect
   */
  defer_effect(t) {
    jo(t, this.#d, this.#h);
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
    var n = O, r = B, i = ce;
    Ue(this.#i), _e(this.#i), Dt(this.#i.ctx);
    try {
      return We.ensure(), t();
    } catch (o) {
      return Ho(o), null;
    } finally {
      Ue(n), _e(r), Dt(i);
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
    this.#a += t, this.#a === 0 && (this.#v(n), this.#n && Sn(this.#n, () => {
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
  update_pending_count(t, n) {
    this.#k(t, n), this.#s += t, !(!this.#f || this.#u) && (this.#u = !0, ot(() => {
      this.#u = !1, this.#f && jn(this.#f, this.#s);
    }));
  }
  get_effect_pending() {
    return this.#w(), qe(
      /** @type {Source<number>} */
      this.#f
    );
  }
  /** @param {unknown} error */
  error(t) {
    if (!this.#o.onerror && !this.#o.failed)
      throw t;
    U?.is_fork ? (this.#l && U.skip_effect(this.#l), this.#n && U.skip_effect(this.#n), this.#r && U.skip_effect(this.#r), U.on_fork_commit(() => {
      this.#b(t);
    })) : this.#b(t);
  }
  /**
   * @param {unknown} error
   */
  #b(t) {
    this.#l && (Se(this.#l), this.#l = null), this.#n && (Se(this.#n), this.#n = null), this.#r && (Se(this.#r), this.#r = null), J && ($e(
      /** @type {TemplateNode} */
      this.#t
    ), Hl(), $e(Dl()));
    var n = this.#o.onerror;
    let r = this.#o.failed;
    var i = !1, o = !1;
    const s = () => {
      if (i) {
        zl();
        return;
      }
      i = !0, o && Bl(), this.#r !== null && Sn(this.#r, () => {
        this.#r = null;
      }), this.#g(() => {
        this.#x();
      });
    }, l = (a) => {
      try {
        o = !0, n?.(a, s), o = !1;
      } catch (u) {
        nt(u, this.#i && this.#i.parent);
      }
      r && (this.#r = this.#g(() => {
        try {
          return pt(() => {
            var u = (
              /** @type {Effect} */
              O
            );
            u.b = this, u.f |= $r, r(
              this.#e,
              () => a,
              () => s
            );
          });
        } catch (u) {
          return nt(
            u,
            /** @type {Effect} */
            this.#i.parent
          ), null;
        }
      }));
    };
    ot(() => {
      var a;
      try {
        a = this.transform_error(t);
      } catch (u) {
        nt(u, this.#i && this.#i.parent);
        return;
      }
      a !== null && typeof a == "object" && typeof /** @type {any} */
      a.then == "function" ? a.then(
        l,
        /** @param {unknown} e */
        (u) => nt(u, this.#i && this.#i.parent)
      ) : l(a);
    });
  }
}
function ec(e, t, n, r) {
  const i = Qr;
  var o = e.filter((w) => !w.settled);
  if (n.length === 0 && o.length === 0) {
    r(t.map(i));
    return;
  }
  var s = (
    /** @type {Effect} */
    O
  ), l = tc(), a = o.length === 1 ? o[0].promise : o.length > 1 ? Promise.all(o.map((w) => w.promise)) : null;
  function u(w) {
    if ((s.f & Be) === 0) {
      l();
      try {
        r(w);
      } catch (p) {
        nt(p, s);
      }
      Hn();
    }
  }
  var f = Zo();
  if (n.length === 0) {
    a.then(() => u(t.map(i))).finally(f);
    return;
  }
  function h() {
    Promise.all(n.map((w) => /* @__PURE__ */ nc(w))).then((w) => u([...t.map(i), ...w])).catch((w) => nt(w, s)).finally(f);
  }
  a ? a.then(() => {
    l(), h(), Hn();
  }) : h();
}
function tc() {
  var e = (
    /** @type {Effect} */
    O
  ), t = B, n = ce, r = (
    /** @type {Batch} */
    U
  );
  return function(o = !0) {
    Ue(e), _e(t), Dt(n), o && (e.f & Be) === 0 && (r?.activate(), r?.apply());
  };
}
function Hn(e = !0) {
  Ue(null), _e(null), Dt(null), e && U?.deactivate();
}
function Zo() {
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
function Qr(e) {
  var t = ie | re;
  return O !== null && (O.f |= It), {
    ctx: ce,
    deps: null,
    effects: null,
    equals: No,
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
const mn = Symbol("obsolete");
// @__NO_SIDE_EFFECTS__
function nc(e, t, n) {
  let r = (
    /** @type {Effect | null} */
    O
  );
  r === null && Al();
  var i = (
    /** @type {Promise<V>} */
    /** @type {unknown} */
    void 0
  ), o = hn(
    /** @type {V} */
    te
  ), s = !B, l = /* @__PURE__ */ new Set();
  return dc(() => {
    var a = (
      /** @type {Effect} */
      O
    ), u = To();
    i = u.promise;
    try {
      Promise.resolve(e()).then(u.resolve, (p) => {
        p !== Jn && u.reject(p);
      }).finally(Hn);
    } catch (p) {
      u.reject(p), Hn();
    }
    var f = (
      /** @type {Batch} */
      U
    );
    if (s) {
      if ((a.f & ht) !== 0)
        var h = Zo();
      if (
        /** @type {Boundary} */
        r.b.is_rendered()
      )
        f.async_deriveds.get(a)?.reject(mn);
      else
        for (const p of l.values())
          p.reject(mn);
      l.add(u), f.async_deriveds.set(a, u);
    }
    const w = (p, c = void 0) => {
      h?.(), l.delete(u), c !== mn && (f.activate(), c ? (o.f |= it, jn(o, c)) : ((o.f & it) !== 0 && (o.f ^= it), jn(o, p)), f.deactivate());
    };
    u.promise.then(w, (p) => w(null, p || "unknown"));
  }), rs(() => {
    for (const a of l)
      a.reject(mn);
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
function Og(e) {
  const t = /* @__PURE__ */ Qr(e);
  return us(t), t;
}
// @__NO_SIDE_EFFECTS__
function Bg(e) {
  const t = /* @__PURE__ */ Qr(e);
  return t.equals = Uo, t;
}
function rc(e) {
  var t = e.effects;
  if (t !== null) {
    e.effects = null;
    for (var n = 0; n < t.length; n += 1)
      Se(
        /** @type {Effect} */
        t[n]
      );
  }
}
function ei(e) {
  var t, n = O, r = e.parent;
  if (!ct && r !== null && (r.f & (Be | be)) !== 0)
    return Ml(), e.v;
  Ue(r);
  try {
    e.f &= ~kt, rc(e), t = ps(e);
  } finally {
    Ue(n);
  }
  return t;
}
function Wo(e) {
  var t = ei(e);
  if (!e.equals(t) && (e.wv = ds(), (!U?.is_fork || e.deps === null) && (U !== null ? (U.capture(e, t, !0), Tr?.capture(e, t, !0)) : e.v = t, e.deps === null))) {
    W(e, Q);
    return;
  }
  ct || (Ie !== null ? (ti() || U?.is_fork) && Ie.set(e, t) : Yr(e));
}
function ic(e) {
  if (e.effects !== null)
    for (const t of e.effects)
      (t.teardown || t.ac) && (t.teardown?.(), t.ac?.abort(Jn), t.teardown = wl, t.ac = null, an(t, 0), ni(t));
}
function Go(e) {
  if (e.effects !== null)
    for (const t of e.effects)
      t.teardown && Vt(t);
}
let Dn = /* @__PURE__ */ new Set();
const _t = /* @__PURE__ */ new Map();
let Yo = !1;
function hn(e, t) {
  var n = {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v: e,
    reactions: null,
    equals: No,
    rv: 0,
    wv: 0
  };
  return n;
}
// @__NO_SIDE_EFFECTS__
function Xe(e, t) {
  const n = hn(e);
  return us(n), n;
}
// @__NO_SIDE_EFFECTS__
function oc(e, t = !1, n = !0) {
  const r = hn(e);
  return t || (r.equals = Uo), r;
}
function et(e, t, n = !1) {
  B !== null && // since we are untracking the function inside `$inspect.with` we need to add this check
  // to ensure we error if state is set inside an inspect effect
  (!Re || (B.f & Mn) !== 0) && Mo() && (B.f & (ie | Ae | Bt | Mn)) !== 0 && (me === null || !Mt.call(me, e)) && Ol();
  let r = n ? Xt(t) : t;
  return jn(e, r, Rn);
}
function jn(e, t, n = null) {
  if (!e.equals(t)) {
    _t.set(e, ct ? t : e.v);
    var r = We.ensure();
    if (r.capture(e, t), (e.f & ie) !== 0) {
      const i = (
        /** @type {Derived} */
        e
      );
      (e.f & re) !== 0 && ei(i), Ie === null && Yr(i);
    }
    e.wv = ds(), Xo(e, re, n), O !== null && (O.f & Q) !== 0 && (O.f & (Pe | Ze)) === 0 && (we === null ? wc([e]) : we.push(e)), !r.is_fork && Dn.size > 0 && !Yo && sc();
  }
  return t;
}
function sc() {
  Yo = !1;
  for (const e of Dn) {
    (e.f & Q) !== 0 && W(e, Ne);
    let t;
    try {
      t = pn(e);
    } catch {
      t = !0;
    }
    t && Vt(e);
  }
  Dn.clear();
}
function tn(e) {
  et(e, e.v + 1);
}
function Xo(e, t, n) {
  var r = e.reactions;
  if (r !== null)
    for (var i = r.length, o = 0; o < i; o++) {
      var s = r[o], l = s.f, a = (l & re) === 0;
      if (a && W(s, t), (l & Mn) !== 0)
        Dn.add(
          /** @type {Effect} */
          s
        );
      else if ((l & ie) !== 0) {
        var u = (
          /** @type {Derived} */
          s
        );
        Ie?.delete(u), (l & kt) === 0 && (l & ve && (O === null || (O.f & zn) === 0) && (s.f |= kt), Xo(u, Ne, n));
      } else if (a) {
        var f = (
          /** @type {Effect} */
          s
        );
        (l & Ae) !== 0 && je !== null && je.add(f), n !== null ? n.push(f) : Jr(f);
      }
    }
}
function Xt(e) {
  if (typeof e != "object" || e === null || mt in e)
    return e;
  const t = Co(e);
  if (t !== gl && t !== yl)
    return e;
  var n = /* @__PURE__ */ new Map(), r = fl(e), i = /* @__PURE__ */ Xe(0), o = Et, s = (l) => {
    if (Et === o)
      return l();
    var a = B, u = Et;
    _e(null), Ji(o);
    var f = l();
    return _e(a), Ji(u), f;
  };
  return r && n.set("length", /* @__PURE__ */ Xe(
    /** @type {any[]} */
    e.length
  )), new Proxy(
    /** @type {any} */
    e,
    {
      defineProperty(l, a, u) {
        (!("value" in u) || u.configurable === !1 || u.enumerable === !1 || u.writable === !1) && Tl();
        var f = n.get(a);
        return f === void 0 ? s(() => {
          var h = /* @__PURE__ */ Xe(u.value);
          return n.set(a, h), h;
        }) : et(f, u.value, !0), !0;
      },
      deleteProperty(l, a) {
        var u = n.get(a);
        if (u === void 0) {
          if (a in l) {
            const f = s(() => /* @__PURE__ */ Xe(te));
            n.set(a, f), tn(i);
          }
        } else
          et(u, te), tn(i);
        return !0;
      },
      get(l, a, u) {
        if (a === mt)
          return e;
        var f = n.get(a), h = a in l;
        if (f === void 0 && (!h || Ot(l, a)?.writable) && (f = s(() => {
          var p = Xt(h ? l[a] : te), c = /* @__PURE__ */ Xe(p);
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
        if (a === mt)
          return !0;
        var u = n.get(a), f = u !== void 0 && u.v !== te || Reflect.has(l, a);
        if (u !== void 0 || O !== null && (!f || Ot(l, a)?.writable)) {
          u === void 0 && (u = s(() => {
            var w = f ? Xt(l[a]) : te, p = /* @__PURE__ */ Xe(w);
            return p;
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
          for (var p = u; p < /** @type {Source<number>} */
          h.v; p += 1) {
            var c = n.get(p + "");
            c !== void 0 ? et(c, te) : p in l && (c = s(() => /* @__PURE__ */ Xe(te)), n.set(p + "", c));
          }
        if (h === void 0)
          (!w || Ot(l, a)?.writable) && (h = s(() => /* @__PURE__ */ Xe(void 0)), et(h, Xt(u)), n.set(a, h));
        else {
          w = h.v !== te;
          var d = s(() => Xt(u));
          et(h, d);
        }
        var y = Reflect.getOwnPropertyDescriptor(l, a);
        if (y?.set && y.set.call(f, u), !w) {
          if (r && typeof a == "string") {
            var g = (
              /** @type {Source<number>} */
              n.get("length")
            ), v = Number(a);
            Number.isInteger(v) && v >= g.v && et(g, v + 1);
          }
          tn(i);
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
        Ll();
      }
    }
  );
}
function Wi(e) {
  try {
    if (e !== null && typeof e == "object" && mt in e)
      return e[mt];
  } catch {
  }
  return e;
}
function Pg(e, t) {
  return Object.is(Wi(e), Wi(t));
}
var Gi, Jo, Qo, es;
function Or() {
  if (Gi === void 0) {
    Gi = window, Jo = /Firefox/.test(navigator.userAgent);
    var e = Element.prototype, t = Node.prototype, n = Text.prototype;
    Qo = Ot(t, "firstChild").get, es = Ot(t, "nextSibling").get, Vi(e) && (e[El] = void 0, e[_l] = null, e[xl] = void 0, e.__e = void 0), Vi(n) && (n[Cr] = void 0);
  }
}
function Ge(e = "") {
  return document.createTextNode(e);
}
// @__NO_SIDE_EFFECTS__
function jt(e) {
  return (
    /** @type {TemplateNode | null} */
    Qo.call(e)
  );
}
// @__NO_SIDE_EFFECTS__
function Ye(e) {
  return (
    /** @type {TemplateNode | null} */
    es.call(e)
  );
}
function Ng(e, t) {
  if (!J)
    return /* @__PURE__ */ jt(e);
  var n = /* @__PURE__ */ jt(M);
  if (n === null)
    n = M.appendChild(Ge());
  else if (t && n.nodeType !== fn) {
    var r = Ge();
    return n?.before(r), $e(r), r;
  }
  return t && tr(
    /** @type {Text} */
    n
  ), $e(n), n;
}
function Ug(e, t = !1) {
  if (!J) {
    var n = /* @__PURE__ */ jt(e);
    return n instanceof Comment && n.data === "" ? /* @__PURE__ */ Ye(n) : n;
  }
  if (t) {
    if (M?.nodeType !== fn) {
      var r = Ge();
      return M?.before(r), $e(r), r;
    }
    tr(
      /** @type {Text} */
      M
    );
  }
  return M;
}
function Mg(e, t = 1, n = !1) {
  let r = J ? M : e;
  for (var i; t--; )
    i = r, r = /** @type {TemplateNode} */
    /* @__PURE__ */ Ye(r);
  if (!J)
    return r;
  if (n) {
    if (r?.nodeType !== fn) {
      var o = Ge();
      return r === null ? i?.after(o) : r.before(o), $e(o), o;
    }
    tr(
      /** @type {Text} */
      r
    );
  }
  return $e(r), r;
}
function ac(e) {
  e.textContent = "";
}
function zg() {
  return !1;
}
function ts(e, t, n) {
  return (
    /** @type {T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : Element} */
    document.createElementNS(t ?? Ul, e, void 0)
  );
}
function tr(e) {
  if (
    /** @type {string} */
    e.nodeValue.length < 65536
  )
    return;
  let t = e.nextSibling;
  for (; t !== null && t.nodeType === fn; )
    t.remove(), e.nodeValue += /** @type {string} */
    t.nodeValue, t = e.nextSibling;
}
function Hg(e, t) {
  if (t) {
    const n = document.body;
    e.autofocus = !0, ot(() => {
      document.activeElement === n && e.focus();
    });
  }
}
let Yi = !1;
function lc() {
  Yi || (Yi = !0, document.addEventListener(
    "reset",
    (e) => {
      Promise.resolve().then(() => {
        if (!e.defaultPrevented)
          for (
            const t of
            /**@type {HTMLFormElement} */
            e.target.elements
          )
            t[In]?.();
      });
    },
    // In the capture phase to guarantee we get noticed of it (no possibility of stopPropagation)
    { capture: !0 }
  ));
}
function nr(e) {
  var t = B, n = O;
  _e(null), Ue(null);
  try {
    return e();
  } finally {
    _e(t), Ue(n);
  }
}
function Dg(e, t, n, r = n) {
  e.addEventListener(t, () => nr(n));
  const i = (
    /** @type {any} */
    e[In]
  );
  i ? e[In] = () => {
    i(), r(!0);
  } : e[In] = () => r(!0), lc();
}
function ns(e) {
  O === null && (B === null && Sl(), Rl()), ct && Il();
}
function cc(e, t) {
  var n = t.last;
  n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function xe(e, t) {
  var n = O;
  n !== null && (n.f & be) !== 0 && (e |= be);
  var r = {
    ctx: ce,
    deps: null,
    nodes: null,
    f: e | re | ve,
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
  if ((e & zt) !== 0)
    Tt !== null ? Tt.push(r) : We.ensure().schedule(r);
  else if (t !== null) {
    try {
      Vt(r);
    } catch (s) {
      throw Se(r), s;
    }
    i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && // either `null`, or a singular child
    (i.f & It) === 0 && (i = i.first, (e & Ae) !== 0 && (e & sn) !== 0 && i !== null && (i.f |= sn));
  }
  if (i !== null && (i.parent = n, n !== null && cc(i, n), B !== null && (B.f & ie) !== 0 && (e & Ze) === 0)) {
    var o = (
      /** @type {Derived} */
      B
    );
    (o.effects ??= []).push(i);
  }
  return r;
}
function ti() {
  return B !== null && !Re;
}
function rs(e) {
  const t = xe(un, null);
  return W(t, Q), t.teardown = e, t;
}
function jg(e) {
  ns();
  var t = (
    /** @type {Effect} */
    O.f
  ), n = !B && (t & Pe) !== 0 && (t & ht) === 0;
  if (n) {
    var r = (
      /** @type {ComponentContext} */
      ce
    );
    (r.e ??= []).push(e);
  } else
    return is(e);
}
function is(e) {
  return xe(zt | Lo, e);
}
function Vg(e) {
  return ns(), xe(un | Lo, e);
}
function uc(e) {
  We.ensure();
  const t = xe(Ze | It, e);
  return () => {
    Se(t);
  };
}
function fc(e) {
  We.ensure();
  const t = xe(Ze | It, e);
  return (n = {}) => new Promise((r) => {
    n.outro ? Sn(t, () => {
      Se(t), r(void 0);
    }) : (Se(t), r(void 0));
  });
}
function qg(e) {
  return xe(zt, e);
}
function dc(e) {
  return xe(Bt | It, e);
}
function os(e, t = 0) {
  return xe(un | t, e);
}
function Fg(e, t = [], n = [], r = []) {
  ec(r, t, n, (i) => {
    xe(un, () => e(...i.map(qe)));
  });
}
function hc(e, t = 0) {
  var n = xe(Ae | t, e);
  return n;
}
function Kg(e, t = 0) {
  var n = xe(Wr | t, e);
  return n;
}
function pt(e) {
  return xe(Pe | It, e);
}
function ss(e) {
  var t = e.teardown;
  if (t !== null) {
    const n = ct, r = B;
    Xi(!0), _e(null);
    try {
      t.call(null);
    } finally {
      Xi(n), _e(r);
    }
  }
}
function ni(e, t = !1) {
  var n = e.first;
  for (e.first = e.last = null; n !== null; ) {
    const i = n.ac;
    i !== null && nr(() => {
      i.abort(Jn);
    });
    var r = n.next;
    (n.f & Ze) !== 0 ? n.parent = null : Se(n, t), n = r;
  }
}
function pc(e) {
  for (var t = e.first; t !== null; ) {
    var n = t.next;
    (t.f & Pe) === 0 && Se(t), t = n;
  }
}
function Se(e, t = !0) {
  var n = !1;
  (t || (e.f & bl) !== 0) && e.nodes !== null && e.nodes.end !== null && (gc(
    e.nodes.start,
    /** @type {TemplateNode} */
    e.nodes.end
  ), n = !0), W(e, qi), ni(e, t && !n), an(e, 0);
  var r = e.nodes && e.nodes.t;
  if (r !== null)
    for (const o of r)
      o.stop();
  ss(e), e.f ^= qi, e.f |= Be;
  var i = e.parent;
  i !== null && i.first !== null && as(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function gc(e, t) {
  for (; e !== null; ) {
    var n = e === t ? null : /* @__PURE__ */ Ye(e);
    e.remove(), e = n;
  }
}
function as(e) {
  var t = e.parent, n = e.prev, r = e.next;
  n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Sn(e, t, n = !0) {
  var r = [];
  ls(e, r, !0);
  var i = () => {
    n && Se(e), t && t();
  }, o = r.length;
  if (o > 0) {
    var s = () => --o || i();
    for (var l of r)
      l.out(s);
  } else
    i();
}
function ls(e, t, n) {
  if ((e.f & be) === 0) {
    e.f ^= be;
    var r = e.nodes && e.nodes.t;
    if (r !== null)
      for (const l of r)
        (l.is_global || n) && t.push(l);
    for (var i = e.first; i !== null; ) {
      var o = i.next;
      if ((i.f & Ze) === 0) {
        var s = (i.f & sn) !== 0 || // If this is a branch effect without a block effect parent,
        // it means the parent block effect was pruned. In that case,
        // transparency information was transferred to the branch effect.
        (i.f & Pe) !== 0 && (e.f & Ae) !== 0;
        ls(i, t, s ? n : !1);
      }
      i = o;
    }
  }
}
function Zg(e) {
  cs(e, !0);
}
function cs(e, t) {
  if ((e.f & be) !== 0) {
    e.f ^= be, (e.f & Q) === 0 && (W(e, re), We.ensure().schedule(e));
    for (var n = e.first; n !== null; ) {
      var r = n.next, i = (n.f & sn) !== 0 || (n.f & Pe) !== 0;
      cs(n, i ? t : !1), n = r;
    }
    var o = e.nodes && e.nodes.t;
    if (o !== null)
      for (const s of o)
        (s.is_global || t) && s.in();
  }
}
function yc(e, t) {
  if (e.nodes)
    for (var n = e.nodes.start, r = e.nodes.end; n !== null; ) {
      var i = n === r ? null : /* @__PURE__ */ Ye(n);
      t.append(n), n = i;
    }
}
let $n = !1, ct = !1;
function Xi(e) {
  ct = e;
}
let B = null, Re = !1;
function _e(e) {
  B = e;
}
let O = null;
function Ue(e) {
  O = e;
}
let me = null;
function us(e) {
  B !== null && (me === null ? me = [e] : me.push(e));
}
let fe = null, ge = 0, we = null;
function wc(e) {
  we = e;
}
let fs = 1, wt = 0, Et = wt;
function Ji(e) {
  Et = e;
}
function ds() {
  return ++fs;
}
function pn(e) {
  var t = e.f;
  if ((t & re) !== 0)
    return !0;
  if (t & ie && (e.f &= ~kt), (t & Ne) !== 0) {
    for (var n = (
      /** @type {Value[]} */
      e.deps
    ), r = n.length, i = 0; i < r; i++) {
      var o = n[i];
      if (pn(
        /** @type {Derived} */
        o
      ) && Wo(
        /** @type {Derived} */
        o
      ), o.wv > e.wv)
        return !0;
    }
    (t & ve) !== 0 && // During time traveling we don't want to reset the status so that
    // traversal of the graph in the other batches still happens
    Ie === null && W(e, Q);
  }
  return !1;
}
function hs(e, t, n = !0) {
  var r = e.reactions;
  if (r !== null && !(me !== null && Mt.call(me, e)))
    for (var i = 0; i < r.length; i++) {
      var o = r[i];
      (o.f & ie) !== 0 ? hs(
        /** @type {Derived} */
        o,
        t,
        !1
      ) : t === o && (n ? W(o, re) : (o.f & Q) !== 0 && W(o, Ne), Jr(
        /** @type {Effect} */
        o
      ));
    }
}
function ps(e) {
  var t = fe, n = ge, r = we, i = B, o = me, s = ce, l = Re, a = Et, u = e.f;
  fe = /** @type {null | Value[]} */
  null, ge = 0, we = null, B = (u & (Pe | Ze)) === 0 ? e : null, me = null, Dt(e.ctx), Re = !1, Et = ++wt, e.ac !== null && (nr(() => {
    e.ac.abort(Jn);
  }), e.ac = null);
  try {
    e.f |= zn;
    var f = (
      /** @type {Function} */
      e.fn
    ), h = f();
    e.f |= ht;
    var w = e.deps, p = U?.is_fork;
    if (fe !== null) {
      var c;
      if (p || an(e, ge), w !== null && ge > 0)
        for (w.length = ge + fe.length, c = 0; c < fe.length; c++)
          w[ge + c] = fe[c];
      else
        e.deps = w = fe;
      if (ti() && (e.f & ve) !== 0)
        for (c = ge; c < w.length; c++)
          (w[c].reactions ??= []).push(e);
    } else !p && w !== null && ge < w.length && (an(e, ge), w.length = ge);
    if (Mo() && we !== null && !Re && w !== null && (e.f & (ie | Ne | re)) === 0)
      for (c = 0; c < /** @type {Source[]} */
      we.length; c++)
        hs(
          we[c],
          /** @type {Effect} */
          e
        );
    if (i !== null && i !== e) {
      if (wt++, i.deps !== null)
        for (let d = 0; d < n; d += 1)
          i.deps[d].rv = wt;
      if (t !== null)
        for (const d of t)
          d.rv = wt;
      we !== null && (r === null ? r = we : r.push(.../** @type {Source[]} */
      we));
    }
    return (e.f & it) !== 0 && (e.f ^= it), h;
  } catch (d) {
    return Ho(d);
  } finally {
    e.f ^= zn, fe = t, ge = n, we = r, B = i, me = o, Dt(s), Re = l, Et = a;
  }
}
function vc(e, t) {
  let n = t.reactions;
  if (n !== null) {
    var r = dl.call(n, e);
    if (r !== -1) {
      var i = n.length - 1;
      i === 0 ? n = t.reactions = null : (n[r] = n[i], n.pop());
    }
  }
  if (n === null && (t.f & ie) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
  // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
  // allows us to skip the expensive work of disconnecting and immediately reconnecting it
  (fe === null || !Mt.call(fe, t))) {
    var o = (
      /** @type {Derived} */
      t
    );
    (o.f & ve) !== 0 && (o.f ^= ve, o.f &= ~kt), o.v !== te && Yr(o), ic(o), an(o, 0);
  }
}
function an(e, t) {
  var n = e.deps;
  if (n !== null)
    for (var r = t; r < n.length; r++)
      vc(e, n[r]);
}
function Vt(e) {
  var t = e.f;
  if ((t & Be) === 0) {
    W(e, Q);
    var n = O, r = $n;
    O = e, $n = !0;
    try {
      (t & (Ae | Wr)) !== 0 ? pc(e) : ni(e), ss(e);
      var i = ps(e);
      e.teardown = typeof i == "function" ? i : null, e.wv = fs;
      var o;
    } finally {
      $n = r, O = n;
    }
  }
}
async function Wg() {
  await Promise.resolve(), Vo();
}
function qe(e) {
  var t = e.f, n = (t & ie) !== 0;
  if (B !== null && !Re) {
    var r = O !== null && (O.f & Be) !== 0;
    if (!r && (me === null || !Mt.call(me, e))) {
      var i = B.deps;
      if ((B.f & zn) !== 0)
        e.rv < wt && (e.rv = wt, fe === null && i !== null && i[ge] === e ? ge++ : fe === null ? fe = [e] : fe.push(e));
      else {
        (B.deps ??= []).push(e);
        var o = e.reactions;
        o === null ? e.reactions = [B] : Mt.call(o, B) || o.push(B);
      }
    }
  }
  if (ct && _t.has(e))
    return _t.get(e);
  if (n) {
    var s = (
      /** @type {Derived} */
      e
    );
    if (ct) {
      var l = s.v;
      return ((s.f & Q) === 0 && s.reactions !== null || ys(s)) && (l = ei(s)), _t.set(s, l), l;
    }
    var a = (s.f & ve) === 0 && !Re && B !== null && ($n || (B.f & ve) !== 0), u = (s.f & ht) === 0;
    pn(s) && (a && (s.f |= ve), Wo(s)), a && !u && (Go(s), gs(s));
  }
  if (Ie?.has(e))
    return Ie.get(e);
  if ((e.f & it) !== 0)
    throw e.v;
  return e.v;
}
function gs(e) {
  if (e.f |= ve, e.deps !== null)
    for (const t of e.deps)
      (t.reactions ??= []).push(e), (t.f & ie) !== 0 && (t.f & ve) === 0 && (Go(
        /** @type {Derived} */
        t
      ), gs(
        /** @type {Derived} */
        t
      ));
}
function ys(e) {
  if (e.v === te) return !0;
  if (e.deps === null) return !1;
  for (const t of e.deps)
    if (_t.has(t) || (t.f & ie) !== 0 && ys(
      /** @type {Derived} */
      t
    ))
      return !0;
  return !1;
}
function bc(e) {
  var t = Re;
  try {
    return Re = !0, e();
  } finally {
    Re = t;
  }
}
function Gg(e) {
  if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
    if (mt in e)
      Br(e);
    else if (!Array.isArray(e))
      for (let t in e) {
        const n = e[t];
        typeof n == "object" && n && mt in n && Br(n);
      }
  }
}
function Br(e, t = /* @__PURE__ */ new Set()) {
  if (typeof e == "object" && e !== null && // We don't want to traverse DOM elements
  !(e instanceof EventTarget) && !t.has(e)) {
    t.add(e), e instanceof Date && e.getTime();
    for (let r in e)
      try {
        Br(e[r], t);
      } catch {
      }
    const n = Co(e);
    if (n !== Object.prototype && n !== Array.prototype && n !== Map.prototype && n !== Set.prototype && n !== Date.prototype) {
      const r = pl(n);
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
function Yg(e) {
  return e.endsWith("capture") && e !== "gotpointercapture" && e !== "lostpointercapture";
}
const mc = [
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
function Xg(e) {
  return mc.includes(e);
}
const _c = {
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
function Jg(e) {
  return e = e.toLowerCase(), _c[e] ?? e;
}
const Ec = ["touchstart", "touchmove"];
function xc(e) {
  return Ec.includes(e);
}
const kc = (
  /** @type {const} */
  ["textarea", "script", "style", "title"]
);
function Qg(e) {
  return kc.includes(
    /** @type {typeof RAW_TEXT_ELEMENTS[number]} */
    e
  );
}
const Jt = Symbol("events"), ws = /* @__PURE__ */ new Set(), Pr = /* @__PURE__ */ new Set();
function e0(e) {
  if (!J) return;
  e.removeAttribute("onload"), e.removeAttribute("onerror");
  const t = e.__e;
  t !== void 0 && (e.__e = void 0, queueMicrotask(() => {
    e.isConnected && e.dispatchEvent(t);
  }));
}
function vs(e, t, n, r = {}) {
  function i(o) {
    if (r.capture || Nr.call(t, o), !o.cancelBubble)
      return nr(() => n?.call(this, o));
  }
  return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? ot(() => {
    t.addEventListener(e, i, r);
  }) : t.addEventListener(e, i, r), i;
}
function t0(e, t, n, r = {}) {
  var i = vs(t, e, n, r);
  return () => {
    e.removeEventListener(t, i, r);
  };
}
function n0(e, t, n, r, i) {
  var o = { capture: r, passive: i }, s = vs(e, t, n, o);
  (t === document.body || // @ts-ignore
  t === window || // @ts-ignore
  t === document || // Firefox has quirky behavior, it can happen that we still get "canplay" events when the element is already removed
  t instanceof HTMLMediaElement) && rs(() => {
    t.removeEventListener(e, s, o);
  });
}
function r0(e, t, n) {
  (t[Jt] ??= {})[e] = n;
}
function i0(e) {
  for (var t = 0; t < e.length; t++)
    ws.add(e[t]);
  for (var n of Pr)
    n(e);
}
let Qi = null;
function Nr(e) {
  var t = this, n = (
    /** @type {Node} */
    t.ownerDocument
  ), r = e.type, i = e.composedPath?.() || [], o = (
    /** @type {null | Element} */
    i[0] || e.target
  );
  Qi = e;
  var s = 0, l = Qi === e && e[Jt];
  if (l) {
    var a = i.indexOf(l);
    if (a !== -1 && (t === document || t === /** @type {any} */
    window)) {
      e[Jt] = t;
      return;
    }
    var u = i.indexOf(t);
    if (u === -1)
      return;
    a <= u && (s = a);
  }
  if (o = /** @type {Element} */
  i[s] || e.target, o !== t) {
    Un(e, "currentTarget", {
      configurable: !0,
      get() {
        return o || n;
      }
    });
    var f = B, h = O;
    _e(null), Ue(null);
    try {
      for (var w, p = []; o !== null; ) {
        var c = o.assignedSlot || o.parentNode || /** @type {any} */
        o.host || null;
        try {
          var d = o[Jt]?.[r];
          d != null && (!/** @type {any} */
          o.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
          // -> the target could not have been disabled because it emits the event in the first place
          e.target === o) && d.call(o, e);
        } catch (y) {
          w ? p.push(y) : w = y;
        }
        if (e.cancelBubble || c === t || c === null)
          break;
        o = c;
      }
      if (w) {
        for (let y of p)
          queueMicrotask(() => {
            throw y;
          });
        throw w;
      }
    } finally {
      e[Jt] = t, delete e.currentTarget, _e(f), Ue(h);
    }
  }
}
const Ac = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", {
    /** @param {string} html */
    createHTML: (e) => e
  })
);
function Ic(e) {
  return (
    /** @type {string} */
    Ac?.createHTML(e) ?? e
  );
}
function Rc(e) {
  var t = ts("template");
  return t.innerHTML = Ic(e.replaceAll("<!>", "<!---->")), t.content;
}
function st(e, t) {
  var n = (
    /** @type {Effect} */
    O
  );
  n.nodes === null && (n.nodes = { start: e, end: t, a: null, t: null });
}
// @__NO_SIDE_EFFECTS__
function o0(e, t) {
  var n = (t & Pl) !== 0, r = (t & Nl) !== 0, i, o = !e.startsWith("<!>");
  return () => {
    if (J)
      return st(M, null), M;
    i === void 0 && (i = Rc(o ? e : "<!>" + e), n || (i = /** @type {TemplateNode} */
    /* @__PURE__ */ jt(i)));
    var s = (
      /** @type {TemplateNode} */
      r || Jo ? document.importNode(i, !0) : i.cloneNode(!0)
    );
    if (n) {
      var l = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ jt(s)
      ), a = (
        /** @type {TemplateNode} */
        s.lastChild
      );
      st(l, a);
    } else
      st(s, s);
    return s;
  };
}
function s0(e = "") {
  if (!J) {
    var t = Ge(e + "");
    return st(t, t), t;
  }
  var n = M;
  return n.nodeType !== fn ? (n.before(n = Ge()), $e(n)) : tr(
    /** @type {Text} */
    n
  ), st(n, n), n;
}
function a0() {
  if (J)
    return st(M, null), M;
  var e = document.createDocumentFragment(), t = document.createComment(""), n = Ge();
  return e.append(t, n), st(t, n), e;
}
function Sc(e, t) {
  if (J) {
    var n = (
      /** @type {Effect & { nodes: EffectNodes }} */
      O
    );
    ((n.f & ht) === 0 || n.nodes.end === null) && (n.nodes.end = M), Gr();
    return;
  }
  e !== null && e.before(
    /** @type {Node} */
    t
  );
}
function l0() {
  if (J && M && M.nodeType === dn && M.textContent?.startsWith("$")) {
    const e = M.textContent.substring(1);
    return Gr(), e;
  }
  return (window.__svelte ??= {}).uid ??= 1, `c${window.__svelte.uid++}`;
}
function c0(e, t) {
  var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
  n !== /** @type {any} */
  (e[Cr] ??= e.nodeValue) && (e[Cr] = n, e.nodeValue = `${n}`);
}
function ri(e, t) {
  return bs(e, t);
}
function $c(e, t) {
  Or(), t.intro = t.intro ?? !1;
  const n = t.target, r = J, i = M;
  try {
    for (var o = /* @__PURE__ */ jt(n); o && (o.nodeType !== dn || /** @type {Comment} */
    o.data !== Oo); )
      o = /* @__PURE__ */ Ye(o);
    if (!o)
      throw Ht;
    bn(!0), $e(
      /** @type {Comment} */
      o
    );
    const s = bs(e, { ...t, anchor: o });
    return bn(!1), /**  @type {Exports} */
    s;
  } catch (s) {
    if (s instanceof Error && s.message.split(`
`).some((l) => l.startsWith("https://svelte.dev/e/")))
      throw s;
    return s !== Ht && console.warn("Failed to hydrate: ", s), t.recover === !1 && Cl(), Or(), ac(n), bn(!1), ri(e, t);
  } finally {
    bn(r), $e(i);
  }
}
const _n = /* @__PURE__ */ new Map();
function bs(e, { target: t, anchor: n, props: r = {}, events: i, context: o, intro: s = !0, transformError: l }) {
  Or();
  var a = void 0, u = fc(() => {
    var f = n ?? t.appendChild(Ge());
    Jl(
      /** @type {TemplateNode} */
      f,
      {
        pending: () => {
        }
      },
      (p) => {
        Vl({});
        var c = (
          /** @type {ComponentContext} */
          ce
        );
        if (o && (c.c = o), i && (r.$$events = i), J && st(
          /** @type {TemplateNode} */
          p,
          null
        ), a = e(p, r) || {}, J && (O.nodes.end = M, M === null || M.nodeType !== dn || /** @type {Comment} */
        M.data !== Po))
          throw Qn(), Ht;
        ql();
      },
      l
    );
    var h = /* @__PURE__ */ new Set(), w = (p) => {
      for (var c = 0; c < p.length; c++) {
        var d = p[c];
        if (!h.has(d)) {
          h.add(d);
          var y = xc(d);
          for (const b of [t, document]) {
            var g = _n.get(b);
            g === void 0 && (g = /* @__PURE__ */ new Map(), _n.set(b, g));
            var v = g.get(d);
            v === void 0 ? (b.addEventListener(d, Nr, { passive: y }), g.set(d, 1)) : g.set(d, v + 1);
          }
        }
      }
    };
    return w(hl(ws)), Pr.add(w), () => {
      for (var p of h)
        for (const y of [t, document]) {
          var c = (
            /** @type {Map<string, number>} */
            _n.get(y)
          ), d = (
            /** @type {number} */
            c.get(p)
          );
          --d == 0 ? (y.removeEventListener(p, Nr), c.delete(p), c.size === 0 && _n.delete(y)) : c.set(p, d);
        }
      Pr.delete(w), f !== n && f.parentNode?.removeChild(f);
    };
  });
  return Ur.set(a, u), a;
}
let Ur = /* @__PURE__ */ new WeakMap();
function ms(e, t) {
  const n = Ur.get(e);
  return n ? (Ur.delete(e), n(t)) : Promise.resolve();
}
function Cc(e) {
  return new Tc(e);
}
class Tc {
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
      var l = /* @__PURE__ */ oc(s, !1, !1);
      return n.set(o, l), l;
    };
    const i = new Proxy(
      { ...t.props || {}, $$events: {} },
      {
        get(o, s) {
          return qe(n.get(s) ?? r(s, Reflect.get(o, s)));
        },
        has(o, s) {
          return s === ml ? !0 : (qe(n.get(s) ?? r(s, Reflect.get(o, s))), Reflect.has(o, s));
        },
        set(o, s, l) {
          return et(n.get(s) ?? r(s, l), l), Reflect.set(o, s, l);
        }
      }
    );
    this.#t = (t.hydrate ? $c : ri)(t.component, {
      target: t.target,
      anchor: t.anchor,
      props: i,
      context: t.context,
      intro: t.intro ?? !1,
      recover: t.recover,
      transformError: t.transformError
    }), (!t?.props?.$$host || t.sync === !1) && Vo(), this.#e = i.$$events;
    for (const o of Object.keys(this.#t))
      o === "$set" || o === "$destroy" || o === "$on" || Un(this, o, {
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
      ms(this.#t);
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
let _s;
typeof HTMLElement == "function" && (_s = class extends HTMLElement {
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
          const o = ts("slot");
          r !== "default" && (o.name = r), Sc(i, o);
        };
      };
      if (await Promise.resolve(), !this.$$cn || this.$$c)
        return;
      const t = {}, n = Lc(this);
      for (const r of this.$$s)
        r in n && (r === "default" && !this.$$d.children ? (this.$$d.children = e(r), t.default = !0) : t[r] = e(r));
      for (const r of this.attributes) {
        const i = this.$$g_p(r.name);
        i in this.$$d || (this.$$d[i] = Cn(i, r.value, this.$$p_d, "toProp"));
      }
      for (const r in this.$$p_d)
        !(r in this.$$d) && this[r] !== void 0 && (this.$$d[r] = this[r], delete this[r]);
      this.$$c = Cc({
        component: this.$$ctor,
        target: this.$$shadowRoot || this,
        props: {
          ...this.$$d,
          $$slots: t,
          $$host: this
        }
      }), this.$$me = uc(() => {
        os(() => {
          this.$$r = !0;
          for (const r of Nn(this.$$c)) {
            if (!this.$$p_d[r]?.reflect) continue;
            this.$$d[r] = this.$$c[r];
            const i = Cn(
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
    this.$$r || (e = this.$$g_p(e), this.$$d[e] = Cn(e, n, this.$$p_d, "toProp"), this.$$c?.$set({ [e]: this.$$d[e] }));
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
    return Nn(this.$$p_d).find(
      (t) => this.$$p_d[t].attribute === e || !this.$$p_d[t].attribute && t.toLowerCase() === e
    ) || e;
  }
});
function Cn(e, t, n, r) {
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
function Lc(e) {
  const t = {};
  return e.childNodes.forEach((n) => {
    t[
      /** @type {Element} node */
      n.slot || "default"
    ] = !0;
  }), t;
}
function u0(e, t, n, r, i, o) {
  let s = class extends _s {
    constructor() {
      super(e, n, i), this.$$p_d = t;
    }
    static get observedAttributes() {
      return Nn(t).map(
        (l) => (t[l].attribute || l).toLowerCase()
      );
    }
  };
  return Nn(t).forEach((l) => {
    Un(s.prototype, l, {
      get() {
        return this.$$c && l in this.$$c ? this.$$c[l] : this.$$d[l];
      },
      set(a) {
        a = Cn(l, a, t), this.$$d[l] = a;
        var u = this.$$c;
        if (u) {
          var f = Ot(u, l)?.get;
          f ? u[l] = a : u.$set({ [l]: a });
        }
      }
    });
  }), r.forEach((l) => {
    Un(s.prototype, l, {
      get() {
        return this.$$c?.[l];
      }
    });
  }), e.element = /** @type {any} */
  s, s;
}
let Es;
const Oc = "ehagaki.web-component.v1:", $t = /* @__PURE__ */ new Map(), Bc = {
  get length() {
    return $t.size;
  },
  clear() {
    $t.clear();
  },
  getItem(e) {
    return $t.get(e) ?? null;
  },
  key(e) {
    return [...$t.keys()][e] ?? null;
  },
  removeItem(e) {
    $t.delete(e);
  },
  setItem(e, t) {
    $t.set(e, String(t));
  }
};
function Pc() {
  if (typeof globalThis < "u") {
    const e = globalThis.localStorage;
    if (e)
      return e;
  }
  return Bc;
}
function Nc() {
  return Es ?? Pc();
}
function Uc(e) {
  Es = e;
}
function gr(e, t) {
  const n = [];
  for (let r = 0; r < e.length; r += 1) {
    const i = e.key(r);
    i?.startsWith(t) && n.push(i.slice(t.length));
  }
  return n;
}
function Mc(e, t) {
  return {
    get length() {
      return gr(e, t).length;
    },
    clear() {
      const n = gr(e, t);
      for (const r of n)
        e.removeItem(`${t}${r}`);
    },
    getItem(n) {
      return e.getItem(`${t}${n}`);
    },
    key(n) {
      return gr(e, t)[n] ?? null;
    },
    removeItem(n) {
      e.removeItem(`${t}${n}`);
    },
    setItem(n, r) {
      e.setItem(`${t}${n}`, String(r));
    }
  };
}
function zc(e) {
  return Mc(
    e,
    Oc
  );
}
function Hc() {
  return {
    style: {
      setProperty: () => {
      },
      removeProperty: () => "",
      getPropertyValue: () => ""
    }
  };
}
function Dc() {
  const e = typeof window < "u" ? window : void 0, t = e?.document, n = t?.documentElement ?? Hc(), r = t?.body ?? n;
  return {
    storage: Nc(),
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
let Qt = Dc();
function jc(e) {
  return Qt = {
    ...Qt,
    ...e
  }, Uc(Qt.storage), Qt;
}
function f0() {
  return Qt;
}
function ii(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function ut(e, t = "") {
  if (!Number.isSafeInteger(e) || e < 0) {
    const n = t && `"${t}" `;
    throw new Error(`${n}expected integer >= 0, got ${e}`);
  }
}
function H(e, t, n = "") {
  const r = ii(e), i = e?.length, o = t !== void 0;
  if (!r || o && i !== t) {
    const s = n && `"${n}" `, l = o ? ` of length ${t}` : "", a = r ? `length=${i}` : `type=${typeof e}`;
    throw new Error(s + "expected Uint8Array" + l + ", got " + a);
  }
  return e;
}
function rr(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash must wrapped by utils.createHasher");
  ut(e.outputLen), ut(e.blockLen);
}
function Vn(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function Vc(e, t) {
  H(e, void 0, "digestInto() output");
  const n = t.outputLen;
  if (e.length < n)
    throw new Error('"digestInto() output" expected to be of length >=' + n);
}
function ln(...e) {
  for (let t = 0; t < e.length; t++)
    e[t].fill(0);
}
function yr(e) {
  return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function Te(e, t) {
  return e << 32 - t | e >>> t;
}
const xs = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", qc = /* @__PURE__ */ Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function V(e) {
  if (H(e), xs)
    return e.toHex();
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += qc[e[n]];
  return t;
}
const He = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function eo(e) {
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
  if (xs)
    return Uint8Array.fromHex(e);
  const t = e.length, n = t / 2;
  if (t % 2)
    throw new Error("hex string expected, got unpadded hex of length " + t);
  const r = new Uint8Array(n);
  for (let i = 0, o = 0; i < n; i++, o += 2) {
    const s = eo(e.charCodeAt(o)), l = eo(e.charCodeAt(o + 1));
    if (s === void 0 || l === void 0) {
      const a = e[o] + e[o + 1];
      throw new Error('hex string expected, got non-hex character "' + a + '" at index ' + o);
    }
    r[i] = s * 16 + l;
  }
  return r;
}
function he(...e) {
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
function Fc(e, t = {}) {
  const n = (i, o) => e(o).update(i).digest(), r = e(void 0);
  return n.outputLen = r.outputLen, n.blockLen = r.blockLen, n.create = (i) => e(i), Object.assign(n, t), Object.freeze(n);
}
function Zt(e = 32) {
  const t = typeof globalThis == "object" ? globalThis.crypto : null;
  if (typeof t?.getRandomValues != "function")
    throw new Error("crypto.getRandomValues must be defined");
  return t.getRandomValues(new Uint8Array(e));
}
const Kc = (e) => ({
  oid: Uint8Array.from([6, 9, 96, 134, 72, 1, 101, 3, 4, 2, e])
});
function Zc(e, t, n) {
  return e & t ^ ~e & n;
}
function Wc(e, t, n) {
  return e & t ^ e & n ^ t & n;
}
class Gc {
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
    this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = i, this.buffer = new Uint8Array(t), this.view = yr(this.buffer);
  }
  update(t) {
    Vn(this), H(t);
    const { view: n, buffer: r, blockLen: i } = this, o = t.length;
    for (let s = 0; s < o; ) {
      const l = Math.min(i - this.pos, o - s);
      if (l === i) {
        const a = yr(t);
        for (; i <= o - s; s += i)
          this.process(a, s);
        continue;
      }
      r.set(t.subarray(s, s + l), this.pos), this.pos += l, s += l, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Vn(this), Vc(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: o } = this;
    let { pos: s } = this;
    n[s++] = 128, ln(this.buffer.subarray(s)), this.padOffset > i - s && (this.process(r, 0), s = 0);
    for (let h = s; h < i; h++)
      n[h] = 0;
    r.setBigUint64(i - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const l = yr(t), a = this.outputLen;
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
const Je = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Yc = /* @__PURE__ */ Uint32Array.from([
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
]), Qe = /* @__PURE__ */ new Uint32Array(64);
class Xc extends Gc {
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
      Qe[h] = t.getUint32(n, !1);
    for (let h = 16; h < 64; h++) {
      const w = Qe[h - 15], p = Qe[h - 2], c = Te(w, 7) ^ Te(w, 18) ^ w >>> 3, d = Te(p, 17) ^ Te(p, 19) ^ p >>> 10;
      Qe[h] = d + Qe[h - 7] + c + Qe[h - 16] | 0;
    }
    let { A: r, B: i, C: o, D: s, E: l, F: a, G: u, H: f } = this;
    for (let h = 0; h < 64; h++) {
      const w = Te(l, 6) ^ Te(l, 11) ^ Te(l, 25), p = f + w + Zc(l, a, u) + Yc[h] + Qe[h] | 0, d = (Te(r, 2) ^ Te(r, 13) ^ Te(r, 22)) + Wc(r, i, o) | 0;
      f = u, u = a, a = l, l = s + p | 0, s = o, o = i, i = r, r = p + d | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, o = o + this.C | 0, s = s + this.D | 0, l = l + this.E | 0, a = a + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, i, o, s, l, a, u, f);
  }
  roundClean() {
    ln(Qe);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), ln(this.buffer);
  }
}
class Jc extends Xc {
  // We cannot use array here since array allows indexing by variable
  // which means optimizer/compiler cannot use registers.
  A = Je[0] | 0;
  B = Je[1] | 0;
  C = Je[2] | 0;
  D = Je[3] | 0;
  E = Je[4] | 0;
  F = Je[5] | 0;
  G = Je[6] | 0;
  H = Je[7] | 0;
  constructor() {
    super(32);
  }
}
const Me = /* @__PURE__ */ Fc(
  () => new Jc(),
  /* @__PURE__ */ Kc(1)
);
const oi = /* @__PURE__ */ BigInt(0), Mr = /* @__PURE__ */ BigInt(1);
function qn(e, t = "") {
  if (typeof e != "boolean") {
    const n = t && `"${t}" `;
    throw new Error(n + "expected boolean, got type=" + typeof e);
  }
  return e;
}
function ks(e) {
  if (typeof e == "bigint") {
    if (!Tn(e))
      throw new Error("positive bigint expected, got " + e);
  } else
    ut(e);
  return e;
}
function En(e) {
  const t = ks(e).toString(16);
  return t.length & 1 ? "0" + t : t;
}
function As(e) {
  if (typeof e != "string")
    throw new Error("hex string expected, got " + typeof e);
  return e === "" ? oi : BigInt("0x" + e);
}
function gn(e) {
  return As(V(e));
}
function Is(e) {
  return As(V(Qc(H(e)).reverse()));
}
function si(e, t) {
  ut(t), e = ks(e);
  const n = G(e.toString(16).padStart(t * 2, "0"));
  if (n.length !== t)
    throw new Error("number too large");
  return n;
}
function Rs(e, t) {
  return si(e, t).reverse();
}
function Qc(e) {
  return Uint8Array.from(e);
}
function eu(e) {
  return Uint8Array.from(e, (t, n) => {
    const r = t.charCodeAt(0);
    if (t.length !== 1 || r > 127)
      throw new Error(`string contains non-ASCII character "${e[n]}" with code ${r} at position ${n}`);
    return r;
  });
}
const Tn = (e) => typeof e == "bigint" && oi <= e;
function tu(e, t, n) {
  return Tn(e) && Tn(t) && Tn(n) && t <= e && e < n;
}
function nu(e, t, n, r) {
  if (!tu(t, n, r))
    throw new Error("expected valid " + e + ": " + n + " <= n < " + r + ", got " + t);
}
function ru(e) {
  let t;
  for (t = 0; e > oi; e >>= Mr, t += 1)
    ;
  return t;
}
const ai = (e) => (Mr << BigInt(e)) - Mr;
function iu(e, t, n) {
  if (ut(e, "hashLen"), ut(t, "qByteLen"), typeof n != "function")
    throw new Error("hmacFn must be a function");
  const r = (y) => new Uint8Array(y), i = Uint8Array.of(), o = Uint8Array.of(0), s = Uint8Array.of(1), l = 1e3;
  let a = r(e), u = r(e), f = 0;
  const h = () => {
    a.fill(1), u.fill(0), f = 0;
  }, w = (...y) => n(u, he(a, ...y)), p = (y = i) => {
    u = w(o, y), a = w(), y.length !== 0 && (u = w(s, y), a = w());
  }, c = () => {
    if (f++ >= l)
      throw new Error("drbg: tried max amount of iterations");
    let y = 0;
    const g = [];
    for (; y < t; ) {
      a = w();
      const v = a.slice();
      g.push(v), y += a.length;
    }
    return he(...g);
  };
  return (y, g) => {
    h(), p(y);
    let v;
    for (; !(v = g(c())); )
      p();
    return h(), v;
  };
}
function li(e, t = {}, n = {}) {
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
function to(e) {
  const t = /* @__PURE__ */ new WeakMap();
  return (n, ...r) => {
    const i = t.get(n);
    if (i !== void 0)
      return i;
    const o = e(n, ...r);
    return t.set(n, o), o;
  };
}
const pe = /* @__PURE__ */ BigInt(0), ue = /* @__PURE__ */ BigInt(1), vt = /* @__PURE__ */ BigInt(2), Ss = /* @__PURE__ */ BigInt(3), $s = /* @__PURE__ */ BigInt(4), Cs = /* @__PURE__ */ BigInt(5), ou = /* @__PURE__ */ BigInt(7), Ts = /* @__PURE__ */ BigInt(8), su = /* @__PURE__ */ BigInt(9), Ls = /* @__PURE__ */ BigInt(16);
function ke(e, t) {
  const n = e % t;
  return n >= pe ? n : t + n;
}
function ye(e, t, n) {
  let r = e;
  for (; t-- > pe; )
    r *= r, r %= n;
  return r;
}
function no(e, t) {
  if (e === pe)
    throw new Error("invert: expected non-zero number");
  if (t <= pe)
    throw new Error("invert: expected positive modulus, got " + t);
  let n = ke(e, t), r = t, i = pe, o = ue;
  for (; n !== pe; ) {
    const l = r / n, a = r % n, u = i - o * l;
    r = n, n = a, i = o, o = u;
  }
  if (r !== ue)
    throw new Error("invert: does not exist");
  return ke(i, t);
}
function ci(e, t, n) {
  if (!e.eql(e.sqr(t), n))
    throw new Error("Cannot find square root");
}
function Os(e, t) {
  const n = (e.ORDER + ue) / $s, r = e.pow(t, n);
  return ci(e, r, t), r;
}
function au(e, t) {
  const n = (e.ORDER - Cs) / Ts, r = e.mul(t, vt), i = e.pow(r, n), o = e.mul(t, i), s = e.mul(e.mul(o, vt), i), l = e.mul(o, e.sub(s, e.ONE));
  return ci(e, l, t), l;
}
function lu(e) {
  const t = ir(e), n = Bs(e), r = n(t, t.neg(t.ONE)), i = n(t, r), o = n(t, t.neg(r)), s = (e + ou) / Ls;
  return (l, a) => {
    let u = l.pow(a, s), f = l.mul(u, r);
    const h = l.mul(u, i), w = l.mul(u, o), p = l.eql(l.sqr(f), a), c = l.eql(l.sqr(h), a);
    u = l.cmov(u, f, p), f = l.cmov(w, h, c);
    const d = l.eql(l.sqr(f), a), y = l.cmov(u, f, d);
    return ci(l, y, a), y;
  };
}
function Bs(e) {
  if (e < Ss)
    throw new Error("sqrt is not defined for small field");
  let t = e - ue, n = 0;
  for (; t % vt === pe; )
    t /= vt, n++;
  let r = vt;
  const i = ir(e);
  for (; ro(i, r) === 1; )
    if (r++ > 1e3)
      throw new Error("Cannot find square root: probably non-prime P");
  if (n === 1)
    return Os;
  let o = i.pow(r, t);
  const s = (t + ue) / vt;
  return function(a, u) {
    if (a.is0(u))
      return u;
    if (ro(a, u) !== 1)
      throw new Error("Cannot find square root");
    let f = n, h = a.mul(a.ONE, o), w = a.pow(u, t), p = a.pow(u, s);
    for (; !a.eql(w, a.ONE); ) {
      if (a.is0(w))
        return a.ZERO;
      let c = 1, d = a.sqr(w);
      for (; !a.eql(d, a.ONE); )
        if (c++, d = a.sqr(d), c === f)
          throw new Error("Cannot find square root");
      const y = ue << BigInt(f - c - 1), g = a.pow(h, y);
      f = c, h = a.sqr(g), w = a.mul(w, h), p = a.mul(p, g);
    }
    return p;
  };
}
function cu(e) {
  return e % $s === Ss ? Os : e % Ts === Cs ? au : e % Ls === su ? lu(e) : Bs(e);
}
const uu = [
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
function fu(e) {
  const t = {
    ORDER: "bigint",
    BYTES: "number",
    BITS: "number"
  }, n = uu.reduce((r, i) => (r[i] = "function", r), t);
  return li(e, n), e;
}
function du(e, t, n) {
  if (n < pe)
    throw new Error("invalid exponent, negatives unsupported");
  if (n === pe)
    return e.ONE;
  if (n === ue)
    return t;
  let r = e.ONE, i = t;
  for (; n > pe; )
    n & ue && (r = e.mul(r, i)), i = e.sqr(i), n >>= ue;
  return r;
}
function Ps(e, t, n = !1) {
  const r = new Array(t.length).fill(n ? e.ZERO : void 0), i = t.reduce((s, l, a) => e.is0(l) ? s : (r[a] = s, e.mul(s, l)), e.ONE), o = e.inv(i);
  return t.reduceRight((s, l, a) => e.is0(l) ? s : (r[a] = e.mul(s, r[a]), e.mul(s, l)), o), r;
}
function ro(e, t) {
  const n = (e.ORDER - ue) / vt, r = e.pow(t, n), i = e.eql(r, e.ONE), o = e.eql(r, e.ZERO), s = e.eql(r, e.neg(e.ONE));
  if (!i && !o && !s)
    throw new Error("invalid Legendre symbol result");
  return i ? 1 : o ? 0 : -1;
}
function hu(e, t) {
  t !== void 0 && ut(t);
  const n = t !== void 0 ? t : e.toString(2).length, r = Math.ceil(n / 8);
  return { nBitLength: n, nByteLength: r };
}
class pu {
  ORDER;
  BITS;
  BYTES;
  isLE;
  ZERO = pe;
  ONE = ue;
  _lengths;
  _sqrt;
  // cached sqrt
  _mod;
  constructor(t, n = {}) {
    if (t <= pe)
      throw new Error("invalid field: expected ORDER > 0, got " + t);
    let r;
    this.isLE = !1, n != null && typeof n == "object" && (typeof n.BITS == "number" && (r = n.BITS), typeof n.sqrt == "function" && (this.sqrt = n.sqrt), typeof n.isLE == "boolean" && (this.isLE = n.isLE), n.allowedLengths && (this._lengths = n.allowedLengths?.slice()), typeof n.modFromBytes == "boolean" && (this._mod = n.modFromBytes));
    const { nBitLength: i, nByteLength: o } = hu(t, r);
    if (o > 2048)
      throw new Error("invalid field: expected ORDER of <= 2048 bytes");
    this.ORDER = t, this.BITS = i, this.BYTES = o, this._sqrt = void 0, Object.preventExtensions(this);
  }
  create(t) {
    return ke(t, this.ORDER);
  }
  isValid(t) {
    if (typeof t != "bigint")
      throw new Error("invalid field element: expected bigint, got " + typeof t);
    return pe <= t && t < this.ORDER;
  }
  is0(t) {
    return t === pe;
  }
  // is valid and invertible
  isValidNot0(t) {
    return !this.is0(t) && this.isValid(t);
  }
  isOdd(t) {
    return (t & ue) === ue;
  }
  neg(t) {
    return ke(-t, this.ORDER);
  }
  eql(t, n) {
    return t === n;
  }
  sqr(t) {
    return ke(t * t, this.ORDER);
  }
  add(t, n) {
    return ke(t + n, this.ORDER);
  }
  sub(t, n) {
    return ke(t - n, this.ORDER);
  }
  mul(t, n) {
    return ke(t * n, this.ORDER);
  }
  pow(t, n) {
    return du(this, t, n);
  }
  div(t, n) {
    return ke(t * no(n, this.ORDER), this.ORDER);
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
    return no(t, this.ORDER);
  }
  sqrt(t) {
    return this._sqrt || (this._sqrt = cu(this.ORDER)), this._sqrt(this, t);
  }
  toBytes(t) {
    return this.isLE ? Rs(t, this.BYTES) : si(t, this.BYTES);
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
    let a = o ? Is(t) : gn(t);
    if (l && (a = ke(a, s)), !n && !this.isValid(a))
      throw new Error("invalid field element: outside of range 0..ORDER");
    return a;
  }
  // TODO: we don't need it here, move out to separate fn
  invertBatch(t) {
    return Ps(this, t);
  }
  // We can't move this out because Fp6, Fp12 implement it
  // and it's unclear what to return in there.
  cmov(t, n, r) {
    return r ? n : t;
  }
}
function ir(e, t = {}) {
  return new pu(e, t);
}
function Ns(e) {
  if (typeof e != "bigint")
    throw new Error("field order must be bigint");
  const t = e.toString(2).length;
  return Math.ceil(t / 8);
}
function Us(e) {
  const t = Ns(e);
  return t + Math.ceil(t / 2);
}
function Ms(e, t, n = !1) {
  H(e);
  const r = e.length, i = Ns(t), o = Us(t);
  if (r < 16 || r < o || r > 1024)
    throw new Error("expected " + o + "-1024 bytes of input, got " + r);
  const s = n ? Is(e) : gn(e), l = ke(s, t - ue) + ue;
  return n ? Rs(l, i) : si(l, i);
}
const qt = /* @__PURE__ */ BigInt(0), bt = /* @__PURE__ */ BigInt(1);
function Fn(e, t) {
  const n = t.negate();
  return e ? n : t;
}
function io(e, t) {
  const n = Ps(e.Fp, t.map((r) => r.Z));
  return t.map((r, i) => e.fromAffine(r.toAffine(n[i])));
}
function zs(e, t) {
  if (!Number.isSafeInteger(e) || e <= 0 || e > t)
    throw new Error("invalid window size, expected [1.." + t + "], got W=" + e);
}
function wr(e, t) {
  zs(e, t);
  const n = Math.ceil(t / e) + 1, r = 2 ** (e - 1), i = 2 ** e, o = ai(e), s = BigInt(e);
  return { windows: n, windowSize: r, mask: o, maxNumber: i, shiftBy: s };
}
function oo(e, t, n) {
  const { windowSize: r, mask: i, maxNumber: o, shiftBy: s } = n;
  let l = Number(e & i), a = e >> s;
  l > r && (l -= o, a += bt);
  const u = t * r, f = u + Math.abs(l) - 1, h = l === 0, w = l < 0, p = t % 2 !== 0;
  return { nextN: a, offset: f, isZero: h, isNeg: w, isNegF: p, offsetF: u };
}
const vr = /* @__PURE__ */ new WeakMap(), Hs = /* @__PURE__ */ new WeakMap();
function br(e) {
  return Hs.get(e) || 1;
}
function so(e) {
  if (e !== qt)
    throw new Error("invalid wNAF");
}
class gu {
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
    for (; n > qt; )
      n & bt && (r = r.add(i)), i = i.double(), n >>= bt;
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
    const { windows: r, windowSize: i } = wr(n, this.bits), o = [];
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
    const s = wr(t, this.bits);
    for (let l = 0; l < s.windows; l++) {
      const { nextN: a, offset: u, isZero: f, isNeg: h, isNegF: w, offsetF: p } = oo(r, l, s);
      r = a, f ? o = o.add(Fn(w, n[p])) : i = i.add(Fn(h, n[u]));
    }
    return so(r), { p: i, f: o };
  }
  /**
   * Implements ec unsafe (non const-time) multiplication using precomputed tables and w-ary non-adjacent form.
   * @param acc accumulator point to add result of multiplication
   * @returns point
   */
  wNAFUnsafe(t, n, r, i = this.ZERO) {
    const o = wr(t, this.bits);
    for (let s = 0; s < o.windows && r !== qt; s++) {
      const { nextN: l, offset: a, isZero: u, isNeg: f } = oo(r, s, o);
      if (r = l, !u) {
        const h = n[a];
        i = i.add(f ? h.negate() : h);
      }
    }
    return so(r), i;
  }
  getPrecomputes(t, n, r) {
    let i = vr.get(n);
    return i || (i = this.precomputeWindow(n, t), t !== 1 && (typeof r == "function" && (i = r(i)), vr.set(n, i))), i;
  }
  cached(t, n, r) {
    const i = br(t);
    return this.wNAF(i, this.getPrecomputes(i, t, r), n);
  }
  unsafe(t, n, r, i) {
    const o = br(t);
    return o === 1 ? this._unsafeLadder(t, n, i) : this.wNAFUnsafe(o, this.getPrecomputes(o, t, r), n, i);
  }
  // We calculate precomputes for elliptic curve point multiplication
  // using windowed method. This specifies window size and
  // stores precomputed values. Usually only base point would be precomputed.
  createCache(t, n) {
    zs(n, this.bits), Hs.set(t, n), vr.delete(t);
  }
  hasCache(t) {
    return br(t) !== 1;
  }
}
function yu(e, t, n, r) {
  let i = t, o = e.ZERO, s = e.ZERO;
  for (; n > qt || r > qt; )
    n & bt && (o = o.add(i)), r & bt && (s = s.add(i)), i = i.double(), n >>= bt, r >>= bt;
  return { p1: o, p2: s };
}
function ao(e, t, n) {
  if (t) {
    if (t.ORDER !== e)
      throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
    return fu(t), t;
  } else
    return ir(e, { isLE: n });
}
function wu(e, t, n = {}, r) {
  if (r === void 0 && (r = e === "edwards"), !t || typeof t != "object")
    throw new Error(`expected valid ${e} CURVE object`);
  for (const a of ["p", "n", "h"]) {
    const u = t[a];
    if (!(typeof u == "bigint" && u > qt))
      throw new Error(`CURVE.${a} must be positive bigint`);
  }
  const i = ao(t.p, n.Fp, r), o = ao(t.n, n.Fn, r), l = ["Gx", "Gy", "a", "b"];
  for (const a of l)
    if (!i.isValid(t[a]))
      throw new Error(`CURVE.${a} must be valid field element of CURVE.Fp`);
  return t = Object.freeze(Object.assign({}, t)), { CURVE: t, Fp: i, Fn: o };
}
function Ds(e, t) {
  return function(r) {
    const i = e(r);
    return { secretKey: i, publicKey: t(i) };
  };
}
class js {
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
    this.oHash.update(i), ln(i);
  }
  update(t) {
    return Vn(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    Vn(this), H(t, this.outputLen, "output"), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
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
const yn = (e, t, n) => new js(e, t).update(n).digest();
yn.create = (e, t) => new js(e, t);
const lo = (e, t) => (e + (e >= 0 ? t : -t) / Vs) / t;
function vu(e, t, n) {
  const [[r, i], [o, s]] = t, l = lo(s * e, n), a = lo(-i * e, n);
  let u = e - l * r - a * o, f = -l * i - a * s;
  const h = u < Fe, w = f < Fe;
  h && (u = -u), w && (f = -f);
  const p = ai(Math.ceil(ru(n) / 2)) + Pt;
  if (u < Fe || u >= p || f < Fe || f >= p)
    throw new Error("splitScalar (endomorphism): failed, k=" + e);
  return { k1neg: h, k1: u, k2neg: w, k2: f };
}
function zr(e) {
  if (!["compact", "recovered", "der"].includes(e))
    throw new Error('Signature format must be "compact", "recovered", or "der"');
  return e;
}
function mr(e, t) {
  const n = {};
  for (let r of Object.keys(t))
    n[r] = e[r] === void 0 ? t[r] : e[r];
  return qn(n.lowS, "lowS"), qn(n.prehash, "prehash"), n.format !== void 0 && zr(n.format), n;
}
class bu extends Error {
  constructor(t = "") {
    super(t);
  }
}
const tt = {
  // asn.1 DER encoding utils
  Err: bu,
  // Basic building block is TLV (Tag-Length-Value)
  _tlv: {
    encode: (e, t) => {
      const { Err: n } = tt;
      if (e < 0 || e > 256)
        throw new n("tlv.encode: wrong tag");
      if (t.length & 1)
        throw new n("tlv.encode: unpadded data");
      const r = t.length / 2, i = En(r);
      if (i.length / 2 & 128)
        throw new n("tlv.encode: long form length too big");
      const o = r > 127 ? En(i.length / 2 | 128) : "";
      return En(e) + o + i + t;
    },
    // v - value, l - left bytes (unparsed)
    decode(e, t) {
      const { Err: n } = tt;
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
      const { Err: t } = tt;
      if (e < Fe)
        throw new t("integer: negative integers are not allowed");
      let n = En(e);
      if (Number.parseInt(n[0], 16) & 8 && (n = "00" + n), n.length & 1)
        throw new t("unexpected DER parsing assertion: unpadded hex");
      return n;
    },
    decode(e) {
      const { Err: t } = tt;
      if (e[0] & 128)
        throw new t("invalid signature integer: negative");
      if (e[0] === 0 && !(e[1] & 128))
        throw new t("invalid signature integer: unnecessary leading zero");
      return gn(e);
    }
  },
  toSig(e) {
    const { Err: t, _int: n, _tlv: r } = tt, i = H(e, void 0, "signature"), { v: o, l: s } = r.decode(48, i);
    if (s.length)
      throw new t("invalid signature: left bytes after parsing");
    const { v: l, l: a } = r.decode(2, o), { v: u, l: f } = r.decode(2, a);
    if (f.length)
      throw new t("invalid signature: left bytes after parsing");
    return { r: n.decode(l), s: n.decode(u) };
  },
  hexFromSig(e) {
    const { _tlv: t, _int: n } = tt, r = t.encode(2, n.encode(e.r)), i = t.encode(2, n.encode(e.s)), o = r + i;
    return t.encode(48, o);
  }
}, Fe = BigInt(0), Pt = BigInt(1), Vs = BigInt(2), xn = BigInt(3), mu = BigInt(4);
function _u(e, t = {}) {
  const n = wu("weierstrass", e, t), { Fp: r, Fn: i } = n;
  let o = n.CURVE;
  const { h: s, n: l } = o;
  li(t, {}, {
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
  const u = Fs(r, i);
  function f() {
    if (!r.isOdd)
      throw new Error("compression is not supported: Field does not have .isOdd()");
  }
  function h(L, E, _) {
    const { x: m, y: x } = E.toAffine(), A = r.toBytes(m);
    if (qn(_, "isCompressed"), _) {
      f();
      const R = !r.isOdd(x);
      return he(qs(R), A);
    } else
      return he(Uint8Array.of(4), A, r.toBytes(x));
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
      if (!y(I, k))
        throw new Error("bad point: is not on curve");
      return { x: I, y: k };
    } else
      throw new Error(`bad point: got length ${m}, expected compressed=${E} or uncompressed=${_}`);
  }
  const p = t.toBytes || h, c = t.fromBytes || w;
  function d(L) {
    const E = r.sqr(L), _ = r.mul(E, L);
    return r.add(r.add(_, r.mul(L, o.a)), o.b);
  }
  function y(L, E) {
    const _ = r.sqr(E), m = d(L);
    return r.eql(_, m);
  }
  if (!y(o.Gx, o.Gy))
    throw new Error("bad curve params: generator point");
  const g = r.mul(r.pow(o.a, xn), mu), v = r.mul(r.sqr(o.b), BigInt(27));
  if (r.is0(r.add(g, v)))
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
    return vu(L, a.basises, i.ORDER);
  }
  const z = to((L, E) => {
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
  }), q = to((L) => {
    if (L.is0()) {
      if (t.allowInfinityPoint && !r.is0(L.Y))
        return;
      throw new Error("bad point: ZERO");
    }
    const { x: E, y: _ } = L.toAffine();
    if (!r.isValid(E) || !r.isValid(_))
      throw new Error("bad point: x or y not field elements");
    if (!y(E, _))
      throw new Error("bad point: equation left != right");
    if (!L.isTorsionFree())
      throw new Error("bad point: not in prime-order subgroup");
    return !0;
  });
  function Y(L, E, _, m, x) {
    return _ = new T(r.mul(_.X, L), _.Y, _.Z), E = Fn(m, E), _ = Fn(x, _), E.add(_);
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
      return X.createCache(this, E), _ || this.multiply(xn), this;
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
      const { a: E, b: _ } = o, m = r.mul(_, xn), { X: x, Y: A, Z: R } = this;
      let I = r.ZERO, k = r.ZERO, S = r.ZERO, $ = r.mul(x, x), F = r.mul(A, A), j = r.mul(R, R), P = r.mul(x, A);
      return P = r.add(P, P), S = r.mul(x, R), S = r.add(S, S), I = r.mul(E, S), k = r.mul(m, j), k = r.add(I, k), I = r.sub(F, k), k = r.add(F, k), k = r.mul(I, k), I = r.mul(P, I), S = r.mul(m, S), j = r.mul(E, j), P = r.sub($, j), P = r.mul(E, P), P = r.add(P, S), S = r.add($, $), $ = r.add(S, $), $ = r.add($, j), $ = r.mul($, P), k = r.add(k, $), j = r.mul(A, R), j = r.add(j, j), $ = r.mul(j, P), I = r.sub(I, $), S = r.mul(j, F), S = r.add(S, S), S = r.add(S, S), new T(I, k, S);
    }
    // Renes-Costello-Batina exception-free addition formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 1
    // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
    add(E) {
      C(E);
      const { X: _, Y: m, Z: x } = this, { X: A, Y: R, Z: I } = E;
      let k = r.ZERO, S = r.ZERO, $ = r.ZERO;
      const F = o.a, j = r.mul(o.b, xn);
      let P = r.mul(_, A), K = r.mul(m, R), ne = r.mul(x, I), Ce = r.add(_, m), Z = r.add(A, R);
      Ce = r.mul(Ce, Z), Z = r.add(P, K), Ce = r.sub(Ce, Z), Z = r.add(_, x);
      let oe = r.add(A, I);
      return Z = r.mul(Z, oe), oe = r.add(P, ne), Z = r.sub(Z, oe), oe = r.add(m, x), k = r.add(R, I), oe = r.mul(oe, k), k = r.add(K, ne), oe = r.sub(oe, k), $ = r.mul(F, Z), k = r.mul(j, ne), $ = r.add(k, $), k = r.sub(K, $), $ = r.add(K, $), S = r.mul(k, $), K = r.add(P, P), K = r.add(K, P), ne = r.mul(F, ne), Z = r.mul(j, Z), K = r.add(K, ne), ne = r.sub(P, ne), ne = r.mul(F, ne), Z = r.add(Z, ne), P = r.mul(K, Z), S = r.add(S, P), P = r.mul(oe, Z), k = r.mul(Ce, k), k = r.sub(k, P), P = r.mul(Ce, K), $ = r.mul(oe, $), $ = r.add($, P), new T(k, S, $);
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
      const A = (R) => X.cached(this, R, (I) => io(T, I));
      if (_) {
        const { k1neg: R, k1: I, k2neg: k, k2: S } = ae(E), { p: $, f: F } = A(I), { p: j, f: P } = A(S);
        x = F.add(P), m = Y(_.beta, $, j, R, k);
      } else {
        const { p: R, f: I } = A(E);
        m = R, x = I;
      }
      return io(T, [m, x])[0];
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
      if (E === Pt)
        return m;
      if (X.hasCache(this))
        return this.multiply(E);
      if (_) {
        const { k1neg: x, k1: A, k2neg: R, k2: I } = ae(E), { p1: k, p2: S } = yu(T, m, A, I);
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
      return s === Pt ? !0 : E ? E(T, this) : X.unsafe(this, l).is0();
    }
    clearCofactor() {
      const { clearCofactor: E } = t;
      return s === Pt ? this : E ? E(T, this) : this.multiplyUnsafe(s);
    }
    isSmallOrder() {
      return this.multiplyUnsafe(s).is0();
    }
    toBytes(E = !0) {
      return qn(E, "isCompressed"), this.assertValidity(), p(T, this, E);
    }
    toHex(E = !0) {
      return V(this.toBytes(E));
    }
    toString() {
      return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
    }
  }
  const ee = i.BITS, X = new gu(T, t.endo ? Math.ceil(ee / 2) : ee);
  return T.BASE.precompute(8), T;
}
function qs(e) {
  return Uint8Array.of(e ? 2 : 3);
}
function Fs(e, t) {
  return {
    secretKey: t.BYTES,
    publicKey: 1 + e.BYTES,
    publicKeyUncompressed: 1 + 2 * e.BYTES,
    publicKeyHasPrefix: !0,
    signature: 2 * t.BYTES
  };
}
function Eu(e, t = {}) {
  const { Fn: n } = e, r = t.randomBytes || Zt, i = Object.assign(Fs(e.Fp, n), { seed: Us(n.ORDER) });
  function o(p) {
    try {
      const c = n.fromBytes(p);
      return n.isValidNot0(c);
    } catch {
      return !1;
    }
  }
  function s(p, c) {
    const { publicKey: d, publicKeyUncompressed: y } = i;
    try {
      const g = p.length;
      return c === !0 && g !== d || c === !1 && g !== y ? !1 : !!e.fromBytes(p);
    } catch {
      return !1;
    }
  }
  function l(p = r(i.seed)) {
    return Ms(H(p, i.seed, "seed"), n.ORDER);
  }
  function a(p, c = !0) {
    return e.BASE.multiply(n.fromBytes(p)).toBytes(c);
  }
  function u(p) {
    const { secretKey: c, publicKey: d, publicKeyUncompressed: y } = i;
    if (!ii(p) || "_lengths" in n && n._lengths || c === d)
      return;
    const g = H(p, void 0, "key").length;
    return g === d || g === y;
  }
  function f(p, c, d = !0) {
    if (u(p) === !0)
      throw new Error("first arg must be private key");
    if (u(c) === !1)
      throw new Error("second arg must be public key");
    const y = n.fromBytes(p);
    return e.fromBytes(c).multiply(y).toBytes(d);
  }
  const h = {
    isValidSecretKey: o,
    isValidPublicKey: s,
    randomSecretKey: l
  }, w = Ds(l, a);
  return Object.freeze({ getPublicKey: a, getSharedSecret: f, keygen: w, Point: e, utils: h, lengths: i });
}
function xu(e, t, n = {}) {
  rr(t), li(n, {}, {
    hmac: "function",
    lowS: "boolean",
    randomBytes: "function",
    bits2int: "function",
    bits2int_modN: "function"
  }), n = Object.assign({}, n);
  const r = n.randomBytes || Zt, i = n.hmac || ((_, m) => yn(t, _, m)), { Fp: o, Fn: s } = e, { ORDER: l, BITS: a } = s, { keygen: u, getPublicKey: f, getSharedSecret: h, utils: w, lengths: p } = Eu(e, n), c = {
    prehash: !0,
    lowS: typeof n.lowS == "boolean" ? n.lowS : !0,
    format: "compact",
    extraEntropy: !1
  }, d = l * Vs < o.ORDER;
  function y(_) {
    const m = l >> Pt;
    return _ > m;
  }
  function g(_, m) {
    if (!s.isValidNot0(m))
      throw new Error(`invalid signature ${_}: out of range 1..Point.Fn.ORDER`);
    return m;
  }
  function v() {
    if (d)
      throw new Error('"recovered" sig type is not supported for cofactor >2 curves');
  }
  function b(_, m) {
    zr(m);
    const x = p.signature, A = m === "compact" ? x : m === "recovered" ? x + 1 : void 0;
    return H(_, A);
  }
  class C {
    r;
    s;
    recovery;
    constructor(m, x, A) {
      if (this.r = g("r", m), this.s = g("s", x), A != null) {
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
        const { r: S, s: $ } = tt.toSig(H(m));
        return new C(S, $);
      }
      x === "recovered" && (A = m[0], x = "compact", m = m.subarray(1));
      const R = p.signature / 2, I = m.subarray(0, R), k = m.subarray(R, R * 2);
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
      const k = o.toBytes(I), S = e.fromBytes(he(qs((R & 1) === 0), k)), $ = s.inv(I), F = z(H(m, void 0, "msgHash")), j = s.create(-F * $), P = s.create(A * $), K = e.BASE.multiplyUnsafe(j).add(S.multiplyUnsafe(P));
      if (K.is0())
        throw new Error("invalid recovery: point at infinify");
      return K.assertValidity(), K;
    }
    // Signatures should be low-s, to prevent malleability.
    hasHighS() {
      return y(this.s);
    }
    toBytes(m = c.format) {
      if (zr(m), m === "der")
        return G(tt.hexFromSig(this));
      const { r: x, s: A } = this, R = s.toBytes(x), I = s.toBytes(A);
      return m === "recovered" ? (v(), he(Uint8Array.of(this.assertRecovery()), R, I)) : he(R, I);
    }
    toHex(m) {
      return V(this.toBytes(m));
    }
  }
  const ae = n.bits2int || function(m) {
    if (m.length > 8192)
      throw new Error("input is too large");
    const x = gn(m), A = m.length * 8 - a;
    return A > 0 ? x >> BigInt(A) : x;
  }, z = n.bits2int_modN || function(m) {
    return s.create(ae(m));
  }, q = ai(a);
  function Y(_) {
    return nu("num < 2^" + a, _, Fe, q), s.toBytes(_);
  }
  function T(_, m) {
    return H(_, void 0, "message"), m ? H(t(_), void 0, "prehashed message") : _;
  }
  function ee(_, m, x) {
    const { lowS: A, prehash: R, extraEntropy: I } = mr(x, c);
    _ = T(_, R);
    const k = z(_), S = s.fromBytes(m);
    if (!s.isValidNot0(S))
      throw new Error("invalid private key");
    const $ = [Y(S), Y(k)];
    if (I != null && I !== !1) {
      const K = I === !0 ? r(p.secretKey) : I;
      $.push(H(K, void 0, "extraEntropy"));
    }
    const F = he(...$), j = k;
    function P(K) {
      const ne = ae(K);
      if (!s.isValidNot0(ne))
        return;
      const Ce = s.inv(ne), Z = e.BASE.multiply(ne).toAffine(), oe = s.create(Z.x);
      if (oe === Fe)
        return;
      const vn = s.create(Ce * s.create(j + oe * S));
      if (vn === Fe)
        return;
      let Di = (Z.x === oe ? 0 : 2) | Number(Z.y & Pt), ji = vn;
      return A && y(vn) && (ji = s.neg(vn), Di ^= 1), new C(oe, ji, d ? void 0 : Di);
    }
    return { seed: F, k2sig: P };
  }
  function X(_, m, x = {}) {
    const { seed: A, k2sig: R } = ee(_, m, x);
    return iu(t.outputLen, s.BYTES, i)(A, R).toBytes(x.format);
  }
  function L(_, m, x, A = {}) {
    const { lowS: R, prehash: I, format: k } = mr(A, c);
    if (x = H(x, void 0, "publicKey"), m = T(m, I), !ii(_)) {
      const S = _ instanceof C ? ", use sig.toBytes()" : "";
      throw new Error("verify expects Uint8Array signature" + S);
    }
    b(_, k);
    try {
      const S = C.fromBytes(_, k), $ = e.fromBytes(x);
      if (R && S.hasHighS())
        return !1;
      const { r: F, s: j } = S, P = z(m), K = s.inv(j), ne = s.create(P * K), Ce = s.create(F * K), Z = e.BASE.multiplyUnsafe(ne).add($.multiplyUnsafe(Ce));
      return Z.is0() ? !1 : s.create(Z.x) === F;
    } catch {
      return !1;
    }
  }
  function E(_, m, x = {}) {
    const { prehash: A } = mr(x, c);
    return m = T(m, A), C.fromBytes(_, "recovered").recoverPublicKey(m).toBytes();
  }
  return Object.freeze({
    keygen: u,
    getPublicKey: f,
    getSharedSecret: h,
    utils: w,
    lengths: p,
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
}, ku = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  basises: [
    [BigInt("0x3086d221a7d46bcde86c90e49284eb15"), -BigInt("0xe4437ed6010e88286f547fa90abfe4c3")],
    [BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), BigInt("0x3086d221a7d46bcde86c90e49284eb15")]
  ]
}, Au = /* @__PURE__ */ BigInt(0), Hr = /* @__PURE__ */ BigInt(2);
function Iu(e) {
  const t = or.p, n = BigInt(3), r = BigInt(6), i = BigInt(11), o = BigInt(22), s = BigInt(23), l = BigInt(44), a = BigInt(88), u = e * e * e % t, f = u * u * e % t, h = ye(f, n, t) * f % t, w = ye(h, n, t) * f % t, p = ye(w, Hr, t) * u % t, c = ye(p, i, t) * p % t, d = ye(c, o, t) * c % t, y = ye(d, l, t) * d % t, g = ye(y, a, t) * y % t, v = ye(g, l, t) * d % t, b = ye(v, n, t) * f % t, C = ye(b, s, t) * c % t, ae = ye(C, r, t) * u % t, z = ye(ae, Hr, t);
  if (!Kn.eql(Kn.sqr(z), e))
    throw new Error("Cannot find square root");
  return z;
}
const Kn = ir(or.p, { sqrt: Iu }), Rt = /* @__PURE__ */ _u(or, {
  Fp: Kn,
  endo: ku
}), ui = /* @__PURE__ */ xu(Rt, Me), co = {};
function Zn(e, ...t) {
  let n = co[e];
  if (n === void 0) {
    const r = Me(eu(e));
    n = he(r, r), co[e] = n;
  }
  return Me(he(n, ...t));
}
const fi = (e) => e.toBytes(!0).slice(1), di = (e) => e % Hr === Au;
function Dr(e) {
  const { Fn: t, BASE: n } = Rt, r = t.fromBytes(e), i = n.multiply(r);
  return { scalar: di(i.y) ? r : t.neg(r), bytes: fi(i) };
}
function Ks(e) {
  const t = Kn;
  if (!t.isValidNot0(e))
    throw new Error("invalid x: Fail if x ≥ p");
  const n = t.create(e * e), r = t.create(n * e + BigInt(7));
  let i = t.sqrt(r);
  di(i) || (i = t.neg(i));
  const o = Rt.fromAffine({ x: e, y: i });
  return o.assertValidity(), o;
}
const nn = gn;
function Zs(...e) {
  return Rt.Fn.create(nn(Zn("BIP0340/challenge", ...e)));
}
function uo(e) {
  return Dr(e).bytes;
}
function Ru(e, t, n = Zt(32)) {
  const { Fn: r } = Rt, i = H(e, void 0, "message"), { bytes: o, scalar: s } = Dr(t), l = H(n, 32, "auxRand"), a = r.toBytes(s ^ nn(Zn("BIP0340/aux", l))), u = Zn("BIP0340/nonce", a, o, i), { bytes: f, scalar: h } = Dr(u), w = Zs(f, o, i), p = new Uint8Array(64);
  if (p.set(f, 0), p.set(r.toBytes(r.create(h + w * s)), 32), !Ws(p, i, o))
    throw new Error("sign: Invalid signature produced");
  return p;
}
function Ws(e, t, n) {
  const { Fp: r, Fn: i, BASE: o } = Rt, s = H(e, 64, "signature"), l = H(t, void 0, "message"), a = H(n, 32, "publicKey");
  try {
    const u = Ks(nn(a)), f = nn(s.subarray(0, 32));
    if (!r.isValidNot0(f))
      return !1;
    const h = nn(s.subarray(32, 64));
    if (!i.isValidNot0(h))
      return !1;
    const w = Zs(i.toBytes(f), fi(u), l), p = o.multiplyUnsafe(h).add(u.multiplyUnsafe(i.neg(w))), { x: c, y: d } = p.toAffine();
    return !(p.is0() || !di(d) || c !== f);
  } catch {
    return !1;
  }
}
const Wt = /* @__PURE__ */ (() => {
  const n = (r = Zt(48)) => Ms(r, or.n);
  return {
    keygen: Ds(n, uo),
    getPublicKey: uo,
    sign: Ru,
    verify: Ws,
    Point: Rt,
    utils: {
      randomSecretKey: n,
      taggedHash: Zn,
      lift_x: Ks,
      pointToBytes: fi
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
function hi(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function Su(e) {
  if (!hi(e))
    throw new Error("Uint8Array expected");
}
function Gs(e, t) {
  return Array.isArray(t) ? t.length === 0 ? !0 : e ? t.every((n) => typeof n == "string") : t.every((n) => Number.isSafeInteger(n)) : !1;
}
function $u(e) {
  if (typeof e != "function")
    throw new Error("function expected");
  return !0;
}
function At(e, t) {
  if (typeof t != "string")
    throw new Error(`${e}: string expected`);
  return !0;
}
function pi(e) {
  if (!Number.isSafeInteger(e))
    throw new Error(`invalid integer: ${e}`);
}
function jr(e) {
  if (!Array.isArray(e))
    throw new Error("array expected");
}
function Wn(e, t) {
  if (!Gs(!0, t))
    throw new Error(`${e}: array of strings expected`);
}
function Ys(e, t) {
  if (!Gs(!1, t))
    throw new Error(`${e}: array of numbers expected`);
}
// @__NO_SIDE_EFFECTS__
function Xs(...e) {
  const t = (o) => o, n = (o, s) => (l) => o(s(l)), r = e.map((o) => o.encode).reduceRight(n, t), i = e.map((o) => o.decode).reduce(n, t);
  return { encode: r, decode: i };
}
// @__NO_SIDE_EFFECTS__
function Js(e) {
  const t = typeof e == "string" ? e.split("") : e, n = t.length;
  Wn("alphabet", t);
  const r = new Map(t.map((i, o) => [i, o]));
  return {
    encode: (i) => (jr(i), i.map((o) => {
      if (!Number.isSafeInteger(o) || o < 0 || o >= n)
        throw new Error(`alphabet.encode: digit index outside alphabet "${o}". Allowed: ${e}`);
      return t[o];
    })),
    decode: (i) => (jr(i), i.map((o) => {
      At("alphabet.decode", o);
      const s = r.get(o);
      if (s === void 0)
        throw new Error(`Unknown letter: "${o}". Allowed: ${e}`);
      return s;
    }))
  };
}
// @__NO_SIDE_EFFECTS__
function Qs(e = "") {
  return At("join", e), {
    encode: (t) => (Wn("join.decode", t), t.join(e)),
    decode: (t) => (At("join.decode", t), t.split(e))
  };
}
// @__NO_SIDE_EFFECTS__
function Cu(e, t = "=") {
  return pi(e), At("padding", t), {
    encode(n) {
      for (Wn("padding.encode", n); n.length * e % 8; )
        n.push(t);
      return n;
    },
    decode(n) {
      Wn("padding.decode", n);
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
const ea = (e, t) => t === 0 ? e : ea(t, e % t), Gn = /* @__NO_SIDE_EFFECTS__ */ (e, t) => e + (t - ea(e, t)), Ln = /* @__PURE__ */ (() => {
  let e = [];
  for (let t = 0; t < 40; t++)
    e.push(2 ** t);
  return e;
})();
function Vr(e, t, n, r) {
  if (jr(e), t <= 0 || t > 32)
    throw new Error(`convertRadix2: wrong from=${t}`);
  if (n <= 0 || n > 32)
    throw new Error(`convertRadix2: wrong to=${n}`);
  if (/* @__PURE__ */ Gn(t, n) > 32)
    throw new Error(`convertRadix2: carry overflow from=${t} to=${n} carryBits=${/* @__PURE__ */ Gn(t, n)}`);
  let i = 0, o = 0;
  const s = Ln[t], l = Ln[n] - 1, a = [];
  for (const u of e) {
    if (pi(u), u >= s)
      throw new Error(`convertRadix2: invalid data word=${u} from=${t}`);
    if (i = i << t | u, o + t > 32)
      throw new Error(`convertRadix2: carry overflow pos=${o} from=${t}`);
    for (o += t; o >= n; o -= n)
      a.push((i >> o - n & l) >>> 0);
    const f = Ln[o];
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
function ta(e, t = !1) {
  if (pi(e), e <= 0 || e > 32)
    throw new Error("radix2: bits should be in (0..32]");
  if (/* @__PURE__ */ Gn(8, e) > 32 || /* @__PURE__ */ Gn(e, 8) > 32)
    throw new Error("radix2: carry overflow");
  return {
    encode: (n) => {
      if (!hi(n))
        throw new Error("radix2.encode input should be Uint8Array");
      return Vr(Array.from(n), 8, e, !t);
    },
    decode: (n) => (Ys("radix2.decode", n), Uint8Array.from(Vr(n, e, 8, t)))
  };
}
function fo(e) {
  return $u(e), function(...t) {
    try {
      return e.apply(null, t);
    } catch {
    }
  };
}
const Tu = typeof Uint8Array.from([]).toBase64 == "function" && typeof Uint8Array.fromBase64 == "function", Lu = (e, t) => {
  At("base64", e);
  const n = /^[A-Za-z0-9=+/]+$/, r = "base64";
  if (e.length > 0 && !n.test(e))
    throw new Error("invalid base64");
  return Uint8Array.fromBase64(e, { alphabet: r, lastChunkHandling: "strict" });
}, ft = Tu ? {
  encode(e) {
    return Su(e), e.toBase64();
  },
  decode(e) {
    return Lu(e);
  }
} : /* @__PURE__ */ Xs(/* @__PURE__ */ ta(6), /* @__PURE__ */ Js("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), /* @__PURE__ */ Cu(6), /* @__PURE__ */ Qs("")), qr = /* @__PURE__ */ Xs(/* @__PURE__ */ Js("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), /* @__PURE__ */ Qs("")), ho = [996825010, 642813549, 513874426, 1027748829, 705979059];
function Gt(e) {
  const t = e >> 25;
  let n = (e & 33554431) << 5;
  for (let r = 0; r < ho.length; r++)
    (t >> r & 1) === 1 && (n ^= ho[r]);
  return n;
}
function po(e, t, n = 1) {
  const r = e.length;
  let i = 1;
  for (let o = 0; o < r; o++) {
    const s = e.charCodeAt(o);
    if (s < 33 || s > 126)
      throw new Error(`Invalid prefix (${e})`);
    i = Gt(i) ^ s >> 5;
  }
  i = Gt(i);
  for (let o = 0; o < r; o++)
    i = Gt(i) ^ e.charCodeAt(o) & 31;
  for (let o of t)
    i = Gt(i) ^ o;
  for (let o = 0; o < 6; o++)
    i = Gt(i);
  return i ^= n, qr.encode(Vr([i % Ln[30]], 30, 5, !1));
}
// @__NO_SIDE_EFFECTS__
function Ou(e) {
  const t = e === "bech32" ? 1 : 734539939, n = /* @__PURE__ */ ta(5), r = n.decode, i = n.encode, o = fo(r);
  function s(h, w, p = 90) {
    At("bech32.encode prefix", h), hi(w) && (w = Array.from(w)), Ys("bech32.encode", w);
    const c = h.length;
    if (c === 0)
      throw new TypeError(`Invalid prefix length ${c}`);
    const d = c + 7 + w.length;
    if (p !== !1 && d > p)
      throw new TypeError(`Length ${d} exceeds limit ${p}`);
    const y = h.toLowerCase(), g = po(y, w, t);
    return `${y}1${qr.encode(w)}${g}`;
  }
  function l(h, w = 90) {
    At("bech32.decode input", h);
    const p = h.length;
    if (p < 8 || w !== !1 && p > w)
      throw new TypeError(`invalid string length: ${p} (${h}). Expected (8..${w})`);
    const c = h.toLowerCase();
    if (h !== c && h !== h.toUpperCase())
      throw new Error("String must be lowercase or uppercase");
    const d = c.lastIndexOf("1");
    if (d === 0 || d === -1)
      throw new Error('Letter "1" must be present between prefix and data only');
    const y = c.slice(0, d), g = c.slice(d + 1);
    if (g.length < 6)
      throw new Error("Data must be at least 6 characters long");
    const v = qr.decode(g).slice(0, -6), b = po(y, v, t);
    if (!g.endsWith(b))
      throw new Error(`Invalid checksum in ${h}: expected "${b}"`);
    return { prefix: y, words: v };
  }
  const a = fo(l);
  function u(h) {
    const { prefix: w, words: p } = l(h, !1);
    return { prefix: w, words: p, bytes: r(p) };
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
const Ft = /* @__PURE__ */ Ou("bech32");
function Bu(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function go(e) {
  if (typeof e != "boolean")
    throw new Error(`boolean expected, not ${e}`);
}
function _r(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error("positive integer expected, got " + e);
}
function de(e, t, n = "") {
  const r = Bu(e), i = e?.length, o = t !== void 0;
  if (!r || o && i !== t) {
    const s = n && `"${n}" `, l = o ? ` of length ${t}` : "", a = r ? `length=${i}` : `type=${typeof e}`;
    throw new Error(s + "expected Uint8Array" + l + ", got " + a);
  }
  return e;
}
function se(e) {
  return new Uint32Array(e.buffer, e.byteOffset, Math.floor(e.byteLength / 4));
}
function Kt(...e) {
  for (let t = 0; t < e.length; t++)
    e[t].fill(0);
}
const Pu = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Nu(e, t) {
  return e.buffer === t.buffer && // best we can do, may fail with an obscure Proxy
  e.byteOffset < t.byteOffset + t.byteLength && // a starts before b end
  t.byteOffset < e.byteOffset + e.byteLength;
}
function na(e, t) {
  if (Nu(e, t) && e.byteOffset < t.byteOffset)
    throw new Error("complex overlap of input and output is not supported");
}
function Uu(e, t) {
  if (t == null || typeof t != "object")
    throw new Error("options must be defined");
  return Object.assign(e, t);
}
function Mu(e, t) {
  if (e.length !== t.length)
    return !1;
  let n = 0;
  for (let r = 0; r < e.length; r++)
    n |= e[r] ^ t[r];
  return n === 0;
}
const zu = /* @__NO_SIDE_EFFECTS__ */ (e, t) => {
  function n(r, ...i) {
    if (de(r, void 0, "key"), !Pu)
      throw new Error("Non little-endian hardware is not yet supported");
    if (e.nonceLength !== void 0) {
      const f = i[0];
      de(f, e.varSizeNonce ? void 0 : e.nonceLength, "nonce");
    }
    const o = e.tagLength;
    o && i[1] !== void 0 && de(i[1], void 0, "AAD");
    const s = t(r, ...i), l = (f, h) => {
      if (h !== void 0) {
        if (f !== 2)
          throw new Error("cipher output not supported");
        de(h, void 0, "output");
      }
    };
    let a = !1;
    return {
      encrypt(f, h) {
        if (a)
          throw new Error("cannot encrypt() twice with same key + nonce");
        return a = !0, de(f), l(s.encrypt.length, h), s.encrypt(f, h);
      },
      decrypt(f, h) {
        if (de(f), o && f.length < o)
          throw new Error('"ciphertext" expected length bigger than tagLength=' + o);
        return l(s.decrypt.length, h), s.decrypt(f, h);
      }
    };
  }
  return Object.assign(n, e), n;
};
function ra(e, t, n = !0) {
  if (t === void 0)
    return new Uint8Array(e);
  if (t.length !== e)
    throw new Error('"output" expected Uint8Array of length ' + e + ", got: " + t.length);
  if (n && !Nt(t))
    throw new Error("invalid output, must be aligned");
  return t;
}
function Nt(e) {
  return e.byteOffset % 4 === 0;
}
function xt(e) {
  return Uint8Array.from(e);
}
const at = 16, Hu = 283;
function Du(e) {
  if (![16, 24, 32].includes(e.length))
    throw new Error('"aes key" expected Uint8Array of length 16/24/32, got length=' + e.length);
}
function gi(e) {
  return e << 1 ^ Hu & -(e >> 7);
}
function Lt(e, t) {
  let n = 0;
  for (; t > 0; t >>= 1)
    n ^= e & -(t & 1), e = gi(e);
  return n;
}
const Fr = /* @__PURE__ */ (() => {
  const e = new Uint8Array(256);
  for (let n = 0, r = 1; n < 256; n++, r ^= gi(r))
    e[n] = r;
  const t = new Uint8Array(256);
  t[0] = 99;
  for (let n = 0; n < 255; n++) {
    let r = e[255 - n];
    r |= r << 8, t[e[n]] = (r ^ r >> 4 ^ r >> 5 ^ r >> 6 ^ r >> 7 ^ 99) & 255;
  }
  return Kt(e), t;
})(), ju = /* @__PURE__ */ Fr.map((e, t) => Fr.indexOf(t)), Vu = (e) => e << 24 | e >>> 8, Er = (e) => e << 8 | e >>> 24;
function ia(e, t) {
  if (e.length !== 256)
    throw new Error("Wrong sbox length");
  const n = new Uint32Array(256).map((u, f) => t(e[f])), r = n.map(Er), i = r.map(Er), o = i.map(Er), s = new Uint32Array(256 * 256), l = new Uint32Array(256 * 256), a = new Uint16Array(256 * 256);
  for (let u = 0; u < 256; u++)
    for (let f = 0; f < 256; f++) {
      const h = u * 256 + f;
      s[h] = n[u] ^ r[f], l[h] = i[u] ^ o[f], a[h] = e[u] << 8 | e[f];
    }
  return { sbox: e, sbox2: a, T0: n, T1: r, T2: i, T3: o, T01: s, T23: l };
}
const yi = /* @__PURE__ */ ia(Fr, (e) => Lt(e, 3) << 24 | e << 16 | e << 8 | Lt(e, 2)), oa = /* @__PURE__ */ ia(ju, (e) => Lt(e, 11) << 24 | Lt(e, 13) << 16 | Lt(e, 9) << 8 | Lt(e, 14)), qu = /* @__PURE__ */ (() => {
  const e = new Uint8Array(16);
  for (let t = 0, n = 1; t < 16; t++, n = gi(n))
    e[t] = n;
  return e;
})();
function sa(e) {
  de(e);
  const t = e.length;
  Du(e);
  const { sbox2: n } = yi, r = [];
  Nt(e) || r.push(e = xt(e));
  const i = se(e), o = i.length, s = (a) => Oe(n, a, a, a, a), l = new Uint32Array(t + 28);
  l.set(i);
  for (let a = o; a < l.length; a++) {
    let u = l[a - 1];
    a % o === 0 ? u = s(Vu(u)) ^ qu[a / o - 1] : o > 6 && a % o === 4 && (u = s(u)), l[a] = l[a - o] ^ u;
  }
  return Kt(...r), l;
}
function Fu(e) {
  const t = sa(e), n = t.slice(), r = t.length, { sbox2: i } = yi, { T0: o, T1: s, T2: l, T3: a } = oa;
  for (let u = 0; u < r; u += 4)
    for (let f = 0; f < 4; f++)
      n[u + f] = t[r - u - 4 + f];
  Kt(t);
  for (let u = 4; u < r - 4; u++) {
    const f = n[u], h = Oe(i, f, f, f, f);
    n[u] = o[h & 255] ^ s[h >>> 8 & 255] ^ l[h >>> 16 & 255] ^ a[h >>> 24];
  }
  return n;
}
function rt(e, t, n, r, i, o) {
  return e[n << 8 & 65280 | r >>> 8 & 255] ^ t[i >>> 8 & 65280 | o >>> 24 & 255];
}
function Oe(e, t, n, r, i) {
  return e[t & 255 | n & 65280] | e[r >>> 16 & 255 | i >>> 16 & 65280] << 16;
}
function yo(e, t, n, r, i) {
  const { sbox2: o, T01: s, T23: l } = yi;
  let a = 0;
  t ^= e[a++], n ^= e[a++], r ^= e[a++], i ^= e[a++];
  const u = e.length / 4 - 2;
  for (let c = 0; c < u; c++) {
    const d = e[a++] ^ rt(s, l, t, n, r, i), y = e[a++] ^ rt(s, l, n, r, i, t), g = e[a++] ^ rt(s, l, r, i, t, n), v = e[a++] ^ rt(s, l, i, t, n, r);
    t = d, n = y, r = g, i = v;
  }
  const f = e[a++] ^ Oe(o, t, n, r, i), h = e[a++] ^ Oe(o, n, r, i, t), w = e[a++] ^ Oe(o, r, i, t, n), p = e[a++] ^ Oe(o, i, t, n, r);
  return { s0: f, s1: h, s2: w, s3: p };
}
function Ku(e, t, n, r, i) {
  const { sbox2: o, T01: s, T23: l } = oa;
  let a = 0;
  t ^= e[a++], n ^= e[a++], r ^= e[a++], i ^= e[a++];
  const u = e.length / 4 - 2;
  for (let c = 0; c < u; c++) {
    const d = e[a++] ^ rt(s, l, t, i, r, n), y = e[a++] ^ rt(s, l, n, t, i, r), g = e[a++] ^ rt(s, l, r, n, t, i), v = e[a++] ^ rt(s, l, i, r, n, t);
    t = d, n = y, r = g, i = v;
  }
  const f = e[a++] ^ Oe(o, t, i, r, n), h = e[a++] ^ Oe(o, n, t, i, r), w = e[a++] ^ Oe(o, r, n, t, i), p = e[a++] ^ Oe(o, i, r, n, t);
  return { s0: f, s1: h, s2: w, s3: p };
}
function Zu(e) {
  if (de(e), e.length % at !== 0)
    throw new Error("aes-(cbc/ecb).decrypt ciphertext should consist of blocks with size " + at);
}
function Wu(e, t, n) {
  de(e);
  let r = e.length;
  const i = r % at;
  if (!t && i !== 0)
    throw new Error("aec/(cbc-ecb): unpadded plaintext with disabled padding");
  Nt(e) || (e = xt(e));
  const o = se(e);
  if (t) {
    let l = at - i;
    l || (l = at), r = r + l;
  }
  n = ra(r, n), na(e, n);
  const s = se(n);
  return { b: o, o: s, out: n };
}
function Gu(e, t) {
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
function Yu(e) {
  const t = new Uint8Array(16), n = se(t);
  t.set(e);
  const r = at - e.length;
  for (let i = at - r; i < at; i++)
    t[i] = r;
  return n;
}
const aa = /* @__PURE__ */ zu({ blockSize: 16, nonceLength: 16 }, function(t, n, r = {}) {
  const i = !r.disablePadding;
  return {
    encrypt(o, s) {
      const l = sa(t), { b: a, o: u, out: f } = Wu(o, i, s);
      let h = n;
      const w = [l];
      Nt(h) || w.push(h = xt(h));
      const p = se(h);
      let c = p[0], d = p[1], y = p[2], g = p[3], v = 0;
      for (; v + 4 <= a.length; )
        c ^= a[v + 0], d ^= a[v + 1], y ^= a[v + 2], g ^= a[v + 3], { s0: c, s1: d, s2: y, s3: g } = yo(l, c, d, y, g), u[v++] = c, u[v++] = d, u[v++] = y, u[v++] = g;
      if (i) {
        const b = Yu(o.subarray(v * 4));
        c ^= b[0], d ^= b[1], y ^= b[2], g ^= b[3], { s0: c, s1: d, s2: y, s3: g } = yo(l, c, d, y, g), u[v++] = c, u[v++] = d, u[v++] = y, u[v++] = g;
      }
      return Kt(...w), f;
    },
    decrypt(o, s) {
      Zu(o);
      const l = Fu(t);
      let a = n;
      const u = [l];
      Nt(a) || u.push(a = xt(a));
      const f = se(a);
      s = ra(o.length, s), Nt(o) || u.push(o = xt(o)), na(o, s);
      const h = se(o), w = se(s);
      let p = f[0], c = f[1], d = f[2], y = f[3];
      for (let g = 0; g + 4 <= h.length; ) {
        const v = p, b = c, C = d, ae = y;
        p = h[g + 0], c = h[g + 1], d = h[g + 2], y = h[g + 3];
        const { s0: z, s1: q, s2: Y, s3: T } = Ku(l, p, c, d, y);
        w[g++] = z ^ v, w[g++] = q ^ b, w[g++] = Y ^ C, w[g++] = T ^ ae;
      }
      return Kt(...u), Gu(s, i);
    }
  };
}), la = (e) => Uint8Array.from(e.split(""), (t) => t.charCodeAt(0)), Xu = la("expand 16-byte k"), Ju = la("expand 32-byte k"), Qu = se(Xu), ef = se(Ju);
function N(e, t) {
  return e << t | e >>> 32 - t;
}
function Kr(e) {
  return e.byteOffset % 4 === 0;
}
const kn = 64, tf = 16, ca = 2 ** 32 - 1, wo = Uint32Array.of();
function nf(e, t, n, r, i, o, s, l) {
  const a = i.length, u = new Uint8Array(kn), f = se(u), h = Kr(i) && Kr(o), w = h ? se(i) : wo, p = h ? se(o) : wo;
  for (let c = 0; c < a; s++) {
    if (e(t, n, r, f, s, l), s >= ca)
      throw new Error("arx: counter overflow");
    const d = Math.min(kn, a - c);
    if (h && d === kn) {
      const y = c / 4;
      if (c % 4 !== 0)
        throw new Error("arx: invalid block position");
      for (let g = 0, v; g < tf; g++)
        v = y + g, p[v] = w[v] ^ f[g];
      c += kn;
      continue;
    }
    for (let y = 0, g; y < d; y++)
      g = c + y, o[g] = i[g] ^ u[y];
    c += d;
  }
}
function rf(e, t) {
  const { allowShortKeys: n, extendNonceFn: r, counterLength: i, counterRight: o, rounds: s } = Uu({ allowShortKeys: !1, counterLength: 8, counterRight: !1, rounds: 20 }, t);
  if (typeof e != "function")
    throw new Error("core must be a function");
  return _r(i), _r(s), go(o), go(n), (l, a, u, f, h = 0) => {
    de(l, void 0, "key"), de(a, void 0, "nonce"), de(u, void 0, "data");
    const w = u.length;
    if (f === void 0 && (f = new Uint8Array(w)), de(f, void 0, "output"), _r(h), h < 0 || h >= ca)
      throw new Error("arx: counter overflow");
    if (f.length < w)
      throw new Error(`arx: output (${f.length}) is shorter than data (${w})`);
    const p = [];
    let c = l.length, d, y;
    if (c === 32)
      p.push(d = xt(l)), y = ef;
    else if (c === 16 && n)
      d = new Uint8Array(32), d.set(l), d.set(l, 16), y = Qu, p.push(d);
    else
      throw de(l, 32, "arx key"), new Error("invalid key size");
    Kr(a) || p.push(a = xt(a));
    const g = se(d);
    if (r) {
      if (a.length !== 24)
        throw new Error("arx: extended nonce must be 24 bytes");
      r(y, g, se(a.subarray(0, 16)), g), a = a.subarray(16);
    }
    const v = 16 - i;
    if (v !== a.length)
      throw new Error(`arx: nonce must be ${v} or 16 bytes`);
    if (v !== 12) {
      const C = new Uint8Array(12);
      C.set(a, o ? 0 : 12 - a.length), a = C, p.push(a);
    }
    const b = se(a);
    return nf(e, y, g, b, u, f, h, s), Kt(...p), f;
  };
}
function of(e, t, n, r, i, o = 20) {
  let s = e[0], l = e[1], a = e[2], u = e[3], f = t[0], h = t[1], w = t[2], p = t[3], c = t[4], d = t[5], y = t[6], g = t[7], v = i, b = n[0], C = n[1], ae = n[2], z = s, q = l, Y = a, T = u, ee = f, X = h, L = w, E = p, _ = c, m = d, x = y, A = g, R = v, I = b, k = C, S = ae;
  for (let F = 0; F < o; F += 2)
    z = z + ee | 0, R = N(R ^ z, 16), _ = _ + R | 0, ee = N(ee ^ _, 12), z = z + ee | 0, R = N(R ^ z, 8), _ = _ + R | 0, ee = N(ee ^ _, 7), q = q + X | 0, I = N(I ^ q, 16), m = m + I | 0, X = N(X ^ m, 12), q = q + X | 0, I = N(I ^ q, 8), m = m + I | 0, X = N(X ^ m, 7), Y = Y + L | 0, k = N(k ^ Y, 16), x = x + k | 0, L = N(L ^ x, 12), Y = Y + L | 0, k = N(k ^ Y, 8), x = x + k | 0, L = N(L ^ x, 7), T = T + E | 0, S = N(S ^ T, 16), A = A + S | 0, E = N(E ^ A, 12), T = T + E | 0, S = N(S ^ T, 8), A = A + S | 0, E = N(E ^ A, 7), z = z + X | 0, S = N(S ^ z, 16), x = x + S | 0, X = N(X ^ x, 12), z = z + X | 0, S = N(S ^ z, 8), x = x + S | 0, X = N(X ^ x, 7), q = q + L | 0, R = N(R ^ q, 16), A = A + R | 0, L = N(L ^ A, 12), q = q + L | 0, R = N(R ^ q, 8), A = A + R | 0, L = N(L ^ A, 7), Y = Y + E | 0, I = N(I ^ Y, 16), _ = _ + I | 0, E = N(E ^ _, 12), Y = Y + E | 0, I = N(I ^ Y, 8), _ = _ + I | 0, E = N(E ^ _, 7), T = T + ee | 0, k = N(k ^ T, 16), m = m + k | 0, ee = N(ee ^ m, 12), T = T + ee | 0, k = N(k ^ T, 8), m = m + k | 0, ee = N(ee ^ m, 7);
  let $ = 0;
  r[$++] = s + z | 0, r[$++] = l + q | 0, r[$++] = a + Y | 0, r[$++] = u + T | 0, r[$++] = f + ee | 0, r[$++] = h + X | 0, r[$++] = w + L | 0, r[$++] = p + E | 0, r[$++] = c + _ | 0, r[$++] = d + m | 0, r[$++] = y + x | 0, r[$++] = g + A | 0, r[$++] = v + R | 0, r[$++] = b + I | 0, r[$++] = C + k | 0, r[$++] = ae + S | 0;
}
const ua = /* @__PURE__ */ rf(of, {
  counterRight: !1,
  counterLength: 4,
  allowShortKeys: !1
});
function sf(e, t, n) {
  return rr(e), n === void 0 && (n = new Uint8Array(e.outputLen)), yn(e, n, t);
}
const xr = /* @__PURE__ */ Uint8Array.of(0), vo = /* @__PURE__ */ Uint8Array.of();
function af(e, t, n, r = 32) {
  rr(e), ut(r, "length");
  const i = e.outputLen;
  if (r > 255 * i)
    throw new Error("Length must be <= 255*HashLen");
  const o = Math.ceil(r / i);
  n === void 0 ? n = vo : H(n, void 0, "info");
  const s = new Uint8Array(o * i), l = yn.create(e, t), a = l._cloneInto(), u = new Uint8Array(l.outputLen);
  for (let f = 0; f < o; f++)
    xr[0] = f + 1, a.update(f === 0 ? vo : u).update(n).update(xr).digestInto(u), s.set(u, i * f), l._cloneInto(a);
  return l.destroy(), a.destroy(), ln(u, xr), s.slice(0, r);
}
var lf = Object.defineProperty, D = (e, t) => {
  for (var n in t)
    lf(e, n, { get: t[n], enumerable: !0 });
}, Ct = Symbol("verified"), cf = (e) => e instanceof Object;
function sr(e) {
  if (!cf(e) || typeof e.kind != "number" || typeof e.content != "string" || typeof e.created_at != "number" || typeof e.pubkey != "string" || !e.pubkey.match(/^[a-f0-9]{64}$/) || !Array.isArray(e.tags))
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
var fa = {};
D(fa, {
  binarySearch: () => wi,
  bytesToHex: () => V,
  hexToBytes: () => G,
  insertEventIntoAscendingList: () => df,
  insertEventIntoDescendingList: () => ff,
  mergeReverseSortedLists: () => hf,
  normalizeURL: () => uf,
  utf8Decoder: () => Ke,
  utf8Encoder: () => Ee
});
var Ke = new TextDecoder("utf-8"), Ee = new TextEncoder();
function uf(e) {
  try {
    e.indexOf("://") === -1 && (e = "wss://" + e);
    let t = new URL(e);
    return t.protocol === "http:" ? t.protocol = "ws:" : t.protocol === "https:" && (t.protocol = "wss:"), t.pathname = t.pathname.replace(/\/+/g, "/"), t.pathname.endsWith("/") && (t.pathname = t.pathname.slice(0, -1)), (t.port === "80" && t.protocol === "ws:" || t.port === "443" && t.protocol === "wss:") && (t.port = ""), t.searchParams.sort(), t.hash = "", t.toString();
  } catch {
    throw new Error(`Invalid URL: ${e}`);
  }
}
function ff(e, t) {
  const [n, r] = wi(e, (i) => t.id === i.id ? 0 : t.created_at === i.created_at ? -1 : i.created_at - t.created_at);
  return r || e.splice(n, 0, t), e;
}
function df(e, t) {
  const [n, r] = wi(e, (i) => t.id === i.id ? 0 : t.created_at === i.created_at ? -1 : t.created_at - i.created_at);
  return r || e.splice(n, 0, t), e;
}
function wi(e, t) {
  let n = 0, r = e.length - 1;
  for (; n <= r; ) {
    const i = Math.floor((n + r) / 2), o = t(e[i]);
    if (o === 0)
      return [i, !0];
    o < 0 ? r = i - 1 : n = i + 1;
  }
  return [n, !1];
}
function hf(e, t) {
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
var pf = class {
  generateSecretKey() {
    return Wt.utils.randomSecretKey();
  }
  getPublicKey(e) {
    return V(Wt.getPublicKey(e));
  }
  finalizeEvent(e, t) {
    const n = e;
    return n.pubkey = V(Wt.getPublicKey(t)), n.id = rn(n), n.sig = V(Wt.sign(G(rn(n)), t)), n[Ct] = !0, n;
  }
  verifyEvent(e) {
    if (typeof e[Ct] == "boolean")
      return e[Ct];
    try {
      const t = rn(e);
      if (t !== e.id)
        return e[Ct] = !1, !1;
      const n = Wt.verify(G(e.sig), G(t), G(e.pubkey));
      return e[Ct] = n, n;
    } catch {
      return e[Ct] = !1, !1;
    }
  }
};
function gf(e) {
  if (!sr(e))
    throw new Error("can't serialize event with wrong or missing properties");
  return JSON.stringify([0, e.pubkey, e.created_at, e.kind, e.tags, e.content]);
}
function rn(e) {
  let t = Me(Ee.encode(gf(e)));
  return V(t);
}
var ar = new pf(), yf = ar.generateSecretKey, vi = ar.getPublicKey, ze = ar.finalizeEvent, lr = ar.verifyEvent, wf = {};
D(wf, {
  Application: () => $d,
  BadgeAward: () => Af,
  BadgeDefinition: () => Ed,
  BlockedRelaysList: () => id,
  BlossomServerList: () => fd,
  BookmarkList: () => td,
  Bookmarksets: () => bd,
  Calendar: () => Nd,
  CalendarEventRSVP: () => Ud,
  ChannelCreation: () => wa,
  ChannelHideMessage: () => ma,
  ChannelMessage: () => ba,
  ChannelMetadata: () => va,
  ChannelMuteUser: () => _a,
  ChatMessage: () => If,
  ClassifiedListing: () => Ld,
  ClientAuth: () => xa,
  Comment: () => Pf,
  CommunitiesList: () => nd,
  CommunityDefinition: () => Dd,
  CommunityPostApproval: () => Vf,
  Contacts: () => Ef,
  CreateOrUpdateProduct: () => Ad,
  CreateOrUpdateStall: () => kd,
  Curationsets: () => md,
  Date: () => Bd,
  DirectMessageRelaysList: () => cd,
  DraftClassifiedListing: () => Od,
  DraftLong: () => Rd,
  Emojisets: () => Sd,
  EncryptedDirectMessage: () => xf,
  EventDeletion: () => kf,
  FavoriteRelays: () => sd,
  FileMessage: () => Sf,
  FileMetadata: () => Bf,
  FileServerPreference: () => ud,
  Followsets: () => yd,
  ForumThread: () => Rf,
  GenericRepost: () => xi,
  Genericlists: () => wd,
  GiftWrap: () => Ea,
  GroupMetadata: () => jd,
  HTTPAuth: () => ki,
  Handlerinformation: () => Hd,
  Handlerrecommendation: () => zd,
  Highlights: () => Yf,
  InterestsList: () => ad,
  Interestsets: () => xd,
  JobFeedback: () => Kf,
  JobRequest: () => qf,
  JobResult: () => Ff,
  Label: () => jf,
  LightningPubRPC: () => hd,
  LiveChatMessage: () => Nf,
  LiveEvent: () => Cd,
  LongFormArticle: () => Id,
  Metadata: () => mf,
  Mutelist: () => Jf,
  NWCWalletInfo: () => dd,
  NWCWalletRequest: () => ka,
  NWCWalletResponse: () => pd,
  NormalVideo: () => Cf,
  NostrConnect: () => gd,
  OpenTimestamps: () => Lf,
  Photo: () => $f,
  Pinlist: () => Qf,
  Poll: () => Of,
  PollResponse: () => Xf,
  PrivateDirectMessage: () => ya,
  ProblemTracker: () => zf,
  ProfileBadges: () => _d,
  PublicChatsList: () => rd,
  Reaction: () => Ei,
  RecommendRelay: () => _f,
  RelayList: () => ed,
  RelayReview: () => Md,
  Relaysets: () => vd,
  Report: () => Hf,
  Reporting: () => Df,
  Repost: () => _i,
  Seal: () => ga,
  SearchRelaysList: () => od,
  ShortTextNote: () => pa,
  ShortVideo: () => Tf,
  Time: () => Pd,
  UserEmojiList: () => ld,
  UserStatuses: () => Td,
  Voice: () => Uf,
  VoiceComment: () => Mf,
  Zap: () => Gf,
  ZapGoal: () => Zf,
  ZapRequest: () => Wf,
  classifyKind: () => vf,
  isAddressableKind: () => mi,
  isEphemeralKind: () => ha,
  isKind: () => bf,
  isRegularKind: () => da,
  isReplaceableKind: () => bi
});
function da(e) {
  return e < 1e4 && e !== 0 && e !== 3;
}
function bi(e) {
  return e === 0 || e === 3 || 1e4 <= e && e < 2e4;
}
function ha(e) {
  return 2e4 <= e && e < 3e4;
}
function mi(e) {
  return 3e4 <= e && e < 4e4;
}
function vf(e) {
  return da(e) ? "regular" : bi(e) ? "replaceable" : ha(e) ? "ephemeral" : mi(e) ? "parameterized" : "unknown";
}
function bf(e, t) {
  const n = t instanceof Array ? t : [t];
  return sr(e) && n.includes(e.kind) || !1;
}
var mf = 0, pa = 1, _f = 2, Ef = 3, xf = 4, kf = 5, _i = 6, Ei = 7, Af = 8, If = 9, Rf = 11, ga = 13, ya = 14, Sf = 15, xi = 16, $f = 20, Cf = 21, Tf = 22, wa = 40, va = 41, ba = 42, ma = 43, _a = 44, Lf = 1040, Ea = 1059, Of = 1068, Bf = 1063, Pf = 1111, Nf = 1311, Uf = 1222, Mf = 1244, zf = 1971, Hf = 1984, Df = 1984, jf = 1985, Vf = 4550, qf = 5999, Ff = 6999, Kf = 7e3, Zf = 9041, Wf = 9734, Gf = 9735, Yf = 9802, Xf = 1018, Jf = 1e4, Qf = 10001, ed = 10002, td = 10003, nd = 10004, rd = 10005, id = 10006, od = 10007, sd = 10012, ad = 10015, ld = 10030, cd = 10050, ud = 10096, fd = 10063, dd = 13194, hd = 21e3, xa = 22242, ka = 23194, pd = 23195, gd = 24133, ki = 27235, yd = 3e4, wd = 30001, vd = 30002, bd = 30003, md = 30004, _d = 30008, Ed = 30009, xd = 30015, kd = 30017, Ad = 30018, Id = 30023, Rd = 30024, Sd = 30030, $d = 30078, Cd = 30311, Td = 30315, Ld = 30402, Od = 30403, Bd = 31922, Pd = 31923, Nd = 31924, Ud = 31925, Md = 31987, zd = 31989, Hd = 31990, Dd = 34550, jd = 39e3, Vd = {};
D(Vd, {
  getHex64: () => Ai,
  getInt: () => Aa,
  getSubscriptionId: () => qd,
  matchEventId: () => Fd,
  matchEventKind: () => Zd,
  matchEventPubkey: () => Kd
});
function Ai(e, t) {
  let n = t.length + 3, r = e.indexOf(`"${t}":`) + n, i = e.slice(r).indexOf('"') + r + 1;
  return e.slice(i, i + 64);
}
function Aa(e, t) {
  let n = t.length, r = e.indexOf(`"${t}":`) + n + 3, i = e.slice(r), o = Math.min(i.indexOf(","), i.indexOf("}"));
  return parseInt(i.slice(0, o), 10);
}
function qd(e) {
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
function Fd(e, t) {
  return t === Ai(e, "id");
}
function Kd(e, t) {
  return t === Ai(e, "pubkey");
}
function Zd(e, t) {
  return t === Aa(e, "kind");
}
var Wd = {};
D(Wd, {
  makeAuthEvent: () => Gd
});
function Gd(e, t) {
  return {
    kind: xa,
    created_at: Math.floor(Date.now() / 1e3),
    tags: [
      ["relay", e],
      ["challenge", t]
    ],
    content: ""
  };
}
var Yd;
try {
  Yd = WebSocket;
} catch {
}
var Xd;
try {
  Xd = WebSocket;
} catch {
}
var Ia = {};
D(Ia, {
  BECH32_REGEX: () => Ra,
  Bech32MaxSize: () => Ii,
  NostrTypeGuard: () => Jd,
  decode: () => cr,
  decodeNostrURI: () => eh,
  encodeBytes: () => fr,
  naddrEncode: () => sh,
  neventEncode: () => oh,
  noteEncode: () => rh,
  nprofileEncode: () => ih,
  npubEncode: () => nh,
  nsecEncode: () => th
});
var Jd = {
  isNProfile: (e) => /^nprofile1[a-z\d]+$/.test(e || ""),
  isNEvent: (e) => /^nevent1[a-z\d]+$/.test(e || ""),
  isNAddr: (e) => /^naddr1[a-z\d]+$/.test(e || ""),
  isNSec: (e) => /^nsec1[a-z\d]{58}$/.test(e || ""),
  isNPub: (e) => /^npub1[a-z\d]{58}$/.test(e || ""),
  isNote: (e) => /^note1[a-z\d]+$/.test(e || ""),
  isNcryptsec: (e) => /^ncryptsec1[a-z\d]+$/.test(e || "")
}, Ii = 5e3, Ra = /[\x21-\x7E]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/;
function Qd(e) {
  const t = new Uint8Array(4);
  return t[0] = e >> 24 & 255, t[1] = e >> 16 & 255, t[2] = e >> 8 & 255, t[3] = e & 255, t;
}
function eh(e) {
  try {
    return e.startsWith("nostr:") && (e = e.substring(6)), cr(e);
  } catch {
    return { type: "invalid", data: null };
  }
}
function cr(e) {
  let { prefix: t, words: n } = Ft.decode(e, Ii), r = new Uint8Array(Ft.fromWords(n));
  switch (t) {
    case "nprofile": {
      let i = kr(r);
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
      let i = kr(r);
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
      let i = kr(r);
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
function kr(e) {
  let t = {}, n = e;
  for (; n.length > 0; ) {
    let r = n[0], i = n[1], o = n.slice(2, 2 + i);
    if (n = n.slice(2 + i), o.length < i)
      throw new Error(`not enough data to read on TLV ${r}`);
    t[r] = t[r] || [], t[r].push(o);
  }
  return t;
}
function th(e) {
  return fr("nsec", e);
}
function nh(e) {
  return fr("npub", G(e));
}
function rh(e) {
  return fr("note", G(e));
}
function ur(e, t) {
  let n = Ft.toWords(t);
  return Ft.encode(e, n, Ii);
}
function fr(e, t) {
  return ur(e, t);
}
function ih(e) {
  let t = Ri({
    0: [G(e.pubkey)],
    1: (e.relays || []).map((n) => Ee.encode(n))
  });
  return ur("nprofile", t);
}
function oh(e) {
  let t;
  e.kind !== void 0 && (t = Qd(e.kind));
  let n = Ri({
    0: [G(e.id)],
    1: (e.relays || []).map((r) => Ee.encode(r)),
    2: e.author ? [G(e.author)] : [],
    3: t ? [new Uint8Array(t)] : []
  });
  return ur("nevent", n);
}
function sh(e) {
  let t = new ArrayBuffer(4);
  new DataView(t).setUint32(0, e.kind, !1);
  let n = Ri({
    0: [Ee.encode(e.identifier)],
    1: (e.relays || []).map((r) => Ee.encode(r)),
    2: [G(e.pubkey)],
    3: [new Uint8Array(t)]
  });
  return ur("naddr", n);
}
function Ri(e) {
  let t = [];
  return Object.entries(e).reverse().forEach(([n, r]) => {
    r.forEach((i) => {
      let o = new Uint8Array(i.length + 2);
      o.set([parseInt(n)], 0), o.set([i.length], 1), o.set(i, 2), t.push(o);
    });
  }), he(...t);
}
var ah = {};
D(ah, {
  decrypt: () => lh,
  encrypt: () => Sa
});
function Sa(e, t, n) {
  const r = e instanceof Uint8Array ? e : G(e), i = ui.getSharedSecret(r, G("02" + t)), o = $a(i);
  let s = Uint8Array.from(Zt(16)), l = Ee.encode(n), a = aa(o, s).encrypt(l), u = ft.encode(new Uint8Array(a)), f = ft.encode(new Uint8Array(s.buffer));
  return `${u}?iv=${f}`;
}
function lh(e, t, n) {
  const r = e instanceof Uint8Array ? e : G(e);
  let [i, o] = n.split("?iv="), s = ui.getSharedSecret(r, G("02" + t)), l = $a(s), a = ft.decode(o), u = ft.decode(i), f = aa(l, a).decrypt(u);
  return Ke.decode(f);
}
function $a(e) {
  return e.slice(1, 33);
}
var ch = {};
D(ch, {
  NIP05_REGEX: () => Si,
  isNip05: () => uh,
  isValid: () => hh,
  queryProfile: () => Ca,
  searchDomain: () => dh,
  useFetchImplementation: () => fh
});
var Si = /^(?:([\w.+-]+)@)?([\w_-]+(\.[\w_-]+)+)$/, uh = (e) => Si.test(e || ""), dr;
try {
  dr = fetch;
} catch {
}
function fh(e) {
  dr = e;
}
async function dh(e, t = "") {
  try {
    const n = `https://${e}/.well-known/nostr.json?name=${t}`, r = await dr(n, { redirect: "manual" });
    if (r.status !== 200)
      throw Error("Wrong response code");
    return (await r.json()).names;
  } catch {
    return {};
  }
}
async function Ca(e) {
  const t = e.match(Si);
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
async function hh(e, t) {
  const n = await Ca(t);
  return n ? n.pubkey === e : !1;
}
var ph = {};
D(ph, {
  parse: () => gh
});
function gh(e) {
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
var yh = {};
D(yh, {
  fetchRelayInformation: () => vh,
  useFetchImplementation: () => wh
});
var Ta;
try {
  Ta = fetch;
} catch {
}
function wh(e) {
  Ta = e;
}
async function vh(e) {
  return await (await fetch(e.replace("ws://", "http://").replace("wss://", "https://"), {
    headers: { Accept: "application/nostr+json" }
  })).json();
}
var bh = {};
D(bh, {
  getPow: () => mh,
  minePow: () => Eh
});
function mh(e) {
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
function _h(e) {
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
function Eh(e, t) {
  let n = 0;
  const r = e, i = ["nonce", n.toString(), t.toString()];
  for (r.tags.push(i); ; ) {
    const o = Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3);
    o !== r.created_at && (n = 0, r.created_at = o), i[1] = (++n).toString();
    const s = Me(
      Ee.encode(JSON.stringify([0, r.pubkey, r.created_at, r.kind, r.tags, r.content]))
    );
    if (_h(s) >= t) {
      r.id = V(s);
      break;
    }
  }
  return r;
}
var xh = {};
D(xh, {
  unwrapEvent: () => Ph,
  unwrapManyEvents: () => Nh,
  wrapEvent: () => qa,
  wrapManyEvents: () => Bh
});
var kh = {};
D(kh, {
  createRumor: () => Ha,
  createSeal: () => Da,
  createWrap: () => ja,
  unwrapEvent: () => Oi,
  unwrapManyEvents: () => Va,
  wrapEvent: () => Yn,
  wrapManyEvents: () => Lh
});
var Ah = {};
D(Ah, {
  decrypt: () => Li,
  encrypt: () => Ti,
  getConversationKey: () => $i,
  v2: () => Ch
});
var La = 1, Oa = 65535;
function $i(e, t) {
  const n = ui.getSharedSecret(e, G("02" + t)).subarray(1, 33);
  return sf(Me, n, Ee.encode("nip44-v2"));
}
function Ba(e, t) {
  const n = af(Me, e, t, 76);
  return {
    chacha_key: n.subarray(0, 32),
    chacha_nonce: n.subarray(32, 44),
    hmac_key: n.subarray(44, 76)
  };
}
function Ci(e) {
  if (!Number.isSafeInteger(e) || e < 1)
    throw new Error("expected positive integer");
  if (e <= 32)
    return 32;
  const t = 1 << Math.floor(Math.log2(e - 1)) + 1, n = t <= 256 ? 32 : t / 8;
  return n * (Math.floor((e - 1) / n) + 1);
}
function Ih(e) {
  if (!Number.isSafeInteger(e) || e < La || e > Oa)
    throw new Error("invalid plaintext size: must be between 1 and 65535 bytes");
  const t = new Uint8Array(2);
  return new DataView(t.buffer).setUint16(0, e, !1), t;
}
function Rh(e) {
  const t = Ee.encode(e), n = t.length, r = Ih(n), i = new Uint8Array(Ci(n) - n);
  return he(r, t, i);
}
function Sh(e) {
  const t = new DataView(e.buffer).getUint16(0), n = e.subarray(2, 2 + t);
  if (t < La || t > Oa || n.length !== t || e.length !== 2 + Ci(t))
    throw new Error("invalid padding");
  return Ke.decode(n);
}
function Pa(e, t, n) {
  if (n.length !== 32)
    throw new Error("AAD associated data must be 32 bytes");
  const r = he(n, t);
  return yn(Me, e, r);
}
function $h(e) {
  if (typeof e != "string")
    throw new Error("payload must be a valid string");
  const t = e.length;
  if (t < 132 || t > 87472)
    throw new Error("invalid payload length: " + t);
  if (e[0] === "#")
    throw new Error("unknown encryption version");
  let n;
  try {
    n = ft.decode(e);
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
function Ti(e, t, n = Zt(32)) {
  const { chacha_key: r, chacha_nonce: i, hmac_key: o } = Ba(t, n), s = Rh(e), l = ua(r, i, s), a = Pa(o, l, n);
  return ft.encode(he(new Uint8Array([2]), n, l, a));
}
function Li(e, t) {
  const { nonce: n, ciphertext: r, mac: i } = $h(e), { chacha_key: o, chacha_nonce: s, hmac_key: l } = Ba(t, n), a = Pa(l, r, n);
  if (!Mu(a, i))
    throw new Error("invalid MAC");
  const u = ua(o, s, r);
  return Sh(u);
}
var Ch = {
  utils: {
    getConversationKey: $i,
    calcPaddedLen: Ci
  },
  encrypt: Ti,
  decrypt: Li
}, Th = 2880 * 60, Na = () => Math.round(Date.now() / 1e3), Ua = () => Math.round(Na() - Math.random() * Th), Ma = (e, t) => $i(e, t), za = (e, t, n) => Ti(JSON.stringify(e), Ma(t, n)), bo = (e, t) => JSON.parse(Li(e.content, Ma(t, e.pubkey)));
function Ha(e, t) {
  const n = {
    created_at: Na(),
    content: "",
    tags: [],
    ...e,
    pubkey: vi(t)
  };
  return n.id = rn(n), n;
}
function Da(e, t, n) {
  return ze(
    {
      kind: ga,
      content: za(e, t, n),
      created_at: Ua(),
      tags: []
    },
    t
  );
}
function ja(e, t) {
  const n = yf();
  return ze(
    {
      kind: Ea,
      content: za(e, n, t),
      created_at: Ua(),
      tags: [["p", t]]
    },
    n
  );
}
function Yn(e, t, n) {
  const r = Ha(e, t), i = Da(r, t, n);
  return ja(i, n);
}
function Lh(e, t, n) {
  if (!n || n.length === 0)
    throw new Error("At least one recipient is required.");
  const r = vi(t), i = [Yn(e, t, r)];
  return n.forEach((o) => {
    i.push(Yn(e, t, o));
  }), i;
}
function Oi(e, t) {
  const n = bo(e, t);
  return bo(n, t);
}
function Va(e, t) {
  let n = [];
  return e.forEach((r) => {
    n.push(Oi(r, t));
  }), n.sort((r, i) => r.created_at - i.created_at), n;
}
function Oh(e, t, n, r) {
  const i = {
    created_at: Math.ceil(Date.now() / 1e3),
    kind: ya,
    tags: [],
    content: t
  };
  return (Array.isArray(e) ? e : [e]).forEach(({ publicKey: s, relayUrl: l }) => {
    i.tags.push(l ? ["p", s, l] : ["p", s]);
  }), r && i.tags.push(["e", r.eventId, r.relayUrl || "", "reply"]), n && i.tags.push(["subject", n]), i;
}
function qa(e, t, n, r, i) {
  const o = Oh(t, n, r, i);
  return Yn(o, e, t.publicKey);
}
function Bh(e, t, n, r, i) {
  if (!t || t.length === 0)
    throw new Error("At least one recipient is required.");
  return [{ publicKey: vi(e) }, ...t].map(
    (s) => qa(e, s, n, r, i)
  );
}
var Ph = Oi, Nh = Va, Uh = {};
D(Uh, {
  finishRepostEvent: () => Mh,
  getRepostedEvent: () => zh,
  getRepostedEventPointer: () => Fa
});
function Mh(e, t, n, r) {
  let i;
  const o = [...e.tags ?? [], ["e", t.id, n], ["p", t.pubkey]];
  return t.kind === pa ? i = _i : (i = xi, o.push(["k", String(t.kind)])), ze(
    {
      kind: i,
      tags: o,
      content: e.content === "" || t.tags?.find((s) => s[0] === "-") ? "" : JSON.stringify(t),
      created_at: e.created_at
    },
    r
  );
}
function Fa(e) {
  if (![_i, xi].includes(e.kind))
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
function zh(e, { skipVerification: t } = {}) {
  const n = Fa(e);
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
var Hh = {};
D(Hh, {
  NOSTR_URI_REGEX: () => Bi,
  parse: () => jh,
  test: () => Dh
});
var Bi = new RegExp(`nostr:(${Ra.source})`);
function Dh(e) {
  return typeof e == "string" && new RegExp(`^${Bi.source}$`).test(e);
}
function jh(e) {
  const t = e.match(new RegExp(`^${Bi.source}$`));
  if (!t)
    throw new Error(`Invalid Nostr URI: ${e}`);
  return {
    uri: t[0],
    value: t[1],
    decoded: cr(t[1])
  };
}
var Vh = {};
D(Vh, {
  finishReactionEvent: () => qh,
  getReactedEventPointer: () => Fh
});
function qh(e, t, n) {
  const r = t.tags.filter((i) => i.length >= 2 && (i[0] === "e" || i[0] === "p"));
  return ze(
    {
      ...e,
      kind: Ei,
      tags: [...e.tags ?? [], ...r, ["e", t.id], ["p", t.pubkey]],
      content: e.content ?? "+"
    },
    n
  );
}
function Fh(e) {
  if (e.kind !== Ei)
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
var Kh = {};
D(Kh, {
  parse: () => Wh
});
var Ar = /\W/m, mo = /[^\w\/] |[^\w\/]$|$|,| /m, Zh = 42;
function* Wh(e) {
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
        if (s === 0 || e[s - 1].match(Ar)) {
          const l = e.slice(s + 1, s + Zh).match(Ar), a = l ? s + 1 + l.index : n;
          yield { type: "text", text: e.slice(r, s) }, yield { type: "hashtag", value: e.slice(s + 1, a) }, i = a, r = i;
          continue e;
        }
        i = s + 1;
        continue e;
      }
      if (e.slice(o - 5, o) === "nostr") {
        const l = e.slice(o + 60).match(Ar), a = l ? o + 60 + l.index : n;
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
        const l = e.slice(o + 4).match(mo), a = l ? o + 4 + l.index : n, u = e[o - 1] === "s" ? 5 : 4;
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
        const l = e.slice(o + 4).match(mo), a = l ? o + 4 + l.index : n, u = e[o - 1] === "s" ? 3 : 2;
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
var Gh = {};
D(Gh, {
  channelCreateEvent: () => Yh,
  channelHideMessageEvent: () => Qh,
  channelMessageEvent: () => Jh,
  channelMetadataEvent: () => Xh,
  channelMuteUserEvent: () => ep
});
var Yh = (e, t) => {
  let n;
  if (typeof e.content == "object")
    n = JSON.stringify(e.content);
  else if (typeof e.content == "string")
    n = e.content;
  else
    return;
  return ze(
    {
      kind: wa,
      tags: [...e.tags ?? []],
      content: n,
      created_at: e.created_at
    },
    t
  );
}, Xh = (e, t) => {
  let n;
  if (typeof e.content == "object")
    n = JSON.stringify(e.content);
  else if (typeof e.content == "string")
    n = e.content;
  else
    return;
  return ze(
    {
      kind: va,
      tags: [["e", e.channel_create_event_id], ...e.tags ?? []],
      content: n,
      created_at: e.created_at
    },
    t
  );
}, Jh = (e, t) => {
  const n = [["e", e.channel_create_event_id, e.relay_url, "root"]];
  return e.reply_to_channel_message_event_id && n.push(["e", e.reply_to_channel_message_event_id, e.relay_url, "reply"]), ze(
    {
      kind: ba,
      tags: [...n, ...e.tags ?? []],
      content: e.content,
      created_at: e.created_at
    },
    t
  );
}, Qh = (e, t) => {
  let n;
  if (typeof e.content == "object")
    n = JSON.stringify(e.content);
  else if (typeof e.content == "string")
    n = e.content;
  else
    return;
  return ze(
    {
      kind: ma,
      tags: [["e", e.channel_message_event_id], ...e.tags ?? []],
      content: n,
      created_at: e.created_at
    },
    t
  );
}, ep = (e, t) => {
  let n;
  if (typeof e.content == "object")
    n = JSON.stringify(e.content);
  else if (typeof e.content == "string")
    n = e.content;
  else
    return;
  return ze(
    {
      kind: _a,
      tags: [["p", e.pubkey_to_mute], ...e.tags ?? []],
      content: n,
      created_at: e.created_at
    },
    t
  );
}, tp = {};
D(tp, {
  EMOJI_SHORTCODE_REGEX: () => Ka,
  matchAll: () => np,
  regex: () => Pi,
  replaceAll: () => rp
});
var Ka = /:(\w+):/, Pi = () => new RegExp(`\\B${Ka.source}\\B`, "g");
function* np(e) {
  const t = e.matchAll(Pi());
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
function rp(e, t) {
  return e.replaceAll(Pi(), (n, r) => t({
    shortcode: n,
    name: r
  }));
}
var ip = {};
D(ip, {
  useFetchImplementation: () => op,
  validateGithub: () => sp
});
var Ni;
try {
  Ni = fetch;
} catch {
}
function op(e) {
  Ni = e;
}
async function sp(e, t, n) {
  try {
    return await (await Ni(`https://gist.github.com/${t}/${n}/raw`)).text() === `Verifying that I control the following Nostr public key: ${e}`;
  } catch {
    return !1;
  }
}
var ap = {};
D(ap, {
  makeNwcRequestEvent: () => cp,
  parseConnectionString: () => lp
});
function lp(e) {
  const { host: t, pathname: n, searchParams: r } = new URL(e), i = n || t, o = r.get("relay"), s = r.get("secret");
  if (!i || !o || !s)
    throw new Error("invalid connection string");
  return { pubkey: i, relay: o, secret: s };
}
async function cp(e, t, n) {
  const i = Sa(t, e, JSON.stringify({
    method: "pay_invoice",
    params: {
      invoice: n
    }
  })), o = {
    kind: ka,
    created_at: Math.round(Date.now() / 1e3),
    content: i,
    tags: [["p", e]]
  };
  return ze(o, t);
}
var up = {};
D(up, {
  normalizeIdentifier: () => fp
});
function fp(e) {
  return e = e.trim().toLowerCase(), e = e.normalize("NFKC"), Array.from(e).map((t) => new RegExp("\\p{Letter}", "u").test(t) || new RegExp("\\p{Number}", "u").test(t) ? t : "-").join("");
}
var dp = {};
D(dp, {
  getSatoshisAmountFromBolt11: () => vp,
  getZapEndpoint: () => pp,
  makeZapReceipt: () => wp,
  makeZapRequest: () => gp,
  useFetchImplementation: () => hp,
  validateZapRequest: () => yp
});
var Ui;
try {
  Ui = fetch;
} catch {
}
function hp(e) {
  Ui = e;
}
async function pp(e) {
  try {
    let t = "", { lud06: n, lud16: r } = JSON.parse(e.content);
    if (r) {
      let [s, l] = r.split("@");
      t = new URL(`/.well-known/lnurlp/${s}`, `https://${l}`).toString();
    } else if (n) {
      let { words: s } = Ft.decode(n, 1e3), l = Ft.fromWords(s);
      t = Ke.decode(l);
    } else
      return null;
    let o = await (await Ui(t)).json();
    if (o.allowsNostr && o.nostrPubkey)
      return o.callback;
  } catch {
  }
  return null;
}
function gp(e) {
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
    if (t.tags.push(["e", e.event.id]), bi(e.event.kind)) {
      const n = ["a", `${e.event.kind}:${e.event.pubkey}:`];
      t.tags.push(n);
    } else if (mi(e.event.kind)) {
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
function yp(e) {
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
function wp({
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
function vp(e) {
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
var bp = {};
D(bp, {
  Negentropy: () => Wa,
  NegentropyStorageVector: () => Ep,
  NegentropySync: () => xp
});
var Ir = 97, Ut = 32, Za = 16, gt = {
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
function An(e) {
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
function mp(e) {
  return On(e, 1)[0];
}
function On(e, t) {
  if (e.length < t)
    throw Error("parse ends prematurely");
  return e.shiftN(t);
}
var _p = class {
  buf;
  constructor() {
    this.setToZero();
  }
  setToZero() {
    this.buf = new Uint8Array(Ut);
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
    let t = new Uint8Array(Ut);
    t[0] = 1, this.add(t);
  }
  getFingerprint(e) {
    let t = new Ve();
    return t.extend(this.buf), t.extend(De(e)), Me(t.unwrap()).subarray(0, Za);
  }
}, Ep = class {
  items;
  sealed;
  constructor() {
    this.items = [], this.sealed = !1;
  }
  insert(e, t) {
    if (this.sealed)
      throw Error("already sealed");
    const n = G(t);
    if (n.byteLength !== Ut)
      throw Error("bad id size for added item");
    this.items.push({ timestamp: e, id: n });
  }
  seal() {
    if (this.sealed)
      throw Error("already sealed");
    this.sealed = !0, this.items.sort(Rr);
    for (let e = 1; e < this.items.length; e++)
      if (Rr(this.items[e - 1], this.items[e]) === 0)
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
    return this._checkSealed(), this._checkBounds(e, t), this._binarySearch(this.items, e, t, (r) => Rr(r, n) < 0);
  }
  fingerprint(e, t) {
    let n = new _p();
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
}, Wa = class {
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
    return e.extend(new Uint8Array([Ir])), this.splitRange(0, this.storage.size(), this._bound(Number.MAX_VALUE), e), V(e.unwrap());
  }
  reconcile(e, t, n) {
    const r = new Ve(G(e));
    this.lastTimestampIn = this.lastTimestampOut = 0;
    let i = new Ve();
    i.extend(new Uint8Array([Ir]));
    let o = mp(r);
    if (o < 96 || o > 111)
      throw Error("invalid negentropy protocol version byte");
    if (o !== Ir)
      throw Error("unsupported negentropy protocol version requested: " + (o - 96));
    let s = this.storage.size(), l = this._bound(0), a = 0, u = !1;
    for (; r.length !== 0; ) {
      let f = new Ve(), h = () => {
        u && (u = !1, f.extend(this.encodeBound(l)), f.extend(De(gt.Skip)));
      }, w = this.decodeBound(r), p = An(r), c = a, d = this.storage.findLowerBound(a, s, w);
      if (p === gt.Skip)
        u = !0;
      else if (p === gt.Fingerprint) {
        let y = On(r, Za), g = this.storage.fingerprint(c, d);
        Ga(y, g) !== 0 ? (h(), this.splitRange(c, d, w, f)) : u = !0;
      } else if (p === gt.IdList) {
        let y = An(r), g = {};
        for (let v = 0; v < y; v++) {
          let b = On(r, Ut);
          g[V(b)] = b;
        }
        if (u = !0, this.storage.iterate(c, d, (v) => {
          let b = v.id;
          const C = V(b);
          return g[C] ? delete g[V(b)] : t?.(C), !0;
        }), n)
          for (let v of Object.values(g))
            n(V(v));
      } else
        throw Error("unexpected mode");
      if (this.exceededFrameSizeLimit(i.length + f.length)) {
        let y = this.storage.fingerprint(d, s);
        i.extend(this.encodeBound(this._bound(Number.MAX_VALUE))), i.extend(De(gt.Fingerprint)), i.extend(y);
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
      r.extend(this.encodeBound(n)), r.extend(De(gt.IdList)), r.extend(De(i)), this.storage.iterate(e, t, (s) => (r.extend(s.id), !0));
    else {
      let s = Math.floor(i / o), l = i % o, a = e;
      for (let u = 0; u < o; u++) {
        let f = s + (u < l ? 1 : 0), h = this.storage.fingerprint(a, a + f);
        a += f;
        let w;
        if (a === t)
          w = n;
        else {
          let p, c;
          this.storage.iterate(a - 1, a + 1, (d, y) => (y === a - 1 ? p = d : c = d, !0)), w = this.getMinimalBound(p, c);
        }
        r.extend(this.encodeBound(w)), r.extend(De(gt.Fingerprint)), r.extend(h);
      }
    }
  }
  exceededFrameSizeLimit(e) {
    return e > this.frameSizeLimit - 200;
  }
  decodeTimestampIn(e) {
    let t = An(e);
    return t = t === 0 ? Number.MAX_VALUE : t - 1, this.lastTimestampIn === Number.MAX_VALUE || t === Number.MAX_VALUE ? (this.lastTimestampIn = Number.MAX_VALUE, Number.MAX_VALUE) : (t += this.lastTimestampIn, this.lastTimestampIn = t, t);
  }
  decodeBound(e) {
    let t = this.decodeTimestampIn(e), n = An(e);
    if (n > Ut)
      throw Error("bound key too long");
    let r = On(e, n);
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
      for (let o = 0; o < Ut && r[o] === i[o]; o++)
        n++;
      return this._bound(t.timestamp, t.id.subarray(0, n + 1));
    }
  }
};
function Ga(e, t) {
  for (let n = 0; n < e.byteLength; n++) {
    if (e[n] < t[n])
      return -1;
    if (e[n] > t[n])
      return 1;
  }
  return e.byteLength > t.byteLength ? 1 : e.byteLength < t.byteLength ? -1 : 0;
}
function Rr(e, t) {
  return e.timestamp === t.timestamp ? Ga(e.id, t.id) : e.timestamp - t.timestamp;
}
var xp = class {
  relay;
  storage;
  neg;
  filter;
  subscription;
  onhave;
  onneed;
  constructor(e, t, n, r = {}) {
    this.relay = e, this.storage = t, this.neg = new Wa(t), this.onhave = r.onhave, this.onneed = r.onneed, this.filter = n, this.subscription = this.relay.prepareSubscription([{}], { label: r.label || "negentropy" }), this.subscription.oncustom = (i) => {
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
}, kp = {};
D(kp, {
  getToken: () => Ap,
  hashPayload: () => Mi,
  unpackEventFromToken: () => Xa,
  validateEvent: () => rl,
  validateEventKind: () => Qa,
  validateEventMethodTag: () => tl,
  validateEventPayloadTag: () => nl,
  validateEventTimestamp: () => Ja,
  validateEventUrlTag: () => el,
  validateToken: () => Ip
});
var Ya = "Nostr ";
async function Ap(e, t, n, r = !1, i) {
  const o = {
    kind: ki,
    tags: [
      ["u", e],
      ["method", t]
    ],
    created_at: Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3),
    content: ""
  };
  i && o.tags.push(["payload", Mi(i)]);
  const s = await n(o);
  return (r ? Ya : "") + ft.encode(Ee.encode(JSON.stringify(s)));
}
async function Ip(e, t, n) {
  const r = await Xa(e).catch((o) => {
    throw o;
  });
  return await rl(r, t, n).catch((o) => {
    throw o;
  });
}
async function Xa(e) {
  if (!e)
    throw new Error("Missing token");
  e = e.replace(Ya, "");
  const t = Ke.decode(ft.decode(e));
  if (!t || t.length === 0 || !t.startsWith("{"))
    throw new Error("Invalid token");
  return JSON.parse(t);
}
function Ja(e) {
  return e.created_at ? Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3) - e.created_at < 60 : !1;
}
function Qa(e) {
  return e.kind === ki;
}
function el(e, t) {
  const n = e.tags.find((r) => r[0] === "u");
  return n ? n.length > 0 && n[1] === t : !1;
}
function tl(e, t) {
  const n = e.tags.find((r) => r[0] === "method");
  return n ? n.length > 0 && n[1].toLowerCase() === t.toLowerCase() : !1;
}
function Mi(e) {
  const t = Me(Ee.encode(JSON.stringify(e)));
  return V(t);
}
function nl(e, t) {
  const n = e.tags.find((i) => i[0] === "payload");
  if (!n)
    return !1;
  const r = Mi(t);
  return n.length > 0 && n[1] === r;
}
async function rl(e, t, n, r) {
  if (!lr(e))
    throw new Error("Invalid nostr event, signature invalid");
  if (!Qa(e))
    throw new Error("Invalid nostr event, kind invalid");
  if (!Ja(e))
    throw new Error("Invalid nostr event, created_at timestamp invalid");
  if (!el(e, t))
    throw new Error("Invalid nostr event, url tag invalid");
  if (!tl(e, n))
    throw new Error("Invalid nostr event, method tag invalid");
  if (r && typeof r == "object" && Object.keys(r).length > 0 && !nl(e, r))
    throw new Error("Invalid nostr event, payload tag does not match request body hash");
  return !0;
}
const d0 = [
  "wss://purplepag.es/",
  "wss://directory.yabu.me/",
  "wss://indexer.coracle.social/",
  "wss://user.kindpag.es/"
], h0 = [
  "wss://nos.lol/",
  "wss://relay.damus.io/",
  "wss://relay.nostr.wirednet.jp/",
  "wss://yabu.me/",
  "wss://x.kojira.io/"
], Rp = [
  "wss://relay.nostr.band/",
  "wss://nrelay.c-stellar.net/",
  "wss://nrelay-jp.c-stellar.net/"
], _o = /* @__PURE__ */ new Set(["ws:", "wss:"]), Sp = new Set(Rp);
class p0 {
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
class dt {
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
    return n !== null && Sp.has(n);
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
        if (!_o.has(o.protocol) || o.username || o.password)
          return null;
      }
      const r = fa.normalizeURL(n), i = new URL(r);
      return !_o.has(i.protocol) || !i.hostname || i.username || i.password ? null : r;
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
function $p(e) {
  if (typeof e != "string" || !e.trim().includes("://"))
    return !1;
  try {
    const t = new URL(e.trim());
    return (t.protocol === "ws:" || t.protocol === "wss:") && !t.username && !t.password && dt.normalizeExternalRelayUrl(e) !== null;
  } catch {
    return !1;
  }
}
function Cp(e, t = {}) {
  try {
    const n = Ia.decode(e);
    if (n.type === "nevent") {
      const r = n.data, i = Array.isArray(r.relays) ? r.relays : [];
      return t.relayValidation === "strict" && i.some((o) => !$p(o)) ? null : {
        eventId: r.id,
        relayHints: dt.sanitizeExternalRelayUrls(
          i.filter((o) => typeof o == "string"),
          { limit: dt.EXTERNAL_INPUT_RELAY_LIMIT }
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
const Tp = /^[0-9a-f]{64}$/i;
function Xn(e) {
  return typeof e == "string" && Tp.test(e);
}
const on = {
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
function zi(e) {
  if (typeof e != "string")
    return null;
  const t = e.trim().toLowerCase();
  return t.length > 0 ? t : null;
}
function Hi(e) {
  const t = e[1];
  if (!Xn(t))
    return null;
  const n = dt.sanitizeExternalRelayUrls(
    typeof e[2] == "string" && e[2].length > 0 ? [e[2]] : [],
    { limit: 1 }
  )[0] ?? null, r = Xn(e[4]) ? e[4] : null;
  return {
    eventId: t,
    relayHint: n,
    marker: zi(e[3]),
    authorHint: r
  };
}
function le(e) {
  const t = /* @__PURE__ */ new Set(), n = [];
  for (const r of e)
    !r || t.has(r) || (t.add(r), n.push(r));
  return n;
}
function Eo(e, t) {
  const n = e.filter(
    (s) => Array.isArray(s) && s[0] === "e" && zi(s[3]) === t
  ), r = n.map(Hi).filter((s) => s !== null), i = le(r.map((s) => s.eventId)), o = i.length === 1 ? r.filter((s) => s.eventId === i[0]) : [];
  return {
    reference: o[0] ?? null,
    relayHints: le(o.map((s) => s.relayHint)),
    authorHints: le(o.map((s) => s.authorHint)),
    hasInvalidId: n.length !== r.length,
    hasConflict: i.length > 1
  };
}
function Sr(e) {
  if (typeof e != "string")
    return null;
  const t = e.trim().toLowerCase();
  return t.length === 0 || Xn(t) ? null : t === "reply" || t === "root" ? t : "unknown";
}
function g0(e) {
  if (!e || e.kind !== 7)
    return null;
  const t = e.tags.filter(
    (o) => Array.isArray(o) && o[0] === "e" && Xn(o[1])
  );
  if (t.length === 0)
    return null;
  const n = [...t].reverse().find((o) => Sr(o[3]) === "reply");
  if (n)
    return n[1];
  const r = [...t].reverse().find((o) => Sr(o[3]) === null);
  if (r)
    return r[1];
  const i = [...t].reverse().find((o) => Sr(o[3]) === "root");
  return i ? i[1] : t[t.length - 1][1];
}
function Lp(e) {
  if (!e || e.kind !== 1)
    return { ...on };
  const t = e.tags.filter((w) => Array.isArray(w) && w[0] === "e").map(Hi).filter((w) => w !== null);
  if (t.length === 0)
    return { ...on };
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
      ...on,
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
function il(e) {
  if (!e || e.kind !== 42)
    return { ...on };
  const t = Eo(e.tags, "root"), n = Eo(e.tags, "reply"), r = e.tags.filter((h) => Array.isArray(h) && h[0] === "e").map(Hi).filter((h) => h !== null), i = r.filter((h) => h.marker === "mention"), o = r.filter(
    (h) => h.marker !== null && h.marker !== "root" && h.marker !== "reply" && h.marker !== "mention"
  ), s = [];
  e.tags.some(
    (h) => Array.isArray(h) && h[0] === "e" && zi(h[3]) === "root"
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
function y0(e) {
  return e?.kind === 1 ? Lp(e) : e?.kind === 42 ? il(e) : { ...on };
}
function w0(e) {
  return !!e.parentId && !e.issues.includes("conflicting-reply-targets") && !e.issues.includes("reply-target-is-channel");
}
function ol(e) {
  return e.map((t) => [...t]);
}
function sl(e, t) {
  return !Array.isArray(e) || e.length !== t.length ? !1 : e.every((n, r) => !Array.isArray(n) || n.length !== t[r].length ? !1 : n.every((i, o) => i === t[r][o]));
}
function v0(e) {
  return {
    ...e,
    tags: ol(e.tags)
  };
}
function xo(e) {
  return {
    id: e.id,
    pubkey: e.pubkey,
    created_at: e.created_at,
    kind: e.kind,
    tags: ol(e.tags),
    content: e.content,
    sig: e.sig
  };
}
function al(e) {
  if (!e || typeof e != "object")
    return !1;
  const t = e;
  return typeof t.id == "string" && typeof t.pubkey == "string" && typeof t.kind == "number" && typeof t.content == "string" && typeof t.created_at == "number" && typeof t.sig == "string" && Array.isArray(t.tags) && t.tags.every(
    (n) => Array.isArray(n) && n.every((r) => typeof r == "string")
  );
}
function b0(e, t) {
  if (!e || typeof e != "object")
    return !1;
  const n = e;
  return n.id === t.id && n.pubkey === t.pubkey && n.kind === t.kind && n.content === t.content && n.created_at === t.created_at && n.sig === t.sig && sl(n.tags, t.tags);
}
function m0(e) {
  if (e.kind !== 42)
    return {};
  const t = il(e);
  return t.channelEventId ? {
    channelEventId: t.channelEventId,
    ...t.channelRelayHints.length > 0 ? { channelRelayHints: t.channelRelayHints } : {}
  } : {};
}
function _0(e, t) {
  return al(e) && e.id === t.eventId && e.pubkey === t.pubkeyHex && e.kind === t.kind && e.content === t.content && e.created_at === t.createdAt && sl(e.tags, t.tags);
}
var Bn = { exports: {} }, Op = Bn.exports, ko;
function Bp() {
  return ko || (ko = 1, (function(e) {
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
        let y = 0, g = -1, v = (c.match(a.zoneIndex) || [])[0], b, C;
        for (v && (v = v.substring(1), c = c.replace(/%.+$/, "")); (g = c.indexOf(":", g + 1)) >= 0; )
          y++;
        if (c.substr(0, 2) === "::" && y--, c.substr(-2, 2) === "::" && y--, y > d)
          return null;
        for (C = d - y, b = ":"; C--; )
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
      function f(c, d, y, g) {
        if (c.length !== d.length)
          throw new Error("ipaddr: cannot match CIDR for objects with different lengths");
        let v = 0, b;
        for (; g > 0; ) {
          if (b = y - g, b < 0 && (b = 0), c[v] >> b !== d[v] >> b)
            return !1;
          g -= y, v += 1;
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
      const p = {};
      p.IPv4 = (function() {
        function c(d) {
          if (d.length !== 4)
            throw new Error("ipaddr: ipv4 octet count should be 4");
          let y, g;
          for (y = 0; y < d.length; y++)
            if (g = d[y], !(0 <= g && g <= 255))
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
        }, c.prototype.match = function(d, y) {
          let g;
          if (y === void 0 && (g = d, d = g[0], y = g[1]), d.kind() !== "ipv4")
            throw new Error("ipaddr: cannot match ipv4 address with non-ipv4 one");
          return f(this.octets, d.octets, 8, y);
        }, c.prototype.prefixLengthFromSubnetMask = function() {
          let d = 0, y = !1;
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
          let v, b, C;
          for (v = 3; v >= 0; v -= 1)
            if (b = this.octets[v], b in g) {
              if (C = g[b], y && C !== 0)
                return null;
              C !== 8 && (y = !0), d += C;
            } else
              return null;
          return 32 - d;
        }, c.prototype.range = function() {
          return p.subnetMatch(this, this.SpecialRanges);
        }, c.prototype.toByteArray = function() {
          return this.octets.slice(0);
        }, c.prototype.toIPv4MappedAddress = function() {
          return p.IPv6.parse(`::ffff:${this.toString()}`);
        }, c.prototype.toNormalizedString = function() {
          return this.toString();
        }, c.prototype.toString = function() {
          return this.octets.join(".");
        }, c;
      })(), p.IPv4.broadcastAddressFromCIDR = function(c) {
        try {
          const d = this.parseCIDR(c), y = d[0].toByteArray(), g = this.subnetMaskFromPrefixLength(d[1]).toByteArray(), v = [];
          let b = 0;
          for (; b < 4; )
            v.push(parseInt(y[b], 10) | parseInt(g[b], 10) ^ 255), b++;
          return new this(v);
        } catch {
          throw new Error("ipaddr: the address does not have IPv4 CIDR format");
        }
      }, p.IPv4.isIPv4 = function(c) {
        return this.parser(c) !== null;
      }, p.IPv4.isValid = function(c) {
        try {
          return new this(this.parser(c)), !0;
        } catch {
          return !1;
        }
      }, p.IPv4.isValidCIDR = function(c) {
        try {
          return this.parseCIDR(c), !0;
        } catch {
          return !1;
        }
      }, p.IPv4.isValidFourPartDecimal = function(c) {
        return !!(p.IPv4.isValid(c) && c.match(/^(0|[1-9]\d*)(\.(0|[1-9]\d*)){3}$/));
      }, p.IPv4.isValidCIDRFourPartDecimal = function(c) {
        const d = c.match(/^(.+)\/(\d+)$/);
        return !p.IPv4.isValidCIDR(c) || !d ? !1 : p.IPv4.isValidFourPartDecimal(d[1]);
      }, p.IPv4.networkAddressFromCIDR = function(c) {
        let d, y, g, v, b;
        try {
          for (d = this.parseCIDR(c), g = d[0].toByteArray(), b = this.subnetMaskFromPrefixLength(d[1]).toByteArray(), v = [], y = 0; y < 4; )
            v.push(parseInt(g[y], 10) & parseInt(b[y], 10)), y++;
          return new this(v);
        } catch {
          throw new Error("ipaddr: the address does not have IPv4 CIDR format");
        }
      }, p.IPv4.parse = function(c) {
        const d = this.parser(c);
        if (d === null)
          throw new Error("ipaddr: string is not formatted like an IPv4 Address");
        return new this(d);
      }, p.IPv4.parseCIDR = function(c) {
        let d;
        if (d = c.match(/^(.+)\/(\d+)$/)) {
          const y = parseInt(d[2]);
          if (y >= 0 && y <= 32) {
            const g = [this.parse(d[1]), y];
            return Object.defineProperty(g, "toString", {
              value: function() {
                return this.join("/");
              }
            }), g;
          }
        }
        throw new Error("ipaddr: string is not formatted like an IPv4 CIDR range");
      }, p.IPv4.parser = function(c) {
        let d, y, g;
        if (d = c.match(r.fourOctet))
          return (function() {
            const v = d.slice(1, 6), b = [];
            for (let C = 0; C < v.length; C++)
              y = v[C], b.push(h(y));
            return b;
          })();
        if (d = c.match(r.longValue)) {
          if (g = h(d[1]), g > 4294967295 || g < 0)
            throw new Error("ipaddr: address outside defined range");
          return (function() {
            const v = [];
            let b;
            for (b = 0; b <= 24; b += 8)
              v.push(g >> b & 255);
            return v;
          })().reverse();
        } else return (d = c.match(r.twoOctet)) ? (function() {
          const v = d.slice(1, 4), b = [];
          if (g = h(v[1]), g > 16777215 || g < 0)
            throw new Error("ipaddr: address outside defined range");
          return b.push(h(v[0])), b.push(g >> 16 & 255), b.push(g >> 8 & 255), b.push(g & 255), b;
        })() : (d = c.match(r.threeOctet)) ? (function() {
          const v = d.slice(1, 5), b = [];
          if (g = h(v[2]), g > 65535 || g < 0)
            throw new Error("ipaddr: address outside defined range");
          return b.push(h(v[0])), b.push(h(v[1])), b.push(g >> 8 & 255), b.push(g & 255), b;
        })() : null;
      }, p.IPv4.subnetMaskFromPrefixLength = function(c) {
        if (c = parseInt(c), c < 0 || c > 32)
          throw new Error("ipaddr: invalid IPv4 prefix length");
        const d = [0, 0, 0, 0];
        let y = 0;
        const g = Math.floor(c / 8);
        for (; y < g; )
          d[y] = 255, y++;
        return g < 4 && (d[g] = Math.pow(2, c % 8) - 1 << 8 - c % 8), new this(d);
      }, p.IPv6 = (function() {
        function c(d, y) {
          let g, v;
          if (d.length === 16)
            for (this.parts = [], g = 0; g <= 14; g += 2)
              this.parts.push(d[g] << 8 | d[g + 1]);
          else if (d.length === 8)
            this.parts = d;
          else
            throw new Error("ipaddr: ipv6 part count should be 8 or 16");
          for (g = 0; g < this.parts.length; g++)
            if (v = this.parts[g], !(0 <= v && v <= 65535))
              throw new Error("ipaddr: ipv6 part should fit in 16 bits");
          y && (this.zoneId = y);
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
        }, c.prototype.match = function(d, y) {
          let g;
          if (y === void 0 && (g = d, d = g[0], y = g[1]), d.kind() !== "ipv6")
            throw new Error("ipaddr: cannot match ipv6 address with non-ipv6 one");
          return f(this.parts, d.parts, 16, y);
        }, c.prototype.prefixLengthFromSubnetMask = function() {
          let d = 0, y = !1;
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
          let v, b;
          for (let C = 7; C >= 0; C -= 1)
            if (v = this.parts[C], v in g) {
              if (b = g[v], y && b !== 0)
                return null;
              b !== 16 && (y = !0), d += b;
            } else
              return null;
          return 128 - d;
        }, c.prototype.range = function() {
          return p.subnetMatch(this, this.SpecialRanges);
        }, c.prototype.toByteArray = function() {
          let d;
          const y = [], g = this.parts;
          for (let v = 0; v < g.length; v++)
            d = g[v], y.push(d >> 8), y.push(d & 255);
          return y;
        }, c.prototype.toFixedLengthString = function() {
          const d = (function() {
            const g = [];
            for (let v = 0; v < this.parts.length; v++)
              g.push(w(this.parts[v].toString(16), 4));
            return g;
          }).call(this).join(":");
          let y = "";
          return this.zoneId && (y = `%${this.zoneId}`), d + y;
        }, c.prototype.toIPv4Address = function() {
          if (!this.isIPv4MappedAddress())
            throw new Error("ipaddr: trying to convert a generic ipv6 address to ipv4");
          const d = this.parts.slice(-2), y = d[0], g = d[1];
          return new p.IPv4([y >> 8, y & 255, g >> 8, g & 255]);
        }, c.prototype.toNormalizedString = function() {
          const d = (function() {
            const g = [];
            for (let v = 0; v < this.parts.length; v++)
              g.push(this.parts[v].toString(16));
            return g;
          }).call(this).join(":");
          let y = "";
          return this.zoneId && (y = `%${this.zoneId}`), d + y;
        }, c.prototype.toRFC5952String = function() {
          const d = /((^|:)(0(:|$)){2,})/g, y = this.toNormalizedString();
          let g = 0, v = -1, b;
          for (; b = d.exec(y); )
            b[0].length > v && (g = b.index, v = b[0].length);
          return v < 0 ? y : `${y.substring(0, g)}::${y.substring(g + v)}`;
        }, c.prototype.toString = function() {
          return this.toRFC5952String();
        }, c;
      })(), p.IPv6.broadcastAddressFromCIDR = function(c) {
        try {
          const d = this.parseCIDR(c), y = d[0].toByteArray(), g = this.subnetMaskFromPrefixLength(d[1]).toByteArray(), v = [];
          let b = 0;
          for (; b < 16; )
            v.push(parseInt(y[b], 10) | parseInt(g[b], 10) ^ 255), b++;
          return new this(v);
        } catch (d) {
          throw new Error(`ipaddr: the address does not have IPv6 CIDR format (${d})`);
        }
      }, p.IPv6.isIPv6 = function(c) {
        return this.parser(c) !== null;
      }, p.IPv6.isValid = function(c) {
        if (typeof c == "string" && c.indexOf(":") === -1)
          return !1;
        try {
          const d = this.parser(c);
          return new this(d.parts, d.zoneId), !0;
        } catch {
          return !1;
        }
      }, p.IPv6.isValidCIDR = function(c) {
        if (typeof c == "string" && c.indexOf(":") === -1)
          return !1;
        try {
          return this.parseCIDR(c), !0;
        } catch {
          return !1;
        }
      }, p.IPv6.networkAddressFromCIDR = function(c) {
        let d, y, g, v, b;
        try {
          for (d = this.parseCIDR(c), g = d[0].toByteArray(), b = this.subnetMaskFromPrefixLength(d[1]).toByteArray(), v = [], y = 0; y < 16; )
            v.push(parseInt(g[y], 10) & parseInt(b[y], 10)), y++;
          return new this(v);
        } catch (C) {
          throw new Error(`ipaddr: the address does not have IPv6 CIDR format (${C})`);
        }
      }, p.IPv6.parse = function(c) {
        const d = this.parser(c);
        if (d.parts === null)
          throw new Error("ipaddr: string is not formatted like an IPv6 Address");
        return new this(d.parts, d.zoneId);
      }, p.IPv6.parseCIDR = function(c) {
        let d, y, g;
        if ((y = c.match(/^(.+)\/(\d+)$/)) && (d = parseInt(y[2]), d >= 0 && d <= 128))
          return g = [this.parse(y[1]), d], Object.defineProperty(g, "toString", {
            value: function() {
              return this.join("/");
            }
          }), g;
        throw new Error("ipaddr: string is not formatted like an IPv6 CIDR range");
      }, p.IPv6.parser = function(c) {
        let d, y, g, v, b, C;
        if (g = c.match(a.deprecatedTransitional))
          return this.parser(`::ffff:${g[1]}`);
        if (a.native.test(c))
          return u(c, 8);
        if ((g = c.match(a.transitional)) && (C = g[6] || "", d = g[1], g[1].endsWith("::") || (d = d.slice(0, -1)), d = u(d + C, 6), d.parts)) {
          for (b = [
            parseInt(g[2]),
            parseInt(g[3]),
            parseInt(g[4]),
            parseInt(g[5])
          ], y = 0; y < b.length; y++)
            if (v = b[y], !(0 <= v && v <= 255))
              return null;
          return d.parts.push(b[0] << 8 | b[1]), d.parts.push(b[2] << 8 | b[3]), {
            parts: d.parts,
            zoneId: d.zoneId
          };
        }
        return null;
      }, p.IPv6.subnetMaskFromPrefixLength = function(c) {
        if (c = parseInt(c), c < 0 || c > 128)
          throw new Error("ipaddr: invalid IPv6 prefix length");
        const d = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let y = 0;
        const g = Math.floor(c / 8);
        for (; y < g; )
          d[y] = 255, y++;
        return g < 16 && (d[g] = Math.pow(2, c % 8) - 1 << 8 - c % 8), new this(d);
      }, p.fromByteArray = function(c) {
        const d = c.length;
        if (d === 4)
          return new p.IPv4(c);
        if (d === 16)
          return new p.IPv6(c);
        throw new Error("ipaddr: the binary input is neither an IPv6 nor IPv4 address");
      }, p.isValid = function(c) {
        return p.IPv6.isValid(c) || p.IPv4.isValid(c);
      }, p.isValidCIDR = function(c) {
        return p.IPv6.isValidCIDR(c) || p.IPv4.isValidCIDR(c);
      }, p.parse = function(c) {
        if (p.IPv6.isValid(c))
          return p.IPv6.parse(c);
        if (p.IPv4.isValid(c))
          return p.IPv4.parse(c);
        throw new Error("ipaddr: the address has neither IPv6 nor IPv4 format");
      }, p.parseCIDR = function(c) {
        try {
          return p.IPv6.parseCIDR(c);
        } catch {
          try {
            return p.IPv4.parseCIDR(c);
          } catch {
            throw new Error("ipaddr: the address has neither IPv6 nor IPv4 CIDR format");
          }
        }
      }, p.process = function(c) {
        const d = this.parse(c);
        return d.kind() === "ipv6" && d.isIPv4MappedAddress() ? d.toIPv4Address() : d;
      }, p.subnetMatch = function(c, d, y) {
        let g, v, b, C;
        y == null && (y = "unicast");
        for (v in d)
          if (Object.prototype.hasOwnProperty.call(d, v)) {
            for (b = d[v], b[0] && !(b[0] instanceof Array) && (b = [b]), g = 0; g < b.length; g++)
              if (C = b[g], c.kind() === C[0].kind() && c.match.apply(c, C))
                return v;
          }
        return y;
      }, e.exports ? e.exports = p : t.ipaddr = p;
    })(Op);
  })(Bn)), Bn.exports;
}
var Ao = Bp();
function ll(e) {
  const t = e ?? globalThis.location?.origin;
  if (!t) return null;
  try {
    return new URL(t);
  } catch {
    return null;
  }
}
function Pp(e) {
  return e.replace(/^\[/, "").replace(/\]$/, "").split("%")[0];
}
function cl(e) {
  const t = Pp(e);
  if (!t || !Ao.isValid(t))
    return !1;
  try {
    return Ao.parse(t).range() !== "unicast";
  } catch {
    return !0;
  }
}
function Np(e) {
  const t = e.trim().toLowerCase();
  return !(!t || t === "localhost" || t.endsWith(".localhost") || t.endsWith(".local") || cl(t) || !t.includes("."));
}
function Up(e) {
  const t = e.hostname.trim().toLowerCase();
  return t ? t === "localhost" || t.endsWith(".localhost") || t.endsWith(".local") ? !0 : cl(t) : !1;
}
function Mp(e, t) {
  return !!t && e.origin === t.origin;
}
function wn(e, t = {}) {
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
  const i = ll(t.currentOrigin), s = Mp(r, i) && !!i && Up(i);
  if (r.protocol === "http:") {
    if (!s)
      return null;
  } else if (r.protocol !== "https:")
    return null;
  return !s && !Np(r.hostname) ? null : (r.hash = "", r.toString());
}
function E0(e, t = {}) {
  if (!e) return !1;
  const n = wn(e, t);
  if (!n) return !1;
  const r = ll(t.currentOrigin);
  if (!r) return !1;
  try {
    return new URL(n).origin === r.origin;
  } catch {
    return !1;
  }
}
function x0(e, t = {}) {
  const n = wn(e, t);
  if (!n) return "";
  const r = new URL(n);
  return r.searchParams.set("cb", Date.now().toString()), r.toString();
}
function k0(e, t = {}) {
  const n = wn(e, t);
  if (!n) return "";
  const r = new URL(n);
  return r.searchParams.set("profile", "true"), t.forceRemote && t.navigatorOnline !== !1 ? r.searchParams.has("cb") && r.searchParams.set("cb", Date.now().toString()) : r.searchParams.delete("cb"), r.toString();
}
function A0(e, t = {}) {
  const n = wn(e, t);
  if (!n) return "";
  const r = new URL(n);
  return r.searchParams.has("profile") || r.searchParams.set("profile", "true"), r.toString();
}
class zp extends Error {
  constructor() {
    super("invalid_composer_context"), this.name = "EmbedComposerContextValidationError";
  }
}
function lt() {
  throw new zp();
}
function cn(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function Hp(e) {
  return /^[0-9a-f]{64}$/.test(e);
}
function Zr(e) {
  (typeof e != "string" || Cp(e, { relayValidation: "strict" }) === null) && lt();
}
function Io(e, t) {
  if (!Object.prototype.hasOwnProperty.call(e, t)) return;
  const n = e[t];
  n != null && (typeof n != "string" || n.trim().length === 0) && lt();
}
function Dp(e) {
  if (e != null) {
    if (cn(e) || lt(), Zr(e.reference), e.relays !== void 0) {
      Array.isArray(e.relays) || lt();
      for (const t of e.relays)
        (typeof t != "string" || dt.sanitizeExternalRelayUrls([t], { limit: 1 }).length !== 1) && lt();
    }
    Io(e, "name"), Io(e, "about");
  }
}
function I0(e) {
  if (cn(e) || lt(), e.reply !== void 0 && e.reply !== null && Zr(e.reply), e.quotes !== void 0 && e.quotes !== null) {
    Array.isArray(e.quotes) || lt();
    for (const t of e.quotes) Zr(t);
  }
  return e.content !== void 0 && e.content !== null && typeof e.content != "string" && lt(), Dp(e.channel), e;
}
function R0(e, t) {
  if (!cn(e))
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
      if (!al(s))
        continue;
      const l = xo(s);
      if (!sr(l) || rn(l) !== l.id || !lr(l) || l.id !== i || o.some(
        (a) => a.authorPubkey !== null && l.pubkey !== a.authorPubkey
      ))
        continue;
      r[i] = xo(l);
    } catch {
      continue;
    }
  return r;
}
function jp(e) {
  if (!cn(e)) return {};
  const t = {};
  for (const [n, r] of Object.entries(e)) {
    if (!Hp(n) || !cn(r)) continue;
    const i = typeof r.displayName == "string" && r.displayName.trim() || null, o = typeof r.picture == "string" ? wn(r.picture) : null;
    !i && !o || (t[n] = { displayName: i, picture: o });
  }
  return t;
}
const Vp = ":root{--app-root-height: 100%;--app-root-top: 0px;--app-root-overflow-y: visible;--app-main-height: 100svh;--app-body-position: static;--app-body-inset: auto;--app-body-width: auto;--app-overlay-position: fixed;--app-overscroll-behavior: auto;--footer-height: 66px;--footer-bottom: 0px;--keyboard-height: 0px;--mobile-dialog-viewport-top: 0px;--mobile-dialog-viewport-height: 100dvh;--mobile-dialog-center-y: 43dvh;--keyboard-button-bar-height: 50px;--keyboard-button-bar-bottom: 66px;--main-content-keyboard-adjustment: var(--keyboard-height);--reason-input-base-height: 50px;--reason-input-height: 0px;--reason-input-bottom: 116px;--main-content-top-spacing: 6px;--composer-bottom-reserved-height: 116px;--accent-color-default: hsl(152, 74%, 43%);--accent-color: var( --accent-color-forced, var(--accent-color-user, var(--accent-color-external-default, var(--accent-color-default))) );--accent-color-custom: var( --accent-color-forced, var(--accent-color-user, var(--accent-color-external-default)) );--accent-color-custom-inner: color-mix(in srgb, var(--accent-color-custom) 15%, white 85%);--accent-color-custom-face: color-mix(in srgb, var(--accent-color-custom) 40%, black 60%);--base-color: var( --base-color-forced, var(--base-color-user, var(--base-color-external-default)) );--theme: var(--accent-color);--text-black: hsl(0, 0%, 24%);--nostr-bg: hsl(270, 100%, 98%);--yellow: hsl(50, 100%, 50%);--danger: hsl(0, 84%, 60%);--darker: rgba(0, 0, 0, .8);--dark-gray: hsl(0, 0%, 66%);--light-gray: hsl(0, 0%, 83%);--base-color-surface-bg-light: color-mix(in srgb, var(--base-color) 18%, hsl(0, 0%, 97%));--base-color-surface-bg-dark: color-mix(in srgb, var(--base-color) 18%, hsl(0, 0%, 12%));--base-color-surface-editor-light: color-mix(in srgb, var(--base-color) 6%, hsl(0, 0%, 100%));--base-color-surface-editor-dark: color-mix(in srgb, var(--base-color) 9%, hsl(0, 0%, 22%));--base-color-surface-footer-light: color-mix(in srgb, var(--base-color) 34%, hsl(0, 0%, 86%));--base-color-surface-footer-dark: color-mix(in srgb, var(--base-color) 22%, hsl(0, 0%, 10%));--surface-bg: light-dark( var(--base-color-surface-bg-light, color-mix(in srgb, hsl(0, 0%, 94%) 18%, hsl(0, 0%, 94%))), var(--base-color-surface-bg-dark, color-mix(in srgb, hsl(0, 0%, 12%) 18%, hsl(0, 0%, 12%))) );--surface-input: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 100%)) 14%, hsl(0, 0%, 100%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 19%)) 14%, hsl(0, 0%, 19%)) );--surface-editor: light-dark( var(--base-color-surface-editor-light, var(--surface-input)), var(--base-color-surface-editor-dark, var(--surface-input)) );--surface-footer: light-dark( var(--base-color-surface-footer-light, color-mix(in srgb, hsl(0, 0%, 82%) 22%, hsl(0, 0%, 82%))), var(--base-color-surface-footer-dark, color-mix(in srgb, hsl(0, 0%, 10%) 22%, hsl(0, 0%, 10%))) );--surface-buttonbar: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 91%)) 20%, hsl(0, 0%, 91%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 28%)) 20%, hsl(0, 0%, 28%)) );--base-color-surface-button: color-mix(in srgb, var(--base-color) 24%, white);--surface-button: light-dark( var(--base-color-surface-button, hsl(0, 0%, 92%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 25%)) 18%, hsl(0, 0%, 25%)) );--surface-button-border: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 75%)) 24%, hsl(0, 0%, 75%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 30%)) 24%, hsl(0, 0%, 30%)) );--surface-button-preview-action: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 74%)) 22%, hsl(0, 0%, 74%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 36%)) 22%, hsl(0, 0%, 36%)) );--surface-border: light-dark( color-mix(in srgb, var(--base-color, var(--light-gray)) 24%, var(--light-gray)), color-mix(in srgb, var(--base-color, dimgray) 24%, dimgray) );--surface-border-hr: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 84%)) 20%, hsl(0, 0%, 84%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 30%)) 20%, hsl(0, 0%, 30%)) );--surface-border-hr-light: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 92%)) 16%, hsl(0, 0%, 92%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 20%)) 16%, hsl(0, 0%, 20%)) );--surface-dialog: light-dark( color-mix(in srgb, var(--base-color, white) 14%, white), color-mix(in srgb, var(--base-color, hsl(0, 0%, 14%)) 14%, hsl(0, 0%, 14%)) );--surface-window: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 95%)) 14%, hsl(0, 0%, 95%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 14%)) 14%, hsl(0, 0%, 14%)) );--bg: var(--surface-bg);--bg-input: var(--surface-input);--bg-footer: var(--surface-footer);--bg-translucent: light-dark(#EDEDEDcc, #212121cc);--bg-buttonbar: var(--surface-buttonbar);--base-color-footer-buttonbar-light: var(--base-color-surface-bg-light);--footer-buttonbar-bg: light-dark( var(--base-color-footer-buttonbar-light, var(--bg-buttonbar)), var(--bg-buttonbar) );--btn-bg: var(--surface-button);--btn-bg2: light-dark(color-mix(in srgb, var(--btn-bg), black 6%), color-mix(in srgb, var(--btn-bg), white 10%));--btn-bg3: light-dark(color-mix(in srgb, var(--btn-bg), black 11%), color-mix(in srgb, var(--btn-bg), white 20%));--btn-border: var(--surface-button-border);--btn-hover-bg: light-dark(rgba(50, 50, 50, .12), rgba(255, 255, 255, .12));--btn-post-preview-action: var(--surface-button-preview-action);--border: var(--surface-border);--border-hr: var(--surface-border-hr);--border-hr-light: var(--surface-border-hr-light);--semantic-text: light-dark(hsl(0, 0%, 24%), hsl(0, 0%, 90%));--text: var(--semantic-text);--text-light: light-dark(hsl(0, 0%, 46%), hsl(0, 0%, 75%));--text-muted: light-dark(hsl(0, 0%, 60%), hsl(0, 0%, 55%));--text-red: light-dark(hsl(0, 99%, 45%), hsl(0, 99%, 69%));--text-r: light-dark(#e6e6e6, #3D3D3D);--semantic-link: light-dark(#1a0dab, #99c3ff);--link: var(--semantic-link);--link-visited: light-dark(#681da8, #c58af9);--dialog-bg: var(--surface-dialog);--dialog-bg2: light-dark(color-mix(in srgb, var(--dialog-bg), black 6%), color-mix(in srgb, var(--dialog-bg), white 10%));--dialog-bg3: light-dark(color-mix(in srgb, var(--dialog-bg), black 11%), color-mix(in srgb, var(--dialog-bg), white 16%));--dialog-bg-overlay: light-dark(rgba(0, 0, 0, .6), rgba(0, 0, 0, .8));--window: var(--surface-window);--svg: light-dark(hsl(0, 0%, 36%), hsl(0, 0%, 90%));--svg-light: var(--text-light);--shadow: light-dark(rgba(0, 0, 0, .1), rgba(255, 255, 255, .1));--hagaki: light-dark(hsl(0, 77%, 56%), hsl(5, 99%, 71%));--hashtag-text: light-dark(#106BC7, #65B1FC);--hashtag-bg: light-dark(#106BC71a, #65B1FC1a);--toggle-bg: var(--svg);--toggle-circle: var(--dialog-bg);--message-success-bg: hsl(200, 39%, 96%);--message-success-color: hsl(210, 60%, 40%);--message-success-border: hsl(210, 48%, 70%);--message-error-bg: hsl(351, 99%, 96%);--message-error-color: hsl(351, 99%, 32%);--message-error-border: hsl(351, 99%, 70%);--message-warning-bg: hsl(38, 100%, 95%);--message-warning-color: hsl(30, 90%, 35%);--message-warning-border: hsl(38, 90%, 65%);--message-flavor-bg: hsl(125, 39%, 94%);--message-flavor-color: hsl(123, 46%, 32%);--message-flavor-border: hsl(125, 39%, 70%);--message-tips-bg: hsl(270, 50%, 96%);--message-tips-color: hsl(270, 55%, 38%);--message-tips-border: hsl(270, 45%, 70%);font-family:system-ui,-apple-system,Segoe UI,Hiragino Sans,Hiragino Kaku Gothic ProN,Meiryo,sans-serif;font-weight:400;color-scheme:light dark;color:var(--text);background-color:var(--bg);font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}*{font-family:inherit;box-sizing:border-box}html,body,#app{height:var(--app-root-height);overflow-x:hidden;overflow-y:var(--app-root-overflow-y);overscroll-behavior-y:var(--app-overscroll-behavior)}#app{position:var(--app-body-position);top:var(--app-root-top);left:0;right:0;width:var(--app-body-width)}body{margin:0;position:var(--app-body-position);inset:var(--app-body-inset);width:var(--app-body-width);color:var(--text);background-color:var(--bg);overflow-wrap:anywhere;word-break:auto-phrase;line-break:strict}a{--link-hover-color: light-dark(color-mix(in srgb, var(--link), black 30%), color-mix(in srgb, var(--link), white 30%));font-weight:500;color:var(--link);-webkit-tap-highlight-color:transparent;text-decoration:none;border-radius:6px}a:active{opacity:1}h2,h3{color:var(--text-light)}.card{padding:2em}button,[role=button],select{display:inline-flex;align-items:center;justify-content:center;height:100%;padding:0;font-size:1rem;font-weight:500;line-height:normal;color:var(--text);background-color:inherit;border:none;cursor:pointer;text-decoration:none;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;--button-selected-bg: light-dark(color-mix(in srgb, var(--btn-bg), black 18%), color-mix(in srgb, var(--btn-bg), white 22%));--button-hover-bg: light-dark(color-mix(in srgb, var(--btn-bg), black 4%), color-mix(in srgb, var(--btn-bg), white 5%));--button-hover-color: light-dark(color-mix(in srgb, var(--text), black 40%), color-mix(in srgb, var(--text), white 50%));--button-selected-hover-bg: light-dark(color-mix(in srgb, var(--btn-bg), black 20%), color-mix(in srgb, var(--btn-bg), white 30%));--button-selected-hover-color: light-dark(color-mix(in srgb, var(--text), black 20%), color-mix(in srgb, var(--text), white 30%))}:is(button,[role=button],select):disabled{opacity:.3;cursor:not-allowed}:is(button,[role=button],select):disabled.loading{opacity:1}button>*{pointer-events:none}button:active:not(:disabled),[role=button]:active{scale:.98;transition:scale .1s cubic-bezier(0,1,.5,1)}@media(prefers-reduced-motion:reduce){button:active:not(:disabled),[role=button]:active{scale:1;transition:none}}span{-webkit-tap-highlight-color:transparent}select{border-radius:6px}.svg-icon{-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-size:contain;mask-size:contain;-webkit-mask-position:center;mask-position:center;background-color:var(--svg);display:inline-block;inline-size:var(--icon-size, 28px);block-size:var(--icon-size, 28px);--icon-hover-color: light-dark(color-mix(in srgb, var(--svg), black 40%), color-mix(in srgb, var(--svg), white 50%));--icon-selected-hover-color: light-dark(color-mix(in srgb, var(--svg), black 20%), color-mix(in srgb, var(--svg), white 30%))}.tooltip-content{--tooltip-padding: 12px;--tooltip-font-size: 1rem;--tooltip-line-height: normal;--tooltip-z-index: 100;--tooltip-max-width: none;background:var(--dialog-bg);color:var(--text);border:1px solid var(--border);border-radius:6px;padding:var(--tooltip-padding);font-size:var(--tooltip-font-size);line-height:var(--tooltip-line-height);z-index:var(--tooltip-z-index);max-width:var(--tooltip-max-width)}.post-preview-tooltip-content{--tooltip-z-index: 10000;z-index:10000!important}:root:is(.light,.dark) button.selected:where(:not(:disabled)),:root:is(.light,.dark) button:where([data-state=active]){background-color:var(--button-selected-bg)}@media(hover:hover)and (pointer:fine){a:hover{text-decoration:underline}:root:is(.light,.dark) button:where(:hover:not(:disabled)),:root:is(.light,.dark) [role=button]:where(:hover:not([aria-disabled=true])),:root:is(.light,.dark) select:where(:hover:not(:disabled)){background-color:var(--button-hover-bg);color:var(--button-hover-color)}:is(:root:is(.light,.dark) button:where(:hover:not(:disabled)),:root:is(.light,.dark) [role=button]:where(:hover:not([aria-disabled=true])),:root:is(.light,.dark) select:where(:hover:not(:disabled))) .svg-icon{background-color:var(--icon-hover-color)}:root:is(.light,.dark) button.selected:where(:hover:not(:disabled)),:root:is(.light,.dark) button:where([data-state=active]:hover:not(:disabled)){background-color:var(--button-selected-hover-bg);color:var(--button-selected-hover-color)}:is(:root:is(.light,.dark) button.selected:where(:hover:not(:disabled)),:root:is(.light,.dark) button:where([data-state=active]:hover:not(:disabled))) .svg-icon{background-color:var(--icon-selected-hover-color)}:root:is(.light,.dark) a:hover{color:var(--link-hover-color)}}.setting-section{display:flex;flex-direction:column}.setting-row{display:flex;flex-direction:row;align-items:stretch;justify-content:space-between;min-height:50px}.setting-label{font-size:1rem;font-weight:500;line-height:1.3;display:flex;align-items:center;justify-content:flex-start;white-space:pre-line}.setting-control{display:flex;align-items:stretch;justify-content:flex-end;height:auto;margin-block:auto}", qp = ".pswp{--pswp-bg: #000;--pswp-placeholder-bg: #222;--pswp-root-z-index: 100000;--pswp-preloader-color: rgba(79, 79, 79, .4);--pswp-preloader-color-secondary: rgba(255, 255, 255, .9);--pswp-icon-color: #fff;--pswp-icon-color-secondary: #4f4f4f;--pswp-icon-stroke-color: #4f4f4f;--pswp-icon-stroke-width: 2px;--pswp-error-text-color: var(--pswp-icon-color)}.pswp{position:fixed;top:0;left:0;width:100%;height:100%;z-index:var(--pswp-root-z-index);display:none;touch-action:none;outline:0;opacity:.003;contain:layout style size;-webkit-tap-highlight-color:rgba(0,0,0,0)}.pswp:focus{outline:0}.pswp *{box-sizing:border-box}.pswp img{max-width:none}.pswp--open{display:block}.pswp,.pswp__bg{transform:translateZ(0);will-change:opacity}.pswp__bg{opacity:.005;background:var(--pswp-bg)}.pswp,.pswp__scroll-wrap{overflow:hidden}.pswp__scroll-wrap,.pswp__bg,.pswp__container,.pswp__item,.pswp__content,.pswp__img,.pswp__zoom-wrap{position:absolute;top:0;left:0;width:100%;height:100%}.pswp__img,.pswp__zoom-wrap{width:auto;height:auto}.pswp--click-to-zoom.pswp--zoom-allowed .pswp__img{cursor:-webkit-zoom-in;cursor:-moz-zoom-in;cursor:zoom-in}.pswp--click-to-zoom.pswp--zoomed-in .pswp__img{cursor:move;cursor:-webkit-grab;cursor:-moz-grab;cursor:grab}.pswp--click-to-zoom.pswp--zoomed-in .pswp__img:active{cursor:-webkit-grabbing;cursor:-moz-grabbing;cursor:grabbing}.pswp--no-mouse-drag.pswp--zoomed-in .pswp__img,.pswp--no-mouse-drag.pswp--zoomed-in .pswp__img:active,.pswp__img{cursor:-webkit-zoom-out;cursor:-moz-zoom-out;cursor:zoom-out}.pswp__container,.pswp__img,.pswp__button,.pswp__counter{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.pswp__item{z-index:1;overflow:hidden}.pswp__hidden{display:none!important}.pswp__content{pointer-events:none}.pswp__content>*{pointer-events:auto}.pswp__error-msg-container{display:grid}.pswp__error-msg{margin:auto;font-size:1em;line-height:1;color:var(--pswp-error-text-color)}.pswp .pswp__hide-on-close{opacity:.005;will-change:opacity;transition:opacity var(--pswp-transition-duration) cubic-bezier(.4,0,.22,1);z-index:10;pointer-events:none}.pswp--ui-visible .pswp__hide-on-close{opacity:1;pointer-events:auto}.pswp__button{position:relative;display:block;width:50px;height:60px;padding:0;margin:0;overflow:hidden;cursor:pointer;background:none;border:0;box-shadow:none;opacity:.85;-webkit-appearance:none;-webkit-touch-callout:none}.pswp__button:hover,.pswp__button:active,.pswp__button:focus{transition:none;padding:0;background:none;border:0;box-shadow:none;opacity:1}.pswp__button:disabled{opacity:.3;cursor:auto}.pswp__icn{fill:var(--pswp-icon-color);color:var(--pswp-icon-color-secondary)}.pswp__icn{position:absolute;top:14px;left:9px;width:32px;height:32px;overflow:hidden;pointer-events:none}.pswp__icn-shadow{stroke:var(--pswp-icon-stroke-color);stroke-width:var(--pswp-icon-stroke-width);fill:none}.pswp__icn:focus{outline:0}div.pswp__img--placeholder,.pswp__img--with-bg{background:var(--pswp-placeholder-bg)}.pswp__top-bar{position:absolute;left:0;top:0;width:100%;height:60px;display:flex;flex-direction:row;justify-content:flex-end;z-index:10;pointer-events:none!important}.pswp__top-bar>*{pointer-events:auto;will-change:opacity}.pswp__button--close{margin-right:6px}.pswp__button--arrow{position:absolute;width:75px;height:100px;top:50%;margin-top:-50px}.pswp__button--arrow:disabled{display:none;cursor:default}.pswp__button--arrow .pswp__icn{top:50%;margin-top:-30px;width:60px;height:60px;background:none;border-radius:0}.pswp--one-slide .pswp__button--arrow{display:none}.pswp--touch .pswp__button--arrow{visibility:hidden}.pswp--has_mouse .pswp__button--arrow{visibility:visible}.pswp__button--arrow--prev{right:auto;left:0}.pswp__button--arrow--next{right:0}.pswp__button--arrow--next .pswp__icn{left:auto;right:14px;transform:scaleX(-1)}.pswp__button--zoom{display:none}.pswp--zoom-allowed .pswp__button--zoom{display:block}.pswp--zoomed-in .pswp__zoom-icn-bar-v{display:none}.pswp__preloader{position:relative;overflow:hidden;width:50px;height:60px;margin-right:auto}.pswp__preloader .pswp__icn{opacity:0;transition:opacity .2s linear;animation:pswp-clockwise .6s linear infinite}.pswp__preloader--active .pswp__icn{opacity:.85}@keyframes pswp-clockwise{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.pswp__counter{height:30px;margin-top:15px;margin-inline-start:20px;font-size:14px;line-height:30px;color:var(--pswp-icon-color);text-shadow:1px 1px 3px var(--pswp-icon-color-secondary);opacity:.85}.pswp--one-slide .pswp__counter{display:none}", Ro = "ehagaki-composer", Fp = 1;
function Kp(e) {
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
const Zp = "--ehagaki-icon-", Wp = /--ehagaki-icon-([0-9a-f]+)/g;
function Gp(e) {
  if (e.length === 0 || e.length % 2 !== 0) return null;
  const t = Array.from(
    { length: e.length / 2 },
    (n, r) => String.fromCharCode(
      Number.parseInt(e.slice(r * 2, r * 2 + 2), 16)
    )
  ).join("");
  return /^[A-Za-z0-9._-]+\.svg$/.test(t) ? t : null;
}
function So(e, t, n) {
  const r = /* @__PURE__ */ new Set();
  for (const i of e.querySelectorAll("style"))
    for (const o of i.textContent?.matchAll(Wp) ?? [])
      r.add(o[0]);
  for (const i of r) {
    const o = Gp(i.slice(Zp.length));
    o && t.style.setProperty(
      i,
      `url("${new URL(`icons/${o}`, n).href}")`
    );
  }
}
let Yt = null;
function Le(e, t) {
  const n = new Error(t);
  return n.name = e, n;
}
function ul(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function Yp(e) {
  return !ul(e) || !Object.hasOwn(e, "preloadedProfiles") ? e : {
    ...e,
    preloadedProfiles: jp(e.preloadedProfiles)
  };
}
function Xp(e) {
  if (!ul(e))
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
function Jp(e) {
  return e.replaceAll(/:root:is\(\s*\.light\s*,\s*\.dark\s*\)/g, ":host(:is(.light, .dark))").replaceAll(":root", ":host").replace(`html,
body,
#app`, `:host,
.ehagaki-web-component-shell`).replace("#app {", ".ehagaki-web-component-shell {").replace("body {", ".ehagaki-web-component-shell {");
}
function Qp() {
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
let eg = class extends HTMLElement {
  static get observedAttributes() {
    return ["asset-base", "auto-login"];
  }
  #e = null;
  #t = null;
  #o = null;
  #p = null;
  #i = null;
  #l = this.createReadyPromise();
  #n = "pending";
  #r = !1;
  #c = null;
  #s = Promise.resolve();
  #a = 0;
  #u = null;
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
    if (this.onConnectionAttempt(), this.#c = null, this.#r = !1, this.#o) return;
    const t = this.getConnectionError();
    if (t) {
      const n = Le(t.code, t.message);
      this.fail("initialization_failed", n.message, n);
      return;
    }
    if (Yt && Yt !== this) {
      const n = Le(
        "multiple_instances_unsupported",
        "Only one ehagaki-composer can be connected in a document."
      );
      this.fail("multiple_instances_unsupported", n.message, n);
      return;
    }
    this.#n !== "pending" && (this.#l = this.createReadyPromise(), this.#n = "pending"), Yt = this, this.#o = this.mountApp();
  }
  disconnectedCallback() {
    this.#a += 1, this.#c = null, this.#r = !1, this.onDisconnected(), this.#u?.disconnect(), this.#u = null, Yt === this && (Yt = null), this.#t && (ms(this.#t), this.#t = null), this.#e = null, this.#o = null, this.#n === "pending" && (this.#n = "rejected", this.#i?.(Le("disconnected", "Component was disconnected before it became ready.")));
  }
  whenReady() {
    return this.#l;
  }
  setContext(t) {
    const n = Yp(t);
    return this.enqueue(async () => {
      await this.requireApp().setEmbedContext(n);
    });
  }
  setSettings(t) {
    return this.enqueue(async () => this.requireApp().setEmbedSettings(Xp(t)));
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
      this.#p = t, this.#i = n;
    });
  }
  async mountApp() {
    const t = ++this.#a;
    try {
      const n = this.shadowRoot ?? this.attachShadow({ mode: "open" });
      n.replaceChildren();
      const r = document.createElement("style");
      r.textContent = `${Jp(Vp)}
${qp}
${Qp()}`;
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
      this.#u = new MutationObserver(() => {
        So(n, i, l);
      }), this.#u.observe(n, {
        childList: !0,
        subtree: !0
      }), jc({
        storage: zc(window.localStorage),
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
      if (!this.isConnected || t !== this.#a || (this.#t = ri(a, {
        target: o,
        props: {
          notificationPort: Kp(this),
          onInitialized: () => {
            this.#d(t);
          },
          ...this.getAdditionalMountProps(t),
          onEditorEmptyChange: (u) => {
            this.#h(t, u);
          }
        }
      }), So(n, i, l), this.#e = this.#t, !this.isConnected || t !== this.#a)) return;
    } catch {
      if (!this.isConnected || t !== this.#a) return;
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
    !this.isConnected || t !== this.#a || this.#n !== "pending" || this.fail("initialization_failed", "eHagaki Composer could not be initialized.");
  }
  enqueue(t) {
    const n = this.#s.then(async () => (await this.whenReady(), t()));
    return this.#s = n.then(() => {
    }, () => {
    }), n;
  }
  #d(t) {
    !this.isConnected || t !== this.#a || (this.#r = !0, this.#f(t));
  }
  #h(t, n) {
    if (!(!this.isConnected || t !== this.#a || typeof n != "boolean")) {
      if (this.#c === n) {
        this.#f(t);
        return;
      }
      this.#c = n, this.dispatchSafeEvent("ehagaki-editor-empty-change", { isEmpty: n }), this.#f(t);
    }
  }
  #f(t) {
    !this.isConnected || t !== this.#a || !this.#r || this.#c === null || this.#n !== "pending" || (this.#n = "resolved", this.#p?.(), this.dispatchSafeEvent("ehagaki-ready", { apiVersion: Fp }));
  }
  fail(t, n, r = Le(t, n)) {
    this.#n = "rejected", this.#i?.(r), this.dispatchSafeEvent("ehagaki-initialization-error", { code: t, message: n });
  }
};
class Pn extends TypeError {
  constructor(t) {
    super(t), this.name = "HostRelayConfigError";
  }
}
function tg(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function ng(e) {
  if (!Array.isArray(e) || e.length === 0)
    throw new Pn("Host relay config must be a non-empty array.");
  const t = {};
  for (const n of e) {
    if (!tg(n) || Object.keys(n).some((i) => i !== "url" && i !== "read" && i !== "write") || typeof n.url != "string" || typeof n.read != "boolean" || typeof n.write != "boolean" || !n.read && !n.write)
      throw new Pn("Host relay config contains an invalid entry.");
    const r = dt.normalizeExternalRelayUrl(n.url);
    if (!r || r in t)
      throw new Pn("Host relay config contains an invalid or duplicate URL.");
    t[r] = { read: n.read, write: n.write };
  }
  return t;
}
function rg(e) {
  return Array.isArray(e) ? e.map((t) => ({
    url: dt.normalizeRelayUrl(t),
    read: !0,
    write: !0
  })) : Object.entries(e).map(([t, n]) => ({
    url: dt.normalizeRelayUrl(t),
    read: n.read,
    write: n.write
  }));
}
class ig extends eg {
  #e;
  #t = null;
  /**
   * A mount-scoped, nonpersistent default Relay Config for the Full embed.
   * Assign before connection; later assignments are retained for a recreated
   * element and never mutate an active Nostr session.
   */
  get relays() {
    return this.#e ? rg(this.#e) : void 0;
  }
  set relays(t) {
    if (t === void 0) {
      this.#e = void 0, this.#t = null;
      return;
    }
    try {
      this.#e = ng(t), this.#t = null;
    } catch (n) {
      this.#e = void 0, this.#t = n instanceof Pn ? n.message : "Invalid relays property.";
    }
  }
  loadApp() {
    return import("./App-CT56EfFO.js").then((t) => t.et);
  }
  getConnectionError() {
    return this.#t ? {
      code: "initialization_failed",
      message: this.#t
    } : super.getConnectionError();
  }
  getAdditionalMountProps(t) {
    return {
      ...this.#e ? { hostRelayConfig: this.#e } : {},
      onPostComponentLoadFailure: () => this.notifyPostComponentLoadFailure(t)
    };
  }
}
const $o = Symbol.for("ehagaki-composer.distribution");
function og(e, t) {
  const n = globalThis, r = n[$o];
  if (r && r !== e)
    throw new Error(
      `Cannot import the ${e} eHagaki Composer distribution after ${r} in the same document.`
    );
  n[$o] = e;
  const i = customElements.get(Ro);
  if (!i) {
    customElements.define(Ro, t);
    return;
  }
  if (i !== t)
    throw new Error("ehagaki-composer is already defined by a different distribution.");
}
og("full", ig);
export {
  st as $,
  Ag as A,
  $e as B,
  bn as C,
  yg as D,
  sn as E,
  jn as F,
  ag as G,
  dg as H,
  Bg as I,
  hl as J,
  pg as K,
  vg as L,
  hn as M,
  gg as N,
  Be as O,
  be as P,
  ot as Q,
  Pe as R,
  wg as S,
  ac as T,
  Ye as U,
  jt as V,
  Bo as W,
  dn as X,
  Po as Y,
  Fg as Z,
  O as _,
  qe as a,
  Wg as a$,
  gc as a0,
  ts as a1,
  xg as a2,
  kg as a3,
  Qn as a4,
  Ht as a5,
  Oo as a6,
  fg as a7,
  Qg as a8,
  qg as a9,
  mt as aA,
  Qr as aB,
  ct as aC,
  sg as aD,
  ml as aE,
  Ot as aF,
  hg as aG,
  mg as aH,
  bg as aI,
  Xt as aJ,
  _g as aK,
  Eg as aL,
  kl as aM,
  jg as aN,
  Ia as aO,
  vi as aP,
  Nc as aQ,
  Og as aR,
  Xe as aS,
  Et as aT,
  tn as aU,
  Yl as aV,
  t0 as aW,
  Tg as aX,
  $g as aY,
  Cg as aZ,
  Vg as a_,
  os as aa,
  Gg as ab,
  Kg as ac,
  El as ad,
  xl as ae,
  Ig as af,
  Pg as ag,
  Dg as ah,
  ec as ai,
  lg as aj,
  _l as ak,
  Ul as al,
  pl as am,
  ug as an,
  Yg as ao,
  r0 as ap,
  i0 as aq,
  vs as ar,
  Hg as as,
  Jg as at,
  te as au,
  Xg as av,
  In as aw,
  lc as ax,
  ce as ay,
  qi as az,
  et as b,
  b0 as b$,
  Vl as b0,
  a0 as b1,
  Ug as b2,
  Sc as b3,
  ql as b4,
  Vo as b5,
  u0 as b6,
  l0 as b7,
  Ng as b8,
  Rg as b9,
  Ah as bA,
  Ao as bB,
  p0 as bC,
  n0 as bD,
  A0 as bE,
  E0 as bF,
  wn as bG,
  d0 as bH,
  h0 as bI,
  k0 as bJ,
  x0 as bK,
  sr as bL,
  rn as bM,
  lr as bN,
  al as bO,
  xo as bP,
  y0 as bQ,
  Cp as bR,
  _0 as bS,
  m0 as bT,
  I0 as bU,
  R0 as bV,
  jp as bW,
  g0 as bX,
  Xn as bY,
  w0 as bZ,
  v0 as b_,
  o0 as ba,
  Lg as bb,
  ri as bc,
  ms as bd,
  uc as be,
  Mg as bf,
  e0 as bg,
  s0 as bh,
  c0 as bi,
  Hl as bj,
  dt as bk,
  f0 as bl,
  ui as bm,
  G as bn,
  sf as bo,
  Me as bp,
  Mu as bq,
  ua as br,
  ft as bs,
  he as bt,
  Zt as bu,
  Wt as bv,
  V as bw,
  af as bx,
  yn as by,
  wf as bz,
  Zg as c,
  il as c0,
  Fp as c1,
  Ro as c2,
  ig as c3,
  Un as d,
  Se as e,
  Ge as f,
  Co as g,
  pt as h,
  fl as i,
  U as j,
  yc as k,
  zg as l,
  oc as m,
  wl as n,
  gl as o,
  Sn as p,
  J as q,
  vl as r,
  jl as s,
  rs as t,
  bc as u,
  M as v,
  hc as w,
  Gr as x,
  Sg as y,
  Dl as z
};
