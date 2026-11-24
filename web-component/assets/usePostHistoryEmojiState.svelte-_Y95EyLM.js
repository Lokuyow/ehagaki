import { A as e, B as t, D as n, Dt as r, E as i, Et as a, F as o, G as s, H as c, K as l, L as u, Mt as d, Nt as f, Ot as p, Pt as m, Q as h, R as g, St as _, T as v, Y as y, Z as b, _t as x, a as S, at as C, b as w, ct as T, dt as E, et as D, ft as O, ht as k, i as A, j, lt as M, mt as N, o as ee, pt as P, q as F, r as I, rt as L, s as te, t as ne, v as R, wt as z, yt as B } from "./index-client-DEFG3Gqk.js";
import { a as re } from "./appRuntimeEnvironment-Bzv9wJOh.js";
import { m as ie } from "./esm-N9TTQGcl.js";
import { i as ae, n as V, r as oe } from "./relayConfigUtils-56ujWwKF.js";
import { c as H, o as se, u as ce } from "./postHistoryEventUtils-iuP8QpIA.js";
import { n as le } from "./profilePictureUrlUtils-B7zGYkzO.js";
import { n as U } from "./esm-CrCI9Pgc.js";
import { E as ue, F as W, G, L as de, N as K, R as q, T as J, Y as fe, Z as pe, b as me, c as he, g as ge, o as _e, r as ve, t as ye, w as Y } from "./LoadingPlaceholder-YrD8D_td.js";
import { n as be, r as xe } from "./ehagakiDb-DuXS0XPm.js";
import { C as Se, lt as Ce, s as we, ut as Te } from "./postHistoryRepository-Bu2z041i.js";
import { s as Ee } from "./ehagakiDbUpgradeState-tA-618gW.js";
import { a as De, i as Oe } from "./hostRelayRuntime-SryW0auD.js";
import { n as ke } from "./settingsStore.svelte-CAa8Vn5a.js";
import { at as Ae, dt as je } from "./appUtils-B3-zUpkb.js";
import { S as Me, a as Ne, x as Pe } from "./clipboardUtils-CSGkJuUA.js";
import { i as Fe, n as Ie } from "./query-CUABraKG.js";
import { n as Le, r as Re, t as ze } from "./postMediaCacheUtils-DIeR2W7v.js";
import { n as Be } from "./httpUrlCandidates-BckQw1dk.js";
import { t as Ve } from "./Button-Cqrg0_jX.js";
import { _ as He, i as Ue } from "./use-id-DCa3fCKD.js";
import { S as We } from "./useDialogHistory.svelte-pVteCIez.js";
import { t as Ge } from "./ProfileAvatar-eo19xgt6.js";
import { a as Ke, n as qe, o as Je, r as Ye, t as Xe } from "./safe-polygon.svelte-DzVpqP0C.js";
import { t as Ze } from "./graphemeUtils-D37rBdTG.js";
import { f as Qe, l as $e, s as et, u as tt } from "./profileMention-C2raJMGE.js";
import { c as nt, d as rt, l as it, p as at, t as ot } from "./customEmoji-C4nd4cTR.js";
import { i as st, o as ct, r as lt } from "./postReactionUtils-C8gCaYhG.js";
import { t as ut } from "./inViewportAction.svelte-7xfM4moj.js";
import { t as X } from "./postMediaCacheService-BRKmVe4b.js";
import { r as dt, t as ft } from "./postHistoryExternalClient-CKvMz4n9.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte-toolbelt/dist/utils/on-mount-effect.svelte.js
function pt(e) {
	M(() => C(() => e()));
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/timeout-fn.js
var mt = class {
	#e;
	#t;
	#n = null;
	constructor(e, t) {
		this.#t = e, this.#e = t, this.stop = this.stop.bind(this), this.start = this.start.bind(this), He(this.stop);
	}
	#r() {
		this.#n !== null && (window.clearTimeout(this.#n), this.#n = null);
	}
	stop() {
		this.#r();
	}
	start(...e) {
		this.#r(), this.#n = window.setTimeout(() => {
			this.#n = null, this.#t(...e);
		}, this.#e);
	}
}, ht = me({
	component: "tooltip",
	parts: ["content", "trigger"]
}), gt = new W("Tooltip.Provider"), _t = new W("Tooltip.Root"), vt = class {
	#e = B(k(/* @__PURE__ */ new Map()));
	get triggers() {
		return L(this.#e);
	}
	set triggers(e) {
		x(this.#e, e, !0);
	}
	#t = B(null);
	get activeTriggerId() {
		return L(this.#t);
	}
	set activeTriggerId(e) {
		x(this.#t, e, !0);
	}
	#n = _(() => {
		let e = this.activeTriggerId;
		return e === null ? null : this.triggers.get(e)?.node ?? null;
	});
	get activeTriggerNode() {
		return L(this.#n);
	}
	set activeTriggerNode(e) {
		x(this.#n, e);
	}
	#r = _(() => {
		let e = this.activeTriggerId;
		return e === null ? null : this.triggers.get(e)?.payload ?? null;
	});
	get activePayload() {
		return L(this.#r);
	}
	set activePayload(e) {
		x(this.#r, e);
	}
	register = (e) => {
		let t = new Map(this.triggers);
		t.set(e.id, e), this.triggers = t, this.#i();
	};
	update = (e) => {
		let t = new Map(this.triggers);
		t.set(e.id, e), this.triggers = t, this.#i();
	};
	unregister = (e) => {
		if (!this.triggers.has(e)) return;
		let t = new Map(this.triggers);
		t.delete(e), this.triggers = t, this.activeTriggerId === e && (this.activeTriggerId = null);
	};
	setActiveTrigger = (e) => {
		this.activeTriggerId = e === null ? null : this.triggers.has(e) ? e : null;
	};
	get = (e) => this.triggers.get(e);
	has = (e) => this.triggers.has(e);
	getFirstTriggerId = () => {
		let e = this.triggers.entries().next();
		return e.done ? null : e.value[0];
	};
	#i = () => {
		let e = this.activeTriggerId;
		e !== null && (this.triggers.has(e) || (this.activeTriggerId = null));
	};
}, yt = class e {
	static create(t) {
		return gt.set(new e(t));
	}
	opts;
	#e = B(!0);
	get isOpenDelayed() {
		return L(this.#e);
	}
	set isOpenDelayed(e) {
		x(this.#e, e, !0);
	}
	isPointerInTransit = fe(!1);
	#t;
	#n = B(null);
	constructor(e) {
		this.opts = e, this.#t = new mt(() => {
			this.isOpenDelayed = !0;
		}, this.opts.skipDelayDuration.current), pt(() => D(window, "scroll", (e) => {
			let t = L(this.#n);
			if (!t) return;
			let n = t.triggerNode;
			if (!n) return;
			let r = e.target;
			(r instanceof Element || r instanceof Document) && r.contains(n) && t.handleClose();
		}, {
			capture: !0,
			passive: !0
		}));
	}
	#r = () => {
		this.opts.skipDelayDuration.current === 0 ? this.isOpenDelayed = !0 : this.#t.start();
	};
	#i = () => {
		this.#t.stop();
	};
	onOpen = (e) => {
		L(this.#n) && L(this.#n) !== e && L(this.#n).handleClose(), this.#i(), this.isOpenDelayed = !1, x(this.#n, e, !0);
	};
	onClose = (e) => {
		L(this.#n) === e && (x(this.#n, null), this.#r());
	};
	isTooltipOpen = (e) => L(this.#n) === e;
}, bt = class e {
	static create(t) {
		return _t.set(new e(t, gt.get()));
	}
	opts;
	provider;
	#e = _(() => this.opts.delayDuration.current ?? this.provider.opts.delayDuration.current);
	get delayDuration() {
		return L(this.#e);
	}
	set delayDuration(e) {
		x(this.#e, e);
	}
	#t = _(() => this.opts.disableHoverableContent.current ?? this.provider.opts.disableHoverableContent.current);
	get disableHoverableContent() {
		return L(this.#t);
	}
	set disableHoverableContent(e) {
		x(this.#t, e);
	}
	#n = _(() => this.opts.disableCloseOnTriggerClick.current ?? this.provider.opts.disableCloseOnTriggerClick.current);
	get disableCloseOnTriggerClick() {
		return L(this.#n);
	}
	set disableCloseOnTriggerClick(e) {
		x(this.#n, e);
	}
	#r = _(() => this.opts.disabled.current ?? this.provider.opts.disabled.current);
	get disabled() {
		return L(this.#r);
	}
	set disabled(e) {
		x(this.#r, e);
	}
	#i = _(() => this.opts.ignoreNonKeyboardFocus.current ?? this.provider.opts.ignoreNonKeyboardFocus.current);
	get ignoreNonKeyboardFocus() {
		return L(this.#i);
	}
	set ignoreNonKeyboardFocus(e) {
		x(this.#i, e);
	}
	registry;
	tether;
	#a = B(null);
	get contentNode() {
		return L(this.#a);
	}
	set contentNode(e) {
		x(this.#a, e, !0);
	}
	contentPresence;
	#o = B(!1);
	#s;
	#c = _(() => this.opts.open.current ? L(this.#o) ? "delayed-open" : "instant-open" : "closed");
	get stateAttr() {
		return L(this.#c);
	}
	set stateAttr(e) {
		x(this.#c, e);
	}
	constructor(e, t) {
		this.opts = e, this.provider = t, this.tether = e.tether.current?.state ?? null, this.registry = this.tether?.registry ?? new vt(), this.#s = new mt(() => {
			x(this.#o, !0), this.opts.open.current = !0;
		}, this.delayDuration ?? 0), this.tether && (this.tether.root = this, pt(() => () => {
			this.tether?.root === this && (this.tether.root = null);
		})), this.contentPresence = new We({
			open: this.opts.open,
			ref: G(() => this.contentNode),
			onComplete: () => {
				this.opts.onOpenChangeComplete.current(this.opts.open.current);
			}
		}), K(() => this.delayDuration, () => {
			this.delayDuration !== void 0 && (this.#s = new mt(() => {
				x(this.#o, !0), this.opts.open.current = !0;
			}, this.delayDuration));
		}), K(() => this.opts.open.current, (e) => {
			e ? (this.ensureActiveTrigger(), this.provider.onOpen(this)) : this.provider.onClose(this);
		}, { lazy: !0 }), K(() => this.opts.triggerId.current, (e) => {
			e !== this.registry.activeTriggerId && this.registry.setActiveTrigger(e);
		}), K(() => this.registry.activeTriggerId, (e) => {
			this.opts.triggerId.current !== e && (this.opts.triggerId.current = e);
		});
	}
	handleOpen = () => {
		this.#s.stop(), x(this.#o, !1), this.ensureActiveTrigger(), this.opts.open.current = !0;
	};
	handleClose = () => {
		this.#s.stop(), this.opts.open.current = !1;
	};
	cancelPendingOpen = () => {
		this.#s.stop();
	};
	#l = () => {
		this.#s.stop();
		let e = !this.provider.isOpenDelayed, t = this.delayDuration ?? 0;
		e || t === 0 ? (x(this.#o, !1), this.opts.open.current = !0) : this.#s.start();
	};
	onTriggerEnter = (e) => {
		this.setActiveTrigger(e), this.#l();
	};
	onTriggerLeave = () => {
		this.disableHoverableContent ? this.handleClose() : this.#s.stop();
	};
	ensureActiveTrigger = () => {
		if (this.registry.activeTriggerId !== null && this.registry.has(this.registry.activeTriggerId)) return;
		if (this.opts.triggerId.current !== null && this.registry.has(this.opts.triggerId.current)) {
			this.registry.setActiveTrigger(this.opts.triggerId.current);
			return;
		}
		let e = this.registry.getFirstTriggerId();
		this.registry.setActiveTrigger(e);
	};
	setActiveTrigger = (e) => {
		this.registry.setActiveTrigger(e);
	};
	registerTrigger = (e) => {
		this.registry.register(e), e.disabled && this.registry.activeTriggerId === e.id && this.opts.open.current && this.handleClose();
	};
	updateTrigger = (e) => {
		this.registry.update(e), e.disabled && this.registry.activeTriggerId === e.id && this.opts.open.current && this.handleClose();
	};
	unregisterTrigger = (e) => {
		let t = this.registry.activeTriggerId === e;
		this.registry.unregister(e), t && this.opts.open.current && this.handleClose();
	};
	isActiveTrigger = (e) => this.registry.activeTriggerId === e;
	get triggerNode() {
		return this.registry.activeTriggerNode;
	}
	get activePayload() {
		return this.registry.activePayload;
	}
	get activeTriggerId() {
		return this.registry.activeTriggerId;
	}
}, xt = class e {
	static create(t) {
		return t.tether.current ? new e(t, null, t.tether.current.state) : new e(t, _t.get(), null);
	}
	opts;
	root;
	tether;
	attachment;
	#e = fe(!1);
	#t = B(!1);
	domContext;
	#n = null;
	#r = !1;
	#i = null;
	constructor(e, t, n) {
		this.opts = e, this.root = t, this.tether = n, this.domContext = new ue(e.ref), this.attachment = J(this.opts.ref, (e) => this.#s(e)), K(() => this.opts.id.current, () => {
			this.#s(this.opts.ref.current);
		}), K(() => this.opts.payload.current, () => {
			this.#s(this.opts.ref.current);
		}), K(() => this.opts.disabled.current, () => {
			this.#s(this.opts.ref.current);
		}), pt(() => (this.#r = !0, this.#s(this.opts.ref.current), () => {
			let e = this.#a(), t = this.#i;
			t && (this.tether ? this.tether.registry.unregister(t) : e?.unregisterTrigger(t)), this.#i = null, this.#r = !1;
		}));
	}
	#a = () => this.tether?.root ?? this.root;
	#o = () => {
		let e = this.#a();
		return this.opts.disabled.current || !!e?.disabled;
	};
	#s = (e) => {
		if (!this.#r) return;
		let t = this.opts.id.current, n = this.opts.payload.current, r = this.opts.disabled.current;
		if (this.#i && this.#i !== t) {
			let e = this.#a();
			this.tether ? this.tether.registry.unregister(this.#i) : e?.unregisterTrigger(this.#i);
		}
		let i = {
			id: t,
			node: e,
			payload: n,
			disabled: r
		}, a = this.#a();
		this.tether ? (this.tether.registry.has(t) ? this.tether.registry.update(i) : this.tether.registry.register(i), r && this.tether.registry.activeTriggerId === t && a?.opts.open.current && a.handleClose()) : a?.registry.has(t) ? a.updateTrigger(i) : a?.registerTrigger(i), this.#i = t;
	};
	#c = () => {
		this.#n !== null && (clearTimeout(this.#n), this.#n = null);
	};
	handlePointerUp = () => {
		this.#e.current = !1;
	};
	#l = () => {
		this.#o() || (this.#e.current = !1);
	};
	#u = () => {
		if (this.#o()) return;
		let e = this.#a();
		e && !e.disableCloseOnTriggerClick && (e.opts.open.current ? e.handleClose() : e.cancelPendingOpen()), this.#e.current = !0, this.domContext.getDocument().addEventListener("pointerup", () => {
			this.handlePointerUp();
		}, { once: !0 });
	};
	#d = (e) => {
		let t = this.#a();
		t && (this.#o() ? t.opts.open.current && t.handleClose() : e.pointerType !== "touch" && (t.provider.isPointerInTransit.current ? (this.#c(), this.#n = window.setTimeout(() => {
			t.provider.isPointerInTransit.current && (t.provider.isPointerInTransit.current = !1, t.onTriggerEnter(this.opts.id.current), x(this.#t, !0));
		}, 250)) : (t.onTriggerEnter(this.opts.id.current), x(this.#t, !0))));
	};
	#f = (e) => {
		let t = this.#a();
		t && (this.#o() ? t.opts.open.current && t.handleClose() : e.pointerType !== "touch" && (L(this.#t) || (this.#c(), t.provider.isPointerInTransit.current = !1, t.onTriggerEnter(this.opts.id.current), x(this.#t, !0))));
	};
	#p = (e) => {
		let t = this.#a();
		if (!t || this.#o()) return;
		if (this.#c(), !t.isActiveTrigger(this.opts.id.current)) {
			x(this.#t, !1);
			return;
		}
		let n = e.relatedTarget;
		if (_e(n)) {
			for (let e of t.registry.triggers.values()) if (e.node === n) {
				if (t.provider.opts.skipDelayDuration.current > 0) {
					x(this.#t, !1);
					return;
				}
				t.handleClose(), x(this.#t, !1);
				return;
			}
		}
		t.onTriggerLeave(), x(this.#t, !1);
	};
	#m = (e) => {
		let t = this.#a();
		t && (this.#e.current || (this.#o() ? t.opts.open.current && t.handleClose() : (!t.ignoreNonKeyboardFocus || he(e.currentTarget)) && (t.setActiveTrigger(this.opts.id.current), t.handleOpen())));
	};
	#h = () => {
		let e = this.#a();
		e && !this.#o() && e.handleClose();
	};
	#g = () => {
		let e = this.#a();
		!e || e.disableCloseOnTriggerClick || this.#o() || e.handleClose();
	};
	#_ = _(() => {
		let e = this.#a(), t = !!(e?.opts.open.current && e.isActiveTrigger(this.opts.id.current)), n = this.#o();
		return {
			id: this.opts.id.current,
			"aria-describedby": t ? e?.contentNode?.id : void 0,
			"data-state": t ? e?.stateAttr : "closed",
			"data-disabled": ge(n),
			"data-delay-duration": `${e?.delayDuration ?? 0}`,
			[ht.trigger]: "",
			tabindex: n ? void 0 : this.opts.tabindex.current,
			disabled: this.opts.disabled.current,
			onpointerup: this.#l,
			onpointerdown: this.#u,
			onpointerenter: this.#d,
			onpointermove: this.#f,
			onpointerleave: this.#p,
			onfocus: this.#m,
			onblur: this.#h,
			onclick: this.#g,
			...this.attachment
		};
	});
	get props() {
		return L(this.#_);
	}
	set props(e) {
		x(this.#_, e);
	}
}, St = class e {
	static create(t) {
		return new e(t, _t.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = J(this.opts.ref, (e) => this.root.contentNode = e), new Xe({
			triggerNode: () => this.root.triggerNode,
			contentNode: () => this.root.contentNode,
			enabled: () => this.root.opts.open.current && !this.root.disableHoverableContent,
			transitIntentTimeout: 180,
			ignoredTargets: () => {
				if (this.root.provider.opts.skipDelayDuration.current === 0) return [];
				let e = [], t = this.root.triggerNode;
				for (let n of this.root.registry.triggers.values()) n.node && n.node !== t && e.push(n.node);
				return e;
			},
			onPointerExit: () => {
				this.root.provider.isTooltipOpen(this.root) && this.root.handleClose();
			}
		});
	}
	onInteractOutside = (e) => {
		_e(e.target) && this.root.triggerNode?.contains(e.target) && this.root.disableCloseOnTriggerClick ? e.preventDefault() : (this.opts.onInteractOutside.current(e), !e.defaultPrevented && this.root.handleClose());
	};
	onEscapeKeydown = (e) => {
		this.opts.onEscapeKeydown.current?.(e), !e.defaultPrevented && this.root.handleClose();
	};
	onOpenAutoFocus = (e) => {
		e.preventDefault();
	};
	onCloseAutoFocus = (e) => {
		e.preventDefault();
	};
	get shouldRender() {
		return this.root.contentPresence.shouldRender;
	}
	#e = _(() => ({ open: this.root.opts.open.current }));
	get snippetProps() {
		return L(this.#e);
	}
	set snippetProps(e) {
		x(this.#e, e);
	}
	#t = _(() => ({
		id: this.opts.id.current,
		"data-state": this.root.stateAttr,
		"data-disabled": ge(this.root.disabled),
		...Y(this.root.contentPresence.transitionStatus),
		style: { outline: "none" },
		[ht.content]: "",
		...this.attachment
	}));
	get props() {
		return L(this.#t);
	}
	set props(e) {
		x(this.#t, e);
	}
	popperProps = {
		onInteractOutside: this.onInteractOutside,
		onEscapeKeydown: this.onEscapeKeydown,
		onOpenAutoFocus: this.onOpenAutoFocus,
		onCloseAutoFocus: this.onCloseAutoFocus
	};
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/tooltip/components/tooltip.svelte
function Ct(e, t) {
	r(t, !0);
	let n = I(t, "open", 15, !1), i = I(t, "triggerId", 15, null), c = I(t, "onOpenChange", 3, Ue), u = I(t, "onOpenChangeComplete", 3, Ue), d = bt.create({
		open: G(() => n(), (e) => {
			n(e), c()(e);
		}),
		triggerId: G(() => i(), (e) => {
			i(e);
		}),
		delayDuration: G(() => t.delayDuration),
		disableCloseOnTriggerClick: G(() => t.disableCloseOnTriggerClick),
		disableHoverableContent: G(() => t.disableHoverableContent),
		ignoreNonKeyboardFocus: G(() => t.ignoreNonKeyboardFocus),
		disabled: G(() => t.disabled),
		onOpenChangeComplete: G(() => u()),
		tether: G(() => t.tether)
	});
	Je(e, {
		tooltip: !0,
		children: (e, n) => {
			var r = l(), i = O(r);
			o(i, () => t.children ?? m, () => ({
				open: d.opts.open.current,
				triggerId: d.activeTriggerId,
				payload: d.activePayload
			})), s(e, r);
		},
		$$slots: { default: !0 }
	}), a();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/tooltip/components/tooltip-content.svelte
var wt = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"id",
	"ref",
	"side",
	"sideOffset",
	"align",
	"avoidCollisions",
	"arrowPadding",
	"sticky",
	"strategy",
	"hideWhenDetached",
	"customAnchor",
	"collisionPadding",
	"onInteractOutside",
	"onEscapeKeydown",
	"forceMount",
	"style"
]), Tt = F("<div><div><!></div></div>");
function Et(e, n) {
	let i = y();
	r(n, !0);
	let c = I(n, "id", 19, () => ve(i)), u = I(n, "ref", 15, null), d = I(n, "side", 3, "top"), p = I(n, "sideOffset", 3, 0), h = I(n, "align", 3, "center"), g = I(n, "avoidCollisions", 3, !0), v = I(n, "arrowPadding", 3, 0), b = I(n, "sticky", 3, "partial"), x = I(n, "hideWhenDetached", 3, !1), C = I(n, "collisionPadding", 3, 0), w = I(n, "onInteractOutside", 3, Ue), T = I(n, "onEscapeKeydown", 3, Ue), D = I(n, "forceMount", 3, !1), k = A(n, wt), j = St.create({
		id: G(() => c()),
		ref: G(() => u(), (e) => u(e)),
		onInteractOutside: G(() => w()),
		onEscapeKeydown: G(() => T())
	}), M = _(() => ({
		side: d(),
		sideOffset: p(),
		align: h(),
		avoidCollisions: g(),
		arrowPadding: v(),
		sticky: b(),
		hideWhenDetached: x(),
		collisionPadding: C(),
		strategy: n.strategy,
		customAnchor: n.customAnchor ?? j.root.triggerNode
	})), N = _(() => q(k, L(M), j.props));
	var ee = l(), P = O(ee), F = (e) => {
		{
			let r = (e, r) => {
				let i = () => (r?.()).props, a = () => (r?.()).wrapperProps, c = _(() => q(a(), { style: { pointerEvents: j.root.disableHoverableContent ? "none" : void 0 } })), u = _(() => q(i(), { style: Ke("tooltip") }, { style: n.style }));
				var d = l(), p = O(d), h = (e) => {
					var t = l(), r = O(t);
					{
						let e = _(() => ({
							props: L(u),
							wrapperProps: L(c),
							...j.snippetProps
						}));
						o(r, () => n.child, () => L(e));
					}
					s(e, t);
				}, g = (e) => {
					var t = Tt();
					R(t, () => ({ ...L(c) }));
					var r = E(t);
					R(r, () => ({ ...L(u) }));
					var i = E(r);
					o(i, () => n.children ?? m), f(r), f(t), s(e, t);
				};
				t(p, (e) => {
					n.child ? e(h) : e(g, -1);
				}), s(e, d);
			}, i = _(() => j.root.disableHoverableContent ? "none" : "auto");
			qe(e, S(() => L(N), () => j.popperProps, {
				get enabled() {
					return j.root.opts.open.current;
				},
				get id() {
					return c();
				},
				trapFocus: !1,
				loop: !1,
				preventScroll: !1,
				forceMount: !0,
				get ref() {
					return j.opts.ref;
				},
				tooltip: !0,
				get shouldRender() {
					return j.shouldRender;
				},
				get contentPointerEvents() {
					return L(i);
				},
				popper: r,
				$$slots: { popper: !0 }
			}));
		}
	}, te = (e) => {
		{
			let r = (e, r) => {
				let i = () => (r?.()).props, a = () => (r?.()).wrapperProps, c = _(() => q(a(), { style: { pointerEvents: j.root.disableHoverableContent ? "none" : void 0 } })), u = _(() => q(i(), { style: Ke("tooltip") }, { style: n.style }));
				var d = l(), p = O(d), h = (e) => {
					var t = l(), r = O(t);
					{
						let e = _(() => ({
							props: L(u),
							wrapperProps: L(c),
							...j.snippetProps
						}));
						o(r, () => n.child, () => L(e));
					}
					s(e, t);
				}, g = (e) => {
					var t = Tt();
					R(t, () => ({ ...L(c) }));
					var r = E(t);
					R(r, () => ({ ...L(u) }));
					var i = E(r);
					o(i, () => n.children ?? m), f(r), f(t), s(e, t);
				};
				t(p, (e) => {
					n.child ? e(h) : e(g, -1);
				}), s(e, d);
			}, i = _(() => j.root.disableHoverableContent ? "none" : "auto");
			Ye(e, S(() => L(N), () => j.popperProps, {
				get open() {
					return j.root.opts.open.current;
				},
				get id() {
					return c();
				},
				trapFocus: !1,
				loop: !1,
				preventScroll: !1,
				forceMount: !1,
				get ref() {
					return j.opts.ref;
				},
				tooltip: !0,
				get shouldRender() {
					return j.shouldRender;
				},
				get contentPointerEvents() {
					return L(i);
				},
				popper: r,
				$$slots: { popper: !0 }
			}));
		}
	};
	t(P, (e) => {
		D() ? e(F) : D() || e(te, 1);
	}), s(e, ee), a();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/tooltip/components/tooltip-trigger.svelte
var Dt = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"id",
	"disabled",
	"payload",
	"tether",
	"type",
	"tabindex",
	"ref"
]), Ot = F("<button><!></button>");
function kt(e, n) {
	let i = y();
	r(n, !0);
	let c = I(n, "id", 19, () => ve(i)), u = I(n, "disabled", 3, !1), d = I(n, "type", 3, "button"), p = I(n, "tabindex", 3, 0), h = I(n, "ref", 15, null), g = A(n, Dt), v = xt.create({
		id: G(() => c()),
		disabled: G(() => u() ?? !1),
		tabindex: G(() => p() ?? 0),
		payload: G(() => n.payload),
		tether: G(() => n.tether),
		ref: G(() => h(), (e) => h(e))
	}), b = _(() => q(g, v.props, { type: d() }));
	var x = l(), S = O(x), C = (e) => {
		var t = l(), r = O(t);
		o(r, () => n.child, () => ({ props: L(b) })), s(e, t);
	}, w = (e) => {
		var t = Ot();
		R(t, () => ({ ...L(b) }));
		var r = E(t);
		o(r, () => n.children ?? m), f(t), s(e, t);
	};
	t(S, (e) => {
		n.child ? e(C) : e(w, -1);
	}), s(e, x), a();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/tooltip/components/tooltip-provider.svelte
function At(e, t) {
	r(t, !0);
	let n = I(t, "delayDuration", 3, 700), i = I(t, "disableCloseOnTriggerClick", 3, !1), c = I(t, "disableHoverableContent", 3, !1), u = I(t, "disabled", 3, !1), d = I(t, "ignoreNonKeyboardFocus", 3, !1), f = I(t, "skipDelayDuration", 3, 300);
	yt.create({
		delayDuration: G(() => n()),
		disableCloseOnTriggerClick: G(() => i()),
		disableHoverableContent: G(() => c()),
		disabled: G(() => u()),
		ignoreNonKeyboardFocus: G(() => d()),
		skipDelayDuration: G(() => f())
	});
	var p = l(), h = O(p);
	o(h, () => t.children ?? m), s(e, p), a();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/profileEventComparison.ts
function jt(e) {
	return ie(e.sourceEventId) && Number.isSafeInteger(e.updatedAtFromEvent) && e.updatedAtFromEvent >= 0;
}
function Mt(e, t) {
	return t.sourceEventId === e.sourceEventId ? "same-event" : t.updatedAtFromEvent > e.updatedAtFromEvent ? "candidate-newer" : t.updatedAtFromEvent < e.updatedAtFromEvent ? "candidate-older" : t.sourceEventId < e.sourceEventId ? "candidate-wins-tie-break" : "candidate-loses-tie-break";
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/storage/profilesRepository.ts
var Nt = 2;
function Pt(e) {
	return {
		name: e.name,
		displayName: e.displayName,
		...e.nip05 !== void 0 && { nip05: e.nip05 },
		picture: e.pictureUrl,
		npub: e.npub,
		nprofile: e.nprofile,
		profileRelays: e.profileRelays?.length ? e.profileRelays : void 0,
		fetchedAt: e.fetchedAt,
		updatedAtFromEvent: e.updatedAtFromEvent
	};
}
function Ft(e, t, n) {
	let r = n();
	return {
		pubkeyHex: e,
		name: t.name || "",
		displayName: t.displayName || "",
		...t.nip05 !== void 0 && { nip05: t.nip05 },
		pictureUrl: t.picture || "",
		npub: t.npub || "",
		nprofile: t.nprofile || "",
		profileRelays: t.profileRelays?.length ? t.profileRelays : void 0,
		fetchedAt: t.fetchedAt || r,
		updatedAtFromEvent: t.updatedAtFromEvent,
		updatedAt: r,
		schemaVersion: Nt
	};
}
function It(...e) {
	let t = V.sanitizeExternalRelayUrls(e.flatMap((e) => e ?? []));
	return t.length > 0 ? t : void 0;
}
function Lt(e) {
	return e.sourceEventId !== void 0 && e.updatedAtFromEvent !== void 0 && jt({
		sourceEventId: e.sourceEventId,
		updatedAtFromEvent: e.updatedAtFromEvent
	});
}
function Rt(e, t) {
	return e.length > 0 && t.pubkeyHex === e && jt(t) && Number.isFinite(t.fetchedAt) && t.fetchedAt >= 0;
}
function zt(e, t, n) {
	let r = It(t.profile.profileRelays, t.observedRelays);
	return {
		pubkeyHex: e,
		name: t.profile.name || "",
		displayName: t.profile.displayName || "",
		...t.profile.nip05 !== void 0 && { nip05: t.profile.nip05 },
		pictureUrl: t.profile.picture || "",
		npub: t.profile.npub || "",
		nprofile: t.profile.nprofile || "",
		profileRelays: r,
		fetchedAt: t.fetchedAt,
		updatedAtFromEvent: t.updatedAtFromEvent,
		sourceEventId: t.sourceEventId,
		updatedAt: n,
		schemaVersion: Nt
	};
}
function Bt(e, t) {
	return {
		decision: e,
		acceptedRecord: t,
		acceptedProfile: t ? Pt(t) : null,
		currentEventConfirmed: e === "inserted" || e === "replaced" || e === "kept-existing" || e === "merged-same-event"
	};
}
function Vt(e, t) {
	let n = t.getItem(je.NOSTR_PROFILE + e);
	if (!n) return null;
	try {
		let e = JSON.parse(n);
		return !e || typeof e != "object" ? null : {
			name: typeof e.name == "string" ? e.name : "",
			displayName: typeof e.displayName == "string" ? e.displayName : "",
			picture: typeof e.picture == "string" ? e.picture : "",
			npub: typeof e.npub == "string" ? e.npub : "",
			nprofile: typeof e.nprofile == "string" ? e.nprofile : "",
			profileRelays: Array.isArray(e.profileRelays) ? e.profileRelays.filter((e) => typeof e == "string") : void 0,
			fetchedAt: typeof e.fetchedAt == "number" ? e.fetchedAt : void 0,
			updatedAtFromEvent: typeof e.updatedAtFromEvent == "number" ? e.updatedAtFromEvent : void 0
		};
	} catch {
		return null;
	}
}
var Ht = new class {
	db;
	now;
	getStorage;
	constructor(e = xe, t = Date.now, n = () => re()) {
		this.db = e, this.now = t, this.getStorage = n;
	}
	async get(e) {
		if (!e) return null;
		let t = Ee(e);
		try {
			let n = await this.db.profiles.get(e);
			if (n) return await this.markLegacyProfileImported(t), Pt(n);
		} catch {
			return Vt(e, this.getStorage());
		}
		if ((await this.db.legacyImportState.get(t))?.done === !0) return null;
		let n = this.getStorage();
		if (n.getItem(je.NOSTR_PROFILE + e) === null) return await this.markLegacyProfileImported(t), null;
		let r = Vt(e, n);
		if (!r) return null;
		try {
			await this.db.transaction("rw", this.db.profiles, this.db.legacyImportState, async () => {
				(await this.db.legacyImportState.get(t))?.done !== !0 && (await this.db.profiles.get(e) || await this.db.profiles.put(Ft(e, r, this.now)), await this.db.legacyImportState.put({
					id: t,
					done: !0,
					updatedAt: this.now()
				}));
			});
			try {
				n.removeItem(je.NOSTR_PROFILE + e);
			} catch {}
		} catch {
			return r;
		}
		return r;
	}
	async markLegacyProfileImported(e) {
		(await this.db.legacyImportState.get(e))?.done !== !0 && await this.db.legacyImportState.put({
			id: e,
			done: !0,
			updatedAt: this.now()
		});
	}
	async getRecord(e) {
		return await this.db.profiles.get(e) ?? null;
	}
	async bulkGetRecords(e) {
		return e.length === 0 ? [] : (await this.db.profiles.bulkGet(e)).map((e) => e ?? null);
	}
	async put(e, t) {
		e && await this.db.profiles.put(Ft(e, t, this.now));
	}
	async upsertCandidate(e, t) {
		return this.db.transaction("rw", this.db.profiles, async () => {
			let n = await this.db.profiles.get(e) ?? null;
			if (!Rt(e, t)) return Bt("rejected-invalid", n);
			if (!n || !Lt(n)) {
				let r = zt(e, t, this.now());
				return await this.db.profiles.put(r), Bt(n ? "replaced" : "inserted", r);
			}
			let r = Mt(n, t);
			if (r === "candidate-older") return Bt("rejected-older", n);
			if (r === "candidate-loses-tie-break") return Bt("rejected-tie-break", n);
			if (r === "candidate-newer" || r === "candidate-wins-tie-break") {
				let n = zt(e, t, this.now());
				return await this.db.profiles.put(n), Bt("replaced", n);
			}
			let i = It(n.profileRelays, t.profile.profileRelays, t.observedRelays), a = Math.max(n.fetchedAt, t.fetchedAt), o = n.nip05 === void 0 ? t.profile.nip05 : n.nip05;
			if (a === n.fetchedAt && o === n.nip05 && we(n.profileRelays, i)) return Bt("kept-existing", n);
			let s = {
				...n,
				...o !== void 0 && { nip05: o },
				profileRelays: i,
				fetchedAt: a,
				updatedAt: this.now(),
				schemaVersion: Nt
			};
			return await this.db.profiles.put(s), Bt("merged-same-event", s);
		});
	}
	async delete(e) {
		if (e) {
			await this.db.profiles.delete(e);
			try {
				this.getStorage().removeItem(je.NOSTR_PROFILE + e);
			} catch {}
		}
	}
}();
// D:/ドキュメント/GitHub/ehagaki/src/lib/profileRelayTiers.ts
function Ut(e) {
	let t = Oe(), n = t ? [] : V.sanitizeExternalRelayUrls(oe), r = new Set(n), i = V.sanitizeExternalRelayUrls(e.contextualRelays).filter((e) => !r.has(e)).slice(0, t ? void 0 : e.contextualRelayLimit), a = new Set(i);
	return {
		bootstrap: n,
		contextual: i,
		fallback: t ? [] : V.sanitizeExternalRelayUrls([...ae, ...e.fallbackRelays ?? []]).filter((e) => !r.has(e) && !a.has(e))
	};
}
function Wt(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e) {
		let e = V.sanitizeExternalRelayUrls(t[r]);
		if (e.length === 0) continue;
		let i = JSON.stringify([...e].sort((e, t) => e.localeCompare(t))), a = n.get(i);
		a ? a.pubkeys.push(r) : n.set(i, {
			relays: e,
			pubkeys: [r]
		});
	}
	return Array.from(n.values());
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/profileMetadataCache.svelte.ts
var Gt = 3e5, Kt = 18e5, qt = 6e4, Jt = 30, Yt = 4e3, Xt = 12, Zt = 50, Qt = 2, $t = 600, Z = B({}), en = /* @__PURE__ */ new Map(), tn = /* @__PURE__ */ new Map(), nn = /* @__PURE__ */ new Map(), rn = /* @__PURE__ */ new Map(), an = [], on = null, sn = /* @__PURE__ */ new Map();
function cn(e) {
	return !e.signal?.aborted;
}
async function ln(e, t, n) {
	if (t.signal?.aborted) return null;
	let r = sn.get(e);
	(!r || r.abort.signal.aborted) && (r = {
		abort: new AbortController(),
		consumers: /* @__PURE__ */ new Set()
	}, sn.set(e, r));
	let i = {}, a = r;
	r.consumers.add(i);
	let o = () => {
		a.consumers.delete(i), a.consumers.size || a.abort.abort();
	};
	t.signal?.addEventListener("abort", o, { once: !0 });
	try {
		let i = Fn(e, {
			...t,
			signal: r.abort.signal
		}, n);
		return t.signal ? await new Promise((e, n) => {
			let r = () => e(null);
			t.signal.addEventListener("abort", r, { once: !0 }), i.then((n) => {
				t.signal.removeEventListener("abort", r), e(t.signal?.aborted ? null : n);
			}, (e) => {
				t.signal.removeEventListener("abort", r), n(e);
			});
		}) : await i;
	} finally {
		let n = () => {
			t.signal?.removeEventListener("abort", o), o(), !a.consumers.size && sn.get(e) === a && sn.delete(e);
		};
		a.followup ? a.followup.then(n, n) : n();
	}
}
function Q() {
	return Date.now();
}
function un() {
	return Math.floor(Q() / 1e3);
}
function dn(e) {
	return e ? {
		name: e.name,
		displayName: e.displayName,
		picture: e.picture
	} : null;
}
function $(e = []) {
	return V.sanitizeExternalRelayUrls(e);
}
function fn(e = []) {
	return $(e).slice(0, Xt);
}
function pn(e) {
	return e.flatMap((e) => {
		let t = [];
		for (let n = 0; n < e.pubkeys.length; n += Zt) t.push({
			relays: e.relays,
			pubkeys: e.pubkeys.slice(n, n + Zt)
		});
		return t;
	});
}
async function mn(e, t, n) {
	let r = Array(e.length), i = 0, a = Array.from({ length: Math.min(t, e.length) }, async () => {
		for (; i < e.length;) {
			let t = i;
			i += 1, r[t] = await n(e[t]);
		}
	});
	return await Promise.all(a), r;
}
function hn(e, t) {
	return e.expireAtMs <= t;
}
function gn(e, t) {
	return e.staleAtMs <= t;
}
function _n(e, t) {
	return e.status === "negative" && !!e.negativeUntilMs && e.negativeUntilMs > t;
}
function vn(e, t) {
	return typeof e.fetchedAt == "number" && Number.isFinite(e.fetchedAt) ? e.fetchedAt : t;
}
function yn(e, t, n = !0) {
	if (x(Z, {
		...L(Z),
		[e]: t
	}), !n) return;
	let r = rn.get(e);
	if (r && r.size !== 0) for (let e of r) e(t.profile);
}
function bn(e) {
	let t = Q();
	yn(e, {
		pubkey: e,
		status: "negative",
		profile: null,
		profileSummary: null,
		metadataRaw: null,
		fetchedAtMs: t,
		sourceEventCreatedAtSec: null,
		sourceEventId: null,
		staleAtMs: t + qt,
		expireAtMs: t + qt,
		negativeUntilMs: t + qt,
		sourceRelay: null,
		lastValidatedAtMs: t,
		persistence: "persisted"
	});
}
function xn(e) {
	let t = Q(), n = e.fetchedAtMs ?? t, r = {
		...e.profile,
		fetchedAt: e.profile.fetchedAt ?? n,
		updatedAtFromEvent: e.sourceEventCreatedAtSec ?? e.profile.updatedAtFromEvent
	};
	yn(e.pubkey, {
		pubkey: e.pubkey,
		status: "hit",
		profile: r,
		profileSummary: dn(r),
		metadataRaw: e.metadataRaw,
		fetchedAtMs: n,
		sourceEventCreatedAtSec: e.sourceEventCreatedAtSec,
		sourceEventId: e.sourceEventId ?? null,
		staleAtMs: e.persistence === "temporary" ? t : n + Gt,
		expireAtMs: Math.max(n, t) + Kt,
		negativeUntilMs: null,
		sourceRelay: e.sourceRelay,
		lastValidatedAtMs: n,
		persistence: e.persistence ?? "persisted"
	}, e.notifySubscribers ?? !0);
}
function Sn(e, t) {
	if (!e) return !1;
	let n = e.profileRelays ?? [], r = t.profileRelays ?? [];
	return e.name === t.name && e.displayName === t.displayName && e.nip05 === t.nip05 && e.picture === t.picture && e.npub === t.npub && e.nprofile === t.nprofile && n.length === r.length && n.every((e, t) => e === r[t]);
}
function Cn(e, t) {
	return L(Z)[e]?.profile ?? t.find((e) => e.existingSnapshot)?.existingSnapshot ?? null;
}
function wn(e, t) {
	let n = L(Z)[e];
	if (n?.profile) return n.profile;
	let r = vn(t, Q());
	return xn({
		pubkey: e,
		profile: t,
		metadataRaw: null,
		sourceEventCreatedAtSec: t.updatedAtFromEvent ?? null,
		sourceEventId: null,
		sourceRelay: null,
		fetchedAtMs: r
	}), L(Z)[e]?.profile ?? t;
}
function Tn(e, t, n) {
	let r = t.acceptedProfile;
	if (!r) return null;
	let i = L(Z)[e], a = t.acceptedRecord, o = !!n.sourceEventId && n.sourceEventId === a?.sourceEventId, s = t.currentEventConfirmed || o, c = a?.fetchedAt ?? vn(r, Q()), l = {
		...r,
		fetchedAt: r.fetchedAt ?? c,
		updatedAtFromEvent: a?.updatedAtFromEvent ?? r.updatedAtFromEvent
	};
	return xn({
		pubkey: e,
		profile: l,
		metadataRaw: s ? n.metadataRaw : null,
		sourceEventCreatedAtSec: a?.updatedAtFromEvent ?? r.updatedAtFromEvent ?? null,
		sourceEventId: a?.sourceEventId ?? (s ? n.sourceEventId : null),
		sourceRelay: s ? n.sourceRelay : null,
		fetchedAtMs: c,
		persistence: "persisted",
		notifySubscribers: !Sn(i?.profile ?? null, l)
	}), L(Z)[e]?.profile ?? r;
}
async function En(e) {
	let t = L(Z)[e];
	if (t?.persistence !== "temporary" || !t.profile || !t.sourceEventId || t.sourceEventCreatedAtSec === null) return {
		profile: t?.profile ?? null,
		acceptedRecord: null,
		persistence: t?.persistence ?? null,
		dbError: !1
	};
	try {
		let n = fn([...t.profile.profileRelays ?? [], ...t.sourceRelay ? [t.sourceRelay] : []]), r = await Ht.upsertCandidate(e, {
			pubkeyHex: e,
			profile: t.profile,
			sourceEventId: t.sourceEventId,
			updatedAtFromEvent: t.sourceEventCreatedAtSec,
			observedRelays: n,
			fetchedAt: t.fetchedAtMs
		});
		return r.acceptedProfile && r.acceptedRecord ? {
			profile: Tn(e, r, t),
			acceptedRecord: r.acceptedRecord,
			persistence: "persisted",
			dbError: !1
		} : {
			profile: t.profile,
			acceptedRecord: null,
			persistence: "temporary",
			dbError: !1
		};
	} catch {
		return {
			profile: t.profile,
			acceptedRecord: null,
			persistence: "temporary",
			dbError: !0
		};
	}
}
function Dn(e, t) {
	let n = V.sanitizeExternalRelayUrls([...t.profile?.profileRelays ?? [], ...t.observedRelays]), r = {
		...t.profile,
		profileRelays: n.length > 0 ? n : void 0
	};
	return xn({
		pubkey: e,
		profile: r,
		metadataRaw: t.metadataRaw,
		sourceEventCreatedAtSec: t.sourceEventCreatedAtSec,
		sourceEventId: t.sourceEventId,
		sourceRelay: t.sourceRelay,
		persistence: "temporary"
	}), L(Z)[e]?.profile ?? r;
}
function On(e, t, n = !0) {
	let r = L(Z)[e];
	if (!r) return;
	let i = Q();
	yn(e, {
		...r,
		status: t,
		lastValidatedAtMs: i
	}, n);
}
function kn() {
	let e = Q(), t = Object.entries(L(Z)).filter(([, t]) => !hn(t, e));
	t.length !== Object.keys(L(Z)).length && x(Z, Object.fromEntries(t));
}
function An(e) {
	try {
		let t = JSON.parse(e.content), n = e.relay ? [e.relay.endsWith("/") ? e.relay : `${e.relay}/`] : [], r = typeof t.picture == "string" ? t.picture : "", i = r ? le(r, {
			forceRemote: !1,
			navigatorOnline: !0
		}) : "", a = {
			name: typeof t.name == "string" ? t.name : "",
			displayName: typeof t.display_name == "string" ? t.display_name : "",
			nip05: $e(t.nip05),
			picture: i,
			npub: Me(e.pubkey),
			nprofile: Pe(e.pubkey, n, e.writeRelays),
			profileRelays: n.length > 0 ? n : void 0
		};
		return a.fetchedAt = Q(), a.updatedAtFromEvent = e.createdAtSec, a;
	} catch {
		return null;
	}
}
async function jn(e, t, n, r, i, a, o = [], s) {
	let c = Array.from(new Set(t.filter((e) => !!e))), l = {};
	for (let e of c) l[e] = {
		profile: null,
		metadataRaw: null,
		sourceEventCreatedAtSec: null,
		sourceEventId: null,
		sourceRelay: null,
		observedRelays: [],
		rejectedFutureTimestamp: !1,
		parseError: !1,
		networkError: !1,
		timedOut: !1
	};
	return c.length === 0 || o.length > 0 && o.every((e) => e.aborted) || await new Promise((t) => {
		let u = Fe(), d = !1, f = null, p = null, m = () => {
			d || (d = !0, o.forEach((e) => e.removeEventListener("abort", h)), f?.unsubscribe(), p?.unsubscribe(), t());
		}, h = () => {
			o.every((e) => e.aborted) && m();
		};
		o.forEach((e) => e.addEventListener("abort", h));
		let g = () => {
			for (let e of c) l[e] = {
				...l[e],
				networkError: !0
			};
		}, _ = new Set(n), v = (e) => {
			_.has(e.from) && (e.state === "error" || e.state === "rejected" || e.state === "terminated") && g();
		};
		for (let t of _) {
			let n = e.getRelayStatus?.(t);
			(n?.connection === "error" || n?.connection === "rejected" || n?.connection === "terminated") && g();
		}
		let y = (e) => {
			let t = e.event?.created_at;
			if (typeof t != "number") return !1;
			let n = t <= un() + $t;
			if (!n) {
				let t = e.event?.pubkey;
				t && l[t] && (l[t] = {
					...l[t],
					rejectedFutureTimestamp: !0
				});
			}
			return n;
		};
		try {
			p = e.createConnectionStateObservable?.().subscribe({ next: v }) ?? null;
			let t = Ie(e, u, { on: { relays: n } }, {
				timeoutMs: i,
				deadlineAt: s,
				onEnd: (e) => {
					if (!e.complete) for (let e of c) l[e] = {
						...l[e],
						timedOut: !0
					};
				}
			});
			f = (typeof t.pipe == "function" ? t.pipe(Te(y)) : t).subscribe({
				next: (e) => {
					if (!y(e)) return;
					let t = e.event;
					if (!t || t.kind !== 0 || !t.pubkey || !c.includes(t.pubkey)) return;
					let n = l[t.pubkey];
					if (typeof t.created_at != "number" || typeof t.id != "string") return;
					let i = typeof e.from == "string" ? e.from : null;
					if (n.sourceEventCreatedAtSec === t.created_at && n.sourceEventId === t.id) {
						l[t.pubkey] = {
							...n,
							observedRelays: i ? [...n.observedRelays, i] : n.observedRelays
						};
						return;
					}
					if (n.sourceEventCreatedAtSec !== null && (t.created_at < n.sourceEventCreatedAtSec || t.created_at === n.sourceEventCreatedAtSec && n.sourceEventId !== null && t.id > n.sourceEventId)) return;
					let a = An({
						pubkey: t.pubkey,
						content: t.content ?? "",
						createdAtSec: t.created_at,
						relay: i,
						writeRelays: r[t.pubkey] ?? []
					});
					a ? l[t.pubkey] = {
						profile: a,
						metadataRaw: t.content ?? null,
						sourceEventCreatedAtSec: t.created_at,
						sourceEventId: t.id,
						sourceRelay: i,
						observedRelays: i ? [i] : [],
						rejectedFutureTimestamp: !1,
						parseError: !1,
						networkError: !1,
						timedOut: n.timedOut
					} : l[t.pubkey] = {
						...n,
						parseError: !0
					};
				},
				complete: () => {
					m();
				},
				error: () => {
					g(), m();
				}
			}), u.emit({
				kinds: [0],
				authors: c,
				until: un() + $t,
				limit: Math.max(24, c.length * 4)
			}), u.over(), a?.(c);
		} catch {
			g(), m();
		}
	}), l;
}
async function Mn(e, t, n) {
	if (t.profile && t.sourceEventId !== null && t.sourceEventCreatedAtSec !== null) try {
		let r = await Ht.upsertCandidate(e, {
			pubkeyHex: e,
			profile: t.profile,
			sourceEventId: t.sourceEventId,
			updatedAtFromEvent: t.sourceEventCreatedAtSec,
			observedRelays: t.observedRelays,
			fetchedAt: vn(t.profile, Q())
		});
		if (!n.some(cn)) return {
			profile: null,
			stopReason: "persistence-unavailable",
			parseError: !1,
			rejectedFutureTimestamp: !1,
			networkError: !1,
			transientFailure: !0
		};
		let i = Tn(e, r, t);
		return {
			profile: i,
			stopReason: r.currentEventConfirmed && i !== null ? "current-event-confirmed" : null,
			parseError: !1,
			rejectedFutureTimestamp: !1,
			networkError: !1,
			transientFailure: t.networkError || t.timedOut
		};
	} catch {
		let r = Cn(e, n);
		return {
			profile: r ? wn(e, r) : Dn(e, t),
			stopReason: "persistence-unavailable",
			parseError: !1,
			rejectedFutureTimestamp: !1,
			networkError: !1,
			transientFailure: t.networkError || t.timedOut
		};
	}
	return {
		profile: Cn(e, n),
		stopReason: null,
		parseError: t.parseError,
		rejectedFutureTimestamp: t.rejectedFutureTimestamp,
		networkError: t.networkError,
		transientFailure: t.networkError || t.timedOut
	};
}
async function Nn() {
	let e = an.filter((e) => cn(e) ? !0 : (e.resolve(null), !1));
	if (an = [], on = null, e.length === 0) return;
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = t.get(n.rxNostr) ?? [];
		e.push(n), t.set(n.rxNostr, e);
	}
	for (let e of t.values()) {
		let t = /* @__PURE__ */ new Map(), n = {}, r = {}, i = {};
		for (let a of e) {
			let e = t.get(a.pubkey) ?? [];
			e.push(a), t.set(a.pubkey, e), r[a.pubkey] = $([...r[a.pubkey] ?? [], ...a.relays]), i[a.pubkey] = fn([...i[a.pubkey] ?? [], ...a.fallbackRelays]);
			let o = /* @__PURE__ */ new Set([...n[a.pubkey] ?? [], ...a.writeRelays]);
			n[a.pubkey] = Array.from(o);
		}
		let a = (e) => (t.get(e) ?? []).some(cn), o = Array.from(t.keys()), s = Object.fromEntries(o.map((e) => {
			let t = Ut({
				contextualRelays: r[e] ?? [],
				fallbackRelays: i[e] ?? [],
				contextualRelayLimit: Xt
			}), a = /* @__PURE__ */ new Set([...t.bootstrap, ...n[e] ?? []]);
			return t.contextual = t.contextual.filter((e) => !a.has(e)), t.fallback = t.fallback.filter((e) => !a.has(e)), [e, t];
		})), c = Ut({
			contextualRelays: [],
			contextualRelayLimit: Xt
		}), l = new Set(o), u = {}, d = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Set(), h = [
			"bootstrap",
			"contextual",
			"fallback"
		], g = Q() + 6e3, _ = (e, t) => e === "bootstrap" ? Wt(t, Object.fromEntries(t.map((e) => [e, V.sanitizeExternalRelayUrls([...c.bootstrap, ...n[e] ?? []])]))) : Wt(t, Object.fromEntries(t.map((t) => [t, s[t][e]])));
		try {
			for (let r of h) {
				if (Q() >= g) {
					for (let e of l) p.add(e);
					break;
				}
				let i = await mn(pn(_(r, Array.from(l).filter(a))), Qt, async (r) => {
					let i = r.pubkeys.filter((e) => a(e) && l.has(e));
					return i.length === 0 ? null : {
						activeTargets: i,
						results: await jn(e[0].rxNostr, i, r.relays, n, Yt, (e) => {
							for (let t of e) m.add(t);
						}, i.flatMap((e) => (t.get(e) ?? []).flatMap((e) => e.signal ? [e.signal] : [])), g)
					};
				});
				for (let e of i) if (e) for (let n of e.activeTargets) {
					if (!a(n)) {
						l.delete(n);
						continue;
					}
					let r = t.get(n) ?? [], i = await Mn(n, e.results[n], r);
					u[n] = i.profile, i.parseError && d.add(n), i.rejectedFutureTimestamp && f.add(n), i.transientFailure && p.add(n), i.stopReason !== null && l.delete(n);
				}
			}
			for (let e of l) {
				if (!a(e)) continue;
				let n = Cn(e, t.get(e) ?? []);
				d.has(e) ? On(e, "parse-error") : f.has(e) ? On(e, "invalid-future-ts") : !n && m.has(e) && !p.has(e) && bn(e), u[e] = n ? wn(e, n) : null;
			}
			for (let [e, n] of t.entries()) for (let t of n) t.resolve(cn(t) ? u[e] ?? null : null);
		} catch {
			for (let [e, n] of t.entries()) {
				let t = Cn(e, n);
				for (let r of n) r.resolve(cn(r) && t ? wn(e, t) : null);
			}
		}
	}
}
function Pn(e, t, n, r, i, a, o) {
	return o?.aborted ? Promise.resolve(null) : new Promise((s, c) => {
		let l = () => {
			an = an.filter((e) => e.signal !== o), !an.length && on && (clearTimeout(on), on = null), s(null);
		};
		o?.addEventListener("abort", l, { once: !0 }), an.push({
			signal: o,
			rxNostr: t,
			pubkey: e,
			relays: [...n],
			fallbackRelays: [...r],
			writeRelays: [...i],
			existingSnapshot: a,
			resolve: (e) => {
				o?.removeEventListener("abort", l), s(e);
			},
			reject: c
		}), !on && (on = setTimeout(() => {
			Nn();
		}, Jt));
	});
}
async function Fn(e, t, n = void 0) {
	if (t.signal?.aborted || !e || !t.rxNostr) return null;
	let r = tn.get(e)?.signal?.aborted;
	r && nn.delete(e);
	let i = r ? void 0 : en.get(e);
	if (i) {
		let n = tn.get(e);
		if (n && t.rxNostr === n.rxNostr) {
			let r = new Set(fn(n.writeRelays ?? []));
			if (fn(t.writeRelays ?? []).filter((e) => !r.has(e)).length > 0) {
				let n = nn.get(e) ?? {};
				nn.set(e, {
					rxNostr: t.rxNostr,
					forceRefresh: !0,
					allowBackgroundRefresh: t.allowBackgroundRefresh,
					writeRelays: $([...n.writeRelays ?? [], ...t.writeRelays ?? []]),
					additionalRelays: $([...n.additionalRelays ?? [], ...t.additionalRelays ?? []]),
					fallbackRelays: $([...n.fallbackRelays ?? [], ...t.fallbackRelays ?? []])
				});
			}
		}
		return i;
	}
	let a = (async () => {
		let r = n;
		if (r === void 0) try {
			r = await Ht.get(e);
		} catch {
			r = null;
		}
		if (t.signal?.aborted) return null;
		let i = await En(e);
		if (t.signal?.aborted) return null;
		let a = i.profile ?? L(Z)[e]?.profile ?? r, o = $([...t.additionalRelays ?? [], ...a?.profileRelays ?? []]);
		return Pn(e, t.rxNostr, o, fn(t.fallbackRelays ?? []), fn(t.writeRelays ?? []), a, t.signal);
	})().finally(() => {
		if (en.get(e) !== a) return;
		en.delete(e), tn.delete(e);
		let n = nn.get(e);
		if (nn.delete(e), kn(), !t.signal?.aborted && n?.rxNostr && (n.writeRelays?.length ?? 0) > 0) {
			let r = Fn(e, {
				...n,
				signal: t.signal
			}), i = sn.get(e);
			i && i.abort.signal === t.signal && (i.followup = r);
		}
	});
	return tn.set(e, t), en.set(e, a), a;
}
async function In(e, t, n) {
	if (t.signal?.aborted) return null;
	let r = Q(), i = L(Z)[e];
	if (!t.forceRefresh && i && !hn(i, r)) {
		if (_n(i, r)) return null;
		if (i.profile && i.persistence === "temporary") return t.allowBackgroundRefresh !== !1 && t.rxNostr && (ln(e, t, n ? i.profile : void 0), On(e, "stale", !1)), i.profile;
		if (i.profile && !gn(i, r)) return i.profile;
		if (i.profile) return t.allowBackgroundRefresh !== !1 && t.rxNostr && (ln(e, t, n ? i.profile : void 0), On(e, "stale")), i.profile;
	}
	if (!t.forceRefresh && !n) {
		let n = await Ht.get(e);
		if (t.signal?.aborted) return null;
		if (n) {
			let i = vn(n, r);
			xn({
				pubkey: e,
				profile: n,
				metadataRaw: null,
				sourceEventCreatedAtSec: n.updatedAtFromEvent ?? null,
				sourceRelay: null,
				fetchedAtMs: i
			});
			let a = L(Z)[e];
			return a && gn(a, r) && t.allowBackgroundRefresh !== !1 && t.rxNostr && (ln(e, t, n), On(e, "stale")), n;
		}
	}
	return t.rxNostr ? await ln(e, t, n ? L(Z)[e]?.profile ?? null : void 0) : null;
}
async function Ln(e, t = {}) {
	return In(e, t, !1);
}
async function Rn(e) {
	return e ? In(e, { allowBackgroundRefresh: !1 }, !1) : null;
}
async function zn(e, t = {}) {
	if (t.signal?.aborted) return {};
	let n = Array.from(new Set(e.filter((e) => !!e)));
	if (n.length === 0) return {};
	if (!t.forceRefresh) {
		let e = Q(), r = n.filter((t) => {
			let n = L(Z)[t];
			return !n || hn(n, e);
		});
		if (r.length > 0) try {
			let n = await Ht.bulkGetRecords(r);
			if (t.signal?.aborted) return {};
			n.forEach((t, n) => {
				if (!t) return;
				let i = Pt(t);
				xn({
					pubkey: r[n],
					profile: i,
					metadataRaw: null,
					sourceEventCreatedAtSec: i.updatedAtFromEvent ?? null,
					sourceEventId: t.sourceEventId ?? null,
					sourceRelay: null,
					fetchedAtMs: vn(i, e)
				});
			});
		} catch {}
	}
	let r = await Promise.all(n.map(async (e) => {
		let n = t.relayOptionsByPubkey?.[e];
		return [e, await In(e, {
			rxNostr: t.rxNostr,
			signal: t.signal,
			additionalRelays: $([...n?.additionalRelays ?? [], ...t.additionalRelays ?? []]),
			fallbackRelays: $([...n?.fallbackRelays ?? [], ...t.fallbackRelays ?? []]),
			writeRelays: $([...n?.writeRelays ?? [], ...t.writeRelays ?? []]),
			forceRefresh: t.forceRefresh,
			allowBackgroundRefresh: t.allowBackgroundRefresh
		}, !t.forceRefresh)];
	}));
	return Object.fromEntries(r);
}
async function Bn(e) {
	return zn(e, { allowBackgroundRefresh: !1 });
}
function Vn(e, t) {
	let n = rn.get(e) ?? /* @__PURE__ */ new Set();
	n.add(t), rn.set(e, n);
	let r = L(Z)[e];
	return r && t(r.profile), () => {
		let n = rn.get(e);
		n && (n.delete(t), n.size === 0 && rn.delete(e));
	};
}
function Hn(e) {
	return L(Z)[e] ?? null;
}
function Un(e, t) {
	let n = Array.from(new Set(e.filter((e) => !!e))).map((e) => Vn(e, (n) => t(e, n)));
	return () => {
		for (let e of n) e();
	};
}
var Wn = {
	getProfile: Ln,
	getProfiles: zn,
	getCachedProfile: Rn,
	getCachedProfiles: Bn,
	getReactiveEntry: Hn,
	subscribe: Vn,
	subscribeProfiles: Un
}, Gn = Symbol("profileMentionPreview");
function Kn(e) {
	p(Gn, e);
}
function qn() {
	return z(Gn);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryProfileSync.ts
function Jn(e, t) {
	return e.length === t.length && e.every((e, n) => e === t[n]);
}
function Yn({ getShow: e, getRxNostr: t, profileCache: n = Wn, logger: r = console }) {
	let i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), o = !1, s = (t, n) => {
		if (!o && !t.disposed && i.get(t.pubkey) === t && e() && n && t.lastProfile !== n) {
			t.lastProfile = n;
			for (let e of a) e(t.pubkey, n);
		}
	}, c = (a, l) => {
		if (!e() || a.pending || a.disposed || o) return;
		let u = a.relayHints;
		a.pending = n.getProfile(a.pubkey, {
			rxNostr: t(),
			additionalRelays: u,
			forceRefresh: l,
			allowBackgroundRefresh: !0,
			signal: a.abort.signal
		}).then((e) => {
			s(a, e);
		}).catch((e) => {
			a.abort.signal.aborted || r.error("投稿履歴プロフィールの取得に失敗:", e);
		}).finally(() => {
			i.get(a.pubkey) === a && (a.pending = null, a.refreshQueued && (a.refreshQueued = !1, c(a, !0)));
		});
	}, l = (t, r = []) => {
		if (!e() || !t || o) return null;
		let a = V.sanitizeExternalRelayUrls(r), l = i.get(t);
		if (l) {
			let e = V.mergeRelayConfigs(l.relayHints, a);
			return Jn(l.relayHints, e) || (l.relayHints = e, l.pending ? l.refreshQueued = !0 : c(l, !0)), l.lastProfile;
		}
		let u = {
			pubkey: t,
			relayHints: a,
			lastProfile: null,
			unsubscribe: () => void 0,
			pending: null,
			refreshQueued: !1,
			disposed: !1,
			abort: new AbortController()
		};
		return i.set(t, u), u.unsubscribe = n.subscribe(t, (e) => {
			s(u, e);
		}), c(u, !1), null;
	}, u = (e) => {
		if (o) return () => void 0;
		a.add(e);
		for (let t of i.values()) t.lastProfile && e(t.pubkey, t.lastProfile);
		return () => a.delete(e);
	}, d = () => {
		for (let e of i.values()) e.disposed = !0, e.abort.abort(), e.unsubscribe();
		i.clear();
	};
	return {
		ensureProfile: l,
		subscribe: u,
		reset: d,
		dispose: () => {
			o ||= (d(), a.clear(), !0);
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryDirectReplyRelationUtils.ts
function Xn(e) {
	return e === 1 || e === 42 || e === 1111;
}
function Zn(e) {
	if (!Xn(e.event.kind) || !e.event.id) return null;
	let t = ce(e.event);
	if (e.event.kind === 42 && !t.channelEventId || e.event.kind === 1111 && (!t.rootReferenceTags?.length || t.rootKind == null || !t.rootPubkey && t.rootReferenceTags[0]?.[0] !== "I" || !t.parentId && t.parentReferenceTags?.[0]?.[0] !== "i" || t.parentKind == null || !t.parentPubkey && t.parentReferenceTags?.[0]?.[0] !== "i" || t.issues.length > 0)) return null;
	let n = e.event.kind === 1111, r = n || e.event.kind === 1 ? t.rootId ?? e.event.id : e.event.id, i = n ? t.rootKind : e.event.kind === 1 ? 1 : e.event.kind, a = n ? t.rootPubkey : e.event.kind === 1 && r !== e.event.id ? t.rootAuthorHint : e.event.pubkey ?? null, o = n ? t.rootReferenceTags ?? [] : e.event.kind === 1 && r !== e.event.id ? [[
		"E",
		r,
		t.rootRelayHint ?? "",
		a ?? ""
	]] : [[
		"E",
		r,
		"",
		a ?? ""
	]];
	return {
		eventId: e.event.id,
		eventKind: e.event.kind,
		channelEventId: e.event.kind === 42 ? t.channelEventId : null,
		rootEventId: r,
		rootKind: i,
		rootPubkey: a,
		eventPubkey: e.event.pubkey ?? null,
		rootReferenceTags: o,
		createdAt: e.event.created_at,
		relayHints: [...e.relayHints ?? []]
	};
}
function Qn(e) {
	if (!Xn(e.child.kind)) return {
		valid: !1,
		reason: "unsupported-child-kind"
	};
	if (e.child.id === e.parent.eventId) return {
		valid: !1,
		reason: "self-reference"
	};
	let t = ce(e.child);
	if (!H(t)) return {
		valid: !1,
		reason: "parent-reference-missing-or-ambiguous"
	};
	if (t.parentId !== e.parent.eventId) return {
		valid: !1,
		reason: "parent-id-mismatch"
	};
	let n = e.child.kind === 1111;
	if (!n && e.child.kind !== e.parent.eventKind || n && (e.parent.eventKind === 42 || t.parentKind !== String(e.parent.eventKind) || t.rootKind !== String(e.parent.rootKind ?? e.parent.eventKind) || !((e, t) => {
		let n = e[0], r = t[0];
		return !!n && !!r && n[0] === r[0] && n[1] === r[1];
	})(t.rootReferenceTags ?? [], e.parent.rootReferenceTags ?? [["E", e.parent.rootEventId ?? e.parent.eventId]]) || e.parent.eventPubkey && t.parentPubkey !== e.parent.eventPubkey || e.parent.rootPubkey && t.rootPubkey !== e.parent.rootPubkey)) return {
		valid: !1,
		reason: "kind-mismatch"
	};
	if (e.child.kind === 42) {
		if (!t.channelEventId || !e.parent.channelEventId) return {
			valid: !1,
			reason: "channel-missing"
		};
		if (t.channelEventId !== e.parent.channelEventId) return {
			valid: !1,
			reason: "channel-mismatch"
		};
	}
	return {
		valid: !0,
		parentEventId: e.parent.eventId
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/components/BlurhashPlaceholder.svelte
var $n = F("<div aria-hidden=\"true\"></div>"), er = {
	hash: "svelte-ohoxs0",
	code: ".blurhash-placeholder.svelte-ohoxs0 {position:absolute;inset:0;z-index:0;border-radius:inherit;overflow:hidden;background:radial-gradient(\n                circle at top left,\n                rgba(255, 255, 255, 0.2),\n                transparent 48%\n            ),\n            linear-gradient(\n                135deg,\n                color-mix(in srgb, var(--background-color, #fff) 24%, #000 76%),\n                color-mix(in srgb, var(--background-color, #fff) 8%, #000 92%)\n            );background-position:center;background-repeat:no-repeat;background-size:cover;}.blurhash-placeholder-ready.svelte-ohoxs0 {background-image:var(--blurhash-placeholder-image);}.blurhash-placeholder.svelte-ohoxs0::after {content:\"\";position:absolute;inset:0;background:linear-gradient(\n            180deg,\n            rgba(0, 0, 0, 0.08),\n            rgba(0, 0, 0, 0.28)\n        );}:root.dark .ehagaki-app-root .blurhash-placeholder.svelte-ohoxs0::after,\n    :host(.dark) .ehagaki-app-root .blurhash-placeholder.svelte-ohoxs0::after {background:linear-gradient(\n            180deg,\n            rgba(0, 0, 0, 0.14),\n            rgba(0, 0, 0, 0.38)\n        );}"
};
function tr(e, t) {
	r(t, !0), j(e, er);
	let o = /* @__PURE__ */ new Map(), c = I(t, "blurhash", 3, void 0), l = I(t, "className", 3, ""), u = B(null), d = _(() => L(u) ? `--blurhash-placeholder-image: url("${L(u)}");` : "");
	async function f(e) {
		let t = e.trim();
		if (!t || typeof document > "u") return null;
		let n = o.get(t);
		if (n instanceof Promise || typeof n == "string" || n === null) return n;
		let r = Promise.resolve().then(() => {
			let e = document.createElement("canvas");
			e.width = 32, e.height = 32;
			let n = e.getContext("2d");
			if (!n) return null;
			let r = n.createImageData(32, 32);
			return r.data.set(U(t, 32, 32)), n.putImageData(r, 0, 0), e.toDataURL("image/png");
		}).catch(() => null).then((e) => (o.set(t, e), e));
		return o.set(t, r), r;
	}
	M(() => {
		let e = !0, t = c()?.trim();
		if (x(u, null), t) return f(t).then((t) => {
			e && x(u, t, !0);
		}), () => {
			e = !1;
		};
	});
	var p = $n();
	let m;
	T((e, t) => {
		m = i(p, 1, e, "svelte-ohoxs0", m, { "blurhash-placeholder-ready": t }), v(p, L(d));
	}, [() => n(`blurhash-placeholder ${l()}`.trim()), () => !!L(u)]), s(e, p), a();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryMediaCache.svelte.ts
function nr(e) {
	return {
		url: e.url,
		alt: e.alt,
		mimeType: e.mimeType,
		blurhash: e.blurhash,
		dim: e.dim,
		kind: ze({
			url: e.url,
			mimeType: e.mimeType
		}),
		hasResolvedCache: !1,
		cached: !1,
		previewObjectUrl: void 0,
		size: e.size,
		uploadProtocol: e.uploadProtocol,
		source: void 0,
		isLoadingPreview: !1,
		isCaching: !1,
		hasFetchFailed: !1
	};
}
function rr(e, t) {
	return [t ? "1" : "0", ...e.map((e) => [
		e.url,
		e.mimeType ?? "",
		e.alt ?? "",
		e.blurhash ?? "",
		e.dim ?? "",
		e.size ?? "",
		e.uploadProtocol ?? ""
	].join(""))].join("");
}
function ir(e) {
	let t = k({ items: [] }), n = /* @__PURE__ */ new Map(), r = 0, i = "", a = !1;
	function o(e) {
		let t = nr(e), r = X.getCachedMediaDescriptorSnapshot(e.url);
		if (r === void 0) return t;
		if (r === null) return {
			...t,
			hasResolvedCache: !0
		};
		if (r.kind !== "image" && r.kind !== "video") return {
			...t,
			hasResolvedCache: !0,
			cached: !0,
			mimeType: r.mimeType,
			kind: r.kind,
			size: r.size,
			source: r.source
		};
		let i = X.getCachedMediaObjectUrlSnapshot(e.url);
		return i ? (n.set(e.url, i.objectUrl), {
			...t,
			hasResolvedCache: !0,
			cached: !0,
			previewObjectUrl: i.objectUrl,
			mimeType: i.mimeType,
			kind: i.kind,
			size: i.size,
			source: i.source
		}) : {
			...t,
			hasResolvedCache: !0,
			cached: !0,
			previewObjectUrl: void 0,
			mimeType: r.mimeType,
			kind: r.kind,
			size: r.size,
			source: r.source,
			isLoadingPreview: !0
		};
	}
	function s(e) {
		let t = nr(e);
		return t.kind !== "image" && t.kind !== "video" ? {
			...t,
			hasResolvedCache: !0
		} : {
			...t,
			hasResolvedCache: !0,
			cached: !0,
			previewObjectUrl: e.url
		};
	}
	function c(e) {
		let t = n.get(e);
		t && (X.revokeObjectUrl(t), n.delete(e));
	}
	function l() {
		for (let e of n.values()) X.revokeObjectUrl(e);
		n.clear();
	}
	function u(e, n) {
		t.items = t.items.map((t) => t.url === e ? n(t) : t);
	}
	async function d(e) {
		let { url: t, descriptor: i, loadPreview: o, expectedResolutionVersion: s } = e;
		if (o && (i.kind === "image" || i.kind === "video")) {
			u(t, (e) => ({
				...e,
				hasResolvedCache: !0,
				cached: !0,
				previewObjectUrl: void 0,
				mimeType: i.mimeType,
				kind: i.kind,
				size: i.size,
				source: i.source,
				isLoadingPreview: !0,
				isCaching: !1,
				hasFetchFailed: !1
			}));
			let e = await X.createCachedMediaObjectUrl(t);
			if (a || s !== void 0 && s !== r) {
				e && X.revokeObjectUrl(e.objectUrl);
				return;
			}
			if (e) {
				c(t), n.set(t, e.objectUrl), u(t, (t) => ({
					...t,
					hasResolvedCache: !0,
					cached: !0,
					previewObjectUrl: e.objectUrl,
					mimeType: e.mimeType,
					kind: e.kind,
					size: e.size,
					source: e.source,
					isLoadingPreview: !1,
					isCaching: !1,
					hasFetchFailed: !1
				}));
				return;
			}
		}
		a || (c(t), u(t, (e) => ({
			...e,
			hasResolvedCache: !0,
			cached: !0,
			previewObjectUrl: void 0,
			mimeType: i.mimeType,
			kind: i.kind,
			size: i.size,
			source: i.source,
			isLoadingPreview: !1,
			isCaching: !1,
			hasFetchFailed: !1
		})));
	}
	async function f(e) {
		let n = t.items.find((t) => t.url === e);
		if (!n || n.cached || n.isCaching) return;
		let i = r;
		u(e, (e) => ({
			...e,
			isCaching: !0,
			hasFetchFailed: !1
		}));
		try {
			let t = await X.fetchAndCacheMedia({
				url: e,
				mimeType: n.mimeType
			});
			if (!t) {
				u(e, (e) => ({
					...e,
					isCaching: !1,
					hasFetchFailed: !0
				}));
				return;
			}
			await d({
				url: e,
				descriptor: t,
				loadPreview: t.kind === "image" || t.kind === "video",
				expectedResolutionVersion: i
			});
		} catch {
			if (n.kind === "image" || n.kind === "video") {
				c(e), u(e, () => s(n));
				return;
			}
			u(e, (e) => ({
				...e,
				isCaching: !1,
				hasFetchFailed: !0
			}));
		}
	}
	return ne(() => {
		a = !0, r += 1, l();
	}), M(() => {
		let f = e.getMedia(), p = rr(f, X.canUsePersistentCache());
		if (p === i) return;
		i = p;
		let m = ++r;
		if (!X.canUsePersistentCache()) {
			t.items = f.map(s);
			return;
		}
		l(), t.items = f.map(o);
		let h = new Map(t.items.map((e) => [e.url, e]));
		(async () => {
			await Promise.all(f.map(async (e) => {
				let t = h.get(e.url);
				if (!t) return;
				if (t.hasResolvedCache) {
					if (!t.cached || t.previewObjectUrl || !t.isLoadingPreview) return;
					let n = await X.getCachedMediaDescriptor(e.url);
					if (a || m !== r) return;
					if (!n) {
						c(e.url), u(e.url, (e) => ({
							...e,
							cached: !1,
							previewObjectUrl: void 0,
							isLoadingPreview: !1
						}));
						return;
					}
					await d({
						url: e.url,
						descriptor: n,
						loadPreview: n.kind === "image" || n.kind === "video",
						expectedResolutionVersion: m
					});
					return;
				}
				let i = await X.getCachedMediaDescriptor(e.url);
				if (a || m !== r) return;
				if (!i) {
					u(e.url, (e) => ({
						...e,
						hasResolvedCache: !0
					}));
					return;
				}
				if (i.kind !== "image" && i.kind !== "video") {
					u(e.url, (e) => ({
						...e,
						hasResolvedCache: !0,
						cached: !0,
						kind: i.kind,
						mimeType: i.mimeType,
						size: i.size,
						source: i.source
					}));
					return;
				}
				u(e.url, (e) => ({
					...e,
					hasResolvedCache: !0,
					cached: !0,
					previewObjectUrl: void 0,
					kind: i.kind,
					mimeType: i.mimeType,
					size: i.size,
					source: i.source,
					isLoadingPreview: !0,
					isCaching: !1,
					hasFetchFailed: !1
				}));
				let o = await X.createCachedMediaObjectUrl(e.url);
				a || m !== r ? o && X.revokeObjectUrl(o.objectUrl) : o ? (c(e.url), n.set(e.url, o.objectUrl), u(e.url, (e) => ({
					...e,
					hasResolvedCache: !0,
					cached: !0,
					previewObjectUrl: o.objectUrl,
					kind: o.kind,
					mimeType: o.mimeType,
					size: o.size,
					source: o.source,
					isLoadingPreview: !1,
					isCaching: !1,
					hasFetchFailed: !1
				}))) : (c(e.url), u(e.url, (e) => ({
					...e,
					hasResolvedCache: !0,
					cached: !0,
					kind: i.kind,
					mimeType: i.mimeType,
					size: i.size,
					source: i.source,
					previewObjectUrl: void 0,
					isLoadingPreview: !1
				})));
			}));
		})();
	}), {
		state: t,
		fetchAndCacheMedia: f
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryDialogUtils.ts
var ar = /:([^\s:]+):/g;
function or(e) {
	return e.nextUntil === null ? !1 : e.status === "success" ? e.hasMore : e.events.length > 0;
}
function sr(e, t) {
	return e ? {
		status: e.name ? "resolved" : "failed",
		name: e.name
	} : {
		status: t ? "loading" : "failed",
		name: null
	};
}
function cr(e, t) {
	return V.sanitizeExternalRelayUrls([
		...e?.channelRelayHints ?? [],
		...e?.fetchedRelays ?? [],
		...e?.relayHints ?? [],
		...e?.acceptedRelays ?? [],
		...t?.relayHints ?? [],
		...t?.relays ?? []
	], { limit: 8 });
}
function lr(e, t, n) {
	let r = Math.max(1, Math.ceil(t / n));
	return t === 0 ? 1 : Math.min(e, r);
}
var ur = {
	hour: "numeric",
	minute: "2-digit"
}, dr = {
	month: "numeric",
	day: "numeric",
	...ur
}, fr = {
	year: "numeric",
	month: "numeric",
	day: "numeric"
}, pr = {
	year: "numeric",
	month: "2-digit",
	day: "2-digit",
	hour: "2-digit",
	minute: "2-digit",
	second: "2-digit"
}, mr = {
	month: "numeric",
	day: "numeric",
	weekday: "short"
}, hr = {
	year: "numeric",
	month: "numeric"
}, gr = /* @__PURE__ */ new Map();
function _r(e, t) {
	let n = gr.get(t);
	n || (n = /* @__PURE__ */ new Map(), gr.set(t, n));
	let r = e ?? "", i = n.get(r);
	return i || (i = new Intl.DateTimeFormat(e ?? void 0, t), n.set(r, i)), i;
}
function vr(e, t = Date.now()) {
	let n = new Date(e), r = new Date(t);
	return xr(n, r) ? _r(void 0, ur).format(n) : n.getFullYear() === r.getFullYear() ? _r(void 0, dr).format(n) : _r(void 0, fr).format(n);
}
function yr(e, t) {
	return _r(t, pr).format(new Date(e));
}
function br(e, t, n = Date.now()) {
	let r = new Date(e), i = new Date(n);
	return xr(r, i) ? wr(0, t) : Sr(r, i) ? wr(-1, t) : r.getFullYear() === i.getFullYear() ? _r(t, mr).format(r) : _r(t, hr).format(r);
}
function xr(e, t) {
	return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
function Sr(e, t) {
	let n = new Date(t);
	return n.setHours(0, 0, 0, 0), n.setDate(n.getDate() - 1), xr(e, n);
}
var Cr = /* @__PURE__ */ new Map();
function wr(e, t) {
	let n = t ?? "", r = Cr.get(n);
	return r || (r = new Intl.RelativeTimeFormat(t ?? void 0, { numeric: "auto" }), Cr.set(n, r)), r.format(e, "day");
}
function Tr(e) {
	return e.trim() || " ";
}
function Er(e) {
	let t = [], n = /* @__PURE__ */ new Set();
	for (let r of e) {
		let e = Re(r.url);
		if (!e || n.has(e)) continue;
		n.add(e);
		let i = ze({
			url: r.url,
			mimeType: r.mimeType
		});
		t.push({
			...r,
			url: e,
			id: e,
			normalizedUrl: e,
			kind: i === "image" || i === "video" ? i : "other"
		});
	}
	return t;
}
function Dr(e) {
	return e.map((e) => ({
		id: e.id,
		src: e.url,
		alt: e.alt,
		type: "image",
		dim: e.dim
	}));
}
function Or(e) {
	let t = e.fallback ?? (e.kind === "video" ? "16 / 9" : "1 / 1"), n = Mr(e.dim);
	return n ? {
		width: n.width,
		height: n.height,
		aspectRatio: `${n.width} / ${n.height}`,
		hasExactDimensions: !0
	} : {
		aspectRatio: t,
		hasExactDimensions: !1
	};
}
function kr(e) {
	return e.hasFetchFailed ? "error" : e.previewObjectUrl ? "ready" : e.cached || e.isLoadingPreview ? "cache-materializing" : e.isCaching ? "loading" : (e.hasResolvedCache, e.hasMetadataHint ? "placeholder" : "unknown");
}
function Ar(e) {
	let t = Er(e), n = t.filter((e) => e.kind === "image");
	return {
		items: t,
		images: n,
		videos: t.filter((e) => e.kind === "video"),
		others: t.filter((e) => e.kind === "other"),
		fullscreenMediaItems: Dr(n)
	};
}
function jr(e) {
	let t = [], n = /* @__PURE__ */ new Set();
	for (let r of e) for (let e of r.media) {
		let r = Le(e.url);
		r && !n.has(r) && (n.add(r), t.push(e.url));
	}
	return t;
}
function Mr(e) {
	let t = e?.trim();
	if (!t) return null;
	let n = t.match(/^(\d+)\s*x\s*(\d+)$/i);
	if (!n) return null;
	let r = Number(n[1]), i = Number(n[2]);
	return !Number.isSafeInteger(r) || !Number.isSafeInteger(i) || r <= 0 || i <= 0 ? null : {
		width: r,
		height: i
	};
}
function Nr(e) {
	let t = Tr(e.content), n = ot(e.tags), r = Gr(e.media ?? []), i = [], a = /* @__PURE__ */ new Set(), o = Ur(t, zr(e.tags), n), s = Rr(tt(t), o), c = [...o.map((e) => ({
		...e,
		segment: {
			type: "hashtag",
			hashtag: e.hashtag
		}
	})), ...s.map(({ start: e, end: t, pubkey: n, relayHints: r }) => ({
		start: e,
		end: t,
		segment: {
			type: "mention",
			profile: {
				pubkey: n,
				relayHints: r
			}
		}
	}))].sort((e, t) => e.start - t.start), l = 0;
	for (let { start: e, end: o, segment: s } of c) Wr(t.slice(l, e), i, n, r, a), i.push(s), l = o;
	return Wr(t.slice(l), i, n, r, a), i.length === 0 && i.push({
		type: "text",
		text: t
	}), {
		segments: i,
		emojiUrls: [...a]
	};
}
var Pr = new Set(Array.from("。、．，,.!?！？…:;：；\"'”’」』）)]】〕〉》")), Fr = /https?:\/\//i, Ir = /^[A-Za-z0-9_]$/, Lr = /^(?:nostr:|https?:\/\/)/i;
function Rr(e, t) {
	let n = 0;
	return e.filter((e) => {
		for (; t[n] && t[n].end <= e.start;) n++;
		let r = t[n];
		return !r || e.end <= r.start;
	});
}
function zr(e) {
	return new Set(e.flatMap((e) => e[0] === "t" && typeof e[1] == "string" && e[1] ? [e[1].toLowerCase()] : []));
}
function Br(e, t) {
	let n = null;
	for (let r of t) {
		if (r.length > e.length || n && r.length <= n.length) continue;
		let t = e.slice(0, r.length);
		if (t.toLowerCase() !== r) continue;
		let i = t.at(-1) ?? "", a = e.charAt(r.length);
		a && Ir.test(i) && Ir.test(a) && !Lr.test(e.slice(r.length, r.length + 8)) || (n = t);
	}
	return n;
}
function Vr(e) {
	let t = e.length;
	for (; t > 0 && Pr.has(e.charAt(t - 1));) t--;
	return e.slice(0, t);
}
function Hr(e, t, n) {
	let r = Br(e, t);
	if (r) return r;
	let i = e;
	for (let t of e.matchAll(ar)) {
		let r = rt(t[1] ?? "");
		if (r && n.has(r)) {
			i = e.slice(0, t.index);
			break;
		}
	}
	let a = i.search(Fr);
	if (a >= 0 && (i = i.slice(0, a)), i.endsWith(":")) {
		let e = i.lastIndexOf(":", i.length - 2);
		e >= 0 && e < i.length - 2 && (i = i.slice(0, e));
	}
	return Vr(i);
}
function Ur(e, t, n) {
	let r = [];
	for (let i of e.matchAll(new RegExp(Ae.source, "g"))) {
		let e = Hr(i[1] ?? "", t, n);
		if (!e) continue;
		let a = (i.index ?? 0) + i[0].indexOf("#");
		r.push({
			start: a,
			end: a + 1 + e.length,
			hashtag: e
		});
	}
	return r;
}
function Wr(e, t, n, r, i) {
	let a = 0;
	for (let o of e.matchAll(ar)) {
		let s = o.index ?? -1, c = o[1] ?? "", l = o[0] ?? "";
		if (s < 0 || !l) continue;
		let u = rt(c), d = u ? n.get(u) : void 0;
		d && (s > a && Kr(t, e.slice(a, s), r), t.push({
			type: "emoji",
			shortcode: d.shortcode,
			shortcodeLower: u,
			rawShortcodeText: l,
			url: d.url
		}), i.add(d.url), a = s + l.length);
	}
	Kr(t, e.slice(a), r);
}
function Gr(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = Le(n.url);
		e && !t.has(e) && t.set(e, n);
	}
	return t;
}
function Kr(e, t, n) {
	if (!t) return;
	let r = 0;
	for (let i of Be(t)) {
		if (!i.isValidHttpUrl || !i.href) continue;
		let a = Le(i.displayText), o = n.get(a);
		qr(e, t.slice(r, i.candidateStart)), o ? e.push({
			type: "media",
			url: i.displayText,
			normalizedUrl: a,
			media: o
		}) : e.push({
			type: "link",
			text: i.displayText,
			href: i.href
		}), qr(e, i.trailingText), r = i.candidateEnd;
	}
	r < t.length && qr(e, t.slice(r));
}
function qr(e, t) {
	if (!t) return;
	let n = e[e.length - 1];
	n?.type === "text" ? n.text += t : e.push({
		type: "text",
		text: t
	});
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryMediaList.svelte
var Jr = F("<div class=\"copy-icon svg-icon\"></div>"), Yr = F("<button type=\"button\" class=\"post-history-media-surface svelte-8yjcw8\"><!></button>"), Xr = F("<video controls=\"\" playsinline=\"\" preload=\"metadata\" class=\"svelte-8yjcw8\"><track kind=\"captions\"/></video>", 2), Zr = F("<button type=\"button\" class=\"post-history-media-retry-button svelte-8yjcw8\"> </button>"), Qr = F("<div class=\"post-history-media-placeholder-loader svelte-8yjcw8\"><!></div>"), $r = F("<div><!> <!></div>"), ei = F("<div class=\"post-history-other-media-card svelte-8yjcw8\"><div class=\"post-history-other-media-header svelte-8yjcw8\"><span class=\"post-history-other-media-label svelte-8yjcw8\"> </span> <!></div> <div><div class=\"post-history-media-placeholder-content svelte-8yjcw8\"><!></div> <!></div></div>"), ti = F("<div class=\"post-history-other-media-list svelte-8yjcw8\"></div>"), ni = F("<div class=\"post-history-media-section svelte-8yjcw8\"><!> <!></div>"), ri = {
	hash: "svelte-8yjcw8",
	code: ".post-history-media-section.svelte-8yjcw8 {display:flex;flex-direction:column;min-width:0;gap:10px;}.post-preview-gallery-card.svelte-8yjcw8 {position:relative;width:clamp(\n            100px,\n            calc(var(--media-gallery-height) * var(--post-preview-gallery-aspect-ratio, 1)),\n            var(--media-gallery-max-width)\n        );max-width:100%;height:100%;overflow:hidden;border-radius:6px;}.post-preview-gallery-card.svelte-8yjcw8 :is(video:where(.svelte-8yjcw8), .post-history-media-surface:where(.svelte-8yjcw8)) {display:block;width:100%;height:100%;object-fit:contain;}.post-history-media-surface.svelte-8yjcw8 {padding:0;border:0;border-radius:inherit;background:transparent;cursor:zoom-in;}.post-history-media-surface.svelte-8yjcw8:focus-visible,\n    .post-history-media-retry-button.svelte-8yjcw8:focus-visible {outline:2px solid var(--theme);outline-offset:-2px;}.post-preview-gallery-card.svelte-8yjcw8 .post-history-media-placeholder:where(.svelte-8yjcw8) {display:grid;height:100%;place-items:center;padding:6px;}button.post-preview-gallery-copy {position:absolute;top:4px;right:4px;z-index:2;}.post-history-media-placeholder.svelte-8yjcw8 {display:flex;flex-direction:column;gap:8px;align-items:flex-start;justify-content:center;padding:12px;text-align:start;position:relative;isolation:isolate;height:auto;aspect-ratio:var(--post-history-media-aspect-ratio, 1 / 1);overflow-wrap:anywhere;margin-inline:auto;}.post-history-media-placeholder-content.svelte-8yjcw8 {position:relative;z-index:1;display:flex;flex-direction:column;gap:8px;width:100%;}.post-history-media-placeholder-loader.svelte-8yjcw8 {position:absolute;inset:auto 8px 8px auto;z-index:2;pointer-events:none;}.post-history-media-placeholder-uncached.svelte-8yjcw8 {--post-history-placeholder-stripe-soft: light-dark(\n            color-mix(in srgb, var(--background-color, #fff) 94%, #000 6%),\n            color-mix(in srgb, var(--background-color, #111) 94%, #fff 6%)\n        );--post-history-placeholder-stripe-strong: light-dark(\n            color-mix(in srgb, var(--background-color, #fff) 88%, #000 12%),\n            color-mix(in srgb, var(--background-color, #111) 88%, #fff 12%)\n        );background:repeating-linear-gradient(\n            -45deg,\n            var(--post-history-placeholder-stripe-soft),\n            var(--post-history-placeholder-stripe-soft) 10px,\n            var(--post-history-placeholder-stripe-strong) 10px,\n            var(--post-history-placeholder-stripe-strong) 20px\n        );}.post-history-media-placeholder-blurhash.svelte-8yjcw8 {background:color-mix(\n            in srgb,\n            var(--background-color, #fff) 18%,\n            #000 82%\n        );}.post-history-media-retry-button.svelte-8yjcw8 {width:100%;height:100%;padding:6px 12px;border:1px solid var(--border, #ccc);border-radius:10px;color:var(--text, #111);font:inherit;cursor:pointer;}.post-history-other-media-list.svelte-8yjcw8 {display:flex;flex-direction:column;gap:10px;}.post-history-other-media-card.svelte-8yjcw8 {display:flex;flex-direction:column;width:100%;border-radius:12px;border:1px solid var(--border-hr);background:var(--bg-input);overflow:hidden;}.post-history-other-media-header.svelte-8yjcw8 {display:flex;align-items:center;justify-content:space-between;}.post-history-other-media-label.svelte-8yjcw8 {min-width:0;padding:4px 8px;overflow-wrap:anywhere;color:var(--text-muted);font-size:0.875rem;line-height:1.2;}button.post-history-media-copy-button.circle.copy {min-width:36px;width:36px;height:36px;min-height:36px;z-index:2;}"
};
function ii(o, d) {
	r(d, !0), j(o, ri);
	let p = () => te(pe, "$_", g), [g, y] = ee(), b = (e, t = m, n = m) => {
		{
			let r = _(() => `post-history-media-copy-button ${n()}`), i = _(() => le(t().kind, t().url)), a = _(() => le(t().kind, t().url)), o = _(() => U(t().kind));
			Ve(e, {
				variant: "copy",
				shape: "circle",
				get className() {
					return L(r);
				},
				get ariaLabel() {
					return L(i);
				},
				get title() {
					return L(a);
				},
				onClick: (e) => q(t(), e),
				get floatingMessage() {
					return L(o);
				},
				children: (e, t) => {
					var n = Jr();
					s(e, n);
				},
				$$slots: { default: !0 }
			});
		}
	}, S = "160px 0px", C = I(d, "scrollRoot", 3, null), D = I(d, "onImageOpen", 3, void 0), A = I(d, "mediaLayout", 3, void 0), M = B(k({})), F = /* @__PURE__ */ new Set(), ne = new de(), R = /* @__PURE__ */ new Map(), z = _(() => A() ?? Ar(d.media)), re = ir({ getMedia: () => L(z).items }), ie = _(() => new Map(re.state.items.map((e) => [e.url, e]))), ae = _(() => L(z).items.filter((e) => e.kind === "image" || e.kind === "video").map((e) => ({
		...se(e),
		aspectRatio: e.kind === "image" ? V(e) : void 0
	})));
	function V(e) {
		let t = R.get(e.id);
		if (t !== void 0) return t;
		let { width: n, height: r } = Or(e), i = n && r ? n / r : 1;
		return R.set(e.id, i), i;
	}
	let oe = _(() => L(z).others.map((e) => se(e)));
	function H(e) {
		let t = e.alt?.trim();
		if (t) return t;
		try {
			return new URL(e.url).pathname.split("/").filter(Boolean).at(-1) || e.url;
		} catch {
			return e.url;
		}
	}
	function se(e) {
		let t = L(ie).get(e.url);
		return {
			...e,
			alt: t?.alt ?? e.alt,
			mimeType: t?.mimeType ?? e.mimeType,
			blurhash: t?.blurhash ?? e.blurhash,
			dim: t?.dim ?? e.dim,
			size: t?.size ?? e.size,
			uploadProtocol: t?.uploadProtocol ?? e.uploadProtocol,
			hasResolvedCache: t?.hasResolvedCache ?? !1,
			cached: t?.cached ?? !1,
			previewObjectUrl: t?.previewObjectUrl,
			isLoadingPreview: t?.isLoadingPreview ?? !1,
			isCaching: t?.isCaching ?? !1,
			hasFetchFailed: t?.hasFetchFailed ?? !1
		};
	}
	function ce(e) {
		return e === "video" ? "videoContextMenu" : "imageContextMenu";
	}
	function le(e, t) {
		let n = ce(e), r = L(M)[t];
		return r === "copied" ? p()(`${n}.copySuccess`) : r === "failed" ? p()(`${n}.copyFailed`) : p()(`${n}.copyUrl`);
	}
	function U(e) {
		return p()(`${ce(e)}.copySuccess`);
	}
	function ue(e) {
		return `${p()("postHistory.mediaOpen")} ${H(e)}`;
	}
	function W(e) {
		return !!(e.blurhash?.trim() || e.dim?.trim());
	}
	function G(e) {
		return kr({
			hasResolvedCache: e.hasResolvedCache,
			cached: e.cached,
			previewObjectUrl: e.previewObjectUrl,
			isLoadingPreview: e.isLoadingPreview,
			isCaching: e.isCaching,
			hasFetchFailed: e.hasFetchFailed,
			hasMetadataHint: W(e)
		});
	}
	function K(e) {
		F.has(e) || (F.add(e), re.fetchAndCacheMedia(e));
	}
	async function q(e, t) {
		t.stopPropagation(), t.preventDefault();
		let n = await Ne(e.url, "URL", navigator, window);
		return x(M, {
			...L(M),
			[e.url]: n ? "copied" : "failed"
		}, !0), setTimeout(() => {
			x(M, {
				...L(M),
				[e.url]: void 0
			}, !0);
		}, 1800), n;
	}
	function J(e) {
		re.fetchAndCacheMedia(e.url);
	}
	function fe(e, t) {
		if (!e.cached) return;
		let n = L(z).fullscreenMediaItems.findIndex((t) => t.id === e.id);
		n < 0 || D()?.({
			index: n,
			mediaList: L(z).fullscreenMediaItems,
			focusOrigin: t
		});
	}
	function me(e) {
		return e.previewObjectUrl === e.url;
	}
	function he(e) {
		return e.hasResolvedCache && !e.cached && !e.isCaching && !e.hasFetchFailed;
	}
	function ge(e, t) {
		return t !== "ready" && t !== "cache-materializing" && (!e.hasResolvedCache || t === "loading");
	}
	function _e(e, t) {
		return !!e.blurhash && t !== "ready" && t !== "cache-materializing" && (e.kind === "image" || e.kind === "video");
	}
	function ve(e) {
		return `${Y(e)} ${H(e)}`;
	}
	function Y(e) {
		return !e.hasResolvedCache || e.isLoadingPreview ? p()("postHistory.mediaLoading") : e.cached ? p()("postHistory.mediaCached") : e.hasFetchFailed ? p()("postHistory.mediaLoadFailed") : e.isCaching ? p()("postHistory.mediaLoading") : p()("postHistory.mediaNotCached");
	}
	var be = l(), xe = O(be), Se = (r) => {
		var a = ni(), o = E(a);
		st(o, {
			get items() {
				return L(ae);
			},
			preview: !0,
			renderItem: (r, a = m) => {
				let o = _(() => G(a())), u = _(() => me(a()) && !ne.has(a().url) ? void 0 : a().previewObjectUrl), d = _(() => _e(a(), L(o)));
				var g = $r();
				let y;
				var x = E(g), k = (e) => {
					var n = l(), r = O(n), i = (e) => {
						var t = Yr(), n = E(t);
						{
							let e = _(() => a().alt || H(a()));
							lt(n, {
								get src() {
									return L(u);
								},
								get alt() {
									return L(e);
								},
								fillWidth: !0
							});
						}
						f(t), T((e, n) => {
							w(t, "aria-label", e), w(t, "title", n);
						}, [() => ue(a()), () => H(a())]), h("click", t, (e) => fe(a(), e.currentTarget)), s(e, t);
					}, o = (e) => {
						{
							let t = _(() => a().alt || H(a()));
							lt(e, {
								get src() {
									return L(u);
								},
								get alt() {
									return L(t);
								},
								fillWidth: !0
							});
						}
					};
					t(r, (e) => {
						D() ? e(i) : e(o, -1);
					}), s(e, n);
				}, A = (e) => {
					var t = Xr();
					T((e) => {
						w(t, "src", L(u)), w(t, "aria-label", e);
					}, [() => H(a())]), s(e, t);
				}, j = (e) => {
					var r = $r(), l = E(r), u = (e) => {
						tr(e, { get blurhash() {
							return a().blurhash;
						} });
					};
					t(l, (e) => {
						L(d) && e(u);
					});
					var m = N(l, 2), g = (e) => {
						var t = Zr(), n = P(t, !0);
						T((e) => c(n, e), [() => p()("postHistory.mediaFetchAndCache")]), h("click", t, () => J(a())), s(e, t);
					}, v = (e) => {
						var t = Qr(), n = E(t);
						ye(n, {
							showLoader: !0,
							text: !1,
							loaderSize: 34
						}), f(t), s(e, t);
					}, y = _(() => ge(a(), L(o)));
					t(m, (e) => {
						a().hasFetchFailed ? e(g) : L(y) && e(v, 1);
					}), f(r), T((e, t) => {
						i(r, 1, n(["post-history-media-placeholder", {
							"post-history-media-placeholder-failed": a().hasFetchFailed,
							"post-history-media-placeholder-blurhash": L(d)
						}]), "svelte-8yjcw8"), w(r, "aria-label", e), w(r, "title", t);
					}, [() => ve(a()), () => H(a())]), s(e, r);
				};
				t(x, (e) => {
					L(u) && a().kind === "image" ? e(k) : L(u) && a().kind === "video" ? e(A, 1) : L(o) !== "cache-materializing" && e(j, 2);
				});
				var M = N(x, 2);
				b(M, a, () => "post-preview-gallery-copy"), f(g), e(g, (e, t) => ut?.(e, t), () => ({
					enabled: he(a()) || me(a()) && !ne.has(a().url),
					once: !0,
					root: C(),
					rootMargin: S,
					onEnterView: () => {
						ne.add(a().url), he(a()) && K(a().url);
					}
				})), T(() => {
					i(g, 1, n(["post-preview-gallery-card", a().kind === "image" ? "post-history-image-cell" : "post-history-video-media-frame"]), "svelte-8yjcw8"), y = v(g, "", y, { "--post-preview-gallery-aspect-ratio": a().aspectRatio });
				}), s(r, g);
			},
			$$slots: { renderItem: !0 }
		});
		var d = N(o, 2), g = (n) => {
			var r = ti();
			u(r, 21, () => L(oe), (e) => e.id, (n, r) => {
				let a = _(() => G(L(r)));
				var o = ei(), l = E(o), u = E(l), d = P(u, !0), m = N(u, 2);
				b(m, () => L(r), () => ""), f(l);
				var g = N(l, 2);
				let v;
				var y = E(g), x = E(y), D = (e) => {
					var t = Zr(), n = P(t, !0);
					T((e) => c(n, e), [() => p()("postHistory.mediaFetchAndCache")]), h("click", t, () => J(L(r))), s(e, t);
				};
				t(x, (e) => {
					L(r).hasFetchFailed && e(D);
				}), f(y);
				var O = N(y, 2), k = (e) => {
					var t = Qr(), n = E(t);
					ye(n, {
						showLoader: !0,
						text: !1,
						loaderSize: 34
					}), f(t), s(e, t);
				}, A = _(() => ge(L(r), L(a)));
				t(O, (e) => {
					L(A) && e(k);
				}), f(g), f(o), e(o, (e, t) => ut?.(e, t), () => ({
					enabled: he(L(r)),
					once: !0,
					root: C(),
					rootMargin: S,
					onEnterView: () => K(L(r).url)
				})), T((e, t, n) => {
					c(d, e), v = i(g, 1, "post-history-media-placeholder svelte-8yjcw8", null, v, {
						"post-history-media-placeholder-cached": L(r).cached,
						"post-history-media-placeholder-uncached": !L(r).cached && !L(r).hasFetchFailed,
						"post-history-media-placeholder-failed": L(r).hasFetchFailed
					}), w(g, "aria-label", t), w(g, "title", n);
				}, [
					() => H(L(r)),
					() => ve(L(r)),
					() => H(L(r))
				]), s(n, o);
			}), f(r), s(n, r);
		};
		t(d, (e) => {
			L(oe).length > 0 && e(g);
		}), f(a), s(r, a);
	};
	t(xe, (e) => {
		L(z).items.length > 0 && e(Se);
	}), s(o, be), a(), y();
}
b(["click"]);
// D:/ドキュメント/GitHub/ehagaki/src/components/TextLinkSegments.svelte
var ai = F("<a class=\"reference-content-link svelte-1dq7r7\" target=\"_blank\" rel=\"noopener noreferrer\"> </a>"), oi = F("<span> </span>"), si = {
	hash: "svelte-1dq7r7",
	code: ".reference-content-link.svelte-1dq7r7 {overflow-wrap:anywhere;word-break:break-word;}.reference-content-link.svelte-1dq7r7:visited {color:var(--link-visited);}"
};
function ci(e, n) {
	j(e, si);
	var r = l(), i = O(r);
	u(i, 17, () => n.segments, g, (e, n) => {
		var r = l(), i = O(r), a = (e) => {
			var t = ai(), r = P(t, !0);
			T(() => {
				w(t, "href", L(n).href), c(r, L(n).text);
			}), s(e, t);
		}, o = (e) => {
			var t = oi(), r = P(t, !0);
			T(() => c(r, L(n).text)), s(e, t);
		};
		t(i, (e) => {
			L(n).type === "link" ? e(a) : e(o, -1);
		}), s(e, r);
	}), s(e, r);
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryPreviewContent.svelte
var li = F("<a class=\"profile-mention svelte-yrehuj\" target=\"_blank\" rel=\"noopener noreferrer\"><span class=\"profile-mention-prefix svelte-yrehuj\"><span class=\"profile-mention-avatar svelte-yrehuj\" aria-hidden=\"true\"><!></span>@</span> </a>"), ui = F("<a class=\"hashtag-link svelte-yrehuj\" target=\"_blank\" rel=\"noopener noreferrer\"> </a>"), di = F("<span> </span>"), fi = F("<span class=\"post-history-custom-emoji-slot post-history-custom-emoji-failed svelte-yrehuj\" role=\"img\" tabindex=\"0\"> </span>"), pi = F("<img class=\"post-history-custom-emoji svelte-yrehuj\" draggable=\"false\" loading=\"lazy\" decoding=\"async\"/>"), mi = F("<span class=\"post-history-custom-emoji-placeholder svelte-yrehuj\" aria-hidden=\"true\"></span>"), hi = F("<span class=\"post-history-custom-emoji-slot svelte-yrehuj\"><!></span>"), gi = F("<div></div> <!>", 1), _i = F("<div class=\"post-history-preview-content svelte-yrehuj\"><!></div>"), vi = {
	hash: "svelte-yrehuj",
	code: ".profile-mention.svelte-yrehuj,\n    .hashtag-link.svelte-yrehuj {overflow-wrap:anywhere;}\n    /* Keeps the icon beside \"@\" and stops the body's pre-wrap from adding a line inside the avatar. */.profile-mention-prefix.svelte-yrehuj {white-space:nowrap;}.profile-mention-avatar.svelte-yrehuj {display:inline-block;width:1.25em;height:1.25em;margin-inline-end:0.2em;vertical-align:-0.25em;}.profile-mention-avatar.svelte-yrehuj .profile-mention-avatar-root {display:block;width:100%;height:100%;overflow:hidden;border-radius:50%;}.profile-mention-avatar.svelte-yrehuj .profile-mention-avatar-image {display:block;width:100%;height:100%;object-fit:cover;}.post-history-preview-content.svelte-yrehuj {position:relative;display:flex;flex-direction:column;gap:6px;}.post-history-preview-text.svelte-yrehuj {overflow-wrap:anywhere;white-space:pre-wrap;font-size:var(--post-content-font-size, 1rem);line-height:var(--post-content-line-height, 1.5);}.post-history-preview-text-collapsed.svelte-yrehuj {max-height:calc(5 * var(--post-content-line-height, 1.5) * 1em);overflow:hidden;}.post-history-custom-emoji-slot.svelte-yrehuj {display:inline-grid;margin:0;padding:0;}.post-history-custom-emoji.svelte-yrehuj,\n    .post-history-custom-emoji-placeholder.svelte-yrehuj {width:100%;height:100%;}.post-history-custom-emoji.svelte-yrehuj {display:block;margin:0;padding:0;object-fit:contain;user-select:none;-webkit-user-drag:none;}.post-history-custom-emoji-failed.svelte-yrehuj {display:inline-grid;place-items:center;overflow:hidden;border-radius:4px;background:rgba(127, 127, 127, 0.18);font-size:0.45em;line-height:1;vertical-align:bottom;white-space:nowrap;cursor:help;}.post-history-custom-emoji-placeholder.svelte-yrehuj {display:block;border-radius:4px;background:rgba(127, 127, 127, 0.18);}"
};
function yi(p, h) {
	r(h, !0), j(p, vi);
	let y = I(h, "textOverlay", 3, void 0), b = I(h, "emojiLoadStateByUrl", 19, () => ({})), x = I(h, "emojiImageMetaByUrl", 19, () => ({})), S = I(h, "previewCollapseAction", 3, () => ({})), D = I(h, "previewCollapseEventId", 3, ""), k = I(h, "previewContentId", 3, void 0), A = I(h, "isCollapsed", 3, !1), ee = I(h, "emojiSize", 3, 30), F = I(h, "fontSize", 3, "1rem"), te = I(h, "lineHeight", 3, 1.5), ne = I(h, "contentClass", 3, ""), R = I(h, "collapsedContentClass", 3, ""), z = I(h, "kind", 3, void 0), B = /* @__PURE__ */ new Map(), re = qn(), ie = _(() => ({
		client: ke.externalNostrClient,
		customUrlTemplate: ke.externalNostrClientCustomUrl
	}));
	function ae(e) {
		return e.type !== "media";
	}
	let V = _(() => h.previewContent.segments.filter(ae));
	M(() => {
		let e = L(V).flatMap((e) => e.type === "mention" ? [e.profile] : []);
		e.length && C(() => re?.load(e));
	});
	let oe = _(() => L(V).some((e) => e.type === "emoji" || e.type === "link" || e.type === "mention" || e.type === "hashtag" || e.type === "text" && e.text.trim().length > 0));
	function H(e) {
		return b()[e] === "ready";
	}
	function se(e) {
		return b()[e] === "failed";
	}
	function ce(e) {
		return Number.isInteger(e) ? `${e}` : e.toFixed(6).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
	}
	function le(e) {
		let t = B.get(e);
		if (t === void 0) {
			let n = x()[e]?.aspectRatio;
			t = typeof n == "number" && Number.isFinite(n) && n > 0 ? ee() * n : ee(), B.set(e, t);
		}
		return [
			`width: ${ce(t)}px;`,
			`height: ${ee()}px;`,
			"vertical-align: bottom;"
		].join(" ");
	}
	var U = _i(), ue = E(U), W = (r) => {
		var a = gi(), p = O(a);
		u(p, 21, () => L(V), g, (e, n) => {
			var r = l(), i = O(r), a = (e) => {
				{
					let t = _(() => [L(n)]);
					ci(e, { get segments() {
						return L(t);
					} });
				}
			}, o = (e) => {
				let t = _(() => L(n).profile.pubkey), r = _(() => re?.read(L(t))), i = _(() => et(L(t), L(r))), a = _(() => Qe(L(i)));
				var o = li(), l = E(o), u = E(l), p = E(u);
				{
					let e = _(() => L(r)?.displayName), n = _(() => L(r)?.name), i = _(() => L(r)?.picture);
					Ge(p, {
						get pubkeyHex() {
							return L(t);
						},
						get displayName() {
							return L(e);
						},
						get name() {
							return L(n);
						},
						get src() {
							return L(i);
						},
						fallbackAriaLabel: "",
						fallbackDelayMs: 0,
						rootClassName: "profile-mention-avatar-root",
						imageClassName: "profile-mention-avatar-image"
					});
				}
				f(u), d(), f(l);
				var m = N(l, 1, !0);
				f(o), T((e) => {
					w(o, "href", e), w(o, "title", L(i) === L(a) ? void 0 : `@${L(i)}`), c(m, L(a));
				}, [() => dt(L(n).profile, L(ie))]), s(e, o);
			}, u = (e) => {
				let r = _(() => ft(L(n).hashtag, L(ie), z()));
				var i = l(), a = O(i), o = (e) => {
					var t = ui(), i = P(t);
					T(() => {
						w(t, "href", L(r)), c(i, `#${L(n).hashtag ?? ""}`);
					}), s(e, t);
				}, u = (e) => {
					var t = di(), r = P(t);
					T(() => c(r, `#${L(n).hashtag ?? ""}`)), s(e, t);
				};
				t(a, (e) => {
					L(r) ? e(o) : e(u, -1);
				}), s(e, i);
			}, p = (e) => {
				var t = fi(), r = P(t, !0);
				T((e) => {
					v(t, e), w(t, "aria-label", L(n).rawShortcodeText), w(t, "title", L(n).rawShortcodeText), c(r, L(n).rawShortcodeText);
				}, [() => le(L(n).url)]), s(e, t);
			}, m = _(() => se(L(n).url)), h = (e) => {
				var r = hi(), i = E(r), a = (e) => {
					var t = pi();
					T(() => {
						w(t, "src", L(n).url), w(t, "alt", L(n).rawShortcodeText), w(t, "title", L(n).rawShortcodeText);
					}), s(e, t);
				}, o = _(() => H(L(n).url)), c = (e) => {
					var t = mi();
					s(e, t);
				};
				t(i, (e) => {
					L(o) ? e(a) : e(c, -1);
				}), f(r), T((e) => v(r, e), [() => le(L(n).url)]), s(e, r);
			};
			t(i, (e) => {
				L(n).type === "text" || L(n).type === "link" ? e(a) : L(n).type === "mention" ? e(o, 1) : L(n).type === "hashtag" ? e(u, 2) : L(m) ? e(p, 3) : e(h, -1);
			}), s(e, r);
		}), f(p), e(p, (e, t) => S()?.(e, t), D);
		var h = N(p, 2);
		o(h, () => y() ?? m), T((e) => {
			w(p, "id", k()), i(p, 1, e, "svelte-yrehuj");
		}, [() => n([
			"post-history-preview-text",
			ne(),
			A() ? "post-history-preview-text-collapsed" : "",
			A() ? R() : ""
		].filter(Boolean).join(" "))]), s(r, a);
	};
	t(ue, (e) => {
		L(oe) && e(W);
	}), f(U), T(() => v(U, `--post-content-font-size: ${F()}; --post-content-line-height: ${te()};`)), s(p, U), a();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postContentPreview.ts
function bi(e, t) {
	let n = t.find((e) => e[0] === "content-warning");
	return n && n.length > 2 ? n[2] : e;
}
function xi(e) {
	let t = e.tags.find((e) => e[0] === "content-warning"), n = t !== void 0 && t.length > 2, r = e.resolvedBody ? e.sourceContent : bi(e.sourceContent, e.tags), i = e.displayContent ?? r, a = Se({
		content: r,
		tags: e.tags
	}), o = e.media === void 0 ? a : n ? [...e.media, ...a.filter((t) => !e.media.some((e) => e.url === t.url))] : e.media, s = Nr({
		content: i,
		tags: e.tags,
		media: o
	}), c = Ar([...(i === r ? s.segments : Nr({
		content: r,
		tags: e.tags,
		media: o
	}).segments).flatMap((e) => e.type === "media" ? [e.media] : []), ...o]);
	return {
		previewContent: s,
		media: o,
		mediaLayout: c,
		hasRenderableText: s.segments.some((e) => e.type === "emoji" || e.type === "link" || e.type === "mention" || e.type === "hashtag" || e.type === "text" && e.text.trim().length > 0),
		hasRenderableMedia: c.items.length > 0,
		contentWarning: t ? { reason: t?.[1] ?? "" } : null,
		sourceTags: e.tags.map((e) => [...e]),
		kind: e.kind
	};
}
function Si(e, t, n = t) {
	return xi({
		kind: e.kind,
		sourceContent: t,
		displayContent: n,
		tags: e.sourceTags,
		resolvedBody: !0
	});
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostContentPreview.svelte
var Ci = F("<span class=\"svelte-13idcaf\"> </span>"), wi = F("<span role=\"status\" class=\"svelte-13idcaf\"> </span>"), Ti = F("<div class=\"content-warning-prompt svelte-13idcaf\" role=\"group\"><div class=\"content-warning-copy svelte-13idcaf\"><strong> </strong> <!></div> <!> <button type=\"button\" class=\"content-warning-reveal-button svelte-13idcaf\"> </button></div>"), Ei = F("<div class=\"post-preview-content\"><!></div>"), Di = F("<div class=\"post-preview-media\"><!></div>"), Oi = F("<!> <!> <!> <!>", 1), ki = F("<div><!></div>"), Ai = {
	hash: "svelte-13idcaf",
	code: ".post-content-preview.svelte-13idcaf {display:flex;flex-direction:column;gap:var(--post-content-block-gap, 6px);width:100%;max-width:100%;min-width:0;}.content-warning-prompt.svelte-13idcaf {display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;width:100%;max-width:100%;min-width:0;box-sizing:border-box;padding:10px 12px;border:1px solid var(--border);border-radius:8px;background:color-mix(in srgb, var(--dialog-bg), var(--border-hr) 16%);color:var(--text);}.content-warning-copy.svelte-13idcaf {display:flex;flex:1 1 0;flex-direction:column;gap:3px;min-width:0;overflow-wrap:anywhere;}.content-warning-copy.svelte-13idcaf span:where(.svelte-13idcaf) {color:var(--text-muted);font-size:0.9em;}.content-warning-reveal-button.svelte-13idcaf {flex:0 1 auto;height:auto;max-width:100%;min-width:0;min-height:40px;box-sizing:border-box;padding:6px 10px;border:1px solid var(--border);border-radius:6px;background:var(--dialog-bg);color:var(--text);font:inherit;cursor:pointer;white-space:normal;overflow-wrap:anywhere;}.content-warning-reveal-button.svelte-13idcaf:hover {border-color:var(--theme);}"
};
function ji(e, n) {
	r(n, !0), j(e, Ai);
	let u = () => te(pe, "$_", d), [d, p] = ee(), g = I(n, "loadSensitiveBody", 3, void 0), y = I(n, "resolveSensitiveDisplayContent", 3, void 0), b = I(n, "contentWarningEventId", 3, void 0), S = I(n, "density", 3, "standard"), D = I(n, "emojiLoadStateByUrl", 19, () => ({})), A = I(n, "emojiImageMetaByUrl", 19, () => ({})), F = I(n, "scrollRoot", 3, null), R = I(n, "previewContentId", 3, void 0), z = I(n, "isTextCollapsed", 3, !1), re = I(n, "previewCollapseAction", 3, () => ({})), ie = I(n, "previewCollapseEventId", 3, ""), ae = I(n, "contentClass", 3, ""), V = I(n, "collapsedContentClass", 3, ""), oe = I(n, "renderWhenEmpty", 3, !1), H = I(n, "onImageOpen", 3, void 0), se = I(n, "betweenContentAndMedia", 3, void 0), ce = I(n, "afterContentAndMedia", 3, void 0), le = I(n, "textOverlay", 3, void 0), U = B(null), ue = B(!1), W = B(void 0), G = B(!1), de = B(!1), K = 0, q, J = B(k({})), fe = B(k({})), me = _(() => b() === void 0 ? L(ue) : L(U) === b());
	function he() {
		q?.abort(), q = void 0, K += 1, x(U, null), x(ue, !1), x(W, void 0), x(G, !1), x(de, !1), x(J, {}, !0), x(fe, {}, !0);
	}
	let ge, _e, ve = _(b), ye = _(g);
	M(() => {
		let e = L(ve), t = L(ye), n = t === _e || !!t?.scope && !!_e?.scope && t.scope.runtime === _e.scope.runtime && t.scope.ownerPubkey === _e.scope.ownerPubkey;
		e === ge && n || C(he), ge = e, _e = t;
		let r = !0, i = t?.observe?.((e) => {
			r && (e === "deleted" || e === "invalid" || e === "missing" && L(W) !== void 0) && (he(), x(de, !0));
		});
		return () => {
			r = !1, i?.();
		};
	}), ne(he);
	let Y = _(() => L(W) === void 0 ? n.model : Si(n.model, L(W), y()?.(L(W)) ?? L(W)));
	M(() => {
		if (!L(me) || L(W) === void 0 || !g()?.loadEmoji) return;
		let e = L(Y).previewContent.emojiUrls, t = g().loadEmoji, n = K;
		for (let r of e) C(() => L(J)[r]) || D()[r] === "ready" || (x(J, {
			...C(() => L(J)),
			[r]: "loading"
		}, !0), t(r).then((e) => {
			n === K && (x(J, {
				...L(J),
				[r]: e.ready ? "ready" : "failed"
			}, !0), e.ready && e.aspectRatio && x(fe, {
				...L(fe),
				[r]: { aspectRatio: e.aspectRatio }
			}, !0));
		}).catch(() => {
			n === K && x(J, {
				...L(J),
				[r]: "failed"
			}, !0);
		}));
	});
	async function be() {
		if (g()) {
			let e = K;
			q?.abort(), q = new AbortController(), x(G, !0), x(de, !1);
			try {
				let t = await g()(q.signal);
				if (e !== K) return;
				if (t === null) {
					x(de, !0);
					return;
				}
				x(W, t, !0);
			} catch {
				if (e !== K) return;
				x(de, !0);
				return;
			} finally {
				e === K && x(G, !1);
			}
		}
		b() === void 0 ? x(ue, !0) : x(U, b());
	}
	let xe = _(() => {
		switch (S()) {
			case "compact": return {
				emojiSize: 24,
				fontSize: "inherit",
				lineHeight: 1.45,
				gap: 4
			};
			case "reply": return {
				emojiSize: 30,
				fontSize: "inherit",
				lineHeight: 1.4,
				gap: 6
			};
			case "dialog": return {
				emojiSize: 30,
				fontSize: "inherit",
				lineHeight: 1.45,
				gap: 6
			};
			default: return {
				emojiSize: 30,
				fontSize: "1rem",
				lineHeight: 1.5,
				gap: 6
			};
		}
	});
	var Se = l(), Ce = O(Se), we = (e) => {
		var n = ki(), r = E(n), a = (e) => {
			var n = Ti(), r = E(n), i = E(r), a = P(i, !0), o = N(i, 2), l = (e) => {
				var t = Ci(), n = P(t, !0);
				T(() => c(n, L(Y).contentWarning.reason)), s(e, t);
			};
			t(o, (e) => {
				L(Y).contentWarning.reason && e(l);
			}), f(r);
			var d = N(r, 2), p = (e) => {
				var t = wi(), n = P(t, !0);
				T((e) => c(n, e), [() => u()("postContent.sensitivePayloadLoading")]), s(e, t);
			}, m = (e) => {
				var t = wi(), n = P(t, !0);
				T((e) => c(n, e), [() => u()("postContent.sensitivePayloadUnavailable")]), s(e, t);
			};
			t(d, (e) => {
				L(G) ? e(p) : L(de) && e(m, 1);
			});
			var g = N(d, 2), _ = P(g, !0);
			f(n), T((e, t, r) => {
				w(n, "aria-label", e), c(a, t), g.disabled = L(G), c(_, r);
			}, [
				() => u()("postContent.contentWarningTitle"),
				() => u()("postContent.contentWarningTitle"),
				() => u()(L(de) ? "postContent.retrySensitivePayload" : "postContent.showContentWarningBody")
			]), h("click", g, () => void be()), s(e, n);
		}, l = (e) => {
			var n = Oi(), r = O(n), i = (e) => {
				var t = Ei(), n = E(t);
				{
					let e = _(() => ({
						...D(),
						...L(J)
					})), t = _(() => ({
						...A(),
						...L(fe)
					}));
					yi(n, {
						get previewContent() {
							return L(Y).previewContent;
						},
						get emojiLoadStateByUrl() {
							return L(e);
						},
						get emojiImageMetaByUrl() {
							return L(t);
						},
						get previewCollapseAction() {
							return re();
						},
						get previewCollapseEventId() {
							return ie();
						},
						get previewContentId() {
							return R();
						},
						get textOverlay() {
							return le();
						},
						get contentClass() {
							return ae();
						},
						get collapsedContentClass() {
							return V();
						},
						get isCollapsed() {
							return z();
						},
						get emojiSize() {
							return L(xe).emojiSize;
						},
						get fontSize() {
							return L(xe).fontSize;
						},
						get lineHeight() {
							return L(xe).lineHeight;
						},
						get kind() {
							return L(Y).kind;
						}
					});
				}
				f(t), s(e, t);
			};
			t(r, (e) => {
				L(Y).hasRenderableText && e(i);
			});
			var a = N(r, 2);
			o(a, () => se() ?? m);
			var c = N(a, 2), l = (e) => {
				var t = Di();
				ii(E(t), {
					get media() {
						return L(Y).media;
					},
					get mediaLayout() {
						return L(Y).mediaLayout;
					},
					get scrollRoot() {
						return F();
					},
					get onImageOpen() {
						return H();
					}
				}), f(t), s(e, t);
			};
			t(c, (e) => {
				L(Y).hasRenderableMedia && e(l);
			});
			var u = N(c, 2);
			o(u, () => ce() ?? m), s(e, n);
		};
		t(r, (e) => {
			L(Y).contentWarning && !L(me) ? e(a) : e(l, -1);
		}), f(n), T(() => {
			i(n, 1, `post-content-preview post-content-preview-${S()}`, "svelte-13idcaf"), v(n, `--post-content-block-gap: ${L(xe).gap}px;`);
		}), s(e, n);
	};
	t(Ce, (e) => {
		(L(Y).hasRenderableText || L(Y).hasRenderableMedia || L(Y).contentWarning || oe() || ce()) && e(we);
	}), s(e, Se), a(), p();
}
b(["click"]);
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryDialogPresentation.ts
function Mi(e) {
	return e.isSearchMode ? e.totalCountKnown === !1 ? { key: e.totalCountStatus === "failed" ? "postHistory.countUnavailable" : "postHistory.countLoading" } : e.totalCount <= 0 ? null : {
		key: "postHistory.searchCountSummary",
		values: { total: e.totalCount }
	} : e.totalCountKnown ? {
		key: "postHistory.visibleCountSummary",
		values: { total: e.totalCount }
	} : e.totalCountStatus === "failed" ? { key: "postHistory.countUnavailable" } : { key: "postHistory.countLoading" };
}
function Ni(e) {
	return e.direction === "older" ? e.isSearchMode ? "postHistory.loadOlderSearchResults" : "postHistory.loadOlder" : e.isSearchMode ? "postHistory.loadNewerSearchResults" : "postHistory.loadNewer";
}
function Pi(e) {
	return e.status === "loading" ? { key: "postHistory.checkingReplies" } : e.status === "failed" ? { key: "postHistory.recheckReplies" } : e.status === "loaded" ? e.replyCount === 0 ? { key: "postHistory.recheckReplies" } : e.visible ? { key: "postHistory.hideReplies" } : {
		key: "postHistory.showRepliesWithCount",
		values: { count: e.replyCount }
	} : { key: "postHistory.checkReplies" };
}
function Fi(e) {
	return e.visible ? { key: "postHistory.hideReactions" } : {
		key: "postHistory.showReactionsWithCount",
		values: { count: e.reactionCount }
	};
}
function Ii(e) {
	return e === "+";
}
function Li(e) {
	let t = e.trim();
	return t ? nt(t) ? t : Ze(t) : "+";
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryChildInteractionsAdapter.ts
function Ri(e) {
	return e.sort((e, t) => e.createdAt === t.createdAt ? e.eventId.localeCompare(t.eventId) : e.createdAt - t.createdAt);
}
function zi(e, t, n) {
	let r = Array.from(new Set(t.filter((e) => !!e))), i = new Map(r.map((e) => [e, []]));
	for (let t of e) n(t) && i.get(t.parentEventId)?.push(t);
	return r.flatMap((e) => Ri(i.get(e) ?? []));
}
var Bi = class {
	repository;
	constructor(e = ct) {
		this.repository = e;
	}
	async getReactionRecords(e, t) {
		return (await (t ? this.repository.getChildInteractions(e, t) : this.repository.getChildInteractions(e))).filter((e) => e.kind === 7);
	}
	async getReactionRecordsForParents(e, t) {
		let n = Array.from(new Set(e.filter((e) => !!e)));
		return zi(this.repository.getChildInteractionsForParents ? await (t ? this.repository.getChildInteractionsForParents(n, t) : this.repository.getChildInteractionsForParents(n)) : (await Promise.all(n.map((e) => this.getReactionRecords(e, t?.find((t) => t.eventId === e))))).flat(), n, (e) => e.kind === 7);
	}
}, Vi = class {
	repository;
	constructor(e = ct) {
		this.repository = e;
	}
	async getDirectReplyRecords(e) {
		return this.repository.getDirectReplyInteractions(e);
	}
	async getDirectReplyRecordsForParents(e) {
		let t = Array.from(new Set(e.filter((e) => !!e)));
		return zi(this.repository.getChildInteractionsForParents ? await this.repository.getChildInteractionsForParents(t) : (await Promise.all(t.map((e) => this.getDirectReplyRecords(e)))).flat(), t, (e) => e.kind === 1 || e.kind === 42 || e.kind === 1111);
	}
}, Hi = class {
	repository;
	constructor(e = ct) {
		this.repository = e;
	}
	async getRelatedEventRecords(e) {
		return this.repository.getChildInteractions(e);
	}
	async getDirectReplyRecords(e) {
		return this.repository.getDirectReplyInteractions(e);
	}
}, Ui = new Bi(), Wi = new Vi();
new Hi();
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryDeletionFetchService.ts
var Gi = 4e3, Ki = 8;
function qi(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		if (!n.event?.id || !n.event.pubkey) continue;
		let e = t.get(n.event.pubkey) ?? /* @__PURE__ */ new Set();
		e.add(n.event.id), t.set(n.event.pubkey, e);
	}
	return new Map(Array.from(t.entries()).map(([e, t]) => [e, Array.from(t)]));
}
function Ji(e) {
	return Array.from(e.values()).map((e) => ({
		event: e.event,
		relayUrls: Array.from(e.relayUrls).sort((e, t) => e.localeCompare(t))
	})).sort((e, t) => e.event.created_at === t.event.created_at ? e.event.id.localeCompare(t.event.id) : e.event.created_at - t.event.created_at);
}
var Yi = new class {
	console;
	setTimeoutFn;
	clearTimeoutFn;
	now;
	constructor(e = {}) {
		this.console = e.console ?? (typeof console < "u" ? console : {
			log: () => void 0,
			warn: () => void 0,
			error: () => void 0
		}), this.setTimeoutFn = e.setTimeoutFn ?? ((e, t) => setTimeout(e, t)), this.clearTimeoutFn = e.clearTimeoutFn ?? ((e) => clearTimeout(e)), this.now = e.now ?? Date.now;
	}
	fetchDeletionRequests(e, t) {
		let n = qi(t.targets), r = this.resolveRelayUrls(t), i = /* @__PURE__ */ new Map(), a = t.requireRelayEose ? `related-deletion-${Date.now()}-${Math.random().toString(36).slice(2)}` : void 0, o, s = !1, c, l, u = () => {
			c?.unsubscribe?.(), c = void 0;
		}, d = (e) => ({
			status: e,
			events: Ji(i),
			fetchedAt: this.now(),
			relayUrls: r
		}), f = (e) => (t) => {
			s || (s = !0, u(), e(d(t)));
		};
		return {
			promise: new Promise((u) => {
				let d = f(u);
				if (l = d, n.size === 0) d("success");
				else try {
					let l = Fe(a);
					if (c = Ie(e, l, { on: r.length > 0 ? { relays: r } : { defaultReadRelays: !0 } }, {
						operation: t.operation,
						deadlineAt: t.deadlineAt,
						quorum: !1,
						timeoutMs: t.timeoutMs ?? Gi,
						source: (t, n) => Ce(e, t, n),
						setTimeoutFn: this.setTimeoutFn,
						clearTimeoutFn: this.clearTimeoutFn,
						onEnd: (e) => {
							o = e;
						}
					}).subscribe({
						next: (e) => {
							this.handlePacket(i, e);
						},
						complete: () => d(o?.complete ? "success" : "timeout"),
						error: (e) => {
							this.console.error("post_history_deletion_fetch_error", e), d("error");
						}
					}), s) {
						c?.unsubscribe?.();
						return;
					}
					for (let [e, t] of n.entries()) l.emit({
						kinds: [5],
						authors: [e],
						"#e": t
					});
					if (l.over(), s) return;
				} catch (e) {
					this.console.error("post_history_deletion_fetch_request_error", e), d("error");
				}
			}),
			cancel: () => {
				l?.("cancelled");
			}
		};
	}
	handlePacket(e, t) {
		let n = t.event;
		if (!n?.id || n.kind !== 5) return;
		let r = V.sanitizeExternalRelayUrls(typeof t.from == "string" ? [t.from] : [], { limit: 1 })[0], i = e.get(n.id);
		i ? se(i.event, n) ? r && i.relayUrls.add(r) : this.console.warn("post_history_deletion_fetch_packet_conflict", n.id) : e.set(n.id, {
			event: n,
			relayUrls: new Set(r ? [r] : [])
		});
	}
	resolveRelayUrls(e) {
		let t = e.targets.flatMap((e) => e.relayUrls ?? []), n = De([...t, ...e.relayHints ?? []], Ki);
		if (n) return n;
		let r = e.relayConfig ? [...V.extractReadRelays(e.relayConfig), ...V.extractWriteRelays(e.relayConfig)] : [], i = V.sanitizeExternalRelayUrls([
			...t,
			...e.relayHints ?? [],
			...r
		], { limit: Ki });
		return i.length > 0 ? i : V.sanitizeExternalRelayUrls(ae, { limit: Ki });
	}
}(), Xi = 1e3, Zi = 7776e6;
function Qi(e) {
	return Number.isSafeInteger(e) && e > 0;
}
function $i(e) {
	return { ...e };
}
function ea(e) {
	return Array.from(new Set(e.filter(it)));
}
var ta = new class {
	db;
	now;
	maxRecords;
	ttlMs;
	constructor(e = be, t = Date.now, n = Xi, r = Zi) {
		this.db = e, this.now = t, this.maxRecords = n, this.ttlMs = r;
	}
	async get(e) {
		if (!it(e)) return null;
		let t = await this.db.customEmojiImageMeta.get(e);
		return t ? $i(t) : null;
	}
	async getMany(e) {
		let t = ea(e);
		if (t.length === 0) return {};
		let n = await this.db.customEmojiImageMeta.bulkGet(t), r = {};
		return n.forEach((e) => {
			e && (r[e.url] = $i(e));
		}), r;
	}
	async upsert(e) {
		if (!it(e.url) || !Qi(e.width) || !Qi(e.height)) return null;
		let t = this.now(), n = await this.db.customEmojiImageMeta.get(e.url), r = {
			url: e.url,
			width: e.width,
			height: e.height,
			aspectRatio: e.width / e.height,
			fetchedAt: e.fetchedAt ?? n?.fetchedAt ?? t,
			lastAccessedAt: e.lastAccessedAt ?? t,
			updatedAt: t,
			schemaVersion: 1
		};
		return await this.db.transaction("rw", this.db.customEmojiImageMeta, async () => {
			await this.db.customEmojiImageMeta.put(r), await this.pruneInTransaction(t);
		}), $i(r);
	}
	async touchMany(e, t = this.now()) {
		let n = ea(e);
		n.length !== 0 && await this.db.transaction("rw", this.db.customEmojiImageMeta, async () => {
			let e = await this.db.customEmojiImageMeta.bulkGet(n);
			await Promise.all(e.map(async (e) => {
				e && await this.db.customEmojiImageMeta.put({
					...e,
					lastAccessedAt: t,
					updatedAt: t
				});
			})), await this.pruneInTransaction(t);
		});
	}
	async prune(e = this.now()) {
		await this.db.transaction("rw", this.db.customEmojiImageMeta, async () => {
			await this.pruneInTransaction(e);
		});
	}
	async pruneInTransaction(e) {
		let t = e - this.ttlMs;
		if (this.ttlMs > 0) {
			let e = await this.db.customEmojiImageMeta.where("lastAccessedAt").below(t).primaryKeys();
			e.length > 0 && await this.db.customEmojiImageMeta.bulkDelete(e);
		}
		if (this.maxRecords <= 0) {
			await this.db.customEmojiImageMeta.clear();
			return;
		}
		let n = await this.db.customEmojiImageMeta.orderBy("lastAccessedAt").toArray(), r = n.length - this.maxRecords;
		r <= 0 || await this.db.customEmojiImageMeta.bulkDelete(n.slice(0, r).map((e) => e.url));
	}
}();
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryEmojiState.svelte.ts
function na({ getShow: e, getSessionOpen: t = e, getEmojiUrls: n, onStateChanged: r = () => void 0 }) {
	let i = B(k({})), a = B(k({})), o = 0, s = new AbortController(), c = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Set(), u = /* @__PURE__ */ new Map(), d = {}, f = null, p = _(() => n().join("\n")), m = _(() => L(p) ? L(p).split("\n") : []);
	function h(e) {
		let t = {};
		for (let n of e) {
			if (c.has(n)) {
				t[n] = "loading";
				continue;
			}
			let e = L(i)[n];
			(e === "ready" || e === "failed") && (t[n] = e);
		}
		let n = e.filter((e) => !t[e]);
		for (let e of n) c.add(e), t[e] = "loading";
		return O(L(i), t) || x(i, t, !0), n;
	}
	function g(e) {
		return {
			url: e.url,
			width: e.width,
			height: e.height,
			aspectRatio: e.aspectRatio
		};
	}
	function v(e) {
		return Number.isSafeInteger(e.width) && Number.isSafeInteger(e.height) && (e.width ?? 0) > 0 && (e.height ?? 0) > 0 && Number.isFinite(e.aspectRatio) && (e.aspectRatio ?? 0) > 0;
	}
	function y(e) {
		let t = !1, n = { ...L(a) };
		for (let [r, i] of Object.entries(e)) {
			let e = n[r];
			(e?.width !== i.width || e?.height !== i.height || e?.aspectRatio !== i.aspectRatio) && (n[r] = i, t = !0);
		}
		t && x(a, n, !0);
	}
	async function b(t) {
		if (t.length === 0) return;
		let n = o, r = () => {
			if (n === o) for (let e of t) l.delete(e);
		};
		try {
			let i = await ta.getMany(t);
			if (n !== o) return;
			if (!e()) {
				r();
				return;
			}
			let a = Object.keys(i);
			if (a.length === 0) return;
			y(Object.fromEntries(a.map((e) => [e, g(i[e])]))), ta.touchMany(a);
		} catch {
			r();
		}
	}
	async function S(e) {
		try {
			await ta.upsert(e);
		} catch {}
	}
	async function w(t) {
		let n = o, r = await at(t, { signal: s.signal });
		e() && n === o && (L(m).includes(t) ? (r.ready && v(r) && (d[t] = g({
			url: t,
			width: r.width,
			height: r.height,
			aspectRatio: r.aspectRatio
		}), S({
			url: t,
			width: r.width,
			height: r.height
		})), u.set(t, r.ready ? "ready" : "failed"), E()) : c.delete(t));
	}
	function T() {
		f = null;
		let e = d;
		d = {}, Object.keys(e).length > 0 && y(e);
		let t = null;
		for (let [e, n] of u) c.delete(e), L(i)[e] !== n && (t ??= { ...L(i) }, t[e] = n);
		u.clear(), t && x(i, t, !0);
	}
	function E() {
		f === null && (f = setTimeout(T, 0));
	}
	function D() {
		f !== null && clearTimeout(f), f = null, u.clear(), d = {};
	}
	function O(e, t) {
		let n = Object.keys(e), r = Object.keys(t);
		return n.length === r.length && n.every((n) => e[n] === t[n]);
	}
	function A() {
		o++, s.abort(), s = new AbortController(), D(), c.clear(), l.clear(), x(i, Object.fromEntries(Object.entries(L(i)).filter(([, e]) => e !== "loading")), !0);
	}
	function j() {
		o++, s.abort(), s = new AbortController(), D(), x(i, {}, !0), c.clear(), l.clear();
	}
	return M(() => {
		if (!e()) return;
		let t = L(m).filter((e) => !l.has(e));
		for (let e of t) l.add(e);
		b(t);
	}), M(() => {
		if (!e()) return;
		let t = h(L(m));
		for (let e of t) w(e);
	}), M(() => {
		e() && (L(i), L(a), r());
	}), M(() => {
		t() || C(j);
	}), ne(() => {
		o++, s.abort(), D();
	}), {
		suspend: A,
		get emojiLoadStateByUrl() {
			return L(i);
		},
		get emojiImageMetaByUrl() {
			return L(a);
		},
		resetState: j
	};
}
export { Et as A, Qn as C, Ht as D, Wn as E, At as O, Zn as S, Kn as T, br as _, Ii as a, lr as b, Li as c, ji as d, xi as f, jr as g, or as h, Ui as i, Ct as j, kt as k, Fi as l, cr as m, Yi as n, Mi as o, bi as p, Wi as r, Ni as s, na as t, Pi as u, vr as v, Yn as w, sr as x, yr as y };
