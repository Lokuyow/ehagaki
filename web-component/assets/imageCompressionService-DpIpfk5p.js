import { d as e } from "./index-client-DEFG3Gqk.js";
import { n as t, r as n, t as r } from "./uploadOperation-BVOBq-hD.js";
import "./LoadingPlaceholder-YrD8D_td.js";
import { a as i, d as a, i as o, u as s } from "./swStore.svelte-CCiAqPOi.js";
import { C as c, nt as l, ot as u, p as d } from "./appUtils-B3-zUpkb.js";
import { t as f } from "./clipboardUtils-CSGkJuUA.js";
import { E as p, r as m } from "./editorStore.svelte-Q7oo5cQe.js";
import { t as h } from "./uploadAbortUtils-F30ArOJg.js";
import { a as g } from "./fileUtils-nRfpyUX-.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/debug.ts
var _ = e([]);
function v() {
	return window.location.port === "4173" || window.location.hostname === "localhost";
}
function y() {
	return v();
}
function b(...e) {
	let t = e.map((e) => typeof e == "object" ? JSON.stringify(e) : String(e)).join(" ");
	_.update((e) => [t, ...e].slice(0, 250));
}
typeof window < "u" && (window.__originalConsoleLog = console.log), y();
async function x(e) {
	let t = [];
	e ? t = e : _.subscribe((e) => t = e)();
	let n = t?.join("\n") ?? "";
	n && await f(n, "dev log", navigator, window);
}
typeof window < "u" && (window.showSwUpdateModalDebug = () => {
	o.set(!0), console.log("SW更新ボタンを強制表示しました（設定ボタンランプ＋SettingsDialog内）");
}, window.showSwUpdateInstallingDebug = () => {
	i.set("installing"), console.log("SW更新の installing 状態を強制表示しました");
}, window.showSwUpdateReadyDebug = () => {
	i.set("ready"), console.log("SW更新の ready 状態を強制表示しました");
}, window.resetSwUpdateDebug = () => {
	i.set("idle"), console.log("SW更新デバッグ状態をリセットしました");
}), y() && (window.testDevLog = () => {
	console.log("テスト用ログ出力:", (/* @__PURE__ */ new Date()).toISOString()), b("直接devLogに追加:", Math.random());
}, window.showPostSuccessDebug = () => {
	m.postStatus = {
		...m.postStatus,
		success: !0,
		error: !1,
		message: "post_success",
		completed: !0
	};
}, window.showPostErrorDebug = () => {
	m.postStatus = {
		...m.postStatus,
		success: !1,
		error: !0,
		message: "post_error",
		completed: !1
	};
});
function S(e) {
	y();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/videoCompression/videoCompressionService.ts
var C = class {
	localStorage;
	isUploadAborted;
	context = "VideoCompressionService";
	mediabunnyCompression = null;
	initPromise = null;
	onProgress;
	constructor(e, t = h) {
		this.localStorage = e, this.isUploadAborted = t;
	}
	async ensureInitialized() {
		this.mediabunnyCompression || (this.initPromise ||= import("./mediabunnyCompression-BImoCv1_.js").then(({ MediaBunnyCompression: e }) => {
			this.mediabunnyCompression = new e(this.isUploadAborted), this.mediabunnyCompression.setProgressCallback(this.onProgress);
		}), await this.initPromise);
	}
	abort() {
		this.onProgress?.(0), this.mediabunnyCompression?.abort();
	}
	setProgressCallback(e) {
		this.onProgress = e, this.mediabunnyCompression?.setProgressCallback(e);
	}
	getCompressionOptions() {
		let e = c(this.localStorage), t = s[e];
		return a(t) ? t : null;
	}
	hasCompressionSettings() {
		return this.getCompressionOptions() !== null;
	}
	async compress(e, t) {
		let n = t?.signal;
		if (n?.aborted) return {
			file: e,
			wasCompressed: !1,
			wasSkipped: !0,
			aborted: !0
		};
		if (!e.type.startsWith("video/")) return {
			file: e,
			wasCompressed: !1
		};
		if (e.size <= 204800) return {
			file: e,
			wasCompressed: !1,
			wasSkipped: !0
		};
		let r = this.getCompressionOptions();
		if (!r) return {
			file: e,
			wasCompressed: !1,
			wasSkipped: !0
		};
		if (this.isUploadAborted()) return this.onProgress?.(0), {
			file: e,
			wasCompressed: !1,
			wasSkipped: !0,
			aborted: !0
		};
		let i = () => this.abort();
		n?.addEventListener("abort", i, { once: !0 });
		try {
			if (await this.ensureInitialized(), n?.aborted || this.isUploadAborted()) return {
				file: e,
				wasCompressed: !1,
				wasSkipped: !0,
				aborted: !0
			};
			let t = this.mediabunnyCompression;
			if (!t) throw Error("MediaBunny compression did not initialize.");
			return await t.compress(e, r);
		} catch (t) {
			return n?.aborted || this.isUploadAborted() ? {
				file: e,
				wasCompressed: !1,
				wasSkipped: !0,
				aborted: !0
			} : (console.error("[VideoCompressionService] Compression failed:", t), {
				file: e,
				wasCompressed: !1,
				wasSkipped: !0
			});
		} finally {
			n?.removeEventListener("abort", i);
		}
	}
	async cleanup() {
		await this.mediabunnyCompression?.cleanup();
	}
}, w = class {
	document;
	mimeSupportCache = {};
	webpQualitySupport;
	constructor(e) {
		this.document = e;
	}
	async canEncodeWebpWithQuality() {
		if (this.webpQualitySupport !== void 0) return this.webpQualitySupport;
		try {
			if (!this.document) return this.webpQualitySupport = !1;
			let e = this.document.createElement("canvas");
			e.width = 2, e.height = 2;
			let t = e.getContext("2d");
			if (!t) return this.webpQualitySupport = !1;
			t.fillStyle = "#f00", t.fillRect(0, 0, 2, 2);
			let n = e.toDataURL("image/webp", .2), r = e.toDataURL("image/webp", .9), i = n.startsWith("data:image/webp") && r.startsWith("data:image/webp") && n.length !== r.length;
			return this.webpQualitySupport = i, i;
		} catch {
			return this.webpQualitySupport = !1, !1;
		}
	}
	canEncodeMimeType(e) {
		if (!e) return !1;
		if (e in this.mimeSupportCache) return this.mimeSupportCache[e];
		try {
			if (!this.document) return this.mimeSupportCache[e] = !1;
			let t = this.document.createElement("canvas");
			t.width = 2, t.height = 2;
			let n = t.getContext("2d");
			if (!n) return this.mimeSupportCache[e] = !1;
			n.fillStyle = "#000", n.fillRect(0, 0, 2, 2);
			let r = t.toDataURL(e), i = typeof r == "string" && r.startsWith(`data:${e}`);
			return this.mimeSupportCache[e] = i, i;
		} catch {
			return this.mimeSupportCache[e] = !1, !1;
		}
	}
};
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/webpContainer.ts
async function T(e, t) {
	let i = async (i, a) => (n(t), new Uint8Array(await r(e.slice(i, i + a).arrayBuffer(), t))), a = (e) => String.fromCharCode(...e);
	if (e.size < 20) return "invalid";
	let o = await i(0, 12);
	if (a(o.subarray(0, 4)) !== "RIFF" || a(o.subarray(8)) !== "WEBP" || new DataView(o.buffer).getUint32(4, !0) + 8 !== e.size) return "invalid";
	let s = 12, c = !1, l = !1, u = 0, d = !1;
	for (; s + 8 <= e.size;) {
		let t = await i(s, 8), n = a(t.subarray(0, 4)), r = new DataView(t.buffer).getUint32(4, !0), o = s + 8 + r + r % 2;
		if (o > e.size) return "invalid";
		if (n === "VP8X") {
			if (s !== 12 || r !== 10) return "invalid";
			c = !!((await i(s + 8, 1))[0] & 2);
		} else if (n === "ANIM") {
			if (!c || l || u || r !== 6) return "invalid";
			l = !0;
		} else if (n === "ANMF") {
			if (!c || !l || r < 24) return "invalid";
			u++;
		} else if (n === "VP8 " || n === "VP8L") {
			if (c || !r) return "invalid";
			d = !0;
		}
		s = o;
	}
	return s === e.size ? c ? l && u > 0 ? "animated" : "invalid" : d ? "static" : "invalid" : "invalid";
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/imageWebpWorkerEncoder.ts
function E() {
	return typeof Worker > "u" ? null : () => new Worker(new URL(
		/* @vite-ignore */
		new URL("imageWebpEncodeWorker-B7kEj3hA.js", import.meta.url).href,
		"" + import.meta.url
	), { type: "module" });
}
function D(e, n, r, i) {
	return new Promise((a, o) => {
		if (i?.aborted) {
			o(t());
			return;
		}
		let s;
		try {
			s = e();
		} catch (e) {
			o(e);
			return;
		}
		let c = !1, l = (e) => {
			c || (c = !0, s.onmessage = null, s.onerror = null, s.onmessageerror = null, i?.removeEventListener("abort", u), s.terminate(), e());
		}, u = () => l(() => o(t()));
		s.onmessage = (e) => {
			let t = e.data;
			t?.type === "complete" ? l(() => a(t.bytes)) : l(() => o(Error(t?.type === "error" ? t.message : "image_webp_encode_worker_failed")));
		}, s.onerror = (e) => {
			e.preventDefault?.(), l(() => o(/* @__PURE__ */ Error("image_webp_encode_worker_unavailable")));
		}, s.onmessageerror = () => {
			l(() => o(/* @__PURE__ */ Error("image_webp_encode_worker_failed")));
		}, i?.addEventListener("abort", u, { once: !0 });
		let d = n.data.buffer, f = {
			type: "encode",
			pixels: d,
			width: n.width,
			height: n.height,
			quality: r
		};
		try {
			s.postMessage(f, [d]);
		} catch (e) {
			l(() => o(e));
		}
	});
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/imageCompressionService.ts
function O(e, t, n) {
	if (![
		e,
		t,
		n
	].every((e) => Number.isFinite(e) && e > 0)) throw Error("Invalid image dimensions");
	let r = Math.min(1, n / Math.min(e, t), Math.sqrt(u.maxPixels / (e * t)), u.maxLongEdge / Math.max(e, t));
	return {
		width: Math.max(1, Math.floor(e * r)),
		height: Math.max(1, Math.floor(t * r))
	};
}
var k = class {
	mimeSupport;
	localStorage;
	isUploadAborted;
	webpWorkerFactory;
	onProgress;
	constructor(e, t, n = h, r = E()) {
		this.mimeSupport = e, this.localStorage = t, this.isUploadAborted = n, this.webpWorkerFactory = r;
	}
	abort() {
		this.onProgress?.(0);
	}
	setProgressCallback(e) {
		this.onProgress = e;
	}
	getCompressionOptions() {
		let e = d(this.localStorage), t = l[e] ?? l.medium;
		return "skip" in t ? null : t;
	}
	hasCompressionSettings() {
		return this.getCompressionOptions() !== null;
	}
	async compress(e, n) {
		let i = () => !!n?.signal?.aborted || this.isUploadAborted(), a = () => {
			if (i()) throw t();
		}, o = {
			file: e,
			wasCompressed: !1
		};
		if (i()) return {
			...o,
			aborted: !0
		};
		if (!e.type.startsWith("image/")) return o;
		let s = this.getCompressionOptions();
		if (!s || e.type === "image/gif" || e.type === "image/avif" || e.size <= 20480) return {
			...o,
			wasSkipped: !0
		};
		let c, l, u;
		try {
			if (e.type === "image/webp") {
				let t = await T(e, n?.signal);
				if (a(), t !== "static") return {
					...o,
					wasSkipped: !0
				};
			}
			this.onProgress?.(5), a(), c = new window.Image();
			let t = new Promise((e, t) => {
				c.onload = () => e(), c.onerror = () => t(/* @__PURE__ */ Error("Failed to decode image"));
			});
			l = URL.createObjectURL(e), c.src = l, await r(t, n?.signal), a(), await r(p(c), n?.signal), a();
			let i = O(c.naturalWidth, c.naturalHeight, s.maxShortEdge);
			u = document.createElement("canvas"), u.width = i.width, u.height = i.height;
			let d = u.getContext("2d");
			if (!d) throw Error("Failed to create image canvas");
			d.imageSmoothingEnabled = !0, d.imageSmoothingQuality = "high", d.drawImage(c, 0, 0, i.width, i.height), this.onProgress?.(40), a();
			let f = async (e) => {
				try {
					let t = await r(new Promise((t) => {
						u.toBlob(t, e, s.quality);
					}), n?.signal);
					return a(), t?.size && t.type === e ? t : null;
				} catch {
					return a(), null;
				}
			}, m = this.mimeSupport.canEncodeMimeType("image/webp") ? await f("image/webp") : null;
			if (!m) try {
				let e = Math.round(s.quality * 100), t = () => d.getImageData(0, 0, u.width, u.height), i;
				if (this.webpWorkerFactory) try {
					i = await D(this.webpWorkerFactory, t(), e, n?.signal);
				} catch {
					a();
				}
				if (a(), !i) {
					let { encode: o } = await import("./webp-COIYsy1H.js");
					a(), i = await r(o(t(), { quality: e }), n?.signal);
				}
				a(), i.byteLength && (m = new Blob([i], { type: "image/webp" }));
			} catch (e) {
				a(), console.warn("[ImageCompressionService] WebP fallback failed:", e);
			}
			if (a(), !m) {
				let t = e.type === "image/png" ? "image/png" : "image/jpeg";
				t === "image/jpeg" && (d.globalCompositeOperation = "destination-over", d.fillStyle = "#fff", d.fillRect(0, 0, u.width, u.height)), m = await f(t);
			}
			if (a(), !m) throw Error("Failed to encode image");
			if (this.onProgress?.(100), a(), m.size >= e.size) return o;
			let h = new File([m], g(e.name, m.type), { type: m.type });
			return n?.signal || S(h), {
				file: h,
				wasCompressed: !0
			};
		} catch (e) {
			return i() ? (this.onProgress?.(0), {
				...o,
				aborted: !0
			}) : (console.warn("[ImageCompressionService] Compression failed:", e), {
				...o,
				wasSkipped: !0
			});
		} finally {
			c && (c.onload = null, c.onerror = null, c.src = ""), l && URL.revokeObjectURL(l), u && (u.width = 0, u.height = 0);
		}
	}
};
export { x as a, C as i, T as n, _ as o, w as r, y as s, k as t };
