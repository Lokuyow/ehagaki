import { t as e } from "./rolldown-runtime-CwxnZyOB.js";
import { n as t } from "./relayConfigUtils-56ujWwKF.js";
import { a as n } from "./postHistoryEventUtils-iuP8QpIA.js";
import { a as r, c as i, d as a, i as o, n as s, r as c, s as l, u } from "./tslib.es6-BgJxuhU8.js";
import { _ as d, c as f, d as p, f as m, i as h, n as g, o as ee, s as te } from "./operation-BO0VLD7w.js";
import { dt as _, ft as v, pt as y, t as ne } from "./postHistoryRepository-Bu2z041i.js";
import { t as re } from "./Subject-CVLJIZWD.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/observable/empty.js
var b = new h(function(e) {
	return e.complete();
});
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/util/isScheduler.js
function ie(e) {
	return e && d(e.schedule);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/util/args.js
function ae(e) {
	return e[e.length - 1];
}
function oe(e) {
	return ie(ae(e)) ? e.pop() : void 0;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/util/isArrayLike.js
var se = (function(e) {
	return e && typeof e.length == "number" && typeof e != "function";
});
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/util/isPromise.js
function ce(e) {
	return d(e?.then);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/util/isInteropObservable.js
function le(e) {
	return d(e[te]);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/util/isAsyncIterable.js
function ue(e) {
	return Symbol.asyncIterator && d(e?.[Symbol.asyncIterator]);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/util/throwUnobservableError.js
function de(e) {
	return /* @__PURE__ */ TypeError("You provided " + (typeof e == "object" && e ? "an invalid object" : "'" + e + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/symbol/iterator.js
function fe() {
	return typeof Symbol != "function" || !Symbol.iterator ? "@@iterator" : Symbol.iterator;
}
var pe = fe();
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/util/isIterable.js
function me(e) {
	return d(e?.[pe]);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/util/isReadableStreamLike.js
function he(e) {
	return s(this, arguments, function() {
		var t, n, r, i;
		return l(this, function(a) {
			switch (a.label) {
				case 0: t = e.getReader(), a.label = 1;
				case 1: a.trys.push([
					1,
					,
					9,
					10
				]), a.label = 2;
				case 2: return [4, o(t.read())];
				case 3: return n = a.sent(), r = n.value, i = n.done, i ? [4, o(void 0)] : [3, 5];
				case 4: return [2, a.sent()];
				case 5: return [4, o(r)];
				case 6: return [4, a.sent()];
				case 7: return a.sent(), [3, 2];
				case 8: return [3, 10];
				case 9: return t.releaseLock(), [7];
				case 10: return [2];
			}
		});
	});
}
function ge(e) {
	return d(e?.getReader);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/observable/innerFrom.js
function x(e) {
	if (e instanceof h) return e;
	if (e != null) {
		if (le(e)) return _e(e);
		if (se(e)) return ve(e);
		if (ce(e)) return ye(e);
		if (ue(e)) return xe(e);
		if (me(e)) return be(e);
		if (ge(e)) return Se(e);
	}
	throw de(e);
}
function _e(e) {
	return new h(function(t) {
		var n = e[te]();
		if (d(n.subscribe)) return n.subscribe(t);
		throw TypeError("Provided object does not correctly implement Symbol.observable");
	});
}
function ve(e) {
	return new h(function(t) {
		for (var n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
		t.complete();
	});
}
function ye(e) {
	return new h(function(t) {
		e.then(function(e) {
			t.closed || (t.next(e), t.complete());
		}, function(e) {
			return t.error(e);
		}).then(null, m);
	});
}
function be(e) {
	return new h(function(t) {
		var n, r;
		try {
			for (var i = a(e), o = i.next(); !o.done; o = i.next()) {
				var s = o.value;
				if (t.next(s), t.closed) return;
			}
		} catch (e) {
			n = { error: e };
		} finally {
			try {
				o && !o.done && (r = i.return) && r.call(i);
			} finally {
				if (n) throw n.error;
			}
		}
		t.complete();
	});
}
function xe(e) {
	return new h(function(t) {
		Ce(e, t).catch(function(e) {
			return t.error(e);
		});
	});
}
function Se(e) {
	return xe(he(e));
}
function Ce(e, t) {
	var n, i, a, o;
	return r(this, void 0, void 0, function() {
		var r, s;
		return l(this, function(l) {
			switch (l.label) {
				case 0: l.trys.push([
					0,
					5,
					6,
					11
				]), n = c(e), l.label = 1;
				case 1: return [4, n.next()];
				case 2:
					if (i = l.sent(), i.done) return [3, 4];
					if (r = i.value, t.next(r), t.closed) return [2];
					l.label = 3;
				case 3: return [3, 1];
				case 4: return [3, 11];
				case 5: return s = l.sent(), a = { error: s }, [3, 11];
				case 6: return l.trys.push([
					6,
					,
					9,
					10
				]), i && !i.done && (o = n.return) ? [4, o.call(n)] : [3, 8];
				case 7: l.sent(), l.label = 8;
				case 8: return [3, 10];
				case 9:
					if (a) throw a.error;
					return [7];
				case 10: return [7];
				case 11: return t.complete(), [2];
			}
		});
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/util/executeSchedule.js
function S(e, t, n, r, i) {
	r === void 0 && (r = 0), i === void 0 && (i = !1);
	var a = t.schedule(function() {
		n(), i ? e.add(this.schedule(null, r)) : this.unsubscribe();
	}, r);
	if (e.add(a), !i) return a;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/operators/observeOn.js
function C(e, t) {
	return t === void 0 && (t = 0), y(function(n, r) {
		n.subscribe(v(r, function(n) {
			return S(r, e, function() {
				return r.next(n);
			}, t);
		}, function() {
			return S(r, e, function() {
				return r.complete();
			}, t);
		}, function(n) {
			return S(r, e, function() {
				return r.error(n);
			}, t);
		}));
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/operators/subscribeOn.js
function w(e, t) {
	return t === void 0 && (t = 0), y(function(n, r) {
		r.add(e.schedule(function() {
			return n.subscribe(r);
		}, t));
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/scheduled/scheduleObservable.js
function we(e, t) {
	return x(e).pipe(w(t), C(t));
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/scheduled/schedulePromise.js
function Te(e, t) {
	return x(e).pipe(w(t), C(t));
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/scheduled/scheduleArray.js
function Ee(e, t) {
	return new h(function(n) {
		var r = 0;
		return t.schedule(function() {
			r === e.length ? n.complete() : (n.next(e[r++]), n.closed || this.schedule());
		});
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/scheduled/scheduleIterable.js
function De(e, t) {
	return new h(function(n) {
		var r;
		return S(n, t, function() {
			r = e[pe](), S(n, t, function() {
				var e, t, i;
				try {
					e = r.next(), t = e.value, i = e.done;
				} catch (e) {
					n.error(e);
					return;
				}
				i ? n.complete() : n.next(t);
			}, 0, !0);
		}), function() {
			return d(r?.return) && r.return();
		};
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/scheduled/scheduleAsyncIterable.js
function T(e, t) {
	if (!e) throw Error("Iterable cannot be null");
	return new h(function(n) {
		S(n, t, function() {
			var r = e[Symbol.asyncIterator]();
			S(n, t, function() {
				r.next().then(function(e) {
					e.done ? n.complete() : n.next(e.value);
				});
			}, 0, !0);
		});
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/scheduled/scheduleReadableStreamLike.js
function Oe(e, t) {
	return T(he(e), t);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/scheduled/scheduled.js
function ke(e, t) {
	if (e != null) {
		if (le(e)) return we(e, t);
		if (se(e)) return Ee(e, t);
		if (ce(e)) return Te(e, t);
		if (ue(e)) return T(e, t);
		if (me(e)) return De(e, t);
		if (ge(e)) return Oe(e, t);
	}
	throw de(e);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/observable/from.js
function E(e, t) {
	return t ? ke(e, t) : x(e);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/observable/throwError.js
function Ae(e, t) {
	var n = d(e) ? e : function() {
		return e;
	}, r = function(e) {
		return e.error(n());
	};
	return new h(t ? function(e) {
		return t.schedule(r, 0, e);
	} : r);
}
Array.isArray;
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/operators/mergeInternals.js
function je(e, t, n, r, i, a, o, s) {
	var c = [], l = 0, u = 0, d = !1, f = function() {
		d && !c.length && !l && t.complete();
	}, p = function(e) {
		return l < r ? m(e) : c.push(e);
	}, m = function(e) {
		a && t.next(e), l++;
		var s = !1;
		x(n(e, u++)).subscribe(v(t, function(e) {
			i?.(e), a ? p(e) : t.next(e);
		}, function() {
			s = !0;
		}, void 0, function() {
			if (s) try {
				l--;
				for (var e = function() {
					var e = c.shift();
					o ? S(t, o, function() {
						return m(e);
					}) : m(e);
				}; c.length && l < r;) e();
				f();
			} catch (e) {
				t.error(e);
			}
		}));
	};
	return e.subscribe(v(t, p, function() {
		d = !0, f();
	})), function() {
		s?.();
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/operators/mergeMap.js
function D(e, t, n) {
	return n === void 0 && (n = Infinity), d(t) ? D(function(n, r) {
		return _(function(e, i) {
			return t(n, e, r, i);
		})(x(e(n, r)));
	}, n) : (typeof t == "number" && (n = t), y(function(t, r) {
		return je(t, r, e, n);
	}));
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/operators/mergeAll.js
function Me(e) {
	return e === void 0 && (e = Infinity), D(ee, e);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/operators/concatAll.js
function Ne() {
	return Me(1);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/observable/defer.js
function O(e) {
	return new h(function(t) {
		x(e()).subscribe(t);
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/observable/never.js
var Pe = new h(p);
Array.isArray;
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/operators/concatMap.js
function Fe(e, t) {
	return d(t) ? D(e, t, 1) : D(e, 1);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/operators/concat.js
function Ie() {
	var e = [...arguments], t = oe(e);
	return y(function(n, r) {
		Ne()(E(u([n], i(e)), t)).subscribe(r);
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/operators/concatWith.js
function Le() {
	var e = [...arguments];
	return Ie.apply(void 0, u([], i(e)));
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/operators/finalize.js
function Re(e) {
	return y(function(t, n) {
		try {
			t.subscribe(n);
		} finally {
			n.add(e);
		}
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/operators/share.js
function ze(e) {
	e === void 0 && (e = {});
	var t = e.connector, n = t === void 0 ? function() {
		return new re();
	} : t, r = e.resetOnError, i = r === void 0 || r, a = e.resetOnComplete, o = a === void 0 || a, s = e.resetOnRefCountZero, c = s === void 0 || s;
	return function(e) {
		var t, r, a, s = 0, l = !1, u = !1, d = function() {
			r?.unsubscribe(), r = void 0;
		}, p = function() {
			d(), t = a = void 0, l = u = !1;
		}, m = function() {
			var e = t;
			p(), e?.unsubscribe();
		};
		return y(function(e, h) {
			s++, !u && !l && d();
			var g = a ??= n();
			h.add(function() {
				s--, s === 0 && !u && !l && (r = k(m, c));
			}), g.subscribe(h), !t && s > 0 && (t = new f({
				next: function(e) {
					return g.next(e);
				},
				error: function(e) {
					u = !0, d(), r = k(p, i, e), g.error(e);
				},
				complete: function() {
					l = !0, d(), r = k(p, o), g.complete();
				}
			}), x(e).subscribe(t));
		})(e);
	};
}
function k(e, t) {
	var n = [...arguments].slice(2);
	if (t === !0) e();
	else if (t !== !1) {
		var r = new f({ next: function() {
			r.unsubscribe(), e();
		} });
		return x(t.apply(void 0, u([], i(n)))).subscribe(r);
	}
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/operators/switchMap.js
function Be(e, t) {
	return y(function(n, r) {
		var i = null, a = 0, o = !1, s = function() {
			return o && !i && r.complete();
		};
		n.subscribe(v(r, function(n) {
			i?.unsubscribe();
			var o = 0, c = a++;
			x(e(n, c)).subscribe(i = v(r, function(e) {
				return r.next(t ? t(n, e, c, o++) : e);
			}, function() {
				i = null, s();
			}));
		}, function() {
			o = !0, s();
		}));
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/operators/takeUntil.js
function Ve(e) {
	return y(function(t, n) {
		x(e).subscribe(v(n, function() {
			return n.complete();
		}, p)), !n.closed && t.subscribe(n);
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/operators/takeWhile.js
function He(e, t) {
	return t === void 0 && (t = !1), y(function(n, r) {
		var i = 0;
		n.subscribe(v(r, function(n) {
			var a = e(n, i++);
			(a || t) && r.next(n), !a && r.complete();
		}));
	});
}
new TextDecoder("utf-8"), new TextEncoder();
var Ue = 1059, We = 1e4, Ge = 10003, Ke = 10004, qe = 10005, Je = 10007, Ye = 10015, Xe = 3e4, Ze = 30002, Qe = 30003, $e = 30004, et = 30015, tt = 30024, nt = {
	4: "nip04",
	13: "nip44",
	[Ue]: "nip44"
};
function A(e, t) {
	return nt[e] = t, e;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/applesauce-core/dist/helpers/lru.js
var j = class {
	first = null;
	items = /* @__PURE__ */ new Map();
	last = null;
	max;
	resetTtl;
	size;
	ttl;
	constructor(e = 0, t = 0, n = !1) {
		this.first = null, this.last = null, this.max = e, this.resetTtl = n, this.size = 0, this.ttl = t;
	}
	clear() {
		return this.first = null, this.items.clear(), this.last = null, this.size = 0, this;
	}
	delete(e) {
		let t = this.items.get(e);
		return t && (this.items.delete(e), this.size--, t.prev !== null && (t.prev.next = t.next), t.next !== null && (t.next.prev = t.prev), this.first === t && (this.first = t.next), this.last === t && (this.last = t.prev)), this;
	}
	entries(e = this.keys()) {
		return e.map((e) => [e, this.get(e)]);
	}
	evict(e = !1) {
		if (e || this.size > 0) {
			let e = this.first;
			this.items.delete(e.key), --this.size === 0 ? (this.first = null, this.last = null) : (this.first = e.next, this.first.prev = null);
		}
		return this;
	}
	expiresAt(e) {
		return this.items.get(e)?.expiry;
	}
	get(e) {
		let t, n = this.items.get(e);
		return n && (this.ttl > 0 && n.expiry <= Date.now() ? this.delete(e) : (t = n.value, this.set(e, t, !0))), t;
	}
	has(e) {
		return this.items.has(e);
	}
	keys() {
		let e = [], t = this.first;
		for (; t !== null;) e.push(t.key), t = t.next;
		return e;
	}
	set(e, t, n = !1, r = this.resetTtl) {
		let i;
		if (i = this.items.get(e), i) {
			if (i.value = t, n === !1 && r && (i.expiry = this.ttl > 0 ? Date.now() + this.ttl : this.ttl), this.last !== i) {
				let e = this.last, t = i.next, n = i.prev;
				this.first === i && (this.first = i.next), i.next = null, i.prev = this.last, e.next = i, n !== null && (n.next = t), t !== null && (t.prev = n);
			}
		} else this.max > 0 && this.size === this.max && this.evict(!0), i = {
			expiry: this.ttl > 0 ? Date.now() + this.ttl : this.ttl,
			key: e,
			prev: this.last,
			next: null,
			value: t
		}, this.items.set(e, i), ++this.size === 1 ? this.first = i : this.last.next = i;
		return this.last = i, this;
	}
	values(e = this.keys()) {
		return e.map((e) => this.get(e));
	}
};
new j(1024), new j(1024);
var rt = /* @__PURE__ */ new Set([A(tt, "nip04")]);
function M(e, t) {
	return rt.add(A(e, t)), e;
}
M(Ge, "nip04"), M(Ye, "nip04"), M(We, "nip04"), M(Ke, "nip04"), M(qe, "nip04"), M(Je, "nip04"), M(10009, "nip04"), M(Qe, "nip04"), M(Ze, "nip04"), M(Xe, "nip04"), M($e, "nip04"), M(et, "nip04");
// D:/ドキュメント/GitHub/ehagaki/node_modules/applesauce-core/dist/logger.js
function it() {
	let e = P();
	if (e?.env?.DEBUG) return e.env.DEBUG;
	if (e?.versions?.node) return "";
	try {
		return globalThis.localStorage?.getItem("debug") ?? "";
	} catch {
		return "";
	}
}
var at = it(), ot = (e, t) => vt(e, t);
function N(e) {
	let t = e.replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*");
	return RegExp(`^${t}$`);
}
function st() {
	let e = [], t = [];
	for (let n of at.split(/[\s,]+/).filter(Boolean)) n.startsWith("-") ? t.push(N(n.slice(1))) : e.push(N(n));
	return {
		include: e,
		exclude: t
	};
}
function ct(e) {
	let t = st();
	return !t.exclude.some((t) => t.test(e)) && t.include.some((t) => t.test(e));
}
var lt = [
	20,
	21,
	26,
	27,
	32,
	33,
	38,
	39,
	40,
	41,
	42,
	43,
	44,
	45,
	56,
	57,
	62,
	63,
	68,
	69,
	74,
	75,
	76,
	77,
	78,
	79,
	80,
	81,
	92,
	93,
	98,
	99,
	112,
	113,
	128,
	129,
	134,
	135,
	148,
	149,
	160,
	161,
	162,
	163,
	164,
	165,
	166,
	167,
	168,
	169,
	170,
	171,
	172,
	173,
	178,
	179,
	184,
	185,
	196,
	197,
	198,
	199,
	200,
	201,
	202,
	203,
	204,
	205,
	206,
	207,
	208,
	209,
	214,
	215,
	220,
	221
], ut = [
	6,
	2,
	3,
	4,
	5,
	1
], dt = /* @__PURE__ */ "#0000CC.#0000FF.#0033CC.#0033FF.#0066CC.#0066FF.#0099CC.#0099FF.#00CC00.#00CC33.#00CC66.#00CC99.#00CCCC.#00CCFF.#3300CC.#3300FF.#3333CC.#3333FF.#3366CC.#3366FF.#3399CC.#3399FF.#33CC00.#33CC33.#33CC66.#33CC99.#33CCCC.#33CCFF.#6600CC.#6600FF.#6633CC.#6633FF.#66CC00.#66CC33.#9900CC.#9900FF.#9933CC.#9933FF.#99CC00.#99CC33.#CC0000.#CC0033.#CC0066.#CC0099.#CC00CC.#CC00FF.#CC3300.#CC3333.#CC3366.#CC3399.#CC33CC.#CC33FF.#CC6600.#CC6633.#CC9900.#CC9933.#CCCC00.#CCCC33.#FF0000.#FF0033.#FF0066.#FF0099.#FF00CC.#FF00FF.#FF3300.#FF3333.#FF3366.#FF3399.#FF33CC.#FF33FF.#FF6600.#FF6633.#FF9900.#FF9933.#FFCC00.#FFCC33".split(".");
function P() {
	try {
		return globalThis.process;
	} catch {
		return;
	}
}
function ft() {
	try {
		return globalThis.document !== void 0;
	} catch {
		return !1;
	}
}
function pt() {
	if (ft()) return !0;
	let e = P()?.env;
	return !e || e.NO_COLOR ? !1 : e.FORCE_COLOR === void 0 ? e.TERM !== "dumb" && P()?.stdout?.isTTY === !0 : e.FORCE_COLOR !== "0" && e.FORCE_COLOR !== "false";
}
function mt() {
	let e = P()?.env;
	return e ? /-256(color)?$/i.test(e.TERM ?? "") || e.COLORTERM !== void 0 : !1;
}
var ht = pt();
function gt(e, t) {
	let n = 0;
	for (let t = 0; t < e.length; t++) n = (n << 5) - n + e.charCodeAt(t) | 0;
	return t[Math.abs(n) % t.length];
}
function _t(e) {
	return e >= 864e5 ? `+${Math.round(e / 864e5)}d` : e >= 36e5 ? `+${Math.round(e / 36e5)}h` : e >= 6e4 ? `+${Math.round(e / 6e4)}m` : e >= 1e3 ? `+${Math.round(e / 1e3)}s` : `+${e}ms`;
}
function vt(e, t) {
	let n = _t(t.diff);
	if (!ht) {
		console.debug(`${e} ${n}`);
		return;
	}
	if (ft()) {
		let e = `color: ${gt(t.namespace, dt)}`;
		console.debug(`%c${t.namespace}%c ${t.message} %c${n}`, e, "color: inherit", e);
		return;
	}
	let r = gt(t.namespace, mt() ? lt : ut), i = `\u001B[3${r < 8 ? r : `8;5;${r}`}`;
	console.debug(`  ${i};1m${t.namespace}\u001B[0m ${t.message} ${i}m${n}\u001B[0m`);
}
function F(e, t = "[Unformattable]") {
	try {
		return String(e);
	} catch {
		return t;
	}
}
function I(e, t = /* @__PURE__ */ new Set()) {
	try {
		if (e instanceof Error) return F(e);
		if (typeof e == "string") return `'${e}'`;
		if (typeof e == "bigint") return `${e}n`;
		if (typeof e == "symbol" || typeof e == "function" || typeof e != "object" || !e) return F(e);
		if (t.has(e)) return "[Circular]";
		t.add(e);
		let n = Object.getOwnPropertyDescriptors(e), r = Object.entries(n).filter(([e, t]) => e !== "length" && t.enumerable).map(([n, r]) => {
			let i = "value" in r ? I(r.value, t) : "[Getter]";
			return Array.isArray(e) ? i : `${n}: ${i}`;
		});
		return t.delete(e), Array.isArray(e) ? `[ ${r.join(", ")} ]` : `{ ${r.join(", ")} }`;
	} catch {
		return t.delete(e), "[Uninspectable]";
	}
}
function yt(e) {
	try {
		return JSON.stringify(e);
	} catch {
		return "[Circular]";
	}
}
function bt(e) {
	if (e.length === 0) return "";
	let [t, ...n] = e;
	if (typeof t != "string") return [I(t), ...n.map(xt)].join(" ");
	let r = 0, i = t.replace(/%([sdjoO%])/g, (e, t) => {
		if (t === "%") return "%";
		if (r >= n.length) return e;
		let i = n[r++];
		if (t === "s") return F(i);
		if (t === "d") try {
			return String(Number(i));
		} catch {
			return "NaN";
		}
		return t === "j" ? yt(i) : I(i);
	}), a = n.slice(r).map(xt);
	return a.length > 0 ? `${i} ${a.join(" ")}` : i;
}
function xt(e) {
	return typeof e == "string" ? e : I(e);
}
function St(e) {
	return e.replace(/[\r\n\u2028\u2029]/g, (e) => e === "\r" ? "\\r" : e === "\n" ? "\\n" : e === "\u2028" ? "\\u2028" : "\\u2029");
}
var L;
function Ct(e) {
	let t = ((...t) => {
		if (!ct(e)) return;
		let n = Date.now(), r = L === void 0 ? 0 : n - L;
		L = n;
		let i = St(bt(t));
		ot(`${e} ${i}`, {
			namespace: e,
			message: i,
			diff: r
		});
	});
	return Object.defineProperties(t, {
		namespace: {
			value: e,
			enumerable: !0
		},
		enabled: {
			get: () => ct(e),
			enumerable: !0
		}
	}), t.extend = (t) => Ct(`${e}:${t}`), t;
}
var wt = Ct("applesauce");
wt.extend("event-cache"), (/* @__PURE__ */ e(((e, t) => {
	t.exports = function e(t, n) {
		if (t === n) return !0;
		if (t && n && typeof t == "object" && typeof n == "object") {
			if (t.constructor !== n.constructor) return !1;
			var r, i, a;
			if (Array.isArray(t)) {
				if (r = t.length, r != n.length) return !1;
				for (i = r; i-- !== 0;) if (!e(t[i], n[i])) return !1;
				return !0;
			}
			if (t.constructor === RegExp) return t.source === n.source && t.flags === n.flags;
			if (t.valueOf !== Object.prototype.valueOf) return t.valueOf() === n.valueOf();
			if (t.toString !== Object.prototype.toString) return t.toString() === n.toString();
			if (a = Object.keys(t), r = a.length, r !== Object.keys(n).length) return !1;
			for (i = r; i-- !== 0;) if (!Object.prototype.hasOwnProperty.call(n, a[i])) return !1;
			for (i = r; i-- !== 0;) {
				var o = a[i];
				if (!e(t[o], n[o])) return !1;
			}
			return !0;
		}
		return t !== t && n !== n;
	};
})))();
var Tt = "abcdefghijklmnopqrstuvwxyz";
new Set((Tt + Tt.toUpperCase()).split("")), (/* @__PURE__ */ e(((e, t) => {
	function n(e, t) {
		for (; e.length < t;) e = "0" + e;
		return e;
	}
	function r(e, t) {
		var n, r, i;
		if (t.length === 0) return e;
		for (n = 0, i = t.length; n < i; n++) r = t.charCodeAt(n), e = (e << 5) - e + r, e |= 0;
		return e < 0 ? e * -2 : e;
	}
	function i(e, t, n) {
		return Object.keys(t).sort().reduce(r, e);
		function r(e, r) {
			return a(e, t[r], r, n);
		}
	}
	function a(e, t, n, a) {
		var s = r(r(r(e, n), o(t)), typeof t);
		if (t === null) return r(s, "null");
		if (t === void 0) return r(s, "undefined");
		if (typeof t == "object" || typeof t == "function") {
			if (a.indexOf(t) !== -1) return r(s, "[Circular]" + n);
			a.push(t);
			var c = i(s, t, a);
			if (!("valueOf" in t) || typeof t.valueOf != "function") return c;
			try {
				return r(c, String(t.valueOf()));
			} catch (e) {
				return r(c, "[valueOf exception]" + (e.stack || e.message));
			}
		}
		return r(s, t.toString());
	}
	function o(e) {
		return Object.prototype.toString.call(e);
	}
	function s(e) {
		return n(a(0, e, "", []).toString(16), 8);
	}
	t.exports = s;
})))();
var Et = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict", Dt = (e = 21) => {
	let t = "", n = crypto.getRandomValues(new Uint8Array(e |= 0));
	for (; e--;) t += Et[n[e] & 63];
	return t;
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/applesauce-relay/dist/helpers/abort.js
function Ot(e) {
	return new h((t) => {
		if (e.aborted) {
			t.next(), t.complete();
			return;
		}
		let n = () => {
			t.next(), t.complete();
		};
		return e.addEventListener("abort", n, { once: !0 }), () => e.removeEventListener("abort", n);
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@noble/hashes/utils.js
function kt(e) {
	return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in e && e.BYTES_PER_ELEMENT === 1;
}
function At(e, t, n = "") {
	let r = kt(e), i = e?.length, a = t !== void 0;
	if (!r || a && i !== t) {
		let o = n && `"${n}" `, s = a ? ` of length ${t}` : "", c = r ? `length=${i}` : `type=${typeof e}`, l = o + "expected Uint8Array" + s + ", got " + c;
		throw r ? RangeError(l) : TypeError(l);
	}
	return e;
}
function jt(e, t = !0) {
	if (e.destroyed) throw Error("Hash instance has been destroyed");
	if (t && e.finished) throw Error("Hash#digest() has already been called");
}
function Mt(e, t) {
	At(e, void 0, "digestInto() output");
	let n = t.outputLen;
	if (e.length < n) throw RangeError("\"digestInto() output\" expected to be of length >=" + n);
}
function R(...e) {
	for (let t = 0; t < e.length; t++) e[t].fill(0);
}
function z(e) {
	return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function B(e, t) {
	return e << 32 - t | e >>> t;
}
function Nt(e, t = {}) {
	let n = (t, n) => e(n).update(t).digest(), r = e(void 0);
	return n.outputLen = r.outputLen, n.blockLen = r.blockLen, n.canXOF = r.canXOF, n.create = (t) => e(t), Object.assign(n, t), Object.freeze(n);
}
var Pt = (e) => ({ oid: Uint8Array.from([
	6,
	9,
	96,
	134,
	72,
	1,
	101,
	3,
	4,
	2,
	e
]) });
// D:/ドキュメント/GitHub/ehagaki/node_modules/@noble/hashes/_md.js
function Ft(e, t, n) {
	return e & t ^ ~e & n;
}
function It(e, t, n) {
	return e & t ^ e & n ^ t & n;
}
var Lt = class {
	blockLen;
	outputLen;
	canXOF = !1;
	padOffset;
	isLE;
	buffer;
	view;
	finished = !1;
	length = 0;
	pos = 0;
	destroyed = !1;
	constructor(e, t, n, r) {
		this.blockLen = e, this.outputLen = t, this.padOffset = n, this.isLE = r, this.buffer = new Uint8Array(e), this.view = z(this.buffer);
	}
	update(e) {
		jt(this), At(e);
		let { view: t, buffer: n, blockLen: r } = this, i = e.length;
		for (let a = 0; a < i;) {
			let o = Math.min(r - this.pos, i - a);
			if (o === r) {
				let t = z(e);
				for (; r <= i - a; a += r) this.process(t, a);
			} else n.set(e.subarray(a, a + o), this.pos), this.pos += o, a += o, this.pos === r && (this.process(t, 0), this.pos = 0);
		}
		return this.length += e.length, this.roundClean(), this;
	}
	digestInto(e) {
		jt(this), Mt(e, this), this.finished = !0;
		let { buffer: t, view: n, blockLen: r, isLE: i } = this, { pos: a } = this;
		t[a++] = 128, R(this.buffer.subarray(a)), this.padOffset > r - a && (this.process(n, 0), a = 0);
		for (let e = a; e < r; e++) t[e] = 0;
		n.setBigUint64(r - 8, BigInt(this.length * 8), i), this.process(n, 0);
		let o = z(e), s = this.outputLen;
		if (s % 4) throw Error("_sha2: outputLen must be aligned to 32bit");
		let c = s / 4, l = this.get();
		if (c > l.length) throw Error("_sha2: outputLen bigger than state");
		for (let e = 0; e < c; e++) o.setUint32(4 * e, l[e], i);
	}
	digest() {
		let { buffer: e, outputLen: t } = this;
		this.digestInto(e);
		let n = e.slice(0, t);
		return this.destroy(), n;
	}
	_cloneInto(e) {
		e ||= new this.constructor(), e.set(...this.get());
		let { blockLen: t, buffer: n, length: r, finished: i, destroyed: a, pos: o } = this;
		return e.destroyed = a, e.finished = i, e.length = r, e.pos = o, r % t && e.buffer.set(n), e;
	}
	clone() {
		return this._cloneInto();
	}
}, V = /* @__PURE__ */ Uint32Array.from([
	1779033703,
	3144134277,
	1013904242,
	2773480762,
	1359893119,
	2600822924,
	528734635,
	1541459225
]), Rt = /* @__PURE__ */ Uint32Array.from([
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
]), H = /* @__PURE__ */ new Uint32Array(64), zt = class extends Lt {
	constructor(e) {
		super(64, e, 8, !1);
	}
	get() {
		let { A: e, B: t, C: n, D: r, E: i, F: a, G: o, H: s } = this;
		return [
			e,
			t,
			n,
			r,
			i,
			a,
			o,
			s
		];
	}
	set(e, t, n, r, i, a, o, s) {
		this.A = e | 0, this.B = t | 0, this.C = n | 0, this.D = r | 0, this.E = i | 0, this.F = a | 0, this.G = o | 0, this.H = s | 0;
	}
	process(e, t) {
		for (let n = 0; n < 16; n++, t += 4) H[n] = e.getUint32(t, !1);
		for (let e = 16; e < 64; e++) {
			let t = H[e - 15], n = H[e - 2], r = B(t, 7) ^ B(t, 18) ^ t >>> 3, i = B(n, 17) ^ B(n, 19) ^ n >>> 10;
			H[e] = i + H[e - 7] + r + H[e - 16] | 0;
		}
		let { A: n, B: r, C: i, D: a, E: o, F: s, G: c, H: l } = this;
		for (let e = 0; e < 64; e++) {
			let t = B(o, 6) ^ B(o, 11) ^ B(o, 25), u = l + t + Ft(o, s, c) + Rt[e] + H[e] | 0, d = (B(n, 2) ^ B(n, 13) ^ B(n, 22)) + It(n, r, i) | 0;
			l = c, c = s, s = o, o = a + u | 0, a = i, i = r, r = n, n = u + d | 0;
		}
		n = n + this.A | 0, r = r + this.B | 0, i = i + this.C | 0, a = a + this.D | 0, o = o + this.E | 0, s = s + this.F | 0, c = c + this.G | 0, l = l + this.H | 0, this.set(n, r, i, a, o, s, c, l);
	}
	roundClean() {
		R(H);
	}
	destroy() {
		this.destroyed = !0, this.set(0, 0, 0, 0, 0, 0, 0, 0), R(this.buffer);
	}
}, Bt = class extends zt {
	A = V[0] | 0;
	B = V[1] | 0;
	C = V[2] | 0;
	D = V[3] | 0;
	E = V[4] | 0;
	F = V[5] | 0;
	G = V[6] | 0;
	H = V[7] | 0;
	constructor() {
		super(32);
	}
}, Vt = /* @__PURE__ */ Nt(() => new Bt(), /* @__PURE__ */ Pt(1)), U = 97, W = 32, Ht = 16, G = {
	Skip: 0,
	Fingerprint: 1,
	IdList: 2
}, K = class e {
	_raw;
	length;
	constructor(e) {
		this._raw = new Uint8Array(e || 512), this.length = e ? e.length : 0;
	}
	unwrap() {
		return this._raw.subarray(0, this.length);
	}
	get capacity() {
		return this._raw.byteLength;
	}
	extend(t) {
		if (t instanceof e && (t = t.unwrap()), typeof t.length != "number") throw Error("bad length");
		let n = t.length + this.length;
		if (this.capacity < n) {
			let e = this._raw, t = Math.max(this.capacity * 2, n);
			this._raw = new Uint8Array(t), this._raw.set(e);
		}
		this._raw.set(t, this.length), this.length += t.length;
	}
	shift() {
		let e = this._raw[0];
		return this._raw = this._raw.subarray(1), this.length--, e;
	}
	shiftN(e = 1) {
		let t = this._raw.subarray(0, e);
		return this._raw = this._raw.subarray(e), this.length -= e, t;
	}
};
function q(e) {
	let t = 0, n = 0;
	for (;;) {
		if (e.length === 0) throw Error("parse ends prematurely");
		let r = e.shift();
		if (t = t * 128 + (r & 127), t > 2 ** 53 - 1) throw Error("varint too large");
		if (++n > 8) throw Error("varint too long");
		if (!(r & 128)) break;
	}
	return t;
}
function J(e) {
	if (!Number.isSafeInteger(e) || e < 0) throw Error("varint out of range");
	if (e === 0) return new K([0]);
	let t = [];
	for (; e !== 0;) t.push(e % 128), e = Math.floor(e / 128);
	t.reverse();
	for (let e = 0; e < t.length - 1; e++) t[e] |= 128;
	return new K(t);
}
function Ut(e) {
	return Y(e, 1)[0];
}
function Y(e, t) {
	if (e.length < t) throw Error("parse ends prematurely");
	return e.shiftN(t);
}
var Wt = class {
	buf;
	sha256;
	constructor() {
		this.buf = new Uint8Array(W), this.sha256 = async (e) => Vt.create().update(e).digest();
	}
	setToZero() {
		this.buf = new Uint8Array(W);
	}
	add(e) {
		let t = 0, n = 0, r = new DataView(this.buf.buffer), i = new DataView(e.buffer);
		for (let e = 0; e < 8; e++) {
			let a = e * 4, o = r.getUint32(a, !0), s = i.getUint32(a, !0), c = o;
			c += t, c += s, c > 4294967295 && (n = 1), r.setUint32(a, c | 0, !0), t = n, n = 0;
		}
	}
	negate() {
		let e = new DataView(this.buf.buffer);
		for (let t = 0; t < 8; t++) {
			let n = t * 4;
			e.setUint32(n, ~e.getUint32(n, !0));
		}
		let t = new Uint8Array(W);
		t[0] = 1, this.add(t);
	}
	async getFingerprint(e) {
		let t = new K();
		return t.extend(this.buf), t.extend(J(e)), (await this.sha256(t.unwrap())).subarray(0, Ht);
	}
}, Gt = class {
	items;
	sealed;
	constructor() {
		this.items = [], this.sealed = !1;
	}
	insert(e, t) {
		if (this.sealed) throw Error("already sealed");
		if (t = qt(t), t.byteLength !== W) throw Error("bad id size for added item");
		this.items.push({
			timestamp: e,
			id: t
		});
	}
	seal() {
		if (this.sealed) throw Error("already sealed");
		this.sealed = !0, this.items.sort(Z);
		for (let e = 1; e < this.items.length; e++) if (Z(this.items[e - 1], this.items[e]) === 0) throw Error("duplicate item inserted");
	}
	unseal() {
		this.sealed = !1;
	}
	size() {
		return this._checkSealed(), this.items.length;
	}
	getItem(e) {
		if (this._checkSealed(), e >= this.items.length) throw Error("out of range");
		return this.items[e];
	}
	iterate(e, t, n) {
		this._checkSealed(), this._checkBounds(e, t);
		for (let r = e; r < t && n(this.items[r], r); ++r);
	}
	findLowerBound(e, t, n) {
		return this._checkSealed(), this._checkBounds(e, t), this._binarySearch(this.items, e, t, (e) => Z(e, n) < 0);
	}
	async fingerprint(e, t) {
		let n = new Wt();
		return n.setToZero(), this.iterate(e, t, (e, t) => (n.add(e.id), !0)), await n.getFingerprint(t - e);
	}
	_checkSealed() {
		if (!this.sealed) throw Error("not sealed");
	}
	_checkBounds(e, t) {
		if (e > t || t > this.items.length) throw Error("bad range");
	}
	_binarySearch(e, t, n, r) {
		let i = n - t;
		for (; i > 0;) {
			let n = t, a = Math.floor(i / 2);
			n += a, r(e[n]) ? (t = ++n, i -= a + 1) : i = a;
		}
		return t;
	}
}, Kt = class {
	storage;
	frameSizeLimit;
	lastTimestampIn;
	lastTimestampOut;
	isInitiator;
	wantUint8ArrayOutput;
	constructor(e, t = 0) {
		if (t !== 0 && t < 4096) throw Error("frameSizeLimit too small");
		this.storage = e, this.frameSizeLimit = t, this.lastTimestampIn = 0, this.lastTimestampOut = 0;
	}
	_bound(e, t) {
		return {
			timestamp: e,
			id: t || /* @__PURE__ */ new Uint8Array()
		};
	}
	async initiate() {
		if (this.isInitiator) throw Error("already initiated");
		this.isInitiator = !0;
		let e = new K();
		return e.extend([U]), await this.splitRange(0, this.storage.size(), this._bound(Number.MAX_VALUE), e), this._renderOutput(e);
	}
	setInitiator() {
		this.isInitiator = !0;
	}
	async reconcile(e) {
		let t = [], n = [], r = new K(qt(e));
		this.lastTimestampIn = this.lastTimestampOut = 0;
		let i = new K();
		i.extend([U]);
		let a = Ut(r);
		if (a < 96 || a > 111) throw Error("invalid negentropy protocol version byte");
		if (a !== U) {
			if (this.isInitiator) throw Error("unsupported negentropy protocol version requested: " + (a - 96));
			return [
				this._renderOutput(i),
				t,
				n
			];
		}
		let o = this.storage.size(), s = this._bound(0), c = 0, l = !1;
		for (; r.length !== 0;) {
			let e = new K(), a = () => {
				l && (l = !1, e.extend(this.encodeBound(s)), e.extend(J(G.Skip)));
			}, u = this.decodeBound(r), d = q(r), f = c, p = this.storage.findLowerBound(c, o, u);
			if (d === G.Skip) l = !0;
			else if (d === G.Fingerprint) Xt(Y(r, Ht), await this.storage.fingerprint(f, p)) === 0 ? l = !0 : (a(), await this.splitRange(f, p, u, e));
			else if (d === G.IdList) {
				let o = q(r), s = {};
				for (let e = 0; e < o; e++) {
					let e = Y(r, W);
					this.isInitiator && (s[e] = e);
				}
				if (this.isInitiator) {
					l = !0, this.storage.iterate(f, p, (e) => {
						let n = e.id;
						return s[n] ? delete s[n] : this.isInitiator && t.push(this.wantUint8ArrayOutput ? n : X(n)), !0;
					});
					for (let e of Object.values(s)) n.push(this.wantUint8ArrayOutput ? e : X(e));
				} else {
					a();
					let t = new K(), n = 0, r = u;
					this.storage.iterate(f, p, (e, a) => this.exceededFrameSizeLimit(i.length + t.length) ? (r = e, p = a, !1) : (t.extend(e.id), n++, !0)), e.extend(this.encodeBound(r)), e.extend(J(G.IdList)), e.extend(J(n)), e.extend(t), i.extend(e), e = new K();
				}
			} else throw Error("unexpected mode");
			if (this.exceededFrameSizeLimit(i.length + e.length)) {
				let e = await this.storage.fingerprint(p, o);
				i.extend(this.encodeBound(this._bound(Number.MAX_VALUE))), i.extend(J(G.Fingerprint)), i.extend(e);
				break;
			}
			i.extend(e), c = p, s = u;
		}
		return [
			i.length === 1 && this.isInitiator ? null : this._renderOutput(i),
			t,
			n
		];
	}
	async splitRange(e, t, n, r) {
		let i = t - e;
		if (i < 32) r.extend(this.encodeBound(n)), r.extend(J(G.IdList)), r.extend(J(i)), this.storage.iterate(e, t, (e) => (r.extend(e.id), !0));
		else {
			let a = Math.floor(i / 16), o = i % 16, s = e;
			for (let e = 0; e < 16; e++) {
				let i = a + +(e < o), c = await this.storage.fingerprint(s, s + i);
				s += i;
				let l;
				if (s === t) l = n;
				else {
					let e, t;
					this.storage.iterate(s - 1, s + 1, (n, r) => (r === s - 1 ? e = n : t = n, !0)), l = this.getMinimalBound(e, t);
				}
				r.extend(this.encodeBound(l)), r.extend(J(G.Fingerprint)), r.extend(c);
			}
		}
	}
	_renderOutput(e) {
		let t = e.unwrap();
		return this.wantUint8ArrayOutput ? t : X(t);
	}
	exceededFrameSizeLimit(e) {
		return this.frameSizeLimit && e > this.frameSizeLimit - 200;
	}
	decodeTimestampIn(e) {
		let t = q(e);
		return t = t === 0 ? Number.MAX_VALUE : t - 1, this.lastTimestampIn === Number.MAX_VALUE || t === Number.MAX_VALUE ? (this.lastTimestampIn = Number.MAX_VALUE, Number.MAX_VALUE) : (t += this.lastTimestampIn, this.lastTimestampIn = t, t);
	}
	decodeBound(e) {
		let t = this.decodeTimestampIn(e), n = q(e);
		if (n > W) throw Error("bound key too long");
		return {
			timestamp: t,
			id: Y(e, n)
		};
	}
	encodeTimestampOut(e) {
		if (e === Number.MAX_VALUE) return this.lastTimestampOut = Number.MAX_VALUE, J(0);
		let t = e;
		return e -= this.lastTimestampOut, this.lastTimestampOut = t, J(e + 1);
	}
	encodeBound(e) {
		let t = new K();
		return t.extend(this.encodeTimestampOut(e.timestamp)), t.extend(J(e.id.length)), t.extend(e.id), t;
	}
	getMinimalBound(e, t) {
		if (t.timestamp !== e.timestamp) return this._bound(t.timestamp);
		{
			let n = 0, r = t.id, i = e.id;
			for (let e = 0; e < W && r[e] === i[e]; e++) n++;
			return this._bound(t.timestamp, t.id.subarray(0, n + 1));
		}
	}
};
function qt(e) {
	return typeof e == "string" && (e = Jt(e)), e;
}
function Jt(e) {
	if (e.startsWith("0x") && (e = e.substr(2)), e.length % 2 == 1) throw Error("odd length of hex string");
	let t = new Uint8Array(e.length / 2);
	for (let n = 0; n < t.length; n++) t[n] = parseInt(e.substr(n * 2, 2), 16);
	return t;
}
var Yt = Array(256);
{
	let e = [
		"0",
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"a",
		"b",
		"c",
		"d",
		"e",
		"f"
	];
	for (let t = 0; t < 256; t++) Yt[t] = e[t >>> 4 & 15] + e[t & 15];
}
function X(e) {
	let t = "";
	for (let n = 0, r = e.length; n < r; n++) t += Yt[e[n]];
	return t;
}
function Xt(e, t) {
	for (let n = 0; n < e.byteLength; n++) {
		if (e[n] < t[n]) return -1;
		if (e[n] > t[n]) return 1;
	}
	return e.byteLength > t.byteLength ? 1 : e.byteLength < t.byteLength ? -1 : 0;
}
function Z(e, t) {
	return e.timestamp === t.timestamp ? Xt(e.id, t.id) : e.timestamp - t.timestamp;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/applesauce-relay/dist/negentropy.js
var Q = wt.extend("negentropy"), Zt = class extends Error {
	reason;
	constructor(e) {
		super(e), this.reason = e, this.name = "NegentropyError";
	}
};
function Qt(e) {
	let t = new Gt();
	for (let n of e) t.insert(n.created_at, n.id);
	return t.seal(), t;
}
function $t(e, t, n, r) {
	let i = r?.id ?? Dt(), a = r?.signal ? Ot(r.signal) : Pe;
	return O(() => {
		if (r?.signal?.aborted) return b;
		let o = new Kt(e, r?.frameSizeLimit), s = !1;
		return E(o.initiate()).pipe(Be((e) => t.multiplex(() => (Q("Sending initial message", i, n, e), [
			"NEG-OPEN",
			i,
			n,
			e
		]), () => (Q("Closing sync", i), ["NEG-CLOSE", i]), (e) => (e[0] === "NEG-MSG" || e[0] === "NEG-ERR") && e[1] === i).pipe(_((e) => {
			if (e[0] === "NEG-ERR") throw new Zt(e[2]);
			return e[2];
		}), Fe(async (e) => {
			let [n, r, a] = await o.reconcile(e);
			return n === null && (s = !0), n !== null && t.next([
				"NEG-MSG",
				i,
				n
			]), {
				followUp: n,
				round: {
					have: r,
					need: a
				}
			};
		}), He(({ followUp: e }) => e !== null, !0), _(({ round: e }) => e), Le(O(() => s ? b : Ae(() => new Zt("error: negotiation completed before terminal round")))), Ve(a))), Re(() => Q("Finished sync", i)));
	}).pipe(ze());
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryFullScanNegentropy.ts
var $ = /^[0-9a-f]{64}$/, en = 5e3, tn = 262144, nn = 256, rn = 1e5;
async function an(e, r = ne) {
	let i = new Map(e.relayUrls.map((e) => [e, /* @__PURE__ */ new Map()])), a;
	for (; e.isActive();) {
		let o = await r.getSearchScanChunk({
			pubkeyHex: e.owner,
			cursor: a,
			limit: 500
		});
		if (!e.isActive()) break;
		for (let r of o.items) {
			let a = r.rawEvent, o = r.rawEventVerification;
			if (r.pubkeyHex !== e.owner || !e.kinds.includes(r.kind) || !Number.isSafeInteger(r.createdAt) || r.createdAt < 0 || r.createdAt > e.until || o?.status !== "valid" || o.ruleVersion !== 1 || !n(a, r) || !$.test(a.id)) continue;
			let s = {
				id: a.id,
				created_at: a.created_at
			};
			for (let e of r.fetchedRelays ?? []) {
				let n = t.normalizeExternalRelayUrl(e);
				n && i.get(n)?.set(a.id, s);
			}
		}
		if (!o.hasMore || !o.nextCursor) break;
		a = o.nextCursor;
	}
	return new Map([...i].map(([e, t]) => [e, [...t.values()]]));
}
function on(e) {
	return new Promise((t) => {
		let n = null, r = new g(Math.min(35e3, e.timeoutMs), () => t(n));
		if (r.bind(e.signal), !r.reason) {
			r.schedule("first-response", r.startedAt + en, () => r.finish("timeout"));
			try {
				let t = Qt(e.seed), i = new Set(e.seed.map(({ id: e }) => e)), a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set(), s = (e) => {}, c = $t(t, {
					next: (e) => {
						r.reason || s(e);
					},
					multiplex: (t, n, i) => new h((a) => {
						let o = new WebSocket(e.relayUrl), c = !1;
						s = (e) => {
							c = !0;
							try {
								o.send(JSON.stringify(e));
							} catch {
								r.finish("error");
							}
						};
						let l = () => s(t()), u = () => a.error(/* @__PURE__ */ Error("Negentropy connection ended")), d = 0, f = ({ data: e }) => {
							try {
								if (typeof e != "string" || e.length > 263168) throw Error("Invalid Negentropy frame size");
								let t = JSON.parse(e);
								if (!Array.isArray(t) || t[0] === "AUTH") throw Error("Invalid Negentropy response or relay requires authentication");
								if (!i(t)) return;
								if (!c) throw Error("Unexpected Negentropy response");
								if (c = !1, t[0] === "NEG-MSG") {
									let e = t[2];
									if (typeof e != "string" || e.length > tn || e.length < 2 || e.length % 2 || !/^[0-9a-f]+$/i.test(e) || ++d > nn) throw Error("Invalid Negentropy message");
									r.unschedule("first-response");
								}
								a.next(t);
							} catch (e) {
								a.error(e);
							}
						};
						return o.addEventListener("open", l), o.addEventListener("close", u), o.addEventListener("error", u), o.addEventListener("message", f), () => {
							if (o.removeEventListener("open", l), o.removeEventListener("close", u), o.removeEventListener("error", u), o.removeEventListener("message", f), s = () => void 0, o.readyState === WebSocket.OPEN) try {
								o.send(JSON.stringify(n()));
							} catch {}
							o.close();
						};
					})
				}, e.filter, { frameSizeLimit: 5e4 }).subscribe({
					next: ({ have: e, need: t }) => {
						e.some((e) => !i.has(e)) || t.some((e) => !$.test(e) || i.has(e)) ? r.finish("error") : (e.forEach((e) => a.add(e)), t.forEach((e) => o.add(e)), o.size > rn && r.finish("error"));
					},
					error: () => r.finish("error"),
					complete: () => {
						r.reason || (n = {
							ids: [...o],
							hasMatchedLocalEvents: a.size < i.size
						}, r.finish());
					}
				});
				r.add(() => c.unsubscribe());
			} catch {
				r.finish("error");
			}
		}
	});
}
export { an as readPostHistoryNegentropySeeds, on as reconcilePostHistoryRelay };
