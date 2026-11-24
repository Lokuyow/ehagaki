import { a as e, n as t } from "./appRuntimeEnvironment-Bzv9wJOh.js";
import { E as n, dt as r, ht as i, it as a } from "./appUtils-B3-zUpkb.js";
import { r as o } from "./signedEventResultValidator-7WV1YEyT.js";
import { c as s, g as c } from "./uploadStore.svelte-DWirN09w.js";
import { i as l, o as u, v as d } from "./resolveCurrentUploadDestination-CMXZTG_T.js";
import { S as f, w as p } from "./editorStore.svelte-Q7oo5cQe.js";
import { t as m } from "./uploadAbortUtils-F30ArOJg.js";
import { n as h, o as g } from "./fileUtils-nRfpyUX-.js";
import { i as _, r as v, t as y } from "./imageCompressionService-DpIpfk5p.js";
import { t as b } from "./postMediaCacheService-BRKmVe4b.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/fileUploadManager.ts
var x = class {
	dependencies;
	imageCompressionService;
	videoCompressionService;
	mimeSupport;
	authService;
	constructor(t = {
		localStorage: e(),
		fetch: window.fetch.bind(window),
		crypto: window.crypto.subtle,
		document: window.document,
		window,
		navigator: window.navigator
	}, n, r, i, a) {
		this.dependencies = t, this.dependencies.setImageSizeInfoFromFileSize ??= s, this.mimeSupport = a || new v(t.document), this.imageCompressionService = r || new y(this.mimeSupport, t.localStorage, this.isUploadAborted.bind(this)), this.videoCompressionService = i || new _(t.localStorage, this.isUploadAborted.bind(this)), this.authService = n || new u();
	}
	isUploadAborted(e) {
		return e?.aborted ?? this.dependencies.isUploadAborted?.() ?? m();
	}
	updateImageSizeInfo(e) {
		e && this.dependencies.setImageSizeInfoFromFileSize?.(e);
	}
	async persistUploadedPostMedia(e, t) {
		if (e) try {
			await b.persistUploadedMedia({
				url: e,
				file: t,
				mimeType: t.type || void 0
			});
		} catch {
			console.warn("post_media_cache_persist_failed", {
				stage: "media-cache",
				reason: "unexpected"
			});
		}
	}
	validateImageFile(e) {
		return e.type.startsWith("image/") ? e.size > 1073741824 ? {
			isValid: !1,
			errorMessage: "file_too_large"
		} : { isValid: !0 } : {
			isValid: !1,
			errorMessage: "only_images_allowed"
		};
	}
	validateMediaFile(e) {
		let t = e.type.startsWith("image/"), n = e.type.startsWith("video/");
		return !t && !n ? {
			isValid: !1,
			errorMessage: "only_images_or_videos_allowed"
		} : e.size > 1073741824 ? {
			isValid: !1,
			errorMessage: "file_too_large"
		} : { isValid: !0 };
	}
	async generateBlurhashForFile(e) {
		return await p(e, this.isUploadAborted.bind(this));
	}
	async createPlaceholderUrl(e) {
		return await f(e);
	}
	getUploadEndpoint(e) {
		let t = e?.trim();
		return t && t !== "https://nostr.build/api/v2/upload/files" ? t : i(n(this.dependencies.localStorage.getItem(r.LOCALE) ?? this.dependencies.navigator?.language));
	}
	async uploadFile(e, t = a, n = !1, i, s, u, f) {
		let p;
		try {
			if (!e) return {
				success: !1,
				error: "No file selected"
			};
			if (this.isUploadAborted(f?.signal)) return {
				success: !1,
				error: "Upload aborted by user",
				aborted: !0
			};
			let a = e.size;
			if (this.isUploadAborted(f?.signal)) return n && console.log("[FileUploadManager] Upload aborted before compression"), {
				success: !1,
				error: "Upload aborted by user",
				aborted: !0
			};
			let o = e.type.startsWith("video/"), m = o ? this.videoCompressionService : this.imageCompressionService;
			o && s?.onVideoCompressionProgress && this.videoCompressionService.setProgressCallback(s.onVideoCompressionProgress), !o && s?.onImageCompressionProgress && this.imageCompressionService.setProgressCallback(s.onImageCompressionProgress);
			let g;
			try {
				g = f?.signal ? await m.compress(e, { signal: f.signal }) : await m.compress(e);
			} finally {
				o ? this.videoCompressionService.setProgressCallback(void 0) : this.imageCompressionService.setProgressCallback(void 0);
			}
			let { file: _, wasCompressed: v, wasSkipped: y, aborted: b } = g;
			if (b) return n && console.log("[FileUploadManager] Upload aborted by user"), {
				success: !1,
				error: "Upload aborted by user",
				aborted: !0
			};
			if (this.isUploadAborted(f?.signal)) return {
				success: !1,
				error: "Upload aborted by user",
				aborted: !0
			};
			let x = !o && (!f?.headless || u?.protocol === "blossom") ? await h(_) : null;
			if (this.isUploadAborted(f?.signal)) return {
				success: !1,
				error: "Upload aborted by user",
				aborted: !0
			};
			let S = _.size, C = o ? this.videoCompressionService.hasCompressionSettings() : this.imageCompressionService.hasCompressionSettings();
			p = c(a, S, C || v, e.name, _.name, y);
			let w = u ? "" : this.getUploadEndpoint(t), T = u ?? d({
				endpoint: w,
				locale: this.dependencies.localStorage.getItem(r.LOCALE)
			}), E = await l(T.protocol).upload({
				file: _,
				destination: T,
				authService: this.authService,
				fetch: this.dependencies.fetch,
				metadata: i,
				devMode: n,
				...f?.signal ? { signal: f.signal } : {}
			});
			if (this.isUploadAborted(f?.signal)) return {
				success: !1,
				error: "Upload aborted by user",
				sizeInfo: p,
				aborted: !0
			};
			E.success && E.url && !f?.headless && await this.persistUploadedPostMedia(E.url, _);
			let D = E.success && !f?.headless ? {
				...E.nip94 ?? {},
				size: String(_.size),
				...x ? { dim: `${x.width}x${x.height}` } : {}
			} : E.nip94, O = f?.headless && E.success && T.protocol === "blossom" ? x : null, k = O && _.type.startsWith("image/") ? await this.generateBlurhashForFile(_) : null;
			if (this.isUploadAborted(f?.signal)) return {
				success: !1,
				error: "Upload aborted by user",
				sizeInfo: p,
				aborted: !0
			};
			let A = {
				...D ?? {},
				...O ? { dim: `${O.width}x${O.height}` } : {},
				...k ? { blurhash: k } : {}
			};
			return {
				...E,
				...Object.keys(A).length ? { nip94: A } : {},
				...x && (!f?.headless || O) ? { dimensions: x } : {},
				uploadProtocol: T.protocol,
				sizeInfo: p
			};
		} catch (e) {
			if (f?.headless && e instanceof o) throw e;
			if (this.isUploadAborted(f?.signal)) return {
				success: !1,
				error: "Upload aborted by user",
				sizeInfo: p,
				aborted: !0
			};
			n && console.error("[dev] Upload error", {
				stage: "upload",
				reason: "unexpected"
			});
			let t = e instanceof Error ? e.message : String(e);
			return t.includes("aborted by user") ? {
				success: !1,
				error: t,
				sizeInfo: p,
				aborted: !0
			} : {
				success: !1,
				error: t.includes("Failed to fetch") ? `${t} (Service Workerが画像アップロードをブロックしている可能性があります)` : t,
				...["reactionUnsupportedImage", "reactionImageTransformFailed"].includes(t) ? { errorCode: t } : {}
			};
		}
	}
	async uploadFileForHost(e, t, n) {
		return await this.uploadFile(e, a, !1, void 0, void 0, t, {
			signal: n,
			headless: !0
		});
	}
	async uploadMultipleFiles(e, t = a, n, r = !1, i, o, s) {
		if (!e?.length) return [];
		let c = Array(e.length), l = 0, u = 0, d = 0, f = () => n?.({
			completed: l,
			failed: u,
			aborted: d,
			total: e.length,
			inProgress: l + u + d < e.length
		});
		f();
		for (let n = 0; n < e.length; n++) {
			if (this.isUploadAborted()) {
				for (let t = n; t < e.length; t++) c[t] = {
					success: !1,
					aborted: !0
				}, d++;
				f();
				break;
			}
			let a = e[n];
			try {
				let e = i ? i[n] : void 0, p = await this.uploadFile(a, t, r, e, o, s);
				c[n] = p, p.success ? l++ : p.aborted ? d++ : u++, f();
			} catch (e) {
				c[n] = {
					success: !1,
					error: e instanceof Error ? e.message : String(e)
				}, u++, f();
			}
		}
		return c;
	}
	async uploadFileWithCallbacks(e, t = a, n, r = !1, i, o, s) {
		n?.onProgress?.({
			completed: 0,
			failed: 0,
			aborted: 0,
			total: 1,
			inProgress: !0
		});
		try {
			let a = await this.uploadFile(e, t, r, i, n, o, s);
			return n?.onProgress?.({
				completed: +!!a.success,
				failed: +(!a.success && !a.aborted),
				aborted: +!!a.aborted,
				total: 1,
				inProgress: !1
			}), a.success && a.sizeInfo && !a.aborted && this.updateImageSizeInfo(a.sizeInfo), a;
		} catch (e) {
			return n?.onProgress?.({
				completed: 0,
				failed: 1,
				aborted: 0,
				total: 1,
				inProgress: !1
			}), {
				success: !1,
				error: e instanceof Error ? e.message : String(e)
			};
		}
	}
	async uploadMultipleFilesWithCallbacks(e, t = a, n, r, i) {
		if (!e?.length) return [];
		n?.onProgress?.({
			completed: 0,
			failed: 0,
			aborted: 0,
			total: e.length,
			inProgress: !0
		});
		let o = await this.uploadMultipleFiles(e, t, n?.onProgress, !1, r, n, i);
		if (!this.isUploadAborted()) {
			let e = o.find((e) => e.success && e.sizeInfo);
			e?.sizeInfo && this.updateImageSizeInfo(e.sizeInfo);
		}
		return o;
	}
	async getSharedMediaFromServiceWorker() {
		if (!t().serviceWorkerEnabled || !this.dependencies.navigator?.serviceWorker?.controller) return null;
		try {
			let e = await g(this.dependencies.navigator.serviceWorker.controller, { action: "getSharedMedia" }, 3e3);
			if (e.status === "error") throw e.error;
			if (e.status !== "reply") return null;
			let t = e.data;
			return t?.type === "SHARED_MEDIA" ? t.data ?? null : null;
		} catch {
			return console.error("Service Workerからの共有メディア取得に失敗", {
				stage: "shared-media",
				reason: "unexpected"
			}), null;
		}
	}
	checkIfOpenedFromShare() {
		return this.dependencies.window?.location ? new URLSearchParams(this.dependencies.window.location.search).get("shared") === "true" : !1;
	}
	async processSharedMediaOnLaunch() {
		try {
			let e = await this.getSharedMediaFromServiceWorker();
			return e?.images?.length ? {
				success: !0,
				data: e,
				fromServiceWorker: !0
			} : {
				success: !1,
				error: "共有メディアが見つかりません"
			};
		} catch (e) {
			return {
				success: !1,
				error: e instanceof Error ? e.message : String(e)
			};
		}
	}
};
export { x as t };
