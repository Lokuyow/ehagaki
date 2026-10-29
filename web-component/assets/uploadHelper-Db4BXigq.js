import { d as e } from "./index-client-57Odq85c.js";
import { r as t, t as n } from "./uploadOperation-BVOBq-hD.js";
import "./LoadingPlaceholder-DK5Hrsgb.js";
import { O as r, ft as i, ht as a, v as o } from "./appUtils-CwuZyofa.js";
import { a as s, d as c, i as l, u } from "./swStore.svelte-BKYiFL80.js";
import { a as d, h as f, r as p, u as m } from "./uploadStore.svelte-Cb-DvowP.js";
import { t as h } from "./clipboardUtils-LENkGqCk.js";
import { _ as g, g as _, h as v, k as y, m as b, p as x, r as S, v as C } from "./editorStore.svelte-BWDbxWYk.js";
import { n as w, t as T } from "./uploadAbortUtils-BW0kjn1s.js";
import { a as E, i as ee, r as D } from "./fileUtils-DFi7i2Ee.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/debug.ts
var O = e([]);
function k() {
	return window.location.port === "4173" || window.location.hostname === "localhost";
}
function A() {
	return k();
}
function j(...e) {
	let t = e.map((e) => typeof e == "object" ? JSON.stringify(e) : String(e)).join(" ");
	O.update((e) => [t, ...e].slice(0, 250));
}
typeof window < "u" && (window.__originalConsoleLog = console.log), A();
async function M(e) {
	let t = [];
	e ? t = e : O.subscribe((e) => t = e)();
	let n = t?.join("\n") ?? "";
	n && await h(n, "dev log", navigator, window);
}
typeof window < "u" && (window.showSwUpdateModalDebug = () => {
	l.set(!0), console.log("SW更新ボタンを強制表示しました（設定ボタンランプ＋SettingsDialog内）");
}, window.showSwUpdateInstallingDebug = () => {
	s.set("installing"), console.log("SW更新の installing 状態を強制表示しました");
}, window.showSwUpdateReadyDebug = () => {
	s.set("ready"), console.log("SW更新の ready 状態を強制表示しました");
}, window.resetSwUpdateDebug = () => {
	s.set("idle"), console.log("SW更新デバッグ状態をリセットしました");
}), A() && (window.testDevLog = () => {
	console.log("テスト用ログ出力:", (/* @__PURE__ */ new Date()).toISOString()), j("直接devLogに追加:", Math.random());
}, window.showPostSuccessDebug = () => {
	S.postStatus = {
		...S.postStatus,
		success: !0,
		error: !1,
		message: "post_success",
		completed: !0
	};
}, window.showPostErrorDebug = () => {
	S.postStatus = {
		...S.postStatus,
		success: !1,
		error: !0,
		message: "post_error",
		completed: !1
	};
});
function N(e) {
	A();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/videoCompression/videoCompressionService.ts
var P = class {
	localStorage;
	isUploadAborted;
	context = "VideoCompressionService";
	mediabunnyCompression = null;
	initPromise = null;
	onProgress;
	constructor(e, t = T) {
		this.localStorage = e, this.isUploadAborted = t;
	}
	async ensureInitialized() {
		this.mediabunnyCompression || (this.initPromise ||= import("./mediabunnyCompression-BBN_MI0C.js").then(({ MediaBunnyCompression: e }) => {
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
		let e = r(this.localStorage), t = u[e];
		return c(t) ? t : null;
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
};
// D:/ドキュメント/GitHub/ehagaki/src/lib/tags/imetaTag.ts
async function F(e) {
	if (!e.url) throw Error("url is required for imeta tag");
	if (!e.m) throw Error("m (MIME type) is required for imeta tag");
	let t = e.dim;
	if (!t && e.url) try {
		t = await new Promise((t) => {
			let n = new window.Image();
			n.onload = () => {
				t(`${n.naturalWidth}x${n.naturalHeight}`);
			}, n.onerror = () => t(void 0), n.src = e.url;
		});
	} catch {
		t = void 0;
	}
	let n = {
		content: e.content || "",
		url: e.url,
		m: e.m,
		x: e.x || "",
		ox: e.ox && e.uploadProtocol !== "blossom" ? e.ox : "",
		...e.size === void 0 ? {} : { size: String(e.size) },
		...t === void 0 ? {} : { dim: t },
		...e.blurhash === void 0 ? {} : { blurhash: e.blurhash },
		...e.thumb === void 0 ? {} : { thumb: e.thumb },
		...e.image === void 0 ? {} : { image: e.image },
		...e.summary === void 0 ? {} : { summary: e.summary },
		...e.alt === void 0 ? {} : { alt: e.alt },
		...e.fallback === void 0 ? {} : { fallback: e.fallback }
	};
	e.x && (n.x = e.x);
	let r = (await import("./nip94-BbPZGLby.js")).generateEventTemplate(n), i = [`url ${e.url}`];
	for (let e of r.tags) {
		let [t, ...n] = e;
		if (t === "url") continue;
		let r = n.join(" ").trim();
		r && i.push(`${t} ${r}`);
	}
	return ["imeta", ...i];
}
async function I(e, t = T) {
	try {
		if (t()) return null;
		let n = await new Promise((t, n) => {
			let r = URL.createObjectURL(e), i = new window.Image();
			i.onload = () => {
				URL.revokeObjectURL(r), t(i);
			}, i.onerror = (e) => {
				URL.revokeObjectURL(r), n(e);
			}, i.src = r;
		});
		if (t()) return null;
		let r = document.createElement("canvas");
		r.width = Math.min(n.width, 64), r.height = Math.min(n.height, 64);
		let i = r.getContext("2d");
		if (!i) return null;
		i.drawImage(n, 0, 0, r.width, r.height);
		let a = i.getImageData(0, 0, r.width, r.height), { encode: o } = await import("./esm-CrCI9Pgc.js").then((e) => e.t);
		return o(a.data, a.width, a.height, 4, 4);
	} catch {
		return null;
	}
}
async function L(e) {
	try {
		return URL.createObjectURL(e);
	} catch {
		return null;
	}
}
async function R(e, t) {
	return await I(e, t);
}
function z(e) {
	let t = {};
	return e?.state?.doc && e.state.doc.descendants((e) => {
		e.type?.name === "image" && typeof e.attrs?.src == "string" && typeof e.attrs?.blurhash == "string" && !e.attrs?.isPlaceholder && !e.attrs.src.startsWith("placeholder-") && (t[e.attrs.src] = e.attrs.blurhash);
	}), t;
}
function B(e) {
	let t = {
		jpg: "image/jpeg",
		jpeg: "image/jpeg",
		png: "image/png",
		gif: "image/gif",
		webp: "image/webp",
		avif: "image/avif",
		bmp: "image/bmp",
		svg: "image/svg+xml"
	}, n = e;
	try {
		n = new URL(e).pathname;
	} catch {
		n = e.split(/[?#]/)[0];
	}
	return t[n.split(".").pop()?.toLowerCase() || ""] || "image/jpeg";
}
async function V(e) {
	try {
		let t = await fetch(e);
		if (!t.ok) return null;
		let n = await t.arrayBuffer(), r = await crypto.subtle.digest("SHA-256", n);
		return Array.from(new Uint8Array(r)).map((e) => e.toString(16).padStart(2, "0")).join("");
	} catch (e) {
		return console.warn("Failed to calculate image hash:", e), null;
	}
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/mimeTypeSupport.ts
var H = class {
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
async function U(e, r) {
	let i = async (i, a) => (t(r), new Uint8Array(await n(e.slice(i, i + a).arrayBuffer(), r))), a = (e) => String.fromCharCode(...e);
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
// D:/ドキュメント/GitHub/ehagaki/src/lib/imageCompressionService.ts
var W = "image/webp", G = .8, K = null, q = {
	low: .9,
	medium: .75,
	high: .6
};
function J(e, t, n) {
	return {
		targetWidth: Math.max(1, Math.floor(e * n)),
		targetHeight: Math.max(1, Math.floor(t * n))
	};
}
function Y({ width: e, height: t, maxWidthOrHeight: n, settings: r = a }) {
	let i = Math.max(1, Math.floor(n)), o = Number.isFinite(e) && Number.isFinite(t) && e > 0 && t > 0, s = o ? Math.min(1, i / Math.max(e, t)) : 1, c = {
		maxWidthOrHeight: i,
		...J(o ? e : 1, o ? t : 1, s),
		wasAdjusted: !1
	};
	if (!r.enabled || !o || !Number.isFinite(n) || n <= 0 || r.aspectRatioThreshold <= 0 || r.minShortEdge <= 0 || r.maxMegapixels <= 0) return c;
	let l = Math.max(e, t), u = Math.min(e, t), d = l / u, f = Math.floor(u * s);
	if (d < r.aspectRatioThreshold || f >= r.minShortEdge) return c;
	let p = Math.min(r.minShortEdge, u) / u, m = r.maxMegapixels * 1e6, h = Math.sqrt(m / (e * t)), g = h < p, _ = Math.min(p, h, 1), { targetWidth: v, targetHeight: y } = g ? J(e, t, _) : t >= e ? {
		targetWidth: Math.max(1, Math.floor(e * _)),
		targetHeight: Math.max(1, Math.ceil(t * _))
	} : {
		targetWidth: Math.max(1, Math.ceil(e * _)),
		targetHeight: Math.max(1, Math.floor(t * _))
	}, b = Math.max(v, y);
	return {
		maxWidthOrHeight: b,
		targetWidth: v,
		targetHeight: y,
		wasAdjusted: b !== i
	};
}
async function X() {
	return K ||= import("./browser-image-compression-CFfMWhOP.js"), (await K).default;
}
var te = class {
	mimeSupport;
	localStorage;
	isUploadAborted;
	onProgress;
	constructor(e, t, n = T) {
		this.mimeSupport = e, this.localStorage = t, this.isUploadAborted = n;
	}
	abort() {
		this.onProgress && this.onProgress(0);
	}
	setProgressCallback(e) {
		this.onProgress = e;
	}
	getCompressionLevel() {
		let e = o(this.localStorage);
		return e in i ? e : "medium";
	}
	getCompressionOptions(e = this.getCompressionLevel()) {
		let t = i[e];
		return typeof t == "object" && t && "skip" in t && t.skip ? null : t ? {
			...t,
			preserveExif: !1
		} : null;
	}
	getTargetMaxSizeMB(e, t) {
		let n = q[t];
		if (!n) return;
		let r = Math.floor(Math.min(e * n, e - 1024));
		if (!(r <= 0)) return r / 1048576;
	}
	getWebpQuality(e) {
		let t = typeof e.initialQuality == "number" ? e.initialQuality : G;
		return Math.round(Math.min(Math.max(t, 0), 1) * 100);
	}
	createReadableCanvas(e, t) {
		let n = document.createElement("canvas");
		n.width = e, n.height = t;
		let r = n.getContext("2d", { willReadFrequently: !0 });
		if (!r) throw Error("Failed to create canvas context for WebP transcoding");
		return {
			canvas: n,
			context: r
		};
	}
	async loadImageDimensions(e) {
		if (typeof URL.createObjectURL != "function" || typeof window.Image != "function") return null;
		let t = URL.createObjectURL(e);
		try {
			return await new Promise((e) => {
				let n = new window.Image();
				n.onload = () => {
					let t = n.naturalWidth || n.width, r = n.naturalHeight || n.height;
					e(t > 0 && r > 0 ? {
						width: t,
						height: r
					} : null);
				}, n.onerror = () => e(null), n.src = t;
			});
		} finally {
			URL.revokeObjectURL?.(t);
		}
	}
	async applyExtremeAspectProtection(e, t) {
		let n = t.maxWidthOrHeight;
		if (typeof n != "number") return {
			options: t,
			shouldSkipMaxSizeMB: !1
		};
		let r = await this.loadImageDimensions(e);
		if (!r) return {
			options: t,
			shouldSkipMaxSizeMB: !1
		};
		let i = Y({
			...r,
			maxWidthOrHeight: n
		});
		return i.wasAdjusted ? {
			options: {
				...t,
				maxWidthOrHeight: i.maxWidthOrHeight
			},
			shouldSkipMaxSizeMB: !0
		} : {
			options: t,
			shouldSkipMaxSizeMB: !1
		};
	}
	async loadImageData(e) {
		let t = URL.createObjectURL(e);
		try {
			let e = await new Promise((e, n) => {
				let r = new window.Image();
				r.onload = () => e(r), r.onerror = () => n(/* @__PURE__ */ Error("Failed to load image for WebP transcoding")), r.src = t;
			}), { canvas: n, context: r } = this.createReadableCanvas(e.naturalWidth || e.width, e.naturalHeight || e.height);
			return r.drawImage(e, 0, 0, n.width, n.height), r.getImageData(0, 0, n.width, n.height);
		} finally {
			URL.revokeObjectURL(t);
		}
	}
	async tryTranscodeToWebp(e, t, n) {
		try {
			let r = await this.loadImageData(e), { encode: i } = await import("./webp-COIYsy1H.js"), a = await i(r, { quality: this.getWebpQuality(n) });
			return new File([a], E(t, W), { type: W });
		} catch (e) {
			return console.warn("[ImageCompressionService] WebP fallback transcoding failed:", e), null;
		}
	}
	hasCompressionSettings() {
		return this.getCompressionOptions() !== null;
	}
	async compress(e, t) {
		let n = () => t?.signal?.aborted || this.isUploadAborted();
		if (n()) return {
			file: e,
			wasCompressed: !1,
			aborted: !0
		};
		if (!e.type.startsWith("image/")) return {
			file: e,
			wasCompressed: !1
		};
		if (e.type === "image/gif" || e.size <= 20480) return {
			file: e,
			wasCompressed: !1,
			wasSkipped: !0
		};
		let r = this.getCompressionLevel(), i = this.getCompressionOptions(r);
		if (!i) return {
			file: e,
			wasCompressed: !1,
			wasSkipped: !0
		};
		if (e.type === W) try {
			let r = await U(e, t?.signal);
			if (n()) return {
				file: e,
				wasCompressed: !1,
				aborted: !0
			};
			if (r !== "static") return {
				file: e,
				wasCompressed: !1,
				wasSkipped: !0
			};
		} catch {
			return n() ? {
				file: e,
				wasCompressed: !1,
				aborted: !0
			} : {
				file: e,
				wasCompressed: !1,
				wasSkipped: !0
			};
		}
		let a = i.fileType || e.type, o = this.getTargetMaxSizeMB(e.size, r), { options: s, shouldSkipMaxSizeMB: c } = await this.applyExtremeAspectProtection(e, i);
		if (n()) return {
			file: e,
			wasCompressed: !1,
			aborted: !0
		};
		let l = {
			...s,
			...!c && o ? { maxSizeMB: o } : {},
			alwaysKeepResolution: !0,
			onProgress: (e) => {
				this.onProgress && this.onProgress(Math.round(e * 100));
			}
		};
		if (l.fileType === W && (this.mimeSupport.canEncodeMimeType(W) || (l.fileType = e.type === "image/png" ? "image/png" : "image/jpeg")), n()) return {
			file: e,
			wasCompressed: !1,
			aborted: !0
		};
		t?.signal && (l.signal = t.signal);
		let u = l.fileType || e.type;
		this.mimeSupport.canEncodeMimeType(u) || (u = e.type, delete l.fileType);
		try {
			let r = await (await X())(e, l);
			if (this.isUploadAborted()) return this.onProgress && this.onProgress(0), {
				file: e,
				wasCompressed: !1,
				aborted: !0
			};
			let o = r;
			if (a === W && r.type !== W) {
				let t = await this.tryTranscodeToWebp(r, e.name, i);
				t && (o = t);
			}
			if (n()) return {
				file: e,
				wasCompressed: !1,
				aborted: !0
			};
			if (o.size >= e.size) return {
				file: e,
				wasCompressed: !1
			};
			let s = o.type || l.fileType || u || e.type, c = E(e.name, s), d = new File([o], c, { type: s });
			return t?.signal || N(d), {
				file: d,
				wasCompressed: !0
			};
		} catch (t) {
			return n() ? (this.onProgress && this.onProgress(0), {
				file: e,
				wasCompressed: !1,
				aborted: !0
			}) : (console.warn("[ImageCompressionService] Compression failed:", t), {
				file: e,
				wasCompressed: !1,
				wasSkipped: !0
			});
		}
	}
};
// D:/ドキュメント/GitHub/ehagaki/src/lib/uploadImetaUtils.ts
async function ne({ editor: e, imageServerBlurhashMap: t, imageOxMap: n, imageXMap: r, dependencies: i }) {
	let a = i.extractImageBlurhashMap(e), o = /* @__PURE__ */ new Set([...Object.keys(a), ...Object.keys(t)]);
	return await Promise.all(Array.from(o).map(async (e) => {
		if (!r[e]) {
			let t = await i.calculateImageHash(e);
			t && (r[e] = t);
		}
	})), await Promise.all(Array.from(o).map(async (e) => {
		let o = t[e] ?? a[e], s = i.getMimeTypeFromUrl(e), c = n[e], l = r[e];
		return (await i.createImetaTag({
			url: e,
			m: s,
			blurhash: o,
			ox: c,
			x: l
		})).join(" ");
	}));
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/uploadAbortHandling.ts
function re(e, t) {
	e.galleryCleanup ? _(t, e.galleryCleanup.imageSizeMapStore) : e.currentEditor && y(e.currentEditor, e.devMode);
}
function Z(e, { placeholderMap: t, cleanupPlaceholders: n }) {
	return n && re(e, t), e.notifyAbortProgress?.(e.fileArray.length), e.deferUploadStateClear || e.updateUploadState(!1), {
		placeholderMap: n ? [] : t,
		results: null,
		imageOxMap: {},
		imageXMap: {},
		failedResults: [],
		errorMessage: "Upload aborted by user"
	};
}
function ie(e, t) {
	return e ? { imageSizeMapStore: t } : void 0;
}
function ae({ isUploadAborted: e = T, ...t }) {
	return ({ placeholderMap: n, cleanupPlaceholders: r }) => e() ? Z(t, {
		placeholderMap: n,
		cleanupPlaceholders: r
	}) : null;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/uploadProgressUtils.ts
function Q(e, t = {}) {
	return {
		total: e,
		completed: 0,
		failed: 0,
		aborted: 0,
		inProgress: !1,
		...t
	};
}
function $(e, t) {
	e?.onProgress?.(t);
}
function oe(e, t = () => !0) {
	return {
		onProgress: (n) => {
			t() && (m(n), e?.onProgress?.(n));
		},
		onVideoCompressionProgress: (n) => {
			t() && (f.set(n), e?.onVideoCompressionProgress?.(n));
		},
		onImageCompressionProgress: (n) => {
			t() && (p.set(n), e?.onImageCompressionProgress?.(n));
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/uploadHelper.ts
function se(e, t = e.FileUploadManager, n) {
	return n ?? new t();
}
function ce(e) {
	return e ? e.protocol === "nip96" && e.resolvedUploadUrl || e.serverUrl : "";
}
async function le(e, t, n, r, i, a) {
	if (t.length === 0) return null;
	let o = ce(n), s = D(t);
	return t.length === 1 ? [await (a ? e.uploadFileWithCallbacks(t[0], o, r, i, s[0], n, { signal: a }) : e.uploadFileWithCallbacks(t[0], o, r, i, s[0], n))] : await e.uploadMultipleFilesWithCallbacks(t, o, r, s, n);
}
async function ue(e) {
	let { results: t, placeholderMap: n, galleryMode: r, currentEditor: i, imageOxMap: a, imageXMap: o, imageSizeMapStore: s, calculateImageHash: c, getMimeTypeFromUrl: l, devMode: u } = e;
	if (!t || n.length === 0) return {
		failedResults: [],
		errorMessage: "",
		imageServerBlurhashMap: {}
	};
	if (r) {
		let r = await g(t, n, a, o, s, c, l, u, ...e.isCurrent ? [{
			isCurrent: e.isCurrent,
			useFileMimeType: e.useFileMimeType
		}] : []);
		return {
			failedResults: r.failedResults,
			errorMessage: r.errorMessage,
			imageServerBlurhashMap: {}
		};
	}
	let d = await C(t, n, i, a, o, s, c, u);
	return {
		failedResults: d.failedResults,
		errorMessage: d.errorMessage,
		imageServerBlurhashMap: d.imageServerBlurhashMap
	};
}
async function de({ files: e, currentEditor: t, fileInput: n, uploadCallbacks: r, showUploadError: i, updateUploadState: a, devMode: o, dependencies: s, prepareFiles: c, uploadPreparedFiles: l, fileUploadManager: u, fileUploadManagerInstance: f, deferUploadStateClear: p = !1, isUploadAborted: m, galleryMode: h, signal: g, isCurrent: _ = () => !0, onPlaceholdersCreated: y }) {
	if (!s) throw Error("Upload helper requires explicit runtime dependencies.");
	let S = m ? {
		...s,
		isUploadAborted: m
	} : s, C = m ?? s.isUploadAborted ?? T, E = () => !!g?.aborted || !_() || C(), D = Array.from(e), O = u ?? S.FileUploadManager, k = oe(r, _), A = l ? void 0 : await s.resolveUploadDestination?.(), j = {}, M = {};
	$(k, Q(D.length, { inProgress: !0 })), !g && _() && w();
	let N;
	try {
		N = c ? await c(D, S) : await ee(D, S);
	} catch (e) {
		if (e instanceof Error && e.message === "Upload aborted by user") return Z({
			fileArray: D,
			currentEditor: t,
			updateUploadState: a,
			deferUploadStateClear: p,
			devMode: o,
			notifyAbortProgress: (e) => {
				$(k, Q(e, { aborted: e }));
			}
		}, {
			placeholderMap: [],
			cleanupPlaceholders: !1
		});
		throw e;
	}
	let P = h ?? !d.value, F = ae({
		fileArray: D,
		currentEditor: t,
		updateUploadState: a,
		devMode: o,
		galleryCleanup: ie(P, S.imageSizeMapStore),
		isUploadAborted: E,
		deferUploadStateClear: p,
		notifyAbortProgress: (e) => {
			$(k, Q(e, { aborted: e }));
		}
	}), I = F({
		placeholderMap: [],
		cleanupPlaceholders: !1
	});
	if (I) return I;
	let L = P ? v(D, N, i, s.imageSizeMapStore, O, o) : b(D, N, t, i, s.imageSizeMapStore, O, o);
	if (y?.(L), L.length === 0) return {
		placeholderMap: [],
		results: null,
		imageOxMap: j,
		imageXMap: M,
		failedResults: [],
		errorMessage: ""
	};
	let R = F({
		placeholderMap: L,
		cleanupPlaceholders: !0
	});
	if (R) return R;
	a(!0, ""), await x(L, O, o, E);
	let z = F({
		placeholderMap: L,
		cleanupPlaceholders: !0
	});
	if (z) return z;
	let B = L.map((e) => e.file), V = null, H = se(S, O, f);
	try {
		V = l ? await l(B, L) : await le(H, B, A, k, o, g);
	} catch (e) {
		i(e instanceof Error ? e.message : String(e), 5e3), V = null;
	}
	let U = F({
		placeholderMap: L,
		cleanupPlaceholders: !0
	});
	if (U) return n && _() && (n.value = ""), U;
	await S.tick();
	let W = F({
		placeholderMap: L,
		cleanupPlaceholders: !0
	});
	if (W) return W;
	let G = await ue({
		results: V,
		placeholderMap: L,
		galleryMode: P,
		currentEditor: t,
		imageOxMap: j,
		imageXMap: M,
		imageSizeMapStore: S.imageSizeMapStore,
		calculateImageHash: S.calculateImageHash,
		getMimeTypeFromUrl: S.getMimeTypeFromUrl,
		devMode: o,
		...g ? {
			isCurrent: () => _() && !g.aborted,
			useFileMimeType: h === !0
		} : {}
	}), K = [...G.failedResults], q = G.errorMessage, J = G.imageServerBlurhashMap;
	if (V && L.length > 0 && (L = []), o && t && _() && !g) try {
		await ne({
			editor: t,
			imageServerBlurhashMap: J,
			imageOxMap: j,
			imageXMap: M,
			dependencies: S
		});
	} catch {
		console.warn("[preview] [dev] imetaタグ生成失敗", {
			stage: "imeta-tag",
			reason: "unexpected"
		});
	}
	return n && _() && (n.value = ""), p || a(!1), {
		placeholderMap: L,
		results: V,
		imageOxMap: j,
		imageXMap: M,
		failedResults: K,
		errorMessage: q
	};
}
function fe(e, t = 3e3, n) {
	let r = n.keepUploading ?? !1;
	n.updateUploadState(r, e), setTimeout(() => n.setUploadErrorMessage(""), t);
}
export { H as a, L as c, B as d, P as f, A as h, U as i, z as l, O as m, de as n, V as o, M as p, te as r, F as s, fe as t, R as u };
