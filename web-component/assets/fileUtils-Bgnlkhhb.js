import { t as e } from "./mediaNodeUtils-DBvcDde_.js";
import { t } from "./uploadAbortUtils-BihweJ8o.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/serviceWorkerRequest.ts
function n(e, t, n) {
	let r = new MessageChannel(), i = r.port1;
	return new Promise((a) => {
		let o = !1, s, c = (e) => {
			o || (o = !0, clearTimeout(s), i.onmessage = null, i.onmessageerror = null, i.close?.(), a(e));
		};
		s = setTimeout(() => c({ status: "timeout" }), n), i.onmessage = (e) => c({
			status: "reply",
			data: e.data
		}), i.onmessageerror = (e) => c({
			status: "error",
			error: e
		});
		try {
			e.postMessage(t, [r.port2]);
		} catch (e) {
			c({
				status: "error",
				error: e
			});
		}
	});
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/fileUtils.ts
async function r(e, n = window.crypto.subtle, r = t) {
	if (r()) throw Error("Upload aborted by user");
	let i = await e.arrayBuffer(), a = await n.digest("SHA-256", i);
	return Array.from(new Uint8Array(a)).map((e) => e.toString(16).padStart(2, "0")).join("");
}
async function i(e, t, n) {
	try {
		return await r(e, t, n);
	} catch {
		return;
	}
}
async function a(t) {
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
function o(e, t) {
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
async function s(e, n) {
	let r = [], a = n.isUploadAborted ?? t;
	if (a()) throw Error("Upload aborted by user");
	for (let t = 0; t < e.length; t++) {
		let o = e[t], [s, c] = await Promise.all([i(o, n.crypto, a), n.getImageDimensions(o)]);
		r.push({
			file: o,
			index: t,
			ox: s,
			dimensions: c ?? void 0
		});
	}
	return r;
}
function c(e) {
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
export { o as a, s as i, a as n, n as o, c as r, r as t };
