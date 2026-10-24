import { n as e } from "./appRuntimeEnvironment-BvtUCHcA.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/keyboardFocusUtils.ts
var t = null, n = null, r = 80;
function i(e) {
	return e instanceof Element ? e : e?.parentElement ?? null;
}
function a() {
	let t = e(), n = t.domRoot, r = t.document, a = n && "activeElement" in n ? n.activeElement : r?.activeElement;
	if (a?.closest("[data-post-editor-root]") || a?.matches("[data-composer-keyboard-input]")) return !0;
	if (a && a !== r?.body && a !== r?.documentElement) return !1;
	let o = r?.getSelection();
	return !!(o?.rangeCount && i(o.anchorNode)?.closest("[data-post-editor-root]"));
}
function o() {
	let t = e(), n = t.window?.getComputedStyle(t.styleTarget).getPropertyValue("--keyboard-height").trim() ?? t.styleTarget.style.getPropertyValue("--keyboard-height").trim(), r = Number.parseFloat(n);
	return Number.isFinite(r) ? r : 0;
}
function s() {
	return o() > r;
}
function c() {
	if (!n) return;
	let [e, t] = n;
	t === null ? e.removeAttribute("inputmode") : e.setAttribute("inputmode", t), n = null;
}
function l(e) {
	let t = e.target, n = t instanceof Node ? t.getRootNode() : document, r = n instanceof ShadowRoot ? n.activeElement : document.activeElement;
	return r instanceof HTMLElement ? r : null;
}
function u(e) {
	if (e.type !== "touchstart" && e.pointerType !== "touch" || s()) return;
	let r = l(e);
	r?.classList?.contains("tiptap-editor") && (n ||= [r, r.getAttribute("inputmode")], r.setAttribute("inputmode", "none"), t !== null && clearTimeout(t), t = setTimeout(() => {
		t = null, c();
	}, 400));
}
function d(e) {
	e.preventDefault(), u(e);
}
function f(e) {
	u(e);
}
function p() {
	if (typeof navigator > "u") return !1;
	let e = navigator.userAgent ?? "", t = navigator.platform ?? "";
	return /iPad|iPhone|iPod/.test(e) || t === "MacIntel" && navigator.maxTouchPoints > 1;
}
function m(e) {
	return document.activeElement === e || !p() && (n ||= [e, e.getAttribute("inputmode")], e.setAttribute("inputmode", "none"), e.focus({ preventScroll: !0 }), t !== null && clearTimeout(t), t = setTimeout(() => {
		t = null, c();
	}, 400), document.activeElement === e);
}
export { o as a, d as i, a as n, f as r, m as t };
