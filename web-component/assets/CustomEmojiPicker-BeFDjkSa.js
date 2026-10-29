import { $ as e, At as t, B as n, C as r, F as i, G as a, J as o, M as s, Mt as c, N as l, R as u, Tt as d, U as f, W as p, X as m, Y as h, Z as g, _t as _, bt as v, dt as y, f as b, ft as x, g as S, h as ee, ht as C, i as w, jt as T, k as te, lt as E, n as ne, o as re, ot as D, p as ie, pt as ae, q as O, r as k, rt as oe, s as se, st as A, tt as j, ut as M, v as N, wt as P } from "./index-client-57Odq85c.js";
import { i as ce } from "./appRuntimeEnvironment-BvtUCHcA.js";
import { B as F, F as I, P as L, Q as R, et as z, j as le, o as B, pt as ue, st as V, t as de } from "./LoadingPlaceholder-DK5Hrsgb.js";
import { t as H } from "./roving-focus-group-Lr_W2Xj3.js";
import { a as fe, c as pe, d as me, i as he, l as ge, n as _e, o as ve, r as ye, s as be, t as xe, u as U } from "./customEmojiStore.svelte-CzuqxPvl.js";
import { _ as Se, h as Ce, n as we } from "./customEmoji-BFRq6RB7.js";
import { a as Te, i as W, r as Ee } from "./keyboardFocusUtils-Cil9djR5.js";
import { a as De, r as Oe } from "./customEmojiUsage-K78WMNd4.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/command/components/command-empty.svelte
var G = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"ref",
	"children",
	"child",
	"forceMount"
]), ke = a("<div><!></div>");
function Ae(e, t) {
	let n = O();
	d(t, !0);
	let r = k(t, "id", 19, () => B(n)), i = k(t, "ref", 15, null), a = k(t, "forceMount", 3, !1), o = w(t, G), s = ge.create({
		id: V(() => r()),
		ref: V(() => i(), (e) => i(e)),
		forceMount: V(() => a())
	}), m = v(() => z(s.props, o));
	var h = p(), g = M(h), _ = (e) => {
		var n = p(), r = M(n), i = (e) => {
			var n = p(), r = M(n);
			l(r, () => t.child, () => ({ props: j(m) })), f(e, n);
		}, a = (e) => {
			var n = ke();
			S(n, () => ({ ...j(m) }));
			var r = E(n);
			l(r, () => t.children ?? c), T(n), f(e, n);
		};
		u(r, (e) => {
			t.child ? e(i) : e(a, -1);
		}), f(e, n);
	};
	u(g, (e) => {
		s.shouldRender && e(_);
	}), f(e, h), P();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/command/components/command-input.svelte
var je = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"value",
	"autofocus",
	"id",
	"ref",
	"child"
]), Me = a("<input/>");
function Ne(e, t) {
	let n = O();
	d(t, !0);
	let r = k(t, "value", 15, ""), i = k(t, "autofocus", 3, !1), a = k(t, "id", 19, () => B(n)), o = k(t, "ref", 15, null), s = w(t, je), c = U.create({
		id: V(() => a()),
		ref: V(() => o(), (e) => o(e)),
		value: V(() => r(), (e) => {
			r(e);
		}),
		autofocus: V(() => i() ?? !1)
	}), m = v(() => z(s, c.props));
	var h = p(), g = M(h), _ = (e) => {
		var n = p(), r = M(n);
		l(r, () => t.child, () => ({ props: j(m) })), f(e, n);
	}, y = (e) => {
		var t = Me();
		S(t, () => ({ ...j(m) }), void 0, void 0, void 0, void 0, !0), ee(t, r), f(e, t);
	};
	u(g, (e) => {
		t.child ? e(_) : e(y, -1);
	}), f(e, h), P();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/command/components/command-loading.svelte
var Pe = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"progress",
	"id",
	"ref",
	"children",
	"child"
]), Fe = a("<div><!></div>");
function Ie(e, t) {
	let n = O();
	d(t, !0);
	let r = k(t, "progress", 3, 0), i = k(t, "id", 19, () => B(n)), a = k(t, "ref", 15, null), o = w(t, Pe), s = me.create({
		id: V(() => i()),
		ref: V(() => a(), (e) => a(e)),
		progress: V(() => r())
	}), m = v(() => z(o, s.props));
	var h = p(), g = M(h), _ = (e) => {
		var n = p(), r = M(n);
		l(r, () => t.child, () => ({ props: j(m) })), f(e, n);
	}, y = (e) => {
		var n = Fe();
		S(n, () => ({ ...j(m) }));
		var r = E(n);
		l(r, () => t.children ?? c), T(n), f(e, n);
	};
	u(g, (e) => {
		t.child ? e(_) : e(y, -1);
	}), f(e, h), P();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/toolbar/toolbar.svelte.js
var K = I({
	component: "toolbar",
	parts: [
		"root",
		"item",
		"group",
		"group-item",
		"link",
		"button"
	]
}), Le = new R("Toolbar.Root");
new R("Toolbar.Group");
var Re = class e {
	static create(t) {
		return Le.set(new e(t));
	}
	opts;
	rovingFocusGroup;
	attachment;
	constructor(e) {
		this.opts = e, this.attachment = F(this.opts.ref), this.rovingFocusGroup = new H({
			orientation: this.opts.orientation,
			loop: this.opts.loop,
			rootNode: this.opts.ref,
			candidateAttr: K.item,
			rootAttr: K.root
		});
	}
	#e = v(() => ({
		id: this.opts.id.current,
		role: "toolbar",
		"data-orientation": this.opts.orientation.current,
		[K.root]: "",
		...this.attachment
	}));
	get props() {
		return j(this.#e);
	}
	set props(e) {
		C(this.#e, e);
	}
}, ze = class e {
	static create(t) {
		return new e(t, Le.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = F(this.opts.ref), A(() => {
			C(this.#e, this.root.rovingFocusGroup.getTabIndex(this.opts.ref.current), !0);
		}), this.onkeydown = this.onkeydown.bind(this);
	}
	onkeydown(e) {
		this.root.rovingFocusGroup.handleKeydown(this.opts.ref.current, e);
	}
	#e = _(0);
	#t = v(() => {
		if (this.opts.ref.current && this.opts.ref.current.tagName !== "BUTTON") return "button";
	});
	#n = v(() => ({
		id: this.opts.id.current,
		[K.item]: "",
		[K.button]: "",
		role: j(this.#t),
		tabindex: j(this.#e),
		"data-disabled": le(this.opts.disabled.current),
		"data-orientation": this.root.opts.orientation.current,
		disabled: L(this.opts.disabled.current),
		onkeydown: this.onkeydown,
		...this.attachment
	}));
	get props() {
		return j(this.#n);
	}
	set props(e) {
		C(this.#n, e);
	}
}, q = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"ref",
	"id",
	"orientation",
	"loop",
	"child",
	"children"
]), Be = a("<div><!></div>");
function Ve(e, t) {
	let n = O();
	d(t, !0);
	let r = k(t, "ref", 15, null), i = k(t, "id", 19, () => B(n)), a = k(t, "orientation", 3, "horizontal"), o = k(t, "loop", 3, !0), s = w(t, q), m = Re.create({
		id: V(() => i()),
		orientation: V(() => a()),
		loop: V(() => o()),
		ref: V(() => r(), (e) => r(e))
	}), h = v(() => z(s, m.props));
	var g = p(), _ = M(g), y = (e) => {
		var n = p(), r = M(n);
		l(r, () => t.child, () => ({ props: j(h) })), f(e, n);
	}, b = (e) => {
		var n = Be();
		S(n, () => ({ ...j(h) }));
		var r = E(n);
		l(r, () => t.children ?? c), T(n), f(e, n);
	};
	u(_, (e) => {
		t.child ? e(y) : e(b, -1);
	}), f(e, g), P();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/toolbar/components/toolbar-button.svelte
var J = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"child",
	"children",
	"disabled",
	"type",
	"id",
	"ref"
]), He = a("<button><!></button>");
function Ue(e, t) {
	let n = O();
	d(t, !0);
	let r = k(t, "disabled", 3, !1), i = k(t, "type", 3, "button"), a = k(t, "id", 19, () => B(n)), o = k(t, "ref", 15, null), s = w(t, J), m = ze.create({
		id: V(() => a()),
		disabled: V(() => r() ?? !1),
		ref: V(() => o(), (e) => o(e))
	}), h = v(() => z(s, m.props, { type: i() }));
	var g = p(), _ = M(g), y = (e) => {
		var n = p(), r = M(n);
		l(r, () => t.child, () => ({ props: j(h) })), f(e, n);
	}, b = (e) => {
		var n = He();
		S(n, () => ({ ...j(h) }));
		var r = E(n);
		l(r, () => t.children ?? c), T(n), f(e, n);
	};
	u(_, (e) => {
		t.child ? e(y) : e(b, -1);
	}), f(e, g), P();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/CustomEmojiPicker.svelte
var We = a("<img class=\"emoji-image svelte-u7m8y9\" draggable=\"false\" loading=\"lazy\" decoding=\"async\"/>"), Ge = a("<div class=\"svelte-u7m8y9\"><section class=\"custom-emoji-usage-section svelte-u7m8y9\"><div class=\"custom-emoji-usage-title svelte-u7m8y9\"> </div> <div class=\"custom-emoji-usage-grid svelte-u7m8y9\"></div></section> <section class=\"custom-emoji-usage-section svelte-u7m8y9\"><div class=\"custom-emoji-usage-title svelte-u7m8y9\"> </div> <div class=\"custom-emoji-usage-grid svelte-u7m8y9\"></div></section></div>"), Ke = a("<div class=\"svelte-u7m8y9\"></div>"), qe = a("<!> <div class=\"emoji-virtual-list svelte-u7m8y9\"><div class=\"emoji-grid svelte-u7m8y9\"></div></div>", 1), Je = a("<!> <!>", 1), Ye = a("<span class=\"caret-left-icon svg-icon svelte-u7m8y9\"></span>"), Xe = a("<span class=\"caret-right-icon svg-icon svelte-u7m8y9\"></span>"), Ze = a("<span class=\"enter-key-icon svg-icon svelte-u7m8y9\"></span>"), Qe = a("<span class=\"delete-left-icon svg-icon svelte-u7m8y9\"></span>"), $e = a("<div class=\"arrow-keys svelte-u7m8y9\"><!> <!></div> <div class=\"line-break-delete svelte-u7m8y9\"><!> <!></div>", 1), et = a("<!> <div class=\"custom-emoji-search-row svelte-u7m8y9\"><!> <!></div>", 1), tt = a("<div class=\"custom-emoji-picker svelte-u7m8y9\"><div class=\"resize-handle svelte-u7m8y9\" role=\"separator\" tabindex=\"0\" aria-orientation=\"horizontal\"></div> <!></div>"), nt = {
	hash: "svelte-u7m8y9",
	code: ".custom-emoji-picker.svelte-u7m8y9 {width:100%;max-width:800px;background:var(--dialog-bg);color:var(--text);overflow:hidden;position:relative;z-index:99;}.resize-handle.svelte-u7m8y9 {width:100%;height:var(--custom-emoji-picker-resize-handle-height);margin-bottom:calc(\n            var(--custom-emoji-picker-resize-handle-overlap) * -1\n        );cursor:ns-resize;touch-action:none;position:relative;z-index:1;background:transparent;}.resize-handle.svelte-u7m8y9::before {content:\"\";position:absolute;inset:0 0 auto 0;height:12px;background:var(--bg-buttonbar);}.resize-handle.svelte-u7m8y9::after {content:\"\";position:absolute;left:50%;top:6px;width:38px;height:4px;border-radius:999px;translate:-50% -50%;background:var(--border);}.custom-emoji-command {display:flex;flex-direction:column;}.custom-emoji-search-row.svelte-u7m8y9 {display:flex;align-items:center;width:100%;min-height:var(--custom-emoji-picker-search-row-height);border-top:1px solid var(--border);background:var(--input-bg, var(--dialog-bg));}.custom-emoji-search {flex:1 1 auto;min-width:0;width:100%;height:var(--custom-emoji-picker-search-row-height);padding:0 8px;border:0;background:transparent;color:var(--text);font-size:1rem;outline:none;}.custom-emoji-editor-toolbar {display:flex;align-items:center;flex:0 0 auto;height:var(--custom-emoji-picker-search-row-height);gap:2px;.arrow-keys.svelte-u7m8y9 {display:flex;align-items:center;height:100%;gap:2px;}.line-break-delete.svelte-u7m8y9 {display:flex;align-items:center;height:100%;gap:2px;.line-break {width:62px;}.delete {width:62px;}}}.custom-emoji-editor-button {display:flex;align-items:center;justify-content:center;width:50px;height:100%;padding:0;color:var(--text);background-color:var(--btn-bg);touch-action:manipulation;\n\n        @media (hover: hover) and (pointer: fine) {&:hover {background:var(--btn-bg);}\n        }}.custom-emoji-editor-button:active {scale:0.94;}.custom-emoji-editor-button .svg-icon {width:34px;height:34px;background-color:var(--svg, currentColor);mask-repeat:no-repeat;mask-position:center;mask-size:contain;}.caret-left-icon.svelte-u7m8y9 {mask-image:var(--ehagaki-icon-6172726f775f6c6566745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.caret-right-icon.svelte-u7m8y9 {mask-image:var(--ehagaki-icon-6172726f775f72696768745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.delete-left-icon.svelte-u7m8y9 {mask-image:var(--ehagaki-icon-6261636b73706163655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.enter-key-icon.svelte-u7m8y9 {mask-image:var(--ehagaki-icon-6b6579626f6172645f72657475726e5f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.custom-emoji-scroll-root,\n    .custom-emoji-scroll-viewport {width:100%;}.custom-emoji-scroll-root {overflow:hidden;}.custom-emoji-scroll-viewport {height:100%;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;}.custom-emoji-list {min-height:100%;}.emoji-virtual-list.svelte-u7m8y9 {position:relative;width:100%;}.emoji-grid.svelte-u7m8y9 {position:absolute;inset:4px 4px auto 4px;display:grid;justify-items:center;}.custom-emoji-usage-section.svelte-u7m8y9 {padding:4px;border-bottom:1px solid var(--border);}.custom-emoji-usage-title.svelte-u7m8y9 {padding:0 6px 2px;color:var(--text-muted, var(--text));font-size:0.78rem;font-weight:700;}.custom-emoji-usage-grid.svelte-u7m8y9 {display:grid;grid-auto-rows:40px;justify-items:center;}.emoji-item {display:flex;align-items:center;justify-content:center;width:100%;height:100%;cursor:pointer;outline:none;}.emoji-item[data-highlighted] {background:var(--btn-hover-bg);}\n\n    @media (hover: hover) and (pointer: fine) {.emoji-item:hover {background:var(--btn-hover-bg);}\n    }.emoji-image.svelte-u7m8y9 {width:32px;height:32px;object-fit:contain;user-select:none;-webkit-user-drag:none;}.custom-emoji-message {padding:18px 12px;text-align:center;color:var(--text-muted, var(--text));font-size:0.9rem;}.custom-emoji-loading {min-height:96px;.placeholder-text.loading-text {font-size:1rem;}}.scrollbar {display:flex;width:8px;padding:1px;background:transparent;}.scrollbar-thumb {flex:1;border-radius:999px;background:var(--border);}"
};
function rt(a, c) {
	d(c, !0), te(a, nt);
	let l = () => se(ue, "$_", h), [h, S] = re(), ee = ce(), w = k(c, "open", 3, !1), O = k(c, "maxHeight", 3, null), F = k(c, "customEmojiUsageItems", 19, () => []), I = _(""), L = _(ae(240)), R = _(!1), z = _(!1), le = _(0), B = _(800), V = null, H = null, me = null, ge = _(0), U, G, ke = !1, je, Me, Pe = !1, Fe, K, Le = /* @__PURE__ */ new Set(), Re = v(() => c.hostCustomEmojiItems ?? xe.items), ze = v(() => c.hostCustomEmojiItems === void 0 && xe.loading), q = v(() => {
		let e = j(I).trim().toLowerCase();
		return e ? j(Re).filter((t) => t.shortcodeLower.includes(e)) : j(Re);
	}), Be = v(() => j(I).trim().length === 0 && F().length > 0), J = v(() => Math.max(1, Math.floor(j(B) / 40))), He = v(() => Oe(j(J))), rt = v(() => F().slice(0, j(He))), it = v(() => [...F()].sort(De).slice(0, j(He))), at = v(() => Math.ceil(j(q).length / j(J))), Y = v(() => Math.max(48, j(L))), ot = v(() => Math.ceil(j(Y) / 40) + 6), st = v(() => Math.max(0, Math.min(Math.max(0, j(at) - j(ot)), Math.floor(Math.max(0, j(le) - j(ge)) / 40) - 3))), ct = v(() => Math.min(j(at), j(st) + j(ot))), lt = v(() => j(st) * j(J)), ut = v(() => Math.min(j(q).length, j(ct) * j(J))), dt = v(() => j(q).slice(j(lt), j(ut))), ft = v(() => j(at) * 40 + 8), pt = v(() => j(st) * 40), mt = v(() => Number.isFinite(O()) ? Math.max(48, Math.floor(O())) : void 0), X = v(() => j(mt) === void 0 ? void 0 : j(mt)), ht = v(() => "--custom-emoji-picker-resize-handle-height: 30px; --custom-emoji-picker-resize-handle-overlap: 16px; --custom-emoji-picker-search-row-height: 40px;");
	function gt() {
		let e = window.visualViewport?.width ?? window.innerWidth ?? 800;
		C(B, Math.min(800, Math.max(1, e)), !0);
	}
	function _t(e) {
		c.hostCustomEmojiItems === void 0 && (Le.has(e) || (Le.add(e), we([e])));
	}
	function vt() {
		let e = window.visualViewport?.height ?? 0, t = Te();
		return Math.max(window.innerHeight || 0, e + t, e, 800);
	}
	function yt() {
		gt();
	}
	function bt() {
		if (typeof window > "u") return 48;
		let e = vt(), t = Math.floor(e * .6);
		return Math.max(48, j(X) === void 0 ? t : j(X));
	}
	function xt(e) {
		C(L, Se(ee, e, vt(), j(X)), !0);
	}
	function St(e) {
		e.key === "ArrowUp" ? (e.preventDefault(), xt(j(Y) + 24)) : e.key === "ArrowDown" && (e.preventDefault(), xt(j(Y) - 24));
	}
	function Z() {
		H !== null && cancelAnimationFrame(H), H = requestAnimationFrame(() => {
			H = null, yt();
		});
	}
	ne(() => (C(L, Ce(ee, vt(), j(X)), !0), yt(), window.addEventListener("resize", Z), window.visualViewport?.addEventListener("resize", Z), window.visualViewport?.addEventListener("scroll", Z), () => {
		H !== null && (cancelAnimationFrame(H), H = null), window.removeEventListener("resize", Z), window.visualViewport?.removeEventListener("resize", Z), window.visualViewport?.removeEventListener("scroll", Z);
	})), A(() => {
		let e = w(), t = c.rxNostr, n = c.pubkey;
		c.hostCustomEmojiItems === void 0 ? e ? ((t !== U || n !== G) && (U = t, G = n, oe(() => xe.load({
			rxNostr: t,
			pubkey: n
		}))), Z()) : (U = void 0, G = void 0) : (U = void 0, G = void 0, e && Z());
	}), A(() => {
		let e = w() && (!ke || c.rxNostr !== je || c.pubkey !== Me);
		if (ke = w(), je = c.rxNostr, Me = c.pubkey, V !== null && (cancelAnimationFrame(V), V = null), !w() || !e) w() || C(z, !1);
		else return C(z, !1), V = requestAnimationFrame(() => {
			V = null, C(z, !0);
		}), () => {
			V !== null && (cancelAnimationFrame(V), V = null);
		};
	}), A(() => {
		let e = w() && (!Pe || j(I) !== Fe || c.pubkey !== K);
		Pe = w(), Fe = j(I), K = c.pubkey, e && (C(le, 0), me?.querySelector(".custom-emoji-scroll-viewport")?.scrollTo({ top: 0 }));
	}), A(() => {
		j(X), C(L, Ce(ee, vt(), j(X)), !0);
	});
	function Ct(e) {
		c.onSelect?.(e);
	}
	function wt() {
		c.onMoveCaretLeft?.();
	}
	function Tt() {
		c.onMoveCaretRight?.();
	}
	function Et() {
		c.onDeleteBackward?.();
	}
	function Dt() {
		c.onInsertLineBreak?.();
	}
	function Ot(e) {
		e.preventDefault(), yt();
		let t = e.clientY, n = j(Y);
		C(R, !0);
		let r = (e) => {
			e.preventDefault(), xt(n + (t - e.clientY));
		}, i = () => {
			C(R, !1), window.removeEventListener("pointermove", r), window.removeEventListener("pointerup", i), window.removeEventListener("pointercancel", i);
		};
		window.addEventListener("pointermove", r), window.addEventListener("pointerup", i), window.addEventListener("pointercancel", i);
	}
	function kt(e) {
		C(le, e.currentTarget.scrollTop, !0);
	}
	var Q = tt(), $ = E(Q), At = x($, 2);
	{
		let a = v(() => l()("customEmoji.search_label"));
		s(At, () => pe, (c, d) => {
			d(c, {
				class: "custom-emoji-command",
				get label() {
					return j(a);
				},
				shouldFilter: !1,
				loop: !0,
				children: (a, c) => {
					var d = et(), m = M(d);
					{
						let a = v(() => `height: ${j(Y)}px;`);
						s(m, () => fe, (c, d) => {
							d(c, {
								type: "auto",
								class: "custom-emoji-scroll-root",
								get style() {
									return j(a);
								},
								children: (a, c) => {
									var d = Je(), m = M(d);
									s(m, () => he, (a, c) => {
										c(a, {
											class: "custom-emoji-scroll-viewport",
											onscroll: kt,
											children: (a, c) => {
												var d = p(), m = M(d);
												s(m, () => ve, (a, c) => {
													c(a, {
														class: "custom-emoji-list",
														children: (a, c) => {
															var d = p(), m = M(d), h = (e) => {
																var t = p(), n = M(t);
																s(n, () => Ie, (e, t) => {
																	t(e, {
																		class: "custom-emoji-message",
																		children: (e, t) => {
																			{
																				let t = v(() => l()("customEmoji.loading"));
																				de(e, {
																					showLoader: !0,
																					get text() {
																						return j(t);
																					},
																					customClass: "custom-emoji-loading"
																				});
																			}
																		},
																		$$slots: { default: !0 }
																	});
																}), f(e, t);
															}, _ = (e) => {
																var r = p(), i = M(r);
																s(i, () => Ae, (e, r) => {
																	r(e, {
																		class: "custom-emoji-message",
																		children: (e, r) => {
																			t();
																			var i = o();
																			D((e) => n(i, e), [() => l()("customEmoji.empty")]), f(e, i);
																		},
																		$$slots: { default: !0 }
																	});
																}), f(e, r);
															}, b = (t) => {
																var a = qe(), o = M(a), c = (t) => {
																	var a = Ge(), o = E(a), c = E(o), u = y(c, !0), d = x(c, 2);
																	i(d, 21, () => j(rt), (e) => e.identityKey, (t, n) => {
																		var r = p(), i = M(r);
																		{
																			let t = v(() => `recent:${j(n).identityKey}`), r = v(() => [j(n).shortcode]);
																			s(i, () => be, (i, a) => {
																				a(i, {
																					get value() {
																						return j(t);
																					},
																					get keywords() {
																						return j(r);
																					},
																					class: "emoji-item custom-emoji-usage-item",
																					onSelect: () => Ct(j(n)),
																					get onmousedown() {
																						return W;
																					},
																					get ontouchstart() {
																						return Ee;
																					},
																					children: (t, r) => {
																						var i = We();
																						D(() => {
																							N(i, "src", j(n).src), N(i, "alt", `:${j(n).shortcode}:`), N(i, "title", `:${j(n).shortcode}:`);
																						}), g("load", i, () => _t(j(n).src)), e(i), f(t, i);
																					},
																					$$slots: { default: !0 }
																				});
																			});
																		}
																		f(t, r);
																	}), T(d), T(o);
																	var m = x(o, 2), h = E(m), _ = y(h, !0), b = x(h, 2);
																	i(b, 21, () => j(it), (e) => e.identityKey, (t, n) => {
																		var r = p(), i = M(r);
																		{
																			let t = v(() => `frequent:${j(n).identityKey}`), r = v(() => [j(n).shortcode]);
																			s(i, () => be, (i, a) => {
																				a(i, {
																					get value() {
																						return j(t);
																					},
																					get keywords() {
																						return j(r);
																					},
																					class: "emoji-item custom-emoji-usage-item",
																					onSelect: () => Ct(j(n)),
																					get onmousedown() {
																						return W;
																					},
																					get ontouchstart() {
																						return Ee;
																					},
																					children: (t, r) => {
																						var i = We();
																						D(() => {
																							N(i, "src", j(n).src), N(i, "alt", `:${j(n).shortcode}:`), N(i, "title", `:${j(n).shortcode}:`);
																						}), g("load", i, () => _t(j(n).src)), e(i), f(t, i);
																					},
																					$$slots: { default: !0 }
																				});
																			});
																		}
																		f(t, r);
																	}), T(b), T(m), T(a), D((e, t, i, a) => {
																		N(o, "aria-label", e), n(u, t), r(d, `grid-template-columns: repeat(${j(J)}, minmax(0, 1fr));`), N(m, "aria-label", i), n(_, a), r(b, `grid-template-columns: repeat(${j(J)}, minmax(0, 1fr));`);
																	}, [
																		() => l()("customEmoji.recent"),
																		() => l()("customEmoji.recent"),
																		() => l()("customEmoji.frequent"),
																		() => l()("customEmoji.frequent")
																	]), ie(a, "clientHeight", (e) => C(ge, e)), f(t, a);
																}, d = (e) => {
																	var t = Ke();
																	ie(t, "clientHeight", (e) => C(ge, e)), f(e, t);
																};
																u(o, (e) => {
																	j(Be) ? e(c) : e(d, -1);
																});
																var m = x(o, 2), h = E(m);
																i(h, 21, () => j(dt), (e) => e.identityKey, (t, n) => {
																	var r = p(), i = M(r);
																	{
																		let t = v(() => [j(n).shortcode]);
																		s(i, () => be, (r, i) => {
																			i(r, {
																				get value() {
																					return j(n).identityKey;
																				},
																				get keywords() {
																					return j(t);
																				},
																				class: "emoji-item",
																				onSelect: () => Ct(j(n)),
																				get onmousedown() {
																					return W;
																				},
																				get ontouchstart() {
																					return Ee;
																				},
																				children: (t, r) => {
																					var i = We();
																					D(() => {
																						N(i, "src", j(n).src), N(i, "alt", `:${j(n).shortcode}:`), N(i, "title", `:${j(n).shortcode}:`);
																					}), g("load", i, () => _t(j(n).src)), e(i), f(t, i);
																				},
																				$$slots: { default: !0 }
																			});
																		});
																	}
																	f(t, r);
																}), T(h), T(m), D(() => {
																	r(m, `height: ${j(ft)}px;`), r(h, `transform: translateY(${j(pt)}px); grid-template-columns: repeat(${j(J)}, minmax(0, 1fr)); grid-auto-rows: 40px;`);
																}), f(t, a);
															};
															u(m, (e) => {
																j(ze) || !j(z) ? e(h) : j(q).length === 0 && !j(Be) ? e(_, 1) : e(b, -1);
															}), f(a, d);
														},
														$$slots: { default: !0 }
													});
												}), f(a, d);
											},
											$$slots: { default: !0 }
										});
									});
									var h = x(m, 2);
									s(h, () => ye, (e, t) => {
										t(e, {
											orientation: "vertical",
											class: "scrollbar",
											children: (e, t) => {
												var n = p(), r = M(n);
												s(r, () => _e, (e, t) => {
													t(e, { class: "scrollbar-thumb" });
												}), f(e, n);
											},
											$$slots: { default: !0 }
										});
									}), f(a, d);
								},
								$$slots: { default: !0 }
							});
						});
					}
					var h = x(m, 2), _ = E(h);
					{
						let e = v(() => l()("customEmoji.search_placeholder"));
						s(_, () => Ne, (t, n) => {
							n(t, {
								class: "custom-emoji-search",
								get placeholder() {
									return j(e);
								},
								get value() {
									return j(I);
								},
								set value(e) {
									C(I, e, !0);
								}
							});
						});
					}
					var b = x(_, 2);
					{
						let e = v(() => l()("customEmoji.editor_toolbar"));
						s(b, () => Ve, (t, n) => {
							n(t, {
								class: "custom-emoji-editor-toolbar",
								orientation: "horizontal",
								loop: !1,
								get "aria-label"() {
									return j(e);
								},
								children: (e, t) => {
									var n = $e(), r = M(n), i = E(r);
									{
										let e = v(() => l()("customEmoji.move_left"));
										s(i, () => Ue, (t, n) => {
											n(t, {
												class: "custom-emoji-editor-button left",
												get "aria-label"() {
													return j(e);
												},
												get onmousedown() {
													return W;
												},
												get ontouchstart() {
													return W;
												},
												onclick: wt,
												children: (e, t) => {
													var n = Ye();
													f(e, n);
												},
												$$slots: { default: !0 }
											});
										});
									}
									var a = x(i, 2);
									{
										let e = v(() => l()("customEmoji.move_right"));
										s(a, () => Ue, (t, n) => {
											n(t, {
												class: "custom-emoji-editor-button right",
												get "aria-label"() {
													return j(e);
												},
												get onmousedown() {
													return W;
												},
												get ontouchstart() {
													return W;
												},
												onclick: Tt,
												children: (e, t) => {
													var n = Xe();
													f(e, n);
												},
												$$slots: { default: !0 }
											});
										});
									}
									T(r);
									var o = x(r, 2), c = E(o);
									{
										let e = v(() => l()("customEmoji.insert_line_break"));
										s(c, () => Ue, (t, n) => {
											n(t, {
												class: "custom-emoji-editor-button line-break",
												get "aria-label"() {
													return j(e);
												},
												get onmousedown() {
													return W;
												},
												get ontouchstart() {
													return W;
												},
												onclick: Dt,
												children: (e, t) => {
													var n = Ze();
													f(e, n);
												},
												$$slots: { default: !0 }
											});
										});
									}
									var u = x(c, 2);
									{
										let e = v(() => l()("customEmoji.delete_backward"));
										s(u, () => Ue, (t, n) => {
											n(t, {
												class: "custom-emoji-editor-button delete",
												get "aria-label"() {
													return j(e);
												},
												get onmousedown() {
													return W;
												},
												get ontouchstart() {
													return W;
												},
												onclick: Et,
												children: (e, t) => {
													var n = Qe();
													f(e, n);
												},
												$$slots: { default: !0 }
											});
										});
									}
									T(o), f(e, n);
								},
								$$slots: { default: !0 }
							});
						});
					}
					T(h), f(a, d);
				},
				$$slots: { default: !0 }
			});
		});
	}
	T(Q), b(Q, (e) => me = e, () => me), D((e, t) => {
		N(Q, "data-resizing", j(R)), r(Q, j(ht)), N($, "aria-label", e), N($, "aria-valuemin", 48), N($, "aria-valuenow", j(Y)), N($, "aria-valuemax", t);
	}, [() => l()("customEmoji.resize"), () => bt()]), m("pointerdown", $, Ot), m("keydown", $, St), f(a, Q), P(), S();
}
h(["pointerdown", "keydown"]);
export { rt as default };
