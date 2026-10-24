import { At as e, B as t, C as n, Ct as r, G as i, L as a, N as o, R as s, U as c, V as l, W as u, at as d, bt as f, ct as p, dt as m, et as h, f as g, g as _, gt as v, i as y, j as ee, jt as b, k as te, lt as x, mt as S, ot as C, r as w, t as ne, tt as T, ut as re, w as E, wt as D, yt as O, z as k } from "./index-client-Bdka-Daw.js";
import { n as A } from "./appRuntimeEnvironment-BvtUCHcA.js";
import { l as j, n as M, o as N } from "./relayConfigUtils-DD5f1UAM.js";
import { Q as P, X as F, l as I, st as L } from "./LoadingPlaceholder-j1_vRYno.js";
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
var z = "https://nostr.build/api/v2/upload/files", B = 1073741824, ie = {
	enabled: !0,
	aspectRatioThreshold: 3,
	minShortEdge: 320,
	maxMegapixels: 8
}, V = {
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
}, ae = /(?:^|[\s\n\u3000])#([^\s\n\u3000#]+)/g, oe = ["http:", "https:"], se = [
	".png",
	".jpg",
	".jpeg",
	".gif",
	".webp",
	".svg"
], H = [
	".mp4",
	".webm",
	".mov",
	".avi",
	".mkv"
], U = "medium", W = {
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
}, ce = [
	"none",
	"low",
	"medium",
	"high"
], le = [
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
function ue(e) {
	return e === "ja" ? "https://share.yabu.me/api/v2/media" : "https://nostrcheck.me/api/v2/media";
}
function de(e) {
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
var fe = {
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
}, pe = [
	"balloonMessage.success.post_success",
	"balloonMessage.success.sent",
	"balloonMessage.success.to_everyone"
], me = "balloonMessage.error.post_error", he = "balloonMessage.error.post_rejected", ge = "balloonMessage.error.post_timeout", _e = "balloonMessage.error.post_network_error", ve = ["balloonMessage.tips.long_press_to_post"], ye = {
	MAX_WAIT_TIME: 15e3,
	RETRY_INTERVAL: 1e3,
	TIMEOUT_MESSAGE: "Upload processing timeout"
}, be = {
	MAX_WAIT_TIME: 15e3,
	RETRY_INTERVAL: 1e3,
	TIMEOUT_MESSAGE: "Uploaded media is not available yet"
}, xe = /nsec1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{10,}/, Se = /^nsec1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{58}$/, Ce = {
	REQUEST_TIMEOUT: 3e3,
	SW_CONTROLLER_WAIT_TIMEOUT: 100
};
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/nostrUtils.ts
function we(e) {
	return xe.test(e);
}
function Te(e) {
	return Se.test(e);
}
function Ee(e) {
	return N(e);
}
function De(e) {
	return {
		npub: j.npubEncode(e),
		nprofile: j.nprofileEncode({
			pubkey: e,
			relays: []
		})
	};
}
function Oe(e) {
	try {
		let { type: t, data: n } = j.decode(e);
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
		return j.npubEncode(e);
	} catch {
		return `npub1${e.slice(0, 10)}...`;
	}
}
function Ae(e, t, n) {
	for (let r of t) if (r && !e.includes(r) && (e.push(r), e.length >= n)) return;
}
function G(e, t = 3) {
	let n = [];
	for (let r of e) if (Ae(n, r, t), n.length >= t) break;
	return n;
}
function je(e, t = [], n = []) {
	try {
		let r = G([t.slice(0, 1), n], 3);
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
		let t = G([
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
function Ne(e, t = []) {
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
var K = [
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
	return typeof e == "string" && K.includes(e);
}
function Le(e) {
	return Ie(e) ? e : null;
}
function q(e) {
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
	return e.client === "custom" ? q(e.customUrlTemplate) : Pe[e.client];
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
	return ze(t, Ne(e, n));
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
		let t = e.getItem(W.LOCAL_RELAY_URL);
		return t ? R(t) : null;
	} catch {
		return null;
	}
}
function Ue(e, t) {
	if (!t.trim()) return e.removeItem(W.LOCAL_RELAY_URL), null;
	let n = R(t);
	if (!n) throw Error("invalid_local_relay_url");
	return e.setItem(W.LOCAL_RELAY_URL, n), n;
}
function We(e) {
	return typeof e == "string" && e.toLowerCase().startsWith("ja");
}
function J(e) {
	return We(e) ? "ja" : "en";
}
function Ge(e) {
	try {
		let t = e.getItem(W.SETTINGS_PREFERENCE_METADATA);
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
	e.setItem(W.SETTINGS_PREFERENCE_METADATA, JSON.stringify({
		embedBootstrapApplied: t.embedBootstrapApplied === !0,
		sources: t.sources ?? {}
	}));
}
function qe(e, t) {
	return e == null ? t : e !== "false";
}
function Y(e, t, n) {
	let r = e.getItem(t);
	return r === null ? (e.setItem(t, n ? "true" : "false"), n) : qe(r, n);
}
function Je(e) {
	if (!e) return null;
	let t = e === "skip" ? "none" : e;
	return ce.includes(t) ? t : null;
}
function X(e) {
	return Je(e);
}
function Ye(e) {
	let t = Je(e);
	return t === "low" ? "high" : t === "high" ? "low" : t;
}
function Xe(e, t, n, r) {
	let i = X(e.getItem(t));
	if (i) return i;
	let a = Ye(e.getItem(n));
	if (!a) return null;
	e.setItem(t, a), e.removeItem && e.removeItem(n);
	let o = Ge(e), s = r === "imageQualityLevel" ? "imageCompressionLevel" : "videoCompressionLevel", c = o.sources?.[s];
	return c && !o.sources?.[r] && Z(e, r, c), a;
}
function Z(e, t, n) {
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
	let t = e.getItem(W.LOCALE);
	return t === "ja" || t === "en" ? t : null;
}
function Qe(e, t) {
	return Ze(e) ?? J(t.language);
}
function $e(e, t) {
	let n = Le(e.getItem(W.EXTERNAL_NOSTR_CLIENT));
	if (n) return {
		client: n,
		customUrlTemplate: n === "custom" ? e.getItem(W.EXTERNAL_NOSTR_CLIENT_CUSTOM_URL) ?? "" : ""
	};
	let r = J(t) === "ja" ? "nostter" : "jumble";
	return e.setItem(W.EXTERNAL_NOSTR_CLIENT, r), {
		client: r,
		customUrlTemplate: ""
	};
}
function et(e, t) {
	let n = Le(t);
	return n ? (e.setItem(W.EXTERNAL_NOSTR_CLIENT, n), n) : null;
}
function tt(e, t) {
	let n = q(t);
	return n ? (e.setItem(W.EXTERNAL_NOSTR_CLIENT_CUSTOM_URL, n), n) : null;
}
function nt(e) {
	return Y(e, W.CLIENT_TAG_ENABLED, !0);
}
function rt(e) {
	return Y(e, W.QUOTE_NOTIFICATION_ENABLED, !1);
}
function it(e) {
	return Y(e, W.REPLY_NOTIFICATION_ENABLED, !1);
}
function at(e) {
	return Y(e, W.FAIL_CLOSED_CONTENT_WARNING, !1);
}
function ot(e, t) {
	return Xe(e, W.IMAGE_QUALITY_LEVEL, W.LEGACY_IMAGE_COMPRESSION_LEVEL, "imageQualityLevel") ?? X(t) ?? "medium";
}
function st(e) {
	let t = Xe(e, W.VIDEO_QUALITY_LEVEL, W.LEGACY_VIDEO_COMPRESSION_LEVEL, "videoQualityLevel");
	return e.getItem(W.VIDEO_QUALITY_LEVEL) === "skip" ? (e.setItem(W.VIDEO_QUALITY_LEVEL, "none"), "none") : t || (e.setItem(W.VIDEO_QUALITY_LEVEL, U), U);
}
function ct(e) {
	return Y(e, W.MEDIA_FREE_PLACEMENT, !1);
}
function lt(e) {
	return Y(e, W.SHOW_MASCOT, !0);
}
function ut(e) {
	return Y(e, W.SHOW_FLAVOR_TEXT, !0);
}
function dt(e) {
	let t = e.getItem(W.DARK_MODE);
	return t === null ? null : t === "true";
}
function ft(e) {
	return e === "system" || e === "light" || e === "dark" ? e : null;
}
function Q(e) {
	if (typeof e != "string") return null;
	let t = e.trim().replace(/^#/, "");
	return /^[0-9a-f]{6}$/i.test(t) ? `#${t.toLowerCase()}` : null;
}
function pt(e, t) {
	let n = e.getItem(t), r = Q(n);
	return n !== null && !r && e.removeItem(t), r;
}
function mt(e) {
	return {
		accentColor: pt(e, W.ACCENT_COLOR),
		baseColor: pt(e, W.BASE_COLOR)
	};
}
function ht(e, t, n) {
	let r = Q(n);
	return r ? (e.setItem(t, r), r) : null;
}
function gt(e) {
	e.removeItem(W.ACCENT_COLOR), e.removeItem(W.BASE_COLOR);
}
function _t(e) {
	let t = ft(e.getItem(W.THEME_MODE));
	if (t) return e.getItem(W.DARK_MODE) !== null && e.removeItem(W.DARK_MODE), t;
	if (e.getItem(W.THEME_MODE) !== null) return e.setItem(W.THEME_MODE, "system"), e.removeItem(W.DARK_MODE), "system";
	let n = dt(e);
	if (n !== null) {
		let t = n ? "dark" : "light";
		return e.setItem(W.THEME_MODE, t), e.removeItem(W.DARK_MODE), t;
	}
	return e.setItem(W.THEME_MODE, "system"), "system";
}
function vt(e, t, n = "user") {
	let r = J(t);
	return e.setItem(W.LOCALE, r), Z(e, "locale", n), r;
}
function yt(e, t, n = "user") {
	let r = X(t) ?? "medium";
	return e.setItem(W.IMAGE_QUALITY_LEVEL, r), Z(e, "imageQualityLevel", n), r;
}
function bt(e, t, n = "user") {
	let r = X(t) ?? "medium";
	return e.setItem(W.VIDEO_QUALITY_LEVEL, r), Z(e, "videoQualityLevel", n), r;
}
function xt(e, t, n = "user") {
	return e.setItem(W.CLIENT_TAG_ENABLED, t ? "true" : "false"), Z(e, "clientTagEnabled", n), t;
}
function St(e, t, n = "user") {
	return e.setItem(W.QUOTE_NOTIFICATION_ENABLED, t ? "true" : "false"), Z(e, "quoteNotificationEnabled", n), t;
}
function Ct(e, t, n = "user") {
	return e.setItem(W.REPLY_NOTIFICATION_ENABLED, t ? "true" : "false"), Z(e, "replyNotificationEnabled", n), t;
}
function wt(e, t, n = "user") {
	return e.setItem(W.FAIL_CLOSED_CONTENT_WARNING, t ? "true" : "false"), Z(e, "failClosedContentWarning", n), t;
}
function Tt(e, t, n = "user") {
	return e.setItem(W.MEDIA_FREE_PLACEMENT, t ? "true" : "false"), Z(e, "mediaFreePlacement", n), t;
}
function Et(e, t, n = "user") {
	return e.setItem(W.SHOW_MASCOT, t ? "true" : "false"), Z(e, "showMascot", n), t;
}
function Dt(e, t, n = "user") {
	return e.setItem(W.SHOW_FLAVOR_TEXT, t ? "true" : "false"), Z(e, "showFlavorText", n), t;
}
function Ot(e, t, n = "user") {
	let r = ft(t) ?? "system";
	return e.setItem(W.THEME_MODE, r), e.removeItem(W.DARK_MODE), Z(e, "darkMode", n), r;
}
function kt(e) {
	return e.getItem(W.FIRST_VISIT) !== "1";
}
function At(e) {
	let t = kt(e);
	return t && e.setItem(W.FIRST_VISIT, "1"), t;
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
	var n = u(), r = x(n);
	a(r, () => t.children, (e) => {
		var n = u(), r = x(n);
		o(r, () => t.children ?? b), c(e, n);
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
	D(t, !0);
	let n = Bt(() => t.to), i = f(), a = O(d);
	function d() {
		if (!I || t.disabled) return null;
		let e = null;
		return e = typeof n.current == "string" ? document.querySelector(n.current) : n.current, e;
	}
	let p;
	function m() {
		p &&= (l(p), null);
	}
	F([() => h(a), () => t.disabled], ([e, n]) => {
		if (!e || n) m();
		else return p = k(Nt, {
			target: e,
			props: { children: t.children },
			context: i
		}), () => {
			m();
		};
	});
	var g = u(), _ = x(g), v = (e) => {
		var n = u(), r = x(n);
		o(r, () => t.children ?? b), c(e, n);
	};
	s(_, (e) => {
		t.disabled && e(v);
	}), c(e, g), r();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/FloatingMessage.svelte
var Ht = i("<span class=\"info-icon svg-icon svelte-1226wk1\" aria-hidden=\"true\"></span>"), Ut = i("<div role=\"status\" aria-live=\"polite\" aria-atomic=\"true\"><div class=\"floating-message-body svelte-1226wk1\"><!> <div class=\"floating-message-content svelte-1226wk1\"><!></div></div></div>"), Wt = {
	hash: "svelte-1226wk1",
	code: ".floating-message.svelte-1226wk1 {background:var(--dialog-bg, #fff);color:var(--text, #000);border:1px solid var(--border, #ccc);border-radius:8px;box-shadow:0 6px 20px rgba(0, 0, 0, 0.18);padding:10px 12px;max-width:320px;position:fixed;z-index:100001;display:inline-flex;align-items:flex-start;white-space:nowrap;pointer-events:none;}.floating-message.top-right.svelte-1226wk1 {top:16px;right:16px;max-width:min(360px, calc(100vw - 32px));white-space:normal;}.floating-message.container-top-right.svelte-1226wk1 {top:auto;right:auto;box-sizing:border-box;white-space:normal;}.floating-message.anchor-bottom-right.svelte-1226wk1,\n    .floating-message.anchor-center.svelte-1226wk1 {top:auto;right:auto;box-sizing:border-box;white-space:normal;}.floating-message-body.svelte-1226wk1 {display:inline-flex;align-items:center;gap:4px;width:100%;}.floating-message-content.svelte-1226wk1 {padding:0 2px;font-size:1rem;font-weight:bold;color:var(--text);text-align:center;}.info-icon.svelte-1226wk1 {mask-image:var(--ehagaki-icon-696e666f5f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);width:24px;height:24px;min-width:24px;}"
};
function Gt(t, i) {
	D(i, !0), te(t, Wt);
	let a = w(i, "show", 3, !1), l = w(i, "x", 3, 0), f = w(i, "y", 3, 0), _ = w(i, "variant", 3, "pointer"), y = w(i, "anchor", 3, null), ne = w(i, "anchorRightOffset", 3, 0), re = w(i, "showInfoIcon", 3, !0), O = w(i, "fadeOutDuration", 3, 0), k = w(i, "children", 3, void 0), j = v(void 0), M = v(0), N = v(0), P = v(320), F = v(!1), { overlayTarget: I, layoutTarget: L } = A();
	C(() => {
		_() === "pointer" && (S(M, l()), S(N, f()));
	}), C(() => {
		a() && h(j) && _() === "pointer" && (async () => {
			if (await T(), !h(j)) return;
			let e = h(j).getBoundingClientRect(), t = window.innerWidth, n = window.innerHeight, r = l(), i = f();
			r + e.width + 10 > t && (r = t - e.width - 10), r - 10 < 0 && (r = 10), i + e.height + 10 > n && (i = n - e.height - 10), i - 10 < 0 && (i = 10), S(M, r, !0), S(N, i, !0);
		})();
	}), C(() => {
		a() && h(j) && _() === "container-top-right" && (async () => {
			if (await T(), !h(j)) return;
			let e = L.getBoundingClientRect();
			if (S(P, Math.min(320, Math.max(0, e.width - 20)), !0), await T(), !h(j)) return;
			let t = h(j).getBoundingClientRect();
			S(M, Math.max(e.left + 10, e.right - t.width - 10), !0), S(N, e.top + 10);
		})();
	}), C(() => {
		if (_() !== "anchor-bottom-right" && _() !== "anchor-center" || !a()) return;
		if (!h(j) || !y()) {
			S(F, !1);
			return;
		}
		let e = !1;
		S(F, !1);
		let t = async () => {
			if (await T(), e || !h(j) || !y()) return;
			let t = y().getBoundingClientRect(), n = window.innerWidth, r = window.innerHeight, i = Math.max(0, n - 20), a = Math.min(320, i);
			if (h(P) !== a && (S(P, a, !0), await T(), e || !h(j))) return;
			let o = h(j).getBoundingClientRect(), s = _() === "anchor-center" ? t.left + (t.width - o.width) / 2 : t.right - o.width - ne(), c = _() === "anchor-center" ? t.top + (t.height - o.height) / 2 : t.bottom + 8;
			S(M, Math.max(10, Math.min(s, n - o.width - 10)), !0), S(N, Math.max(10, Math.min(c, r - o.height - 10)), !0), S(F, !0);
		}, n = () => void t();
		window.addEventListener("resize", n), window.addEventListener("scroll", n, !0);
		let r = typeof ResizeObserver > "u" ? null : new ResizeObserver(n);
		return r?.observe(y()), r?.observe(h(j)), n(), () => {
			e = !0, window.removeEventListener("resize", n), window.removeEventListener("scroll", n, !0), r?.disconnect();
		};
	});
	var R = u(), z = x(R), B = (t) => {
		Vt(t, {
			get to() {
				return I;
			},
			children: (t, r) => {
				var i = u(), l = x(i), f = (t) => {
					var r = Ut(), i = p(r), a = p(i), l = (e) => {
						var t = Ht();
						c(e, t);
					};
					s(a, (e) => {
						re() && e(l);
					});
					var u = m(a, 2), f = p(u);
					o(f, () => k() ?? b), e(u), e(i), e(r), g(r, (e) => S(j, e), () => h(j)), d(() => {
						E(r, 1, `floating-message ${_() ?? ""}`, "svelte-1226wk1"), n(r, _() === "container-top-right" ? `left: ${h(M)}px; top: ${h(N)}px; width: ${h(P)}px;` : _() === "anchor-bottom-right" || _() === "anchor-center" ? `left: ${h(M)}px; top: ${h(N)}px; max-width: ${h(P)}px; visibility: ${h(F) ? "visible" : "hidden"};` : _() === "pointer" ? `left: ${h(M)}px; top: ${h(N)}px;` : void 0);
					}), ee(2, r, () => Mt, () => ({ duration: O() })), c(t, r);
				};
				s(l, (e) => {
					a() && e(f);
				}), c(t, i);
			},
			$$slots: { default: !0 }
		});
	};
	s(z, (e) => {
		(a() || O() > 0) && e(B);
	}), c(t, R), r();
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
]), qt = i("<div class=\"svelte-1kbd9s6\"> </div>"), Jt = i("<button><!></button> <!>", 1), Yt = {
	hash: "svelte-1kbd9s6",
	code: "button.svelte-1kbd9s6 {background-color:var(--btn-bg);}\n    /* --- Variant Styles --- */.ehagaki-app-root :where(.default, .primary, .secondary) {padding:8px 12px;}.ehagaki-app-root :where(.default) {:where(.svg-icon) {width:24px;height:24px;}.btn-text {font-size:1rem;font-weight:500;}}.ehagaki-app-root :where(.primary) {--btn-bg: var(--theme);--text: white;font-weight:500;gap:8px;border:none;.svg-icon {--svg: white;width:28px;height:28px;}.btn-text {color:white;font-size:1rem;font-weight:500;}\n                .loading-placeholder.post-button-loading\n                    .loader-container\n                    .square\n             {background-color:white;}\n\n        @media (hover: hover) and (pointer: fine) {&:hover:not(:disabled) {color:light-dark(\n                    color-mix(in srgb, white, black 6%),\n                    color-mix(in srgb, white, black 10%)\n                );background-color:light-dark(\n                    color-mix(in srgb, var(--btn-bg), black 4%),\n                    color-mix(in srgb, var(--btn-bg), black 7%)\n                );.btn-text {color:currentColor;}}\n        }}:root.light .ehagaki-app-root button.primary.svelte-1kbd9s6:hover:not(:disabled) .svg-icon,\n    :root.dark .ehagaki-app-root button.primary.svelte-1kbd9s6:hover:not(:disabled) .svg-icon,\n    :host(.light) .ehagaki-app-root button.primary.svelte-1kbd9s6:hover:not(:disabled) .svg-icon,\n    :host(.dark) .ehagaki-app-root button.primary.svelte-1kbd9s6:hover:not(:disabled) .svg-icon {background-color:currentColor;}.ehagaki-app-root :where(.secondary) {border:1px solid var(--btn-border);--btn-bg: white;--text: var(--text-black);--border: var(--light-gray);\n\n        @media (hover: hover) and (pointer: fine) {&:hover:not(:disabled) {background:light-dark(\n                    color-mix(in srgb, var(--btn-bg), black 3%),\n                    color-mix(in srgb, var(--btn-bg), black 8%)\n                );color:light-dark(\n                    color-mix(in srgb, var(--text), black 6%),\n                    black\n                );}\n        }}.header.svelte-1kbd9s6 {border:1px solid var(--accent-color-custom, var(--hagaki));\n        @media (hover: hover) and (pointer: fine) {:root.light &,\n            :host(.light) & {&:hover:not(:disabled) {border-color:color-mix(\n                        in srgb,\n                        var(--accent-color-custom, var(--hagaki)),\n                        black 3%\n                    );}}\n        }:root.light &,\n        :host(.light) & {--btn-bg: var(--base-color-surface-button, var(--surface-editor));}}.danger.svelte-1kbd9s6 {--btn-bg: var(--danger);--text: white;border:none;\n\n        @media (hover: hover) and (pointer: fine) {&:hover:not(:disabled) {background-color:light-dark(\n                    color-mix(in srgb, var(--btn-bg), black 8%),\n                    color-mix(in srgb, var(--btn-bg), black 12%)\n                );color:light-dark(\n                    color-mix(in srgb, white, black 8%),\n                    color-mix(in srgb, white, black 12%)\n                );}\n        }}.warning.svelte-1kbd9s6 {--btn-bg: hsl(58, 99%, 74%);--text: var(--text-black);border:none;\n\n        @media (hover: hover) and (pointer: fine) {&:hover:not(:disabled) {background:light-dark(\n                    color-mix(in srgb, var(--btn-bg), black 8%),\n                    color-mix(in srgb, var(--btn-bg), black 12%)\n                );}\n        }}.footer.svelte-1kbd9s6 {max-width:100px;flex:1 1 0;--btn-bg: transparent;}button.svelte-1kbd9s6:is(.close:where(.svelte-1kbd9s6), .copy:where(.svelte-1kbd9s6)) {--btn-bg: rgb(0 0 0 / var(--overlay-opacity));--svg: whitesmoke;width:50px;height:50px;padding:0;border:none;opacity:0.8;backdrop-filter:blur(4px);transition:background 0.2s ease;background:var(--btn-bg);.svg-icon {width:var(--icon-size);height:var(--icon-size);mask-image:var(--icon-mask);}\n\n        @media (hover: hover) and (pointer: fine) {&:hover:not(:disabled) {--btn-bg: rgb(25 25 25 / var(--hover-overlay-opacity));background:var(--btn-bg);}\n        }}button.close.svelte-1kbd9s6 {--overlay-opacity: 0.5;--hover-overlay-opacity: 0.5;--icon-size: 32px;--icon-mask: var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}button.copy.svelte-1kbd9s6 {--overlay-opacity: 0.45;--hover-overlay-opacity: 0.45;--icon-size: 20px;--icon-mask: var(--ehagaki-icon-66696c655f636f70795f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}\n\n    /* --- Shape Styles --- */.square.svelte-1kbd9s6,\n    .circle.svelte-1kbd9s6 {padding:0;}.square.svelte-1kbd9s6 {border-radius:0;:where(.svg-icon) {width:30px;height:30px;}}.rounded.svelte-1kbd9s6 {border-radius:6px;}.pill.svelte-1kbd9s6 {border-radius:50px;}.circle.svelte-1kbd9s6 {border-radius:50%;display:flex;align-items:center;justify-content:center;aspect-ratio:1;.svg-icon {width:28px;height:28px;}}\n\n    /* --- Content Layout Styles --- */.ehagaki-app-root :where(.content-iconText) {gap:8px;padding:12px 18px 12px 14px;}.content-icon.svelte-1kbd9s6 {padding:0;:where(.svg-icon) {width:30px;height:30px;}}"
};
function Xt(n, i) {
	D(i, !0), te(n, Yt);
	let a = w(i, "className", 3, ""), s = w(i, "class", 3, ""), l = w(i, "disabled", 3, !1), u = w(i, "type", 3, "button"), f = w(i, "ariaLabel", 3, void 0), g = w(i, "style", 3, ""), ee = w(i, "variant", 3, void 0), C = w(i, "shape", 3, void 0), T = w(i, "contentLayout", 3, void 0), E = w(i, "onClick", 3, void 0), k = w(i, "selected", 3, !1), A = w(i, "floatingMessage", 3, ""), j = w(i, "floatingMessageDuration", 3, 1800), M = w(i, "floatingMessageVariant", 3, "pointer"), N = y(i, Kt), P = v(!1), F = v(0), I = v(0), L, R = O(() => ee() ?? ""), z = O(() => T() ? `content-${T()}` : ""), B = O(() => `${s()} ${a()}`.trim()), ie = O(() => C() ?? "");
	function V() {
		L !== void 0 && (clearTimeout(L), L = void 0);
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
		A() && (V(), S(F, e.x, !0), S(I, e.y, !0), S(P, !0), L = setTimeout(() => {
			S(P, !1), L = void 0;
		}, j()));
	}
	async function se(e) {
		let t = A() ? ae(e) : null;
		(E() ? await E()(e) : void 0) !== !1 && t && oe(t);
	}
	ne(V);
	var H = Jt(), U = x(H);
	_(U, () => ({
		type: u(),
		class: `${h(B)} ${h(R)} ${h(ie)} ${h(z)} ${k() ? "selected" : ""}`,
		disabled: l(),
		"aria-label": f() || void 0,
		style: g(),
		onclick: se,
		...N
	}), void 0, void 0, void 0, "svelte-1kbd9s6");
	var W = p(U);
	o(W, () => i.children ?? b), e(U), Gt(m(U, 2), {
		get show() {
			return h(P);
		},
		get x() {
			return h(F);
		},
		get y() {
			return h(I);
		},
		get variant() {
			return M();
		},
		children: (e, n) => {
			var r = qt(), i = re(r, !0);
			d(() => t(i, A())), c(e, r);
		},
		$$slots: { default: !0 }
	}), c(n, H), r();
}
navigator.language;
var Zt = { setTimeout: (e, t) => setTimeout(e, t) };
function Qt() {
	try {
		return crypto.randomUUID();
	} catch {
		return $();
	}
}
function $() {
	return Date.now().toString(36) + Math.random().toString(36).substring(2, 11);
}
function $t(e, t) {
	return t(!0), e();
}
function en(e) {
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
function tn(e, t, n, r, i) {
	let a = window.innerWidth || document.documentElement.clientWidth || 0, o = window.innerHeight || document.documentElement.clientHeight || 0, s = typeof n == "number" ? n : 0, c = r ? a - r - s : a - s, l = i ? o - i - s : o - s;
	return {
		x: Math.max(s, Math.min(c, e)),
		y: Math.max(s, Math.min(l, t))
	};
}
function nn(e, t) {
	let n = [];
	for (let r = 0; r < e.length; r += t) n.push(e.slice(r, r + t));
	return n;
}
export { Oe as $, Ye as A, St as B, ut as C, ue as Ct, mt as D, _t as E, wt as F, Ot as G, Dt as H, yt as I, Be as J, bt as K, Ue as L, xt as M, tt as N, st as O, et as P, we as Q, vt as R, it as S, de as St, Ze as T, R as Tt, Et as U, Ct as V, ht as W, q as X, Ve as Y, Ne as Z, at as _, B as _t, $ as a, H as at, ct as b, be as bt, Xt as c, he as ct, zt as d, ve as dt, Te as et, gt as f, V as ft, $e as g, ae as gt, Qe as h, ie as ht, Qt as i, oe as it, J as j, Q as k, Gt as l, pe as lt, nt as m, z as mt, nn as n, ke as nt, en as o, me as ot, At as p, fe as pt, K as q, Zt as r, se as rt, $t as s, _e as st, tn as t, je as tt, Vt as u, ge as ut, ot as v, Ce as vt, lt as w, le as wt, rt as x, ye as xt, He as y, W as yt, Tt as z };
