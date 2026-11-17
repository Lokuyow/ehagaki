import { t as e } from "./nostrHexUtils-C4ICTS7z.js";
import { f as t, u as n } from "./customEmoji-Nqrea9dO.js";
import { i as r } from "./customEmojiUsage-AVeLEE1v.js";
import { n as i } from "./graphemeUtils-D37rBdTG.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/reactionValue.ts
function a(e) {
	let t = e.replace(/\.[^.]*$/, "");
	return /[A-Za-z0-9_-]/.test(t) ? t.replace(/[^A-Za-z0-9_-]+/g, "_") : "emoji";
}
function o(e) {
	let t = e.items[0];
	return e.items.length === 1 && t.type === "image" && e.ownedItemIds.has(t.id) ? "uploadedShortcode" : "singleValue";
}
function s(e) {
	let t = "", n = e.childCount === 1 && e.firstChild?.type.name === "paragraph" ? 0 : 1;
	return e.descendants((e) => {
		e.isText ? (t += e.text ?? "", (e.marks.length || /[\r\n\u2028\u2029]/u.test(e.text ?? "")) && n++) : e.type.name !== "paragraph" && n++;
	}), {
		text: t,
		forbidden: n,
		count: [...i(t)].length
	};
}
function c(e, t, n) {
	let r = n === "uploadedShortcode" ? s(e) : u(e), i = n === "uploadedShortcode" ? s(t) : u(t);
	return i.forbidden === 0 && (n === "uploadedShortcode" || i.count <= 1) || (r.count > 1 || r.forbidden > 0) && i.count <= r.count && i.forbidden <= r.forbidden;
}
function l(n) {
	if (n.type === "text") {
		if (!n.text.trim() || [...i(n.text)].length !== 1 || /[\r\n]/.test(n.text)) throw Error("invalid_reaction_value");
		return { content: n.text };
	}
	let a = r(n.emoji);
	if (!a || !/^[a-zA-Z0-9_-]+$/.test(a.shortcode)) throw Error("invalid_reaction_value");
	let o = [
		"emoji",
		a.shortcode,
		a.src
	], s = t(a.setAddress);
	return s && e(s.pubkey) && o.push(s.address), {
		content: `:${a.shortcode}:`,
		emojiTag: o
	};
}
function u(e, t = !1) {
	if (typeof t != "boolean" && t.items.length > 0) {
		let r = s(e), i = t.items[0], c = null;
		if (o(t) === "uploadedShortcode" && !i.isPlaceholder && !r.forbidden && !/\s/u.test(r.text)) {
			let e = r.text === "" ? a(t.originalFileNames.get(i.id) ?? "") : n(r.text);
			if (/^[A-Za-z0-9_-]+$/.test(e)) {
				let t = {
					type: "customEmoji",
					emoji: {
						shortcode: e,
						src: i.src
					}
				};
				try {
					l(t), c = t;
				} catch {}
			}
		}
		return {
			...r,
			value: c
		};
	}
	let r = typeof t == "boolean" && t, c = "", u = [], d = +!!r, f = 0;
	e.descendants((e) => {
		e.isText ? c += e.text ?? "" : e.type.name === "customEmoji" ? u.push(e.attrs) : e.type.name === "paragraph" ? f++ : e.type.name !== "doc" && d++;
	}), d += Math.max(0, f - 1);
	let p = [...i(c)].length + u.length, m = null;
	if (!d && p === 0) m = {
		type: "text",
		text: "+"
	};
	else if (!d && p === 1) {
		let e = u.length ? {
			type: "customEmoji",
			emoji: { ...u[0] }
		} : {
			type: "text",
			text: c
		};
		try {
			l(e), m = e;
		} catch {}
	}
	return {
		value: m,
		count: p,
		forbidden: d
	};
}
export { l as i, o as n, u as r, c as t };
