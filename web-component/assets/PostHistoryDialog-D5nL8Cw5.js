import { B as e, D as t, Dt as n, E as r, Et as i, G as a, H as o, K as s, L as c, Mt as l, Nt as u, P as d, St as f, T as p, X as m, _t as h, a as g, at as _, b as v, bt as y, ct as b, dt as x, f as ee, ft as S, ht as C, i as te, it as ne, j as re, k as ie, lt as w, mt as T, o as E, q as D, r as O, rt as k, s as ae, t as oe, ut as se, yt as A, z as ce } from "./index-client-DEFG3Gqk.js";
import { Z as le } from "./LoadingPlaceholder-YrD8D_td.js";
import { t as ue } from "./Button-Cqrg0_jX.js";
import { t as de } from "./useDialogHistory.svelte-pVteCIez.js";
import { t as fe } from "./DialogWrapper-DlNV_DwH.js";
import { i as pe, n as me, r as he, t as ge } from "./tabs-trigger-CnepqnT4.js";
import { t as _e } from "./appAssetUrl-B5sJnZLv.js";
import { g as ve, h as ye, m as be, p as xe } from "./App-CW2Ynbk9.js";
var j = .22, M = .33, Se = "input, textarea, select, option, video, audio, [contenteditable]:not([contenteditable='false']), [role='menu'], [role='listbox'], .ehagaki-pswp";
function Ce(e, t) {
	return !Number.isFinite(e) || !(t > 48) ? !1 : e < 24 || e > t - 24;
}
function N(e) {
	if (!(e instanceof Element)) return !1;
	if (e.closest(Se)) return !0;
	let t = e.closest("[data-media-gallery]");
	return t !== null && t.scrollWidth > t.clientWidth + 1;
}
function we(e) {
	return !!e?.querySelector("[role='menu'], [role='listbox']");
}
function Te(e, t) {
	let n = Math.abs(e), r = Math.abs(t);
	return n < 10 && r < 10 ? "undecided" : n > r && n >= 10 ? "horizontal" : r >= 10 ? "vertical" : "undecided";
}
function P(e, t) {
	return t < 0 && e === "posts" ? "media" : t > 0 && e === "media" ? "posts" : null;
}
function Ee(e) {
	if (e === 0) return 0;
	let t = Math.abs(e) * M;
	return Math.sign(e) * Math.min(t, 72);
}
function F(e, t, n) {
	if (!P(e, t)) return Ee(t);
	let r = Math.max(n, 0);
	return r === 0 ? 0 : Math.max(-r, Math.min(r, t));
}
function De(e) {
	let t = P(e.tab, e.dx), n = Math.abs(e.dx), r = Math.max(e.width, 0) * j, i = e.dx !== 0 && Math.sign(e.velocityX) === Math.sign(e.dx), a = t !== null && i && Math.abs(e.velocityX) > .45 && n > 24, o = !e.reducedMotion;
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
function Oe(e, t) {
	let n = e[e.length - 1]?.x;
	return n === void 0 ? Number.isFinite(t) ? t : 0 : !Number.isFinite(t) || t === 0 && n !== 0 ? n : t;
}
function L(e) {
	if (e.length < 2) return 0;
	let t = e[e.length - 1], n = e[0];
	for (let r = e.length - 2; r >= 0 && (n = e[r], !(t.t - e[r].t >= 32)); --r);
	let r = t.t - n.t;
	return r <= 0 ? 0 : (t.x - n.x) / r;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryTabSwipe.svelte.ts
var R = "(hover: none) and (pointer: coarse)", z = "(prefers-reduced-motion: reduce)", B = 400;
function V(e) {
	if (typeof window > "u" || typeof window.matchMedia != "function") return !1;
	try {
		return window.matchMedia(e).matches;
	} catch {
		return !1;
	}
}
function H(e, t) {
	e.push(t);
	let n = t.t;
	for (; e.length > 1 && n - e[0].t > 120;) e.shift();
}
function U(e) {
	let t = (e) => {
		e.preventDefault(), e.stopPropagation();
	};
	e.addEventListener("click", t, !0), window.setTimeout(() => e.removeEventListener("click", t, !0), B);
}
function ke(e) {
	let t = A(0), n = A(!1), r = A(0), i = A(null);
	w(() => {
		let a = k(i), o = e.getOpen();
		if (!a || !o) {
			h(t, 0), h(n, !1);
			return;
		}
		let s = null, c = 0, l = 0, u = () => {
			l += 1, c && cancelAnimationFrame(c), c = 0;
		}, d = (e, n, r, i) => {
			let a = ++l;
			if (!r) {
				h(t, n, !0), a === l && i();
				return;
			}
			let o = performance.now(), s = (r) => {
				if (a !== l) return;
				let u = Math.min(1, (r - o) / 200), d = 1 - (1 - u) ** 3;
				h(t, e + (n - e) * d), u < 1 ? c = requestAnimationFrame(s) : i();
			};
			c = requestAnimationFrame(s);
		}, f = (i, o, c) => {
			let l = s;
			if (!l) return;
			if (l.touchTarget?.removeEventListener("touchmove", _), s = null, h(n, !1), l.axis !== "horizontal") {
				h(t, 0);
				return;
			}
			U(a), h(r, l.width, !0);
			let u = Oe(l.samples, i), f = u - l.startX;
			H(l.samples, {
				x: u,
				t: o
			});
			let p = F(l.tab, f, l.width);
			if (h(t, p, !0), !c || e.getGestureBlocked()) {
				d(p, 0, !V(z), () => {
					h(t, 0);
				});
				return;
			}
			let m = De({
				tab: l.tab,
				dx: f,
				width: l.width,
				velocityX: L(l.samples),
				reducedMotion: V(z)
			});
			if (m.type === "cancel") {
				d(p, 0, m.animate, () => {
					h(t, 0);
				});
				return;
			}
			let g = Math.sign(f) * l.width;
			d(p, g, m.animate, () => {
				h(t, 0), e.onCommit(m.tab);
			});
		}, p = (e, r, i) => {
			if (!s || s.axis === "vertical") return;
			let a = e - s.startX, o = r - s.startY;
			if (s.axis === "pending") {
				let e = Te(a, o);
				if (e === "undecided" || (s.axis = e, e === "vertical")) return;
			}
			h(n, !0), H(s.samples, {
				x: e,
				t: i
			}), h(t, F(s.tab, a, s.width), !0);
		}, m = (t) => {
			if (s && t.pointerId !== s.pointerId) {
				if (t.pointerType === "touch") {
					let e = s.samples.at(-1)?.x ?? s.startX;
					f(e, t.timeStamp, !1);
				}
				return;
			}
			if (!t.isPrimary || t.button !== 0 || t.pointerType === "mouse" || s || !V(R) || e.getGestureBlocked() || we(a.ownerDocument) || Ce(t.clientX, window.innerWidth) || N(t.target)) return;
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
			}, s.touchTarget?.addEventListener("touchmove", _, { passive: !1 }), h(r, n, !0));
		}, g = (e) => {
			s && e.pointerId === s.pointerId && p(e.clientX, e.clientY, e.timeStamp);
		}, _ = (e) => {
			s?.axis === "horizontal" && e.touches.length === 1 && e.cancelable && e.preventDefault();
		}, v = (e) => {
			s && e.pointerId === s.pointerId && f(e.clientX, e.timeStamp, !0);
		}, y = (e) => {
			s && e.pointerId === s.pointerId && f(e.clientX, e.timeStamp, !0);
		};
		return a.addEventListener("pointerdown", m), a.addEventListener("pointermove", g), a.addEventListener("touchmove", _, { passive: !1 }), a.addEventListener("pointerup", v), a.addEventListener("pointercancel", y), () => {
			u(), s?.touchTarget?.removeEventListener("touchmove", _), s = null, a.removeEventListener("pointerdown", m), a.removeEventListener("pointermove", g), a.removeEventListener("touchmove", _), a.removeEventListener("pointerup", v), a.removeEventListener("pointercancel", y);
		};
	});
	let a = f(() => I(e.getTab(), k(t), k(r)));
	return {
		attachment: (e) => (h(i, e, !0), () => {
			k(i) === e && h(i, null);
		}),
		get dragPx() {
			return k(t);
		},
		get dragging() {
			return k(n);
		},
		get indicatorProgress() {
			return k(a);
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryDialog.svelte
var Ae = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"show",
	"onClose",
	"returnFocus",
	"isStaleAssetReloadRequired",
	"onLoadFailure",
	"readOnly"
]), je = D("<span class=\"xmark-icon svg-icon\" aria-hidden=\"true\"></span>"), Me = D("<!> <!>", 1), Ne = D("<span class=\"history-tab-indicator svelte-uxr0i8\" aria-hidden=\"true\"></span>"), Pe = D("<span class=\"history-opening-block history-opening-icon svelte-uxr0i8\"></span>"), Fe = D("<span class=\"history-opening-block history-opening-line short svelte-uxr0i8\"></span>"), Ie = D("<div class=\"history-opening-post svelte-uxr0i8\"><div class=\"history-opening-post-body svelte-uxr0i8\"><span class=\"history-opening-block history-opening-line svelte-uxr0i8\"></span> <span class=\"history-opening-block history-opening-line medium svelte-uxr0i8\"></span> <!></div> <div class=\"history-opening-post-footer svelte-uxr0i8\"><span class=\"history-opening-block history-opening-date svelte-uxr0i8\"></span> <div class=\"history-opening-post-actions svelte-uxr0i8\"></div> <span class=\"history-opening-block history-opening-menu svelte-uxr0i8\"></span></div></div>"), Le = D("<div class=\"history-opening-post-heading svelte-uxr0i8\"><div class=\"history-opening-heading-main svelte-uxr0i8\"><span class=\"history-opening-block history-opening-month svelte-uxr0i8\"></span> <span class=\"history-opening-block history-opening-icon svelte-uxr0i8\"></span></div> <div class=\"history-opening-heading-actions svelte-uxr0i8\"></div></div> <div class=\"history-opening-post-list\"></div>", 1), Re = D("<div class=\"history-opening-media-tile svelte-uxr0i8\"><div class=\"history-opening-media-meta svelte-uxr0i8\"><span class=\"history-opening-block history-opening-line short svelte-uxr0i8\"></span> <span class=\"history-opening-block history-opening-line medium svelte-uxr0i8\"></span></div> <span class=\"history-opening-block history-opening-media-action svelte-uxr0i8\"></span></div>"), ze = D("<div class=\"history-opening-media-toolbar svelte-uxr0i8\"><div class=\"history-opening-media-server svelte-uxr0i8\"><span class=\"history-opening-block history-opening-line medium svelte-uxr0i8\"></span> <span class=\"history-opening-block history-opening-chevron svelte-uxr0i8\"></span></div> <span class=\"history-opening-block history-opening-icon svelte-uxr0i8\"></span></div> <div class=\"history-opening-media-grid svelte-uxr0i8\"></div>", 1), Be = D("<div class=\"history-opening-placeholder svelte-uxr0i8\" aria-hidden=\"true\"><!></div>"), Ve = D("<div><div><!> <!></div> <div class=\"history-tab-viewport svelte-uxr0i8\"><div class=\"history-tab-panels svelte-uxr0i8\"><!> <!></div> <!></div></div>"), He = {
	hash: "svelte-uxr0i8",
	code: ".post-history-dialog.dialog {top:0;translate:-50% 0;height:100svh;max-height:100svh;--btn-post-preview-action-hover: var(--svg);}.post-history-dialog.dialog[data-state=\"open\"] { animation: svelte-uxr0i8-history-open 250ms ease-out;}.post-history-dialog.dialog.dialog-container-layout {height:100%;max-height:100%;}.post-history-dialog .dialog-content {position:relative;display:flex;flex:1;min-height:0;max-height:none;overflow:hidden;padding:0;}.post-history-dialog .dialog-footer {flex:none;}.single-tab.svelte-uxr0i8 .history-tab-list {grid-template-columns:1fr;}.history-tabs {display:flex;flex-direction:column;width:100%;min-width:0;min-height:0;flex:1;}.history-tab-list {display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));flex:none;}.history-tab-list button {position:relative;min-height:44px;width:100%;margin:0;border-radius:0;background-color:var(--dialog-bg2);--btn-bg: var(--dialog-bg2);}.history-tab-list button[data-state=\"active\"] {background-color:var(--dialog-bg);--btn-bg: var(--dialog-bg);}.history-tab-gesture.svelte-uxr0i8 {display:flex;flex-direction:column;flex:1;min-width:0;min-height:0;background:var(--dialog-bg);touch-action:pan-y;}.history-tab-gesture.is-swiping.svelte-uxr0i8 {user-select:none;-webkit-user-select:none;}.history-tab-gesture.svelte-uxr0i8 .post-history-container,\n    .history-tab-gesture.svelte-uxr0i8 .uploaded-media-content {touch-action:pan-y;overscroll-behavior:none;}.history-tab-switcher.svelte-uxr0i8 {position:relative;flex:none;}.history-tab-indicator.svelte-uxr0i8 {position:absolute;left:0;bottom:0;width:50%;height:4px;display:flex;justify-content:center;pointer-events:none;transition:transform 200ms cubic-bezier(0.2, 0, 0, 1);}.history-tab-gesture.is-swiping.svelte-uxr0i8 .history-tab-indicator:where(.svelte-uxr0i8),\n    .history-tab-gesture.is-offset.svelte-uxr0i8 .history-tab-indicator:where(.svelte-uxr0i8) {transition:none;}.history-tab-indicator.svelte-uxr0i8::before {content:\"\";width:min(4.5rem, 55%);height:4px;border-radius:999px;background-color:var(--theme);}.history-tab-viewport.svelte-uxr0i8 {position:relative;flex:1;min-width:0;min-height:0;overflow:hidden;background:var(--dialog-bg);}.history-tab-panels.svelte-uxr0i8 {display:flex;flex-direction:column;height:100%;min-width:0;min-height:0;}.history-tab-gesture.is-offset.svelte-uxr0i8 .history-tab-panels:where(.svelte-uxr0i8) {transform:translate3d(var(--history-tab-drag), 0, 0);}.history-tab-viewport[data-opening-pending=\"true\"].svelte-uxr0i8 .history-tab-panels:where(.svelte-uxr0i8) {visibility:hidden;}.history-opening-placeholder.svelte-uxr0i8 {position:absolute;inset:0;overflow:hidden;pointer-events:none;}.history-opening-block.svelte-uxr0i8 {display:block;background:var(--text);opacity:0.07;border-radius:4px;}.history-opening-line.svelte-uxr0i8 {height:12px;}.history-opening-line.short.svelte-uxr0i8 {width:30%;}.history-opening-line.medium.svelte-uxr0i8 {width:70%;}.history-opening-icon.svelte-uxr0i8 {width:20px;height:20px;flex:none;border-radius:6px;}.history-opening-post-heading.svelte-uxr0i8 {display:flex;align-items:center;justify-content:space-between;height:48px;padding-inline:12px 15px;border-bottom:1px solid var(--border-hr);}.history-opening-heading-main.svelte-uxr0i8 {display:flex;align-items:center;gap:20px;min-width:0;}.history-opening-month.svelte-uxr0i8 {width:64px;height:24px;}.history-opening-heading-actions.svelte-uxr0i8 {display:flex;gap:30px;}.history-opening-post.svelte-uxr0i8 {padding:6px;border-bottom:1px solid var(--border-hr-light);}.history-opening-post.svelte-uxr0i8:last-child {border-bottom:none;}.history-opening-post-body.svelte-uxr0i8 {display:grid;gap:12px;padding:6px 16px 6px;}.history-opening-post-footer.svelte-uxr0i8 {display:grid;grid-template-columns:minmax(0, 120px) minmax(0, 1fr) 36px;align-items:center;height:36px;padding-inline-start:16px;}.history-opening-date.svelte-uxr0i8 {width:min(48px, 100%);height:10px;}.history-opening-post-actions.svelte-uxr0i8 {display:flex;justify-content:space-around;min-width:0;}.history-opening-menu.svelte-uxr0i8 {width:4px;height:14px;justify-self:center;}.history-opening-media-toolbar.svelte-uxr0i8 {display:grid;grid-template-columns:minmax(0, 1fr) 44px;gap:4px;padding:8px;align-items:center;}.history-opening-media-server.svelte-uxr0i8 {display:flex;align-items:center;justify-content:space-between;height:44px;padding-inline:10px 14px;border:1px solid var(--border);border-radius:6px;}.history-opening-chevron.svelte-uxr0i8 {width:10px;height:6px;}.history-opening-media-toolbar.svelte-uxr0i8 > .history-opening-icon:where(.svelte-uxr0i8) {justify-self:center;}.history-opening-media-grid.svelte-uxr0i8 {display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));gap:2px;}.history-opening-media-tile.svelte-uxr0i8 {position:relative;min-width:0;aspect-ratio:1;}.history-opening-media-tile.svelte-uxr0i8::before {content:\"\";position:absolute;inset:0;background:var(--text);opacity:0.05;}.history-opening-media-meta.svelte-uxr0i8 {position:absolute;bottom:14px;left:8px;right:52px;display:grid;gap:6px;}.history-opening-media-meta.svelte-uxr0i8 .history-opening-line:where(.svelte-uxr0i8) {height:8px;}.history-opening-media-action.svelte-uxr0i8 {position:absolute;right:14px;bottom:16px;width:20px;height:20px;}\n    @keyframes svelte-uxr0i8-history-open { from { opacity: 0; } to { opacity: 1; } }\n    @media (prefers-reduced-motion: reduce) {.history-tab-indicator.svelte-uxr0i8 {transition:none;}.post-history-dialog.dialog[data-state=\"open\"] { animation: none;}\n    }.history-tab-panel:not([hidden]) {display:flex;flex:1;min-height:0;overflow:hidden;}"
};
function W(D, j) {
	n(j, !0), re(D, He);
	let M = () => ae(le, "$_", Se), [Se, Ce] = E(), N = O(j, "show", 15, !1), we = O(j, "returnFocus", 3, null), Te = O(j, "isStaleAssetReloadRequired", 3, () => !1), P = O(j, "readOnly", 3, !1), Ee = te(j, Ae), F = A(!0), De = A(C(_(() => xe.restore()))), I = f(() => P() ? "posts" : k(De)), Oe = _e("icons/close_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"), L = A(null), R = A(null), z = A(null), B = A(null), V = A(!1), H = A(!1), U = A(!1), W = A(0), G = A(!1), Ue = !1, K = 0, q = !1, J = A(!1), Y = A(!1), We = A(!1), X = f(() => k(J) || (k(I) === "posts" ? k(Y) : k(We)));
	function Ge(e, t) {
		return () => {
			q || !N() || k(G) || t !== k(W) || e !== k(I) || h(e === "posts" ? Y : We, !0);
		};
	}
	let Ke = f(() => Ge("posts", k(W))), qe = f(() => Ge("media", k(W))), Je = { isStale: () => q || Te()() }, Ye = ve("post-history-posts", ye, Je), Xe = ve("post-history-media", be, Je), Z = () => k(B)?.isBusy() ?? k(U);
	function Ze() {
		h(G, !0), K++, k(z)?.invalidateSession(), k(B)?.invalidateSession(), h(U, !1), h(V, !1), h(H, !1), h(Y, !1), h(We, !1), h(J, !1), y(W);
	}
	function Qe(e) {
		P() || k(G) || e !== "posts" && e !== "media" || e === k(I) || Z() || (k(I) === "posts" ? k(z)?.suspend() : k(B)?.suspend(), K++, h(De, e, !0), xe.select(e), e === "posts" ? k(z)?.activate() : k(B)?.activate());
	}
	function Q(e = !0) {
		return !Z() && (N() && h(F, e, !0), Ue = !0, k(z)?.prepareClose(), k(z)?.suspend(), k(B)?.suspend(), K++, N(!1), j.onClose(), !0);
	}
	de(() => N(), () => Q());
	let $e = _(() => j.pubkeyHex), et = _(() => j.rxNostr);
	se(() => {
		let e = j.pubkeyHex, t = j.rxNostr;
		e === $e ? t !== et && (et = t, _(() => {
			k(z)?.suspend();
			let e = k(W), n = k(I);
			ne().then(() => {
				q || !N() || k(G) || e !== k(W) || k(I) !== n || j.rxNostr !== t || n === "posts" && k(z)?.activate();
			});
		})) : ($e = e, et = t, _(() => {
			Ze(), h(G, !1);
		}));
	}), se(() => {
		let e = N();
		_(() => {
			e ? Ue = !1 : (Ue || (k(z)?.prepareClose(), k(z)?.suspend(), k(B)?.suspend()), h(V, !1), h(H, !1), h(Y, !1), h(We, !1));
		});
	}), w(() => {
		let e = k(I), t = N(), n = k(W);
		if (!t || k(G)) return;
		let r = ++K;
		return h(J, !1), (async () => {
			let t = e === "posts" ? await Ye() : await Xe();
			!q && N() && k(I) === e && r === K && n === k(W) && (t.status === "failed" ? (h(J, !0), j.onLoadFailure?.(t)) : e === "posts" ? (h(L, t.component, !0), h(V, !0)) : (h(R, t.component, !0), h(H, !0)));
		})(), () => {
			K++;
		};
	}), oe(() => {
		q = !0, K++;
	});
	let $ = ke({
		getOpen: () => N(),
		getTab: () => k(I),
		getGestureBlocked: () => P() || k(G) || Z() || !!k(z)?.isFullscreen() || !!k(B)?.isFullscreen(),
		onCommit: (e) => Qe(e)
	});
	function tt(e) {
		(Z() || k(z)?.isFullscreen() || k(B)?.isFullscreen()) && e.preventDefault();
	}
	function nt(e) {
		(Z() || e.target instanceof Element && e.target.closest(".ehagaki-pswp")) && e.preventDefault();
	}
	var rt = { invalidateSession: Ze };
	{
		let n = (e) => {
			{
				let t = f(() => M()("global.close"));
				ue(e, {
					className: "modal-close",
					shape: "square",
					get ariaLabel() {
						return k(t);
					},
					get disabled() {
						return k(U);
					},
					onClick: () => Q(),
					children: (e, t) => {
						var n = je();
						let r;
						b(() => r = p(n, "", r, { "mask-image": `url("${Oe}")` })), a(e, n);
					},
					$$slots: { default: !0 }
				});
			}
		}, i = f(() => M()("postHistory.title")), _ = f(() => M()("postHistory.description"));
		fe(D, {
			onOpenChange: (e) => {
				!e && !Q() && N(!0);
			},
			get title() {
				return k(i);
			},
			get description() {
				return k(_);
			},
			contentClass: "post-history-dialog",
			footerVariant: "close-button",
			initialFocus: "content",
			trapFocus: !1,
			onEscapeKeydown: tt,
			onInteractOutside: nt,
			get returnFocus() {
				return we();
			},
			get open() {
				return N();
			},
			set open(e) {
				N(e);
			},
			get restoreFocusOnClose() {
				return k(F);
			},
			set restoreFocusOnClose(e) {
				h(F, e, !0);
			},
			footer: n,
			children: (n, i) => {
				var _ = s(), y = S(_);
				d(y, () => pe, (n, i) => {
					i(n, {
						get value() {
							return k(I);
						},
						onValueChange: Qe,
						activationMode: "manual",
						class: "history-tabs",
						children: (n, i) => {
							var _ = Ve();
							let y;
							var C = x(_), te = x(C);
							{
								let t = f(() => M()("postHistory.title"));
								d(te, () => me, (n, r) => {
									r(n, {
										class: "history-tab-list",
										get "aria-label"() {
											return k(t);
										},
										children: (t, n) => {
											var r = Me(), i = S(r);
											d(i, () => ge, (e, t) => {
												t(e, {
													value: "posts",
													get disabled() {
														return k(U);
													},
													children: (e, t) => {
														l();
														var n = m();
														b((e) => o(n, e), [() => M()("postHistory.postsTab")]), a(e, n);
													},
													$$slots: { default: !0 }
												});
											});
											var c = T(i, 2), u = (e) => {
												var t = s(), n = S(t);
												d(n, () => ge, (e, t) => {
													t(e, {
														value: "media",
														get disabled() {
															return k(U);
														},
														children: (e, t) => {
															l();
															var n = m();
															b((e) => o(n, e), [() => M()("postHistory.mediaTab")]), a(e, n);
														},
														$$slots: { default: !0 }
													});
												}), a(e, t);
											};
											e(c, (e) => {
												P() || e(u);
											}), a(t, r);
										},
										$$slots: { default: !0 }
									});
								});
							}
							var ne = T(te, 2), re = (e) => {
								var t = Ne();
								let n;
								b(() => n = p(t, "", n, { transform: `translateX(${$.indicatorProgress * 100}%)` })), a(e, t);
							};
							e(ne, (e) => {
								P() || e(re);
							}), u(C);
							var w = T(C, 2), E = x(w), D = x(E);
							ce(D, () => k(W), (t) => {
								var n = Me(), r = S(n);
								d(r, () => he, (t, n) => {
									n(t, {
										value: "posts",
										class: "history-tab-panel",
										children: (t, n) => {
											var r = s(), i = S(r), o = (e) => {
												var t = s(), n = S(t);
												{
													let e = f(() => N() && !k(G) && k(I) === "posts");
													d(n, () => k(L), (t, n) => {
														ee(n(t, g(() => Ee, {
															get readOnly() {
																return P();
															},
															get show() {
																return k(e);
															},
															get sessionOpen() {
																return N();
															},
															onClose: () => Q(!1),
															get onInitialReady() {
																return k(Ke);
															}
														})), (e) => h(z, e, !0), () => k(z));
													});
												}
												a(e, t);
											};
											e(i, (e) => {
												k(L) && k(V) && e(o);
											}), a(t, r);
										},
										$$slots: { default: !0 }
									});
								});
								var i = T(r, 2), o = (t) => {
									var n = s(), r = S(n);
									d(r, () => he, (t, n) => {
										n(t, {
											value: "media",
											class: "history-tab-panel",
											children: (t, n) => {
												var r = s(), i = S(r), o = (e) => {
													var t = s(), n = S(t);
													{
														let e = f(() => N() && !k(G) && k(I) === "media");
														d(n, () => k(R), (t, n) => {
															ee(n(t, {
																get show() {
																	return k(e);
																},
																onBusyChange: (e) => h(U, e, !0),
																get onInitialReady() {
																	return k(qe);
																}
															}), (e) => h(B, e, !0), () => k(B));
														});
													}
													a(e, t);
												};
												e(i, (e) => {
													k(R) && k(H) && e(o);
												}), a(t, r);
											},
											$$slots: { default: !0 }
										});
									}), a(t, n);
								};
								e(i, (e) => {
									P() || e(o);
								}), a(t, n);
							});
							var O = T(D, 2), ae = (e) => {
								ue(e, {
									onClick: () => {
										Ze(), h(G, !1);
									},
									children: (e, t) => {
										l();
										var n = m();
										b((e) => o(n, e), [() => M()("uploadedMedia.refresh")]), a(e, n);
									},
									$$slots: { default: !0 }
								});
							};
							e(O, (e) => {
								k(J) && e(ae);
							}), u(E);
							var oe = T(E, 2), se = (t) => {
								var n = Be(), r = x(n), i = (t) => {
									var n = Le(), r = S(n), i = T(x(r), 2);
									c(i, 20, () => [
										0,
										1,
										2
									], (e) => e, (e, t) => {
										var n = Pe();
										a(e, n);
									}), u(i), u(r);
									var o = T(r, 2);
									c(o, 20, () => [
										0,
										1,
										2
									], (e) => e, (t, n) => {
										var r = Ie(), i = x(r), o = T(x(i), 4), s = (e) => {
											var t = Fe();
											a(e, t);
										};
										e(o, (e) => {
											n === 1 && e(s);
										}), u(i);
										var d = T(i, 2), f = T(x(d), 2);
										c(f, 20, () => [
											0,
											1,
											2
										], (e) => e, (e, t) => {
											var n = Pe();
											a(e, n);
										}), u(f), l(2), u(d), u(r), a(t, r);
									}), u(o), a(t, n);
								}, o = (e) => {
									var t = ze(), n = T(S(t), 2);
									c(n, 20, () => [
										0,
										1,
										2,
										3,
										4,
										5
									], (e) => e, (e, t) => {
										var n = Re();
										a(e, n);
									}), u(n), a(e, t);
								};
								e(r, (e) => {
									k(I) === "posts" ? e(i) : e(o, -1);
								}), u(n), b(() => v(n, "data-history-tab", k(I))), a(t, n);
							};
							e(oe, (e) => {
								k(X) || e(se);
							}), u(w), u(_), ie(_, () => $.attachment), b(() => {
								r(_, 1, t(["history-tab-gesture", {
									"is-swiping": $.dragging,
									"is-offset": $.dragPx !== 0
								}]), "svelte-uxr0i8"), y = p(_, "", y, { "--history-tab-drag": `${$.dragPx ?? ""}px` }), r(C, 1, t(["history-tab-switcher", { "single-tab": P() }]), "svelte-uxr0i8"), v(w, "aria-busy", !k(X)), v(w, "data-opening-pending", !k(X)), E.inert = !k(X), v(E, "aria-hidden", k(X) ? void 0 : "true");
							}), a(n, _);
						},
						$$slots: { default: !0 }
					});
				}), a(n, _);
			},
			$$slots: {
				footer: !0,
				default: !0
			}
		});
	}
	var it = i(rt);
	return Ce(), it;
}
export { W as default };
