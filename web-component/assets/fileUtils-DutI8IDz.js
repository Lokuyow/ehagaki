import { t as e } from "./mediaNodeUtils-DykrJwDv.js";
import { t } from "./uploadAbortUtils-BPjD1mwB.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/fileUtils.ts
async function n(e, n = window.crypto.subtle, r = t) {
	if (r()) throw Error("Upload aborted by user");
	let i = await e.arrayBuffer(), a = await n.digest("SHA-256", i);
	return Array.from(new Uint8Array(a)).map((e) => e.toString(16).padStart(2, "0")).join("");
}
async function r(e, t, r) {
	try {
		return await n(e, t, r);
	} catch {
		return;
	}
}
async function i(t) {
	return new Promise((n) => {
		if (!t.type.startsWith("image/")) {
			n(null);
			return;
		}
		let r = new Image(), i = URL.createObjectURL(t);
		r.onload = () => {
			try {
				let t = e(r.naturalWidth, r.naturalHeight);
				URL.revokeObjectURL(i), n(t);
			} catch (e) {
				console.error("Failed to calculate image display size:", e), URL.revokeObjectURL(i), n(null);
			}
		}, r.onerror = () => {
			URL.revokeObjectURL(i), n(null);
		}, r.src = i;
	});
}
function a(e, t) {
	let n = {
		"image/webp": ".webp",
		"image/jpeg": ".jpg",
		"image/png": ".png",
		"image/gif": ".gif",
		"image/avif": ".avif",
		"image/bmp": ".bmp"
	}[t];
	return n ? `${e.replace(/\.[^.]+$/, "")}${n}` : e;
}
async function o(e, n) {
	let i = [], a = n.isUploadAborted ?? t;
	if (a()) throw Error("Upload aborted by user");
	for (let t = 0; t < e.length; t++) {
		let o = e[t], [s, c] = await Promise.all([r(o, n.crypto, a), n.getImageDimensions(o)]);
		i.push({
			file: o,
			index: t,
			ox: s,
			dimensions: c ?? void 0
		});
	}
	return i;
}
function s(e) {
	return e.map((e) => ({
		caption: e.name,
		expiration: "",
		size: e.size,
		alt: e.name,
		media_type: void 0,
		content_type: e.type || "",
		no_transform: "true"
	}));
}
export { a, o as i, i as n, s as r, n as t };
