import { d as e } from "./index-client-Bdka-Daw.js";
import "./LoadingPlaceholder-j1_vRYno.js";
import { O as t, ft as n, ht as r, v as i } from "./appUtils-Bsk0mFqn.js";
import { a, d as o, i as s, u as c } from "./swStore.svelte-BkcXmAWP.js";
import { a as l, h as u, r as d, u as f } from "./uploadStore.svelte-CqQfA1h_.js";
import { t as p } from "./clipboardUtils-a0DTSm8D.js";
import { _ as m, g as h, h as g, k as _, m as v, p as y, r as b, v as x } from "./editorStore.svelte-3FSqdFUX.js";
import { n as ee, t as S } from "./uploadAbortUtils-BPjD1mwB.js";
import { a as C, i as w, r as T } from "./fileUtils-D6N6n-4t.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/debug.ts
var E = e([]);
function D() {
	return window.location.port === "4173" || window.location.hostname === "localhost";
}
function O() {
	return D();
}
function k(...e) {
	let t = e.map((e) => typeof e == "object" ? JSON.stringify(e) : String(e)).join(" ");
	E.update((e) => [t, ...e].slice(0, 250));
}
typeof window < "u" && (window.__originalConsoleLog = console.log), O();
async function A(e) {
	let t = [];
	e ? t = e : E.subscribe((e) => t = e)();
	let n = t?.join("\n") ?? "";
	n && await p(n, "dev log", navigator, window);
}
typeof window < "u" && (window.showSwUpdateModalDebug = () => {
	s.set(!0), console.log("SW更新ボタンを強制表示しました（設定ボタンランプ＋SettingsDialog内）");
}, window.showSwUpdateInstallingDebug = () => {
	a.set("installing"), console.log("SW更新の installing 状態を強制表示しました");
}, window.showSwUpdateReadyDebug = () => {
	a.set("ready"), console.log("SW更新の ready 状態を強制表示しました");
}, window.resetSwUpdateDebug = () => {
	a.set("idle"), console.log("SW更新デバッグ状態をリセットしました");
}), O() && (window.testDevLog = () => {
	console.log("テスト用ログ出力:", (/* @__PURE__ */ new Date()).toISOString()), k("直接devLogに追加:", Math.random());
}, window.showPostSuccessDebug = () => {
	b.postStatus = {
		...b.postStatus,
		success: !0,
		error: !1,
		message: "post_success",
		completed: !0
	};
}, window.showPostErrorDebug = () => {
	b.postStatus = {
		...b.postStatus,
		success: !1,
		error: !0,
		message: "post_error",
		completed: !1
	};
});
function j(e) {
	O();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/videoCompression/videoCompressionService.ts
var M = class {
	localStorage;
	isUploadAborted;
	context = "VideoCompressionService";
	mediabunnyCompression = null;
	initPromise = null;
	onProgress;
	constructor(e, t = S) {
		this.localStorage = e, this.isUploadAborted = t;
	}
	async ensureInitialized() {
		this.mediabunnyCompression || (this.initPromise ||= import("./mediabunnyCompression-DnKS3BCK.js").then(({ MediaBunnyCompression: e }) => {
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
		let e = t(this.localStorage), n = c[e];
		return o(n) ? n : null;
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
async function N(e) {
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
async function P(e, t = S) {
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
async function F(e) {
	try {
		return URL.createObjectURL(e);
	} catch {
		return null;
	}
}
async function I(e, t) {
	return await P(e, t);
}
function L(e) {
	let t = {};
	return e?.state?.doc && e.state.doc.descendants((e) => {
		e.type?.name === "image" && typeof e.attrs?.src == "string" && typeof e.attrs?.blurhash == "string" && !e.attrs?.isPlaceholder && !e.attrs.src.startsWith("placeholder-") && (t[e.attrs.src] = e.attrs.blurhash);
	}), t;
}
function R(e) {
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
async function z(e) {
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
var B = class {
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
}, V = "image/webp", H = .8, U = null, W = {
	low: .9,
	medium: .75,
	high: .6
};
function G(e, t, n) {
	return {
		targetWidth: Math.max(1, Math.floor(e * n)),
		targetHeight: Math.max(1, Math.floor(t * n))
	};
}
function K({ width: e, height: t, maxWidthOrHeight: n, settings: i = r }) {
	let a = Math.max(1, Math.floor(n)), o = Number.isFinite(e) && Number.isFinite(t) && e > 0 && t > 0, s = o ? Math.min(1, a / Math.max(e, t)) : 1, c = {
		maxWidthOrHeight: a,
		...G(o ? e : 1, o ? t : 1, s),
		wasAdjusted: !1
	};
	if (!i.enabled || !o || !Number.isFinite(n) || n <= 0 || i.aspectRatioThreshold <= 0 || i.minShortEdge <= 0 || i.maxMegapixels <= 0) return c;
	let l = Math.max(e, t), u = Math.min(e, t), d = l / u, f = Math.floor(u * s);
	if (d < i.aspectRatioThreshold || f >= i.minShortEdge) return c;
	let p = Math.min(i.minShortEdge, u) / u, m = i.maxMegapixels * 1e6, h = Math.sqrt(m / (e * t)), g = h < p, _ = Math.min(p, h, 1), { targetWidth: v, targetHeight: y } = g ? G(e, t, _) : t >= e ? {
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
		wasAdjusted: b !== a
	};
}
async function q() {
	return U ||= import("./browser-image-compression-CFfMWhOP.js"), (await U).default;
}
var J = class {
	mimeSupport;
	localStorage;
	isUploadAborted;
	onProgress;
	constructor(e, t, n = S) {
		this.mimeSupport = e, this.localStorage = t, this.isUploadAborted = n;
	}
	abort() {
		this.onProgress && this.onProgress(0);
	}
	setProgressCallback(e) {
		this.onProgress = e;
	}
	getCompressionLevel() {
		let e = i(this.localStorage);
		return e in n ? e : "medium";
	}
	getCompressionOptions(e = this.getCompressionLevel()) {
		let t = n[e];
		return typeof t == "object" && t && "skip" in t && t.skip ? null : t ? {
			...t,
			preserveExif: !1
		} : null;
	}
	getTargetMaxSizeMB(e, t) {
		let n = W[t];
		if (!n) return;
		let r = Math.floor(Math.min(e * n, e - 1024));
		if (!(r <= 0)) return r / 1048576;
	}
	getWebpQuality(e) {
		let t = typeof e.initialQuality == "number" ? e.initialQuality : H;
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
		let i = K({
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
			return new File([a], C(t, V), { type: V });
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
		if (e.size <= 20480) return {
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
		if (l.fileType === V && (this.mimeSupport.canEncodeMimeType(V) || (l.fileType = e.type === "image/png" ? "image/png" : "image/jpeg")), n()) return {
			file: e,
			wasCompressed: !1,
			aborted: !0
		};
		t?.signal && (l.signal = t.signal);
		let u = l.fileType || e.type;
		this.mimeSupport.canEncodeMimeType(u) || (u = e.type, delete l.fileType);
		try {
			let r = await (await q())(e, l);
			if (this.isUploadAborted()) return this.onProgress && this.onProgress(0), {
				file: e,
				wasCompressed: !1,
				aborted: !0
			};
			let o = r;
			if (a === V && r.type !== V) {
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
			let s = o.type || l.fileType || u || e.type, c = C(e.name, s), d = new File([o], c, { type: s });
			return t?.signal || j(d), {
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
async function te({ editor: e, imageServerBlurhashMap: t, imageOxMap: n, imageXMap: r, dependencies: i }) {
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
function ne(e, t) {
	e.galleryCleanup ? h(t, e.galleryCleanup.imageSizeMapStore) : e.currentEditor && _(e.currentEditor, e.devMode);
}
function Y(e, { placeholderMap: t, cleanupPlaceholders: n }) {
	return n && ne(e, t), e.notifyAbortProgress?.(e.fileArray.length), e.deferUploadStateClear || e.updateUploadState(!1), {
		placeholderMap: n ? [] : t,
		results: null,
		imageOxMap: {},
		imageXMap: {},
		failedResults: [],
		errorMessage: "Upload aborted by user"
	};
}
function X(e, t) {
	return e ? { imageSizeMapStore: t } : void 0;
}
function re({ isUploadAborted: e = S, ...t }) {
	return ({ placeholderMap: n, cleanupPlaceholders: r }) => e() ? Y(t, {
		placeholderMap: n,
		cleanupPlaceholders: r
	}) : null;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/uploadProgressUtils.ts
function Z(e, t = {}) {
	return {
		total: e,
		completed: 0,
		failed: 0,
		aborted: 0,
		inProgress: !1,
		...t
	};
}
function Q(e, t) {
	e?.onProgress?.(t);
}
function $(e, t = () => !0) {
	return {
		onProgress: (n) => {
			t() && (f(n), e?.onProgress?.(n));
		},
		onVideoCompressionProgress: (n) => {
			t() && (u.set(n), e?.onVideoCompressionProgress?.(n));
		},
		onImageCompressionProgress: (n) => {
			t() && (d.set(n), e?.onImageCompressionProgress?.(n));
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/uploadHelper.ts
function ie(e, t = e.FileUploadManager, n) {
	return n ?? new t();
}
function ae(e) {
	return e ? e.protocol === "nip96" && e.resolvedUploadUrl || e.serverUrl : "";
}
async function oe(e, t, n, r, i, a) {
	if (t.length === 0) return null;
	let o = ae(n), s = T(t);
	return t.length === 1 ? [await (a ? e.uploadFileWithCallbacks(t[0], o, r, i, s[0], n, { signal: a }) : e.uploadFileWithCallbacks(t[0], o, r, i, s[0], n))] : await e.uploadMultipleFilesWithCallbacks(t, o, r, s, n);
}
async function se(e) {
	let { results: t, placeholderMap: n, galleryMode: r, currentEditor: i, imageOxMap: a, imageXMap: o, imageSizeMapStore: s, calculateImageHash: c, getMimeTypeFromUrl: l, devMode: u } = e;
	if (!t || n.length === 0) return {
		failedResults: [],
		errorMessage: "",
		imageServerBlurhashMap: {}
	};
	if (r) {
		let r = await m(t, n, a, o, s, c, l, u, ...e.isCurrent ? [{
			isCurrent: e.isCurrent,
			useFileMimeType: e.useFileMimeType
		}] : []);
		return {
			failedResults: r.failedResults,
			errorMessage: r.errorMessage,
			imageServerBlurhashMap: {}
		};
	}
	let d = await x(t, n, i, a, o, s, c, u);
	return {
		failedResults: d.failedResults,
		errorMessage: d.errorMessage,
		imageServerBlurhashMap: d.imageServerBlurhashMap
	};
}
async function ce({ files: e, currentEditor: t, fileInput: n, uploadCallbacks: r, showUploadError: i, updateUploadState: a, devMode: o, dependencies: s, prepareFiles: c, uploadPreparedFiles: u, fileUploadManager: d, fileUploadManagerInstance: f, deferUploadStateClear: p = !1, isUploadAborted: m, galleryMode: h, signal: _, isCurrent: b = () => !0, onPlaceholdersCreated: x }) {
	if (!s) throw Error("Upload helper requires explicit runtime dependencies.");
	let C = m ? {
		...s,
		isUploadAborted: m
	} : s, T = m ?? s.isUploadAborted ?? S, E = () => !!_?.aborted || !b() || T(), D = Array.from(e), O = d ?? C.FileUploadManager, k = $(r, b), A = u ? void 0 : await s.resolveUploadDestination?.(), j = {}, M = {};
	Q(k, Z(D.length, { inProgress: !0 })), !_ && b() && ee();
	let N;
	try {
		N = c ? await c(D, C) : await w(D, C);
	} catch (e) {
		if (e instanceof Error && e.message === "Upload aborted by user") return Y({
			fileArray: D,
			currentEditor: t,
			updateUploadState: a,
			deferUploadStateClear: p,
			devMode: o,
			notifyAbortProgress: (e) => {
				Q(k, Z(e, { aborted: e }));
			}
		}, {
			placeholderMap: [],
			cleanupPlaceholders: !1
		});
		throw e;
	}
	let P = h ?? !l.value, F = re({
		fileArray: D,
		currentEditor: t,
		updateUploadState: a,
		devMode: o,
		galleryCleanup: X(P, C.imageSizeMapStore),
		isUploadAborted: E,
		deferUploadStateClear: p,
		notifyAbortProgress: (e) => {
			Q(k, Z(e, { aborted: e }));
		}
	}), I = F({
		placeholderMap: [],
		cleanupPlaceholders: !1
	});
	if (I) return I;
	let L = P ? g(D, N, i, s.imageSizeMapStore, O, o) : v(D, N, t, i, s.imageSizeMapStore, O, o);
	if (x?.(L), L.length === 0) return {
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
	a(!0, ""), await y(L, O, o, E);
	let z = F({
		placeholderMap: L,
		cleanupPlaceholders: !0
	});
	if (z) return z;
	let B = L.map((e) => e.file), V = null, H = ie(C, O, f);
	try {
		V = u ? await u(B, L) : await oe(H, B, A, k, o, _);
	} catch (e) {
		i(e instanceof Error ? e.message : String(e), 5e3), V = null;
	}
	let U = F({
		placeholderMap: L,
		cleanupPlaceholders: !0
	});
	if (U) return n && b() && (n.value = ""), U;
	await C.tick();
	let W = F({
		placeholderMap: L,
		cleanupPlaceholders: !0
	});
	if (W) return W;
	let G = await se({
		results: V,
		placeholderMap: L,
		galleryMode: P,
		currentEditor: t,
		imageOxMap: j,
		imageXMap: M,
		imageSizeMapStore: C.imageSizeMapStore,
		calculateImageHash: C.calculateImageHash,
		getMimeTypeFromUrl: C.getMimeTypeFromUrl,
		devMode: o,
		..._ ? {
			isCurrent: () => b() && !_.aborted,
			useFileMimeType: h === !0
		} : {}
	}), K = [...G.failedResults], q = G.errorMessage, J = G.imageServerBlurhashMap;
	if (V && L.length > 0 && (L = []), o && t && b() && !_) try {
		await te({
			editor: t,
			imageServerBlurhashMap: J,
			imageOxMap: j,
			imageXMap: M,
			dependencies: C
		});
	} catch {
		console.warn("[preview] [dev] imetaタグ生成失敗", {
			stage: "imeta-tag",
			reason: "unexpected"
		});
	}
	return n && b() && (n.value = ""), p || a(!1), {
		placeholderMap: L,
		results: V,
		imageOxMap: j,
		imageXMap: M,
		failedResults: K,
		errorMessage: q
	};
}
function le(e, t = 3e3, n) {
	let r = n.keepUploading ?? !1;
	n.updateUploadState(r, e), setTimeout(() => n.setUploadErrorMessage(""), t);
}
export { z as a, L as c, M as d, A as f, B as i, I as l, O as m, ce as n, N as o, E as p, J as r, F as s, le as t, R as u };
