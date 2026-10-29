import { B as e, C as t, G as n, L as r, Mt as i, N as a, R as o, Tt as s, U as c, V as l, W as u, _t as d, bt as f, dt as p, f as m, ft as h, g, ht as _, i as v, j as ee, jt as y, k as te, lt as b, nt as x, ot as ne, r as S, st as C, t as re, tt as w, ut as T, v as E, w as D, wt as O, xt as k, z as A } from "./index-client-57Odq85c.js";
import { n as ie } from "./appRuntimeEnvironment-BvtUCHcA.js";
import { l as j, n as M, o as N } from "./relayConfigUtils-DD5f1UAM.js";
import { Q as P, X as F, l as I, st as L } from "./LoadingPlaceholder-DK5Hrsgb.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/localRelayUrl.ts
function R(e) {
	let t = e.trim();
	if (!/^wss?:\/\//i.test(t)) return null;
	try {
		let e = new URL(t);
		return e.hash || e.username || e.password ? null : M.normalizeExternalRelayUrl(t);
	} catch {
		return null;
	}
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/constants.ts
var z = "https://nostr.build/api/v2/upload/files", B = 1073741824, V = {
	enabled: !0,
	aspectRatioThreshold: 3,
	minShortEdge: 320,
	maxMegapixels: 8
}, H = {
	none: { skip: !0 },
	high: {
		maxWidthOrHeight: 2048,
		fileType: "image/webp",
		initialQuality: .95,
		useWebWorker: !0
	},
	medium: {
		maxWidthOrHeight: 1024,
		fileType: "image/webp",
		initialQuality: .8,
		useWebWorker: !0
	},
	low: {
		maxWidthOrHeight: 800,
		fileType: "image/webp",
		initialQuality: .5,
		useWebWorker: !0
	}
}, ae = /(?:^|[\s\n\u3000])#([^\s\n\u3000#]+)/g, oe = ["http:", "https:"], U = [
	".png",
	".jpg",
	".jpeg",
	".gif",
	".webp",
	".svg"
], W = [
	".mp4",
	".webm",
	".mov",
	".avi",
	".mkv"
], G = "medium", K = {
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
}, se = [
	"none",
	"low",
	"medium",
	"high"
], ce = [
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
function le(e) {
	return e === "ja" ? "https://share.yabu.me/api/v2/media" : "https://nostrcheck.me/api/v2/media";
}
function ue(e) {
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
var de = {
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
}, fe = [
	"balloonMessage.success.post_success",
	"balloonMessage.success.sent",
	"balloonMessage.success.to_everyone"
], pe = "balloonMessage.error.post_error", me = "balloonMessage.error.post_rejected", he = "balloonMessage.error.post_timeout", ge = "balloonMessage.error.post_network_error", _e = ["balloonMessage.tips.long_press_to_post"], ve = {
	MAX_WAIT_TIME: 15e3,
	RETRY_INTERVAL: 1e3,
	TIMEOUT_MESSAGE: "Upload processing timeout"
}, ye = {
	MAX_WAIT_TIME: 15e3,
	RETRY_INTERVAL: 1e3,
	TIMEOUT_MESSAGE: "Uploaded media is not available yet"
}, be = /nsec1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{10,}/, xe = /^nsec1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{58}$/, Se = {
	REQUEST_TIMEOUT: 3e3,
	SW_CONTROLLER_WAIT_TIMEOUT: 100
};
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/nostrUtils.ts
function Ce(e) {
	return be.test(e);
}
function we(e) {
	return xe.test(e);
}
function Te(e) {
	return N(e);
}
function Ee(e) {
	return {
		npub: j.npubEncode(e),
		nprofile: j.nprofileEncode({
			pubkey: e,
			relays: []
		})
	};
}
function De(e) {
	try {
		let { type: t, data: n } = j.decode(e);
		if (t !== "nsec") return console.warn("無効なnsec形式です"), {
			hex: "",
			npub: "",
			nprofile: ""
		};
		let r = Te(n), { npub: i, nprofile: a } = Ee(r);
		return {
			hex: r,
			npub: i,
			nprofile: a
		};
	} catch {
		return {
			hex: "",
			npub: "",
			nprofile: ""
		};
	}
}
function Oe(e) {
	try {
		return j.npubEncode(e);
	} catch {
		return `npub1${e.slice(0, 10)}...`;
	}
}
function ke(e, t, n) {
	for (let r of t) if (r && !e.includes(r) && (e.push(r), e.length >= n)) return;
}
function Ae(e, t = 3) {
	let n = [];
	for (let r of e) if (ke(n, r, t), n.length >= t) break;
	return n;
}
function je(e, t = [], n = []) {
	try {
		let r = Ae([t.slice(0, 1), n], 3);
		return j.nprofileEncode({
			pubkey: e,
			relays: r
		});
	} catch {
		return "";
	}
}
function Me(e) {
	try {
		let t = Ae([
			e.acceptedRelays ?? [],
			e.relayHints ?? [],
			e.writeRelays ?? []
		], 3);
		return j.neventEncode({
			id: e.eventId,
			author: e.authorPubkey,
			kind: e.kind,
			relays: t
		});
	} catch {
		return "";
	}
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryNevent.ts
function q(e, t = []) {
	return Me({
		eventId: e.eventId,
		authorPubkey: e.pubkeyHex,
		kind: e.kind,
		acceptedRelays: e.acceptedRelays,
		relayHints: e.relayHints,
		writeRelays: t
	});
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryExternalClient.ts
var Ne = [
	"nostter",
	"jumble",
	"lumilumi",
	"primal",
	"njump",
	"custom"
], Pe = {
	nostter: "https://nostter.app/{nevent}",
	jumble: "https://jumble.social/{nevent}",
	primal: "https://primal.net/e/{nevent}",
	njump: "https://njump.me/{nevent}",
	lumilumi: "https://lumilumi.app/{nevent}"
}, Fe = {
	nostter: "nostter",
	jumble: "Jumble",
	primal: "Primal",
	njump: "njump",
	lumilumi: "Lumilumi",
	custom: ""
};
function Ie(e) {
	return typeof e == "string" && Ne.includes(e);
}
function Le(e) {
	return Ie(e) ? e : null;
}
function J(e) {
	let t = e?.trim() ?? "";
	if (!t || t.split("{nevent}").length !== 2) return null;
	try {
		let e = new URL(t);
		return e.protocol === "https:" && e.hostname ? t : null;
	} catch {
		return null;
	}
}
function Re(e) {
	return e.client === "custom" ? J(e.customUrlTemplate) : Pe[e.client];
}
function ze(e, t) {
	if (!t) return null;
	let n = Re(e);
	if (!n) return null;
	let r = n.replace("{nevent}", t);
	try {
		return new URL(r).protocol === "https:" ? r : null;
	} catch {
		return null;
	}
}
function Be(e, t, n = []) {
	return ze(t, q(e, n));
}
function Ve(e) {
	if (e.client !== "custom") return Fe[e.client];
	let t = Re(e);
	if (!t) return null;
	try {
		return new URL(t).hostname || null;
	} catch {
		return null;
	}
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/settingsStorage.ts
function He(e) {
	try {
		let t = e.getItem(K.LOCAL_RELAY_URL);
		return t ? R(t) : null;
	} catch {
		return null;
	}
}
function Ue(e, t) {
	if (!t.trim()) return e.removeItem(K.LOCAL_RELAY_URL), null;
	let n = R(t);
	if (!n) throw Error("invalid_local_relay_url");
	return e.setItem(K.LOCAL_RELAY_URL, n), n;
}
function We(e) {
	return typeof e == "string" && e.toLowerCase().startsWith("ja");
}
function Y(e) {
	return We(e) ? "ja" : "en";
}
function Ge(e) {
	try {
		let t = e.getItem(K.SETTINGS_PREFERENCE_METADATA);
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
function Ke(e, t) {
	e.setItem(K.SETTINGS_PREFERENCE_METADATA, JSON.stringify({
		embedBootstrapApplied: t.embedBootstrapApplied === !0,
		sources: t.sources ?? {}
	}));
}
function qe(e, t) {
	return e == null ? t : e !== "false";
}
function X(e, t, n) {
	let r = e.getItem(t);
	return r === null ? (e.setItem(t, n ? "true" : "false"), n) : qe(r, n);
}
function Je(e) {
	if (!e) return null;
	let t = e === "skip" ? "none" : e;
	return se.includes(t) ? t : null;
}
function Z(e) {
	return Je(e);
}
function Ye(e) {
	let t = Je(e);
	return t === "low" ? "high" : t === "high" ? "low" : t;
}
function Xe(e, t, n, r) {
	let i = Z(e.getItem(t));
	if (i) return i;
	let a = Ye(e.getItem(n));
	if (!a) return null;
	e.setItem(t, a), e.removeItem && e.removeItem(n);
	let o = Ge(e), s = r === "imageQualityLevel" ? "imageCompressionLevel" : "videoCompressionLevel", c = o.sources?.[s];
	return c && !o.sources?.[r] && Q(e, r, c), a;
}
function Q(e, t, n) {
	let r = Ge(e);
	Ke(e, {
		...r,
		sources: {
			...r.sources ?? {},
			[t]: n
		}
	});
}
function Ze(e) {
	let t = e.getItem(K.LOCALE);
	return t === "ja" || t === "en" ? t : null;
}
function Qe(e, t) {
	return Ze(e) ?? Y(t.language);
}
function $e(e, t) {
	let n = Le(e.getItem(K.EXTERNAL_NOSTR_CLIENT));
	if (n) return {
		client: n,
		customUrlTemplate: n === "custom" ? e.getItem(K.EXTERNAL_NOSTR_CLIENT_CUSTOM_URL) ?? "" : ""
	};
	let r = Y(t) === "ja" ? "nostter" : "jumble";
	return e.setItem(K.EXTERNAL_NOSTR_CLIENT, r), {
		client: r,
		customUrlTemplate: ""
	};
}
function et(e, t) {
	let n = Le(t);
	return n ? (e.setItem(K.EXTERNAL_NOSTR_CLIENT, n), n) : null;
}
function tt(e, t) {
	let n = J(t);
	return n ? (e.setItem(K.EXTERNAL_NOSTR_CLIENT_CUSTOM_URL, n), n) : null;
}
function nt(e) {
	return X(e, K.CLIENT_TAG_ENABLED, !0);
}
function rt(e) {
	return X(e, K.QUOTE_NOTIFICATION_ENABLED, !1);
}
function it(e) {
	return X(e, K.REPLY_NOTIFICATION_ENABLED, !1);
}
function at(e) {
	return X(e, K.FAIL_CLOSED_CONTENT_WARNING, !1);
}
function ot(e, t) {
	return Xe(e, K.IMAGE_QUALITY_LEVEL, K.LEGACY_IMAGE_COMPRESSION_LEVEL, "imageQualityLevel") ?? Z(t) ?? "medium";
}
function st(e) {
	let t = Xe(e, K.VIDEO_QUALITY_LEVEL, K.LEGACY_VIDEO_COMPRESSION_LEVEL, "videoQualityLevel");
	return e.getItem(K.VIDEO_QUALITY_LEVEL) === "skip" ? (e.setItem(K.VIDEO_QUALITY_LEVEL, "none"), "none") : t || (e.setItem(K.VIDEO_QUALITY_LEVEL, G), G);
}
function ct(e) {
	return X(e, K.MEDIA_FREE_PLACEMENT, !1);
}
function lt(e) {
	return X(e, K.SHOW_MASCOT, !0);
}
function ut(e) {
	return X(e, K.SHOW_FLAVOR_TEXT, !0);
}
function dt(e) {
	let t = e.getItem(K.DARK_MODE);
	return t === null ? null : t === "true";
}
function ft(e) {
	return e === "system" || e === "light" || e === "dark" ? e : null;
}
function $(e) {
	if (typeof e != "string") return null;
	let t = e.trim().replace(/^#/, "");
	return /^[0-9a-f]{6}$/i.test(t) ? `#${t.toLowerCase()}` : null;
}
function pt(e, t) {
	let n = e.getItem(t), r = $(n);
	return n !== null && !r && e.removeItem(t), r;
}
function mt(e) {
	return {
		accentColor: pt(e, K.ACCENT_COLOR),
		baseColor: pt(e, K.BASE_COLOR)
	};
}
function ht(e, t, n) {
	let r = $(n);
	return r ? (e.setItem(t, r), r) : null;
}
function gt(e) {
	e.removeItem(K.ACCENT_COLOR), e.removeItem(K.BASE_COLOR);
}
function _t(e) {
	let t = ft(e.getItem(K.THEME_MODE));
	if (t) return e.getItem(K.DARK_MODE) !== null && e.removeItem(K.DARK_MODE), t;
	if (e.getItem(K.THEME_MODE) !== null) return e.setItem(K.THEME_MODE, "system"), e.removeItem(K.DARK_MODE), "system";
	let n = dt(e);
	if (n !== null) {
		let t = n ? "dark" : "light";
		return e.setItem(K.THEME_MODE, t), e.removeItem(K.DARK_MODE), t;
	}
	return e.setItem(K.THEME_MODE, "system"), "system";
}
function vt(e, t, n = "user") {
	let r = Y(t);
	return e.setItem(K.LOCALE, r), Q(e, "locale", n), r;
}
function yt(e, t, n = "user") {
	let r = Z(t) ?? "medium";
	return e.setItem(K.IMAGE_QUALITY_LEVEL, r), Q(e, "imageQualityLevel", n), r;
}
function bt(e, t, n = "user") {
	let r = Z(t) ?? "medium";
	return e.setItem(K.VIDEO_QUALITY_LEVEL, r), Q(e, "videoQualityLevel", n), r;
}
function xt(e, t, n = "user") {
	return e.setItem(K.CLIENT_TAG_ENABLED, t ? "true" : "false"), Q(e, "clientTagEnabled", n), t;
}
function St(e, t, n = "user") {
	return e.setItem(K.QUOTE_NOTIFICATION_ENABLED, t ? "true" : "false"), Q(e, "quoteNotificationEnabled", n), t;
}
function Ct(e, t, n = "user") {
	return e.setItem(K.REPLY_NOTIFICATION_ENABLED, t ? "true" : "false"), Q(e, "replyNotificationEnabled", n), t;
}
function wt(e, t, n = "user") {
	return e.setItem(K.FAIL_CLOSED_CONTENT_WARNING, t ? "true" : "false"), Q(e, "failClosedContentWarning", n), t;
}
function Tt(e, t, n = "user") {
	return e.setItem(K.MEDIA_FREE_PLACEMENT, t ? "true" : "false"), Q(e, "mediaFreePlacement", n), t;
}
function Et(e, t, n = "user") {
	return e.setItem(K.SHOW_MASCOT, t ? "true" : "false"), Q(e, "showMascot", n), t;
}
function Dt(e, t, n = "user") {
	return e.setItem(K.SHOW_FLAVOR_TEXT, t ? "true" : "false"), Q(e, "showFlavorText", n), t;
}
function Ot(e, t, n = "user") {
	let r = ft(t) ?? "system";
	return e.setItem(K.THEME_MODE, r), e.removeItem(K.DARK_MODE), Q(e, "darkMode", n), r;
}
function kt(e) {
	return e.getItem(K.FIRST_VISIT) !== "1";
}
function At(e) {
	let t = kt(e);
	return t && e.setItem(K.FIRST_VISIT, "1"), t;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/transition/index.js
var jt = (e) => e;
function Mt(e, { delay: t = 0, duration: n = 400, easing: r = jt } = {}) {
	let i = +getComputedStyle(e).opacity;
	return {
		delay: t,
		duration: n,
		easing: r,
		css: (e) => `opacity: ${e * i}`
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/portal/portal-consumer.svelte
function Nt(e, t) {
	var n = u(), o = T(n);
	r(o, () => t.children, (e) => {
		var n = u(), r = T(n);
		a(r, () => t.children ?? i), c(e, n);
	}), c(e, n);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/config/bits-config.js
var Pt = new P("BitsConfig");
function Ft() {
	let e = new It(null, {});
	return Pt.getOr(e).opts;
}
var It = class {
	opts;
	constructor(e, t) {
		let n = Lt(e, t);
		this.opts = {
			defaultPortalTo: n((e) => e.defaultPortalTo),
			defaultLocale: n((e) => e.defaultLocale)
		};
	}
};
function Lt(e, t) {
	return (n) => L(() => {
		let r = n(t)?.current;
		if (r !== void 0) return r;
		if (e !== null) return n(e.opts)?.current;
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/config/prop-resolvers.js
function Rt(e, t) {
	return (n) => {
		let r = Ft();
		return L(() => {
			let i = n();
			if (i !== void 0) return i;
			let a = e(r).current;
			return a === void 0 ? t : a;
		});
	};
}
var zt = Rt((e) => e.defaultLocale, "en"), Bt = Rt((e) => e.defaultPortalTo, "body");
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/portal/portal.svelte
function Vt(e, t) {
	s(t, !0);
	let n = Bt(() => t.to), r = k(), d = f(p);
	function p() {
		if (!I || t.disabled) return null;
		let e = null;
		return e = typeof n.current == "string" ? document.querySelector(n.current) : n.current, e;
	}
	let m;
	function h() {
		m &&= (l(m), null);
	}
	F([() => w(d), () => t.disabled], ([e, n]) => {
		if (!e || n) h();
		else return m = A(Nt, {
			target: e,
			props: { children: t.children },
			context: r
		}), () => {
			h();
		};
	});
	var g = u(), _ = T(g), v = (e) => {
		var n = u(), r = T(n);
		a(r, () => t.children ?? i), c(e, n);
	};
	o(_, (e) => {
		t.disabled && e(v);
	}), c(e, g), O();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/FloatingMessage.svelte
var Ht = n("<span class=\"info-icon svg-icon svelte-1226wk1\" aria-hidden=\"true\"></span>"), Ut = n("<div aria-atomic=\"true\"><div class=\"floating-message-body svelte-1226wk1\"><!> <div class=\"floating-message-content svelte-1226wk1\"><!></div></div></div>"), Wt = {
	hash: "svelte-1226wk1",
	code: ".floating-message.svelte-1226wk1 {background:var(--dialog-bg, #fff);color:var(--text, #000);border:1px solid var(--border, #ccc);border-radius:8px;box-shadow:0 6px 20px rgba(0, 0, 0, 0.18);padding:10px 12px;max-width:320px;position:fixed;z-index:100001;display:inline-flex;align-items:flex-start;white-space:nowrap;pointer-events:none;}.floating-message.top-right.svelte-1226wk1 {top:16px;right:16px;max-width:min(360px, calc(100vw - 32px));max-height:calc(100dvh - 32px);box-sizing:border-box;overflow:clip;contain:paint;white-space:normal;}\n\n    /* The positioned parent owns these coordinates from the first render. */.floating-message.parent-top.svelte-1226wk1 {position:absolute;top:12px;left:50%;translate:-50% 0;max-width:min(360px, calc(100% - 24px));max-height:calc(100% - 24px);box-sizing:border-box;overflow:clip;contain:paint;white-space:normal;}.floating-message.top-right.svelte-1226wk1 .floating-message-body:where(.svelte-1226wk1),\n    .floating-message.top-right.svelte-1226wk1 .floating-message-content:where(.svelte-1226wk1),\n    .floating-message.parent-top.svelte-1226wk1 .floating-message-body:where(.svelte-1226wk1),\n    .floating-message.parent-top.svelte-1226wk1 .floating-message-content:where(.svelte-1226wk1) {min-width:0;overflow-wrap:anywhere;}.floating-message.container-top-right.svelte-1226wk1 {top:auto;right:auto;box-sizing:border-box;white-space:normal;}.floating-message.anchor-bottom-right.svelte-1226wk1,\n    .floating-message.anchor-center.svelte-1226wk1 {top:auto;right:auto;box-sizing:border-box;white-space:normal;}.floating-message-body.svelte-1226wk1 {display:inline-flex;align-items:center;gap:4px;width:100%;}.floating-message-content.svelte-1226wk1 {padding:0 2px;font-size:1rem;font-weight:bold;color:var(--text);text-align:center;}.info-icon.svelte-1226wk1 {mask-image:var(--ehagaki-icon-696e666f5f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);width:24px;height:24px;min-width:24px;}"
};
function Gt(e, n) {
	s(n, !0), te(e, Wt);
	let r = S(n, "show", 3, !1), l = S(n, "x", 3, 0), p = S(n, "y", 3, 0), g = S(n, "variant", 3, "pointer"), v = S(n, "anchor", 3, null), re = S(n, "anchorRightOffset", 3, 0), k = S(n, "showInfoIcon", 3, !0), A = S(n, "fadeOutDuration", 3, 0), j = S(n, "role", 3, "status"), M = S(n, "children", 3, void 0), N = d(void 0), P = d(0), F = d(0), I = d(320), L = d(!1), { overlayTarget: R, layoutTarget: z } = ie();
	C(() => {
		g() === "pointer" && (_(P, l()), _(F, p()));
	}), C(() => {
		r() && w(N) && g() === "pointer" && (async () => {
			if (await x(), !w(N)) return;
			let e = w(N).getBoundingClientRect(), t = window.innerWidth, n = window.innerHeight, r = l(), i = p();
			r + e.width + 10 > t && (r = t - e.width - 10), r - 10 < 0 && (r = 10), i + e.height + 10 > n && (i = n - e.height - 10), i - 10 < 0 && (i = 10), _(P, r, !0), _(F, i, !0);
		})();
	}), C(() => {
		r() && w(N) && g() === "container-top-right" && (async () => {
			if (await x(), !w(N)) return;
			let e = z.getBoundingClientRect();
			if (_(I, Math.min(320, Math.max(0, e.width - 20)), !0), await x(), !w(N)) return;
			let t = w(N).getBoundingClientRect();
			_(P, Math.max(e.left + 10, e.right - t.width - 10), !0), _(F, e.top + 10);
		})();
	}), C(() => {
		if (g() !== "anchor-bottom-right" && g() !== "anchor-center" || !r()) return;
		if (!w(N) || !v()) {
			_(L, !1);
			return;
		}
		let e = !1;
		_(L, !1);
		let t = async () => {
			if (await x(), e || !w(N) || !v()) return;
			let t = v().getBoundingClientRect(), n = window.innerWidth, r = window.innerHeight, i = Math.max(0, n - 20), a = Math.min(320, i);
			if (w(I) !== a && (_(I, a, !0), await x(), e || !w(N))) return;
			let o = w(N).getBoundingClientRect(), s = g() === "anchor-center" ? t.left + (t.width - o.width) / 2 : t.right - o.width - re(), c = g() === "anchor-center" ? t.top + (t.height - o.height) / 2 : t.bottom + 8;
			_(P, Math.max(10, Math.min(s, n - o.width - 10)), !0), _(F, Math.max(10, Math.min(c, r - o.height - 10)), !0), _(L, !0);
		}, n = () => void t();
		window.addEventListener("resize", n), window.addEventListener("scroll", n, !0);
		let i = typeof ResizeObserver > "u" ? null : new ResizeObserver(n);
		return i?.observe(v()), i?.observe(w(N)), n(), () => {
			e = !0, window.removeEventListener("resize", n), window.removeEventListener("scroll", n, !0), i?.disconnect();
		};
	});
	var B = u(), V = T(B), H = (e) => {
		{
			let n = f(() => g() === "parent-top");
			Vt(e, {
				get to() {
					return R;
				},
				get disabled() {
					return w(n);
				},
				children: (e, n) => {
					var s = u(), l = T(s), d = (e) => {
						var n = Ut(), r = b(n), s = b(r), l = (e) => {
							var t = Ht();
							c(e, t);
						};
						o(s, (e) => {
							k() && e(l);
						});
						var u = h(s, 2), d = b(u);
						a(d, () => M() ?? i), y(u), y(r), y(n), m(n, (e) => _(N, e), () => w(N)), ne(() => {
							D(n, 1, `floating-message ${g() ?? ""}`, "svelte-1226wk1"), t(n, g() === "container-top-right" ? `left: ${w(P)}px; top: ${w(F)}px; width: ${w(I)}px;` : g() === "anchor-bottom-right" || g() === "anchor-center" ? `left: ${w(P)}px; top: ${w(F)}px; max-width: ${w(I)}px; visibility: ${w(L) ? "visible" : "hidden"};` : g() === "pointer" ? `left: ${w(P)}px; top: ${w(F)}px;` : void 0), E(n, "role", j()), E(n, "aria-live", j() === "alert" ? "assertive" : "polite");
						}), ee(2, n, () => Mt, () => ({ duration: A() })), c(e, n);
					};
					o(l, (e) => {
						r() && e(d);
					}), c(e, s);
				},
				$$slots: { default: !0 }
			});
		}
	};
	o(V, (e) => {
		(r() || A() > 0) && e(H);
	}), c(e, B), O();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/Button.svelte
var Kt = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"className",
	"class",
	"disabled",
	"type",
	"ariaLabel",
	"style",
	"variant",
	"shape",
	"contentLayout",
	"children",
	"onClick",
	"selected",
	"floatingMessage",
	"floatingMessageDuration",
	"floatingMessageVariant"
]), qt = n("<div class=\"svelte-1kbd9s6\"> </div>"), Jt = n("<button><!></button> <!>", 1), Yt = {
	hash: "svelte-1kbd9s6",
	code: "button.svelte-1kbd9s6 {background-color:var(--btn-bg);}\n    /* --- Variant Styles --- */.ehagaki-app-root :where(.default, .primary, .secondary) {padding:8px 12px;}.ehagaki-app-root :where(.default) {:where(.svg-icon) {width:24px;height:24px;}.btn-text {font-size:1rem;font-weight:500;}}.ehagaki-app-root :where(.primary) {--btn-bg: var(--theme);--text: white;font-weight:500;gap:8px;border:none;.svg-icon {--svg: white;width:28px;height:28px;}.btn-text {color:white;font-size:1rem;font-weight:500;}\n                .loading-placeholder.post-button-loading\n                    .loader-container\n                    .square\n             {background-color:white;}\n\n        @media (hover: hover) and (pointer: fine) {&:hover:not(:disabled) {color:light-dark(\n                    color-mix(in srgb, white, black 6%),\n                    color-mix(in srgb, white, black 10%)\n                );background-color:light-dark(\n                    color-mix(in srgb, var(--btn-bg), black 4%),\n                    color-mix(in srgb, var(--btn-bg), black 7%)\n                );.btn-text {color:currentColor;}}\n        }}:root.light .ehagaki-app-root button.primary.svelte-1kbd9s6:hover:not(:disabled) .svg-icon,\n    :root.dark .ehagaki-app-root button.primary.svelte-1kbd9s6:hover:not(:disabled) .svg-icon,\n    :host(.light) .ehagaki-app-root button.primary.svelte-1kbd9s6:hover:not(:disabled) .svg-icon,\n    :host(.dark) .ehagaki-app-root button.primary.svelte-1kbd9s6:hover:not(:disabled) .svg-icon {background-color:currentColor;}.ehagaki-app-root :where(.secondary) {border:1px solid var(--btn-border);--btn-bg: white;--text: var(--text-black);--border: var(--light-gray);\n\n        @media (hover: hover) and (pointer: fine) {&:hover:not(:disabled) {background:light-dark(\n                    color-mix(in srgb, var(--btn-bg), black 3%),\n                    color-mix(in srgb, var(--btn-bg), black 8%)\n                );color:light-dark(\n                    color-mix(in srgb, var(--text), black 6%),\n                    black\n                );}\n        }}.header.svelte-1kbd9s6 {border:1px solid var(--accent-color-custom, var(--hagaki));\n        @media (hover: hover) and (pointer: fine) {:root.light &,\n            :host(.light) & {&:hover:not(:disabled) {border-color:color-mix(\n                        in srgb,\n                        var(--accent-color-custom, var(--hagaki)),\n                        black 3%\n                    );}}\n        }:root.light &,\n        :host(.light) & {--btn-bg: var(--base-color-surface-button, var(--surface-editor));}}.danger.svelte-1kbd9s6 {--btn-bg: var(--danger);--text: white;border:none;\n\n        @media (hover: hover) and (pointer: fine) {&:hover:not(:disabled) {background-color:light-dark(\n                    color-mix(in srgb, var(--btn-bg), black 8%),\n                    color-mix(in srgb, var(--btn-bg), black 12%)\n                );color:light-dark(\n                    color-mix(in srgb, white, black 8%),\n                    color-mix(in srgb, white, black 12%)\n                );}\n        }}.warning.svelte-1kbd9s6 {--btn-bg: hsl(58, 99%, 74%);--text: var(--text-black);border:none;\n\n        @media (hover: hover) and (pointer: fine) {&:hover:not(:disabled) {background:light-dark(\n                    color-mix(in srgb, var(--btn-bg), black 8%),\n                    color-mix(in srgb, var(--btn-bg), black 12%)\n                );}\n        }}.footer.svelte-1kbd9s6 {max-width:100px;flex:1 1 0;--btn-bg: transparent;}button.svelte-1kbd9s6:is(.close:where(.svelte-1kbd9s6), .copy:where(.svelte-1kbd9s6)) {--btn-bg: rgb(0 0 0 / var(--overlay-opacity));--svg: whitesmoke;width:50px;height:50px;padding:0;border:none;opacity:0.8;backdrop-filter:blur(4px);transition:background 0.2s ease;background:var(--btn-bg);.svg-icon {width:var(--icon-size);height:var(--icon-size);mask-image:var(--icon-mask);}\n\n        @media (hover: hover) and (pointer: fine) {&:hover:not(:disabled) {--btn-bg: rgb(25 25 25 / var(--hover-overlay-opacity));background:var(--btn-bg);}\n        }}button.close.svelte-1kbd9s6 {--overlay-opacity: 0.5;--hover-overlay-opacity: 0.5;--icon-size: 32px;--icon-mask: var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}button.copy.svelte-1kbd9s6 {--overlay-opacity: 0.45;--hover-overlay-opacity: 0.45;--icon-size: 20px;--icon-mask: var(--ehagaki-icon-66696c655f636f70795f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}\n\n    /* --- Shape Styles --- */.square.svelte-1kbd9s6,\n    .circle.svelte-1kbd9s6 {padding:0;}.square.svelte-1kbd9s6 {border-radius:0;:where(.svg-icon) {width:30px;height:30px;}}.rounded.svelte-1kbd9s6 {border-radius:6px;}.pill.svelte-1kbd9s6 {border-radius:50px;}.circle.svelte-1kbd9s6 {border-radius:50%;display:flex;align-items:center;justify-content:center;aspect-ratio:1;.svg-icon {width:28px;height:28px;}}\n\n    /* --- Content Layout Styles --- */.ehagaki-app-root :where(.content-iconText) {gap:8px;padding:12px 18px 12px 14px;}.content-icon.svelte-1kbd9s6 {padding:0;:where(.svg-icon) {width:30px;height:30px;}}"
};
function Xt(t, n) {
	s(n, !0), te(t, Yt);
	let r = S(n, "className", 3, ""), o = S(n, "class", 3, ""), l = S(n, "disabled", 3, !1), u = S(n, "type", 3, "button"), m = S(n, "ariaLabel", 3, void 0), ee = S(n, "style", 3, ""), x = S(n, "variant", 3, void 0), C = S(n, "shape", 3, void 0), E = S(n, "contentLayout", 3, void 0), D = S(n, "onClick", 3, void 0), k = S(n, "selected", 3, !1), A = S(n, "floatingMessage", 3, ""), ie = S(n, "floatingMessageDuration", 3, 1800), j = S(n, "floatingMessageVariant", 3, "pointer"), M = v(n, Kt), N = d(!1), P = d(0), F = d(0), I, L = f(() => x() ?? ""), R = f(() => E() ? `content-${E()}` : ""), z = f(() => `${o()} ${r()}`.trim()), B = f(() => C() ?? "");
	function V() {
		I !== void 0 && (clearTimeout(I), I = void 0);
	}
	function H(e) {
		if (e.detail !== 0) return {
			x: e.clientX,
			y: e.clientY
		};
		let t = e.currentTarget.getBoundingClientRect();
		return {
			x: t.left + t.width / 2,
			y: t.bottom + 8
		};
	}
	function ae(e) {
		A() && (V(), _(P, e.x, !0), _(F, e.y, !0), _(N, !0), I = setTimeout(() => {
			_(N, !1), I = void 0;
		}, ie()));
	}
	async function oe(e) {
		let t = A() ? H(e) : null;
		(D() ? await D()(e) : void 0) !== !1 && t && ae(t);
	}
	re(V);
	var U = Jt(), W = T(U);
	g(W, () => ({
		type: u(),
		class: `${w(z)} ${w(L)} ${w(B)} ${w(R)} ${k() ? "selected" : ""}`,
		disabled: l(),
		"aria-label": m() || void 0,
		style: ee(),
		onclick: oe,
		...M
	}), void 0, void 0, void 0, "svelte-1kbd9s6");
	var G = b(W);
	a(G, () => n.children ?? i), y(W), Gt(h(W, 2), {
		get show() {
			return w(N);
		},
		get x() {
			return w(P);
		},
		get y() {
			return w(F);
		},
		get variant() {
			return j();
		},
		children: (t, n) => {
			var r = qt(), i = p(r, !0);
			ne(() => e(i, A())), c(t, r);
		},
		$$slots: { default: !0 }
	}), c(t, U), O();
}
navigator.language;
var Zt = { setTimeout: (e, t) => setTimeout(e, t) };
function Qt() {
	try {
		return crypto.randomUUID();
	} catch {
		return $t();
	}
}
function $t() {
	return Date.now().toString(36) + Math.random().toString(36).substring(2, 11);
}
function en(e, t) {
	return t(!0), e();
}
function tn(e) {
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
function nn(e, t, n, r, i) {
	let a = window.innerWidth || document.documentElement.clientWidth || 0, o = window.innerHeight || document.documentElement.clientHeight || 0, s = typeof n == "number" ? n : 0, c = r ? a - r - s : a - s, l = i ? o - i - s : o - s;
	return {
		x: Math.max(s, Math.min(c, e)),
		y: Math.max(s, Math.min(l, t))
	};
}
function rn(e, t) {
	let n = [];
	for (let r = 0; r < e.length; r += t) n.push(e.slice(r, r + t));
	return n;
}
export { De as $, Ye as A, St as B, ut as C, le as Ct, mt as D, _t as E, wt as F, Ot as G, Dt as H, yt as I, Be as J, bt as K, Ue as L, xt as M, tt as N, st as O, et as P, Ce as Q, vt as R, it as S, ue as St, Ze as T, R as Tt, Et as U, Ct as V, ht as W, J as X, Ve as Y, q as Z, at as _, B as _t, $t as a, W as at, ct as b, ye as bt, Xt as c, me as ct, zt as d, _e as dt, we as et, gt as f, H as ft, $e as g, ae as gt, Qe as h, V as ht, Qt as i, oe as it, Y as j, $ as k, Gt as l, fe as lt, nt as m, z as mt, rn as n, Oe as nt, tn as o, pe as ot, At as p, de as pt, Ne as q, Zt as r, U as rt, en as s, ge as st, nn as t, je as tt, Vt as u, he as ut, ot as v, Se as vt, lt as w, ce as wt, rt as x, ve as xt, He as y, K as yt, Tt as z };
