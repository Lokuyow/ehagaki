var Ha = Array.isArray, ja = Array.prototype.indexOf, Nt = Array.prototype.includes, qa = Array.from, Tn = Object.keys, Cn = Object.defineProperty, Ct = Object.getOwnPropertyDescriptor, Va = Object.getOwnPropertyDescriptors, Fa = Object.prototype, Ka = Array.prototype, po = Object.getPrototypeOf, Bi = Object.isExtensible;
function xp(e) {
  return typeof e == "function";
}
const Za = () => {
};
function Ga(e) {
  for (var t = 0; t < e.length; t++)
    e[t]();
}
function go() {
  var e, t, n = new Promise((r, i) => {
    e = r, t = i;
  });
  return { promise: n, resolve: e, reject: t };
}
const ie = 2, Ut = 4, rn = 8, Mr = 1 << 24, ke = 16, Ie = 32, Ke = 64, vr = 128, we = 512, Q = 1024, re = 2048, Ne = 4096, ve = 8192, Oe = 16384, ut = 32768, Oi = 1 << 25, en = 65536, Ln = 1 << 17, Wa = 1 << 18, xt = 1 << 19, bo = 1 << 20, kp = 1 << 25, _t = 65536, Bn = 1 << 21, Lt = 1 << 22, rt = 1 << 23, wt = Symbol("$state"), Ya = Symbol("legacy props"), Ap = Symbol(""), Xa = Symbol("attributes"), Ja = Symbol("class"), Qa = Symbol("style"), yr = Symbol("text"), yn = Symbol("form reset"), Vn = new class extends Error {
  name = "StaleReactionError";
  message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), Rp = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml")
), $p = 1, on = 3, sn = 8;
function el(e) {
  throw new Error("https://svelte.dev/e/lifecycle_outside_component");
}
function tl() {
  throw new Error("https://svelte.dev/e/async_derived_orphan");
}
function Tp(e, t, n) {
  throw new Error("https://svelte.dev/e/each_key_duplicate");
}
function nl(e) {
  throw new Error("https://svelte.dev/e/effect_in_teardown");
}
function rl() {
  throw new Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function il(e) {
  throw new Error("https://svelte.dev/e/effect_orphan");
}
function ol() {
  throw new Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function sl() {
  throw new Error("https://svelte.dev/e/hydration_failed");
}
function Cp(e) {
  throw new Error("https://svelte.dev/e/props_invalid_value");
}
function al() {
  throw new Error("https://svelte.dev/e/state_descriptors_fixed");
}
function ll() {
  throw new Error("https://svelte.dev/e/state_prototype_fixed");
}
function cl() {
  throw new Error("https://svelte.dev/e/state_unsafe_mutation");
}
function ul() {
  throw new Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
const Lp = 1, Bp = 2, Op = 4, Ip = 8, Np = 16, Up = 1, Mp = 4, zp = 8, Dp = 16, fl = 1, dl = 2, wo = "[", vo = "[!", Ii = "[?", yo = "]", Mt = {}, te = Symbol(), hl = "http://www.w3.org/1999/xhtml", Pp = "http://www.w3.org/2000/svg", Hp = "http://www.w3.org/1998/Math/MathML", jp = "@attach";
function pl() {
  console.warn("https://svelte.dev/e/derived_inert");
}
function Fn(e) {
  console.warn("https://svelte.dev/e/hydration_mismatch");
}
function qp() {
  console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function gl() {
  console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
let X = !1;
function dn(e) {
  X = e;
}
let M;
function $e(e) {
  if (e === null)
    throw Fn(), Mt;
  return M = e;
}
function zr() {
  return $e(/* @__PURE__ */ We(M));
}
function Vp(e) {
  if (X) {
    if (/* @__PURE__ */ We(M) !== null)
      throw Fn(), Mt;
    M = e;
  }
}
function bl(e = 1) {
  if (X) {
    for (var t = e, n = M; t--; )
      n = /** @type {TemplateNode} */
      /* @__PURE__ */ We(n);
    M = n;
  }
}
function wl(e = !0) {
  for (var t = 0, n = M; ; ) {
    if (n.nodeType === sn) {
      var r = (
        /** @type {Comment} */
        n.data
      );
      if (r === yo) {
        if (t === 0) return n;
        t -= 1;
      } else (r === wo || r === vo || // "[1", "[2", etc. for if blocks
      r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
    }
    var i = (
      /** @type {TemplateNode} */
      /* @__PURE__ */ We(n)
    );
    e && n.remove(), n = i;
  }
}
function Fp(e) {
  if (!e || e.nodeType !== sn)
    throw Fn(), Mt;
  return (
    /** @type {Comment} */
    e.data
  );
}
function mo(e) {
  return e === this.v;
}
function vl(e, t) {
  return e != e ? t == t : e !== t || e !== null && typeof e == "object" || typeof e == "function";
}
function _o(e) {
  return !vl(e, this.v);
}
let ae = null;
function zt(e) {
  ae = e;
}
function Kp(e) {
  return (
    /** @type {T} */
    Kn().get(e)
  );
}
function Zp(e, t) {
  return Kn().set(e, t), t;
}
function Gp(e) {
  return Kn().has(e);
}
function Wp() {
  return Kn();
}
function yl(e, t = !1, n) {
  ae = {
    p: ae,
    i: !1,
    c: null,
    e: null,
    s: e,
    x: null,
    r: (
      /** @type {Effect} */
      L
    ),
    l: null
  };
}
function ml(e) {
  var t = (
    /** @type {ComponentContext} */
    ae
  ), n = t.e;
  if (n !== null) {
    t.e = null;
    for (var r of n)
      jo(r);
  }
  return e !== void 0 && (t.x = e), t.i = !0, ae = t.p, e ?? /** @type {T} */
  {};
}
function Eo() {
  return !0;
}
function Kn(e) {
  return ae === null && el(), ae.c ??= new Map(_l(ae) || void 0);
}
function _l(e) {
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
function xo() {
  var e = ht;
  ht = [], Ga(e);
}
function it(e) {
  if (ht.length === 0 && !Xt) {
    var t = ht;
    queueMicrotask(() => {
      t === ht && xo();
    });
  }
  ht.push(e);
}
function El() {
  for (; ht.length > 0; )
    xo();
}
function ko(e) {
  var t = L;
  if (t === null)
    return O.f |= rt, e;
  if ((t.f & ut) === 0 && (t.f & Ut) === 0)
    throw e;
  tt(e, t);
}
function tt(e, t) {
  for (; t !== null; ) {
    if ((t.f & vr) !== 0) {
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
const xl = -7169;
function Z(e, t) {
  e.f = e.f & xl | t;
}
function Dr(e) {
  (e.f & we) !== 0 || e.deps === null ? Z(e, Q) : Z(e, Ne);
}
function Ao(e) {
  if (e !== null)
    for (const t of e)
      (t.f & ie) === 0 || (t.f & _t) === 0 || (t.f ^= _t, Ao(
        /** @type {Derived} */
        t.deps
      ));
}
function So(e, t, n) {
  (e.f & re) !== 0 ? t.add(e) : (e.f & Ne) !== 0 && n.add(e), Ao(e.deps), Z(e, Q);
}
let rr = null, At = null, U = null, mr = null, Ae = null, _r = null, Xt = !1, ir = !1, $t = null, mn = null;
var Ni = 0;
let kl = 1;
class Ze {
  id = kl++;
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
        Z(i, re), n(i);
      for (i of r.m)
        Z(i, Ne), n(i);
    }
    this.#f.add(t);
  }
  #b() {
    if (this.#e = !0, Ni++ > 1e3 && (this.#m(), Al()), !this.#_()) {
      for (const a of this.#u)
        this.#d.delete(a), Z(a, re), this.schedule(a);
      for (const a of this.#d)
        Z(a, Ne), this.schedule(a);
    }
    const t = this.#s;
    this.#s = [], this.apply();
    var n = $t = [], r = [], i = mn = [];
    for (const a of t)
      try {
        this.#E(a, n, r);
      } catch (c) {
        throw Co(a), c;
      }
    if (U = null, i.length > 0) {
      var o = Ze.ensure();
      for (const a of i)
        o.schedule(a);
    }
    if ($t = null, mn = null, this.#_()) {
      this.#g(r), this.#g(n);
      for (const [a, c] of this.#h)
        To(a, c);
      i.length > 0 && /** @type {unknown} */
      U.#b();
      return;
    }
    const s = this.#x();
    if (s) {
      s.#v(this);
      return;
    }
    this.#u.clear(), this.#d.clear();
    for (const a of this.#p) a(this);
    this.#p.clear(), mr = this, Ui(r), Ui(n), mr = null, this.#c?.resolve();
    var l = (
      /** @type {Batch | null} */
      /** @type {unknown} */
      U
    );
    if (this.linked && this.#n === 0 && this.#m(), this.#s.length > 0) {
      l === null && (l = this, this.#y());
      const a = l;
      a.#s.push(...this.#s.filter((c) => !a.#s.includes(c)));
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
  #E(t, n, r) {
    t.f ^= Q;
    for (var i = t.first; i !== null; ) {
      var o = i.f, s = (o & (Ie | Ke)) !== 0, l = s && (o & Q) !== 0, a = l || (o & ve) !== 0 || this.#h.has(i);
      if (!a && i.fn !== null) {
        s ? i.f ^= Q : (o & Ut) !== 0 ? n.push(i) : ln(i) && ((o & ke) !== 0 && this.#d.add(i), Pt(i));
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
            o & (Lt | ke) && !this.async_deriveds.has(s) && (this.#d.delete(s), Z(s, re), this.schedule(s));
          }
        }
    };
    for (const r of this.current.keys())
      n(r);
    this.oncommit(() => t.discard()), t.#m(), U = this, this.#b();
  }
  /**
   * @param {Effect[]} effects
   */
  #g(t) {
    for (var n = 0; n < t.length; n += 1)
      So(t[n], this.#u, this.#d);
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
    U = this;
  }
  deactivate() {
    U = null, Ae = null;
  }
  flush() {
    try {
      ir = !0, U = this, this.#b();
    } finally {
      Ni = 0, _r = null, $t = null, mn = null, ir = !1, U = null, Ae = null, vt.clear();
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
    for (let u = rr; u !== null; u = u.#o) {
      var t = u.id < this.id, n = [];
      for (const [f, [d, h]] of this.current) {
        if (u.current.has(f)) {
          var r = (
            /** @type {[any, boolean]} */
            u.current.get(f)[0]
          );
          if (t && d !== r)
            u.current.set(f, [d, h]);
          else
            continue;
        }
        n.push(f);
      }
      if (t)
        for (const [f, d] of this.async_deriveds) {
          const h = u.async_deriveds.get(f);
          h && d.promise.then(h.resolve);
        }
      if (u.#e) {
        var i = [...u.current.keys()].filter((f) => !this.current.has(f));
        if (i.length === 0)
          t && u.discard();
        else if (n.length > 0) {
          if (t)
            for (const f of this.#f)
              u.unskip_effect(f, (d) => {
                (d.f & (ke | Lt)) !== 0 ? u.schedule(d) : u.#g([d]);
              });
          u.activate();
          var o = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map();
          for (var l of n)
            $o(l, i, o, s);
          s = /* @__PURE__ */ new Map();
          var a = [...u.current.keys()].filter(
            (f) => this.current.has(f) ? (
              /** @type {[any, boolean]} */
              this.current.get(f)[0] !== f.v
            ) : !0
          );
          if (a.length > 0)
            for (const f of this.#a)
              (f.f & (Oe | ve | Ln)) === 0 && Pr(f, a, s) && ((f.f & (Lt | ke)) !== 0 ? (Z(f, re), u.schedule(f)) : u.#u.add(f));
          if (u.#s.length > 0) {
            u.apply();
            for (var c of u.#s)
              u.#E(c, [], []);
            u.#s = [];
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
    this.#w || (this.#w = !0, it(() => {
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
    return (this.#c ??= go()).promise;
  }
  static ensure() {
    if (U === null) {
      const t = U = new Ze();
      t.#y(), !ir && !Xt && it(() => {
        t.#e || t.flush();
      });
    }
    return U;
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
    if (_r = t, t.b?.is_pending && (t.f & (Ut | rn | Mr)) !== 0 && (t.f & ut) === 0) {
      t.b.defer_effect(t);
      return;
    }
    for (var n = t; n.parent !== null; ) {
      n = n.parent;
      var r = n.f;
      if ($t !== null && n === L && (O === null || (O.f & ie) === 0))
        return;
      if ((r & (Ke | Ie)) !== 0) {
        if ((r & Q) === 0)
          return;
        n.f ^= Q;
      }
    }
    this.#s.push(n);
  }
  #y() {
    At === null ? rr = At = this : (At.#o = this, this.#t = At), At = this;
  }
  #m() {
    var t = this.#t, n = this.#o;
    t === null ? rr = n : t.#o = n, n === null ? At = t : n.#t = t, this.linked = !1;
  }
}
function Ro(e) {
  var t = Xt;
  Xt = !0;
  try {
    for (var n; ; ) {
      if (El(), U === null)
        return (
          /** @type {T} */
          n
        );
      U.flush();
    }
  } finally {
    Xt = t;
  }
}
function Al() {
  try {
    ol();
  } catch (e) {
    tt(e, _r);
  }
}
let He = null;
function Ui(e) {
  var t = e.length;
  if (t !== 0) {
    for (var n = 0; n < t; ) {
      var r = e[n++];
      if ((r.f & (Oe | ve)) === 0 && ln(r) && (He = /* @__PURE__ */ new Set(), Pt(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Fo(r), He?.size > 0)) {
        vt.clear();
        for (const i of He) {
          if ((i.f & (Oe | ve)) !== 0) continue;
          const o = [i];
          let s = i.parent;
          for (; s !== null; )
            He.has(s) && (He.delete(s), o.push(s)), s = s.parent;
          for (let l = o.length - 1; l >= 0; l--) {
            const a = o[l];
            (a.f & (Oe | ve)) === 0 && Pt(a);
          }
        }
        He.clear();
      }
    }
    He = null;
  }
}
function $o(e, t, n, r) {
  if (!n.has(e) && (n.add(e), e.reactions !== null))
    for (const i of e.reactions) {
      const o = i.f;
      (o & ie) !== 0 ? $o(
        /** @type {Derived} */
        i,
        t,
        n,
        r
      ) : (o & (Lt | ke)) !== 0 && (o & re) === 0 && Pr(i, t, r) && (Z(i, re), Hr(
        /** @type {Effect} */
        i
      ));
    }
}
function Pr(e, t, n) {
  const r = n.get(e);
  if (r !== void 0) return r;
  if (e.deps !== null)
    for (const i of e.deps) {
      if (Nt.call(t, i))
        return !0;
      if ((i.f & ie) !== 0 && Pr(
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
function Hr(e) {
  U.schedule(e);
}
function To(e, t) {
  if (!((e.f & Ie) !== 0 && (e.f & Q) !== 0)) {
    (e.f & re) !== 0 ? t.d.push(e) : (e.f & Ne) !== 0 && t.m.push(e), Z(e, Q);
    for (var n = e.first; n !== null; )
      To(n, t), n = n.next;
  }
}
function Co(e) {
  Z(e, Q);
  for (var t = e.first; t !== null; )
    Co(t), t = t.next;
}
function Sl(e) {
  let t = 0, n = an(0), r;
  return () => {
    Vr() && (qe(n), qo(() => (t === 0 && (r = Wl(() => e(() => Jt(n)))), t += 1, () => {
      it(() => {
        t -= 1, t === 0 && (r?.(), r = void 0, Jt(n));
      });
    })));
  };
}
var Rl = en | xt;
function $l(e, t, n, r) {
  new Tl(e, t, n, r);
}
class Tl {
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
  #t = X ? M : null;
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
  #w = Sl(() => (this.#f = an(this.#s), () => {
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
        L
      );
      s.b = this, s.f |= vr, r(o);
    }, this.parent = /** @type {Effect} */
    L.b, this.transform_error = i ?? this.parent?.transform_error ?? ((o) => o), this.#i = ql(() => {
      if (X) {
        const o = (
          /** @type {Comment} */
          this.#t
        );
        zr();
        const s = o.data === vo;
        if (o.data.startsWith(Ii)) {
          const a = JSON.parse(o.data.slice(Ii.length));
          this.#b(a);
        } else s ? this.#E() : this.#_();
      } else
        this.#x();
    }, Rl), X && (this.#e = M);
  }
  #_() {
    try {
      this.#l = ft(() => this.#p(this.#e));
    } catch (t) {
      this.error(t);
    }
  }
  /**
   * @param {unknown} error The deserialized error from the server's hydration comment
   */
  #b(t) {
    const n = this.#o.failed;
    n && (this.#r = ft(() => {
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
    t && (this.is_pending = !0, this.#n = ft(() => t(this.#e)), it(() => {
      var n = this.#c = document.createDocumentFragment(), r = Ge();
      n.append(r), this.#l = this.#g(() => ft(() => this.#p(r))), this.#a === 0 && (this.#e.before(n), this.#c = null, _n(
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
      if (this.is_pending = this.has_pending_snippet(), this.#a = 0, this.#s = 0, this.#l = ft(() => {
        this.#p(this.#e);
      }), this.#a > 0) {
        var t = this.#c = document.createDocumentFragment();
        Kl(this.#l, t);
        const n = (
          /** @type {(anchor: Node) => void} */
          this.#o.pending
        );
        this.#n = ft(() => n(this.#e));
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
    So(t, this.#d, this.#h);
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
    var n = L, r = O, i = ae;
    Ue(this.#i), me(this.#i), zt(this.#i.ctx);
    try {
      return Ze.ensure(), t();
    } catch (o) {
      return ko(o), null;
    } finally {
      Ue(n), me(r), zt(i);
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
    this.#a += t, this.#a === 0 && (this.#v(n), this.#n && _n(this.#n, () => {
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
    this.#k(t, n), this.#s += t, !(!this.#f || this.#u) && (this.#u = !0, it(() => {
      this.#u = !1, this.#f && Nn(this.#f, this.#s);
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
      this.#y(t);
    })) : this.#y(t);
  }
  /**
   * @param {unknown} error
   */
  #y(t) {
    this.#l && (Re(this.#l), this.#l = null), this.#n && (Re(this.#n), this.#n = null), this.#r && (Re(this.#r), this.#r = null), X && ($e(
      /** @type {TemplateNode} */
      this.#t
    ), bl(), $e(wl()));
    var n = this.#o.onerror;
    let r = this.#o.failed;
    var i = !1, o = !1;
    const s = () => {
      if (i) {
        gl();
        return;
      }
      i = !0, o && ul(), this.#r !== null && _n(this.#r, () => {
        this.#r = null;
      }), this.#g(() => {
        this.#x();
      });
    }, l = (a) => {
      try {
        o = !0, n?.(a, s), o = !1;
      } catch (c) {
        tt(c, this.#i && this.#i.parent);
      }
      r && (this.#r = this.#g(() => {
        try {
          return ft(() => {
            var c = (
              /** @type {Effect} */
              L
            );
            c.b = this, c.f |= vr, r(
              this.#e,
              () => a,
              () => s
            );
          });
        } catch (c) {
          return tt(
            c,
            /** @type {Effect} */
            this.#i.parent
          ), null;
        }
      }));
    };
    it(() => {
      var a;
      try {
        a = this.transform_error(t);
      } catch (c) {
        tt(c, this.#i && this.#i.parent);
        return;
      }
      a !== null && typeof a == "object" && typeof /** @type {any} */
      a.then == "function" ? a.then(
        l,
        /** @param {unknown} e */
        (c) => tt(c, this.#i && this.#i.parent)
      ) : l(a);
    });
  }
}
function Cl(e, t, n, r) {
  const i = jr;
  var o = e.filter((d) => !d.settled);
  if (n.length === 0 && o.length === 0) {
    r(t.map(i));
    return;
  }
  var s = (
    /** @type {Effect} */
    L
  ), l = Ll(), a = o.length === 1 ? o[0].promise : o.length > 1 ? Promise.all(o.map((d) => d.promise)) : null;
  function c(d) {
    if ((s.f & Oe) === 0) {
      l();
      try {
        r(d);
      } catch (h) {
        tt(h, s);
      }
      On();
    }
  }
  var u = Lo();
  if (n.length === 0) {
    a.then(() => c(t.map(i))).finally(u);
    return;
  }
  function f() {
    Promise.all(n.map((d) => /* @__PURE__ */ Bl(d))).then((d) => c([...t.map(i), ...d])).catch((d) => tt(d, s)).finally(u);
  }
  a ? a.then(() => {
    l(), f(), On();
  }) : f();
}
function Ll() {
  var e = (
    /** @type {Effect} */
    L
  ), t = O, n = ae, r = (
    /** @type {Batch} */
    U
  );
  return function(o = !0) {
    Ue(e), me(t), zt(n), o && (e.f & Oe) === 0 && (r?.activate(), r?.apply());
  };
}
function On(e = !0) {
  Ue(null), me(null), zt(null), e && U?.deactivate();
}
function Lo() {
  var e = (
    /** @type {Effect} */
    L
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
function jr(e) {
  var t = ie | re;
  return L !== null && (L.f |= xt), {
    ctx: ae,
    deps: null,
    effects: null,
    equals: mo,
    f: t,
    fn: e,
    reactions: null,
    rv: 0,
    v: (
      /** @type {V} */
      te
    ),
    wv: 0,
    parent: L,
    ac: null
  };
}
const hn = Symbol("obsolete");
// @__NO_SIDE_EFFECTS__
function Bl(e, t, n) {
  let r = (
    /** @type {Effect | null} */
    L
  );
  r === null && tl();
  var i = (
    /** @type {Promise<V>} */
    /** @type {unknown} */
    void 0
  ), o = an(
    /** @type {V} */
    te
  ), s = !O, l = /* @__PURE__ */ new Set();
  return jl(() => {
    var a = (
      /** @type {Effect} */
      L
    ), c = go();
    i = c.promise;
    try {
      Promise.resolve(e()).then(c.resolve, (h) => {
        h !== Vn && c.reject(h);
      }).finally(On);
    } catch (h) {
      c.reject(h), On();
    }
    var u = (
      /** @type {Batch} */
      U
    );
    if (s) {
      if ((a.f & ut) !== 0)
        var f = Lo();
      if (
        /** @type {Boundary} */
        r.b.is_rendered()
      )
        u.async_deriveds.get(a)?.reject(hn);
      else
        for (const h of l.values())
          h.reject(hn);
      l.add(c), u.async_deriveds.set(a, c);
    }
    const d = (h, p = void 0) => {
      f?.(), l.delete(c), p !== hn && (u.activate(), p ? (o.f |= rt, Nn(o, p)) : ((o.f & rt) !== 0 && (o.f ^= rt), Nn(o, h)), u.deactivate());
    };
    c.promise.then(d, (h) => d(null, h || "unknown"));
  }), Ho(() => {
    for (const a of l)
      a.reject(hn);
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
function Yp(e) {
  const t = /* @__PURE__ */ jr(e);
  return Go(t), t;
}
// @__NO_SIDE_EFFECTS__
function Xp(e) {
  const t = /* @__PURE__ */ jr(e);
  return t.equals = _o, t;
}
function Ol(e) {
  var t = e.effects;
  if (t !== null) {
    e.effects = null;
    for (var n = 0; n < t.length; n += 1)
      Re(
        /** @type {Effect} */
        t[n]
      );
  }
}
function qr(e) {
  var t, n = L, r = e.parent;
  if (!at && r !== null && (r.f & (Oe | ve)) !== 0)
    return pl(), e.v;
  Ue(r);
  try {
    e.f &= ~_t, Ol(e), t = Jo(e);
  } finally {
    Ue(n);
  }
  return t;
}
function Bo(e) {
  var t = qr(e);
  if (!e.equals(t) && (e.wv = Yo(), (!U?.is_fork || e.deps === null) && (U !== null ? (U.capture(e, t, !0), mr?.capture(e, t, !0)) : e.v = t, e.deps === null))) {
    Z(e, Q);
    return;
  }
  at || (Ae !== null ? (Vr() || U?.is_fork) && Ae.set(e, t) : Dr(e));
}
function Il(e) {
  if (e.effects !== null)
    for (const t of e.effects)
      (t.teardown || t.ac) && (t.teardown?.(), t.ac?.abort(Vn), t.teardown = Za, t.ac = null, tn(t, 0), Fr(t));
}
function Oo(e) {
  if (e.effects !== null)
    for (const t of e.effects)
      t.teardown && Pt(t);
}
let In = /* @__PURE__ */ new Set();
const vt = /* @__PURE__ */ new Map();
let Io = !1;
function an(e, t) {
  var n = {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v: e,
    reactions: null,
    equals: mo,
    rv: 0,
    wv: 0
  };
  return n;
}
// @__NO_SIDE_EFFECTS__
function Ye(e, t) {
  const n = an(e);
  return Go(n), n;
}
// @__NO_SIDE_EFFECTS__
function Nl(e, t = !1, n = !0) {
  const r = an(e);
  return t || (r.equals = _o), r;
}
function Qe(e, t, n = !1) {
  O !== null && // since we are untracking the function inside `$inspect.with` we need to add this check
  // to ensure we error if state is set inside an inspect effect
  (!Se || (O.f & Ln) !== 0) && Eo() && (O.f & (ie | ke | Lt | Ln)) !== 0 && (ye === null || !Nt.call(ye, e)) && cl();
  let r = n ? Gt(t) : t;
  return Nn(e, r, mn);
}
function Nn(e, t, n = null) {
  if (!e.equals(t)) {
    vt.set(e, at ? t : e.v);
    var r = Ze.ensure();
    if (r.capture(e, t), (e.f & ie) !== 0) {
      const i = (
        /** @type {Derived} */
        e
      );
      (e.f & re) !== 0 && qr(i), Ae === null && Dr(i);
    }
    e.wv = Yo(), No(e, re, n), L !== null && (L.f & Q) !== 0 && (L.f & (Ie | Ke)) === 0 && (be === null ? Zl([e]) : be.push(e)), !r.is_fork && In.size > 0 && !Io && Ul();
  }
  return t;
}
function Ul() {
  Io = !1;
  for (const e of In) {
    (e.f & Q) !== 0 && Z(e, Ne);
    let t;
    try {
      t = ln(e);
    } catch {
      t = !0;
    }
    t && Pt(e);
  }
  In.clear();
}
function Jt(e) {
  Qe(e, e.v + 1);
}
function No(e, t, n) {
  var r = e.reactions;
  if (r !== null)
    for (var i = r.length, o = 0; o < i; o++) {
      var s = r[o], l = s.f, a = (l & re) === 0;
      if (a && Z(s, t), (l & Ln) !== 0)
        In.add(
          /** @type {Effect} */
          s
        );
      else if ((l & ie) !== 0) {
        var c = (
          /** @type {Derived} */
          s
        );
        Ae?.delete(c), (l & _t) === 0 && (l & we && (L === null || (L.f & Bn) === 0) && (s.f |= _t), No(c, Ne, n));
      } else if (a) {
        var u = (
          /** @type {Effect} */
          s
        );
        (l & ke) !== 0 && He !== null && He.add(u), n !== null ? n.push(u) : Hr(u);
      }
    }
}
function Gt(e) {
  if (typeof e != "object" || e === null || wt in e)
    return e;
  const t = po(e);
  if (t !== Fa && t !== Ka)
    return e;
  var n = /* @__PURE__ */ new Map(), r = Ha(e), i = /* @__PURE__ */ Ye(0), o = yt, s = (l) => {
    if (yt === o)
      return l();
    var a = O, c = yt;
    me(null), Hi(o);
    var u = l();
    return me(a), Hi(c), u;
  };
  return r && n.set("length", /* @__PURE__ */ Ye(
    /** @type {any[]} */
    e.length
  )), new Proxy(
    /** @type {any} */
    e,
    {
      defineProperty(l, a, c) {
        (!("value" in c) || c.configurable === !1 || c.enumerable === !1 || c.writable === !1) && al();
        var u = n.get(a);
        return u === void 0 ? s(() => {
          var f = /* @__PURE__ */ Ye(c.value);
          return n.set(a, f), f;
        }) : Qe(u, c.value, !0), !0;
      },
      deleteProperty(l, a) {
        var c = n.get(a);
        if (c === void 0) {
          if (a in l) {
            const u = s(() => /* @__PURE__ */ Ye(te));
            n.set(a, u), Jt(i);
          }
        } else
          Qe(c, te), Jt(i);
        return !0;
      },
      get(l, a, c) {
        if (a === wt)
          return e;
        var u = n.get(a), f = a in l;
        if (u === void 0 && (!f || Ct(l, a)?.writable) && (u = s(() => {
          var h = Gt(f ? l[a] : te), p = /* @__PURE__ */ Ye(h);
          return p;
        }), n.set(a, u)), u !== void 0) {
          var d = qe(u);
          return d === te ? void 0 : d;
        }
        return Reflect.get(l, a, c);
      },
      getOwnPropertyDescriptor(l, a) {
        var c = Reflect.getOwnPropertyDescriptor(l, a);
        if (c && "value" in c) {
          var u = n.get(a);
          u && (c.value = qe(u));
        } else if (c === void 0) {
          var f = n.get(a), d = f?.v;
          if (f !== void 0 && d !== te)
            return {
              enumerable: !0,
              configurable: !0,
              value: d,
              writable: !0
            };
        }
        return c;
      },
      has(l, a) {
        if (a === wt)
          return !0;
        var c = n.get(a), u = c !== void 0 && c.v !== te || Reflect.has(l, a);
        if (c !== void 0 || L !== null && (!u || Ct(l, a)?.writable)) {
          c === void 0 && (c = s(() => {
            var d = u ? Gt(l[a]) : te, h = /* @__PURE__ */ Ye(d);
            return h;
          }), n.set(a, c));
          var f = qe(c);
          if (f === te)
            return !1;
        }
        return u;
      },
      set(l, a, c, u) {
        var f = n.get(a), d = a in l;
        if (r && a === "length")
          for (var h = c; h < /** @type {Source<number>} */
          f.v; h += 1) {
            var p = n.get(h + "");
            p !== void 0 ? Qe(p, te) : h in l && (p = s(() => /* @__PURE__ */ Ye(te)), n.set(h + "", p));
          }
        if (f === void 0)
          (!d || Ct(l, a)?.writable) && (f = s(() => /* @__PURE__ */ Ye(void 0)), Qe(f, Gt(c)), n.set(a, f));
        else {
          d = f.v !== te;
          var b = s(() => Gt(c));
          Qe(f, b);
        }
        var v = Reflect.getOwnPropertyDescriptor(l, a);
        if (v?.set && v.set.call(u, c), !d) {
          if (r && typeof a == "string") {
            var m = (
              /** @type {Source<number>} */
              n.get("length")
            ), S = Number(a);
            Number.isInteger(S) && S >= m.v && Qe(m, S + 1);
          }
          Jt(i);
        }
        return !0;
      },
      ownKeys(l) {
        qe(i);
        var a = Reflect.ownKeys(l).filter((f) => {
          var d = n.get(f);
          return d === void 0 || d.v !== te;
        });
        for (var [c, u] of n)
          u.v !== te && !(c in l) && a.push(c);
        return a;
      },
      setPrototypeOf() {
        ll();
      }
    }
  );
}
function Mi(e) {
  try {
    if (e !== null && typeof e == "object" && wt in e)
      return e[wt];
  } catch {
  }
  return e;
}
function Jp(e, t) {
  return Object.is(Mi(e), Mi(t));
}
var zi, Uo, Mo, zo;
function Er() {
  if (zi === void 0) {
    zi = window, Uo = /Firefox/.test(navigator.userAgent);
    var e = Element.prototype, t = Node.prototype, n = Text.prototype;
    Mo = Ct(t, "firstChild").get, zo = Ct(t, "nextSibling").get, Bi(e) && (e[Ja] = void 0, e[Xa] = null, e[Qa] = void 0, e.__e = void 0), Bi(n) && (n[yr] = void 0);
  }
}
function Ge(e = "") {
  return document.createTextNode(e);
}
// @__NO_SIDE_EFFECTS__
function Dt(e) {
  return (
    /** @type {TemplateNode | null} */
    Mo.call(e)
  );
}
// @__NO_SIDE_EFFECTS__
function We(e) {
  return (
    /** @type {TemplateNode | null} */
    zo.call(e)
  );
}
function Qp(e, t) {
  if (!X)
    return /* @__PURE__ */ Dt(e);
  var n = /* @__PURE__ */ Dt(M);
  if (n === null)
    n = M.appendChild(Ge());
  else if (t && n.nodeType !== on) {
    var r = Ge();
    return n?.before(r), $e(r), r;
  }
  return t && Zn(
    /** @type {Text} */
    n
  ), $e(n), n;
}
function eg(e, t = !1) {
  if (!X) {
    var n = /* @__PURE__ */ Dt(e);
    return n instanceof Comment && n.data === "" ? /* @__PURE__ */ We(n) : n;
  }
  if (t) {
    if (M?.nodeType !== on) {
      var r = Ge();
      return M?.before(r), $e(r), r;
    }
    Zn(
      /** @type {Text} */
      M
    );
  }
  return M;
}
function tg(e, t = 1, n = !1) {
  let r = X ? M : e;
  for (var i; t--; )
    i = r, r = /** @type {TemplateNode} */
    /* @__PURE__ */ We(r);
  if (!X)
    return r;
  if (n) {
    if (r?.nodeType !== on) {
      var o = Ge();
      return r === null ? i?.after(o) : r.before(o), $e(o), o;
    }
    Zn(
      /** @type {Text} */
      r
    );
  }
  return $e(r), r;
}
function Ml(e) {
  e.textContent = "";
}
function ng() {
  return !1;
}
function Do(e, t, n) {
  return (
    /** @type {T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : Element} */
    document.createElementNS(t ?? hl, e, void 0)
  );
}
function Zn(e) {
  if (
    /** @type {string} */
    e.nodeValue.length < 65536
  )
    return;
  let t = e.nextSibling;
  for (; t !== null && t.nodeType === on; )
    t.remove(), e.nodeValue += /** @type {string} */
    t.nodeValue, t = e.nextSibling;
}
function rg(e, t) {
  if (t) {
    const n = document.body;
    e.autofocus = !0, it(() => {
      document.activeElement === n && e.focus();
    });
  }
}
let Di = !1;
function zl() {
  Di || (Di = !0, document.addEventListener(
    "reset",
    (e) => {
      Promise.resolve().then(() => {
        if (!e.defaultPrevented)
          for (
            const t of
            /**@type {HTMLFormElement} */
            e.target.elements
          )
            t[yn]?.();
      });
    },
    // In the capture phase to guarantee we get noticed of it (no possibility of stopPropagation)
    { capture: !0 }
  ));
}
function Gn(e) {
  var t = O, n = L;
  me(null), Ue(null);
  try {
    return e();
  } finally {
    me(t), Ue(n);
  }
}
function ig(e, t, n, r = n) {
  e.addEventListener(t, () => Gn(n));
  const i = (
    /** @type {any} */
    e[yn]
  );
  i ? e[yn] = () => {
    i(), r(!0);
  } : e[yn] = () => r(!0), zl();
}
function Po(e) {
  L === null && (O === null && il(), rl()), at && nl();
}
function Dl(e, t) {
  var n = t.last;
  n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function Ee(e, t) {
  var n = L;
  n !== null && (n.f & ve) !== 0 && (e |= ve);
  var r = {
    ctx: ae,
    deps: null,
    nodes: null,
    f: e | re | we,
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
  if ((e & Ut) !== 0)
    $t !== null ? $t.push(r) : Ze.ensure().schedule(r);
  else if (t !== null) {
    try {
      Pt(r);
    } catch (s) {
      throw Re(r), s;
    }
    i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && // either `null`, or a singular child
    (i.f & xt) === 0 && (i = i.first, (e & ke) !== 0 && (e & en) !== 0 && i !== null && (i.f |= en));
  }
  if (i !== null && (i.parent = n, n !== null && Dl(i, n), O !== null && (O.f & ie) !== 0 && (e & Ke) === 0)) {
    var o = (
      /** @type {Derived} */
      O
    );
    (o.effects ??= []).push(i);
  }
  return r;
}
function Vr() {
  return O !== null && !Se;
}
function Ho(e) {
  const t = Ee(rn, null);
  return Z(t, Q), t.teardown = e, t;
}
function og(e) {
  Po();
  var t = (
    /** @type {Effect} */
    L.f
  ), n = !O && (t & Ie) !== 0 && (t & ut) === 0;
  if (n) {
    var r = (
      /** @type {ComponentContext} */
      ae
    );
    (r.e ??= []).push(e);
  } else
    return jo(e);
}
function jo(e) {
  return Ee(Ut | bo, e);
}
function sg(e) {
  return Po(), Ee(rn | bo, e);
}
function Pl(e) {
  Ze.ensure();
  const t = Ee(Ke | xt, e);
  return () => {
    Re(t);
  };
}
function Hl(e) {
  Ze.ensure();
  const t = Ee(Ke | xt, e);
  return (n = {}) => new Promise((r) => {
    n.outro ? _n(t, () => {
      Re(t), r(void 0);
    }) : (Re(t), r(void 0));
  });
}
function ag(e) {
  return Ee(Ut, e);
}
function jl(e) {
  return Ee(Lt | xt, e);
}
function qo(e, t = 0) {
  return Ee(rn | t, e);
}
function lg(e, t = [], n = [], r = []) {
  Cl(r, t, n, (i) => {
    Ee(rn, () => e(...i.map(qe)));
  });
}
function ql(e, t = 0) {
  var n = Ee(ke | t, e);
  return n;
}
function cg(e, t = 0) {
  var n = Ee(Mr | t, e);
  return n;
}
function ft(e) {
  return Ee(Ie | xt, e);
}
function Vo(e) {
  var t = e.teardown;
  if (t !== null) {
    const n = at, r = O;
    Pi(!0), me(null);
    try {
      t.call(null);
    } finally {
      Pi(n), me(r);
    }
  }
}
function Fr(e, t = !1) {
  var n = e.first;
  for (e.first = e.last = null; n !== null; ) {
    const i = n.ac;
    i !== null && Gn(() => {
      i.abort(Vn);
    });
    var r = n.next;
    (n.f & Ke) !== 0 ? n.parent = null : Re(n, t), n = r;
  }
}
function Vl(e) {
  for (var t = e.first; t !== null; ) {
    var n = t.next;
    (t.f & Ie) === 0 && Re(t), t = n;
  }
}
function Re(e, t = !0) {
  var n = !1;
  (t || (e.f & Wa) !== 0) && e.nodes !== null && e.nodes.end !== null && (Fl(
    e.nodes.start,
    /** @type {TemplateNode} */
    e.nodes.end
  ), n = !0), Z(e, Oi), Fr(e, t && !n), tn(e, 0);
  var r = e.nodes && e.nodes.t;
  if (r !== null)
    for (const o of r)
      o.stop();
  Vo(e), e.f ^= Oi, e.f |= Oe;
  var i = e.parent;
  i !== null && i.first !== null && Fo(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Fl(e, t) {
  for (; e !== null; ) {
    var n = e === t ? null : /* @__PURE__ */ We(e);
    e.remove(), e = n;
  }
}
function Fo(e) {
  var t = e.parent, n = e.prev, r = e.next;
  n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function _n(e, t, n = !0) {
  var r = [];
  Ko(e, r, !0);
  var i = () => {
    n && Re(e), t && t();
  }, o = r.length;
  if (o > 0) {
    var s = () => --o || i();
    for (var l of r)
      l.out(s);
  } else
    i();
}
function Ko(e, t, n) {
  if ((e.f & ve) === 0) {
    e.f ^= ve;
    var r = e.nodes && e.nodes.t;
    if (r !== null)
      for (const l of r)
        (l.is_global || n) && t.push(l);
    for (var i = e.first; i !== null; ) {
      var o = i.next;
      if ((i.f & Ke) === 0) {
        var s = (i.f & en) !== 0 || // If this is a branch effect without a block effect parent,
        // it means the parent block effect was pruned. In that case,
        // transparency information was transferred to the branch effect.
        (i.f & Ie) !== 0 && (e.f & ke) !== 0;
        Ko(i, t, s ? n : !1);
      }
      i = o;
    }
  }
}
function ug(e) {
  Zo(e, !0);
}
function Zo(e, t) {
  if ((e.f & ve) !== 0) {
    e.f ^= ve, (e.f & Q) === 0 && (Z(e, re), Ze.ensure().schedule(e));
    for (var n = e.first; n !== null; ) {
      var r = n.next, i = (n.f & en) !== 0 || (n.f & Ie) !== 0;
      Zo(n, i ? t : !1), n = r;
    }
    var o = e.nodes && e.nodes.t;
    if (o !== null)
      for (const s of o)
        (s.is_global || t) && s.in();
  }
}
function Kl(e, t) {
  if (e.nodes)
    for (var n = e.nodes.start, r = e.nodes.end; n !== null; ) {
      var i = n === r ? null : /* @__PURE__ */ We(n);
      t.append(n), n = i;
    }
}
let En = !1, at = !1;
function Pi(e) {
  at = e;
}
let O = null, Se = !1;
function me(e) {
  O = e;
}
let L = null;
function Ue(e) {
  L = e;
}
let ye = null;
function Go(e) {
  O !== null && (ye === null ? ye = [e] : ye.push(e));
}
let ce = null, he = 0, be = null;
function Zl(e) {
  be = e;
}
let Wo = 1, pt = 0, yt = pt;
function Hi(e) {
  yt = e;
}
function Yo() {
  return ++Wo;
}
function ln(e) {
  var t = e.f;
  if ((t & re) !== 0)
    return !0;
  if (t & ie && (e.f &= ~_t), (t & Ne) !== 0) {
    for (var n = (
      /** @type {Value[]} */
      e.deps
    ), r = n.length, i = 0; i < r; i++) {
      var o = n[i];
      if (ln(
        /** @type {Derived} */
        o
      ) && Bo(
        /** @type {Derived} */
        o
      ), o.wv > e.wv)
        return !0;
    }
    (t & we) !== 0 && // During time traveling we don't want to reset the status so that
    // traversal of the graph in the other batches still happens
    Ae === null && Z(e, Q);
  }
  return !1;
}
function Xo(e, t, n = !0) {
  var r = e.reactions;
  if (r !== null && !(ye !== null && Nt.call(ye, e)))
    for (var i = 0; i < r.length; i++) {
      var o = r[i];
      (o.f & ie) !== 0 ? Xo(
        /** @type {Derived} */
        o,
        t,
        !1
      ) : t === o && (n ? Z(o, re) : (o.f & Q) !== 0 && Z(o, Ne), Hr(
        /** @type {Effect} */
        o
      ));
    }
}
function Jo(e) {
  var t = ce, n = he, r = be, i = O, o = ye, s = ae, l = Se, a = yt, c = e.f;
  ce = /** @type {null | Value[]} */
  null, he = 0, be = null, O = (c & (Ie | Ke)) === 0 ? e : null, ye = null, zt(e.ctx), Se = !1, yt = ++pt, e.ac !== null && (Gn(() => {
    e.ac.abort(Vn);
  }), e.ac = null);
  try {
    e.f |= Bn;
    var u = (
      /** @type {Function} */
      e.fn
    ), f = u();
    e.f |= ut;
    var d = e.deps, h = U?.is_fork;
    if (ce !== null) {
      var p;
      if (h || tn(e, he), d !== null && he > 0)
        for (d.length = he + ce.length, p = 0; p < ce.length; p++)
          d[he + p] = ce[p];
      else
        e.deps = d = ce;
      if (Vr() && (e.f & we) !== 0)
        for (p = he; p < d.length; p++)
          (d[p].reactions ??= []).push(e);
    } else !h && d !== null && he < d.length && (tn(e, he), d.length = he);
    if (Eo() && be !== null && !Se && d !== null && (e.f & (ie | Ne | re)) === 0)
      for (p = 0; p < /** @type {Source[]} */
      be.length; p++)
        Xo(
          be[p],
          /** @type {Effect} */
          e
        );
    if (i !== null && i !== e) {
      if (pt++, i.deps !== null)
        for (let b = 0; b < n; b += 1)
          i.deps[b].rv = pt;
      if (t !== null)
        for (const b of t)
          b.rv = pt;
      be !== null && (r === null ? r = be : r.push(.../** @type {Source[]} */
      be));
    }
    return (e.f & rt) !== 0 && (e.f ^= rt), f;
  } catch (b) {
    return ko(b);
  } finally {
    e.f ^= Bn, ce = t, he = n, be = r, O = i, ye = o, zt(s), Se = l, yt = a;
  }
}
function Gl(e, t) {
  let n = t.reactions;
  if (n !== null) {
    var r = ja.call(n, e);
    if (r !== -1) {
      var i = n.length - 1;
      i === 0 ? n = t.reactions = null : (n[r] = n[i], n.pop());
    }
  }
  if (n === null && (t.f & ie) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
  // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
  // allows us to skip the expensive work of disconnecting and immediately reconnecting it
  (ce === null || !Nt.call(ce, t))) {
    var o = (
      /** @type {Derived} */
      t
    );
    (o.f & we) !== 0 && (o.f ^= we, o.f &= ~_t), o.v !== te && Dr(o), Il(o), tn(o, 0);
  }
}
function tn(e, t) {
  var n = e.deps;
  if (n !== null)
    for (var r = t; r < n.length; r++)
      Gl(e, n[r]);
}
function Pt(e) {
  var t = e.f;
  if ((t & Oe) === 0) {
    Z(e, Q);
    var n = L, r = En;
    L = e, En = !0;
    try {
      (t & (ke | Mr)) !== 0 ? Vl(e) : Fr(e), Vo(e);
      var i = Jo(e);
      e.teardown = typeof i == "function" ? i : null, e.wv = Wo;
      var o;
    } finally {
      En = r, L = n;
    }
  }
}
async function fg() {
  await Promise.resolve(), Ro();
}
function qe(e) {
  var t = e.f, n = (t & ie) !== 0;
  if (O !== null && !Se) {
    var r = L !== null && (L.f & Oe) !== 0;
    if (!r && (ye === null || !Nt.call(ye, e))) {
      var i = O.deps;
      if ((O.f & Bn) !== 0)
        e.rv < pt && (e.rv = pt, ce === null && i !== null && i[he] === e ? he++ : ce === null ? ce = [e] : ce.push(e));
      else {
        (O.deps ??= []).push(e);
        var o = e.reactions;
        o === null ? e.reactions = [O] : Nt.call(o, O) || o.push(O);
      }
    }
  }
  if (at && vt.has(e))
    return vt.get(e);
  if (n) {
    var s = (
      /** @type {Derived} */
      e
    );
    if (at) {
      var l = s.v;
      return ((s.f & Q) === 0 && s.reactions !== null || es(s)) && (l = qr(s)), vt.set(s, l), l;
    }
    var a = (s.f & we) === 0 && !Se && O !== null && (En || (O.f & we) !== 0), c = (s.f & ut) === 0;
    ln(s) && (a && (s.f |= we), Bo(s)), a && !c && (Oo(s), Qo(s));
  }
  if (Ae?.has(e))
    return Ae.get(e);
  if ((e.f & rt) !== 0)
    throw e.v;
  return e.v;
}
function Qo(e) {
  if (e.f |= we, e.deps !== null)
    for (const t of e.deps)
      (t.reactions ??= []).push(e), (t.f & ie) !== 0 && (t.f & we) === 0 && (Oo(
        /** @type {Derived} */
        t
      ), Qo(
        /** @type {Derived} */
        t
      ));
}
function es(e) {
  if (e.v === te) return !0;
  if (e.deps === null) return !1;
  for (const t of e.deps)
    if (vt.has(t) || (t.f & ie) !== 0 && es(
      /** @type {Derived} */
      t
    ))
      return !0;
  return !1;
}
function Wl(e) {
  var t = Se;
  try {
    return Se = !0, e();
  } finally {
    Se = t;
  }
}
function dg(e) {
  if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
    if (wt in e)
      xr(e);
    else if (!Array.isArray(e))
      for (let t in e) {
        const n = e[t];
        typeof n == "object" && n && wt in n && xr(n);
      }
  }
}
function xr(e, t = /* @__PURE__ */ new Set()) {
  if (typeof e == "object" && e !== null && // We don't want to traverse DOM elements
  !(e instanceof EventTarget) && !t.has(e)) {
    t.add(e), e instanceof Date && e.getTime();
    for (let r in e)
      try {
        xr(e[r], t);
      } catch {
      }
    const n = po(e);
    if (n !== Object.prototype && n !== Array.prototype && n !== Map.prototype && n !== Set.prototype && n !== Date.prototype) {
      const r = Va(n);
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
function hg(e) {
  return e.endsWith("capture") && e !== "gotpointercapture" && e !== "lostpointercapture";
}
const Yl = [
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
function pg(e) {
  return Yl.includes(e);
}
const Xl = {
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
function gg(e) {
  return e = e.toLowerCase(), Xl[e] ?? e;
}
const Jl = ["touchstart", "touchmove"];
function Ql(e) {
  return Jl.includes(e);
}
const ec = (
  /** @type {const} */
  ["textarea", "script", "style", "title"]
);
function bg(e) {
  return ec.includes(
    /** @type {typeof RAW_TEXT_ELEMENTS[number]} */
    e
  );
}
const Wt = Symbol("events"), ts = /* @__PURE__ */ new Set(), kr = /* @__PURE__ */ new Set();
function wg(e) {
  if (!X) return;
  e.removeAttribute("onload"), e.removeAttribute("onerror");
  const t = e.__e;
  t !== void 0 && (e.__e = void 0, queueMicrotask(() => {
    e.isConnected && e.dispatchEvent(t);
  }));
}
function ns(e, t, n, r = {}) {
  function i(o) {
    if (r.capture || Ar.call(t, o), !o.cancelBubble)
      return Gn(() => n?.call(this, o));
  }
  return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? it(() => {
    t.addEventListener(e, i, r);
  }) : t.addEventListener(e, i, r), i;
}
function vg(e, t, n, r = {}) {
  var i = ns(t, e, n, r);
  return () => {
    e.removeEventListener(t, i, r);
  };
}
function yg(e, t, n, r, i) {
  var o = { capture: r, passive: i }, s = ns(e, t, n, o);
  (t === document.body || // @ts-ignore
  t === window || // @ts-ignore
  t === document || // Firefox has quirky behavior, it can happen that we still get "canplay" events when the element is already removed
  t instanceof HTMLMediaElement) && Ho(() => {
    t.removeEventListener(e, s, o);
  });
}
function mg(e, t, n) {
  (t[Wt] ??= {})[e] = n;
}
function _g(e) {
  for (var t = 0; t < e.length; t++)
    ts.add(e[t]);
  for (var n of kr)
    n(e);
}
let ji = null;
function Ar(e) {
  var t = this, n = (
    /** @type {Node} */
    t.ownerDocument
  ), r = e.type, i = e.composedPath?.() || [], o = (
    /** @type {null | Element} */
    i[0] || e.target
  );
  ji = e;
  var s = 0, l = ji === e && e[Wt];
  if (l) {
    var a = i.indexOf(l);
    if (a !== -1 && (t === document || t === /** @type {any} */
    window)) {
      e[Wt] = t;
      return;
    }
    var c = i.indexOf(t);
    if (c === -1)
      return;
    a <= c && (s = a);
  }
  if (o = /** @type {Element} */
  i[s] || e.target, o !== t) {
    Cn(e, "currentTarget", {
      configurable: !0,
      get() {
        return o || n;
      }
    });
    var u = O, f = L;
    me(null), Ue(null);
    try {
      for (var d, h = []; o !== null; ) {
        var p = o.assignedSlot || o.parentNode || /** @type {any} */
        o.host || null;
        try {
          var b = o[Wt]?.[r];
          b != null && (!/** @type {any} */
          o.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
          // -> the target could not have been disabled because it emits the event in the first place
          e.target === o) && b.call(o, e);
        } catch (v) {
          d ? h.push(v) : d = v;
        }
        if (e.cancelBubble || p === t || p === null)
          break;
        o = p;
      }
      if (d) {
        for (let v of h)
          queueMicrotask(() => {
            throw v;
          });
        throw d;
      }
    } finally {
      e[Wt] = t, delete e.currentTarget, me(u), Ue(f);
    }
  }
}
const tc = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", {
    /** @param {string} html */
    createHTML: (e) => e
  })
);
function nc(e) {
  return (
    /** @type {string} */
    tc?.createHTML(e) ?? e
  );
}
function rc(e) {
  var t = Do("template");
  return t.innerHTML = nc(e.replaceAll("<!>", "<!---->")), t.content;
}
function ot(e, t) {
  var n = (
    /** @type {Effect} */
    L
  );
  n.nodes === null && (n.nodes = { start: e, end: t, a: null, t: null });
}
// @__NO_SIDE_EFFECTS__
function Eg(e, t) {
  var n = (t & fl) !== 0, r = (t & dl) !== 0, i, o = !e.startsWith("<!>");
  return () => {
    if (X)
      return ot(M, null), M;
    i === void 0 && (i = rc(o ? e : "<!>" + e), n || (i = /** @type {TemplateNode} */
    /* @__PURE__ */ Dt(i)));
    var s = (
      /** @type {TemplateNode} */
      r || Uo ? document.importNode(i, !0) : i.cloneNode(!0)
    );
    if (n) {
      var l = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ Dt(s)
      ), a = (
        /** @type {TemplateNode} */
        s.lastChild
      );
      ot(l, a);
    } else
      ot(s, s);
    return s;
  };
}
function xg(e = "") {
  if (!X) {
    var t = Ge(e + "");
    return ot(t, t), t;
  }
  var n = M;
  return n.nodeType !== on ? (n.before(n = Ge()), $e(n)) : Zn(
    /** @type {Text} */
    n
  ), ot(n, n), n;
}
function kg() {
  if (X)
    return ot(M, null), M;
  var e = document.createDocumentFragment(), t = document.createComment(""), n = Ge();
  return e.append(t, n), ot(t, n), e;
}
function ic(e, t) {
  if (X) {
    var n = (
      /** @type {Effect & { nodes: EffectNodes }} */
      L
    );
    ((n.f & ut) === 0 || n.nodes.end === null) && (n.nodes.end = M), zr();
    return;
  }
  e !== null && e.before(
    /** @type {Node} */
    t
  );
}
function Ag() {
  if (X && M && M.nodeType === sn && M.textContent?.startsWith("$")) {
    const e = M.textContent.substring(1);
    return zr(), e;
  }
  return (window.__svelte ??= {}).uid ??= 1, `c${window.__svelte.uid++}`;
}
function Sg(e, t) {
  var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
  n !== /** @type {any} */
  (e[yr] ??= e.nodeValue) && (e[yr] = n, e.nodeValue = `${n}`);
}
function Kr(e, t) {
  return rs(e, t);
}
function oc(e, t) {
  Er(), t.intro = t.intro ?? !1;
  const n = t.target, r = X, i = M;
  try {
    for (var o = /* @__PURE__ */ Dt(n); o && (o.nodeType !== sn || /** @type {Comment} */
    o.data !== wo); )
      o = /* @__PURE__ */ We(o);
    if (!o)
      throw Mt;
    dn(!0), $e(
      /** @type {Comment} */
      o
    );
    const s = rs(e, { ...t, anchor: o });
    return dn(!1), /**  @type {Exports} */
    s;
  } catch (s) {
    if (s instanceof Error && s.message.split(`
`).some((l) => l.startsWith("https://svelte.dev/e/")))
      throw s;
    return s !== Mt && console.warn("Failed to hydrate: ", s), t.recover === !1 && sl(), Er(), Ml(n), dn(!1), Kr(e, t);
  } finally {
    dn(r), $e(i);
  }
}
const pn = /* @__PURE__ */ new Map();
function rs(e, { target: t, anchor: n, props: r = {}, events: i, context: o, intro: s = !0, transformError: l }) {
  Er();
  var a = void 0, c = Hl(() => {
    var u = n ?? t.appendChild(Ge());
    $l(
      /** @type {TemplateNode} */
      u,
      {
        pending: () => {
        }
      },
      (h) => {
        yl({});
        var p = (
          /** @type {ComponentContext} */
          ae
        );
        if (o && (p.c = o), i && (r.$$events = i), X && ot(
          /** @type {TemplateNode} */
          h,
          null
        ), a = e(h, r) || {}, X && (L.nodes.end = M, M === null || M.nodeType !== sn || /** @type {Comment} */
        M.data !== yo))
          throw Fn(), Mt;
        ml();
      },
      l
    );
    var f = /* @__PURE__ */ new Set(), d = (h) => {
      for (var p = 0; p < h.length; p++) {
        var b = h[p];
        if (!f.has(b)) {
          f.add(b);
          var v = Ql(b);
          for (const B of [t, document]) {
            var m = pn.get(B);
            m === void 0 && (m = /* @__PURE__ */ new Map(), pn.set(B, m));
            var S = m.get(b);
            S === void 0 ? (B.addEventListener(b, Ar, { passive: v }), m.set(b, 1)) : m.set(b, S + 1);
          }
        }
      }
    };
    return d(qa(ts)), kr.add(d), () => {
      for (var h of f)
        for (const v of [t, document]) {
          var p = (
            /** @type {Map<string, number>} */
            pn.get(v)
          ), b = (
            /** @type {number} */
            p.get(h)
          );
          --b == 0 ? (v.removeEventListener(h, Ar), p.delete(h), p.size === 0 && pn.delete(v)) : p.set(h, b);
        }
      kr.delete(d), u !== n && u.parentNode?.removeChild(u);
    };
  });
  return Sr.set(a, c), a;
}
let Sr = /* @__PURE__ */ new WeakMap();
function is(e, t) {
  const n = Sr.get(e);
  return n ? (Sr.delete(e), n(t)) : Promise.resolve();
}
function sc(e) {
  return new ac(e);
}
class ac {
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
      var l = /* @__PURE__ */ Nl(s, !1, !1);
      return n.set(o, l), l;
    };
    const i = new Proxy(
      { ...t.props || {}, $$events: {} },
      {
        get(o, s) {
          return qe(n.get(s) ?? r(s, Reflect.get(o, s)));
        },
        has(o, s) {
          return s === Ya ? !0 : (qe(n.get(s) ?? r(s, Reflect.get(o, s))), Reflect.has(o, s));
        },
        set(o, s, l) {
          return Qe(n.get(s) ?? r(s, l), l), Reflect.set(o, s, l);
        }
      }
    );
    this.#t = (t.hydrate ? oc : Kr)(t.component, {
      target: t.target,
      anchor: t.anchor,
      props: i,
      context: t.context,
      intro: t.intro ?? !1,
      recover: t.recover,
      transformError: t.transformError
    }), (!t?.props?.$$host || t.sync === !1) && Ro(), this.#e = i.$$events;
    for (const o of Object.keys(this.#t))
      o === "$set" || o === "$destroy" || o === "$on" || Cn(this, o, {
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
      is(this.#t);
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
let os;
typeof HTMLElement == "function" && (os = class extends HTMLElement {
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
          const o = Do("slot");
          r !== "default" && (o.name = r), ic(i, o);
        };
      };
      if (await Promise.resolve(), !this.$$cn || this.$$c)
        return;
      const t = {}, n = lc(this);
      for (const r of this.$$s)
        r in n && (r === "default" && !this.$$d.children ? (this.$$d.children = e(r), t.default = !0) : t[r] = e(r));
      for (const r of this.attributes) {
        const i = this.$$g_p(r.name);
        i in this.$$d || (this.$$d[i] = xn(i, r.value, this.$$p_d, "toProp"));
      }
      for (const r in this.$$p_d)
        !(r in this.$$d) && this[r] !== void 0 && (this.$$d[r] = this[r], delete this[r]);
      this.$$c = sc({
        component: this.$$ctor,
        target: this.$$shadowRoot || this,
        props: {
          ...this.$$d,
          $$slots: t,
          $$host: this
        }
      }), this.$$me = Pl(() => {
        qo(() => {
          this.$$r = !0;
          for (const r of Tn(this.$$c)) {
            if (!this.$$p_d[r]?.reflect) continue;
            this.$$d[r] = this.$$c[r];
            const i = xn(
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
    this.$$r || (e = this.$$g_p(e), this.$$d[e] = xn(e, n, this.$$p_d, "toProp"), this.$$c?.$set({ [e]: this.$$d[e] }));
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
    return Tn(this.$$p_d).find(
      (t) => this.$$p_d[t].attribute === e || !this.$$p_d[t].attribute && t.toLowerCase() === e
    ) || e;
  }
});
function xn(e, t, n, r) {
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
function lc(e) {
  const t = {};
  return e.childNodes.forEach((n) => {
    t[
      /** @type {Element} node */
      n.slot || "default"
    ] = !0;
  }), t;
}
function Rg(e, t, n, r, i, o) {
  let s = class extends os {
    constructor() {
      super(e, n, i), this.$$p_d = t;
    }
    static get observedAttributes() {
      return Tn(t).map(
        (l) => (t[l].attribute || l).toLowerCase()
      );
    }
  };
  return Tn(t).forEach((l) => {
    Cn(s.prototype, l, {
      get() {
        return this.$$c && l in this.$$c ? this.$$c[l] : this.$$d[l];
      },
      set(a) {
        a = xn(l, a, t), this.$$d[l] = a;
        var c = this.$$c;
        if (c) {
          var u = Ct(c, l)?.get;
          u ? c[l] = a : c.$set({ [l]: a });
        }
      }
    });
  }), r.forEach((l) => {
    Cn(s.prototype, l, {
      get() {
        return this.$$c?.[l];
      }
    });
  }), e.element = /** @type {any} */
  s, s;
}
let ss;
const cc = "ehagaki.web-component.v1:", St = /* @__PURE__ */ new Map(), uc = {
  get length() {
    return St.size;
  },
  clear() {
    St.clear();
  },
  getItem(e) {
    return St.get(e) ?? null;
  },
  key(e) {
    return [...St.keys()][e] ?? null;
  },
  removeItem(e) {
    St.delete(e);
  },
  setItem(e, t) {
    St.set(e, String(t));
  }
};
function fc() {
  if (typeof globalThis < "u") {
    const e = globalThis.localStorage;
    if (e)
      return e;
  }
  return uc;
}
function dc() {
  return ss ?? fc();
}
function hc(e) {
  ss = e;
}
function or(e, t) {
  const n = [];
  for (let r = 0; r < e.length; r += 1) {
    const i = e.key(r);
    i?.startsWith(t) && n.push(i.slice(t.length));
  }
  return n;
}
function pc(e, t) {
  return {
    get length() {
      return or(e, t).length;
    },
    clear() {
      const n = or(e, t);
      for (const r of n)
        e.removeItem(`${t}${r}`);
    },
    getItem(n) {
      return e.getItem(`${t}${n}`);
    },
    key(n) {
      return or(e, t)[n] ?? null;
    },
    removeItem(n) {
      e.removeItem(`${t}${n}`);
    },
    setItem(n, r) {
      e.setItem(`${t}${n}`, String(r));
    }
  };
}
function gc(e) {
  return pc(
    e,
    cc
  );
}
function bc() {
  return {
    style: {
      setProperty: () => {
      },
      removeProperty: () => "",
      getPropertyValue: () => ""
    }
  };
}
function wc() {
  const e = typeof window < "u" ? window : void 0, t = e?.document, n = t?.documentElement ?? bc(), r = t?.body ?? n;
  return {
    storage: dc(),
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
let Yt = wc();
function vc(e) {
  return Yt = {
    ...Yt,
    ...e
  }, hc(Yt.storage), Yt;
}
function $g() {
  return Yt;
}
const yc = ":root{--app-root-height: 100%;--app-root-top: 0px;--app-root-overflow-y: visible;--app-main-height: 100svh;--app-body-position: static;--app-body-inset: auto;--app-body-width: auto;--app-overlay-position: fixed;--app-overscroll-behavior: auto;--footer-height: 66px;--footer-bottom: 0px;--keyboard-height: 0px;--mobile-dialog-viewport-top: 0px;--mobile-dialog-viewport-height: 100dvh;--mobile-dialog-center-y: 43dvh;--keyboard-button-bar-height: 50px;--keyboard-button-bar-bottom: 66px;--main-content-keyboard-adjustment: var(--keyboard-height);--reason-input-base-height: 50px;--reason-input-height: 0px;--reason-input-bottom: 116px;--main-content-top-spacing: 6px;--composer-bottom-reserved-height: 116px;--accent-color-default: hsl(152, 74%, 43%);--accent-color: var( --accent-color-forced, var(--accent-color-user, var(--accent-color-external-default, var(--accent-color-default))) );--accent-color-custom: var( --accent-color-forced, var(--accent-color-user, var(--accent-color-external-default)) );--accent-color-custom-inner: color-mix(in srgb, var(--accent-color-custom) 15%, white 85%);--accent-color-custom-face: color-mix(in srgb, var(--accent-color-custom) 40%, black 60%);--base-color: var( --base-color-forced, var(--base-color-user, var(--base-color-external-default)) );--theme: var(--accent-color);--text-black: hsl(0, 0%, 24%);--nostr-bg: hsl(270, 100%, 98%);--yellow: hsl(50, 100%, 50%);--danger: hsl(0, 84%, 60%);--darker: rgba(0, 0, 0, .8);--dark-gray: hsl(0, 0%, 66%);--light-gray: hsl(0, 0%, 83%);--base-color-surface-bg-light: color-mix(in srgb, var(--base-color) 18%, hsl(0, 0%, 97%));--base-color-surface-bg-dark: color-mix(in srgb, var(--base-color) 18%, hsl(0, 0%, 12%));--base-color-surface-editor-light: color-mix(in srgb, var(--base-color) 6%, hsl(0, 0%, 100%));--base-color-surface-editor-dark: color-mix(in srgb, var(--base-color) 9%, hsl(0, 0%, 22%));--base-color-surface-footer-light: color-mix(in srgb, var(--base-color) 34%, hsl(0, 0%, 86%));--base-color-surface-footer-dark: color-mix(in srgb, var(--base-color) 22%, hsl(0, 0%, 10%));--surface-bg: light-dark( var(--base-color-surface-bg-light, color-mix(in srgb, hsl(0, 0%, 94%) 18%, hsl(0, 0%, 94%))), var(--base-color-surface-bg-dark, color-mix(in srgb, hsl(0, 0%, 12%) 18%, hsl(0, 0%, 12%))) );--surface-input: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 100%)) 14%, hsl(0, 0%, 100%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 19%)) 14%, hsl(0, 0%, 19%)) );--surface-editor: light-dark( var(--base-color-surface-editor-light, var(--surface-input)), var(--base-color-surface-editor-dark, var(--surface-input)) );--surface-footer: light-dark( var(--base-color-surface-footer-light, color-mix(in srgb, hsl(0, 0%, 82%) 22%, hsl(0, 0%, 82%))), var(--base-color-surface-footer-dark, color-mix(in srgb, hsl(0, 0%, 10%) 22%, hsl(0, 0%, 10%))) );--surface-buttonbar: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 91%)) 20%, hsl(0, 0%, 91%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 28%)) 20%, hsl(0, 0%, 28%)) );--base-color-surface-button: color-mix(in srgb, var(--base-color) 24%, white);--surface-button: light-dark( var(--base-color-surface-button, hsl(0, 0%, 92%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 25%)) 18%, hsl(0, 0%, 25%)) );--surface-button-border: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 75%)) 24%, hsl(0, 0%, 75%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 30%)) 24%, hsl(0, 0%, 30%)) );--surface-button-preview-action: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 74%)) 22%, hsl(0, 0%, 74%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 36%)) 22%, hsl(0, 0%, 36%)) );--surface-border: light-dark( color-mix(in srgb, var(--base-color, var(--light-gray)) 24%, var(--light-gray)), color-mix(in srgb, var(--base-color, dimgray) 24%, dimgray) );--surface-border-hr: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 84%)) 20%, hsl(0, 0%, 84%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 30%)) 20%, hsl(0, 0%, 30%)) );--surface-border-hr-light: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 92%)) 16%, hsl(0, 0%, 92%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 20%)) 16%, hsl(0, 0%, 20%)) );--surface-dialog: light-dark( color-mix(in srgb, var(--base-color, white) 14%, white), color-mix(in srgb, var(--base-color, hsl(0, 0%, 14%)) 14%, hsl(0, 0%, 14%)) );--surface-window: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 95%)) 14%, hsl(0, 0%, 95%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 14%)) 14%, hsl(0, 0%, 14%)) );--bg: var(--surface-bg);--bg-input: var(--surface-input);--bg-footer: var(--surface-footer);--bg-translucent: light-dark(#EDEDEDcc, #212121cc);--bg-buttonbar: var(--surface-buttonbar);--base-color-footer-buttonbar-light: var(--base-color-surface-bg-light);--footer-buttonbar-bg: light-dark( var(--base-color-footer-buttonbar-light, var(--bg-buttonbar)), var(--bg-buttonbar) );--btn-bg: var(--surface-button);--btn-bg2: light-dark(color-mix(in srgb, var(--btn-bg), black 6%), color-mix(in srgb, var(--btn-bg), white 10%));--btn-bg3: light-dark(color-mix(in srgb, var(--btn-bg), black 11%), color-mix(in srgb, var(--btn-bg), white 20%));--btn-border: var(--surface-button-border);--btn-hover-bg: light-dark(rgba(50, 50, 50, .12), rgba(255, 255, 255, .12));--btn-post-preview-action: var(--surface-button-preview-action);--border: var(--surface-border);--border-hr: var(--surface-border-hr);--border-hr-light: var(--surface-border-hr-light);--semantic-text: light-dark(hsl(0, 0%, 24%), hsl(0, 0%, 90%));--text: var(--semantic-text);--text-light: light-dark(hsl(0, 0%, 46%), hsl(0, 0%, 75%));--text-muted: light-dark(hsl(0, 0%, 60%), hsl(0, 0%, 55%));--text-red: light-dark(hsl(0, 99%, 45%), hsl(0, 99%, 69%));--text-r: light-dark(#e6e6e6, #3D3D3D);--semantic-link: light-dark(#1a0dab, #99c3ff);--link: var(--semantic-link);--link-visited: light-dark(#681da8, #c58af9);--dialog-bg: var(--surface-dialog);--dialog-bg2: light-dark(color-mix(in srgb, var(--dialog-bg), black 6%), color-mix(in srgb, var(--dialog-bg), white 10%));--dialog-bg3: light-dark(color-mix(in srgb, var(--dialog-bg), black 11%), color-mix(in srgb, var(--dialog-bg), white 16%));--dialog-bg-overlay: light-dark(rgba(0, 0, 0, .6), rgba(0, 0, 0, .8));--window: var(--surface-window);--svg: light-dark(hsl(0, 0%, 36%), hsl(0, 0%, 90%));--svg-light: var(--text-light);--shadow: light-dark(rgba(0, 0, 0, .1), rgba(255, 255, 255, .1));--hagaki: light-dark(hsl(0, 77%, 56%), hsl(5, 99%, 71%));--hashtag-text: light-dark(#106BC7, #65B1FC);--hashtag-bg: light-dark(#106BC71a, #65B1FC1a);--toggle-bg: var(--svg);--toggle-circle: var(--dialog-bg);--message-success-bg: hsl(200, 39%, 96%);--message-success-color: hsl(210, 60%, 40%);--message-success-border: hsl(210, 48%, 70%);--message-error-bg: hsl(351, 99%, 96%);--message-error-color: hsl(351, 99%, 32%);--message-error-border: hsl(351, 99%, 70%);--message-warning-bg: hsl(38, 100%, 95%);--message-warning-color: hsl(30, 90%, 35%);--message-warning-border: hsl(38, 90%, 65%);--message-flavor-bg: hsl(125, 39%, 94%);--message-flavor-color: hsl(123, 46%, 32%);--message-flavor-border: hsl(125, 39%, 70%);--message-tips-bg: hsl(270, 50%, 96%);--message-tips-color: hsl(270, 55%, 38%);--message-tips-border: hsl(270, 45%, 70%);font-family:system-ui,-apple-system,Segoe UI,Hiragino Sans,Hiragino Kaku Gothic ProN,Meiryo,sans-serif;font-weight:400;color-scheme:light dark;color:var(--text);background-color:var(--bg);font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}*{font-family:inherit;box-sizing:border-box}html,body,#app{height:var(--app-root-height);overflow-x:hidden;overflow-y:var(--app-root-overflow-y);overscroll-behavior-y:var(--app-overscroll-behavior)}#app{position:var(--app-body-position);top:var(--app-root-top);left:0;right:0;width:var(--app-body-width)}body{margin:0;position:var(--app-body-position);inset:var(--app-body-inset);width:var(--app-body-width);color:var(--text);background-color:var(--bg);overflow-wrap:anywhere;word-break:auto-phrase;line-break:strict}a{--link-hover-color: light-dark(color-mix(in srgb, var(--link), black 30%), color-mix(in srgb, var(--link), white 30%));font-weight:500;color:var(--link);-webkit-tap-highlight-color:transparent;text-decoration:none;border-radius:6px}a:active{opacity:1}h2,h3{color:var(--text-light)}.card{padding:2em}button,[role=button],select{display:inline-flex;align-items:center;justify-content:center;height:100%;padding:0;font-size:1rem;font-weight:500;line-height:normal;color:var(--text);background-color:inherit;border:none;cursor:pointer;text-decoration:none;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;--button-selected-bg: light-dark(color-mix(in srgb, var(--btn-bg), black 18%), color-mix(in srgb, var(--btn-bg), white 22%));--button-hover-bg: light-dark(color-mix(in srgb, var(--btn-bg), black 4%), color-mix(in srgb, var(--btn-bg), white 5%));--button-hover-color: light-dark(color-mix(in srgb, var(--text), black 40%), color-mix(in srgb, var(--text), white 50%));--button-selected-hover-bg: light-dark(color-mix(in srgb, var(--btn-bg), black 20%), color-mix(in srgb, var(--btn-bg), white 30%));--button-selected-hover-color: light-dark(color-mix(in srgb, var(--text), black 20%), color-mix(in srgb, var(--text), white 30%))}:is(button,[role=button],select):disabled{opacity:.3;cursor:not-allowed}:is(button,[role=button],select):disabled.loading{opacity:1}button>*{pointer-events:none}button:active:not(:disabled),[role=button]:active{scale:.98;transition:scale .1s cubic-bezier(0,1,.5,1)}@media(prefers-reduced-motion:reduce){button:active:not(:disabled),[role=button]:active{scale:1;transition:none}}span{-webkit-tap-highlight-color:transparent}select{border-radius:6px}.svg-icon{-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-size:contain;mask-size:contain;-webkit-mask-position:center;mask-position:center;background-color:var(--svg);display:inline-block;inline-size:var(--icon-size, 28px);block-size:var(--icon-size, 28px);--icon-hover-color: light-dark(color-mix(in srgb, var(--svg), black 40%), color-mix(in srgb, var(--svg), white 50%));--icon-selected-hover-color: light-dark(color-mix(in srgb, var(--svg), black 20%), color-mix(in srgb, var(--svg), white 30%))}.tooltip-content{--tooltip-padding: 12px;--tooltip-font-size: 1rem;--tooltip-line-height: normal;--tooltip-z-index: 100;--tooltip-max-width: none;background:var(--dialog-bg);color:var(--text);border:1px solid var(--border);border-radius:6px;padding:var(--tooltip-padding);font-size:var(--tooltip-font-size);line-height:var(--tooltip-line-height);z-index:var(--tooltip-z-index);max-width:var(--tooltip-max-width)}.post-preview-tooltip-content{--tooltip-z-index: 10000;z-index:10000!important}:root:is(.light,.dark) button.selected:where(:not(:disabled)),:root:is(.light,.dark) button:where([data-state=active]){background-color:var(--button-selected-bg)}@media(hover:hover)and (pointer:fine){a:hover{text-decoration:underline}:root:is(.light,.dark) button:where(:hover:not(:disabled)),:root:is(.light,.dark) [role=button]:where(:hover:not([aria-disabled=true])),:root:is(.light,.dark) select:where(:hover:not(:disabled)){background-color:var(--button-hover-bg);color:var(--button-hover-color)}:is(:root:is(.light,.dark) button:where(:hover:not(:disabled)),:root:is(.light,.dark) [role=button]:where(:hover:not([aria-disabled=true])),:root:is(.light,.dark) select:where(:hover:not(:disabled))) .svg-icon{background-color:var(--icon-hover-color)}:root:is(.light,.dark) button.selected:where(:hover:not(:disabled)),:root:is(.light,.dark) button:where([data-state=active]:hover:not(:disabled)){background-color:var(--button-selected-hover-bg);color:var(--button-selected-hover-color)}:is(:root:is(.light,.dark) button.selected:where(:hover:not(:disabled)),:root:is(.light,.dark) button:where([data-state=active]:hover:not(:disabled))) .svg-icon{background-color:var(--icon-selected-hover-color)}:root:is(.light,.dark) a:hover{color:var(--link-hover-color)}}.setting-section{display:flex;flex-direction:column}.setting-row{display:flex;flex-direction:row;align-items:stretch;justify-content:space-between;min-height:50px}.setting-label{font-size:1rem;font-weight:500;line-height:1.3;display:flex;align-items:center;justify-content:flex-start;white-space:pre-line}.setting-control{display:flex;align-items:stretch;justify-content:flex-end;height:auto;margin-block:auto}", mc = ".pswp{--pswp-bg: #000;--pswp-placeholder-bg: #222;--pswp-root-z-index: 100000;--pswp-preloader-color: rgba(79, 79, 79, .4);--pswp-preloader-color-secondary: rgba(255, 255, 255, .9);--pswp-icon-color: #fff;--pswp-icon-color-secondary: #4f4f4f;--pswp-icon-stroke-color: #4f4f4f;--pswp-icon-stroke-width: 2px;--pswp-error-text-color: var(--pswp-icon-color)}.pswp{position:fixed;top:0;left:0;width:100%;height:100%;z-index:var(--pswp-root-z-index);display:none;touch-action:none;outline:0;opacity:.003;contain:layout style size;-webkit-tap-highlight-color:rgba(0,0,0,0)}.pswp:focus{outline:0}.pswp *{box-sizing:border-box}.pswp img{max-width:none}.pswp--open{display:block}.pswp,.pswp__bg{transform:translateZ(0);will-change:opacity}.pswp__bg{opacity:.005;background:var(--pswp-bg)}.pswp,.pswp__scroll-wrap{overflow:hidden}.pswp__scroll-wrap,.pswp__bg,.pswp__container,.pswp__item,.pswp__content,.pswp__img,.pswp__zoom-wrap{position:absolute;top:0;left:0;width:100%;height:100%}.pswp__img,.pswp__zoom-wrap{width:auto;height:auto}.pswp--click-to-zoom.pswp--zoom-allowed .pswp__img{cursor:-webkit-zoom-in;cursor:-moz-zoom-in;cursor:zoom-in}.pswp--click-to-zoom.pswp--zoomed-in .pswp__img{cursor:move;cursor:-webkit-grab;cursor:-moz-grab;cursor:grab}.pswp--click-to-zoom.pswp--zoomed-in .pswp__img:active{cursor:-webkit-grabbing;cursor:-moz-grabbing;cursor:grabbing}.pswp--no-mouse-drag.pswp--zoomed-in .pswp__img,.pswp--no-mouse-drag.pswp--zoomed-in .pswp__img:active,.pswp__img{cursor:-webkit-zoom-out;cursor:-moz-zoom-out;cursor:zoom-out}.pswp__container,.pswp__img,.pswp__button,.pswp__counter{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.pswp__item{z-index:1;overflow:hidden}.pswp__hidden{display:none!important}.pswp__content{pointer-events:none}.pswp__content>*{pointer-events:auto}.pswp__error-msg-container{display:grid}.pswp__error-msg{margin:auto;font-size:1em;line-height:1;color:var(--pswp-error-text-color)}.pswp .pswp__hide-on-close{opacity:.005;will-change:opacity;transition:opacity var(--pswp-transition-duration) cubic-bezier(.4,0,.22,1);z-index:10;pointer-events:none}.pswp--ui-visible .pswp__hide-on-close{opacity:1;pointer-events:auto}.pswp__button{position:relative;display:block;width:50px;height:60px;padding:0;margin:0;overflow:hidden;cursor:pointer;background:none;border:0;box-shadow:none;opacity:.85;-webkit-appearance:none;-webkit-touch-callout:none}.pswp__button:hover,.pswp__button:active,.pswp__button:focus{transition:none;padding:0;background:none;border:0;box-shadow:none;opacity:1}.pswp__button:disabled{opacity:.3;cursor:auto}.pswp__icn{fill:var(--pswp-icon-color);color:var(--pswp-icon-color-secondary)}.pswp__icn{position:absolute;top:14px;left:9px;width:32px;height:32px;overflow:hidden;pointer-events:none}.pswp__icn-shadow{stroke:var(--pswp-icon-stroke-color);stroke-width:var(--pswp-icon-stroke-width);fill:none}.pswp__icn:focus{outline:0}div.pswp__img--placeholder,.pswp__img--with-bg{background:var(--pswp-placeholder-bg)}.pswp__top-bar{position:absolute;left:0;top:0;width:100%;height:60px;display:flex;flex-direction:row;justify-content:flex-end;z-index:10;pointer-events:none!important}.pswp__top-bar>*{pointer-events:auto;will-change:opacity}.pswp__button--close{margin-right:6px}.pswp__button--arrow{position:absolute;width:75px;height:100px;top:50%;margin-top:-50px}.pswp__button--arrow:disabled{display:none;cursor:default}.pswp__button--arrow .pswp__icn{top:50%;margin-top:-30px;width:60px;height:60px;background:none;border-radius:0}.pswp--one-slide .pswp__button--arrow{display:none}.pswp--touch .pswp__button--arrow{visibility:hidden}.pswp--has_mouse .pswp__button--arrow{visibility:visible}.pswp__button--arrow--prev{right:auto;left:0}.pswp__button--arrow--next{right:0}.pswp__button--arrow--next .pswp__icn{left:auto;right:14px;transform:scaleX(-1)}.pswp__button--zoom{display:none}.pswp--zoom-allowed .pswp__button--zoom{display:block}.pswp--zoomed-in .pswp__zoom-icn-bar-v{display:none}.pswp__preloader{position:relative;overflow:hidden;width:50px;height:60px;margin-right:auto}.pswp__preloader .pswp__icn{opacity:0;transition:opacity .2s linear;animation:pswp-clockwise .6s linear infinite}.pswp__preloader--active .pswp__icn{opacity:.85}@keyframes pswp-clockwise{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.pswp__counter{height:30px;margin-top:15px;margin-inline-start:20px;font-size:14px;line-height:30px;color:var(--pswp-icon-color);text-shadow:1px 1px 3px var(--pswp-icon-color-secondary);opacity:.85}.pswp--one-slide .pswp__counter{display:none}", qi = "ehagaki-composer", _c = 1;
function Ec(e) {
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
const xc = "--ehagaki-icon-", kc = /--ehagaki-icon-([0-9a-f]+)/g;
function Ac(e) {
  if (e.length === 0 || e.length % 2 !== 0) return null;
  const t = Array.from(
    { length: e.length / 2 },
    (n, r) => String.fromCharCode(
      Number.parseInt(e.slice(r * 2, r * 2 + 2), 16)
    )
  ).join("");
  return /^[A-Za-z0-9._-]+\.svg$/.test(t) ? t : null;
}
function Vi(e, t, n) {
  const r = /* @__PURE__ */ new Set();
  for (const i of e.querySelectorAll("style"))
    for (const o of i.textContent?.matchAll(kc) ?? [])
      r.add(o[0]);
  for (const i of r) {
    const o = Ac(i.slice(xc.length));
    o && t.style.setProperty(
      i,
      `url("${new URL(`icons/${o}`, n).href}")`
    );
  }
}
let Ft = null;
function Le(e, t) {
  const n = new Error(t);
  return n.name = e, n;
}
function Sc(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function Rc(e) {
  if (!Sc(e))
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
function $c(e) {
  return e.replaceAll(/:root:is\(\s*\.light\s*,\s*\.dark\s*\)/g, ":host(:is(.light, .dark))").replaceAll(":root", ":host").replace(`html,
body,
#app`, `:host,
.ehagaki-web-component-shell`).replace("#app {", ".ehagaki-web-component-shell {").replace("body {", ".ehagaki-web-component-shell {");
}
function Tc() {
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
let Cc = class extends HTMLElement {
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
    if (Ft && Ft !== this) {
      const n = Le(
        "multiple_instances_unsupported",
        "Only one ehagaki-composer can be connected in a document."
      );
      this.fail("multiple_instances_unsupported", n.message, n);
      return;
    }
    this.#n !== "pending" && (this.#l = this.createReadyPromise(), this.#n = "pending"), Ft = this, this.#o = this.mountApp();
  }
  disconnectedCallback() {
    this.#a += 1, this.#c = null, this.#r = !1, this.onDisconnected(), this.#u?.disconnect(), this.#u = null, Ft === this && (Ft = null), this.#t && (is(this.#t), this.#t = null), this.#e = null, this.#o = null, this.#n === "pending" && (this.#n = "rejected", this.#i?.(Le("disconnected", "Component was disconnected before it became ready.")));
  }
  whenReady() {
    return this.#l;
  }
  setContext(t) {
    return this.enqueue(async () => {
      await this.requireApp().setEmbedContext(t);
    });
  }
  setSettings(t) {
    return this.enqueue(async () => this.requireApp().setEmbedSettings(Rc(t)));
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
      r.textContent = `${$c(yc)}
${mc}
${Tc()}`;
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
        Vi(n, i, l);
      }), this.#u.observe(n, {
        childList: !0,
        subtree: !0
      }), vc({
        storage: gc(window.localStorage),
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
      if (!this.isConnected || t !== this.#a || (this.#t = Kr(a, {
        target: o,
        props: {
          notificationPort: Ec(this),
          onInitialized: () => {
            this.#d(t);
          },
          ...this.getAdditionalMountProps(t),
          onEditorEmptyChange: (c) => {
            this.#h(t, c);
          }
        }
      }), Vi(n, i, l), this.#e = this.#t, !this.isConnected || t !== this.#a)) return;
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
    !this.isConnected || t !== this.#a || !this.#r || this.#c === null || this.#n !== "pending" || (this.#n = "resolved", this.#p?.(), this.dispatchSafeEvent("ehagaki-ready", { apiVersion: _c }));
  }
  fail(t, n, r = Le(t, n)) {
    this.#n = "rejected", this.#i?.(r), this.dispatchSafeEvent("ehagaki-initialization-error", { code: t, message: n });
  }
};
function Zr(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function lt(e, t = "") {
  if (!Number.isSafeInteger(e) || e < 0) {
    const n = t && `"${t}" `;
    throw new Error(`${n}expected integer >= 0, got ${e}`);
  }
}
function z(e, t, n = "") {
  const r = Zr(e), i = e?.length, o = t !== void 0;
  if (!r || o && i !== t) {
    const s = n && `"${n}" `, l = o ? ` of length ${t}` : "", a = r ? `length=${i}` : `type=${typeof e}`;
    throw new Error(s + "expected Uint8Array" + l + ", got " + a);
  }
  return e;
}
function Wn(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash must wrapped by utils.createHasher");
  lt(e.outputLen), lt(e.blockLen);
}
function Un(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function Lc(e, t) {
  z(e, void 0, "digestInto() output");
  const n = t.outputLen;
  if (e.length < n)
    throw new Error('"digestInto() output" expected to be of length >=' + n);
}
function nn(...e) {
  for (let t = 0; t < e.length; t++)
    e[t].fill(0);
}
function sr(e) {
  return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function Ce(e, t) {
  return e << 32 - t | e >>> t;
}
const as = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", Bc = /* @__PURE__ */ Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function q(e) {
  if (z(e), as)
    return e.toHex();
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += Bc[e[n]];
  return t;
}
const De = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Fi(e) {
  if (e >= De._0 && e <= De._9)
    return e - De._0;
  if (e >= De.A && e <= De.F)
    return e - (De.A - 10);
  if (e >= De.a && e <= De.f)
    return e - (De.a - 10);
}
function G(e) {
  if (typeof e != "string")
    throw new Error("hex string expected, got " + typeof e);
  if (as)
    return Uint8Array.fromHex(e);
  const t = e.length, n = t / 2;
  if (t % 2)
    throw new Error("hex string expected, got unpadded hex of length " + t);
  const r = new Uint8Array(n);
  for (let i = 0, o = 0; i < n; i++, o += 2) {
    const s = Fi(e.charCodeAt(o)), l = Fi(e.charCodeAt(o + 1));
    if (s === void 0 || l === void 0) {
      const a = e[o] + e[o + 1];
      throw new Error('hex string expected, got non-hex character "' + a + '" at index ' + o);
    }
    r[i] = s * 16 + l;
  }
  return r;
}
function fe(...e) {
  let t = 0;
  for (let r = 0; r < e.length; r++) {
    const i = e[r];
    z(i), t += i.length;
  }
  const n = new Uint8Array(t);
  for (let r = 0, i = 0; r < e.length; r++) {
    const o = e[r];
    n.set(o, i), i += o.length;
  }
  return n;
}
function Oc(e, t = {}) {
  const n = (i, o) => e(o).update(i).digest(), r = e(void 0);
  return n.outputLen = r.outputLen, n.blockLen = r.blockLen, n.create = (i) => e(i), Object.assign(n, t), Object.freeze(n);
}
function Vt(e = 32) {
  const t = typeof globalThis == "object" ? globalThis.crypto : null;
  if (typeof t?.getRandomValues != "function")
    throw new Error("crypto.getRandomValues must be defined");
  return t.getRandomValues(new Uint8Array(e));
}
const Ic = (e) => ({
  oid: Uint8Array.from([6, 9, 96, 134, 72, 1, 101, 3, 4, 2, e])
});
function Nc(e, t, n) {
  return e & t ^ ~e & n;
}
function Uc(e, t, n) {
  return e & t ^ e & n ^ t & n;
}
class Mc {
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
    this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = i, this.buffer = new Uint8Array(t), this.view = sr(this.buffer);
  }
  update(t) {
    Un(this), z(t);
    const { view: n, buffer: r, blockLen: i } = this, o = t.length;
    for (let s = 0; s < o; ) {
      const l = Math.min(i - this.pos, o - s);
      if (l === i) {
        const a = sr(t);
        for (; i <= o - s; s += i)
          this.process(a, s);
        continue;
      }
      r.set(t.subarray(s, s + l), this.pos), this.pos += l, s += l, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Un(this), Lc(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: o } = this;
    let { pos: s } = this;
    n[s++] = 128, nn(this.buffer.subarray(s)), this.padOffset > i - s && (this.process(r, 0), s = 0);
    for (let f = s; f < i; f++)
      n[f] = 0;
    r.setBigUint64(i - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const l = sr(t), a = this.outputLen;
    if (a % 4)
      throw new Error("_sha2: outputLen must be aligned to 32bit");
    const c = a / 4, u = this.get();
    if (c > u.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let f = 0; f < c; f++)
      l.setUint32(4 * f, u[f], o);
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
const Xe = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), zc = /* @__PURE__ */ Uint32Array.from([
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
class Dc extends Mc {
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
    for (let f = 0; f < 16; f++, n += 4)
      Je[f] = t.getUint32(n, !1);
    for (let f = 16; f < 64; f++) {
      const d = Je[f - 15], h = Je[f - 2], p = Ce(d, 7) ^ Ce(d, 18) ^ d >>> 3, b = Ce(h, 17) ^ Ce(h, 19) ^ h >>> 10;
      Je[f] = b + Je[f - 7] + p + Je[f - 16] | 0;
    }
    let { A: r, B: i, C: o, D: s, E: l, F: a, G: c, H: u } = this;
    for (let f = 0; f < 64; f++) {
      const d = Ce(l, 6) ^ Ce(l, 11) ^ Ce(l, 25), h = u + d + Nc(l, a, c) + zc[f] + Je[f] | 0, b = (Ce(r, 2) ^ Ce(r, 13) ^ Ce(r, 22)) + Uc(r, i, o) | 0;
      u = c, c = a, a = l, l = s + h | 0, s = o, o = i, i = r, r = h + b | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, o = o + this.C | 0, s = s + this.D | 0, l = l + this.E | 0, a = a + this.F | 0, c = c + this.G | 0, u = u + this.H | 0, this.set(r, i, o, s, l, a, c, u);
  }
  roundClean() {
    nn(Je);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), nn(this.buffer);
  }
}
class Pc extends Dc {
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
const Me = /* @__PURE__ */ Oc(
  () => new Pc(),
  /* @__PURE__ */ Ic(1)
);
const Gr = /* @__PURE__ */ BigInt(0), Rr = /* @__PURE__ */ BigInt(1);
function Mn(e, t = "") {
  if (typeof e != "boolean") {
    const n = t && `"${t}" `;
    throw new Error(n + "expected boolean, got type=" + typeof e);
  }
  return e;
}
function ls(e) {
  if (typeof e == "bigint") {
    if (!kn(e))
      throw new Error("positive bigint expected, got " + e);
  } else
    lt(e);
  return e;
}
function gn(e) {
  const t = ls(e).toString(16);
  return t.length & 1 ? "0" + t : t;
}
function cs(e) {
  if (typeof e != "string")
    throw new Error("hex string expected, got " + typeof e);
  return e === "" ? Gr : BigInt("0x" + e);
}
function cn(e) {
  return cs(q(e));
}
function us(e) {
  return cs(q(Hc(z(e)).reverse()));
}
function Wr(e, t) {
  lt(t), e = ls(e);
  const n = G(e.toString(16).padStart(t * 2, "0"));
  if (n.length !== t)
    throw new Error("number too large");
  return n;
}
function fs(e, t) {
  return Wr(e, t).reverse();
}
function Hc(e) {
  return Uint8Array.from(e);
}
function jc(e) {
  return Uint8Array.from(e, (t, n) => {
    const r = t.charCodeAt(0);
    if (t.length !== 1 || r > 127)
      throw new Error(`string contains non-ASCII character "${e[n]}" with code ${r} at position ${n}`);
    return r;
  });
}
const kn = (e) => typeof e == "bigint" && Gr <= e;
function qc(e, t, n) {
  return kn(e) && kn(t) && kn(n) && t <= e && e < n;
}
function Vc(e, t, n, r) {
  if (!qc(t, n, r))
    throw new Error("expected valid " + e + ": " + n + " <= n < " + r + ", got " + t);
}
function Fc(e) {
  let t;
  for (t = 0; e > Gr; e >>= Rr, t += 1)
    ;
  return t;
}
const Yr = (e) => (Rr << BigInt(e)) - Rr;
function Kc(e, t, n) {
  if (lt(e, "hashLen"), lt(t, "qByteLen"), typeof n != "function")
    throw new Error("hmacFn must be a function");
  const r = (v) => new Uint8Array(v), i = Uint8Array.of(), o = Uint8Array.of(0), s = Uint8Array.of(1), l = 1e3;
  let a = r(e), c = r(e), u = 0;
  const f = () => {
    a.fill(1), c.fill(0), u = 0;
  }, d = (...v) => n(c, fe(a, ...v)), h = (v = i) => {
    c = d(o, v), a = d(), v.length !== 0 && (c = d(s, v), a = d());
  }, p = () => {
    if (u++ >= l)
      throw new Error("drbg: tried max amount of iterations");
    let v = 0;
    const m = [];
    for (; v < t; ) {
      a = d();
      const S = a.slice();
      m.push(S), v += a.length;
    }
    return fe(...m);
  };
  return (v, m) => {
    f(), h(v);
    let S;
    for (; !(S = m(p())); )
      h();
    return f(), S;
  };
}
function Xr(e, t = {}, n = {}) {
  if (!e || typeof e != "object")
    throw new Error("expected valid options object");
  function r(o, s, l) {
    const a = e[o];
    if (l && a === void 0)
      return;
    const c = typeof a;
    if (c !== s || a === null)
      throw new Error(`param "${o}" is invalid: expected ${s}, got ${c}`);
  }
  const i = (o, s) => Object.entries(o).forEach(([l, a]) => r(l, a, s));
  i(t, !1), i(n, !0);
}
function Ki(e) {
  const t = /* @__PURE__ */ new WeakMap();
  return (n, ...r) => {
    const i = t.get(n);
    if (i !== void 0)
      return i;
    const o = e(n, ...r);
    return t.set(n, o), o;
  };
}
const de = /* @__PURE__ */ BigInt(0), le = /* @__PURE__ */ BigInt(1), gt = /* @__PURE__ */ BigInt(2), ds = /* @__PURE__ */ BigInt(3), hs = /* @__PURE__ */ BigInt(4), ps = /* @__PURE__ */ BigInt(5), Zc = /* @__PURE__ */ BigInt(7), gs = /* @__PURE__ */ BigInt(8), Gc = /* @__PURE__ */ BigInt(9), bs = /* @__PURE__ */ BigInt(16);
function xe(e, t) {
  const n = e % t;
  return n >= de ? n : t + n;
}
function ge(e, t, n) {
  let r = e;
  for (; t-- > de; )
    r *= r, r %= n;
  return r;
}
function Zi(e, t) {
  if (e === de)
    throw new Error("invert: expected non-zero number");
  if (t <= de)
    throw new Error("invert: expected positive modulus, got " + t);
  let n = xe(e, t), r = t, i = de, o = le;
  for (; n !== de; ) {
    const l = r / n, a = r % n, c = i - o * l;
    r = n, n = a, i = o, o = c;
  }
  if (r !== le)
    throw new Error("invert: does not exist");
  return xe(i, t);
}
function Jr(e, t, n) {
  if (!e.eql(e.sqr(t), n))
    throw new Error("Cannot find square root");
}
function ws(e, t) {
  const n = (e.ORDER + le) / hs, r = e.pow(t, n);
  return Jr(e, r, t), r;
}
function Wc(e, t) {
  const n = (e.ORDER - ps) / gs, r = e.mul(t, gt), i = e.pow(r, n), o = e.mul(t, i), s = e.mul(e.mul(o, gt), i), l = e.mul(o, e.sub(s, e.ONE));
  return Jr(e, l, t), l;
}
function Yc(e) {
  const t = Yn(e), n = vs(e), r = n(t, t.neg(t.ONE)), i = n(t, r), o = n(t, t.neg(r)), s = (e + Zc) / bs;
  return (l, a) => {
    let c = l.pow(a, s), u = l.mul(c, r);
    const f = l.mul(c, i), d = l.mul(c, o), h = l.eql(l.sqr(u), a), p = l.eql(l.sqr(f), a);
    c = l.cmov(c, u, h), u = l.cmov(d, f, p);
    const b = l.eql(l.sqr(u), a), v = l.cmov(c, u, b);
    return Jr(l, v, a), v;
  };
}
function vs(e) {
  if (e < ds)
    throw new Error("sqrt is not defined for small field");
  let t = e - le, n = 0;
  for (; t % gt === de; )
    t /= gt, n++;
  let r = gt;
  const i = Yn(e);
  for (; Gi(i, r) === 1; )
    if (r++ > 1e3)
      throw new Error("Cannot find square root: probably non-prime P");
  if (n === 1)
    return ws;
  let o = i.pow(r, t);
  const s = (t + le) / gt;
  return function(a, c) {
    if (a.is0(c))
      return c;
    if (Gi(a, c) !== 1)
      throw new Error("Cannot find square root");
    let u = n, f = a.mul(a.ONE, o), d = a.pow(c, t), h = a.pow(c, s);
    for (; !a.eql(d, a.ONE); ) {
      if (a.is0(d))
        return a.ZERO;
      let p = 1, b = a.sqr(d);
      for (; !a.eql(b, a.ONE); )
        if (p++, b = a.sqr(b), p === u)
          throw new Error("Cannot find square root");
      const v = le << BigInt(u - p - 1), m = a.pow(f, v);
      u = p, f = a.sqr(m), d = a.mul(d, f), h = a.mul(h, m);
    }
    return h;
  };
}
function Xc(e) {
  return e % hs === ds ? ws : e % gs === ps ? Wc : e % bs === Gc ? Yc(e) : vs(e);
}
const Jc = [
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
function Qc(e) {
  const t = {
    ORDER: "bigint",
    BYTES: "number",
    BITS: "number"
  }, n = Jc.reduce((r, i) => (r[i] = "function", r), t);
  return Xr(e, n), e;
}
function eu(e, t, n) {
  if (n < de)
    throw new Error("invalid exponent, negatives unsupported");
  if (n === de)
    return e.ONE;
  if (n === le)
    return t;
  let r = e.ONE, i = t;
  for (; n > de; )
    n & le && (r = e.mul(r, i)), i = e.sqr(i), n >>= le;
  return r;
}
function ys(e, t, n = !1) {
  const r = new Array(t.length).fill(n ? e.ZERO : void 0), i = t.reduce((s, l, a) => e.is0(l) ? s : (r[a] = s, e.mul(s, l)), e.ONE), o = e.inv(i);
  return t.reduceRight((s, l, a) => e.is0(l) ? s : (r[a] = e.mul(s, r[a]), e.mul(s, l)), o), r;
}
function Gi(e, t) {
  const n = (e.ORDER - le) / gt, r = e.pow(t, n), i = e.eql(r, e.ONE), o = e.eql(r, e.ZERO), s = e.eql(r, e.neg(e.ONE));
  if (!i && !o && !s)
    throw new Error("invalid Legendre symbol result");
  return i ? 1 : o ? 0 : -1;
}
function tu(e, t) {
  t !== void 0 && lt(t);
  const n = t !== void 0 ? t : e.toString(2).length, r = Math.ceil(n / 8);
  return { nBitLength: n, nByteLength: r };
}
class nu {
  ORDER;
  BITS;
  BYTES;
  isLE;
  ZERO = de;
  ONE = le;
  _lengths;
  _sqrt;
  // cached sqrt
  _mod;
  constructor(t, n = {}) {
    if (t <= de)
      throw new Error("invalid field: expected ORDER > 0, got " + t);
    let r;
    this.isLE = !1, n != null && typeof n == "object" && (typeof n.BITS == "number" && (r = n.BITS), typeof n.sqrt == "function" && (this.sqrt = n.sqrt), typeof n.isLE == "boolean" && (this.isLE = n.isLE), n.allowedLengths && (this._lengths = n.allowedLengths?.slice()), typeof n.modFromBytes == "boolean" && (this._mod = n.modFromBytes));
    const { nBitLength: i, nByteLength: o } = tu(t, r);
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
    return de <= t && t < this.ORDER;
  }
  is0(t) {
    return t === de;
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
    return eu(this, t, n);
  }
  div(t, n) {
    return xe(t * Zi(n, this.ORDER), this.ORDER);
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
    return Zi(t, this.ORDER);
  }
  sqrt(t) {
    return this._sqrt || (this._sqrt = Xc(this.ORDER)), this._sqrt(this, t);
  }
  toBytes(t) {
    return this.isLE ? fs(t, this.BYTES) : Wr(t, this.BYTES);
  }
  fromBytes(t, n = !1) {
    z(t);
    const { _lengths: r, BYTES: i, isLE: o, ORDER: s, _mod: l } = this;
    if (r) {
      if (!r.includes(t.length) || t.length > i)
        throw new Error("Field.fromBytes: expected " + r + " bytes, got " + t.length);
      const c = new Uint8Array(i);
      c.set(t, o ? 0 : c.length - t.length), t = c;
    }
    if (t.length !== i)
      throw new Error("Field.fromBytes: expected " + i + " bytes, got " + t.length);
    let a = o ? us(t) : cn(t);
    if (l && (a = xe(a, s)), !n && !this.isValid(a))
      throw new Error("invalid field element: outside of range 0..ORDER");
    return a;
  }
  // TODO: we don't need it here, move out to separate fn
  invertBatch(t) {
    return ys(this, t);
  }
  // We can't move this out because Fp6, Fp12 implement it
  // and it's unclear what to return in there.
  cmov(t, n, r) {
    return r ? n : t;
  }
}
function Yn(e, t = {}) {
  return new nu(e, t);
}
function ms(e) {
  if (typeof e != "bigint")
    throw new Error("field order must be bigint");
  const t = e.toString(2).length;
  return Math.ceil(t / 8);
}
function _s(e) {
  const t = ms(e);
  return t + Math.ceil(t / 2);
}
function Es(e, t, n = !1) {
  z(e);
  const r = e.length, i = ms(t), o = _s(t);
  if (r < 16 || r < o || r > 1024)
    throw new Error("expected " + o + "-1024 bytes of input, got " + r);
  const s = n ? us(e) : cn(e), l = xe(s, t - le) + le;
  return n ? fs(l, i) : Wr(l, i);
}
const Ht = /* @__PURE__ */ BigInt(0), bt = /* @__PURE__ */ BigInt(1);
function zn(e, t) {
  const n = t.negate();
  return e ? n : t;
}
function Wi(e, t) {
  const n = ys(e.Fp, t.map((r) => r.Z));
  return t.map((r, i) => e.fromAffine(r.toAffine(n[i])));
}
function xs(e, t) {
  if (!Number.isSafeInteger(e) || e <= 0 || e > t)
    throw new Error("invalid window size, expected [1.." + t + "], got W=" + e);
}
function ar(e, t) {
  xs(e, t);
  const n = Math.ceil(t / e) + 1, r = 2 ** (e - 1), i = 2 ** e, o = Yr(e), s = BigInt(e);
  return { windows: n, windowSize: r, mask: o, maxNumber: i, shiftBy: s };
}
function Yi(e, t, n) {
  const { windowSize: r, mask: i, maxNumber: o, shiftBy: s } = n;
  let l = Number(e & i), a = e >> s;
  l > r && (l -= o, a += bt);
  const c = t * r, u = c + Math.abs(l) - 1, f = l === 0, d = l < 0, h = t % 2 !== 0;
  return { nextN: a, offset: u, isZero: f, isNeg: d, isNegF: h, offsetF: c };
}
const lr = /* @__PURE__ */ new WeakMap(), ks = /* @__PURE__ */ new WeakMap();
function cr(e) {
  return ks.get(e) || 1;
}
function Xi(e) {
  if (e !== Ht)
    throw new Error("invalid wNAF");
}
class ru {
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
    for (; n > Ht; )
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
    const { windows: r, windowSize: i } = ar(n, this.bits), o = [];
    let s = t, l = s;
    for (let a = 0; a < r; a++) {
      l = s, o.push(l);
      for (let c = 1; c < i; c++)
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
    const s = ar(t, this.bits);
    for (let l = 0; l < s.windows; l++) {
      const { nextN: a, offset: c, isZero: u, isNeg: f, isNegF: d, offsetF: h } = Yi(r, l, s);
      r = a, u ? o = o.add(zn(d, n[h])) : i = i.add(zn(f, n[c]));
    }
    return Xi(r), { p: i, f: o };
  }
  /**
   * Implements ec unsafe (non const-time) multiplication using precomputed tables and w-ary non-adjacent form.
   * @param acc accumulator point to add result of multiplication
   * @returns point
   */
  wNAFUnsafe(t, n, r, i = this.ZERO) {
    const o = ar(t, this.bits);
    for (let s = 0; s < o.windows && r !== Ht; s++) {
      const { nextN: l, offset: a, isZero: c, isNeg: u } = Yi(r, s, o);
      if (r = l, !c) {
        const f = n[a];
        i = i.add(u ? f.negate() : f);
      }
    }
    return Xi(r), i;
  }
  getPrecomputes(t, n, r) {
    let i = lr.get(n);
    return i || (i = this.precomputeWindow(n, t), t !== 1 && (typeof r == "function" && (i = r(i)), lr.set(n, i))), i;
  }
  cached(t, n, r) {
    const i = cr(t);
    return this.wNAF(i, this.getPrecomputes(i, t, r), n);
  }
  unsafe(t, n, r, i) {
    const o = cr(t);
    return o === 1 ? this._unsafeLadder(t, n, i) : this.wNAFUnsafe(o, this.getPrecomputes(o, t, r), n, i);
  }
  // We calculate precomputes for elliptic curve point multiplication
  // using windowed method. This specifies window size and
  // stores precomputed values. Usually only base point would be precomputed.
  createCache(t, n) {
    xs(n, this.bits), ks.set(t, n), lr.delete(t);
  }
  hasCache(t) {
    return cr(t) !== 1;
  }
}
function iu(e, t, n, r) {
  let i = t, o = e.ZERO, s = e.ZERO;
  for (; n > Ht || r > Ht; )
    n & bt && (o = o.add(i)), r & bt && (s = s.add(i)), i = i.double(), n >>= bt, r >>= bt;
  return { p1: o, p2: s };
}
function Ji(e, t, n) {
  if (t) {
    if (t.ORDER !== e)
      throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
    return Qc(t), t;
  } else
    return Yn(e, { isLE: n });
}
function ou(e, t, n = {}, r) {
  if (r === void 0 && (r = e === "edwards"), !t || typeof t != "object")
    throw new Error(`expected valid ${e} CURVE object`);
  for (const a of ["p", "n", "h"]) {
    const c = t[a];
    if (!(typeof c == "bigint" && c > Ht))
      throw new Error(`CURVE.${a} must be positive bigint`);
  }
  const i = Ji(t.p, n.Fp, r), o = Ji(t.n, n.Fn, r), l = ["Gx", "Gy", "a", "b"];
  for (const a of l)
    if (!i.isValid(t[a]))
      throw new Error(`CURVE.${a} must be valid field element of CURVE.Fp`);
  return t = Object.freeze(Object.assign({}, t)), { CURVE: t, Fp: i, Fn: o };
}
function As(e, t) {
  return function(r) {
    const i = e(r);
    return { secretKey: i, publicKey: t(i) };
  };
}
class Ss {
  oHash;
  iHash;
  blockLen;
  outputLen;
  finished = !1;
  destroyed = !1;
  constructor(t, n) {
    if (Wn(t), z(n, void 0, "key"), this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const r = this.blockLen, i = new Uint8Array(r);
    i.set(n.length > r ? t.create().update(n).digest() : n);
    for (let o = 0; o < i.length; o++)
      i[o] ^= 54;
    this.iHash.update(i), this.oHash = t.create();
    for (let o = 0; o < i.length; o++)
      i[o] ^= 106;
    this.oHash.update(i), nn(i);
  }
  update(t) {
    return Un(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    Un(this), z(t, this.outputLen, "output"), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
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
const un = (e, t, n) => new Ss(e, t).update(n).digest();
un.create = (e, t) => new Ss(e, t);
const Qi = (e, t) => (e + (e >= 0 ? t : -t) / Rs) / t;
function su(e, t, n) {
  const [[r, i], [o, s]] = t, l = Qi(s * e, n), a = Qi(-i * e, n);
  let c = e - l * r - a * o, u = -l * i - a * s;
  const f = c < Ve, d = u < Ve;
  f && (c = -c), d && (u = -u);
  const h = Yr(Math.ceil(Fc(n) / 2)) + Bt;
  if (c < Ve || c >= h || u < Ve || u >= h)
    throw new Error("splitScalar (endomorphism): failed, k=" + e);
  return { k1neg: f, k1: c, k2neg: d, k2: u };
}
function $r(e) {
  if (!["compact", "recovered", "der"].includes(e))
    throw new Error('Signature format must be "compact", "recovered", or "der"');
  return e;
}
function ur(e, t) {
  const n = {};
  for (let r of Object.keys(t))
    n[r] = e[r] === void 0 ? t[r] : e[r];
  return Mn(n.lowS, "lowS"), Mn(n.prehash, "prehash"), n.format !== void 0 && $r(n.format), n;
}
class au extends Error {
  constructor(t = "") {
    super(t);
  }
}
const et = {
  // asn.1 DER encoding utils
  Err: au,
  // Basic building block is TLV (Tag-Length-Value)
  _tlv: {
    encode: (e, t) => {
      const { Err: n } = et;
      if (e < 0 || e > 256)
        throw new n("tlv.encode: wrong tag");
      if (t.length & 1)
        throw new n("tlv.encode: unpadded data");
      const r = t.length / 2, i = gn(r);
      if (i.length / 2 & 128)
        throw new n("tlv.encode: long form length too big");
      const o = r > 127 ? gn(i.length / 2 | 128) : "";
      return gn(e) + o + i + t;
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
        const c = t.subarray(r, r + a);
        if (c.length !== a)
          throw new n("tlv.decode: length bytes not complete");
        if (c[0] === 0)
          throw new n("tlv.decode(long): zero leftmost byte");
        for (const u of c)
          s = s << 8 | u;
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
      const { Err: t } = et;
      if (e < Ve)
        throw new t("integer: negative integers are not allowed");
      let n = gn(e);
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
      return cn(e);
    }
  },
  toSig(e) {
    const { Err: t, _int: n, _tlv: r } = et, i = z(e, void 0, "signature"), { v: o, l: s } = r.decode(48, i);
    if (s.length)
      throw new t("invalid signature: left bytes after parsing");
    const { v: l, l: a } = r.decode(2, o), { v: c, l: u } = r.decode(2, a);
    if (u.length)
      throw new t("invalid signature: left bytes after parsing");
    return { r: n.decode(l), s: n.decode(c) };
  },
  hexFromSig(e) {
    const { _tlv: t, _int: n } = et, r = t.encode(2, n.encode(e.r)), i = t.encode(2, n.encode(e.s)), o = r + i;
    return t.encode(48, o);
  }
}, Ve = BigInt(0), Bt = BigInt(1), Rs = BigInt(2), bn = BigInt(3), lu = BigInt(4);
function cu(e, t = {}) {
  const n = ou("weierstrass", e, t), { Fp: r, Fn: i } = n;
  let o = n.CURVE;
  const { h: s, n: l } = o;
  Xr(t, {}, {
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
  const c = Ts(r, i);
  function u() {
    if (!r.isOdd)
      throw new Error("compression is not supported: Field does not have .isOdd()");
  }
  function f(C, y, w) {
    const { x: g, y: _ } = y.toAffine(), x = r.toBytes(g);
    if (Mn(w, "isCompressed"), w) {
      u();
      const A = !r.isOdd(_);
      return fe($s(A), x);
    } else
      return fe(Uint8Array.of(4), x, r.toBytes(_));
  }
  function d(C) {
    z(C, void 0, "Point");
    const { publicKey: y, publicKeyUncompressed: w } = c, g = C.length, _ = C[0], x = C.subarray(1);
    if (g === y && (_ === 2 || _ === 3)) {
      const A = r.fromBytes(x);
      if (!r.isValid(A))
        throw new Error("bad point: is not on curve, wrong x");
      const k = b(A);
      let E;
      try {
        E = r.sqrt(k);
      } catch (V) {
        const j = V instanceof Error ? ": " + V.message : "";
        throw new Error("bad point: is not on curve, sqrt error" + j);
      }
      u();
      const R = r.isOdd(E);
      return (_ & 1) === 1 !== R && (E = r.neg(E)), { x: A, y: E };
    } else if (g === w && _ === 4) {
      const A = r.BYTES, k = r.fromBytes(x.subarray(0, A)), E = r.fromBytes(x.subarray(A, A * 2));
      if (!v(k, E))
        throw new Error("bad point: is not on curve");
      return { x: k, y: E };
    } else
      throw new Error(`bad point: got length ${g}, expected compressed=${y} or uncompressed=${w}`);
  }
  const h = t.toBytes || f, p = t.fromBytes || d;
  function b(C) {
    const y = r.sqr(C), w = r.mul(y, C);
    return r.add(r.add(w, r.mul(C, o.a)), o.b);
  }
  function v(C, y) {
    const w = r.sqr(y), g = b(C);
    return r.eql(w, g);
  }
  if (!v(o.Gx, o.Gy))
    throw new Error("bad curve params: generator point");
  const m = r.mul(r.pow(o.a, bn), lu), S = r.mul(r.sqr(o.b), BigInt(27));
  if (r.is0(r.add(m, S)))
    throw new Error("bad curve params: a or b");
  function B(C, y, w = !1) {
    if (!r.isValid(y) || w && r.is0(y))
      throw new Error(`bad point coordinate ${C}`);
    return y;
  }
  function D(C) {
    if (!(C instanceof T))
      throw new Error("Weierstrass Point expected");
  }
  function pe(C) {
    if (!a || !a.basises)
      throw new Error("no endo");
    return su(C, a.basises, i.ORDER);
  }
  const H = Ki((C, y) => {
    const { X: w, Y: g, Z: _ } = C;
    if (r.eql(_, r.ONE))
      return { x: w, y: g };
    const x = C.is0();
    y == null && (y = x ? r.ONE : r.inv(_));
    const A = r.mul(w, y), k = r.mul(g, y), E = r.mul(_, y);
    if (x)
      return { x: r.ZERO, y: r.ZERO };
    if (!r.eql(E, r.ONE))
      throw new Error("invZ was invalid");
    return { x: A, y: k };
  }), J = Ki((C) => {
    if (C.is0()) {
      if (t.allowInfinityPoint && !r.is0(C.Y))
        return;
      throw new Error("bad point: ZERO");
    }
    const { x: y, y: w } = C.toAffine();
    if (!r.isValid(y) || !r.isValid(w))
      throw new Error("bad point: x or y not field elements");
    if (!v(y, w))
      throw new Error("bad point: equation left != right");
    if (!C.isTorsionFree())
      throw new Error("bad point: not in prime-order subgroup");
    return !0;
  });
  function W(C, y, w, g, _) {
    return w = new T(r.mul(w.X, C), w.Y, w.Z), y = zn(g, y), w = zn(_, w), y.add(w);
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
    constructor(y, w, g) {
      this.X = B("x", y), this.Y = B("y", w, !0), this.Z = B("z", g), Object.freeze(this);
    }
    static CURVE() {
      return o;
    }
    /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
    static fromAffine(y) {
      const { x: w, y: g } = y || {};
      if (!y || !r.isValid(w) || !r.isValid(g))
        throw new Error("invalid affine point");
      if (y instanceof T)
        throw new Error("projective point not allowed");
      return r.is0(w) && r.is0(g) ? T.ZERO : new T(w, g, r.ONE);
    }
    static fromBytes(y) {
      const w = T.fromAffine(p(z(y, void 0, "point")));
      return w.assertValidity(), w;
    }
    static fromHex(y) {
      return T.fromBytes(G(y));
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
    precompute(y = 8, w = !0) {
      return Y.createCache(this, y), w || this.multiply(bn), this;
    }
    // TODO: return `this`
    /** A point on curve is valid if it conforms to equation. */
    assertValidity() {
      J(this);
    }
    hasEvenY() {
      const { y } = this.toAffine();
      if (!r.isOdd)
        throw new Error("Field doesn't support isOdd");
      return !r.isOdd(y);
    }
    /** Compare one point to another. */
    equals(y) {
      D(y);
      const { X: w, Y: g, Z: _ } = this, { X: x, Y: A, Z: k } = y, E = r.eql(r.mul(w, k), r.mul(x, _)), R = r.eql(r.mul(g, k), r.mul(A, _));
      return E && R;
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
      const { a: y, b: w } = o, g = r.mul(w, bn), { X: _, Y: x, Z: A } = this;
      let k = r.ZERO, E = r.ZERO, R = r.ZERO, $ = r.mul(_, _), V = r.mul(x, x), j = r.mul(A, A), I = r.mul(_, x);
      return I = r.add(I, I), R = r.mul(_, A), R = r.add(R, R), k = r.mul(y, R), E = r.mul(g, j), E = r.add(k, E), k = r.sub(V, E), E = r.add(V, E), E = r.mul(k, E), k = r.mul(I, k), R = r.mul(g, R), j = r.mul(y, j), I = r.sub($, j), I = r.mul(y, I), I = r.add(I, R), R = r.add($, $), $ = r.add(R, $), $ = r.add($, j), $ = r.mul($, I), E = r.add(E, $), j = r.mul(x, A), j = r.add(j, j), $ = r.mul(j, I), k = r.sub(k, $), R = r.mul(j, V), R = r.add(R, R), R = r.add(R, R), new T(k, E, R);
    }
    // Renes-Costello-Batina exception-free addition formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 1
    // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
    add(y) {
      D(y);
      const { X: w, Y: g, Z: _ } = this, { X: x, Y: A, Z: k } = y;
      let E = r.ZERO, R = r.ZERO, $ = r.ZERO;
      const V = o.a, j = r.mul(o.b, bn);
      let I = r.mul(w, x), F = r.mul(g, A), ne = r.mul(_, k), Te = r.add(w, g), K = r.add(x, A);
      Te = r.mul(Te, K), K = r.add(I, F), Te = r.sub(Te, K), K = r.add(w, _);
      let oe = r.add(x, k);
      return K = r.mul(K, oe), oe = r.add(I, ne), K = r.sub(K, oe), oe = r.add(g, _), E = r.add(A, k), oe = r.mul(oe, E), E = r.add(F, ne), oe = r.sub(oe, E), $ = r.mul(V, K), E = r.mul(j, ne), $ = r.add(E, $), E = r.sub(F, $), $ = r.add(F, $), R = r.mul(E, $), F = r.add(I, I), F = r.add(F, I), ne = r.mul(V, ne), K = r.mul(j, K), F = r.add(F, ne), ne = r.sub(I, ne), ne = r.mul(V, ne), K = r.add(K, ne), I = r.mul(F, K), R = r.add(R, I), I = r.mul(oe, K), E = r.mul(Te, E), E = r.sub(E, I), I = r.mul(Te, F), $ = r.mul(oe, $), $ = r.add($, I), new T(E, R, $);
    }
    subtract(y) {
      return this.add(y.negate());
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
    multiply(y) {
      const { endo: w } = t;
      if (!i.isValidNot0(y))
        throw new Error("invalid scalar: out of range");
      let g, _;
      const x = (A) => Y.cached(this, A, (k) => Wi(T, k));
      if (w) {
        const { k1neg: A, k1: k, k2neg: E, k2: R } = pe(y), { p: $, f: V } = x(k), { p: j, f: I } = x(R);
        _ = V.add(I), g = W(w.beta, $, j, A, E);
      } else {
        const { p: A, f: k } = x(y);
        g = A, _ = k;
      }
      return Wi(T, [g, _])[0];
    }
    /**
     * Non-constant-time multiplication. Uses double-and-add algorithm.
     * It's faster, but should only be used when you don't care about
     * an exposed secret key e.g. sig verification, which works over *public* keys.
     */
    multiplyUnsafe(y) {
      const { endo: w } = t, g = this;
      if (!i.isValid(y))
        throw new Error("invalid scalar: out of range");
      if (y === Ve || g.is0())
        return T.ZERO;
      if (y === Bt)
        return g;
      if (Y.hasCache(this))
        return this.multiply(y);
      if (w) {
        const { k1neg: _, k1: x, k2neg: A, k2: k } = pe(y), { p1: E, p2: R } = iu(T, g, x, k);
        return W(w.beta, E, R, _, A);
      } else
        return Y.unsafe(g, y);
    }
    /**
     * Converts Projective point to affine (x, y) coordinates.
     * @param invertedZ Z^-1 (inverted zero) - optional, precomputation is useful for invertBatch
     */
    toAffine(y) {
      return H(this, y);
    }
    /**
     * Checks whether Point is free of torsion elements (is in prime subgroup).
     * Always torsion-free for cofactor=1 curves.
     */
    isTorsionFree() {
      const { isTorsionFree: y } = t;
      return s === Bt ? !0 : y ? y(T, this) : Y.unsafe(this, l).is0();
    }
    clearCofactor() {
      const { clearCofactor: y } = t;
      return s === Bt ? this : y ? y(T, this) : this.multiplyUnsafe(s);
    }
    isSmallOrder() {
      return this.multiplyUnsafe(s).is0();
    }
    toBytes(y = !0) {
      return Mn(y, "isCompressed"), this.assertValidity(), h(T, this, y);
    }
    toHex(y = !0) {
      return q(this.toBytes(y));
    }
    toString() {
      return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
    }
  }
  const ee = i.BITS, Y = new ru(T, t.endo ? Math.ceil(ee / 2) : ee);
  return T.BASE.precompute(8), T;
}
function $s(e) {
  return Uint8Array.of(e ? 2 : 3);
}
function Ts(e, t) {
  return {
    secretKey: t.BYTES,
    publicKey: 1 + e.BYTES,
    publicKeyUncompressed: 1 + 2 * e.BYTES,
    publicKeyHasPrefix: !0,
    signature: 2 * t.BYTES
  };
}
function uu(e, t = {}) {
  const { Fn: n } = e, r = t.randomBytes || Vt, i = Object.assign(Ts(e.Fp, n), { seed: _s(n.ORDER) });
  function o(h) {
    try {
      const p = n.fromBytes(h);
      return n.isValidNot0(p);
    } catch {
      return !1;
    }
  }
  function s(h, p) {
    const { publicKey: b, publicKeyUncompressed: v } = i;
    try {
      const m = h.length;
      return p === !0 && m !== b || p === !1 && m !== v ? !1 : !!e.fromBytes(h);
    } catch {
      return !1;
    }
  }
  function l(h = r(i.seed)) {
    return Es(z(h, i.seed, "seed"), n.ORDER);
  }
  function a(h, p = !0) {
    return e.BASE.multiply(n.fromBytes(h)).toBytes(p);
  }
  function c(h) {
    const { secretKey: p, publicKey: b, publicKeyUncompressed: v } = i;
    if (!Zr(h) || "_lengths" in n && n._lengths || p === b)
      return;
    const m = z(h, void 0, "key").length;
    return m === b || m === v;
  }
  function u(h, p, b = !0) {
    if (c(h) === !0)
      throw new Error("first arg must be private key");
    if (c(p) === !1)
      throw new Error("second arg must be public key");
    const v = n.fromBytes(h);
    return e.fromBytes(p).multiply(v).toBytes(b);
  }
  const f = {
    isValidSecretKey: o,
    isValidPublicKey: s,
    randomSecretKey: l
  }, d = As(l, a);
  return Object.freeze({ getPublicKey: a, getSharedSecret: u, keygen: d, Point: e, utils: f, lengths: i });
}
function fu(e, t, n = {}) {
  Wn(t), Xr(n, {}, {
    hmac: "function",
    lowS: "boolean",
    randomBytes: "function",
    bits2int: "function",
    bits2int_modN: "function"
  }), n = Object.assign({}, n);
  const r = n.randomBytes || Vt, i = n.hmac || ((w, g) => un(t, w, g)), { Fp: o, Fn: s } = e, { ORDER: l, BITS: a } = s, { keygen: c, getPublicKey: u, getSharedSecret: f, utils: d, lengths: h } = uu(e, n), p = {
    prehash: !0,
    lowS: typeof n.lowS == "boolean" ? n.lowS : !0,
    format: "compact",
    extraEntropy: !1
  }, b = l * Rs < o.ORDER;
  function v(w) {
    const g = l >> Bt;
    return w > g;
  }
  function m(w, g) {
    if (!s.isValidNot0(g))
      throw new Error(`invalid signature ${w}: out of range 1..Point.Fn.ORDER`);
    return g;
  }
  function S() {
    if (b)
      throw new Error('"recovered" sig type is not supported for cofactor >2 curves');
  }
  function B(w, g) {
    $r(g);
    const _ = h.signature, x = g === "compact" ? _ : g === "recovered" ? _ + 1 : void 0;
    return z(w, x);
  }
  class D {
    r;
    s;
    recovery;
    constructor(g, _, x) {
      if (this.r = m("r", g), this.s = m("s", _), x != null) {
        if (S(), ![0, 1, 2, 3].includes(x))
          throw new Error("invalid recovery id");
        this.recovery = x;
      }
      Object.freeze(this);
    }
    static fromBytes(g, _ = p.format) {
      B(g, _);
      let x;
      if (_ === "der") {
        const { r: R, s: $ } = et.toSig(z(g));
        return new D(R, $);
      }
      _ === "recovered" && (x = g[0], _ = "compact", g = g.subarray(1));
      const A = h.signature / 2, k = g.subarray(0, A), E = g.subarray(A, A * 2);
      return new D(s.fromBytes(k), s.fromBytes(E), x);
    }
    static fromHex(g, _) {
      return this.fromBytes(G(g), _);
    }
    assertRecovery() {
      const { recovery: g } = this;
      if (g == null)
        throw new Error("invalid recovery id: must be present");
      return g;
    }
    addRecoveryBit(g) {
      return new D(this.r, this.s, g);
    }
    recoverPublicKey(g) {
      const { r: _, s: x } = this, A = this.assertRecovery(), k = A === 2 || A === 3 ? _ + l : _;
      if (!o.isValid(k))
        throw new Error("invalid recovery id: sig.r+curve.n != R.x");
      const E = o.toBytes(k), R = e.fromBytes(fe($s((A & 1) === 0), E)), $ = s.inv(k), V = H(z(g, void 0, "msgHash")), j = s.create(-V * $), I = s.create(x * $), F = e.BASE.multiplyUnsafe(j).add(R.multiplyUnsafe(I));
      if (F.is0())
        throw new Error("invalid recovery: point at infinify");
      return F.assertValidity(), F;
    }
    // Signatures should be low-s, to prevent malleability.
    hasHighS() {
      return v(this.s);
    }
    toBytes(g = p.format) {
      if ($r(g), g === "der")
        return G(et.hexFromSig(this));
      const { r: _, s: x } = this, A = s.toBytes(_), k = s.toBytes(x);
      return g === "recovered" ? (S(), fe(Uint8Array.of(this.assertRecovery()), A, k)) : fe(A, k);
    }
    toHex(g) {
      return q(this.toBytes(g));
    }
  }
  const pe = n.bits2int || function(g) {
    if (g.length > 8192)
      throw new Error("input is too large");
    const _ = cn(g), x = g.length * 8 - a;
    return x > 0 ? _ >> BigInt(x) : _;
  }, H = n.bits2int_modN || function(g) {
    return s.create(pe(g));
  }, J = Yr(a);
  function W(w) {
    return Vc("num < 2^" + a, w, Ve, J), s.toBytes(w);
  }
  function T(w, g) {
    return z(w, void 0, "message"), g ? z(t(w), void 0, "prehashed message") : w;
  }
  function ee(w, g, _) {
    const { lowS: x, prehash: A, extraEntropy: k } = ur(_, p);
    w = T(w, A);
    const E = H(w), R = s.fromBytes(g);
    if (!s.isValidNot0(R))
      throw new Error("invalid private key");
    const $ = [W(R), W(E)];
    if (k != null && k !== !1) {
      const F = k === !0 ? r(h.secretKey) : k;
      $.push(z(F, void 0, "extraEntropy"));
    }
    const V = fe(...$), j = E;
    function I(F) {
      const ne = pe(F);
      if (!s.isValidNot0(ne))
        return;
      const Te = s.inv(ne), K = e.BASE.multiply(ne).toAffine(), oe = s.create(K.x);
      if (oe === Ve)
        return;
      const fn = s.create(Te * s.create(j + oe * R));
      if (fn === Ve)
        return;
      let Ci = (K.x === oe ? 0 : 2) | Number(K.y & Bt), Li = fn;
      return x && v(fn) && (Li = s.neg(fn), Ci ^= 1), new D(oe, Li, b ? void 0 : Ci);
    }
    return { seed: V, k2sig: I };
  }
  function Y(w, g, _ = {}) {
    const { seed: x, k2sig: A } = ee(w, g, _);
    return Kc(t.outputLen, s.BYTES, i)(x, A).toBytes(_.format);
  }
  function C(w, g, _, x = {}) {
    const { lowS: A, prehash: k, format: E } = ur(x, p);
    if (_ = z(_, void 0, "publicKey"), g = T(g, k), !Zr(w)) {
      const R = w instanceof D ? ", use sig.toBytes()" : "";
      throw new Error("verify expects Uint8Array signature" + R);
    }
    B(w, E);
    try {
      const R = D.fromBytes(w, E), $ = e.fromBytes(_);
      if (A && R.hasHighS())
        return !1;
      const { r: V, s: j } = R, I = H(g), F = s.inv(j), ne = s.create(I * F), Te = s.create(V * F), K = e.BASE.multiplyUnsafe(ne).add($.multiplyUnsafe(Te));
      return K.is0() ? !1 : s.create(K.x) === V;
    } catch {
      return !1;
    }
  }
  function y(w, g, _ = {}) {
    const { prehash: x } = ur(_, p);
    return g = T(g, x), D.fromBytes(w, "recovered").recoverPublicKey(g).toBytes();
  }
  return Object.freeze({
    keygen: c,
    getPublicKey: u,
    getSharedSecret: f,
    utils: d,
    lengths: h,
    Point: e,
    sign: Y,
    verify: C,
    recoverPublicKey: y,
    Signature: D,
    hash: t
  });
}
const Xn = {
  p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: BigInt(1),
  a: BigInt(0),
  b: BigInt(7),
  Gx: BigInt("0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"),
  Gy: BigInt("0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8")
}, du = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  basises: [
    [BigInt("0x3086d221a7d46bcde86c90e49284eb15"), -BigInt("0xe4437ed6010e88286f547fa90abfe4c3")],
    [BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), BigInt("0x3086d221a7d46bcde86c90e49284eb15")]
  ]
}, hu = /* @__PURE__ */ BigInt(0), Tr = /* @__PURE__ */ BigInt(2);
function pu(e) {
  const t = Xn.p, n = BigInt(3), r = BigInt(6), i = BigInt(11), o = BigInt(22), s = BigInt(23), l = BigInt(44), a = BigInt(88), c = e * e * e % t, u = c * c * e % t, f = ge(u, n, t) * u % t, d = ge(f, n, t) * u % t, h = ge(d, Tr, t) * c % t, p = ge(h, i, t) * h % t, b = ge(p, o, t) * p % t, v = ge(b, l, t) * b % t, m = ge(v, a, t) * v % t, S = ge(m, l, t) * b % t, B = ge(S, n, t) * u % t, D = ge(B, s, t) * p % t, pe = ge(D, r, t) * c % t, H = ge(pe, Tr, t);
  if (!Dn.eql(Dn.sqr(H), e))
    throw new Error("Cannot find square root");
  return H;
}
const Dn = Yn(Xn.p, { sqrt: pu }), kt = /* @__PURE__ */ cu(Xn, {
  Fp: Dn,
  endo: du
}), Qr = /* @__PURE__ */ fu(kt, Me), eo = {};
function Pn(e, ...t) {
  let n = eo[e];
  if (n === void 0) {
    const r = Me(jc(e));
    n = fe(r, r), eo[e] = n;
  }
  return Me(fe(n, ...t));
}
const ei = (e) => e.toBytes(!0).slice(1), ti = (e) => e % Tr === hu;
function Cr(e) {
  const { Fn: t, BASE: n } = kt, r = t.fromBytes(e), i = n.multiply(r);
  return { scalar: ti(i.y) ? r : t.neg(r), bytes: ei(i) };
}
function Cs(e) {
  const t = Dn;
  if (!t.isValidNot0(e))
    throw new Error("invalid x: Fail if x ≥ p");
  const n = t.create(e * e), r = t.create(n * e + BigInt(7));
  let i = t.sqrt(r);
  ti(i) || (i = t.neg(i));
  const o = kt.fromAffine({ x: e, y: i });
  return o.assertValidity(), o;
}
const Qt = cn;
function Ls(...e) {
  return kt.Fn.create(Qt(Pn("BIP0340/challenge", ...e)));
}
function to(e) {
  return Cr(e).bytes;
}
function gu(e, t, n = Vt(32)) {
  const { Fn: r } = kt, i = z(e, void 0, "message"), { bytes: o, scalar: s } = Cr(t), l = z(n, 32, "auxRand"), a = r.toBytes(s ^ Qt(Pn("BIP0340/aux", l))), c = Pn("BIP0340/nonce", a, o, i), { bytes: u, scalar: f } = Cr(c), d = Ls(u, o, i), h = new Uint8Array(64);
  if (h.set(u, 0), h.set(r.toBytes(r.create(f + d * s)), 32), !Bs(h, i, o))
    throw new Error("sign: Invalid signature produced");
  return h;
}
function Bs(e, t, n) {
  const { Fp: r, Fn: i, BASE: o } = kt, s = z(e, 64, "signature"), l = z(t, void 0, "message"), a = z(n, 32, "publicKey");
  try {
    const c = Cs(Qt(a)), u = Qt(s.subarray(0, 32));
    if (!r.isValidNot0(u))
      return !1;
    const f = Qt(s.subarray(32, 64));
    if (!i.isValidNot0(f))
      return !1;
    const d = Ls(i.toBytes(u), ei(c), l), h = o.multiplyUnsafe(f).add(c.multiplyUnsafe(i.neg(d))), { x: p, y: b } = h.toAffine();
    return !(h.is0() || !ti(b) || p !== u);
  } catch {
    return !1;
  }
}
const Kt = /* @__PURE__ */ (() => {
  const n = (r = Vt(48)) => Es(r, Xn.n);
  return {
    keygen: As(n, to),
    getPublicKey: to,
    sign: gu,
    verify: Bs,
    Point: kt,
    utils: {
      randomSecretKey: n,
      taggedHash: Pn,
      lift_x: Cs,
      pointToBytes: ei
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
function ni(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function bu(e) {
  if (!ni(e))
    throw new Error("Uint8Array expected");
}
function Os(e, t) {
  return Array.isArray(t) ? t.length === 0 ? !0 : e ? t.every((n) => typeof n == "string") : t.every((n) => Number.isSafeInteger(n)) : !1;
}
function wu(e) {
  if (typeof e != "function")
    throw new Error("function expected");
  return !0;
}
function Et(e, t) {
  if (typeof t != "string")
    throw new Error(`${e}: string expected`);
  return !0;
}
function ri(e) {
  if (!Number.isSafeInteger(e))
    throw new Error(`invalid integer: ${e}`);
}
function Lr(e) {
  if (!Array.isArray(e))
    throw new Error("array expected");
}
function Hn(e, t) {
  if (!Os(!0, t))
    throw new Error(`${e}: array of strings expected`);
}
function Is(e, t) {
  if (!Os(!1, t))
    throw new Error(`${e}: array of numbers expected`);
}
// @__NO_SIDE_EFFECTS__
function Ns(...e) {
  const t = (o) => o, n = (o, s) => (l) => o(s(l)), r = e.map((o) => o.encode).reduceRight(n, t), i = e.map((o) => o.decode).reduce(n, t);
  return { encode: r, decode: i };
}
// @__NO_SIDE_EFFECTS__
function Us(e) {
  const t = typeof e == "string" ? e.split("") : e, n = t.length;
  Hn("alphabet", t);
  const r = new Map(t.map((i, o) => [i, o]));
  return {
    encode: (i) => (Lr(i), i.map((o) => {
      if (!Number.isSafeInteger(o) || o < 0 || o >= n)
        throw new Error(`alphabet.encode: digit index outside alphabet "${o}". Allowed: ${e}`);
      return t[o];
    })),
    decode: (i) => (Lr(i), i.map((o) => {
      Et("alphabet.decode", o);
      const s = r.get(o);
      if (s === void 0)
        throw new Error(`Unknown letter: "${o}". Allowed: ${e}`);
      return s;
    }))
  };
}
// @__NO_SIDE_EFFECTS__
function Ms(e = "") {
  return Et("join", e), {
    encode: (t) => (Hn("join.decode", t), t.join(e)),
    decode: (t) => (Et("join.decode", t), t.split(e))
  };
}
// @__NO_SIDE_EFFECTS__
function vu(e, t = "=") {
  return ri(e), Et("padding", t), {
    encode(n) {
      for (Hn("padding.encode", n); n.length * e % 8; )
        n.push(t);
      return n;
    },
    decode(n) {
      Hn("padding.decode", n);
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
const zs = (e, t) => t === 0 ? e : zs(t, e % t), jn = /* @__NO_SIDE_EFFECTS__ */ (e, t) => e + (t - zs(e, t)), An = /* @__PURE__ */ (() => {
  let e = [];
  for (let t = 0; t < 40; t++)
    e.push(2 ** t);
  return e;
})();
function Br(e, t, n, r) {
  if (Lr(e), t <= 0 || t > 32)
    throw new Error(`convertRadix2: wrong from=${t}`);
  if (n <= 0 || n > 32)
    throw new Error(`convertRadix2: wrong to=${n}`);
  if (/* @__PURE__ */ jn(t, n) > 32)
    throw new Error(`convertRadix2: carry overflow from=${t} to=${n} carryBits=${/* @__PURE__ */ jn(t, n)}`);
  let i = 0, o = 0;
  const s = An[t], l = An[n] - 1, a = [];
  for (const c of e) {
    if (ri(c), c >= s)
      throw new Error(`convertRadix2: invalid data word=${c} from=${t}`);
    if (i = i << t | c, o + t > 32)
      throw new Error(`convertRadix2: carry overflow pos=${o} from=${t}`);
    for (o += t; o >= n; o -= n)
      a.push((i >> o - n & l) >>> 0);
    const u = An[o];
    if (u === void 0)
      throw new Error("invalid carry");
    i &= u - 1;
  }
  if (i = i << n - o & l, !r && o >= t)
    throw new Error("Excess padding");
  if (!r && i > 0)
    throw new Error(`Non-zero padding: ${i}`);
  return r && o > 0 && a.push(i >>> 0), a;
}
// @__NO_SIDE_EFFECTS__
function Ds(e, t = !1) {
  if (ri(e), e <= 0 || e > 32)
    throw new Error("radix2: bits should be in (0..32]");
  if (/* @__PURE__ */ jn(8, e) > 32 || /* @__PURE__ */ jn(e, 8) > 32)
    throw new Error("radix2: carry overflow");
  return {
    encode: (n) => {
      if (!ni(n))
        throw new Error("radix2.encode input should be Uint8Array");
      return Br(Array.from(n), 8, e, !t);
    },
    decode: (n) => (Is("radix2.decode", n), Uint8Array.from(Br(n, e, 8, t)))
  };
}
function no(e) {
  return wu(e), function(...t) {
    try {
      return e.apply(null, t);
    } catch {
    }
  };
}
const yu = typeof Uint8Array.from([]).toBase64 == "function" && typeof Uint8Array.fromBase64 == "function", mu = (e, t) => {
  Et("base64", e);
  const n = /^[A-Za-z0-9=+/]+$/, r = "base64";
  if (e.length > 0 && !n.test(e))
    throw new Error("invalid base64");
  return Uint8Array.fromBase64(e, { alphabet: r, lastChunkHandling: "strict" });
}, ct = yu ? {
  encode(e) {
    return bu(e), e.toBase64();
  },
  decode(e) {
    return mu(e);
  }
} : /* @__PURE__ */ Ns(/* @__PURE__ */ Ds(6), /* @__PURE__ */ Us("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), /* @__PURE__ */ vu(6), /* @__PURE__ */ Ms("")), Or = /* @__PURE__ */ Ns(/* @__PURE__ */ Us("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), /* @__PURE__ */ Ms("")), ro = [996825010, 642813549, 513874426, 1027748829, 705979059];
function Zt(e) {
  const t = e >> 25;
  let n = (e & 33554431) << 5;
  for (let r = 0; r < ro.length; r++)
    (t >> r & 1) === 1 && (n ^= ro[r]);
  return n;
}
function io(e, t, n = 1) {
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
  return i ^= n, Or.encode(Br([i % An[30]], 30, 5, !1));
}
// @__NO_SIDE_EFFECTS__
function _u(e) {
  const t = e === "bech32" ? 1 : 734539939, n = /* @__PURE__ */ Ds(5), r = n.decode, i = n.encode, o = no(r);
  function s(f, d, h = 90) {
    Et("bech32.encode prefix", f), ni(d) && (d = Array.from(d)), Is("bech32.encode", d);
    const p = f.length;
    if (p === 0)
      throw new TypeError(`Invalid prefix length ${p}`);
    const b = p + 7 + d.length;
    if (h !== !1 && b > h)
      throw new TypeError(`Length ${b} exceeds limit ${h}`);
    const v = f.toLowerCase(), m = io(v, d, t);
    return `${v}1${Or.encode(d)}${m}`;
  }
  function l(f, d = 90) {
    Et("bech32.decode input", f);
    const h = f.length;
    if (h < 8 || d !== !1 && h > d)
      throw new TypeError(`invalid string length: ${h} (${f}). Expected (8..${d})`);
    const p = f.toLowerCase();
    if (f !== p && f !== f.toUpperCase())
      throw new Error("String must be lowercase or uppercase");
    const b = p.lastIndexOf("1");
    if (b === 0 || b === -1)
      throw new Error('Letter "1" must be present between prefix and data only');
    const v = p.slice(0, b), m = p.slice(b + 1);
    if (m.length < 6)
      throw new Error("Data must be at least 6 characters long");
    const S = Or.decode(m).slice(0, -6), B = io(v, S, t);
    if (!m.endsWith(B))
      throw new Error(`Invalid checksum in ${f}: expected "${B}"`);
    return { prefix: v, words: S };
  }
  const a = no(l);
  function c(f) {
    const { prefix: d, words: h } = l(f, !1);
    return { prefix: d, words: h, bytes: r(h) };
  }
  function u(f, d) {
    return s(f, i(d));
  }
  return {
    encode: s,
    decode: l,
    encodeFromBytes: u,
    decodeToBytes: c,
    decodeUnsafe: a,
    fromWords: r,
    fromWordsUnsafe: o,
    toWords: i
  };
}
const jt = /* @__PURE__ */ _u("bech32");
function Eu(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function oo(e) {
  if (typeof e != "boolean")
    throw new Error(`boolean expected, not ${e}`);
}
function fr(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error("positive integer expected, got " + e);
}
function ue(e, t, n = "") {
  const r = Eu(e), i = e?.length, o = t !== void 0;
  if (!r || o && i !== t) {
    const s = n && `"${n}" `, l = o ? ` of length ${t}` : "", a = r ? `length=${i}` : `type=${typeof e}`;
    throw new Error(s + "expected Uint8Array" + l + ", got " + a);
  }
  return e;
}
function se(e) {
  return new Uint32Array(e.buffer, e.byteOffset, Math.floor(e.byteLength / 4));
}
function qt(...e) {
  for (let t = 0; t < e.length; t++)
    e[t].fill(0);
}
const xu = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function ku(e, t) {
  return e.buffer === t.buffer && // best we can do, may fail with an obscure Proxy
  e.byteOffset < t.byteOffset + t.byteLength && // a starts before b end
  t.byteOffset < e.byteOffset + e.byteLength;
}
function Ps(e, t) {
  if (ku(e, t) && e.byteOffset < t.byteOffset)
    throw new Error("complex overlap of input and output is not supported");
}
function Au(e, t) {
  if (t == null || typeof t != "object")
    throw new Error("options must be defined");
  return Object.assign(e, t);
}
function Su(e, t) {
  if (e.length !== t.length)
    return !1;
  let n = 0;
  for (let r = 0; r < e.length; r++)
    n |= e[r] ^ t[r];
  return n === 0;
}
const Ru = /* @__NO_SIDE_EFFECTS__ */ (e, t) => {
  function n(r, ...i) {
    if (ue(r, void 0, "key"), !xu)
      throw new Error("Non little-endian hardware is not yet supported");
    if (e.nonceLength !== void 0) {
      const u = i[0];
      ue(u, e.varSizeNonce ? void 0 : e.nonceLength, "nonce");
    }
    const o = e.tagLength;
    o && i[1] !== void 0 && ue(i[1], void 0, "AAD");
    const s = t(r, ...i), l = (u, f) => {
      if (f !== void 0) {
        if (u !== 2)
          throw new Error("cipher output not supported");
        ue(f, void 0, "output");
      }
    };
    let a = !1;
    return {
      encrypt(u, f) {
        if (a)
          throw new Error("cannot encrypt() twice with same key + nonce");
        return a = !0, ue(u), l(s.encrypt.length, f), s.encrypt(u, f);
      },
      decrypt(u, f) {
        if (ue(u), o && u.length < o)
          throw new Error('"ciphertext" expected length bigger than tagLength=' + o);
        return l(s.decrypt.length, f), s.decrypt(u, f);
      }
    };
  }
  return Object.assign(n, e), n;
};
function Hs(e, t, n = !0) {
  if (t === void 0)
    return new Uint8Array(e);
  if (t.length !== e)
    throw new Error('"output" expected Uint8Array of length ' + e + ", got: " + t.length);
  if (n && !Ot(t))
    throw new Error("invalid output, must be aligned");
  return t;
}
function Ot(e) {
  return e.byteOffset % 4 === 0;
}
function mt(e) {
  return Uint8Array.from(e);
}
const st = 16, $u = 283;
function Tu(e) {
  if (![16, 24, 32].includes(e.length))
    throw new Error('"aes key" expected Uint8Array of length 16/24/32, got length=' + e.length);
}
function ii(e) {
  return e << 1 ^ $u & -(e >> 7);
}
function Tt(e, t) {
  let n = 0;
  for (; t > 0; t >>= 1)
    n ^= e & -(t & 1), e = ii(e);
  return n;
}
const Ir = /* @__PURE__ */ (() => {
  const e = new Uint8Array(256);
  for (let n = 0, r = 1; n < 256; n++, r ^= ii(r))
    e[n] = r;
  const t = new Uint8Array(256);
  t[0] = 99;
  for (let n = 0; n < 255; n++) {
    let r = e[255 - n];
    r |= r << 8, t[e[n]] = (r ^ r >> 4 ^ r >> 5 ^ r >> 6 ^ r >> 7 ^ 99) & 255;
  }
  return qt(e), t;
})(), Cu = /* @__PURE__ */ Ir.map((e, t) => Ir.indexOf(t)), Lu = (e) => e << 24 | e >>> 8, dr = (e) => e << 8 | e >>> 24;
function js(e, t) {
  if (e.length !== 256)
    throw new Error("Wrong sbox length");
  const n = new Uint32Array(256).map((c, u) => t(e[u])), r = n.map(dr), i = r.map(dr), o = i.map(dr), s = new Uint32Array(256 * 256), l = new Uint32Array(256 * 256), a = new Uint16Array(256 * 256);
  for (let c = 0; c < 256; c++)
    for (let u = 0; u < 256; u++) {
      const f = c * 256 + u;
      s[f] = n[c] ^ r[u], l[f] = i[c] ^ o[u], a[f] = e[c] << 8 | e[u];
    }
  return { sbox: e, sbox2: a, T0: n, T1: r, T2: i, T3: o, T01: s, T23: l };
}
const oi = /* @__PURE__ */ js(Ir, (e) => Tt(e, 3) << 24 | e << 16 | e << 8 | Tt(e, 2)), qs = /* @__PURE__ */ js(Cu, (e) => Tt(e, 11) << 24 | Tt(e, 13) << 16 | Tt(e, 9) << 8 | Tt(e, 14)), Bu = /* @__PURE__ */ (() => {
  const e = new Uint8Array(16);
  for (let t = 0, n = 1; t < 16; t++, n = ii(n))
    e[t] = n;
  return e;
})();
function Vs(e) {
  ue(e);
  const t = e.length;
  Tu(e);
  const { sbox2: n } = oi, r = [];
  Ot(e) || r.push(e = mt(e));
  const i = se(e), o = i.length, s = (a) => Be(n, a, a, a, a), l = new Uint32Array(t + 28);
  l.set(i);
  for (let a = o; a < l.length; a++) {
    let c = l[a - 1];
    a % o === 0 ? c = s(Lu(c)) ^ Bu[a / o - 1] : o > 6 && a % o === 4 && (c = s(c)), l[a] = l[a - o] ^ c;
  }
  return qt(...r), l;
}
function Ou(e) {
  const t = Vs(e), n = t.slice(), r = t.length, { sbox2: i } = oi, { T0: o, T1: s, T2: l, T3: a } = qs;
  for (let c = 0; c < r; c += 4)
    for (let u = 0; u < 4; u++)
      n[c + u] = t[r - c - 4 + u];
  qt(t);
  for (let c = 4; c < r - 4; c++) {
    const u = n[c], f = Be(i, u, u, u, u);
    n[c] = o[f & 255] ^ s[f >>> 8 & 255] ^ l[f >>> 16 & 255] ^ a[f >>> 24];
  }
  return n;
}
function nt(e, t, n, r, i, o) {
  return e[n << 8 & 65280 | r >>> 8 & 255] ^ t[i >>> 8 & 65280 | o >>> 24 & 255];
}
function Be(e, t, n, r, i) {
  return e[t & 255 | n & 65280] | e[r >>> 16 & 255 | i >>> 16 & 65280] << 16;
}
function so(e, t, n, r, i) {
  const { sbox2: o, T01: s, T23: l } = oi;
  let a = 0;
  t ^= e[a++], n ^= e[a++], r ^= e[a++], i ^= e[a++];
  const c = e.length / 4 - 2;
  for (let p = 0; p < c; p++) {
    const b = e[a++] ^ nt(s, l, t, n, r, i), v = e[a++] ^ nt(s, l, n, r, i, t), m = e[a++] ^ nt(s, l, r, i, t, n), S = e[a++] ^ nt(s, l, i, t, n, r);
    t = b, n = v, r = m, i = S;
  }
  const u = e[a++] ^ Be(o, t, n, r, i), f = e[a++] ^ Be(o, n, r, i, t), d = e[a++] ^ Be(o, r, i, t, n), h = e[a++] ^ Be(o, i, t, n, r);
  return { s0: u, s1: f, s2: d, s3: h };
}
function Iu(e, t, n, r, i) {
  const { sbox2: o, T01: s, T23: l } = qs;
  let a = 0;
  t ^= e[a++], n ^= e[a++], r ^= e[a++], i ^= e[a++];
  const c = e.length / 4 - 2;
  for (let p = 0; p < c; p++) {
    const b = e[a++] ^ nt(s, l, t, i, r, n), v = e[a++] ^ nt(s, l, n, t, i, r), m = e[a++] ^ nt(s, l, r, n, t, i), S = e[a++] ^ nt(s, l, i, r, n, t);
    t = b, n = v, r = m, i = S;
  }
  const u = e[a++] ^ Be(o, t, i, r, n), f = e[a++] ^ Be(o, n, t, i, r), d = e[a++] ^ Be(o, r, n, t, i), h = e[a++] ^ Be(o, i, r, n, t);
  return { s0: u, s1: f, s2: d, s3: h };
}
function Nu(e) {
  if (ue(e), e.length % st !== 0)
    throw new Error("aes-(cbc/ecb).decrypt ciphertext should consist of blocks with size " + st);
}
function Uu(e, t, n) {
  ue(e);
  let r = e.length;
  const i = r % st;
  if (!t && i !== 0)
    throw new Error("aec/(cbc-ecb): unpadded plaintext with disabled padding");
  Ot(e) || (e = mt(e));
  const o = se(e);
  if (t) {
    let l = st - i;
    l || (l = st), r = r + l;
  }
  n = Hs(r, n), Ps(e, n);
  const s = se(n);
  return { b: o, o: s, out: n };
}
function Mu(e, t) {
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
function zu(e) {
  const t = new Uint8Array(16), n = se(t);
  t.set(e);
  const r = st - e.length;
  for (let i = st - r; i < st; i++)
    t[i] = r;
  return n;
}
const Fs = /* @__PURE__ */ Ru({ blockSize: 16, nonceLength: 16 }, function(t, n, r = {}) {
  const i = !r.disablePadding;
  return {
    encrypt(o, s) {
      const l = Vs(t), { b: a, o: c, out: u } = Uu(o, i, s);
      let f = n;
      const d = [l];
      Ot(f) || d.push(f = mt(f));
      const h = se(f);
      let p = h[0], b = h[1], v = h[2], m = h[3], S = 0;
      for (; S + 4 <= a.length; )
        p ^= a[S + 0], b ^= a[S + 1], v ^= a[S + 2], m ^= a[S + 3], { s0: p, s1: b, s2: v, s3: m } = so(l, p, b, v, m), c[S++] = p, c[S++] = b, c[S++] = v, c[S++] = m;
      if (i) {
        const B = zu(o.subarray(S * 4));
        p ^= B[0], b ^= B[1], v ^= B[2], m ^= B[3], { s0: p, s1: b, s2: v, s3: m } = so(l, p, b, v, m), c[S++] = p, c[S++] = b, c[S++] = v, c[S++] = m;
      }
      return qt(...d), u;
    },
    decrypt(o, s) {
      Nu(o);
      const l = Ou(t);
      let a = n;
      const c = [l];
      Ot(a) || c.push(a = mt(a));
      const u = se(a);
      s = Hs(o.length, s), Ot(o) || c.push(o = mt(o)), Ps(o, s);
      const f = se(o), d = se(s);
      let h = u[0], p = u[1], b = u[2], v = u[3];
      for (let m = 0; m + 4 <= f.length; ) {
        const S = h, B = p, D = b, pe = v;
        h = f[m + 0], p = f[m + 1], b = f[m + 2], v = f[m + 3];
        const { s0: H, s1: J, s2: W, s3: T } = Iu(l, h, p, b, v);
        d[m++] = H ^ S, d[m++] = J ^ B, d[m++] = W ^ D, d[m++] = T ^ pe;
      }
      return qt(...c), Mu(s, i);
    }
  };
}), Ks = (e) => Uint8Array.from(e.split(""), (t) => t.charCodeAt(0)), Du = Ks("expand 16-byte k"), Pu = Ks("expand 32-byte k"), Hu = se(Du), ju = se(Pu);
function N(e, t) {
  return e << t | e >>> 32 - t;
}
function Nr(e) {
  return e.byteOffset % 4 === 0;
}
const wn = 64, qu = 16, Zs = 2 ** 32 - 1, ao = Uint32Array.of();
function Vu(e, t, n, r, i, o, s, l) {
  const a = i.length, c = new Uint8Array(wn), u = se(c), f = Nr(i) && Nr(o), d = f ? se(i) : ao, h = f ? se(o) : ao;
  for (let p = 0; p < a; s++) {
    if (e(t, n, r, u, s, l), s >= Zs)
      throw new Error("arx: counter overflow");
    const b = Math.min(wn, a - p);
    if (f && b === wn) {
      const v = p / 4;
      if (p % 4 !== 0)
        throw new Error("arx: invalid block position");
      for (let m = 0, S; m < qu; m++)
        S = v + m, h[S] = d[S] ^ u[m];
      p += wn;
      continue;
    }
    for (let v = 0, m; v < b; v++)
      m = p + v, o[m] = i[m] ^ c[v];
    p += b;
  }
}
function Fu(e, t) {
  const { allowShortKeys: n, extendNonceFn: r, counterLength: i, counterRight: o, rounds: s } = Au({ allowShortKeys: !1, counterLength: 8, counterRight: !1, rounds: 20 }, t);
  if (typeof e != "function")
    throw new Error("core must be a function");
  return fr(i), fr(s), oo(o), oo(n), (l, a, c, u, f = 0) => {
    ue(l, void 0, "key"), ue(a, void 0, "nonce"), ue(c, void 0, "data");
    const d = c.length;
    if (u === void 0 && (u = new Uint8Array(d)), ue(u, void 0, "output"), fr(f), f < 0 || f >= Zs)
      throw new Error("arx: counter overflow");
    if (u.length < d)
      throw new Error(`arx: output (${u.length}) is shorter than data (${d})`);
    const h = [];
    let p = l.length, b, v;
    if (p === 32)
      h.push(b = mt(l)), v = ju;
    else if (p === 16 && n)
      b = new Uint8Array(32), b.set(l), b.set(l, 16), v = Hu, h.push(b);
    else
      throw ue(l, 32, "arx key"), new Error("invalid key size");
    Nr(a) || h.push(a = mt(a));
    const m = se(b);
    if (r) {
      if (a.length !== 24)
        throw new Error("arx: extended nonce must be 24 bytes");
      r(v, m, se(a.subarray(0, 16)), m), a = a.subarray(16);
    }
    const S = 16 - i;
    if (S !== a.length)
      throw new Error(`arx: nonce must be ${S} or 16 bytes`);
    if (S !== 12) {
      const D = new Uint8Array(12);
      D.set(a, o ? 0 : 12 - a.length), a = D, h.push(a);
    }
    const B = se(a);
    return Vu(e, v, m, B, c, u, f, s), qt(...h), u;
  };
}
function Ku(e, t, n, r, i, o = 20) {
  let s = e[0], l = e[1], a = e[2], c = e[3], u = t[0], f = t[1], d = t[2], h = t[3], p = t[4], b = t[5], v = t[6], m = t[7], S = i, B = n[0], D = n[1], pe = n[2], H = s, J = l, W = a, T = c, ee = u, Y = f, C = d, y = h, w = p, g = b, _ = v, x = m, A = S, k = B, E = D, R = pe;
  for (let V = 0; V < o; V += 2)
    H = H + ee | 0, A = N(A ^ H, 16), w = w + A | 0, ee = N(ee ^ w, 12), H = H + ee | 0, A = N(A ^ H, 8), w = w + A | 0, ee = N(ee ^ w, 7), J = J + Y | 0, k = N(k ^ J, 16), g = g + k | 0, Y = N(Y ^ g, 12), J = J + Y | 0, k = N(k ^ J, 8), g = g + k | 0, Y = N(Y ^ g, 7), W = W + C | 0, E = N(E ^ W, 16), _ = _ + E | 0, C = N(C ^ _, 12), W = W + C | 0, E = N(E ^ W, 8), _ = _ + E | 0, C = N(C ^ _, 7), T = T + y | 0, R = N(R ^ T, 16), x = x + R | 0, y = N(y ^ x, 12), T = T + y | 0, R = N(R ^ T, 8), x = x + R | 0, y = N(y ^ x, 7), H = H + Y | 0, R = N(R ^ H, 16), _ = _ + R | 0, Y = N(Y ^ _, 12), H = H + Y | 0, R = N(R ^ H, 8), _ = _ + R | 0, Y = N(Y ^ _, 7), J = J + C | 0, A = N(A ^ J, 16), x = x + A | 0, C = N(C ^ x, 12), J = J + C | 0, A = N(A ^ J, 8), x = x + A | 0, C = N(C ^ x, 7), W = W + y | 0, k = N(k ^ W, 16), w = w + k | 0, y = N(y ^ w, 12), W = W + y | 0, k = N(k ^ W, 8), w = w + k | 0, y = N(y ^ w, 7), T = T + ee | 0, E = N(E ^ T, 16), g = g + E | 0, ee = N(ee ^ g, 12), T = T + ee | 0, E = N(E ^ T, 8), g = g + E | 0, ee = N(ee ^ g, 7);
  let $ = 0;
  r[$++] = s + H | 0, r[$++] = l + J | 0, r[$++] = a + W | 0, r[$++] = c + T | 0, r[$++] = u + ee | 0, r[$++] = f + Y | 0, r[$++] = d + C | 0, r[$++] = h + y | 0, r[$++] = p + w | 0, r[$++] = b + g | 0, r[$++] = v + _ | 0, r[$++] = m + x | 0, r[$++] = S + A | 0, r[$++] = B + k | 0, r[$++] = D + E | 0, r[$++] = pe + R | 0;
}
const Gs = /* @__PURE__ */ Fu(Ku, {
  counterRight: !1,
  counterLength: 4,
  allowShortKeys: !1
});
function Zu(e, t, n) {
  return Wn(e), n === void 0 && (n = new Uint8Array(e.outputLen)), un(e, n, t);
}
const hr = /* @__PURE__ */ Uint8Array.of(0), lo = /* @__PURE__ */ Uint8Array.of();
function Gu(e, t, n, r = 32) {
  Wn(e), lt(r, "length");
  const i = e.outputLen;
  if (r > 255 * i)
    throw new Error("Length must be <= 255*HashLen");
  const o = Math.ceil(r / i);
  n === void 0 ? n = lo : z(n, void 0, "info");
  const s = new Uint8Array(o * i), l = un.create(e, t), a = l._cloneInto(), c = new Uint8Array(l.outputLen);
  for (let u = 0; u < o; u++)
    hr[0] = u + 1, a.update(u === 0 ? lo : c).update(n).update(hr).digestInto(c), s.set(c, i * u), l._cloneInto(a);
  return l.destroy(), a.destroy(), nn(c, hr), s.slice(0, r);
}
var Wu = Object.defineProperty, P = (e, t) => {
  for (var n in t)
    Wu(e, n, { get: t[n], enumerable: !0 });
}, Rt = Symbol("verified"), Yu = (e) => e instanceof Object;
function si(e) {
  if (!Yu(e) || typeof e.kind != "number" || typeof e.content != "string" || typeof e.created_at != "number" || typeof e.pubkey != "string" || !e.pubkey.match(/^[a-f0-9]{64}$/) || !Array.isArray(e.tags))
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
var Ws = {};
P(Ws, {
  binarySearch: () => ai,
  bytesToHex: () => q,
  hexToBytes: () => G,
  insertEventIntoAscendingList: () => Qu,
  insertEventIntoDescendingList: () => Ju,
  mergeReverseSortedLists: () => ef,
  normalizeURL: () => Xu,
  utf8Decoder: () => Fe,
  utf8Encoder: () => _e
});
var Fe = new TextDecoder("utf-8"), _e = new TextEncoder();
function Xu(e) {
  try {
    e.indexOf("://") === -1 && (e = "wss://" + e);
    let t = new URL(e);
    return t.protocol === "http:" ? t.protocol = "ws:" : t.protocol === "https:" && (t.protocol = "wss:"), t.pathname = t.pathname.replace(/\/+/g, "/"), t.pathname.endsWith("/") && (t.pathname = t.pathname.slice(0, -1)), (t.port === "80" && t.protocol === "ws:" || t.port === "443" && t.protocol === "wss:") && (t.port = ""), t.searchParams.sort(), t.hash = "", t.toString();
  } catch {
    throw new Error(`Invalid URL: ${e}`);
  }
}
function Ju(e, t) {
  const [n, r] = ai(e, (i) => t.id === i.id ? 0 : t.created_at === i.created_at ? -1 : i.created_at - t.created_at);
  return r || e.splice(n, 0, t), e;
}
function Qu(e, t) {
  const [n, r] = ai(e, (i) => t.id === i.id ? 0 : t.created_at === i.created_at ? -1 : t.created_at - i.created_at);
  return r || e.splice(n, 0, t), e;
}
function ai(e, t) {
  let n = 0, r = e.length - 1;
  for (; n <= r; ) {
    const i = Math.floor((n + r) / 2), o = t(e[i]);
    if (o === 0)
      return [i, !0];
    o < 0 ? r = i - 1 : n = i + 1;
  }
  return [n, !1];
}
function ef(e, t) {
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
var tf = class {
  generateSecretKey() {
    return Kt.utils.randomSecretKey();
  }
  getPublicKey(e) {
    return q(Kt.getPublicKey(e));
  }
  finalizeEvent(e, t) {
    const n = e;
    return n.pubkey = q(Kt.getPublicKey(t)), n.id = Sn(n), n.sig = q(Kt.sign(G(Sn(n)), t)), n[Rt] = !0, n;
  }
  verifyEvent(e) {
    if (typeof e[Rt] == "boolean")
      return e[Rt];
    try {
      const t = Sn(e);
      if (t !== e.id)
        return e[Rt] = !1, !1;
      const n = Kt.verify(G(e.sig), G(t), G(e.pubkey));
      return e[Rt] = n, n;
    } catch {
      return e[Rt] = !1, !1;
    }
  }
};
function nf(e) {
  if (!si(e))
    throw new Error("can't serialize event with wrong or missing properties");
  return JSON.stringify([0, e.pubkey, e.created_at, e.kind, e.tags, e.content]);
}
function Sn(e) {
  let t = Me(_e.encode(nf(e)));
  return q(t);
}
var Jn = new tf(), rf = Jn.generateSecretKey, li = Jn.getPublicKey, ze = Jn.finalizeEvent, ci = Jn.verifyEvent, of = {};
P(of, {
  Application: () => wd,
  BadgeAward: () => hf,
  BadgeDefinition: () => ud,
  BlockedRelaysList: () => Kf,
  BlossomServerList: () => Qf,
  BookmarkList: () => qf,
  Bookmarksets: () => ad,
  Calendar: () => kd,
  CalendarEventRSVP: () => Ad,
  ChannelCreation: () => ta,
  ChannelHideMessage: () => ia,
  ChannelMessage: () => ra,
  ChannelMetadata: () => na,
  ChannelMuteUser: () => oa,
  ChatMessage: () => pf,
  ClassifiedListing: () => md,
  ClientAuth: () => aa,
  Comment: () => xf,
  CommunitiesList: () => Vf,
  CommunityDefinition: () => Td,
  CommunityPostApproval: () => Lf,
  Contacts: () => uf,
  CreateOrUpdateProduct: () => hd,
  CreateOrUpdateStall: () => dd,
  Curationsets: () => ld,
  Date: () => Ed,
  DirectMessageRelaysList: () => Xf,
  DraftClassifiedListing: () => _d,
  DraftLong: () => gd,
  Emojisets: () => bd,
  EncryptedDirectMessage: () => ff,
  EventDeletion: () => df,
  FavoriteRelays: () => Gf,
  FileMessage: () => bf,
  FileMetadata: () => Ef,
  FileServerPreference: () => Jf,
  Followsets: () => id,
  ForumThread: () => gf,
  GenericRepost: () => pi,
  Genericlists: () => od,
  GiftWrap: () => sa,
  GroupMetadata: () => Cd,
  HTTPAuth: () => gi,
  Handlerinformation: () => $d,
  Handlerrecommendation: () => Rd,
  Highlights: () => zf,
  InterestsList: () => Wf,
  Interestsets: () => fd,
  JobFeedback: () => If,
  JobRequest: () => Bf,
  JobResult: () => Of,
  Label: () => Cf,
  LightningPubRPC: () => td,
  LiveChatMessage: () => kf,
  LiveEvent: () => vd,
  LongFormArticle: () => pd,
  Metadata: () => lf,
  Mutelist: () => Pf,
  NWCWalletInfo: () => ed,
  NWCWalletRequest: () => la,
  NWCWalletResponse: () => nd,
  NormalVideo: () => vf,
  NostrConnect: () => rd,
  OpenTimestamps: () => mf,
  Photo: () => wf,
  Pinlist: () => Hf,
  Poll: () => _f,
  PollResponse: () => Df,
  PrivateDirectMessage: () => ea,
  ProblemTracker: () => Rf,
  ProfileBadges: () => cd,
  PublicChatsList: () => Ff,
  Reaction: () => hi,
  RecommendRelay: () => cf,
  RelayList: () => jf,
  RelayReview: () => Sd,
  Relaysets: () => sd,
  Report: () => $f,
  Reporting: () => Tf,
  Repost: () => di,
  Seal: () => Qs,
  SearchRelaysList: () => Zf,
  ShortTextNote: () => Js,
  ShortVideo: () => yf,
  Time: () => xd,
  UserEmojiList: () => Yf,
  UserStatuses: () => yd,
  Voice: () => Af,
  VoiceComment: () => Sf,
  Zap: () => Mf,
  ZapGoal: () => Nf,
  ZapRequest: () => Uf,
  classifyKind: () => sf,
  isAddressableKind: () => fi,
  isEphemeralKind: () => Xs,
  isKind: () => af,
  isRegularKind: () => Ys,
  isReplaceableKind: () => ui
});
function Ys(e) {
  return e < 1e4 && e !== 0 && e !== 3;
}
function ui(e) {
  return e === 0 || e === 3 || 1e4 <= e && e < 2e4;
}
function Xs(e) {
  return 2e4 <= e && e < 3e4;
}
function fi(e) {
  return 3e4 <= e && e < 4e4;
}
function sf(e) {
  return Ys(e) ? "regular" : ui(e) ? "replaceable" : Xs(e) ? "ephemeral" : fi(e) ? "parameterized" : "unknown";
}
function af(e, t) {
  const n = t instanceof Array ? t : [t];
  return si(e) && n.includes(e.kind) || !1;
}
var lf = 0, Js = 1, cf = 2, uf = 3, ff = 4, df = 5, di = 6, hi = 7, hf = 8, pf = 9, gf = 11, Qs = 13, ea = 14, bf = 15, pi = 16, wf = 20, vf = 21, yf = 22, ta = 40, na = 41, ra = 42, ia = 43, oa = 44, mf = 1040, sa = 1059, _f = 1068, Ef = 1063, xf = 1111, kf = 1311, Af = 1222, Sf = 1244, Rf = 1971, $f = 1984, Tf = 1984, Cf = 1985, Lf = 4550, Bf = 5999, Of = 6999, If = 7e3, Nf = 9041, Uf = 9734, Mf = 9735, zf = 9802, Df = 1018, Pf = 1e4, Hf = 10001, jf = 10002, qf = 10003, Vf = 10004, Ff = 10005, Kf = 10006, Zf = 10007, Gf = 10012, Wf = 10015, Yf = 10030, Xf = 10050, Jf = 10096, Qf = 10063, ed = 13194, td = 21e3, aa = 22242, la = 23194, nd = 23195, rd = 24133, gi = 27235, id = 3e4, od = 30001, sd = 30002, ad = 30003, ld = 30004, cd = 30008, ud = 30009, fd = 30015, dd = 30017, hd = 30018, pd = 30023, gd = 30024, bd = 30030, wd = 30078, vd = 30311, yd = 30315, md = 30402, _d = 30403, Ed = 31922, xd = 31923, kd = 31924, Ad = 31925, Sd = 31987, Rd = 31989, $d = 31990, Td = 34550, Cd = 39e3, Ld = {};
P(Ld, {
  getHex64: () => bi,
  getInt: () => ca,
  getSubscriptionId: () => Bd,
  matchEventId: () => Od,
  matchEventKind: () => Nd,
  matchEventPubkey: () => Id
});
function bi(e, t) {
  let n = t.length + 3, r = e.indexOf(`"${t}":`) + n, i = e.slice(r).indexOf('"') + r + 1;
  return e.slice(i, i + 64);
}
function ca(e, t) {
  let n = t.length, r = e.indexOf(`"${t}":`) + n + 3, i = e.slice(r), o = Math.min(i.indexOf(","), i.indexOf("}"));
  return parseInt(i.slice(0, o), 10);
}
function Bd(e) {
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
function Od(e, t) {
  return t === bi(e, "id");
}
function Id(e, t) {
  return t === bi(e, "pubkey");
}
function Nd(e, t) {
  return t === ca(e, "kind");
}
var Ud = {};
P(Ud, {
  makeAuthEvent: () => Md
});
function Md(e, t) {
  return {
    kind: aa,
    created_at: Math.floor(Date.now() / 1e3),
    tags: [
      ["relay", e],
      ["challenge", t]
    ],
    content: ""
  };
}
var zd;
try {
  zd = WebSocket;
} catch {
}
var Dd;
try {
  Dd = WebSocket;
} catch {
}
var Pd = {};
P(Pd, {
  BECH32_REGEX: () => ua,
  Bech32MaxSize: () => wi,
  NostrTypeGuard: () => Hd,
  decode: () => Qn,
  decodeNostrURI: () => qd,
  encodeBytes: () => tr,
  naddrEncode: () => Wd,
  neventEncode: () => Gd,
  noteEncode: () => Kd,
  nprofileEncode: () => Zd,
  npubEncode: () => Fd,
  nsecEncode: () => Vd
});
var Hd = {
  isNProfile: (e) => /^nprofile1[a-z\d]+$/.test(e || ""),
  isNEvent: (e) => /^nevent1[a-z\d]+$/.test(e || ""),
  isNAddr: (e) => /^naddr1[a-z\d]+$/.test(e || ""),
  isNSec: (e) => /^nsec1[a-z\d]{58}$/.test(e || ""),
  isNPub: (e) => /^npub1[a-z\d]{58}$/.test(e || ""),
  isNote: (e) => /^note1[a-z\d]+$/.test(e || ""),
  isNcryptsec: (e) => /^ncryptsec1[a-z\d]+$/.test(e || "")
}, wi = 5e3, ua = /[\x21-\x7E]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/;
function jd(e) {
  const t = new Uint8Array(4);
  return t[0] = e >> 24 & 255, t[1] = e >> 16 & 255, t[2] = e >> 8 & 255, t[3] = e & 255, t;
}
function qd(e) {
  try {
    return e.startsWith("nostr:") && (e = e.substring(6)), Qn(e);
  } catch {
    return { type: "invalid", data: null };
  }
}
function Qn(e) {
  let { prefix: t, words: n } = jt.decode(e, wi), r = new Uint8Array(jt.fromWords(n));
  switch (t) {
    case "nprofile": {
      let i = pr(r);
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
      let i = pr(r);
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
      let i = pr(r);
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
function pr(e) {
  let t = {}, n = e;
  for (; n.length > 0; ) {
    let r = n[0], i = n[1], o = n.slice(2, 2 + i);
    if (n = n.slice(2 + i), o.length < i)
      throw new Error(`not enough data to read on TLV ${r}`);
    t[r] = t[r] || [], t[r].push(o);
  }
  return t;
}
function Vd(e) {
  return tr("nsec", e);
}
function Fd(e) {
  return tr("npub", G(e));
}
function Kd(e) {
  return tr("note", G(e));
}
function er(e, t) {
  let n = jt.toWords(t);
  return jt.encode(e, n, wi);
}
function tr(e, t) {
  return er(e, t);
}
function Zd(e) {
  let t = vi({
    0: [G(e.pubkey)],
    1: (e.relays || []).map((n) => _e.encode(n))
  });
  return er("nprofile", t);
}
function Gd(e) {
  let t;
  e.kind !== void 0 && (t = jd(e.kind));
  let n = vi({
    0: [G(e.id)],
    1: (e.relays || []).map((r) => _e.encode(r)),
    2: e.author ? [G(e.author)] : [],
    3: t ? [new Uint8Array(t)] : []
  });
  return er("nevent", n);
}
function Wd(e) {
  let t = new ArrayBuffer(4);
  new DataView(t).setUint32(0, e.kind, !1);
  let n = vi({
    0: [_e.encode(e.identifier)],
    1: (e.relays || []).map((r) => _e.encode(r)),
    2: [G(e.pubkey)],
    3: [new Uint8Array(t)]
  });
  return er("naddr", n);
}
function vi(e) {
  let t = [];
  return Object.entries(e).reverse().forEach(([n, r]) => {
    r.forEach((i) => {
      let o = new Uint8Array(i.length + 2);
      o.set([parseInt(n)], 0), o.set([i.length], 1), o.set(i, 2), t.push(o);
    });
  }), fe(...t);
}
var Yd = {};
P(Yd, {
  decrypt: () => Xd,
  encrypt: () => fa
});
function fa(e, t, n) {
  const r = e instanceof Uint8Array ? e : G(e), i = Qr.getSharedSecret(r, G("02" + t)), o = da(i);
  let s = Uint8Array.from(Vt(16)), l = _e.encode(n), a = Fs(o, s).encrypt(l), c = ct.encode(new Uint8Array(a)), u = ct.encode(new Uint8Array(s.buffer));
  return `${c}?iv=${u}`;
}
function Xd(e, t, n) {
  const r = e instanceof Uint8Array ? e : G(e);
  let [i, o] = n.split("?iv="), s = Qr.getSharedSecret(r, G("02" + t)), l = da(s), a = ct.decode(o), c = ct.decode(i), u = Fs(l, a).decrypt(c);
  return Fe.decode(u);
}
function da(e) {
  return e.slice(1, 33);
}
var Jd = {};
P(Jd, {
  NIP05_REGEX: () => yi,
  isNip05: () => Qd,
  isValid: () => nh,
  queryProfile: () => ha,
  searchDomain: () => th,
  useFetchImplementation: () => eh
});
var yi = /^(?:([\w.+-]+)@)?([\w_-]+(\.[\w_-]+)+)$/, Qd = (e) => yi.test(e || ""), nr;
try {
  nr = fetch;
} catch {
}
function eh(e) {
  nr = e;
}
async function th(e, t = "") {
  try {
    const n = `https://${e}/.well-known/nostr.json?name=${t}`, r = await nr(n, { redirect: "manual" });
    if (r.status !== 200)
      throw Error("Wrong response code");
    return (await r.json()).names;
  } catch {
    return {};
  }
}
async function ha(e) {
  const t = e.match(yi);
  if (!t)
    return null;
  const [, n = "_", r] = t;
  try {
    const i = `https://${r}/.well-known/nostr.json?name=${n}`, o = await nr(i, { redirect: "manual" });
    if (o.status !== 200)
      throw Error("Wrong response code");
    const s = await o.json(), l = s.names[n];
    return l ? { pubkey: l, relays: s.relays?.[l] } : null;
  } catch {
    return null;
  }
}
async function nh(e, t) {
  const n = await ha(t);
  return n ? n.pubkey === e : !1;
}
var rh = {};
P(rh, {
  parse: () => ih
});
function ih(e) {
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
      const [s, l, a, c, u] = o, f = {
        id: l,
        relays: a ? [a] : [],
        author: u
      };
      if (c === "root") {
        t.root = f;
        continue;
      }
      if (c === "reply") {
        t.reply = f;
        continue;
      }
      if (c === "mention") {
        t.mentions.push(f);
        continue;
      }
      n ? r = f : n = f, t.mentions.push(f);
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
var oh = {};
P(oh, {
  fetchRelayInformation: () => ah,
  useFetchImplementation: () => sh
});
var pa;
try {
  pa = fetch;
} catch {
}
function sh(e) {
  pa = e;
}
async function ah(e) {
  return await (await fetch(e.replace("ws://", "http://").replace("wss://", "https://"), {
    headers: { Accept: "application/nostr+json" }
  })).json();
}
var lh = {};
P(lh, {
  getPow: () => ch,
  minePow: () => fh
});
function ch(e) {
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
function uh(e) {
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
function fh(e, t) {
  let n = 0;
  const r = e, i = ["nonce", n.toString(), t.toString()];
  for (r.tags.push(i); ; ) {
    const o = Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3);
    o !== r.created_at && (n = 0, r.created_at = o), i[1] = (++n).toString();
    const s = Me(
      _e.encode(JSON.stringify([0, r.pubkey, r.created_at, r.kind, r.tags, r.content]))
    );
    if (uh(s) >= t) {
      r.id = q(s);
      break;
    }
  }
  return r;
}
var dh = {};
P(dh, {
  unwrapEvent: () => kh,
  unwrapManyEvents: () => Ah,
  wrapEvent: () => Ra,
  wrapManyEvents: () => xh
});
var hh = {};
P(hh, {
  createRumor: () => xa,
  createSeal: () => ka,
  createWrap: () => Aa,
  unwrapEvent: () => ki,
  unwrapManyEvents: () => Sa,
  wrapEvent: () => qn,
  wrapManyEvents: () => _h
});
var ph = {};
P(ph, {
  decrypt: () => xi,
  encrypt: () => Ei,
  getConversationKey: () => mi,
  v2: () => yh
});
var ga = 1, ba = 65535;
function mi(e, t) {
  const n = Qr.getSharedSecret(e, G("02" + t)).subarray(1, 33);
  return Zu(Me, n, _e.encode("nip44-v2"));
}
function wa(e, t) {
  const n = Gu(Me, e, t, 76);
  return {
    chacha_key: n.subarray(0, 32),
    chacha_nonce: n.subarray(32, 44),
    hmac_key: n.subarray(44, 76)
  };
}
function _i(e) {
  if (!Number.isSafeInteger(e) || e < 1)
    throw new Error("expected positive integer");
  if (e <= 32)
    return 32;
  const t = 1 << Math.floor(Math.log2(e - 1)) + 1, n = t <= 256 ? 32 : t / 8;
  return n * (Math.floor((e - 1) / n) + 1);
}
function gh(e) {
  if (!Number.isSafeInteger(e) || e < ga || e > ba)
    throw new Error("invalid plaintext size: must be between 1 and 65535 bytes");
  const t = new Uint8Array(2);
  return new DataView(t.buffer).setUint16(0, e, !1), t;
}
function bh(e) {
  const t = _e.encode(e), n = t.length, r = gh(n), i = new Uint8Array(_i(n) - n);
  return fe(r, t, i);
}
function wh(e) {
  const t = new DataView(e.buffer).getUint16(0), n = e.subarray(2, 2 + t);
  if (t < ga || t > ba || n.length !== t || e.length !== 2 + _i(t))
    throw new Error("invalid padding");
  return Fe.decode(n);
}
function va(e, t, n) {
  if (n.length !== 32)
    throw new Error("AAD associated data must be 32 bytes");
  const r = fe(n, t);
  return un(Me, e, r);
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
    n = ct.decode(e);
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
function Ei(e, t, n = Vt(32)) {
  const { chacha_key: r, chacha_nonce: i, hmac_key: o } = wa(t, n), s = bh(e), l = Gs(r, i, s), a = va(o, l, n);
  return ct.encode(fe(new Uint8Array([2]), n, l, a));
}
function xi(e, t) {
  const { nonce: n, ciphertext: r, mac: i } = vh(e), { chacha_key: o, chacha_nonce: s, hmac_key: l } = wa(t, n), a = va(l, r, n);
  if (!Su(a, i))
    throw new Error("invalid MAC");
  const c = Gs(o, s, r);
  return wh(c);
}
var yh = {
  utils: {
    getConversationKey: mi,
    calcPaddedLen: _i
  },
  encrypt: Ei,
  decrypt: xi
}, mh = 2880 * 60, ya = () => Math.round(Date.now() / 1e3), ma = () => Math.round(ya() - Math.random() * mh), _a = (e, t) => mi(e, t), Ea = (e, t, n) => Ei(JSON.stringify(e), _a(t, n)), co = (e, t) => JSON.parse(xi(e.content, _a(t, e.pubkey)));
function xa(e, t) {
  const n = {
    created_at: ya(),
    content: "",
    tags: [],
    ...e,
    pubkey: li(t)
  };
  return n.id = Sn(n), n;
}
function ka(e, t, n) {
  return ze(
    {
      kind: Qs,
      content: Ea(e, t, n),
      created_at: ma(),
      tags: []
    },
    t
  );
}
function Aa(e, t) {
  const n = rf();
  return ze(
    {
      kind: sa,
      content: Ea(e, n, t),
      created_at: ma(),
      tags: [["p", t]]
    },
    n
  );
}
function qn(e, t, n) {
  const r = xa(e, t), i = ka(r, t, n);
  return Aa(i, n);
}
function _h(e, t, n) {
  if (!n || n.length === 0)
    throw new Error("At least one recipient is required.");
  const r = li(t), i = [qn(e, t, r)];
  return n.forEach((o) => {
    i.push(qn(e, t, o));
  }), i;
}
function ki(e, t) {
  const n = co(e, t);
  return co(n, t);
}
function Sa(e, t) {
  let n = [];
  return e.forEach((r) => {
    n.push(ki(r, t));
  }), n.sort((r, i) => r.created_at - i.created_at), n;
}
function Eh(e, t, n, r) {
  const i = {
    created_at: Math.ceil(Date.now() / 1e3),
    kind: ea,
    tags: [],
    content: t
  };
  return (Array.isArray(e) ? e : [e]).forEach(({ publicKey: s, relayUrl: l }) => {
    i.tags.push(l ? ["p", s, l] : ["p", s]);
  }), r && i.tags.push(["e", r.eventId, r.relayUrl || "", "reply"]), n && i.tags.push(["subject", n]), i;
}
function Ra(e, t, n, r, i) {
  const o = Eh(t, n, r, i);
  return qn(o, e, t.publicKey);
}
function xh(e, t, n, r, i) {
  if (!t || t.length === 0)
    throw new Error("At least one recipient is required.");
  return [{ publicKey: li(e) }, ...t].map(
    (s) => Ra(e, s, n, r, i)
  );
}
var kh = ki, Ah = Sa, Sh = {};
P(Sh, {
  finishRepostEvent: () => Rh,
  getRepostedEvent: () => $h,
  getRepostedEventPointer: () => $a
});
function Rh(e, t, n, r) {
  let i;
  const o = [...e.tags ?? [], ["e", t.id, n], ["p", t.pubkey]];
  return t.kind === Js ? i = di : (i = pi, o.push(["k", String(t.kind)])), ze(
    {
      kind: i,
      tags: o,
      content: e.content === "" || t.tags?.find((s) => s[0] === "-") ? "" : JSON.stringify(t),
      created_at: e.created_at
    },
    r
  );
}
function $a(e) {
  if (![di, pi].includes(e.kind))
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
function $h(e, { skipVerification: t } = {}) {
  const n = $a(e);
  if (n === void 0 || e.content === "")
    return;
  let r;
  try {
    r = JSON.parse(e.content);
  } catch {
    return;
  }
  if (r.id === n.id && !(!t && !ci(r)))
    return r;
}
var Th = {};
P(Th, {
  NOSTR_URI_REGEX: () => Ai,
  parse: () => Lh,
  test: () => Ch
});
var Ai = new RegExp(`nostr:(${ua.source})`);
function Ch(e) {
  return typeof e == "string" && new RegExp(`^${Ai.source}$`).test(e);
}
function Lh(e) {
  const t = e.match(new RegExp(`^${Ai.source}$`));
  if (!t)
    throw new Error(`Invalid Nostr URI: ${e}`);
  return {
    uri: t[0],
    value: t[1],
    decoded: Qn(t[1])
  };
}
var Bh = {};
P(Bh, {
  finishReactionEvent: () => Oh,
  getReactedEventPointer: () => Ih
});
function Oh(e, t, n) {
  const r = t.tags.filter((i) => i.length >= 2 && (i[0] === "e" || i[0] === "p"));
  return ze(
    {
      ...e,
      kind: hi,
      tags: [...e.tags ?? [], ...r, ["e", t.id], ["p", t.pubkey]],
      content: e.content ?? "+"
    },
    n
  );
}
function Ih(e) {
  if (e.kind !== hi)
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
var Nh = {};
P(Nh, {
  parse: () => Mh
});
var gr = /\W/m, uo = /[^\w\/] |[^\w\/]$|$|,| /m, Uh = 42;
function* Mh(e) {
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
        if (s === 0 || e[s - 1].match(gr)) {
          const l = e.slice(s + 1, s + Uh).match(gr), a = l ? s + 1 + l.index : n;
          yield { type: "text", text: e.slice(r, s) }, yield { type: "hashtag", value: e.slice(s + 1, a) }, i = a, r = i;
          continue e;
        }
        i = s + 1;
        continue e;
      }
      if (e.slice(o - 5, o) === "nostr") {
        const l = e.slice(o + 60).match(gr), a = l ? o + 60 + l.index : n;
        try {
          let c, { data: u, type: f } = Qn(e.slice(o + 1, a));
          switch (f) {
            case "npub":
              c = { pubkey: u };
              break;
            case "note":
              c = { id: u };
              break;
            case "nsec":
              i = a + 1;
              continue;
            default:
              c = u;
          }
          r !== o - 5 && (yield { type: "text", text: e.slice(r, o - 5) }), yield { type: "reference", pointer: c }, i = a, r = i;
          continue e;
        } catch {
          i = o + 1;
          continue e;
        }
      } else if (e.slice(o - 5, o) === "https" || e.slice(o - 4, o) === "http") {
        const l = e.slice(o + 4).match(uo), a = l ? o + 4 + l.index : n, c = e[o - 1] === "s" ? 5 : 4;
        try {
          let u = new URL(e.slice(o - c, a));
          if (u.hostname.indexOf(".") === -1)
            throw new Error("invalid url");
          if (r !== o - c && (yield { type: "text", text: e.slice(r, o - c) }), /\.(png|jpe?g|gif|webp|heic|svg)$/i.test(u.pathname)) {
            yield { type: "image", url: u.toString() }, i = a, r = i;
            continue e;
          }
          if (/\.(mp4|avi|webm|mkv|mov)$/i.test(u.pathname)) {
            yield { type: "video", url: u.toString() }, i = a, r = i;
            continue e;
          }
          if (/\.(mp3|aac|ogg|opus|wav|flac)$/i.test(u.pathname)) {
            yield { type: "audio", url: u.toString() }, i = a, r = i;
            continue e;
          }
          yield { type: "url", url: u.toString() }, i = a, r = i;
          continue e;
        } catch {
          i = a + 1;
          continue e;
        }
      } else if (e.slice(o - 3, o) === "wss" || e.slice(o - 2, o) === "ws") {
        const l = e.slice(o + 4).match(uo), a = l ? o + 4 + l.index : n, c = e[o - 1] === "s" ? 3 : 2;
        try {
          let u = new URL(e.slice(o - c, a));
          if (u.hostname.indexOf(".") === -1)
            throw new Error("invalid ws url");
          r !== o - c && (yield { type: "text", text: e.slice(r, o - c) }), yield { type: "relay", url: u.toString() }, i = a, r = i;
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
var zh = {};
P(zh, {
  channelCreateEvent: () => Dh,
  channelHideMessageEvent: () => jh,
  channelMessageEvent: () => Hh,
  channelMetadataEvent: () => Ph,
  channelMuteUserEvent: () => qh
});
var Dh = (e, t) => {
  let n;
  if (typeof e.content == "object")
    n = JSON.stringify(e.content);
  else if (typeof e.content == "string")
    n = e.content;
  else
    return;
  return ze(
    {
      kind: ta,
      tags: [...e.tags ?? []],
      content: n,
      created_at: e.created_at
    },
    t
  );
}, Ph = (e, t) => {
  let n;
  if (typeof e.content == "object")
    n = JSON.stringify(e.content);
  else if (typeof e.content == "string")
    n = e.content;
  else
    return;
  return ze(
    {
      kind: na,
      tags: [["e", e.channel_create_event_id], ...e.tags ?? []],
      content: n,
      created_at: e.created_at
    },
    t
  );
}, Hh = (e, t) => {
  const n = [["e", e.channel_create_event_id, e.relay_url, "root"]];
  return e.reply_to_channel_message_event_id && n.push(["e", e.reply_to_channel_message_event_id, e.relay_url, "reply"]), ze(
    {
      kind: ra,
      tags: [...n, ...e.tags ?? []],
      content: e.content,
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
  return ze(
    {
      kind: ia,
      tags: [["e", e.channel_message_event_id], ...e.tags ?? []],
      content: n,
      created_at: e.created_at
    },
    t
  );
}, qh = (e, t) => {
  let n;
  if (typeof e.content == "object")
    n = JSON.stringify(e.content);
  else if (typeof e.content == "string")
    n = e.content;
  else
    return;
  return ze(
    {
      kind: oa,
      tags: [["p", e.pubkey_to_mute], ...e.tags ?? []],
      content: n,
      created_at: e.created_at
    },
    t
  );
}, Vh = {};
P(Vh, {
  EMOJI_SHORTCODE_REGEX: () => Ta,
  matchAll: () => Fh,
  regex: () => Si,
  replaceAll: () => Kh
});
var Ta = /:(\w+):/, Si = () => new RegExp(`\\B${Ta.source}\\B`, "g");
function* Fh(e) {
  const t = e.matchAll(Si());
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
function Kh(e, t) {
  return e.replaceAll(Si(), (n, r) => t({
    shortcode: n,
    name: r
  }));
}
var Zh = {};
P(Zh, {
  useFetchImplementation: () => Gh,
  validateGithub: () => Wh
});
var Ri;
try {
  Ri = fetch;
} catch {
}
function Gh(e) {
  Ri = e;
}
async function Wh(e, t, n) {
  try {
    return await (await Ri(`https://gist.github.com/${t}/${n}/raw`)).text() === `Verifying that I control the following Nostr public key: ${e}`;
  } catch {
    return !1;
  }
}
var Yh = {};
P(Yh, {
  makeNwcRequestEvent: () => Jh,
  parseConnectionString: () => Xh
});
function Xh(e) {
  const { host: t, pathname: n, searchParams: r } = new URL(e), i = n || t, o = r.get("relay"), s = r.get("secret");
  if (!i || !o || !s)
    throw new Error("invalid connection string");
  return { pubkey: i, relay: o, secret: s };
}
async function Jh(e, t, n) {
  const i = fa(t, e, JSON.stringify({
    method: "pay_invoice",
    params: {
      invoice: n
    }
  })), o = {
    kind: la,
    created_at: Math.round(Date.now() / 1e3),
    content: i,
    tags: [["p", e]]
  };
  return ze(o, t);
}
var Qh = {};
P(Qh, {
  normalizeIdentifier: () => ep
});
function ep(e) {
  return e = e.trim().toLowerCase(), e = e.normalize("NFKC"), Array.from(e).map((t) => new RegExp("\\p{Letter}", "u").test(t) || new RegExp("\\p{Number}", "u").test(t) ? t : "-").join("");
}
var tp = {};
P(tp, {
  getSatoshisAmountFromBolt11: () => ap,
  getZapEndpoint: () => rp,
  makeZapReceipt: () => sp,
  makeZapRequest: () => ip,
  useFetchImplementation: () => np,
  validateZapRequest: () => op
});
var $i;
try {
  $i = fetch;
} catch {
}
function np(e) {
  $i = e;
}
async function rp(e) {
  try {
    let t = "", { lud06: n, lud16: r } = JSON.parse(e.content);
    if (r) {
      let [s, l] = r.split("@");
      t = new URL(`/.well-known/lnurlp/${s}`, `https://${l}`).toString();
    } else if (n) {
      let { words: s } = jt.decode(n, 1e3), l = jt.fromWords(s);
      t = Fe.decode(l);
    } else
      return null;
    let o = await (await $i(t)).json();
    if (o.allowsNostr && o.nostrPubkey)
      return o.callback;
  } catch {
  }
  return null;
}
function ip(e) {
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
    if (t.tags.push(["e", e.event.id]), ui(e.event.kind)) {
      const n = ["a", `${e.event.kind}:${e.event.pubkey}:`];
      t.tags.push(n);
    } else if (fi(e.event.kind)) {
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
function op(e) {
  let t;
  try {
    t = JSON.parse(e);
  } catch {
    return "Invalid zap request JSON.";
  }
  if (!si(t))
    return "Zap request is not a valid Nostr event.";
  if (!ci(t))
    return "Invalid signature on zap request.";
  let n = t.tags.find(([o, s]) => o === "p" && s);
  if (!n)
    return "Zap request doesn't have a 'p' tag.";
  if (!n[1].match(/^[a-f0-9]{64}$/))
    return "Zap request 'p' tag is not valid hex.";
  let r = t.tags.find(([o, s]) => o === "e" && s);
  return r && !r[1].match(/^[a-f0-9]{64}$/) ? "Zap request 'e' tag is not valid hex." : t.tags.find(([o, s]) => o === "relays" && s) ? null : "Zap request doesn't have a 'relays' tag.";
}
function sp({
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
function ap(e) {
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
var lp = {};
P(lp, {
  Negentropy: () => La,
  NegentropyStorageVector: () => fp,
  NegentropySync: () => dp
});
var br = 97, It = 32, Ca = 16, dt = {
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
function vn(e) {
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
function Pe(e) {
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
function cp(e) {
  return Rn(e, 1)[0];
}
function Rn(e, t) {
  if (e.length < t)
    throw Error("parse ends prematurely");
  return e.shiftN(t);
}
var up = class {
  buf;
  constructor() {
    this.setToZero();
  }
  setToZero() {
    this.buf = new Uint8Array(It);
  }
  add(e) {
    let t = 0, n = 0, r = new DataView(this.buf.buffer), i = new DataView(e.buffer);
    for (let o = 0; o < 8; o++) {
      let s = o * 4, l = r.getUint32(s, !0), a = i.getUint32(s, !0), c = l;
      c += t, c += a, c > 4294967295 && (n = 1), r.setUint32(s, c & 4294967295, !0), t = n, n = 0;
    }
  }
  negate() {
    let e = new DataView(this.buf.buffer);
    for (let n = 0; n < 8; n++) {
      let r = n * 4;
      e.setUint32(r, ~e.getUint32(r, !0));
    }
    let t = new Uint8Array(It);
    t[0] = 1, this.add(t);
  }
  getFingerprint(e) {
    let t = new je();
    return t.extend(this.buf), t.extend(Pe(e)), Me(t.unwrap()).subarray(0, Ca);
  }
}, fp = class {
  items;
  sealed;
  constructor() {
    this.items = [], this.sealed = !1;
  }
  insert(e, t) {
    if (this.sealed)
      throw Error("already sealed");
    const n = G(t);
    if (n.byteLength !== It)
      throw Error("bad id size for added item");
    this.items.push({ timestamp: e, id: n });
  }
  seal() {
    if (this.sealed)
      throw Error("already sealed");
    this.sealed = !0, this.items.sort(wr);
    for (let e = 1; e < this.items.length; e++)
      if (wr(this.items[e - 1], this.items[e]) === 0)
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
    return this._checkSealed(), this._checkBounds(e, t), this._binarySearch(this.items, e, t, (r) => wr(r, n) < 0);
  }
  fingerprint(e, t) {
    let n = new up();
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
}, La = class {
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
    return e.extend(new Uint8Array([br])), this.splitRange(0, this.storage.size(), this._bound(Number.MAX_VALUE), e), q(e.unwrap());
  }
  reconcile(e, t, n) {
    const r = new je(G(e));
    this.lastTimestampIn = this.lastTimestampOut = 0;
    let i = new je();
    i.extend(new Uint8Array([br]));
    let o = cp(r);
    if (o < 96 || o > 111)
      throw Error("invalid negentropy protocol version byte");
    if (o !== br)
      throw Error("unsupported negentropy protocol version requested: " + (o - 96));
    let s = this.storage.size(), l = this._bound(0), a = 0, c = !1;
    for (; r.length !== 0; ) {
      let u = new je(), f = () => {
        c && (c = !1, u.extend(this.encodeBound(l)), u.extend(Pe(dt.Skip)));
      }, d = this.decodeBound(r), h = vn(r), p = a, b = this.storage.findLowerBound(a, s, d);
      if (h === dt.Skip)
        c = !0;
      else if (h === dt.Fingerprint) {
        let v = Rn(r, Ca), m = this.storage.fingerprint(p, b);
        Ba(v, m) !== 0 ? (f(), this.splitRange(p, b, d, u)) : c = !0;
      } else if (h === dt.IdList) {
        let v = vn(r), m = {};
        for (let S = 0; S < v; S++) {
          let B = Rn(r, It);
          m[q(B)] = B;
        }
        if (c = !0, this.storage.iterate(p, b, (S) => {
          let B = S.id;
          const D = q(B);
          return m[D] ? delete m[q(B)] : t?.(D), !0;
        }), n)
          for (let S of Object.values(m))
            n(q(S));
      } else
        throw Error("unexpected mode");
      if (this.exceededFrameSizeLimit(i.length + u.length)) {
        let v = this.storage.fingerprint(b, s);
        i.extend(this.encodeBound(this._bound(Number.MAX_VALUE))), i.extend(Pe(dt.Fingerprint)), i.extend(v);
        break;
      } else
        i.extend(u);
      a = b, l = d;
    }
    return i.length === 1 ? null : q(i.unwrap());
  }
  splitRange(e, t, n, r) {
    let i = t - e, o = 16;
    if (i < o * 2)
      r.extend(this.encodeBound(n)), r.extend(Pe(dt.IdList)), r.extend(Pe(i)), this.storage.iterate(e, t, (s) => (r.extend(s.id), !0));
    else {
      let s = Math.floor(i / o), l = i % o, a = e;
      for (let c = 0; c < o; c++) {
        let u = s + (c < l ? 1 : 0), f = this.storage.fingerprint(a, a + u);
        a += u;
        let d;
        if (a === t)
          d = n;
        else {
          let h, p;
          this.storage.iterate(a - 1, a + 1, (b, v) => (v === a - 1 ? h = b : p = b, !0)), d = this.getMinimalBound(h, p);
        }
        r.extend(this.encodeBound(d)), r.extend(Pe(dt.Fingerprint)), r.extend(f);
      }
    }
  }
  exceededFrameSizeLimit(e) {
    return e > this.frameSizeLimit - 200;
  }
  decodeTimestampIn(e) {
    let t = vn(e);
    return t = t === 0 ? Number.MAX_VALUE : t - 1, this.lastTimestampIn === Number.MAX_VALUE || t === Number.MAX_VALUE ? (this.lastTimestampIn = Number.MAX_VALUE, Number.MAX_VALUE) : (t += this.lastTimestampIn, this.lastTimestampIn = t, t);
  }
  decodeBound(e) {
    let t = this.decodeTimestampIn(e), n = vn(e);
    if (n > It)
      throw Error("bound key too long");
    let r = Rn(e, n);
    return { timestamp: t, id: r };
  }
  encodeTimestampOut(e) {
    if (e === Number.MAX_VALUE)
      return this.lastTimestampOut = Number.MAX_VALUE, Pe(0);
    let t = e;
    return e -= this.lastTimestampOut, this.lastTimestampOut = t, Pe(e + 1);
  }
  encodeBound(e) {
    let t = new je();
    return t.extend(this.encodeTimestampOut(e.timestamp)), t.extend(Pe(e.id.length)), t.extend(e.id), t;
  }
  getMinimalBound(e, t) {
    if (t.timestamp !== e.timestamp)
      return this._bound(t.timestamp);
    {
      let n = 0, r = t.id, i = e.id;
      for (let o = 0; o < It && r[o] === i[o]; o++)
        n++;
      return this._bound(t.timestamp, t.id.subarray(0, n + 1));
    }
  }
};
function Ba(e, t) {
  for (let n = 0; n < e.byteLength; n++) {
    if (e[n] < t[n])
      return -1;
    if (e[n] > t[n])
      return 1;
  }
  return e.byteLength > t.byteLength ? 1 : e.byteLength < t.byteLength ? -1 : 0;
}
function wr(e, t) {
  return e.timestamp === t.timestamp ? Ba(e.id, t.id) : e.timestamp - t.timestamp;
}
var dp = class {
  relay;
  storage;
  neg;
  filter;
  subscription;
  onhave;
  onneed;
  constructor(e, t, n, r = {}) {
    this.relay = e, this.storage = t, this.neg = new La(t), this.onhave = r.onhave, this.onneed = r.onneed, this.filter = n, this.subscription = this.relay.prepareSubscription([{}], { label: r.label || "negentropy" }), this.subscription.oncustom = (i) => {
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
}, hp = {};
P(hp, {
  getToken: () => pp,
  hashPayload: () => Ti,
  unpackEventFromToken: () => Ia,
  validateEvent: () => Pa,
  validateEventKind: () => Ua,
  validateEventMethodTag: () => za,
  validateEventPayloadTag: () => Da,
  validateEventTimestamp: () => Na,
  validateEventUrlTag: () => Ma,
  validateToken: () => gp
});
var Oa = "Nostr ";
async function pp(e, t, n, r = !1, i) {
  const o = {
    kind: gi,
    tags: [
      ["u", e],
      ["method", t]
    ],
    created_at: Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3),
    content: ""
  };
  i && o.tags.push(["payload", Ti(i)]);
  const s = await n(o);
  return (r ? Oa : "") + ct.encode(_e.encode(JSON.stringify(s)));
}
async function gp(e, t, n) {
  const r = await Ia(e).catch((o) => {
    throw o;
  });
  return await Pa(r, t, n).catch((o) => {
    throw o;
  });
}
async function Ia(e) {
  if (!e)
    throw new Error("Missing token");
  e = e.replace(Oa, "");
  const t = Fe.decode(ct.decode(e));
  if (!t || t.length === 0 || !t.startsWith("{"))
    throw new Error("Invalid token");
  return JSON.parse(t);
}
function Na(e) {
  return e.created_at ? Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3) - e.created_at < 60 : !1;
}
function Ua(e) {
  return e.kind === gi;
}
function Ma(e, t) {
  const n = e.tags.find((r) => r[0] === "u");
  return n ? n.length > 0 && n[1] === t : !1;
}
function za(e, t) {
  const n = e.tags.find((r) => r[0] === "method");
  return n ? n.length > 0 && n[1].toLowerCase() === t.toLowerCase() : !1;
}
function Ti(e) {
  const t = Me(_e.encode(JSON.stringify(e)));
  return q(t);
}
function Da(e, t) {
  const n = e.tags.find((i) => i[0] === "payload");
  if (!n)
    return !1;
  const r = Ti(t);
  return n.length > 0 && n[1] === r;
}
async function Pa(e, t, n, r) {
  if (!ci(e))
    throw new Error("Invalid nostr event, signature invalid");
  if (!Ua(e))
    throw new Error("Invalid nostr event, kind invalid");
  if (!Na(e))
    throw new Error("Invalid nostr event, created_at timestamp invalid");
  if (!Ma(e, t))
    throw new Error("Invalid nostr event, url tag invalid");
  if (!za(e, n))
    throw new Error("Invalid nostr event, method tag invalid");
  if (r && typeof r == "object" && Object.keys(r).length > 0 && !Da(e, r))
    throw new Error("Invalid nostr event, payload tag does not match request body hash");
  return !0;
}
const Cg = [
  "wss://purplepag.es/",
  "wss://directory.yabu.me/",
  "wss://indexer.coracle.social/",
  "wss://user.kindpag.es/"
], Lg = [
  "wss://nos.lol/",
  "wss://relay.damus.io/",
  "wss://relay.nostr.wirednet.jp/",
  "wss://yabu.me/",
  "wss://x.kojira.io/"
], bp = [
  "wss://relay.nostr.band/",
  "wss://nrelay.c-stellar.net/",
  "wss://nrelay-jp.c-stellar.net/"
], fo = /* @__PURE__ */ new Set(["ws:", "wss:"]), wp = new Set(bp);
class Bg {
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
class Ur {
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
    return n !== null && wp.has(n);
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
        if (!fo.has(o.protocol) || o.username || o.password)
          return null;
      }
      const r = Ws.normalizeURL(n), i = new URL(r);
      return !fo.has(i.protocol) || !i.hostname || i.username || i.password ? null : r;
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
class $n extends TypeError {
  constructor(t) {
    super(t), this.name = "HostRelayConfigError";
  }
}
function vp(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function yp(e) {
  if (!Array.isArray(e) || e.length === 0)
    throw new $n("Host relay config must be a non-empty array.");
  const t = {};
  for (const n of e) {
    if (!vp(n) || Object.keys(n).some((i) => i !== "url" && i !== "read" && i !== "write") || typeof n.url != "string" || typeof n.read != "boolean" || typeof n.write != "boolean" || !n.read && !n.write)
      throw new $n("Host relay config contains an invalid entry.");
    const r = Ur.normalizeExternalRelayUrl(n.url);
    if (!r || r in t)
      throw new $n("Host relay config contains an invalid or duplicate URL.");
    t[r] = { read: n.read, write: n.write };
  }
  return t;
}
function mp(e) {
  return Array.isArray(e) ? e.map((t) => ({
    url: Ur.normalizeRelayUrl(t),
    read: !0,
    write: !0
  })) : Object.entries(e).map(([t, n]) => ({
    url: Ur.normalizeRelayUrl(t),
    read: n.read,
    write: n.write
  }));
}
class _p extends Cc {
  #e;
  #t = null;
  /**
   * A mount-scoped, nonpersistent default Relay Config for the Full embed.
   * Assign before connection; later assignments are retained for a recreated
   * element and never mutate an active Nostr session.
   */
  get relays() {
    return this.#e ? mp(this.#e) : void 0;
  }
  set relays(t) {
    if (t === void 0) {
      this.#e = void 0, this.#t = null;
      return;
    }
    try {
      this.#e = yp(t), this.#t = null;
    } catch (n) {
      this.#e = void 0, this.#t = n instanceof $n ? n.message : "Invalid relays property.";
    }
  }
  loadApp() {
    return import("./App-CGgJsLME.js").then((t) => t.eC);
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
const ho = Symbol.for("ehagaki-composer.distribution");
function Ep(e, t) {
  const n = globalThis, r = n[ho];
  if (r && r !== e)
    throw new Error(
      `Cannot import the ${e} eHagaki Composer distribution after ${r} in the same document.`
    );
  n[ho] = e;
  const i = customElements.get(qi);
  if (!i) {
    customElements.define(qi, t);
    return;
  }
  if (i !== t)
    throw new Error("ehagaki-composer is already defined by a different distribution.");
}
Ep("full", _p);
export {
  ot as $,
  jp as A,
  $e as B,
  dn as C,
  Op as D,
  en as E,
  Nn as F,
  kp as G,
  Tp as H,
  Xp as I,
  qa as J,
  Lp as K,
  Np as L,
  an as M,
  Bp as N,
  Oe as O,
  ve as P,
  it as Q,
  Ie as R,
  Ip as S,
  Ml as T,
  We as U,
  Dt as V,
  vo as W,
  sn as X,
  yo as Y,
  lg as Z,
  L as _,
  qe as a,
  fg as a$,
  Fl as a0,
  Do as a1,
  Pp as a2,
  Hp as a3,
  Fn as a4,
  Mt as a5,
  wo as a6,
  $p as a7,
  bg as a8,
  ag as a9,
  wt as aA,
  jr as aB,
  at as aC,
  xp as aD,
  Ya as aE,
  Ct as aF,
  Cp as aG,
  Mp as aH,
  Up as aI,
  Gt as aJ,
  zp as aK,
  Dp as aL,
  el as aM,
  og as aN,
  Pd as aO,
  li as aP,
  dc as aQ,
  Yp as aR,
  Ye as aS,
  yt as aT,
  Jt as aU,
  Sl as aV,
  vg as aW,
  Gp as aX,
  Kp as aY,
  Zp as aZ,
  sg as a_,
  qo as aa,
  dg as ab,
  cg as ac,
  Ja as ad,
  Qa as ae,
  qp as af,
  Jp as ag,
  ig as ah,
  Cl as ai,
  Ap as aj,
  Xa as ak,
  hl as al,
  Va as am,
  Rp as an,
  hg as ao,
  mg as ap,
  _g as aq,
  ns as ar,
  rg as as,
  gg as at,
  te as au,
  pg as av,
  yn as aw,
  zl as ax,
  ae as ay,
  Oi as az,
  Qe as b,
  yl as b0,
  kg as b1,
  eg as b2,
  ic as b3,
  ml as b4,
  Ro as b5,
  Rg as b6,
  Ag as b7,
  Qp as b8,
  Vp as b9,
  ph as bA,
  Bg as bB,
  yg as bC,
  Cg as bD,
  Lg as bE,
  si as bF,
  Sn as bG,
  ci as bH,
  _c as bI,
  qi as bJ,
  _p as bK,
  Eg as ba,
  Wp as bb,
  Kr as bc,
  is as bd,
  Pl as be,
  tg as bf,
  wg as bg,
  xg as bh,
  Sg as bi,
  bl as bj,
  Ur as bk,
  $g as bl,
  Qr as bm,
  G as bn,
  Zu as bo,
  Me as bp,
  Su as bq,
  Gs as br,
  ct as bs,
  fe as bt,
  Vt as bu,
  Kt as bv,
  q as bw,
  Gu as bx,
  un as by,
  of as bz,
  ug as c,
  Cn as d,
  Re as e,
  Ge as f,
  po as g,
  ft as h,
  Ha as i,
  U as j,
  Kl as k,
  ng as l,
  Nl as m,
  Za as n,
  Fa as o,
  _n as p,
  X as q,
  Ga as r,
  vl as s,
  Ho as t,
  Wl as u,
  M as v,
  ql as w,
  zr as x,
  Fp as y,
  wl as z
};
