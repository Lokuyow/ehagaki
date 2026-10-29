import { f as e, u as t } from "./customEmoji-BFRq6RB7.js";
import { i as n } from "./customEmojiUsage-K78WMNd4.js";
import { n as r } from "./graphemeUtils-D37rBdTG.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/reactionValue.ts
function i(e) {
	let t = e.replace(/\.[^.]*$/, "");
	return /[A-Za-z0-9_-]/.test(t) ? t.replace(/[^A-Za-z0-9_-]+/g, "_") : "emoji";
}
function a(e) {
	let t = e.items[0];
	return e.items.length === 1 && t.type === "image" && e.ownedItemIds.has(t.id) ? "uploadedShortcode" : "singleValue";
}
function o(e) {
	let t = "", n = e.childCount === 1 && e.firstChild?.type.name === "paragraph" ? 0 : 1;
	return e.descendants((e) => {
		e.isText ? (t += e.text ?? "", (e.marks.length || /[\r\n\u2028\u2029]/u.test(e.text ?? "")) && n++) : e.type.name !== "paragraph" && n++;
	}), {
		text: t,
		forbidden: n,
		count: [...r(t)].length
	};
}
function s(e, t, n) {
	let r = n === "uploadedShortcode" ? o(e) : l(e), i = n === "uploadedShortcode" ? o(t) : l(t);
	return i.forbidden === 0 && (n === "uploadedShortcode" || i.count <= 1) || (r.count > 1 || r.forbidden > 0) && i.count <= r.count && i.forbidden <= r.forbidden;
}
function c(t) {
	if (t.type === "text") {
		if (!t.text.trim() || [...r(t.text)].length !== 1 || /[\r\n]/.test(t.text)) throw Error("invalid_reaction_value");
		return { content: t.text };
	}
	let i = n(t.emoji);
	if (!i || !/^[a-zA-Z0-9_-]+$/.test(i.shortcode)) throw Error("invalid_reaction_value");
	let a = [
		"emoji",
		i.shortcode,
		i.src
	], o = e(i.setAddress);
	return o && /^[0-9a-f]{64}$/i.test(o.pubkey) && a.push(o.address), {
		content: `:${i.shortcode}:`,
		emojiTag: a
	};
}
function l(e, n = !1) {
	if (typeof n != "boolean" && n.items.length > 0) {
		let r = o(e), s = n.items[0], l = null;
		if (a(n) === "uploadedShortcode" && !s.isPlaceholder && !r.forbidden && !/\s/u.test(r.text)) {
			let e = r.text === "" ? i(n.originalFileNames.get(s.id) ?? "") : t(r.text);
			if (/^[A-Za-z0-9_-]+$/.test(e)) {
				let t = {
					type: "customEmoji",
					emoji: {
						shortcode: e,
						src: s.src
					}
				};
				try {
					c(t), l = t;
				} catch {}
			}
		}
		return {
			...r,
			value: l
		};
	}
	let s = typeof n == "boolean" && n, l = "", u = [], d = +!!s, f = 0;
	e.descendants((e) => {
		e.isText ? l += e.text ?? "" : e.type.name === "customEmoji" ? u.push(e.attrs) : e.type.name === "paragraph" ? f++ : e.type.name !== "doc" && d++;
	}), d += Math.max(0, f - 1);
	let p = [...r(l)].length + u.length, m = null;
	if (!d && p === 1) {
		let e = u.length ? {
			type: "customEmoji",
			emoji: { ...u[0] }
		} : {
			type: "text",
			text: l
		};
		try {
			c(e), m = e;
		} catch {}
	}
	return {
		value: m,
		count: p,
		forbidden: d
	};
}
export { c as i, a as n, l as r, s as t };
