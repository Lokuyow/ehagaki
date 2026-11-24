import { a as e } from "./appRuntimeEnvironment-Bzv9wJOh.js";
import { p as t } from "./esm-N9TTQGcl.js";
import { r as n } from "./uploadOperation-BVOBq-hD.js";
import { n as r } from "./esm-CrCI9Pgc.js";
import { r as i } from "./signedEventResultValidator-7WV1YEyT.js";
import { n as a, o } from "./resolveCurrentUploadDestination-CMXZTG_T.js";
import { L as s } from "./editorStore.svelte-Q7oo5cQe.js";
import { i as c, r as l, t as u } from "./imageCompressionService-DpIpfk5p.js";
import { t as d } from "./fileUploadManager-D2bOMABj.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/upload/headlessUpload.ts
function f(e, t, n) {
	let r = Error(t, n === void 0 ? void 0 : { cause: n });
	return r.name = e, r;
}
function p(t) {
	let n = e(), r = () => t.aborted, i = new l(document);
	return new d({
		localStorage: n,
		fetch: window.fetch.bind(window),
		crypto: window.crypto.subtle,
		document,
		window,
		navigator,
		isUploadAborted: r
	}, new o({ signal: t }), new u(i, n, r), new c(n, r), i);
}
function m(e) {
	return typeof e == "string" && /^[A-Za-z0-9!#$%&'*+.^_`|~-]+\/[A-Za-z0-9!#$%&'*+.^_`|~-]+$/.test(e);
}
function h(e) {
	if (typeof e != "string") return !1;
	let t = e.match(/^([1-9]\d*)x([1-9]\d*)$/);
	return !!t && Number.isSafeInteger(Number(t[1])) && Number.isSafeInteger(Number(t[2]));
}
function g(e) {
	if (typeof e != "string" || e.length < 6 || e.length > 180 || ![...e].every((e) => "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#$%*+,-.:;=?@[]^_{|}~".includes(e))) return !1;
	try {
		return r(e, 1, 1), !0;
	} catch {
		return !1;
	}
}
function _(e) {
	return /\b(?:413|415)\b/.test(e);
}
function v(e, t) {
	let n = e || "The file could not be uploaded.";
	return f(_(n) ? "unsupported_media" : "upload_failed", n, t);
}
function y(e) {
	if (typeof e != "object" || !e || typeof File > "u") return !1;
	let t = Object.getOwnPropertyDescriptor(File.prototype, "name")?.get;
	if (!t) return !1;
	try {
		return typeof t.call(e) == "string";
	} catch {
		return !1;
	}
}
function b(e) {
	try {
		let t = new URL(e), n = e.match(/^[A-Za-z][A-Za-z0-9+.-]*:\/\/([^/?#]*)/)?.[1];
		if ((t.protocol === "http:" || t.protocol === "https:") && !t.username && !t.password && !n?.includes("@")) return t.href;
	} catch {}
	throw f("upload_failed", "The custom HTTP upload returned an invalid URL.");
}
function x(e, n) {
	return (async () => {
		if (!e.success || !e.url) throw v(e.error);
		let r = n.protocol === "custom-http" ? b(e.url) : e.url, i = n.protocol === "custom-http" ? {} : e.nip94 ?? {}, a = t(i.x) ? i.x.toLowerCase() : void 0, o = m(i.m) ? i.m : void 0, s = i.dim ?? (n.protocol === "blossom" && e.dimensions ? `${e.dimensions.width}x${e.dimensions.height}` : void 0), c = h(s) ? s : void 0, l = typeof i.blurhash == "string" ? i.blurhash : void 0, u = l && g(l) ? l : void 0;
		return {
			url: r,
			...o ? { mimeType: o } : {},
			...c ? { dim: c } : {},
			...a ? { sha256: a } : {},
			...u ? { blurhash: u } : {}
		};
	})();
}
async function S(e, t) {
	if (n(t), !y(e)) throw f("unsupported_media", "A File is required.");
	let r = p(t);
	if (typeof e.type != "string" || typeof e.size != "number" || !Number.isFinite(e.size) || e.size < 0) throw f("unsupported_media", "A valid File is required.");
	try {
		let i = await s(e, t), o = r.validateMediaFile(i);
		if (!o.isValid) throw f("unsupported_media", o.errorMessage || "This file type or size is not supported.");
		let c = await a();
		n(t);
		let l = await r.uploadFileForHost(i, c, t);
		return n(t), await x(l, c);
	} catch (e) {
		throw n(t), e instanceof i ? f("login_required", "Authentication is required for this upload.", e) : e instanceof Error && [
			"login_required",
			"upload_in_progress",
			"unsupported_media",
			"upload_failed"
		].includes(e.name) ? e : v(e instanceof Error ? e.message : String(e), e);
	}
}
export { S as uploadFileForHost };
