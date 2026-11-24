import { _t as e, ht as t, rt as n, yt as r } from "./index-client-DEFG3Gqk.js";
import { a as i, n as a } from "./appRuntimeEnvironment-Bzv9wJOh.js";
import { n as o } from "./relayConfigUtils-56ujWwKF.js";
import { $ as s } from "./LoadingPlaceholder-YrD8D_td.js";
import { r as c } from "./authStore.svelte-DkMZvUSe.js";
import { n as ee, t as te } from "./hostRelayRuntime-SryW0auD.js";
import { A as ne, B as re, C as ie, D as ae, F as oe, I as se, L as ce, M as le, N as ue, O as de, P as fe, R as pe, T as l, V as me, _ as he, c as ge, d as _e, dt as u, f as ve, g as ye, h as be, j as xe, k as Se, l as Ce, m as we, p as Te, u as Ee, v as De, x as d, y as Oe } from "./appUtils-B3-zUpkb.js";
import { c as ke, d as Ae, f as je, l as Me, u as Ne } from "./signedEventResultValidator-7WV1YEyT.js";
import { a as f } from "./uploadStore.svelte-DWirN09w.js";
// D:/ドキュメント/GitHub/ehagaki/src/stores/relayStore.svelte.ts
var p = null, m = r(t([])), h = r(null), g = r(null), _ = r(!1), v = r(0), y = {
	pubkeyHex: null,
	generation: 0
};
function b(e) {
	return y = {
		pubkeyHex: e,
		generation: y.generation + 1
	}, y;
}
function x(e) {
	return y.pubkeyHex === e.pubkeyHex && y.generation === e.generation && c.value.isAuthenticated && c.value.pubkey === e.pubkeyHex;
}
var S = {
	get value() {
		return n(m);
	},
	set: (t) => {
		e(m, t, !0);
	}
}, C = {
	get value() {
		return n(h);
	},
	set: (t) => {
		e(h, t, !0);
	}
}, w = {
	get value() {
		return n(g);
	},
	set: (t) => {
		e(g, t, !0);
	}
}, Pe = {
	get value() {
		return n(_);
	},
	set: (t) => {
		e(_, t, !0);
	}
}, T = {
	get value() {
		return n(v);
	},
	set: (t) => {
		e(v, t, !0);
	}
};
function Fe(e) {
	p = e;
}
function E() {
	y = {
		...y,
		generation: y.generation + 1
	};
}
function D() {
	E(), y = {
		pubkeyHex: null,
		generation: y.generation
	}, n(g) !== "host" && (C.set(null), S.set([]), w.set(null));
}
function Ie(e) {
	E(), te(e), C.set(e), S.set(o.extractWriteRelays(e)), w.set("host");
}
function Le() {
	ee(), n(g) === "host" && (E(), C.set(null), S.set([]), w.set(null));
}
async function Re(e) {
	if (n(g) === "host") return;
	if (!p || !e) {
		D();
		return;
	}
	let t = b(e);
	try {
		let n = await p.loadRelayConfigForUI(e);
		if (!x(t)) return;
		if (!n) {
			C.set(null), S.set([]);
			return;
		}
		C.set(n.relayConfig), S.set(n.writeRelays), w.set("user");
	} catch (e) {
		if (!x(t)) return;
		throw e;
	}
}
async function ze(e, t) {
	if (n(g) === "host" || !e || !c.value.isAuthenticated || c.value.pubkey !== e) return;
	let r = b(e);
	try {
		if (!x(r)) return;
		C.set(t), w.set("user");
		let e = o.extractWriteRelays(t);
		S.set(e), x(r) && T.set(n(v) + 1);
	} catch (e) {
		console.error("リレー設定の保存エラー:", e);
	}
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/embedStorageKeys.ts
var Be = [
	u.LOCALE,
	u.THEME_MODE,
	u.DARK_MODE,
	u.CLIENT_TAG_ENABLED,
	u.QUOTE_NOTIFICATION_ENABLED,
	u.REPLY_NOTIFICATION_ENABLED,
	u.FAIL_CLOSED_CONTENT_WARNING,
	u.IMAGE_QUALITY_LEVEL,
	u.VIDEO_QUALITY_LEVEL,
	u.MEDIA_FREE_PLACEMENT,
	u.SHOW_MASCOT,
	u.SHOW_FLAVOR_TEXT,
	u.ACCENT_COLOR,
	u.BASE_COLOR,
	u.SETTINGS_PREFERENCE_METADATA
], Ve = [
	u.LOCALE,
	u.THEME_MODE,
	u.DARK_MODE,
	u.CLIENT_TAG_ENABLED,
	u.QUOTE_NOTIFICATION_ENABLED,
	u.REPLY_NOTIFICATION_ENABLED,
	u.IMAGE_QUALITY_LEVEL,
	u.VIDEO_QUALITY_LEVEL,
	u.MEDIA_FREE_PLACEMENT,
	u.SHOW_MASCOT,
	u.SHOW_FLAVOR_TEXT,
	u.ACCENT_COLOR,
	u.BASE_COLOR,
	u.SETTINGS_PREFERENCE_METADATA,
	u.LEGACY_IMAGE_COMPRESSION_LEVEL,
	u.LEGACY_VIDEO_COMPRESSION_LEVEL,
	u.FIRST_VISIT,
	u.SHARED_MEDIA_PROCESSED,
	u.FOOTER_SETTING_SHORTCUTS
], O = [u.FAIL_CLOSED_CONTENT_WARNING], He = [u.LEGACY_IMAGE_COMPRESSION_LEVEL, u.LEGACY_VIDEO_COMPRESSION_LEVEL];
u.FIRST_VISIT, u.SHARED_MEDIA_PROCESSED, u.FOOTER_SETTING_SHORTCUTS;
var k = [...Ve, ...O], A = new Set(k);
function j(e) {
	return A.has(e);
}
function M(e) {
	return e.filter(j);
}
function Ue(e) {
	return Array.from(/* @__PURE__ */ new Set([...e, u.SETTINGS_PREFERENCE_METADATA]));
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/embedStorageService.ts
var We = 1e3, Ge = new Set(O);
function N(e) {
	return Ge.has(e);
}
function Ke() {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `storage-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function qe(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	if (typeof t.timestamp != "number") return !1;
	if (t.values !== void 0) {
		if (typeof t.values != "object" || t.values === null || Array.isArray(t.values)) return !1;
		for (let [e, n] of Object.entries(t.values)) if (!j(e) || n !== null && typeof n != "string") return !1;
	}
	for (let e of ["applied", "removed"]) {
		let n = t[e];
		if (n !== void 0 && (!Array.isArray(n) || !n.every((e) => typeof e == "string" && j(e)))) return !1;
	}
	return !0;
}
function Je(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	return typeof t.timestamp == "number" && typeof t.code == "string" && t.code.trim().length > 0 && (t.message === void 0 || typeof t.message == "string");
}
var P = new class {
	windowObj;
	console;
	requestTimeoutMs;
	trustedParentOrigin = null;
	isListening = !1;
	pendingRequests = /* @__PURE__ */ new Map();
	constructor(e = typeof window < "u" ? window : {}, t = typeof window < "u" ? window.console : {}, n = We) {
		this.windowObj = e, this.console = t, this.requestTimeoutMs = n;
	}
	initialize(e = {}) {
		if (!this.isInIframe()) return !1;
		let t = e.parentOrigin ?? Ae(e.locationSearch ?? this.windowObj.location?.search);
		return t ? (this.trustedParentOrigin = t, this.ensureMessageListener(), !0) : !1;
	}
	async get(e) {
		let t = M(e);
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
		for (let i of M(e)) {
			let e = t.getItem(i);
			e === null ? r.push(i) : n[i] = e;
		}
		Object.keys(n).length > 0 && this.set(n).catch(() => {}), r.length > 0 && this.remove(r).catch(() => {});
	}
	async set(e) {
		let t = {};
		for (let [n, r] of Object.entries(e)) j(n) && (t[n] = r);
		if (Object.keys(t).length === 0) return null;
		let n = {}, r = [];
		for (let [e, i] of Object.entries(t)) N(e) ? r.push([e, i]) : n[e] = i;
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
		let t = M(e);
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
		for (let [r, i] of Object.entries(e)) i !== null && j(r) && (t.setItem(r, i), n.push(r));
		return n;
	}
	async sendRequest(e, t) {
		if (!this.windowObj || !this.isInIframe() || !this.trustedParentOrigin) return Promise.reject({
			timestamp: Date.now(),
			code: "storage_parent_unavailable",
			message: "parent storage is not available"
		});
		let n = Ke(), r = new Promise((e, t) => {
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
				namespace: Me,
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
			compatibleKeys: e.filter((e) => !N(e)),
			optionalKeys: e.filter(N)
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
		let t = ke(e, this.windowObj, this.trustedParentOrigin);
		if (!t || t.type !== "storage.result" && t.type !== "storage.error") return;
		if (Ne(t.type) && !je(t.requestId)) {
			this.console.warn("requestId がない storage response を無視:", t);
			return;
		}
		if (!t.requestId) return;
		let n = this.pendingRequests.get(t.requestId);
		if (n) {
			if (t.type === "storage.result") {
				if (!qe(t.payload)) {
					this.console.warn("不正な storage.result payload を無視:", t.payload);
					return;
				}
				clearTimeout(n.timeoutId), this.pendingRequests.delete(t.requestId), n.resolve(t.payload);
			} else Je(t.payload) ? (clearTimeout(n.timeoutId), this.pendingRequests.delete(t.requestId), n.reject(t.payload)) : this.console.warn("不正な storage.error payload を無視:", t.payload);
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
function F(e) {
	P.persistLocalStorageKeys(Ue(e));
}
function Ye() {
	P.persistLocalStorageKeys([...Be, ...He]);
}
// D:/ドキュメント/GitHub/ehagaki/src/stores/themeStore.svelte.ts
function Xe() {
	return window.matchMedia("(prefers-color-scheme: dark)").matches;
}
function I(e) {
	return e === "dark" || e !== "light" && Xe();
}
function L(e) {
	let t = a().themeTarget;
	e ? (t.classList.add("dark"), t.classList.remove("light"), t.style.colorScheme = "dark") : (t.classList.add("light"), t.classList.remove("dark"), t.style.colorScheme = "light");
}
var R = i(), z = d(R), B = I(z), V = r(t(z)), H = r(t(B));
L(B), typeof window < "u" && window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (t) => {
	n(V) === "system" && (e(H, t.matches, !0), L(t.matches));
});
var U = {
	get value() {
		return n(V);
	},
	get isDark() {
		return n(H);
	},
	set: (t, n = "user") => {
		let r = re(R, t, n), i = I(r);
		e(V, r, !0), e(H, i, !0), L(i), F([u.THEME_MODE, u.DARK_MODE]);
	},
	reload: () => {
		let t = d(R), n = I(t);
		e(V, t, !0), e(H, n, !0), L(n);
	},
	reset: (e = "user") => {
		U.set("system", e);
	}
}, W = i();
function G() {
	let e = Ee(W, navigator), t = _e(W, e);
	return {
		locale: e,
		clientTagEnabled: Ce(W),
		quoteNotificationEnabled: ye(W),
		replyNotificationEnabled: he(W),
		failClosedContentWarning: ve(W),
		imageQualityLevel: Te(W),
		videoQualityLevel: ie(W),
		mediaFreePlacement: be(W),
		showMascot: Oe(W),
		showFlavorText: De(W),
		externalNostrClient: t.client,
		externalNostrClientCustomUrl: t.customUrlTemplate,
		localRelayUrl: a().runtimeKind === "standalone" ? we(W) : null
	};
}
var K = G(), q = r(t(K));
f.set(K.mediaFreePlacement);
function J(e) {
	f.set(e);
}
var Y = {
	clientTagEnabled: {
		storageKeys: [u.CLIENT_TAG_ENABLED],
		apply: (e, t) => ae(W, e, t)
	},
	quoteNotificationEnabled: {
		storageKeys: [u.QUOTE_NOTIFICATION_ENABLED],
		apply: (e, t) => oe(W, e, t)
	},
	replyNotificationEnabled: {
		storageKeys: [u.REPLY_NOTIFICATION_ENABLED],
		apply: (e, t) => se(W, e, t)
	},
	failClosedContentWarning: {
		storageKeys: [u.FAIL_CLOSED_CONTENT_WARNING],
		apply: (e, t) => ne(W, e, t)
	},
	imageQualityLevel: {
		storageKeys: [u.IMAGE_QUALITY_LEVEL, u.LEGACY_IMAGE_COMPRESSION_LEVEL],
		apply: (e, t) => xe(W, e, t)
	},
	videoQualityLevel: {
		storageKeys: [u.VIDEO_QUALITY_LEVEL, u.LEGACY_VIDEO_COMPRESSION_LEVEL],
		apply: (e, t) => me(W, e, t)
	},
	mediaFreePlacement: {
		storageKeys: [u.MEDIA_FREE_PLACEMENT],
		apply: (e, t) => fe(W, e, t),
		afterApply: J
	},
	showMascot: {
		storageKeys: [u.SHOW_MASCOT],
		apply: (e, t) => pe(W, e, t)
	},
	showFlavorText: {
		storageKeys: [u.SHOW_FLAVOR_TEXT],
		apply: (e, t) => ce(W, e, t)
	}
}, Ze = [
	"imageQualityLevel",
	"videoQualityLevel",
	"clientTagEnabled",
	"quoteNotificationEnabled",
	"replyNotificationEnabled",
	"mediaFreePlacement",
	"showMascot",
	"showFlavorText"
];
function X(e) {
	F(Y[e].storageKeys);
}
function Qe(e) {
	return Y[e];
}
function Z(e, { source: t = "user", syncDocumentLang: r = !1 } = {}) {
	let i = ue(W, e, t);
	return n(q).locale = i, r && (a().themeTarget.lang = i), s.set(i), i;
}
function Q(e, t, r = "user") {
	let i = Qe(e), a = i.apply(t, r);
	return n(q)[e] = a, i.afterApply?.(a), a;
}
function $e(e, t, n, r) {
	let i = e[t];
	i !== void 0 && (Q(t, i, n), r.push(t));
}
var $ = {
	get localRelayUrl() {
		return n(q).localRelayUrl;
	},
	setLocalRelayUrl(e) {
		a().runtimeKind === "standalone" && (n(q).localRelayUrl = le(W, e));
	},
	get value() {
		return n(q);
	},
	reload() {
		e(q, G(), !0), J(n(q).mediaFreePlacement), s.set(n(q).locale);
	},
	get locale() {
		return n(q).locale;
	},
	set locale(e) {
		Z(e), F([u.LOCALE]);
	},
	get clientTagEnabled() {
		return n(q).clientTagEnabled;
	},
	set clientTagEnabled(e) {
		Q("clientTagEnabled", e), X("clientTagEnabled");
	},
	get quoteNotificationEnabled() {
		return n(q).quoteNotificationEnabled;
	},
	get replyNotificationEnabled() {
		return n(q).replyNotificationEnabled;
	},
	set replyNotificationEnabled(e) {
		Q("replyNotificationEnabled", e), X("replyNotificationEnabled");
	},
	get failClosedContentWarning() {
		return n(q).failClosedContentWarning;
	},
	set failClosedContentWarning(e) {
		Q("failClosedContentWarning", e), X("failClosedContentWarning");
	},
	set quoteNotificationEnabled(e) {
		Q("quoteNotificationEnabled", e), X("quoteNotificationEnabled");
	},
	get imageQualityLevel() {
		return n(q).imageQualityLevel;
	},
	set imageQualityLevel(e) {
		Q("imageQualityLevel", e), X("imageQualityLevel");
	},
	get videoQualityLevel() {
		return n(q).videoQualityLevel;
	},
	set videoQualityLevel(e) {
		Q("videoQualityLevel", e), X("videoQualityLevel");
	},
	get mediaFreePlacement() {
		return n(q).mediaFreePlacement;
	},
	set mediaFreePlacement(e) {
		Q("mediaFreePlacement", e), X("mediaFreePlacement");
	},
	get showMascot() {
		return n(q).showMascot;
	},
	set showMascot(e) {
		Q("showMascot", e), X("showMascot");
	},
	get showFlavorText() {
		return n(q).showFlavorText;
	},
	set showFlavorText(e) {
		Q("showFlavorText", e), X("showFlavorText");
	},
	get externalNostrClient() {
		return n(q).externalNostrClient;
	},
	set externalNostrClient(e) {
		let t = Se(W, e);
		t && (n(q).externalNostrClient = t);
	},
	get externalNostrClientCustomUrl() {
		return n(q).externalNostrClientCustomUrl;
	},
	set externalNostrClientCustomUrl(e) {
		let t = de(W, e);
		t && (n(q).externalNostrClientCustomUrl = t);
	},
	applyParentSettings(e, t = "parentForced") {
		let n = [];
		return e.locale !== void 0 && (Z(e.locale, {
			source: t,
			syncDocumentLang: !0
		}), n.push("locale")), e.themeMode !== void 0 && (U.set(e.themeMode, t), n.push("themeMode")), e.imageQualityLevel === void 0 && e.imageCompressionLevel !== void 0 && (e = {
			...e,
			imageQualityLevel: l(e.imageCompressionLevel)
		}), e.videoQualityLevel === void 0 && e.videoCompressionLevel !== void 0 && (e = {
			...e,
			videoQualityLevel: l(e.videoCompressionLevel)
		}), Ze.forEach((r) => {
			$e(e, r, t, n);
		}), n.length > 0 && Ye(), n;
	},
	applyStoredSnapshot() {
		$.reload(), U.reload();
	}
};
function et() {
	let e = ge(W);
	return P.persistLocalStorageKeys([u.FIRST_VISIT]), e;
}
export { Fe as _, P as a, Le as c, Re as d, w as f, ze as g, D as h, F as i, E as l, T as m, $ as n, k as o, C as p, U as r, Ie as s, et as t, Pe as u, S as v };
