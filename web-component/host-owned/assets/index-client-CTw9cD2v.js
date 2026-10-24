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
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/constants.js
var h = 1 << 24, g = 1024, _ = 2048, v = 4096, y = 8192, b = 16384, x = 32768, S = 1 << 25, ee = 65536, C = 1 << 19, te = 1 << 20, ne = 1 << 25, re = 1 << 21, ie = 1 << 22, ae = 1 << 23, oe = Symbol("$state"), se = Symbol("component"), ce = Symbol("legacy props"), le = Symbol(""), ue = Symbol("proxy path"), de = Symbol("attributes"), fe = Symbol("class"), pe = Symbol("style"), me = Symbol("text"), he = Symbol("form reset"), ge = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), _e = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml"), ve = {}, w = Symbol("uninitialized"), ye = "http://www.w3.org/1999/xhtml", be = "http://www.w3.org/2000/svg", xe = "http://www.w3.org/1998/Math/MathML", Se = "@attach";
function Ce() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function we(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function Te() {
	console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function Ee() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/hydration.js
var T = !1;
function E(e) {
	T = e;
}
var D;
function O(e) {
	if (e === null) throw we(), ve;
	return D = e;
}
function k() {
	return O(/* @__PURE__ */ R(D));
}
function De(e) {
	if (T) {
		if (/* @__PURE__ */ R(D) !== null) throw we(), ve;
		D = e;
	}
}
function Oe(e = 1) {
	if (T) {
		for (var t = e, n = D; t--;) n = /* @__PURE__ */ R(n);
		D = n;
	}
}
function ke(e = !0) {
	for (var t = 0, n = D;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ R(n);
		e && n.remove(), n = i;
	}
}
function Ae(e) {
	if (!e || e.nodeType !== 8) throw we(), ve;
	return e.data;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/reactivity/equality.js
function je(e) {
	return e === this.v;
}
function Me(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Ne(e) {
	return !Me(e, this.v);
}
function Pe(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/errors.js
function Fe() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function Ie(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function Le(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function Re() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function ze(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function Be() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Ve(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function He() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Ue() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function We() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Ge() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/shared/clone.js
var Ke = [];
function qe(e, t = !1, n = !1) {
	return Je(e, /* @__PURE__ */ new Map(), "", Ke, null, n);
}
function Je(t, n, r, i, a = null, o = !1) {
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
				d in t && (u[d] = Je(f, n, r, i, null, o));
			}
			return u;
		}
		if (l(t) === s) {
			u = {}, n.set(t, u), a !== null && n.set(a, u);
			for (var p of Object.keys(t)) u[p] = Je(t[p], n, r, i, null, o);
			return u;
		}
		if (t instanceof Date) return t.getTime(), structuredClone(t);
		if (typeof t.toJSON == "function" && !o) return Je(t.toJSON(), n, r, i, t);
	}
	if (t instanceof EventTarget) return t;
	try {
		return structuredClone(t);
	} catch {
		return t;
	}
}
function Ye(e, t) {
	return e.label = t, Xe(e.v, t), e;
}
function Xe(e, t) {
	return e?.[ue]?.(t), e;
}
function Ze(e) {
	return typeof e == "symbol" ? `Symbol(${e.description})` : typeof e == "function" ? "<function>" : typeof e == "object" && e ? "<object>" : String(e);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/shared/context.js
function Qe(e) {
	let t = e.p;
	for (; t !== null && t.c === null;) t = t.p;
	return t?.c ?? null;
}
function $e(e, t) {
	return e === null && Pe(t), e.c ??= new Map(Qe(e) || void 0);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/context.js
var A = null;
function et(e) {
	A = e;
}
function tt(e) {
	return $e(A, "getContext").get(e);
}
function nt(e, t) {
	return $e(A, "setContext").set(e, t), t;
}
function rt(e) {
	return $e(A, "hasContext").has(e);
}
function it() {
	return $e(A, "getAllContexts");
}
function at(e, t = !1, n) {
	A = {
		p: A,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: K,
		l: null
	};
}
function ot(e) {
	var t = A, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) jn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, A = t.p, st(e);
}
function st(e = {}) {
	return i(e, se, { value: !0 }), e;
}
function ct() {
	return !0;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/task.js
var lt = [];
function ut() {
	var e = lt;
	lt = [], p(e);
}
function j(e) {
	if (lt.length === 0 && !It) {
		var t = lt;
		queueMicrotask(() => {
			t === lt && ut();
		});
	}
	lt.push(e);
}
function dt() {
	for (; lt.length > 0;) ut();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/reactivity/status.js
var ft = ~(_ | v | g);
function M(e, t) {
	e.f = e.f & ft | t;
}
function pt(e) {
	e.f & 512 || e.deps === null ? M(e, g) : M(e, v);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/reactivity/utils.js
function mt(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), M(e, g);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/elements/misc.js
function ht(e, t) {
	if (t) {
		let t = document.body;
		e.autofocus = !0, j(() => {
			document.activeElement === t && e.focus();
		});
	}
}
var gt = !1;
function _t() {
	gt || (gt = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[he]?.();
		});
	}, { capture: !0 }));
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function vt(e) {
	var t = U, n = K;
	G(null), q(null);
	try {
		return e();
	} finally {
		G(t), q(n);
	}
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/reactivity/async.js
function yt(e, t, n, r) {
	let i = ct() ? Ct : Dt;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = K, c = bt(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				z(e, s);
			}
			xt();
		}
	}
	var d = St();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ Tt(e))).then(u).catch((e) => z(e, s)).finally(d);
	}
	l ? l.then(() => {
		s.f & 16384 ? d() : (c(), f(), xt());
	}) : f();
}
function bt() {
	var e = K, t = U, n = A, r = N;
	return function(i = !0) {
		q(e), G(t), et(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function xt(e = !0) {
	q(null), G(null), et(null), e && N?.deactivate();
}
function St() {
	var e = K, t = e.b, n = N, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Ct(e) {
	var t = 2 | _;
	return K !== null && (K.f |= C), {
		ctx: A,
		deps: null,
		effects: null,
		equals: je,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: w,
		wv: 0,
		parent: K,
		ac: null
	};
}
var wt = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function Tt(e, t, n) {
	let r = K;
	r === null && Fe();
	var i = void 0, a = Qt(w), o = !U, s = /* @__PURE__ */ new Set();
	return In(() => {
		var t = K, n = m();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== ge && n.reject(e);
			}).finally(xt);
		} catch (e) {
			n.reject(e), xt();
		}
		var c = N;
		if (o) {
			if (t.f & 32768) var l = St();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(wt);
			else for (let e of s.values()) e.reject(wt);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== wt && (c.activate(), t ? (a.f |= ae, an(a, t)) : (a.f & 8388608 && (a.f ^= ae), an(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), kn(() => {
		for (let e of s) e.reject(wt);
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
function Et(e) {
	let t = /* @__PURE__ */ Ct(e);
	return er(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function Dt(e) {
	let t = /* @__PURE__ */ Ct(e);
	return t.equals = Ne, t;
}
function Ot(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) H(t[n]);
	}
}
function kt(e) {
	var t, n = K, r = e.parent;
	if (!Qn && r !== null && e.v !== w && r.f & 24576) return Ce(), e.v;
	q(r);
	try {
		Ot(e), t = lr(e);
	} finally {
		q(n);
	}
	return t;
}
function At(e) {
	var t = kt(e);
	!e.equals(t) && (e.wv = or(), (!N?.is_fork || e.deps === null) && (N === null ? e.v = t : (N.capture(e, t, !0), Pt?.capture(e, t, !0)), e.deps === null)) ? M(e, g) : Qn || (P === null ? pt(e) : (On() || N?.is_fork) && P.set(e, t));
}
function jt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && vt(() => {
		t.ac.abort(ge), t.ac = null;
	}), t.fn !== null && (t.teardown = f), fr(t, 0), Hn(t));
}
function Mt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && pr(t);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/reactivity/batch.js
var Nt = null, N = null, Pt = null, P = null, Ft = null, It = !1, Lt = !1, Rt = null, zt = null, Bt = 0, Vt = 1, Ht = class e {
	id = Vt++;
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
		Nt === null ? Nt = this : (Nt.#n = this, this.#t = Nt), Nt = this;
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
			for (var r of n.d) M(r, _), t(r);
			for (r of n.m) M(r, v), t(r);
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
					t.f ^= g;
				}
			}
			n || e.push(t);
		}
		return this.#c = [], e;
	}
	#_() {
		this.#e = !0;
		for (let e of this.#u) this.#d.delete(e), M(e, _), this.schedule(e);
		for (let e of this.#d) M(e, v), this.schedule(e);
		this.apply();
		for (var t = Rt = [], n = [], r = zt = []; this.#c.length > 0;) {
			Bt++ > 1e3 && (this.#S(), Wt());
			for (let e of this.#g()) try {
				this.#v(e, t, n);
			} catch (t) {
				throw Yt(e), this.#h() || this.discard(), t;
			}
		}
		if (N = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (Rt = null, zt = null, this.#h()) {
			this.#x(n), this.#x(t);
			for (let [e, t] of this.#f) Jt(e, t);
			r.length > 0 && N.#_();
			return;
		}
		let a = this.#y();
		if (a) this.#x(n), this.#x(t), a.#b(this);
		else {
			this.#u.clear(), this.#d.clear();
			for (let e of this.#r) e(this);
			this.#r.clear(), Pt = this, Kt(n), Kt(t), Pt = null, this.#s?.resolve();
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
		e.f ^= g;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= g : i & 4 ? t.push(r) : sr(r) && (i & 16 && this.#d.add(r), pr(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), M(i, _), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#S(), N = this, this.#_();
	}
	#x(e) {
		for (var t = 0; t < e.length; t += 1) mt(e[t], this.#u, this.#d);
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
			Lt = !0, N = this, this.#_();
		} finally {
			Bt = 0, Ft = null, Rt = null, zt = null, Lt = !1, N = null, P = null, F.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(wt);
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
			!Lt && !It && j(() => {
				t.#e || t.flush();
			});
		}
		return N;
	}
	apply() {
		P = null;
	}
	schedule(e) {
		Ft = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768) ? e.b.defer_effect(e) : this.#c.push(e);
	}
	#S() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? Nt = e : t.#t = e, this.linked = !1;
		}
	}
};
function Ut(e) {
	var t = It, n = Pt;
	Pt = null, It = !0;
	try {
		var r;
		for (e && (Ut(), r = e());;) {
			if (dt(), N === null) return r;
			N.flush();
		}
	} finally {
		It = t, Pt = n;
	}
}
function Wt() {
	try {
		Be();
	} catch (e) {
		z(e, Ft);
	}
}
var Gt = null;
function Kt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && sr(r) && (Gt = /* @__PURE__ */ new Set(), pr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Gn(r), Gt?.size > 0)) {
				F.clear();
				for (let e of Gt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Gt.has(n) && (Gt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || pr(n);
					}
				}
				Gt.clear();
			}
		}
		Gt = null;
	}
}
function qt(e) {
	N.schedule(e);
}
function Jt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), M(e, g);
		for (var n = e.first; n !== null;) Jt(n, t), n = n.next;
	}
}
function Yt(e) {
	M(e, g);
	for (var t = e.first; t !== null;) Yt(t), t = t.next;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/reactivity/sources.js
var Xt = /* @__PURE__ */ new Set(), F = /* @__PURE__ */ new Map(), Zt = !1;
function Qt(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: je,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function $t(e, t) {
	let n = Qt(e, t);
	return er(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function en(e, t = !1, n = !0) {
	let r = Qt(e);
	return t || (r.equals = Ne), r;
}
function tn(e, t, n = !1) {
	return U !== null && (!W || U.f & 131072) && ct() && U.f & 4325394 && (J === null || !J.has(e)) && We(), an(e, n ? ln(t) : t, zt);
}
var nn = null, rn = 0;
function an(e, t, n = null) {
	if (!e.equals(t)) {
		Qn ? F.set(e, t) : F.has(e) || F.set(e, e.v);
		var r = Ht.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && kt(t), P === null && pt(t);
		}
		e.wv = or(), nn = null, rn = 0, cn(e, _, n), nn = null, ct() && K !== null && K.f & 1024 && !(K.f & 96) && (Z === null ? tr([e]) : Z.push(e)), !r.is_fork && Xt.size > 0 && !Zt && on();
	}
	return t;
}
function on() {
	Zt = !1;
	for (let e of Xt) {
		e.f & 1024 && M(e, v);
		let t;
		try {
			t = sr(e);
		} catch {
			t = !0;
		}
		t && pr(e);
	}
	Xt.clear();
}
function sn(e) {
	tn(e, e.v + 1);
}
function cn(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = ct(), a = r.length;
		if (rn += a, rn > 1e5 && nn === null && (nn = /* @__PURE__ */ new Set()), nn !== null) {
			if (nn.has(e)) return;
			nn.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== K) {
				var l = (c & _) === 0;
				if (l && M(s, t), c & 131072) Xt.add(s);
				else if (c & 2) {
					var u = s;
					P?.delete(u), cn(u, v, n);
				} else if (l) {
					var d = s;
					c & 16 && Gt !== null && Gt.add(d), n === null ? qt(d) : n.push(d);
				}
			}
		}
	}
}
function ln(t) {
	if (typeof t != "object" || !t || oe in t || se in t) return t;
	let n = l(t);
	if (n !== s && n !== c) return t;
	var r = /* @__PURE__ */ new Map(), i = e(t), o = /* @__PURE__ */ $t(0), u = null, d = ir, f = (e) => {
		if (ir === d) return e();
		var t = U, n = ir;
		G(null), ar(d);
		var r = e();
		return G(t), ar(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ $t(t.length, u)), new Proxy(t, {
		defineProperty(e, t, n) {
			"value" in n && n.configurable !== !1 && n.enumerable !== !1 && n.writable !== !1 || He();
			var i = r.get(t);
			return i === void 0 ? f(() => {
				var e = /* @__PURE__ */ $t(n.value, u);
				return r.set(t, e), e;
			}) : tn(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var n = r.get(t);
			if (n === void 0) {
				if (t in e) {
					let e = f(() => /* @__PURE__ */ $t(w, u));
					r.set(t, e), sn(o);
				}
			} else tn(n, w), sn(o);
			return !0;
		},
		get(e, n, i) {
			if (n === oe) return t;
			var o = r.get(n), s = n in e;
			if (o === void 0 && (!s || a(e, n)?.writable) && (o = f(() => /* @__PURE__ */ $t(ln(s ? e[n] : w), u)), r.set(n, o)), o !== void 0) {
				var c = Q(o);
				return c === w ? void 0 : c;
			}
			return Reflect.get(e, n, i);
		},
		getOwnPropertyDescriptor(e, t) {
			this.has?.(e, t);
			var n = Reflect.getOwnPropertyDescriptor(e, t), i = r.get(t);
			if (i !== void 0) {
				var a = Q(i);
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
			if (t === oe) return !0;
			var n = r.get(t), i = n !== void 0 && n.v !== w || Reflect.has(e, t);
			return (n !== void 0 || K !== null && (!i || a(e, t)?.writable)) && (n === void 0 && (n = f(() => /* @__PURE__ */ $t(i ? ln(e[t]) : w, u)), r.set(t, n)), Q(n) === w) ? !1 : i;
		},
		set(e, t, n, s) {
			var c = r.get(t), l = t in e;
			if (i && t === "length") for (var d = n; d < c.v; d += 1) {
				var p = r.get(d + "");
				p === void 0 ? d in e && (p = f(() => /* @__PURE__ */ $t(w, u)), r.set(d + "", p)) : tn(p, w);
			}
			if (c === void 0) (!l || a(e, t)?.writable) && (c = f(() => /* @__PURE__ */ $t(void 0, u)), tn(c, ln(n)), r.set(t, c));
			else {
				l = c.v !== w;
				var m = f(() => ln(n));
				tn(c, m);
			}
			var h = Reflect.getOwnPropertyDescriptor(e, t);
			if (h?.set && h.set.call(s, n), !l) {
				if (i && typeof t == "string") {
					var g = r.get("length"), _ = Number(t);
					Number.isInteger(_) && _ >= g.v && tn(g, _ + 1);
				}
				sn(o);
			}
			return !0;
		},
		ownKeys(e) {
			Q(o);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = r.get(e);
				return t === void 0 || t.v !== w;
			});
			for (var [n, i] of r) i.v !== w && !(n in e) && t.push(n);
			return t;
		},
		setPrototypeOf() {
			Ue();
		}
	});
}
function un(e) {
	try {
		if (typeof e == "object" && e && oe in e) return e[oe];
	} catch {}
	return e;
}
function dn(e, t) {
	return Object.is(un(e), un(t));
}
var fn, pn, mn, hn;
function gn() {
	if (fn === void 0) {
		fn = window, pn = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		mn = a(t, "firstChild").get, hn = a(t, "nextSibling").get, u(e) && (e[fe] = void 0, e[de] = null, e[pe] = void 0, e.__e = void 0), u(n) && (n[me] = void 0);
	}
}
function I(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function L(e) {
	return mn.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function R(e) {
	return hn.call(e);
}
function _n(e, t) {
	if (!T) return /* @__PURE__ */ L(e);
	var n = /* @__PURE__ */ L(D);
	if (n === null) n = D.appendChild(I());
	else if (t && n.nodeType !== 3) {
		var r = I();
		return n?.before(r), O(r), r;
	}
	return t && wn(n), O(n), n;
}
function vn(e, t = !1) {
	if (!T) {
		var n = /* @__PURE__ */ L(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ R(n) : n;
	}
	if (t) {
		if (D?.nodeType !== 3) {
			var r = I();
			return D?.before(r), O(r), r;
		}
		wn(D);
	}
	return D;
}
function yn(e, t = !1) {
	if (!T) return /* @__PURE__ */ L(e);
	var n = _n(e, t);
	return De(e), n;
}
function bn(e, t = 1, n = !1) {
	let r = T ? D : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ R(r);
	if (!T) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = I();
			return r === null ? i?.after(a) : r.before(a), O(a), a;
		}
		wn(r);
	}
	return O(r), r;
}
function xn(e) {
	e.textContent = "";
}
function Sn() {
	return !1;
}
function Cn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function wn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function Tn(e) {
	var t = K;
	if (t === null) return U.f |= ae, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	z(e, t);
}
function z(e, t) {
	if (e === ve) throw e;
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
function En(e) {
	K === null && (U === null && ze(e), Re()), Qn && Le(e);
}
function Dn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function B(e, t) {
	var n = K;
	n !== null && n.f & 8192 && (e |= y);
	var r = {
		ctx: A,
		deps: null,
		nodes: null,
		f: e | _ | 512,
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
	if (e & 4) Rt === null ? Ht.ensure().schedule(r) : Rt.push(r);
	else if (t !== null) {
		try {
			pr(r);
		} catch (e) {
			throw H(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= ee));
	}
	if (i !== null && (i.parent = n, n !== null && Dn(i, n), U !== null && U.f & 2 && !(e & 64))) {
		var a = U;
		(a.effects ??= []).push(i);
	}
	return r;
}
function On() {
	return U !== null && !W;
}
function kn(e) {
	let t = B(8, null);
	return M(t, g), t.teardown = e, t;
}
function An(e) {
	En("$effect");
	var t = K.f;
	if (!U && t & 32 && A !== null && !A.i) {
		var n = A;
		(n.e ??= []).push(e);
	} else return jn(e);
}
function jn(e) {
	return B(4 | te, e);
}
function Mn(e) {
	return En("$effect.pre"), B(8 | te, e);
}
function Nn(e) {
	Ht.ensure();
	let t = B(64 | C, e);
	return () => {
		H(t);
	};
}
function Pn(e) {
	Ht.ensure();
	let t = B(64 | C, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Kn(t, () => {
			H(t), n(void 0);
		}) : (H(t), n(void 0));
	});
}
function Fn(e) {
	return B(4, e);
}
function In(e) {
	return B(ie | C, e);
}
function Ln(e, t = 0) {
	return B(8 | t, e);
}
function Rn(e, t = [], n = [], r = []) {
	yt(r, t, n, (t) => {
		B(8, () => {
			e(...t.map(Q));
		});
	});
}
function zn(e, t = 0) {
	return B(16 | t, e);
}
function Bn(e, t = 0) {
	return B(h | t, e);
}
function V(e) {
	return B(32 | C, e);
}
function Vn(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = Qn, r = U;
		$n(!0), G(null);
		try {
			t.call(null);
		} catch (t) {
			z(t, e.parent);
		} finally {
			$n(n), G(r);
		}
	}
}
function Hn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && vt(() => {
			e.abort(ge);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : H(n, t), n = r;
	}
}
function Un(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || H(t), t = n;
	}
}
function H(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Wn(e.nodes.start, e.nodes.end), n = !0), e.f |= S, Hn(e, t && !n), fr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Vn(e), e.f ^= S, e.f |= b;
	var i = e.parent;
	i !== null && i.first !== null && Gn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Wn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ R(e);
		e.remove(), e = n;
	}
}
function Gn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Kn(e, t, n = !0) {
	var r = [];
	e.f |= 256, qn(e, r, !0);
	var i = () => {
		n && H(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function qn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= y;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				qn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Jn(e) {
	e.f &= -257, Yn(e, !0);
}
function Yn(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= y, e.f & 1024 || (M(e, _), Ht.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			Yn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Xn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ R(n);
		t.append(n), n = i;
	}
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/legacy.js
var Zn = null, Qn = !1;
function $n(e) {
	Qn = e;
}
var U = null, W = !1;
function G(e) {
	U = e;
}
var K = null;
function q(e) {
	K = e;
}
var J = null;
function er(e) {
	U !== null && (U.f & 2097152 || U.f & 2) && (J ??= /* @__PURE__ */ new Set()).add(e);
}
var Y = null, X = 0, Z = null;
function tr(e) {
	Z = e;
}
var nr = 1, rr = 0, ir = rr;
function ar(e) {
	ir = e;
}
function or() {
	return ++nr;
}
function sr(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (sr(a) && At(a), a.wv > e.wv) return !0;
		}
		t & 512 && P === null && M(e, g);
	}
	return !1;
}
function cr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(J !== null && J.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? cr(a, t, !1) : t === a && (n ? M(a, _) : a.f & 1024 && M(a, v), qt(a));
	}
}
function lr(e) {
	var t = Y, n = X, r = Z, i = U, a = J, o = A, s = W, c = ir, l = e.f;
	Y = null, X = 0, Z = null, U = l & 96 ? null : e, J = null, et(e.ctx), W = !1, ir = ++rr, e.ac !== null && (vt(() => {
		e.ac.abort(ge);
	}), e.ac = null);
	try {
		e.f |= re;
		var u = e.fn, d = u();
		e.f |= x;
		var f = ur(e);
		if (ct() && Z !== null && !W && f !== null && !(e.f & 6146)) for (var p = 0; p < Z.length; p++) cr(Z[p], e);
		if (i !== null && i !== e) {
			if (rr++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = rr;
			if (t !== null) for (let e of t) e.rv = rr;
			Z !== null && (r === null ? r = Z : r.push(...Z));
		}
		return e.f & 8388608 && (e.f ^= ae), d;
	} catch (t) {
		return ur(e), Tn(t);
	} finally {
		e.f ^= re, Y = t, X = n, Z = r, U = i, J = a, et(o), W = s, ir = c;
	}
}
function ur(e) {
	var t = e.deps, n = N?.is_fork;
	if (Y !== null) {
		var r;
		if (n || fr(e, X), t !== null && X > 0) for (t.length = X + Y.length, r = 0; r < Y.length; r++) t[X + r] = Y[r];
		else e.deps = t = Y;
		if (On() && e.f & 512) for (r = X; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && X < t.length && (fr(e, X), t.length = X);
	return t;
}
function dr(e, r) {
	let i = r.reactions;
	if (i !== null) {
		var a = t.call(i, e);
		if (a !== -1) {
			var o = i.length - 1;
			o === 0 ? i = r.reactions = null : (i[a] = i[o], i.pop());
		}
	}
	if (i === null && r.f & 2 && (Y === null || !n.call(Y, r))) {
		var s = r;
		s.f & 512 && (s.f ^= 512), s.v !== w && pt(s), s.ac !== null && vt(() => {
			s.ac.abort(ge), s.ac = null, M(s, _);
		}), jt(s), fr(s, 0);
	}
}
function fr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) dr(e, n[r]);
}
function pr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		M(e, g);
		var n = K;
		K = e;
		try {
			t & 16777232 ? Un(e) : Hn(e), Vn(e);
			var r = lr(e);
			e.teardown = typeof r == "function" ? r : null, e.wv = nr;
		} finally {
			K = n;
		}
	}
}
async function mr() {
	await Promise.resolve(), Ut();
}
function Q(e) {
	var t = !!(e.f & 2);
	if (Zn?.add(e), U !== null && !W && !(K !== null && K.f & 16384) && (J === null || !J.has(e))) {
		var r = U.deps;
		if (U.f & 2097152) e.rv < rr && (e.rv = rr, Y === null && r !== null && r[X] === e ? X++ : Y === null ? Y = [e] : Y.push(e));
		else {
			U.deps ??= [], n.call(U.deps, e) || U.deps.push(e);
			var i = e.reactions;
			i === null ? e.reactions = [U] : n.call(i, U) || i.push(U);
		}
	}
	if (Qn && F.has(e)) return F.get(e);
	if (t) {
		var a = e;
		if (Qn) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || gr(a)) && (o = kt(a)), F.set(a, o), o;
		}
		var s = !(a.f & 512) && !W && U !== null && !!(U.f & 512), c = (a.f & x) === 0;
		sr(a) && (s && (a.f |= 512), At(a)), s && !c && (Mt(a), hr(a));
	}
	if (P?.has(e)) return P.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function hr(e) {
	if (e.f |= 512, e.deps !== null) for (let r of e.deps) {
		var t = r.reactions;
		t === null ? r.reactions = [e] : n.call(t, e) || t.push(e), r.f & 2 && !(r.f & 512) && (Mt(r), hr(r));
	}
}
function gr(e) {
	if (e.v === w) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (F.has(t) || t.f & 2 && gr(t)) return !0;
	return !1;
}
function _r(e) {
	var t = W;
	try {
		return W = !0, e();
	} finally {
		W = t;
	}
}
function vr(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (oe in e) yr(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && oe in n && yr(n);
		}
	}
}
function yr(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			yr(e[n], t);
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
function br() {
	return Symbol(Se);
}
function xr(e) {
	return e.endsWith("capture") && e !== "gotpointercapture" && e !== "lostpointercapture";
}
var Sr = [
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
function Cr(e) {
	return Sr.includes(e);
}
var wr = /* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split("."), Tr = {
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
function Er(e) {
	return e = e.toLowerCase(), Tr[e] ?? e;
}
[...wr];
var Dr = ["touchstart", "touchmove"];
function Or(e) {
	return Dr.includes(e);
}
var kr = [
	"textarea",
	"script",
	"style",
	"title"
];
function Ar(e) {
	return kr.includes(e);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dev/css.js
var jr = Symbol("events"), Mr = /* @__PURE__ */ new Set(), Nr = /* @__PURE__ */ new Set();
function Pr(e) {
	if (!T) return;
	e.removeAttribute("onload"), e.removeAttribute("onerror");
	let t = e.__e;
	t !== void 0 && (e.__e = void 0, queueMicrotask(() => {
		e.isConnected && e.dispatchEvent(t);
	}));
}
function Fr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Hr.call(t, e), !e.cancelBubble) return vt(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? (i.__removed = !1, j(() => {
		i.__removed || t.addEventListener(e, i, r);
	})) : t.addEventListener(e, i, r), i;
}
function Ir(e, t, n, r = {}) {
	var i = Fr(t, e, n, r);
	return () => {
		i.__removed = !0, e.removeEventListener(t, i, r);
	};
}
function Lr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = Fr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && kn(() => {
		o.__removed = !0, t.removeEventListener(e, o, a);
	});
}
function Rr(e, t, n) {
	(t[jr] ??= {})[e] = n;
}
function zr(e) {
	for (var t = 0; t < e.length; t++) Mr.add(e[t]);
	for (var n of Nr) n(e);
}
var Br = null, Vr = !1;
function Hr(e) {
	var t = this, n = t.ownerDocument, r = e.type, a = e.composedPath?.() || [], o = a[0] || e.target;
	Br = e, Vr || (Vr = !0, setTimeout(() => {
		Vr = !1, Br = null;
	}));
	var s = 0, c = Br === e && e[jr];
	if (c) {
		var l = a.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[jr] = t;
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
		var d = U, f = K;
		G(null), q(null);
		try {
			for (var p, m = []; o !== null && o !== t;) {
				try {
					var h = o[jr]?.[r];
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
			e[jr] = t, delete e.currentTarget, G(d), q(f);
		}
	}
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/reconciler.js
var Ur = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function Wr(e) {
	return Ur?.createHTML(e) ?? e;
}
function Gr(e) {
	var t = Cn("template");
	return t.innerHTML = Wr(e.replaceAll("<!>", "<!---->")), t.content;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/template.js
function $(e, t) {
	var n = K;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function Kr(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		if (T) return $(D, null), D;
		i === void 0 && (i = Gr(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ L(i)));
		var t = r || pn ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ L(t), s = t.lastChild;
			$(o, s);
		} else $(t, t);
		return t;
	};
}
function qr(e = "") {
	if (!T) {
		var t = I(e + "");
		return $(t, t), t;
	}
	var n = D;
	return n.nodeType === 3 ? wn(n) : (n.before(n = I()), O(n)), $(n, n), n;
}
function Jr() {
	if (T) return $(D, null), D;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = I();
	return e.append(t, n), $(t, n), e;
}
function Yr(e, t) {
	if (T) {
		var n = K;
		n.f & 32768 && n.nodes.end !== null || (n.nodes.end = D), k();
	} else e !== null && e.before(t);
}
function Xr() {
	if (T && D && D.nodeType === 8 && D.textContent?.startsWith("$")) {
		let e = D.textContent.substring(1);
		return k(), e;
	}
	return (window.__svelte ??= {}).uid ??= 1, `c${window.__svelte.uid++}`;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/reactivity/create-subscriber.js
function Zr(e) {
	let t = 0, n = Qt(0), r;
	return () => {
		On() && (Q(n), Ln(() => (t === 0 && (r = _r(() => e(() => sn(n)))), t += 1, () => {
			j(() => {
				--t, t === 0 && (r?.(), r = void 0, sn(n));
			});
		})));
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var Qr = ee | C;
function $r(e, t, n, r) {
	new ei(e, t, n, r);
}
var ei = class {
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
	#h = Zr(() => (this.#m = Qt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = K;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = K.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = zn(() => {
			if (T) {
				let e = Ae(this.#t);
				k();
				let t = e === "[!";
				if (e.startsWith("[?")) {
					let t = JSON.parse(e.slice(2));
					this.#_(t);
				} else t ? this.#b() : this.#g();
			} else this.#x();
		}, Qr), T && (this.#e = D);
	}
	#g() {
		try {
			this.#a = V(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		j(r), t && (this.#s = V(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			this.#y() || (t ? Ee() : (t = !0, n && Ge(), this.#s !== null && Kn(this.#s, () => {
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
					z(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		return (this.#i.f & (b | S)) !== 0;
	}
	#b() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = V(() => e(this.#e)), j(() => {
			if (!this.#y()) {
				var e = this.#c = document.createDocumentFragment(), t = I(), n = !1;
				e.append(t), this.#a = this.#C(() => {
					try {
						return V(() => this.#r(t));
					} catch (e) {
						try {
							this.error(e), n = !0;
						} catch (e) {
							z(e, this.#i.parent);
						}
						return null;
					}
				}), this.#a === null ? (this.#c = null, n && this.#S(N)) : this.#u === 0 && (this.#e.before(e), this.#c = null, Kn(this.#o, () => {
					this.#o = null;
				}), this.#S(N));
			}
		}));
	}
	#x() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = V(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Xn(this.#a, e);
				let t = this.#n.pending;
				this.#o = V(() => t(this.#e));
			} else this.#S(N);
		} catch (e) {
			this.error(e);
		}
	}
	#S(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		mt(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#C(e) {
		var t = K, n = U, r = A;
		q(this.#i), G(this.#i), et(this.#i.ctx);
		try {
			return Ht.ensure(), e();
		} finally {
			q(t), G(n), et(r);
		}
	}
	#w(e, t) {
		this.has_pending_snippet() ? (this.#u += e, this.#u === 0 && (this.#S(t), this.#o && Kn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null))) : this.parent && this.parent.#w(e, t);
	}
	update_pending_count(e, t) {
		this.#w(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, j(() => {
			this.#d = !1, this.#m && an(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), Q(this.#m);
	}
	error(e) {
		if (e === ve || !this.#n.onerror && !this.#n.failed) throw e;
		N?.is_fork ? (this.#a && N.skip_effect(this.#a), this.#o && N.skip_effect(this.#o), this.#s && N.skip_effect(this.#s), N.oncommit(() => {
			this.#y() || this.#T(e);
		})) : this.#T(e);
	}
	#T(e) {
		this.#a &&= (H(this.#a), null), this.#o &&= (H(this.#o), null), this.#s &&= (H(this.#s), null), T && (O(this.#t), Oe(), O(ke()));
		let t = this.#n.failed, n = (e) => {
			if (this.#y()) return;
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && !this.#y() && (this.#s = this.#C(() => {
				try {
					return V(() => {
						var r = K;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return z(e, this.#i.parent), null;
				}
			}));
		};
		j(() => {
			if (!this.#y()) {
				var t;
				try {
					t = this.transform_error(e);
				} catch (e) {
					z(e, this.#i && this.#i.parent);
					return;
				}
				typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => z(e, this.#i && this.#i.parent)) : n(t);
			}
		});
	}
}, ti = !0;
function ni(e) {
	ti = e;
}
function ri(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[me] ??= e.nodeValue) && (e[me] = n, e.nodeValue = `${n}`);
}
function ii(e, t) {
	return oi(e, t);
}
var ai = /* @__PURE__ */ new Map();
function oi(e, { target: t, anchor: n, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	gn();
	var l = void 0, u = Pn(() => {
		var u = n ?? t.appendChild(I());
		$r(u, { pending: () => {} }, (t) => {
			at({});
			var n = A;
			if (o && (n.c = o), a && (i.$$events = a), T && $(t, null), ti = s, l = e(t, i) || st(), ti = !0, T && (K.nodes.end = D, D === null || D.nodeType !== 8 || D.data !== "]")) throw we(), ve;
			ot();
		}, c);
		var d = /* @__PURE__ */ new Set(), f = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!d.has(r)) {
					d.add(r);
					var i = Or(r);
					for (let e of [t, document]) {
						var a = ai.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), ai.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Hr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(r(Mr)), Nr.add(f), () => {
			for (var e of d) for (let n of [t, document]) {
				var r = ai.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, Hr), r.delete(e), r.size === 0 && ai.delete(n)) : r.set(e, i);
			}
			Nr.delete(f), u !== n && u.parentNode?.removeChild(u);
		};
	});
	return si.set(l, u), l;
}
var si = /* @__PURE__ */ new WeakMap();
function ci(e, t) {
	let n = si.get(e);
	return n ? (si.delete(e), n(t)) : Promise.resolve();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/blocks/branches.js
var li = class {
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
			if (n) Jn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Jn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (H(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						Xn(r, t), t.append(I()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else H(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Kn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (H(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = N, r = Sn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = I();
				i.append(a), this.#n.set(e, {
					effect: V(() => t(a)),
					fragment: i
				});
			} else this.#t.set(e, V(() => t(this.anchor)));
		}
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else T && (this.anchor = D), this.#a(n);
	}
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/blocks/if.js
function ui(e, t, n = !1) {
	var r;
	T && (r = D, k());
	var i = new li(e), a = n ? ee : 0;
	function o(e, t) {
		if (T) {
			var n = Ae(r);
			if (e !== parseInt(n.substring(1))) {
				var a = ke();
				O(a), i.anchor = a, E(!1), i.ensure(e, t), E(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	zn(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/blocks/key.js
var di = Symbol("NaN");
function fi(e, t, n) {
	T && k();
	var r = new li(e), i = !ct();
	zn(() => {
		var e = t();
		e !== e && (e = di), i && typeof e == "object" && e && (e = {}), r.ensure(e, n);
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/blocks/each.js
function pi(e, t) {
	return t;
}
function mi(e, t, n) {
	for (var i = [], a = t.length, o, s = t.length, c = 0; c < a; c++) {
		let n = t[c];
		Kn(n, () => {
			if (o) {
				if (o.pending.delete(n), o.done.add(n), o.pending.size === 0) {
					var t = e.outrogroups;
					hi(e, r(o.done)), t.delete(o), t.size === 0 && (e.outrogroups = null);
				}
			} else --s;
		}, !1);
	}
	if (s === 0) {
		var l = i.length === 0 && n !== null && e.pending.size === 0;
		if (l) {
			var u = n, d = u.parentNode;
			xn(d), d.append(u), e.items.clear();
		}
		hi(e, t, !l);
	} else o = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(o);
}
function hi(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= ne, Xn(a, document.createDocumentFragment())) : H(t[i], n);
	}
}
var gi;
function _i(t, n, i, a, o, s = null) {
	var c = t, l = /* @__PURE__ */ new Map();
	if (n & 4) {
		var u = t;
		c = T ? O(/* @__PURE__ */ L(u)) : u.appendChild(I());
	}
	T && k();
	var d = null, f = /* @__PURE__ */ Dt(() => {
		var t = i();
		return e(t) ? t : t == null ? [] : r(t);
	}), p = /* @__PURE__ */ new Map(), m = !0;
	function h(e) {
		if (!(_.effect.f & 16384)) {
			_.pending.delete(e);
			var t = Q(f);
			_.fallback = d, yi(_, t, c, n, a), d !== null && (t.length === 0 ? d.f & 33554432 ? (d.f ^= ne, xi(d, null, c)) : Jn(d) : Kn(d, () => {
				d = null;
			}));
		}
	}
	function g(e) {
		_.pending.delete(e);
	}
	var _ = {
		effect: zn(() => {
			var e = Q(f), t = e.length;
			let r = !1;
			T && Ae(c) === "[!" != (t === 0) && (c = ke(), O(c), E(!1), r = !0);
			for (var u = /* @__PURE__ */ new Set(), _ = N, v = Sn(), y = 0; y < t; y += 1) {
				T && D.nodeType === 8 && D.data === "]" && (c = D, r = !0, E(!1));
				var b = e[y], x = a(b, y), S = m ? null : l.get(x);
				S ? (S.v && an(S.v, b), S.i && an(S.i, y), v && _.unskip_effect(S.e)) : (S = bi(l, m ? c : gi ??= I(), b, x, y, o, n, i), m || (S.e.f |= ne), l.set(x, S)), u.add(x);
			}
			if (t === 0 && s && !d && (m ? d = V(() => s(c)) : (d = V(() => s(gi ??= I())), d.f |= ne)), t > u.size && Ie("", "", ""), T && t > 0 && O(ke()), !m) {
				if (p.set(_, u), v) {
					for (let [e, t] of l) u.has(e) || _.skip_effect(t.e);
					_.oncommit(h), _.ondiscard(g);
				} else h(_);
			}
			r && E(!0), Q(f);
		}),
		flags: n,
		items: l,
		pending: p,
		outrogroups: null,
		fallback: d
	};
	m = !1, T && (c = D);
}
function vi(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function yi(e, t, n, i, a) {
	var o = !!(i & 8), s = t.length, c = e.items, l = vi(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (o) for (v = 0; v < s; v += 1) h = t[v], g = a(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < s; v += 1) {
		if (h = t[v], g = a(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Jn(_), o && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= ne, _ === l) xi(_, null, n);
			else {
				var y = d ? d.next : l;
				_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), Si(e, d, _), Si(e, _, y), xi(_, y, n), d = _, p = [], m = [], l = vi(d.next);
				continue;
			}
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], ee = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) xi(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					Si(e, S.prev, ee.next), Si(e, d, S), Si(e, ee, b), l = b, d = ee, --v, p = [], m = [];
				} else u.delete(_), xi(_, l, n), Si(e, _.prev, _.next), Si(e, _, d === null ? e.effect.first : d.next), Si(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = vi(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = vi(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (hi(e, r(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var C = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || C.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && C.push(l), l = vi(l.next);
		var te = C.length;
		if (te > 0) {
			var re = i & 4 && s === 0 ? n : null;
			if (o) {
				for (v = 0; v < te; v += 1) C[v].nodes?.a?.measure();
				for (v = 0; v < te; v += 1) C[v].nodes?.a?.fix();
			}
			mi(e, C, re);
		}
	}
	o && j(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function bi(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Qt(n) : /* @__PURE__ */ en(n, !1, !1) : null, l = o & 2 ? Qt(i) : null;
	return {
		v: c,
		i: l,
		e: V(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function xi(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ R(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Si(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
function Ci(e, t, n = !1, r = !1, i = !1, a = !1) {
	var o = e, s = "";
	if (n) {
		var c = e;
		T && (o = O(/* @__PURE__ */ L(c)));
	}
	Rn(() => {
		var e = K;
		if (s === (s = t() ?? "")) T && k();
		else if (n && !T) e.nodes = null, c.innerHTML = s, s !== "" && $(/* @__PURE__ */ L(c), c.lastChild);
		else if (e.nodes !== null && (Wn(e.nodes.start, e.nodes.end), e.nodes = null), s !== "") {
			if (T) {
				for (var a = D.data, l = k(), u = l; l !== null && (l.nodeType !== 8 || l.data !== "");) u = l, l = /* @__PURE__ */ R(l);
				if (l === null) throw we(), ve;
				$(D, u), o = O(l);
			} else {
				var d = Cn(r ? "svg" : i ? "math" : "template", r ? be : i ? xe : void 0);
				d.innerHTML = s;
				var f = r || i ? d : d.content;
				if ($(/* @__PURE__ */ L(f), f.lastChild), r || i) for (; /* @__PURE__ */ L(f);) o.before(/* @__PURE__ */ L(f));
				else o.before(f);
			}
		}
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/blocks/snippet.js
function wi(e, t, ...n) {
	var r = new li(e);
	zn(() => {
		let e = t() ?? null;
		r.ensure(e, e && ((t) => e(t, ...n)));
	}, ee);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/blocks/svelte-component.js
function Ti(e, t, n) {
	var r;
	T && (r = D, k());
	var i = new li(e);
	zn(() => {
		var e = t() ?? null;
		if (T && Ae(r) === "[" != (e !== null)) {
			var a = ke();
			O(a), i.anchor = a, E(!1), i.ensure(e, e && ((t) => n(t, e))), E(!0);
		} else i.ensure(e, e && ((t) => n(t, e)));
	}, ee);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/timing.js
var Ei = () => performance.now(), Di = {
	tick: (e) => requestAnimationFrame(e),
	now: () => Ei(),
	tasks: /* @__PURE__ */ new Set()
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/loop.js
function Oi() {
	let e = Di.now();
	Di.tasks.forEach((t) => {
		t.c(e) || (Di.tasks.delete(t), t.f());
	}), Di.tasks.size !== 0 && Di.tick(Oi);
}
function ki(e) {
	let t;
	return Di.tasks.size === 0 && Di.tick(Oi), {
		promise: new Promise((n) => {
			Di.tasks.add(t = {
				c: e,
				f: n
			});
		}),
		abort() {
			Di.tasks.delete(t);
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/elements/transitions.js
function Ai(e, t) {
	vt(() => {
		e.dispatchEvent(new CustomEvent(t));
	});
}
function ji(e) {
	if (e === "float") return "cssFloat";
	if (e === "offset") return "cssOffset";
	if (e.startsWith("--")) return e;
	let t = e.split("-");
	return t.length === 1 ? t[0] : t[0] + t.slice(1).map((e) => e[0].toUpperCase() + e.slice(1)).join("");
}
function Mi(e) {
	let t = {}, n = e.split(";");
	for (let e of n) {
		let [n, r] = e.split(":");
		if (!n || r === void 0) break;
		let i = ji(n.trim());
		t[i] = r.trim();
	}
	return t;
}
var Ni = (e) => e;
function Pi(e, t, n, r) {
	var i = !!(e & 1), a = !!(e & 2), o = i && a, s = !!(e & 4), c = o ? "both" : i ? "in" : "out", l, u = t.inert, d = t.style.overflow, f, p;
	function m() {
		return vt(() => l ??= n()(t, r?.() ?? {}, { direction: c }));
	}
	var h = {
		is_global: s,
		in() {
			t.inert = u, i ? (a || f?.abort(), f = Fi(t, m(), p, 1, () => {
				Ai(t, "introstart");
			}, () => {
				Ai(t, "introend"), f?.abort(), f = l = void 0, t.style.overflow = d;
			})) : (p?.abort(), p?.reset?.());
		},
		out(e) {
			a ? (t.inert = !0, p = Fi(t, m(), f, 0, () => {
				Ai(t, "outrostart");
			}, () => {
				Ai(t, "outroend"), e?.();
			})) : (e?.(), l = void 0);
		},
		stop: () => {
			f?.abort(), p?.abort();
		}
	}, g = K;
	if ((g.nodes.t ??= []).push(h), i && ti) {
		var _ = s;
		if (!_) {
			for (var v = g.parent; v && v.f & 65536;) for (; (v = v.parent) && !(v.f & 16););
			_ = !v || !!(v.f & 32768);
		}
		_ && Fn(() => {
			_r(() => h.in());
		});
	}
}
function Fi(e, t, n, r, i, a) {
	var o = r === 1, s = !1;
	if (d(t)) {
		var c;
		return j(() => {
			s || (c = Fi(e, t({ direction: o ? "in" : "out" }), n, r, i, a));
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
	let { delay: l = 0, css: u, tick: p, easing: m = Ni } = t;
	var h, g = () => 1 - r;
	return j(() => {
		if (!s) {
			var c = [];
			if (o && n === void 0 && (p && p(0, 1), u)) {
				var d = Mi(u(0, 1));
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
						var v = o + s * m(_ / f), y = Mi(u(v, 1 - v));
						l.push(y), d ||= y.overflow === "hidden";
					}
					d && (e.style.overflow = "hidden"), g = () => {
						var e = h.currentTime;
						return o + s * m(e / c);
					}, p && ki(() => {
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
function Ii(e, t, n, r, i, a) {
	let o = T;
	T && k();
	var s = null;
	T && D.nodeType === 1 && (s = D, k());
	var c = T ? D : e, l = new li(c, !1);
	zn(() => {
		let e = t() || null;
		var a = i ? i() : n || e === "svg" ? be : void 0;
		if (e === null) l.ensure(null, null), ni(!0);
		else return l.ensure(e, (t) => {
			if (e) {
				var n = T;
				if (s = T ? s : Cn(e, a), $(s, s), r) {
					var i = null;
					T && Ar(e) && s.append(i = document.createComment(""));
					var o = T ? /* @__PURE__ */ L(s) : s.appendChild(I());
					T && (o === null ? E(!1) : O(o)), r(s, o), i?.remove();
				}
				K.nodes.end = s, n || t.before(s);
			}
			T && O(t);
		}), ni(!0), () => {
			e && ni(!1);
		};
	}, ee), kn(() => {
		ni(!0);
	}), o && (E(!0), O(c));
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/css.js
function Li(e, t) {
	Fn(() => {
		e = K?.parent?.nodes?.start ?? e;
		var n = e.getRootNode(), r = n.host ? n : n.head ?? n.ownerDocument.head;
		if (!r.querySelector("#" + t.hash)) {
			let e = Cn("style");
			e.id = t.hash, e.textContent = t.code, r.appendChild(e);
		}
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/elements/actions.js
function Ri(e, t, n) {
	Fn(() => {
		var r = _r(() => t(e, n?.()) || {});
		if (n && r?.update) {
			var i = !1, a = {};
			Ln(() => {
				var e = n();
				vr(e), i && Me(a, e) && (a = e, r.update(e));
			}), i = !0;
		}
		if (r?.destroy) return () => r.destroy();
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/elements/attachments.js
function zi(e, t) {
	var n = void 0, r;
	Bn(() => {
		n !== (n = t()) && (r &&= (H(r), null), n && (r = V(() => {
			Fn(() => n(e));
		})));
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/clsx/dist/clsx.mjs
function Bi(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") {
		if (Array.isArray(e)) {
			var i = e.length;
			for (t = 0; t < i; t++) e[t] && (n = Bi(e[t])) && (r && (r += " "), r += n);
		} else for (n in e) e[n] && (r && (r += " "), r += n);
	}
	return r;
}
function Vi() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = Bi(e)) && (r && (r += " "), r += t);
	return r;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/shared/attributes.js
function Hi(e) {
	return typeof e == "object" ? Vi(e) : e ?? "";
}
var Ui = [..." 	\n\r\f\xA0\v﻿"];
function Wi(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || Ui.includes(r[o - 1])) && (s === r.length || Ui.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function Gi(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function Ki(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function qi(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\/\*.*?\*\//g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(Ki)), i && c.push(...Object.keys(i).map(Ki));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = Ki(e.substring(l, u).trim());
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
		return r && (n += Gi(r)), i && (n += Gi(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/elements/class.js
function Ji(e, t, n, r, i, a) {
	var o = e[fe];
	if (T || o !== n || o === void 0) {
		var s = Wi(n, r, a);
		T && s === e.getAttribute("class") || (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[fe] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/elements/style.js
function Yi(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function Xi(e, t, n, r) {
	var i = e[pe];
	if (T || i !== t) {
		var a = qi(t, r);
		T && a === e.getAttribute("style") || (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[pe] = t;
	} else r && (Array.isArray(r) ? (Yi(e, n?.[0], r[0]), Yi(e, n?.[1], r[1], "important")) : Yi(e, n, r));
	return r;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function Zi(e, t) {
	t ? e.hasAttribute("selected") || e.setAttribute("selected", "") : e.removeAttribute("selected");
}
function Qi(e, t) {
	var n = !("__defaultValue" in e);
	(n || e.__defaultValue !== t) && (e.__defaultValue = t, $i(e, !n || "__value" in e));
}
function $i(t, n) {
	var r = t.__defaultValue, i = t.multiple, a = i ? r ?? [] : null;
	if (!i || e(a)) {
		var o = t.selectedIndex, s = n && i ? new Set(t.selectedOptions) : null;
		for (var c of t.options) {
			var l = na(c);
			Zi(c, i ? a.includes(l) : dn(l, r));
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
function ea(t, n, r = !1) {
	if (t.multiple) {
		if (n == null) return;
		if (!e(n)) return Te();
		for (var i of t.options) i.selected = n.includes(na(i));
	} else {
		for (i of t.options) if (dn(na(i), n)) {
			i.selected = !0;
			return;
		}
		r && n === void 0 || (t.selectedIndex = -1);
	}
}
function ta(e) {
	var t = new MutationObserver((t) => {
		t.every(ra) || ("__defaultValue" in e && $i(e, !1), "__value" in e && ea(e, e.__value));
	});
	t.observe(e, {
		childList: !0,
		subtree: !0,
		attributes: !0,
		attributeFilter: ["value"]
	}), kn(() => {
		t.disconnect();
	});
}
function na(e) {
	return "__value" in e ? e.__value : e.value;
}
function ra(e) {
	if (e.target.closest("selectedcontent") !== null) return !0;
	if (e.type === "childList") {
		var t = [...e.addedNodes, ...e.removedNodes];
		return t.length > 0 && t.every((e) => e.nodeName === "SELECTEDCONTENT");
	}
	return !1;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/elements/attributes.js
var ia = Symbol("class"), aa = Symbol("style"), oa = Symbol("is custom element"), sa = Symbol("is html"), ca = _e ? "link" : "LINK", la = _e ? "input" : "INPUT", ua = _e ? "option" : "OPTION", da = _e ? "select" : "SELECT", fa = _e ? "progress" : "PROGRESS";
function pa(e) {
	if (T) {
		var t = !1, n = () => {
			if (!t) {
				if (t = !0, e.hasAttribute("value")) {
					var n = e.value;
					ha(e, "value", null), e.value = n;
				}
				if (e.hasAttribute("checked")) {
					var r = e.checked;
					ha(e, "checked", null), e.checked = r;
				}
			}
		};
		e[he] = n, j(n), _t();
	}
}
function ma(e, t) {
	var n = va(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === fa) && (e.value = t ?? "");
}
function ha(e, t, n, r) {
	var i = va(e);
	T && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === ca) || i[t] !== (i[t] = n) && (t === "loading" && (e[le] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && ba(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function ga(e, t, n, r, i = !1, a = !1) {
	T && i && e.nodeName === la && ("defaultValue" in n || "defaultChecked" in n || pa(e));
	var o = va(e), s = o[oa], c = !o[sa];
	let l = T && s;
	l && E(!1);
	var u = t || {}, d = e.nodeName === ua, f = e.nodeName === da;
	try {
		for (var p in t) !(p in n) && p[0] + p[1] !== "$$" && (n[p] = null);
		n.class ? n.class = Hi(n.class) : (r || n[ia]) && (n.class = null), n[aa] && (n.style ??= null);
		var m = ba(e);
		if (e.nodeName === la && "type" in n && ("value" in n || "__value" in n)) {
			var h = n.type;
			(h !== u.type || h === void 0 && e.hasAttribute("type")) && (u.type = h, ha(e, "type", h, a));
		}
		for (let i in n) {
			let l = n[i];
			if (d && i === "value" && l == null) e.value = e.__value = "", u[i] = l;
			else if (i === "class") Ji(e, e.namespaceURI === "http://www.w3.org/1999/xhtml", l, r, t?.[ia], n[ia]), u[i] = l, u[ia] = n[ia];
			else if (i === "style") Xi(e, l, t?.[aa], n[aa]), u[i] = l, u[aa] = n[aa];
			else {
				var g = u[i];
				if (l !== g || l === void 0 && e.hasAttribute(i)) {
					u[i] = l;
					var _ = i[0] + i[1];
					if (_ !== "$$") {
						if (_ === "on") {
							let t = {}, n = "$$" + i, r = i.slice(2);
							var v = Cr(r);
							if (xr(r) && (r = r.slice(0, -7), t.capture = !0), !v && g) {
								if (l != null) continue;
								e.removeEventListener(r, u[n], t), u[n] = null;
							}
							if (v) Rr(r, e, l), zr([r]);
							else if (l != null) {
								function a(e) {
									u[i].call(this, e);
								}
								u[n] = Fr(r, e, a, t);
							}
						} else if (i === "style") ha(e, i, l);
						else if (i === "autofocus") ht(e, !!l);
						else if (!s && (i === "__value" || i === "value" && l != null)) e.__value = l, (g == null || e.value !== l || l === 0 && e.nodeName === fa) && (e.value = l);
						else if (i === "selected" && d) Zi(e, l);
						else {
							var y = i;
							c || (y = Er(y));
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
							} else b || (s || typeof l != "string") && m.has(y) ? (e[y] = l, y in o && (o[y] = w)) : typeof l != "function" && ha(e, y, l, a);
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
function _a(e, t, n = [], r = [], i = [], a, o = !1, s = !1) {
	yt(i, n, r, (n) => {
		var r = void 0, i = {}, c = e.nodeName === da, l = !1;
		if (Bn(() => {
			var u = t(...n.map(Q)), d = ga(e, r, u, a, o, s);
			if (l && c) {
				var f = e;
				"defaultValue" in u && Qi(f, u.defaultValue), "value" in u && ea(f, u.value);
			}
			for (let e of Object.getOwnPropertySymbols(i)) u[e] || H(i[e]);
			for (let t of Object.getOwnPropertySymbols(u)) {
				var p = u[t];
				t.description !== "@attach" || r && p === r[t] || (i[t] && H(i[t]), i[t] = V(() => zi(e, () => p))), d[t] = p;
			}
			r = d;
		}), c) {
			var u = e;
			Fn(() => {
				var e = r;
				"defaultValue" in e && Qi(u, e.defaultValue), ea(u, e.value, !0), ta(u);
			});
		}
		l = !0;
	});
}
function va(e) {
	return e[de] ??= {
		[oa]: e.nodeName.includes("-"),
		[sa]: e.namespaceURI === ye
	};
}
var ya = /* @__PURE__ */ new Map();
function ba(e) {
	var t = e.getAttribute("is") || e.nodeName, n = ya.get(t);
	if (n) return n;
	ya.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var s in r = o(i), r) r[s].set && s !== "innerHTML" && s !== "textContent" && s !== "innerText" && n.add(s);
		i = l(i);
	}
	return n;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function xa(e, t) {
	return e === t || e?.[oe] === t;
}
function Sa(e = st(), t, n, r) {
	var i = A.r, a = K;
	return Fn(() => {
		var o, s;
		return Ln(() => {
			o = s, s = r?.() || [], _r(() => {
				xa(n(...s), e) || (t(e, ...s), o && xa(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && xa(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/store/utils.js
function Ca(e, t, n) {
	if (e == null) return t(void 0), n && n(void 0), f;
	let r = _r(() => e.subscribe(t, n));
	return r.unsubscribe ? () => r.unsubscribe() : r;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/store/shared/index.js
var wa = [];
function Ta(e, t) {
	return { subscribe: Ea(e, t).subscribe };
}
function Ea(e, t = f) {
	let n = null, r = /* @__PURE__ */ new Set();
	function i(t) {
		if (Me(e, t) && (e = t, n)) {
			let t = !wa.length;
			for (let t of r) t[1](), wa.push(t, e);
			if (t) {
				for (let e = 0; e < wa.length; e += 2) wa[e][0](wa[e + 1]);
				wa.length = 0;
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
function Da(e, t, n) {
	let r = !Array.isArray(e), i = r ? [e] : e;
	if (!i.every(Boolean)) throw Error("derived() expects stores as input, got a falsy value");
	let a = t.length < 2;
	return Ta(n, (e, n) => {
		let o = !1, s = [], c = 0, l = f, u = () => {
			if (c) return;
			l();
			let i = t(r ? s[0] : s, e, n);
			a ? e(i) : l = typeof i == "function" ? i : f;
		}, d = i.map((e, t) => Ca(e, (e) => {
			s[t] = e, c &= ~(1 << t), o && u();
		}, () => {
			c |= 1 << t;
		}));
		return o = !0, u(), function() {
			p(d), l(), o = !1;
		};
	});
}
function Oa(e) {
	let t;
	return Ca(e, (e) => t = e)(), t;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/reactivity/store.js
var ka = !1, Aa = Symbol("unmounted");
function ja(e, t, n) {
	let r = n[t] ??= {
		store: null,
		source: /* @__PURE__ */ en(void 0),
		unsubscribe: f
	};
	if (r.store !== e && !(Aa in n)) {
		if (r.unsubscribe(), r.store = e ?? null, e == null) r.source.v = void 0, r.unsubscribe = f;
		else {
			var i = !0;
			r.unsubscribe = Ca(e, (e) => {
				i ? r.source.v = e : tn(r.source, e);
			}), i = !1;
		}
	}
	return e && Aa in n ? Oa(e) : Q(r.source);
}
function Ma() {
	let e = {};
	function t() {
		kn(() => {
			for (var t in e) e[t].unsubscribe();
			i(e, Aa, {
				enumerable: !1,
				value: !0
			});
		});
	}
	return [e, t];
}
function Na(e) {
	var t = ka;
	try {
		return ka = !1, [e(), ka];
	} finally {
		ka = t;
	}
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/reactivity/props.js
var Pa = {
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
function Fa(e, t, n) {
	return new Proxy({
		props: e,
		exclude: t
	}, Pa);
}
var Ia = {
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
		if (t === oe || t === ce) return !1;
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
function La(...e) {
	return new Proxy({ props: e }, Ia);
}
function Ra(e, t, n, r) {
	var i = !0, o = !!(n & 8), s = !!(n & 16), c = r, l = !0, u = void 0, d = () => s && i ? (u ??= /* @__PURE__ */ Ct(r), Q(u)) : (l && (l = !1, c = s ? _r(r) : r), c);
	let f;
	if (o) {
		var p = oe in e || ce in e;
		f = a(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	o ? [m, h] = Na(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && Ve(t), f(m)));
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
	var v = !1, y = (n & 1 ? Ct : Dt)(() => (v = !1, g()));
	o && Q(y);
	var b = K;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? Q(y) : i && o ? ln(e) : e;
			return tn(y, n), v = !0, c !== void 0 && (c = n), e;
		}
		return Qn && v || b.f & 16384 ? y.v : Q(y);
	});
}
function za(e) {
	A === null && Pe("onMount"), An(() => {
		let t = _r(e);
		if (typeof t == "function") return t;
	});
}
function Ba(e) {
	A === null && Pe("onDestroy"), za(() => () => _r(e));
}
export { Mn as $, ui as A, zr as B, Pi as C, _i as D, Ci as E, Yr as F, br as G, Lr as H, Jr as I, _r as J, Q as K, Kr as L, ri as M, ci as N, pi as O, Zr as P, An as Q, Xr as R, Ii as S, wi as T, Ir as U, Rr as V, Pr as W, Nn as X, ir as Y, Rn as Z, Ji as _, Ye as _t, La as a, sn as at, Ri as b, De as bt, Da as c, $t as ct, Sa as d, tt as dt, _n as et, _a as f, rt as ft, Xi as g, Ze as gt, ma as h, nt as ht, Fa as i, ln as it, ii as j, fi as k, Ta as l, Et as lt, ha as m, at as mt, za as n, yn as nt, Ma as o, tn as ot, pa as p, ot as pt, mr as q, Ra as r, bn as rt, ja as s, Qt as st, Ba as t, vn as tt, Ea as u, it as ut, Hi as v, qe as vt, Ti as w, Li as x, f as xt, Vi as y, Oe as yt, qr as z };
