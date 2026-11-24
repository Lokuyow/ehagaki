import { t as e } from "./typeGuards-ClT_Na6K.js";
import { c as t, p as n, s as r, t as i } from "./esm-N9TTQGcl.js";
import { m as a } from "./nip46Service-ChjpWe9u.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/embedProtocol.ts
var o = "ehagaki.embed";
function s(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.namespace === "ehagaki.embed" && t.version === 1 && typeof t.type == "string";
}
var c = /* @__PURE__ */ new Set([
	"auth.request",
	"auth.error",
	"auth.result",
	"settings.set",
	"settings.applied",
	"settings.error",
	"relays.request",
	"relays.set",
	"relays.applied",
	"relays.error",
	"storage.get",
	"storage.set",
	"storage.remove",
	"storage.result",
	"storage.error",
	"idb.getSnapshot",
	"idb.setSnapshot",
	"idb.result",
	"idb.error",
	"composer.setContext",
	"composer.contextApplied",
	"composer.contextError",
	"rpc.request",
	"rpc.result",
	"rpc.error"
]);
function l(e) {
	return c.has(e);
}
function u(e) {
	return typeof e == "string" && e.trim().length > 0;
}
function d(e) {
	if (!e) return null;
	let t = new URLSearchParams(e).get("parentOrigin");
	if (!t) return null;
	try {
		return new URL(t).origin;
	} catch {
		return null;
	}
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/embedMessageTrustGate.ts
function f(e, t, n) {
	return !t || !s(e.data) || e.source !== t.parent || n && e.origin !== n ? null : e.data;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/parentClientAuthService.ts
var p = 1e4, m = /* @__PURE__ */ new Set([
	"signEvent",
	"nip44.encrypt",
	"nip44.decrypt"
]), h = ["signEvent"];
function g(e) {
	return m.has(e);
}
function _(e) {
	let t = e?.length ? e : h;
	return [...new Set(t)].filter(g);
}
function v(e) {
	return Array.isArray(e) && e.every((e) => typeof e == "string");
}
function y(e) {
	return Array.isArray(e) && e.every((e) => typeof e == "string" && m.has(e));
}
function b(e) {
	if (typeof e != "string" || !e) return !1;
	try {
		return new URL(e).origin === e;
	} catch {
		return !1;
	}
}
function x(t) {
	if (!e(t)) return null;
	let r = v(t.capabilities) ? _(t.capabilities) : [];
	return t.version !== 1 || !n(t.pubkeyHex) || !b(t.parentOrigin) || typeof t.connectedAt != "number" || r.length === 0 || !r.includes("signEvent") ? null : {
		version: 1,
		pubkeyHex: t.pubkeyHex,
		parentOrigin: t.parentOrigin,
		capabilities: r,
		connectedAt: t.connectedAt
	};
}
function S(t) {
	if (t !== void 0 && e(t)) return t.pubkeyHex == null ? null : n(t.pubkeyHex) ? t.pubkeyHex : void 0;
}
function C(t, r) {
	if (!e(t) || !n(t.pubkeyHex)) return null;
	let i = t.capabilities;
	if (i !== void 0 && !y(i)) return null;
	let a = _(i);
	return r?.length && a.some((e) => !r.includes(e)) ? null : {
		pubkeyHex: t.pubkeyHex,
		...t.capabilities === void 0 ? {} : { capabilities: a }
	};
}
function w(t, n) {
	if (!e(n) || !("result" in n)) return;
	let r = n.result;
	if (t === "signEvent") return e(r) && typeof r.id == "string" && typeof r.sig == "string" ? r : void 0;
	if (t === "nip44.encrypt" || t === "nip44.decrypt") return typeof r == "string" ? r : void 0;
}
function T(e) {
	return s(e);
}
var E = class {
	service;
	constructor(e) {
		this.service = e;
	}
	async signEvent(e) {
		return this.service.signEvent({
			kind: e.kind,
			content: e.content,
			tags: e.tags ?? [],
			created_at: e.created_at ?? Math.floor(Date.now() / 1e3),
			...e.pubkey ? { pubkey: e.pubkey } : {}
		});
	}
	async getPublicKey() {
		return this.service.getPublicKey();
	}
}, D = class {
	windowObj;
	console;
	trustedParentOrigin = null;
	activeSession = null;
	signerAdapter = null;
	pendingRequests = /* @__PURE__ */ new Map();
	remoteLoginListeners = /* @__PURE__ */ new Set();
	remoteLogoutListeners = /* @__PURE__ */ new Set();
	isListening = !1;
	constructor(e = typeof window < "u" ? window : {}, t = typeof window < "u" ? window.console : {}) {
		this.windowObj = e, this.console = t;
	}
	static loadSession(e, t) {
		try {
			let n = e.getItem(a(t));
			return n ? x(JSON.parse(n)) : null;
		} catch {
			return null;
		}
	}
	static saveSession(e, t) {
		e.setItem(a(t.pubkeyHex), JSON.stringify(t));
	}
	static clearSession(e, t) {
		e.removeItem(a(t));
	}
	initialize(e = {}) {
		if (!this.isInIframe()) return !1;
		let t = e.parentOrigin ?? this.resolveParentOrigin(e.locationSearch);
		return t ? (this.trustedParentOrigin = t, this.ensureMessageListener(), !0) : !1;
	}
	isAvailable(e = {}) {
		return this.isInIframe() ? !!(e.parentOrigin ?? this.resolveParentOrigin(e.locationSearch)) : !1;
	}
	announceReady(e = h) {
		return this.initialize() ? this.postEnvelope("ready", { capabilities: _(e) }) : !1;
	}
	async connect(e = {}) {
		let t = _(e.capabilities), n = e.parentOrigin ?? this.resolveParentOrigin(e.locationSearch);
		if (!this.initialize({
			parentOrigin: n ?? void 0,
			locationSearch: e.locationSearch
		})) throw Error("parent_client_not_available");
		this.announceReady(t);
		let r = await this.requestAuth({
			capabilities: t,
			silent: e.silent
		}, e.timeoutMs), i = {
			version: 1,
			parentOrigin: this.trustedParentOrigin,
			pubkeyHex: r.pubkeyHex,
			capabilities: _(r.capabilities ?? t),
			connectedAt: Date.now()
		};
		return this.activateSession(i), r.pubkeyHex;
	}
	async reconnect(e, t = {}) {
		return this.connect({
			...t,
			parentOrigin: e.parentOrigin,
			capabilities: e.capabilities,
			silent: !0
		});
	}
	async getPublicKey() {
		if (!this.activeSession?.pubkeyHex) throw Error("parent_client_not_authenticated");
		return this.activeSession.pubkeyHex;
	}
	async signEvent(e) {
		return this.assertCapability("signEvent"), this.requestRpc("signEvent", { event: e });
	}
	async nip44Encrypt(e, t) {
		return this.assertCapability("nip44.encrypt"), this.requestRpc("nip44.encrypt", {
			pubkey: e,
			plaintext: t
		});
	}
	async nip44Decrypt(e, t) {
		return this.assertCapability("nip44.decrypt"), this.requestRpc("nip44.decrypt", {
			pubkey: e,
			ciphertext: t
		});
	}
	getSigner() {
		return this.signerAdapter;
	}
	getSessionData() {
		return this.activeSession ? { ...this.activeSession } : null;
	}
	getUserPubkey() {
		return this.activeSession?.pubkeyHex ?? null;
	}
	getTrustedParentOrigin() {
		return this.trustedParentOrigin;
	}
	isConnected() {
		return this.activeSession !== null;
	}
	onRemoteLogin(e) {
		return this.remoteLoginListeners.add(e), () => {
			this.remoteLoginListeners.delete(e);
		};
	}
	onRemoteLogout(e) {
		return this.remoteLogoutListeners.add(e), () => {
			this.remoteLogoutListeners.delete(e);
		};
	}
	disconnect(e = !1) {
		e && this.activeSession && this.postEnvelope("auth.logout", { pubkeyHex: this.activeSession.pubkeyHex }), this.activeSession = null, this.signerAdapter = null, this.rejectPendingRequests("parent_client_disconnected");
	}
	activateSession(e) {
		this.activeSession = e, this.trustedParentOrigin = e.parentOrigin, this.signerAdapter = new E(this);
	}
	requestAuth(e, t = p) {
		return this.enqueueRequest("auth.request", e, t);
	}
	requestRpc(e, t, n = p) {
		return this.enqueueRequest("rpc.request", {
			method: e,
			params: t
		}, n);
	}
	enqueueRequest(e, t, n) {
		if (!this.trustedParentOrigin) return Promise.reject(/* @__PURE__ */ Error("parent_client_not_available"));
		let r = this.createRequestId();
		return new Promise((i, a) => {
			let o = globalThis.setTimeout(() => {
				this.pendingRequests.delete(r), a(/* @__PURE__ */ Error("parent_client_timeout"));
			}, n);
			this.pendingRequests.set(r, {
				kind: e === "auth.request" ? "auth" : "rpc",
				...e === "auth.request" ? { requestedCapabilities: t.capabilities } : { rpcMethod: t.method },
				resolve: (e) => i(e),
				reject: a,
				timeoutId: o
			}), this.postEnvelope(e, t, r) || (globalThis.clearTimeout(o), this.pendingRequests.delete(r), a(/* @__PURE__ */ Error("parent_client_not_available")));
		});
	}
	handleMessage = (e) => {
		if (!this.windowObj || !T(e.data) || e.source !== this.windowObj.parent || this.trustedParentOrigin && e.origin !== this.trustedParentOrigin) return;
		let t = e.data, n = t.requestId;
		if (t.type === "auth.login") {
			let e = S(t.payload);
			if (e === void 0) return;
			this.notifyRemoteLogin(e);
			return;
		}
		if (t.type === "auth.logout") {
			let e = S(t.payload);
			if (t.payload !== void 0 && e === void 0) return;
			let n = e ?? this.activeSession?.pubkeyHex ?? null;
			this.disconnect(!1), this.notifyRemoteLogout(n);
			return;
		}
		if (l(t.type) && !u(n)) {
			this.console.warn("requestId がない親クライアント応答を無視:", t);
			return;
		}
		if (!n) return;
		let r = this.pendingRequests.get(n);
		if (!r) return;
		let i = t.type === "auth.result" || t.type === "auth.error" ? "auth" : t.type === "rpc.result" || t.type === "rpc.error" ? "rpc" : null;
		if (i && i !== r.kind) globalThis.clearTimeout(r.timeoutId), this.pendingRequests.delete(n), r.reject(/* @__PURE__ */ Error("parent_client_invalid_response"));
		else if (globalThis.clearTimeout(r.timeoutId), this.pendingRequests.delete(n), t.type === "auth.result") {
			let e = C(t.payload, r.requestedCapabilities);
			if (!e) {
				r.reject(/* @__PURE__ */ Error("parent_client_invalid_response"));
				return;
			}
			r.resolve(e);
		} else if (t.type === "auth.error") {
			let e = t.payload;
			r.reject(Error(typeof e?.code == "string" && e.code || typeof e?.message == "string" && e.message || "parent_client_auth_error"));
		} else if (t.type === "rpc.result") {
			let e = w(r.rpcMethod, t.payload);
			if (e === void 0) {
				r.reject(/* @__PURE__ */ Error("parent_client_invalid_response"));
				return;
			}
			r.resolve(e);
		} else if (t.type === "rpc.error") {
			let e = t.payload;
			r.reject(Error(typeof e?.message == "string" && e.message || typeof e?.code == "string" && e.code || "parent_client_rpc_error"));
		} else r.reject(/* @__PURE__ */ Error("parent_client_invalid_response"));
	};
	postEnvelope(e, t, n) {
		if (!this.windowObj?.parent || !this.trustedParentOrigin || !this.isInIframe()) return !1;
		let r = {
			namespace: o,
			version: 1,
			type: e,
			...n ? { requestId: n } : {},
			...t === void 0 ? {} : { payload: t }
		};
		try {
			return this.windowObj.parent.postMessage(r, this.trustedParentOrigin), !0;
		} catch (e) {
			return this.console.error("親クライアントへのpostMessage送信に失敗:", e), !1;
		}
	}
	ensureMessageListener() {
		this.isListening ||= (this.windowObj?.addEventListener?.("message", this.handleMessage), !0);
	}
	resolveParentOrigin(e) {
		return this.getParentOriginFromSearch(e);
	}
	getParentOriginFromSearch(e) {
		return d(e ?? this.windowObj?.location?.search);
	}
	createRequestId() {
		return typeof globalThis.crypto?.randomUUID == "function" ? globalThis.crypto.randomUUID() : `pc-${Date.now()}-${Math.random().toString(16).slice(2)}`;
	}
	rejectPendingRequests(e) {
		for (let t of this.pendingRequests.values()) globalThis.clearTimeout(t.timeoutId), t.reject(Error(e));
		this.pendingRequests.clear();
	}
	isInIframe() {
		if (!this.windowObj) return !1;
		try {
			return this.windowObj.self !== this.windowObj.top;
		} catch {
			return !0;
		}
	}
	assertCapability(e) {
		if (!this.activeSession) throw Error("parent_client_not_authenticated");
		if (!this.activeSession.capabilities.includes(e)) throw Error("parent_client_capability_not_available");
	}
	notifyRemoteLogout(e) {
		for (let t of this.remoteLogoutListeners) t(e);
	}
	notifyRemoteLogin(e) {
		for (let t of this.remoteLoginListeners) t(e);
	}
}, O = new D(), k = class extends Error {
	constructor() {
		super("Authentication required"), this.name = "Error";
	}
};
function A(e, t) {
	let n = e.value;
	if (!n.isAuthenticated || n.type === "npub" || n.pubkey !== t) throw new k();
}
function j(e) {
	let t = e.value.pubkey;
	if (!t) throw new k();
	return A(e, t), t;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/signedEventResultValidator.ts
function M(e) {
	if (!Array.isArray(e)) throw Error("Invalid signed event result");
	return e.map((e) => {
		if (!Array.isArray(e) || !e.every((e) => typeof e == "string")) throw Error("Invalid signed event result");
		return [...e];
	});
}
function N(e, t) {
	return e.length === t.length && e.every((e, n) => e.length === t[n]?.length && e.every((e, r) => e === t[n][r]));
}
function P(e) {
	if (!e || typeof e != "object") throw Error("Invalid signed event result");
	let t = e;
	if (typeof t.kind != "number" || typeof t.content != "string" || typeof t.created_at != "number") throw Error("Invalid signed event result");
	return {
		kind: t.kind,
		content: t.content,
		created_at: t.created_at,
		tags: M(t.tags)
	};
}
function F(e) {
	let t = P(e);
	return {
		...e,
		...t
	};
}
function I(e) {
	return {
		expectedTemplate: P(e),
		signerTemplate: F(e)
	};
}
function L(e, n, a) {
	if (!e || typeof e != "object" || !n || typeof n != "object" || typeof a != "string" || !a) throw Error("Invalid signed event result");
	let o = P(e), s = n, c = M(s.tags), l = {
		id: s.id,
		pubkey: s.pubkey,
		created_at: s.created_at,
		kind: s.kind,
		tags: c,
		content: s.content,
		sig: s.sig
	};
	try {
		if (!r(l) || l.id !== i(l) || !t(l) || l.pubkey !== a || l.kind !== o.kind || l.content !== o.content || l.created_at !== o.created_at || !N(c, o.tags)) throw Error("Invalid signed event result");
	} catch {
		throw Error("Invalid signed event result");
	}
	return l;
}
export { j as a, f as c, d, u as f, A as i, o as l, L as n, D as o, k as r, O as s, I as t, l as u };
