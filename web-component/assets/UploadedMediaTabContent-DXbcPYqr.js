import { At as e, B as t, C as n, Ct as r, F as i, G as a, J as o, L as s, O as c, Q as l, R as u, S as d, U as f, W as p, X as m, Y as h, _t as g, at as _, ct as v, dt as y, et as b, f as ee, ft as x, gt as S, k as C, kt as te, lt as w, mt as T, nt as E, o as ne, ot as D, q as re, r as ie, s as ae, t as oe, tt as se, ut as O, v as k, w as ce, wt as le, x as ue, yt as A } from "./index-client-Bdka-Daw.js";
import { n as j } from "./appRuntimeEnvironment-BvtUCHcA.js";
import { l as M } from "./relayConfigUtils-DD5f1UAM.js";
import { n as N } from "./uploadOperation-BVOBq-hD.js";
import { pt as de, t as P } from "./LoadingPlaceholder-j1_vRYno.js";
import { i as F } from "./signedEventResultValidator-BsR3Zf_8.js";
import { r as I } from "./authStore.svelte-CoGdd5_Z.js";
import { c as L } from "./appUtils-Bsk0mFqn.js";
import { a as R, c as fe, l as pe, n as me, o as z, r as B, s as he, t as ge } from "./uploadDestinationResolver-C3ZopjgY.js";
import { t as V } from "./inViewportAction.svelte-C2PkqWTH.js";
import { J as _e, ct as H, i as ve, it as ye, lt as be, ot as U, st as W } from "./App-BVcniO1E.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/uploadMediaImageUrl.ts
function xe(e, t, n) {
	try {
		let r = fe({
			rawUrl: e,
			trustedUploadUrl: he(t),
			pageProtocol: n
		}).url;
		return new URL(r).toString();
	} catch {
		return null;
	}
}
function G(e) {
	let t = new URL(e.currentOrigin), n = xe(e.url, e.serverUrl, t.protocol);
	if (!n) return null;
	let r = new URL(`${e.basePath.endsWith("/") ? e.basePath : `${e.basePath}/`}__ehagaki-image/upload-media`, t);
	return r.searchParams.set("url", n), r.searchParams.set("server", e.serverUrl), r.toString();
}
function Se(e) {
	return !e.url || e.cacheSupported === null ? null : e.cacheSupported ? G({
		url: e.url,
		serverUrl: e.serverUrl,
		basePath: e.basePath,
		currentOrigin: e.currentOrigin
	}) : e.url;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/uploadMediaImageCacheClient.ts
function K() {
	let e = j();
	return e.serviceWorkerEnabled ? e.window?.navigator.serviceWorker?.controller ?? null : null;
}
function q(e, t) {
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
function J(e) {
	return typeof e == "object" && !!e;
}
var Y = null, X = null;
async function Ce() {
	let e = K();
	return e ? (e === Y && X || (Y = e, X = q(e, { type: H }).then((e) => J(e) && e.version === 1 && e.supported === !0)), await X) : (Y = null, X = null, !1);
}
async function Z(e) {
	if (!e.length) return !0;
	let t = K();
	if (!t) return !1;
	let n = [...new Set(e)], r = !0;
	for (let e = 0; e < n.length; e += U.maxEntries) {
		let i = await q(t, {
			type: W,
			urls: n.slice(e, e + U.maxEntries)
		});
		r = J(i) && i.version === 1 && i.success === !0 && r;
	}
	return r;
}
// D:/ドキュメント/GitHub/ehagaki/src/components/UploadedMediaPreview.svelte
var Q = a("<!> <!>", 1), we = a("<button type=\"button\" class=\"image-open\"><img alt=\"\" referrerpolicy=\"no-referrer\" class=\"svelte-1gq8ela\"/></button>"), Te = a("<span class=\"svg-icon\" aria-hidden=\"true\"></span>"), Ee = a("<video controls=\"\" playsinline=\"\" preload=\"metadata\" class=\"svelte-1gq8ela\"><track kind=\"captions\"/></video> <!>", 3), De = a("<div class=\"video-placeholder svelte-1gq8ela\"><!></div>"), Oe = a("<div><!></div>"), ke = {
	hash: "svelte-1gq8ela",
	code: ".preview.svelte-1gq8ela {position:relative;width:100%;min-width:0;aspect-ratio:1;}.preview-empty.svelte-1gq8ela {display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;}img.svelte-1gq8ela, video.svelte-1gq8ela {display:block;width:100%;height:100%;}img.svelte-1gq8ela {object-fit:cover;}video.svelte-1gq8ela {object-fit:contain;}video.svelte-1gq8ela, .video-placeholder.svelte-1gq8ela {background:#181818;}.video-placeholder.svelte-1gq8ela {width:100%;height:100%;display:grid;place-items:center;}.preview.svelte-1gq8ela button.image-open {display:block;width:100%;height:100%;min-width:0;min-height:0;max-width:none;margin:0;padding:0;border:0;background:transparent;cursor:pointer;}.preview.svelte-1gq8ela button.media-video-button {padding:0;width:44px;height:44px;min-width:44px;color:white;}.preview.svelte-1gq8ela button.media-video-button:hover:not(:disabled) .svg-icon {background-color:white;}.preview.svelte-1gq8ela button.video-close {position:absolute;top:4px;right:4px;}.preview.svelte-1gq8ela button.video-open {width:56px;height:56px;}"
};
function Ae(i, a) {
	le(a, !0), C(i, ke);
	let o = () => ae(de, "$_", s), [s, d] = ne(), g = ye("icons/play_arrow_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"), x = S(!1), E = S(!1), D = S(void 0), ie = A(() => Se({
		url: a.item.url,
		serverUrl: a.item.serverUrl,
		cacheSupported: a.cacheSupported,
		basePath: "./",
		currentOrigin: window.location.origin
	}));
	function se(e) {
		return { destroy() {
			e.pause(), e.removeAttribute("src"), e.load();
		} };
	}
	async function ue() {
		T(E, !0), a.item.url && a.cacheSupported && await Z([a.item.url]);
	}
	oe(() => {
		b(D)?.pause();
	});
	var j = Oe();
	let M;
	var N = v(j), F = (e) => {
		{
			let t = A(() => o()("uploadedMedia.previewUnavailable"));
			P(e, { get text() {
				return b(t);
			} });
		}
	}, I = (e) => {
		var n = p(), r = w(n), i = (e) => {
			var n = Q(), r = w(n);
			{
				let e = A(() => o()("uploadedMedia.previewUnavailable"));
				P(r, { get text() {
					return b(e);
				} });
			}
			var i = y(r, 2);
			L(i, {
				onClick: () => {
					T(E, !1);
				},
				children: (e, n) => {
					te();
					var r = re();
					_((e) => t(r, e), [() => o()("uploadedMedia.retry")]), f(e, r);
				},
				$$slots: { default: !0 }
			}), f(e, n);
		}, s = (e) => {
			var t = we(), n = O(t);
			_((e) => {
				k(t, "aria-label", e), k(n, "src", b(ie));
			}, [() => o()("uploadedMedia.openImage")]), h("click", t, (e) => {
				e.currentTarget instanceof HTMLElement && a.onOpenImage?.(e.currentTarget);
			}), m("error", n, ue), l(n), f(e, t);
		};
		u(r, (e) => {
			b(E) ? e(i) : b(x) && a.cacheSupported !== null && b(ie) && e(s, 1);
		}), f(e, n);
	}, R = (e) => {
		var t = Ee(), n = w(t);
		ee(n, (e) => T(D, e), () => b(D)), c(n, (e) => se?.(e));
		var r = y(n, 2);
		{
			let e = A(() => o()("uploadedMedia.closeVideo")), t = A(() => o()("uploadedMedia.closeVideo"));
			L(r, {
				variant: "close",
				shape: "circle",
				contentLayout: "icon",
				className: "media-video-button video-close",
				get ariaLabel() {
					return b(e);
				},
				get title() {
					return b(t);
				},
				get onClick() {
					return a.onCloseVideo;
				},
				children: (e, t) => {
					var n = Te();
					f(e, n);
				},
				$$slots: { default: !0 }
			});
		}
		_(() => k(n, "src", a.item.url)), m("ended", n, function(...e) {
			a.onCloseVideo?.apply(this, e);
		}), f(e, t);
	}, fe = (t) => {
		var r = De(), i = v(r);
		{
			let e = A(() => o()("uploadedMedia.openVideo")), t = A(() => o()("uploadedMedia.openVideo"));
			L(i, {
				variant: "close",
				shape: "circle",
				contentLayout: "icon",
				className: "media-video-button video-open",
				get ariaLabel() {
					return b(e);
				},
				get title() {
					return b(t);
				},
				get onClick() {
					return a.onOpenVideo;
				},
				children: (e, t) => {
					var r = Te();
					let i;
					_(() => i = n(r, "", i, { "mask-image": `url("${g}")` })), f(e, r);
				},
				$$slots: { default: !0 }
			});
		}
		e(r), f(t, r);
	};
	u(N, (e) => {
		a.item.url ? a.item.kind === "image" ? e(I, 1) : a.active ? e(R, 2) : e(fe, -1) : e(F);
	}), e(j), c(j, (e, t) => V?.(e, t), () => ({
		enabled: !0,
		rootMargin: "200px",
		onEnterView: () => {
			T(x, !0);
		}
	})), _(() => M = ce(j, 1, "preview svelte-1gq8ela", null, M, { "preview-empty": !a.item.url || a.item.kind === "image" && (b(E) || !b(x) || a.cacheSupported === null) })), f(i, j), r(), d();
}
o(["click"]);
// D:/ドキュメント/GitHub/ehagaki/src/lib/upload/uploadMediaManagementController.ts
var $ = () => ({
	destinations: [],
	selectedId: null,
	current: null
});
function je(e) {
	return `${e.protocol}\n${e.serverUrl}`;
}
var Me = class {
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
		return [...this.states.values()].some((e) => !!e.deletingId);
	}
	activate() {
		this.active = !0;
	}
	suspend() {
		this.active = !1, this.epoch++, this.configuring = !1;
		for (let e of this.states.values()) e.abort?.abort(), e.generation++, e.deletingId && e.deleteDispatched && (e.error = new z("unknownDelete"), e.needsRefresh = !0, e.nextPage = null), e.loading = !1, e.deletingId = null, e.deleteDispatched = !1;
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
			deletingId: e.deletingId,
			notice: e.notice
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
		let t = (this.deps.auth ?? I).value;
		if (e && (!t.isAuthenticated || t.pubkey !== e)) return;
		if (e !== this.pubkey && (this.invalidate(), this.pubkey = e), !e) {
			this.emit();
			return;
		}
		if (this.savedDestinationsRead) {
			this.selectedId && !this.states.get(this.selectedId)?.loaded && this.load();
			return;
		}
		if (this.configuring) return;
		let n = this.epoch, r = ++this.configurationGeneration, i = () => this.active && n === this.epoch && r === this.configurationGeneration && this.pubkey === e && (this.deps.auth ?? I).value.isAuthenticated && (this.deps.auth ?? I).value.pubkey === e;
		this.configuring = !0, this.configurationError = null, this.emit();
		try {
			let t = await this.deps.loadDestinations?.(e) ?? [];
			i() && this.configure(e, t);
		} catch {
			i() && (this.configurationError = new z("invalidDestination"));
		} finally {
			i() && (this.configuring = !1, this.emit());
		}
	}
	configure(e, t) {
		if (e !== this.pubkey && this.invalidate(), this.pubkey = e, this.configurationGeneration++, this.configuring = !1, this.configurationError = null, this.savedDestinationsRead = !0, !e) {
			this.emit();
			return;
		}
		this.destinations = t.filter((e) => e.protocol !== "custom-http").map((t) => ge(t, {
			pubkeyHex: e,
			npub: M.npubEncode(e)
		}));
		let n = new Set(this.destinations.map((e) => e.id));
		for (let [e, t] of this.states) n.has(e) || (t.abort?.abort(), this.states.delete(e));
		for (let e of this.destinations) {
			let t = this.states.get(e.id);
			t && je(t.destination) === je(e) ? t.destination = e : (t?.abort?.abort(), this.states.set(e.id, {
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
				deleteDispatched: !1
			}));
		}
		this.selectedId && n.has(this.selectedId) || (this.selectedId = this.destinations.find((e) => e.isDefault)?.id ?? this.destinations[0]?.id ?? null), this.emit(), this.selectedId && !this.states.get(this.selectedId)?.loaded && !this.states.get(this.selectedId)?.loading && this.load();
	}
	select(e) {
		if (!this.busy && this.states.has(e) && e !== this.selectedId) {
			if (this.selectedId) {
				let e = this.states.get(this.selectedId);
				e?.abort?.abort(), e && (e.deletingId && e.deleteDispatched && (e.error = new z("unknownDelete"), e.nextPage = null, e.needsRefresh = !0), e.generation++, e.loading = !1, e.deletingId = null, e.deleteDispatched = !1);
			}
			this.selectedId = e, this.emit(), this.states.get(e)?.loaded || this.load();
		}
	}
	begin(e) {
		e.abort?.abort();
		let t = new AbortController();
		e.abort = t;
		let n = ++e.generation, r = this.epoch, i = this.pubkey, a = { ...e.destination }, o = () => this.active && (this.deps.auth ?? I).value.isAuthenticated && (this.deps.auth ?? I).value.pubkey === i && this.epoch === r && this.pubkey === i && this.states.get(a.id) === e && e.generation === n && !t.signal.aborted, s = () => {
			if (!o()) throw N();
			F(this.deps.auth ?? I, i);
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
				}) ?? new B({
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
		if (!this.active || !t || !this.pubkey || t.loading || t.deletingId || t.error?.retryAt && Date.now() < t.error.retryAt) return;
		e = e && !t.needsRefresh && !!t.nextPage;
		let n = this.begin(t);
		t.loading = !0, t.error = null, t.notice = null, this.emit();
		try {
			let r = (this.deps.getAdapter ?? me)(t.destination.protocol);
			if (!r.listMediaPage || !r.deleteMedia) throw new z("unavailable");
			let i = await r.listMediaPage({
				...n.params,
				page: e ? t.nextPage : null,
				context: e ? t.context : null
			});
			if (n.params.assertSession(), !n.current()) return;
			let a = i.nextPage?.protocol === "blossom" ? i.nextPage.cursor : null;
			if (e && a && t.cursors.has(a)) throw new z("invalidResponse");
			e || t.cursors.clear(), a && t.cursors.add(a);
			let o = e ? [...t.items, ...i.items] : i.items;
			t.items = [...new Map(o.map((e) => [e.id, e])).values()], t.excludedCount = (e ? t.excludedCount : 0) + i.excludedCount, t.invalidCount = (e ? t.invalidCount : 0) + i.invalidCount, t.nextPage = i.nextPage, t.context = i.context, t.loaded = !0, t.support = "supported", t.needsRefresh = !1;
		} catch (e) {
			if (!n.current()) return;
			t.error = R(e), t.error.code === "unavailable" && (t.support = "unavailable"), t.error.code === "invalidResponse" && (t.nextPage = null, t.needsRefresh = !0);
		} finally {
			n.current() && (t.loading = !1, this.emit());
		}
	}
	async delete(e) {
		let t = this.selectedId ? this.states.get(this.selectedId) : void 0, n = t?.items.find((t) => t.id === e);
		if (!this.active || !t || !n?.deleteId || !t.context || t.loading || t.deletingId || !this.pubkey) return !1;
		let r = this.begin(t), i = n.deleteId.sha256, a = n.kind === "image" ? [...new Set(t.items.filter((e) => e.kind === "image" && e.deleteId?.sha256 === i && e.url).map((e) => e.url))] : [];
		t.deletingId = n.id, t.deleteDispatched = !1, t.error = null, t.notice = null, this.emit();
		try {
			let e = (this.deps.getAdapter ?? me)(t.destination.protocol);
			if (!e.deleteMedia) throw new z("unavailable");
			if (await e.deleteMedia({
				...r.params,
				item: n,
				context: t.context
			}), r.current() && (t.deleteDispatched = !1, t.items = t.items.filter((e) => e.deleteId?.sha256 !== i), t.nextPage = null, t.needsRefresh = !0, t.notice = "deleted", this.emit()), a.length) {
				let e = async () => {
					try {
						return await this.deps.evictImages(a);
					} catch {
						return !1;
					}
				}, n = await e();
				!n && r.current() && (n = await e()), !n && r.current() && (t.notice = "cacheCleanupFailed");
			}
			return !0;
		} catch (e) {
			return r.current() && (t.error = R(e), t.error.code === "unknownDelete" && (t.nextPage = null, t.needsRefresh = !0)), !1;
		} finally {
			r.current() && (t.deletingId = null, t.deleteDispatched = !1, this.emit());
		}
	}
};
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/useUploadMediaManagement.svelte.ts
function Ne() {
	let e = S(x($()));
	return {
		get value() {
			return b(e);
		},
		controller: new Me({
			loadDestinations: (e) => pe.getAll(e),
			evictImages: Z,
			onChange: (t) => {
				T(e, t, !0);
			}
		})
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/components/UploadedMediaTabContent.svelte
var Pe = a("<p class=\"media-status svelte-hlt8mi\" role=\"status\"> </p>"), Fe = a("<p class=\"media-status svelte-hlt8mi\" role=\"alert\"> </p> <!>", 1), Ie = a("<option class=\"svelte-hlt8mi\"> </option>"), Le = a("<span class=\"svg-icon\" aria-hidden=\"true\"></span>"), Re = a("<p class=\"media-status svelte-hlt8mi\"> </p>"), ze = a("<p class=\"media-status diagnostic svelte-hlt8mi\"> </p>"), Be = a("<p class=\"media-status svelte-hlt8mi\" role=\"alert\"> </p> <!> <!>", 1), Ve = a("<p class=\"media-status svelte-hlt8mi\"> </p> <!>", 1), He = a("<time> </time>"), Ue = a("<span class=\"svg-icon media-delete-icon svelte-hlt8mi\" aria-hidden=\"true\"></span>"), We = a("<article><!> <div class=\"media-overlay svelte-hlt8mi\"><div class=\"media-metadata svelte-hlt8mi\"><span> </span> <span><!></span></div> <!></div></article>"), Ge = a("<div class=\"list-end-actions svelte-hlt8mi\"><!></div>"), Ke = a("<!> <!> <!> <!> <div class=\"media-list svelte-hlt8mi\" tabindex=\"-1\"></div> <!>", 1), qe = a("<div class=\"media-toolbar svelte-hlt8mi\"><select class=\"media-server-select svelte-hlt8mi\"></select> <!></div> <!>", 1), Je = a("<p class=\"server-url svelte-hlt8mi\"> </p>"), Ye = a("<p class=\"svelte-hlt8mi\"> </p> <p class=\"server-url svelte-hlt8mi\"> </p> <!> <p class=\"server-url svelte-hlt8mi\"> </p>", 1), Xe = a("<div class=\"uploaded-media-dialog uploaded-media-content svelte-hlt8mi\"><div class=\"media-management svelte-hlt8mi\"><!></div></div> <!> <!>", 1), Ze = {
	hash: "svelte-hlt8mi",
	code: ".uploaded-media-content.svelte-hlt8mi {background:var(--dialog-bg);flex:1;min-height:0;overflow:auto;width:100%;}.media-management.svelte-hlt8mi {flex:none;width:100%;min-width:0;display:flex;flex-direction:column;}.uploaded-media-dialog button {height:auto;min-height:44px;max-width:100%;padding:8px 12px;}.uploaded-media-dialog button.image-open {display:block;width:100%;height:100%;min-height:0;max-width:none;margin:0;padding:0;border:none;background:transparent;cursor:pointer;}p.svelte-hlt8mi {margin:0;}.media-toolbar.svelte-hlt8mi {display:grid;grid-template-columns:minmax(0, 1fr) 44px;gap:4px;padding:8px;}.media-status.svelte-hlt8mi {margin:8px 12px;}.media-server-select.svelte-hlt8mi {width:100%;min-width:0;min-height:44px;max-width:100%;padding:8px 32px 8px 10px;border:1px solid var(--border);border-radius:6px;background:var(--dialog-bg);color:var(--text);font:inherit;}.media-server-select.svelte-hlt8mi option:where(.svelte-hlt8mi) {background:var(--dialog-bg);color:var(--text);}.list-end-actions.svelte-hlt8mi {display:flex;width:100%;padding:10px;box-sizing:border-box;}.uploaded-media-dialog button.media-load-more-button {width:100%;}.uploaded-media-dialog button.media-refresh-button {width:44px;height:44px;padding:0;background:transparent;border:none;}.uploaded-media-dialog button.media-delete-button {flex:none;padding:0;background:transparent;border:none;color:white;--text: white;width:44px;min-width:44px;max-width:44px;height:44px;min-height:44px;max-height:44px;}.uploaded-media-dialog button.media-delete-button:hover:not(:disabled) {background:rgb(255 255 255 / 15%);color:white;}.uploaded-media-dialog button.media-delete-button:hover:not(:disabled) .svg-icon {background-color:white;}.uploaded-media-dialog button.media-delete-button:focus-visible {outline:2px solid white;outline-offset:-2px;}.media-delete-icon.svelte-hlt8mi {width:24px;height:24px;--svg: currentColor;}.server-url.svelte-hlt8mi, .diagnostic.svelte-hlt8mi {overflow-wrap:anywhere;font-size:.875rem;}.media-list.svelte-hlt8mi {display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));gap:2px;}article.svelte-hlt8mi {position:relative;min-width:0;}.media-overlay.svelte-hlt8mi {position:absolute;inset:auto 0 0;display:flex;align-items:flex-end;justify-content:space-between;gap:4px;padding:16px 4px 4px 8px;color:var(--text);background:linear-gradient(transparent, rgb(0 0 0 / 70%));pointer-events:none;}.media-metadata.svelte-hlt8mi {min-width:0;align-self:center;display:flex;flex-direction:column;font-size:.6875rem;line-height:1.5;overflow-wrap:anywhere;text-shadow:0 1px 2px rgb(0 0 0 / 70%);}.media-overlay.svelte-hlt8mi button {pointer-events:auto;}\n    /* Keep native video playback controls available beneath the overlay. */.video-active.svelte-hlt8mi .media-overlay:where(.svelte-hlt8mi) {bottom:56px;}"
};
function Qe(a, o) {
	le(o, !0), C(a, Ze);
	let c = () => ae(de, "$_", l), [l, m] = ne(), j = ie(o, "onBusyChange", 3, () => void 0), M = S(!1), N = S(!1), F = S(!1), R = A(() => o.show && !b(F));
	function fe() {
		T(F, !1), B.controller.activate();
	}
	function pe() {
		T(F, !0), Z++, g(Q), T(U, null), T(G, null), $(), B.controller.suspend();
	}
	function me() {
		return B.controller.busy;
	}
	function z() {
		return b(J);
	}
	let B = Ne(), he = ye("icons/delete_forever_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"), ge = ye("icons/refresh_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"), V = A(() => B.value.current), H = S(null), U = S(null), W = S(null), xe = null, G = S(null), K = S(x([])), q = S(-1), J = S(!1), Y = S(null), X = S(void 0), Z = 0, Q = S(0), we = null;
	D(() => {
		let e = o.show;
		E(() => e ? fe() : pe());
	});
	function Te(e) {
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
	function Ee(e) {
		return (/* @__PURE__ */ new Date(e * 1e3)).toLocaleString(void 0, {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit"
		});
	}
	function De() {
		g(Q), we = null, T(U, null), T(G, null), $(), B.controller.invalidate();
	}
	D(() => {
		let e = b(R), t = I.value, n = ve.value.destinations;
		E(() => {
			if (!e) return;
			B.controller.activate();
			let r = t.isAuthenticated ? t.pubkey : null;
			n.length ? B.controller.configure(r, n) : B.controller.configureSaved(r), T(M, !0);
		});
	}), D(() => {
		b(R) && !b(N) && o.onInitialReady && b(M) && !B.value.configuring && (!I.value.isAuthenticated || B.value.configurationError || B.value.destinations.length === 0 || b(V)?.loaded || b(V)?.items.length || b(V)?.error) && (T(N, !0), o.onInitialReady());
	}), D(() => {
		if (!b(R) || b(H) !== null) return;
		let e = ++Z;
		Ce().then((t) => {
			e === Z && T(H, t, !0);
		});
	}), D(() => {
		let e = B.value.selectedId, t = `${I.value.pubkey}\n${e}\n${b(V)?.destination.protocol}\n${b(V)?.destination.serverUrl}\n${b(V)?.context?.endpoint}`;
		E(() => {
			t !== we && (we = t, g(Q), T(U, null), T(G, null), $());
		});
	}), D(() => {
		let e = b(V);
		E(() => {
			b(U) && (e?.destination.serverUrl !== b(U).serverUrl || e?.context?.endpoint !== b(W) || !e.deletingId && !e.items.some((e) => e.id === b(U)?.id)) && T(U, null), b(G) && !e?.items.some((e) => e.id === b(G)) && T(G, null);
			let t = b(K)[b(q)]?.id;
			b(J) && t && !e?.items.some((e) => e.id === t && e.kind === "image") && $();
		});
	}), D(() => {
		j()(!!b(V)?.deletingId);
	}), oe(() => {
		Z++, De();
	});
	function Oe() {
		let e = b(Q), t = xe;
		T(U, null), se().then(() => e === b(Q) && t?.isConnected && t.focus({ preventScroll: !0 }));
	}
	async function ke() {
		let e = b(U), t = b(Q), n = xe;
		!e || b(V)?.destination.serverUrl !== e.serverUrl || b(V).context?.endpoint !== b(W) || !b(V).items.some((t) => t.id === e.id && t.deleteId?.sha256 === e.deleteId?.sha256) ? Oe() : (await B.controller.delete(e.id), t === b(Q) && (T(U, null), await se(), t === b(Q) && (n?.isConnected ? n.focus({ preventScroll: !0 }) : b(X)?.focus({ preventScroll: !0 }))));
	}
	function $() {
		T(J, !1), T(K, [], !0), T(q, -1), T(Y, null);
	}
	function je(e) {
		return Se({
			url: e.url,
			serverUrl: e.serverUrl,
			cacheSupported: b(H),
			basePath: "./",
			currentOrigin: window.location.origin
		});
	}
	function Me(e, t) {
		let n = (b(V)?.items ?? []).flatMap((e) => {
			if (e.kind !== "image") return [];
			let t = je(e);
			return t ? [{
				id: e.id,
				src: t,
				alt: c()("uploadedMedia.image"),
				type: "image"
			}] : [];
		}), r = n.findIndex((t) => t.id === e.id);
		r < 0 || (T(K, n, !0), T(q, r, !0), T(Y, t, !0), T(J, !0));
	}
	var Qe = {
		activate: fe,
		suspend: pe,
		isBusy: me,
		isFullscreen: z,
		invalidateSession: De
	}, $e = p(), et = w($e), tt = (r) => {
		var a = Xe(), l = w(a), m = v(l), g = v(m), x = (e) => {
			var n = Pe(), r = O(n, !0);
			_((e) => t(r, e), [() => c()("uploadedMedia.errors.authentication")]), f(e, n);
		}, S = (e) => {
			P(e, {
				showLoader: !0,
				text: !0
			});
		}, C = (e) => {
			var n = Fe(), r = w(n), i = O(r, !0), a = y(r, 2);
			L(a, {
				onClick: () => B.controller.configureSaved(I.value.pubkey),
				children: (e, n) => {
					te();
					var r = re();
					_((e) => t(r, e), [() => c()("uploadedMedia.refresh")]), f(e, r);
				},
				$$slots: { default: !0 }
			}), _((e) => t(i, e), [() => c()("uploadedMedia.errors.invalidDestination")]), f(e, n);
		}, E = (e) => {
			var n = Pe(), r = O(n, !0);
			_((e) => t(r, e), [() => c()("uploadedMedia.noServers")]), f(e, n);
		}, ne = (r) => {
			var a = qe(), s = w(a), l = v(s);
			i(l, 21, () => B.value.destinations, (e) => e.id, (e, n) => {
				var r = Ie(), i = O(r, !0), a = {};
				_(() => {
					t(i, b(n).name), a !== (a = b(n).id) && (r.value = (r.__value = a) ?? "");
				}), f(e, r);
			}), e(l);
			var p;
			ue(l);
			var m = y(l, 2), g = (e) => {
				{
					let t = A(() => c()("uploadedMedia.refresh")), r = A(() => c()("uploadedMedia.refresh")), i = A(() => b(V).loading || !!b(V).deletingId);
					L(e, {
						shape: "square",
						contentLayout: "icon",
						className: "media-refresh-button",
						get ariaLabel() {
							return b(t);
						},
						get title() {
							return b(r);
						},
						onClick: () => {
							T(G, null), $(), B.controller.load();
						},
						get disabled() {
							return b(i);
						},
						children: (e, t) => {
							var r = Le();
							let i;
							_(() => i = n(r, "", i, { "mask-image": `url("${ge}")` })), f(e, r);
						},
						$$slots: { default: !0 }
					});
				}
			};
			u(m, (e) => {
				b(V) && e(g);
			}), e(s);
			var x = y(s, 2), S = (r) => {
				var a = Ke(), s = w(a), l = (e) => {
					P(e, {
						showLoader: !0,
						text: !0
					});
				};
				u(s, (e) => {
					b(V).loading && (!o.onInitialReady || b(N)) && e(l);
				});
				var d = y(s, 2), p = (e) => {
					var n = Be(), r = w(n), i = O(r, !0), a = y(r, 2), o = (e) => {
						var n = Re(), r = O(n, !0);
						_((e) => t(r, e), [() => c()("uploadedMedia.retryAfter", { values: { time: new Date(b(V).error.retryAt).toLocaleTimeString() } })]), f(e, n);
					};
					u(a, (e) => {
						b(V).error.retryAt && e(o);
					});
					var s = y(a, 2), l = (e) => {
						var n = ze(), r = O(n, !0);
						_(() => t(r, b(V).error.diagnostic)), f(e, n);
					};
					u(s, (e) => {
						b(V).error.diagnostic && e(l);
					}), _((e) => t(i, e), [() => c()(`uploadedMedia.errors.${b(V).error.code}`)]), f(e, n);
				};
				u(d, (e) => {
					b(V).error && e(p);
				});
				var m = y(d, 2), h = (e) => {
					var n = Pe(), r = O(n, !0);
					_((e) => t(r, e), [() => c()(`uploadedMedia.${b(V).notice}`)]), f(e, n);
				};
				u(m, (e) => {
					b(V).notice && e(h);
				});
				var g = y(m, 2), x = (e) => {
					var n = Ve(), r = w(n), i = O(r, !0), a = y(r, 2), o = (e) => {
						var n = Re(), r = O(n, !0);
						_((e) => t(r, e), [() => c()("uploadedMedia.moreUnseen")]), f(e, n);
					};
					u(a, (e) => {
						b(V).nextPage && e(o);
					}), _((e) => t(i, e), [() => c()("uploadedMedia.empty")]), f(e, n);
				};
				u(g, (e) => {
					b(V).loaded && b(V).items.length === 0 && e(x);
				});
				var S = y(g, 2);
				i(S, 21, () => b(V).items, (e) => e.id, (r, i) => {
					var a = We();
					let o;
					var s = v(a);
					{
						let e = A(() => b(G) === b(i).id);
						Ae(s, {
							get item() {
								return b(i);
							},
							get cacheSupported() {
								return b(H);
							},
							get active() {
								return b(e);
							},
							onOpenImage: (e) => Me(b(i), e),
							onOpenVideo: () => {
								T(G, b(i).id, !0);
							},
							onCloseVideo: () => {
								T(G, null);
							}
						});
					}
					var l = y(s, 2), d = v(l), p = v(d), m = O(p, !0), h = y(p, 2), g = v(h), ee = (e) => {
						var n = He(), r = O(n, !0);
						_((e, i) => {
							k(n, "datetime", e), t(r, i);
						}, [() => (/* @__PURE__ */ new Date(b(i).uploadedAt * 1e3)).toISOString(), () => Ee(b(i).uploadedAt)]), f(e, n);
					}, x = (e) => {
						var n = re();
						_((e) => t(n, e), [() => c()("uploadedMedia.unknown")]), f(e, n);
					};
					u(g, (e) => {
						b(i).uploadedAt === void 0 ? e(x, -1) : e(ee);
					}), e(h), e(d);
					var S = y(d, 2);
					{
						let e = A(() => b(V).deletingId === b(i).id ? c()("uploadedMedia.deleting") : c()("uploadedMedia.delete")), t = A(() => b(V).deletingId === b(i).id ? c()("uploadedMedia.deleting") : c()("uploadedMedia.delete")), r = A(() => !b(i).deleteId || b(V).loading || !!b(V).deletingId);
						L(S, {
							shape: "square",
							contentLayout: "icon",
							className: "media-delete-button",
							get ariaLabel() {
								return b(e);
							},
							get title() {
								return b(t);
							},
							get disabled() {
								return b(r);
							},
							onClick: (e) => {
								xe = e.currentTarget, T(W, b(V)?.context?.endpoint ?? null, !0), T(U, b(i), !0);
							},
							children: (e, t) => {
								var r = Ue();
								let i;
								_(() => i = n(r, "", i, { "mask-image": `url("${he}")` })), f(e, r);
							},
							$$slots: { default: !0 }
						});
					}
					e(l), e(a), _((e) => {
						k(a, "data-media-kind", b(i).kind), o = ce(a, 1, "svelte-hlt8mi", null, o, { "video-active": b(i).kind === "video" && b(G) === b(i).id }), t(m, e);
					}, [() => b(i).size === void 0 ? c()("uploadedMedia.unknown") : Te(b(i).size)]), f(r, a);
				}), e(S), ee(S, (e) => T(X, e), () => b(X));
				var C = y(S, 2), E = (n) => {
					var r = Ge(), i = v(r);
					{
						let e = A(() => b(V).loading || !!b(V).deletingId);
						L(i, {
							className: "media-load-more-button",
							onClick: () => B.controller.load(!0),
							get disabled() {
								return b(e);
							},
							children: (e, n) => {
								te();
								var r = re();
								_((e) => t(r, e), [() => c()("uploadedMedia.loadMore")]), f(e, r);
							},
							$$slots: { default: !0 }
						});
					}
					e(r), f(n, r);
				};
				u(C, (e) => {
					b(V).nextPage && !b(V).needsRefresh && e(E);
				}), f(r, a);
			};
			u(x, (e) => {
				b(V) && e(S);
			}), _((e) => {
				k(l, "aria-label", e), l.disabled = !!b(V)?.deletingId, p !== (p = B.value.selectedId ?? "") && (l.value = (l.__value = p) ?? "", d(l, p));
			}, [() => c()("uploadedMedia.server")]), h("change", l, (e) => B.controller.select(e.currentTarget.value)), f(r, a);
		};
		u(g, (e) => {
			I.value.isAuthenticated ? B.value.configuring ? e(S, 1) : B.value.configurationError ? e(C, 2) : B.value.destinations.length === 0 ? e(E, 3) : e(ne, -1) : e(x);
		}), e(m), e(l);
		var D = y(l, 2);
		s(D, () => b(Q), (e) => {
			{
				let n = A(() => !!b(U)), r = A(() => c()("uploadedMedia.delete")), i = A(() => c()("uploadedMedia.confirmDescription")), a = A(() => c()("uploadedMedia.delete"));
				be(e, {
					get open() {
						return b(n);
					},
					onOpenChange: (e) => {
						e || Oe();
					},
					get title() {
						return b(r);
					},
					get description() {
						return b(i);
					},
					get confirmLabel() {
						return b(a);
					},
					onConfirm: ke,
					onCancel: Oe,
					preventCloseWhileConfirming: !0,
					showConfirmSpinner: !0,
					closeOnConfirm: !1,
					children: (e, n) => {
						var r = p(), i = w(r), a = (e) => {
							var n = Ye(), r = w(n), i = O(r, !0), a = y(r, 2), o = O(a, !0), s = y(a, 2), l = (e) => {
								var n = Je(), r = O(n, !0);
								_(() => t(r, b(U).deleteId.sha256)), f(e, n);
							};
							u(s, (e) => {
								b(U).deleteId && e(l);
							});
							var d = y(s, 2), p = O(d, !0);
							_((e, n) => {
								t(i, e), t(o, b(W) ?? b(U).serverUrl), t(p, n);
							}, [() => c()(`uploadedMedia.${b(U).kind}`), () => b(U).url ?? c()("uploadedMedia.previewUnavailable")]), f(e, n);
						};
						u(i, (e) => {
							b(U) && e(a);
						}), f(e, r);
					},
					$$slots: { default: !0 }
				});
			}
		});
		var ie = y(D, 2);
		{
			let e = A(() => b(K)[b(q)]?.src ?? ""), t = A(() => b(K)[b(q)]?.alt ?? "");
			_e(ie, {
				get src() {
					return b(e);
				},
				get alt() {
					return b(t);
				},
				onClose: $,
				get mediaList() {
					return b(K);
				},
				get currentIndex() {
					return b(q);
				},
				onNavigate: (e) => {
					T(q, e, !0);
				},
				get openingFocusOrigin() {
					return b(Y);
				},
				get show() {
					return b(J);
				},
				set show(e) {
					T(J, e, !0);
				}
			});
		}
		f(r, a);
	};
	u(et, (e) => {
		b(R) && e(tt);
	}), f(a, $e);
	var nt = r(Qe);
	return m(), nt;
}
o(["change"]);
export { Qe as default };
