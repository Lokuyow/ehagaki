import { n as e } from "./relayConfigUtils-DD5f1UAM.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/nostrHexUtils.ts
var t = /^[0-9a-f]{64}$/i;
function n(e) {
	return typeof e == "string" && t.test(e);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryNip22Utils.ts
function r(e, t) {
	let n = e.filter((e) => e[0] === t).map((e) => e[1]);
	if (n.length !== 0) return n.some((e) => typeof e != "string" || !e) || new Set(n).size !== 1 ? null : n[0];
}
function i(e, t, r = {}) {
	let i = [], a = !1;
	for (let r of t) {
		let t = e.filter((e) => e[0] === r);
		t.length > 1 && (a = !0);
		for (let e of t) {
			let t = e[1];
			!(r.toLowerCase() === "e" ? n(t) : typeof t == "string" && t.trim().length > 0) || (r === "E" || r === "e") && typeof e[3] == "string" && !n(e[3]) ? a = !0 : i.push([...e]);
		}
	}
	let o = r.allowAddressableVersionPair === !0 && i.length === 2 && i.filter((e) => e[0] === "a").length === 1 && i.filter((e) => e[0] === "e").length === 1;
	return i.length !== 1 && !o && (a = !0), {
		tags: i,
		invalid: a
	};
}
function a(e) {
	return typeof e == "string" && e.trim().length > 0;
}
function o(e, t, r) {
	let i = t.filter((e) => e[0] === r).map((e) => e[3]).find((e) => n(e)) ?? null, a = e.some((e) => !n(e)) || !!i && !e.includes(i);
	return {
		pubkey: i ?? e.find((e) => n(e)) ?? null,
		invalid: a
	};
}
function s(t) {
	let n = {
		valid: !1,
		reason: "unsupported-kind",
		rootTags: [],
		rootKind: null,
		rootPubkey: null,
		rootEventId: null,
		parentTags: [],
		parentKind: null,
		parentPubkey: null,
		parentEventId: null,
		relayHints: []
	};
	if (t.kind !== 1111) return n;
	let s = t.tags, c = i(s, [
		"E",
		"A",
		"I"
	]), l = i(s, [
		"e",
		"a",
		"i"
	], { allowAddressableVersionPair: !0 }), u = r(s, "K"), d = r(s, "k"), f = s.filter((e) => e[0] === "P").map((e) => e[1] ?? ""), p = s.filter((e) => e[0] === "p").map((e) => e[1] ?? ""), m = o(f, c.tags, "E"), h = o(p, l.tags, "e"), g = m.pubkey, _ = h.pubkey, v = c.tags.find((e) => e[0] === "E")?.[1] ?? null, y = l.tags.find((e) => e[0] === "e")?.[1] ?? null, b = e.sanitizeExternalRelayUrls([...c.tags.filter((e) => e[0] === "E" || e[0] === "A").map((e) => e[2]), ...l.tags.filter((e) => e[0] === "e" || e[0] === "a").map((e) => e[2])]), x = null;
	return c.invalid || c.tags.length !== 1 ? x = "invalid-root-reference" : l.invalid || l.tags.length === 0 ? x = "invalid-parent-reference" : !a(u) || !a(d) ? x = "missing-kind-tag" : f.length === 0 && c.tags[0]?.[0] !== "I" || p.length === 0 && l.tags[0]?.[0] !== "i" ? x = "missing-author-tag" : (m.invalid || h.invalid) && (x = "invalid-author-tag"), {
		valid: x === null,
		reason: x,
		rootTags: c.tags,
		rootKind: typeof u == "string" ? u : null,
		rootPubkey: g,
		rootEventId: v,
		parentTags: l.tags,
		parentKind: typeof d == "string" ? d : null,
		parentPubkey: _,
		parentEventId: y,
		relayHints: b
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryNip10Utils.ts
var c = {
	rootId: null,
	replyId: null,
	parentId: null,
	rootRelayHint: null,
	replyRelayHint: null,
	rootAuthorHint: null,
	replyAuthorHint: null,
	mentionEventIds: [],
	ignoredEventIds: [],
	relayHints: [],
	authorHints: [],
	isLegacy: !1,
	channelEventId: null,
	channelRelayHints: [],
	issues: []
};
function l(e) {
	if (typeof e != "string") return null;
	let t = e.trim().toLowerCase();
	return t.length > 0 ? t : null;
}
function u(t) {
	let r = t[1];
	if (!n(r)) return null;
	let i = e.sanitizeExternalRelayUrls(typeof t[2] == "string" && t[2].length > 0 ? [t[2]] : [], { limit: 1 })[0] ?? null, a = n(t[4]) ? t[4] : null;
	return {
		eventId: r,
		relayHint: i,
		marker: l(t[3]),
		authorHint: a
	};
}
function d(e) {
	let t = /* @__PURE__ */ new Set(), n = [];
	for (let r of e) r && !t.has(r) && (t.add(r), n.push(r));
	return n;
}
function f(e, t) {
	let n = e.filter((e) => Array.isArray(e) && e[0] === "e" && l(e[3]) === t), r = n.map(u).filter((e) => e !== null), i = d(r.map((e) => e.eventId)), a = i.length === 1 ? r.filter((e) => e.eventId === i[0]) : [];
	return {
		reference: a[0] ?? null,
		relayHints: d(a.map((e) => e.relayHint)),
		authorHints: d(a.map((e) => e.authorHint)),
		hasInvalidId: n.length !== r.length,
		hasConflict: i.length > 1
	};
}
function p(e) {
	if (!e || e.kind !== 1) return { ...c };
	let t = e.tags.filter((e) => Array.isArray(e) && e[0] === "e").map(u).filter((e) => e !== null);
	if (t.length === 0) return { ...c };
	let n = t.find((e) => e.marker === "root") ?? null, r = [...t].reverse().find((e) => e.marker === "reply") ?? null, i = t.filter((e) => e.marker === "mention"), a = t.filter((e) => e.marker !== null && e.marker !== "root" && e.marker !== "reply" && e.marker !== "mention"), o = [n, r].filter((e) => e !== null), s = d(t.map((e) => e.relayHint)), l = d(t.map((e) => e.authorHint));
	if (o.length > 0) return {
		rootId: n?.eventId ?? null,
		replyId: r?.eventId ?? null,
		parentId: r?.eventId ?? n?.eventId ?? null,
		rootRelayHint: n?.relayHint ?? null,
		replyRelayHint: r?.relayHint ?? null,
		rootAuthorHint: n?.authorHint ?? null,
		replyAuthorHint: r?.authorHint ?? null,
		mentionEventIds: d(i.map((e) => e.eventId)),
		ignoredEventIds: d(a.map((e) => e.eventId)),
		relayHints: s,
		authorHints: l,
		isLegacy: !1,
		channelEventId: null,
		channelRelayHints: [],
		issues: []
	};
	let f = t.filter((e) => e.marker === null);
	if (f.length === 0) return {
		...c,
		mentionEventIds: d(i.map((e) => e.eventId)),
		ignoredEventIds: d(a.map((e) => e.eventId)),
		relayHints: s,
		authorHints: l
	};
	let p = f[0], m = f[f.length - 1];
	return {
		rootId: p.eventId,
		replyId: f.length > 1 ? m.eventId : null,
		parentId: m.eventId,
		rootRelayHint: p.relayHint,
		replyRelayHint: f.length > 1 ? m.relayHint : null,
		rootAuthorHint: p.authorHint,
		replyAuthorHint: f.length > 1 ? m.authorHint : null,
		mentionEventIds: d(i.map((e) => e.eventId)),
		ignoredEventIds: d(a.map((e) => e.eventId)),
		relayHints: s,
		authorHints: l,
		isLegacy: !0,
		channelEventId: null,
		channelRelayHints: [],
		issues: []
	};
}
function m(e) {
	if (!e || e.kind !== 42) return { ...c };
	let t = f(e.tags, "root"), n = f(e.tags, "reply"), r = e.tags.filter((e) => Array.isArray(e) && e[0] === "e").map(u).filter((e) => e !== null), i = r.filter((e) => e.marker === "mention"), a = r.filter((e) => e.marker !== null && e.marker !== "root" && e.marker !== "reply" && e.marker !== "mention"), o = [];
	e.tags.some((e) => Array.isArray(e) && e[0] === "e" && l(e[3]) === "root") ? (!t.reference && !t.hasConflict || t.hasInvalidId) && o.push("invalid-channel-root") : o.push("missing-channel-root"), t.hasConflict && o.push("conflicting-channel-roots"), n.hasInvalidId && o.push("invalid-reply-target"), n.hasConflict && o.push("conflicting-reply-targets"), t.reference && n.reference && t.reference.eventId === n.reference.eventId && o.push("reply-target-is-channel");
	let s = !!t.reference && !t.hasConflict, p = !!n.reference && !n.hasConflict && !o.includes("reply-target-is-channel"), m = s ? t.relayHints : [], h = p ? n.relayHints : [];
	return {
		rootId: null,
		replyId: p ? n.reference?.eventId ?? null : null,
		parentId: p ? n.reference?.eventId ?? null : null,
		rootRelayHint: m[0] ?? null,
		replyRelayHint: h[0] ?? null,
		rootAuthorHint: s ? t.authorHints[0] ?? null : null,
		replyAuthorHint: p ? n.authorHints[0] ?? null : null,
		mentionEventIds: d(i.map((e) => e.eventId)),
		ignoredEventIds: d(a.map((e) => e.eventId)),
		relayHints: d([...m, ...h]),
		authorHints: d([...s ? t.authorHints : [], ...p ? n.authorHints : []]),
		isLegacy: !1,
		channelEventId: s ? t.reference?.eventId ?? null : null,
		channelRelayHints: m,
		issues: o
	};
}
function h(e) {
	if (e?.kind === 1) return p(e);
	if (e?.kind === 42) return m(e);
	if (e?.kind === 1111) {
		let t = s(e);
		return {
			...c,
			rootId: t.rootEventId,
			parentId: t.parentEventId,
			rootRelayHint: t.rootTags.find((e) => e[0] === "E" || e[0] === "A")?.[2] ?? null,
			replyRelayHint: t.parentTags.find((e) => e[0] === "e" || e[0] === "a")?.[2] ?? null,
			rootAuthorHint: t.rootPubkey,
			replyAuthorHint: t.parentPubkey,
			relayHints: t.relayHints,
			authorHints: [t.rootPubkey, t.parentPubkey].filter((e) => !!e),
			rootKind: t.rootKind,
			parentKind: t.parentKind,
			rootPubkey: t.rootPubkey,
			parentPubkey: t.parentPubkey,
			rootReferenceTags: t.rootTags.map((e) => [...e]),
			parentReferenceTags: t.parentTags.map((e) => [...e]),
			issues: t.valid ? [] : ["invalid-nip22-reference"]
		};
	}
	return { ...c };
}
function g(e) {
	return !!e.parentId && !e.issues.includes("conflicting-reply-targets") && !e.issues.includes("reply-target-is-channel") && !e.issues.includes("invalid-nip22-reference");
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryEventUtils.ts
function _(e) {
	return e.map((e) => [...e]);
}
function v(e, t) {
	return !Array.isArray(e) || e.length !== t.length ? !1 : e.every((e, n) => !Array.isArray(e) || e.length !== t[n].length ? !1 : e.every((e, r) => e === t[n][r]));
}
function y(e) {
	return {
		...e,
		tags: _(e.tags)
	};
}
function b(e) {
	return {
		id: e.id,
		pubkey: e.pubkey,
		created_at: e.created_at,
		kind: e.kind,
		tags: _(e.tags),
		content: e.content,
		sig: e.sig
	};
}
function x(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return typeof t.id == "string" && typeof t.pubkey == "string" && typeof t.kind == "number" && typeof t.content == "string" && typeof t.created_at == "number" && typeof t.sig == "string" && Array.isArray(t.tags) && t.tags.every((e) => Array.isArray(e) && e.every((e) => typeof e == "string"));
}
function S(e, t) {
	if (!e || typeof e != "object") return !1;
	let n = e;
	return n.id === t.id && n.pubkey === t.pubkey && n.kind === t.kind && n.content === t.content && n.created_at === t.created_at && n.sig === t.sig && v(n.tags, t.tags);
}
function C(e) {
	if (e.kind !== 42) return {};
	let t = m(e);
	return t.channelEventId ? {
		channelEventId: t.channelEventId,
		...t.channelRelayHints.length > 0 ? { channelRelayHints: t.channelRelayHints } : {}
	} : {};
}
function w(e, t) {
	return x(e) && e.id === t.eventId && e.pubkey === t.pubkeyHex && e.kind === t.kind && e.content === t.content && e.created_at === t.createdAt && v(e.tags, t.tags);
}
export { S as a, m as c, n as d, w as i, h as l, b as n, x as o, C as r, g as s, y as t, s as u };
