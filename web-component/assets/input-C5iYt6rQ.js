import { ah as k, j as f, aZ as m, u as t, aa as _, q as b } from "./entry-B_zlOICe.js";
function i(e, a, v = a) {
  var c = /* @__PURE__ */ new WeakSet();
  k(e, "input", async (r) => {
    var l = r ? e.defaultValue : e.value;
    if (l = s(e) ? u(l) : l, v(l), f !== null && c.add(f), await m(), l !== (l = a())) {
      var h = e.selectionStart, d = e.selectionEnd, n = e.value.length;
      if (e.value = l ?? "", d !== null) {
        var o = e.value.length;
        h === d && d === n && o > n ? (e.selectionStart = o, e.selectionEnd = o) : (e.selectionStart = h, e.selectionEnd = Math.min(d, o));
      }
    }
  }), // If we are hydrating and the value has since changed,
  // then use the updated value from the input instead.
  (b && e.defaultValue !== e.value || // If defaultValue is set, then value == defaultValue
  // TODO Svelte 6: remove input.value check and set to empty string?
  t(a) == null && e.value) && (v(s(e) ? u(e.value) : e.value), f !== null && c.add(f)), _(() => {
    var r = a();
    if (e === document.activeElement) {
      var l = (
        /** @type {Batch} */
        f
      );
      if (c.has(l))
        return;
    }
    s(e) && r === u(e.value) || e.type === "date" && !r && !e.value || r !== e.value && (e.value = r ?? "");
  });
}
function E(e, a, v = a) {
  k(e, "change", (c) => {
    var r = c ? e.defaultChecked : e.checked;
    v(r);
  }), // If we are hydrating and the value has since changed,
  // then use the update value from the input instead.
  (b && e.defaultChecked !== e.checked || // If defaultChecked is set, then checked == defaultChecked
  t(a) == null) && v(e.checked), _(() => {
    var c = a();
    e.checked = !!c;
  });
}
function s(e) {
  var a = e.type;
  return a === "number" || a === "range";
}
function u(e) {
  return e === "" ? null : +e;
}
export {
  E as a,
  i as b
};
