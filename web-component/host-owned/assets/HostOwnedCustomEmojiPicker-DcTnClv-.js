import { a as j, p as d, e as w, s as a, b as k, $ as y, c as S } from "./HostOwnedComposerLiteApp-DKh2FKcc.js";
import { aX as B, _ as h, a_ as m, a$ as q, b0 as u, b3 as b, aq as C, b1 as E, b4 as H, b5 as g, a as r, ap as K } from "./host-owned-entry-DTGUaNd_.js";
var O = b('<button type="button" class="emoji-button svelte-1210hgo"><img class="svelte-1210hgo"/></button>'), P = b('<div class="host-owned-emoji-picker svelte-1210hgo"></div>');
const X = {
  hash: "svelte-1210hgo",
  code: ".host-owned-emoji-picker.svelte-1210hgo {display:flex;flex-wrap:wrap;gap:4px;padding:8px;}.emoji-button.svelte-1210hgo {width:36px;height:36px;border:0;background:transparent;padding:4px;cursor:pointer;}.emoji-button.svelte-1210hgo img:where(.svelte-1210hgo) {width:100%;height:100%;object-fit:contain;}"
};
function z(l, i) {
  B(i, !0), j(l, X);
  const v = () => k(y, "$_", _), [_, f] = S();
  let n = d(i, "items", 7), c = d(i, "onSelect", 7);
  var $ = {
    get items() {
      return n();
    },
    set items(e) {
      n(e), u();
    },
    get onSelect() {
      return c();
    },
    set onSelect(e) {
      c(e), u();
    }
  }, s = P();
  w(s, 21, n, (e) => e.identityKey, (e, o) => {
    var t = O(), p = H(t);
    g(t), h(() => {
      a(t, "aria-label", `:${r(o).shortcode}:`), a(p, "src", r(o).src), a(p, "alt", `:${r(o).shortcode}:`);
    }), K("click", t, () => c()(r(o))), m(e, t);
  }), g(s), h((e) => a(s, "aria-label", e), [() => v()("keyboardButtonBar.custom_emoji")]), m(l, s);
  var x = q($);
  return f(), x;
}
C(["click"]);
E(z, { items: {}, onSelect: {} }, [], [], { mode: "open" });
export {
  z as default
};
