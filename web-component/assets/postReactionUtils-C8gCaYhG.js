import { $ as e, B as t, D as n, Dt as r, E as i, Et as a, F as o, G as s, K as c, L as l, Nt as u, Q as d, St as f, T as p, Z as m, _ as h, _t as g, b as _, ct as v, dt as y, f as b, ft as x, ht as S, i as C, j as w, k as T, lt as E, mt as D, o as O, q as k, r as A, rt as j, s as ee, tt as M, v as N, yt as P } from "./index-client-DEFG3Gqk.js";
import { p as F } from "./esm-N9TTQGcl.js";
import { n as I } from "./relayConfigUtils-56ujWwKF.js";
import { a as L, o as R, t as z, u as B } from "./postHistoryEventUtils-iuP8QpIA.js";
import { Z as V } from "./LoadingPlaceholder-YrD8D_td.js";
import { i as H, n as te } from "./ehagakiDb-DuXS0XPm.js";
import { Q as ne, S as re, rt as U, s as W, tt as G } from "./postHistoryRepository-Bu2z041i.js";
import { i as K } from "./reactionValue-pGAZaGcf.js";
import { t as q } from "./appAssetUrl-B5sJnZLv.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/reactionReference.ts
function J(e) {
	let t = {
		status: "invalid-reference",
		reference: null
	};
	if (e.kind !== 7) return t;
	let n = e.tags.filter((e) => e[0] === "e").at(-1);
	if (!n) return e.tags.some((e) => e[0] === "a") ? {
		status: "unsupported-reference",
		reference: null
	} : t;
	if (!F(n[1])) return t;
	let r = n[3], i = r?.trim().toLowerCase(), a = F(r) ? r : (i === "root" || i === "reply" || i === "mention") && n[4] || null;
	if (r && !F(r) && ![
		"root",
		"reply",
		"mention"
	].includes(i ?? "") || a && !F(a)) return t;
	let o = e.tags.filter((e) => e[0] === "p").at(-1);
	if (o && !F(o[1])) return t;
	let s = o?.[1] ?? null;
	if (a && s && a !== s) return t;
	let c = /* @__PURE__ */ new Set();
	for (let n of e.tags.filter((e) => e[0] === "k")) {
		let e = Number(n[1]);
		if (n[1] === void 0 || !Number.isInteger(e) || e < 0 || e > 65535 || n[1] !== String(e)) return t;
		c.add(e);
	}
	return c.size > 1 ? t : {
		status: "valid",
		reference: {
			eventId: n[1],
			authorHint: s ?? a,
			targetKindHint: [...c][0] ?? null,
			relayHints: I.sanitizeExternalRelayUrls([n[2] ?? "", o?.[2] ?? ""])
		}
	};
}
function Y(e, t) {
	return e.eventId === t.eventId && (!e.authorHint || t.targetAuthorPubkey == null || e.authorHint === t.targetAuthorPubkey) && (e.targetKindHint == null || t.targetKind == null || e.targetKindHint === t.targetKind);
}
function X(e) {
	return I.sanitizeExternalRelayUrls(e ?? [], { limit: I.EXTERNAL_INPUT_RELAY_LIMIT });
}
function ie(e) {
	return e.sort((e, t) => e.createdAt === t.createdAt ? e.eventId.localeCompare(t.eventId) : e.createdAt - t.createdAt);
}
function ae(e, t) {
	return e.length === t.length && e.every((e, n) => W(e, t[n]));
}
function oe(e) {
	return e === 1 || e === 7 || e === 42 || e === 1111;
}
function se(e) {
	return e.kind === 1 || e.kind === 42 || e.kind === 1111 ? B(e).parentId : e.kind === 7 ? J(e).reference?.eventId ?? null : null;
}
function ce(e) {
	if (e.kind === 1 || e.kind === 42 || e.kind === 1111) return B(e).rootId ?? void 0;
}
function le(e) {
	return e.kind === 7 ? ["reaction"] : ["direct-reply"];
}
function ue(e) {
	return e.filter((e) => e.kind === 1 || e.kind === 42 || e.kind === 1111);
}
function de(e) {
	return e.filter((e) => e.kind === 7);
}
function fe(e, t) {
	return e.parentEventId !== t.parentEventId || e.rootEventId !== t.rootEventId || e.authorPubkey !== t.authorPubkey || e.kind !== t.kind || e.content !== t.content || e.createdAt !== t.createdAt || !W(e.relayUrls, t.relayUrls) || !W(e.discoveredAs, t.discoveredAs) || !ae(e.tags, t.tags) || !R(e.rawEvent, t.rawEvent);
}
var pe = new class {
	db;
	now;
	console;
	reactionRepairPromise;
	constructor(e = te, t = Date.now, n = globalThis.console === void 0 ? {
		log: () => void 0,
		warn: () => void 0,
		error: () => void 0
	} : globalThis.console) {
		this.db = e, this.now = t, this.console = n;
	}
	ensureSavedReactionsRepaired() {
		return this.reactionRepairPromise ||= this.repairSavedReactions().catch((e) => {
			throw this.reactionRepairPromise = void 0, e;
		}), this.reactionRepairPromise;
	}
	async repairSavedReactions() {
		await this.db.transaction("rw", this.db.events, this.db.postHistoryChildInteractions, this.db.postHistory, async () => {
			let e = await this.db.postHistoryChildInteractions.where("kind").equals(7).toArray().then((e) => G(this.db, "postHistoryChildInteractions").hydrate(e)), t = [], n = [];
			for (let r of e) {
				if (r.id !== r.eventId || !L(r.rawEvent, {
					...r,
					pubkeyHex: r.authorPubkey
				})) {
					n.push(r.id);
					continue;
				}
				let e = U(r.rawEvent), i = e ? J(e.event).reference : null;
				!i || i.eventId === r.eventId ? n.push(r.id) : t.push({
					record: r,
					reference: i
				});
			}
			let r = Array.from(new Set(t.map(({ reference: e }) => e.eventId))), i = await G(this.db, "postHistory").bulkGet(r), a = new Map(i.flatMap((e) => e ? [[e.eventId, e]] : [])), o = [];
			for (let { record: e, reference: r } of t) {
				let t = a.get(r.eventId);
				t && !Y(r, {
					eventId: t.eventId,
					targetAuthorPubkey: t.pubkeyHex,
					targetKind: t.kind
				}) ? n.push(e.id) : e.parentEventId !== r.eventId && o.push({
					...e,
					parentEventId: r.eventId,
					updatedAt: this.now()
				});
			}
			n.length && await this.db.postHistoryChildInteractions.bulkDelete(n), o.length && await G(this.db, "postHistoryChildInteractions").bulkPut(o);
		});
	}
	async filterKnownReactionTargets(e, t) {
		let n = new Map(t.map((e) => [e.eventId, e])), r = [], i = e.filter((e) => {
			let t = n.get(e.parentEventId);
			if (e.kind !== 7 || !t) return !0;
			let i = J(e).reference;
			return i && Y(i, t) ? !0 : (r.push(e.id), !1);
		});
		return r.length && await this.db.postHistoryChildInteractions.bulkDelete(r), i;
	}
	async getChildInteractions(e, t) {
		if (!e) return [];
		await this.ensureSavedReactionsRepaired();
		let n = await this.db.postHistoryChildInteractions.where("[parentEventId+createdAt]").between([e, H.minKey], [e, H.maxKey]).toArray().then((e) => G(this.db, "postHistoryChildInteractions").hydrate(e));
		return ie(t ? await this.filterKnownReactionTargets(n, [t]) : n);
	}
	async getChildInteractionsForParents(e, t) {
		let n = Array.from(new Set(e.filter((e) => !!e)));
		if (n.length === 0) return [];
		await this.ensureSavedReactionsRepaired();
		let r = await this.db.postHistoryChildInteractions.where("parentEventId").anyOf(n).toArray().then((e) => G(this.db, "postHistoryChildInteractions").hydrate(e));
		return t ? this.filterKnownReactionTargets(r, t) : r;
	}
	async getDirectReplyInteractions(e) {
		return ue(await this.getChildInteractions(e));
	}
	async getReactionInteractions(e) {
		return de(await this.getChildInteractions(e));
	}
	async upsertChildInteractions(e) {
		if (!e.parentEventId || e.events.length === 0) return {
			insertedCount: 0,
			updatedCount: 0,
			unchangedCount: 0,
			ignoredCount: e.events.length
		};
		await this.ensureSavedReactionsRepaired();
		let t = e.fetchedAt === void 0 ? this.now() : e.fetchedAt, n = 0, r = /* @__PURE__ */ new Map();
		for (let t of e.events) {
			if (!t?.event?.id || !oe(t.event.kind) || se(t.event) !== e.parentEventId || t.event.id === e.parentEventId) {
				n += 1;
				continue;
			}
			let i = r.get(t.event.id);
			i && !R(i.event, t.event) ? (this.console.warn("post_history_child_interaction_conflict", t.event.id), n += 1) : r.set(t.event.id, {
				event: t.event,
				relayUrls: X([...i?.relayUrls ?? [], ...t.relayUrls ?? []])
			});
		}
		let i = Array.from(r.values());
		if (i.length === 0) return {
			insertedCount: 0,
			updatedCount: 0,
			unchangedCount: 0,
			ignoredCount: n
		};
		let a = 0, o = 0, s = 0;
		return await this.db.transaction("rw", this.db.events, this.db.postHistoryChildInteractions, this.db.postHistory, this.db.postHistoryChildWriteGeneration, async () => {
			if (typeof e.expectedChildGeneration == "number" && await ne(this.db) !== e.expectedChildGeneration) return;
			let r = i.some((e) => e.event.kind === 7) ? await G(this.db, "postHistory").get(e.parentEventId) : void 0, c = [...e.reactionTarget ? [e.reactionTarget] : [], ...r ? [{
				eventId: r.eventId,
				targetAuthorPubkey: r.pubkeyHex,
				targetKind: r.kind
			}] : []], l = i.filter((e) => {
				if (e.event.kind !== 7) return !0;
				let t = J(e.event).reference;
				return !t || c.some((e) => !Y(t, e)) ? (n += 1, !1) : !0;
			});
			if (l.length === 0) return;
			let u = l.map((e) => e.event.id), d = await G(this.db, "postHistoryChildInteractions").bulkGet(u), f = /* @__PURE__ */ new Map();
			d.forEach((e) => {
				e && f.set(e.eventId, e);
			});
			let p = l.map((n) => {
				let r = f.get(n.event.id), i = X([...r?.relayUrls ?? [], ...n.relayUrls ?? []]), c = ce(n.event), l = Array.from(/* @__PURE__ */ new Set([...r?.discoveredAs ?? [], ...le(n.event)])), u = {
					id: n.event.id,
					eventId: n.event.id,
					parentEventId: e.parentEventId,
					...c ? { rootEventId: c } : {},
					authorPubkey: n.event.pubkey,
					kind: n.event.kind,
					content: n.event.content,
					tags: n.event.tags.map((e) => [...e]),
					createdAt: n.event.created_at,
					relayUrls: i,
					discoveredAs: l,
					rawEvent: z(n.event),
					fetchedAt: t ?? r?.fetchedAt ?? 0,
					updatedAt: this.now(),
					schemaVersion: 1
				};
				return r ? fe(r, u) ? o += 1 : s += 1 : a += 1, u;
			});
			await G(this.db, "postHistoryChildInteractions").bulkPut(p);
		}), {
			insertedCount: a,
			updatedCount: o,
			unchangedCount: s,
			ignoredCount: n
		};
	}
	async deleteChildInteractionsForParent(e) {
		e && await this.db.postHistoryChildInteractions.where("parentEventId").equals(e).delete();
	}
	async deleteChildInteractionsForParents(e) {
		let t = Array.from(new Set(e.filter((e) => !!e)));
		t.length !== 0 && await this.db.transaction("rw", this.db.events, this.db.postHistoryChildInteractions, async () => {
			for (let e of t) await this.db.postHistoryChildInteractions.where("parentEventId").equals(e).delete();
		});
	}
	async deleteChildInteractionsForPostHistoryPubkey(e) {
		if (!e) return;
		let t = await this.db.postHistory.where("pubkeyHex").equals(e).primaryKeys();
		await this.deleteChildInteractionsForParents(t.map(String));
	}
	async deleteChildInteractionByEventId(e) {
		e && await this.db.postHistoryChildInteractions.delete(e);
	}
}();
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/mediaGalleryWheelUtils.ts
function me(e) {
	return Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
}
function he(e, t) {
	let n = e.scrollHeight - e.clientHeight;
	if (n <= 1) return !1;
	let r = e.scrollTop <= 0, i = e.scrollTop >= n - 1;
	return t > 0 ? !i : t < 0 && !r;
}
function Z(e, t) {
	let n = e.scrollWidth - e.clientWidth;
	if (n <= 1) return !1;
	let r = e.scrollLeft <= 0, i = e.scrollLeft >= n - 1;
	return t > 0 ? !i : t < 0 && !r;
}
function ge(e, t, n = null) {
	if (n && he(n, t.deltaY)) return !1;
	let r = me(t);
	if (!Z(e, r)) return !1;
	let i = Math.max(0, e.scrollWidth - e.clientWidth);
	return e.scrollLeft = Math.min(i, Math.max(0, e.scrollLeft + r)), !0;
}
// D:/ドキュメント/GitHub/ehagaki/src/components/MediaGallery.svelte
var _e = k("<div class=\"media-gallery-cell svelte-w2vv8k\" role=\"listitem\"><!></div>"), ve = k("<div><div role=\"list\" data-media-gallery=\"\"></div> <button type=\"button\" class=\"gallery-page-button gallery-page-left svelte-w2vv8k\"><span class=\"gallery-page-icon svelte-w2vv8k\" aria-hidden=\"true\"></span></button> <button type=\"button\" class=\"gallery-page-button gallery-page-right svelte-w2vv8k\"><span class=\"gallery-page-icon svelte-w2vv8k\" aria-hidden=\"true\"></span></button></div>"), ye = {
	hash: "svelte-w2vv8k",
	code: ".media-gallery.svelte-w2vv8k {display:flex;align-items:stretch;flex-shrink:0;width:100%;min-width:0;min-height:180px;height:var(--media-gallery-height, auto);overflow-x:auto;overflow-y:hidden;scrollbar-width:thin;gap:4px;background-color:var(--window);}.responsive-gallery .media-gallery.svelte-w2vv8k,\n    .media-gallery-preview.svelte-w2vv8k {\n        /* Scale between the 360px and 560px viewport widths. */--media-gallery-height: clamp(180px, calc(70vw - 72px), 320px);--media-gallery-max-width: clamp(160px, calc(60vw - 56px), 280px);--media-gallery-item-height: 100%;}.media-gallery-preview.svelte-w2vv8k {background-color:transparent;overscroll-behavior-x:contain;}.media-gallery-preview.svelte-w2vv8k:focus-visible {outline:2px solid var(--theme);outline-offset:-2px;}.gallery-shell.svelte-w2vv8k {position:relative;flex-shrink:0;width:100%;min-width:0;}.gallery-page-button.svelte-w2vv8k {display:none;}\n\n    @media (hover: hover) and (pointer: fine) {.gallery-page-button.svelte-w2vv8k {position:absolute;top:50%;translate:0 -50%;z-index:3;display:grid;place-items:center;width:44px;height:44px;padding:0;border:0;border-radius:50%;background:rgb(28 32 36 / 88%);color:white;cursor:pointer;opacity:0;pointer-events:none;}.gallery-shell.svelte-w2vv8k:hover .gallery-page-button[aria-disabled=\"false\"]:where(.svelte-w2vv8k),\n        .gallery-page-button.svelte-w2vv8k:focus-visible {opacity:1;pointer-events:auto;}.gallery-page-button.svelte-w2vv8k:hover {background-color:rgb(28 32 36 / 98%);color:white;}.gallery-page-button.svelte-w2vv8k:focus-visible {outline:2px solid var(--theme);outline-offset:2px;}.gallery-page-button[aria-disabled=\"true\"].svelte-w2vv8k {cursor:default;}.gallery-dragging.svelte-w2vv8k .gallery-page-button:where(.svelte-w2vv8k) {visibility:hidden;}.gallery-page-left.svelte-w2vv8k {left:8px;}.gallery-page-right.svelte-w2vv8k {right:8px;}.gallery-page-icon.svelte-w2vv8k {width:20px;height:20px;background:currentColor;mask-position:center;mask-repeat:no-repeat;mask-size:contain;}.gallery-page-right.svelte-w2vv8k .gallery-page-icon:where(.svelte-w2vv8k) {rotate:180deg;}\n    }.media-gallery-cell.svelte-w2vv8k {display:flex;flex:none;max-width:100%;}\n\n    @media (hover: none) and (pointer: coarse) {.media-gallery.svelte-w2vv8k {scrollbar-width:none;}.media-gallery.svelte-w2vv8k::-webkit-scrollbar {display:none;}\n    }"
};
function be(f, m) {
	r(m, !0), w(f, ye);
	let h = () => ee(V, "$_", S), [S, C] = O(), T = A(m, "element", 15), k = A(m, "preview", 3, !1), M = A(m, "dragging", 3, !1), N = P(!1), F = P(!1), I = q("icons/arrow_back_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
	function L() {
		g(N, !!T() && Z(T(), -1), !0), g(F, !!T() && Z(T(), 1), !0);
	}
	function R(e) {
		if (!T() || !Z(T(), e)) return;
		let t = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		T().scrollBy({
			left: e * T().clientWidth,
			behavior: t ? "auto" : "smooth"
		});
	}
	E(() => {
		if (!T()) return;
		let e = T(), t = m.items.length;
		if (L(), typeof ResizeObserver > "u") return;
		let n = new ResizeObserver(L);
		n.observe(e);
		for (let r = 0; r < t; r++) {
			let t = e.children[r];
			t && n.observe(t);
		}
		return () => n.disconnect();
	});
	var z = c(), B = x(z), H = (t) => {
		var r = ve(), a = y(r);
		l(a, 23, () => m.items, (e) => e.id, (e, t, n) => {
			var r = _e(), i = y(r);
			o(i, () => m.renderItem, () => j(t), () => j(n)), u(r), s(e, r);
		}), u(a), b(a, (e) => T(e), () => T());
		var c = D(a, 2), f = y(c);
		let g;
		u(c);
		var x = D(c, 2), S = y(x);
		let C;
		u(x), u(r), v((e, t, o) => {
			i(r, 1, n(["gallery-shell", { "gallery-dragging": M() }]), "svelte-w2vv8k"), i(a, 1, n([
				"media-gallery",
				m.class,
				{ "media-gallery-preview": k() }
			]), "svelte-w2vv8k"), _(a, "tabindex", k() ? 0 : void 0), _(a, "aria-label", e), _(c, "aria-label", t), _(c, "aria-disabled", !j(N)), _(c, "tabindex", j(N) ? 0 : -1), g = p(f, "", g, { "mask-image": `url("${I}")` }), _(x, "aria-label", o), _(x, "aria-disabled", !j(F)), _(x, "tabindex", j(F) ? 0 : -1), C = p(S, "", C, { "mask-image": `url("${I}")` });
		}, [
			() => h()("mediaGallery.aria_label"),
			() => h()("mediaGallery.previous_page"),
			() => h()("mediaGallery.next_page")
		]), e("dragover", a, function(...e) {
			m.ondragover?.apply(this, e);
		}), e("drop", a, function(...e) {
			m.ondrop?.apply(this, e);
		}), e("scroll", a, L), d("click", c, () => R(-1)), d("click", x, () => R(1)), s(t, r);
	};
	t(B, (e) => {
		m.items.length > 0 && e(H);
	}), s(f, z), a(), C();
}
m(["click"]);
// D:/ドキュメント/GitHub/ehagaki/src/components/MediaGalleryImage.svelte
var xe = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"src",
	"alt",
	"fillWidth",
	"class",
	"onload"
]), Q = k("<img/>"), Se = {
	hash: "svelte-9oxo67",
	code: "img.svelte-9oxo67 {display:block;height:100%;object-fit:contain;transform:scale(var(--media-gallery-image-zoom, 1));}.fill-width.svelte-9oxo67 {width:100%;}"
};
function Ce(e, t) {
	r(t, !0), w(e, Se);
	let n = A(t, "fillWidth", 3, !1), i = C(t, xe), o = P(S({
		width: 0,
		height: 0
	})), c = P(void 0), l = f(() => {
		if (j(c)?.src !== t.src || !j(c).width || !j(c).height || !j(o).width || !j(o).height) return 1;
		let e = j(o).width / j(c).width, n = j(o).height / j(c).height, r = Math.min(e, n), i = j(c).width < j(c).height ? e : n;
		return Math.min(1.5, i / r);
	}), u = (e) => {
		let n = e.currentTarget;
		g(c, {
			src: t.src,
			width: n.naturalWidth,
			height: n.naturalHeight
		}, !0), typeof ResizeObserver > "u" && g(o, {
			width: n.clientWidth,
			height: n.clientHeight
		}, !0), t.onload?.(e);
	};
	function d(e) {
		if (typeof ResizeObserver > "u") return;
		let t = new ResizeObserver(([e]) => {
			let { width: t, height: n } = e.contentRect;
			g(o, {
				width: t,
				height: n
			}, !0);
		});
		return t.observe(e), () => t.disconnect();
	}
	var p = Q();
	N(p, () => ({
		...i,
		src: t.src,
		alt: t.alt,
		class: [t.class, { "fill-width": n() }],
		onload: u,
		draggable: "false",
		[h]: { "--media-gallery-image-zoom": j(l) }
	}), void 0, void 0, void 0, "svelte-9oxo67"), T(p, () => d), M(p), s(e, p), a();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postReactionUtils.ts
var we = [
	1,
	6,
	7,
	16,
	42,
	1111
];
function $(e) {
	return we.includes(e);
}
function Te(e, t, n, r, i, a) {
	let o = re(e);
	if (!o || !$(o.event.kind)) throw Error("invalid_reaction_target");
	let s = o.event, c = I.sanitizeExternalRelayUrls([...r])[0], l = K(n), u = [
		[
			"e",
			s.id,
			c ?? "",
			s.pubkey
		],
		c ? [
			"p",
			s.pubkey,
			c
		] : ["p", s.pubkey],
		["k", String(s.kind)]
	];
	l.emojiTag && u.push(l.emojiTag), a && u.push([...a]);
	let d = {
		kind: 7,
		pubkey: t,
		content: l.content,
		tags: u,
		created_at: i
	}, f = J(d).reference;
	if (!f || !Y(f, {
		eventId: s.id,
		targetAuthorPubkey: s.pubkey,
		targetKind: s.kind
	})) throw Error("invalid_reaction_target");
	return d;
}
export { ge as a, J as c, be as i, $ as n, pe as o, Ce as r, Y as s, Te as t };
