import { a as e, h as t, r as n, u as r } from "./uploadStore.svelte-DWirN09w.js";
import { H as i, I as a, L as o, _ as s, g as c, h as l, m as u, p as d, v as f } from "./editorStore.svelte-Q7oo5cQe.js";
import { n as p, t as m } from "./uploadAbortUtils-F30ArOJg.js";
import { i as ee, r as h } from "./fileUtils-nRfpyUX-.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/uploadImetaUtils.ts
async function g({ editor: e, imageServerBlurhashMap: t, imageOxMap: n, imageXMap: r, dependencies: i }) {
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
function _(e, t) {
	e.galleryCleanup ? c(t, e.galleryCleanup.imageSizeMapStore) : e.currentEditor && i(e.currentEditor, e.devMode);
}
function v(e, { placeholderMap: t, cleanupPlaceholders: n }) {
	return n && _(e, t), e.notifyAbortProgress?.(e.fileArray.length), e.deferUploadStateClear || e.updateUploadState(!1), {
		placeholderMap: n ? [] : t,
		results: null,
		imageOxMap: {},
		imageXMap: {},
		failedResults: [],
		errorMessage: "Upload aborted by user"
	};
}
function y(e, t) {
	return e ? { imageSizeMapStore: t } : void 0;
}
function b({ isUploadAborted: e = m, ...t }) {
	return ({ placeholderMap: n, cleanupPlaceholders: r }) => e() ? v(t, {
		placeholderMap: n,
		cleanupPlaceholders: r
	}) : null;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/uploadProgressUtils.ts
function x(e, t = {}) {
	return {
		total: e,
		completed: 0,
		failed: 0,
		aborted: 0,
		inProgress: !1,
		...t
	};
}
function S(e, t) {
	e?.onProgress?.(t);
}
function C(e, i = () => !0) {
	return {
		onProgress: (t) => {
			i() && (r(t), e?.onProgress?.(t));
		},
		onVideoCompressionProgress: (n) => {
			i() && (t.set(n), e?.onVideoCompressionProgress?.(n));
		},
		onImageCompressionProgress: (t) => {
			i() && (n.set(t), e?.onImageCompressionProgress?.(t));
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/uploadHelper.ts
function w(e, t = e.FileUploadManager, n) {
	return n ?? new t();
}
function T(e) {
	return e ? e.protocol === "nip96" && e.resolvedUploadUrl || e.serverUrl : "";
}
async function te(e, t, n, r, i, a) {
	if (t.length === 0) return null;
	let o = T(n), s = h(t);
	return t.length === 1 ? [await (a ? e.uploadFileWithCallbacks(t[0], o, r, i, s[0], n, { signal: a }) : e.uploadFileWithCallbacks(t[0], o, r, i, s[0], n))] : await e.uploadMultipleFilesWithCallbacks(t, o, r, s, n);
}
async function ne(e) {
	let { results: t, placeholderMap: n, galleryMode: r, currentEditor: i, imageOxMap: a, imageXMap: o, imageSizeMapStore: c, calculateImageHash: l, getMimeTypeFromUrl: u, devMode: d } = e;
	if (!t || n.length === 0) return {
		failedResults: [],
		errorMessage: "",
		imageServerBlurhashMap: {}
	};
	if (r) {
		let r = await s(t, n, a, o, c, l, u, d, ...e.isCurrent ? [{
			isCurrent: e.isCurrent,
			useFileMimeType: e.useFileMimeType
		}] : []);
		return {
			failedResults: r.failedResults,
			errorMessage: r.errorMessage,
			imageServerBlurhashMap: {}
		};
	}
	let p = await f(t, n, i, a, o, c, l, d);
	return {
		failedResults: p.failedResults,
		errorMessage: p.errorMessage,
		imageServerBlurhashMap: p.imageServerBlurhashMap
	};
}
async function E({ files: t, currentEditor: n, fileInput: r, uploadCallbacks: i, showUploadError: s, updateUploadState: c, devMode: f, dependencies: h, prepareFiles: _, uploadPreparedFiles: T, fileUploadManager: E, fileUploadManagerInstance: D, deferUploadStateClear: O = !1, isUploadAborted: k, galleryMode: A, signal: j, isCurrent: M = () => !0, onPlaceholdersCreated: re }) {
	if (!h) throw Error("Upload helper requires explicit runtime dependencies.");
	let N = k ? {
		...h,
		isUploadAborted: k
	} : h, ie = k ?? h.isUploadAborted ?? m, P = () => !!j?.aborted || !M() || ie(), F = Array.from(t), I = E ?? N.FileUploadManager, L = C(i, M), R = T ? void 0 : await h.resolveUploadDestination?.(), z = {}, B = {};
	S(L, x(F.length, { inProgress: !0 })), !j && M() && p();
	let V;
	try {
		F.some(a) && (F = await Promise.all(F.map((e) => o(e, j)))), V = _ ? await _(F, N) : await ee(F, N);
	} catch (e) {
		if (P() || e instanceof Error && e.message === "Upload aborted by user") return v({
			fileArray: F,
			currentEditor: n,
			updateUploadState: c,
			deferUploadStateClear: O,
			devMode: f,
			notifyAbortProgress: (e) => {
				S(L, x(e, { aborted: e }));
			}
		}, {
			placeholderMap: [],
			cleanupPlaceholders: !1
		});
		throw e;
	}
	let H = A ?? !e.value, ae = y(H, N.imageSizeMapStore), U = b({
		fileArray: F,
		currentEditor: n,
		updateUploadState: c,
		devMode: f,
		galleryCleanup: ae,
		isUploadAborted: P,
		deferUploadStateClear: O,
		notifyAbortProgress: (e) => {
			S(L, x(e, { aborted: e }));
		}
	}), W = U({
		placeholderMap: [],
		cleanupPlaceholders: !1
	});
	if (W) return W;
	let G = _ ? V.map((e) => e.file) : F, K = H ? l(G, V, s, h.imageSizeMapStore, I, f) : u(G, V, n, s, h.imageSizeMapStore, I, f);
	if (re?.(K), K.length === 0) return {
		placeholderMap: [],
		results: null,
		imageOxMap: z,
		imageXMap: B,
		failedResults: [],
		errorMessage: ""
	};
	let q = U({
		placeholderMap: K,
		cleanupPlaceholders: !0
	});
	if (q) return q;
	c(!0, ""), await d(K, I, f, P);
	let J = U({
		placeholderMap: K,
		cleanupPlaceholders: !0
	});
	if (J) return J;
	let Y = K.map((e) => e.file), X = null, oe = w(N, I, D);
	try {
		X = T ? await T(Y, K) : await te(oe, Y, R, L, f, j);
	} catch (e) {
		s(e instanceof Error ? e.message : String(e), 5e3), X = null;
	}
	let Z = U({
		placeholderMap: K,
		cleanupPlaceholders: !0
	});
	if (Z) return r && M() && (r.value = ""), Z;
	await N.tick();
	let Q = U({
		placeholderMap: K,
		cleanupPlaceholders: !0
	});
	if (Q) return Q;
	let $ = await ne({
		results: X,
		placeholderMap: K,
		galleryMode: H,
		currentEditor: n,
		imageOxMap: z,
		imageXMap: B,
		imageSizeMapStore: N.imageSizeMapStore,
		calculateImageHash: N.calculateImageHash,
		getMimeTypeFromUrl: N.getMimeTypeFromUrl,
		devMode: f,
		...j ? {
			isCurrent: () => M() && !j.aborted,
			useFileMimeType: A === !0
		} : {}
	}), se = [...$.failedResults], ce = $.errorMessage, le = $.imageServerBlurhashMap;
	if (X && K.length > 0 && (K = []), f && n && M() && !j) try {
		await g({
			editor: n,
			imageServerBlurhashMap: le,
			imageOxMap: z,
			imageXMap: B,
			dependencies: N
		});
	} catch {
		console.warn("[preview] [dev] imetaタグ生成失敗", {
			stage: "imeta-tag",
			reason: "unexpected"
		});
	}
	return r && M() && (r.value = ""), O || c(!1), {
		placeholderMap: K,
		results: X,
		imageOxMap: z,
		imageXMap: B,
		failedResults: se,
		errorMessage: ce
	};
}
function D(e, t = 3e3, n) {
	let r = n.keepUploading ?? !1;
	n.updateUploadState(r, e), setTimeout(() => n.setUploadErrorMessage(""), t);
}
export { E as n, D as t };
