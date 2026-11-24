import { _t as e, ht as t, rt as n, yt as r } from "./index-client-DEFG3Gqk.js";
import { G as i, H as a, J as o, K as s, U as c, W as l, X as u, l as d, q as f } from "./LoadingPlaceholder-YrD8D_td.js";
import { c as p, h as m, l as h, m as g, o as _, p as v, s as y } from "./use-id-DCa3fCKD.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte-toolbelt/dist/box/box.svelte.js
function b(i) {
	let s = r(t(i));
	return {
		[a]: !0,
		[o]: !0,
		get current() {
			return n(s);
		},
		set current(t) {
			e(s, t, !0);
		}
	};
}
b.from = l, b.with = i, b.flatten = c, b.readonly = u, b.isBox = s, b.isWritableBox = f;
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/locale.js
function x(e) {
	return window.getComputedStyle(e).getPropertyValue("direction");
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/get-directional-keys.js
var S = [
	_,
	m,
	v
], C = [
	h,
	g,
	"End"
];
[...S, ...C];
function w(e = "ltr", t = "horizontal") {
	return {
		horizontal: e === "rtl" ? y : p,
		vertical: _
	}[t];
}
function T(e = "ltr", t = "horizontal") {
	return {
		horizontal: e === "rtl" ? p : y,
		vertical: h
	}[t];
}
function E(e = "ltr", t = "horizontal") {
	return ["ltr", "rtl"].includes(e) || (e = "ltr"), ["horizontal", "vertical"].includes(t) || (t = "horizontal"), {
		nextKey: w(e, t),
		prevKey: T(e, t)
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/roving-focus-group.js
var D = class {
	#e;
	#t = b(null);
	constructor(e) {
		this.#e = e;
	}
	getCandidateNodes() {
		if (!this.#e.rootNode.current) return [];
		if (this.#e.candidateSelector) {
			let e = Array.from(this.#e.rootNode.current.querySelectorAll(this.#e.candidateSelector));
			return this.#n(this.#e.rootNode.current, e);
		}
		if (this.#e.candidateAttr) {
			let e = Array.from(this.#e.rootNode.current.querySelectorAll(`[${this.#e.candidateAttr}]:not([data-disabled])`));
			return this.#n(this.#e.rootNode.current, e);
		}
		return [];
	}
	#n(e, t) {
		let n = this.#e.rootAttr;
		if (!n) return t;
		let r = `[${n}]`;
		return t.filter((t) => t.closest(r) === e);
	}
	focusFirstCandidate() {
		let e = this.getCandidateNodes();
		e.length && e[0]?.focus();
	}
	handleKeydown(e, t, n = !1) {
		let r = this.#e.rootNode.current;
		if (!r || !e) return;
		let i = this.getCandidateNodes();
		if (!i.length) return;
		let a = i.indexOf(e), { nextKey: o, prevKey: s } = E(x(r), this.#e.orientation.current), c = this.#e.loop.current, l = {
			[o]: a + 1,
			[s]: a - 1,
			[v]: 0,
			End: i.length - 1
		};
		if (n) {
			let e = o === "ArrowDown" ? p : _, t = s === "ArrowUp" ? y : h;
			l[e] = a + 1, l[t] = a - 1;
		}
		let u = l[t.key];
		if (u === void 0) return;
		t.preventDefault(), u < 0 && c ? u = i.length - 1 : u === i.length && c && (u = 0);
		let d = i[u];
		if (d) return d.focus(), this.#t.current = d.id, this.#e.onCandidateFocus?.(d), d;
	}
	getTabIndex(e) {
		let t = this.getCandidateNodes(), n = this.#t.current !== null;
		return e && !n && t[0] === e ? (this.#t.current = e.id, 0) : e?.id === this.#t.current ? 0 : -1;
	}
	setCurrentTabStopId(e) {
		this.#t.current = e;
	}
	focusCurrentTabStop() {
		let e = this.#t.current;
		if (!e) return;
		let t = this.#e.rootNode.current?.querySelector(`#${e}`);
		t && d(t) && t.focus();
	}
};
export { D as t };
