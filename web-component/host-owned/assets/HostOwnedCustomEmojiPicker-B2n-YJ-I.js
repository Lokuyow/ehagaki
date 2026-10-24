import { B as e, D as t, F as n, K as r, L as i, V as a, Z as o, bt as s, m as c, mt as l, nt as u, o as d, pt as f, s as p, x as m } from "./index-client-CTw9cD2v.js";
import { r as h } from "./HostOwnedComposerLiteApp-xmnOGsVi.js";
// D:/ドキュメント/GitHub/ehagaki/src/host-owned-composer-lite/HostOwnedCustomEmojiPicker.svelte
var g = i("<button type=\"button\" class=\"emoji-button svelte-1210hgo\"><img class=\"svelte-1210hgo\"/></button>"), _ = i("<div class=\"host-owned-emoji-picker svelte-1210hgo\"></div>"), v = {
	hash: "svelte-1210hgo",
	code: ".host-owned-emoji-picker.svelte-1210hgo {display:flex;flex-wrap:wrap;gap:4px;padding:8px;}.emoji-button.svelte-1210hgo {width:36px;height:36px;border:0;background:transparent;padding:4px;cursor:pointer;}.emoji-button.svelte-1210hgo img:where(.svelte-1210hgo) {width:100%;height:100%;object-fit:contain;}"
};
function y(e, i) {
	l(i, !0), m(e, v);
	let y = () => p(h, "$_", b), [b, x] = d();
	var S = _();
	t(S, 21, () => i.items, (e) => e.identityKey, (e, t) => {
		var s = g(), l = u(s);
		o(() => {
			c(s, "aria-label", `:${r(t).shortcode}:`), c(l, "src", r(t).src), c(l, "alt", `:${r(t).shortcode}:`);
		}), a("click", s, () => i.onSelect(r(t))), n(e, s);
	}), s(S), o((e) => c(S, "aria-label", e), [() => y()("keyboardButtonBar.custom_emoji")]), n(e, S), f(), x();
}
e(["click"]);
export { y as default };
