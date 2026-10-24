import { At as e, Ct as t, G as n, K as r, N as i, R as a, U as o, W as s, Z as c, ct as l, et as u, g as d, gt as f, i as p, it as m, jt as h, lt as g, mt as _, n as v, nt as y, ot as b, r as x, t as S, wt as C, yt as w } from "./index-client-Bdka-Daw.js";
import { n as T } from "./appRuntimeEnvironment-BvtUCHcA.js";
import { $ as E, B as D, F as ee, H as te, K as ne, Q as re, R as ie, U as O, V as ae, X as k, a as oe, c as se, dt as ce, et as A, f as le, h as ue, j, m as de, nt as M, o as N, q as P, r as fe, s as F, st as I, z as pe } from "./LoadingPlaceholder-j1_vRYno.js";
import { a as me } from "./appUtils-Bsk0mFqn.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/presence-manager.svelte.js
var L = class {
	#e;
	#t;
	#n;
	#r = f(!1);
	#i = f(void 0);
	#a = !1;
	#o = null;
	constructor(e) {
		this.#e = e, _(this.#r, e.open.current, !0), this.#t = e.enabled ?? !0, this.#n = new se({
			ref: this.#e.ref,
			afterTick: this.#e.open
		}), P(() => this.#s()), k(() => this.#e.open.current, (e) => {
			this.#a ? (this.#s(), !e && this.#e.shouldSkipExitAnimation?.() ? (_(this.#r, !1), _(this.#i, void 0), this.#e.onComplete?.()) : (e && _(this.#r, !0), _(this.#i, e ? "starting" : "ending", !0), e && (this.#o = window.requestAnimationFrame(() => {
				this.#o = null, this.#e.open.current && _(this.#i, void 0);
			})), this.#t ? this.#n.run(() => {
				e === this.#e.open.current && (this.#e.open.current || _(this.#r, !1), _(this.#i, void 0), this.#e.onComplete?.());
			}) : (e || _(this.#r, !1), _(this.#i, void 0), this.#e.onComplete?.()))) : this.#a = !0;
		});
	}
	get shouldRender() {
		return u(this.#r);
	}
	get transitionStatus() {
		return u(this.#i);
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
	#e = f(null);
	get triggerNode() {
		return u(this.#e);
	}
	set triggerNode(e) {
		_(this.#e, e, !0);
	}
	#t = f(null);
	get contentNode() {
		return u(this.#t);
	}
	set contentNode(e) {
		_(this.#t, e, !0);
	}
	#n = f(null);
	get overlayNode() {
		return u(this.#n);
	}
	set overlayNode(e) {
		_(this.#n, e, !0);
	}
	#r = f(null);
	get descriptionNode() {
		return u(this.#r);
	}
	set descriptionNode(e) {
		_(this.#r, e, !0);
	}
	#i = f(void 0);
	get contentId() {
		return u(this.#i);
	}
	set contentId(e) {
		_(this.#i, e, !0);
	}
	#a = f(void 0);
	get titleId() {
		return u(this.#a);
	}
	set titleId(e) {
		_(this.#a, e, !0);
	}
	#o = f(void 0);
	get triggerId() {
		return u(this.#o);
	}
	set triggerId(e) {
		_(this.#o, e, !0);
	}
	#s = f(void 0);
	get descriptionId() {
		return u(this.#s);
	}
	set descriptionId(e) {
		_(this.#s, e, !0);
	}
	#c = f(null);
	get cancelNode() {
		return u(this.#c);
	}
	set cancelNode(e) {
		_(this.#c, e, !0);
	}
	#l = f(0);
	get nestedOpenCount() {
		return u(this.#l);
	}
	set nestedOpenCount(e) {
		_(this.#l, e, !0);
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
	#u = w(() => ({ "data-state": ie(this.opts.open.current) }));
	get sharedProps() {
		return u(this.#u);
	}
	set sharedProps(e) {
		_(this.#u, e);
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
	#e = w(() => ({
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
		return u(this.#e);
	}
	set props(e) {
		_(this.#e, e);
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
	#e = w(() => ({
		id: this.opts.id.current,
		[this.root.getBitsAttr("action")]: "",
		...this.root.sharedProps,
		...this.attachment
	}));
	get props() {
		return u(this.#e);
	}
	set props(e) {
		_(this.#e, e);
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
	#e = w(() => ({
		id: this.opts.id.current,
		role: "heading",
		"aria-level": this.opts.level.current,
		[this.root.getBitsAttr("title")]: "",
		...this.root.sharedProps,
		...this.attachment
	}));
	get props() {
		return u(this.#e);
	}
	set props(e) {
		_(this.#e, e);
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
	#e = w(() => ({
		id: this.opts.id.current,
		[this.root.getBitsAttr("description")]: "",
		...this.root.sharedProps,
		...this.attachment
	}));
	get props() {
		return u(this.#e);
	}
	set props(e) {
		_(this.#e, e);
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
	#e = w(() => ({ open: this.root.opts.open.current }));
	get snippetProps() {
		return u(this.#e);
	}
	set snippetProps(e) {
		_(this.#e, e);
	}
	#t = w(() => ({
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
		return u(this.#t);
	}
	set props(e) {
		_(this.#t, e);
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
	#e = w(() => ({ open: this.root.opts.open.current }));
	get snippetProps() {
		return u(this.#e);
	}
	set snippetProps(e) {
		_(this.#e, e);
	}
	#t = w(() => ({
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
		return u(this.#t);
	}
	set props(e) {
		_(this.#t, e);
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
	#e = w(() => ({
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
		return u(this.#e);
	}
	set props(e) {
		_(this.#e, e);
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
]), Te = n("<div><!></div>");
function Ee(n, c) {
	let f = r();
	C(c, !0);
	let m = x(c, "id", 19, () => N(f)), _ = x(c, "ref", 15, null), v = x(c, "level", 3, 2), y = p(c, we), b = ye.create({
		id: I(() => m()),
		level: I(() => v()),
		ref: I(() => _(), (e) => _(e))
	}), S = w(() => A(y, b.props));
	var T = s(), E = g(T), D = (e) => {
		var t = s(), n = g(t);
		i(n, () => c.child, () => ({ props: u(S) })), o(e, t);
	}, ee = (t) => {
		var n = Te();
		d(n, () => ({ ...u(S) }));
		var r = l(n);
		i(r, () => c.children ?? h), e(n), o(t, n);
	};
	a(E, (e) => {
		c.child ? e(D) : e(ee, -1);
	}), o(n, T), t();
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
		let e = this.#o, t = (e) => {
			y(() => {
				this.#m.flush(), this.#h(e), this.#_(e);
			});
		}, n = (e) => {
			e.cancelBubble || e !== this.#i || (this.#g(e), e.pointerType === "touch" ? (this.#m.destroy(), this.#p(e)) : this.#m(e));
		};
		return e.addEventListener("pointerdown", t, !0), e.addEventListener("pointerdown", n), M(() => e.removeEventListener("pointerdown", t, !0), () => e.removeEventListener("pointerdown", n), c(e, "focusin", this.#u));
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
			let e = null, t = F, n = (e) => {
				t(), this.#f(e);
			};
			t = M(c(this.#o, "click", n, { once: !0 }), c(this.#o, "click", (t) => {
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
function Le(e, n) {
	C(n, !0);
	let r = x(n, "interactOutsideBehavior", 3, "close"), a = x(n, "onInteractOutside", 3, F), c = x(n, "onFocusOutside", 3, F), l = x(n, "isValidEvent", 3, () => !1), u = Me.create({
		id: I(() => n.id),
		interactOutsideBehavior: I(() => r()),
		onInteractOutside: I(() => a()),
		enabled: I(() => n.enabled),
		onFocusOutside: I(() => c()),
		isValidEvent: I(() => l()),
		ref: y(() => n.ref)
	});
	var d = s(), f = g(d);
	i(f, () => n.children ?? h, () => ({ props: u.props })), o(e, d), t();
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
		this.opts = e, this.domContext = new ae(this.opts.ref);
		let t = F;
		k(() => e.enabled.current, (n) => (n && (globalThis.bitsEscapeLayers.set(this, e.escapeKeydownBehavior), t = this.#e()), () => {
			t(), globalThis.bitsEscapeLayers.delete(this);
		}));
	}
	#e = () => c(this.domContext.getDocument(), "keydown", this.#t, { passive: !1 });
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
function Be(e, n) {
	C(n, !0);
	let r = x(n, "escapeKeydownBehavior", 3, "close"), a = x(n, "onEscapeKeydown", 3, F);
	Re.create({
		escapeKeydownBehavior: I(() => r()),
		onEscapeKeydown: I(() => a()),
		enabled: I(() => n.enabled),
		ref: y(() => n.ref)
	});
	var c = s(), l = g(c);
	i(l, () => n.children ?? h), o(e, c), t();
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
		let e = this.#t, t = e.ownerDocument;
		this.#r.push(c(t, "focusin", (t) => {
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
		}, { capture: !0 }), c(e, "keydown", (e) => {
			if (!this.#i.loop || this.#e || e.key !== "Tab" || !this.#n.isActiveScope(this)) return;
			let n = this.#l();
			if (n.length === 0) return;
			let r = n[0], i = n[n.length - 1];
			!e.shiftKey && O(t) === i ? (e.preventDefault(), r.focus()) : e.shiftKey && O(t) === r && (e.preventDefault(), i.focus());
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
		}), P(() => {
			n?.unmount();
		}), { get props() {
			return { tabindex: -1 };
		} };
	}
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/focus-scope/focus-scope.svelte
function gt(e, n) {
	C(n, !0);
	let r = x(n, "enabled", 3, !1), a = x(n, "trapFocus", 3, !1), c = x(n, "loop", 3, !1), l = x(n, "onCloseAutoFocus", 3, F), u = x(n, "onOpenAutoFocus", 3, F), d = ht.use({
		enabled: I(() => r()),
		trap: I(() => a()),
		loop: y(() => c()),
		onCloseAutoFocus: I(() => l()),
		onOpenAutoFocus: I(() => u()),
		ref: y(() => n.ref)
	});
	var f = s(), p = g(f);
	i(p, () => n.focusScope ?? h, () => ({ props: d.props })), o(e, f), t();
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
		return M(c(this.domContext.getDocument(), "pointerdown", this.#o), c(this.domContext.getDocument(), "pointerup", this.#a));
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
function St(e, n) {
	C(n, !0);
	let r = x(n, "preventOverflowTextSelection", 3, !0), a = x(n, "onPointerDown", 3, F), c = x(n, "onPointerUp", 3, F);
	vt.create({
		id: I(() => n.id),
		onPointerDown: I(() => a()),
		onPointerUp: I(() => c()),
		enabled: I(() => n.enabled && r()),
		ref: y(() => n.ref)
	});
	var l = s(), u = g(l);
	i(u, () => n.children ?? h), o(e, l), t();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/shared-state.svelte.js
var Ct = class {
	#e;
	#t = 0;
	#n = f();
	#r;
	constructor(e) {
		this.#e = e;
	}
	#i() {
		--this.#t, this.#r && this.#t <= 0 && (this.#r(), _(this.#n, void 0), this.#r = void 0);
	}
	get(...e) {
		return this.#t += 1, u(this.#n) === void 0 && (this.#r = m(() => {
			_(this.#n, this.#e(...e), !0);
		})), b(() => () => {
			this.#i();
		}), u(this.#n);
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
	function e(e, t) {
		let n = J?.get(t);
		n?.value ? e.body.style.setProperty(t, n.value, n.priority) : e.body.style.removeProperty(t);
	}
	function t(t) {
		for (let n of wt) Y.has(n) && e(t, n);
		!Tt && t.body.style.length === 0 && t.body.removeAttribute("style"), J = null, Y.clear(), ue && X?.();
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
		r > 0 && !n && ($(document.body.style, "padding-right", `${i.padding}px`), $(document.body.style, "margin-right", `${i.margin}px`), $(document.body.style, "--scrollbar-width", `${r}px`)), $(document.body.style, "overflow", "hidden"), ue && (X = c(document, "touchmove", (e) => {
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
		resetBodyStyle: t,
		restorePointerEvents: n,
		scheduleCleanupIfNoNewLocks: i,
		cancelPendingCleanup: r,
		ensureInitialStyleCaptured: a
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
	C(n, !0);
	let r = x(n, "preventScroll", 3, !0), i = x(n, "restoreScrollDelay", 3, null);
	y(() => {
		r() && new kt(r(), () => i());
	}), t();
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
]), Nt = n("<div><!></div>");
function Pt(n, c) {
	let f = r();
	C(c, !0);
	let m = x(c, "id", 19, () => N(f)), _ = x(c, "forceMount", 3, !1), v = x(c, "ref", 15, null), y = p(c, Mt), b = Se.create({
		id: I(() => m()),
		ref: I(() => v(), (e) => v(e))
	}), S = w(() => A(y, b.props));
	var T = s(), E = g(T), D = (t) => {
		var n = s(), r = g(n), f = (e) => {
			var t = s(), n = g(t);
			{
				let e = w(() => ({
					props: A(u(S)),
					...b.snippetProps
				}));
				i(n, () => c.child, () => u(e));
			}
			o(e, t);
		}, p = (t) => {
			var n = Nt();
			d(n, (e) => ({ ...e }), [() => A(u(S))]);
			var r = l(n);
			i(r, () => c.children ?? h, () => b.snippetProps), e(n), o(t, n);
		};
		a(r, (e) => {
			c.child ? e(f) : e(p, -1);
		}), o(t, n);
	};
	a(E, (e) => {
		(b.shouldRender || _()) && e(D);
	}), o(n, T), t();
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
]), It = n("<div><!></div>");
function Lt(n, c) {
	let f = r();
	C(c, !0);
	let m = x(c, "id", 19, () => N(f)), _ = x(c, "ref", 15, null), v = p(c, Ft), y = be.create({
		id: I(() => m()),
		ref: I(() => _(), (e) => _(e))
	}), b = w(() => A(v, y.props));
	var S = s(), T = g(S), E = (e) => {
		var t = s(), n = g(t);
		i(n, () => c.child, () => ({ props: u(b) })), o(e, t);
	}, D = (t) => {
		var n = It();
		d(n, () => ({ ...u(b) }));
		var r = l(n);
		i(r, () => c.children ?? h), e(n), o(t, n);
	};
	a(T, (e) => {
		c.child ? e(E) : e(D, -1);
	}), o(n, S), t();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/useDialogHistory.svelte.ts
function Rt(e, t, n = !0) {
	if (typeof window > "u" || !(T().historyEnabled && (typeof n == "function" ? n() : n))) return;
	let r = null, i = !1, a = (n) => {
		e() && n.state?.modalId !== r && t() === !1 && e() && r && history.pushState({ modalId: r }, "", window.location.href);
	};
	b(() => {
		let t = e();
		if (t && !i) r = `modal-${me()}`, history.pushState({ modalId: r }, "", window.location.href), i = !0;
		else if (!t && i) {
			let e = history.state?.modalId === r;
			r = null, i = !1, e && history.back();
		}
	}), v(() => {
		window.addEventListener("popstate", a);
	}), S(() => {
		window.removeEventListener("popstate", a), i && history.state?.modalId === r && history.back();
	});
}
export { xe as _, St as a, pt as c, Be as d, Le as f, _e as g, ve as h, jt as i, dt as l, Ce as m, Lt as n, gt as o, Ee as p, Pt as r, ut as s, Rt as t, lt as u, ge as v, L as y };
