// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/shared/utils.js
var e = Array.isArray, t = Array.prototype.indexOf, n = Array.prototype.includes, r = Array.from, i = Object.defineProperty, a = Object.getOwnPropertyDescriptor, o = Object.getOwnPropertyDescriptors, s = Object.prototype, c = Array.prototype, l = Object.getPrototypeOf, u = Object.isExtensible;
function d(e) {
	return typeof e == "function";
}
var f = () => {};
function p(e) {
	for (var t = 0; t < e.length; t++) e[t]();
}
function m() {
	var e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
}
function h(e, t) {
	if (Array.isArray(e)) return e;
	if (t === void 0 || !(Symbol.iterator in e)) return Array.from(e);
	let n = [];
	for (let r of e) if (n.push(r), n.length === t) break;
	return n;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/constants.js
var g = 1 << 24, _ = 1024, v = 2048, y = 4096, b = 8192, x = 16384, S = 32768, ee = 1 << 25, C = 65536, te = 1 << 19, ne = 1 << 20, re = 1 << 25, ie = 1 << 21, ae = 1 << 22, oe = 1 << 23, se = Symbol("$state"), ce = Symbol("component"), le = Symbol("legacy props"), ue = Symbol(""), de = Symbol("proxy path"), fe = Symbol("attributes"), pe = Symbol("class"), me = Symbol("style"), he = Symbol("text"), ge = Symbol("form reset"), _e = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), ve = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml"), ye = {}, w = Symbol("uninitialized"), be = "http://www.w3.org/1999/xhtml", xe = "http://www.w3.org/2000/svg", Se = "http://www.w3.org/1998/Math/MathML", Ce = "@attach";
function we() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function Te(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function Ee() {
	console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function De() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/hydration.js
var T = !1;
function E(e) {
	T = e;
}
var D;
function O(e) {
	if (e === null) throw Te(), ye;
	return D = e;
}
function k() {
	return O(/* @__PURE__ */ z(D));
}
function Oe(e) {
	if (T) {
		if (/* @__PURE__ */ z(D) !== null) throw Te(), ye;
		D = e;
	}
}
function ke(e = 1) {
	if (T) {
		for (var t = e, n = D; t--;) n = /* @__PURE__ */ z(n);
		D = n;
	}
}
function Ae(e = !0) {
	for (var t = 0, n = D;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ z(n);
		e && n.remove(), n = i;
	}
}
function je(e) {
	if (!e || e.nodeType !== 8) throw Te(), ye;
	return e.data;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/reactivity/equality.js
function Me(e) {
	return e === this.v;
}
function Ne(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Pe(e) {
	return !Ne(e, this.v);
}
function Fe(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/errors.js
function Ie() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function Le(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function Re(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function ze() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Be(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function Ve() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function He(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function Ue() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function We() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Ge() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Ke() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/shared/clone.js
var qe = [];
function Je(e, t = !1, n = !1) {
	return Ye(e, /* @__PURE__ */ new Map(), "", qe, null, n);
}
function Ye(t, n, r, i, a = null, o = !1) {
	if (typeof t == "object" && t) {
		var c = n.get(t);
		if (c !== void 0) return c;
		if (t instanceof Map) return new Map(t);
		if (t instanceof Set) return new Set(t);
		if (e(t)) {
			var u = Array(t.length);
			n.set(t, u), a !== null && n.set(a, u);
			for (var d = 0; d < t.length; d += 1) {
				var f = t[d];
				d in t && (u[d] = Ye(f, n, r, i, null, o));
			}
			return u;
		}
		if (l(t) === s) {
			u = {}, n.set(t, u), a !== null && n.set(a, u);
			for (var p of Object.keys(t)) u[p] = Ye(t[p], n, r, i, null, o);
			return u;
		}
		if (t instanceof Date) return t.getTime(), structuredClone(t);
		if (typeof t.toJSON == "function" && !o) return Ye(t.toJSON(), n, r, i, t);
	}
	if (t instanceof EventTarget) return t;
	try {
		return structuredClone(t);
	} catch {
		return t;
	}
}
function Xe(e, t) {
	return e.label = t, Ze(e.v, t), e;
}
function Ze(e, t) {
	return e?.[de]?.(t), e;
}
function Qe(e) {
	return typeof e == "symbol" ? `Symbol(${e.description})` : typeof e == "function" ? "<function>" : typeof e == "object" && e ? "<object>" : String(e);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/shared/context.js
function $e(e) {
	let t = e.p;
	for (; t !== null && t.c === null;) t = t.p;
	return t?.c ?? null;
}
function et(e, t) {
	return e === null && Fe(t), e.c ??= new Map($e(e) || void 0);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/context.js
var A = null;
function tt(e) {
	A = e;
}
function nt(e) {
	return et(A, "getContext").get(e);
}
function rt(e, t) {
	return et(A, "setContext").set(e, t), t;
}
function it(e) {
	return et(A, "hasContext").has(e);
}
function at() {
	return et(A, "getAllContexts");
}
function ot(e, t = !1, n) {
	A = {
		p: A,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: q,
		l: null
	};
}
function st(e) {
	var t = A, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) Nn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, A = t.p, ct(e);
}
function ct(e = {}) {
	return i(e, ce, { value: !0 }), e;
}
function lt() {
	return !0;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/task.js
var ut = [];
function dt() {
	var e = ut;
	ut = [], p(e);
}
function j(e) {
	if (ut.length === 0 && !Rt) {
		var t = ut;
		queueMicrotask(() => {
			t === ut && dt();
		});
	}
	ut.push(e);
}
function ft() {
	for (; ut.length > 0;) dt();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/reactivity/status.js
var pt = ~(v | y | _);
function M(e, t) {
	e.f = e.f & pt | t;
}
function mt(e) {
	e.f & 512 || e.deps === null ? M(e, _) : M(e, y);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/reactivity/utils.js
function ht(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), M(e, _);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/elements/misc.js
function gt(e, t) {
	if (t) {
		let t = document.body;
		e.autofocus = !0, j(() => {
			document.activeElement === t && e.focus();
		});
	}
}
var _t = !1;
function vt() {
	_t || (_t = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[ge]?.();
		});
	}, { capture: !0 }));
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function yt(e) {
	var t = W, n = q;
	K(null), nr(null);
	try {
		return e();
	} finally {
		K(t), nr(n);
	}
}
function bt(e, t, n, r = n) {
	e.addEventListener(t, () => yt(n));
	let i = e[ge];
	e[ge] = i ? () => {
		i(), r(!0);
	} : () => r(!0), vt();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/reactivity/async.js
function xt(e, t, n, r) {
	let i = lt() ? Tt : kt;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = q, c = St(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				B(e, s);
			}
			Ct();
		}
	}
	var d = wt();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ Dt(e))).then(u).catch((e) => B(e, s)).finally(d);
	}
	l ? l.then(() => {
		s.f & 16384 ? d() : (c(), f(), Ct());
	}) : f();
}
function St() {
	var e = q, t = W, n = A, r = N;
	return function(i = !0) {
		nr(e), K(t), tt(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function Ct(e = !0) {
	nr(null), K(null), tt(null), e && N?.deactivate();
}
function wt() {
	var e = q, t = e.b, n = N, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Tt(e) {
	var t = 2 | v;
	return q !== null && (q.f |= te), {
		ctx: A,
		deps: null,
		effects: null,
		equals: Me,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: w,
		wv: 0,
		parent: q,
		ac: null
	};
}
var Et = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function Dt(e, t, n) {
	let r = q;
	r === null && Ie();
	var i = void 0, a = en(w), o = !W, s = /* @__PURE__ */ new Set();
	return Rn(() => {
		var t = q, n = m();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== _e && n.reject(e);
			}).finally(Ct);
		} catch (e) {
			n.reject(e), Ct();
		}
		var c = N;
		if (o) {
			if (t.f & 32768) var l = wt();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(Et);
			else for (let e of s.values()) e.reject(Et);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== Et && (c.activate(), t ? (a.f |= oe, on(a, t)) : (a.f & 8388608 && (a.f ^= oe), on(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), jn(() => {
		for (let e of s) e.reject(Et);
	}), new Promise((e) => {
		function t(n) {
			function r() {
				n === i ? e(a) : t(i);
			}
			n.then(r, r);
		}
		t(i);
	});
}
/*#__NO_SIDE_EFFECTS__*/
function Ot(e) {
	let t = /* @__PURE__ */ Tt(e);
	return ir(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function kt(e) {
	let t = /* @__PURE__ */ Tt(e);
	return t.equals = Pe, t;
}
function At(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) U(t[n]);
	}
}
function jt(e) {
	var t, n = q, r = e.parent;
	if (!er && r !== null && e.v !== w && r.f & 24576) return we(), e.v;
	nr(r);
	try {
		At(e), t = pr(e);
	} finally {
		nr(n);
	}
	return t;
}
function Mt(e) {
	var t = jt(e);
	!e.equals(t) && (e.wv = ur(), (!N?.is_fork || e.deps === null) && (N === null ? e.v = t : (N.capture(e, t, !0), It?.capture(e, t, !0)), e.deps === null)) ? M(e, _) : er || (P === null ? mt(e) : (An() || N?.is_fork) && P.set(e, t));
}
function Nt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && yt(() => {
		t.ac.abort(_e), t.ac = null;
	}), t.fn !== null && (t.teardown = f), gr(t, 0), Wn(t));
}
function Pt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && _r(t);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/reactivity/batch.js
var Ft = null, N = null, It = null, P = null, Lt = null, Rt = !1, zt = !1, Bt = null, Vt = null, Ht = 0, Ut = 1, Wt = class e {
	id = Ut++;
	#e = !1;
	linked = !0;
	#t = null;
	#n = null;
	async_deriveds = /* @__PURE__ */ new Map();
	current = /* @__PURE__ */ new Map();
	previous = /* @__PURE__ */ new Map();
	#r = /* @__PURE__ */ new Set();
	#i = /* @__PURE__ */ new Set();
	#a = 0;
	#o = /* @__PURE__ */ new Map();
	#s = null;
	#c = [];
	#l = [];
	#u = /* @__PURE__ */ new Set();
	#d = /* @__PURE__ */ new Set();
	#f = /* @__PURE__ */ new Map();
	#p = /* @__PURE__ */ new Set();
	is_fork = !1;
	#m = !1;
	constructor() {
		Ft === null ? Ft = this : (Ft.#n = this, this.#t = Ft), Ft = this;
	}
	#h() {
		if (this.is_fork) return !0;
		for (let n of this.#o.keys()) {
			for (var e = n, t = !1; e.parent !== null;) {
				if (this.#f.has(e)) {
					t = !0;
					break;
				}
				e = e.parent;
			}
			if (!t) return !0;
		}
		return !1;
	}
	skip_effect(e) {
		this.#f.has(e) || this.#f.set(e, {
			d: [],
			m: []
		}), this.#p.delete(e);
	}
	unskip_effect(e, t = (e) => this.schedule(e)) {
		var n = this.#f.get(e);
		if (n) {
			this.#f.delete(e);
			for (var r of n.d) M(r, v), t(r);
			for (r of n.m) M(r, y), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		var e = [];
		for (let i of this.#c) if (!(i.f & 16384 || !(i.f & 6144))) {
			for (var t = i, n = !1; t.parent !== null;) {
				t = t.parent;
				var r = t.f;
				if (r & 96) {
					if (!(r & 1024)) {
						n = !0;
						break;
					}
					t.f ^= _;
				}
			}
			n || e.push(t);
		}
		return this.#c = [], e;
	}
	#_() {
		this.#e = !0;
		for (let e of this.#u) this.#d.delete(e), M(e, v), this.schedule(e);
		for (let e of this.#d) M(e, y), this.schedule(e);
		this.apply();
		for (var t = Bt = [], n = [], r = Vt = []; this.#c.length > 0;) {
			Ht++ > 1e3 && (this.#S(), Kt());
			for (let e of this.#g()) try {
				this.#v(e, t, n);
			} catch (t) {
				throw Zt(e), this.#h() || this.discard(), t;
			}
		}
		if (N = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (Bt = null, Vt = null, this.#h()) {
			this.#x(n), this.#x(t);
			for (let [e, t] of this.#f) Xt(e, t);
			r.length > 0 && N.#_();
			return;
		}
		let a = this.#y();
		if (a) this.#x(n), this.#x(t), a.#b(this);
		else {
			this.#u.clear(), this.#d.clear();
			for (let e of this.#r) e(this);
			this.#r.clear(), It = this, Jt(n), Jt(t), It = null, this.#s?.resolve();
			var o = N;
			if (this.#a === 0 && (this.#c.length === 0 || o !== null) && this.#S(), this.#c.length > 0) {
				if (o !== null) {
					for (let e of this.#c) o.#c.push(e);
					this.#c = [];
				} else o = this;
			}
			o !== null && (F.clear(), o.#_());
		}
	}
	#v(e, t, n) {
		e.f ^= _;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= _ : i & 4 ? t.push(r) : dr(r) && (i & 16 && this.#d.add(r), _r(r));
				var o = r.first;
				if (o !== null) {
					r = o;
					continue;
				}
			}
			for (; r !== null;) {
				var s = r.next;
				if (s !== null) {
					r = s;
					break;
				}
				r = r.parent;
			}
		}
	}
	#y() {
		for (var e = this.#t; e !== null;) {
			if (!e.is_fork) {
				for (let [t, [, n]] of this.current) if (e.current.has(t) && !n) return e;
			}
			e = e.#t;
		}
		return null;
	}
	#b(e) {
		for (let [t, n] of e.current) !this.previous.has(t) && e.previous.has(t) && this.previous.set(t, e.previous.get(t)), this.current.set(t, n);
		for (let [t, n] of e.async_deriveds) {
			let e = this.async_deriveds.get(t);
			e && n.promise.then(e.resolve).catch(e.reject);
		}
		e.async_deriveds.clear(), this.transfer_effects(e.#u, e.#d);
		let t = (e) => {
			var n = e.reactions;
			if (n !== null && !(e.f & 2 && !(e.f & 6144))) for (let e of n) {
				var r = e.f;
				if (r & 2) t(e);
				else {
					var i = e;
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), M(i, v), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#S(), N = this, this.#_();
	}
	#x(e) {
		for (var t = 0; t < e.length; t += 1) ht(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== w && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), P?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		N = this;
	}
	deactivate() {
		N = null, P = null;
	}
	flush() {
		try {
			zt = !0, N = this, this.#_();
		} finally {
			Ht = 0, Lt = null, Bt = null, Vt = null, zt = !1, N = null, P = null, F.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(Et);
		this.#S(), this.#s?.resolve();
	}
	register_created_effect(e) {
		this.#l.push(e);
	}
	increment(e, t) {
		if (this.#a += 1, e) {
			let e = this.#o.get(t) ?? 0;
			this.#o.set(t, e + 1);
		}
	}
	decrement(e, t) {
		if (--this.#a, e) {
			let e = this.#o.get(t) ?? 0;
			e === 1 ? this.#o.delete(t) : this.#o.set(t, e - 1);
		}
		this.#m || (this.#m = !0, j(() => {
			this.#m = !1, this.linked && this.flush();
		}));
	}
	transfer_effects(e, t) {
		for (let t of e) this.#u.add(t);
		for (let e of t) this.#d.add(e);
		e.clear(), t.clear();
	}
	oncommit(e) {
		this.#r.add(e);
	}
	ondiscard(e) {
		this.#i.add(e);
	}
	settled() {
		return (this.#s ??= m()).promise;
	}
	static ensure() {
		if (N === null) {
			let t = N = new e();
			!zt && !Rt && j(() => {
				t.#e || t.flush();
			});
		}
		return N;
	}
	apply() {
		P = null;
	}
	schedule(e) {
		Lt = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768) ? e.b.defer_effect(e) : this.#c.push(e);
	}
	#S() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? Ft = e : t.#t = e, this.linked = !1;
		}
	}
};
function Gt(e) {
	var t = Rt, n = It;
	It = null, Rt = !0;
	try {
		var r;
		for (e && (Gt(), r = e());;) {
			if (ft(), N === null) return r;
			N.flush();
		}
	} finally {
		Rt = t, It = n;
	}
}
function Kt() {
	try {
		Ve();
	} catch (e) {
		B(e, Lt);
	}
}
var qt = null;
function Jt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && dr(r) && (qt = /* @__PURE__ */ new Set(), _r(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && qn(r), qt?.size > 0)) {
				F.clear();
				for (let e of qt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) qt.has(n) && (qt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || _r(n);
					}
				}
				qt.clear();
			}
		}
		qt = null;
	}
}
function Yt(e) {
	N.schedule(e);
}
function Xt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), M(e, _);
		for (var n = e.first; n !== null;) Xt(n, t), n = n.next;
	}
}
function Zt(e) {
	M(e, _);
	for (var t = e.first; t !== null;) Zt(t), t = t.next;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/reactivity/sources.js
var Qt = /* @__PURE__ */ new Set(), F = /* @__PURE__ */ new Map(), $t = !1;
function en(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Me,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function tn(e, t) {
	let n = en(e, t);
	return ir(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function nn(e, t = !1, n = !0) {
	let r = en(e);
	return t || (r.equals = Pe), r;
}
function I(e, t, n = !1) {
	return W !== null && (!G || W.f & 131072) && lt() && W.f & 4325394 && (rr === null || !rr.has(e)) && Ge(), on(e, n ? dn(t) : t, Vt);
}
var rn = null, an = 0;
function on(e, t, n = null) {
	if (!e.equals(t)) {
		er ? F.set(e, t) : F.has(e) || F.set(e, e.v);
		var r = Wt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && jt(t), P === null && mt(t);
		}
		e.wv = ur(), rn = null, an = 0, un(e, v, n), rn = null, lt() && q !== null && q.f & 1024 && !(q.f & 96) && (X === null ? ar([e]) : X.push(e)), !r.is_fork && Qt.size > 0 && !$t && sn();
	}
	return t;
}
function sn() {
	$t = !1;
	for (let e of Qt) {
		e.f & 1024 && M(e, y);
		let t;
		try {
			t = dr(e);
		} catch {
			t = !0;
		}
		t && _r(e);
	}
	Qt.clear();
}
function cn(e, t = 1) {
	var n = Z(e), r = t === 1 ? n++ : n--;
	return I(e, n), r;
}
function ln(e) {
	I(e, e.v + 1);
}
function un(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = lt(), a = r.length;
		if (an += a, an > 1e5 && rn === null && (rn = /* @__PURE__ */ new Set()), rn !== null) {
			if (rn.has(e)) return;
			rn.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== q) {
				var l = (c & v) === 0;
				if (l && M(s, t), c & 131072) Qt.add(s);
				else if (c & 2) {
					var u = s;
					P?.delete(u), un(u, y, n);
				} else if (l) {
					var d = s;
					c & 16 && qt !== null && qt.add(d), n === null ? Yt(d) : n.push(d);
				}
			}
		}
	}
}
function dn(t) {
	if (typeof t != "object" || !t || se in t || ce in t) return t;
	let n = l(t);
	if (n !== s && n !== c) return t;
	var r = /* @__PURE__ */ new Map(), i = e(t), o = /* @__PURE__ */ tn(0), u = null, d = cr, f = (e) => {
		if (cr === d) return e();
		var t = W, n = cr;
		K(null), lr(d);
		var r = e();
		return K(t), lr(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ tn(t.length, u)), new Proxy(t, {
		defineProperty(e, t, n) {
			"value" in n && n.configurable !== !1 && n.enumerable !== !1 && n.writable !== !1 || Ue();
			var i = r.get(t);
			return i === void 0 ? f(() => {
				var e = /* @__PURE__ */ tn(n.value, u);
				return r.set(t, e), e;
			}) : I(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var n = r.get(t);
			if (n === void 0) {
				if (t in e) {
					let e = f(() => /* @__PURE__ */ tn(w, u));
					r.set(t, e), ln(o);
				}
			} else I(n, w), ln(o);
			return !0;
		},
		get(e, n, i) {
			if (n === se) return t;
			var o = r.get(n), s = n in e;
			if (o === void 0 && (!s || a(e, n)?.writable) && (o = f(() => /* @__PURE__ */ tn(dn(s ? e[n] : w), u)), r.set(n, o)), o !== void 0) {
				var c = Z(o);
				return c === w ? void 0 : c;
			}
			return Reflect.get(e, n, i);
		},
		getOwnPropertyDescriptor(e, t) {
			this.has?.(e, t);
			var n = Reflect.getOwnPropertyDescriptor(e, t), i = r.get(t);
			if (i !== void 0) {
				var a = Z(i);
				if (a === w) return;
				if (n && "value" in n) n.value = a;
				else return {
					enumerable: !0,
					configurable: !0,
					value: a,
					writable: !0
				};
			}
			return n;
		},
		has(e, t) {
			if (t === se) return !0;
			var n = r.get(t), i = n !== void 0 && n.v !== w || Reflect.has(e, t);
			return (n !== void 0 || q !== null && (!i || a(e, t)?.writable)) && (n === void 0 && (n = f(() => /* @__PURE__ */ tn(i ? dn(e[t]) : w, u)), r.set(t, n)), Z(n) === w) ? !1 : i;
		},
		set(e, t, n, s) {
			var c = r.get(t), l = t in e;
			if (i && t === "length") for (var d = n; d < c.v; d += 1) {
				var p = r.get(d + "");
				p === void 0 ? d in e && (p = f(() => /* @__PURE__ */ tn(w, u)), r.set(d + "", p)) : I(p, w);
			}
			if (c === void 0) (!l || a(e, t)?.writable) && (c = f(() => /* @__PURE__ */ tn(void 0, u)), I(c, dn(n)), r.set(t, c));
			else {
				l = c.v !== w;
				var m = f(() => dn(n));
				I(c, m);
			}
			var h = Reflect.getOwnPropertyDescriptor(e, t);
			if (h?.set && h.set.call(s, n), !l) {
				if (i && typeof t == "string") {
					var g = r.get("length"), _ = Number(t);
					Number.isInteger(_) && _ >= g.v && I(g, _ + 1);
				}
				ln(o);
			}
			return !0;
		},
		ownKeys(e) {
			Z(o);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = r.get(e);
				return t === void 0 || t.v !== w;
			});
			for (var [n, i] of r) i.v !== w && !(n in e) && t.push(n);
			return t;
		},
		setPrototypeOf() {
			We();
		}
	});
}
function fn(e) {
	try {
		if (typeof e == "object" && e && se in e) return e[se];
	} catch {}
	return e;
}
function pn(e, t) {
	return Object.is(fn(e), fn(t));
}
var mn, hn, gn, _n;
function vn() {
	if (mn === void 0) {
		mn = window, hn = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		gn = a(t, "firstChild").get, _n = a(t, "nextSibling").get, u(e) && (e[pe] = void 0, e[fe] = null, e[me] = void 0, e.__e = void 0), u(n) && (n[he] = void 0);
	}
}
function L(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function R(e) {
	return gn.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function z(e) {
	return _n.call(e);
}
function yn(e, t) {
	if (!T) return /* @__PURE__ */ R(e);
	var n = /* @__PURE__ */ R(D);
	if (n === null) n = D.appendChild(L());
	else if (t && n.nodeType !== 3) {
		var r = L();
		return n?.before(r), O(r), r;
	}
	return t && En(n), O(n), n;
}
function bn(e, t = !1) {
	if (!T) {
		var n = /* @__PURE__ */ R(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ z(n) : n;
	}
	if (t) {
		if (D?.nodeType !== 3) {
			var r = L();
			return D?.before(r), O(r), r;
		}
		En(D);
	}
	return D;
}
function xn(e, t = !1) {
	if (!T) return /* @__PURE__ */ R(e);
	var n = yn(e, t);
	return Oe(e), n;
}
function Sn(e, t = 1, n = !1) {
	let r = T ? D : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ z(r);
	if (!T) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = L();
			return r === null ? i?.after(a) : r.before(a), O(a), a;
		}
		En(r);
	}
	return O(r), r;
}
function Cn(e) {
	e.textContent = "";
}
function wn() {
	return !1;
}
function Tn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function En(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function Dn(e) {
	var t = q;
	if (t === null) return W.f |= oe, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	B(e, t);
}
function B(e, t) {
	if (e === ye) throw e;
	if (!(t !== null && t.f & 16384)) {
		for (; t !== null;) {
			if (t.f & 128 && !(t.f & 33570816)) {
				if (!(t.f & 32768)) throw e;
				try {
					t.b.error(e);
					return;
				} catch (t) {
					e = t;
				}
			}
			t = t.parent;
		}
		throw e;
	}
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/reactivity/effects.js
function On(e) {
	q === null && (W === null && Be(e), ze()), er && Re(e);
}
function kn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function V(e, t) {
	var n = q;
	n !== null && n.f & 8192 && (e |= b);
	var r = {
		ctx: A,
		deps: null,
		nodes: null,
		f: e | v | 512,
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
	N?.register_created_effect(r);
	var i = r;
	if (e & 4) Bt === null ? Wt.ensure().schedule(r) : Bt.push(r);
	else if (t !== null) {
		try {
			_r(r);
		} catch (e) {
			throw U(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= C));
	}
	if (i !== null && (i.parent = n, n !== null && kn(i, n), W !== null && W.f & 2 && !(e & 64))) {
		var a = W;
		(a.effects ??= []).push(i);
	}
	return r;
}
function An() {
	return W !== null && !G;
}
function jn(e) {
	let t = V(8, null);
	return M(t, _), t.teardown = e, t;
}
function Mn(e) {
	On("$effect");
	var t = q.f;
	if (!W && t & 32 && A !== null && !A.i) {
		var n = A;
		(n.e ??= []).push(e);
	} else return Nn(e);
}
function Nn(e) {
	return V(4 | ne, e);
}
function Pn(e) {
	return On("$effect.pre"), V(8 | ne, e);
}
function Fn(e) {
	Wt.ensure();
	let t = V(64 | te, e);
	return () => {
		U(t);
	};
}
function In(e) {
	Wt.ensure();
	let t = V(64 | te, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Jn(t, () => {
			U(t), n(void 0);
		}) : (U(t), n(void 0));
	});
}
function Ln(e) {
	return V(4, e);
}
function Rn(e) {
	return V(ae | te, e);
}
function zn(e, t = 0) {
	return V(8 | t, e);
}
function Bn(e, t = [], n = [], r = []) {
	xt(r, t, n, (t) => {
		V(8, () => {
			e(...t.map(Z));
		});
	});
}
function Vn(e, t = 0) {
	return V(16 | t, e);
}
function Hn(e, t = 0) {
	return V(g | t, e);
}
function H(e) {
	return V(32 | te, e);
}
function Un(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = er, r = W;
		tr(!0), K(null);
		try {
			t.call(null);
		} catch (t) {
			B(t, e.parent);
		} finally {
			tr(n), K(r);
		}
	}
}
function Wn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && yt(() => {
			e.abort(_e);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : U(n, t), n = r;
	}
}
function Gn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || U(t), t = n;
	}
}
function U(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Kn(e.nodes.start, e.nodes.end), n = !0), e.f |= ee, Wn(e, t && !n), gr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Un(e), e.f ^= ee, e.f |= x;
	var i = e.parent;
	i !== null && i.first !== null && qn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Kn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ z(e);
		e.remove(), e = n;
	}
}
function qn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Jn(e, t, n = !0) {
	var r = [];
	e.f |= 256, Yn(e, r, !0);
	var i = () => {
		n && U(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Yn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= b;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Yn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Xn(e) {
	e.f &= -257, Zn(e, !0);
}
function Zn(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= b, e.f & 1024 || (M(e, v), Wt.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			Zn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Qn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ z(n);
		t.append(n), n = i;
	}
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/legacy.js
var $n = null, er = !1;
function tr(e) {
	er = e;
}
var W = null, G = !1;
function K(e) {
	W = e;
}
var q = null;
function nr(e) {
	q = e;
}
var rr = null;
function ir(e) {
	W !== null && (W.f & 2097152 || W.f & 2) && (rr ??= /* @__PURE__ */ new Set()).add(e);
}
var J = null, Y = 0, X = null;
function ar(e) {
	X = e;
}
var or = 1, sr = 0, cr = sr;
function lr(e) {
	cr = e;
}
function ur() {
	return ++or;
}
function dr(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (dr(a) && Mt(a), a.wv > e.wv) return !0;
		}
		t & 512 && P === null && M(e, _);
	}
	return !1;
}
function fr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(rr !== null && rr.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? fr(a, t, !1) : t === a && (n ? M(a, v) : a.f & 1024 && M(a, y), Yt(a));
	}
}
function pr(e) {
	var t = J, n = Y, r = X, i = W, a = rr, o = A, s = G, c = cr, l = e.f;
	J = null, Y = 0, X = null, W = l & 96 ? null : e, rr = null, tt(e.ctx), G = !1, cr = ++sr, e.ac !== null && (yt(() => {
		e.ac.abort(_e);
	}), e.ac = null);
	try {
		e.f |= ie;
		var u = e.fn, d = u();
		e.f |= S;
		var f = mr(e);
		if (lt() && X !== null && !G && f !== null && !(e.f & 6146)) for (var p = 0; p < X.length; p++) fr(X[p], e);
		if (i !== null && i !== e) {
			if (sr++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = sr;
			if (t !== null) for (let e of t) e.rv = sr;
			X !== null && (r === null ? r = X : r.push(...X));
		}
		return e.f & 8388608 && (e.f ^= oe), d;
	} catch (t) {
		return mr(e), Dn(t);
	} finally {
		e.f ^= ie, J = t, Y = n, X = r, W = i, rr = a, tt(o), G = s, cr = c;
	}
}
function mr(e) {
	var t = e.deps, n = N?.is_fork;
	if (J !== null) {
		var r;
		if (n || gr(e, Y), t !== null && Y > 0) for (t.length = Y + J.length, r = 0; r < J.length; r++) t[Y + r] = J[r];
		else e.deps = t = J;
		if (An() && e.f & 512) for (r = Y; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && Y < t.length && (gr(e, Y), t.length = Y);
	return t;
}
function hr(e, r) {
	let i = r.reactions;
	if (i !== null) {
		var a = t.call(i, e);
		if (a !== -1) {
			var o = i.length - 1;
			o === 0 ? i = r.reactions = null : (i[a] = i[o], i.pop());
		}
	}
	if (i === null && r.f & 2 && (J === null || !n.call(J, r))) {
		var s = r;
		s.f & 512 && (s.f ^= 512), s.v !== w && mt(s), s.ac !== null && yt(() => {
			s.ac.abort(_e), s.ac = null, M(s, v);
		}), Nt(s), gr(s, 0);
	}
}
function gr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) hr(e, n[r]);
}
function _r(e) {
	var t = e.f;
	if (!(t & 16384)) {
		M(e, _);
		var n = q;
		q = e;
		try {
			t & 16777232 ? Gn(e) : Wn(e), Un(e);
			var r = pr(e);
			e.teardown = typeof r == "function" ? r : null, e.wv = or;
		} finally {
			q = n;
		}
	}
}
async function vr() {
	await Promise.resolve(), Gt();
}
function Z(e) {
	var t = !!(e.f & 2);
	if ($n?.add(e), W !== null && !G && !(q !== null && q.f & 16384) && (rr === null || !rr.has(e))) {
		var r = W.deps;
		if (W.f & 2097152) e.rv < sr && (e.rv = sr, J === null && r !== null && r[Y] === e ? Y++ : J === null ? J = [e] : J.push(e));
		else {
			W.deps ??= [], n.call(W.deps, e) || W.deps.push(e);
			var i = e.reactions;
			i === null ? e.reactions = [W] : n.call(i, W) || i.push(W);
		}
	}
	if (er && F.has(e)) return F.get(e);
	if (t) {
		var a = e;
		if (er) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || br(a)) && (o = jt(a)), F.set(a, o), o;
		}
		var s = !(a.f & 512) && !G && W !== null && !!(W.f & 512), c = (a.f & S) === 0;
		dr(a) && (s && (a.f |= 512), Mt(a)), s && !c && (Pt(a), yr(a));
	}
	if (P?.has(e)) return P.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function yr(e) {
	if (e.f |= 512, e.deps !== null) for (let r of e.deps) {
		var t = r.reactions;
		t === null ? r.reactions = [e] : n.call(t, e) || t.push(e), r.f & 2 && !(r.f & 512) && (Pt(r), yr(r));
	}
}
function br(e) {
	if (e.v === w) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (F.has(t) || t.f & 2 && br(t)) return !0;
	return !1;
}
function Q(e) {
	var t = G;
	try {
		return G = !0, e();
	} finally {
		G = t;
	}
}
function xr(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (se in e) Sr(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && se in n && Sr(n);
		}
	}
}
function Sr(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			Sr(e[n], t);
		} catch {}
		let n = l(e);
		if (n !== Object.prototype && n !== Array.prototype && n !== Map.prototype && n !== Set.prototype && n !== Date.prototype) {
			let t = o(n);
			for (let n in t) {
				let r = t[n].get;
				if (r) try {
					r.call(e);
				} catch {}
			}
		}
	}
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/attachments/index.js
function Cr() {
	return Symbol(Ce);
}
function wr(e) {
	return e.endsWith("capture") && e !== "gotpointercapture" && e !== "lostpointercapture";
}
var Tr = [
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
function Er(e) {
	return Tr.includes(e);
}
var Dr = /* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split("."), Or = {
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
function kr(e) {
	return e = e.toLowerCase(), Or[e] ?? e;
}
[...Dr];
var Ar = ["touchstart", "touchmove"];
function jr(e) {
	return Ar.includes(e);
}
var Mr = [
	"textarea",
	"script",
	"style",
	"title"
];
function Nr(e) {
	return Mr.includes(e);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dev/css.js
var Pr = Symbol("events"), Fr = /* @__PURE__ */ new Set(), Ir = /* @__PURE__ */ new Set();
function Lr(e) {
	if (!T) return;
	e.removeAttribute("onload"), e.removeAttribute("onerror");
	let t = e.__e;
	t !== void 0 && (e.__e = void 0, queueMicrotask(() => {
		e.isConnected && e.dispatchEvent(t);
	}));
}
function Rr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Gr.call(t, e), !e.cancelBubble) return yt(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? (i.__removed = !1, j(() => {
		i.__removed || t.addEventListener(e, i, r);
	})) : t.addEventListener(e, i, r), i;
}
function zr(e, t, n, r = {}) {
	var i = Rr(t, e, n, r);
	return () => {
		i.__removed = !0, e.removeEventListener(t, i, r);
	};
}
function Br(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = Rr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && jn(() => {
		o.__removed = !0, t.removeEventListener(e, o, a);
	});
}
function Vr(e, t, n) {
	(t[Pr] ??= {})[e] = n;
}
function Hr(e) {
	for (var t = 0; t < e.length; t++) Fr.add(e[t]);
	for (var n of Ir) n(e);
}
var Ur = null, Wr = !1;
function Gr(e) {
	var t = this, n = t.ownerDocument, r = e.type, a = e.composedPath?.() || [], o = a[0] || e.target;
	Ur = e, Wr || (Wr = !0, setTimeout(() => {
		Wr = !1, Ur = null;
	}));
	var s = 0, c = Ur === e && e[Pr];
	if (c) {
		var l = a.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[Pr] = t;
			return;
		}
		var u = a.indexOf(t);
		if (u === -1) return;
		l <= u && (s = l);
	}
	if (o = a[s] || e.target, o !== t) {
		i(e, "currentTarget", {
			configurable: !0,
			get() {
				return o || n;
			}
		});
		var d = W, f = q;
		K(null), nr(null);
		try {
			for (var p, m = []; o !== null && o !== t;) {
				try {
					var h = o[Pr]?.[r];
					h == null || o.disabled && e.target !== o || h.call(o, e);
				} catch (e) {
					p ? m.push(e) : p = e;
				}
				if (e.cancelBubble) break;
				s++, o = s < a.length ? a[s] : null;
			}
			if (p) {
				for (let e of m) queueMicrotask(() => {
					throw e;
				});
				throw p;
			}
		} finally {
			e[Pr] = t, delete e.currentTarget, K(d), nr(f);
		}
	}
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/reconciler.js
var Kr = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function qr(e) {
	return Kr?.createHTML(e) ?? e;
}
function Jr(e) {
	var t = Tn("template");
	return t.innerHTML = qr(e.replaceAll("<!>", "<!---->")), t.content;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/template.js
function $(e, t) {
	var n = q;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function Yr(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		if (T) return $(D, null), D;
		i === void 0 && (i = Jr(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ R(i)));
		var t = r || hn ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ R(t), s = t.lastChild;
			$(o, s);
		} else $(t, t);
		return t;
	};
}
function Xr(e = "") {
	if (!T) {
		var t = L(e + "");
		return $(t, t), t;
	}
	var n = D;
	return n.nodeType === 3 ? En(n) : (n.before(n = L()), O(n)), $(n, n), n;
}
function Zr() {
	if (T) return $(D, null), D;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = L();
	return e.append(t, n), $(t, n), e;
}
function Qr(e, t) {
	if (T) {
		var n = q;
		n.f & 32768 && n.nodes.end !== null || (n.nodes.end = D), k();
	} else e !== null && e.before(t);
}
function $r() {
	if (T && D && D.nodeType === 8 && D.textContent?.startsWith("$")) {
		let e = D.textContent.substring(1);
		return k(), e;
	}
	return (window.__svelte ??= {}).uid ??= 1, `c${window.__svelte.uid++}`;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/reactivity/create-subscriber.js
function ei(e) {
	let t = 0, n = en(0), r;
	return () => {
		An() && (Z(n), zn(() => (t === 0 && (r = Q(() => e(() => ln(n)))), t += 1, () => {
			j(() => {
				--t, t === 0 && (r?.(), r = void 0, ln(n));
			});
		})));
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var ti = C | te;
function ni(e, t, n, r) {
	new ri(e, t, n, r);
}
var ri = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = T ? D : null;
	#n;
	#r;
	#i;
	#a = null;
	#o = null;
	#s = null;
	#c = null;
	#l = 0;
	#u = 0;
	#d = !1;
	#f = /* @__PURE__ */ new Set();
	#p = /* @__PURE__ */ new Set();
	#m = null;
	#h = ei(() => (this.#m = en(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = q;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = q.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = Vn(() => {
			if (T) {
				let e = je(this.#t);
				k();
				let t = e === "[!";
				if (e.startsWith("[?")) {
					let t = JSON.parse(e.slice(2));
					this.#_(t);
				} else t ? this.#b() : this.#g();
			} else this.#x();
		}, ti), T && (this.#e = D);
	}
	#g() {
		try {
			this.#a = H(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		j(r), t && (this.#s = H(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			this.#y() || (t ? De() : (t = !0, n && Ke(), this.#s !== null && Jn(this.#s, () => {
				this.#s = null;
			}), this.#C(() => {
				this.#x();
			})));
		};
		return {
			reset: r,
			invoke_onerror: () => {
				if (!this.#y()) try {
					n = !0, this.#n.onerror?.(e, r), n = !1;
				} catch (e) {
					B(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		return (this.#i.f & (x | ee)) !== 0;
	}
	#b() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = H(() => e(this.#e)), j(() => {
			if (!this.#y()) {
				var e = this.#c = document.createDocumentFragment(), t = L(), n = !1;
				e.append(t), this.#a = this.#C(() => {
					try {
						return H(() => this.#r(t));
					} catch (e) {
						try {
							this.error(e), n = !0;
						} catch (e) {
							B(e, this.#i.parent);
						}
						return null;
					}
				}), this.#a === null ? (this.#c = null, n && this.#S(N)) : this.#u === 0 && (this.#e.before(e), this.#c = null, Jn(this.#o, () => {
					this.#o = null;
				}), this.#S(N));
			}
		}));
	}
	#x() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = H(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Qn(this.#a, e);
				let t = this.#n.pending;
				this.#o = H(() => t(this.#e));
			} else this.#S(N);
		} catch (e) {
			this.error(e);
		}
	}
	#S(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		ht(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#C(e) {
		var t = q, n = W, r = A;
		nr(this.#i), K(this.#i), tt(this.#i.ctx);
		try {
			return Wt.ensure(), e();
		} finally {
			nr(t), K(n), tt(r);
		}
	}
	#w(e, t) {
		this.has_pending_snippet() ? (this.#u += e, this.#u === 0 && (this.#S(t), this.#o && Jn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null))) : this.parent && this.parent.#w(e, t);
	}
	update_pending_count(e, t) {
		this.#w(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, j(() => {
			this.#d = !1, this.#m && on(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), Z(this.#m);
	}
	error(e) {
		if (e === ye || !this.#n.onerror && !this.#n.failed) throw e;
		N?.is_fork ? (this.#a && N.skip_effect(this.#a), this.#o && N.skip_effect(this.#o), this.#s && N.skip_effect(this.#s), N.oncommit(() => {
			this.#y() || this.#T(e);
		})) : this.#T(e);
	}
	#T(e) {
		this.#a &&= (U(this.#a), null), this.#o &&= (U(this.#o), null), this.#s &&= (U(this.#s), null), T && (O(this.#t), ke(), O(Ae()));
		let t = this.#n.failed, n = (e) => {
			if (this.#y()) return;
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && !this.#y() && (this.#s = this.#C(() => {
				try {
					return H(() => {
						var r = q;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return B(e, this.#i.parent), null;
				}
			}));
		};
		j(() => {
			if (!this.#y()) {
				var t;
				try {
					t = this.transform_error(e);
				} catch (e) {
					B(e, this.#i && this.#i.parent);
					return;
				}
				typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => B(e, this.#i && this.#i.parent)) : n(t);
			}
		});
	}
}, ii = !0;
function ai(e) {
	ii = e;
}
function oi(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[he] ??= e.nodeValue) && (e[he] = n, e.nodeValue = `${n}`);
}
function si(e, t) {
	return li(e, t);
}
var ci = /* @__PURE__ */ new Map();
function li(e, { target: t, anchor: n, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	vn();
	var l = void 0, u = In(() => {
		var u = n ?? t.appendChild(L());
		ni(u, { pending: () => {} }, (t) => {
			ot({});
			var n = A;
			if (o && (n.c = o), a && (i.$$events = a), T && $(t, null), ii = s, l = e(t, i) || ct(), ii = !0, T && (q.nodes.end = D, D === null || D.nodeType !== 8 || D.data !== "]")) throw Te(), ye;
			st();
		}, c);
		var d = /* @__PURE__ */ new Set(), f = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!d.has(r)) {
					d.add(r);
					var i = jr(r);
					for (let e of [t, document]) {
						var a = ci.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), ci.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Gr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(r(Fr)), Ir.add(f), () => {
			for (var e of d) for (let n of [t, document]) {
				var r = ci.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, Gr), r.delete(e), r.size === 0 && ci.delete(n)) : r.set(e, i);
			}
			Ir.delete(f), u !== n && u.parentNode?.removeChild(u);
		};
	});
	return ui.set(l, u), l;
}
var ui = /* @__PURE__ */ new WeakMap();
function di(e, t) {
	let n = ui.get(e);
	return n ? (ui.delete(e), n(t)) : Promise.resolve();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/blocks/branches.js
var fi = class {
	anchor;
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ new Map();
	#n = /* @__PURE__ */ new Map();
	#r = /* @__PURE__ */ new Set();
	#i = !0;
	constructor(e, t = !0) {
		this.anchor = e, this.#i = t;
	}
	#a = (e) => {
		if (this.#e.has(e)) {
			var t = this.#e.get(e), n = this.#t.get(t);
			if (n) Xn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Xn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (U(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						Qn(r, t), t.append(L()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else U(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Jn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (U(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = N, r = wn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = L();
				i.append(a), this.#n.set(e, {
					effect: H(() => t(a)),
					fragment: i
				});
			} else this.#t.set(e, H(() => t(this.anchor)));
		}
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else T && (this.anchor = D), this.#a(n);
	}
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/blocks/if.js
function pi(e, t, n = !1) {
	var r;
	T && (r = D, k());
	var i = new fi(e), a = n ? C : 0;
	function o(e, t) {
		if (T) {
			var n = je(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Ae();
				O(a), i.anchor = a, E(!1), i.ensure(e, t), E(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	Vn(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/blocks/key.js
var mi = Symbol("NaN");
function hi(e, t, n) {
	T && k();
	var r = new fi(e), i = !lt();
	Vn(() => {
		var e = t();
		e !== e && (e = mi), i && typeof e == "object" && e && (e = {}), r.ensure(e, n);
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/blocks/each.js
function gi(e, t) {
	return t;
}
function _i(e, t, n) {
	for (var i = [], a = t.length, o, s = t.length, c = 0; c < a; c++) {
		let n = t[c];
		Jn(n, () => {
			if (o) {
				if (o.pending.delete(n), o.done.add(n), o.pending.size === 0) {
					var t = e.outrogroups;
					vi(e, r(o.done)), t.delete(o), t.size === 0 && (e.outrogroups = null);
				}
			} else --s;
		}, !1);
	}
	if (s === 0) {
		var l = i.length === 0 && n !== null && e.pending.size === 0;
		if (l) {
			var u = n, d = u.parentNode;
			Cn(d), d.append(u), e.items.clear();
		}
		vi(e, t, !l);
	} else o = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(o);
}
function vi(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= re, Qn(a, document.createDocumentFragment())) : U(t[i], n);
	}
}
var yi;
function bi(t, n, i, a, o, s = null) {
	var c = t, l = /* @__PURE__ */ new Map();
	if (n & 4) {
		var u = t;
		c = T ? O(/* @__PURE__ */ R(u)) : u.appendChild(L());
	}
	T && k();
	var d = null, f = /* @__PURE__ */ kt(() => {
		var t = i();
		return e(t) ? t : t == null ? [] : r(t);
	}), p = /* @__PURE__ */ new Map(), m = !0;
	function h(e) {
		if (!(_.effect.f & 16384)) {
			_.pending.delete(e);
			var t = Z(f);
			_.fallback = d, Si(_, t, c, n, a), d !== null && (t.length === 0 ? d.f & 33554432 ? (d.f ^= re, wi(d, null, c)) : Xn(d) : Jn(d, () => {
				d = null;
			}));
		}
	}
	function g(e) {
		_.pending.delete(e);
	}
	var _ = {
		effect: Vn(() => {
			var e = Z(f), t = e.length;
			let r = !1;
			T && je(c) === "[!" != (t === 0) && (c = Ae(), O(c), E(!1), r = !0);
			for (var u = /* @__PURE__ */ new Set(), _ = N, v = wn(), y = 0; y < t; y += 1) {
				T && D.nodeType === 8 && D.data === "]" && (c = D, r = !0, E(!1));
				var b = e[y], x = a(b, y), S = m ? null : l.get(x);
				S ? (S.v && on(S.v, b), S.i && on(S.i, y), v && _.unskip_effect(S.e)) : (S = Ci(l, m ? c : yi ??= L(), b, x, y, o, n, i), m || (S.e.f |= re), l.set(x, S)), u.add(x);
			}
			if (t === 0 && s && !d && (m ? d = H(() => s(c)) : (d = H(() => s(yi ??= L())), d.f |= re)), t > u.size && Le("", "", ""), T && t > 0 && O(Ae()), !m) {
				if (p.set(_, u), v) {
					for (let [e, t] of l) u.has(e) || _.skip_effect(t.e);
					_.oncommit(h), _.ondiscard(g);
				} else h(_);
			}
			r && E(!0), Z(f);
		}),
		flags: n,
		items: l,
		pending: p,
		outrogroups: null,
		fallback: d
	};
	m = !1, T && (c = D);
}
function xi(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Si(e, t, n, i, a) {
	var o = !!(i & 8), s = t.length, c = e.items, l = xi(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (o) for (v = 0; v < s; v += 1) h = t[v], g = a(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < s; v += 1) {
		if (h = t[v], g = a(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Xn(_), o && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= re, _ === l) wi(_, null, n);
			else {
				var y = d ? d.next : l;
				_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), Ti(e, d, _), Ti(e, _, y), wi(_, y, n), d = _, p = [], m = [], l = xi(d.next);
				continue;
			}
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], ee = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) wi(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					Ti(e, S.prev, ee.next), Ti(e, d, S), Ti(e, ee, b), l = b, d = ee, --v, p = [], m = [];
				} else u.delete(_), wi(_, l, n), Ti(e, _.prev, _.next), Ti(e, _, d === null ? e.effect.first : d.next), Ti(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = xi(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = xi(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (vi(e, r(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var C = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || C.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && C.push(l), l = xi(l.next);
		var te = C.length;
		if (te > 0) {
			var ne = i & 4 && s === 0 ? n : null;
			if (o) {
				for (v = 0; v < te; v += 1) C[v].nodes?.a?.measure();
				for (v = 0; v < te; v += 1) C[v].nodes?.a?.fix();
			}
			_i(e, C, ne);
		}
	}
	o && j(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Ci(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? en(n) : /* @__PURE__ */ nn(n, !1, !1) : null, l = o & 2 ? en(i) : null;
	return {
		v: c,
		i: l,
		e: H(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function wi(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ z(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Ti(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
function Ei(e, t, n = !1, r = !1, i = !1, a = !1) {
	var o = e, s = "";
	if (n) {
		var c = e;
		T && (o = O(/* @__PURE__ */ R(c)));
	}
	Bn(() => {
		var e = q;
		if (s === (s = t() ?? "")) T && k();
		else if (n && !T) e.nodes = null, c.innerHTML = s, s !== "" && $(/* @__PURE__ */ R(c), c.lastChild);
		else if (e.nodes !== null && (Kn(e.nodes.start, e.nodes.end), e.nodes = null), s !== "") {
			if (T) {
				for (var a = D.data, l = k(), u = l; l !== null && (l.nodeType !== 8 || l.data !== "");) u = l, l = /* @__PURE__ */ z(l);
				if (l === null) throw Te(), ye;
				$(D, u), o = O(l);
			} else {
				var d = Tn(r ? "svg" : i ? "math" : "template", r ? xe : i ? Se : void 0);
				d.innerHTML = s;
				var f = r || i ? d : d.content;
				if ($(/* @__PURE__ */ R(f), f.lastChild), r || i) for (; /* @__PURE__ */ R(f);) o.before(/* @__PURE__ */ R(f));
				else o.before(f);
			}
		}
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/blocks/snippet.js
function Di(e, t, ...n) {
	var r = new fi(e);
	Vn(() => {
		let e = t() ?? null;
		r.ensure(e, e && ((t) => e(t, ...n)));
	}, C);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/blocks/svelte-component.js
function Oi(e, t, n) {
	var r;
	T && (r = D, k());
	var i = new fi(e);
	Vn(() => {
		var e = t() ?? null;
		if (T && je(r) === "[" != (e !== null)) {
			var a = Ae();
			O(a), i.anchor = a, E(!1), i.ensure(e, e && ((t) => n(t, e))), E(!0);
		} else i.ensure(e, e && ((t) => n(t, e)));
	}, C);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/timing.js
var ki = () => performance.now(), Ai = {
	tick: (e) => requestAnimationFrame(e),
	now: () => ki(),
	tasks: /* @__PURE__ */ new Set()
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/loop.js
function ji() {
	let e = Ai.now();
	Ai.tasks.forEach((t) => {
		t.c(e) || (Ai.tasks.delete(t), t.f());
	}), Ai.tasks.size !== 0 && Ai.tick(ji);
}
function Mi(e) {
	let t;
	return Ai.tasks.size === 0 && Ai.tick(ji), {
		promise: new Promise((n) => {
			Ai.tasks.add(t = {
				c: e,
				f: n
			});
		}),
		abort() {
			Ai.tasks.delete(t);
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/elements/transitions.js
function Ni(e, t) {
	yt(() => {
		e.dispatchEvent(new CustomEvent(t));
	});
}
function Pi(e) {
	if (e === "float") return "cssFloat";
	if (e === "offset") return "cssOffset";
	if (e.startsWith("--")) return e;
	let t = e.split("-");
	return t.length === 1 ? t[0] : t[0] + t.slice(1).map((e) => e[0].toUpperCase() + e.slice(1)).join("");
}
function Fi(e) {
	let t = {}, n = e.split(";");
	for (let e of n) {
		let [n, r] = e.split(":");
		if (!n || r === void 0) break;
		let i = Pi(n.trim());
		t[i] = r.trim();
	}
	return t;
}
var Ii = (e) => e;
function Li(e, t, n, r) {
	var i = !!(e & 1), a = !!(e & 2), o = i && a, s = !!(e & 4), c = o ? "both" : i ? "in" : "out", l, u = t.inert, d = t.style.overflow, f, p;
	function m() {
		return yt(() => l ??= n()(t, r?.() ?? {}, { direction: c }));
	}
	var h = {
		is_global: s,
		in() {
			t.inert = u, i ? (a || f?.abort(), f = Ri(t, m(), p, 1, () => {
				Ni(t, "introstart");
			}, () => {
				Ni(t, "introend"), f?.abort(), f = l = void 0, t.style.overflow = d;
			})) : (p?.abort(), p?.reset?.());
		},
		out(e) {
			a ? (t.inert = !0, p = Ri(t, m(), f, 0, () => {
				Ni(t, "outrostart");
			}, () => {
				Ni(t, "outroend"), e?.();
			})) : (e?.(), l = void 0);
		},
		stop: () => {
			f?.abort(), p?.abort();
		}
	}, g = q;
	if ((g.nodes.t ??= []).push(h), i && ii) {
		var _ = s;
		if (!_) {
			for (var v = g.parent; v && v.f & 65536;) for (; (v = v.parent) && !(v.f & 16););
			_ = !v || !!(v.f & 32768);
		}
		_ && Ln(() => {
			Q(() => h.in());
		});
	}
}
function Ri(e, t, n, r, i, a) {
	var o = r === 1, s = !1;
	if (d(t)) {
		var c;
		return j(() => {
			s || (c = Ri(e, t({ direction: o ? "in" : "out" }), n, r, i, a));
		}), {
			abort: () => {
				s = !0, c?.abort();
			},
			deactivate: () => c?.deactivate(),
			reset: () => c?.reset(),
			t: () => c?.t() ?? 1 - r
		};
	}
	if (n?.deactivate(), !t?.duration && !t?.delay) return i(), a(), {
		abort: f,
		deactivate: f,
		reset: f,
		t: () => r
	};
	let { delay: l = 0, css: u, tick: p, easing: m = Ii } = t;
	var h, g = () => 1 - r;
	return j(() => {
		if (!s) {
			var c = [];
			if (o && n === void 0 && (p && p(0, 1), u)) {
				var d = Fi(u(0, 1));
				c.push(d, d);
			}
			h = e.animate(c, {
				duration: l,
				fill: "forwards"
			}), h.onfinish = () => {
				h.cancel(), i();
				var o = n?.t() ?? 1 - r;
				n?.abort();
				var s = r - o, c = t.duration * Math.abs(s), l = [];
				if (c > 0) {
					var d = !1;
					if (u) for (var f = Math.ceil(c / (1e3 / 60)), _ = 0; _ <= f; _ += 1) {
						var v = o + s * m(_ / f), y = Fi(u(v, 1 - v));
						l.push(y), d ||= y.overflow === "hidden";
					}
					d && (e.style.overflow = "hidden"), g = () => {
						var e = h.currentTime;
						return o + s * m(e / c);
					}, p && Mi(() => {
						if (h.playState !== "running") return !1;
						var e = g();
						return p(e, 1 - e), !0;
					});
				}
				h = e.animate(l, {
					duration: c,
					fill: "forwards"
				}), h.onfinish = () => {
					g = () => r, p?.(r, 1 - r), a();
				};
			};
		}
	}), {
		abort: () => {
			s = !0, h && (h.cancel(), h.effect = null, h.onfinish = f);
		},
		deactivate: () => {
			a = f;
		},
		reset: () => {
			r === 0 && p?.(1, 0);
		},
		t: () => g()
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/blocks/svelte-element.js
function zi(e, t, n, r, i, a) {
	let o = T;
	T && k();
	var s = null;
	T && D.nodeType === 1 && (s = D, k());
	var c = T ? D : e, l = new fi(c, !1);
	Vn(() => {
		let e = t() || null;
		var a = i ? i() : n || e === "svg" ? xe : void 0;
		if (e === null) l.ensure(null, null), ai(!0);
		else return l.ensure(e, (t) => {
			if (e) {
				var n = T;
				if (s = T ? s : Tn(e, a), $(s, s), r) {
					var i = null;
					T && Nr(e) && s.append(i = document.createComment(""));
					var o = T ? /* @__PURE__ */ R(s) : s.appendChild(L());
					T && (o === null ? E(!1) : O(o)), r(s, o), i?.remove();
				}
				q.nodes.end = s, n || t.before(s);
			}
			T && O(t);
		}), ai(!0), () => {
			e && ai(!1);
		};
	}, C), jn(() => {
		ai(!0);
	}), o && (E(!0), O(c));
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/css.js
function Bi(e, t) {
	Ln(() => {
		e = q?.parent?.nodes?.start ?? e;
		var n = e.getRootNode(), r = n.host ? n : n.head ?? n.ownerDocument.head;
		if (!r.querySelector("#" + t.hash)) {
			let e = Tn("style");
			e.id = t.hash, e.textContent = t.code, r.appendChild(e);
		}
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/elements/actions.js
function Vi(e, t, n) {
	Ln(() => {
		var r = Q(() => t(e, n?.()) || {});
		if (n && r?.update) {
			var i = !1, a = {};
			zn(() => {
				var e = n();
				xr(e), i && Ne(a, e) && (a = e, r.update(e));
			}), i = !0;
		}
		if (r?.destroy) return () => r.destroy();
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/elements/attachments.js
function Hi(e, t) {
	var n = void 0, r;
	Hn(() => {
		n !== (n = t()) && (r &&= (U(r), null), n && (r = H(() => {
			Ln(() => n(e));
		})));
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/clsx/dist/clsx.mjs
function Ui(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") {
		if (Array.isArray(e)) {
			var i = e.length;
			for (t = 0; t < i; t++) e[t] && (n = Ui(e[t])) && (r && (r += " "), r += n);
		} else for (n in e) e[n] && (r && (r += " "), r += n);
	}
	return r;
}
function Wi() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = Ui(e)) && (r && (r += " "), r += t);
	return r;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/shared/attributes.js
function Gi(e) {
	return typeof e == "object" ? Wi(e) : e ?? "";
}
var Ki = [..." 	\n\r\f\xA0\v﻿"];
function qi(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || Ki.includes(r[o - 1])) && (s === r.length || Ki.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function Ji(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function Yi(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function Xi(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\/\*.*?\*\//g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(Yi)), i && c.push(...Object.keys(i).map(Yi));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = Yi(e.substring(l, u).trim());
							if (!c.includes(p)) {
								f !== ";" && d++;
								var m = e.substring(l, d).trim();
								n += " " + m + ";";
							}
						}
						l = d + 1, u = -1;
					}
				}
			}
		}
		return r && (n += Ji(r)), i && (n += Ji(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/elements/class.js
function Zi(e, t, n, r, i, a) {
	var o = e[pe];
	if (T || o !== n || o === void 0) {
		var s = qi(n, r, a);
		T && s === e.getAttribute("class") || (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[pe] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/elements/style.js
function Qi(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function $i(e, t, n, r) {
	var i = e[me];
	if (T || i !== t) {
		var a = Xi(t, r);
		T && a === e.getAttribute("style") || (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[me] = t;
	} else r && (Array.isArray(r) ? (Qi(e, n?.[0], r[0]), Qi(e, n?.[1], r[1], "important")) : Qi(e, n, r));
	return r;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function ea(e, t) {
	t ? e.hasAttribute("selected") || e.setAttribute("selected", "") : e.removeAttribute("selected");
}
function ta(e, t) {
	var n = !("__defaultValue" in e);
	(n || e.__defaultValue !== t) && (e.__defaultValue = t, na(e, !n || "__value" in e));
}
function na(t, n) {
	var r = t.__defaultValue, i = t.multiple, a = i ? r ?? [] : null;
	if (!i || e(a)) {
		var o = t.selectedIndex, s = n && i ? new Set(t.selectedOptions) : null;
		for (var c of t.options) {
			var l = oa(c);
			ea(c, i ? a.includes(l) : pn(l, r));
		}
		if (n) {
			if (s !== null) for (c of t.options) {
				var u = s.has(c);
				c.selected !== u && (c.selected = u);
			}
			else t.selectedIndex !== o && (t.selectedIndex = o);
		}
	}
}
function ra(t, n, r = !1) {
	if (t.multiple) {
		if (n == null) return;
		if (!e(n)) return Ee();
		for (var i of t.options) i.selected = n.includes(oa(i));
	} else {
		for (i of t.options) if (pn(oa(i), n)) {
			i.selected = !0;
			return;
		}
		r && n === void 0 || (t.selectedIndex = -1);
	}
}
function ia(e) {
	var t = new MutationObserver((t) => {
		t.every(sa) || ("__defaultValue" in e && na(e, !1), "__value" in e && ra(e, e.__value));
	});
	t.observe(e, {
		childList: !0,
		subtree: !0,
		attributes: !0,
		attributeFilter: ["value"]
	}), jn(() => {
		t.disconnect();
	});
}
function aa(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	bt(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), oa);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && oa(o);
		}
		n(a), e.__value = a, N !== null && r.add(N);
	}), Ln(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = N;
			if (r.has(o)) return;
		}
		if (ra(e, a, i), i && a === void 0) {
			var s = e.querySelector(":checked");
			s !== null && (a = oa(s), n(a));
		}
		e.__value = a, i = !1;
	});
}
function oa(e) {
	return "__value" in e ? e.__value : e.value;
}
function sa(e) {
	if (e.target.closest("selectedcontent") !== null) return !0;
	if (e.type === "childList") {
		var t = [...e.addedNodes, ...e.removedNodes];
		return t.length > 0 && t.every((e) => e.nodeName === "SELECTEDCONTENT");
	}
	return !1;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/elements/attributes.js
var ca = Symbol("class"), la = Symbol("style"), ua = Symbol("is custom element"), da = Symbol("is html"), fa = ve ? "link" : "LINK", pa = ve ? "input" : "INPUT", ma = ve ? "option" : "OPTION", ha = ve ? "select" : "SELECT", ga = ve ? "progress" : "PROGRESS";
function _a(e) {
	if (T) {
		var t = !1, n = () => {
			if (!t) {
				if (t = !0, e.hasAttribute("value")) {
					var n = e.value;
					ya(e, "value", null), e.value = n;
				}
				if (e.hasAttribute("checked")) {
					var r = e.checked;
					ya(e, "checked", null), e.checked = r;
				}
			}
		};
		e[ge] = n, j(n), vt();
	}
}
function va(e, t) {
	var n = Sa(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === ga) && (e.value = t ?? "");
}
function ya(e, t, n, r) {
	var i = Sa(e);
	T && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === fa) || i[t] !== (i[t] = n) && (t === "loading" && (e[ue] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && wa(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function ba(e, t, n, r, i = !1, a = !1) {
	T && i && e.nodeName === pa && ("defaultValue" in n || "defaultChecked" in n || _a(e));
	var o = Sa(e), s = o[ua], c = !o[da];
	let l = T && s;
	l && E(!1);
	var u = t || {}, d = e.nodeName === ma, f = e.nodeName === ha;
	try {
		for (var p in t) !(p in n) && p[0] + p[1] !== "$$" && (n[p] = null);
		n.class ? n.class = Gi(n.class) : (r || n[ca]) && (n.class = null), n[la] && (n.style ??= null);
		var m = wa(e);
		if (e.nodeName === pa && "type" in n && ("value" in n || "__value" in n)) {
			var h = n.type;
			(h !== u.type || h === void 0 && e.hasAttribute("type")) && (u.type = h, ya(e, "type", h, a));
		}
		for (let i in n) {
			let l = n[i];
			if (d && i === "value" && l == null) e.value = e.__value = "", u[i] = l;
			else if (i === "class") Zi(e, e.namespaceURI === "http://www.w3.org/1999/xhtml", l, r, t?.[ca], n[ca]), u[i] = l, u[ca] = n[ca];
			else if (i === "style") $i(e, l, t?.[la], n[la]), u[i] = l, u[la] = n[la];
			else {
				var g = u[i];
				if (l !== g || l === void 0 && e.hasAttribute(i)) {
					u[i] = l;
					var _ = i[0] + i[1];
					if (_ !== "$$") {
						if (_ === "on") {
							let t = {}, n = "$$" + i, r = i.slice(2);
							var v = Er(r);
							if (wr(r) && (r = r.slice(0, -7), t.capture = !0), !v && g) {
								if (l != null) continue;
								e.removeEventListener(r, u[n], t), u[n] = null;
							}
							if (v) Vr(r, e, l), Hr([r]);
							else if (l != null) {
								function a(e) {
									u[i].call(this, e);
								}
								u[n] = Rr(r, e, a, t);
							}
						} else if (i === "style") ya(e, i, l);
						else if (i === "autofocus") gt(e, !!l);
						else if (!s && (i === "__value" || i === "value" && l != null)) e.__value = l, (g == null || e.value !== l || l === 0 && e.nodeName === ga) && (e.value = l);
						else if (i === "selected" && d) ea(e, l);
						else {
							var y = i;
							c || (y = kr(y));
							var b = y === "defaultValue" || y === "defaultChecked";
							if (f && y === "defaultValue") continue;
							if (l == null && !s && !b) {
								if (o[i] = null, y === "value" || y === "checked") {
									let n = e, r = t === void 0;
									if (y === "value") {
										let e = n.defaultValue;
										n.removeAttribute(y), n.defaultValue = e, n.value = n.__value = r ? e : null;
									} else {
										let e = n.defaultChecked;
										n.removeAttribute(y), n.defaultChecked = e, n.checked = r ? e : !1;
									}
								} else e.removeAttribute(i);
							} else b || (s || typeof l != "string") && m.has(y) ? (e[y] = l, y in o && (o[y] = w)) : typeof l != "function" && ya(e, y, l, a);
						}
					}
				}
			}
		}
	} finally {
		l && E(!0);
	}
	return u;
}
function xa(e, t, n = [], r = [], i = [], a, o = !1, s = !1) {
	xt(i, n, r, (n) => {
		var r = void 0, i = {}, c = e.nodeName === ha, l = !1;
		if (Hn(() => {
			var u = t(...n.map(Z)), d = ba(e, r, u, a, o, s);
			if (l && c) {
				var f = e;
				"defaultValue" in u && ta(f, u.defaultValue), "value" in u && ra(f, u.value);
			}
			for (let e of Object.getOwnPropertySymbols(i)) u[e] || U(i[e]);
			for (let t of Object.getOwnPropertySymbols(u)) {
				var p = u[t];
				t.description !== "@attach" || r && p === r[t] || (i[t] && U(i[t]), i[t] = H(() => Hi(e, () => p))), d[t] = p;
			}
			r = d;
		}), c) {
			var u = e;
			Ln(() => {
				var e = r;
				"defaultValue" in e && ta(u, e.defaultValue), ra(u, e.value, !0), ia(u);
			});
		}
		l = !0;
	});
}
function Sa(e) {
	return e[fe] ??= {
		[ua]: e.nodeName.includes("-"),
		[da]: e.namespaceURI === be
	};
}
var Ca = /* @__PURE__ */ new Map();
function wa(e) {
	var t = e.getAttribute("is") || e.nodeName, n = Ca.get(t);
	if (n) return n;
	Ca.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var s in r = o(i), r) r[s].set && s !== "innerHTML" && s !== "textContent" && s !== "innerText" && n.add(s);
		i = l(i);
	}
	return n;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function Ta(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	bt(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = Da(e) ? Oa(a) : a, n(a), N !== null && r.add(N), await vr(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (T && e.defaultValue !== e.value || Q(t) == null && e.value) && (n(Da(e) ? Oa(e.value) : e.value), N !== null && r.add(N)), zn(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = N;
			if (r.has(i)) return;
		}
		Da(e) && n === Oa(e.value) || (e.type !== "date" || n || e.value) && n !== e.value && (e.value = n ?? "");
	});
}
function Ea(e, t, n = t) {
	bt(e, "change", (t) => {
		n(t ? e.defaultChecked : e.checked);
	}), (T && e.defaultChecked !== e.checked || Q(t) == null) && n(e.checked), zn(() => {
		e.checked = !!t();
	});
}
function Da(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function Oa(e) {
	return e === "" ? null : +e;
}
var ka = /* @__PURE__ */ new class e {
	#e = /* @__PURE__ */ new WeakMap();
	#t;
	#n;
	static entries = /* @__PURE__ */ new WeakMap();
	constructor(e) {
		this.#n = e;
	}
	observe(e, t) {
		var n = this.#e.get(e) || /* @__PURE__ */ new Set();
		return n.add(t), this.#e.set(e, n), this.#r().observe(e, this.#n), () => {
			var n = this.#e.get(e);
			n.delete(t), n.size === 0 && (this.#e.delete(e), this.#t.unobserve(e));
		};
	}
	#r() {
		return this.#t ??= new ResizeObserver((t) => {
			for (var n of t) {
				e.entries.set(n.target, n);
				for (var r of this.#e.get(n.target) || []) r(n);
			}
		});
	}
}({ box: "border-box" });
function Aa(e, t, n) {
	var r = ka.observe(e, () => n(e[t]));
	Ln(() => (Q(() => n(e[t])), r));
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function ja(e, t) {
	return e === t || e?.[se] === t;
}
function Ma(e = ct(), t, n, r) {
	var i = A.r, a = q;
	return Ln(() => {
		var o, s;
		return zn(() => {
			o = s, s = r?.() || [], Q(() => {
				ja(n(...s), e) || (t(e, ...s), o && ja(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && ja(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/store/utils.js
function Na(e, t, n) {
	if (e == null) return t(void 0), n && n(void 0), f;
	let r = Q(() => e.subscribe(t, n));
	return r.unsubscribe ? () => r.unsubscribe() : r;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/store/shared/index.js
var Pa = [];
function Fa(e, t) {
	return { subscribe: Ia(e, t).subscribe };
}
function Ia(e, t = f) {
	let n = null, r = /* @__PURE__ */ new Set();
	function i(t) {
		if (Ne(e, t) && (e = t, n)) {
			let t = !Pa.length;
			for (let t of r) t[1](), Pa.push(t, e);
			if (t) {
				for (let e = 0; e < Pa.length; e += 2) Pa[e][0](Pa[e + 1]);
				Pa.length = 0;
			}
		}
	}
	function a(t) {
		i(t(e));
	}
	function o(o, s = f) {
		let c = [o, s];
		return r.add(c), r.size === 1 && (n = t(i, a) || f), o(e), () => {
			r.delete(c), r.size === 0 && n && (n(), n = null);
		};
	}
	return {
		set: i,
		update: a,
		subscribe: o
	};
}
function La(e, t, n) {
	let r = !Array.isArray(e), i = r ? [e] : e;
	if (!i.every(Boolean)) throw Error("derived() expects stores as input, got a falsy value");
	let a = t.length < 2;
	return Fa(n, (e, n) => {
		let o = !1, s = [], c = 0, l = f, u = () => {
			if (c) return;
			l();
			let i = t(r ? s[0] : s, e, n);
			a ? e(i) : l = typeof i == "function" ? i : f;
		}, d = i.map((e, t) => Na(e, (e) => {
			s[t] = e, c &= ~(1 << t), o && u();
		}, () => {
			c |= 1 << t;
		}));
		return o = !0, u(), function() {
			p(d), l(), o = !1;
		};
	});
}
function Ra(e) {
	let t;
	return Na(e, (e) => t = e)(), t;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/reactivity/store.js
var za = !1, Ba = Symbol("unmounted");
function Va(e, t, n) {
	let r = n[t] ??= {
		store: null,
		source: /* @__PURE__ */ nn(void 0),
		unsubscribe: f
	};
	if (r.store !== e && !(Ba in n)) {
		if (r.unsubscribe(), r.store = e ?? null, e == null) r.source.v = void 0, r.unsubscribe = f;
		else {
			var i = !0;
			r.unsubscribe = Na(e, (e) => {
				i ? r.source.v = e : I(r.source, e);
			}), i = !1;
		}
	}
	return e && Ba in n ? Ra(e) : Z(r.source);
}
function Ha() {
	let e = {};
	function t() {
		jn(() => {
			for (var t in e) e[t].unsubscribe();
			i(e, Ba, {
				enumerable: !1,
				value: !0
			});
		});
	}
	return [e, t];
}
function Ua(e) {
	var t = za;
	try {
		return za = !1, [e(), za];
	} finally {
		za = t;
	}
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/reactivity/props.js
var Wa = {
	get(e, t) {
		if (!e.exclude.has(t)) return e.props[t];
	},
	set(e, t) {
		return !1;
	},
	getOwnPropertyDescriptor(e, t) {
		if (!e.exclude.has(t) && t in e.props) return {
			enumerable: !0,
			configurable: !0,
			value: e.props[t]
		};
	},
	has(e, t) {
		return !e.exclude.has(t) && t in e.props;
	},
	ownKeys(e) {
		return Reflect.ownKeys(e.props).filter((t) => !e.exclude.has(t));
	}
};
/*#__NO_SIDE_EFFECTS__*/
function Ga(e, t, n) {
	return new Proxy({
		props: e,
		exclude: t
	}, Wa);
}
var Ka = {
	get(e, t) {
		let n = e.props.length;
		for (; n--;) {
			let r = e.props[n];
			if (d(r) && (r = r()), typeof r == "object" && r && t in r) return r[t];
		}
	},
	set(e, t, n) {
		let r = e.props.length;
		for (; r--;) {
			let i = e.props[r];
			d(i) && (i = i());
			let o = a(i, t);
			if (o && o.set) return o.set(n), !0;
		}
		return !1;
	},
	getOwnPropertyDescriptor(e, t) {
		let n = e.props.length;
		for (; n--;) {
			let r = e.props[n];
			if (d(r) && (r = r()), typeof r == "object" && r && t in r) {
				let e = a(r, t);
				return e && !e.configurable && (e.configurable = !0), e;
			}
		}
	},
	has(e, t) {
		if (t === se || t === le) return !1;
		for (let n of e.props) if (d(n) && (n = n()), n != null && t in n) return !0;
		return !1;
	},
	ownKeys(e) {
		let t = [];
		for (let n of e.props) if (d(n) && (n = n()), n) {
			for (let e in n) t.includes(e) || t.push(e);
			for (let e of Object.getOwnPropertySymbols(n)) t.includes(e) || t.push(e);
		}
		return t;
	}
};
function qa(...e) {
	return new Proxy({ props: e }, Ka);
}
function Ja(e, t, n, r) {
	var i = !0, o = !!(n & 8), s = !!(n & 16), c = r, l = !0, u = void 0, d = () => s && i ? (u ??= /* @__PURE__ */ Tt(r), Z(u)) : (l && (l = !1, c = s ? Q(r) : r), c);
	let f;
	if (o) {
		var p = se in e || le in e;
		f = a(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	o ? [m, h] = Ua(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && He(t), f(m)));
	var g = i ? () => {
		var n = e[t];
		return n === void 0 ? d() : (l = !0, n);
	} : () => {
		var n = e[t];
		return n !== void 0 && (c = void 0), n === void 0 ? c : n;
	};
	if (i && !(n & 4)) return g;
	if (f) {
		var _ = e.$$legacy;
		return (function(e, t) {
			return arguments.length > 0 ? ((!i || !t || _ || h) && f(t ? g() : e), e) : g();
		});
	}
	var v = !1, y = (n & 1 ? Tt : kt)(() => (v = !1, g()));
	o && Z(y);
	var b = q;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? Z(y) : i && o ? dn(e) : e;
			return I(y, n), v = !0, c !== void 0 && (c = n), e;
		}
		return er && v || b.f & 16384 ? y.v : Z(y);
	});
}
function Ya(e) {
	A === null && Fe("onMount"), Mn(() => {
		let t = Q(e);
		if (typeof t == "function") return t;
	});
}
function Xa(e) {
	A === null && Fe("onDestroy"), Ya(() => () => Q(e));
}
export { Cr as $, zi as A, Oe as At, oi as B, $i as C, st as Ct, Hi as D, Xe as Dt, Wi as E, Qe as Et, bi as F, Yr as G, ei as H, gi as I, Hr as J, $r as K, hi as L, Oi as M, h as Mt, Di as N, Vi as O, Je as Ot, Ei as P, Lr as Q, pi as R, ra as S, it as St, Gi as T, rt as Tt, Qr as U, di as V, Zr as W, Br as X, Vr as Y, zr as Z, _a as _, cn as _t, qa as a, Bn as at, aa as b, at as bt, La as c, yn as ct, Ia as d, Sn as dt, Z as et, Ma as f, dn as ft, xa as g, tn as gt, Ta as h, en as ht, Ga as i, Fn as it, Li as j, f as jt, Bi as k, ke as kt, Ra as l, bn as lt, Ea as m, I as mt, Ya as n, Q as nt, Ha as o, Mn as ot, Aa as p, ln as pt, Xr as q, Ja as r, cr as rt, Va as s, Pn as st, Xa as t, vr as tt, Fa as u, xn as ut, ya as v, Gt as vt, Zi as w, ot as wt, ia as x, nt as xt, va as y, Ot as yt, si as z };
