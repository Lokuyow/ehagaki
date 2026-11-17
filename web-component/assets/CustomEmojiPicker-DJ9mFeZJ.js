import { A as e, Et as t, G as n, I as r, J as i, K as a, Mt as o, N as s, Nt as c, P as l, Q as u, Tt as d, V as f, W as p, X as m, Y as h, Z as g, _, ct as v, dt as y, et as b, f as x, ft as S, gt as C, h as w, i as T, it as ee, jt as te, mt as ne, n as re, nt as E, o as ie, p as ae, pt as D, r as O, s as oe, st as k, ut as A, vt as j, w as M, xt as N, y as P, z as F } from "./index-client-XkLzkVYC.js";
import { x as se } from "./relayConfigUtils-B4Q_AO1M.js";
import { B as I, F as L, P as R, Q as z, et as B, j as ce, o as V, pt as le, st as H, t as ue } from "./LoadingPlaceholder-lit91akO.js";
import { t as U } from "./roving-focus-group-Dam_0Ov6.js";
import { a as de, c as fe, d as pe, i as me, l as he, n as ge, o as _e, r as ve, s as ye, t as be, u as W } from "./customEmojiStore.svelte-CAnJIIlI.js";
import { _ as xe, h as Se, n as Ce } from "./customEmoji-Nqrea9dO.js";
import { a as we, i as G, r as Te } from "./keyboardFocusUtils-EFYjXEKy.js";
import { a as Ee, r as De } from "./customEmojiUsage-AVeLEE1v.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/command/components/command-empty.svelte
var K = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"ref",
	"children",
	"child",
	"forceMount"
]), Oe = a("<div><!></div>");
function ke(e, r) {
	let a = i();
	t(r, !0);
	let s = O(r, "id", 19, () => V(a)), u = O(r, "ref", 15, null), f = O(r, "forceMount", 3, !1), m = T(r, K), h = he.create({
		id: H(() => s()),
		ref: H(() => u(), (e) => u(e)),
		forceMount: H(() => f())
	}), g = N(() => B(h.props, m));
	var v = n(), b = y(v), x = (e) => {
		var t = n(), i = y(t), a = (e) => {
			var t = n(), i = y(t);
			l(i, () => r.child, () => ({ props: E(g) })), p(e, t);
		}, s = (e) => {
			var t = Oe();
			_(t, () => ({ ...E(g) }));
			var n = A(t);
			l(n, () => r.children ?? c), o(t), p(e, t);
		};
		F(i, (e) => {
			r.child ? e(a) : e(s, -1);
		}), p(e, t);
	};
	F(b, (e) => {
		h.shouldRender && e(x);
	}), p(e, v), d();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/command/components/command-input.svelte
var Ae = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"value",
	"autofocus",
	"id",
	"ref",
	"child"
]), je = a("<input/>");
function Me(e, r) {
	let a = i();
	t(r, !0);
	let o = O(r, "value", 15, ""), s = O(r, "autofocus", 3, !1), c = O(r, "id", 19, () => V(a)), u = O(r, "ref", 15, null), f = T(r, Ae), m = W.create({
		id: H(() => c()),
		ref: H(() => u(), (e) => u(e)),
		value: H(() => o(), (e) => {
			o(e);
		}),
		autofocus: H(() => s() ?? !1)
	}), h = N(() => B(f, m.props));
	var g = n(), v = y(g), b = (e) => {
		var t = n(), i = y(t);
		l(i, () => r.child, () => ({ props: E(h) })), p(e, t);
	}, x = (e) => {
		var t = je();
		_(t, () => ({ ...E(h) }), void 0, void 0, void 0, void 0, !0), w(t, o), p(e, t);
	};
	F(v, (e) => {
		r.child ? e(b) : e(x, -1);
	}), p(e, g), d();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/command/components/command-loading.svelte
var Ne = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"progress",
	"id",
	"ref",
	"children",
	"child"
]), Pe = a("<div><!></div>");
function Fe(e, r) {
	let a = i();
	t(r, !0);
	let s = O(r, "progress", 3, 0), u = O(r, "id", 19, () => V(a)), f = O(r, "ref", 15, null), m = T(r, Ne), h = pe.create({
		id: H(() => u()),
		ref: H(() => f(), (e) => f(e)),
		progress: H(() => s())
	}), g = N(() => B(m, h.props));
	var v = n(), b = y(v), x = (e) => {
		var t = n(), i = y(t);
		l(i, () => r.child, () => ({ props: E(g) })), p(e, t);
	}, S = (e) => {
		var t = Pe();
		_(t, () => ({ ...E(g) }));
		var n = A(t);
		l(n, () => r.children ?? c), o(t), p(e, t);
	};
	F(b, (e) => {
		r.child ? e(x) : e(S, -1);
	}), p(e, v), d();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/toolbar/toolbar.svelte.js
var q = L({
	component: "toolbar",
	parts: [
		"root",
		"item",
		"group",
		"group-item",
		"link",
		"button"
	]
}), Ie = new z("Toolbar.Root");
new z("Toolbar.Group");
var Le = class e {
	static create(t) {
		return Ie.set(new e(t));
	}
	opts;
	rovingFocusGroup;
	attachment;
	constructor(e) {
		this.opts = e, this.attachment = I(this.opts.ref), this.rovingFocusGroup = new U({
			orientation: this.opts.orientation,
			loop: this.opts.loop,
			rootNode: this.opts.ref,
			candidateAttr: q.item,
			rootAttr: q.root
		});
	}
	#e = N(() => ({
		id: this.opts.id.current,
		role: "toolbar",
		"data-orientation": this.opts.orientation.current,
		[q.root]: "",
		...this.attachment
	}));
	get props() {
		return E(this.#e);
	}
	set props(e) {
		C(this.#e, e);
	}
}, Re = class e {
	static create(t) {
		return new e(t, Ie.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = I(this.opts.ref), v(() => {
			C(this.#e, this.root.rovingFocusGroup.getTabIndex(this.opts.ref.current), !0);
		}), this.onkeydown = this.onkeydown.bind(this);
	}
	onkeydown(e) {
		this.root.rovingFocusGroup.handleKeydown(this.opts.ref.current, e);
	}
	#e = j(0);
	#t = N(() => {
		if (this.opts.ref.current && this.opts.ref.current.tagName !== "BUTTON") return "button";
	});
	#n = N(() => ({
		id: this.opts.id.current,
		[q.item]: "",
		[q.button]: "",
		role: E(this.#t),
		tabindex: E(this.#e),
		"data-disabled": ce(this.opts.disabled.current),
		"data-orientation": this.root.opts.orientation.current,
		disabled: R(this.opts.disabled.current),
		onkeydown: this.onkeydown,
		...this.attachment
	}));
	get props() {
		return E(this.#n);
	}
	set props(e) {
		C(this.#n, e);
	}
}, ze = /* @__PURE__ */ new Set([
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
function Ve(e, r) {
	let a = i();
	t(r, !0);
	let s = O(r, "ref", 15, null), u = O(r, "id", 19, () => V(a)), f = O(r, "orientation", 3, "horizontal"), m = O(r, "loop", 3, !0), h = T(r, ze), g = Le.create({
		id: H(() => u()),
		orientation: H(() => f()),
		loop: H(() => m()),
		ref: H(() => s(), (e) => s(e))
	}), v = N(() => B(h, g.props));
	var b = n(), x = y(b), S = (e) => {
		var t = n(), i = y(t);
		l(i, () => r.child, () => ({ props: E(v) })), p(e, t);
	}, C = (e) => {
		var t = Be();
		_(t, () => ({ ...E(v) }));
		var n = A(t);
		l(n, () => r.children ?? c), o(t), p(e, t);
	};
	F(x, (e) => {
		r.child ? e(S) : e(C, -1);
	}), p(e, b), d();
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
function Ue(e, r) {
	let a = i();
	t(r, !0);
	let s = O(r, "disabled", 3, !1), u = O(r, "type", 3, "button"), f = O(r, "id", 19, () => V(a)), m = O(r, "ref", 15, null), h = T(r, J), g = Re.create({
		id: H(() => f()),
		disabled: H(() => s() ?? !1),
		ref: H(() => m(), (e) => m(e))
	}), v = N(() => B(h, g.props, { type: u() }));
	var b = n(), x = y(b), S = (e) => {
		var t = n(), i = y(t);
		l(i, () => r.child, () => ({ props: E(v) })), p(e, t);
	}, C = (e) => {
		var t = He();
		_(t, () => ({ ...E(v) }));
		var n = A(t);
		l(n, () => r.children ?? c), o(t), p(e, t);
	};
	F(x, (e) => {
		r.child ? e(S) : e(C, -1);
	}), p(e, b), d();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/CustomEmojiPicker.svelte
var We = a("<img class=\"emoji-image svelte-u7m8y9\" draggable=\"false\" loading=\"lazy\" decoding=\"async\"/>"), Ge = a("<div class=\"svelte-u7m8y9\"><section class=\"custom-emoji-usage-section svelte-u7m8y9\"><div class=\"custom-emoji-usage-title svelte-u7m8y9\"> </div> <div class=\"custom-emoji-usage-grid svelte-u7m8y9\"></div></section> <section class=\"custom-emoji-usage-section svelte-u7m8y9\"><div class=\"custom-emoji-usage-title svelte-u7m8y9\"> </div> <div class=\"custom-emoji-usage-grid svelte-u7m8y9\"></div></section></div>"), Ke = a("<div class=\"svelte-u7m8y9\"></div>"), qe = a("<!> <div class=\"emoji-virtual-list svelte-u7m8y9\"><div class=\"emoji-grid svelte-u7m8y9\"></div></div>", 1), Je = a("<!> <!>", 1), Ye = a("<span class=\"caret-left-icon svg-icon svelte-u7m8y9\"></span>"), Xe = a("<span class=\"caret-right-icon svg-icon svelte-u7m8y9\"></span>"), Ze = a("<span class=\"enter-key-icon svg-icon svelte-u7m8y9\"></span>"), Qe = a("<span class=\"delete-left-icon svg-icon svelte-u7m8y9\"></span>"), $e = a("<div class=\"arrow-keys svelte-u7m8y9\"><!> <!></div> <div class=\"line-break-delete svelte-u7m8y9\"><!> <!></div>", 1), et = a("<!> <div class=\"custom-emoji-search-row svelte-u7m8y9\"><!> <!></div>", 1), tt = a("<div class=\"custom-emoji-picker svelte-u7m8y9\"><div class=\"resize-handle svelte-u7m8y9\" role=\"separator\" tabindex=\"0\" aria-orientation=\"horizontal\"></div> <!></div>"), nt = {
	hash: "svelte-u7m8y9",
	code: ".custom-emoji-picker.svelte-u7m8y9 {width:100%;max-width:800px;background:var(--dialog-bg);color:var(--text);overflow:hidden;position:relative;z-index:99;}.resize-handle.svelte-u7m8y9 {width:100%;height:var(--custom-emoji-picker-resize-handle-height);margin-bottom:calc(\n            var(--custom-emoji-picker-resize-handle-overlap) * -1\n        );cursor:ns-resize;touch-action:none;position:relative;z-index:1;background:transparent;}.resize-handle.svelte-u7m8y9::before {content:\"\";position:absolute;inset:0 0 auto 0;height:12px;background:var(--bg-buttonbar);}.resize-handle.svelte-u7m8y9::after {content:\"\";position:absolute;left:50%;top:6px;width:38px;height:4px;border-radius:999px;translate:-50% -50%;background:var(--border);}.custom-emoji-command {display:flex;flex-direction:column;}.custom-emoji-search-row.svelte-u7m8y9 {display:flex;align-items:center;width:100%;min-height:var(--custom-emoji-picker-search-row-height);border-top:1px solid var(--border);background:var(--input-bg, var(--dialog-bg));}.custom-emoji-search {flex:1 1 auto;min-width:0;width:100%;height:var(--custom-emoji-picker-search-row-height);padding:0 8px;border:0;background:transparent;color:var(--text);font-size:1rem;outline:none;}.custom-emoji-editor-toolbar {display:flex;align-items:center;flex:0 0 auto;height:var(--custom-emoji-picker-search-row-height);gap:2px;.arrow-keys.svelte-u7m8y9 {display:flex;align-items:center;height:100%;gap:2px;}.line-break-delete.svelte-u7m8y9 {display:flex;align-items:center;height:100%;gap:2px;.line-break {width:62px;}.delete {width:62px;}}}.custom-emoji-editor-button {display:flex;align-items:center;justify-content:center;width:50px;height:100%;padding:0;color:var(--text);background-color:var(--btn-bg);touch-action:manipulation;\n\n        @media (hover: hover) and (pointer: fine) {&:hover {background:var(--btn-bg);}\n        }}.custom-emoji-editor-button:active {scale:0.94;}.custom-emoji-editor-button .svg-icon {width:34px;height:34px;background-color:var(--svg, currentColor);mask-repeat:no-repeat;mask-position:center;mask-size:contain;}.caret-left-icon.svelte-u7m8y9 {mask-image:var(--ehagaki-icon-6172726f775f6c6566745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.caret-right-icon.svelte-u7m8y9 {mask-image:var(--ehagaki-icon-6172726f775f72696768745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.delete-left-icon.svelte-u7m8y9 {mask-image:var(--ehagaki-icon-6261636b73706163655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.enter-key-icon.svelte-u7m8y9 {mask-image:var(--ehagaki-icon-6b6579626f6172645f72657475726e5f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.custom-emoji-scroll-root,\n    .custom-emoji-scroll-viewport {width:100%;}.custom-emoji-scroll-root {overflow:hidden;}.custom-emoji-scroll-viewport {height:100%;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;}.custom-emoji-list {min-height:100%;}.emoji-virtual-list.svelte-u7m8y9 {position:relative;width:100%;}.emoji-grid.svelte-u7m8y9 {position:absolute;inset:4px 4px auto 4px;display:grid;justify-items:center;}.custom-emoji-usage-section.svelte-u7m8y9 {padding:4px;border-bottom:1px solid var(--border);}.custom-emoji-usage-title.svelte-u7m8y9 {padding:0 6px 2px;color:var(--text-muted, var(--text));font-size:0.78rem;font-weight:700;}.custom-emoji-usage-grid.svelte-u7m8y9 {display:grid;grid-auto-rows:40px;justify-items:center;}.emoji-item {display:flex;align-items:center;justify-content:center;width:100%;height:100%;cursor:pointer;outline:none;}.emoji-item[data-highlighted] {background:var(--btn-hover-bg);}\n\n    @media (hover: hover) and (pointer: fine) {.emoji-item:hover {background:var(--btn-hover-bg);}\n    }.emoji-image.svelte-u7m8y9 {width:32px;height:32px;object-fit:contain;user-select:none;-webkit-user-drag:none;}.custom-emoji-message {padding:18px 12px;text-align:center;color:var(--text-muted, var(--text));font-size:0.9rem;}.custom-emoji-loading {min-height:96px;.placeholder-text.loading-text {font-size:1rem;}}.scrollbar {display:flex;width:8px;padding:1px;background:transparent;}.scrollbar-thumb {flex:1;border-radius:999px;background:var(--border);}"
};
function rt(i, a) {
	t(a, !0), e(i, nt);
	let c = () => oe(le, "$_", l), [l, m] = ie(), _ = se(), w = O(a, "open", 3, !1), T = O(a, "maxHeight", 3, null), I = O(a, "customEmojiUsageItems", 19, () => []), L = j(""), R = j(ne(240)), z = j(!1), B = j(!1), ce = j(0), V = j(800), H = null, U = null, pe = null, he = j(0), W, K, Oe = !1, Ae, je, Ne = !1, Pe, q, Ie = /* @__PURE__ */ new Set(), Le = N(() => a.hostCustomEmojiItems ?? be.items), Re = N(() => a.hostCustomEmojiItems === void 0 && be.loading), ze = N(() => {
		let e = E(L).trim().toLowerCase();
		return e ? E(Le).filter((t) => t.shortcodeLower.includes(e)) : E(Le);
	}), Be = N(() => E(L).trim().length === 0 && I().length > 0), J = N(() => Math.max(1, Math.floor(E(V) / 40))), He = N(() => De(E(J))), rt = N(() => I().slice(0, E(He))), it = N(() => [...I()].sort(Ee).slice(0, E(He))), at = N(() => Math.ceil(E(ze).length / E(J))), Y = N(() => Math.max(48, E(R))), ot = N(() => Math.ceil(E(Y) / 40) + 6), st = N(() => Math.max(0, Math.min(Math.max(0, E(at) - E(ot)), Math.floor(Math.max(0, E(ce) - E(he)) / 40) - 3))), ct = N(() => Math.min(E(at), E(st) + E(ot))), lt = N(() => E(st) * E(J)), ut = N(() => Math.min(E(ze).length, E(ct) * E(J))), dt = N(() => E(ze).slice(E(lt), E(ut))), ft = N(() => E(at) * 40 + 8), pt = N(() => E(st) * 40), mt = N(() => Number.isFinite(T()) ? Math.max(48, Math.floor(T())) : void 0), X = N(() => E(mt) === void 0 ? void 0 : E(mt)), ht = N(() => "--custom-emoji-picker-resize-handle-height: 30px; --custom-emoji-picker-resize-handle-overlap: 16px; --custom-emoji-picker-search-row-height: 40px;");
	function gt() {
		let e = window.visualViewport?.width ?? window.innerWidth ?? 800;
		C(V, Math.min(800, Math.max(1, e)), !0);
	}
	function _t(e) {
		a.hostCustomEmojiItems === void 0 && (Ie.has(e) || (Ie.add(e), Ce([e])));
	}
	function vt() {
		let e = window.visualViewport?.height ?? 0, t = we();
		return Math.max(window.innerHeight || 0, e + t, e, 800);
	}
	function yt() {
		gt();
	}
	function bt() {
		if (typeof window > "u") return 48;
		let e = vt(), t = Math.floor(e * .6);
		return Math.max(48, E(X) === void 0 ? t : E(X));
	}
	function xt(e) {
		C(R, xe(_, e, vt(), E(X)), !0);
	}
	function St(e) {
		e.key === "ArrowUp" ? (e.preventDefault(), xt(E(Y) + 24)) : e.key === "ArrowDown" && (e.preventDefault(), xt(E(Y) - 24));
	}
	function Z() {
		U !== null && cancelAnimationFrame(U), U = requestAnimationFrame(() => {
			U = null, yt();
		});
	}
	re(() => (C(R, Se(_, vt(), E(X)), !0), yt(), window.addEventListener("resize", Z), window.visualViewport?.addEventListener("resize", Z), window.visualViewport?.addEventListener("scroll", Z), () => {
		U !== null && (cancelAnimationFrame(U), U = null), window.removeEventListener("resize", Z), window.visualViewport?.removeEventListener("resize", Z), window.visualViewport?.removeEventListener("scroll", Z);
	})), v(() => {
		let e = w(), t = a.rxNostr, n = a.pubkey;
		a.hostCustomEmojiItems === void 0 ? e ? ((t !== W || n !== K) && (W = t, K = n, ee(() => be.load({
			rxNostr: t,
			pubkey: n
		}))), Z()) : (W = void 0, K = void 0) : (W = void 0, K = void 0, e && Z());
	}), v(() => {
		let e = w() && (!Oe || a.rxNostr !== Ae || a.pubkey !== je);
		if (Oe = w(), Ae = a.rxNostr, je = a.pubkey, H !== null && (cancelAnimationFrame(H), H = null), !w() || !e) w() || C(B, !1);
		else return C(B, !1), H = requestAnimationFrame(() => {
			H = null, C(B, !0);
		}), () => {
			H !== null && (cancelAnimationFrame(H), H = null);
		};
	}), v(() => {
		let e = w() && (!Ne || E(L) !== Pe || a.pubkey !== q);
		Ne = w(), Pe = E(L), q = a.pubkey, e && (C(ce, 0), pe?.querySelector(".custom-emoji-scroll-viewport")?.scrollTo({ top: 0 }));
	}), v(() => {
		E(X), C(R, Se(_, vt(), E(X)), !0);
	});
	function Ct(e) {
		a.onSelect?.(e);
	}
	function wt() {
		a.onMoveCaretLeft?.();
	}
	function Tt() {
		a.onMoveCaretRight?.();
	}
	function Et() {
		a.onDeleteBackward?.();
	}
	function Dt() {
		a.onInsertLineBreak?.();
	}
	function Ot(e) {
		e.preventDefault(), yt();
		let t = e.clientY, n = E(Y);
		C(z, !0);
		let r = (e) => {
			e.preventDefault(), xt(n + (t - e.clientY));
		}, i = () => {
			C(z, !1), window.removeEventListener("pointermove", r), window.removeEventListener("pointerup", i), window.removeEventListener("pointercancel", i);
		};
		window.addEventListener("pointermove", r), window.addEventListener("pointerup", i), window.addEventListener("pointercancel", i);
	}
	function kt(e) {
		C(ce, e.currentTarget.scrollTop, !0);
	}
	var Q = tt(), $ = A(Q), At = D($, 2);
	{
		let e = N(() => c()("customEmoji.search_label"));
		s(At, () => fe, (t, i) => {
			i(t, {
				class: "custom-emoji-command",
				get label() {
					return E(e);
				},
				shouldFilter: !1,
				loop: !0,
				children: (e, t) => {
					var i = et(), a = y(i);
					{
						let e = N(() => `height: ${E(Y)}px;`);
						s(a, () => de, (t, i) => {
							i(t, {
								type: "auto",
								class: "custom-emoji-scroll-root",
								get style() {
									return E(e);
								},
								children: (e, t) => {
									var i = Je(), a = y(i);
									s(a, () => me, (e, t) => {
										t(e, {
											class: "custom-emoji-scroll-viewport",
											onscroll: kt,
											children: (e, t) => {
												var i = n(), a = y(i);
												s(a, () => _e, (e, t) => {
													t(e, {
														class: "custom-emoji-list",
														children: (e, t) => {
															var i = n(), a = y(i), l = (e) => {
																var t = n(), r = y(t);
																s(r, () => Fe, (e, t) => {
																	t(e, {
																		class: "custom-emoji-message",
																		children: (e, t) => {
																			{
																				let t = N(() => c()("customEmoji.loading"));
																				ue(e, {
																					showLoader: !0,
																					get text() {
																						return E(t);
																					},
																					customClass: "custom-emoji-loading"
																				});
																			}
																		},
																		$$slots: { default: !0 }
																	});
																}), p(e, t);
															}, d = (e) => {
																var t = n(), r = y(t);
																s(r, () => ke, (e, t) => {
																	t(e, {
																		class: "custom-emoji-message",
																		children: (e, t) => {
																			te();
																			var n = h();
																			k((e) => f(n, e), [() => c()("customEmoji.empty")]), p(e, n);
																		},
																		$$slots: { default: !0 }
																	});
																}), p(e, t);
															}, m = (e) => {
																var t = qe(), i = y(t), a = (e) => {
																	var t = Ge(), i = A(t), a = A(i), l = S(a, !0), d = D(a, 2);
																	r(d, 21, () => E(rt), (e) => e.identityKey, (e, t) => {
																		var r = n(), i = y(r);
																		{
																			let e = N(() => `recent:${E(t).identityKey}`), n = N(() => [E(t).shortcode]);
																			s(i, () => ye, (r, i) => {
																				i(r, {
																					get value() {
																						return E(e);
																					},
																					get keywords() {
																						return E(n);
																					},
																					class: "emoji-item custom-emoji-usage-item",
																					onSelect: () => Ct(E(t)),
																					get onmousedown() {
																						return G;
																					},
																					get ontouchstart() {
																						return Te;
																					},
																					children: (e, n) => {
																						var r = We();
																						k(() => {
																							P(r, "src", E(t).src), P(r, "alt", `:${E(t).shortcode}:`), P(r, "title", `:${E(t).shortcode}:`);
																						}), u("load", r, () => _t(E(t).src)), b(r), p(e, r);
																					},
																					$$slots: { default: !0 }
																				});
																			});
																		}
																		p(e, r);
																	}), o(d), o(i);
																	var m = D(i, 2), h = A(m), g = S(h, !0), _ = D(h, 2);
																	r(_, 21, () => E(it), (e) => e.identityKey, (e, t) => {
																		var r = n(), i = y(r);
																		{
																			let e = N(() => `frequent:${E(t).identityKey}`), n = N(() => [E(t).shortcode]);
																			s(i, () => ye, (r, i) => {
																				i(r, {
																					get value() {
																						return E(e);
																					},
																					get keywords() {
																						return E(n);
																					},
																					class: "emoji-item custom-emoji-usage-item",
																					onSelect: () => Ct(E(t)),
																					get onmousedown() {
																						return G;
																					},
																					get ontouchstart() {
																						return Te;
																					},
																					children: (e, n) => {
																						var r = We();
																						k(() => {
																							P(r, "src", E(t).src), P(r, "alt", `:${E(t).shortcode}:`), P(r, "title", `:${E(t).shortcode}:`);
																						}), u("load", r, () => _t(E(t).src)), b(r), p(e, r);
																					},
																					$$slots: { default: !0 }
																				});
																			});
																		}
																		p(e, r);
																	}), o(_), o(m), o(t), k((e, t, n, r) => {
																		P(i, "aria-label", e), f(l, t), M(d, `grid-template-columns: repeat(${E(J)}, minmax(0, 1fr));`), P(m, "aria-label", n), f(g, r), M(_, `grid-template-columns: repeat(${E(J)}, minmax(0, 1fr));`);
																	}, [
																		() => c()("customEmoji.recent"),
																		() => c()("customEmoji.recent"),
																		() => c()("customEmoji.frequent"),
																		() => c()("customEmoji.frequent")
																	]), ae(t, "clientHeight", (e) => C(he, e)), p(e, t);
																}, l = (e) => {
																	var t = Ke();
																	ae(t, "clientHeight", (e) => C(he, e)), p(e, t);
																};
																F(i, (e) => {
																	E(Be) ? e(a) : e(l, -1);
																});
																var d = D(i, 2), m = A(d);
																r(m, 21, () => E(dt), (e) => e.identityKey, (e, t) => {
																	var r = n(), i = y(r);
																	{
																		let e = N(() => [E(t).shortcode]);
																		s(i, () => ye, (n, r) => {
																			r(n, {
																				get value() {
																					return E(t).identityKey;
																				},
																				get keywords() {
																					return E(e);
																				},
																				class: "emoji-item",
																				onSelect: () => Ct(E(t)),
																				get onmousedown() {
																					return G;
																				},
																				get ontouchstart() {
																					return Te;
																				},
																				children: (e, n) => {
																					var r = We();
																					k(() => {
																						P(r, "src", E(t).src), P(r, "alt", `:${E(t).shortcode}:`), P(r, "title", `:${E(t).shortcode}:`);
																					}), u("load", r, () => _t(E(t).src)), b(r), p(e, r);
																				},
																				$$slots: { default: !0 }
																			});
																		});
																	}
																	p(e, r);
																}), o(m), o(d), k(() => {
																	M(d, `height: ${E(ft)}px;`), M(m, `transform: translateY(${E(pt)}px); grid-template-columns: repeat(${E(J)}, minmax(0, 1fr)); grid-auto-rows: 40px;`);
																}), p(e, t);
															};
															F(a, (e) => {
																E(Re) || !E(B) ? e(l) : E(ze).length === 0 && !E(Be) ? e(d, 1) : e(m, -1);
															}), p(e, i);
														},
														$$slots: { default: !0 }
													});
												}), p(e, i);
											},
											$$slots: { default: !0 }
										});
									});
									var l = D(a, 2);
									s(l, () => ve, (e, t) => {
										t(e, {
											orientation: "vertical",
											class: "scrollbar",
											children: (e, t) => {
												var r = n(), i = y(r);
												s(i, () => ge, (e, t) => {
													t(e, { class: "scrollbar-thumb" });
												}), p(e, r);
											},
											$$slots: { default: !0 }
										});
									}), p(e, i);
								},
								$$slots: { default: !0 }
							});
						});
					}
					var l = D(a, 2), d = A(l);
					{
						let e = N(() => c()("customEmoji.search_placeholder"));
						s(d, () => Me, (t, n) => {
							n(t, {
								class: "custom-emoji-search",
								get placeholder() {
									return E(e);
								},
								get value() {
									return E(L);
								},
								set value(e) {
									C(L, e, !0);
								}
							});
						});
					}
					var m = D(d, 2);
					{
						let e = N(() => c()("customEmoji.editor_toolbar"));
						s(m, () => Ve, (t, n) => {
							n(t, {
								class: "custom-emoji-editor-toolbar",
								orientation: "horizontal",
								loop: !1,
								get "aria-label"() {
									return E(e);
								},
								children: (e, t) => {
									var n = $e(), r = y(n), i = A(r);
									{
										let e = N(() => c()("customEmoji.move_left"));
										s(i, () => Ue, (t, n) => {
											n(t, {
												class: "custom-emoji-editor-button left",
												get "aria-label"() {
													return E(e);
												},
												get onmousedown() {
													return G;
												},
												get ontouchstart() {
													return G;
												},
												onclick: wt,
												children: (e, t) => {
													var n = Ye();
													p(e, n);
												},
												$$slots: { default: !0 }
											});
										});
									}
									var a = D(i, 2);
									{
										let e = N(() => c()("customEmoji.move_right"));
										s(a, () => Ue, (t, n) => {
											n(t, {
												class: "custom-emoji-editor-button right",
												get "aria-label"() {
													return E(e);
												},
												get onmousedown() {
													return G;
												},
												get ontouchstart() {
													return G;
												},
												onclick: Tt,
												children: (e, t) => {
													var n = Xe();
													p(e, n);
												},
												$$slots: { default: !0 }
											});
										});
									}
									o(r);
									var l = D(r, 2), u = A(l);
									{
										let e = N(() => c()("customEmoji.insert_line_break"));
										s(u, () => Ue, (t, n) => {
											n(t, {
												class: "custom-emoji-editor-button line-break",
												get "aria-label"() {
													return E(e);
												},
												get onmousedown() {
													return G;
												},
												get ontouchstart() {
													return G;
												},
												onclick: Dt,
												children: (e, t) => {
													var n = Ze();
													p(e, n);
												},
												$$slots: { default: !0 }
											});
										});
									}
									var d = D(u, 2);
									{
										let e = N(() => c()("customEmoji.delete_backward"));
										s(d, () => Ue, (t, n) => {
											n(t, {
												class: "custom-emoji-editor-button delete",
												get "aria-label"() {
													return E(e);
												},
												get onmousedown() {
													return G;
												},
												get ontouchstart() {
													return G;
												},
												onclick: Et,
												children: (e, t) => {
													var n = Qe();
													p(e, n);
												},
												$$slots: { default: !0 }
											});
										});
									}
									o(l), p(e, n);
								},
								$$slots: { default: !0 }
							});
						});
					}
					o(l), p(e, i);
				},
				$$slots: { default: !0 }
			});
		});
	}
	o(Q), x(Q, (e) => pe = e, () => pe), k((e, t) => {
		P(Q, "data-resizing", E(z)), M(Q, E(ht)), P($, "aria-label", e), P($, "aria-valuemin", 48), P($, "aria-valuenow", E(Y)), P($, "aria-valuemax", t);
	}, [() => c()("customEmoji.resize"), () => bt()]), g("pointerdown", $, Ot), g("keydown", $, St), p(i, Q), d(), m();
}
m(["pointerdown", "keydown"]);
export { rt as default };
