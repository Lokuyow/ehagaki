import { i as p, f5 as h, f6 as g } from "./App-qNXS1jWJ.js";
import { B as E } from "./baseCompression-CbXukwNa.js";
import { bi as R } from "./entry-COvMLKyo.js";
var a;
(function(s) {
  s.LOAD = "LOAD", s.EXEC = "EXEC", s.FFPROBE = "FFPROBE", s.WRITE_FILE = "WRITE_FILE", s.READ_FILE = "READ_FILE", s.DELETE_FILE = "DELETE_FILE", s.RENAME = "RENAME", s.CREATE_DIR = "CREATE_DIR", s.LIST_DIR = "LIST_DIR", s.DELETE_DIR = "DELETE_DIR", s.ERROR = "ERROR", s.DOWNLOAD = "DOWNLOAD", s.PROGRESS = "PROGRESS", s.LOG = "LOG", s.MOUNT = "MOUNT", s.UNMOUNT = "UNMOUNT";
})(a || (a = {}));
const w = /* @__PURE__ */ (() => {
  let s = 0;
  return () => s++;
})(), F = new Error("ffmpeg is not loaded, call `await ffmpeg.load()` first"), L = new Error("called FFmpeg.terminate()");
class b {
  #t = null;
  /**
   * #resolves and #rejects tracks Promise resolves and rejects to
   * be called when we receive message from web worker.
   */
  #s = {};
  #r = {};
  #i = [];
  #a = [];
  loaded = !1;
  /**
   * register worker message event handlers.
   */
  #o = () => {
    this.#t && (this.#t.onmessage = ({ data: { id: e, type: r, data: t } }) => {
      switch (r) {
        case a.LOAD:
          this.loaded = !0, this.#s[e](t);
          break;
        case a.MOUNT:
        case a.UNMOUNT:
        case a.EXEC:
        case a.FFPROBE:
        case a.WRITE_FILE:
        case a.READ_FILE:
        case a.DELETE_FILE:
        case a.RENAME:
        case a.CREATE_DIR:
        case a.LIST_DIR:
        case a.DELETE_DIR:
          this.#s[e](t);
          break;
        case a.LOG:
          this.#i.forEach((i) => i(t));
          break;
        case a.PROGRESS:
          this.#a.forEach((i) => i(t));
          break;
        case a.ERROR:
          this.#r[e](t);
          break;
      }
      delete this.#s[e], delete this.#r[e];
    });
  };
  /**
   * Generic function to send messages to web worker.
   */
  #e = ({ type: e, data: r }, t = [], i) => this.#t ? new Promise((n, l) => {
    const o = w();
    this.#t && this.#t.postMessage({ id: o, type: e, data: r }, t), this.#s[o] = n, this.#r[o] = l, i?.addEventListener("abort", () => {
      l(new DOMException(`Message # ${o} was aborted`, "AbortError"));
    }, { once: !0 });
  }) : Promise.reject(F);
  on(e, r) {
    e === "log" ? this.#i.push(r) : e === "progress" && this.#a.push(r);
  }
  off(e, r) {
    e === "log" ? this.#i = this.#i.filter((t) => t !== r) : e === "progress" && (this.#a = this.#a.filter((t) => t !== r));
  }
  /**
   * Loads ffmpeg-core inside web worker. It is required to call this method first
   * as it initializes WebAssembly and other essential variables.
   *
   * @category FFmpeg
   * @returns `true` if ffmpeg core is loaded for the first time.
   */
  load = ({ classWorkerURL: e, ...r } = {}, { signal: t } = {}) => (this.#t || (this.#t = e ? new Worker(new URL(e, import.meta.url), {
    type: "module"
  }) : (
    // We need to duplicated the code here to enable webpack
    // to bundle worekr.js here.
    new Worker(new URL(
      /* @vite-ignore */
      "" + new URL("worker-CgGQRANT.js", import.meta.url).href,
      import.meta.url
    ), {
      type: "module"
    })
  ), this.#o()), this.#e({
    type: a.LOAD,
    data: r
  }, void 0, t));
  /**
   * Execute ffmpeg command.
   *
   * @remarks
   * To avoid common I/O issues, ["-nostdin", "-y"] are prepended to the args
   * by default.
   *
   * @example
   * ```ts
   * const ffmpeg = new FFmpeg();
   * await ffmpeg.load();
   * await ffmpeg.writeFile("video.avi", ...);
   * // ffmpeg -i video.avi video.mp4
   * await ffmpeg.exec(["-i", "video.avi", "video.mp4"]);
   * const data = ffmpeg.readFile("video.mp4");
   * ```
   *
   * @returns `0` if no error, `!= 0` if timeout (1) or error.
   * @category FFmpeg
   */
  exec = (e, r = -1, { signal: t } = {}) => this.#e({
    type: a.EXEC,
    data: { args: e, timeout: r }
  }, void 0, t);
  /**
   * Execute ffprobe command.
   *
   * @example
   * ```ts
   * const ffmpeg = new FFmpeg();
   * await ffmpeg.load();
   * await ffmpeg.writeFile("video.avi", ...);
   * // Getting duration of a video in seconds: ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 video.avi -o output.txt
   * await ffmpeg.ffprobe(["-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", "video.avi", "-o", "output.txt"]);
   * const data = ffmpeg.readFile("output.txt");
   * ```
   *
   * @returns `0` if no error, `!= 0` if timeout (1) or error.
   * @category FFmpeg
   */
  ffprobe = (e, r = -1, { signal: t } = {}) => this.#e({
    type: a.FFPROBE,
    data: { args: e, timeout: r }
  }, void 0, t);
  /**
   * Terminate all ongoing API calls and terminate web worker.
   * `FFmpeg.load()` must be called again before calling any other APIs.
   *
   * @category FFmpeg
   */
  terminate = () => {
    const e = Object.keys(this.#r);
    for (const r of e)
      this.#r[r](L), delete this.#r[r], delete this.#s[r];
    this.#t && (this.#t.terminate(), this.#t = null, this.loaded = !1);
  };
  /**
   * Write data to ffmpeg.wasm.
   *
   * @example
   * ```ts
   * const ffmpeg = new FFmpeg();
   * await ffmpeg.load();
   * await ffmpeg.writeFile("video.avi", await fetchFile("../video.avi"));
   * await ffmpeg.writeFile("text.txt", "hello world");
   * ```
   *
   * @category File System
   */
  writeFile = (e, r, { signal: t } = {}) => {
    const i = [];
    return r instanceof Uint8Array && i.push(r.buffer), this.#e({
      type: a.WRITE_FILE,
      data: { path: e, data: r }
    }, i, t);
  };
  mount = (e, r, t) => {
    const i = [];
    return this.#e({
      type: a.MOUNT,
      data: { fsType: e, options: r, mountPoint: t }
    }, i);
  };
  unmount = (e) => {
    const r = [];
    return this.#e({
      type: a.UNMOUNT,
      data: { mountPoint: e }
    }, r);
  };
  /**
   * Read data from ffmpeg.wasm.
   *
   * @example
   * ```ts
   * const ffmpeg = new FFmpeg();
   * await ffmpeg.load();
   * const data = await ffmpeg.readFile("video.mp4");
   * ```
   *
   * @category File System
   */
  readFile = (e, r = "binary", { signal: t } = {}) => this.#e({
    type: a.READ_FILE,
    data: { path: e, encoding: r }
  }, void 0, t);
  /**
   * Delete a file.
   *
   * @category File System
   */
  deleteFile = (e, { signal: r } = {}) => this.#e({
    type: a.DELETE_FILE,
    data: { path: e }
  }, void 0, r);
  /**
   * Rename a file or directory.
   *
   * @category File System
   */
  rename = (e, r, { signal: t } = {}) => this.#e({
    type: a.RENAME,
    data: { oldPath: e, newPath: r }
  }, void 0, t);
  /**
   * Create a directory.
   *
   * @category File System
   */
  createDir = (e, { signal: r } = {}) => this.#e({
    type: a.CREATE_DIR,
    data: { path: e }
  }, void 0, r);
  /**
   * List directory contents.
   *
   * @category File System
   */
  listDir = (e, { signal: r } = {}) => this.#e({
    type: a.LIST_DIR,
    data: { path: e }
  }, void 0, r);
  /**
   * Delete an empty directory.
   *
   * @category File System
   */
  deleteDir = (e, { signal: r } = {}) => this.#e({
    type: a.DELETE_DIR,
    data: { path: e }
  }, void 0, r);
}
var u;
(function(s) {
  s.MEMFS = "MEMFS", s.NODEFS = "NODEFS", s.NODERAWFS = "NODERAWFS", s.IDBFS = "IDBFS", s.WORKERFS = "WORKERFS", s.PROXYFS = "PROXYFS";
})(u || (u = {}));
const A = "" + new URL("worker-CgGQRANT.js", import.meta.url).href, D = (s) => new Promise((e, r) => {
  const t = new FileReader();
  t.onload = () => {
    const { result: i } = t;
    i instanceof ArrayBuffer ? e(new Uint8Array(i)) : e(new Uint8Array());
  }, t.onerror = (i) => {
    r(Error(`File could not be read! Code=${i?.target?.error?.code || -1}`));
  }, t.readAsArrayBuffer(s);
}), m = async (s) => {
  let e;
  if (typeof s == "string")
    /data:_data\/([a-zA-Z]*);base64,([^"]*)/.test(s) ? e = atob(s.split(",")[1]).split("").map((r) => r.charCodeAt(0)) : e = await (await fetch(s)).arrayBuffer();
  else if (s instanceof URL)
    e = await (await fetch(s)).arrayBuffer();
  else if (s instanceof File || s instanceof Blob)
    e = await D(s);
  else
    return new Uint8Array();
  return new Uint8Array(e);
};
class y extends E {
  ffmpeg = null;
  isLoaded = !1;
  loadPromise = null;
  isCompressing = !1;
  constructor(e = p) {
    super("FFmpegCompression", e);
  }
  /**
   * 圧縮処理を中止
   */
  abort() {
    if (this.log("Abort requested"), this.resetProgress(), this.ffmpeg && this.isCompressing) {
      this.log("Terminating FFmpeg");
      try {
        this.ffmpeg.terminate();
      } catch (e) {
        h(this.context, "Error terminating FFmpeg:", e);
      }
    }
  }
  /**
   * FFmpegのロード（シングルスレッド版）
   */
  async loadFFmpeg() {
    if (!this.isLoaded)
      return this.loadPromise ? this.loadPromise : (this.loadPromise = (async () => {
        this.log("Loading FFmpeg from node_modules"), this.ffmpeg = new b(), this.ffmpeg.on("log", ({ message: e }) => {
          console.log("[FFmpeg]", e);
        }), this.ffmpeg.on("progress", ({ progress: e }) => {
          this.updateProgress(e * 100);
        });
        try {
          const e = R().assetBase, r = "./", t = (e ?? new URL(r, window.location.origin)).href, i = new URL("ffmpeg-core/ffmpeg-core.js", t).href, n = new URL("ffmpeg-core/ffmpeg-core.wasm", t).href;
          this.log("Base URL:", t), this.log("Core URL:", i), this.log("WASM URL:", n);
          const l = new URL(
            A,
            import.meta.url
          ), o = await this.createClassWorkerBlobURL(
            l
          );
          try {
            await this.ffmpeg.load({
              coreURL: i,
              wasmURL: n,
              ...o ? { classWorkerURL: o } : {}
            });
          } finally {
            o && URL.revokeObjectURL(o);
          }
          this.isLoaded = !0, this.log("FFmpeg loaded successfully");
        } catch (e) {
          throw h(this.context, "Failed to load FFmpeg:", e), e;
        }
      })(), this.loadPromise);
  }
  async createClassWorkerBlobURL(e) {
    if (e.origin === window.location.origin)
      return null;
    const r = await fetch(e, { mode: "cors" });
    if (!r.ok)
      throw new Error("Unable to load the FFmpeg class worker asset.");
    const t = await r.text();
    return URL.createObjectURL(new Blob([t], {
      type: "text/javascript"
    }));
  }
  /**
   * Mediabunny出力と元動画のオーディオをFFmpegでマージ
   */
  async mergeVideoAndAudioWithFFmpeg(e, r) {
    const t = "mediabunny-video.mp4", i = "mediabunny-audio-source.mp4", n = "mediabunny-merged.mp4", l = async (o) => {
      if (!o) return;
      const c = [t, i, n];
      for (const d of c)
        try {
          await o.deleteFile(d);
        } catch {
        }
    };
    try {
      if (this.isAborted())
        return this.log("Abort detected before audio mux"), null;
      await this.loadFFmpeg();
      const o = this.ffmpeg;
      if (!o)
        return h(this.context, "FFmpeg instance unavailable for audio mux"), null;
      await o.writeFile(t, await m(e)), await o.writeFile(i, await m(r));
      const c = [
        "-i",
        t,
        "-i",
        i,
        "-map",
        "0:v:0",
        "-map",
        "1:a:0",
        "-c:v",
        "copy",
        "-c:a",
        "copy",
        "-movflags",
        "+faststart",
        "-shortest",
        "-y",
        n
      ];
      if (this.log("Executing FFmpeg audio mux with args:", c), this.isCompressing = !0, await o.exec(c), this.isAborted())
        return this.log("Abort detected during audio mux"), await l(o), null;
      const d = await o.readFile(n), f = new Blob([d], { type: "video/mp4" });
      return await l(o), f;
    } catch (o) {
      return this.isAborted() ? this.log("Audio mux aborted, returning null") : h(this.context, "Failed to mux audio with FFmpeg copy:", o), await l(this.ffmpeg), null;
    } finally {
      this.isCompressing = !1;
    }
  }
  /**
   * FFmpegコマンドライン引数を構築
   */
  buildFFmpegArgs(e, r, t) {
    const i = [
      "-i",
      e,
      "-c:v",
      "libx264",
      "-crf",
      String(t.crf),
      "-preset",
      t.preset,
      "-c:a",
      "aac",
      "-b:a",
      t.audioBitrate || "128k"
    ];
    if (t.audioSampleRate && i.push("-ar", String(t.audioSampleRate)), t.audioChannels && i.push("-ac", String(t.audioChannels)), t.maxSize) {
      const n = `scale='if(gte(iw,ih),min(${t.maxSize},iw),-2)':'if(lt(iw,ih),min(${t.maxSize},ih),-2)'`;
      i.push("-vf", n);
    }
    return i.push("-movflags", "+faststart", "-y", r), i;
  }
  /**
   * FFmpegを使用して動画を圧縮
   */
  async compressWithFFmpeg(e, r) {
    try {
      this.log("Loading FFmpeg..."), await this.loadFFmpeg();
      const t = this.checkAbort(e);
      if (t) return t;
      if (!this.ffmpeg)
        throw new Error("FFmpeg not loaded");
      const i = "input.mp4", n = "output.mp4";
      await this.ffmpeg.writeFile(i, await m(e));
      const l = this.buildFFmpegArgs(i, n, r), o = this.checkAbort(e);
      if (o)
        return await this.ffmpeg.deleteFile(i), o;
      this.log("Starting compression with args:", l), this.isCompressing = !0;
      try {
        await this.ffmpeg.exec(l);
      } catch (f) {
        if (this.isAborted())
          this.log("Compression aborted during execution");
        else
          throw console.error("[FFmpegCompression] FFmpeg execution error:", f), f;
      } finally {
        this.isCompressing = !1;
      }
      if (this.isAborted()) {
        this.log("Cleaning up after abort");
        try {
          await this.ffmpeg.deleteFile(i), await this.ffmpeg.deleteFile(n);
        } catch {
        }
        return { file: e, wasCompressed: !1, wasSkipped: !0, aborted: !0 };
      }
      const c = await this.ffmpeg.readFile(n), d = new Blob([c], { type: "video/mp4" });
      return await this.ffmpeg.deleteFile(i), await this.ffmpeg.deleteFile(n), g(d, e, this.context);
    } catch (t) {
      return this.isCompressing = !1, this.isAborted() ? (this.log("Compression aborted, using original file"), { file: e, wasCompressed: !1, wasSkipped: !0, aborted: !0 }) : (console.error("[FFmpegCompression] Compression failed:", t), { file: e, wasCompressed: !1, wasSkipped: !0 });
    }
  }
  /**
   * リソースのクリーンアップ
   */
  async cleanup() {
    if (this.ffmpeg && this.isLoaded)
      try {
        this.isLoaded = !1, this.ffmpeg = null, this.loadPromise = null;
      } catch (e) {
        console.error("[FFmpegCompression] Cleanup error:", e);
      }
  }
}
export {
  y as FFmpegCompression
};
