import { $ as e, At as t, B as n, C as r, F as i, G as a, J as o, L as s, O as c, R as l, S as u, Tt as d, U as f, W as p, X as m, Y as h, Z as g, _, _t as v, bt as y, dt as b, f as ee, ft as x, h as S, ht as C, jt as w, k as T, lt as E, nt as D, o as O, ot as k, pt as A, q as j, r as M, rt as N, s as te, st as P, t as ne, tt as F, ut as I, v as L, vt as re, w as R, wt as ie, x as ae } from "./index-client-57Odq85c.js";
import { n as oe } from "./appRuntimeEnvironment-BvtUCHcA.js";
import { l as z } from "./relayConfigUtils-DD5f1UAM.js";
import { n as se, r as ce, t as le } from "./uploadOperation-BVOBq-hD.js";
import { pt as ue, t as de } from "./LoadingPlaceholder-DK5Hrsgb.js";
import { i as fe } from "./signedEventResultValidator-DEUEqBPK.js";
import { r as B } from "./authStore.svelte-BlvJ-J7q.js";
import { c as V, l as pe } from "./appUtils-CwuZyofa.js";
import { i as me } from "./clipboardUtils-LENkGqCk.js";
import { c as H, d as he, f as ge, i as _e, n as U, o as ve, s as W, t as ye } from "./uploadDestinationResolver-D8iw31W8.js";
import { t as be } from "./inViewportAction.svelte-DGA5HLKe.js";
import { Y as xe, at as Se, ct as G, et as Ce, i as we, lt as Te, st as Ee, ut as De } from "./App-BWEIk7fu.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/uploadMediaImageUrl.ts
function K(e, t, n) {
	try {
		let r = ge({
			rawUrl: e,
			trustedUploadUrl: he(t),
			pageProtocol: n
		}).url;
		return new URL(r).toString();
	} catch {
		return null;
	}
}
function Oe(e) {
	let t = new URL(e.currentOrigin), n = K(e.url, e.serverUrl, t.protocol);
	if (!n) return null;
	let r = new URL(`${e.basePath.endsWith("/") ? e.basePath : `${e.basePath}/`}__ehagaki-image/upload-media`, t);
	return r.searchParams.set("url", n), r.searchParams.set("server", e.serverUrl), r.toString();
}
function ke(e) {
	return !e.url || e.cacheSupported === null ? null : e.cacheSupported ? Oe({
		url: e.url,
		serverUrl: e.serverUrl,
		basePath: e.basePath,
		currentOrigin: e.currentOrigin
	}) : e.url;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/uploadMediaImageCacheClient.ts
function q() {
	let e = oe();
	return e.serviceWorkerEnabled ? e.window?.navigator.serviceWorker?.controller ?? null : null;
}
function J(e, t) {
	let n = new MessageChannel();
	return new Promise((r) => {
		let i = (e) => {
			clearTimeout(a), n.port1.close(), r(e);
		}, a = setTimeout(() => i(null), 1500);
		n.port1.onmessage = (e) => i(e.data), n.port1.onmessageerror = () => i(null);
		try {
			e.postMessage(t, [n.port2]);
		} catch {
			i(null);
		}
	});
}
function Ae(e) {
	return typeof e == "object" && !!e;
}
var je = null, Y = null;
async function Me() {
	let e = q();
	return e ? (e === je && Y || (je = e, Y = J(e, { type: Te }).then((e) => Ae(e) && e.version === 1 && e.supported === !0)), await Y) : (je = null, Y = null, !1);
}
async function X(e) {
	if (!e.length) return !0;
	let t = q();
	if (!t) return !0;
	let n = [...new Set(e)], r = !0;
	for (let e = 0; e < n.length; e += Ee.maxEntries) {
		let i = await J(t, {
			type: G,
			urls: n.slice(e, e + Ee.maxEntries)
		});
		r = Ae(i) && i.version === 1 && i.success === !0 && r;
	}
	return r;
}
// D:/ドキュメント/GitHub/ehagaki/src/components/UploadedMediaPreview.svelte
var Ne = a("<!> <!>", 1), Pe = a("<button type=\"button\" class=\"image-open\"><img alt=\"\" referrerpolicy=\"no-referrer\" class=\"svelte-1gq8ela\"/></button>"), Fe = a("<span class=\"svg-icon\" aria-hidden=\"true\"></span>"), Ie = a("<video controls=\"\" playsinline=\"\" preload=\"metadata\" class=\"svelte-1gq8ela\"><track kind=\"captions\"/></video> <!>", 3), Le = a("<div class=\"video-placeholder svelte-1gq8ela\"><!></div>"), Re = a("<div><!></div>"), ze = {
	hash: "svelte-1gq8ela",
	code: ".preview.svelte-1gq8ela {position:relative;width:100%;min-width:0;aspect-ratio:1;}\n    /* Reserve room for close, copy, delete and native playback controls. */.preview-active.svelte-1gq8ela {min-height:204px;}.preview-empty.svelte-1gq8ela {display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;}img.svelte-1gq8ela, video.svelte-1gq8ela {display:block;width:100%;height:100%;}img.svelte-1gq8ela {object-fit:cover;}video.svelte-1gq8ela {position:absolute;inset:0;object-fit:contain;}video.svelte-1gq8ela, .video-placeholder.svelte-1gq8ela {background:#181818;}.video-placeholder.svelte-1gq8ela {width:100%;height:100%;display:grid;place-items:center;}.preview.svelte-1gq8ela button.image-open {display:block;width:100%;height:100%;min-width:0;min-height:0;max-width:none;margin:0;padding:0;border:0;background:transparent;cursor:pointer;}.preview.svelte-1gq8ela button.media-video-button {padding:0;width:44px;height:44px;min-width:44px;color:white;}.preview.svelte-1gq8ela button.media-video-button:hover:not(:disabled) .svg-icon {background-color:white;}.preview.svelte-1gq8ela button.video-close {position:absolute;top:4px;right:4px;}.preview.svelte-1gq8ela button.video-open {width:56px;height:56px;}"
};
function Be(i, a) {
	d(a, !0), T(i, ze);
	let s = () => te(ue, "$_", u), [u, h] = O(), _ = Se("icons/play_arrow_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"), S = v(!1), D = v(!1), A = v(void 0), j = y(() => ke({
		url: a.item.url,
		serverUrl: a.item.serverUrl,
		cacheSupported: a.cacheSupported,
		basePath: "./",
		currentOrigin: window.location.origin
	}));
	function M(e) {
		return { destroy() {
			e.pause(), e.removeAttribute("src"), e.load();
		} };
	}
	async function N() {
		C(D, !0), a.item.url && a.cacheSupported && await X([a.item.url]);
	}
	ne(() => {
		F(A)?.pause();
	});
	var P = Re();
	let re;
	var ae = E(P), oe = (e) => {
		{
			let t = y(() => s()("uploadedMedia.previewUnavailable"));
			de(e, { get text() {
				return F(t);
			} });
		}
	}, z = (r) => {
		var i = p(), c = I(i), u = (e) => {
			var r = Ne(), i = I(r);
			{
				let e = y(() => s()("uploadedMedia.previewUnavailable"));
				de(i, { get text() {
					return F(e);
				} });
			}
			var a = x(i, 2);
			V(a, {
				onClick: () => {
					C(D, !1);
				},
				children: (e, r) => {
					t();
					var i = o();
					k((e) => n(i, e), [() => s()("uploadedMedia.retry")]), f(e, i);
				},
				$$slots: { default: !0 }
			}), f(e, r);
		}, d = (t) => {
			var n = Pe(), r = b(n);
			k((e) => {
				L(n, "aria-label", e), L(r, "src", F(j));
			}, [() => s()("uploadedMedia.openImage")]), m("click", n, (e) => {
				e.currentTarget instanceof HTMLElement && a.onOpenImage?.(e.currentTarget);
			}), g("error", r, N), e(r), f(t, n);
		};
		l(c, (e) => {
			F(D) ? e(u) : F(S) && a.cacheSupported !== null && F(j) && e(d, 1);
		}), f(r, i);
	}, se = (e) => {
		var t = Ie(), n = I(t);
		ee(n, (e) => C(A, e), () => F(A)), c(n, (e) => M?.(e));
		var r = x(n, 2);
		{
			let e = y(() => s()("uploadedMedia.closeVideo")), t = y(() => s()("uploadedMedia.closeVideo"));
			V(r, {
				variant: "close",
				shape: "circle",
				contentLayout: "icon",
				className: "media-video-button video-close",
				get ariaLabel() {
					return F(e);
				},
				get title() {
					return F(t);
				},
				get onClick() {
					return a.onCloseVideo;
				},
				children: (e, t) => {
					var n = Fe();
					f(e, n);
				},
				$$slots: { default: !0 }
			});
		}
		k(() => L(n, "src", a.item.url)), g("ended", n, function(...e) {
			a.onCloseVideo?.apply(this, e);
		}), f(e, t);
	}, ce = (e) => {
		var t = Le(), n = E(t);
		{
			let e = y(() => s()("uploadedMedia.openVideo")), t = y(() => s()("uploadedMedia.openVideo"));
			V(n, {
				variant: "close",
				shape: "circle",
				contentLayout: "icon",
				className: "media-video-button video-open",
				get ariaLabel() {
					return F(e);
				},
				get title() {
					return F(t);
				},
				get onClick() {
					return a.onOpenVideo;
				},
				children: (e, t) => {
					var n = Fe();
					let i;
					k(() => i = r(n, "", i, { "mask-image": `url("${_}")` })), f(e, n);
				},
				$$slots: { default: !0 }
			});
		}
		w(t), f(e, t);
	};
	l(ae, (e) => {
		a.item.url ? a.item.kind === "image" ? e(z, 1) : a.active ? e(se, 2) : e(ce, -1) : e(oe);
	}), w(P), c(P, (e, t) => be?.(e, t), () => ({
		enabled: !0,
		rootMargin: "200px",
		onEnterView: () => {
			C(S, !0);
		}
	})), k(() => re = R(P, 1, "preview svelte-1gq8ela", null, re, {
		"preview-active": a.item.kind === "video" && a.active,
		"preview-empty": !a.item.url || a.item.kind === "image" && (F(D) || !F(S) || a.cacheSupported === null)
	})), f(i, P), ie(), h();
}
h(["click"]);
// D:/ドキュメント/GitHub/ehagaki/src/lib/upload/uploadServerRegistration.ts
var Z = class extends Error {
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
function Q(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function We(e) {
	e.assertSession(), ce(e.signal);
	let t = Ue(e.destination);
	if (!t) throw new Z("serverError");
	return t;
}
async function Ge(e, t, n) {
	let r = new AbortController(), i = () => r.abort();
	e.signal?.addEventListener("abort", i, { once: !0 }), e.signal?.aborted && r.abort();
	let a = setTimeout(i, 2e4);
	try {
		e.assertSession();
		let i = await le(e.fetch(t, {
			...n,
			signal: r.signal,
			credentials: "omit",
			redirect: "error",
			cache: "no-store",
			referrerPolicy: "no-referrer"
		}), r.signal), a = await le(i.json(), r.signal);
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
	if (!n.ok || !Q(r) || !Q(r.availableDomains)) return null;
	let i = r.availableDomains[t.domain];
	if (!Q(i) || i.requireinvite !== !1 || i.requirepayment !== !1 || i.maxsatoshi !== 0) return null;
	let a = i.minUsernameLength, o = i.maxUsernameLength;
	return typeof a != "number" || typeof o != "number" || !Number.isSafeInteger(a) || !Number.isSafeInteger(o) || a < 1 || o < a ? null : {
		minLength: a,
		maxLength: o
	};
}
function $(e, t) {
	return /^[a-zA-Z0-9_-]+$/.test(e) && e.length >= t.minLength && e.length <= t.maxLength;
}
async function qe(e, t, n, r) {
	let i = We(e);
	if (!$(t, n)) throw new Z("invalidUsername");
	let a = `${i.origin}/api/v2/register`, o = {
		pubkey: e.expectedPubkey,
		username: t,
		domain: i.domain
	}, s;
	try {
		if (s = await le(e.authService.buildAuthHeader(a, "POST", o), e.signal), e.assertSession(), !s) throw Error();
	} catch {
		throw ce(e.signal), new Z("authentication");
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
		throw ce(e.signal), new Z("unknownRegistration");
	}
	let { response: l, data: u } = c;
	if ([
		400,
		401,
		422
	].includes(l.status) && Q(u) && u.status === "error" && u.message === "Invalid username format") throw new Z("invalidUsername");
	if (Q(u) && u.status === "error" && l.status === 406) {
		if (u.message === "Username already registered") throw new Z("usernameTaken");
		if (u.message === "Pubkey already registered") return "alreadyRegistered";
	}
	if (l.status === 429) throw new Z("rateLimited");
	if (l.status === 401 || l.status === 403) return "external";
	if (!l.ok || !Q(u) || u.status !== "success") throw new Z("unknownRegistration");
	if (u.otc === !0 || typeof u.payment_request == "string" && u.payment_request !== "" || typeof u.satoshi == "number" && u.satoshi > 0) return "external";
	if (u.otc !== !1 || u.payment_request !== "" || u.satoshi !== 0) throw new Z("unknownRegistration");
	return "registered";
}
// D:/ドキュメント/GitHub/ehagaki/src/components/UploadServerRegistration.svelte
var Je = a("<p class=\"svelte-1fagx79\"> </p> <div><!></div>", 1), Ye = a("<!> <!>", 1), Xe = a("<p role=\"status\" class=\"svelte-1fagx79\"> </p> <a target=\"_blank\" rel=\"noopener noreferrer\"> </a> <!>", 1), Ze = a("<p role=\"alert\" class=\"svelte-1fagx79\"> </p> <!> <a target=\"_blank\" rel=\"noopener noreferrer\"> </a>", 1), Qe = a("<p role=\"alert\" class=\"svelte-1fagx79\"> </p>"), $e = a("<form class=\"svelte-1fagx79\"><label> </label> <input autocomplete=\"off\" autocapitalize=\"none\" required=\"\" class=\"svelte-1fagx79\"/> <p class=\"svelte-1fagx79\"> </p> <p class=\"svelte-1fagx79\"> <a target=\"_blank\" rel=\"noopener noreferrer\"> </a></p> <!> <div class=\"actions svelte-1fagx79\"><!> <!></div></form>"), et = a("<p class=\"target svelte-1fagx79\"> </p> <!>", 1), tt = a("<section class=\"registration svelte-1fagx79\"><!></section>"), nt = {
	hash: "svelte-1fagx79",
	code: ".registration.svelte-1fagx79 {margin:8px 12px;padding:12px;border:1px solid var(--border);border-radius:6px;min-width:0;overflow-wrap:anywhere;}form.svelte-1fagx79, .registration.svelte-1fagx79 {display:flex;flex-direction:column;gap:8px;}p.svelte-1fagx79 {margin:0;}.target.svelte-1fagx79 {font-weight:bold;}input.svelte-1fagx79 {box-sizing:border-box;width:100%;min-width:0;padding:8px;min-height:44px;font:inherit;color:var(--text);background:var(--dialog-bg);border:1px solid var(--border);border-radius:4px;}.actions.svelte-1fagx79 {display:flex;flex-wrap:wrap;gap:8px;}"
};
function rt(e, r) {
	let i = j();
	d(r, !0), T(e, nt);
	let a = () => te(ue, "$_", s), [s, c] = O(), u = v(""), p = v(""), m = v(void 0), h = v(void 0), A = y(() => r.registration.phase === "submitting"), M = y(() => !!r.registration.policy && $(F(u), r.registration.policy)), N = y(() => r.registration.error && (!["usernameTaken", "invalidUsername"].includes(r.registration.error) || F(u) === F(p)) ? r.registration.error : null);
	function ne() {
		C(u, r.initialUsername.trim(), !0), C(p, ""), r.onOpen();
	}
	function re() {
		r.onCancel(), D().then(() => F(h)?.querySelector("button")?.focus({ preventScroll: !0 }));
	}
	P(() => {
		r.registration.phase === "ready" && D().then(() => F(m)?.focus({ preventScroll: !0 }));
	});
	var R = tt(), ae = E(R), oe = (e) => {
		var r = Je(), i = I(r), s = b(i, !0), c = x(i, 2), l = E(c);
		V(l, {
			onClick: ne,
			children: (e, r) => {
				t();
				var i = o();
				k((e) => n(i, e), [() => a()("uploadedMedia.registration.open")]), f(e, i);
			},
			$$slots: { default: !0 }
		}), w(c), k((e) => n(s, e), [() => a()("uploadedMedia.registration.offer")]), f(e, r);
	}, z = (e) => {
		var s = et(), c = I(s), d = b(c, !0), h = x(c, 2), v = (e) => {
			var r = Ye(), i = I(r);
			de(i, {
				showLoader: !0,
				text: !0
			});
			var s = x(i, 2);
			V(s, {
				onClick: re,
				children: (e, r) => {
					t();
					var i = o();
					k((e) => n(i, e), [() => a()("common.cancel")]), f(e, i);
				},
				$$slots: { default: !0 }
			}), f(e, r);
		}, T = (e) => {
			var i = Xe(), s = I(i), c = b(s, !0), l = x(s, 2), u = b(l, !0), d = x(l, 2);
			V(d, {
				onClick: () => r.onRefresh(),
				children: (e, r) => {
					t();
					var i = o();
					k((e) => n(i, e), [() => a()("uploadedMedia.refresh")]), f(e, i);
				},
				$$slots: { default: !0 }
			}), k((e, t) => {
				n(c, e), L(l, "href", r.registration.target.registrationUrl), n(u, t);
			}, [() => a()("uploadedMedia.registration.external"), () => a()("uploadedMedia.registration.official")]), f(e, i);
		}, D = (e) => {
			var i = Ze(), s = I(i), c = b(s, !0), l = x(s, 2);
			V(l, {
				onClick: () => r.onRefresh(),
				children: (e, r) => {
					t();
					var i = o();
					k((e) => n(i, e), [() => a()("uploadedMedia.refresh")]), f(e, i);
				},
				$$slots: { default: !0 }
			});
			var u = x(l, 2), d = b(u, !0);
			k((e, t) => {
				n(c, e), L(u, "href", r.registration.target.registrationUrl), n(d, t);
			}, [() => a()("uploadedMedia.registration.errors.unknownRegistration"), () => a()("uploadedMedia.registration.official")]), f(e, i);
		}, O = (e) => {
			var s = $e(), c = E(s), d = b(c, !0), h = x(c, 2);
			_(h), L(h, "spellcheck", !1), ee(h, (e) => C(m, e), () => F(m));
			var v = x(h, 2), T = b(v, !0), D = x(v, 2), O = E(D), j = x(O), te = b(j, !0);
			w(D);
			var P = x(D, 2), ne = (e) => {
				var t = Qe(), r = b(t, !0);
				k((e) => {
					L(t, "id", `${i}-error`), n(r, e);
				}, [() => a()(`uploadedMedia.registration.errors.${F(N)}`)]), f(e, t);
			};
			l(P, (e) => {
				F(N) && e(ne);
			});
			var I = x(P, 2), R = E(I);
			{
				let e = y(() => !F(M) || F(A));
				V(R, {
					type: "submit",
					get disabled() {
						return F(e);
					},
					children: (e, r) => {
						t();
						var i = o();
						k((e) => n(i, e), [() => a()(F(A) ? "uploadedMedia.registration.submitting" : "uploadedMedia.registration.submit")]), f(e, i);
					},
					$$slots: { default: !0 }
				});
			}
			var ie = x(R, 2);
			V(ie, {
				onClick: re,
				children: (e, r) => {
					t();
					var i = o();
					k((e) => n(i, e), [() => a()("common.cancel")]), f(e, i);
				},
				$$slots: { default: !0 }
			}), w(I), w(s), k((e, t, a, o, l) => {
				L(s, "aria-busy", F(A)), L(c, "for", i), n(d, e), L(h, "id", i), h.disabled = F(A), L(h, "aria-describedby", `${i}-help${F(N) ? ` ${i}-error` : ""}`), L(h, "aria-invalid", t), L(v, "id", `${i}-help`), n(T, a), n(O, `${o ?? ""} `), L(j, "href", r.registration.target.termsUrl), n(te, l);
			}, [
				() => a()("uploadedMedia.registration.username"),
				() => !F(M) || !!F(N) && ["invalidUsername", "usernameTaken"].includes(F(N)),
				() => a()("uploadedMedia.registration.usernameHelp", { values: {
					min: r.registration.policy.minLength,
					max: r.registration.policy.maxLength
				} }),
				() => a()("uploadedMedia.registration.agreement"),
				() => a()("uploadedMedia.registration.terms")
			]), g("submit", s, (e) => {
				e.preventDefault(), F(M) && !F(A) && (C(p, F(u), !0), r.onRegister(F(u)));
			}), S(h, () => F(u), (e) => C(u, e)), f(e, s);
		};
		l(h, (e) => {
			r.registration.phase === "loading" ? e(v) : r.registration.phase === "external" ? e(T, 1) : r.registration.phase === "unknown" ? e(D, 2) : e(O, -1);
		}), k(() => n(d, r.registration.target.domain)), f(e, s);
	};
	l(ae, (e) => {
		r.registration.phase === "offer" ? e(oe) : e(z, -1);
	}), w(R), ee(R, (e) => C(h, e), () => F(h)), k((e) => L(R, "aria-label", e), [() => a()("uploadedMedia.registration.title")]), f(e, R), ie(), c();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/upload/uploadMediaManagementController.ts
var it = () => ({
	destinations: [],
	selectedId: null,
	current: null
});
function at(e) {
	return [
		e.protocol,
		e.serverUrl,
		e.resolvedUploadUrl,
		e.nip96ServerUrl,
		e.nip96UrlMode
	].join("\n");
}
function ot(e) {
	e.localSnapshot = null, e.nextPage = null, e.needsRefresh = !0;
}
var st = class {
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
		for (let e of this.states.values()) e.abort?.abort(), e.generation++, e.deletingId && e.deleteDispatched && (e.error = new W("unknownDelete"), ot(e)), e.loading = !1, e.deletingId = null, e.deleteDispatched = !1, this.stopRegistration(e);
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
		let n = this.epoch, r = ++this.configurationGeneration, i = () => this.active && n === this.epoch && r === this.configurationGeneration && this.pubkey === e && (this.deps.auth ?? B).value.isAuthenticated && (this.deps.auth ?? B).value.pubkey === e;
		this.configuring = !0, this.configurationError = null, this.emit();
		try {
			let t = await this.deps.loadDestinations?.(e) ?? [];
			i() && this.configure(e, t);
		} catch {
			i() && (this.configurationError = new W("invalidDestination"));
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
			t && at(t.destination) === at(e) ? t.destination = e : (t?.abort?.abort(), this.states.set(e.id, {
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
				e?.abort?.abort(), e && (e.deletingId && e.deleteDispatched && (e.error = new W("unknownDelete"), ot(e)), e.generation++, e.loading = !1, e.deletingId = null, e.deleteDispatched = !1, this.stopRegistration(e));
			}
			this.selectedId = e, this.emit(), this.states.get(e)?.loaded || this.load();
		}
	}
	begin(e) {
		e.abort?.abort();
		let t = new AbortController();
		e.abort = t;
		let n = ++e.generation, r = this.epoch, i = this.pubkey, a = { ...e.destination }, o = () => this.active && (this.deps.auth ?? B).value.isAuthenticated && (this.deps.auth ?? B).value.pubkey === i && this.epoch === r && this.pubkey === i && this.states.get(a.id) === e && e.generation === n && !t.signal.aborted, s = () => {
			if (!o()) throw se();
			fe(this.deps.auth ?? B, i);
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
				}) ?? new _e({
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
				if (!e.isAuthenticated || e.pubkey !== this.pubkey || !t.localSnapshot.length) return;
				t.error = null, t.notice = null, t.items.push(...t.localSnapshot.splice(0, 24)), this.emit();
			} else (!e || !t.loaded || t.needsRefresh || t.nextPage) && (e = e && !t.needsRefresh && !!t.nextPage, !e && t.localSnapshot !== null && ot(t), t.notice = null, t.registration = null, await this.loadPage(t, e));
		}
	}
	async loadPage(e, t, n = this.begin(e)) {
		e.loading = !0, e.error = null, this.emit();
		try {
			let r = (this.deps.getAdapter ?? U)(e.destination.protocol);
			if (!r.listMediaPage || !r.deleteMedia) throw new W("unavailable");
			let i = await r.listMediaPage({
				...n.params,
				page: t ? e.nextPage : null,
				context: t ? e.context : null
			});
			if (n.params.assertSession(), !n.current()) return;
			if (i.localSnapshot && (e.destination.protocol !== "blossom" || i.nextPage)) throw new W("invalidResponse");
			let a = i.nextPage?.protocol === "blossom" ? i.nextPage.cursor : null;
			if (t && a && e.cursors.has(a)) throw new W("invalidResponse");
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
			e.error = ve(t);
			let r = Ue(e.destination);
			r && [401, 403].includes(e.error.status ?? 0) && (e.registration = {
				target: r,
				phase: "offer",
				policy: null,
				error: null
			}), e.error.code === "unavailable" && (e.support = "unavailable"), e.error.code === "invalidResponse" && ot(e);
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
			let i = await qe(n.params, e, r, () => {
				n.params.assertSession(), t.registrationDispatched = !0;
			});
			if (!n.current()) return;
			if (t.registrationDispatched = !1, i === "external") t.registration = {
				...t.registration,
				phase: "external"
			};
			else {
				let e = t.registration.target;
				t.registration = null, ot(t), await this.loadPage(t, !1, n), n.current() && t.registration && (t.registration = {
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
			let e = (this.deps.getAdapter ?? U)(t.destination.protocol);
			if (!e.deleteMedia) throw new W("unavailable");
			if (await e.deleteMedia({
				...r.params,
				item: n,
				context: t.context
			}), r.current() && (t.deleteDispatched = !1, t.items = t.items.filter((e) => e.deleteId?.sha256 !== i), ot(t), t.notice = "deleted", this.emit()), a.length) {
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
			return r.current() && (t.error = ve(e), t.error.code === "unknownDelete" && ot(t)), !1;
		} finally {
			r.current() && (t.deletingId = null, t.deleteDispatched = !1, this.emit());
		}
	}
};
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/useUploadMediaManagement.svelte.ts
function ct() {
	let e = v(A(it()));
	return {
		get value() {
			return F(e);
		},
		controller: new st({
			loadDestinations: (e) => H.getAll(e),
			evictImages: X,
			onChange: (t) => {
				C(e, t, !0);
			}
		})
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/components/UploadedMediaTabContent.svelte
var lt = a("<p class=\"media-status svelte-hlt8mi\" role=\"status\"> </p>"), ut = a("<p class=\"media-status svelte-hlt8mi\" role=\"alert\"> </p> <!>", 1), dt = a("<option class=\"svelte-hlt8mi\"> </option>"), ft = a("<span class=\"svg-icon\" aria-hidden=\"true\"></span>"), pt = a("<div class=\"media-status nostr-build-help svelte-hlt8mi\" role=\"status\"><p class=\"svelte-hlt8mi\"> </p> <a href=\"https://account.nostr.build/\" target=\"_blank\" rel=\"noopener noreferrer\" tabindex=\"0\" class=\"svelte-hlt8mi\"> </a> <a href=\"https://nostr.build/delete/\" target=\"_blank\" rel=\"noopener noreferrer\" tabindex=\"0\" class=\"svelte-hlt8mi\"> </a></div>"), mt = a("<p class=\"media-status svelte-hlt8mi\"> </p>"), ht = a("<p class=\"media-status svelte-hlt8mi\"> </p> <!>", 1), gt = a("<time> </time>"), _t = a("<span class=\"svg-icon media-delete-icon svelte-hlt8mi\" aria-hidden=\"true\"></span>"), vt = a("<article><!> <!> <div class=\"media-overlay svelte-hlt8mi\"><div class=\"media-metadata svelte-hlt8mi\"><span> </span> <span><!></span></div> <!></div></article>"), yt = a("<div class=\"list-end-actions svelte-hlt8mi\"><!></div>"), bt = a("<!> <!> <!> <!> <div class=\"media-list svelte-hlt8mi\" tabindex=\"-1\"></div> <!>", 1), xt = a("<div class=\"media-toolbar svelte-hlt8mi\"><select class=\"media-server-select svelte-hlt8mi\"></select> <!></div> <!>", 1), St = a("<p class=\"svelte-hlt8mi\"> </p>"), Ct = a("<p class=\"diagnostic svelte-hlt8mi\"> </p>"), wt = a("<!> <p class=\"svelte-hlt8mi\"> </p> <!> <!>", 1), Tt = a("<div class=\"media-feedback svelte-hlt8mi\"><!></div>"), Et = a("<p class=\"server-url svelte-hlt8mi\"> </p>"), Dt = a("<p class=\"svelte-hlt8mi\"> </p> <p class=\"server-url svelte-hlt8mi\"> </p> <!> <p class=\"server-url svelte-hlt8mi\"> </p>", 1), Ot = a("<div class=\"uploaded-media-dialog uploaded-media-content svelte-hlt8mi\"><div class=\"media-management svelte-hlt8mi\"><!></div></div> <!> <!> <!>", 1), kt = {
	hash: "svelte-hlt8mi",
	code: ".uploaded-media-content.svelte-hlt8mi {background:var(--dialog-bg);flex:1;min-height:0;overflow:auto;width:100%;}.media-management.svelte-hlt8mi {flex:none;width:100%;min-width:0;display:flex;flex-direction:column;}.uploaded-media-dialog button {height:auto;min-height:44px;max-width:100%;padding:8px 12px;}.uploaded-media-dialog button.image-open {display:block;width:100%;height:100%;min-height:0;max-width:none;margin:0;padding:0;border:none;background:transparent;cursor:pointer;}p.svelte-hlt8mi {margin:0;}.media-toolbar.svelte-hlt8mi {display:grid;grid-template-columns:minmax(0, 1fr) 44px;gap:4px;padding:8px;}.media-status.svelte-hlt8mi {margin:8px 12px;}.nostr-build-help.svelte-hlt8mi {display:flex;flex-direction:column;gap:4px;min-width:0;padding:12px;border:1px solid var(--border);border-radius:6px;overflow-wrap:anywhere;}.nostr-build-help.svelte-hlt8mi a:where(.svelte-hlt8mi) {display:flex;align-items:center;align-self:flex-start;min-height:44px;max-width:100%;}.media-feedback.svelte-hlt8mi {overflow-wrap:anywhere;}.media-server-select.svelte-hlt8mi {width:100%;min-width:0;min-height:44px;max-width:100%;padding:8px 32px 8px 10px;border:1px solid var(--border);border-radius:6px;background:var(--dialog-bg);color:var(--text);font:inherit;}.media-server-select.svelte-hlt8mi option:where(.svelte-hlt8mi) {background:var(--dialog-bg);color:var(--text);}.list-end-actions.svelte-hlt8mi {display:flex;width:100%;padding:10px;box-sizing:border-box;}.uploaded-media-dialog button.media-load-more-button {width:100%;}.uploaded-media-dialog button.media-refresh-button {width:44px;height:44px;padding:0;background:transparent;border:none;}.uploaded-media-dialog button.media-delete-button {flex:none;padding:0;background:transparent;border:none;color:white;--text: white;width:44px;min-width:44px;max-width:44px;height:44px;min-height:44px;max-height:44px;}.uploaded-media-dialog button.media-delete-button:hover:not(:disabled) {background:rgb(255 255 255 / 15%);color:white;}.uploaded-media-dialog button.media-delete-button:hover:not(:disabled) .svg-icon {background-color:white;}.uploaded-media-dialog button.media-delete-button:focus-visible {outline:2px solid white;outline-offset:-2px;}.media-delete-icon.svelte-hlt8mi {width:24px;height:24px;--svg: currentColor;}.server-url.svelte-hlt8mi, .diagnostic.svelte-hlt8mi {overflow-wrap:anywhere;font-size:.875rem;}.media-list.svelte-hlt8mi {display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));gap:2px;}article.svelte-hlt8mi {position:relative;min-width:0;align-self:start;}.uploaded-media-dialog button.media-copy-button {position:absolute;top:4px;right:4px;z-index:1;width:44px;min-width:44px;height:44px;min-height:44px;padding:0;color:white;--text: white;}.uploaded-media-dialog button.media-copy-button:hover:not(:disabled) .svg-icon {background-color:white;}.video-active.svelte-hlt8mi button.media-copy-button {top:52px;}.media-overlay.svelte-hlt8mi {position:absolute;inset:auto 0 0;display:flex;align-items:flex-end;justify-content:space-between;gap:4px;padding:16px 4px 4px 8px;color:white;background:linear-gradient(transparent, rgb(0 0 0 / 70%));pointer-events:none;}.media-metadata.svelte-hlt8mi {min-width:0;align-self:center;display:flex;flex-direction:column;font-size:.6875rem;line-height:1.5;overflow-wrap:anywhere;text-shadow:0 1px 2px rgb(0 0 0 / 70%);}.media-overlay.svelte-hlt8mi button {pointer-events:auto;}\n    /* Keep native video playback controls available beneath the overlay. */.video-active.svelte-hlt8mi .media-overlay:where(.svelte-hlt8mi) {bottom:56px;}"
};
function At(e, a) {
	d(a, !0), T(e, kt);
	let c = () => te(ue, "$_", h), [h, g] = O(), _ = M(a, "onBusyChange", 3, () => void 0), S = v(!1), j = v(!1), oe = v(!1), z = y(() => a.show && !F(oe));
	function se() {
		C(oe, !1), H.controller.activate();
	}
	function ce() {
		C(oe, !0), Y++, re(X), C(G, null), C(K, null), C(Fe, !0), $(), H.controller.suspend();
	}
	function le() {
		return H.controller.busy;
	}
	function fe() {
		return F(J);
	}
	let H = ct(), he = Se("icons/delete_forever_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"), ge = Se("icons/refresh_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"), _e = Se("icons/file_copy_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"), U = y(() => H.value.current), ve = y(() => !!F(U) && /^https?:\/\/nostpic\.com(?::\d+)?(?:\/|$)/i.test(F(U).destination.serverUrl));
	function W(e) {
		try {
			let t = new URL(e);
			return t.origin === "https://nostr.build" && !t.username && !t.password && !t.search && !t.hash && ["/", "/api/v2/nip96/upload"].includes(t.pathname.replace(/\/$/, "") || "/");
		} catch {
			return !1;
		}
	}
	let ye = y(() => F(U)?.destination.protocol === "nip96" && W(F(U).destination.serverUrl) && F(U).error?.code === "unavailable" && F(U).error.status === 405), be = v(null), G = v(null), Te = v(null), Ee = null, K = v(null), Oe = v(A([])), q = v(-1), J = v(!1), Ae = v(null), je = v(void 0), Y = 0, X = v(0), Ne = null, Pe = v(null), Fe = v(!1), Ie = null, Le = y(() => F(U)?.notice ?? null), Re = y(() => !!F(U)?.deletingId), ze = y(() => F(U)?.registration?.phase === "submitting"), Z = y(() => [
		B.value.pubkey,
		F(U)?.destination.id,
		F(U)?.destination.protocol,
		F(U)?.destination.serverUrl,
		F(U)?.destination.resolvedUploadUrl,
		F(U)?.destination.nip96ServerUrl,
		F(U)?.destination.nip96UrlMode
	].join("\n")), Ve = y(() => F(z) && !F(G) && !F(Re) && !F(ye) && !!(F(U)?.error && !F(U).registration || F(U)?.loading && F(U).loaded || F(Le) && !F(Fe)));
	P(() => {
		let e = F(Le), t = F(Re), n = F(Z), r = Ie !== null && Ie !== n;
		Ie = n;
		let i = r || !N(() => F(z));
		if (C(Fe, i, !0), !e || t || i) return;
		let a = setTimeout(() => {
			C(Fe, !0);
		}, 3500);
		return () => clearTimeout(a);
	}), P(() => {
		let e = a.show;
		N(() => e ? se() : ce());
	});
	function He(e) {
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
	function Ue(e) {
		return (/* @__PURE__ */ new Date(e * 1e3)).toLocaleString(void 0, {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit"
		});
	}
	function Q() {
		re(X), Ne = null, C(G, null), C(K, null), $(), H.controller.invalidate();
	}
	P(() => {
		let e = F(z), t = B.value, n = we.value.destinations;
		N(() => {
			if (!e) return;
			H.controller.activate();
			let r = t.isAuthenticated ? t.pubkey : null;
			n.length ? H.controller.configure(r, n) : H.controller.configureSaved(r), C(S, !0);
		});
	}), P(() => {
		F(z) && !F(j) && a.onInitialReady && F(S) && !H.value.configuring && (!B.value.isAuthenticated || H.value.configurationError || H.value.destinations.length === 0 || F(U)?.loaded || F(U)?.items.length || F(U)?.error) && (C(j, !0), a.onInitialReady());
	}), P(() => {
		if (!F(z) || F(be) !== null) return;
		let e = ++Y;
		Me().then((t) => {
			e === Y && C(be, t, !0);
		});
	}), P(() => {
		let e = H.value.selectedId, t = `${B.value.pubkey}\n${e}\n${F(U)?.destination.protocol}\n${F(U)?.destination.serverUrl}\n${F(U)?.context?.endpoint}`;
		N(() => {
			t !== Ne && (Ne = t, re(X), C(G, null), C(K, null), $());
		});
	}), P(() => {
		let e = F(U);
		N(() => {
			F(G) && (e?.destination.serverUrl !== F(G).serverUrl || e?.context?.endpoint !== F(Te) || !e.deletingId && !e.items.some((e) => e.id === F(G)?.id)) && C(G, null), F(K) && !e?.items.some((e) => e.id === F(K)) && C(K, null);
			let t = F(Oe)[F(q)]?.id;
			F(J) && t && !e?.items.some((e) => e.id === t && e.kind === "image") && $();
		});
	}), P(() => {
		_()(!!F(U)?.deletingId || F(ze));
	}), ne(() => {
		Y++, Q();
	});
	function We() {
		let e = F(X), t = Ee;
		C(G, null), D().then(() => e === F(X) && t?.isConnected && t.focus({ preventScroll: !0 }));
	}
	async function Ge() {
		let e = F(G), t = F(X), n = Ee;
		!e || F(U)?.destination.serverUrl !== e.serverUrl || F(U).context?.endpoint !== F(Te) || !F(U).items.some((t) => t.id === e.id && t.deleteId?.sha256 === e.deleteId?.sha256) ? We() : (await H.controller.delete(e.id), t === F(X) && (C(G, null), await D(), t === F(X) && (n?.isConnected ? n.focus({ preventScroll: !0 }) : F(je)?.focus({ preventScroll: !0 }))));
	}
	async function Ke(e) {
		let t = F(Z);
		await H.controller.register(e), await D(), F(z) && t === F(Z) && !F(U)?.registration && F(je)?.focus({ preventScroll: !0 });
	}
	function $() {
		C(J, !1), C(Oe, [], !0), C(q, -1), C(Ae, null);
	}
	function qe(e) {
		return ke({
			url: e.url,
			serverUrl: e.serverUrl,
			cacheSupported: F(be),
			basePath: "./",
			currentOrigin: window.location.origin
		});
	}
	function Je(e, t) {
		return t.stopPropagation(), e.url ? me(e.url, "URL", navigator, window) : !1;
	}
	function Ye(e, t) {
		let n = (F(U)?.items ?? []).flatMap((e) => {
			if (e.kind !== "image") return [];
			let t = qe(e);
			return t ? [{
				id: e.id,
				src: t,
				alt: c()("uploadedMedia.image"),
				type: "image"
			}] : [];
		}), r = n.findIndex((t) => t.id === e.id);
		r < 0 || (C(Oe, n, !0), C(q, r, !0), C(Ae, t, !0), C(J, !0));
	}
	var Xe = {
		activate: se,
		suspend: ce,
		isBusy: le,
		isFullscreen: fe,
		invalidateSession: Q
	}, Ze = p(), Qe = I(Ze), $e = (e) => {
		var d = Ot(), h = I(d), g = E(h), _ = E(g), v = (e) => {
			var t = lt(), r = b(t, !0);
			k((e) => n(r, e), [() => c()("uploadedMedia.errors.authentication")]), f(e, t);
		}, S = (e) => {
			de(e, {
				showLoader: !0,
				text: !0
			});
		}, T = (e) => {
			var r = ut(), i = I(r), a = b(i, !0), s = x(i, 2);
			V(s, {
				onClick: () => H.controller.configureSaved(B.value.pubkey),
				children: (e, r) => {
					t();
					var i = o();
					k((e) => n(i, e), [() => c()("uploadedMedia.refresh")]), f(e, i);
				},
				$$slots: { default: !0 }
			}), k((e) => n(a, e), [() => c()("uploadedMedia.errors.invalidDestination")]), f(e, r);
		}, O = (e) => {
			var t = lt(), r = b(t, !0);
			k((e) => n(r, e), [() => c()("uploadedMedia.noServers")]), f(e, t);
		}, A = (e) => {
			var d = xt(), h = I(d), g = E(h);
			i(g, 21, () => H.value.destinations, (e) => e.id, (e, t) => {
				var r = dt(), i = b(r, !0), a = {};
				k(() => {
					n(i, F(t).name), a !== (a = F(t).id) && (r.value = (r.__value = a) ?? "");
				}), f(e, r);
			}), w(g);
			var _;
			ae(g);
			var v = x(g, 2), S = (e) => {
				{
					let t = y(() => c()("uploadedMedia.refresh")), n = y(() => c()("uploadedMedia.refresh")), i = y(() => F(U).loading || !!F(U).deletingId || F(ze));
					V(e, {
						shape: "square",
						contentLayout: "icon",
						className: "media-refresh-button",
						get ariaLabel() {
							return F(t);
						},
						get title() {
							return F(n);
						},
						onClick: () => {
							C(K, null), $(), H.controller.load();
						},
						get disabled() {
							return F(i);
						},
						children: (e, t) => {
							var n = ft();
							let i;
							k(() => i = r(n, "", i, { "mask-image": `url("${ge}")` })), f(e, n);
						},
						$$slots: { default: !0 }
					});
				}
			};
			l(v, (e) => {
				F(U) && e(S);
			}), w(h), ee(h, (e) => C(Pe, e), () => F(Pe));
			var T = x(h, 2), O = (e) => {
				var u = bt(), d = I(u), m = (e) => {
					var t = pt(), r = E(t), i = b(r, !0), a = x(r, 2), o = b(a, !0), s = x(a, 2), l = b(s, !0);
					w(t), k((e, t, r) => {
						n(i, e), n(o, t), n(l, r);
					}, [
						() => c()("uploadedMedia.nostrBuild.unavailable"),
						() => c()("uploadedMedia.nostrBuild.account"),
						() => c()("uploadedMedia.nostrBuild.deleteFree")
					]), f(e, t);
				};
				l(d, (e) => {
					F(ye) && e(m);
				});
				var h = x(d, 2), g = (e) => {
					var t = p(), n = I(t);
					s(n, () => F(Z), (e) => {
						{
							let t = y(() => Ce.value.displayName || Ce.value.name || "");
							rt(e, {
								get registration() {
									return F(U).registration;
								},
								get initialUsername() {
									return F(t);
								},
								onOpen: () => H.controller.openRegistration(),
								onCancel: () => H.controller.cancelRegistration(),
								onRegister: Ke,
								onRefresh: async () => {
									let e = F(Z);
									await H.controller.load(), await D(), F(z) && e === F(Z) && F(Pe)?.querySelector("button")?.focus({ preventScroll: !0 });
								}
							});
						}
					}), f(e, t);
				};
				l(h, (e) => {
					F(U).registration && e(g);
				});
				var _ = x(h, 2), v = (e) => {
					de(e, {
						showLoader: !0,
						text: !0
					});
				};
				l(_, (e) => {
					F(U).loading && !F(U).loaded && (!a.onInitialReady || F(j)) && e(v);
				});
				var S = x(_, 2), T = (e) => {
					var t = ht(), r = I(t), i = b(r, !0), a = x(r, 2), o = (e) => {
						var t = mt(), r = b(t, !0);
						k((e) => n(r, e), [() => c()("uploadedMedia.moreUnseen")]), f(e, t);
					};
					l(a, (e) => {
						F(U).hasMore && e(o);
					}), k((e) => n(i, e), [() => c()("uploadedMedia.empty")]), f(e, t);
				};
				l(S, (e) => {
					F(U).loaded && F(U).items.length === 0 && e(T);
				});
				var O = x(S, 2);
				i(O, 21, () => F(U).items, (e) => e.id, (e, t) => {
					var i = vt();
					let a;
					var s = E(i);
					{
						let e = y(() => F(K) === F(t).id);
						Be(s, {
							get item() {
								return F(t);
							},
							get cacheSupported() {
								return F(be);
							},
							get active() {
								return F(e);
							},
							onOpenImage: (e) => Ye(F(t), e),
							onOpenVideo: () => {
								C(K, F(t).id, !0);
							},
							onCloseVideo: () => {
								C(K, null);
							}
						});
					}
					var u = x(s, 2);
					{
						let e = y(() => c()(`${F(t).kind === "video" ? "videoContextMenu" : "imageContextMenu"}.copyUrl`)), n = y(() => c()(`${F(t).kind === "video" ? "videoContextMenu" : "imageContextMenu"}.copyUrl`)), i = y(() => c()(`${F(t).kind === "video" ? "videoContextMenu" : "imageContextMenu"}.copySuccess`)), a = y(() => !F(t).url);
						V(u, {
							variant: "copy",
							shape: "circle",
							contentLayout: "icon",
							className: "media-copy-button",
							get ariaLabel() {
								return F(e);
							},
							get title() {
								return F(n);
							},
							get floatingMessage() {
								return F(i);
							},
							get disabled() {
								return F(a);
							},
							onClick: (e) => Je(F(t), e),
							children: (e, t) => {
								var n = ft();
								let i;
								k(() => i = r(n, "", i, { "mask-image": `url("${_e}")` })), f(e, n);
							},
							$$slots: { default: !0 }
						});
					}
					var d = x(u, 2), p = E(d), m = E(p), h = b(m, !0), g = x(m, 2), _ = E(g), v = (e) => {
						var r = gt(), i = b(r, !0);
						k((e, t) => {
							L(r, "datetime", e), n(i, t);
						}, [() => (/* @__PURE__ */ new Date(F(t).uploadedAt * 1e3)).toISOString(), () => Ue(F(t).uploadedAt)]), f(e, r);
					}, ee = (e) => {
						var t = o();
						k((e) => n(t, e), [() => c()("uploadedMedia.unknown")]), f(e, t);
					};
					l(_, (e) => {
						F(t).uploadedAt === void 0 ? e(ee, -1) : e(v);
					}), w(g), w(p);
					var S = x(p, 2);
					{
						let e = y(() => F(U).deletingId === F(t).id ? c()("uploadedMedia.deleting") : c()("uploadedMedia.delete")), n = y(() => F(U).deletingId === F(t).id ? c()("uploadedMedia.deleting") : c()("uploadedMedia.delete")), i = y(() => !F(t).deleteId || F(U).loading || !!F(U).deletingId || F(ze));
						V(S, {
							shape: "square",
							contentLayout: "icon",
							className: "media-delete-button",
							get ariaLabel() {
								return F(e);
							},
							get title() {
								return F(n);
							},
							get disabled() {
								return F(i);
							},
							onClick: (e) => {
								Ee = e.currentTarget, C(Te, F(U)?.context?.endpoint ?? null, !0), C(G, F(t), !0);
							},
							children: (e, t) => {
								var n = _t();
								let i;
								k(() => i = r(n, "", i, { "mask-image": `url("${he}")` })), f(e, n);
							},
							$$slots: { default: !0 }
						});
					}
					w(d), w(i), k((e) => {
						L(i, "data-media-kind", F(t).kind), a = R(i, 1, "svelte-hlt8mi", null, a, { "video-active": F(t).kind === "video" && F(K) === F(t).id }), n(h, e);
					}, [() => F(t).size === void 0 ? c()("uploadedMedia.unknown") : He(F(t).size)]), f(e, i);
				}), w(O), ee(O, (e) => C(je, e), () => F(je));
				var A = x(O, 2), M = (e) => {
					var r = yt(), i = E(r);
					{
						let e = y(() => F(U).loading || !!F(U).deletingId || F(ze));
						V(i, {
							className: "media-load-more-button",
							onClick: () => H.controller.load(!0),
							get disabled() {
								return F(e);
							},
							children: (e, r) => {
								t();
								var i = o();
								k((e) => n(i, e), [() => c()("uploadedMedia.loadMore")]), f(e, i);
							},
							$$slots: { default: !0 }
						});
					}
					w(r), f(e, r);
				};
				l(A, (e) => {
					F(U).hasMore && !F(U).needsRefresh && e(M);
				}), f(e, u);
			};
			l(T, (e) => {
				F(U) && e(O);
			}), k((e) => {
				L(g, "aria-label", e), g.disabled = !!F(U)?.deletingId || F(ze), _ !== (_ = H.value.selectedId ?? "") && (g.value = (g.__value = _) ?? "", u(g, _));
			}, [() => c()("uploadedMedia.server")]), m("change", g, (e) => H.controller.select(e.currentTarget.value)), f(e, d);
		};
		l(_, (e) => {
			B.value.isAuthenticated ? H.value.configuring ? e(S, 1) : H.value.configurationError ? e(T, 2) : H.value.destinations.length === 0 ? e(O, 3) : e(A, -1) : e(v);
		}), w(g), w(h);
		var M = x(h, 2);
		{
			let e = y(() => !F(U)?.loading || !!F(U)?.error), t = y(() => F(U)?.error ? "alert" : "status");
			pe(M, {
				get show() {
					return F(Ve);
				},
				variant: "anchor-bottom-right",
				get anchor() {
					return F(Pe);
				},
				anchorRightOffset: 16,
				get showInfoIcon() {
					return F(e);
				},
				get role() {
					return F(t);
				},
				children: (e, t) => {
					var r = Tt(), i = E(r), a = (e) => {
						var t = wt(), r = I(t), i = (e) => {
							var t = St(), r = b(t, !0);
							k((e) => n(r, e), [() => c()(`uploadedMedia.${F(Le)}`)]), f(e, t);
						};
						l(r, (e) => {
							F(Le) && e(i);
						});
						var a = x(r, 2), o = b(a, !0), s = x(a, 2), u = (e) => {
							var t = St(), r = b(t, !0);
							k((e) => n(r, e), [() => c()("uploadedMedia.retryAfter", { values: { time: new Date(F(U).error.retryAt).toLocaleTimeString() } })]), f(e, t);
						};
						l(s, (e) => {
							F(U).error.retryAt && e(u);
						});
						var d = x(s, 2), p = (e) => {
							var t = Ct(), r = b(t, !0);
							k(() => n(r, F(U).error.diagnostic)), f(e, t);
						};
						l(d, (e) => {
							F(U).error.diagnostic && e(p);
						}), k((e) => n(o, e), [() => c()(`uploadedMedia.errors.${F(U).error.code === "invalidResponse" && F(ve) && !F(U).loaded ? "unavailable" : F(U).error.code}`)]), f(e, t);
					}, o = (e) => {
						de(e, {
							showLoader: !0,
							text: !0,
							loaderSize: 30
						});
					}, s = (e) => {
						var t = St(), r = b(t, !0);
						k((e) => n(r, e), [() => c()(`uploadedMedia.${F(Le)}`)]), f(e, t);
					};
					l(i, (e) => {
						F(U)?.error ? e(a) : F(U)?.loading ? e(o, 1) : F(Le) && e(s, 2);
					}), w(r), f(e, r);
				},
				$$slots: { default: !0 }
			});
		}
		var N = x(M, 2);
		s(N, () => F(X), (e) => {
			{
				let t = y(() => !!F(G)), r = y(() => c()("uploadedMedia.delete")), i = y(() => c()("uploadedMedia.confirmDescription")), a = y(() => c()("uploadedMedia.delete"));
				De(e, {
					get open() {
						return F(t);
					},
					onOpenChange: (e) => {
						e || We();
					},
					get title() {
						return F(r);
					},
					get description() {
						return F(i);
					},
					get confirmLabel() {
						return F(a);
					},
					onConfirm: Ge,
					onCancel: We,
					preventCloseWhileConfirming: !0,
					showConfirmSpinner: !0,
					closeOnConfirm: !1,
					children: (e, t) => {
						var r = p(), i = I(r), a = (e) => {
							var t = Dt(), r = I(t), i = b(r, !0), a = x(r, 2), o = b(a, !0), s = x(a, 2), u = (e) => {
								var t = Et(), r = b(t, !0);
								k(() => n(r, F(G).deleteId.sha256)), f(e, t);
							};
							l(s, (e) => {
								F(G).deleteId && e(u);
							});
							var d = x(s, 2), p = b(d, !0);
							k((e, t) => {
								n(i, e), n(o, F(Te) ?? F(G).serverUrl), n(p, t);
							}, [() => c()(`uploadedMedia.${F(G).kind}`), () => F(G).url ?? c()("uploadedMedia.previewUnavailable")]), f(e, t);
						};
						l(i, (e) => {
							F(G) && e(a);
						}), f(e, r);
					},
					$$slots: { default: !0 }
				});
			}
		});
		var te = x(N, 2);
		{
			let e = y(() => F(Oe)[F(q)]?.src ?? ""), t = y(() => F(Oe)[F(q)]?.alt ?? "");
			xe(te, {
				get src() {
					return F(e);
				},
				get alt() {
					return F(t);
				},
				onClose: $,
				get mediaList() {
					return F(Oe);
				},
				get currentIndex() {
					return F(q);
				},
				onNavigate: (e) => {
					C(q, e, !0);
				},
				get openingFocusOrigin() {
					return F(Ae);
				},
				get show() {
					return F(J);
				},
				set show(e) {
					C(J, e, !0);
				}
			});
		}
		f(e, d);
	};
	l(Qe, (e) => {
		F(z) && e($e);
	}), f(e, Ze);
	var et = ie(Xe);
	return g(), et;
}
h(["change"]);
export { At as default };
