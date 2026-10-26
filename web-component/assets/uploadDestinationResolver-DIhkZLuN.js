import { i as e } from "./rolldown-runtime-CwxnZyOB.js";
import { i as t } from "./appRuntimeEnvironment-BvtUCHcA.js";
import { o as n, u as r } from "./base-CVnVyhoG.js";
import { l as i, n as a } from "./relayConfigUtils-DD5f1UAM.js";
import { t as o } from "./ipaddr-DyB8nsdz.js";
import { i as s, n as c, r as l, t as u } from "./uploadOperation-BVOBq-hD.js";
import { a as d, d as f, f as p, h as m, i as h, n as ee, o as g, p as te, r as _, t as ne, u as re, v as ie } from "./signedEventResultValidator-vNb8KnFy.js";
import { r as v } from "./authStore.svelte-CoGdd5_Z.js";
import { Ct as ae, bt as oe, h as se, wt as ce, xt as y, yt as le } from "./appUtils-C7IXsQBk.js";
import { t as ue } from "./embedMessageTrustGate-CQmT7rtK.js";
import { c as b, n as de } from "./nip46Service-DpHqlqsg.js";
import { c as fe, o as pe } from "./legacyImportMarkers-CZ4J2IrE.js";
import { t as me } from "./fileUtils-DutI8IDz.js";
var he = "__ehagaki_global__", x = {
	maxUploadSize: null,
	supportedMimeTypes: [],
	supportsDelete: !1,
	supportsList: !1,
	supportsMirror: !1,
	supportsMediaOptimization: !1,
	authRequired: !0,
	source: "preset"
}, S = {
	id: "files-sovbit-host",
	name: "files.sovbit.host",
	protocol: "blossom",
	serverUrl: "https://files.sovbit.host",
	capabilities: {
		...x,
		supportedMimeTypes: ["image/*", "video/*"]
	}
};
function C(e) {
	try {
		let t = new URL(e).toString().replace(/\/$/, "");
		return [
			S.serverUrl,
			`${S.serverUrl}/upload`,
			`${S.serverUrl}/api/v2/media`
		].includes(t);
	} catch {
		return !1;
	}
}
function w(e) {
	if (e.protocol !== "nip96" || !C(e.serverUrl) || e.resolvedUploadUrl && !C(e.resolvedUploadUrl) || e.nip96ServerUrl && !C(e.nip96ServerUrl)) return e;
	let { resolvedUploadUrl: t, nip96ServerUrl: n, nip96UrlMode: r, ...i } = e;
	return {
		...i,
		name: S.name,
		protocol: "blossom",
		serverUrl: S.serverUrl,
		presetId: S.id,
		capabilities: {
			...S.capabilities,
			supportedMimeTypes: [...S.capabilities.supportedMimeTypes]
		},
		auth: { type: "blossom-bud11" }
	};
}
var ge = {
	"https://nostr.build/api/v2/nip96/upload": "nostr-build",
	"https://share.yabu.me/api/v2/media": "share-yabu-me",
	"https://nostpic.com/api/v2/media": "nostpic-com",
	"https://nostrcheck.me/api/v2/media": "nostrcheck-me"
}, _e = {
	"https://share.yabu.me/api/v2/media": "https://yabu.me/api/v2/media",
	"https://nostrcheck.me/api/v2/media": "https://cdn.nostrcheck.me/",
	"https://nostr.build/api/v2/nip96/upload": "https://nostr.build/api/v2/nip96/upload",
	"https://nostpic.com/api/v2/media": "https://nostpic.com/api/v2/media"
};
function T(e) {
	let t = ce.find((t) => t.url === e);
	if (!t) throw Error(`Missing NIP-96 upload endpoint preset: ${e}`);
	return {
		id: ge[t.url] ?? "custom",
		name: t.label,
		protocol: "nip96",
		serverUrl: t.url,
		resolvedUploadUrl: _e[t.url] ?? t.url,
		nip96ServerUrl: new URL(t.url).origin,
		capabilities: {
			...x,
			supportedMimeTypes: ["image/*", "video/*"],
			source: "preset"
		}
	};
}
function ve(e) {
	if (!e) return null;
	try {
		return new URL(k(e)).host || null;
	} catch {
		return null;
	}
}
function E(e) {
	let t = A(e);
	return t ? t.name : e.presetId && e.presetId !== "custom" ? ve(e.serverUrl) ?? e.fallbackName?.trim() ?? k(e.serverUrl) ?? "Custom NIP-96" : ve(e.resolvedUploadUrl) ?? ve(e.serverUrl) ?? e.fallbackName?.trim() ?? k(e.serverUrl) ?? "Custom NIP-96";
}
function ye(e) {
	return e === "ja" ? ["share-yabu-me", "blossom-band"] : ["blossom-band", "share-yabu-me"];
}
function be(e) {
	for (let t of ye(e)) {
		let e = D.find((e) => e.id === t);
		if (e) return e;
	}
	return D[0] ?? null;
}
var D = [
	T("https://share.yabu.me/api/v2/media"),
	{
		id: "cdn-nostrcheck-me",
		name: "cdn.nostrcheck.me",
		protocol: "blossom",
		serverUrl: "https://cdn.nostrcheck.me",
		capabilities: { ...x }
	},
	T("https://nostrcheck.me/api/v2/media"),
	{
		id: "blossom-band",
		name: "blossom.band",
		protocol: "blossom",
		serverUrl: "https://blossom.band",
		capabilities: {
			...x,
			supportsDelete: !0,
			supportsList: !1
		}
	},
	{
		id: "nostr-download",
		name: "nostr.download",
		protocol: "blossom",
		serverUrl: "https://nostr.download",
		capabilities: { ...x }
	},
	{
		id: "blossom-primal-net",
		name: "blossom.primal.net",
		protocol: "blossom",
		serverUrl: "https://blossom.primal.net",
		capabilities: { ...x }
	},
	T("https://nostr.build/api/v2/nip96/upload"),
	T("https://nostpic.com/api/v2/media"),
	S
];
function xe() {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `upload-destination-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function O(e) {
	return e || "__ehagaki_global__";
}
function k(e) {
	let t = e.trim();
	if (!t) return "";
	try {
		let e = new URL(t);
		return e.hash = "", e.toString().replace(/\/$/, "");
	} catch {
		return t;
	}
}
function Se(e) {
	if (!e) return null;
	if (C(e)) return S;
	let t = k(e);
	return D.find((e) => e !== S && k(e.serverUrl) === t) || (D.find((e) => e.resolvedUploadUrl && k(e.resolvedUploadUrl) === t) ?? null);
}
function A(e) {
	if (!e.presetId || e.presetId === "custom") return null;
	let t = D.find((t) => t.id === e.presetId);
	if (!t || t.protocol !== e.protocol) return null;
	let n = k(e.serverUrl);
	return k(t.serverUrl) === n || t.resolvedUploadUrl !== void 0 && k(t.resolvedUploadUrl) === n ? t : null;
}
function Ce(e) {
	let t = e.now ?? Date.now(), n = k(e.preset.serverUrl);
	return {
		id: xe(),
		pubkeyHex: e.pubkeyHex ?? null,
		name: E({
			serverUrl: n,
			resolvedUploadUrl: e.preset.resolvedUploadUrl,
			fallbackName: e.preset.name,
			protocol: e.preset.protocol,
			presetId: e.preset.id
		}),
		protocol: e.preset.protocol,
		serverUrl: n,
		...e.preset.resolvedUploadUrl ? { resolvedUploadUrl: e.preset.resolvedUploadUrl } : {},
		...e.preset.nip96ServerUrl ? {
			nip96ServerUrl: e.preset.nip96ServerUrl,
			nip96UrlMode: "direct"
		} : {},
		presetId: e.preset.id,
		isDefault: e.isDefault ?? !1,
		enabled: !0,
		createdAt: t,
		updatedAt: t,
		capabilities: { ...e.preset.capabilities },
		auth: { type: e.preset.protocol === "blossom" ? "blossom-bud11" : "nip98" },
		schemaVersion: 1
	};
}
function j(e) {
	let t = e.endpoint.trim(), n = t ? Se(t) : be(e.locale);
	if (n) return Ce({
		preset: n,
		pubkeyHex: e.pubkeyHex,
		isDefault: !0,
		now: e.now
	});
	let r = t || ae(e.locale), i = e.now ?? Date.now();
	return {
		id: xe(),
		pubkeyHex: e.pubkeyHex ?? null,
		name: E({
			serverUrl: r,
			fallbackName: "Custom NIP-96"
		}),
		protocol: "nip96",
		serverUrl: k(r),
		resolvedUploadUrl: r,
		presetId: "custom",
		isDefault: !0,
		enabled: !0,
		createdAt: i,
		updatedAt: i,
		capabilities: {
			...x,
			supportedMimeTypes: ["image/*", "video/*"]
		},
		auth: { type: "nip98" },
		schemaVersion: 1
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/embedIndexedDbService.ts
var we = 1e3, Te = /* @__PURE__ */ new Set(["uploadDestinations"]);
function Ee() {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `idb-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function De(e) {
	return typeof e == "string" && Te.has(e);
}
function Oe(e) {
	return typeof e == "string" && e.trim().length > 0;
}
function ke(e) {
	return Array.isArray(e) && e.every((e) => typeof e == "string");
}
function Ae(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	return (typeof t.maxUploadSize == "number" || t.maxUploadSize === null) && ke(t.supportedMimeTypes) && typeof t.supportsDelete == "boolean" && typeof t.supportsList == "boolean" && typeof t.supportsMirror == "boolean" && typeof t.supportsMediaOptimization == "boolean" && typeof t.authRequired == "boolean" && typeof t.source == "string" && (t.lastCheckedAt === void 0 || typeof t.lastCheckedAt == "number");
}
function je(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e, n = t.auth;
	return typeof t.id == "string" && (typeof t.pubkeyHex == "string" || t.pubkeyHex === null) && typeof t.scopeKey == "string" && (t.scopeKey === "__ehagaki_global__" || t.scopeKey === t.pubkeyHex) && typeof t.name == "string" && typeof t.protocol == "string" && typeof t.serverUrl == "string" && (t.resolvedUploadUrl === void 0 || typeof t.resolvedUploadUrl == "string") && (t.nip96ServerUrl === void 0 || typeof t.nip96ServerUrl == "string") && (t.nip96UrlMode === void 0 || t.nip96UrlMode === "direct" || t.nip96UrlMode === "discovery") && (t.presetId === void 0 || typeof t.presetId == "string") && typeof t.isDefault == "boolean" && typeof t.enabled == "boolean" && (t.sortIndex === void 0 || typeof t.sortIndex == "number") && typeof t.createdAt == "number" && typeof t.updatedAt == "number" && Ae(t.capabilities) && typeof n == "object" && !!n && typeof n.type == "string" && t.schemaVersion === 1;
}
function Me(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	return typeof t.timestamp != "number" || !De(t.store) || !Oe(t.scopeKey) || t.applied !== void 0 && typeof t.applied != "boolean" ? !1 : t.records === void 0 ? !0 : Array.isArray(t.records) ? t.store === "uploadDestinations" && t.records.every(je) : !1;
}
function Ne(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	return typeof t.timestamp == "number" && typeof t.code == "string" && t.code.trim().length > 0 && (t.message === void 0 || typeof t.message == "string") && (t.store === void 0 || De(t.store)) && (t.scopeKey === void 0 || Oe(t.scopeKey));
}
var Pe = new class {
	windowObj;
	console;
	requestTimeoutMs;
	trustedParentOrigin = null;
	isListening = !1;
	pendingRequests = /* @__PURE__ */ new Map();
	constructor(e = typeof window < "u" ? window : {}, t = typeof window < "u" ? window.console : {}, n = we) {
		this.windowObj = e, this.console = t, this.requestTimeoutMs = n;
	}
	initialize(e = {}) {
		if (!this.isInIframe()) return !1;
		let t = e.parentOrigin ?? te(e.locationSearch ?? this.windowObj.location?.search);
		return t ? (this.trustedParentOrigin = t, this.ensureMessageListener(), !0) : !1;
	}
	async getUploadDestinationsSnapshot(e) {
		let t = await this.sendRequest("idb.getSnapshot", {
			store: "uploadDestinations",
			scopeKey: e
		});
		return t.records === void 0 ? null : t.records;
	}
	async setUploadDestinationsSnapshot(e, t) {
		return this.sendRequest("idb.setSnapshot", {
			store: "uploadDestinations",
			scopeKey: e,
			records: t
		});
	}
	async sendRequest(e, t) {
		if (!this.windowObj || !this.isInIframe() || !this.trustedParentOrigin) return Promise.reject({
			timestamp: Date.now(),
			code: "idb_parent_unavailable",
			message: "parent indexedDB storage is not available",
			store: t.store,
			scopeKey: t.scopeKey
		});
		let n = Ee(), r = new Promise((e, r) => {
			let i = setTimeout(() => {
				this.pendingRequests.delete(n), r({
					timestamp: Date.now(),
					code: "idb_request_timeout",
					message: "parent indexedDB request timed out",
					store: t.store,
					scopeKey: t.scopeKey
				});
			}, this.requestTimeoutMs);
			this.pendingRequests.set(n, {
				resolve: e,
				reject: r,
				timeoutId: i
			});
		});
		try {
			this.windowObj.parent.postMessage({
				namespace: f,
				version: 1,
				type: e,
				requestId: n,
				payload: t
			}, this.trustedParentOrigin);
		} catch (e) {
			let r = this.pendingRequests.get(n);
			return r && (clearTimeout(r.timeoutId), this.pendingRequests.delete(n)), Promise.reject({
				timestamp: Date.now(),
				code: "idb_post_message_failed",
				message: e instanceof Error ? e.message : String(e),
				store: t.store,
				scopeKey: t.scopeKey
			});
		}
		return r.catch((e) => {
			throw this.console.warn("親 IndexedDB request に失敗:", e), e;
		});
	}
	handleMessage = (e) => {
		let t = ue(e, this.windowObj, this.trustedParentOrigin);
		if (!t || t.type !== "idb.result" && t.type !== "idb.error") return;
		if (p(t.type) && !m(t.requestId)) {
			this.console.warn("requestId がない idb response を無視:", t);
			return;
		}
		if (!t.requestId) return;
		let n = this.pendingRequests.get(t.requestId);
		if (n) {
			if (t.type === "idb.result") {
				if (!Me(t.payload)) {
					this.console.warn("不正な idb.result payload を無視:", t.payload);
					return;
				}
				clearTimeout(n.timeoutId), this.pendingRequests.delete(t.requestId), n.resolve(t.payload);
			} else Ne(t.payload) ? (clearTimeout(n.timeoutId), this.pendingRequests.delete(t.requestId), n.reject(t.payload)) : this.console.warn("不正な idb.error payload を無視:", t.payload);
		}
	};
	ensureMessageListener() {
		this.isListening ||= (this.windowObj?.addEventListener?.("message", this.handleMessage), !0);
	}
	isInIframe() {
		try {
			return this.windowObj?.self !== this.windowObj?.top;
		} catch {
			return !0;
		}
	}
}(), M = /* @__PURE__ */ e(o(), 1), N = class extends Error {
	code;
	constructor(e, t) {
		super(t), this.code = e, this.name = "Nip96UrlPolicyError";
	}
};
function Fe(e) {
	let t = e.indexOf("#");
	return t >= 0 ? e.slice(0, t) : e;
}
function Ie(e) {
	return e.trim().replace(/^\[/, "").replace(/\]$/, "").split("%")[0];
}
function Le(e) {
	let t = e.trim().toLowerCase().replace(/\.$/, "");
	if (!t) return "local-or-private";
	if (t === "localhost" || t.endsWith(".localhost")) return "loopback";
	if (t.endsWith(".local")) return "local-or-private";
	let n = Ie(t);
	if (M.isValid(n)) try {
		let e = M.parse(n);
		return e.kind() === "ipv6" && e.isIPv4MappedAddress() ? e.toIPv4Address().range() === "loopback" ? "loopback" : e.toIPv4Address().range() === "unicast" ? "public" : "local-or-private" : e.range() === "loopback" ? "loopback" : e.range() === "unicast" ? "public" : "local-or-private";
	} catch {
		return "local-or-private";
	}
	return t.includes(".") ? "public" : "local-or-private";
}
function P(e, t) {
	let n = Fe(e.trim());
	if (!n) throw new N(t, "A NIP-96 URL is required");
	let r;
	try {
		r = new URL(n);
	} catch {
		throw new N(t, "NIP-96 URLs must be absolute HTTP(S) URLs");
	}
	if (r.protocol !== "http:" && r.protocol !== "https:") throw new N(t, "NIP-96 URLs must use HTTP(S)");
	if (r.username || r.password) throw new N(t, "NIP-96 URLs must not include user information");
	return {
		requestUrl: n,
		parsed: r
	};
}
function F(e) {
	let t = e.protocol;
	return {
		url: e.toString(),
		origin: e.origin,
		protocol: t,
		networkScope: Le(e.hostname)
	};
}
function Re(e, t) {
	return e.origin === t.origin;
}
function I(e) {
	let { parsed: t } = P(e, "invalid-upload-destination-url");
	return F(t);
}
function ze(e) {
	let { parsed: t } = P(e.rawUrl, "invalid-processing-url"), n = F(t), r = Re(n, e.trustedUploadUrl);
	if (!r && n.networkScope !== "public") throw new N("server-local-url-not-allowed", "The upload server returned a local or private processing URL");
	if (!r && n.protocol !== "https:") throw new N("invalid-processing-url", "Cross-origin processing URLs must use HTTPS");
	return {
		...n,
		sameOrigin: r
	};
}
function Be(e) {
	let { parsed: t } = P(e.rawUrl, "invalid-processing-url"), n = F(t);
	if (Re(n, e.trustedUploadUrl)) return n;
	if (n.networkScope !== "public" || n.protocol !== "https:") throw new N("server-local-url-not-allowed", "Discovery must not redirect to a local, private, or insecure URL");
	return n;
}
function Ve(e) {
	let { requestUrl: t, parsed: n } = P(e.rawUrl, "invalid-media-url"), r = F(n), i = Re(r, e.trustedUploadUrl);
	if (!i && r.networkScope !== "public") throw new N("server-local-url-not-allowed", "The upload server returned a local or private media URL");
	let a = e.pageProtocol ?? (typeof location < "u" ? location.protocol : null), o = a === "https:" && r.protocol === "http:" && r.networkScope === "loopback" && i && e.trustedUploadUrl.networkScope === "loopback";
	if (a === "https:" && r.protocol === "http:" && !o) throw new N("insecure-media-url", "HTTP media URLs cannot be used from an HTTPS page");
	return {
		...r,
		url: t
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/upload/nip96ServerIdentity.ts
function He(e) {
	let t = I(e);
	if (t.protocol !== "https:" || t.networkScope !== "public") throw Error("invalid_server_url");
	let n = new URL(t.url);
	if (n.pathname !== "/" || n.search || n.hash) throw Error("invalid_server_url");
	return t.origin;
}
function L(e) {
	let t = e.nip96ServerUrl ?? A(e)?.nip96ServerUrl ?? e.serverUrl;
	return e.nip96UrlMode === "discovery" ? He(t) : t;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/storage/uploadDestinationsRepository.ts
var Ue = {
	async getSnapshot(e) {
		return Pe.getUploadDestinationsSnapshot(e);
	},
	async setSnapshot(e, t) {
		await Pe.setUploadDestinationsSnapshot(e, t);
	}
};
function We(e) {
	if (e !== void 0) try {
		return JSON.parse(JSON.stringify(e));
	} catch {
		return;
	}
}
function Ge(e) {
	let t = We(e.raw);
	return {
		maxUploadSize: e.maxUploadSize ?? null,
		supportedMimeTypes: [...e.supportedMimeTypes],
		supportsDelete: !!e.supportsDelete,
		supportsList: !!e.supportsList,
		supportsMirror: !!e.supportsMirror,
		supportsMediaOptimization: !!e.supportsMediaOptimization,
		authRequired: !!e.authRequired,
		...e.lastCheckedAt === void 0 ? {} : { lastCheckedAt: e.lastCheckedAt },
		source: e.source,
		...t === void 0 ? {} : { raw: t }
	};
}
function Ke(e) {
	return e = w(e), {
		id: e.id,
		pubkeyHex: e.pubkeyHex ?? null,
		name: E({
			serverUrl: e.serverUrl,
			resolvedUploadUrl: e.resolvedUploadUrl,
			fallbackName: e.name,
			protocol: e.protocol,
			presetId: e.presetId
		}),
		protocol: e.protocol,
		serverUrl: e.serverUrl.trim(),
		...e.resolvedUploadUrl ? { resolvedUploadUrl: e.resolvedUploadUrl } : {},
		...e.nip96ServerUrl ? { nip96ServerUrl: e.nip96ServerUrl } : {},
		...e.nip96UrlMode ? { nip96UrlMode: e.nip96UrlMode } : {},
		...e.presetId ? { presetId: e.presetId } : {},
		isDefault: !!e.isDefault,
		enabled: !!e.enabled,
		...e.sortIndex === void 0 ? {} : { sortIndex: e.sortIndex },
		createdAt: e.createdAt,
		updatedAt: e.updatedAt,
		capabilities: Ge(e.capabilities),
		auth: { type: e.auth.type },
		schemaVersion: 1
	};
}
function R(e) {
	let t = Ke(e);
	return {
		...t,
		scopeKey: O(t.pubkeyHex),
		schemaVersion: 1
	};
}
function qe(e) {
	if (e.protocol !== "blossom") return e;
	let t = Se(e.serverUrl);
	if (!t || t.id !== "share-yabu-me") return e;
	let n = Ce({
		preset: t,
		pubkeyHex: e.pubkeyHex,
		isDefault: e.isDefault,
		now: e.updatedAt
	});
	return {
		...e,
		name: E({
			serverUrl: n.serverUrl,
			resolvedUploadUrl: n.resolvedUploadUrl,
			fallbackName: e.name,
			protocol: n.protocol,
			presetId: n.presetId
		}),
		protocol: n.protocol,
		serverUrl: n.serverUrl,
		...n.resolvedUploadUrl ? { resolvedUploadUrl: n.resolvedUploadUrl } : {},
		presetId: n.presetId,
		auth: n.auth,
		capabilities: e.capabilities.source === "preset" ? n.capabilities : e.capabilities
	};
}
function z(e) {
	let { scopeKey: t, ...n } = e, r = w(qe(n)), i = A(r);
	return i ? {
		...r,
		name: i.name
	} : r;
}
function B(e, t) {
	if (e.enabled !== t.enabled) return e.enabled ? -1 : 1;
	let n = e.sortIndex ?? e.createdAt, r = t.sortIndex ?? t.createdAt;
	return n === r ? e.createdAt === t.createdAt ? e.name.localeCompare(t.name) : e.createdAt - t.createdAt : n - r;
}
function Je(e, t) {
	return e.resolvedUploadUrl === t || e.serverUrl === t || e.protocol === "blossom" && e.serverUrl === "https://files.sovbit.host" && C(t);
}
function Ye(e, t, n) {
	if (t.protocol !== "nip96" || t.createdAt !== t.updatedAt) return null;
	for (let r of ye(n)) {
		let n = e.filter((e) => e.enabled && e.presetId === r && e.updatedAt > t.updatedAt).sort((e, t) => t.updatedAt - e.updatedAt);
		if (n[0]) return n[0];
	}
	return null;
}
var Xe = new class {
	db;
	now;
	getStorage;
	parentSync;
	getNavigator;
	syncedParentScopes = /* @__PURE__ */ new Set();
	parentMissingScopes = /* @__PURE__ */ new Set();
	constructor(e = fe, n = Date.now, r = () => t(), i = Ue, a = () => typeof navigator < "u" ? navigator : { language: "en" }) {
		this.db = e, this.now = n, this.getStorage = r, this.parentSync = i, this.getNavigator = a;
	}
	async getAll(e = null) {
		await this.loadParentSnapshot(e), await this.ensureUserScopeInitialized(e), await this.ensureLegacyUploadEndpointMigrated(e);
		let t = O(e), n = await this.db.uploadDestinations.where("scopeKey").equals(t).toArray();
		return await this.persistParentSnapshotIfMissing(t, n), n.map(z).sort(B);
	}
	async getDefault(e = null) {
		let t = await this.getAll(e), n = this.getLocale(), r = t.find((e) => e.enabled && e.isDefault);
		if (r) {
			let i = Ye(t, r, n);
			return i ? (await this.setDefault(i.id, e), {
				...i,
				isDefault: !0
			}) : r;
		}
		let i = t.find((e) => e.enabled);
		if (i) return await this.setDefault(i.id, e), {
			...i,
			isDefault: !0
		};
		let a = j({
			endpoint: this.getStorage().getItem(le.UPLOAD_ENDPOINT) ?? "",
			locale: n,
			pubkeyHex: e,
			now: this.now()
		});
		return await this.put(a), a;
	}
	async put(e) {
		let t = {
			...Ke(e),
			updatedAt: e.updatedAt || this.now()
		};
		await this.db.transaction("rw", this.db.uploadDestinations, async () => {
			t.isDefault && await this.clearDefault(t.pubkeyHex), await this.db.uploadDestinations.put(R(t));
		}), await this.persistParentSnapshot(O(t.pubkeyHex));
	}
	async delete(e) {
		let t = await this.db.uploadDestinations.get(e);
		if (t) {
			if (await this.db.uploadDestinations.delete(e), t.isDefault) {
				let e = await this.db.uploadDestinations.where("scopeKey").equals(t.scopeKey).filter((e) => e.enabled).first();
				e && await this.setDefault(e.id, t.pubkeyHex);
			}
			await this.persistParentSnapshot(t.scopeKey);
		}
	}
	async move(e, t, n = null) {
		let r = O(n), i = (await this.db.uploadDestinations.where("scopeKey").equals(r).toArray()).map(z).sort(B), a = i.findIndex((t) => t.id === e), o = t === "up" ? a - 1 : a + 1;
		if (a < 0 || o < 0 || o >= i.length) return;
		let s = [...i];
		[s[a], s[o]] = [s[o], s[a]];
		let c = this.now();
		await this.db.transaction("rw", this.db.uploadDestinations, async () => {
			await Promise.all(s.map((t, n) => this.db.uploadDestinations.put(R({
				...t,
				sortIndex: n,
				updatedAt: t.id === e ? c : t.updatedAt
			}))));
		}), await this.persistParentSnapshot(r);
	}
	async replaceBlossomServers(e, t) {
		let n = O(e);
		await this.loadParentSnapshot(e), await this.ensureUserScopeInitialized(e);
		let r = (await this.db.uploadDestinations.where("scopeKey").equals(n).toArray()).map(z).sort(B), i = r.filter((e) => e.protocol !== "blossom"), a = new Map(r.filter((e) => e.protocol === "blossom").map((e) => [k(e.serverUrl), e])), o = r.some((e) => e.protocol === "blossom" && e.isDefault), s = i.some((e) => e.isDefault), c = this.now(), l = [...new Set(t.map(k).filter((e) => !!e))].map((t, n) => ({
			...a.get(t) ?? this.createBud03BlossomDestination({
				pubkeyHex: e,
				serverUrl: t,
				now: c,
				index: n
			}),
			pubkeyHex: e,
			protocol: "blossom",
			serverUrl: t,
			enabled: !0,
			isDefault: s ? !1 : o ? n === 0 : !1,
			sortIndex: n,
			updatedAt: c
		})), u = [...l, ...i.map((e, t) => ({
			...e,
			sortIndex: l.length + t
		}))];
		if (!u.some((e) => e.isDefault)) {
			let e = u.find((e) => e.enabled);
			e && (e.isDefault = !0);
		}
		return await this.db.transaction("rw", this.db.uploadDestinations, async () => {
			await this.db.uploadDestinations.where("scopeKey").equals(n).delete(), u.length > 0 && await this.db.uploadDestinations.bulkPut(u.map(R));
		}), await this.persistParentSnapshot(n), u.sort(B);
	}
	async setDefault(e, t = null) {
		let n = O(t), r = this.now();
		await this.db.transaction("rw", this.db.uploadDestinations, async () => {
			let t = await this.db.uploadDestinations.where("scopeKey").equals(n).toArray();
			await Promise.all(t.map((t) => this.db.uploadDestinations.put({
				...t,
				isDefault: t.id === e,
				enabled: t.id === e || t.enabled,
				updatedAt: t.id === e ? r : t.updatedAt
			})));
		}), await this.persistParentSnapshot(n);
	}
	async updateTestCapabilities(e, t, n) {
		await this.db.transaction("rw", this.db.uploadDestinations, async () => {
			n();
			let r = await this.db.uploadDestinations.get(e.id), i = r ? z(r) : void 0;
			n(), i && i.pubkeyHex === e.pubkeyHex && i.updatedAt === e.updatedAt && i.protocol === e.protocol && i.serverUrl === e.serverUrl && i.resolvedUploadUrl === e.resolvedUploadUrl && i.nip96ServerUrl === e.nip96ServerUrl && i.nip96UrlMode === e.nip96UrlMode && (await this.db.uploadDestinations.put(R({
				...i,
				capabilities: t,
				updatedAt: this.now()
			})), n());
		}), n(), await this.persistParentSnapshot(O(e.pubkeyHex));
	}
	async applyRelayServerLists(e, t, n) {
		n(), await this.getAll(e), n();
		let r = O(e), i = await this.db.transaction("rw", this.db.uploadDestinations, async () => {
			n();
			let i = await this.db.uploadDestinations.where("scopeKey").equals(r).toArray();
			n();
			let a = i.map(z).sort(B), o = Math.max(this.now(), ...a.map((e) => e.updatedAt + 1)), s = /* @__PURE__ */ new Set(), c = {}, l = t.nip96?.filter((e) => C(e.serverUrl) && C(e.apiUrl)) ?? [], u = t.blossom ?? (l.length ? a.filter((e) => e.protocol === "blossom").map((e) => e.serverUrl) : void 0), d = u === void 0 ? void 0 : [.../* @__PURE__ */ new Set([...u, ...l.map(() => "https://files.sovbit.host")])], f = t.nip96?.filter((e) => !l.includes(e));
			for (let t of ["blossom", "nip96"]) {
				let n = t === "blossom" ? d?.map((e) => ({
					serverUrl: e,
					apiUrl: void 0
				})) : f;
				n !== void 0 && (c[t] = n.map((n, r) => {
					let i = a.filter((e) => e.protocol === t && !s.has(e.id)), c = i.filter((e) => {
						try {
							return k(t === "nip96" ? L(e) : e.serverUrl) === k(n.serverUrl);
						} catch {
							return !1;
						}
					}), l = t === "nip96" ? i.filter((e) => {
						try {
							return I(e.resolvedUploadUrl || e.serverUrl).url === n.apiUrl;
						} catch {
							return !1;
						}
					}) : [], u = c.find((e) => e.isDefault && e.enabled) ?? c[0] ?? (l.length === 1 ? l[0] : void 0);
					u && s.add(u.id);
					let d = this.createBud03BlossomDestination({
						pubkeyHex: e,
						serverUrl: n.serverUrl,
						now: o,
						index: r
					});
					return {
						...u ?? {
							...d,
							id: xe(),
							protocol: t,
							auth: { type: t === "nip96" ? "nip98" : "blossom-bud11" }
						},
						...t === "nip96" ? {
							nip96ServerUrl: n.serverUrl,
							nip96UrlMode: u?.nip96UrlMode ?? (u ? "direct" : "discovery"),
							...!u || u.nip96UrlMode === "discovery" ? {
								serverUrl: n.serverUrl,
								resolvedUploadUrl: n.apiUrl
							} : {}
						} : { serverUrl: n.serverUrl },
						updatedAt: o
					};
				}));
			}
			let p = {
				blossom: [...c.blossom ?? []],
				nip96: [...c.nip96 ?? []]
			}, m = {
				blossom: a.filter((e) => e.protocol === "blossom").length,
				nip96: a.filter((e) => e.protocol === "nip96").length
			}, h = [];
			for (let e of a) {
				let t = e.protocol;
				if (t === "custom-http" || c[t] === void 0) {
					h.push(e);
					continue;
				}
				let n = p[t].shift();
				n && h.push(n), --m[t] === 0 && h.push(...p[t].splice(0));
			}
			h.push(...p.blossom, ...p.nip96);
			let ee = a.find((e) => e.enabled && e.isDefault), g = h.find((e) => e.enabled && e.id === ee?.id) ?? h.find((e) => e.enabled);
			g || (g = j({
				endpoint: this.getStorage().getItem(le.UPLOAD_ENDPOINT) ?? "",
				locale: this.getLocale(),
				pubkeyHex: e,
				now: o
			}), h.push(g));
			let te = g.id, _ = h.map((e, t) => ({
				...e,
				sortIndex: t,
				isDefault: e.id === te,
				...e.id === te ? { updatedAt: o } : {}
			}));
			return n(), await this.db.uploadDestinations.where("scopeKey").equals(r).delete(), n(), await this.db.uploadDestinations.bulkPut(_.map(R)), n(), _.sort(B);
		});
		return n(), await this.persistParentSnapshot(r), i;
	}
	async applyUploadEndpointPreference({ endpoint: e, mode: t, pubkeyHex: n = null }) {
		let r = O(n);
		await this.loadParentSnapshot(n);
		let i = await this.db.uploadDestinations.where("scopeKey").equals(r).toArray();
		if (t === "default" && i.some((e) => e.enabled)) {
			await this.persistParentSnapshotIfMissing(r, i);
			let e = i.map(z);
			return e.find((e) => e.enabled && e.isDefault) ?? e.find((e) => e.enabled) ?? null;
		}
		let a = i.map(z).find((t) => Je(t, e));
		if (a) return await this.setDefault(a.id, n), await this.markLegacyUploadEndpointMigrated(r), {
			...a,
			isDefault: !0,
			enabled: !0
		};
		let o = j({
			endpoint: e,
			locale: this.getLocale(),
			pubkeyHex: n,
			now: this.now()
		});
		return await this.put(o), await this.markLegacyUploadEndpointMigrated(r), o;
	}
	async clearDefault(e) {
		let t = O(e), n = await this.db.uploadDestinations.where("scopeKey").equals(t).toArray();
		await Promise.all(n.filter((e) => e.isDefault).map((e) => this.db.uploadDestinations.put({
			...e,
			isDefault: !1
		})));
	}
	async ensureLegacyUploadEndpointMigrated(e) {
		let t = O(e);
		if ((await this.db.legacyImportState.get(this.getLegacyUploadEndpointMigrationKey(t)))?.done === !0) return;
		if (await this.db.uploadDestinations.where("scopeKey").equals(t).count() > 0) {
			await this.markLegacyUploadEndpointMigrated(t);
			return;
		}
		let n = j({
			endpoint: this.getStorage().getItem(le.UPLOAD_ENDPOINT) ?? "",
			locale: this.getLocale(),
			pubkeyHex: e === "__ehagaki_global__" ? null : e,
			now: this.now()
		});
		await this.db.transaction("rw", this.db.uploadDestinations, this.db.legacyImportState, async () => {
			(await this.db.legacyImportState.get(this.getLegacyUploadEndpointMigrationKey(t)))?.done !== !0 && (await this.db.uploadDestinations.where("scopeKey").equals(t).count() === 0 && await this.db.uploadDestinations.put(R(n)), await this.db.legacyImportState.put({
				id: this.getLegacyUploadEndpointMigrationKey(t),
				done: !0,
				updatedAt: this.now()
			}));
		});
	}
	async ensureUserScopeInitialized(e) {
		if (!e) return;
		let t = O(e);
		if (await this.db.uploadDestinations.where("scopeKey").equals(t).count() > 0) {
			await this.markLegacyUploadEndpointMigrated(t);
			return;
		}
		await this.ensureLegacyUploadEndpointMigrated(null);
		let n = await this.db.uploadDestinations.where("scopeKey").equals(he).toArray();
		if (n.length === 0) return;
		let r = this.now(), i = n.map(z).sort(B).map((t, n) => R({
			...t,
			id: this.createScopedDestinationId(e, t.id),
			pubkeyHex: e,
			sortIndex: t.sortIndex ?? n,
			updatedAt: r
		}));
		await this.db.transaction("rw", this.db.uploadDestinations, this.db.legacyImportState, async () => {
			(await this.db.legacyImportState.get(this.getLegacyUploadEndpointMigrationKey(t)))?.done !== !0 && (await this.db.uploadDestinations.bulkPut(i), await this.db.legacyImportState.put({
				id: this.getLegacyUploadEndpointMigrationKey(t),
				done: !0,
				updatedAt: r
			}));
		}), await this.persistParentSnapshot(t, i);
	}
	createScopedDestinationId(e, t) {
		return `${e.slice(0, 16)}-${t}`;
	}
	createBud03BlossomDestination(e) {
		let t = (() => {
			try {
				return new URL(e.serverUrl).host;
			} catch {
				return e.serverUrl;
			}
		})();
		return {
			id: this.createScopedDestinationId(e.pubkeyHex, `bud03-${e.index}-${t}`),
			pubkeyHex: e.pubkeyHex,
			name: t,
			protocol: "blossom",
			serverUrl: e.serverUrl,
			presetId: "custom",
			isDefault: !1,
			enabled: !0,
			sortIndex: e.index,
			createdAt: e.now,
			updatedAt: e.now,
			capabilities: {
				maxUploadSize: null,
				supportedMimeTypes: [],
				supportsDelete: !1,
				supportsList: !1,
				supportsMirror: !1,
				supportsMediaOptimization: !1,
				authRequired: !0,
				source: "preset"
			},
			auth: { type: "blossom-bud11" },
			schemaVersion: 1
		};
	}
	getLegacyUploadEndpointMigrationKey(e) {
		return pe(e);
	}
	getLocale() {
		return se(this.getStorage(), this.getNavigator());
	}
	async markLegacyUploadEndpointMigrated(e) {
		await this.db.legacyImportState.put({
			id: this.getLegacyUploadEndpointMigrationKey(e),
			done: !0,
			updatedAt: this.now()
		});
	}
	async loadParentSnapshot(e) {
		if (!this.parentSync) return;
		let t = O(e);
		if (!this.syncedParentScopes.has(t)) {
			this.syncedParentScopes.add(t);
			try {
				let e = await this.parentSync.getSnapshot(t);
				if (e === null) {
					this.parentMissingScopes.add(t);
					return;
				}
				let n = e.filter((e) => e.scopeKey === t).map((e) => R(z(e)));
				await this.db.transaction("rw", this.db.uploadDestinations, async () => {
					await this.db.uploadDestinations.where("scopeKey").equals(t).delete(), n.length > 0 && await this.db.uploadDestinations.bulkPut(n);
				});
			} catch {
				this.syncedParentScopes.delete(t);
			}
		}
	}
	async persistParentSnapshotIfMissing(e, t) {
		this.parentMissingScopes.has(e) && (await this.persistParentSnapshot(e, t), this.parentMissingScopes.delete(e));
	}
	async persistParentSnapshot(e, t) {
		if (this.parentSync) try {
			let n = t ?? await this.db.uploadDestinations.where("scopeKey").equals(e).toArray();
			await this.parentSync.setSnapshot(e, n.map((e) => R(z(e))));
		} catch {}
	}
}(), Ze = 22242;
function Qe(e, t) {
	return {
		kind: Ze,
		created_at: Math.floor(Date.now() / 1e3),
		tags: [["relay", e], ["challenge", t]],
		content: ""
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/upload/blossomAuthorization.ts
var $e = new TextEncoder(), et = new TextDecoder("utf-8", { fatal: !0 });
function tt(e) {
	let t = "", n = 32768;
	for (let r = 0; r < e.length; r += n) t += String.fromCharCode(...e.subarray(r, r + n));
	return btoa(t);
}
function nt(e) {
	if (!e || !/^[A-Za-z0-9+/_-]*={0,2}$/.test(e)) throw Error("Invalid Blossom authorization");
	let t = e.indexOf("="), n = t === -1 ? e : e.slice(0, t), r = t === -1 ? 0 : e.length - t, i = /[+/]/.test(n), a = /[-_]/.test(n), o = n.length % 4;
	if (i && a || o === 1 || r > 0 && e.length % 4 != 0 || r === 1 && o !== 3 || r === 2 && o !== 2) throw Error("Invalid Blossom authorization");
	let s = n.replace(/-/g, "+").replace(/_/g, "/"), c = (4 - s.length % 4) % 4;
	try {
		let e = atob(`${s}${"=".repeat(c)}`);
		return Uint8Array.from(e, (e) => e.charCodeAt(0));
	} catch {
		throw Error("Invalid Blossom authorization");
	}
}
function rt(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw Error("Invalid Blossom authorization");
	let t = e;
	if (typeof t.id != "string" || typeof t.pubkey != "string" || typeof t.sig != "string" || typeof t.kind != "number" || typeof t.created_at != "number" || typeof t.content != "string" || !Array.isArray(t.tags)) throw Error("Invalid Blossom authorization");
}
function it(e) {
	if (typeof e != "string") throw Error("Invalid Blossom authorization");
	let t = e.trim().match(/^([^\s]+)[ \t]+([^\s]+)$/);
	if (!t || t[1].toLowerCase() !== "nostr") throw Error("Invalid Blossom authorization");
	let n = nt(t[2]), r;
	try {
		r = et.decode(n);
	} catch {
		throw Error("Invalid Blossom authorization");
	}
	try {
		rt(JSON.parse(r));
	} catch {
		throw Error("Invalid Blossom authorization");
	}
	return n;
}
function at(e) {
	return tt(e).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function ot(e, t) {
	return `Nostr ${t !== void 0 && new URL(t).origin === "https://blossom.primal.net" ? tt(e) : at(e)}`;
}
function st(e, t) {
	return ot($e.encode(e), t);
}
function ct(e, t) {
	return ot(it(e), t);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/upload/blossomDescriptor.ts
var V = class extends Error {
	constructor(e) {
		super(e), this.name = "BlossomDescriptorValidationError";
	}
};
function lt(e) {
	let t = e.trim().toLowerCase().replace(/\.$/, "");
	if (!t) return "local-or-private";
	if (t === "localhost" || t.endsWith(".localhost")) return "loopback";
	if (t.endsWith(".local")) return "local-or-private";
	let n = t.replace(/^\[/, "").replace(/\]$/, "").split("%")[0];
	if (M.isValid(n)) try {
		let e = M.parse(n);
		if (e.kind() === "ipv6" && e.isIPv4MappedAddress()) {
			let t = e.toIPv4Address().range();
			return t === "loopback" ? "loopback" : t === "unicast" ? "public" : "local-or-private";
		}
		return e.range() === "loopback" ? "loopback" : e.range() === "unicast" ? "public" : "local-or-private";
	} catch {
		return "local-or-private";
	}
	return t.includes(".") ? "public" : "local-or-private";
}
function ut(e, t) {
	if (!e.trim()) throw new V(`Blossom descriptor ${t} is required`);
	let n;
	try {
		n = new URL(e.trim());
	} catch {
		throw new V(`Blossom descriptor ${t} must be an absolute HTTP(S) URL`);
	}
	if (n.protocol !== "http:" && n.protocol !== "https:") throw new V(`Blossom descriptor ${t} must use HTTP(S)`);
	if (n.username || n.password) throw new V(`Blossom descriptor ${t} must not include user information`);
	return n;
}
function dt(e) {
	let t = ut(e.rawUrl, "url"), n = ut(e.trustedServerUrl, "server URL"), r = t.origin === n.origin, i = lt(t.hostname), a = lt(n.hostname);
	if (!r && i !== "public") throw new V("Blossom descriptor URL must not target a cross-origin local or private host");
	if (!r && t.protocol !== "https:") throw new V("Cross-origin Blossom descriptor URLs must use HTTPS");
	let o = e.pageProtocol ?? (typeof location < "u" ? location.protocol : null), s = o === "https:" && t.protocol === "http:" && i === "loopback" && r && a === "loopback";
	if (o === "https:" && t.protocol === "http:" && !s) throw new V("HTTP Blossom descriptor URLs cannot be used from an HTTPS page");
	let c;
	try {
		c = decodeURIComponent(t.pathname);
	} catch {
		throw new V("Blossom descriptor URL contains an invalid blob path");
	}
	let l = c.slice(1);
	if (l.includes("/") || !l.startsWith(`${e.expectedSha256}.`) || l.length === e.expectedSha256.length + 1) throw new V("Blossom descriptor URL must identify the uploaded SHA-256 blob with a file extension");
	return t.hash = "", t.toString();
}
function ft(e) {
	let t = e.descriptor;
	if (!t || typeof t != "object") throw new V("Blossom descriptor must be an object");
	if (typeof t.sha256 != "string" || t.sha256 !== e.expectedSha256) throw new V("Blossom descriptor sha256 does not match the uploaded blob");
	if (typeof t.size != "number" || !Number.isFinite(t.size) || t.size !== e.expectedSize) throw new V("Blossom descriptor size does not match the uploaded blob");
	if (typeof t.type != "string" || !t.type.trim()) throw new V("Blossom descriptor type must be a non-empty string");
	if (typeof t.uploaded != "number" || !Number.isFinite(t.uploaded) || t.uploaded <= 0) throw new V("Blossom descriptor uploaded must be a positive Unix timestamp");
	if (typeof t.url != "string") throw new V("Blossom descriptor url is required");
	return {
		url: dt({
			rawUrl: t.url,
			expectedSha256: e.expectedSha256,
			trustedServerUrl: e.trustedServerUrl,
			pageProtocol: e.pageProtocol
		}),
		sha256: t.sha256,
		size: t.size,
		type: t.type,
		uploaded: t.uploaded
	};
}
function pt(e) {
	return {
		url: e.url,
		x: e.sha256,
		size: String(e.size),
		m: e.type
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/upload/mediaManagementTypes.ts
var H = class extends Error {
	code;
	status;
	diagnostic;
	retryAt;
	constructor(e, t, n, r) {
		super(e), this.code = e, this.status = t, this.diagnostic = n, this.retryAt = r, this.name = "UploadMediaError";
	}
};
// D:/ドキュメント/GitHub/ehagaki/src/lib/upload/mediaManagementUtils.ts
function U(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function W(e) {
	return typeof e == "string" && /^[a-f0-9]{64}$/i.test(e) ? e.toLowerCase() : null;
}
function G(e) {
	return typeof e == "number" && Number.isSafeInteger(e) && e >= 0 ? e : void 0;
}
function K(e) {
	if (l(e.signal), e.assertSession(), !W(e.expectedPubkey)) throw new H("authentication");
}
function mt(e) {
	try {
		let t = new URL(I(e).url);
		if (t.pathname !== "/" || t.search) throw Error();
		return t.origin;
	} catch {
		throw new H("invalidDestination");
	}
}
function q(e, t) {
	if (K(e), t.protocol !== e.destination.protocol || t.destinationId !== e.destination.id || t.serverUrl !== e.destination.serverUrl) throw new H("invalidDestination");
	try {
		let n = I(e.destination.serverUrl);
		if (Be({
			rawUrl: t.endpoint,
			trustedUploadUrl: n
		}).url !== t.endpoint || t.protocol === "blossom" && t.endpoint !== `${mt(t.serverUrl)}/`) throw Error();
	} catch {
		throw new H("invalidDestination");
	}
}
function ht(e, t) {
	let n = W(e.deleteId?.sha256);
	if (!n || e.protocol !== t.protocol || e.deleteId?.protocol !== t.protocol || e.destinationId !== t.destinationId || e.serverUrl !== t.serverUrl) throw new H("invalidResponse");
	return n;
}
async function gt(e, t) {
	K(e);
	try {
		let n = await t();
		if (K(e), !n) throw new H("authentication");
		return n;
	} catch {
		throw l(e.signal), new H("authentication");
	}
}
function _t(e, t, n) {
	let r = e.status, i = t && [
		404,
		405,
		501
	].includes(r) ? "unavailable" : r === 401 ? "authentication" : r === 403 ? "forbidden" : r === 402 ? "payment" : r === 429 ? "rateLimited" : r >= 500 ? "serverError" : "invalidResponse", a = e.headers.get("X-Reason") ?? "";
	if (n) {
		a = a.replaceAll(n, "[redacted]");
		let e = n.replace(/^Nostr\s+/i, "");
		e && (a = a.replaceAll(e, "[redacted]"));
	}
	a = a.replace(/Nostr\s+[A-Za-z0-9+/_=-]+/gi, "[redacted]").replace(/[\u0000-\u001f\u007f]/g, " ").slice(0, 200);
	let o = e.headers.get("Retry-After"), s = o && /^\d+$/.test(o) ? Date.now() + Number(o) * 1e3 : o ? Date.parse(o) : void 0;
	return new H(i, r, a || void 0, s !== void 0 && Number.isFinite(s) ? s : void 0);
}
async function J(e, t, n, r, i) {
	K(e);
	try {
		i?.();
	} catch {
		throw l(e.signal), new H("authentication");
	}
	n === "DELETE" && e.onDeleteDispatched?.();
	let a;
	try {
		a = await e.fetch(t, {
			method: n,
			headers: { Authorization: r },
			signal: e.signal,
			credentials: "omit",
			referrerPolicy: "no-referrer",
			redirect: "error",
			cache: "no-store"
		});
	} catch {
		throw n === "GET" && l(e.signal), new H(n === "DELETE" ? "unknownDelete" : "network");
	}
	if (n === "GET" && K(e), !a.ok) throw _t(a, n === "GET", r);
	return a;
}
async function vt(e, t = !1) {
	try {
		return await e.json();
	} catch {
		throw new H(t ? "unknownDelete" : "invalidResponse");
	}
}
function yt(e) {
	return e instanceof H ? e : new H(e instanceof _ ? "authentication" : "network");
}
function bt(e, t, n) {
	let r = typeof e.mime == "string" ? e.mime.split(";")[0].trim().toLowerCase() : "", i = typeof e.url == "string" ? e.url : "", a = r ? /^image\/[a-z0-9!#$&^_.+-]+$/.test(r) ? "image" : /^video\/[a-z0-9!#$&^_.+-]+$/.test(r) ? "video" : "unknown" : e.mime === void 0 ? g({ url: i }) : "unknown";
	if (a !== "image" && a !== "video") return null;
	let o = W(e.hash), s = null;
	try {
		t.protocol === "blossom" ? o && (s = dt({
			rawUrl: i,
			expectedSha256: o,
			trustedServerUrl: t.serverUrl
		})) : s = Ve({
			rawUrl: i,
			trustedUploadUrl: I(t.endpoint)
		}).url;
	} catch {}
	let c = G(e.size), l = G(e.uploaded);
	return {
		id: o ? `${t.destinationId}:${o}:${s ?? "missing-url"}` : n,
		destinationId: t.destinationId,
		protocol: t.protocol,
		serverUrl: t.serverUrl,
		kind: a,
		url: s,
		...r ? { mimeType: r } : {},
		...c === void 0 ? {} : { size: c },
		...l !== void 0 && Number.isFinite((/* @__PURE__ */ new Date(l * 1e3)).getTime()) ? { uploadedAt: l } : {},
		deleteId: o ? {
			protocol: t.protocol,
			sha256: o
		} : null
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/nostrAuthService.ts
var xt = class {
	operation;
	constructor(e) {
		this.operation = e;
	}
	assertOperationActive() {
		l(this.operation?.signal), this.operation?.expectedPubkey && Y(this.operation.expectedPubkey);
	}
	async getEventSigner(e) {
		this.assertOperationActive();
		let t = e ?? d(v);
		Y(t);
		let n = await u(this.getSessionEventSigner(t), this.operation?.signal);
		return this.assertOperationActive(), Y(t), this.createSessionBoundSigner(n, t);
	}
	async getSessionEventSigner(e) {
		let t = v.value;
		if (!t.isAuthenticated || t.pubkey !== e) throw new _();
		if (t.type === "nsec") {
			let t = b.getFromStore(), n = t && b.derivePublicKey(t).hex === e ? t : b.loadFromStorage(e);
			if (!n || b.derivePublicKey(n).hex !== e) throw new _();
			return {
				getPublicKey: async () => e,
				signEvent: async (e) => ie(n).signEvent(e)
			};
		}
		if (t.type === "nip46") return await this.getCurrentNip46Signer(e);
		if (t.type === "parentClient") {
			let e = re.getSigner();
			if (e) return e;
			throw new _();
		}
		if (t.type === "nip07") {
			let t = window.nostr;
			if (!t?.signEvent) throw new _();
			return {
				getPublicKey: async () => {
					this.assertOperationActive();
					let n = typeof t.getPublicKey == "function" ? await t.getPublicKey() : e;
					if (this.assertOperationActive(), n !== e) throw new _();
					return n;
				},
				signEvent: async (e) => {
					this.assertOperationActive();
					let n = await t.signEvent(e);
					return this.assertOperationActive(), n;
				}
			};
		}
		throw new _();
	}
	createSessionBoundSigner(e, t) {
		return {
			getPublicKey: async () => {
				this.assertOperationActive(), Y(t);
				let n = await u(e.getPublicKey(), this.operation?.signal);
				if (this.assertOperationActive(), Y(t), n !== t) throw new _();
				return n;
			},
			signEvent: async (n) => {
				this.assertOperationActive(), Y(t);
				let r = ne(n), i = await u(e.signEvent(r.signerTemplate), this.operation?.signal);
				this.assertOperationActive(), Y(t);
				let a = ee(r.expectedTemplate, i, t);
				return this.assertOperationActive(), Y(t), a;
			}
		};
	}
	async getCurrentNip46Signer(e) {
		this.assertOperationActive();
		let t = v.value;
		if (!t.isAuthenticated || t.type !== "nip46" || t.pubkey !== e) throw new _();
		let n = await de.getSignerForSession(e);
		this.assertOperationActive();
		let r = v.value;
		if (!n || !r.isAuthenticated || r.type !== "nip46" || r.pubkey !== e) throw new _();
		return n;
	}
	async buildAuthHeader(e, t = "POST", n) {
		this.assertOperationActive();
		let r = d(v), i = await this.getEventSigner(r);
		Y(r);
		let { getToken: a } = await import("./nip98-D6EC4Xr0.js");
		this.assertOperationActive(), Y(r);
		let o = await a(e, t, async (e) => await i.signEvent(e), !0, ...n ? [n] : []);
		return this.assertOperationActive(), Y(r), o;
	}
	async getBlossomSigner() {
		this.assertOperationActive();
		let e = d(v);
		return await this.getEventSigner(e);
	}
	async createBlossomManagementAuthorization(e) {
		this.assertOperationActive();
		let t = new URL(mt(e.serverUrl)), n = W(e.sha256);
		if (e.action === "delete" && !n) throw Error("Invalid management hash");
		let r = () => {
			this.assertOperationActive(), Y(e.expectedPubkey);
		};
		r();
		let i = await this.getEventSigner(e.expectedPubkey), a = Math.floor(Date.now() / 1e3), o = a + 60, s = [
			["t", e.action],
			["server", t.hostname.toLowerCase()],
			["expiration", String(o)]
		];
		e.action === "delete" && s.push(["x", n]);
		let c = await i.signEvent({
			kind: 24242,
			created_at: a,
			tags: s,
			content: e.action === "list" ? `List uploaded media on ${t.origin}` : `Delete uploaded ${e.kind ?? "media"} from ${t.origin}`
		});
		r();
		let l = () => {
			if (r(), Math.floor(Date.now() / 1e3) >= o) throw Error("Authorization expired");
		};
		return l(), {
			authorization: st(JSON.stringify(c), t.origin),
			assertSession: l
		};
	}
	async buildBlossomAuthorizationHeader(e) {
		this.assertOperationActive(), e.contentType, e.contentLength;
		let t = d(v), n = await this.getEventSigner(t);
		Y(t);
		let r = Math.floor(Date.now() / 1e3), i = [["expiration", String(r + 60)], ["t", e.method]];
		e.sha256 && i.push(["x", e.sha256]);
		let a = await n.signEvent({
			kind: 24242,
			created_at: r,
			content: "Check Blossom upload availability",
			tags: i
		});
		return this.assertOperationActive(), Y(t), st(JSON.stringify(a), e.serverUrl);
	}
	async createBlossomConnectionTestAuthorization(e) {
		this.assertOperationActive();
		let t = d(v), n = await this.buildBlossomAuthorizationHeader(e);
		return this.assertOperationActive(), Y(t), {
			authorization: n,
			assertSession: () => Y(t)
		};
	}
};
function Y(e) {
	h(v, e);
}
function X(e, t) {
	if (!Array.isArray(e)) throw Error("Invalid NIP-42 authentication event");
	let n = e.find((e) => Array.isArray(e) && e[0] === t);
	if (!n || typeof n[1] != "string" || !n[1]) throw Error("Invalid NIP-42 authentication event");
	return n[1];
}
function St(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function Ct(e, t, n, r) {
	if (!St(e) || e.kind !== 22242 || e.content !== "" || X(e.tags, "relay") !== t || X(e.tags, "challenge") !== n) throw Error("Invalid NIP-42 authentication event");
	if (r && e.pubkey !== r) throw Error("Authentication required");
}
function wt(e) {
	let t = new xt();
	return (n) => ({ signer: {
		getPublicKey: async () => (Y(e), e),
		signEvent: async (r) => {
			Y(e);
			let i = X(r.tags, "challenge"), o = X(r.tags, "relay"), s = a.normalizeExternalRelayUrl(n), c = a.normalizeExternalRelayUrl(o);
			if (!s || c !== s) throw Error("Invalid NIP-42 authentication event");
			Ct(r, o, i);
			let l = Qe(o, i);
			try {
				console.debug("nip42_auth_sign_requested", {
					method: "sign_event:22242",
					stage: "start"
				});
				let n = await t.getEventSigner(e);
				Y(e);
				let a = await n.signEvent(l);
				return Y(e), Ct(a, o, i, e), console.debug("nip42_auth_sign_succeeded", {
					method: "sign_event:22242",
					stage: "success"
				}), {
					id: a.id,
					sig: a.sig,
					kind: r.kind,
					tags: a.tags,
					pubkey: a.pubkey,
					content: a.content,
					created_at: a.created_at
				};
			} catch (e) {
				throw console.warn("nip42_auth_sign_failed", {
					method: "sign_event:22242",
					stage: "failure",
					reason: "unexpected"
				}), e;
			}
		}
	} });
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/nostr-tools/lib/esm/nipb7.js
var Tt = Object.defineProperty, Et = (e, t) => {
	for (var n in t) Tt(e, n, {
		get: t[n],
		enumerable: !0
	});
};
new TextDecoder("utf-8"), new TextEncoder();
function Z(e) {
	if (e.length !== 64) return !1;
	for (let t = 0; t < 64; t++) {
		let n = e.charCodeAt(t);
		if (isNaN(n) || n < 48 || n > 102 || n > 57 && n < 97) return !1;
	}
	return !0;
}
var Dt = (e) => e instanceof Object;
function Ot(e) {
	if (!Dt(e) || typeof e.kind != "number" || typeof e.content != "string" || typeof e.created_at != "number" || typeof e.pubkey != "string" || !Z(e.pubkey) || !Array.isArray(e.tags)) return !1;
	for (let t = 0; t < e.tags.length; t++) {
		let n = e.tags[t];
		if (!Array.isArray(n)) return !1;
		for (let e = 0; e < n.length; e++) if (typeof n[e] != "string") return !1;
	}
	return !0;
}
var kt = {};
Et(kt, {
	AIEmbeddings: () => Bn,
	AppCurationSet: () => wi,
	Application: () => Si,
	AuthoredPodcasts: () => Br,
	BadgeAward: () => Wt,
	BadgeDefinition: () => ui,
	Bid: () => mn,
	BidConfirmation: () => hn,
	BlobsAuth: () => ei,
	BlockedRelaysList: () => Sr,
	BlossomServerList: () => Fr,
	BookmarkList: () => yr,
	Bookmarksets: () => ai,
	Calendar: () => Vi,
	CalendarEventRSVP: () => Hi,
	CashuMintAnnouncement: () => $i,
	CashuWalletEvent: () => Jr,
	CashuWalletHistory: () => Qn,
	CashuWalletTokens: () => Zn,
	ChannelCreation: () => an,
	ChannelHideMessage: () => cn,
	ChannelMessage: () => sn,
	ChannelMetadata: () => on,
	ChannelMuteUser: () => ln,
	ChatMessage: () => Gt,
	Chess: () => dn,
	ClassifiedListing: () => Ai,
	ClientAuth: () => Xr,
	CodeSnippet: () => Tn,
	CoinjoinPool: () => Un,
	Comment: () => bn,
	CommunitiesList: () => br,
	CommunityDefinition: () => Yi,
	CommunityPostApproval: () => Kn,
	ConferenceEvent: () => Di,
	Contacts: () => zt,
	CreateOrUpdateProduct: () => pi,
	CreateOrUpdateStall: () => fi,
	CuratedVideoSets: () => si,
	Curationsets: () => oi,
	Date: () => zi,
	DecoupledEncryptionKeyDistribution: () => Gn,
	DecoupledKeyAnnouncement: () => Mr,
	DecoupledKeyClientAnnouncement: () => Wn,
	DirectMessageRelaysList: () => Nr,
	DraftClassifiedListing: () => ji,
	DraftEvent: () => Ii,
	DraftLong: () => _i,
	Emojisets: () => vi,
	EncryptedDirectMessage: () => Bt,
	EventDeletion: () => Vt,
	FavoriteFollowSets: () => Ar,
	FavoritePodcasts: () => Pr,
	FavoriteRelays: () => Tr,
	FedimintAnnouncement: () => ea,
	Feed: () => Ri,
	FileMessage: () => Zt,
	FileMetadata: () => vn,
	FileServerPreference: () => Ir,
	Followsets: () => ni,
	ForumThread: () => qt,
	GenericRepost: () => Qt,
	Genericlists: () => ri,
	GeocacheListing: () => Zi,
	GeocacheLog: () => $n,
	GeocacheLogEntry: () => Qi,
	GeocacheProofOfFind: () => er,
	GiftWrap: () => _n,
	GitPullRequest: () => Dn,
	GitPullRequestUpdate: () => On,
	GoodWikiAuthorList: () => Lr,
	GoodWikiRelayList: () => Rr,
	GroupMetadata: () => na,
	HTTPAuth: () => ti,
	Handlerinformation: () => Gi,
	Handlerrecommendation: () => Wi,
	Highlights: () => hr,
	InteractiveRoom: () => Ei,
	InterestsList: () => Dr,
	Interestsets: () => di,
	Issue: () => kn,
	JobFeedback: () => Yn,
	JobRequest: () => qn,
	JobResult: () => Jn,
	Label: () => Rn,
	LegacyNsiteFile: () => qi,
	LightningPubRPC: () => Yr,
	LinkSet: () => Li,
	LiveChatMessage: () => wn,
	LiveEvent: () => Ti,
	LongFormArticle: () => gi,
	MarketplaceUI: () => mi,
	MediaFollows: () => kr,
	MediaStarterPacks: () => ca,
	MergeRequests: () => fn,
	Metadata: () => It,
	ModularArticleContent: () => bi,
	ModularArticleHeader: () => yi,
	MuteSets: () => ci,
	Mutelist: () => gr,
	NWCWalletInfo: () => Kr,
	NWCWalletRequest: () => Zr,
	NWCWalletResponse: () => Qr,
	NormalVideo: () => tn,
	NostrConnect: () => $r,
	NsiteNamed: () => Xi,
	NsiteRoot: () => qr,
	NutZap: () => dr,
	NutZapInfo: () => Or,
	OpenTimestamps: () => gn,
	Patch: () => En,
	PeerToPeerOrderEvents: () => ta,
	Photo: () => en,
	Pinlist: () => _r,
	PodcastEpisode: () => un,
	PodcastMetadata: () => zr,
	Poll: () => yn,
	PollResponse: () => pn,
	PrivateDirectMessage: () => Xt,
	PrivateEventRelayList: () => Er,
	ProblemTracker: () => Fn,
	ProductSoldAsAuction: () => hi,
	ProfileBadges: () => li,
	ProxyAnnouncement: () => Wr,
	PublicChatsList: () => xr,
	PublicMessage: () => rn,
	Reaction: () => Ut,
	ReactionToWebsite: () => $t,
	RecommendRelay: () => Rt,
	Redirects: () => Fi,
	RelayDiscovery: () => Ci,
	RelayList: () => vr,
	RelayMonitorAnnouncement: () => Vr,
	RelayReview: () => Ui,
	RelayReviews: () => zn,
	Relaysets: () => ii,
	ReleaseArtifactSets: () => xi,
	Reply: () => An,
	Report: () => In,
	Reporting: () => Ln,
	RepositoryAnnouncement: () => Mi,
	RepositoryState: () => Ni,
	Repost: () => Ht,
	ReservedCashuWalletTokens: () => Xn,
	RoomPresence: () => Hr,
	Scroll: () => Sn,
	Seal: () => Yt,
	SearchRelaysList: () => Cr,
	ShortTextNote: () => Lt,
	ShortVideo: () => nn,
	SimpleGroupAdmins: () => ra,
	SimpleGroupCreateGroup: () => ar,
	SimpleGroupCreateInvite: () => sr,
	SimpleGroupDeleteEvent: () => ir,
	SimpleGroupDeleteGroup: () => or,
	SimpleGroupEditMetadata: () => rr,
	SimpleGroupJoinRequest: () => cr,
	SimpleGroupLeaveRequest: () => lr,
	SimpleGroupList: () => wr,
	SimpleGroupLiveKitParticipants: () => oa,
	SimpleGroupMembers: () => ia,
	SimpleGroupPutUser: () => tr,
	SimpleGroupRemoveUser: () => nr,
	SimpleGroupReply: () => Jt,
	SimpleGroupRoles: () => aa,
	SimpleGroupThreadedReply: () => Kt,
	SlideSet: () => ki,
	SoftwareApplication: () => Ki,
	StarterPacks: () => sa,
	StatusApplied: () => Mn,
	StatusClosed: () => Nn,
	StatusDraft: () => Pn,
	StatusOpen: () => jn,
	TidalLogin: () => fr,
	Time: () => Bi,
	Torrent: () => Vn,
	TorrentComment: () => Hn,
	TransportMethodAnnouncement: () => Gr,
	UserEmojiList: () => jr,
	UserGraspList: () => Ur,
	UserStatuses: () => Oi,
	VideoViewEvent: () => Ji,
	Voice: () => xn,
	VoiceComment: () => Cn,
	WebBookmarks: () => la,
	WikiArticle: () => Pi,
	Zap: () => mr,
	ZapGoal: () => ur,
	ZapRequest: () => pr,
	classifyKind: () => Pt,
	isAddressableKind: () => Nt,
	isEphemeralKind: () => Mt,
	isKind: () => Ft,
	isRegularKind: () => At,
	isReplaceableKind: () => jt
});
function At(e) {
	return e < 1e4 && e !== 0 && e !== 3;
}
function jt(e) {
	return e === 0 || e === 3 || 1e4 <= e && e < 2e4;
}
function Mt(e) {
	return 2e4 <= e && e < 3e4;
}
function Nt(e) {
	return 3e4 <= e && e < 4e4;
}
function Pt(e) {
	return At(e) ? "regular" : jt(e) ? "replaceable" : Mt(e) ? "ephemeral" : Nt(e) ? "parameterized" : "unknown";
}
function Ft(e, t) {
	let n = t instanceof Array ? t : [t];
	return Ot(e) && n.includes(e.kind) || !1;
}
var It = 0, Lt = 1, Rt = 2, zt = 3, Bt = 4, Vt = 5, Ht = 6, Ut = 7, Wt = 8, Gt = 9, Kt = 10, qt = 11, Jt = 12, Yt = 13, Xt = 14, Zt = 15, Qt = 16, $t = 17, en = 20, tn = 21, nn = 22, rn = 24, an = 40, on = 41, sn = 42, cn = 43, ln = 44, un = 54, dn = 64, fn = 818, pn = 1018, mn = 1021, hn = 1022, gn = 1040, _n = 1059, vn = 1063, yn = 1068, bn = 1111, xn = 1222, Sn = 1227, Cn = 1244, wn = 1311, Tn = 1337, En = 1617, Dn = 1618, On = 1619, kn = 1621, An = 1622, jn = 1630, Mn = 1631, Nn = 1632, Pn = 1633, Fn = 1971, In = 1984, Ln = 1984, Rn = 1985, zn = 1986, Bn = 1987, Vn = 2003, Hn = 2004, Un = 2022, Wn = 4454, Gn = 4455, Kn = 4550, qn = 5999, Jn = 6999, Yn = 7e3, Xn = 7374, Zn = 7375, Qn = 7376, $n = 7516, er = 7517, tr = 9e3, nr = 9001, rr = 9002, ir = 9005, ar = 9007, or = 9008, sr = 9009, cr = 9021, lr = 9022, ur = 9041, dr = 9321, fr = 9467, pr = 9734, mr = 9735, hr = 9802, gr = 1e4, _r = 10001, vr = 10002, yr = 10003, br = 10004, xr = 10005, Sr = 10006, Cr = 10007, wr = 10009, Tr = 10012, Er = 10013, Dr = 10015, Or = 10019, kr = 10020, Ar = 10021, jr = 10030, Mr = 10044, Nr = 10050, Pr = 10054, Fr = 10063, Ir = 10096, Lr = 10101, Rr = 10102, zr = 10154, Br = 10164, Vr = 10166, Hr = 10312, Ur = 10317, Wr = 10377, Gr = 11111, Kr = 13194, qr = 15128, Jr = 17375, Yr = 21e3, Xr = 22242, Zr = 23194, Qr = 23195, $r = 24133, ei = 24242, ti = 27235, ni = 3e4, ri = 30001, ii = 30002, ai = 30003, oi = 30004, si = 30005, ci = 30007, li = 30008, ui = 30009, di = 30015, fi = 30017, pi = 30018, mi = 30019, hi = 30020, gi = 30023, _i = 30024, vi = 30030, yi = 30040, bi = 30041, xi = 30063, Si = 30078, Ci = 30166, wi = 30267, Ti = 30311, Ei = 30312, Di = 30313, Oi = 30315, ki = 30388, Ai = 30402, ji = 30403, Mi = 30617, Ni = 30618, Pi = 30818, Fi = 30819, Ii = 31234, Li = 31388, Ri = 31890, zi = 31922, Bi = 31923, Vi = 31924, Hi = 31925, Ui = 31987, Wi = 31989, Gi = 31990, Ki = 32267, qi = 34128, Ji = 34237, Yi = 34550, Xi = 35128, Zi = 37515, Qi = 37516, $i = 38172, ea = 38173, ta = 38383, na = 39e3, ra = 39001, ia = 39002, aa = 39003, oa = 39004, sa = 39089, ca = 39092, la = 39701;
function ua(e) {
	if (typeof File < "u" && e instanceof File || e instanceof Blob) return e.type || void 0;
}
function da() {
	return Math.floor(Date.now() / 1e3);
}
var fa = class {
	constructor(e, t) {
		this.signer = t, e.startsWith("http") || (e = "https://" + e), this.mediaserver = e.replace(/\/$/, "") + "/";
	}
	mediaserver;
	getMediaServer() {
		return this.mediaserver;
	}
	async authorizationHeader(e) {
		let t = {
			created_at: da(),
			kind: kt.BlobsAuth,
			content: "blossom stuff",
			tags: [["expiration", String(da() + 60)]]
		};
		e?.(t);
		try {
			let e = await this.signer.signEvent(t), n = JSON.stringify(e);
			return "Nostr " + btoa(n);
		} catch {
			return "";
		}
	}
	async httpCall(e, t, n, r, i) {
		let a = {};
		if (n && (a["Content-Type"] = n), r) {
			let e = await r();
			e && (a.Authorization = e);
		}
		let o = await fetch(this.mediaserver + t, {
			method: e,
			headers: a,
			body: i
		});
		if (o.status >= 300) {
			let e = o.headers.get("X-Reason") || o.statusText;
			throw Error(`${t} returned error (${o.status}): ${e}`);
		}
		return o.headers.get("content-type")?.includes("application/json") ? o.json() : o;
	}
	async uploadBlob(e, t) {
		let i = r(n(new Uint8Array(await e.arrayBuffer()))), a = t || ua(e) || "application/octet-stream";
		return this.httpCall("PUT", "upload", a, () => this.authorizationHeader((e) => {
			e.tags.push(["t", "upload"], ["x", i]);
		}), e);
	}
	async uploadFile(e) {
		return this.uploadBlob(e, e.type);
	}
	async download(e) {
		if (!Z(e)) throw Error(`${e} is not a valid 32-byte hex string`);
		let t = await this.authorizationHeader((t) => {
			t.tags.push(["t", "get"], ["x", e]);
		}), n = await fetch(this.mediaserver + e, {
			method: "GET",
			headers: { Authorization: t }
		});
		if (n.status >= 300) throw Error(`${e} not present on ${this.mediaserver}: ${n.status}`);
		return n.arrayBuffer();
	}
	async downloadAsBlob(e) {
		return new Blob([await this.download(e)]);
	}
	async list() {
		let e = await this.signer.getPublicKey();
		if (!Z(e)) throw Error(`pubkey ${e} is not valid`);
		return this.httpCall("GET", `list/${e}`, void 0, () => this.authorizationHeader((e) => {
			e.tags.push(["t", "list"]);
		}));
	}
	async delete(e) {
		if (!Z(e)) throw Error(`${e} is not a valid 32-byte hex string`);
		await this.httpCall("DELETE", e, void 0, () => this.authorizationHeader((t) => {
			t.tags.push(["t", "delete"], ["x", e]);
		}));
	}
	async check(e) {
		if (!Z(e)) throw Error(`${e} is not valid 32-byte hex`);
		await this.httpCall("HEAD", e);
	}
	async mirror(e) {
		let t = e.split("/").pop()?.split(".")[0] || "";
		return this.httpCall("PUT", "mirror", "application/json", () => this.authorizationHeader((e) => {
			e.tags.push(["t", "upload"], ["x", t]);
		}), JSON.stringify({ url: e }));
	}
}, pa = [
	/file not found/i,
	/not found/i,
	/cannot get/i,
	/processing/i
], ma = class extends Error {
	reason;
	constructor(e) {
		super(e === "unavailable" ? oe.TIMEOUT_MESSAGE : "Uploaded media availability could not be verified"), this.reason = e, this.name = "UploadedMediaAvailabilityError";
	}
};
function ha(e, t) {
	if (!t) return e.ok;
	let n = e.headers.get("content-type");
	if (!n) return e.ok;
	let r = t.split("/")[0];
	return n.startsWith(t) || n.startsWith(`${r}/`);
}
function ga(e) {
	let t = e.headers.get("X-Reason")?.trim();
	return t ? pa.some((e) => e.test(t)) : !1;
}
function _a(e) {
	let t = e.headers.get("content-type")?.toLowerCase() ?? "";
	return t.startsWith("text/") || t.includes("json") || t.includes("xml") || t.includes("svg");
}
async function va(e) {
	if (!_a(e)) return !1;
	let t = await e.text().catch(() => "");
	return pa.some((e) => e.test(t));
}
function ya(e, t) {
	return l(t), new Promise((n, r) => {
		let i = new Image(), a = () => {
			i.onload = null, i.onerror = null, t?.removeEventListener("abort", s);
		}, o = (e) => {
			a(), n(e);
		}, s = () => {
			a(), i.src = "", r(c());
		};
		i.onload = () => o(!0), i.onerror = () => o(!1), t?.addEventListener("abort", s, { once: !0 }), i.referrerPolicy = "no-referrer", i.src = e, t?.aborted && s();
	});
}
async function ba(e) {
	l(e.signal);
	try {
		let t = await e.fetch(e.url, {
			method: "HEAD",
			cache: "no-store",
			credentials: "omit",
			referrerPolicy: "no-referrer",
			...e.signal ? { signal: e.signal } : {}
		});
		if (l(e.signal), t.ok && !ga(t)) return ha(t, e.mimeType) ? "available" : "unavailable";
		if (t.ok || t.status !== 405 && t.status !== 501) return "unavailable";
	} catch {
		return l(e.signal), "inconclusive";
	}
	try {
		let t = await e.fetch(e.url, {
			method: "GET",
			cache: "no-store",
			credentials: "omit",
			referrerPolicy: "no-referrer",
			...e.signal ? { signal: e.signal } : {}
		});
		return l(e.signal), !t.ok || ga(t) || !ha(t, e.mimeType) || await va(t.clone()) ? "unavailable" : (l(e.signal), "available");
	} catch {
		return l(e.signal), "inconclusive";
	}
}
async function xa(e) {
	let t = await ba(e);
	return t === "available" ? "available" : t === "unavailable" ? "unavailable" : e.mimeType?.startsWith("image/") && typeof Image < "u" && await ya(e.url, e.signal) ? "available" : "inconclusive";
}
async function Sa(e) {
	let t = e.maxWaitTime ?? oe.MAX_WAIT_TIME, n = e.retryInterval ?? oe.RETRY_INTERVAL, r = Date.now() + t, i = "inconclusive";
	for (;;) {
		l(e.signal);
		let t = await xa(e);
		if (l(e.signal), t === "available") return;
		if (i = t, Date.now() >= r) throw new ma(i);
		await s(n, e.signal);
	}
}
async function Ca(e, t) {
	let n = Number(e.headers.get("Content-Length"));
	if (Number.isFinite(n) && n > 8388608) throw e.body?.cancel().catch(() => void 0), new H("invalidResponse");
	let r = e.body?.getReader();
	if (!r) throw new H("invalidResponse");
	let i = new TextDecoder(), a = 0, o = "", s = !1;
	try {
		for (;;) {
			K(t);
			let e = await r.read();
			if (K(t), e.done) {
				s = !0;
				break;
			}
			if (a += e.value.byteLength, a > 8388608) throw new H("invalidResponse");
			o += i.decode(e.value, { stream: !0 });
		}
		return JSON.parse(o + i.decode());
	} catch {
		throw K(t), new H("invalidResponse");
	} finally {
		s || r.cancel().catch(() => void 0), r.releaseLock();
	}
}
async function wa(e, t, n, r) {
	let i = () => {};
	return {
		authorization: await gt(e, async () => {
			let a = e.authService.createBlossomManagementAuthorization;
			if (!a) throw new H("authentication");
			let o = await a.call(e.authService, {
				serverUrl: e.destination.serverUrl,
				action: t,
				expectedPubkey: e.expectedPubkey,
				sha256: n,
				kind: r
			});
			return o.assertSession(), i = o.assertSession, o.authorization;
		}),
		assertValid: i
	};
}
async function Ta(e) {
	if (K(e), e.destination.protocol !== "blossom" || e.page && e.page.protocol !== "blossom") throw new H("invalidDestination");
	let t = mt(e.destination.serverUrl), n = e.context ?? {
		protocol: "blossom",
		destinationId: e.destination.id,
		serverUrl: e.destination.serverUrl,
		endpoint: `${t}/`
	};
	q(e, n);
	let r = e.page?.protocol === "blossom" ? e.page.limit : 24;
	if (!Number.isSafeInteger(r) || r < 1) throw new H("invalidResponse");
	let i = new URL(`/list/${e.expectedPubkey}`, t);
	i.searchParams.set("limit", String(r));
	let a = e.page?.protocol === "blossom" ? e.page.cursor : void 0;
	if (a) {
		if (!W(a)) throw new H("invalidResponse");
		i.searchParams.set("cursor", a);
	}
	let o = await wa(e, "list"), s = await J(e, i.toString(), "GET", o.authorization, o.assertValid);
	if (s.status !== 200) throw new H("invalidResponse");
	let c = await Ca(s, e);
	if (K(e), !Array.isArray(c) || c.length > 1e4) throw new H("invalidResponse");
	let l = c.at(-1), u = U(l) ? W(l.sha256) : null, d = c.length > r || !!(a && u === a);
	if (!d && c.length && (!u || c.some((e) => U(e) && W(e.sha256) === a))) throw new H("invalidResponse");
	let f = [], p = 0, m = 0;
	return c.forEach((e, t) => {
		if (!U(e)) {
			m++;
			return;
		}
		let r = bt({
			url: e.url,
			mime: e.type,
			hash: e.sha256,
			size: e.size,
			uploaded: e.uploaded
		}, n, `${n.destinationId}:${a ?? "first"}:${t}`);
		r ? (f.push(r), r.url && r.deleteId || m++) : p++;
	}), {
		items: f,
		rawCount: c.length,
		excludedCount: p,
		invalidCount: m,
		context: n,
		...d ? { localSnapshot: !0 } : {},
		nextPage: !d && u ? {
			protocol: "blossom",
			cursor: u,
			limit: r
		} : null
	};
}
async function Ea(e) {
	if (q(e, e.context), e.context.protocol !== "blossom") throw new H("invalidDestination");
	let t = ht(e.item, e.context), n = await wa(e, "delete", t, e.item.kind), r = await J(e, new URL(t, e.context.endpoint).toString(), "DELETE", n.authorization, n.assertValid);
	if (r.status !== 200 && r.status !== 204) throw new H("unknownDelete");
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/upload/BlossomUploadAdapter.ts
function Da(e) {
	return e.serverUrl.replace(/\/$/, "");
}
function Oa(e) {
	return `${Da(e)}/upload`;
}
var ka = [
	"image/png",
	"image/jpeg",
	"image/webp",
	"image/gif",
	"image/svg+xml",
	"video/mp4",
	"video/webm",
	"video/quicktime",
	"audio/mpeg",
	"audio/mp3",
	"audio/wav"
];
function Aa(e) {
	return {
		success: !0,
		url: e.url,
		nip94: pt(e)
	};
}
function ja(e) {
	let t = e instanceof Error ? e.message : String(e), n = t.match(/^upload returned an error \((\d+)\):\s*(.*)$/);
	return n ? `Blossom upload failed: ${n[1]} ${n[2]}` : t ? `Blossom upload failed: ${t}` : "Blossom upload failed";
}
function Ma(e) {
	return new Promise((t, n) => {
		let r = new FileReader();
		r.onload = () => t(r.result), r.onerror = () => n(r.error ?? /* @__PURE__ */ Error("Failed to read upload blob")), r.readAsArrayBuffer(e);
	});
}
function Na(e) {
	if (typeof e.arrayBuffer == "function") return e;
	let t = new Blob([e], { type: e.type || "application/octet-stream" });
	return typeof t.arrayBuffer != "function" && (t.arrayBuffer = () => Ma(t)), t;
}
function Pa(e, t, n, r) {
	let i = `${Da(e)}/`, a = new fa(i, t);
	return a.httpCall = async (e, t, a, o, s, c) => {
		l(r);
		let u = {};
		if (a && (u["Content-Type"] = a), o) {
			let e = await o();
			if (l(r), !e) throw Error("Blossom authorization failed");
			u.Authorization = ct(e, `${i}${t}`);
		}
		let d = await n(`${i}${t}`, {
			method: e,
			headers: u,
			body: s,
			...e.toUpperCase() === "PUT" ? {
				redirect: "error",
				credentials: "omit",
				referrerPolicy: "no-referrer"
			} : {},
			...r ? { signal: r } : {}
		});
		if (l(r), d.status >= 300) {
			let e = d.headers.get("X-Reason") || d.statusText;
			throw Error(`${t} returned an error (${d.status}): ${e}`);
		}
		return c !== null && d.headers.get("content-type")?.includes("application/json") ? await d.json() : d;
	}, a;
}
function Fa(e) {
	return e >= 200 && e < 300;
}
async function Ia(e) {
	let t = {
		"X-SHA-256": e.sha256,
		"X-Content-Type": e.contentType,
		"X-Content-Length": String(e.contentLength)
	}, n = e.authorizationContext?.authorization;
	n && (t.Authorization = n), e.authorizationContext?.assertSession();
	try {
		return await e.fetch(Oa(e.destination), {
			method: "HEAD",
			headers: t
		});
	} catch {
		return null;
	}
}
async function La(e) {
	let t = [];
	for (let n of ka) {
		let r = await Ia({
			...e,
			contentType: n
		});
		if (!r) break;
		Fa(r.status) && t.push(n);
	}
	return t;
}
function Ra(e, t, n) {
	let r = Number(e.headers.get("X-Max-Upload-Size")) || Number(e.headers.get("Max-Upload-Size")) || t.capabilities.maxUploadSize || null, i = e.headers.get("X-Supported-Mime-Types") || e.headers.get("Accept"), a = i ? i.split(",").map((e) => e.trim()).filter(Boolean) : n?.supportedMimeTypes?.length ? n.supportedMimeTypes : t.capabilities.supportedMimeTypes;
	return {
		...t.capabilities,
		maxUploadSize: n?.maxUploadSize ?? r,
		supportedMimeTypes: a,
		supportsDelete: !0,
		supportsList: !1,
		authRequired: !0,
		lastCheckedAt: Date.now(),
		source: "test"
	};
}
var za = class {
	protocol = "blossom";
	listMediaPage = Ta;
	deleteMedia = Ea;
	async upload(e) {
		l(e.signal);
		let t = await e.authService.getBlossomSigner?.();
		if (l(e.signal), !t) throw new _();
		let n;
		try {
			let r = await t.getPublicKey(), i = Pa(e.destination, {
				getPublicKey: async () => {
					let e = await t.getPublicKey();
					if (e !== r) throw new _();
					return e;
				},
				signEvent: async (e) => {
					let n = ne(e);
					return ee(n.expectedTemplate, await t.signEvent(n.signerTemplate), r);
				}
			}, e.fetch, e.signal), a = Na(e.file), o = await me(a, globalThis.crypto.subtle, () => e.signal?.aborted ?? !1);
			l(e.signal);
			let s = a.size;
			n = ft({
				descriptor: await i.uploadBlob(a, e.file.type),
				expectedSha256: o,
				expectedSize: s,
				trustedServerUrl: e.destination.serverUrl
			});
		} catch (t) {
			if (t instanceof _) throw t;
			return l(e.signal), {
				success: !1,
				error: ja(t)
			};
		}
		let r = Aa(n);
		try {
			await Sa({
				url: n.url,
				mimeType: n.type,
				fetch: e.fetch,
				signal: e.signal
			});
		} catch (t) {
			return l(e.signal), {
				success: !1,
				error: t instanceof Error ? t.message : String(t),
				nip94: r.nip94
			};
		}
		return r;
	}
	async testConnection(e) {
		let t = e.sampleFile ?? new File([new Uint8Array([
			137,
			80,
			78,
			71
		])], "ehagaki-upload-test.png", { type: "image/png" }), n = await me(t), r = e.authService?.createBlossomConnectionTestAuthorization;
		if (e.authService?.buildBlossomAuthorizationHeader && !r) throw Error("Authentication required");
		let i = await e.authService?.createBlossomConnectionTestAuthorization?.({
			serverUrl: Da(e.destination),
			method: "upload",
			sha256: n,
			contentType: t.type || "image/png",
			contentLength: t.size
		}), a = await Ia({
			destination: e.destination,
			fetch: e.fetch,
			sha256: n,
			contentType: t.type || "image/png",
			contentLength: t.size,
			authorizationContext: i
		});
		if (!a) return {
			success: !1,
			message: "Blossom connection test failed",
			capabilities: Ra(new Response(null, { status: 599 }), e.destination)
		};
		let o = Fa(a.status) ? { supportedMimeTypes: await La({
			destination: e.destination,
			fetch: e.fetch,
			sha256: n,
			contentLength: t.size,
			authorizationContext: i
		}) } : void 0;
		return a.ok || a.status === 401 || a.status === 403 ? {
			success: a.ok,
			status: a.status,
			message: a.ok ? void 0 : "Authentication is required or was rejected",
			capabilities: Ra(a, e.destination, o)
		} : {
			success: !1,
			status: a.status,
			message: a.headers.get("X-Reason") ?? `Blossom connection test failed: ${a.status}`,
			capabilities: Ra(a, e.destination, o)
		};
	}
}, Ba = class {
	protocol = "custom-http";
	async upload(e) {
		l(e.signal);
		let t = new FormData();
		t.append("file", e.file);
		let n = await e.fetch(e.destination.resolvedUploadUrl || e.destination.serverUrl, {
			method: "POST",
			body: t,
			...e.signal ? { signal: e.signal } : {}
		});
		if (l(e.signal), !n.ok) return {
			success: !1,
			error: `Custom HTTP upload failed: ${n.status}`
		};
		let r = await n.json().catch(() => null);
		l(e.signal);
		let i = typeof r?.url == "string" ? r.url : "";
		return i ? {
			success: !0,
			url: i
		} : {
			success: !1,
			error: "Could not extract URL from custom HTTP response"
		};
	}
	async testConnection(e) {
		let t = await e.fetch(e.destination.serverUrl, { method: "HEAD" });
		return {
			success: t.ok,
			status: t.status,
			message: t.ok ? void 0 : `Custom HTTP connection test failed: ${t.status}`,
			capabilities: {
				...e.destination.capabilities,
				lastCheckedAt: Date.now(),
				source: "test"
			}
		};
	}
};
// D:/ドキュメント/GitHub/ehagaki/src/lib/upload/nip96Discovery.ts
async function Q(e) {
	let t = /* @__PURE__ */ new Set(), n = e.trustedUploadUrl;
	for (let r = 0; r <= 3; r += 1) {
		l(e.signal);
		let i = new URL("/.well-known/nostr/nip96.json", n.url).toString();
		if (t.has(i)) throw Error("NIP-96 discovery delegation loop detected");
		t.add(i);
		let a = await e.fetch(i, {
			method: "GET",
			credentials: "omit",
			referrerPolicy: "no-referrer",
			redirect: "error",
			signal: e.signal
		});
		if (l(e.signal), !a.ok) throw _t(a, !1);
		let o = await vt(a);
		if (l(e.signal), !U(o)) throw Error("Invalid NIP-96 config response");
		let s = typeof o.delegated_to_url == "string" ? o.delegated_to_url.trim() : "";
		if (s) {
			if (r === 3) throw Error("NIP-96 discovery delegation limit exceeded");
			n = Be({
				rawUrl: s,
				trustedUploadUrl: e.trustedUploadUrl
			});
			continue;
		}
		if (typeof o.api_url != "string" || !o.api_url.trim()) throw Error("NIP-96 config is missing api_url");
		let c = Be({
			rawUrl: o.api_url,
			trustedUploadUrl: e.trustedUploadUrl
		}).url;
		return {
			config: o,
			status: a.status,
			apiUrl: c
		};
	}
	throw Error("Invalid NIP-96 discovery response");
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/upload/nip96MediaManagement.ts
function Va(e) {
	if (!Array.isArray(e.tags)) return null;
	let t = /* @__PURE__ */ new Map();
	for (let n of e.tags) {
		if (!Array.isArray(n) || typeof n[0] != "string" || typeof n[1] != "string") continue;
		let e = t.get(n[0]);
		t.set(n[0], e !== void 0 && e !== n[1] ? null : n[1]);
	}
	return t;
}
async function Ha(e) {
	if (e.context) return q(e, e.context), e.context;
	let t;
	try {
		t = I(L(e.destination));
	} catch {
		throw new H("invalidDestination");
	}
	let { apiUrl: n } = await Q({
		trustedUploadUrl: t,
		fetch: e.fetch,
		signal: e.signal
	});
	return K(e), {
		protocol: "nip96",
		destinationId: e.destination.id,
		serverUrl: e.destination.serverUrl,
		endpoint: n
	};
}
async function Ua(e) {
	if (K(e), e.destination.protocol !== "nip96" || e.page && e.page.protocol !== "nip96") throw new H("invalidDestination");
	let t = await Ha(e), n = e.page?.protocol === "nip96" ? e.page.page : 0, r = e.page?.protocol === "nip96" ? e.page.count : 24;
	if (!Number.isSafeInteger(n) || n < 0 || !Number.isSafeInteger(r) || r < 1) throw new H("invalidResponse");
	let i = new URL(t.endpoint);
	i.searchParams.set("page", String(n)), i.searchParams.set("count", String(r));
	let a = i.toString(), o = await J(e, a, "GET", await gt(e, () => e.authService.buildAuthHeader(a, "GET"))), s = await vt(o);
	if (K(e), o.status !== 200 || !U(s) || !Array.isArray(s.files) || G(s.page) !== n || !G(s.count) || G(s.total) === void 0 || s.files.length > Number(s.count) || n * Number(s.count) + s.files.length > Number(s.total) || e.page && s.count !== r || s.files.length === 0 && n * Number(s.count) < Number(s.total)) throw new H("invalidResponse");
	let c = [], l = 0, u = 0;
	return s.files.forEach((e, r) => {
		if (!U(e)) {
			u++;
			return;
		}
		let i = Va(e);
		if (!i) {
			u++;
			return;
		}
		let a = i.get("size"), o = bt({
			url: i.get("url"),
			mime: i.get("m"),
			hash: i.get("ox"),
			size: typeof a == "string" && /^\d+$/.test(a) ? Number(a) : void 0,
			uploaded: e.created_at
		}, t, `${t.destinationId}:${n}:${r}`);
		o ? (c.push(o), o.url && o.deleteId || u++) : l++;
	}), {
		items: c,
		rawCount: s.files.length,
		excludedCount: l,
		invalidCount: u,
		context: t,
		nextPage: (n + 1) * Number(s.count) < Number(s.total) ? {
			protocol: "nip96",
			page: n + 1,
			count: Number(s.count)
		} : null
	};
}
async function Wa(e) {
	if (q(e, e.context), e.context.protocol !== "nip96") throw new H("invalidDestination");
	let t = ht(e.item, e.context), n = new URL(e.context.endpoint);
	n.pathname = `${n.pathname.replace(/\/$/, "")}/${t}`;
	let r = n.toString(), i = await J(e, r, "DELETE", await gt(e, () => e.authService.buildAuthHeader(r, "DELETE"))), a = await vt(i, !0);
	if (i.status !== 200 || !U(a) || a.status !== "success") throw new H("unknownDelete");
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/upload/Nip96UploadAdapter.ts
function Ga(e, t) {
	if (e instanceof N) {
		let n = t === "destination" ? "nip96InvalidDestinationUrl" : t === "processing" ? "nip96InvalidProcessingUrl" : e.code === "insecure-media-url" ? "nip96InsecureMediaUrl" : "nip96InvalidMediaUrl";
		return {
			error: e.message,
			errorCode: n
		};
	}
	return e instanceof ma ? {
		error: e.message,
		errorCode: e.reason === "inconclusive" ? "nip96MediaAvailabilityUnverified" : "nip96MediaAvailabilityTimeout"
	} : { error: e instanceof Error ? e.message : String(e) };
}
function Ka(e) {
	return e.resolvedUploadUrl || e.serverUrl;
}
function $(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function qa(e) {
	return Array.isArray(e);
}
function Ja(e) {
	let t = {};
	if (!$(e) || !$(e.nip94_event) || !qa(e.nip94_event.tags)) return t;
	for (let n of e.nip94_event.tags) {
		if (!qa(n) || n.length < 2) continue;
		let e = String(n[0]), r = n.slice(1).join(" ");
		e in t || (t[e] = r);
	}
	return t;
}
async function Ya(e) {
	let t = Date.now(), n = e.maxWaitTime ?? y.MAX_WAIT_TIME;
	for (;;) {
		if (l(e.signal), Date.now() - t > n) throw Error(y.TIMEOUT_MESSAGE);
		let r = await e.fetch(e.processingUrl, {
			method: "GET",
			...e.authHeader ? { headers: { Authorization: e.authHeader } } : {},
			...e.signal ? { signal: e.signal } : {},
			credentials: "omit",
			referrerPolicy: "no-referrer",
			redirect: "error"
		});
		if (l(e.signal), r.status === 404) {
			await s(y.RETRY_INTERVAL, e.signal);
			continue;
		}
		if (!r.ok) throw Error(`Unexpected status code ${r.status} while polling processing_url`);
		let i = await r.json().catch(() => null);
		if (l(e.signal), r.status === 201 && i) return i;
		if ($(i) && i.status === "processing") await s(y.RETRY_INTERVAL, e.signal);
		else {
			if ($(i) && i.status === "success") return i;
			if ($(i) && i.status === "error") throw Error(typeof i.message == "string" && i.message ? i.message : "File processing failed");
			if (r.status === 200) return i;
			throw Error("Unexpected processing status");
		}
	}
}
function Xa(e, t) {
	let n = new FormData();
	return n.append("file", e), t?.caption && n.append("caption", String(t.caption)), t?.expiration !== void 0 && n.append("expiration", String(t.expiration)), n.append("size", String(e.size)), t?.alt && n.append("alt", String(t.alt)), t?.media_type && n.append("media_type", String(t.media_type)), n.append("content_type", t?.content_type ? String(t.content_type) : e.type || ""), n.append("no_transform", t?.no_transform ? String(t.no_transform) : "true"), n;
}
function Za(e, t) {
	let n = $(e) && $(e.plans) ? e.plans : void 0, r = n && $(n.free) ? n.free : void 0, i = $(e) && $(e.api) ? e.api : void 0, a = Number(r?.max_byte_size) || Number(i?.max_byte_size) || null, o = $(e) ? e.content_types : void 0;
	return {
		maxUploadSize: a,
		supportedMimeTypes: qa(o) ? o.filter((e) => typeof e == "string") : [],
		supportsDelete: !0,
		supportsList: !0,
		supportsMirror: !1,
		supportsMediaOptimization: !1,
		authRequired: r?.is_nip98_required !== !1,
		lastCheckedAt: t,
		source: "protocol-discovery",
		raw: e
	};
}
var Qa = class {
	protocol = "nip96";
	listMediaPage = Ua;
	deleteMedia = Wa;
	async upload(e) {
		l(e.signal);
		let t;
		try {
			if (e.destination.nip96UrlMode === "discovery") {
				let { apiUrl: n } = await Q({
					trustedUploadUrl: I(He(L(e.destination))),
					fetch: e.fetch,
					signal: e.signal
				});
				t = I(n);
			} else t = I(Ka(e.destination));
		} catch (t) {
			return l(e.signal), {
				success: !1,
				...Ga(t, "destination")
			};
		}
		let n = t.url, r = await e.authService.buildAuthHeader(n, "POST");
		l(e.signal);
		let i;
		try {
			i = await e.fetch(n, {
				method: "POST",
				headers: { Authorization: r },
				body: Xa(e.file, e.metadata),
				redirect: "error",
				...e.signal ? { signal: e.signal } : {}
			});
		} catch {
			return l(e.signal), {
				success: !1,
				errorCode: "nip96UploadRequestBlocked",
				error: "The upload request could not be completed safely"
			};
		}
		if (l(e.signal), !i.ok) {
			let t = await i.text().catch(() => "Unknown error");
			return l(e.signal), {
				success: !1,
				error: `Upload failed: ${i.status} ${i.statusText} - ${t}`
			};
		}
		let a;
		try {
			a = await i.json(), l(e.signal);
		} catch (t) {
			return e.devMode && console.error("[dev] JSON parse error:", t), {
				success: !1,
				error: "Could not parse upload response"
			};
		}
		if (!$(a)) return {
			success: !1,
			error: "Could not parse upload response"
		};
		if ((i.status === 200 || i.status === 202) && typeof a.processing_url == "string" && a.processing_url) try {
			let n = ze({
				rawUrl: a.processing_url,
				trustedUploadUrl: t
			}), r = n.sameOrigin ? await e.authService.buildAuthHeader(n.url, "GET") : void 0;
			a = await Ya({
				processingUrl: n.url,
				authHeader: r,
				fetch: e.fetch,
				signal: e.signal
			}), l(e.signal);
		} catch (t) {
			if (t instanceof _) throw t;
			return l(e.signal), {
				success: !1,
				...Ga(t, "processing")
			};
		}
		if (!$(a)) return {
			success: !1,
			error: "Could not parse upload response"
		};
		let o = Ja(a);
		if (a.status === "success" && $(a.nip94_event) && qa(a.nip94_event.tags) && o.url) {
			try {
				let n = Ve({
					rawUrl: o.url,
					trustedUploadUrl: t
				});
				o.url = n.url, await Sa({
					url: n.url,
					mimeType: e.file.type,
					fetch: e.fetch,
					signal: e.signal
				});
			} catch (t) {
				return l(e.signal), {
					success: !1,
					...Ga(t, "media"),
					nip94: Object.keys(o).length ? o : void 0
				};
			}
			return {
				success: !0,
				url: o.url,
				nip94: o
			};
		}
		return {
			success: !1,
			error: typeof a.message == "string" && a.message ? a.message : "Could not extract URL from response",
			nip94: Object.keys(o).length ? o : void 0
		};
	}
	async testConnection(e) {
		try {
			let { config: t, status: n } = await Q({
				trustedUploadUrl: I(L(e.destination)),
				fetch: e.fetch
			});
			return {
				success: !0,
				status: n,
				capabilities: Za(t, Date.now())
			};
		} catch (e) {
			return {
				success: !1,
				message: e instanceof Error ? e.message : String(e)
			};
		}
	}
}, $a = {
	blossom: new za(),
	nip96: new Qa(),
	"custom-http": new Ba()
};
function eo(e) {
	return $a[e];
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/upload/uploadDestinationResolver.ts
var to = "blossom.band";
function no(e, t) {
	let { [t]: n, ...r } = e;
	return r;
}
function ro(e) {
	if (e.npub?.startsWith("npub1")) return e.npub;
	if (!e.pubkeyHex) return null;
	try {
		return i.npubEncode(e.pubkeyHex);
	} catch {
		return null;
	}
}
function io(e) {
	let t = ro(e);
	return t ? `https://${t}.${to}` : null;
}
function ao(e) {
	let t = A(e);
	if (!t?.resolvedUploadUrl) return e;
	let n = e.resolvedUploadUrl, r = n ? k(n) : "";
	return n && r !== k(t.serverUrl) && r !== k(t.resolvedUploadUrl) || n === t.resolvedUploadUrl ? e : {
		...e,
		resolvedUploadUrl: t.resolvedUploadUrl
	};
}
function oo(e, t) {
	if (e = w(e), e.protocol === "nip96") return e.nip96UrlMode === "discovery" ? e : ao(e);
	let n = no(e, "resolvedUploadUrl");
	if (e.protocol !== "blossom" || e.presetId !== "blossom-band") return n;
	let r = io(t);
	return r ? {
		...n,
		serverUrl: r
	} : n;
}
export { Ce as _, wt as a, w as b, Xe as c, I as d, Ve as f, j as g, D as h, xt as i, L as l, x as m, eo as n, yt as o, Pe as p, Q as r, H as s, oo as t, He as u, A as v, k as x, E as y };
