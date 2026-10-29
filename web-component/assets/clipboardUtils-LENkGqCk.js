import { at as e, it as t, rt as n } from "./appUtils-CwuZyofa.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/httpUrlCandidates.ts
var r = /https?:\/\/[^\s\u3000<>"]+/gi, i = /* @__PURE__ */ new Set([
	".",
	",",
	"!",
	"?",
	":",
	";",
	"、",
	"。",
	"，",
	"．",
	"！",
	"？",
	"：",
	"；"
]), a = /* @__PURE__ */ new Set([
	"\"",
	"'",
	"＂",
	"＇",
	"“",
	"”",
	"‘",
	"’"
]), o = /* @__PURE__ */ new Map([
	[")", "("],
	["]", "["],
	["}", "{"],
	["）", "（"],
	["］", "［"],
	["｝", "｛"],
	["〉", "〈"],
	["》", "《"],
	["」", "「"],
	["』", "『"],
	["】", "【"],
	["〕", "〔"],
	["〗", "〖"],
	["〙", "〘"],
	["〛", "〚"]
]), s = new Map(Array.from(o, ([e, t]) => [t, e]));
function c(e) {
	return !!e && s.has(e);
}
function l(e, t, n) {
	let r = 0;
	for (let i = 0; i < e.length; i += 1) {
		let a = e[i];
		if (a === n) r += 1;
		else if (a === t) {
			let t = r > 0;
			if (t && --r, i === e.length - 1) return !t;
		}
	}
	return !1;
}
function u(e, t, n) {
	if (n !== ")" && n !== "]" && n !== "}") return !1;
	let r = e.indexOf("?"), i = e.indexOf("#");
	return r >= 0 && r < t || i >= 0 && i < t;
}
function d() {
	return {
		hasContent: !1,
		startsAsUrlSyntax: !1,
		isAsciiPrintable: !0,
		openingBrackets: []
	};
}
function f() {
	return {
		hasQueryOrFragment: !1,
		isNaturalTrailingCharacter: !1,
		openingBrackets: []
	};
}
function p(e, t) {
	if ((t === "?" || t === "#") && (e.hasQueryOrFragment = !0), e.isNaturalTrailingCharacter = i.has(t) || a.has(t), s.has(t)) {
		e.openingBrackets.push(t);
		return;
	}
	let n = o.get(t);
	if (!n) return;
	let r = n === e.openingBrackets.at(-1);
	r && e.openingBrackets.pop();
	let c = e.hasQueryOrFragment && (t === ")" || t === "]" || t === "}");
	e.isNaturalTrailingCharacter = !r && !c;
}
function m(e, t) {
	e.hasContent || (e.hasContent = !0, e.startsAsUrlSyntax = /[A-Za-z0-9/?#%]/.test(t)), (t < "!" || t > "~") && (e.isAsciiPrintable = !1), s.has(t) ? e.openingBrackets.push(t) : o.get(t) === e.openingBrackets.at(-1) && e.openingBrackets.pop();
}
function h(e) {
	return !e.hasContent || e.startsAsUrlSyntax && e.isAsciiPrintable && e.openingBrackets.length === 0;
}
function g(e, t) {
	let n = v(e.slice(0, t.end - t.closingBracket.length));
	return {
		isValid: y(n.displayText) !== null,
		hasTrailingText: n.trailingText.length > 0
	};
}
function _(e, t, n) {
	let r = t > 0 ? e.at(t - 1) : void 0;
	if (!r) return null;
	let i = s.get(r);
	if (!i) return null;
	let a = 1, o = 0, c = null, l = null, u = null, _ = null, v = f();
	for (let e of n) {
		let t = _ !== null;
		if (e === r) a += 1;
		else if (e === i && (a > 0 && --a, a === 0)) {
			let t = {
				end: o + e.length,
				closingBracket: e
			};
			!l && v.isNaturalTrailingCharacter && (l = t), c ? _ && h(_) && (u = t) : (c = t, _ = d());
		}
		t && _ && m(_, e), p(v, e), o += e.length;
	}
	if (!c) return null;
	if (l) {
		let e = g(n, l);
		if (e.isValid && e.hasTrailingText) return l;
	}
	return u && g(n, u).isValid ? u : g(n, c).isValid ? c : null;
}
function v(e) {
	let t = e.length;
	for (; t > 0;) {
		let n = e.slice(0, t), r = n.at(-1);
		if (!r) break;
		if (i.has(r) || a.has(r)) {
			t -= r.length;
			continue;
		}
		let s = o.get(r);
		if (s && !u(n, n.length - r.length, r) && l(n, r, s)) t -= r.length;
		else break;
	}
	return {
		displayText: e.slice(0, t),
		trailingText: e.slice(t)
	};
}
function y(e) {
	try {
		let t = new URL(e);
		return t.protocol !== "http:" && t.protocol !== "https:" || !t.hostname ? null : t.href;
	} catch {
		return null;
	}
}
function b(e) {
	let t = [], n = new RegExp(r.source, r.flags), i;
	for (; (i = n.exec(e)) !== null;) {
		let r = i.index ?? -1, a = i[0] ?? "";
		if (r < 0 || !a) continue;
		let o = _(e, r, a), s = r + (o?.end ?? a.length), c = e.slice(r, s);
		n.lastIndex = s;
		let l = o ? c.slice(0, -o.closingBracket.length) : null, u = l ? v(l) : null, { displayText: d, trailingText: f } = u && y(u.displayText) ? {
			displayText: u.displayText,
			trailingText: u.trailingText + o.closingBracket
		} : v(c), p = y(d);
		t.push({
			candidateStart: r,
			candidateEnd: s,
			start: r,
			end: r + d.length,
			rawCandidate: c,
			displayText: d,
			trailingText: f,
			href: p,
			isValidHttpUrl: p !== null
		});
	}
	return t;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/editorUrlUtils.ts
function x(e) {
	return encodeURI(e.trim());
}
function S(e) {
	return t.includes(e);
}
function C(e) {
	let t = e.toLowerCase();
	return n.some((e) => t.endsWith(e));
}
function w(t) {
	let n = t.toLowerCase();
	return e.some((e) => n.endsWith(e));
}
function T(e) {
	try {
		let t = x(e), n = new URL(t);
		return S(n.protocol) ? n.href : null;
	} catch {
		return null;
	}
}
function E(e) {
	let t = T(e);
	if (!t) return null;
	try {
		return C(new URL(t).pathname) ? t : null;
	} catch {
		return null;
	}
}
function D(e) {
	let t = T(e);
	if (!t) return null;
	try {
		return w(new URL(t).pathname) ? t : null;
	} catch {
		return null;
	}
}
function O(e) {
	return e.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}
function k(e) {
	return !e || /[\s\n\u3000]/.test(e) || c(e);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/clipboardUtils.ts
function A(e, t = {}) {
	let { collapseEmptyLines: n = !1, maxConsecutiveEmptyLines: r = 2 } = t, i = O(e);
	if (n) {
		let e = RegExp(`\\n{${r + 2},}`, "g");
		i = i.replace(e, "\n".repeat(r + 1));
	}
	let a = i.split("\n");
	return a.length > 0 && a[a.length - 1] === "" && (a = a.slice(0, -1)), a.length === 1 && a[0] === "" && (a = []), {
		normalized: i,
		lines: a
	};
}
function j(e) {
	return e.join("\n");
}
async function M(e, t = "", n, r) {
	await N(e, t, n, r);
}
async function N(e, t = "", n, r) {
	try {
		let r = n ?? navigator;
		if (r?.clipboard && typeof r.clipboard.writeText == "function") return await r.clipboard.writeText(e), console.log(`${t} copied to clipboard`), !0;
	} catch (e) {
		console.error(`Failed to copy ${t}:`, e);
	}
	return P(e, t, r);
}
async function P(e, t = "", n) {
	let r = (n ?? window)?.document ?? document, i = r.createElement("textarea");
	try {
		let n = r.activeElement, a = (n instanceof HTMLElement ? n : null)?.closest("dialog, [role='dialog'], .dialog") ?? r.body;
		if (i.value = e, i.style.position = "fixed", i.style.left = "-9999px", i.style.top = "0", i.setAttribute("readonly", "true"), a.appendChild(i), i.focus(), i.select(), r.execCommand && r.execCommand("copy")) return console.log(`${t} copied to clipboard (fallback)`), !0;
		throw Error("fallback_copy_failed");
	} catch (e) {
		return console.warn(`Failed to copy ${t} (both clipboard API and fallback failed):`, e), !1;
	} finally {
		i.remove();
	}
}
export { k as a, E as c, b as d, N as i, T as l, A as n, O as o, j as r, x as s, M as t, D as u };
