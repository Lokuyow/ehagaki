import { $ as e, A as t, B as n, C as r, Dt as i, E as a, Et as o, G as s, H as c, K as l, L as u, Mt as d, Nt as f, Q as p, St as m, T as h, X as g, Y as _, Z as v, _t as y, at as b, b as x, bt as S, ct as C, dt as w, f as ee, ft as T, h as E, ht as D, it as O, j as k, k as te, lt as A, mt as j, o as M, pt as N, q as P, r as F, rt as I, s as ne, t as re, tt as L, w as ie, y as ae, yt as R, z as oe } from "./index-client-DEFG3Gqk.js";
import { n as se } from "./appRuntimeEnvironment-Bzv9wJOh.js";
import { a as z } from "./esm-N9TTQGcl.js";
import { n as ce, r as le, t as ue } from "./uploadOperation-BVOBq-hD.js";
import { Z as de, t as fe } from "./LoadingPlaceholder-YrD8D_td.js";
import { r as B } from "./authStore.svelte-DkMZvUSe.js";
import { i as pe } from "./signedEventResultValidator-7WV1YEyT.js";
import { a as me } from "./clipboardUtils-CSGkJuUA.js";
import { n as he, t as V } from "./Button-Cqrg0_jX.js";
import { c as H, i as ge, l as U, m as _e, o as W, p as ve, r as ye, u as be } from "./resolveCurrentUploadDestination-CMXZTG_T.js";
import { o as xe } from "./fileUtils-nRfpyUX-.js";
import { t as Se } from "./appAssetUrl-B5sJnZLv.js";
import { t as G } from "./inViewportAction.svelte-7xfM4moj.js";
import { J as Ce, Z as we, at as Te, it as Ee, ot as K, r as De, st as Oe } from "./App-CW2Ynbk9.js";
import { n as ke } from "./listEdgeObserver-z6l0zYDS.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/uploadMediaImageUrl.ts
function Ae(e, t, n) {
	try {
		let r = _e({
			rawUrl: e,
			trustedUploadUrl: ve(t),
			pageProtocol: n
		}).url;
		return new URL(r).toString();
	} catch {
		return null;
	}
}
function q(e) {
	let t = new URL(e.currentOrigin), n = Ae(e.url, e.serverUrl, t.protocol);
	if (!n) return null;
	let r = new URL(`${e.basePath.endsWith("/") ? e.basePath : `${e.basePath}/`}__ehagaki-image/upload-media`, t);
	return r.searchParams.set("url", n), r.searchParams.set("server", e.serverUrl), r.toString();
}
function je(e) {
	return !e.url || e.cacheSupported === null ? null : e.cacheSupported ? q({
		url: e.url,
		serverUrl: e.serverUrl,
		basePath: e.basePath,
		currentOrigin: e.currentOrigin
	}) : e.url;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/uploadMediaImageCacheClient.ts
function J() {
	let e = se();
	return e.serviceWorkerEnabled ? e.window?.navigator.serviceWorker?.controller ?? null : null;
}
async function Me(e, t) {
	let n = await xe(e, t, 1500);
	return n.status === "reply" ? n.data : null;
}
function Ne(e) {
	return typeof e == "object" && !!e;
}
var Pe = null, Y = null;
async function Fe() {
	let e = J();
	return e ? (e === Pe && Y || (Pe = e, Y = Me(e, { type: K }).then((e) => Ne(e) && e.version === 1 && e.supported === !0)), await Y) : (Pe = null, Y = null, !1);
}
async function Ie(e) {
	if (!e.length) return !0;
	let t = J();
	if (!t) return !0;
	let n = [...new Set(e)], r = !0;
	for (let e = 0; e < n.length; e += Ee.maxEntries) {
		let i = await Me(t, {
			type: Te,
			urls: n.slice(e, e + Ee.maxEntries)
		});
		r = Ne(i) && i.version === 1 && i.success === !0 && r;
	}
	return r;
}
// D:/ドキュメント/GitHub/ehagaki/src/components/UploadedMediaPreview.svelte
var X = P("<!> <!>", 1), Le = P("<button type=\"button\" class=\"image-open\"><img alt=\"\" referrerpolicy=\"no-referrer\" class=\"svelte-1gq8ela\"/></button>"), Re = P("<span class=\"svg-icon\" aria-hidden=\"true\"></span>"), ze = P("<video controls=\"\" playsinline=\"\" preload=\"metadata\" class=\"svelte-1gq8ela\"><track kind=\"captions\"/></video> <!>", 3), Be = P("<div class=\"video-placeholder svelte-1gq8ela\"><!></div>"), Ve = P("<div><!></div>"), He = {
	hash: "svelte-1gq8ela",
	code: ".preview.svelte-1gq8ela {position:relative;width:100%;min-width:0;aspect-ratio:1;}\n    /* Reserve room for close, copy, delete and native playback controls. */.preview-active.svelte-1gq8ela {min-height:204px;}.preview-empty.svelte-1gq8ela {display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;}img.svelte-1gq8ela, video.svelte-1gq8ela {display:block;width:100%;height:100%;}img.svelte-1gq8ela {object-fit:cover;}video.svelte-1gq8ela {position:absolute;inset:0;object-fit:contain;}video.svelte-1gq8ela, .video-placeholder.svelte-1gq8ela {background:#181818;}.video-placeholder.svelte-1gq8ela {width:100%;height:100%;display:grid;place-items:center;}.preview.svelte-1gq8ela button.image-open {display:block;width:100%;height:100%;min-width:0;min-height:0;max-width:none;margin:0;padding:0;border:0;background:transparent;cursor:pointer;}.preview.svelte-1gq8ela button.media-video-button {padding:0;width:44px;height:44px;min-width:44px;color:white;}.preview.svelte-1gq8ela button.media-video-button:hover:not(:disabled) .svg-icon {background-color:white;}.preview.svelte-1gq8ela button.video-close {position:absolute;top:4px;right:4px;}.preview.svelte-1gq8ela button.video-open {width:56px;height:56px;}"
};
function Ue(r, u) {
	i(u, !0), k(r, He);
	let _ = () => ne(de, "$_", v), [v, b] = M(), S = Se("icons/play_arrow_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"), E = R(!1), D = R(!1), O = R(void 0), te = m(() => je({
		url: u.item.url,
		serverUrl: u.item.serverUrl,
		cacheSupported: u.cacheSupported,
		basePath: "./",
		currentOrigin: window.location.origin
	}));
	function A(e) {
		return { destroy() {
			e.pause(), e.removeAttribute("src"), e.load();
		} };
	}
	async function P() {
		y(D, !0), u.item.url && u.cacheSupported && await Ie([u.item.url]);
	}
	re(() => {
		I(O)?.pause();
	});
	var F = Ve();
	let ie;
	var ae = w(F), oe = (e) => {
		{
			let t = m(() => _()("uploadedMedia.previewUnavailable"));
			fe(e, { get text() {
				return I(t);
			} });
		}
	}, se = (t) => {
		var r = l(), i = T(r), a = (e) => {
			var t = X(), n = T(t);
			{
				let e = m(() => _()("uploadedMedia.previewUnavailable"));
				fe(n, { get text() {
					return I(e);
				} });
			}
			var r = j(n, 2);
			V(r, {
				onClick: () => {
					y(D, !1);
				},
				children: (e, t) => {
					d();
					var n = g();
					C((e) => c(n, e), [() => _()("uploadedMedia.retry")]), s(e, n);
				},
				$$slots: { default: !0 }
			}), s(e, t);
		}, o = (t) => {
			var n = Le(), r = N(n);
			C((e) => {
				x(n, "aria-label", e), x(r, "src", I(te));
			}, [() => _()("uploadedMedia.openImage")]), p("click", n, (e) => {
				e.currentTarget instanceof HTMLElement && u.onOpenImage?.(e.currentTarget);
			}), e("error", r, P), L(r), s(t, n);
		};
		n(i, (e) => {
			I(D) ? e(a) : I(E) && u.cacheSupported !== null && I(te) && e(o, 1);
		}), s(t, r);
	}, z = (n) => {
		var r = ze(), i = T(r);
		ee(i, (e) => y(O, e), () => I(O)), t(i, (e) => A?.(e));
		var a = j(i, 2);
		{
			let e = m(() => _()("uploadedMedia.closeVideo")), t = m(() => _()("uploadedMedia.closeVideo"));
			V(a, {
				variant: "close",
				shape: "circle",
				contentLayout: "icon",
				className: "media-video-button video-close",
				get ariaLabel() {
					return I(e);
				},
				get title() {
					return I(t);
				},
				get onClick() {
					return u.onCloseVideo;
				},
				children: (e, t) => {
					var n = Re();
					s(e, n);
				},
				$$slots: { default: !0 }
			});
		}
		C(() => x(i, "src", u.item.url)), e("ended", i, function(...e) {
			u.onCloseVideo?.apply(this, e);
		}), s(n, r);
	}, ce = (e) => {
		var t = Be(), n = w(t);
		{
			let e = m(() => _()("uploadedMedia.openVideo")), t = m(() => _()("uploadedMedia.openVideo"));
			V(n, {
				variant: "close",
				shape: "circle",
				contentLayout: "icon",
				className: "media-video-button video-open",
				get ariaLabel() {
					return I(e);
				},
				get title() {
					return I(t);
				},
				get onClick() {
					return u.onOpenVideo;
				},
				children: (e, t) => {
					var n = Re();
					let r;
					C(() => r = h(n, "", r, { "mask-image": `url("${S}")` })), s(e, n);
				},
				$$slots: { default: !0 }
			});
		}
		f(t), s(e, t);
	};
	n(ae, (e) => {
		u.item.url ? u.item.kind === "image" ? e(se, 1) : u.active ? e(z, 2) : e(ce, -1) : e(oe);
	}), f(F), t(F, (e, t) => G?.(e, t), () => ({
		enabled: !0,
		rootMargin: "200px",
		onEnterView: () => {
			y(E, !0);
		}
	})), C(() => ie = a(F, 1, "preview svelte-1gq8ela", null, ie, {
		"preview-active": u.item.kind === "video" && u.active,
		"preview-empty": !u.item.url || u.item.kind === "image" && (I(D) || !I(E) || u.cacheSupported === null)
	})), s(r, F), o(), b();
}
v(["click"]);
// D:/ドキュメント/GitHub/ehagaki/src/lib/upload/uploadServerRegistration.ts
var Z = class extends Error {
	code;
	constructor(e) {
		super(e), this.code = e;
	}
}, Q = [{
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
function We(e) {
	try {
		let t = new URL(e);
		return t.username || t.password || t.search || t.hash ? null : t.toString().replace(/\/$/, "");
	} catch {
		return null;
	}
}
function Ge(e) {
	if (e.protocol !== "nip96") return null;
	let t = Q.find((t) => t.mediaUrls.includes(We(e.serverUrl)) && (!e.resolvedUploadUrl || t.mediaUrls.includes(We(e.resolvedUploadUrl))) && (!e.nip96ServerUrl || t.discoveryUrls.includes(We(e.nip96ServerUrl))));
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
function Ke(e) {
	e.assertSession(), le(e.signal);
	let t = Ge(e.destination);
	if (!t) throw new Z("serverError");
	return t;
}
async function qe(e, t, n) {
	let r = new AbortController(), i = () => r.abort();
	e.signal?.addEventListener("abort", i, { once: !0 }), e.signal?.aborted && r.abort();
	let a = setTimeout(i, 2e4);
	try {
		e.assertSession();
		let i = await ue(e.fetch(t, {
			...n,
			signal: r.signal,
			credentials: "omit",
			redirect: "error",
			cache: "no-store",
			referrerPolicy: "no-referrer"
		}), r.signal), a = await ue(i.json(), r.signal);
		return e.assertSession(), {
			response: i,
			data: a
		};
	} finally {
		clearTimeout(a), e.signal?.removeEventListener("abort", i);
	}
}
async function Je(e) {
	let t = Ke(e), { response: n, data: r } = await qe(e, `${t.origin}/api/v2/domains`, { method: "GET" });
	if (!n.ok || !$(r) || !$(r.availableDomains)) return null;
	let i = r.availableDomains[t.domain];
	if (!$(i) || i.requireinvite !== !1 || i.requirepayment !== !1 || i.maxsatoshi !== 0) return null;
	let a = i.minUsernameLength, o = i.maxUsernameLength;
	return typeof a != "number" || typeof o != "number" || !Number.isSafeInteger(a) || !Number.isSafeInteger(o) || a < 1 || o < a ? null : {
		minLength: a,
		maxLength: o
	};
}
function Ye(e, t) {
	return /^[a-zA-Z0-9_-]+$/.test(e) && e.length >= t.minLength && e.length <= t.maxLength;
}
async function Xe(e, t, n, r) {
	let i = Ke(e);
	if (!Ye(t, n)) throw new Z("invalidUsername");
	let a = `${i.origin}/api/v2/register`, o = {
		pubkey: e.expectedPubkey,
		username: t,
		domain: i.domain
	}, s;
	try {
		if (s = await ue(e.authService.buildAuthHeader(a, "POST", o), e.signal), e.assertSession(), !s) throw Error();
	} catch {
		throw le(e.signal), new Z("authentication");
	}
	let c;
	try {
		e.assertSession(), r(), c = await qe(e, a, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: s
			},
			body: JSON.stringify(o)
		});
	} catch {
		throw le(e.signal), new Z("unknownRegistration");
	}
	let { response: l, data: u } = c;
	if ([
		400,
		401,
		422
	].includes(l.status) && $(u) && u.status === "error" && u.message === "Invalid username format") throw new Z("invalidUsername");
	if ($(u) && u.status === "error" && l.status === 406) {
		if (u.message === "Username already registered") throw new Z("usernameTaken");
		if (u.message === "Pubkey already registered") return "alreadyRegistered";
	}
	if (l.status === 429) throw new Z("rateLimited");
	if (l.status === 401 || l.status === 403) return "external";
	if (!l.ok || !$(u) || u.status !== "success") throw new Z("unknownRegistration");
	if (u.otc === !0 || typeof u.payment_request == "string" && u.payment_request !== "" || typeof u.satoshi == "number" && u.satoshi > 0) return "external";
	if (u.otc !== !1 || u.payment_request !== "" || u.satoshi !== 0) throw new Z("unknownRegistration");
	return "registered";
}
// D:/ドキュメント/GitHub/ehagaki/src/components/UploadServerRegistration.svelte
var Ze = P("<p class=\"svelte-1fagx79\"> </p> <div><!></div>", 1), Qe = P("<!> <!>", 1), $e = P("<p role=\"status\" class=\"svelte-1fagx79\"> </p> <a target=\"_blank\" rel=\"noopener noreferrer\"> </a> <!>", 1), et = P("<p role=\"alert\" class=\"svelte-1fagx79\"> </p> <!> <a target=\"_blank\" rel=\"noopener noreferrer\"> </a>", 1), tt = P("<p role=\"alert\" class=\"svelte-1fagx79\"> </p>"), nt = P("<form class=\"svelte-1fagx79\"><label> </label> <input autocomplete=\"off\" autocapitalize=\"none\" required=\"\" class=\"svelte-1fagx79\"/> <p class=\"svelte-1fagx79\"> </p> <p class=\"svelte-1fagx79\"> <a target=\"_blank\" rel=\"noopener noreferrer\"> </a></p> <!> <div class=\"actions svelte-1fagx79\"><!> <!></div></form>"), rt = P("<p class=\"target svelte-1fagx79\"> </p> <!>", 1), it = P("<section class=\"registration svelte-1fagx79\"><!></section>"), at = {
	hash: "svelte-1fagx79",
	code: ".registration.svelte-1fagx79 {margin:8px 12px;padding:12px;border:1px solid var(--border);border-radius:6px;min-width:0;overflow-wrap:anywhere;}form.svelte-1fagx79, .registration.svelte-1fagx79 {display:flex;flex-direction:column;gap:8px;}p.svelte-1fagx79 {margin:0;}.target.svelte-1fagx79 {font-weight:bold;}input.svelte-1fagx79 {box-sizing:border-box;width:100%;min-width:0;padding:8px;min-height:44px;font:inherit;color:var(--text);background:var(--dialog-bg);border:1px solid var(--border);border-radius:4px;}.actions.svelte-1fagx79 {display:flex;flex-wrap:wrap;gap:8px;}"
};
function ot(t, r) {
	let a = _();
	i(r, !0), k(t, at);
	let l = () => ne(de, "$_", u), [u, p] = M(), h = R(""), v = R(""), b = R(void 0), S = R(void 0), D = m(() => r.registration.phase === "submitting"), te = m(() => !!r.registration.policy && Ye(I(h), r.registration.policy)), P = m(() => r.registration.error && (!["usernameTaken", "invalidUsername"].includes(r.registration.error) || I(h) === I(v)) ? r.registration.error : null);
	function F() {
		y(h, r.initialUsername.trim(), !0), y(v, ""), r.onOpen();
	}
	function re() {
		r.onCancel(), O().then(() => I(S)?.querySelector("button")?.focus({ preventScroll: !0 }));
	}
	A(() => {
		r.registration.phase === "ready" && O().then(() => I(b)?.focus({ preventScroll: !0 }));
	});
	var L = it(), ie = w(L), oe = (e) => {
		var t = Ze(), n = T(t), r = N(n, !0), i = j(n, 2), a = w(i);
		V(a, {
			onClick: F,
			children: (e, t) => {
				d();
				var n = g();
				C((e) => c(n, e), [() => l()("uploadedMedia.registration.open")]), s(e, n);
			},
			$$slots: { default: !0 }
		}), f(i), C((e) => c(r, e), [() => l()("uploadedMedia.registration.offer")]), s(e, t);
	}, se = (t) => {
		var i = rt(), o = T(i), u = N(o, !0), p = j(o, 2), _ = (e) => {
			var t = Qe(), n = T(t);
			fe(n, {
				showLoader: !0,
				text: !0
			});
			var r = j(n, 2);
			V(r, {
				onClick: re,
				children: (e, t) => {
					d();
					var n = g();
					C((e) => c(n, e), [() => l()("common.cancel")]), s(e, n);
				},
				$$slots: { default: !0 }
			}), s(e, t);
		}, S = (e) => {
			var t = $e(), n = T(t), i = N(n, !0), a = j(n, 2), o = N(a, !0), u = j(a, 2);
			V(u, {
				onClick: () => r.onRefresh(),
				children: (e, t) => {
					d();
					var n = g();
					C((e) => c(n, e), [() => l()("uploadedMedia.refresh")]), s(e, n);
				},
				$$slots: { default: !0 }
			}), C((e, t) => {
				c(i, e), x(a, "href", r.registration.target.registrationUrl), c(o, t);
			}, [() => l()("uploadedMedia.registration.external"), () => l()("uploadedMedia.registration.official")]), s(e, t);
		}, O = (e) => {
			var t = et(), n = T(t), i = N(n, !0), a = j(n, 2);
			V(a, {
				onClick: () => r.onRefresh(),
				children: (e, t) => {
					d();
					var n = g();
					C((e) => c(n, e), [() => l()("uploadedMedia.refresh")]), s(e, n);
				},
				$$slots: { default: !0 }
			});
			var o = j(a, 2), u = N(o, !0);
			C((e, t) => {
				c(i, e), x(o, "href", r.registration.target.registrationUrl), c(u, t);
			}, [() => l()("uploadedMedia.registration.errors.unknownRegistration"), () => l()("uploadedMedia.registration.official")]), s(e, t);
		}, k = (t) => {
			var i = nt(), o = w(i), u = N(o, !0), p = j(o, 2);
			ae(p), x(p, "spellcheck", !1), ee(p, (e) => y(b, e), () => I(b));
			var _ = j(p, 2), S = N(_, !0), T = j(_, 2), O = w(T), k = j(O), A = N(k, !0);
			f(T);
			var M = j(T, 2), F = (e) => {
				var t = tt(), n = N(t, !0);
				C((e) => {
					x(t, "id", `${a}-error`), c(n, e);
				}, [() => l()(`uploadedMedia.registration.errors.${I(P)}`)]), s(e, t);
			};
			n(M, (e) => {
				I(P) && e(F);
			});
			var ne = j(M, 2), L = w(ne);
			{
				let e = m(() => !I(te) || I(D));
				V(L, {
					type: "submit",
					get disabled() {
						return I(e);
					},
					children: (e, t) => {
						d();
						var n = g();
						C((e) => c(n, e), [() => l()(I(D) ? "uploadedMedia.registration.submitting" : "uploadedMedia.registration.submit")]), s(e, n);
					},
					$$slots: { default: !0 }
				});
			}
			var ie = j(L, 2);
			V(ie, {
				onClick: re,
				children: (e, t) => {
					d();
					var n = g();
					C((e) => c(n, e), [() => l()("common.cancel")]), s(e, n);
				},
				$$slots: { default: !0 }
			}), f(ne), f(i), C((e, t, n, s, l) => {
				x(i, "aria-busy", I(D)), x(o, "for", a), c(u, e), x(p, "id", a), p.disabled = I(D), x(p, "aria-describedby", `${a}-help${I(P) ? ` ${a}-error` : ""}`), x(p, "aria-invalid", t), x(_, "id", `${a}-help`), c(S, n), c(O, `${s ?? ""} `), x(k, "href", r.registration.target.termsUrl), c(A, l);
			}, [
				() => l()("uploadedMedia.registration.username"),
				() => !I(te) || !!I(P) && ["invalidUsername", "usernameTaken"].includes(I(P)),
				() => l()("uploadedMedia.registration.usernameHelp", { values: {
					min: r.registration.policy.minLength,
					max: r.registration.policy.maxLength
				} }),
				() => l()("uploadedMedia.registration.agreement"),
				() => l()("uploadedMedia.registration.terms")
			]), e("submit", i, (e) => {
				e.preventDefault(), I(te) && !I(D) && (y(v, I(h), !0), r.onRegister(I(h)));
			}), E(p, () => I(h), (e) => y(h, e)), s(t, i);
		};
		n(p, (e) => {
			r.registration.phase === "loading" ? e(_) : r.registration.phase === "external" ? e(S, 1) : r.registration.phase === "unknown" ? e(O, 2) : e(k, -1);
		}), C(() => c(u, r.registration.target.domain)), s(t, i);
	};
	n(ie, (e) => {
		r.registration.phase === "offer" ? e(oe) : e(se, -1);
	}), f(L), ee(L, (e) => y(S, e), () => I(S)), C((e) => x(L, "aria-label", e), [() => l()("uploadedMedia.registration.title")]), s(t, L), o(), p();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/upload/uploadMediaManagementController.ts
var st = () => ({
	destinations: [],
	selectedId: null,
	current: null
});
function ct(e) {
	return [
		e.protocol,
		e.serverUrl,
		e.resolvedUploadUrl,
		e.nip96ServerUrl,
		e.nip96UrlMode
	].join("\n");
}
function lt(e) {
	e.localSnapshot = null, e.nextPage = null, e.needsRefresh = !0;
}
var ut = class {
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
		for (let e of this.states.values()) e.abort?.abort(), e.generation++, e.deletingId && e.deleteDispatched && (e.error = new U("unknownDelete"), lt(e)), e.loading = !1, e.deletingId = null, e.deleteDispatched = !1, this.stopRegistration(e);
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
		let t = (this.deps.auth ?? B).value;
		if (e && (!t.isAuthenticated || t.type === "npub" || t.pubkey !== e)) return;
		if (e !== this.pubkey && (this.invalidate(), this.pubkey = e), !e) {
			this.emit();
			return;
		}
		if (this.savedDestinationsRead) {
			this.selectedId && !this.states.get(this.selectedId)?.loaded && !this.states.get(this.selectedId)?.registration && this.load();
			return;
		}
		if (this.configuring) return;
		let n = this.epoch, r = ++this.configurationGeneration, i = () => this.active && n === this.epoch && r === this.configurationGeneration && this.pubkey === e && (this.deps.auth ?? B).value.isAuthenticated && (this.deps.auth ?? B).value.type !== "npub" && (this.deps.auth ?? B).value.pubkey === e;
		this.configuring = !0, this.configurationError = null, this.emit();
		try {
			let t = await this.deps.loadDestinations?.(e) ?? [];
			i() && this.configure(e, t);
		} catch {
			i() && (this.configurationError = new U("invalidDestination"));
		} finally {
			i() && (this.configuring = !1, this.emit());
		}
	}
	configure(e, t) {
		if (e !== this.pubkey && this.invalidate(), this.pubkey = e, this.configurationGeneration++, this.configuring = !1, this.configurationError = null, this.savedDestinationsRead = !0, !e) {
			this.emit();
			return;
		}
		this.destinations = t.filter((e) => e.protocol !== "custom-http").map((t) => ye(t, {
			pubkeyHex: e,
			npub: z.npubEncode(e)
		}));
		let n = new Set(this.destinations.map((e) => e.id));
		for (let [e, t] of this.states) n.has(e) || (t.abort?.abort(), this.states.delete(e));
		for (let e of this.destinations) {
			let t = this.states.get(e.id);
			t && ct(t.destination) === ct(e) ? t.destination = e : (t?.abort?.abort(), this.states.set(e.id, {
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
				e?.abort?.abort(), e && (e.deletingId && e.deleteDispatched && (e.error = new U("unknownDelete"), lt(e)), e.generation++, e.loading = !1, e.deletingId = null, e.deleteDispatched = !1, this.stopRegistration(e));
			}
			this.selectedId = e, this.emit(), this.states.get(e)?.loaded || this.load();
		}
	}
	begin(e) {
		e.abort?.abort();
		let t = new AbortController();
		e.abort = t;
		let n = ++e.generation, r = this.epoch, i = this.pubkey, a = { ...e.destination }, o = () => this.active && (this.deps.auth ?? B).value.isAuthenticated && (this.deps.auth ?? B).value.type !== "npub" && (this.deps.auth ?? B).value.pubkey === i && this.epoch === r && this.pubkey === i && this.states.get(a.id) === e && e.generation === n && !t.signal.aborted, s = () => {
			if (!o()) throw ce();
			pe(this.deps.auth ?? B, i);
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
				}) ?? new W({
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
				let e = (this.deps.auth ?? B).value;
				if (!e.isAuthenticated || e.type === "npub" || e.pubkey !== this.pubkey || !t.localSnapshot.length) return;
				t.error = null, t.notice = null, t.items.push(...t.localSnapshot.splice(0, 24)), this.emit();
			} else (!e || !t.loaded || t.needsRefresh || t.nextPage) && (e = e && !t.needsRefresh && !!t.nextPage, !e && t.localSnapshot !== null && lt(t), t.notice = null, t.registration = null, await this.loadPage(t, e));
		}
	}
	async loadPage(e, t, n = this.begin(e)) {
		e.loading = !0, e.error = null, this.emit();
		try {
			let r = (this.deps.getAdapter ?? ge)(e.destination.protocol);
			if (!r.listMediaPage || !r.deleteMedia) throw new U("unavailable");
			let i = await r.listMediaPage({
				...n.params,
				page: t ? e.nextPage : null,
				context: t ? e.context : null
			});
			if (n.params.assertSession(), !n.current()) return;
			if (i.localSnapshot && (e.destination.protocol !== "blossom" || i.nextPage)) throw new U("invalidResponse");
			let a = i.nextPage?.protocol === "blossom" ? i.nextPage.cursor : null;
			if (t && a && e.cursors.has(a)) throw new U("invalidResponse");
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
			e.error = H(t);
			let r = Ge(e.destination);
			r && [401, 403].includes(e.error.status ?? 0) && (e.registration = {
				target: r,
				phase: "offer",
				policy: null,
				error: null
			}), e.error.code === "unavailable" && (e.support = "unavailable"), e.error.code === "invalidResponse" && lt(e);
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
			let n = await Je(t.params);
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
			let i = await Xe(n.params, e, r, () => {
				n.params.assertSession(), t.registrationDispatched = !0;
			});
			if (!n.current()) return;
			if (t.registrationDispatched = !1, i === "external") t.registration = {
				...t.registration,
				phase: "external"
			};
			else {
				let e = t.registration.target;
				t.registration = null, lt(t), await this.loadPage(t, !1, n), n.current() && t.registration && (t.registration = {
					target: e,
					phase: "external",
					policy: null,
					error: null
				});
			}
		} catch (e) {
			if (!n.current()) return;
			let r = e instanceof Z ? e.code : "serverError";
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
			let e = (this.deps.getAdapter ?? ge)(t.destination.protocol);
			if (!e.deleteMedia) throw new U("unavailable");
			if (await e.deleteMedia({
				...r.params,
				item: n,
				context: t.context
			}), r.current() && (t.deleteDispatched = !1, t.items = t.items.filter((e) => e.deleteId?.sha256 !== i), lt(t), t.notice = "deleted", this.emit()), a.length) {
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
			return r.current() && (t.error = H(e), t.error.code === "unknownDelete" && lt(t)), !1;
		} finally {
			r.current() && (t.deletingId = null, t.deleteDispatched = !1, this.emit());
		}
	}
};
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/useUploadMediaManagement.svelte.ts
function dt() {
	let e = R(D(st()));
	return {
		get value() {
			return I(e);
		},
		controller: new ut({
			loadDestinations: (e) => be.getAll(e),
			evictImages: Ie,
			onChange: (t) => {
				y(e, t, !0);
			}
		})
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/components/UploadedMediaTabContent.svelte
var ft = P("<p class=\"media-status svelte-hlt8mi\" role=\"status\"> </p>"), pt = P("<p class=\"media-status svelte-hlt8mi\" role=\"alert\"> </p> <!>", 1), mt = P("<option class=\"svelte-hlt8mi\"> </option>"), ht = P("<span class=\"svg-icon\" aria-hidden=\"true\"></span>"), gt = P("<div class=\"media-status nostr-build-help svelte-hlt8mi\" role=\"status\"><p class=\"svelte-hlt8mi\"> </p> <a href=\"https://account.nostr.build/\" target=\"_blank\" rel=\"noopener noreferrer\" tabindex=\"0\" class=\"svelte-hlt8mi\"> </a> <a href=\"https://nostr.build/delete/\" target=\"_blank\" rel=\"noopener noreferrer\" tabindex=\"0\" class=\"svelte-hlt8mi\"> </a></div>"), _t = P("<p class=\"media-status svelte-hlt8mi\"> </p>"), vt = P("<p class=\"media-status svelte-hlt8mi\"> </p> <!>", 1), yt = P("<time> </time>"), bt = P("<span class=\"svg-icon media-delete-icon svelte-hlt8mi\" aria-hidden=\"true\"></span>"), xt = P("<article><!> <!> <div class=\"media-overlay svelte-hlt8mi\"><div class=\"media-metadata svelte-hlt8mi\"><span> </span> <span><!></span></div> <!></div></article>"), St = P("<div class=\"media-load-sentinel svelte-hlt8mi\" aria-hidden=\"true\"></div>"), Ct = P("<!> <div class=\"list-end-actions svelte-hlt8mi\"><!></div>", 1), wt = P("<!> <!> <!> <!> <div class=\"media-list svelte-hlt8mi\" tabindex=\"-1\"></div> <!>", 1), Tt = P("<div class=\"media-toolbar svelte-hlt8mi\"><select class=\"media-server-select svelte-hlt8mi\"></select> <!></div> <!>", 1), Et = P("<p class=\"svelte-hlt8mi\"> </p>"), Dt = P("<p class=\"diagnostic svelte-hlt8mi\"> </p>"), Ot = P("<!> <p class=\"svelte-hlt8mi\"> </p> <!> <!>", 1), kt = P("<div class=\"media-feedback svelte-hlt8mi\"><!></div>"), At = P("<p class=\"server-url svelte-hlt8mi\"> </p>"), jt = P("<p class=\"svelte-hlt8mi\"> </p> <p class=\"server-url svelte-hlt8mi\"> </p> <!> <p class=\"server-url svelte-hlt8mi\"> </p>", 1), Mt = P("<div class=\"uploaded-media-dialog uploaded-media-content svelte-hlt8mi\"><div class=\"media-management svelte-hlt8mi\"><!></div></div> <!> <!> <!>", 1), Nt = {
	hash: "svelte-hlt8mi",
	code: ".uploaded-media-content.svelte-hlt8mi {background:var(--dialog-bg);flex:1;min-height:0;overflow:auto;width:100%;}.media-management.svelte-hlt8mi {flex:none;width:100%;min-width:0;display:flex;flex-direction:column;}.uploaded-media-dialog button {height:auto;min-height:44px;max-width:100%;padding:8px 12px;}.uploaded-media-dialog button.image-open {display:block;width:100%;height:100%;min-height:0;max-width:none;margin:0;padding:0;border:none;background:transparent;cursor:pointer;}p.svelte-hlt8mi {margin:0;}.media-toolbar.svelte-hlt8mi {display:grid;grid-template-columns:minmax(0, 1fr) 44px;gap:4px;padding:8px;}.media-status.svelte-hlt8mi {margin:8px 12px;}.nostr-build-help.svelte-hlt8mi {display:flex;flex-direction:column;gap:4px;min-width:0;padding:12px;border:1px solid var(--border);border-radius:6px;overflow-wrap:anywhere;}.nostr-build-help.svelte-hlt8mi a:where(.svelte-hlt8mi) {display:flex;align-items:center;align-self:flex-start;min-height:44px;max-width:100%;}.media-feedback.svelte-hlt8mi {overflow-wrap:anywhere;}.media-server-select.svelte-hlt8mi {width:100%;min-width:0;min-height:44px;max-width:100%;padding:8px 32px 8px 10px;border:1px solid var(--border);border-radius:6px;background:var(--dialog-bg);color:var(--text);font:inherit;}.media-server-select.svelte-hlt8mi option:where(.svelte-hlt8mi) {background:var(--dialog-bg);color:var(--text);}.list-end-actions.svelte-hlt8mi {display:flex;width:100%;padding:10px;box-sizing:border-box;}.uploaded-media-dialog button.media-load-more-button {width:100%;}.media-load-sentinel.svelte-hlt8mi {height:1px;}.uploaded-media-dialog button.media-refresh-button {width:44px;height:44px;padding:0;background:transparent;border:none;}.uploaded-media-dialog button.media-delete-button {flex:none;padding:0;background:transparent;border:none;color:white;--text: white;width:44px;min-width:44px;max-width:44px;height:44px;min-height:44px;max-height:44px;}.uploaded-media-dialog button.media-delete-button:hover:not(:disabled) {background:rgb(255 255 255 / 15%);color:white;}.uploaded-media-dialog button.media-delete-button:hover:not(:disabled) .svg-icon {background-color:white;}.uploaded-media-dialog button.media-delete-button:focus-visible {outline:2px solid white;outline-offset:-2px;}.media-delete-icon.svelte-hlt8mi {width:24px;height:24px;--svg: currentColor;}.server-url.svelte-hlt8mi, .diagnostic.svelte-hlt8mi {overflow-wrap:anywhere;font-size:.875rem;}.media-list.svelte-hlt8mi {display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));gap:2px;}article.svelte-hlt8mi {position:relative;min-width:0;align-self:start;}.uploaded-media-dialog button.media-copy-button {position:absolute;top:4px;right:4px;z-index:1;width:44px;min-width:44px;height:44px;min-height:44px;padding:0;color:white;--text: white;}.uploaded-media-dialog button.media-copy-button:hover:not(:disabled) .svg-icon {background-color:white;}.video-active.svelte-hlt8mi button.media-copy-button {top:52px;}.media-overlay.svelte-hlt8mi {position:absolute;inset:auto 0 0;display:flex;align-items:flex-end;justify-content:space-between;gap:4px;padding:16px 4px 4px 8px;color:white;background:linear-gradient(transparent, rgb(0 0 0 / 70%));pointer-events:none;}.media-metadata.svelte-hlt8mi {min-width:0;align-self:center;display:flex;flex-direction:column;font-size:.6875rem;line-height:1.5;overflow-wrap:anywhere;text-shadow:0 1px 2px rgb(0 0 0 / 70%);}.media-overlay.svelte-hlt8mi button {pointer-events:auto;}\n    /* Keep native video playback controls available beneath the overlay. */.video-active.svelte-hlt8mi .media-overlay:where(.svelte-hlt8mi) {bottom:56px;}"
};
function Pt(e, t) {
	i(t, !0), k(e, Nt);
	let _ = () => ne(de, "$_", v), [v, E] = M(), P = F(t, "onBusyChange", 3, () => void 0), L = R(!1), ae = R(!1), se = R(!1), z = m(() => t.show && !I(se));
	function ce() {
		y(se, !1), H.controller.activate();
	}
	function le() {
		I(W)?.loading && y(Y, null), y(se, !0), Ie++, S(X), y(G, null), y(K, null), y(ze, !0), Qe(), H.controller.suspend();
	}
	function ue() {
		return H.controller.busy;
	}
	function pe() {
		return I(J);
	}
	let H = dt(), ge = Se("icons/delete_forever_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"), U = Se("icons/refresh_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"), _e = Se("icons/file_copy_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"), W = m(() => H.value.current), ve = m(() => !!I(W) && /^https?:\/\/nostpic\.com(?::\d+)?(?:\/|$)/i.test(I(W).destination.serverUrl));
	function ye(e) {
		try {
			let t = new URL(e);
			return t.origin === "https://nostr.build" && !t.username && !t.password && !t.search && !t.hash && ["/", "/api/v2/nip96/upload"].includes(t.pathname.replace(/\/$/, "") || "/");
		} catch {
			return !1;
		}
	}
	let be = m(() => I(W)?.destination.protocol === "nip96" && ye(I(W).destination.serverUrl) && I(W).error?.code === "unavailable" && I(W).error.status === 405), xe = R(null), G = R(null), Te = R(null), Ee = null, K = R(null), Ae = R(D([])), q = R(-1), J = R(!1), Me = R(null), Ne = R(void 0), Pe = R(null), Y = R(null), Ie = 0, X = R(0), Le = null, Re = R(null), ze = R(!1), Be = null, Ve = m(() => I(W)?.notice ?? null), He = m(() => !!I(W)?.deletingId), Z = m(() => I(W)?.registration?.phase === "submitting"), Q = m(() => [
		B.value.pubkey,
		I(W)?.destination.id,
		I(W)?.destination.protocol,
		I(W)?.destination.serverUrl,
		I(W)?.destination.resolvedUploadUrl,
		I(W)?.destination.nip96ServerUrl,
		I(W)?.destination.nip96UrlMode
	].join("\n")), We = m(() => I(z) && !I(G) && !I(He) && !I(be) && !!(I(W)?.error && !I(W).registration || I(W)?.loading && I(W).loaded || I(Ve) && !I(ze))), Ge = m(() => I(z) && B.value.isAuthenticated && I(W)?.loaded && I(W).items.length > 0 && I(W).hasMore && !I(W).loading && !I(W).error && !I(W).needsRefresh && !I(He) && !I(Z) && !I(G) && !I(J) && (I(Y)?.owner !== I(Q) || I(Y).itemCount !== I(W).items.length));
	function $(e = !1) {
		let t = I(W);
		return !I(z) || !t?.hasMore || t.loading || t.needsRefresh || I(He) || I(Z) || e && !I(Ge) ? !1 : (y(Y, {
			owner: I(Q),
			itemCount: t.items.length
		}), H.controller.load(!0), !0);
	}
	A(() => {
		let e = I(Ve), t = I(He), n = I(Q), r = Be !== null && Be !== n;
		Be = n;
		let i = r || !b(() => I(z));
		if (y(ze, i, !0), !e || t || i) return;
		let a = setTimeout(() => {
			y(ze, !0);
		}, 3500);
		return () => clearTimeout(a);
	}), A(() => {
		let e = t.show;
		b(() => e ? ce() : le());
	});
	function Ke(e) {
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
	function qe(e) {
		return (/* @__PURE__ */ new Date(e * 1e3)).toLocaleString(void 0, {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit"
		});
	}
	function Je() {
		S(X), Le = null, y(Y, null), y(G, null), y(K, null), Qe(), H.controller.invalidate();
	}
	A(() => {
		let e = I(z), t = B.value, n = De.value.destinations;
		b(() => {
			if (!e) return;
			H.controller.activate();
			let r = t.isAuthenticated ? t.pubkey : null;
			n.length ? H.controller.configure(r, n) : H.controller.configureSaved(r), y(L, !0);
		});
	}), A(() => {
		I(z) && !I(ae) && t.onInitialReady && I(L) && !H.value.configuring && (!B.value.isAuthenticated || H.value.configurationError || H.value.destinations.length === 0 || I(W)?.loaded || I(W)?.items.length || I(W)?.error) && (y(ae, !0), t.onInitialReady());
	}), A(() => {
		if (!I(z) || I(xe) !== null) return;
		let e = ++Ie;
		Fe().then((t) => {
			e === Ie && y(xe, t, !0);
		});
	}), A(() => {
		let e = H.value.selectedId, t = `${B.value.pubkey}\n${e}\n${I(W)?.destination.protocol}\n${I(W)?.destination.serverUrl}\n${I(W)?.context?.endpoint}`;
		b(() => {
			t !== Le && (Le = t, S(X), y(G, null), y(K, null), Qe());
		});
	}), A(() => {
		let e = I(W);
		b(() => {
			I(G) && (e?.destination.serverUrl !== I(G).serverUrl || e?.context?.endpoint !== I(Te) || !e.deletingId && !e.items.some((e) => e.id === I(G)?.id)) && y(G, null), I(K) && !e?.items.some((e) => e.id === I(K)) && y(K, null);
			let t = I(Ae)[I(q)]?.id;
			I(J) && t && !e?.items.some((e) => e.id === t && e.kind === "image") && Qe();
		});
	}), A(() => {
		P()(!!I(W)?.deletingId || I(Z));
	}), re(() => {
		Ie++, Je();
	});
	function Ye() {
		let e = I(X), t = Ee;
		y(G, null), O().then(() => e === I(X) && t?.isConnected && t.focus({ preventScroll: !0 }));
	}
	async function Xe() {
		let e = I(G), t = I(X), n = Ee;
		!e || I(W)?.destination.serverUrl !== e.serverUrl || I(W).context?.endpoint !== I(Te) || !I(W).items.some((t) => t.id === e.id && t.deleteId?.sha256 === e.deleteId?.sha256) ? Ye() : (await H.controller.delete(e.id), t === I(X) && (y(G, null), await O(), t === I(X) && (n?.isConnected ? n.focus({ preventScroll: !0 }) : I(Ne)?.focus({ preventScroll: !0 }))));
	}
	async function Ze(e) {
		let t = I(Q);
		await H.controller.register(e), await O(), I(z) && t === I(Q) && !I(W)?.registration && I(Ne)?.focus({ preventScroll: !0 });
	}
	function Qe() {
		y(J, !1), y(Ae, [], !0), y(q, -1), y(Me, null);
	}
	function $e(e) {
		return je({
			url: e.url,
			serverUrl: e.serverUrl,
			cacheSupported: I(xe),
			basePath: "./",
			currentOrigin: window.location.origin
		});
	}
	function et(e, t) {
		return t.stopPropagation(), e.url ? me(e.url, "URL", navigator, window) : !1;
	}
	function tt(e, t) {
		let n = (I(W)?.items ?? []).flatMap((e) => {
			if (e.kind !== "image") return [];
			let t = $e(e);
			return t ? [{
				id: e.id,
				src: t,
				alt: _()("uploadedMedia.image"),
				type: "image"
			}] : [];
		}), r = n.findIndex((t) => t.id === e.id);
		r < 0 || (y(Ae, n, !0), y(q, r, !0), y(Me, t, !0), y(J, !0));
	}
	var nt = {
		activate: ce,
		suspend: le,
		isBusy: ue,
		isFullscreen: pe,
		invalidateSession: Je
	}, rt = l(), it = T(rt), at = (e) => {
		var i = Mt(), o = T(i), v = w(o), b = w(v), S = (e) => {
			var t = ft(), n = N(t, !0);
			C((e) => c(n, e), [() => _()("uploadedMedia.errors.authentication")]), s(e, t);
		}, E = (e) => {
			fe(e, {
				showLoader: !0,
				text: !0
			});
		}, D = (e) => {
			var t = pt(), n = T(t), r = N(n, !0), i = j(n, 2);
			V(i, {
				onClick: () => H.controller.configureSaved(B.value.pubkey),
				children: (e, t) => {
					d();
					var n = g();
					C((e) => c(n, e), [() => _()("uploadedMedia.refresh")]), s(e, n);
				},
				$$slots: { default: !0 }
			}), C((e) => c(r, e), [() => _()("uploadedMedia.errors.invalidDestination")]), s(e, t);
		}, k = (e) => {
			var t = ft(), n = N(t, !0);
			C((e) => c(n, e), [() => _()("uploadedMedia.noServers")]), s(e, t);
		}, A = (e) => {
			var i = Tt(), o = T(i), v = w(o);
			u(v, 21, () => H.value.destinations, (e) => e.id, (e, t) => {
				var n = mt(), r = N(n, !0), i = {};
				C(() => {
					c(r, I(t).name), i !== (i = I(t).id) && (n.value = (n.__value = i) ?? "");
				}), s(e, n);
			}), f(v);
			var b;
			r(v);
			var S = j(v, 2), E = (e) => {
				{
					let t = m(() => _()("uploadedMedia.refresh")), n = m(() => _()("uploadedMedia.refresh")), r = m(() => I(W).loading || !!I(W).deletingId || I(Z));
					V(e, {
						shape: "square",
						contentLayout: "icon",
						className: "media-refresh-button",
						get ariaLabel() {
							return I(t);
						},
						get title() {
							return I(n);
						},
						onClick: () => {
							y(Y, null), y(K, null), Qe(), H.controller.load();
						},
						get disabled() {
							return I(r);
						},
						children: (e, t) => {
							var n = ht();
							let r;
							C(() => r = h(n, "", r, { "mask-image": `url("${U}")` })), s(e, n);
						},
						$$slots: { default: !0 }
					});
				}
			};
			n(S, (e) => {
				I(W) && e(E);
			}), f(o), ee(o, (e) => y(Re, e), () => I(Re));
			var D = j(o, 2), k = (e) => {
				var r = wt(), i = T(r), o = (e) => {
					var t = gt(), n = w(t), r = N(n, !0), i = j(n, 2), a = N(i, !0), o = j(i, 2), l = N(o, !0);
					f(t), C((e, t, n) => {
						c(r, e), c(a, t), c(l, n);
					}, [
						() => _()("uploadedMedia.nostrBuild.unavailable"),
						() => _()("uploadedMedia.nostrBuild.account"),
						() => _()("uploadedMedia.nostrBuild.deleteFree")
					]), s(e, t);
				};
				n(i, (e) => {
					I(be) && e(o);
				});
				var p = j(i, 2), v = (e) => {
					var t = l(), n = T(t);
					oe(n, () => I(Q), (e) => {
						{
							let t = m(() => we.value.displayName || we.value.name || "");
							ot(e, {
								get registration() {
									return I(W).registration;
								},
								get initialUsername() {
									return I(t);
								},
								onOpen: () => H.controller.openRegistration(),
								onCancel: () => H.controller.cancelRegistration(),
								onRegister: Ze,
								onRefresh: async () => {
									let e = I(Q);
									await H.controller.load(), await O(), I(z) && e === I(Q) && I(Re)?.querySelector("button")?.focus({ preventScroll: !0 });
								}
							});
						}
					}), s(e, t);
				};
				n(p, (e) => {
					I(W).registration && e(v);
				});
				var b = j(p, 2), S = (e) => {
					fe(e, {
						showLoader: !0,
						text: !0
					});
				};
				n(b, (e) => {
					I(W).loading && !I(W).loaded && (!t.onInitialReady || I(ae)) && e(S);
				});
				var E = j(b, 2), D = (e) => {
					var t = vt(), r = T(t), i = N(r, !0), a = j(r, 2), o = (e) => {
						var t = _t(), n = N(t, !0);
						C((e) => c(n, e), [() => _()("uploadedMedia.moreUnseen")]), s(e, t);
					};
					n(a, (e) => {
						I(W).hasMore && e(o);
					}), C((e) => c(i, e), [() => _()("uploadedMedia.empty")]), s(e, t);
				};
				n(E, (e) => {
					I(W).loaded && I(W).items.length === 0 && e(D);
				});
				var k = j(E, 2);
				u(k, 21, () => I(W).items, (e) => e.id, (e, t) => {
					var r = xt();
					let i;
					var o = w(r);
					{
						let e = m(() => I(K) === I(t).id);
						Ue(o, {
							get item() {
								return I(t);
							},
							get cacheSupported() {
								return I(xe);
							},
							get active() {
								return I(e);
							},
							onOpenImage: (e) => tt(I(t), e),
							onOpenVideo: () => {
								y(K, I(t).id, !0);
							},
							onCloseVideo: () => {
								y(K, null);
							}
						});
					}
					var l = j(o, 2);
					{
						let e = m(() => _()(`${I(t).kind === "video" ? "videoContextMenu" : "imageContextMenu"}.copyUrl`)), n = m(() => _()(`${I(t).kind === "video" ? "videoContextMenu" : "imageContextMenu"}.copyUrl`)), r = m(() => _()(`${I(t).kind === "video" ? "videoContextMenu" : "imageContextMenu"}.copySuccess`)), i = m(() => !I(t).url);
						V(l, {
							variant: "copy",
							shape: "circle",
							contentLayout: "icon",
							className: "media-copy-button",
							get ariaLabel() {
								return I(e);
							},
							get title() {
								return I(n);
							},
							get floatingMessage() {
								return I(r);
							},
							get disabled() {
								return I(i);
							},
							onClick: (e) => et(I(t), e),
							children: (e, t) => {
								var n = ht();
								let r;
								C(() => r = h(n, "", r, { "mask-image": `url("${_e}")` })), s(e, n);
							},
							$$slots: { default: !0 }
						});
					}
					var u = j(l, 2), d = w(u), p = w(d), v = N(p, !0), b = j(p, 2), S = w(b), ee = (e) => {
						var n = yt(), r = N(n, !0);
						C((e, t) => {
							x(n, "datetime", e), c(r, t);
						}, [() => (/* @__PURE__ */ new Date(I(t).uploadedAt * 1e3)).toISOString(), () => qe(I(t).uploadedAt)]), s(e, n);
					}, T = (e) => {
						var t = g();
						C((e) => c(t, e), [() => _()("uploadedMedia.unknown")]), s(e, t);
					};
					n(S, (e) => {
						I(t).uploadedAt === void 0 ? e(T, -1) : e(ee);
					}), f(b), f(d);
					var E = j(d, 2);
					{
						let e = m(() => I(W).deletingId === I(t).id ? _()("uploadedMedia.deleting") : _()("uploadedMedia.delete")), n = m(() => I(W).deletingId === I(t).id ? _()("uploadedMedia.deleting") : _()("uploadedMedia.delete")), r = m(() => !I(t).deleteId || I(W).loading || !!I(W).deletingId || I(Z));
						V(E, {
							shape: "square",
							contentLayout: "icon",
							className: "media-delete-button",
							get ariaLabel() {
								return I(e);
							},
							get title() {
								return I(n);
							},
							get disabled() {
								return I(r);
							},
							onClick: (e) => {
								Ee = e.currentTarget, y(Te, I(W)?.context?.endpoint ?? null, !0), y(G, I(t), !0);
							},
							children: (e, t) => {
								var n = bt();
								let r;
								C(() => r = h(n, "", r, { "mask-image": `url("${ge}")` })), s(e, n);
							},
							$$slots: { default: !0 }
						});
					}
					f(u), f(r), C((e) => {
						x(r, "data-media-kind", I(t).kind), i = a(r, 1, "svelte-hlt8mi", null, i, { "video-active": I(t).kind === "video" && I(K) === I(t).id }), c(v, e);
					}, [() => I(t).size === void 0 ? _()("uploadedMedia.unknown") : Ke(I(t).size)]), s(e, r);
				}), f(k), ee(k, (e) => y(Ne, e), () => I(Ne));
				var A = j(k, 2), M = (e) => {
					var t = Ct(), r = T(t), i = (e) => {
						var t = l(), n = T(t);
						oe(n, () => I(W).items.length, (e) => {
							var t = St();
							te(t, () => (e) => {
								let t = I(Q);
								return ke(I(Pe), e, () => I(Q) === t && $(!0));
							}), s(e, t);
						}), s(e, t);
					};
					n(r, (e) => {
						I(Ge) && e(i);
					});
					var a = j(r, 2), o = w(a);
					{
						let e = m(() => I(W).loading || !!I(W).deletingId || I(Z));
						V(o, {
							className: "media-load-more-button",
							onClick: () => $(),
							get disabled() {
								return I(e);
							},
							children: (e, t) => {
								d();
								var n = g();
								C((e) => c(n, e), [() => _()("uploadedMedia.loadMore")]), s(e, n);
							},
							$$slots: { default: !0 }
						});
					}
					f(a), s(e, t);
				};
				n(A, (e) => {
					I(W).hasMore && !I(W).needsRefresh && e(M);
				}), s(e, r);
			};
			n(D, (e) => {
				I(W) && e(k);
			}), C((e) => {
				x(v, "aria-label", e), v.disabled = !!I(W)?.deletingId || I(Z), b !== (b = H.value.selectedId ?? "") && (v.value = (v.__value = b) ?? "", ie(v, b));
			}, [() => _()("uploadedMedia.server")]), p("change", v, (e) => H.controller.select(e.currentTarget.value)), s(e, i);
		};
		n(b, (e) => {
			B.value.isAuthenticated ? H.value.configuring ? e(E, 1) : H.value.configurationError ? e(D, 2) : H.value.destinations.length === 0 ? e(k, 3) : e(A, -1) : e(S);
		}), f(v), f(o), ee(o, (e) => y(Pe, e), () => I(Pe));
		var M = j(o, 2);
		{
			let e = m(() => !I(W)?.loading || !!I(W)?.error), t = m(() => I(W)?.error ? "alert" : "status");
			he(M, {
				get show() {
					return I(We);
				},
				variant: "anchor-bottom-right",
				get anchor() {
					return I(Re);
				},
				anchorRightOffset: 16,
				get showInfoIcon() {
					return I(e);
				},
				get role() {
					return I(t);
				},
				children: (e, t) => {
					var r = kt(), i = w(r), a = (e) => {
						var t = Ot(), r = T(t), i = (e) => {
							var t = Et(), n = N(t, !0);
							C((e) => c(n, e), [() => _()(`uploadedMedia.${I(Ve)}`)]), s(e, t);
						};
						n(r, (e) => {
							I(Ve) && e(i);
						});
						var a = j(r, 2), o = N(a, !0), l = j(a, 2), u = (e) => {
							var t = Et(), n = N(t, !0);
							C((e) => c(n, e), [() => _()("uploadedMedia.retryAfter", { values: { time: new Date(I(W).error.retryAt).toLocaleTimeString() } })]), s(e, t);
						};
						n(l, (e) => {
							I(W).error.retryAt && e(u);
						});
						var d = j(l, 2), f = (e) => {
							var t = Dt(), n = N(t, !0);
							C(() => c(n, I(W).error.diagnostic)), s(e, t);
						};
						n(d, (e) => {
							I(W).error.diagnostic && e(f);
						}), C((e) => c(o, e), [() => _()(`uploadedMedia.errors.${I(W).error.code === "invalidResponse" && I(ve) && !I(W).loaded ? "unavailable" : I(W).error.code}`)]), s(e, t);
					}, o = (e) => {
						fe(e, {
							showLoader: !0,
							text: !0,
							loaderSize: 30
						});
					}, l = (e) => {
						var t = Et(), n = N(t, !0);
						C((e) => c(n, e), [() => _()(`uploadedMedia.${I(Ve)}`)]), s(e, t);
					};
					n(i, (e) => {
						I(W)?.error ? e(a) : I(W)?.loading ? e(o, 1) : I(Ve) && e(l, 2);
					}), f(r), s(e, r);
				},
				$$slots: { default: !0 }
			});
		}
		var P = j(M, 2);
		oe(P, () => I(X), (e) => {
			{
				let t = m(() => !!I(G)), r = m(() => _()("uploadedMedia.delete")), i = m(() => _()("uploadedMedia.confirmDescription")), a = m(() => _()("uploadedMedia.delete"));
				Oe(e, {
					get open() {
						return I(t);
					},
					onOpenChange: (e) => {
						e || Ye();
					},
					get title() {
						return I(r);
					},
					get description() {
						return I(i);
					},
					get confirmLabel() {
						return I(a);
					},
					onConfirm: Xe,
					onCancel: Ye,
					preventCloseWhileConfirming: !0,
					showConfirmSpinner: !0,
					closeOnConfirm: !1,
					children: (e, t) => {
						var r = l(), i = T(r), a = (e) => {
							var t = jt(), r = T(t), i = N(r, !0), a = j(r, 2), o = N(a, !0), l = j(a, 2), u = (e) => {
								var t = At(), n = N(t, !0);
								C(() => c(n, I(G).deleteId.sha256)), s(e, t);
							};
							n(l, (e) => {
								I(G).deleteId && e(u);
							});
							var d = j(l, 2), f = N(d, !0);
							C((e, t) => {
								c(i, e), c(o, I(Te) ?? I(G).serverUrl), c(f, t);
							}, [() => _()(`uploadedMedia.${I(G).kind}`), () => I(G).url ?? _()("uploadedMedia.previewUnavailable")]), s(e, t);
						};
						n(i, (e) => {
							I(G) && e(a);
						}), s(e, r);
					},
					$$slots: { default: !0 }
				});
			}
		});
		var F = j(P, 2);
		{
			let e = m(() => I(Ae)[I(q)]?.src ?? ""), t = m(() => I(Ae)[I(q)]?.alt ?? "");
			Ce(F, {
				get src() {
					return I(e);
				},
				get alt() {
					return I(t);
				},
				onClose: Qe,
				get mediaList() {
					return I(Ae);
				},
				get currentIndex() {
					return I(q);
				},
				onNavigate: (e) => {
					y(q, e, !0);
				},
				get openingFocusOrigin() {
					return I(Me);
				},
				get show() {
					return I(J);
				},
				set show(e) {
					y(J, e, !0);
				}
			});
		}
		s(e, i);
	};
	n(it, (e) => {
		I(z) && e(at);
	}), s(e, rt);
	var st = o(nt);
	return E(), st;
}
v(["change"]);
export { Pt as default };
