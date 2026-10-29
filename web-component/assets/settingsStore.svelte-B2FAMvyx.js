import { _t as e, ht as t, pt as n, tt as r } from "./index-client-57Odq85c.js";
import { i, n as a } from "./appRuntimeEnvironment-BvtUCHcA.js";
import { ht as o } from "./LoadingPlaceholder-DK5Hrsgb.js";
import { d as ee, f as te, h as ne, p as re } from "./signedEventResultValidator-DEUEqBPK.js";
import { A as s, B as ie, C as c, E as l, F as u, G as d, H as f, I as p, K as m, L as h, M as ae, N as oe, O as se, P as ce, R as le, S as ue, U as de, V as fe, _ as pe, b as me, g as he, h as ge, m as _e, p as ve, v as ye, w as be, x as xe, y as g, yt as _, z as v } from "./appUtils-CwuZyofa.js";
import { t as y } from "./embedMessageTrustGate-DtGVaapM.js";
import { a as b } from "./uploadStore.svelte-Cb-DvowP.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/embedStorageKeys.ts
var x = [
	_.LOCALE,
	_.THEME_MODE,
	_.DARK_MODE,
	_.CLIENT_TAG_ENABLED,
	_.QUOTE_NOTIFICATION_ENABLED,
	_.REPLY_NOTIFICATION_ENABLED,
	_.FAIL_CLOSED_CONTENT_WARNING,
	_.IMAGE_QUALITY_LEVEL,
	_.VIDEO_QUALITY_LEVEL,
	_.MEDIA_FREE_PLACEMENT,
	_.SHOW_MASCOT,
	_.SHOW_FLAVOR_TEXT,
	_.ACCENT_COLOR,
	_.BASE_COLOR,
	_.SETTINGS_PREFERENCE_METADATA
], S = [
	_.LOCALE,
	_.THEME_MODE,
	_.DARK_MODE,
	_.CLIENT_TAG_ENABLED,
	_.QUOTE_NOTIFICATION_ENABLED,
	_.REPLY_NOTIFICATION_ENABLED,
	_.IMAGE_QUALITY_LEVEL,
	_.VIDEO_QUALITY_LEVEL,
	_.MEDIA_FREE_PLACEMENT,
	_.SHOW_MASCOT,
	_.SHOW_FLAVOR_TEXT,
	_.ACCENT_COLOR,
	_.BASE_COLOR,
	_.SETTINGS_PREFERENCE_METADATA,
	_.LEGACY_IMAGE_COMPRESSION_LEVEL,
	_.LEGACY_VIDEO_COMPRESSION_LEVEL,
	_.FIRST_VISIT,
	_.SHARED_MEDIA_PROCESSED,
	_.FOOTER_SETTING_SHORTCUTS
], C = [_.FAIL_CLOSED_CONTENT_WARNING], w = [_.LEGACY_IMAGE_COMPRESSION_LEVEL, _.LEGACY_VIDEO_COMPRESSION_LEVEL];
_.FIRST_VISIT, _.SHARED_MEDIA_PROCESSED, _.FOOTER_SETTING_SHORTCUTS;
var T = [...S, ...C], E = new Set(T);
function D(e) {
	return E.has(e);
}
function O(e) {
	return e.filter(D);
}
function k(e) {
	return Array.from(/* @__PURE__ */ new Set([...e, _.SETTINGS_PREFERENCE_METADATA]));
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
		let t = e.parentOrigin ?? re(e.locationSearch ?? this.windowObj.location?.search);
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
	persistLocalStorageKeys(e, t = i()) {
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
	applySnapshotToLocalStorage(e, t = i()) {
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
				namespace: ee,
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
		if (te(t.type) && !ne(t.requestId)) {
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
	let t = a().themeTarget;
	e ? (t.classList.add("dark"), t.classList.remove("light"), t.style.colorScheme = "dark") : (t.classList.add("light"), t.classList.remove("dark"), t.style.colorScheme = "light");
}
var L = i(), R = l(L), z = F(R), B = e(n(R)), V = e(n(z));
I(z), typeof window < "u" && window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
	r(B) === "system" && (t(V, e.matches, !0), I(e.matches));
});
var H = {
	get value() {
		return r(B);
	},
	get isDark() {
		return r(V);
	},
	set: (e, n = "user") => {
		let r = d(L, e, n), i = F(r);
		t(B, r, !0), t(V, i, !0), I(i), P([_.THEME_MODE, _.DARK_MODE]);
	},
	reload: () => {
		let e = l(L), n = F(e);
		t(B, e, !0), t(V, n, !0), I(n);
	},
	reset: (e = "user") => {
		H.set("system", e);
	}
}, U = i();
function W() {
	let e = ge(U, navigator), t = he(U, e);
	return {
		locale: e,
		clientTagEnabled: _e(U),
		quoteNotificationEnabled: xe(U),
		replyNotificationEnabled: ue(U),
		failClosedContentWarning: pe(U),
		imageQualityLevel: ye(U),
		videoQualityLevel: se(U),
		mediaFreePlacement: me(U),
		showMascot: be(U),
		showFlavorText: c(U),
		externalNostrClient: t.client,
		externalNostrClientCustomUrl: t.customUrlTemplate,
		localRelayUrl: a().runtimeKind === "standalone" ? g(U) : null
	};
}
var G = W(), K = e(n(G));
b.set(G.mediaFreePlacement);
function q(e) {
	b.set(e);
}
var J = {
	clientTagEnabled: {
		storageKeys: [_.CLIENT_TAG_ENABLED],
		apply: (e, t) => ae(U, e, t)
	},
	quoteNotificationEnabled: {
		storageKeys: [_.QUOTE_NOTIFICATION_ENABLED],
		apply: (e, t) => ie(U, e, t)
	},
	replyNotificationEnabled: {
		storageKeys: [_.REPLY_NOTIFICATION_ENABLED],
		apply: (e, t) => fe(U, e, t)
	},
	failClosedContentWarning: {
		storageKeys: [_.FAIL_CLOSED_CONTENT_WARNING],
		apply: (e, t) => u(U, e, t)
	},
	imageQualityLevel: {
		storageKeys: [_.IMAGE_QUALITY_LEVEL, _.LEGACY_IMAGE_COMPRESSION_LEVEL],
		apply: (e, t) => p(U, e, t)
	},
	videoQualityLevel: {
		storageKeys: [_.VIDEO_QUALITY_LEVEL, _.LEGACY_VIDEO_COMPRESSION_LEVEL],
		apply: (e, t) => m(U, e, t)
	},
	mediaFreePlacement: {
		storageKeys: [_.MEDIA_FREE_PLACEMENT],
		apply: (e, t) => v(U, e, t),
		afterApply: q
	},
	showMascot: {
		storageKeys: [_.SHOW_MASCOT],
		apply: (e, t) => de(U, e, t)
	},
	showFlavorText: {
		storageKeys: [_.SHOW_FLAVOR_TEXT],
		apply: (e, t) => f(U, e, t)
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
function X(e, { source: t = "user", syncDocumentLang: n = !1 } = {}) {
	let i = le(U, e, t);
	return r(K).locale = i, n && (a().themeTarget.lang = i), o.set(i), i;
}
function Z(e, t, n = "user") {
	let i = Oe(e), a = i.apply(t, n);
	return r(K)[e] = a, i.afterApply?.(a), a;
}
function Q(e, t, n, r) {
	let i = e[t];
	i !== void 0 && (Z(t, i, n), r.push(t));
}
var $ = {
	get localRelayUrl() {
		return r(K).localRelayUrl;
	},
	setLocalRelayUrl(e) {
		a().runtimeKind === "standalone" && (r(K).localRelayUrl = h(U, e));
	},
	get value() {
		return r(K);
	},
	reload() {
		t(K, W(), !0), q(r(K).mediaFreePlacement), o.set(r(K).locale);
	},
	get locale() {
		return r(K).locale;
	},
	set locale(e) {
		X(e), P([_.LOCALE]);
	},
	get clientTagEnabled() {
		return r(K).clientTagEnabled;
	},
	set clientTagEnabled(e) {
		Z("clientTagEnabled", e), Y("clientTagEnabled");
	},
	get quoteNotificationEnabled() {
		return r(K).quoteNotificationEnabled;
	},
	get replyNotificationEnabled() {
		return r(K).replyNotificationEnabled;
	},
	set replyNotificationEnabled(e) {
		Z("replyNotificationEnabled", e), Y("replyNotificationEnabled");
	},
	get failClosedContentWarning() {
		return r(K).failClosedContentWarning;
	},
	set failClosedContentWarning(e) {
		Z("failClosedContentWarning", e), Y("failClosedContentWarning");
	},
	set quoteNotificationEnabled(e) {
		Z("quoteNotificationEnabled", e), Y("quoteNotificationEnabled");
	},
	get imageQualityLevel() {
		return r(K).imageQualityLevel;
	},
	set imageQualityLevel(e) {
		Z("imageQualityLevel", e), Y("imageQualityLevel");
	},
	get videoQualityLevel() {
		return r(K).videoQualityLevel;
	},
	set videoQualityLevel(e) {
		Z("videoQualityLevel", e), Y("videoQualityLevel");
	},
	get mediaFreePlacement() {
		return r(K).mediaFreePlacement;
	},
	set mediaFreePlacement(e) {
		Z("mediaFreePlacement", e), Y("mediaFreePlacement");
	},
	get showMascot() {
		return r(K).showMascot;
	},
	set showMascot(e) {
		Z("showMascot", e), Y("showMascot");
	},
	get showFlavorText() {
		return r(K).showFlavorText;
	},
	set showFlavorText(e) {
		Z("showFlavorText", e), Y("showFlavorText");
	},
	get externalNostrClient() {
		return r(K).externalNostrClient;
	},
	set externalNostrClient(e) {
		let t = ce(U, e);
		t && (r(K).externalNostrClient = t);
	},
	get externalNostrClientCustomUrl() {
		return r(K).externalNostrClientCustomUrl;
	},
	set externalNostrClientCustomUrl(e) {
		let t = oe(U, e);
		t && (r(K).externalNostrClientCustomUrl = t);
	},
	applyParentSettings(e, t = "parentForced") {
		let n = [];
		return e.locale !== void 0 && (X(e.locale, {
			source: t,
			syncDocumentLang: !0
		}), n.push("locale")), e.themeMode !== void 0 && (H.set(e.themeMode, t), n.push("themeMode")), e.imageQualityLevel === void 0 && e.imageCompressionLevel !== void 0 && (e = {
			...e,
			imageQualityLevel: s(e.imageCompressionLevel)
		}), e.videoQualityLevel === void 0 && e.videoCompressionLevel !== void 0 && (e = {
			...e,
			videoQualityLevel: s(e.videoCompressionLevel)
		}), De.forEach((r) => {
			Q(e, r, t, n);
		}), n.length > 0 && Te(), n;
	},
	applyStoredSnapshot() {
		$.reload(), H.reload();
	}
};
function ke() {
	let e = ve(U);
	return N.persistLocalStorageKeys([_.FIRST_VISIT]), e;
}
export { N as a, P as i, $ as n, T as o, H as r, ke as t };
