import { At as e, B as t, C as n, Ct as r, D as i, F as a, G as o, L as s, M as c, R as l, T as u, U as d, W as f, _t as p, a as m, at as h, ct as g, dt as _, et as v, f as y, ft as b, gt as x, i as ee, k as te, kt as S, lt as C, mt as w, nt as T, o as E, ot as D, q as ne, r as O, s as re, st as ie, t as ae, tt as oe, v as k, w as se, wt as ce, yt as A } from "./index-client-Bdka-Daw.js";
import { pt as le } from "./LoadingPlaceholder-j1_vRYno.js";
import { c as ue } from "./appUtils-Bsk0mFqn.js";
import { t as de } from "./useDialogHistory.svelte-C49eZejL.js";
import { t as fe } from "./DialogWrapper-C4-jPsAO.js";
import { i as pe, n as me, r as he, t as ge } from "./tabs-trigger-CTsCGK_5.js";
import { _ as _e, b as ve, it as ye, v as be, y as xe } from "./App-BVcniO1E.js";
var j = .22, M = .33, Se = "input, textarea, select, option, video, audio, [contenteditable]:not([contenteditable='false']), [role='menu'], [role='listbox'], .ehagaki-pswp";
function Ce(e, t) {
	return !Number.isFinite(e) || !(t > 48) ? !1 : e < 24 || e > t - 24;
}
function N(e) {
	return e instanceof Element && e.closest(Se) !== null;
}
function we(e) {
	return !!e?.querySelector("[role='menu'], [role='listbox']");
}
function Te(e, t) {
	let n = Math.abs(e), r = Math.abs(t);
	return n < 10 && r < 10 ? "undecided" : n > r && n >= 10 ? "horizontal" : r >= 10 ? "vertical" : "undecided";
}
function Ee(e, t) {
	return t < 0 && e === "posts" ? "media" : t > 0 && e === "media" ? "posts" : null;
}
function P(e) {
	if (e === 0) return 0;
	let t = Math.abs(e) * M;
	return Math.sign(e) * Math.min(t, 72);
}
function De(e, t, n) {
	if (!Ee(e, t)) return P(t);
	let r = Math.max(n, 0);
	return r === 0 ? 0 : Math.max(-r, Math.min(r, t));
}
function F(e) {
	let t = Ee(e.tab, e.dx), n = Math.abs(e.dx), r = Math.max(e.width, 0) * j, i = e.dx !== 0 && Math.sign(e.velocityX) === Math.sign(e.dx), a = t !== null && i && Math.abs(e.velocityX) > .45 && n > 24, o = !e.reducedMotion;
	return t && (n >= r || a) ? {
		type: "commit",
		tab: t,
		animate: o
	} : {
		type: "cancel",
		animate: o
	};
}
function I(e, t, n) {
	let r = +(e === "media");
	return n > 0 ? r + -t / n : r;
}
function L(e, t) {
	let n = e[e.length - 1]?.x;
	return n === void 0 ? Number.isFinite(t) ? t : 0 : !Number.isFinite(t) || t === 0 && n !== 0 ? n : t;
}
function R(e) {
	if (e.length < 2) return 0;
	let t = e[e.length - 1], n = e[0];
	for (let r = e.length - 2; r >= 0 && (n = e[r], !(t.t - e[r].t >= 32)); --r);
	let r = t.t - n.t;
	return r <= 0 ? 0 : (t.x - n.x) / r;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryTabSwipe.svelte.ts
var z = "(hover: none) and (pointer: coarse)", B = "(prefers-reduced-motion: reduce)", V = 400;
function H(e) {
	if (typeof window > "u" || typeof window.matchMedia != "function") return !1;
	try {
		return window.matchMedia(e).matches;
	} catch {
		return !1;
	}
}
function U(e, t) {
	e.push(t);
	let n = t.t;
	for (; e.length > 1 && n - e[0].t > 120;) e.shift();
}
function W(e) {
	let t = (e) => {
		e.preventDefault(), e.stopPropagation();
	};
	e.addEventListener("click", t, !0), window.setTimeout(() => e.removeEventListener("click", t, !0), V);
}
function Oe(e) {
	let t = x(0), n = x(!1), r = x(0), i = x(null);
	D(() => {
		let a = v(i), o = e.getOpen();
		if (!a || !o) {
			w(t, 0), w(n, !1);
			return;
		}
		let s = null, c = 0, l = 0, u = () => {
			l += 1, c && cancelAnimationFrame(c), c = 0;
		}, d = (e, n, r, i) => {
			let a = ++l;
			if (!r) {
				w(t, n, !0), a === l && i();
				return;
			}
			let o = performance.now(), s = (r) => {
				if (a !== l) return;
				let u = Math.min(1, (r - o) / 200), d = 1 - (1 - u) ** 3;
				w(t, e + (n - e) * d), u < 1 ? c = requestAnimationFrame(s) : i();
			};
			c = requestAnimationFrame(s);
		}, f = (i, o, c) => {
			let l = s;
			if (!l) return;
			if (l.touchTarget?.removeEventListener("touchmove", g), s = null, w(n, !1), l.axis !== "horizontal") {
				w(t, 0);
				return;
			}
			W(a), w(r, l.width, !0);
			let u = L(l.samples, i), f = u - l.startX;
			U(l.samples, {
				x: u,
				t: o
			});
			let p = De(l.tab, f, l.width);
			if (w(t, p, !0), !c || e.getGestureBlocked()) {
				d(p, 0, !H(B), () => {
					w(t, 0);
				});
				return;
			}
			let m = F({
				tab: l.tab,
				dx: f,
				width: l.width,
				velocityX: R(l.samples),
				reducedMotion: H(B)
			});
			if (m.type === "cancel") {
				d(p, 0, m.animate, () => {
					w(t, 0);
				});
				return;
			}
			let h = Math.sign(f) * l.width;
			d(p, h, m.animate, () => {
				w(t, 0), e.onCommit(m.tab);
			});
		}, p = (e, r, i) => {
			if (!s || s.axis === "vertical") return;
			let a = e - s.startX, o = r - s.startY;
			if (s.axis === "pending") {
				let e = Te(a, o);
				if (e === "undecided" || (s.axis = e, e === "vertical")) return;
			}
			w(n, !0), U(s.samples, {
				x: e,
				t: i
			}), w(t, De(s.tab, a, s.width), !0);
		}, m = (t) => {
			if (s && t.pointerId !== s.pointerId) {
				if (t.pointerType === "touch") {
					let e = s.samples.at(-1)?.x ?? s.startX;
					f(e, t.timeStamp, !1);
				}
				return;
			}
			if (!t.isPrimary || t.button !== 0 || t.pointerType === "mouse" || s || !H(z) || e.getGestureBlocked() || we(a.ownerDocument) || Ce(t.clientX, window.innerWidth) || N(t.target)) return;
			let n = a.clientWidth;
			n > 0 && (s = {
				touchTarget: t.target,
				pointerId: t.pointerId,
				startX: t.clientX,
				startY: t.clientY,
				tab: e.getTab(),
				axis: "pending",
				samples: [{
					x: t.clientX,
					t: t.timeStamp
				}],
				width: n
			}, s.touchTarget?.addEventListener("touchmove", g, { passive: !1 }), w(r, n, !0));
		}, h = (e) => {
			s && e.pointerId === s.pointerId && p(e.clientX, e.clientY, e.timeStamp);
		}, g = (e) => {
			s?.axis === "horizontal" && e.touches.length === 1 && e.cancelable && e.preventDefault();
		}, _ = (e) => {
			s && e.pointerId === s.pointerId && f(e.clientX, e.timeStamp, !0);
		}, y = (e) => {
			s && e.pointerId === s.pointerId && f(e.clientX, e.timeStamp, !0);
		};
		return a.addEventListener("pointerdown", m), a.addEventListener("pointermove", h), a.addEventListener("touchmove", g, { passive: !1 }), a.addEventListener("pointerup", _), a.addEventListener("pointercancel", y), () => {
			u(), s?.touchTarget?.removeEventListener("touchmove", g), s = null, a.removeEventListener("pointerdown", m), a.removeEventListener("pointermove", h), a.removeEventListener("touchmove", g), a.removeEventListener("pointerup", _), a.removeEventListener("pointercancel", y);
		};
	});
	let a = A(() => I(e.getTab(), v(t), v(r)));
	return {
		attachment: (e) => (w(i, e, !0), () => {
			v(i) === e && w(i, null);
		}),
		get dragPx() {
			return v(t);
		},
		get dragging() {
			return v(n);
		},
		get indicatorProgress() {
			return v(a);
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryDialog.svelte
var ke = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"show",
	"onClose",
	"returnFocus",
	"isStaleAssetReloadRequired",
	"onLoadFailure"
]), Ae = o("<span class=\"xmark-icon svg-icon\" aria-hidden=\"true\"></span>"), je = o("<!> <!>", 1), Me = o("<span class=\"history-opening-block history-opening-icon svelte-uxr0i8\"></span>"), Ne = o("<span class=\"history-opening-block history-opening-line short svelte-uxr0i8\"></span>"), Pe = o("<div class=\"history-opening-post svelte-uxr0i8\"><div class=\"history-opening-post-body svelte-uxr0i8\"><span class=\"history-opening-block history-opening-line svelte-uxr0i8\"></span> <span class=\"history-opening-block history-opening-line medium svelte-uxr0i8\"></span> <!></div> <div class=\"history-opening-post-footer svelte-uxr0i8\"><span class=\"history-opening-block history-opening-date svelte-uxr0i8\"></span> <div class=\"history-opening-post-actions svelte-uxr0i8\"></div> <span class=\"history-opening-block history-opening-menu svelte-uxr0i8\"></span></div></div>"), Fe = o("<div class=\"history-opening-post-heading svelte-uxr0i8\"><div class=\"history-opening-heading-main svelte-uxr0i8\"><span class=\"history-opening-block history-opening-month svelte-uxr0i8\"></span> <span class=\"history-opening-block history-opening-icon svelte-uxr0i8\"></span></div> <div class=\"history-opening-heading-actions svelte-uxr0i8\"></div></div> <div class=\"history-opening-post-list\"></div>", 1), Ie = o("<div class=\"history-opening-media-tile svelte-uxr0i8\"><div class=\"history-opening-media-meta svelte-uxr0i8\"><span class=\"history-opening-block history-opening-line short svelte-uxr0i8\"></span> <span class=\"history-opening-block history-opening-line medium svelte-uxr0i8\"></span></div> <span class=\"history-opening-block history-opening-media-action svelte-uxr0i8\"></span></div>"), Le = o("<div class=\"history-opening-media-toolbar svelte-uxr0i8\"><div class=\"history-opening-media-server svelte-uxr0i8\"><span class=\"history-opening-block history-opening-line medium svelte-uxr0i8\"></span> <span class=\"history-opening-block history-opening-chevron svelte-uxr0i8\"></span></div> <span class=\"history-opening-block history-opening-icon svelte-uxr0i8\"></span></div> <div class=\"history-opening-media-grid svelte-uxr0i8\"></div>", 1), Re = o("<div class=\"history-opening-placeholder svelte-uxr0i8\" aria-hidden=\"true\"><!></div>"), ze = o("<div><div class=\"history-tab-switcher svelte-uxr0i8\"><!> <span class=\"history-tab-indicator svelte-uxr0i8\" aria-hidden=\"true\"></span></div> <div class=\"history-tab-viewport svelte-uxr0i8\"><div class=\"history-tab-panels svelte-uxr0i8\"><!> <!></div> <!></div></div>"), Be = {
	hash: "svelte-uxr0i8",
	code: ".post-history-dialog.dialog {top:0;translate:-50% 0;height:100svh;max-height:100svh;--btn-post-preview-action-hover: var(--svg);}.post-history-dialog.dialog[data-state=\"open\"] { animation: svelte-uxr0i8-history-open 250ms ease-out;}.post-history-dialog.dialog.dialog-container-layout {height:100%;max-height:100%;}.post-history-dialog .dialog-content {position:relative;display:flex;flex:1;min-height:0;max-height:none;overflow:hidden;padding:0;}.post-history-dialog .dialog-footer {flex:none;}.history-tabs {display:flex;flex-direction:column;width:100%;min-width:0;min-height:0;flex:1;}.history-tab-list {display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));flex:none;}.history-tab-list button {position:relative;min-height:44px;width:100%;margin:0;border-radius:0;background-color:var(--dialog-bg2);--btn-bg: var(--dialog-bg2);}.history-tab-list button[data-state=\"active\"] {background-color:var(--dialog-bg);--btn-bg: var(--dialog-bg);}.history-tab-gesture.svelte-uxr0i8 {display:flex;flex-direction:column;flex:1;min-width:0;min-height:0;background:var(--dialog-bg);touch-action:pan-y;}.history-tab-gesture.is-swiping.svelte-uxr0i8 {user-select:none;-webkit-user-select:none;}.history-tab-gesture.svelte-uxr0i8 .post-history-container,\n    .history-tab-gesture.svelte-uxr0i8 .uploaded-media-content {touch-action:pan-y;overscroll-behavior:none;}.history-tab-switcher.svelte-uxr0i8 {position:relative;flex:none;}.history-tab-indicator.svelte-uxr0i8 {position:absolute;left:0;bottom:0;width:50%;height:4px;display:flex;justify-content:center;pointer-events:none;transition:transform 200ms cubic-bezier(0.2, 0, 0, 1);}.history-tab-gesture.is-swiping.svelte-uxr0i8 .history-tab-indicator:where(.svelte-uxr0i8),\n    .history-tab-gesture.is-offset.svelte-uxr0i8 .history-tab-indicator:where(.svelte-uxr0i8) {transition:none;}.history-tab-indicator.svelte-uxr0i8::before {content:\"\";width:min(4.5rem, 55%);height:4px;border-radius:999px;background-color:var(--theme);}.history-tab-viewport.svelte-uxr0i8 {position:relative;flex:1;min-width:0;min-height:0;overflow:hidden;background:var(--dialog-bg);}.history-tab-panels.svelte-uxr0i8 {display:flex;flex-direction:column;height:100%;min-width:0;min-height:0;}.history-tab-gesture.is-offset.svelte-uxr0i8 .history-tab-panels:where(.svelte-uxr0i8) {transform:translate3d(var(--history-tab-drag), 0, 0);}.history-tab-viewport[data-opening-pending=\"true\"].svelte-uxr0i8 .history-tab-panels:where(.svelte-uxr0i8) {visibility:hidden;}.history-opening-placeholder.svelte-uxr0i8 {position:absolute;inset:0;overflow:hidden;pointer-events:none;}.history-opening-block.svelte-uxr0i8 {display:block;background:var(--text);opacity:0.07;border-radius:4px;}.history-opening-line.svelte-uxr0i8 {height:12px;}.history-opening-line.short.svelte-uxr0i8 {width:30%;}.history-opening-line.medium.svelte-uxr0i8 {width:70%;}.history-opening-icon.svelte-uxr0i8 {width:20px;height:20px;flex:none;border-radius:6px;}.history-opening-post-heading.svelte-uxr0i8 {display:flex;align-items:center;justify-content:space-between;height:48px;padding-inline:12px 15px;border-bottom:1px solid var(--border-hr);}.history-opening-heading-main.svelte-uxr0i8 {display:flex;align-items:center;gap:20px;min-width:0;}.history-opening-month.svelte-uxr0i8 {width:64px;height:24px;}.history-opening-heading-actions.svelte-uxr0i8 {display:flex;gap:30px;}.history-opening-post.svelte-uxr0i8 {padding:6px;border-bottom:1px solid var(--border-hr-light);}.history-opening-post.svelte-uxr0i8:last-child {border-bottom:none;}.history-opening-post-body.svelte-uxr0i8 {display:grid;gap:12px;padding:6px 16px 6px;}.history-opening-post-footer.svelte-uxr0i8 {display:grid;grid-template-columns:minmax(0, 120px) minmax(0, 1fr) 36px;align-items:center;height:36px;padding-inline-start:16px;}.history-opening-date.svelte-uxr0i8 {width:min(48px, 100%);height:10px;}.history-opening-post-actions.svelte-uxr0i8 {display:flex;justify-content:space-around;min-width:0;}.history-opening-menu.svelte-uxr0i8 {width:4px;height:14px;justify-self:center;}.history-opening-media-toolbar.svelte-uxr0i8 {display:grid;grid-template-columns:minmax(0, 1fr) 44px;gap:4px;padding:8px;align-items:center;}.history-opening-media-server.svelte-uxr0i8 {display:flex;align-items:center;justify-content:space-between;height:44px;padding-inline:10px 14px;border:1px solid var(--border);border-radius:6px;}.history-opening-chevron.svelte-uxr0i8 {width:10px;height:6px;}.history-opening-media-toolbar.svelte-uxr0i8 > .history-opening-icon:where(.svelte-uxr0i8) {justify-self:center;}.history-opening-media-grid.svelte-uxr0i8 {display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));gap:2px;}.history-opening-media-tile.svelte-uxr0i8 {position:relative;min-width:0;aspect-ratio:1;}.history-opening-media-tile.svelte-uxr0i8::before {content:\"\";position:absolute;inset:0;background:var(--text);opacity:0.05;}.history-opening-media-meta.svelte-uxr0i8 {position:absolute;bottom:14px;left:8px;right:52px;display:grid;gap:6px;}.history-opening-media-meta.svelte-uxr0i8 .history-opening-line:where(.svelte-uxr0i8) {height:8px;}.history-opening-media-action.svelte-uxr0i8 {position:absolute;right:14px;bottom:16px;width:20px;height:20px;}\n    @keyframes svelte-uxr0i8-history-open { from { opacity: 0; } to { opacity: 1; } }\n    @media (prefers-reduced-motion: reduce) {.history-tab-indicator.svelte-uxr0i8 {transition:none;}.post-history-dialog.dialog[data-state=\"open\"] { animation: none;}\n    }.history-tab-panel:not([hidden]) {display:flex;flex:1;min-height:0;overflow:hidden;}"
};
function G(o, j) {
	ce(j, !0), te(o, Be);
	let M = () => re(le, "$_", Se), [Se, Ce] = E(), N = O(j, "show", 15, !1), we = O(j, "returnFocus", 3, null), Te = O(j, "isStaleAssetReloadRequired", 3, () => !1), Ee = ee(j, ke), P = x(b(T(() => _e.restore()))), De = ye("icons/close_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"), F = x(null), I = x(null), L = x(null), R = x(null), z = x(!1), B = x(!1), V = x(!1), H = x(0), U = x(!1), W = !1, G = 0, K = !1, q = x(!1), J = x(!1), Y = x(!1), X = A(() => v(q) || (v(P) === "posts" ? v(J) : v(Y)));
	function Ve(e, t) {
		return () => {
			K || !N() || v(U) || t !== v(H) || e !== v(P) || w(e === "posts" ? J : Y, !0);
		};
	}
	let He = A(() => Ve("posts", v(H))), Ue = A(() => Ve("media", v(H))), We = { isStale: () => K || Te()() }, Ge = ve("post-history-posts", xe, We), Ke = ve("post-history-media", be, We), Z = () => v(R)?.isBusy() ?? v(V);
	function qe() {
		w(U, !0), G++, v(L)?.invalidateSession(), v(R)?.invalidateSession(), w(V, !1), w(z, !1), w(B, !1), w(J, !1), w(Y, !1), w(q, !1), p(H);
	}
	function Je(e) {
		v(U) || e !== "posts" && e !== "media" || e === v(P) || Z() || (v(P) === "posts" ? v(L)?.suspend() : v(R)?.suspend(), G++, w(P, e, !0), _e.select(e), e === "posts" ? v(L)?.activate() : v(R)?.activate());
	}
	function Q(e = !0) {
		if (Z()) return !1;
		W = !0, v(L)?.prepareClose(), v(L)?.suspend(), v(R)?.suspend(), G++, N(!1), j.onClose();
		let t = we();
		return oe().then(() => e && t?.isConnected && t.focus({ preventScroll: !0 })), !0;
	}
	de(() => N(), () => Q());
	let Ye = T(() => j.pubkeyHex), Xe = T(() => j.rxNostr);
	ie(() => {
		let e = j.pubkeyHex, t = j.rxNostr;
		e === Ye ? t !== Xe && (Xe = t, T(() => {
			v(L)?.suspend();
			let e = v(H), n = v(P);
			oe().then(() => {
				K || !N() || v(U) || e !== v(H) || v(P) !== n || j.rxNostr !== t || n === "posts" && v(L)?.activate();
			});
		})) : (Ye = e, Xe = t, T(() => {
			qe(), w(U, !1);
		}));
	}), ie(() => {
		let e = N();
		T(() => {
			e ? W = !1 : (W || (v(L)?.prepareClose(), v(L)?.suspend(), v(R)?.suspend()), w(z, !1), w(B, !1), w(J, !1), w(Y, !1));
		});
	}), D(() => {
		let e = v(P), t = N(), n = v(H);
		if (!t || v(U)) return;
		let r = ++G;
		return w(q, !1), (async () => {
			let t = e === "posts" ? await Ge() : await Ke();
			!K && N() && v(P) === e && r === G && n === v(H) && (t.status === "failed" ? (w(q, !0), j.onLoadFailure?.(t)) : e === "posts" ? (w(F, t.component, !0), w(z, !0)) : (w(I, t.component, !0), w(B, !0)));
		})(), () => {
			G++;
		};
	}), ae(() => {
		K = !0, G++;
	});
	let $ = Oe({
		getOpen: () => N(),
		getTab: () => v(P),
		getGestureBlocked: () => v(U) || Z() || !!v(L)?.isFullscreen() || !!v(R)?.isFullscreen(),
		onCommit: (e) => Je(e)
	});
	function Ze(e) {
		(Z() || v(L)?.isFullscreen() || v(R)?.isFullscreen()) && e.preventDefault();
	}
	function Qe(e) {
		(Z() || e.target instanceof Element && e.target.closest(".ehagaki-pswp")) && e.preventDefault();
	}
	var $e = { invalidateSession: qe };
	{
		let r = (e) => {
			{
				let t = A(() => M()("global.close"));
				ue(e, {
					className: "modal-close",
					shape: "square",
					get ariaLabel() {
						return v(t);
					},
					get disabled() {
						return v(V);
					},
					onClick: () => Q(),
					children: (e, t) => {
						var r = Ae();
						let i;
						h(() => i = n(r, "", i, { "mask-image": `url("${De}")` })), d(e, r);
					},
					$$slots: { default: !0 }
				});
			}
		}, p = A(() => M()("postHistory.title")), b = A(() => M()("postHistory.description"));
		fe(o, {
			onOpenChange: (e) => {
				!e && !Q() && N(!0);
			},
			get title() {
				return v(p);
			},
			get description() {
				return v(b);
			},
			contentClass: "post-history-dialog",
			footerVariant: "close-button",
			initialFocus: "content",
			trapFocus: !1,
			onEscapeKeydown: Ze,
			onInteractOutside: Qe,
			get open() {
				return N();
			},
			set open(e) {
				N(e);
			},
			footer: r,
			children: (r, o) => {
				var p = f(), b = C(p);
				c(b, () => pe, (r, o) => {
					o(r, {
						get value() {
							return v(P);
						},
						onValueChange: Je,
						activationMode: "manual",
						class: "history-tabs",
						children: (r, o) => {
							var p = ze();
							let b;
							var x = g(p), ee = g(x);
							{
								let e = A(() => M()("postHistory.title"));
								c(ee, () => me, (n, r) => {
									r(n, {
										class: "history-tab-list",
										get "aria-label"() {
											return v(e);
										},
										children: (e, n) => {
											var r = je(), i = C(r);
											c(i, () => ge, (e, n) => {
												n(e, {
													value: "posts",
													get disabled() {
														return v(V);
													},
													children: (e, n) => {
														S();
														var r = ne();
														h((e) => t(r, e), [() => M()("postHistory.postsTab")]), d(e, r);
													},
													$$slots: { default: !0 }
												});
											});
											var a = _(i, 2);
											c(a, () => ge, (e, n) => {
												n(e, {
													value: "media",
													get disabled() {
														return v(V);
													},
													children: (e, n) => {
														S();
														var r = ne();
														h((e) => t(r, e), [() => M()("postHistory.mediaTab")]), d(e, r);
													},
													$$slots: { default: !0 }
												});
											}), d(e, r);
										},
										$$slots: { default: !0 }
									});
								});
							}
							var te = _(ee, 2);
							let T;
							e(x);
							var E = _(x, 2), D = g(E), O = g(D);
							s(O, () => v(H), (e) => {
								var t = je(), n = C(t);
								c(n, () => he, (e, t) => {
									t(e, {
										value: "posts",
										class: "history-tab-panel",
										children: (e, t) => {
											var n = f(), r = C(n), i = (e) => {
												var t = f(), n = C(t);
												{
													let e = A(() => N() && !v(U) && v(P) === "posts");
													c(n, () => v(F), (t, n) => {
														y(n(t, m(() => Ee, {
															get show() {
																return v(e);
															},
															get sessionOpen() {
																return N();
															},
															onClose: () => Q(!1),
															get onInitialReady() {
																return v(He);
															}
														})), (e) => w(L, e, !0), () => v(L));
													});
												}
												d(e, t);
											};
											l(r, (e) => {
												v(F) && v(z) && e(i);
											}), d(e, n);
										},
										$$slots: { default: !0 }
									});
								});
								var r = _(n, 2);
								c(r, () => he, (e, t) => {
									t(e, {
										value: "media",
										class: "history-tab-panel",
										children: (e, t) => {
											var n = f(), r = C(n), i = (e) => {
												var t = f(), n = C(t);
												{
													let e = A(() => N() && !v(U) && v(P) === "media");
													c(n, () => v(I), (t, n) => {
														y(n(t, {
															get show() {
																return v(e);
															},
															onBusyChange: (e) => w(V, e, !0),
															get onInitialReady() {
																return v(Ue);
															}
														}), (e) => w(R, e, !0), () => v(R));
													});
												}
												d(e, t);
											};
											l(r, (e) => {
												v(I) && v(B) && e(i);
											}), d(e, n);
										},
										$$slots: { default: !0 }
									});
								}), d(e, t);
							});
							var re = _(O, 2), ie = (e) => {
								ue(e, {
									onClick: () => {
										qe(), w(U, !1);
									},
									children: (e, n) => {
										S();
										var r = ne();
										h((e) => t(r, e), [() => M()("uploadedMedia.refresh")]), d(e, r);
									},
									$$slots: { default: !0 }
								});
							};
							l(re, (e) => {
								v(q) && e(ie);
							}), e(D);
							var ae = _(D, 2), oe = (t) => {
								var n = Re(), r = g(n), i = (t) => {
									var n = Fe(), r = C(n), i = _(g(r), 2);
									a(i, 20, () => [
										0,
										1,
										2
									], (e) => e, (e, t) => {
										var n = Me();
										d(e, n);
									}), e(i), e(r);
									var o = _(r, 2);
									a(o, 20, () => [
										0,
										1,
										2
									], (e) => e, (t, n) => {
										var r = Pe(), i = g(r), o = _(g(i), 4), s = (e) => {
											var t = Ne();
											d(e, t);
										};
										l(o, (e) => {
											n === 1 && e(s);
										}), e(i);
										var c = _(i, 2), u = _(g(c), 2);
										a(u, 20, () => [
											0,
											1,
											2
										], (e) => e, (e, t) => {
											var n = Me();
											d(e, n);
										}), e(u), S(2), e(c), e(r), d(t, r);
									}), e(o), d(t, n);
								}, o = (t) => {
									var n = Le(), r = _(C(n), 2);
									a(r, 20, () => [
										0,
										1,
										2,
										3,
										4,
										5
									], (e) => e, (e, t) => {
										var n = Ie();
										d(e, n);
									}), e(r), d(t, n);
								};
								l(r, (e) => {
									v(P) === "posts" ? e(i) : e(o, -1);
								}), e(n), h(() => k(n, "data-history-tab", v(P))), d(t, n);
							};
							l(ae, (e) => {
								v(X) || e(oe);
							}), e(E), e(p), i(p, () => $.attachment), h(() => {
								se(p, 1, u(["history-tab-gesture", {
									"is-swiping": $.dragging,
									"is-offset": $.dragPx !== 0
								}]), "svelte-uxr0i8"), b = n(p, "", b, { "--history-tab-drag": `${$.dragPx ?? ""}px` }), T = n(te, "", T, { transform: `translateX(${$.indicatorProgress * 100}%)` }), k(E, "aria-busy", !v(X)), k(E, "data-opening-pending", !v(X)), D.inert = !v(X), k(D, "aria-hidden", v(X) ? void 0 : "true");
							}), d(r, p);
						},
						$$slots: { default: !0 }
					});
				}), d(r, p);
			},
			$$slots: {
				footer: !0,
				default: !0
			}
		});
	}
	var et = r($e);
	return Ce(), et;
}
export { G as default };
