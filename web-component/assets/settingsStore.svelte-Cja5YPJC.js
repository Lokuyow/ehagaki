import { gt as e, mt as t, nt as n, vt as r } from "./index-client-XkLzkVYC.js";
import { v as i, x as a } from "./relayConfigUtils-B4Q_AO1M.js";
import { ht as o } from "./LoadingPlaceholder-lit91akO.js";
import { B as ee, C as te, D as ne, F as re, G as ie, H as ae, I as s, L as c, M as oe, N as l, P as u, R as d, S as f, St as p, T as m, V as se, W as ce, _ as le, b as ue, f as de, g as fe, h as pe, j as me, k as h, m as he, p as ge, v as _e, x as ve, y as ye, z as be } from "./appUtils-BRia-Jm6.js";
import { d as xe, f as g, h as _, p as v } from "./signedEventResultValidator-CnvxVz7l.js";
import { t as y } from "./embedMessageTrustGate-D1T6eIT_.js";
import { a as b } from "./uploadStore.svelte-D-WzsUY_.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/embedStorageKeys.ts
var x = [
	p.LOCALE,
	p.THEME_MODE,
	p.DARK_MODE,
	p.CLIENT_TAG_ENABLED,
	p.QUOTE_NOTIFICATION_ENABLED,
	p.REPLY_NOTIFICATION_ENABLED,
	p.FAIL_CLOSED_CONTENT_WARNING,
	p.IMAGE_QUALITY_LEVEL,
	p.VIDEO_QUALITY_LEVEL,
	p.MEDIA_FREE_PLACEMENT,
	p.SHOW_MASCOT,
	p.SHOW_FLAVOR_TEXT,
	p.ACCENT_COLOR,
	p.BASE_COLOR,
	p.SETTINGS_PREFERENCE_METADATA
], S = [
	p.LOCALE,
	p.THEME_MODE,
	p.DARK_MODE,
	p.CLIENT_TAG_ENABLED,
	p.QUOTE_NOTIFICATION_ENABLED,
	p.REPLY_NOTIFICATION_ENABLED,
	p.IMAGE_QUALITY_LEVEL,
	p.VIDEO_QUALITY_LEVEL,
	p.MEDIA_FREE_PLACEMENT,
	p.SHOW_MASCOT,
	p.SHOW_FLAVOR_TEXT,
	p.ACCENT_COLOR,
	p.BASE_COLOR,
	p.SETTINGS_PREFERENCE_METADATA,
	p.LEGACY_IMAGE_COMPRESSION_LEVEL,
	p.LEGACY_VIDEO_COMPRESSION_LEVEL,
	p.FIRST_VISIT,
	p.SHARED_MEDIA_PROCESSED,
	p.FOOTER_SETTING_SHORTCUTS
], C = [p.FAIL_CLOSED_CONTENT_WARNING], w = [p.LEGACY_IMAGE_COMPRESSION_LEVEL, p.LEGACY_VIDEO_COMPRESSION_LEVEL];
p.FIRST_VISIT, p.SHARED_MEDIA_PROCESSED, p.FOOTER_SETTING_SHORTCUTS;
var T = [...S, ...C], E = new Set(T);
function D(e) {
	return E.has(e);
}
function O(e) {
	return e.filter(D);
}
function k(e) {
	return Array.from(/* @__PURE__ */ new Set([...e, p.SETTINGS_PREFERENCE_METADATA]));
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/embedStorageService.ts
var A = 1e3, j = new Set(C);
function M(e) {
	return j.has(e);
}
function Se() {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `storage-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function Ce(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	if (typeof t.timestamp != "number") return !1;
	if (t.values !== void 0) {
		if (typeof t.values != "object" || t.values === null || Array.isArray(t.values)) return !1;
		for (let [e, n] of Object.entries(t.values)) if (!D(e) || n !== null && typeof n != "string") return !1;
	}
	for (let e of ["applied", "removed"]) {
		let n = t[e];
		if (n !== void 0 && (!Array.isArray(n) || !n.every((e) => typeof e == "string" && D(e)))) return !1;
	}
	return !0;
}
function we(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	return typeof t.timestamp == "number" && typeof t.code == "string" && t.code.trim().length > 0 && (t.message === void 0 || typeof t.message == "string");
}
var N = new class {
	windowObj;
	console;
	requestTimeoutMs;
	trustedParentOrigin = null;
	isListening = !1;
	pendingRequests = /* @__PURE__ */ new Map();
	constructor(e = typeof window < "u" ? window : {}, t = typeof window < "u" ? window.console : {}, n = A) {
		this.windowObj = e, this.console = t, this.requestTimeoutMs = n;
	}
	initialize(e = {}) {
		if (!this.isInIframe()) return !1;
		let t = e.parentOrigin ?? v(e.locationSearch ?? this.windowObj.location?.search);
		return t ? (this.trustedParentOrigin = t, this.ensureMessageListener(), !0) : !1;
	}
	async get(e) {
		let t = O(e);
		if (t.length === 0) return {
			timestamp: Date.now(),
			values: {}
		};
		let { compatibleKeys: n, optionalKeys: r } = this.partitionKeys(t), i = [];
		n.length > 0 && i.push({
			required: !0,
			promise: this.sendRequest("storage.get", { keys: n })
		});
		for (let e of r) i.push({
			required: !1,
			promise: this.sendRequest("storage.get", { keys: [e] })
		});
		return this.combineStorageRequests(i);
	}
	persistLocalStorageKeys(e, t = a()) {
		let n = {}, r = [];
		for (let i of O(e)) {
			let e = t.getItem(i);
			e === null ? r.push(i) : n[i] = e;
		}
		Object.keys(n).length > 0 && this.set(n).catch(() => {}), r.length > 0 && this.remove(r).catch(() => {});
	}
	async set(e) {
		let t = {};
		for (let [n, r] of Object.entries(e)) D(n) && (t[n] = r);
		if (Object.keys(t).length === 0) return null;
		let n = {}, r = [];
		for (let [e, i] of Object.entries(t)) M(e) ? r.push([e, i]) : n[e] = i;
		let i = [];
		Object.keys(n).length > 0 && i.push({
			required: !0,
			promise: this.sendRequest("storage.set", { values: n })
		});
		for (let [e, t] of r) i.push({
			required: !1,
			promise: this.sendRequest("storage.set", { values: { [e]: t } })
		});
		return this.combineStorageRequests(i);
	}
	async remove(e) {
		let t = O(e);
		if (t.length === 0) return null;
		let { compatibleKeys: n, optionalKeys: r } = this.partitionKeys(t), i = [];
		n.length > 0 && i.push({
			required: !0,
			promise: this.sendRequest("storage.remove", { keys: n })
		});
		for (let e of r) i.push({
			required: !1,
			promise: this.sendRequest("storage.remove", { keys: [e] })
		});
		return this.combineStorageRequests(i);
	}
	applySnapshotToLocalStorage(e, t = a()) {
		if (!e) return [];
		let n = [];
		for (let [r, i] of Object.entries(e)) i !== null && D(r) && (t.setItem(r, i), n.push(r));
		return n;
	}
	async sendRequest(e, t) {
		if (!this.windowObj || !this.isInIframe() || !this.trustedParentOrigin) return Promise.reject({
			timestamp: Date.now(),
			code: "storage_parent_unavailable",
			message: "parent storage is not available"
		});
		let n = Se(), r = new Promise((e, t) => {
			let r = setTimeout(() => {
				this.pendingRequests.delete(n), t({
					timestamp: Date.now(),
					code: "storage_request_timeout",
					message: "parent storage request timed out"
				});
			}, this.requestTimeoutMs);
			this.pendingRequests.set(n, {
				resolve: e,
				reject: t,
				timeoutId: r
			});
		});
		try {
			this.windowObj.parent.postMessage({
				namespace: xe,
				version: 1,
				type: e,
				requestId: n,
				payload: t
			}, this.trustedParentOrigin);
		} catch (e) {
			let t = this.pendingRequests.get(n);
			return t && (clearTimeout(t.timeoutId), this.pendingRequests.delete(n)), Promise.reject({
				timestamp: Date.now(),
				code: "storage_post_message_failed",
				message: e instanceof Error ? e.message : String(e)
			});
		}
		return r.catch((e) => {
			throw this.console.warn("親 storage request に失敗:", e), e;
		});
	}
	partitionKeys(e) {
		return {
			compatibleKeys: e.filter((e) => !M(e)),
			optionalKeys: e.filter(M)
		};
	}
	async combineStorageRequests(e) {
		let t = await Promise.allSettled(e.map(({ promise: e }) => e)), n = e.some(({ required: e }) => e), r = t.find((t, n) => e[n].required && t.status === "rejected");
		if (r?.status === "rejected") throw r.reason;
		let i = t.flatMap((e) => e.status === "fulfilled" ? [e.value] : []);
		if (!n && t.some((e) => e.status === "rejected")) {
			let e = t.find((e) => e.status === "rejected");
			if (e?.status === "rejected") throw e.reason;
		}
		if (i.length === 0) {
			let e = t.find((e) => e.status === "rejected");
			if (e?.status === "rejected") throw e.reason;
			return { timestamp: Date.now() };
		}
		let a = { timestamp: Date.now() };
		for (let e of i) e.values && (a.values = {
			...a.values,
			...e.values
		}), e.applied && (a.applied = [...a.applied ?? [], ...e.applied]), e.removed && (a.removed = [...a.removed ?? [], ...e.removed]);
		return a;
	}
	handleMessage = (e) => {
		let t = y(e, this.windowObj, this.trustedParentOrigin);
		if (!t || t.type !== "storage.result" && t.type !== "storage.error") return;
		if (g(t.type) && !_(t.requestId)) {
			this.console.warn("requestId がない storage response を無視:", t);
			return;
		}
		if (!t.requestId) return;
		let n = this.pendingRequests.get(t.requestId);
		if (n) {
			if (t.type === "storage.result") {
				if (!Ce(t.payload)) {
					this.console.warn("不正な storage.result payload を無視:", t.payload);
					return;
				}
				clearTimeout(n.timeoutId), this.pendingRequests.delete(t.requestId), n.resolve(t.payload);
			} else we(t.payload) ? (clearTimeout(n.timeoutId), this.pendingRequests.delete(t.requestId), n.reject(t.payload)) : this.console.warn("不正な storage.error payload を無視:", t.payload);
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
}();
// D:/ドキュメント/GitHub/ehagaki/src/lib/embedSettingsPersistence.ts
function P(e) {
	N.persistLocalStorageKeys(k(e));
}
function Te() {
	N.persistLocalStorageKeys([...x, ...w]);
}
// D:/ドキュメント/GitHub/ehagaki/src/stores/themeStore.svelte.ts
function Ee() {
	return window.matchMedia("(prefers-color-scheme: dark)").matches;
}
function F(e) {
	return e === "dark" || e !== "light" && Ee();
}
function I(e) {
	let t = i().themeTarget;
	e ? (t.classList.add("dark"), t.classList.remove("light"), t.style.colorScheme = "dark") : (t.classList.add("light"), t.classList.remove("dark"), t.style.colorScheme = "light");
}
var L = a(), R = m(L), z = F(R), B = r(t(R)), V = r(t(z));
I(z), typeof window < "u" && window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (t) => {
	n(B) === "system" && (e(V, t.matches, !0), I(t.matches));
});
var H = {
	get value() {
		return n(B);
	},
	get isDark() {
		return n(V);
	},
	set: (t, n = "user") => {
		let r = ce(L, t, n), i = F(r);
		e(B, r, !0), e(V, i, !0), I(i), P([p.THEME_MODE, p.DARK_MODE]);
	},
	reload: () => {
		let t = m(L), n = F(t);
		e(B, t, !0), e(V, n, !0), I(n);
	},
	reset: (e = "user") => {
		H.set("system", e);
	}
}, U = a();
function W() {
	let e = he(U, navigator), t = pe(U, e);
	return {
		locale: e,
		clientTagEnabled: ge(U),
		quoteNotificationEnabled: ue(U),
		replyNotificationEnabled: ve(U),
		failClosedContentWarning: fe(U),
		imageQualityLevel: le(U),
		videoQualityLevel: ne(U),
		mediaFreePlacement: ye(U),
		showMascot: te(U),
		showFlavorText: f(U),
		externalNostrClient: t.client,
		externalNostrClientCustomUrl: t.customUrlTemplate,
		localRelayUrl: i().runtimeKind === "standalone" ? _e(U) : null
	};
}
var G = W(), K = r(t(G));
b.set(G.mediaFreePlacement);
function q(e) {
	b.set(e);
}
var J = {
	clientTagEnabled: {
		storageKeys: [p.CLIENT_TAG_ENABLED],
		apply: (e, t) => me(U, e, t)
	},
	quoteNotificationEnabled: {
		storageKeys: [p.QUOTE_NOTIFICATION_ENABLED],
		apply: (e, t) => be(U, e, t)
	},
	replyNotificationEnabled: {
		storageKeys: [p.REPLY_NOTIFICATION_ENABLED],
		apply: (e, t) => ee(U, e, t)
	},
	failClosedContentWarning: {
		storageKeys: [p.FAIL_CLOSED_CONTENT_WARNING],
		apply: (e, t) => u(U, e, t)
	},
	imageQualityLevel: {
		storageKeys: [p.IMAGE_QUALITY_LEVEL, p.LEGACY_IMAGE_COMPRESSION_LEVEL],
		apply: (e, t) => re(U, e, t)
	},
	videoQualityLevel: {
		storageKeys: [p.VIDEO_QUALITY_LEVEL, p.LEGACY_VIDEO_COMPRESSION_LEVEL],
		apply: (e, t) => ie(U, e, t)
	},
	mediaFreePlacement: {
		storageKeys: [p.MEDIA_FREE_PLACEMENT],
		apply: (e, t) => d(U, e, t),
		afterApply: q
	},
	showMascot: {
		storageKeys: [p.SHOW_MASCOT],
		apply: (e, t) => ae(U, e, t)
	},
	showFlavorText: {
		storageKeys: [p.SHOW_FLAVOR_TEXT],
		apply: (e, t) => se(U, e, t)
	}
}, De = [
	"imageQualityLevel",
	"videoQualityLevel",
	"clientTagEnabled",
	"quoteNotificationEnabled",
	"replyNotificationEnabled",
	"mediaFreePlacement",
	"showMascot",
	"showFlavorText"
];
function Y(e) {
	P(J[e].storageKeys);
}
function Oe(e) {
	return J[e];
}
function X(e, { source: t = "user", syncDocumentLang: r = !1 } = {}) {
	let a = c(U, e, t);
	return n(K).locale = a, r && (i().themeTarget.lang = a), o.set(a), a;
}
function Z(e, t, r = "user") {
	let i = Oe(e), a = i.apply(t, r);
	return n(K)[e] = a, i.afterApply?.(a), a;
}
function Q(e, t, n, r) {
	let i = e[t];
	i !== void 0 && (Z(t, i, n), r.push(t));
}
var $ = {
	get localRelayUrl() {
		return n(K).localRelayUrl;
	},
	setLocalRelayUrl(e) {
		i().runtimeKind === "standalone" && (n(K).localRelayUrl = s(U, e));
	},
	get value() {
		return n(K);
	},
	reload() {
		e(K, W(), !0), q(n(K).mediaFreePlacement), o.set(n(K).locale);
	},
	get locale() {
		return n(K).locale;
	},
	set locale(e) {
		X(e), P([p.LOCALE]);
	},
	get clientTagEnabled() {
		return n(K).clientTagEnabled;
	},
	set clientTagEnabled(e) {
		Z("clientTagEnabled", e), Y("clientTagEnabled");
	},
	get quoteNotificationEnabled() {
		return n(K).quoteNotificationEnabled;
	},
	get replyNotificationEnabled() {
		return n(K).replyNotificationEnabled;
	},
	set replyNotificationEnabled(e) {
		Z("replyNotificationEnabled", e), Y("replyNotificationEnabled");
	},
	get failClosedContentWarning() {
		return n(K).failClosedContentWarning;
	},
	set failClosedContentWarning(e) {
		Z("failClosedContentWarning", e), Y("failClosedContentWarning");
	},
	set quoteNotificationEnabled(e) {
		Z("quoteNotificationEnabled", e), Y("quoteNotificationEnabled");
	},
	get imageQualityLevel() {
		return n(K).imageQualityLevel;
	},
	set imageQualityLevel(e) {
		Z("imageQualityLevel", e), Y("imageQualityLevel");
	},
	get videoQualityLevel() {
		return n(K).videoQualityLevel;
	},
	set videoQualityLevel(e) {
		Z("videoQualityLevel", e), Y("videoQualityLevel");
	},
	get mediaFreePlacement() {
		return n(K).mediaFreePlacement;
	},
	set mediaFreePlacement(e) {
		Z("mediaFreePlacement", e), Y("mediaFreePlacement");
	},
	get showMascot() {
		return n(K).showMascot;
	},
	set showMascot(e) {
		Z("showMascot", e), Y("showMascot");
	},
	get showFlavorText() {
		return n(K).showFlavorText;
	},
	set showFlavorText(e) {
		Z("showFlavorText", e), Y("showFlavorText");
	},
	get externalNostrClient() {
		return n(K).externalNostrClient;
	},
	set externalNostrClient(e) {
		let t = l(U, e);
		t && (n(K).externalNostrClient = t);
	},
	get externalNostrClientCustomUrl() {
		return n(K).externalNostrClientCustomUrl;
	},
	set externalNostrClientCustomUrl(e) {
		let t = oe(U, e);
		t && (n(K).externalNostrClientCustomUrl = t);
	},
	applyParentSettings(e, t = "parentForced") {
		let n = [];
		return e.locale !== void 0 && (X(e.locale, {
			source: t,
			syncDocumentLang: !0
		}), n.push("locale")), e.themeMode !== void 0 && (H.set(e.themeMode, t), n.push("themeMode")), e.imageQualityLevel === void 0 && e.imageCompressionLevel !== void 0 && (e = {
			...e,
			imageQualityLevel: h(e.imageCompressionLevel)
		}), e.videoQualityLevel === void 0 && e.videoCompressionLevel !== void 0 && (e = {
			...e,
			videoQualityLevel: h(e.videoCompressionLevel)
		}), De.forEach((r) => {
			Q(e, r, t, n);
		}), n.length > 0 && Te(), n;
	},
	applyStoredSnapshot() {
		$.reload(), H.reload();
	}
};
function ke() {
	let e = de(U);
	return N.persistLocalStorageKeys([p.FIRST_VISIT]), e;
}
export { N as a, P as i, $ as n, T as o, H as r, ke as t };
