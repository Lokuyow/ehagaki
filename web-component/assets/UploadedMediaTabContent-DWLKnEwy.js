import { A as e, C as t, Et as n, G as r, I as i, J as a, K as o, Mt as s, Q as c, R as l, S as u, T as d, Tt as f, V as p, W as m, X as h, Y as g, Z as ee, ct as _, dt as v, et as y, f as te, ft as b, gt as x, h as S, it as C, jt as w, k as T, mt as E, nt as D, o as ne, pt as O, r as re, rt as k, s as ie, st as A, t as ae, ut as j, v as oe, vt as M, w as N, xt as P, y as F, yt as se, z as I } from "./index-client-XkLzkVYC.js";
import { l as ce, v as L } from "./relayConfigUtils-B4Q_AO1M.js";
import { n as le, r as ue, t as de } from "./uploadOperation-BVOBq-hD.js";
import { pt as fe, t as pe } from "./LoadingPlaceholder-lit91akO.js";
import { r as R } from "./authStore.svelte-DWJhnXxr.js";
import { c as me, s as z } from "./appUtils-BRia-Jm6.js";
import { i as he } from "./signedEventResultValidator-CnvxVz7l.js";
import { a as ge } from "./clipboardUtils-DL4u_EPs.js";
import { c as B, d as _e, f as ve, i as ye, n as V, o as be, s as H, t as xe } from "./uploadDestinationResolver-D2a1g-4b.js";
import { o as Se } from "./fileUtils-Bgnlkhhb.js";
import { t as U } from "./inViewportAction.svelte-DbEFrrvA.js";
import { J as Ce, Q as we, ct as Te, i as Ee, lt as De, nt as Oe, st as W, ut as ke } from "./App-B2GhfviI.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/uploadMediaImageUrl.ts
function G(e, t, n) {
	try {
		let r = ve({
			rawUrl: e,
			trustedUploadUrl: _e(t),
			pageProtocol: n
		}).url;
		return new URL(r).toString();
	} catch {
		return null;
	}
}
function K(e) {
	let t = new URL(e.currentOrigin), n = G(e.url, e.serverUrl, t.protocol);
	if (!n) return null;
	let r = new URL(`${e.basePath.endsWith("/") ? e.basePath : `${e.basePath}/`}__ehagaki-image/upload-media`, t);
	return r.searchParams.set("url", n), r.searchParams.set("server", e.serverUrl), r.toString();
}
function Ae(e) {
	return !e.url || e.cacheSupported === null ? null : e.cacheSupported ? K({
		url: e.url,
		serverUrl: e.serverUrl,
		basePath: e.basePath,
		currentOrigin: e.currentOrigin
	}) : e.url;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/uploadMediaImageCacheClient.ts
function q() {
	let e = L();
	return e.serviceWorkerEnabled ? e.window?.navigator.serviceWorker?.controller ?? null : null;
}
async function je(e, t) {
	let n = await Se(e, t, 1500);
	return n.status === "reply" ? n.data : null;
}
function Me(e) {
	return typeof e == "object" && !!e;
}
var J = null, Y = null;
async function Ne() {
	let e = q();
	return e ? (e === J && Y || (J = e, Y = je(e, { type: De }).then((e) => Me(e) && e.version === 1 && e.supported === !0)), await Y) : (J = null, Y = null, !1);
}
async function Pe(e) {
	if (!e.length) return !0;
	let t = q();
	if (!t) return !0;
	let n = [...new Set(e)], r = !0;
	for (let e = 0; e < n.length; e += W.maxEntries) {
		let i = await je(t, {
			type: Te,
			urls: n.slice(e, e + W.maxEntries)
		});
		r = Me(i) && i.version === 1 && i.success === !0 && r;
	}
	return r;
}
// D:/ドキュメント/GitHub/ehagaki/src/components/UploadedMediaPreview.svelte
var Fe = o("<!> <!>", 1), Ie = o("<button type=\"button\" class=\"image-open\"><img alt=\"\" referrerpolicy=\"no-referrer\" class=\"svelte-1gq8ela\"/></button>"), Le = o("<span class=\"svg-icon\" aria-hidden=\"true\"></span>"), X = o("<video controls=\"\" playsinline=\"\" preload=\"metadata\" class=\"svelte-1gq8ela\"><track kind=\"captions\"/></video> <!>", 3), Re = o("<div class=\"video-placeholder svelte-1gq8ela\"><!></div>"), ze = o("<div><!></div>"), Z = {
	hash: "svelte-1gq8ela",
	code: ".preview.svelte-1gq8ela {position:relative;width:100%;min-width:0;aspect-ratio:1;}\n    /* Reserve room for close, copy, delete and native playback controls. */.preview-active.svelte-1gq8ela {min-height:204px;}.preview-empty.svelte-1gq8ela {display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;}img.svelte-1gq8ela, video.svelte-1gq8ela {display:block;width:100%;height:100%;}img.svelte-1gq8ela {object-fit:cover;}video.svelte-1gq8ela {position:absolute;inset:0;object-fit:contain;}video.svelte-1gq8ela, .video-placeholder.svelte-1gq8ela {background:#181818;}.video-placeholder.svelte-1gq8ela {width:100%;height:100%;display:grid;place-items:center;}.preview.svelte-1gq8ela button.image-open {display:block;width:100%;height:100%;min-width:0;min-height:0;max-width:none;margin:0;padding:0;border:0;background:transparent;cursor:pointer;}.preview.svelte-1gq8ela button.media-video-button {padding:0;width:44px;height:44px;min-width:44px;color:white;}.preview.svelte-1gq8ela button.media-video-button:hover:not(:disabled) .svg-icon {background-color:white;}.preview.svelte-1gq8ela button.video-close {position:absolute;top:4px;right:4px;}.preview.svelte-1gq8ela button.video-open {width:56px;height:56px;}"
};
function Be(t, i) {
	n(i, !0), e(t, Z);
	let a = () => ie(fe, "$_", o), [o, l] = ne(), u = Oe("icons/play_arrow_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"), h = M(!1), _ = M(!1), S = M(void 0), C = P(() => Ae({
		url: i.item.url,
		serverUrl: i.item.serverUrl,
		cacheSupported: i.cacheSupported,
		basePath: "./",
		currentOrigin: window.location.origin
	}));
	function E(e) {
		return { destroy() {
			e.pause(), e.removeAttribute("src"), e.load();
		} };
	}
	async function re() {
		x(_, !0), i.item.url && i.cacheSupported && await Pe([i.item.url]);
	}
	ae(() => {
		D(S)?.pause();
	});
	var k = ze();
	let oe;
	var se = j(k), ce = (e) => {
		{
			let t = P(() => a()("uploadedMedia.previewUnavailable"));
			pe(e, { get text() {
				return D(t);
			} });
		}
	}, L = (e) => {
		var t = r(), n = v(t), o = (e) => {
			var t = Fe(), n = v(t);
			{
				let e = P(() => a()("uploadedMedia.previewUnavailable"));
				pe(n, { get text() {
					return D(e);
				} });
			}
			var r = O(n, 2);
			z(r, {
				onClick: () => {
					x(_, !1);
				},
				children: (e, t) => {
					w();
					var n = g();
					A((e) => p(n, e), [() => a()("uploadedMedia.retry")]), m(e, n);
				},
				$$slots: { default: !0 }
			}), m(e, t);
		}, s = (e) => {
			var t = Ie(), n = b(t);
			A((e) => {
				F(t, "aria-label", e), F(n, "src", D(C));
			}, [() => a()("uploadedMedia.openImage")]), ee("click", t, (e) => {
				e.currentTarget instanceof HTMLElement && i.onOpenImage?.(e.currentTarget);
			}), c("error", n, re), y(n), m(e, t);
		};
		I(n, (e) => {
			D(_) ? e(o) : D(h) && i.cacheSupported !== null && D(C) && e(s, 1);
		}), m(e, t);
	}, le = (e) => {
		var t = X(), n = v(t);
		te(n, (e) => x(S, e), () => D(S)), T(n, (e) => E?.(e));
		var r = O(n, 2);
		{
			let e = P(() => a()("uploadedMedia.closeVideo")), t = P(() => a()("uploadedMedia.closeVideo"));
			z(r, {
				variant: "close",
				shape: "circle",
				contentLayout: "icon",
				className: "media-video-button video-close",
				get ariaLabel() {
					return D(e);
				},
				get title() {
					return D(t);
				},
				get onClick() {
					return i.onCloseVideo;
				},
				children: (e, t) => {
					var n = Le();
					m(e, n);
				},
				$$slots: { default: !0 }
			});
		}
		A(() => F(n, "src", i.item.url)), c("ended", n, function(...e) {
			i.onCloseVideo?.apply(this, e);
		}), m(e, t);
	}, ue = (e) => {
		var t = Re(), n = j(t);
		{
			let e = P(() => a()("uploadedMedia.openVideo")), t = P(() => a()("uploadedMedia.openVideo"));
			z(n, {
				variant: "close",
				shape: "circle",
				contentLayout: "icon",
				className: "media-video-button video-open",
				get ariaLabel() {
					return D(e);
				},
				get title() {
					return D(t);
				},
				get onClick() {
					return i.onOpenVideo;
				},
				children: (e, t) => {
					var n = Le();
					let r;
					A(() => r = N(n, "", r, { "mask-image": `url("${u}")` })), m(e, n);
				},
				$$slots: { default: !0 }
			});
		}
		s(t), m(e, t);
	};
	I(se, (e) => {
		i.item.url ? i.item.kind === "image" ? e(L, 1) : i.active ? e(le, 2) : e(ue, -1) : e(ce);
	}), s(k), T(k, (e, t) => U?.(e, t), () => ({
		enabled: !0,
		rootMargin: "200px",
		onEnterView: () => {
			x(h, !0);
		}
	})), A(() => oe = d(k, 1, "preview svelte-1gq8ela", null, oe, {
		"preview-active": i.item.kind === "video" && i.active,
		"preview-empty": !i.item.url || i.item.kind === "image" && (D(_) || !D(h) || i.cacheSupported === null)
	})), m(t, k), f(), l();
}
h(["click"]);
// D:/ドキュメント/GitHub/ehagaki/src/lib/upload/uploadServerRegistration.ts
var Q = class extends Error {
	code;
	constructor(e) {
		super(e), this.code = e;
	}
}, Ve = [{
	domain: "yabu.me",
	origin: "https://share.yabu.me",
	mediaUrls: ["https://share.yabu.me/api/v2/media", "https://yabu.me/api/v2/media"],
	discoveryUrls: ["https://share.yabu.me", "https://yabu.me"]
}, {
	domain: "nostrcheck.me",
	origin: "https://nostrcheck.me",
	mediaUrls: ["https://nostrcheck.me/api/v2/media", "https://cdn.nostrcheck.me"],
	discoveryUrls: ["https://nostrcheck.me", "https://cdn.nostrcheck.me"]
}];
function He(e) {
	try {
		let t = new URL(e);
		return t.username || t.password || t.search || t.hash ? null : t.toString().replace(/\/$/, "");
	} catch {
		return null;
	}
}
function Ue(e) {
	if (e.protocol !== "nip96") return null;
	let t = Ve.find((t) => t.mediaUrls.includes(He(e.serverUrl)) && (!e.resolvedUploadUrl || t.mediaUrls.includes(He(e.resolvedUploadUrl))) && (!e.nip96ServerUrl || t.discoveryUrls.includes(He(e.nip96ServerUrl))));
	return t ? {
		domain: t.domain,
		origin: t.origin,
		registrationUrl: `${t.origin}/register`,
		termsUrl: `${t.origin}/api/v2/tos`
	} : null;
}
function $(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function We(e) {
	e.assertSession(), ue(e.signal);
	let t = Ue(e.destination);
	if (!t) throw new Q("serverError");
	return t;
}
async function Ge(e, t, n) {
	let r = new AbortController(), i = () => r.abort();
	e.signal?.addEventListener("abort", i, { once: !0 }), e.signal?.aborted && r.abort();
	let a = setTimeout(i, 2e4);
	try {
		e.assertSession();
		let i = await de(e.fetch(t, {
			...n,
			signal: r.signal,
			credentials: "omit",
			redirect: "error",
			cache: "no-store",
			referrerPolicy: "no-referrer"
		}), r.signal), a = await de(i.json(), r.signal);
		return e.assertSession(), {
			response: i,
			data: a
		};
	} finally {
		clearTimeout(a), e.signal?.removeEventListener("abort", i);
	}
}
async function Ke(e) {
	let t = We(e), { response: n, data: r } = await Ge(e, `${t.origin}/api/v2/domains`, { method: "GET" });
	if (!n.ok || !$(r) || !$(r.availableDomains)) return null;
	let i = r.availableDomains[t.domain];
	if (!$(i) || i.requireinvite !== !1 || i.requirepayment !== !1 || i.maxsatoshi !== 0) return null;
	let a = i.minUsernameLength, o = i.maxUsernameLength;
	return typeof a != "number" || typeof o != "number" || !Number.isSafeInteger(a) || !Number.isSafeInteger(o) || a < 1 || o < a ? null : {
		minLength: a,
		maxLength: o
	};
}
function qe(e, t) {
	return /^[a-zA-Z0-9_-]+$/.test(e) && e.length >= t.minLength && e.length <= t.maxLength;
}
async function Je(e, t, n, r) {
	let i = We(e);
	if (!qe(t, n)) throw new Q("invalidUsername");
	let a = `${i.origin}/api/v2/register`, o = {
		pubkey: e.expectedPubkey,
		username: t,
		domain: i.domain
	}, s;
	try {
		if (s = await de(e.authService.buildAuthHeader(a, "POST", o), e.signal), e.assertSession(), !s) throw Error();
	} catch {
		throw ue(e.signal), new Q("authentication");
	}
	let c;
	try {
		e.assertSession(), r(), c = await Ge(e, a, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: s
			},
			body: JSON.stringify(o)
		});
	} catch {
		throw ue(e.signal), new Q("unknownRegistration");
	}
	let { response: l, data: u } = c;
	if ([
		400,
		401,
		422
	].includes(l.status) && $(u) && u.status === "error" && u.message === "Invalid username format") throw new Q("invalidUsername");
	if ($(u) && u.status === "error" && l.status === 406) {
		if (u.message === "Username already registered") throw new Q("usernameTaken");
		if (u.message === "Pubkey already registered") return "alreadyRegistered";
	}
	if (l.status === 429) throw new Q("rateLimited");
	if (l.status === 401 || l.status === 403) return "external";
	if (!l.ok || !$(u) || u.status !== "success") throw new Q("unknownRegistration");
	if (u.otc === !0 || typeof u.payment_request == "string" && u.payment_request !== "" || typeof u.satoshi == "number" && u.satoshi > 0) return "external";
	if (u.otc !== !1 || u.payment_request !== "" || u.satoshi !== 0) throw new Q("unknownRegistration");
	return "registered";
}
// D:/ドキュメント/GitHub/ehagaki/src/components/UploadServerRegistration.svelte
var Ye = o("<p class=\"svelte-1fagx79\"> </p> <div><!></div>", 1), Xe = o("<!> <!>", 1), Ze = o("<p role=\"status\" class=\"svelte-1fagx79\"> </p> <a target=\"_blank\" rel=\"noopener noreferrer\"> </a> <!>", 1), Qe = o("<p role=\"alert\" class=\"svelte-1fagx79\"> </p> <!> <a target=\"_blank\" rel=\"noopener noreferrer\"> </a>", 1), $e = o("<p role=\"alert\" class=\"svelte-1fagx79\"> </p>"), et = o("<form class=\"svelte-1fagx79\"><label> </label> <input autocomplete=\"off\" autocapitalize=\"none\" required=\"\" class=\"svelte-1fagx79\"/> <p class=\"svelte-1fagx79\"> </p> <p class=\"svelte-1fagx79\"> <a target=\"_blank\" rel=\"noopener noreferrer\"> </a></p> <!> <div class=\"actions svelte-1fagx79\"><!> <!></div></form>"), tt = o("<p class=\"target svelte-1fagx79\"> </p> <!>", 1), nt = o("<section class=\"registration svelte-1fagx79\"><!></section>"), rt = {
	hash: "svelte-1fagx79",
	code: ".registration.svelte-1fagx79 {margin:8px 12px;padding:12px;border:1px solid var(--border);border-radius:6px;min-width:0;overflow-wrap:anywhere;}form.svelte-1fagx79, .registration.svelte-1fagx79 {display:flex;flex-direction:column;gap:8px;}p.svelte-1fagx79 {margin:0;}.target.svelte-1fagx79 {font-weight:bold;}input.svelte-1fagx79 {box-sizing:border-box;width:100%;min-width:0;padding:8px;min-height:44px;font:inherit;color:var(--text);background:var(--dialog-bg);border:1px solid var(--border);border-radius:4px;}.actions.svelte-1fagx79 {display:flex;flex-wrap:wrap;gap:8px;}"
};
function it(t, r) {
	let i = a();
	n(r, !0), e(t, rt);
	let o = () => ie(fe, "$_", l), [l, u] = ne(), d = M(""), h = M(""), ee = M(void 0), y = M(void 0), C = P(() => r.registration.phase === "submitting"), T = P(() => !!r.registration.policy && qe(D(d), r.registration.policy)), E = P(() => r.registration.error && (!["usernameTaken", "invalidUsername"].includes(r.registration.error) || D(d) === D(h)) ? r.registration.error : null);
	function re() {
		x(d, r.initialUsername.trim(), !0), x(h, ""), r.onOpen();
	}
	function ae() {
		r.onCancel(), k().then(() => D(y)?.querySelector("button")?.focus({ preventScroll: !0 }));
	}
	_(() => {
		r.registration.phase === "ready" && k().then(() => D(ee)?.focus({ preventScroll: !0 }));
	});
	var N = nt(), se = j(N), ce = (e) => {
		var t = Ye(), n = v(t), r = b(n, !0), i = O(n, 2), a = j(i);
		z(a, {
			onClick: re,
			children: (e, t) => {
				w();
				var n = g();
				A((e) => p(n, e), [() => o()("uploadedMedia.registration.open")]), m(e, n);
			},
			$$slots: { default: !0 }
		}), s(i), A((e) => p(r, e), [() => o()("uploadedMedia.registration.offer")]), m(e, t);
	}, L = (e) => {
		var t = tt(), n = v(t), a = b(n, !0), l = O(n, 2), u = (e) => {
			var t = Xe(), n = v(t);
			pe(n, {
				showLoader: !0,
				text: !0
			});
			var r = O(n, 2);
			z(r, {
				onClick: ae,
				children: (e, t) => {
					w();
					var n = g();
					A((e) => p(n, e), [() => o()("common.cancel")]), m(e, n);
				},
				$$slots: { default: !0 }
			}), m(e, t);
		}, f = (e) => {
			var t = Ze(), n = v(t), i = b(n, !0), a = O(n, 2), s = b(a, !0), c = O(a, 2);
			z(c, {
				onClick: () => r.onRefresh(),
				children: (e, t) => {
					w();
					var n = g();
					A((e) => p(n, e), [() => o()("uploadedMedia.refresh")]), m(e, n);
				},
				$$slots: { default: !0 }
			}), A((e, t) => {
				p(i, e), F(a, "href", r.registration.target.registrationUrl), p(s, t);
			}, [() => o()("uploadedMedia.registration.external"), () => o()("uploadedMedia.registration.official")]), m(e, t);
		}, _ = (e) => {
			var t = Qe(), n = v(t), i = b(n, !0), a = O(n, 2);
			z(a, {
				onClick: () => r.onRefresh(),
				children: (e, t) => {
					w();
					var n = g();
					A((e) => p(n, e), [() => o()("uploadedMedia.refresh")]), m(e, n);
				},
				$$slots: { default: !0 }
			});
			var s = O(a, 2), c = b(s, !0);
			A((e, t) => {
				p(i, e), F(s, "href", r.registration.target.registrationUrl), p(c, t);
			}, [() => o()("uploadedMedia.registration.errors.unknownRegistration"), () => o()("uploadedMedia.registration.official")]), m(e, t);
		}, y = (e) => {
			var t = et(), n = j(t), a = b(n, !0), l = O(n, 2);
			oe(l), F(l, "spellcheck", !1), te(l, (e) => x(ee, e), () => D(ee));
			var u = O(l, 2), f = b(u, !0), _ = O(u, 2), v = j(_), y = O(v), ne = b(y, !0);
			s(_);
			var re = O(_, 2), k = (e) => {
				var t = $e(), n = b(t, !0);
				A((e) => {
					F(t, "id", `${i}-error`), p(n, e);
				}, [() => o()(`uploadedMedia.registration.errors.${D(E)}`)]), m(e, t);
			};
			I(re, (e) => {
				D(E) && e(k);
			});
			var ie = O(re, 2), M = j(ie);
			{
				let e = P(() => !D(T) || D(C));
				z(M, {
					type: "submit",
					get disabled() {
						return D(e);
					},
					children: (e, t) => {
						w();
						var n = g();
						A((e) => p(n, e), [() => o()(D(C) ? "uploadedMedia.registration.submitting" : "uploadedMedia.registration.submit")]), m(e, n);
					},
					$$slots: { default: !0 }
				});
			}
			var N = O(M, 2);
			z(N, {
				onClick: ae,
				children: (e, t) => {
					w();
					var n = g();
					A((e) => p(n, e), [() => o()("common.cancel")]), m(e, n);
				},
				$$slots: { default: !0 }
			}), s(ie), s(t), A((e, o, s, c, d) => {
				F(t, "aria-busy", D(C)), F(n, "for", i), p(a, e), F(l, "id", i), l.disabled = D(C), F(l, "aria-describedby", `${i}-help${D(E) ? ` ${i}-error` : ""}`), F(l, "aria-invalid", o), F(u, "id", `${i}-help`), p(f, s), p(v, `${c ?? ""} `), F(y, "href", r.registration.target.termsUrl), p(ne, d);
			}, [
				() => o()("uploadedMedia.registration.username"),
				() => !D(T) || !!D(E) && ["invalidUsername", "usernameTaken"].includes(D(E)),
				() => o()("uploadedMedia.registration.usernameHelp", { values: {
					min: r.registration.policy.minLength,
					max: r.registration.policy.maxLength
				} }),
				() => o()("uploadedMedia.registration.agreement"),
				() => o()("uploadedMedia.registration.terms")
			]), c("submit", t, (e) => {
				e.preventDefault(), D(T) && !D(C) && (x(h, D(d), !0), r.onRegister(D(d)));
			}), S(l, () => D(d), (e) => x(d, e)), m(e, t);
		};
		I(l, (e) => {
			r.registration.phase === "loading" ? e(u) : r.registration.phase === "external" ? e(f, 1) : r.registration.phase === "unknown" ? e(_, 2) : e(y, -1);
		}), A(() => p(a, r.registration.target.domain)), m(e, t);
	};
	I(se, (e) => {
		r.registration.phase === "offer" ? e(ce) : e(L, -1);
	}), s(N), te(N, (e) => x(y, e), () => D(y)), A((e) => F(N, "aria-label", e), [() => o()("uploadedMedia.registration.title")]), m(t, N), f(), u();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/upload/uploadMediaManagementController.ts
var at = () => ({
	destinations: [],
	selectedId: null,
	current: null
});
function ot(e) {
	return [
		e.protocol,
		e.serverUrl,
		e.resolvedUploadUrl,
		e.nip96ServerUrl,
		e.nip96UrlMode
	].join("\n");
}
function st(e) {
	e.localSnapshot = null, e.nextPage = null, e.needsRefresh = !0;
}
var ct = class {
	deps;
	states = /* @__PURE__ */ new Map();
	destinations = [];
	pubkey = null;
	epoch = 0;
	selectedId = null;
	configuring = !1;
	configurationError = null;
	configurationGeneration = 0;
	savedDestinationsRead = !1;
	active = !0;
	get busy() {
		return [...this.states.values()].some((e) => !!e.deletingId || e.registration?.phase === "submitting");
	}
	activate() {
		this.active = !0;
	}
	suspend() {
		this.active = !1, this.epoch++, this.configuring = !1;
		for (let e of this.states.values()) e.abort?.abort(), e.generation++, e.deletingId && e.deleteDispatched && (e.error = new H("unknownDelete"), st(e)), e.loading = !1, e.deletingId = null, e.deleteDispatched = !1, this.stopRegistration(e);
		this.emit();
	}
	constructor(e) {
		this.deps = e;
	}
	emit() {
		let e = this.selectedId ? this.states.get(this.selectedId) : void 0, t = e ? {
			destination: e.destination,
			items: [...e.items],
			loaded: e.loaded,
			loading: e.loading,
			error: e.error,
			support: e.support,
			excludedCount: e.excludedCount,
			invalidCount: e.invalidCount,
			nextPage: e.nextPage,
			context: e.context,
			needsRefresh: e.needsRefresh,
			hasMore: !e.needsRefresh && (!!e.nextPage || !!e.localSnapshot?.length),
			deletingId: e.deletingId,
			notice: e.notice,
			registration: e.registration ? { ...e.registration } : null
		} : null;
		this.deps.onChange({
			destinations: [...this.destinations],
			selectedId: this.selectedId,
			current: t,
			configuring: this.configuring,
			configurationError: this.configurationError
		});
	}
	invalidate() {
		this.epoch++, this.configurationGeneration++, this.configuring = !1, this.configurationError = null, this.savedDestinationsRead = !1;
		for (let e of this.states.values()) e.abort?.abort();
		this.states.clear(), this.destinations = [], this.selectedId = null, this.pubkey = null, this.emit();
	}
	async configureSaved(e) {
		if (!this.active) return;
		let t = (this.deps.auth ?? R).value;
		if (e && (!t.isAuthenticated || t.pubkey !== e)) return;
		if (e !== this.pubkey && (this.invalidate(), this.pubkey = e), !e) {
			this.emit();
			return;
		}
		if (this.savedDestinationsRead) {
			this.selectedId && !this.states.get(this.selectedId)?.loaded && !this.states.get(this.selectedId)?.registration && this.load();
			return;
		}
		if (this.configuring) return;
		let n = this.epoch, r = ++this.configurationGeneration, i = () => this.active && n === this.epoch && r === this.configurationGeneration && this.pubkey === e && (this.deps.auth ?? R).value.isAuthenticated && (this.deps.auth ?? R).value.pubkey === e;
		this.configuring = !0, this.configurationError = null, this.emit();
		try {
			let t = await this.deps.loadDestinations?.(e) ?? [];
			i() && this.configure(e, t);
		} catch {
			i() && (this.configurationError = new H("invalidDestination"));
		} finally {
			i() && (this.configuring = !1, this.emit());
		}
	}
	configure(e, t) {
		if (e !== this.pubkey && this.invalidate(), this.pubkey = e, this.configurationGeneration++, this.configuring = !1, this.configurationError = null, this.savedDestinationsRead = !0, !e) {
			this.emit();
			return;
		}
		this.destinations = t.filter((e) => e.protocol !== "custom-http").map((t) => xe(t, {
			pubkeyHex: e,
			npub: ce.npubEncode(e)
		}));
		let n = new Set(this.destinations.map((e) => e.id));
		for (let [e, t] of this.states) n.has(e) || (t.abort?.abort(), this.states.delete(e));
		for (let e of this.destinations) {
			let t = this.states.get(e.id);
			t && ot(t.destination) === ot(e) ? t.destination = e : (t?.abort?.abort(), this.states.set(e.id, {
				destination: e,
				items: [],
				loaded: !1,
				loading: !1,
				error: null,
				support: "unknown",
				excludedCount: 0,
				invalidCount: 0,
				nextPage: null,
				context: null,
				needsRefresh: !1,
				deletingId: null,
				notice: null,
				generation: 0,
				abort: null,
				cursors: /* @__PURE__ */ new Set(),
				deleteDispatched: !1,
				registrationDispatched: !1,
				localSnapshot: null
			}));
		}
		this.selectedId && n.has(this.selectedId) || (this.selectedId = this.destinations.find((e) => e.isDefault)?.id ?? this.destinations[0]?.id ?? null), this.emit(), this.selectedId && !this.states.get(this.selectedId)?.loaded && !this.states.get(this.selectedId)?.loading && !this.states.get(this.selectedId)?.registration && this.load();
	}
	select(e) {
		if (!this.busy && this.states.has(e) && e !== this.selectedId) {
			if (this.selectedId) {
				let e = this.states.get(this.selectedId);
				e?.abort?.abort(), e && (e.deletingId && e.deleteDispatched && (e.error = new H("unknownDelete"), st(e)), e.generation++, e.loading = !1, e.deletingId = null, e.deleteDispatched = !1, this.stopRegistration(e));
			}
			this.selectedId = e, this.emit(), this.states.get(e)?.loaded || this.load();
		}
	}
	begin(e) {
		e.abort?.abort();
		let t = new AbortController();
		e.abort = t;
		let n = ++e.generation, r = this.epoch, i = this.pubkey, a = { ...e.destination }, o = () => this.active && (this.deps.auth ?? R).value.isAuthenticated && (this.deps.auth ?? R).value.pubkey === i && this.epoch === r && this.pubkey === i && this.states.get(a.id) === e && e.generation === n && !t.signal.aborted, s = () => {
			if (!o()) throw le();
			he(this.deps.auth ?? R, i);
		};
		return {
			current: o,
			params: {
				destination: a,
				expectedPubkey: i,
				assertSession: s,
				signal: t.signal,
				fetch: this.deps.fetch ?? globalThis.fetch.bind(globalThis),
				authService: this.deps.createAuth?.({
					signal: t.signal,
					expectedPubkey: i
				}) ?? new ye({
					signal: t.signal,
					expectedPubkey: i
				}),
				onDeleteDispatched: () => {
					s(), e.deleteDispatched = !0;
				}
			}
		};
	}
	async load(e = !1) {
		let t = this.selectedId ? this.states.get(this.selectedId) : void 0;
		if (this.active && t && this.pubkey && !t.loading && !t.deletingId && t.registration?.phase !== "submitting" && !(t.error?.retryAt && Date.now() < t.error.retryAt)) {
			if (e && !t.needsRefresh && t.localSnapshot !== null) {
				let e = (this.deps.auth ?? R).value;
				if (!e.isAuthenticated || e.pubkey !== this.pubkey || !t.localSnapshot.length) return;
				t.error = null, t.notice = null, t.items.push(...t.localSnapshot.splice(0, 24)), this.emit();
			} else (!e || !t.loaded || t.needsRefresh || t.nextPage) && (e = e && !t.needsRefresh && !!t.nextPage, !e && t.localSnapshot !== null && st(t), t.notice = null, t.registration = null, await this.loadPage(t, e));
		}
	}
	async loadPage(e, t, n = this.begin(e)) {
		e.loading = !0, e.error = null, this.emit();
		try {
			let r = (this.deps.getAdapter ?? V)(e.destination.protocol);
			if (!r.listMediaPage || !r.deleteMedia) throw new H("unavailable");
			let i = await r.listMediaPage({
				...n.params,
				page: t ? e.nextPage : null,
				context: t ? e.context : null
			});
			if (n.params.assertSession(), !n.current()) return;
			if (i.localSnapshot && (e.destination.protocol !== "blossom" || i.nextPage)) throw new H("invalidResponse");
			let a = i.nextPage?.protocol === "blossom" ? i.nextPage.cursor : null;
			if (t && a && e.cursors.has(a)) throw new H("invalidResponse");
			if (t || e.cursors.clear(), a && e.cursors.add(a), i.localSnapshot) {
				let n = new Set(t ? e.items.map((e) => e.id) : []);
				e.localSnapshot = [...new Map(i.items.map((e) => [e.id, e])).values()].filter((e) => !n.has(e.id)), e.items = [...t ? e.items : [], ...e.localSnapshot.splice(0, 24)];
			} else {
				let n = t ? [...e.items, ...i.items] : i.items;
				e.items = [...new Map(n.map((e) => [e.id, e])).values()], e.localSnapshot = null;
			}
			e.excludedCount = (t ? e.excludedCount : 0) + i.excludedCount, e.invalidCount = (t ? e.invalidCount : 0) + i.invalidCount, e.nextPage = i.nextPage, e.context = i.context, e.loaded = !0, e.support = "supported", e.needsRefresh = !1;
		} catch (t) {
			if (!n.current()) return;
			e.error = be(t);
			let r = Ue(e.destination);
			r && [401, 403].includes(e.error.status ?? 0) && (e.registration = {
				target: r,
				phase: "offer",
				policy: null,
				error: null
			}), e.error.code === "unavailable" && (e.support = "unavailable"), e.error.code === "invalidResponse" && st(e);
		} finally {
			n.current() && (e.loading = !1, this.emit());
		}
	}
	stopRegistration(e) {
		e.registration && (e.registration.phase === "submitting" && e.registrationDispatched ? e.registration = {
			...e.registration,
			phase: "unknown",
			error: "unknownRegistration"
		} : [
			"loading",
			"ready",
			"submitting"
		].includes(e.registration.phase) && (e.registration = {
			...e.registration,
			phase: "offer",
			policy: null,
			error: null
		}), e.registrationDispatched = !1);
	}
	async openRegistration() {
		let e = this.selectedId ? this.states.get(this.selectedId) : void 0;
		if (!this.active || !e || e.loading || this.busy || !this.pubkey || e.registration?.phase !== "offer") return;
		let t = this.begin(e);
		e.registration = {
			...e.registration,
			phase: "loading",
			error: null
		}, this.emit();
		try {
			let n = await Ke(t.params);
			if (!t.current()) return;
			e.registration = {
				...e.registration,
				policy: n,
				phase: n ? "ready" : "external"
			};
		} catch {
			if (!t.current()) return;
			e.registration = {
				...e.registration,
				phase: "external"
			};
		} finally {
			t.current() && this.emit();
		}
	}
	cancelRegistration() {
		let e = this.selectedId ? this.states.get(this.selectedId) : void 0;
		e?.registration && (e.abort?.abort(), e.generation++, this.stopRegistration(e), this.emit());
	}
	async register(e) {
		let t = this.selectedId ? this.states.get(this.selectedId) : void 0;
		if (!this.active || !t || !this.pubkey || this.busy || t.loading || t.registration?.phase !== "ready" || !t.registration.policy) return;
		let n = this.begin(t), r = t.registration.policy;
		t.registration = {
			...t.registration,
			phase: "submitting",
			error: null
		}, t.registrationDispatched = !1, t.error = null, this.emit();
		try {
			let i = await Je(n.params, e, r, () => {
				n.params.assertSession(), t.registrationDispatched = !0;
			});
			if (!n.current()) return;
			if (t.registrationDispatched = !1, i === "external") t.registration = {
				...t.registration,
				phase: "external"
			};
			else {
				let e = t.registration.target;
				t.registration = null, st(t), await this.loadPage(t, !1, n), n.current() && t.registration && (t.registration = {
					target: e,
					phase: "external",
					policy: null,
					error: null
				});
			}
		} catch (e) {
			if (!n.current()) return;
			let r = e instanceof Q ? e.code : "serverError";
			t.registration = {
				...t.registration,
				phase: r === "unknownRegistration" ? "unknown" : "ready",
				error: r
			};
		} finally {
			n.current() && (t.registrationDispatched = !1, this.emit());
		}
	}
	async delete(e) {
		let t = this.selectedId ? this.states.get(this.selectedId) : void 0, n = t?.items.find((t) => t.id === e);
		if (!this.active || !t || !n?.deleteId || !t.context || t.loading || this.busy || !this.pubkey) return !1;
		let r = this.begin(t), i = n.deleteId.sha256, a = n.kind === "image" ? [...new Set(t.items.filter((e) => e.kind === "image" && e.deleteId?.sha256 === i && e.url).map((e) => e.url))] : [];
		t.deletingId = n.id, t.deleteDispatched = !1, t.error = null, t.notice = null, t.registration = null, this.emit();
		try {
			let e = (this.deps.getAdapter ?? V)(t.destination.protocol);
			if (!e.deleteMedia) throw new H("unavailable");
			if (await e.deleteMedia({
				...r.params,
				item: n,
				context: t.context
			}), r.current() && (t.deleteDispatched = !1, t.items = t.items.filter((e) => e.deleteId?.sha256 !== i), st(t), t.notice = "deleted", this.emit()), a.length) {
				let e = async () => {
					try {
						return await this.deps.evictImages(a);
					} catch {
						return !1;
					}
				}, n = await e();
				!n && r.current() && (n = await e()), !n && r.current() && (t.notice = "cacheCleanupFailed");
			}
			return r.current() && await this.loadPage(t, !1, r), !0;
		} catch (e) {
			return r.current() && (t.error = be(e), t.error.code === "unknownDelete" && st(t)), !1;
		} finally {
			r.current() && (t.deletingId = null, t.deleteDispatched = !1, this.emit());
		}
	}
};
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/useUploadMediaManagement.svelte.ts
function lt() {
	let e = M(E(at()));
	return {
		get value() {
			return D(e);
		},
		controller: new ct({
			loadDestinations: (e) => B.getAll(e),
			evictImages: Pe,
			onChange: (t) => {
				x(e, t, !0);
			}
		})
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/components/UploadedMediaTabContent.svelte
var ut = o("<p class=\"media-status svelte-hlt8mi\" role=\"status\"> </p>"), dt = o("<p class=\"media-status svelte-hlt8mi\" role=\"alert\"> </p> <!>", 1), ft = o("<option class=\"svelte-hlt8mi\"> </option>"), pt = o("<span class=\"svg-icon\" aria-hidden=\"true\"></span>"), mt = o("<div class=\"media-status nostr-build-help svelte-hlt8mi\" role=\"status\"><p class=\"svelte-hlt8mi\"> </p> <a href=\"https://account.nostr.build/\" target=\"_blank\" rel=\"noopener noreferrer\" tabindex=\"0\" class=\"svelte-hlt8mi\"> </a> <a href=\"https://nostr.build/delete/\" target=\"_blank\" rel=\"noopener noreferrer\" tabindex=\"0\" class=\"svelte-hlt8mi\"> </a></div>"), ht = o("<p class=\"media-status svelte-hlt8mi\"> </p>"), gt = o("<p class=\"media-status svelte-hlt8mi\"> </p> <!>", 1), _t = o("<time> </time>"), vt = o("<span class=\"svg-icon media-delete-icon svelte-hlt8mi\" aria-hidden=\"true\"></span>"), yt = o("<article><!> <!> <div class=\"media-overlay svelte-hlt8mi\"><div class=\"media-metadata svelte-hlt8mi\"><span> </span> <span><!></span></div> <!></div></article>"), bt = o("<div class=\"list-end-actions svelte-hlt8mi\"><!></div>"), xt = o("<!> <!> <!> <!> <div class=\"media-list svelte-hlt8mi\" tabindex=\"-1\"></div> <!>", 1), St = o("<div class=\"media-toolbar svelte-hlt8mi\"><select class=\"media-server-select svelte-hlt8mi\"></select> <!></div> <!>", 1), Ct = o("<p class=\"svelte-hlt8mi\"> </p>"), wt = o("<p class=\"diagnostic svelte-hlt8mi\"> </p>"), Tt = o("<!> <p class=\"svelte-hlt8mi\"> </p> <!> <!>", 1), Et = o("<div class=\"media-feedback svelte-hlt8mi\"><!></div>"), Dt = o("<p class=\"server-url svelte-hlt8mi\"> </p>"), Ot = o("<p class=\"svelte-hlt8mi\"> </p> <p class=\"server-url svelte-hlt8mi\"> </p> <!> <p class=\"server-url svelte-hlt8mi\"> </p>", 1), kt = o("<div class=\"uploaded-media-dialog uploaded-media-content svelte-hlt8mi\"><div class=\"media-management svelte-hlt8mi\"><!></div></div> <!> <!> <!>", 1), At = {
	hash: "svelte-hlt8mi",
	code: ".uploaded-media-content.svelte-hlt8mi {background:var(--dialog-bg);flex:1;min-height:0;overflow:auto;width:100%;}.media-management.svelte-hlt8mi {flex:none;width:100%;min-width:0;display:flex;flex-direction:column;}.uploaded-media-dialog button {height:auto;min-height:44px;max-width:100%;padding:8px 12px;}.uploaded-media-dialog button.image-open {display:block;width:100%;height:100%;min-height:0;max-width:none;margin:0;padding:0;border:none;background:transparent;cursor:pointer;}p.svelte-hlt8mi {margin:0;}.media-toolbar.svelte-hlt8mi {display:grid;grid-template-columns:minmax(0, 1fr) 44px;gap:4px;padding:8px;}.media-status.svelte-hlt8mi {margin:8px 12px;}.nostr-build-help.svelte-hlt8mi {display:flex;flex-direction:column;gap:4px;min-width:0;padding:12px;border:1px solid var(--border);border-radius:6px;overflow-wrap:anywhere;}.nostr-build-help.svelte-hlt8mi a:where(.svelte-hlt8mi) {display:flex;align-items:center;align-self:flex-start;min-height:44px;max-width:100%;}.media-feedback.svelte-hlt8mi {overflow-wrap:anywhere;}.media-server-select.svelte-hlt8mi {width:100%;min-width:0;min-height:44px;max-width:100%;padding:8px 32px 8px 10px;border:1px solid var(--border);border-radius:6px;background:var(--dialog-bg);color:var(--text);font:inherit;}.media-server-select.svelte-hlt8mi option:where(.svelte-hlt8mi) {background:var(--dialog-bg);color:var(--text);}.list-end-actions.svelte-hlt8mi {display:flex;width:100%;padding:10px;box-sizing:border-box;}.uploaded-media-dialog button.media-load-more-button {width:100%;}.uploaded-media-dialog button.media-refresh-button {width:44px;height:44px;padding:0;background:transparent;border:none;}.uploaded-media-dialog button.media-delete-button {flex:none;padding:0;background:transparent;border:none;color:white;--text: white;width:44px;min-width:44px;max-width:44px;height:44px;min-height:44px;max-height:44px;}.uploaded-media-dialog button.media-delete-button:hover:not(:disabled) {background:rgb(255 255 255 / 15%);color:white;}.uploaded-media-dialog button.media-delete-button:hover:not(:disabled) .svg-icon {background-color:white;}.uploaded-media-dialog button.media-delete-button:focus-visible {outline:2px solid white;outline-offset:-2px;}.media-delete-icon.svelte-hlt8mi {width:24px;height:24px;--svg: currentColor;}.server-url.svelte-hlt8mi, .diagnostic.svelte-hlt8mi {overflow-wrap:anywhere;font-size:.875rem;}.media-list.svelte-hlt8mi {display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));gap:2px;}article.svelte-hlt8mi {position:relative;min-width:0;align-self:start;}.uploaded-media-dialog button.media-copy-button {position:absolute;top:4px;right:4px;z-index:1;width:44px;min-width:44px;height:44px;min-height:44px;padding:0;color:white;--text: white;}.uploaded-media-dialog button.media-copy-button:hover:not(:disabled) .svg-icon {background-color:white;}.video-active.svelte-hlt8mi button.media-copy-button {top:52px;}.media-overlay.svelte-hlt8mi {position:absolute;inset:auto 0 0;display:flex;align-items:flex-end;justify-content:space-between;gap:4px;padding:16px 4px 4px 8px;color:white;background:linear-gradient(transparent, rgb(0 0 0 / 70%));pointer-events:none;}.media-metadata.svelte-hlt8mi {min-width:0;align-self:center;display:flex;flex-direction:column;font-size:.6875rem;line-height:1.5;overflow-wrap:anywhere;text-shadow:0 1px 2px rgb(0 0 0 / 70%);}.media-overlay.svelte-hlt8mi button {pointer-events:auto;}\n    /* Keep native video playback controls available beneath the overlay. */.video-active.svelte-hlt8mi .media-overlay:where(.svelte-hlt8mi) {bottom:56px;}"
};
function jt(a, o) {
	n(o, !0), e(a, At);
	let c = () => ie(fe, "$_", h), [h, y] = ne(), S = re(o, "onBusyChange", 3, () => void 0), T = M(!1), oe = M(!1), ce = M(!1), L = P(() => o.show && !D(ce));
	function le() {
		x(ce, !1), B.controller.activate();
	}
	function ue() {
		x(ce, !0), J++, se(Y), x(U, null), x(W, null), x(Ie, !0), Ke(), B.controller.suspend();
	}
	function de() {
		return B.controller.busy;
	}
	function he() {
		return D(q);
	}
	let B = lt(), _e = Oe("icons/delete_forever_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"), ve = Oe("icons/refresh_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"), ye = Oe("icons/file_copy_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"), V = P(() => B.value.current), be = P(() => !!D(V) && /^https?:\/\/nostpic\.com(?::\d+)?(?:\/|$)/i.test(D(V).destination.serverUrl));
	function H(e) {
		try {
			let t = new URL(e);
			return t.origin === "https://nostr.build" && !t.username && !t.password && !t.search && !t.hash && ["/", "/api/v2/nip96/upload"].includes(t.pathname.replace(/\/$/, "") || "/");
		} catch {
			return !1;
		}
	}
	let xe = P(() => D(V)?.destination.protocol === "nip96" && H(D(V).destination.serverUrl) && D(V).error?.code === "unavailable" && D(V).error.status === 405), Se = M(null), U = M(null), Te = M(null), De = null, W = M(null), G = M(E([])), K = M(-1), q = M(!1), je = M(null), Me = M(void 0), J = 0, Y = M(0), Pe = null, Fe = M(null), Ie = M(!1), Le = null, X = P(() => D(V)?.notice ?? null), Re = P(() => !!D(V)?.deletingId), ze = P(() => D(V)?.registration?.phase === "submitting"), Z = P(() => [
		R.value.pubkey,
		D(V)?.destination.id,
		D(V)?.destination.protocol,
		D(V)?.destination.serverUrl,
		D(V)?.destination.resolvedUploadUrl,
		D(V)?.destination.nip96ServerUrl,
		D(V)?.destination.nip96UrlMode
	].join("\n")), Q = P(() => D(L) && !D(U) && !D(Re) && !D(xe) && !!(D(V)?.error && !D(V).registration || D(V)?.loading && D(V).loaded || D(X) && !D(Ie)));
	_(() => {
		let e = D(X), t = D(Re), n = D(Z), r = Le !== null && Le !== n;
		Le = n;
		let i = r || !C(() => D(L));
		if (x(Ie, i, !0), !e || t || i) return;
		let a = setTimeout(() => {
			x(Ie, !0);
		}, 3500);
		return () => clearTimeout(a);
	}), _(() => {
		let e = o.show;
		C(() => e ? le() : ue());
	});
	function Ve(e) {
		let t = [
			"B",
			"KB",
			"MB",
			"GB",
			"TB"
		], n = e, r = 0;
		for (; n >= 1024 && r < t.length - 1;) n /= 1024, r++;
		return `${n.toLocaleString(void 0, { maximumFractionDigits: r === 0 ? 0 : 1 })} ${t[r]}`;
	}
	function He(e) {
		return (/* @__PURE__ */ new Date(e * 1e3)).toLocaleString(void 0, {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit"
		});
	}
	function Ue() {
		se(Y), Pe = null, x(U, null), x(W, null), Ke(), B.controller.invalidate();
	}
	_(() => {
		let e = D(L), t = R.value, n = Ee.value.destinations;
		C(() => {
			if (!e) return;
			B.controller.activate();
			let r = t.isAuthenticated ? t.pubkey : null;
			n.length ? B.controller.configure(r, n) : B.controller.configureSaved(r), x(T, !0);
		});
	}), _(() => {
		D(L) && !D(oe) && o.onInitialReady && D(T) && !B.value.configuring && (!R.value.isAuthenticated || B.value.configurationError || B.value.destinations.length === 0 || D(V)?.loaded || D(V)?.items.length || D(V)?.error) && (x(oe, !0), o.onInitialReady());
	}), _(() => {
		if (!D(L) || D(Se) !== null) return;
		let e = ++J;
		Ne().then((t) => {
			e === J && x(Se, t, !0);
		});
	}), _(() => {
		let e = B.value.selectedId, t = `${R.value.pubkey}\n${e}\n${D(V)?.destination.protocol}\n${D(V)?.destination.serverUrl}\n${D(V)?.context?.endpoint}`;
		C(() => {
			t !== Pe && (Pe = t, se(Y), x(U, null), x(W, null), Ke());
		});
	}), _(() => {
		let e = D(V);
		C(() => {
			D(U) && (e?.destination.serverUrl !== D(U).serverUrl || e?.context?.endpoint !== D(Te) || !e.deletingId && !e.items.some((e) => e.id === D(U)?.id)) && x(U, null), D(W) && !e?.items.some((e) => e.id === D(W)) && x(W, null);
			let t = D(G)[D(K)]?.id;
			D(q) && t && !e?.items.some((e) => e.id === t && e.kind === "image") && Ke();
		});
	}), _(() => {
		S()(!!D(V)?.deletingId || D(ze));
	}), ae(() => {
		J++, Ue();
	});
	function $() {
		let e = D(Y), t = De;
		x(U, null), k().then(() => e === D(Y) && t?.isConnected && t.focus({ preventScroll: !0 }));
	}
	async function We() {
		let e = D(U), t = D(Y), n = De;
		!e || D(V)?.destination.serverUrl !== e.serverUrl || D(V).context?.endpoint !== D(Te) || !D(V).items.some((t) => t.id === e.id && t.deleteId?.sha256 === e.deleteId?.sha256) ? $() : (await B.controller.delete(e.id), t === D(Y) && (x(U, null), await k(), t === D(Y) && (n?.isConnected ? n.focus({ preventScroll: !0 }) : D(Me)?.focus({ preventScroll: !0 }))));
	}
	async function Ge(e) {
		let t = D(Z);
		await B.controller.register(e), await k(), D(L) && t === D(Z) && !D(V)?.registration && D(Me)?.focus({ preventScroll: !0 });
	}
	function Ke() {
		x(q, !1), x(G, [], !0), x(K, -1), x(je, null);
	}
	function qe(e) {
		return Ae({
			url: e.url,
			serverUrl: e.serverUrl,
			cacheSupported: D(Se),
			basePath: "./",
			currentOrigin: window.location.origin
		});
	}
	function Je(e, t) {
		return t.stopPropagation(), e.url ? ge(e.url, "URL", navigator, window) : !1;
	}
	function Ye(e, t) {
		let n = (D(V)?.items ?? []).flatMap((e) => {
			if (e.kind !== "image") return [];
			let t = qe(e);
			return t ? [{
				id: e.id,
				src: t,
				alt: c()("uploadedMedia.image"),
				type: "image"
			}] : [];
		}), r = n.findIndex((t) => t.id === e.id);
		r < 0 || (x(G, n, !0), x(K, r, !0), x(je, t, !0), x(q, !0));
	}
	var Xe = {
		activate: le,
		suspend: ue,
		isBusy: de,
		isFullscreen: he,
		invalidateSession: Ue
	}, Ze = r(), Qe = v(Ze), $e = (e) => {
		var n = kt(), a = v(n), f = j(a), h = j(f), _ = (e) => {
			var t = ut(), n = b(t, !0);
			A((e) => p(n, e), [() => c()("uploadedMedia.errors.authentication")]), m(e, t);
		}, y = (e) => {
			pe(e, {
				showLoader: !0,
				text: !0
			});
		}, S = (e) => {
			var t = dt(), n = v(t), r = b(n, !0), i = O(n, 2);
			z(i, {
				onClick: () => B.controller.configureSaved(R.value.pubkey),
				children: (e, t) => {
					w();
					var n = g();
					A((e) => p(n, e), [() => c()("uploadedMedia.refresh")]), m(e, n);
				},
				$$slots: { default: !0 }
			}), A((e) => p(r, e), [() => c()("uploadedMedia.errors.invalidDestination")]), m(e, t);
		}, C = (e) => {
			var t = ut(), n = b(t, !0);
			A((e) => p(n, e), [() => c()("uploadedMedia.noServers")]), m(e, t);
		}, T = (e) => {
			var n = St(), a = v(n), f = j(a);
			i(f, 21, () => B.value.destinations, (e) => e.id, (e, t) => {
				var n = ft(), r = b(n, !0), i = {};
				A(() => {
					p(r, D(t).name), i !== (i = D(t).id) && (n.value = (n.__value = i) ?? "");
				}), m(e, n);
			}), s(f);
			var h;
			u(f);
			var _ = O(f, 2), y = (e) => {
				{
					let t = P(() => c()("uploadedMedia.refresh")), n = P(() => c()("uploadedMedia.refresh")), r = P(() => D(V).loading || !!D(V).deletingId || D(ze));
					z(e, {
						shape: "square",
						contentLayout: "icon",
						className: "media-refresh-button",
						get ariaLabel() {
							return D(t);
						},
						get title() {
							return D(n);
						},
						onClick: () => {
							x(W, null), Ke(), B.controller.load();
						},
						get disabled() {
							return D(r);
						},
						children: (e, t) => {
							var n = pt();
							let r;
							A(() => r = N(n, "", r, { "mask-image": `url("${ve}")` })), m(e, n);
						},
						$$slots: { default: !0 }
					});
				}
			};
			I(_, (e) => {
				D(V) && e(y);
			}), s(a), te(a, (e) => x(Fe, e), () => D(Fe));
			var S = O(a, 2), C = (e) => {
				var t = xt(), n = v(t), a = (e) => {
					var t = mt(), n = j(t), r = b(n, !0), i = O(n, 2), a = b(i, !0), o = O(i, 2), l = b(o, !0);
					s(t), A((e, t, n) => {
						p(r, e), p(a, t), p(l, n);
					}, [
						() => c()("uploadedMedia.nostrBuild.unavailable"),
						() => c()("uploadedMedia.nostrBuild.account"),
						() => c()("uploadedMedia.nostrBuild.deleteFree")
					]), m(e, t);
				};
				I(n, (e) => {
					D(xe) && e(a);
				});
				var u = O(n, 2), f = (e) => {
					var t = r(), n = v(t);
					l(n, () => D(Z), (e) => {
						{
							let t = P(() => we.value.displayName || we.value.name || "");
							it(e, {
								get registration() {
									return D(V).registration;
								},
								get initialUsername() {
									return D(t);
								},
								onOpen: () => B.controller.openRegistration(),
								onCancel: () => B.controller.cancelRegistration(),
								onRegister: Ge,
								onRefresh: async () => {
									let e = D(Z);
									await B.controller.load(), await k(), D(L) && e === D(Z) && D(Fe)?.querySelector("button")?.focus({ preventScroll: !0 });
								}
							});
						}
					}), m(e, t);
				};
				I(u, (e) => {
					D(V).registration && e(f);
				});
				var h = O(u, 2), ee = (e) => {
					pe(e, {
						showLoader: !0,
						text: !0
					});
				};
				I(h, (e) => {
					D(V).loading && !D(V).loaded && (!o.onInitialReady || D(oe)) && e(ee);
				});
				var _ = O(h, 2), y = (e) => {
					var t = gt(), n = v(t), r = b(n, !0), i = O(n, 2), a = (e) => {
						var t = ht(), n = b(t, !0);
						A((e) => p(n, e), [() => c()("uploadedMedia.moreUnseen")]), m(e, t);
					};
					I(i, (e) => {
						D(V).hasMore && e(a);
					}), A((e) => p(r, e), [() => c()("uploadedMedia.empty")]), m(e, t);
				};
				I(_, (e) => {
					D(V).loaded && D(V).items.length === 0 && e(y);
				});
				var S = O(_, 2);
				i(S, 21, () => D(V).items, (e) => e.id, (e, t) => {
					var n = yt();
					let r;
					var i = j(n);
					{
						let e = P(() => D(W) === D(t).id);
						Be(i, {
							get item() {
								return D(t);
							},
							get cacheSupported() {
								return D(Se);
							},
							get active() {
								return D(e);
							},
							onOpenImage: (e) => Ye(D(t), e),
							onOpenVideo: () => {
								x(W, D(t).id, !0);
							},
							onCloseVideo: () => {
								x(W, null);
							}
						});
					}
					var a = O(i, 2);
					{
						let e = P(() => c()(`${D(t).kind === "video" ? "videoContextMenu" : "imageContextMenu"}.copyUrl`)), n = P(() => c()(`${D(t).kind === "video" ? "videoContextMenu" : "imageContextMenu"}.copyUrl`)), r = P(() => c()(`${D(t).kind === "video" ? "videoContextMenu" : "imageContextMenu"}.copySuccess`)), i = P(() => !D(t).url);
						z(a, {
							variant: "copy",
							shape: "circle",
							contentLayout: "icon",
							className: "media-copy-button",
							get ariaLabel() {
								return D(e);
							},
							get title() {
								return D(n);
							},
							get floatingMessage() {
								return D(r);
							},
							get disabled() {
								return D(i);
							},
							onClick: (e) => Je(D(t), e),
							children: (e, t) => {
								var n = pt();
								let r;
								A(() => r = N(n, "", r, { "mask-image": `url("${ye}")` })), m(e, n);
							},
							$$slots: { default: !0 }
						});
					}
					var o = O(a, 2), l = j(o), u = j(l), f = b(u, !0), h = O(u, 2), ee = j(h), _ = (e) => {
						var n = _t(), r = b(n, !0);
						A((e, t) => {
							F(n, "datetime", e), p(r, t);
						}, [() => (/* @__PURE__ */ new Date(D(t).uploadedAt * 1e3)).toISOString(), () => He(D(t).uploadedAt)]), m(e, n);
					}, v = (e) => {
						var t = g();
						A((e) => p(t, e), [() => c()("uploadedMedia.unknown")]), m(e, t);
					};
					I(ee, (e) => {
						D(t).uploadedAt === void 0 ? e(v, -1) : e(_);
					}), s(h), s(l);
					var y = O(l, 2);
					{
						let e = P(() => D(V).deletingId === D(t).id ? c()("uploadedMedia.deleting") : c()("uploadedMedia.delete")), n = P(() => D(V).deletingId === D(t).id ? c()("uploadedMedia.deleting") : c()("uploadedMedia.delete")), r = P(() => !D(t).deleteId || D(V).loading || !!D(V).deletingId || D(ze));
						z(y, {
							shape: "square",
							contentLayout: "icon",
							className: "media-delete-button",
							get ariaLabel() {
								return D(e);
							},
							get title() {
								return D(n);
							},
							get disabled() {
								return D(r);
							},
							onClick: (e) => {
								De = e.currentTarget, x(Te, D(V)?.context?.endpoint ?? null, !0), x(U, D(t), !0);
							},
							children: (e, t) => {
								var n = vt();
								let r;
								A(() => r = N(n, "", r, { "mask-image": `url("${_e}")` })), m(e, n);
							},
							$$slots: { default: !0 }
						});
					}
					s(o), s(n), A((e) => {
						F(n, "data-media-kind", D(t).kind), r = d(n, 1, "svelte-hlt8mi", null, r, { "video-active": D(t).kind === "video" && D(W) === D(t).id }), p(f, e);
					}, [() => D(t).size === void 0 ? c()("uploadedMedia.unknown") : Ve(D(t).size)]), m(e, n);
				}), s(S), te(S, (e) => x(Me, e), () => D(Me));
				var C = O(S, 2), T = (e) => {
					var t = bt(), n = j(t);
					{
						let e = P(() => D(V).loading || !!D(V).deletingId || D(ze));
						z(n, {
							className: "media-load-more-button",
							onClick: () => B.controller.load(!0),
							get disabled() {
								return D(e);
							},
							children: (e, t) => {
								w();
								var n = g();
								A((e) => p(n, e), [() => c()("uploadedMedia.loadMore")]), m(e, n);
							},
							$$slots: { default: !0 }
						});
					}
					s(t), m(e, t);
				};
				I(C, (e) => {
					D(V).hasMore && !D(V).needsRefresh && e(T);
				}), m(e, t);
			};
			I(S, (e) => {
				D(V) && e(C);
			}), A((e) => {
				F(f, "aria-label", e), f.disabled = !!D(V)?.deletingId || D(ze), h !== (h = B.value.selectedId ?? "") && (f.value = (f.__value = h) ?? "", t(f, h));
			}, [() => c()("uploadedMedia.server")]), ee("change", f, (e) => B.controller.select(e.currentTarget.value)), m(e, n);
		};
		I(h, (e) => {
			R.value.isAuthenticated ? B.value.configuring ? e(y, 1) : B.value.configurationError ? e(S, 2) : B.value.destinations.length === 0 ? e(C, 3) : e(T, -1) : e(_);
		}), s(f), s(a);
		var E = O(a, 2);
		{
			let e = P(() => !D(V)?.loading || !!D(V)?.error), t = P(() => D(V)?.error ? "alert" : "status");
			me(E, {
				get show() {
					return D(Q);
				},
				variant: "anchor-bottom-right",
				get anchor() {
					return D(Fe);
				},
				anchorRightOffset: 16,
				get showInfoIcon() {
					return D(e);
				},
				get role() {
					return D(t);
				},
				children: (e, t) => {
					var n = Et(), r = j(n), i = (e) => {
						var t = Tt(), n = v(t), r = (e) => {
							var t = Ct(), n = b(t, !0);
							A((e) => p(n, e), [() => c()(`uploadedMedia.${D(X)}`)]), m(e, t);
						};
						I(n, (e) => {
							D(X) && e(r);
						});
						var i = O(n, 2), a = b(i, !0), o = O(i, 2), s = (e) => {
							var t = Ct(), n = b(t, !0);
							A((e) => p(n, e), [() => c()("uploadedMedia.retryAfter", { values: { time: new Date(D(V).error.retryAt).toLocaleTimeString() } })]), m(e, t);
						};
						I(o, (e) => {
							D(V).error.retryAt && e(s);
						});
						var l = O(o, 2), u = (e) => {
							var t = wt(), n = b(t, !0);
							A(() => p(n, D(V).error.diagnostic)), m(e, t);
						};
						I(l, (e) => {
							D(V).error.diagnostic && e(u);
						}), A((e) => p(a, e), [() => c()(`uploadedMedia.errors.${D(V).error.code === "invalidResponse" && D(be) && !D(V).loaded ? "unavailable" : D(V).error.code}`)]), m(e, t);
					}, a = (e) => {
						pe(e, {
							showLoader: !0,
							text: !0,
							loaderSize: 30
						});
					}, o = (e) => {
						var t = Ct(), n = b(t, !0);
						A((e) => p(n, e), [() => c()(`uploadedMedia.${D(X)}`)]), m(e, t);
					};
					I(r, (e) => {
						D(V)?.error ? e(i) : D(V)?.loading ? e(a, 1) : D(X) && e(o, 2);
					}), s(n), m(e, n);
				},
				$$slots: { default: !0 }
			});
		}
		var ne = O(E, 2);
		l(ne, () => D(Y), (e) => {
			{
				let t = P(() => !!D(U)), n = P(() => c()("uploadedMedia.delete")), i = P(() => c()("uploadedMedia.confirmDescription")), a = P(() => c()("uploadedMedia.delete"));
				ke(e, {
					get open() {
						return D(t);
					},
					onOpenChange: (e) => {
						e || $();
					},
					get title() {
						return D(n);
					},
					get description() {
						return D(i);
					},
					get confirmLabel() {
						return D(a);
					},
					onConfirm: We,
					onCancel: $,
					preventCloseWhileConfirming: !0,
					showConfirmSpinner: !0,
					closeOnConfirm: !1,
					children: (e, t) => {
						var n = r(), i = v(n), a = (e) => {
							var t = Ot(), n = v(t), r = b(n, !0), i = O(n, 2), a = b(i, !0), o = O(i, 2), s = (e) => {
								var t = Dt(), n = b(t, !0);
								A(() => p(n, D(U).deleteId.sha256)), m(e, t);
							};
							I(o, (e) => {
								D(U).deleteId && e(s);
							});
							var l = O(o, 2), u = b(l, !0);
							A((e, t) => {
								p(r, e), p(a, D(Te) ?? D(U).serverUrl), p(u, t);
							}, [() => c()(`uploadedMedia.${D(U).kind}`), () => D(U).url ?? c()("uploadedMedia.previewUnavailable")]), m(e, t);
						};
						I(i, (e) => {
							D(U) && e(a);
						}), m(e, n);
					},
					$$slots: { default: !0 }
				});
			}
		});
		var re = O(ne, 2);
		{
			let e = P(() => D(G)[D(K)]?.src ?? ""), t = P(() => D(G)[D(K)]?.alt ?? "");
			Ce(re, {
				get src() {
					return D(e);
				},
				get alt() {
					return D(t);
				},
				onClose: Ke,
				get mediaList() {
					return D(G);
				},
				get currentIndex() {
					return D(K);
				},
				onNavigate: (e) => {
					x(K, e, !0);
				},
				get openingFocusOrigin() {
					return D(je);
				},
				get show() {
					return D(q);
				},
				set show(e) {
					x(q, e, !0);
				}
			});
		}
		m(e, n);
	};
	I(Qe, (e) => {
		D(L) && e($e);
	}), m(a, Ze);
	var et = f(Xe);
	return y(), et;
}
h(["change"]);
export { jt as default };
