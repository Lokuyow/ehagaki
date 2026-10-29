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
var g = 1 << 24, _ = 1024, v = 2048, y = 4096, b = 8192, x = 16384, S = 32768, ee = 1 << 25, C = 65536, te = 1 << 19, ne = 1 << 20, re = 1 << 25, ie = 1 << 21, ae = 1 << 22, oe = 1 << 23, w = Symbol("$state"), se = Symbol("component"), ce = Symbol("legacy props"), le = Symbol(""), ue = Symbol("proxy path"), de = Symbol("attributes"), fe = Symbol("class"), pe = Symbol("style"), me = Symbol("text"), he = Symbol("form reset"), ge = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), _e = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml"), ve = {}, T = Symbol("uninitialized"), ye = "http://www.w3.org/1999/xhtml", be = "http://www.w3.org/2000/svg", xe = "http://www.w3.org/1998/Math/MathML", Se = "@attach";
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
var E = !1;
function D(e) {
	E = e;
}
var O;
function k(e) {
	if (e === null) throw we(), ve;
	return O = e;
}
function A() {
	return k(/* @__PURE__ */ z(O));
}
function De(e) {
	if (E) {
		if (/* @__PURE__ */ z(O) !== null) throw we(), ve;
		O = e;
	}
}
function Oe(e = 1) {
	if (E) {
		for (var t = e, n = O; t--;) n = /* @__PURE__ */ z(n);
		O = n;
	}
}
function ke(e = !0) {
	for (var t = 0, n = O;;) {
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
var j = null;
function et(e) {
	j = e;
}
function tt(e) {
	return $e(j, "getContext").get(e);
}
function nt(e, t) {
	return $e(j, "setContext").set(e, t), t;
}
function rt(e) {
	return $e(j, "hasContext").has(e);
}
function it() {
	return $e(j, "getAllContexts");
}
function at(e, t = !1, n) {
	j = {
		p: j,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: q,
		l: null
	};
}
function ot(e) {
	var t = j, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) Nn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, j = t.p, st(e);
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
function M(e) {
	if (lt.length === 0 && !Lt) {
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
var ft = ~(v | y | _);
function N(e, t) {
	e.f = e.f & ft | t;
}
function pt(e) {
	e.f & 512 || e.deps === null ? N(e, _) : N(e, y);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/reactivity/utils.js
function mt(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), N(e, _);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/elements/misc.js
function ht(e, t) {
	if (t) {
		let t = document.body;
		e.autofocus = !0, M(() => {
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
	var t = W, n = q;
	K(null), nr(null);
	try {
		return e();
	} finally {
		K(t), nr(n);
	}
}
function yt(e, t, n, r = n) {
	e.addEventListener(t, () => vt(n));
	let i = e[he];
	e[he] = i ? () => {
		i(), r(!0);
	} : () => r(!0), _t();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/reactivity/async.js
function bt(e, t, n, r) {
	let i = ct() ? wt : Ot;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = q, c = xt(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				B(e, s);
			}
			St();
		}
	}
	var d = Ct();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ Et(e))).then(u).catch((e) => B(e, s)).finally(d);
	}
	l ? l.then(() => {
		s.f & 16384 ? d() : (c(), f(), St());
	}) : f();
}
function xt() {
	var e = q, t = W, n = j, r = P;
	return function(i = !0) {
		nr(e), K(t), et(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function St(e = !0) {
	nr(null), K(null), et(null), e && P?.deactivate();
}
function Ct() {
	var e = q, t = e.b, n = P, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function wt(e) {
	var t = 2 | v;
	return q !== null && (q.f |= te), {
		ctx: j,
		deps: null,
		effects: null,
		equals: je,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: T,
		wv: 0,
		parent: q,
		ac: null
	};
}
var Tt = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function Et(e, t, n) {
	let r = q;
	r === null && Fe();
	var i = void 0, a = en(T), o = !W, s = /* @__PURE__ */ new Set();
	return Rn(() => {
		var t = q, n = m();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== ge && n.reject(e);
			}).finally(St);
		} catch (e) {
			n.reject(e), St();
		}
		var c = P;
		if (o) {
			if (t.f & 32768) var l = Ct();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(Tt);
			else for (let e of s.values()) e.reject(Tt);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== Tt && (c.activate(), t ? (a.f |= oe, on(a, t)) : (a.f & 8388608 && (a.f ^= oe), on(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), jn(() => {
		for (let e of s) e.reject(Tt);
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
function Dt(e) {
	let t = /* @__PURE__ */ wt(e);
	return ir(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function Ot(e) {
	let t = /* @__PURE__ */ wt(e);
	return t.equals = Ne, t;
}
function kt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) U(t[n]);
	}
}
function At(e) {
	var t, n = q, r = e.parent;
	if (!er && r !== null && e.v !== T && r.f & 24576) return Ce(), e.v;
	nr(r);
	try {
		kt(e), t = pr(e);
	} finally {
		nr(n);
	}
	return t;
}
function jt(e) {
	var t = At(e);
	!e.equals(t) && (e.wv = ur(), (!P?.is_fork || e.deps === null) && (P === null ? e.v = t : (P.capture(e, t, !0), Ft?.capture(e, t, !0)), e.deps === null)) ? N(e, _) : er || (F === null ? pt(e) : (An() || P?.is_fork) && F.set(e, t));
}
function Mt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && vt(() => {
		t.ac.abort(ge), t.ac = null;
	}), t.fn !== null && (t.teardown = f), gr(t, 0), Wn(t));
}
function Nt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && _r(t);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/reactivity/batch.js
var Pt = null, P = null, Ft = null, F = null, It = null, Lt = !1, Rt = !1, zt = null, Bt = null, Vt = 0, Ht = 1, Ut = class e {
	id = Ht++;
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
		Pt === null ? Pt = this : (Pt.#n = this, this.#t = Pt), Pt = this;
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
			for (var r of n.d) N(r, v), t(r);
			for (r of n.m) N(r, y), t(r);
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
		for (let e of this.#u) this.#d.delete(e), N(e, v), this.schedule(e);
		for (let e of this.#d) N(e, y), this.schedule(e);
		this.apply();
		for (var t = zt = [], n = [], r = Bt = []; this.#c.length > 0;) {
			Vt++ > 1e3 && (this.#S(), Gt());
			for (let e of this.#g()) try {
				this.#v(e, t, n);
			} catch (t) {
				throw Xt(e), this.#h() || this.discard(), t;
			}
		}
		if (P = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (zt = null, Bt = null, this.#h()) {
			this.#x(n), this.#x(t);
			for (let [e, t] of this.#f) Yt(e, t);
			r.length > 0 && P.#_();
			return;
		}
		let a = this.#y();
		if (a) this.#x(n), this.#x(t), a.#b(this);
		else {
			this.#u.clear(), this.#d.clear();
			for (let e of this.#r) e(this);
			this.#r.clear(), Ft = this, qt(n), qt(t), Ft = null, this.#s?.resolve();
			var o = P;
			if (this.#a === 0 && (this.#c.length === 0 || o !== null) && this.#S(), this.#c.length > 0) {
				if (o !== null) {
					for (let e of this.#c) o.#c.push(e);
					this.#c = [];
				} else o = this;
			}
			o !== null && (Qt.clear(), o.#_());
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), N(i, v), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#S(), P = this, this.#_();
	}
	#x(e) {
		for (var t = 0; t < e.length; t += 1) mt(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== T && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), F?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		P = this;
	}
	deactivate() {
		P = null, F = null;
	}
	flush() {
		try {
			Rt = !0, P = this, this.#_();
		} finally {
			Vt = 0, It = null, zt = null, Bt = null, Rt = !1, P = null, F = null, Qt.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(Tt);
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
		this.#m || (this.#m = !0, M(() => {
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
		if (P === null) {
			let t = P = new e();
			!Rt && !Lt && M(() => {
				t.#e || t.flush();
			});
		}
		return P;
	}
	apply() {
		F = null;
	}
	schedule(e) {
		It = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768) ? e.b.defer_effect(e) : this.#c.push(e);
	}
	#S() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? Pt = e : t.#t = e, this.linked = !1;
		}
	}
};
function Wt(e) {
	var t = Lt, n = Ft;
	Ft = null, Lt = !0;
	try {
		var r;
		for (e && (Wt(), r = e());;) {
			if (dt(), P === null) return r;
			P.flush();
		}
	} finally {
		Lt = t, Ft = n;
	}
}
function Gt() {
	try {
		Be();
	} catch (e) {
		B(e, It);
	}
}
var Kt = null;
function qt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && dr(r) && (Kt = /* @__PURE__ */ new Set(), _r(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && qn(r), Kt?.size > 0)) {
				Qt.clear();
				for (let e of Kt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Kt.has(n) && (Kt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || _r(n);
					}
				}
				Kt.clear();
			}
		}
		Kt = null;
	}
}
function Jt(e) {
	P.schedule(e);
}
function Yt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), N(e, _);
		for (var n = e.first; n !== null;) Yt(n, t), n = n.next;
	}
}
function Xt(e) {
	N(e, _);
	for (var t = e.first; t !== null;) Xt(t), t = t.next;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/reactivity/sources.js
var Zt = /* @__PURE__ */ new Set(), Qt = /* @__PURE__ */ new Map(), $t = !1;
function en(e, t) {
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
function tn(e, t) {
	let n = en(e, t);
	return ir(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function nn(e, t = !1, n = !0) {
	let r = en(e);
	return t || (r.equals = Ne), r;
}
function I(e, t, n = !1) {
	return W !== null && (!G || W.f & 131072) && ct() && W.f & 4325394 && (rr === null || !rr.has(e)) && We(), on(e, n ? dn(t) : t, Bt);
}
var rn = null, an = 0;
function on(e, t, n = null) {
	if (!e.equals(t)) {
		er ? Qt.set(e, t) : Qt.has(e) || Qt.set(e, e.v);
		var r = Ut.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && At(t), F === null && pt(t);
		}
		e.wv = ur(), rn = null, an = 0, un(e, v, n), rn = null, ct() && q !== null && q.f & 1024 && !(q.f & 96) && (X === null ? ar([e]) : X.push(e)), !r.is_fork && Zt.size > 0 && !$t && sn();
	}
	return t;
}
function sn() {
	$t = !1;
	for (let e of Zt) {
		e.f & 1024 && N(e, y);
		let t;
		try {
			t = dr(e);
		} catch {
			t = !0;
		}
		t && _r(e);
	}
	Zt.clear();
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
		var i = ct(), a = r.length;
		if (an += a, an > 1e5 && rn === null && (rn = /* @__PURE__ */ new Set()), rn !== null) {
			if (rn.has(e)) return;
			rn.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== q) {
				var l = (c & v) === 0;
				if (l && N(s, t), c & 131072) Zt.add(s);
				else if (c & 2) {
					var u = s;
					F?.delete(u), un(u, y, n);
				} else if (l) {
					var d = s;
					c & 16 && Kt !== null && Kt.add(d), n === null ? Jt(d) : n.push(d);
				}
			}
		}
	}
}
function dn(t) {
	if (typeof t != "object" || !t || w in t || se in t) return t;
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
			"value" in n && n.configurable !== !1 && n.enumerable !== !1 && n.writable !== !1 || He();
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
					let e = f(() => /* @__PURE__ */ tn(T, u));
					r.set(t, e), ln(o);
				}
			} else I(n, T), ln(o);
			return !0;
		},
		get(e, n, i) {
			if (n === w) return t;
			var o = r.get(n), s = n in e;
			if (o === void 0 && (!s || a(e, n)?.writable) && (o = f(() => /* @__PURE__ */ tn(dn(s ? e[n] : T), u)), r.set(n, o)), o !== void 0) {
				var c = Z(o);
				return c === T ? void 0 : c;
			}
			return Reflect.get(e, n, i);
		},
		getOwnPropertyDescriptor(e, t) {
			this.has?.(e, t);
			var n = Reflect.getOwnPropertyDescriptor(e, t), i = r.get(t);
			if (i !== void 0) {
				var a = Z(i);
				if (a === T) return;
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
			if (t === w) return !0;
			var n = r.get(t), i = n !== void 0 && n.v !== T || Reflect.has(e, t);
			return (n !== void 0 || q !== null && (!i || a(e, t)?.writable)) && (n === void 0 && (n = f(() => /* @__PURE__ */ tn(i ? dn(e[t]) : T, u)), r.set(t, n)), Z(n) === T) ? !1 : i;
		},
		set(e, t, n, s) {
			var c = r.get(t), l = t in e;
			if (i && t === "length") for (var d = n; d < c.v; d += 1) {
				var p = r.get(d + "");
				p === void 0 ? d in e && (p = f(() => /* @__PURE__ */ tn(T, u)), r.set(d + "", p)) : I(p, T);
			}
			if (c === void 0) (!l || a(e, t)?.writable) && (c = f(() => /* @__PURE__ */ tn(void 0, u)), I(c, dn(n)), r.set(t, c));
			else {
				l = c.v !== T;
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
				return t === void 0 || t.v !== T;
			});
			for (var [n, i] of r) i.v !== T && !(n in e) && t.push(n);
			return t;
		},
		setPrototypeOf() {
			Ue();
		}
	});
}
function fn(e) {
	try {
		if (typeof e == "object" && e && w in e) return e[w];
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
		gn = a(t, "firstChild").get, _n = a(t, "nextSibling").get, u(e) && (e[fe] = void 0, e[de] = null, e[pe] = void 0, e.__e = void 0), u(n) && (n[me] = void 0);
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
	if (!E) return /* @__PURE__ */ R(e);
	var n = /* @__PURE__ */ R(O);
	if (n === null) n = O.appendChild(L());
	else if (t && n.nodeType !== 3) {
		var r = L();
		return n?.before(r), k(r), r;
	}
	return t && En(n), k(n), n;
}
function bn(e, t = !1) {
	if (!E) {
		var n = /* @__PURE__ */ R(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ z(n) : n;
	}
	if (t) {
		if (O?.nodeType !== 3) {
			var r = L();
			return O?.before(r), k(r), r;
		}
		En(O);
	}
	return O;
}
function xn(e, t = !1) {
	if (!E) return /* @__PURE__ */ R(e);
	var n = yn(e, t);
	return De(e), n;
}
function Sn(e, t = 1, n = !1) {
	let r = E ? O : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ z(r);
	if (!E) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = L();
			return r === null ? i?.after(a) : r.before(a), k(a), a;
		}
		En(r);
	}
	return k(r), r;
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
function On(e) {
	q === null && (W === null && ze(e), Re()), er && Le(e);
}
function kn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function V(e, t) {
	var n = q;
	n !== null && n.f & 8192 && (e |= b);
	var r = {
		ctx: j,
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
	P?.register_created_effect(r);
	var i = r;
	if (e & 4) zt === null ? Ut.ensure().schedule(r) : zt.push(r);
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
	return N(t, _), t.teardown = e, t;
}
function Mn(e) {
	On("$effect");
	var t = q.f;
	if (!W && t & 32 && j !== null && !j.i) {
		var n = j;
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
	Ut.ensure();
	let t = V(64 | te, e);
	return () => {
		U(t);
	};
}
function In(e) {
	Ut.ensure();
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
	bt(r, t, n, (t) => {
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
		e !== null && vt(() => {
			e.abort(ge);
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
		e.f ^= b, e.f & 1024 || (N(e, v), Ut.ensure().schedule(e));
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
			if (dr(a) && jt(a), a.wv > e.wv) return !0;
		}
		t & 512 && F === null && N(e, _);
	}
	return !1;
}
function fr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(rr !== null && rr.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? fr(a, t, !1) : t === a && (n ? N(a, v) : a.f & 1024 && N(a, y), Jt(a));
	}
}
function pr(e) {
	var t = J, n = Y, r = X, i = W, a = rr, o = j, s = G, c = cr, l = e.f;
	J = null, Y = 0, X = null, W = l & 96 ? null : e, rr = null, et(e.ctx), G = !1, cr = ++sr, e.ac !== null && (vt(() => {
		e.ac.abort(ge);
	}), e.ac = null);
	try {
		e.f |= ie;
		var u = e.fn, d = u();
		e.f |= S;
		var f = mr(e);
		if (ct() && X !== null && !G && f !== null && !(e.f & 6146)) for (var p = 0; p < X.length; p++) fr(X[p], e);
		if (i !== null && i !== e) {
			if (sr++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = sr;
			if (t !== null) for (let e of t) e.rv = sr;
			X !== null && (r === null ? r = X : r.push(...X));
		}
		return e.f & 8388608 && (e.f ^= oe), d;
	} catch (t) {
		return mr(e), Dn(t);
	} finally {
		e.f ^= ie, J = t, Y = n, X = r, W = i, rr = a, et(o), G = s, cr = c;
	}
}
function mr(e) {
	var t = e.deps, n = P?.is_fork;
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
		s.f & 512 && (s.f ^= 512), s.v !== T && pt(s), s.ac !== null && vt(() => {
			s.ac.abort(ge), s.ac = null, N(s, v);
		}), Mt(s), gr(s, 0);
	}
}
function gr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) hr(e, n[r]);
}
function _r(e) {
	var t = e.f;
	if (!(t & 16384)) {
		N(e, _);
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
	await Promise.resolve(), Wt();
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
	if (er && Qt.has(e)) return Qt.get(e);
	if (t) {
		var a = e;
		if (er) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || br(a)) && (o = At(a)), Qt.set(a, o), o;
		}
		var s = !(a.f & 512) && !G && W !== null && !!(W.f & 512), c = (a.f & S) === 0;
		dr(a) && (s && (a.f |= 512), jt(a)), s && !c && (Nt(a), yr(a));
	}
	if (F?.has(e)) return F.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function yr(e) {
	if (e.f |= 512, e.deps !== null) for (let r of e.deps) {
		var t = r.reactions;
		t === null ? r.reactions = [e] : n.call(t, e) || t.push(e), r.f & 2 && !(r.f & 512) && (Nt(r), yr(r));
	}
}
function br(e) {
	if (e.v === T) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Qt.has(t) || t.f & 2 && br(t)) return !0;
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
		if (w in e) Sr(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && w in n && Sr(n);
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
	return Symbol(Se);
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
	if (!E) return;
	e.removeAttribute("onload"), e.removeAttribute("onerror");
	let t = e.__e;
	t !== void 0 && (e.__e = void 0, queueMicrotask(() => {
		e.isConnected && e.dispatchEvent(t);
	}));
}
function Rr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Gr.call(t, e), !e.cancelBubble) return vt(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? (i.__removed = !1, M(() => {
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
		if (E) return $(O, null), O;
		i === void 0 && (i = Jr(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ R(i)));
		var t = r || hn ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ R(t), s = t.lastChild;
			$(o, s);
		} else $(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Xr(e, t, n = "svg") {
	var r = !e.startsWith("<!>"), i = !!(t & 1), a = `<${n}>${r ? e : "<!>" + e}</${n}>`, o;
	return () => {
		if (E) return $(O, null), O;
		if (!o) {
			var e = /* @__PURE__ */ R(Jr(a));
			if (i) for (o = document.createDocumentFragment(); /* @__PURE__ */ R(e);) o.appendChild(/* @__PURE__ */ R(e));
			else o = /* @__PURE__ */ R(e);
		}
		var t = o.cloneNode(!0);
		if (i) {
			var n = /* @__PURE__ */ R(t), r = t.lastChild;
			$(n, r);
		} else $(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Zr(e, t) {
	return /* @__PURE__ */ Xr(e, t, "svg");
}
function Qr(e = "") {
	if (!E) {
		var t = L(e + "");
		return $(t, t), t;
	}
	var n = O;
	return n.nodeType === 3 ? En(n) : (n.before(n = L()), k(n)), $(n, n), n;
}
function $r() {
	if (E) return $(O, null), O;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = L();
	return e.append(t, n), $(t, n), e;
}
function ei(e, t) {
	if (E) {
		var n = q;
		n.f & 32768 && n.nodes.end !== null || (n.nodes.end = O), A();
	} else e !== null && e.before(t);
}
function ti() {
	if (E && O && O.nodeType === 8 && O.textContent?.startsWith("$")) {
		let e = O.textContent.substring(1);
		return A(), e;
	}
	return (window.__svelte ??= {}).uid ??= 1, `c${window.__svelte.uid++}`;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/reactivity/create-subscriber.js
function ni(e) {
	let t = 0, n = en(0), r;
	return () => {
		An() && (Z(n), zn(() => (t === 0 && (r = Q(() => e(() => ln(n)))), t += 1, () => {
			M(() => {
				--t, t === 0 && (r?.(), r = void 0, ln(n));
			});
		})));
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var ri = C | te;
function ii(e, t, n, r) {
	new ai(e, t, n, r);
}
var ai = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = E ? O : null;
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
	#h = ni(() => (this.#m = en(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = q;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = q.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = Vn(() => {
			if (E) {
				let e = Ae(this.#t);
				A();
				let t = e === "[!";
				if (e.startsWith("[?")) {
					let t = JSON.parse(e.slice(2));
					this.#_(t);
				} else t ? this.#b() : this.#g();
			} else this.#x();
		}, ri), E && (this.#e = O);
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
		M(r), t && (this.#s = H(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			this.#y() || (t ? Ee() : (t = !0, n && Ge(), this.#s !== null && Jn(this.#s, () => {
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
		e && (this.is_pending = !0, this.#o = H(() => e(this.#e)), M(() => {
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
				}), this.#a === null ? (this.#c = null, n && this.#S(P)) : this.#u === 0 && (this.#e.before(e), this.#c = null, Jn(this.#o, () => {
					this.#o = null;
				}), this.#S(P));
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
			} else this.#S(P);
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
		var t = q, n = W, r = j;
		nr(this.#i), K(this.#i), et(this.#i.ctx);
		try {
			return Ut.ensure(), e();
		} finally {
			nr(t), K(n), et(r);
		}
	}
	#w(e, t) {
		this.has_pending_snippet() ? (this.#u += e, this.#u === 0 && (this.#S(t), this.#o && Jn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null))) : this.parent && this.parent.#w(e, t);
	}
	update_pending_count(e, t) {
		this.#w(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, M(() => {
			this.#d = !1, this.#m && on(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), Z(this.#m);
	}
	error(e) {
		if (e === ve || !this.#n.onerror && !this.#n.failed) throw e;
		P?.is_fork ? (this.#a && P.skip_effect(this.#a), this.#o && P.skip_effect(this.#o), this.#s && P.skip_effect(this.#s), P.oncommit(() => {
			this.#y() || this.#T(e);
		})) : this.#T(e);
	}
	#T(e) {
		this.#a &&= (U(this.#a), null), this.#o &&= (U(this.#o), null), this.#s &&= (U(this.#s), null), E && (k(this.#t), Oe(), k(ke()));
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
		M(() => {
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
}, oi = !0;
function si(e) {
	oi = e;
}
function ci(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[me] ??= e.nodeValue) && (e[me] = n, e.nodeValue = `${n}`);
}
function li(e, t) {
	return di(e, t);
}
var ui = /* @__PURE__ */ new Map();
function di(e, { target: t, anchor: n, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	vn();
	var l = void 0, u = In(() => {
		var u = n ?? t.appendChild(L());
		ii(u, { pending: () => {} }, (t) => {
			at({});
			var n = j;
			if (o && (n.c = o), a && (i.$$events = a), E && $(t, null), oi = s, l = e(t, i) || st(), oi = !0, E && (q.nodes.end = O, O === null || O.nodeType !== 8 || O.data !== "]")) throw we(), ve;
			ot();
		}, c);
		var d = /* @__PURE__ */ new Set(), f = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!d.has(r)) {
					d.add(r);
					var i = jr(r);
					for (let e of [t, document]) {
						var a = ui.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), ui.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Gr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(r(Fr)), Ir.add(f), () => {
			for (var e of d) for (let n of [t, document]) {
				var r = ui.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, Gr), r.delete(e), r.size === 0 && ui.delete(n)) : r.set(e, i);
			}
			Ir.delete(f), u !== n && u.parentNode?.removeChild(u);
		};
	});
	return fi.set(l, u), l;
}
var fi = /* @__PURE__ */ new WeakMap();
function pi(e, t) {
	let n = fi.get(e);
	return n ? (fi.delete(e), n(t)) : Promise.resolve();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/blocks/branches.js
var mi = class {
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
		var n = P, r = wn();
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
		} else E && (this.anchor = O), this.#a(n);
	}
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/blocks/if.js
function hi(e, t, n = !1) {
	var r;
	E && (r = O, A());
	var i = new mi(e), a = n ? C : 0;
	function o(e, t) {
		if (E) {
			var n = Ae(r);
			if (e !== parseInt(n.substring(1))) {
				var a = ke();
				k(a), i.anchor = a, D(!1), i.ensure(e, t), D(!0);
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
var gi = Symbol("NaN");
function _i(e, t, n) {
	E && A();
	var r = new mi(e), i = !ct();
	Vn(() => {
		var e = t();
		e !== e && (e = gi), i && typeof e == "object" && e && (e = {}), r.ensure(e, n);
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/blocks/each.js
function vi(e, t) {
	return t;
}
function yi(e, t, n) {
	for (var i = [], a = t.length, o, s = t.length, c = 0; c < a; c++) {
		let n = t[c];
		Jn(n, () => {
			if (o) {
				if (o.pending.delete(n), o.done.add(n), o.pending.size === 0) {
					var t = e.outrogroups;
					bi(e, r(o.done)), t.delete(o), t.size === 0 && (e.outrogroups = null);
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
		bi(e, t, !l);
	} else o = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(o);
}
function bi(e, t, n = !0) {
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
var xi;
function Si(t, n, i, a, o, s = null) {
	var c = t, l = /* @__PURE__ */ new Map();
	if (n & 4) {
		var u = t;
		c = E ? k(/* @__PURE__ */ R(u)) : u.appendChild(L());
	}
	E && A();
	var d = null, f = /* @__PURE__ */ Ot(() => {
		var t = i();
		return e(t) ? t : t == null ? [] : r(t);
	}), p = /* @__PURE__ */ new Map(), m = !0;
	function h(e) {
		if (!(_.effect.f & 16384)) {
			_.pending.delete(e);
			var t = Z(f);
			_.fallback = d, wi(_, t, c, n, a), d !== null && (t.length === 0 ? d.f & 33554432 ? (d.f ^= re, Ei(d, null, c)) : Xn(d) : Jn(d, () => {
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
			E && Ae(c) === "[!" != (t === 0) && (c = ke(), k(c), D(!1), r = !0);
			for (var u = /* @__PURE__ */ new Set(), _ = P, v = wn(), y = 0; y < t; y += 1) {
				E && O.nodeType === 8 && O.data === "]" && (c = O, r = !0, D(!1));
				var b = e[y], x = a(b, y), S = m ? null : l.get(x);
				S ? (S.v && on(S.v, b), S.i && on(S.i, y), v && _.unskip_effect(S.e)) : (S = Ti(l, m ? c : xi ??= L(), b, x, y, o, n, i), m || (S.e.f |= re), l.set(x, S)), u.add(x);
			}
			if (t === 0 && s && !d && (m ? d = H(() => s(c)) : (d = H(() => s(xi ??= L())), d.f |= re)), t > u.size && Ie("", "", ""), E && t > 0 && k(ke()), !m) {
				if (p.set(_, u), v) {
					for (let [e, t] of l) u.has(e) || _.skip_effect(t.e);
					_.oncommit(h), _.ondiscard(g);
				} else h(_);
			}
			r && D(!0), Z(f);
		}),
		flags: n,
		items: l,
		pending: p,
		outrogroups: null,
		fallback: d
	};
	m = !1, E && (c = O);
}
function Ci(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function wi(e, t, n, i, a) {
	var o = !!(i & 8), s = t.length, c = e.items, l = Ci(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (o) for (v = 0; v < s; v += 1) h = t[v], g = a(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < s; v += 1) {
		if (h = t[v], g = a(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Xn(_), o && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= re, _ === l) Ei(_, null, n);
			else {
				var y = d ? d.next : l;
				_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), Di(e, d, _), Di(e, _, y), Ei(_, y, n), d = _, p = [], m = [], l = Ci(d.next);
				continue;
			}
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], ee = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) Ei(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					Di(e, S.prev, ee.next), Di(e, d, S), Di(e, ee, b), l = b, d = ee, --v, p = [], m = [];
				} else u.delete(_), Ei(_, l, n), Di(e, _.prev, _.next), Di(e, _, d === null ? e.effect.first : d.next), Di(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = Ci(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = Ci(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (bi(e, r(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var C = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || C.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && C.push(l), l = Ci(l.next);
		var te = C.length;
		if (te > 0) {
			var ne = i & 4 && s === 0 ? n : null;
			if (o) {
				for (v = 0; v < te; v += 1) C[v].nodes?.a?.measure();
				for (v = 0; v < te; v += 1) C[v].nodes?.a?.fix();
			}
			yi(e, C, ne);
		}
	}
	o && M(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Ti(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? en(n) : /* @__PURE__ */ nn(n, !1, !1) : null, l = o & 2 ? en(i) : null;
	return {
		v: c,
		i: l,
		e: H(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Ei(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ z(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Di(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
function Oi(e, t, n = !1, r = !1, i = !1, a = !1) {
	var o = e, s = "";
	if (n) {
		var c = e;
		E && (o = k(/* @__PURE__ */ R(c)));
	}
	Bn(() => {
		var e = q;
		if (s === (s = t() ?? "")) E && A();
		else if (n && !E) e.nodes = null, c.innerHTML = s, s !== "" && $(/* @__PURE__ */ R(c), c.lastChild);
		else if (e.nodes !== null && (Kn(e.nodes.start, e.nodes.end), e.nodes = null), s !== "") {
			if (E) {
				for (var a = O.data, l = A(), u = l; l !== null && (l.nodeType !== 8 || l.data !== "");) u = l, l = /* @__PURE__ */ z(l);
				if (l === null) throw we(), ve;
				$(O, u), o = k(l);
			} else {
				var d = Tn(r ? "svg" : i ? "math" : "template", r ? be : i ? xe : void 0);
				d.innerHTML = s;
				var f = r || i ? d : d.content;
				if ($(/* @__PURE__ */ R(f), f.lastChild), r || i) for (; /* @__PURE__ */ R(f);) o.before(/* @__PURE__ */ R(f));
				else o.before(f);
			}
		}
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/blocks/snippet.js
function ki(e, t, ...n) {
	var r = new mi(e);
	Vn(() => {
		let e = t() ?? null;
		r.ensure(e, e && ((t) => e(t, ...n)));
	}, C);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/blocks/svelte-component.js
function Ai(e, t, n) {
	var r;
	E && (r = O, A());
	var i = new mi(e);
	Vn(() => {
		var e = t() ?? null;
		if (E && Ae(r) === "[" != (e !== null)) {
			var a = ke();
			k(a), i.anchor = a, D(!1), i.ensure(e, e && ((t) => n(t, e))), D(!0);
		} else i.ensure(e, e && ((t) => n(t, e)));
	}, C);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/timing.js
var ji = () => performance.now(), Mi = {
	tick: (e) => requestAnimationFrame(e),
	now: () => ji(),
	tasks: /* @__PURE__ */ new Set()
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/loop.js
function Ni() {
	let e = Mi.now();
	Mi.tasks.forEach((t) => {
		t.c(e) || (Mi.tasks.delete(t), t.f());
	}), Mi.tasks.size !== 0 && Mi.tick(Ni);
}
function Pi(e) {
	let t;
	return Mi.tasks.size === 0 && Mi.tick(Ni), {
		promise: new Promise((n) => {
			Mi.tasks.add(t = {
				c: e,
				f: n
			});
		}),
		abort() {
			Mi.tasks.delete(t);
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/elements/transitions.js
function Fi(e, t) {
	vt(() => {
		e.dispatchEvent(new CustomEvent(t));
	});
}
function Ii(e) {
	if (e === "float") return "cssFloat";
	if (e === "offset") return "cssOffset";
	if (e.startsWith("--")) return e;
	let t = e.split("-");
	return t.length === 1 ? t[0] : t[0] + t.slice(1).map((e) => e[0].toUpperCase() + e.slice(1)).join("");
}
function Li(e) {
	let t = {}, n = e.split(";");
	for (let e of n) {
		let [n, r] = e.split(":");
		if (!n || r === void 0) break;
		let i = Ii(n.trim());
		t[i] = r.trim();
	}
	return t;
}
var Ri = (e) => e;
function zi(e, t, n, r) {
	var i = !!(e & 1), a = !!(e & 2), o = i && a, s = !!(e & 4), c = o ? "both" : i ? "in" : "out", l, u = t.inert, d = t.style.overflow, f, p;
	function m() {
		return vt(() => l ??= n()(t, r?.() ?? {}, { direction: c }));
	}
	var h = {
		is_global: s,
		in() {
			t.inert = u, i ? (a || f?.abort(), f = Bi(t, m(), p, 1, () => {
				Fi(t, "introstart");
			}, () => {
				Fi(t, "introend"), f?.abort(), f = l = void 0, t.style.overflow = d;
			})) : (p?.abort(), p?.reset?.());
		},
		out(e) {
			a ? (t.inert = !0, p = Bi(t, m(), f, 0, () => {
				Fi(t, "outrostart");
			}, () => {
				Fi(t, "outroend"), e?.();
			})) : (e?.(), l = void 0);
		},
		stop: () => {
			f?.abort(), p?.abort();
		}
	}, g = q;
	if ((g.nodes.t ??= []).push(h), i && oi) {
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
function Bi(e, t, n, r, i, a) {
	var o = r === 1, s = !1;
	if (d(t)) {
		var c;
		return M(() => {
			s || (c = Bi(e, t({ direction: o ? "in" : "out" }), n, r, i, a));
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
	let { delay: l = 0, css: u, tick: p, easing: m = Ri } = t;
	var h, g = () => 1 - r;
	return M(() => {
		if (!s) {
			var c = [];
			if (o && n === void 0 && (p && p(0, 1), u)) {
				var d = Li(u(0, 1));
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
						var v = o + s * m(_ / f), y = Li(u(v, 1 - v));
						l.push(y), d ||= y.overflow === "hidden";
					}
					d && (e.style.overflow = "hidden"), g = () => {
						var e = h.currentTime;
						return o + s * m(e / c);
					}, p && Pi(() => {
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
function Vi(e, t, n, r, i, a) {
	let o = E;
	E && A();
	var s = null;
	E && O.nodeType === 1 && (s = O, A());
	var c = E ? O : e, l = new mi(c, !1);
	Vn(() => {
		let e = t() || null;
		var a = i ? i() : n || e === "svg" ? be : void 0;
		if (e === null) l.ensure(null, null), si(!0);
		else return l.ensure(e, (t) => {
			if (e) {
				var n = E;
				if (s = E ? s : Tn(e, a), $(s, s), r) {
					var i = null;
					E && Nr(e) && s.append(i = document.createComment(""));
					var o = E ? /* @__PURE__ */ R(s) : s.appendChild(L());
					E && (o === null ? D(!1) : k(o)), r(s, o), i?.remove();
				}
				q.nodes.end = s, n || t.before(s);
			}
			E && k(t);
		}), si(!0), () => {
			e && si(!1);
		};
	}, C), jn(() => {
		si(!0);
	}), o && (D(!0), k(c));
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/css.js
function Hi(e, t) {
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
function Ui(e, t, n) {
	Ln(() => {
		var r = Q(() => t(e, n?.()) || {});
		if (n && r?.update) {
			var i = !1, a = {};
			zn(() => {
				var e = n();
				xr(e), i && Me(a, e) && (a = e, r.update(e));
			}), i = !0;
		}
		if (r?.destroy) return () => r.destroy();
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/elements/attachments.js
function Wi(e, t) {
	var n = void 0, r;
	Hn(() => {
		n !== (n = t()) && (r &&= (U(r), null), n && (r = H(() => {
			Ln(() => n(e));
		})));
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/clsx/dist/clsx.mjs
function Gi(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") {
		if (Array.isArray(e)) {
			var i = e.length;
			for (t = 0; t < i; t++) e[t] && (n = Gi(e[t])) && (r && (r += " "), r += n);
		} else for (n in e) e[n] && (r && (r += " "), r += n);
	}
	return r;
}
function Ki() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = Gi(e)) && (r && (r += " "), r += t);
	return r;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/shared/attributes.js
function qi(e) {
	return typeof e == "object" ? Ki(e) : e ?? "";
}
var Ji = [..." 	\n\r\f\xA0\v﻿"];
function Yi(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || Ji.includes(r[o - 1])) && (s === r.length || Ji.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function Xi(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function Zi(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function Qi(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\/\*.*?\*\//g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(Zi)), i && c.push(...Object.keys(i).map(Zi));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = Zi(e.substring(l, u).trim());
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
		return r && (n += Xi(r)), i && (n += Xi(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/elements/class.js
function $i(e, t, n, r, i, a) {
	var o = e[fe];
	if (E || o !== n || o === void 0) {
		var s = Yi(n, r, a);
		E && s === e.getAttribute("class") || (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[fe] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/elements/style.js
function ea(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function ta(e, t, n, r) {
	var i = e[pe];
	if (E || i !== t) {
		var a = Qi(t, r);
		E && a === e.getAttribute("style") || (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[pe] = t;
	} else r && (Array.isArray(r) ? (ea(e, n?.[0], r[0]), ea(e, n?.[1], r[1], "important")) : ea(e, n, r));
	return r;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function na(e, t) {
	t ? e.hasAttribute("selected") || e.setAttribute("selected", "") : e.removeAttribute("selected");
}
function ra(e, t) {
	var n = !("__defaultValue" in e);
	(n || e.__defaultValue !== t) && (e.__defaultValue = t, ia(e, !n || "__value" in e));
}
function ia(t, n) {
	var r = t.__defaultValue, i = t.multiple, a = i ? r ?? [] : null;
	if (!i || e(a)) {
		var o = t.selectedIndex, s = n && i ? new Set(t.selectedOptions) : null;
		for (var c of t.options) {
			var l = ca(c);
			na(c, i ? a.includes(l) : pn(l, r));
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
function aa(t, n, r = !1) {
	if (t.multiple) {
		if (n == null) return;
		if (!e(n)) return Te();
		for (var i of t.options) i.selected = n.includes(ca(i));
	} else {
		for (i of t.options) if (pn(ca(i), n)) {
			i.selected = !0;
			return;
		}
		r && n === void 0 || (t.selectedIndex = -1);
	}
}
function oa(e) {
	var t = new MutationObserver((t) => {
		t.every(la) || ("__defaultValue" in e && ia(e, !1), "__value" in e && aa(e, e.__value));
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
function sa(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	yt(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), ca);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && ca(o);
		}
		n(a), e.__value = a, P !== null && r.add(P);
	}), Ln(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = P;
			if (r.has(o)) return;
		}
		if (aa(e, a, i), i && a === void 0) {
			var s = e.querySelector(":checked");
			s !== null && (a = ca(s), n(a));
		}
		e.__value = a, i = !1;
	});
}
function ca(e) {
	return "__value" in e ? e.__value : e.value;
}
function la(e) {
	if (e.target.closest("selectedcontent") !== null) return !0;
	if (e.type === "childList") {
		var t = [...e.addedNodes, ...e.removedNodes];
		return t.length > 0 && t.every((e) => e.nodeName === "SELECTEDCONTENT");
	}
	return !1;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/elements/attributes.js
var ua = Symbol("class"), da = Symbol("style"), fa = Symbol("is custom element"), pa = Symbol("is html"), ma = _e ? "link" : "LINK", ha = _e ? "input" : "INPUT", ga = _e ? "option" : "OPTION", _a = _e ? "select" : "SELECT", va = _e ? "progress" : "PROGRESS";
function ya(e) {
	if (E) {
		var t = !1, n = () => {
			if (!t) {
				if (t = !0, e.hasAttribute("value")) {
					var n = e.value;
					xa(e, "value", null), e.value = n;
				}
				if (e.hasAttribute("checked")) {
					var r = e.checked;
					xa(e, "checked", null), e.checked = r;
				}
			}
		};
		e[he] = n, M(n), _t();
	}
}
function ba(e, t) {
	var n = wa(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === va) && (e.value = t ?? "");
}
function xa(e, t, n, r) {
	var i = wa(e);
	E && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === ma) || i[t] !== (i[t] = n) && (t === "loading" && (e[le] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && Ea(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function Sa(e, t, n, r, i = !1, a = !1) {
	E && i && e.nodeName === ha && ("defaultValue" in n || "defaultChecked" in n || ya(e));
	var o = wa(e), s = o[fa], c = !o[pa];
	let l = E && s;
	l && D(!1);
	var u = t || {}, d = e.nodeName === ga, f = e.nodeName === _a;
	try {
		for (var p in t) !(p in n) && p[0] + p[1] !== "$$" && (n[p] = null);
		n.class ? n.class = qi(n.class) : (r || n[ua]) && (n.class = null), n[da] && (n.style ??= null);
		var m = Ea(e);
		if (e.nodeName === ha && "type" in n && ("value" in n || "__value" in n)) {
			var h = n.type;
			(h !== u.type || h === void 0 && e.hasAttribute("type")) && (u.type = h, xa(e, "type", h, a));
		}
		for (let i in n) {
			let l = n[i];
			if (d && i === "value" && l == null) e.value = e.__value = "", u[i] = l;
			else if (i === "class") $i(e, e.namespaceURI === "http://www.w3.org/1999/xhtml", l, r, t?.[ua], n[ua]), u[i] = l, u[ua] = n[ua];
			else if (i === "style") ta(e, l, t?.[da], n[da]), u[i] = l, u[da] = n[da];
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
						} else if (i === "style") xa(e, i, l);
						else if (i === "autofocus") ht(e, !!l);
						else if (!s && (i === "__value" || i === "value" && l != null)) e.__value = l, (g == null || e.value !== l || l === 0 && e.nodeName === va) && (e.value = l);
						else if (i === "selected" && d) na(e, l);
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
							} else b || (s || typeof l != "string") && m.has(y) ? (e[y] = l, y in o && (o[y] = T)) : typeof l != "function" && xa(e, y, l, a);
						}
					}
				}
			}
		}
	} finally {
		l && D(!0);
	}
	return u;
}
function Ca(e, t, n = [], r = [], i = [], a, o = !1, s = !1) {
	bt(i, n, r, (n) => {
		var r = void 0, i = {}, c = e.nodeName === _a, l = !1;
		if (Hn(() => {
			var u = t(...n.map(Z)), d = Sa(e, r, u, a, o, s);
			if (l && c) {
				var f = e;
				"defaultValue" in u && ra(f, u.defaultValue), "value" in u && aa(f, u.value);
			}
			for (let e of Object.getOwnPropertySymbols(i)) u[e] || U(i[e]);
			for (let t of Object.getOwnPropertySymbols(u)) {
				var p = u[t];
				t.description !== "@attach" || r && p === r[t] || (i[t] && U(i[t]), i[t] = H(() => Wi(e, () => p))), d[t] = p;
			}
			r = d;
		}), c) {
			var u = e;
			Ln(() => {
				var e = r;
				"defaultValue" in e && ra(u, e.defaultValue), aa(u, e.value, !0), oa(u);
			});
		}
		l = !0;
	});
}
function wa(e) {
	return e[de] ??= {
		[fa]: e.nodeName.includes("-"),
		[pa]: e.namespaceURI === ye
	};
}
var Ta = /* @__PURE__ */ new Map();
function Ea(e) {
	var t = e.getAttribute("is") || e.nodeName, n = Ta.get(t);
	if (n) return n;
	Ta.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var s in r = o(i), r) r[s].set && s !== "innerHTML" && s !== "textContent" && s !== "innerText" && n.add(s);
		i = l(i);
	}
	return n;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function Da(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	yt(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = ka(e) ? Aa(a) : a, n(a), P !== null && r.add(P), await vr(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (E && e.defaultValue !== e.value || Q(t) == null && e.value) && (n(ka(e) ? Aa(e.value) : e.value), P !== null && r.add(P)), zn(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = P;
			if (r.has(i)) return;
		}
		ka(e) && n === Aa(e.value) || (e.type !== "date" || n || e.value) && n !== e.value && (e.value = n ?? "");
	});
}
function Oa(e, t, n = t) {
	yt(e, "change", (t) => {
		n(t ? e.defaultChecked : e.checked);
	}), (E && e.defaultChecked !== e.checked || Q(t) == null) && n(e.checked), zn(() => {
		e.checked = !!t();
	});
}
function ka(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function Aa(e) {
	return e === "" ? null : +e;
}
var ja = /* @__PURE__ */ new class e {
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
function Ma(e, t, n) {
	var r = ja.observe(e, () => n(e[t]));
	Ln(() => (Q(() => n(e[t])), r));
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function Na(e, t) {
	return e === t || e?.[w] === t;
}
function Pa(e = st(), t, n, r) {
	var i = j.r, a = q;
	return Ln(() => {
		var o, s;
		return zn(() => {
			o = s, s = r?.() || [], Q(() => {
				Na(n(...s), e) || (t(e, ...s), o && Na(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && Na(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/store/utils.js
function Fa(e, t, n) {
	if (e == null) return t(void 0), n && n(void 0), f;
	let r = Q(() => e.subscribe(t, n));
	return r.unsubscribe ? () => r.unsubscribe() : r;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/store/shared/index.js
var Ia = [];
function La(e, t) {
	return { subscribe: Ra(e, t).subscribe };
}
function Ra(e, t = f) {
	let n = null, r = /* @__PURE__ */ new Set();
	function i(t) {
		if (Me(e, t) && (e = t, n)) {
			let t = !Ia.length;
			for (let t of r) t[1](), Ia.push(t, e);
			if (t) {
				for (let e = 0; e < Ia.length; e += 2) Ia[e][0](Ia[e + 1]);
				Ia.length = 0;
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
function za(e, t, n) {
	let r = !Array.isArray(e), i = r ? [e] : e;
	if (!i.every(Boolean)) throw Error("derived() expects stores as input, got a falsy value");
	let a = t.length < 2;
	return La(n, (e, n) => {
		let o = !1, s = [], c = 0, l = f, u = () => {
			if (c) return;
			l();
			let i = t(r ? s[0] : s, e, n);
			a ? e(i) : l = typeof i == "function" ? i : f;
		}, d = i.map((e, t) => Fa(e, (e) => {
			s[t] = e, c &= ~(1 << t), o && u();
		}, () => {
			c |= 1 << t;
		}));
		return o = !0, u(), function() {
			p(d), l(), o = !1;
		};
	});
}
function Ba(e) {
	let t;
	return Fa(e, (e) => t = e)(), t;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/reactivity/store.js
var Va = !1, Ha = Symbol("unmounted");
function Ua(e, t, n) {
	let r = n[t] ??= {
		store: null,
		source: /* @__PURE__ */ nn(void 0),
		unsubscribe: f
	};
	if (r.store !== e && !(Ha in n)) {
		if (r.unsubscribe(), r.store = e ?? null, e == null) r.source.v = void 0, r.unsubscribe = f;
		else {
			var i = !0;
			r.unsubscribe = Fa(e, (e) => {
				i ? r.source.v = e : I(r.source, e);
			}), i = !1;
		}
	}
	return e && Ha in n ? Ba(e) : Z(r.source);
}
function Wa() {
	let e = {};
	function t() {
		jn(() => {
			for (var t in e) e[t].unsubscribe();
			i(e, Ha, {
				enumerable: !1,
				value: !0
			});
		});
	}
	return [e, t];
}
function Ga(e) {
	var t = Va;
	try {
		return Va = !1, [e(), Va];
	} finally {
		Va = t;
	}
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/client/reactivity/props.js
var Ka = {
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
function qa(e, t, n) {
	return new Proxy({
		props: e,
		exclude: t
	}, Ka);
}
var Ja = {
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
		if (t === w || t === ce) return !1;
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
function Ya(...e) {
	return new Proxy({ props: e }, Ja);
}
function Xa(e, t, n, r) {
	var i = !0, o = !!(n & 8), s = !!(n & 16), c = r, l = !0, u = void 0, d = () => s && i ? (u ??= /* @__PURE__ */ wt(r), Z(u)) : (l && (l = !1, c = s ? Q(r) : r), c);
	let f;
	if (o) {
		var p = w in e || ce in e;
		f = a(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	o ? [m, h] = Ga(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && Ve(t), f(m)));
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
	var v = !1, y = (n & 1 ? wt : Ot)(() => (v = !1, g()));
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
function Za(e) {
	j === null && Pe("onMount"), Mn(() => {
		let t = Q(e);
		if (typeof t == "function") return t;
	});
}
function Qa(e) {
	j === null && Pe("onDestroy"), Za(() => () => Q(e));
}
export { Lr as $, Vi as A, Oe as At, ci as B, ta as C, rt as Ct, Wi as D, Ze as Dt, Ki as E, nt as Et, Si as F, Yr as G, ni as H, vi as I, Qr as J, Zr as K, _i as L, Ai as M, f as Mt, ki as N, h as Nt, Ui as O, Ye as Ot, Oi as P, zr as Q, hi as R, aa as S, tt as St, qi as T, at as Tt, ei as U, pi as V, $r as W, Vr as X, Hr as Y, Br as Z, ya as _, tn as _t, Ya as a, Fn as at, sa as b, Dt as bt, za as c, Pn as ct, Ra as d, xn as dt, Cr as et, Pa as f, Sn as ft, Ca as g, en as gt, Da as h, I as ht, qa as i, cr as it, zi as j, De as jt, Hi as k, qe as kt, Ba as l, yn as lt, Oa as m, ln as mt, Za as n, vr as nt, Wa as o, Bn as ot, Ma as p, dn as pt, ti as q, Xa as r, Q as rt, Ua as s, Mn as st, Qa as t, Z as tt, La as u, bn as ut, xa as v, cn as vt, $i as w, ot as wt, oa as x, it as xt, ba as y, Wt as yt, li as z };
