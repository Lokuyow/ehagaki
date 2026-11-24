import { $ as e, B as t, Dt as n, Et as r, F as i, G as a, H as o, K as s, L as c, Mt as l, Nt as u, P as d, Pt as f, Q as p, St as m, T as h, X as g, Y as _, Z as v, _t as y, at as b, b as x, ct as S, dt as C, f as ee, ft as w, h as te, ht as ne, i as T, j as re, lt as E, mt as D, n as ie, o as ae, p as oe, pt as se, q as O, r as k, rt as A, s as ce, tt as le, v as j, yt as M } from "./index-client-DEFG3Gqk.js";
import { a as ue } from "./appRuntimeEnvironment-Bzv9wJOh.js";
import { F as N, G as P, R as F, T as I, Z as de, b as L, g as R, r as z, t as fe, y as B } from "./LoadingPlaceholder-YrD8D_td.js";
import { t as V } from "./roving-focus-group-DTahsFoe.js";
import { a as pe, c as me, d as H, i as he, l as ge, n as _e, o as ve, r as ye, s as be, t as xe, u as U } from "./customEmojiStore.svelte-C42g6-3J.js";
import { _ as Se, h as Ce, n as we } from "./customEmoji-C4nd4cTR.js";
import { a as Te, i as W, r as Ee } from "./keyboardFocusUtils-BhXq7KwV.js";
import { a as De, r as Oe } from "./customEmojiUsage-B3xpeqbM.js";
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
]), ke = O("<div><!></div>");
function Ae(e, o) {
	let c = _();
	n(o, !0);
	let l = k(o, "id", 19, () => z(c)), d = k(o, "ref", 15, null), p = k(o, "forceMount", 3, !1), h = T(o, G), g = ge.create({
		id: P(() => l()),
		ref: P(() => d(), (e) => d(e)),
		forceMount: P(() => p())
	}), v = m(() => F(g.props, h));
	var y = s(), b = w(y), x = (e) => {
		var n = s(), r = w(n), c = (e) => {
			var t = s(), n = w(t);
			i(n, () => o.child, () => ({ props: A(v) })), a(e, t);
		}, l = (e) => {
			var t = ke();
			j(t, () => ({ ...A(v) }));
			var n = C(t);
			i(n, () => o.children ?? f), u(t), a(e, t);
		};
		t(r, (e) => {
			o.child ? e(c) : e(l, -1);
		}), a(e, n);
	};
	t(b, (e) => {
		g.shouldRender && e(x);
	}), a(e, y), r();
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
]), Me = O("<input/>");
function Ne(e, o) {
	let c = _();
	n(o, !0);
	let l = k(o, "value", 15, ""), u = k(o, "autofocus", 3, !1), d = k(o, "id", 19, () => z(c)), f = k(o, "ref", 15, null), p = T(o, je), h = U.create({
		id: P(() => d()),
		ref: P(() => f(), (e) => f(e)),
		value: P(() => l(), (e) => {
			l(e);
		}),
		autofocus: P(() => u() ?? !1)
	}), g = m(() => F(p, h.props));
	var v = s(), y = w(v), b = (e) => {
		var t = s(), n = w(t);
		i(n, () => o.child, () => ({ props: A(g) })), a(e, t);
	}, x = (e) => {
		var t = Me();
		j(t, () => ({ ...A(g) }), void 0, void 0, void 0, void 0, !0), te(t, l), a(e, t);
	};
	t(y, (e) => {
		o.child ? e(b) : e(x, -1);
	}), a(e, v), r();
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
]), Fe = O("<div><!></div>");
function Ie(e, o) {
	let c = _();
	n(o, !0);
	let l = k(o, "progress", 3, 0), d = k(o, "id", 19, () => z(c)), p = k(o, "ref", 15, null), h = T(o, Pe), g = H.create({
		id: P(() => d()),
		ref: P(() => p(), (e) => p(e)),
		progress: P(() => l())
	}), v = m(() => F(h, g.props));
	var y = s(), b = w(y), x = (e) => {
		var t = s(), n = w(t);
		i(n, () => o.child, () => ({ props: A(v) })), a(e, t);
	}, S = (e) => {
		var t = Fe();
		j(t, () => ({ ...A(v) }));
		var n = C(t);
		i(n, () => o.children ?? f), u(t), a(e, t);
	};
	t(b, (e) => {
		o.child ? e(x) : e(S, -1);
	}), a(e, y), r();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/toolbar/toolbar.svelte.js
var K = L({
	component: "toolbar",
	parts: [
		"root",
		"item",
		"group",
		"group-item",
		"link",
		"button"
	]
}), Le = new N("Toolbar.Root");
new N("Toolbar.Group");
var Re = class e {
	static create(t) {
		return Le.set(new e(t));
	}
	opts;
	rovingFocusGroup;
	attachment;
	constructor(e) {
		this.opts = e, this.attachment = I(this.opts.ref), this.rovingFocusGroup = new V({
			orientation: this.opts.orientation,
			loop: this.opts.loop,
			rootNode: this.opts.ref,
			candidateAttr: K.item,
			rootAttr: K.root
		});
	}
	#e = m(() => ({
		id: this.opts.id.current,
		role: "toolbar",
		"data-orientation": this.opts.orientation.current,
		[K.root]: "",
		...this.attachment
	}));
	get props() {
		return A(this.#e);
	}
	set props(e) {
		y(this.#e, e);
	}
}, ze = class e {
	static create(t) {
		return new e(t, Le.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = I(this.opts.ref), E(() => {
			y(this.#e, this.root.rovingFocusGroup.getTabIndex(this.opts.ref.current), !0);
		}), this.onkeydown = this.onkeydown.bind(this);
	}
	onkeydown(e) {
		this.root.rovingFocusGroup.handleKeydown(this.opts.ref.current, e);
	}
	#e = M(0);
	#t = m(() => {
		if (this.opts.ref.current && this.opts.ref.current.tagName !== "BUTTON") return "button";
	});
	#n = m(() => ({
		id: this.opts.id.current,
		[K.item]: "",
		[K.button]: "",
		role: A(this.#t),
		tabindex: A(this.#e),
		"data-disabled": R(this.opts.disabled.current),
		"data-orientation": this.root.opts.orientation.current,
		disabled: B(this.opts.disabled.current),
		onkeydown: this.onkeydown,
		...this.attachment
	}));
	get props() {
		return A(this.#n);
	}
	set props(e) {
		y(this.#n, e);
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
]), Be = O("<div><!></div>");
function Ve(e, o) {
	let c = _();
	n(o, !0);
	let l = k(o, "ref", 15, null), d = k(o, "id", 19, () => z(c)), p = k(o, "orientation", 3, "horizontal"), h = k(o, "loop", 3, !0), g = T(o, q), v = Re.create({
		id: P(() => d()),
		orientation: P(() => p()),
		loop: P(() => h()),
		ref: P(() => l(), (e) => l(e))
	}), y = m(() => F(g, v.props));
	var b = s(), x = w(b), S = (e) => {
		var t = s(), n = w(t);
		i(n, () => o.child, () => ({ props: A(y) })), a(e, t);
	}, ee = (e) => {
		var t = Be();
		j(t, () => ({ ...A(y) }));
		var n = C(t);
		i(n, () => o.children ?? f), u(t), a(e, t);
	};
	t(x, (e) => {
		o.child ? e(S) : e(ee, -1);
	}), a(e, b), r();
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
]), He = O("<button><!></button>");
function Ue(e, o) {
	let c = _();
	n(o, !0);
	let l = k(o, "disabled", 3, !1), d = k(o, "type", 3, "button"), p = k(o, "id", 19, () => z(c)), h = k(o, "ref", 15, null), g = T(o, J), v = ze.create({
		id: P(() => p()),
		disabled: P(() => l() ?? !1),
		ref: P(() => h(), (e) => h(e))
	}), y = m(() => F(g, v.props, { type: d() }));
	var b = s(), x = w(b), S = (e) => {
		var t = s(), n = w(t);
		i(n, () => o.child, () => ({ props: A(y) })), a(e, t);
	}, ee = (e) => {
		var t = He();
		j(t, () => ({ ...A(y) }));
		var n = C(t);
		i(n, () => o.children ?? f), u(t), a(e, t);
	};
	t(x, (e) => {
		o.child ? e(S) : e(ee, -1);
	}), a(e, b), r();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/CustomEmojiPicker.svelte
var We = O("<img class=\"emoji-image svelte-u7m8y9\" draggable=\"false\" loading=\"lazy\" decoding=\"async\"/>"), Ge = O("<div class=\"svelte-u7m8y9\"><section class=\"custom-emoji-usage-section svelte-u7m8y9\"><div class=\"custom-emoji-usage-title svelte-u7m8y9\"> </div> <div class=\"custom-emoji-usage-grid svelte-u7m8y9\"></div></section> <section class=\"custom-emoji-usage-section svelte-u7m8y9\"><div class=\"custom-emoji-usage-title svelte-u7m8y9\"> </div> <div class=\"custom-emoji-usage-grid svelte-u7m8y9\"></div></section></div>"), Ke = O("<div class=\"svelte-u7m8y9\"></div>"), qe = O("<!> <div class=\"emoji-virtual-list svelte-u7m8y9\"><div class=\"emoji-grid svelte-u7m8y9\"></div></div>", 1), Je = O("<!> <!>", 1), Ye = O("<span class=\"caret-left-icon svg-icon svelte-u7m8y9\"></span>"), Xe = O("<span class=\"caret-right-icon svg-icon svelte-u7m8y9\"></span>"), Ze = O("<span class=\"enter-key-icon svg-icon svelte-u7m8y9\"></span>"), Qe = O("<span class=\"delete-left-icon svg-icon svelte-u7m8y9\"></span>"), $e = O("<div class=\"arrow-keys svelte-u7m8y9\"><!> <!></div> <div class=\"line-break-delete svelte-u7m8y9\"><!> <!></div>", 1), et = O("<!> <div class=\"custom-emoji-search-row svelte-u7m8y9\"><!> <!></div>", 1), tt = O("<div class=\"custom-emoji-picker svelte-u7m8y9\"><div class=\"resize-handle svelte-u7m8y9\" role=\"separator\" tabindex=\"0\" aria-orientation=\"horizontal\"></div> <!></div>"), nt = {
	hash: "svelte-u7m8y9",
	code: ".custom-emoji-picker.svelte-u7m8y9 {width:100%;max-width:800px;background:var(--dialog-bg);color:var(--text);overflow:hidden;position:relative;z-index:99;}.resize-handle.svelte-u7m8y9 {width:100%;height:var(--custom-emoji-picker-resize-handle-height);margin-bottom:calc(\n            var(--custom-emoji-picker-resize-handle-overlap) * -1\n        );cursor:ns-resize;touch-action:none;position:relative;z-index:1;background:transparent;}.resize-handle.svelte-u7m8y9::before {content:\"\";position:absolute;inset:0 0 auto 0;height:12px;background:var(--bg-buttonbar);}.resize-handle.svelte-u7m8y9::after {content:\"\";position:absolute;left:50%;top:6px;width:38px;height:4px;border-radius:999px;translate:-50% -50%;background:var(--border);}.custom-emoji-command {display:flex;flex-direction:column;}.custom-emoji-search-row.svelte-u7m8y9 {display:flex;align-items:center;width:100%;min-height:var(--custom-emoji-picker-search-row-height);border-top:1px solid var(--border);background:var(--input-bg, var(--dialog-bg));}.custom-emoji-search {flex:1 1 auto;min-width:0;width:100%;height:var(--custom-emoji-picker-search-row-height);padding:0 8px;border:0;background:transparent;color:var(--text);font-size:1rem;outline:none;}.custom-emoji-editor-toolbar {display:flex;align-items:center;flex:0 0 auto;height:var(--custom-emoji-picker-search-row-height);gap:2px;.arrow-keys.svelte-u7m8y9 {display:flex;align-items:center;height:100%;gap:2px;}.line-break-delete.svelte-u7m8y9 {display:flex;align-items:center;height:100%;gap:2px;.line-break {width:62px;}.delete {width:62px;}}}.custom-emoji-editor-button {display:flex;align-items:center;justify-content:center;width:50px;height:100%;padding:0;color:var(--text);background-color:var(--btn-bg);touch-action:manipulation;\n\n        @media (hover: hover) and (pointer: fine) {&:hover {background:var(--btn-bg);}\n        }}.custom-emoji-editor-button:active {scale:0.94;}.custom-emoji-editor-button .svg-icon {width:34px;height:34px;background-color:var(--svg, currentColor);mask-repeat:no-repeat;mask-position:center;mask-size:contain;}.caret-left-icon.svelte-u7m8y9 {mask-image:var(--ehagaki-icon-6172726f775f6c6566745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.caret-right-icon.svelte-u7m8y9 {mask-image:var(--ehagaki-icon-6172726f775f72696768745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.delete-left-icon.svelte-u7m8y9 {mask-image:var(--ehagaki-icon-6261636b73706163655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.enter-key-icon.svelte-u7m8y9 {mask-image:var(--ehagaki-icon-6b6579626f6172645f72657475726e5f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.custom-emoji-scroll-root,\n    .custom-emoji-scroll-viewport {width:100%;}.custom-emoji-scroll-root {overflow:hidden;}.custom-emoji-scroll-viewport {height:100%;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;}.custom-emoji-list {min-height:100%;}.emoji-virtual-list.svelte-u7m8y9 {position:relative;width:100%;}.emoji-grid.svelte-u7m8y9 {position:absolute;inset:4px 4px auto 4px;display:grid;justify-items:center;}.custom-emoji-usage-section.svelte-u7m8y9 {padding:4px;border-bottom:1px solid var(--border);}.custom-emoji-usage-title.svelte-u7m8y9 {padding:0 6px 2px;color:var(--text-muted, var(--text));font-size:0.78rem;font-weight:700;}.custom-emoji-usage-grid.svelte-u7m8y9 {display:grid;grid-auto-rows:40px;justify-items:center;}.emoji-item {display:flex;align-items:center;justify-content:center;width:100%;height:100%;cursor:pointer;outline:none;}.emoji-item[data-highlighted] {background:var(--btn-hover-bg);}\n\n    @media (hover: hover) and (pointer: fine) {.emoji-item:hover {background:var(--btn-hover-bg);}\n    }.emoji-image.svelte-u7m8y9 {width:32px;height:32px;object-fit:contain;user-select:none;-webkit-user-drag:none;}.custom-emoji-message {padding:18px 12px;text-align:center;color:var(--text-muted, var(--text));font-size:0.9rem;}.custom-emoji-loading {min-height:96px;.placeholder-text.loading-text {font-size:1rem;}}.scrollbar {display:flex;width:8px;padding:1px;background:transparent;}.scrollbar-thumb {flex:1;border-radius:999px;background:var(--border);}"
};
function rt(i, f) {
	n(f, !0), re(i, nt);
	let _ = () => ce(de, "$_", v), [v, te] = ae(), T = ue(), O = k(f, "open", 3, !1), j = k(f, "maxHeight", 3, null), N = k(f, "customEmojiUsageItems", 19, () => []), P = M(""), F = M(ne(240)), I = M(!1), L = M(!1), R = M(0), z = M(800), B = null, V = null, H = null, ge = M(0), U, G, ke = !1, je, Me, Pe = !1, Fe, K, Le = /* @__PURE__ */ new Set(), Re = m(() => f.hostCustomEmojiItems ?? xe.items), ze = m(() => f.hostCustomEmojiItems === void 0 && xe.loading), q = m(() => {
		let e = A(P).trim().toLowerCase();
		return e ? A(Re).filter((t) => t.shortcodeLower.includes(e)) : A(Re);
	}), Be = m(() => A(P).trim().length === 0 && N().length > 0), J = m(() => Math.max(1, Math.floor(A(z) / 40))), He = m(() => Oe(A(J))), rt = m(() => N().slice(0, A(He))), it = m(() => [...N()].sort(De).slice(0, A(He))), at = m(() => Math.ceil(A(q).length / A(J))), Y = m(() => Math.max(48, A(F))), ot = m(() => Math.ceil(A(Y) / 40) + 6), st = m(() => Math.max(0, Math.min(Math.max(0, A(at) - A(ot)), Math.floor(Math.max(0, A(R) - A(ge)) / 40) - 3))), ct = m(() => Math.min(A(at), A(st) + A(ot))), lt = m(() => A(st) * A(J)), ut = m(() => Math.min(A(q).length, A(ct) * A(J))), dt = m(() => A(q).slice(A(lt), A(ut))), ft = m(() => A(at) * 40 + 8), pt = m(() => A(st) * 40), mt = m(() => Number.isFinite(j()) ? Math.max(48, Math.floor(j())) : void 0), X = m(() => A(mt) === void 0 ? void 0 : A(mt)), ht = m(() => "--custom-emoji-picker-resize-handle-height: 30px; --custom-emoji-picker-resize-handle-overlap: 16px; --custom-emoji-picker-search-row-height: 40px;");
	function gt() {
		let e = window.visualViewport?.width ?? window.innerWidth ?? 800;
		y(z, Math.min(800, Math.max(1, e)), !0);
	}
	function _t(e) {
		f.hostCustomEmojiItems === void 0 && (Le.has(e) || (Le.add(e), we([e])));
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
		return Math.max(48, A(X) === void 0 ? t : A(X));
	}
	function xt(e) {
		y(F, Se(T, e, vt(), A(X)), !0);
	}
	function St(e) {
		e.key === "ArrowUp" ? (e.preventDefault(), xt(A(Y) + 24)) : e.key === "ArrowDown" && (e.preventDefault(), xt(A(Y) - 24));
	}
	function Z() {
		V !== null && cancelAnimationFrame(V), V = requestAnimationFrame(() => {
			V = null, yt();
		});
	}
	ie(() => (y(F, Ce(T, vt(), A(X)), !0), yt(), window.addEventListener("resize", Z), window.visualViewport?.addEventListener("resize", Z), () => {
		V !== null && (cancelAnimationFrame(V), V = null), window.removeEventListener("resize", Z), window.visualViewport?.removeEventListener("resize", Z);
	})), E(() => {
		let e = O(), t = f.rxNostr, n = f.pubkey;
		f.hostCustomEmojiItems === void 0 ? e ? ((t !== U || n !== G) && (U = t, G = n, b(() => xe.load({
			rxNostr: t,
			pubkey: n
		}))), Z()) : (U = void 0, G = void 0) : (U = void 0, G = void 0, e && Z());
	}), E(() => {
		let e = O() && (!ke || f.rxNostr !== je || f.pubkey !== Me);
		if (ke = O(), je = f.rxNostr, Me = f.pubkey, B !== null && (cancelAnimationFrame(B), B = null), !O() || !e) O() || y(L, !1);
		else return y(L, !1), B = requestAnimationFrame(() => {
			B = null, y(L, !0);
		}), () => {
			B !== null && (cancelAnimationFrame(B), B = null);
		};
	}), E(() => {
		let e = O() && (!Pe || A(P) !== Fe || f.pubkey !== K);
		Pe = O(), Fe = A(P), K = f.pubkey, e && (y(R, 0), H?.querySelector(".custom-emoji-scroll-viewport")?.scrollTo({ top: 0 }));
	}), E(() => {
		A(X), y(F, Ce(T, vt(), A(X)), !0);
	});
	function Ct(e) {
		f.onSelect?.(e);
	}
	function wt() {
		f.onMoveCaretLeft?.();
	}
	function Tt() {
		f.onMoveCaretRight?.();
	}
	function Et() {
		f.onDeleteBackward?.();
	}
	function Dt() {
		f.onInsertLineBreak?.();
	}
	function Ot(e) {
		e.preventDefault(), yt();
		let t = e.clientY, n = A(Y);
		y(I, !0);
		let r = (e) => {
			e.preventDefault(), xt(n + (t - e.clientY));
		}, i = () => {
			y(I, !1), window.removeEventListener("pointermove", r), window.removeEventListener("pointerup", i), window.removeEventListener("pointercancel", i);
		};
		window.addEventListener("pointermove", r), window.addEventListener("pointerup", i), window.addEventListener("pointercancel", i);
	}
	function kt(e) {
		y(R, e.currentTarget.scrollTop, !0);
	}
	var Q = tt(), $ = C(Q), At = D($, 2);
	{
		let n = m(() => _()("customEmoji.search_label"));
		d(At, () => me, (r, i) => {
			i(r, {
				class: "custom-emoji-command",
				get label() {
					return A(n);
				},
				shouldFilter: !1,
				loop: !0,
				children: (n, r) => {
					var i = et(), f = w(i);
					{
						let n = m(() => `height: ${A(Y)}px;`);
						d(f, () => pe, (r, i) => {
							i(r, {
								type: "auto",
								class: "custom-emoji-scroll-root",
								get style() {
									return A(n);
								},
								children: (n, r) => {
									var i = Je(), f = w(i);
									d(f, () => he, (n, r) => {
										r(n, {
											class: "custom-emoji-scroll-viewport",
											onscroll: kt,
											children: (n, r) => {
												var i = s(), f = w(i);
												d(f, () => ve, (n, r) => {
													r(n, {
														class: "custom-emoji-list",
														children: (n, r) => {
															var i = s(), f = w(i), p = (e) => {
																var t = s(), n = w(t);
																d(n, () => Ie, (e, t) => {
																	t(e, {
																		class: "custom-emoji-message",
																		children: (e, t) => {
																			{
																				let t = m(() => _()("customEmoji.loading"));
																				fe(e, {
																					showLoader: !0,
																					get text() {
																						return A(t);
																					},
																					customClass: "custom-emoji-loading"
																				});
																			}
																		},
																		$$slots: { default: !0 }
																	});
																}), a(e, t);
															}, v = (e) => {
																var t = s(), n = w(t);
																d(n, () => Ae, (e, t) => {
																	t(e, {
																		class: "custom-emoji-message",
																		children: (e, t) => {
																			l();
																			var n = g();
																			S((e) => o(n, e), [() => _()("customEmoji.empty")]), a(e, n);
																		},
																		$$slots: { default: !0 }
																	});
																}), a(e, t);
															}, b = (n) => {
																var r = qe(), i = w(r), l = (t) => {
																	var n = Ge(), r = C(n), i = C(r), l = se(i, !0), f = D(i, 2);
																	c(f, 21, () => A(rt), (e) => e.identityKey, (t, n) => {
																		var r = s(), i = w(r);
																		{
																			let t = m(() => `recent:${A(n).identityKey}`), r = m(() => [A(n).shortcode]);
																			d(i, () => be, (i, o) => {
																				o(i, {
																					get value() {
																						return A(t);
																					},
																					get keywords() {
																						return A(r);
																					},
																					class: "emoji-item custom-emoji-usage-item",
																					onSelect: () => Ct(A(n)),
																					get onmousedown() {
																						return W;
																					},
																					get ontouchstart() {
																						return Ee;
																					},
																					children: (t, r) => {
																						var i = We();
																						S(() => {
																							x(i, "src", A(n).src), x(i, "alt", `:${A(n).shortcode}:`), x(i, "title", `:${A(n).shortcode}:`);
																						}), e("load", i, () => _t(A(n).src)), le(i), a(t, i);
																					},
																					$$slots: { default: !0 }
																				});
																			});
																		}
																		a(t, r);
																	}), u(f), u(r);
																	var p = D(r, 2), g = C(p), v = se(g, !0), b = D(g, 2);
																	c(b, 21, () => A(it), (e) => e.identityKey, (t, n) => {
																		var r = s(), i = w(r);
																		{
																			let t = m(() => `frequent:${A(n).identityKey}`), r = m(() => [A(n).shortcode]);
																			d(i, () => be, (i, o) => {
																				o(i, {
																					get value() {
																						return A(t);
																					},
																					get keywords() {
																						return A(r);
																					},
																					class: "emoji-item custom-emoji-usage-item",
																					onSelect: () => Ct(A(n)),
																					get onmousedown() {
																						return W;
																					},
																					get ontouchstart() {
																						return Ee;
																					},
																					children: (t, r) => {
																						var i = We();
																						S(() => {
																							x(i, "src", A(n).src), x(i, "alt", `:${A(n).shortcode}:`), x(i, "title", `:${A(n).shortcode}:`);
																						}), e("load", i, () => _t(A(n).src)), le(i), a(t, i);
																					},
																					$$slots: { default: !0 }
																				});
																			});
																		}
																		a(t, r);
																	}), u(b), u(p), u(n), S((e, t, n, i) => {
																		x(r, "aria-label", e), o(l, t), h(f, `grid-template-columns: repeat(${A(J)}, minmax(0, 1fr));`), x(p, "aria-label", n), o(v, i), h(b, `grid-template-columns: repeat(${A(J)}, minmax(0, 1fr));`);
																	}, [
																		() => _()("customEmoji.recent"),
																		() => _()("customEmoji.recent"),
																		() => _()("customEmoji.frequent"),
																		() => _()("customEmoji.frequent")
																	]), oe(n, "clientHeight", (e) => y(ge, e)), a(t, n);
																}, f = (e) => {
																	var t = Ke();
																	oe(t, "clientHeight", (e) => y(ge, e)), a(e, t);
																};
																t(i, (e) => {
																	A(Be) ? e(l) : e(f, -1);
																});
																var p = D(i, 2), g = C(p);
																c(g, 21, () => A(dt), (e) => e.identityKey, (t, n) => {
																	var r = s(), i = w(r);
																	{
																		let t = m(() => [A(n).shortcode]);
																		d(i, () => be, (r, i) => {
																			i(r, {
																				get value() {
																					return A(n).identityKey;
																				},
																				get keywords() {
																					return A(t);
																				},
																				class: "emoji-item",
																				onSelect: () => Ct(A(n)),
																				get onmousedown() {
																					return W;
																				},
																				get ontouchstart() {
																					return Ee;
																				},
																				children: (t, r) => {
																					var i = We();
																					S(() => {
																						x(i, "src", A(n).src), x(i, "alt", `:${A(n).shortcode}:`), x(i, "title", `:${A(n).shortcode}:`);
																					}), e("load", i, () => _t(A(n).src)), le(i), a(t, i);
																				},
																				$$slots: { default: !0 }
																			});
																		});
																	}
																	a(t, r);
																}), u(g), u(p), S(() => {
																	h(p, `height: ${A(ft)}px;`), h(g, `transform: translateY(${A(pt)}px); grid-template-columns: repeat(${A(J)}, minmax(0, 1fr)); grid-auto-rows: 40px;`);
																}), a(n, r);
															};
															t(f, (e) => {
																A(ze) || !A(L) ? e(p) : A(q).length === 0 && !A(Be) ? e(v, 1) : e(b, -1);
															}), a(n, i);
														},
														$$slots: { default: !0 }
													});
												}), a(n, i);
											},
											$$slots: { default: !0 }
										});
									});
									var p = D(f, 2);
									d(p, () => ye, (e, t) => {
										t(e, {
											orientation: "vertical",
											class: "scrollbar",
											children: (e, t) => {
												var n = s(), r = w(n);
												d(r, () => _e, (e, t) => {
													t(e, { class: "scrollbar-thumb" });
												}), a(e, n);
											},
											$$slots: { default: !0 }
										});
									}), a(n, i);
								},
								$$slots: { default: !0 }
							});
						});
					}
					var p = D(f, 2), v = C(p);
					{
						let e = m(() => _()("customEmoji.search_placeholder"));
						d(v, () => Ne, (t, n) => {
							n(t, {
								class: "custom-emoji-search",
								get placeholder() {
									return A(e);
								},
								get value() {
									return A(P);
								},
								set value(e) {
									y(P, e, !0);
								}
							});
						});
					}
					var b = D(v, 2);
					{
						let e = m(() => _()("customEmoji.editor_toolbar"));
						d(b, () => Ve, (t, n) => {
							n(t, {
								class: "custom-emoji-editor-toolbar",
								orientation: "horizontal",
								loop: !1,
								get "aria-label"() {
									return A(e);
								},
								children: (e, t) => {
									var n = $e(), r = w(n), i = C(r);
									{
										let e = m(() => _()("customEmoji.move_left"));
										d(i, () => Ue, (t, n) => {
											n(t, {
												class: "custom-emoji-editor-button left",
												get "aria-label"() {
													return A(e);
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
													a(e, n);
												},
												$$slots: { default: !0 }
											});
										});
									}
									var o = D(i, 2);
									{
										let e = m(() => _()("customEmoji.move_right"));
										d(o, () => Ue, (t, n) => {
											n(t, {
												class: "custom-emoji-editor-button right",
												get "aria-label"() {
													return A(e);
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
													a(e, n);
												},
												$$slots: { default: !0 }
											});
										});
									}
									u(r);
									var s = D(r, 2), c = C(s);
									{
										let e = m(() => _()("customEmoji.insert_line_break"));
										d(c, () => Ue, (t, n) => {
											n(t, {
												class: "custom-emoji-editor-button line-break",
												get "aria-label"() {
													return A(e);
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
													a(e, n);
												},
												$$slots: { default: !0 }
											});
										});
									}
									var l = D(c, 2);
									{
										let e = m(() => _()("customEmoji.delete_backward"));
										d(l, () => Ue, (t, n) => {
											n(t, {
												class: "custom-emoji-editor-button delete",
												get "aria-label"() {
													return A(e);
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
													a(e, n);
												},
												$$slots: { default: !0 }
											});
										});
									}
									u(s), a(e, n);
								},
								$$slots: { default: !0 }
							});
						});
					}
					u(p), a(n, i);
				},
				$$slots: { default: !0 }
			});
		});
	}
	u(Q), ee(Q, (e) => H = e, () => H), S((e, t) => {
		x(Q, "data-resizing", A(I)), h(Q, A(ht)), x($, "aria-label", e), x($, "aria-valuemin", 48), x($, "aria-valuenow", A(Y)), x($, "aria-valuemax", t);
	}, [() => _()("customEmoji.resize"), () => bt()]), p("pointerdown", $, Ot), p("keydown", $, St), a(i, Q), r(), te();
}
v(["pointerdown", "keydown"]);
export { rt as default };
