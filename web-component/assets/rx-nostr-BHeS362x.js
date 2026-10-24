// D:/ドキュメント/GitHub/ehagaki/node_modules/rx-nostr/dist/rx-nostr.js
var e = Object.defineProperty, t = (t, n, r) => n in t ? e(t, n, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: r
}) : t[n] = r, n = (e, n, r) => (t(e, typeof n == "symbol" ? n : n + "", r), r), r = class extends Error {}, i = class extends r {
	constructor(e) {
		super(`RxNostrWebSocketError: WebSocket was closed with code ${e} by relay.`), this.code = e, this.name = "RxNostrWebSocketError";
	}
}, a = class extends r {
	constructor(e) {
		super(`RxNostrInvalidUsageError: ${e}`), this.name = "RxNostrInvalidUsageError";
	}
}, o = class extends r {
	constructor(e) {
		super(`RxNostrEnvironmentError: ${e}`), this.name = "RxNostrEnvironmentError";
	}
}, s = class extends r {
	constructor() {
		super("RxNostrLogicError: This is rx-nostr's internal bug. Please report to the author of the library."), this.name = "RxNostrLogicError";
	}
}, c = class extends r {
	constructor() {
		super("RxNostrAlreadyDisposedError: Attempted to access a disposed resource."), this.name = "RxNostrAlreadyDisposedError";
	}
}, l = (e, t) => ({
	...t,
	...e
});
function u(e) {
	if (typeof e.id != "string" || typeof e.sig != "string" || typeof e.kind != "number" || typeof e.pubkey != "string" || typeof e.content != "string" || typeof e.created_at != "number" || !Array.isArray(e.tags)) return !1;
	for (let t = 0; t < e.tags.length; t++) {
		let n = e.tags[t];
		if (!Array.isArray(n)) return !1;
		for (let e = 0; e < n.length; e++) if (typeof n[e] == "object") return !1;
	}
	return !0;
}
function d(e) {
	throw e;
}
function f(e) {
	return {
		async signEvent(t) {
			let n = {
				...t,
				pubkey: t.pubkey ?? await (window == null ? void 0 : window.nostr)?.getPublicKey() ?? d(new o("window.nostr.getPublicKey() is not found")),
				tags: [...t.tags ?? [], ...e?.tags ?? []],
				created_at: t.created_at ?? Math.floor(Date.now() / 1e3)
			};
			return u(n) ? n : await (window == null ? void 0 : window.nostr)?.signEvent(n) ?? d(new o("window.nostr.signEvent() is not found"));
		},
		getPublicKey() {
			return (window == null ? void 0 : window.nostr)?.getPublicKey() ?? d(new o("window.nostr.getPublicKey() is not found"));
		}
	};
}
function p() {
	return {
		async signEvent(e) {
			return e;
		},
		async getPublicKey() {
			throw new a("noopSigner cannot calculate pubkey.");
		}
	};
}
var m = async () => {
	throw Error("You must give some verifier to createRxNostr(). In most cases, @rx-nostr/crypto packages will help you.");
}, ee = (e) => l(e, {
	signer: f(),
	verifier: m,
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
function h(e) {
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
var g = class e extends Map {
	constructor(e) {
		if (super(), e) for (let [t, n] of Object.entries(e)) this.set(h(t), n);
	}
	get(e) {
		return super.get(h(e));
	}
	getMany(e) {
		let t = [];
		for (let n of new Set(e.map(h))) {
			let e = this.get(n);
			e !== void 0 && t.push(e);
		}
		return t;
	}
	set(e, t) {
		return super.set(h(e), t);
	}
	has(e) {
		return super.has(h(e));
	}
	delete(e) {
		return super.delete(h(e));
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
}, _ = class {
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
n(_, "cache", new g()), n(_, "default", {});
function oe(e, t, n) {
	return Array.isArray(t) ? t.some((t) => se(e, t, n)) : se(e, t, n);
}
function se(e, t, n) {
	let { sinceInclusive: r, untilInclusive: i } = l(n ?? {}, {
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
function v(e, t) {
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
function y(e) {
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
function b(e, t) {
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
function x(e, t, n) {
	if (n || arguments.length === 2) for (var r = 0, i = t.length, a; r < i; r++) (a || !(r in t)) && (a ||= Array.prototype.slice.call(t, 0, r), a[r] = t[r]);
	return e.concat(a || Array.prototype.slice.call(t));
}
function S(e) {
	return this instanceof S ? (this.v = e, this) : new S(e);
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
		e.value instanceof S ? Promise.resolve(e.value.v).then(l, u) : d(a[0][2], e);
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
	return t ? t.call(e) : (e = typeof y == "function" ? y(e) : e[Symbol.iterator](), n = {}, r("next"), r("throw"), r("return"), n[Symbol.asyncIterator] = function() {
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
function C(e) {
	return typeof e == "function";
}
function w(e) {
	var t = e(function(e) {
		Error.call(e), e.stack = (/* @__PURE__ */ Error()).stack;
	});
	return t.prototype = Object.create(Error.prototype), t.prototype.constructor = t, t;
}
var T = w(function(e) {
	return function(t) {
		e(this), this.message = t ? t.length + " errors occurred during unsubscription:\n" + t.map(function(e, t) {
			return t + 1 + ") " + e.toString();
		}).join("\n  ") : "", this.name = "UnsubscriptionError", this.errors = t;
	};
});
function E(e, t) {
	if (e) {
		var n = e.indexOf(t);
		0 <= n && e.splice(n, 1);
	}
}
var D = function() {
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
					for (var o = y(a), s = o.next(); !s.done; s = o.next()) s.value.remove(this);
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
			if (C(c)) try {
				c();
			} catch (e) {
				i = e instanceof T ? e.errors : [e];
			}
			var l = this._finalizers;
			if (l) {
				this._finalizers = null;
				try {
					for (var u = y(l), d = u.next(); !d.done; d = u.next()) {
						var f = d.value;
						try {
							ge(f);
						} catch (e) {
							i ??= [], e instanceof T ? i = x(x([], b(i)), b(e.errors)) : i.push(e);
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
			if (i) throw new T(i);
		}
	}, e.prototype.add = function(t) {
		if (t && t !== this) {
			if (this.closed) ge(t);
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
		t === e ? this._parentage = null : Array.isArray(t) && E(t, e);
	}, e.prototype.remove = function(t) {
		var n = this._finalizers;
		n && E(n, t), t instanceof e && t._removeParent(this);
	}, e.EMPTY = function() {
		var t = new e();
		return t.closed = !0, t;
	}(), e;
}(), me = D.EMPTY;
function he(e) {
	return e instanceof D || e && "closed" in e && C(e.remove) && C(e.add) && C(e.unsubscribe);
}
function ge(e) {
	C(e) ? e() : e.unsubscribe();
}
var _e = {
	onUnhandledError: null,
	onStoppedNotification: null,
	Promise: void 0,
	useDeprecatedSynchronousErrorHandling: !1,
	useDeprecatedNextContext: !1
}, O = {
	setTimeout: function(e, t) {
		var n = [...arguments].slice(2), r = O.delegate;
		return r?.setTimeout ? r.setTimeout.apply(r, x([e, t], b(n))) : setTimeout.apply(void 0, x([e, t], b(n)));
	},
	clearTimeout: function(e) {
		return (O.delegate?.clearTimeout || clearTimeout)(e);
	},
	delegate: void 0
};
function ve(e) {
	O.setTimeout(function() {
		throw e;
	});
}
function k() {}
function A(e) {
	e();
}
var j = function(e) {
	v(t, e);
	function t(t) {
		var n = e.call(this) || this;
		return n.isStopped = !1, t ? (n.destination = t, he(t) && t.add(n)) : n.destination = Se, n;
	}
	return t.create = function(e, t, n) {
		return new N(e, t, n);
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
}(D), ye = Function.prototype.bind;
function M(e, t) {
	return ye.call(e, t);
}
var be = function() {
	function e(e) {
		this.partialObserver = e;
	}
	return e.prototype.next = function(e) {
		var t = this.partialObserver;
		if (t.next) try {
			t.next(e);
		} catch (e) {
			P(e);
		}
	}, e.prototype.error = function(e) {
		var t = this.partialObserver;
		if (t.error) try {
			t.error(e);
		} catch (e) {
			P(e);
		}
		else P(e);
	}, e.prototype.complete = function() {
		var e = this.partialObserver;
		if (e.complete) try {
			e.complete();
		} catch (e) {
			P(e);
		}
	}, e;
}(), N = function(e) {
	v(t, e);
	function t(t, n, r) {
		var i = e.call(this) || this, a;
		if (C(t) || !t) a = {
			next: t ?? void 0,
			error: n ?? void 0,
			complete: r ?? void 0
		};
		else {
			var o;
			i && _e.useDeprecatedNextContext ? (o = Object.create(t), o.unsubscribe = function() {
				return i.unsubscribe();
			}, a = {
				next: t.next && M(t.next, o),
				error: t.error && M(t.error, o),
				complete: t.complete && M(t.complete, o)
			}) : a = t;
		}
		return i.destination = new be(a), i;
	}
	return t;
}(j);
function P(e) {
	ve(e);
}
function xe(e) {
	throw e;
}
var Se = {
	closed: !0,
	next: k,
	error: xe,
	complete: k
}, Ce = function() {
	return typeof Symbol == "function" && Symbol.observable || "@@observable";
}();
function F(e) {
	return e;
}
function we() {
	return Te([...arguments]);
}
function Te(e) {
	return e.length === 0 ? F : e.length === 1 ? e[0] : function(t) {
		return e.reduce(function(e, t) {
			return t(e);
		}, t);
	};
}
var I = function() {
	function e(e) {
		e && (this._subscribe = e);
	}
	return e.prototype.lift = function(t) {
		var n = new e();
		return n.source = this, n.operator = t, n;
	}, e.prototype.subscribe = function(e, t, n) {
		var r = this, i = Oe(e) ? e : new N(e, t, n);
		return A(function() {
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
		return t = Ee(t), new t(function(t, r) {
			var i = new N({
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
	}, e.prototype[Ce] = function() {
		return this;
	}, e.prototype.pipe = function() {
		return Te([...arguments])(this);
	}, e.prototype.toPromise = function(e) {
		var t = this;
		return e = Ee(e), new e(function(e, n) {
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
function Ee(e) {
	return e ?? _e.Promise ?? Promise;
}
function De(e) {
	return e && C(e.next) && C(e.error) && C(e.complete);
}
function Oe(e) {
	return e && e instanceof j || De(e) && he(e);
}
function ke(e) {
	return C(e?.lift);
}
function L(e) {
	return function(t) {
		if (ke(t)) return t.lift(function(t) {
			try {
				return e(t, this);
			} catch (e) {
				this.error(e);
			}
		});
		throw TypeError("Unable to lift unknown Observable type");
	};
}
function R(e, t, n, r, i) {
	return new Ae(e, t, n, r, i);
}
var Ae = function(e) {
	v(t, e);
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
}(j), je = w(function(e) {
	return function() {
		e(this), this.name = "ObjectUnsubscribedError", this.message = "object unsubscribed";
	};
}), z = function(e) {
	v(t, e);
	function t() {
		var t = e.call(this) || this;
		return t.closed = !1, t.currentObservers = null, t.observers = [], t.isStopped = !1, t.hasError = !1, t.thrownError = null, t;
	}
	return t.prototype.lift = function(e) {
		var t = new Me(this, this);
		return t.operator = e, t;
	}, t.prototype._throwIfClosed = function() {
		if (this.closed) throw new je();
	}, t.prototype.next = function(e) {
		var t = this;
		A(function() {
			var n, r;
			if (t._throwIfClosed(), !t.isStopped) {
				t.currentObservers ||= Array.from(t.observers);
				try {
					for (var i = y(t.currentObservers), a = i.next(); !a.done; a = i.next()) a.value.next(e);
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
		A(function() {
			if (t._throwIfClosed(), !t.isStopped) {
				t.hasError = t.isStopped = !0, t.thrownError = e;
				for (var n = t.observers; n.length;) n.shift().error(e);
			}
		});
	}, t.prototype.complete = function() {
		var e = this;
		A(function() {
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
		return r || i ? me : (this.currentObservers = null, a.push(e), new D(function() {
			t.currentObservers = null, E(a, e);
		}));
	}, t.prototype._checkFinalizedStatuses = function(e) {
		var t = this, n = t.hasError, r = t.thrownError, i = t.isStopped;
		n ? e.error(r) : i && e.complete();
	}, t.prototype.asObservable = function() {
		var e = new I();
		return e.source = this, e;
	}, t.create = function(e, t) {
		return new Me(e, t);
	}, t;
}(I), Me = function(e) {
	v(t, e);
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
		return this.source?.subscribe(e) ?? me;
	}, t;
}(z), Ne = function(e) {
	v(t, e);
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
}(z), Pe = {
	now: function() {
		return (Pe.delegate || Date).now();
	},
	delegate: void 0
}, Fe = function(e) {
	v(t, e);
	function t(t, n) {
		return e.call(this) || this;
	}
	return t.prototype.schedule = function(e, t) {
		return this;
	}, t;
}(D), B = {
	setInterval: function(e, t) {
		var n = [...arguments].slice(2), r = B.delegate;
		return r?.setInterval ? r.setInterval.apply(r, x([e, t], b(n))) : setInterval.apply(void 0, x([e, t], b(n)));
	},
	clearInterval: function(e) {
		return (B.delegate?.clearInterval || clearInterval)(e);
	},
	delegate: void 0
}, Ie = function(e) {
	v(t, e);
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
		return n === void 0 && (n = 0), B.setInterval(e.flush.bind(e, this), n);
	}, t.prototype.recycleAsyncId = function(e, t, n) {
		if (n === void 0 && (n = 0), n != null && this.delay === n && this.pending === !1) return t;
		t != null && B.clearInterval(t);
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
			this.work = this.state = this.scheduler = null, this.pending = !1, E(i, this), n != null && (this.id = this.recycleAsyncId(r, n, null)), this.delay = null, e.prototype.unsubscribe.call(this);
		}
	}, t;
}(Fe), Le = function() {
	function e(t, n) {
		n === void 0 && (n = e.now), this.schedulerActionCtor = t, this.now = n;
	}
	return e.prototype.schedule = function(e, t, n) {
		return t === void 0 && (t = 0), new this.schedulerActionCtor(this, e).schedule(n, t);
	}, e.now = Pe.now, e;
}(), Re = new (function(e) {
	v(t, e);
	function t(t, n) {
		n === void 0 && (n = Le.now);
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
}(Le))(Ie), ze = Re, V = new I(function(e) {
	return e.complete();
});
function Be(e) {
	return e && C(e.schedule);
}
function H(e) {
	return e[e.length - 1];
}
function Ve(e) {
	return C(H(e)) ? e.pop() : void 0;
}
function U(e) {
	return Be(H(e)) ? e.pop() : void 0;
}
function He(e, t) {
	return typeof H(e) == "number" ? e.pop() : t;
}
var Ue = function(e) {
	return e && typeof e.length == "number" && typeof e != "function";
};
function We(e) {
	return C(e?.then);
}
function Ge(e) {
	return C(e[Ce]);
}
function Ke(e) {
	return Symbol.asyncIterator && C(e?.[Symbol.asyncIterator]);
}
function qe(e) {
	return /* @__PURE__ */ TypeError("You provided " + (typeof e == "object" && e ? "an invalid object" : "'" + e + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
}
function Je() {
	return typeof Symbol != "function" || !Symbol.iterator ? "@@iterator" : Symbol.iterator;
}
var Ye = Je();
function Xe(e) {
	return C(e?.[Ye]);
}
function Ze(e) {
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
				case 2: return [4, S(t.read())];
				case 3: return n = a.sent(), r = n.value, i = n.done, i ? [4, S(void 0)] : [3, 5];
				case 4: return [2, a.sent()];
				case 5: return [4, S(r)];
				case 6: return [4, a.sent()];
				case 7: return a.sent(), [3, 2];
				case 8: return [3, 10];
				case 9: return t.releaseLock(), [7];
				case 10: return [2];
			}
		});
	});
}
function Qe(e) {
	return C(e?.getReader);
}
function W(e) {
	if (e instanceof I) return e;
	if (e != null) {
		if (Ge(e)) return $e(e);
		if (Ue(e)) return et(e);
		if (We(e)) return tt(e);
		if (Ke(e)) return rt(e);
		if (Xe(e)) return nt(e);
		if (Qe(e)) return it(e);
	}
	throw qe(e);
}
function $e(e) {
	return new I(function(t) {
		var n = e[Ce]();
		if (C(n.subscribe)) return n.subscribe(t);
		throw TypeError("Provided object does not correctly implement Symbol.observable");
	});
}
function et(e) {
	return new I(function(t) {
		for (var n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
		t.complete();
	});
}
function tt(e) {
	return new I(function(t) {
		e.then(function(e) {
			t.closed || (t.next(e), t.complete());
		}, function(e) {
			return t.error(e);
		}).then(null, ve);
	});
}
function nt(e) {
	return new I(function(t) {
		var n, r;
		try {
			for (var i = y(e), a = i.next(); !a.done; a = i.next()) {
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
function rt(e) {
	return new I(function(t) {
		at(e, t).catch(function(e) {
			return t.error(e);
		});
	});
}
function it(e) {
	return rt(Ze(e));
}
function at(e, t) {
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
function G(e, t, n, r, i) {
	r === void 0 && (r = 0), i === void 0 && (i = !1);
	var a = t.schedule(function() {
		n(), i ? e.add(this.schedule(null, r)) : this.unsubscribe();
	}, r);
	if (e.add(a), !i) return a;
}
function ot(e, t) {
	return t === void 0 && (t = 0), L(function(n, r) {
		n.subscribe(R(r, function(n) {
			return G(r, e, function() {
				return r.next(n);
			}, t);
		}, function() {
			return G(r, e, function() {
				return r.complete();
			}, t);
		}, function(n) {
			return G(r, e, function() {
				return r.error(n);
			}, t);
		}));
	});
}
function st(e, t) {
	return t === void 0 && (t = 0), L(function(n, r) {
		r.add(e.schedule(function() {
			return n.subscribe(r);
		}, t));
	});
}
function ct(e, t) {
	return W(e).pipe(st(t), ot(t));
}
function lt(e, t) {
	return W(e).pipe(st(t), ot(t));
}
function ut(e, t) {
	return new I(function(n) {
		var r = 0;
		return t.schedule(function() {
			r === e.length ? n.complete() : (n.next(e[r++]), n.closed || this.schedule());
		});
	});
}
function dt(e, t) {
	return new I(function(n) {
		var r;
		return G(n, t, function() {
			r = e[Ye](), G(n, t, function() {
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
			return C(r?.return) && r.return();
		};
	});
}
function ft(e, t) {
	if (!e) throw Error("Iterable cannot be null");
	return new I(function(n) {
		G(n, t, function() {
			var r = e[Symbol.asyncIterator]();
			G(n, t, function() {
				r.next().then(function(e) {
					e.done ? n.complete() : n.next(e.value);
				});
			}, 0, !0);
		});
	});
}
function pt(e, t) {
	return ft(Ze(e), t);
}
function mt(e, t) {
	if (e != null) {
		if (Ge(e)) return ct(e, t);
		if (Ue(e)) return ut(e, t);
		if (We(e)) return lt(e, t);
		if (Ke(e)) return ft(e, t);
		if (Xe(e)) return dt(e, t);
		if (Qe(e)) return pt(e, t);
	}
	throw qe(e);
}
function K(e, t) {
	return t ? mt(e, t) : W(e);
}
function ht() {
	var e = [...arguments];
	return K(e, U(e));
}
var q = w(function(e) {
	return function() {
		e(this), this.name = "EmptyError", this.message = "no elements in sequence";
	};
});
function gt(e, t) {
	var n = typeof t == "object";
	return new Promise(function(r, i) {
		var a = new N({
			next: function(e) {
				r(e), a.unsubscribe();
			},
			error: i,
			complete: function() {
				n ? r(t.defaultValue) : i(new q());
			}
		});
		e.subscribe(a);
	});
}
function _t(e) {
	return e instanceof Date && !isNaN(e);
}
var vt = w(function(e) {
	return function(t) {
		t === void 0 && (t = null), e(this), this.message = "Timeout has occurred", this.name = "TimeoutError", this.info = t;
	};
});
function yt(e, t) {
	var n = _t(e) ? { first: e } : typeof e == "number" ? { each: e } : e, r = n.first, i = n.each, a = n.with, o = a === void 0 ? bt : a, s = n.scheduler, c = s === void 0 ? t ?? Re : s, l = n.meta, u = l === void 0 ? null : l;
	if (r == null && i == null) throw TypeError("No timeout provided.");
	return L(function(e, t) {
		var n, a, s = null, l = 0, d = function(e) {
			a = G(t, c, function() {
				try {
					n.unsubscribe(), W(o({
						meta: u,
						lastValue: s,
						seen: l
					})).subscribe(t);
				} catch (e) {
					t.error(e);
				}
			}, e);
		};
		n = e.subscribe(R(t, function(e) {
			a?.unsubscribe(), l++, t.next(s = e), i > 0 && d(i);
		}, void 0, void 0, function() {
			a?.closed || a?.unsubscribe(), s = null;
		})), !l && d(r == null ? i : typeof r == "number" ? r : +r - c.now());
	});
}
function bt(e) {
	throw new vt(e);
}
function J(e, t) {
	return L(function(n, r) {
		var i = 0;
		n.subscribe(R(r, function(n) {
			r.next(e.call(t, n, i++));
		}));
	});
}
var xt = Array.isArray;
function St(e, t) {
	return xt(t) ? e.apply(void 0, x([], b(t))) : e(t);
}
function Ct(e) {
	return J(function(t) {
		return St(e, t);
	});
}
var wt = Array.isArray, Tt = Object.getPrototypeOf, Et = Object.prototype, Dt = Object.keys;
function Ot(e) {
	if (e.length === 1) {
		var t = e[0];
		if (wt(t)) return {
			args: t,
			keys: null
		};
		if (kt(t)) {
			var n = Dt(t);
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
function kt(e) {
	return e && typeof e == "object" && Tt(e) === Et;
}
function At(e, t) {
	return e.reduce(function(e, n, r) {
		return e[n] = t[r], e;
	}, {});
}
function jt() {
	var e = [...arguments], t = U(e), n = Ve(e), r = Ot(e), i = r.args, a = r.keys;
	if (i.length === 0) return K([], t);
	var o = new I(Mt(i, t, a ? function(e) {
		return At(a, e);
	} : F));
	return n ? o.pipe(Ct(n)) : o;
}
function Mt(e, t, n) {
	return n === void 0 && (n = F), function(r) {
		Nt(t, function() {
			for (var i = e.length, a = Array(i), o = i, s = i, c = function(i) {
				Nt(t, function() {
					var c = K(e[i], t), l = !1;
					c.subscribe(R(r, function(e) {
						a[i] = e, l || (l = !0, s--), s || r.next(n(a.slice()));
					}, function() {
						--o || r.complete();
					}));
				}, r);
			}, l = 0; l < i; l++) c(l);
		}, r);
	};
}
function Nt(e, t, n) {
	e ? G(n, e, t) : t();
}
function Pt(e, t, n, r, i, a, o, s) {
	var c = [], l = 0, u = 0, d = !1, f = function() {
		d && !c.length && !l && t.complete();
	}, p = function(e) {
		return l < r ? m(e) : c.push(e);
	}, m = function(e) {
		a && t.next(e), l++;
		var s = !1;
		W(n(e, u++)).subscribe(R(t, function(e) {
			i?.(e), a ? p(e) : t.next(e);
		}, function() {
			s = !0;
		}, void 0, function() {
			if (s) try {
				l--;
				for (var e = function() {
					var e = c.shift();
					o ? G(t, o, function() {
						return m(e);
					}) : m(e);
				}; c.length && l < r;) e();
				f();
			} catch (e) {
				t.error(e);
			}
		}));
	};
	return e.subscribe(R(t, p, function() {
		d = !0, f();
	})), function() {
		s?.();
	};
}
function Y(e, t, n) {
	return n === void 0 && (n = Infinity), C(t) ? Y(function(n, r) {
		return J(function(e, i) {
			return t(n, e, r, i);
		})(W(e(n, r)));
	}, n) : (typeof t == "number" && (n = t), L(function(t, r) {
		return Pt(t, r, e, n);
	}));
}
function Ft(e) {
	return e === void 0 && (e = Infinity), Y(F, e);
}
function It(e, t, n) {
	e === void 0 && (e = 0), n === void 0 && (n = ze);
	var r = -1;
	return t != null && (Be(t) ? n = t : r = t), new I(function(t) {
		var i = _t(e) ? +e - n.now() : e;
		i < 0 && (i = 0);
		var a = 0;
		return n.schedule(function() {
			t.closed || (t.next(a++), 0 <= r ? this.schedule(void 0, r) : t.complete());
		}, i);
	});
}
function Lt() {
	var e = [...arguments], t = U(e), n = He(e, Infinity), r = e;
	return r.length ? r.length === 1 ? W(r[0]) : Ft(n)(K(r, t)) : V;
}
function X(e, t) {
	return L(function(n, r) {
		var i = 0;
		n.subscribe(R(r, function(n) {
			return e.call(t, n, i++) && r.next(n);
		}));
	});
}
function Rt(e) {
	return L(function(t, n) {
		var r = null, i = !1, a;
		r = t.subscribe(R(n, void 0, void 0, function(o) {
			a = W(e(o, Rt(e)(t))), r ? (r.unsubscribe(), r = null, a.subscribe(n)) : i = !0;
		})), i && (r.unsubscribe(), r = null, a.subscribe(n));
	});
}
function zt(e) {
	return L(function(t, n) {
		var r = !1;
		t.subscribe(R(n, function(e) {
			r = !0, n.next(e);
		}, function() {
			r || n.next(e), n.complete();
		}));
	});
}
function Bt(e) {
	return e <= 0 ? function() {
		return V;
	} : L(function(t, n) {
		var r = 0;
		t.subscribe(R(n, function(t) {
			++r <= e && (n.next(t), e <= r && n.complete());
		}));
	});
}
function Vt(e, t) {
	return t === void 0 && (t = F), e ??= Ht, L(function(n, r) {
		var i, a = !0;
		n.subscribe(R(r, function(n) {
			var o = t(n);
			(a || !e(i, o)) && (a = !1, i = o, r.next(n));
		}));
	});
}
function Ht(e, t) {
	return e === t;
}
function Ut(e) {
	return e === void 0 && (e = Wt), L(function(t, n) {
		var r = !1;
		t.subscribe(R(n, function(e) {
			r = !0, n.next(e);
		}, function() {
			return r ? n.complete() : n.error(e());
		}));
	});
}
function Wt() {
	return new q();
}
function Gt(e) {
	return L(function(t, n) {
		try {
			t.subscribe(n);
		} finally {
			n.add(e);
		}
	});
}
function Kt(e, t) {
	var n = arguments.length >= 2;
	return function(r) {
		return r.pipe(e ? X(function(t, n) {
			return e(t, n, r);
		}) : F, Bt(1), n ? zt(t) : Ut(function() {
			return new q();
		}));
	};
}
function qt(e, t) {
	return L(function(n, r) {
		var i = null, a = 0, o = !1, s = function() {
			return o && !i && r.complete();
		};
		n.subscribe(R(r, function(n) {
			i?.unsubscribe();
			var o = 0, c = a++;
			W(e(n, c)).subscribe(i = R(r, function(e) {
				return r.next(t ? t(n, e, c, o++) : e);
			}, function() {
				i = null, s();
			}));
		}, function() {
			o = !0, s();
		}));
	});
}
function Jt() {
	return qt(F);
}
function Z(e) {
	return L(function(t, n) {
		W(e).subscribe(R(n, function() {
			return n.complete();
		}, k)), !n.closed && t.subscribe(n);
	});
}
function Yt(e, t) {
	return t === void 0 && (t = !1), L(function(n, r) {
		var i = 0;
		n.subscribe(R(r, function(n) {
			var a = e(n, i++);
			(a || t) && r.next(n), !a && r.complete();
		}));
	});
}
function Q(e, t, n) {
	var r = C(e) || t || n ? {
		next: e,
		error: t,
		complete: n
	} : e;
	return r ? L(function(e, t) {
		var n;
		(n = r.subscribe) == null || n.call(r);
		var i = !0;
		e.subscribe(R(t, function(e) {
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
	}) : F;
}
function Xt(e) {
	return Y((t, n) => K(e(t, n)).pipe(Y((e) => e ? ht(t) : V)));
}
function Zt(e) {
	return we(yt(e), Rt((e) => {
		if (e instanceof vt) return V;
		throw e;
	}));
}
function Qt(e, t) {
	let { not: n } = l(t, { not: !1 });
	return X((t) => $t(t.subId === e, n));
}
function $t(e, t) {
	return !e && t || e && !t;
}
var en = class {
	constructor(e) {
		n(this, "relay"), n(this, "config"), n(this, "authenticator"), n(this, "ongoings", /* @__PURE__ */ new Set()), n(this, "authResult$", new z()), n(this, "disposed", !1), this.relay = e.relay, this.config = e.config, this.authenticator = e.authenticator;
		let t = this.relay.getOKObservable().subscribe((e) => {
			let { eventId: n, ok: i } = e;
			this.ongoings.has(n) && (this.ongoings.delete(n), this.authResult$.next(i), i || (t.unsubscribe(), r.unsubscribe()));
		}), r = this.relay.getAUTHObservable().subscribe(({ challenge: e }) => {
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
}, tn = class extends Ne {
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
}, nn = class extends z {
	waitNext() {
		return gt(this.pipe(Kt(null, void 0)));
	}
}, rn = class {
	constructor(e) {
		n(this, "relay"), n(this, "authProxy"), n(this, "pubs", /* @__PURE__ */ new Map()), n(this, "authRequiredPubs", /* @__PURE__ */ new Set()), n(this, "count$", new tn(0)), n(this, "ok$", new z()), n(this, "disposed", !1);
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
}, an = {
	CONNECTING: 0,
	OPEN: 1,
	CLOSING: 2,
	CLOSED: 3
}, on = class {
	constructor(e, t) {
		n(this, "socket", null), n(this, "buffer", []), n(this, "unsent", []), n(this, "reconnected$", new z()), n(this, "outgoing$", new z()), n(this, "message$", new z()), n(this, "error$", new z()), n(this, "retryTimer", null), n(this, "sendAttempted$", new nn()), n(this, "isFirstTry", !0), n(this, "maybeDown", !1), n(this, "disposed", !1), n(this, "state$", new z()), n(this, "_state", "initialized"), this.url = e, this.config = t, t.skipFetchNip11 || _.getOrFetch(e), this.setState("initialized");
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
		let n = !1, r = e > 0, o = !r && (this.state === "error" || this.state === "rejected");
		r ? this.setState("retrying") : this.setState("connecting");
		let s = async () => {
			if (this.state === "terminated") d?.close($.RX_NOSTR_DISPOSED);
			else {
				this.setState("connected"), n = !0, e = 0, (r || o) && (this.reconnected$.next(this.unsent), this.unsent = []);
				try {
					for (let e of this.buffer) this.send(e);
				} catch (e) {
					this.error$.next(e);
				} finally {
					this.buffer = [];
				}
			}
		}, c = ({ data: e }) => {
			if (this.state !== "terminated") try {
				this.message$.next(this.pack(JSON.parse(e)));
			} catch (e) {
				this.error$.next(e);
			}
		}, l = ({ code: r }) => {
			var a;
			if (d?.removeEventListener("open", s), d?.removeEventListener("message", c), d?.removeEventListener("close", l), this.socket === d && (this.socket = null), this.state === "terminated" || r === $.RX_NOSTR_DISPOSED) this.unsent = [], this.buffer = [];
			else if (r === $.RX_NOSTR_IDLE) this.setState("dormant"), this.buffer.length > 0 && this.connect();
			else if (r === $.DONT_RETRY) this.unsent = [], this.buffer = [], this.error$.next(new i(r)), this.setState("rejected");
			else {
				t && !n && (this.maybeDown = !0), this.unsent.push(...this.buffer), this.buffer = [], this.error$.next(new i(r));
				let o = e + 1;
				this.config.retry.strategy !== "off" && !(this.config.retry.polite && this.maybeDown) && o <= this.config.retry.maxCount ? (this.setState("waiting-for-retrying"), (a = this.retryTimer) == null || a.unsubscribe(), this.retryTimer = sn(this.config.retry, o).subscribe(() => {
					this.disposed || this.connect(o);
				})) : this.setState("error");
			}
		}, u = this.config.websocketCtor ?? globalThis.WebSocket;
		if (!u) throw new a("WebSocket constructor is missing");
		let d = (() => {
			try {
				return new u(this.url);
			} catch (e) {
				return l({
					type: "close",
					code: 0,
					reason: `${e}`
				}), null;
			}
		})();
		return d?.addEventListener("open", s), d?.addEventListener("message", c), d?.addEventListener("close", l), d?.addEventListener("error", () => {}), d;
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
		this.socket?.readyState === an.OPEN && this.socket.close(e);
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
				if (!this.socket) throw new s();
				return this.socket.readyState === an.OPEN ? (this.outgoing$.next({
					to: this.url,
					message: e
				}), this.socket.send(JSON.stringify(e)), this.sendAttempted$.next(), t) : (this.buffer.push(e), t);
			case "waiting-for-retrying":
			case "retrying":
			case "error": return this.sendAttempted$.next(), this.unsent.push(e), t;
		}
	}
	getEVENTObservable() {
		return this.message$.pipe(X((e) => e.type === "EVENT"));
	}
	getEOSEObservable() {
		return this.message$.pipe(X((e) => e.type === "EOSE"));
	}
	getCLOSEDObservable() {
		return this.message$.pipe(X((e) => e.type === "CLOSED"));
	}
	getOKObservable() {
		return this.message$.pipe(X((e) => e.type === "OK"));
	}
	getAUTHObservable() {
		return this.message$.pipe(X((e) => e.type === "AUTH"));
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
		return this.state$.pipe(Vt(), J((e) => ({
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
		this.disposed = !0, this.setState("terminated"), (e = this.retryTimer) == null || e.unsubscribe(), (t = this.socket) == null || t.close($.RX_NOSTR_DISPOSED), this.socket = null;
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
function sn(e, t) {
	switch (e.strategy) {
		case "exponential": return It(Math.max(e.initialDelay * 2 ** (t - 1) + (Math.random() - .5) * 1e3, 1e3));
		case "immediately": return ht(0);
		case "linear": return It(e.interval);
		case "off": return V;
	}
}
var $ = {
	ABNORMAL_CLOSURE: 1006,
	DONT_RETRY: 4e3,
	RX_NOSTR_IDLE: 4537,
	RX_NOSTR_DISPOSED: 4538
}, cn = class {
	constructor(e) {
		n(this, "relay"), n(this, "authProxy"), n(this, "config"), n(this, "subs", /* @__PURE__ */ new Map()), n(this, "authRequiredSubs", /* @__PURE__ */ new Set()), n(this, "fin$", new z()), n(this, "disposed", !1), n(this, "queue");
		var t;
		this.relay = e.relay, this.authProxy = e.authProxy, this.config = e.config, this.queue = new ln(this.relay.url, this.config), this.queue.getActivationObservable().subscribe((e) => {
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
		return this.relay.getEVENTObservable().pipe(X(({ subId: e, event: t }) => {
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
}, ln = class {
	constructor(e, t) {
		n(this, "_queuings", []), n(this, "_ongoings", []), n(this, "activated$", new z()), n(this, "count$", new tn()), this.url = e, this.config = t;
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
		return await _.getValue(this.url, (e) => e.limitation?.max_subscriptions, { skipFetch: this.config.skipFetchNip11 }) ?? Infinity;
	}
}, un = class {
	constructor(e, t) {
		n(this, "relay"), n(this, "pubProxy"), n(this, "subProxy"), n(this, "defaultSubscriptionIds", /* @__PURE__ */ new Set()), n(this, "communicating", !1), n(this, "strategy", "lazy"), n(this, "disconnectTimeout"), n(this, "disconnectTimer"), n(this, "isDefaultRelay", !1), n(this, "disposed", !1), n(this, "_url"), this._url = h(e);
		let r = dn(e, t), i = new on(this.url, t), a = r ? new en({
			relay: i,
			config: t,
			authenticator: r
		}) : null, o = new rn({
			relay: i,
			authProxy: a
		}), s = new cn({
			relay: i,
			authProxy: a,
			config: t
		});
		this.relay = i, this.pubProxy = o, this.subProxy = s, this.disconnectTimeout = t.disconnectTimeout, jt([this.pubProxy.getLogicalConnectionSizeObservable(), this.subProxy.getLogicalConnectionSizeObservable()]).pipe(J(([e, t]) => e + t)).subscribe((e) => {
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
					this.communicating || this.relay.disconnect($.RX_NOSTR_IDLE);
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
		let { mode: n, overwrite: r, autoclose: i } = l(t ?? {}, {
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
		if (this.disposed) throw new c();
		return this.subProxy.getEventObservable();
	}
	getFinObservable() {
		if (this.disposed) throw new c();
		return this.subProxy.getFinObservable();
	}
	getOkAgainstEventObservable() {
		if (this.disposed) throw new c();
		return this.pubProxy.getOkAgainstEventObservable();
	}
	getAllMessageObservable() {
		if (this.disposed) throw new c();
		return this.relay.getAllMessageObservable();
	}
	getOutgoingMessageObservable() {
		if (this.disposed) throw new c();
		return this.relay.getOutgoingMessageObservable();
	}
	getConnectionStateObservable() {
		if (this.disposed) throw new c();
		return this.relay.getConnectionStateObservable();
	}
	get connectionState() {
		return this.relay.state;
	}
	getErrorObservable() {
		if (this.disposed) throw new c();
		return this.relay.getErrorObservable().pipe(J((e) => ({
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
function dn(e, t) {
	let n = t.authenticator;
	if (!n) return;
	let r = n instanceof Function ? n(e) : n;
	return r === "auto" ? {} : r;
}
function fn(e, t) {
	return e.filter((e) => !t.includes(e));
}
function pn(e) {
	let { rxReq: t, index: n } = e, { rxReqId: r, strategy: i } = t;
	return `${r}:${i === "backward" ? n : 0}`;
}
function mn(e) {
	let { rxReq: t, filters: n, index: r } = e;
	return [
		"REQ",
		pn({
			rxReq: t,
			index: r
		}),
		...n
	];
}
function hn(e) {
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
function gn(e, t) {
	let n = /* @__PURE__ */ new Set();
	if (t?.on) {
		let r = t.on;
		if (!r.defaultReadRelays && !r.defaultWriteRelays && !r.relays) return;
		let i = e.getDefaultRelays();
		if (r.defaultReadRelays) for (let { url: e } of Object.values(i).filter((e) => e.read)) n.add(e);
		if (r.defaultWriteRelays) for (let { url: e } of Object.values(i).filter((e) => e.write)) n.add(e);
		if (r.relays) for (let e of r.relays) n.add(h(e));
		return [...n];
	}
	if (t?.relays) {
		for (let e of t.relays) n.add(h(e));
		return [...n];
	}
}
function _n(e = {}) {
	return new vn(ee(e));
}
var vn = class {
	constructor(e) {
		n(this, "connections", new g()), n(this, "defaultRelays", new g()), n(this, "defaultSubscriptions", /* @__PURE__ */ new Map()), n(this, "event$", new z()), n(this, "fin$", new z()), n(this, "ok$", new z()), n(this, "all$", new z()), n(this, "error$", new z()), n(this, "connectionState$", new z()), n(this, "outgoing$", new z()), n(this, "dispose$", new z()), n(this, "disposed", !1), this.config = e;
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
		if (this.disposed) throw new c();
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
		if (this.disposed) throw new c();
		let t = new g(hn(e)), n = [];
		for (let { read: e, url: r } of t.values()) {
			let t = this.ensureNostrConnection(r);
			t.setConnectionStrategy(this.config.connectionStrategy), e && n.push(t);
		}
		this.updateDefaultSubscriptions(n), this.defaultRelays = t;
	}
	ensureNostrConnection(e) {
		let t = this.connections.get(e);
		return t || (t = new un(e, this.config), this.attachNostrConnection(t), this.connections.set(e, t), t);
	}
	attachNostrConnection(e) {
		e.getEventObservable().subscribe(this.event$), e.getFinObservable().subscribe(this.fin$), e.getOkAgainstEventObservable().subscribe(this.ok$), e.getAllMessageObservable().subscribe(this.all$), e.getConnectionStateObservable().subscribe(this.connectionState$), e.getErrorObservable().subscribe(this.error$), e.getOutgoingMessageObservable().subscribe(this.outgoing$);
	}
	updateDefaultSubscriptions(e) {
		let t = fn(this.defaultReadableConnections, e);
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
		let t = hn(e);
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
		if (!t) throw new a(`The relay (${e}) is not a default relay. \`reconnect()\` can be used only for a readable default relay.`);
		if (!t.read) throw new a(`The relay (${e}) is not readable. \`reconnect()\` can be used only for a readable default relay.`);
		let n = this.connections.get(e);
		if (!n) throw new s();
		(n.connectionState === "error" || n.connectionState === "rejected") && n.connectManually();
	}
	use(e, t) {
		let n = gn(this, t), r = ({ filters: t, relays: r }, i) => {
			let a = e.strategy === "backward" ? r : void 0, o = mn({
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
		}, o = ({ req: t, targetConnections: n }) => e.strategy === "forward" ? this.createForwardEventObservable({ req: t }).pipe(Z(this.dispose$)) : this.createBackwardEventObservable({
			req: t,
			targetConnections: n
		}).pipe(Z(this.dispose$)), s = e.getReqPacketObservable().pipe(X(({ filters: e }) => e.length > 0), J(r), Z(this.dispose$)), c = () => Xt(async ({ event: e }) => (this.config.skipVerify || await this.config.verifier(e)) && (this.config.skipExpirationCheck || !ce(e)));
		if (e.strategy === "forward") {
			let e;
			return s.pipe(Q((t) => {
				e = t;
			}), Q(i), J(o), Gt(() => {
				e && a(e);
			}), Jt(), c());
		}
		return s.pipe(Q(i), J((e) => o(e).pipe(Gt(() => {
			a(e);
		}))), Ft(), c());
	}
	createForwardEventObservable(e) {
		let { req: t } = e, n = t[1];
		return this.event$.pipe(Qt(n));
	}
	createBackwardEventObservable(e) {
		let { req: t, targetConnections: n } = e, r = t[1], i = /* @__PURE__ */ new Set(), a = (e) => e === "error" || e === "rejected" || e === "terminated", o = () => n.every(({ connectionState: e, url: t }) => a(e) || i.has(t)), s = Lt(this.fin$.pipe(Qt(r), Q(({ from: e }) => {
			i.add(e);
		})), this.connectionState$.asObservable()).pipe(X(() => o()), Kt(null, void 0));
		return this.event$.pipe(Z(s), Zt(this.config.eoseTimeout), Qt(r), X((e) => !i.has(e.from)));
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
		let { signer: n, errorOnTimeout: r, completeOn: i } = l(t ?? {}, {
			signer: this.config.signer,
			errorOnTimeout: !1,
			completeOn: "all-ok"
		}), o = gn(this, t), s = o === void 0 ? this.defaultWritableConnections : o.map((e) => this.ensureNostrConnection(e)), c = new Set(s.map((e) => e.url)), u = new z(), d = /* @__PURE__ */ new Set(), f = "", p = () => {
			u.closed || u.complete();
			for (let e of s) e.confirmOK(f);
		};
		n.signEvent(e).then(async (e) => {
			u.closed || (f = e.id, this.ok$.pipe(X(({ eventId: t, from: n }) => t === e.id && c.has(n))).subscribe(u), await Promise.all(s.map((t) => t.publish(e))), i === "sent" && u.complete());
		}).catch((e) => {
			throw p(), new a(e instanceof Error ? e.message : "Failed to sign the given event");
		});
		let m = (() => {
			switch (i) {
				case "sent": return F;
				case "all-ok": return Yt(({ from: e, done: t }) => (t && d.add(e), d.size < s.length), !0);
				case "any-ok": return Kt((e) => e.ok);
			}
		})();
		return u.pipe(m, Z(this.dispose$), r ? yt(this.config.okTimeout) : Zt(this.config.okTimeout), Gt(p));
	}
	async cast(e, t) {
		await gt(this.send(e, {
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
}, yn = (e) => {
	let { strategy: t } = e, n = e.operators ?? [], r = e.rxReqId ?? Sn(), i = e.subject ?? new z();
	return {
		strategy: t,
		rxReqId: r,
		getReqPacketObservable() {
			return i.pipe(...n);
		},
		pipe(...e) {
			return yn({
				strategy: t,
				rxReqId: r,
				operators: [...n, ...e],
				subject: i
			});
		},
		emit(e, t) {
			i.next({
				filters: wn(e),
				...t ?? {}
			});
		},
		over() {
			i.complete();
		}
	};
};
function bn(e) {
	return yn({
		strategy: "backward",
		rxReqId: e
	});
}
function xn(e) {
	return yn({
		strategy: "forward",
		rxReqId: e
	});
}
function Sn() {
	return `${Math.floor(Math.random() * 1e6)}`;
}
function Cn(e) {
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
function wn(e) {
	return (Array.isArray(e) ? e : [e]).map((e) => Cn(e)).filter((e) => e !== null);
}
export { p as i, xn as n, _n as r, bn as t };
