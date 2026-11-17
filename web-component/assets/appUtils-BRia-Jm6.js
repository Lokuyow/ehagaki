import { A as e, B as t, Et as n, G as r, H as i, K as a, M as o, Mt as s, Nt as c, P as l, R as u, St as d, T as f, Tt as p, V as m, W as h, _ as g, ct as _, dt as v, f as y, ft as b, gt as x, i as ee, nt as S, pt as te, r as C, rt as w, st as ne, t as T, ut as E, vt as D, w as O, xt as k, y as A, z as j } from "./index-client-XkLzkVYC.js";
import { l as M, n as N, o as P, v as re } from "./relayConfigUtils-B4Q_AO1M.js";
import { Q as F, X as I, l as L, st as R } from "./LoadingPlaceholder-lit91akO.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/localRelayUrl.ts
function z(e) {
	let t = e.trim();
	if (!/^wss?:\/\//i.test(t)) return null;
	try {
		let e = new URL(t);
		return e.hash || e.username || e.password ? null : N.normalizeExternalRelayUrl(t);
	} catch {
		return null;
	}
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/constants.ts
var B = "https://nostr.build/api/v2/upload/files", V = 1073741824, H = {
	maxPixels: 8e6,
	maxLongEdge: 8192
}, U = {
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
}, ie = /(?:^|[\s\n\u3000])#([^\s\n\u3000#]+)/g, W = ["http:", "https:"], ae = [
	".png",
	".jpg",
	".jpeg",
	".gif",
	".webp",
	".svg"
], oe = [
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
}, q = [
	"none",
	"low",
	"medium",
	"high"
], se = [
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
function ce(e) {
	return e === "ja" ? "https://share.yabu.me/api/v2/media" : "https://nostrcheck.me/api/v2/media";
}
function le(e) {
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
var ue = {
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
}, de = [
	"balloonMessage.success.post_success",
	"balloonMessage.success.sent",
	"balloonMessage.success.to_everyone"
], fe = "balloonMessage.error.post_error", pe = "balloonMessage.error.post_rejected", me = "balloonMessage.error.post_timeout", he = "balloonMessage.error.post_network_error", ge = "balloonMessage.error.sign_extension_unavailable", _e = ["balloonMessage.tips.long_press_to_post"], ve = {
	MAX_WAIT_TIME: 15e3,
	RETRY_INTERVAL: 1e3,
	TIMEOUT_MESSAGE: "Upload processing timeout"
}, ye = {
	MAX_WAIT_TIME: 15e3,
	RETRY_INTERVAL: 1e3,
	TIMEOUT_MESSAGE: "Uploaded media is not available yet"
}, be = "auth_superseded", xe = /nsec1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{10,}/, Se = /^nsec1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{58}$/, Ce = {
	REQUEST_TIMEOUT: 3e3,
	SW_CONTROLLER_WAIT_TIMEOUT: 100
};
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/textDisplayUtils.ts
function J(e, t, n) {
	let r = t + n + 3;
	return e.length <= r ? e : `${e.slice(0, t)}...${e.slice(-n)}`;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/nostrUtils.ts
function we(e) {
	return xe.test(e);
}
function Te(e) {
	return Se.test(e);
}
function Ee(e) {
	return P(e);
}
function De(e) {
	return {
		npub: M.npubEncode(e),
		nprofile: M.nprofileEncode({
			pubkey: e,
			relays: []
		})
	};
}
function Oe(e) {
	try {
		let { type: t, data: n } = M.decode(e);
		if (t !== "nsec") return console.warn("無効なnsec形式です"), {
			hex: "",
			npub: "",
			nprofile: ""
		};
		let r = Ee(n), { npub: i, nprofile: a } = De(r);
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
function ke(e) {
	try {
		return M.npubEncode(e);
	} catch {
		return `npub1${e.slice(0, 10)}...`;
	}
}
function Ae(e, t, n) {
	for (let r of t) if (r && !e.includes(r) && (e.push(r), e.length >= n)) return;
}
function je(e, t = 3) {
	let n = [];
	for (let r of e) if (Ae(n, r, t), n.length >= t) break;
	return n;
}
function Me(e, t = [], n = []) {
	try {
		let r = je([t.slice(0, 1), n], 3);
		return M.nprofileEncode({
			pubkey: e,
			relays: r
		});
	} catch {
		return "";
	}
}
function Ne(e) {
	try {
		let t = je([
			e.acceptedRelays ?? [],
			e.relayHints ?? [],
			e.writeRelays ?? []
		], 3);
		return M.neventEncode({
			id: e.eventId,
			author: e.authorPubkey,
			kind: e.kind,
			relays: t
		});
	} catch {
		return "";
	}
}
function Pe(e) {
	try {
		return J(M.npubEncode(e), 12, 4);
	} catch {
		return J(e, 10, 4);
	}
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryNevent.ts
function Fe(e, t = []) {
	return Ne({
		eventId: e.eventId,
		authorPubkey: e.pubkeyHex,
		kind: e.kind,
		acceptedRelays: e.acceptedRelays,
		relayHints: e.relayHints,
		writeRelays: t
	});
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryExternalClient.ts
var Ie = [
	"nostter",
	"jumble",
	"lumilumi",
	"primal",
	"njump",
	"custom"
], Le = {
	nostter: "https://nostter.app/{nevent}",
	jumble: "https://jumble.social/{nevent}",
	primal: "https://primal.net/e/{nevent}",
	njump: "https://njump.me/{nevent}",
	lumilumi: "https://lumilumi.app/{nevent}"
}, Re = {
	nostter: "nostter",
	jumble: "Jumble",
	primal: "Primal",
	njump: "njump",
	lumilumi: "Lumilumi",
	custom: ""
};
function ze(e) {
	return typeof e == "string" && Ie.includes(e);
}
function Be(e) {
	return ze(e) ? e : null;
}
function Y(e) {
	let t = e?.trim() ?? "";
	if (!t || t.split("{nevent}").length !== 2) return null;
	try {
		let e = new URL(t);
		return e.protocol === "https:" && e.hostname ? t : null;
	} catch {
		return null;
	}
}
function Ve(e) {
	return e.client === "custom" ? Y(e.customUrlTemplate) : Le[e.client];
}
function He(e, t) {
	if (!t) return null;
	let n = Ve(e);
	if (!n) return null;
	let r = n.replace("{nevent}", t);
	try {
		return new URL(r).protocol === "https:" ? r : null;
	} catch {
		return null;
	}
}
function Ue(e, t, n = []) {
	return He(t, Fe(e, n));
}
function We(e) {
	if (e.client !== "custom") return Re[e.client];
	let t = Ve(e);
	if (!t) return null;
	try {
		return new URL(t).hostname || null;
	} catch {
		return null;
	}
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/settingsStorage.ts
function Ge(e) {
	try {
		let t = e.getItem(K.LOCAL_RELAY_URL);
		return t ? z(t) : null;
	} catch {
		return null;
	}
}
function Ke(e, t) {
	if (!t.trim()) return e.removeItem(K.LOCAL_RELAY_URL), null;
	let n = z(t);
	if (!n) throw Error("invalid_local_relay_url");
	return e.setItem(K.LOCAL_RELAY_URL, n), n;
}
function qe(e) {
	return typeof e == "string" && e.toLowerCase().startsWith("ja");
}
function X(e) {
	return qe(e) ? "ja" : "en";
}
function Je(e) {
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
function Ye(e, t) {
	e.setItem(K.SETTINGS_PREFERENCE_METADATA, JSON.stringify({
		embedBootstrapApplied: t.embedBootstrapApplied === !0,
		sources: t.sources ?? {}
	}));
}
function Xe(e, t) {
	return e == null ? t : e !== "false";
}
function Z(e, t, n) {
	let r = e.getItem(t);
	return r === null ? (e.setItem(t, n ? "true" : "false"), n) : Xe(r, n);
}
function Ze(e) {
	if (!e) return null;
	let t = e === "skip" ? "none" : e;
	return q.includes(t) ? t : null;
}
function Q(e) {
	return Ze(e);
}
function Qe(e) {
	let t = Ze(e);
	return t === "low" ? "high" : t === "high" ? "low" : t;
}
function $e(e, t, n, r) {
	let i = Q(e.getItem(t));
	if (i) return i;
	let a = Qe(e.getItem(n));
	if (!a) return null;
	e.setItem(t, a), e.removeItem && e.removeItem(n);
	let o = Je(e), s = r === "imageQualityLevel" ? "imageCompressionLevel" : "videoCompressionLevel", c = o.sources?.[s];
	return c && !o.sources?.[r] && $(e, r, c), a;
}
function $(e, t, n) {
	let r = Je(e);
	Ye(e, {
		...r,
		sources: {
			...r.sources ?? {},
			[t]: n
		}
	});
}
function et(e) {
	let t = e.getItem(K.LOCALE);
	return t === "ja" || t === "en" ? t : null;
}
function tt(e, t) {
	return et(e) ?? X(t.language);
}
function nt(e, t) {
	let n = Be(e.getItem(K.EXTERNAL_NOSTR_CLIENT));
	if (n) return {
		client: n,
		customUrlTemplate: n === "custom" ? e.getItem(K.EXTERNAL_NOSTR_CLIENT_CUSTOM_URL) ?? "" : ""
	};
	let r = X(t) === "ja" ? "nostter" : "jumble";
	return e.setItem(K.EXTERNAL_NOSTR_CLIENT, r), {
		client: r,
		customUrlTemplate: ""
	};
}
function rt(e, t) {
	let n = Be(t);
	return n ? (e.setItem(K.EXTERNAL_NOSTR_CLIENT, n), n) : null;
}
function it(e, t) {
	let n = Y(t);
	return n ? (e.setItem(K.EXTERNAL_NOSTR_CLIENT_CUSTOM_URL, n), n) : null;
}
function at(e) {
	return Z(e, K.CLIENT_TAG_ENABLED, !0);
}
function ot(e) {
	return Z(e, K.QUOTE_NOTIFICATION_ENABLED, !1);
}
function st(e) {
	return Z(e, K.REPLY_NOTIFICATION_ENABLED, !1);
}
function ct(e) {
	return Z(e, K.FAIL_CLOSED_CONTENT_WARNING, !1);
}
function lt(e, t) {
	return $e(e, K.IMAGE_QUALITY_LEVEL, K.LEGACY_IMAGE_COMPRESSION_LEVEL, "imageQualityLevel") ?? Q(t) ?? "medium";
}
function ut(e) {
	let t = $e(e, K.VIDEO_QUALITY_LEVEL, K.LEGACY_VIDEO_COMPRESSION_LEVEL, "videoQualityLevel");
	return e.getItem(K.VIDEO_QUALITY_LEVEL) === "skip" ? (e.setItem(K.VIDEO_QUALITY_LEVEL, "none"), "none") : t || (e.setItem(K.VIDEO_QUALITY_LEVEL, G), G);
}
function dt(e) {
	return Z(e, K.MEDIA_FREE_PLACEMENT, !1);
}
function ft(e) {
	return Z(e, K.SHOW_MASCOT, !0);
}
function pt(e) {
	return Z(e, K.SHOW_FLAVOR_TEXT, !0);
}
function mt(e) {
	let t = e.getItem(K.DARK_MODE);
	return t === null ? null : t === "true";
}
function ht(e) {
	return e === "system" || e === "light" || e === "dark" ? e : null;
}
function gt(e) {
	if (typeof e != "string") return null;
	let t = e.trim().replace(/^#/, "");
	return /^[0-9a-f]{6}$/i.test(t) ? `#${t.toLowerCase()}` : null;
}
function _t(e, t) {
	let n = e.getItem(t), r = gt(n);
	return n !== null && !r && e.removeItem(t), r;
}
function vt(e) {
	return {
		accentColor: _t(e, K.ACCENT_COLOR),
		baseColor: _t(e, K.BASE_COLOR)
	};
}
function yt(e, t, n) {
	let r = gt(n);
	return r ? (e.setItem(t, r), r) : null;
}
function bt(e) {
	e.removeItem(K.ACCENT_COLOR), e.removeItem(K.BASE_COLOR);
}
function xt(e) {
	let t = ht(e.getItem(K.THEME_MODE));
	if (t) return e.getItem(K.DARK_MODE) !== null && e.removeItem(K.DARK_MODE), t;
	if (e.getItem(K.THEME_MODE) !== null) return e.setItem(K.THEME_MODE, "system"), e.removeItem(K.DARK_MODE), "system";
	let n = mt(e);
	if (n !== null) {
		let t = n ? "dark" : "light";
		return e.setItem(K.THEME_MODE, t), e.removeItem(K.DARK_MODE), t;
	}
	return e.setItem(K.THEME_MODE, "system"), "system";
}
function St(e, t, n = "user") {
	let r = X(t);
	return e.setItem(K.LOCALE, r), $(e, "locale", n), r;
}
function Ct(e, t, n = "user") {
	let r = Q(t) ?? "medium";
	return e.setItem(K.IMAGE_QUALITY_LEVEL, r), $(e, "imageQualityLevel", n), r;
}
function wt(e, t, n = "user") {
	let r = Q(t) ?? "medium";
	return e.setItem(K.VIDEO_QUALITY_LEVEL, r), $(e, "videoQualityLevel", n), r;
}
function Tt(e, t, n = "user") {
	return e.setItem(K.CLIENT_TAG_ENABLED, t ? "true" : "false"), $(e, "clientTagEnabled", n), t;
}
function Et(e, t, n = "user") {
	return e.setItem(K.QUOTE_NOTIFICATION_ENABLED, t ? "true" : "false"), $(e, "quoteNotificationEnabled", n), t;
}
function Dt(e, t, n = "user") {
	return e.setItem(K.REPLY_NOTIFICATION_ENABLED, t ? "true" : "false"), $(e, "replyNotificationEnabled", n), t;
}
function Ot(e, t, n = "user") {
	return e.setItem(K.FAIL_CLOSED_CONTENT_WARNING, t ? "true" : "false"), $(e, "failClosedContentWarning", n), t;
}
function kt(e, t, n = "user") {
	return e.setItem(K.MEDIA_FREE_PLACEMENT, t ? "true" : "false"), $(e, "mediaFreePlacement", n), t;
}
function At(e, t, n = "user") {
	return e.setItem(K.SHOW_MASCOT, t ? "true" : "false"), $(e, "showMascot", n), t;
}
function jt(e, t, n = "user") {
	return e.setItem(K.SHOW_FLAVOR_TEXT, t ? "true" : "false"), $(e, "showFlavorText", n), t;
}
function Mt(e, t, n = "user") {
	let r = ht(t) ?? "system";
	return e.setItem(K.THEME_MODE, r), e.removeItem(K.DARK_MODE), $(e, "darkMode", n), r;
}
function Nt(e) {
	return e.getItem(K.FIRST_VISIT) !== "1";
}
function Pt(e) {
	let t = Nt(e);
	return t && e.setItem(K.FIRST_VISIT, "1"), t;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/transition/index.js
var Ft = (e) => e;
function It(e, { delay: t = 0, duration: n = 400, easing: r = Ft } = {}) {
	let i = +getComputedStyle(e).opacity;
	return {
		delay: t,
		duration: n,
		easing: r,
		css: (e) => `opacity: ${e * i}`
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/portal/portal-consumer.svelte
function Lt(e, t) {
	var n = r(), i = v(n);
	u(i, () => t.children, (e) => {
		var n = r(), i = v(n);
		l(i, () => t.children ?? c), h(e, n);
	}), h(e, n);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/config/bits-config.js
var Rt = new F("BitsConfig");
function zt() {
	let e = new Bt(null, {});
	return Rt.getOr(e).opts;
}
var Bt = class {
	opts;
	constructor(e, t) {
		let n = Vt(e, t);
		this.opts = {
			defaultPortalTo: n((e) => e.defaultPortalTo),
			defaultLocale: n((e) => e.defaultLocale)
		};
	}
};
function Vt(e, t) {
	return (n) => R(() => {
		let r = n(t)?.current;
		if (r !== void 0) return r;
		if (e !== null) return n(e.opts)?.current;
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/config/prop-resolvers.js
function Ht(e, t) {
	return (n) => {
		let r = zt();
		return R(() => {
			let i = n();
			if (i !== void 0) return i;
			let a = e(r).current;
			return a === void 0 ? t : a;
		});
	};
}
var Ut = Ht((e) => e.defaultLocale, "en"), Wt = Ht((e) => e.defaultPortalTo, "body");
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/portal/portal.svelte
function Gt(e, a) {
	n(a, !0);
	let o = Wt(() => a.to), s = d(), u = k(f);
	function f() {
		if (!L || a.disabled) return null;
		let e = null;
		return e = typeof o.current == "string" ? document.querySelector(o.current) : o.current, e;
	}
	let m;
	function g() {
		m &&= (i(m), null);
	}
	I([() => S(u), () => a.disabled], ([e, n]) => {
		if (!e || n) g();
		else return m = t(Lt, {
			target: e,
			props: { children: a.children },
			context: s
		}), () => {
			g();
		};
	});
	var _ = r(), y = v(_), b = (e) => {
		var t = r(), n = v(t);
		l(n, () => a.children ?? c), h(e, t);
	};
	j(y, (e) => {
		a.disabled && e(b);
	}), h(e, _), p();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/FloatingMessage.svelte
var Kt = a("<span class=\"info-icon svg-icon svelte-1226wk1\" aria-hidden=\"true\"></span>"), qt = a("<div aria-atomic=\"true\"><div class=\"floating-message-body svelte-1226wk1\"><!> <div class=\"floating-message-content svelte-1226wk1\"><!></div></div></div>"), Jt = {
	hash: "svelte-1226wk1",
	code: ".floating-message.svelte-1226wk1 {background:var(--dialog-bg, #fff);color:var(--text, #000);border:1px solid var(--border, #ccc);border-radius:8px;box-shadow:0 6px 20px rgba(0, 0, 0, 0.18);padding:10px 12px;max-width:320px;position:fixed;z-index:100001;display:inline-flex;align-items:flex-start;white-space:nowrap;pointer-events:none;}.floating-message.top-right.svelte-1226wk1 {top:16px;right:16px;max-width:min(360px, calc(100vw - 32px));max-height:calc(100dvh - 32px);box-sizing:border-box;overflow:clip;contain:paint;white-space:normal;}\n\n    /* The positioned parent owns these coordinates from the first render. */.floating-message.parent-top.svelte-1226wk1 {position:absolute;top:12px;left:50%;translate:-50% 0;max-width:min(360px, calc(100% - 24px));max-height:calc(100% - 24px);box-sizing:border-box;overflow:clip;contain:paint;white-space:normal;}.floating-message.top-right.svelte-1226wk1 .floating-message-body:where(.svelte-1226wk1),\n    .floating-message.top-right.svelte-1226wk1 .floating-message-content:where(.svelte-1226wk1),\n    .floating-message.parent-top.svelte-1226wk1 .floating-message-body:where(.svelte-1226wk1),\n    .floating-message.parent-top.svelte-1226wk1 .floating-message-content:where(.svelte-1226wk1) {min-width:0;overflow-wrap:anywhere;}.floating-message.container-top-right.svelte-1226wk1 {top:auto;right:auto;box-sizing:border-box;white-space:normal;}.floating-message.anchor-bottom-right.svelte-1226wk1,\n    .floating-message.anchor-center.svelte-1226wk1 {top:auto;right:auto;box-sizing:border-box;white-space:normal;}.floating-message-body.svelte-1226wk1 {display:inline-flex;align-items:center;gap:4px;width:100%;}.floating-message-content.svelte-1226wk1 {padding:0 2px;font-size:1rem;font-weight:bold;color:var(--text);text-align:center;}.info-icon.svelte-1226wk1 {mask-image:var(--ehagaki-icon-696e666f5f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);width:24px;height:24px;min-width:24px;}"
};
function Yt(t, i) {
	n(i, !0), e(t, Jt);
	let a = C(i, "show", 3, !1), u = C(i, "x", 3, 0), d = C(i, "y", 3, 0), m = C(i, "variant", 3, "pointer"), g = C(i, "anchor", 3, null), b = C(i, "anchorRightOffset", 3, 0), ee = C(i, "showInfoIcon", 3, !0), T = C(i, "fadeOutDuration", 3, 0), M = C(i, "role", 3, "status"), N = C(i, "children", 3, void 0), P = D(void 0), F = D(0), I = D(0), L = D(320), R = D(!1), { overlayTarget: z, layoutTarget: B } = re();
	_(() => {
		m() === "pointer" && (x(F, u()), x(I, d()));
	}), _(() => {
		a() && S(P) && m() === "pointer" && (async () => {
			if (await w(), !S(P)) return;
			let e = S(P).getBoundingClientRect(), t = window.innerWidth, n = window.innerHeight, r = u(), i = d();
			r + e.width + 10 > t && (r = t - e.width - 10), r - 10 < 0 && (r = 10), i + e.height + 10 > n && (i = n - e.height - 10), i - 10 < 0 && (i = 10), x(F, r, !0), x(I, i, !0);
		})();
	}), _(() => {
		a() && S(P) && m() === "container-top-right" && (async () => {
			if (await w(), !S(P)) return;
			let e = B.getBoundingClientRect();
			if (x(L, Math.min(320, Math.max(0, e.width - 20)), !0), await w(), !S(P)) return;
			let t = S(P).getBoundingClientRect();
			x(F, Math.max(e.left + 10, e.right - t.width - 10), !0), x(I, e.top + 10);
		})();
	}), _(() => {
		if (m() !== "anchor-bottom-right" && m() !== "anchor-center" || !a()) return;
		if (!S(P) || !g()) {
			x(R, !1);
			return;
		}
		let e = !1;
		x(R, !1);
		let t = async () => {
			if (await w(), e || !S(P) || !g()) return;
			let t = g().getBoundingClientRect(), n = window.innerWidth, r = window.innerHeight, i = Math.max(0, n - 20), a = Math.min(320, i);
			if (S(L) !== a && (x(L, a, !0), await w(), e || !S(P))) return;
			let o = S(P).getBoundingClientRect(), s = m() === "anchor-center" ? t.left + (t.width - o.width) / 2 : t.right - o.width - b(), c = m() === "anchor-center" ? t.top + (t.height - o.height) / 2 : t.bottom + 8;
			x(F, Math.max(10, Math.min(s, n - o.width - 10)), !0), x(I, Math.max(10, Math.min(c, r - o.height - 10)), !0), x(R, !0);
		}, n = () => void t();
		window.addEventListener("resize", n), window.addEventListener("scroll", n, !0);
		let r = typeof ResizeObserver > "u" ? null : new ResizeObserver(n);
		return r?.observe(g()), r?.observe(S(P)), n(), () => {
			e = !0, window.removeEventListener("resize", n), window.removeEventListener("scroll", n, !0), r?.disconnect();
		};
	});
	var V = r(), H = v(V), U = (e) => {
		{
			let t = k(() => m() === "parent-top");
			Gt(e, {
				get to() {
					return z;
				},
				get disabled() {
					return S(t);
				},
				children: (e, t) => {
					var n = r(), i = v(n), u = (e) => {
						var t = qt(), n = E(t), r = E(n), i = (e) => {
							var t = Kt();
							h(e, t);
						};
						j(r, (e) => {
							ee() && e(i);
						});
						var a = te(r, 2), u = E(a);
						l(u, () => N() ?? c), s(a), s(n), s(t), y(t, (e) => x(P, e), () => S(P)), ne(() => {
							f(t, 1, `floating-message ${m() ?? ""}`, "svelte-1226wk1"), O(t, m() === "container-top-right" ? `left: ${S(F)}px; top: ${S(I)}px; width: ${S(L)}px;` : m() === "anchor-bottom-right" || m() === "anchor-center" ? `left: ${S(F)}px; top: ${S(I)}px; max-width: ${S(L)}px; visibility: ${S(R) ? "visible" : "hidden"};` : m() === "pointer" ? `left: ${S(F)}px; top: ${S(I)}px;` : void 0), A(t, "role", M()), A(t, "aria-live", M() === "alert" ? "assertive" : "polite");
						}), o(2, t, () => It, () => ({ duration: T() })), h(e, t);
					};
					j(i, (e) => {
						a() && e(u);
					}), h(e, n);
				},
				$$slots: { default: !0 }
			});
		}
	};
	j(H, (e) => {
		(a() || T() > 0) && e(U);
	}), h(t, V), p();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/Button.svelte
var Xt = /* @__PURE__ */ new Set([
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
	"ref",
	"onClick",
	"selected",
	"floatingMessage",
	"floatingMessageDuration",
	"floatingMessageVariant"
]), Zt = a("<div class=\"svelte-1kbd9s6\"> </div>"), Qt = a("<button><!></button> <!>", 1), $t = {
	hash: "svelte-1kbd9s6",
	code: "button.svelte-1kbd9s6 {background-color:var(--btn-bg);}\n    /* --- Variant Styles --- */.ehagaki-app-root :where(.default, .primary, .secondary) {padding:8px 12px;}.ehagaki-app-root :where(.default) {:where(.svg-icon) {width:24px;height:24px;}.btn-text {font-size:1rem;font-weight:500;}}.ehagaki-app-root :where(.primary) {--btn-bg: var(--theme);--text: white;font-weight:500;gap:8px;border:none;.svg-icon {--svg: white;width:28px;height:28px;}.btn-text {color:white;font-size:1rem;font-weight:500;}\n                .loading-placeholder.post-button-loading\n                    .loader-container\n                    .square\n             {background-color:white;}\n\n        @media (hover: hover) and (pointer: fine) {&:hover:not(:disabled) {color:light-dark(\n                    color-mix(in srgb, white, black 6%),\n                    color-mix(in srgb, white, black 10%)\n                );background-color:light-dark(\n                    color-mix(in srgb, var(--btn-bg), black 4%),\n                    color-mix(in srgb, var(--btn-bg), black 7%)\n                );.btn-text {color:currentColor;}}\n        }}:root.light .ehagaki-app-root button.primary.svelte-1kbd9s6:hover:not(:disabled) .svg-icon,\n    :root.dark .ehagaki-app-root button.primary.svelte-1kbd9s6:hover:not(:disabled) .svg-icon,\n    :host(.light) .ehagaki-app-root button.primary.svelte-1kbd9s6:hover:not(:disabled) .svg-icon,\n    :host(.dark) .ehagaki-app-root button.primary.svelte-1kbd9s6:hover:not(:disabled) .svg-icon {background-color:currentColor;}.ehagaki-app-root :where(.secondary) {border:1px solid var(--btn-border);--btn-bg: white;--text: var(--text-black);--border: var(--light-gray);\n\n        @media (hover: hover) and (pointer: fine) {&:hover:not(:disabled) {background:light-dark(\n                    color-mix(in srgb, var(--btn-bg), black 3%),\n                    color-mix(in srgb, var(--btn-bg), black 8%)\n                );color:light-dark(\n                    color-mix(in srgb, var(--text), black 6%),\n                    black\n                );}\n        }}.header.svelte-1kbd9s6 {border:1px solid var(--accent-color-custom, var(--hagaki));\n        @media (hover: hover) and (pointer: fine) {:root.light &,\n            :host(.light) & {&:hover:not(:disabled) {border-color:color-mix(\n                        in srgb,\n                        var(--accent-color-custom, var(--hagaki)),\n                        black 3%\n                    );}}\n        }:root.light &,\n        :host(.light) & {--btn-bg: var(--base-color-surface-button, var(--surface-editor));}}.danger.svelte-1kbd9s6 {--btn-bg: var(--danger);--text: white;border:none;\n\n        @media (hover: hover) and (pointer: fine) {&:hover:not(:disabled) {background-color:light-dark(\n                    color-mix(in srgb, var(--btn-bg), black 8%),\n                    color-mix(in srgb, var(--btn-bg), black 12%)\n                );color:light-dark(\n                    color-mix(in srgb, white, black 8%),\n                    color-mix(in srgb, white, black 12%)\n                );}\n        }}.warning.svelte-1kbd9s6 {--btn-bg: hsl(58, 99%, 74%);--text: var(--text-black);border:none;\n\n        @media (hover: hover) and (pointer: fine) {&:hover:not(:disabled) {background:light-dark(\n                    color-mix(in srgb, var(--btn-bg), black 8%),\n                    color-mix(in srgb, var(--btn-bg), black 12%)\n                );}\n        }}.footer.svelte-1kbd9s6 {max-width:100px;flex:1 1 0;--btn-bg: transparent;}button.svelte-1kbd9s6:is(.close:where(.svelte-1kbd9s6), .copy:where(.svelte-1kbd9s6)) {--btn-bg: rgb(0 0 0 / var(--overlay-opacity));--svg: whitesmoke;width:50px;height:50px;padding:0;border:none;opacity:0.8;backdrop-filter:blur(4px);transition:background 0.2s ease;background:var(--btn-bg);.svg-icon {width:var(--icon-size);height:var(--icon-size);mask-image:var(--icon-mask);}\n\n        @media (hover: hover) and (pointer: fine) {&:hover:not(:disabled) {--btn-bg: rgb(25 25 25 / var(--hover-overlay-opacity));background:var(--btn-bg);}\n        }}button.close.svelte-1kbd9s6 {--overlay-opacity: 0.5;--hover-overlay-opacity: 0.5;--icon-size: 32px;--icon-mask: var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}button.copy.svelte-1kbd9s6 {--overlay-opacity: 0.45;--hover-overlay-opacity: 0.45;--icon-size: 20px;--icon-mask: var(--ehagaki-icon-66696c655f636f70795f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}\n\n    /* --- Shape Styles --- */.square.svelte-1kbd9s6,\n    .circle.svelte-1kbd9s6 {padding:0;}.square.svelte-1kbd9s6 {border-radius:0;:where(.svg-icon) {width:30px;height:30px;}}.rounded.svelte-1kbd9s6 {border-radius:6px;}.pill.svelte-1kbd9s6 {border-radius:50px;}.circle.svelte-1kbd9s6 {border-radius:50%;display:flex;align-items:center;justify-content:center;aspect-ratio:1;.svg-icon {width:28px;height:28px;}}\n\n    /* --- Content Layout Styles --- */.ehagaki-app-root :where(.content-iconText) {gap:8px;padding:12px 18px 12px 14px;}.content-icon.svelte-1kbd9s6 {padding:0;:where(.svg-icon) {width:30px;height:30px;}}"
};
function en(t, r) {
	n(r, !0), e(t, $t);
	let i = C(r, "className", 3, ""), a = C(r, "class", 3, ""), o = C(r, "disabled", 3, !1), u = C(r, "type", 3, "button"), d = C(r, "ariaLabel", 3, void 0), f = C(r, "style", 3, ""), _ = C(r, "variant", 3, void 0), w = C(r, "shape", 3, void 0), O = C(r, "contentLayout", 3, void 0), A = C(r, "ref", 15, null), M = C(r, "onClick", 3, void 0), N = C(r, "selected", 3, !1), P = C(r, "floatingMessage", 3, ""), re = C(r, "floatingMessageDuration", 3, 1800), F = C(r, "floatingMessageVariant", 3, "pointer"), I = ee(r, Xt), L = D(!1), R = D(0), z = D(0), B, V = k(() => _() ?? ""), H = k(() => O() ? `content-${O()}` : ""), U = k(() => `${a()} ${i()}`.trim()), ie = k(() => w() ?? "");
	function W() {
		B !== void 0 && (clearTimeout(B), B = void 0);
	}
	function ae(e) {
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
	function oe(e) {
		P() && (W(), x(R, e.x, !0), x(z, e.y, !0), x(L, !0), B = setTimeout(() => {
			x(L, !1), B = void 0;
		}, re()));
	}
	async function G(e) {
		let t = P() ? ae(e) : null;
		(M() ? await M()(e) : void 0) !== !1 && t && oe(t);
	}
	T(W);
	var K = Qt(), q = v(K);
	g(q, () => ({
		type: u(),
		class: `${S(U)} ${S(V)} ${S(ie)} ${S(H)} ${N() ? "selected" : ""}`,
		disabled: o(),
		"aria-label": d() || void 0,
		style: f(),
		onclick: G,
		...I
	}), void 0, void 0, void 0, "svelte-1kbd9s6");
	var se = E(q);
	l(se, () => r.children ?? c), s(q), y(q, (e) => A(e), () => A());
	var ce = te(q, 2), le = (e) => {
		Yt(e, {
			get show() {
				return S(L);
			},
			get x() {
				return S(R);
			},
			get y() {
				return S(z);
			},
			get variant() {
				return F();
			},
			children: (e, t) => {
				var n = Zt(), r = b(n, !0);
				ne(() => m(r, P())), h(e, n);
			},
			$$slots: { default: !0 }
		});
	};
	j(ce, (e) => {
		P() && e(le);
	}), h(t, K), p();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/appUtils.ts
var tn = { setTimeout: (e, t) => setTimeout(e, t) };
function nn() {
	try {
		return crypto.randomUUID();
	} catch {
		return rn();
	}
}
function rn() {
	return Date.now().toString(36) + Math.random().toString(36).substring(2, 11);
}
function an(e, t) {
	return t(!0), e();
}
function on(e) {
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
function sn(e, t, n, r, i) {
	let a = window.innerWidth || document.documentElement.clientWidth || 0, o = window.innerHeight || document.documentElement.clientHeight || 0, s = typeof n == "number" ? n : 0, c = r ? a - r - s : a - s, l = i ? o - i - s : o - s;
	return {
		x: Math.max(s, Math.min(c, e)),
		y: Math.max(s, Math.min(l, t))
	};
}
export { Pe as $, X as A, Dt as B, ft as C, ye as Ct, ut as D, se as Dt, vt as E, ce as Et, Ct as F, wt as G, At as H, Ke as I, We as J, Ie as K, St as L, it as M, rt as N, gt as O, z as Ot, Ot as P, Oe as Q, kt as R, pt as S, K as St, xt as T, le as Tt, yt as U, jt as V, Mt as W, Fe as X, Y, we as Z, lt as _, B as _t, on as a, W as at, ot as b, V as bt, Yt as c, fe as ct, bt as d, ge as dt, Te as et, Pt as f, de as ft, ct as g, ue as gt, nt as h, U as ht, rn as i, ae as it, Tt as j, Qe as k, Gt as l, he as lt, tt as m, _e as mt, tn as n, ke as nt, an as o, oe as ot, at as p, me as pt, Ue as q, nn as r, J as rt, en as s, be as st, sn as t, Me as tt, Ut as u, pe as ut, Ge as v, ie as vt, et as w, ve as wt, st as x, Ce as xt, dt as y, H as yt, Et as z };
