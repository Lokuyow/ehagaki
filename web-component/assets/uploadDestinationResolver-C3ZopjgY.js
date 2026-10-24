import { i as e } from "./rolldown-runtime-CwxnZyOB.js";
import { i as t } from "./appRuntimeEnvironment-BvtUCHcA.js";
import { o as n, u as r } from "./base-CVnVyhoG.js";
import { l as i, n as a } from "./relayConfigUtils-DD5f1UAM.js";
import { t as o } from "./ipaddr-DyB8nsdz.js";
import { i as s, n as c, r as l, t as u } from "./uploadOperation-BVOBq-hD.js";
import { a as d, d as ee, f, h as te, i as ne, n as re, o as ie, p as ae, r as p, t as oe, u as se, v as ce } from "./signedEventResultValidator-BsR3Zf_8.js";
import { r as m } from "./authStore.svelte-CoGdd5_Z.js";
import { Ct as le, bt as h, h as ue, wt as de, xt as g, yt as fe } from "./appUtils-Bsk0mFqn.js";
import { t as pe } from "./embedMessageTrustGate-CPsA4Yuc.js";
import { c as _, n as me } from "./nip46Service-Dm-_k9SF.js";
import { c as he, o as ge } from "./legacyImportMarkers-CZ4J2IrE.js";
import { t as _e } from "./fileUtils-D6N6n-4t.js";
var ve = "__ehagaki_global__", v = {
	maxUploadSize: null,
	supportedMimeTypes: [],
	supportsDelete: !1,
	supportsList: !1,
	supportsMirror: !1,
	supportsMediaOptimization: !1,
	authRequired: !0,
	source: "preset"
}, ye = {
	"https://nostr.build/api/v2/nip96/upload": "nostr-build",
	"https://share.yabu.me/api/v2/media": "share-yabu-me",
	"https://nostpic.com/api/v2/media": "nostpic-com",
	"https://nostrcheck.me/api/v2/media": "nostrcheck-me",
	"https://files.sovbit.host/api/v2/media": "files-sovbit-host"
}, be = {
	"https://share.yabu.me/api/v2/media": "https://yabu.me/api/v2/media",
	"https://nostrcheck.me/api/v2/media": "https://cdn.nostrcheck.me/",
	"https://nostr.build/api/v2/nip96/upload": "https://nostr.build/api/v2/nip96/upload",
	"https://nostpic.com/api/v2/media": "https://nostpic.com/api/v2/media",
	"https://files.sovbit.host/api/v2/media": "https://files.sovbit.host/upload"
};
function y(e) {
	let t = de.find((t) => t.url === e);
	if (!t) throw Error(`Missing NIP-96 upload endpoint preset: ${e}`);
	return {
		id: ye[t.url] ?? "custom",
		name: t.label,
		protocol: "nip96",
		serverUrl: t.url,
		resolvedUploadUrl: be[t.url] ?? t.url,
		capabilities: {
			...v,
			supportedMimeTypes: ["image/*", "video/*"],
			source: "preset"
		}
	};
}
function b(e) {
	if (!e) return null;
	try {
		return new URL(w(e)).host || null;
	} catch {
		return null;
	}
}
function x(e) {
	let t = T(e);
	return t ? t.name : e.presetId && e.presetId !== "custom" ? b(e.serverUrl) ?? e.fallbackName?.trim() ?? w(e.serverUrl) ?? "Custom NIP-96" : b(e.resolvedUploadUrl) ?? b(e.serverUrl) ?? e.fallbackName?.trim() ?? w(e.serverUrl) ?? "Custom NIP-96";
}
function xe(e) {
	return e === "ja" ? ["share-yabu-me", "blossom-band"] : ["blossom-band", "share-yabu-me"];
}
function Se(e) {
	for (let t of xe(e)) {
		let e = S.find((e) => e.id === t);
		if (e) return e;
	}
	return S[0] ?? null;
}
var S = [
	y("https://share.yabu.me/api/v2/media"),
	{
		id: "cdn-nostrcheck-me",
		name: "cdn.nostrcheck.me",
		protocol: "blossom",
		serverUrl: "https://cdn.nostrcheck.me",
		capabilities: { ...v }
	},
	y("https://nostrcheck.me/api/v2/media"),
	{
		id: "blossom-band",
		name: "blossom.band",
		protocol: "blossom",
		serverUrl: "https://blossom.band",
		capabilities: {
			...v,
			supportsDelete: !0,
			supportsList: !1
		}
	},
	{
		id: "nostr-download",
		name: "nostr.download",
		protocol: "blossom",
		serverUrl: "https://nostr.download",
		capabilities: { ...v }
	},
	{
		id: "blossom-primal-net",
		name: "blossom.primal.net",
		protocol: "blossom",
		serverUrl: "https://blossom.primal.net",
		capabilities: { ...v }
	},
	y("https://nostr.build/api/v2/nip96/upload"),
	y("https://nostpic.com/api/v2/media"),
	y("https://files.sovbit.host/api/v2/media")
];
function Ce() {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `upload-destination-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function C(e) {
	return e || "__ehagaki_global__";
}
function w(e) {
	let t = e.trim();
	if (!t) return "";
	try {
		let e = new URL(t);
		return e.hash = "", e.toString().replace(/\/$/, "");
	} catch {
		return t;
	}
}
function we(e) {
	if (!e) return null;
	let t = w(e);
	return S.find((e) => w(e.serverUrl) === t) || (S.find((e) => e.resolvedUploadUrl && w(e.resolvedUploadUrl) === t) ?? null);
}
function T(e) {
	if (!e.presetId || e.presetId === "custom") return null;
	let t = S.find((t) => t.id === e.presetId);
	if (!t || t.protocol !== e.protocol) return null;
	let n = w(e.serverUrl);
	return w(t.serverUrl) === n || t.resolvedUploadUrl !== void 0 && w(t.resolvedUploadUrl) === n ? t : null;
}
function E(e) {
	let t = e.now ?? Date.now(), n = w(e.preset.serverUrl);
	return {
		id: Ce(),
		pubkeyHex: e.pubkeyHex ?? null,
		name: x({
			serverUrl: n,
			resolvedUploadUrl: e.preset.resolvedUploadUrl,
			fallbackName: e.preset.name,
			protocol: e.preset.protocol,
			presetId: e.preset.id
		}),
		protocol: e.preset.protocol,
		serverUrl: n,
		...e.preset.resolvedUploadUrl ? { resolvedUploadUrl: e.preset.resolvedUploadUrl } : {},
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
function D(e) {
	let t = e.endpoint.trim(), n = t ? we(t) : Se(e.locale);
	if (n) return E({
		preset: n,
		pubkeyHex: e.pubkeyHex,
		isDefault: !0,
		now: e.now
	});
	let r = t || le(e.locale), i = e.now ?? Date.now();
	return {
		id: Ce(),
		pubkeyHex: e.pubkeyHex ?? null,
		name: x({
			serverUrl: r,
			fallbackName: "Custom NIP-96"
		}),
		protocol: "nip96",
		serverUrl: w(r),
		resolvedUploadUrl: r,
		presetId: "custom",
		isDefault: !0,
		enabled: !0,
		createdAt: i,
		updatedAt: i,
		capabilities: {
			...v,
			supportedMimeTypes: ["image/*", "video/*"]
		},
		auth: { type: "nip98" },
		schemaVersion: 1
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/embedIndexedDbService.ts
var Te = 1e3, Ee = /* @__PURE__ */ new Set(["uploadDestinations"]);
function De() {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `idb-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function Oe(e) {
	return typeof e == "string" && Ee.has(e);
}
function ke(e) {
	return typeof e == "string" && e.trim().length > 0;
}
function Ae(e) {
	return Array.isArray(e) && e.every((e) => typeof e == "string");
}
function je(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	return (typeof t.maxUploadSize == "number" || t.maxUploadSize === null) && Ae(t.supportedMimeTypes) && typeof t.supportsDelete == "boolean" && typeof t.supportsList == "boolean" && typeof t.supportsMirror == "boolean" && typeof t.supportsMediaOptimization == "boolean" && typeof t.authRequired == "boolean" && typeof t.source == "string" && (t.lastCheckedAt === void 0 || typeof t.lastCheckedAt == "number");
}
function Me(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e, n = t.auth;
	return typeof t.id == "string" && (typeof t.pubkeyHex == "string" || t.pubkeyHex === null) && typeof t.scopeKey == "string" && (t.scopeKey === "__ehagaki_global__" || t.scopeKey === t.pubkeyHex) && typeof t.name == "string" && typeof t.protocol == "string" && typeof t.serverUrl == "string" && (t.resolvedUploadUrl === void 0 || typeof t.resolvedUploadUrl == "string") && (t.presetId === void 0 || typeof t.presetId == "string") && typeof t.isDefault == "boolean" && typeof t.enabled == "boolean" && (t.sortIndex === void 0 || typeof t.sortIndex == "number") && typeof t.createdAt == "number" && typeof t.updatedAt == "number" && je(t.capabilities) && typeof n == "object" && !!n && typeof n.type == "string" && t.schemaVersion === 1;
}
function Ne(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	return typeof t.timestamp != "number" || !Oe(t.store) || !ke(t.scopeKey) || t.applied !== void 0 && typeof t.applied != "boolean" ? !1 : t.records === void 0 ? !0 : Array.isArray(t.records) ? t.store === "uploadDestinations" && t.records.every(Me) : !1;
}
function Pe(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	return typeof t.timestamp == "number" && typeof t.code == "string" && t.code.trim().length > 0 && (t.message === void 0 || typeof t.message == "string") && (t.store === void 0 || Oe(t.store)) && (t.scopeKey === void 0 || ke(t.scopeKey));
}
var O = new class {
	windowObj;
	console;
	requestTimeoutMs;
	trustedParentOrigin = null;
	isListening = !1;
	pendingRequests = /* @__PURE__ */ new Map();
	constructor(e = typeof window < "u" ? window : {}, t = typeof window < "u" ? window.console : {}, n = Te) {
		this.windowObj = e, this.console = t, this.requestTimeoutMs = n;
	}
	initialize(e = {}) {
		if (!this.isInIframe()) return !1;
		let t = e.parentOrigin ?? ae(e.locationSearch ?? this.windowObj.location?.search);
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
		let n = De(), r = new Promise((e, r) => {
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
				namespace: ee,
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
		let t = pe(e, this.windowObj, this.trustedParentOrigin);
		if (!t || t.type !== "idb.result" && t.type !== "idb.error") return;
		if (f(t.type) && !te(t.requestId)) {
			this.console.warn("requestId がない idb response を無視:", t);
			return;
		}
		if (!t.requestId) return;
		let n = this.pendingRequests.get(t.requestId);
		if (n) {
			if (t.type === "idb.result") {
				if (!Ne(t.payload)) {
					this.console.warn("不正な idb.result payload を無視:", t.payload);
					return;
				}
				clearTimeout(n.timeoutId), this.pendingRequests.delete(t.requestId), n.resolve(t.payload);
			} else Pe(t.payload) ? (clearTimeout(n.timeoutId), this.pendingRequests.delete(t.requestId), n.reject(t.payload)) : this.console.warn("不正な idb.error payload を無視:", t.payload);
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
}(), Fe = {
	async getSnapshot(e) {
		return O.getUploadDestinationsSnapshot(e);
	},
	async setSnapshot(e, t) {
		await O.setUploadDestinationsSnapshot(e, t);
	}
};
function Ie(e) {
	if (e !== void 0) try {
		return JSON.parse(JSON.stringify(e));
	} catch {
		return;
	}
}
function Le(e) {
	let t = Ie(e.raw);
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
function Re(e) {
	return {
		id: e.id,
		pubkeyHex: e.pubkeyHex ?? null,
		name: x({
			serverUrl: e.serverUrl,
			resolvedUploadUrl: e.resolvedUploadUrl,
			fallbackName: e.name,
			protocol: e.protocol,
			presetId: e.presetId
		}),
		protocol: e.protocol,
		serverUrl: e.serverUrl.trim(),
		...e.resolvedUploadUrl ? { resolvedUploadUrl: e.resolvedUploadUrl } : {},
		...e.presetId ? { presetId: e.presetId } : {},
		isDefault: !!e.isDefault,
		enabled: !!e.enabled,
		...e.sortIndex === void 0 ? {} : { sortIndex: e.sortIndex },
		createdAt: e.createdAt,
		updatedAt: e.updatedAt,
		capabilities: Le(e.capabilities),
		auth: { type: e.auth.type },
		schemaVersion: 1
	};
}
function k(e) {
	let t = Re(e);
	return {
		...t,
		scopeKey: C(t.pubkeyHex),
		schemaVersion: 1
	};
}
function ze(e) {
	if (e.protocol !== "blossom") return e;
	let t = we(e.serverUrl);
	if (!t || t.id !== "share-yabu-me") return e;
	let n = E({
		preset: t,
		pubkeyHex: e.pubkeyHex,
		isDefault: e.isDefault,
		now: e.updatedAt
	});
	return {
		...e,
		name: x({
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
function A(e) {
	let { scopeKey: t, ...n } = e, r = ze(n), i = T(r);
	return i ? {
		...r,
		name: i.name
	} : r;
}
function j(e, t) {
	if (e.enabled !== t.enabled) return e.enabled ? -1 : 1;
	let n = e.sortIndex ?? e.createdAt, r = t.sortIndex ?? t.createdAt;
	return n === r ? e.createdAt === t.createdAt ? e.name.localeCompare(t.name) : e.createdAt - t.createdAt : n - r;
}
function Be(e, t) {
	return e.resolvedUploadUrl === t || e.serverUrl === t;
}
function Ve(e, t, n) {
	if (t.protocol !== "nip96" || t.createdAt !== t.updatedAt) return null;
	for (let r of xe(n)) {
		let n = e.filter((e) => e.enabled && e.presetId === r && e.updatedAt > t.updatedAt).sort((e, t) => t.updatedAt - e.updatedAt);
		if (n[0]) return n[0];
	}
	return null;
}
var He = new class {
	db;
	now;
	getStorage;
	parentSync;
	getNavigator;
	syncedParentScopes = /* @__PURE__ */ new Set();
	parentMissingScopes = /* @__PURE__ */ new Set();
	constructor(e = he, n = Date.now, r = () => t(), i = Fe, a = () => typeof navigator < "u" ? navigator : { language: "en" }) {
		this.db = e, this.now = n, this.getStorage = r, this.parentSync = i, this.getNavigator = a;
	}
	async getAll(e = null) {
		await this.loadParentSnapshot(e), await this.ensureUserScopeInitialized(e), await this.ensureLegacyUploadEndpointMigrated(e);
		let t = C(e), n = await this.db.uploadDestinations.where("scopeKey").equals(t).toArray();
		return await this.persistParentSnapshotIfMissing(t, n), n.map(A).sort(j);
	}
	async getDefault(e = null) {
		let t = await this.getAll(e), n = this.getLocale(), r = t.find((e) => e.enabled && e.isDefault);
		if (r) {
			let i = Ve(t, r, n);
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
		let a = D({
			endpoint: this.getStorage().getItem(fe.UPLOAD_ENDPOINT) ?? "",
			locale: n,
			pubkeyHex: e,
			now: this.now()
		});
		return await this.put(a), a;
	}
	async put(e) {
		let t = {
			...Re(e),
			updatedAt: e.updatedAt || this.now()
		};
		await this.db.transaction("rw", this.db.uploadDestinations, async () => {
			t.isDefault && await this.clearDefault(t.pubkeyHex), await this.db.uploadDestinations.put(k(t));
		}), await this.persistParentSnapshot(C(t.pubkeyHex));
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
		let r = C(n), i = (await this.db.uploadDestinations.where("scopeKey").equals(r).toArray()).map(A).sort(j), a = i.findIndex((t) => t.id === e), o = t === "up" ? a - 1 : a + 1;
		if (a < 0 || o < 0 || o >= i.length) return;
		let s = [...i];
		[s[a], s[o]] = [s[o], s[a]];
		let c = this.now();
		await this.db.transaction("rw", this.db.uploadDestinations, async () => {
			await Promise.all(s.map((t, n) => this.db.uploadDestinations.put(k({
				...t,
				sortIndex: n,
				updatedAt: t.id === e ? c : t.updatedAt
			}))));
		}), await this.persistParentSnapshot(r);
	}
	async replaceBlossomServers(e, t) {
		let n = C(e);
		await this.loadParentSnapshot(e), await this.ensureUserScopeInitialized(e);
		let r = (await this.db.uploadDestinations.where("scopeKey").equals(n).toArray()).map(A).sort(j), i = r.filter((e) => e.protocol !== "blossom"), a = new Map(r.filter((e) => e.protocol === "blossom").map((e) => [w(e.serverUrl), e])), o = r.some((e) => e.protocol === "blossom" && e.isDefault), s = i.some((e) => e.isDefault), c = this.now(), l = [...new Set(t.map(w).filter((e) => !!e))].map((t, n) => ({
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
			await this.db.uploadDestinations.where("scopeKey").equals(n).delete(), u.length > 0 && await this.db.uploadDestinations.bulkPut(u.map(k));
		}), await this.persistParentSnapshot(n), u.sort(j);
	}
	async setDefault(e, t = null) {
		let n = C(t), r = this.now();
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
	async applyUploadEndpointPreference({ endpoint: e, mode: t, pubkeyHex: n = null }) {
		let r = C(n);
		await this.loadParentSnapshot(n);
		let i = await this.db.uploadDestinations.where("scopeKey").equals(r).toArray();
		if (t === "default" && i.some((e) => e.enabled)) {
			await this.persistParentSnapshotIfMissing(r, i);
			let e = i.map(A);
			return e.find((e) => e.enabled && e.isDefault) ?? e.find((e) => e.enabled) ?? null;
		}
		let a = i.map(A).find((t) => Be(t, e));
		if (a) return await this.setDefault(a.id, n), await this.markLegacyUploadEndpointMigrated(r), {
			...a,
			isDefault: !0,
			enabled: !0
		};
		let o = D({
			endpoint: e,
			locale: this.getLocale(),
			pubkeyHex: n,
			now: this.now()
		});
		return await this.put(o), await this.markLegacyUploadEndpointMigrated(r), o;
	}
	async clearDefault(e) {
		let t = C(e), n = await this.db.uploadDestinations.where("scopeKey").equals(t).toArray();
		await Promise.all(n.filter((e) => e.isDefault).map((e) => this.db.uploadDestinations.put({
			...e,
			isDefault: !1
		})));
	}
	async ensureLegacyUploadEndpointMigrated(e) {
		let t = C(e);
		if ((await this.db.legacyImportState.get(this.getLegacyUploadEndpointMigrationKey(t)))?.done === !0) return;
		if (await this.db.uploadDestinations.where("scopeKey").equals(t).count() > 0) {
			await this.markLegacyUploadEndpointMigrated(t);
			return;
		}
		let n = D({
			endpoint: this.getStorage().getItem(fe.UPLOAD_ENDPOINT) ?? "",
			locale: this.getLocale(),
			pubkeyHex: e === "__ehagaki_global__" ? null : e,
			now: this.now()
		});
		await this.db.transaction("rw", this.db.uploadDestinations, this.db.legacyImportState, async () => {
			(await this.db.legacyImportState.get(this.getLegacyUploadEndpointMigrationKey(t)))?.done !== !0 && (await this.db.uploadDestinations.where("scopeKey").equals(t).count() === 0 && await this.db.uploadDestinations.put(k(n)), await this.db.legacyImportState.put({
				id: this.getLegacyUploadEndpointMigrationKey(t),
				done: !0,
				updatedAt: this.now()
			}));
		});
	}
	async ensureUserScopeInitialized(e) {
		if (!e) return;
		let t = C(e);
		if (await this.db.uploadDestinations.where("scopeKey").equals(t).count() > 0) {
			await this.markLegacyUploadEndpointMigrated(t);
			return;
		}
		await this.ensureLegacyUploadEndpointMigrated(null);
		let n = await this.db.uploadDestinations.where("scopeKey").equals(ve).toArray();
		if (n.length === 0) return;
		let r = this.now(), i = n.map(A).sort(j).map((t, n) => k({
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
		return ge(e);
	}
	getLocale() {
		return ue(this.getStorage(), this.getNavigator());
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
		let t = C(e);
		if (!this.syncedParentScopes.has(t)) {
			this.syncedParentScopes.add(t);
			try {
				let e = await this.parentSync.getSnapshot(t);
				if (e === null) {
					this.parentMissingScopes.add(t);
					return;
				}
				let n = e.filter((e) => e.scopeKey === t).map((e) => k(A(e)));
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
			await this.parentSync.setSnapshot(e, n.map((e) => k(A(e))));
		} catch {}
	}
}(), Ue = 22242;
function We(e, t) {
	return {
		kind: Ue,
		created_at: Math.floor(Date.now() / 1e3),
		tags: [["relay", e], ["challenge", t]],
		content: ""
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/upload/blossomAuthorization.ts
var Ge = new TextEncoder(), Ke = new TextDecoder("utf-8", { fatal: !0 });
function qe(e) {
	let t = "", n = 32768;
	for (let r = 0; r < e.length; r += n) t += String.fromCharCode(...e.subarray(r, r + n));
	return btoa(t);
}
function Je(e) {
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
function Ye(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw Error("Invalid Blossom authorization");
	let t = e;
	if (typeof t.id != "string" || typeof t.pubkey != "string" || typeof t.sig != "string" || typeof t.kind != "number" || typeof t.created_at != "number" || typeof t.content != "string" || !Array.isArray(t.tags)) throw Error("Invalid Blossom authorization");
}
function Xe(e) {
	if (typeof e != "string") throw Error("Invalid Blossom authorization");
	let t = e.trim().match(/^([^\s]+)[ \t]+([^\s]+)$/);
	if (!t || t[1].toLowerCase() !== "nostr") throw Error("Invalid Blossom authorization");
	let n = Je(t[2]), r;
	try {
		r = Ke.decode(n);
	} catch {
		throw Error("Invalid Blossom authorization");
	}
	try {
		Ye(JSON.parse(r));
	} catch {
		throw Error("Invalid Blossom authorization");
	}
	return n;
}
function Ze(e) {
	return qe(e).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function Qe(e) {
	return `Nostr ${Ze(Ge.encode(e))}`;
}
function $e(e) {
	return `Nostr ${Ze(Xe(e))}`;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/upload/nip96UrlPolicy.ts
var M = /* @__PURE__ */ e(o(), 1), N = class extends Error {
	code;
	constructor(e, t) {
		super(t), this.code = e, this.name = "Nip96UrlPolicyError";
	}
};
function et(e) {
	let t = e.indexOf("#");
	return t >= 0 ? e.slice(0, t) : e;
}
function tt(e) {
	return e.trim().replace(/^\[/, "").replace(/\]$/, "").split("%")[0];
}
function nt(e) {
	let t = e.trim().toLowerCase().replace(/\.$/, "");
	if (!t) return "local-or-private";
	if (t === "localhost" || t.endsWith(".localhost")) return "loopback";
	if (t.endsWith(".local")) return "local-or-private";
	let n = tt(t);
	if (M.isValid(n)) try {
		let e = M.parse(n);
		return e.kind() === "ipv6" && e.isIPv4MappedAddress() ? e.toIPv4Address().range() === "loopback" ? "loopback" : e.toIPv4Address().range() === "unicast" ? "public" : "local-or-private" : e.range() === "loopback" ? "loopback" : e.range() === "unicast" ? "public" : "local-or-private";
	} catch {
		return "local-or-private";
	}
	return t.includes(".") ? "public" : "local-or-private";
}
function P(e, t) {
	let n = et(e.trim());
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
		networkScope: nt(e.hostname)
	};
}
function I(e, t) {
	return e.origin === t.origin;
}
function L(e) {
	let { parsed: t } = P(e, "invalid-upload-destination-url");
	return F(t);
}
function rt(e) {
	let { parsed: t } = P(e.rawUrl, "invalid-processing-url"), n = F(t), r = I(n, e.trustedUploadUrl);
	if (!r && n.networkScope !== "public") throw new N("server-local-url-not-allowed", "The upload server returned a local or private processing URL");
	if (!r && n.protocol !== "https:") throw new N("invalid-processing-url", "Cross-origin processing URLs must use HTTPS");
	return {
		...n,
		sameOrigin: r
	};
}
function R(e) {
	let { parsed: t } = P(e.rawUrl, "invalid-processing-url"), n = F(t);
	if (I(n, e.trustedUploadUrl)) return n;
	if (n.networkScope !== "public" || n.protocol !== "https:") throw new N("server-local-url-not-allowed", "Discovery must not redirect to a local, private, or insecure URL");
	return n;
}
function z(e) {
	let { requestUrl: t, parsed: n } = P(e.rawUrl, "invalid-media-url"), r = F(n), i = I(r, e.trustedUploadUrl);
	if (!i && r.networkScope !== "public") throw new N("server-local-url-not-allowed", "The upload server returned a local or private media URL");
	let a = e.pageProtocol ?? (typeof location < "u" ? location.protocol : null), o = a === "https:" && r.protocol === "http:" && r.networkScope === "loopback" && i && e.trustedUploadUrl.networkScope === "loopback";
	if (a === "https:" && r.protocol === "http:" && !o) throw new N("insecure-media-url", "HTTP media URLs cannot be used from an HTTPS page");
	return {
		...r,
		url: t
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/upload/blossomDescriptor.ts
var B = class extends Error {
	constructor(e) {
		super(e), this.name = "BlossomDescriptorValidationError";
	}
};
function it(e) {
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
function at(e, t) {
	if (!e.trim()) throw new B(`Blossom descriptor ${t} is required`);
	let n;
	try {
		n = new URL(e.trim());
	} catch {
		throw new B(`Blossom descriptor ${t} must be an absolute HTTP(S) URL`);
	}
	if (n.protocol !== "http:" && n.protocol !== "https:") throw new B(`Blossom descriptor ${t} must use HTTP(S)`);
	if (n.username || n.password) throw new B(`Blossom descriptor ${t} must not include user information`);
	return n;
}
function ot(e) {
	let t = at(e.rawUrl, "url"), n = at(e.trustedServerUrl, "server URL"), r = t.origin === n.origin, i = it(t.hostname), a = it(n.hostname);
	if (!r && i !== "public") throw new B("Blossom descriptor URL must not target a cross-origin local or private host");
	if (!r && t.protocol !== "https:") throw new B("Cross-origin Blossom descriptor URLs must use HTTPS");
	let o = e.pageProtocol ?? (typeof location < "u" ? location.protocol : null), s = o === "https:" && t.protocol === "http:" && i === "loopback" && r && a === "loopback";
	if (o === "https:" && t.protocol === "http:" && !s) throw new B("HTTP Blossom descriptor URLs cannot be used from an HTTPS page");
	let c;
	try {
		c = decodeURIComponent(t.pathname);
	} catch {
		throw new B("Blossom descriptor URL contains an invalid blob path");
	}
	let l = c.slice(1);
	if (l.includes("/") || !l.startsWith(`${e.expectedSha256}.`) || l.length === e.expectedSha256.length + 1) throw new B("Blossom descriptor URL must identify the uploaded SHA-256 blob with a file extension");
	return t.hash = "", t.toString();
}
function st(e) {
	let t = e.descriptor;
	if (!t || typeof t != "object") throw new B("Blossom descriptor must be an object");
	if (typeof t.sha256 != "string" || t.sha256 !== e.expectedSha256) throw new B("Blossom descriptor sha256 does not match the uploaded blob");
	if (typeof t.size != "number" || !Number.isFinite(t.size) || t.size !== e.expectedSize) throw new B("Blossom descriptor size does not match the uploaded blob");
	if (typeof t.type != "string" || !t.type.trim()) throw new B("Blossom descriptor type must be a non-empty string");
	if (typeof t.uploaded != "number" || !Number.isFinite(t.uploaded) || t.uploaded <= 0) throw new B("Blossom descriptor uploaded must be a positive Unix timestamp");
	if (typeof t.url != "string") throw new B("Blossom descriptor url is required");
	return {
		url: ot({
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
function ct(e) {
	return {
		url: e.url,
		x: e.sha256,
		size: String(e.size),
		m: e.type
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/upload/mediaManagementTypes.ts
var V = class extends Error {
	code;
	status;
	diagnostic;
	retryAt;
	constructor(e, t, n, r) {
		super(e), this.code = e, this.status = t, this.diagnostic = n, this.retryAt = r, this.name = "UploadMediaError";
	}
};
// D:/ドキュメント/GitHub/ehagaki/src/lib/upload/mediaManagementUtils.ts
function H(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function U(e) {
	return typeof e == "string" && /^[a-f0-9]{64}$/i.test(e) ? e.toLowerCase() : null;
}
function W(e) {
	return typeof e == "number" && Number.isSafeInteger(e) && e >= 0 ? e : void 0;
}
function G(e) {
	if (l(e.signal), e.assertSession(), !U(e.expectedPubkey)) throw new V("authentication");
}
function lt(e) {
	try {
		let t = new URL(L(e).url);
		if (t.pathname !== "/" || t.search) throw Error();
		return t.origin;
	} catch {
		throw new V("invalidDestination");
	}
}
function K(e, t) {
	if (G(e), t.protocol !== e.destination.protocol || t.destinationId !== e.destination.id || t.serverUrl !== e.destination.serverUrl) throw new V("invalidDestination");
	try {
		let n = L(e.destination.serverUrl);
		if (R({
			rawUrl: t.endpoint,
			trustedUploadUrl: n
		}).url !== t.endpoint || t.protocol === "blossom" && t.endpoint !== `${lt(t.serverUrl)}/`) throw Error();
	} catch {
		throw new V("invalidDestination");
	}
}
function ut(e, t) {
	let n = U(e.deleteId?.sha256);
	if (!n || e.protocol !== t.protocol || e.deleteId?.protocol !== t.protocol || e.destinationId !== t.destinationId || e.serverUrl !== t.serverUrl) throw new V("invalidResponse");
	return n;
}
async function dt(e, t) {
	G(e);
	try {
		let n = await t();
		if (G(e), !n) throw new V("authentication");
		return n;
	} catch {
		throw l(e.signal), new V("authentication");
	}
}
function ft(e, t, n) {
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
	return new V(i, r, a || void 0, s !== void 0 && Number.isFinite(s) ? s : void 0);
}
async function q(e, t, n, r, i) {
	G(e);
	try {
		i?.();
	} catch {
		throw l(e.signal), new V("authentication");
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
		throw n === "GET" && l(e.signal), new V(n === "DELETE" ? "unknownDelete" : "network");
	}
	if (n === "GET" && G(e), !a.ok) throw ft(a, n === "GET", r);
	return a;
}
async function J(e, t = !1) {
	try {
		return await e.json();
	} catch {
		throw new V(t ? "unknownDelete" : "invalidResponse");
	}
}
function pt(e) {
	return e instanceof V ? e : new V(e instanceof p ? "authentication" : "network");
}
function mt(e, t, n) {
	let r = typeof e.mime == "string" ? e.mime.split(";")[0].trim().toLowerCase() : "", i = typeof e.url == "string" ? e.url : "", a = r ? /^image\/[a-z0-9!#$&^_.+-]+$/.test(r) ? "image" : /^video\/[a-z0-9!#$&^_.+-]+$/.test(r) ? "video" : "unknown" : e.mime === void 0 ? ie({ url: i }) : "unknown";
	if (a !== "image" && a !== "video") return null;
	let o = U(e.hash), s = null;
	try {
		t.protocol === "blossom" ? o && (s = ot({
			rawUrl: i,
			expectedSha256: o,
			trustedServerUrl: t.serverUrl
		})) : s = z({
			rawUrl: i,
			trustedUploadUrl: L(t.endpoint)
		}).url;
	} catch {}
	let c = W(e.size), l = W(e.uploaded);
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
var ht = class {
	operation;
	constructor(e) {
		this.operation = e;
	}
	assertOperationActive() {
		l(this.operation?.signal), this.operation?.expectedPubkey && Y(this.operation.expectedPubkey);
	}
	async getEventSigner(e) {
		this.assertOperationActive();
		let t = e ?? d(m);
		Y(t);
		let n = await u(this.getSessionEventSigner(t), this.operation?.signal);
		return this.assertOperationActive(), Y(t), this.createSessionBoundSigner(n, t);
	}
	async getSessionEventSigner(e) {
		let t = m.value;
		if (!t.isAuthenticated || t.pubkey !== e) throw new p();
		if (t.type === "nsec") {
			let t = _.getFromStore(), n = t && _.derivePublicKey(t).hex === e ? t : _.loadFromStorage(e);
			if (!n || _.derivePublicKey(n).hex !== e) throw new p();
			return {
				getPublicKey: async () => e,
				signEvent: async (e) => ce(n).signEvent(e)
			};
		}
		if (t.type === "nip46") return await this.getCurrentNip46Signer(e);
		if (t.type === "parentClient") {
			let e = se.getSigner();
			if (e) return e;
			throw new p();
		}
		if (t.type === "nip07") {
			let t = window.nostr;
			if (!t?.signEvent) throw new p();
			return {
				getPublicKey: async () => {
					this.assertOperationActive();
					let n = typeof t.getPublicKey == "function" ? await t.getPublicKey() : e;
					if (this.assertOperationActive(), n !== e) throw new p();
					return n;
				},
				signEvent: async (e) => {
					this.assertOperationActive();
					let n = await t.signEvent(e);
					return this.assertOperationActive(), n;
				}
			};
		}
		throw new p();
	}
	createSessionBoundSigner(e, t) {
		return {
			getPublicKey: async () => {
				this.assertOperationActive(), Y(t);
				let n = await u(e.getPublicKey(), this.operation?.signal);
				if (this.assertOperationActive(), Y(t), n !== t) throw new p();
				return n;
			},
			signEvent: async (n) => {
				this.assertOperationActive(), Y(t);
				let r = oe(n), i = await u(e.signEvent(r.signerTemplate), this.operation?.signal);
				this.assertOperationActive(), Y(t);
				let a = re(r.expectedTemplate, i, t);
				return this.assertOperationActive(), Y(t), a;
			}
		};
	}
	async getCurrentNip46Signer(e) {
		this.assertOperationActive();
		let t = m.value;
		if (!t.isAuthenticated || t.type !== "nip46" || t.pubkey !== e) throw new p();
		let n = await me.getSignerForSession(e);
		this.assertOperationActive();
		let r = m.value;
		if (!n || !r.isAuthenticated || r.type !== "nip46" || r.pubkey !== e) throw new p();
		return n;
	}
	async buildAuthHeader(e, t = "POST") {
		this.assertOperationActive();
		let n = d(m), r = await this.getEventSigner(n);
		Y(n);
		let { getToken: i } = await import("./nip98-D6EC4Xr0.js");
		this.assertOperationActive(), Y(n);
		let a = await i(e, t, async (e) => await r.signEvent(e), !0);
		return this.assertOperationActive(), Y(n), a;
	}
	async getBlossomSigner() {
		this.assertOperationActive();
		let e = d(m);
		return await this.getEventSigner(e);
	}
	async createBlossomManagementAuthorization(e) {
		this.assertOperationActive();
		let t = new URL(lt(e.serverUrl)), n = U(e.sha256);
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
			authorization: Qe(JSON.stringify(c)),
			assertSession: l
		};
	}
	async buildBlossomAuthorizationHeader(e) {
		this.assertOperationActive(), e.serverUrl, e.contentType, e.contentLength;
		let t = d(m), n = await this.getEventSigner(t);
		Y(t);
		let r = Math.floor(Date.now() / 1e3), i = [["expiration", String(r + 60)], ["t", e.method]];
		e.sha256 && i.push(["x", e.sha256]);
		let a = await n.signEvent({
			kind: 24242,
			created_at: r,
			content: "Check Blossom upload availability",
			tags: i
		});
		return this.assertOperationActive(), Y(t), Qe(JSON.stringify(a));
	}
	async createBlossomConnectionTestAuthorization(e) {
		this.assertOperationActive();
		let t = d(m), n = await this.buildBlossomAuthorizationHeader(e);
		return this.assertOperationActive(), Y(t), {
			authorization: n,
			assertSession: () => Y(t)
		};
	}
};
function Y(e) {
	ne(m, e);
}
function X(e, t) {
	if (!Array.isArray(e)) throw Error("Invalid NIP-42 authentication event");
	let n = e.find((e) => Array.isArray(e) && e[0] === t);
	if (!n || typeof n[1] != "string" || !n[1]) throw Error("Invalid NIP-42 authentication event");
	return n[1];
}
function gt(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function _t(e, t, n, r) {
	if (!gt(e) || e.kind !== 22242 || e.content !== "" || X(e.tags, "relay") !== t || X(e.tags, "challenge") !== n) throw Error("Invalid NIP-42 authentication event");
	if (r && e.pubkey !== r) throw Error("Authentication required");
}
function vt(e) {
	let t = new ht();
	return (n) => ({ signer: {
		getPublicKey: async () => (Y(e), e),
		signEvent: async (r) => {
			Y(e);
			let i = X(r.tags, "challenge"), o = X(r.tags, "relay"), s = a.normalizeExternalRelayUrl(n), c = a.normalizeExternalRelayUrl(o);
			if (!s || c !== s) throw Error("Invalid NIP-42 authentication event");
			_t(r, o, i);
			let l = We(o, i);
			try {
				console.debug("nip42_auth_sign_requested", {
					method: "sign_event:22242",
					stage: "start"
				});
				let n = await t.getEventSigner(e);
				Y(e);
				let a = await n.signEvent(l);
				return Y(e), _t(a, o, i, e), console.debug("nip42_auth_sign_succeeded", {
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
var yt = Object.defineProperty, bt = (e, t) => {
	for (var n in t) yt(e, n, {
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
var xt = (e) => e instanceof Object;
function St(e) {
	if (!xt(e) || typeof e.kind != "number" || typeof e.content != "string" || typeof e.created_at != "number" || typeof e.pubkey != "string" || !Z(e.pubkey) || !Array.isArray(e.tags)) return !1;
	for (let t = 0; t < e.tags.length; t++) {
		let n = e.tags[t];
		if (!Array.isArray(n)) return !1;
		for (let e = 0; e < n.length; e++) if (typeof n[e] != "string") return !1;
	}
	return !0;
}
var Ct = {};
bt(Ct, {
	AIEmbeddings: () => Pn,
	AppCurationSet: () => vi,
	Application: () => gi,
	AuthoredPodcasts: () => Pr,
	BadgeAward: () => Rt,
	BadgeDefinition: () => ii,
	Bid: () => cn,
	BidConfirmation: () => ln,
	BlobsAuth: () => Jr,
	BlockedRelaysList: () => gr,
	BlossomServerList: () => kr,
	BookmarkList: () => pr,
	Bookmarksets: () => $r,
	Calendar: () => Fi,
	CalendarEventRSVP: () => Ii,
	CashuMintAnnouncement: () => qi,
	CashuWalletEvent: () => Hr,
	CashuWalletHistory: () => Kn,
	CashuWalletTokens: () => Gn,
	ChannelCreation: () => Qt,
	ChannelHideMessage: () => tn,
	ChannelMessage: () => en,
	ChannelMetadata: () => $t,
	ChannelMuteUser: () => nn,
	ChatMessage: () => zt,
	Chess: () => an,
	ClassifiedListing: () => wi,
	ClientAuth: () => Wr,
	CodeSnippet: () => yn,
	CoinjoinPool: () => Ln,
	Comment: () => mn,
	CommunitiesList: () => mr,
	CommunityDefinition: () => Ui,
	CommunityPostApproval: () => Bn,
	ConferenceEvent: () => xi,
	Contacts: () => Nt,
	CreateOrUpdateProduct: () => si,
	CreateOrUpdateStall: () => oi,
	CuratedVideoSets: () => ti,
	Curationsets: () => ei,
	Date: () => Ni,
	DecoupledEncryptionKeyDistribution: () => zn,
	DecoupledKeyAnnouncement: () => Er,
	DecoupledKeyClientAnnouncement: () => Rn,
	DirectMessageRelaysList: () => Dr,
	DraftClassifiedListing: () => Ti,
	DraftEvent: () => Ai,
	DraftLong: () => di,
	Emojisets: () => fi,
	EncryptedDirectMessage: () => Pt,
	EventDeletion: () => Ft,
	FavoriteFollowSets: () => wr,
	FavoritePodcasts: () => Or,
	FavoriteRelays: () => yr,
	FedimintAnnouncement: () => Ji,
	Feed: () => Mi,
	FileMessage: () => Gt,
	FileMetadata: () => fn,
	FileServerPreference: () => Ar,
	Followsets: () => Xr,
	ForumThread: () => Vt,
	GenericRepost: () => Kt,
	Genericlists: () => Zr,
	GeocacheListing: () => Gi,
	GeocacheLog: () => qn,
	GeocacheLogEntry: () => Ki,
	GeocacheProofOfFind: () => Jn,
	GiftWrap: () => dn,
	GitPullRequest: () => xn,
	GitPullRequestUpdate: () => Sn,
	GoodWikiAuthorList: () => jr,
	GoodWikiRelayList: () => Mr,
	GroupMetadata: () => Xi,
	HTTPAuth: () => Yr,
	Handlerinformation: () => zi,
	Handlerrecommendation: () => Ri,
	Highlights: () => lr,
	InteractiveRoom: () => bi,
	InterestsList: () => xr,
	Interestsets: () => ai,
	Issue: () => Cn,
	JobFeedback: () => Un,
	JobRequest: () => Vn,
	JobResult: () => Hn,
	Label: () => Mn,
	LegacyNsiteFile: () => Vi,
	LightningPubRPC: () => Ur,
	LinkSet: () => ji,
	LiveChatMessage: () => vn,
	LiveEvent: () => yi,
	LongFormArticle: () => ui,
	MarketplaceUI: () => ci,
	MediaFollows: () => Cr,
	MediaStarterPacks: () => na,
	MergeRequests: () => on,
	Metadata: () => At,
	ModularArticleContent: () => mi,
	ModularArticleHeader: () => pi,
	MuteSets: () => ni,
	Mutelist: () => ur,
	NWCWalletInfo: () => Br,
	NWCWalletRequest: () => Gr,
	NWCWalletResponse: () => Kr,
	NormalVideo: () => Yt,
	NostrConnect: () => qr,
	NsiteNamed: () => Wi,
	NsiteRoot: () => Vr,
	NutZap: () => ar,
	NutZapInfo: () => Sr,
	OpenTimestamps: () => un,
	Patch: () => bn,
	PeerToPeerOrderEvents: () => Yi,
	Photo: () => Jt,
	Pinlist: () => dr,
	PodcastEpisode: () => rn,
	PodcastMetadata: () => Nr,
	Poll: () => pn,
	PollResponse: () => sn,
	PrivateDirectMessage: () => Wt,
	PrivateEventRelayList: () => br,
	ProblemTracker: () => kn,
	ProductSoldAsAuction: () => li,
	ProfileBadges: () => ri,
	ProxyAnnouncement: () => Rr,
	PublicChatsList: () => hr,
	PublicMessage: () => Zt,
	Reaction: () => Lt,
	ReactionToWebsite: () => qt,
	RecommendRelay: () => Mt,
	Redirects: () => ki,
	RelayDiscovery: () => _i,
	RelayList: () => fr,
	RelayMonitorAnnouncement: () => Fr,
	RelayReview: () => Li,
	RelayReviews: () => Nn,
	Relaysets: () => Qr,
	ReleaseArtifactSets: () => hi,
	Reply: () => wn,
	Report: () => An,
	Reporting: () => jn,
	RepositoryAnnouncement: () => Ei,
	RepositoryState: () => Di,
	Repost: () => It,
	ReservedCashuWalletTokens: () => Wn,
	RoomPresence: () => Ir,
	Scroll: () => gn,
	Seal: () => Ut,
	SearchRelaysList: () => _r,
	ShortTextNote: () => jt,
	ShortVideo: () => Xt,
	SimpleGroupAdmins: () => Zi,
	SimpleGroupCreateGroup: () => $n,
	SimpleGroupCreateInvite: () => tr,
	SimpleGroupDeleteEvent: () => Qn,
	SimpleGroupDeleteGroup: () => er,
	SimpleGroupEditMetadata: () => Zn,
	SimpleGroupJoinRequest: () => nr,
	SimpleGroupLeaveRequest: () => rr,
	SimpleGroupList: () => vr,
	SimpleGroupLiveKitParticipants: () => ea,
	SimpleGroupMembers: () => Qi,
	SimpleGroupPutUser: () => Yn,
	SimpleGroupRemoveUser: () => Xn,
	SimpleGroupReply: () => Ht,
	SimpleGroupRoles: () => $i,
	SimpleGroupThreadedReply: () => Bt,
	SlideSet: () => Ci,
	SoftwareApplication: () => Bi,
	StarterPacks: () => ta,
	StatusApplied: () => En,
	StatusClosed: () => Dn,
	StatusDraft: () => On,
	StatusOpen: () => Tn,
	TidalLogin: () => or,
	Time: () => Pi,
	Torrent: () => Fn,
	TorrentComment: () => In,
	TransportMethodAnnouncement: () => zr,
	UserEmojiList: () => Tr,
	UserGraspList: () => Lr,
	UserStatuses: () => Si,
	VideoViewEvent: () => Hi,
	Voice: () => hn,
	VoiceComment: () => _n,
	WebBookmarks: () => ra,
	WikiArticle: () => Oi,
	Zap: () => cr,
	ZapGoal: () => ir,
	ZapRequest: () => sr,
	classifyKind: () => Ot,
	isAddressableKind: () => Dt,
	isEphemeralKind: () => Et,
	isKind: () => kt,
	isRegularKind: () => wt,
	isReplaceableKind: () => Tt
});
function wt(e) {
	return e < 1e4 && e !== 0 && e !== 3;
}
function Tt(e) {
	return e === 0 || e === 3 || 1e4 <= e && e < 2e4;
}
function Et(e) {
	return 2e4 <= e && e < 3e4;
}
function Dt(e) {
	return 3e4 <= e && e < 4e4;
}
function Ot(e) {
	return wt(e) ? "regular" : Tt(e) ? "replaceable" : Et(e) ? "ephemeral" : Dt(e) ? "parameterized" : "unknown";
}
function kt(e, t) {
	let n = t instanceof Array ? t : [t];
	return St(e) && n.includes(e.kind) || !1;
}
var At = 0, jt = 1, Mt = 2, Nt = 3, Pt = 4, Ft = 5, It = 6, Lt = 7, Rt = 8, zt = 9, Bt = 10, Vt = 11, Ht = 12, Ut = 13, Wt = 14, Gt = 15, Kt = 16, qt = 17, Jt = 20, Yt = 21, Xt = 22, Zt = 24, Qt = 40, $t = 41, en = 42, tn = 43, nn = 44, rn = 54, an = 64, on = 818, sn = 1018, cn = 1021, ln = 1022, un = 1040, dn = 1059, fn = 1063, pn = 1068, mn = 1111, hn = 1222, gn = 1227, _n = 1244, vn = 1311, yn = 1337, bn = 1617, xn = 1618, Sn = 1619, Cn = 1621, wn = 1622, Tn = 1630, En = 1631, Dn = 1632, On = 1633, kn = 1971, An = 1984, jn = 1984, Mn = 1985, Nn = 1986, Pn = 1987, Fn = 2003, In = 2004, Ln = 2022, Rn = 4454, zn = 4455, Bn = 4550, Vn = 5999, Hn = 6999, Un = 7e3, Wn = 7374, Gn = 7375, Kn = 7376, qn = 7516, Jn = 7517, Yn = 9e3, Xn = 9001, Zn = 9002, Qn = 9005, $n = 9007, er = 9008, tr = 9009, nr = 9021, rr = 9022, ir = 9041, ar = 9321, or = 9467, sr = 9734, cr = 9735, lr = 9802, ur = 1e4, dr = 10001, fr = 10002, pr = 10003, mr = 10004, hr = 10005, gr = 10006, _r = 10007, vr = 10009, yr = 10012, br = 10013, xr = 10015, Sr = 10019, Cr = 10020, wr = 10021, Tr = 10030, Er = 10044, Dr = 10050, Or = 10054, kr = 10063, Ar = 10096, jr = 10101, Mr = 10102, Nr = 10154, Pr = 10164, Fr = 10166, Ir = 10312, Lr = 10317, Rr = 10377, zr = 11111, Br = 13194, Vr = 15128, Hr = 17375, Ur = 21e3, Wr = 22242, Gr = 23194, Kr = 23195, qr = 24133, Jr = 24242, Yr = 27235, Xr = 3e4, Zr = 30001, Qr = 30002, $r = 30003, ei = 30004, ti = 30005, ni = 30007, ri = 30008, ii = 30009, ai = 30015, oi = 30017, si = 30018, ci = 30019, li = 30020, ui = 30023, di = 30024, fi = 30030, pi = 30040, mi = 30041, hi = 30063, gi = 30078, _i = 30166, vi = 30267, yi = 30311, bi = 30312, xi = 30313, Si = 30315, Ci = 30388, wi = 30402, Ti = 30403, Ei = 30617, Di = 30618, Oi = 30818, ki = 30819, Ai = 31234, ji = 31388, Mi = 31890, Ni = 31922, Pi = 31923, Fi = 31924, Ii = 31925, Li = 31987, Ri = 31989, zi = 31990, Bi = 32267, Vi = 34128, Hi = 34237, Ui = 34550, Wi = 35128, Gi = 37515, Ki = 37516, qi = 38172, Ji = 38173, Yi = 38383, Xi = 39e3, Zi = 39001, Qi = 39002, $i = 39003, ea = 39004, ta = 39089, na = 39092, ra = 39701;
function ia(e) {
	if (typeof File < "u" && e instanceof File || e instanceof Blob) return e.type || void 0;
}
function aa() {
	return Math.floor(Date.now() / 1e3);
}
var oa = class {
	constructor(e, t) {
		this.signer = t, e.startsWith("http") || (e = "https://" + e), this.mediaserver = e.replace(/\/$/, "") + "/";
	}
	mediaserver;
	getMediaServer() {
		return this.mediaserver;
	}
	async authorizationHeader(e) {
		let t = {
			created_at: aa(),
			kind: Ct.BlobsAuth,
			content: "blossom stuff",
			tags: [["expiration", String(aa() + 60)]]
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
		let i = r(n(new Uint8Array(await e.arrayBuffer()))), a = t || ia(e) || "application/octet-stream";
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
}, sa = [
	/file not found/i,
	/not found/i,
	/cannot get/i,
	/processing/i
], ca = class extends Error {
	reason;
	constructor(e) {
		super(e === "unavailable" ? h.TIMEOUT_MESSAGE : "Uploaded media availability could not be verified"), this.reason = e, this.name = "UploadedMediaAvailabilityError";
	}
};
function la(e, t) {
	if (!t) return e.ok;
	let n = e.headers.get("content-type");
	if (!n) return e.ok;
	let r = t.split("/")[0];
	return n.startsWith(t) || n.startsWith(`${r}/`);
}
function ua(e) {
	let t = e.headers.get("X-Reason")?.trim();
	return t ? sa.some((e) => e.test(t)) : !1;
}
function da(e) {
	let t = e.headers.get("content-type")?.toLowerCase() ?? "";
	return t.startsWith("text/") || t.includes("json") || t.includes("xml") || t.includes("svg");
}
async function fa(e) {
	if (!da(e)) return !1;
	let t = await e.text().catch(() => "");
	return sa.some((e) => e.test(t));
}
function pa(e, t) {
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
async function ma(e) {
	l(e.signal);
	try {
		let t = await e.fetch(e.url, {
			method: "HEAD",
			cache: "no-store",
			credentials: "omit",
			referrerPolicy: "no-referrer",
			...e.signal ? { signal: e.signal } : {}
		});
		if (l(e.signal), t.ok && !ua(t)) return la(t, e.mimeType) ? "available" : "unavailable";
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
		return l(e.signal), !t.ok || ua(t) || !la(t, e.mimeType) || await fa(t.clone()) ? "unavailable" : (l(e.signal), "available");
	} catch {
		return l(e.signal), "inconclusive";
	}
}
async function ha(e) {
	let t = await ma(e);
	return t === "available" ? "available" : t === "unavailable" ? "unavailable" : e.mimeType?.startsWith("image/") && typeof Image < "u" && await pa(e.url, e.signal) ? "available" : "inconclusive";
}
async function ga(e) {
	let t = e.maxWaitTime ?? h.MAX_WAIT_TIME, n = e.retryInterval ?? h.RETRY_INTERVAL, r = Date.now() + t, i = "inconclusive";
	for (;;) {
		l(e.signal);
		let t = await ha(e);
		if (l(e.signal), t === "available") return;
		if (i = t, Date.now() >= r) throw new ca(i);
		await s(n, e.signal);
	}
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/upload/blossomMediaManagement.ts
async function _a(e, t, n, r) {
	let i = () => {};
	return {
		authorization: await dt(e, async () => {
			let a = e.authService.createBlossomManagementAuthorization;
			if (!a) throw new V("authentication");
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
async function va(e) {
	if (G(e), e.destination.protocol !== "blossom" || e.page && e.page.protocol !== "blossom") throw new V("invalidDestination");
	let t = lt(e.destination.serverUrl), n = e.context ?? {
		protocol: "blossom",
		destinationId: e.destination.id,
		serverUrl: e.destination.serverUrl,
		endpoint: `${t}/`
	};
	K(e, n);
	let r = e.page?.protocol === "blossom" ? e.page.limit : 24;
	if (!Number.isSafeInteger(r) || r < 1) throw new V("invalidResponse");
	let i = new URL(`/list/${e.expectedPubkey}`, t);
	i.searchParams.set("limit", String(r));
	let a = e.page?.protocol === "blossom" ? e.page.cursor : void 0;
	if (a) {
		if (!U(a)) throw new V("invalidResponse");
		i.searchParams.set("cursor", a);
	}
	let o = await _a(e, "list"), s = await q(e, i.toString(), "GET", o.authorization, o.assertValid), c = await J(s);
	if (G(e), s.status !== 200 || !Array.isArray(c) || c.length > r) throw new V("invalidResponse");
	let l = c.at(-1), u = H(l) ? U(l.sha256) : null;
	if (c.length && (!u || u === a || c.some((e) => H(e) && U(e.sha256) === a))) throw new V("invalidResponse");
	let d = [], ee = 0, f = 0;
	return c.forEach((e, t) => {
		if (!H(e)) {
			f++;
			return;
		}
		let r = mt({
			url: e.url,
			mime: e.type,
			hash: e.sha256,
			size: e.size,
			uploaded: e.uploaded
		}, n, `${n.destinationId}:${a ?? "first"}:${t}`);
		r ? (d.push(r), r.url && r.deleteId || f++) : ee++;
	}), {
		items: d,
		rawCount: c.length,
		excludedCount: ee,
		invalidCount: f,
		context: n,
		nextPage: u ? {
			protocol: "blossom",
			cursor: u,
			limit: r
		} : null
	};
}
async function ya(e) {
	if (K(e, e.context), e.context.protocol !== "blossom") throw new V("invalidDestination");
	let t = ut(e.item, e.context), n = await _a(e, "delete", t, e.item.kind), r = await q(e, new URL(t, e.context.endpoint).toString(), "DELETE", n.authorization, n.assertValid);
	if (r.status !== 200 && r.status !== 204) throw new V("unknownDelete");
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/upload/BlossomUploadAdapter.ts
function ba(e) {
	return e.serverUrl.replace(/\/$/, "");
}
function xa(e) {
	return `${ba(e)}/upload`;
}
var Sa = [
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
function Ca(e) {
	return {
		success: !0,
		url: e.url,
		nip94: ct(e)
	};
}
function wa(e) {
	let t = e instanceof Error ? e.message : String(e), n = t.match(/^upload returned an error \((\d+)\):\s*(.*)$/);
	return n ? `Blossom upload failed: ${n[1]} ${n[2]}` : t ? `Blossom upload failed: ${t}` : "Blossom upload failed";
}
function Ta(e) {
	return new Promise((t, n) => {
		let r = new FileReader();
		r.onload = () => t(r.result), r.onerror = () => n(r.error ?? /* @__PURE__ */ Error("Failed to read upload blob")), r.readAsArrayBuffer(e);
	});
}
function Ea(e) {
	if (typeof e.arrayBuffer == "function") return e;
	let t = new Blob([e], { type: e.type || "application/octet-stream" });
	return typeof t.arrayBuffer != "function" && (t.arrayBuffer = () => Ta(t)), t;
}
function Da(e, t, n, r) {
	let i = `${ba(e)}/`, a = new oa(i, t);
	return a.httpCall = async (e, t, a, o, s, c) => {
		l(r);
		let u = {};
		if (a && (u["Content-Type"] = a), o) {
			let e = await o();
			if (l(r), !e) throw Error("Blossom authorization failed");
			u.Authorization = $e(e);
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
function Oa(e) {
	return e >= 200 && e < 300;
}
async function ka(e) {
	let t = {
		"X-SHA-256": e.sha256,
		"X-Content-Type": e.contentType,
		"X-Content-Length": String(e.contentLength)
	}, n = e.authorizationContext?.authorization;
	n && (t.Authorization = n), e.authorizationContext?.assertSession();
	try {
		return await e.fetch(xa(e.destination), {
			method: "HEAD",
			headers: t
		});
	} catch {
		return null;
	}
}
async function Aa(e) {
	let t = [];
	for (let n of Sa) {
		let r = await ka({
			...e,
			contentType: n
		});
		if (!r) break;
		Oa(r.status) && t.push(n);
	}
	return t;
}
function ja(e, t, n) {
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
var Ma = class {
	protocol = "blossom";
	listMediaPage = va;
	deleteMedia = ya;
	async upload(e) {
		l(e.signal);
		let t = await e.authService.getBlossomSigner?.();
		if (l(e.signal), !t) throw new p();
		let n;
		try {
			let r = await t.getPublicKey(), i = Da(e.destination, {
				getPublicKey: async () => {
					let e = await t.getPublicKey();
					if (e !== r) throw new p();
					return e;
				},
				signEvent: async (e) => {
					let n = oe(e);
					return re(n.expectedTemplate, await t.signEvent(n.signerTemplate), r);
				}
			}, e.fetch, e.signal), a = Ea(e.file), o = await _e(a, globalThis.crypto.subtle, () => e.signal?.aborted ?? !1);
			l(e.signal);
			let s = a.size;
			n = st({
				descriptor: await i.uploadBlob(a, e.file.type),
				expectedSha256: o,
				expectedSize: s,
				trustedServerUrl: e.destination.serverUrl
			});
		} catch (t) {
			if (t instanceof p) throw t;
			return l(e.signal), {
				success: !1,
				error: wa(t)
			};
		}
		let r = Ca(n);
		try {
			await ga({
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
		])], "ehagaki-upload-test.png", { type: "image/png" }), n = await _e(t), r = e.authService?.createBlossomConnectionTestAuthorization;
		if (e.authService?.buildBlossomAuthorizationHeader && !r) throw Error("Authentication required");
		let i = await e.authService?.createBlossomConnectionTestAuthorization?.({
			serverUrl: ba(e.destination),
			method: "upload",
			sha256: n,
			contentType: t.type || "image/png",
			contentLength: t.size
		}), a = await ka({
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
			capabilities: ja(new Response(null, { status: 599 }), e.destination)
		};
		let o = Oa(a.status) ? { supportedMimeTypes: await Aa({
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
			capabilities: ja(a, e.destination, o)
		} : {
			success: !1,
			status: a.status,
			message: a.headers.get("X-Reason") ?? `Blossom connection test failed: ${a.status}`,
			capabilities: ja(a, e.destination, o)
		};
	}
}, Na = class {
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
async function Pa(e) {
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
		if (l(e.signal), !a.ok) throw ft(a, !1);
		let o = await J(a);
		if (l(e.signal), !H(o)) throw Error("Invalid NIP-96 config response");
		let s = typeof o.delegated_to_url == "string" ? o.delegated_to_url.trim() : "";
		if (s) {
			if (r === 3) throw Error("NIP-96 discovery delegation limit exceeded");
			n = R({
				rawUrl: s,
				trustedUploadUrl: e.trustedUploadUrl
			});
			continue;
		}
		if (typeof o.api_url != "string" || !o.api_url.trim()) throw Error("NIP-96 config is missing api_url");
		let c = R({
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
function Fa(e) {
	if (!Array.isArray(e.tags)) return null;
	let t = /* @__PURE__ */ new Map();
	for (let n of e.tags) {
		if (!Array.isArray(n) || typeof n[0] != "string" || typeof n[1] != "string") continue;
		let e = t.get(n[0]);
		t.set(n[0], e !== void 0 && e !== n[1] ? null : n[1]);
	}
	return t;
}
async function Ia(e) {
	if (e.context) return K(e, e.context), e.context;
	let t;
	try {
		t = L(e.destination.serverUrl);
	} catch {
		throw new V("invalidDestination");
	}
	let { apiUrl: n } = await Pa({
		trustedUploadUrl: t,
		fetch: e.fetch,
		signal: e.signal
	});
	return G(e), {
		protocol: "nip96",
		destinationId: e.destination.id,
		serverUrl: e.destination.serverUrl,
		endpoint: n
	};
}
async function La(e) {
	if (G(e), e.destination.protocol !== "nip96" || e.page && e.page.protocol !== "nip96") throw new V("invalidDestination");
	let t = await Ia(e), n = e.page?.protocol === "nip96" ? e.page.page : 0, r = e.page?.protocol === "nip96" ? e.page.count : 24;
	if (!Number.isSafeInteger(n) || n < 0 || !Number.isSafeInteger(r) || r < 1) throw new V("invalidResponse");
	let i = new URL(t.endpoint);
	i.searchParams.set("page", String(n)), i.searchParams.set("count", String(r));
	let a = i.toString(), o = await q(e, a, "GET", await dt(e, () => e.authService.buildAuthHeader(a, "GET"))), s = await J(o);
	if (G(e), o.status !== 200 || !H(s) || !Array.isArray(s.files) || W(s.page) !== n || !W(s.count) || W(s.total) === void 0 || s.files.length > Number(s.count) || n * Number(s.count) + s.files.length > Number(s.total) || e.page && s.count !== r || s.files.length === 0 && n * Number(s.count) < Number(s.total)) throw new V("invalidResponse");
	let c = [], l = 0, u = 0;
	return s.files.forEach((e, r) => {
		if (!H(e)) {
			u++;
			return;
		}
		let i = Fa(e);
		if (!i) {
			u++;
			return;
		}
		let a = i.get("size"), o = mt({
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
async function Ra(e) {
	if (K(e, e.context), e.context.protocol !== "nip96") throw new V("invalidDestination");
	let t = ut(e.item, e.context), n = new URL(e.context.endpoint);
	n.pathname = `${n.pathname.replace(/\/$/, "")}/${t}`;
	let r = n.toString(), i = await q(e, r, "DELETE", await dt(e, () => e.authService.buildAuthHeader(r, "DELETE"))), a = await J(i, !0);
	if (i.status !== 200 || !H(a) || a.status !== "success") throw new V("unknownDelete");
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/upload/Nip96UploadAdapter.ts
function za(e, t) {
	if (e instanceof N) {
		let n = t === "destination" ? "nip96InvalidDestinationUrl" : t === "processing" ? "nip96InvalidProcessingUrl" : e.code === "insecure-media-url" ? "nip96InsecureMediaUrl" : "nip96InvalidMediaUrl";
		return {
			error: e.message,
			errorCode: n
		};
	}
	return e instanceof ca ? {
		error: e.message,
		errorCode: e.reason === "inconclusive" ? "nip96MediaAvailabilityUnverified" : "nip96MediaAvailabilityTimeout"
	} : { error: e instanceof Error ? e.message : String(e) };
}
function Ba(e) {
	return e.resolvedUploadUrl || e.serverUrl;
}
function Q(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function $(e) {
	return Array.isArray(e);
}
function Va(e) {
	let t = {};
	if (!Q(e) || !Q(e.nip94_event) || !$(e.nip94_event.tags)) return t;
	for (let n of e.nip94_event.tags) {
		if (!$(n) || n.length < 2) continue;
		let e = String(n[0]), r = n.slice(1).join(" ");
		e in t || (t[e] = r);
	}
	return t;
}
async function Ha(e) {
	let t = Date.now(), n = e.maxWaitTime ?? g.MAX_WAIT_TIME;
	for (;;) {
		if (l(e.signal), Date.now() - t > n) throw Error(g.TIMEOUT_MESSAGE);
		let r = await e.fetch(e.processingUrl, {
			method: "GET",
			...e.authHeader ? { headers: { Authorization: e.authHeader } } : {},
			...e.signal ? { signal: e.signal } : {},
			credentials: "omit",
			referrerPolicy: "no-referrer",
			redirect: "error"
		});
		if (l(e.signal), r.status === 404) {
			await s(g.RETRY_INTERVAL, e.signal);
			continue;
		}
		if (!r.ok) throw Error(`Unexpected status code ${r.status} while polling processing_url`);
		let i = await r.json().catch(() => null);
		if (l(e.signal), r.status === 201 && i) return i;
		if (Q(i) && i.status === "processing") await s(g.RETRY_INTERVAL, e.signal);
		else {
			if (Q(i) && i.status === "success") return i;
			if (Q(i) && i.status === "error") throw Error(typeof i.message == "string" && i.message ? i.message : "File processing failed");
			if (r.status === 200) return i;
			throw Error("Unexpected processing status");
		}
	}
}
function Ua(e, t) {
	let n = new FormData();
	return n.append("file", e), t?.caption && n.append("caption", String(t.caption)), t?.expiration !== void 0 && n.append("expiration", String(t.expiration)), n.append("size", String(e.size)), t?.alt && n.append("alt", String(t.alt)), t?.media_type && n.append("media_type", String(t.media_type)), n.append("content_type", t?.content_type ? String(t.content_type) : e.type || ""), n.append("no_transform", t?.no_transform ? String(t.no_transform) : "true"), n;
}
function Wa(e, t) {
	let n = Q(e) && Q(e.plans) ? e.plans : void 0, r = n && Q(n.free) ? n.free : void 0, i = Q(e) && Q(e.api) ? e.api : void 0, a = Number(r?.max_byte_size) || Number(i?.max_byte_size) || null, o = Q(e) ? e.content_types : void 0;
	return {
		maxUploadSize: a,
		supportedMimeTypes: $(o) ? o.filter((e) => typeof e == "string") : [],
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
var Ga = class {
	protocol = "nip96";
	listMediaPage = La;
	deleteMedia = Ra;
	async upload(e) {
		l(e.signal);
		let t;
		try {
			t = L(Ba(e.destination));
		} catch (e) {
			return {
				success: !1,
				...za(e, "destination")
			};
		}
		let n = t.url, r = await e.authService.buildAuthHeader(n, "POST");
		l(e.signal);
		let i;
		try {
			i = await e.fetch(n, {
				method: "POST",
				headers: { Authorization: r },
				body: Ua(e.file, e.metadata),
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
		if (!Q(a)) return {
			success: !1,
			error: "Could not parse upload response"
		};
		if ((i.status === 200 || i.status === 202) && typeof a.processing_url == "string" && a.processing_url) try {
			let n = rt({
				rawUrl: a.processing_url,
				trustedUploadUrl: t
			}), r = n.sameOrigin ? await e.authService.buildAuthHeader(n.url, "GET") : void 0;
			a = await Ha({
				processingUrl: n.url,
				authHeader: r,
				fetch: e.fetch,
				signal: e.signal
			}), l(e.signal);
		} catch (t) {
			if (t instanceof p) throw t;
			return l(e.signal), {
				success: !1,
				...za(t, "processing")
			};
		}
		if (!Q(a)) return {
			success: !1,
			error: "Could not parse upload response"
		};
		let o = Va(a);
		if (a.status === "success" && Q(a.nip94_event) && $(a.nip94_event.tags) && o.url) {
			try {
				let n = z({
					rawUrl: o.url,
					trustedUploadUrl: t
				});
				o.url = n.url, await ga({
					url: n.url,
					mimeType: e.file.type,
					fetch: e.fetch,
					signal: e.signal
				});
			} catch (t) {
				return l(e.signal), {
					success: !1,
					...za(t, "media"),
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
			let { config: t, status: n } = await Pa({
				trustedUploadUrl: L(e.destination.serverUrl),
				fetch: e.fetch
			});
			return {
				success: !0,
				status: n,
				capabilities: Wa(t, Date.now())
			};
		} catch (e) {
			return {
				success: !1,
				message: e instanceof Error ? e.message : String(e)
			};
		}
	}
}, Ka = {
	blossom: new Ma(),
	nip96: new Ga(),
	"custom-http": new Na()
};
function qa(e) {
	return Ka[e];
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/upload/uploadDestinationResolver.ts
var Ja = "blossom.band";
function Ya(e, t) {
	let { [t]: n, ...r } = e;
	return r;
}
function Xa(e) {
	if (e.npub?.startsWith("npub1")) return e.npub;
	if (!e.pubkeyHex) return null;
	try {
		return i.npubEncode(e.pubkeyHex);
	} catch {
		return null;
	}
}
function Za(e) {
	let t = Xa(e);
	return t ? `https://${t}.${Ja}` : null;
}
function Qa(e) {
	let t = T(e);
	if (!t?.resolvedUploadUrl) return e;
	let n = e.resolvedUploadUrl, r = n ? w(n) : "";
	return n && r !== w(t.serverUrl) && r !== w(t.resolvedUploadUrl) || n === t.resolvedUploadUrl ? e : {
		...e,
		resolvedUploadUrl: t.resolvedUploadUrl
	};
}
function $a(e, t) {
	if (e.protocol === "nip96") return Qa(e);
	let n = Ya(e, "resolvedUploadUrl");
	if (e.protocol !== "blossom" || e.presetId !== "blossom-band") return n;
	let r = Za(t);
	return r ? {
		...n,
		serverUrl: r
	} : n;
}
export { w as _, pt as a, z as c, v as d, S as f, x as g, T as h, vt as i, He as l, E as m, qa as n, V as o, D as p, ht as r, L as s, $a as t, O as u };
