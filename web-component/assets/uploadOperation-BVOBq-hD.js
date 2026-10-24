// D:/ドキュメント/GitHub/ehagaki/src/lib/upload/uploadOperation.ts
function e() {
	if (typeof DOMException < "u") return new DOMException("The operation was aborted.", "AbortError");
	let e = /* @__PURE__ */ Error("The operation was aborted.");
	return e.name = "AbortError", e;
}
function t(t) {
	if (t?.aborted) throw e();
}
function n(n, r) {
	return t(r), r ? new Promise((t, i) => {
		let a = !1, o = () => r.removeEventListener("abort", s), s = () => {
			a || (a = !0, o(), i(e()));
		}, c = (e) => {
			a || (r.aborted ? s() : (a = !0, o(), e()));
		};
		r.addEventListener("abort", s, { once: !0 }), r.aborted ? s() : Promise.resolve(n).then((e) => c(() => t(e)), (e) => c(() => i(e)));
	}) : Promise.resolve(n);
}
function r(n, r) {
	return t(r), r ? new Promise((t, i) => {
		let a = setTimeout(() => {
			r.removeEventListener("abort", o), t();
		}, n), o = () => {
			clearTimeout(a), r.removeEventListener("abort", o), i(e());
		};
		r.addEventListener("abort", o, { once: !0 }), r.aborted && o();
	}) : new Promise((e) => setTimeout(e, n));
}
export { r as i, e as n, t as r, n as t };
