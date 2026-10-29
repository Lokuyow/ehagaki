import { n as e } from "./relayConfigUtils-DD5f1UAM.js";
import { a as t, n, o as r, r as i } from "./tslib.es6-j0rGxSfD.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/rx-nostr/dist/rx-nostr.js
var a = Object.defineProperty, o = (e, t, n) => t in e ? a(e, t, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: n
}) : e[t] = n, s = (e, t, n) => (o(e, typeof t == "symbol" ? t : t + "", n), n), c = class extends Error {}, l = class extends c {
	constructor(e) {
		super(`RxNostrWebSocketError: WebSocket was closed with code ${e} by relay.`), this.code = e, this.name = "RxNostrWebSocketError";
	}
}, u = class extends c {
	constructor(e) {
		super(`RxNostrInvalidUsageError: ${e}`), this.name = "RxNostrInvalidUsageError";
	}
}, d = class extends c {
	constructor(e) {
		super(`RxNostrEnvironmentError: ${e}`), this.name = "RxNostrEnvironmentError";
	}
}, f = class extends c {
	constructor() {
		super("RxNostrLogicError: This is rx-nostr's internal bug. Please report to the author of the library."), this.name = "RxNostrLogicError";
	}
}, p = class extends c {
	constructor() {
		super("RxNostrAlreadyDisposedError: Attempted to access a disposed resource."), this.name = "RxNostrAlreadyDisposedError";
	}
}, m = (e, t) => ({
	...t,
	...e
});
function h(e) {
	if (typeof e.id != "string" || typeof e.sig != "string" || typeof e.kind != "number" || typeof e.pubkey != "string" || typeof e.content != "string" || typeof e.created_at != "number" || !Array.isArray(e.tags)) return !1;
	for (let t = 0; t < e.tags.length; t++) {
		let n = e.tags[t];
		if (!Array.isArray(n)) return !1;
		for (let e = 0; e < n.length; e++) if (typeof n[e] == "object") return !1;
	}
	return !0;
}
function g(e) {
	throw e;
}
function _(e) {
	return {
		async signEvent(t) {
			let n = {
				...t,
				pubkey: t.pubkey ?? await (window == null ? void 0 : window.nostr)?.getPublicKey() ?? g(new d("window.nostr.getPublicKey() is not found")),
				tags: [...t.tags ?? [], ...e?.tags ?? []],
				created_at: t.created_at ?? Math.floor(Date.now() / 1e3)
			};
			return h(n) ? n : await (window == null ? void 0 : window.nostr)?.signEvent(n) ?? g(new d("window.nostr.signEvent() is not found"));
		},
		getPublicKey() {
			return (window == null ? void 0 : window.nostr)?.getPublicKey() ?? g(new d("window.nostr.getPublicKey() is not found"));
		}
	};
}
function ee() {
	return {
		async signEvent(e) {
			return e;
		},
		async getPublicKey() {
			throw new u("noopSigner cannot calculate pubkey.");
		}
	};
}
var v = async () => {
	throw Error("You must give some verifier to createRxNostr(). In most cases, @rx-nostr/crypto packages will help you.");
}, y = (e) => m(e, {
	signer: _(),
	verifier: v,
	connectionStrategy: "lazy",
	retry: {
		strategy: "exponential",
		maxCount: 5,
		initialDelay: 1e3
	},
	disconnectTimeout: 1e4,
	eoseTimeout: 3e4,
	okTimeout: 3e4,
	authTimeout: 3e4,
	skipVerify: !1,
	skipValidateFilterMatching: !1,
	skipExpirationCheck: !1,
	skipFetchNip11: !1
});
function te(e) {
	return "length" in e ? e.map(ne) : [ne(e)];
}
function ne(e) {
	return {
		...e,
		since: e.since ? re(e.since) : void 0,
		until: e.until ? re(e.until) : void 0
	};
}
function re(e) {
	return typeof e == "number" ? e : e();
}
async function ie(e) {
	try {
		let t = new URL(e);
		return t.protocol = t.protocol.replace(/^ws(s?):/, "http$1:"), await (await fetch(t.toString(), { headers: { Accept: "application/nostr+json" } })).json();
	} catch {
		return {};
	}
}
function ae(e, t) {
	try {
		return e();
	} catch (e) {
		return t instanceof Function ? t(e) : t;
	}
}
function b(e) {
	let t = "";
	try {
		t = e.trim();
		let n = new URL(t);
		n.hash = "", n.pathname = ae(() => decodeURI(n.pathname), n.pathname), n.pathname = n.pathname.replace(/\/$/, ""), n.hostname = n.hostname.replace(/\.$/, ""), n.searchParams.sort(), n.search = ae(() => decodeURIComponent(n.search), n.search);
		let r = n.toString();
		return n.search || (r = r.replace(/\/$/, "")), r;
	} catch {
		return t;
	}
}
var x = class e extends Map {
	constructor(e) {
		if (super(), e) for (let [t, n] of Object.entries(e)) this.set(b(t), n);
	}
	get(e) {
		return super.get(b(e));
	}
	getMany(e) {
		let t = [];
		for (let n of new Set(e.map(b))) {
			let e = this.get(n);
			e !== void 0 && t.push(e);
		}
		return t;
	}
	set(e, t) {
		return super.set(b(e), t);
	}
	has(e) {
		return super.has(b(e));
	}
	delete(e) {
		return super.delete(b(e));
	}
	toObject() {
		let e = {};
		for (let [t, n] of this.entries()) e[t] = n;
		return e;
	}
	toKeys() {
		return [...super.keys()];
	}
	toValues() {
		return [...super.values()];
	}
	copy() {
		return new e(this.toObject());
	}
}, S = class {
	static async getValue(e, t, n) {
		if (!n?.skipCache) {
			let n = await this.cache.get(e);
			if (n) return t(n);
		}
		if (!n?.skipFetch) {
			let n = await this.fetch(e);
			if (n) return t(n);
		}
		return t(this.default);
	}
	static get(e) {
		let t = this.cache.get(e);
		if (t && !(t instanceof Promise)) return t;
	}
	static async fetch(e) {
		let t = ie(e);
		return this.cache.set(e, t), t.then((t) => {
			this.cache.set(e, t);
		}), t;
	}
	static async getOrFetch(e) {
		return this.cache.get(e) ?? this.fetch(e);
	}
	static set(e, t) {
		this.cache.set(e, t);
	}
	static getDefault() {
		return this.default;
	}
	static setDefault(e) {
		this.default = e;
	}
	static forget(e) {
		this.cache.delete(e);
	}
	static forgetAll() {
		this.cache.clear();
	}
};
s(S, "cache", new x()), s(S, "default", {});
function oe(e, t, n) {
	return Array.isArray(t) ? t.some((t) => se(e, t, n)) : se(e, t, n);
}
function se(e, t, n) {
	let { sinceInclusive: r, untilInclusive: i } = m(n ?? {}, {
		sinceInclusive: !0,
		untilInclusive: !0
	});
	if (t.ids && t.ids.every((t) => !e.id.startsWith(t)) || t.kinds && !t.kinds.includes(e.kind) || t.authors && t.authors.every((t) => !e.pubkey.startsWith(t)) || t.since && (r && !(t.since <= e.created_at) || !r && !(t.since < e.created_at)) || t.until && (i && !(e.created_at <= t.until) || !i && !(e.created_at < t.until))) return !1;
	for (let [n, r] of Object.entries(t)) {
		if (!n.startsWith("#") || !Array.isArray(r)) continue;
		let t = n.slice(1);
		if (!e.tags.find(([e, n]) => t === e && r.includes(n))) return !1;
	}
	return !0;
}
function ce(e, t) {
	let n = e.tags.find((e) => e[0] === "expiration");
	if (!n) return !1;
	try {
		let e = Number(n[1]);
		return Number.isInteger(e) ? e <= (t ?? Math.floor(Date.now() / 1e3)) : !1;
	} catch {
		return !1;
	}
}
var le = function(e, t) {
	return le = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e, t) {
		e.__proto__ = t;
	} || function(e, t) {
		for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
	}, le(e, t);
};
function C(e, t) {
	if (typeof t != "function" && t !== null) throw TypeError("Class extends value " + String(t) + " is not a constructor or null");
	le(e, t);
	function n() {
		this.constructor = e;
	}
	e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
}
function ue(e, t, n, r) {
	function i(e) {
		return e instanceof n ? e : new n(function(t) {
			t(e);
		});
	}
	return new (n ||= Promise)(function(n, a) {
		function o(e) {
			try {
				c(r.next(e));
			} catch (e) {
				a(e);
			}
		}
		function s(e) {
			try {
				c(r.throw(e));
			} catch (e) {
				a(e);
			}
		}
		function c(e) {
			e.done ? n(e.value) : i(e.value).then(o, s);
		}
		c((r = r.apply(e, t || [])).next());
	});
}
function de(e, t) {
	var n = {
		label: 0,
		sent: function() {
			if (a[0] & 1) throw a[1];
			return a[1];
		},
		trys: [],
		ops: []
	}, r, i, a, o = {
		next: s(0),
		throw: s(1),
		return: s(2)
	};
	return typeof Symbol == "function" && (o[Symbol.iterator] = function() {
		return this;
	}), o;
	function s(e) {
		return function(t) {
			return c([e, t]);
		};
	}
	function c(s) {
		if (r) throw TypeError("Generator is already executing.");
		for (; o && (o = 0, s[0] && (n = 0)), n;) try {
			if (r = 1, i && (a = s[0] & 2 ? i.return : s[0] ? i.throw || ((a = i.return) && a.call(i), 0) : i.next) && !(a = a.call(i, s[1])).done) return a;
			switch (i = 0, a && (s = [s[0] & 2, a.value]), s[0]) {
				case 0:
				case 1:
					a = s;
					break;
				case 4: return n.label++, {
					value: s[1],
					done: !1
				};
				case 5:
					n.label++, i = s[1], s = [0];
					continue;
				case 7:
					s = n.ops.pop(), n.trys.pop();
					continue;
				default:
					if (a = n.trys, !(a = a.length > 0 && a[a.length - 1]) && (s[0] === 6 || s[0] === 2)) {
						n = 0;
						continue;
					}
					if (s[0] === 3 && (!a || s[1] > a[0] && s[1] < a[3])) {
						n.label = s[1];
						break;
					}
					if (s[0] === 6 && n.label < a[1]) {
						n.label = a[1], a = s;
						break;
					}
					if (a && n.label < a[2]) {
						n.label = a[2], n.ops.push(s);
						break;
					}
					a[2] && n.ops.pop(), n.trys.pop();
					continue;
			}
			s = t.call(e, n);
		} catch (e) {
			s = [6, e], i = 0;
		} finally {
			r = a = 0;
		}
		if (s[0] & 5) throw s[1];
		return {
			value: s[0] ? s[1] : void 0,
			done: !0
		};
	}
}
function w(e) {
	var t = typeof Symbol == "function" && Symbol.iterator, n = t && e[t], r = 0;
	if (n) return n.call(e);
	if (e && typeof e.length == "number") return { next: function() {
		return e && r >= e.length && (e = void 0), {
			value: e && e[r++],
			done: !e
		};
	} };
	throw TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function T(e, t) {
	var n = typeof Symbol == "function" && e[Symbol.iterator];
	if (!n) return e;
	var r = n.call(e), i, a = [], o;
	try {
		for (; (t === void 0 || t-- > 0) && !(i = r.next()).done;) a.push(i.value);
	} catch (e) {
		o = { error: e };
	} finally {
		try {
			i && !i.done && (n = r.return) && n.call(r);
		} finally {
			if (o) throw o.error;
		}
	}
	return a;
}
function E(e, t, n) {
	if (n || arguments.length === 2) for (var r = 0, i = t.length, a; r < i; r++) (a || !(r in t)) && (a ||= Array.prototype.slice.call(t, 0, r), a[r] = t[r]);
	return e.concat(a || Array.prototype.slice.call(t));
}
function D(e) {
	return this instanceof D ? (this.v = e, this) : new D(e);
}
function fe(e, t, n) {
	if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
	var r = n.apply(e, t || []), i, a = [];
	return i = {}, o("next"), o("throw"), o("return"), i[Symbol.asyncIterator] = function() {
		return this;
	}, i;
	function o(e) {
		r[e] && (i[e] = function(t) {
			return new Promise(function(n, r) {
				a.push([
					e,
					t,
					n,
					r
				]) > 1 || s(e, t);
			});
		});
	}
	function s(e, t) {
		try {
			c(r[e](t));
		} catch (e) {
			d(a[0][3], e);
		}
	}
	function c(e) {
		e.value instanceof D ? Promise.resolve(e.value.v).then(l, u) : d(a[0][2], e);
	}
	function l(e) {
		s("next", e);
	}
	function u(e) {
		s("throw", e);
	}
	function d(e, t) {
		e(t), a.shift(), a.length && s(a[0][0], a[0][1]);
	}
}
function pe(e) {
	if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
	var t = e[Symbol.asyncIterator], n;
	return t ? t.call(e) : (e = typeof w == "function" ? w(e) : e[Symbol.iterator](), n = {}, r("next"), r("throw"), r("return"), n[Symbol.asyncIterator] = function() {
		return this;
	}, n);
	function r(t) {
		n[t] = e[t] && function(n) {
			return new Promise(function(r, a) {
				n = e[t](n), i(r, a, n.done, n.value);
			});
		};
	}
	function i(e, t, n, r) {
		Promise.resolve(r).then(function(t) {
			e({
				value: t,
				done: n
			});
		}, t);
	}
}
function O(e) {
	return typeof e == "function";
}
function k(e) {
	var t = e(function(e) {
		Error.call(e), e.stack = (/* @__PURE__ */ Error()).stack;
	});
	return t.prototype = Object.create(Error.prototype), t.prototype.constructor = t, t;
}
var me = k(function(e) {
	return function(t) {
		e(this), this.message = t ? t.length + " errors occurred during unsubscription:\n" + t.map(function(e, t) {
			return t + 1 + ") " + e.toString();
		}).join("\n  ") : "", this.name = "UnsubscriptionError", this.errors = t;
	};
});
function A(e, t) {
	if (e) {
		var n = e.indexOf(t);
		0 <= n && e.splice(n, 1);
	}
}
var j = function() {
	function e(e) {
		this.initialTeardown = e, this.closed = !1, this._parentage = null, this._finalizers = null;
	}
	return e.prototype.unsubscribe = function() {
		var e, t, n, r, i;
		if (!this.closed) {
			this.closed = !0;
			var a = this._parentage;
			if (a) {
				if (this._parentage = null, Array.isArray(a)) try {
					for (var o = w(a), s = o.next(); !s.done; s = o.next()) s.value.remove(this);
				} catch (t) {
					e = { error: t };
				} finally {
					try {
						s && !s.done && (t = o.return) && t.call(o);
					} finally {
						if (e) throw e.error;
					}
				}
				else a.remove(this);
			}
			var c = this.initialTeardown;
			if (O(c)) try {
				c();
			} catch (e) {
				i = e instanceof me ? e.errors : [e];
			}
			var l = this._finalizers;
			if (l) {
				this._finalizers = null;
				try {
					for (var u = w(l), d = u.next(); !d.done; d = u.next()) {
						var f = d.value;
						try {
							_e(f);
						} catch (e) {
							i ??= [], e instanceof me ? i = E(E([], T(i)), T(e.errors)) : i.push(e);
						}
					}
				} catch (e) {
					n = { error: e };
				} finally {
					try {
						d && !d.done && (r = u.return) && r.call(u);
					} finally {
						if (n) throw n.error;
					}
				}
			}
			if (i) throw new me(i);
		}
	}, e.prototype.add = function(t) {
		if (t && t !== this) {
			if (this.closed) _e(t);
			else {
				if (t instanceof e) {
					if (t.closed || t._hasParent(this)) return;
					t._addParent(this);
				}
				(this._finalizers = this._finalizers ?? []).push(t);
			}
		}
	}, e.prototype._hasParent = function(e) {
		var t = this._parentage;
		return t === e || Array.isArray(t) && t.includes(e);
	}, e.prototype._addParent = function(e) {
		var t = this._parentage;
		this._parentage = Array.isArray(t) ? (t.push(e), t) : t ? [t, e] : e;
	}, e.prototype._removeParent = function(e) {
		var t = this._parentage;
		t === e ? this._parentage = null : Array.isArray(t) && A(t, e);
	}, e.prototype.remove = function(t) {
		var n = this._finalizers;
		n && A(n, t), t instanceof e && t._removeParent(this);
	}, e.EMPTY = function() {
		var t = new e();
		return t.closed = !0, t;
	}(), e;
}(), he = j.EMPTY;
function ge(e) {
	return e instanceof j || e && "closed" in e && O(e.remove) && O(e.add) && O(e.unsubscribe);
}
function _e(e) {
	O(e) ? e() : e.unsubscribe();
}
var ve = {
	onUnhandledError: null,
	onStoppedNotification: null,
	Promise: void 0,
	useDeprecatedSynchronousErrorHandling: !1,
	useDeprecatedNextContext: !1
}, ye = {
	setTimeout: function(e, t) {
		var n = [...arguments].slice(2), r = ye.delegate;
		return r?.setTimeout ? r.setTimeout.apply(r, E([e, t], T(n))) : setTimeout.apply(void 0, E([e, t], T(n)));
	},
	clearTimeout: function(e) {
		return (ye.delegate?.clearTimeout || clearTimeout)(e);
	},
	delegate: void 0
};
function be(e) {
	ye.setTimeout(function() {
		throw e;
	});
}
function xe() {}
function Se(e) {
	e();
}
var Ce = function(e) {
	C(t, e);
	function t(t) {
		var n = e.call(this) || this;
		return n.isStopped = !1, t ? (n.destination = t, ge(t) && t.add(n)) : n.destination = Oe, n;
	}
	return t.create = function(e, t, n) {
		return new M(e, t, n);
	}, t.prototype.next = function(e) {
		this.isStopped || this._next(e);
	}, t.prototype.error = function(e) {
		this.isStopped || (this.isStopped = !0, this._error(e));
	}, t.prototype.complete = function() {
		this.isStopped || (this.isStopped = !0, this._complete());
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
}(j), we = Function.prototype.bind;
function Te(e, t) {
	return we.call(e, t);
}
var Ee = function() {
	function e(e) {
		this.partialObserver = e;
	}
	return e.prototype.next = function(e) {
		var t = this.partialObserver;
		if (t.next) try {
			t.next(e);
		} catch (e) {
			N(e);
		}
	}, e.prototype.error = function(e) {
		var t = this.partialObserver;
		if (t.error) try {
			t.error(e);
		} catch (e) {
			N(e);
		}
		else N(e);
	}, e.prototype.complete = function() {
		var e = this.partialObserver;
		if (e.complete) try {
			e.complete();
		} catch (e) {
			N(e);
		}
	}, e;
}(), M = function(e) {
	C(t, e);
	function t(t, n, r) {
		var i = e.call(this) || this, a;
		if (O(t) || !t) a = {
			next: t ?? void 0,
			error: n ?? void 0,
			complete: r ?? void 0
		};
		else {
			var o;
			i && ve.useDeprecatedNextContext ? (o = Object.create(t), o.unsubscribe = function() {
				return i.unsubscribe();
			}, a = {
				next: t.next && Te(t.next, o),
				error: t.error && Te(t.error, o),
				complete: t.complete && Te(t.complete, o)
			}) : a = t;
		}
		return i.destination = new Ee(a), i;
	}
	return t;
}(Ce);
function N(e) {
	be(e);
}
function De(e) {
	throw e;
}
var Oe = {
	closed: !0,
	next: xe,
	error: De,
	complete: xe
}, ke = function() {
	return typeof Symbol == "function" && Symbol.observable || "@@observable";
}();
function P(e) {
	return e;
}
function Ae() {
	return je([...arguments]);
}
function je(e) {
	return e.length === 0 ? P : e.length === 1 ? e[0] : function(t) {
		return e.reduce(function(e, t) {
			return t(e);
		}, t);
	};
}
var F = function() {
	function e(e) {
		e && (this._subscribe = e);
	}
	return e.prototype.lift = function(t) {
		var n = new e();
		return n.source = this, n.operator = t, n;
	}, e.prototype.subscribe = function(e, t, n) {
		var r = this, i = Pe(e) ? e : new M(e, t, n);
		return Se(function() {
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
		return t = Me(t), new t(function(t, r) {
			var i = new M({
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
	}, e.prototype[ke] = function() {
		return this;
	}, e.prototype.pipe = function() {
		return je([...arguments])(this);
	}, e.prototype.toPromise = function(e) {
		var t = this;
		return e = Me(e), new e(function(e, n) {
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
function Me(e) {
	return e ?? ve.Promise ?? Promise;
}
function Ne(e) {
	return e && O(e.next) && O(e.error) && O(e.complete);
}
function Pe(e) {
	return e && e instanceof Ce || Ne(e) && ge(e);
}
function Fe(e) {
	return O(e?.lift);
}
function I(e) {
	return function(t) {
		if (Fe(t)) return t.lift(function(t) {
			try {
				return e(t, this);
			} catch (e) {
				this.error(e);
			}
		});
		throw TypeError("Unable to lift unknown Observable type");
	};
}
function L(e, t, n, r, i) {
	return new Ie(e, t, n, r, i);
}
var Ie = function(e) {
	C(t, e);
	function t(t, n, r, i, a, o) {
		var s = e.call(this, t) || this;
		return s.onFinalize = a, s.shouldUnsubscribe = o, s._next = n ? function(e) {
			try {
				n(e);
			} catch (e) {
				t.error(e);
			}
		} : e.prototype._next, s._error = i ? function(e) {
			try {
				i(e);
			} catch (e) {
				t.error(e);
			} finally {
				this.unsubscribe();
			}
		} : e.prototype._error, s._complete = r ? function() {
			try {
				r();
			} catch (e) {
				t.error(e);
			} finally {
				this.unsubscribe();
			}
		} : e.prototype._complete, s;
	}
	return t.prototype.unsubscribe = function() {
		var t;
		if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
			var n = this.closed;
			e.prototype.unsubscribe.call(this), n || (t = this.onFinalize) == null || t.call(this);
		}
	}, t;
}(Ce), Le = k(function(e) {
	return function() {
		e(this), this.name = "ObjectUnsubscribedError", this.message = "object unsubscribed";
	};
}), R = function(e) {
	C(t, e);
	function t() {
		var t = e.call(this) || this;
		return t.closed = !1, t.currentObservers = null, t.observers = [], t.isStopped = !1, t.hasError = !1, t.thrownError = null, t;
	}
	return t.prototype.lift = function(e) {
		var t = new Re(this, this);
		return t.operator = e, t;
	}, t.prototype._throwIfClosed = function() {
		if (this.closed) throw new Le();
	}, t.prototype.next = function(e) {
		var t = this;
		Se(function() {
			var n, r;
			if (t._throwIfClosed(), !t.isStopped) {
				t.currentObservers ||= Array.from(t.observers);
				try {
					for (var i = w(t.currentObservers), a = i.next(); !a.done; a = i.next()) a.value.next(e);
				} catch (e) {
					n = { error: e };
				} finally {
					try {
						a && !a.done && (r = i.return) && r.call(i);
					} finally {
						if (n) throw n.error;
					}
				}
			}
		});
	}, t.prototype.error = function(e) {
		var t = this;
		Se(function() {
			if (t._throwIfClosed(), !t.isStopped) {
				t.hasError = t.isStopped = !0, t.thrownError = e;
				for (var n = t.observers; n.length;) n.shift().error(e);
			}
		});
	}, t.prototype.complete = function() {
		var e = this;
		Se(function() {
			if (e._throwIfClosed(), !e.isStopped) {
				e.isStopped = !0;
				for (var t = e.observers; t.length;) t.shift().complete();
			}
		});
	}, t.prototype.unsubscribe = function() {
		this.isStopped = this.closed = !0, this.observers = this.currentObservers = null;
	}, Object.defineProperty(t.prototype, "observed", {
		get: function() {
			return this.observers?.length > 0;
		},
		enumerable: !1,
		configurable: !0
	}), t.prototype._trySubscribe = function(t) {
		return this._throwIfClosed(), e.prototype._trySubscribe.call(this, t);
	}, t.prototype._subscribe = function(e) {
		return this._throwIfClosed(), this._checkFinalizedStatuses(e), this._innerSubscribe(e);
	}, t.prototype._innerSubscribe = function(e) {
		var t = this, n = this, r = n.hasError, i = n.isStopped, a = n.observers;
		return r || i ? he : (this.currentObservers = null, a.push(e), new j(function() {
			t.currentObservers = null, A(a, e);
		}));
	}, t.prototype._checkFinalizedStatuses = function(e) {
		var t = this, n = t.hasError, r = t.thrownError, i = t.isStopped;
		n ? e.error(r) : i && e.complete();
	}, t.prototype.asObservable = function() {
		var e = new F();
		return e.source = this, e;
	}, t.create = function(e, t) {
		return new Re(e, t);
	}, t;
}(F), Re = function(e) {
	C(t, e);
	function t(t, n) {
		var r = e.call(this) || this;
		return r.destination = t, r.source = n, r;
	}
	return t.prototype.next = function(e) {
		var t, n;
		(n = (t = this.destination)?.next) == null || n.call(t, e);
	}, t.prototype.error = function(e) {
		var t, n;
		(n = (t = this.destination)?.error) == null || n.call(t, e);
	}, t.prototype.complete = function() {
		var e, t;
		(t = (e = this.destination)?.complete) == null || t.call(e);
	}, t.prototype._subscribe = function(e) {
		return this.source?.subscribe(e) ?? he;
	}, t;
}(R), ze = function(e) {
	C(t, e);
	function t(t) {
		var n = e.call(this) || this;
		return n._value = t, n;
	}
	return Object.defineProperty(t.prototype, "value", {
		get: function() {
			return this.getValue();
		},
		enumerable: !1,
		configurable: !0
	}), t.prototype._subscribe = function(t) {
		var n = e.prototype._subscribe.call(this, t);
		return !n.closed && t.next(this._value), n;
	}, t.prototype.getValue = function() {
		var e = this, t = e.hasError, n = e.thrownError, r = e._value;
		if (t) throw n;
		return this._throwIfClosed(), r;
	}, t.prototype.next = function(t) {
		e.prototype.next.call(this, this._value = t);
	}, t;
}(R), Be = {
	now: function() {
		return (Be.delegate || Date).now();
	},
	delegate: void 0
}, Ve = function(e) {
	C(t, e);
	function t(t, n) {
		return e.call(this) || this;
	}
	return t.prototype.schedule = function(e, t) {
		return this;
	}, t;
}(j), z = {
	setInterval: function(e, t) {
		var n = [...arguments].slice(2), r = z.delegate;
		return r?.setInterval ? r.setInterval.apply(r, E([e, t], T(n))) : setInterval.apply(void 0, E([e, t], T(n)));
	},
	clearInterval: function(e) {
		return (z.delegate?.clearInterval || clearInterval)(e);
	},
	delegate: void 0
}, He = function(e) {
	C(t, e);
	function t(t, n) {
		var r = e.call(this, t, n) || this;
		return r.scheduler = t, r.work = n, r.pending = !1, r;
	}
	return t.prototype.schedule = function(e, t) {
		if (t === void 0 && (t = 0), this.closed) return this;
		this.state = e;
		var n = this.id, r = this.scheduler;
		return n != null && (this.id = this.recycleAsyncId(r, n, t)), this.pending = !0, this.delay = t, this.id = this.id ?? this.requestAsyncId(r, this.id, t), this;
	}, t.prototype.requestAsyncId = function(e, t, n) {
		return n === void 0 && (n = 0), z.setInterval(e.flush.bind(e, this), n);
	}, t.prototype.recycleAsyncId = function(e, t, n) {
		if (n === void 0 && (n = 0), n != null && this.delay === n && this.pending === !1) return t;
		t != null && z.clearInterval(t);
	}, t.prototype.execute = function(e, t) {
		if (this.closed) return /* @__PURE__ */ Error("executing a cancelled action");
		this.pending = !1;
		var n = this._execute(e, t);
		if (n) return n;
		this.pending === !1 && this.id != null && (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
	}, t.prototype._execute = function(e, t) {
		var n = !1, r;
		try {
			this.work(e);
		} catch (e) {
			n = !0, r = e || /* @__PURE__ */ Error("Scheduled action threw falsy error");
		}
		if (n) return this.unsubscribe(), r;
	}, t.prototype.unsubscribe = function() {
		if (!this.closed) {
			var t = this, n = t.id, r = t.scheduler, i = r.actions;
			this.work = this.state = this.scheduler = null, this.pending = !1, A(i, this), n != null && (this.id = this.recycleAsyncId(r, n, null)), this.delay = null, e.prototype.unsubscribe.call(this);
		}
	}, t;
}(Ve), Ue = function() {
	function e(t, n) {
		n === void 0 && (n = e.now), this.schedulerActionCtor = t, this.now = n;
	}
	return e.prototype.schedule = function(e, t, n) {
		return t === void 0 && (t = 0), new this.schedulerActionCtor(this, e).schedule(n, t);
	}, e.now = Be.now, e;
}(), We = new (function(e) {
	C(t, e);
	function t(t, n) {
		n === void 0 && (n = Ue.now);
		var r = e.call(this, t, n) || this;
		return r.actions = [], r._active = !1, r;
	}
	return t.prototype.flush = function(e) {
		var t = this.actions;
		if (this._active) t.push(e);
		else {
			var n;
			this._active = !0;
			do
				if (n = e.execute(e.state, e.delay)) break;
			while (e = t.shift());
			if (this._active = !1, n) {
				for (; e = t.shift();) e.unsubscribe();
				throw n;
			}
		}
	}, t;
}(Ue))(He), Ge = We, B = new F(function(e) {
	return e.complete();
});
function Ke(e) {
	return e && O(e.schedule);
}
function qe(e) {
	return e[e.length - 1];
}
function Je(e) {
	return O(qe(e)) ? e.pop() : void 0;
}
function Ye(e) {
	return Ke(qe(e)) ? e.pop() : void 0;
}
function Xe(e, t) {
	return typeof qe(e) == "number" ? e.pop() : t;
}
var Ze = function(e) {
	return e && typeof e.length == "number" && typeof e != "function";
};
function Qe(e) {
	return O(e?.then);
}
function $e(e) {
	return O(e[ke]);
}
function et(e) {
	return Symbol.asyncIterator && O(e?.[Symbol.asyncIterator]);
}
function tt(e) {
	return /* @__PURE__ */ TypeError("You provided " + (typeof e == "object" && e ? "an invalid object" : "'" + e + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
}
function nt() {
	return typeof Symbol != "function" || !Symbol.iterator ? "@@iterator" : Symbol.iterator;
}
var rt = nt();
function it(e) {
	return O(e?.[rt]);
}
function at(e) {
	return fe(this, arguments, function() {
		var t, n, r, i;
		return de(this, function(a) {
			switch (a.label) {
				case 0: t = e.getReader(), a.label = 1;
				case 1: a.trys.push([
					1,
					,
					9,
					10
				]), a.label = 2;
				case 2: return [4, D(t.read())];
				case 3: return n = a.sent(), r = n.value, i = n.done, i ? [4, D(void 0)] : [3, 5];
				case 4: return [2, a.sent()];
				case 5: return [4, D(r)];
				case 6: return [4, a.sent()];
				case 7: return a.sent(), [3, 2];
				case 8: return [3, 10];
				case 9: return t.releaseLock(), [7];
				case 10: return [2];
			}
		});
	});
}
function ot(e) {
	return O(e?.getReader);
}
function V(e) {
	if (e instanceof F) return e;
	if (e != null) {
		if ($e(e)) return st(e);
		if (Ze(e)) return ct(e);
		if (Qe(e)) return lt(e);
		if (et(e)) return dt(e);
		if (it(e)) return ut(e);
		if (ot(e)) return ft(e);
	}
	throw tt(e);
}
function st(e) {
	return new F(function(t) {
		var n = e[ke]();
		if (O(n.subscribe)) return n.subscribe(t);
		throw TypeError("Provided object does not correctly implement Symbol.observable");
	});
}
function ct(e) {
	return new F(function(t) {
		for (var n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
		t.complete();
	});
}
function lt(e) {
	return new F(function(t) {
		e.then(function(e) {
			t.closed || (t.next(e), t.complete());
		}, function(e) {
			return t.error(e);
		}).then(null, be);
	});
}
function ut(e) {
	return new F(function(t) {
		var n, r;
		try {
			for (var i = w(e), a = i.next(); !a.done; a = i.next()) {
				var o = a.value;
				if (t.next(o), t.closed) return;
			}
		} catch (e) {
			n = { error: e };
		} finally {
			try {
				a && !a.done && (r = i.return) && r.call(i);
			} finally {
				if (n) throw n.error;
			}
		}
		t.complete();
	});
}
function dt(e) {
	return new F(function(t) {
		pt(e, t).catch(function(e) {
			return t.error(e);
		});
	});
}
function ft(e) {
	return dt(at(e));
}
function pt(e, t) {
	var n, r, i, a;
	return ue(this, void 0, void 0, function() {
		var o, s;
		return de(this, function(c) {
			switch (c.label) {
				case 0: c.trys.push([
					0,
					5,
					6,
					11
				]), n = pe(e), c.label = 1;
				case 1: return [4, n.next()];
				case 2:
					if (r = c.sent(), r.done) return [3, 4];
					if (o = r.value, t.next(o), t.closed) return [2];
					c.label = 3;
				case 3: return [3, 1];
				case 4: return [3, 11];
				case 5: return s = c.sent(), i = { error: s }, [3, 11];
				case 6: return c.trys.push([
					6,
					,
					9,
					10
				]), r && !r.done && (a = n.return) ? [4, a.call(n)] : [3, 8];
				case 7: c.sent(), c.label = 8;
				case 8: return [3, 10];
				case 9:
					if (i) throw i.error;
					return [7];
				case 10: return [7];
				case 11: return t.complete(), [2];
			}
		});
	});
}
function H(e, t, n, r, i) {
	r === void 0 && (r = 0), i === void 0 && (i = !1);
	var a = t.schedule(function() {
		n(), i ? e.add(this.schedule(null, r)) : this.unsubscribe();
	}, r);
	if (e.add(a), !i) return a;
}
function mt(e, t) {
	return t === void 0 && (t = 0), I(function(n, r) {
		n.subscribe(L(r, function(n) {
			return H(r, e, function() {
				return r.next(n);
			}, t);
		}, function() {
			return H(r, e, function() {
				return r.complete();
			}, t);
		}, function(n) {
			return H(r, e, function() {
				return r.error(n);
			}, t);
		}));
	});
}
function ht(e, t) {
	return t === void 0 && (t = 0), I(function(n, r) {
		r.add(e.schedule(function() {
			return n.subscribe(r);
		}, t));
	});
}
function gt(e, t) {
	return V(e).pipe(ht(t), mt(t));
}
function _t(e, t) {
	return V(e).pipe(ht(t), mt(t));
}
function vt(e, t) {
	return new F(function(n) {
		var r = 0;
		return t.schedule(function() {
			r === e.length ? n.complete() : (n.next(e[r++]), n.closed || this.schedule());
		});
	});
}
function yt(e, t) {
	return new F(function(n) {
		var r;
		return H(n, t, function() {
			r = e[rt](), H(n, t, function() {
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
			return O(r?.return) && r.return();
		};
	});
}
function bt(e, t) {
	if (!e) throw Error("Iterable cannot be null");
	return new F(function(n) {
		H(n, t, function() {
			var r = e[Symbol.asyncIterator]();
			H(n, t, function() {
				r.next().then(function(e) {
					e.done ? n.complete() : n.next(e.value);
				});
			}, 0, !0);
		});
	});
}
function xt(e, t) {
	return bt(at(e), t);
}
function St(e, t) {
	if (e != null) {
		if ($e(e)) return gt(e, t);
		if (Ze(e)) return vt(e, t);
		if (Qe(e)) return _t(e, t);
		if (et(e)) return bt(e, t);
		if (it(e)) return yt(e, t);
		if (ot(e)) return xt(e, t);
	}
	throw tt(e);
}
function U(e, t) {
	return t ? St(e, t) : V(e);
}
function Ct() {
	var e = [...arguments];
	return U(e, Ye(e));
}
var wt = k(function(e) {
	return function() {
		e(this), this.name = "EmptyError", this.message = "no elements in sequence";
	};
});
function Tt(e, t) {
	var n = typeof t == "object";
	return new Promise(function(r, i) {
		var a = new M({
			next: function(e) {
				r(e), a.unsubscribe();
			},
			error: i,
			complete: function() {
				n ? r(t.defaultValue) : i(new wt());
			}
		});
		e.subscribe(a);
	});
}
function Et(e) {
	return e instanceof Date && !isNaN(e);
}
var Dt = k(function(e) {
	return function(t) {
		t === void 0 && (t = null), e(this), this.message = "Timeout has occurred", this.name = "TimeoutError", this.info = t;
	};
});
function Ot(e, t) {
	var n = Et(e) ? { first: e } : typeof e == "number" ? { each: e } : e, r = n.first, i = n.each, a = n.with, o = a === void 0 ? kt : a, s = n.scheduler, c = s === void 0 ? t ?? We : s, l = n.meta, u = l === void 0 ? null : l;
	if (r == null && i == null) throw TypeError("No timeout provided.");
	return I(function(e, t) {
		var n, a, s = null, l = 0, d = function(e) {
			a = H(t, c, function() {
				try {
					n.unsubscribe(), V(o({
						meta: u,
						lastValue: s,
						seen: l
					})).subscribe(t);
				} catch (e) {
					t.error(e);
				}
			}, e);
		};
		n = e.subscribe(L(t, function(e) {
			a?.unsubscribe(), l++, t.next(s = e), i > 0 && d(i);
		}, void 0, void 0, function() {
			a?.closed || a?.unsubscribe(), s = null;
		})), !l && d(r == null ? i : typeof r == "number" ? r : +r - c.now());
	});
}
function kt(e) {
	throw new Dt(e);
}
function W(e, t) {
	return I(function(n, r) {
		var i = 0;
		n.subscribe(L(r, function(n) {
			r.next(e.call(t, n, i++));
		}));
	});
}
var At = Array.isArray;
function jt(e, t) {
	return At(t) ? e.apply(void 0, E([], T(t))) : e(t);
}
function Mt(e) {
	return W(function(t) {
		return jt(e, t);
	});
}
var Nt = Array.isArray, Pt = Object.getPrototypeOf, Ft = Object.prototype, It = Object.keys;
function Lt(e) {
	if (e.length === 1) {
		var t = e[0];
		if (Nt(t)) return {
			args: t,
			keys: null
		};
		if (Rt(t)) {
			var n = It(t);
			return {
				args: n.map(function(e) {
					return t[e];
				}),
				keys: n
			};
		}
	}
	return {
		args: e,
		keys: null
	};
}
function Rt(e) {
	return e && typeof e == "object" && Pt(e) === Ft;
}
function zt(e, t) {
	return e.reduce(function(e, n, r) {
		return e[n] = t[r], e;
	}, {});
}
function Bt() {
	var e = [...arguments], t = Ye(e), n = Je(e), r = Lt(e), i = r.args, a = r.keys;
	if (i.length === 0) return U([], t);
	var o = new F(Vt(i, t, a ? function(e) {
		return zt(a, e);
	} : P));
	return n ? o.pipe(Mt(n)) : o;
}
function Vt(e, t, n) {
	return n === void 0 && (n = P), function(r) {
		Ht(t, function() {
			for (var i = e.length, a = Array(i), o = i, s = i, c = function(i) {
				Ht(t, function() {
					var c = U(e[i], t), l = !1;
					c.subscribe(L(r, function(e) {
						a[i] = e, l || (l = !0, s--), s || r.next(n(a.slice()));
					}, function() {
						--o || r.complete();
					}));
				}, r);
			}, l = 0; l < i; l++) c(l);
		}, r);
	};
}
function Ht(e, t, n) {
	e ? H(n, e, t) : t();
}
function Ut(e, t, n, r, i, a, o, s) {
	var c = [], l = 0, u = 0, d = !1, f = function() {
		d && !c.length && !l && t.complete();
	}, p = function(e) {
		return l < r ? m(e) : c.push(e);
	}, m = function(e) {
		a && t.next(e), l++;
		var s = !1;
		V(n(e, u++)).subscribe(L(t, function(e) {
			i?.(e), a ? p(e) : t.next(e);
		}, function() {
			s = !0;
		}, void 0, function() {
			if (s) try {
				l--;
				for (var e = function() {
					var e = c.shift();
					o ? H(t, o, function() {
						return m(e);
					}) : m(e);
				}; c.length && l < r;) e();
				f();
			} catch (e) {
				t.error(e);
			}
		}));
	};
	return e.subscribe(L(t, p, function() {
		d = !0, f();
	})), function() {
		s?.();
	};
}
function G(e, t, n) {
	return n === void 0 && (n = Infinity), O(t) ? G(function(n, r) {
		return W(function(e, i) {
			return t(n, e, r, i);
		})(V(e(n, r)));
	}, n) : (typeof t == "number" && (n = t), I(function(t, r) {
		return Ut(t, r, e, n);
	}));
}
function Wt(e) {
	return e === void 0 && (e = Infinity), G(P, e);
}
function Gt(e, t, n) {
	e === void 0 && (e = 0), n === void 0 && (n = Ge);
	var r = -1;
	return t != null && (Ke(t) ? n = t : r = t), new F(function(t) {
		var i = Et(e) ? +e - n.now() : e;
		i < 0 && (i = 0);
		var a = 0;
		return n.schedule(function() {
			t.closed || (t.next(a++), 0 <= r ? this.schedule(void 0, r) : t.complete());
		}, i);
	});
}
function Kt() {
	var e = [...arguments], t = Ye(e), n = Xe(e, Infinity), r = e;
	return r.length ? r.length === 1 ? V(r[0]) : Wt(n)(U(r, t)) : B;
}
function K(e, t) {
	return I(function(n, r) {
		var i = 0;
		n.subscribe(L(r, function(n) {
			return e.call(t, n, i++) && r.next(n);
		}));
	});
}
function qt(e) {
	return I(function(t, n) {
		var r = null, i = !1, a;
		r = t.subscribe(L(n, void 0, void 0, function(o) {
			a = V(e(o, qt(e)(t))), r ? (r.unsubscribe(), r = null, a.subscribe(n)) : i = !0;
		})), i && (r.unsubscribe(), r = null, a.subscribe(n));
	});
}
function Jt(e) {
	return I(function(t, n) {
		var r = !1;
		t.subscribe(L(n, function(e) {
			r = !0, n.next(e);
		}, function() {
			r || n.next(e), n.complete();
		}));
	});
}
function Yt(e) {
	return e <= 0 ? function() {
		return B;
	} : I(function(t, n) {
		var r = 0;
		t.subscribe(L(n, function(t) {
			++r <= e && (n.next(t), e <= r && n.complete());
		}));
	});
}
function Xt(e, t) {
	return t === void 0 && (t = P), e ??= Zt, I(function(n, r) {
		var i, a = !0;
		n.subscribe(L(r, function(n) {
			var o = t(n);
			(a || !e(i, o)) && (a = !1, i = o, r.next(n));
		}));
	});
}
function Zt(e, t) {
	return e === t;
}
function Qt(e) {
	return e === void 0 && (e = $t), I(function(t, n) {
		var r = !1;
		t.subscribe(L(n, function(e) {
			r = !0, n.next(e);
		}, function() {
			return r ? n.complete() : n.error(e());
		}));
	});
}
function $t() {
	return new wt();
}
function en(e) {
	return I(function(t, n) {
		try {
			t.subscribe(n);
		} finally {
			n.add(e);
		}
	});
}
function tn(e, t) {
	var n = arguments.length >= 2;
	return function(r) {
		return r.pipe(e ? K(function(t, n) {
			return e(t, n, r);
		}) : P, Yt(1), n ? Jt(t) : Qt(function() {
			return new wt();
		}));
	};
}
function nn(e, t) {
	return I(function(n, r) {
		var i = null, a = 0, o = !1, s = function() {
			return o && !i && r.complete();
		};
		n.subscribe(L(r, function(n) {
			i?.unsubscribe();
			var o = 0, c = a++;
			V(e(n, c)).subscribe(i = L(r, function(e) {
				return r.next(t ? t(n, e, c, o++) : e);
			}, function() {
				i = null, s();
			}));
		}, function() {
			o = !0, s();
		}));
	});
}
function rn() {
	return nn(P);
}
function q(e) {
	return I(function(t, n) {
		V(e).subscribe(L(n, function() {
			return n.complete();
		}, xe)), !n.closed && t.subscribe(n);
	});
}
function an(e, t) {
	return t === void 0 && (t = !1), I(function(n, r) {
		var i = 0;
		n.subscribe(L(r, function(n) {
			var a = e(n, i++);
			(a || t) && r.next(n), !a && r.complete();
		}));
	});
}
function J(e, t, n) {
	var r = O(e) || t || n ? {
		next: e,
		error: t,
		complete: n
	} : e;
	return r ? I(function(e, t) {
		var n;
		(n = r.subscribe) == null || n.call(r);
		var i = !0;
		e.subscribe(L(t, function(e) {
			var n;
			(n = r.next) == null || n.call(r, e), t.next(e);
		}, function() {
			var e;
			i = !1, (e = r.complete) == null || e.call(r), t.complete();
		}, function(e) {
			var n;
			i = !1, (n = r.error) == null || n.call(r, e), t.error(e);
		}, function() {
			var e, t;
			i && ((e = r.unsubscribe) == null || e.call(r)), (t = r.finalize) == null || t.call(r);
		}));
	}) : P;
}
function on(e) {
	return G((t, n) => U(e(t, n)).pipe(G((e) => e ? Ct(t) : B)));
}
function sn(e) {
	return Ae(Ot(e), qt((e) => {
		if (e instanceof Dt) return B;
		throw e;
	}));
}
function cn(e, t) {
	let { not: n } = m(t, { not: !1 });
	return K((t) => ln(t.subId === e, n));
}
function ln(e, t) {
	return !e && t || e && !t;
}
var un = class {
	constructor(e) {
		s(this, "relay"), s(this, "config"), s(this, "authenticator"), s(this, "ongoings", /* @__PURE__ */ new Set()), s(this, "authResult$", new R()), s(this, "disposed", !1), this.relay = e.relay, this.config = e.config, this.authenticator = e.authenticator;
		let t = this.relay.getOKObservable().subscribe((e) => {
			let { eventId: r, ok: i } = e;
			this.ongoings.has(r) && (this.ongoings.delete(r), this.authResult$.next(i), i || (t.unsubscribe(), n.unsubscribe()));
		}), n = this.relay.getAUTHObservable().subscribe(({ challenge: e }) => {
			this.challenge(e);
		});
	}
	getAuthResultObservable() {
		return this.authResult$.asObservable();
	}
	async challenge(e) {
		try {
			let t = await this.signer.signEvent({
				kind: 22242,
				content: "",
				tags: [["relay", this.relay.url], ["challenge", e]]
			});
			this.ongoings.add(t.id), this.relay.send(["AUTH", t]);
		} catch {
			this.authResult$.next(!1);
		}
	}
	get signer() {
		return this.authenticator.signer ?? this.config.signer;
	}
	dispose() {
		this[Symbol.dispose]();
	}
	[Symbol.dispose]() {
		if (this.disposed) return;
		this.disposed = !0;
		let e = [this.authResult$];
		for (let t of e) t.complete();
	}
}, dn = class extends ze {
	constructor(e) {
		super(e ?? 0);
	}
	increment() {
		this.next(this.getValue() + 1);
	}
	decrement() {
		this.next(this.getValue() - 1);
	}
	next(e) {
		typeof e == "number" ? super.next(e) : super.next(e(this.getValue()));
	}
}, fn = class extends R {
	waitNext() {
		return Tt(this.pipe(tn(null, void 0)));
	}
}, pn = class {
	constructor(e) {
		s(this, "relay"), s(this, "authProxy"), s(this, "pubs", /* @__PURE__ */ new Map()), s(this, "authRequiredPubs", /* @__PURE__ */ new Set()), s(this, "count$", new dn(0)), s(this, "ok$", new R()), s(this, "disposed", !1);
		var t;
		this.relay = e.relay, this.authProxy = e.authProxy, this.relay.getReconnectedObservable().subscribe((e) => {
			for (let [t, n] of e) t === "EVENT" && this.pubs.has(n.id) && this.sendEVENT(n);
		}), this.relay.getOKObservable().subscribe(async (e) => {
			let { eventId: t, notice: n } = e;
			this.pubs.get(t) && (this.authProxy && n?.startsWith("auth-required:") ? (this.authRequiredPubs.add(t), this.ok$.next({
				...e,
				done: !1
			})) : (this.ok$.next({
				...e,
				done: !0
			}), this.confirmOK(t)));
		}), (t = this.authProxy) == null || t.getAuthResultObservable().subscribe((e) => {
			if (e) for (let e of this.authRequiredPubs) {
				let t = this.pubs.get(e);
				t && this.sendEVENT(t);
			}
			else for (let e of this.authRequiredPubs) this.confirmOK(e);
			this.authRequiredPubs.clear();
		});
	}
	async publish(e) {
		if (!this.disposed) return this.pubs.has(e.id) || (this.pubs.set(e.id, e), this.count$.increment()), this.sendEVENT(e);
	}
	confirmOK(e) {
		this.disposed || this.pubs.has(e) && (this.pubs.delete(e), this.count$.decrement());
	}
	getOkAgainstEventObservable() {
		return this.ok$.asObservable();
	}
	getLogicalConnectionSizeObservable() {
		return this.count$.asObservable();
	}
	dispose() {
		this[Symbol.dispose]();
	}
	[Symbol.dispose]() {
		if (this.disposed) return;
		this.disposed = !0;
		let e = [this.count$, this.ok$];
		for (let t of e) t.complete();
	}
	sendEVENT(e) {
		return this.relay.send(["EVENT", e]);
	}
}, mn = {
	CONNECTING: 0,
	OPEN: 1,
	CLOSING: 2,
	CLOSED: 3
}, hn = class {
	constructor(e, t) {
		s(this, "socket", null), s(this, "buffer", []), s(this, "unsent", []), s(this, "reconnected$", new R()), s(this, "outgoing$", new R()), s(this, "message$", new R()), s(this, "error$", new R()), s(this, "retryTimer", null), s(this, "sendAttempted$", new fn()), s(this, "isFirstTry", !0), s(this, "maybeDown", !1), s(this, "disposed", !1), s(this, "state$", new R()), s(this, "_state", "initialized"), this.url = e, this.config = t, t.skipFetchNip11 || S.getOrFetch(e), this.setState("initialized");
	}
	get state() {
		return this._state;
	}
	setState(e) {
		this._state = e, this.state$.next(e);
	}
	connectManually() {
		this.connect();
	}
	connect(e) {
		if (this.state === "terminated") return;
		let t = typeof e == "number";
		(this.state === "initialized" || this.state === "dormant" || this.state === "error" || this.state === "rejected" || t) && (this.socket = this.createSocket(e ?? 0));
	}
	createSocket(e) {
		let t = this.isFirstTry;
		this.isFirstTry = !1;
		let n = !1, r = e > 0, i = !r && (this.state === "error" || this.state === "rejected");
		r ? this.setState("retrying") : this.setState("connecting");
		let a = async () => {
			if (this.state === "terminated") d?.close(Y.RX_NOSTR_DISPOSED);
			else {
				this.setState("connected"), n = !0, e = 0, (r || i) && (this.reconnected$.next(this.unsent), this.unsent = []);
				try {
					for (let e of this.buffer) this.send(e);
				} catch (e) {
					this.error$.next(e);
				} finally {
					this.buffer = [];
				}
			}
		}, o = ({ data: e }) => {
			if (this.state !== "terminated") try {
				this.message$.next(this.pack(JSON.parse(e)));
			} catch (e) {
				this.error$.next(e);
			}
		}, s = ({ code: r }) => {
			var i;
			if (d?.removeEventListener("open", a), d?.removeEventListener("message", o), d?.removeEventListener("close", s), this.socket === d && (this.socket = null), this.state === "terminated" || r === Y.RX_NOSTR_DISPOSED) this.unsent = [], this.buffer = [];
			else if (r === Y.RX_NOSTR_IDLE) this.setState("dormant"), this.buffer.length > 0 && this.connect();
			else if (r === Y.DONT_RETRY) this.unsent = [], this.buffer = [], this.error$.next(new l(r)), this.setState("rejected");
			else {
				t && !n && (this.maybeDown = !0), this.unsent.push(...this.buffer), this.buffer = [], this.error$.next(new l(r));
				let a = e + 1;
				this.config.retry.strategy !== "off" && !(this.config.retry.polite && this.maybeDown) && a <= this.config.retry.maxCount ? (this.setState("waiting-for-retrying"), (i = this.retryTimer) == null || i.unsubscribe(), this.retryTimer = gn(this.config.retry, a).subscribe(() => {
					this.disposed || this.connect(a);
				})) : this.setState("error");
			}
		}, c = this.config.websocketCtor ?? globalThis.WebSocket;
		if (!c) throw new u("WebSocket constructor is missing");
		let d = (() => {
			try {
				return new c(this.url);
			} catch (e) {
				return s({
					type: "close",
					code: 0,
					reason: `${e}`
				}), null;
			}
		})();
		return d?.addEventListener("open", a), d?.addEventListener("message", o), d?.addEventListener("close", s), d?.addEventListener("error", () => {}), d;
	}
	pack(e) {
		let t = e[0], n = this.url;
		switch (t) {
			case "EVENT": return {
				from: n,
				type: t,
				message: e,
				subId: e[1],
				event: e[2]
			};
			case "EOSE": return {
				from: n,
				type: t,
				message: e,
				subId: e[1]
			};
			case "OK": return {
				from: n,
				type: t,
				message: e,
				eventId: e[1],
				ok: e[2],
				notice: e[3]
			};
			case "CLOSED": return {
				from: n,
				type: t,
				message: e,
				subId: e[1],
				notice: e[2]
			};
			case "NOTICE": return {
				from: n,
				type: t,
				message: e,
				notice: e[1]
			};
			case "AUTH": return {
				from: n,
				type: t,
				message: e,
				challenge: e[1]
			};
			case "COUNT": return {
				from: n,
				type: t,
				message: e,
				subId: e[1],
				count: e[2]
			};
			default: return {
				from: n,
				type: "unknown",
				message: e
			};
		}
	}
	disconnect(e) {
		this.socket?.readyState === mn.OPEN && this.socket.close(e);
	}
	send(e) {
		let t = this.sendAttempted$.waitNext();
		switch (this.state) {
			case "terminated":
			case "rejected": return this.sendAttempted$.next(), t;
			case "initialized":
			case "connecting":
			case "dormant": return this.buffer.push(e), this.connect(), t;
			case "connected":
				if (!this.socket) throw new f();
				return this.socket.readyState === mn.OPEN ? (this.outgoing$.next({
					to: this.url,
					message: e
				}), this.socket.send(JSON.stringify(e)), this.sendAttempted$.next(), t) : (this.buffer.push(e), t);
			case "waiting-for-retrying":
			case "retrying":
			case "error": return this.sendAttempted$.next(), this.unsent.push(e), t;
		}
	}
	getEVENTObservable() {
		return this.message$.pipe(K((e) => e.type === "EVENT"));
	}
	getEOSEObservable() {
		return this.message$.pipe(K((e) => e.type === "EOSE"));
	}
	getCLOSEDObservable() {
		return this.message$.pipe(K((e) => e.type === "CLOSED"));
	}
	getOKObservable() {
		return this.message$.pipe(K((e) => e.type === "OK"));
	}
	getAUTHObservable() {
		return this.message$.pipe(K((e) => e.type === "AUTH"));
	}
	getAllMessageObservable() {
		return this.message$.asObservable();
	}
	getOutgoingMessageObservable() {
		return this.outgoing$.asObservable();
	}
	getReconnectedObservable() {
		return this.reconnected$.asObservable();
	}
	getConnectionStateObservable() {
		return this.state$.pipe(Xt(), W((e) => ({
			from: this.url,
			state: e
		})));
	}
	getErrorObservable() {
		return this.error$.asObservable();
	}
	dispose() {
		this[Symbol.dispose]();
	}
	[Symbol.dispose]() {
		var e, t;
		if (this.disposed) return;
		this.disposed = !0, this.setState("terminated"), (e = this.retryTimer) == null || e.unsubscribe(), (t = this.socket) == null || t.close(Y.RX_NOSTR_DISPOSED), this.socket = null;
		let n = [
			this.state$,
			this.outgoing$,
			this.message$,
			this.error$,
			this.reconnected$,
			this.sendAttempted$
		];
		for (let e of n) e.complete();
	}
};
function gn(e, t) {
	switch (e.strategy) {
		case "exponential": return Gt(Math.max(e.initialDelay * 2 ** (t - 1) + (Math.random() - .5) * 1e3, 1e3));
		case "immediately": return Ct(0);
		case "linear": return Gt(e.interval);
		case "off": return B;
	}
}
var Y = {
	ABNORMAL_CLOSURE: 1006,
	DONT_RETRY: 4e3,
	RX_NOSTR_IDLE: 4537,
	RX_NOSTR_DISPOSED: 4538
}, _n = class {
	constructor(e) {
		s(this, "relay"), s(this, "authProxy"), s(this, "config"), s(this, "subs", /* @__PURE__ */ new Map()), s(this, "authRequiredSubs", /* @__PURE__ */ new Set()), s(this, "fin$", new R()), s(this, "disposed", !1), s(this, "queue");
		var t;
		this.relay = e.relay, this.authProxy = e.authProxy, this.config = e.config, this.queue = new vn(this.relay.url, this.config), this.queue.getActivationObservable().subscribe((e) => {
			for (let { req: t } of e) this.sendREQ(t);
		}), this.relay.getReconnectedObservable().subscribe(() => {
			for (let { req: e } of this.queue.ongoings) this.sendREQ(e);
		}), this.relay.getEOSEObservable().subscribe(({ subId: e }) => {
			this.subs.get(e)?.autoclose && this.unsubscribe(e);
		}), this.relay.getCLOSEDObservable().subscribe(async ({ subId: e, notice: t }) => {
			this.subs.get(e) && (this.authProxy && t?.startsWith("auth-required:") ? this.authRequiredSubs.add(e) : this.fin(e));
		}), (t = this.authProxy) == null || t.getAuthResultObservable().subscribe((e) => {
			if (e) for (let e of this.authRequiredSubs) {
				let t = this.subs.get(e)?.req;
				t && this.sendREQ(t);
			}
			else for (let e of this.authRequiredSubs) this.fin(e);
			this.authRequiredSubs.clear();
		});
	}
	subscribe(e, t) {
		if (this.disposed) return;
		let n = e[1], r = {
			subId: n,
			req: e,
			autoclose: t
		};
		this.subs.set(n, r), this.queue.enqueue(r);
	}
	unsubscribe(e) {
		this.disposed || (this.subs.has(e) && this.sendCLOSE(e), this.fin(e));
	}
	isOngoingOrQueued(e) {
		return this.subs.has(e);
	}
	getEventObservable() {
		return this.relay.getEVENTObservable().pipe(K(({ subId: e, event: t }) => {
			let n = this.subs.get(e)?.filters;
			return n ? this.config.skipValidateFilterMatching || oe(t, n) : !1;
		}));
	}
	getFinObservable() {
		return this.fin$.asObservable();
	}
	getLogicalConnectionSizeObservable() {
		return this.queue.getSizeObservable();
	}
	dispose() {
		this[Symbol.dispose]();
	}
	[Symbol.dispose]() {
		if (this.disposed) return;
		this.disposed = !0;
		let e = [this.fin$];
		for (let t of e) t.complete();
		this.queue.dispose();
	}
	sendREQ([, e, ...t]) {
		let n = te(t), r = this.subs.get(e);
		r && (r.filters = n, this.relay.send([
			"REQ",
			e,
			...n
		]));
	}
	sendCLOSE(e) {
		this.relay.send(["CLOSE", e]);
	}
	fin(e) {
		this.subs.delete(e), this.queue.drop(e), this.fin$.next({
			from: this.relay.url,
			subId: e
		});
	}
}, vn = class {
	constructor(e, t) {
		s(this, "_queuings", []), s(this, "_ongoings", []), s(this, "activated$", new R()), s(this, "count$", new dn()), this.url = e, this.config = t;
	}
	get queuings() {
		return this._queuings;
	}
	set queuings(e) {
		this._queuings = e;
	}
	get ongoings() {
		return this._ongoings;
	}
	set ongoings(e) {
		this._ongoings = e;
	}
	enqueue(e) {
		this.queuings = [...this.queuings, e], this.count$.increment(), this.shift();
	}
	drop(e) {
		let t = (e, t) => {
			let n = e.length, r = e.filter((e) => e.subId !== t);
			return [r, n - r.length];
		}, [n, r] = t(this.queuings, e), [i, a] = t(this.ongoings, e);
		this.queuings = n, this.ongoings = i, this.count$.next((e) => e - (r + a)), this.shift();
	}
	getActivationObservable() {
		return this.activated$.asObservable();
	}
	getSizeObservable() {
		return this.count$.asObservable();
	}
	dispose() {
		let e = [this.activated$, this.count$];
		for (let t of e) t.complete();
	}
	async shift() {
		let e = await this.capacity(), t = [...this.ongoings, ...this.queuings], n = t.slice(0, e), r = t.slice(e), i = this.queuings.slice(0, e - this.ongoings.length);
		this.ongoings = n, this.queuings = r, i.length > 0 && this.activated$.next(i);
	}
	async capacity() {
		return await S.getValue(this.url, (e) => e.limitation?.max_subscriptions, { skipFetch: this.config.skipFetchNip11 }) ?? Infinity;
	}
}, yn = class {
	constructor(e, t) {
		s(this, "relay"), s(this, "pubProxy"), s(this, "subProxy"), s(this, "defaultSubscriptionIds", /* @__PURE__ */ new Set()), s(this, "communicating", !1), s(this, "strategy", "lazy"), s(this, "disconnectTimeout"), s(this, "disconnectTimer"), s(this, "isDefaultRelay", !1), s(this, "disposed", !1), s(this, "_url"), this._url = b(e);
		let n = bn(e, t), r = new hn(this.url, t), i = n ? new un({
			relay: r,
			config: t,
			authenticator: n
		}) : null, a = new pn({
			relay: r,
			authProxy: i
		}), o = new _n({
			relay: r,
			authProxy: i,
			config: t
		});
		this.relay = r, this.pubProxy = a, this.subProxy = o, this.disconnectTimeout = t.disconnectTimeout, Bt([this.pubProxy.getLogicalConnectionSizeObservable(), this.subProxy.getLogicalConnectionSizeObservable()]).pipe(W(([e, t]) => e + t)).subscribe((e) => {
			this.communicating = e > 0, this.resetConnection();
		});
	}
	get url() {
		return this._url;
	}
	setConnectionStrategy(e) {
		this.disposed || (this.strategy = e, this.resetConnection());
	}
	resetConnection() {
		let e = this.strategy;
		switch (this.isDefaultRelay || (e = "lazy"), e) {
			case "lazy": {
				let e = () => {
					this.communicating || this.relay.disconnect(Y.RX_NOSTR_IDLE);
				};
				this.disconnectTimeout > 0 ? (this.disconnectTimeout && (clearTimeout(this.disconnectTimer), this.disconnectTimer = void 0), this.disconnectTimer = setTimeout(e, this.disconnectTimeout)) : e();
				break;
			}
			case "lazy-keep": break;
			case "aggressive": (this.connectionState === "initialized" || this.connectionState === "dormant") && this.relay.connectManually();
		}
	}
	markAsDefault(e) {
		if (!this.disposed) {
			if (this.isDefaultRelay = e, !this.isDefaultRelay) {
				for (let e of this.defaultSubscriptionIds) this.subProxy.unsubscribe(e);
				this.defaultSubscriptionIds.clear();
			}
			this.resetConnection();
		}
	}
	async publish(e) {
		if (!this.disposed) return this.pubProxy.publish(e);
	}
	confirmOK(e) {
		this.disposed || this.pubProxy.confirmOK(e);
	}
	subscribe(e, t) {
		if (this.disposed) return;
		let { mode: n, overwrite: r, autoclose: i } = m(t ?? {}, {
			overwrite: !1,
			autoclose: !1,
			mode: "default"
		}), [, a] = e;
		n === "default" && !this.isDefaultRelay || !r && this.subProxy.isOngoingOrQueued(a) || (n === "default" && this.defaultSubscriptionIds.add(a), this.subProxy.subscribe(e, i));
	}
	unsubscribe(e) {
		this.disposed || (this.defaultSubscriptionIds.delete(e), this.subProxy.unsubscribe(e));
	}
	getEventObservable() {
		if (this.disposed) throw new p();
		return this.subProxy.getEventObservable();
	}
	getFinObservable() {
		if (this.disposed) throw new p();
		return this.subProxy.getFinObservable();
	}
	getOkAgainstEventObservable() {
		if (this.disposed) throw new p();
		return this.pubProxy.getOkAgainstEventObservable();
	}
	getAllMessageObservable() {
		if (this.disposed) throw new p();
		return this.relay.getAllMessageObservable();
	}
	getOutgoingMessageObservable() {
		if (this.disposed) throw new p();
		return this.relay.getOutgoingMessageObservable();
	}
	getConnectionStateObservable() {
		if (this.disposed) throw new p();
		return this.relay.getConnectionStateObservable();
	}
	get connectionState() {
		return this.relay.state;
	}
	getErrorObservable() {
		if (this.disposed) throw new p();
		return this.relay.getErrorObservable().pipe(W((e) => ({
			from: this.url,
			reason: e
		})));
	}
	connectManually() {
		this.relay.connectManually();
	}
	dispose() {
		this[Symbol.dispose]();
	}
	[Symbol.dispose]() {
		this.disposed || (this.disposed = !0, this.disconnectTimer && clearTimeout(this.disconnectTimer), this.disconnectTimer = void 0, this.relay.dispose(), this.pubProxy.dispose(), this.subProxy.dispose());
	}
};
function bn(e, t) {
	let n = t.authenticator;
	if (!n) return;
	let r = n instanceof Function ? n(e) : n;
	return r === "auto" ? {} : r;
}
function xn(e, t) {
	return e.filter((e) => !t.includes(e));
}
function Sn(e) {
	let { rxReq: t, index: n } = e, { rxReqId: r, strategy: i } = t;
	return `${r}:${i === "backward" ? n : 0}`;
}
function Cn(e) {
	let { rxReq: t, filters: n, index: r } = e;
	return [
		"REQ",
		Sn({
			rxReq: t,
			index: r
		}),
		...n
	];
}
function wn(e) {
	if (Array.isArray(e)) {
		let t = e.flatMap((e) => {
			let t = "", n = !1, r = !1;
			if (typeof e == "string") t = e, n = !0, r = !0;
			else if (Array.isArray(e)) {
				if (e[0] !== "r") return [];
				let i = e[2];
				t = e[1], n = !i || i === "read", r = !i || i === "write";
			} else t = e.url, n = e.read, r = e.write;
			return {
				url: t,
				read: n,
				write: r
			};
		});
		return Object.fromEntries(t.map((e) => [e.url, e]));
	}
	{
		let t = Object.entries(e).map(([e, t]) => ({
			url: e,
			...t
		}));
		return Object.fromEntries(t.map((e) => [e.url, e]));
	}
}
function Tn(e, t) {
	let n = /* @__PURE__ */ new Set();
	if (t?.on) {
		let r = t.on;
		if (!r.defaultReadRelays && !r.defaultWriteRelays && !r.relays) return;
		let i = e.getDefaultRelays();
		if (r.defaultReadRelays) for (let { url: e } of Object.values(i).filter((e) => e.read)) n.add(e);
		if (r.defaultWriteRelays) for (let { url: e } of Object.values(i).filter((e) => e.write)) n.add(e);
		if (r.relays) for (let e of r.relays) n.add(b(e));
		return [...n];
	}
	if (t?.relays) {
		for (let e of t.relays) n.add(b(e));
		return [...n];
	}
}
function En(e = {}) {
	return new Dn(y(e));
}
var Dn = class {
	constructor(e) {
		s(this, "connections", new x()), s(this, "defaultRelays", new x()), s(this, "defaultSubscriptions", /* @__PURE__ */ new Map()), s(this, "event$", new R()), s(this, "fin$", new R()), s(this, "ok$", new R()), s(this, "all$", new R()), s(this, "error$", new R()), s(this, "connectionState$", new R()), s(this, "outgoing$", new R()), s(this, "dispose$", new R()), s(this, "disposed", !1), this.config = e;
	}
	get defaultReadableConnections() {
		let e = [];
		for (let { url: t, read: n } of this.defaultRelays.values()) {
			let r = this.connections.get(t);
			n && r && e.push(r);
		}
		return e;
	}
	get defaultWritableConnections() {
		let e = [];
		for (let { url: t, write: n } of this.defaultRelays.values()) {
			let r = this.connections.get(t);
			n && r && e.push(r);
		}
		return e;
	}
	getDefaultRelays(e) {
		if (this.disposed) throw new p();
		let t = ({ read: t, write: n }) => {
			if (!e?.filter) return !0;
			switch (e.filter) {
				case "all": return !0;
				case "read-all": return t;
				case "write-all": return n;
				case "read-only": return t && !n;
				case "write-only": return !t && n;
			}
		}, n = this.defaultRelays.toObject(), r = Object.values(n).filter(t).map((e) => [e.url, e]);
		return Object.fromEntries(r);
	}
	getDefaultRelay(e) {
		return this.defaultRelays.get(e);
	}
	setDefaultRelays(e) {
		if (this.disposed) throw new p();
		let t = new x(wn(e)), n = [];
		for (let { read: e, url: r } of t.values()) {
			let t = this.ensureNostrConnection(r);
			t.setConnectionStrategy(this.config.connectionStrategy), e && n.push(t);
		}
		this.updateDefaultSubscriptions(n), this.defaultRelays = t;
	}
	ensureNostrConnection(e) {
		let t = this.connections.get(e);
		return t || (t = new yn(e, this.config), this.attachNostrConnection(t), this.connections.set(e, t), t);
	}
	attachNostrConnection(e) {
		e.getEventObservable().subscribe(this.event$), e.getFinObservable().subscribe(this.fin$), e.getOkAgainstEventObservable().subscribe(this.ok$), e.getAllMessageObservable().subscribe(this.all$), e.getConnectionStateObservable().subscribe(this.connectionState$), e.getErrorObservable().subscribe(this.error$), e.getOutgoingMessageObservable().subscribe(this.outgoing$);
	}
	updateDefaultSubscriptions(e) {
		let t = xn(this.defaultReadableConnections, e);
		for (let e of t) e.markAsDefault(!1);
		for (let t of e) {
			t.markAsDefault(!0);
			for (let { req: e, autoclose: n } of this.defaultSubscriptions.values()) t?.subscribe(e, {
				mode: "default",
				overwrite: !1,
				autoclose: n
			});
		}
	}
	addDefaultRelays(e) {
		let t = wn(e);
		this.setDefaultRelays({
			...this.defaultRelays.toObject(),
			...t
		});
	}
	removeDefaultRelays(e) {
		let t = this.defaultRelays.copy(), n = Array.isArray(e) ? e : [e];
		for (let e of n) t.delete(e);
		this.setDefaultRelays(t.toObject());
	}
	getAllRelayStatus() {
		return Object.fromEntries(Array.from(this.connections.values()).map((e) => [e.url, { connection: e.connectionState }]));
	}
	getRelayStatus(e) {
		let t = this.connections.get(e);
		if (t) return { connection: t.connectionState };
	}
	reconnect(e) {
		let t = this.getDefaultRelay(e);
		if (!t) throw new u(`The relay (${e}) is not a default relay. \`reconnect()\` can be used only for a readable default relay.`);
		if (!t.read) throw new u(`The relay (${e}) is not readable. \`reconnect()\` can be used only for a readable default relay.`);
		let n = this.connections.get(e);
		if (!n) throw new f();
		(n.connectionState === "error" || n.connectionState === "rejected") && n.connectManually();
	}
	use(e, t) {
		let n = Tn(this, t), r = ({ filters: t, relays: r }, i) => {
			let a = e.strategy === "backward" ? r : void 0, o = Cn({
				rxReq: e,
				filters: t,
				index: i
			});
			return {
				subId: o[1],
				req: o,
				targetConnections: (a ?? n)?.map((e) => this.ensureNostrConnection(e)) ?? this.defaultReadableConnections,
				mode: a === void 0 && n === void 0 ? "default" : "temporary"
			};
		}, i = ({ req: t, targetConnections: n, mode: r }) => {
			this.startSubscription({
				req: t,
				targetConnections: n,
				mode: r,
				overwrite: e.strategy === "forward",
				autoclose: e.strategy === "backward"
			});
		}, a = ({ subId: e, targetConnections: t, mode: n }) => {
			this.teardownSubscription({
				subId: e,
				targetConnections: t,
				mode: n
			});
		}, o = ({ req: t, targetConnections: n }) => e.strategy === "forward" ? this.createForwardEventObservable({ req: t }).pipe(q(this.dispose$)) : this.createBackwardEventObservable({
			req: t,
			targetConnections: n
		}).pipe(q(this.dispose$)), s = e.getReqPacketObservable().pipe(K(({ filters: e }) => e.length > 0), W(r), q(this.dispose$)), c = () => on(async ({ event: e }) => (this.config.skipVerify || await this.config.verifier(e)) && (this.config.skipExpirationCheck || !ce(e)));
		if (e.strategy === "forward") {
			let e;
			return s.pipe(J((t) => {
				e = t;
			}), J(i), W(o), en(() => {
				e && a(e);
			}), rn(), c());
		}
		return s.pipe(J(i), W((e) => o(e).pipe(en(() => {
			a(e);
		}))), Wt(), c());
	}
	createForwardEventObservable(e) {
		let { req: t } = e, n = t[1];
		return this.event$.pipe(cn(n));
	}
	createBackwardEventObservable(e) {
		let { req: t, targetConnections: n } = e, r = t[1], i = /* @__PURE__ */ new Set(), a = (e) => e === "error" || e === "rejected" || e === "terminated", o = () => n.every(({ connectionState: e, url: t }) => a(e) || i.has(t)), s = Kt(this.fin$.pipe(cn(r), J(({ from: e }) => {
			i.add(e);
		})), this.connectionState$.asObservable()).pipe(K(() => o()), tn(null, void 0));
		return this.event$.pipe(q(s), sn(this.config.eoseTimeout), cn(r), K((e) => !i.has(e.from)));
	}
	startSubscription(e) {
		let { req: t, targetConnections: n, mode: r, overwrite: i, autoclose: a } = e, o = t[1];
		r === "default" && this.defaultSubscriptions.set(o, {
			req: t,
			autoclose: a
		});
		for (let e of n) e.subscribe(t, {
			mode: r,
			overwrite: i,
			autoclose: a
		});
	}
	teardownSubscription(e) {
		let { subId: t, targetConnections: n, mode: r } = e;
		r === "default" && this.defaultSubscriptions.delete(t);
		for (let e of n) e.unsubscribe(t);
	}
	createAllEventObservable() {
		return this.event$.asObservable();
	}
	createAllErrorObservable() {
		return this.error$.asObservable();
	}
	createAllMessageObservable() {
		return this.all$.asObservable();
	}
	createConnectionStateObservable() {
		return this.connectionState$.asObservable();
	}
	createOutgoingMessageObservable() {
		return this.outgoing$.asObservable();
	}
	send(e, t) {
		let { signer: n, errorOnTimeout: r, completeOn: i } = m(t ?? {}, {
			signer: this.config.signer,
			errorOnTimeout: !1,
			completeOn: "all-ok"
		}), a = Tn(this, t), o = a === void 0 ? this.defaultWritableConnections : a.map((e) => this.ensureNostrConnection(e)), s = new Set(o.map((e) => e.url)), c = new R(), l = /* @__PURE__ */ new Set(), d = "", f = () => {
			c.closed || c.complete();
			for (let e of o) e.confirmOK(d);
		};
		n.signEvent(e).then(async (e) => {
			c.closed || (d = e.id, this.ok$.pipe(K(({ eventId: t, from: n }) => t === e.id && s.has(n))).subscribe(c), await Promise.all(o.map((t) => t.publish(e))), i === "sent" && c.complete());
		}).catch((e) => {
			throw f(), new u(e instanceof Error ? e.message : "Failed to sign the given event");
		});
		let p = (() => {
			switch (i) {
				case "sent": return P;
				case "all-ok": return an(({ from: e, done: t }) => (t && l.add(e), l.size < o.length), !0);
				case "any-ok": return tn((e) => e.ok);
			}
		})();
		return c.pipe(p, q(this.dispose$), r ? Ot(this.config.okTimeout) : sn(this.config.okTimeout), en(f));
	}
	async cast(e, t) {
		await Tt(this.send(e, {
			...t,
			completeOn: "sent"
		}));
	}
	dispose() {
		this[Symbol.dispose]();
	}
	[Symbol.dispose]() {
		if (this.disposed) return;
		this.disposed = !0;
		for (let e of this.connections.values()) e.dispose();
		this.connections.clear();
		let e = [
			this.event$,
			this.ok$,
			this.fin$,
			this.all$,
			this.connectionState$,
			this.error$,
			this.outgoing$
		];
		for (let t of e) t.complete();
		this.dispose$.next(), this.dispose$.complete();
	}
}, On = (e) => {
	let { strategy: t } = e, n = e.operators ?? [], r = e.rxReqId ?? jn(), i = e.subject ?? new R();
	return {
		strategy: t,
		rxReqId: r,
		getReqPacketObservable() {
			return i.pipe(...n);
		},
		pipe(...e) {
			return On({
				strategy: t,
				rxReqId: r,
				operators: [...n, ...e],
				subject: i
			});
		},
		emit(e, t) {
			i.next({
				filters: Nn(e),
				...t ?? {}
			});
		},
		over() {
			i.complete();
		}
	};
};
function kn(e) {
	return On({
		strategy: "backward",
		rxReqId: e
	});
}
function An(e) {
	return On({
		strategy: "forward",
		rxReqId: e
	});
}
function jn() {
	return `${Math.floor(Math.random() * 1e6)}`;
}
function Mn(e) {
	let t = {}, n = (e) => /^#[a-zA-Z]$/.test(e);
	for (let r of Object.keys(e)) if (r === "limit" && (e[r] ?? -1) >= 0) t[r] = e[r];
	else {
		if (r === "since" || r === "until") {
			let n = e[r];
			if (typeof n != "number" || (n ?? -1) >= 0) {
				t[r] = n;
				continue;
			}
		}
		((n(r) || r === "ids" || r === "authors") && e[r] !== void 0 && (e[r]?.length ?? -1) > 0 || r === "kinds" && e[r] !== void 0 && (e[r]?.length ?? -1) > 0 || r === "search" && e[r] !== void 0) && (t[r] = e[r]);
	}
	return typeof t.since != "number" || typeof t.until != "number" || t.since <= t.until ? t : null;
}
function Nn(e) {
	return (Array.isArray(e) ? e : [e]).map((e) => Mn(e)).filter((e) => e !== null);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/util/isFunction.js
function X(e) {
	return typeof e == "function";
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/util/createErrorClass.js
function Pn(e) {
	var t = e(function(e) {
		Error.call(e), e.stack = (/* @__PURE__ */ Error()).stack;
	});
	return t.prototype = Object.create(Error.prototype), t.prototype.constructor = t, t;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/util/UnsubscriptionError.js
var Fn = Pn(function(e) {
	return function(t) {
		e(this), this.message = t ? t.length + " errors occurred during unsubscription:\n" + t.map(function(e, t) {
			return t + 1 + ") " + e.toString();
		}).join("\n  ") : "", this.name = "UnsubscriptionError", this.errors = t;
	};
});
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/util/arrRemove.js
function In(e, t) {
	if (e) {
		var n = e.indexOf(t);
		0 <= n && e.splice(n, 1);
	}
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/Subscription.js
var Z = function() {
	function e(e) {
		this.initialTeardown = e, this.closed = !1, this._parentage = null, this._finalizers = null;
	}
	return e.prototype.unsubscribe = function() {
		var e, n, a, o, s;
		if (!this.closed) {
			this.closed = !0;
			var c = this._parentage;
			if (c) {
				if (this._parentage = null, Array.isArray(c)) try {
					for (var l = r(c), u = l.next(); !u.done; u = l.next()) u.value.remove(this);
				} catch (t) {
					e = { error: t };
				} finally {
					try {
						u && !u.done && (n = l.return) && n.call(l);
					} finally {
						if (e) throw e.error;
					}
				}
				else c.remove(this);
			}
			var d = this.initialTeardown;
			if (X(d)) try {
				d();
			} catch (e) {
				s = e instanceof Fn ? e.errors : [e];
			}
			var f = this._finalizers;
			if (f) {
				this._finalizers = null;
				try {
					for (var p = r(f), m = p.next(); !m.done; m = p.next()) {
						var h = m.value;
						try {
							zn(h);
						} catch (e) {
							s ??= [], e instanceof Fn ? s = t(t([], i(s)), i(e.errors)) : s.push(e);
						}
					}
				} catch (e) {
					a = { error: e };
				} finally {
					try {
						m && !m.done && (o = p.return) && o.call(p);
					} finally {
						if (a) throw a.error;
					}
				}
			}
			if (s) throw new Fn(s);
		}
	}, e.prototype.add = function(t) {
		if (t && t !== this) {
			if (this.closed) zn(t);
			else {
				if (t instanceof e) {
					if (t.closed || t._hasParent(this)) return;
					t._addParent(this);
				}
				(this._finalizers = this._finalizers ?? []).push(t);
			}
		}
	}, e.prototype._hasParent = function(e) {
		var t = this._parentage;
		return t === e || Array.isArray(t) && t.includes(e);
	}, e.prototype._addParent = function(e) {
		var t = this._parentage;
		this._parentage = Array.isArray(t) ? (t.push(e), t) : t ? [t, e] : e;
	}, e.prototype._removeParent = function(e) {
		var t = this._parentage;
		t === e ? this._parentage = null : Array.isArray(t) && In(t, e);
	}, e.prototype.remove = function(t) {
		var n = this._finalizers;
		n && In(n, t), t instanceof e && t._removeParent(this);
	}, e.EMPTY = (function() {
		var t = new e();
		return t.closed = !0, t;
	})(), e;
}(), Ln = Z.EMPTY;
function Rn(e) {
	return e instanceof Z || e && "closed" in e && X(e.remove) && X(e.add) && X(e.unsubscribe);
}
function zn(e) {
	X(e) ? e() : e.unsubscribe();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/config.js
var Q = {
	onUnhandledError: null,
	onStoppedNotification: null,
	Promise: void 0,
	useDeprecatedSynchronousErrorHandling: !1,
	useDeprecatedNextContext: !1
}, Bn = {
	setTimeout: function(e, n) {
		var r = [...arguments].slice(2), a = Bn.delegate;
		return a?.setTimeout ? a.setTimeout.apply(a, t([e, n], i(r))) : setTimeout.apply(void 0, t([e, n], i(r)));
	},
	clearTimeout: function(e) {
		return (Bn.delegate?.clearTimeout || clearTimeout)(e);
	},
	delegate: void 0
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/util/reportUnhandledError.js
function Vn(e) {
	Bn.setTimeout(function() {
		var t = Q.onUnhandledError;
		if (t) t(e);
		else throw e;
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/util/noop.js
function Hn() {}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/NotificationFactories.js
var Un = (function() {
	return Kn("C", void 0, void 0);
})();
function Wn(e) {
	return Kn("E", void 0, e);
}
function Gn(e) {
	return Kn("N", e, void 0);
}
function Kn(e, t, n) {
	return {
		kind: e,
		value: t,
		error: n
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/util/errorContext.js
var $ = null;
function qn(e) {
	if (Q.useDeprecatedSynchronousErrorHandling) {
		var t = !$;
		if (t && ($ = {
			errorThrown: !1,
			error: null
		}), e(), t) {
			var n = $, r = n.errorThrown, i = n.error;
			if ($ = null, r) throw i;
		}
	} else e();
}
function Jn(e) {
	Q.useDeprecatedSynchronousErrorHandling && $ && ($.errorThrown = !0, $.error = e);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/Subscriber.js
var Yn = function(e) {
	n(t, e);
	function t(t) {
		var n = e.call(this) || this;
		return n.isStopped = !1, t ? (n.destination = t, Rn(t) && t.add(n)) : n.destination = rr, n;
	}
	return t.create = function(e, t, n) {
		return new $n(e, t, n);
	}, t.prototype.next = function(e) {
		this.isStopped ? nr(Gn(e), this) : this._next(e);
	}, t.prototype.error = function(e) {
		this.isStopped ? nr(Wn(e), this) : (this.isStopped = !0, this._error(e));
	}, t.prototype.complete = function() {
		this.isStopped ? nr(Un, this) : (this.isStopped = !0, this._complete());
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
}(Z), Xn = Function.prototype.bind;
function Zn(e, t) {
	return Xn.call(e, t);
}
var Qn = function() {
	function e(e) {
		this.partialObserver = e;
	}
	return e.prototype.next = function(e) {
		var t = this.partialObserver;
		if (t.next) try {
			t.next(e);
		} catch (e) {
			er(e);
		}
	}, e.prototype.error = function(e) {
		var t = this.partialObserver;
		if (t.error) try {
			t.error(e);
		} catch (e) {
			er(e);
		}
		else er(e);
	}, e.prototype.complete = function() {
		var e = this.partialObserver;
		if (e.complete) try {
			e.complete();
		} catch (e) {
			er(e);
		}
	}, e;
}(), $n = function(e) {
	n(t, e);
	function t(t, n, r) {
		var i = e.call(this) || this, a;
		if (X(t) || !t) a = {
			next: t ?? void 0,
			error: n ?? void 0,
			complete: r ?? void 0
		};
		else {
			var o;
			i && Q.useDeprecatedNextContext ? (o = Object.create(t), o.unsubscribe = function() {
				return i.unsubscribe();
			}, a = {
				next: t.next && Zn(t.next, o),
				error: t.error && Zn(t.error, o),
				complete: t.complete && Zn(t.complete, o)
			}) : a = t;
		}
		return i.destination = new Qn(a), i;
	}
	return t;
}(Yn);
function er(e) {
	Q.useDeprecatedSynchronousErrorHandling ? Jn(e) : Vn(e);
}
function tr(e) {
	throw e;
}
function nr(e, t) {
	var n = Q.onStoppedNotification;
	n && Bn.setTimeout(function() {
		return n(e, t);
	});
}
var rr = {
	closed: !0,
	next: Hn,
	error: tr,
	complete: Hn
}, ir = (function() {
	return typeof Symbol == "function" && Symbol.observable || "@@observable";
})();
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/util/identity.js
function ar(e) {
	return e;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/util/pipe.js
function or(e) {
	return e.length === 0 ? ar : e.length === 1 ? e[0] : function(t) {
		return e.reduce(function(e, t) {
			return t(e);
		}, t);
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/Observable.js
var sr = function() {
	function e(e) {
		e && (this._subscribe = e);
	}
	return e.prototype.lift = function(t) {
		var n = new e();
		return n.source = this, n.operator = t, n;
	}, e.prototype.subscribe = function(e, t, n) {
		var r = this, i = ur(e) ? e : new $n(e, t, n);
		return qn(function() {
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
		return t = cr(t), new t(function(t, r) {
			var i = new $n({
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
	}, e.prototype[ir] = function() {
		return this;
	}, e.prototype.pipe = function() {
		return or([...arguments])(this);
	}, e.prototype.toPromise = function(e) {
		var t = this;
		return e = cr(e), new e(function(e, n) {
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
function cr(e) {
	return e ?? Q.Promise ?? Promise;
}
function lr(e) {
	return e && X(e.next) && X(e.error) && X(e.complete);
}
function ur(e) {
	return e && e instanceof Yn || lr(e) && Rn(e);
}
var dr = class {
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
function fr(e, t, n, r = (t) => e.finish(t)) {
	let i = !1, a = !1, o = {};
	return () => {
		e.reason || i || (i = !0, queueMicrotask(() => {
			i = !1, !e.reason && (t.every((e) => e.finished) ? r(t.every((e) => e.failed) ? "error" : "complete") : n && !a && t.filter((e) => e.eoseReceived && e.verificationDrained).length >= Math.ceil(t.length * .6) && (a = !0, e.schedule(o, e.now() + 300, () => r("quorum"))));
		}));
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/relay/query.ts
var pr = 1e4, mr = 3e4, hr = 4e3, gr = 44e3;
function _r(t, n, r, i = {}) {
	return new sr((a) => {
		let o = new Z(), s = r?.on, c = typeof t.getDefaultRelays == "function" ? Object.values(t.getDefaultRelays()) : [], l = e.sanitizeExternalRelayUrls([
			...s?.relays ?? r?.relays ?? [],
			...!r || s?.defaultReadRelays ? c.filter((e) => e.read).map((e) => e.url) : [],
			...s?.defaultWriteRelays ? c.filter((e) => e.write).map((e) => e.url) : []
		]), u = (l.length ? l : [void 0]).map((e, t) => ({
			relay: e,
			requestId: `${n.rxReqId}-${t}`,
			eoseReceived: !1,
			verificationDrained: !1,
			finished: !1,
			failed: !1,
			eoseIds: /* @__PURE__ */ new Set()
		})), d = 0, f = !1, p, m;
		a.add(() => {
			o.unsubscribe(), i.operation || m?.finish("cancelled");
		});
		let h = (e) => {
			f || (f = !0, o.unsubscribe(), i.onEnd?.({
				reason: e,
				complete: u.every((e) => e.eoseReceived && e.verificationDrained),
				eoseRelays: u.flatMap((e) => e.relay && e.eoseReceived && e.verificationDrained ? [e.relay] : [])
			}), e === "error" ? a.error(p ?? /* @__PURE__ */ Error("relay_query_failed")) : a.complete());
		}, g = Math.max(1, i.timeoutMs ?? 6e3);
		m = i.operation ?? new dr(g, h, i);
		let _ = m;
		if (i.deadlineAt !== void 0 && !i.operation && _.setDeadline(Math.min(_.startedAt + g, i.deadlineAt)), i.operation && i.deadlineAt !== void 0) {
			let e = {};
			_.schedule(e, i.deadlineAt, () => h("timeout")), o.add(() => _.unschedule(e));
		}
		let ee = _.add(() => h(_.reason ?? "cancelled"));
		o.add(ee), i.operation || _.bind(i.signal);
		let v = fr(_, u, i.quorum !== !1, (e) => i.operation ? h(e) : _.finish(e));
		if (_.reason) return;
		n.getReqPacketObservable && o.add(n.getReqPacketObservable().subscribe({ next: () => {
			d++;
			for (let e of u) e.eoseReceived = e.eoseIds.size >= d;
		} }));
		let y = i.quorum !== !1 && typeof t.createAllMessageObservable == "function" && l.length > 0;
		if (!y) for (let e of u) e.requestId = n.rxReqId;
		t.createAllMessageObservable && o.add(t.createAllMessageObservable().subscribe({ next: (t) => {
			if (t.type !== "EOSE" || !t.subId) return;
			let n = u.find((n) => n.relay === e.normalizeExternalRelayUrl(t.from));
			if (!n) return;
			let r = `${n.requestId}:`;
			if (!t.subId.startsWith(r)) return;
			let i = t.subId.slice(r.length), a = Number(i);
			!Number.isSafeInteger(a) || a < 0 || a >= Math.max(1, d) || String(a) !== i || (n.eoseIds.add(t.subId), n.eoseReceived = n.eoseIds.size >= Math.max(1, d), v());
		} }));
		for (let e of y ? u.map((e) => [e]) : [u]) {
			if (f) break;
			let s = y ? { on: { relays: [e[0].relay] } } : l.length ? { on: { relays: l } } : r, c = y ? {
				...n,
				rxReqId: e[0].requestId
			} : n, u = i.source ? i.source(c, s) : s === void 0 ? t.use(c) : t.use(c, s);
			o.add(u.subscribe({
				next: (e) => {
					f || a.next(e);
				},
				error: (t) => {
					p = t;
					for (let t of e) t.finished = !0, t.failed = !0;
					v();
				},
				complete: () => {
					for (let t of e) t.finished = !0, t.verificationDrained = !0;
					v();
				}
			}));
		}
		if (!d && u.every((e) => e.finished)) {
			let e = u.every((e) => e.failed) ? "error" : "complete";
			i.operation ? h(e) : _.finish(e);
		}
	});
}
function vr(t, n, r, i) {
	return new sr((a) => {
		let o = new Z(), s = new dr(pr, () => a.complete()), c = new Set(r), l = /* @__PURE__ */ new Set(), u = s.startedAt + gr, d, f = () => {
			let e = c.size ? s.startedAt + pr : l.size ? d : s.now() + (i.timeoutMs ?? hr);
			s.setDeadline(Math.min(u, e));
		};
		if (s.bind(i.signal), !s.reason) return t.createOutgoingMessageObservable ? (o.add(t.createOutgoingMessageObservable().subscribe({ next: (t) => {
			if (t.message[0] !== "REQ" || !String(t.message[1]).startsWith(`${n.rxReqId}:`)) return;
			let i = e.normalizeExternalRelayUrl(t.to);
			if (!i || !r.includes(i)) return;
			let a = c.delete(i), o = l.delete(i);
			(a || o) && f();
		} })), t.createAllMessageObservable && o.add(t.createAllMessageObservable().subscribe({ next: (t) => {
			if (t.type !== "CLOSED" || !t.subId?.startsWith(`${n.rxReqId}:`) || !t.notice?.startsWith("auth-required:")) return;
			let i = e.normalizeExternalRelayUrl(t.from);
			i && r.includes(i) && (l.add(i), d ??= s.now() + mr, f());
		} }))) : s.setDeadline(s.startedAt + (i.timeoutMs ?? hr)), o.add(_r(t, n, { on: { relays: r } }, {
			...i,
			quorum: !1,
			operation: s,
			onEnd: (e) => i.onEnd?.({
				...e,
				phase: c.size ? "preparation" : l.size ? "auth" : "response",
				authPending: l.size > 0
			})
		}).subscribe({
			next: (e) => a.next(e),
			error: (e) => a.error(e),
			complete: () => a.complete()
		})), s.add(() => o.unsubscribe()), () => {
			o.unsubscribe(), s.finish("cancelled");
		};
	});
}
export { sr as a, Ln as c, Pn as d, X as f, ee as g, En as h, fr as i, Z as l, An as m, _r as n, Yn as o, kn as p, dr as r, qn as s, vr as t, In as u };
