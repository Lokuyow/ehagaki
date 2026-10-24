import { et as e, ft as t, gt as n, mt as r } from "./index-client-Bdka-Daw.js";
import { A as i, C as a, O as o, S as s, at as c, ct as l, ft as u, it as d, k as f, lt as p, m, ot as h, st as g, ut as _, w as v, x as y } from "./LoadingPlaceholder-j1_vRYno.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte-toolbelt/dist/box/box.svelte.js
function b(i) {
	let a = n(t(i));
	return {
		[d]: !0,
		[_]: !0,
		get current() {
			return e(a);
		},
		set current(e) {
			r(a, e, !0);
		}
	};
}
b.from = h, b.with = g, b.flatten = c, b.readonly = u, b.isBox = l, b.isWritableBox = p;
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/locale.js
function x(e) {
	return window.getComputedStyle(e).getPropertyValue("direction");
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/get-directional-keys.js
var S = [
	y,
	i,
	o
], C = [
	v,
	f,
	"End"
];
[...S, ...C];
function w(e = "ltr", t = "horizontal") {
	return {
		horizontal: e === "rtl" ? s : a,
		vertical: y
	}[t];
}
function T(e = "ltr", t = "horizontal") {
	return {
		horizontal: e === "rtl" ? a : s,
		vertical: v
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
		let c = i.indexOf(e), { nextKey: l, prevKey: u } = E(x(r), this.#e.orientation.current), d = this.#e.loop.current, f = {
			[l]: c + 1,
			[u]: c - 1,
			[o]: 0,
			End: i.length - 1
		};
		if (n) {
			let e = l === "ArrowDown" ? a : y, t = u === "ArrowUp" ? s : v;
			f[e] = c + 1, f[t] = c - 1;
		}
		let p = f[t.key];
		if (p === void 0) return;
		t.preventDefault(), p < 0 && d ? p = i.length - 1 : p === i.length && d && (p = 0);
		let m = i[p];
		if (m) return m.focus(), this.#t.current = m.id, this.#e.onCandidateFocus?.(m), m;
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
		t && m(t) && t.focus();
	}
};
export { D as t };
