import { d as e, o as t } from "./tslib.es6-BgJxuhU8.js";
import { g as n, h as r, i, m as a, p as o, u as s } from "./operation-BO0VLD7w.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/util/ObjectUnsubscribedError.js
var c = n(function(e) {
	return function() {
		e(this), this.name = "ObjectUnsubscribedError", this.message = "object unsubscribed";
	};
}), l = function(n) {
	t(l, n);
	function l() {
		var e = n.call(this) || this;
		return e.closed = !1, e.currentObservers = null, e.observers = [], e.isStopped = !1, e.hasError = !1, e.thrownError = null, e;
	}
	return l.prototype.lift = function(e) {
		var t = new u(this, this);
		return t.operator = e, t;
	}, l.prototype._throwIfClosed = function() {
		if (this.closed) throw new c();
	}, l.prototype.next = function(t) {
		var n = this;
		s(function() {
			var r, i;
			if (n._throwIfClosed(), !n.isStopped) {
				n.currentObservers ||= Array.from(n.observers);
				try {
					for (var a = e(n.currentObservers), o = a.next(); !o.done; o = a.next()) o.value.next(t);
				} catch (e) {
					r = { error: e };
				} finally {
					try {
						o && !o.done && (i = a.return) && i.call(a);
					} finally {
						if (r) throw r.error;
					}
				}
			}
		});
	}, l.prototype.error = function(e) {
		var t = this;
		s(function() {
			if (t._throwIfClosed(), !t.isStopped) {
				t.hasError = t.isStopped = !0, t.thrownError = e;
				for (var n = t.observers; n.length;) n.shift().error(e);
			}
		});
	}, l.prototype.complete = function() {
		var e = this;
		s(function() {
			if (e._throwIfClosed(), !e.isStopped) {
				e.isStopped = !0;
				for (var t = e.observers; t.length;) t.shift().complete();
			}
		});
	}, l.prototype.unsubscribe = function() {
		this.isStopped = this.closed = !0, this.observers = this.currentObservers = null;
	}, Object.defineProperty(l.prototype, "observed", {
		get: function() {
			return this.observers?.length > 0;
		},
		enumerable: !1,
		configurable: !0
	}), l.prototype._trySubscribe = function(e) {
		return this._throwIfClosed(), n.prototype._trySubscribe.call(this, e);
	}, l.prototype._subscribe = function(e) {
		return this._throwIfClosed(), this._checkFinalizedStatuses(e), this._innerSubscribe(e);
	}, l.prototype._innerSubscribe = function(e) {
		var t = this, n = this, i = n.hasError, s = n.isStopped, c = n.observers;
		return i || s ? o : (this.currentObservers = null, c.push(e), new a(function() {
			t.currentObservers = null, r(c, e);
		}));
	}, l.prototype._checkFinalizedStatuses = function(e) {
		var t = this, n = t.hasError, r = t.thrownError, i = t.isStopped;
		n ? e.error(r) : i && e.complete();
	}, l.prototype.asObservable = function() {
		var e = new i();
		return e.source = this, e;
	}, l.create = function(e, t) {
		return new u(e, t);
	}, l;
}(i), u = function(e) {
	t(n, e);
	function n(t, n) {
		var r = e.call(this) || this;
		return r.destination = t, r.source = n, r;
	}
	return n.prototype.next = function(e) {
		var t, n;
		(n = (t = this.destination)?.next) == null || n.call(t, e);
	}, n.prototype.error = function(e) {
		var t, n;
		(n = (t = this.destination)?.error) == null || n.call(t, e);
	}, n.prototype.complete = function() {
		var e, t;
		(t = (e = this.destination)?.complete) == null || t.call(e);
	}, n.prototype._subscribe = function(e) {
		return this.source?.subscribe(e) ?? o;
	}, n;
}(l);
export { l as t };
