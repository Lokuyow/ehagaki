import { i as e } from "./rolldown-runtime-CwxnZyOB.js";
import { _t as t, ht as n, rt as r, yt as i } from "./index-client-DEFG3Gqk.js";
import { a } from "./appRuntimeEnvironment-Bzv9wJOh.js";
import { d as o, f as s, l as c, m as l, o as u, r as d, u as f } from "./esm-N9TTQGcl.js";
import { a as p, f as m, i as h, m as g, o as _, p as v, r as y, t as b, u as x } from "./base-CVnVyhoG.js";
import { n as S } from "./relayConfigUtils-56ujWwKF.js";
import { t as C } from "./ipaddr-DyB8nsdz.js";
import { a as w } from "./authStore.svelte-DkMZvUSe.js";
import { dt as T } from "./appUtils-B3-zUpkb.js";
import { S as ee, h as E, v as D } from "./clipboardUtils-CSGkJuUA.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/authStorageKeys.ts
function O(e) {
	return e ? T.NOSTR_SECRET_KEY_PREFIX + e : T.NOSTR_SECRET_KEY_LEGACY;
}
function k(e) {
	return e ? T.NOSTR_NIP46_SESSION_PREFIX + e : T.NOSTR_NIP46_SESSION_LEGACY;
}
function A(e) {
	return T.NOSTR_PARENT_CLIENT_SESSION_PREFIX + e;
}
function j() {
	return T.NOSTR_NIP46_CONNECT_RELAYS;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/keyManager.svelte.ts
var M = class {
	static isValidNsec(e) {
		return D(e);
	}
	static derivePublicKey(e) {
		return E(e);
	}
	static pubkeyToNpub(e) {
		try {
			return e ? ee(e) : "";
		} catch (e) {
			return console.error("pubkeyからnpubへの変換エラー:", e), "";
		}
	}
}, N = class {
	localStorage;
	console;
	secretKeyStore;
	constructor(e, t, n) {
		this.localStorage = e, this.console = t, this.secretKeyStore = n;
	}
	saveToStorage(e, t) {
		if (!e?.trim()) return {
			success: !1,
			error: {
				type: "validation",
				message: "Key cannot be empty"
			}
		};
		try {
			let n = e.trim();
			return this.localStorage.setItem(O(t), n), this.secretKeyStore.set(n), { success: !0 };
		} catch (e) {
			let t = {
				type: "storage",
				message: "鍵の保存に失敗しました",
				originalError: e
			};
			return this.console.error("鍵の保存に失敗:", e), {
				success: !1,
				error: t
			};
		}
	}
	loadFromStorage(e) {
		if (!e) {
			let e = this.secretKeyStore.value;
			if (e) return e;
		}
		try {
			let t = this.localStorage.getItem(O(e));
			return t && this.secretKeyStore.set(t), t;
		} catch (e) {
			return this.console.error("鍵の読み込みに失敗:", e), null;
		}
	}
	readStoredKey(e) {
		try {
			let t = this.localStorage.getItem(O(e));
			return t ? {
				status: "found",
				secretKey: t
			} : { status: "missing" };
		} catch {
			return { status: "error" };
		}
	}
	writeStoredKeyForMigration(e, t) {
		try {
			return this.localStorage.setItem(O(e), t), this.localStorage.getItem(O(e)) === t ? { status: "saved" } : { status: "error" };
		} catch {
			return { status: "error" };
		}
	}
	removeStoredKeyForMigration(e) {
		try {
			let t = O(e);
			return this.localStorage.removeItem(t), this.localStorage.getItem(t) === null ? { status: "removed" } : { status: "error" };
		} catch {
			return { status: "error" };
		}
	}
	setCurrentSecretKey(e) {
		this.secretKeyStore.set(e);
	}
	getFromStore() {
		return this.secretKeyStore.value;
	}
	hasStoredKey(e) {
		try {
			return !!this.localStorage.getItem(O(e));
		} catch (e) {
			return this.console.error("ストレージアクセスエラー:", e), !1;
		}
	}
	removeFromStorage(e) {
		try {
			this.localStorage.removeItem(O(e));
		} catch (e) {
			this.console.error("鍵の削除に失敗:", e);
		}
	}
}, te = class {
	window;
	constructor(e) {
		this.window = e;
	}
	isWindowNostrAvailable() {
		return this.window !== void 0 && "nostr" in this.window && typeof this.window.nostr == "object" && this.window.nostr !== null && typeof this.window.nostr.getPublicKey == "function";
	}
	async getPublicKeyFromWindowNostr() {
		if (!this.isWindowNostrAvailable() || !this.window?.nostr) return {
			success: !1,
			error: {
				type: "validation",
				message: "window.nostr is not available"
			}
		};
		try {
			return {
				success: !0,
				pubkey: await this.window.nostr.getPublicKey()
			};
		} catch (e) {
			let t = {
				type: "network",
				message: "window.nostrから公開鍵の取得に失敗しました",
				originalError: e
			};
			return console.error("window.nostrから公開鍵の取得に失敗:", e), {
				success: !1,
				error: t
			};
		}
	}
}, ne = class {
	deps;
	#e = i("");
	get _nsec() {
		return r(this.#e);
	}
	set _nsec(e) {
		t(this.#e, e, !0);
	}
	#t = i(n({
		hex: "",
		npub: "",
		nprofile: ""
	}));
	get _data() {
		return r(this.#t);
	}
	set _data(e) {
		t(this.#t, e, !0);
	}
	#n = i(!1);
	get _isValid() {
		return r(this.#n);
	}
	set _isValid(e) {
		t(this.#n, e, !0);
	}
	get nsec() {
		return this._nsec;
	}
	get data() {
		return this._data;
	}
	get isValid() {
		return this._isValid;
	}
	get hex() {
		return this._data.hex;
	}
	get npub() {
		return this._data.npub;
	}
	get nprofile() {
		return this._data.nprofile;
	}
	get currentIsValid() {
		return this._isValid;
	}
	get currentHex() {
		return this._data.hex;
	}
	constructor(e = {}) {
		this.deps = e;
	}
	setNsec(e) {
		let t = e?.trim() || "";
		this._nsec = t, this.updateFromNsec(t);
	}
	updateFromNsec(e) {
		if (!e || !M.isValidNsec(e)) this._resetState();
		else try {
			let t = M.derivePublicKey(e);
			t.hex ? (this._data = t, this._isValid = !0) : this._resetState();
		} catch (e) {
			console.error("Failed to derive public key from nsec:", e), this._resetState();
		}
	}
	_resetState() {
		this._data = {
			hex: "",
			npub: "",
			nprofile: ""
		}, this._isValid = !1;
	}
	clear() {
		this._nsec = "", this.deps.clearAuthStateFn && this.deps.clearAuthStateFn();
	}
}, re = class {
	storage;
	externalAuth;
	constructor(e = {}) {
		let t = e.localStorage || a(), n = e.console || (typeof window < "u" ? window.console : {}), r = e.secretKeyStore || {
			value: null,
			set: () => {}
		}, i = e.window || (typeof window < "u" ? window : void 0);
		this.storage = new N(t, n, r), this.externalAuth = new te(i);
	}
	isValidNsec(e) {
		return M.isValidNsec(e);
	}
	derivePublicKey(e) {
		return M.derivePublicKey(e);
	}
	pubkeyToNpub(e) {
		return M.pubkeyToNpub(e);
	}
	saveToStorage(e, t) {
		return this.storage.saveToStorage(e, t);
	}
	loadFromStorage(e) {
		return this.storage.loadFromStorage(e);
	}
	readStoredKey(e) {
		return this.storage.readStoredKey(e);
	}
	writeStoredKeyForMigration(e, t) {
		return this.storage.writeStoredKeyForMigration(e, t);
	}
	removeStoredKeyForMigration(e) {
		return this.storage.removeStoredKeyForMigration(e);
	}
	setCurrentSecretKey(e) {
		this.storage.setCurrentSecretKey(e);
	}
	getFromStore() {
		return this.storage.getFromStore();
	}
	hasStoredKey(e) {
		return this.storage.hasStoredKey(e);
	}
	removeFromStorage(e) {
		return this.storage.removeFromStorage(e);
	}
	isWindowNostrAvailable() {
		return this.externalAuth.isWindowNostrAvailable();
	}
	async getPublicKeyFromWindowNostr() {
		return await this.externalAuth.getPublicKeyFromWindowNostr();
	}
	getStorage() {
		return this.storage;
	}
	getExternalAuth() {
		return this.externalAuth;
	}
}, ie = new re({ secretKeyStore: w }), P = {
	nostrConnectRelayRequired: "At least one public wss relay is required for nostrconnect",
	nostrConnectTimeout: "Nostr Connect timed out before the remote signer connected",
	nostrConnectCancelled: "Nostr Connect connection was cancelled",
	handshakePoolUnavailable: "Nostr Connect handshake pool is unavailable",
	finalRelayListMissing: "Remote signer did not return final relay list",
	finalRelayListInvalid: "Remote signer returned an invalid final relay list",
	finalRelayNoUsable: "Remote signer did not return any usable connection relay",
	finalLocalRelayUnreachable: "Could not connect to the local relay specified by the remote signer",
	finalRelayVerificationFailed: "Communication could not be verified on the relay selected by the remote signer"
}, F = "Relay connection failed";
function I(e) {
	return `${F}: ${e}`;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/nostr-tools/lib/esm/nip46.js
var L = /* @__PURE__ */ e(C(), 1), ae = new TextDecoder("utf-8"), R = new TextEncoder();
function z(e) {
	try {
		e.indexOf("://") === -1 && (e = "wss://" + e);
		let t = new URL(e);
		return t.protocol === "http:" ? t.protocol = "ws:" : t.protocol === "https:" && (t.protocol = "wss:"), t.pathname = t.pathname.replace(/\/+/g, "/"), t.pathname.endsWith("/") && (t.pathname = t.pathname.slice(0, -1)), (t.port === "80" && t.protocol === "ws:" || t.port === "443" && t.protocol === "wss:") && (t.port = ""), t.searchParams.sort(), t.hash = "", t.toString();
	} catch {
		throw Error(`Invalid URL: ${e}`);
	}
}
function oe(e) {
	if (e.length !== 64) return !1;
	for (let t = 0; t < 64; t++) {
		let n = e.charCodeAt(t);
		if (isNaN(n) || n < 48 || n > 102 || n > 57 && n < 97) return !1;
	}
	return !0;
}
var B = Symbol("verified"), se = (e) => e instanceof Object;
function ce(e) {
	if (!se(e) || typeof e.kind != "number" || typeof e.content != "string" || typeof e.created_at != "number" || typeof e.pubkey != "string" || !oe(e.pubkey) || !Array.isArray(e.tags)) return !1;
	for (let t = 0; t < e.tags.length; t++) {
		let n = e.tags[t];
		if (!Array.isArray(n)) return !1;
		for (let e = 0; e < n.length; e++) if (typeof n[e] != "string") return !1;
	}
	return !0;
}
var le = class {
	generateSecretKey() {
		return y.utils.randomSecretKey();
	}
	getPublicKey(e) {
		return x(y.getPublicKey(e));
	}
	finalizeEvent(e, t) {
		let n = e;
		return n.pubkey = x(y.getPublicKey(t)), n.id = de(n), n.sig = x(y.sign(v(de(n)), t)), n[B] = !0, n;
	}
	verifyEvent(e) {
		if (typeof e[B] == "boolean") return e[B];
		try {
			let t = de(e);
			if (t !== e.id) return e[B] = !1, !1;
			let n = y.verify(v(e.sig), v(t), v(e.pubkey));
			return e[B] = n, n;
		} catch {
			return e[B] = !1, !1;
		}
	}
};
function ue(e) {
	if (!ce(e)) throw Error("can't serialize event with wrong or missing properties");
	return JSON.stringify([
		0,
		e.pubkey,
		e.created_at,
		e.kind,
		e.tags,
		e.content
	]);
}
function de(e) {
	let t = _(R.encode(ue(e)));
	return x(t);
}
var V = new le();
V.generateSecretKey;
var fe = V.getPublicKey, pe = V.finalizeEvent, me = V.verifyEvent, he = 1, ge = 4294967295, _e = 65536;
function ve(e, t) {
	let n = h.getSharedSecret(e, v("02" + t)).subarray(1, 33);
	return f(_, n, R.encode("nip44-v2"));
}
function ye(e, t) {
	let n = c(_, e, t, 76);
	return {
		chacha_key: n.subarray(0, 32),
		chacha_nonce: n.subarray(32, 44),
		hmac_key: n.subarray(44, 76)
	};
}
function be(e) {
	if (!Number.isSafeInteger(e) || e < 1) throw Error("expected positive integer");
	if (e <= 32) return 32;
	let t = 2 ** (Math.floor(Math.log2(e - 1)) + 1), n = t <= 256 ? 32 : t / 8;
	return n * (Math.floor((e - 1) / n) + 1);
}
function xe(e) {
	if (!Number.isSafeInteger(e) || e < he || e > 65535) throw Error("invalid plaintext size: must be between 1 and 65535 bytes");
	let t = /* @__PURE__ */ new Uint8Array(2);
	return new DataView(t.buffer).setUint16(0, e, !1), t;
}
function Se(e) {
	if (!Number.isSafeInteger(e) || e < _e || e > ge) throw Error("invalid plaintext size: must be between 65536 and 4294967295 bytes");
	let t = /* @__PURE__ */ new Uint8Array(4);
	return new DataView(t.buffer).setUint32(0, e, !1), t;
}
function Ce(e) {
	let t = R.encode(e), n = t.length;
	if (n < he || n > ge) throw Error("invalid plaintext size: must be between 1 and 4294967295 bytes");
	let r = n >= _e ? m(new Uint8Array([0, 0]), Se(n)) : xe(n), i = new Uint8Array(be(n) - n);
	return m(r, t, i);
}
function we(e) {
	let t = new DataView(e.buffer, e.byteOffset, e.byteLength), n = t.getUint16(0), r, i;
	if (n === 0) {
		if (r = t.getUint32(2), r < _e) throw Error("invalid padding");
		i = 6;
	} else r = n, i = 2;
	let a = e.subarray(i, i + r);
	if (r < he || r > ge || a.length !== r || e.length !== i + be(r)) throw Error("invalid padding");
	return ae.decode(a);
}
function Te(e, t, n) {
	if (n.length !== 32) throw Error("AAD associated data must be 32 bytes");
	let r = m(n, t);
	return p(_, e, r);
}
function Ee(e) {
	if (typeof e != "string") throw Error("payload must be a valid string");
	let t = e.length;
	if (t < 132) throw Error("invalid payload length: " + t);
	if (e[0] === "#") throw Error("unknown encryption version");
	let n;
	try {
		n = b.decode(e);
	} catch (e) {
		throw Error("invalid base64: " + e.message);
	}
	let r = n.length;
	if (r < 99) throw Error("invalid data length: " + r);
	let i = n[0];
	if (i !== 2) throw Error("unknown encryption version " + i);
	return {
		nonce: n.subarray(1, 33),
		ciphertext: n.subarray(33, -32),
		mac: n.subarray(-32)
	};
}
function De(e, t, n = g(32)) {
	let { chacha_key: r, chacha_nonce: i, hmac_key: a } = ye(t, n), s = Ce(e), c = o(r, i, s), l = Te(a, c, n);
	return b.encode(m(new Uint8Array([2]), n, c, l));
}
function Oe(e, t) {
	let { nonce: n, ciphertext: r, mac: i } = Ee(e), { chacha_key: a, chacha_nonce: c, hmac_key: l } = ye(t, n), u = Te(l, r, n);
	if (!s(u, i)) throw Error("invalid MAC");
	return we(o(a, c, r));
}
var ke = /^(?:([\w.+-]+)@)?([\w_-]+(\.[\w_-]+)+)$/, Ae = 22242, je = 24133;
function Me(e, t) {
	if (e.ids && e.ids.indexOf(t.id) === -1 || e.kinds && e.kinds.indexOf(t.kind) === -1 || e.authors && e.authors.indexOf(t.pubkey) === -1) return !1;
	for (let n in e) if (n[0] === "#") {
		let r = e[`#${n.slice(1)}`];
		if (r && !t.tags.find(([e, t]) => e === n.slice(1) && r.indexOf(t) !== -1)) return !1;
	}
	return !(e.since && t.created_at < e.since || e.until && t.created_at > e.until);
}
function Ne(e, t) {
	for (let n = 0; n < e.length; n++) if (Me(e[n], t)) return !0;
	return !1;
}
function Pe(e, t) {
	let n = t.length + 3, r = e.indexOf(`"${t}":`) + n, i = e.slice(r).indexOf("\"") + r + 1;
	return e.slice(i, i + 64);
}
function Fe(e) {
	let t = e.slice(0, 22).indexOf("\"EVENT\"");
	if (t === -1) return null;
	let n = e.slice(t + 7 + 1).indexOf("\"");
	if (n === -1) return null;
	let r = t + 7 + 1 + n, i = e.slice(r + 1, 80).indexOf("\"");
	if (i === -1) return null;
	let a = r + 1 + i;
	return e.slice(r + 1, a);
}
function Ie(e, t) {
	return {
		kind: Ae,
		created_at: Math.floor(Date.now() / 1e3),
		tags: [["relay", e], ["challenge", t]],
		content: ""
	};
}
var Le = class extends Error {
	constructor(e, t) {
		super(`Tried to send message '${e} on a closed connection to ${t}.`), this.name = "SendingOnClosedConnection";
	}
}, Re = class {
	url;
	_connected = !1;
	onclose = null;
	onnotice = (e) => console.debug(`NOTICE from ${this.url}: ${e}`);
	onauth;
	baseEoseTimeout = 4400;
	publishTimeout = 4400;
	pingFrequency = 29e3;
	pingTimeout = 2e4;
	resubscribeBackoff = [
		1e4,
		1e4,
		1e4,
		2e4,
		2e4,
		3e4,
		6e4
	];
	openSubs = /* @__PURE__ */ new Map();
	enablePing;
	enableReconnect;
	idleTimeout = 0;
	idleSince = Date.now();
	ongoingOperations = 0;
	reconnectTimeoutHandle;
	pingIntervalHandle;
	reconnectAttempts = 0;
	skipReconnection = !1;
	idleTimeoutHandle;
	connectionPromise;
	openCountRequests = /* @__PURE__ */ new Map();
	openEventPublishes = /* @__PURE__ */ new Map();
	ws;
	challenge;
	authPromise;
	serial = 0;
	verifyEvent;
	_WebSocket;
	constructor(e, t) {
		this.url = z(e), this.verifyEvent = t.verifyEvent, this._WebSocket = t.websocketImplementation || WebSocket, this.enablePing = t.enablePing, this.enableReconnect = t.enableReconnect || !1, t.idleTimeout && (this.idleTimeout = t.idleTimeout);
	}
	static async connect(e, t) {
		let n = new Re(e, t);
		return await n.connect(t), n;
	}
	closeAllSubscriptions(e) {
		for (let [t, n] of this.openSubs) n.close(e);
		this.openSubs.clear();
		for (let [t, n] of this.openEventPublishes) n.reject(Error(e));
		this.openEventPublishes.clear();
		for (let [t, n] of this.openCountRequests) n.reject(Error(e));
		this.openCountRequests.clear();
	}
	get connected() {
		return this._connected;
	}
	clearIdleTimeout() {
		this.idleTimeoutHandle &&= (clearTimeout(this.idleTimeoutHandle), void 0);
	}
	scheduleIdleClose() {
		this.clearIdleTimeout(), this.idleTimeout > 0 && (this.idleTimeoutHandle = setTimeout(() => {
			this.ongoingOperations === 0 && this.idleSince && this.close();
		}, this.idleTimeout));
	}
	async reconnect() {
		let e = this.resubscribeBackoff[Math.min(this.reconnectAttempts, this.resubscribeBackoff.length - 1)];
		this.reconnectAttempts++, this.reconnectTimeoutHandle = setTimeout(async () => {
			try {
				await this.connect();
			} catch {}
		}, e);
	}
	handleHardClose(e) {
		this.ws && (this.ws.onopen = null, this.ws.onerror = null, this.ws.onclose = null), this.pingIntervalHandle &&= (clearInterval(this.pingIntervalHandle), void 0), this._connected = !1, this.connectionPromise = void 0, this.idleSince = void 0, this.clearIdleTimeout(), this.enableReconnect && !this.skipReconnection ? this.reconnect() : (this.onclose?.(), this.closeAllSubscriptions(e));
	}
	async connect(e) {
		let t;
		return this.connectionPromise ||= (this.challenge = void 0, this.authPromise = void 0, this.skipReconnection = !1, new Promise((n, r) => {
			e?.timeout && (t = setTimeout(() => {
				r("connection timed out"), this.connectionPromise = void 0, this.reconnectAttempts === 0 && (this.skipReconnection = !0), this.ws?.close?.(), this.handleHardClose("relay connection timed out");
			}, e.timeout)), e?.abort && (e.abort.onabort = r);
			try {
				this.ws = new this._WebSocket(this.url);
			} catch (e) {
				clearTimeout(t), r(e);
				return;
			}
			this.ws.onopen = () => {
				this.reconnectTimeoutHandle &&= (clearTimeout(this.reconnectTimeoutHandle), void 0), clearTimeout(t), this._connected = !0;
				let e = this.reconnectAttempts > 0;
				this.reconnectAttempts = 0;
				for (let t of this.openSubs.values()) {
					if (t.eosed = !1, e) for (let e = 0; e < t.filters.length; e++) t.lastEmitted && (t.filters[e].since = t.lastEmitted + 1);
					t.fire();
				}
				this.enablePing && (this.pingIntervalHandle = setInterval(() => this.pingpong(), this.pingFrequency)), n();
			}, this.ws.onerror = () => {
				clearTimeout(t), r("connection failed"), this.connectionPromise = void 0, this.reconnectAttempts === 0 && (this.skipReconnection = !0), this.ws?.close?.(), this.handleHardClose("relay connection failed");
			}, this.ws.onclose = (e) => {
				clearTimeout(t), r(e.message || "websocket closed"), this.handleHardClose("relay connection closed");
			}, this.ws.onmessage = this._onmessage.bind(this);
		})), this.connectionPromise;
	}
	waitForPingPong() {
		return new Promise((e) => {
			this.ws.once("pong", () => e(!0)), this.ws.ping();
		});
	}
	waitForDummyReq() {
		return new Promise((e, t) => {
			if (!this.connectionPromise) return t(/* @__PURE__ */ Error(`no connection to ${this.url}, can't ping`));
			try {
				let t = this.subscribe([{
					ids: ["aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"],
					limit: 1
				}], {
					label: "<forced-ping>",
					oneose: () => {
						e(!0), t.close();
					},
					onclose() {
						e(!0);
					},
					eoseTimeout: this.pingTimeout + 1e3
				});
			} catch (e) {
				t(e);
			}
		});
	}
	async pingpong() {
		this.ws?.readyState === 1 && (await Promise.any([this.ws && this.ws.ping && this.ws.once ? this.waitForPingPong() : this.waitForDummyReq(), new Promise((e) => setTimeout(() => e(!1), this.pingTimeout))]) || this.ws?.readyState === this._WebSocket.OPEN && this.ws?.close());
	}
	async send(e) {
		if (!this.connectionPromise) throw new Le(e, this.url);
		this.connectionPromise.then(() => {
			this.ws?.send(e);
		});
	}
	async auth(e) {
		let t = this.challenge;
		if (!t) throw Error("can't perform auth, no challenge was received");
		return this.authPromise ||= new Promise(async (n, r) => {
			try {
				let i = await e(Ie(this.url, t)), a = setTimeout(() => {
					let e = this.openEventPublishes.get(i.id);
					e && (e.reject(/* @__PURE__ */ Error("auth timed out")), this.openEventPublishes.delete(i.id));
				}, this.publishTimeout);
				this.openEventPublishes.set(i.id, {
					resolve: n,
					reject: r,
					timeout: a
				}), this.send("[\"AUTH\"," + JSON.stringify(i) + "]");
			} catch (e) {
				console.warn("subscribe auth function failed:", e);
			}
		}), this.authPromise;
	}
	async publish(e) {
		this.idleSince = void 0, this.clearIdleTimeout(), this.ongoingOperations++;
		let t = new Promise((t, n) => {
			let r = setTimeout(() => {
				let t = this.openEventPublishes.get(e.id);
				t && (t.reject(/* @__PURE__ */ Error("publish timed out")), this.openEventPublishes.delete(e.id));
			}, this.publishTimeout);
			this.openEventPublishes.set(e.id, {
				resolve: t,
				reject: n,
				timeout: r
			});
		});
		try {
			await this.send("[\"EVENT\"," + JSON.stringify(e) + "]");
		} catch (t) {
			let n = this.openEventPublishes.get(e.id);
			n && (n.reject(t), this.openEventPublishes.delete(e.id));
		}
		return this.ongoingOperations--, this.ongoingOperations === 0 && (this.idleSince = Date.now(), this.scheduleIdleClose()), t;
	}
	async count(e, t) {
		return (await this.countWithHLL(e, t)).count;
	}
	async countWithHLL(e, t) {
		this.serial++;
		let n = t?.id || "count:" + this.serial, r = new Promise((e, t) => {
			this.openCountRequests.set(n, {
				resolve: e,
				reject: t
			});
		});
		try {
			await this.send("[\"COUNT\",\"" + n + "\"," + JSON.stringify(e).substring(1));
		} catch (e) {
			let t = this.openCountRequests.get(n);
			t && (t.reject(e), this.openCountRequests.delete(n));
		}
		return r;
	}
	subscribe(e, t) {
		t.label !== "<forced-ping>" && (this.idleSince = void 0, this.clearIdleTimeout(), this.ongoingOperations++);
		let n = this.prepareSubscription(e, t);
		return n.fire(), t.abort && (t.abort.onabort = () => n.close(String(t.abort.reason || "<aborted>"))), n;
	}
	prepareSubscription(e, t) {
		this.serial++;
		let n = t.id || (t.label ? t.label + ":" : "sub:") + this.serial, r = new ze(this, n, e, t);
		return this.openSubs.set(n, r), r;
	}
	close() {
		this.skipReconnection = !0, this.reconnectTimeoutHandle &&= (clearTimeout(this.reconnectTimeoutHandle), void 0), this.pingIntervalHandle &&= (clearInterval(this.pingIntervalHandle), void 0), this.closeAllSubscriptions("relay connection closed by us"), this._connected = !1, this.connectionPromise = void 0, this.idleSince = void 0, this.clearIdleTimeout(), this.onclose?.(), this.ws && (this.ws.onopen = null, this.ws.onerror = null, this.ws.onclose = null, this.ws.readyState !== this._WebSocket.CLOSING && this.ws.readyState !== this._WebSocket.CLOSED && this.ws.close());
	}
	_onmessage(e) {
		let t = e.data;
		if (!t) return;
		let n = Fe(t);
		if (n) {
			let e = this.openSubs.get(n);
			if (!e) return;
			let r = Pe(t, "id"), i = e.alreadyHaveEvent?.(r);
			if (e.receivedEvent?.(this, r), i) return;
		}
		try {
			let e = JSON.parse(t);
			switch (e[0]) {
				case "EVENT": {
					let t = this.openSubs.get(e[1]), n = e[2];
					Ne(t.filters, n) && this.verifyEvent(n, this.url) ? t.onevent(n) : t.oninvalidevent?.(n), (!t.lastEmitted || t.lastEmitted < n.created_at) && (t.lastEmitted = n.created_at);
					return;
				}
				case "COUNT": {
					let t = e[1], n = e[2], r = this.openCountRequests.get(t);
					r && (r.resolve(n), this.openCountRequests.delete(t));
					return;
				}
				case "EOSE": {
					let t = this.openSubs.get(e[1]);
					if (!t) return;
					t.receivedEose();
					return;
				}
				case "OK": {
					let t = e[1], n = e[2], r = e[3], i = this.openEventPublishes.get(t);
					i && (clearTimeout(i.timeout), n ? i.resolve(r) : i.reject(Error(r)), this.openEventPublishes.delete(t));
					return;
				}
				case "CLOSED": {
					let t = e[1], n = this.openSubs.get(t);
					if (!n) {
						let n = this.openCountRequests.get(t);
						n && (n.reject(Error(e[2])), this.openCountRequests.delete(t));
						return;
					}
					n.closed = !0, n.close(e[2]);
					return;
				}
				case "NOTICE":
					this.onnotice(e[1]);
					return;
				case "AUTH":
					this.challenge = e[1], this.onauth && this.auth(this.onauth).catch((e) => {
						if (!(e instanceof Le)) throw e;
					});
					return;
				default:
					this.openSubs.get(e[1])?.oncustom?.(e);
					return;
			}
		} catch (e) {
			try {
				let [n, r, i] = JSON.parse(t);
				console.warn(`[nostr] relay ${this.url} error processing message:`, e, i);
			} catch {
				console.warn(`[nostr] relay ${this.url} error processing message:`, e);
			}
			return;
		}
	}
}, ze = class {
	relay;
	id;
	lastEmitted;
	closed = !1;
	eosed = !1;
	filters;
	alreadyHaveEvent;
	receivedEvent;
	onevent;
	oninvalidevent;
	oneose;
	onclose;
	oncustom;
	eoseTimeout;
	eoseTimeoutHandle;
	constructor(e, t, n, r) {
		if (n.length === 0) throw Error("subscription can't be created with zero filters");
		this.relay = e, this.filters = n, this.id = t, this.alreadyHaveEvent = r.alreadyHaveEvent, this.receivedEvent = r.receivedEvent, this.eoseTimeout = r.eoseTimeout || e.baseEoseTimeout, this.oneose = r.oneose, this.onclose = r.onclose, this.oninvalidevent = r.oninvalidevent, this.onevent = r.onevent || ((e) => {
			console.warn(`onevent() callback not defined for subscription '${this.id}' in relay ${this.relay.url}. event received:`, e);
		});
	}
	fire() {
		this.relay.send("[\"REQ\",\"" + this.id + "\"," + JSON.stringify(this.filters).substring(1)), this.eoseTimeoutHandle = setTimeout(this.receivedEose.bind(this), this.eoseTimeout);
	}
	receivedEose() {
		this.eosed || (clearTimeout(this.eoseTimeoutHandle), this.eosed = !0, this.oneose?.());
	}
	close(e = "closed by caller") {
		if (!this.closed && this.relay.connected) {
			try {
				this.relay.send("[\"CLOSE\"," + JSON.stringify(this.id) + "]");
			} catch (e) {
				if (!(e instanceof Le)) throw e;
			}
			this.closed = !0;
		}
		this.relay.openSubs.delete(this.id), this.id.startsWith("<forced-ping>") || (this.relay.ongoingOperations--, this.relay.ongoingOperations === 0 && (this.relay.idleSince = Date.now(), this.relay.scheduleIdleClose())), this.onclose?.(e);
	}
}, H = 256, Be = H * 2;
new TextEncoder();
function Ve(e, t) {
	switch (t) {
		case "reactions": return {
			"#e": [e],
			kinds: [7]
		};
		case "reposts": return {
			"#e": [e],
			kinds: [6]
		};
		case "quotes": return {
			"#q": [e],
			kinds: [1, 1111]
		};
		case "replies": return {
			"#e": [e],
			kinds: [1]
		};
		case "comments": return {
			"#E": [e],
			kinds: [1111]
		};
		case "followers": return {
			"#p": [e],
			kinds: [3]
		};
	}
}
function He() {
	return new Uint8Array(H);
}
function Ue(e) {
	if (e.length !== Be || !/^[0-9a-f]+$/.test(e)) return;
	let t = new Uint8Array(H);
	for (let n = 0; n < H; n++) t[n] = parseInt(e.slice(n * 2, n * 2 + 2), 16);
	return t;
}
function We(e) {
	if (e.length !== H) throw Error(`invalid number of registers ${e.length}`);
	let t = "";
	for (let n = 0; n < H; n++) t += e[n].toString(16).padStart(2, "0");
	return t;
}
function Ge(e, t) {
	if (e.length === 0 && (e = He()), e.length !== H) throw Error(`invalid number of registers ${e.length}`);
	if (t.length !== H) throw Error(`invalid number of registers ${t.length}`);
	for (let n = 0; n < H; n++) t[n] > e[n] && (e[n] = t[n]);
	return e;
}
var Ke = class {
	relays = /* @__PURE__ */ new Map();
	seenOn = /* @__PURE__ */ new Map();
	trackRelays = !1;
	verifyEvent;
	enablePing;
	enableReconnect;
	idleTimeout = 2e4;
	automaticallyAuth;
	onRelayConnectionFailure;
	onRelayConnectionSuccess;
	allowConnectingToRelay;
	maxWaitForConnection;
	_WebSocket;
	constructor(e) {
		this.verifyEvent = e.verifyEvent, this._WebSocket = e.websocketImplementation, this.enablePing = e.enablePing, this.enableReconnect = e.enableReconnect || !1, e.idleTimeout && (this.idleTimeout = e.idleTimeout), this.automaticallyAuth = e.automaticallyAuth, this.onRelayConnectionFailure = e.onRelayConnectionFailure, this.onRelayConnectionSuccess = e.onRelayConnectionSuccess, this.allowConnectingToRelay = e.allowConnectingToRelay, this.maxWaitForConnection = e.maxWaitForConnection || 3e3;
	}
	async ensureRelay(e, t) {
		e = z(e);
		let n = this.relays.get(e);
		if (n || (n = new Re(e, {
			verifyEvent: this.verifyEvent,
			websocketImplementation: this._WebSocket,
			enablePing: this.enablePing,
			enableReconnect: this.enableReconnect,
			idleTimeout: this.idleTimeout
		}), n.onclose = () => {
			this.relays.delete(e);
		}, this.relays.set(e, n)), this.automaticallyAuth) {
			let t = this.automaticallyAuth(e);
			t && (n.onauth = t);
		}
		try {
			await n.connect({
				timeout: t?.connectionTimeout,
				abort: t?.abort
			});
		} catch (t) {
			throw this.relays.delete(e), t;
		}
		return n;
	}
	close(e) {
		e.map(z).forEach((e) => {
			this.relays.get(e)?.close(), this.relays.delete(e);
		});
	}
	subscribe(e, t, n) {
		let r = [], i = [];
		for (let n = 0; n < e.length; n++) {
			let a = z(e[n]);
			r.find((e) => e.url === a) || i.indexOf(a) === -1 && (i.push(a), r.push({
				url: a,
				filter: t
			}));
		}
		return this.subscribeMap(r, n);
	}
	subscribeMany(e, t, n) {
		return this.subscribe(e, t, n);
	}
	subscribeMap(e, t) {
		let n = /* @__PURE__ */ new Map();
		for (let t of e) {
			let { url: e, filter: r } = t;
			n.has(e) || n.set(e, []), n.get(e).push(r);
		}
		let r = Array.from(n.entries()).map(([e, t]) => ({
			url: e,
			filters: t
		}));
		this.trackRelays && (t.receivedEvent = (e, t) => {
			let n = this.seenOn.get(t);
			n || (n = /* @__PURE__ */ new Set(), this.seenOn.set(t, n)), n.add(e);
		});
		let i = /* @__PURE__ */ new Set(), a = [], o = [], s = (e) => {
			o[e] || (o[e] = !0, o.filter((e) => e).length === r.length && (t.oneose?.(), s = () => {}));
		}, c = [], l = (e, n, i) => {
			c[e] || (s(e), c[e] = {
				url: n,
				reason: i
			}, c.filter((e) => e).length === r.length && (t.onclose?.(c), l = () => {}));
		}, u = (e) => {
			if (t.alreadyHaveEvent?.(e)) return !0;
			let n = i.has(e);
			return i.add(e), n;
		}, d = Promise.all(r.map(async ({ url: e, filters: n }, r) => {
			if (this.allowConnectingToRelay?.(e, ["read", n]) === !1) {
				l(r, e, "connection skipped by allowConnectingToRelay");
				return;
			}
			let i;
			try {
				i = await this.ensureRelay(e, {
					connectionTimeout: this.maxWaitForConnection < (t.maxWait || 0) ? Math.max(t.maxWait * .8, t.maxWait - 1e3) : this.maxWaitForConnection,
					abort: t.abort
				});
			} catch (t) {
				this.onRelayConnectionFailure?.(e), l(r, e, t?.message || String(t));
				return;
			}
			this.onRelayConnectionSuccess?.(e);
			let o = i.subscribe(n, {
				...t,
				oneose: () => s(r),
				onclose: (a) => {
					a.startsWith("auth-required: ") && t.onauth ? i.auth(t.onauth).then(() => {
						i.subscribe(n, {
							...t,
							oneose: () => s(r),
							onclose: (t) => {
								l(r, e, t);
							},
							alreadyHaveEvent: u,
							eoseTimeout: t.maxWait,
							abort: t.abort
						});
					}).catch((t) => {
						l(r, e, `auth was required and attempted, but failed with: ${t}`);
					}) : l(r, e, a);
				},
				alreadyHaveEvent: u,
				eoseTimeout: t.maxWait,
				abort: t.abort
			});
			a.push(o);
		}));
		return { async close(e) {
			await d, a.forEach((t) => {
				t.close(e);
			});
		} };
	}
	subscribeEose(e, t, n) {
		let r;
		return r = this.subscribe(e, t, {
			...n,
			oneose() {
				let t = "closed automatically on eose";
				r ? r.close(t) : n.onclose?.(e.map((e) => ({
					url: e,
					reason: t
				})));
			}
		}), r;
	}
	subscribeManyEose(e, t, n) {
		return this.subscribeEose(e, t, n);
	}
	async querySync(e, t, n) {
		return new Promise(async (r) => {
			let i = [];
			this.subscribeEose(e, t, {
				...n,
				onevent(e) {
					i.push(e);
				},
				onclose(e) {
					r(i);
				}
			});
		});
	}
	async get(e, t, n) {
		t.limit = 1;
		let r = await this.querySync(e, t, n);
		return r.sort((e, t) => t.created_at - e.created_at), r[0] || null;
	}
	async countMany(e, t, n, r) {
		let i = Ve(t, n), a = [];
		for (let t = 0; t < e.length; t++) {
			let n = z(e[t]);
			a.indexOf(n) === -1 && a.push(n);
		}
		let o = await Promise.all(a.map(async (e) => {
			if (this.allowConnectingToRelay?.(e, ["read", [i]]) === !1) return null;
			let t;
			try {
				t = await this.ensureRelay(e, {
					connectionTimeout: this.maxWaitForConnection < (r?.maxWait || 0) ? Math.max(r.maxWait * .8, r.maxWait - 1e3) : this.maxWaitForConnection,
					abort: r?.abort
				});
			} catch {
				return this.onRelayConnectionFailure?.(e), null;
			}
			return this.onRelayConnectionSuccess?.(e), t.countWithHLL([i], { id: r?.id }).catch(() => null);
		})), s = 0, c;
		for (let e of o) {
			if (!e || (e.count > s && (s = e.count), !e.hll || e.hll.length !== 512)) continue;
			let t = Ue(e.hll);
			t && (c = Ge(c || /* @__PURE__ */ new Uint8Array(), t));
		}
		return c ? {
			count: s,
			hll: We(c)
		} : { count: s };
	}
	publish(e, t, n) {
		return e.map(z).map(async (e, r, i) => {
			if (i.indexOf(e) !== r) return Promise.reject("duplicate url");
			if (this.allowConnectingToRelay?.(e, ["write", t]) === !1) return Promise.reject("connection skipped by allowConnectingToRelay");
			let a;
			try {
				a = await this.ensureRelay(e, {
					connectionTimeout: this.maxWaitForConnection < (n?.maxWait || 0) ? Math.max(n.maxWait * .8, n.maxWait - 1e3) : this.maxWaitForConnection,
					abort: n?.abort
				});
			} catch (t) {
				return this.onRelayConnectionFailure?.(e), Promise.reject("connection failure: " + String(t));
			}
			return a.publish(t).catch(async (e) => {
				if (e instanceof Error && e.message.startsWith("auth-required: ") && n?.onauth) return await a.auth(n.onauth), a.publish(t);
				throw e;
			}).then((e) => {
				if (this.trackRelays) {
					let e = this.seenOn.get(t.id);
					e || (e = /* @__PURE__ */ new Set(), this.seenOn.set(t.id, e)), e.add(a);
				}
				return e;
			});
		});
	}
	listConnectionStatus() {
		let e = /* @__PURE__ */ new Map();
		return this.relays.forEach((t, n) => e.set(n, t.connected)), e;
	}
	destroy() {
		this.relays.forEach((e) => e.close()), this.relays = /* @__PURE__ */ new Map();
	}
	pruneIdleRelays(e = 1e4) {
		let t = [];
		for (let [n, r] of this.relays) r.idleSince && Date.now() - r.idleSince >= e && (this.relays.delete(n), t.push(n), r.close());
		return t;
	}
}, qe;
try {
	qe = WebSocket;
} catch {}
var Je = class extends Ke {
	constructor(e) {
		super({
			verifyEvent: me,
			websocketImplementation: qe,
			maxWaitForConnection: 3e3,
			...e
		});
	}
}, Ye;
try {
	Ye = fetch;
} catch {}
var Xe = /^bunker:\/\/([0-9a-f]{64})\??([?\/\w:.=&%-]*)$/;
async function Ze(e) {
	let t = e.match(Xe);
	if (t) try {
		let e = t[1], n = new URLSearchParams(t[2]);
		return {
			pubkey: e,
			relays: n.getAll("relay"),
			secret: n.get("secret")
		};
	} catch {}
	return Qe(e);
}
async function Qe(e) {
	let t = e.match(ke);
	if (!t) return null;
	let [n, r = "_", i] = t;
	try {
		let e = `https://${i}/.well-known/nostr.json?name=${r}`, t = await (await Ye(e, { redirect: "error" })).json(), n = t.names[r];
		return {
			pubkey: n,
			relays: t.nip46[n] || [],
			secret: null
		};
	} catch {
		return null;
	}
}
function $e(e) {
	let t = new URLSearchParams();
	return e.relays.forEach((e) => {
		t.append("relay", e);
	}), t.append("secret", e.secret), e.perms && e.perms.length > 0 && t.append("perms", e.perms.join(",")), e.name && t.append("name", e.name), e.url && t.append("url", e.url), e.image && t.append("image", e.image), `nostrconnect://${e.clientPubkey}?${t.toString()}`;
}
var U = class {
	params;
	pool;
	subCloser;
	isOpen;
	serial;
	idPrefix;
	listeners;
	waitingForAuth;
	secretKey;
	conversationKey;
	bp;
	cachedPubKey;
	constructor(e, t) {
		this.params = t, this.pool = t.pool || new Je(), this.secretKey = e, this.isOpen = !1, this.idPrefix = Math.random().toString(36).substring(7), this.serial = 0, this.listeners = {}, this.waitingForAuth = {};
	}
	static fromBunker(e, t, n = {}) {
		if (t.relays.length === 0) throw Error("no relays specified for this bunker");
		let r = new U(e, n);
		return r.conversationKey = ve(e, t.pubkey), r.bp = t, r.setupSubscription(), r;
	}
	static async fromURI(e, t, n = {}, r = 3e5) {
		let i = new URL(t), a = i.searchParams.get("secret");
		if (!a) throw Error("nostrconnect:// URI has no secret");
		let o = new U(e, n), s = fe(e);
		return new Promise((t, c) => {
			let l = !1, u = o.pool.subscribe(i.searchParams.getAll("relay"), {
				kinds: [je],
				"#p": [s],
				limit: 0
			}, {
				onevent: async (r) => {
					try {
						let s = ve(e, r.pubkey), c = Oe(r.content, s);
						JSON.parse(c).result === a && (u.close(), o.bp = {
							pubkey: r.pubkey,
							relays: i.searchParams.getAll("relay"),
							secret: a
						}, o.conversationKey = ve(e, r.pubkey), o.setupSubscription(), l = !0, n.skipSwitchRelays || await Promise.race([new Promise((e) => setTimeout(e, 1e3)), o.switchRelays()]), t(o));
					} catch (e) {
						console.warn("failed to process potential connection event", e);
					}
				},
				onclose: () => {
					l || c(/* @__PURE__ */ Error("subscription closed before connection was established."));
				},
				maxWait: typeof r == "number" ? r : void 0,
				abort: typeof r == "number" ? void 0 : r
			});
		});
	}
	setupSubscription() {
		let e = this.listeners, t = this.waitingForAuth, n = this.conversationKey;
		this.subCloser = this.pool.subscribe(this.bp.relays, {
			kinds: [je],
			authors: [this.bp.pubkey],
			"#p": [fe(this.secretKey)],
			limit: 0
		}, {
			onevent: async (r) => {
				let { id: i, result: a, error: o } = JSON.parse(Oe(r.content, n));
				if (a === "auth_url" && t[i]) {
					delete t[i], this.params.onauth ? this.params.onauth(o) : console.warn(`nostr-tools/nip46: remote signer ${this.bp.pubkey} tried to send an "auth_url"='${o}' but there was no onauth() callback configured.`);
					return;
				}
				let s = e[i];
				s && (o ? s.reject(o) : a && s.resolve(a), delete e[i]);
			},
			onclose: () => {
				this.subCloser = void 0;
			}
		}), this.isOpen = !0;
	}
	async switchRelays() {
		try {
			let e = await this.sendRequest("switch_relays", []), t = JSON.parse(e);
			if (!t || JSON.stringify(t.sort()) === JSON.stringify(this.bp.relays)) return !1;
			this.bp.relays = t;
			let n = this.subCloser;
			return setTimeout(() => {
				n.close();
			}, 5e3), this.subCloser = void 0, this.setupSubscription(), !0;
		} catch {
			return !1;
		}
	}
	async close() {
		this.isOpen = !1, this.subCloser?.close(), this.subCloser = void 0;
	}
	async sendRequest(e, t) {
		return new Promise(async (n, r) => {
			try {
				if (!this.isOpen) throw Error("this signer is not open anymore, create a new one");
				this.subCloser || this.setupSubscription(), this.serial++;
				let i = `${this.idPrefix}-${this.serial}`, a = De(JSON.stringify({
					id: i,
					method: e,
					params: t
				}), this.conversationKey), o = pe({
					kind: je,
					tags: [["p", this.bp.pubkey]],
					content: a,
					created_at: Math.floor(Date.now() / 1e3)
				}, this.secretKey);
				this.listeners[i] = {
					resolve: n,
					reject: r
				}, this.waitingForAuth[i] = !0, await Promise.any(this.pool.publish(this.bp.relays, o));
			} catch (e) {
				r(e);
			}
		});
	}
	async ping() {
		let e = await this.sendRequest("ping", []);
		if (e !== "pong") throw Error(`result is not pong: ${e}`);
	}
	async connect(e) {
		let t = [this.bp.pubkey, this.bp.secret || ""];
		e && (t.push(""), t.push(JSON.stringify(e))), await this.sendRequest("connect", t);
	}
	async logout() {
		let e = await this.sendRequest("logout", []);
		if (e !== "ack") throw Error(`result is not ack: ${e}`);
		await this.close();
	}
	async getPublicKey() {
		return this.cachedPubKey ||= await this.sendRequest("get_public_key", []), this.cachedPubKey;
	}
	async signEvent(e) {
		let t = await this.sendRequest("sign_event", [JSON.stringify(e)]), n = JSON.parse(t);
		if (me(n)) return n;
		throw Error(`event returned from bunker is improperly signed: ${JSON.stringify(n)}`);
	}
	async nip04Encrypt(e, t) {
		return await this.sendRequest("nip04_encrypt", [e, t]);
	}
	async nip04Decrypt(e, t) {
		return await this.sendRequest("nip04_decrypt", [e, t]);
	}
	async nip44Encrypt(e, t) {
		return await this.sendRequest("nip44_encrypt", [e, t]);
	}
	async nip44Decrypt(e, t) {
		return await this.sendRequest("nip44_decrypt", [e, t]);
	}
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/nostr-tools/lib/esm/pool.js
new TextDecoder("utf-8");
var et = new TextEncoder();
function W(e) {
	try {
		e.indexOf("://") === -1 && (e = "wss://" + e);
		let t = new URL(e);
		return t.protocol === "http:" ? t.protocol = "ws:" : t.protocol === "https:" && (t.protocol = "wss:"), t.pathname = t.pathname.replace(/\/+/g, "/"), t.pathname.endsWith("/") && (t.pathname = t.pathname.slice(0, -1)), (t.port === "80" && t.protocol === "ws:" || t.port === "443" && t.protocol === "wss:") && (t.port = ""), t.searchParams.sort(), t.hash = "", t.toString();
	} catch {
		throw Error(`Invalid URL: ${e}`);
	}
}
function tt(e) {
	if (e.length !== 64) return !1;
	for (let t = 0; t < 64; t++) {
		let n = e.charCodeAt(t);
		if (isNaN(n) || n < 48 || n > 102 || n > 57 && n < 97) return !1;
	}
	return !0;
}
var G = Symbol("verified"), nt = (e) => e instanceof Object;
function rt(e) {
	if (!nt(e) || typeof e.kind != "number" || typeof e.content != "string" || typeof e.created_at != "number" || typeof e.pubkey != "string" || !tt(e.pubkey) || !Array.isArray(e.tags)) return !1;
	for (let t = 0; t < e.tags.length; t++) {
		let n = e.tags[t];
		if (!Array.isArray(n)) return !1;
		for (let e = 0; e < n.length; e++) if (typeof n[e] != "string") return !1;
	}
	return !0;
}
var it = class {
	generateSecretKey() {
		return y.utils.randomSecretKey();
	}
	getPublicKey(e) {
		return x(y.getPublicKey(e));
	}
	finalizeEvent(e, t) {
		let n = e;
		return n.pubkey = x(y.getPublicKey(t)), n.id = ot(n), n.sig = x(y.sign(v(ot(n)), t)), n[G] = !0, n;
	}
	verifyEvent(e) {
		if (typeof e[G] == "boolean") return e[G];
		try {
			let t = ot(e);
			if (t !== e.id) return e[G] = !1, !1;
			let n = y.verify(v(e.sig), v(t), v(e.pubkey));
			return e[G] = n, n;
		} catch {
			return e[G] = !1, !1;
		}
	}
};
function at(e) {
	if (!rt(e)) throw Error("can't serialize event with wrong or missing properties");
	return JSON.stringify([
		0,
		e.pubkey,
		e.created_at,
		e.kind,
		e.tags,
		e.content
	]);
}
function ot(e) {
	let t = _(et.encode(at(e)));
	return x(t);
}
var st = new it();
st.generateSecretKey, st.getPublicKey, st.finalizeEvent;
var ct = st.verifyEvent, lt = 22242;
function ut(e, t) {
	if (e.ids && e.ids.indexOf(t.id) === -1 || e.kinds && e.kinds.indexOf(t.kind) === -1 || e.authors && e.authors.indexOf(t.pubkey) === -1) return !1;
	for (let n in e) if (n[0] === "#") {
		let r = e[`#${n.slice(1)}`];
		if (r && !t.tags.find(([e, t]) => e === n.slice(1) && r.indexOf(t) !== -1)) return !1;
	}
	return !(e.since && t.created_at < e.since || e.until && t.created_at > e.until);
}
function dt(e, t) {
	for (let n = 0; n < e.length; n++) if (ut(e[n], t)) return !0;
	return !1;
}
function ft(e, t) {
	let n = t.length + 3, r = e.indexOf(`"${t}":`) + n, i = e.slice(r).indexOf("\"") + r + 1;
	return e.slice(i, i + 64);
}
function pt(e) {
	let t = e.slice(0, 22).indexOf("\"EVENT\"");
	if (t === -1) return null;
	let n = e.slice(t + 7 + 1).indexOf("\"");
	if (n === -1) return null;
	let r = t + 7 + 1 + n, i = e.slice(r + 1, 80).indexOf("\"");
	if (i === -1) return null;
	let a = r + 1 + i;
	return e.slice(r + 1, a);
}
function mt(e, t) {
	return {
		kind: lt,
		created_at: Math.floor(Date.now() / 1e3),
		tags: [["relay", e], ["challenge", t]],
		content: ""
	};
}
var ht = class extends Error {
	constructor(e, t) {
		super(`Tried to send message '${e} on a closed connection to ${t}.`), this.name = "SendingOnClosedConnection";
	}
}, gt = class {
	url;
	_connected = !1;
	onclose = null;
	onnotice = (e) => console.debug(`NOTICE from ${this.url}: ${e}`);
	onauth;
	baseEoseTimeout = 4400;
	publishTimeout = 4400;
	pingFrequency = 29e3;
	pingTimeout = 2e4;
	resubscribeBackoff = [
		1e4,
		1e4,
		1e4,
		2e4,
		2e4,
		3e4,
		6e4
	];
	openSubs = /* @__PURE__ */ new Map();
	enablePing;
	enableReconnect;
	idleTimeout = 0;
	idleSince = Date.now();
	ongoingOperations = 0;
	reconnectTimeoutHandle;
	pingIntervalHandle;
	reconnectAttempts = 0;
	skipReconnection = !1;
	idleTimeoutHandle;
	connectionPromise;
	openCountRequests = /* @__PURE__ */ new Map();
	openEventPublishes = /* @__PURE__ */ new Map();
	ws;
	challenge;
	authPromise;
	serial = 0;
	verifyEvent;
	_WebSocket;
	constructor(e, t) {
		this.url = W(e), this.verifyEvent = t.verifyEvent, this._WebSocket = t.websocketImplementation || WebSocket, this.enablePing = t.enablePing, this.enableReconnect = t.enableReconnect || !1, t.idleTimeout && (this.idleTimeout = t.idleTimeout);
	}
	static async connect(e, t) {
		let n = new gt(e, t);
		return await n.connect(t), n;
	}
	closeAllSubscriptions(e) {
		for (let [t, n] of this.openSubs) n.close(e);
		this.openSubs.clear();
		for (let [t, n] of this.openEventPublishes) n.reject(Error(e));
		this.openEventPublishes.clear();
		for (let [t, n] of this.openCountRequests) n.reject(Error(e));
		this.openCountRequests.clear();
	}
	get connected() {
		return this._connected;
	}
	clearIdleTimeout() {
		this.idleTimeoutHandle &&= (clearTimeout(this.idleTimeoutHandle), void 0);
	}
	scheduleIdleClose() {
		this.clearIdleTimeout(), this.idleTimeout > 0 && (this.idleTimeoutHandle = setTimeout(() => {
			this.ongoingOperations === 0 && this.idleSince && this.close();
		}, this.idleTimeout));
	}
	async reconnect() {
		let e = this.resubscribeBackoff[Math.min(this.reconnectAttempts, this.resubscribeBackoff.length - 1)];
		this.reconnectAttempts++, this.reconnectTimeoutHandle = setTimeout(async () => {
			try {
				await this.connect();
			} catch {}
		}, e);
	}
	handleHardClose(e) {
		this.ws && (this.ws.onopen = null, this.ws.onerror = null, this.ws.onclose = null), this.pingIntervalHandle &&= (clearInterval(this.pingIntervalHandle), void 0), this._connected = !1, this.connectionPromise = void 0, this.idleSince = void 0, this.clearIdleTimeout(), this.enableReconnect && !this.skipReconnection ? this.reconnect() : (this.onclose?.(), this.closeAllSubscriptions(e));
	}
	async connect(e) {
		let t;
		return this.connectionPromise ||= (this.challenge = void 0, this.authPromise = void 0, this.skipReconnection = !1, new Promise((n, r) => {
			e?.timeout && (t = setTimeout(() => {
				r("connection timed out"), this.connectionPromise = void 0, this.reconnectAttempts === 0 && (this.skipReconnection = !0), this.ws?.close?.(), this.handleHardClose("relay connection timed out");
			}, e.timeout)), e?.abort && (e.abort.onabort = r);
			try {
				this.ws = new this._WebSocket(this.url);
			} catch (e) {
				clearTimeout(t), r(e);
				return;
			}
			this.ws.onopen = () => {
				this.reconnectTimeoutHandle &&= (clearTimeout(this.reconnectTimeoutHandle), void 0), clearTimeout(t), this._connected = !0;
				let e = this.reconnectAttempts > 0;
				this.reconnectAttempts = 0;
				for (let t of this.openSubs.values()) {
					if (t.eosed = !1, e) for (let e = 0; e < t.filters.length; e++) t.lastEmitted && (t.filters[e].since = t.lastEmitted + 1);
					t.fire();
				}
				this.enablePing && (this.pingIntervalHandle = setInterval(() => this.pingpong(), this.pingFrequency)), n();
			}, this.ws.onerror = () => {
				clearTimeout(t), r("connection failed"), this.connectionPromise = void 0, this.reconnectAttempts === 0 && (this.skipReconnection = !0), this.ws?.close?.(), this.handleHardClose("relay connection failed");
			}, this.ws.onclose = (e) => {
				clearTimeout(t), r(e.message || "websocket closed"), this.handleHardClose("relay connection closed");
			}, this.ws.onmessage = this._onmessage.bind(this);
		})), this.connectionPromise;
	}
	waitForPingPong() {
		return new Promise((e) => {
			this.ws.once("pong", () => e(!0)), this.ws.ping();
		});
	}
	waitForDummyReq() {
		return new Promise((e, t) => {
			if (!this.connectionPromise) return t(/* @__PURE__ */ Error(`no connection to ${this.url}, can't ping`));
			try {
				let t = this.subscribe([{
					ids: ["aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"],
					limit: 1
				}], {
					label: "<forced-ping>",
					oneose: () => {
						e(!0), t.close();
					},
					onclose() {
						e(!0);
					},
					eoseTimeout: this.pingTimeout + 1e3
				});
			} catch (e) {
				t(e);
			}
		});
	}
	async pingpong() {
		this.ws?.readyState === 1 && (await Promise.any([this.ws && this.ws.ping && this.ws.once ? this.waitForPingPong() : this.waitForDummyReq(), new Promise((e) => setTimeout(() => e(!1), this.pingTimeout))]) || this.ws?.readyState === this._WebSocket.OPEN && this.ws?.close());
	}
	async send(e) {
		if (!this.connectionPromise) throw new ht(e, this.url);
		this.connectionPromise.then(() => {
			this.ws?.send(e);
		});
	}
	async auth(e) {
		let t = this.challenge;
		if (!t) throw Error("can't perform auth, no challenge was received");
		return this.authPromise ||= new Promise(async (n, r) => {
			try {
				let i = await e(mt(this.url, t)), a = setTimeout(() => {
					let e = this.openEventPublishes.get(i.id);
					e && (e.reject(/* @__PURE__ */ Error("auth timed out")), this.openEventPublishes.delete(i.id));
				}, this.publishTimeout);
				this.openEventPublishes.set(i.id, {
					resolve: n,
					reject: r,
					timeout: a
				}), this.send("[\"AUTH\"," + JSON.stringify(i) + "]");
			} catch (e) {
				console.warn("subscribe auth function failed:", e);
			}
		}), this.authPromise;
	}
	async publish(e) {
		this.idleSince = void 0, this.clearIdleTimeout(), this.ongoingOperations++;
		let t = new Promise((t, n) => {
			let r = setTimeout(() => {
				let t = this.openEventPublishes.get(e.id);
				t && (t.reject(/* @__PURE__ */ Error("publish timed out")), this.openEventPublishes.delete(e.id));
			}, this.publishTimeout);
			this.openEventPublishes.set(e.id, {
				resolve: t,
				reject: n,
				timeout: r
			});
		});
		try {
			await this.send("[\"EVENT\"," + JSON.stringify(e) + "]");
		} catch (t) {
			let n = this.openEventPublishes.get(e.id);
			n && (n.reject(t), this.openEventPublishes.delete(e.id));
		}
		return this.ongoingOperations--, this.ongoingOperations === 0 && (this.idleSince = Date.now(), this.scheduleIdleClose()), t;
	}
	async count(e, t) {
		return (await this.countWithHLL(e, t)).count;
	}
	async countWithHLL(e, t) {
		this.serial++;
		let n = t?.id || "count:" + this.serial, r = new Promise((e, t) => {
			this.openCountRequests.set(n, {
				resolve: e,
				reject: t
			});
		});
		try {
			await this.send("[\"COUNT\",\"" + n + "\"," + JSON.stringify(e).substring(1));
		} catch (e) {
			let t = this.openCountRequests.get(n);
			t && (t.reject(e), this.openCountRequests.delete(n));
		}
		return r;
	}
	subscribe(e, t) {
		t.label !== "<forced-ping>" && (this.idleSince = void 0, this.clearIdleTimeout(), this.ongoingOperations++);
		let n = this.prepareSubscription(e, t);
		return n.fire(), t.abort && (t.abort.onabort = () => n.close(String(t.abort.reason || "<aborted>"))), n;
	}
	prepareSubscription(e, t) {
		this.serial++;
		let n = t.id || (t.label ? t.label + ":" : "sub:") + this.serial, r = new _t(this, n, e, t);
		return this.openSubs.set(n, r), r;
	}
	close() {
		this.skipReconnection = !0, this.reconnectTimeoutHandle &&= (clearTimeout(this.reconnectTimeoutHandle), void 0), this.pingIntervalHandle &&= (clearInterval(this.pingIntervalHandle), void 0), this.closeAllSubscriptions("relay connection closed by us"), this._connected = !1, this.connectionPromise = void 0, this.idleSince = void 0, this.clearIdleTimeout(), this.onclose?.(), this.ws && (this.ws.onopen = null, this.ws.onerror = null, this.ws.onclose = null, this.ws.readyState !== this._WebSocket.CLOSING && this.ws.readyState !== this._WebSocket.CLOSED && this.ws.close());
	}
	_onmessage(e) {
		let t = e.data;
		if (!t) return;
		let n = pt(t);
		if (n) {
			let e = this.openSubs.get(n);
			if (!e) return;
			let r = ft(t, "id"), i = e.alreadyHaveEvent?.(r);
			if (e.receivedEvent?.(this, r), i) return;
		}
		try {
			let e = JSON.parse(t);
			switch (e[0]) {
				case "EVENT": {
					let t = this.openSubs.get(e[1]), n = e[2];
					dt(t.filters, n) && this.verifyEvent(n, this.url) ? t.onevent(n) : t.oninvalidevent?.(n), (!t.lastEmitted || t.lastEmitted < n.created_at) && (t.lastEmitted = n.created_at);
					return;
				}
				case "COUNT": {
					let t = e[1], n = e[2], r = this.openCountRequests.get(t);
					r && (r.resolve(n), this.openCountRequests.delete(t));
					return;
				}
				case "EOSE": {
					let t = this.openSubs.get(e[1]);
					if (!t) return;
					t.receivedEose();
					return;
				}
				case "OK": {
					let t = e[1], n = e[2], r = e[3], i = this.openEventPublishes.get(t);
					i && (clearTimeout(i.timeout), n ? i.resolve(r) : i.reject(Error(r)), this.openEventPublishes.delete(t));
					return;
				}
				case "CLOSED": {
					let t = e[1], n = this.openSubs.get(t);
					if (!n) {
						let n = this.openCountRequests.get(t);
						n && (n.reject(Error(e[2])), this.openCountRequests.delete(t));
						return;
					}
					n.closed = !0, n.close(e[2]);
					return;
				}
				case "NOTICE":
					this.onnotice(e[1]);
					return;
				case "AUTH":
					this.challenge = e[1], this.onauth && this.auth(this.onauth).catch((e) => {
						if (!(e instanceof ht)) throw e;
					});
					return;
				default:
					this.openSubs.get(e[1])?.oncustom?.(e);
					return;
			}
		} catch (e) {
			try {
				let [n, r, i] = JSON.parse(t);
				console.warn(`[nostr] relay ${this.url} error processing message:`, e, i);
			} catch {
				console.warn(`[nostr] relay ${this.url} error processing message:`, e);
			}
			return;
		}
	}
}, _t = class {
	relay;
	id;
	lastEmitted;
	closed = !1;
	eosed = !1;
	filters;
	alreadyHaveEvent;
	receivedEvent;
	onevent;
	oninvalidevent;
	oneose;
	onclose;
	oncustom;
	eoseTimeout;
	eoseTimeoutHandle;
	constructor(e, t, n, r) {
		if (n.length === 0) throw Error("subscription can't be created with zero filters");
		this.relay = e, this.filters = n, this.id = t, this.alreadyHaveEvent = r.alreadyHaveEvent, this.receivedEvent = r.receivedEvent, this.eoseTimeout = r.eoseTimeout || e.baseEoseTimeout, this.oneose = r.oneose, this.onclose = r.onclose, this.oninvalidevent = r.oninvalidevent, this.onevent = r.onevent || ((e) => {
			console.warn(`onevent() callback not defined for subscription '${this.id}' in relay ${this.relay.url}. event received:`, e);
		});
	}
	fire() {
		this.relay.send("[\"REQ\",\"" + this.id + "\"," + JSON.stringify(this.filters).substring(1)), this.eoseTimeoutHandle = setTimeout(this.receivedEose.bind(this), this.eoseTimeout);
	}
	receivedEose() {
		this.eosed || (clearTimeout(this.eoseTimeoutHandle), this.eosed = !0, this.oneose?.());
	}
	close(e = "closed by caller") {
		if (!this.closed && this.relay.connected) {
			try {
				this.relay.send("[\"CLOSE\"," + JSON.stringify(this.id) + "]");
			} catch (e) {
				if (!(e instanceof ht)) throw e;
			}
			this.closed = !0;
		}
		this.relay.openSubs.delete(this.id), this.id.startsWith("<forced-ping>") || (this.relay.ongoingOperations--, this.relay.ongoingOperations === 0 && (this.relay.idleSince = Date.now(), this.relay.scheduleIdleClose())), this.onclose?.(e);
	}
}, K = 256, vt = K * 2;
new TextEncoder();
function yt(e, t) {
	switch (t) {
		case "reactions": return {
			"#e": [e],
			kinds: [7]
		};
		case "reposts": return {
			"#e": [e],
			kinds: [6]
		};
		case "quotes": return {
			"#q": [e],
			kinds: [1, 1111]
		};
		case "replies": return {
			"#e": [e],
			kinds: [1]
		};
		case "comments": return {
			"#E": [e],
			kinds: [1111]
		};
		case "followers": return {
			"#p": [e],
			kinds: [3]
		};
	}
}
function bt() {
	return new Uint8Array(K);
}
function xt(e) {
	if (e.length !== vt || !/^[0-9a-f]+$/.test(e)) return;
	let t = new Uint8Array(K);
	for (let n = 0; n < K; n++) t[n] = parseInt(e.slice(n * 2, n * 2 + 2), 16);
	return t;
}
function St(e) {
	if (e.length !== K) throw Error(`invalid number of registers ${e.length}`);
	let t = "";
	for (let n = 0; n < K; n++) t += e[n].toString(16).padStart(2, "0");
	return t;
}
function Ct(e, t) {
	if (e.length === 0 && (e = bt()), e.length !== K) throw Error(`invalid number of registers ${e.length}`);
	if (t.length !== K) throw Error(`invalid number of registers ${t.length}`);
	for (let n = 0; n < K; n++) t[n] > e[n] && (e[n] = t[n]);
	return e;
}
var wt = class {
	relays = /* @__PURE__ */ new Map();
	seenOn = /* @__PURE__ */ new Map();
	trackRelays = !1;
	verifyEvent;
	enablePing;
	enableReconnect;
	idleTimeout = 2e4;
	automaticallyAuth;
	onRelayConnectionFailure;
	onRelayConnectionSuccess;
	allowConnectingToRelay;
	maxWaitForConnection;
	_WebSocket;
	constructor(e) {
		this.verifyEvent = e.verifyEvent, this._WebSocket = e.websocketImplementation, this.enablePing = e.enablePing, this.enableReconnect = e.enableReconnect || !1, e.idleTimeout && (this.idleTimeout = e.idleTimeout), this.automaticallyAuth = e.automaticallyAuth, this.onRelayConnectionFailure = e.onRelayConnectionFailure, this.onRelayConnectionSuccess = e.onRelayConnectionSuccess, this.allowConnectingToRelay = e.allowConnectingToRelay, this.maxWaitForConnection = e.maxWaitForConnection || 3e3;
	}
	async ensureRelay(e, t) {
		e = W(e);
		let n = this.relays.get(e);
		if (n || (n = new gt(e, {
			verifyEvent: this.verifyEvent,
			websocketImplementation: this._WebSocket,
			enablePing: this.enablePing,
			enableReconnect: this.enableReconnect,
			idleTimeout: this.idleTimeout
		}), n.onclose = () => {
			this.relays.delete(e);
		}, this.relays.set(e, n)), this.automaticallyAuth) {
			let t = this.automaticallyAuth(e);
			t && (n.onauth = t);
		}
		try {
			await n.connect({
				timeout: t?.connectionTimeout,
				abort: t?.abort
			});
		} catch (t) {
			throw this.relays.delete(e), t;
		}
		return n;
	}
	close(e) {
		e.map(W).forEach((e) => {
			this.relays.get(e)?.close(), this.relays.delete(e);
		});
	}
	subscribe(e, t, n) {
		let r = [], i = [];
		for (let n = 0; n < e.length; n++) {
			let a = W(e[n]);
			r.find((e) => e.url === a) || i.indexOf(a) === -1 && (i.push(a), r.push({
				url: a,
				filter: t
			}));
		}
		return this.subscribeMap(r, n);
	}
	subscribeMany(e, t, n) {
		return this.subscribe(e, t, n);
	}
	subscribeMap(e, t) {
		let n = /* @__PURE__ */ new Map();
		for (let t of e) {
			let { url: e, filter: r } = t;
			n.has(e) || n.set(e, []), n.get(e).push(r);
		}
		let r = Array.from(n.entries()).map(([e, t]) => ({
			url: e,
			filters: t
		}));
		this.trackRelays && (t.receivedEvent = (e, t) => {
			let n = this.seenOn.get(t);
			n || (n = /* @__PURE__ */ new Set(), this.seenOn.set(t, n)), n.add(e);
		});
		let i = /* @__PURE__ */ new Set(), a = [], o = [], s = (e) => {
			o[e] || (o[e] = !0, o.filter((e) => e).length === r.length && (t.oneose?.(), s = () => {}));
		}, c = [], l = (e, n, i) => {
			c[e] || (s(e), c[e] = {
				url: n,
				reason: i
			}, c.filter((e) => e).length === r.length && (t.onclose?.(c), l = () => {}));
		}, u = (e) => {
			if (t.alreadyHaveEvent?.(e)) return !0;
			let n = i.has(e);
			return i.add(e), n;
		}, d = Promise.all(r.map(async ({ url: e, filters: n }, r) => {
			if (this.allowConnectingToRelay?.(e, ["read", n]) === !1) {
				l(r, e, "connection skipped by allowConnectingToRelay");
				return;
			}
			let i;
			try {
				i = await this.ensureRelay(e, {
					connectionTimeout: this.maxWaitForConnection < (t.maxWait || 0) ? Math.max(t.maxWait * .8, t.maxWait - 1e3) : this.maxWaitForConnection,
					abort: t.abort
				});
			} catch (t) {
				this.onRelayConnectionFailure?.(e), l(r, e, t?.message || String(t));
				return;
			}
			this.onRelayConnectionSuccess?.(e);
			let o = i.subscribe(n, {
				...t,
				oneose: () => s(r),
				onclose: (a) => {
					a.startsWith("auth-required: ") && t.onauth ? i.auth(t.onauth).then(() => {
						i.subscribe(n, {
							...t,
							oneose: () => s(r),
							onclose: (t) => {
								l(r, e, t);
							},
							alreadyHaveEvent: u,
							eoseTimeout: t.maxWait,
							abort: t.abort
						});
					}).catch((t) => {
						l(r, e, `auth was required and attempted, but failed with: ${t}`);
					}) : l(r, e, a);
				},
				alreadyHaveEvent: u,
				eoseTimeout: t.maxWait,
				abort: t.abort
			});
			a.push(o);
		}));
		return { async close(e) {
			await d, a.forEach((t) => {
				t.close(e);
			});
		} };
	}
	subscribeEose(e, t, n) {
		let r;
		return r = this.subscribe(e, t, {
			...n,
			oneose() {
				let t = "closed automatically on eose";
				r ? r.close(t) : n.onclose?.(e.map((e) => ({
					url: e,
					reason: t
				})));
			}
		}), r;
	}
	subscribeManyEose(e, t, n) {
		return this.subscribeEose(e, t, n);
	}
	async querySync(e, t, n) {
		return new Promise(async (r) => {
			let i = [];
			this.subscribeEose(e, t, {
				...n,
				onevent(e) {
					i.push(e);
				},
				onclose(e) {
					r(i);
				}
			});
		});
	}
	async get(e, t, n) {
		t.limit = 1;
		let r = await this.querySync(e, t, n);
		return r.sort((e, t) => t.created_at - e.created_at), r[0] || null;
	}
	async countMany(e, t, n, r) {
		let i = yt(t, n), a = [];
		for (let t = 0; t < e.length; t++) {
			let n = W(e[t]);
			a.indexOf(n) === -1 && a.push(n);
		}
		let o = await Promise.all(a.map(async (e) => {
			if (this.allowConnectingToRelay?.(e, ["read", [i]]) === !1) return null;
			let t;
			try {
				t = await this.ensureRelay(e, {
					connectionTimeout: this.maxWaitForConnection < (r?.maxWait || 0) ? Math.max(r.maxWait * .8, r.maxWait - 1e3) : this.maxWaitForConnection,
					abort: r?.abort
				});
			} catch {
				return this.onRelayConnectionFailure?.(e), null;
			}
			return this.onRelayConnectionSuccess?.(e), t.countWithHLL([i], { id: r?.id }).catch(() => null);
		})), s = 0, c;
		for (let e of o) {
			if (!e || (e.count > s && (s = e.count), !e.hll || e.hll.length !== 512)) continue;
			let t = xt(e.hll);
			t && (c = Ct(c || /* @__PURE__ */ new Uint8Array(), t));
		}
		return c ? {
			count: s,
			hll: St(c)
		} : { count: s };
	}
	publish(e, t, n) {
		return e.map(W).map(async (e, r, i) => {
			if (i.indexOf(e) !== r) return Promise.reject("duplicate url");
			if (this.allowConnectingToRelay?.(e, ["write", t]) === !1) return Promise.reject("connection skipped by allowConnectingToRelay");
			let a;
			try {
				a = await this.ensureRelay(e, {
					connectionTimeout: this.maxWaitForConnection < (n?.maxWait || 0) ? Math.max(n.maxWait * .8, n.maxWait - 1e3) : this.maxWaitForConnection,
					abort: n?.abort
				});
			} catch (t) {
				return this.onRelayConnectionFailure?.(e), Promise.reject("connection failure: " + String(t));
			}
			return a.publish(t).catch(async (e) => {
				if (e instanceof Error && e.message.startsWith("auth-required: ") && n?.onauth) return await a.auth(n.onauth), a.publish(t);
				throw e;
			}).then((e) => {
				if (this.trackRelays) {
					let e = this.seenOn.get(t.id);
					e || (e = /* @__PURE__ */ new Set(), this.seenOn.set(t.id, e)), e.add(a);
				}
				return e;
			});
		});
	}
	listConnectionStatus() {
		let e = /* @__PURE__ */ new Map();
		return this.relays.forEach((t, n) => e.set(n, t.connected)), e;
	}
	destroy() {
		this.relays.forEach((e) => e.close()), this.relays = /* @__PURE__ */ new Map();
	}
	pruneIdleRelays(e = 1e4) {
		let t = [];
		for (let [n, r] of this.relays) r.idleSince && Date.now() - r.idleSince >= e && (this.relays.delete(n), t.push(n), r.close());
		return t;
	}
}, Tt;
try {
	Tt = WebSocket;
} catch {}
function Et(e) {
	Tt = e;
}
var Dt = class extends wt {
	constructor(e) {
		super({
			verifyEvent: ct,
			websocketImplementation: Tt,
			maxWaitForConnection: 3e3,
			...e
		});
	}
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/nostr-tools/lib/esm/pure.js
new TextDecoder("utf-8");
var Ot = new TextEncoder();
function kt(e) {
	if (e.length !== 64) return !1;
	for (let t = 0; t < 64; t++) {
		let n = e.charCodeAt(t);
		if (isNaN(n) || n < 48 || n > 102 || n > 57 && n < 97) return !1;
	}
	return !0;
}
var q = Symbol("verified"), At = (e) => e instanceof Object;
function jt(e) {
	if (!At(e) || typeof e.kind != "number" || typeof e.content != "string" || typeof e.created_at != "number" || typeof e.pubkey != "string" || !kt(e.pubkey) || !Array.isArray(e.tags)) return !1;
	for (let t = 0; t < e.tags.length; t++) {
		let n = e.tags[t];
		if (!Array.isArray(n)) return !1;
		for (let e = 0; e < n.length; e++) if (typeof n[e] != "string") return !1;
	}
	return !0;
}
var Mt = class {
	generateSecretKey() {
		return y.utils.randomSecretKey();
	}
	getPublicKey(e) {
		return x(y.getPublicKey(e));
	}
	finalizeEvent(e, t) {
		let n = e;
		return n.pubkey = x(y.getPublicKey(t)), n.id = Pt(n), n.sig = x(y.sign(v(Pt(n)), t)), n[q] = !0, n;
	}
	verifyEvent(e) {
		if (typeof e[q] == "boolean") return e[q];
		try {
			let t = Pt(e);
			if (t !== e.id) return e[q] = !1, !1;
			let n = y.verify(v(e.sig), v(t), v(e.pubkey));
			return e[q] = n, n;
		} catch {
			return e[q] = !1, !1;
		}
	}
};
function Nt(e) {
	if (!jt(e)) throw Error("can't serialize event with wrong or missing properties");
	return JSON.stringify([
		0,
		e.pubkey,
		e.created_at,
		e.kind,
		e.tags,
		e.content
	]);
}
function Pt(e) {
	let t = _(Ot.encode(Nt(e)));
	return x(t);
}
var Ft = new Mt(), It = Ft.generateSecretKey, Lt = Ft.getPublicKey;
Ft.finalizeEvent, Ft.verifyEvent;
// D:/ドキュメント/GitHub/ehagaki/src/lib/tags/clientTag.ts
var Rt = "eHagaki", zt = [
	"client",
	Rt,
	"31990:ec42c765418b3db9c85abff3a88f4a3bbe57535eebbdc54522041fa5328c0600:1754918316480"
];
function Bt(e) {
	return e ? [...zt] : null;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/nip46Service.ts
var Vt = 5e3, Ht = 3e4, Ut = 3e5, Wt = 4e4, Gt = 5e3, Kt = 1e3, qt = 1500, Jt = 5e3, Yt = 5e3, Xt = 5e3, Zt = "Timed out waiting for get_public_key response", Qt = "Remote signer requested authentication during automatic identity verification", $t = "Remote signer returned an invalid user public key", en = "Remote signer returned an unexpected user public key", tn = "local-network-access; local-network; loopback-network", nn = [
	"loopback-network",
	"local-network",
	"local-network-access"
], rn = P.finalRelayListMissing, an = P.finalRelayListInvalid, on = P.finalRelayNoUsable, sn = P.finalLocalRelayUnreachable, cn = P.finalRelayVerificationFailed, ln = {
	name: Rt,
	url: "https://lokuyow.github.io/ehagaki/",
	image: "https://lokuyow.github.io/ehagaki/ehagaki_icon.webp"
}, un = {
	connecting: "[NIP-46] connecting to relay:",
	connected: "[NIP-46] relay connected:",
	failed: "[NIP-46] relay connection failed:",
	partial: "[NIP-46] continuing with first reachable relays only:"
}, dn = {
	connecting: "[NIP-46] connecting to negotiated final relay:",
	connected: "[NIP-46] negotiated final relay connected:",
	failed: "[NIP-46] negotiated final relay connection failed:",
	partial: "[NIP-46] continuing with first reachable negotiated final relays only:"
};
function fn() {
	let e = globalThis.window;
	if (!e) return !1;
	try {
		return e.self !== e.top;
	} catch {
		return !0;
	}
}
function pn() {
	let e = globalThis.document;
	return e?.permissionsPolicy ?? e?.featurePolicy ?? null;
}
function mn() {
	let e = pn();
	if (!e?.allowedFeatures || !e.allowsFeature) return [];
	let t = new Set(e.allowedFeatures());
	return nn.filter((e) => t.has(e)).filter((t) => !e.allowsFeature?.(t));
}
function hn() {
	if (!fn()) return null;
	let e = mn();
	return e.length > 0 ? `This page is running inside an iframe and the browser reports that ${e.join(", ")} is not delegated to that frame. Add allow="${tn}" to the parent iframe and reload.` : `This page is running inside an iframe. On Chrome-based browsers, local ws://127.0.0.1 relays may require the parent iframe to delegate local/loopback network access. Add allow="${tn}" to the parent iframe and reload.`;
}
function gn(e) {
	return e.replace(/^\[/, "").replace(/\]$/, "").split("%")[0];
}
function _n(e) {
	let t = e.trim().toLowerCase();
	if (!t) return !1;
	if (t === "localhost" || t.endsWith(".localhost")) return !0;
	let n = gn(t);
	if (!n || !L.isValid(n)) return !1;
	try {
		let e = L.parse(n);
		return e.kind() === "ipv6" && e.isIPv4MappedAddress() ? e.toIPv4Address().range() === "loopback" : e.range() === "loopback";
	} catch {
		return !1;
	}
}
function vn(e) {
	try {
		let t = new URL(e);
		return t.protocol === "ws:" && _n(t.hostname);
	} catch {
		return !1;
	}
}
function yn(e) {
	for (let t of e) if (vn(t)) {
		let e = hn(), t = "127.0.0.1/localhost points to the browser device itself, so confirm the local relay app is running and listening on that device.";
		return e ? `${e} ${t}` : `The browser is attempting the local ws:// relay, but the connection is being refused. ${t}`;
	}
	return null;
}
var bn = [
	"get_public_key",
	"sign_event:1",
	"sign_event:6",
	"sign_event:7",
	"sign_event:16",
	"sign_event:36",
	"sign_event:1111",
	"sign_event:5",
	"sign_event:42",
	"sign_event:10063",
	"sign_event:10096",
	"sign_event:22242",
	"sign_event:27235",
	"sign_event:24242"
], xn = bn.join(","), Sn = class {
	bunkerSigner;
	fallbackPubkey;
	pendingRequests = /* @__PURE__ */ new Set();
	retired = !1;
	drainPromise = null;
	resolveDrained = null;
	constructor(e, t = null) {
		this.bunkerSigner = e, this.fallbackPubkey = t;
	}
	get hasPendingRequests() {
		return this.pendingRequests.size > 0;
	}
	retire() {
		return this.retired = !0, this.hasPendingRequests ? (this.drainPromise ??= new Promise((e) => {
			this.resolveDrained = e;
		}), this.drainPromise) : Promise.resolve();
	}
	cancelPendingRequests() {
		this.retired = !0;
		for (let e of this.pendingRequests) e(/* @__PURE__ */ Error("NIP-46 signer connection was closed"));
	}
	async runRequest(e) {
		if (this.retired) throw Error("NIP-46 signer connection was closed");
		let t, n = new Promise((e, n) => {
			t = n;
		});
		this.pendingRequests.add(t);
		try {
			return await Promise.race([e(), n]);
		} finally {
			this.pendingRequests.delete(t), this.hasPendingRequests || (this.resolveDrained?.(), this.resolveDrained = null);
		}
	}
	async signEvent(e) {
		let t = typeof e.pubkey == "string" && e.pubkey.length > 0 ? e.pubkey : this.fallbackPubkey, n = {
			kind: e.kind,
			content: e.content,
			tags: e.tags ?? [],
			created_at: e.created_at ?? Math.floor(Date.now() / 1e3),
			...t ? { pubkey: t } : {}
		}, r = Date.now();
		console.debug("[NIP-46] sign_event start", {
			method: "sign_event",
			stage: "start",
			kind: n.kind
		});
		try {
			let e = await this.runRequest(() => this.bunkerSigner.signEvent(n)), t = Date.now() - r;
			return console.debug("[NIP-46] sign_event resolved", {
				method: "sign_event",
				stage: "success",
				kind: n.kind,
				durationMs: t
			}), e;
		} catch (e) {
			let t = Date.now() - r;
			throw console.error("[NIP-46] sign_event failed", {
				method: "sign_event",
				stage: "failure",
				kind: n.kind,
				durationMs: t,
				reason: "unexpected"
			}), e;
		}
	}
	async getPublicKey() {
		return await this.runRequest(() => this.bunkerSigner.getPublicKey());
	}
}, Cn = class extends WebSocket {
	constructor(e, t) {
		super(e, t), this.addEventListener("open", () => {
			console.debug("[NIP-46 WS] open", { direction: "transport" });
		}), this.addEventListener("message", () => {
			console.debug("[NIP-46 WS] receive", { direction: "inbound" });
		}), this.addEventListener("close", (e) => {
			console.debug("[NIP-46 WS] close", {
				direction: "transport",
				closeCode: e.code
			});
		}), this.addEventListener("error", () => {
			console.debug("[NIP-46 WS] error", { direction: "transport" });
		});
	}
	send(e) {
		let t = e;
		if (typeof e == "string") try {
			let n = JSON.parse(e);
			if (Array.isArray(n) && n[0] === "REQ") {
				let e = !1;
				for (let t = 2; t < n.length; t++) n[t] && typeof n[t] == "object" && n[t].limit === 0 && (delete n[t].limit, n[t].since = Math.floor(Date.now() / 1e3), e = !0);
				e && (t = JSON.stringify(n), console.debug("[NIP-46 WS] patched REQ: limit:0 → since"));
			}
		} catch {}
		console.debug("[NIP-46 WS] send", { direction: "outbound" }), super.send(t);
	}
};
async function J(e, t = un, n = 0) {
	let r = [...new Set(Q(e))];
	if (r.length === 0) throw Error(I("no reachable relays"));
	let i = Date.now(), a = globalThis.WebSocket;
	Et(Cn);
	let o = new Dt();
	Et(a);
	let s = [], c = [], l = null, u = null, d = !1, f = r.length, p = /* @__PURE__ */ new Set(), m = new Promise((e, t) => {
		l = e, u = t;
	}), h = () => {
		d || (d = !0, l?.(), l = null, u = null);
	}, g = () => {
		if (d || f > 0 || s.length > 0) return;
		d = !0;
		let t = yn(e), n = c.length > 0 ? c.join("; ") : "no reachable relays";
		u?.(Error(I(t ? `${n}. ${t}` : n))), l = null, u = null;
	}, _ = r.map(async (e, n) => {
		try {
			console.debug(t.connecting, {
				attempt: n + 1,
				total: r.length
			}), await o.ensureRelay(e, { connectionTimeout: Vt }), console.debug(t.connected, {
				connected: s.length + 1,
				total: r.length
			}), p.add(e), s.push(e), h();
		} catch (n) {
			let i = n instanceof Error ? n.message : String(n);
			console.warn(t.failed, {
				reason: "relay-unreachable",
				failed: c.length + 1,
				total: r.length
			}), c.push(`${e}: ${i}`);
		} finally {
			--f, g();
		}
	});
	Promise.allSettled(_);
	try {
		await m;
	} catch (e) {
		throw Y("relay-connect", i, "failure"), o.destroy(), e;
	}
	n > 0 && f > 0 && await new Promise((e) => {
		let t = !1, r = setTimeout(() => {
			t || (t = !0, e());
		}, n);
		Promise.allSettled(_).then(() => {
			t || (t = !0, clearTimeout(r), e());
		});
	});
	let v = r.filter((e) => p.has(e));
	return c.length > 0 && console.warn(t.partial, {
		connected: v.length,
		failed: c.length
	}), Y("relay-connect", i, "success"), {
		pool: o,
		connectedRelays: v
	};
}
function wn(e) {
	let t = S.normalizeExternalRelayUrl(e);
	if (!t) return null;
	try {
		let e = new URL(t);
		return e.protocol === "wss:" || e.protocol === "ws:" && (e.hostname === "~" || _n(e.hostname)) ? t : null;
	} catch {
		return null;
	}
}
function Tn(e) {
	let t = S.normalizeExternalRelayUrl(e);
	if (!t) return null;
	try {
		let e = new URL(t);
		return e.protocol === "wss:" || e.protocol === "ws:" && _n(e.hostname) ? t : null;
	} catch {
		return null;
	}
}
function En(e) {
	switch (e) {
		case "signer-negotiated":
		case "signer-confirmed-unchanged":
		case "client-initial-fallback":
		case "client-initial-unconfirmed": return e;
		default: return;
	}
}
function Dn(e, t, n) {
	return new Promise((r, i) => {
		let a = setTimeout(() => {
			i(Error(n));
		}, t);
		e.then((e) => {
			clearTimeout(a), r(e);
		}, (e) => {
			clearTimeout(a), i(e);
		});
	});
}
function Y(e, t, n) {
	console.debug("[NIP-46] phase timing", {
		phase: e,
		outcome: n,
		durationMs: Date.now() - t
	});
}
function X() {
	let e = !1, t = null;
	return {
		promise: new Promise((e, n) => {
			t = n;
		}),
		reject: () => {
			e || (e = !0, t?.(/* @__PURE__ */ Error(Qt)));
		}
	};
}
function On(e) {
	return l(e);
}
async function Z(e, t, n = Xt) {
	let r = Date.now(), i;
	try {
		i = await Dn(Promise.race([e.sendRequest("get_public_key", []), t.promise]), n, Zt);
	} catch (e) {
		throw Y("get_public_key", r, e instanceof Error && e.message === Zt ? "timeout" : "failure"), e;
	}
	if (Y("get_public_key", r, "success"), !On(i)) throw Error($t);
	return i;
}
function kn(e) {
	let t = e instanceof Error ? e.message : typeof e == "string" ? e : "";
	return t !== Zt && t !== Qt && t !== $t;
}
async function An(e, t, n) {
	let r = [
		[
			n,
			"",
			xn,
			JSON.stringify(ln)
		],
		[
			n,
			"",
			xn
		],
		[n, ""]
	], i = null;
	for (let n of r) try {
		await Dn(Promise.race([e.sendRequest("connect", n), t.promise]), Xt, "Timed out waiting for reconnect connect response");
		return;
	} catch (e) {
		i = e;
	}
	throw i;
}
async function jn(e, t, n) {
	try {
		return await Z(e, t);
	} catch (e) {
		if (!kn(e)) throw e;
	}
	return console.debug("[NIP-46] get_public_key rejected; retrying after connect"), await An(e, t, n), await Z(e, t);
}
function Q(e) {
	let t = /* @__PURE__ */ new Set(), n = [];
	for (let r of e) {
		let e = wn(r);
		e && !t.has(e) && (t.add(e), n.push(e));
	}
	return n;
}
function Mn(e) {
	let t;
	try {
		t = JSON.parse(e);
	} catch {
		throw console.warn("[NIP-46] switch_relays returned malformed relay list response:", "invalid JSON"), Error(an);
	}
	if (!Array.isArray(t)) throw console.warn("[NIP-46] switch_relays returned malformed relay list response:", "response was not an array"), Error(rn);
	let n = [], r = 0, i = /* @__PURE__ */ new Set();
	for (let e of t) {
		if (typeof e != "string") throw console.warn("[NIP-46] switch_relays returned malformed relay list response:", "relay entry was not a string"), Error(an);
		let t = Tn(e);
		t ? i.has(t) || (i.add(t), n.push(t)) : r += 1;
	}
	return {
		supportedRelays: n,
		parsedCount: t.length,
		unsupportedCount: r
	};
}
function Nn(e) {
	let t = (e instanceof Error ? e.message : typeof e == "string" ? e : "").trim().toLowerCase();
	return t ? t.includes("unsupported") || t.includes("unknown method") || t.includes("not implemented") || t.includes("method not found") || t.includes("no such method") || t.includes("invalid method") || t.includes("no permission") || t.includes("not supported") || t.includes("not allowed") || /^no \S+ method$/.test(t) : !1;
}
function Pn(e) {
	let t = (e instanceof Error ? e.message : typeof e == "string" ? e : "").trim().toLowerCase();
	return t ? t.includes("no permission") || t.includes("permission denied") || t.includes("forbidden") || t.includes("not allowed") : !1;
}
function Fn(e, t, n, r, i) {
	let a = X();
	return {
		signer: U.fromBunker(e, {
			pubkey: t,
			relays: n,
			secret: r
		}, {
			pool: i,
			onauth: a.reject
		}),
		authChallenge: a
	};
}
async function $(e) {
	if (e) try {
		await e.close();
	} catch {}
}
async function In(e, t, n = Yt) {
	return await Z(e, t, n);
}
function Ln(e) {
	return e instanceof Error && e.message === Zt;
}
async function Rn(e, t) {
	let n = Date.now(), r = await Promise.race([e.sendRequest("switch_relays", []).then((e) => ({
		type: "response",
		value: e
	})).catch((e) => ({
		type: "error",
		error: e
	})), new Promise((e) => {
		setTimeout(() => {
			e({ type: "timeout" });
		}, Jt);
	})]);
	if (Y("switch_relays", n, r.type === "response" ? "success" : r.type === "timeout" ? "timeout" : "failure"), r.type === "timeout") return {
		kind: "client-initial-unconfirmed",
		finalRelays: [...t],
		sessionRelayResolution: "client-initial-unconfirmed"
	};
	if (r.type === "error") {
		if (Nn(r.error)) return console.warn("[NIP-46] switch_relays not supported by signer", {
			method: "switch_relays",
			outcome: "method-unsupported",
			reason: "method-unsupported"
		}), {
			kind: "method-unsupported",
			finalRelays: [...t],
			sessionRelayResolution: "client-initial-fallback"
		};
		throw r.error;
	}
	if (JSON.parse(r.value) === null) return {
		kind: "signer-confirmed-unchanged",
		finalRelays: [...t],
		sessionRelayResolution: "signer-confirmed-unchanged"
	};
	let i = Mn(r.value);
	if (console.debug("[NIP-46] switch_relays response classified", {
		method: "switch_relays",
		parsed: i.parsedCount,
		supported: i.supportedRelays.length,
		unsupported: i.unsupportedCount
	}), i.supportedRelays.length === 0) throw Error(on);
	return {
		kind: "signer-negotiated",
		finalRelays: i.supportedRelays,
		sessionRelayResolution: "signer-negotiated"
	};
}
var zn = class {
	bunkerSigner = null;
	signerAdapter = null;
	userPubkey = null;
	clientSecretKeyHex = null;
	pool = null;
	currentSession = null;
	persistenceBinding = null;
	operationPromise = null;
	retiredRuntimeClosers = /* @__PURE__ */ new Set();
	identityMismatchHandler = null;
	sessionEpoch = 0;
	adoptRuntime(e, t) {
		this.pool = e.pool, this.clientSecretKeyHex = e.clientSecretKeyHex, this.userPubkey = e.userPubkey, this.bunkerSigner = e.bunkerSigner, this.signerAdapter = e.signerAdapter, this.sessionEpoch += 1, this.setCurrentSession(t);
	}
	setCurrentSession(e) {
		this.currentSession = e ? {
			clientSecretKeyHex: e.clientSecretKeyHex,
			remoteSignerPubkey: e.remoteSignerPubkey,
			relays: [...e.relays],
			userPubkey: e.userPubkey,
			relayResolution: En(e.relayResolution)
		} : null;
	}
	updateCurrentSessionFromRuntime() {
		this.bunkerSigner && this.userPubkey && this.clientSecretKeyHex && this.setCurrentSession({
			clientSecretKeyHex: this.clientSecretKeyHex,
			remoteSignerPubkey: this.currentSession?.remoteSignerPubkey ?? this.bunkerSigner.bp.pubkey,
			relays: this.currentSession?.relays ? [...this.currentSession.relays] : [...this.bunkerSigner.bp.relays],
			userPubkey: this.userPubkey,
			relayResolution: this.currentSession?.relayResolution
		});
	}
	writeSessionSnapshot(e, t, n) {
		e.setItem(k(t), JSON.stringify(n));
	}
	writeSession(e, t) {
		this.currentSession && this.writeSessionSnapshot(e, t, this.currentSession);
	}
	async closeRuntimeResources() {
		let e = this.snapshotRuntime();
		this.detachRuntimeIfCurrent(e), await Promise.all([this.closeRuntimeSnapshot(e), ...Array.from(this.retiredRuntimeClosers, (e) => e())]);
	}
	snapshotRuntime() {
		return {
			pool: this.pool,
			bunkerSigner: this.bunkerSigner,
			signerAdapter: this.signerAdapter,
			userPubkey: this.userPubkey,
			clientSecretKeyHex: this.clientSecretKeyHex
		};
	}
	isCurrentRuntime(e) {
		return this.pool === e.pool && this.bunkerSigner === e.bunkerSigner && this.signerAdapter === e.signerAdapter && this.userPubkey === e.userPubkey && this.clientSecretKeyHex === e.clientSecretKeyHex;
	}
	isCurrentSessionSnapshot(e) {
		let t = this.currentSession;
		return t !== null && t.clientSecretKeyHex === e.clientSecretKeyHex && t.remoteSignerPubkey === e.remoteSignerPubkey && t.userPubkey === e.userPubkey && t.relayResolution === e.relayResolution && t.relays.length === e.relays.length && t.relays.every((t, n) => t === e.relays[n]);
	}
	isCurrentPersistenceBinding(e) {
		let t = this.persistenceBinding;
		return !e || !t ? e === t : t.storage === e.storage && t.pubkeyHex === e.pubkeyHex;
	}
	detachRuntimeIfCurrent(e) {
		return this.isCurrentRuntime(e) ? (this.bunkerSigner = null, this.signerAdapter = null, this.userPubkey = null, this.clientSecretKeyHex = null, this.pool = null, e) : null;
	}
	async closeRuntimeSnapshot(e) {
		if (e.signerAdapter?.cancelPendingRequests(), e.bunkerSigner) try {
			await e.bunkerSigner.close();
		} catch {}
		e.pool?.destroy();
	}
	async retireRuntimeSnapshot(e) {
		if (!e.signerAdapter?.hasPendingRequests) {
			await this.closeRuntimeSnapshot(e);
			return;
		}
		let t = e.signerAdapter.retire(), n = null, r, i = () => (n ||= (clearTimeout(r), this.retiredRuntimeClosers.delete(i), this.closeRuntimeSnapshot(e)), n);
		this.retiredRuntimeClosers.add(i), r = setTimeout(() => {
			i().catch(() => {
				console.warn("[NIP-46] retired runtime cleanup failed");
			});
		}, Ht), t.then(i).catch(() => {
			console.warn("[NIP-46] retired runtime cleanup failed");
		});
	}
	isCurrentSession(e, t = e.userPubkey) {
		return this.currentSession !== null && t === e.userPubkey && this.currentSession.userPubkey === e.userPubkey && this.currentSession.remoteSignerPubkey === e.remoteSignerPubkey && this.currentSession.clientSecretKeyHex === e.clientSecretKeyHex;
	}
	getRuntimeSignerForSession(e) {
		return !this.currentSession || this.currentSession.userPubkey !== e || this.userPubkey !== e || !this.bunkerSigner || !this.signerAdapter ? null : this.signerAdapter;
	}
	async rebuildConnection() {
		if (!this.currentSession) return !1;
		let e = {
			...this.currentSession,
			relays: [...this.currentSession.relays]
		}, t = this.snapshotRuntime(), n = this.persistenceBinding ? { ...this.persistenceBinding } : null, r = this.sessionEpoch, i = null, a = null, o = Date.now(), s = async () => {
			if (a) {
				try {
					await a.close();
				} catch {}
				a = null;
			}
			i?.destroy(), i = null;
		}, c = async () => {
			if (await s(), r !== this.sessionEpoch || !this.isCurrentSessionSnapshot(e) || !this.isCurrentRuntime(t)) return !1;
			let n = this.detachRuntimeIfCurrent(t);
			return n && await this.closeRuntimeSnapshot(n), !1;
		};
		try {
			let s = v(e.clientSecretKeyHex), l = Q(e.relays), { pool: u } = await J(l);
			i = u;
			let d = X();
			a = U.fromBunker(s, {
				pubkey: e.remoteSignerPubkey,
				relays: l,
				secret: null
			}, {
				pool: u,
				onauth: d.reject
			});
			let f = new Sn(a, e.userPubkey);
			if (await jn(a, d, e.remoteSignerPubkey) !== e.userPubkey) throw Error(en);
			let p = {
				...e,
				relays: l
			};
			return r !== this.sessionEpoch || !this.isCurrentSessionSnapshot(e) || !this.isCurrentRuntime(t) || !this.isCurrentPersistenceBinding(n) ? await c() : (n && this.writeSessionSnapshot(n.storage, n.pubkeyHex, p), this.adoptRuntime({
				pool: i,
				clientSecretKeyHex: e.clientSecretKeyHex,
				userPubkey: e.userPubkey,
				bunkerSigner: a,
				signerAdapter: f
			}, p), i = null, a = null, await this.retireRuntimeSnapshot(t), Y("rebuild", o, "success"), console.debug("[NIP-46] rebuildConnection: pool + BunkerSigner rebuilt"), !0);
		} catch (t) {
			return Y("rebuild", o, "failure"), await c(), console.warn("[NIP-46] rebuildConnection candidate verification failed"), t instanceof Error && t.message === en && r === this.sessionEpoch && this.isCurrentSessionSnapshot(e) && this.notifyIdentityMismatch(e.userPubkey), !1;
		}
	}
	notifyIdentityMismatch(e) {
		let t = this.identityMismatchHandler;
		t && (console.warn("[NIP-46] saved session identity mismatch", { reason: "identity-mismatch" }), (async () => {
			try {
				await t(e);
			} catch {
				console.error("[NIP-46] identity mismatch handler failed", { reason: "unexpected" });
			}
		})());
	}
	setIdentityMismatchHandler(e) {
		this.identityMismatchHandler = e;
	}
	async runOperation(e) {
		let t = (async () => await e())();
		this.operationPromise = t;
		try {
			return await t;
		} finally {
			this.operationPromise === t && (this.operationPromise = null);
		}
	}
	bindSessionPersistence(e, t) {
		this.persistenceBinding = {
			storage: e,
			pubkeyHex: t
		};
	}
	hasRecoverableSession() {
		return this.currentSession !== null;
	}
	async connect(e, t = 3e4) {
		console.debug("[NIP-46] bunker connect parsing", { stage: "start" });
		let n = await Ze(e);
		if (!n) throw Error("Invalid bunker URL");
		if (console.debug("[NIP-46] bunker connect input parsed", {
			stage: "parsed",
			relays: n.relays.length
		}), n.relays.length === 0) throw Error("No relays specified in bunker URL");
		let r = Date.now(), i = null, a = null, o = async () => {
			if (a) {
				try {
					await a.close();
				} catch {}
				a = null;
			}
			i?.destroy(), i = null;
		};
		try {
			let e = Q(n.relays), { pool: o } = await J(e);
			i = o;
			let s = {
				...n,
				relays: e
			}, c = It(), l = x(c), u = X();
			a = U.fromBunker(c, s, {
				pool: o,
				onauth: u.reject
			});
			let d = s.secret || "", f = d.includes(" ") ? d.replace(/ /g, "+") : d, p = (f === d ? [d] : [d, f]).flatMap((e) => [
				[
					s.pubkey,
					e,
					xn,
					JSON.stringify(ln)
				],
				[
					s.pubkey,
					e,
					xn
				],
				[s.pubkey, e]
			]), m = null, h = null;
			for (let e of p) {
				let n = !1;
				try {
					await Dn(Promise.race([a.sendRequest("connect", e), u.promise]), t, "Bunker did not respond. The relay is connected but the remote signer may be offline or the secret may have expired."), n = !0;
					try {
						h = await Z(a, u), m = null;
					} catch (e) {
						if (Pn(e)) {
							let e = await Dn(Promise.race([a.signEvent({
								kind: 1,
								content: "",
								tags: [],
								created_at: Math.floor(Date.now() / 1e3)
							}), u.promise]), t, "Timed out waiting for sign_event pubkey fallback response");
							if (!On(e.pubkey)) throw Error($t);
							h = e.pubkey, m = null;
						} else m = e;
					}
					break;
				} catch (e) {
					if (m = e, n) break;
				}
			}
			if (m || !h) throw m ?? /* @__PURE__ */ Error("Failed to resolve user public key after connect");
			let g = new Sn(a, h);
			return await this.closeRuntimeResources(), this.adoptRuntime({
				pool: i,
				clientSecretKeyHex: l,
				userPubkey: h,
				bunkerSigner: a,
				signerAdapter: g
			}, {
				clientSecretKeyHex: l,
				remoteSignerPubkey: s.pubkey,
				relays: [...e],
				userPubkey: h
			}), i = null, a = null, Y("bunker-connect", r, "success"), h;
		} catch (e) {
			throw Y("bunker-connect", r, "failure"), await o(), e;
		}
	}
	async startNostrConnect(e, t = Ut) {
		let n = Q(e);
		if (n.length === 0) throw Error(P.nostrConnectRelayRequired);
		let r = It(), i = x(r), a = Lt(r), o = x(It()), s = $e({
			clientPubkey: a,
			relays: n,
			secret: o,
			perms: [...bn],
			...ln
		}), c = !1, l = !1, f = !1, p = null, m = null, h = null, g = null, _ = null, v = [], y = null, b = null, S = null, C = null, w = () => Error(P.nostrConnectCancelled), T = async () => {
			if (!c) {
				if (c = !0, p?.close(), p = null, y &&= (clearTimeout(y), null), b) {
					let e = b;
					b = null, e(w());
				}
				await $(m), m = null, await $(h), h = null, await $(g), g = null, _?.destroy(), _ = null;
			}
		}, ee = null, E = null, D = null, O = null, k = null, A = null, j = !1, M = !1, N = () => {
			if (l) throw w();
		}, te = async () => {
			N(), await new Promise((e, t) => {
				b = t, y = setTimeout(() => {
					y = null, b = null, e();
				}, Kt);
			});
		}, ne = async (e, t) => {
			let n = Date.now() + Wt;
			for (;;) {
				N();
				let i = Fn(r, e, v, o, t), a = i.signer;
				m = a;
				try {
					let e = await In(a, i.authChallenge, Gt);
					return N(), {
						signer: a,
						userPubkey: e
					};
				} catch (e) {
					if (m === a && (m = null), await $(a), l) throw w();
					if (!Ln(e)) throw e;
					let t = e instanceof Error ? e : Error(String(e));
					if (Date.now() + 1e3 + 5e3 > n) throw t;
					console.debug("[NIP-46] get_public_key readiness timed out; retrying on initial ready relay"), await te();
				}
			}
		}, re = async (e, t, n) => {
			let i = n.some((e) => vn(e)), a = null, s = null;
			try {
				a = await J(n, dn), N();
			} catch (e) {
				throw l ? w() : i ? Error(sn) : e;
			}
			let c = Date.now() + Wt;
			for (;;) try {
				let i = Fn(r, e, n, o, a.pool);
				s = i.signer;
				let c = await In(s, i.authChallenge);
				if (N(), c !== t) throw console.warn("[NIP-46] negotiated final relay identity mismatch", { reason: "identity-mismatch" }), Error(cn);
				return {
					pool: a.pool,
					signer: s,
					userPubkey: c
				};
			} catch (e) {
				if (l) throw w();
				if (console.warn("[NIP-46] negotiated final relay verification failed", { reason: "relay-negotiation-invalid" }), await $(s), s = null, !Ln(e) || Date.now() + 1e3 + 5e3 > c) throw a.pool.destroy(), Error(cn);
				console.debug("[NIP-46] negotiated final relay readiness timed out; retrying"), await te();
			}
		}, ie = new Promise((e, t) => {
			ee = e, E = t;
		}), F = new Promise((e, t) => {
			D = e, O = t;
		}), I = () => {
			j || (j = !0, D?.(), D = null, O = null);
		}, L = (e) => {
			j || (j = !0, O?.(e), D = null, O = null);
		}, ae = () => {
			M || (M = !0, k?.(), k = null, A = null);
		}, R = (e) => {
			M || (M = !0, A?.(e), k = null, A = null);
		}, z = new Promise((e, t) => {
			k = e, A = t;
		}), oe = {
			get connectionUri() {
				return s;
			},
			ready: F,
			handshakeStarted: z,
			completion: ie,
			cancel: async () => {
				if (l) return;
				l = !0, await T();
				let e = w();
				L(e), R(e), E?.(e);
			}
		};
		return F.catch(() => void 0), z.catch(() => void 0), ie.catch(() => void 0), (async () => {
			try {
				let e = await J(n, un, qt);
				if (l) {
					e.pool.destroy();
					return;
				}
				if (_ = e.pool, v = [...e.connectedRelays], s = $e({
					clientPubkey: a,
					relays: v,
					secret: o,
					perms: [...bn],
					...ln
				}), l) {
					let e = w();
					await T(), L(e);
					let t = E;
					t && t(e);
					return;
				}
				S = Date.now(), p = _.subscribe(v, {
					kinds: [d.NostrConnect],
					"#p": [a],
					limit: 0
				}, {
					oneose: () => {
						console.debug("[NIP-46] EOSE received on handshake subscription; subscription remains open awaiting signer response");
					},
					onevent: async (e) => {
						if (console.debug("[NIP-46] handshake response received", { stage: "response-received" }), l) console.debug("[NIP-46] EVENT ignored: already settled");
						else {
							ae();
							try {
								console.debug("[NIP-46] handshake decrypt started", { stage: "decrypt-start" });
								let t = u.getConversationKey(r, e.pubkey), n;
								try {
									n = u.decrypt(e.content, t), console.debug("[NIP-46] handshake decrypt succeeded", { stage: "decrypt-success" });
								} catch (e) {
									throw console.debug("[NIP-46] handshake decrypt failed", {
										stage: "decrypt-failure",
										reason: "unexpected"
									}), e;
								}
								let a = JSON.parse(n).result, s = a === "ack", c = a === o;
								if (!c && !s) {
									console.debug("[NIP-46] handshake response rejected", {
										stage: "response-rejected",
										reason: "unexpected"
									});
									return;
								}
								s && !c && console.warn("[NIP-46] handshake accepted compatibility acknowledgement", { stage: "compatibility-ack" }), console.debug("[NIP-46] handshake accepted", { stage: "accepted" }), f = !0, C = Date.now(), S !== null && Y("handshake-wait", S, "success"), p?.close(), p = null;
								let d = _;
								if (!d) throw Error(P.handshakePoolUnavailable);
								let y = await ne(e.pubkey, d);
								m = y.signer;
								let b = y.userPubkey, x = await Rn(m, v);
								N();
								let w = x.finalRelays, T = [...w], E = _, D = m;
								if (x.kind === "signer-negotiated") {
									let t = _, n = await re(e.pubkey, b, w);
									E = n.pool, _ = E, D = n.signer, h = D, b = n.userPubkey, T = [...w], await $(m), m = null, t && t !== E && t.destroy();
								}
								if (x.kind === "client-initial-unconfirmed") {
									let t = E;
									if (!t) throw Error("Nostr Connect handshake pool is unavailable");
									console.debug("[NIP-46] switch_relays timed out; verifying signer on initial ready relay"), await $(m), m = null;
									let n = Fn(r, e.pubkey, w, o, t);
									if (g = n.signer, D = g, b = await In(D, n.authChallenge), N(), b !== y.userPubkey) throw Error(cn);
									T = [...w];
								}
								N(), await this.closeRuntimeResources(), this.adoptRuntime({
									pool: E,
									clientSecretKeyHex: i,
									userPubkey: b,
									bunkerSigner: D,
									signerAdapter: new Sn(D, b)
								}, {
									clientSecretKeyHex: i,
									remoteSignerPubkey: e.pubkey,
									relays: [...T],
									userPubkey: b,
									relayResolution: x.sessionRelayResolution
								}), D === g && (g = null), D === h && (h = null), D === m && (m = null), C !== null && Y("post-handshake", C, "success"), console.debug("[NIP-46] auth completed after identity verification"), l = !0, ee?.(b);
							} catch (e) {
								if (l) {
									await T();
									return;
								}
								C !== null && Y("post-handshake", C, "failure"), console.debug("[NIP-46] Nostr Connect candidate verification failed"), l = !0, await T(), E?.(e);
							}
						}
					},
					onclose: async () => {
						if (console.debug("[NIP-46] handshake subscription closed", { stage: "closed" }), l || f) return;
						l = !0, await T();
						let e = Error(P.nostrConnectTimeout);
						R(e), E?.(e);
					},
					maxWait: t
				}), I();
			} catch (e) {
				if (l) return;
				l = !0, await T(), L(e), R(e);
				let t = E;
				t && t(e);
			}
		})(), oe;
	}
	async reconnect(e) {
		let t = {
			...e,
			relays: [...e.relays]
		}, n = null, r = null, i = Date.now(), a = async () => {
			if (r) {
				try {
					await r.close();
				} catch {}
				r = null;
			}
			n?.destroy(), n = null;
		};
		try {
			let e = v(t.clientSecretKeyHex), a = Q(t.relays), { pool: o } = await J(a);
			n = o;
			let s = {
				pubkey: t.remoteSignerPubkey,
				relays: a,
				secret: null
			}, c = X();
			if (r = U.fromBunker(e, s, {
				pool: o,
				onauth: c.reject
			}), await jn(r, c, s.pubkey) !== t.userPubkey) throw Error(en);
			let l = new Sn(r, t.userPubkey), u = {
				...t,
				relays: a
			};
			return await this.closeRuntimeResources(), this.adoptRuntime({
				pool: n,
				clientSecretKeyHex: t.clientSecretKeyHex,
				userPubkey: t.userPubkey,
				bunkerSigner: r,
				signerAdapter: l
			}, u), n = null, r = null, Y("reconnect", i, "success"), console.debug("[NIP-46] reconnect: session restored after live identity verification"), t.userPubkey;
		} catch (e) {
			throw Y("reconnect", i, "failure"), await a(), e;
		}
	}
	async restoreSessionInBackground(e, t) {
		let n = Q(e.relays);
		if (n.length === 0) throw Error(I("no reachable relays"));
		this.operationPromise = null, this.sessionEpoch += 1;
		let r = this.closeRuntimeResources();
		return this.setCurrentSession({
			...e,
			relays: n
		}), this.persistenceBinding = t ? { ...t } : null, this.runOperation(() => this.rebuildConnection()).catch(() => {
			console.warn("[NIP-46] background session restore failed", { reason: "unexpected" });
		}), await r, e.userPubkey;
	}
	async disconnect() {
		this.operationPromise = null, this.sessionEpoch += 1, this.setCurrentSession(null), this.persistenceBinding = null, await this.closeRuntimeResources();
	}
	isConnected() {
		return this.bunkerSigner !== null && this.userPubkey !== null;
	}
	async ensureConnection() {
		return this.operationPromise ? await this.operationPromise : await this.runOperation(() => this.rebuildConnection());
	}
	async getSignerForSession(e) {
		let t = this.currentSession;
		if (!t || t.userPubkey !== e) return null;
		let n = {
			clientSecretKeyHex: t.clientSecretKeyHex,
			remoteSignerPubkey: t.remoteSignerPubkey,
			userPubkey: t.userPubkey
		}, r = this.operationPromise, i = null;
		if (r) try {
			i = await r;
		} catch {
			i = !1, console.warn("[NIP-46] signer request: pending operation failed", { reason: "unexpected" });
		}
		if (!this.isCurrentSession(n, e)) return null;
		if (!r || i === !0) {
			let t = this.getRuntimeSignerForSession(e);
			if (t) return t;
		}
		console.debug("[NIP-46] signer request: starting limited reconnect");
		let a;
		try {
			a = await this.ensureConnection();
		} catch {
			return console.error("[NIP-46] signer request: reconnect threw unexpectedly", { reason: "unexpected" }), null;
		}
		if (!a) return console.warn("[NIP-46] signer request: limited reconnect failed"), null;
		if (!this.isCurrentSession(n, e)) return null;
		let o = this.getRuntimeSignerForSession(e);
		return o && console.debug("[NIP-46] signer request: limited reconnect succeeded"), o;
	}
	getSigner() {
		return this.signerAdapter;
	}
	getUserPubkey() {
		return this.userPubkey;
	}
	saveSession(e, t) {
		this.bindSessionPersistence(e, t), this.currentSession || this.updateCurrentSessionFromRuntime(), this.writeSession(e, this.persistenceBinding?.pubkeyHex);
	}
	static loadSession(e, t) {
		let n = e.getItem(k(t));
		if (!n) return null;
		try {
			let e = JSON.parse(n);
			return !e || typeof e.clientSecretKeyHex != "string" || typeof e.remoteSignerPubkey != "string" || !Array.isArray(e.relays) || typeof e.userPubkey != "string" ? null : {
				clientSecretKeyHex: e.clientSecretKeyHex,
				remoteSignerPubkey: e.remoteSignerPubkey,
				relays: Q(e.relays.filter((e) => typeof e == "string")),
				userPubkey: e.userPubkey,
				...En(e.relayResolution) ? { relayResolution: En(e.relayResolution) } : {}
			};
		} catch {
			return null;
		}
	}
	static clearSession(e, t) {
		e.removeItem(k(t));
	}
}, Bn = new zn();
export { Xe as a, re as c, j as d, k as f, Bt as i, ne as l, A as m, Bn as n, P as o, O as p, Q as r, F as s, zn as t, ie as u };
