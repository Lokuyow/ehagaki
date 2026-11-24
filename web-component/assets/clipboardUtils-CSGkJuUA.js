import { a as e, m as t, n } from "./esm-N9TTQGcl.js";
import { G as r, K as i, ct as a, lt as o, q as s } from "./appUtils-B3-zUpkb.js";
import { t as c } from "./httpUrlCandidates-BckQw1dk.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/textDisplayUtils.ts
function l(e, t, n) {
	let r = t + n + 3;
	return e.length <= r ? e : `${e.slice(0, t)}...${e.slice(-n)}`;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/nostrUtils.ts
function u(e) {
	return o.test(e);
}
function d(e) {
	return /^(npub|nprofile)1/i.test(e.trim());
}
function f(n) {
	if (!d(n)) return null;
	try {
		let r = e.decode(n.trim());
		if (r.type === "npub" && t(r.data)) return {
			pubkeyHex: r.data,
			relayHints: []
		};
		if (r.type === "nprofile" && t(r.data.pubkey)) return {
			pubkeyHex: r.data.pubkey,
			relayHints: r.data.relays ?? []
		};
	} catch {}
	return null;
}
function p(e) {
	return a.test(e);
}
function m(e) {
	return n(e);
}
function h(t) {
	return {
		npub: e.npubEncode(t),
		nprofile: e.nprofileEncode({
			pubkey: t,
			relays: []
		})
	};
}
function g(t) {
	try {
		let { type: n, data: r } = e.decode(t);
		if (n !== "nsec") return console.warn("無効なnsec形式です"), {
			hex: "",
			npub: "",
			nprofile: ""
		};
		let i = m(r), { npub: a, nprofile: o } = h(i);
		return {
			hex: i,
			npub: a,
			nprofile: o
		};
	} catch {
		return {
			hex: "",
			npub: "",
			nprofile: ""
		};
	}
}
function _(t) {
	try {
		return e.npubEncode(t);
	} catch {
		return `npub1${t.slice(0, 10)}...`;
	}
}
function v(e, t, n) {
	for (let r of t) if (r && !e.includes(r) && (e.push(r), e.length >= n)) return;
}
function y(e, t = 3) {
	let n = [];
	for (let r of e) if (v(n, r, t), n.length >= t) break;
	return n;
}
function b(t, n = [], r = []) {
	try {
		let i = y([n.slice(0, 1), r], 3);
		return e.nprofileEncode({
			pubkey: t,
			relays: i
		});
	} catch {
		return "";
	}
}
function x(t) {
	try {
		let n = y([
			t.acceptedRelays ?? [],
			t.relayHints ?? [],
			t.writeRelays ?? []
		], 3);
		return e.neventEncode({
			id: t.eventId,
			author: t.authorPubkey,
			kind: t.kind,
			relays: n
		});
	} catch {
		return "";
	}
}
function S(t) {
	try {
		return l(e.npubEncode(t), 12, 4);
	} catch {
		return l(t, 10, 4);
	}
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/editorUrlUtils.ts
function C(e) {
	return encodeURI(e.trim());
}
function w(e) {
	return i.includes(e);
}
function T(e) {
	let t = e.toLowerCase();
	return r.some((e) => t.endsWith(e));
}
function E(e) {
	let t = e.toLowerCase();
	return s.some((e) => t.endsWith(e));
}
function D(e) {
	try {
		let t = C(e), n = new URL(t);
		return w(n.protocol) ? n.href : null;
	} catch {
		return null;
	}
}
function O(e) {
	let t = D(e);
	if (!t) return null;
	try {
		return T(new URL(t).pathname) ? t : null;
	} catch {
		return null;
	}
}
function k(e) {
	let t = D(e);
	if (!t) return null;
	try {
		return E(new URL(t).pathname) ? t : null;
	} catch {
		return null;
	}
}
function A(e) {
	return e.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}
function j(e) {
	return !e || /[\s\n\u3000]/.test(e) || c(e);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/clipboardUtils.ts
function M(e, t = {}) {
	let { collapseEmptyLines: n = !1, maxConsecutiveEmptyLines: r = 2 } = t, i = A(e);
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
function N(e) {
	return e.join("\n");
}
async function P(e, t = "", n, r) {
	await F(e, t, n, r);
}
async function F(e, t = "", n, r) {
	try {
		let r = n ?? navigator;
		if (r?.clipboard && typeof r.clipboard.writeText == "function") return await r.clipboard.writeText(e), console.log(`${t} copied to clipboard`), !0;
	} catch (e) {
		console.error(`Failed to copy ${t}:`, e);
	}
	return I(e, t, r);
}
async function I(e, t = "", n) {
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
function L(e) {
	if (!e) return [];
	let t = Array.from(e.items ?? []).filter((e) => e.kind === "file").map((e) => e.getAsFile()).filter((e) => !!e);
	return t.length > 0 ? t : Array.from(e.files ?? []);
}
export { l as C, _ as S, d as _, F as a, x as b, A as c, D as d, k as f, S as g, g as h, N as i, C as l, h as m, L as n, w as o, u as p, M as r, j as s, P as t, O as u, p as v, b as x, f as y };
