import { B as e, Dt as t, Et as n, F as r, G as i, K as a, Nt as o, Pt as s, St as c, Y as l, _t as u, at as d, dt as f, et as p, ft as m, i as h, lt as g, n as _, q as v, r as y, rt as b, st as x, t as S, v as C, yt as w } from "./index-client-DEFG3Gqk.js";
import { n as T } from "./appRuntimeEnvironment-Bzv9wJOh.js";
import { B as E, C as D, D as ee, E as te, F as ne, G as O, I as re, N as k, O as A, R as j, T as M, Y as ie, b as ae, g as N, l as oe, r as P, s as se, u as ce, w as le } from "./LoadingPlaceholder-YrD8D_td.js";
import { i as ue } from "./appUtils-B3-zUpkb.js";
import { _ as F, a as de, g as fe, i as I, r as pe, t as me } from "./use-id-DCa3fCKD.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/presence-manager.svelte.js
var L = class {
	#e;
	#t;
	#n;
	#r = w(!1);
	#i = w(void 0);
	#a = !1;
	#o = null;
	constructor(e) {
		this.#e = e, u(this.#r, e.open.current, !0), this.#t = e.enabled ?? !0, this.#n = new de({
			ref: this.#e.ref,
			afterTick: this.#e.open
		}), F(() => this.#s()), k(() => this.#e.open.current, (e) => {
			this.#a ? (this.#s(), !e && this.#e.shouldSkipExitAnimation?.() ? (u(this.#r, !1), u(this.#i, void 0), this.#e.onComplete?.()) : (e && u(this.#r, !0), u(this.#i, e ? "starting" : "ending", !0), e && (this.#o = window.requestAnimationFrame(() => {
				this.#o = null, this.#e.open.current && u(this.#i, void 0);
			})), this.#t ? this.#n.run(() => {
				e === this.#e.open.current && (this.#e.open.current || u(this.#r, !1), u(this.#i, void 0), this.#e.onComplete?.());
			}) : (e || u(this.#r, !1), u(this.#i, void 0), this.#e.onComplete?.()))) : this.#a = !0;
		});
	}
	get shouldRender() {
		return b(this.#r);
	}
	get transitionStatus() {
		return b(this.#i);
	}
	#s() {
		this.#o !== null && (window.cancelAnimationFrame(this.#o), this.#o = null);
	}
}, he = ae({
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
}), R = new ne("Dialog.Root | AlertDialog.Root"), ge = class e {
	static create(t) {
		let n = R.getOr(null);
		return R.set(new e(t, n));
	}
	opts;
	#e = w(null);
	get triggerNode() {
		return b(this.#e);
	}
	set triggerNode(e) {
		u(this.#e, e, !0);
	}
	#t = w(null);
	get contentNode() {
		return b(this.#t);
	}
	set contentNode(e) {
		u(this.#t, e, !0);
	}
	#n = w(null);
	get overlayNode() {
		return b(this.#n);
	}
	set overlayNode(e) {
		u(this.#n, e, !0);
	}
	#r = w(null);
	get descriptionNode() {
		return b(this.#r);
	}
	set descriptionNode(e) {
		u(this.#r, e, !0);
	}
	#i = w(void 0);
	get contentId() {
		return b(this.#i);
	}
	set contentId(e) {
		u(this.#i, e, !0);
	}
	#a = w(void 0);
	get titleId() {
		return b(this.#a);
	}
	set titleId(e) {
		u(this.#a, e, !0);
	}
	#o = w(void 0);
	get triggerId() {
		return b(this.#o);
	}
	set triggerId(e) {
		u(this.#o, e, !0);
	}
	#s = w(void 0);
	get descriptionId() {
		return b(this.#s);
	}
	set descriptionId(e) {
		u(this.#s, e, !0);
	}
	#c = w(null);
	get cancelNode() {
		return b(this.#c);
	}
	set cancelNode(e) {
		u(this.#c, e, !0);
	}
	#l = w(0);
	get nestedOpenCount() {
		return b(this.#l);
	}
	set nestedOpenCount(e) {
		u(this.#l, e, !0);
	}
	depth;
	parent;
	contentPresence;
	overlayPresence;
	constructor(e, t) {
		this.opts = e, this.parent = t, this.depth = t ? t.depth + 1 : 0, this.handleOpen = this.handleOpen.bind(this), this.handleClose = this.handleClose.bind(this), this.contentPresence = new L({
			ref: O(() => this.contentNode),
			open: this.opts.open,
			enabled: !0,
			onComplete: () => {
				this.opts.onOpenChangeComplete.current(this.opts.open.current);
			}
		}), this.overlayPresence = new L({
			ref: O(() => this.overlayNode),
			open: this.opts.open,
			enabled: !0
		}), k(() => this.opts.open.current, (e) => {
			this.parent && (e ? this.parent.incrementNested() : this.parent.decrementNested());
		}, { lazy: !0 }), F(() => {
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
	#u = c(() => ({ "data-state": D(this.opts.open.current) }));
	get sharedProps() {
		return b(this.#u);
	}
	set sharedProps(e) {
		u(this.#u, e);
	}
}, _e = class e {
	static create(t) {
		return new e(t, R.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = M(this.opts.ref), this.onclick = this.onclick.bind(this), this.onkeydown = this.onkeydown.bind(this);
	}
	onclick(e) {
		this.opts.disabled.current || e.button > 0 || this.root.handleClose();
	}
	onkeydown(e) {
		this.opts.disabled.current || (e.key === " " || e.key === "Enter") && (e.preventDefault(), this.root.handleClose());
	}
	#e = c(() => ({
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
		return b(this.#e);
	}
	set props(e) {
		u(this.#e, e);
	}
}, ve = class e {
	static create(t) {
		return new e(t, R.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = M(this.opts.ref);
	}
	#e = c(() => ({
		id: this.opts.id.current,
		[this.root.getBitsAttr("action")]: "",
		...this.root.sharedProps,
		...this.attachment
	}));
	get props() {
		return b(this.#e);
	}
	set props(e) {
		u(this.#e, e);
	}
}, ye = class e {
	static create(t) {
		return new e(t, R.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.root.titleId = this.opts.id.current, this.attachment = M(this.opts.ref), k.pre(() => this.opts.id.current, (e) => {
			this.root.titleId = e;
		});
	}
	#e = c(() => ({
		id: this.opts.id.current,
		role: "heading",
		"aria-level": this.opts.level.current,
		[this.root.getBitsAttr("title")]: "",
		...this.root.sharedProps,
		...this.attachment
	}));
	get props() {
		return b(this.#e);
	}
	set props(e) {
		u(this.#e, e);
	}
}, be = class e {
	static create(t) {
		return new e(t, R.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.root.descriptionId = this.opts.id.current, this.attachment = M(this.opts.ref, (e) => {
			this.root.descriptionNode = e;
		}), k.pre(() => this.opts.id.current, (e) => {
			this.root.descriptionId = e;
		});
	}
	#e = c(() => ({
		id: this.opts.id.current,
		[this.root.getBitsAttr("description")]: "",
		...this.root.sharedProps,
		...this.attachment
	}));
	get props() {
		return b(this.#e);
	}
	set props(e) {
		u(this.#e, e);
	}
}, xe = class e {
	static create(t) {
		return new e(t, R.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = M(this.opts.ref, (e) => {
			this.root.contentNode = e, this.root.contentId = e?.id;
		});
	}
	#e = c(() => ({ open: this.root.opts.open.current }));
	get snippetProps() {
		return b(this.#e);
	}
	set snippetProps(e) {
		u(this.#e, e);
	}
	#t = c(() => ({
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
		"data-nested-open": N(this.root.nestedOpenCount > 0),
		"data-nested": N(this.root.parent !== null),
		...le(this.root.contentPresence.transitionStatus),
		...this.root.sharedProps,
		...this.attachment
	}));
	get props() {
		return b(this.#t);
	}
	set props(e) {
		u(this.#t, e);
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
		this.opts = e, this.root = t, this.attachment = M(this.opts.ref, (e) => this.root.overlayNode = e);
	}
	#e = c(() => ({ open: this.root.opts.open.current }));
	get snippetProps() {
		return b(this.#e);
	}
	set snippetProps(e) {
		u(this.#e, e);
	}
	#t = c(() => ({
		id: this.opts.id.current,
		[this.root.getBitsAttr("overlay")]: "",
		style: {
			pointerEvents: "auto",
			"--bits-dialog-depth": this.root.depth,
			"--bits-dialog-nested-count": this.root.nestedOpenCount
		},
		"data-nested-open": N(this.root.nestedOpenCount > 0),
		"data-nested": N(this.root.parent !== null),
		...le(this.root.overlayPresence.transitionStatus),
		...this.root.sharedProps,
		...this.attachment
	}));
	get props() {
		return b(this.#t);
	}
	set props(e) {
		u(this.#t, e);
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
		this.opts = e, this.root = t, this.attachment = M(this.opts.ref, (e) => this.root.cancelNode = e), this.onclick = this.onclick.bind(this), this.onkeydown = this.onkeydown.bind(this);
	}
	onclick(e) {
		this.opts.disabled.current || e.button > 0 || this.root.handleClose();
	}
	onkeydown(e) {
		this.opts.disabled.current || (e.key === " " || e.key === "Enter") && (e.preventDefault(), this.root.handleClose());
	}
	#e = c(() => ({
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
		return b(this.#e);
	}
	set props(e) {
		u(this.#e, e);
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
]), Te = v("<div><!></div>");
function Ee(u, d) {
	let p = l();
	t(d, !0);
	let g = y(d, "id", 19, () => P(p)), _ = y(d, "ref", 15, null), v = y(d, "level", 3, 2), x = h(d, we), S = ye.create({
		id: O(() => g()),
		level: O(() => v()),
		ref: O(() => _(), (e) => _(e))
	}), w = c(() => j(x, S.props));
	var T = a(), E = m(T), D = (e) => {
		var t = a(), n = m(t);
		r(n, () => d.child, () => ({ props: b(w) })), i(e, t);
	}, ee = (e) => {
		var t = Te();
		C(t, () => ({ ...b(w) }));
		var n = f(t);
		r(n, () => d.children ?? s), o(t), i(e, t);
	};
	e(E, (e) => {
		d.child ? e(D) : e(ee, -1);
	}), i(u, T), n();
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
var Me = class e {
	static create(t) {
		return new e(t);
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
	#c = I;
	#l = !1;
	constructor(e) {
		this.opts = e, this.#t = e.interactOutsideBehavior, this.#e = e.onInteractOutside, this.#s = e.onFocusOutside;
		let t = I, n = null, r = () => {
			n = null, this.#y(), globalThis.bitsDismissableLayers.delete(this), this.#m.destroy(), this.#c(), t();
		};
		k([() => this.opts.enabled.current, () => this.opts.ref.current], ([e, i]) => {
			let a = e ? i : null;
			n !== a && (r(), a && (n = a, this.#o = ke(a), globalThis.bitsDismissableLayers.set(this, this.#t), t = this.#d()));
		}), F(() => {
			this.#l = !0, r();
		});
	}
	#u = (e) => {
		e.defaultPrevented || this.#l || !this.opts.ref.current || fe(() => {
			this.#l || this.opts.ref.current && !this.#v(e.target) && e.target && !this.#a && this.#s.current?.(e);
		});
	};
	#d() {
		let e = this.#o, t = (e) => {
			d(() => {
				this.#m.flush(), this.#h(e), this.#_(e);
			});
		}, n = (e) => {
			e.cancelBubble || e !== this.#i || (this.#g(e), e.pointerType === "touch" ? (this.#m.destroy(), this.#p(e)) : this.#m(e));
		};
		return e.addEventListener("pointerdown", t, !0), e.addEventListener("pointerdown", n), E(() => e.removeEventListener("pointerdown", t, !0), () => e.removeEventListener("pointerdown", n), p(e, "focusin", this.#u));
	}
	#f = (e) => {
		let t = e;
		t.defaultPrevented && (t = Ie(e)), this.#e.current(e);
	};
	#p = (e) => {
		if (!this.opts.ref.current) {
			this.#c();
			return;
		}
		let t = this.opts.isValidEvent.current(e, this.opts.ref.current) || Fe(e, this.opts.ref.current);
		if (!this.#r || this.#b() || !t) {
			this.#c();
			return;
		}
		let n = e;
		if (n.defaultPrevented && (n = Ie(n)), this.#t.current !== "close" && this.#t.current !== "defer-otherwise-close") this.#c();
		else if (e.pointerType === "touch") {
			this.#c();
			let e = null, t = I, n = (e) => {
				t(), this.#f(e);
			};
			t = E(p(this.#o, "click", n, { once: !0 }), p(this.#o, "click", (t) => {
				e = setTimeout(() => n(t), 0);
			}, {
				once: !0,
				capture: !0
			}), () => {
				e !== null && clearTimeout(e), e = null;
			}), this.#c = t;
		} else this.#e.current(n);
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
	if (!se(n)) return !1;
	let r = !!n.closest(`[${Ae}]`), i = !!t.closest(`[${je}]`);
	return "button" in e && e.button > 0 && !r ? !1 : "button" in e && e.button === 0 && r && i ? !0 : r && i ? !1 : ke(n).documentElement.contains(n) && !Oe(t, n) && pe(e, t);
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
function Le(e, o) {
	t(o, !0);
	let c = y(o, "interactOutsideBehavior", 3, "close"), l = y(o, "onInteractOutside", 3, I), u = y(o, "onFocusOutside", 3, I), f = y(o, "isValidEvent", 3, () => !1), p = Me.create({
		id: O(() => o.id),
		interactOutsideBehavior: O(() => c()),
		onInteractOutside: O(() => l()),
		enabled: O(() => o.enabled),
		onFocusOutside: O(() => u()),
		isValidEvent: O(() => f()),
		ref: d(() => o.ref)
	});
	var h = a(), g = m(h);
	r(g, () => o.children ?? s, () => ({ props: p.props })), i(e, h), n();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/escape-layer/use-escape-layer.svelte.js
globalThis.bitsEscapeLayers ??= /* @__PURE__ */ new Map();
var Re = class e {
	static create(t) {
		return new e(t);
	}
	opts;
	domContext;
	constructor(e) {
		this.opts = e, this.domContext = new te(this.opts.ref);
		let t = I;
		k(() => e.enabled.current, (n) => (n && (globalThis.bitsEscapeLayers.set(this, e.escapeKeydownBehavior), t = this.#e()), () => {
			t(), globalThis.bitsEscapeLayers.delete(this);
		}));
	}
	#e = () => p(this.domContext.getDocument(), "keydown", this.#t, { passive: !1 });
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
function Be(e, o) {
	t(o, !0);
	let c = y(o, "escapeKeydownBehavior", 3, "close"), l = y(o, "onEscapeKeydown", 3, I);
	Re.create({
		escapeKeydownBehavior: O(() => c()),
		onEscapeKeydown: O(() => l()),
		enabled: O(() => o.enabled),
		ref: d(() => o.ref)
	});
	var u = a(), f = m(u);
	r(f, () => o.children ?? s), i(e, u), n();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/focus-scope/focus-scope-manager.js
var Ve = class e {
	static instance;
	#e = ie([]);
	#t = /* @__PURE__ */ new WeakMap();
	#n = /* @__PURE__ */ new WeakMap();
	static getInstance() {
		return this.instance ||= new e(), this.instance;
	}
	register(e) {
		let t = this.getActive();
		t && t !== e && t.pause();
		let n = A(document);
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
var ht = class e {
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
			if (!this.#t || this.#e || !this.#n.isActiveScope(this) || this.#t.contains(mt(A(this.#t.ownerDocument), this.#t))) return;
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
		let e = this.#t, t = e.ownerDocument;
		this.#r.push(p(t, "focusin", (t) => {
			if (this.#e || !this.#n.isActiveScope(this)) return;
			let n = mt(t.composedPath()[0], e);
			if (n !== null && e.contains(n)) this.#n.setFocusMemory(this, n);
			else {
				let n = this.#n.getFocusMemory(this);
				if (n && e.contains(n) && pt(n)) t.preventDefault(), n.focus({ preventScroll: !0 });
				else {
					let t = this.#u(), n = this.#d()[0];
					(t || n || e).focus({ preventScroll: !0 });
				}
			}
		}, { capture: !0 }), p(e, "keydown", (e) => {
			if (!this.#i.loop || this.#e || e.key !== "Tab" || !this.#n.isActiveScope(this)) return;
			let n = this.#l();
			if (n.length === 0) return;
			let r = n[0], i = n[n.length - 1];
			!e.shiftKey && A(t) === i ? (e.preventDefault(), r.focus()) : e.shiftKey && A(t) === r && (e.preventDefault(), i.focus());
		}));
		let n = new MutationObserver(() => {
			let t = this.#n.getFocusMemory(this);
			if (t && !e.contains(t)) {
				let t = this.#u(), n = this.#d()[0], r = t || n;
				r ? (r.focus({ preventScroll: !0 }), this.#n.setFocusMemory(this, r)) : e.focus({ preventScroll: !0 });
			}
		});
		n.observe(e, {
			childList: !0,
			subtree: !0
		}), this.#r.push(() => n.disconnect());
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
	static use(t) {
		let n = null;
		return k([() => t.ref.current, () => t.enabled.current], ([r, i]) => {
			r && i ? (n ||= new e(t), n.mount(r)) : n &&= (n.unmount(), null);
		}), F(() => {
			n?.unmount();
		}), { get props() {
			return { tabindex: -1 };
		} };
	}
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/focus-scope/focus-scope.svelte
function gt(e, o) {
	t(o, !0);
	let c = y(o, "enabled", 3, !1), l = y(o, "trapFocus", 3, !1), u = y(o, "loop", 3, !1), f = y(o, "onCloseAutoFocus", 3, I), p = y(o, "onOpenAutoFocus", 3, I), h = ht.use({
		enabled: O(() => c()),
		trap: O(() => l()),
		loop: d(() => u()),
		onCloseAutoFocus: O(() => f()),
		onOpenAutoFocus: O(() => p()),
		ref: d(() => o.ref)
	});
	var g = a(), _ = m(g);
	r(_, () => o.focusScope ?? s, () => ({ props: h.props })), i(e, g), n();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/text-selection-layer/use-text-selection-layer.svelte.js
var _t = () => {};
globalThis.bitsTextSelectionLayers ??= /* @__PURE__ */ new Map();
var vt = class e {
	static create(t) {
		return new e(t);
	}
	opts;
	domContext;
	#e = I;
	#t = !1;
	#n = _t;
	#r = _t;
	constructor(e) {
		this.opts = e, this.domContext = new te(e.ref);
		let t = I;
		k(() => [
			this.opts.enabled.current,
			this.opts.onPointerDown.current,
			this.opts.onPointerUp.current
		], ([e, n, r]) => (this.#t = e, this.#n = n, this.#r = r, e && (globalThis.bitsTextSelectionLayers.set(this, this.opts.enabled), t(), t = this.#i()), () => {
			this.#t = !1, t(), this.#s(), globalThis.bitsTextSelectionLayers.delete(this);
		}));
	}
	#i() {
		return E(p(this.domContext.getDocument(), "pointerdown", this.#o), p(this.domContext.getDocument(), "pointerup", this.#a));
	}
	#a = (e) => {
		this.#s(), !e.defaultPrevented && this.#r(e);
	};
	#o = (e) => {
		if (!this.#t) return;
		this.#s();
		let t = this.opts.ref.current, n = e.target;
		oe(t) && oe(n) && xt(this) && ee(t, n) && (this.#n(e), !e.defaultPrevented && (this.#e = bt(t, this.domContext.getDocument().body)));
	};
	#s = () => {
		this.#e(), this.#e = I;
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
function St(e, o) {
	t(o, !0);
	let c = y(o, "preventOverflowTextSelection", 3, !0), l = y(o, "onPointerDown", 3, I), u = y(o, "onPointerUp", 3, I);
	vt.create({
		id: O(() => o.id),
		onPointerDown: O(() => l()),
		onPointerUp: O(() => u()),
		enabled: O(() => o.enabled && c()),
		ref: d(() => o.ref)
	});
	var f = a(), p = m(f);
	r(p, () => o.children ?? s), i(e, f), n();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/shared-state.svelte.js
var Ct = class {
	#e;
	#t = 0;
	#n = w();
	#r;
	constructor(e) {
		this.#e = e;
	}
	#i() {
		--this.#t, this.#r && this.#t <= 0 && (this.#r(), u(this.#n, void 0), this.#r = void 0);
	}
	get(...e) {
		return this.#t += 1, b(this.#n) === void 0 && (this.#r = x(() => {
			u(this.#n, this.#e(...e), !0);
		})), g(() => () => {
			this.#i();
		}), b(this.#n);
	}
}, q = new re(), wt = [
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
var Et = O(() => {
	for (let e of q.values()) if (e) return !0;
	return !1;
}), Dt = null, Ot = new Ct(() => {
	function e(e, t) {
		let n = J?.get(t);
		n?.value ? e.body.style.setProperty(t, n.value, n.priority) : e.body.style.removeProperty(t);
	}
	function t(t) {
		for (let n of wt) Y.has(n) && e(t, n);
		!Tt && t.body.style.length === 0 && t.body.removeAttribute("style"), J = null, Y.clear(), ce && X?.();
	}
	function n(t) {
		Y.delete("pointer-events") && e(t, "pointer-events");
	}
	function r() {
		Z !== null && (window.clearTimeout(Z), Z = null);
	}
	function i(e, t) {
		r(), Q = !0, Dt = Date.now();
		let n = Dt, i = () => {
			Z = null, Dt === n && (At(q) ? Q = !1 : (Q = !1, t()));
		}, a = e === null ? 24 : e;
		Z = window.setTimeout(i, a);
	}
	function a() {
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
		a(), Q = !1;
		let e = getComputedStyle(document.documentElement), t = getComputedStyle(document.body), n = e.scrollbarGutter?.includes("stable") || t.scrollbarGutter?.includes("stable"), r = window.innerWidth - document.documentElement.clientWidth, i = {
			padding: Number.parseInt(t.paddingRight ?? "0", 10) + r,
			margin: Number.parseInt(t.marginRight ?? "0", 10)
		};
		r > 0 && !n && ($(document.body.style, "padding-right", `${i.padding}px`), $(document.body.style, "margin-right", `${i.margin}px`), $(document.body.style, "--scrollbar-width", `${r}px`)), $(document.body.style, "overflow", "hidden"), ce && (X = p(document, "touchmove", (e) => {
			e.target === document.documentElement && (e.touches.length > 1 || e.preventDefault());
		}, { passive: !1 })), fe(() => {
			$(document.body.style, "pointer-events", "none"), $(document.body.style, "overflow", "hidden");
		});
	}), F(() => () => {
		X?.();
	}), {
		get lockMap() {
			return q;
		},
		resetBodyStyle: t,
		restorePointerEvents: n,
		scheduleCleanupIfNoNewLocks: i,
		cancelPendingCleanup: r,
		ensureInitialStyleCaptured: a
	};
}), kt = class {
	#e = me();
	#t;
	#n = () => null;
	#r;
	locked;
	constructor(e, t = () => null) {
		this.#t = e, this.#n = t, this.#r = Ot.get(), this.#r && (this.#r.cancelPendingCleanup(), this.#r.ensureInitialStyleCaptured(), this.#r.lockMap.set(this.#e, this.#t ?? !1), this.locked = O(() => this.#r.lockMap.get(this.#e) ?? !1, (e) => this.#r.lockMap.set(this.#e, e)), F(() => {
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
function jt(e, r) {
	t(r, !0);
	let i = y(r, "preventScroll", 3, !0), a = y(r, "restoreScrollDelay", 3, null);
	d(() => {
		i() && new kt(i(), () => a());
	}), n();
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
]), Nt = v("<div><!></div>");
function Pt(u, d) {
	let p = l();
	t(d, !0);
	let g = y(d, "id", 19, () => P(p)), _ = y(d, "forceMount", 3, !1), v = y(d, "ref", 15, null), x = h(d, Mt), S = Se.create({
		id: O(() => g()),
		ref: O(() => v(), (e) => v(e))
	}), w = c(() => j(x, S.props));
	var T = a(), E = m(T), D = (t) => {
		var n = a(), l = m(n), u = (e) => {
			var t = a(), n = m(t);
			{
				let e = c(() => ({
					props: j(b(w)),
					...S.snippetProps
				}));
				r(n, () => d.child, () => b(e));
			}
			i(e, t);
		}, p = (e) => {
			var t = Nt();
			C(t, (e) => ({ ...e }), [() => j(b(w))]);
			var n = f(t);
			r(n, () => d.children ?? s, () => S.snippetProps), o(t), i(e, t);
		};
		e(l, (e) => {
			d.child ? e(u) : e(p, -1);
		}), i(t, n);
	};
	e(E, (e) => {
		(S.shouldRender || _()) && e(D);
	}), i(u, T), n();
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
]), It = v("<div><!></div>");
function Lt(u, d) {
	let p = l();
	t(d, !0);
	let g = y(d, "id", 19, () => P(p)), _ = y(d, "ref", 15, null), v = h(d, Ft), x = be.create({
		id: O(() => g()),
		ref: O(() => _(), (e) => _(e))
	}), S = c(() => j(v, x.props));
	var w = a(), T = m(w), E = (e) => {
		var t = a(), n = m(t);
		r(n, () => d.child, () => ({ props: b(S) })), i(e, t);
	}, D = (e) => {
		var t = It();
		C(t, () => ({ ...b(S) }));
		var n = f(t);
		r(n, () => d.children ?? s), o(t), i(e, t);
	};
	e(T, (e) => {
		d.child ? e(E) : e(D, -1);
	}), i(u, w), n();
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
	g(() => {
		let t = e();
		if (t && !i) r = `modal-${ue()}`, history.pushState({ modalId: r }, "", window.location.href), i = !0;
		else if (!t && i) {
			let e = history.state?.modalId === r;
			r = null, i = !1, e && history.back();
		}
	}), _(() => {
		window.addEventListener("popstate", a);
	}), S(() => {
		window.removeEventListener("popstate", a), i && history.state?.modalId === r && history.back();
	});
}
export { L as S, Ce as _, Lt as a, xe as b, St as c, pt as d, dt as f, Ee as g, Le as h, Bt as i, gt as l, Be as m, Ut as n, Pt as o, lt as p, zt as r, jt as s, Wt as t, ut as u, ve as v, ge as x, _e as y };
