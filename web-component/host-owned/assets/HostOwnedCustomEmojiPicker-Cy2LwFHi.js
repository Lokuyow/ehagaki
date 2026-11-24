import { $ as e, C as t, H as n, J as r, L as i, St as a, U as o, gt as s, h as c, ht as l, it as u, k as d, o as f, s as p, z as m } from "./index-client-C-CcpOhL.js";
import { r as h } from "./HostOwnedComposerLiteApp-DqckWDAf.js";
// D:/ドキュメント/GitHub/ehagaki/src/host-owned-composer-lite/HostOwnedCustomEmojiPicker.svelte
var g = m("<button type=\"button\" class=\"emoji-button svelte-1210hgo\"><img class=\"svelte-1210hgo\"/></button>"), _ = m("<div class=\"host-owned-emoji-picker svelte-1210hgo\"></div>"), v = {
	hash: "svelte-1210hgo",
	code: ".host-owned-emoji-picker.svelte-1210hgo {display:flex;flex-wrap:wrap;gap:4px;padding:8px;}.emoji-button.svelte-1210hgo {width:36px;height:36px;border:0;background:transparent;padding:4px;cursor:pointer;}.emoji-button.svelte-1210hgo img:where(.svelte-1210hgo) {width:100%;height:100%;object-fit:contain;}"
};
function y(n, m) {
	s(m, !0), t(n, v);
	let y = () => p(h, "$_", b), [b, x] = f();
	var S = _();
	d(S, 21, () => m.items, (e) => e.identityKey, (t, n) => {
		var a = g(), s = u(a);
		e(() => {
			c(a, "aria-label", `:${r(n).shortcode}:`), c(s, "src", r(n).src), c(s, "alt", `:${r(n).shortcode}:`);
		}), o("click", a, () => m.onSelect(r(n))), i(t, a);
	}), a(S), e((e) => c(S, "aria-label", e), [() => y()("keyboardButtonBar.custom_emoji")]), i(n, S), l(), x();
}
n(["click"]);
export { y as default };
