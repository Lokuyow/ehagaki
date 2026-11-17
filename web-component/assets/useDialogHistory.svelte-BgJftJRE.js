import { $ as e, Et as t, G as n, J as r, K as i, Mt as a, Nt as o, P as s, Tt as c, W as l, _ as u, ct as d, dt as f, gt as p, i as m, it as h, n as g, nt as _, ot as v, r as y, t as b, ut as x, vt as S, xt as C, z as w } from "./index-client-XkLzkVYC.js";
import { v as T } from "./relayConfigUtils-B4Q_AO1M.js";
import { $ as E, B as D, F as ee, H as te, K as ne, Q as re, R as ie, U as O, V as ae, X as k, a as oe, c as se, dt as ce, et as A, f as le, h as ue, j, m as de, nt as M, o as N, q as P, r as fe, s as F, st as I, z as pe } from "./LoadingPlaceholder-lit91akO.js";
import { i as me } from "./appUtils-BRia-Jm6.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/presence-manager.svelte.js
var L = class {
	#e;
	#t;
	#n;
	#r = S(!1);
	#i = S(void 0);
	#a = !1;
	#o = null;
	constructor(e) {
		this.#e = e, p(this.#r, e.open.current, !0), this.#t = e.enabled ?? !0, this.#n = new se({
			ref: this.#e.ref,
			afterTick: this.#e.open
		}), P(() => this.#s()), k(() => this.#e.open.current, (e) => {
			this.#a ? (this.#s(), !e && this.#e.shouldSkipExitAnimation?.() ? (p(this.#r, !1), p(this.#i, void 0), this.#e.onComplete?.()) : (e && p(this.#r, !0), p(this.#i, e ? "starting" : "ending", !0), e && (this.#o = window.requestAnimationFrame(() => {
				this.#o = null, this.#e.open.current && p(this.#i, void 0);
			})), this.#t ? this.#n.run(() => {
				e === this.#e.open.current && (this.#e.open.current || p(this.#r, !1), p(this.#i, void 0), this.#e.onComplete?.());
			}) : (e || p(this.#r, !1), p(this.#i, void 0), this.#e.onComplete?.()))) : this.#a = !0;
		});
	}
	get shouldRender() {
		return _(this.#r);
	}
	get transitionStatus() {
		return _(this.#i);
	}
	#s() {
		this.#o !== null && (window.cancelAnimationFrame(this.#o), this.#o = null);
	}
}, he = ee({
	component: "dialog",
	parts: [
		"content",
		"trigger",
		"overlay",
		"title",
		"description",
		"close",
		"cancel",
		"action"
	]
}), R = new re("Dialog.Root | AlertDialog.Root"), ge = class e {
	static create(t) {
		let n = R.getOr(null);
		return R.set(new e(t, n));
	}
	opts;
	#e = S(null);
	get triggerNode() {
		return _(this.#e);
	}
	set triggerNode(e) {
		p(this.#e, e, !0);
	}
	#t = S(null);
	get contentNode() {
		return _(this.#t);
	}
	set contentNode(e) {
		p(this.#t, e, !0);
	}
	#n = S(null);
	get overlayNode() {
		return _(this.#n);
	}
	set overlayNode(e) {
		p(this.#n, e, !0);
	}
	#r = S(null);
	get descriptionNode() {
		return _(this.#r);
	}
	set descriptionNode(e) {
		p(this.#r, e, !0);
	}
	#i = S(void 0);
	get contentId() {
		return _(this.#i);
	}
	set contentId(e) {
		p(this.#i, e, !0);
	}
	#a = S(void 0);
	get titleId() {
		return _(this.#a);
	}
	set titleId(e) {
		p(this.#a, e, !0);
	}
	#o = S(void 0);
	get triggerId() {
		return _(this.#o);
	}
	set triggerId(e) {
		p(this.#o, e, !0);
	}
	#s = S(void 0);
	get descriptionId() {
		return _(this.#s);
	}
	set descriptionId(e) {
		p(this.#s, e, !0);
	}
	#c = S(null);
	get cancelNode() {
		return _(this.#c);
	}
	set cancelNode(e) {
		p(this.#c, e, !0);
	}
	#l = S(0);
	get nestedOpenCount() {
		return _(this.#l);
	}
	set nestedOpenCount(e) {
		p(this.#l, e, !0);
	}
	depth;
	parent;
	contentPresence;
	overlayPresence;
	constructor(e, t) {
		this.opts = e, this.parent = t, this.depth = t ? t.depth + 1 : 0, this.handleOpen = this.handleOpen.bind(this), this.handleClose = this.handleClose.bind(this), this.contentPresence = new L({
			ref: I(() => this.contentNode),
			open: this.opts.open,
			enabled: !0,
			onComplete: () => {
				this.opts.onOpenChangeComplete.current(this.opts.open.current);
			}
		}), this.overlayPresence = new L({
			ref: I(() => this.overlayNode),
			open: this.opts.open,
			enabled: !0
		}), k(() => this.opts.open.current, (e) => {
			this.parent && (e ? this.parent.incrementNested() : this.parent.decrementNested());
		}, { lazy: !0 }), P(() => {
			this.opts.open.current && this.parent?.decrementNested();
		});
	}
	handleOpen() {
		this.opts.open.current || (this.opts.open.current = !0);
	}
	handleClose() {
		this.opts.open.current && (this.opts.open.current = !1);
	}
	getBitsAttr = (e) => he.getAttr(e, this.opts.variant.current);
	incrementNested() {
		this.nestedOpenCount++, this.parent?.incrementNested();
	}
	decrementNested() {
		this.nestedOpenCount !== 0 && (this.nestedOpenCount--, this.parent?.decrementNested());
	}
	#u = C(() => ({ "data-state": ie(this.opts.open.current) }));
	get sharedProps() {
		return _(this.#u);
	}
	set sharedProps(e) {
		p(this.#u, e);
	}
}, _e = class e {
	static create(t) {
		return new e(t, R.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = D(this.opts.ref), this.onclick = this.onclick.bind(this), this.onkeydown = this.onkeydown.bind(this);
	}
	onclick(e) {
		this.opts.disabled.current || e.button > 0 || this.root.handleClose();
	}
	onkeydown(e) {
		this.opts.disabled.current || (e.key === " " || e.key === "Enter") && (e.preventDefault(), this.root.handleClose());
	}
	#e = C(() => ({
		id: this.opts.id.current,
		[this.root.getBitsAttr(this.opts.variant.current)]: "",
		onclick: this.onclick,
		onkeydown: this.onkeydown,
		disabled: this.opts.disabled.current ? !0 : void 0,
		tabindex: 0,
		...this.root.sharedProps,
		...this.attachment
	}));
	get props() {
		return _(this.#e);
	}
	set props(e) {
		p(this.#e, e);
	}
}, ve = class e {
	static create(t) {
		return new e(t, R.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = D(this.opts.ref);
	}
	#e = C(() => ({
		id: this.opts.id.current,
		[this.root.getBitsAttr("action")]: "",
		...this.root.sharedProps,
		...this.attachment
	}));
	get props() {
		return _(this.#e);
	}
	set props(e) {
		p(this.#e, e);
	}
}, ye = class e {
	static create(t) {
		return new e(t, R.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.root.titleId = this.opts.id.current, this.attachment = D(this.opts.ref), k.pre(() => this.opts.id.current, (e) => {
			this.root.titleId = e;
		});
	}
	#e = C(() => ({
		id: this.opts.id.current,
		role: "heading",
		"aria-level": this.opts.level.current,
		[this.root.getBitsAttr("title")]: "",
		...this.root.sharedProps,
		...this.attachment
	}));
	get props() {
		return _(this.#e);
	}
	set props(e) {
		p(this.#e, e);
	}
}, be = class e {
	static create(t) {
		return new e(t, R.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.root.descriptionId = this.opts.id.current, this.attachment = D(this.opts.ref, (e) => {
			this.root.descriptionNode = e;
		}), k.pre(() => this.opts.id.current, (e) => {
			this.root.descriptionId = e;
		});
	}
	#e = C(() => ({
		id: this.opts.id.current,
		[this.root.getBitsAttr("description")]: "",
		...this.root.sharedProps,
		...this.attachment
	}));
	get props() {
		return _(this.#e);
	}
	set props(e) {
		p(this.#e, e);
	}
}, xe = class e {
	static create(t) {
		return new e(t, R.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = D(this.opts.ref, (e) => {
			this.root.contentNode = e, this.root.contentId = e?.id;
		});
	}
	#e = C(() => ({ open: this.root.opts.open.current }));
	get snippetProps() {
		return _(this.#e);
	}
	set snippetProps(e) {
		p(this.#e, e);
	}
	#t = C(() => ({
		id: this.opts.id.current,
		role: this.root.opts.variant.current === "alert-dialog" ? "alertdialog" : "dialog",
		"aria-modal": "true",
		"aria-describedby": this.root.descriptionId,
		"aria-labelledby": this.root.titleId,
		[this.root.getBitsAttr("content")]: "",
		style: {
			pointerEvents: "auto",
			outline: this.root.opts.variant.current === "alert-dialog" ? "none" : void 0,
			"--bits-dialog-depth": this.root.depth,
			"--bits-dialog-nested-count": this.root.nestedOpenCount,
			contain: "layout style"
		},
		tabindex: this.root.opts.variant.current === "alert-dialog" ? -1 : void 0,
		"data-nested-open": j(this.root.nestedOpenCount > 0),
		"data-nested": j(this.root.parent !== null),
		...pe(this.root.contentPresence.transitionStatus),
		...this.root.sharedProps,
		...this.attachment
	}));
	get props() {
		return _(this.#t);
	}
	set props(e) {
		p(this.#t, e);
	}
	get shouldRender() {
		return this.root.contentPresence.shouldRender;
	}
}, Se = class e {
	static create(t) {
		return new e(t, R.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = D(this.opts.ref, (e) => this.root.overlayNode = e);
	}
	#e = C(() => ({ open: this.root.opts.open.current }));
	get snippetProps() {
		return _(this.#e);
	}
	set snippetProps(e) {
		p(this.#e, e);
	}
	#t = C(() => ({
		id: this.opts.id.current,
		[this.root.getBitsAttr("overlay")]: "",
		style: {
			pointerEvents: "auto",
			"--bits-dialog-depth": this.root.depth,
			"--bits-dialog-nested-count": this.root.nestedOpenCount
		},
		"data-nested-open": j(this.root.nestedOpenCount > 0),
		"data-nested": j(this.root.parent !== null),
		...pe(this.root.overlayPresence.transitionStatus),
		...this.root.sharedProps,
		...this.attachment
	}));
	get props() {
		return _(this.#t);
	}
	set props(e) {
		p(this.#t, e);
	}
	get shouldRender() {
		return this.root.overlayPresence.shouldRender;
	}
}, Ce = class e {
	static create(t) {
		return new e(t, R.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = D(this.opts.ref, (e) => this.root.cancelNode = e), this.onclick = this.onclick.bind(this), this.onkeydown = this.onkeydown.bind(this);
	}
	onclick(e) {
		this.opts.disabled.current || e.button > 0 || this.root.handleClose();
	}
	onkeydown(e) {
		this.opts.disabled.current || (e.key === " " || e.key === "Enter") && (e.preventDefault(), this.root.handleClose());
	}
	#e = C(() => ({
		id: this.opts.id.current,
		[this.root.getBitsAttr("cancel")]: "",
		onclick: this.onclick,
		onkeydown: this.onkeydown,
		tabindex: 0,
		disabled: this.opts.disabled.current,
		...this.root.sharedProps,
		...this.attachment
	}));
	get props() {
		return _(this.#e);
	}
	set props(e) {
		p(this.#e, e);
	}
}, we = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"ref",
	"child",
	"children",
	"level"
]), Te = i("<div><!></div>");
function Ee(e, i) {
	let d = r();
	t(i, !0);
	let p = y(i, "id", 19, () => N(d)), h = y(i, "ref", 15, null), g = y(i, "level", 3, 2), v = m(i, we), b = ye.create({
		id: I(() => p()),
		level: I(() => g()),
		ref: I(() => h(), (e) => h(e))
	}), S = C(() => A(v, b.props));
	var T = n(), E = f(T), D = (e) => {
		var t = n(), r = f(t);
		s(r, () => i.child, () => ({ props: _(S) })), l(e, t);
	}, ee = (e) => {
		var t = Te();
		u(t, () => ({ ..._(S) }));
		var n = x(t);
		s(n, () => i.children ?? o), a(t), l(e, t);
	};
	w(E, (e) => {
		i.child ? e(D) : e(ee, -1);
	}), l(e, T), c();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/debounce.js
function De(e, t = 500) {
	let n = null, r = null, i = (...e) => {
		i.destroy(), r = e, n = setTimeout(i.flush, t);
	};
	return i.flush = () => {
		if (r === null) return;
		let t = r;
		i.destroy(), e(...t);
	}, i.destroy = () => {
		n !== null && (clearTimeout(n), n = null), r = null;
	}, i;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/elements.js
function Oe(e, t) {
	return e === t || e.contains(t);
}
function ke(e) {
	return e?.ownerDocument ?? document;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/menu/context-menu-attributes.js
var Ae = "data-context-menu-trigger", je = "data-context-menu-content";
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/dismissible-layer/use-dismissable-layer.svelte.js
globalThis.bitsDismissableLayers ??= /* @__PURE__ */ new Map();
var Me = class t {
	static create(e) {
		return new t(e);
	}
	opts;
	#e;
	#t;
	#n = { pointerdown: !1 };
	#r = !1;
	#i = null;
	#a = !1;
	#o = void 0;
	#s;
	#c = F;
	#l = !1;
	constructor(e) {
		this.opts = e, this.#t = e.interactOutsideBehavior, this.#e = e.onInteractOutside, this.#s = e.onFocusOutside;
		let t = F, n = null, r = () => {
			n = null, this.#y(), globalThis.bitsDismissableLayers.delete(this), this.#m.destroy(), this.#c(), t();
		};
		k([() => this.opts.enabled.current, () => this.opts.ref.current], ([e, i]) => {
			let a = e ? i : null;
			n !== a && (r(), a && (n = a, this.#o = ke(a), globalThis.bitsDismissableLayers.set(this, this.#t), t = this.#d()));
		}), P(() => {
			this.#l = !0, r();
		});
	}
	#u = (e) => {
		e.defaultPrevented || this.#l || !this.opts.ref.current || ne(() => {
			this.#l || this.opts.ref.current && !this.#v(e.target) && e.target && !this.#a && this.#s.current?.(e);
		});
	};
	#d() {
		let t = this.#o, n = (e) => {
			h(() => {
				this.#m.flush(), this.#h(e), this.#_(e);
			});
		}, r = (e) => {
			e.cancelBubble || e !== this.#i || (this.#g(e), e.pointerType === "touch" ? (this.#m.destroy(), this.#p(e)) : this.#m(e));
		};
		return t.addEventListener("pointerdown", n, !0), t.addEventListener("pointerdown", r), M(() => t.removeEventListener("pointerdown", n, !0), () => t.removeEventListener("pointerdown", r), e(t, "focusin", this.#u));
	}
	#f = (e) => {
		let t = e;
		t.defaultPrevented && (t = Ie(e)), this.#e.current(e);
	};
	#p = (t) => {
		if (!this.opts.ref.current) {
			this.#c();
			return;
		}
		let n = this.opts.isValidEvent.current(t, this.opts.ref.current) || Fe(t, this.opts.ref.current);
		if (!this.#r || this.#b() || !n) {
			this.#c();
			return;
		}
		let r = t;
		if (r.defaultPrevented && (r = Ie(r)), this.#t.current !== "close" && this.#t.current !== "defer-otherwise-close") this.#c();
		else if (t.pointerType === "touch") {
			this.#c();
			let t = null, n = F, r = (e) => {
				n(), this.#f(e);
			};
			n = M(e(this.#o, "click", r, { once: !0 }), e(this.#o, "click", (e) => {
				t = setTimeout(() => r(e), 0);
			}, {
				once: !0,
				capture: !0
			}), () => {
				t !== null && clearTimeout(t), t = null;
			}), this.#c = n;
		} else this.#e.current(r);
	};
	#m = De(this.#p, 10);
	#h = (e) => {
		this.#n[e.type] = !0;
	};
	#g = (e) => {
		this.#n[e.type] = !1;
	};
	#_ = (e) => {
		this.#i = e, this.opts.ref.current && (this.#r = Pe(this.opts.ref.current));
	};
	#v = (e) => this.opts.ref.current ? Oe(this.opts.ref.current, e) : !1;
	#y = () => {
		for (let e in this.#n) this.#n[e] = !1;
		this.#r = !1, this.#i = null;
	};
	#b() {
		return Object.values(this.#n).some(Boolean);
	}
	#x = () => {
		this.#a = !0;
	};
	#S = () => {
		this.#a = !1;
	};
	props = {
		onfocuscapture: this.#x,
		onblurcapture: this.#S
	};
};
function Ne(e = [...globalThis.bitsDismissableLayers]) {
	return e.findLast(([e, { current: t }]) => t === "close" || t === "ignore");
}
function Pe(e) {
	let t = [...globalThis.bitsDismissableLayers], n = Ne(t);
	if (n) return n[0].opts.ref.current === e;
	let [r] = t[0];
	return r.opts.ref.current === e;
}
function Fe(e, t) {
	let n = e.target;
	if (!le(n)) return !1;
	let r = !!n.closest(`[${Ae}]`), i = !!t.closest(`[${je}]`);
	return "button" in e && e.button > 0 && !r ? !1 : "button" in e && e.button === 0 && r && i ? !0 : r && i ? !1 : ke(n).documentElement.contains(n) && !Oe(t, n) && oe(e, t);
}
function Ie(e) {
	let t = e.currentTarget, n = e.target, r;
	r = e instanceof PointerEvent ? new PointerEvent(e.type, e) : new PointerEvent("pointerdown", e);
	let i = !1;
	return new Proxy(r, { get: (r, a) => a === "currentTarget" ? t : a === "target" ? n : a === "preventDefault" ? () => {
		i = !0, typeof r.preventDefault == "function" && r.preventDefault();
	} : a === "defaultPrevented" ? i : a in r ? r[a] : e[a] });
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/dismissible-layer/dismissible-layer.svelte
function Le(e, r) {
	t(r, !0);
	let i = y(r, "interactOutsideBehavior", 3, "close"), a = y(r, "onInteractOutside", 3, F), u = y(r, "onFocusOutside", 3, F), d = y(r, "isValidEvent", 3, () => !1), p = Me.create({
		id: I(() => r.id),
		interactOutsideBehavior: I(() => i()),
		onInteractOutside: I(() => a()),
		enabled: I(() => r.enabled),
		onFocusOutside: I(() => u()),
		isValidEvent: I(() => d()),
		ref: h(() => r.ref)
	});
	var m = n(), g = f(m);
	s(g, () => r.children ?? o, () => ({ props: p.props })), l(e, m), c();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/escape-layer/use-escape-layer.svelte.js
globalThis.bitsEscapeLayers ??= /* @__PURE__ */ new Map();
var Re = class t {
	static create(e) {
		return new t(e);
	}
	opts;
	domContext;
	constructor(e) {
		this.opts = e, this.domContext = new ae(this.opts.ref);
		let t = F;
		k(() => e.enabled.current, (n) => (n && (globalThis.bitsEscapeLayers.set(this, e.escapeKeydownBehavior), t = this.#e()), () => {
			t(), globalThis.bitsEscapeLayers.delete(this);
		}));
	}
	#e = () => e(this.domContext.getDocument(), "keydown", this.#t, { passive: !1 });
	#t = (e) => {
		if (e.key !== "Escape" || !ze(this)) return;
		let t = new KeyboardEvent(e.type, e);
		e.preventDefault();
		let n = this.opts.escapeKeydownBehavior.current;
		(n === "close" || n === "defer-otherwise-close") && this.opts.onEscapeKeydown.current(t);
	};
};
function ze(e) {
	let t = [...globalThis.bitsEscapeLayers], n = t.findLast(([e, { current: t }]) => t === "close" || t === "ignore");
	if (n) return n[0] === e;
	let [r] = t[0];
	return r === e;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/escape-layer/escape-layer.svelte
function Be(e, r) {
	t(r, !0);
	let i = y(r, "escapeKeydownBehavior", 3, "close"), a = y(r, "onEscapeKeydown", 3, F);
	Re.create({
		escapeKeydownBehavior: I(() => i()),
		onEscapeKeydown: I(() => a()),
		enabled: I(() => r.enabled),
		ref: h(() => r.ref)
	});
	var u = n(), d = f(u);
	s(d, () => r.children ?? o), l(e, u), c();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/focus-scope/focus-scope-manager.js
var Ve = class e {
	static instance;
	#e = ce([]);
	#t = /* @__PURE__ */ new WeakMap();
	#n = /* @__PURE__ */ new WeakMap();
	static getInstance() {
		return this.instance ||= new e(), this.instance;
	}
	register(e) {
		let t = this.getActive();
		t && t !== e && t.pause();
		let n = O(document);
		n && n !== document.body && this.#n.set(e, n), this.#e.current = this.#e.current.filter((t) => t !== e), this.#e.current.unshift(e), e.resume();
	}
	unregister(e) {
		this.#e.current = this.#e.current.filter((t) => t !== e);
		let t = this.getActive();
		t && t.resume();
	}
	getActive() {
		return this.#e.current[0];
	}
	setFocusMemory(e, t) {
		this.#t.set(e, t);
	}
	getFocusMemory(e) {
		return this.#t.get(e);
	}
	isActiveScope(e) {
		return this.getActive() === e;
	}
	setPreFocusMemory(e, t) {
		this.#n.set(e, t);
	}
	getPreFocusMemory(e) {
		return this.#n.get(e);
	}
	clearPreFocusMemory(e) {
		this.#n.delete(e);
	}
}, He = [
	"input:not([inert]):not([inert] *)",
	"select:not([inert]):not([inert] *)",
	"textarea:not([inert]):not([inert] *)",
	"a[href]:not([inert]):not([inert] *)",
	"area[href]:not([inert]):not([inert] *)",
	"button:not([inert]):not([inert] *)",
	"[tabindex]:not(slot):not([inert]):not([inert] *)",
	"audio[controls]:not([inert]):not([inert] *)",
	"video[controls]:not([inert]):not([inert] *)",
	"[contenteditable]:not([contenteditable=\"false\"]):not([inert]):not([inert] *)",
	"details>summary:first-of-type:not([inert]):not([inert] *)",
	"details:not([inert]):not([inert] *)"
], z = /* #__PURE__ */ He.join(","), Ue = typeof Element > "u", B = Ue ? function() {} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector, V = !Ue && Element.prototype.getRootNode ? function(e) {
	return e?.getRootNode?.call(e);
} : function(e) {
	return e?.ownerDocument;
}, H = function(e, t) {
	t === void 0 && (t = !0);
	var n = e?.getAttribute?.call(e, "inert");
	return n === "" || n === "true" || t && e && (typeof e.closest == "function" ? e.closest("[inert]") : H(e.parentNode));
}, We = function(e) {
	var t = e?.getAttribute?.call(e, "contenteditable");
	return t === "" || t === "true";
}, Ge = function(e, t, n) {
	if (H(e)) return [];
	var r = Array.prototype.slice.apply(e.querySelectorAll(z));
	return t && B.call(e, z) && r.unshift(e), r = r.filter(n), r;
}, U = function(e, t, n) {
	for (var r = [], i = Array.from(e); i.length;) {
		var a = i.shift();
		if (!H(a, !1)) {
			if (a.tagName === "SLOT") {
				var o = a.assignedElements(), s = U(o.length ? o : a.children, !0, n);
				n.flatten ? r.push.apply(r, s) : r.push({
					scopeParent: a,
					candidates: s
				});
			} else {
				B.call(a, z) && n.filter(a) && (t || !e.includes(a)) && r.push(a);
				var c = a.shadowRoot || typeof n.getShadowRoot == "function" && n.getShadowRoot(a), l = !H(c, !1) && (!n.shadowRootFilter || n.shadowRootFilter(a));
				if (c && l) {
					var u = U(c === !0 ? a.children : c.children, !0, n);
					n.flatten ? r.push.apply(r, u) : r.push({
						scopeParent: a,
						candidates: u
					});
				} else i.unshift.apply(i, a.children);
			}
		}
	}
	return r;
}, Ke = function(e) {
	return !isNaN(parseInt(e.getAttribute("tabindex"), 10));
}, qe = function(e) {
	if (!e) throw Error("No node provided");
	return e.tabIndex < 0 && (/^(AUDIO|VIDEO|DETAILS)$/.test(e.tagName) || We(e)) && !Ke(e) ? 0 : e.tabIndex;
}, Je = function(e, t) {
	var n = qe(e);
	return n < 0 && t && !Ke(e) ? 0 : n;
}, Ye = function(e, t) {
	return e.tabIndex === t.tabIndex ? e.documentOrder - t.documentOrder : e.tabIndex - t.tabIndex;
}, Xe = function(e) {
	return e.tagName === "INPUT";
}, Ze = function(e) {
	return Xe(e) && e.type === "hidden";
}, Qe = function(e) {
	return e.tagName === "DETAILS" && Array.prototype.slice.apply(e.children).some(function(e) {
		return e.tagName === "SUMMARY";
	});
}, $e = function(e, t) {
	for (var n = 0; n < e.length; n++) if (e[n].checked && e[n].form === t) return e[n];
}, et = function(e) {
	if (!e.name) return !0;
	var t = e.form || V(e), n = function(e) {
		return t.querySelectorAll("input[type=\"radio\"][name=\"" + e + "\"]");
	}, r;
	if (typeof window < "u" && window.CSS !== void 0 && typeof window.CSS.escape == "function") r = n(window.CSS.escape(e.name));
	else try {
		r = n(e.name);
	} catch (e) {
		return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", e.message), !1;
	}
	var i = $e(r, e.form);
	return !i || i === e;
}, tt = function(e) {
	return Xe(e) && e.type === "radio";
}, nt = function(e) {
	return tt(e) && !et(e);
}, rt = function(e) {
	var t = e && V(e), n = t?.host, r = !1;
	if (t && t !== e) {
		var i, a, o;
		for (r = !!((i = n) != null && (a = i.ownerDocument) != null && a.contains(n) || e != null && (o = e.ownerDocument) != null && o.contains(e)); !r && n;) {
			var s, c;
			t = V(n), n = t?.host, r = !!((s = n) != null && (c = s.ownerDocument) != null && c.contains(n));
		}
	}
	return r;
}, it = function(e) {
	var t = e.getBoundingClientRect(), n = t.width, r = t.height;
	return n === 0 && r === 0;
}, at = function(e, t) {
	var n = t.displayCheck, r = t.getShadowRoot;
	if (n === "full-native" && "checkVisibility" in e) return !e.checkVisibility({
		checkOpacity: !1,
		opacityProperty: !1,
		contentVisibilityAuto: !0,
		visibilityProperty: !0,
		checkVisibilityCSS: !0
	});
	var i = getComputedStyle(e).visibility;
	if (i === "hidden" || i === "collapse") return !0;
	var a = B.call(e, "details>summary:first-of-type") ? e.parentElement : e;
	if (B.call(a, "details:not([open]) *")) return !0;
	if (!n || n === "full" || n === "full-native" || n === "legacy-full") {
		if (typeof r == "function") {
			for (var o = e; e;) {
				var s = e.parentElement, c = V(e);
				if (s && !s.shadowRoot && r(s) === !0) return it(e);
				e = e.assignedSlot ? e.assignedSlot : !s && c !== e.ownerDocument ? c.host : s;
			}
			e = o;
		}
		if (rt(e)) return !e.getClientRects().length;
		if (n !== "legacy-full") return !0;
	} else if (n === "non-zero-area") return it(e);
	return !1;
}, ot = function(e) {
	if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(e.tagName)) for (var t = e.parentElement; t;) {
		if (t.tagName === "FIELDSET" && t.disabled) {
			for (var n = 0; n < t.children.length; n++) {
				var r = t.children.item(n);
				if (r.tagName === "LEGEND") return B.call(t, "fieldset[disabled] *") ? !0 : !r.contains(e);
			}
			return !0;
		}
		t = t.parentElement;
	}
	return !1;
}, W = function(e, t) {
	return !(t.disabled || Ze(t) || at(t, e) || Qe(t) || ot(t));
}, G = function(e, t) {
	return !(nt(t) || qe(t) < 0 || !W(e, t));
}, st = function(e) {
	var t = parseInt(e.getAttribute("tabindex"), 10);
	return !!(isNaN(t) || t >= 0);
}, ct = function(e) {
	var t = [], n = [];
	return e.forEach(function(e, r) {
		var i = !!e.scopeParent, a = i ? e.scopeParent : e, o = Je(a, i), s = i ? ct(e.candidates) : a;
		o === 0 ? i ? t.push.apply(t, s) : t.push(a) : n.push({
			documentOrder: r,
			tabIndex: o,
			item: e,
			isScope: i,
			content: s
		});
	}), n.sort(Ye).reduce(function(e, t) {
		return t.isScope ? e.push.apply(e, t.content) : e.push(t.content), e;
	}, []).concat(t);
}, lt = function(e, t) {
	return t ||= {}, ct(t.getShadowRoot ? U([e], t.includeContainer, {
		filter: G.bind(null, t),
		flatten: !1,
		getShadowRoot: t.getShadowRoot,
		shadowRootFilter: st
	}) : Ge(e, t.includeContainer, G.bind(null, t)));
}, ut = function(e, t) {
	return t ||= {}, t.getShadowRoot ? U([e], t.includeContainer, {
		filter: W.bind(null, t),
		flatten: !0,
		getShadowRoot: t.getShadowRoot
	}) : Ge(e, t.includeContainer, W.bind(null, t));
}, dt = function(e, t) {
	if (t ||= {}, !e) throw Error("No node provided");
	return B.call(e, z) !== !1 && G(t, e);
}, ft = /* #__PURE__ */ He.concat("iframe:not([inert]):not([inert] *)").join(","), pt = function(e, t) {
	if (t ||= {}, !e) throw Error("No node provided");
	return B.call(e, ft) !== !1 && W(t, e);
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/focus-scope/focus-scope.svelte.js
function mt(e, t) {
	let n = t.getRootNode();
	for (; e;) {
		let t = e.getRootNode();
		if (t === n) return e;
		e = t !== e && "host" in t ? t.host : null;
	}
	return null;
}
var ht = class t {
	#e = !1;
	#t = null;
	#n = Ve.getInstance();
	#r = [];
	#i;
	constructor(e) {
		this.#i = e;
	}
	get paused() {
		return this.#e;
	}
	pause() {
		this.#e = !0;
	}
	resume() {
		this.#e = !1;
	}
	#a() {
		for (let e of this.#r) e();
		this.#r = [];
	}
	mount(e) {
		this.#t && this.unmount(), this.#t = e, this.#n.register(this), this.#c(), this.#o();
	}
	unmount() {
		this.#t &&= (this.#a(), this.#s(), this.#n.unregister(this), this.#n.clearPreFocusMemory(this), null);
	}
	#o() {
		if (!this.#t) return;
		let e = new CustomEvent("focusScope.onOpenAutoFocus", {
			bubbles: !1,
			cancelable: !0
		});
		this.#i.onOpenAutoFocus.current(e), e.defaultPrevented || requestAnimationFrame(() => {
			if (!this.#t || this.#e || !this.#n.isActiveScope(this) || this.#t.contains(mt(O(this.#t.ownerDocument), this.#t))) return;
			let e = this.#u();
			e ? (e.focus({ preventScroll: !0 }), this.#n.setFocusMemory(this, e)) : this.#t.focus({ preventScroll: !0 });
		});
	}
	#s() {
		let e = new CustomEvent("focusScope.onCloseAutoFocus", {
			bubbles: !1,
			cancelable: !0
		});
		if (this.#i.onCloseAutoFocus.current?.(e), !e.defaultPrevented) {
			let e = this.#n.getPreFocusMemory(this);
			if (e && e.isConnected) try {
				e.focus({ preventScroll: !0 });
			} catch {
				document.body.focus();
			}
		}
	}
	#c() {
		if (!this.#t || !this.#i.trap.current) return;
		let t = this.#t, n = t.ownerDocument;
		this.#r.push(e(n, "focusin", (e) => {
			if (this.#e || !this.#n.isActiveScope(this)) return;
			let n = mt(e.composedPath()[0], t);
			if (n !== null && t.contains(n)) this.#n.setFocusMemory(this, n);
			else {
				let n = this.#n.getFocusMemory(this);
				if (n && t.contains(n) && pt(n)) e.preventDefault(), n.focus({ preventScroll: !0 });
				else {
					let e = this.#u(), n = this.#d()[0];
					(e || n || t).focus({ preventScroll: !0 });
				}
			}
		}, { capture: !0 }), e(t, "keydown", (e) => {
			if (!this.#i.loop || this.#e || e.key !== "Tab" || !this.#n.isActiveScope(this)) return;
			let t = this.#l();
			if (t.length === 0) return;
			let r = t[0], i = t[t.length - 1];
			!e.shiftKey && O(n) === i ? (e.preventDefault(), r.focus()) : e.shiftKey && O(n) === r && (e.preventDefault(), i.focus());
		}));
		let r = new MutationObserver(() => {
			let e = this.#n.getFocusMemory(this);
			if (e && !t.contains(e)) {
				let e = this.#u(), n = this.#d()[0], r = e || n;
				r ? (r.focus({ preventScroll: !0 }), this.#n.setFocusMemory(this, r)) : t.focus({ preventScroll: !0 });
			}
		});
		r.observe(t, {
			childList: !0,
			subtree: !0
		}), this.#r.push(() => r.disconnect());
	}
	#l() {
		return this.#t ? lt(this.#t, {
			includeContainer: !1,
			getShadowRoot: !0
		}) : [];
	}
	#u() {
		return this.#l()[0] || null;
	}
	#d() {
		return this.#t ? ut(this.#t, {
			includeContainer: !1,
			getShadowRoot: !0
		}) : [];
	}
	static use(e) {
		let n = null;
		return k([() => e.ref.current, () => e.enabled.current], ([r, i]) => {
			r && i ? (n ||= new t(e), n.mount(r)) : n &&= (n.unmount(), null);
		}), P(() => {
			n?.unmount();
		}), { get props() {
			return { tabindex: -1 };
		} };
	}
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/focus-scope/focus-scope.svelte
function gt(e, r) {
	t(r, !0);
	let i = y(r, "enabled", 3, !1), a = y(r, "trapFocus", 3, !1), u = y(r, "loop", 3, !1), d = y(r, "onCloseAutoFocus", 3, F), p = y(r, "onOpenAutoFocus", 3, F), m = ht.use({
		enabled: I(() => i()),
		trap: I(() => a()),
		loop: h(() => u()),
		onCloseAutoFocus: I(() => d()),
		onOpenAutoFocus: I(() => p()),
		ref: h(() => r.ref)
	});
	var g = n(), _ = f(g);
	s(_, () => r.focusScope ?? o, () => ({ props: m.props })), l(e, g), c();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/text-selection-layer/use-text-selection-layer.svelte.js
var _t = () => {};
globalThis.bitsTextSelectionLayers ??= /* @__PURE__ */ new Map();
var vt = class t {
	static create(e) {
		return new t(e);
	}
	opts;
	domContext;
	#e = F;
	#t = !1;
	#n = _t;
	#r = _t;
	constructor(e) {
		this.opts = e, this.domContext = new ae(e.ref);
		let t = F;
		k(() => [
			this.opts.enabled.current,
			this.opts.onPointerDown.current,
			this.opts.onPointerUp.current
		], ([e, n, r]) => (this.#t = e, this.#n = n, this.#r = r, e && (globalThis.bitsTextSelectionLayers.set(this, this.opts.enabled), t(), t = this.#i()), () => {
			this.#t = !1, t(), this.#s(), globalThis.bitsTextSelectionLayers.delete(this);
		}));
	}
	#i() {
		return M(e(this.domContext.getDocument(), "pointerdown", this.#o), e(this.domContext.getDocument(), "pointerup", this.#a));
	}
	#a = (e) => {
		this.#s(), !e.defaultPrevented && this.#r(e);
	};
	#o = (e) => {
		if (!this.#t) return;
		this.#s();
		let t = this.opts.ref.current, n = e.target;
		de(t) && de(n) && xt(this) && te(t, n) && (this.#n(e), !e.defaultPrevented && (this.#e = bt(t, this.domContext.getDocument().body)));
	};
	#s = () => {
		this.#e(), this.#e = F;
	};
}, yt = (e) => e.style.userSelect || e.style.webkitUserSelect;
function bt(e, t) {
	let n = yt(t), r = yt(e);
	return K(t, "none"), K(e, "text"), () => {
		K(t, n), K(e, r);
	};
}
function K(e, t) {
	e.style.userSelect = t, e.style.webkitUserSelect = t;
}
function xt(e) {
	let t = [...globalThis.bitsTextSelectionLayers];
	if (!t.length) return !1;
	let n = t.at(-1);
	return n ? n[0] === e : !1;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/text-selection-layer/text-selection-layer.svelte
function St(e, r) {
	t(r, !0);
	let i = y(r, "preventOverflowTextSelection", 3, !0), a = y(r, "onPointerDown", 3, F), u = y(r, "onPointerUp", 3, F);
	vt.create({
		id: I(() => r.id),
		onPointerDown: I(() => a()),
		onPointerUp: I(() => u()),
		enabled: I(() => r.enabled && i()),
		ref: h(() => r.ref)
	});
	var d = n(), p = f(d);
	s(p, () => r.children ?? o), l(e, d), c();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/shared-state.svelte.js
var Ct = class {
	#e;
	#t = 0;
	#n = S();
	#r;
	constructor(e) {
		this.#e = e;
	}
	#i() {
		--this.#t, this.#r && this.#t <= 0 && (this.#r(), p(this.#n, void 0), this.#r = void 0);
	}
	get(...e) {
		return this.#t += 1, _(this.#n) === void 0 && (this.#r = v(() => {
			p(this.#n, this.#e(...e), !0);
		})), d(() => () => {
			this.#i();
		}), _(this.#n);
	}
}, q = new E(), wt = [
	"padding-right",
	"margin-right",
	"overflow",
	"overflow-x",
	"overflow-y",
	"pointer-events",
	"--scrollbar-width"
], J = null, Tt = !1, Y = /* @__PURE__ */ new Set(), X = null, Z = null, Q = !1;
function $(e, t, n) {
	e.setProperty(t, n), Y.add(t), t === "overflow" && (Y.add("overflow-x"), Y.add("overflow-y"));
}
var Et = I(() => {
	for (let e of q.values()) if (e) return !0;
	return !1;
}), Dt = null, Ot = new Ct(() => {
	function t(e, t) {
		let n = J?.get(t);
		n?.value ? e.body.style.setProperty(t, n.value, n.priority) : e.body.style.removeProperty(t);
	}
	function n(e) {
		for (let n of wt) Y.has(n) && t(e, n);
		!Tt && e.body.style.length === 0 && e.body.removeAttribute("style"), J = null, Y.clear(), ue && X?.();
	}
	function r(e) {
		Y.delete("pointer-events") && t(e, "pointer-events");
	}
	function i() {
		Z !== null && (window.clearTimeout(Z), Z = null);
	}
	function a(e, t) {
		i(), Q = !0, Dt = Date.now();
		let n = Dt, r = () => {
			Z = null, Dt === n && (At(q) ? Q = !1 : (Q = !1, t()));
		}, a = e === null ? 24 : e;
		Z = window.setTimeout(r, a);
	}
	function o() {
		if (J === null && q.size === 0 && !Q) {
			Tt = document.body.hasAttribute("style"), J = /* @__PURE__ */ new Map();
			for (let e of wt) J.set(e, {
				value: document.body.style.getPropertyValue(e),
				priority: document.body.style.getPropertyPriority(e)
			});
		}
	}
	return k(() => Et.current, () => {
		if (!Et.current) return;
		o(), Q = !1;
		let t = getComputedStyle(document.documentElement), n = getComputedStyle(document.body), r = t.scrollbarGutter?.includes("stable") || n.scrollbarGutter?.includes("stable"), i = window.innerWidth - document.documentElement.clientWidth, a = {
			padding: Number.parseInt(n.paddingRight ?? "0", 10) + i,
			margin: Number.parseInt(n.marginRight ?? "0", 10)
		};
		i > 0 && !r && ($(document.body.style, "padding-right", `${a.padding}px`), $(document.body.style, "margin-right", `${a.margin}px`), $(document.body.style, "--scrollbar-width", `${i}px`)), $(document.body.style, "overflow", "hidden"), ue && (X = e(document, "touchmove", (e) => {
			e.target === document.documentElement && (e.touches.length > 1 || e.preventDefault());
		}, { passive: !1 })), ne(() => {
			$(document.body.style, "pointer-events", "none"), $(document.body.style, "overflow", "hidden");
		});
	}), P(() => () => {
		X?.();
	}), {
		get lockMap() {
			return q;
		},
		resetBodyStyle: n,
		restorePointerEvents: r,
		scheduleCleanupIfNoNewLocks: a,
		cancelPendingCleanup: i,
		ensureInitialStyleCaptured: o
	};
}), kt = class {
	#e = fe();
	#t;
	#n = () => null;
	#r;
	locked;
	constructor(e, t = () => null) {
		this.#t = e, this.#n = t, this.#r = Ot.get(), this.#r && (this.#r.cancelPendingCleanup(), this.#r.ensureInitialStyleCaptured(), this.#r.lockMap.set(this.#e, this.#t ?? !1), this.locked = I(() => this.#r.lockMap.get(this.#e) ?? !1, (e) => this.#r.lockMap.set(this.#e, e)), P(() => {
			if (this.#r.lockMap.delete(this.#e), At(this.#r.lockMap)) return;
			let e = this.#n(), t = document;
			this.#r.restorePointerEvents(t), this.#r.scheduleCleanupIfNoNewLocks(e, () => {
				this.#r.resetBodyStyle(t);
			});
		}));
	}
};
function At(e) {
	for (let [t, n] of e) if (n) return !0;
	return !1;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/scroll-lock/scroll-lock.svelte
function jt(e, n) {
	t(n, !0);
	let r = y(n, "preventScroll", 3, !0), i = y(n, "restoreScrollDelay", 3, null);
	h(() => {
		r() && new kt(r(), () => i());
	}), c();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/dialog/components/dialog-overlay.svelte
var Mt = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"forceMount",
	"child",
	"children",
	"ref"
]), Nt = i("<div><!></div>");
function Pt(e, i) {
	let d = r();
	t(i, !0);
	let p = y(i, "id", 19, () => N(d)), h = y(i, "forceMount", 3, !1), g = y(i, "ref", 15, null), v = m(i, Mt), b = Se.create({
		id: I(() => p()),
		ref: I(() => g(), (e) => g(e))
	}), S = C(() => A(v, b.props));
	var T = n(), E = f(T), D = (e) => {
		var t = n(), r = f(t), c = (e) => {
			var t = n(), r = f(t);
			{
				let e = C(() => ({
					props: A(_(S)),
					...b.snippetProps
				}));
				s(r, () => i.child, () => _(e));
			}
			l(e, t);
		}, d = (e) => {
			var t = Nt();
			u(t, (e) => ({ ...e }), [() => A(_(S))]);
			var n = x(t);
			s(n, () => i.children ?? o, () => b.snippetProps), a(t), l(e, t);
		};
		w(r, (e) => {
			i.child ? e(c) : e(d, -1);
		}), l(e, t);
	};
	w(E, (e) => {
		(b.shouldRender || h()) && e(D);
	}), l(e, T), c();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/dialog/components/dialog-description.svelte
var Ft = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"children",
	"child",
	"ref"
]), It = i("<div><!></div>");
function Lt(e, i) {
	let d = r();
	t(i, !0);
	let p = y(i, "id", 19, () => N(d)), h = y(i, "ref", 15, null), g = m(i, Ft), v = be.create({
		id: I(() => p()),
		ref: I(() => h(), (e) => h(e))
	}), b = C(() => A(g, v.props));
	var S = n(), T = f(S), E = (e) => {
		var t = n(), r = f(t);
		s(r, () => i.child, () => ({ props: _(b) })), l(e, t);
	}, D = (e) => {
		var t = It();
		u(t, () => ({ ..._(b) }));
		var n = x(t);
		s(n, () => i.children ?? o), a(t), l(e, t);
	};
	w(T, (e) => {
		i.child ? e(E) : e(D, -1);
	}), l(e, S), c();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/dialogCloseFocus.ts
function Rt(e, t) {
	return !t || e !== t && !t.contains(e);
}
function zt(e) {
	if (!e) return null;
	let t = e.activeElement;
	for (; t?.shadowRoot;) {
		let e = t.shadowRoot.activeElement;
		if (!e || e === t) break;
		t = e;
	}
	return !(t instanceof HTMLElement) || t === e.body || t === e.documentElement ? null : t;
}
function Bt(e, t, n) {
	return !t || !Rt(t, n) ? e : t;
}
function Vt(e, t, n) {
	let r = e ? [e, t] : [t];
	for (let e of r) if (e instanceof HTMLElement && e.isConnected && Rt(e, n)) return e;
	return null;
}
function Ht(e) {
	try {
		e.focus({ preventScroll: !0 });
	} catch {}
}
function Ut(e, t) {
	if (e.preventDefault(), !t.restore) return;
	let n = Vt(t.explicit, t.opener, t.container);
	n && Ht(n);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/useDialogHistory.svelte.ts
function Wt(e, t, n = !0) {
	if (typeof window > "u" || !(T().historyEnabled && (typeof n == "function" ? n() : n))) return;
	let r = null, i = !1, a = (n) => {
		e() && n.state?.modalId !== r && t() === !1 && e() && r && history.pushState({ modalId: r }, "", window.location.href);
	};
	d(() => {
		let t = e();
		if (t && !i) r = `modal-${me()}`, history.pushState({ modalId: r }, "", window.location.href), i = !0;
		else if (!t && i) {
			let e = history.state?.modalId === r;
			r = null, i = !1, e && history.back();
		}
	}), g(() => {
		window.addEventListener("popstate", a);
	}), b(() => {
		window.removeEventListener("popstate", a), i && history.state?.modalId === r && history.back();
	});
}
export { L as S, Ce as _, Lt as a, xe as b, St as c, pt as d, dt as f, Ee as g, Le as h, Bt as i, gt as l, Be as m, Ut as n, Pt as o, lt as p, zt as r, jt as s, Wt as t, ut as u, ve as v, ge as x, _e as y };
