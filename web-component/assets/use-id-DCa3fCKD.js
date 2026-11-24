import { it as e, lt as t } from "./index-client-DEFG3Gqk.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte-toolbelt/dist/utils/on-destroy-effect.svelte.js
function n(e) {
	t(() => () => {
		e();
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte-toolbelt/dist/utils/after-tick.js
function r(t) {
	e().then(t);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/kbd-constants.js
var i = "ArrowDown", a = "ArrowLeft", o = "ArrowRight", s = "ArrowUp", c = "Backspace", l = "Enter", u = "Escape", d = "Home", f = "PageDown", p = "PageUp", m = class {
	#e;
	#t = null;
	#n = null;
	#r = 0;
	constructor(e) {
		this.#e = e, n(() => this.#i());
	}
	#i() {
		this.#t !== null && (window.cancelAnimationFrame(this.#t), this.#t = null), this.#n?.disconnect(), this.#n = null, this.#r++;
	}
	run(e) {
		this.#i();
		let t = this.#r, n = () => {
			t === this.#r && this.#a(e);
		}, r = () => {
			if (t !== this.#r) return;
			let i = this.#e.ref.current;
			if (!i) return;
			if (typeof i.getAnimations != "function") {
				this.#a(e);
				return;
			}
			let a = i.getAnimations();
			a.length === 0 ? n() : Promise.all(a.map((e) => e.finished)).then(() => {
				n();
			}).catch(() => {
				t === this.#r && (i.getAnimations().some((e) => e.pending || e.playState !== "finished") ? r() : n());
			});
		}, i = () => {
			this.#t = window.requestAnimationFrame(() => {
				this.#t = null, r();
			});
		};
		this.#e.afterTick.current ? this.#t = window.requestAnimationFrame(() => {
			this.#t = null;
			let e = "data-starting-style", n = this.#e.ref.current;
			n && (n.hasAttribute(e) ? (this.#n = new MutationObserver(() => {
				t === this.#r && (n.hasAttribute(e) || (this.#n?.disconnect(), this.#n = null, i()));
			}), this.#n.observe(n, {
				attributes: !0,
				attributeFilter: [e]
			})) : i());
		}) : i();
	}
	#a(e) {
		let t = this.#r, n = () => {
			t === this.#r && e();
		};
		this.#e.afterTick.current ? r(n) : n();
	}
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/noop.js
function h() {}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/dom.js
function g(e) {
	if (!e) return null;
	for (let t of e.childNodes) if (t.nodeType !== Node.COMMENT_NODE) return t;
	return null;
}
function _(e, t) {
	let { clientX: n, clientY: r } = e, i = t.getBoundingClientRect();
	return n < i.left || n > i.right || r < i.top || r > i.bottom;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/use-id.js
globalThis.bitsIdCounter ??= { current: 0 };
function v(e = "bits") {
	return globalThis.bitsIdCounter.current++, `${e}-${globalThis.bitsIdCounter.current}`;
}
export { n as _, m as a, o as c, l as d, u as f, r as g, p as h, h as i, s as l, f as m, g as n, i as o, d as p, _ as r, a as s, v as t, c as u };
