import { A as e, E as t, Et as n, G as r, I as i, K as a, Mt as o, N as s, O as c, R as l, T as u, Tt as d, V as f, W as p, Y as m, a as h, ct as g, dt as _, f as v, gt as y, i as ee, it as b, jt as x, lt as S, mt as C, nt as w, o as T, pt as E, r as D, rt as te, s as ne, st as O, t as re, ut as k, vt as A, w as ie, xt as j, y as M, yt as ae, z as N } from "./index-client-XkLzkVYC.js";
import { pt as oe } from "./LoadingPlaceholder-lit91akO.js";
import { s as se } from "./appUtils-BRia-Jm6.js";
import { t as ce } from "./useDialogHistory.svelte-BgJftJRE.js";
import { t as le } from "./DialogWrapper-DOH4rn3S.js";
import { i as ue, n as de, r as fe, t as pe } from "./tabs-trigger-E7T0aLuc.js";
import { _ as me, g as he, h as ge, m as _e, nt as ve } from "./App-D7-eoDXE.js";
var P = .22, F = .33, ye = "input, textarea, select, option, video, audio, [contenteditable]:not([contenteditable='false']), [role='menu'], [role='listbox'], .ehagaki-pswp";
function be(e, t) {
	return !Number.isFinite(e) || !(t > 48) ? !1 : e < 24 || e > t - 24;
}
function I(e) {
	return e instanceof Element && e.closest(ye) !== null;
}
function xe(e) {
	return !!e?.querySelector("[role='menu'], [role='listbox']");
}
function Se(e, t) {
	let n = Math.abs(e), r = Math.abs(t);
	return n < 10 && r < 10 ? "undecided" : n > r && n >= 10 ? "horizontal" : r >= 10 ? "vertical" : "undecided";
}
function Ce(e, t) {
	return t < 0 && e === "posts" ? "media" : t > 0 && e === "media" ? "posts" : null;
}
function L(e) {
	if (e === 0) return 0;
	let t = Math.abs(e) * F;
	return Math.sign(e) * Math.min(t, 72);
}
function R(e, t, n) {
	if (!Ce(e, t)) return L(t);
	let r = Math.max(n, 0);
	return r === 0 ? 0 : Math.max(-r, Math.min(r, t));
}
function we(e) {
	let t = Ce(e.tab, e.dx), n = Math.abs(e.dx), r = Math.max(e.width, 0) * P, i = e.dx !== 0 && Math.sign(e.velocityX) === Math.sign(e.dx), a = t !== null && i && Math.abs(e.velocityX) > .45 && n > 24, o = !e.reducedMotion;
	return t && (n >= r || a) ? {
		type: "commit",
		tab: t,
		animate: o
	} : {
		type: "cancel",
		animate: o
	};
}
function z(e, t, n) {
	let r = +(e === "media");
	return n > 0 ? r + -t / n : r;
}
function B(e, t) {
	let n = e[e.length - 1]?.x;
	return n === void 0 ? Number.isFinite(t) ? t : 0 : !Number.isFinite(t) || t === 0 && n !== 0 ? n : t;
}
function V(e) {
	if (e.length < 2) return 0;
	let t = e[e.length - 1], n = e[0];
	for (let r = e.length - 2; r >= 0 && (n = e[r], !(t.t - e[r].t >= 32)); --r);
	let r = t.t - n.t;
	return r <= 0 ? 0 : (t.x - n.x) / r;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryTabSwipe.svelte.ts
var H = "(hover: none) and (pointer: coarse)", U = "(prefers-reduced-motion: reduce)", W = 400;
function G(e) {
	if (typeof window > "u" || typeof window.matchMedia != "function") return !1;
	try {
		return window.matchMedia(e).matches;
	} catch {
		return !1;
	}
}
function K(e, t) {
	e.push(t);
	let n = t.t;
	for (; e.length > 1 && n - e[0].t > 120;) e.shift();
}
function q(e) {
	let t = (e) => {
		e.preventDefault(), e.stopPropagation();
	};
	e.addEventListener("click", t, !0), window.setTimeout(() => e.removeEventListener("click", t, !0), W);
}
function Te(e) {
	let t = A(0), n = A(!1), r = A(0), i = A(null);
	g(() => {
		let a = w(i), o = e.getOpen();
		if (!a || !o) {
			y(t, 0), y(n, !1);
			return;
		}
		let s = null, c = 0, l = 0, u = () => {
			l += 1, c && cancelAnimationFrame(c), c = 0;
		}, d = (e, n, r, i) => {
			let a = ++l;
			if (!r) {
				y(t, n, !0), a === l && i();
				return;
			}
			let o = performance.now(), s = (r) => {
				if (a !== l) return;
				let u = Math.min(1, (r - o) / 200), d = 1 - (1 - u) ** 3;
				y(t, e + (n - e) * d), u < 1 ? c = requestAnimationFrame(s) : i();
			};
			c = requestAnimationFrame(s);
		}, f = (i, o, c) => {
			let l = s;
			if (!l) return;
			if (l.touchTarget?.removeEventListener("touchmove", g), s = null, y(n, !1), l.axis !== "horizontal") {
				y(t, 0);
				return;
			}
			q(a), y(r, l.width, !0);
			let u = B(l.samples, i), f = u - l.startX;
			K(l.samples, {
				x: u,
				t: o
			});
			let p = R(l.tab, f, l.width);
			if (y(t, p, !0), !c || e.getGestureBlocked()) {
				d(p, 0, !G(U), () => {
					y(t, 0);
				});
				return;
			}
			let m = we({
				tab: l.tab,
				dx: f,
				width: l.width,
				velocityX: V(l.samples),
				reducedMotion: G(U)
			});
			if (m.type === "cancel") {
				d(p, 0, m.animate, () => {
					y(t, 0);
				});
				return;
			}
			let h = Math.sign(f) * l.width;
			d(p, h, m.animate, () => {
				y(t, 0), e.onCommit(m.tab);
			});
		}, p = (e, r, i) => {
			if (!s || s.axis === "vertical") return;
			let a = e - s.startX, o = r - s.startY;
			if (s.axis === "pending") {
				let e = Se(a, o);
				if (e === "undecided" || (s.axis = e, e === "vertical")) return;
			}
			y(n, !0), K(s.samples, {
				x: e,
				t: i
			}), y(t, R(s.tab, a, s.width), !0);
		}, m = (t) => {
			if (s && t.pointerId !== s.pointerId) {
				if (t.pointerType === "touch") {
					let e = s.samples.at(-1)?.x ?? s.startX;
					f(e, t.timeStamp, !1);
				}
				return;
			}
			if (!t.isPrimary || t.button !== 0 || t.pointerType === "mouse" || s || !G(H) || e.getGestureBlocked() || xe(a.ownerDocument) || be(t.clientX, window.innerWidth) || I(t.target)) return;
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
			}, s.touchTarget?.addEventListener("touchmove", g, { passive: !1 }), y(r, n, !0));
		}, h = (e) => {
			s && e.pointerId === s.pointerId && p(e.clientX, e.clientY, e.timeStamp);
		}, g = (e) => {
			s?.axis === "horizontal" && e.touches.length === 1 && e.cancelable && e.preventDefault();
		}, _ = (e) => {
			s && e.pointerId === s.pointerId && f(e.clientX, e.timeStamp, !0);
		}, v = (e) => {
			s && e.pointerId === s.pointerId && f(e.clientX, e.timeStamp, !0);
		};
		return a.addEventListener("pointerdown", m), a.addEventListener("pointermove", h), a.addEventListener("touchmove", g, { passive: !1 }), a.addEventListener("pointerup", _), a.addEventListener("pointercancel", v), () => {
			u(), s?.touchTarget?.removeEventListener("touchmove", g), s = null, a.removeEventListener("pointerdown", m), a.removeEventListener("pointermove", h), a.removeEventListener("touchmove", g), a.removeEventListener("pointerup", _), a.removeEventListener("pointercancel", v);
		};
	});
	let a = j(() => z(e.getTab(), w(t), w(r)));
	return {
		attachment: (e) => (y(i, e, !0), () => {
			w(i) === e && y(i, null);
		}),
		get dragPx() {
			return w(t);
		},
		get dragging() {
			return w(n);
		},
		get indicatorProgress() {
			return w(a);
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryDialog.svelte
var Ee = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"show",
	"onClose",
	"returnFocus",
	"isStaleAssetReloadRequired",
	"onLoadFailure"
]), De = a("<span class=\"xmark-icon svg-icon\" aria-hidden=\"true\"></span>"), Oe = a("<!> <!>", 1), ke = a("<span class=\"history-opening-block history-opening-icon svelte-uxr0i8\"></span>"), Ae = a("<span class=\"history-opening-block history-opening-line short svelte-uxr0i8\"></span>"), je = a("<div class=\"history-opening-post svelte-uxr0i8\"><div class=\"history-opening-post-body svelte-uxr0i8\"><span class=\"history-opening-block history-opening-line svelte-uxr0i8\"></span> <span class=\"history-opening-block history-opening-line medium svelte-uxr0i8\"></span> <!></div> <div class=\"history-opening-post-footer svelte-uxr0i8\"><span class=\"history-opening-block history-opening-date svelte-uxr0i8\"></span> <div class=\"history-opening-post-actions svelte-uxr0i8\"></div> <span class=\"history-opening-block history-opening-menu svelte-uxr0i8\"></span></div></div>"), Me = a("<div class=\"history-opening-post-heading svelte-uxr0i8\"><div class=\"history-opening-heading-main svelte-uxr0i8\"><span class=\"history-opening-block history-opening-month svelte-uxr0i8\"></span> <span class=\"history-opening-block history-opening-icon svelte-uxr0i8\"></span></div> <div class=\"history-opening-heading-actions svelte-uxr0i8\"></div></div> <div class=\"history-opening-post-list\"></div>", 1), Ne = a("<div class=\"history-opening-media-tile svelte-uxr0i8\"><div class=\"history-opening-media-meta svelte-uxr0i8\"><span class=\"history-opening-block history-opening-line short svelte-uxr0i8\"></span> <span class=\"history-opening-block history-opening-line medium svelte-uxr0i8\"></span></div> <span class=\"history-opening-block history-opening-media-action svelte-uxr0i8\"></span></div>"), Pe = a("<div class=\"history-opening-media-toolbar svelte-uxr0i8\"><div class=\"history-opening-media-server svelte-uxr0i8\"><span class=\"history-opening-block history-opening-line medium svelte-uxr0i8\"></span> <span class=\"history-opening-block history-opening-chevron svelte-uxr0i8\"></span></div> <span class=\"history-opening-block history-opening-icon svelte-uxr0i8\"></span></div> <div class=\"history-opening-media-grid svelte-uxr0i8\"></div>", 1), Fe = a("<div class=\"history-opening-placeholder svelte-uxr0i8\" aria-hidden=\"true\"><!></div>"), Ie = a("<div><div class=\"history-tab-switcher svelte-uxr0i8\"><!> <span class=\"history-tab-indicator svelte-uxr0i8\" aria-hidden=\"true\"></span></div> <div class=\"history-tab-viewport svelte-uxr0i8\"><div class=\"history-tab-panels svelte-uxr0i8\"><!> <!></div> <!></div></div>"), Le = {
	hash: "svelte-uxr0i8",
	code: ".post-history-dialog.dialog {top:0;translate:-50% 0;height:100svh;max-height:100svh;--btn-post-preview-action-hover: var(--svg);}.post-history-dialog.dialog[data-state=\"open\"] { animation: svelte-uxr0i8-history-open 250ms ease-out;}.post-history-dialog.dialog.dialog-container-layout {height:100%;max-height:100%;}.post-history-dialog .dialog-content {position:relative;display:flex;flex:1;min-height:0;max-height:none;overflow:hidden;padding:0;}.post-history-dialog .dialog-footer {flex:none;}.history-tabs {display:flex;flex-direction:column;width:100%;min-width:0;min-height:0;flex:1;}.history-tab-list {display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));flex:none;}.history-tab-list button {position:relative;min-height:44px;width:100%;margin:0;border-radius:0;background-color:var(--dialog-bg2);--btn-bg: var(--dialog-bg2);}.history-tab-list button[data-state=\"active\"] {background-color:var(--dialog-bg);--btn-bg: var(--dialog-bg);}.history-tab-gesture.svelte-uxr0i8 {display:flex;flex-direction:column;flex:1;min-width:0;min-height:0;background:var(--dialog-bg);touch-action:pan-y;}.history-tab-gesture.is-swiping.svelte-uxr0i8 {user-select:none;-webkit-user-select:none;}.history-tab-gesture.svelte-uxr0i8 .post-history-container,\n    .history-tab-gesture.svelte-uxr0i8 .uploaded-media-content {touch-action:pan-y;overscroll-behavior:none;}.history-tab-switcher.svelte-uxr0i8 {position:relative;flex:none;}.history-tab-indicator.svelte-uxr0i8 {position:absolute;left:0;bottom:0;width:50%;height:4px;display:flex;justify-content:center;pointer-events:none;transition:transform 200ms cubic-bezier(0.2, 0, 0, 1);}.history-tab-gesture.is-swiping.svelte-uxr0i8 .history-tab-indicator:where(.svelte-uxr0i8),\n    .history-tab-gesture.is-offset.svelte-uxr0i8 .history-tab-indicator:where(.svelte-uxr0i8) {transition:none;}.history-tab-indicator.svelte-uxr0i8::before {content:\"\";width:min(4.5rem, 55%);height:4px;border-radius:999px;background-color:var(--theme);}.history-tab-viewport.svelte-uxr0i8 {position:relative;flex:1;min-width:0;min-height:0;overflow:hidden;background:var(--dialog-bg);}.history-tab-panels.svelte-uxr0i8 {display:flex;flex-direction:column;height:100%;min-width:0;min-height:0;}.history-tab-gesture.is-offset.svelte-uxr0i8 .history-tab-panels:where(.svelte-uxr0i8) {transform:translate3d(var(--history-tab-drag), 0, 0);}.history-tab-viewport[data-opening-pending=\"true\"].svelte-uxr0i8 .history-tab-panels:where(.svelte-uxr0i8) {visibility:hidden;}.history-opening-placeholder.svelte-uxr0i8 {position:absolute;inset:0;overflow:hidden;pointer-events:none;}.history-opening-block.svelte-uxr0i8 {display:block;background:var(--text);opacity:0.07;border-radius:4px;}.history-opening-line.svelte-uxr0i8 {height:12px;}.history-opening-line.short.svelte-uxr0i8 {width:30%;}.history-opening-line.medium.svelte-uxr0i8 {width:70%;}.history-opening-icon.svelte-uxr0i8 {width:20px;height:20px;flex:none;border-radius:6px;}.history-opening-post-heading.svelte-uxr0i8 {display:flex;align-items:center;justify-content:space-between;height:48px;padding-inline:12px 15px;border-bottom:1px solid var(--border-hr);}.history-opening-heading-main.svelte-uxr0i8 {display:flex;align-items:center;gap:20px;min-width:0;}.history-opening-month.svelte-uxr0i8 {width:64px;height:24px;}.history-opening-heading-actions.svelte-uxr0i8 {display:flex;gap:30px;}.history-opening-post.svelte-uxr0i8 {padding:6px;border-bottom:1px solid var(--border-hr-light);}.history-opening-post.svelte-uxr0i8:last-child {border-bottom:none;}.history-opening-post-body.svelte-uxr0i8 {display:grid;gap:12px;padding:6px 16px 6px;}.history-opening-post-footer.svelte-uxr0i8 {display:grid;grid-template-columns:minmax(0, 120px) minmax(0, 1fr) 36px;align-items:center;height:36px;padding-inline-start:16px;}.history-opening-date.svelte-uxr0i8 {width:min(48px, 100%);height:10px;}.history-opening-post-actions.svelte-uxr0i8 {display:flex;justify-content:space-around;min-width:0;}.history-opening-menu.svelte-uxr0i8 {width:4px;height:14px;justify-self:center;}.history-opening-media-toolbar.svelte-uxr0i8 {display:grid;grid-template-columns:minmax(0, 1fr) 44px;gap:4px;padding:8px;align-items:center;}.history-opening-media-server.svelte-uxr0i8 {display:flex;align-items:center;justify-content:space-between;height:44px;padding-inline:10px 14px;border:1px solid var(--border);border-radius:6px;}.history-opening-chevron.svelte-uxr0i8 {width:10px;height:6px;}.history-opening-media-toolbar.svelte-uxr0i8 > .history-opening-icon:where(.svelte-uxr0i8) {justify-self:center;}.history-opening-media-grid.svelte-uxr0i8 {display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));gap:2px;}.history-opening-media-tile.svelte-uxr0i8 {position:relative;min-width:0;aspect-ratio:1;}.history-opening-media-tile.svelte-uxr0i8::before {content:\"\";position:absolute;inset:0;background:var(--text);opacity:0.05;}.history-opening-media-meta.svelte-uxr0i8 {position:absolute;bottom:14px;left:8px;right:52px;display:grid;gap:6px;}.history-opening-media-meta.svelte-uxr0i8 .history-opening-line:where(.svelte-uxr0i8) {height:8px;}.history-opening-media-action.svelte-uxr0i8 {position:absolute;right:14px;bottom:16px;width:20px;height:20px;}\n    @keyframes svelte-uxr0i8-history-open { from { opacity: 0; } to { opacity: 1; } }\n    @media (prefers-reduced-motion: reduce) {.history-tab-indicator.svelte-uxr0i8 {transition:none;}.post-history-dialog.dialog[data-state=\"open\"] { animation: none;}\n    }.history-tab-panel:not([hidden]) {display:flex;flex:1;min-height:0;overflow:hidden;}"
};
function Re(a, P) {
	n(P, !0), e(a, Le);
	let F = () => ne(oe, "$_", ye), [ye, be] = T(), I = D(P, "show", 15, !1), xe = D(P, "returnFocus", 3, null), Se = D(P, "isStaleAssetReloadRequired", 3, () => !1), Ce = ee(P, Ee), L = A(!0), R = A(C(b(() => _e.restore()))), we = ve("icons/close_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"), z = A(null), B = A(null), V = A(null), H = A(null), U = A(!1), W = A(!1), G = A(!1), K = A(0), q = A(!1), Re = !1, J = 0, Y = !1, X = A(!1), ze = A(!1), Be = A(!1), Z = j(() => w(X) || (w(R) === "posts" ? w(ze) : w(Be)));
	function Ve(e, t) {
		return () => {
			Y || !I() || w(q) || t !== w(K) || e !== w(R) || y(e === "posts" ? ze : Be, !0);
		};
	}
	let He = j(() => Ve("posts", w(K))), Ue = j(() => Ve("media", w(K))), We = { isStale: () => Y || Se()() }, Ge = me("post-history-posts", he, We), Ke = me("post-history-media", ge, We), Q = () => w(H)?.isBusy() ?? w(G);
	function qe() {
		y(q, !0), J++, w(V)?.invalidateSession(), w(H)?.invalidateSession(), y(G, !1), y(U, !1), y(W, !1), y(ze, !1), y(Be, !1), y(X, !1), ae(K);
	}
	function Je(e) {
		w(q) || e !== "posts" && e !== "media" || e === w(R) || Q() || (w(R) === "posts" ? w(V)?.suspend() : w(H)?.suspend(), J++, y(R, e, !0), _e.select(e), e === "posts" ? w(V)?.activate() : w(H)?.activate());
	}
	function Ye(e = !0) {
		return !Q() && (I() && y(L, e, !0), Re = !0, w(V)?.prepareClose(), w(V)?.suspend(), w(H)?.suspend(), J++, I(!1), P.onClose(), !0);
	}
	ce(() => I(), () => Ye());
	let Xe = b(() => P.pubkeyHex), Ze = b(() => P.rxNostr);
	S(() => {
		let e = P.pubkeyHex, t = P.rxNostr;
		e === Xe ? t !== Ze && (Ze = t, b(() => {
			w(V)?.suspend();
			let e = w(K), n = w(R);
			te().then(() => {
				Y || !I() || w(q) || e !== w(K) || w(R) !== n || P.rxNostr !== t || n === "posts" && w(V)?.activate();
			});
		})) : (Xe = e, Ze = t, b(() => {
			qe(), y(q, !1);
		}));
	}), S(() => {
		let e = I();
		b(() => {
			e ? Re = !1 : (Re || (w(V)?.prepareClose(), w(V)?.suspend(), w(H)?.suspend()), y(U, !1), y(W, !1), y(ze, !1), y(Be, !1));
		});
	}), g(() => {
		let e = w(R), t = I(), n = w(K);
		if (!t || w(q)) return;
		let r = ++J;
		return y(X, !1), (async () => {
			let t = e === "posts" ? await Ge() : await Ke();
			!Y && I() && w(R) === e && r === J && n === w(K) && (t.status === "failed" ? (y(X, !0), P.onLoadFailure?.(t)) : e === "posts" ? (y(z, t.component, !0), y(U, !0)) : (y(B, t.component, !0), y(W, !0)));
		})(), () => {
			J++;
		};
	}), re(() => {
		Y = !0, J++;
	});
	let $ = Te({
		getOpen: () => I(),
		getTab: () => w(R),
		getGestureBlocked: () => w(q) || Q() || !!w(V)?.isFullscreen() || !!w(H)?.isFullscreen(),
		onCommit: (e) => Je(e)
	});
	function Qe(e) {
		(Q() || w(V)?.isFullscreen() || w(H)?.isFullscreen()) && e.preventDefault();
	}
	function $e(e) {
		(Q() || e.target instanceof Element && e.target.closest(".ehagaki-pswp")) && e.preventDefault();
	}
	var et = { invalidateSession: qe };
	{
		let e = (e) => {
			{
				let t = j(() => F()("global.close"));
				se(e, {
					className: "modal-close",
					shape: "square",
					get ariaLabel() {
						return w(t);
					},
					get disabled() {
						return w(G);
					},
					onClick: () => Ye(),
					children: (e, t) => {
						var n = De();
						let r;
						O(() => r = ie(n, "", r, { "mask-image": `url("${we}")` })), p(e, n);
					},
					$$slots: { default: !0 }
				});
			}
		}, n = j(() => F()("postHistory.title")), d = j(() => F()("postHistory.description"));
		le(a, {
			onOpenChange: (e) => {
				!e && !Ye() && I(!0);
			},
			get title() {
				return w(n);
			},
			get description() {
				return w(d);
			},
			contentClass: "post-history-dialog",
			footerVariant: "close-button",
			initialFocus: "content",
			trapFocus: !1,
			onEscapeKeydown: Qe,
			onInteractOutside: $e,
			get returnFocus() {
				return xe();
			},
			get open() {
				return I();
			},
			set open(e) {
				I(e);
			},
			get restoreFocusOnClose() {
				return w(L);
			},
			set restoreFocusOnClose(e) {
				y(L, e, !0);
			},
			footer: e,
			children: (e, n) => {
				var a = r(), d = _(a);
				s(d, () => ue, (e, n) => {
					n(e, {
						get value() {
							return w(R);
						},
						onValueChange: Je,
						activationMode: "manual",
						class: "history-tabs",
						children: (e, n) => {
							var a = Ie();
							let d;
							var g = k(a), ee = k(g);
							{
								let e = j(() => F()("postHistory.title"));
								s(ee, () => de, (t, n) => {
									n(t, {
										class: "history-tab-list",
										get "aria-label"() {
											return w(e);
										},
										children: (e, t) => {
											var n = Oe(), r = _(n);
											s(r, () => pe, (e, t) => {
												t(e, {
													value: "posts",
													get disabled() {
														return w(G);
													},
													children: (e, t) => {
														x();
														var n = m();
														O((e) => f(n, e), [() => F()("postHistory.postsTab")]), p(e, n);
													},
													$$slots: { default: !0 }
												});
											});
											var i = E(r, 2);
											s(i, () => pe, (e, t) => {
												t(e, {
													value: "media",
													get disabled() {
														return w(G);
													},
													children: (e, t) => {
														x();
														var n = m();
														O((e) => f(n, e), [() => F()("postHistory.mediaTab")]), p(e, n);
													},
													$$slots: { default: !0 }
												});
											}), p(e, n);
										},
										$$slots: { default: !0 }
									});
								});
							}
							var b = E(ee, 2);
							let S;
							o(g);
							var C = E(g, 2), T = k(C), D = k(T);
							l(D, () => w(K), (e) => {
								var t = Oe(), n = _(t);
								s(n, () => fe, (e, t) => {
									t(e, {
										value: "posts",
										class: "history-tab-panel",
										children: (e, t) => {
											var n = r(), i = _(n), a = (e) => {
												var t = r(), n = _(t);
												{
													let e = j(() => I() && !w(q) && w(R) === "posts");
													s(n, () => w(z), (t, n) => {
														v(n(t, h(() => Ce, {
															get show() {
																return w(e);
															},
															get sessionOpen() {
																return I();
															},
															onClose: () => Ye(!1),
															get onInitialReady() {
																return w(He);
															}
														})), (e) => y(V, e, !0), () => w(V));
													});
												}
												p(e, t);
											};
											N(i, (e) => {
												w(z) && w(U) && e(a);
											}), p(e, n);
										},
										$$slots: { default: !0 }
									});
								});
								var i = E(n, 2);
								s(i, () => fe, (e, t) => {
									t(e, {
										value: "media",
										class: "history-tab-panel",
										children: (e, t) => {
											var n = r(), i = _(n), a = (e) => {
												var t = r(), n = _(t);
												{
													let e = j(() => I() && !w(q) && w(R) === "media");
													s(n, () => w(B), (t, n) => {
														v(n(t, {
															get show() {
																return w(e);
															},
															onBusyChange: (e) => y(G, e, !0),
															get onInitialReady() {
																return w(Ue);
															}
														}), (e) => y(H, e, !0), () => w(H));
													});
												}
												p(e, t);
											};
											N(i, (e) => {
												w(B) && w(W) && e(a);
											}), p(e, n);
										},
										$$slots: { default: !0 }
									});
								}), p(e, t);
							});
							var te = E(D, 2), ne = (e) => {
								se(e, {
									onClick: () => {
										qe(), y(q, !1);
									},
									children: (e, t) => {
										x();
										var n = m();
										O((e) => f(n, e), [() => F()("uploadedMedia.refresh")]), p(e, n);
									},
									$$slots: { default: !0 }
								});
							};
							N(te, (e) => {
								w(X) && e(ne);
							}), o(T);
							var re = E(T, 2), A = (e) => {
								var t = Fe(), n = k(t), r = (e) => {
									var t = Me(), n = _(t), r = E(k(n), 2);
									i(r, 20, () => [
										0,
										1,
										2
									], (e) => e, (e, t) => {
										var n = ke();
										p(e, n);
									}), o(r), o(n);
									var a = E(n, 2);
									i(a, 20, () => [
										0,
										1,
										2
									], (e) => e, (e, t) => {
										var n = je(), r = k(n), a = E(k(r), 4), s = (e) => {
											var t = Ae();
											p(e, t);
										};
										N(a, (e) => {
											t === 1 && e(s);
										}), o(r);
										var c = E(r, 2), l = E(k(c), 2);
										i(l, 20, () => [
											0,
											1,
											2
										], (e) => e, (e, t) => {
											var n = ke();
											p(e, n);
										}), o(l), x(2), o(c), o(n), p(e, n);
									}), o(a), p(e, t);
								}, a = (e) => {
									var t = Pe(), n = E(_(t), 2);
									i(n, 20, () => [
										0,
										1,
										2,
										3,
										4,
										5
									], (e) => e, (e, t) => {
										var n = Ne();
										p(e, n);
									}), o(n), p(e, t);
								};
								N(n, (e) => {
									w(R) === "posts" ? e(r) : e(a, -1);
								}), o(t), O(() => M(t, "data-history-tab", w(R))), p(e, t);
							};
							N(re, (e) => {
								w(Z) || e(A);
							}), o(C), o(a), c(a, () => $.attachment), O(() => {
								u(a, 1, t(["history-tab-gesture", {
									"is-swiping": $.dragging,
									"is-offset": $.dragPx !== 0
								}]), "svelte-uxr0i8"), d = ie(a, "", d, { "--history-tab-drag": `${$.dragPx ?? ""}px` }), S = ie(b, "", S, { transform: `translateX(${$.indicatorProgress * 100}%)` }), M(C, "aria-busy", !w(Z)), M(C, "data-opening-pending", !w(Z)), T.inert = !w(Z), M(T, "aria-hidden", w(Z) ? void 0 : "true");
							}), p(e, a);
						},
						$$slots: { default: !0 }
					});
				}), p(e, a);
			},
			$$slots: {
				footer: !0,
				default: !0
			}
		});
	}
	var tt = d(et);
	return be(), tt;
}
export { Re as default };
