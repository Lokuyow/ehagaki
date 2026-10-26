import { At as e, B as t, C as n, Ct as r, F as i, G as a, J as o, K as s, L as c, O as l, Q as u, R as d, S as f, U as p, W as m, X as h, Y as g, _, _t as v, at as y, ct as b, dt as x, et as S, f as ee, ft as C, gt as w, h as te, k as T, kt as E, lt as D, mt as O, nt as k, o as A, ot as j, q as M, r as N, s as ne, t as re, tt as P, ut as F, v as I, w as L, wt as ie, x as ae, yt as R } from "./index-client-Bdka-Daw.js";
import { n as oe } from "./appRuntimeEnvironment-BvtUCHcA.js";
import { l as z } from "./relayConfigUtils-DD5f1UAM.js";
import { n as se, r as ce, t as le } from "./uploadOperation-BVOBq-hD.js";
import { pt as ue, t as de } from "./LoadingPlaceholder-j1_vRYno.js";
import { i as fe } from "./signedEventResultValidator-vNb8KnFy.js";
import { r as B } from "./authStore.svelte-CoGdd5_Z.js";
import { c as V, l as pe } from "./appUtils-C7IXsQBk.js";
import { i as me } from "./clipboardUtils-CZAthnT_.js";
import { c as H, d as he, f as ge, i as _e, n as U, o as ve, s as W, t as G } from "./uploadDestinationResolver-DIhkZLuN.js";
import { t as ye } from "./inViewportAction.svelte-C2PkqWTH.js";
import { Y as be, at as xe, ct as Se, et as Ce, i as we, lt as K, st as q, ut as Te } from "./App-CxNETzG6.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/uploadMediaImageUrl.ts
function J(e, t, n) {
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
function Ee(e) {
	let t = new URL(e.currentOrigin), n = J(e.url, e.serverUrl, t.protocol);
	if (!n) return null;
	let r = new URL(`${e.basePath.endsWith("/") ? e.basePath : `${e.basePath}/`}__ehagaki-image/upload-media`, t);
	return r.searchParams.set("url", n), r.searchParams.set("server", e.serverUrl), r.toString();
}
function De(e) {
	return !e.url || e.cacheSupported === null ? null : e.cacheSupported ? Ee({
		url: e.url,
		serverUrl: e.serverUrl,
		basePath: e.basePath,
		currentOrigin: e.currentOrigin
	}) : e.url;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/uploadMediaImageCacheClient.ts
function Oe() {
	let e = oe();
	return e.serviceWorkerEnabled ? e.window?.navigator.serviceWorker?.controller ?? null : null;
}
function ke(e, t) {
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
var Y = null, je = null;
async function Me() {
	let e = Oe();
	return e ? (e === Y && je || (Y = e, je = ke(e, { type: K }).then((e) => Ae(e) && e.version === 1 && e.supported === !0)), await je) : (Y = null, je = null, !1);
}
async function Ne(e) {
	if (!e.length) return !0;
	let t = Oe();
	if (!t) return !0;
	let n = [...new Set(e)], r = !0;
	for (let e = 0; e < n.length; e += q.maxEntries) {
		let i = await ke(t, {
			type: Se,
			urls: n.slice(e, e + q.maxEntries)
		});
		r = Ae(i) && i.version === 1 && i.success === !0 && r;
	}
	return r;
}
// D:/ドキュメント/GitHub/ehagaki/src/components/UploadedMediaPreview.svelte
var Pe = a("<!> <!>", 1), Fe = a("<button type=\"button\" class=\"image-open\"><img alt=\"\" referrerpolicy=\"no-referrer\" class=\"svelte-1gq8ela\"/></button>"), X = a("<span class=\"svg-icon\" aria-hidden=\"true\"></span>"), Ie = a("<video controls=\"\" playsinline=\"\" preload=\"metadata\" class=\"svelte-1gq8ela\"><track kind=\"captions\"/></video> <!>", 3), Le = a("<div class=\"video-placeholder svelte-1gq8ela\"><!></div>"), Z = a("<div><!></div>"), Re = {
	hash: "svelte-1gq8ela",
	code: ".preview.svelte-1gq8ela {position:relative;width:100%;min-width:0;aspect-ratio:1;}\n    /* Reserve room for close, copy, delete and native playback controls. */.preview-active.svelte-1gq8ela {min-height:204px;}.preview-empty.svelte-1gq8ela {display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;}img.svelte-1gq8ela, video.svelte-1gq8ela {display:block;width:100%;height:100%;}img.svelte-1gq8ela {object-fit:cover;}video.svelte-1gq8ela {position:absolute;inset:0;object-fit:contain;}video.svelte-1gq8ela, .video-placeholder.svelte-1gq8ela {background:#181818;}.video-placeholder.svelte-1gq8ela {width:100%;height:100%;display:grid;place-items:center;}.preview.svelte-1gq8ela button.image-open {display:block;width:100%;height:100%;min-width:0;min-height:0;max-width:none;margin:0;padding:0;border:0;background:transparent;cursor:pointer;}.preview.svelte-1gq8ela button.media-video-button {padding:0;width:44px;height:44px;min-width:44px;color:white;}.preview.svelte-1gq8ela button.media-video-button:hover:not(:disabled) .svg-icon {background-color:white;}.preview.svelte-1gq8ela button.video-close {position:absolute;top:4px;right:4px;}.preview.svelte-1gq8ela button.video-open {width:56px;height:56px;}"
};
function ze(i, a) {
	ie(a, !0), T(i, Re);
	let o = () => ne(ue, "$_", s), [s, c] = A(), f = xe("icons/play_arrow_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"), _ = w(!1), v = w(!1), C = w(void 0), te = R(() => De({
		url: a.item.url,
		serverUrl: a.item.serverUrl,
		cacheSupported: a.cacheSupported,
		basePath: "./",
		currentOrigin: window.location.origin
	}));
	function k(e) {
		return { destroy() {
			e.pause(), e.removeAttribute("src"), e.load();
		} };
	}
	async function j() {
		O(v, !0), a.item.url && a.cacheSupported && await Ne([a.item.url]);
	}
	re(() => {
		S(C)?.pause();
	});
	var N = Z();
	let P;
	var ae = b(N), oe = (e) => {
		{
			let t = R(() => o()("uploadedMedia.previewUnavailable"));
			de(e, { get text() {
				return S(t);
			} });
		}
	}, z = (e) => {
		var n = m(), r = D(n), i = (e) => {
			var n = Pe(), r = D(n);
			{
				let e = R(() => o()("uploadedMedia.previewUnavailable"));
				de(r, { get text() {
					return S(e);
				} });
			}
			var i = x(r, 2);
			V(i, {
				onClick: () => {
					O(v, !1);
				},
				children: (e, n) => {
					E();
					var r = M();
					y((e) => t(r, e), [() => o()("uploadedMedia.retry")]), p(e, r);
				},
				$$slots: { default: !0 }
			}), p(e, n);
		}, s = (e) => {
			var t = Fe(), n = F(t);
			y((e) => {
				I(t, "aria-label", e), I(n, "src", S(te));
			}, [() => o()("uploadedMedia.openImage")]), g("click", t, (e) => {
				e.currentTarget instanceof HTMLElement && a.onOpenImage?.(e.currentTarget);
			}), h("error", n, j), u(n), p(e, t);
		};
		d(r, (e) => {
			S(v) ? e(i) : S(_) && a.cacheSupported !== null && S(te) && e(s, 1);
		}), p(e, n);
	}, se = (e) => {
		var t = Ie(), n = D(t);
		ee(n, (e) => O(C, e), () => S(C)), l(n, (e) => k?.(e));
		var r = x(n, 2);
		{
			let e = R(() => o()("uploadedMedia.closeVideo")), t = R(() => o()("uploadedMedia.closeVideo"));
			V(r, {
				variant: "close",
				shape: "circle",
				contentLayout: "icon",
				className: "media-video-button video-close",
				get ariaLabel() {
					return S(e);
				},
				get title() {
					return S(t);
				},
				get onClick() {
					return a.onCloseVideo;
				},
				children: (e, t) => {
					var n = X();
					p(e, n);
				},
				$$slots: { default: !0 }
			});
		}
		y(() => I(n, "src", a.item.url)), h("ended", n, function(...e) {
			a.onCloseVideo?.apply(this, e);
		}), p(e, t);
	}, ce = (t) => {
		var r = Le(), i = b(r);
		{
			let e = R(() => o()("uploadedMedia.openVideo")), t = R(() => o()("uploadedMedia.openVideo"));
			V(i, {
				variant: "close",
				shape: "circle",
				contentLayout: "icon",
				className: "media-video-button video-open",
				get ariaLabel() {
					return S(e);
				},
				get title() {
					return S(t);
				},
				get onClick() {
					return a.onOpenVideo;
				},
				children: (e, t) => {
					var r = X();
					let i;
					y(() => i = n(r, "", i, { "mask-image": `url("${f}")` })), p(e, r);
				},
				$$slots: { default: !0 }
			});
		}
		e(r), p(t, r);
	};
	d(ae, (e) => {
		a.item.url ? a.item.kind === "image" ? e(z, 1) : a.active ? e(se, 2) : e(ce, -1) : e(oe);
	}), e(N), l(N, (e, t) => ye?.(e, t), () => ({
		enabled: !0,
		rootMargin: "200px",
		onEnterView: () => {
			O(_, !0);
		}
	})), y(() => P = L(N, 1, "preview svelte-1gq8ela", null, P, {
		"preview-active": a.item.kind === "video" && a.active,
		"preview-empty": !a.item.url || a.item.kind === "image" && (S(v) || !S(_) || a.cacheSupported === null)
	})), p(i, N), r(), c();
}
o(["click"]);
// D:/ドキュメント/GitHub/ehagaki/src/lib/upload/uploadServerRegistration.ts
var Q = class extends Error {
	code;
	constructor(e) {
		super(e), this.code = e;
	}
}, Be = [{
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
function Ve(e) {
	try {
		let t = new URL(e);
		return t.username || t.password || t.search || t.hash ? null : t.toString().replace(/\/$/, "");
	} catch {
		return null;
	}
}
function He(e) {
	if (e.protocol !== "nip96") return null;
	let t = Be.find((t) => t.mediaUrls.includes(Ve(e.serverUrl)) && (!e.resolvedUploadUrl || t.mediaUrls.includes(Ve(e.resolvedUploadUrl))) && (!e.nip96ServerUrl || t.discoveryUrls.includes(Ve(e.nip96ServerUrl))));
	return t ? {
		domain: t.domain,
		origin: t.origin,
		registrationUrl: `${t.origin}/register`,
		termsUrl: `${t.origin}/api/v2/tos`
	} : null;
}
function Ue(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function We(e) {
	e.assertSession(), ce(e.signal);
	let t = He(e.destination);
	if (!t) throw new Q("serverError");
	return t;
}
async function $(e, t, n) {
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
async function Ge(e) {
	let t = We(e), { response: n, data: r } = await $(e, `${t.origin}/api/v2/domains`, { method: "GET" });
	if (!n.ok || !Ue(r) || !Ue(r.availableDomains)) return null;
	let i = r.availableDomains[t.domain];
	if (!Ue(i) || i.requireinvite !== !1 || i.requirepayment !== !1 || i.maxsatoshi !== 0) return null;
	let a = i.minUsernameLength, o = i.maxUsernameLength;
	return typeof a != "number" || typeof o != "number" || !Number.isSafeInteger(a) || !Number.isSafeInteger(o) || a < 1 || o < a ? null : {
		minLength: a,
		maxLength: o
	};
}
function Ke(e, t) {
	return /^[a-zA-Z0-9_-]+$/.test(e) && e.length >= t.minLength && e.length <= t.maxLength;
}
async function qe(e, t, n, r) {
	let i = We(e);
	if (!Ke(t, n)) throw new Q("invalidUsername");
	let a = `${i.origin}/api/v2/register`, o = {
		pubkey: e.expectedPubkey,
		username: t,
		domain: i.domain
	}, s;
	try {
		if (s = await le(e.authService.buildAuthHeader(a, "POST", o), e.signal), e.assertSession(), !s) throw Error();
	} catch {
		throw ce(e.signal), new Q("authentication");
	}
	let c;
	try {
		e.assertSession(), r(), c = await $(e, a, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: s
			},
			body: JSON.stringify(o)
		});
	} catch {
		throw ce(e.signal), new Q("unknownRegistration");
	}
	let { response: l, data: u } = c;
	if ([
		400,
		401,
		422
	].includes(l.status) && Ue(u) && u.status === "error" && u.message === "Invalid username format") throw new Q("invalidUsername");
	if (Ue(u) && u.status === "error" && l.status === 406) {
		if (u.message === "Username already registered") throw new Q("usernameTaken");
		if (u.message === "Pubkey already registered") return "alreadyRegistered";
	}
	if (l.status === 429) throw new Q("rateLimited");
	if (l.status === 401 || l.status === 403) return "external";
	if (!l.ok || !Ue(u) || u.status !== "success") throw new Q("unknownRegistration");
	if (u.otc === !0 || typeof u.payment_request == "string" && u.payment_request !== "" || typeof u.satoshi == "number" && u.satoshi > 0) return "external";
	if (u.otc !== !1 || u.payment_request !== "" || u.satoshi !== 0) throw new Q("unknownRegistration");
	return "registered";
}
// D:/ドキュメント/GitHub/ehagaki/src/components/UploadServerRegistration.svelte
var Je = a("<p class=\"svelte-1fagx79\"> </p> <div><!></div>", 1), Ye = a("<!> <!>", 1), Xe = a("<p role=\"status\" class=\"svelte-1fagx79\"> </p> <a target=\"_blank\" rel=\"noopener noreferrer\"> </a> <!>", 1), Ze = a("<p role=\"alert\" class=\"svelte-1fagx79\"> </p> <!> <a target=\"_blank\" rel=\"noopener noreferrer\"> </a>", 1), Qe = a("<p role=\"alert\" class=\"svelte-1fagx79\"> </p>"), $e = a("<form class=\"svelte-1fagx79\"><label> </label> <input autocomplete=\"off\" autocapitalize=\"none\" required=\"\" class=\"svelte-1fagx79\"/> <p class=\"svelte-1fagx79\"> </p> <p class=\"svelte-1fagx79\"> <a target=\"_blank\" rel=\"noopener noreferrer\"> </a></p> <!> <div class=\"actions svelte-1fagx79\"><!> <!></div></form>"), et = a("<p class=\"target svelte-1fagx79\"> </p> <!>", 1), tt = a("<section class=\"registration svelte-1fagx79\"><!></section>"), nt = {
	hash: "svelte-1fagx79",
	code: ".registration.svelte-1fagx79 {margin:8px 12px;padding:12px;border:1px solid var(--border);border-radius:6px;min-width:0;overflow-wrap:anywhere;}form.svelte-1fagx79, .registration.svelte-1fagx79 {display:flex;flex-direction:column;gap:8px;}p.svelte-1fagx79 {margin:0;}.target.svelte-1fagx79 {font-weight:bold;}input.svelte-1fagx79 {box-sizing:border-box;width:100%;min-width:0;padding:8px;min-height:44px;font:inherit;color:var(--text);background:var(--dialog-bg);border:1px solid var(--border);border-radius:4px;}.actions.svelte-1fagx79 {display:flex;flex-wrap:wrap;gap:8px;}"
};
function rt(n, i) {
	let a = s();
	ie(i, !0), T(n, nt);
	let o = () => ne(ue, "$_", c), [c, l] = A(), u = w(""), f = w(""), m = w(void 0), g = w(void 0), v = R(() => i.registration.phase === "submitting"), C = R(() => !!i.registration.policy && Ke(S(u), i.registration.policy)), k = R(() => i.registration.error && (!["usernameTaken", "invalidUsername"].includes(i.registration.error) || S(u) === S(f)) ? i.registration.error : null);
	function N() {
		O(u, i.initialUsername.trim(), !0), O(f, ""), i.onOpen();
	}
	function re() {
		i.onCancel(), P().then(() => S(g)?.querySelector("button")?.focus({ preventScroll: !0 }));
	}
	j(() => {
		i.registration.phase === "ready" && P().then(() => S(m)?.focus({ preventScroll: !0 }));
	});
	var L = tt(), ae = b(L), oe = (n) => {
		var r = Je(), i = D(r), a = F(i, !0), s = x(i, 2), c = b(s);
		V(c, {
			onClick: N,
			children: (e, n) => {
				E();
				var r = M();
				y((e) => t(r, e), [() => o()("uploadedMedia.registration.open")]), p(e, r);
			},
			$$slots: { default: !0 }
		}), e(s), y((e) => t(a, e), [() => o()("uploadedMedia.registration.offer")]), p(n, r);
	}, z = (n) => {
		var r = et(), s = D(r), c = F(s, !0), l = x(s, 2), g = (e) => {
			var n = Ye(), r = D(n);
			de(r, {
				showLoader: !0,
				text: !0
			});
			var i = x(r, 2);
			V(i, {
				onClick: re,
				children: (e, n) => {
					E();
					var r = M();
					y((e) => t(r, e), [() => o()("common.cancel")]), p(e, r);
				},
				$$slots: { default: !0 }
			}), p(e, n);
		}, w = (e) => {
			var n = Xe(), r = D(n), a = F(r, !0), s = x(r, 2), c = F(s, !0), l = x(s, 2);
			V(l, {
				onClick: () => i.onRefresh(),
				children: (e, n) => {
					E();
					var r = M();
					y((e) => t(r, e), [() => o()("uploadedMedia.refresh")]), p(e, r);
				},
				$$slots: { default: !0 }
			}), y((e, n) => {
				t(a, e), I(s, "href", i.registration.target.registrationUrl), t(c, n);
			}, [() => o()("uploadedMedia.registration.external"), () => o()("uploadedMedia.registration.official")]), p(e, n);
		}, T = (e) => {
			var n = Ze(), r = D(n), a = F(r, !0), s = x(r, 2);
			V(s, {
				onClick: () => i.onRefresh(),
				children: (e, n) => {
					E();
					var r = M();
					y((e) => t(r, e), [() => o()("uploadedMedia.refresh")]), p(e, r);
				},
				$$slots: { default: !0 }
			});
			var c = x(s, 2), l = F(c, !0);
			y((e, n) => {
				t(a, e), I(c, "href", i.registration.target.registrationUrl), t(l, n);
			}, [() => o()("uploadedMedia.registration.errors.unknownRegistration"), () => o()("uploadedMedia.registration.official")]), p(e, n);
		}, A = (n) => {
			var r = $e(), s = b(r), c = F(s, !0), l = x(s, 2);
			_(l), I(l, "spellcheck", !1), ee(l, (e) => O(m, e), () => S(m));
			var g = x(l, 2), w = F(g, !0), T = x(g, 2), D = b(T), A = x(D), j = F(A, !0);
			e(T);
			var N = x(T, 2), ne = (e) => {
				var n = Qe(), r = F(n, !0);
				y((e) => {
					I(n, "id", `${a}-error`), t(r, e);
				}, [() => o()(`uploadedMedia.registration.errors.${S(k)}`)]), p(e, n);
			};
			d(N, (e) => {
				S(k) && e(ne);
			});
			var P = x(N, 2), L = b(P);
			{
				let e = R(() => !S(C) || S(v));
				V(L, {
					type: "submit",
					get disabled() {
						return S(e);
					},
					children: (e, n) => {
						E();
						var r = M();
						y((e) => t(r, e), [() => o()(S(v) ? "uploadedMedia.registration.submitting" : "uploadedMedia.registration.submit")]), p(e, r);
					},
					$$slots: { default: !0 }
				});
			}
			var ie = x(L, 2);
			V(ie, {
				onClick: re,
				children: (e, n) => {
					E();
					var r = M();
					y((e) => t(r, e), [() => o()("common.cancel")]), p(e, r);
				},
				$$slots: { default: !0 }
			}), e(P), e(r), y((e, n, o, u, d) => {
				I(r, "aria-busy", S(v)), I(s, "for", a), t(c, e), I(l, "id", a), l.disabled = S(v), I(l, "aria-describedby", `${a}-help${S(k) ? ` ${a}-error` : ""}`), I(l, "aria-invalid", n), I(g, "id", `${a}-help`), t(w, o), t(D, `${u ?? ""} `), I(A, "href", i.registration.target.termsUrl), t(j, d);
			}, [
				() => o()("uploadedMedia.registration.username"),
				() => !S(C) || !!S(k) && ["invalidUsername", "usernameTaken"].includes(S(k)),
				() => o()("uploadedMedia.registration.usernameHelp", { values: {
					min: i.registration.policy.minLength,
					max: i.registration.policy.maxLength
				} }),
				() => o()("uploadedMedia.registration.agreement"),
				() => o()("uploadedMedia.registration.terms")
			]), h("submit", r, (e) => {
				e.preventDefault(), S(C) && !S(v) && (O(f, S(u), !0), i.onRegister(S(u)));
			}), te(l, () => S(u), (e) => O(u, e)), p(n, r);
		};
		d(l, (e) => {
			i.registration.phase === "loading" ? e(g) : i.registration.phase === "external" ? e(w, 1) : i.registration.phase === "unknown" ? e(T, 2) : e(A, -1);
		}), y(() => t(c, i.registration.target.domain)), p(n, r);
	};
	d(ae, (e) => {
		i.registration.phase === "offer" ? e(oe) : e(z, -1);
	}), e(L), ee(L, (e) => O(g, e), () => S(g)), y((e) => I(L, "aria-label", e), [() => o()("uploadedMedia.registration.title")]), p(n, L), r(), l();
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
		this.destinations = t.filter((e) => e.protocol !== "custom-http").map((t) => G(t, {
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
			let r = He(e.destination);
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
			let n = await Ge(t.params);
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
	let e = w(C(it()));
	return {
		get value() {
			return S(e);
		},
		controller: new st({
			loadDestinations: (e) => H.getAll(e),
			evictImages: Ne,
			onChange: (t) => {
				O(e, t, !0);
			}
		})
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/components/UploadedMediaTabContent.svelte
var lt = a("<p class=\"media-status svelte-hlt8mi\" role=\"status\"> </p>"), ut = a("<p class=\"media-status svelte-hlt8mi\" role=\"alert\"> </p> <!>", 1), dt = a("<option class=\"svelte-hlt8mi\"> </option>"), ft = a("<span class=\"svg-icon\" aria-hidden=\"true\"></span>"), pt = a("<p class=\"media-status svelte-hlt8mi\"> </p>"), mt = a("<p class=\"media-status svelte-hlt8mi\"> </p> <!>", 1), ht = a("<time> </time>"), gt = a("<span class=\"svg-icon media-delete-icon svelte-hlt8mi\" aria-hidden=\"true\"></span>"), _t = a("<article><!> <!> <div class=\"media-overlay svelte-hlt8mi\"><div class=\"media-metadata svelte-hlt8mi\"><span> </span> <span><!></span></div> <!></div></article>"), vt = a("<div class=\"list-end-actions svelte-hlt8mi\"><!></div>"), yt = a("<!> <!> <!> <div class=\"media-list svelte-hlt8mi\" tabindex=\"-1\"></div> <!>", 1), bt = a("<div class=\"media-toolbar svelte-hlt8mi\"><select class=\"media-server-select svelte-hlt8mi\"></select> <!></div> <!>", 1), xt = a("<p class=\"svelte-hlt8mi\"> </p>"), St = a("<p class=\"diagnostic svelte-hlt8mi\"> </p>"), Ct = a("<!> <p class=\"svelte-hlt8mi\"> </p> <!> <!>", 1), wt = a("<div class=\"media-feedback svelte-hlt8mi\"><!></div>"), Tt = a("<p class=\"server-url svelte-hlt8mi\"> </p>"), Et = a("<p class=\"svelte-hlt8mi\"> </p> <p class=\"server-url svelte-hlt8mi\"> </p> <!> <p class=\"server-url svelte-hlt8mi\"> </p>", 1), Dt = a("<div class=\"uploaded-media-dialog uploaded-media-content svelte-hlt8mi\"><div class=\"media-management svelte-hlt8mi\"><!></div></div> <!> <!> <!>", 1), Ot = {
	hash: "svelte-hlt8mi",
	code: ".uploaded-media-content.svelte-hlt8mi {background:var(--dialog-bg);flex:1;min-height:0;overflow:auto;width:100%;}.media-management.svelte-hlt8mi {flex:none;width:100%;min-width:0;display:flex;flex-direction:column;}.uploaded-media-dialog button {height:auto;min-height:44px;max-width:100%;padding:8px 12px;}.uploaded-media-dialog button.image-open {display:block;width:100%;height:100%;min-height:0;max-width:none;margin:0;padding:0;border:none;background:transparent;cursor:pointer;}p.svelte-hlt8mi {margin:0;}.media-toolbar.svelte-hlt8mi {display:grid;grid-template-columns:minmax(0, 1fr) 44px;gap:4px;padding:8px;}.media-status.svelte-hlt8mi {margin:8px 12px;}.media-feedback.svelte-hlt8mi {overflow-wrap:anywhere;}.media-server-select.svelte-hlt8mi {width:100%;min-width:0;min-height:44px;max-width:100%;padding:8px 32px 8px 10px;border:1px solid var(--border);border-radius:6px;background:var(--dialog-bg);color:var(--text);font:inherit;}.media-server-select.svelte-hlt8mi option:where(.svelte-hlt8mi) {background:var(--dialog-bg);color:var(--text);}.list-end-actions.svelte-hlt8mi {display:flex;width:100%;padding:10px;box-sizing:border-box;}.uploaded-media-dialog button.media-load-more-button {width:100%;}.uploaded-media-dialog button.media-refresh-button {width:44px;height:44px;padding:0;background:transparent;border:none;}.uploaded-media-dialog button.media-delete-button {flex:none;padding:0;background:transparent;border:none;color:white;--text: white;width:44px;min-width:44px;max-width:44px;height:44px;min-height:44px;max-height:44px;}.uploaded-media-dialog button.media-delete-button:hover:not(:disabled) {background:rgb(255 255 255 / 15%);color:white;}.uploaded-media-dialog button.media-delete-button:hover:not(:disabled) .svg-icon {background-color:white;}.uploaded-media-dialog button.media-delete-button:focus-visible {outline:2px solid white;outline-offset:-2px;}.media-delete-icon.svelte-hlt8mi {width:24px;height:24px;--svg: currentColor;}.server-url.svelte-hlt8mi, .diagnostic.svelte-hlt8mi {overflow-wrap:anywhere;font-size:.875rem;}.media-list.svelte-hlt8mi {display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));gap:2px;}article.svelte-hlt8mi {position:relative;min-width:0;align-self:start;}.uploaded-media-dialog button.media-copy-button {position:absolute;top:4px;right:4px;z-index:1;width:44px;min-width:44px;height:44px;min-height:44px;padding:0;color:white;--text: white;}.uploaded-media-dialog button.media-copy-button:hover:not(:disabled) .svg-icon {background-color:white;}.video-active.svelte-hlt8mi button.media-copy-button {top:52px;}.media-overlay.svelte-hlt8mi {position:absolute;inset:auto 0 0;display:flex;align-items:flex-end;justify-content:space-between;gap:4px;padding:16px 4px 4px 8px;color:var(--text);background:linear-gradient(transparent, rgb(0 0 0 / 70%));pointer-events:none;}.media-metadata.svelte-hlt8mi {min-width:0;align-self:center;display:flex;flex-direction:column;font-size:.6875rem;line-height:1.5;overflow-wrap:anywhere;text-shadow:0 1px 2px rgb(0 0 0 / 70%);}.media-overlay.svelte-hlt8mi button {pointer-events:auto;}\n    /* Keep native video playback controls available beneath the overlay. */.video-active.svelte-hlt8mi .media-overlay:where(.svelte-hlt8mi) {bottom:56px;}"
};
function kt(a, o) {
	ie(o, !0), T(a, Ot);
	let s = () => ne(ue, "$_", l), [l, u] = A(), h = N(o, "onBusyChange", 3, () => void 0), _ = w(!1), te = w(!1), oe = w(!1), z = R(() => o.show && !S(oe));
	function se() {
		O(oe, !1), H.controller.activate();
	}
	function ce() {
		O(oe, !0), Ae++, v(Y), O(G, null), O(K, null), O(Pe, !0), $(), H.controller.suspend();
	}
	function le() {
		return H.controller.busy;
	}
	function fe() {
		return S(Ee);
	}
	let H = ct(), he = xe("icons/delete_forever_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"), ge = xe("icons/refresh_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"), _e = xe("icons/file_copy_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"), U = R(() => H.value.current), ve = R(() => !!S(U) && /^https?:\/\/nostpic\.com(?::\d+)?(?:\/|$)/i.test(S(U).destination.serverUrl)), W = w(null), G = w(null), ye = w(null), Se = null, K = w(null), q = w(C([])), J = w(-1), Ee = w(!1), Oe = w(null), ke = w(void 0), Ae = 0, Y = w(0), je = null, Ne = w(null), Pe = w(!1), Fe = null, X = R(() => S(U)?.notice ?? null), Ie = R(() => !!S(U)?.deletingId), Le = R(() => S(U)?.registration?.phase === "submitting"), Z = R(() => [
		B.value.pubkey,
		S(U)?.destination.id,
		S(U)?.destination.protocol,
		S(U)?.destination.serverUrl,
		S(U)?.destination.resolvedUploadUrl,
		S(U)?.destination.nip96ServerUrl,
		S(U)?.destination.nip96UrlMode
	].join("\n")), Re = R(() => S(z) && !S(G) && !S(Ie) && !!(S(U)?.error && !S(U).registration || S(U)?.loading && S(U).loaded || S(X) && !S(Pe)));
	j(() => {
		let e = S(X), t = S(Ie), n = S(Z), r = Fe !== null && Fe !== n;
		Fe = n;
		let i = r || !k(() => S(z));
		if (O(Pe, i, !0), !e || t || i) return;
		let a = setTimeout(() => {
			O(Pe, !0);
		}, 3500);
		return () => clearTimeout(a);
	}), j(() => {
		let e = o.show;
		k(() => e ? se() : ce());
	});
	function Q(e) {
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
	function Be(e) {
		return (/* @__PURE__ */ new Date(e * 1e3)).toLocaleString(void 0, {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit"
		});
	}
	function Ve() {
		v(Y), je = null, O(G, null), O(K, null), $(), H.controller.invalidate();
	}
	j(() => {
		let e = S(z), t = B.value, n = we.value.destinations;
		k(() => {
			if (!e) return;
			H.controller.activate();
			let r = t.isAuthenticated ? t.pubkey : null;
			n.length ? H.controller.configure(r, n) : H.controller.configureSaved(r), O(_, !0);
		});
	}), j(() => {
		S(z) && !S(te) && o.onInitialReady && S(_) && !H.value.configuring && (!B.value.isAuthenticated || H.value.configurationError || H.value.destinations.length === 0 || S(U)?.loaded || S(U)?.items.length || S(U)?.error) && (O(te, !0), o.onInitialReady());
	}), j(() => {
		if (!S(z) || S(W) !== null) return;
		let e = ++Ae;
		Me().then((t) => {
			e === Ae && O(W, t, !0);
		});
	}), j(() => {
		let e = H.value.selectedId, t = `${B.value.pubkey}\n${e}\n${S(U)?.destination.protocol}\n${S(U)?.destination.serverUrl}\n${S(U)?.context?.endpoint}`;
		k(() => {
			t !== je && (je = t, v(Y), O(G, null), O(K, null), $());
		});
	}), j(() => {
		let e = S(U);
		k(() => {
			S(G) && (e?.destination.serverUrl !== S(G).serverUrl || e?.context?.endpoint !== S(ye) || !e.deletingId && !e.items.some((e) => e.id === S(G)?.id)) && O(G, null), S(K) && !e?.items.some((e) => e.id === S(K)) && O(K, null);
			let t = S(q)[S(J)]?.id;
			S(Ee) && t && !e?.items.some((e) => e.id === t && e.kind === "image") && $();
		});
	}), j(() => {
		h()(!!S(U)?.deletingId || S(Le));
	}), re(() => {
		Ae++, Ve();
	});
	function He() {
		let e = S(Y), t = Se;
		O(G, null), P().then(() => e === S(Y) && t?.isConnected && t.focus({ preventScroll: !0 }));
	}
	async function Ue() {
		let e = S(G), t = S(Y), n = Se;
		!e || S(U)?.destination.serverUrl !== e.serverUrl || S(U).context?.endpoint !== S(ye) || !S(U).items.some((t) => t.id === e.id && t.deleteId?.sha256 === e.deleteId?.sha256) ? He() : (await H.controller.delete(e.id), t === S(Y) && (O(G, null), await P(), t === S(Y) && (n?.isConnected ? n.focus({ preventScroll: !0 }) : S(ke)?.focus({ preventScroll: !0 }))));
	}
	async function We(e) {
		let t = S(Z);
		await H.controller.register(e), await P(), S(z) && t === S(Z) && !S(U)?.registration && S(ke)?.focus({ preventScroll: !0 });
	}
	function $() {
		O(Ee, !1), O(q, [], !0), O(J, -1), O(Oe, null);
	}
	function Ge(e) {
		return De({
			url: e.url,
			serverUrl: e.serverUrl,
			cacheSupported: S(W),
			basePath: "./",
			currentOrigin: window.location.origin
		});
	}
	function Ke(e, t) {
		return t.stopPropagation(), e.url ? me(e.url, "URL", navigator, window) : !1;
	}
	function qe(e, t) {
		let n = (S(U)?.items ?? []).flatMap((e) => {
			if (e.kind !== "image") return [];
			let t = Ge(e);
			return t ? [{
				id: e.id,
				src: t,
				alt: s()("uploadedMedia.image"),
				type: "image"
			}] : [];
		}), r = n.findIndex((t) => t.id === e.id);
		r < 0 || (O(q, n, !0), O(J, r, !0), O(Oe, t, !0), O(Ee, !0));
	}
	var Je = {
		activate: se,
		suspend: ce,
		isBusy: le,
		isFullscreen: fe,
		invalidateSession: Ve
	}, Ye = m(), Xe = D(Ye), Ze = (r) => {
		var a = Dt(), l = D(a), u = b(l), h = b(u), _ = (e) => {
			var n = lt(), r = F(n, !0);
			y((e) => t(r, e), [() => s()("uploadedMedia.errors.authentication")]), p(e, n);
		}, v = (e) => {
			de(e, {
				showLoader: !0,
				text: !0
			});
		}, C = (e) => {
			var n = ut(), r = D(n), i = F(r, !0), a = x(r, 2);
			V(a, {
				onClick: () => H.controller.configureSaved(B.value.pubkey),
				children: (e, n) => {
					E();
					var r = M();
					y((e) => t(r, e), [() => s()("uploadedMedia.refresh")]), p(e, r);
				},
				$$slots: { default: !0 }
			}), y((e) => t(i, e), [() => s()("uploadedMedia.errors.invalidDestination")]), p(e, n);
		}, w = (e) => {
			var n = lt(), r = F(n, !0);
			y((e) => t(r, e), [() => s()("uploadedMedia.noServers")]), p(e, n);
		}, T = (r) => {
			var a = bt(), l = D(a), u = b(l);
			i(u, 21, () => H.value.destinations, (e) => e.id, (e, n) => {
				var r = dt(), i = F(r, !0), a = {};
				y(() => {
					t(i, S(n).name), a !== (a = S(n).id) && (r.value = (r.__value = a) ?? "");
				}), p(e, r);
			}), e(u);
			var h;
			ae(u);
			var _ = x(u, 2), v = (e) => {
				{
					let t = R(() => s()("uploadedMedia.refresh")), r = R(() => s()("uploadedMedia.refresh")), i = R(() => S(U).loading || !!S(U).deletingId || S(Le));
					V(e, {
						shape: "square",
						contentLayout: "icon",
						className: "media-refresh-button",
						get ariaLabel() {
							return S(t);
						},
						get title() {
							return S(r);
						},
						onClick: () => {
							O(K, null), $(), H.controller.load();
						},
						get disabled() {
							return S(i);
						},
						children: (e, t) => {
							var r = ft();
							let i;
							y(() => i = n(r, "", i, { "mask-image": `url("${ge}")` })), p(e, r);
						},
						$$slots: { default: !0 }
					});
				}
			};
			d(_, (e) => {
				S(U) && e(v);
			}), e(l), ee(l, (e) => O(Ne, e), () => S(Ne));
			var C = x(l, 2), w = (r) => {
				var a = yt(), l = D(a), u = (e) => {
					var t = m(), n = D(t);
					c(n, () => S(Z), (e) => {
						{
							let t = R(() => Ce.value.displayName || Ce.value.name || "");
							rt(e, {
								get registration() {
									return S(U).registration;
								},
								get initialUsername() {
									return S(t);
								},
								onOpen: () => H.controller.openRegistration(),
								onCancel: () => H.controller.cancelRegistration(),
								onRegister: We,
								onRefresh: async () => {
									let e = S(Z);
									await H.controller.load(), await P(), S(z) && e === S(Z) && S(Ne)?.querySelector("button")?.focus({ preventScroll: !0 });
								}
							});
						}
					}), p(e, t);
				};
				d(l, (e) => {
					S(U).registration && e(u);
				});
				var f = x(l, 2), h = (e) => {
					de(e, {
						showLoader: !0,
						text: !0
					});
				};
				d(f, (e) => {
					S(U).loading && !S(U).loaded && (!o.onInitialReady || S(te)) && e(h);
				});
				var g = x(f, 2), _ = (e) => {
					var n = mt(), r = D(n), i = F(r, !0), a = x(r, 2), o = (e) => {
						var n = pt(), r = F(n, !0);
						y((e) => t(r, e), [() => s()("uploadedMedia.moreUnseen")]), p(e, n);
					};
					d(a, (e) => {
						S(U).hasMore && e(o);
					}), y((e) => t(i, e), [() => s()("uploadedMedia.empty")]), p(e, n);
				};
				d(g, (e) => {
					S(U).loaded && S(U).items.length === 0 && e(_);
				});
				var v = x(g, 2);
				i(v, 21, () => S(U).items, (e) => e.id, (r, i) => {
					var a = _t();
					let o;
					var c = b(a);
					{
						let e = R(() => S(K) === S(i).id);
						ze(c, {
							get item() {
								return S(i);
							},
							get cacheSupported() {
								return S(W);
							},
							get active() {
								return S(e);
							},
							onOpenImage: (e) => qe(S(i), e),
							onOpenVideo: () => {
								O(K, S(i).id, !0);
							},
							onCloseVideo: () => {
								O(K, null);
							}
						});
					}
					var l = x(c, 2);
					{
						let e = R(() => s()(`${S(i).kind === "video" ? "videoContextMenu" : "imageContextMenu"}.copyUrl`)), t = R(() => s()(`${S(i).kind === "video" ? "videoContextMenu" : "imageContextMenu"}.copyUrl`)), r = R(() => s()(`${S(i).kind === "video" ? "videoContextMenu" : "imageContextMenu"}.copySuccess`)), a = R(() => !S(i).url);
						V(l, {
							variant: "copy",
							shape: "circle",
							contentLayout: "icon",
							className: "media-copy-button",
							get ariaLabel() {
								return S(e);
							},
							get title() {
								return S(t);
							},
							get floatingMessage() {
								return S(r);
							},
							get disabled() {
								return S(a);
							},
							onClick: (e) => Ke(S(i), e),
							children: (e, t) => {
								var r = ft();
								let i;
								y(() => i = n(r, "", i, { "mask-image": `url("${_e}")` })), p(e, r);
							},
							$$slots: { default: !0 }
						});
					}
					var u = x(l, 2), f = b(u), m = b(f), h = F(m, !0), g = x(m, 2), _ = b(g), v = (e) => {
						var n = ht(), r = F(n, !0);
						y((e, i) => {
							I(n, "datetime", e), t(r, i);
						}, [() => (/* @__PURE__ */ new Date(S(i).uploadedAt * 1e3)).toISOString(), () => Be(S(i).uploadedAt)]), p(e, n);
					}, ee = (e) => {
						var n = M();
						y((e) => t(n, e), [() => s()("uploadedMedia.unknown")]), p(e, n);
					};
					d(_, (e) => {
						S(i).uploadedAt === void 0 ? e(ee, -1) : e(v);
					}), e(g), e(f);
					var C = x(f, 2);
					{
						let e = R(() => S(U).deletingId === S(i).id ? s()("uploadedMedia.deleting") : s()("uploadedMedia.delete")), t = R(() => S(U).deletingId === S(i).id ? s()("uploadedMedia.deleting") : s()("uploadedMedia.delete")), r = R(() => !S(i).deleteId || S(U).loading || !!S(U).deletingId || S(Le));
						V(C, {
							shape: "square",
							contentLayout: "icon",
							className: "media-delete-button",
							get ariaLabel() {
								return S(e);
							},
							get title() {
								return S(t);
							},
							get disabled() {
								return S(r);
							},
							onClick: (e) => {
								Se = e.currentTarget, O(ye, S(U)?.context?.endpoint ?? null, !0), O(G, S(i), !0);
							},
							children: (e, t) => {
								var r = gt();
								let i;
								y(() => i = n(r, "", i, { "mask-image": `url("${he}")` })), p(e, r);
							},
							$$slots: { default: !0 }
						});
					}
					e(u), e(a), y((e) => {
						I(a, "data-media-kind", S(i).kind), o = L(a, 1, "svelte-hlt8mi", null, o, { "video-active": S(i).kind === "video" && S(K) === S(i).id }), t(h, e);
					}, [() => S(i).size === void 0 ? s()("uploadedMedia.unknown") : Q(S(i).size)]), p(r, a);
				}), e(v), ee(v, (e) => O(ke, e), () => S(ke));
				var C = x(v, 2), w = (n) => {
					var r = vt(), i = b(r);
					{
						let e = R(() => S(U).loading || !!S(U).deletingId || S(Le));
						V(i, {
							className: "media-load-more-button",
							onClick: () => H.controller.load(!0),
							get disabled() {
								return S(e);
							},
							children: (e, n) => {
								E();
								var r = M();
								y((e) => t(r, e), [() => s()("uploadedMedia.loadMore")]), p(e, r);
							},
							$$slots: { default: !0 }
						});
					}
					e(r), p(n, r);
				};
				d(C, (e) => {
					S(U).hasMore && !S(U).needsRefresh && e(w);
				}), p(r, a);
			};
			d(C, (e) => {
				S(U) && e(w);
			}), y((e) => {
				I(u, "aria-label", e), u.disabled = !!S(U)?.deletingId || S(Le), h !== (h = H.value.selectedId ?? "") && (u.value = (u.__value = h) ?? "", f(u, h));
			}, [() => s()("uploadedMedia.server")]), g("change", u, (e) => H.controller.select(e.currentTarget.value)), p(r, a);
		};
		d(h, (e) => {
			B.value.isAuthenticated ? H.value.configuring ? e(v, 1) : H.value.configurationError ? e(C, 2) : H.value.destinations.length === 0 ? e(w, 3) : e(T, -1) : e(_);
		}), e(u), e(l);
		var k = x(l, 2);
		{
			let n = R(() => !S(U)?.loading || !!S(U)?.error), r = R(() => S(U)?.error ? "alert" : "status");
			pe(k, {
				get show() {
					return S(Re);
				},
				variant: "anchor-bottom-right",
				get anchor() {
					return S(Ne);
				},
				anchorRightOffset: 16,
				get showInfoIcon() {
					return S(n);
				},
				get role() {
					return S(r);
				},
				children: (n, r) => {
					var i = wt(), a = b(i), o = (e) => {
						var n = Ct(), r = D(n), i = (e) => {
							var n = xt(), r = F(n, !0);
							y((e) => t(r, e), [() => s()(`uploadedMedia.${S(X)}`)]), p(e, n);
						};
						d(r, (e) => {
							S(X) && e(i);
						});
						var a = x(r, 2), o = F(a, !0), c = x(a, 2), l = (e) => {
							var n = xt(), r = F(n, !0);
							y((e) => t(r, e), [() => s()("uploadedMedia.retryAfter", { values: { time: new Date(S(U).error.retryAt).toLocaleTimeString() } })]), p(e, n);
						};
						d(c, (e) => {
							S(U).error.retryAt && e(l);
						});
						var u = x(c, 2), f = (e) => {
							var n = St(), r = F(n, !0);
							y(() => t(r, S(U).error.diagnostic)), p(e, n);
						};
						d(u, (e) => {
							S(U).error.diagnostic && e(f);
						}), y((e) => t(o, e), [() => s()(`uploadedMedia.errors.${S(U).error.code === "invalidResponse" && S(ve) && !S(U).loaded ? "unavailable" : S(U).error.code}`)]), p(e, n);
					}, c = (e) => {
						de(e, {
							showLoader: !0,
							text: !0,
							loaderSize: 30
						});
					}, l = (e) => {
						var n = xt(), r = F(n, !0);
						y((e) => t(r, e), [() => s()(`uploadedMedia.${S(X)}`)]), p(e, n);
					};
					d(a, (e) => {
						S(U)?.error ? e(o) : S(U)?.loading ? e(c, 1) : S(X) && e(l, 2);
					}), e(i), p(n, i);
				},
				$$slots: { default: !0 }
			});
		}
		var A = x(k, 2);
		c(A, () => S(Y), (e) => {
			{
				let n = R(() => !!S(G)), r = R(() => s()("uploadedMedia.delete")), i = R(() => s()("uploadedMedia.confirmDescription")), a = R(() => s()("uploadedMedia.delete"));
				Te(e, {
					get open() {
						return S(n);
					},
					onOpenChange: (e) => {
						e || He();
					},
					get title() {
						return S(r);
					},
					get description() {
						return S(i);
					},
					get confirmLabel() {
						return S(a);
					},
					onConfirm: Ue,
					onCancel: He,
					preventCloseWhileConfirming: !0,
					showConfirmSpinner: !0,
					closeOnConfirm: !1,
					children: (e, n) => {
						var r = m(), i = D(r), a = (e) => {
							var n = Et(), r = D(n), i = F(r, !0), a = x(r, 2), o = F(a, !0), c = x(a, 2), l = (e) => {
								var n = Tt(), r = F(n, !0);
								y(() => t(r, S(G).deleteId.sha256)), p(e, n);
							};
							d(c, (e) => {
								S(G).deleteId && e(l);
							});
							var u = x(c, 2), f = F(u, !0);
							y((e, n) => {
								t(i, e), t(o, S(ye) ?? S(G).serverUrl), t(f, n);
							}, [() => s()(`uploadedMedia.${S(G).kind}`), () => S(G).url ?? s()("uploadedMedia.previewUnavailable")]), p(e, n);
						};
						d(i, (e) => {
							S(G) && e(a);
						}), p(e, r);
					},
					$$slots: { default: !0 }
				});
			}
		});
		var j = x(A, 2);
		{
			let e = R(() => S(q)[S(J)]?.src ?? ""), t = R(() => S(q)[S(J)]?.alt ?? "");
			be(j, {
				get src() {
					return S(e);
				},
				get alt() {
					return S(t);
				},
				onClose: $,
				get mediaList() {
					return S(q);
				},
				get currentIndex() {
					return S(J);
				},
				onNavigate: (e) => {
					O(J, e, !0);
				},
				get openingFocusOrigin() {
					return S(Oe);
				},
				get show() {
					return S(Ee);
				},
				set show(e) {
					O(Ee, e, !0);
				}
			});
		}
		p(r, a);
	};
	d(Xe, (e) => {
		S(z) && e(Ze);
	}), p(a, Ye);
	var Qe = r(Je);
	return u(), Qe;
}
o(["change"]);
export { kt as default };
