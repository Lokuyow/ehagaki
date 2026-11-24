import { c as e, d as t, o as n, u as r } from "./tslib.es6-BgJxuhU8.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/util/isFunction.js
function i(e) {
	return typeof e == "function";
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/util/createErrorClass.js
function a(e) {
	var t = e(function(e) {
		Error.call(e), e.stack = (/* @__PURE__ */ Error()).stack;
	});
	return t.prototype = Object.create(Error.prototype), t.prototype.constructor = t, t;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/util/UnsubscriptionError.js
var o = a(function(e) {
	return function(t) {
		e(this), this.message = t ? t.length + " errors occurred during unsubscription:\n" + t.map(function(e, t) {
			return t + 1 + ") " + e.toString();
		}).join("\n  ") : "", this.name = "UnsubscriptionError", this.errors = t;
	};
});
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/util/arrRemove.js
function s(e, t) {
	if (e) {
		var n = e.indexOf(t);
		0 <= n && e.splice(n, 1);
	}
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/Subscription.js
var c = function() {
	function n(e) {
		this.initialTeardown = e, this.closed = !1, this._parentage = null, this._finalizers = null;
	}
	return n.prototype.unsubscribe = function() {
		var n, a, s, c, l;
		if (!this.closed) {
			this.closed = !0;
			var u = this._parentage;
			if (u) {
				if (this._parentage = null, Array.isArray(u)) try {
					for (var f = t(u), p = f.next(); !p.done; p = f.next()) p.value.remove(this);
				} catch (e) {
					n = { error: e };
				} finally {
					try {
						p && !p.done && (a = f.return) && a.call(f);
					} finally {
						if (n) throw n.error;
					}
				}
				else u.remove(this);
			}
			var m = this.initialTeardown;
			if (i(m)) try {
				m();
			} catch (e) {
				l = e instanceof o ? e.errors : [e];
			}
			var h = this._finalizers;
			if (h) {
				this._finalizers = null;
				try {
					for (var g = t(h), _ = g.next(); !_.done; _ = g.next()) {
						var v = _.value;
						try {
							d(v);
						} catch (t) {
							l ??= [], t instanceof o ? l = r(r([], e(l)), e(t.errors)) : l.push(t);
						}
					}
				} catch (e) {
					s = { error: e };
				} finally {
					try {
						_ && !_.done && (c = g.return) && c.call(g);
					} finally {
						if (s) throw s.error;
					}
				}
			}
			if (l) throw new o(l);
		}
	}, n.prototype.add = function(e) {
		if (e && e !== this) {
			if (this.closed) d(e);
			else {
				if (e instanceof n) {
					if (e.closed || e._hasParent(this)) return;
					e._addParent(this);
				}
				(this._finalizers = this._finalizers ?? []).push(e);
			}
		}
	}, n.prototype._hasParent = function(e) {
		var t = this._parentage;
		return t === e || Array.isArray(t) && t.includes(e);
	}, n.prototype._addParent = function(e) {
		var t = this._parentage;
		this._parentage = Array.isArray(t) ? (t.push(e), t) : t ? [t, e] : e;
	}, n.prototype._removeParent = function(e) {
		var t = this._parentage;
		t === e ? this._parentage = null : Array.isArray(t) && s(t, e);
	}, n.prototype.remove = function(e) {
		var t = this._finalizers;
		t && s(t, e), e instanceof n && e._removeParent(this);
	}, n.EMPTY = (function() {
		var e = new n();
		return e.closed = !0, e;
	})(), n;
}(), l = c.EMPTY;
function u(e) {
	return e instanceof c || e && "closed" in e && i(e.remove) && i(e.add) && i(e.unsubscribe);
}
function d(e) {
	i(e) ? e() : e.unsubscribe();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/config.js
var f = {
	onUnhandledError: null,
	onStoppedNotification: null,
	Promise: void 0,
	useDeprecatedSynchronousErrorHandling: !1,
	useDeprecatedNextContext: !1
}, p = {
	setTimeout: function(t, n) {
		var i = [...arguments].slice(2), a = p.delegate;
		return a?.setTimeout ? a.setTimeout.apply(a, r([t, n], e(i))) : setTimeout.apply(void 0, r([t, n], e(i)));
	},
	clearTimeout: function(e) {
		return (p.delegate?.clearTimeout || clearTimeout)(e);
	},
	delegate: void 0
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/util/reportUnhandledError.js
function m(e) {
	p.setTimeout(function() {
		var t = f.onUnhandledError;
		if (t) t(e);
		else throw e;
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/util/noop.js
function h() {}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/NotificationFactories.js
var g = (function() {
	return y("C", void 0, void 0);
})();
function _(e) {
	return y("E", void 0, e);
}
function v(e) {
	return y("N", e, void 0);
}
function y(e, t, n) {
	return {
		kind: e,
		value: t,
		error: n
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/util/errorContext.js
var b = null;
function x(e) {
	if (f.useDeprecatedSynchronousErrorHandling) {
		var t = !b;
		if (t && (b = {
			errorThrown: !1,
			error: null
		}), e(), t) {
			var n = b, r = n.errorThrown, i = n.error;
			if (b = null, r) throw i;
		}
	} else e();
}
function S(e) {
	f.useDeprecatedSynchronousErrorHandling && b && (b.errorThrown = !0, b.error = e);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/Subscriber.js
var C = function(e) {
	n(t, e);
	function t(t) {
		var n = e.call(this) || this;
		return n.isStopped = !1, t ? (n.destination = t, u(t) && t.add(n)) : n.destination = j, n;
	}
	return t.create = function(e, t, n) {
		return new D(e, t, n);
	}, t.prototype.next = function(e) {
		this.isStopped ? A(v(e), this) : this._next(e);
	}, t.prototype.error = function(e) {
		this.isStopped ? A(_(e), this) : (this.isStopped = !0, this._error(e));
	}, t.prototype.complete = function() {
		this.isStopped ? A(g, this) : (this.isStopped = !0, this._complete());
	}, t.prototype.unsubscribe = function() {
		this.closed || (this.isStopped = !0, e.prototype.unsubscribe.call(this), this.destination = null);
	}, t.prototype._next = function(e) {
		this.destination.next(e);
	}, t.prototype._error = function(e) {
		try {
			this.destination.error(e);
		} finally {
			this.unsubscribe();
		}
	}, t.prototype._complete = function() {
		try {
			this.destination.complete();
		} finally {
			this.unsubscribe();
		}
	}, t;
}(c), w = Function.prototype.bind;
function T(e, t) {
	return w.call(e, t);
}
var E = function() {
	function e(e) {
		this.partialObserver = e;
	}
	return e.prototype.next = function(e) {
		var t = this.partialObserver;
		if (t.next) try {
			t.next(e);
		} catch (e) {
			O(e);
		}
	}, e.prototype.error = function(e) {
		var t = this.partialObserver;
		if (t.error) try {
			t.error(e);
		} catch (e) {
			O(e);
		}
		else O(e);
	}, e.prototype.complete = function() {
		var e = this.partialObserver;
		if (e.complete) try {
			e.complete();
		} catch (e) {
			O(e);
		}
	}, e;
}(), D = function(e) {
	n(t, e);
	function t(t, n, r) {
		var a = e.call(this) || this, o;
		if (i(t) || !t) o = {
			next: t ?? void 0,
			error: n ?? void 0,
			complete: r ?? void 0
		};
		else {
			var s;
			a && f.useDeprecatedNextContext ? (s = Object.create(t), s.unsubscribe = function() {
				return a.unsubscribe();
			}, o = {
				next: t.next && T(t.next, s),
				error: t.error && T(t.error, s),
				complete: t.complete && T(t.complete, s)
			}) : o = t;
		}
		return a.destination = new E(o), a;
	}
	return t;
}(C);
function O(e) {
	f.useDeprecatedSynchronousErrorHandling ? S(e) : m(e);
}
function k(e) {
	throw e;
}
function A(e, t) {
	var n = f.onStoppedNotification;
	n && p.setTimeout(function() {
		return n(e, t);
	});
}
var j = {
	closed: !0,
	next: h,
	error: k,
	complete: h
}, M = (function() {
	return typeof Symbol == "function" && Symbol.observable || "@@observable";
})();
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/util/identity.js
function N(e) {
	return e;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/util/pipe.js
function P() {
	return F([...arguments]);
}
function F(e) {
	return e.length === 0 ? N : e.length === 1 ? e[0] : function(t) {
		return e.reduce(function(e, t) {
			return t(e);
		}, t);
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/Observable.js
var I = function() {
	function e(e) {
		e && (this._subscribe = e);
	}
	return e.prototype.lift = function(t) {
		var n = new e();
		return n.source = this, n.operator = t, n;
	}, e.prototype.subscribe = function(e, t, n) {
		var r = this, i = z(e) ? e : new D(e, t, n);
		return x(function() {
			var e = r, t = e.operator, n = e.source;
			i.add(t ? t.call(i, n) : n ? r._subscribe(i) : r._trySubscribe(i));
		}), i;
	}, e.prototype._trySubscribe = function(e) {
		try {
			return this._subscribe(e);
		} catch (t) {
			e.error(t);
		}
	}, e.prototype.forEach = function(e, t) {
		var n = this;
		return t = L(t), new t(function(t, r) {
			var i = new D({
				next: function(t) {
					try {
						e(t);
					} catch (e) {
						r(e), i.unsubscribe();
					}
				},
				error: r,
				complete: t
			});
			n.subscribe(i);
		});
	}, e.prototype._subscribe = function(e) {
		return this.source?.subscribe(e);
	}, e.prototype[M] = function() {
		return this;
	}, e.prototype.pipe = function() {
		return F([...arguments])(this);
	}, e.prototype.toPromise = function(e) {
		var t = this;
		return e = L(e), new e(function(e, n) {
			var r;
			t.subscribe(function(e) {
				return r = e;
			}, function(e) {
				return n(e);
			}, function() {
				return e(r);
			});
		});
	}, e.create = function(t) {
		return new e(t);
	}, e;
}();
function L(e) {
	return e ?? f.Promise ?? Promise;
}
function R(e) {
	return e && i(e.next) && i(e.error) && i(e.complete);
}
function z(e) {
	return e && e instanceof C || R(e) && u(e);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/relay/operation.ts
var B = 6e3, V = class {
	onEnd;
	now;
	startedAt;
	signal;
	reason;
	controller = new AbortController();
	deadlines = /* @__PURE__ */ new Map();
	cleanups = /* @__PURE__ */ new Set();
	timer;
	firing = !1;
	setTimer;
	clearTimer;
	constructor(e, t, n = {}) {
		this.onEnd = t, this.now = n.now ?? Date.now, this.startedAt = this.now(), this.signal = this.controller.signal;
		let r = n.setTimeoutFn ?? setTimeout, i = n.clearTimeoutFn ?? clearTimeout;
		this.setTimer = (e, t) => r(e, t), this.clearTimer = (e) => i(e), this.setDeadline(this.startedAt + e);
	}
	add(e) {
		return this.reason ? e() : this.cleanups.add(e), () => this.cleanups.delete(e);
	}
	bind(e) {
		if (!e) return;
		let t = () => this.finish("cancelled");
		e.addEventListener("abort", t, { once: !0 }), this.add(() => e.removeEventListener("abort", t)), e.aborted && t();
	}
	setDeadline(e) {
		this.schedule("deadline", e, () => this.finish("timeout"));
	}
	schedule(e, t, n) {
		this.reason || (this.deadlines.set(e, {
			at: t,
			run: n
		}), this.arm());
	}
	unschedule(e) {
		this.deadlines.delete(e), this.arm();
	}
	finish(e = "complete") {
		if (!this.reason) {
			this.reason = e, this.timer !== void 0 && this.clearTimer(this.timer), this.timer = void 0, this.deadlines.clear(), this.controller.abort();
			for (let e of this.cleanups) e();
			this.cleanups.clear(), this.onEnd(e);
		}
	}
	arm() {
		if (this.firing || (this.timer !== void 0 && this.clearTimer(this.timer), this.timer = void 0, this.reason || !this.deadlines.size)) return;
		let [e, t] = [...this.deadlines].sort((e, t) => e[1].at - t[1].at)[0];
		this.timer = this.setTimer(() => {
			this.timer = void 0, this.firing = !0;
			try {
				for (this.deadlines.delete(e), t.run(); !this.reason;) {
					let e = [...this.deadlines].sort((e, t) => e[1].at - t[1].at)[0];
					if (!e || e[1].at > Math.max(this.now(), t.at)) break;
					this.deadlines.delete(e[0]), e[1].run();
				}
			} finally {
				this.firing = !1, this.arm();
			}
		}, Math.max(0, t.at - this.now()));
	}
};
function H(e, t, n, r = (t) => e.finish(t)) {
	let i = !1, a = !1, o = {};
	return () => {
		e.reason || i || (i = !0, queueMicrotask(() => {
			i = !1, !e.reason && (t.every((e) => e.finished) ? r(t.every((e) => e.failed) ? "error" : "complete") : n && !a && t.filter((e) => e.eoseReceived && e.verificationDrained).length >= Math.ceil(t.length * .6) && (a = !0, e.schedule(o, e.now() + 300, () => r("quorum"))));
		}));
	};
}
export { i as _, P as a, D as c, h as d, m as f, a as g, s as h, I as i, C as l, c as m, V as n, N as o, l as p, H as r, M as s, B as t, x as u };
