import { At as e, B as t, C as n, D as r, F as i, G as a, J as o, L as s, M as c, R as l, T as u, Tt as d, U as f, W as p, _t as m, a as h, bt as g, ct as _, f as v, ft as y, ht as b, i as x, jt as S, k as ee, lt as C, nt as te, o as ne, ot as w, pt as T, r as E, rt as D, s as re, st as ie, t as ae, tt as O, ut as k, v as A, vt as oe, w as se, wt as ce } from "./index-client-57Odq85c.js";
import { pt as le } from "./LoadingPlaceholder-DK5Hrsgb.js";
import { c as ue } from "./appUtils-CwuZyofa.js";
import { t as de } from "./useDialogHistory.svelte-BddVYV4P.js";
import { t as fe } from "./DialogWrapper-CvCDxqOJ.js";
import { i as pe, n as me, r as he, t as ge } from "./tabs-trigger-DvPMFgBr.js";
import { at as _e, b as ve, v as ye, x as be, y as xe } from "./App-BWEIk7fu.js";
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
	let t = m(0), n = m(!1), r = m(0), i = m(null);
	ie(() => {
		let a = O(i), o = e.getOpen();
		if (!a || !o) {
			b(t, 0), b(n, !1);
			return;
		}
		let s = null, c = 0, l = 0, u = () => {
			l += 1, c && cancelAnimationFrame(c), c = 0;
		}, d = (e, n, r, i) => {
			let a = ++l;
			if (!r) {
				b(t, n, !0), a === l && i();
				return;
			}
			let o = performance.now(), s = (r) => {
				if (a !== l) return;
				let u = Math.min(1, (r - o) / 200), d = 1 - (1 - u) ** 3;
				b(t, e + (n - e) * d), u < 1 ? c = requestAnimationFrame(s) : i();
			};
			c = requestAnimationFrame(s);
		}, f = (i, o, c) => {
			let l = s;
			if (!l) return;
			if (l.touchTarget?.removeEventListener("touchmove", g), s = null, b(n, !1), l.axis !== "horizontal") {
				b(t, 0);
				return;
			}
			W(a), b(r, l.width, !0);
			let u = L(l.samples, i), f = u - l.startX;
			U(l.samples, {
				x: u,
				t: o
			});
			let p = De(l.tab, f, l.width);
			if (b(t, p, !0), !c || e.getGestureBlocked()) {
				d(p, 0, !H(B), () => {
					b(t, 0);
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
					b(t, 0);
				});
				return;
			}
			let h = Math.sign(f) * l.width;
			d(p, h, m.animate, () => {
				b(t, 0), e.onCommit(m.tab);
			});
		}, p = (e, r, i) => {
			if (!s || s.axis === "vertical") return;
			let a = e - s.startX, o = r - s.startY;
			if (s.axis === "pending") {
				let e = Te(a, o);
				if (e === "undecided" || (s.axis = e, e === "vertical")) return;
			}
			b(n, !0), U(s.samples, {
				x: e,
				t: i
			}), b(t, De(s.tab, a, s.width), !0);
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
			}, s.touchTarget?.addEventListener("touchmove", g, { passive: !1 }), b(r, n, !0));
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
	let a = g(() => I(e.getTab(), O(t), O(r)));
	return {
		attachment: (e) => (b(i, e, !0), () => {
			O(i) === e && b(i, null);
		}),
		get dragPx() {
			return O(t);
		},
		get dragging() {
			return O(n);
		},
		get indicatorProgress() {
			return O(a);
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
]), Ae = a("<span class=\"xmark-icon svg-icon\" aria-hidden=\"true\"></span>"), je = a("<!> <!>", 1), Me = a("<span class=\"history-opening-block history-opening-icon svelte-uxr0i8\"></span>"), Ne = a("<span class=\"history-opening-block history-opening-line short svelte-uxr0i8\"></span>"), Pe = a("<div class=\"history-opening-post svelte-uxr0i8\"><div class=\"history-opening-post-body svelte-uxr0i8\"><span class=\"history-opening-block history-opening-line svelte-uxr0i8\"></span> <span class=\"history-opening-block history-opening-line medium svelte-uxr0i8\"></span> <!></div> <div class=\"history-opening-post-footer svelte-uxr0i8\"><span class=\"history-opening-block history-opening-date svelte-uxr0i8\"></span> <div class=\"history-opening-post-actions svelte-uxr0i8\"></div> <span class=\"history-opening-block history-opening-menu svelte-uxr0i8\"></span></div></div>"), Fe = a("<div class=\"history-opening-post-heading svelte-uxr0i8\"><div class=\"history-opening-heading-main svelte-uxr0i8\"><span class=\"history-opening-block history-opening-month svelte-uxr0i8\"></span> <span class=\"history-opening-block history-opening-icon svelte-uxr0i8\"></span></div> <div class=\"history-opening-heading-actions svelte-uxr0i8\"></div></div> <div class=\"history-opening-post-list\"></div>", 1), Ie = a("<div class=\"history-opening-media-tile svelte-uxr0i8\"><div class=\"history-opening-media-meta svelte-uxr0i8\"><span class=\"history-opening-block history-opening-line short svelte-uxr0i8\"></span> <span class=\"history-opening-block history-opening-line medium svelte-uxr0i8\"></span></div> <span class=\"history-opening-block history-opening-media-action svelte-uxr0i8\"></span></div>"), Le = a("<div class=\"history-opening-media-toolbar svelte-uxr0i8\"><div class=\"history-opening-media-server svelte-uxr0i8\"><span class=\"history-opening-block history-opening-line medium svelte-uxr0i8\"></span> <span class=\"history-opening-block history-opening-chevron svelte-uxr0i8\"></span></div> <span class=\"history-opening-block history-opening-icon svelte-uxr0i8\"></span></div> <div class=\"history-opening-media-grid svelte-uxr0i8\"></div>", 1), Re = a("<div class=\"history-opening-placeholder svelte-uxr0i8\" aria-hidden=\"true\"><!></div>"), ze = a("<div><div class=\"history-tab-switcher svelte-uxr0i8\"><!> <span class=\"history-tab-indicator svelte-uxr0i8\" aria-hidden=\"true\"></span></div> <div class=\"history-tab-viewport svelte-uxr0i8\"><div class=\"history-tab-panels svelte-uxr0i8\"><!> <!></div> <!></div></div>"), Be = {
	hash: "svelte-uxr0i8",
	code: ".post-history-dialog.dialog {top:0;translate:-50% 0;height:100svh;max-height:100svh;--btn-post-preview-action-hover: var(--svg);}.post-history-dialog.dialog[data-state=\"open\"] { animation: svelte-uxr0i8-history-open 250ms ease-out;}.post-history-dialog.dialog.dialog-container-layout {height:100%;max-height:100%;}.post-history-dialog .dialog-content {position:relative;display:flex;flex:1;min-height:0;max-height:none;overflow:hidden;padding:0;}.post-history-dialog .dialog-footer {flex:none;}.history-tabs {display:flex;flex-direction:column;width:100%;min-width:0;min-height:0;flex:1;}.history-tab-list {display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));flex:none;}.history-tab-list button {position:relative;min-height:44px;width:100%;margin:0;border-radius:0;background-color:var(--dialog-bg2);--btn-bg: var(--dialog-bg2);}.history-tab-list button[data-state=\"active\"] {background-color:var(--dialog-bg);--btn-bg: var(--dialog-bg);}.history-tab-gesture.svelte-uxr0i8 {display:flex;flex-direction:column;flex:1;min-width:0;min-height:0;background:var(--dialog-bg);touch-action:pan-y;}.history-tab-gesture.is-swiping.svelte-uxr0i8 {user-select:none;-webkit-user-select:none;}.history-tab-gesture.svelte-uxr0i8 .post-history-container,\n    .history-tab-gesture.svelte-uxr0i8 .uploaded-media-content {touch-action:pan-y;overscroll-behavior:none;}.history-tab-switcher.svelte-uxr0i8 {position:relative;flex:none;}.history-tab-indicator.svelte-uxr0i8 {position:absolute;left:0;bottom:0;width:50%;height:4px;display:flex;justify-content:center;pointer-events:none;transition:transform 200ms cubic-bezier(0.2, 0, 0, 1);}.history-tab-gesture.is-swiping.svelte-uxr0i8 .history-tab-indicator:where(.svelte-uxr0i8),\n    .history-tab-gesture.is-offset.svelte-uxr0i8 .history-tab-indicator:where(.svelte-uxr0i8) {transition:none;}.history-tab-indicator.svelte-uxr0i8::before {content:\"\";width:min(4.5rem, 55%);height:4px;border-radius:999px;background-color:var(--theme);}.history-tab-viewport.svelte-uxr0i8 {position:relative;flex:1;min-width:0;min-height:0;overflow:hidden;background:var(--dialog-bg);}.history-tab-panels.svelte-uxr0i8 {display:flex;flex-direction:column;height:100%;min-width:0;min-height:0;}.history-tab-gesture.is-offset.svelte-uxr0i8 .history-tab-panels:where(.svelte-uxr0i8) {transform:translate3d(var(--history-tab-drag), 0, 0);}.history-tab-viewport[data-opening-pending=\"true\"].svelte-uxr0i8 .history-tab-panels:where(.svelte-uxr0i8) {visibility:hidden;}.history-opening-placeholder.svelte-uxr0i8 {position:absolute;inset:0;overflow:hidden;pointer-events:none;}.history-opening-block.svelte-uxr0i8 {display:block;background:var(--text);opacity:0.07;border-radius:4px;}.history-opening-line.svelte-uxr0i8 {height:12px;}.history-opening-line.short.svelte-uxr0i8 {width:30%;}.history-opening-line.medium.svelte-uxr0i8 {width:70%;}.history-opening-icon.svelte-uxr0i8 {width:20px;height:20px;flex:none;border-radius:6px;}.history-opening-post-heading.svelte-uxr0i8 {display:flex;align-items:center;justify-content:space-between;height:48px;padding-inline:12px 15px;border-bottom:1px solid var(--border-hr);}.history-opening-heading-main.svelte-uxr0i8 {display:flex;align-items:center;gap:20px;min-width:0;}.history-opening-month.svelte-uxr0i8 {width:64px;height:24px;}.history-opening-heading-actions.svelte-uxr0i8 {display:flex;gap:30px;}.history-opening-post.svelte-uxr0i8 {padding:6px;border-bottom:1px solid var(--border-hr-light);}.history-opening-post.svelte-uxr0i8:last-child {border-bottom:none;}.history-opening-post-body.svelte-uxr0i8 {display:grid;gap:12px;padding:6px 16px 6px;}.history-opening-post-footer.svelte-uxr0i8 {display:grid;grid-template-columns:minmax(0, 120px) minmax(0, 1fr) 36px;align-items:center;height:36px;padding-inline-start:16px;}.history-opening-date.svelte-uxr0i8 {width:min(48px, 100%);height:10px;}.history-opening-post-actions.svelte-uxr0i8 {display:flex;justify-content:space-around;min-width:0;}.history-opening-menu.svelte-uxr0i8 {width:4px;height:14px;justify-self:center;}.history-opening-media-toolbar.svelte-uxr0i8 {display:grid;grid-template-columns:minmax(0, 1fr) 44px;gap:4px;padding:8px;align-items:center;}.history-opening-media-server.svelte-uxr0i8 {display:flex;align-items:center;justify-content:space-between;height:44px;padding-inline:10px 14px;border:1px solid var(--border);border-radius:6px;}.history-opening-chevron.svelte-uxr0i8 {width:10px;height:6px;}.history-opening-media-toolbar.svelte-uxr0i8 > .history-opening-icon:where(.svelte-uxr0i8) {justify-self:center;}.history-opening-media-grid.svelte-uxr0i8 {display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));gap:2px;}.history-opening-media-tile.svelte-uxr0i8 {position:relative;min-width:0;aspect-ratio:1;}.history-opening-media-tile.svelte-uxr0i8::before {content:\"\";position:absolute;inset:0;background:var(--text);opacity:0.05;}.history-opening-media-meta.svelte-uxr0i8 {position:absolute;bottom:14px;left:8px;right:52px;display:grid;gap:6px;}.history-opening-media-meta.svelte-uxr0i8 .history-opening-line:where(.svelte-uxr0i8) {height:8px;}.history-opening-media-action.svelte-uxr0i8 {position:absolute;right:14px;bottom:16px;width:20px;height:20px;}\n    @keyframes svelte-uxr0i8-history-open { from { opacity: 0; } to { opacity: 1; } }\n    @media (prefers-reduced-motion: reduce) {.history-tab-indicator.svelte-uxr0i8 {transition:none;}.post-history-dialog.dialog[data-state=\"open\"] { animation: none;}\n    }.history-tab-panel:not([hidden]) {display:flex;flex:1;min-height:0;overflow:hidden;}"
};
function G(a, j) {
	d(j, !0), ee(a, Be);
	let M = () => re(le, "$_", Se), [Se, Ce] = ne(), N = E(j, "show", 15, !1), we = E(j, "returnFocus", 3, null), Te = E(j, "isStaleAssetReloadRequired", 3, () => !1), Ee = x(j, ke), P = m(T(D(() => ye.restore()))), De = _e("icons/close_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"), F = m(null), I = m(null), L = m(null), R = m(null), z = m(!1), B = m(!1), V = m(!1), H = m(0), U = m(!1), W = !1, G = 0, K = !1, q = m(!1), J = m(!1), Y = m(!1), X = g(() => O(q) || (O(P) === "posts" ? O(J) : O(Y)));
	function Ve(e, t) {
		return () => {
			K || !N() || O(U) || t !== O(H) || e !== O(P) || b(e === "posts" ? J : Y, !0);
		};
	}
	let He = g(() => Ve("posts", O(H))), Ue = g(() => Ve("media", O(H))), We = { isStale: () => K || Te()() }, Ge = be("post-history-posts", ve, We), Ke = be("post-history-media", xe, We), Z = () => O(R)?.isBusy() ?? O(V);
	function qe() {
		b(U, !0), G++, O(L)?.invalidateSession(), O(R)?.invalidateSession(), b(V, !1), b(z, !1), b(B, !1), b(J, !1), b(Y, !1), b(q, !1), oe(H);
	}
	function Je(e) {
		O(U) || e !== "posts" && e !== "media" || e === O(P) || Z() || (O(P) === "posts" ? O(L)?.suspend() : O(R)?.suspend(), G++, b(P, e, !0), ye.select(e), e === "posts" ? O(L)?.activate() : O(R)?.activate());
	}
	function Q(e = !0) {
		if (Z()) return !1;
		W = !0, O(L)?.prepareClose(), O(L)?.suspend(), O(R)?.suspend(), G++, N(!1), j.onClose();
		let t = we();
		return te().then(() => e && t?.isConnected && t.focus({ preventScroll: !0 })), !0;
	}
	de(() => N(), () => Q());
	let Ye = D(() => j.pubkeyHex), Xe = D(() => j.rxNostr);
	_(() => {
		let e = j.pubkeyHex, t = j.rxNostr;
		e === Ye ? t !== Xe && (Xe = t, D(() => {
			O(L)?.suspend();
			let e = O(H), n = O(P);
			te().then(() => {
				K || !N() || O(U) || e !== O(H) || O(P) !== n || j.rxNostr !== t || n === "posts" && O(L)?.activate();
			});
		})) : (Ye = e, Xe = t, D(() => {
			qe(), b(U, !1);
		}));
	}), _(() => {
		let e = N();
		D(() => {
			e ? W = !1 : (W || (O(L)?.prepareClose(), O(L)?.suspend(), O(R)?.suspend()), b(z, !1), b(B, !1), b(J, !1), b(Y, !1));
		});
	}), ie(() => {
		let e = O(P), t = N(), n = O(H);
		if (!t || O(U)) return;
		let r = ++G;
		return b(q, !1), (async () => {
			let t = e === "posts" ? await Ge() : await Ke();
			!K && N() && O(P) === e && r === G && n === O(H) && (t.status === "failed" ? (b(q, !0), j.onLoadFailure?.(t)) : e === "posts" ? (b(F, t.component, !0), b(z, !0)) : (b(I, t.component, !0), b(B, !0)));
		})(), () => {
			G++;
		};
	}), ae(() => {
		K = !0, G++;
	});
	let $ = Oe({
		getOpen: () => N(),
		getTab: () => O(P),
		getGestureBlocked: () => O(U) || Z() || !!O(L)?.isFullscreen() || !!O(R)?.isFullscreen(),
		onCommit: (e) => Je(e)
	});
	function Ze(e) {
		(Z() || O(L)?.isFullscreen() || O(R)?.isFullscreen()) && e.preventDefault();
	}
	function Qe(e) {
		(Z() || e.target instanceof Element && e.target.closest(".ehagaki-pswp")) && e.preventDefault();
	}
	var $e = { invalidateSession: qe };
	{
		let d = (e) => {
			{
				let t = g(() => M()("global.close"));
				ue(e, {
					className: "modal-close",
					shape: "square",
					get ariaLabel() {
						return O(t);
					},
					get disabled() {
						return O(V);
					},
					onClick: () => Q(),
					children: (e, t) => {
						var r = Ae();
						let i;
						w(() => i = n(r, "", i, { "mask-image": `url("${De}")` })), f(e, r);
					},
					$$slots: { default: !0 }
				});
			}
		}, m = g(() => M()("postHistory.title")), _ = g(() => M()("postHistory.description"));
		fe(a, {
			onOpenChange: (e) => {
				!e && !Q() && N(!0);
			},
			get title() {
				return O(m);
			},
			get description() {
				return O(_);
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
			footer: d,
			children: (a, d) => {
				var m = p(), _ = k(m);
				c(_, () => pe, (a, d) => {
					d(a, {
						get value() {
							return O(P);
						},
						onValueChange: Je,
						activationMode: "manual",
						class: "history-tabs",
						children: (a, d) => {
							var m = ze();
							let _;
							var x = C(m), ee = C(x);
							{
								let n = g(() => M()("postHistory.title"));
								c(ee, () => me, (r, i) => {
									i(r, {
										class: "history-tab-list",
										get "aria-label"() {
											return O(n);
										},
										children: (n, r) => {
											var i = je(), a = k(i);
											c(a, () => ge, (n, r) => {
												r(n, {
													value: "posts",
													get disabled() {
														return O(V);
													},
													children: (n, r) => {
														e();
														var i = o();
														w((e) => t(i, e), [() => M()("postHistory.postsTab")]), f(n, i);
													},
													$$slots: { default: !0 }
												});
											});
											var s = y(a, 2);
											c(s, () => ge, (n, r) => {
												r(n, {
													value: "media",
													get disabled() {
														return O(V);
													},
													children: (n, r) => {
														e();
														var i = o();
														w((e) => t(i, e), [() => M()("postHistory.mediaTab")]), f(n, i);
													},
													$$slots: { default: !0 }
												});
											}), f(n, i);
										},
										$$slots: { default: !0 }
									});
								});
							}
							var te = y(ee, 2);
							let ne;
							S(x);
							var T = y(x, 2), E = C(T), D = C(E);
							s(D, () => O(H), (e) => {
								var t = je(), n = k(t);
								c(n, () => he, (e, t) => {
									t(e, {
										value: "posts",
										class: "history-tab-panel",
										children: (e, t) => {
											var n = p(), r = k(n), i = (e) => {
												var t = p(), n = k(t);
												{
													let e = g(() => N() && !O(U) && O(P) === "posts");
													c(n, () => O(F), (t, n) => {
														v(n(t, h(() => Ee, {
															get show() {
																return O(e);
															},
															get sessionOpen() {
																return N();
															},
															onClose: () => Q(!1),
															get onInitialReady() {
																return O(He);
															}
														})), (e) => b(L, e, !0), () => O(L));
													});
												}
												f(e, t);
											};
											l(r, (e) => {
												O(F) && O(z) && e(i);
											}), f(e, n);
										},
										$$slots: { default: !0 }
									});
								});
								var r = y(n, 2);
								c(r, () => he, (e, t) => {
									t(e, {
										value: "media",
										class: "history-tab-panel",
										children: (e, t) => {
											var n = p(), r = k(n), i = (e) => {
												var t = p(), n = k(t);
												{
													let e = g(() => N() && !O(U) && O(P) === "media");
													c(n, () => O(I), (t, n) => {
														v(n(t, {
															get show() {
																return O(e);
															},
															onBusyChange: (e) => b(V, e, !0),
															get onInitialReady() {
																return O(Ue);
															}
														}), (e) => b(R, e, !0), () => O(R));
													});
												}
												f(e, t);
											};
											l(r, (e) => {
												O(I) && O(B) && e(i);
											}), f(e, n);
										},
										$$slots: { default: !0 }
									});
								}), f(e, t);
							});
							var re = y(D, 2), ie = (n) => {
								ue(n, {
									onClick: () => {
										qe(), b(U, !1);
									},
									children: (n, r) => {
										e();
										var i = o();
										w((e) => t(i, e), [() => M()("uploadedMedia.refresh")]), f(n, i);
									},
									$$slots: { default: !0 }
								});
							};
							l(re, (e) => {
								O(q) && e(ie);
							}), S(E);
							var ae = y(E, 2), oe = (t) => {
								var n = Re(), r = C(n), a = (t) => {
									var n = Fe(), r = k(n), a = y(C(r), 2);
									i(a, 20, () => [
										0,
										1,
										2
									], (e) => e, (e, t) => {
										var n = Me();
										f(e, n);
									}), S(a), S(r);
									var o = y(r, 2);
									i(o, 20, () => [
										0,
										1,
										2
									], (e) => e, (t, n) => {
										var r = Pe(), a = C(r), o = y(C(a), 4), s = (e) => {
											var t = Ne();
											f(e, t);
										};
										l(o, (e) => {
											n === 1 && e(s);
										}), S(a);
										var c = y(a, 2), u = y(C(c), 2);
										i(u, 20, () => [
											0,
											1,
											2
										], (e) => e, (e, t) => {
											var n = Me();
											f(e, n);
										}), S(u), e(2), S(c), S(r), f(t, r);
									}), S(o), f(t, n);
								}, o = (e) => {
									var t = Le(), n = y(k(t), 2);
									i(n, 20, () => [
										0,
										1,
										2,
										3,
										4,
										5
									], (e) => e, (e, t) => {
										var n = Ie();
										f(e, n);
									}), S(n), f(e, t);
								};
								l(r, (e) => {
									O(P) === "posts" ? e(a) : e(o, -1);
								}), S(n), w(() => A(n, "data-history-tab", O(P))), f(t, n);
							};
							l(ae, (e) => {
								O(X) || e(oe);
							}), S(T), S(m), r(m, () => $.attachment), w(() => {
								se(m, 1, u(["history-tab-gesture", {
									"is-swiping": $.dragging,
									"is-offset": $.dragPx !== 0
								}]), "svelte-uxr0i8"), _ = n(m, "", _, { "--history-tab-drag": `${$.dragPx ?? ""}px` }), ne = n(te, "", ne, { transform: `translateX(${$.indicatorProgress * 100}%)` }), A(T, "aria-busy", !O(X)), A(T, "data-opening-pending", !O(X)), E.inert = !O(X), A(E, "aria-hidden", O(X) ? void 0 : "true");
							}), f(a, m);
						},
						$$slots: { default: !0 }
					});
				}), f(a, m);
			},
			$$slots: {
				footer: !0,
				default: !0
			}
		});
	}
	var et = ce($e);
	return Ce(), et;
}
export { G as default };
