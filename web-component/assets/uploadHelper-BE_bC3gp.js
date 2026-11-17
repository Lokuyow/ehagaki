import { d as e } from "./index-client-XkLzkVYC.js";
import { n as t, r as n, t as r } from "./uploadOperation-BVOBq-hD.js";
import "./LoadingPlaceholder-lit91akO.js";
import { D as i, _ as a, ht as o, yt as s } from "./appUtils-BRia-Jm6.js";
import { a as c, d as l, i as u, u as d } from "./swStore.svelte-DT3Nz4bz.js";
import { a as f, h as p, r as m, u as h } from "./uploadStore.svelte-D-WzsUY_.js";
import { t as g } from "./clipboardUtils-DL4u_EPs.js";
import { A as _, _ as v, g as y, h as b, m as x, p as S, r as C, v as w } from "./editorStore.svelte-B10YjLRj.js";
import { n as T, t as E } from "./uploadAbortUtils-BihweJ8o.js";
import { a as D, i as O, r as k } from "./fileUtils-Bgnlkhhb.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/debug.ts
var A = e([]);
function j() {
	return window.location.port === "4173" || window.location.hostname === "localhost";
}
function M() {
	return j();
}
function N(...e) {
	let t = e.map((e) => typeof e == "object" ? JSON.stringify(e) : String(e)).join(" ");
	A.update((e) => [t, ...e].slice(0, 250));
}
typeof window < "u" && (window.__originalConsoleLog = console.log), M();
async function P(e) {
	let t = [];
	e ? t = e : A.subscribe((e) => t = e)();
	let n = t?.join("\n") ?? "";
	n && await g(n, "dev log", navigator, window);
}
typeof window < "u" && (window.showSwUpdateModalDebug = () => {
	u.set(!0), console.log("SW更新ボタンを強制表示しました（設定ボタンランプ＋SettingsDialog内）");
}, window.showSwUpdateInstallingDebug = () => {
	c.set("installing"), console.log("SW更新の installing 状態を強制表示しました");
}, window.showSwUpdateReadyDebug = () => {
	c.set("ready"), console.log("SW更新の ready 状態を強制表示しました");
}, window.resetSwUpdateDebug = () => {
	c.set("idle"), console.log("SW更新デバッグ状態をリセットしました");
}), M() && (window.testDevLog = () => {
	console.log("テスト用ログ出力:", (/* @__PURE__ */ new Date()).toISOString()), N("直接devLogに追加:", Math.random());
}, window.showPostSuccessDebug = () => {
	C.postStatus = {
		...C.postStatus,
		success: !0,
		error: !1,
		message: "post_success",
		completed: !0
	};
}, window.showPostErrorDebug = () => {
	C.postStatus = {
		...C.postStatus,
		success: !1,
		error: !0,
		message: "post_error",
		completed: !1
	};
});
function F(e) {
	M();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/videoCompression/videoCompressionService.ts
var I = class {
	localStorage;
	isUploadAborted;
	context = "VideoCompressionService";
	mediabunnyCompression = null;
	initPromise = null;
	onProgress;
	constructor(e, t = E) {
		this.localStorage = e, this.isUploadAborted = t;
	}
	async ensureInitialized() {
		this.mediabunnyCompression || (this.initPromise ||= import("./mediabunnyCompression-d81aRf9H.js").then(({ MediaBunnyCompression: e }) => {
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
		let e = i(this.localStorage), t = d[e];
		return l(t) ? t : null;
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
async function L(e) {
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
async function R(e, t = E) {
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
async function z(e) {
	try {
		return URL.createObjectURL(e);
	} catch {
		return null;
	}
}
async function B(e, t) {
	return await R(e, t);
}
function V(e) {
	let t = {};
	return e?.state?.doc && e.state.doc.descendants((e) => {
		e.type?.name === "image" && typeof e.attrs?.src == "string" && typeof e.attrs?.blurhash == "string" && !e.attrs?.isPlaceholder && !e.attrs.src.startsWith("placeholder-") && (t[e.attrs.src] = e.attrs.blurhash);
	}), t;
}
function H(e) {
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
async function U(e) {
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
var W = class {
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
async function G(e, t) {
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
function K() {
	return typeof Worker > "u" ? null : () => new Worker(new URL(
		/* @vite-ignore */
		new URL("imageWebpEncodeWorker-B7kEj3hA.js", import.meta.url).href,
		"" + import.meta.url
	), { type: "module" });
}
function q(e, n, r, i) {
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
function J(e, t, n) {
	if (![
		e,
		t,
		n
	].every((e) => Number.isFinite(e) && e > 0)) throw Error("Invalid image dimensions");
	let r = Math.min(1, n / Math.min(e, t), Math.sqrt(s.maxPixels / (e * t)), s.maxLongEdge / Math.max(e, t));
	return {
		width: Math.max(1, Math.floor(e * r)),
		height: Math.max(1, Math.floor(t * r))
	};
}
var Y = class {
	mimeSupport;
	localStorage;
	isUploadAborted;
	webpWorkerFactory;
	onProgress;
	constructor(e, t, n = E, r = K()) {
		this.mimeSupport = e, this.localStorage = t, this.isUploadAborted = n, this.webpWorkerFactory = r;
	}
	abort() {
		this.onProgress?.(0);
	}
	setProgressCallback(e) {
		this.onProgress = e;
	}
	getCompressionOptions() {
		let e = a(this.localStorage), t = o[e] ?? o.medium;
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
		if (!s || e.type === "image/gif" || e.size <= 20480) return {
			...o,
			wasSkipped: !0
		};
		let c, l, u;
		try {
			if (e.type === "image/webp") {
				let t = await G(e, n?.signal);
				if (a(), t !== "static") return {
					...o,
					wasSkipped: !0
				};
			}
			this.onProgress?.(5), a(), c = new window.Image();
			let t = new Promise((e, t) => {
				c.onload = () => e(), c.onerror = () => t(/* @__PURE__ */ Error("Failed to decode image"));
			});
			l = URL.createObjectURL(e), c.src = l, await r(t, n?.signal), a();
			let i = J(c.naturalWidth, c.naturalHeight, s.maxShortEdge);
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
			}, p = this.mimeSupport.canEncodeMimeType("image/webp") ? await f("image/webp") : null;
			if (!p) try {
				let e = Math.round(s.quality * 100), t = () => d.getImageData(0, 0, u.width, u.height), i;
				if (this.webpWorkerFactory) try {
					i = await q(this.webpWorkerFactory, t(), e, n?.signal);
				} catch {
					a();
				}
				if (a(), !i) {
					let { encode: o } = await import("./webp-COIYsy1H.js");
					a(), i = await r(o(t(), { quality: e }), n?.signal);
				}
				a(), i.byteLength && (p = new Blob([i], { type: "image/webp" }));
			} catch (e) {
				a(), console.warn("[ImageCompressionService] WebP fallback failed:", e);
			}
			if (a(), !p) {
				let t = e.type === "image/png" ? "image/png" : "image/jpeg";
				t === "image/jpeg" && (d.globalCompositeOperation = "destination-over", d.fillStyle = "#fff", d.fillRect(0, 0, u.width, u.height)), p = await f(t);
			}
			if (a(), !p) throw Error("Failed to encode image");
			if (this.onProgress?.(100), a(), p.size >= e.size) return o;
			let m = new File([p], D(e.name, p.type), { type: p.type });
			return n?.signal || F(m), {
				file: m,
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
// D:/ドキュメント/GitHub/ehagaki/src/lib/uploadImetaUtils.ts
async function ee({ editor: e, imageServerBlurhashMap: t, imageOxMap: n, imageXMap: r, dependencies: i }) {
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
function X(e, t) {
	e.galleryCleanup ? y(t, e.galleryCleanup.imageSizeMapStore) : e.currentEditor && _(e.currentEditor, e.devMode);
}
function Z(e, { placeholderMap: t, cleanupPlaceholders: n }) {
	return n && X(e, t), e.notifyAbortProgress?.(e.fileArray.length), e.deferUploadStateClear || e.updateUploadState(!1), {
		placeholderMap: n ? [] : t,
		results: null,
		imageOxMap: {},
		imageXMap: {},
		failedResults: [],
		errorMessage: "Upload aborted by user"
	};
}
function te(e, t) {
	return e ? { imageSizeMapStore: t } : void 0;
}
function ne({ isUploadAborted: e = E, ...t }) {
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
function re(e, t = () => !0) {
	return {
		onProgress: (n) => {
			t() && (h(n), e?.onProgress?.(n));
		},
		onVideoCompressionProgress: (n) => {
			t() && (p.set(n), e?.onVideoCompressionProgress?.(n));
		},
		onImageCompressionProgress: (n) => {
			t() && (m.set(n), e?.onImageCompressionProgress?.(n));
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
	let o = ae(n), s = k(t);
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
		let r = await v(t, n, a, o, s, c, l, u, ...e.isCurrent ? [{
			isCurrent: e.isCurrent,
			useFileMimeType: e.useFileMimeType
		}] : []);
		return {
			failedResults: r.failedResults,
			errorMessage: r.errorMessage,
			imageServerBlurhashMap: {}
		};
	}
	let d = await w(t, n, i, a, o, s, c, u);
	return {
		failedResults: d.failedResults,
		errorMessage: d.errorMessage,
		imageServerBlurhashMap: d.imageServerBlurhashMap
	};
}
async function ce({ files: e, currentEditor: t, fileInput: n, uploadCallbacks: r, showUploadError: i, updateUploadState: a, devMode: o, dependencies: s, prepareFiles: c, uploadPreparedFiles: l, fileUploadManager: u, fileUploadManagerInstance: d, deferUploadStateClear: p = !1, isUploadAborted: m, galleryMode: h, signal: g, isCurrent: _ = () => !0, onPlaceholdersCreated: v }) {
	if (!s) throw Error("Upload helper requires explicit runtime dependencies.");
	let y = m ? {
		...s,
		isUploadAborted: m
	} : s, C = m ?? s.isUploadAborted ?? E, w = () => !!g?.aborted || !_() || C(), D = Array.from(e), k = u ?? y.FileUploadManager, A = re(r, _), j = l ? void 0 : await s.resolveUploadDestination?.(), M = {}, N = {};
	$(A, Q(D.length, { inProgress: !0 })), !g && _() && T();
	let P;
	try {
		P = c ? await c(D, y) : await O(D, y);
	} catch (e) {
		if (e instanceof Error && e.message === "Upload aborted by user") return Z({
			fileArray: D,
			currentEditor: t,
			updateUploadState: a,
			deferUploadStateClear: p,
			devMode: o,
			notifyAbortProgress: (e) => {
				$(A, Q(e, { aborted: e }));
			}
		}, {
			placeholderMap: [],
			cleanupPlaceholders: !1
		});
		throw e;
	}
	let F = h ?? !f.value, I = ne({
		fileArray: D,
		currentEditor: t,
		updateUploadState: a,
		devMode: o,
		galleryCleanup: te(F, y.imageSizeMapStore),
		isUploadAborted: w,
		deferUploadStateClear: p,
		notifyAbortProgress: (e) => {
			$(A, Q(e, { aborted: e }));
		}
	}), L = I({
		placeholderMap: [],
		cleanupPlaceholders: !1
	});
	if (L) return L;
	let R = c ? P.map((e) => e.file) : D, z = F ? b(R, P, i, s.imageSizeMapStore, k, o) : x(R, P, t, i, s.imageSizeMapStore, k, o);
	if (v?.(z), z.length === 0) return {
		placeholderMap: [],
		results: null,
		imageOxMap: M,
		imageXMap: N,
		failedResults: [],
		errorMessage: ""
	};
	let B = I({
		placeholderMap: z,
		cleanupPlaceholders: !0
	});
	if (B) return B;
	a(!0, ""), await S(z, k, o, w);
	let V = I({
		placeholderMap: z,
		cleanupPlaceholders: !0
	});
	if (V) return V;
	let H = z.map((e) => e.file), U = null, W = ie(y, k, d);
	try {
		U = l ? await l(H, z) : await oe(W, H, j, A, o, g);
	} catch (e) {
		i(e instanceof Error ? e.message : String(e), 5e3), U = null;
	}
	let G = I({
		placeholderMap: z,
		cleanupPlaceholders: !0
	});
	if (G) return n && _() && (n.value = ""), G;
	await y.tick();
	let K = I({
		placeholderMap: z,
		cleanupPlaceholders: !0
	});
	if (K) return K;
	let q = await se({
		results: U,
		placeholderMap: z,
		galleryMode: F,
		currentEditor: t,
		imageOxMap: M,
		imageXMap: N,
		imageSizeMapStore: y.imageSizeMapStore,
		calculateImageHash: y.calculateImageHash,
		getMimeTypeFromUrl: y.getMimeTypeFromUrl,
		devMode: o,
		...g ? {
			isCurrent: () => _() && !g.aborted,
			useFileMimeType: h === !0
		} : {}
	}), J = [...q.failedResults], Y = q.errorMessage, X = q.imageServerBlurhashMap;
	if (U && z.length > 0 && (z = []), o && t && _() && !g) try {
		await ee({
			editor: t,
			imageServerBlurhashMap: X,
			imageOxMap: M,
			imageXMap: N,
			dependencies: y
		});
	} catch {
		console.warn("[preview] [dev] imetaタグ生成失敗", {
			stage: "imeta-tag",
			reason: "unexpected"
		});
	}
	return n && _() && (n.value = ""), p || a(!1), {
		placeholderMap: z,
		results: U,
		imageOxMap: M,
		imageXMap: N,
		failedResults: J,
		errorMessage: Y
	};
}
function le(e, t = 3e3, n) {
	let r = n.keepUploading ?? !1;
	n.updateUploadState(r, e), setTimeout(() => n.setUploadErrorMessage(""), t);
}
export { W as a, z as c, H as d, I as f, M as h, G as i, V as l, A as m, ce as n, U as o, P as p, Y as r, L as s, le as t, B as u };
