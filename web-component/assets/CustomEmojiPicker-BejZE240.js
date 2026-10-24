import { At as e, B as t, C as n, Ct as r, F as i, G as a, J as o, K as s, M as c, N as l, Q as u, R as d, U as f, W as p, X as m, Y as h, at as g, ct as _, dt as v, et as y, f as b, ft as x, g as S, gt as C, h as ee, i as w, jt as T, k as te, kt as ne, lt as E, mt as D, n as re, nt as ie, o as ae, ot as O, p as oe, q as se, r as k, s as ce, ut as le, v as A, wt as j, yt as M } from "./index-client-Bdka-Daw.js";
import { i as ue } from "./appRuntimeEnvironment-BvtUCHcA.js";
import { B as N, F as P, P as F, Q as I, et as L, j as de, o as R, pt as fe, st as z, t as pe } from "./LoadingPlaceholder-j1_vRYno.js";
import { t as B } from "./roving-focus-group-DIgmMOCR.js";
import { a as me, c as he, d as ge, i as _e, l as ve, n as ye, o as be, r as xe, s as Se, t as Ce, u as V } from "./customEmojiStore.svelte-emb-rLwV.js";
import { _ as we, h as Te, n as Ee } from "./customEmoji-Bvbh2sQz.js";
import { a as De, i as H, r as Oe } from "./keyboardFocusUtils-Cil9djR5.js";
import { a as ke, r as Ae } from "./customEmojiUsage-DkSYLWzm.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/command/components/command-empty.svelte
var U = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"ref",
	"children",
	"child",
	"forceMount"
]), je = a("<div><!></div>");
function Me(t, n) {
	let i = s();
	j(n, !0);
	let a = k(n, "id", 19, () => R(i)), o = k(n, "ref", 15, null), c = k(n, "forceMount", 3, !1), u = w(n, U), m = ve.create({
		id: z(() => a()),
		ref: z(() => o(), (e) => o(e)),
		forceMount: z(() => c())
	}), h = M(() => L(m.props, u));
	var g = p(), v = E(g), b = (t) => {
		var r = p(), i = E(r), a = (e) => {
			var t = p(), r = E(t);
			l(r, () => n.child, () => ({ props: y(h) })), f(e, t);
		}, o = (t) => {
			var r = je();
			S(r, () => ({ ...y(h) }));
			var i = _(r);
			l(i, () => n.children ?? T), e(r), f(t, r);
		};
		d(i, (e) => {
			n.child ? e(a) : e(o, -1);
		}), f(t, r);
	};
	d(v, (e) => {
		m.shouldRender && e(b);
	}), f(t, g), r();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/command/components/command-input.svelte
var Ne = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"value",
	"autofocus",
	"id",
	"ref",
	"child"
]), Pe = a("<input/>");
function Fe(e, t) {
	let n = s();
	j(t, !0);
	let i = k(t, "value", 15, ""), a = k(t, "autofocus", 3, !1), o = k(t, "id", 19, () => R(n)), c = k(t, "ref", 15, null), u = w(t, Ne), m = V.create({
		id: z(() => o()),
		ref: z(() => c(), (e) => c(e)),
		value: z(() => i(), (e) => {
			i(e);
		}),
		autofocus: z(() => a() ?? !1)
	}), h = M(() => L(u, m.props));
	var g = p(), _ = E(g), v = (e) => {
		var n = p(), r = E(n);
		l(r, () => t.child, () => ({ props: y(h) })), f(e, n);
	}, b = (e) => {
		var t = Pe();
		S(t, () => ({ ...y(h) }), void 0, void 0, void 0, void 0, !0), ee(t, i), f(e, t);
	};
	d(_, (e) => {
		t.child ? e(v) : e(b, -1);
	}), f(e, g), r();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/command/components/command-loading.svelte
var Ie = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"progress",
	"id",
	"ref",
	"children",
	"child"
]), Le = a("<div><!></div>");
function Re(t, n) {
	let i = s();
	j(n, !0);
	let a = k(n, "progress", 3, 0), o = k(n, "id", 19, () => R(i)), c = k(n, "ref", 15, null), u = w(n, Ie), m = ge.create({
		id: z(() => o()),
		ref: z(() => c(), (e) => c(e)),
		progress: z(() => a())
	}), h = M(() => L(u, m.props));
	var g = p(), v = E(g), b = (e) => {
		var t = p(), r = E(t);
		l(r, () => n.child, () => ({ props: y(h) })), f(e, t);
	}, x = (t) => {
		var r = Le();
		S(r, () => ({ ...y(h) }));
		var i = _(r);
		l(i, () => n.children ?? T), e(r), f(t, r);
	};
	d(v, (e) => {
		n.child ? e(b) : e(x, -1);
	}), f(t, g), r();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/toolbar/toolbar.svelte.js
var W = P({
	component: "toolbar",
	parts: [
		"root",
		"item",
		"group",
		"group-item",
		"link",
		"button"
	]
}), G = new I("Toolbar.Root");
new I("Toolbar.Group");
var ze = class e {
	static create(t) {
		return G.set(new e(t));
	}
	opts;
	rovingFocusGroup;
	attachment;
	constructor(e) {
		this.opts = e, this.attachment = N(this.opts.ref), this.rovingFocusGroup = new B({
			orientation: this.opts.orientation,
			loop: this.opts.loop,
			rootNode: this.opts.ref,
			candidateAttr: W.item,
			rootAttr: W.root
		});
	}
	#e = M(() => ({
		id: this.opts.id.current,
		role: "toolbar",
		"data-orientation": this.opts.orientation.current,
		[W.root]: "",
		...this.attachment
	}));
	get props() {
		return y(this.#e);
	}
	set props(e) {
		D(this.#e, e);
	}
}, Be = class e {
	static create(t) {
		return new e(t, G.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = N(this.opts.ref), O(() => {
			D(this.#e, this.root.rovingFocusGroup.getTabIndex(this.opts.ref.current), !0);
		}), this.onkeydown = this.onkeydown.bind(this);
	}
	onkeydown(e) {
		this.root.rovingFocusGroup.handleKeydown(this.opts.ref.current, e);
	}
	#e = C(0);
	#t = M(() => {
		if (this.opts.ref.current && this.opts.ref.current.tagName !== "BUTTON") return "button";
	});
	#n = M(() => ({
		id: this.opts.id.current,
		[W.item]: "",
		[W.button]: "",
		role: y(this.#t),
		tabindex: y(this.#e),
		"data-disabled": de(this.opts.disabled.current),
		"data-orientation": this.root.opts.orientation.current,
		disabled: F(this.opts.disabled.current),
		onkeydown: this.onkeydown,
		...this.attachment
	}));
	get props() {
		return y(this.#n);
	}
	set props(e) {
		D(this.#n, e);
	}
}, K = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"ref",
	"id",
	"orientation",
	"loop",
	"child",
	"children"
]), Ve = a("<div><!></div>");
function He(t, n) {
	let i = s();
	j(n, !0);
	let a = k(n, "ref", 15, null), o = k(n, "id", 19, () => R(i)), c = k(n, "orientation", 3, "horizontal"), u = k(n, "loop", 3, !0), m = w(n, K), h = ze.create({
		id: z(() => o()),
		orientation: z(() => c()),
		loop: z(() => u()),
		ref: z(() => a(), (e) => a(e))
	}), g = M(() => L(m, h.props));
	var v = p(), b = E(v), x = (e) => {
		var t = p(), r = E(t);
		l(r, () => n.child, () => ({ props: y(g) })), f(e, t);
	}, C = (t) => {
		var r = Ve();
		S(r, () => ({ ...y(g) }));
		var i = _(r);
		l(i, () => n.children ?? T), e(r), f(t, r);
	};
	d(b, (e) => {
		n.child ? e(x) : e(C, -1);
	}), f(t, v), r();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/toolbar/components/toolbar-button.svelte
var q = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"child",
	"children",
	"disabled",
	"type",
	"id",
	"ref"
]), Ue = a("<button><!></button>");
function We(t, n) {
	let i = s();
	j(n, !0);
	let a = k(n, "disabled", 3, !1), o = k(n, "type", 3, "button"), c = k(n, "id", 19, () => R(i)), u = k(n, "ref", 15, null), m = w(n, q), h = Be.create({
		id: z(() => c()),
		disabled: z(() => a() ?? !1),
		ref: z(() => u(), (e) => u(e))
	}), g = M(() => L(m, h.props, { type: o() }));
	var v = p(), b = E(v), x = (e) => {
		var t = p(), r = E(t);
		l(r, () => n.child, () => ({ props: y(g) })), f(e, t);
	}, C = (t) => {
		var r = Ue();
		S(r, () => ({ ...y(g) }));
		var i = _(r);
		l(i, () => n.children ?? T), e(r), f(t, r);
	};
	d(b, (e) => {
		n.child ? e(x) : e(C, -1);
	}), f(t, v), r();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/CustomEmojiPicker.svelte
var Ge = a("<img class=\"emoji-image svelte-u7m8y9\" draggable=\"false\" loading=\"lazy\" decoding=\"async\"/>"), Ke = a("<div class=\"svelte-u7m8y9\"><section class=\"custom-emoji-usage-section svelte-u7m8y9\"><div class=\"custom-emoji-usage-title svelte-u7m8y9\"> </div> <div class=\"custom-emoji-usage-grid svelte-u7m8y9\"></div></section> <section class=\"custom-emoji-usage-section svelte-u7m8y9\"><div class=\"custom-emoji-usage-title svelte-u7m8y9\"> </div> <div class=\"custom-emoji-usage-grid svelte-u7m8y9\"></div></section></div>"), qe = a("<div class=\"svelte-u7m8y9\"></div>"), Je = a("<!> <div class=\"emoji-virtual-list svelte-u7m8y9\"><div class=\"emoji-grid svelte-u7m8y9\"></div></div>", 1), Ye = a("<!> <!>", 1), Xe = a("<span class=\"caret-left-icon svg-icon svelte-u7m8y9\"></span>"), Ze = a("<span class=\"caret-right-icon svg-icon svelte-u7m8y9\"></span>"), Qe = a("<span class=\"enter-key-icon svg-icon svelte-u7m8y9\"></span>"), $e = a("<span class=\"delete-left-icon svg-icon svelte-u7m8y9\"></span>"), et = a("<div class=\"arrow-keys svelte-u7m8y9\"><!> <!></div> <div class=\"line-break-delete svelte-u7m8y9\"><!> <!></div>", 1), tt = a("<!> <div class=\"custom-emoji-search-row svelte-u7m8y9\"><!> <!></div>", 1), nt = a("<div class=\"custom-emoji-picker svelte-u7m8y9\"><div class=\"resize-handle svelte-u7m8y9\" role=\"separator\" tabindex=\"0\" aria-orientation=\"horizontal\"></div> <!></div>"), rt = {
	hash: "svelte-u7m8y9",
	code: ".custom-emoji-picker.svelte-u7m8y9 {width:100%;max-width:800px;background:var(--dialog-bg);color:var(--text);overflow:hidden;position:relative;z-index:99;}.resize-handle.svelte-u7m8y9 {width:100%;height:var(--custom-emoji-picker-resize-handle-height);margin-bottom:calc(\n            var(--custom-emoji-picker-resize-handle-overlap) * -1\n        );cursor:ns-resize;touch-action:none;position:relative;z-index:1;background:transparent;}.resize-handle.svelte-u7m8y9::before {content:\"\";position:absolute;inset:0 0 auto 0;height:12px;background:var(--bg-buttonbar);}.resize-handle.svelte-u7m8y9::after {content:\"\";position:absolute;left:50%;top:6px;width:38px;height:4px;border-radius:999px;translate:-50% -50%;background:var(--border);}.custom-emoji-command {display:flex;flex-direction:column;}.custom-emoji-search-row.svelte-u7m8y9 {display:flex;align-items:center;width:100%;min-height:var(--custom-emoji-picker-search-row-height);border-top:1px solid var(--border);background:var(--input-bg, var(--dialog-bg));}.custom-emoji-search {flex:1 1 auto;min-width:0;width:100%;height:var(--custom-emoji-picker-search-row-height);padding:0 8px;border:0;background:transparent;color:var(--text);font-size:1rem;outline:none;}.custom-emoji-editor-toolbar {display:flex;align-items:center;flex:0 0 auto;height:var(--custom-emoji-picker-search-row-height);gap:2px;.arrow-keys.svelte-u7m8y9 {display:flex;align-items:center;height:100%;gap:2px;}.line-break-delete.svelte-u7m8y9 {display:flex;align-items:center;height:100%;gap:2px;.line-break {width:62px;}.delete {width:62px;}}}.custom-emoji-editor-button {display:flex;align-items:center;justify-content:center;width:50px;height:100%;padding:0;color:var(--text);background-color:var(--btn-bg);touch-action:manipulation;\n\n        @media (hover: hover) and (pointer: fine) {&:hover {background:var(--btn-bg);}\n        }}.custom-emoji-editor-button:active {scale:0.94;}.custom-emoji-editor-button .svg-icon {width:34px;height:34px;background-color:var(--svg, currentColor);mask-repeat:no-repeat;mask-position:center;mask-size:contain;}.caret-left-icon.svelte-u7m8y9 {mask-image:var(--ehagaki-icon-6172726f775f6c6566745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.caret-right-icon.svelte-u7m8y9 {mask-image:var(--ehagaki-icon-6172726f775f72696768745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.delete-left-icon.svelte-u7m8y9 {mask-image:var(--ehagaki-icon-6261636b73706163655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.enter-key-icon.svelte-u7m8y9 {mask-image:var(--ehagaki-icon-6b6579626f6172645f72657475726e5f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.custom-emoji-scroll-root,\n    .custom-emoji-scroll-viewport {width:100%;}.custom-emoji-scroll-root {overflow:hidden;}.custom-emoji-scroll-viewport {height:100%;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;}.custom-emoji-list {min-height:100%;}.emoji-virtual-list.svelte-u7m8y9 {position:relative;width:100%;}.emoji-grid.svelte-u7m8y9 {position:absolute;inset:4px 4px auto 4px;display:grid;justify-items:center;}.custom-emoji-usage-section.svelte-u7m8y9 {padding:4px;border-bottom:1px solid var(--border);}.custom-emoji-usage-title.svelte-u7m8y9 {padding:0 6px 2px;color:var(--text-muted, var(--text));font-size:0.78rem;font-weight:700;}.custom-emoji-usage-grid.svelte-u7m8y9 {display:grid;grid-auto-rows:40px;justify-items:center;}.emoji-item {display:flex;align-items:center;justify-content:center;width:100%;height:100%;cursor:pointer;outline:none;}.emoji-item[data-highlighted] {background:var(--btn-hover-bg);}\n\n    @media (hover: hover) and (pointer: fine) {.emoji-item:hover {background:var(--btn-hover-bg);}\n    }.emoji-image.svelte-u7m8y9 {width:32px;height:32px;object-fit:contain;user-select:none;-webkit-user-drag:none;}.custom-emoji-message {padding:18px 12px;text-align:center;color:var(--text-muted, var(--text));font-size:0.9rem;}.custom-emoji-loading {min-height:96px;.placeholder-text.loading-text {font-size:1rem;}}.scrollbar {display:flex;width:8px;padding:1px;background:transparent;}.scrollbar-thumb {flex:1;border-radius:999px;background:var(--border);}"
};
function it(a, o) {
	j(o, !0), te(a, rt);
	let s = () => ce(fe, "$_", l), [l, S] = ae(), ee = ue(), w = k(o, "open", 3, !1), T = k(o, "maxHeight", 3, null), N = k(o, "customEmojiUsageItems", 19, () => []), P = C(""), F = C(x(240)), I = C(!1), L = C(!1), de = C(0), R = C(800), z = null, B = null, ge = null, ve = C(0), V, U, je = !1, Ne, Pe, Ie = !1, Le, W, G = /* @__PURE__ */ new Set(), ze = M(() => o.hostCustomEmojiItems ?? Ce.items), Be = M(() => o.hostCustomEmojiItems === void 0 && Ce.loading), K = M(() => {
		let e = y(P).trim().toLowerCase();
		return e ? y(ze).filter((t) => t.shortcodeLower.includes(e)) : y(ze);
	}), Ve = M(() => y(P).trim().length === 0 && N().length > 0), q = M(() => Math.max(1, Math.floor(y(R) / 40))), Ue = M(() => Ae(y(q))), it = M(() => N().slice(0, y(Ue))), at = M(() => [...N()].sort(ke).slice(0, y(Ue))), ot = M(() => Math.ceil(y(K).length / y(q))), J = M(() => Math.max(48, y(F))), st = M(() => Math.ceil(y(J) / 40) + 6), ct = M(() => Math.max(0, Math.min(Math.max(0, y(ot) - y(st)), Math.floor(Math.max(0, y(de) - y(ve)) / 40) - 3))), lt = M(() => Math.min(y(ot), y(ct) + y(st))), ut = M(() => y(ct) * y(q)), dt = M(() => Math.min(y(K).length, y(lt) * y(q))), ft = M(() => y(K).slice(y(ut), y(dt))), pt = M(() => y(ot) * 40 + 8), mt = M(() => y(ct) * 40), ht = M(() => Number.isFinite(T()) ? Math.max(48, Math.floor(T())) : void 0), Y = M(() => y(ht) === void 0 ? void 0 : y(ht)), gt = M(() => "--custom-emoji-picker-resize-handle-height: 30px; --custom-emoji-picker-resize-handle-overlap: 16px; --custom-emoji-picker-search-row-height: 40px;");
	function _t() {
		let e = window.visualViewport?.width ?? window.innerWidth ?? 800;
		D(R, Math.min(800, Math.max(1, e)), !0);
	}
	function vt(e) {
		o.hostCustomEmojiItems === void 0 && (G.has(e) || (G.add(e), Ee([e])));
	}
	function X() {
		let e = window.visualViewport?.height ?? 0, t = De();
		return Math.max(window.innerHeight || 0, e + t, e, 800);
	}
	function yt() {
		_t();
	}
	function bt() {
		if (typeof window > "u") return 48;
		let e = X(), t = Math.floor(e * .6);
		return Math.max(48, y(Y) === void 0 ? t : y(Y));
	}
	function xt(e) {
		D(F, we(ee, e, X(), y(Y)), !0);
	}
	function St(e) {
		e.key === "ArrowUp" ? (e.preventDefault(), xt(y(J) + 24)) : e.key === "ArrowDown" && (e.preventDefault(), xt(y(J) - 24));
	}
	function Z() {
		B !== null && cancelAnimationFrame(B), B = requestAnimationFrame(() => {
			B = null, yt();
		});
	}
	re(() => (D(F, Te(ee, X(), y(Y)), !0), yt(), window.addEventListener("resize", Z), window.visualViewport?.addEventListener("resize", Z), window.visualViewport?.addEventListener("scroll", Z), () => {
		B !== null && (cancelAnimationFrame(B), B = null), window.removeEventListener("resize", Z), window.visualViewport?.removeEventListener("resize", Z), window.visualViewport?.removeEventListener("scroll", Z);
	})), O(() => {
		let e = w(), t = o.rxNostr, n = o.pubkey;
		o.hostCustomEmojiItems === void 0 ? e ? ((t !== V || n !== U) && (V = t, U = n, ie(() => Ce.load({
			rxNostr: t,
			pubkey: n
		}))), Z()) : (V = void 0, U = void 0) : (V = void 0, U = void 0, e && Z());
	}), O(() => {
		let e = w() && (!je || o.rxNostr !== Ne || o.pubkey !== Pe);
		if (je = w(), Ne = o.rxNostr, Pe = o.pubkey, z !== null && (cancelAnimationFrame(z), z = null), !w() || !e) w() || D(L, !1);
		else return D(L, !1), z = requestAnimationFrame(() => {
			z = null, D(L, !0);
		}), () => {
			z !== null && (cancelAnimationFrame(z), z = null);
		};
	}), O(() => {
		let e = w() && (!Ie || y(P) !== Le || o.pubkey !== W);
		Ie = w(), Le = y(P), W = o.pubkey, e && (D(de, 0), ge?.querySelector(".custom-emoji-scroll-viewport")?.scrollTo({ top: 0 }));
	}), O(() => {
		y(Y), D(F, Te(ee, X(), y(Y)), !0);
	});
	function Ct(e) {
		o.onSelect?.(e);
	}
	function wt() {
		o.onMoveCaretLeft?.();
	}
	function Tt() {
		o.onMoveCaretRight?.();
	}
	function Et() {
		o.onDeleteBackward?.();
	}
	function Dt() {
		o.onInsertLineBreak?.();
	}
	function Ot(e) {
		e.preventDefault(), yt();
		let t = e.clientY, n = y(J);
		D(I, !0);
		let r = (e) => {
			e.preventDefault(), xt(n + (t - e.clientY));
		}, i = () => {
			D(I, !1), window.removeEventListener("pointermove", r), window.removeEventListener("pointerup", i), window.removeEventListener("pointercancel", i);
		};
		window.addEventListener("pointermove", r), window.addEventListener("pointerup", i), window.addEventListener("pointercancel", i);
	}
	function kt(e) {
		D(de, e.currentTarget.scrollTop, !0);
	}
	var Q = nt(), $ = _(Q), At = v($, 2);
	{
		let r = M(() => s()("customEmoji.search_label"));
		c(At, () => he, (a, o) => {
			o(a, {
				class: "custom-emoji-command",
				get label() {
					return y(r);
				},
				shouldFilter: !1,
				loop: !0,
				children: (r, a) => {
					var o = tt(), l = E(o);
					{
						let r = M(() => `height: ${y(J)}px;`);
						c(l, () => me, (a, o) => {
							o(a, {
								type: "auto",
								class: "custom-emoji-scroll-root",
								get style() {
									return y(r);
								},
								children: (r, a) => {
									var o = Ye(), l = E(o);
									c(l, () => _e, (r, a) => {
										a(r, {
											class: "custom-emoji-scroll-viewport",
											onscroll: kt,
											children: (r, a) => {
												var o = p(), l = E(o);
												c(l, () => be, (r, a) => {
													a(r, {
														class: "custom-emoji-list",
														children: (r, a) => {
															var o = p(), l = E(o), h = (e) => {
																var t = p(), n = E(t);
																c(n, () => Re, (e, t) => {
																	t(e, {
																		class: "custom-emoji-message",
																		children: (e, t) => {
																			{
																				let t = M(() => s()("customEmoji.loading"));
																				pe(e, {
																					showLoader: !0,
																					get text() {
																						return y(t);
																					},
																					customClass: "custom-emoji-loading"
																				});
																			}
																		},
																		$$slots: { default: !0 }
																	});
																}), f(e, t);
															}, b = (e) => {
																var n = p(), r = E(n);
																c(r, () => Me, (e, n) => {
																	n(e, {
																		class: "custom-emoji-message",
																		children: (e, n) => {
																			ne();
																			var r = se();
																			g((e) => t(r, e), [() => s()("customEmoji.empty")]), f(e, r);
																		},
																		$$slots: { default: !0 }
																	});
																}), f(e, n);
															}, x = (r) => {
																var a = Je(), o = E(a), l = (r) => {
																	var a = Ke(), o = _(a), l = _(o), d = le(l, !0), h = v(l, 2);
																	i(h, 21, () => y(it), (e) => e.identityKey, (e, t) => {
																		var n = p(), r = E(n);
																		{
																			let e = M(() => `recent:${y(t).identityKey}`), n = M(() => [y(t).shortcode]);
																			c(r, () => Se, (r, i) => {
																				i(r, {
																					get value() {
																						return y(e);
																					},
																					get keywords() {
																						return y(n);
																					},
																					class: "emoji-item custom-emoji-usage-item",
																					onSelect: () => Ct(y(t)),
																					get onmousedown() {
																						return H;
																					},
																					get ontouchstart() {
																						return Oe;
																					},
																					children: (e, n) => {
																						var r = Ge();
																						g(() => {
																							A(r, "src", y(t).src), A(r, "alt", `:${y(t).shortcode}:`), A(r, "title", `:${y(t).shortcode}:`);
																						}), m("load", r, () => vt(y(t).src)), u(r), f(e, r);
																					},
																					$$slots: { default: !0 }
																				});
																			});
																		}
																		f(e, n);
																	}), e(h), e(o);
																	var b = v(o, 2), x = _(b), S = le(x, !0), C = v(x, 2);
																	i(C, 21, () => y(at), (e) => e.identityKey, (e, t) => {
																		var n = p(), r = E(n);
																		{
																			let e = M(() => `frequent:${y(t).identityKey}`), n = M(() => [y(t).shortcode]);
																			c(r, () => Se, (r, i) => {
																				i(r, {
																					get value() {
																						return y(e);
																					},
																					get keywords() {
																						return y(n);
																					},
																					class: "emoji-item custom-emoji-usage-item",
																					onSelect: () => Ct(y(t)),
																					get onmousedown() {
																						return H;
																					},
																					get ontouchstart() {
																						return Oe;
																					},
																					children: (e, n) => {
																						var r = Ge();
																						g(() => {
																							A(r, "src", y(t).src), A(r, "alt", `:${y(t).shortcode}:`), A(r, "title", `:${y(t).shortcode}:`);
																						}), m("load", r, () => vt(y(t).src)), u(r), f(e, r);
																					},
																					$$slots: { default: !0 }
																				});
																			});
																		}
																		f(e, n);
																	}), e(C), e(b), e(a), g((e, r, i, a) => {
																		A(o, "aria-label", e), t(d, r), n(h, `grid-template-columns: repeat(${y(q)}, minmax(0, 1fr));`), A(b, "aria-label", i), t(S, a), n(C, `grid-template-columns: repeat(${y(q)}, minmax(0, 1fr));`);
																	}, [
																		() => s()("customEmoji.recent"),
																		() => s()("customEmoji.recent"),
																		() => s()("customEmoji.frequent"),
																		() => s()("customEmoji.frequent")
																	]), oe(a, "clientHeight", (e) => D(ve, e)), f(r, a);
																}, h = (e) => {
																	var t = qe();
																	oe(t, "clientHeight", (e) => D(ve, e)), f(e, t);
																};
																d(o, (e) => {
																	y(Ve) ? e(l) : e(h, -1);
																});
																var b = v(o, 2), x = _(b);
																i(x, 21, () => y(ft), (e) => e.identityKey, (e, t) => {
																	var n = p(), r = E(n);
																	{
																		let e = M(() => [y(t).shortcode]);
																		c(r, () => Se, (n, r) => {
																			r(n, {
																				get value() {
																					return y(t).identityKey;
																				},
																				get keywords() {
																					return y(e);
																				},
																				class: "emoji-item",
																				onSelect: () => Ct(y(t)),
																				get onmousedown() {
																					return H;
																				},
																				get ontouchstart() {
																					return Oe;
																				},
																				children: (e, n) => {
																					var r = Ge();
																					g(() => {
																						A(r, "src", y(t).src), A(r, "alt", `:${y(t).shortcode}:`), A(r, "title", `:${y(t).shortcode}:`);
																					}), m("load", r, () => vt(y(t).src)), u(r), f(e, r);
																				},
																				$$slots: { default: !0 }
																			});
																		});
																	}
																	f(e, n);
																}), e(x), e(b), g(() => {
																	n(b, `height: ${y(pt)}px;`), n(x, `transform: translateY(${y(mt)}px); grid-template-columns: repeat(${y(q)}, minmax(0, 1fr)); grid-auto-rows: 40px;`);
																}), f(r, a);
															};
															d(l, (e) => {
																y(Be) || !y(L) ? e(h) : y(K).length === 0 && !y(Ve) ? e(b, 1) : e(x, -1);
															}), f(r, o);
														},
														$$slots: { default: !0 }
													});
												}), f(r, o);
											},
											$$slots: { default: !0 }
										});
									});
									var h = v(l, 2);
									c(h, () => xe, (e, t) => {
										t(e, {
											orientation: "vertical",
											class: "scrollbar",
											children: (e, t) => {
												var n = p(), r = E(n);
												c(r, () => ye, (e, t) => {
													t(e, { class: "scrollbar-thumb" });
												}), f(e, n);
											},
											$$slots: { default: !0 }
										});
									}), f(r, o);
								},
								$$slots: { default: !0 }
							});
						});
					}
					var h = v(l, 2), b = _(h);
					{
						let e = M(() => s()("customEmoji.search_placeholder"));
						c(b, () => Fe, (t, n) => {
							n(t, {
								class: "custom-emoji-search",
								get placeholder() {
									return y(e);
								},
								get value() {
									return y(P);
								},
								set value(e) {
									D(P, e, !0);
								}
							});
						});
					}
					var x = v(b, 2);
					{
						let t = M(() => s()("customEmoji.editor_toolbar"));
						c(x, () => He, (n, r) => {
							r(n, {
								class: "custom-emoji-editor-toolbar",
								orientation: "horizontal",
								loop: !1,
								get "aria-label"() {
									return y(t);
								},
								children: (t, n) => {
									var r = et(), i = E(r), a = _(i);
									{
										let e = M(() => s()("customEmoji.move_left"));
										c(a, () => We, (t, n) => {
											n(t, {
												class: "custom-emoji-editor-button left",
												get "aria-label"() {
													return y(e);
												},
												get onmousedown() {
													return H;
												},
												get ontouchstart() {
													return H;
												},
												onclick: wt,
												children: (e, t) => {
													var n = Xe();
													f(e, n);
												},
												$$slots: { default: !0 }
											});
										});
									}
									var o = v(a, 2);
									{
										let e = M(() => s()("customEmoji.move_right"));
										c(o, () => We, (t, n) => {
											n(t, {
												class: "custom-emoji-editor-button right",
												get "aria-label"() {
													return y(e);
												},
												get onmousedown() {
													return H;
												},
												get ontouchstart() {
													return H;
												},
												onclick: Tt,
												children: (e, t) => {
													var n = Ze();
													f(e, n);
												},
												$$slots: { default: !0 }
											});
										});
									}
									e(i);
									var l = v(i, 2), u = _(l);
									{
										let e = M(() => s()("customEmoji.insert_line_break"));
										c(u, () => We, (t, n) => {
											n(t, {
												class: "custom-emoji-editor-button line-break",
												get "aria-label"() {
													return y(e);
												},
												get onmousedown() {
													return H;
												},
												get ontouchstart() {
													return H;
												},
												onclick: Dt,
												children: (e, t) => {
													var n = Qe();
													f(e, n);
												},
												$$slots: { default: !0 }
											});
										});
									}
									var d = v(u, 2);
									{
										let e = M(() => s()("customEmoji.delete_backward"));
										c(d, () => We, (t, n) => {
											n(t, {
												class: "custom-emoji-editor-button delete",
												get "aria-label"() {
													return y(e);
												},
												get onmousedown() {
													return H;
												},
												get ontouchstart() {
													return H;
												},
												onclick: Et,
												children: (e, t) => {
													var n = $e();
													f(e, n);
												},
												$$slots: { default: !0 }
											});
										});
									}
									e(l), f(t, r);
								},
								$$slots: { default: !0 }
							});
						});
					}
					e(h), f(r, o);
				},
				$$slots: { default: !0 }
			});
		});
	}
	e(Q), b(Q, (e) => ge = e, () => ge), g((e, t) => {
		A(Q, "data-resizing", y(I)), n(Q, y(gt)), A($, "aria-label", e), A($, "aria-valuemin", 48), A($, "aria-valuenow", y(J)), A($, "aria-valuemax", t);
	}, [() => s()("customEmoji.resize"), () => bt()]), h("pointerdown", $, Ot), h("keydown", $, St), f(a, Q), r(), S();
}
o(["pointerdown", "keydown"]);
export { it as default };
