import { t as e } from "./localRelayUrl-t7UxBsyT.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/constants.ts
var t = "https://nostr.build/api/v2/upload/files", n = 1073741824, r = {
	maxPixels: 8e6,
	maxLongEdge: 8192
}, i = {
	none: { skip: !0 },
	high: {
		maxShortEdge: 2048,
		fileType: "image/webp",
		quality: .95
	},
	medium: {
		maxShortEdge: 1024,
		fileType: "image/webp",
		quality: .8
	},
	low: {
		maxShortEdge: 800,
		fileType: "image/webp",
		quality: .5
	}
}, a = /(?:^|[\s\n\u3000])#([^\s\n\u3000#]+)/g, o = ["http:", "https:"], s = [
	".png",
	".jpg",
	".jpeg",
	".gif",
	".webp",
	".svg",
	".avif"
], c = [
	".mp4",
	".webm",
	".mov",
	".avi",
	".mkv"
], l = "medium", u = {
	HISTORY_ACTIVE_TAB: "historyActiveTab",
	LOCALE: "locale",
	UPLOAD_ENDPOINT: "uploadEndpoint",
	CLIENT_TAG_ENABLED: "clientTagEnabled",
	QUOTE_NOTIFICATION_ENABLED: "quoteNotificationEnabled",
	REPLY_NOTIFICATION_ENABLED: "replyNotificationEnabled",
	FAIL_CLOSED_CONTENT_WARNING: "failClosedContentWarning",
	IMAGE_QUALITY_LEVEL: "imageQualityLevel",
	VIDEO_QUALITY_LEVEL: "videoQualityLevel",
	LEGACY_IMAGE_COMPRESSION_LEVEL: "imageCompressionLevel",
	LEGACY_VIDEO_COMPRESSION_LEVEL: "videoCompressionLevel",
	SHOW_MASCOT: "showMascot",
	SHOW_FLAVOR_TEXT: "showFlavorText",
	EXTERNAL_NOSTR_CLIENT: "externalNostrClient",
	EXTERNAL_NOSTR_CLIENT_CUSTOM_URL: "externalNostrClientCustomUrl",
	LOCAL_RELAY_URL: "localRelayUrl",
	SETTINGS_PREFERENCE_METADATA: "settingsPreferenceMetadata",
	FIRST_VISIT: "firstVisit",
	SHARED_MEDIA_PROCESSED: "sharedMediaProcessed",
	NOSTR_RELAYS: "nostr-relays-",
	DRAFTS: "nostr-drafts",
	DRAFTS_FALLBACK: "nostr-drafts-fallback-v1",
	HASHTAG_HISTORY: "hashtagHistory",
	MEDIA_FREE_PLACEMENT: "mediaFreePlacement",
	THEME_MODE: "themeMode",
	DARK_MODE: "darkMode",
	FOOTER_SETTING_SHORTCUTS: "footerSettingShortcuts",
	ACCENT_COLOR: "accentColor",
	BASE_COLOR: "baseColor",
	NOSTR_ACCOUNTS: "nostr-accounts",
	NOSTR_ACTIVE_ACCOUNT: "nostr-active-account",
	NOSTR_SECRET_KEY_PREFIX: "nostr-secret-key-",
	NOSTR_NIP46_SESSION_PREFIX: "nostr-nip46-session-",
	NOSTR_PARENT_CLIENT_SESSION_PREFIX: "nostr-parent-client-session-",
	NOSTR_NIP46_CONNECT_RELAYS: "nostr-nip46-connect-relays",
	NOSTR_NIP07_PUBKEY: "nostr-nip07-pubkey",
	NOSTR_SECRET_KEY_LEGACY: "nostr-secret-key",
	NOSTR_NIP46_SESSION_LEGACY: "nostr-nip46-session",
	NOSTR_PROFILE: "nostr-profile-"
}, d = [
	"none",
	"low",
	"medium",
	"high"
], f = [
	{
		label: "share.yabu.me",
		url: "https://share.yabu.me/api/v2/media"
	},
	{
		label: "nostpic.com",
		url: "https://nostpic.com/api/v2/media"
	},
	{
		label: "nostrcheck.me",
		url: "https://nostrcheck.me/api/v2/media"
	},
	{
		label: "files.sovbit.host",
		url: "https://files.sovbit.host/api/v2/media"
	},
	{
		label: "nostr.build",
		url: "https://nostr.build/api/v2/nip96/upload"
	}
];
function p(e) {
	return e === "ja" ? "https://share.yabu.me/api/v2/media" : "https://nostrcheck.me/api/v2/media";
}
function m(e) {
	return [
		{
			label: e("settingsDialog.quality_lossless"),
			value: "none"
		},
		{
			label: e("settingsDialog.quality_high"),
			value: "high"
		},
		{
			label: e("settingsDialog.quality_medium"),
			value: "medium"
		},
		{
			label: e("settingsDialog.quality_low"),
			value: "low"
		}
	];
}
var h = {
	DEBOUNCE_DELAY: 300,
	ENABLE_HASHTAGS: !0,
	ENABLE_AUTO_LINK: !0,
	ENABLE_IMAGE_CONVERSION: !0,
	HASHTAG_CLASS: "hashtag",
	PLUGIN_KEYS: {
		HASHTAG_DECORATION: "hashtag-decoration",
		LINK_AND_IMAGE_CONVERSION: "link-and-image-conversion",
		CONTENT_UPDATE_TRACKER: "content-update-tracker"
	}
}, g = [
	"balloonMessage.success.post_success",
	"balloonMessage.success.sent",
	"balloonMessage.success.to_everyone"
], _ = "balloonMessage.error.post_error", v = "balloonMessage.error.post_rejected", y = "balloonMessage.error.post_timeout", b = "balloonMessage.error.post_network_error", x = "balloonMessage.error.sign_extension_unavailable", S = ["balloonMessage.tips.long_press_to_post"], ee = {
	MAX_WAIT_TIME: 15e3,
	RETRY_INTERVAL: 1e3,
	TIMEOUT_MESSAGE: "Upload processing timeout"
}, te = {
	MAX_WAIT_TIME: 15e3,
	RETRY_INTERVAL: 1e3,
	TIMEOUT_MESSAGE: "Uploaded media is not available yet"
}, ne = "auth_superseded", re = /nsec1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{10,}/, ie = /^nsec1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{58}$/, ae = {
	REQUEST_TIMEOUT: 3e3,
	SW_CONTROLLER_WAIT_TIMEOUT: 100
}, C = [
	"nostter",
	"jumble",
	"lumilumi",
	"primal",
	"njump",
	"custom"
], w = {
	nostter: "https://nostter.app/{nevent}",
	jumble: "https://jumble.social/{nevent}",
	primal: "https://primal.net/e/{nevent}",
	njump: "https://njump.me/{nevent}",
	lumilumi: "https://lumilumi.app/{nevent}"
};
function T(e) {
	return typeof e == "string" && C.includes(e);
}
function E(e) {
	return T(e) ? e : null;
}
function D(e) {
	let t = e?.trim() ?? "";
	if (!t || t.split("{nevent}").length !== 2) return null;
	try {
		let e = new URL(t);
		return e.protocol === "https:" && e.hostname ? t : null;
	} catch {
		return null;
	}
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/settingsStorage.ts
function O(t) {
	try {
		let n = t.getItem(u.LOCAL_RELAY_URL);
		return n ? e(n) : null;
	} catch {
		return null;
	}
}
function k(t, n) {
	if (!n.trim()) return t.removeItem(u.LOCAL_RELAY_URL), null;
	let r = e(n);
	if (!r) throw Error("invalid_local_relay_url");
	return t.setItem(u.LOCAL_RELAY_URL, r), r;
}
function A(e) {
	return typeof e == "string" && e.toLowerCase().startsWith("ja");
}
function j(e) {
	return A(e) ? "ja" : "en";
}
function M(e) {
	try {
		let t = e.getItem(u.SETTINGS_PREFERENCE_METADATA);
		if (!t) return {};
		let n = JSON.parse(t);
		return typeof n != "object" || !n ? {} : {
			embedBootstrapApplied: n.embedBootstrapApplied === !0,
			sources: n.sources && typeof n.sources == "object" ? n.sources : {}
		};
	} catch {
		return {};
	}
}
function N(e, t) {
	e.setItem(u.SETTINGS_PREFERENCE_METADATA, JSON.stringify({
		embedBootstrapApplied: t.embedBootstrapApplied === !0,
		sources: t.sources ?? {}
	}));
}
function P(e, t) {
	return e == null ? t : e !== "false";
}
function F(e, t, n) {
	let r = e.getItem(t);
	return r === null ? (e.setItem(t, n ? "true" : "false"), n) : P(r, n);
}
function I(e) {
	if (!e) return null;
	let t = e === "skip" ? "none" : e;
	return d.includes(t) ? t : null;
}
function L(e) {
	return I(e);
}
function R(e) {
	let t = I(e);
	return t === "low" ? "high" : t === "high" ? "low" : t;
}
function z(e, t, n, r) {
	let i = L(e.getItem(t));
	if (i) return i;
	let a = R(e.getItem(n));
	if (!a) return null;
	e.setItem(t, a), e.removeItem && e.removeItem(n);
	let o = M(e), s = r === "imageQualityLevel" ? "imageCompressionLevel" : "videoCompressionLevel", c = o.sources?.[s];
	return c && !o.sources?.[r] && B(e, r, c), a;
}
function B(e, t, n) {
	let r = M(e);
	N(e, {
		...r,
		sources: {
			...r.sources ?? {},
			[t]: n
		}
	});
}
function V(e) {
	let t = e.getItem(u.LOCALE);
	return t === "ja" || t === "en" ? t : null;
}
function H(e, t) {
	return V(e) ?? j(t.language);
}
function U(e, t) {
	let n = E(e.getItem(u.EXTERNAL_NOSTR_CLIENT));
	if (n) return {
		client: n,
		customUrlTemplate: n === "custom" ? e.getItem(u.EXTERNAL_NOSTR_CLIENT_CUSTOM_URL) ?? "" : ""
	};
	let r = j(t) === "ja" ? "nostter" : "jumble";
	return e.setItem(u.EXTERNAL_NOSTR_CLIENT, r), {
		client: r,
		customUrlTemplate: ""
	};
}
function W(e, t) {
	let n = E(t);
	return n ? (e.setItem(u.EXTERNAL_NOSTR_CLIENT, n), n) : null;
}
function G(e, t) {
	let n = D(t);
	return n ? (e.setItem(u.EXTERNAL_NOSTR_CLIENT_CUSTOM_URL, n), n) : null;
}
function K(e) {
	return F(e, u.CLIENT_TAG_ENABLED, !0);
}
function q(e) {
	return F(e, u.QUOTE_NOTIFICATION_ENABLED, !1);
}
function J(e) {
	return F(e, u.REPLY_NOTIFICATION_ENABLED, !1);
}
function oe(e) {
	return F(e, u.FAIL_CLOSED_CONTENT_WARNING, !1);
}
function se(e, t) {
	return z(e, u.IMAGE_QUALITY_LEVEL, u.LEGACY_IMAGE_COMPRESSION_LEVEL, "imageQualityLevel") ?? L(t) ?? "medium";
}
function ce(e) {
	let t = z(e, u.VIDEO_QUALITY_LEVEL, u.LEGACY_VIDEO_COMPRESSION_LEVEL, "videoQualityLevel");
	return e.getItem(u.VIDEO_QUALITY_LEVEL) === "skip" ? (e.setItem(u.VIDEO_QUALITY_LEVEL, "none"), "none") : t || (e.setItem(u.VIDEO_QUALITY_LEVEL, l), l);
}
function le(e) {
	return F(e, u.MEDIA_FREE_PLACEMENT, !1);
}
function ue(e) {
	return F(e, u.SHOW_MASCOT, !0);
}
function de(e) {
	return F(e, u.SHOW_FLAVOR_TEXT, !0);
}
function fe(e) {
	let t = e.getItem(u.DARK_MODE);
	return t === null ? null : t === "true";
}
function Y(e) {
	return e === "system" || e === "light" || e === "dark" ? e : null;
}
function X(e) {
	if (typeof e != "string") return null;
	let t = e.trim().replace(/^#/, "");
	return /^[0-9a-f]{6}$/i.test(t) ? `#${t.toLowerCase()}` : null;
}
function Z(e, t) {
	let n = e.getItem(t), r = X(n);
	return n !== null && !r && e.removeItem(t), r;
}
function pe(e) {
	return {
		accentColor: Z(e, u.ACCENT_COLOR),
		baseColor: Z(e, u.BASE_COLOR)
	};
}
function me(e, t, n) {
	let r = X(n);
	return r ? (e.setItem(t, r), r) : null;
}
function he(e) {
	e.removeItem(u.ACCENT_COLOR), e.removeItem(u.BASE_COLOR);
}
function ge(e) {
	let t = Y(e.getItem(u.THEME_MODE));
	if (t) return e.getItem(u.DARK_MODE) !== null && e.removeItem(u.DARK_MODE), t;
	if (e.getItem(u.THEME_MODE) !== null) return e.setItem(u.THEME_MODE, "system"), e.removeItem(u.DARK_MODE), "system";
	let n = fe(e);
	if (n !== null) {
		let t = n ? "dark" : "light";
		return e.setItem(u.THEME_MODE, t), e.removeItem(u.DARK_MODE), t;
	}
	return e.setItem(u.THEME_MODE, "system"), "system";
}
function _e(e, t, n = "user") {
	let r = j(t);
	return e.setItem(u.LOCALE, r), B(e, "locale", n), r;
}
function ve(e, t, n = "user") {
	let r = L(t) ?? "medium";
	return e.setItem(u.IMAGE_QUALITY_LEVEL, r), B(e, "imageQualityLevel", n), r;
}
function ye(e, t, n = "user") {
	let r = L(t) ?? "medium";
	return e.setItem(u.VIDEO_QUALITY_LEVEL, r), B(e, "videoQualityLevel", n), r;
}
function be(e, t, n = "user") {
	return e.setItem(u.CLIENT_TAG_ENABLED, t ? "true" : "false"), B(e, "clientTagEnabled", n), t;
}
function xe(e, t, n = "user") {
	return e.setItem(u.QUOTE_NOTIFICATION_ENABLED, t ? "true" : "false"), B(e, "quoteNotificationEnabled", n), t;
}
function Se(e, t, n = "user") {
	return e.setItem(u.REPLY_NOTIFICATION_ENABLED, t ? "true" : "false"), B(e, "replyNotificationEnabled", n), t;
}
function Ce(e, t, n = "user") {
	return e.setItem(u.FAIL_CLOSED_CONTENT_WARNING, t ? "true" : "false"), B(e, "failClosedContentWarning", n), t;
}
function we(e, t, n = "user") {
	return e.setItem(u.MEDIA_FREE_PLACEMENT, t ? "true" : "false"), B(e, "mediaFreePlacement", n), t;
}
function Te(e, t, n = "user") {
	return e.setItem(u.SHOW_MASCOT, t ? "true" : "false"), B(e, "showMascot", n), t;
}
function Ee(e, t, n = "user") {
	return e.setItem(u.SHOW_FLAVOR_TEXT, t ? "true" : "false"), B(e, "showFlavorText", n), t;
}
function De(e, t, n = "user") {
	let r = Y(t) ?? "system";
	return e.setItem(u.THEME_MODE, r), e.removeItem(u.DARK_MODE), B(e, "darkMode", n), r;
}
function Oe(e) {
	return e.getItem(u.FIRST_VISIT) !== "1";
}
function Q(e) {
	let t = Oe(e);
	return t && e.setItem(u.FIRST_VISIT, "1"), t;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/appUtils.ts
var ke = { setTimeout: (e, t) => setTimeout(e, t) };
function Ae() {
	try {
		return crypto.randomUUID();
	} catch {
		return $();
	}
}
function $() {
	return Date.now().toString(36) + Math.random().toString(36).substring(2, 11);
}
function je(e, t) {
	return t(!0), e();
}
function Me(e) {
	if (e.type.startsWith("touch")) {
		let t = e, n = t.touches[0] || t.changedTouches[0];
		return {
			x: n.clientX,
			y: n.clientY
		};
	}
	{
		let t = e;
		return {
			x: t.clientX,
			y: t.clientY
		};
	}
}
function Ne(e, t, n, r, i) {
	let a = window.innerWidth || document.documentElement.clientWidth || 0, o = window.innerHeight || document.documentElement.clientHeight || 0, s = typeof n == "number" ? n : 0, c = r ? a - r - s : a - s, l = i ? o - i - s : o - s;
	return {
		x: Math.max(s, Math.min(c, e)),
		y: Math.max(s, Math.min(l, t))
	};
}
export { g as $, Ce as A, De as B, ce as C, be as D, j as E, xe as F, s as G, C as H, Se as I, ne as J, o as K, Ee as L, k as M, _e as N, G as O, we as P, x as Q, Te as R, pe as S, R as T, w as U, ye as V, D as W, b as X, _ as Y, v as Z, J as _, Me as a, a as at, V as b, Q as c, ie as ct, U as d, u as dt, y as et, oe as f, te as ft, q as g, f as gt, le as h, p as ht, $ as i, t as it, ve as j, W as k, K as l, re as lt, O as m, m as mt, ke as n, i as nt, je as o, r as ot, se as p, ee as pt, c as q, Ae as r, h as rt, he as s, n as st, Ne as t, S as tt, H as u, ae as ut, de as v, X as w, ge as x, ue as y, me as z };
