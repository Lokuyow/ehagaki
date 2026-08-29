import { i as Yo } from "./HostOwnedComposerLiteApp-E0K6sDIY.js";
function g(r) {
  if (!r)
    throw new Error("Assertion failed.");
}
const Ar = (r) => {
  const e = (r % 360 + 360) % 360;
  if (e === 0 || e === 90 || e === 180 || e === 270)
    return e;
  throw new Error(`Invalid rotation ${r}.`);
}, te = (r) => r && r[r.length - 1], yt = (r) => r >= 0 && r < 2 ** 32, M = (r) => {
  let e = 0;
  for (; r.readBits(1) === 0 && e < 32; )
    e++;
  if (e >= 32)
    throw new Error("Invalid exponential-Golomb code.");
  return (1 << e) - 1 + r.readBits(e);
}, st = (r) => {
  const e = M(r);
  return (e & 1) === 0 ? -(e >> 1) : e + 1 >> 1;
}, be = (r) => r.constructor === Uint8Array ? r : ArrayBuffer.isView(r) ? new Uint8Array(r.buffer, r.byteOffset, r.byteLength) : new Uint8Array(r), K = (r) => r.constructor === DataView ? r : ArrayBuffer.isView(r) ? new DataView(r.buffer, r.byteOffset, r.byteLength) : new DataView(r), Ae = /* @__PURE__ */ new TextDecoder(), Ke = /* @__PURE__ */ new TextEncoder(), Bn = (r) => Object.fromEntries(Object.entries(r).map(([e, t]) => [t, e])), tr = {
  bt709: 1,
  // ITU-R BT.709
  bt470bg: 5,
  // ITU-R BT.470BG
  smpte170m: 6,
  // ITU-R BT.601 525 - SMPTE 170M
  bt2020: 9,
  // ITU-R BT.202
  smpte432: 12
  // SMPTE EG 432-1
}, Jr = /* @__PURE__ */ Bn(tr), rr = {
  bt709: 1,
  // ITU-R BT.709
  smpte170m: 6,
  // SMPTE 170M
  linear: 8,
  // Linear transfer characteristics
  "iec61966-2-1": 13,
  // IEC 61966-2-1
  pq: 16,
  // Rec. ITU-R BT.2100-2 perceptual quantization (PQ) system
  hlg: 18
  // Rec. ITU-R BT.2100-2 hybrid loggamma (HLG) system
}, ei = /* @__PURE__ */ Bn(rr), ir = {
  rgb: 0,
  // Identity
  bt709: 1,
  // ITU-R BT.709
  bt470bg: 5,
  // ITU-R BT.470BG
  smpte170m: 6,
  // SMPTE 170M
  "bt2020-ncl": 9
  // ITU-R BT.2020-2 (non-constant luminance)
}, ti = /* @__PURE__ */ Bn(ir), Zo = (r) => !!r && !!r.primaries && !!r.transfer && !!r.matrix && r.fullRange !== void 0, Br = (r) => r instanceof ArrayBuffer || typeof SharedArrayBuffer < "u" && r instanceof SharedArrayBuffer || ArrayBuffer.isView(r);
class nr {
  constructor() {
    this.currentPromise = Promise.resolve(), this.pending = 0;
  }
  async acquire() {
    let e;
    const t = new Promise((n) => {
      let s = !1;
      e = () => {
        s || (n(), this.pending--, s = !0);
      };
    }), i = this.currentPromise;
    return this.currentPromise = t, this.pending++, await i, e;
  }
}
const Jo = /^[0-9a-fA-F]+$/, Sr = (r) => [...r].map((e) => e.toString(16).padStart(2, "0")).join(""), ec = (r) => {
  g(r.length % 2 === 0);
  const e = new Uint8Array(r.length / 2);
  for (let t = 0; t < r.length; t += 2)
    e[t / 2] = parseInt(r.slice(t, t + 2), 16);
  return e;
}, os = (r) => (r = r >> 1 & 1431655765 | (r & 1431655765) << 1, r = r >> 2 & 858993459 | (r & 858993459) << 2, r = r >> 4 & 252645135 | (r & 252645135) << 4, r = r >> 8 & 16711935 | (r & 16711935) << 8, r = r >> 16 & 65535 | (r & 65535) << 16, r >>> 0), Rr = (r, e, t) => {
  let i = 0, n = r.length - 1, s = -1;
  for (; i <= n; ) {
    const a = i + n >> 1, o = t(r[a]);
    o === e ? (s = a, n = a - 1) : o < e ? i = a + 1 : n = a - 1;
  }
  return s;
}, G = (r, e, t) => {
  let i = 0, n = r.length - 1, s = -1;
  for (; i <= n; ) {
    const a = i + (n - i + 1) / 2 | 0;
    t(r[a]) <= e ? (s = a, i = a + 1) : n = a - 1;
  }
  return s;
}, cs = (r, e, t) => {
  const i = G(r, t(e), t);
  r.splice(i + 1, 0, e);
}, ne = () => {
  let r, e;
  return { promise: new Promise((i, n) => {
    r = i, e = n;
  }), resolve: r, reject: e };
}, cn = (r, e) => {
  const t = r.indexOf(e);
  t !== -1 && r.splice(t, 1);
}, Aa = (r, e) => {
  for (let t = r.length - 1; t >= 0; t--)
    if (e(r[t]))
      return r[t];
}, Rn = (r, e) => {
  for (let t = r.length - 1; t >= 0; t--)
    if (e(r[t]))
      return t;
  return -1;
}, tc = async function* (r) {
  Symbol.iterator in r ? yield* r[Symbol.iterator]() : yield* r[Symbol.asyncIterator]();
}, rc = (r) => {
  if (!(Symbol.iterator in r) && !(Symbol.asyncIterator in r))
    throw new TypeError("Argument must be an iterable or async iterable.");
}, Re = (r) => {
  throw new Error(`Unexpected value: ${r}`);
}, pi = (r, e, t) => {
  const i = r.getUint8(e), n = r.getUint8(e + 1), s = r.getUint8(e + 2);
  return t ? i | n << 8 | s << 16 : i << 16 | n << 8 | s;
}, ic = (r, e, t) => pi(r, e, t) << 8 >> 8, Fn = (r, e, t, i) => {
  t = t >>> 0, t = t & 16777215, i ? (r.setUint8(e, t & 255), r.setUint8(e + 1, t >>> 8 & 255), r.setUint8(e + 2, t >>> 16 & 255)) : (r.setUint8(e, t >>> 16 & 255), r.setUint8(e + 1, t >>> 8 & 255), r.setUint8(e + 2, t & 255));
}, nc = (r, e, t, i) => {
  t = ae(t, -8388608, 8388607), t < 0 && (t = t + 16777216 & 16777215), Fn(r, e, t, i);
}, ae = (r, e, t) => Math.max(e, Math.min(t, r)), sc = (r, e, t) => r + (e - r) * t, ge = "und", xr = (r) => {
  const e = Math.round(r);
  return Math.abs(r / e - 1) < 10 * Number.EPSILON ? e : r;
}, ln = (r, e) => Math.round(r / e) * e, ri = (r, e) => Math.round(r * e) / e, vi = (r, e) => Math.floor(r / e) * e, ls = (r, e) => Math.floor(r * e) / e, ac = (r) => {
  let e = 0;
  for (; r; )
    e++, r >>= 1;
  return e;
}, un = (r) => {
  let e = 0;
  for (; r !== 0; )
    r &= r - 1, e++;
  return e;
}, oc = /^[a-z]{3}$/, Pr = (r) => oc.test(r), mt = 1e6 * (1 + Number.EPSILON), cc = (r, e) => {
  const t = r < 0 ? -1 : 1;
  r = Math.abs(r);
  let i = 0, n = 1, s = 1, a = 0, o = r;
  for (; ; ) {
    const c = Math.floor(o), l = c * s + i, u = c * a + n;
    if (u > e)
      return {
        num: t * s,
        den: a
      };
    if (i = s, n = a, s = l, a = u, o = 1 / (o - c), !isFinite(o))
      break;
  }
  return {
    num: t * s,
    den: a
  };
};
class gi {
  constructor() {
    this.currentPromise = Promise.resolve();
  }
  call(e) {
    return this.currentPromise = this.currentPromise.then(e);
  }
}
let Bi = null;
const wr = () => Bi !== null ? Bi : Bi = !!(typeof navigator < "u" && // eslint-disable-next-line @typescript-eslint/no-deprecated
(navigator.vendor?.match(/apple/i) || /AppleWebKit/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) || /\b(iPad|iPhone|iPod)\b/.test(navigator.userAgent)));
let Ri = null;
const Sa = () => Ri !== null ? Ri : Ri = typeof navigator < "u" && navigator.userAgent?.includes("Firefox");
let Fi = null;
const dn = () => Fi !== null ? Fi : Fi = !!(typeof navigator < "u" && (navigator.vendor?.includes("Google Inc") || /Chrome/.test(navigator.userAgent)));
let Mi = null;
const lc = () => {
  if (Mi !== null)
    return Mi;
  if (typeof navigator > "u")
    return null;
  const r = /\bChrome\/(\d+)/.exec(navigator.userAgent);
  return r ? Mi = Number(r[1]) : null;
}, yi = (r) => typeof globalThis.isSecureContext < "u" && !globalThis.isSecureContext ? `${r} is not available in this environment; this may be because this page is running in an insecure context. Try serving your page over HTTPS or use localhost.` : `${r} is not available in this environment.`, Dt = (r, e) => r !== -1 ? r : e, us = (r, e, t, i) => r <= i && t <= e, xa = function* (r) {
  for (const e in r) {
    const t = r[e];
    t !== void 0 && (yield { key: e, value: t });
  }
}, ii = (r) => {
  const e = atob(r), t = new Uint8Array(e.length);
  for (let i = 0; i < e.length; i++)
    t[i] = e.charCodeAt(i);
  return t;
}, uc = (r, e) => {
  if (r.length !== e.length)
    return !1;
  for (let t = 0; t < r.length; t++)
    if (r[t] !== e[t])
      return !1;
  return !0;
}, Mn = () => {
  Symbol.dispose ??= Symbol("Symbol.dispose");
}, zn = (r) => typeof r == "number" && !Number.isNaN(r), ht = (r, e) => {
  if (e.includes("://"))
    return e;
  if (r.includes("://")) {
    const o = r.indexOf("?");
    o !== -1 && (r = r.slice(0, o));
  }
  let t;
  if (e.startsWith("/")) {
    const o = r.indexOf("://");
    if (o === -1)
      t = e;
    else {
      const c = r.indexOf("/", o + 3);
      c === -1 ? t = r + e : t = r.slice(0, c) + e;
    }
  } else {
    const o = r.lastIndexOf("/");
    o === -1 ? t = e : t = r.slice(0, o + 1) + e;
  }
  let i = "";
  const n = t.indexOf("://");
  if (n !== -1) {
    const o = t.indexOf("/", n + 3);
    o !== -1 && (i = t.slice(0, o), t = t.slice(o));
  }
  const s = t.split("/"), a = [];
  for (const o of s)
    o === ".." ? a.pop() : o !== "." && a.push(o);
  return i + a.join("/");
}, pr = (r, e) => {
  let t = 0;
  for (let i = 0; i < r.length; i++)
    e(r[i]) && t++;
  return t;
}, On = (r, e) => {
  let t = -1, i = 1 / 0;
  for (let n = 0; n < r.length; n++) {
    const s = e(r[n]);
    s < i && (i = s, t = n);
  }
  return t;
}, Cr = (r) => {
  g(Number.isInteger(r.num)), g(Number.isInteger(r.den)), g(r.den !== 0);
  let e = Math.abs(r.num), t = Math.abs(r.den);
  for (; t !== 0; ) {
    const n = e % t;
    e = t, t = n;
  }
  const i = e || 1;
  return {
    num: r.num / i,
    den: r.den / i
  };
}, zi = (r, e) => {
  if (typeof r != "object" || !r)
    throw new TypeError(`${e} must be an object.`);
  if (!Number.isInteger(r.left) || r.left < 0)
    throw new TypeError(`${e}.left must be a non-negative integer.`);
  if (!Number.isInteger(r.top) || r.top < 0)
    throw new TypeError(`${e}.top must be a non-negative integer.`);
  if (!Number.isInteger(r.width) || r.width < 0)
    throw new TypeError(`${e}.width must be a non-negative integer.`);
  if (!Number.isInteger(r.height) || r.height < 0)
    throw new TypeError(`${e}.height must be a non-negative integer.`);
}, Pa = (r) => new Promise((e) => setTimeout(e, r)), ds = (r) => Array.isArray(r) ? r : [r];
class Fr {
  constructor() {
    this._listeners = /* @__PURE__ */ new Map();
  }
  /** Registers a listener for the given event. Returns a function that, when called, removes the listener again. */
  on(e, t, i) {
    this._listeners.has(e) || this._listeners.set(e, /* @__PURE__ */ new Set());
    const n = { fn: t, once: i?.once ?? !1 };
    return this._listeners.get(e).add(n), () => {
      this._listeners.get(e)?.delete(n);
    };
  }
  /** @internal */
  _emit(...e) {
    const [t, i] = e, n = this._listeners.get(t);
    if (n)
      for (const s of n) {
        try {
          s.fn(i);
        } catch (a) {
          console.error(a);
        }
        s.once && n.delete(s);
      }
  }
}
const Mt = (r) => Math.ceil(r / 2) * 2, dc = (r) => r !== null && typeof r == "object" && Object.getPrototypeOf(r) === Object.prototype && Object.values(r).every((e) => typeof e == "string");
var qe;
(function(r) {
  r[r.Silent = 0] = "Silent", r[r.Errors = 1] = "Errors", r[r.Warnings = 2] = "Warnings", r[r.Info = 3] = "Info";
})(qe || (qe = {}));
class q {
  constructor() {
  }
  /** The current log level. Defaults to {@link LogLevel.Info}. */
  static get level() {
    return q._level;
  }
  static set level(e) {
    if (e !== qe.Silent && e !== qe.Errors && e !== qe.Warnings && e !== qe.Info)
      throw new TypeError("Invalid log level. Use one of the values of the LogLevel enum.");
    q._level = e;
  }
  /** @internal */
  static get _emitter() {
    return q._emitterInstance ??= new Fr();
  }
  /** Registers a listener for a log event. Returns a function that, when called, removes the listener again. */
  static on(e, t, i) {
    return q._emitter.on(e, t, i);
  }
  /** @internal */
  static _error(...e) {
    q._emitter._emit("error", e), q._level >= qe.Errors && console.error(...e);
  }
  /** @internal */
  static _warn(...e) {
    q._emitter._emit("warn", e), q._level >= qe.Warnings && console.warn(...e);
  }
  /** @internal */
  static _info(...e) {
    q._emitter._emit("info", e), q._level >= qe.Info && console.info(...e);
  }
}
q._level = qe.Info;
q._emitterInstance = null;
class Qt {
  /** Creates a new {@link RichImageData}. */
  constructor(e, t) {
    if (this.data = e, this.mimeType = t, !(e instanceof Uint8Array))
      throw new TypeError("data must be a Uint8Array.");
    if (typeof t != "string")
      throw new TypeError("mimeType must be a string.");
  }
}
class Ca {
  /** Creates a new {@link AttachedFile}. */
  constructor(e, t, i, n) {
    if (this.data = e, this.mimeType = t, this.name = i, this.description = n, !(e instanceof Uint8Array))
      throw new TypeError("data must be a Uint8Array.");
    if (t !== void 0 && typeof t != "string")
      throw new TypeError("mimeType, when provided, must be a string.");
    if (i !== void 0 && typeof i != "string")
      throw new TypeError("name, when provided, must be a string.");
    if (n !== void 0 && typeof n != "string")
      throw new TypeError("description, when provided, must be a string.");
  }
}
const fn = (r) => {
  if (!r || typeof r != "object")
    throw new TypeError("tags must be an object.");
  if (r.title !== void 0 && typeof r.title != "string")
    throw new TypeError("tags.title, when provided, must be a string.");
  if (r.description !== void 0 && typeof r.description != "string")
    throw new TypeError("tags.description, when provided, must be a string.");
  if (r.artist !== void 0 && typeof r.artist != "string")
    throw new TypeError("tags.artist, when provided, must be a string.");
  if (r.album !== void 0 && typeof r.album != "string")
    throw new TypeError("tags.album, when provided, must be a string.");
  if (r.albumArtist !== void 0 && typeof r.albumArtist != "string")
    throw new TypeError("tags.albumArtist, when provided, must be a string.");
  if (r.trackNumber !== void 0 && (!Number.isInteger(r.trackNumber) || r.trackNumber <= 0))
    throw new TypeError("tags.trackNumber, when provided, must be a positive integer.");
  if (r.tracksTotal !== void 0 && (!Number.isInteger(r.tracksTotal) || r.tracksTotal <= 0))
    throw new TypeError("tags.tracksTotal, when provided, must be a positive integer.");
  if (r.discNumber !== void 0 && (!Number.isInteger(r.discNumber) || r.discNumber <= 0))
    throw new TypeError("tags.discNumber, when provided, must be a positive integer.");
  if (r.discsTotal !== void 0 && (!Number.isInteger(r.discsTotal) || r.discsTotal <= 0))
    throw new TypeError("tags.discsTotal, when provided, must be a positive integer.");
  if (r.genre !== void 0 && typeof r.genre != "string")
    throw new TypeError("tags.genre, when provided, must be a string.");
  if (r.date !== void 0 && (!(r.date instanceof Date) || Number.isNaN(r.date.getTime())))
    throw new TypeError("tags.date, when provided, must be a valid Date.");
  if (r.lyrics !== void 0 && typeof r.lyrics != "string")
    throw new TypeError("tags.lyrics, when provided, must be a string.");
  if (r.images !== void 0) {
    if (!Array.isArray(r.images))
      throw new TypeError("tags.images, when provided, must be an array.");
    for (const e of r.images) {
      if (!e || typeof e != "object")
        throw new TypeError("Each image in tags.images must be an object.");
      if (!(e.data instanceof Uint8Array))
        throw new TypeError("Each image.data must be a Uint8Array.");
      if (typeof e.mimeType != "string")
        throw new TypeError("Each image.mimeType must be a string.");
      if (!["coverFront", "coverBack", "unknown"].includes(e.kind))
        throw new TypeError("Each image.kind must be 'coverFront', 'coverBack', or 'unknown'.");
    }
  }
  if (r.comment !== void 0 && typeof r.comment != "string")
    throw new TypeError("tags.comment, when provided, must be a string.");
  if (r.raw !== void 0) {
    if (!r.raw || typeof r.raw != "object")
      throw new TypeError("tags.raw, when provided, must be an object.");
    for (const e of Object.values(r.raw))
      if (e !== null && typeof e != "string" && !(e instanceof Uint8Array) && !(e instanceof Qt) && !(e instanceof Ca) && !dc(e))
        throw new TypeError("Each value in tags.raw must be a string, Uint8Array, RichImageData, AttachedFile, Record<string, string>, or null.");
  }
}, ct = {
  default: !0,
  primary: !0,
  forced: !1,
  original: !1,
  commentary: !1,
  hearingImpaired: !1,
  visuallyImpaired: !1
}, fc = (r) => {
  if (!r || typeof r != "object")
    throw new TypeError("disposition must be an object.");
  if (r.default !== void 0 && typeof r.default != "boolean")
    throw new TypeError("disposition.default must be a boolean.");
  if (r.primary !== void 0 && typeof r.primary != "boolean")
    throw new TypeError("disposition.primary must be a boolean.");
  if (r.forced !== void 0 && typeof r.forced != "boolean")
    throw new TypeError("disposition.forced must be a boolean.");
  if (r.original !== void 0 && typeof r.original != "boolean")
    throw new TypeError("disposition.original must be a boolean.");
  if (r.commentary !== void 0 && typeof r.commentary != "boolean")
    throw new TypeError("disposition.commentary must be a boolean.");
  if (r.hearingImpaired !== void 0 && typeof r.hearingImpaired != "boolean")
    throw new TypeError("disposition.hearingImpaired must be a boolean.");
  if (r.visuallyImpaired !== void 0 && typeof r.visuallyImpaired != "boolean")
    throw new TypeError("disposition.visuallyImpaired must be a boolean.");
};
class Q {
  constructor(e) {
    this.bytes = e, this.pos = 0;
  }
  seekToByte(e) {
    this.pos = 8 * e;
  }
  readBit() {
    const e = Math.floor(this.pos / 8), t = this.bytes[e] ?? 0, i = 7 - (this.pos & 7), n = (t & 1 << i) >> i;
    return this.pos++, n;
  }
  readBits(e) {
    if (e === 1)
      return this.readBit();
    let t = 0;
    for (let i = 0; i < e; i++)
      t <<= 1, t |= this.readBit();
    return t;
  }
  writeBits(e, t) {
    const i = this.pos + e;
    for (let n = this.pos; n < i; n++) {
      const s = Math.floor(n / 8);
      let a = this.bytes[s];
      const o = 7 - (n & 7);
      a &= ~(1 << o), a |= (t & 1 << i - n - 1) >> i - n - 1 << o, this.bytes[s] = a;
    }
    this.pos = i;
  }
  readAlignedByte() {
    if (this.pos % 8 !== 0)
      throw new Error("Bitstream is not byte-aligned.");
    const e = this.pos / 8, t = this.bytes[e] ?? 0;
    return this.pos += 8, t;
  }
  skipBits(e) {
    this.pos += e;
  }
  getBitsLeft() {
    return this.bytes.length * 8 - this.pos;
  }
  clone() {
    const e = new Q(this.bytes);
    return e.pos = this.pos, e;
  }
}
const Rt = [
  96e3,
  88200,
  64e3,
  48e3,
  44100,
  32e3,
  24e3,
  22050,
  16e3,
  12e3,
  11025,
  8e3,
  7350
], Mr = [-1, 1, 2, 3, 4, 5, 6, 8], Dn = (r) => {
  if (!r || r.byteLength < 2)
    throw new TypeError("AAC description must be at least 2 bytes long.");
  const e = new Q(r);
  let t = e.readBits(5);
  t === 31 && (t = 32 + e.readBits(6));
  const i = e.readBits(4);
  let n = null;
  i === 15 ? n = e.readBits(24) : i < Rt.length && (n = Rt[i]);
  const s = e.readBits(4);
  let a = null;
  return s >= 1 && s <= 7 && (a = Mr[s]), {
    objectType: t,
    frequencyIndex: i,
    sampleRate: n,
    channelConfiguration: s,
    numberOfChannels: a
  };
}, Ea = (r) => {
  let e = Rt.indexOf(r.sampleRate), t = null;
  e === -1 && (e = 15, t = r.sampleRate);
  const i = Mr.indexOf(r.numberOfChannels);
  if (i === -1)
    throw new TypeError(`Unsupported number of channels: ${r.numberOfChannels}`);
  let n = 13;
  r.objectType >= 32 && (n += 6), e === 15 && (n += 24);
  const s = Math.ceil(n / 8), a = new Uint8Array(s), o = new Q(a);
  return r.objectType < 32 ? o.writeBits(5, r.objectType) : (o.writeBits(5, 31), o.writeBits(6, r.objectType - 32)), o.writeBits(4, e), e === 15 && o.writeBits(24, t), o.writeBits(4, i), a;
};
const Ce = [
  "avc",
  "hevc",
  "vp9",
  "av1",
  "vp8",
  "prores"
], ye = [
  "pcm-s16",
  // We don't prefix 'le' so we're compatible with the WebCodecs-registered PCM codec strings
  "pcm-s16be",
  "pcm-s24",
  "pcm-s24be",
  "pcm-s32",
  "pcm-s32be",
  "pcm-f32",
  "pcm-f32be",
  "pcm-f64",
  "pcm-f64be",
  "pcm-u8",
  "pcm-s8",
  "ulaw",
  "alaw"
], Gt = [
  "aac",
  "opus",
  "mp3",
  "vorbis",
  "flac",
  "ac3",
  "eac3",
  "dts"
], Ee = [
  ...Gt,
  ...ye
], Er = [
  "webvtt"
], ni = [
  { maxMacroblocks: 99, maxBitrate: 64e3, maxDpbMbs: 396, level: 10 },
  // Level 1
  { maxMacroblocks: 396, maxBitrate: 192e3, maxDpbMbs: 900, level: 11 },
  // Level 1.1
  { maxMacroblocks: 396, maxBitrate: 384e3, maxDpbMbs: 2376, level: 12 },
  // Level 1.2
  { maxMacroblocks: 396, maxBitrate: 768e3, maxDpbMbs: 2376, level: 13 },
  // Level 1.3
  { maxMacroblocks: 396, maxBitrate: 2e6, maxDpbMbs: 2376, level: 20 },
  // Level 2
  { maxMacroblocks: 792, maxBitrate: 4e6, maxDpbMbs: 4752, level: 21 },
  // Level 2.1
  { maxMacroblocks: 1620, maxBitrate: 4e6, maxDpbMbs: 8100, level: 22 },
  // Level 2.2
  { maxMacroblocks: 1620, maxBitrate: 1e7, maxDpbMbs: 8100, level: 30 },
  // Level 3
  { maxMacroblocks: 3600, maxBitrate: 14e6, maxDpbMbs: 18e3, level: 31 },
  // Level 3.1
  { maxMacroblocks: 5120, maxBitrate: 2e7, maxDpbMbs: 20480, level: 32 },
  // Level 3.2
  { maxMacroblocks: 8192, maxBitrate: 2e7, maxDpbMbs: 32768, level: 40 },
  // Level 4
  { maxMacroblocks: 8192, maxBitrate: 5e7, maxDpbMbs: 32768, level: 41 },
  // Level 4.1
  { maxMacroblocks: 8704, maxBitrate: 5e7, maxDpbMbs: 34816, level: 42 },
  // Level 4.2
  { maxMacroblocks: 22080, maxBitrate: 135e6, maxDpbMbs: 110400, level: 50 },
  // Level 5
  { maxMacroblocks: 36864, maxBitrate: 24e7, maxDpbMbs: 184320, level: 51 },
  // Level 5.1
  { maxMacroblocks: 36864, maxBitrate: 24e7, maxDpbMbs: 184320, level: 52 },
  // Level 5.2
  { maxMacroblocks: 139264, maxBitrate: 24e7, maxDpbMbs: 696320, level: 60 },
  // Level 6
  { maxMacroblocks: 139264, maxBitrate: 48e7, maxDpbMbs: 696320, level: 61 },
  // Level 6.1
  { maxMacroblocks: 139264, maxBitrate: 8e8, maxDpbMbs: 696320, level: 62 }
  // Level 6.2
], fs = [
  { maxPictureSize: 36864, maxBitrate: 128e3, tier: "L", level: 30 },
  // Level 1 (Low Tier)
  { maxPictureSize: 122880, maxBitrate: 15e5, tier: "L", level: 60 },
  // Level 2 (Low Tier)
  { maxPictureSize: 245760, maxBitrate: 3e6, tier: "L", level: 63 },
  // Level 2.1 (Low Tier)
  { maxPictureSize: 552960, maxBitrate: 6e6, tier: "L", level: 90 },
  // Level 3 (Low Tier)
  { maxPictureSize: 983040, maxBitrate: 1e7, tier: "L", level: 93 },
  // Level 3.1 (Low Tier)
  { maxPictureSize: 2228224, maxBitrate: 12e6, tier: "L", level: 120 },
  // Level 4 (Low Tier)
  { maxPictureSize: 2228224, maxBitrate: 3e7, tier: "H", level: 120 },
  // Level 4 (High Tier)
  { maxPictureSize: 2228224, maxBitrate: 2e7, tier: "L", level: 123 },
  // Level 4.1 (Low Tier)
  { maxPictureSize: 2228224, maxBitrate: 5e7, tier: "H", level: 123 },
  // Level 4.1 (High Tier)
  { maxPictureSize: 8912896, maxBitrate: 25e6, tier: "L", level: 150 },
  // Level 5 (Low Tier)
  { maxPictureSize: 8912896, maxBitrate: 1e8, tier: "H", level: 150 },
  // Level 5 (High Tier)
  { maxPictureSize: 8912896, maxBitrate: 4e7, tier: "L", level: 153 },
  // Level 5.1 (Low Tier)
  { maxPictureSize: 8912896, maxBitrate: 16e7, tier: "H", level: 153 },
  // Level 5.1 (High Tier)
  { maxPictureSize: 8912896, maxBitrate: 6e7, tier: "L", level: 156 },
  // Level 5.2 (Low Tier)
  { maxPictureSize: 8912896, maxBitrate: 24e7, tier: "H", level: 156 },
  // Level 5.2 (High Tier)
  { maxPictureSize: 35651584, maxBitrate: 6e7, tier: "L", level: 180 },
  // Level 6 (Low Tier)
  { maxPictureSize: 35651584, maxBitrate: 24e7, tier: "H", level: 180 },
  // Level 6 (High Tier)
  { maxPictureSize: 35651584, maxBitrate: 12e7, tier: "L", level: 183 },
  // Level 6.1 (Low Tier)
  { maxPictureSize: 35651584, maxBitrate: 48e7, tier: "H", level: 183 },
  // Level 6.1 (High Tier)
  { maxPictureSize: 35651584, maxBitrate: 24e7, tier: "L", level: 186 },
  // Level 6.2 (Low Tier)
  { maxPictureSize: 35651584, maxBitrate: 8e8, tier: "H", level: 186 }
  // Level 6.2 (High Tier)
], pt = [
  { maxPictureSize: 36864, maxBitrate: 2e5, level: 10 },
  // Level 1
  { maxPictureSize: 73728, maxBitrate: 8e5, level: 11 },
  // Level 1.1
  { maxPictureSize: 122880, maxBitrate: 18e5, level: 20 },
  // Level 2
  { maxPictureSize: 245760, maxBitrate: 36e5, level: 21 },
  // Level 2.1
  { maxPictureSize: 552960, maxBitrate: 72e5, level: 30 },
  // Level 3
  { maxPictureSize: 983040, maxBitrate: 12e6, level: 31 },
  // Level 3.1
  { maxPictureSize: 2228224, maxBitrate: 18e6, level: 40 },
  // Level 4
  { maxPictureSize: 2228224, maxBitrate: 3e7, level: 41 },
  // Level 4.1
  { maxPictureSize: 8912896, maxBitrate: 6e7, level: 50 },
  // Level 5
  { maxPictureSize: 8912896, maxBitrate: 12e7, level: 51 },
  // Level 5.1
  { maxPictureSize: 8912896, maxBitrate: 18e7, level: 52 },
  // Level 5.2
  { maxPictureSize: 35651584, maxBitrate: 18e7, level: 60 },
  // Level 6
  { maxPictureSize: 35651584, maxBitrate: 24e7, level: 61 },
  // Level 6.1
  { maxPictureSize: 35651584, maxBitrate: 48e7, level: 62 }
  // Level 6.2
], hs = [
  { maxPictureSize: 147456, maxBitrate: 15e5, tier: "M", level: 0 },
  // Level 2.0 (Main Tier)
  { maxPictureSize: 278784, maxBitrate: 3e6, tier: "M", level: 1 },
  // Level 2.1 (Main Tier)
  { maxPictureSize: 665856, maxBitrate: 6e6, tier: "M", level: 4 },
  // Level 3.0 (Main Tier)
  { maxPictureSize: 1065024, maxBitrate: 1e7, tier: "M", level: 5 },
  // Level 3.1 (Main Tier)
  { maxPictureSize: 2359296, maxBitrate: 12e6, tier: "M", level: 8 },
  // Level 4.0 (Main Tier)
  { maxPictureSize: 2359296, maxBitrate: 3e7, tier: "H", level: 8 },
  // Level 4.0 (High Tier)
  { maxPictureSize: 2359296, maxBitrate: 2e7, tier: "M", level: 9 },
  // Level 4.1 (Main Tier)
  { maxPictureSize: 2359296, maxBitrate: 5e7, tier: "H", level: 9 },
  // Level 4.1 (High Tier)
  { maxPictureSize: 8912896, maxBitrate: 3e7, tier: "M", level: 12 },
  // Level 5.0 (Main Tier)
  { maxPictureSize: 8912896, maxBitrate: 1e8, tier: "H", level: 12 },
  // Level 5.0 (High Tier)
  { maxPictureSize: 8912896, maxBitrate: 4e7, tier: "M", level: 13 },
  // Level 5.1 (Main Tier)
  { maxPictureSize: 8912896, maxBitrate: 16e7, tier: "H", level: 13 },
  // Level 5.1 (High Tier)
  { maxPictureSize: 8912896, maxBitrate: 6e7, tier: "M", level: 14 },
  // Level 5.2 (Main Tier)
  { maxPictureSize: 8912896, maxBitrate: 24e7, tier: "H", level: 14 },
  // Level 5.2 (High Tier)
  { maxPictureSize: 35651584, maxBitrate: 6e7, tier: "M", level: 15 },
  // Level 5.3 (Main Tier)
  { maxPictureSize: 35651584, maxBitrate: 24e7, tier: "H", level: 15 },
  // Level 5.3 (High Tier)
  { maxPictureSize: 35651584, maxBitrate: 6e7, tier: "M", level: 16 },
  // Level 6.0 (Main Tier)
  { maxPictureSize: 35651584, maxBitrate: 24e7, tier: "H", level: 16 },
  // Level 6.0 (High Tier)
  { maxPictureSize: 35651584, maxBitrate: 1e8, tier: "M", level: 17 },
  // Level 6.1 (Main Tier)
  { maxPictureSize: 35651584, maxBitrate: 48e7, tier: "H", level: 17 },
  // Level 6.1 (High Tier)
  { maxPictureSize: 35651584, maxBitrate: 16e7, tier: "M", level: 18 },
  // Level 6.2 (Main Tier)
  { maxPictureSize: 35651584, maxBitrate: 8e8, tier: "H", level: 18 },
  // Level 6.2 (High Tier)
  { maxPictureSize: 35651584, maxBitrate: 16e7, tier: "M", level: 19 },
  // Level 6.3 (Main Tier)
  { maxPictureSize: 35651584, maxBitrate: 8e8, tier: "H", level: 19 }
  // Level 6.3 (High Tier)
], ms = ".01.01.01.01.00", ps = ".0.110.01.01.01.0", It = [
  "ap4x",
  // ProRes 4444 XQ
  "ap4h",
  // ProRes 4444
  "apch",
  // ProRes 422 High Quality
  "apcn",
  // ProRes 422 Standard Definition
  "apcs",
  // ProRes 422 LT
  "apco"
  // ProRes 422 Proxy
], si = [
  "dtsc",
  // DTS core
  "dtsh",
  // DTS-HD, core plus extension substreams
  "dtsl",
  // DTS-HD Lossless, no core
  "dtse"
  // DTS Express
], hc = [
  { fourCc: "apco", bitrate: 45e6, alpha: !1 },
  // 422 Proxy
  { fourCc: "apcs", bitrate: 102e6, alpha: !1 },
  // 422 LT
  { fourCc: "apcn", bitrate: 147e6, alpha: !1 },
  // 422 Standard
  { fourCc: "apch", bitrate: 22e7, alpha: !1 },
  // 422 HQ
  { fourCc: "ap4h", bitrate: 33e7, alpha: !0 },
  // 4444
  { fourCc: "ap4x", bitrate: 5e8, alpha: !0 }
  // 4444 XQ
], mc = (r, e, t, i, n) => {
  if (r === "avc") {
    const a = Math.ceil(e / 16) * Math.ceil(t / 16), o = ni.find((f) => a <= f.maxMacroblocks && i <= f.maxBitrate) ?? te(ni), c = o ? o.level : 0, l = "64".padStart(2, "0"), u = "00", d = c.toString(16).padStart(2, "0");
    return `avc1.${l}${u}${d}`;
  } else if (r === "hevc") {
    const c = e * t, l = fs.find((d) => c <= d.maxPictureSize && i <= d.maxBitrate) ?? te(fs);
    return `hev1.1.6.${l.tier}${l.level}.B0`;
  } else {
    if (r === "vp8")
      return "vp8";
    if (r === "vp9") {
      const a = e * t;
      return `vp09.00.${(pt.find((l) => a <= l.maxPictureSize && i <= l.maxBitrate) ?? te(pt)).level.toString().padStart(2, "0")}.08`;
    } else if (r === "av1") {
      const a = e * t, o = hs.find((u) => a <= u.maxPictureSize && i <= u.maxBitrate) ?? te(hs);
      return `av01.0.${o.level.toString().padStart(2, "0")}${o.tier}.08`;
    } else if (r === "prores") {
      const a = Math.pow(e * t / 2073600, 0.95), o = hc.filter((u) => u.alpha === n);
      let c = o[0].fourCc, l = 1 / 0;
      for (const { fourCc: u, bitrate: d } of o) {
        const f = Math.abs(d * a - i);
        f < l && (l = f, c = u);
      }
      return c;
    } else
      Re(r);
  }
  throw new TypeError(`Unhandled codec '${String(r)}'.`);
}, pc = (r) => {
  const e = r.split("."), n = (1 << 7) + 1, s = Number(e[1]), a = e[2], o = Number(a.slice(0, -1)), c = (s << 5) + o, l = a.slice(-1) === "H" ? 1 : 0, d = Number(e[3]) === 8 ? 0 : 1, f = 0, h = e[4] ? Number(e[4]) : 0, p = e[5] ? Number(e[5][0]) : 1, m = e[5] ? Number(e[5][1]) : 1, y = e[5] ? Number(e[5][2]) : 0, w = (l << 7) + (d << 6) + (f << 5) + (h << 4) + (p << 3) + (m << 2) + y;
  return [n, c, w, 0];
}, Nn = (r) => {
  const { codec: e, codecDescription: t, colorSpace: i, avcCodecInfo: n, hevcCodecInfo: s, vp9CodecInfo: a, av1CodecInfo: o, proresFormat: c } = r;
  if (e === "avc") {
    if (g(r.avcType !== null), n) {
      const l = new Uint8Array([
        n.avcProfileIndication,
        n.profileCompatibility,
        n.avcLevelIndication
      ]);
      return `avc${r.avcType}.${Sr(l)}`;
    }
    if (!t || t.byteLength < 4)
      throw new TypeError("AVC decoder description is not provided or is not at least 4 bytes long.");
    return `avc${r.avcType}.${Sr(t.subarray(1, 4))}`;
  } else if (e === "hevc") {
    let l, u, d, f, h, p;
    if (s)
      l = s.generalProfileSpace, u = s.generalProfileIdc, d = os(s.generalProfileCompatibilityFlags), f = s.generalTierFlag, h = s.generalLevelIdc, p = [...s.generalConstraintIndicatorFlags];
    else {
      if (!t || t.byteLength < 23)
        throw new TypeError("HEVC decoder description is not provided or is not at least 23 bytes long.");
      const y = K(t), w = y.getUint8(1);
      l = w >> 6 & 3, u = w & 31, d = os(y.getUint32(2)), f = w >> 5 & 1, h = y.getUint8(12), p = [];
      for (let b = 0; b < 6; b++)
        p.push(y.getUint8(6 + b));
    }
    let m = "hev1.";
    for (m += ["", "A", "B", "C"][l] + u, m += ".", m += d.toString(16).toUpperCase(), m += ".", m += f === 0 ? "L" : "H", m += h; p.length > 0 && p[p.length - 1] === 0; )
      p.pop();
    return p.length > 0 && (m += ".", m += p.map((y) => y.toString(16).toUpperCase()).join(".")), m;
  } else {
    if (e === "vp8")
      return "vp8";
    if (e === "vp9") {
      if (!a) {
        const b = r.width * r.height;
        let k = te(pt).level;
        for (const A of pt)
          if (b <= A.maxPictureSize) {
            k = A.level;
            break;
          }
        return `vp09.00.${k.toString().padStart(2, "0")}.08`;
      }
      const l = a.profile.toString().padStart(2, "0"), u = a.level.toString().padStart(2, "0"), d = a.bitDepth.toString().padStart(2, "0"), f = a.chromaSubsampling.toString().padStart(2, "0"), h = a.colourPrimaries.toString().padStart(2, "0"), p = a.transferCharacteristics.toString().padStart(2, "0"), m = a.matrixCoefficients.toString().padStart(2, "0"), y = a.videoFullRangeFlag.toString().padStart(2, "0");
      let w = `vp09.${l}.${u}.${d}.${f}`;
      return w += `.${h}.${p}.${m}.${y}`, w.endsWith(ms) && (w = w.slice(0, -ms.length)), w;
    } else if (e === "av1") {
      if (!o) {
        const A = r.width * r.height;
        let T = te(pt).level;
        for (const x of pt)
          if (A <= x.maxPictureSize) {
            T = x.level;
            break;
          }
        return `av01.0.${T.toString().padStart(2, "0")}M.08`;
      }
      const l = o.profile, u = o.level.toString().padStart(2, "0"), d = o.tier ? "H" : "M", f = o.bitDepth.toString().padStart(2, "0"), h = o.monochrome ? "1" : "0", p = 100 * o.chromaSubsamplingX + 10 * o.chromaSubsamplingY + 1 * (o.chromaSubsamplingX && o.chromaSubsamplingY ? o.chromaSamplePosition : 0), m = i?.primaries ? tr[i.primaries] : 1, y = i?.transfer ? rr[i.transfer] : 1, w = i?.matrix ? ir[i.matrix] : 1, b = i?.fullRange ? 1 : 0;
      let k = `av01.${l}.${u}${d}.${f}`;
      return k += `.${h}.${p.toString().padStart(3, "0")}`, k += `.${m.toString().padStart(2, "0")}`, k += `.${y.toString().padStart(2, "0")}`, k += `.${w.toString().padStart(2, "0")}`, k += `.${b}`, k.endsWith(ps) && (k = k.slice(0, -ps.length)), k;
    } else {
      if (e === "prores")
        return c ?? "apch";
      e !== null && Re(e);
    }
  }
  throw new TypeError(`Unhandled codec '${e}'.`);
}, Ia = (r, e, t) => {
  if (r === "aac")
    return e >= 2 && t <= 24e3 ? "mp4a.40.29" : t <= 24e3 ? "mp4a.40.5" : "mp4a.40.2";
  if (r === "mp3")
    return "mp3";
  if (r === "opus")
    return "opus";
  if (r === "vorbis")
    return "vorbis";
  if (r === "flac")
    return "flac";
  if (r === "ac3")
    return "ac-3";
  if (r === "eac3")
    return "ec-3";
  if (r === "dts")
    return "dtsc";
  if (ye.includes(r))
    return r;
  throw new TypeError(`Unhandled codec '${r}'.`);
}, Vn = (r) => {
  const { codec: e, codecDescription: t, aacCodecInfo: i, dtsFormat: n } = r;
  if (e === "aac") {
    if (!i)
      throw new TypeError("AAC codec info must be provided.");
    if (i.isMpeg2)
      return "mp4a.67";
    {
      let s;
      return i.objectType !== null ? s = i.objectType : s = Dn(t).objectType, `mp4a.40.${s}`;
    }
  } else {
    if (e === "mp3")
      return "mp3";
    if (e === "opus")
      return "opus";
    if (e === "vorbis")
      return "vorbis";
    if (e === "flac")
      return "flac";
    if (e === "ac3")
      return "ac-3";
    if (e === "eac3")
      return "ec-3";
    if (e === "dts")
      return n ?? "dtsc";
    if (e && ye.includes(e))
      return e;
  }
  throw new TypeError(`Unhandled codec '${e}'.`);
}, gc = (r) => {
  switch (r.codec) {
    case "flac": {
      const e = ii("ZkxhQ4AAACIQABAAAAYtACWtCsRC8AANRBhVFucAcYu5ASE2m1Dxv8tw");
      return r.sampleRate >= 1 << 20 || r.numberOfChannels > 8 ? !1 : (e[18] = r.sampleRate >>> 12, e[19] = r.sampleRate >>> 4, e[20] = (r.sampleRate & 15) << 4 | r.numberOfChannels - 1 << 1, e);
    }
    case "vorbis": {
      const e = ii("Ah7/AgF2b3JiaXMAAAAAAoC7AAAAAAAAgLUBAAAAAAC4AQN2b3JiaXMNAAAATGF2ZjU4Ljc2LjEwMAgAAAAMAAAAbGFuZ3VhZ2U9dW5kGQAAAGhhbmRsZXJfbmFtZT1Tb3VuZEhhbmRsZXIWAAAAdmVuZG9yX2lkPVswXVswXVswXVswXSAAAABlbmNvZGVyPUxhdmM1OC4xMzQuMTAwIGxpYnZvcmJpcxAAAABtYWpvcl9icmFuZD1pc29tEQAAAG1pbm9yX3ZlcnNpb249NTEyIgAAAGNvbXBhdGlibGVfYnJhbmRzPWlzb21pc28yYXZjMW1wNDEmAAAAREVTQ1JJUFRJT049TWFkZSB3aXRoIFJlbW90aW9uIDQuMC4yNzgBBXZvcmJpcyVCQ1YBAEAAACRzGCpGpXMWhBAaQlAZ4xxCzmvsGUJMEYIcMkxbyyVzkCGkoEKIWyiB0JBVAABAAACHQXgUhIpBCCGEJT1YkoMnPQghhIg5eBSEaUEIIYQQQgghhBBCCCGERTlokoMnQQgdhOMwOAyD5Tj4HIRFOVgQgydB6CCED0K4moOsOQghhCQ1SFCDBjnoHITCLCiKgsQwuBaEBDUojILkMMjUgwtCiJqDSTX4GoRnQXgWhGlBCCGEJEFIkIMGQcgYhEZBWJKDBjm4FITLQagahCo5CB+EIDRkFQCQAACgoiiKoigKEBqyCgDIAAAQQFEUx3EcyZEcybEcCwgNWQUAAAEACAAAoEiKpEiO5EiSJFmSJVmSJVmS5omqLMuyLMuyLMsyEBqyCgBIAABQUQxFcRQHCA1ZBQBkAAAIoDiKpViKpWiK54iOCISGrAIAgAAABAAAEDRDUzxHlETPVFXXtm3btm3btm3btm3btm1blmUZCA1ZBQBAAAAQ0mlmqQaIMAMZBkJDVgEACAAAgBGKMMSA0JBVAABAAACAGEoOogmtOd+c46BZDppKsTkdnEi1eZKbirk555xzzsnmnDHOOeecopxZDJoJrTnnnMSgWQqaCa0555wnsXnQmiqtOeeccc7pYJwRxjnnnCateZCajbU555wFrWmOmkuxOeecSLl5UptLtTnnnHPOOeecc84555zqxekcnBPOOeecqL25lpvQxTnnnE/G6d6cEM4555xzzjnnnHPOOeecIDRkFQAABABAEIaNYdwpCNLnaCBGEWIaMulB9+gwCRqDnELq0ehopJQ6CCWVcVJKJwgNWQUAAAIAQAghhRRSSCGFFFJIIYUUYoghhhhyyimnoIJKKqmooowyyyyzzDLLLLPMOuyssw47DDHEEEMrrcRSU2011lhr7jnnmoO0VlprrbVSSimllFIKQkNWAQAgAAAEQgYZZJBRSCGFFGKIKaeccgoqqIDQkFUAACAAgAAAAABP8hzRER3RER3RER3RER3R8RzPESVREiVREi3TMjXTU0VVdWXXlnVZt31b2IVd933d933d+HVhWJZlWZZlWZZlWZZlWZZlWZYgNGQVAAACAAAghBBCSCGFFFJIKcYYc8w56CSUEAgNWQUAAAIACAAAAHAUR3EcyZEcSbIkS9IkzdIsT/M0TxM9URRF0zRV0RVdUTdtUTZl0zVdUzZdVVZtV5ZtW7Z125dl2/d93/d93/d93/d93/d9XQdCQ1YBABIAADqSIymSIimS4ziOJElAaMgqAEAGAEAAAIriKI7jOJIkSZIlaZJneZaomZrpmZ4qqkBoyCoAABAAQAAAAAAAAIqmeIqpeIqoeI7oiJJomZaoqZoryqbsuq7ruq7ruq7ruq7ruq7ruq7ruq7ruq7ruq7ruq7ruq7ruq4LhIasAgAkAAB0JEdyJEdSJEVSJEdygNCQVQCADACAAAAcwzEkRXIsy9I0T/M0TxM90RM901NFV3SB0JBVAAAgAIAAAAAAAAAMybAUy9EcTRIl1VItVVMt1VJF1VNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVN0zRNEwgNWQkAkAEAkBBTLS3GmgmLJGLSaqugYwxS7KWxSCpntbfKMYUYtV4ah5RREHupJGOKQcwtpNApJq3WVEKFFKSYYyoVUg5SIDRkhQAQmgHgcBxAsixAsiwAAAAAAAAAkDQN0DwPsDQPAAAAAAAAACRNAyxPAzTPAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABA0jRA8zxA8zwAAAAAAAAA0DwP8DwR8EQRAAAAAAAAACzPAzTRAzxRBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABA0jRA8zxA8zwAAAAAAAAAsDwP8EQR0DwRAAAAAAAAACzPAzxRBDzRAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAEOAAABBgIRQasiIAiBMAcEgSJAmSBM0DSJYFTYOmwTQBkmVB06BpME0AAAAAAAAAAAAAJE2DpkHTIIoASdOgadA0iCIAAAAAAAAAAAAAkqZB06BpEEWApGnQNGgaRBEAAAAAAAAAAAAAzzQhihBFmCbAM02IIkQRpgkAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAGHAAAAgwoQwUGrIiAIgTAHA4imUBAIDjOJYFAACO41gWAABYliWKAABgWZooAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAYcAAACDChDBQashIAiAIAcCiKZQHHsSzgOJYFJMmyAJYF0DyApgFEEQAIAAAocAAACLBBU2JxgEJDVgIAUQAABsWxLE0TRZKkaZoniiRJ0zxPFGma53meacLzPM80IYqiaJoQRVE0TZimaaoqME1VFQAAUOAAABBgg6bE4gCFhqwEAEICAByKYlma5nmeJ4qmqZokSdM8TxRF0TRNU1VJkqZ5niiKommapqqyLE3zPFEURdNUVVWFpnmeKIqiaaqq6sLzPE8URdE0VdV14XmeJ4qiaJqq6roQRVE0TdNUTVV1XSCKpmmaqqqqrgtETxRNU1Vd13WB54miaaqqq7ouEE3TVFVVdV1ZBpimaaqq68oyQFVV1XVdV5YBqqqqruu6sgxQVdd1XVmWZQCu67qyLMsCAAAOHAAAAoygk4wqi7DRhAsPQKEhKwKAKAAAwBimFFPKMCYhpBAaxiSEFEImJaXSUqogpFJSKRWEVEoqJaOUUmopVRBSKamUCkIqJZVSAADYgQMA2IGFUGjISgAgDwCAMEYpxhhzTiKkFGPOOScRUoox55yTSjHmnHPOSSkZc8w556SUzjnnnHNSSuacc845KaVzzjnnnJRSSuecc05KKSWEzkEnpZTSOeecEwAAVOAAABBgo8jmBCNBhYasBABSAQAMjmNZmuZ5omialiRpmud5niiapiZJmuZ5nieKqsnzPE8URdE0VZXneZ4oiqJpqirXFUXTNE1VVV2yLIqmaZqq6rowTdNUVdd1XZimaaqq67oubFtVVdV1ZRm2raqq6rqyDFzXdWXZloEsu67s2rIAAPAEBwCgAhtWRzgpGgssNGQlAJABAEAYg5BCCCFlEEIKIYSUUggJAAAYcAAACDChDBQashIASAUAAIyx1lprrbXWQGettdZaa62AzFprrbXWWmuttdZaa6211lJrrbXWWmuttdZaa6211lprrbXWWmuttdZaa6211lprrbXWWmuttdZaa6211lprrbXWWmstpZRSSimllFJKKaWUUkoppZRSSgUA+lU4APg/2LA6wknRWGChISsBgHAAAMAYpRhzDEIppVQIMeacdFRai7FCiDHnJKTUWmzFc85BKCGV1mIsnnMOQikpxVZjUSmEUlJKLbZYi0qho5JSSq3VWIwxqaTWWoutxmKMSSm01FqLMRYjbE2ptdhqq7EYY2sqLbQYY4zFCF9kbC2m2moNxggjWywt1VprMMYY3VuLpbaaizE++NpSLDHWXAAAd4MDAESCjTOsJJ0VjgYXGrISAAgJACAQUooxxhhzzjnnpFKMOeaccw5CCKFUijHGnHMOQgghlIwx5pxzEEIIIYRSSsaccxBCCCGEkFLqnHMQQgghhBBKKZ1zDkIIIYQQQimlgxBCCCGEEEoopaQUQgghhBBCCKmklEIIIYRSQighlZRSCCGEEEIpJaSUUgohhFJCCKGElFJKKYUQQgillJJSSimlEkoJJYQSUikppRRKCCGUUkpKKaVUSgmhhBJKKSWllFJKIYQQSikFAAAcOAAABBhBJxlVFmGjCRcegEJDVgIAZAAAkKKUUiktRYIipRikGEtGFXNQWoqocgxSzalSziDmJJaIMYSUk1Qy5hRCDELqHHVMKQYtlRhCxhik2HJLoXMOAAAAQQCAgJAAAAMEBTMAwOAA4XMQdAIERxsAgCBEZohEw0JweFAJEBFTAUBigkIuAFRYXKRdXECXAS7o4q4DIQQhCEEsDqCABByccMMTb3jCDU7QKSp1IAAAAAAADADwAACQXAAREdHMYWRobHB0eHyAhIiMkAgAAAAAABcAfAAAJCVAREQ0cxgZGhscHR4fICEiIyQBAIAAAgAAAAAggAAEBAQAAAAAAAIAAAAEBA=="), t = K(e);
      return t.setUint8(15, r.numberOfChannels), t.setUint32(16, r.sampleRate, !0), e;
    }
    default:
      return;
  }
}, wi = 48e3, _a = /^pcm-([usf])(\d+)(be)?$/, at = (r) => {
  if (g(ye.includes(r)), r === "ulaw")
    return { dataType: "ulaw", sampleSize: 1, littleEndian: !0, silentValue: 255 };
  if (r === "alaw")
    return { dataType: "alaw", sampleSize: 1, littleEndian: !0, silentValue: 213 };
  const e = _a.exec(r);
  g(e);
  let t;
  e[1] === "u" ? t = "unsigned" : e[1] === "s" ? t = "signed" : t = "float";
  const i = Number(e[2]) / 8, n = e[3] !== "be", s = r === "pcm-u8" ? 2 ** 7 : 0;
  return { dataType: t, sampleSize: i, littleEndian: n, silentValue: s };
}, Qe = (r) => r.startsWith("avc1") || r.startsWith("avc3") ? "avc" : r.startsWith("hev1") || r.startsWith("hvc1") ? "hevc" : r === "vp8" ? "vp8" : r.startsWith("vp09") ? "vp9" : r.startsWith("av01") ? "av1" : It.includes(r) ? "prores" : r === "mp3" || r === "mp4a.69" || r === "mp4a.6B" || r === "mp4a.6b" || r === "mp4a.40.34" ? "mp3" : r.startsWith("mp4a.40.") || r === "mp4a.67" ? "aac" : r === "opus" ? "opus" : r === "vorbis" ? "vorbis" : r === "flac" ? "flac" : r === "ac-3" || r === "ac3" ? "ac3" : r === "ec-3" || r === "eac3" ? "eac3" : si.includes(r) ? "dts" : r === "ulaw" ? "ulaw" : r === "alaw" ? "alaw" : _a.test(r) ? r : r === "webvtt" ? "webvtt" : null, yc = (r) => r === "avc" ? {
  avc: {
    format: "avc"
    // Ensure the format is not Annex B
  }
} : r === "hevc" ? {
  hevc: {
    format: "hevc"
    // Ensure the format is not Annex B
  }
} : {}, wc = (r) => r === "aac" ? {
  aac: {
    format: "aac"
    // Ensure the format is not ADTS
  }
} : r === "opus" ? {
  opus: {
    format: "opus"
  }
} : {}, bc = ["avc1", "avc3", "hev1", "hvc1", "vp8", "vp09", "av01", ...It], kc = /^(avc1|avc3)\.[0-9a-fA-F]{6}$/, Tc = /^(hev1|hvc1)\.(?:[ABC]?\d+)\.[0-9a-fA-F]{1,8}\.[LH]\d+(?:\.[0-9a-fA-F]{1,2}){0,6}$/, Ac = /^vp09(?:\.\d{2}){3}(?:(?:\.\d{2}){5})?$/, Sc = /^av01\.\d\.\d{2}[MH]\.\d{2}(?:\.\d\.\d{3}\.\d{2}\.\d{2}\.\d{2}\.\d)?$/, va = (r, e) => {
  if (!r)
    throw new TypeError("Video chunk metadata must be provided.");
  if (typeof r != "object")
    throw new TypeError("Video chunk metadata must be an object.");
  if (!r.decoderConfig)
    throw new TypeError("Video chunk metadata must include a decoder configuration.");
  if (typeof r.decoderConfig != "object")
    throw new TypeError("Video chunk metadata decoder configuration must be an object.");
  if (typeof r.decoderConfig.codec != "string")
    throw new TypeError("Video chunk metadata decoder configuration must specify a codec string.");
  if (!bc.some((t) => r.decoderConfig.codec.startsWith(t)))
    throw new TypeError("Video chunk metadata decoder configuration codec string must be a valid video codec string as specified in the Mediabunny Codec Registry.");
  if (!Number.isInteger(r.decoderConfig.codedWidth) || r.decoderConfig.codedWidth <= 0)
    throw new TypeError("Video chunk metadata decoder configuration must specify a valid codedWidth (positive integer).");
  if (!Number.isInteger(r.decoderConfig.codedHeight) || r.decoderConfig.codedHeight <= 0)
    throw new TypeError("Video chunk metadata decoder configuration must specify a valid codedHeight (positive integer).");
  if (r.decoderConfig.displayAspectWidth !== void 0 && (!Number.isInteger(r.decoderConfig.displayAspectWidth) || r.decoderConfig.displayAspectWidth <= 0))
    throw new TypeError("Video chunk metadata decoder configuration displayAspectWidth, when defined, must be a positive integer.");
  if (r.decoderConfig.displayAspectHeight !== void 0 && (!Number.isInteger(r.decoderConfig.displayAspectHeight) || r.decoderConfig.displayAspectHeight <= 0))
    throw new TypeError("Video chunk metadata decoder configuration displayAspectHeight, when defined, must be a positive integer.");
  if (r.decoderConfig.displayAspectWidth !== void 0 != (r.decoderConfig.displayAspectHeight !== void 0))
    throw new TypeError("Video chunk metadata decoder configuration must specify both displayAspectWidth and displayAspectHeight, or neither.");
  if (r.decoderConfig.description !== void 0 && !Br(r.decoderConfig.description))
    throw new TypeError("Video chunk metadata decoder configuration description, when defined, must be an ArrayBuffer or an ArrayBuffer view.");
  if (r.decoderConfig.colorSpace !== void 0) {
    const { colorSpace: t } = r.decoderConfig;
    if (typeof t != "object")
      throw new TypeError("Video chunk metadata decoder configuration colorSpace, when provided, must be an object.");
    const i = Object.keys(tr);
    if (t.primaries != null && !i.includes(t.primaries))
      throw new TypeError(`Video chunk metadata decoder configuration colorSpace primaries, when defined, must be one of ${i.join(", ")}.`);
    const n = Object.keys(rr);
    if (t.transfer != null && !n.includes(t.transfer))
      throw new TypeError(`Video chunk metadata decoder configuration colorSpace transfer, when defined, must be one of ${n.join(", ")}.`);
    const s = Object.keys(ir);
    if (t.matrix != null && !s.includes(t.matrix))
      throw new TypeError(`Video chunk metadata decoder configuration colorSpace matrix, when defined, must be one of ${s.join(", ")}.`);
    if (t.fullRange != null && typeof t.fullRange != "boolean")
      throw new TypeError("Video chunk metadata decoder configuration colorSpace fullRange, when defined, must be a boolean.");
  }
  if (r.decoderConfig.codec.startsWith("avc1") || r.decoderConfig.codec.startsWith("avc3")) {
    if (!kc.test(r.decoderConfig.codec))
      throw new TypeError("Video chunk metadata decoder configuration codec string for AVC must be a valid AVC codec string as specified in Section 3.4 of RFC 6381.");
  } else if (r.decoderConfig.codec.startsWith("hev1") || r.decoderConfig.codec.startsWith("hvc1")) {
    if (!Tc.test(r.decoderConfig.codec))
      throw new TypeError("Video chunk metadata decoder configuration codec string for HEVC must be a valid HEVC codec string as specified in Section E.3 of ISO 14496-15.");
  } else if (r.decoderConfig.codec.startsWith("vp8")) {
    if (r.decoderConfig.codec !== "vp8")
      throw new TypeError('Video chunk metadata decoder configuration codec string for VP8 must be "vp8".');
  } else if (r.decoderConfig.codec.startsWith("vp09")) {
    if (!Ac.test(r.decoderConfig.codec))
      throw new TypeError('Video chunk metadata decoder configuration codec string for VP9 must be a valid VP9 codec string as specified in Section "Codecs Parameter String" of https://www.webmproject.org/vp9/mp4/.');
  } else if (r.decoderConfig.codec.startsWith("av01")) {
    if (!Sc.test(r.decoderConfig.codec))
      throw new TypeError('Video chunk metadata decoder configuration codec string for AV1 must be a valid AV1 codec string as specified in Section "Codecs Parameter String" of https://aomediacodec.github.io/av1-isobmff/.');
  } else if (It.some((t) => r.decoderConfig.codec.startsWith(t)) && !It.some((t) => r.decoderConfig.codec === t))
    throw new TypeError(`Video chunk metadata decoder configuration codec string for ProRes must be one of the valid ProRes four-character codes: ${It.join(", ")}.`);
  if (e !== null && Qe(r.decoderConfig.codec) !== e)
    throw new TypeError(`Video chunk metadata decoder configuration codec string '${r.decoderConfig.codec}' does not fit to the track codec '${e}'.`);
}, xc = [
  "mp4a",
  "mp3",
  "opus",
  "vorbis",
  "flac",
  "ulaw",
  "alaw",
  "pcm",
  "ac-3",
  "ec-3",
  "dts"
], Ba = (r, e) => {
  if (!r)
    throw new TypeError("Audio chunk metadata must be provided.");
  if (typeof r != "object")
    throw new TypeError("Audio chunk metadata must be an object.");
  if (!r.decoderConfig)
    throw new TypeError("Audio chunk metadata must include a decoder configuration.");
  if (typeof r.decoderConfig != "object")
    throw new TypeError("Audio chunk metadata decoder configuration must be an object.");
  if (typeof r.decoderConfig.codec != "string")
    throw new TypeError("Audio chunk metadata decoder configuration must specify a codec string.");
  if (!xc.some((t) => r.decoderConfig.codec.startsWith(t)))
    throw new TypeError("Audio chunk metadata decoder configuration codec string must be a valid audio codec string as specified in the Mediabunny Codec Registry.");
  if (!Number.isInteger(r.decoderConfig.sampleRate) || r.decoderConfig.sampleRate <= 0)
    throw new TypeError("Audio chunk metadata decoder configuration must specify a valid sampleRate (positive integer).");
  if (!Number.isInteger(r.decoderConfig.numberOfChannels) || r.decoderConfig.numberOfChannels <= 0)
    throw new TypeError("Audio chunk metadata decoder configuration must specify a valid numberOfChannels (positive integer).");
  if (r.decoderConfig.description !== void 0 && !Br(r.decoderConfig.description))
    throw new TypeError("Audio chunk metadata decoder configuration description, when defined, must be an ArrayBuffer or an ArrayBuffer view.");
  if (r.decoderConfig.codec.startsWith("mp4a") && r.decoderConfig.codec !== "mp4a.69" && r.decoderConfig.codec !== "mp4a.6B" && r.decoderConfig.codec !== "mp4a.6b") {
    if (!["mp4a.40.2", "mp4a.40.02", "mp4a.40.5", "mp4a.40.05", "mp4a.40.29", "mp4a.67"].includes(r.decoderConfig.codec))
      throw new TypeError("Audio chunk metadata decoder configuration codec string for AAC must be a valid AAC codec string as specified in https://www.w3.org/TR/webcodecs-aac-codec-registration/.");
  } else if (r.decoderConfig.codec.startsWith("mp3") || r.decoderConfig.codec.startsWith("mp4a")) {
    if (r.decoderConfig.codec !== "mp3" && r.decoderConfig.codec !== "mp4a.69" && r.decoderConfig.codec !== "mp4a.6B" && r.decoderConfig.codec !== "mp4a.6b")
      throw new TypeError('Audio chunk metadata decoder configuration codec string for MP3 must be "mp3", "mp4a.69" or "mp4a.6B".');
  } else if (r.decoderConfig.codec.startsWith("opus")) {
    if (r.decoderConfig.codec !== "opus")
      throw new TypeError('Audio chunk metadata decoder configuration codec string for Opus must be "opus".');
    if (r.decoderConfig.description && r.decoderConfig.description.byteLength < 18)
      throw new TypeError("Audio chunk metadata decoder configuration description, when specified, is expected to be an Identification Header as specified in Section 5.1 of RFC 7845.");
  } else if (r.decoderConfig.codec.startsWith("vorbis")) {
    if (r.decoderConfig.codec !== "vorbis")
      throw new TypeError('Audio chunk metadata decoder configuration codec string for Vorbis must be "vorbis".');
    if (!r.decoderConfig.description)
      throw new TypeError("Audio chunk metadata decoder configuration for Vorbis must include a description, which is expected to adhere to the format described in https://www.w3.org/TR/webcodecs-vorbis-codec-registration/.");
  } else if (r.decoderConfig.codec.startsWith("flac")) {
    if (r.decoderConfig.codec !== "flac")
      throw new TypeError('Audio chunk metadata decoder configuration codec string for FLAC must be "flac".');
    if (!r.decoderConfig.description || r.decoderConfig.description.byteLength < 42)
      throw new TypeError("Audio chunk metadata decoder configuration for FLAC must include a description, which is expected to adhere to the format described in https://www.w3.org/TR/webcodecs-flac-codec-registration/.");
  } else if (r.decoderConfig.codec.startsWith("ac-3") || r.decoderConfig.codec.startsWith("ac3")) {
    if (r.decoderConfig.codec !== "ac-3")
      throw new TypeError('Audio chunk metadata decoder configuration codec string for AC-3 must be "ac-3".');
  } else if (r.decoderConfig.codec.startsWith("ec-3") || r.decoderConfig.codec.startsWith("eac3")) {
    if (r.decoderConfig.codec !== "ec-3")
      throw new TypeError('Audio chunk metadata decoder configuration codec string for EC-3 must be "ec-3".');
  } else if (r.decoderConfig.codec.startsWith("dts")) {
    if (!si.includes(r.decoderConfig.codec))
      throw new TypeError(`Audio chunk metadata decoder configuration codec string for DTS must be one of the following four-character codes: ${si.join(", ")}.`);
  } else if ((r.decoderConfig.codec.startsWith("pcm") || r.decoderConfig.codec.startsWith("ulaw") || r.decoderConfig.codec.startsWith("alaw")) && !ye.includes(r.decoderConfig.codec))
    throw new TypeError(`Audio chunk metadata decoder configuration codec string for PCM must be one of the supported PCM codecs (${ye.join(", ")}).`);
  if (e !== null && Qe(r.decoderConfig.codec) !== e)
    throw new TypeError(`Audio chunk metadata decoder configuration codec string '${r.decoderConfig.codec}' does not fit to the track codec '${e}'.`);
}, Pc = (r) => {
  if (!r)
    throw new TypeError("Subtitle metadata must be provided.");
  if (typeof r != "object")
    throw new TypeError("Subtitle metadata must be an object.");
  if (!r.config)
    throw new TypeError("Subtitle metadata must include a config object.");
  if (typeof r.config != "object")
    throw new TypeError("Subtitle metadata config must be an object.");
  if (typeof r.config.description != "string")
    throw new TypeError("Subtitle metadata config description must be a string.");
};
const _t = 4, Cc = [44100, 48e3, 32e3], Ec = [
  // lowSamplingFrequency === 0
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // layer = 0
  -1,
  32,
  40,
  48,
  56,
  64,
  80,
  96,
  112,
  128,
  160,
  192,
  224,
  256,
  320,
  -1,
  // layer 1
  -1,
  32,
  48,
  56,
  64,
  80,
  96,
  112,
  128,
  160,
  192,
  224,
  256,
  320,
  384,
  -1,
  // layer = 2
  -1,
  32,
  64,
  96,
  128,
  160,
  192,
  224,
  256,
  288,
  320,
  352,
  384,
  416,
  448,
  -1,
  // layer = 3
  // lowSamplingFrequency === 1
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // layer = 0
  -1,
  8,
  16,
  24,
  32,
  40,
  48,
  56,
  64,
  80,
  96,
  112,
  128,
  144,
  160,
  -1,
  // layer = 1
  -1,
  8,
  16,
  24,
  32,
  40,
  48,
  56,
  64,
  80,
  96,
  112,
  128,
  144,
  160,
  -1,
  // layer = 2
  -1,
  32,
  48,
  56,
  64,
  80,
  96,
  112,
  128,
  144,
  160,
  176,
  192,
  224,
  256,
  -1
  // layer = 3
], Ra = 1483304551, Fa = 1231971951, Ic = (r, e, t, i, n) => e === 0 ? 0 : e === 1 ? Math.floor(144 * t / (i << r)) + n : e === 2 ? Math.floor(144 * t / i) + n : (Math.floor(12 * t / i) + n) * 4, _c = (r, e, t, i) => e === 0 ? 0 : e === 1 ? 144 * t / (i << r) : e === 2 ? 144 * t / i : 12 * t / i * 4, Ma = (r, e) => r === 3 ? e === 3 ? 21 : 36 : e === 3 ? 13 : 21, Un = (r, e) => {
  const t = r >>> 24, i = r >>> 16 & 255, n = r >>> 8 & 255, s = r & 255;
  if (t !== 255 && i !== 255 && n !== 255 && s !== 255)
    return {
      header: null,
      bytesAdvanced: 4
    };
  if (t !== 255)
    return { header: null, bytesAdvanced: 1 };
  if ((i & 224) !== 224)
    return { header: null, bytesAdvanced: 1 };
  let a = 0, o = 0;
  i & 16 ? a = i & 8 ? 0 : 1 : (a = 1, o = 1);
  const c = i >> 3 & 3, l = i >> 1 & 3, u = n >> 4 & 15, d = (n >> 2 & 3) % 3, f = n >> 1 & 1, h = s >> 6 & 3, p = s >> 4 & 3, m = s >> 3 & 1, y = s >> 2 & 1, w = s & 3, b = Ec[a * 16 * 4 + l * 16 + u];
  if (b === -1)
    return { header: null, bytesAdvanced: 1 };
  const k = b * 1e3, A = Cc[d] >> a + o, T = Ic(a, l, k, A, f);
  if (e !== null && e < T)
    return { header: null, bytesAdvanced: 1 };
  let x;
  return c === 3 ? x = l === 3 ? 384 : 1152 : l === 3 ? x = 384 : l === 2 ? x = 1152 : x = 576, {
    header: {
      totalSize: T,
      mpegVersionId: c,
      lowSamplingFrequency: a,
      layer: l,
      bitrate: k,
      frequencyIndex: d,
      sampleRate: A,
      channel: h,
      modeExtension: p,
      copyright: m,
      original: y,
      emphasis: w,
      audioSamplesInFrame: x
    },
    bytesAdvanced: 1
  };
}, hn = (r) => {
  let e = 2130706432, t = 0;
  for (; e !== 0; )
    t >>= 1, t |= r & e, e >>= 8;
  return t;
};
var ai;
(function(r) {
  r[r.FrameCount = 1] = "FrameCount", r[r.FileSize = 2] = "FileSize", r[r.Toc = 4] = "Toc";
})(ai || (ai = {}));
const Ir = (r) => r === 3 ? 1 : 2;
const bi = [48e3, 44100, 32e3], za = [24e3, 22050, 16e3];
var de;
(function(r) {
  r[r.NON_IDR_SLICE = 1] = "NON_IDR_SLICE", r[r.SLICE_DPA = 2] = "SLICE_DPA", r[r.SLICE_DPB = 3] = "SLICE_DPB", r[r.SLICE_DPC = 4] = "SLICE_DPC", r[r.IDR = 5] = "IDR", r[r.SEI = 6] = "SEI", r[r.SPS = 7] = "SPS", r[r.PPS = 8] = "PPS", r[r.AUD = 9] = "AUD", r[r.SPS_EXT = 13] = "SPS_EXT";
})(de || (de = {}));
var ce;
(function(r) {
  r[r.RASL_N = 8] = "RASL_N", r[r.RASL_R = 9] = "RASL_R", r[r.BLA_W_LP = 16] = "BLA_W_LP", r[r.RSV_IRAP_VCL23 = 23] = "RSV_IRAP_VCL23", r[r.VPS_NUT = 32] = "VPS_NUT", r[r.SPS_NUT = 33] = "SPS_NUT", r[r.PPS_NUT = 34] = "PPS_NUT", r[r.AUD_NUT = 35] = "AUD_NUT", r[r.PREFIX_SEI_NUT = 39] = "PREFIX_SEI_NUT", r[r.SUFFIX_SEI_NUT = 40] = "SUFFIX_SEI_NUT";
})(ce || (ce = {}));
const zr = function* (r) {
  let e = 0, t = -1;
  for (; e < r.length - 2; ) {
    const i = r.indexOf(0, e);
    if (i === -1 || i >= r.length - 2)
      break;
    e = i;
    let n = 0;
    if (e + 3 < r.length && r[e + 1] === 0 && r[e + 2] === 0 && r[e + 3] === 1 ? n = 4 : r[e + 1] === 0 && r[e + 2] === 1 && (n = 3), n === 0) {
      e++;
      continue;
    }
    t !== -1 && e > t && (yield {
      offset: t,
      length: e - t
    }), t = e + n, e = t;
  }
  t !== -1 && t < r.length && (yield {
    offset: t,
    length: r.length - t
  });
}, Oa = function* (r, e) {
  let t = 0;
  const i = new DataView(r.buffer, r.byteOffset, r.byteLength);
  for (; t + e <= r.length; ) {
    let n;
    e === 1 ? n = i.getUint8(t) : e === 2 ? n = i.getUint16(t, !1) : e === 3 ? n = pi(i, t, !1) : (g(e === 4), n = i.getUint32(t, !1)), t += e, yield {
      offset: t,
      length: n
    }, t += n;
  }
}, Da = (r, e) => {
  if (e.description) {
    const n = (be(e.description)[4] & 3) + 1;
    return Oa(r, n);
  } else
    return zr(r);
}, ki = (r) => r & 31, Ti = (r) => {
  const e = [], t = r.length;
  for (let i = 0; i < t; i++)
    i + 2 < t && r[i] === 0 && r[i + 1] === 0 && r[i + 2] === 3 ? (e.push(0, 0), i += 2) : e.push(r[i]);
  return new Uint8Array(e);
}, Oi = new Uint8Array([0, 0, 0, 1]), Na = (r) => {
  const e = r.reduce((n, s) => n + Oi.byteLength + s.byteLength, 0), t = new Uint8Array(e);
  let i = 0;
  for (const n of r)
    t.set(Oi, i), i += Oi.byteLength, t.set(n, i), i += n.byteLength;
  return t;
}, Wn = (r, e) => {
  const t = r.reduce((s, a) => s + e + a.byteLength, 0), i = new Uint8Array(t);
  let n = 0;
  for (const s of r) {
    const a = new DataView(i.buffer, i.byteOffset, i.byteLength);
    switch (e) {
      case 1:
        a.setUint8(n, s.byteLength);
        break;
      case 2:
        a.setUint16(n, s.byteLength, !1);
        break;
      case 3:
        Fn(a, n, s.byteLength, !1);
        break;
      case 4:
        a.setUint32(n, s.byteLength, !1);
        break;
    }
    n += e, i.set(s, n), n += s.byteLength;
  }
  return i;
}, vc = (r, e) => {
  if (e.description) {
    const n = (be(e.description)[4] & 3) + 1;
    return Wn(r, n);
  } else
    return Na(r);
}, Ai = (r) => {
  try {
    const e = [], t = [], i = [];
    for (const o of zr(r)) {
      const c = r.subarray(o.offset, o.offset + o.length), l = ki(c[0]);
      l === de.SPS ? e.push(c) : l === de.PPS ? t.push(c) : l === de.SPS_EXT && i.push(c);
    }
    if (e.length === 0 || t.length === 0)
      return null;
    const n = e[0], s = qn(n);
    g(s !== null);
    const a = s.profileIdc === 100 || s.profileIdc === 110 || s.profileIdc === 122 || s.profileIdc === 144;
    return {
      configurationVersion: 1,
      avcProfileIndication: s.profileIdc,
      profileCompatibility: s.constraintFlags,
      avcLevelIndication: s.levelIdc,
      lengthSizeMinusOne: 3,
      // Typically 4 bytes for length field
      sequenceParameterSets: e,
      pictureParameterSets: t,
      chromaFormat: a ? s.chromaFormatIdc : null,
      bitDepthLumaMinus8: a ? s.bitDepthLumaMinus8 : null,
      bitDepthChromaMinus8: a ? s.bitDepthChromaMinus8 : null,
      sequenceParameterSetExt: a ? i : null
    };
  } catch (e) {
    return q._error("Error building AVC Decoder Configuration Record:", e), null;
  }
}, Bc = (r) => {
  const e = [];
  e.push(r.configurationVersion), e.push(r.avcProfileIndication), e.push(r.profileCompatibility), e.push(r.avcLevelIndication), e.push(252 | r.lengthSizeMinusOne & 3), e.push(224 | r.sequenceParameterSets.length & 31);
  for (const t of r.sequenceParameterSets) {
    const i = t.byteLength;
    e.push(i >> 8), e.push(i & 255);
    for (let n = 0; n < i; n++)
      e.push(t[n]);
  }
  e.push(r.pictureParameterSets.length);
  for (const t of r.pictureParameterSets) {
    const i = t.byteLength;
    e.push(i >> 8), e.push(i & 255);
    for (let n = 0; n < i; n++)
      e.push(t[n]);
  }
  if (r.avcProfileIndication === 100 || r.avcProfileIndication === 110 || r.avcProfileIndication === 122 || r.avcProfileIndication === 144) {
    g(r.chromaFormat !== null), g(r.bitDepthLumaMinus8 !== null), g(r.bitDepthChromaMinus8 !== null), g(r.sequenceParameterSetExt !== null), e.push(252 | r.chromaFormat & 3), e.push(248 | r.bitDepthLumaMinus8 & 7), e.push(248 | r.bitDepthChromaMinus8 & 7), e.push(r.sequenceParameterSetExt.length);
    for (const t of r.sequenceParameterSetExt) {
      const i = t.byteLength;
      e.push(i >> 8), e.push(i & 255);
      for (let n = 0; n < i; n++)
        e.push(t[n]);
    }
  }
  return new Uint8Array(e);
}, Rc = (r) => {
  try {
    const e = K(r);
    let t = 0;
    const i = e.getUint8(t++), n = e.getUint8(t++), s = e.getUint8(t++), a = e.getUint8(t++), o = e.getUint8(t++) & 3, c = e.getUint8(t++) & 31, l = [];
    for (let h = 0; h < c; h++) {
      const p = e.getUint16(t, !1);
      t += 2, l.push(r.subarray(t, t + p)), t += p;
    }
    const u = e.getUint8(t++), d = [];
    for (let h = 0; h < u; h++) {
      const p = e.getUint16(t, !1);
      t += 2, d.push(r.subarray(t, t + p)), t += p;
    }
    const f = {
      configurationVersion: i,
      avcProfileIndication: n,
      profileCompatibility: s,
      avcLevelIndication: a,
      lengthSizeMinusOne: o,
      sequenceParameterSets: l,
      pictureParameterSets: d,
      chromaFormat: null,
      bitDepthLumaMinus8: null,
      bitDepthChromaMinus8: null,
      sequenceParameterSetExt: null
    };
    if ((n === 100 || n === 110 || n === 122 || n === 144) && t + 4 <= r.length) {
      const h = e.getUint8(t++) & 3, p = e.getUint8(t++) & 7, m = e.getUint8(t++) & 7, y = e.getUint8(t++);
      f.chromaFormat = h, f.bitDepthLumaMinus8 = p, f.bitDepthChromaMinus8 = m;
      const w = [];
      for (let b = 0; b < y; b++) {
        const k = e.getUint16(t, !1);
        t += 2, w.push(r.subarray(t, t + k)), t += k;
      }
      f.sequenceParameterSetExt = w;
    }
    return f;
  } catch (e) {
    return q._error("Error deserializing AVC Decoder Configuration Record:", e), null;
  }
}, Va = {
  1: { num: 1, den: 1 },
  2: { num: 12, den: 11 },
  3: { num: 10, den: 11 },
  4: { num: 16, den: 11 },
  5: { num: 40, den: 33 },
  6: { num: 24, den: 11 },
  7: { num: 20, den: 11 },
  8: { num: 32, den: 11 },
  9: { num: 80, den: 33 },
  10: { num: 18, den: 11 },
  11: { num: 15, den: 11 },
  12: { num: 64, den: 33 },
  13: { num: 160, den: 99 },
  14: { num: 4, den: 3 },
  15: { num: 3, den: 2 },
  16: { num: 2, den: 1 }
}, qn = (r) => {
  try {
    const e = new Q(Ti(r));
    if (e.skipBits(1), e.skipBits(2), e.readBits(5) !== 7)
      return null;
    const i = e.readAlignedByte(), n = e.readAlignedByte(), s = e.readAlignedByte();
    M(e);
    let a = 1, o = 0, c = 0, l = 0;
    if ((i === 100 || i === 110 || i === 122 || i === 244 || i === 44 || i === 83 || i === 86 || i === 118 || i === 128) && (a = M(e), a === 3 && (l = e.readBits(1)), o = M(e), c = M(e), e.skipBits(1), e.readBits(1))) {
      for (let _ = 0; _ < (a !== 3 ? 8 : 12); _++)
        if (e.readBits(1)) {
          const O = _ < 6 ? 16 : 64;
          let D = 8, z = 8;
          for (let j = 0; j < O; j++) {
            if (z !== 0) {
              const Z = st(e);
              z = (D + Z + 256) % 256;
            }
            D = z === 0 ? D : z;
          }
        }
    }
    M(e);
    const u = M(e);
    if (u === 0)
      M(e);
    else if (u === 1) {
      e.skipBits(1), st(e), st(e);
      const I = M(e);
      for (let _ = 0; _ < I; _++)
        st(e);
    }
    M(e), e.skipBits(1);
    const d = M(e), f = M(e), h = 16 * (d + 1), p = 16 * (f + 1);
    let m = h, y = p;
    const w = e.readBits(1);
    if (w || e.skipBits(1), e.skipBits(1), e.readBits(1)) {
      const I = M(e), _ = M(e), F = M(e), O = M(e);
      let D, z;
      if ((l === 0 ? a : 0) === 0)
        D = 1, z = 2 - w;
      else {
        const Z = a === 3 ? 1 : 2, le = a === 1 ? 2 : 1;
        D = Z, z = le * (2 - w);
      }
      m -= D * (I + _), y -= z * (F + O);
    }
    let k = 2, A = 2, T = 2, x = 0, C = { num: 1, den: 1 }, P = null, S = null;
    if (e.readBits(1)) {
      if (e.readBits(1)) {
        const le = e.readBits(8);
        if (le === 255)
          C = {
            num: e.readBits(16),
            den: e.readBits(16)
          };
        else {
          const _e = Va[le];
          _e && (C = _e);
        }
      }
      e.readBits(1) && e.skipBits(1), e.readBits(1) && (e.skipBits(3), x = e.readBits(1), e.readBits(1) && (k = e.readBits(8), A = e.readBits(8), T = e.readBits(8))), e.readBits(1) && (M(e), M(e)), e.readBits(1) && (e.skipBits(32), e.skipBits(32), e.skipBits(1));
      const z = e.readBits(1);
      z && gs(e);
      const j = e.readBits(1);
      j && gs(e), (z || j) && e.skipBits(1), e.skipBits(1), e.readBits(1) && (e.skipBits(1), M(e), M(e), M(e), M(e), P = M(e), S = M(e));
    }
    if (P === null) {
      g(S === null);
      const I = n & 16;
      if ((i === 44 || i === 86 || i === 100 || i === 110 || i === 122 || i === 244) && I)
        P = 0, S = 0;
      else {
        const _ = d + 1, F = f + 1, O = (2 - w) * F, D = ni.find((j) => j.level >= s) ?? te(ni), z = Math.min(Math.floor(D.maxDpbMbs / (_ * O)), 16);
        P = z, S = z;
      }
    }
    return g(S !== null), {
      profileIdc: i,
      constraintFlags: n,
      levelIdc: s,
      frameMbsOnlyFlag: w,
      chromaFormatIdc: a,
      bitDepthLumaMinus8: o,
      bitDepthChromaMinus8: c,
      codedWidth: h,
      codedHeight: p,
      displayWidth: m,
      displayHeight: y,
      pixelAspectRatio: C,
      colourPrimaries: k,
      matrixCoefficients: T,
      transferCharacteristics: A,
      fullRangeFlag: x,
      numReorderFrames: P,
      maxDecFrameBuffering: S
    };
  } catch (e) {
    return q._error("Error parsing AVC SPS:", e), null;
  }
}, gs = (r) => {
  const e = M(r);
  r.skipBits(4), r.skipBits(4);
  for (let t = 0; t <= e; t++)
    M(r), M(r), r.skipBits(1);
  r.skipBits(5), r.skipBits(5), r.skipBits(5), r.skipBits(5);
}, Fc = (r, e) => {
  if (e.description) {
    const n = (be(e.description)[21] & 3) + 1;
    return Wn(r, n);
  } else
    return Na(r);
}, oi = (r, e) => {
  if (e.description) {
    const n = (be(e.description)[21] & 3) + 1;
    return Oa(r, n);
  } else
    return zr(r);
}, Yt = (r) => r >> 1 & 63, Ua = (r) => {
  try {
    const e = new Q(Ti(r));
    e.skipBits(16), e.readBits(4);
    const t = e.readBits(3), i = e.readBits(1), { general_profile_space: n, general_tier_flag: s, general_profile_idc: a, general_profile_compatibility_flags: o, general_constraint_indicator_flags: c, general_level_idc: l } = Mc(e, t);
    M(e);
    const u = M(e);
    let d = 0;
    u === 3 && (d = e.readBits(1));
    const f = M(e), h = M(e);
    let p = f, m = h;
    if (e.readBits(1)) {
      const _ = M(e), F = M(e), O = M(e), D = M(e);
      let z = 1, j = 1;
      const Z = d === 0 ? u : 0;
      Z === 1 ? (z = 2, j = 2) : Z === 2 && (z = 2, j = 1), p -= (_ + F) * z, m -= (O + D) * j;
    }
    const y = M(e), w = M(e);
    M(e);
    const k = e.readBits(1) ? 0 : t;
    let A = 0;
    for (let _ = k; _ <= t; _++)
      M(e), A = M(e), M(e);
    M(e), M(e), M(e), M(e), M(e), M(e), e.readBits(1) && e.readBits(1) && zc(e), e.skipBits(1), e.skipBits(1), e.readBits(1) && (e.skipBits(4), e.skipBits(4), M(e), M(e), e.skipBits(1));
    const T = M(e);
    if (Oc(e, T), e.readBits(1)) {
      const _ = M(e);
      for (let F = 0; F < _; F++)
        M(e), e.skipBits(1);
    }
    e.skipBits(1), e.skipBits(1);
    let x = 2, C = 2, P = 2, S = 0, E = 0, I = { num: 1, den: 1 };
    if (e.readBits(1)) {
      const _ = Nc(e, t);
      I = _.pixelAspectRatio, x = _.colourPrimaries, C = _.transferCharacteristics, P = _.matrixCoefficients, S = _.fullRangeFlag, E = _.minSpatialSegmentationIdc;
    }
    return {
      displayWidth: p,
      displayHeight: m,
      pixelAspectRatio: I,
      colourPrimaries: x,
      transferCharacteristics: C,
      matrixCoefficients: P,
      fullRangeFlag: S,
      maxDecFrameBuffering: A + 1,
      spsMaxSubLayersMinus1: t,
      spsTemporalIdNestingFlag: i,
      generalProfileSpace: n,
      generalTierFlag: s,
      generalProfileIdc: a,
      generalProfileCompatibilityFlags: o,
      generalConstraintIndicatorFlags: c,
      generalLevelIdc: l,
      chromaFormatIdc: u,
      bitDepthLumaMinus8: y,
      bitDepthChromaMinus8: w,
      minSpatialSegmentationIdc: E
    };
  } catch (e) {
    return q._error("Error parsing HEVC SPS:", e), null;
  }
}, Si = (r) => {
  try {
    const e = [], t = [], i = [], n = [];
    for (const l of zr(r)) {
      const u = r.subarray(l.offset, l.offset + l.length), d = Yt(u[0]);
      d === ce.VPS_NUT ? e.push(u) : d === ce.SPS_NUT ? t.push(u) : d === ce.PPS_NUT ? i.push(u) : (d === ce.PREFIX_SEI_NUT || d === ce.SUFFIX_SEI_NUT) && n.push(u);
    }
    if (t.length === 0 || i.length === 0)
      return null;
    const s = Ua(t[0]);
    if (!s)
      return null;
    let a = 0;
    if (i.length > 0) {
      const l = i[0], u = new Q(Ti(l));
      u.skipBits(16), M(u), M(u), u.skipBits(1), u.skipBits(1), u.skipBits(3), u.skipBits(1), u.skipBits(1), M(u), M(u), st(u), u.skipBits(1), u.skipBits(1), u.readBits(1) && M(u), st(u), st(u), u.skipBits(1), u.skipBits(1), u.skipBits(1), u.skipBits(1);
      const d = u.readBits(1), f = u.readBits(1);
      !d && !f ? a = 0 : d && !f ? a = 2 : !d && f ? a = 3 : a = 0;
    }
    const o = [
      ...e.length ? [
        {
          arrayCompleteness: 1,
          nalUnitType: ce.VPS_NUT,
          nalUnits: e
        }
      ] : [],
      ...t.length ? [
        {
          arrayCompleteness: 1,
          nalUnitType: ce.SPS_NUT,
          nalUnits: t
        }
      ] : [],
      ...i.length ? [
        {
          arrayCompleteness: 1,
          nalUnitType: ce.PPS_NUT,
          nalUnits: i
        }
      ] : [],
      ...n.length ? [
        {
          arrayCompleteness: 1,
          nalUnitType: Yt(n[0][0]),
          nalUnits: n
        }
      ] : []
    ];
    return {
      configurationVersion: 1,
      generalProfileSpace: s.generalProfileSpace,
      generalTierFlag: s.generalTierFlag,
      generalProfileIdc: s.generalProfileIdc,
      generalProfileCompatibilityFlags: s.generalProfileCompatibilityFlags,
      generalConstraintIndicatorFlags: s.generalConstraintIndicatorFlags,
      generalLevelIdc: s.generalLevelIdc,
      minSpatialSegmentationIdc: s.minSpatialSegmentationIdc,
      parallelismType: a,
      chromaFormatIdc: s.chromaFormatIdc,
      bitDepthLumaMinus8: s.bitDepthLumaMinus8,
      bitDepthChromaMinus8: s.bitDepthChromaMinus8,
      avgFrameRate: 0,
      constantFrameRate: 0,
      numTemporalLayers: s.spsMaxSubLayersMinus1 + 1,
      temporalIdNested: s.spsTemporalIdNestingFlag,
      lengthSizeMinusOne: 3,
      arrays: o
    };
  } catch (e) {
    return q._error("Error building HEVC Decoder Configuration Record:", e), null;
  }
}, Mc = (r, e) => {
  const t = r.readBits(2), i = r.readBits(1), n = r.readBits(5);
  let s = 0;
  for (let u = 0; u < 32; u++)
    s = s << 1 | r.readBits(1);
  const a = new Uint8Array(6);
  for (let u = 0; u < 6; u++)
    a[u] = r.readBits(8);
  const o = r.readBits(8), c = [], l = [];
  for (let u = 0; u < e; u++)
    c.push(r.readBits(1)), l.push(r.readBits(1));
  if (e > 0)
    for (let u = e; u < 8; u++)
      r.skipBits(2);
  for (let u = 0; u < e; u++)
    c[u] && r.skipBits(88), l[u] && r.skipBits(8);
  return {
    general_profile_space: t,
    general_tier_flag: i,
    general_profile_idc: n,
    general_profile_compatibility_flags: s,
    general_constraint_indicator_flags: a,
    general_level_idc: o
  };
}, zc = (r) => {
  for (let e = 0; e < 4; e++)
    for (let t = 0; t < (e === 3 ? 2 : 6); t++)
      if (!r.readBits(1))
        M(r);
      else {
        const n = Math.min(64, 1 << 4 + (e << 1));
        e > 1 && st(r);
        for (let s = 0; s < n; s++)
          st(r);
      }
}, Oc = (r, e) => {
  const t = [];
  for (let i = 0; i < e; i++)
    t[i] = Dc(r, i, e, t);
}, Dc = (r, e, t, i) => {
  let n = 0, s = 0, a = 0;
  if (e !== 0 && (s = r.readBits(1)), s) {
    if (e === t) {
      const c = M(r);
      a = e - (c + 1);
    } else
      a = e - 1;
    r.readBits(1), M(r);
    const o = i[a] ?? 0;
    for (let c = 0; c <= o; c++)
      r.readBits(1) || r.readBits(1);
    n = i[a];
  } else {
    const o = M(r), c = M(r);
    for (let l = 0; l < o; l++)
      M(r), r.readBits(1);
    for (let l = 0; l < c; l++)
      M(r), r.readBits(1);
    n = o + c;
  }
  return n;
}, Nc = (r, e) => {
  let t = 2, i = 2, n = 2, s = 0, a = 0, o = { num: 1, den: 1 };
  if (r.readBits(1)) {
    const c = r.readBits(8);
    if (c === 255)
      o = {
        num: r.readBits(16),
        den: r.readBits(16)
      };
    else {
      const l = Va[c];
      l && (o = l);
    }
  }
  return r.readBits(1) && r.readBits(1), r.readBits(1) && (r.readBits(3), s = r.readBits(1), r.readBits(1) && (t = r.readBits(8), i = r.readBits(8), n = r.readBits(8))), r.readBits(1) && (M(r), M(r)), r.readBits(1), r.readBits(1), r.readBits(1), r.readBits(1) && (M(r), M(r), M(r), M(r)), r.readBits(1) && (r.readBits(32), r.readBits(32), r.readBits(1) && M(r), r.readBits(1) && Vc(r, !0, e)), r.readBits(1) && (r.readBits(1), r.readBits(1), r.readBits(1), a = M(r), M(r), M(r), M(r), M(r)), {
    pixelAspectRatio: o,
    colourPrimaries: t,
    transferCharacteristics: i,
    matrixCoefficients: n,
    fullRangeFlag: s,
    minSpatialSegmentationIdc: a
  };
}, Vc = (r, e, t) => {
  let i = !1, n = !1, s = !1;
  i = r.readBits(1) === 1, n = r.readBits(1) === 1, (i || n) && (s = r.readBits(1) === 1, s && (r.readBits(8), r.readBits(5), r.readBits(1), r.readBits(5)), r.readBits(4), r.readBits(4), s && r.readBits(4), r.readBits(5), r.readBits(5), r.readBits(5));
  for (let a = 0; a <= t; a++) {
    const o = r.readBits(1) === 1;
    let c = !0;
    o || (c = r.readBits(1) === 1);
    let l = !1;
    c ? M(r) : l = r.readBits(1) === 1;
    let u = 1;
    l || (u = M(r) + 1), i && ys(r, u, s), n && ys(r, u, s);
  }
}, ys = (r, e, t) => {
  for (let i = 0; i < e; i++)
    M(r), M(r), t && (M(r), M(r)), r.readBits(1);
}, Uc = (r) => {
  const e = [];
  e.push(r.configurationVersion), e.push((r.generalProfileSpace & 3) << 6 | (r.generalTierFlag & 1) << 5 | r.generalProfileIdc & 31), e.push(r.generalProfileCompatibilityFlags >>> 24 & 255), e.push(r.generalProfileCompatibilityFlags >>> 16 & 255), e.push(r.generalProfileCompatibilityFlags >>> 8 & 255), e.push(r.generalProfileCompatibilityFlags & 255), e.push(...r.generalConstraintIndicatorFlags), e.push(r.generalLevelIdc & 255), e.push(240 | r.minSpatialSegmentationIdc >> 8 & 15), e.push(r.minSpatialSegmentationIdc & 255), e.push(252 | r.parallelismType & 3), e.push(252 | r.chromaFormatIdc & 3), e.push(248 | r.bitDepthLumaMinus8 & 7), e.push(248 | r.bitDepthChromaMinus8 & 7), e.push(r.avgFrameRate >> 8 & 255), e.push(r.avgFrameRate & 255), e.push((r.constantFrameRate & 3) << 6 | (r.numTemporalLayers & 7) << 3 | (r.temporalIdNested & 1) << 2 | r.lengthSizeMinusOne & 3), e.push(r.arrays.length & 255);
  for (const t of r.arrays) {
    e.push((t.arrayCompleteness & 1) << 7 | 0 | t.nalUnitType & 63), e.push(t.nalUnits.length >> 8 & 255), e.push(t.nalUnits.length & 255);
    for (const i of t.nalUnits) {
      e.push(i.length >> 8 & 255), e.push(i.length & 255);
      for (let n = 0; n < i.length; n++)
        e.push(i[n]);
    }
  }
  return new Uint8Array(e);
};
var he;
(function(r) {
  r[r.audAllowed = 0] = "audAllowed", r[r.beforeFirstVcl = 1] = "beforeFirstVcl", r[r.afterFirstVcl = 2] = "afterFirstVcl", r[r.eoBitstreamAllowed = 3] = "eoBitstreamAllowed", r[r.noMoreDataAllowed = 4] = "noMoreDataAllowed";
})(he || (he = {}));
const Wc = (r, e) => {
  const t = /* @__PURE__ */ new Set();
  let i = he.audAllowed;
  for (const s of oi(r, e)) {
    if (i === he.noMoreDataAllowed) {
      t.add(s.offset);
      continue;
    }
    const a = Yt(r[s.offset]);
    if (i === he.eoBitstreamAllowed && a !== 37) {
      t.add(s.offset);
      continue;
    }
    let o = !1;
    a === 35 ? i > he.audAllowed ? o = !0 : i = he.beforeFirstVcl : a <= 31 ? i > he.afterFirstVcl ? o = !0 : i = he.afterFirstVcl : a === 36 ? i !== he.afterFirstVcl ? o = !0 : i = he.eoBitstreamAllowed : a === 37 ? i < he.afterFirstVcl ? o = !0 : i = he.noMoreDataAllowed : a === 32 || a === 33 || a === 34 || a === 39 || a >= 41 && a <= 44 || a >= 48 && a <= 55 ? i > he.beforeFirstVcl ? o = !0 : i = he.beforeFirstVcl : (a === 38 || a === 40 || a >= 45 && a <= 47 || a >= 56 && a <= 63) && i < he.afterFirstVcl && (o = !0), o && t.add(s.offset);
  }
  if (t.size === 0)
    return null;
  const n = [];
  for (const s of oi(r, e))
    t.has(s.offset) || n.push(r.subarray(s.offset, s.offset + s.length));
  return Fc(n, e);
}, Wa = (r) => {
  const e = new Q(r);
  if (e.readBits(2) !== 2)
    return null;
  const i = e.readBits(1), s = (e.readBits(1) << 1) + i;
  if (s === 3 && e.skipBits(1), e.readBits(1) === 1 || e.readBits(1) !== 0 || (e.skipBits(2), e.readBits(24) !== 4817730))
    return null;
  let l = 8;
  s >= 2 && (l = e.readBits(1) ? 12 : 10);
  const u = e.readBits(3);
  let d = 0, f = 0;
  if (u !== 7)
    if (f = e.readBits(1), s === 1 || s === 3) {
      const C = e.readBits(1), P = e.readBits(1);
      d = !C && !P ? 3 : C && !P ? 2 : 1, e.skipBits(1);
    } else
      d = 1;
  else
    d = 3, f = 1;
  const h = e.readBits(16), p = e.readBits(16), m = h + 1, y = p + 1, w = m * y;
  let b = te(pt).level;
  for (const x of pt)
    if (w <= x.maxPictureSize) {
      b = x.level;
      break;
    }
  return {
    profile: s,
    level: b,
    bitDepth: l,
    chromaSubsampling: d,
    videoFullRangeFlag: f,
    colourPrimaries: u === 2 ? 1 : u === 1 ? 6 : 2,
    transferCharacteristics: u === 2 ? 1 : u === 1 ? 6 : 2,
    matrixCoefficients: u === 7 ? 0 : u === 2 ? 1 : u === 1 ? 6 : 2
  };
}, qa = function* (r) {
  const e = new Q(r), t = () => {
    let i = 0;
    for (let n = 0; n < 8; n++) {
      const s = e.readAlignedByte();
      if (i |= (s & 127) << n * 7, !(s & 128))
        break;
      if (n === 7 && s & 128)
        return null;
    }
    return i >= 2 ** 32 - 1 ? null : i;
  };
  for (; e.getBitsLeft() >= 8; ) {
    e.skipBits(1);
    const i = e.readBits(4), n = e.readBits(1), s = e.readBits(1);
    e.skipBits(1), n && e.skipBits(8);
    let a;
    if (s) {
      const o = t();
      if (o === null)
        return;
      a = o;
    } else
      a = Math.floor(e.getBitsLeft() / 8);
    g(e.pos % 8 === 0), yield {
      type: i,
      data: r.subarray(e.pos / 8, e.pos / 8 + a)
    }, e.skipBits(a * 8);
  }
}, La = (r) => {
  for (const { type: e, data: t } of qa(r)) {
    if (e !== 1)
      continue;
    const i = new Q(t), n = i.readBits(3);
    i.readBits(1);
    const s = i.readBits(1);
    let a = 0, o = 0, c = 0;
    if (s)
      a = i.readBits(5);
    else {
      if (i.readBits(1) && (i.skipBits(32), i.skipBits(32), i.readBits(1)))
        return null;
      const T = i.readBits(1);
      T && (c = i.readBits(5), i.skipBits(32), i.skipBits(5), i.skipBits(5));
      const x = i.readBits(5);
      for (let C = 0; C <= x; C++) {
        i.skipBits(12);
        const P = i.readBits(5);
        if (C === 0 && (a = P), P > 7) {
          const E = i.readBits(1);
          C === 0 && (o = E);
        }
        if (T && i.readBits(1)) {
          const I = c + 1;
          i.skipBits(I), i.skipBits(I), i.skipBits(1);
        }
        i.readBits(1) && i.skipBits(4);
      }
    }
    const l = i.readBits(4), u = i.readBits(4), d = l + 1;
    i.skipBits(d);
    const f = u + 1;
    i.skipBits(f);
    let h = 0;
    if (s ? h = 0 : h = i.readBits(1), h && (i.skipBits(4), i.skipBits(3)), i.skipBits(1), i.skipBits(1), i.skipBits(1), !s) {
      i.skipBits(1), i.skipBits(1), i.skipBits(1), i.skipBits(1);
      const A = i.readBits(1);
      A && (i.skipBits(1), i.skipBits(1));
      const T = i.readBits(1);
      let x = 0;
      T ? x = 2 : x = i.readBits(1), x > 0 && (i.readBits(1) || i.skipBits(1)), A && i.skipBits(3);
    }
    i.skipBits(1), i.skipBits(1), i.skipBits(1);
    const p = i.readBits(1);
    let m = 8;
    n === 2 && p ? m = i.readBits(1) ? 12 : 10 : n <= 2 && (m = p ? 10 : 8);
    let y = 0;
    n !== 1 && (y = i.readBits(1));
    let w = 1, b = 1, k = 0;
    return y || (n === 0 ? (w = 1, b = 1) : n === 1 ? (w = 0, b = 0) : m === 12 && (w = i.readBits(1), w && (b = i.readBits(1))), w && b && (k = i.readBits(2))), {
      profile: n,
      level: a,
      tier: o,
      bitDepth: m,
      monochrome: y,
      chromaSubsamplingX: w,
      chromaSubsamplingY: b,
      chromaSamplePosition: k
    };
  }
  return null;
}, Ha = (r) => {
  const e = K(r), t = e.getUint8(9), i = e.getUint16(10, !0), n = e.getUint32(12, !0), s = e.getInt16(16, !0), a = e.getUint8(18);
  let o = null;
  return a && (o = r.subarray(19, 21 + t)), {
    outputChannelCount: t,
    preSkip: i,
    inputSampleRate: n,
    outputGain: s,
    channelMappingFamily: a,
    channelMappingTable: o
  };
}, qc = [
  480,
  960,
  1920,
  2880,
  480,
  960,
  1920,
  2880,
  480,
  960,
  1920,
  2880,
  480,
  960,
  480,
  960,
  120,
  240,
  480,
  960,
  120,
  240,
  480,
  960,
  120,
  240,
  480,
  960,
  120,
  240,
  480,
  960
], Lc = (r) => {
  const e = r[0] >> 3, t = r[0] & 3;
  let i;
  return t === 0 ? i = 1 : t === 1 || t === 2 ? i = 2 : i = r[1] & 63, {
    durationInSamples: qc[e] * i
  };
}, Hc = (r) => {
  if (r.length < 7)
    throw new Error("Setup header is too short.");
  if (r[0] !== 5)
    throw new Error("Wrong packet type in Setup header.");
  if (String.fromCharCode(...r.slice(1, 7)) !== "vorbis")
    throw new Error("Invalid packet signature in Setup header.");
  const t = r.length, i = new Uint8Array(t);
  for (let d = 0; d < t; d++)
    i[d] = r[t - 1 - d];
  const n = new Q(i);
  let s = 0;
  for (; n.getBitsLeft() > 97; )
    if (n.readBits(1) === 1) {
      s = n.pos;
      break;
    }
  if (s === 0)
    throw new Error("Invalid Setup header: framing bit not found.");
  let a = 0, o = !1, c = 0;
  for (; n.getBitsLeft() >= 97; ) {
    const d = n.pos, f = n.readBits(8), h = n.readBits(16), p = n.readBits(16);
    if (f > 63 || h !== 0 || p !== 0) {
      n.pos = d;
      break;
    }
    if (n.skipBits(1), a++, a > 64)
      break;
    n.clone().readBits(6) + 1 === a && (o = !0, c = a);
  }
  if (!o)
    throw new Error("Invalid Setup header: mode header not found.");
  if (c > 63)
    throw new Error(`Unsupported mode count: ${c}.`);
  const l = c;
  n.pos = 0, n.skipBits(s);
  const u = Array(l).fill(0);
  for (let d = l - 1; d >= 0; d--)
    n.skipBits(40), u[d] = n.readBits(1);
  return { modeBlockflags: u };
}, xi = (r, e, t) => {
  switch (r) {
    case "avc": {
      for (const i of Da(t, e)) {
        const n = t[i.offset], s = ki(n);
        if (s >= de.NON_IDR_SLICE && s <= de.SLICE_DPC)
          return "delta";
        if (s === de.IDR)
          return "key";
        if (s === de.SEI && (!dn() || lc() >= 144)) {
          const a = t.subarray(i.offset, i.offset + i.length), o = Ti(a);
          let c = 1;
          do {
            let l = 0;
            for (; ; ) {
              const f = o[c++];
              if (f === void 0 || (l += f, f < 255))
                break;
            }
            let u = 0;
            for (; ; ) {
              const f = o[c++];
              if (f === void 0 || (u += f, f < 255))
                break;
            }
            if (l === 6) {
              const f = new Q(o);
              f.pos = 8 * c;
              const h = M(f), p = f.readBits(1);
              if (h === 0 && p === 1)
                return "key";
            }
            c += u;
          } while (c < o.length - 1);
        }
      }
      return "delta";
    }
    case "hevc": {
      for (const i of oi(t, e)) {
        const n = Yt(t[i.offset]);
        if (n < ce.BLA_W_LP)
          return "delta";
        if (n <= ce.RSV_IRAP_VCL23)
          return "key";
      }
      return "delta";
    }
    case "vp8":
      return (t[0] & 1) === 0 ? "key" : "delta";
    case "vp9": {
      const i = new Q(t);
      if (i.readBits(2) !== 2)
        return null;
      const n = i.readBits(1);
      return (i.readBits(1) << 1) + n === 3 && i.skipBits(1), i.readBits(1) ? null : i.readBits(1) === 0 ? "key" : "delta";
    }
    case "av1": {
      let i = !1;
      for (const { type: n, data: s } of qa(t))
        if (n === 1) {
          const a = new Q(s);
          a.skipBits(4), i = !!a.readBits(1);
        } else if (n === 3 || n === 6 || n === 7) {
          if (i)
            return "key";
          const a = new Q(s);
          return a.readBits(1) ? null : a.readBits(2) === 0 ? "key" : "delta";
        }
      return null;
    }
    case "prores":
      return "key";
    default:
      Re(r), g(!1);
  }
};
var Xt;
(function(r) {
  r[r.STREAMINFO = 0] = "STREAMINFO", r[r.VORBIS_COMMENT = 4] = "VORBIS_COMMENT", r[r.PICTURE = 6] = "PICTURE";
})(Xt || (Xt = {}));
const mn = (r, e) => {
  const t = K(r);
  let i = 0;
  const n = t.getUint32(i, !0);
  i += 4;
  const s = Ae.decode(r.subarray(i, i + n));
  i += n, n > 0 && (e.raw ??= {}, e.raw.vendor ??= s);
  const a = t.getUint32(i, !0);
  i += 4;
  for (let o = 0; o < a; o++) {
    const c = t.getUint32(i, !0);
    i += 4;
    const l = Ae.decode(r.subarray(i, i + c));
    i += c;
    const u = l.indexOf("=");
    if (u === -1)
      continue;
    const d = l.slice(0, u).toUpperCase(), f = l.slice(u + 1);
    switch (e.raw ??= {}, e.raw[d] ??= f, d) {
      case "TITLE":
        e.title ??= f;
        break;
      case "DESCRIPTION":
        e.description ??= f;
        break;
      case "ARTIST":
        e.artist ??= f;
        break;
      case "ALBUM":
        e.album ??= f;
        break;
      case "ALBUMARTIST":
        e.albumArtist ??= f;
        break;
      case "COMMENT":
        e.comment ??= f;
        break;
      case "LYRICS":
        e.lyrics ??= f;
        break;
      case "TRACKNUMBER":
        {
          const h = f.split("/"), p = Number.parseInt(h[0], 10), m = h[1] && Number.parseInt(h[1], 10);
          Number.isInteger(p) && p > 0 && (e.trackNumber ??= p), m && Number.isInteger(m) && m > 0 && (e.tracksTotal ??= m);
        }
        break;
      case "TRACKTOTAL":
        {
          const h = Number.parseInt(f, 10);
          Number.isInteger(h) && h > 0 && (e.tracksTotal ??= h);
        }
        break;
      case "DISCNUMBER":
        {
          const h = f.split("/"), p = Number.parseInt(h[0], 10), m = h[1] && Number.parseInt(h[1], 10);
          Number.isInteger(p) && p > 0 && (e.discNumber ??= p), m && Number.isInteger(m) && m > 0 && (e.discsTotal ??= m);
        }
        break;
      case "DISCTOTAL":
        {
          const h = Number.parseInt(f, 10);
          Number.isInteger(h) && h > 0 && (e.discsTotal ??= h);
        }
        break;
      case "DATE":
        {
          const h = new Date(f);
          Number.isNaN(h.getTime()) || (e.date ??= h);
        }
        break;
      case "GENRE":
        e.genre ??= f;
        break;
      case "METADATA_BLOCK_PICTURE":
        {
          const h = ii(f), p = K(h), m = p.getUint32(0, !1), y = p.getUint32(4, !1), w = String.fromCharCode(...h.subarray(8, 8 + y)), b = p.getUint32(8 + y, !1), k = Ae.decode(h.subarray(12 + y, 12 + y + b)), A = p.getUint32(y + b + 28), T = h.subarray(y + b + 32, y + b + 32 + A);
          e.images ??= [], e.images.push({
            data: T,
            mimeType: w,
            kind: m === 3 ? "coverFront" : m === 4 ? "coverBack" : "unknown",
            name: void 0,
            description: k || void 0
          });
        }
        break;
    }
  }
}, Ln = [2, 1, 2, 3, 3, 4, 4, 5], ja = (r) => {
  if (r.length < 7 || r[0] !== 11 || r[1] !== 119)
    return null;
  const e = new Q(r);
  e.skipBits(16), e.skipBits(16);
  const t = e.readBits(2);
  if (t === 3)
    return null;
  const i = e.readBits(6), n = e.readBits(5);
  if (n > 8)
    return null;
  const s = e.readBits(3), a = e.readBits(3);
  (a & 1) !== 0 && a !== 1 && e.skipBits(2), (a & 4) !== 0 && e.skipBits(2), a === 2 && e.skipBits(2);
  const o = e.readBits(1), c = Math.floor(i / 2);
  return { fscod: t, bsid: n, bsmod: s, acmod: a, lfeon: o, bitRateCode: c };
}, jc = [
  // frmsizecod, [48kHz, 44.1kHz, 32kHz] in bytes
  128,
  138,
  192,
  128,
  140,
  192,
  160,
  174,
  240,
  160,
  176,
  240,
  192,
  208,
  288,
  192,
  210,
  288,
  224,
  242,
  336,
  224,
  244,
  336,
  256,
  278,
  384,
  256,
  280,
  384,
  320,
  348,
  480,
  320,
  350,
  480,
  384,
  416,
  288 * 2,
  384,
  418,
  288 * 2,
  448,
  486,
  336 * 2,
  448,
  488,
  336 * 2,
  256 * 2,
  278 * 2,
  384 * 2,
  256 * 2,
  279 * 2,
  384 * 2,
  320 * 2,
  348 * 2,
  480 * 2,
  320 * 2,
  349 * 2,
  480 * 2,
  384 * 2,
  417 * 2,
  576 * 2,
  384 * 2,
  418 * 2,
  576 * 2,
  448 * 2,
  487 * 2,
  672 * 2,
  448 * 2,
  488 * 2,
  672 * 2,
  512 * 2,
  557 * 2,
  768 * 2,
  512 * 2,
  558 * 2,
  768 * 2,
  640 * 2,
  696 * 2,
  960 * 2,
  640 * 2,
  697 * 2,
  960 * 2,
  768 * 2,
  835 * 2,
  1152 * 2,
  768 * 2,
  836 * 2,
  1152 * 2,
  896 * 2,
  975 * 2,
  1344 * 2,
  896 * 2,
  976 * 2,
  1344 * 2,
  1024 * 2,
  1114 * 2,
  1536 * 2,
  1024 * 2,
  1115 * 2,
  1536 * 2,
  1152 * 2,
  1253 * 2,
  1728 * 2,
  1152 * 2,
  1254 * 2,
  1728 * 2,
  1280 * 2,
  1393 * 2,
  1920 * 2,
  1280 * 2,
  1394 * 2,
  1920 * 2
], Kc = 1536, Ka = [1, 2, 3, 6], Qa = (r) => {
  if (r.length < 6 || r[0] !== 11 || r[1] !== 119)
    return null;
  const e = new Q(r);
  e.skipBits(16);
  const t = e.readBits(2);
  if (e.skipBits(3), t !== 0 && t !== 2)
    return null;
  const i = e.readBits(11), n = e.readBits(2);
  let s = 0, a;
  n === 3 ? (s = e.readBits(2), a = 3) : a = e.readBits(2);
  const o = e.readBits(3), c = e.readBits(1), l = e.readBits(5);
  if (l < 11 || l > 16)
    return null;
  const u = Ka[a];
  let d;
  return n < 3 ? d = bi[n] / 1e3 : d = za[s] / 1e3, {
    dataRate: Math.round((i + 1) * d / (u * 16)),
    substreams: [{
      fscod: n,
      fscod2: s,
      bsid: l,
      bsmod: 0,
      acmod: o,
      lfeon: c,
      numDepSub: 0,
      chanLoc: 0
    }]
  };
}, Qc = (r) => {
  if (r.length < 2)
    return null;
  const e = new Q(r), t = e.readBits(13), i = e.readBits(3), n = [];
  for (let s = 0; s <= i && !(Math.ceil(e.pos / 8) + 3 > r.length); s++) {
    const a = e.readBits(2), o = e.readBits(5);
    e.skipBits(1), e.skipBits(1);
    const c = e.readBits(3), l = e.readBits(3), u = e.readBits(1);
    e.skipBits(3);
    const d = e.readBits(4);
    let f = 0;
    d > 0 ? f = e.readBits(9) : e.skipBits(1), n.push({
      fscod: a,
      fscod2: null,
      bsid: o,
      bsmod: c,
      acmod: l,
      lfeon: u,
      numDepSub: d,
      chanLoc: f
    });
  }
  return n.length === 0 ? null : { dataRate: t, substreams: n };
}, Ga = (r) => {
  const e = r.substreams[0];
  return g(e), e.fscod < 3 ? bi[e.fscod] : e.fscod2 !== null && e.fscod2 < 3 ? za[e.fscod2] : null;
}, Xa = (r) => {
  const e = r.substreams[0];
  g(e);
  let t = Ln[e.acmod] + e.lfeon;
  if (e.numDepSub > 0) {
    const i = [2, 2, 1, 1, 2, 2, 2, 1, 1];
    for (let n = 0; n < 9; n++)
      e.chanLoc & 1 << 8 - n && (t += i[n]);
  }
  return t;
}, Gc = 1683496997, Qr = 18, pn = 10, Xc = 4096, ws = 32, Hn = 20, $c = 8, Yc = [
  0,
  8e3,
  16e3,
  32e3,
  0,
  0,
  11025,
  22050,
  44100,
  0,
  0,
  12e3,
  24e3,
  48e3,
  96e3,
  192e3
], Zc = [
  32e3,
  56e3,
  64e3,
  96e3,
  112e3,
  128e3,
  192e3,
  224e3,
  256e3,
  32e4,
  384e3,
  448e3,
  512e3,
  576e3,
  64e4,
  768e3,
  96e4,
  1024e3,
  1152e3,
  128e4,
  1344e3,
  1408e3,
  1411200,
  1472e3,
  1536e3,
  192e4,
  2048e3,
  3072e3,
  384e4,
  0,
  0,
  0
], Jc = [16, 16, 20, 20, 0, 24, 24, 0], ci = [1, 2, 2, 2, 2, 3, 3, 4, 4, 5, 6, 6, 6, 7, 8, 8], el = [
  1,
  2,
  2,
  2,
  2,
  3,
  18,
  19,
  6,
  7,
  518,
  323,
  83,
  519,
  582,
  535
], tl = 8, rl = 44646, il = [32e3, 44100, 48e3, 0], nl = [
  8e3,
  16e3,
  32e3,
  64e3,
  128e3,
  22050,
  44100,
  88200,
  176400,
  352800,
  12e3,
  24e3,
  48e3,
  96e3,
  192e3,
  384e3
], $a = [512, 1024, 2048, 4096], jn = (r) => {
  const e = Za(r), t = K(r);
  let i = e ? Math.ceil(e.frameSize / 4) * 4 : 0, n = null;
  for (; i + 4 <= r.length && t.getUint32(i) === Gc; ) {
    const a = Gr(r.subarray(i));
    if (!a)
      break;
    n ??= a, i += a.frameSize;
  }
  if (e)
    return {
      frameSize: n ? i : e.frameSize,
      sampleRate: e.sampleRate,
      numberOfChannels: e.numberOfChannels,
      sampleCount: e.sampleCount,
      channelLayout: e.channelLayout,
      pcmResolution: e.pcmResolution,
      bitRate: e.bitRate,
      core: e,
      hasExtensions: n !== null
    };
  if (!n?.asset)
    return null;
  const { asset: s } = n;
  return {
    frameSize: i,
    sampleRate: s.sampleRate,
    numberOfChannels: s.numberOfChannels,
    sampleCount: s.sampleCount,
    channelLayout: s.channelLayout,
    pcmResolution: s.pcmResolution,
    bitRate: 0,
    core: null,
    hasExtensions: !0
  };
}, Ya = (r) => {
  const e = jn(r);
  return e?.core ? e.hasExtensions ? "dtsh" : "dtsc" : null;
}, Za = (r) => {
  if (r.length < Qr || r[0] !== 127 || r[1] !== 254 || r[2] !== 128 || r[3] !== 1)
    return null;
  const e = new Q(r);
  if (e.skipBits(32), e.skipBits(1), e.readBits(5) !== ws - 1)
    return null;
  const t = e.readBits(1), i = e.readBits(7) + 1;
  if (i % $c !== 0)
    return null;
  const n = e.readBits(14) + 1;
  if (n < 96)
    return null;
  const s = e.readBits(6);
  if (s >= ci.length)
    return null;
  const a = Yc[e.readBits(4)];
  if (a === 0)
    return null;
  const o = Zc[e.readBits(5)];
  if (e.readBits(1) !== 0)
    return null;
  e.skipBits(4), e.skipBits(5);
  const c = e.readBits(2);
  if (c === 3)
    return null;
  e.skipBits(1), t && e.skipBits(16), e.skipBits(7);
  const l = Jc[e.readBits(3)];
  if (l === 0)
    return null;
  const u = c !== 0;
  return {
    frameSize: n,
    sampleRate: a,
    numberOfChannels: ci[s] + (u ? 1 : 0),
    sampleCount: i * ws,
    channelLayout: el[s] | (u ? tl : 0),
    amode: s,
    lfePresent: u,
    bitRate: o,
    pcmResolution: l
  };
}, Gr = (r) => {
  if (r.length < pn || r[0] !== 100 || r[1] !== 88 || r[2] !== 32 || r[3] !== 37)
    return null;
  const e = new Q(r);
  e.skipBits(32), e.skipBits(8);
  const t = e.readBits(2), i = e.readBits(1), n = 8 + 4 * i, s = 16 + 4 * i;
  e.skipBits(n);
  const a = e.readBits(s) + 1, o = { frameSize: a, asset: null };
  if (!e.readBits(1))
    return o;
  const c = il[e.readBits(2)], l = 512 * (e.readBits(3) + 1);
  e.readBits(1) && e.skipBits(36);
  const u = e.readBits(3) + 1, d = e.readBits(3) + 1, f = [];
  for (let w = 0; w < u; w++)
    f.push(e.readBits(t + 1));
  for (const w of f)
    e.skipBits(8 * un(w));
  if (e.readBits(1)) {
    e.skipBits(2);
    const w = e.readBits(2) + 1 << 2, b = e.readBits(2) + 1;
    e.skipBits(b * w);
  }
  for (let w = 0; w < d; w++)
    e.skipBits(s);
  e.skipBits(9), e.skipBits(3), e.readBits(1) && e.skipBits(4), e.readBits(1) && e.skipBits(24), e.readBits(1) && e.skipBits(8 * (e.readBits(10) + 1));
  const h = e.readBits(5) + 1, p = nl[e.readBits(4)], m = e.readBits(8) + 1;
  let y = 0;
  if (e.readBits(1) && (m > 2 && e.skipBits(1), m > 6 && e.skipBits(1), e.readBits(1))) {
    const w = e.readBits(2) + 1 << 2;
    y = e.readBits(w);
  }
  return c === 0 || e.getBitsLeft() < 0 ? o : {
    frameSize: a,
    asset: {
      sampleRate: p,
      numberOfChannels: m,
      sampleCount: Math.round(l * p / c),
      channelLayout: y,
      pcmResolution: h
    }
  };
}, sl = (r) => {
  if (r.length < Hn)
    return null;
  const e = K(r), t = e.getUint32(0);
  if (t === 0)
    return null;
  const i = new Q(r);
  i.seekToByte(13);
  const n = i.readBits(2);
  i.skipBits(5);
  const s = i.readBits(1), a = i.readBits(6);
  i.skipBits(14), i.skipBits(1), i.skipBits(3);
  const o = i.readBits(16);
  let c = null;
  return o !== 0 ? c = ol(o) : a < ci.length && (c = ci[a] + s), {
    sampleRate: t,
    maxBitrate: e.getUint32(4),
    avgBitrate: e.getUint32(8),
    pcmSampleDepth: r[12],
    sampleCount: $a[n],
    channelLayout: o,
    numberOfChannels: c
  };
}, al = (r) => {
  const e = new Uint8Array(Hn), t = K(e);
  t.setUint32(0, r.sampleRate), t.setUint32(4, r.bitRate), t.setUint32(8, r.bitRate), e[12] = r.pcmResolution;
  const i = r.core && !r.hasExtensions ? 1 : 0, n = new Q(e);
  return n.seekToByte(13), n.writeBits(2, Math.max($a.indexOf(r.sampleCount), 0)), n.writeBits(5, i), n.writeBits(1, r.core?.lfePresent ? 1 : 0), n.writeBits(6, r.core?.amode ?? 0), n.writeBits(14, r.core ? r.core.frameSize - 1 : 0), n.writeBits(1, 0), n.writeBits(3, 0), n.writeBits(16, r.channelLayout), n.writeBits(1, 0), n.writeBits(1, 0), n.writeBits(1, 0), n.writeBits(5, 0), e;
}, ol = (r) => un(r) + un(r & rl);
class lt {
  constructor(e) {
    this.input = e;
  }
  dispose() {
  }
}
const Ie = /* @__PURE__ */ new Uint8Array(0);
class Y {
  /** Creates a new {@link EncodedPacket} from raw bytes and timing information. */
  constructor(e, t, i, n, s = -1, a, o) {
    if (this.data = e, this.type = t, this.timestamp = i, this.duration = n, this.sequenceNumber = s, e === Ie && a === void 0)
      throw new Error("Internal error: byteLength must be explicitly provided when constructing metadata-only packets.");
    if (a === void 0 && (a = e.byteLength), !(e instanceof Uint8Array))
      throw new TypeError("data must be a Uint8Array.");
    if (t !== "key" && t !== "delta")
      throw new TypeError('type must be either "key" or "delta".');
    if (!Number.isFinite(i))
      throw new TypeError("timestamp must be a number.");
    if (!Number.isFinite(n) || n < 0)
      throw new TypeError("duration must be a non-negative number.");
    if (!Number.isFinite(s))
      throw new TypeError("sequenceNumber must be a number.");
    if (!Number.isInteger(a) || a < 0)
      throw new TypeError("byteLength must be a non-negative integer.");
    if (o !== void 0 && (typeof o != "object" || !o))
      throw new TypeError("sideData, when provided, must be an object.");
    if (o?.alpha !== void 0 && !(o.alpha instanceof Uint8Array))
      throw new TypeError("sideData.alpha, when provided, must be a Uint8Array.");
    if (o?.alphaByteLength !== void 0 && (!Number.isInteger(o.alphaByteLength) || o.alphaByteLength < 0))
      throw new TypeError("sideData.alphaByteLength, when provided, must be a non-negative integer.");
    this.byteLength = a, this.sideData = o ?? {}, this.sideData.alpha && this.sideData.alphaByteLength === void 0 && (this.sideData.alphaByteLength = this.sideData.alpha.byteLength);
  }
  /**
   * If this packet is a metadata-only packet. Metadata-only packets don't contain their packet data. They are the
   * result of retrieving packets with {@link PacketRetrievalOptions.metadataOnly} set to `true`.
   */
  get isMetadataOnly() {
    return this.data === Ie;
  }
  /** The timestamp of this packet in microseconds. */
  get microsecondTimestamp() {
    return Math.trunc(mt * this.timestamp);
  }
  /** The duration of this packet in microseconds. */
  get microsecondDuration() {
    return Math.trunc(mt * this.duration);
  }
  /** Converts this packet to an
   * [`EncodedVideoChunk`](https://developer.mozilla.org/en-US/docs/Web/API/EncodedVideoChunk) for use with the
   * WebCodecs API. */
  toEncodedVideoChunk() {
    if (this.isMetadataOnly)
      throw new TypeError("Metadata-only packets cannot be converted to a video chunk.");
    if (typeof EncodedVideoChunk > "u")
      throw new Error("EncodedVideoChunk is not available in this environment.");
    return new EncodedVideoChunk({
      data: this.data,
      type: this.type,
      timestamp: this.microsecondTimestamp,
      duration: this.microsecondDuration
    });
  }
  /**
   * Converts this packet to an
   * [`EncodedVideoChunk`](https://developer.mozilla.org/en-US/docs/Web/API/EncodedVideoChunk) for use with the
   * WebCodecs API, using the alpha side data instead of the color data. Throws if no alpha side data is defined.
   */
  alphaToEncodedVideoChunk(e = this.type) {
    if (!this.sideData.alpha)
      throw new TypeError("This packet does not contain alpha side data.");
    if (this.isMetadataOnly)
      throw new TypeError("Metadata-only packets cannot be converted to a video chunk.");
    if (typeof EncodedVideoChunk > "u")
      throw new Error("EncodedVideoChunk is not available in this environment.");
    return new EncodedVideoChunk({
      data: this.sideData.alpha,
      type: e,
      timestamp: this.microsecondTimestamp,
      duration: this.microsecondDuration
    });
  }
  /** Converts this packet to an
   * [`EncodedAudioChunk`](https://developer.mozilla.org/en-US/docs/Web/API/EncodedAudioChunk) for use with the
   * WebCodecs API. */
  toEncodedAudioChunk() {
    if (this.isMetadataOnly)
      throw new TypeError("Metadata-only packets cannot be converted to an audio chunk.");
    if (typeof EncodedAudioChunk > "u")
      throw new Error("EncodedAudioChunk is not available in this environment.");
    return new EncodedAudioChunk({
      data: this.data,
      type: this.type,
      timestamp: this.microsecondTimestamp,
      duration: this.microsecondDuration
    });
  }
  /**
   * Creates an {@link EncodedPacket} from an
   * [`EncodedVideoChunk`](https://developer.mozilla.org/en-US/docs/Web/API/EncodedVideoChunk) or
   * [`EncodedAudioChunk`](https://developer.mozilla.org/en-US/docs/Web/API/EncodedAudioChunk). This method is useful
   * for converting chunks from the WebCodecs API to `EncodedPacket` instances.
   */
  static fromEncodedChunk(e, t) {
    if (!(e instanceof EncodedVideoChunk || e instanceof EncodedAudioChunk))
      throw new TypeError("chunk must be an EncodedVideoChunk or EncodedAudioChunk.");
    const i = new Uint8Array(e.byteLength);
    return e.copyTo(i), new Y(i, e.type, e.timestamp / 1e6, (e.duration ?? 0) / 1e6, void 0, void 0, t);
  }
  /** Clones this packet while optionally modifying the new packet's data. */
  clone(e) {
    if (e !== void 0 && (typeof e != "object" || e === null))
      throw new TypeError("options, when provided, must be an object.");
    if (e?.data !== void 0 && !(e.data instanceof Uint8Array))
      throw new TypeError("options.data, when provided, must be a Uint8Array.");
    if (e?.type !== void 0 && e.type !== "key" && e.type !== "delta")
      throw new TypeError('options.type, when provided, must be either "key" or "delta".');
    if (e?.timestamp !== void 0 && !Number.isFinite(e.timestamp))
      throw new TypeError("options.timestamp, when provided, must be a number.");
    if (e?.duration !== void 0 && !Number.isFinite(e.duration))
      throw new TypeError("options.duration, when provided, must be a number.");
    if (e?.sequenceNumber !== void 0 && !Number.isFinite(e.sequenceNumber))
      throw new TypeError("options.sequenceNumber, when provided, must be a number.");
    if (e?.sideData !== void 0 && (typeof e.sideData != "object" || e.sideData === null))
      throw new TypeError("options.sideData, when provided, must be an object.");
    return new Y(e?.data ?? this.data, e?.type ?? this.type, e?.timestamp ?? this.timestamp, e?.duration ?? this.duration, e?.sequenceNumber ?? this.sequenceNumber, this.byteLength, e?.sideData ?? this.sideData);
  }
}
const Ja = (r) => {
  let t = (r.hasVideo ? "video/" : r.hasAudio ? "audio/" : "application/") + (r.isQuickTime ? "quicktime" : "mp4");
  if (r.codecStrings.length > 0) {
    const i = [...new Set(r.codecStrings)];
    t += `; codecs="${i.join(", ")}"`;
  }
  return t;
}, eo = (r) => {
  const e = K(r);
  let t = 0;
  const i = e.getUint8(t);
  t += 1, t += 3;
  const n = Sr(r.subarray(t, t + 16));
  t += 16;
  let s = null;
  if (i > 0) {
    const o = e.getUint32(t);
    if (t += 4, o > 0) {
      s = [];
      for (let c = 0; c < o; c++)
        s.push(Sr(r.subarray(t, t + 16))), t += 16;
    }
  }
  const a = e.getUint32(t);
  return t += 4, {
    systemId: n,
    keyIds: s,
    data: r.slice(t, t + a)
  };
}, to = (r, e) => r.systemId === e.systemId && uc(r.data, e.data);
const rt = 8, xt = 16, ft = (r) => {
  let e = R(r);
  const t = ie(r, 4);
  let i = 8;
  e === 1 && (e = ve(r), i = 16);
  const s = e - i;
  return s < 0 ? null : { name: t, totalSize: e, headerSize: i, contentSize: s };
}, wt = (r) => Ct(r) / 65536, Di = (r) => Ct(r) / 1073741824, Ni = (r) => {
  let e = 0;
  for (let t = 0; t < 4; t++) {
    e <<= 7;
    const i = N(r);
    if (e |= i & 127, (i & 128) === 0)
      break;
  }
  return e;
}, Ve = (r) => {
  let e = se(r);
  return r.skip(2), e = Math.min(e, r.remainingLength), Ae.decode(V(r, e));
}, cl = (r) => {
  const e = ft(r);
  if (!e || e.name !== "data" || r.remainingLength < 8)
    return null;
  const t = R(r);
  r.skip(4);
  const i = V(r, e.contentSize - 8);
  switch (t) {
    case 1:
      return Ae.decode(i);
    // UTF-8
    case 2:
      return new TextDecoder("utf-16be").decode(i);
    // UTF-16-BE
    case 13:
      return new Qt(i, "image/jpeg");
    case 14:
      return new Qt(i, "image/png");
    case 27:
      return new Qt(i, "image/bmp");
    default:
      return i;
  }
};
const Le = 16, Ye = new Uint32Array(256), Nt = new Uint32Array(256), Vt = new Uint32Array(256), Ut = new Uint32Array(256), Wt = new Uint32Array(256), ue = new Uint32Array(256), ro = new Uint32Array(10);
let io = !1;
const ll = () => {
  const r = new Uint8Array(256), e = new Uint8Array(256), t = new Uint8Array(256);
  for (let s = 0, a = 1; s < 256; s++)
    t[s] = a, e[a] = s, a = a ^ a << 1 ^ (a & 128 ? 283 : 0);
  const i = (s, a) => s && a ? t[(e[s] + e[a]) % 255] : 0;
  r[0] = 99;
  for (let s = 1; s < 256; s++) {
    const a = t[255 - e[s]];
    let o = a ^ a << 1 ^ a << 2 ^ a << 3 ^ a << 4;
    o = o >>> 8 ^ o & 255 ^ 99, r[s] = o;
  }
  for (let s = 0; s < 256; s++) {
    const a = r[s], o = r.indexOf(s);
    Ye[s] = a << 24 | a << 16 | a << 8 | a, ue[s] = o << 24 | o << 16 | o << 8 | o;
    const c = i(o, 14), l = i(o, 9), u = i(o, 13), d = i(o, 11), f = c << 24 | l << 16 | u << 8 | d;
    Nt[s] = f, Vt[s] = f >>> 8 | f << 24, Ut[s] = f >>> 16 | f << 16, Wt[s] = f >>> 24 | f << 8;
  }
  let n = 1;
  for (let s = 0; s < 10; s++)
    ro[s] = n << 24, n = n << 1 ^ (n & 128 ? 283 : 0);
  io = !0;
};
class no {
  constructor() {
    this.roundkey = new Uint32Array(44), this.iv = new Uint32Array(Le / Uint32Array.BYTES_PER_ELEMENT), this.in = new Uint8Array(Le), this.out = new Uint8Array(Le), this.inView = new DataView(this.in.buffer), this.outView = new DataView(this.out.buffer);
  }
  init({ key: e, iv: t }) {
    g(e.byteLength === 16), g(t.byteLength === 16), io || ll();
    const i = new DataView(e.buffer, e.byteOffset, e.byteLength), n = new DataView(t.buffer, t.byteOffset, t.byteLength);
    this.roundkey[0] = i.getUint32(0, !1), this.roundkey[1] = i.getUint32(4, !1), this.roundkey[2] = i.getUint32(8, !1), this.roundkey[3] = i.getUint32(12, !1), this.iv[0] = n.getUint32(0, !1), this.iv[1] = n.getUint32(4, !1), this.iv[2] = n.getUint32(8, !1), this.iv[3] = n.getUint32(12, !1);
    for (let s = 4; s < 44; s += 4) {
      const a = this.roundkey[s - 1];
      this.roundkey[s] = this.roundkey[s - 4] ^ Ye[a >>> 16 & 255] & 4278190080 ^ Ye[a >>> 8 & 255] & 16711680 ^ Ye[a >>> 0 & 255] & 65280 ^ Ye[a >>> 24 & 255] & 255 ^ ro[s / 4 - 1], this.roundkey[s + 1] = this.roundkey[s - 3] ^ this.roundkey[s], this.roundkey[s + 2] = this.roundkey[s - 2] ^ this.roundkey[s + 1], this.roundkey[s + 3] = this.roundkey[s - 1] ^ this.roundkey[s + 2];
    }
    for (let s = 0, a = 40; s < a; s += 4, a -= 4)
      for (let o = 0; o < 4; o++) {
        const c = this.roundkey[s + o];
        this.roundkey[s + o] = this.roundkey[a + o], this.roundkey[a + o] = c;
      }
    for (let s = 4; s < 40; s += 4)
      for (let a = 0; a < 4; a++) {
        const o = this.roundkey[s + a];
        this.roundkey[s + a] = Nt[Ye[o >>> 24 & 255] & 255] ^ Vt[Ye[o >>> 16 & 255] & 255] ^ Ut[Ye[o >>> 8 & 255] & 255] ^ Wt[Ye[o >>> 0 & 255] & 255];
      }
  }
  decrypt() {
    let e = this.inView.getUint32(0, !1) ^ this.roundkey[0], t = this.inView.getUint32(4, !1) ^ this.roundkey[1], i = this.inView.getUint32(8, !1) ^ this.roundkey[2], n = this.inView.getUint32(12, !1) ^ this.roundkey[3];
    const s = this.inView.getUint32(0, !1), a = this.inView.getUint32(4, !1), o = this.inView.getUint32(8, !1), c = this.inView.getUint32(12, !1);
    let l, u, d, f;
    for (let w = 1; w < 10; w++) {
      const b = w * 4;
      l = Nt[e >>> 24] ^ Vt[n >>> 16 & 255] ^ Ut[i >>> 8 & 255] ^ Wt[t & 255] ^ this.roundkey[b], u = Nt[t >>> 24] ^ Vt[e >>> 16 & 255] ^ Ut[n >>> 8 & 255] ^ Wt[i & 255] ^ this.roundkey[b + 1], d = Nt[i >>> 24] ^ Vt[t >>> 16 & 255] ^ Ut[e >>> 8 & 255] ^ Wt[n & 255] ^ this.roundkey[b + 2], f = Nt[n >>> 24] ^ Vt[i >>> 16 & 255] ^ Ut[t >>> 8 & 255] ^ Wt[e & 255] ^ this.roundkey[b + 3], e = l, t = u, i = d, n = f;
    }
    const h = ue[e >>> 24 & 255] & 4278190080 ^ ue[n >>> 16 & 255] & 16711680 ^ ue[i >>> 8 & 255] & 65280 ^ ue[t >>> 0 & 255] & 255 ^ this.roundkey[40], p = ue[t >>> 24 & 255] & 4278190080 ^ ue[e >>> 16 & 255] & 16711680 ^ ue[n >>> 8 & 255] & 65280 ^ ue[i >>> 0 & 255] & 255 ^ this.roundkey[41], m = ue[i >>> 24 & 255] & 4278190080 ^ ue[t >>> 16 & 255] & 16711680 ^ ue[e >>> 8 & 255] & 65280 ^ ue[n >>> 0 & 255] & 255 ^ this.roundkey[42], y = ue[n >>> 24 & 255] & 4278190080 ^ ue[i >>> 16 & 255] & 16711680 ^ ue[t >>> 8 & 255] & 65280 ^ ue[e >>> 0 & 255] & 255 ^ this.roundkey[43];
    this.outView.setUint32(0, h ^ this.iv[0], !1), this.outView.setUint32(4, p ^ this.iv[1], !1), this.outView.setUint32(8, m ^ this.iv[2], !1), this.outView.setUint32(12, y ^ this.iv[3], !1), this.iv[0] = s, this.iv[1] = a, this.iv[2] = o, this.iv[3] = c;
  }
}
const ul = (r, e, t) => {
  let i = !1, n = 0;
  const s = 2 ** 16, a = 16, o = new no();
  return new ReadableStream({
    pull: async (c) => {
      i || (o.init(await e()), i = !0);
      const l = s + a;
      let u = r.requestSliceRange(n, 0, l);
      if (u instanceof Promise && (u = await u), !u || u.length === 0)
        throw new Error("Invalid ciphertext.");
      const d = u.length;
      if (d % 16 !== 0)
        throw new Error("Invalid ciphertext.");
      const f = d === l ? d - a : d, h = V(u, f), p = new Uint8Array(f);
      for (let m = 0; m < f; m += 16)
        o.in.set(h.subarray(m, m + 16)), o.decrypt(), p.set(o.out, m);
      if (f < d)
        c.enqueue(p), n += f;
      else {
        const m = p[f - 1];
        if (m === 0 || m > 16)
          throw new Error("Invalid PKCS#7 padding. Incorrect key or corrupted data.");
        const y = p.subarray(0, f - m);
        c.enqueue(y), c.close(), t();
      }
    },
    cancel: () => {
      t();
    }
  });
};
class Kn extends lt {
  constructor(e) {
    super(e), this.moovSlice = null, this.currentTrack = null, this.tracks = [], this.metadataPromise = null, this.movieTimescale = -1, this.movieDurationInTimescale = -1, this.isQuickTime = !1, this.metadataTags = {}, this.currentMetadataKeys = null, this.isFragmented = !1, this.fragmentTrackDefaults = [], this.psshBoxes = [], this.currentFragment = null, this.lastReadFragment = null, this.decryptionKeyCache = /* @__PURE__ */ new Map(), this.reader = e._reader;
  }
  async getTrackBackings() {
    return await this.readMetadata(), this.tracks.map((e) => e.trackBacking);
  }
  async getMimeType() {
    await this.readMetadata();
    const e = await this.getTrackBackings(), t = await Promise.all(e.map((i) => i.getDecoderConfig().then((n) => n?.codec ?? null)));
    return Ja({
      isQuickTime: this.isQuickTime,
      hasVideo: this.tracks.some((i) => i.info?.type === "video"),
      hasAudio: this.tracks.some((i) => i.info?.type === "audio"),
      codecStrings: t.filter(Boolean)
    });
  }
  async getMetadataTags() {
    return await this.readMetadata(), this.metadataTags;
  }
  readMetadata() {
    return this.metadataPromise ??= (async () => {
      let e = 0, t = !1, i = !1;
      for (; ; ) {
        let n = this.reader.requestSliceRange(e, rt, xt);
        if (n instanceof Promise && (n = await n), !n)
          break;
        const s = e, a = ft(n);
        if (!a)
          break;
        if (a.name === "ftyp" || a.name === "styp") {
          const o = ie(n, 4);
          this.isQuickTime = o === "qt  ";
        } else if (a.name === "moov") {
          let o = this.reader.requestSlice(n.filePos, a.contentSize);
          if (o instanceof Promise && (o = await o), !o)
            break;
          this.moovSlice = o, this.readContiguousBoxes(this.moovSlice);
          for (const c of this.tracks) {
            const l = c.editListPreviousSegmentDurations / this.movieTimescale;
            c.editListOffset -= Math.round(l * c.timescale);
          }
          t = this.isFragmented && this.reader.fileSize !== null && this.reader.fileSize > s + a.totalSize, i = !0;
          break;
        } else if (a.name === "moof") {
          if (!this.input._initInput)
            throw new Error('"moof" box encountered with no "moov" box present; this file is likely a Segment as described in ISO/IEC 14496-12 Section 8.16. A separate init file that contains a "moov" box is required to read this file, please provide it using InputOptions.initInput.');
          await this.copyMetadataFromInitInput(this.input._initInput), t = !1, i = !0;
          break;
        }
        e = s + a.totalSize;
      }
      if (!i && this.input._initInput && await this.copyMetadataFromInitInput(this.input._initInput), t) {
        g(this.reader.fileSize !== null);
        let n = this.reader.requestSlice(this.reader.fileSize - 4, 4);
        n instanceof Promise && (n = await n), g(n);
        const s = R(n), a = this.reader.fileSize - s;
        if (a >= 0 && a <= this.reader.fileSize - xt) {
          let o = this.reader.requestSliceRange(a, rt, xt);
          if (o instanceof Promise && (o = await o), o) {
            const c = ft(o);
            if (c && c.name === "mfra") {
              let l = this.reader.requestSlice(o.filePos, c.contentSize);
              l instanceof Promise && (l = await l), l && this.readContiguousBoxes(l);
            }
          }
        }
      }
    })();
  }
  async copyMetadataFromInitInput(e) {
    const t = await e._getDemuxer();
    if (t.constructor !== Kn)
      throw new Error("Init input must match the input's format.");
    await t.readMetadata(), this.movieTimescale = t.movieTimescale, this.movieDurationInTimescale = t.movieDurationInTimescale, this.metadataTags = t.metadataTags, this.isFragmented = !0, this.fragmentTrackDefaults = t.fragmentTrackDefaults, this.psshBoxes = t.psshBoxes;
    for (const i of t.tracks) {
      const n = {
        id: i.id,
        demuxer: this,
        trackBacking: null,
        disposition: i.disposition,
        timescale: i.timescale,
        durationInMediaTimescale: i.durationInMediaTimescale,
        durationInMovieTimescale: i.durationInMovieTimescale,
        rotation: i.rotation,
        internalCodecId: i.internalCodecId,
        name: i.name,
        languageCode: i.languageCode,
        sampleTableByteOffset: null,
        sampleTable: null,
        fragmentLookupTable: [],
        currentFragmentState: null,
        fragmentPositionCache: [],
        editListPreviousSegmentDurations: i.editListPreviousSegmentDurations,
        editListOffset: i.editListOffset,
        encryptionInfo: i.encryptionInfo,
        encryptionAuxInfo: null,
        frmaCodecString: null,
        info: i.info
      };
      if (i.trackBacking) {
        if (g(n.info), n.info.type === "video" && n.info.width !== -1) {
          const s = n;
          n.trackBacking = new bs(s), this.tracks.push(n);
        } else if (n.info.type === "audio" && n.info.numberOfChannels !== -1) {
          const s = n;
          n.trackBacking = new ks(s), this.tracks.push(n);
        }
      }
    }
  }
  getSampleTableForTrack(e) {
    if (e.sampleTable)
      return e.sampleTable;
    const t = {
      sampleTimingEntries: [],
      sampleCompositionTimeOffsets: [],
      sampleSizes: [],
      keySampleIndices: null,
      chunkOffsets: [],
      sampleToChunk: [],
      presentationTimestamps: null,
      presentationTimestampIndexMap: null
    };
    if (e.sampleTable = t, e.sampleTableByteOffset === null)
      return t;
    g(this.moovSlice);
    const i = this.moovSlice.slice(e.sampleTableByteOffset);
    if (this.currentTrack = e, this.traverseBox(i), this.currentTrack = null, e.info?.type === "audio" && e.info.codec && ye.includes(e.info.codec) && t.sampleCompositionTimeOffsets.length === 0) {
      g(e.info?.type === "audio");
      const s = at(e.info.codec), a = [], o = [];
      for (let c = 0; c < t.sampleToChunk.length; c++) {
        const l = t.sampleToChunk[c], u = t.sampleToChunk[c + 1], d = (u ? u.startChunkIndex : t.chunkOffsets.length) - l.startChunkIndex;
        for (let f = 0; f < d; f++) {
          const h = l.startSampleIndex + f * l.samplesPerChunk, p = h + l.samplesPerChunk, m = G(t.sampleTimingEntries, h, (P) => P.startIndex), y = t.sampleTimingEntries[m], w = G(t.sampleTimingEntries, p, (P) => P.startIndex), b = t.sampleTimingEntries[w], k = y.startDecodeTimestamp + (h - y.startIndex) * y.delta, T = b.startDecodeTimestamp + (p - b.startIndex) * b.delta - k, x = te(a);
          x && x.delta === T ? x.count++ : a.push({
            startIndex: l.startChunkIndex + f,
            startDecodeTimestamp: k,
            count: 1,
            delta: T
          });
          const C = l.samplesPerChunk * s.sampleSize * e.info.numberOfChannels;
          o.push(C);
        }
        l.startSampleIndex = l.startChunkIndex, l.samplesPerChunk = 1;
      }
      t.sampleTimingEntries = a, t.sampleSizes = o;
    }
    if (t.sampleCompositionTimeOffsets.length > 0) {
      t.presentationTimestamps = [];
      for (const s of t.sampleTimingEntries)
        for (let a = 0; a < s.count; a++)
          t.presentationTimestamps.push({
            presentationTimestamp: s.startDecodeTimestamp + a * s.delta,
            sampleIndex: s.startIndex + a
          });
      for (const s of t.sampleCompositionTimeOffsets)
        for (let a = 0; a < s.count; a++) {
          const o = s.startIndex + a, c = t.presentationTimestamps[o];
          c && (c.presentationTimestamp += s.offset);
        }
      t.presentationTimestamps.sort((s, a) => s.presentationTimestamp - a.presentationTimestamp), t.presentationTimestampIndexMap = Array(t.presentationTimestamps.length).fill(-1);
      for (let s = 0; s < t.presentationTimestamps.length; s++)
        t.presentationTimestampIndexMap[t.presentationTimestamps[s].sampleIndex] = s;
    }
    return t;
  }
  async readFragment(e) {
    if (this.lastReadFragment?.moofOffset === e)
      return this.lastReadFragment;
    let t = this.reader.requestSliceRange(e, rt, xt);
    t instanceof Promise && (t = await t), g(t);
    const i = ft(t);
    g(i?.name === "moof");
    let n = this.reader.requestSlice(e, i.totalSize);
    n instanceof Promise && (n = await n), g(n), this.traverseBox(n);
    const s = this.lastReadFragment;
    g(s && s.moofOffset === e);
    for (const [, a] of s.trackData) {
      const o = a.track, { fragmentPositionCache: c } = o;
      if (!a.startTimestampIsFinal) {
        const u = o.fragmentLookupTable.find((d) => d.moofOffset === s.moofOffset);
        if (u)
          Vi(a, u.timestamp);
        else {
          const d = G(c, s.moofOffset - 1, (f) => f.moofOffset);
          if (d !== -1) {
            const f = c[d];
            Vi(a, f.endTimestamp);
          }
        }
        a.startTimestampIsFinal = !0;
      }
      const l = G(c, a.startTimestamp, (u) => u.startTimestamp);
      if ((l === -1 || c[l].moofOffset !== s.moofOffset) && c.splice(l + 1, 0, {
        moofOffset: s.moofOffset,
        startTimestamp: a.startTimestamp,
        endTimestamp: a.endTimestamp
      }), a.encryptionAuxInfo && o.encryptionInfo) {
        const u = await ao(this.reader, o.encryptionInfo, a.encryptionAuxInfo);
        for (let d = 0; d < Math.min(a.samples.length, u.length); d++) {
          const f = u[d];
          a.samples[d].encryption = f;
        }
      }
    }
    return s;
  }
  readContiguousBoxes(e) {
    const t = e.filePos;
    for (; e.filePos - t <= e.length - rt && this.traverseBox(e); )
      ;
  }
  // eslint-disable-next-line @stylistic/generator-star-spacing
  *iterateContiguousBoxes(e) {
    const t = e.filePos;
    for (; e.filePos - t <= e.length - rt; ) {
      const i = e.filePos, n = ft(e);
      if (!n)
        break;
      yield { boxInfo: n, slice: e }, e.filePos = i + n.totalSize;
    }
  }
  traverseBox(e) {
    const t = e.filePos, i = ft(e);
    if (!i)
      return !1;
    const n = e.filePos, s = t + i.totalSize;
    switch (i.name) {
      case "mdia":
      case "minf":
      case "dinf":
      case "mfra":
      case "edts":
      case "sinf":
      case "schi":
        this.readContiguousBoxes(e.slice(n, i.contentSize));
        break;
      case "mvhd":
        {
          const a = N(e);
          e.skip(3), a === 1 ? (e.skip(16), this.movieTimescale = R(e), this.movieDurationInTimescale = ve(e)) : (e.skip(8), this.movieTimescale = R(e), this.movieDurationInTimescale = R(e));
        }
        break;
      case "trak":
        {
          const a = {
            id: -1,
            demuxer: this,
            trackBacking: null,
            disposition: {
              ...ct,
              primary: !1
            },
            info: null,
            timescale: -1,
            durationInMovieTimescale: -1,
            durationInMediaTimescale: -1,
            rotation: 0,
            internalCodecId: null,
            name: null,
            languageCode: ge,
            sampleTableByteOffset: -1,
            sampleTable: null,
            fragmentLookupTable: [],
            currentFragmentState: null,
            fragmentPositionCache: [],
            editListPreviousSegmentDurations: 0,
            editListOffset: 0,
            encryptionInfo: null,
            encryptionAuxInfo: null,
            frmaCodecString: null
          };
          if (this.currentTrack = a, this.readContiguousBoxes(e.slice(n, i.contentSize)), a.id !== -1 && a.timescale !== -1 && a.info !== null) {
            if (a.info.type === "video" && a.info.width !== -1) {
              const o = a;
              a.trackBacking = new bs(o), this.tracks.push(a);
            } else if (a.info.type === "audio" && a.info.numberOfChannels !== -1) {
              const o = a;
              a.trackBacking = new ks(o), this.tracks.push(a);
            }
          }
          this.currentTrack = null;
        }
        break;
      case "tkhd":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          const o = N(e), l = !!(Ze(e) & 1);
          if (a.disposition.default = l, o === 0)
            e.skip(8), a.id = R(e), e.skip(4), a.durationInMovieTimescale = R(e);
          else if (o === 1)
            e.skip(16), a.id = R(e), e.skip(4), a.durationInMovieTimescale = ve(e);
          else
            throw new Error(`Incorrect track header version ${o}.`);
          e.skip(16);
          const u = [
            wt(e),
            wt(e),
            Di(e),
            wt(e),
            wt(e),
            Di(e),
            wt(e),
            wt(e),
            Di(e)
          ], d = Ar(ln(ml(u), 90));
          g(d === 0 || d === 90 || d === 180 || d === 270), a.rotation = d;
        }
        break;
      case "elst":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          const o = N(e);
          e.skip(3);
          let c = !1, l = 0;
          const u = R(e);
          for (let d = 0; d < u; d++) {
            const f = o === 1 ? ve(e) : R(e), h = o === 1 ? yd(e) : Ct(e), p = wt(e);
            if (f !== 0) {
              if (c) {
                q._warn("Unsupported edit list: multiple edits are not currently supported. Only using first edit.");
                break;
              }
              if (h === -1) {
                l += f;
                continue;
              }
              if (p !== 1) {
                q._warn("Unsupported edit list entry: media rate must be 1.");
                break;
              }
              a.editListPreviousSegmentDurations = l, a.editListOffset = h, c = !0;
            }
          }
        }
        break;
      case "mdhd":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          const o = N(e);
          e.skip(3), o === 0 ? (e.skip(8), a.timescale = R(e), a.durationInMediaTimescale = R(e)) : o === 1 && (e.skip(16), a.timescale = R(e), a.durationInMediaTimescale = ve(e));
          let c = se(e);
          if (c > 0) {
            a.languageCode = "";
            for (let l = 0; l < 3; l++)
              a.languageCode = String.fromCharCode(96 + (c & 31)) + a.languageCode, c >>= 5;
            Pr(a.languageCode) || (a.languageCode = ge);
          }
        }
        break;
      case "hdlr":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          e.skip(8);
          const o = ie(e, 4);
          o === "vide" ? a.info = {
            type: "video",
            width: -1,
            height: -1,
            squarePixelWidth: -1,
            squarePixelHeight: -1,
            codec: null,
            codecDescription: null,
            colorSpace: null,
            avcType: null,
            avcCodecInfo: null,
            hevcCodecInfo: null,
            vp9CodecInfo: null,
            av1CodecInfo: null,
            proresFormat: null
          } : o === "soun" && (a.info = {
            type: "audio",
            numberOfChannels: -1,
            sampleRate: -1,
            codec: null,
            codecDescription: null,
            aacCodecInfo: null,
            dtsFormat: null,
            pcmLittleEndian: !1,
            pcmSampleSize: null
          });
        }
        break;
      case "stbl":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          a.sampleTableByteOffset = t, this.readContiguousBoxes(e.slice(n, i.contentSize));
        }
        break;
      case "stsd":
        {
          const a = this.currentTrack;
          if (!a || a.info === null || a.sampleTable)
            break;
          const o = N(e);
          e.skip(3);
          const c = R(e);
          for (let l = 0; l < c; l++) {
            const u = e.filePos, d = ft(e);
            if (!d)
              break;
            a.internalCodecId = d.name;
            const f = d.name.toLowerCase();
            if (a.info.type === "video") {
              e.skip(24), a.info.width = se(e), a.info.height = se(e), a.info.squarePixelWidth = a.info.width, a.info.squarePixelHeight = a.info.height, e.skip(50), a.frmaCodecString = null, this.readContiguousBoxes(e.slice(e.filePos, u + d.totalSize - e.filePos));
              const h = f === "encv" ? a.frmaCodecString : f;
              a.frmaCodecString = null, h === "avc1" || h === "avc3" ? (a.info.codec = "avc", a.info.avcType = h === "avc1" ? 1 : 3) : h === "hvc1" || h === "hev1" ? a.info.codec = "hevc" : h === "vp08" ? a.info.codec = "vp8" : h === "vp09" ? a.info.codec = "vp9" : h === "av01" ? a.info.codec = "av1" : It.includes(f) ? (a.info.codec = "prores", a.info.proresFormat = f) : h === null ? q._warn("Unknown encrypted video codec due to missing frma box.") : q._warn(`Unsupported video codec (sample entry type '${d.name}').`);
            } else {
              e.skip(8);
              const h = se(e);
              e.skip(6);
              let p = se(e), m = se(e);
              e.skip(4);
              let y = R(e) / 65536, w = null;
              o === 0 && h > 0 && (h === 1 ? (e.skip(4), m = 8 * R(e), e.skip(8)) : h === 2 && (e.skip(4), y = No(e), p = R(e), e.skip(4), m = R(e), w = R(e), e.skip(8))), a.info.numberOfChannels = p, a.info.sampleRate = y, a.frmaCodecString = null, this.readContiguousBoxes(e.slice(e.filePos, u + d.totalSize - e.filePos));
              const b = f === "enca" ? a.frmaCodecString : f;
              if (a.frmaCodecString = null, b !== "mp4a") if (b === "opus")
                a.info.codec = "opus", a.info.sampleRate = wi;
              else if (b === "flac")
                a.info.codec = "flac";
              else if (b === "ulaw")
                a.info.codec = "ulaw";
              else if (b === "alaw")
                a.info.codec = "alaw";
              else if (b === "ac-3")
                a.info.codec = "ac3";
              else if (b === "ec-3")
                a.info.codec = "eac3";
              else if (si.includes(b))
                a.info.codec = "dts", a.info.dtsFormat = b;
              else if (b === "twos")
                m === 8 ? a.info.codec = "pcm-s8" : m === 16 ? a.info.codec = a.info.pcmLittleEndian ? "pcm-s16" : "pcm-s16be" : (q._warn(`Unsupported sample size ${m} for codec 'twos'.`), a.info.codec = null);
              else if (b === "sowt")
                m === 8 ? a.info.codec = "pcm-s8" : m === 16 ? a.info.codec = "pcm-s16" : (q._warn(`Unsupported sample size ${m} for codec 'sowt'.`), a.info.codec = null);
              else if (b === "raw ")
                a.info.codec = "pcm-u8";
              else if (b === "in24")
                a.info.codec = a.info.pcmLittleEndian ? "pcm-s24" : "pcm-s24be";
              else if (b === "in32")
                a.info.codec = a.info.pcmLittleEndian ? "pcm-s32" : "pcm-s32be";
              else if (b === "fl32")
                a.info.codec = a.info.pcmLittleEndian ? "pcm-f32" : "pcm-f32be";
              else if (b === "fl64")
                a.info.codec = a.info.pcmLittleEndian ? "pcm-f64" : "pcm-f64be";
              else if (b === "ipcm") {
                const k = a.info.pcmSampleSize;
                a.info.pcmLittleEndian ? k === 16 ? a.info.codec = "pcm-s16" : k === 24 ? a.info.codec = "pcm-s24" : k === 32 ? a.info.codec = "pcm-s32" : (q._warn(`Invalid ipcm sample size ${k}.`), a.info.codec = null) : k === 16 ? a.info.codec = "pcm-s16be" : k === 24 ? a.info.codec = "pcm-s24be" : k === 32 ? a.info.codec = "pcm-s32be" : (q._warn(`Invalid ipcm sample size ${k}.`), a.info.codec = null);
              } else if (b === "fpcm") {
                const k = a.info.pcmSampleSize;
                a.info.pcmLittleEndian ? k === 32 ? a.info.codec = "pcm-f32" : k === 64 ? a.info.codec = "pcm-f64" : (q._warn(`Invalid fpcm sample size ${k}.`), a.info.codec = null) : k === 32 ? a.info.codec = "pcm-f32be" : k === 64 ? a.info.codec = "pcm-f64be" : (q._warn(`Invalid fpcm sample size ${k}.`), a.info.codec = null);
              } else if (b === "lpcm" && w !== null) {
                const k = m + 7 >> 3, A = !!(w & 1), T = !!(w & 2), x = w & 4 ? -1 : 0;
                m > 0 && m <= 64 && (A ? m === 32 && (a.info.codec = T ? "pcm-f32be" : "pcm-f32") : x & 1 << k - 1 ? k === 1 ? a.info.codec = "pcm-s8" : k === 2 ? a.info.codec = T ? "pcm-s16be" : "pcm-s16" : k === 3 ? a.info.codec = T ? "pcm-s24be" : "pcm-s24" : k === 4 && (a.info.codec = T ? "pcm-s32be" : "pcm-s32") : k === 1 && (a.info.codec = "pcm-u8")), a.info.codec === null && q._warn("Unsupported PCM format.");
              } else b === null ? q._warn("Unknown encrypted audio codec due to missing frma box.") : q._warn(`Unsupported audio codec (sample entry type '${d.name}').`);
            }
            e.filePos = u + d.totalSize;
          }
        }
        break;
      case "frma":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          const c = ie(e, 4).toLowerCase();
          a.frmaCodecString = c;
        }
        break;
      case "schm":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          e.skip(4);
          const o = ie(e, 4);
          o === "cenc" || o === "cens" || o === "cbcs" ? a.encryptionInfo = {
            scheme: o,
            defaultKid: null,
            defaultIsProtected: null,
            defaultPerSampleIvSize: null,
            defaultConstantIv: null,
            defaultCryptByteBlock: null,
            defaultSkipByteBlock: null
          } : q._warn(`Unsupported encryption scheme '${o}'.`);
        }
        break;
      case "tenc":
        {
          const a = this.currentTrack;
          if (!a || !a.encryptionInfo)
            break;
          const o = N(e);
          e.skip(3), e.skip(1);
          const c = N(e);
          if (o > 0 ? (a.encryptionInfo.defaultCryptByteBlock = c >> 4, a.encryptionInfo.defaultSkipByteBlock = c & 15) : (a.encryptionInfo.defaultCryptByteBlock = 0, a.encryptionInfo.defaultSkipByteBlock = 0), a.encryptionInfo.defaultIsProtected = N(e) !== 0, a.encryptionInfo.defaultPerSampleIvSize = N(e), a.encryptionInfo.defaultKid = Sr(V(e, 16)), a.encryptionInfo.defaultIsProtected && a.encryptionInfo.defaultPerSampleIvSize === 0) {
            const l = N(e), u = new Uint8Array(16);
            u.set(V(e, l), 0), a.encryptionInfo.defaultConstantIv = u;
          }
        }
        break;
      case "avcC":
        {
          const a = this.currentTrack;
          if (!a || (g(a.info), i.contentSize === 0))
            break;
          a.info.codecDescription = V(e, i.contentSize);
        }
        break;
      case "hvcC":
        {
          const a = this.currentTrack;
          if (!a || (g(a.info), i.contentSize === 0))
            break;
          a.info.codecDescription = V(e, i.contentSize);
        }
        break;
      case "vpcC":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          g(a.info?.type === "video"), e.skip(4);
          const o = N(e), c = N(e), l = N(e), u = l >> 4, d = l >> 1 & 7, f = l & 1, h = N(e), p = N(e), m = N(e);
          a.info.vp9CodecInfo = {
            profile: o,
            level: c,
            bitDepth: u,
            chromaSubsampling: d,
            videoFullRangeFlag: f,
            colourPrimaries: h,
            transferCharacteristics: p,
            matrixCoefficients: m
          };
        }
        break;
      case "av1C":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          g(a.info?.type === "video"), e.skip(1);
          const o = N(e), c = o >> 5, l = o & 31, u = N(e), d = u >> 7, f = u >> 6 & 1, h = u >> 5 & 1, p = u >> 4 & 1, m = u >> 3 & 1, y = u >> 2 & 1, w = u & 3, b = c === 2 && f ? h ? 12 : 10 : f ? 10 : 8;
          a.info.av1CodecInfo = {
            profile: c,
            level: l,
            tier: d,
            bitDepth: b,
            monochrome: p,
            chromaSubsamplingX: m,
            chromaSubsamplingY: y,
            chromaSamplePosition: w
          };
        }
        break;
      case "colr":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          g(a.info?.type === "video");
          const o = ie(e, 4);
          if (o !== "nclx" && o !== "nclc")
            break;
          const c = se(e), l = se(e), u = se(e);
          let d;
          o === "nclx" && (d = !!(N(e) & 128)), a.info.colorSpace = {
            primaries: Jr[c],
            transfer: ei[l],
            matrix: ti[u],
            fullRange: d
          };
        }
        break;
      case "pasp":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          g(a.info?.type === "video");
          const o = R(e), c = R(e);
          o > 0 && c > 0 && (o > c ? a.info.squarePixelWidth = Math.round(a.info.width * o / c) : a.info.squarePixelHeight = Math.round(a.info.height * c / o));
        }
        break;
      case "wave":
        this.readContiguousBoxes(e.slice(n, i.contentSize));
        break;
      case "esds":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          g(a.info?.type === "audio"), e.skip(4);
          const o = N(e);
          g(o === 3), Ni(e), e.skip(2);
          const c = N(e), l = (c & 128) !== 0, u = (c & 64) !== 0, d = (c & 32) !== 0;
          if (l && e.skip(2), u) {
            const y = N(e);
            e.skip(y);
          }
          d && e.skip(2);
          const f = N(e);
          g(f === 4);
          const h = Ni(e), p = e.filePos, m = N(e);
          if (m === 64 || m === 103 ? (a.info.codec = "aac", a.info.aacCodecInfo = {
            isMpeg2: m === 103,
            objectType: null
          }) : m === 105 || m === 107 ? a.info.codec = "mp3" : m === 221 ? a.info.codec = "vorbis" : m === 169 ? a.info.codec = "dts" : q._warn(`Unsupported audio codec (objectTypeIndication ${m}) - discarding track.`), e.skip(12), h > e.filePos - p) {
            const y = N(e);
            g(y === 5);
            const w = Ni(e);
            if (a.info.codecDescription = V(e, w), a.info.codec === "aac") {
              const b = Dn(a.info.codecDescription);
              b.numberOfChannels !== null && (a.info.numberOfChannels = b.numberOfChannels), b.sampleRate !== null && (a.info.sampleRate = b.sampleRate);
            }
          }
        }
        break;
      case "enda":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          g(a.info?.type === "audio"), a.info.pcmLittleEndian = !!(se(e) & 255);
        }
        break;
      case "pcmC":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          g(a.info?.type === "audio"), e.skip(4);
          const o = N(e);
          a.info.pcmLittleEndian = !!(o & 1), a.info.pcmSampleSize = N(e);
        }
        break;
      case "dOps":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          g(a.info?.type === "audio"), e.skip(1);
          const o = N(e), c = se(e), l = R(e), u = En(e), d = N(e);
          let f;
          d !== 0 ? f = V(e, 2 + o) : f = new Uint8Array(0);
          const h = new Uint8Array(19 + f.byteLength), p = new DataView(h.buffer);
          p.setUint32(0, 1332770163, !1), p.setUint32(4, 1214603620, !1), p.setUint8(8, 1), p.setUint8(9, o), p.setUint16(10, c, !0), p.setUint32(12, l, !0), p.setInt16(16, u, !0), p.setUint8(18, d), h.set(f, 19), a.info.codecDescription = h, a.info.numberOfChannels = o;
        }
        break;
      case "dfLa":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          g(a.info?.type === "audio"), e.skip(4);
          const o = 127, c = 128, l = e.filePos;
          for (; e.filePos < s; ) {
            const p = N(e), m = Ze(e);
            if ((p & o) === Xt.STREAMINFO) {
              e.skip(10);
              const w = R(e), b = w >>> 12, k = (w >> 9 & 7) + 1;
              a.info.sampleRate = b, a.info.numberOfChannels = k, e.skip(20);
            } else
              e.skip(m);
            if (p & c)
              break;
          }
          const u = e.filePos;
          e.filePos = l;
          const d = V(e, u - l), f = new Uint8Array(4 + d.byteLength);
          new DataView(f.buffer).setUint32(0, 1716281667, !1), f.set(d, 4), a.info.codecDescription = f;
        }
        break;
      case "dac3":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          g(a.info?.type === "audio");
          const o = V(e, 3), c = new Q(o), l = c.readBits(2);
          c.skipBits(8);
          const u = c.readBits(3), d = c.readBits(1);
          l < 3 && (a.info.sampleRate = bi[l]), a.info.numberOfChannels = Ln[u] + d;
        }
        break;
      case "dec3":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          g(a.info?.type === "audio");
          const o = V(e, i.contentSize), c = Qc(o);
          if (!c) {
            q._warn("Invalid dec3 box contents, ignoring.");
            break;
          }
          const l = Ga(c);
          l !== null && (a.info.sampleRate = l), a.info.numberOfChannels = Xa(c);
        }
        break;
      case "ddts":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          g(a.info?.type === "audio");
          const o = V(e, Math.min(i.contentSize, Hn)), c = sl(o);
          if (!c) {
            q._warn("Invalid ddts box contents, ignoring.");
            break;
          }
          a.info.sampleRate = c.sampleRate, c.numberOfChannels !== null && (a.info.numberOfChannels = c.numberOfChannels);
        }
        break;
      case "stts":
        {
          const a = this.currentTrack;
          if (!a || !a.sampleTable)
            break;
          e.skip(4);
          const o = R(e);
          let c = 0, l = 0;
          for (let u = 0; u < o; u++) {
            const d = R(e), f = R(e);
            a.sampleTable.sampleTimingEntries.push({
              startIndex: c,
              startDecodeTimestamp: l,
              count: d,
              delta: f
            }), c += d, l += d * f;
          }
        }
        break;
      case "ctts":
        {
          const a = this.currentTrack;
          if (!a || !a.sampleTable)
            break;
          e.skip(4);
          const o = R(e);
          let c = 0;
          for (let l = 0; l < o; l++) {
            const u = R(e), d = Ct(e);
            a.sampleTable.sampleCompositionTimeOffsets.push({
              startIndex: c,
              count: u,
              offset: d
            }), c += u;
          }
        }
        break;
      case "stsz":
        {
          const a = this.currentTrack;
          if (!a || !a.sampleTable)
            break;
          e.skip(4);
          const o = R(e), c = R(e);
          if (o === 0)
            for (let l = 0; l < c; l++) {
              const u = R(e);
              a.sampleTable.sampleSizes.push(u);
            }
          else
            a.sampleTable.sampleSizes.push(o);
        }
        break;
      case "stz2":
        {
          const a = this.currentTrack;
          if (!a || !a.sampleTable)
            break;
          e.skip(4), e.skip(3);
          const o = N(e), c = R(e), l = V(e, Math.ceil(c * o / 8)), u = new Q(l);
          for (let d = 0; d < c; d++) {
            const f = u.readBits(o);
            a.sampleTable.sampleSizes.push(f);
          }
        }
        break;
      case "stss":
        {
          const a = this.currentTrack;
          if (!a || !a.sampleTable)
            break;
          e.skip(4), a.sampleTable.keySampleIndices = [];
          const o = R(e);
          for (let c = 0; c < o; c++) {
            const l = R(e) - 1;
            a.sampleTable.keySampleIndices.push(l);
          }
          a.sampleTable.keySampleIndices[0] !== 0 && a.sampleTable.keySampleIndices.unshift(0);
        }
        break;
      case "stsc":
        {
          const a = this.currentTrack;
          if (!a || !a.sampleTable)
            break;
          e.skip(4);
          const o = R(e);
          for (let l = 0; l < o; l++) {
            const u = R(e) - 1, d = R(e), f = R(e);
            a.sampleTable.sampleToChunk.push({
              startSampleIndex: -1,
              startChunkIndex: u,
              samplesPerChunk: d,
              sampleDescriptionIndex: f
            });
          }
          let c = 0;
          for (let l = 0; l < a.sampleTable.sampleToChunk.length; l++)
            if (a.sampleTable.sampleToChunk[l].startSampleIndex = c, l < a.sampleTable.sampleToChunk.length - 1) {
              const d = a.sampleTable.sampleToChunk[l + 1].startChunkIndex - a.sampleTable.sampleToChunk[l].startChunkIndex;
              c += d * a.sampleTable.sampleToChunk[l].samplesPerChunk;
            }
        }
        break;
      case "stco":
        {
          const a = this.currentTrack;
          if (!a || !a.sampleTable)
            break;
          e.skip(4);
          const o = R(e);
          for (let c = 0; c < o; c++) {
            const l = R(e);
            a.sampleTable.chunkOffsets.push(l);
          }
        }
        break;
      case "co64":
        {
          const a = this.currentTrack;
          if (!a || !a.sampleTable)
            break;
          e.skip(4);
          const o = R(e);
          for (let c = 0; c < o; c++) {
            const l = ve(e);
            a.sampleTable.chunkOffsets.push(l);
          }
        }
        break;
      case "mvex":
        this.isFragmented = !0, this.readContiguousBoxes(e.slice(n, i.contentSize));
        break;
      case "mehd":
        {
          const a = N(e);
          e.skip(3);
          const o = a === 1 ? ve(e) : R(e);
          this.movieDurationInTimescale = o;
        }
        break;
      case "trex":
        {
          e.skip(4);
          const a = R(e), o = R(e), c = R(e), l = R(e), u = R(e);
          this.fragmentTrackDefaults.push({
            trackId: a,
            defaultSampleDescriptionIndex: o,
            defaultSampleDuration: c,
            defaultSampleSize: l,
            defaultSampleFlags: u
          });
        }
        break;
      case "tfra":
        {
          const a = N(e);
          e.skip(3);
          const o = R(e), c = this.tracks.find((b) => b.id === o);
          if (!c)
            break;
          const l = R(e), u = (l & 48) >> 4, d = (l & 12) >> 2, f = l & 3, h = [N, se, Ze, R], p = h[u], m = h[d], y = h[f], w = R(e);
          for (let b = 0; b < w; b++) {
            const k = a === 1 ? ve(e) : R(e), A = a === 1 ? ve(e) : R(e);
            p(e), m(e), y(e), c.fragmentLookupTable.push({
              timestamp: k,
              moofOffset: A
            });
          }
          c.fragmentLookupTable.sort((b, k) => b.timestamp - k.timestamp);
          for (let b = 0; b < c.fragmentLookupTable.length - 1; b++) {
            const k = c.fragmentLookupTable[b], A = c.fragmentLookupTable[b + 1];
            k.timestamp === A.timestamp && (c.fragmentLookupTable.splice(b + 1, 1), b--);
          }
        }
        break;
      case "moof":
        this.currentFragment = {
          moofOffset: t,
          moofSize: i.totalSize,
          implicitBaseDataOffset: t,
          trackData: /* @__PURE__ */ new Map(),
          psshBoxes: []
        }, this.readContiguousBoxes(e.slice(n, i.contentSize)), this.lastReadFragment = this.currentFragment, this.currentFragment = null;
        break;
      case "traf":
        if (g(this.currentFragment), this.readContiguousBoxes(e.slice(n, i.contentSize)), this.currentTrack) {
          const a = this.currentFragment.trackData.get(this.currentTrack.id);
          e: if (a) {
            if (a.samples.length === 0) {
              this.currentFragment.trackData.delete(this.currentTrack.id);
              break e;
            }
            a.presentationTimestamps = a.samples.map((u, d) => ({ presentationTimestamp: u.presentationTimestamp, sampleIndex: d })).sort((u, d) => u.presentationTimestamp - d.presentationTimestamp);
            for (let u = 0; u < a.presentationTimestamps.length; u++) {
              const d = a.presentationTimestamps[u], f = a.samples[d.sampleIndex];
              if (a.firstKeyFrameTimestamp === null && f.isKeyFrame && (a.firstKeyFrameTimestamp = f.presentationTimestamp), u < a.presentationTimestamps.length - 1) {
                const p = a.presentationTimestamps[u + 1].presentationTimestamp - d.presentationTimestamp;
                f.duration = p;
              }
            }
            const o = a.samples[a.presentationTimestamps[0].sampleIndex], c = a.samples[te(a.presentationTimestamps).sampleIndex];
            a.startTimestamp = o.presentationTimestamp, a.endTimestamp = c.presentationTimestamp + c.duration;
            const { currentFragmentState: l } = this.currentTrack;
            g(l), l.startTimestamp !== null && (Vi(a, l.startTimestamp), a.startTimestampIsFinal = !0), l.encryptionAuxInfo && !a.samples[0].encryption && (a.encryptionAuxInfo = l.encryptionAuxInfo);
          }
          this.currentTrack.currentFragmentState = null, this.currentTrack = null;
        }
        break;
      case "pssh":
        {
          if (this.input._formatOptions.isobmff?._suppressPsshParsing)
            break;
          const a = eo(V(e, i.contentSize));
          this.currentFragment ? this.currentFragment.psshBoxes.push(a) : this.currentTrack || this.psshBoxes.push(a);
        }
        break;
      case "tfhd":
        {
          g(this.currentFragment), e.skip(1);
          const a = Ze(e), o = !!(a & 1), c = !!(a & 2), l = !!(a & 8), u = !!(a & 16), d = !!(a & 32), f = !!(a & 65536), h = !!(a & 131072), p = R(e), m = this.tracks.find((w) => w.id === p);
          if (!m)
            break;
          const y = this.fragmentTrackDefaults.find((w) => w.trackId === p);
          this.currentTrack = m, m.currentFragmentState = {
            baseDataOffset: this.currentFragment.implicitBaseDataOffset,
            sampleDescriptionIndex: y?.defaultSampleDescriptionIndex ?? null,
            defaultSampleDuration: y?.defaultSampleDuration ?? null,
            defaultSampleSize: y?.defaultSampleSize ?? null,
            defaultSampleFlags: y?.defaultSampleFlags ?? null,
            startTimestamp: null,
            encryptionAuxInfo: null
          }, o ? m.currentFragmentState.baseDataOffset = ve(e) : h && (m.currentFragmentState.baseDataOffset = this.currentFragment.moofOffset), c && (m.currentFragmentState.sampleDescriptionIndex = R(e)), l && (m.currentFragmentState.defaultSampleDuration = R(e)), u && (m.currentFragmentState.defaultSampleSize = R(e)), d && (m.currentFragmentState.defaultSampleFlags = R(e)), f && (m.currentFragmentState.defaultSampleDuration = 0);
        }
        break;
      case "tfdt":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          g(a.currentFragmentState);
          const o = N(e);
          e.skip(3);
          const c = o === 0 ? R(e) : ve(e);
          a.currentFragmentState.startTimestamp = c;
        }
        break;
      case "trun":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          g(this.currentFragment), g(a.currentFragmentState);
          const o = N(e), c = Ze(e), l = !!(c & 1), u = !!(c & 4), d = !!(c & 256), f = !!(c & 512), h = !!(c & 1024), p = !!(c & 2048), m = R(e);
          let y = null;
          l && (y = Ct(e));
          let w = null;
          u && (w = R(e));
          let b;
          this.currentFragment.trackData.has(a.id) ? (b = this.currentFragment.trackData.get(a.id), y !== null && (b.currentOffset = a.currentFragmentState.baseDataOffset + y)) : (b = {
            track: a,
            currentTimestamp: 0,
            currentOffset: a.currentFragmentState.baseDataOffset + (y ?? 0),
            startTimestamp: 0,
            endTimestamp: 0,
            firstKeyFrameTimestamp: null,
            samples: [],
            presentationTimestamps: [],
            startTimestampIsFinal: !1,
            encryptionAuxInfo: null
          }, this.currentFragment.trackData.set(a.id, b));
          for (let k = 0; k < m; k++) {
            let A;
            d ? A = R(e) : (g(a.currentFragmentState.defaultSampleDuration !== null), A = a.currentFragmentState.defaultSampleDuration);
            let T;
            f ? T = R(e) : (g(a.currentFragmentState.defaultSampleSize !== null), T = a.currentFragmentState.defaultSampleSize);
            let x;
            h ? x = R(e) : (g(a.currentFragmentState.defaultSampleFlags !== null), x = a.currentFragmentState.defaultSampleFlags), k === 0 && w !== null && (x = w);
            let C = 0;
            p && (o === 0 ? C = R(e) : C = Ct(e));
            const P = !(x & 65536);
            b.samples.push({
              presentationTimestamp: b.currentTimestamp + C,
              duration: A,
              byteOffset: b.currentOffset,
              byteSize: T,
              isKeyFrame: P,
              encryption: null
            }), b.currentOffset += T, b.currentTimestamp += A;
          }
          this.currentFragment.implicitBaseDataOffset = b.currentOffset;
        }
        break;
      case "saiz":
        {
          const a = this.currentTrack;
          if (!a || !a.encryptionInfo)
            break;
          if (e.skip(1), Ze(e) & 1) {
            const f = ie(e, 4), h = R(e);
            if (f !== a.encryptionInfo.scheme || h !== 0)
              break;
          }
          const c = N(e), l = R(e);
          let u = null;
          c === 0 && l > 0 && (u = V(e, l));
          const d = As(a);
          d.defaultSampleInfoSize = c, d.sampleSizes = u, d.sampleCount = l;
        }
        break;
      case "saio":
        {
          const a = this.currentTrack;
          if (!a || !a.encryptionInfo)
            break;
          const o = N(e);
          if (Ze(e) & 1) {
            const f = ie(e, 4), h = R(e);
            if (f !== a.encryptionInfo.scheme || h !== 0)
              break;
          }
          const l = R(e);
          if (l === 0)
            break;
          l > 1 && q._warn("Multiple saio entries are not supported; using the first offset only.");
          let u = o === 0 ? R(e) : Number(ve(e));
          this.currentFragment && (u += this.currentFragment.moofOffset);
          const d = As(a);
          d.offset = u;
        }
        break;
      case "senc":
        {
          const a = this.currentTrack;
          if (!a || !a.encryptionInfo)
            break;
          g(this.currentFragment);
          const o = this.currentFragment.trackData.get(a.id);
          if (!o)
            break;
          e.skip(1);
          const l = !!(Ze(e) & 2), u = R(e), d = a.encryptionInfo.defaultPerSampleIvSize;
          g(d !== null);
          for (let f = 0; f < Math.min(u, o.samples.length); f++) {
            const h = new Uint8Array(16);
            d > 0 ? h.set(V(e, d), 0) : h.set(a.encryptionInfo.defaultConstantIv, 0);
            let p = null;
            if (l) {
              const y = se(e);
              p = [];
              for (let w = 0; w < y; w++) {
                const b = se(e), k = R(e);
                p.push({ clearLen: b, protectedLen: k });
              }
            }
            const m = o.samples[f];
            m.encryption = { iv: h, subsamples: p };
          }
        }
        break;
      // Metadata section
      // https://exiftool.org/TagNames/QuickTime.html
      // https://mp4workshop.com/about
      case "udta":
        {
          const a = this.iterateContiguousBoxes(e.slice(n, i.contentSize));
          for (const { boxInfo: o, slice: c } of a) {
            if (o.name !== "meta" && !this.currentTrack) {
              const l = c.filePos;
              this.metadataTags.raw ??= {}, o.name[0] === "©" ? this.metadataTags.raw[o.name] ??= Ve(c) : this.metadataTags.raw[o.name] ??= V(c, o.contentSize), c.filePos = l;
            }
            switch (o.name) {
              case "meta":
                c.skip(-o.headerSize), this.traverseBox(c);
                break;
              case "©nam":
              case "name":
                this.currentTrack ? this.currentTrack.name = Ae.decode(V(c, o.contentSize)) : this.metadataTags.title ??= Ve(c);
                break;
              case "©des":
                this.currentTrack || (this.metadataTags.description ??= Ve(c));
                break;
              case "©ART":
                this.currentTrack || (this.metadataTags.artist ??= Ve(c));
                break;
              case "©alb":
                this.currentTrack || (this.metadataTags.album ??= Ve(c));
                break;
              case "albr":
                this.currentTrack || (this.metadataTags.albumArtist ??= Ve(c));
                break;
              case "©gen":
                this.currentTrack || (this.metadataTags.genre ??= Ve(c));
                break;
              case "©day":
                if (!this.currentTrack) {
                  const l = new Date(Ve(c));
                  Number.isNaN(l.getTime()) || (this.metadataTags.date ??= l);
                }
                break;
              case "©cmt":
                this.currentTrack || (this.metadataTags.comment ??= Ve(c));
                break;
              case "©lyr":
                this.currentTrack || (this.metadataTags.lyrics ??= Ve(c));
                break;
            }
          }
        }
        break;
      case "meta":
        {
          if (this.currentTrack)
            break;
          const o = R(e) !== 0;
          this.currentMetadataKeys = /* @__PURE__ */ new Map(), o ? this.readContiguousBoxes(e.slice(n, i.contentSize)) : this.readContiguousBoxes(e.slice(n + 4, i.contentSize - 4)), this.currentMetadataKeys = null;
        }
        break;
      case "keys":
        {
          if (!this.currentMetadataKeys)
            break;
          e.skip(4);
          const a = R(e);
          for (let o = 0; o < a; o++) {
            const c = R(e);
            e.skip(4);
            const l = Ae.decode(V(e, c - 8));
            this.currentMetadataKeys.set(o + 1, l);
          }
        }
        break;
      case "ilst":
        {
          if (!this.currentMetadataKeys)
            break;
          const a = this.iterateContiguousBoxes(e.slice(n, i.contentSize));
          for (const { boxInfo: o, slice: c } of a) {
            let l = o.name;
            const u = (l.charCodeAt(0) << 24) + (l.charCodeAt(1) << 16) + (l.charCodeAt(2) << 8) + l.charCodeAt(3);
            this.currentMetadataKeys.has(u) && (l = this.currentMetadataKeys.get(u));
            const d = cl(c);
            switch (this.metadataTags.raw ??= {}, this.metadataTags.raw[l] ??= d, l) {
              case "©nam":
              case "titl":
              case "com.apple.quicktime.title":
              case "title":
                typeof d == "string" && (this.metadataTags.title ??= d);
                break;
              case "©des":
              case "desc":
              case "dscp":
              case "com.apple.quicktime.description":
              case "description":
                typeof d == "string" && (this.metadataTags.description ??= d);
                break;
              case "©ART":
              case "com.apple.quicktime.artist":
              case "artist":
                typeof d == "string" && (this.metadataTags.artist ??= d);
                break;
              case "©alb":
              case "albm":
              case "com.apple.quicktime.album":
              case "album":
                typeof d == "string" && (this.metadataTags.album ??= d);
                break;
              case "aART":
              case "album_artist":
                typeof d == "string" && (this.metadataTags.albumArtist ??= d);
                break;
              case "©cmt":
              case "com.apple.quicktime.comment":
              case "comment":
                typeof d == "string" && (this.metadataTags.comment ??= d);
                break;
              case "©gen":
              case "gnre":
              case "com.apple.quicktime.genre":
              case "genre":
                typeof d == "string" && (this.metadataTags.genre ??= d);
                break;
              case "©lyr":
              case "lyrics":
                typeof d == "string" && (this.metadataTags.lyrics ??= d);
                break;
              case "©day":
              case "rldt":
              case "com.apple.quicktime.creationdate":
              case "date":
                if (typeof d == "string") {
                  const f = new Date(d);
                  Number.isNaN(f.getTime()) || (this.metadataTags.date ??= f);
                }
                break;
              case "covr":
              case "com.apple.quicktime.artwork":
                d instanceof Qt ? (this.metadataTags.images ??= [], this.metadataTags.images.push({
                  data: d.data,
                  kind: "coverFront",
                  mimeType: d.mimeType
                })) : d instanceof Uint8Array && (this.metadataTags.images ??= [], this.metadataTags.images.push({
                  data: d,
                  kind: "coverFront",
                  mimeType: "image/*"
                }));
                break;
              case "track":
                if (typeof d == "string") {
                  const f = d.split("/"), h = Number.parseInt(f[0], 10), p = f[1] && Number.parseInt(f[1], 10);
                  Number.isInteger(h) && h > 0 && (this.metadataTags.trackNumber ??= h), p && Number.isInteger(p) && p > 0 && (this.metadataTags.tracksTotal ??= p);
                }
                break;
              case "trkn":
                if (d instanceof Uint8Array && d.length >= 6) {
                  const f = K(d), h = f.getUint16(2, !1), p = f.getUint16(4, !1);
                  h > 0 && (this.metadataTags.trackNumber ??= h), p > 0 && (this.metadataTags.tracksTotal ??= p);
                }
                break;
              case "disc":
              case "disk":
                if (d instanceof Uint8Array && d.length >= 6) {
                  const f = K(d), h = f.getUint16(2, !1), p = f.getUint16(4, !1);
                  h > 0 && (this.metadataTags.discNumber ??= h), p > 0 && (this.metadataTags.discsTotal ??= p);
                }
                break;
            }
          }
        }
        break;
    }
    return e.filePos = s, !0;
  }
}
class so {
  constructor(e) {
    this.internalTrack = e, this.packetToSampleIndex = /* @__PURE__ */ new WeakMap(), this.packetToFragmentLocation = /* @__PURE__ */ new WeakMap();
  }
  getId() {
    return this.internalTrack.id;
  }
  getNumber() {
    const e = this.internalTrack.demuxer, t = this.internalTrack.trackBacking.getType();
    let i = 0;
    for (const n of e.tracks)
      if (n.trackBacking.getType() === t && i++, n === this.internalTrack)
        break;
    return i;
  }
  getCodec() {
    throw new Error("Not implemented on base class.");
  }
  getInternalCodecId() {
    return this.internalTrack.internalCodecId;
  }
  getName() {
    return this.internalTrack.name;
  }
  getLanguageCode() {
    return this.internalTrack.languageCode;
  }
  getTimeResolution() {
    return this.internalTrack.timescale;
  }
  isRelativeToUnixEpoch() {
    return !1;
  }
  getUnixTimeForTimestamp() {
    return null;
  }
  getDisposition() {
    return this.internalTrack.disposition;
  }
  getPairingMask() {
    return 1n;
  }
  getBitrate() {
    return null;
  }
  getAverageBitrate() {
    return null;
  }
  async getDurationFromMetadata() {
    const e = this.internalTrack;
    return e.durationInMediaTimescale <= 0 ? null : (g(e.trackBacking), ((await e.trackBacking.getFirstPacket({ metadataOnly: !0 }))?.timestamp ?? 0) + e.durationInMediaTimescale / e.timescale);
  }
  async getLiveRefreshInterval() {
    return null;
  }
  async getFirstPacket(e) {
    const t = await this.fetchPacketForSampleIndex(0, e);
    return t || !this.internalTrack.demuxer.isFragmented ? t : this.performFragmentedLookup(
      null,
      (i) => i.trackData.get(this.internalTrack.id) ? {
        sampleIndex: 0,
        correctSampleFound: !0
      } : {
        sampleIndex: -1,
        correctSampleFound: !1
      },
      -1 / 0,
      // Use -Infinity as a search timestamp to avoid using the lookup entries
      1 / 0,
      e
    );
  }
  mapTimestampIntoTimescale(e) {
    return xr(e * this.internalTrack.timescale) + this.internalTrack.editListOffset;
  }
  async getPacket(e, t) {
    const i = this.mapTimestampIntoTimescale(e), n = this.internalTrack.demuxer.getSampleTableForTrack(this.internalTrack), s = gn(n, i), a = await this.fetchPacketForSampleIndex(s, t);
    return !Ts(n) || !this.internalTrack.demuxer.isFragmented ? a : this.performFragmentedLookup(null, (o) => {
      const c = o.trackData.get(this.internalTrack.id);
      if (!c)
        return { sampleIndex: -1, correctSampleFound: !1 };
      const l = G(c.presentationTimestamps, i, (f) => f.presentationTimestamp), u = l !== -1 ? c.presentationTimestamps[l].sampleIndex : -1, d = l !== -1 && i < c.endTimestamp;
      return { sampleIndex: u, correctSampleFound: d };
    }, i, i, t);
  }
  async getNextPacket(e, t) {
    const i = this.packetToSampleIndex.get(e);
    if (i !== void 0)
      return this.fetchPacketForSampleIndex(i + 1, t);
    const n = this.packetToFragmentLocation.get(e);
    if (n === void 0)
      throw new Error("Packet was not created from this track.");
    return this.performFragmentedLookup(
      n.fragment,
      (s) => {
        if (s === n.fragment) {
          const a = s.trackData.get(this.internalTrack.id);
          if (n.sampleIndex + 1 < a.samples.length)
            return {
              sampleIndex: n.sampleIndex + 1,
              correctSampleFound: !0
            };
        } else if (s.trackData.get(this.internalTrack.id))
          return {
            sampleIndex: 0,
            correctSampleFound: !0
          };
        return {
          sampleIndex: -1,
          correctSampleFound: !1
        };
      },
      -1 / 0,
      // Use -Infinity as a search timestamp to avoid using the lookup entries
      1 / 0,
      t
    );
  }
  async getKeyPacket(e, t) {
    const i = this.mapTimestampIntoTimescale(e), n = this.internalTrack.demuxer.getSampleTableForTrack(this.internalTrack), s = dl(n, i), a = await this.fetchPacketForSampleIndex(s, t);
    return !Ts(n) || !this.internalTrack.demuxer.isFragmented ? a : this.performFragmentedLookup(null, (o) => {
      const c = o.trackData.get(this.internalTrack.id);
      if (!c)
        return { sampleIndex: -1, correctSampleFound: !1 };
      const l = Rn(c.presentationTimestamps, (f) => c.samples[f.sampleIndex].isKeyFrame && f.presentationTimestamp <= i), u = l !== -1 ? c.presentationTimestamps[l].sampleIndex : -1, d = l !== -1 && i < c.endTimestamp;
      return { sampleIndex: u, correctSampleFound: d };
    }, i, i, t);
  }
  async getNextKeyPacket(e, t) {
    const i = this.packetToSampleIndex.get(e);
    if (i !== void 0) {
      const s = this.internalTrack.demuxer.getSampleTableForTrack(this.internalTrack), a = hl(s, i);
      return this.fetchPacketForSampleIndex(a, t);
    }
    const n = this.packetToFragmentLocation.get(e);
    if (n === void 0)
      throw new Error("Packet was not created from this track.");
    return this.performFragmentedLookup(
      n.fragment,
      (s) => {
        if (s === n.fragment) {
          const o = s.trackData.get(this.internalTrack.id).samples.findIndex((c, l) => c.isKeyFrame && l > n.sampleIndex);
          if (o !== -1)
            return {
              sampleIndex: o,
              correctSampleFound: !0
            };
        } else {
          const a = s.trackData.get(this.internalTrack.id);
          if (a && a.firstKeyFrameTimestamp !== null) {
            const o = a.samples.findIndex((c) => c.isKeyFrame);
            return g(o !== -1), {
              sampleIndex: o,
              correctSampleFound: !0
            };
          }
        }
        return {
          sampleIndex: -1,
          correctSampleFound: !1
        };
      },
      -1 / 0,
      // Use -Infinity as a search timestamp to avoid using the lookup entries
      1 / 0,
      t
    );
  }
  async fetchPacketForSampleIndex(e, t) {
    if (e === -1)
      return null;
    const i = this.internalTrack.demuxer.getSampleTableForTrack(this.internalTrack), n = fl(i, e);
    if (!n)
      return null;
    let s;
    if (t.metadataOnly)
      s = Ie;
    else {
      let l = this.internalTrack.demuxer.reader.requestSlice(n.sampleOffset, n.sampleSize);
      if (l instanceof Promise && (l = await l), !l)
        return null;
      if (s = V(l, n.sampleSize), this.internalTrack.encryptionAuxInfo) {
        g(this.internalTrack.encryptionInfo);
        const u = await ao(this.internalTrack.demuxer.reader, this.internalTrack.encryptionInfo, this.internalTrack.encryptionAuxInfo);
        e < u.length && (s = await Ss(this.internalTrack, u[e], s, null));
      }
    }
    const a = (n.presentationTimestamp - this.internalTrack.editListOffset) / this.internalTrack.timescale, o = n.duration / this.internalTrack.timescale, c = new Y(s, n.isKeyFrame ? "key" : "delta", a, o, e, n.sampleSize);
    return this.packetToSampleIndex.set(c, e), c;
  }
  async fetchPacketInFragment(e, t, i) {
    if (t === -1)
      return null;
    const s = e.trackData.get(this.internalTrack.id).samples[t];
    g(s);
    let a;
    if (i.metadataOnly)
      a = Ie;
    else {
      let u = this.internalTrack.demuxer.reader.requestSlice(s.byteOffset, s.byteSize);
      if (u instanceof Promise && (u = await u), !u)
        return null;
      a = V(u, s.byteSize), s.encryption && (a = await Ss(this.internalTrack, s.encryption, a, e));
    }
    const o = (s.presentationTimestamp - this.internalTrack.editListOffset) / this.internalTrack.timescale, c = s.duration / this.internalTrack.timescale, l = new Y(a, s.isKeyFrame ? "key" : "delta", o, c, e.moofOffset + t, s.byteSize);
    return this.packetToFragmentLocation.set(l, { fragment: e, sampleIndex: t }), l;
  }
  /** Looks for a packet in the fragments while trying to load as few fragments as possible to retrieve it. */
  async performFragmentedLookup(e, t, i, n, s) {
    const a = this.internalTrack.demuxer;
    let o = null, c = null, l = -1;
    if (e) {
      const { sampleIndex: y, correctSampleFound: w } = t(e);
      if (w)
        return this.fetchPacketInFragment(e, y, s);
      y !== -1 && (c = e, l = y);
    }
    const u = G(this.internalTrack.fragmentLookupTable, i, (y) => y.timestamp), d = u !== -1 ? this.internalTrack.fragmentLookupTable[u] : null, f = G(this.internalTrack.fragmentPositionCache, i, (y) => y.startTimestamp), h = f !== -1 ? this.internalTrack.fragmentPositionCache[f] : null, p = Math.max(d?.moofOffset ?? 0, h?.moofOffset ?? 0) || null;
    let m;
    for (e ? p === null || e.moofOffset >= p ? (m = e.moofOffset + e.moofSize, o = e) : m = p : m = p ?? 0; ; ) {
      if (o) {
        const k = o.trackData.get(this.internalTrack.id);
        if (k && k.startTimestamp > n)
          break;
      }
      let y = a.reader.requestSliceRange(m, rt, xt);
      if (y instanceof Promise && (y = await y), !y)
        break;
      const w = m, b = ft(y);
      if (!b)
        break;
      if (b.name === "moof") {
        o = await a.readFragment(w);
        const { sampleIndex: k, correctSampleFound: A } = t(o);
        if (A)
          return this.fetchPacketInFragment(o, k, s);
        k !== -1 && (c = o, l = k);
      }
      m = w + b.totalSize;
    }
    if (d && (!c || c.moofOffset < d.moofOffset)) {
      const y = this.internalTrack.fragmentLookupTable[u - 1];
      g(!y || y.timestamp < d.timestamp);
      const w = y?.timestamp ?? -1 / 0;
      return this.performFragmentedLookup(null, t, w, n, s);
    }
    return c ? this.fetchPacketInFragment(c, l, s) : null;
  }
}
class bs extends so {
  constructor(e) {
    super(e), this.decoderConfigPromise = null, this.internalTrack = e;
  }
  getType() {
    return "video";
  }
  getCodec() {
    return this.internalTrack.info.codec;
  }
  getCodedWidth() {
    return this.internalTrack.info.width;
  }
  getCodedHeight() {
    return this.internalTrack.info.height;
  }
  getSquarePixelWidth() {
    return this.internalTrack.info.squarePixelWidth;
  }
  getSquarePixelHeight() {
    return this.internalTrack.info.squarePixelHeight;
  }
  getRotation() {
    return this.internalTrack.rotation;
  }
  async getColorSpace() {
    return {
      primaries: this.internalTrack.info.colorSpace?.primaries,
      transfer: this.internalTrack.info.colorSpace?.transfer,
      matrix: this.internalTrack.info.colorSpace?.matrix,
      fullRange: this.internalTrack.info.colorSpace?.fullRange
    };
  }
  async canBeTransparent() {
    return this.internalTrack.info.codec === "prores" && (this.internalTrack.info.proresFormat === "ap4h" || this.internalTrack.info.proresFormat === "ap4x");
  }
  async getDecoderConfig() {
    return this.internalTrack.info.codec ? this.decoderConfigPromise ??= (async () => {
      if (this.internalTrack.info.codec === "avc" && !this.internalTrack.info.codecDescription) {
        const t = await this.getFirstPacket({});
        this.internalTrack.info.avcCodecInfo = t && Ai(t.data);
      } else if (this.internalTrack.info.codec === "hevc" && !this.internalTrack.info.codecDescription) {
        const t = await this.getFirstPacket({});
        this.internalTrack.info.hevcCodecInfo = t && Si(t.data);
      } else if (this.internalTrack.info.codec === "vp9" && !this.internalTrack.info.vp9CodecInfo) {
        const t = await this.getFirstPacket({});
        this.internalTrack.info.vp9CodecInfo = t && Wa(t.data);
      } else if (this.internalTrack.info.codec === "av1" && !this.internalTrack.info.av1CodecInfo) {
        const t = await this.getFirstPacket({});
        this.internalTrack.info.av1CodecInfo = t && La(t.data);
      }
      const e = {
        codec: Nn(this.internalTrack.info),
        codedWidth: this.internalTrack.info.width,
        codedHeight: this.internalTrack.info.height,
        description: this.internalTrack.info.codecDescription ?? void 0,
        colorSpace: this.internalTrack.info.colorSpace ?? void 0
      };
      return (this.internalTrack.info.width !== this.internalTrack.info.squarePixelWidth || this.internalTrack.info.height !== this.internalTrack.info.squarePixelHeight) && (e.displayAspectWidth = this.internalTrack.info.squarePixelWidth, e.displayAspectHeight = this.internalTrack.info.squarePixelHeight), e;
    })() : null;
  }
}
class ks extends so {
  constructor(e) {
    super(e), this.decoderConfigPromise = null, this.internalTrack = e;
  }
  getType() {
    return "audio";
  }
  getCodec() {
    return this.internalTrack.info.codec;
  }
  getNumberOfChannels() {
    return this.internalTrack.info.numberOfChannels;
  }
  getSampleRate() {
    return this.internalTrack.info.sampleRate;
  }
  async getDecoderConfig() {
    return this.internalTrack.info.codec ? this.decoderConfigPromise ??= (async () => {
      if (this.internalTrack.info.codec === "dts" && !this.internalTrack.info.dtsFormat) {
        const e = await this.getFirstPacket({});
        this.internalTrack.info.dtsFormat = e && Ya(e.data);
      }
      return {
        codec: Vn(this.internalTrack.info),
        numberOfChannels: this.internalTrack.info.numberOfChannels,
        sampleRate: this.internalTrack.info.sampleRate,
        description: this.internalTrack.info.codecDescription ?? void 0
      };
    })() : null;
  }
}
const gn = (r, e) => {
  if (r.presentationTimestamps) {
    const t = G(r.presentationTimestamps, e, (i) => i.presentationTimestamp);
    return t === -1 ? -1 : r.presentationTimestamps[t].sampleIndex;
  } else {
    const t = G(r.sampleTimingEntries, e, (n) => n.startDecodeTimestamp);
    if (t === -1)
      return -1;
    const i = r.sampleTimingEntries[t];
    return i.startIndex + Math.min(Math.floor((e - i.startDecodeTimestamp) / i.delta), i.count - 1);
  }
}, dl = (r, e) => {
  if (!r.keySampleIndices)
    return gn(r, e);
  if (r.presentationTimestamps) {
    const t = G(r.presentationTimestamps, e, (i) => i.presentationTimestamp);
    if (t === -1)
      return -1;
    for (let i = t; i >= 0; i--) {
      const n = r.presentationTimestamps[i].sampleIndex;
      if (Rr(r.keySampleIndices, n, (a) => a) !== -1)
        return n;
    }
    return -1;
  } else {
    const t = gn(r, e), i = G(r.keySampleIndices, t, (n) => n);
    return r.keySampleIndices[i] ?? -1;
  }
}, fl = (r, e) => {
  const t = G(r.sampleTimingEntries, e, (w) => w.startIndex), i = r.sampleTimingEntries[t];
  if (!i || i.startIndex + i.count <= e)
    return null;
  let s = i.startDecodeTimestamp + (e - i.startIndex) * i.delta;
  const a = G(r.sampleCompositionTimeOffsets, e, (w) => w.startIndex), o = r.sampleCompositionTimeOffsets[a];
  o && e - o.startIndex < o.count && (s += o.offset);
  const c = r.sampleSizes[Math.min(e, r.sampleSizes.length - 1)], l = G(r.sampleToChunk, e, (w) => w.startSampleIndex), u = r.sampleToChunk[l];
  g(u);
  const d = u.startChunkIndex + Math.floor((e - u.startSampleIndex) / u.samplesPerChunk), f = r.chunkOffsets[d], h = u.startSampleIndex + (d - u.startChunkIndex) * u.samplesPerChunk;
  let p = 0, m = f;
  if (r.sampleSizes.length === 1)
    m += c * (e - h), p += c * u.samplesPerChunk;
  else
    for (let w = h; w < h + u.samplesPerChunk; w++) {
      const b = r.sampleSizes[w];
      w < e && (m += b), p += b;
    }
  let y = i.delta;
  if (r.presentationTimestamps) {
    const w = r.presentationTimestampIndexMap[e];
    g(w !== void 0), w < r.presentationTimestamps.length - 1 && (y = r.presentationTimestamps[w + 1].presentationTimestamp - s);
  }
  return {
    presentationTimestamp: s,
    duration: y,
    sampleOffset: m,
    sampleSize: c,
    chunkOffset: f,
    chunkSize: p,
    isKeyFrame: r.keySampleIndices ? Rr(r.keySampleIndices, e, (w) => w) !== -1 : !0
  };
}, hl = (r, e) => {
  if (!r.keySampleIndices)
    return e + 1;
  const t = G(r.keySampleIndices, e, (i) => i);
  return r.keySampleIndices[t + 1] ?? -1;
}, Vi = (r, e) => {
  r.startTimestamp += e, r.endTimestamp += e;
  for (const t of r.samples)
    t.presentationTimestamp += e;
  for (const t of r.presentationTimestamps)
    t.presentationTimestamp += e;
}, ml = (r) => {
  const [e, t] = r, i = Math.atan2(t, e);
  return Number.isFinite(i) ? i * (180 / Math.PI) : 0;
}, Ts = (r) => r.sampleSizes.length === 0, As = (r) => r.currentFragmentState ? r.currentFragmentState.encryptionAuxInfo ??= {
  defaultSampleInfoSize: 0,
  sampleSizes: null,
  sampleCount: 0,
  offset: null,
  resolved: null
} : r.encryptionAuxInfo ??= {
  defaultSampleInfoSize: 0,
  sampleSizes: null,
  sampleCount: 0,
  offset: null,
  resolved: null
}, ao = async (r, e, t) => {
  if (t.resolved)
    return t.resolved;
  if (t.offset === null || t.sampleCount === 0)
    throw new Error("Incomplete saiz/saio info; cannot resolve encryption data.");
  let i = 0;
  if (t.defaultSampleInfoSize > 0)
    i = t.defaultSampleInfoSize * t.sampleCount;
  else {
    g(t.sampleSizes);
    for (let o = 0; o < t.sampleCount; o++)
      i += t.sampleSizes[o];
  }
  let n = r.requestSlice(t.offset, i);
  if (n instanceof Promise && (n = await n), !n)
    throw new Error("Failed to read auxiliary encryption info.");
  const s = e.defaultPerSampleIvSize;
  g(s !== null);
  const a = [];
  for (let o = 0; o < t.sampleCount; o++) {
    const c = t.defaultSampleInfoSize > 0 ? t.defaultSampleInfoSize : t.sampleSizes[o], l = new Uint8Array(16);
    s > 0 ? l.set(V(n, s), 0) : l.set(e.defaultConstantIv, 0);
    let u = null;
    if (c > s) {
      const d = se(n);
      u = [];
      for (let f = 0; f < d; f++) {
        const h = se(n), p = R(n);
        u.push({ clearLen: h, protectedLen: p });
      }
    }
    a.push({ iv: l, subsamples: u });
  }
  return t.resolved = a, a;
}, Ss = async (r, e, t, i) => {
  g(r.encryptionInfo);
  const n = r.encryptionInfo;
  g(n.defaultKid !== null);
  const s = n.defaultKid;
  let a;
  const o = r.demuxer.decryptionKeyCache.get(s);
  if (o)
    a = await o;
  else {
    if (!r.demuxer.input._formatOptions.isobmff?.resolveKeyId)
      throw new Error("Encrypted media samples encountered. To decrypt them, please provide a callback for InputOptions.formatOptions.isobmff.resolveKeyId.");
    const c = (async () => {
      let l = r.demuxer.psshBoxes;
      if (i) {
        l = [
          ...l,
          ...i.psshBoxes
        ].filter((d) => d.keyIds === null || d.keyIds.includes(s));
        for (let d = 0; d < l.length - 1; d++)
          for (let f = d + 1; f < l.length; f++)
            to(l[d], l[f]) && (l.splice(f, 1), f--);
      }
      const u = await r.demuxer.input._formatOptions.isobmff.resolveKeyId({ keyId: s, psshBoxes: l });
      if (!(typeof u == "string" && u.length === 32 && Jo.test(u) || u instanceof Uint8Array && u.byteLength === 16))
        throw new TypeError("resolveKeyId must return a 32-character hex string or a 16-byte Uint8Array containing the decryption key.");
      return u instanceof Uint8Array ? u : ec(u);
    })();
    r.demuxer.decryptionKeyCache.set(s, c), a = await c;
  }
  return n.scheme === "cenc" || n.scheme === "cens" ? pl(a, n, e, t) : gl(a, n, e, t);
}, pl = async (r, e, t, i) => {
  const n = new Uint8Array(16);
  n.set(t.iv, 0);
  const s = await crypto.subtle.importKey("raw", r, { name: "AES-CTR" }, !1, ["decrypt"]), a = async (p) => {
    const m = await crypto.subtle.decrypt({ name: "AES-CTR", counter: n, length: 64 }, s, p);
    return new Uint8Array(m);
  };
  if (!t.subsamples)
    return a(i);
  g(e.defaultCryptByteBlock !== null && e.defaultSkipByteBlock !== null);
  const o = oo(t.subsamples, e.defaultCryptByteBlock, e.defaultSkipByteBlock);
  let c = 0;
  for (const p of o)
    for (const m of p.perSubsample)
      c += m.length;
  const l = new Uint8Array(c);
  let u = 0;
  for (const p of o)
    for (const m of p.perSubsample)
      l.set(i.subarray(m.offset, m.offset + m.length), u), u += m.length;
  const d = await a(l), f = new Uint8Array(i);
  let h = 0;
  for (const p of o)
    for (const m of p.perSubsample)
      f.set(d.subarray(h, h + m.length), m.offset), h += m.length;
  return f;
}, gl = (r, e, t, i) => {
  const n = new no();
  n.init({ key: r, iv: t.iv });
  const s = e.defaultCryptByteBlock, a = e.defaultSkipByteBlock;
  if (g(s !== null && a !== null), !t.subsamples) {
    const u = new Uint8Array(i), d = Math.floor(i.length / 16);
    for (let f = 0; f < d; f++) {
      const h = f * 16;
      n.in.set(i.subarray(h, h + 16)), n.decrypt(), u.set(n.out, h);
    }
    return u;
  }
  if (s === 0 && a === 0)
    throw new Error("cbcs with subsamples requires pattern encryption.");
  const o = new Uint8Array(i), c = oo(t.subsamples, s, a), l = new DataView(t.iv.buffer, t.iv.byteOffset, 16);
  for (const u of c) {
    n.iv[0] = l.getUint32(0, !1), n.iv[1] = l.getUint32(4, !1), n.iv[2] = l.getUint32(8, !1), n.iv[3] = l.getUint32(12, !1);
    for (const d of u.perSubsample) {
      const f = d.length / 16;
      for (let h = 0; h < f; h++) {
        const p = d.offset + h * 16;
        n.in.set(i.subarray(p, p + 16)), n.decrypt(), o.set(n.out, p);
      }
    }
  }
  return o;
}, oo = (r, e, t) => {
  const i = [], n = e !== 0 || t !== 0;
  let s = 0;
  for (const a of r) {
    s += a.clearLen;
    const o = [];
    if (!n)
      a.protectedLen > 0 && o.push({ offset: s, length: a.protectedLen }), s += a.protectedLen;
    else {
      let c = a.protectedLen, l = s;
      for (; c > 0 && !(c < 16 * e); ) {
        const u = 16 * e;
        o.push({ offset: l, length: u }), l += u, c -= u;
        const d = Math.min(16 * t, c);
        l += d, c -= d;
      }
      s += a.protectedLen;
    }
    i.push({ perSubsample: o });
  }
  return i;
};
var v;
(function(r) {
  r[r.EBML = 440786851] = "EBML", r[r.EBMLVersion = 17030] = "EBMLVersion", r[r.EBMLReadVersion = 17143] = "EBMLReadVersion", r[r.EBMLMaxIDLength = 17138] = "EBMLMaxIDLength", r[r.EBMLMaxSizeLength = 17139] = "EBMLMaxSizeLength", r[r.DocType = 17026] = "DocType", r[r.DocTypeVersion = 17031] = "DocTypeVersion", r[r.DocTypeReadVersion = 17029] = "DocTypeReadVersion", r[r.Void = 236] = "Void", r[r.Segment = 408125543] = "Segment", r[r.SeekHead = 290298740] = "SeekHead", r[r.Seek = 19899] = "Seek", r[r.SeekID = 21419] = "SeekID", r[r.SeekPosition = 21420] = "SeekPosition", r[r.Duration = 17545] = "Duration", r[r.Info = 357149030] = "Info", r[r.TimestampScale = 2807729] = "TimestampScale", r[r.MuxingApp = 19840] = "MuxingApp", r[r.WritingApp = 22337] = "WritingApp", r[r.Tracks = 374648427] = "Tracks", r[r.TrackEntry = 174] = "TrackEntry", r[r.TrackNumber = 215] = "TrackNumber", r[r.TrackUID = 29637] = "TrackUID", r[r.TrackType = 131] = "TrackType", r[r.FlagEnabled = 185] = "FlagEnabled", r[r.FlagDefault = 136] = "FlagDefault", r[r.FlagForced = 21930] = "FlagForced", r[r.FlagOriginal = 21934] = "FlagOriginal", r[r.FlagHearingImpaired = 21931] = "FlagHearingImpaired", r[r.FlagVisualImpaired = 21932] = "FlagVisualImpaired", r[r.FlagCommentary = 21935] = "FlagCommentary", r[r.FlagLacing = 156] = "FlagLacing", r[r.Name = 21358] = "Name", r[r.Language = 2274716] = "Language", r[r.LanguageBCP47 = 2274717] = "LanguageBCP47", r[r.CodecID = 134] = "CodecID", r[r.CodecPrivate = 25506] = "CodecPrivate", r[r.CodecDelay = 22186] = "CodecDelay", r[r.SeekPreRoll = 22203] = "SeekPreRoll", r[r.DefaultDuration = 2352003] = "DefaultDuration", r[r.Video = 224] = "Video", r[r.PixelWidth = 176] = "PixelWidth", r[r.PixelHeight = 186] = "PixelHeight", r[r.DisplayWidth = 21680] = "DisplayWidth", r[r.DisplayHeight = 21690] = "DisplayHeight", r[r.DisplayUnit = 21682] = "DisplayUnit", r[r.AlphaMode = 21440] = "AlphaMode", r[r.Audio = 225] = "Audio", r[r.SamplingFrequency = 181] = "SamplingFrequency", r[r.Channels = 159] = "Channels", r[r.BitDepth = 25188] = "BitDepth", r[r.SimpleBlock = 163] = "SimpleBlock", r[r.BlockGroup = 160] = "BlockGroup", r[r.Block = 161] = "Block", r[r.BlockAdditions = 30113] = "BlockAdditions", r[r.BlockMore = 166] = "BlockMore", r[r.BlockAdditional = 165] = "BlockAdditional", r[r.BlockAddID = 238] = "BlockAddID", r[r.BlockDuration = 155] = "BlockDuration", r[r.ReferenceBlock = 251] = "ReferenceBlock", r[r.Cluster = 524531317] = "Cluster", r[r.Timestamp = 231] = "Timestamp", r[r.Cues = 475249515] = "Cues", r[r.CuePoint = 187] = "CuePoint", r[r.CueTime = 179] = "CueTime", r[r.CueTrackPositions = 183] = "CueTrackPositions", r[r.CueTrack = 247] = "CueTrack", r[r.CueClusterPosition = 241] = "CueClusterPosition", r[r.Colour = 21936] = "Colour", r[r.MatrixCoefficients = 21937] = "MatrixCoefficients", r[r.TransferCharacteristics = 21946] = "TransferCharacteristics", r[r.Primaries = 21947] = "Primaries", r[r.Range = 21945] = "Range", r[r.Projection = 30320] = "Projection", r[r.ProjectionType = 30321] = "ProjectionType", r[r.ProjectionPoseRoll = 30325] = "ProjectionPoseRoll", r[r.Attachments = 423732329] = "Attachments", r[r.AttachedFile = 24999] = "AttachedFile", r[r.FileDescription = 18046] = "FileDescription", r[r.FileName = 18030] = "FileName", r[r.FileMediaType = 18016] = "FileMediaType", r[r.FileData = 18012] = "FileData", r[r.FileUID = 18094] = "FileUID", r[r.Chapters = 272869232] = "Chapters", r[r.Tags = 307544935] = "Tags", r[r.Tag = 29555] = "Tag", r[r.Targets = 25536] = "Targets", r[r.TargetTypeValue = 26826] = "TargetTypeValue", r[r.TargetType = 25546] = "TargetType", r[r.TagTrackUID = 25541] = "TagTrackUID", r[r.TagEditionUID = 25545] = "TagEditionUID", r[r.TagChapterUID = 25540] = "TagChapterUID", r[r.TagAttachmentUID = 25542] = "TagAttachmentUID", r[r.SimpleTag = 26568] = "SimpleTag", r[r.TagName = 17827] = "TagName", r[r.TagLanguage = 17530] = "TagLanguage", r[r.TagString = 17543] = "TagString", r[r.TagBinary = 17541] = "TagBinary", r[r.ContentEncodings = 28032] = "ContentEncodings", r[r.ContentEncoding = 25152] = "ContentEncoding", r[r.ContentEncodingOrder = 20529] = "ContentEncodingOrder", r[r.ContentEncodingScope = 20530] = "ContentEncodingScope", r[r.ContentCompression = 20532] = "ContentCompression", r[r.ContentCompAlgo = 16980] = "ContentCompAlgo", r[r.ContentCompSettings = 16981] = "ContentCompSettings", r[r.ContentEncryption = 20533] = "ContentEncryption";
})(v || (v = {}));
const yl = [
  v.EBML,
  v.Segment
], _r = [
  v.SeekHead,
  v.Info,
  v.Cluster,
  v.Tracks,
  v.Cues,
  v.Attachments,
  v.Chapters,
  v.Tags
], Xr = [
  ...yl,
  ..._r
], yn = 8, Be = 2, it = 2 * yn, co = (r) => {
  if (r.remainingLength < 1)
    return null;
  const e = N(r);
  if (r.skip(-1), e === 0)
    return null;
  let t = 1, i = 128;
  for (; (e & i) === 0; )
    t++, i >>= 1;
  return r.remainingLength < t ? null : t;
}, gr = (r) => {
  if (r.remainingLength < 1)
    return null;
  const e = N(r);
  if (e === 0)
    return null;
  let t = 1, i = 128;
  for (; (e & i) === 0; )
    t++, i >>= 1;
  if (r.remainingLength < t - 1)
    return null;
  let n = e & i - 1;
  for (let s = 1; s < t; s++)
    n *= 256, n += N(r);
  return n;
}, H = (r, e) => {
  if (e < 1 || e > 8)
    throw new Error("Bad unsigned int size " + e);
  let t = 0;
  for (let i = 0; i < e; i++)
    t *= 256, t += N(r);
  return t;
}, wl = (r, e) => {
  if (e < 1)
    throw new Error("Bad unsigned int size " + e);
  let t = 0n;
  for (let i = 0; i < e; i++)
    t <<= 8n, t += BigInt(N(r));
  return t;
}, Qn = (r) => {
  const e = co(r);
  return e === null || r.remainingLength < e ? null : H(r, e);
}, lo = (r) => {
  if (r.remainingLength < 1)
    return null;
  if (N(r) === 255)
    return;
  r.skip(-1);
  const t = gr(r);
  if (t === null)
    return null;
  if (t !== 72057594037927940)
    return t;
}, et = (r) => {
  g(r.remainingLength >= Be);
  const e = Qn(r);
  if (e === null)
    return null;
  const t = lo(r);
  return t === null ? null : { id: e, size: t };
}, qt = (r, e) => {
  const t = V(r, e);
  let i = 0;
  for (; i < e && t[i] !== 0; )
    i += 1;
  return String.fromCharCode(...t.subarray(0, i));
}, sr = (r, e) => {
  const t = V(r, e);
  let i = 0;
  for (; i < e && t[i] !== 0; )
    i += 1;
  return Ae.decode(t.subarray(0, i));
}, Ui = (r, e) => {
  if (e === 0)
    return 0;
  if (e !== 4 && e !== 8)
    throw new Error("Bad float size " + e);
  return e === 4 ? bd(r) : No(r);
}, wn = async (r, e, t, i) => {
  const n = new Set(t);
  let s = e;
  for (; i === null || s < i; ) {
    let a = r.requestSliceRange(s, Be, it);
    if (a instanceof Promise && (a = await a), !a)
      break;
    const o = et(a);
    if (!o)
      break;
    if (n.has(o.id))
      return { pos: s, found: !0 };
    dt(o.size), s = a.filePos + o.size;
  }
  return { pos: i !== null && i > s ? i : s, found: !1 };
}, uo = async (r, e, t, i) => {
  const s = new Set(t);
  let a = e;
  for (; a < i; ) {
    let o = r.requestSliceRange(a, 0, Math.min(65536, i - a));
    if (o instanceof Promise && (o = await o), !o || o.length < yn)
      break;
    for (let c = 0; c < o.length - yn; c++) {
      o.filePos = a;
      const l = Qn(o);
      if (l !== null && s.has(l))
        return a;
      a++;
    }
  }
  return null;
}, Te = {
  avc: "V_MPEG4/ISO/AVC",
  hevc: "V_MPEGH/ISO/HEVC",
  vp8: "V_VP8",
  vp9: "V_VP9",
  av1: "V_AV1",
  prores: "V_PRORES",
  aac: "A_AAC",
  mp3: "A_MPEG/L3",
  opus: "A_OPUS",
  vorbis: "A_VORBIS",
  flac: "A_FLAC",
  ac3: "A_AC3",
  eac3: "A_EAC3",
  dts: "A_DTS"
};
function dt(r) {
  if (r === void 0)
    throw new Error("Undefined element size is used in a place where it is not supported.");
}
const bl = (r) => {
  let t = (r.hasVideo ? "video/" : r.hasAudio ? "audio/" : "application/") + (r.isWebM ? "webm" : "x-matroska");
  if (r.codecStrings.length > 0) {
    const i = [...new Set(r.codecStrings.filter(Boolean))];
    t += `; codecs="${i.join(", ")}"`;
  }
  return t;
};
var Je;
(function(r) {
  r[r.None = 0] = "None", r[r.Xiph = 1] = "Xiph", r[r.FixedSize = 2] = "FixedSize", r[r.Ebml = 3] = "Ebml";
})(Je || (Je = {}));
var li;
(function(r) {
  r[r.Block = 1] = "Block", r[r.Private = 2] = "Private", r[r.Next = 4] = "Next";
})(li || (li = {}));
var br;
(function(r) {
  r[r.Zlib = 0] = "Zlib", r[r.Bzlib = 1] = "Bzlib", r[r.lzo1x = 2] = "lzo1x", r[r.HeaderStripping = 3] = "HeaderStripping";
})(br || (br = {}));
const Wi = [
  { id: v.SeekHead, flag: "seekHeadSeen" },
  { id: v.Info, flag: "infoSeen" },
  { id: v.Tracks, flag: "tracksSeen" },
  { id: v.Cues, flag: "cuesSeen" }
], fo = 10 * 2 ** 20;
class kl extends lt {
  constructor(e) {
    super(e), this.readMetadataPromise = null, this.segments = [], this.currentSegment = null, this.currentTrack = null, this.currentCluster = null, this.currentBlock = null, this.currentBlockAdditional = null, this.currentCueTime = null, this.currentDecodingInstruction = null, this.currentTagTargetIsMovie = !0, this.currentSimpleTagName = null, this.currentAttachedFile = null, this.isWebM = !1, this.reader = e._reader;
  }
  async getTrackBackings() {
    return await this.readMetadata(), this.segments.flatMap((e) => e.tracks.map((t) => t.trackBacking));
  }
  async getMimeType() {
    await this.readMetadata();
    const e = await this.getTrackBackings(), t = await Promise.all(e.map((i) => i.getDecoderConfig().then((n) => n?.codec ?? null)));
    return bl({
      isWebM: this.isWebM,
      hasVideo: this.segments.some((i) => i.tracks.some((n) => n.info?.type === "video")),
      hasAudio: this.segments.some((i) => i.tracks.some((n) => n.info?.type === "audio")),
      codecStrings: t.filter(Boolean)
    });
  }
  async getMetadataTags() {
    await this.readMetadata();
    for (const t of this.segments)
      t.metadataTagsCollected || (this.reader.fileSize !== null && await this.loadSegmentMetadata(t), t.metadataTagsCollected = !0);
    let e = {};
    for (const t of this.segments)
      e = { ...e, ...t.metadataTags };
    return e;
  }
  readMetadata() {
    return this.readMetadataPromise ??= (async () => {
      let e = 0;
      for (; ; ) {
        let t = this.reader.requestSliceRange(e, Be, it);
        if (t instanceof Promise && (t = await t), !t)
          break;
        const i = et(t);
        if (!i)
          break;
        const n = i.id;
        let s = i.size;
        const a = t.filePos;
        if (n === v.EBML) {
          dt(s);
          let o = this.reader.requestSlice(a, s);
          if (o instanceof Promise && (o = await o), !o)
            break;
          this.readContiguousElements(o);
        } else if (n === v.Segment) {
          if (await this.readSegment(a, s), s === void 0 || this.reader.fileSize === null)
            break;
        } else if (n === v.Cluster) {
          if (this.reader.fileSize === null)
            break;
          s === void 0 && (s = (await wn(this.reader, a, Xr, this.reader.fileSize)).pos - a);
          const o = te(this.segments);
          o && (o.elementEndPos = a + s);
        }
        dt(s), e = a + s;
      }
    })();
  }
  async readSegment(e, t) {
    this.currentSegment = {
      seekHeadSeen: !1,
      infoSeen: !1,
      tracksSeen: !1,
      cuesSeen: !1,
      tagsSeen: !1,
      attachmentsSeen: !1,
      timestampScale: -1,
      timestampFactor: -1,
      duration: -1,
      seekEntries: [],
      tracks: [],
      cuePoints: [],
      dataStartPos: e,
      elementEndPos: t === void 0 ? null : e + t,
      clusterSeekStartPos: e,
      lastReadCluster: null,
      metadataTags: {},
      metadataTagsCollected: !1
    }, this.segments.push(this.currentSegment);
    let i = e;
    for (; this.currentSegment.elementEndPos === null || i < this.currentSegment.elementEndPos; ) {
      let o = this.reader.requestSliceRange(i, Be, it);
      if (o instanceof Promise && (o = await o), !o)
        break;
      const c = i, l = et(o);
      if (!l || !_r.includes(l.id) && l.id !== v.Void) {
        const p = await uo(this.reader, c, _r, Math.min(this.currentSegment.elementEndPos ?? 1 / 0, c + fo));
        if (p) {
          i = p;
          continue;
        } else
          break;
      }
      const { id: u, size: d } = l, f = o.filePos, h = Wi.findIndex((p) => p.id === u);
      if (h !== -1) {
        const p = Wi[h].flag;
        this.currentSegment[p] = !0, dt(d);
        let m = this.reader.requestSlice(f, d);
        m instanceof Promise && (m = await m), m && this.readContiguousElements(m);
      } else if (u === v.Tags || u === v.Attachments) {
        u === v.Tags ? this.currentSegment.tagsSeen = !0 : this.currentSegment.attachmentsSeen = !0, dt(d);
        let p = this.reader.requestSlice(f, d);
        p instanceof Promise && (p = await p), p && this.readContiguousElements(p);
      } else if (u === v.Cluster) {
        this.currentSegment.clusterSeekStartPos = c;
        break;
      }
      if (d === void 0)
        break;
      i = f + d;
    }
    if (this.currentSegment.seekEntries.sort((o, c) => o.segmentPosition - c.segmentPosition), this.reader.fileSize !== null)
      for (const o of this.currentSegment.seekEntries) {
        const c = Wi.find((p) => p.id === o.id);
        if (!c || this.currentSegment[c.flag])
          continue;
        let l = this.reader.requestSliceRange(e + o.segmentPosition, Be, it);
        if (l instanceof Promise && (l = await l), !l)
          continue;
        const u = et(l);
        if (!u)
          continue;
        const { id: d, size: f } = u;
        if (d !== c.id)
          continue;
        dt(f), this.currentSegment[c.flag] = !0;
        let h = this.reader.requestSlice(l.filePos, f);
        h instanceof Promise && (h = await h), h && this.readContiguousElements(h);
      }
    this.currentSegment.timestampScale === -1 && (this.currentSegment.timestampScale = 1e6, this.currentSegment.timestampFactor = 1e9 / 1e6);
    for (const o of this.currentSegment.tracks)
      o.defaultDurationNs !== null && (o.defaultDuration = this.currentSegment.timestampFactor * o.defaultDurationNs / 1e9);
    const n = new Map(this.currentSegment.tracks.map((o) => [o.id, o]));
    for (const o of this.currentSegment.cuePoints) {
      const c = n.get(o.trackId);
      c && c.cuePoints.push(o);
    }
    for (const o of this.currentSegment.tracks) {
      o.cuePoints.sort((c, l) => c.time - l.time);
      for (let c = 0; c < o.cuePoints.length - 1; c++) {
        const l = o.cuePoints[c], u = o.cuePoints[c + 1];
        l.time === u.time && (o.cuePoints.splice(c + 1, 1), c--);
      }
    }
    let s = null, a = -1 / 0;
    for (const o of this.currentSegment.tracks)
      o.cuePoints.length > a && (a = o.cuePoints.length, s = o);
    for (const o of this.currentSegment.tracks)
      o.cuePoints.length === 0 && (o.cuePoints = s.cuePoints);
    this.currentSegment = null;
  }
  async readCluster(e, t) {
    if (t.lastReadCluster?.elementStartPos === e)
      return t.lastReadCluster;
    let i = this.reader.requestSliceRange(e, Be, it);
    i instanceof Promise && (i = await i), g(i);
    const n = e, s = et(i);
    g(s);
    const a = s.id;
    g(a === v.Cluster);
    let o = s.size;
    const c = i.filePos;
    o === void 0 && (o = (await wn(this.reader, c, Xr, t.elementEndPos)).pos - c);
    let l = this.reader.requestSlice(c, o);
    l instanceof Promise && (l = await l);
    const u = {
      segment: t,
      elementStartPos: n,
      elementEndPos: c + o,
      dataStartPos: c,
      timestamp: -1,
      trackData: /* @__PURE__ */ new Map()
    };
    if (this.currentCluster = u, l) {
      const d = this.readContiguousElements(l, Xr);
      u.elementEndPos = d;
    }
    for (const [, d] of u.trackData) {
      const f = d.track;
      g(d.blocks.length > 0);
      let h = !1;
      for (let w = 0; w < d.blocks.length; w++) {
        const b = d.blocks[w];
        b.timestamp += u.timestamp, h ||= b.lacing !== Je.None;
      }
      d.presentationTimestamps = d.blocks.map((w, b) => ({ timestamp: w.timestamp, blockIndex: b })).sort((w, b) => w.timestamp - b.timestamp);
      for (let w = 0; w < d.presentationTimestamps.length; w++) {
        const b = d.presentationTimestamps[w], k = d.blocks[b.blockIndex];
        if (d.firstKeyFrameTimestamp === null && k.isKeyFrame && (d.firstKeyFrameTimestamp = k.timestamp), w < d.presentationTimestamps.length - 1) {
          const A = d.presentationTimestamps[w + 1];
          k.duration = A.timestamp - k.timestamp;
        } else k.duration === 0 && f.defaultDuration != null && k.lacing === Je.None && (k.duration = f.defaultDuration);
      }
      h && (this.expandLacedBlocks(d.blocks, f), d.presentationTimestamps = d.blocks.map((w, b) => ({ timestamp: w.timestamp, blockIndex: b })).sort((w, b) => w.timestamp - b.timestamp));
      const p = d.blocks[d.presentationTimestamps[0].blockIndex], m = d.blocks[te(d.presentationTimestamps).blockIndex];
      d.startTimestamp = p.timestamp, d.endTimestamp = m.timestamp + m.duration;
      const y = G(f.clusterPositionCache, d.startTimestamp, (w) => w.startTimestamp);
      (y === -1 || f.clusterPositionCache[y].elementStartPos !== n) && f.clusterPositionCache.splice(y + 1, 0, {
        elementStartPos: u.elementStartPos,
        startTimestamp: d.startTimestamp
      });
    }
    return t.lastReadCluster = u, u;
  }
  getTrackDataInCluster(e, t) {
    let i = e.trackData.get(t);
    if (!i) {
      const n = e.segment.tracks.find((s) => s.id === t);
      if (!n)
        return null;
      i = {
        track: n,
        startTimestamp: 0,
        endTimestamp: 0,
        firstKeyFrameTimestamp: null,
        blocks: [],
        presentationTimestamps: []
      }, e.trackData.set(t, i);
    }
    return i;
  }
  expandLacedBlocks(e, t) {
    for (let i = 0; i < e.length; i++) {
      const n = e[i];
      if (n.lacing === Je.None)
        continue;
      n.decoded || (n.data = this.decodeBlockData(t, n.data), n.decoded = !0);
      const s = Pe.tempFromBytes(n.data), a = [], o = N(s) + 1;
      switch (n.lacing) {
        case Je.Xiph:
          {
            let l = 0;
            for (let u = 0; u < o - 1; u++) {
              let d = 0;
              for (; s.bufferPos < s.length; ) {
                const f = N(s);
                if (d += f, f < 255) {
                  a.push(d), l += d;
                  break;
                }
              }
            }
            a.push(s.length - (s.bufferPos + l));
          }
          break;
        case Je.FixedSize:
          {
            const l = s.length - 1, u = Math.floor(l / o);
            for (let d = 0; d < o; d++)
              a.push(u);
          }
          break;
        case Je.Ebml:
          {
            const l = gr(s);
            g(l !== null);
            let u = l;
            a.push(u);
            let d = u;
            for (let f = 1; f < o - 1; f++) {
              const h = s.bufferPos, p = gr(s);
              g(p !== null);
              const m = p, w = (1 << (s.bufferPos - h) * 7 - 1) - 1, b = m - w;
              u += b, a.push(u), d += u;
            }
            a.push(s.length - (s.bufferPos + d));
          }
          break;
        default:
          g(!1);
      }
      g(a.length === o), e.splice(i, 1);
      const c = n.duration || o * (t.defaultDuration ?? 0);
      for (let l = 0; l < o; l++) {
        const u = a[l], d = V(s, u), f = n.timestamp + c * l / o, h = c / o;
        e.splice(i + l, 0, {
          timestamp: f,
          duration: h,
          isKeyFrame: n.isKeyFrame,
          data: d,
          lacing: Je.None,
          decoded: !0,
          postProcessed: !1,
          mainAdditional: n.mainAdditional
        });
      }
      i += o, i--;
    }
  }
  async loadSegmentMetadata(e) {
    for (const t of e.seekEntries) {
      if (!(t.id === v.Tags && !e.tagsSeen)) {
        if (!(t.id === v.Attachments && !e.attachmentsSeen)) continue;
      }
      let i = this.reader.requestSliceRange(e.dataStartPos + t.segmentPosition, Be, it);
      if (i instanceof Promise && (i = await i), !i)
        continue;
      const n = et(i);
      if (!n || n.id !== t.id)
        continue;
      const { size: s } = n;
      dt(s), g(!this.currentSegment), this.currentSegment = e;
      let a = this.reader.requestSlice(i.filePos, s);
      a instanceof Promise && (a = await a), a && this.readContiguousElements(a), this.currentSegment = null, t.id === v.Tags ? e.tagsSeen = !0 : t.id === v.Attachments && (e.attachmentsSeen = !0);
    }
  }
  readContiguousElements(e, t) {
    for (; e.remainingLength >= Be; ) {
      const i = e.filePos;
      if (!this.traverseElement(e, t))
        return i;
    }
    return e.filePos;
  }
  traverseElement(e, t) {
    const i = et(e);
    if (!i || t && t.includes(i.id))
      return !1;
    const { id: n, size: s } = i, a = e.filePos;
    switch (dt(s), n) {
      case v.DocType:
        this.isWebM = qt(e, s) === "webm";
        break;
      case v.Seek:
        {
          if (!this.currentSegment)
            break;
          const o = { id: -1, segmentPosition: -1 };
          this.currentSegment.seekEntries.push(o), this.readContiguousElements(e.slice(a, s)), (o.id === -1 || o.segmentPosition === -1) && this.currentSegment.seekEntries.pop();
        }
        break;
      case v.SeekID:
        {
          const o = this.currentSegment?.seekEntries[this.currentSegment.seekEntries.length - 1];
          if (!o)
            break;
          o.id = H(e, s);
        }
        break;
      case v.SeekPosition:
        {
          const o = this.currentSegment?.seekEntries[this.currentSegment.seekEntries.length - 1];
          if (!o)
            break;
          o.segmentPosition = H(e, s);
        }
        break;
      case v.TimestampScale:
        {
          if (!this.currentSegment)
            break;
          this.currentSegment.timestampScale = H(e, s), this.currentSegment.timestampFactor = 1e9 / this.currentSegment.timestampScale;
        }
        break;
      case v.Duration:
        {
          if (!this.currentSegment)
            break;
          this.currentSegment.duration = Ui(e, s);
        }
        break;
      case v.TrackEntry:
        {
          if (!this.currentSegment || (this.currentTrack = {
            id: -1,
            segment: this.currentSegment,
            demuxer: this,
            clusterPositionCache: [],
            cuePoints: [],
            disposition: {
              ...ct,
              primary: !1
            },
            trackBacking: null,
            codecId: null,
            codecPrivate: null,
            defaultDuration: null,
            defaultDurationNs: null,
            name: null,
            languageCode: "eng",
            // The default in Matroska
            hasLanguageBcp47: !1,
            decodingInstructions: [],
            info: null
          }, this.readContiguousElements(e.slice(a, s)), !this.currentTrack))
            break;
          if (this.currentTrack.decodingInstructions.some((o) => o.data?.type !== "decompress" || o.scope !== li.Block || o.data.algorithm !== br.HeaderStripping) && (q._warn(`Track #${this.currentTrack.id} has an unsupported content encoding; dropping.`), this.currentTrack = null), this.currentTrack && this.currentTrack.id !== -1 && this.currentTrack.codecId && this.currentTrack.info) {
            const o = this.currentTrack.codecId.indexOf("/"), c = o === -1 ? this.currentTrack.codecId : this.currentTrack.codecId.slice(0, o);
            if (this.currentTrack.info.type === "video" && this.currentTrack.info.width !== -1 && this.currentTrack.info.height !== -1) {
              if (this.currentTrack.info.squarePixelWidth = this.currentTrack.info.width, this.currentTrack.info.squarePixelHeight = this.currentTrack.info.height, this.currentTrack.info.displayWidth !== null && this.currentTrack.info.displayHeight !== null) {
                const u = this.currentTrack.info.displayWidth * this.currentTrack.info.height, d = this.currentTrack.info.displayHeight * this.currentTrack.info.width;
                u > 0 && d > 0 && (u > d ? this.currentTrack.info.squarePixelWidth = Math.round(this.currentTrack.info.width * u / d) : this.currentTrack.info.squarePixelHeight = Math.round(this.currentTrack.info.height * d / u));
              }
              if (this.currentTrack.codecId === Te.avc)
                this.currentTrack.info.codec = "avc", this.currentTrack.info.codecDescription = this.currentTrack.codecPrivate;
              else if (this.currentTrack.codecId === Te.hevc)
                this.currentTrack.info.codec = "hevc", this.currentTrack.info.codecDescription = this.currentTrack.codecPrivate;
              else if (c === Te.vp8)
                this.currentTrack.info.codec = "vp8";
              else if (c === Te.vp9)
                this.currentTrack.info.codec = "vp9";
              else if (c === Te.av1)
                this.currentTrack.info.codec = "av1";
              else if (c === Te.prores) {
                const u = this.currentTrack.codecPrivate ? Ae.decode(this.currentTrack.codecPrivate) : "";
                It.includes(u) && (this.currentTrack.info.codec = "prores", this.currentTrack.info.proresFormat = u);
              }
              const l = this.currentTrack;
              this.currentTrack.trackBacking = new Tl(l), this.currentSegment.tracks.push(this.currentTrack);
            } else if (this.currentTrack.info.type === "audio") {
              c === Te.aac ? (this.currentTrack.info.codec = "aac", this.currentTrack.info.aacCodecInfo = {
                isMpeg2: this.currentTrack.codecId.includes("MPEG2"),
                objectType: null
              }, this.currentTrack.info.codecDescription = this.currentTrack.codecPrivate) : this.currentTrack.codecId === Te.mp3 ? this.currentTrack.info.codec = "mp3" : c === Te.opus ? (this.currentTrack.info.codec = "opus", this.currentTrack.info.codecDescription = this.currentTrack.codecPrivate, this.currentTrack.info.sampleRate = wi) : c === Te.vorbis ? (this.currentTrack.info.codec = "vorbis", this.currentTrack.info.codecDescription = this.currentTrack.codecPrivate) : c === Te.flac ? (this.currentTrack.info.codec = "flac", this.currentTrack.info.codecDescription = this.currentTrack.codecPrivate) : c === Te.ac3 ? (this.currentTrack.info.codec = "ac3", this.currentTrack.info.codecDescription = this.currentTrack.codecPrivate) : c === Te.eac3 ? (this.currentTrack.info.codec = "eac3", this.currentTrack.info.codecDescription = this.currentTrack.codecPrivate) : c === Te.dts ? (this.currentTrack.info.codec = "dts", this.currentTrack.codecId === "A_DTS/EXPRESS" ? this.currentTrack.info.dtsFormat = "dtse" : this.currentTrack.codecId === "A_DTS/LOSSLESS" && (this.currentTrack.info.dtsFormat = "dtsl")) : this.currentTrack.codecId === "A_PCM/INT/LIT" ? this.currentTrack.info.bitDepth === 8 ? this.currentTrack.info.codec = "pcm-u8" : this.currentTrack.info.bitDepth === 16 ? this.currentTrack.info.codec = "pcm-s16" : this.currentTrack.info.bitDepth === 24 ? this.currentTrack.info.codec = "pcm-s24" : this.currentTrack.info.bitDepth === 32 && (this.currentTrack.info.codec = "pcm-s32") : this.currentTrack.codecId === "A_PCM/INT/BIG" ? this.currentTrack.info.bitDepth === 8 ? this.currentTrack.info.codec = "pcm-u8" : this.currentTrack.info.bitDepth === 16 ? this.currentTrack.info.codec = "pcm-s16be" : this.currentTrack.info.bitDepth === 24 ? this.currentTrack.info.codec = "pcm-s24be" : this.currentTrack.info.bitDepth === 32 && (this.currentTrack.info.codec = "pcm-s32be") : this.currentTrack.codecId === "A_PCM/FLOAT/IEEE" && (this.currentTrack.info.bitDepth === 32 ? this.currentTrack.info.codec = "pcm-f32" : this.currentTrack.info.bitDepth === 64 && (this.currentTrack.info.codec = "pcm-f64"));
              const l = this.currentTrack;
              this.currentTrack.trackBacking = new Al(l), this.currentSegment.tracks.push(this.currentTrack);
            }
          }
          this.currentTrack = null;
        }
        break;
      case v.TrackNumber:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.id = H(e, s);
        }
        break;
      case v.TrackType:
        {
          if (!this.currentTrack)
            break;
          const o = H(e, s);
          o === 1 ? this.currentTrack.info = {
            type: "video",
            width: -1,
            height: -1,
            displayWidth: null,
            displayHeight: null,
            displayUnit: null,
            squarePixelWidth: -1,
            squarePixelHeight: -1,
            rotation: 0,
            codec: null,
            codecDescription: null,
            colorSpace: null,
            alphaMode: !1,
            proresFormat: null
          } : o === 2 && (this.currentTrack.info = {
            type: "audio",
            numberOfChannels: 1,
            // Default value
            sampleRate: 8e3,
            // Default value
            bitDepth: -1,
            codec: null,
            codecDescription: null,
            aacCodecInfo: null,
            dtsFormat: null
          });
        }
        break;
      case v.FlagEnabled:
        {
          if (!this.currentTrack)
            break;
          H(e, s) || (this.currentTrack = null);
        }
        break;
      case v.FlagDefault:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.disposition.default = !!H(e, s);
        }
        break;
      case v.FlagForced:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.disposition.forced = !!H(e, s);
        }
        break;
      case v.FlagOriginal:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.disposition.original = !!H(e, s);
        }
        break;
      case v.FlagHearingImpaired:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.disposition.hearingImpaired = !!H(e, s);
        }
        break;
      case v.FlagVisualImpaired:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.disposition.visuallyImpaired = !!H(e, s);
        }
        break;
      case v.FlagCommentary:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.disposition.commentary = !!H(e, s);
        }
        break;
      case v.CodecID:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.codecId = qt(e, s);
        }
        break;
      case v.CodecPrivate:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.codecPrivate = V(e, s);
        }
        break;
      case v.DefaultDuration:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.defaultDurationNs = H(e, s);
        }
        break;
      case v.Name:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.name = sr(e, s);
        }
        break;
      case v.Language:
        {
          if (!this.currentTrack || this.currentTrack.hasLanguageBcp47)
            break;
          this.currentTrack.languageCode = qt(e, s), Pr(this.currentTrack.languageCode) || (this.currentTrack.languageCode = ge);
        }
        break;
      case v.LanguageBCP47:
        {
          if (!this.currentTrack)
            break;
          const c = qt(e, s).split("-")[0];
          c ? this.currentTrack.languageCode = c : this.currentTrack.languageCode = ge, this.currentTrack.hasLanguageBcp47 = !0;
        }
        break;
      case v.Video:
        {
          if (this.currentTrack?.info?.type !== "video")
            break;
          this.readContiguousElements(e.slice(a, s));
        }
        break;
      case v.PixelWidth:
        {
          if (this.currentTrack?.info?.type !== "video")
            break;
          this.currentTrack.info.width = H(e, s);
        }
        break;
      case v.PixelHeight:
        {
          if (this.currentTrack?.info?.type !== "video")
            break;
          this.currentTrack.info.height = H(e, s);
        }
        break;
      case v.DisplayWidth:
        {
          if (this.currentTrack?.info?.type !== "video")
            break;
          this.currentTrack.info.displayWidth = H(e, s);
        }
        break;
      case v.DisplayHeight:
        {
          if (this.currentTrack?.info?.type !== "video")
            break;
          this.currentTrack.info.displayHeight = H(e, s);
        }
        break;
      case v.DisplayUnit:
        {
          if (this.currentTrack?.info?.type !== "video")
            break;
          this.currentTrack.info.displayUnit = H(e, s);
        }
        break;
      case v.AlphaMode:
        {
          if (this.currentTrack?.info?.type !== "video")
            break;
          this.currentTrack.info.alphaMode = H(e, s) === 1;
        }
        break;
      case v.Colour:
        {
          if (this.currentTrack?.info?.type !== "video")
            break;
          this.currentTrack.info.colorSpace = {}, this.readContiguousElements(e.slice(a, s));
        }
        break;
      case v.MatrixCoefficients:
        {
          if (this.currentTrack?.info?.type !== "video" || !this.currentTrack.info.colorSpace)
            break;
          const o = H(e, s), c = ti[o] ?? null;
          this.currentTrack.info.colorSpace.matrix = c;
        }
        break;
      case v.Range:
        {
          if (this.currentTrack?.info?.type !== "video" || !this.currentTrack.info.colorSpace)
            break;
          this.currentTrack.info.colorSpace.fullRange = H(e, s) === 2;
        }
        break;
      case v.TransferCharacteristics:
        {
          if (this.currentTrack?.info?.type !== "video" || !this.currentTrack.info.colorSpace)
            break;
          const o = H(e, s), c = ei[o] ?? null;
          this.currentTrack.info.colorSpace.transfer = c;
        }
        break;
      case v.Primaries:
        {
          if (this.currentTrack?.info?.type !== "video" || !this.currentTrack.info.colorSpace)
            break;
          const o = H(e, s), c = Jr[o] ?? null;
          this.currentTrack.info.colorSpace.primaries = c;
        }
        break;
      case v.Projection:
        {
          if (this.currentTrack?.info?.type !== "video")
            break;
          this.readContiguousElements(e.slice(a, s));
        }
        break;
      case v.ProjectionPoseRoll:
        {
          if (this.currentTrack?.info?.type !== "video")
            break;
          const c = -Ui(e, s);
          try {
            this.currentTrack.info.rotation = Ar(c);
          } catch {
          }
        }
        break;
      case v.Audio:
        {
          if (this.currentTrack?.info?.type !== "audio")
            break;
          this.readContiguousElements(e.slice(a, s));
        }
        break;
      case v.SamplingFrequency:
        {
          if (this.currentTrack?.info?.type !== "audio")
            break;
          this.currentTrack.info.sampleRate = Ui(e, s);
        }
        break;
      case v.Channels:
        {
          if (this.currentTrack?.info?.type !== "audio")
            break;
          this.currentTrack.info.numberOfChannels = H(e, s);
        }
        break;
      case v.BitDepth:
        {
          if (this.currentTrack?.info?.type !== "audio")
            break;
          this.currentTrack.info.bitDepth = H(e, s);
        }
        break;
      case v.CuePoint:
        {
          if (!this.currentSegment)
            break;
          this.readContiguousElements(e.slice(a, s)), this.currentCueTime = null;
        }
        break;
      case v.CueTime:
        this.currentCueTime = H(e, s);
        break;
      case v.CueTrackPositions:
        {
          if (this.currentCueTime === null)
            break;
          g(this.currentSegment);
          const o = { time: this.currentCueTime, trackId: -1, clusterPosition: -1 };
          this.currentSegment.cuePoints.push(o), this.readContiguousElements(e.slice(a, s)), (o.trackId === -1 || o.clusterPosition === -1) && this.currentSegment.cuePoints.pop();
        }
        break;
      case v.CueTrack:
        {
          const o = this.currentSegment?.cuePoints[this.currentSegment.cuePoints.length - 1];
          if (!o)
            break;
          o.trackId = H(e, s);
        }
        break;
      case v.CueClusterPosition:
        {
          const o = this.currentSegment?.cuePoints[this.currentSegment.cuePoints.length - 1];
          if (!o)
            break;
          g(this.currentSegment), o.clusterPosition = this.currentSegment.dataStartPos + H(e, s);
        }
        break;
      case v.Timestamp:
        {
          if (!this.currentCluster)
            break;
          this.currentCluster.timestamp = H(e, s);
        }
        break;
      case v.SimpleBlock:
        {
          if (!this.currentCluster)
            break;
          const o = gr(e);
          if (o === null)
            break;
          const c = this.getTrackDataInCluster(this.currentCluster, o);
          if (!c)
            break;
          const l = En(e), u = N(e), d = u >> 1 & 3;
          let f = !!(u & 128);
          c.track.info?.type === "audio" && c.track.info.codec && (f = !0);
          const h = V(e, s - (e.filePos - a)), p = c.track.decodingInstructions.length > 0;
          c.blocks.push({
            timestamp: l,
            // We'll add the cluster's timestamp to this later
            duration: 0,
            // Will set later
            isKeyFrame: f,
            data: h,
            lacing: d,
            decoded: !p,
            postProcessed: !1,
            mainAdditional: null
          });
        }
        break;
      case v.BlockGroup:
        {
          if (!this.currentCluster)
            break;
          this.readContiguousElements(e.slice(a, s)), this.currentBlock = null;
        }
        break;
      case v.Block:
        {
          if (!this.currentCluster)
            break;
          const o = gr(e);
          if (o === null)
            break;
          const c = this.getTrackDataInCluster(this.currentCluster, o);
          if (!c)
            break;
          const l = En(e), d = N(e) >> 1 & 3, f = V(e, s - (e.filePos - a)), h = c.track.decodingInstructions.length > 0;
          this.currentBlock = {
            timestamp: l,
            // We'll add the cluster's timestamp to this later
            duration: 0,
            // Will set later
            isKeyFrame: !0,
            data: f,
            lacing: d,
            decoded: !h,
            postProcessed: !1,
            mainAdditional: null
          }, c.blocks.push(this.currentBlock);
        }
        break;
      case v.BlockAdditions:
        this.readContiguousElements(e.slice(a, s));
        break;
      case v.BlockMore:
        {
          if (!this.currentBlock)
            break;
          this.currentBlockAdditional = {
            addId: 1,
            data: null
          }, this.readContiguousElements(e.slice(a, s)), this.currentBlockAdditional.data && this.currentBlockAdditional.addId === 1 && (this.currentBlock.mainAdditional = this.currentBlockAdditional.data), this.currentBlockAdditional = null;
        }
        break;
      case v.BlockAdditional:
        {
          if (!this.currentBlockAdditional)
            break;
          this.currentBlockAdditional.data = V(e, s);
        }
        break;
      case v.BlockAddID:
        {
          if (!this.currentBlockAdditional)
            break;
          this.currentBlockAdditional.addId = H(e, s);
        }
        break;
      case v.BlockDuration:
        {
          if (!this.currentBlock)
            break;
          this.currentBlock.duration = H(e, s);
        }
        break;
      case v.ReferenceBlock:
        {
          if (!this.currentBlock)
            break;
          this.currentBlock.isKeyFrame = !1;
        }
        break;
      case v.Tag:
        this.currentTagTargetIsMovie = !0, this.readContiguousElements(e.slice(a, s));
        break;
      case v.Targets:
        this.readContiguousElements(e.slice(a, s));
        break;
      case v.TargetTypeValue:
        H(e, s) !== 50 && (this.currentTagTargetIsMovie = !1);
        break;
      case v.TagTrackUID:
      case v.TagEditionUID:
      case v.TagChapterUID:
      case v.TagAttachmentUID:
        this.currentTagTargetIsMovie = !1;
        break;
      case v.SimpleTag:
        {
          if (!this.currentTagTargetIsMovie)
            break;
          this.currentSimpleTagName = null, this.readContiguousElements(e.slice(a, s));
        }
        break;
      case v.TagName:
        this.currentSimpleTagName = sr(e, s);
        break;
      case v.TagString:
        {
          if (!this.currentSimpleTagName)
            break;
          const o = sr(e, s);
          this.processTagValue(this.currentSimpleTagName, o);
        }
        break;
      case v.TagBinary:
        {
          if (!this.currentSimpleTagName)
            break;
          const o = V(e, s);
          this.processTagValue(this.currentSimpleTagName, o);
        }
        break;
      case v.AttachedFile:
        {
          if (!this.currentSegment)
            break;
          this.currentAttachedFile = {
            fileUid: null,
            fileName: null,
            fileMediaType: null,
            fileData: null,
            fileDescription: null
          }, this.readContiguousElements(e.slice(a, s));
          const o = this.currentSegment.metadataTags;
          if (this.currentAttachedFile.fileUid && this.currentAttachedFile.fileData && (o.raw ??= {}, o.raw[this.currentAttachedFile.fileUid.toString()] = new Ca(this.currentAttachedFile.fileData, this.currentAttachedFile.fileMediaType ?? void 0, this.currentAttachedFile.fileName ?? void 0, this.currentAttachedFile.fileDescription ?? void 0)), this.currentAttachedFile.fileMediaType?.startsWith("image/") && this.currentAttachedFile.fileData) {
            const c = this.currentAttachedFile.fileName;
            let l = "unknown";
            if (c) {
              const u = c.toLowerCase();
              u.startsWith("cover.") ? l = "coverFront" : u.startsWith("back.") && (l = "coverBack");
            }
            o.images ??= [], o.images.push({
              data: this.currentAttachedFile.fileData,
              mimeType: this.currentAttachedFile.fileMediaType,
              kind: l,
              name: this.currentAttachedFile.fileName ?? void 0,
              description: this.currentAttachedFile.fileDescription ?? void 0
            });
          }
          this.currentAttachedFile = null;
        }
        break;
      case v.FileUID:
        {
          if (!this.currentAttachedFile)
            break;
          this.currentAttachedFile.fileUid = wl(e, s);
        }
        break;
      case v.FileName:
        {
          if (!this.currentAttachedFile)
            break;
          this.currentAttachedFile.fileName = sr(e, s);
        }
        break;
      case v.FileMediaType:
        {
          if (!this.currentAttachedFile)
            break;
          this.currentAttachedFile.fileMediaType = qt(e, s);
        }
        break;
      case v.FileData:
        {
          if (!this.currentAttachedFile)
            break;
          this.currentAttachedFile.fileData = V(e, s);
        }
        break;
      case v.FileDescription:
        {
          if (!this.currentAttachedFile)
            break;
          this.currentAttachedFile.fileDescription = sr(e, s);
        }
        break;
      case v.ContentEncodings:
        {
          if (!this.currentTrack)
            break;
          this.readContiguousElements(e.slice(a, s)), this.currentTrack.decodingInstructions.sort((o, c) => c.order - o.order);
        }
        break;
      case v.ContentEncoding:
        this.currentDecodingInstruction = {
          order: 0,
          scope: li.Block,
          data: null
        }, this.readContiguousElements(e.slice(a, s)), this.currentDecodingInstruction.data && this.currentTrack.decodingInstructions.push(this.currentDecodingInstruction), this.currentDecodingInstruction = null;
        break;
      case v.ContentEncodingOrder:
        {
          if (!this.currentDecodingInstruction)
            break;
          this.currentDecodingInstruction.order = H(e, s);
        }
        break;
      case v.ContentEncodingScope:
        {
          if (!this.currentDecodingInstruction)
            break;
          this.currentDecodingInstruction.scope = H(e, s);
        }
        break;
      case v.ContentCompression:
        {
          if (!this.currentDecodingInstruction)
            break;
          this.currentDecodingInstruction.data = {
            type: "decompress",
            algorithm: br.Zlib,
            settings: null
          }, this.readContiguousElements(e.slice(a, s));
        }
        break;
      case v.ContentCompAlgo:
        {
          if (this.currentDecodingInstruction?.data?.type !== "decompress")
            break;
          this.currentDecodingInstruction.data.algorithm = H(e, s);
        }
        break;
      case v.ContentCompSettings:
        {
          if (this.currentDecodingInstruction?.data?.type !== "decompress")
            break;
          this.currentDecodingInstruction.data.settings = V(e, s);
        }
        break;
      case v.ContentEncryption:
        {
          if (!this.currentDecodingInstruction)
            break;
          this.currentDecodingInstruction.data = {
            type: "decrypt"
          };
        }
        break;
    }
    return e.filePos = a + s, !0;
  }
  decodeBlockData(e, t) {
    g(e.decodingInstructions.length > 0);
    let i = t;
    for (const n of e.decodingInstructions)
      switch (g(n.data), n.data.type) {
        case "decompress":
          switch (n.data.algorithm) {
            case br.HeaderStripping:
              if (n.data.settings && n.data.settings.length > 0) {
                const s = n.data.settings, a = new Uint8Array(s.length + i.length);
                a.set(s, 0), a.set(i, s.length), i = a;
              }
              break;
          }
          break;
      }
    return i;
  }
  processTagValue(e, t) {
    if (!this.currentSegment?.metadataTags)
      return;
    const i = this.currentSegment.metadataTags;
    if (i.raw ??= {}, i.raw[e] ??= t, typeof t == "string")
      switch (e.toLowerCase()) {
        case "title":
          i.title ??= t;
          break;
        case "description":
          i.description ??= t;
          break;
        case "artist":
          i.artist ??= t;
          break;
        case "album":
          i.album ??= t;
          break;
        case "album_artist":
          i.albumArtist ??= t;
          break;
        case "genre":
          i.genre ??= t;
          break;
        case "comment":
          i.comment ??= t;
          break;
        case "lyrics":
          i.lyrics ??= t;
          break;
        case "date":
          {
            const n = new Date(t);
            Number.isNaN(n.getTime()) || (i.date ??= n);
          }
          break;
        case "track_number":
        case "part_number":
          {
            const n = t.split("/"), s = Number.parseInt(n[0], 10), a = n[1] && Number.parseInt(n[1], 10);
            Number.isInteger(s) && s > 0 && (i.trackNumber ??= s), a && Number.isInteger(a) && a > 0 && (i.tracksTotal ??= a);
          }
          break;
        case "disc_number":
        case "disc":
          {
            const n = t.split("/"), s = Number.parseInt(n[0], 10), a = n[1] && Number.parseInt(n[1], 10);
            Number.isInteger(s) && s > 0 && (i.discNumber ??= s), a && Number.isInteger(a) && a > 0 && (i.discsTotal ??= a);
          }
          break;
      }
  }
}
class ho {
  constructor(e) {
    this.internalTrack = e, this.packetToClusterLocation = /* @__PURE__ */ new WeakMap();
  }
  getId() {
    return this.internalTrack.id;
  }
  getNumber() {
    const e = this.internalTrack.demuxer, t = this.internalTrack.trackBacking.getType();
    let i = 0;
    for (const n of e.segments)
      for (const s of n.tracks)
        if (s.trackBacking.getType() === t && i++, s === this.internalTrack)
          break;
    return i;
  }
  getCodec() {
    throw new Error("Not implemented on base class.");
  }
  getInternalCodecId() {
    return this.internalTrack.codecId;
  }
  getName() {
    return this.internalTrack.name;
  }
  getLanguageCode() {
    return this.internalTrack.languageCode;
  }
  getTimeResolution() {
    return this.internalTrack.segment.timestampFactor;
  }
  isRelativeToUnixEpoch() {
    return !1;
  }
  getUnixTimeForTimestamp() {
    return null;
  }
  getDisposition() {
    return this.internalTrack.disposition;
  }
  getPairingMask() {
    return 1n;
  }
  getBitrate() {
    return null;
  }
  getAverageBitrate() {
    return null;
  }
  async getDurationFromMetadata() {
    const e = this.internalTrack.segment;
    if (e.duration <= 0)
      return null;
    let t = e.duration / e.timestampFactor;
    const i = await this.getFirstPacket({ metadataOnly: !0 });
    return t += i?.timestamp ?? 0, t;
  }
  async getLiveRefreshInterval() {
    return null;
  }
  async getFirstPacket(e) {
    return this.performClusterLookup(
      null,
      (t) => t.trackData.get(this.internalTrack.id) ? {
        blockIndex: 0,
        correctBlockFound: !0
      } : {
        blockIndex: -1,
        correctBlockFound: !1
      },
      -1 / 0,
      // Use -Infinity as a search timestamp to avoid using the cues
      1 / 0,
      e
    );
  }
  intoTimescale(e) {
    return xr(e * this.internalTrack.segment.timestampFactor);
  }
  async getPacket(e, t) {
    const i = this.intoTimescale(e);
    return this.performClusterLookup(null, (n) => {
      const s = n.trackData.get(this.internalTrack.id);
      if (!s)
        return { blockIndex: -1, correctBlockFound: !1 };
      const a = G(s.presentationTimestamps, i, (l) => l.timestamp), o = a !== -1 ? s.presentationTimestamps[a].blockIndex : -1, c = a !== -1 && i < s.endTimestamp;
      return { blockIndex: o, correctBlockFound: c };
    }, i, i, t);
  }
  async getNextPacket(e, t) {
    const i = this.packetToClusterLocation.get(e);
    if (i === void 0)
      throw new Error("Packet was not created from this track.");
    return this.performClusterLookup(
      i.cluster,
      (n) => {
        if (n === i.cluster) {
          const s = n.trackData.get(this.internalTrack.id);
          if (i.blockIndex + 1 < s.blocks.length)
            return {
              blockIndex: i.blockIndex + 1,
              correctBlockFound: !0
            };
        } else if (n.trackData.get(this.internalTrack.id))
          return {
            blockIndex: 0,
            correctBlockFound: !0
          };
        return {
          blockIndex: -1,
          correctBlockFound: !1
        };
      },
      -1 / 0,
      // Use -Infinity as a search timestamp to avoid using the cues
      1 / 0,
      t
    );
  }
  async getKeyPacket(e, t) {
    const i = this.intoTimescale(e);
    return this.performClusterLookup(null, (n) => {
      const s = n.trackData.get(this.internalTrack.id);
      if (!s)
        return { blockIndex: -1, correctBlockFound: !1 };
      const a = Rn(s.presentationTimestamps, (l) => s.blocks[l.blockIndex].isKeyFrame && l.timestamp <= i), o = a !== -1 ? s.presentationTimestamps[a].blockIndex : -1, c = a !== -1 && i < s.endTimestamp;
      return { blockIndex: o, correctBlockFound: c };
    }, i, i, t);
  }
  async getNextKeyPacket(e, t) {
    const i = this.packetToClusterLocation.get(e);
    if (i === void 0)
      throw new Error("Packet was not created from this track.");
    return this.performClusterLookup(
      i.cluster,
      (n) => {
        if (n === i.cluster) {
          const a = n.trackData.get(this.internalTrack.id).blocks.findIndex((o, c) => o.isKeyFrame && c > i.blockIndex);
          if (a !== -1)
            return {
              blockIndex: a,
              correctBlockFound: !0
            };
        } else {
          const s = n.trackData.get(this.internalTrack.id);
          if (s && s.firstKeyFrameTimestamp !== null) {
            const a = s.blocks.findIndex((o) => o.isKeyFrame);
            return g(a !== -1), {
              blockIndex: a,
              correctBlockFound: !0
            };
          }
        }
        return {
          blockIndex: -1,
          correctBlockFound: !1
        };
      },
      -1 / 0,
      // Use -Infinity as a search timestamp to avoid using the cues
      1 / 0,
      t
    );
  }
  async fetchPacketInCluster(e, t, i) {
    if (t === -1)
      return null;
    const s = e.trackData.get(this.internalTrack.id).blocks[t];
    if (g(s), s.decoded || (s.data = this.internalTrack.demuxer.decodeBlockData(this.internalTrack, s.data), s.decoded = !0), !s.postProcessed) {
      if (this.internalTrack.info?.codec === "prores" && !(s.data.length >= 8 && s.data[4] === 105 && s.data[5] === 99 && s.data[6] === 112 && s.data[7] === 102)) {
        const f = new Uint8Array(s.data.length + 8);
        K(f).setUint32(0, f.length, !1), f[4] = 105, f[5] = 99, f[6] = 112, f[7] = 102, f.set(s.data, 8), s.data = f;
      }
      s.postProcessed = !0;
    }
    const a = i.metadataOnly ? Ie : s.data, o = s.timestamp / this.internalTrack.segment.timestampFactor, c = s.duration / this.internalTrack.segment.timestampFactor, l = {};
    s.mainAdditional && this.internalTrack.info?.type === "video" && this.internalTrack.info.alphaMode && (l.alpha = i.metadataOnly ? Ie : s.mainAdditional, l.alphaByteLength = s.mainAdditional.byteLength);
    const u = new Y(a, s.isKeyFrame ? "key" : "delta", o, c, e.dataStartPos + t, s.data.byteLength, l);
    return this.packetToClusterLocation.set(u, { cluster: e, blockIndex: t }), u;
  }
  /** Looks for a packet in the clusters while trying to load as few clusters as possible to retrieve it. */
  async performClusterLookup(e, t, i, n, s) {
    const { demuxer: a, segment: o } = this.internalTrack;
    let c = null, l = null, u = -1;
    if (e) {
      const { blockIndex: w, correctBlockFound: b } = t(e);
      if (b)
        return this.fetchPacketInCluster(e, w, s);
      w !== -1 && (l = e, u = w);
    }
    const d = G(this.internalTrack.cuePoints, i, (w) => w.time), f = d !== -1 ? this.internalTrack.cuePoints[d] : null, h = G(this.internalTrack.clusterPositionCache, i, (w) => w.startTimestamp), p = h !== -1 ? this.internalTrack.clusterPositionCache[h] : null, m = Math.max(f?.clusterPosition ?? 0, p?.elementStartPos ?? 0) || null;
    let y;
    for (e ? m === null || e.elementStartPos >= m ? (y = e.elementEndPos, c = e) : y = m : y = m ?? o.clusterSeekStartPos; o.elementEndPos === null || y <= o.elementEndPos - Be; ) {
      if (c) {
        const P = c.trackData.get(this.internalTrack.id);
        if (P && P.startTimestamp > n)
          break;
      }
      let w = a.reader.requestSliceRange(y, Be, it);
      if (w instanceof Promise && (w = await w), !w)
        break;
      const b = y, k = et(w);
      if (!k || !_r.includes(k.id) && k.id !== v.Void) {
        const P = await uo(a.reader, b, _r, Math.min(o.elementEndPos ?? 1 / 0, b + fo));
        if (P) {
          y = P;
          continue;
        } else
          break;
      }
      const A = k.id;
      let T = k.size;
      const x = w.filePos;
      if (A === v.Cluster) {
        c = await a.readCluster(b, o), T = c.elementEndPos - x;
        const { blockIndex: P, correctBlockFound: S } = t(c);
        if (S)
          return this.fetchPacketInCluster(c, P, s);
        P !== -1 && (l = c, u = P);
      }
      T === void 0 && (g(A !== v.Cluster), T = (await wn(a.reader, x, Xr, o.elementEndPos)).pos - x);
      const C = x + T;
      if (o.elementEndPos === null) {
        let P = a.reader.requestSliceRange(C, Be, it);
        if (P instanceof Promise && (P = await P), !P)
          break;
        if (Qn(P) === v.Segment) {
          o.elementEndPos = C;
          break;
        }
      }
      y = C;
    }
    if (f && (!l || l.elementStartPos < f.clusterPosition)) {
      const w = this.internalTrack.cuePoints[d - 1];
      g(!w || w.time < f.time);
      const b = w?.time ?? -1 / 0;
      return this.performClusterLookup(null, t, b, n, s);
    }
    return l ? this.fetchPacketInCluster(l, u, s) : null;
  }
}
class Tl extends ho {
  constructor(e) {
    super(e), this.decoderConfigPromise = null, this.internalTrack = e;
  }
  getType() {
    return "video";
  }
  getCodec() {
    return this.internalTrack.info.codec;
  }
  getCodedWidth() {
    return this.internalTrack.info.width;
  }
  getCodedHeight() {
    return this.internalTrack.info.height;
  }
  getSquarePixelWidth() {
    return this.internalTrack.info.squarePixelWidth;
  }
  getSquarePixelHeight() {
    return this.internalTrack.info.squarePixelHeight;
  }
  getRotation() {
    return this.internalTrack.info.rotation;
  }
  async getColorSpace() {
    return {
      primaries: this.internalTrack.info.colorSpace?.primaries,
      transfer: this.internalTrack.info.colorSpace?.transfer,
      matrix: this.internalTrack.info.colorSpace?.matrix,
      fullRange: this.internalTrack.info.colorSpace?.fullRange
    };
  }
  async canBeTransparent() {
    return this.internalTrack.info.alphaMode || this.internalTrack.info.codec === "prores" && (this.internalTrack.info.proresFormat === "ap4h" || this.internalTrack.info.proresFormat === "ap4x");
  }
  async getDecoderConfig() {
    return this.internalTrack.info.codec ? this.decoderConfigPromise ??= (async () => {
      let e = null;
      (this.internalTrack.info.codec === "vp9" || this.internalTrack.info.codec === "av1" || this.internalTrack.info.codec === "avc" && !this.internalTrack.info.codecDescription || this.internalTrack.info.codec === "hevc" && !this.internalTrack.info.codecDescription) && (e = await this.getFirstPacket({}));
      const i = {
        codec: Nn({
          width: this.internalTrack.info.width,
          height: this.internalTrack.info.height,
          codec: this.internalTrack.info.codec,
          codecDescription: this.internalTrack.info.codecDescription,
          colorSpace: this.internalTrack.info.colorSpace,
          avcType: 1,
          // We don't know better (or do we?) so just assume 'avc1'
          avcCodecInfo: this.internalTrack.info.codec === "avc" && e ? Ai(e.data) : null,
          hevcCodecInfo: this.internalTrack.info.codec === "hevc" && e ? Si(e.data) : null,
          vp9CodecInfo: this.internalTrack.info.codec === "vp9" && e ? Wa(e.data) : null,
          av1CodecInfo: this.internalTrack.info.codec === "av1" && e ? La(e.data) : null,
          proresFormat: this.internalTrack.info.proresFormat
        }),
        codedWidth: this.internalTrack.info.width,
        codedHeight: this.internalTrack.info.height,
        description: this.internalTrack.info.codecDescription ?? void 0,
        colorSpace: this.internalTrack.info.colorSpace ?? void 0
      };
      return (this.internalTrack.info.width !== this.internalTrack.info.squarePixelWidth || this.internalTrack.info.height !== this.internalTrack.info.squarePixelHeight) && (i.displayAspectWidth = this.internalTrack.info.squarePixelWidth, i.displayAspectHeight = this.internalTrack.info.squarePixelHeight), i;
    })() : null;
  }
}
class Al extends ho {
  constructor(e) {
    super(e), this.decoderConfigPromise = null, this.internalTrack = e;
  }
  getType() {
    return "audio";
  }
  getCodec() {
    return this.internalTrack.info.codec;
  }
  getNumberOfChannels() {
    return this.internalTrack.info.numberOfChannels;
  }
  getSampleRate() {
    return this.internalTrack.info.sampleRate;
  }
  async getDecoderConfig() {
    return this.internalTrack.info.codec ? this.decoderConfigPromise ??= (async () => {
      if (this.internalTrack.info.codec === "dts" && !this.internalTrack.info.dtsFormat) {
        const e = await this.getFirstPacket({});
        this.internalTrack.info.dtsFormat = e && Ya(e.data);
      }
      return {
        codec: Vn({
          codec: this.internalTrack.info.codec,
          codecDescription: this.internalTrack.info.codecDescription,
          aacCodecInfo: this.internalTrack.info.aacCodecInfo,
          dtsFormat: this.internalTrack.info.dtsFormat
        }),
        numberOfChannels: this.internalTrack.info.numberOfChannels,
        sampleRate: this.internalTrack.info.sampleRate,
        description: this.internalTrack.info.codecDescription ?? void 0
      };
    })() : null;
  }
}
const bn = async (r, e, t, i = null) => {
  let s = e;
  for (; t === null || s < t; ) {
    const a = t !== null ? Math.min(65536, t - s) : 65536;
    let o = r.requestSliceRange(s, _t, a);
    if (o instanceof Promise && (o = await o), !o || o.length < _t)
      break;
    for (; o.remainingLength >= _t; ) {
      const c = o.filePos, l = R(o), u = r.fileSize !== null ? r.fileSize - s : null, d = Un(l, u);
      if (d.header && (!i || // This condition helps us recover malformed streams
      // https://stackoverflow.com/a/20884944
      d.header.sampleRate === i.sampleRate && d.header.mpegVersionId === i.mpegVersionId && d.header.layer === i.layer && Ir(d.header.channel) === Ir(i.channel)))
        return { header: d.header, startPos: s };
      o.filePos = c + d.bytesAdvanced, s = o.filePos;
    }
  }
  return null;
};
class Sl extends lt {
  constructor(e) {
    super(e), this.metadataPromise = null, this.firstFrameHeader = null, this.firstFrameHeaderPos = null, this.xingFrameHeader = null, this.xingFrameHeaderPos = null, this.loadedSamples = [], this.metadataTags = null, this.xingData = null, this.trackBackings = [], this.readingMutex = new nr(), this.lastSampleLoaded = !1, this.lastLoadedPos = 0, this.nextTimestampInSamples = 0, this.reader = e._reader;
  }
  async readMetadata() {
    return this.metadataPromise ??= (async () => {
      for (; !this.firstFrameHeader && !this.lastSampleLoaded; )
        await this.advanceReader();
      if (!this.firstFrameHeader && this.xingFrameHeader && (this.firstFrameHeader = this.xingFrameHeader, this.firstFrameHeaderPos = this.xingFrameHeaderPos), !this.firstFrameHeader)
        throw new Error("No valid MP3 frame found.");
      this.trackBackings = [new xl(this)];
    })();
  }
  async advanceReader() {
    if (this.lastLoadedPos === 0)
      for (; ; ) {
        let o = this.reader.requestSlice(this.lastLoadedPos, Fe);
        if (o instanceof Promise && (o = await o), !o) {
          this.lastSampleLoaded = !0;
          return;
        }
        const c = ot(o);
        if (!c)
          break;
        this.lastLoadedPos = o.filePos + c.size;
      }
    const e = await bn(this.reader, this.lastLoadedPos, this.reader.fileSize, this.firstFrameHeader);
    if (!e) {
      this.lastSampleLoaded = !0;
      return;
    }
    const t = e.header;
    this.lastLoadedPos = e.startPos + t.totalSize - 1;
    const i = Ma(t.mpegVersionId, t.channel);
    let n = this.reader.requestSlice(e.startPos + i, 4);
    if (n instanceof Promise && (n = await n), n) {
      const o = R(n);
      if (o === Ra || o === Fa) {
        if (this.xingFrameHeader || (this.xingFrameHeader = t, this.xingFrameHeaderPos = e.startPos), !this.xingData) {
          let l = this.reader.requestSlice(e.startPos + i + 4, 12);
          if (l instanceof Promise && (l = await l), l) {
            const u = V(l, 12), d = K(u), f = d.getUint32(0, !1);
            this.xingData = {
              frameCount: f & ai.FrameCount ? d.getUint32(4, !1) : null,
              fileSize: f & ai.FileSize ? d.getUint32(8, !1) : null
            };
          }
        }
        return;
      }
    }
    this.firstFrameHeader || (this.firstFrameHeader = t, this.firstFrameHeaderPos = e.startPos);
    const s = t.audioSamplesInFrame / this.firstFrameHeader.sampleRate, a = {
      timestamp: this.nextTimestampInSamples / this.firstFrameHeader.sampleRate,
      duration: s,
      dataStart: e.startPos,
      dataSize: t.totalSize
    };
    this.loadedSamples.push(a), this.nextTimestampInSamples += t.audioSamplesInFrame;
  }
  async getMimeType() {
    return "audio/mpeg";
  }
  async getTrackBackings() {
    return await this.readMetadata(), this.trackBackings;
  }
  async getMetadataTags() {
    const e = await this.readingMutex.acquire();
    try {
      if (await this.readMetadata(), this.metadataTags)
        return this.metadataTags;
      this.metadataTags = {};
      let t = 0, i = !1;
      for (; ; ) {
        let n = this.reader.requestSlice(t, Fe);
        if (n instanceof Promise && (n = await n), !n)
          break;
        const s = ot(n);
        if (!s)
          break;
        i = !0;
        let a = this.reader.requestSlice(n.filePos, s.size);
        if (a instanceof Promise && (a = await a), !a)
          break;
        Ei(a, s, this.metadataTags), t = n.filePos + s.size;
      }
      if (!i && this.reader.fileSize !== null && this.reader.fileSize >= Yr) {
        let n = this.reader.requestSlice(this.reader.fileSize - Yr, Yr);
        n instanceof Promise && (n = await n), g(n), ie(n, 3) === "TAG" && kd(n, this.metadataTags);
      }
      return this.metadataTags;
    } finally {
      e();
    }
  }
}
class xl {
  constructor(e) {
    this.demuxer = e;
  }
  getType() {
    return "audio";
  }
  getId() {
    return 1;
  }
  getNumber() {
    return 1;
  }
  getTimeResolution() {
    return g(this.demuxer.firstFrameHeader), this.demuxer.firstFrameHeader.sampleRate / this.demuxer.firstFrameHeader.audioSamplesInFrame;
  }
  isRelativeToUnixEpoch() {
    return !1;
  }
  getUnixTimeForTimestamp() {
    return null;
  }
  getPairingMask() {
    return 1n;
  }
  getBitrate() {
    return null;
  }
  getAverageBitrate() {
    return null;
  }
  async getDurationFromMetadata() {
    const e = this.demuxer;
    if (g(e.firstFrameHeader !== null), g(e.firstFrameHeaderPos !== null), e.xingData) {
      if (e.xingData.frameCount !== null)
        return e.xingData.frameCount * e.firstFrameHeader.audioSamplesInFrame / e.firstFrameHeader.sampleRate;
    } else if (e.reader.fileSize !== null) {
      const t = _c(e.firstFrameHeader.lowSamplingFrequency, e.firstFrameHeader.layer, e.firstFrameHeader.bitrate, e.firstFrameHeader.sampleRate), i = (e.reader.fileSize - e.firstFrameHeaderPos) / t;
      return Math.round(i) * e.firstFrameHeader.audioSamplesInFrame / e.firstFrameHeader.sampleRate;
    }
    return null;
  }
  async getLiveRefreshInterval() {
    return null;
  }
  getName() {
    return null;
  }
  getLanguageCode() {
    return ge;
  }
  getCodec() {
    return "mp3";
  }
  getInternalCodecId() {
    return null;
  }
  getNumberOfChannels() {
    return g(this.demuxer.firstFrameHeader), Ir(this.demuxer.firstFrameHeader.channel);
  }
  getSampleRate() {
    return g(this.demuxer.firstFrameHeader), this.demuxer.firstFrameHeader.sampleRate;
  }
  getDisposition() {
    return {
      ...ct
    };
  }
  async getDecoderConfig() {
    return g(this.demuxer.firstFrameHeader), {
      codec: "mp3",
      numberOfChannels: Ir(this.demuxer.firstFrameHeader.channel),
      sampleRate: this.demuxer.firstFrameHeader.sampleRate
    };
  }
  async getPacketAtIndex(e, t) {
    if (e === -1)
      return null;
    const i = this.demuxer.loadedSamples[e];
    if (!i)
      return null;
    let n;
    if (t.metadataOnly)
      n = Ie;
    else {
      let s = this.demuxer.reader.requestSlice(i.dataStart, i.dataSize);
      if (s instanceof Promise && (s = await s), !s)
        return null;
      n = V(s, i.dataSize);
    }
    return new Y(n, "key", i.timestamp, i.duration, e, i.dataSize);
  }
  getFirstPacket(e) {
    return this.getPacketAtIndex(0, e);
  }
  async getNextPacket(e, t) {
    const i = await this.demuxer.readingMutex.acquire();
    try {
      const n = Rr(this.demuxer.loadedSamples, e.timestamp, (a) => a.timestamp);
      if (n === -1)
        throw new Error("Packet was not created from this track.");
      const s = n + 1;
      for (; s >= this.demuxer.loadedSamples.length && !this.demuxer.lastSampleLoaded; )
        await this.demuxer.advanceReader();
      return this.getPacketAtIndex(s, t);
    } finally {
      i();
    }
  }
  async getPacket(e, t) {
    const i = await this.demuxer.readingMutex.acquire();
    try {
      for (; ; ) {
        const n = G(this.demuxer.loadedSamples, e, (s) => s.timestamp);
        if (n === -1 && this.demuxer.loadedSamples.length > 0)
          return null;
        if (this.demuxer.lastSampleLoaded)
          return this.getPacketAtIndex(n, t);
        if (n >= 0 && n + 1 < this.demuxer.loadedSamples.length)
          return this.getPacketAtIndex(n, t);
        await this.demuxer.advanceReader();
      }
    } finally {
      i();
    }
  }
  getKeyPacket(e, t) {
    return this.getPacket(e, t);
  }
  getNextKeyPacket(e, t) {
    return this.getNextPacket(e, t);
  }
}
const mo = 1399285583, Pl = 79764919, po = new Uint32Array(256);
for (let r = 0; r < 256; r++) {
  let e = r << 24;
  for (let t = 0; t < 8; t++)
    e = e & 2147483648 ? e << 1 ^ Pl : e << 1;
  po[r] = e >>> 0 & 4294967295;
}
const Cl = (r) => {
  const e = K(r), t = e.getUint32(22, !0);
  e.setUint32(22, 0, !0);
  let i = 0;
  for (let n = 0; n < r.length; n++) {
    const s = r[n];
    i = (i << 8 ^ po[i >>> 24 ^ s]) >>> 0;
  }
  return e.setUint32(22, t, !0), i;
}, El = (r, e, t) => {
  let i = 0, n = null;
  if (r.length > 0)
    if (e.codec === "vorbis") {
      g(e.vorbisInfo);
      const s = e.vorbisInfo.modeBlockflags.length, o = (1 << ac(s - 1)) - 1 << 1, c = (r[0] & o) >> 1;
      if (c >= e.vorbisInfo.modeBlockflags.length)
        throw new Error("Invalid mode number.");
      let l = t;
      const u = e.vorbisInfo.modeBlockflags[c];
      if (n = e.vorbisInfo.blocksizes[u], u === 1) {
        const d = (o | 1) + 1, f = r[0] & d ? 1 : 0;
        l = e.vorbisInfo.blocksizes[f];
      }
      i = l !== null ? l + n >> 2 : 0;
    } else e.codec === "opus" && (i = Lc(r).durationInSamples);
  return {
    durationInSamples: i,
    vorbisBlockSize: n
  };
}, Il = (r) => {
  let e = "audio/ogg";
  if (r.codecStrings) {
    const t = [...new Set(r.codecStrings)];
    e += `; codecs="${t.join(", ")}"`;
  }
  return e;
};
const Pt = 27, $t = 282, _l = $t + 65025, kr = (r) => {
  const e = r.filePos;
  if (Ht(r) !== mo)
    return null;
  r.skip(1);
  const i = N(r), n = wd(r), s = Ht(r), a = Ht(r), o = Ht(r), c = N(r), l = new Uint8Array(c);
  for (let h = 0; h < c; h++)
    l[h] = N(r);
  const u = 27 + c, d = l.reduce((h, p) => h + p, 0), f = u + d;
  return {
    headerStartPos: e,
    totalSize: f,
    dataStartPos: e + u,
    dataSize: d,
    headerType: i,
    granulePosition: n,
    serialNumber: s,
    sequenceNumber: a,
    checksum: o,
    lacingValues: l
  };
}, vl = (r, e) => {
  for (; r.filePos < e - 3; ) {
    const t = Ht(r), i = t & 255, n = t >>> 8 & 255, s = t >>> 16 & 255, a = t >>> 24 & 255, o = 79;
    if (!(i !== o && n !== o && s !== o && a !== o)) {
      if (r.skip(-4), t === mo)
        return !0;
      r.skip(1);
    }
  }
  return !1;
};
class Bl extends lt {
  constructor(e) {
    super(e), this.metadataPromise = null, this.bitstreams = [], this.trackBackings = [], this.metadataTags = {}, this.reader = e._reader;
  }
  async readMetadata() {
    return this.metadataPromise ??= (async () => {
      let e = 0;
      for (; ; ) {
        let t = this.reader.requestSliceRange(e, Pt, $t);
        if (t instanceof Promise && (t = await t), !t)
          break;
        const i = kr(t);
        if (!i || !!!(i.headerType & 2))
          break;
        this.bitstreams.push({
          serialNumber: i.serialNumber,
          bosPage: i,
          description: null,
          numberOfChannels: -1,
          sampleRate: -1,
          codecInfo: {
            codec: null,
            vorbisInfo: null,
            opusInfo: null
          },
          lastMetadataPacket: null
        }), e = i.headerStartPos + i.totalSize;
      }
      for (const t of this.bitstreams) {
        const i = await this.readPacket(t.bosPage, 0);
        i && (// Check for Vorbis
        i.data.byteLength >= 7 && i.data[0] === 1 && i.data[1] === 118 && i.data[2] === 111 && i.data[3] === 114 && i.data[4] === 98 && i.data[5] === 105 && i.data[6] === 115 ? await this.readVorbisMetadata(i, t) : (
          // Check for Opus
          i.data.byteLength >= 8 && i.data[0] === 79 && i.data[1] === 112 && i.data[2] === 117 && i.data[3] === 115 && i.data[4] === 72 && i.data[5] === 101 && i.data[6] === 97 && i.data[7] === 100 && await this.readOpusMetadata(i, t)
        ), t.codecInfo.codec !== null && this.trackBackings.push(new Rl(t, this)));
      }
    })();
  }
  async readVorbisMetadata(e, t) {
    let i = await this.findNextPacketStart(e);
    if (!i)
      return;
    const n = await this.readPacket(i.startPage, i.startSegmentIndex);
    if (!n || (i = await this.findNextPacketStart(n), !i))
      return;
    const s = await this.readPacket(i.startPage, i.startSegmentIndex);
    if (!s || n.data[0] !== 3 || s.data[0] !== 5)
      return;
    const a = [], o = (d) => {
      for (; a.push(Math.min(255, d)), !(d < 255); )
        d -= 255;
    };
    o(e.data.length), o(n.data.length);
    const c = new Uint8Array(1 + a.length + e.data.length + n.data.length + s.data.length);
    c[0] = 2, c.set(a, 1), c.set(e.data, 1 + a.length), c.set(n.data, 1 + a.length + e.data.length), c.set(s.data, 1 + a.length + e.data.length + n.data.length), t.codecInfo.codec = "vorbis", t.description = c, t.lastMetadataPacket = s;
    const l = K(e.data);
    t.numberOfChannels = l.getUint8(11), t.sampleRate = l.getUint32(12, !0);
    const u = l.getUint8(28);
    t.codecInfo.vorbisInfo = {
      blocksizes: [
        1 << (u & 15),
        1 << (u >> 4)
      ],
      modeBlockflags: Hc(s.data).modeBlockflags
    }, mn(n.data.subarray(7), this.metadataTags);
  }
  async readOpusMetadata(e, t) {
    const i = await this.findNextPacketStart(e);
    if (!i)
      return;
    const n = await this.readPacket(i.startPage, i.startSegmentIndex);
    if (!n)
      return;
    t.codecInfo.codec = "opus", t.description = e.data, t.lastMetadataPacket = n;
    const s = Ha(e.data);
    t.numberOfChannels = s.outputChannelCount, t.sampleRate = wi, t.codecInfo.opusInfo = {
      preSkip: s.preSkip
    }, mn(n.data.subarray(8), this.metadataTags);
  }
  async readPacket(e, t) {
    g(t < e.lacingValues.length);
    let i = 0;
    for (let d = 0; d < t; d++)
      i += e.lacingValues[d];
    let n = e, s = i, a = t;
    const o = [];
    e: for (; ; ) {
      let d = this.reader.requestSlice(n.dataStartPos, n.dataSize);
      d instanceof Promise && (d = await d), g(d);
      const f = V(d, n.dataSize);
      for (; ; ) {
        if (a === n.lacingValues.length) {
          o.push(f.subarray(i, s));
          break;
        }
        const p = n.lacingValues[a];
        if (s += p, p < 255) {
          o.push(f.subarray(i, s));
          break e;
        }
        a++;
      }
      let h = n.headerStartPos + n.totalSize;
      for (; ; ) {
        let p = this.reader.requestSliceRange(h, Pt, $t);
        if (p instanceof Promise && (p = await p), !p)
          return null;
        const m = kr(p);
        if (!m)
          return null;
        if (n = m, n.serialNumber === e.serialNumber)
          break;
        h = n.headerStartPos + n.totalSize;
      }
      i = 0, s = 0, a = 0;
    }
    const c = o.reduce((d, f) => d + f.length, 0);
    if (c === 0)
      return null;
    const l = new Uint8Array(c);
    let u = 0;
    for (let d = 0; d < o.length; d++) {
      const f = o[d];
      l.set(f, u), u += f.length;
    }
    return {
      data: l,
      endPage: n,
      endSegmentIndex: a
    };
  }
  async findNextPacketStart(e) {
    if (e.endSegmentIndex < e.endPage.lacingValues.length - 1)
      return { startPage: e.endPage, startSegmentIndex: e.endSegmentIndex + 1 };
    if (!!(e.endPage.headerType & 4))
      return null;
    let i = e.endPage.headerStartPos + e.endPage.totalSize;
    for (; ; ) {
      let n = this.reader.requestSliceRange(i, Pt, $t);
      if (n instanceof Promise && (n = await n), !n)
        return null;
      const s = kr(n);
      if (!s)
        return null;
      if (s.serialNumber === e.endPage.serialNumber)
        return { startPage: s, startSegmentIndex: 0 };
      i = s.headerStartPos + s.totalSize;
    }
  }
  async getMimeType() {
    await this.readMetadata();
    const e = await Promise.all(this.trackBackings.map((t) => t.getDecoderConfig().then((i) => i?.codec ?? null)));
    return Il({
      codecStrings: e.filter(Boolean)
    });
  }
  async getTrackBackings() {
    return await this.readMetadata(), this.trackBackings;
  }
  async getMetadataTags() {
    return await this.readMetadata(), this.metadataTags;
  }
}
class Rl {
  constructor(e, t) {
    this.bitstream = e, this.demuxer = t, this.encodedPacketToMetadata = /* @__PURE__ */ new WeakMap(), this.sequentialScanCache = [], this.sequentialScanMutex = new nr(), this.internalSampleRate = e.codecInfo.codec === "opus" ? wi : e.sampleRate;
  }
  getType() {
    return "audio";
  }
  getId() {
    return this.bitstream.serialNumber;
  }
  getNumber() {
    const e = this.demuxer.trackBackings.findIndex((t) => t.bitstream === this.bitstream);
    return g(e !== -1), e + 1;
  }
  getNumberOfChannels() {
    return this.bitstream.numberOfChannels;
  }
  getSampleRate() {
    return this.bitstream.sampleRate;
  }
  getTimeResolution() {
    return this.bitstream.sampleRate;
  }
  isRelativeToUnixEpoch() {
    return !1;
  }
  getUnixTimeForTimestamp() {
    return null;
  }
  getPairingMask() {
    return 1n;
  }
  getBitrate() {
    return null;
  }
  getAverageBitrate() {
    return null;
  }
  async getDurationFromMetadata() {
    return null;
  }
  async getLiveRefreshInterval() {
    return null;
  }
  getCodec() {
    return this.bitstream.codecInfo.codec;
  }
  getInternalCodecId() {
    return null;
  }
  async getDecoderConfig() {
    return g(this.bitstream.codecInfo.codec), {
      codec: this.bitstream.codecInfo.codec,
      numberOfChannels: this.bitstream.numberOfChannels,
      sampleRate: this.bitstream.sampleRate,
      description: this.bitstream.description ?? void 0
    };
  }
  getName() {
    return null;
  }
  getLanguageCode() {
    return ge;
  }
  getDisposition() {
    return {
      ...ct,
      primary: !1
    };
  }
  granulePositionToTimestampInSamples(e) {
    return this.bitstream.codecInfo.codec === "opus" ? (g(this.bitstream.codecInfo.opusInfo), e - this.bitstream.codecInfo.opusInfo.preSkip) : e;
  }
  createEncodedPacketFromOggPacket(e, t, i) {
    if (!e)
      return null;
    const { durationInSamples: n, vorbisBlockSize: s } = El(e.data, this.bitstream.codecInfo, t.vorbisLastBlocksize), a = new Y(i.metadataOnly ? Ie : e.data, "key", Math.max(0, t.timestampInSamples) / this.internalSampleRate, n / this.internalSampleRate, e.endPage.headerStartPos + e.endSegmentIndex, e.data.byteLength);
    return this.encodedPacketToMetadata.set(a, {
      packet: e,
      timestampInSamples: t.timestampInSamples,
      durationInSamples: n,
      vorbisLastBlockSize: t.vorbisLastBlocksize,
      vorbisBlockSize: s
    }), a;
  }
  async getFirstPacket(e) {
    g(this.bitstream.lastMetadataPacket);
    const t = await this.demuxer.findNextPacketStart(this.bitstream.lastMetadataPacket);
    if (!t)
      return null;
    let i = 0;
    this.bitstream.codecInfo.codec === "opus" && (g(this.bitstream.codecInfo.opusInfo), i -= this.bitstream.codecInfo.opusInfo.preSkip);
    const n = await this.demuxer.readPacket(t.startPage, t.startSegmentIndex);
    return this.createEncodedPacketFromOggPacket(n, {
      timestampInSamples: i,
      vorbisLastBlocksize: null
    }, e);
  }
  async getNextPacket(e, t) {
    const i = this.encodedPacketToMetadata.get(e);
    if (!i)
      throw new Error("Packet was not created from this track.");
    const n = await this.demuxer.findNextPacketStart(i.packet);
    if (!n)
      return null;
    const s = i.timestampInSamples + i.durationInSamples, a = await this.demuxer.readPacket(n.startPage, n.startSegmentIndex);
    return this.createEncodedPacketFromOggPacket(a, {
      timestampInSamples: s,
      vorbisLastBlocksize: i.vorbisBlockSize
    }, t);
  }
  async getPacket(e, t) {
    if (this.demuxer.reader.fileSize === null)
      return this.getPacketSequential(e, t);
    const i = xr(e * this.internalSampleRate);
    if (i === 0)
      return this.getFirstPacket(t);
    if (i < 0)
      return null;
    g(this.bitstream.lastMetadataPacket);
    const n = await this.demuxer.findNextPacketStart(this.bitstream.lastMetadataPacket);
    if (!n)
      return null;
    let s = n.startPage, a = this.demuxer.reader.fileSize;
    const o = [s];
    e: for (; s.headerStartPos + s.totalSize < a; ) {
      const b = s.headerStartPos, k = Math.floor((b + a) / 2);
      let A = k;
      for (; ; ) {
        const T = Math.min(A + _l, a - Pt);
        let x = this.demuxer.reader.requestSlice(A, T - A);
        if (x instanceof Promise && (x = await x), g(x), !vl(x, T)) {
          a = k + Pt;
          continue e;
        }
        let P = this.demuxer.reader.requestSliceRange(x.filePos, Pt, $t);
        P instanceof Promise && (P = await P), g(P);
        const S = kr(P);
        g(S);
        let E = !1;
        if (S.serialNumber === this.bitstream.serialNumber)
          E = !0;
        else {
          let _ = this.demuxer.reader.requestSlice(S.headerStartPos, S.totalSize);
          _ instanceof Promise && (_ = await _), g(_);
          const F = V(_, S.totalSize);
          E = Cl(F) === S.checksum;
        }
        if (!E) {
          A = S.headerStartPos + 4;
          continue;
        }
        if (E && S.serialNumber !== this.bitstream.serialNumber) {
          A = S.headerStartPos + S.totalSize;
          continue;
        }
        if (S.granulePosition === -1) {
          A = S.headerStartPos + S.totalSize;
          continue;
        }
        this.granulePositionToTimestampInSamples(S.granulePosition) > i ? a = S.headerStartPos : (s = S, o.push(S));
        continue e;
      }
    }
    let c = n.startPage;
    for (const b of o) {
      if (b.granulePosition === s.granulePosition)
        break;
      (!c || b.headerStartPos > c.headerStartPos) && (c = b);
    }
    let l = c;
    const u = [l];
    for (; !(l.serialNumber === this.bitstream.serialNumber && l.granulePosition === s.granulePosition); ) {
      const b = l.headerStartPos + l.totalSize;
      let k = this.demuxer.reader.requestSliceRange(b, Pt, $t);
      k instanceof Promise && (k = await k), g(k);
      const A = kr(k);
      g(A), l = A, l.serialNumber === this.bitstream.serialNumber && u.push(l);
    }
    g(l.granulePosition !== -1);
    let d = null, f, h, p = l, m = 0;
    if (l.headerStartPos === n.startPage.headerStartPos)
      f = this.granulePositionToTimestampInSamples(0), h = !0, d = 0;
    else {
      f = 0, h = !1;
      for (let A = l.lacingValues.length - 1; A >= 0; A--)
        if (l.lacingValues[A] < 255) {
          d = A + 1;
          break;
        }
      if (d === null)
        throw new Error("Invalid page with granule position: no packets end on this page.");
      m = d - 1;
      const b = {
        data: Ie,
        endPage: p,
        endSegmentIndex: m
      };
      if (await this.demuxer.findNextPacketStart(b)) {
        const A = Ps(u, l, d);
        g(A);
        const T = xs(u, A.page, A.segmentIndex);
        T && (l = T.page, d = T.segmentIndex);
      } else
        for (; ; ) {
          const A = Ps(u, l, d);
          if (!A)
            break;
          const T = xs(u, A.page, A.segmentIndex);
          if (!T)
            break;
          if (l = T.page, d = T.segmentIndex, A.page.headerStartPos !== p.headerStartPos) {
            p = A.page, m = A.segmentIndex;
            break;
          }
        }
    }
    let y = null, w = null;
    for (; l !== null; ) {
      g(d !== null);
      const b = await this.demuxer.readPacket(l, d);
      if (!b)
        break;
      if (!(l.headerStartPos === n.startPage.headerStartPos && d < n.startSegmentIndex)) {
        let T = this.createEncodedPacketFromOggPacket(b, {
          timestampInSamples: f,
          vorbisLastBlocksize: w?.vorbisBlockSize ?? null
        }, t);
        g(T);
        let x = this.encodedPacketToMetadata.get(T);
        if (g(x), !h && b.endPage.headerStartPos === p.headerStartPos && b.endSegmentIndex === m ? (f = this.granulePositionToTimestampInSamples(l.granulePosition), h = !0, T = this.createEncodedPacketFromOggPacket(b, {
          timestampInSamples: f - x.durationInSamples,
          vorbisLastBlocksize: w?.vorbisBlockSize ?? null
        }, t), g(T), x = this.encodedPacketToMetadata.get(T), g(x)) : f += x.durationInSamples, y = T, w = x, h && // Next timestamp will be too late
        (Math.max(f, 0) > i || Math.max(x.timestampInSamples, 0) === i))
          break;
      }
      const A = await this.demuxer.findNextPacketStart(b);
      if (!A)
        break;
      l = A.startPage, d = A.startSegmentIndex;
    }
    return y;
  }
  // A slower but simpler and sequential algorithm for finding a packet in a file
  async getPacketSequential(e, t) {
    const i = await this.sequentialScanMutex.acquire();
    try {
      const n = xr(e * this.internalSampleRate);
      e = n / this.internalSampleRate;
      const s = G(this.sequentialScanCache, n, (c) => c.timestampInSamples);
      let a;
      if (s !== -1) {
        const c = this.sequentialScanCache[s];
        a = this.createEncodedPacketFromOggPacket(c.packet, {
          timestampInSamples: c.timestampInSamples,
          vorbisLastBlocksize: c.vorbisLastBlockSize
        }, t);
      } else
        a = await this.getFirstPacket(t);
      let o = 0;
      for (; a && a.timestamp < e; ) {
        const c = await this.getNextPacket(a, t);
        if (!c || c.timestamp > e)
          break;
        if (a = c, o++, o === 100) {
          o = 0;
          const l = this.encodedPacketToMetadata.get(a);
          g(l), this.sequentialScanCache.length > 0 && g(te(this.sequentialScanCache).timestampInSamples <= l.timestampInSamples), this.sequentialScanCache.push(l);
        }
      }
      return a;
    } finally {
      i();
    }
  }
  getKeyPacket(e, t) {
    return this.getPacket(e, t);
  }
  getNextKeyPacket(e, t) {
    return this.getNextPacket(e, t);
  }
}
const xs = (r, e, t) => {
  let i = e, n = t;
  e: for (; ; ) {
    for (n--, n; n >= 0; n--)
      if (i.lacingValues[n] < 255) {
        n++;
        break e;
      }
    if (g(n === -1), !(i.headerType & 1)) {
      n = 0;
      break;
    }
    const a = Aa(r, (o) => o.headerStartPos < i.headerStartPos);
    if (!a)
      return null;
    i = a, n = i.lacingValues.length;
  }
  if (g(n !== -1), n === i.lacingValues.length) {
    const s = r[r.indexOf(i) + 1];
    g(s), i = s, n = 0;
  }
  return { page: i, segmentIndex: n };
}, Ps = (r, e, t) => {
  if (t > 0)
    return { page: e, segmentIndex: t - 1 };
  const i = Aa(r, (n) => n.headerStartPos < e.headerStartPos);
  return i ? { page: i, segmentIndex: i.lacingValues.length - 1 } : null;
};
var we;
(function(r) {
  r[r.PCM = 1] = "PCM", r[r.IEEE_FLOAT = 3] = "IEEE_FLOAT", r[r.ALAW = 6] = "ALAW", r[r.MULAW = 7] = "MULAW", r[r.EXTENSIBLE = 65534] = "EXTENSIBLE";
})(we || (we = {}));
class Fl extends lt {
  constructor(e) {
    super(e), this.metadataPromise = null, this.dataStart = -1, this.dataSize = -1, this.audioInfo = null, this.trackBackings = [], this.lastKnownPacketIndex = 0, this.metadataTags = {}, this.reader = e._reader;
  }
  async readMetadata() {
    return this.metadataPromise ??= (async () => {
      let e = this.reader.requestSlice(0, 12);
      e instanceof Promise && (e = await e), g(e);
      const t = ie(e, 4), i = t !== "RIFX", n = t === "RF64", s = gt(e, i);
      let a = n ? this.reader.fileSize : Math.min(s + 8, this.reader.fileSize ?? 1 / 0);
      if (ie(e, 4) !== "WAVE")
        throw new Error("Invalid WAVE file - wrong format");
      let c = 0, l = null, u = e.filePos;
      for (; a === null || u < a; ) {
        let f = this.reader.requestSlice(u, 8);
        if (f instanceof Promise && (f = await f), !f)
          break;
        const h = ie(f, 4), p = gt(f, i), m = f.filePos;
        if (n && c === 0 && h !== "ds64")
          throw new Error('Invalid RF64 file: First chunk must be "ds64".');
        if (h === "fmt ")
          await this.parseFmtChunk(m, p, i);
        else if (h === "data") {
          if (l ??= p, this.dataStart = f.filePos, this.dataSize = Math.min(l, (a ?? 1 / 0) - this.dataStart), this.reader.fileSize === null)
            break;
        } else if (h === "ds64") {
          let y = this.reader.requestSlice(m, p);
          if (y instanceof Promise && (y = await y), !y)
            break;
          const w = la(y, i);
          l = la(y, i), a = Math.min(w + 8, this.reader.fileSize ?? 1 / 0);
        } else h === "LIST" ? await this.parseListChunk(m, p, i) : (h === "ID3 " || h === "id3 ") && await this.parseId3Chunk(m, p);
        u = m + p + (p & 1), c++;
      }
      if (!this.audioInfo)
        throw new Error('Invalid WAVE file - missing "fmt " chunk');
      if (this.dataStart === -1)
        throw new Error('Invalid WAVE file - missing "data" chunk');
      const d = this.audioInfo.blockSizeInBytes;
      this.dataSize = Math.floor(this.dataSize / d) * d, this.trackBackings.push(new Ml(this));
    })();
  }
  async parseFmtChunk(e, t, i) {
    let n = this.reader.requestSlice(e, t);
    if (n instanceof Promise && (n = await n), !n)
      return;
    let s = fr(n, i);
    const a = fr(n, i), o = gt(n, i);
    n.skip(4);
    const c = fr(n, i);
    let l;
    if (t === 14 ? l = 8 : l = fr(n, i), t >= 18 && s !== 357) {
      const u = fr(n, i), d = t - 18;
      if (Math.min(d, u) >= 22 && s === we.EXTENSIBLE) {
        n.skip(6);
        const h = V(n, 16);
        s = h[0] | h[1] << 8;
      }
    }
    if ((s === we.MULAW || s === we.ALAW) && (l = 8), s !== we.PCM && s !== we.IEEE_FLOAT && s !== we.ALAW && s !== we.MULAW)
      throw new Error(`Unsupported WAVE codec (format tag ${s}). Only integer/float PCM, A-law, and μ-law are supported.`);
    if (s === we.PCM && ![8, 16, 24, 32].includes(l))
      throw new Error(`Unsupported WAVE PCM bit depth (${l}). Only 8, 16, 24, and 32 bits are supported.`);
    if (s === we.IEEE_FLOAT && ![32, 64].includes(l))
      throw new Error(`Unsupported WAVE float bit depth (${l}). Only 32 and 64 bits are supported.`);
    this.audioInfo = {
      format: s,
      numberOfChannels: a,
      sampleRate: o,
      sampleSizeInBytes: Math.ceil(l / 8),
      blockSizeInBytes: c
    };
  }
  async parseListChunk(e, t, i) {
    let n = this.reader.requestSlice(e, t);
    if (n instanceof Promise && (n = await n), !n)
      return;
    const s = ie(n, 4);
    if (s !== "INFO" && s !== "INF0")
      return;
    let a = n.filePos;
    for (; a <= e + t - 8; ) {
      n.filePos = a;
      const o = ie(n, 4), c = gt(n, i), l = V(n, c);
      let u = 0;
      for (let f = 0; f < l.length && l[f] !== 0; f++)
        u++;
      const d = String.fromCharCode(...l.subarray(0, u));
      switch (this.metadataTags.raw ??= {}, this.metadataTags.raw[o] = d, o) {
        case "INAM":
        case "TITL":
          this.metadataTags.title ??= d;
          break;
        case "TIT3":
          this.metadataTags.description ??= d;
          break;
        case "IART":
          this.metadataTags.artist ??= d;
          break;
        case "IPRD":
          this.metadataTags.album ??= d;
          break;
        case "IPRT":
        case "ITRK":
        case "TRCK":
          {
            const f = d.split("/"), h = Number.parseInt(f[0], 10), p = f[1] && Number.parseInt(f[1], 10);
            Number.isInteger(h) && h > 0 && (this.metadataTags.trackNumber ??= h), p && Number.isInteger(p) && p > 0 && (this.metadataTags.tracksTotal ??= p);
          }
          break;
        case "ICRD":
        case "IDIT":
          {
            const f = new Date(d);
            Number.isNaN(f.getTime()) || (this.metadataTags.date ??= f);
          }
          break;
        case "YEAR":
          {
            const f = Number.parseInt(d, 10);
            Number.isInteger(f) && f > 0 && (this.metadataTags.date ??= new Date(f, 0, 1));
          }
          break;
        case "IGNR":
        case "GENR":
          this.metadataTags.genre ??= d;
          break;
        case "ICMT":
        case "CMNT":
        case "COMM":
          this.metadataTags.comment ??= d;
          break;
      }
      a += 8 + c + (c & 1);
    }
  }
  async parseId3Chunk(e, t) {
    let i = this.reader.requestSlice(e, t);
    if (i instanceof Promise && (i = await i), !i)
      return;
    const n = ot(i);
    if (n) {
      const s = t - Fe;
      if (n.size = Math.min(n.size, s), n.size > 0) {
        const a = i.slice(e + Fe, n.size);
        Ei(a, n, this.metadataTags);
      }
    }
  }
  getCodec() {
    if (g(this.audioInfo), this.audioInfo.format === we.MULAW)
      return "ulaw";
    if (this.audioInfo.format === we.ALAW)
      return "alaw";
    if (this.audioInfo.format === we.PCM) {
      if (this.audioInfo.sampleSizeInBytes === 1)
        return "pcm-u8";
      if (this.audioInfo.sampleSizeInBytes === 2)
        return "pcm-s16";
      if (this.audioInfo.sampleSizeInBytes === 3)
        return "pcm-s24";
      if (this.audioInfo.sampleSizeInBytes === 4)
        return "pcm-s32";
    }
    if (this.audioInfo.format === we.IEEE_FLOAT) {
      if (this.audioInfo.sampleSizeInBytes === 4)
        return "pcm-f32";
      if (this.audioInfo.sampleSizeInBytes === 8)
        return "pcm-f64";
    }
    g(!1);
  }
  async getMimeType() {
    return "audio/wav";
  }
  async getTrackBackings() {
    return await this.readMetadata(), this.trackBackings;
  }
  async getMetadataTags() {
    return await this.readMetadata(), this.metadataTags;
  }
}
const zt = 2048;
class Ml {
  constructor(e) {
    this.demuxer = e;
  }
  getType() {
    return "audio";
  }
  getId() {
    return 1;
  }
  getNumber() {
    return 1;
  }
  getCodec() {
    return this.demuxer.getCodec();
  }
  getInternalCodecId() {
    return g(this.demuxer.audioInfo), this.demuxer.audioInfo.format;
  }
  async getDecoderConfig() {
    const e = this.demuxer.getCodec();
    return e ? (g(this.demuxer.audioInfo), {
      codec: e,
      numberOfChannels: this.demuxer.audioInfo.numberOfChannels,
      sampleRate: this.demuxer.audioInfo.sampleRate
    }) : null;
  }
  getNumberOfChannels() {
    return g(this.demuxer.audioInfo), this.demuxer.audioInfo.numberOfChannels;
  }
  getSampleRate() {
    return g(this.demuxer.audioInfo), this.demuxer.audioInfo.sampleRate;
  }
  getTimeResolution() {
    return g(this.demuxer.audioInfo), this.demuxer.audioInfo.sampleRate;
  }
  isRelativeToUnixEpoch() {
    return !1;
  }
  getUnixTimeForTimestamp() {
    return null;
  }
  getPairingMask() {
    return 1n;
  }
  getBitrate() {
    return null;
  }
  getAverageBitrate() {
    return null;
  }
  async getDurationFromMetadata() {
    return g(this.demuxer.dataSize !== -1), this.demuxer.dataSize / this.demuxer.audioInfo.blockSizeInBytes / this.demuxer.audioInfo.sampleRate;
  }
  async getLiveRefreshInterval() {
    return null;
  }
  getName() {
    return null;
  }
  getLanguageCode() {
    return ge;
  }
  getDisposition() {
    return {
      ...ct
    };
  }
  async getPacketAtIndex(e, t) {
    g(e >= 0), g(this.demuxer.audioInfo);
    const i = e * zt * this.demuxer.audioInfo.blockSizeInBytes;
    if (i >= this.demuxer.dataSize)
      return null;
    const n = Math.min(zt * this.demuxer.audioInfo.blockSizeInBytes, this.demuxer.dataSize - i);
    if (this.demuxer.reader.fileSize === null) {
      let c = this.demuxer.reader.requestSlice(this.demuxer.dataStart + i, n);
      if (c instanceof Promise && (c = await c), !c)
        return null;
    }
    let s;
    if (t.metadataOnly)
      s = Ie;
    else {
      let c = this.demuxer.reader.requestSlice(this.demuxer.dataStart + i, n);
      c instanceof Promise && (c = await c), g(c), s = V(c, n);
    }
    const a = e * zt / this.demuxer.audioInfo.sampleRate, o = n / this.demuxer.audioInfo.blockSizeInBytes / this.demuxer.audioInfo.sampleRate;
    return this.demuxer.lastKnownPacketIndex = Math.max(e, this.demuxer.lastKnownPacketIndex), new Y(s, "key", a, o, e, n);
  }
  getFirstPacket(e) {
    return this.getPacketAtIndex(0, e);
  }
  async getPacket(e, t) {
    g(this.demuxer.audioInfo);
    const i = Math.floor(Math.min(e * this.demuxer.audioInfo.sampleRate / zt, (this.demuxer.dataSize - 1) / (zt * this.demuxer.audioInfo.blockSizeInBytes)));
    if (i < 0)
      return null;
    const n = await this.getPacketAtIndex(i, t);
    if (n)
      return n;
    if (i === 0)
      return null;
    g(this.demuxer.reader.fileSize === null);
    let s = await this.getPacketAtIndex(this.demuxer.lastKnownPacketIndex, t);
    for (; s; ) {
      const a = await this.getNextPacket(s, t);
      if (!a)
        break;
      s = a;
    }
    return s;
  }
  getNextPacket(e, t) {
    g(this.demuxer.audioInfo);
    const i = Math.round(e.timestamp * this.demuxer.audioInfo.sampleRate / zt);
    return this.getPacketAtIndex(i + 1, t);
  }
  getKeyPacket(e, t) {
    return this.getPacket(e, t);
  }
  getNextKeyPacket(e, t) {
    return this.getNextPacket(e, t);
  }
}
const ui = 7, vt = 9, Ft = (r) => {
  const e = r.filePos, t = V(r, 9), i = new Q(t);
  if (i.readBits(12) !== 4095 || (i.skipBits(1), i.readBits(2) !== 0))
    return null;
  const a = i.readBits(1), o = i.readBits(2) + 1, c = i.readBits(4);
  if (c === 15)
    return null;
  i.skipBits(1);
  const l = i.readBits(3);
  if (l === 0)
    throw new Error("ADTS frames with channel configuration 0 are not supported.");
  i.skipBits(1), i.skipBits(1), i.skipBits(1), i.skipBits(1);
  const u = i.readBits(13);
  i.skipBits(11);
  const d = i.readBits(2) + 1;
  if (d !== 1)
    throw new Error("ADTS frames with more than one AAC frame are not supported.");
  let f = null;
  return a === 1 ? r.filePos -= 2 : f = i.readBits(16), {
    objectType: o,
    samplingFrequencyIndex: c,
    channelConfiguration: l,
    frameLength: u,
    numberOfAacFrames: d,
    crcCheck: f,
    startPos: e
  };
};
const di = 1024;
class zl extends lt {
  constructor(e) {
    super(e), this.metadataPromise = null, this.firstFrameHeader = null, this.loadedSamples = [], this.metadataTags = null, this.trackBackings = [], this.readingMutex = new nr(), this.lastSampleLoaded = !1, this.lastLoadedPos = 0, this.nextTimestampInSamples = 0, this.reader = e._reader;
  }
  async readMetadata() {
    return this.metadataPromise ??= (async () => {
      for (; !this.firstFrameHeader && !this.lastSampleLoaded; )
        await this.advanceReader();
      g(this.firstFrameHeader), this.trackBackings = [new Ol(this)];
    })();
  }
  async advanceReader() {
    if (this.lastLoadedPos === 0)
      for (; ; ) {
        let a = this.reader.requestSlice(this.lastLoadedPos, Fe);
        if (a instanceof Promise && (a = await a), !a) {
          this.lastSampleLoaded = !0;
          return;
        }
        const o = ot(a);
        if (!o)
          break;
        this.lastLoadedPos = a.filePos + o.size;
      }
    let e = this.reader.requestSliceRange(this.lastLoadedPos, ui, vt);
    if (e instanceof Promise && (e = await e), !e) {
      this.lastSampleLoaded = !0;
      return;
    }
    const t = Ft(e);
    if (!t) {
      this.lastSampleLoaded = !0;
      return;
    }
    if (this.reader.fileSize !== null && t.startPos + t.frameLength > this.reader.fileSize) {
      this.lastSampleLoaded = !0;
      return;
    }
    this.firstFrameHeader || (this.firstFrameHeader = t);
    const i = Rt[t.samplingFrequencyIndex];
    g(i !== void 0);
    const n = di / i, s = {
      timestamp: this.nextTimestampInSamples / i,
      duration: n,
      dataStart: t.startPos,
      dataSize: t.frameLength
    };
    this.loadedSamples.push(s), this.nextTimestampInSamples += di, this.lastLoadedPos = t.startPos + t.frameLength;
  }
  async getMimeType() {
    return "audio/aac";
  }
  async getTrackBackings() {
    return await this.readMetadata(), this.trackBackings;
  }
  async getMetadataTags() {
    const e = await this.readingMutex.acquire();
    try {
      if (await this.readMetadata(), this.metadataTags)
        return this.metadataTags;
      this.metadataTags = {};
      let t = 0;
      for (; ; ) {
        let i = this.reader.requestSlice(t, Fe);
        if (i instanceof Promise && (i = await i), !i)
          break;
        const n = ot(i);
        if (!n)
          break;
        let s = this.reader.requestSlice(i.filePos, n.size);
        if (s instanceof Promise && (s = await s), !s)
          break;
        Ei(s, n, this.metadataTags), t = i.filePos + n.size;
      }
      return this.metadataTags;
    } finally {
      e();
    }
  }
}
class Ol {
  constructor(e) {
    this.demuxer = e;
  }
  getType() {
    return "audio";
  }
  getId() {
    return 1;
  }
  getNumber() {
    return 1;
  }
  getTimeResolution() {
    return this.getSampleRate() / di;
  }
  isRelativeToUnixEpoch() {
    return !1;
  }
  getUnixTimeForTimestamp() {
    return null;
  }
  getPairingMask() {
    return 1n;
  }
  getBitrate() {
    return null;
  }
  getAverageBitrate() {
    return null;
  }
  async getDurationFromMetadata() {
    return null;
  }
  async getLiveRefreshInterval() {
    return null;
  }
  getName() {
    return null;
  }
  getLanguageCode() {
    return ge;
  }
  getCodec() {
    return "aac";
  }
  getInternalCodecId() {
    return g(this.demuxer.firstFrameHeader), this.demuxer.firstFrameHeader.objectType;
  }
  getNumberOfChannels() {
    g(this.demuxer.firstFrameHeader);
    const e = Mr[this.demuxer.firstFrameHeader.channelConfiguration];
    return g(e !== void 0), e;
  }
  getSampleRate() {
    g(this.demuxer.firstFrameHeader);
    const e = Rt[this.demuxer.firstFrameHeader.samplingFrequencyIndex];
    return g(e !== void 0), e;
  }
  getDisposition() {
    return {
      ...ct
    };
  }
  async getDecoderConfig() {
    return g(this.demuxer.firstFrameHeader), {
      codec: `mp4a.40.${this.demuxer.firstFrameHeader.objectType}`,
      numberOfChannels: this.getNumberOfChannels(),
      sampleRate: this.getSampleRate()
    };
  }
  async getPacketAtIndex(e, t) {
    if (e === -1)
      return null;
    const i = this.demuxer.loadedSamples[e];
    if (!i)
      return null;
    let n;
    if (t.metadataOnly)
      n = Ie;
    else {
      let s = this.demuxer.reader.requestSlice(i.dataStart, i.dataSize);
      if (s instanceof Promise && (s = await s), !s)
        return null;
      n = V(s, i.dataSize);
    }
    return new Y(n, "key", i.timestamp, i.duration, e, i.dataSize);
  }
  getFirstPacket(e) {
    return this.getPacketAtIndex(0, e);
  }
  async getNextPacket(e, t) {
    const i = await this.demuxer.readingMutex.acquire();
    try {
      const n = Rr(this.demuxer.loadedSamples, e.timestamp, (a) => a.timestamp);
      if (n === -1)
        throw new Error("Packet was not created from this track.");
      const s = n + 1;
      for (; s >= this.demuxer.loadedSamples.length && !this.demuxer.lastSampleLoaded; )
        await this.demuxer.advanceReader();
      return this.getPacketAtIndex(s, t);
    } finally {
      i();
    }
  }
  async getPacket(e, t) {
    const i = await this.demuxer.readingMutex.acquire();
    try {
      for (; ; ) {
        const n = G(this.demuxer.loadedSamples, e, (s) => s.timestamp);
        if (n === -1 && this.demuxer.loadedSamples.length > 0)
          return null;
        if (this.demuxer.lastSampleLoaded)
          return this.getPacketAtIndex(n, t);
        if (n >= 0 && n + 1 < this.demuxer.loadedSamples.length)
          return this.getPacketAtIndex(n, t);
        await this.demuxer.advanceReader();
      }
    } finally {
      i();
    }
  }
  getKeyPacket(e, t) {
    return this.getPacket(e, t);
  }
  getNextKeyPacket(e, t) {
    return this.getNextPacket(e, t);
  }
}
const Dl = (r) => r === 0 ? null : r === 1 ? 192 : r >= 2 && r <= 5 ? 144 * 2 ** r : r === 6 ? "uncommon-u8" : r === 7 ? "uncommon-u16" : r >= 8 && r <= 15 ? 2 ** r : null, Nl = (r, e) => {
  switch (r) {
    case 0:
      return e;
    case 1:
      return 88200;
    case 2:
      return 176400;
    case 3:
      return 192e3;
    case 4:
      return 8e3;
    case 5:
      return 16e3;
    case 6:
      return 22050;
    case 7:
      return 24e3;
    case 8:
      return 32e3;
    case 9:
      return 44100;
    case 10:
      return 48e3;
    case 11:
      return 96e3;
    case 12:
      return "uncommon-u8";
    case 13:
      return "uncommon-u16";
    case 14:
      return "uncommon-u16-10";
    default:
      return null;
  }
}, Vl = (r) => {
  let e = 0;
  const t = new Q(V(r, 1));
  for (; t.readBits(1) === 1; )
    e++;
  if (e === 0)
    return t.readBits(7);
  const i = [], n = e - 1, s = new Q(V(r, n)), a = 8 - e - 1;
  for (let c = 0; c < a; c++)
    i.unshift(t.readBits(1));
  for (let c = 0; c < n; c++)
    for (let l = 0; l < 8; l++) {
      const u = s.readBits(1);
      l < 2 || i.unshift(u);
    }
  return i.reduce((c, l, u) => c | l << u, 0);
}, Ul = (r, e) => {
  if (e === "uncommon-u16")
    return se(r) + 1;
  if (e === "uncommon-u8")
    return N(r) + 1;
  if (typeof e == "number")
    return e;
  Re(e), g(!1);
}, Wl = (r, e) => e === "uncommon-u16" ? se(r) : e === "uncommon-u16-10" ? se(r) * 10 : e === "uncommon-u8" ? N(r) : typeof e == "number" ? e : null, ql = (r) => {
  let t = 0;
  for (const i of r) {
    t ^= i;
    for (let n = 0; n < 8; n++)
      (t & 128) !== 0 ? t = t << 1 ^ 7 : t <<= 1, t &= 255;
  }
  return t;
};
class Ll extends lt {
  constructor(e) {
    super(e), this.loadedSamples = [], this.metadataPromise = null, this.trackBacking = null, this.metadataTags = {}, this.audioInfo = null, this.lastLoadedPos = null, this.blockingBit = null, this.readingMutex = new nr(), this.lastSampleLoaded = !1, this.reader = e._reader;
  }
  async getMetadataTags() {
    return await this.readMetadata(), this.metadataTags;
  }
  async getTrackBackings() {
    return await this.readMetadata(), g(this.trackBacking), [this.trackBacking];
  }
  async getMimeType() {
    return "audio/flac";
  }
  async readMetadata() {
    return this.metadataPromise ??= (async () => {
      let e = 0;
      for (; ; ) {
        let t = this.reader.requestSlice(e, Fe);
        if (t instanceof Promise && (t = await t), !t) {
          this.lastSampleLoaded = !0;
          return;
        }
        const i = ot(t);
        if (!i)
          break;
        let n = this.reader.requestSlice(t.filePos, i.size);
        n instanceof Promise && (n = await n), g(n), Ei(n, i, this.metadataTags), e = t.filePos + i.size;
      }
      for (e += 4; this.reader.fileSize === null || e < this.reader.fileSize; ) {
        let t = this.reader.requestSlice(e, 4);
        if (t instanceof Promise && (t = await t), e += 4, t === null)
          throw new Error(`Metadata block at position ${e} is too small! Corrupted file.`);
        g(t);
        const i = N(t), n = Ze(t), s = (i & 128) !== 0;
        switch (i & 127) {
          case Xt.STREAMINFO: {
            let o = this.reader.requestSlice(e, n);
            if (o instanceof Promise && (o = await o), g(o), o === null)
              throw new Error(`StreamInfo block at position ${e} is too small! Corrupted file.`);
            const c = V(o, 34), l = new Q(c), u = l.readBits(16), d = l.readBits(16), f = l.readBits(24), h = l.readBits(24), p = l.readBits(20), m = l.readBits(3) + 1;
            l.readBits(5);
            const y = l.readBits(36);
            l.skipBits(128);
            const w = new Uint8Array(42);
            w.set(new Uint8Array([102, 76, 97, 67]), 0), w.set(new Uint8Array([128, 0, 0, 34]), 4), w.set(c, 8), this.audioInfo = {
              numberOfChannels: m,
              sampleRate: p,
              totalSamples: y,
              minimumBlockSize: u,
              maximumBlockSize: d,
              minimumFrameSize: f,
              maximumFrameSize: h,
              description: w
            }, this.trackBacking = new Hl(this);
            break;
          }
          case Xt.VORBIS_COMMENT: {
            let o = this.reader.requestSlice(e, n);
            o instanceof Promise && (o = await o), g(o), mn(V(o, n), this.metadataTags);
            break;
          }
          case Xt.PICTURE: {
            let o = this.reader.requestSlice(e, n);
            o instanceof Promise && (o = await o), g(o);
            const c = R(o), l = R(o), u = Ae.decode(V(o, l)), d = R(o), f = Ae.decode(V(o, d));
            o.skip(16);
            const h = R(o), p = V(o, h);
            this.metadataTags.images ??= [], this.metadataTags.images.push({
              data: p,
              mimeType: u,
              // https://www.rfc-editor.org/rfc/rfc9639.html#table13
              kind: c === 3 ? "coverFront" : c === 4 ? "coverBack" : "unknown",
              description: f
            });
            break;
          }
        }
        if (e += n, s) {
          this.lastLoadedPos = e;
          break;
        }
      }
      if (!this.audioInfo)
        throw new Error("Missing STREAMINFO metadata block! Corrupted FLAC file.");
    })();
  }
  async readNextFlacFrame({ startPos: e, isFirstPacket: t }) {
    g(this.audioInfo);
    const i = 6, n = 16, s = 10, a = this.audioInfo.maximumBlockSize * this.audioInfo.numberOfChannels * 4 + n + 2, o = this.audioInfo.minimumFrameSize || s, l = (this.audioInfo.maximumFrameSize || a) + n, u = await this.reader.requestSliceRange(e, n, l);
    if (!u)
      return null;
    const d = this.readFlacFrameHeader({
      slice: u,
      isFirstPacket: t
    });
    if (!d)
      return null;
    for (u.filePos = e + o; ; ) {
      if (u.filePos > u.end - i)
        return {
          num: d.num,
          blockSize: d.blockSize,
          sampleRate: d.sampleRate,
          size: u.end - e,
          isLastFrame: !0
        };
      if (N(u) === 255) {
        const h = u.filePos, p = N(u), m = this.blockingBit === 1 ? 249 : 248;
        if (p !== m) {
          u.filePos = h;
          continue;
        }
        u.skip(-2);
        const y = u.filePos - e, w = this.readFlacFrameHeader({
          slice: u,
          isFirstPacket: !1
        });
        if (!w) {
          u.filePos = h;
          continue;
        }
        if (this.blockingBit === 0) {
          if (w.num - d.num !== 1) {
            u.filePos = h;
            continue;
          }
        } else if (w.num - d.num !== d.blockSize) {
          u.filePos = h;
          continue;
        }
        return {
          num: d.num,
          blockSize: d.blockSize,
          sampleRate: d.sampleRate,
          size: y,
          isLastFrame: !1
        };
      }
    }
  }
  readFlacFrameHeader({ slice: e, isFirstPacket: t }) {
    const i = e.filePos, n = V(e, 4), s = new Q(n);
    if (s.readBits(15) !== 32764)
      return null;
    if (this.blockingBit === null) {
      g(t);
      const y = s.readBits(1);
      this.blockingBit = y;
    } else if (this.blockingBit === 1) {
      if (g(!t), s.readBits(1) !== 1)
        return null;
    } else if (this.blockingBit === 0) {
      if (g(!t), s.readBits(1) !== 0)
        return null;
    } else
      throw new Error("Invalid blocking bit");
    const o = Dl(s.readBits(4));
    if (!o)
      return null;
    g(this.audioInfo);
    const c = Nl(s.readBits(4), this.audioInfo.sampleRate);
    if (!c || (s.readBits(4), s.readBits(3), s.readBits(1) !== 0))
      return null;
    const u = Vl(e), d = Ul(e, o), f = Wl(e, c);
    if (f === null || f !== this.audioInfo.sampleRate)
      return null;
    const h = e.filePos - i, p = N(e);
    e.skip(-h), e.skip(-1);
    const m = ql(V(e, h));
    return p !== m ? null : { num: u, blockSize: d, sampleRate: f };
  }
  async advanceReader() {
    await this.readMetadata(), g(this.lastLoadedPos !== null), g(this.audioInfo);
    const e = this.lastLoadedPos, t = await this.readNextFlacFrame({
      startPos: e,
      isFirstPacket: this.loadedSamples.length === 0
    });
    if (!t) {
      this.lastSampleLoaded = !0;
      return;
    }
    const i = this.loadedSamples[this.loadedSamples.length - 1], s = {
      blockOffset: i ? i.blockOffset + i.blockSize : 0,
      blockSize: t.blockSize,
      byteOffset: e,
      byteSize: t.size
    };
    if (this.lastLoadedPos = this.lastLoadedPos + t.size, this.loadedSamples.push(s), t.isLastFrame) {
      this.lastSampleLoaded = !0;
      return;
    }
  }
}
class Hl {
  constructor(e) {
    this.demuxer = e;
  }
  getType() {
    return "audio";
  }
  getId() {
    return 1;
  }
  getNumber() {
    return 1;
  }
  getCodec() {
    return "flac";
  }
  getInternalCodecId() {
    return null;
  }
  getNumberOfChannels() {
    return g(this.demuxer.audioInfo), this.demuxer.audioInfo.numberOfChannels;
  }
  getSampleRate() {
    return g(this.demuxer.audioInfo), this.demuxer.audioInfo.sampleRate;
  }
  getName() {
    return null;
  }
  getLanguageCode() {
    return ge;
  }
  getTimeResolution() {
    return g(this.demuxer.audioInfo), this.demuxer.audioInfo.sampleRate;
  }
  isRelativeToUnixEpoch() {
    return !1;
  }
  getUnixTimeForTimestamp() {
    return null;
  }
  getPairingMask() {
    return 1n;
  }
  getBitrate() {
    return null;
  }
  getAverageBitrate() {
    return null;
  }
  async getDurationFromMetadata() {
    return g(this.demuxer.audioInfo), this.demuxer.audioInfo.totalSamples === 0 ? null : this.demuxer.audioInfo.totalSamples / this.demuxer.audioInfo.sampleRate;
  }
  async getLiveRefreshInterval() {
    return null;
  }
  getDisposition() {
    return {
      ...ct
    };
  }
  async getDecoderConfig() {
    return g(this.demuxer.audioInfo), {
      codec: "flac",
      numberOfChannels: this.demuxer.audioInfo.numberOfChannels,
      sampleRate: this.demuxer.audioInfo.sampleRate,
      description: this.demuxer.audioInfo.description
    };
  }
  async getPacket(e, t) {
    if (g(this.demuxer.audioInfo), e < 0)
      return null;
    const i = await this.demuxer.readingMutex.acquire();
    try {
      for (; ; ) {
        const n = G(this.demuxer.loadedSamples, e, (c) => c.blockOffset / this.demuxer.audioInfo.sampleRate);
        if (n === -1) {
          await this.demuxer.advanceReader();
          continue;
        }
        const s = this.demuxer.loadedSamples[n], a = s.blockOffset / this.demuxer.audioInfo.sampleRate, o = s.blockSize / this.demuxer.audioInfo.sampleRate;
        if (a + o <= e) {
          if (this.demuxer.lastSampleLoaded)
            return this.getPacketAtIndex(this.demuxer.loadedSamples.length - 1, t);
          await this.demuxer.advanceReader();
          continue;
        }
        return this.getPacketAtIndex(n, t);
      }
    } finally {
      i();
    }
  }
  async getNextPacket(e, t) {
    const i = await this.demuxer.readingMutex.acquire();
    try {
      const n = e.sequenceNumber + 1;
      if (this.demuxer.lastSampleLoaded && n >= this.demuxer.loadedSamples.length)
        return null;
      for (; n >= this.demuxer.loadedSamples.length && !this.demuxer.lastSampleLoaded; )
        await this.demuxer.advanceReader();
      return this.getPacketAtIndex(n, t);
    } finally {
      i();
    }
  }
  getKeyPacket(e, t) {
    return this.getPacket(e, t);
  }
  getNextKeyPacket(e, t) {
    return this.getNextPacket(e, t);
  }
  async getPacketAtIndex(e, t) {
    const i = this.demuxer.loadedSamples[e];
    if (!i)
      return null;
    let n;
    if (t.metadataOnly)
      n = Ie;
    else {
      let o = this.demuxer.reader.requestSlice(i.byteOffset, i.byteSize);
      if (o instanceof Promise && (o = await o), !o)
        return null;
      n = V(o, i.byteSize);
    }
    g(this.demuxer.audioInfo);
    const s = i.blockOffset / this.demuxer.audioInfo.sampleRate, a = i.blockSize / this.demuxer.audioInfo.sampleRate;
    return new Y(n, "key", s, a, e, i.byteSize);
  }
  async getFirstPacket(e) {
    for (; this.demuxer.loadedSamples.length === 0 && !this.demuxer.lastSampleLoaded; )
      await this.demuxer.advanceReader();
    return this.getPacketAtIndex(0, e);
  }
}
const je = 9e4, xe = 188, jl = (r) => {
  let e = "video/MP2T";
  const t = [...new Set(r.filter(Boolean))];
  return t.length > 0 && (e += `; codecs="${t.join(", ")}"`), e;
};
const go = "PES packet is missing PTS where it was expected. PES packets without PTS are not currently supported. If you think this file should be supported, please report it.", Cs = 5, Kl = 1212435798, Ql = 1212436562, Gl = 1146376960, Xl = /* @__PURE__ */ new Set([
  133,
  134,
  162
]), Es = /* @__PURE__ */ new Set();
class $l extends lt {
  constructor(e) {
    super(e), this.metadataPromise = null, this.elementaryStreams = [], this.trackBackingEntries = [], this.packetOffset = 0, this.packetStride = -1, this.sectionEndPositions = [], this.seekChunkSize = 5 * 1024 * 1024, this.minReferencePointByteDistance = -1, this.reader = e._reader;
  }
  async readMetadata() {
    return this.metadataPromise ??= (async () => {
      const e = xe + 16 + 1;
      let t = this.reader.requestSlice(0, e);
      t instanceof Promise && (t = await t), g(t);
      const i = V(t, e);
      if (i[0] === 71 && i[xe] === 71)
        this.packetOffset = 0, this.packetStride = xe;
      else if (i[0] === 71 && i[xe + 16] === 71)
        this.packetOffset = 0, this.packetStride = xe + 16;
      else if (i[4] === 71 && i[4 + xe + 4] === 71)
        this.packetOffset = 4, this.packetStride = xe + 4;
      else
        throw new Error("Unreachable.");
      const n = 256;
      this.minReferencePointByteDistance = n * this.packetStride;
      let s = this.packetOffset, a = null, o = !1, c = !1;
      for (; ; ) {
        const l = await this.readPacketHeader(s);
        if (!l)
          break;
        if (l.payloadUnitStartIndicator === 0) {
          s += this.packetStride;
          continue;
        }
        if (c && !this.elementaryStreams.some((m) => m.pid === l.pid)) {
          s += this.packetStride;
          continue;
        }
        const u = await this.readSection(s, !0, !c);
        if (!u)
          break;
        const d = 3, f = 32;
        let h = !1;
        if (!c && u.pid !== 0 && !(u.payload[0] === 0 && u.payload[1] === 0 && u.payload[2] === 1)) {
          const y = new Q(u.payload), w = y.readAlignedByte();
          y.skipBits(8 * w), h = y.readBits(8) === 2;
        }
        if (u.pid === 0 && !o) {
          const m = new Q(u.payload), y = m.readAlignedByte();
          m.skipBits(8 * y), m.skipBits(14);
          const w = m.readBits(10);
          for (m.skipBits(40); 8 * (w + d) - m.pos > f; ) {
            const b = m.readBits(16);
            m.skipBits(3);
            const k = m.readBits(13);
            if (b !== 0) {
              if (a !== null)
                throw new Error("Only files with a single program are supported.");
              a = k;
            }
          }
          if (a === null)
            throw new Error("Program Association Table must link to a Program Map Table.");
          o = !0;
        } else if ((u.pid === a || h) && !c) {
          const m = new Q(u.payload), y = m.readAlignedByte();
          m.skipBits(8 * y), m.skipBits(12);
          const w = m.readBits(12);
          m.skipBits(43), m.readBits(13), m.skipBits(6);
          const b = m.readBits(10), k = m.pos + 8 * b;
          let A = !1;
          for (; m.pos < k; ) {
            const T = m.readBits(8), x = m.readBits(8), C = m.pos + 8 * x;
            if (T === Cs && x >= 4) {
              const P = m.readBits(32);
              A ||= P === Kl || P === Ql;
            }
            m.pos = C;
          }
          for (m.pos = k; 8 * (w + d) - m.pos > f; ) {
            const T = m.readBits(8);
            m.skipBits(3);
            const x = m.readBits(13);
            m.skipBits(6);
            const C = m.readBits(10), P = m.pos + 8 * C;
            let S = !1, E = !1, I = !1;
            for (; m.pos < P; ) {
              const O = m.readBits(8), D = m.readBits(8), z = m.pos + 8 * D;
              if (O === 106)
                S = !0;
              else if (O === 122 || O === 204)
                E = !0;
              else if (O === 123)
                I = !0;
              else if (O === Cs && D >= 4) {
                const j = m.readBits(32);
                I ||= (j & 4294967040) === Gl;
              }
              m.pos = z;
            }
            let _ = null;
            const F = A && Xl.has(T) ? 130 : T;
            switch (F) {
              case 27:
              case 36:
                _ = {
                  type: "video",
                  codec: T === 27 ? "avc" : "hevc",
                  decoderConfig: null,
                  avcCodecInfo: null,
                  hevcCodecInfo: null,
                  colorSpace: {
                    primaries: null,
                    transfer: null,
                    matrix: null,
                    fullRange: null
                  },
                  width: -1,
                  height: -1,
                  squarePixelWidth: -1,
                  squarePixelHeight: -1,
                  reorderSize: -1
                };
                break;
              case 3:
              case 4:
              case 15:
              case 129:
              case 135:
              case 130:
              case 138:
                {
                  let O;
                  F === 3 || F === 4 ? O = "mp3" : F === 15 ? O = "aac" : F === 129 ? O = "ac3" : F === 135 ? O = "eac3" : O = "dts", _ = {
                    type: "audio",
                    codec: O,
                    decoderConfig: null,
                    aacCodecInfo: null,
                    dtsFormat: null,
                    numberOfChannels: -1,
                    sampleRate: -1
                  };
                }
                break;
              case 6:
                E ? _ = {
                  type: "audio",
                  codec: "eac3",
                  decoderConfig: null,
                  aacCodecInfo: null,
                  dtsFormat: null,
                  numberOfChannels: -1,
                  sampleRate: -1
                } : S ? _ = {
                  type: "audio",
                  codec: "ac3",
                  decoderConfig: null,
                  aacCodecInfo: null,
                  dtsFormat: null,
                  numberOfChannels: -1,
                  sampleRate: -1
                } : I && (_ = {
                  type: "audio",
                  codec: "dts",
                  decoderConfig: null,
                  aacCodecInfo: null,
                  dtsFormat: null,
                  numberOfChannels: -1,
                  sampleRate: -1
                });
                break;
              default:
                Es.has(T) || (q._warn(`Note: MPEG-TS streams with stream_type 0x${T.toString(16)} are not currently supported.`), Es.add(T));
            }
            _ && this.elementaryStreams.push({
              demuxer: this,
              pid: x,
              streamType: T,
              initialized: !1,
              firstSection: null,
              canBeTrustedWithKeyPackets: !1,
              info: _,
              referencePesPackets: []
            });
          }
          c = !0;
        } else {
          const m = this.elementaryStreams.find((y) => y.pid === u.pid);
          e: if (m && !m.initialized) {
            const y = Lt(u, !0);
            if (!y)
              throw new Error(`Couldn't read first PES packet for Elementary Stream with PID ${m.pid}`);
            if (m.firstSection = u, m.canBeTrustedWithKeyPackets = u.randomAccessIndicator === 1, this.input._initInput) {
              const k = (await this.input._initInput._getDemuxer()).elementaryStreams.find((A) => A.pid === u.pid && A.info.codec === m.info.codec);
              if (k) {
                m.info = k.info, m.initialized = !0;
                break e;
              }
            }
            const w = new yr(m, y);
            if (m.info.type === "video") {
              for (; ; ) {
                const b = w;
                if (b.suppliedPacket = null, await w.markNextPacket(), m.info.codec === "avc") {
                  if (!w.suppliedPacket)
                    throw new Error("Invalid AVC video stream; could not extract AVCDecoderConfigurationRecord from any packet.");
                  if (m.info.avcCodecInfo = Ai(w.suppliedPacket.data), !m.info.avcCodecInfo)
                    continue;
                  const k = m.info.avcCodecInfo.sequenceParameterSets[0];
                  g(k);
                  const A = qn(k);
                  m.info.width = A.displayWidth, m.info.height = A.displayHeight;
                  const T = A.pixelAspectRatio.num, x = A.pixelAspectRatio.den;
                  T > 0 && x > 0 && (T > x ? (m.info.squarePixelWidth = Math.round(m.info.width * T / x), m.info.squarePixelHeight = m.info.height) : (m.info.squarePixelWidth = m.info.width, m.info.squarePixelHeight = Math.round(m.info.height * x / T))), m.info.colorSpace = {
                    primaries: Jr[A.colourPrimaries],
                    transfer: ei[A.transferCharacteristics],
                    matrix: ti[A.matrixCoefficients],
                    fullRange: !!A.fullRangeFlag
                  }, m.info.reorderSize = A.maxDecFrameBuffering;
                  break;
                } else if (m.info.codec === "hevc") {
                  if (!w.suppliedPacket)
                    throw new Error("Invalid HEVC video stream; could not extract HVCDecoderConfigurationRecord from first packet.");
                  if (m.info.hevcCodecInfo = Si(w.suppliedPacket.data), !m.info.hevcCodecInfo)
                    continue;
                  const A = m.info.hevcCodecInfo.arrays.find((x) => x.nalUnitType === ce.SPS_NUT).nalUnits[0];
                  g(A);
                  const T = Ua(A);
                  m.info.width = T.displayWidth, m.info.height = T.displayHeight, T.pixelAspectRatio.num > T.pixelAspectRatio.den ? (m.info.squarePixelWidth = Math.round(m.info.width * T.pixelAspectRatio.num / T.pixelAspectRatio.den), m.info.squarePixelHeight = m.info.height) : (m.info.squarePixelWidth = m.info.width, m.info.squarePixelHeight = Math.round(m.info.height * T.pixelAspectRatio.den / T.pixelAspectRatio.num)), m.info.colorSpace = {
                    primaries: Jr[T.colourPrimaries],
                    transfer: ei[T.transferCharacteristics],
                    matrix: ti[T.matrixCoefficients],
                    fullRange: !!T.fullRangeFlag
                  }, m.info.reorderSize = T.maxDecFrameBuffering;
                  break;
                } else
                  throw new Error("Unhandled.");
              }
              m.info.decoderConfig = {
                codec: Nn({
                  width: m.info.width,
                  height: m.info.height,
                  codec: m.info.codec,
                  codecDescription: null,
                  colorSpace: m.info.colorSpace,
                  avcType: 1,
                  avcCodecInfo: m.info.avcCodecInfo,
                  hevcCodecInfo: m.info.hevcCodecInfo,
                  vp9CodecInfo: null,
                  av1CodecInfo: null,
                  proresFormat: null
                }),
                codedWidth: m.info.width,
                codedHeight: m.info.height,
                colorSpace: m.info.colorSpace
              }, (m.info.width !== m.info.squarePixelWidth || m.info.height !== m.info.squarePixelHeight) && (m.info.decoderConfig.displayAspectWidth = m.info.squarePixelWidth, m.info.decoderConfig.displayAspectHeight = m.info.squarePixelHeight), m.initialized = !0;
            } else {
              if (await w.markNextPacket(), !w.suppliedPacket)
                throw new Error(`Couldn't parse first media packet for Elementary Stream with PID ${m.pid}`);
              if (m.info.codec === "aac") {
                const b = Pe.tempFromBytes(w.suppliedPacket.data), k = Ft(b);
                if (!k)
                  throw new Error("Invalid AAC audio stream; could not read ADTS frame header from first packet.");
                m.info.aacCodecInfo = {
                  isMpeg2: !1,
                  objectType: k.objectType
                }, m.info.numberOfChannels = Mr[k.channelConfiguration], m.info.sampleRate = Rt[k.samplingFrequencyIndex];
              } else if (m.info.codec === "mp3") {
                const b = R(Pe.tempFromBytes(w.suppliedPacket.data)), k = Un(b, w.suppliedPacket.data.byteLength);
                if (!k.header)
                  throw new Error("Invalid MP3 audio stream; could not read frame header from first packet.");
                m.info.numberOfChannels = Ir(k.header.channel), m.info.sampleRate = k.header.sampleRate;
              } else if (m.info.codec === "ac3") {
                const b = ja(w.suppliedPacket.data);
                if (!b)
                  throw new Error("Invalid AC-3 audio stream; could not read sync frame from first packet.");
                if (b.fscod === 3)
                  throw new Error("Invalid AC-3 audio stream; reserved sample rate code found in first packet.");
                m.info.numberOfChannels = Ln[b.acmod] + b.lfeon, m.info.sampleRate = bi[b.fscod];
              } else if (m.info.codec === "eac3") {
                const b = Qa(w.suppliedPacket.data);
                if (!b)
                  throw new Error("Invalid E-AC-3 audio stream; could not read sync frame from first packet.");
                const k = Ga(b);
                if (k === null)
                  throw new Error("Invalid E-AC-3 audio stream; reserved sample rate code found in first packet.");
                m.info.numberOfChannels = Xa(b), m.info.sampleRate = k;
              } else if (m.info.codec === "dts") {
                const b = jn(w.suppliedPacket.data);
                if (!b)
                  throw new Error("Invalid DTS audio stream; could not read frame header from first packet.");
                m.info.numberOfChannels = b.numberOfChannels, m.info.sampleRate = b.sampleRate, b.core && (m.info.dtsFormat = b.hasExtensions ? "dtsh" : "dtsc");
              } else
                throw new Error("Unhandled.");
              m.info.decoderConfig = {
                codec: Vn({
                  codec: m.info.codec,
                  codecDescription: null,
                  aacCodecInfo: m.info.aacCodecInfo,
                  dtsFormat: m.info.dtsFormat
                }),
                numberOfChannels: m.info.numberOfChannels,
                sampleRate: m.info.sampleRate
              }, m.initialized = !0;
            }
          }
        }
        if (c && this.elementaryStreams.every((m) => m.initialized))
          break;
        s += this.packetStride;
      }
      if (!c)
        throw o ? new Error("No Program Map Table found in the file.") : new Error("No Program Association Table found in the file.");
      for (const l of this.elementaryStreams)
        l.initialized && (l.info.type === "video" ? this.trackBackingEntries.push(new Yl(l)) : this.trackBackingEntries.push(new Zl(l)));
    })();
  }
  async getTrackBackings() {
    return await this.readMetadata(), this.trackBackingEntries;
  }
  async getMetadataTags() {
    return {};
  }
  async getMimeType() {
    await this.readMetadata();
    const e = await Promise.all(this.trackBackingEntries.map((t) => t.getDecoderConfig().then((i) => i?.codec ?? null)));
    return jl(e);
  }
  async readSection(e, t, i = !1) {
    let n = e, s = e;
    const a = [];
    let o = 0, c = null, l = !0, u = 0;
    for (; ; ) {
      const f = await this.readPacket(s);
      if (s += this.packetStride, !f)
        break;
      if (c) {
        if (f.pid !== c.pid) {
          if (i)
            break;
          continue;
        }
        if (f.payloadUnitStartIndicator === 1)
          break;
      } else {
        if (f.payloadUnitStartIndicator === 0)
          break;
        c = f;
      }
      const h = !!(f.adaptationFieldControl & 2), p = !!(f.adaptationFieldControl & 1);
      let m = 0;
      if (h && (m = 1 + f.body[0], f === c && m > 1 && (u = f.body[1] >> 6 & 1)), p && (m === 0 ? (a.push(f.body), o += f.body.byteLength) : (a.push(f.body.subarray(m)), o += f.body.byteLength - m)), n = s, !t && o >= 64) {
        l = !1;
        break;
      }
      if (Rr(this.sectionEndPositions, n, (w) => w) !== -1) {
        l = !1;
        break;
      }
    }
    if (l) {
      const f = G(this.sectionEndPositions, n, (h) => h);
      this.sectionEndPositions.splice(f + 1, 0, n);
    }
    if (!c)
      return null;
    let d;
    if (a.length === 1)
      d = a[0];
    else {
      const f = a.reduce((p, m) => p + m.length, 0);
      d = new Uint8Array(f);
      let h = 0;
      for (const p of a)
        d.set(p, h), h += p.length;
    }
    return {
      startPos: e,
      endPos: t ? n : null,
      pid: c.pid,
      payload: d,
      randomAccessIndicator: u
    };
  }
  async readPacketHeader(e) {
    let t = this.reader.requestSlice(e, 4);
    if (t instanceof Promise && (t = await t), !t)
      return null;
    if (N(t) !== 71)
      throw new Error("Invalid TS packet sync byte. Likely an internal bug, please report this file.");
    const n = se(t), s = n >> 14 & 1, a = n & 8191, c = N(t) >> 4 & 3;
    return {
      payloadUnitStartIndicator: s,
      pid: a,
      adaptationFieldControl: c
    };
  }
  async readPacket(e) {
    let t = this.reader.requestSlice(e, xe);
    if (t instanceof Promise && (t = await t), !t)
      return null;
    const i = V(t, xe);
    if (i[0] !== 71)
      throw new Error("Invalid TS packet sync byte. Likely an internal bug, please report this file.");
    const s = (i[1] << 8) + i[2], a = s >> 14 & 1, o = s & 8191, l = i[3] >> 4 & 3;
    return {
      payloadUnitStartIndicator: a,
      pid: o,
      adaptationFieldControl: l,
      body: i.subarray(4)
    };
  }
}
const Tt = (r, e) => {
  if (r.payload.byteLength < 3)
    return null;
  const t = new Q(r.payload);
  if (t.readBits(24) !== 1)
    return null;
  const n = t.readBits(8);
  if (t.skipBits(16), n === 188 || n === 190 || n === 191 || n === 240 || n === 241 || n === 255 || n === 242 || n === 248)
    return null;
  t.skipBits(8);
  const s = t.readBits(2);
  t.skipBits(14);
  let a = null;
  if (s === 2 || s === 3)
    a = 0, t.skipBits(4), a += t.readBits(3) * (1 << 30), t.skipBits(1), a += t.readBits(15) * 32768, t.skipBits(1), a += t.readBits(15);
  else if (e)
    throw new Error(go);
  return {
    sectionStartPos: r.startPos,
    sectionEndPos: r.endPos,
    pts: a,
    randomAccessIndicator: r.randomAccessIndicator
  };
}, Lt = (r, e) => {
  g(r.endPos !== null);
  const t = Tt(r, e);
  if (!t)
    return null;
  const i = new Q(r.payload);
  i.skipBits(32);
  const n = i.readBits(16), s = 6;
  i.skipBits(16);
  const a = i.readBits(8), o = i.pos + 8 * a;
  i.pos = o;
  const c = o / 8;
  g(Number.isInteger(c));
  const l = r.payload.subarray(
    c,
    // "A value of 0 indicates that the PES packet length is neither specified nor bounded and is allowed only in
    // PES packets whose payload consists of bytes from a video elementary stream contained in
    // transport stream packets."
    n > 0 ? s + n : r.payload.byteLength
  );
  return {
    ...t,
    data: l
  };
};
class Pi {
  constructor(e) {
    this.elementaryStream = e, this.packetBuffers = /* @__PURE__ */ new WeakMap(), this.packetSectionStarts = /* @__PURE__ */ new WeakMap();
  }
  getId() {
    return this.elementaryStream.pid;
  }
  getNumber() {
    const e = this.elementaryStream.demuxer, t = this.elementaryStream.info.type;
    let i = 0;
    for (const n of e.trackBackingEntries)
      if (n.getType() === t && i++, g(n instanceof Pi), n.elementaryStream === this.elementaryStream)
        break;
    return i;
  }
  getCodec() {
    throw new Error("Not implemented on base class.");
  }
  getInternalCodecId() {
    return this.elementaryStream.streamType;
  }
  getName() {
    return null;
  }
  getLanguageCode() {
    return ge;
  }
  getDisposition() {
    return {
      ...ct,
      primary: !1
    };
  }
  getTimeResolution() {
    return je;
  }
  isRelativeToUnixEpoch() {
    return !1;
  }
  getUnixTimeForTimestamp() {
    return null;
  }
  getPairingMask() {
    return 1n;
  }
  getBitrate() {
    return null;
  }
  getAverageBitrate() {
    return null;
  }
  async getDurationFromMetadata() {
    return null;
  }
  async getLiveRefreshInterval() {
    return null;
  }
  createEncodedPacket(e, t, i) {
    let n;
    return this.allPacketsAreKeyPackets() ? n = "key" : n = e.randomAccessIndicator === 1 ? "key" : "delta", new Y(i.metadataOnly ? Ie : e.data, n, e.pts / je, Math.max(t / je, 0), e.sequenceNumber, e.data.byteLength);
  }
  async getFirstPacket(e) {
    const t = this.elementaryStream.firstSection;
    g(t);
    const i = Lt(t, !0);
    g(i);
    const n = new yr(this.elementaryStream, i), s = new qi(this, n), a = await s.readNext();
    if (!a)
      return null;
    const o = this.createEncodedPacket(a.packet, a.duration, e);
    return this.packetBuffers.set(o, s), this.packetSectionStarts.set(o, a.packet.sectionStartPos), o;
  }
  async getNextPacket(e, t) {
    let i = this.packetBuffers.get(e);
    if (i) {
      const u = await i.readNext();
      if (!u)
        return null;
      this.packetBuffers.delete(e);
      const d = this.createEncodedPacket(u.packet, u.duration, t);
      return this.packetBuffers.set(d, i), this.packetSectionStarts.set(d, u.packet.sectionStartPos), d;
    }
    const n = this.packetSectionStarts.get(e);
    if (n === void 0)
      throw new Error("Packet was not created from this track.");
    const a = await this.elementaryStream.demuxer.readSection(n, !0);
    g(a);
    const o = Lt(a, !0);
    g(o);
    const c = new yr(this.elementaryStream, o);
    i = new qi(this, c);
    const l = e.sequenceNumber;
    for (; ; ) {
      const u = await i.readNext();
      if (!u)
        return null;
      if (u.packet.sequenceNumber > l) {
        const d = this.createEncodedPacket(u.packet, u.duration, t);
        return this.packetBuffers.set(d, i), this.packetSectionStarts.set(d, u.packet.sectionStartPos), d;
      }
    }
  }
  async getNextKeyPacket(e, t) {
    let i = e;
    for (; ; ) {
      if (i = await this.getNextPacket(i, t), !i)
        return null;
      if (i.type === "key")
        return i;
    }
  }
  getPacket(e, t) {
    return this.doPacketLookup(e, !1, t);
  }
  getKeyPacket(e, t) {
    return this.doPacketLookup(e, !0, t);
  }
  /**
   * Searches for the packet with the largest timestamp not larger than `timestamp` in the file, using a combination
   * of chunk-based binary search and linear refinement. The reason the coarse search is done in large chunks is to
   * make it more performant for small files and over high-latency readers such as the network.
   */
  async doPacketLookup(e, t, i) {
    const n = xr(e * je), s = this.elementaryStream.demuxer, { reader: a, seekChunkSize: o } = s, c = this.elementaryStream.pid, l = async (A, T, x) => {
      let C = A;
      for (; C < T; ) {
        const P = await s.readPacketHeader(C);
        if (!P)
          return null;
        if (P.pid === c && P.payloadUnitStartIndicator === 1) {
          const S = await s.readSection(C, x);
          if (!S)
            return null;
          const E = Tt(S, !1);
          if (E && E.pts !== null)
            return {
              pesPacketHeader: E,
              section: S
            };
        }
        C += s.packetStride;
      }
      return null;
    }, u = this.elementaryStream.firstSection;
    g(u);
    const d = Tt(u, !0);
    if (g(d), n < d.pts)
      return null;
    let f;
    const h = this.elementaryStream.referencePesPackets, p = G(h, n, (A) => A.pts), m = p !== -1 ? h[p] : null;
    if (m && n - m.pts < je / 2)
      f = m.sectionStartPos;
    else {
      let A = 0;
      if (a.fileSize !== null) {
        const T = Math.ceil(a.fileSize / o);
        if (T > 1) {
          let x = 0, C = T - 1;
          for (A = x; x <= C; ) {
            const P = Math.floor((x + C) / 2), S = vi(P * o, s.packetStride) + d.sectionStartPos, E = S + o, I = await l(S, E, !1);
            if (!I) {
              C = P - 1;
              continue;
            }
            I.pesPacketHeader.pts <= n ? (A = P, x = P + 1) : C = P - 1;
          }
        }
      }
      f = vi(A * o, s.packetStride) + d.sectionStartPos;
    }
    let w = (await l(f, a.fileSize ?? 1 / 0, !1))?.pesPacketHeader ?? null;
    w || (w = d);
    const b = this.getReorderSize(), k = async (A, T) => {
      const x = await s.readSection(A, !0);
      g(x);
      const C = Lt(x, !0);
      g(C);
      const P = new yr(this.elementaryStream, C), S = new qi(this, P);
      for (; !((te(S.presentationOrderPackets)?.pts ?? -1 / 0) >= n || !await S.readNextPacket()); )
        ;
      const E = Rn(S.presentationOrderPackets, T);
      if (E === -1)
        return null;
      const I = S.presentationOrderPackets[E], _ = E === 0 ? 0 : I.pts - S.presentationOrderPackets[E - 1].pts;
      for (; S.decodeOrderPackets[0] !== I; )
        S.decodeOrderPackets.shift();
      S.lastDuration = _;
      const F = await S.readNext();
      g(F);
      const O = this.createEncodedPacket(F.packet, F.duration, i);
      return this.packetBuffers.set(O, S), this.packetSectionStarts.set(O, F.packet.sectionStartPos), O;
    };
    if (!t || this.allPacketsAreKeyPackets()) {
      e: for (; ; ) {
        let A = w.sectionStartPos + s.packetStride;
        for (; ; ) {
          const T = await s.readPacketHeader(A);
          if (!T)
            break e;
          if (T.pid === c && T.payloadUnitStartIndicator === 1) {
            const x = await s.readSection(A, !1);
            if (x) {
              const C = Tt(x, !1);
              if (C && C.pts !== null) {
                if (C.pts > n)
                  break e;
                w = C, kn(this.elementaryStream, w);
                break;
              }
            }
          }
          A += s.packetStride;
        }
      }
      e: for (let A = 0; A < b + 1; A++) {
        let T = w.sectionStartPos - s.packetStride;
        for (; T >= s.packetOffset; ) {
          const x = await s.readPacketHeader(T);
          if (!x)
            break e;
          if (x.pid === c && x.payloadUnitStartIndicator === 1) {
            const C = await s.readSection(T, !1);
            if (C) {
              const P = Tt(C, !1);
              if (P && P.pts !== null) {
                w = P;
                break;
              }
            }
          }
          T -= s.packetStride;
        }
      }
      return k(w.sectionStartPos, (A) => A.pts <= n);
    } else {
      let A = f, T = null;
      const x = !this.elementaryStream.canBeTrustedWithKeyPackets;
      for (; ; ) {
        let C = null;
        const P = A <= d.sectionStartPos;
        let S, E = null;
        if (P)
          S = d, E = u;
        else {
          const F = await l(A, a.fileSize ?? 1 / 0, x);
          S = F?.pesPacketHeader ?? null, E = F?.section ?? null;
        }
        let I = !1, _ = 0;
        e: for (; S && !(T !== null && S.sectionStartPos >= T); ) {
          if (S.pts <= n) {
            let O;
            if (this.elementaryStream.canBeTrustedWithKeyPackets)
              O = S.randomAccessIndicator === 1;
            else {
              g(E);
              const D = Lt(E, !0);
              g(D);
              const z = new yr(this.elementaryStream, D);
              await z.markNextPacket(), O = z.suppliedPacket?.randomAccessIndicator === 1;
            }
            O && (C = S);
          }
          if (S.pts > n && (I = !0), I && (_++, _ > b))
            break;
          let F = S.sectionStartPos + s.packetStride;
          for (; ; ) {
            const O = await s.readPacketHeader(F);
            if (!O)
              break e;
            if (O.pid === c && O.payloadUnitStartIndicator === 1) {
              const D = await s.readSection(F, x);
              if (D) {
                const z = Tt(D, !1);
                if (z && z.pts !== null) {
                  S = z, E = D, kn(this.elementaryStream, S);
                  break;
                }
              }
            }
            F += s.packetStride;
          }
        }
        if (C) {
          let F = C;
          if (_ === 0)
            e: for (let D = 0; D < b; D++) {
              let z = F.sectionStartPos - s.packetStride;
              for (; z >= s.packetOffset; ) {
                const j = await s.readPacketHeader(z);
                if (!j)
                  break e;
                if (j.pid === c && j.payloadUnitStartIndicator === 1) {
                  const Z = await s.readSection(z, x);
                  if (Z) {
                    const le = Tt(Z, !1);
                    if (le && le.pts !== null) {
                      F = le;
                      break;
                    }
                  }
                }
                z -= s.packetStride;
              }
            }
          const O = await k(F.sectionStartPos, (D) => D.pts <= n && D.randomAccessIndicator === 1);
          return g(O), O;
        }
        if (P)
          return null;
        T = A, A = Math.max(vi(A - d.sectionStartPos - o, s.packetStride) + d.sectionStartPos, d.sectionStartPos);
      }
    }
  }
}
class Yl extends Pi {
  getType() {
    return "video";
  }
  getCodec() {
    return this.elementaryStream.info.codec;
  }
  getCodedWidth() {
    return this.elementaryStream.info.width;
  }
  getCodedHeight() {
    return this.elementaryStream.info.height;
  }
  getSquarePixelWidth() {
    return this.elementaryStream.info.squarePixelWidth;
  }
  getSquarePixelHeight() {
    return this.elementaryStream.info.squarePixelHeight;
  }
  getRotation() {
    return 0;
  }
  async getColorSpace() {
    return this.elementaryStream.info.colorSpace;
  }
  async canBeTransparent() {
    return !1;
  }
  async getDecoderConfig() {
    return g(this.elementaryStream.info.decoderConfig), this.elementaryStream.info.decoderConfig;
  }
  allPacketsAreKeyPackets() {
    return !1;
  }
  getReorderSize() {
    return this.elementaryStream.info.reorderSize;
  }
}
class Zl extends Pi {
  getType() {
    return "audio";
  }
  getCodec() {
    return this.elementaryStream.info.codec;
  }
  getNumberOfChannels() {
    return this.elementaryStream.info.numberOfChannels;
  }
  getSampleRate() {
    return this.elementaryStream.info.sampleRate;
  }
  async getDecoderConfig() {
    return g(this.elementaryStream.info.decoderConfig), this.elementaryStream.info.decoderConfig;
  }
  allPacketsAreKeyPackets() {
    return !0;
  }
  getReorderSize() {
    return 0;
  }
}
const kn = (r, e) => {
  const t = r.referencePesPackets, i = G(t, e.sectionStartPos, (n) => n.sectionStartPos);
  if (i >= 0) {
    const n = t[i];
    if (e.pts <= n.pts)
      return !1;
    const s = r.demuxer.minReferencePointByteDistance;
    if (e.sectionStartPos - n.sectionStartPos < s)
      return !1;
    if (i < t.length - 1) {
      const a = t[i + 1];
      if (a.pts < e.pts || a.sectionStartPos - e.sectionStartPos < s)
        return !1;
    }
  }
  return t.splice(i + 1, 0, e), !0;
};
class yr {
  constructor(e, t) {
    this.currentPos = 0, this.pesPackets = [], this.currentPesPacketIndex = 0, this.currentPesPacketPos = 0, this.endPos = 0, this.lastSuppliedPesPacket = null, this.nextPts = null, this.suppliedPacket = null, this.elementaryStream = e, this.pid = e.pid, this.demuxer = e.demuxer, this.startingPesPacket = t;
  }
  ensureBuffered(e) {
    const t = this.endPos - this.currentPos;
    return t >= e ? e : this.bufferData(e - t).then(() => Math.min(this.endPos - this.currentPos, e));
  }
  getCurrentPesPacket() {
    const e = this.pesPackets[this.currentPesPacketIndex];
    return g(e), e;
  }
  async bufferData(e) {
    const t = this.endPos + e;
    for (; this.endPos < t; ) {
      let i;
      if (this.pesPackets.length === 0)
        i = this.startingPesPacket;
      else {
        let n = te(this.pesPackets).sectionEndPos;
        for (g(n !== null); ; ) {
          const s = await this.demuxer.readPacketHeader(n);
          if (!s)
            return;
          if (s.pid === this.pid) {
            const a = await this.demuxer.readSection(n, !0);
            if (!a)
              return;
            const o = Lt(a, !1);
            if (o) {
              i = o;
              break;
            }
          }
          n += this.demuxer.packetStride;
        }
      }
      this.pesPackets.push(i), this.endPos += i.data.byteLength;
    }
  }
  readBytes(e) {
    const t = this.getCurrentPesPacket(), i = this.currentPos - this.currentPesPacketPos, n = i + e;
    if (this.currentPos += e, n <= t.data.byteLength)
      return t.data.subarray(i, n);
    const s = new Uint8Array(e);
    s.set(t.data.subarray(i));
    let a = t.data.byteLength - i;
    for (; ; ) {
      this.advanceCurrentPacket();
      const o = this.getCurrentPesPacket(), c = e - a;
      if (c <= o.data.byteLength) {
        s.set(o.data.subarray(0, c), a);
        break;
      }
      s.set(o.data, a), a += o.data.byteLength;
    }
    return s;
  }
  readU8() {
    let e = this.getCurrentPesPacket();
    const t = this.currentPos - this.currentPesPacketPos;
    return this.currentPos++, t < e.data.byteLength ? e.data[t] : (this.advanceCurrentPacket(), e = this.getCurrentPesPacket(), e.data[0]);
  }
  seekTo(e) {
    if (e !== this.currentPos) {
      if (e < this.currentPos)
        for (; e < this.currentPesPacketPos; ) {
          this.currentPesPacketIndex--;
          const t = this.getCurrentPesPacket();
          this.currentPesPacketPos -= t.data.byteLength;
        }
      else
        for (; ; ) {
          const t = this.getCurrentPesPacket(), i = this.currentPesPacketPos + t.data.byteLength;
          if (e < i)
            break;
          this.currentPesPacketPos += t.data.byteLength, this.currentPesPacketIndex++;
        }
      this.currentPos = e;
    }
  }
  skip(e) {
    this.seekTo(this.currentPos + e);
  }
  advanceCurrentPacket() {
    this.currentPesPacketPos += this.getCurrentPesPacket().data.byteLength, this.currentPesPacketIndex++;
  }
  async markNextPacket() {
    g(!this.suppliedPacket);
    const e = this.elementaryStream;
    if (e.info.type === "video") {
      const t = e.info.codec, i = 1024;
      if (t !== "avc" && t !== "hevc")
        throw new Error("Unhandled.");
      const n = t === "avc" ? 1 : 2;
      let s = null, a = !1, o = 0;
      for (; ; ) {
        let c = this.ensureBuffered(i);
        if (c instanceof Promise && (c = await c), c === 0)
          break;
        const l = this.currentPos, u = this.readBytes(c), d = u.byteLength;
        let f = 0;
        for (; f < d; ) {
          const h = u.indexOf(0, f);
          if (h === -1 || h >= d)
            break;
          f = h;
          const p = l + f;
          if (f + 3 >= d) {
            this.seekTo(p);
            break;
          }
          const m = u[f + 1], y = u[f + 2], w = u[f + 3];
          let b = 0;
          if (m === 0 && y === 0 && w === 1 ? b = 4 : m === 0 && y === 1 && (b = 3), b === 0) {
            f++;
            continue;
          }
          const k = p;
          s ??= k;
          const A = f + b, T = A + n, x = 6;
          if (T + (t === "avc" ? x : 1) > d) {
            this.seekTo(p);
            break;
          }
          const P = u[A];
          let S, E, I;
          if (t === "avc")
            S = ki(P), E = S === de.NON_IDR_SLICE || S === de.SLICE_DPA || S === de.IDR, I = S === de.SEI || S === de.SPS || S === de.PPS || S === de.AUD;
          else {
            if (S = Yt(P), ((P & 1) << 5 | u[A + 1] >> 3) > 0) {
              f += b;
              continue;
            }
            E = S <= ce.RASL_R || S >= ce.BLA_W_LP && S <= 21, I = S >= ce.VPS_NUT && S <= 37 || S === ce.PREFIX_SEI_NUT || S >= 41 && S <= 44 || S >= 48 && S <= 55;
          }
          let _ = !1;
          if (E) {
            let F;
            if (t === "avc") {
              const O = u.subarray(T, T + x), D = M(new Q(O));
              F = !a || D <= o, o = D;
            } else
              F = u[T] >> 7 === 1;
            F && (a ? _ = !0 : a = !0);
          } else I && a && (_ = !0);
          if (_) {
            const F = k - s;
            return this.seekTo(s), this.supplyPacket(F, 0);
          }
          f += b;
        }
        if (c < i)
          break;
      }
      if (s !== null && this.endPos > s) {
        const c = this.endPos - s;
        return this.seekTo(s), this.supplyPacket(c, 0);
      }
    } else {
      const t = e.info.codec, i = 128;
      for (; ; ) {
        let n = this.ensureBuffered(i);
        n instanceof Promise && (n = await n);
        const s = this.currentPos;
        for (; this.currentPos - s < n; ) {
          const a = this.readU8();
          if (t === "aac") {
            if (a !== 255)
              continue;
            this.skip(-1);
            const o = this.currentPos;
            let c = this.ensureBuffered(vt);
            if (c instanceof Promise && (c = await c), c < vt)
              return;
            const l = this.readBytes(vt), u = Ft(Pe.tempFromBytes(l));
            if (u) {
              this.seekTo(o);
              let d = this.ensureBuffered(u.frameLength);
              return d instanceof Promise && (d = await d), this.supplyPacket(d, Math.round(di * je / e.info.sampleRate));
            } else
              this.seekTo(o + 1);
          } else if (t === "mp3") {
            if (a !== 255)
              continue;
            this.skip(-1);
            const o = this.currentPos;
            let c = this.ensureBuffered(_t);
            if (c instanceof Promise && (c = await c), c < _t)
              return;
            const l = this.readBytes(_t), u = K(l).getUint32(0), d = Un(u, null);
            if (d.header) {
              this.seekTo(o);
              let f = this.ensureBuffered(d.header.totalSize);
              f instanceof Promise && (f = await f);
              const h = d.header.audioSamplesInFrame * je / e.info.sampleRate;
              return this.supplyPacket(f, Math.round(h));
            } else
              this.seekTo(o + 1);
          } else if (t === "ac3") {
            if (a !== 11)
              continue;
            this.skip(-1);
            const o = this.currentPos;
            let c = this.ensureBuffered(5);
            if (c instanceof Promise && (c = await c), c < 5)
              return;
            const l = this.readBytes(5);
            if (l[0] !== 11 || l[1] !== 119) {
              this.seekTo(o + 1);
              continue;
            }
            const u = l[4] >> 6, d = l[4] & 63;
            if (u === 3 || d > 37) {
              this.seekTo(o + 1);
              continue;
            }
            const f = jc[3 * d + u];
            g(f !== void 0), this.seekTo(o), c = this.ensureBuffered(f), c instanceof Promise && (c = await c);
            const h = Math.round(Kc * je / e.info.sampleRate);
            return this.supplyPacket(c, h);
          } else if (t === "eac3") {
            if (a !== 11)
              continue;
            this.skip(-1);
            const o = this.currentPos;
            let c = this.ensureBuffered(5);
            if (c instanceof Promise && (c = await c), c < 5)
              return;
            const l = this.readBytes(5);
            if (l[0] !== 11 || l[1] !== 119) {
              this.seekTo(o + 1);
              continue;
            }
            const d = (((l[2] & 7) << 8 | l[3]) + 1) * 2, h = l[4] >> 6 === 3 ? 3 : l[4] >> 4 & 3, p = Ka[h];
            this.seekTo(o), c = this.ensureBuffered(d), c instanceof Promise && (c = await c);
            const m = p * 256, y = Math.round(m * je / e.info.sampleRate);
            return this.supplyPacket(c, y);
          } else if (t === "dts") {
            if (a !== 127 && a !== 100)
              continue;
            this.skip(-1);
            const o = this.currentPos;
            let c = this.ensureBuffered(Qr);
            if (c instanceof Promise && (c = await c), c < Qr)
              return;
            const l = this.readBytes(Qr), u = Za(l);
            let d = u ? null : Gr(l);
            if (!u && !d) {
              this.seekTo(o + 1);
              continue;
            }
            if (d && !d.asset) {
              this.seekTo(o);
              const m = Math.min(d.frameSize, Xc);
              let y = this.ensureBuffered(m);
              y instanceof Promise && (y = await y), d = Gr(this.readBytes(y)) ?? d;
            }
            let f = u ? u.frameSize : d.frameSize;
            if (u) {
              let m = Math.ceil(u.frameSize / 4) * 4;
              for (; ; ) {
                this.seekTo(o);
                const y = m + pn;
                let w = this.ensureBuffered(y);
                if (w instanceof Promise && (w = await w), w < y)
                  break;
                this.seekTo(o + m);
                const b = Gr(this.readBytes(pn));
                if (!b)
                  break;
                m += b.frameSize, f = m;
              }
            }
            const h = u?.sampleCount ?? d.asset?.sampleCount;
            if (h === void 0) {
              this.seekTo(o + 1);
              continue;
            }
            this.seekTo(o), c = this.ensureBuffered(f), c instanceof Promise && (c = await c);
            const p = Math.round(h * je / e.info.sampleRate);
            return this.supplyPacket(c, p);
          } else
            throw new Error("Unhandled.");
        }
        if (n < i)
          break;
      }
    }
  }
  /** Supplies the context with a new encoded packet, beginning at the current position. */
  supplyPacket(e, t) {
    const i = this.getCurrentPesPacket();
    let n;
    if (this.lastSuppliedPesPacket === i)
      g(this.nextPts !== null), n = this.nextPts;
    else {
      if (i.pts === null)
        throw new Error(go);
      n = i.pts, kn(this.elementaryStream, i);
    }
    this.lastSuppliedPesPacket = i, this.nextPts = n + t;
    const s = i.sectionStartPos, a = s + (this.currentPos - this.currentPesPacketPos), o = this.readBytes(e);
    let c = i.randomAccessIndicator;
    if (c === 0 && !this.elementaryStream.canBeTrustedWithKeyPackets) {
      if (this.elementaryStream.info.type === "audio")
        c = 1;
      else if (this.elementaryStream.info.decoderConfig) {
        const l = xi(this.elementaryStream.info.codec, this.elementaryStream.info.decoderConfig, o) === "key";
        c = Number(l);
      }
    }
    this.suppliedPacket = {
      pts: n,
      data: o,
      sequenceNumber: a,
      sectionStartPos: s,
      randomAccessIndicator: c
    }, this.pesPackets.splice(0, this.currentPesPacketIndex), this.currentPesPacketIndex = 0;
  }
}
class qi {
  constructor(e, t) {
    this.decodeOrderPackets = [], this.reorderBuffer = [], this.presentationOrderPackets = [], this.reachedEnd = !1, this.lastDuration = 0, this.backing = e, this.context = t, this.reorderSize = e.getReorderSize(), g(this.reorderSize >= 0);
  }
  async readNext() {
    if (this.decodeOrderPackets.length === 0 && !await this.readNextPacket())
      return null;
    await this.ensureCurrentPacketHasNext();
    const e = this.decodeOrderPackets[0], t = this.presentationOrderPackets.indexOf(e);
    g(t !== -1);
    let i;
    for (t === this.presentationOrderPackets.length - 1 ? i = this.lastDuration : (i = this.presentationOrderPackets[t + 1].pts - e.pts, this.lastDuration = i), this.decodeOrderPackets.shift(); this.presentationOrderPackets.length > 0; ) {
      const n = this.presentationOrderPackets[0];
      if (this.decodeOrderPackets.includes(n))
        break;
      this.presentationOrderPackets.shift();
    }
    return { packet: e, duration: i };
  }
  async readNextPacket() {
    if (this.reachedEnd)
      return !1;
    let e;
    return this.context.suppliedPacket ? e = this.context.suppliedPacket : (await this.context.markNextPacket(), e = this.context.suppliedPacket), this.context.suppliedPacket = null, e ? (this.decodeOrderPackets.push(e), this.processPacketThroughReorderBuffer(e), !0) : (this.reachedEnd = !0, this.flushReorderBuffer(), !1);
  }
  async ensureCurrentPacketHasNext() {
    const e = this.decodeOrderPackets[0];
    for (g(e); ; ) {
      const t = this.presentationOrderPackets.indexOf(e);
      if (t !== -1 && t <= this.presentationOrderPackets.length - 2 || !await this.readNextPacket())
        break;
    }
  }
  processPacketThroughReorderBuffer(e) {
    if (this.reorderBuffer.push(e), this.reorderBuffer.length > this.reorderSize) {
      let t = 0;
      for (let n = 1; n < this.reorderBuffer.length; n++)
        this.reorderBuffer[n].pts < this.reorderBuffer[t].pts && (t = n);
      const i = this.reorderBuffer[t];
      this.presentationOrderPackets.push(i), this.reorderBuffer.splice(t, 1);
    }
  }
  flushReorderBuffer() {
    this.reorderBuffer.sort((e, t) => e.pts - t.pts), this.presentationOrderPackets.push(...this.reorderBuffer), this.reorderBuffer.length = 0;
  }
}
const yo = "application/vnd.apple.mpegurl", Is = "#EXT-X-STREAM-INF:", _s = "#EXT-X-I-FRAME-STREAM-INF:", vs = "#EXT-X-MEDIA:", Tn = "#EXTINF:", Bs = "#EXT-X-MAP:", Rs = "#EXT-X-KEY:", Fs = "#EXT-X-MEDIA-SEQUENCE:", Ms = "#EXT-X-BYTERANGE:", zs = "#EXT-X-PROGRAM-DATE-TIME:", Jl = "#EXT-X-DISCONTINUITY", Os = "#EXT-X-TARGETDURATION:", eu = "#EXT-X-ENDLIST", Ds = "#EXT-X-PLAYLIST-TYPE:", tu = "#EXT-X-I-FRAMES-ONLY", wo = (r) => r.length === 0 || r.startsWith("#") && !r.startsWith("#EXT");
class Tr {
  constructor(e) {
    this._attributes = {};
    let t = "", i = "", n = !1, s = !1;
    for (let a = 0; a < e.length; a++) {
      const o = e[a];
      o === '"' ? s = !s : o === "=" && !n && !s ? n = !0 : o === "," && !s ? (t && (this._attributes[t.trim().toLowerCase()] = i), t = "", i = "", n = !1) : n ? i += o : t += o;
    }
    t && (this._attributes[t.trim().toLowerCase()] = i);
  }
  get(e) {
    return this._attributes[e.toLowerCase()] ?? null;
  }
  getAsNumber(e) {
    const t = this.get(e);
    if (t === null)
      return null;
    const i = Number(t);
    return Number.isFinite(i) ? i : null;
  }
  merge(e) {
    Object.assign(this._attributes, e._attributes);
  }
}
class ru {
  constructor(e, t, i) {
    this.nextInputCacheAge = 0, this.inputCache = [], this.trackBackingsPromise = null, this.firstSegment = null, this.firstSegmentFirstTimestamps = /* @__PURE__ */ new WeakMap(), this.firstTimestampCache = /* @__PURE__ */ new WeakMap(), this.input = e, this.path = t, this.trackDeclarations = i;
  }
  async getDurationFromMetadata(e) {
    const t = await this.getSegmentAt(1 / 0, {
      skipLiveWait: e.skipLiveWait
    });
    return t ? t.timestamp + t.duration : null;
  }
  async getUnixTimeForTimestamp(e) {
    let t = await this.getSegmentAt(e, {});
    if (t ??= await this.getFirstSegment({}), !t || t.unixEpochTimestamp === null)
      return null;
    const i = e - t.timestamp;
    return t.unixEpochTimestamp + i;
  }
  async getTrackBackings() {
    return this.trackBackingsPromise ??= (async () => {
      const e = [];
      if (this.trackDeclarations) {
        for (const t of this.trackDeclarations)
          if (t.type === "video") {
            const i = pr(e, (n) => n.getType() === "video") + 1;
            e.push(new Ns(this, t, i));
          } else if (t.type === "audio") {
            const i = pr(e, (n) => n.getType() === "audio") + 1;
            e.push(new Vs(this, t, i));
          }
      } else {
        if (this.firstSegment = await this.getFirstSegment({}), !this.firstSegment)
          return [];
        const i = await this.getInputForSegment(this.firstSegment).getTracks();
        for (const n of i)
          if (n.type === "video") {
            const s = pr(e, (a) => a.getType() === "video") + 1;
            e.push(new Ns(this, {
              id: e.length + 1,
              type: "video"
            }, s));
          } else if (n.type === "audio") {
            const s = pr(e, (a) => a.getType() === "audio") + 1;
            e.push(new Vs(this, {
              id: e.length + 1,
              type: "audio"
            }, s));
          }
      }
      return e;
    })();
  }
  // This operation is done a lot and can be semi-expensive, so it's good to have a cache for it
  async getFirstTimestampForInput(e) {
    const t = this.firstTimestampCache.get(e);
    if (t !== void 0)
      return t;
    const i = await e.getFirstTimestamp();
    return this.firstTimestampCache.set(e, i), i;
  }
  async getMediaOffset(e, t) {
    const i = e.firstSegment ?? e;
    let n;
    if (this.firstSegmentFirstTimestamps.has(i))
      n = this.firstSegmentFirstTimestamps.get(i);
    else {
      const l = this.getInputForSegment(i);
      n = await this.getFirstTimestampForInput(l), this.firstSegmentFirstTimestamps.set(i, n);
    }
    if (i === e)
      return i.timestamp - n;
    const s = await this.getFirstTimestampForInput(t), a = e.timestamp - i.timestamp, c = s - n - a;
    return Math.abs(c) <= Math.min(0.25, a) ? i.timestamp - n : e.timestamp - s;
  }
  dispose() {
    for (const e of this.inputCache)
      e.input.dispose();
    this.inputCache.length = 0;
  }
}
class bo {
  constructor(e, t, i) {
    this.packetInfos = /* @__PURE__ */ new WeakMap(), this.hydrationPromise = null, this.firstInputTrack = null, this.firstSegment = null, this.segmentedInput = e, this.decl = t, this.number = i;
  }
  hydrate() {
    return this.hydrationPromise ??= (async () => {
      if (this.segmentedInput.firstSegment ??= await this.segmentedInput.getFirstSegment({}), !this.segmentedInput.firstSegment)
        throw new Error("Missing first segment, can't retrieve track.");
      let e = this.segmentedInput.firstSegment, t = null;
      for (; e && (t = (await this.segmentedInput.getInputForSegment(e).getTracks()).find((s) => s.type === this.decl.type && s.number === this.number) ?? null, !t); )
        e = await this.segmentedInput.getNextSegment(e, {});
      if (!t)
        throw new Error("No matching track found in underlying media data.");
      this.firstInputTrack = t, this.firstSegment = e;
    })();
  }
  getId() {
    return this.decl.id;
  }
  getType() {
    return this.decl.type;
  }
  getNumber() {
    return this.number;
  }
  /** If the backing track is already present, delegate synchronously; otherwise, hydrate first. */
  delegate(e) {
    return this.firstInputTrack ? e() : this.hydrate().then(e);
  }
  async getDecoderConfig() {
    return this.delegate(() => this.firstInputTrack._backing.getDecoderConfig());
  }
  getHasOnlyKeyPackets() {
    return this.delegate(() => this.firstInputTrack._backing.getHasOnlyKeyPackets?.() ?? null);
  }
  getPairingMask() {
    return 1n;
  }
  getCodec() {
    return this.delegate(() => this.firstInputTrack._backing.getCodec());
  }
  getInternalCodecId() {
    return this.delegate(() => this.firstInputTrack._backing.getInternalCodecId());
  }
  getDisposition() {
    return this.delegate(() => this.firstInputTrack._backing.getDisposition());
  }
  getLanguageCode() {
    return this.delegate(() => this.firstInputTrack._backing.getLanguageCode());
  }
  getName() {
    return this.delegate(() => this.firstInputTrack._backing.getName());
  }
  getTimeResolution() {
    return this.delegate(() => this.firstInputTrack._backing.getTimeResolution());
  }
  async isRelativeToUnixEpoch() {
    return await this.hydrate(), g(this.segmentedInput.firstSegment), this.segmentedInput.firstSegment.unixEpochTimestamp === this.segmentedInput.firstSegment.timestamp;
  }
  getUnixTimeForTimestamp(e) {
    return this.segmentedInput.getUnixTimeForTimestamp(e);
  }
  getBitrate() {
    return this.delegate(() => this.firstInputTrack._backing.getBitrate());
  }
  getAverageBitrate() {
    return this.delegate(() => this.firstInputTrack._backing.getAverageBitrate());
  }
  getDurationFromMetadata(e) {
    return this.segmentedInput.getDurationFromMetadata(e);
  }
  getLiveRefreshInterval() {
    return this.segmentedInput.getLiveRefreshInterval();
  }
  async createAdjustedPacket(e, t, i) {
    g(e.sequenceNumber >= 0), g(this.segmentedInput.firstSegment);
    const n = await this.segmentedInput.getMediaOffset(t, i.input), s = t.timestamp - this.segmentedInput.firstSegment.timestamp, a = e.clone({
      timestamp: ri(e.timestamp + n, await i.getTimeResolution()),
      // The 1e8 assumes a max of 100 MB per second, highly unlikely to be hit, so this should guarantee
      // monotonically increasing sequence numbers across segments.
      sequenceNumber: Math.floor(1e8 * s) + e.sequenceNumber
    });
    return this.packetInfos.set(a, {
      segment: t,
      track: i,
      sourcePacket: e
    }), a;
  }
  async getFirstPacket(e) {
    await this.hydrate(), g(this.firstInputTrack), g(this.firstSegment);
    let t = this.firstInputTrack, i = this.firstSegment;
    for (; ; ) {
      if (t) {
        const a = await t._backing.getFirstPacket(e);
        if (a)
          return this.createAdjustedPacket(a, i, t);
      }
      if (i = await this.segmentedInput.getNextSegment(i, {
        skipLiveWait: e.skipLiveWait
      }), !i)
        break;
      t = (await this.segmentedInput.getInputForSegment(i).getTracks()).find((a) => a.type === this.firstInputTrack.type && a.number === this.firstInputTrack.number) ?? null;
    }
    return null;
  }
  getNextPacket(e, t) {
    return this._getNextInternal(e, t, !1);
  }
  getNextKeyPacket(e, t) {
    return this._getNextInternal(e, t, !0);
  }
  async _getNextInternal(e, t, i) {
    const n = this.packetInfos.get(e);
    if (!n)
      throw new Error("Packet was not created from this track.");
    const s = i ? await n.track._backing.getNextKeyPacket(n.sourcePacket, t) : await n.track._backing.getNextPacket(n.sourcePacket, t);
    if (s)
      return this.createAdjustedPacket(s, n.segment, n.track);
    let a = n.segment;
    for (; ; ) {
      const o = await this.segmentedInput.getNextSegment(a, {
        skipLiveWait: t.skipLiveWait
      });
      if (!o)
        return null;
      const u = (await this.segmentedInput.getInputForSegment(o).getTracks()).find((f) => f.type === n.track.type && f.number === n.track.number);
      if (!u) {
        a = o;
        continue;
      }
      const d = await u._backing.getFirstPacket(t);
      return d ? this.createAdjustedPacket(d, o, u) : null;
    }
  }
  getPacket(e, t) {
    return this._getPacketInternal(e, t, !1);
  }
  getKeyPacket(e, t) {
    return this._getPacketInternal(e, t, !0);
  }
  async _getPacketInternal(e, t, i) {
    let n = await this.segmentedInput.getSegmentAt(e, {
      skipLiveWait: t.skipLiveWait
    });
    if (!n)
      return null;
    for (await this.hydrate(); n; ) {
      const s = this.segmentedInput.getInputForSegment(n), o = (await s.getTracks()).find((d) => d.type === this.firstInputTrack.type && d.number === this.firstInputTrack.number);
      if (!o) {
        n = await this.segmentedInput.getPreviousSegment(n, {
          skipLiveWait: t.skipLiveWait
        });
        continue;
      }
      const c = await this.segmentedInput.getMediaOffset(n, s), l = e - c, u = i ? await o._backing.getKeyPacket(l, t) : await o._backing.getPacket(l, t);
      if (!u) {
        n = await this.segmentedInput.getPreviousSegment(n, {
          skipLiveWait: t.skipLiveWait
        });
        continue;
      }
      return this.createAdjustedPacket(u, n, o);
    }
    return null;
  }
}
class Ns extends bo {
  getType() {
    return "video";
  }
  getCodec() {
    return this.delegate(() => this.firstInputTrack._backing.getCodec());
  }
  getCodedWidth() {
    return this.delegate(() => this.firstInputTrack._backing.getCodedWidth());
  }
  getCodedHeight() {
    return this.delegate(() => this.firstInputTrack._backing.getCodedHeight());
  }
  getSquarePixelWidth() {
    return this.delegate(() => this.firstInputTrack._backing.getSquarePixelWidth());
  }
  getSquarePixelHeight() {
    return this.delegate(() => this.firstInputTrack._backing.getSquarePixelHeight());
  }
  getRotation() {
    return this.delegate(() => this.firstInputTrack._backing.getRotation());
  }
  async getColorSpace() {
    return this.delegate(() => this.firstInputTrack._backing.getColorSpace());
  }
  async canBeTransparent() {
    return this.delegate(() => this.firstInputTrack._backing.canBeTransparent());
  }
  async getDecoderConfig() {
    return this.delegate(() => this.firstInputTrack._backing.getDecoderConfig());
  }
}
class Vs extends bo {
  getType() {
    return "audio";
  }
  getCodec() {
    return this.delegate(() => this.firstInputTrack._backing.getCodec());
  }
  getNumberOfChannels() {
    return this.delegate(() => this.firstInputTrack._backing.getNumberOfChannels());
  }
  getSampleRate() {
    return this.delegate(() => this.firstInputTrack._backing.getSampleRate());
  }
  async getDecoderConfig() {
    return this.delegate(() => this.firstInputTrack._backing.getDecoderConfig());
  }
}
Mn();
const ko = 0, To = 1 / 0;
typeof FinalizationRegistry < "u" && new FinalizationRegistry((r) => {
  r();
});
class Ge extends Fr {
  constructor() {
    super(), this._disposed = !1, this._refCount = 0, this._usedForHls = !1, this._refFinalizationRegistry = null, this._sizePromise = null, this.onread = null, typeof FinalizationRegistry < "u" && (this._refFinalizationRegistry = new FinalizationRegistry((e) => {
      e._decrementRefCount();
    }));
  }
  /**
   * Resolves with the total size of the file in bytes. This function is memoized, meaning only the first call
   * will retrieve the size.
   *
   * Returns null if the source is unsized.
   */
  async getSizeOrNull() {
    if (this._disposed)
      throw new pe();
    return this._sizePromise ??= (async () => {
      let e = this._getFileSize();
      return e !== void 0 || (await this._read(0, 1, ko, To), e = this._getFileSize(), g(e !== void 0)), e;
    })();
  }
  /**
   * Resolves with the total size of the file in bytes. This function is memoized, meaning only the first call
   * will retrieve the size.
   *
   * Throws an error if the source is unsized.
   */
  async getSize() {
    if (this._disposed)
      throw new pe();
    const e = await this.getSizeOrNull();
    if (e === null)
      throw new Error("Cannot determine the size of an unsized source.");
    return e;
  }
  /**
   * Returns a new {@link RangedSource} that maps data onto this source using the given offset and length. If a length
   * is not provided, the ranged source spans until the end of this source's data.
   *
   * Useful for reading files that are embedded within larger files.
   */
  slice(e, t) {
    if (!Number.isInteger(e) || e < 0)
      throw new TypeError("offset must be a non-negative integer.");
    if (t !== void 0 && (!Number.isInteger(t) || t < 0))
      throw new TypeError("length, when provided, must be a non-negative integer.");
    return new ou(this, e, t);
  }
  /** @internal */
  _dispatchRead(e, t) {
    this.onread?.(e, t), this._emit("read", { start: e, end: t });
  }
  /**
   * Creates a new `SourceRef` pointing to this source. You are expected to call `.free()` on said `SourceRef` when
   * you're done with it.
   */
  ref() {
    return new Gn(this);
  }
  /** @internal */
  _incrementRefCount() {
    this._refCount++;
  }
  /** @internal */
  _decrementRefCount() {
    this._refCount--, this._refCount === 0 && (this._dispose(), this._disposed = !0);
  }
}
class Gn {
  /** @internal */
  constructor(e) {
    if (this._freed = !1, e._disposed)
      throw new Error("Cannot ref a disposed source.");
    e._incrementRefCount(), e._refFinalizationRegistry?.register(this, e, this), this._source = e;
  }
  /** The {@link Source} this ref references. Accessing this field throws an error after having freed the ref. */
  get source() {
    if (!this._source)
      throw new Error("Can't get source; ref has already been freed.");
    return this._source;
  }
  /** Whether or not this reference has been freed via {@link SourceRef.free}. */
  get freed() {
    return this._freed;
  }
  /**
   * Frees the ref, decrementing the source's internal reference count. If the source's internal reference count
   * reaches zero, it gets disposed. To catch bugs, this method throws if the ref is already freed.
   */
  free() {
    if (this._freed)
      throw new Error("Illegal operation: double free on SourceRef.");
    const e = this.source;
    g(e._refCount > 0), e._decrementRefCount(), e._refFinalizationRegistry?.unregister(this), this._freed = !0, this._source = null;
  }
  /**
   * Calls {@link SourceRef.free}.
   */
  [Symbol.dispose]() {
    this.freed || this.free();
  }
}
class Or extends Ge {
  constructor(e, t) {
    if (typeof e != "string")
      throw new TypeError("rootPath must be a string.");
    if (typeof t != "function")
      throw new TypeError("requestHandler must be a function.");
    super(), this.rootPath = e, this.requestHandler = t;
  }
  /** @internal */
  _resolveRequest(e) {
    const t = this.requestHandler(e), i = (n) => {
      if (!(n instanceof Ge || n instanceof Gn))
        throw new TypeError("requestHandler must return or resolve to a Source or SourceRef.");
      const s = n instanceof Ge ? n.ref() : n;
      return s.source._usedForHls ||= this._usedForHls, s;
    };
    return t instanceof Promise ? t.then(i) : i(t);
  }
}
const Us = (r, e) => r.path === e.path;
class iu extends Or {
  constructor() {
    super(...arguments), this._root = null, this._rootRequest = null;
  }
  /** @internal */
  _read(e, t, i, n) {
    if (!this._root) {
      if (!this._rootRequest) {
        const s = this._resolveRequest({ path: this.rootPath, isRoot: !0 }), a = (o) => {
          const c = o instanceof Ge ? o.ref() : o;
          return this._root = c, this._rootRequest = null, c;
        };
        s instanceof Promise ? this._rootRequest = s.then(a) : (a(s), g(this._root));
      }
      if (this._rootRequest)
        return this._rootRequest.then((s) => s.source._read(e, t, i, n));
    }
    return this._root.source._read(e, t, i, n);
  }
  /** @internal */
  _getFileSize() {
    if (this._root)
      return this._root.source._getFileSize();
  }
  /** @internal */
  _dispose() {
    this._root ? this._root.free() : this._rootRequest && this._rootRequest.then((e) => e.free());
  }
}
class Ws extends Ge {
  /**
   * Creates a new {@link BlobSource} backed by the specified
   * [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob).
   */
  constructor(e, t = {}) {
    if (!(e instanceof Blob))
      throw new TypeError("blob must be a Blob.");
    if (!t || typeof t != "object")
      throw new TypeError("options must be an object.");
    if (t.maxCacheSize !== void 0 && (!zn(t.maxCacheSize) || t.maxCacheSize < 0))
      throw new TypeError("options.maxCacheSize, when provided, must be a non-negative number.");
    if (t.useStreamReader !== void 0 && typeof t.useStreamReader != "boolean")
      throw new TypeError("options.useStreamReader, when provided, must be a boolean.");
    super(), this._readers = /* @__PURE__ */ new WeakMap(), this._blob = e, this._options = t, this._orchestrator = new au({
      maxCacheSize: t.maxCacheSize ?? 8 * 2 ** 20,
      maxWorkerCount: 4,
      runWorker: this._runWorker.bind(this),
      prefetchProfile: su.fileSystem
    }), this._orchestrator.fileSize = e.size;
  }
  /** @internal */
  _getFileSize() {
    return this._orchestrator.fileSize;
  }
  /** @internal */
  _read(e, t, i, n) {
    return this._orchestrator.read(e, t, i, n);
  }
  /** @internal */
  async _runWorker(e) {
    g(e.strictTarget);
    let t = this._readers.get(e);
    for (t === void 0 && ("stream" in this._blob && !wr() && this._options.useStreamReader !== !1 ? t = this._blob.slice(e.currentPos).stream().getReader() : t = null, this._readers.set(e, t)); e.currentPos < e.targetPos && !e.aborted; )
      if (t) {
        const { done: i, value: n } = await t.read();
        if (i)
          throw this._orchestrator.onWorkerFinished(e), new Error("Blob reader stopped unexpectedly before all requested data was read.");
        if (e.aborted)
          break;
        this._dispatchRead(e.currentPos, e.currentPos + n.length), this._orchestrator.supplyWorkerData(e, n);
      } else {
        const i = await this._blob.slice(e.currentPos, e.targetPos).arrayBuffer();
        if (e.aborted)
          break;
        this._dispatchRead(e.currentPos, e.currentPos + i.byteLength), this._orchestrator.supplyWorkerData(e, new Uint8Array(i));
      }
    this._orchestrator.signalWorkerStoppedRunning(e), e.aborted && await t?.cancel();
  }
  /** @internal */
  _dispose() {
    this._orchestrator.dispose();
  }
}
class nu extends Ge {
  /** Creates a new {@link ReadableStreamSource} backed by the specified `ReadableStream<Uint8Array>`. */
  constructor(e, t = {}) {
    if (!(e instanceof ReadableStream))
      throw new TypeError("stream must be a ReadableStream.");
    if (!t || typeof t != "object")
      throw new TypeError("options must be an object.");
    if (t.maxCacheSize !== void 0 && (!zn(t.maxCacheSize) || t.maxCacheSize < 0))
      throw new TypeError("options.maxCacheSize, when provided, must be a non-negative number.");
    super(), this._reader = null, this._cache = [], this._pendingSlices = [], this._currentIndex = 0, this._targetIndex = 0, this._maxRequestedIndex = 0, this._endIndex = null, this._pulling = !1, this._cacheMissErrorMessage = "Attempted to read data from an already-evicted part of the cache. With ReadableStreamSource, you must access the data more sequentially or increase the size of its cache.", this._stream = e, this._maxCacheSize = t.maxCacheSize ?? 32 * 2 ** 20;
  }
  /** @internal */
  _getFileSize() {
    return this._endIndex;
  }
  /** @internal */
  _read(e, t) {
    if (this._endIndex !== null && t > this._endIndex)
      return null;
    this._maxRequestedIndex = Math.max(this._maxRequestedIndex, t);
    const i = G(this._cache, e, (u) => u.start), n = i !== -1 ? this._cache[i] : null;
    if (n && n.start <= e && t <= n.end)
      return {
        bytes: n.bytes,
        view: n.view,
        offset: n.start
      };
    let s = e;
    const a = new Uint8Array(t - e);
    if (i !== -1)
      for (let u = i; u < this._cache.length; u++) {
        const d = this._cache[u];
        if (d.start >= t)
          break;
        const f = Math.max(e, d.start);
        f > s && this._throwDueToCacheMiss();
        const h = Math.min(t, d.end);
        f < h && (a.set(d.bytes.subarray(f - d.start, h - d.start), f - e), s = h);
      }
    if (s === t)
      return {
        bytes: a,
        view: K(a),
        offset: e
      };
    this._currentIndex > s && this._throwDueToCacheMiss();
    const { promise: o, resolve: c, reject: l } = ne();
    return this._pendingSlices.push({
      start: e,
      end: t,
      bytes: a,
      resolve: c,
      reject: l
    }), this._targetIndex = Math.max(this._targetIndex, t), this._pulling || (this._pulling = !0, this._pull().catch((u) => {
      if (this._pulling = !1, this._pendingSlices.length > 0)
        this._pendingSlices.forEach((d) => d.reject(u)), this._pendingSlices.length = 0;
      else
        throw u;
    })), o;
  }
  /** @internal */
  _throwDueToCacheMiss() {
    throw new Error(this._cacheMissErrorMessage);
  }
  /** @internal */
  async _pull() {
    for (this._reader ??= this._stream.getReader(); this._currentIndex < this._targetIndex && !this._disposed; ) {
      const { done: e, value: t } = await this._reader.read();
      if (e) {
        for (const s of this._pendingSlices)
          s.resolve(null);
        this._pendingSlices.length = 0, this._endIndex = this._currentIndex;
        break;
      }
      const i = this._currentIndex, n = this._currentIndex + t.byteLength;
      this._dispatchRead(i, n);
      for (let s = 0; s < this._pendingSlices.length; s++) {
        const a = this._pendingSlices[s], o = Math.max(i, a.start), c = Math.min(n, a.end);
        o < c && (a.bytes.set(t.subarray(o - i, c - i), o - a.start), c === a.end && (a.resolve({
          bytes: a.bytes,
          view: K(a.bytes),
          offset: a.start
        }), this._pendingSlices.splice(s, 1), s--));
      }
      for (this._cache.push({
        start: i,
        end: n,
        bytes: t,
        view: K(t),
        age: 0
        // Unused
      }); this._cache.length > 0; ) {
        const s = this._cache[0];
        if (this._maxRequestedIndex - s.end <= this._maxCacheSize)
          break;
        this._cache.shift();
      }
      this._currentIndex += t.byteLength;
    }
    this._pulling = !1;
  }
  /** @internal */
  _dispose() {
    for (const e of this._pendingSlices)
      e.reject(new pe());
    this._pendingSlices.length = 0, this._cache.length = 0, this._reader?.cancel();
  }
}
const su = {
  fileSystem: (r, e) => (r = Math.floor((r - 65536) / 65536) * 65536, e = Math.ceil((e + 65536) / 65536) * 65536, { start: r, end: e })
};
class au {
  constructor(e) {
    this.options = e, this.fileSize = null, this.nextAge = 0, this.workers = [], this.cache = [], this.currentCacheSize = 0, this.disposed = !1, this.queuedReads = [];
  }
  read(e, t, i, n) {
    g(!this.disposed);
    const s = this.options.prefetchProfile(e, t, this.workers), a = Math.max(s.start, i), o = Math.min(s.end, this.fileSize ?? 1 / 0, n);
    g(a <= e && t <= o);
    let c = null;
    const l = G(this.cache, e, (T) => T.start), u = l !== -1 ? this.cache[l] : null;
    u && u.start <= e && t <= u.end && (u.age = this.nextAge++, c = {
      bytes: u.bytes,
      view: u.view,
      offset: u.start
    });
    const d = G(this.cache, a, (T) => T.start), f = c ? null : new Uint8Array(t - e);
    let h = 0, p = a;
    const m = [];
    if (d !== -1) {
      for (let T = d; T < this.cache.length; T++) {
        const x = this.cache[T];
        if (x.start >= o)
          break;
        if (x.end <= a)
          continue;
        const C = Math.max(a, x.start), P = Math.min(o, x.end);
        if (g(C <= P), p < C && m.push({ start: p, end: C }), p = P, f) {
          const S = Math.max(e, x.start), E = Math.min(t, x.end);
          if (S < E) {
            const I = S - e;
            f.set(x.bytes.subarray(S - x.start, E - x.start), I), I === h && (h = E - e);
          }
        }
        x.age = this.nextAge++;
      }
      p < o && m.push({ start: p, end: o });
    } else
      m.push({ start: a, end: o });
    if (f && h >= f.length && (c = {
      bytes: f,
      view: K(f),
      offset: e
    }), m.length === 0)
      return g(c), c;
    const { promise: y, resolve: w, reject: b } = ne(), k = [];
    for (const T of m) {
      const x = Math.max(e, T.start), C = Math.min(t, T.end);
      x === T.start && C === T.end ? k.push(T) : x < C && k.push({ start: x, end: C });
    }
    const A = f && {
      start: e,
      bytes: f,
      holes: k,
      resolve: w,
      reject: b
    };
    e: for (const T of m) {
      for (const P of this.workers)
        if (this.checkHoleAgainstWorker(P, T, A ? [A] : [])) {
          this.checkQueuedReadsAgainstWorker(P);
          continue e;
        }
      const x = T.end < o || this.fileSize !== null, C = this.createWorker(T.start, T.end, x);
      if (C)
        A && (C.pendingSlices = [A]), this.runWorker(C);
      else {
        let P = G(this.queuedReads, T.start, (E) => E.hole.start), S = P !== -1 ? this.queuedReads[P] : null;
        for (S && T.start <= S.hole.end ? (S.hole.end = Math.max(S.hole.end, T.end), S.strictTarget &&= x, A && S.pendingSlices.push(A)) : (P++, S = {
          hole: {
            // Clone the hole because it might be mutated later
            start: T.start,
            end: T.end
          },
          strictTarget: x,
          pendingSlices: A ? [A] : [],
          age: this.nextAge++
        }, this.queuedReads.splice(P, 0, S)); P + 1 < this.queuedReads.length; ) {
          const E = this.queuedReads[P + 1];
          if (E.hole.start > S.hole.end)
            break;
          S.hole.end = Math.max(S.hole.end, E.hole.end), S.pendingSlices.push(...E.pendingSlices), S.strictTarget &&= E.strictTarget, S.age = Math.min(S.age, E.age), this.queuedReads.splice(P + 1, 1);
        }
      }
    }
    return c ? y.catch((T) => {
      if (!this.disposed)
        throw T;
    }) : (g(f), c = y.then((T) => T && {
      bytes: T,
      view: K(T),
      offset: e
    })), c;
  }
  checkHoleAgainstWorker(e, t, i) {
    if (us(t.start - 131072, t.start, e.currentPos, e.targetPos)) {
      e.targetPos = Math.max(e.targetPos, t.end);
      for (let s = 0; s < i.length; s++) {
        const a = i[s];
        e.pendingSlices.includes(a) || e.pendingSlices.push(a);
      }
      return e.running || this.runWorker(e), !0;
    }
    return !1;
  }
  checkQueuedReadsAgainstWorker(e) {
    let t = !1;
    for (let i = 0; i < this.queuedReads.length; i++) {
      const n = this.queuedReads[i];
      if (this.checkHoleAgainstWorker(e, n.hole, n.pendingSlices))
        this.queuedReads.splice(i, 1), i--, t = !0;
      else if (t)
        break;
    }
  }
  createWorker(e, t, i) {
    if (this.workers.length >= this.options.maxWorkerCount) {
      let s = null, a = null;
      for (let o = 0; o < this.workers.length; o++) {
        const c = this.workers[o];
        !c.running && c.pendingSlices.length === 0 && (!s || c.age < s.age) && (a = o, s = c);
      }
      if (s)
        g(a !== null), g(s.pendingSlices.length === 0), this.workers.splice(a, 1);
      else
        return null;
    }
    const n = {
      startPos: e,
      currentPos: e,
      targetPos: t,
      strictTarget: i,
      running: !1,
      // Due to async shenanigans, it can happen that workers are started after disposal. In this case, instead of
      // simply not creating the worker, we allow it to run but immediately label it as aborted, so it can then
      // shut itself down.
      aborted: this.disposed,
      pendingSlices: [],
      age: this.nextAge++
    };
    return this.workers.push(n), n;
  }
  runWorker(e) {
    g(!e.running), g(e.currentPos < e.targetPos), e.running = !0, e.age = this.nextAge++, this.options.runWorker(e).catch((t) => {
      if (e.running = !1, e.pendingSlices.length > 0)
        e.pendingSlices.forEach((i) => i.reject(t)), e.pendingSlices.length = 0;
      else if (!e.aborted && !this.disposed)
        throw t;
    }).finally(() => {
      if (!e.running && this.queuedReads.length > 0) {
        let t = 0;
        for (let s = 1; s < this.queuedReads.length; s++)
          this.queuedReads[s].age < this.queuedReads[t].age && (t = s);
        const i = this.queuedReads[t], n = this.createWorker(i.hole.start, i.hole.end, i.strictTarget);
        if (!n)
          return;
        this.queuedReads.splice(t, 1), n.pendingSlices = i.pendingSlices, this.runWorker(n);
      }
    });
  }
  /** Called by a worker when it has read some data. */
  supplyWorkerData(e, t) {
    g(!e.aborted);
    const i = e.currentPos, n = i + t.length;
    this.insertIntoCache({
      start: i,
      end: n,
      bytes: t,
      view: K(t),
      age: this.nextAge++
    }), e.currentPos += t.length, e.currentPos > e.targetPos && (e.targetPos = e.currentPos, this.checkQueuedReadsAgainstWorker(e));
    for (let s = 0; s < e.pendingSlices.length; s++) {
      const a = e.pendingSlices[s], o = Math.max(i, a.start), c = Math.min(n, a.start + a.bytes.length);
      o < c && a.bytes.set(t.subarray(o - i, c - i), o - a.start);
      for (let l = 0; l < a.holes.length; l++) {
        const u = a.holes[l];
        i <= u.start && n > u.start && (u.start = n), u.end <= u.start && (a.holes.splice(l, 1), l--);
      }
      a.holes.length === 0 && (a.resolve(a.bytes), e.pendingSlices.splice(s, 1), s--);
    }
    for (let s = 0; s < this.workers.length; s++) {
      const a = this.workers[s];
      e === a || a.running || us(i, n, a.currentPos, a.targetPos) && (this.workers.splice(s, 1), s--);
    }
  }
  supplyFileSize(e) {
    g(this.fileSize === null), this.fileSize = e;
    for (const t of this.workers) {
      t.targetPos = Math.min(t.targetPos, e), t.strictTarget = !0;
      for (let i = 0; i < t.pendingSlices.length; i++) {
        const n = t.pendingSlices[i];
        for (const s of n.holes)
          if (s.end > e) {
            n.resolve(null), t.pendingSlices.splice(i, 1), i--;
            break;
          }
      }
    }
    for (let t = 0; t < this.queuedReads.length; t++) {
      const i = this.queuedReads[t];
      if (i.hole.start >= e) {
        for (const n of i.pendingSlices)
          n.resolve(null);
        this.queuedReads.splice(t, 1), t--;
      } else if (i.hole.end > e) {
        i.hole.end = e, i.strictTarget = !0;
        for (let n = 0; n < i.pendingSlices.length; n++) {
          const s = i.pendingSlices[n];
          s.start >= e && (s.resolve(null), i.pendingSlices.splice(n, 1), n--);
        }
      }
    }
  }
  signalWorkerStoppedRunning(e) {
    e.running = !1, e.aborted || (e.pendingSlices.length = 0);
  }
  /** Called when a worker reaches the end of the underlying data and must be cleaned up. */
  onWorkerFinished(e) {
    const t = this.workers.indexOf(e);
    g(t !== -1), e.running = !1, this.workers.splice(t, 1), this.fileSize === null && this.supplyFileSize(e.currentPos);
    for (const i of e.pendingSlices)
      i.resolve(null);
  }
  insertIntoCache(e) {
    if (this.options.maxCacheSize === 0)
      return;
    let t = G(this.cache, e.start, (i) => i.start) + 1;
    if (t > 0) {
      const i = this.cache[t - 1];
      if (i.end >= e.end)
        return;
      if (i.end > e.start) {
        const n = new Uint8Array(e.end - i.start);
        n.set(i.bytes, 0), n.set(e.bytes, e.start - i.start), this.currentCacheSize += e.end - i.end, i.bytes = n, i.view = K(n), i.end = e.end, t--, e = i;
      } else
        this.cache.splice(t, 0, e), this.currentCacheSize += e.bytes.length;
    } else
      this.cache.splice(t, 0, e), this.currentCacheSize += e.bytes.length;
    for (let i = t + 1; i < this.cache.length; i++) {
      const n = this.cache[i];
      if (e.end <= n.start)
        break;
      if (e.end >= n.end) {
        this.cache.splice(i, 1), this.currentCacheSize -= n.bytes.length, i--;
        continue;
      }
      const s = new Uint8Array(n.end - e.start);
      s.set(e.bytes, 0), s.set(n.bytes, n.start - e.start), this.currentCacheSize -= e.end - n.start, e.bytes = s, e.view = K(s), e.end = n.end, this.cache.splice(i, 1);
      break;
    }
    for (; this.currentCacheSize > this.options.maxCacheSize; ) {
      let i = 0, n = this.cache[0];
      for (let s = 1; s < this.cache.length; s++) {
        const a = this.cache[s];
        a.age < n.age && (i = s, n = a);
      }
      if (this.currentCacheSize - n.bytes.length <= this.options.maxCacheSize)
        break;
      this.cache.splice(i, 1), this.currentCacheSize -= n.bytes.length;
    }
  }
  dispose() {
    for (const e of this.workers) {
      for (const t of e.pendingSlices)
        t.reject(new pe());
      e.pendingSlices.length = 0, e.aborted = !0;
    }
    for (const e of this.queuedReads)
      for (const t of e.pendingSlices)
        t.reject(new pe());
    this.workers.length = 0, this.cache.length = 0, this.queuedReads.length = 0, this.disposed = !0;
  }
}
class ou extends Ge {
  /** @internal */
  constructor(e, t, i) {
    if (super(), this._ref = null, e._disposed)
      throw new Error("Cannot create a slice of a disposed source.");
    this._baseSource = e, this._offset = t, this._length = i ?? null;
  }
  /** @internal */
  _getFileSize() {
    const e = this._baseSource._getFileSize();
    return e === void 0 ? this._length !== null ? this._length : void 0 : e === null ? this._length !== null ? this._length : null : ae(e - this._offset, 0, this._length ?? 1 / 0);
  }
  /** @internal */
  _read(e, t, i, n) {
    if (this._length !== null && t > this._length)
      return null;
    const s = this._baseSource._read(this._offset + e, this._offset + t, this._offset + i, this._offset + n), a = (o) => o ? (o.offset -= this._offset, o) : null;
    return s instanceof Promise ? s.then(a) : a(s);
  }
  /** @internal */
  _dispose() {
    this._ref?.free();
  }
  ref() {
    return this._ref ??= this._baseSource.ref(), super.ref();
  }
}
var qs = function(r, e, t) {
  if (e != null) {
    if (typeof e != "object" && typeof e != "function") throw new TypeError("Object expected.");
    var i, n;
    if (t) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      i = e[Symbol.asyncDispose];
    }
    if (i === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      i = e[Symbol.dispose], t && (n = i);
    }
    if (typeof i != "function") throw new TypeError("Object not disposable.");
    n && (i = function() {
      try {
        n.call(this);
      } catch (s) {
        return Promise.reject(s);
      }
    }), r.stack.push({ value: e, dispose: i, async: t });
  } else t && r.stack.push({ async: !0 });
  return e;
}, Ls = /* @__PURE__ */ (function(r) {
  return function(e) {
    function t(a) {
      e.error = e.hasError ? new r(a, e.error, "An error was suppressed during disposal.") : a, e.hasError = !0;
    }
    var i, n = 0;
    function s() {
      for (; i = e.stack.pop(); )
        try {
          if (!i.async && n === 1) return n = 0, e.stack.push(i), Promise.resolve().then(s);
          if (i.dispose) {
            var a = i.dispose.call(i.value);
            if (i.async) return n |= 2, Promise.resolve(a).then(s, function(o) {
              return t(o), s();
            });
          } else n |= 1;
        } catch (o) {
          t(o);
        }
      if (n === 1) return e.hasError ? Promise.reject(e.error) : Promise.resolve();
      if (e.hasError) throw e.error;
    }
    return s();
  };
})(typeof SuppressedError == "function" ? SuppressedError : function(r, e, t) {
  var i = new Error(t);
  return i.name = "SuppressedError", i.error = r, i.suppressed = e, i;
});
const cu = /^0[xX][0-9a-fA-F]+$/, lu = /^data:.*;base64,/i;
class Hs extends ru {
  constructor(e, t, i, n) {
    super(e.input, t, i), this.segments = [], this.nextLines = null, this.currentUpdateSegmentsPromise = null, this.streamHasEnded = !1, this.lastSegmentUpdateTime = -1 / 0, this.refreshInterval = 5, this.rootPath = t, this.demuxer = e, this.nextLines = n;
  }
  runUpdateSegments() {
    return this.currentUpdateSegmentsPromise ??= (async () => {
      try {
        const e = this.getRemainingWaitTimeMs();
        e > 0 && await Pa(e), this.lastSegmentUpdateTime = performance.now(), await this.updateSegments();
      } finally {
        this.currentUpdateSegmentsPromise = null;
      }
    })();
  }
  getRemainingWaitTimeMs() {
    const e = performance.now() - this.lastSegmentUpdateTime, t = Math.max(0, 1e3 * this.refreshInterval - e);
    return t <= 50 ? 0 : t;
  }
  /**
   * Reads and parses the segment info from the playlist file. When called more than one, it updates the existing
   * segments by appending the new ones. Existing segments are never removed.
   */
  async updateSegments() {
    let e = this.nextLines;
    if (this.nextLines = null, !e) {
      const k = { stack: [], error: void 0, hasError: !1 };
      try {
        const A = qs(k, await this.demuxer.input._getSourceUncached({ path: this.rootPath, isRoot: !1 }), !1), x = await new $r(A.source).requestEntireFile();
        g(x), e = Vo(x, x.length, { ignore: wo }), A.source instanceof Or && (this.rootPath = A.source.rootPath);
      } catch (A) {
        k.error = A, k.hasError = !0;
      } finally {
        Ls(k);
      }
    }
    const t = this.input._formatOptions.hls?.offsetTimestampsByDateTime !== !1;
    let i = !1, n = 0, s = null, a = null, o = null, c = 0, l = null, u = null, d = null, f = null, h = null, p = null, m = !1, y = te(this.segments) ?? null;
    const w = (k) => {
      const A = k.indexOf("@"), T = Number(A === -1 ? k : k.slice(0, A));
      if (!Number.isInteger(T) || T < 0)
        throw new Error(`Invalid #EXT-X-BYTERANGE length '${k}'.`);
      let x = null;
      if (A !== -1 && (x = Number(k.slice(A + 1)), !Number.isInteger(x) || x < 0))
        throw new Error(`Invalid #EXT-X-BYTERANGE offset '${k}'.`);
      return { length: T, offset: x };
    }, b = (k) => {
      c = k, y && (g(y.sequenceNumber !== null), y.sequenceNumber < k && (n = y.timestamp + y.duration, l = y.firstSegment, u = y.initSegment, h = y.lastProgramDateTimeSeconds, s = y.unixEpochTimestamp !== null ? y.unixEpochTimestamp + y.duration : null, y = null));
    };
    for (let k = 0; k < e.length; k++) {
      const A = e[k];
      if (!i) {
        if (A !== "#EXTM3U")
          throw new Error("Invalid M3U8 file; expected first line to be #EXTM3U.");
        i = !0;
        continue;
      }
      if (!A.startsWith("#")) {
        if (!y) {
          if (a === null)
            throw new Error("Invalid M3U8 file; a segment must be preceded by an #EXTINF tag.");
          let T = o;
          if (T && T.method === "AES-128" && !T.iv) {
            const S = new Uint8Array(Le), E = K(S);
            E.setUint32(8, Math.floor(c / 2 ** 32)), E.setUint32(12, c), T = { ...T, iv: S };
          }
          const C = {
            path: ht(this.rootPath, A),
            offset: f?.offset ?? 0,
            length: f?.length ?? null
          }, P = {
            timestamp: n,
            unixEpochTimestamp: s,
            firstSegment: l,
            sequenceNumber: c,
            location: C,
            duration: a,
            encryption: T,
            initSegment: u,
            lastProgramDateTimeSeconds: h
          };
          l ??= P, n += a, s !== null && (s += a), this.segments.push(P);
        }
        a = null, f === null ? d = null : f = null, b(c + 1);
      }
      if (A.startsWith(Tn)) {
        if (y) {
          m = !0;
          continue;
        }
        m || (h === null && c > 0 && p !== null && (n = c * p), m = !0);
        const T = A.slice(Tn.length), x = T.indexOf(","), C = x === -1 ? T : T.slice(0, x), P = Number(C);
        if (!Number.isFinite(P) || P < 0)
          throw new Error(`Invalid #EXTINF tag duration '${C}'.`);
        a = P;
      } else if (A.startsWith(Bs)) {
        const T = new Tr(A.slice(Bs.length)), x = T.get("uri");
        if (!x)
          throw new Error("Invalid #EXT-X-MAP tag; missing URI attribute.");
        const C = T.get("byterange");
        let P = null;
        if (C !== null && (P = w(C)), P && P.offset === null)
          throw new Error("Invalid #EXT-X-MAP tag; BYTERANGE attribute must have a specified offset.");
        if (!y) {
          const E = {
            path: ht(this.rootPath, x),
            offset: P?.offset ?? 0,
            length: P?.length ?? null
          };
          if (o?.method === "AES-128" && !o.iv)
            throw new Error("IV attribute must be set on #EXT-X-KEY tag preceding the #EXT-X-MAP tag.");
          u = {
            timestamp: n,
            unixEpochTimestamp: s,
            firstSegment: null,
            sequenceNumber: null,
            location: E,
            duration: 0,
            encryption: o,
            initSegment: null,
            lastProgramDateTimeSeconds: h
          };
        }
        a = null, f === null ? d = null : f = null;
      } else if (A.startsWith(Rs)) {
        const T = new Tr(A.slice(Rs.length)), x = T.get("method");
        if (x === "NONE")
          o = null;
        else if (x === "AES-128") {
          const C = T.get("uri");
          if (!C)
            throw new Error("Invalid #EXT-X-KEY: AES-128 requires a URI attribute.");
          let P = null;
          const S = T.get("iv");
          if (S) {
            if (!cu.test(S))
              throw new Error(`Unsupported IV format '${S}'.`);
            let I = S.slice(2);
            I = I.padStart(Le * 2, "0"), P = new Uint8Array(Le);
            for (let _ = 0; _ < Le; _++) {
              const F = -Le * 2 + _;
              P[_] = parseInt(I.slice(F, F + 2), 16);
            }
          }
          const E = T.get("keyformat") ?? "identity";
          if (E !== "identity")
            throw new Error("For AES-128 encryption, only the 'identity' KEYFORMAT is currently supported. If you think other formats should be supported, please raise an issue.");
          o = {
            method: "AES-128",
            keyUri: ht(this.rootPath, C),
            iv: P,
            keyFormat: E
          };
        } else if (x === "SAMPLE-AES" || x === "SAMPLE-AES-CTR") {
          const C = T.get("uri");
          if (!C)
            throw new Error(`Invalid #EXT-X-KEY: ${x} requires a URI attribute.`);
          if ((T.get("keyformat") ?? "identity") === "identity")
            throw new Error("For SAMPLE-AES and SAMPLE-AES-CTR encryption, the 'identity' KEYFORMAT is not supported. If you think this format should be supported, please raise an issue.");
          let S = null;
          if (lu.test(C)) {
            const E = C.indexOf(","), I = ii(C.slice(E + 1));
            if (I.length >= 8 && I[4] === 112 && I[5] === 115 && I[6] === 115 && I[7] === 104) {
              const _ = K(I).getUint32(0);
              S = eo(I.subarray(8, Math.min(_, I.length)));
            }
          }
          o = {
            method: x,
            psshBox: S
          };
        } else
          throw new Error(`Unsupported encryption method '${x}'. If you think this method should be supported, please raise an issue.`);
      } else if (A.startsWith(Fs)) {
        const T = A.slice(Fs.length), x = Number(T);
        if (!Number.isInteger(x) || x < 0)
          throw new Error(`Invalid EXT-X-MEDIA-SEQUENCE value '${T}'.`);
        b(x);
      } else if (A.startsWith(Ms)) {
        const T = w(A.slice(Ms.length));
        if (T.offset === null) {
          if (d === null)
            throw new Error("Invalid M3U8 file; #EXT-X-BYTERANGE without offset requires a previous byte range.");
          T.offset = d;
        }
        f = T, d = T.offset + T.length;
      } else if (A.startsWith(zs)) {
        if (y)
          continue;
        const T = A.slice(zs.length), x = Date.parse(T);
        if (!Number.isFinite(x))
          continue;
        const C = x / 1e3;
        if (h === C)
          continue;
        if (h === null && this.segments.length > 0) {
          const P = te(this.segments), S = P.timestamp + P.duration, E = C - S;
          for (const I of this.segments)
            I.unixEpochTimestamp = I.timestamp + E, t && (I.timestamp = I.unixEpochTimestamp);
        }
        h = C, s = C, t && (n = C);
      } else if (A === Jl)
        l = null;
      else if (A.startsWith(Os)) {
        const T = A.slice(Os.length), x = Number(T);
        if (!Number.isFinite(x) || x < 0)
          throw new Error(`Invalid EXT-X-TARGETDURATION value '${T}'.`);
        this.refreshInterval = x, p = x;
      } else if (A === eu) {
        this.streamHasEnded = !0;
        break;
      } else A.startsWith(Ds) && A.slice(Ds.length).toLowerCase() === "vod" && (this.streamHasEnded = !0);
    }
    if (!i)
      throw new Error("Invalid M3U8 file; no #EXTM3U header.");
  }
  async getFirstSegment() {
    return this.segments.length === 0 && await this.runUpdateSegments(), this.segments[0] ?? null;
  }
  async getSegmentAt(e, t) {
    this.segments.length === 0 && await this.runUpdateSegments();
    let i = !!t.skipLiveWait && this.getRemainingWaitTimeMs() > 0;
    for (; ; ) {
      const n = G(this.segments, e, (a) => a.timestamp);
      if (n === -1)
        return null;
      if (n < this.segments.length - 1 || this.streamHasEnded || i)
        return this.segments[n];
      const s = this.segments[n];
      if (e < s.timestamp + s.duration)
        return s;
      await this.runUpdateSegments(), t.skipLiveWait && (i = !0);
    }
  }
  async getNextSegment(e, t) {
    const i = this.segments.indexOf(e);
    g(i !== -1);
    const n = i + 1;
    let s = !!t.skipLiveWait && this.getRemainingWaitTimeMs() > 0;
    for (; ; ) {
      if (n < this.segments.length)
        return this.segments[n];
      if (this.streamHasEnded || s)
        return null;
      await this.runUpdateSegments(), t.skipLiveWait && (s = !0);
    }
  }
  async getPreviousSegment(e) {
    const t = this.segments.indexOf(e);
    return g(t !== -1), this.segments[t - 1] ?? null;
  }
  getInputForSegment(e) {
    const t = e, i = this.inputCache.find((c) => c.segment === t);
    if (i)
      return i.age = this.nextInputCacheAge++, i.input;
    let n = null;
    (t.initSegment || t.firstSegment) && (n = this.getInputForSegment(t.initSegment ?? t.firstSegment));
    const s = {
      ...this.input._formatOptions,
      isobmff: {
        ...this.input._formatOptions.isobmff,
        // Intercept calls to resolveKeyId to inject our psshBox knowledge into it
        resolveKeyId: this.input._formatOptions.isobmff?.resolveKeyId && ((c) => {
          if (!t.encryption || !(t.encryption.method === "SAMPLE-AES" || t.encryption.method === "SAMPLE-AES-CTR") || !t.encryption.psshBox)
            return this.input._formatOptions.isobmff.resolveKeyId(c);
          let l = c.psshBoxes;
          const { psshBox: u } = t.encryption;
          return (u.keyIds === null || u.keyIds.includes(c.keyId)) && !l.some((d) => to(d, u)) && (l = [...l, u]), this.input._formatOptions.isobmff.resolveKeyId({ ...c, psshBoxes: l });
        })
      }
    }, a = new er({
      source: new iu(t.location.path, async (c) => {
        g(c.isRoot);
        const l = {
          ...c,
          isRoot: !1
        };
        let u;
        const d = t.location.offset > 0 || t.location.length !== null;
        if (!t.encryption || t.encryption.method === "SAMPLE-AES" || t.encryption.method === "SAMPLE-AES-CTR") {
          if (u = await this.input._getSourceCached(l), d) {
            const h = u.source.slice(t.location.offset, t.location.length ?? void 0).ref();
            u.free(), u = h;
          }
        } else if (t.encryption.method === "AES-128") {
          const f = t.encryption;
          g(f.iv);
          let h = await this.input._getSourceCached(l);
          if (d) {
            const w = h.source.slice(t.location.offset, t.location.length ?? void 0).ref();
            h.free(), h = w;
          }
          const p = new $r(h.source), m = ul(p, async () => {
            const y = { stack: [], error: void 0, hasError: !1 };
            try {
              const w = qs(y, await this.input._getSourceCached({ path: f.keyUri, isRoot: !1 }, pd), !1), k = await new $r(w.source).requestSlice(0, Le);
              if (!k)
                throw new Error("Invalid AES-128 key; expected at least 16 bytes of data.");
              return { key: V(k, Le), iv: f.iv };
            } catch (w) {
              y.error = w, y.hasError = !0;
            } finally {
              Ls(y);
            }
          }, () => {
            h.free();
          });
          u = new nu(m).ref();
        } else
          g(!1);
        return u;
      }),
      // Do not allow recursive HLS. Cool on paper, but allows for nasty infinite-depth request trees.
      formats: this.input._formats.filter((c) => !(c instanceof Eo)),
      initInput: n ?? void 0,
      formatOptions: s
    });
    if (a._onFormatDetermined = (c) => {
      if ((t.encryption?.method === "SAMPLE-AES" || t.encryption?.method === "SAMPLE-AES-CTR") && !c._isIsobmff)
        throw new Error("The SAMPLE-AES and SAMPLE-AES-CTR encryption methods are currently only supported for ISOBMFF files.");
    }, this.inputCache.push({
      segment: t,
      input: a,
      age: this.nextInputCacheAge++
    }), this.inputCache.length > 4) {
      const c = On(this.inputCache, (l) => l.age);
      g(c !== -1), this.inputCache.splice(c, 1);
    }
    return a;
  }
  async getLiveRefreshInterval() {
    return this.getRemainingWaitTimeMs() === 0 && await this.runUpdateSegments(), this.streamHasEnded ? null : this.refreshInterval;
  }
}
class uu extends lt {
  constructor(e) {
    super(e), this.metadataPromise = null, this.trackBackings = null, this.internalTracks = null, this.segmentedInputs = [], this.hasMasterPlaylist = !0;
  }
  readMetadata() {
    return this.metadataPromise ??= (async () => {
      g(this.input._rootSource instanceof Or);
      const e = await this.input._reader.requestEntireFile();
      g(e);
      const t = Vo(e, e.length, { ignore: wo }), { rootPath: i } = this.input._rootSource, n = [], s = [];
      for (let d = 1; d < t.length; d++) {
        const f = t[d];
        if (f.startsWith(Is)) {
          const h = d, p = t[++d];
          if (p === void 0)
            throw new Error("Incorrect M3U8 file; a line must follow the #EXT-X-STREAM-INF tag.");
          const m = ht(i, p), y = new Tr(f.slice(Is.length));
          if (y.getAsNumber("bandwidth") === null)
            throw new Error("Invalid M3U8 file; #EXT-X-STREAM-INF tag requires a BANDWIDTH attribute with a valid numerical value.");
          n.push({
            fullPath: m,
            attributes: y,
            lineNumber: h,
            hasOnlyKeyPackets: !1
          });
        } else if (f.startsWith(_s)) {
          const h = new Tr(f.slice(_s.length)), p = h.get("uri");
          if (p === null)
            throw new Error("Invalid M3U8 file; #EXT-X-I-FRAME-STREAM-INF tag requires a URI attribute.");
          if (h.getAsNumber("bandwidth") === null)
            throw new Error("Invalid M3U8 file; #EXT-X-I-FRAME-STREAM-INF tag requires a BANDWIDTH attribute with a valid numerical value.");
          const y = ht(i, p);
          n.push({
            fullPath: y,
            attributes: h,
            lineNumber: d,
            hasOnlyKeyPackets: !0
          });
        } else if (f.startsWith(vs)) {
          const h = new Tr(f.slice(vs.length));
          if (h.get("type") === null)
            throw new Error("Invalid M3U8 file; #EXT-X-MEDIA tag requires a TYPE attribute.");
          if (h.get("group-id") === null)
            throw new Error("Invalid M3U8 file; #EXT-X-MEDIA tag requires a GROUP-ID attribute.");
          let y = null;
          const w = h.get("uri");
          w !== null && (y = ht(i, w)), s.push({ fullPath: y, attributes: h, lineNumber: d });
        } else if (f !== tu) {
          if (f.startsWith(Tn)) {
            const h = new Hs(this, i, null, t);
            this.segmentedInputs = [h], this.hasMasterPlaylist = !1, this.trackBackings = await h.getTrackBackings();
            return;
          }
        }
      }
      const a = [
        ...new Set(s.filter((d) => d.attributes.get("type").toLowerCase() === "video").map((d) => d.attributes.get("group-id")))
      ], o = [
        ...new Set(s.filter((d) => d.attributes.get("type").toLowerCase() === "audio").map((d) => d.attributes.get("group-id")))
      ], c = await Promise.all(n.map(async (d, f) => {
        const h = [], p = d.attributes.get("codecs");
        let m;
        if (p)
          m = p.split(",").map((S) => S.trim());
        else {
          const E = await this.getSegmentedInputForPath(d.fullPath).getTrackBackings(), I = await Promise.all(E.map(async (_) => ({ track: _, codec: await _.getCodec() })));
          m = await Promise.all(I.filter((_) => _.codec !== null).map((_) => _.track.getDecoderConfig().then((F) => F.codec)));
        }
        const y = d.attributes.get("video"), w = d.attributes.get("audio"), b = m.some((S) => Ce.includes(Qe(S))), k = m.some((S) => Ee.includes(Qe(S)));
        if (y !== null && !b) {
          if (!a.includes(y))
            throw new Error(`Invalid M3U8 file; variant stream references video group "${y}" which is not defined in any #EXT-X-MEDIA tags.`);
          const S = s.find((E) => {
            const I = E.attributes.get("group-id"), _ = E.attributes.get("type");
            return I === y && _.toLowerCase() === "video";
          });
          e: if (S) {
            const E = S.attributes.get("uri");
            if (E === null)
              break e;
            const I = ht(i, E), O = (await this.getSegmentedInputForPath(I).getTrackBackings()).find((z) => z.getType() === "video");
            if (!O || await O.getCodec() === null)
              break e;
            const D = await O.getDecoderConfig().then((z) => z?.codec ?? null);
            g(D !== null), m.push(D);
          }
        }
        if (w !== null && !k) {
          if (!o.includes(w))
            throw new Error(`Invalid M3U8 file; variant stream references audio group "${w}" which is not defined in any #EXT-X-MEDIA tags.`);
          const S = s.find((E) => {
            const I = E.attributes.get("group-id"), _ = E.attributes.get("type");
            return I === w && _.toLowerCase() === "audio";
          });
          e: if (S) {
            const E = S.attributes.get("uri");
            if (E === null)
              break e;
            const I = ht(i, E), O = (await this.getSegmentedInputForPath(I).getTrackBackings()).find((z) => z.getType() === "audio");
            if (!O || await O.getCodec() === null)
              break e;
            const D = await O.getDecoderConfig().then((z) => z?.codec ?? null);
            g(D !== null), m.push(D);
          }
        }
        m = [...new Set(m)];
        let A = null, T = null;
        const x = d.attributes.getAsNumber("bandwidth");
        g(x !== null);
        const C = d.attributes.getAsNumber("average-bandwidth"), P = d.attributes.get("name");
        for (const S of m) {
          const E = Qe(S);
          if (E !== null) {
            if (Ce.includes(E)) {
              if (A !== null)
                throw new Error("Unsupported M3U8 file; multiple video codecs found in the CODECS attribute of a variant stream.");
              A = S;
              const I = d.attributes.get("video");
              if (I === null) {
                const _ = d.attributes.get("resolution");
                let F = null, O = null;
                if (_) {
                  const D = _.match(/^(\d+)x(\d+)$/);
                  D && (F = Number(D[1]), O = Number(D[2]));
                }
                h.push({
                  id: -1,
                  demuxer: this,
                  backingTrack: null,
                  default: !0,
                  autoselect: !0,
                  languageCode: ge,
                  lineNumber: d.lineNumber,
                  fullPath: d.fullPath,
                  fullCodecString: A,
                  pairingMask: 1n << BigInt(f),
                  peakBitrate: x,
                  averageBitrate: C,
                  name: P,
                  hasOnlyKeyPackets: d.hasOnlyKeyPackets,
                  info: {
                    type: "video",
                    width: F,
                    height: O
                  }
                });
              } else {
                if (!a.includes(I))
                  throw new Error(`Invalid M3U8 file; variant stream references video group "${I}" which is not defined in any #EXT-X-MEDIA tags.`);
                for (const _ of s) {
                  const F = _.attributes.get("group-id"), O = _.attributes.get("type");
                  if (F !== I || O.toLowerCase() !== "video")
                    continue;
                  const D = _.attributes.get("resolution") ?? d.attributes.get("resolution");
                  let z = null, j = null;
                  if (D) {
                    const Z = D.match(/^(\d+)x(\d+)$/);
                    Z && (z = Number(Z[1]), j = Number(Z[2]));
                  }
                  h.push({
                    id: -1,
                    demuxer: this,
                    backingTrack: null,
                    default: Vr(_.attributes),
                    // Autoselect is inferred to be true if the default is true
                    autoselect: Vr(_.attributes) || js(_.attributes),
                    languageCode: Ks(_.attributes.get("language")),
                    lineNumber: _.lineNumber,
                    fullPath: _.fullPath ?? d.fullPath,
                    fullCodecString: A,
                    pairingMask: 1n << BigInt(f),
                    peakBitrate: null,
                    averageBitrate: null,
                    name: _.attributes.get("name"),
                    hasOnlyKeyPackets: d.hasOnlyKeyPackets,
                    info: {
                      type: "video",
                      width: z,
                      height: j
                    }
                  });
                }
              }
            } else if (Ee.includes(E)) {
              if (T !== null)
                throw new Error("Unsupported M3U8 file; multiple audio codecs found in the CODECS attribute of a variant stream.");
              T = S;
              const I = d.attributes.get("audio");
              if (I === null) {
                const _ = d.attributes.get("channels"), F = _ !== null ? Number(_.split("/")[0]) : null;
                h.push({
                  id: -1,
                  demuxer: this,
                  backingTrack: null,
                  default: !0,
                  autoselect: !0,
                  languageCode: ge,
                  lineNumber: d.lineNumber,
                  fullPath: d.fullPath,
                  fullCodecString: T,
                  pairingMask: 1n << BigInt(f),
                  peakBitrate: x,
                  averageBitrate: C,
                  name: P,
                  hasOnlyKeyPackets: d.hasOnlyKeyPackets,
                  info: {
                    type: "audio",
                    numberOfChannels: F !== null && Number.isInteger(F) && F > 0 ? F : null
                  }
                });
              } else {
                if (!o.includes(I))
                  throw new Error(`Invalid M3U8 file; variant stream references audio group "${I}" which is not defined in any #EXT-X-MEDIA tags.`);
                for (const _ of s) {
                  const F = _.attributes.get("group-id"), O = _.attributes.get("type");
                  if (F !== I || O.toLowerCase() !== "audio")
                    continue;
                  const D = _.attributes.get("channels") ?? d.attributes.get("channels"), z = D !== null ? Number(D.split("/")[0]) : null;
                  h.push({
                    id: -1,
                    demuxer: this,
                    backingTrack: null,
                    default: Vr(_.attributes),
                    // Autoselect is inferred to be true if the default is true
                    autoselect: Vr(_.attributes) || js(_.attributes),
                    languageCode: Ks(_.attributes.get("language")),
                    lineNumber: _.lineNumber,
                    fullPath: _.fullPath ?? d.fullPath,
                    fullCodecString: T,
                    pairingMask: 1n << BigInt(f),
                    peakBitrate: null,
                    averageBitrate: null,
                    name: _.attributes.get("name"),
                    hasOnlyKeyPackets: d.hasOnlyKeyPackets,
                    info: {
                      type: "audio",
                      numberOfChannels: z !== null && Number.isInteger(z) && z > 0 ? z : null
                    }
                  });
                }
              }
            }
          }
        }
        return h;
      })), l = [], u = (d) => {
        const f = l.find((h) => h.fullPath === d.fullPath && h.info.type === d.info.type);
        f ? (f.pairingMask |= d.pairingMask, f.default ||= d.default, f.autoselect ||= d.autoselect, f.lineNumber = Math.min(f.lineNumber, d.lineNumber), d.peakBitrate !== null && (f.peakBitrate = Math.max(f.peakBitrate ?? -1 / 0, d.peakBitrate)), d.averageBitrate !== null && (f.averageBitrate = Math.max(f.averageBitrate ?? -1 / 0, d.averageBitrate)), f.languageCode === ge && (f.languageCode = d.languageCode)) : (d.id = l.length + 1, l.push(d));
      };
      for (const d of c)
        for (const f of d)
          u(f);
      l.sort((d, f) => d.lineNumber - f.lineNumber), this.trackBackings = [];
      for (const d of l)
        d.info.type === "video" ? this.trackBackings.push(new So(d)) : this.trackBackings.push(new xo(d));
      this.internalTracks = l;
    })();
  }
  async getTrackBackings() {
    return await this.readMetadata(), g(this.trackBackings), this.trackBackings;
  }
  getSegmentedInputForPath(e) {
    let t = this.segmentedInputs.find((n) => n.path === e);
    if (t)
      return t;
    let i = null;
    return this.internalTracks && (i = this.internalTracks.filter((s) => s.fullPath === e).map((s) => ({
      id: s.id,
      type: s.info.type
    }))), t = new Hs(this, e, i, null), this.segmentedInputs.push(t), t;
  }
  async getMetadataTags() {
    return {};
  }
  async getMimeType() {
    return yo;
  }
  dispose() {
    if (this.segmentedInputs) {
      for (const e of this.segmentedInputs)
        e.dispose();
      this.segmentedInputs.length = 0;
    }
  }
}
class Ao {
  constructor(e) {
    this.internalTrack = e, this.hydrationPromise = null;
  }
  hydrate() {
    return this.hydrationPromise ??= (async () => {
      const e = this.internalTrack.demuxer.getSegmentedInputForPath(this.internalTrack.fullPath);
      let t = null;
      const n = (await e.getTrackBackings()).filter((s) => s.getType() === this.getType());
      if (n.length === 1)
        t = n[0];
      else if (this instanceof So) {
        for (const s of n)
          if (await s.getCodec() === this.getCodec()) {
            t = s;
            break;
          }
      } else {
        g(this instanceof xo);
        for (const s of n)
          if (await s.getCodec() === this.getCodec()) {
            t = s;
            break;
          }
      }
      if (!t)
        throw new Error("Could not find matching track in underlying media data.");
      this.internalTrack.backingTrack = t;
    })();
  }
  /** If the backing track is already present, delegate synchronously; otherwise, hydrate first. */
  delegate(e) {
    return this.internalTrack.backingTrack ? e() : this.hydrate().then(e);
  }
  getCodec() {
    throw new Error("Not implemented on base class.");
  }
  getDisposition() {
    return {
      ...ct,
      // Meanings are swapped in HLS: "Default" means that a track is the primary track.
      default: this.internalTrack.autoselect,
      primary: this.internalTrack.default
    };
  }
  getId() {
    return this.internalTrack.id;
  }
  getPairingMask() {
    return this.internalTrack.pairingMask;
  }
  getInternalCodecId() {
    return null;
  }
  getLanguageCode() {
    return this.internalTrack.languageCode;
  }
  getName() {
    return this.internalTrack.name;
  }
  getNumber() {
    g(this.internalTrack.demuxer.internalTracks);
    const e = this.internalTrack.info.type;
    let t = 0;
    for (const i of this.internalTrack.demuxer.internalTracks)
      if (i.info.type === e && t++, i === this.internalTrack)
        break;
    return t;
  }
  getTimeResolution() {
    return this.delegate(() => this.internalTrack.backingTrack.getTimeResolution());
  }
  isRelativeToUnixEpoch() {
    return this.delegate(() => this.internalTrack.backingTrack.isRelativeToUnixEpoch());
  }
  getUnixTimeForTimestamp(e) {
    return this.delegate(() => this.internalTrack.backingTrack.getUnixTimeForTimestamp(e));
  }
  getBitrate() {
    return this.internalTrack.peakBitrate;
  }
  getAverageBitrate() {
    return this.internalTrack.averageBitrate;
  }
  async getDurationFromMetadata(e) {
    return await this.hydrate(), this.internalTrack.backingTrack.getDurationFromMetadata(e);
  }
  async getLiveRefreshInterval() {
    return await this.hydrate(), this.internalTrack.backingTrack.getLiveRefreshInterval();
  }
  getHasOnlyKeyPackets() {
    return this.internalTrack.hasOnlyKeyPackets || null;
  }
  async getFirstPacket(e) {
    return await this.hydrate(), this.internalTrack.backingTrack.getFirstPacket(e);
  }
  async getPacket(e, t) {
    return await this.hydrate(), this.internalTrack.backingTrack.getPacket(e, t);
  }
  async getKeyPacket(e, t) {
    return await this.hydrate(), this.internalTrack.backingTrack.getKeyPacket(e, t);
  }
  async getNextPacket(e, t) {
    return await this.hydrate(), this.internalTrack.backingTrack.getNextPacket(e, t);
  }
  async getNextKeyPacket(e, t) {
    return await this.hydrate(), this.internalTrack.backingTrack.getNextKeyPacket(e, t);
  }
}
class So extends Ao {
  constructor(e) {
    super(e);
  }
  get backingVideoTrack() {
    return this.internalTrack.backingTrack;
  }
  getType() {
    return "video";
  }
  getCodec() {
    return Qe(this.internalTrack.fullCodecString);
  }
  getCodedWidth() {
    return this.delegate(() => this.backingVideoTrack.getCodedWidth());
  }
  getCodedHeight() {
    return this.delegate(() => this.backingVideoTrack.getCodedHeight());
  }
  getSquarePixelWidth() {
    return this.delegate(() => this.backingVideoTrack.getSquarePixelWidth());
  }
  getSquarePixelHeight() {
    return this.delegate(() => this.backingVideoTrack.getSquarePixelHeight());
  }
  getMetadataDisplayWidth() {
    return this.backingVideoTrack ? null : this.internalTrack.info.width;
  }
  getMetadataDisplayHeight() {
    return this.backingVideoTrack ? null : this.internalTrack.info.height;
  }
  getRotation() {
    return this.delegate(() => this.backingVideoTrack.getRotation());
  }
  async getColorSpace() {
    return await this.hydrate(), this.backingVideoTrack.getColorSpace();
  }
  async canBeTransparent() {
    return await this.hydrate(), this.backingVideoTrack.canBeTransparent();
  }
  getMetadataCodecParameterString() {
    return this.backingVideoTrack ? null : this.internalTrack.fullCodecString;
  }
  async getDecoderConfig() {
    return await this.hydrate(), this.backingVideoTrack.getDecoderConfig();
  }
}
class xo extends Ao {
  constructor(e) {
    super(e);
  }
  get backingAudioTrack() {
    return this.internalTrack.backingTrack;
  }
  getType() {
    return "audio";
  }
  getCodec() {
    return Qe(this.internalTrack.fullCodecString);
  }
  getNumberOfChannels() {
    return this.internalTrack.info.numberOfChannels !== null ? this.internalTrack.info.numberOfChannels : this.delegate(() => this.backingAudioTrack.getNumberOfChannels());
  }
  getSampleRate() {
    return this.delegate(() => this.backingAudioTrack.getSampleRate());
  }
  getMetadataCodecParameterString() {
    return this.backingAudioTrack ? null : this.internalTrack.fullCodecString;
  }
  async getDecoderConfig() {
    return await this.hydrate(), this.backingAudioTrack.getDecoderConfig();
  }
}
const Vr = (r) => {
  const e = r.get("default");
  if (e === null)
    return !1;
  const t = e.toUpperCase();
  if (t === "YES")
    return !0;
  if (t === "NO")
    return !1;
  throw new Error(`Invalid M3U8 file; #EXT-X-MEDIA DEFAULT attribute must be YES or NO, got "${e}".`);
}, js = (r) => {
  const e = r.get("autoselect");
  if (e === null)
    return !1;
  const t = e.toUpperCase();
  if (t === "YES")
    return !0;
  if (t === "NO")
    return !1;
  throw new Error(`Invalid M3U8 file; #EXT-X-MEDIA AUTOSELECT attribute must be YES or NO, got "${e}".`);
}, Ks = (r) => {
  if (r === null)
    return ge;
  const e = r.split("-")[0];
  return e || ge;
};
class $e {
  constructor() {
    this._isIsobmff = !1;
  }
}
class Po extends $e {
  constructor() {
    super(...arguments), this._isIsobmff = !0;
  }
  /** @internal */
  async _getMajorBrand(e) {
    let t = e._reader.requestSlice(0, 12);
    if (t instanceof Promise && (t = await t), !t)
      return null;
    t.skip(4);
    const i = ie(t, 4);
    return i !== "ftyp" && i !== "styp" ? null : ie(t, 4);
  }
  /** @internal */
  _createDemuxer(e) {
    return new Kn(e);
  }
}
class du extends Po {
  /** @internal */
  async _canReadInput(e) {
    const t = await this._getMajorBrand(e);
    if (t !== null)
      return t !== "qt  ";
    let i = e._reader.requestSlice(4, 4);
    if (i instanceof Promise && (i = await i), !i)
      return !1;
    const n = ie(i, 4);
    return n === "moof" || n === "sidx";
  }
  get name() {
    return "MP4";
  }
  get mimeType() {
    return "video/mp4";
  }
}
class fu extends Po {
  /** @internal */
  async _canReadInput(e) {
    return await this._getMajorBrand(e) === "qt  ";
  }
  get name() {
    return "QuickTime File Format";
  }
  get mimeType() {
    return "video/quicktime";
  }
}
class Co extends $e {
  /** @internal */
  async isSupportedEBMLOfDocType(e, t) {
    let i = e._reader.requestSlice(0, it);
    if (i instanceof Promise && (i = await i), !i)
      return !1;
    const n = co(i);
    if (n === null || n < 1 || n > 8 || H(i, n) !== v.EBML)
      return !1;
    const a = lo(i);
    if (typeof a != "number")
      return !1;
    let o = e._reader.requestSlice(i.filePos, a);
    if (o instanceof Promise && (o = await o), !o)
      return !1;
    const c = i.filePos;
    for (; o.filePos <= c + a - Be; ) {
      const l = et(o);
      if (!l)
        break;
      const { id: u, size: d } = l, f = o.filePos;
      if (d === void 0)
        return !1;
      switch (u) {
        case v.EBMLVersion:
          if (H(o, d) !== 1)
            return !1;
          break;
        case v.EBMLReadVersion:
          if (H(o, d) !== 1)
            return !1;
          break;
        case v.DocType:
          if (qt(o, d) !== t)
            return !1;
          break;
        case v.DocTypeVersion:
          if (H(o, d) > 4)
            return !1;
          break;
      }
      o.filePos = f + d;
    }
    return !0;
  }
  /** @internal */
  _canReadInput(e) {
    return this.isSupportedEBMLOfDocType(e, "matroska");
  }
  /** @internal */
  _createDemuxer(e) {
    return new kl(e);
  }
  get name() {
    return "Matroska";
  }
  get mimeType() {
    return "video/x-matroska";
  }
}
class hu extends Co {
  /** @internal */
  _canReadInput(e) {
    return this.isSupportedEBMLOfDocType(e, "webm");
  }
  get name() {
    return "WebM";
  }
  get mimeType() {
    return "video/webm";
  }
}
class mu extends $e {
  /** @internal */
  async _canReadInput(e) {
    let t = 0;
    for (; ; ) {
      let d = e._reader.requestSlice(t, Fe);
      if (d instanceof Promise && (d = await d), !d)
        break;
      const f = ot(d);
      if (!f)
        break;
      t = d.filePos + f.size;
    }
    const i = await bn(e._reader, t, t + 4096);
    if (!i)
      return !1;
    const n = i.header, s = Ma(n.mpegVersionId, n.channel);
    let a = e._reader.requestSlice(i.startPos + s, 4);
    if (a instanceof Promise && (a = await a), !a)
      return !1;
    const o = R(a);
    if (o === Ra || o === Fa)
      return !0;
    t = i.startPos + i.header.totalSize;
    const l = await bn(e._reader, t, t + _t);
    if (!l)
      return !1;
    const u = l.header;
    return !(n.channel !== u.channel || n.sampleRate !== u.sampleRate);
  }
  /** @internal */
  _createDemuxer(e) {
    return new Sl(e);
  }
  get name() {
    return "MP3";
  }
  get mimeType() {
    return "audio/mpeg";
  }
}
class pu extends $e {
  /** @internal */
  async _canReadInput(e) {
    let t = e._reader.requestSlice(0, 12);
    if (t instanceof Promise && (t = await t), !t)
      return !1;
    const i = ie(t, 4);
    return i !== "RIFF" && i !== "RIFX" && i !== "RF64" ? !1 : (t.skip(4), ie(t, 4) === "WAVE");
  }
  /** @internal */
  _createDemuxer(e) {
    return new Fl(e);
  }
  get name() {
    return "WAVE";
  }
  get mimeType() {
    return "audio/wav";
  }
}
class gu extends $e {
  /** @internal */
  async _canReadInput(e) {
    let t = e._reader.requestSlice(0, 4);
    return t instanceof Promise && (t = await t), t ? ie(t, 4) === "OggS" : !1;
  }
  /** @internal */
  _createDemuxer(e) {
    return new Bl(e);
  }
  get name() {
    return "Ogg";
  }
  get mimeType() {
    return "application/ogg";
  }
}
class yu extends $e {
  /** @internal */
  async _canReadInput(e) {
    let t = 0;
    for (; ; ) {
      let n = e._reader.requestSlice(t, Fe);
      if (n instanceof Promise && (n = await n), !n)
        break;
      const s = ot(n);
      if (!s)
        break;
      t = n.filePos + s.size;
    }
    let i = e._reader.requestSlice(t, 4);
    return i instanceof Promise && (i = await i), i ? ie(i, 4) === "fLaC" : !1;
  }
  get name() {
    return "FLAC";
  }
  get mimeType() {
    return "audio/flac";
  }
  /** @internal */
  _createDemuxer(e) {
    return new Ll(e);
  }
}
class wu extends $e {
  /** @internal */
  async _canReadInput(e) {
    let t = 0;
    for (; ; ) {
      let a = e._reader.requestSlice(t, Fe);
      if (a instanceof Promise && (a = await a), !a)
        break;
      const o = ot(a);
      if (!o)
        break;
      t = a.filePos + o.size;
    }
    let i = e._reader.requestSliceRange(t, ui, vt);
    if (i instanceof Promise && (i = await i), !i)
      return !1;
    const n = Ft(i);
    if (!n || (t += n.frameLength, i = e._reader.requestSliceRange(t, ui, vt), i instanceof Promise && (i = await i), !i))
      return !1;
    const s = Ft(i);
    return s ? n.objectType === s.objectType && n.samplingFrequencyIndex === s.samplingFrequencyIndex && n.channelConfiguration === s.channelConfiguration : !1;
  }
  /** @internal */
  _createDemuxer(e) {
    return new zl(e);
  }
  get name() {
    return "ADTS";
  }
  get mimeType() {
    return "audio/aac";
  }
}
class bu extends $e {
  /** @internal */
  async _canReadInput(e) {
    const t = xe + 16 + 1;
    let i = e._reader.requestSlice(0, t);
    if (i instanceof Promise && (i = await i), !i)
      return !1;
    const n = V(i, t);
    return n[0] === 71 && n[xe] === 71 || n[0] === 71 && n[xe + 16] === 71 ? !0 : n[4] === 71 && n[4 + xe + 4] === 71;
  }
  /** @internal */
  _createDemuxer(e) {
    return new $l(e);
  }
  get name() {
    return "MPEG Transport Stream";
  }
  get mimeType() {
    return "video/MP2T";
  }
}
class Eo extends $e {
  /** @internal */
  async _canReadInput(e) {
    let t = e._reader.requestSlice(0, 7);
    if (t instanceof Promise && (t = await t), !t || !(ie(t, 7) === "#EXTM3U"))
      return !1;
    if (!(e._rootSource instanceof Or))
      throw new TypeError("HLS inputs require `InputOptions.source` to be a PathedSource or a ref to one.");
    return e._rootSource._usedForHls = !0, !0;
  }
  /** @internal */
  _createDemuxer(e) {
    return new uu(e);
  }
  get name() {
    return "HTTP Live Streaming (HLS)";
  }
  get mimeType() {
    return yo;
  }
}
const ku = /* @__PURE__ */ new du(), Tu = /* @__PURE__ */ new fu(), Au = /* @__PURE__ */ new Co(), Su = /* @__PURE__ */ new hu(), xu = /* @__PURE__ */ new mu(), Pu = /* @__PURE__ */ new pu(), Cu = /* @__PURE__ */ new gu(), Eu = /* @__PURE__ */ new wu(), Iu = /* @__PURE__ */ new yu(), _u = /* @__PURE__ */ new bu(), vu = /* @__PURE__ */ new Eo(), Qs = [vu, ku, Tu, Au, Su, Pu, Cu, Iu, xu, Eu, _u], Bu = (r, e) => {
  if (!r || typeof r != "object")
    throw new TypeError(`${e}, when provided, must be an object.`);
  if (r.isobmff !== void 0) {
    if (!r.isobmff || typeof r.isobmff != "object")
      throw new TypeError(`${e}.isobmff, when provided, must be an object.`);
    if (r.isobmff.resolveKeyId !== void 0 && typeof r.isobmff.resolveKeyId != "function")
      throw new TypeError(`${e}.isobmff.resolveKeyId, when provided, must be a function.`);
  }
  if (r.hls !== void 0) {
    if (!r.hls || typeof r.hls != "object")
      throw new TypeError(`${e}.hls, when provided, must be an object.`);
    if (r.hls.offsetTimestampsByDateTime !== void 0 && typeof r.hls.offsetTimestampsByDateTime != "boolean")
      throw new TypeError(`${e}.hls.offsetTimestampsByDateTime, when provided, must be a boolean.`);
  }
};
const Gs = /* @__PURE__ */ new Map(), Ru = (r, e) => {
  if (!e || typeof e != "object")
    throw new TypeError("options must be an object.");
  if (e.codec !== void 0 && typeof e.codec != "string")
    throw new TypeError("options.codec, when provided, must be a string.");
  if (e.codec !== void 0 && Qe(e.codec) !== r)
    throw new TypeError(`options.codec, when provided, must match the specified codec (${r}).`);
  if (e.numberOfChannels !== void 0 && (!Number.isInteger(e.numberOfChannels) || e.numberOfChannels <= 0))
    throw new TypeError("options.numberOfChannels, when provided, must be a positive integer.");
  if (e.sampleRate !== void 0 && (!Number.isInteger(e.sampleRate) || e.sampleRate <= 0))
    throw new TypeError("options.sampleRate, when provided, must be a positive integer.");
  if (e.description !== void 0 && !Br(e.description))
    throw new TypeError("options.description, when provided, must be a buffer source.");
}, Fu = async (r, e = {}) => {
  if (!Ee.includes(r))
    return !1;
  Ru(r, e);
  const t = {
    ...e,
    numberOfChannels: e.numberOfChannels ?? 2,
    sampleRate: e.sampleRate ?? 48e3,
    codec: e.codec ?? Ia(r, 2, 48e3)
  };
  if (t.description === void 0) {
    const a = gc(t);
    if (a === !1)
      return !1;
    t.description = a;
  }
  const i = JSON.stringify(t), n = Gs.get(i);
  if (n)
    return n;
  const s = (async () => Xn.some((o) => o.supports(r, t)) || ye.includes(r) ? !0 : typeof AudioDecoder > "u" ? !1 : (await AudioDecoder.isConfigSupported(t)).supported === !0)();
  return Gs.set(i, s), s;
};
var Mu = function(r, e, t) {
  if (e != null) {
    if (typeof e != "object" && typeof e != "function") throw new TypeError("Object expected.");
    var i, n;
    if (t) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      i = e[Symbol.asyncDispose];
    }
    if (i === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      i = e[Symbol.dispose], t && (n = i);
    }
    if (typeof i != "function") throw new TypeError("Object not disposable.");
    n && (i = function() {
      try {
        n.call(this);
      } catch (s) {
        return Promise.reject(s);
      }
    }), r.stack.push({ value: e, dispose: i, async: t });
  } else t && r.stack.push({ async: !0 });
  return e;
}, zu = /* @__PURE__ */ (function(r) {
  return function(e) {
    function t(a) {
      e.error = e.hasError ? new r(a, e.error, "An error was suppressed during disposal.") : a, e.hasError = !0;
    }
    var i, n = 0;
    function s() {
      for (; i = e.stack.pop(); )
        try {
          if (!i.async && n === 1) return n = 0, e.stack.push(i), Promise.resolve().then(s);
          if (i.dispose) {
            var a = i.dispose.call(i.value);
            if (i.async) return n |= 2, Promise.resolve(a).then(s, function(o) {
              return t(o), s();
            });
          } else n |= 1;
        } catch (o) {
          t(o);
        }
      if (n === 1) return e.hasError ? Promise.reject(e.error) : Promise.resolve();
      if (e.hasError) throw e.error;
    }
    return s();
  };
})(typeof SuppressedError == "function" ? SuppressedError : function(r, e, t) {
  var i = new Error(t);
  return i.name = "SuppressedError", i.error = r, i.suppressed = e, i;
});
Mn();
let Xs = -1 / 0, $s = -1 / 0, vr = null;
typeof FinalizationRegistry < "u" && (vr = new FinalizationRegistry((r) => {
  const e = performance.now();
  r.type === "video" ? (e - Xs >= 1e3 && (q._error("A VideoSample was garbage collected without first being closed. For proper resource management, make sure to call close() on all your VideoSamples as soon as you're done using them."), Xs = e), typeof VideoFrame < "u" && r.data instanceof VideoFrame && r.data.close()) : (e - $s >= 1e3 && (q._error("An AudioSample was garbage collected without first being closed. For proper resource management, make sure to call close() on all your AudioSamples as soon as you're done using them."), $s = e), typeof AudioData < "u" && r.data instanceof AudioData && r.data.close());
}));
class bt {
  constructor() {
    this._referenceCount = 0, this._lastAllocationBuffer = null;
  }
}
const An = [
  // 4:2:0 Y, U, V
  "I420",
  "I420P10",
  "I420P12",
  // 4:2:0 Y, U, V, A
  "I420A",
  "I420AP10",
  "I420AP12",
  // 4:2:2 Y, U, V
  "I422",
  "I422P10",
  "I422P12",
  // 4:2:2 Y, U, V, A
  "I422A",
  "I422AP10",
  "I422AP12",
  // 4:4:4 Y, U, V
  "I444",
  "I444P10",
  "I444P12",
  // 4:4:4 Y, U, V, A
  "I444A",
  "I444AP10",
  "I444AP12",
  // 4:2:0 Y, UV
  "NV12",
  // 4:4:4 RGBA
  "RGBA",
  // 4:4:4 RGBX (opaque)
  "RGBX",
  // 4:4:4 BGRA
  "BGRA",
  // 4:4:4 BGRX (opaque)
  "BGRX"
], Ou = new Set(An);
class me {
  /** The width of the frame in pixels. */
  get codedWidth() {
    return this.visibleRect.width;
  }
  /** The height of the frame in pixels. */
  get codedHeight() {
    return this.visibleRect.height;
  }
  /** The display width of the frame in pixels, after aspect ratio adjustment and rotation. */
  get displayWidth() {
    return this.rotation % 180 === 0 ? this.squarePixelWidth : this.squarePixelHeight;
  }
  /** The display height of the frame in pixels, after aspect ratio adjustment and rotation. */
  get displayHeight() {
    return this.rotation % 180 === 0 ? this.squarePixelHeight : this.squarePixelWidth;
  }
  /** The presentation timestamp of the frame in microseconds. */
  get microsecondTimestamp() {
    return Math.trunc(mt * this.timestamp);
  }
  /** The duration of the frame in microseconds. */
  get microsecondDuration() {
    return Math.trunc(mt * this.duration);
  }
  /**
   * Whether this sample uses a pixel format that can hold transparency data. Note that this doesn't necessarily mean
   * that the sample is transparent.
   */
  get hasAlpha() {
    return this.format && this.format.includes("A");
  }
  constructor(e, t) {
    if (this._closed = !1, e instanceof ArrayBuffer || typeof SharedArrayBuffer < "u" && e instanceof SharedArrayBuffer || ArrayBuffer.isView(e)) {
      if (!t || typeof t != "object")
        throw new TypeError("init must be an object.");
      if (t.format === void 0 || !Ou.has(t.format))
        throw new TypeError("init.format must be one of: " + An.join(", "));
      if (!Number.isInteger(t.codedWidth) || t.codedWidth <= 0)
        throw new TypeError("init.codedWidth must be a positive integer.");
      if (!Number.isInteger(t.codedHeight) || t.codedHeight <= 0)
        throw new TypeError("init.codedHeight must be a positive integer.");
      if (t.rotation !== void 0 && ![0, 90, 180, 270].includes(t.rotation))
        throw new TypeError("init.rotation, when provided, must be 0, 90, 180, or 270.");
      if (!Number.isFinite(t.timestamp))
        throw new TypeError("init.timestamp must be a number.");
      if (t.duration !== void 0 && (!Number.isFinite(t.duration) || t.duration < 0))
        throw new TypeError("init.duration, when provided, must be a non-negative number.");
      if (t.layout !== void 0) {
        if (!Array.isArray(t.layout))
          throw new TypeError("init.layout, when provided, must be an array.");
        for (const s of t.layout) {
          if (!s || typeof s != "object" || Array.isArray(s))
            throw new TypeError("Each entry in init.layout must be an object.");
          if (!Number.isInteger(s.offset) || s.offset < 0)
            throw new TypeError("plane.offset must be a non-negative integer.");
          if (!Number.isInteger(s.stride) || s.stride < 0)
            throw new TypeError("plane.stride must be a non-negative integer.");
        }
      }
      if (t.visibleRect !== void 0 && zi(t.visibleRect, "init.visibleRect"), t.displayWidth !== void 0 && (!Number.isInteger(t.displayWidth) || t.displayWidth <= 0))
        throw new TypeError("init.displayWidth, when provided, must be a positive integer.");
      if (t.displayHeight !== void 0 && (!Number.isInteger(t.displayHeight) || t.displayHeight <= 0))
        throw new TypeError("init.displayHeight, when provided, must be a positive integer.");
      if (t.displayWidth !== void 0 != (t.displayHeight !== void 0))
        throw new TypeError("init.displayWidth and init.displayHeight must be either both provided or both omitted.");
      this.format = t.format, this.rotation = t.rotation ?? 0, this.timestamp = t.timestamp, this.duration = t.duration ?? 0;
      const i = t.layout ?? Vu(t.format, t.codedWidth, t.codedHeight);
      let n = t.colorSpace ?? null;
      n === null && (this.format === "RGBA" || this.format === "RGBX" || this.format === "BGRA" || this.format === "BGRX" ? n = {
        primaries: "bt709",
        transfer: "iec61966-2-1",
        matrix: "rgb",
        fullRange: !0
      } : n = {
        primaries: "bt709",
        transfer: "bt709",
        matrix: "bt709",
        fullRange: !1
      }), this.visibleRect = {
        left: t.visibleRect?.left ?? 0,
        top: t.visibleRect?.top ?? 0,
        width: t.visibleRect?.width ?? t.codedWidth,
        height: t.visibleRect?.height ?? t.codedHeight
      }, t.displayWidth !== void 0 ? (this.squarePixelWidth = this.rotation % 180 === 0 ? t.displayWidth : t.displayHeight, this.squarePixelHeight = this.rotation % 180 === 0 ? t.displayHeight : t.displayWidth) : (this.squarePixelWidth = this.visibleRect.width, this.squarePixelHeight = this.visibleRect.height), this._data = t._doNotCopy ? be(e) : be(e).slice(), this._layout = i, this.colorSpace = new Li(n);
    } else if (typeof VideoFrame < "u" && e instanceof VideoFrame) {
      if (t?.rotation !== void 0 && ![0, 90, 180, 270].includes(t.rotation))
        throw new TypeError("init.rotation, when provided, must be 0, 90, 180, or 270.");
      if (t?.timestamp !== void 0 && !Number.isFinite(t?.timestamp))
        throw new TypeError("init.timestamp, when provided, must be a number.");
      if (t?.duration !== void 0 && (!Number.isFinite(t.duration) || t.duration < 0))
        throw new TypeError("init.duration, when provided, must be a non-negative number.");
      t?.visibleRect !== void 0 && zi(t.visibleRect, "init.visibleRect"), this._data = e, this._layout = null, this.format = e.format, this.visibleRect = {
        left: e.visibleRect?.x ?? 0,
        top: e.visibleRect?.y ?? 0,
        width: e.visibleRect?.width ?? e.codedWidth,
        height: e.visibleRect?.height ?? e.codedHeight
      }, this.rotation = t?.rotation ?? 0, this.squarePixelWidth = e.displayWidth, this.squarePixelHeight = e.displayHeight, this.timestamp = t?.timestamp ?? e.timestamp / 1e6, this.duration = t?.duration ?? (e.duration ?? 0) / 1e6, this.colorSpace = new Li(e.colorSpace);
    } else if (typeof HTMLImageElement < "u" && e instanceof HTMLImageElement || typeof SVGImageElement < "u" && e instanceof SVGImageElement || typeof ImageBitmap < "u" && e instanceof ImageBitmap || typeof HTMLVideoElement < "u" && e instanceof HTMLVideoElement || typeof HTMLCanvasElement < "u" && e instanceof HTMLCanvasElement || typeof OffscreenCanvas < "u" && e instanceof OffscreenCanvas) {
      if (!t || typeof t != "object")
        throw new TypeError("init must be an object.");
      if (t.rotation !== void 0 && ![0, 90, 180, 270].includes(t.rotation))
        throw new TypeError("init.rotation, when provided, must be 0, 90, 180, or 270.");
      if (!Number.isFinite(t.timestamp))
        throw new TypeError("init.timestamp must be a number.");
      if (t.duration !== void 0 && (!Number.isFinite(t.duration) || t.duration < 0))
        throw new TypeError("init.duration, when provided, must be a non-negative number.");
      if (t.visibleRect !== void 0 && zi(t.visibleRect, "init.visibleRect"), typeof VideoFrame < "u")
        return new me(new VideoFrame(e, {
          timestamp: Math.trunc(t.timestamp * mt),
          // Drag 0 to undefined
          duration: Math.trunc((t.duration ?? 0) * mt) || void 0,
          // WebCodecs wants DOMRectInit
          visibleRect: t.visibleRect && {
            x: t.visibleRect.left,
            y: t.visibleRect.top,
            width: t.visibleRect.width,
            height: t.visibleRect.height
          }
        }), t);
      let i = 0, n = 0;
      if ("naturalWidth" in e ? (i = e.naturalWidth, n = e.naturalHeight) : "videoWidth" in e ? (i = e.videoWidth, n = e.videoHeight) : "width" in e && (i = Number(e.width), n = Number(e.height)), !i || !n)
        throw new TypeError("Could not determine dimensions.");
      const s = t.visibleRect ?? { left: 0, top: 0, width: i, height: n }, a = new OffscreenCanvas(s.width, s.height), o = a.getContext("2d", {
        alpha: Sa(),
        // Firefox has VideoFrame glitches with opaque canvases
        willReadFrequently: !0
      });
      if (!o)
        throw new Error("OffscreenCanvas must have support for the '2d' context in order to create a VideoSample from this data.");
      o.drawImage(e, -s.left, -s.top), this._data = a, this._layout = null, this.format = "RGBX", this.visibleRect = { left: 0, top: 0, width: s.width, height: s.height }, this.squarePixelWidth = s.width, this.squarePixelHeight = s.height, this.rotation = t.rotation ?? 0, this.timestamp = t.timestamp, this.duration = t.duration ?? 0, this.colorSpace = new Li({
        matrix: "rgb",
        primaries: "bt709",
        transfer: "iec61966-2-1",
        fullRange: !0
      });
    } else if (e instanceof bt) {
      if (!t || typeof t != "object")
        throw new TypeError("init must be an object.");
      if (t.rotation !== void 0 && ![0, 90, 180, 270].includes(t.rotation))
        throw new TypeError("init.rotation, when provided, must be 0, 90, 180, or 270.");
      if (!Number.isFinite(t.timestamp))
        throw new TypeError("init.timestamp must be a number.");
      if (t.duration !== void 0 && (!Number.isFinite(t.duration) || t.duration < 0))
        throw new TypeError("init.duration, when provided, must be a non-negative number.");
      if (this._data = e, e._referenceCount++, this.format = e.getFormat(), this.format !== null && !An.includes(this.format))
        throw new TypeError("getFormat() must return a VideoSamplePixelFormat or null.");
      if (this.visibleRect = {
        left: 0,
        top: 0,
        width: e.getCodedWidth(),
        height: e.getCodedHeight()
      }, !Number.isInteger(this.visibleRect.width) || this.visibleRect.width <= 0)
        throw new TypeError("getCodedWidth() must return a positive integer.");
      if (!Number.isInteger(this.visibleRect.height) || this.visibleRect.height <= 0)
        throw new TypeError("getCodedHeight() must return a positive integer.");
      if (this.squarePixelWidth = e.getSquarePixelWidth(), !Number.isInteger(this.squarePixelWidth) || this.squarePixelWidth <= 0)
        throw new TypeError("getSquarePixelWidth() must return a positive integer.");
      if (this.squarePixelHeight = e.getSquarePixelHeight(), !Number.isInteger(this.squarePixelHeight) || this.squarePixelHeight <= 0)
        throw new TypeError("getSquarePixelHeight() must return a positive integer.");
      this.rotation = t.rotation ?? 0, this.timestamp = t.timestamp, this.duration = t.duration ?? 0, this.colorSpace = e.getColorSpace();
    } else
      throw new TypeError("Invalid data type: Must be a BufferSource, CanvasImageSource, or VideoSampleResource.");
    this.encodeOptions = t?.encodeOptions ?? {}, this.pixelAspectRatio = Cr({
      num: this.squarePixelWidth * this.codedHeight,
      den: this.squarePixelHeight * this.codedWidth
    }), vr?.register(this, { type: "video", data: this._data }, this);
  }
  /** Clones this video sample. */
  clone() {
    if (this._closed)
      throw new Error("VideoSample is closed.");
    return g(this._data !== null), this._data instanceof bt ? new me(this._data, {
      timestamp: this.timestamp,
      duration: this.duration,
      rotation: this.rotation,
      encodeOptions: this.encodeOptions
    }) : or(this._data) ? new me(this._data.clone(), {
      timestamp: this.timestamp,
      duration: this.duration,
      rotation: this.rotation,
      encodeOptions: this.encodeOptions
    }) : this._data instanceof Uint8Array ? (g(this._layout), new me(this._data, {
      format: this.format,
      layout: this._layout,
      codedWidth: this.codedWidth,
      codedHeight: this.codedHeight,
      timestamp: this.timestamp,
      duration: this.duration,
      colorSpace: this.colorSpace,
      rotation: this.rotation,
      visibleRect: this.visibleRect,
      displayWidth: this.displayWidth,
      displayHeight: this.displayHeight,
      encodeOptions: this.encodeOptions,
      // It's already been copied, if we copy it again we make the clone unnecessarily expensive
      _doNotCopy: !0
    })) : new me(this._data, {
      format: this.format,
      codedWidth: this.codedWidth,
      codedHeight: this.codedHeight,
      timestamp: this.timestamp,
      duration: this.duration,
      colorSpace: this.colorSpace,
      rotation: this.rotation,
      visibleRect: this.visibleRect,
      displayWidth: this.displayWidth,
      displayHeight: this.displayHeight,
      encodeOptions: this.encodeOptions
    });
  }
  /**
   * Closes this video sample, releasing held resources. Video samples should be closed as soon as they are not
   * needed anymore.
   */
  close() {
    this._closed || (vr?.unregister(this), this._data instanceof bt ? (this._data._referenceCount--, this._data._referenceCount === 0 && this._data.close()) : or(this._data) ? this._data.close() : this._data = null, this._closed = !0);
  }
  /**
   * Returns the number of bytes required to hold this video sample's pixel data.
   */
  allocationSize(e = {}) {
    if (Js(e), this._closed)
      throw new Error("VideoSample is closed.");
    if ((e.format ?? this.format) == null)
      throw new Error("Cannot get allocation size when format is null.");
    return or(this._data) ? this._data.allocationSize(e) : ea(this, e).allocationSize;
  }
  /**
   * Copies this video sample's pixel data to an ArrayBuffer or ArrayBufferView.
   * @returns The byte layout of the planes of the copied data.
   */
  async copyTo(e, t = {}) {
    if (!Br(e))
      throw new TypeError("destination must be an ArrayBuffer or an ArrayBuffer view.");
    if (Js(t), this._closed)
      throw new Error("VideoSample is closed.");
    if ((t.format ?? this.format) == null)
      throw new Error("Cannot copy video sample data when format is null.");
    if (g(this._data !== null), or(this._data))
      return this._data.copyTo(e, t);
    if (t.format && !["RGBA", "RGBX", "BGRA", "BGRX"].includes(this.format) && ["RGBA", "RGBX", "BGRA", "BGRX"].includes(t.format))
      if (this._data instanceof bt) {
        const l = { stack: [], error: void 0, hasError: !1 };
        try {
          const u = Mu(l, await this._data.toRgbSample({
            timestamp: this.timestamp,
            duration: this.duration,
            rotation: this.rotation
          }, t.colorSpace ?? "srgb"), !1);
          if (!(u instanceof me))
            throw new TypeError("toRgbSample() must return a VideoSample.");
          if (!["RGBA", "RGBX", "BGRA", "BGRX"].includes(u.format))
            throw new Error(`Sample returned by toRgbSample was expected to have an RGB format, got '${u.format}' instead.`);
          return await u.copyTo(e, t);
        } catch (u) {
          l.error = u, l.hasError = !0;
        } finally {
          zu(l);
        }
      } else {
        if (typeof VideoFrame > "u")
          throw new Error("For this sample, converting from a non-RGB to an RGB format requires VideoFrame to be defined.");
        const l = this.toVideoFrame(), u = await l.copyTo(e, t);
        return l.close(), u;
      }
    const i = ea(this, t);
    g(this.format);
    const n = be(e);
    if (n.byteLength < i.allocationSize)
      throw new TypeError(`Destination buffer too small. Required: ${i.allocationSize}, Available: ${n.byteLength}`);
    const s = Ci(this.format);
    let a;
    if (this._data instanceof bt) {
      let l = this._data.getDataPlanes();
      if (l instanceof Promise && (l = await l), !Array.isArray(l) || l.some((u) => !(u.data instanceof Uint8Array) || !Number.isInteger(u.stride) || u.stride < 0))
        throw new TypeError('getDataPlanes() must return an array of objects with a Uint8Array "data" property and a non-negative integer "stride" property.');
      a = l;
    } else if (this._data instanceof Uint8Array)
      g(this._layout), g(this._layout.length === s.length), a = this._layout.map((l, u) => {
        const d = Math.ceil(this.codedHeight / s[u].heightDivisor);
        return {
          data: this._data.subarray(l.offset, l.offset + l.stride * d),
          stride: l.stride
        };
      });
    else {
      const u = this._data.getContext("2d");
      g(u);
      const d = u.getImageData(0, 0, this.codedWidth, this.codedHeight);
      a = [{
        data: be(d.data),
        stride: 4 * this.codedWidth
      }];
    }
    const o = [], c = s.length;
    for (let l = 0; l < c; l++) {
      const u = i.computedLayouts[l], d = a[l].stride, f = a[l].data;
      let h = u.sourceTop * d;
      h += u.sourceLeftBytes;
      let p = u.destinationOffset;
      const m = u.sourceWidthBytes, y = {
        offset: p,
        stride: u.destinationStride
      };
      for (let w = 0; w < u.sourceHeight; w++) {
        if (h + m > f.byteLength)
          throw new Error("Source buffer OOB read.");
        if (p + m > n.byteLength)
          throw new Error("Destination buffer OOB write.");
        const b = f.subarray(h, h + m);
        n.set(b, p), h += d, p += u.destinationStride;
      }
      o.push(y);
    }
    if (t.format !== void 0) {
      const l = this.format.startsWith("RGB") !== t.format.startsWith("RGB"), u = this.format.includes("X") && t.format.includes("A");
      if (l || u)
        for (let d = 0; d < i.allocationSize; d += 4) {
          if (l) {
            const f = n[d], h = n[d + 2];
            n[d] = h, n[d + 2] = f;
          }
          u && (n[d + 3] = 255);
        }
    }
    return o;
  }
  /**
   * Converts this video sample to a VideoFrame for use with the WebCodecs API. The VideoFrame returned by this
   * method *must* be closed separately from this video sample.
   */
  toVideoFrame() {
    if (this._closed)
      throw new Error("VideoSample is closed.");
    if (g(this._data !== null), this._data instanceof bt) {
      if (this.format === null)
        throw new Error("Cannot convert a VideoSampleResource-backed VideoSample to VideoFrame if format is null.");
      const e = this._data.getDataPlanes();
      if (e instanceof Promise)
        throw new Error("Cannot convert a VideoSampleResource-backed VideoSample to VideoFrame if getDataPlanes() returns a promise.");
      const t = e.reduce((a, o) => a + o.data.byteLength, 0), i = new Uint8Array(t);
      let n = 0;
      const s = [];
      for (const a of e)
        i.set(a.data, n), s.push(n), n += a.data.byteLength;
      return new VideoFrame(i, {
        format: this.format,
        layout: e.map((a, o) => ({
          offset: s[o],
          stride: a.stride
        })),
        codedWidth: this.codedWidth,
        codedHeight: this.codedHeight,
        timestamp: this.microsecondTimestamp,
        duration: this.microsecondDuration,
        colorSpace: this.colorSpace,
        visibleRect: this.visibleRect,
        displayWidth: this.squarePixelWidth,
        // Not display* since we're not passing rotation
        displayHeight: this.squarePixelHeight
      });
    } else return or(this._data) ? new VideoFrame(this._data, {
      timestamp: this.microsecondTimestamp,
      duration: this.microsecondDuration || void 0
      // Drag 0 duration to undefined, glitches some codecs
    }) : this._data instanceof Uint8Array ? (g(this._layout), new VideoFrame(this._data, {
      format: this.format,
      codedWidth: this.codedWidth,
      // This is technically wrong! codedWidth is a lie technically. But, since
      codedHeight: this.codedHeight,
      // we pass the layout (which contains the true coded width), we're good.
      layout: this._layout,
      timestamp: this.microsecondTimestamp,
      duration: this.microsecondDuration || void 0,
      colorSpace: this.colorSpace,
      visibleRect: this.visibleRect,
      displayWidth: this.squarePixelWidth,
      // Not display* since we're not passing rotation
      displayHeight: this.squarePixelHeight
    })) : new VideoFrame(this._data, {
      timestamp: this.microsecondTimestamp,
      duration: this.microsecondDuration || void 0
    });
  }
  draw(e, t, i, n, s, a, o, c, l) {
    let u = 0, d = 0, f = this.displayWidth, h = this.displayHeight, p = 0, m = 0, y = this.displayWidth, w = this.displayHeight;
    if (a !== void 0 ? (u = t, d = i, f = n, h = s, p = a, m = o, c !== void 0 ? (y = c, w = l) : (y = f, w = h)) : (p = t, m = i, n !== void 0 && (y = n, w = s)), !(typeof CanvasRenderingContext2D < "u" && e instanceof CanvasRenderingContext2D || typeof OffscreenCanvasRenderingContext2D < "u" && e instanceof OffscreenCanvasRenderingContext2D))
      throw new TypeError("context must be a CanvasRenderingContext2D or OffscreenCanvasRenderingContext2D.");
    if (!Number.isFinite(u))
      throw new TypeError("sx must be a number.");
    if (!Number.isFinite(d))
      throw new TypeError("sy must be a number.");
    if (!Number.isFinite(f) || f < 0)
      throw new TypeError("sWidth must be a non-negative number.");
    if (!Number.isFinite(h) || h < 0)
      throw new TypeError("sHeight must be a non-negative number.");
    if (!Number.isFinite(p))
      throw new TypeError("dx must be a number.");
    if (!Number.isFinite(m))
      throw new TypeError("dy must be a number.");
    if (!Number.isFinite(y) || y < 0)
      throw new TypeError("dWidth must be a non-negative number.");
    if (!Number.isFinite(w) || w < 0)
      throw new TypeError("dHeight must be a non-negative number.");
    if (this._closed)
      throw new Error("VideoSample is closed.");
    ({ sx: u, sy: d, sWidth: f, sHeight: h } = this._rotateSourceRegion(u, d, f, h, this.rotation));
    const b = this.toCanvasImageSource();
    e.save();
    const k = p + y / 2, A = m + w / 2;
    e.translate(k, A), e.rotate(this.rotation * Math.PI / 180);
    const T = this.rotation % 180 === 0 ? 1 : y / w;
    e.scale(1 / T, T), e.drawImage(b, u, d, f, h, -y / 2, -w / 2, y, w), e.restore();
  }
  /**
   * Draws the sample in the middle of the canvas corresponding to the context with the specified fit behavior.
   */
  drawWithFit(e, t) {
    if (!(typeof CanvasRenderingContext2D < "u" && e instanceof CanvasRenderingContext2D || typeof OffscreenCanvasRenderingContext2D < "u" && e instanceof OffscreenCanvasRenderingContext2D))
      throw new TypeError("context must be a CanvasRenderingContext2D or OffscreenCanvasRenderingContext2D.");
    if (!t || typeof t != "object")
      throw new TypeError("options must be an object.");
    if (!["fill", "contain", "cover"].includes(t.fit))
      throw new TypeError("options.fit must be 'fill', 'contain', or 'cover'.");
    if (t.rotation !== void 0 && ![0, 90, 180, 270].includes(t.rotation))
      throw new TypeError("options.rotation, when provided, must be 0, 90, 180, or 270.");
    t.crop !== void 0 && fi(t.crop, "options.");
    const i = e.canvas.width, n = e.canvas.height, s = t.rotation ?? this.rotation, [a, o] = s % 180 === 0 ? [this.squarePixelWidth, this.squarePixelHeight] : [this.squarePixelHeight, this.squarePixelWidth];
    let c = t.crop;
    c && (c = Sn(c, a, o));
    let l, u, d, f;
    const { sx: h, sy: p, sWidth: m, sHeight: y } = this._rotateSourceRegion(t.crop?.left ?? 0, t.crop?.top ?? 0, t.crop?.width ?? a, t.crop?.height ?? o, s);
    if (t.fit === "fill")
      l = 0, u = 0, d = i, f = n;
    else {
      const [b, k] = t.crop ? [t.crop.width, t.crop.height] : [a, o], A = t.fit === "contain" ? Math.min(i / b, n / k) : Math.max(i / b, n / k);
      d = b * A, f = k * A, l = (i - d) / 2, u = (n - f) / 2;
    }
    e.save();
    const w = s % 180 === 0 ? 1 : d / f;
    e.translate(i / 2, n / 2), e.rotate(s * Math.PI / 180), e.scale(1 / w, w), e.translate(-i / 2, -n / 2), e.drawImage(this.toCanvasImageSource(), h, p, m, y, l, u, d, f), e.restore();
  }
  /** @internal */
  _rotateSourceRegion(e, t, i, n, s) {
    return s === 90 ? [e, t, i, n] = [
      t,
      this.squarePixelHeight - e - i,
      n,
      i
    ] : s === 180 ? [e, t] = [
      this.squarePixelWidth - e - i,
      this.squarePixelHeight - t - n
    ] : s === 270 && ([e, t, i, n] = [
      this.squarePixelWidth - t - n,
      e,
      n,
      i
    ]), { sx: e, sy: t, sWidth: i, sHeight: n };
  }
  /**
   * Draws the sample onto the target canvas with fit behavior, manually mipmapping on strong downscales for quality.
   * @internal
   */
  _drawWithFitAndMipmapping(e, t, i) {
    const n = e.width, s = e.height, [a, o] = i.rotation % 180 === 0 ? [this.squarePixelWidth, this.squarePixelHeight] : [this.squarePixelHeight, this.squarePixelWidth], c = i.crop ? i.crop.width : a, l = i.crop ? i.crop.height : o;
    let u = 0;
    2 * n < c && 2 * s < l && (u = Math.floor(Math.log2(Math.min(c / n, l / s))));
    const d = n * 2 ** u, f = s * 2 ** u, { canvas: h, context: p, isNew: m } = u > 0 ? Zs(d, f) : { canvas: e, context: t, isNew: i.targetIsFresh };
    p.imageSmoothingQuality = "high", i.fillBlack ? (p.fillStyle = "black", p.fillRect(0, 0, d, f)) : m || p.clearRect(0, 0, d, f), this.drawWithFit(p, {
      fit: i.fit,
      rotation: i.rotation,
      crop: i.crop
    }), p.globalCompositeOperation = "copy";
    for (let y = u; y > 1; y--) {
      const w = n * 2 ** y, b = s * 2 ** y;
      p.drawImage(h, 0, 0, w, b, 0, 0, w / 2, b / 2);
    }
    p.globalCompositeOperation = "source-over", u > 0 && (t.imageSmoothingQuality = "high", t.globalCompositeOperation = "copy", t.drawImage(h, 0, 0, 2 * n, 2 * s, 0, 0, n, s), t.globalCompositeOperation = "source-over");
  }
  /**
   * Converts this video sample to a
   * [`CanvasImageSource`](https://udn.realityripple.com/docs/Web/API/CanvasImageSource) for drawing to a canvas.
   *
   * You must use the value returned by this method immediately, as any VideoFrame created internally may
   * automatically be closed in the next microtask.
   */
  toCanvasImageSource() {
    if (this._closed)
      throw new Error("VideoSample is closed.");
    if (g(this._data !== null), this._data instanceof bt || this._data instanceof Uint8Array) {
      const e = this.toVideoFrame();
      return queueMicrotask(() => e.close()), e;
    } else
      return this._data;
  }
  /**
   * Transform this video sample to a new video sample given the options. Can be used to resize, rotate, and crop
   * the sample.
   *
   * In non-browser environments, this method will not work by default. To make it work, register a custom
   * transformer function via {@link registerVideoSampleTransformer}.
   */
  async transform(e) {
    if (!e || typeof e != "object")
      throw new TypeError("options must be an object.");
    if (e.width !== void 0 && (!Number.isInteger(e.width) || e.width <= 0))
      throw new TypeError("options.width, when provided, must be a positive integer.");
    if (e.height !== void 0 && (!Number.isInteger(e.height) || e.height <= 0))
      throw new TypeError("options.height, when provided, must be a positive integer.");
    if (e.roundDimensionsTo !== void 0 && (!Number.isInteger(e.roundDimensionsTo) || e.roundDimensionsTo <= 0))
      throw new TypeError("options.roundDimensionsTo, when provided, must be a positive integer.");
    if (e.fit !== void 0 && !["fill", "contain", "cover"].includes(e.fit))
      throw new TypeError('options.fit, when provided, must be one of "fill", "contain", or "cover".');
    if (e.width !== void 0 && e.height !== void 0 && e.fit === void 0)
      throw new TypeError("When both options.width and options.height are provided, options.fit must also be provided.");
    if (e.rotate !== void 0 && ![0, 90, 180, 270].includes(e.rotate))
      throw new TypeError("options.rotate, when provided, must be 0, 90, 180 or 270.");
    if (e.crop !== void 0 && fi(e.crop, "options."), e.alpha !== void 0 && !["keep", "discard"].includes(e.alpha))
      throw new TypeError("options.alpha, when provided, must be 'keep' or 'discard'.");
    const t = Ar(this.rotation + (e.rotate ?? 0)), [i, n] = t % 180 === 0 ? [this.squarePixelWidth, this.squarePixelHeight] : [this.squarePixelHeight, this.squarePixelWidth];
    let s = e.crop;
    s && (s = Sn(s, i, n));
    const a = s ? s.width : i, o = s ? s.height : n, c = a / o;
    let l, u;
    e.width !== void 0 && e.height === void 0 ? (l = e.width, u = l / c) : e.width === void 0 && e.height !== void 0 ? (u = e.height, l = u * c) : e.width !== void 0 && e.height !== void 0 ? (l = e.width, u = e.height) : (l = a, u = o), l = ln(l, e.roundDimensionsTo ?? 1), u = ln(u, e.roundDimensionsTo ?? 1);
    const d = {
      width: l,
      height: u,
      fit: e.fit ?? "fill",
      rotation: t,
      crop: s ?? {
        left: 0,
        top: 0,
        width: i,
        height: n
      },
      alpha: e.alpha ?? "keep"
    };
    for (const m of Du) {
      let y = m(this, d);
      if (y instanceof Promise && (y = await y), y !== null)
        return y;
    }
    const { canvas: f, context: h, isNew: p } = Zs(d.width, d.height);
    return this._drawWithFitAndMipmapping(f, h, {
      fit: d.fit,
      rotation: d.rotation,
      crop: d.crop,
      targetIsFresh: p,
      fillBlack: d.alpha === "discard"
    }), new me(f, {
      timestamp: this.timestamp,
      duration: this.duration,
      rotation: 0
      // Any previous rotation is now baked in
    });
  }
  /** Sets the rotation metadata of this video sample. */
  setRotation(e) {
    if (![0, 90, 180, 270].includes(e))
      throw new TypeError("newRotation must be 0, 90, 180, or 270.");
    this.rotation = e;
  }
  /** Sets the presentation timestamp of this video sample, in seconds. */
  setTimestamp(e) {
    if (!Number.isFinite(e))
      throw new TypeError("newTimestamp must be a number.");
    this.timestamp = e;
  }
  /** Sets the duration of this video sample, in seconds. */
  setDuration(e) {
    if (!Number.isFinite(e) || e < 0)
      throw new TypeError("newDuration must be a non-negative number.");
    this.duration = e;
  }
  /** Sets the encode options used when this sample is passed to an encoder. */
  setEncodeOptions(e) {
    if (!e || typeof e != "object")
      throw new TypeError("newEncodeOptions must be an object.");
    this.encodeOptions = e;
  }
  /** Calls `.close()`. */
  [Symbol.dispose]() {
    this.close();
  }
}
const Du = [], Nu = 3, ar = [];
let Ys = 0;
const Zs = (r, e) => {
  for (const n of ar)
    if (n.canvas.width === r && n.canvas.height === e)
      return n.age = Ys++, { canvas: n.canvas, context: n.context, isNew: !1 };
  let t;
  if (typeof OffscreenCanvas < "u")
    t = new OffscreenCanvas(r, e);
  else {
    if (typeof window > "u" || typeof document > "u")
      throw new Error("Cannot transform VideoSamples in this environment. Either run in an environment with OffscreenCanvas or HTMLCanvasElement, or supply a custom VideoSample transformer using registerVideoSampleTransformer().");
    t = document.createElement("canvas"), t.width = r, t.height = e;
  }
  const i = t.getContext("2d", {
    alpha: !0,
    willReadFrequently: !1
  });
  if (!i)
    throw new Error("The '2d' canvas context is required to transform VideoSamples. Register a custom transformer using registerVideoSampleTransformer to work around this limitation.");
  return ar.length >= Nu && ar.splice(On(ar, (n) => n.age), 1), ar.push({
    canvas: t,
    context: i,
    age: Ys++
  }), { canvas: t, context: i, isNew: !0 };
};
class Li {
  /** Creates a new VideoSampleColorSpace. */
  constructor(e) {
    if (e !== void 0) {
      if (!e || typeof e != "object")
        throw new TypeError("init.colorSpace, when provided, must be an object.");
      const t = Object.keys(tr);
      if (e.primaries != null && !t.includes(e.primaries))
        throw new TypeError(`init.colorSpace.primaries, when provided, must be one of ${t.join(", ")}.`);
      const i = Object.keys(rr);
      if (e.transfer != null && !i.includes(e.transfer))
        throw new TypeError(`init.colorSpace.transfer, when provided, must be one of ${i.join(", ")}.`);
      const n = Object.keys(ir);
      if (e.matrix != null && !n.includes(e.matrix))
        throw new TypeError(`init.colorSpace.matrix, when provided, must be one of ${n.join(", ")}.`);
      if (e.fullRange != null && typeof e.fullRange != "boolean")
        throw new TypeError("init.colorSpace.fullRange, when provided, must be a boolean.");
    }
    this.primaries = e?.primaries ?? null, this.transfer = e?.transfer ?? null, this.matrix = e?.matrix ?? null, this.fullRange = e?.fullRange ?? null;
  }
  /** Serializes the color space to a JSON object. */
  toJSON() {
    return {
      primaries: this.primaries,
      transfer: this.transfer,
      matrix: this.matrix,
      fullRange: this.fullRange
    };
  }
}
const or = (r) => typeof VideoFrame < "u" && r instanceof VideoFrame, Sn = (r, e, t) => {
  const i = Math.min(r.left, e), n = Math.min(r.top, t), s = Math.min(r.width, e - i), a = Math.min(r.height, t - n);
  return g(s >= 0), g(a >= 0), { left: i, top: n, width: s, height: a };
}, fi = (r, e) => {
  if (!r || typeof r != "object")
    throw new TypeError(e + "crop, when provided, must be an object.");
  if (!Number.isInteger(r.left) || r.left < 0)
    throw new TypeError(e + "crop.left must be a non-negative integer.");
  if (!Number.isInteger(r.top) || r.top < 0)
    throw new TypeError(e + "crop.top must be a non-negative integer.");
  if (!Number.isInteger(r.width) || r.width < 0)
    throw new TypeError(e + "crop.width must be a non-negative integer.");
  if (!Number.isInteger(r.height) || r.height < 0)
    throw new TypeError(e + "crop.height must be a non-negative integer.");
}, Js = (r) => {
  if (!r || typeof r != "object")
    throw new TypeError("options must be an object.");
  if (r.colorSpace !== void 0 && !["display-p3", "srgb"].includes(r.colorSpace))
    throw new TypeError("options.colorSpace, when provided, must be 'display-p3' or 'srgb'.");
  if (r.format !== void 0 && typeof r.format != "string")
    throw new TypeError("options.format, when provided, must be a string.");
  if (r.layout !== void 0) {
    if (!Array.isArray(r.layout))
      throw new TypeError("options.layout, when provided, must be an array.");
    for (const e of r.layout) {
      if (!e || typeof e != "object")
        throw new TypeError("Each entry in options.layout must be an object.");
      if (!Number.isInteger(e.offset) || e.offset < 0)
        throw new TypeError("plane.offset must be a non-negative integer.");
      if (!Number.isInteger(e.stride) || e.stride < 0)
        throw new TypeError("plane.stride must be a non-negative integer.");
    }
  }
  if (r.rect !== void 0) {
    if (!r.rect || typeof r.rect != "object")
      throw new TypeError("options.rect, when provided, must be an object.");
    if (r.rect.x !== void 0 && (!Number.isInteger(r.rect.x) || r.rect.x < 0))
      throw new TypeError("options.rect.x, when provided, must be a non-negative integer.");
    if (r.rect.y !== void 0 && (!Number.isInteger(r.rect.y) || r.rect.y < 0))
      throw new TypeError("options.rect.y, when provided, must be a non-negative integer.");
    if (r.rect.width !== void 0 && (!Number.isInteger(r.rect.width) || r.rect.width < 0))
      throw new TypeError("options.rect.width, when provided, must be a non-negative integer.");
    if (r.rect.height !== void 0 && (!Number.isInteger(r.rect.height) || r.rect.height < 0))
      throw new TypeError("options.rect.height, when provided, must be a non-negative integer.");
  }
}, Vu = (r, e, t) => {
  const i = Ci(r), n = [];
  let s = 0;
  for (const a of i) {
    const o = Math.ceil(e / a.widthDivisor), c = Math.ceil(t / a.heightDivisor), l = o * a.sampleBytes, u = l * c;
    n.push({
      offset: s,
      stride: l
    }), s += u;
  }
  return n;
}, Ci = (r) => {
  const e = (t, i, n, s, a) => {
    const o = [
      { sampleBytes: t, widthDivisor: 1, heightDivisor: 1 },
      { sampleBytes: i, widthDivisor: n, heightDivisor: s },
      { sampleBytes: i, widthDivisor: n, heightDivisor: s }
    ];
    return a && o.push({ sampleBytes: t, widthDivisor: 1, heightDivisor: 1 }), o;
  };
  switch (r) {
    case "I420":
      return e(1, 1, 2, 2, !1);
    case "I420P10":
    case "I420P12":
      return e(2, 2, 2, 2, !1);
    case "I420A":
      return e(1, 1, 2, 2, !0);
    case "I420AP10":
    case "I420AP12":
      return e(2, 2, 2, 2, !0);
    case "I422":
      return e(1, 1, 2, 1, !1);
    case "I422P10":
    case "I422P12":
      return e(2, 2, 2, 1, !1);
    case "I422A":
      return e(1, 1, 2, 1, !0);
    case "I422AP10":
    case "I422AP12":
      return e(2, 2, 2, 1, !0);
    case "I444":
      return e(1, 1, 1, 1, !1);
    case "I444P10":
    case "I444P12":
      return e(2, 2, 1, 1, !1);
    case "I444A":
      return e(1, 1, 1, 1, !0);
    case "I444AP10":
    case "I444AP12":
      return e(2, 2, 1, 1, !0);
    case "NV12":
      return [
        { sampleBytes: 1, widthDivisor: 1, heightDivisor: 1 },
        { sampleBytes: 2, widthDivisor: 2, heightDivisor: 2 }
        // Interleaved U and V
      ];
    case "RGBA":
    case "RGBX":
    case "BGRA":
    case "BGRX":
      return [
        { sampleBytes: 4, widthDivisor: 1, heightDivisor: 1 }
      ];
    default:
      Re(r), g(!1);
  }
}, ea = (r, e) => {
  const t = {
    left: 0,
    top: 0,
    width: r.codedWidth,
    height: r.codedHeight
  }, i = e.rect, n = Uu(t, i, r.codedWidth, r.codedHeight, r.format), s = e.layout;
  let a;
  if (!e.format || e.format === r.format)
    a = r.format;
  else if (["RGBA", "RGBX", "BGRA", "BGRX"].includes(e.format))
    a = e.format;
  else
    throw new Error("NotSupportedError: Invalid destination format.");
  return qu(n, a, s);
}, Uu = (r, e, t, i, n) => {
  const s = { ...r };
  if (e !== void 0) {
    if (e.width === 0 || e.height === 0)
      throw new TypeError("visibleRect dimensions cannot be zero.");
    if ((e.x || 0) + (e.width || 0) > t)
      throw new TypeError("visibleRect exceeds codedWidth.");
    if ((e.y || 0) + (e.height || 0) > i)
      throw new TypeError("visibleRect exceeds codedHeight.");
    s.x = e.x || 0, s.y = e.y || 0, s.width = e.width || 0, s.height = e.height || 0;
  }
  if (!Wu(n, s))
    throw new TypeError("visibleRect alignment is invalid for the format.");
  return s;
}, Wu = (r, e) => {
  if (r === null)
    return !0;
  const t = Ci(r);
  for (let i = 0; i < t.length; i++) {
    const n = t[i], s = n.widthDivisor, a = n.heightDivisor;
    if ((e.x || 0) % s !== 0 || (e.y || 0) % a !== 0)
      return !1;
  }
  return !0;
}, qu = (r, e, t) => {
  const i = Ci(e), n = i.length;
  if (t !== void 0 && t.length !== n)
    throw new TypeError(`Layout must have ${n} planes.`);
  let s = 0;
  const a = [], o = [];
  for (let c = 0; c < n; c++) {
    const l = i[c], u = l.sampleBytes, d = l.widthDivisor, f = l.heightDivisor, h = {
      destinationOffset: 0,
      destinationStride: 0,
      sourceTop: 0,
      sourceHeight: 0,
      sourceLeftBytes: 0,
      sourceWidthBytes: 0
    };
    if (h.sourceTop = Math.ceil(Math.trunc(r.y || 0) / f), h.sourceHeight = Math.ceil(Math.trunc(r.height || 0) / f), h.sourceLeftBytes = Math.floor(Math.trunc(r.x || 0) / d) * u, h.sourceWidthBytes = Math.floor(Math.trunc(r.width || 0) / d) * u, t !== void 0) {
      const y = t[c];
      if (y.stride < h.sourceWidthBytes)
        throw new TypeError(`Stride for plane ${c} is too small.`);
      h.destinationOffset = y.offset, h.destinationStride = y.stride;
    } else
      h.destinationOffset = s, h.destinationStride = h.sourceWidthBytes;
    const m = h.destinationStride * h.sourceHeight + h.destinationOffset;
    if (m > 4294967295)
      throw new TypeError("Allocation size exceeds limit.");
    o.push(m), s = Math.max(s, m);
    for (let y = 0; y < c; y++) {
      const w = a[y];
      if (!(o[c] <= w.destinationOffset || o[y] <= h.destinationOffset))
        throw new TypeError("Planes overlap.");
    }
    a.push(h);
  }
  return {
    allocationSize: s,
    computedLayouts: a
  };
}, Ur = /* @__PURE__ */ new Set(["f32", "f32-planar", "s16", "s16-planar", "s32", "s32-planar", "u8", "u8-planar"]);
class cr {
  constructor() {
    this._referenceCount = 0;
  }
}
class fe {
  /** The presentation timestamp of the sample in microseconds. */
  get microsecondTimestamp() {
    return Math.trunc(mt * this.timestamp);
  }
  /** The duration of the sample in microseconds. */
  get microsecondDuration() {
    return Math.trunc(mt * this.duration);
  }
  constructor(e) {
    if (this._closed = !1, lr(e)) {
      if (e.format === null)
        throw new TypeError("AudioData with null format is not supported.");
      this._data = e, this.format = e.format, this.sampleRate = e.sampleRate, this.numberOfFrames = e.numberOfFrames, this.numberOfChannels = e.numberOfChannels, this.timestamp = e.timestamp / 1e6, this.duration = e.numberOfFrames / e.sampleRate;
    } else if (e instanceof cr) {
      if (this._data = e, e._referenceCount++, this.format = e.getFormat(), !Ur.has(this.format))
        throw new TypeError("getFormat() must return an AudioSampleFormat.");
      if (this.sampleRate = e.getSampleRate(), !Number.isInteger(this.sampleRate) || this.sampleRate <= 0)
        throw new TypeError("getSampleRate() must return a positive integer.");
      if (this.numberOfFrames = e.getNumberOfFrames(), !Number.isInteger(this.numberOfFrames) || this.numberOfFrames < 0)
        throw new TypeError("getNumberOfFrames() must return a non-negative integer.");
      if (this.numberOfChannels = e.getNumberOfChannels(), !Number.isInteger(this.numberOfChannels) || this.numberOfChannels <= 0)
        throw new TypeError("getNumberOfChannels() must return a positive integer.");
      if (this.timestamp = e.getTimestamp(), !Number.isFinite(this.timestamp))
        throw new TypeError("getTimestamp() must return a finite number.");
      this.duration = this.numberOfFrames / this.sampleRate;
    } else {
      if (!e || typeof e != "object")
        throw new TypeError("Invalid AudioDataInit: must be an object.");
      if (!Ur.has(e.format))
        throw new TypeError("Invalid AudioDataInit: invalid format.");
      if (!Number.isFinite(e.sampleRate) || e.sampleRate <= 0)
        throw new TypeError("Invalid AudioDataInit: sampleRate must be > 0.");
      if (!Number.isInteger(e.numberOfChannels) || e.numberOfChannels === 0)
        throw new TypeError("Invalid AudioDataInit: numberOfChannels must be an integer > 0.");
      if (!Number.isFinite(e?.timestamp))
        throw new TypeError("init.timestamp must be a number.");
      const t = e.data.byteLength / (tt(e.format) * e.numberOfChannels);
      if (!Number.isInteger(t))
        throw new TypeError("Invalid AudioDataInit: data size is not a multiple of frame size.");
      this.format = e.format, this.sampleRate = e.sampleRate, this.numberOfFrames = t, this.numberOfChannels = e.numberOfChannels, this.timestamp = e.timestamp, this.duration = t / e.sampleRate;
      let i;
      if (e.data instanceof ArrayBuffer)
        i = new Uint8Array(e.data);
      else if (ArrayBuffer.isView(e.data))
        i = new Uint8Array(e.data.buffer, e.data.byteOffset, e.data.byteLength);
      else
        throw new TypeError("Invalid AudioDataInit: data is not a BufferSource.");
      const n = this.numberOfFrames * this.numberOfChannels * tt(this.format);
      if (i.byteLength < n)
        throw new TypeError("Invalid AudioDataInit: insufficient data size.");
      this._data = i;
    }
    vr?.register(this, { type: "audio", data: this._data }, this);
  }
  /** Returns the number of bytes required to hold the audio sample's data as specified by the given options. */
  allocationSize(e) {
    if (!e || typeof e != "object")
      throw new TypeError("options must be an object.");
    if (!Number.isInteger(e.planeIndex) || e.planeIndex < 0)
      throw new TypeError("planeIndex must be a non-negative integer.");
    if (e.format !== void 0 && !Ur.has(e.format))
      throw new TypeError("Invalid format.");
    if (e.frameOffset !== void 0 && (!Number.isInteger(e.frameOffset) || e.frameOffset < 0))
      throw new TypeError("frameOffset must be a non-negative integer.");
    if (e.frameCount !== void 0 && (!Number.isInteger(e.frameCount) || e.frameCount < 0))
      throw new TypeError("frameCount must be a non-negative integer.");
    if (this._closed)
      throw new Error("AudioSample is closed.");
    const t = e.format ?? this.format, i = e.frameOffset ?? 0;
    if (i >= this.numberOfFrames)
      throw new RangeError("frameOffset out of range");
    const n = e.frameCount !== void 0 ? e.frameCount : this.numberOfFrames - i;
    if (n > this.numberOfFrames - i)
      throw new RangeError("frameCount out of range");
    const s = tt(t), a = At(t);
    if (a && e.planeIndex >= this.numberOfChannels)
      throw new RangeError("planeIndex out of range");
    if (!a && e.planeIndex !== 0)
      throw new RangeError("planeIndex out of range");
    return (a ? n : n * this.numberOfChannels) * s;
  }
  /** Copies the audio sample's data to an ArrayBuffer or ArrayBufferView as specified by the given options. */
  copyTo(e, t) {
    if (!Br(e))
      throw new TypeError("destination must be an ArrayBuffer or an ArrayBuffer view.");
    if (!t || typeof t != "object")
      throw new TypeError("options must be an object.");
    if (!Number.isInteger(t.planeIndex) || t.planeIndex < 0)
      throw new TypeError("planeIndex must be a non-negative integer.");
    if (t.format !== void 0 && !Ur.has(t.format))
      throw new TypeError("Invalid format.");
    if (t.frameOffset !== void 0 && (!Number.isInteger(t.frameOffset) || t.frameOffset < 0))
      throw new TypeError("frameOffset must be a non-negative integer.");
    if (t.frameCount !== void 0 && (!Number.isInteger(t.frameCount) || t.frameCount < 0))
      throw new TypeError("frameCount must be a non-negative integer.");
    if (this._closed)
      throw new Error("AudioSample is closed.");
    const { format: i, frameCount: n, frameOffset: s } = t;
    let { planeIndex: a } = t;
    const o = this.format, c = i ?? this.format;
    if (!c)
      throw new Error("Destination format not determined");
    const l = this.numberOfFrames, u = this.numberOfChannels, d = s ?? 0;
    if (d >= l)
      throw new RangeError("frameOffset out of range");
    const f = n !== void 0 ? n : l - d;
    if (f > l - d)
      throw new RangeError("frameCount out of range");
    const h = tt(c), p = At(c);
    if (p && a >= u)
      throw new RangeError("planeIndex out of range");
    if (!p && a !== 0)
      throw new RangeError("planeIndex out of range");
    const y = (p ? f : f * u) * h;
    if (e.byteLength < y)
      throw new RangeError("Destination buffer is too small");
    const w = K(e), b = _o(c);
    if (lr(this._data))
      wr() && u > 2 && c !== o ? Hu(this._data, w, o, c, u, a, d, f) : this._data.copyTo(e, {
        planeIndex: a,
        frameOffset: d,
        frameCount: f,
        format: c
      });
    else {
      const k = Io(o), A = tt(o), T = At(o);
      let x;
      if (this._data instanceof cr) {
        const P = (S) => {
          const E = this._data.getDataPlane(S);
          if (!(E instanceof Uint8Array))
            throw new TypeError("getDataPlane() must return a Uint8Array.");
          const I = l * A * (T ? 1 : u);
          if (E.byteLength !== I)
            throw new TypeError(`Data plane ${S} has invalid size. Expected exactly ${I} bytes, got ${E.byteLength} bytes.`);
          return E;
        };
        if (T)
          if (p)
            x = P(a), a = 0;
          else {
            x = new Uint8Array(l * A * u);
            for (let S = 0; S < u; S++) {
              const E = P(S);
              x.set(E, S * l * A);
            }
          }
        else
          x = P(0);
      } else
        x = this._data;
      const C = K(x);
      for (let P = 0; P < f; P++)
        if (p) {
          const S = P * h;
          let E;
          T ? E = (a * l + (P + d)) * A : E = ((P + d) * u + a) * A;
          const I = k(C, E);
          b(w, S, I);
        } else
          for (let S = 0; S < u; S++) {
            const I = (P * u + S) * h;
            let _;
            T ? _ = (S * l + (P + d)) * A : _ = ((P + d) * u + S) * A;
            const F = k(C, _);
            b(w, I, F);
          }
    }
  }
  /** Clones this audio sample. */
  clone() {
    if (this._closed)
      throw new Error("AudioSample is closed.");
    if (this._data instanceof cr) {
      const e = new fe(this._data);
      return e.setTimestamp(this.timestamp), e;
    } else if (lr(this._data)) {
      const e = new fe(this._data.clone());
      return e.setTimestamp(this.timestamp), e;
    } else
      return new fe({
        format: this.format,
        sampleRate: this.sampleRate,
        numberOfFrames: this.numberOfFrames,
        numberOfChannels: this.numberOfChannels,
        timestamp: this.timestamp,
        data: this._data
      });
  }
  /**
   * Returns a new {@link AudioSample} containing only the frames in the range [startSample, endSample). Both bounds
   * must lie within this sample's range of frames. The returned sample's timestamp is shifted to match the start of
   * the trimmed section.
   */
  trim(e, t = this.numberOfFrames) {
    if (!Number.isInteger(e) || e < 0)
      throw new TypeError("startSample must be a non-negative integer.");
    if (!Number.isInteger(t) || t < 0)
      throw new TypeError("endSample must be a non-negative integer.");
    if (e > this.numberOfFrames)
      throw new RangeError("startSample out of range.");
    if (t > this.numberOfFrames)
      throw new RangeError("endSample out of range.");
    if (t < e)
      throw new RangeError("endSample must not be less than startSample.");
    if (this._closed)
      throw new Error("AudioSample is closed.");
    const i = t - e, n = tt(this.format);
    let s;
    if (At(this.format)) {
      const a = i * n;
      if (s = new Uint8Array(a * this.numberOfChannels), i > 0)
        for (let o = 0; o < this.numberOfChannels; o++)
          this.copyTo(s.subarray(o * a, (o + 1) * a), {
            planeIndex: o,
            format: this.format,
            frameOffset: e,
            frameCount: i
          });
    } else
      s = new Uint8Array(i * this.numberOfChannels * n), i > 0 && this.copyTo(s, {
        planeIndex: 0,
        format: this.format,
        frameOffset: e,
        frameCount: i
      });
    return new fe({
      data: s,
      format: this.format,
      sampleRate: this.sampleRate,
      numberOfChannels: this.numberOfChannels,
      timestamp: this.timestamp + e / this.sampleRate
    });
  }
  /**
   * Closes this audio sample, releasing held resources. Audio samples should be closed as soon as they are not
   * needed anymore.
   */
  close() {
    this._closed || (vr?.unregister(this), this._data instanceof cr ? (this._data._referenceCount--, this._data._referenceCount === 0 && this._data.close()) : lr(this._data) ? this._data.close() : this._data = new Uint8Array(0), this._closed = !0);
  }
  /**
   * Converts this audio sample to an AudioData for use with the WebCodecs API. The AudioData returned by this
   * method *must* be closed separately from this audio sample.
   */
  toAudioData() {
    if (this._closed)
      throw new Error("AudioSample is closed.");
    return this._data instanceof cr ? this._createAudioDataFromData() : lr(this._data) ? this._data.timestamp === this.microsecondTimestamp ? this._data.clone() : this._createAudioDataFromData() : new AudioData({
      format: this.format,
      sampleRate: this.sampleRate,
      numberOfFrames: this.numberOfFrames,
      numberOfChannels: this.numberOfChannels,
      timestamp: this.microsecondTimestamp,
      data: this._data.buffer instanceof ArrayBuffer ? this._data.buffer : this._data.slice()
      // In the case of SharedArrayBuffer, convert to ArrayBuffer
    });
  }
  /** @internal */
  _createAudioDataFromData() {
    if (At(this.format)) {
      const e = this.allocationSize({ planeIndex: 0, format: this.format }), t = new ArrayBuffer(e * this.numberOfChannels);
      for (let i = 0; i < this.numberOfChannels; i++)
        this.copyTo(new Uint8Array(t, i * e, e), { planeIndex: i, format: this.format });
      return new AudioData({
        format: this.format,
        sampleRate: this.sampleRate,
        numberOfFrames: this.numberOfFrames,
        numberOfChannels: this.numberOfChannels,
        timestamp: this.microsecondTimestamp,
        data: t
      });
    } else {
      const e = new ArrayBuffer(this.allocationSize({ planeIndex: 0, format: this.format }));
      return this.copyTo(e, { planeIndex: 0, format: this.format }), new AudioData({
        format: this.format,
        sampleRate: this.sampleRate,
        numberOfFrames: this.numberOfFrames,
        numberOfChannels: this.numberOfChannels,
        timestamp: this.microsecondTimestamp,
        data: e
      });
    }
  }
  /** Convert this audio sample to an AudioBuffer for use with the Web Audio API. */
  toAudioBuffer() {
    if (this._closed)
      throw new Error("AudioSample is closed.");
    const e = new AudioBuffer({
      numberOfChannels: this.numberOfChannels,
      length: this.numberOfFrames,
      sampleRate: this.sampleRate
    }), t = new Float32Array(this.allocationSize({ planeIndex: 0, format: "f32-planar" }) / 4);
    for (let i = 0; i < this.numberOfChannels; i++)
      this.copyTo(t, { planeIndex: i, format: "f32-planar" }), e.copyToChannel(t, i);
    return e;
  }
  /** Sets the presentation timestamp of this audio sample, in seconds. */
  setTimestamp(e) {
    if (!Number.isFinite(e))
      throw new TypeError("newTimestamp must be a number.");
    this.timestamp = e;
  }
  /** Calls `.close()`. */
  [Symbol.dispose]() {
    this.close();
  }
  /** @internal */
  static *_fromAudioBuffer(e, t) {
    if (!(e instanceof AudioBuffer))
      throw new TypeError("audioBuffer must be an AudioBuffer.");
    const i = 48e3 * 5, n = e.numberOfChannels, s = e.sampleRate, a = e.length, o = Math.floor(i / n);
    let c = 0, l = a;
    for (; l > 0; ) {
      const u = Math.min(o, l), d = new Float32Array(n * u);
      for (let f = 0; f < n; f++)
        e.copyFromChannel(d.subarray(f * u, (f + 1) * u), f, c);
      yield new fe({
        format: "f32-planar",
        sampleRate: s,
        numberOfFrames: u,
        numberOfChannels: n,
        timestamp: t + c / s,
        data: d
      }), c += u, l -= u;
    }
  }
  /**
   * Creates AudioSamples from an AudioBuffer, starting at the given timestamp in seconds. Typically creates exactly
   * one sample, but may create multiple if the AudioBuffer is exceedingly large.
   */
  static fromAudioBuffer(e, t) {
    if (!(e instanceof AudioBuffer))
      throw new TypeError("audioBuffer must be an AudioBuffer.");
    const i = 48e3 * 5, n = e.numberOfChannels, s = e.sampleRate, a = e.length, o = Math.floor(i / n);
    let c = 0, l = a;
    const u = [];
    for (; l > 0; ) {
      const d = Math.min(o, l), f = new Float32Array(n * d);
      for (let p = 0; p < n; p++)
        e.copyFromChannel(f.subarray(p * d, (p + 1) * d), p, c);
      const h = new fe({
        format: "f32-planar",
        sampleRate: s,
        numberOfFrames: d,
        numberOfChannels: n,
        timestamp: t + c / s,
        data: f
      });
      u.push(h), c += d, l -= d;
    }
    return u;
  }
}
const tt = (r) => {
  switch (r) {
    case "u8":
    case "u8-planar":
      return 1;
    case "s16":
    case "s16-planar":
      return 2;
    case "s32":
    case "s32-planar":
      return 4;
    case "f32":
    case "f32-planar":
      return 4;
    default:
      throw new Error("Unknown AudioSampleFormat");
  }
}, At = (r) => {
  switch (r) {
    case "u8-planar":
    case "s16-planar":
    case "s32-planar":
    case "f32-planar":
      return !0;
    default:
      return !1;
  }
}, Io = (r) => {
  switch (r) {
    case "u8":
    case "u8-planar":
      return (e, t) => (e.getUint8(t) - 128) / 128;
    case "s16":
    case "s16-planar":
      return (e, t) => e.getInt16(t, !0) / 32768;
    case "s32":
    case "s32-planar":
      return (e, t) => e.getInt32(t, !0) / 2147483648;
    case "f32":
    case "f32-planar":
      return (e, t) => e.getFloat32(t, !0);
  }
}, _o = (r) => {
  switch (r) {
    case "u8":
    case "u8-planar":
      return (e, t, i) => e.setUint8(t, ae((i + 1) * 127.5, 0, 255));
    case "s16":
    case "s16-planar":
      return (e, t, i) => e.setInt16(t, ae(Math.round(i * 32767), -32768, 32767), !0);
    case "s32":
    case "s32-planar":
      return (e, t, i) => e.setInt32(t, ae(Math.round(i * 2147483647), -2147483648, 2147483647), !0);
    case "f32":
    case "f32-planar":
      return (e, t, i) => e.setFloat32(t, i, !0);
  }
}, lr = (r) => typeof AudioData < "u" && r instanceof AudioData, Lu = (r) => {
  switch (r) {
    case "u8-planar":
      return "u8";
    case "s16-planar":
      return "s16";
    case "s32-planar":
      return "s32";
    case "f32-planar":
      return "f32";
    default:
      return r;
  }
}, Hu = (r, e, t, i, n, s, a, o) => {
  const c = Io(t), l = _o(i), u = tt(t), d = tt(i), f = At(t);
  if (At(i))
    if (f) {
      const p = new ArrayBuffer(o * u), m = K(p);
      r.copyTo(p, {
        planeIndex: s,
        frameOffset: a,
        frameCount: o,
        format: t
      });
      for (let y = 0; y < o; y++) {
        const w = y * u, b = y * d, k = c(m, w);
        l(e, b, k);
      }
    } else {
      const p = new ArrayBuffer(o * n * u), m = K(p);
      r.copyTo(p, {
        planeIndex: 0,
        frameOffset: a,
        frameCount: o,
        format: t
      });
      for (let y = 0; y < o; y++) {
        const w = (y * n + s) * u, b = y * d, k = c(m, w);
        l(e, b, k);
      }
    }
  else if (f) {
    const p = o * u, m = new ArrayBuffer(p), y = K(m);
    for (let w = 0; w < n; w++) {
      r.copyTo(m, {
        planeIndex: w,
        frameOffset: a,
        frameCount: o,
        format: t
      });
      for (let b = 0; b < o; b++) {
        const k = b * u, A = (b * n + w) * d, T = c(y, k);
        l(e, A, T);
      }
    }
  } else {
    const p = new ArrayBuffer(o * n * u), m = K(p);
    r.copyTo(p, {
      planeIndex: 0,
      frameOffset: a,
      frameCount: o,
      format: t
    });
    for (let y = 0; y < o; y++)
      for (let w = 0; w < n; w++) {
        const b = y * n + w, k = b * u, A = b * d, T = c(m, k);
        l(e, A, T);
      }
  }
}, ju = (r, e) => {
  const t = r.allocationSize({ format: e, planeIndex: 0 }), i = new ArrayBuffer(t);
  return r.copyTo(i, { format: e, planeIndex: 0 }), new fe({
    data: i,
    format: e,
    numberOfChannels: r.numberOfChannels,
    sampleRate: r.sampleRate,
    timestamp: r.timestamp,
    duration: r.duration
  });
};
const xn = /* @__PURE__ */ new Map(), Pn = /* @__PURE__ */ new Map(), Ku = (r) => {
  if (!r || typeof r != "object")
    throw new TypeError("Encoding config must be an object.");
  if (!Ce.includes(r.codec))
    throw new TypeError(`Invalid video codec '${r.codec}'. Must be one of: ${Ce.join(", ")}.`);
  const e = r.bitrate;
  if (r.quality === void 0 && e === void 0)
    throw new TypeError("config.quality must be provided.");
  if (r.quality !== void 0 && e !== void 0)
    throw new TypeError("config.quality and config.bitrate cannot both be provided.");
  if (r.quality !== void 0 && !(r.quality instanceof oe))
    throw new TypeError("config.quality, when provided, must be a Quality.");
  if (e !== void 0 && !(e instanceof oe) && (!Number.isInteger(e) || e <= 0))
    throw new TypeError("config.bitrate, when provided, must be a positive integer or a quality.");
  if (r.keyFrameInterval !== void 0 && (!Number.isFinite(r.keyFrameInterval) || r.keyFrameInterval < 0))
    throw new TypeError("config.keyFrameInterval, when provided, must be a non-negative number.");
  if (r.sizeChangeBehavior !== void 0 && !["deny", "passThrough", "fill", "contain", "cover"].includes(r.sizeChangeBehavior))
    throw new TypeError("config.sizeChangeBehavior, when provided, must be 'deny', 'passThrough', 'fill', 'contain' or 'cover'.");
  if (r.transform !== void 0) {
    if (typeof r.transform != "object" || !r.transform)
      throw new TypeError("config.transform, when provided, must be an object.");
    if (r.transform.width !== void 0 && (!Number.isInteger(r.transform.width) || r.transform.width <= 0))
      throw new TypeError("config.transform.width, when provided, must be a positive integer.");
    if (r.transform.height !== void 0 && (!Number.isInteger(r.transform.height) || r.transform.height <= 0))
      throw new TypeError("config.transform.height, when provided, must be a positive integer.");
    if (r.transform.fit !== void 0 && !["fill", "contain", "cover"].includes(r.transform.fit))
      throw new TypeError('config.transform.fit, when provided, must be one of "fill", "contain", or "cover".');
    if (r.transform.width !== void 0 && r.transform.height !== void 0 && r.transform.fit === void 0 && !["fill", "contain", "cover"].includes(r.sizeChangeBehavior))
      throw new TypeError("When both config.transform.width and config.transform.height are provided, config.transform.fit must also be provided.");
    if (r.transform.fit !== void 0 && ["fill", "contain", "cover"].includes(r.sizeChangeBehavior) && r.transform.fit !== r.sizeChangeBehavior)
      throw new TypeError("config.transform.fit, when provided, cannot differ from config.sizeChangeBehavior when config.sizeChangeBehavior is 'fill', 'contain' or 'cover', as sizeChangeBehavior already determines the fitting algorithm.");
    if (r.transform.rotate !== void 0 && ![0, 90, 180, 270].includes(r.transform.rotate))
      throw new TypeError("config.transform.rotate, when provided, must be 0, 90, 180 or 270.");
    if (r.transform.crop !== void 0 && fi(r.transform.crop, "config.transform."), r.transform.process !== void 0 && typeof r.transform.process != "function")
      throw new TypeError("config.transform.process, when provided, must be a function.");
    if (r.transform.frameRate !== void 0 && (!Number.isFinite(r.transform.frameRate) || r.transform.frameRate <= 0))
      throw new TypeError("config.transform.frameRate, when provided, must be a finite positive number.");
    if (r.transform.force !== void 0 && typeof r.transform.force != "boolean")
      throw new TypeError("config.transform.force, when provided, must be a boolean.");
  }
  if (r.onEncodedPacket !== void 0 && typeof r.onEncodedPacket != "function")
    throw new TypeError("config.onEncodedPacket, when provided, must be a function.");
  if (r.onEncoderConfig !== void 0 && typeof r.onEncoderConfig != "function")
    throw new TypeError("config.onEncoderConfig, when provided, must be a function.");
  if (r.onEncodedSample !== void 0 && typeof r.onEncodedSample != "function")
    throw new TypeError("config.onEncodedSample, when provided, must be a function.");
  vo(r.codec, r);
}, vo = (r, e) => {
  if (!e || typeof e != "object")
    throw new TypeError("Encoding options must be an object.");
  if (e.alpha !== void 0 && !["discard", "keep"].includes(e.alpha))
    throw new TypeError("options.alpha, when provided, must be 'discard' or 'keep'.");
  const t = e.bitrateMode;
  if (t !== void 0 && !["constant", "variable"].includes(t))
    throw new TypeError("bitrateMode, when provided, must be 'constant' or 'variable'.");
  if (e.latencyMode !== void 0 && !["quality", "realtime"].includes(e.latencyMode))
    throw new TypeError("latencyMode, when provided, must be 'quality' or 'realtime'.");
  if (e.fullCodecString !== void 0 && typeof e.fullCodecString != "string")
    throw new TypeError("fullCodecString, when provided, must be a string.");
  if (e.fullCodecString !== void 0 && Qe(e.fullCodecString) !== r)
    throw new TypeError(`fullCodecString, when provided, must be a string that matches the specified codec (${r}).`);
  if (e.hardwareAcceleration !== void 0 && !["no-preference", "prefer-hardware", "prefer-software"].includes(e.hardwareAcceleration))
    throw new TypeError("hardwareAcceleration, when provided, must be 'no-preference', 'prefer-hardware' or 'prefer-software'.");
  if (e.scalabilityMode !== void 0 && typeof e.scalabilityMode != "string")
    throw new TypeError("scalabilityMode, when provided, must be a string.");
  if (e.contentHint !== void 0 && typeof e.contentHint != "string")
    throw new TypeError("contentHint, when provided, must be a string.");
}, Bo = (r) => {
  const e = r.bitrateMode, t = r.quality._toVideoRateControl(r.codec, r.width, r.height, e), i = (s, a, o) => ({
    codec: r.fullCodecString ?? mc(r.codec, r.width, r.height, o, r.alpha === "keep"),
    width: r.width,
    height: r.height,
    displayWidth: r.squarePixelWidth,
    displayHeight: r.squarePixelHeight,
    bitrate: s,
    bitrateMode: a,
    alpha: r.alpha ?? "discard",
    framerate: r.framerate,
    latencyMode: r.latencyMode,
    hardwareAcceleration: r.hardwareAcceleration,
    scalabilityMode: r.scalabilityMode,
    contentHint: r.contentHint,
    ...yc(r.codec)
  }), n = [];
  return t.quantizer !== null && n.push({
    config: i(void 0, "quantizer", t.bitrate),
    quantizer: t.quantizer
  }), t.bitrateMode !== "quantizer" && n.push({
    config: i(t.bitrate, t.bitrateMode, t.bitrate),
    quantizer: null
  }), g(n.length > 0), n;
}, Qu = (r) => {
  if (!r || typeof r != "object")
    throw new TypeError("Encoding config must be an object.");
  if (!Ee.includes(r.codec))
    throw new TypeError(`Invalid audio codec '${r.codec}'. Must be one of: ${Ee.join(", ")}.`);
  const e = r.bitrate;
  if (r.quality === void 0 && e === void 0 && !(ye.includes(r.codec) || r.codec === "flac"))
    throw new TypeError("config.quality must be provided for compressed audio codecs.");
  if (r.quality !== void 0 && e !== void 0)
    throw new TypeError("config.quality and config.bitrate cannot both be provided.");
  if (r.quality !== void 0 && !(r.quality instanceof oe))
    throw new TypeError("config.quality, when provided, must be a Quality.");
  if (e !== void 0 && !(e instanceof oe) && (!Number.isInteger(e) || e <= 0))
    throw new TypeError("config.bitrate, when provided, must be a positive integer or a quality.");
  if (r.transform !== void 0) {
    if (typeof r.transform != "object" || !r.transform)
      throw new TypeError("config.transform, when provided, must be an object.");
    if (r.transform.numberOfChannels !== void 0 && (!Number.isInteger(r.transform.numberOfChannels) || r.transform.numberOfChannels <= 0))
      throw new TypeError("config.transform.numberOfChannels, when provided, must be a positive integer.");
    if (r.transform.sampleRate !== void 0 && (!Number.isInteger(r.transform.sampleRate) || r.transform.sampleRate <= 0))
      throw new TypeError("config.transform.sampleRate, when provided, must be a positive integer.");
    if (r.transform.sampleFormat !== void 0 && !["u8", "s16", "s32", "f32"].includes(r.transform.sampleFormat))
      throw new TypeError("config.transform.sampleFormat, when provided, must be one of: u8, s16, s32, f32.");
    if (r.transform.process !== void 0 && typeof r.transform.process != "function")
      throw new TypeError("config.transform.process, when provided, must be a function.");
  }
  if (r.onEncodedPacket !== void 0 && typeof r.onEncodedPacket != "function")
    throw new TypeError("config.onEncodedPacket, when provided, must be a function.");
  if (r.onEncoderConfig !== void 0 && typeof r.onEncoderConfig != "function")
    throw new TypeError("config.onEncoderConfig, when provided, must be a function.");
  if (r.onEncodedSample !== void 0 && typeof r.onEncodedSample != "function")
    throw new TypeError("config.onEncodedSample, when provided, must be a function.");
  Ro(r.codec, r);
}, Ro = (r, e) => {
  if (!e || typeof e != "object")
    throw new TypeError("Encoding options must be an object.");
  const t = e.bitrateMode;
  if (t !== void 0 && !["constant", "variable"].includes(t))
    throw new TypeError("bitrateMode, when provided, must be 'constant' or 'variable'.");
  if (e.fullCodecString !== void 0 && typeof e.fullCodecString != "string")
    throw new TypeError("fullCodecString, when provided, must be a string.");
  if (e.fullCodecString !== void 0 && Qe(e.fullCodecString) !== r)
    throw new TypeError(`fullCodecString, when provided, must be a string that matches the specified codec (${r}).`);
}, Fo = (r) => {
  const e = r.bitrateMode;
  return {
    codec: r.fullCodecString ?? Ia(r.codec, r.numberOfChannels, r.sampleRate),
    numberOfChannels: r.numberOfChannels,
    sampleRate: r.sampleRate,
    bitrate: r.quality?._toAudioBitrate(r.codec),
    bitrateMode: r.quality?._bitrateMode ?? e,
    ...wc(r.codec)
  };
};
class oe {
  constructor(e) {
    if ((typeof e == "number" || typeof e == "string") && (e = { quality: e }), !e || typeof e != "object")
      throw new TypeError("options must be an object.");
    if (e.bitrateMode !== void 0 && !["constant", "variable"].includes(e.bitrateMode))
      throw new TypeError("options.bitrateMode, when provided, must be 'constant' or 'variable'.");
    if ("quality" in e) {
      if (typeof e.quality == "string" ? !(e.quality in ta) : typeof e.quality != "number" || Number.isNaN(e.quality))
        throw new TypeError("options.quality must be a number, or one of 'very-low', 'low', 'medium', 'high' or 'very-high'.");
      if (e.preferBitrate !== void 0 && typeof e.preferBitrate != "boolean")
        throw new TypeError("options.preferBitrate, when provided, must be a boolean.");
      if ("bitrate" in e || "quantizer" in e)
        throw new TypeError("options.quality cannot be combined with options.bitrate or options.quantizer.");
      this._quality = typeof e.quality == "string" ? ta[e.quality] : e.quality, this._preferBitrate = e.preferBitrate ?? !1, this._bitrate = void 0, this._quantizer = void 0;
    } else {
      if (e.bitrate !== void 0 && (!Number.isInteger(e.bitrate) || e.bitrate <= 0))
        throw new TypeError("options.bitrate, when provided, must be a positive integer.");
      if (e.quantizer !== void 0 && (!Number.isInteger(e.quantizer) || e.quantizer < 0))
        throw new TypeError("options.quantizer, when provided, must be a non-negative integer.");
      if (e.bitrate === void 0 && e.quantizer === void 0)
        throw new TypeError("At least one of options.bitrate or options.quantizer must be set.");
      if ("preferBitrate" in e)
        throw new TypeError("options.preferBitrate can only be combined with options.quality.");
      this._quality = void 0, this._preferBitrate = !1, this._bitrate = e.bitrate, this._quantizer = e.quantizer;
    }
    this._bitrateMode = e.bitrateMode;
  }
  /**
   * Determines the rate control methods usable for the given codec.
   * @internal
   */
  _toVideoRateControl(e, t, i, n) {
    const s = Gu[e];
    let a = null, o = this._bitrateMode ?? n ?? "variable";
    if (this._quantizer !== void 0) {
      if (s)
        if (this._quantizer < s.min || this._quantizer > s.max) {
          if (this._bitrate === void 0)
            throw new Error(`Quantizer ${this._quantizer} is out of range for codec '${e}'; must be between ${s.min} and ${s.max}.`);
        } else
          a = this._quantizer, this._bitrate === void 0 && (o = "quantizer");
      else if (this._bitrate === void 0)
        throw new Error(`Codec '${e}' does not support quantizer-based encoding. Provide a bitrate in the Quality to define a fallback.`);
    } else this._bitrate === void 0 && s && !this._preferBitrate && (g(this._quality !== void 0), a = ae(Math.round(sc(s.worst, s.best, this._quality)), s.min, s.max));
    let c;
    if (this._bitrate !== void 0)
      c = this._bitrate;
    else {
      let l = this._quality;
      l === void 0 && (g(a !== null && s), l = ae((a - s.worst) / (s.best - s.worst), 0, 1)), c = ra(e, t, i, Hi(l));
    }
    return { quantizer: a, bitrate: c, bitrateMode: o };
  }
  /** @internal */
  _toVideoBitrate(e, t, i) {
    return this._bitrate !== void 0 ? this._bitrate : (g(this._quality !== void 0), ra(e, t, i, Hi(this._quality)));
  }
  /** @internal */
  _toAudioBitrate(e) {
    if (ye.includes(e) || e === "flac")
      return;
    if (this._bitrate !== void 0)
      return this._bitrate;
    if (this._quality === void 0)
      throw new Error("This Quality defines neither a quality level nor a bitrate and therefore cannot be used for audio encoding.");
    const t = Hi(this._quality), n = {
      aac: 128e3,
      // 128kbps base for AAC
      opus: 64e3,
      // 64kbps base for Opus
      mp3: 16e4,
      // 160kbps base for MP3
      vorbis: 64e3,
      // 64kbps base for Vorbis
      ac3: 384e3,
      // 384kbps base for AC-3
      eac3: 192e3,
      // 192kbps base for E-AC-3
      dts: 768e3
      // 768kbps base for DTS
    }[e];
    if (!n)
      throw new Error(`Unhandled codec: ${e}`);
    let s = n * t;
    return e === "aac" ? s = [96e3, 128e3, 16e4, 192e3].reduce((o, c) => Math.abs(c - s) < Math.abs(o - s) ? c : o) : e === "opus" || e === "vorbis" ? s = Math.max(6e3, s) : e === "mp3" && (s = [
      8e3,
      16e3,
      24e3,
      32e3,
      4e4,
      48e3,
      64e3,
      8e4,
      96e3,
      112e3,
      128e3,
      16e4,
      192e3,
      224e3,
      256e3,
      32e4
    ].reduce((o, c) => Math.abs(c - s) < Math.abs(o - s) ? c : o)), Math.round(s / 1e3) * 1e3;
  }
}
const ta = {
  "very-low": 0,
  low: 0.25,
  medium: 0.5,
  high: 0.75,
  "very-high": 1
}, Gu = {
  avc: { min: 0, max: 51, worst: 41, best: 16 },
  hevc: { min: 0, max: 51, worst: 41, best: 16 },
  vp9: { min: 0, max: 63, worst: 52, best: 20 },
  av1: { min: 0, max: 255, worst: 208, best: 80 }
}, Hi = (r) => 0.3 * Math.exp(2.5538 * r), ra = (r, e, t, i) => {
  const n = e * t, s = 1920 * 1080, a = 3e6, o = Math.pow(n / s, 0.95), c = a * o, l = {
    avc: 1,
    // H.264/AVC (baseline)
    hevc: 0.6,
    // H.265/HEVC (~40% more efficient than AVC)
    vp9: 0.6,
    // Similar to HEVC
    av1: 0.4,
    // ~60% more efficient than AVC
    vp8: 1.2,
    // Slightly less efficient than AVC
    prores: 22e7 / a
    // Apple ProRes white paper claims 220 Mbps for 1080p 422 HQ @30Hz
  }, d = c * l[r] * i;
  return Math.ceil(d / 1e3) * 1e3;
}, Mo = (r, e) => {
  if (r === "avc")
    return { avc: { quantizer: e } };
  if (r === "hevc")
    return { hevc: { quantizer: e } };
  if (r === "vp9")
    return { vp9: { quantizer: e } };
  if (r === "av1")
    return { av1: { quantizer: e } };
  g(!1);
}, Xu = /* @__PURE__ */ new oe("very-low"), $u = /* @__PURE__ */ new oe("medium"), Yu = /* @__PURE__ */ new oe("high"), zo = async (r, e = {}) => {
  const {
    width: t = 1280,
    height: i = 720,
    quality: n,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    bitrate: s,
    ...a
  } = e;
  if (!Ce.includes(r))
    return !1;
  if (!Number.isInteger(t) || t <= 0)
    throw new TypeError("width must be a positive integer.");
  if (!Number.isInteger(i) || i <= 0)
    throw new TypeError("height must be a positive integer.");
  if (n !== void 0 && !(n instanceof oe))
    throw new TypeError("quality, when provided, must be a Quality.");
  if (n !== void 0 && s !== void 0)
    throw new TypeError("quality and bitrate cannot both be provided.");
  if (s !== void 0 && !(s instanceof oe) && (!Number.isInteger(s) || s <= 0))
    throw new TypeError("bitrate must be a positive integer or a quality.");
  vo(r, a);
  const o = Zt(n, s) ?? new oe("medium");
  let c;
  try {
    c = Bo({
      codec: r,
      width: t,
      height: i,
      quality: o,
      framerate: void 0,
      ...a,
      alpha: "discard"
      // Since we handle alpha ourselves
    });
  } catch {
    return !1;
  }
  const l = JSON.stringify(c), u = xn.get(l);
  if (u)
    return u;
  const d = (async () => {
    for (const { config: h } of c)
      if (hi.some((p) => p.supports(r, h)))
        return !0;
    if (typeof VideoEncoder > "u" || (t % 2 === 1 || i % 2 === 1) && (r === "avc" || r === "hevc"))
      return !1;
    for (const { config: h, quantizer: p } of c) {
      try {
        if (!(await VideoEncoder.isConfigSupported(h)).supported)
          continue;
      } catch {
        continue;
      }
      if (!Sa() || await new Promise(async (y) => {
        try {
          const w = new VideoEncoder({
            output: () => {
            },
            error: () => y(!1)
          });
          w.configure(h);
          const b = new Uint8Array(t * i * 4), k = new VideoFrame(b, {
            format: "RGBA",
            codedWidth: t,
            codedHeight: i,
            timestamp: 0
          });
          w.encode(k, p !== null ? Mo(r, p) : void 0), k.close(), await w.flush(), y(!0);
        } catch {
          y(!1);
        }
      }))
        return !0;
    }
    return !1;
  })();
  return xn.set(l, d), d;
}, Cn = async (r, e = {}) => {
  const {
    numberOfChannels: t = 2,
    sampleRate: i = 48e3,
    quality: n,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    bitrate: s,
    ...a
  } = e;
  if (!Ee.includes(r))
    return !1;
  if (!Number.isInteger(t) || t <= 0)
    throw new TypeError("numberOfChannels must be a positive integer.");
  if (!Number.isInteger(i) || i <= 0)
    throw new TypeError("sampleRate must be a positive integer.");
  if (n !== void 0 && !(n instanceof oe))
    throw new TypeError("quality, when provided, must be a Quality.");
  if (n !== void 0 && s !== void 0)
    throw new TypeError("quality and bitrate cannot both be provided.");
  if (s !== void 0 && !(s instanceof oe) && (!Number.isInteger(s) || s <= 0))
    throw new TypeError("bitrate must be a positive integer.");
  Ro(r, a);
  const o = Zt(n, s) ?? new oe("medium"), c = Fo({
    codec: r,
    numberOfChannels: t,
    sampleRate: i,
    quality: o,
    ...a
  }), l = JSON.stringify(c), u = Pn.get(l);
  if (u)
    return u;
  const d = (async () => {
    if (mi.some((f) => f.supports(r, c)) || ye.includes(r))
      return !0;
    if (typeof AudioEncoder > "u")
      return !1;
    try {
      return (await AudioEncoder.isConfigSupported(c)).supported === !0;
    } catch {
      return !1;
    }
  })();
  return Pn.set(l, d), d;
}, Zt = (r, e) => {
  if (r !== void 0)
    return r;
  if (e !== void 0)
    return e instanceof oe ? e : new oe({ bitrate: e });
}, ia = async (r = Ee, e) => {
  const t = await Promise.all(r.map((i) => Cn(i, e)));
  return r.filter((i, n) => t[n]);
}, Zu = async (r, e) => {
  for (const t of r)
    if (await zo(t, e))
      return t;
  return null;
};
class Ju {
  /** Returns true if and only if the encoder can encode the given codec configuration. */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static supports(e, t) {
    return !1;
  }
}
class ed {
  /** Returns true if and only if the encoder can encode the given codec configuration. */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static supports(e, t) {
    return !1;
  }
}
const Oo = [], Xn = [], hi = [], mi = [], ch = (r) => {
  if (r.prototype instanceof Ju) {
    const e = r;
    if (hi.includes(e)) {
      q._warn("Video encoder already registered.");
      return;
    }
    hi.push(e), xn.clear();
  } else if (r.prototype instanceof ed) {
    const e = r;
    if (mi.includes(e)) {
      q._warn("Audio encoder already registered.");
      return;
    }
    mi.push(e), Pn.clear();
  } else
    throw new TypeError("Encoder must be a CustomVideoEncoder or CustomAudioEncoder.");
};
const td = (r) => {
  let i = r, n = 4096, s = 0, a = 12, o = 0;
  for (i < 0 && (i = -i, s = 128), i += 33, i > 8191 && (i = 8191); (i & n) !== n && a >= 5; )
    n >>= 1, a--;
  return o = i >> a - 4 & 15, ~(s | a - 5 << 4 | o) & 255;
}, rd = (r) => {
  let t = 0, i = 0, n = ~r;
  n & 128 && (n &= -129, t = -1), i = ((n & 240) >> 4) + 5;
  const s = (1 << i | (n & 15) << i - 4 | 1 << i - 5) - 33;
  return t === 0 ? s : -s;
}, id = (r) => {
  let t = 2048, i = 0, n = 11, s = 0, a = r;
  for (a < 0 && (a = -a, i = 128), a > 4095 && (a = 4095); (a & t) !== t && n >= 5; )
    t >>= 1, n--;
  return s = a >> (n === 4 ? 1 : n - 4) & 15, (i | n - 4 << 4 | s) ^ 85;
}, nd = (r) => {
  let e = 0, t = 0, i = r ^ 85;
  i & 128 && (i &= -129, e = -1), t = ((i & 240) >> 4) + 4;
  let n = 0;
  return t !== 4 ? n = 1 << t | (i & 15) << t - 4 | 1 << t - 5 : n = i << 1 | 1, e === 0 ? n : -n;
};
const kt = (r) => {
  if (!r || typeof r != "object")
    throw new TypeError("options must be an object.");
  if (r.metadataOnly !== void 0 && typeof r.metadataOnly != "boolean")
    throw new TypeError("options.metadataOnly, when defined, must be a boolean.");
  if (r.verifyKeyPackets !== void 0 && typeof r.verifyKeyPackets != "boolean")
    throw new TypeError("options.verifyKeyPackets, when defined, must be a boolean.");
  if (r.verifyKeyPackets && r.metadataOnly)
    throw new TypeError("options.verifyKeyPackets and options.metadataOnly cannot be enabled together.");
  if (r.skipLiveWait !== void 0 && typeof r.skipLiveWait != "boolean")
    throw new TypeError("options.skipLiveWait, when defined, must be a boolean.");
}, Bt = (r) => {
  if (!zn(r))
    throw new TypeError("timestamp must be a number.");
}, ji = (r, e, t) => t.verifyKeyPackets ? e.then(async (i) => {
  if (!i || i.type === "delta")
    return i;
  const n = await r.determinePacketType(i);
  return n && (i.type = n), i;
}) : e;
class Jt {
  /** Creates a new {@link EncodedPacketSink} for the given {@link InputTrack}. */
  constructor(e) {
    if (!(e instanceof Dr))
      throw new TypeError("track must be an InputTrack.");
    this._track = e;
  }
  /**
   * Retrieves the track's first packet (in decode order), or null if it has no packets. The first packet is very
   * likely to be a key packet, but it doesn't have to be.
   */
  async getFirstPacket(e = {}) {
    if (kt(e), this._track.input._disposed)
      throw new pe();
    return ji(this._track, this._track._backing.getFirstPacket(e), e);
  }
  /** Retrieves the track's first key packet (in decode order), or null if it has no key packets. */
  async getFirstKeyPacket(e = {}) {
    kt(e);
    const t = await this.getFirstPacket(e);
    return t ? t.type === "key" ? t : this.getNextKeyPacket(t, e) : null;
  }
  /**
   * Retrieves the packet corresponding to the given timestamp, in seconds. More specifically, returns the last packet
   * (in presentation order) with a start timestamp less than or equal to the given timestamp. This method can be
   * used to retrieve a track's last packet using `getPacket(Infinity)`. The method returns null if the timestamp
   * is before the first packet in the track.
   *
   * @param timestamp - The timestamp used for retrieval, in seconds.
   */
  async getPacket(e, t = {}) {
    if (Bt(e), kt(t), this._track.input._disposed)
      throw new pe();
    return ji(this._track, this._track._backing.getPacket(e, t), t);
  }
  /**
   * Retrieves the packet following the given packet (in decode order), or null if the given packet is the
   * last packet.
   */
  async getNextPacket(e, t = {}) {
    if (!(e instanceof Y))
      throw new TypeError("packet must be an EncodedPacket.");
    if (kt(t), this._track.input._disposed)
      throw new pe();
    return ji(this._track, this._track._backing.getNextPacket(e, t), t);
  }
  /**
   * Retrieves the key packet corresponding to the given timestamp, in seconds. More specifically, returns the last
   * key packet (in presentation order) with a start timestamp less than or equal to the given timestamp. A key packet
   * is a packet that doesn't require previous packets to be decoded. This method can be used to retrieve a track's
   * last key packet using `getKeyPacket(Infinity)`. The method returns null if the timestamp is before the first
   * key packet in the track.
   *
   * To ensure that the returned packet is guaranteed to be a real key frame, enable `options.verifyKeyPackets`.
   *
   * @param timestamp - The timestamp used for retrieval, in seconds.
   */
  async getKeyPacket(e, t = {}) {
    if (Bt(e), kt(t), this._track.input._disposed)
      throw new pe();
    if (!t.verifyKeyPackets)
      return this._track._backing.getKeyPacket(e, t);
    const i = await this._track._backing.getKeyPacket(e, t);
    return i && (g(i.type === "key"), await this._track.determinePacketType(i) === "delta" ? this.getKeyPacket(i.timestamp - 1 / await this._track.getTimeResolution(), t) : i);
  }
  /**
   * Retrieves the key packet following the given packet (in decode order), or null if the given packet is the last
   * key packet.
   *
   * To ensure that the returned packet is guaranteed to be a real key frame, enable `options.verifyKeyPackets`.
   */
  async getNextKeyPacket(e, t = {}) {
    if (!(e instanceof Y))
      throw new TypeError("packet must be an EncodedPacket.");
    if (kt(t), this._track.input._disposed)
      throw new pe();
    if (!t.verifyKeyPackets)
      return this._track._backing.getNextKeyPacket(e, t);
    const i = await this._track._backing.getNextKeyPacket(e, t);
    return i && (g(i.type === "key"), await this._track.determinePacketType(i) === "delta" ? this.getNextKeyPacket(i, t) : i);
  }
  /**
   * Creates an async iterator that yields the packets in this track in decode order. To enable fast iteration, this
   * method will intelligently preload packets based on the speed of the consumer.
   *
   * @param startPacket - (optional) The packet from which iteration should begin. This packet will also be yielded.
   * @param endPacket - (optional) The packet at which iteration should end. This packet will _not_ be yielded.
   */
  packets(e, t, i = {}) {
    if (e !== void 0 && !(e instanceof Y))
      throw new TypeError("startPacket must be an EncodedPacket.");
    if (e !== void 0 && e.isMetadataOnly && !i?.metadataOnly)
      throw new TypeError("startPacket can only be metadata-only if options.metadataOnly is enabled.");
    if (t !== void 0 && !(t instanceof Y))
      throw new TypeError("endPacket must be an EncodedPacket.");
    if (kt(i), this._track.input._disposed)
      throw new pe();
    const n = [];
    let { promise: s, resolve: a } = ne(), { promise: o, resolve: c } = ne(), l = !1, u = !1, d = null, f = !1;
    const h = [], p = () => Math.max(2, h.length);
    (async () => {
      let y = e ?? await this.getFirstPacket(i);
      for (; y && !u && !this._track.input._disposed && !(t && y.sequenceNumber >= t?.sequenceNumber); ) {
        if (n.length > p()) {
          ({ promise: o, resolve: c } = ne()), await o;
          continue;
        }
        n.push(y), a(), { promise: s, resolve: a } = ne(), y = await this.getNextPacket(y, i);
      }
      l = !0, a();
    })().catch((y) => {
      f || (d = y, f = !0, a());
    });
    const m = this._track;
    return {
      async next() {
        for (; ; ) {
          if (m.input._disposed)
            throw new pe();
          if (u)
            return { value: void 0, done: !0 };
          if (f)
            throw d;
          if (n.length > 0) {
            const y = n.shift(), w = performance.now();
            for (h.push(w); h.length > 0 && w - h[0] >= 1e3; )
              h.shift();
            return c(), { value: y, done: !1 };
          } else {
            if (l)
              return { value: void 0, done: !0 };
            await s;
          }
        }
      },
      async return() {
        return u = !0, c(), a(), { value: void 0, done: !0 };
      },
      async throw(y) {
        throw y;
      },
      [Symbol.asyncIterator]() {
        return this;
      }
    };
  }
}
class $n {
  constructor(e, t) {
    this.onSample = e, this.onError = t;
  }
}
class Do {
  /** @internal */
  mediaSamplesInRange(e = -1 / 0, t = 1 / 0, i) {
    Bt(e), Bt(t);
    const n = [];
    let s = !1, a = null, { promise: o, resolve: c } = ne(), { promise: l, resolve: u } = ne(), d = !1, f = !1, h = !1, p = null, m = null, y = !1;
    const w = {
      ...i,
      verifyKeyPackets: !0,
      metadataOnly: !1
    };
    (async () => {
      p = await this._createDecoder((S) => {
        if (u(), S.timestamp >= t && (f = !0), f) {
          S.close();
          return;
        }
        a && (S.timestamp > e ? (n.push(a), s = !0) : a.close()), S.timestamp >= e && (n.push(S), s = !0), a = s ? null : S, n.length > 0 && (c(), { promise: o, resolve: c } = ne());
      }, (S) => {
        y || (m = S, y = !0, c());
      });
      const A = this._createPacketSink(), T = await A.getKeyPacket(e, w) ?? await A.getFirstKeyPacket(w);
      let x = T;
      const P = A.packets(T ?? void 0, void 0, w);
      for (await P.next(); x && !f && !this._track.input._disposed; ) {
        const S = na(n.length);
        if (n.length + p.getDecodeQueueSize() > S) {
          ({ promise: l, resolve: u } = ne()), await l;
          continue;
        }
        p.decode(x);
        const E = await P.next();
        if (E.done)
          break;
        x = E.value;
      }
      await P.return(), !h && !this._track.input._disposed && await p.flush(), !s && a && n.push(a), d = !0, c();
    })().catch((A) => {
      y || (m = A, y = !0, c());
    }).finally(() => {
      p?.close();
    });
    const b = this._track, k = () => {
      a?.close();
      for (const A of n)
        A.close();
    };
    return {
      async next() {
        for (; ; ) {
          if (b.input._disposed)
            throw k(), new pe();
          if (h)
            return { value: void 0, done: !0 };
          if (y)
            throw k(), m;
          if (n.length > 0) {
            const A = n.shift();
            return u(), { value: A, done: !1 };
          } else if (!d)
            await o;
          else
            return { value: void 0, done: !0 };
        }
      },
      async return() {
        return h = !0, f = !0, u(), c(), k(), { value: void 0, done: !0 };
      },
      async throw(A) {
        throw A;
      },
      [Symbol.asyncIterator]() {
        return this;
      }
    };
  }
  /** @internal */
  mediaSamplesAtTimestamps(e, t) {
    rc(e);
    const i = tc(e), n = [], s = [];
    let { promise: a, resolve: o } = ne(), { promise: c, resolve: l } = ne(), u = !1, d = !1, f = null, h = null, p = !1;
    const m = (k) => {
      s.push(k), o(), { promise: a, resolve: o } = ne();
    }, y = {
      ...t,
      verifyKeyPackets: !0,
      metadataOnly: !1
    };
    (async () => {
      f = await this._createDecoder((S) => {
        if (l(), d) {
          S.close();
          return;
        }
        let E = 0;
        for (; n.length > 0 && S.timestamp - n[0] > -1e-10; )
          E++, n.shift();
        if (E > 0)
          for (let I = 0; I < E; I++)
            m(I < E - 1 ? S.clone() : S);
        else
          S.close();
      }, (S) => {
        p || (h = S, p = !0, o());
      });
      const k = this._createPacketSink();
      let A = null, T = null, x = -1;
      const C = async () => {
        g(T), g(f);
        let S = T;
        for (f.decode(S); S.sequenceNumber < x; ) {
          const E = na(s.length);
          for (; s.length + f.getDecodeQueueSize() > E && !d; )
            ({ promise: c, resolve: l } = ne()), await c;
          if (d)
            break;
          const I = await k.getNextPacket(S, y);
          g(I), f.decode(I), S = I;
        }
        x = -1;
      }, P = async () => {
        g(f), await f.flush();
        for (let S = 0; S < n.length; S++)
          m(null);
        n.length = 0;
      };
      for await (const S of i) {
        if (Bt(S), d || this._track.input._disposed)
          break;
        const E = await k.getPacket(S, y), I = E && await k.getKeyPacket(S, y);
        if (!I) {
          x !== -1 && (await C(), await P()), m(null), A = null;
          continue;
        }
        A && (I.sequenceNumber !== T.sequenceNumber || E.timestamp < A.timestamp) && (await C(), await P()), n.push(E.timestamp), x = Math.max(E.sequenceNumber, x), A = E, T = I;
      }
      !d && !this._track.input._disposed && (x !== -1 && await C(), await P()), u = !0, o();
    })().catch((k) => {
      p || (h = k, p = !0, o());
    }).finally(() => {
      f?.close();
    });
    const w = this._track, b = () => {
      for (const k of s)
        k?.close();
    };
    return {
      async next() {
        for (; ; ) {
          if (w.input._disposed)
            throw b(), new pe();
          if (d)
            return { value: void 0, done: !0 };
          if (p)
            throw b(), h;
          if (s.length > 0) {
            const k = s.shift();
            return g(k !== void 0), l(), { value: k, done: !1 };
          } else if (!u)
            await a;
          else
            return { value: void 0, done: !0 };
        }
      },
      async return() {
        return d = !0, l(), o(), b(), { value: void 0, done: !0 };
      },
      async throw(k) {
        throw k;
      },
      [Symbol.asyncIterator]() {
        return this;
      }
    };
  }
}
const na = (r) => r === 0 ? 40 : 8;
class sd extends $n {
  constructor(e, t, i, n, s, a) {
    super(e, t), this.codec = i, this.decoderConfig = n, this.rotation = s, this.timeResolution = a, this.decoder = null, this.customDecoder = null, this.customDecoderCallSerializer = new gi(), this.customDecoderQueueSize = 0, this.inputTimestamps = [], this.sampleQueue = [], this.currentPacketIndex = 0, this.raslSkipped = !1, this.alphaDecoder = null, this.alphaHadKeyframe = !1, this.colorQueue = [], this.alphaQueue = [], this.merger = null, this.decodedAlphaChunkCount = 0, this.alphaDecoderQueueSize = 0, this.nullAlphaFrameQueue = [], this.currentAlphaPacketIndex = 0, this.alphaRaslSkipped = !1, this.finalSamples = [], this.mergeAlphaPromises = [];
    const o = Oo.find((c) => c.supports(i, n));
    if (o)
      this.customDecoder = new o(), this.customDecoder.codec = i, this.customDecoder.config = n, this.customDecoder.onSample = (c) => {
        if (!(c instanceof me))
          throw new TypeError("The argument passed to onSample must be a VideoSample.");
        this.finalizeAndEmitSample(c);
      }, this.customDecoder.onError = (c) => {
        t(c);
      }, this.customDecoderCallSerializer.call(() => this.customDecoder.init()).catch((c) => t(c));
    else {
      const c = (u) => {
        if (this.alphaQueue.length > 0) {
          const d = this.alphaQueue.shift();
          g(d !== void 0), this.mergeAlpha(u, d);
        } else
          this.colorQueue.push(u);
      };
      if (i === "avc" && this.decoderConfig.description && dn()) {
        const u = Rc(be(this.decoderConfig.description));
        if (u && u.sequenceParameterSets.length > 0) {
          const d = qn(u.sequenceParameterSets[0]);
          d && d.frameMbsOnlyFlag === 0 && (this.decoderConfig = {
            ...this.decoderConfig,
            hardwareAcceleration: "prefer-software"
          });
        }
      }
      const l = new Error("Decoding error").stack;
      this.decoder = new VideoDecoder({
        output: (u) => {
          try {
            c(u);
          } catch (d) {
            this.onError(d);
          }
        },
        error: (u) => {
          u.stack = l, this.onError(u);
        }
      }), this.decoder.configure(this.decoderConfig);
    }
  }
  getDecodeQueueSize() {
    return this.customDecoder ? this.customDecoderQueueSize : (g(this.decoder), Math.max(this.decoder.decodeQueueSize, this.alphaDecoder?.decodeQueueSize ?? 0));
  }
  decode(e) {
    if (this.codec === "hevc" && this.currentPacketIndex > 0 && !this.raslSkipped) {
      if (this.hasHevcRaslPicture(e.data))
        return;
      this.raslSkipped = !0;
    }
    if (this.customDecoder)
      this.customDecoderQueueSize++, this.customDecoderCallSerializer.call(() => this.customDecoder.decode(e)).catch((t) => this.onError(t)).finally(() => this.customDecoderQueueSize--);
    else {
      if (g(this.decoder), wr() || cs(this.inputTimestamps, e.timestamp, (t) => t), dn() && this.currentPacketIndex === 0) {
        if (this.codec === "avc") {
          const t = [];
          let i = !1;
          for (const s of Da(e.data, this.decoderConfig)) {
            const a = ki(e.data[s.offset]);
            if (i ||= a >= 1 && a <= 5, a === de.AUD) {
              if (i)
                break;
              t.length = 0;
            }
            a >= 20 && a <= 31 || t.push(e.data.subarray(s.offset, s.offset + s.length));
          }
          const n = vc(t, this.decoderConfig);
          e = new Y(n, e.type, e.timestamp, e.duration);
        } else if (this.codec === "hevc") {
          const t = Wc(e.data, this.decoderConfig);
          t && (e = new Y(t, e.type, e.timestamp, e.duration));
        }
      }
      this.decoder.decode(e.toEncodedVideoChunk()), this.decodeAlphaData(e);
    }
    this.currentPacketIndex++;
  }
  decodeAlphaData(e) {
    if (!e.sideData.alpha) {
      this.pushNullAlphaFrame();
      return;
    }
    if (this.merger || (this.merger = new ad()), !this.alphaDecoder) {
      const i = (s) => {
        if (this.colorQueue.length > 0) {
          const a = this.colorQueue.shift();
          g(a !== void 0), this.mergeAlpha(a, s);
        } else
          this.alphaQueue.push(s);
        for (this.decodedAlphaChunkCount++; this.nullAlphaFrameQueue.length > 0 && this.nullAlphaFrameQueue[0] === this.decodedAlphaChunkCount; )
          if (this.nullAlphaFrameQueue.shift(), this.colorQueue.length > 0) {
            const a = this.colorQueue.shift();
            g(a !== void 0), this.mergeAlpha(a, null);
          } else
            this.alphaQueue.push(null);
        this.alphaDecoderQueueSize--;
      }, n = new Error("Decoding error").stack;
      this.alphaDecoder = new VideoDecoder({
        output: (s) => {
          try {
            i(s);
          } catch (a) {
            this.onError(a);
          }
        },
        error: (s) => {
          s.stack = n, this.onError(s);
        }
      }), this.alphaDecoder.configure(this.decoderConfig);
    }
    const t = xi(this.codec, this.decoderConfig, e.sideData.alpha);
    if (this.alphaHadKeyframe || (this.alphaHadKeyframe = t === "key"), this.alphaHadKeyframe) {
      if (this.codec === "hevc" && this.currentAlphaPacketIndex > 0 && !this.alphaRaslSkipped) {
        if (this.hasHevcRaslPicture(e.sideData.alpha)) {
          this.pushNullAlphaFrame();
          return;
        }
        this.alphaRaslSkipped = !0;
      }
      this.currentAlphaPacketIndex++, this.alphaDecoder.decode(e.alphaToEncodedVideoChunk(t ?? e.type)), this.alphaDecoderQueueSize++;
    } else
      this.pushNullAlphaFrame();
  }
  pushNullAlphaFrame() {
    this.alphaDecoderQueueSize === 0 ? this.alphaQueue.push(null) : this.nullAlphaFrameQueue.push(this.decodedAlphaChunkCount + this.alphaDecoderQueueSize);
  }
  /**
   * If we're using HEVC, we need to make sure to skip any RASL slices that follow a non-IDR key frame such as
   * CRA_NUT. This is because RASL slices cannot be decoded without data before the CRA_NUT. Browsers behave
   * differently here: Chromium drops the packets, Safari throws a decoder error. Either way, it's not good
   * and causes bugs upstream. So, let's take the dropping into our own hands.
   */
  hasHevcRaslPicture(e) {
    for (const t of oi(e, this.decoderConfig)) {
      const i = Yt(e[t.offset]);
      if (i === ce.RASL_N || i === ce.RASL_R)
        return !0;
    }
    return !1;
  }
  /** Handler for the WebCodecs VideoDecoder for ironing out browser differences. */
  sampleHandler(e) {
    if (wr()) {
      if (this.sampleQueue.length > 0 && e.timestamp >= te(this.sampleQueue).timestamp) {
        for (const t of this.sampleQueue)
          this.finalizeAndEmitSample(t);
        this.sampleQueue.length = 0;
      }
      cs(this.sampleQueue, e, (t) => t.timestamp);
    } else {
      const t = this.inputTimestamps.shift();
      g(t !== void 0), e.setTimestamp(t), this.finalizeAndEmitSample(e);
    }
  }
  finalizeAndEmitSample(e) {
    e.setTimestamp(Math.round(e.timestamp * this.timeResolution) / this.timeResolution), e.setDuration(Math.round(e.duration * this.timeResolution) / this.timeResolution), e.setRotation(this.rotation), this.onSample(e);
  }
  async mergeAlpha(e, t) {
    const i = ne();
    this.mergeAlphaPromises.push(i.promise);
    const n = { sample: null };
    this.finalSamples.push(n);
    try {
      if (!t)
        n.sample = new me(e);
      else {
        g(this.merger);
        const s = await this.merger.merge(e, t);
        n.sample = new me(s);
      }
      for (; this.finalSamples.length > 0 && this.finalSamples[0].sample !== null; ) {
        const s = this.finalSamples.shift();
        this.sampleHandler(s.sample);
      }
    } catch (s) {
      cn(this.finalSamples, n), this.onError(s);
    } finally {
      cn(this.mergeAlphaPromises, i.promise), i.resolve();
    }
  }
  async flush() {
    if (this.customDecoder ? await this.customDecoderCallSerializer.call(() => this.customDecoder.flush()) : (g(this.decoder), await Promise.all([
      this.decoder.flush(),
      this.alphaDecoder?.flush()
    ]), await Promise.all(this.mergeAlphaPromises), this.colorQueue.forEach((e) => e.close()), this.colorQueue.length = 0, this.alphaQueue.forEach((e) => e?.close()), this.alphaQueue.length = 0, this.alphaHadKeyframe = !1, this.decodedAlphaChunkCount = 0, this.alphaDecoderQueueSize = 0, this.nullAlphaFrameQueue.length = 0, this.currentAlphaPacketIndex = 0, this.alphaRaslSkipped = !1), wr()) {
      for (const e of this.sampleQueue)
        this.finalizeAndEmitSample(e);
      this.sampleQueue.length = 0;
    }
    this.currentPacketIndex = 0, this.raslSkipped = !1;
  }
  close() {
    this.customDecoder ? this.customDecoderCallSerializer.call(() => this.customDecoder.close()) : (g(this.decoder), this.decoder.state !== "closed" && this.decoder.close(), this.alphaDecoder && this.alphaDecoder.state !== "closed" && this.alphaDecoder.close(), this.colorQueue.forEach((e) => e.close()), this.colorQueue.length = 0, this.alphaQueue.forEach((e) => e?.close()), this.alphaQueue.length = 0, this.merger?.close());
    for (const e of this.sampleQueue)
      e.close();
    this.sampleQueue.length = 0;
  }
}
let Ki = null;
class ad {
  constructor() {
    this.workers = [], this.nextWorkerIndex = 0, this.pendingRequests = /* @__PURE__ */ new Map(), this.nextRequestId = 0;
  }
  merge(e, t) {
    if (this.workers.length === 0) {
      if (!Ki) {
        const o = new Blob([`(${od.toString()})()`], { type: "application/javascript" });
        Ki = URL.createObjectURL(o);
      }
      const a = ae(navigator.hardwareConcurrency, 1, 4);
      for (let o = 0; o < a; o++) {
        const c = new Worker(Ki);
        c.addEventListener("message", (l) => {
          const u = l.data, d = this.pendingRequests.get(u.id);
          d && (this.pendingRequests.delete(u.id), "error" in u ? d.reject(new Error(u.error)) : d.resolve(u.frame));
        }), c.addEventListener("error", (l) => {
          const u = new Error(l.message || "Color/alpha merge worker error.");
          for (const d of this.pendingRequests.values())
            d.reject(u);
          this.pendingRequests.clear();
        }), this.workers.push(c);
      }
    }
    const i = this.nextRequestId++, n = ne();
    this.pendingRequests.set(i, n);
    const s = this.workers[this.nextWorkerIndex];
    return this.nextWorkerIndex = (this.nextWorkerIndex + 1) % this.workers.length, s.postMessage({ id: i, color: e, alpha: t }, { transfer: [e, t] }), n.promise;
  }
  close() {
    for (const t of this.workers)
      t.terminate();
    this.workers.length = 0;
    const e = new Error("Color/alpha merger closed.");
    for (const t of this.pendingRequests.values())
      t.reject(e);
    this.pendingRequests.clear();
  }
}
const od = () => {
  let r = null, e = null, t = Promise.resolve();
  self.addEventListener("message", (c) => {
    const { id: l, color: u, alpha: d } = c.data;
    t = t.then(async () => {
      try {
        const f = await i(u, d);
        self.postMessage({ id: l, frame: f }, { transfer: [f] });
      } catch (f) {
        self.postMessage({ id: l, error: f.message });
      } finally {
        u.close(), d.close();
      }
    });
  });
  const i = async (c, l) => {
    const u = c.format, d = l.format;
    if (!u || !d)
      throw new Error("CPU color/alpha merging requires a known VideoFrame format.");
    const f = u.includes("P10"), h = u.includes("P12"), p = d.includes("P10"), m = d.includes("P12");
    if (p !== f || m !== h)
      throw new Error(`CPU color/alpha merging requires the alpha frame to have the same bit depth as the color frame (color: '${u}', alpha: '${d}').`);
    if (u === "RGBX" || u === "RGBA" || u === "BGRX" || u === "BGRA")
      return await n(c, l, u);
    if (u === "I420" || u === "I420P10" || u === "I420P12" || u === "I422" || u === "I422P10" || u === "I422P12" || u === "I444" || u === "I444P10" || u === "I444P12")
      return await s(c, l, u);
    if (u === "NV12")
      return await a(c, l);
    throw new Error(`CPU color/alpha merging does not support format '${u}'.`);
  }, n = async (c, l, u) => {
    const d = c.visibleRect?.width ?? c.codedWidth, f = c.visibleRect?.height ?? c.codedHeight, h = d * f, p = new Uint8Array(h * 4);
    await c.copyTo(p);
    const m = await o(l, d, f, 1);
    for (let b = 0, k = 3; b < h; b++, k += 4)
      p[k] = m[b];
    const w = {
      format: u === "RGBX" || u === "RGBA" ? "RGBA" : "BGRA",
      codedWidth: d,
      codedHeight: f,
      timestamp: c.timestamp,
      duration: c.duration ?? void 0,
      transfer: [p.buffer]
    };
    return new VideoFrame(p, w);
  }, s = async (c, l, u) => {
    const d = c.visibleRect?.width ?? c.codedWidth, f = c.visibleRect?.height ?? c.codedHeight, h = u.includes("P10"), p = u.includes("P12"), m = h || p ? 2 : 1;
    let y, w;
    u.startsWith("I420") ? (y = Math.ceil(d / 2), w = Math.ceil(f / 2)) : u.startsWith("I422") ? (y = Math.ceil(d / 2), w = f) : (y = d, w = f);
    const b = d * f, k = y * w, A = b * m, T = k * m, x = b * m, C = A + 2 * T + x, P = new Uint8Array(C);
    await c.copyTo(P);
    const S = await o(l, d, f, m), E = A + 2 * T;
    P.set(S, E);
    const _ = {
      format: u.slice(0, 4) + "A" + u.slice(4),
      codedWidth: d,
      codedHeight: f,
      timestamp: c.timestamp,
      duration: c.duration ?? void 0,
      transfer: [P.buffer]
    };
    return new VideoFrame(P, _);
  }, a = async (c, l) => {
    const u = c.visibleRect?.width ?? c.codedWidth, d = c.visibleRect?.height ?? c.codedHeight, f = u * d, h = Math.ceil(u / 2), p = Math.ceil(d / 2), m = h * p, y = c.allocationSize();
    (!e || e.byteLength !== y) && (e = new Uint8Array(y)), await c.copyTo(e);
    const w = new Uint8Array(f + 2 * m + f);
    w.set(e.subarray(0, f), 0);
    const b = f, k = f + m, A = f;
    for (let C = 0; C < m; C++)
      w[b + C] = e[A + C * 2], w[k + C] = e[A + C * 2 + 1];
    const T = await o(l, u, d, 1);
    w.set(T, f + 2 * m);
    const x = {
      format: "I420A",
      codedWidth: u,
      codedHeight: d,
      timestamp: c.timestamp,
      duration: c.duration ?? void 0,
      transfer: [w.buffer]
    };
    return new VideoFrame(w, x);
  }, o = async (c, l, u, d) => {
    const f = c.allocationSize();
    (!r || r.byteLength !== f) && (r = new Uint8Array(f)), await c.copyTo(r);
    const h = c.format;
    if (h === "RGBA" || h === "BGRA" || h === "RGBX" || h === "BGRX") {
      const p = h === "RGBA" || h === "RGBX" ? 0 : 2, m = l * u;
      for (let y = 0; y < m; y++)
        r[y] = r[y * 4 + p];
      return r.subarray(0, m);
    } else
      return r.subarray(0, l * u * d);
  };
}, cd = (r) => {
  if (!r || typeof r != "object")
    throw new TypeError("decoderOptions must be an object.");
  if (r.hardwareAcceleration !== void 0 && !["no-preference", "prefer-hardware", "prefer-software"].includes(r.hardwareAcceleration))
    throw new TypeError("decoderOptions.hardwareAcceleration, when provided, must be 'no-preference', 'prefer-hardware' or 'prefer-software'.");
  if (r.optimizeForLatency !== void 0 && typeof r.optimizeForLatency != "boolean")
    throw new TypeError("decoderOptions.optimizeForLatency, when provided, must be a boolean.");
};
class sa extends Do {
  /** Creates a new {@link VideoSampleSink} for the given {@link InputVideoTrack}. */
  constructor(e, t = {}) {
    if (!(e instanceof Yn))
      throw new TypeError("videoTrack must be an InputVideoTrack.");
    cd(t), super(), this._track = e, this._decoderOptions = t;
  }
  /** @internal */
  async _createDecoder(e, t) {
    if (!await this._track.canDecode())
      throw typeof VideoDecoder > "u" ? new Error(yi("VideoDecoder")) : new Error("This video track cannot be decoded in this environment. Make sure to check decodability before using a track.");
    const i = await this._track.getCodec(), n = await this._track.getRotation();
    let s = await this._track.getDecoderConfig();
    const a = await this._track.getTimeResolution();
    return g(i && s), s = {
      ...s,
      hardwareAcceleration: this._decoderOptions.hardwareAcceleration,
      optimizeForLatency: this._decoderOptions.optimizeForLatency
    }, new sd(e, t, i, s, n, a);
  }
  /** @internal */
  _createPacketSink() {
    return new Jt(this._track);
  }
  /**
   * Retrieves the video sample (frame) corresponding to the given timestamp, in seconds. More specifically, returns
   * the last video sample (in presentation order) with a start timestamp less than or equal to the given timestamp.
   * Returns null if the timestamp is before the track's first timestamp.
   *
   * @param timestamp - The timestamp used for retrieval, in seconds.
   * @param options - Options used for the underlying packet retrieval.
   */
  async getSample(e, t = {}) {
    Bt(e);
    for await (const i of this.mediaSamplesAtTimestamps([e], t))
      return i;
    throw new Error("Internal error: Iterator returned nothing.");
  }
  /**
   * Creates an async iterator that yields the video samples (frames) of this track in presentation order. This method
   * will intelligently pre-decode a few frames ahead to enable fast iteration.
   *
   * @param startTimestamp - The timestamp in seconds at which to start yielding samples (inclusive).
   * @param endTimestamp - The timestamp in seconds at which to stop yielding samples (exclusive).
   * @param options - Options used for the underlying packet retrieval.
   */
  samples(e, t, i = {}) {
    return this.mediaSamplesInRange(e, t, i);
  }
  /**
   * Creates an async iterator that yields a video sample (frame) for each timestamp in the argument. This method
   * uses an optimized decoding pipeline if these timestamps are monotonically sorted, decoding each packet at most
   * once, and is therefore more efficient than manually getting the sample for every timestamp. The iterator may
   * yield null if no frame is available for a given timestamp.
   *
   * This method is good for sparse access of media data. If you want primarily sequential media access, prefer
   * {@link VideoSampleSink.samples} instead.
   *
   * @param timestamps - An iterable or async iterable of timestamps in seconds.
   * @param options - Options used for the underlying packet retrieval.
   */
  samplesAtTimestamps(e, t = {}) {
    return this.mediaSamplesAtTimestamps(e, t);
  }
}
class ld extends $n {
  constructor(e, t, i, n) {
    super(e, t), this.decoder = null, this.customDecoder = null, this.customDecoderCallSerializer = new gi(), this.customDecoderQueueSize = 0, this.currentTimestamp = null, this.expectedFirstTimestamp = null, this.timestampOffset = 0;
    const s = (o) => {
      let c = o.timestamp;
      this.expectedFirstTimestamp && this.currentTimestamp === null && (this.timestampOffset = this.expectedFirstTimestamp - c), c += this.timestampOffset, (this.currentTimestamp === null || Math.abs(c - this.currentTimestamp) >= o.duration) && (this.currentTimestamp = c);
      const l = this.currentTimestamp;
      if (this.currentTimestamp += o.duration, o.numberOfFrames === 0) {
        o.close();
        return;
      }
      const u = n.sampleRate;
      o.setTimestamp(Math.round(l * u) / u), e(o);
    }, a = Xn.find((o) => o.supports(i, n));
    if (a)
      this.customDecoder = new a(), this.customDecoder.codec = i, this.customDecoder.config = n, this.customDecoder.onSample = (o) => {
        if (!(o instanceof fe))
          throw new TypeError("The argument passed to onSample must be an AudioSample.");
        s(o);
      }, this.customDecoder.onError = (o) => {
        t(o);
      }, this.customDecoderCallSerializer.call(() => this.customDecoder.init()).catch((o) => t(o));
    else {
      const o = new Error("Decoding error").stack;
      this.decoder = new AudioDecoder({
        output: (c) => {
          try {
            s(new fe(c));
          } catch (l) {
            this.onError(l);
          }
        },
        error: (c) => {
          c.stack = o, this.onError(c);
        }
      }), this.decoder.configure(n);
    }
  }
  getDecodeQueueSize() {
    return this.customDecoder ? this.customDecoderQueueSize : (g(this.decoder), this.decoder.decodeQueueSize);
  }
  decode(e) {
    this.customDecoder ? (this.customDecoderQueueSize++, this.customDecoderCallSerializer.call(() => this.customDecoder.decode(e)).catch((t) => this.onError(t)).finally(() => this.customDecoderQueueSize--)) : (g(this.decoder), this.expectedFirstTimestamp ??= e.timestamp, this.decoder.decode(e.toEncodedAudioChunk()));
  }
  async flush() {
    this.customDecoder ? await this.customDecoderCallSerializer.call(() => this.customDecoder.flush()) : (g(this.decoder), await this.decoder.flush()), this.currentTimestamp = null, this.expectedFirstTimestamp = null, this.timestampOffset = 0;
  }
  close() {
    this.customDecoder ? this.customDecoderCallSerializer.call(() => this.customDecoder.close()) : (g(this.decoder), this.decoder.state !== "closed" && this.decoder.close());
  }
}
class ud extends $n {
  constructor(e, t, i) {
    super(e, t), this.decoderConfig = i, this.currentTimestamp = null, g(ye.includes(i.codec)), this.codec = i.codec;
    const { dataType: n, sampleSize: s, littleEndian: a } = at(this.codec);
    switch (this.inputSampleSize = s, s) {
      case 1:
        n === "unsigned" ? this.readInputValue = (o, c) => o.getUint8(c) - 2 ** 7 : n === "signed" ? this.readInputValue = (o, c) => o.getInt8(c) : n === "ulaw" ? this.readInputValue = (o, c) => rd(o.getUint8(c)) : n === "alaw" ? this.readInputValue = (o, c) => nd(o.getUint8(c)) : g(!1);
        break;
      case 2:
        n === "unsigned" ? this.readInputValue = (o, c) => o.getUint16(c, a) - 2 ** 15 : n === "signed" ? this.readInputValue = (o, c) => o.getInt16(c, a) : g(!1);
        break;
      case 3:
        n === "unsigned" ? this.readInputValue = (o, c) => pi(o, c, a) - 2 ** 23 : n === "signed" ? this.readInputValue = (o, c) => ic(o, c, a) : g(!1);
        break;
      case 4:
        n === "unsigned" ? this.readInputValue = (o, c) => o.getUint32(c, a) - 2 ** 31 : n === "signed" ? this.readInputValue = (o, c) => o.getInt32(c, a) : n === "float" ? this.readInputValue = (o, c) => o.getFloat32(c, a) : g(!1);
        break;
      case 8:
        n === "float" ? this.readInputValue = (o, c) => o.getFloat64(c, a) : g(!1);
        break;
      default:
        Re(s), g(!1);
    }
    switch (s) {
      case 1:
        n === "ulaw" || n === "alaw" ? (this.outputSampleSize = 2, this.outputFormat = "s16", this.writeOutputValue = (o, c, l) => o.setInt16(c, l, !0)) : (this.outputSampleSize = 1, this.outputFormat = "u8", this.writeOutputValue = (o, c, l) => o.setUint8(c, l + 2 ** 7));
        break;
      case 2:
        this.outputSampleSize = 2, this.outputFormat = "s16", this.writeOutputValue = (o, c, l) => o.setInt16(c, l, !0);
        break;
      case 3:
        this.outputSampleSize = 4, this.outputFormat = "s32", this.writeOutputValue = (o, c, l) => o.setInt32(c, l << 8, !0);
        break;
      case 4:
        this.outputSampleSize = 4, n === "float" ? (this.outputFormat = "f32", this.writeOutputValue = (o, c, l) => o.setFloat32(c, l, !0)) : (this.outputFormat = "s32", this.writeOutputValue = (o, c, l) => o.setInt32(c, l, !0));
        break;
      case 8:
        this.outputSampleSize = 4, this.outputFormat = "f32", this.writeOutputValue = (o, c, l) => o.setFloat32(c, l, !0);
        break;
      default:
        Re(s), g(!1);
    }
  }
  getDecodeQueueSize() {
    return 0;
  }
  decode(e) {
    const t = K(e.data), i = e.byteLength / this.decoderConfig.numberOfChannels / this.inputSampleSize, n = i * this.decoderConfig.numberOfChannels * this.outputSampleSize, s = new ArrayBuffer(n), a = new DataView(s);
    for (let u = 0; u < i * this.decoderConfig.numberOfChannels; u++) {
      const d = u * this.inputSampleSize, f = u * this.outputSampleSize, h = this.readInputValue(t, d);
      this.writeOutputValue(a, f, h);
    }
    const o = i / this.decoderConfig.sampleRate;
    (this.currentTimestamp === null || Math.abs(e.timestamp - this.currentTimestamp) >= o) && (this.currentTimestamp = e.timestamp);
    const c = this.currentTimestamp;
    this.currentTimestamp += o;
    const l = new fe({
      format: this.outputFormat,
      data: s,
      numberOfChannels: this.decoderConfig.numberOfChannels,
      sampleRate: this.decoderConfig.sampleRate,
      numberOfFrames: i,
      timestamp: c
    });
    this.onSample(l);
  }
  async flush() {
  }
  close() {
  }
}
class dd extends Do {
  /** Creates a new {@link AudioSampleSink} for the given {@link InputAudioTrack}. */
  constructor(e) {
    if (!(e instanceof Zn))
      throw new TypeError("audioTrack must be an InputAudioTrack.");
    super(), this._track = e;
  }
  /** @internal */
  async _createDecoder(e, t) {
    if (!await this._track.canDecode())
      throw typeof AudioDecoder > "u" ? new Error(yi("AudioDecoder")) : new Error("This audio track cannot be decoded in this environment. Make sure to check decodability before using a track.");
    const i = await this._track.getCodec(), n = await this._track.getDecoderConfig();
    return g(i && n), ye.includes(n.codec) ? new ud(e, t, n) : new ld(e, t, i, n);
  }
  /** @internal */
  _createPacketSink() {
    return new Jt(this._track);
  }
  /**
   * Retrieves the audio sample corresponding to the given timestamp, in seconds. More specifically, returns
   * the last audio sample (in presentation order) with a start timestamp less than or equal to the given timestamp.
   * Returns null if the timestamp is before the track's first timestamp.
   *
   * @param timestamp - The timestamp used for retrieval, in seconds.
   * @param options - Options used for the underlying packet retrieval.
   */
  async getSample(e, t = {}) {
    Bt(e);
    for await (const i of this.mediaSamplesAtTimestamps([e], t))
      return i;
    throw new Error("Internal error: Iterator returned nothing.");
  }
  /**
   * Creates an async iterator that yields the audio samples of this track in presentation order. This method
   * will intelligently pre-decode a few samples ahead to enable fast iteration.
   *
   * @param startTimestamp - The timestamp in seconds at which to start yielding samples (inclusive).
   * @param endTimestamp - The timestamp in seconds at which to stop yielding samples (exclusive).
   * @param options - Options used for the underlying packet retrieval.
   */
  samples(e, t, i = {}) {
    return this.mediaSamplesInRange(e, t, i);
  }
  /**
   * Creates an async iterator that yields an audio sample for each timestamp in the argument. This method
   * uses an optimized decoding pipeline if these timestamps are monotonically sorted, decoding each packet at most
   * once, and is therefore more efficient than manually getting the sample for every timestamp. The iterator may
   * yield null if no sample is available for a given timestamp.
   *
   * This method is good for sparse access of media data. If you want primarily sequential media access, prefer
   * {@link AudioSampleSink.samples} instead.
   *
   * @param timestamps - An iterable or async iterable of timestamps in seconds.
   * @param options - Options used for the underlying packet retrieval.
   */
  samplesAtTimestamps(e, t = {}) {
    return this.mediaSamplesAtTimestamps(e, t);
  }
}
class Dr {
  /** @internal */
  constructor(e, t) {
    this.input = e, this._backing = t;
  }
  /** Returns true if and only if this track is a video track. */
  isVideoTrack() {
    return this instanceof Yn;
  }
  /** Returns true if and only if this track is an audio track. */
  isAudioTrack() {
    return this instanceof Zn;
  }
  /** The unique ID of this track in the input file. */
  get id() {
    return this._backing.getId();
  }
  /**
   * The 1-based index of this track among all tracks of the same type in the input file. For example, the first
   * video track has number 1, the second video track has number 2, and so on. The index refers to the order in
   * which the tracks are returned by {@link Input.getTracks}.
   */
  get number() {
    return this._backing.getNumber();
  }
  /**
   * Returns the identifier of the codec used internally by the container. It is not homogenized by Mediabunny
   * and depends entirely on the container format.
   *
   * This method can be used to determine the codec of a track in case Mediabunny doesn't know that codec.
   *
   * - For ISOBMFF files, this resolves to the name of the Sample Description Box (e.g. `'avc1'`).
   * - For Matroska files, this resolves to the value of the `CodecID` element.
   * - For WAVE files, this resolves to the value of the format tag in the `'fmt '` chunk.
   * - For ADTS files, this resolves to the `MPEG-4 Audio Object Type`.
   * - For MPEG-TS files, this resolves to the `streamType` value from the Program Map Table.
   * - In all other cases, this resolves to `null`.
   */
  async getInternalCodecId() {
    return this._backing.getInternalCodecId();
  }
  /**
   * See {@link InputTrack.getInternalCodecId}.
   * @deprecated Use {@link InputTrack.getInternalCodecId} instead.
   */
  get internalCodecId() {
    return J(this._backing.getInternalCodecId(), "internalCodecId", "getInternalCodecId");
  }
  /**
   * Returns the ISO 639-2/T language code for this track. If the language is unknown, this resolves to `'und'`
   * (undetermined).
   */
  async getLanguageCode() {
    return this._backing.getLanguageCode();
  }
  /**
   * The ISO 639-2/T language code for this track. If the language is unknown, this field is `'und'` (undetermined).
   * @deprecated Use {@link InputTrack.getLanguageCode} instead.
   */
  get languageCode() {
    return J(this._backing.getLanguageCode(), "languageCode", "getLanguageCode");
  }
  /** Returns the user-defined name for this track. */
  async getName() {
    return this._backing.getName();
  }
  /**
   * A user-defined name for this track.
   * @deprecated Use {@link InputTrack.getName} instead.
   */
  get name() {
    return J(this._backing.getName(), "name", "getName");
  }
  /**
   * Returns a positive number x such that all timestamps and durations of all packets of this track are
   * integer multiples of 1/x.
   */
  async getTimeResolution() {
    return this._backing.getTimeResolution();
  }
  /**
   * A positive number x such that all timestamps and durations of all packets of this track are
   * integer multiples of 1/x.
   * @deprecated Use {@link InputTrack.getTimeResolution} instead.
   */
  get timeResolution() {
    return J(this._backing.getTimeResolution(), "timeResolution", "getTimeResolution");
  }
  /**
   * Returns whether the timestamps of this track are relative to the Unix epoch (January 1, 1970 00:00:00 UTC).
   * When `true`, each timestamp maps to a definitive point in time.
   */
  async isRelativeToUnixEpoch() {
    return this._backing.isRelativeToUnixEpoch();
  }
  /**
   * Returns the Unix time (in seconds since January 1, 1970 00:00:00 UTC) that the given track timestamp (in seconds)
   * maps to, or `null` if there is no such mapping. This provides a piecewise-continuous mapping from this track's
   * timestamp space into wall-clock time. Such mapping exists, for example, for HLS playlists with
   * `#EXT-X-PROGRAM-DATE-TIME` tags present.
   *
   * This mapping can be available even when {@link InputTrack.isRelativeToUnixEpoch} is `false`, for example for HLS
   * streams with program date time information but with {@link HlsInputFormatOptions.offsetTimestampsByDateTime}
   * set to `false`.
   */
  async getUnixTimeForTimestamp(e) {
    return this._backing.getUnixTimeForTimestamp(e);
  }
  /**
   * Whether the track's timestamps can be mapped to Unix wall clock time via
   * {@link InputTrack.getUnixTimeForTimestamp}.
   */
  async hasUnixTimeMapping() {
    return await this._backing.getUnixTimeForTimestamp(await this.getFirstTimestamp()) !== null;
  }
  /** Returns the track's disposition, i.e. information about its intended usage. */
  async getDisposition() {
    return this._backing.getDisposition();
  }
  /**
   * The track's disposition, i.e. information about its intended usage.
   * @deprecated Use {@link InputTrack.getDisposition} instead.
   */
  get disposition() {
    return J(this._backing.getDisposition(), "disposition", "getDisposition");
  }
  /**
   * Returns the peak bitrate of the track in bits per second, as specified in the track's metadata. This might not
   * match the actual media data's bitrate.
   */
  async getBitrate() {
    return this._backing.getBitrate();
  }
  /**
   * Returns the average bitrate of the track in bits per second, as specified in the track's metadata. This might
   * not match the actual media data's bitrate.
   */
  async getAverageBitrate() {
    return this._backing.getAverageBitrate();
  }
  /**
   * Returns the start timestamp of the first packet of this track, in seconds. While often near zero, this value
   * may be positive or even negative. A negative starting timestamp means the track's timing has been offset. Samples
   * with a negative timestamp should not be presented.
   */
  async getFirstTimestamp() {
    return (await this._backing.getFirstPacket({ metadataOnly: !0 }))?.timestamp ?? 0;
  }
  /**
   * Returns the end timestamp of the last packet of this track, in seconds.
   *
   * By default, when the underlying media is live, this method will only resolve once the live stream ends. If you
   * want to query the current end timestamp of the stream, set {@link PacketRetrievalOptions.skipLiveWait} to `true`
   * in the options.
   */
  async computeDuration(e) {
    const t = await this._backing.getPacket(1 / 0, { metadataOnly: !0, ...e }), i = (t?.timestamp ?? 0) + (t?.duration ?? 0);
    return ri(i, await this.getTimeResolution());
  }
  /**
   * Gets the duration (end timestamp) in seconds of this track from metadata stored in the file. This value may be
   * approximate or diverge from the actual, precise duration returned by `.computeDuration()`, but compared to that
   * method, this method is cheaper. When the duration cannot be determined from the file metadata, `null`
   * is returned.
   *
   * By default, when the underlying media is live, this method will only resolve once the live stream
   * ends. If you want to query the current duration of the media, set
   * {@link DurationMetadataRequestOptions.skipLiveWait} to `true` in the options.
   */
  async getDurationFromMetadata(e = {}) {
    return this._backing.getDurationFromMetadata(e);
  }
  /**
   * Computes aggregate packet statistics for this track, such as average packet rate or bitrate.
   *
   * @param targetPacketCount - This optional parameter sets a target for how many packets this method must have
   * looked at before it can return early; this means, you can use it to aggregate only a subset (prefix) of all
   * packets. This is very useful for getting a great estimate of video frame rate without having to scan through the
   * entire file.
   *
   * By default, when the underlying media is live and `targetPacketCount` is not set, this method will only resolve
   * once the live stream ends. If you want to query the current packet statistics of the stream, set
   * {@link PacketRetrievalOptions.skipLiveWait} to `true` in the options.
   */
  async computePacketStats(e = 1 / 0, t) {
    const i = new Jt(this);
    let n = 1 / 0, s = -1 / 0, a = 0, o = 0;
    for await (const c of i.packets(void 0, void 0, { metadataOnly: !0, ...t })) {
      if (a >= e && c.timestamp >= s)
        break;
      n = Math.min(n, c.timestamp), s = Math.max(s, c.timestamp + c.duration), a++, o += c.byteLength;
    }
    return {
      packetCount: a,
      averagePacketRate: a ? Number((a / (s - n)).toPrecision(16)) : 0,
      averageBitrate: a ? Number((8 * o / (s - n)).toPrecision(16)) : 0
    };
  }
  /**
   * Whether or not this track is currently live, meaning the media's end is still unknown.
   *
   * The value returned by this method may change over time as the track stops being live. To keep track of the
   * track's live status, poll this method at the track's refresh interval
   * via {@link InputTrack.getLiveRefreshInterval}.
   */
  async isLive() {
    return await this._backing.getLiveRefreshInterval() !== null;
  }
  /**
   * Returns the track's live refresh interval in seconds, or `null` if the track is not live. This interval describes
   * the time it takes, on average, for new live media data to become available.
   */
  async getLiveRefreshInterval() {
    return this._backing.getLiveRefreshInterval();
  }
  /**
   * Returns `true` if this track can be paired with the given track. Two tracks being pairable means they can be
   * presented (displayed) together.
   *
   * Returns `false` if `other` equals `this`.
   */
  canBePairedWith(e) {
    if (!(e instanceof Dr))
      throw new TypeError("other must be an InputTrack.");
    return this.input !== e.input || this === e ? !1 : (this._backing.getPairingMask() & e._backing.getPairingMask()) !== 0n;
  }
  /**
   * Gets the list of other tracks that can be paired with this track. An optional query can be provided to narrow
   * down the results.
   */
  async getPairableTracks(e) {
    return this.input.getTracks(St({
      filter: (t) => t.canBePairedWith(this)
    }, e));
  }
  /**
   * Gets the list of other video tracks that can be paired with this track. An optional query can be provided to
   * narrow down the results.
   */
  async getPairableVideoTracks(e) {
    return this.input.getVideoTracks(St({
      filter: (t) => t.canBePairedWith(this)
    }, e));
  }
  /**
   * Gets the list of other audio tracks that can be paired with this track. An optional query can be provided to
   * narrow down the results.
   */
  async getPairableAudioTracks(e) {
    return this.input.getAudioTracks(St({
      filter: (t) => t.canBePairedWith(this)
    }, e));
  }
  /** Returns the primary track that can be paired with this track, optionally steered by the provided query. */
  async getPrimaryPairableVideoTrack(e) {
    return this.input.getPrimaryVideoTrack(St({
      filter: (t) => t.canBePairedWith(this)
    }, e));
  }
  /** Returns the primary track that can be paired with this track, optionally steered by the provided query. */
  async getPrimaryPairableAudioTrack(e) {
    return this.input.getPrimaryAudioTrack(St({
      filter: (t) => t.canBePairedWith(this)
    }, e));
  }
  /** Returns `true` if there is another track that can be paired with this track. */
  async hasPairableTrack(e) {
    e &&= Qi(e);
    const t = await this.input.getTracks();
    for (const i of t)
      if (this.canBePairedWith(i) && (!e || await e(i)))
        return !0;
    return !1;
  }
  /** Returns `true` if there is a video track that can be paired with this track. */
  hasPairableVideoTrack(e) {
    return e &&= Qi(e), this.hasPairableTrack(async (t) => t.isVideoTrack() && (!e || await e(t)));
  }
  /** Returns `true` if there is an audio track that can be paired with this track. */
  hasPairableAudioTrack(e) {
    return e &&= Qi(e), this.hasPairableTrack(async (t) => t.isAudioTrack() && (!e || await e(t)));
  }
}
const J = (r, e, t) => {
  if (r instanceof Promise)
    throw new Error(`'${e}' is deprecated and not available synchronously for this track. Use the preferred '${t}()' instead.`);
  return r;
}, Qi = (r) => {
  if (r !== void 0 && typeof r != "function")
    throw new TypeError("predicate, when provided, must be a function.");
  return r ? (e) => {
    const t = (n) => {
      if (typeof n != "boolean")
        throw new TypeError("predicate must return or resolve to a boolean value.");
      return n;
    }, i = r(e);
    return i instanceof Promise ? i.then(t) : t(i);
  } : void 0;
};
class Yn extends Dr {
  /** @internal */
  constructor(e, t) {
    super(e, t), this._pixelAspectRatioCache = null, this._backing = t;
  }
  get type() {
    return "video";
  }
  /** The codec of the track's packets. */
  async getCodec() {
    return this._backing.getCodec();
  }
  /**
   * The codec of the track's packets.
   * @deprecated Use {@link InputVideoTrack.getCodec} instead.
   */
  get codec() {
    return J(this._backing.getCodec(), "codec", "getCodec");
  }
  async hasOnlyKeyPackets() {
    return await this._backing.getHasOnlyKeyPackets?.() ?? await this._backing.getCodec() === "prores";
  }
  /** Returns the width in pixels of the track's coded samples, before any transformations or rotations. */
  async getCodedWidth() {
    return this._backing.getCodedWidth();
  }
  /**
   * The width in pixels of the track's coded samples, before any transformations or rotations.
   * @deprecated Use {@link InputVideoTrack.getCodedWidth} instead.
   */
  get codedWidth() {
    return J(this._backing.getCodedWidth(), "codedWidth", "getCodedWidth");
  }
  /** Returns the height in pixels of the track's coded samples, before any transformations or rotations. */
  async getCodedHeight() {
    return this._backing.getCodedHeight();
  }
  /**
   * The height in pixels of the track's coded samples, before any transformations or rotations.
   * @deprecated Use {@link InputVideoTrack.getCodedHeight} instead.
   */
  get codedHeight() {
    return J(this._backing.getCodedHeight(), "codedHeight", "getCodedHeight");
  }
  /** Returns the angle in degrees by which the track's frames should be rotated (clockwise). */
  async getRotation() {
    return this._backing.getRotation();
  }
  /**
   * The angle in degrees by which the track's frames should be rotated (clockwise).
   * @deprecated Use {@link InputVideoTrack.getRotation} instead.
   */
  get rotation() {
    return J(this._backing.getRotation(), "rotation", "getRotation");
  }
  /**
   * Returns the width of the track's frames in square pixels, adjusted for pixel aspect ratio but before rotation.
   */
  async getSquarePixelWidth() {
    return this._backing.getSquarePixelWidth();
  }
  /**
   * The width of the track's frames in square pixels, adjusted for pixel aspect ratio but before rotation.
   * @deprecated Use {@link InputVideoTrack.getSquarePixelWidth} instead.
   */
  get squarePixelWidth() {
    return J(this._backing.getSquarePixelWidth(), "squarePixelWidth", "getSquarePixelWidth");
  }
  /**
   * Returns the height of the track's frames in square pixels, adjusted for pixel aspect ratio but before rotation.
   */
  async getSquarePixelHeight() {
    return this._backing.getSquarePixelHeight();
  }
  /**
   * The height of the track's frames in square pixels, adjusted for pixel aspect ratio but before rotation.
   * @deprecated Use {@link InputVideoTrack.getSquarePixelHeight} instead.
   */
  get squarePixelHeight() {
    return J(this._backing.getSquarePixelHeight(), "squarePixelHeight", "getSquarePixelHeight");
  }
  /**
   * Returns the pixel aspect ratio of the track's frames as a rational number in its reduced form. Most videos use
   * square pixels (1:1).
   */
  async getPixelAspectRatio() {
    return this._pixelAspectRatioCache ??= Cr({
      num: await this.getSquarePixelWidth() * await this.getCodedHeight(),
      den: await this.getSquarePixelHeight() * await this.getCodedWidth()
    });
  }
  /**
   * The pixel aspect ratio of the track's frames, as a rational number in its reduced form. Most videos use
   * square pixels (1:1).
   * @deprecated Use {@link InputVideoTrack.getPixelAspectRatio} instead.
   */
  get pixelAspectRatio() {
    return this._pixelAspectRatioCache ??= Cr({
      num: J(this._backing.getSquarePixelWidth(), "pixelAspectRatio", "getPixelAspectRatio") * J(this._backing.getCodedHeight(), "pixelAspectRatio", "getPixelAspectRatio"),
      den: J(this._backing.getSquarePixelHeight(), "pixelAspectRatio", "getPixelAspectRatio") * J(this._backing.getCodedWidth(), "pixelAspectRatio", "getPixelAspectRatio")
    });
  }
  /** Returns the display width of the track's frames in pixels, after aspect ratio adjustment and rotation. */
  async getDisplayWidth() {
    const e = await this._backing.getMetadataDisplayWidth?.();
    return e ?? (await this.getRotation() % 180 === 0 ? this.getSquarePixelWidth() : this.getSquarePixelHeight());
  }
  /**
   * The display width of the track's frames in pixels, after aspect ratio adjustment and rotation.
   * @deprecated Use {@link InputVideoTrack.getDisplayWidth} instead.
   */
  get displayWidth() {
    const e = this._backing.getMetadataDisplayWidth?.();
    if (e !== void 0) {
      const n = J(e, "displayWidth", "getDisplayWidth");
      if (n !== null)
        return n;
    }
    const i = J(this._backing.getRotation(), "displayWidth", "getDisplayWidth") % 180 === 0 ? this._backing.getSquarePixelWidth() : this._backing.getSquarePixelHeight();
    return J(i, "displayWidth", "getDisplayWidth");
  }
  /** Returns the display height of the track's frames in pixels, after aspect ratio adjustment and rotation. */
  async getDisplayHeight() {
    const e = await this._backing.getMetadataDisplayHeight?.();
    return e ?? (await this.getRotation() % 180 === 0 ? this.getSquarePixelHeight() : this.getSquarePixelWidth());
  }
  /**
   * The display height of the track's frames in pixels, after aspect ratio adjustment and rotation.
   * @deprecated Use {@link InputVideoTrack.getDisplayHeight} instead.
   */
  get displayHeight() {
    const e = this._backing.getMetadataDisplayHeight?.();
    if (e !== void 0) {
      const n = J(e, "displayHeight", "getDisplayHeight");
      if (n !== null)
        return n;
    }
    const i = J(this._backing.getRotation(), "displayHeight", "getDisplayHeight") % 180 === 0 ? this._backing.getSquarePixelHeight() : this._backing.getSquarePixelWidth();
    return J(i, "displayHeight", "getDisplayHeight");
  }
  /** Returns the color space of the track's samples. */
  async getColorSpace() {
    return this._backing.getColorSpace();
  }
  /** If this method returns true, the track's samples use a high dynamic range (HDR). */
  async hasHighDynamicRange() {
    const e = await this._backing.getColorSpace();
    return e.primaries === "bt2020" || e.primaries === "smpte432" || e.transfer === "pq" || e.transfer === "hlg" || e.matrix === "bt2020-ncl";
  }
  /** Checks if this track may contain transparent samples with alpha data. */
  async canBeTransparent() {
    return this._backing.canBeTransparent();
  }
  /**
   * Returns the [decoder configuration](https://www.w3.org/TR/webcodecs/#video-decoder-config) for decoding the
   * track's packets using a [`VideoDecoder`](https://developer.mozilla.org/en-US/docs/Web/API/VideoDecoder). Returns
   * null if the track's codec is unknown.
   */
  async getDecoderConfig() {
    return this._backing.getDecoderConfig();
  }
  async getCodecParameterString() {
    const e = await this._backing.getMetadataCodecParameterString?.();
    return e ?? (await this._backing.getDecoderConfig())?.codec ?? null;
  }
  async canDecode() {
    try {
      const e = await this._backing.getDecoderConfig();
      if (!e)
        return !1;
      const t = await this._backing.getCodec();
      return g(t !== null), Oo.some((n) => n.supports(t, e)) ? !0 : typeof VideoDecoder > "u" ? !1 : (await VideoDecoder.isConfigSupported(e)).supported === !0;
    } catch (e) {
      return q._error("Error during decodability check:", e), !1;
    }
  }
  async determinePacketType(e) {
    if (!(e instanceof Y))
      throw new TypeError("packet must be an EncodedPacket.");
    if (e.isMetadataOnly)
      throw new TypeError("packet must not be metadata-only to determine its type.");
    const t = await this.getCodec();
    if (t === null)
      return null;
    const i = await this.getDecoderConfig();
    return g(i), xi(t, i, e.data);
  }
  /**
   * Computes frame rate metrics for this video track, i.e. estimates the video's frame rate. Frame rate is never
   * determined from file metadata (which is unreliable) but is always deduced directly from the actual frame
   * timestamps.
   */
  async computeFrameRateMetrics(e = {}) {
    if (!e || typeof e != "object")
      throw new TypeError("options must be an object.");
    if (e.targetPacketCount !== void 0 && (!Number.isFinite(e.targetPacketCount) || e.targetPacketCount < 0))
      throw new TypeError("options.targetPacketCount must be a non-negative number.");
    const t = await this.getTimeResolution(), i = e.targetPacketCount ?? 256, n = new Jt(this), s = [];
    let a = -1 / 0, o = 0;
    for await (const E of n.packets(void 0, void 0, { metadataOnly: !0 })) {
      if (s.length >= i && E.timestamp >= a)
        break;
      s.push(E.timestamp), a = Math.max(a, E.timestamp), o++;
    }
    const c = new Float64Array(s.length);
    for (let E = 0; E < s.length; E++)
      c[E] = Math.round(s[E] * t);
    c.sort();
    let l = 1;
    for (let E = 1; E < c.length; E++)
      c[E] !== c[l - 1] && (c[l++] = c[E]);
    if (l < 2)
      return {
        underlyingFrameRate: null,
        bestGuessFrameRate: t,
        minFrameRate: t,
        maxFrameRate: t,
        averageFrameRate: t,
        medianFrameRate: t,
        frameRateIsConstant: !0,
        probedPacketCount: o
      };
    const u = c.subarray(0, l), d = fd(u, t), f = d ?? t, h = d !== null ? t / d : null, p = /* @__PURE__ */ new Map();
    let m = 1 / 0, y = -1 / 0, w = 0;
    for (let E = 1; E < l; E++) {
      const I = u[E] - u[E - 1], _ = h !== null ? Math.max(1, Math.round(I / h)) : I;
      p.set(_, (p.get(_) ?? 0) + 1), m = Math.min(m, _), y = Math.max(y, _), w += _;
    }
    const b = l - 1, k = [...p.keys()].sort((E, I) => E - I), A = b - 1 >> 1, T = b >> 1;
    let x = 0, C = 0, P = 0;
    for (const E of k)
      if (P += p.get(E), x === 0 && P > A && (x = E), P > T) {
        C = E;
        break;
      }
    const S = (f / x + f / C) / 2;
    return {
      underlyingFrameRate: d,
      bestGuessFrameRate: d !== null ? d : hd(S),
      minFrameRate: f / y,
      maxFrameRate: f / m,
      averageFrameRate: f * b / w,
      medianFrameRate: S,
      frameRateIsConstant: d !== null && m === 1 && y === 1,
      probedPacketCount: o
    };
  }
}
class Zn extends Dr {
  /** @internal */
  constructor(e, t) {
    super(e, t), this._backing = t;
  }
  get type() {
    return "audio";
  }
  /** The codec of the track's packets. */
  async getCodec() {
    return this._backing.getCodec();
  }
  /**
   * The codec of the track's packets.
   * @deprecated Use {@link InputAudioTrack.getCodec} instead.
   */
  get codec() {
    return J(this._backing.getCodec(), "codec", "getCodec");
  }
  async hasOnlyKeyPackets() {
    return await this._backing.getHasOnlyKeyPackets?.() ?? !0;
  }
  /** Returns the number of audio channels in the track. */
  async getNumberOfChannels() {
    return this._backing.getNumberOfChannels();
  }
  /**
   * The number of audio channels in the track.
   * @deprecated Use {@link InputAudioTrack.getNumberOfChannels} instead.
   */
  get numberOfChannels() {
    return J(this._backing.getNumberOfChannels(), "numberOfChannels", "getNumberOfChannels");
  }
  /** Returns the track's audio sample rate in hertz. */
  async getSampleRate() {
    return this._backing.getSampleRate();
  }
  /**
   * The track's audio sample rate in hertz.
   * @deprecated Use {@link InputAudioTrack.getSampleRate} instead.
   */
  get sampleRate() {
    return J(this._backing.getSampleRate(), "sampleRate", "getSampleRate");
  }
  /**
   * Returns the [decoder configuration](https://www.w3.org/TR/webcodecs/#audio-decoder-config) for decoding the
   * track's packets using an [`AudioDecoder`](https://developer.mozilla.org/en-US/docs/Web/API/AudioDecoder). Returns
   * null if the track's codec is unknown.
   */
  async getDecoderConfig() {
    return this._backing.getDecoderConfig();
  }
  async getCodecParameterString() {
    const e = await this._backing.getMetadataCodecParameterString?.();
    return e ?? (await this._backing.getDecoderConfig())?.codec ?? null;
  }
  async canDecode() {
    try {
      const e = await this._backing.getDecoderConfig();
      if (!e)
        return !1;
      const t = await this._backing.getCodec();
      return g(t !== null), Xn.some((i) => i.supports(t, e)) || e.codec.startsWith("pcm-") ? !0 : typeof AudioDecoder > "u" ? !1 : (await AudioDecoder.isConfigSupported(e)).supported === !0;
    } catch (e) {
      return q._error("Error during decodability check:", e), !1;
    }
  }
  async determinePacketType(e) {
    if (!(e instanceof Y))
      throw new TypeError("packet must be an EncodedPacket.");
    return await this.getCodec() === null ? null : "key";
  }
}
const aa = (r) => -(r ?? -1 / 0), ur = (r) => -r, dr = (r) => {
  if (typeof r != "object" || !r)
    throw new TypeError("query must be an object.");
  if (r.filter !== void 0 && typeof r.filter != "function")
    throw new TypeError("query.filter, when provided, must be a function.");
  if (r.sortBy !== void 0 && typeof r.sortBy != "function")
    throw new TypeError("query.sortBy, when provided, must be a function.");
  return {
    filter: r.filter ? (e) => {
      const t = (n) => {
        if (typeof n != "boolean")
          throw new TypeError("query.filter must return or resolve to a boolean.");
        return n;
      }, i = r.filter(e);
      return i instanceof Promise ? i.then(t) : t(i);
    } : void 0,
    sortBy: r.sortBy ? (e) => {
      const t = (n) => {
        if (typeof n != "number" && (!Array.isArray(n) || !n.every((s) => typeof s == "number")))
          throw new TypeError("query.sortBy must return or resolve to a number or an array of numbers.");
        return n;
      }, i = r.sortBy(e);
      return i instanceof Promise ? i.then(t) : t(i);
    } : void 0
  };
}, St = (r, e) => ({
  filter: r?.filter || e?.filter ? (t) => {
    const i = r?.filter?.(t) ?? !0, n = (s) => s === !1 ? !1 : e?.filter?.(t) ?? !0;
    return i instanceof Promise ? i.then(n) : n(i);
  } : void 0,
  sortBy: r?.sortBy || e?.sortBy ? (t) => {
    const i = r?.sortBy?.(t) ?? [], n = e?.sortBy?.(t) ?? [], s = (a, o) => [
      ...Array.isArray(a) ? a : [a],
      ...Array.isArray(o) ? o : [o]
    ];
    return i instanceof Promise || n instanceof Promise ? Promise.all([i, n]).then(([a, o]) => s(a, o)) : s(i, n);
  } : void 0
}), Gi = async (r, e) => {
  let t = r;
  if (e?.filter) {
    const a = r.map((c) => e.filter(c));
    if (a.some((c) => c instanceof Promise)) {
      const c = await Promise.all(a);
      t = r.filter((l, u) => c[u]);
    } else
      t = r.filter((c, l) => a[l]);
  }
  if (!e?.sortBy)
    return t;
  const i = t.map((a) => e.sortBy(a)), s = i.some((a) => a instanceof Promise) ? await Promise.all(i) : i;
  return t.map((a, o) => ({ track: a, sortValue: s[o] })).sort((a, o) => {
    const c = Array.isArray(a.sortValue) ? a.sortValue : [a.sortValue], l = Array.isArray(o.sortValue) ? o.sortValue : [o.sortValue], u = Math.max(c.length, l.length);
    for (let d = 0; d < u; d++) {
      const f = c[d] ?? 0, h = l[d] ?? 0;
      if (f !== h)
        return f - h;
    }
    return 0;
  }).map((a) => a.track);
}, fd = (r, e) => {
  const n = 1.000000001, s = 1e3, a = [
    12,
    15,
    20,
    24e3 / 1001,
    24,
    25,
    3e4 / 1001,
    30,
    48,
    50,
    6e4 / 1001,
    60,
    100,
    12e4 / 1001,
    120,
    144,
    240
  ];
  if (r.length < 2)
    return null;
  const o = new Float64Array(r.length - 1);
  for (let C = 1; C < r.length; C++) {
    const P = r[C] - r[C - 1];
    if (!(P > 0))
      return null;
    o[C - 1] = P;
  }
  const c = o.slice();
  c.sort();
  let l = c[Math.floor(c.length * 0.05)];
  for (let C = 0; C < 6; C++) {
    let P = 0, S = 0;
    for (const I of o) {
      const _ = Math.max(1, Math.round(I / l));
      Math.abs(I - _ * l) >= n || (P += I, S += _);
    }
    if (S === 0)
      return null;
    const E = P / S;
    if (Math.abs(E - l) <= 1e-12 * Math.max(1, l)) {
      l = E;
      break;
    }
    l = E;
  }
  let u = 0, d = 0, f = 0;
  for (const C of o) {
    const P = Math.max(1, Math.round(C / l));
    Math.abs(C - P * l) >= n || (u++, d += C, f += P);
  }
  if (u / o.length < 0.98)
    return null;
  l = d / f;
  const h = 1 / Math.min(f, s), p = Math.max(Number.EPSILON, l - h), m = l + h, y = e / m, w = e / p, b = e / l;
  let k = null, A = 1 / 0;
  for (const C of a) {
    if (C < y || C > w)
      continue;
    const P = Math.abs(C / b - 1);
    P < A && (k = C, A = P);
  }
  if (k === null) {
    const C = oa(p, m, 1e6), P = oa(y, w, 1e6);
    if (P && (!C || P.den < C.den || P.den === C.den && P.num <= C.num))
      k = P.num / P.den;
    else if (C)
      k = e * C.den / C.num;
    else
      return null;
  }
  const T = e / k;
  let x = 0;
  for (const C of o) {
    const P = Math.max(1, Math.round(C / T));
    Math.abs(C - P * T) < n && x++;
  }
  return x / o.length < 0.98 ? null : k;
}, oa = (r, e, t) => {
  for (let i = 1; i <= t; i++) {
    const n = Math.floor(r * i) + 1;
    if (n / i < e)
      return Cr({ num: n, den: i });
  }
  return null;
}, hd = (r) => {
  const e = [
    23.976023976023978,
    29.970029970029973,
    59.940059940059946,
    119.88011988011989
  ], t = [
    12,
    15,
    20,
    24,
    25,
    30,
    48,
    50,
    60,
    100,
    120,
    144,
    240
  ], i = 5e-4, n = 0.025;
  for (const o of e)
    if (Math.abs(o / r - 1) <= i)
      return o;
  let s = r, a = 1 / 0;
  for (const o of t) {
    const c = Math.abs(o / r - 1);
    c <= n && c < a && (s = o, a = c);
  }
  return s;
};
Mn();
const md = 1, pd = 2;
class er extends Fr {
  /** True if the input has been disposed. */
  get disposed() {
    return this._disposed;
  }
  /**
   * Creates a new input file from the specified options. No reading operations will be performed until methods are
   * called on this instance.
   */
  constructor(e) {
    if (super(), this._demuxerPromise = null, this._format = null, this._trackBackingsCache = null, this._backingToTrack = /* @__PURE__ */ new Map(), this._disposed = !1, this._nextSourceCacheAge = 0, this._sourceRefs = [], this._sourceCache = [], this._sourceCachePromises = [], this._onFormatDetermined = null, !e || typeof e != "object")
      throw new TypeError("options must be an object.");
    if (!Array.isArray(e.formats) || e.formats.some((t) => !(t instanceof $e)))
      throw new TypeError("options.formats must be an array of InputFormat.");
    if (!(e.source instanceof Ge || e.source instanceof Gn))
      throw new TypeError("options.source must be a Source or SourceRef.");
    if (e.source instanceof Ge && e.source._disposed)
      throw new TypeError("options.source must not be a disposed Source.");
    if (e.initInput !== void 0 && !(e.initInput instanceof er))
      throw new TypeError("options.initInput, when provided, must be an Input.");
    e.formatOptions !== void 0 && Bu(e.formatOptions, "formatOptions"), this._formats = e.formats, this._initInput = e.initInput ?? null, this._formatOptions = e.formatOptions ?? {}, e.source instanceof Ge ? this._rootRef = e.source.ref() : this._rootRef = e.source, this._sourceRefs.push(this._rootRef);
  }
  /** @internal */
  get _rootSource() {
    return this._rootRef.source;
  }
  /** @internal */
  async _getSourceUncached(e) {
    g(this._rootSource instanceof Or);
    const t = await this._rootSource._resolveRequest(e);
    return this._emit("source", { source: t.source, request: e, isRoot: e.isRoot }), t;
  }
  /** @internal */
  _getSourceCached(e, t = md) {
    const i = this._sourceCache.find((a) => a.cacheGroup === t && Us(a.request, e));
    if (i)
      return i.age++, Promise.resolve(i.sourceRef.source.ref());
    const n = this._sourceCachePromises.find((a) => a.cacheGroup === t && Us(a.request, e));
    if (n)
      return n.promise.then((a) => a.sourceRef.source.ref());
    const s = (async () => {
      const a = await this._getSourceUncached(e);
      if (pr(this._sourceCache, (d) => d.cacheGroup === t && d.sourceRef.source._refCount === 1) >= 4) {
        const d = On(this._sourceCache, (h) => h.cacheGroup === t && h.sourceRef.source._refCount === 1 ? h.age : 1 / 0);
        g(d !== -1);
        const f = this._sourceCache[d];
        this._sourceCache.splice(d, 1), f.sourceRef.free(), cn(this._sourceRefs, f.sourceRef);
      }
      this._sourceRefs.push(a);
      const l = this._sourceCachePromises.findIndex((d) => d.request === e);
      return g(l !== -1), this._sourceCachePromises.splice(l, 1), {
        request: e,
        sourceRef: a,
        age: this._nextSourceCacheAge++,
        cacheGroup: t
      };
    })();
    return this._sourceCachePromises.push({
      request: e,
      cacheGroup: t,
      promise: s
    }), s.then((a) => {
      const o = a.sourceRef.source.ref();
      return this._sourceCache.push(a), o;
    });
  }
  /** @internal */
  _getDemuxer() {
    return this._demuxerPromise ??= (async () => {
      this._reader = new $r(this._rootSource), this._emit("source", { source: this._rootSource, request: null, isRoot: !0 });
      for (const e of this._formats)
        if (await e._canReadInput(this))
          return this._format = e, this._onFormatDetermined?.(e), e._createDemuxer(this);
      throw new ca();
    })();
  }
  /**
   * Returns the source from which this input file reads data for the root path.
   */
  get source() {
    return this._rootSource;
  }
  /**
   * Returns the format of the input file. You can compare this result directly to the {@link InputFormat} singletons
   * or use `instanceof` checks for subset-aware logic (for example, `format instanceof MatroskaInputFormat` is true
   * for both MKV and WebM).
   */
  async getFormat() {
    return await this._getDemuxer(), g(this._format), this._format;
  }
  /** Returns `true` if the format of the input file is known and the file can be read, `false` otherwise. */
  async canRead() {
    try {
      return await this._getDemuxer(), !0;
    } catch (e) {
      if (e instanceof ca)
        return !1;
      throw e;
    }
  }
  /**
   * Returns the timestamp at which the input file starts. More precisely, returns the smallest starting timestamp
   * among all tracks.
   *
   * Optionally, you can pass in the list of tracks for which you want to compute the starting timestamp.
   *
   * Note that this method is potentially expensive for inputs with many tracks (such as HLS manifests), since it
   * probes every track.
   */
  async getFirstTimestamp(e) {
    e ??= await this.getTracks();
    const t = e.filter((s) => s !== null);
    if (t.length === 0)
      return 0;
    const i = await Promise.all(t.map((s) => s._backing.getFirstPacket({ metadataOnly: !0 }))), n = Math.min(...i.map((s) => s?.timestamp ?? 1 / 0));
    return n === 1 / 0 ? 0 : n;
  }
  /**
   * Computes the duration of the input file, in seconds. More precisely, returns the largest end timestamp among
   * all tracks.
   *
   * Optionally, you can pass in the list of tracks for which you want to compute the duration.
   *
   * This method can be potentially expensive depending on the underlying file format, because it returns the most
   * accurate duration possible and must check all tracks. Use {@link Input.getDurationFromMetadata} for a faster but
   * less accurate estimate of duration.
   *
   * By default, when any track in the underlying media is live, this method will only resolve once the live stream
   * ends. If you want to query the current duration of the media, set {@link PacketRetrievalOptions.skipLiveWait}
   * to `true` in the options.
   */
  async computeDuration(e, t) {
    e ??= await this.getTracks();
    const i = e.filter((s) => s !== null);
    if (i.length === 0)
      return 0;
    const n = await Promise.all(i.map((s) => s.computeDuration(t)));
    return Math.max(...n);
  }
  /**
   * Gets the duration (end timestamp) in seconds of the input file from metadata stored in the file. This value may
   * be approximate or diverge from the actual, precise duration returned by `.computeDuration()`, but compared to
   * that method, this method is cheaper. When the duration cannot be determined from the file metadata, `null`
   * is returned.
   *
   * Optionally, you can pass in the list of tracks for which you want to get the duration from metadata.
   *
   * By default, when the underlying media is live, this method will only resolve once the live stream
   * ends. If you want to query the current duration of the media, set
   * {@link DurationMetadataRequestOptions.skipLiveWait} to `true` in the options.
   */
  async getDurationFromMetadata(e, t) {
    e ??= await this.getTracks();
    const i = e.filter((a) => a !== null), s = (await Promise.all(i.map((a) => a.getDurationFromMetadata(t)))).filter((a) => a !== null);
    return s.length === 0 ? null : Math.max(...s);
  }
  /**
   * Returns the list of all tracks of this input file in the order in which they appear in the file. An optional
   * query can be provided.
   */
  async getTracks(e) {
    e &&= dr(e);
    const i = (await this._getTrackBackings()).map((n) => this._wrapBackingAsTrack(n));
    return Gi(i, e);
  }
  /** Returns the list of all video tracks of this input file. An optional query can be provided. */
  async getVideoTracks(e) {
    e &&= dr(e);
    const i = (await this.getTracks()).filter((n) => n.isVideoTrack());
    return Gi(i, e);
  }
  /** Returns the list of all audio tracks of this input file. An optional query can be provided. */
  async getAudioTracks(e) {
    e &&= dr(e);
    const i = (await this.getTracks()).filter((n) => n.isAudioTrack());
    return Gi(i, e);
  }
  /**
   * Returns the primary video track of this input file, or null if there are no video tracks.
   *
   * Multiple factors determine which track is considered primary, including its position in the file, disposition,
   * bitrate (higher bitrate is preferred), and if it can be paired with an audio track.
   */
  async getPrimaryVideoTrack(e) {
    e &&= dr(e);
    const t = St(e, {
      sortBy: async (n) => [
        ur((await n.getDisposition()).default),
        ur(await n.hasPairableAudioTrack()),
        ur(!await n.hasOnlyKeyPackets()),
        aa(await n.getBitrate())
      ]
    });
    return (await this.getVideoTracks(t))[0] ?? null;
  }
  /**
   * Returns the primary audio track of this input file, or null if there are no audio tracks.
   *
   * Multiple factors determine which track is considered primary, including its position in the file, disposition,
   * bitrate (higher bitrate is preferred), and if it can be paired with the primary video track.
   */
  async getPrimaryAudioTrack(e) {
    e &&= dr(e);
    const t = await this.getPrimaryVideoTrack(), i = St(e, {
      sortBy: async (s) => [
        ur(!t || s.canBePairedWith(t)),
        ur((await s.getDisposition()).default),
        aa(await s.getBitrate())
      ]
    });
    return (await this.getAudioTracks(i))[0] ?? null;
  }
  /** @internal */
  async _getTrackBackings() {
    const e = await this._getDemuxer();
    return this._trackBackingsCache ??= await e.getTrackBackings();
  }
  /** @internal */
  _wrapBackingAsTrack(e) {
    const t = this._backingToTrack.get(e);
    if (t)
      return t;
    const n = e.getType() === "video" ? new Yn(this, e) : new Zn(this, e);
    return this._backingToTrack.set(e, n), n;
  }
  /** Returns the full MIME type of this input file, including track codecs. */
  async getMimeType() {
    return (await this._getDemuxer()).getMimeType();
  }
  /**
   * Returns descriptive metadata tags about the media file, such as title, author, date, cover art, or other
   * attached files.
   */
  async getMetadataTags() {
    return (await this._getDemuxer()).getMetadataTags();
  }
  /**
   * Disposes this input and frees connected resources. When an input is disposed, ongoing read operations will be
   * canceled, all future read operations will fail, any open decoders will be closed, and all ongoing media sink
   * operations will be canceled. Disallowed and canceled operations will throw an {@link InputDisposedError}.
   *
   * You are expected not to use an input after disposing it. While some operations may still work, it is not
   * specified and may change in any future update.
   */
  dispose() {
    if (!this._disposed) {
      this._disposed = !0;
      for (const e of this._sourceRefs)
        e.free();
      this._sourceRefs.length = 0, this._demuxerPromise && this._demuxerPromise.then((e) => e.dispose()).catch(() => {
      });
    }
  }
  /**
   * Calls `.dispose()` on the input, implementing the `Disposable` interface for use with
   * JavaScript Explicit Resource Management features.
   */
  [Symbol.dispose]() {
    this.dispose();
  }
}
class ca extends Error {
  /** Creates a new {@link UnsupportedInputFormatError}. */
  constructor(e = "Input has an unsupported or unrecognizable format.") {
    super(e), this.name = "UnsupportedInputFormatError";
  }
}
class pe extends Error {
  /** Creates a new {@link InputDisposedError}. */
  constructor(e = "Input has been disposed.") {
    super(e), this.name = "InputDisposedError";
  }
}
class $r {
  constructor(e) {
    this.source = e;
  }
  get fileSize() {
    const e = this.source._getFileSize();
    if (e === void 0)
      throw new Error("Reading file size too early; read required first.");
    return e;
  }
  get fileSizeNonStrict() {
    return this.source._getFileSize() ?? null;
  }
  requestSlice(e, t) {
    if (this.source._disposed)
      throw new pe();
    if (e < 0 || this.fileSizeNonStrict !== null && e + t > this.fileSizeNonStrict)
      return null;
    if (t === 0) {
      const s = new Uint8Array(0);
      return new Pe(s, K(s), 0, e, e);
    }
    const i = e + t, n = this.source._read(e, i, ko, To);
    return n instanceof Promise ? n.then((s) => s ? new Pe(s.bytes, s.view, s.offset, e, i) : null) : n ? new Pe(n.bytes, n.view, n.offset, e, i) : null;
  }
  requestSliceRange(e, t, i) {
    if (this.source._disposed)
      throw new pe();
    if (e < 0)
      return null;
    if (this.fileSizeNonStrict !== null)
      return this.requestSlice(e, ae(this.fileSizeNonStrict - e, t, i));
    {
      const n = this.requestSlice(e, i), s = (a) => a || (g(this.fileSizeNonStrict !== null), this.requestSlice(e, ae(this.fileSizeNonStrict - e, t, i)));
      return n instanceof Promise ? n.then(s) : s(n);
    }
  }
  requestEntireFile() {
    if (this.fileSizeNonStrict !== null)
      return this.requestSlice(0, this.fileSizeNonStrict);
    const e = 1024;
    return (async () => {
      const t = [];
      let i = 0;
      for (; ; ) {
        if (t.length === 1 && this.fileSizeNonStrict !== null)
          return this.requestSlice(0, this.fileSizeNonStrict);
        let a = this.requestSliceRange(i, 0, e);
        if (a instanceof Promise && (a = await a), !a || a.length === 0)
          break;
        const o = V(a, a.length);
        t.push(o), i += a.length;
      }
      const n = new Uint8Array(i);
      let s = 0;
      for (const a of t)
        n.set(a, s), s += a.length;
      return new Pe(n, K(n), 0, 0, i);
    })();
  }
}
class Pe {
  constructor(e, t, i, n, s) {
    this.bytes = e, this.view = t, this.offset = i, this.start = n, this.end = s, this.bufferPos = n - i;
  }
  static tempFromBytes(e) {
    return new Pe(e, K(e), 0, 0, e.length);
  }
  get length() {
    return this.end - this.start;
  }
  get filePos() {
    return this.offset + this.bufferPos;
  }
  set filePos(e) {
    this.bufferPos = e - this.offset;
  }
  /** The number of bytes left from the current pos to the end of the slice. */
  get remainingLength() {
    return Math.max(this.end - this.filePos, 0);
  }
  skip(e) {
    this.bufferPos += e;
  }
  /** Creates a new subslice of this slice whose byte range must be contained within this slice. */
  slice(e, t = this.end - e) {
    if (e < this.start || e + t > this.end)
      throw new RangeError("Slicing outside of original slice.");
    return new Pe(this.bytes, this.view, this.offset, e, e + t);
  }
}
const Se = (r, e) => {
  if (r.filePos < r.start || r.filePos + e > r.end)
    throw new RangeError(`Tried reading [${r.filePos}, ${r.filePos + e}), but slice is [${r.start}, ${r.end}). This is likely an internal error, please report it alongside the file that caused it.`);
}, V = (r, e) => {
  Se(r, e);
  const t = r.bytes.subarray(r.bufferPos, r.bufferPos + e);
  return r.bufferPos += e, t;
}, N = (r) => (Se(r, 1), r.view.getUint8(r.bufferPos++)), fr = (r, e) => {
  Se(r, 2);
  const t = r.view.getUint16(r.bufferPos, e);
  return r.bufferPos += 2, t;
}, se = (r) => {
  Se(r, 2);
  const e = r.view.getUint16(r.bufferPos, !1);
  return r.bufferPos += 2, e;
}, Ze = (r) => {
  Se(r, 3);
  const e = pi(r.view, r.bufferPos, !1);
  return r.bufferPos += 3, e;
}, En = (r) => {
  Se(r, 2);
  const e = r.view.getInt16(r.bufferPos, !1);
  return r.bufferPos += 2, e;
}, gt = (r, e) => {
  Se(r, 4);
  const t = r.view.getUint32(r.bufferPos, e);
  return r.bufferPos += 4, t;
}, R = (r) => {
  Se(r, 4);
  const e = r.view.getUint32(r.bufferPos, !1);
  return r.bufferPos += 4, e;
}, Ht = (r) => {
  Se(r, 4);
  const e = r.view.getUint32(r.bufferPos, !0);
  return r.bufferPos += 4, e;
}, Ct = (r) => {
  Se(r, 4);
  const e = r.view.getInt32(r.bufferPos, !1);
  return r.bufferPos += 4, e;
}, gd = (r) => {
  Se(r, 4);
  const e = r.view.getInt32(r.bufferPos, !0);
  return r.bufferPos += 4, e;
}, la = (r, e) => {
  let t, i;
  return e ? (t = gt(r, !0), i = gt(r, !0)) : (i = gt(r, !1), t = gt(r, !1)), i * 4294967296 + t;
}, ve = (r) => {
  const e = R(r), t = R(r);
  return e * 4294967296 + t;
}, yd = (r) => {
  const e = Ct(r), t = R(r);
  return e * 4294967296 + t;
}, wd = (r) => {
  const e = Ht(r);
  return gd(r) * 4294967296 + e;
}, bd = (r) => {
  Se(r, 4);
  const e = r.view.getFloat32(r.bufferPos, !1);
  return r.bufferPos += 4, e;
}, No = (r) => {
  Se(r, 8);
  const e = r.view.getFloat64(r.bufferPos, !1);
  return r.bufferPos += 8, e;
}, ie = (r, e) => {
  Se(r, e);
  let t = "";
  for (let i = 0; i < e; i++)
    t += String.fromCharCode(r.bytes[r.bufferPos++]);
  return t;
}, Vo = (r, e, t) => Ae.decode(V(r, e)).split(`
`).map((s) => s.trim()).filter((s) => s.length > 0 && !t?.ignore?.(s));
var Et;
(function(r) {
  r[r.Unsynchronisation = 128] = "Unsynchronisation", r[r.ExtendedHeader = 64] = "ExtendedHeader", r[r.ExperimentalIndicator = 32] = "ExperimentalIndicator", r[r.Footer = 16] = "Footer";
})(Et || (Et = {}));
var jt;
(function(r) {
  r[r.ISO_8859_1 = 0] = "ISO_8859_1", r[r.UTF_16_WITH_BOM = 1] = "UTF_16_WITH_BOM", r[r.UTF_16_BE_NO_BOM = 2] = "UTF_16_BE_NO_BOM", r[r.UTF_8 = 3] = "UTF_8";
})(jt || (jt = {}));
const Yr = 128, Fe = 10, Kt = [
  "Blues",
  "Classic rock",
  "Country",
  "Dance",
  "Disco",
  "Funk",
  "Grunge",
  "Hip-hop",
  "Jazz",
  "Metal",
  "New age",
  "Oldies",
  "Other",
  "Pop",
  "Rhythm and blues",
  "Rap",
  "Reggae",
  "Rock",
  "Techno",
  "Industrial",
  "Alternative",
  "Ska",
  "Death metal",
  "Pranks",
  "Soundtrack",
  "Euro-techno",
  "Ambient",
  "Trip-hop",
  "Vocal",
  "Jazz & funk",
  "Fusion",
  "Trance",
  "Classical",
  "Instrumental",
  "Acid",
  "House",
  "Game",
  "Sound clip",
  "Gospel",
  "Noise",
  "Alternative rock",
  "Bass",
  "Soul",
  "Punk",
  "Space",
  "Meditative",
  "Instrumental pop",
  "Instrumental rock",
  "Ethnic",
  "Gothic",
  "Darkwave",
  "Techno-industrial",
  "Electronic",
  "Pop-folk",
  "Eurodance",
  "Dream",
  "Southern rock",
  "Comedy",
  "Cult",
  "Gangsta",
  "Top 40",
  "Christian rap",
  "Pop/funk",
  "Jungle music",
  "Native US",
  "Cabaret",
  "New wave",
  "Psychedelic",
  "Rave",
  "Showtunes",
  "Trailer",
  "Lo-fi",
  "Tribal",
  "Acid punk",
  "Acid jazz",
  "Polka",
  "Retro",
  "Musical",
  "Rock 'n' roll",
  "Hard rock",
  "Folk",
  "Folk rock",
  "National folk",
  "Swing",
  "Fast fusion",
  "Bebop",
  "Latin",
  "Revival",
  "Celtic",
  "Bluegrass",
  "Avantgarde",
  "Gothic rock",
  "Progressive rock",
  "Psychedelic rock",
  "Symphonic rock",
  "Slow rock",
  "Big band",
  "Chorus",
  "Easy listening",
  "Acoustic",
  "Humour",
  "Speech",
  "Chanson",
  "Opera",
  "Chamber music",
  "Sonata",
  "Symphony",
  "Booty bass",
  "Primus",
  "Porn groove",
  "Satire",
  "Slow jam",
  "Club",
  "Tango",
  "Samba",
  "Folklore",
  "Ballad",
  "Power ballad",
  "Rhythmic Soul",
  "Freestyle",
  "Duet",
  "Punk rock",
  "Drum solo",
  "A cappella",
  "Euro-house",
  "Dance hall",
  "Goa music",
  "Drum & bass",
  "Club-house",
  "Hardcore techno",
  "Terror",
  "Indie",
  "Britpop",
  "Negerpunk",
  "Polsk punk",
  "Beat",
  "Christian gangsta rap",
  "Heavy metal",
  "Black metal",
  "Crossover",
  "Contemporary Christian",
  "Christian rock",
  "Merengue",
  "Salsa",
  "Thrash metal",
  "Anime",
  "Jpop",
  "Synthpop",
  "Christmas",
  "Art rock",
  "Baroque",
  "Bhangra",
  "Big beat",
  "Breakbeat",
  "Chillout",
  "Downtempo",
  "Dub",
  "EBM",
  "Eclectic",
  "Electro",
  "Electroclash",
  "Emo",
  "Experimental",
  "Garage",
  "Global",
  "IDM",
  "Illbient",
  "Industro-Goth",
  "Jam Band",
  "Krautrock",
  "Leftfield",
  "Lounge",
  "Math rock",
  "New romantic",
  "Nu-breakz",
  "Post-punk",
  "Post-rock",
  "Psytrance",
  "Shoegaze",
  "Space rock",
  "Trop rock",
  "World music",
  "Neoclassical",
  "Audiobook",
  "Audio theatre",
  "Neue Deutsche Welle",
  "Podcast",
  "Indie rock",
  "G-Funk",
  "Dubstep",
  "Garage rock",
  "Psybient"
], kd = (r, e) => {
  const t = r.filePos;
  e.raw ??= {}, e.raw.TAG ??= V(r, Yr - 3), r.filePos = t;
  const i = Ot(r, 30);
  i && (e.title ??= i);
  const n = Ot(r, 30);
  n && (e.artist ??= n);
  const s = Ot(r, 30);
  s && (e.album ??= s);
  const a = Ot(r, 4), o = Number.parseInt(a, 10);
  Number.isInteger(o) && o > 0 && (e.date ??= new Date(String(o)));
  const c = V(r, 30);
  let l;
  if (c[28] === 0 && c[29] !== 0) {
    const d = c[29];
    d > 0 && (e.trackNumber ??= d), r.skip(-30), l = Ot(r, 28), r.skip(2);
  } else
    r.skip(-30), l = Ot(r, 30);
  l && (e.comment ??= l);
  const u = N(r);
  u < Kt.length && (e.genre ??= Kt[u]);
}, Ot = (r, e) => {
  const t = V(r, e), i = Dt(t.indexOf(0), t.length), n = t.subarray(0, i);
  let s = "";
  for (let a = 0; a < n.length; a++)
    s += String.fromCharCode(n[a]);
  return s.trimEnd();
}, ot = (r) => {
  const e = r.filePos, t = ie(r, 3), i = N(r), n = N(r), s = N(r), a = R(r);
  if (t !== "ID3" || i === 255 || n === 255 || (a & 2155905152) !== 0)
    return r.filePos = e, null;
  let o = hn(a);
  return s & Et.Footer && (o += Fe), { majorVersion: i, revision: n, flags: s, size: o };
}, Ei = (r, e, t) => {
  if (![2, 3, 4].includes(e.majorVersion)) {
    q._warn(`Unsupported ID3v2 major version: ${e.majorVersion}`);
    return;
  }
  const i = e.flags & Et.Footer ? e.size - Fe : e.size, n = V(r, i), s = new Td(e, n);
  if (e.flags & Et.Unsynchronisation && e.majorVersion === 3 && s.ununsynchronizeAll(), e.flags & Et.ExtendedHeader) {
    const a = s.readU32();
    e.majorVersion === 3 ? s.pos += a : s.pos += a - 4;
  }
  for (; s.pos <= s.bytes.length - s.frameHeaderSize(); ) {
    const a = s.readId3V2Frame();
    if (!a)
      break;
    const o = s.pos, c = s.pos + a.size;
    let l = !1, u = !1, d = !1;
    if (e.majorVersion === 3 ? (l = !!(a.flags & 64), u = !!(a.flags & 128)) : e.majorVersion === 4 && (l = !!(a.flags & 4), u = !!(a.flags & 8), d = !!(a.flags & 2) || !!(e.flags & Et.Unsynchronisation)), l) {
      q._warn(`Skipping encrypted ID3v2 frame ${a.id}`), s.pos = c;
      continue;
    }
    if (u) {
      q._warn(`Skipping compressed ID3v2 frame ${a.id}`), s.pos = c;
      continue;
    }
    if (d && s.ununsynchronizeRegion(s.pos, c), t.raw ??= {}, a.id === "TXXX") {
      const f = t.raw.TXXX ??= {}, h = s.readId3V2TextEncoding(), p = s.readId3V2Text(h, c), m = s.readId3V2Text(h, c);
      f[p] ??= m;
    } else a.id[0] === "T" ? t.raw[a.id] ??= s.readId3V2EncodingAndText(c) : t.raw[a.id] ??= s.readBytes(a.size);
    switch (s.pos = o, a.id) {
      case "TIT2":
      case "TT2":
        t.title ??= s.readId3V2EncodingAndText(c);
        break;
      case "TIT3":
      case "TT3":
        t.description ??= s.readId3V2EncodingAndText(c);
        break;
      case "TPE1":
      case "TP1":
        t.artist ??= s.readId3V2EncodingAndText(c);
        break;
      case "TALB":
      case "TAL":
        t.album ??= s.readId3V2EncodingAndText(c);
        break;
      case "TPE2":
      case "TP2":
        t.albumArtist ??= s.readId3V2EncodingAndText(c);
        break;
      case "TRCK":
      case "TRK":
        {
          const h = s.readId3V2EncodingAndText(c).split("/"), p = Number.parseInt(h[0], 10), m = h[1] && Number.parseInt(h[1], 10);
          Number.isInteger(p) && p > 0 && (t.trackNumber ??= p), m && Number.isInteger(m) && m > 0 && (t.tracksTotal ??= m);
        }
        break;
      case "TPOS":
      case "TPA":
        {
          const h = s.readId3V2EncodingAndText(c).split("/"), p = Number.parseInt(h[0], 10), m = h[1] && Number.parseInt(h[1], 10);
          Number.isInteger(p) && p > 0 && (t.discNumber ??= p), m && Number.isInteger(m) && m > 0 && (t.discsTotal ??= m);
        }
        break;
      case "TCON":
      case "TCO":
        {
          const f = s.readId3V2EncodingAndText(c);
          let h = /^\((\d+)\)/.exec(f);
          if (h) {
            const p = Number.parseInt(h[1]);
            if (Kt[p] !== void 0) {
              t.genre ??= Kt[p];
              break;
            }
          }
          if (h = /^\d+$/.exec(f), h) {
            const p = Number.parseInt(h[0]);
            if (Kt[p] !== void 0) {
              t.genre ??= Kt[p];
              break;
            }
          }
          t.genre ??= f;
        }
        break;
      case "TDRC":
      case "TDAT":
        {
          const f = s.readId3V2EncodingAndText(c), h = new Date(f);
          Number.isNaN(h.getTime()) || (t.date ??= h);
        }
        break;
      case "TYER":
      case "TYE":
        {
          const f = s.readId3V2EncodingAndText(c), h = Number.parseInt(f, 10);
          Number.isInteger(h) && (t.date ??= new Date(String(h)));
        }
        break;
      case "USLT":
      case "ULT":
        {
          const f = s.readU8();
          s.pos += 3, s.readId3V2Text(f, c), t.lyrics ??= s.readId3V2Text(f, c);
        }
        break;
      case "COMM":
      case "COM":
        {
          const f = s.readU8();
          s.pos += 3, s.readId3V2Text(f, c), t.comment ??= s.readId3V2Text(f, c);
        }
        break;
      case "APIC":
      case "PIC":
        {
          const f = s.readId3V2TextEncoding();
          let h;
          if (e.majorVersion === 2) {
            const w = s.readAscii(3);
            h = w === "PNG" ? "image/png" : w === "JPG" ? "image/jpeg" : "image/*";
          } else
            h = s.readId3V2Text(f, c);
          const p = s.readU8(), m = s.readId3V2Text(f, c).trimEnd(), y = c - s.pos;
          if (y >= 0) {
            const w = s.readBytes(y);
            t.images || (t.images = []), t.images.push({
              data: w,
              mimeType: h,
              kind: p === 3 ? "coverFront" : p === 4 ? "coverBack" : "unknown",
              description: m
            });
          }
        }
        break;
      default:
        s.pos += a.size;
        break;
    }
    s.pos = c;
  }
};
class Td {
  constructor(e, t) {
    this.header = e, this.bytes = t, this.pos = 0, this.view = new DataView(t.buffer, t.byteOffset, t.byteLength);
  }
  frameHeaderSize() {
    return this.header.majorVersion === 2 ? 6 : 10;
  }
  ununsynchronizeAll() {
    const e = [];
    for (let t = 0; t < this.bytes.length; t++) {
      const i = this.bytes[t];
      e.push(i), i === 255 && t !== this.bytes.length - 1 && this.bytes[t] === 0 && t++;
    }
    this.bytes = new Uint8Array(e), this.view = new DataView(this.bytes.buffer);
  }
  ununsynchronizeRegion(e, t) {
    const i = [];
    for (let a = e; a < t; a++) {
      const o = this.bytes[a];
      i.push(o), o === 255 && a !== t - 1 && this.bytes[a + 1] === 0 && a++;
    }
    const n = this.bytes.subarray(0, e), s = this.bytes.subarray(t);
    this.bytes = new Uint8Array(n.length + i.length + s.length), this.bytes.set(n, 0), this.bytes.set(i, n.length), this.bytes.set(s, n.length + i.length), this.view = new DataView(this.bytes.buffer);
  }
  readBytes(e) {
    const t = this.bytes.subarray(this.pos, this.pos + e);
    return this.pos += e, t;
  }
  readU8() {
    const e = this.view.getUint8(this.pos);
    return this.pos += 1, e;
  }
  readU16() {
    const e = this.view.getUint16(this.pos, !1);
    return this.pos += 2, e;
  }
  readU24() {
    const e = this.view.getUint16(this.pos, !1), t = this.view.getUint8(this.pos + 2);
    return this.pos += 3, e * 256 + t;
  }
  readU32() {
    const e = this.view.getUint32(this.pos, !1);
    return this.pos += 4, e;
  }
  readAscii(e) {
    let t = "";
    for (let i = 0; i < e; i++)
      t += String.fromCharCode(this.view.getUint8(this.pos + i));
    return this.pos += e, t;
  }
  readId3V2Frame() {
    if (this.header.majorVersion === 2) {
      const e = this.readAscii(3);
      if (e === "\0\0\0")
        return null;
      const t = this.readU24();
      return { id: e, size: t, flags: 0 };
    } else {
      const e = this.readAscii(4);
      if (e === "\0\0\0\0")
        return null;
      const t = this.readU32();
      let i = this.header.majorVersion === 4 ? hn(t) : t;
      const n = this.readU16(), s = this.pos, a = (o) => {
        const c = this.pos + o;
        if (c > this.bytes.length)
          return !1;
        if (c <= this.bytes.length - this.frameHeaderSize()) {
          this.pos += o;
          const l = this.readAscii(4);
          if (l !== "\0\0\0\0" && !/[0-9A-Z]{4}/.test(l))
            return !1;
        }
        return !0;
      };
      if (!a(i)) {
        const o = this.header.majorVersion === 4 ? t : hn(t);
        a(o) && (i = o);
      }
      return this.pos = s, { id: e, size: i, flags: n };
    }
  }
  readId3V2TextEncoding() {
    const e = this.readU8();
    if (e > 3)
      throw new Error(`Unsupported text encoding: ${e}`);
    return e;
  }
  readId3V2Text(e, t) {
    const i = this.pos, n = this.readBytes(t - this.pos);
    switch (e) {
      case jt.ISO_8859_1: {
        let s = "";
        for (let a = 0; a < n.length; a++) {
          const o = n[a];
          if (o === 0) {
            this.pos = i + a + 1;
            break;
          }
          s += String.fromCharCode(o);
        }
        return s;
      }
      case jt.UTF_16_WITH_BOM:
        if (n[0] === 255 && n[1] === 254) {
          const s = new TextDecoder("utf-16le"), a = Dt(n.findIndex((o, c) => o === 0 && n[c + 1] === 0 && c % 2 === 0), n.length);
          return this.pos = i + Math.min(a + 2, n.length), s.decode(n.subarray(2, a));
        } else if (n[0] === 254 && n[1] === 255) {
          const s = new TextDecoder("utf-16be"), a = Dt(n.findIndex((o, c) => o === 0 && n[c + 1] === 0 && c % 2 === 0), n.length);
          return this.pos = i + Math.min(a + 2, n.length), s.decode(n.subarray(2, a));
        } else {
          const s = Dt(n.findIndex((a) => a === 0), n.length);
          return this.pos = i + Math.min(s + 1, n.length), Ae.decode(n.subarray(0, s));
        }
      case jt.UTF_16_BE_NO_BOM: {
        const s = new TextDecoder("utf-16be"), a = Dt(n.findIndex((o, c) => o === 0 && n[c + 1] === 0 && c % 2 === 0), n.length);
        return this.pos = i + Math.min(a + 2, n.length), s.decode(n.subarray(0, a));
      }
      case jt.UTF_8: {
        const s = Dt(n.findIndex((a) => a === 0), n.length);
        return this.pos = i + Math.min(s + 1, n.length), Ae.decode(n.subarray(0, s));
      }
    }
  }
  readId3V2EncodingAndText(e) {
    if (this.pos >= e)
      return "";
    const t = this.readId3V2TextEncoding();
    return this.readId3V2Text(t, e);
  }
}
class Ad {
  constructor(e) {
    this.mutex = new nr(), this.trackTimestampInfo = /* @__PURE__ */ new WeakMap(), this.output = e;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onTrackClose(e) {
  }
  validateTimestamp(e, t, i) {
    if (t < 0)
      throw new Error(`Timestamps must be non-negative (got ${t}s).`);
    let n = this.trackTimestampInfo.get(e);
    if (n) {
      if (i && (n.maxTimestampBeforeLastKeyPacket = n.maxTimestamp), n.maxTimestampBeforeLastKeyPacket !== null && t < n.maxTimestampBeforeLastKeyPacket)
        throw new Error(`Timestamps cannot be smaller than the largest timestamp of the previous GOP (a GOP begins with a key packet and ends right before the next key packet). Got ${t}s, but largest timestamp is ${n.maxTimestampBeforeLastKeyPacket}s.`);
      n.maxTimestamp = Math.max(n.maxTimestamp, t);
    } else {
      if (!i)
        throw new Error("First packet must be a key packet.");
      n = {
        maxTimestamp: t,
        maxTimestampBeforeLastKeyPacket: null
      }, this.trackTimestampInfo.set(e, n);
    }
  }
}
const ua = /<(?:(\d{2}):)?(\d{2}):(\d{2}).(\d{3})>/g, Sd = (r) => {
  const e = Math.floor(r / 36e5), t = Math.floor(r % (3600 * 1e3) / (60 * 1e3)), i = Math.floor(r % (60 * 1e3) / 1e3), n = r % 1e3;
  return e.toString().padStart(2, "0") + ":" + t.toString().padStart(2, "0") + ":" + i.toString().padStart(2, "0") + "." + n.toString().padStart(3, "0");
};
class Wr {
  constructor(e) {
    this.writer = e, this.helper = new Uint8Array(8), this.helperView = new DataView(this.helper.buffer), this.offsets = /* @__PURE__ */ new WeakMap();
  }
  writeU32(e) {
    this.helperView.setUint32(0, e, !1), this.writer.write(this.helper.subarray(0, 4));
  }
  writeU64(e) {
    this.helperView.setUint32(0, Math.floor(e / 2 ** 32), !1), this.helperView.setUint32(4, e, !1), this.writer.write(this.helper.subarray(0, 8));
  }
  writeAscii(e) {
    for (let t = 0; t < e.length; t++)
      this.helperView.setUint8(t % 8, e.charCodeAt(t)), t % 8 === 7 && this.writer.write(this.helper);
    e.length % 8 !== 0 && this.writer.write(this.helper.subarray(0, e.length % 8));
  }
  writeBox(e) {
    if (this.offsets.set(e, this.writer.getPos()), e.contents && !e.children)
      this.writeBoxHeader(e, e.size ?? e.contents.byteLength + 8), this.writer.write(e.contents);
    else {
      const t = this.writer.getPos();
      if (this.writeBoxHeader(e, 0), e.contents && this.writer.write(e.contents), e.children)
        for (const s of e.children)
          s && this.writeBox(s);
      const i = this.writer.getPos(), n = e.size ?? i - t;
      this.writer.seek(t), this.writeBoxHeader(e, n), this.writer.seek(i);
    }
  }
  writeBoxHeader(e, t) {
    this.writeU32(e.largeSize ? 1 : t), this.writeAscii(e.type), e.largeSize && this.writeU64(t);
  }
  measureBoxHeader(e) {
    return 8 + (e.largeSize ? 8 : 0);
  }
  patchBox(e) {
    const t = this.offsets.get(e);
    g(t !== void 0);
    const i = this.writer.getPos();
    this.writer.seek(t), this.writeBox(e), this.writer.seek(i);
  }
  measureBox(e) {
    if (e.contents && !e.children)
      return this.measureBoxHeader(e) + e.contents.byteLength;
    {
      let t = this.measureBoxHeader(e);
      if (e.contents && (t += e.contents.byteLength), e.children)
        for (const i of e.children)
          i && (t += this.measureBox(i));
      return t;
    }
  }
}
const L = /* @__PURE__ */ new Uint8Array(8), Me = /* @__PURE__ */ new DataView(L.buffer), re = (r) => [(r % 256 + 256) % 256], W = (r) => (Me.setUint16(0, r, !1), [L[0], L[1]]), Jn = (r) => (Me.setInt16(0, r, !1), [L[0], L[1]]), Uo = (r) => (Me.setUint32(0, r, !1), [L[1], L[2], L[3]]), B = (r) => (Me.setUint32(0, r, !1), [L[0], L[1], L[2], L[3]]), nt = (r) => (Me.setInt32(0, r, !1), [L[0], L[1], L[2], L[3]]), Xe = (r) => (Me.setUint32(0, Math.floor(r / 2 ** 32), !1), Me.setUint32(4, r, !1), [L[0], L[1], L[2], L[3], L[4], L[5], L[6], L[7]]), xd = (r) => (Me.setInt32(0, Math.floor(r / 2 ** 32), !1), Me.setUint32(4, r, !1), [L[0], L[1], L[2], L[3], L[4], L[5], L[6], L[7]]), Wo = (r) => (Me.setInt16(0, 2 ** 8 * r, !1), [L[0], L[1]]), Oe = (r) => (Me.setInt32(0, 2 ** 16 * r, !1), [L[0], L[1], L[2], L[3]]), Xi = (r) => (Me.setInt32(0, 2 ** 30 * r, !1), [L[0], L[1], L[2], L[3]]), $i = (r, e) => {
  const t = [];
  let i = r;
  do {
    let n = i & 127;
    i >>= 7, t.length > 0 && (n |= 128), t.push(n);
  } while (i > 0 || e);
  return t.reverse();
}, $ = (r, e = !1) => {
  const t = Array(r.length).fill(null).map((i, n) => r.charCodeAt(n));
  return e && t.push(0), t;
}, qo = (r) => {
  const e = r * (Math.PI / 180), t = Math.round(Math.cos(e)), i = Math.round(Math.sin(e));
  return [
    t,
    i,
    0,
    -i,
    t,
    0,
    0,
    0,
    1
  ];
}, Lo = /* @__PURE__ */ qo(0), Ho = (r) => [
  Oe(r[0]),
  Oe(r[1]),
  Xi(r[2]),
  Oe(r[3]),
  Oe(r[4]),
  Xi(r[5]),
  Oe(r[6]),
  Oe(r[7]),
  Xi(r[8])
], U = (r, e, t) => ({
  type: r,
  contents: e && new Uint8Array(e.flat(10)),
  children: t
}), X = (r, e, t, i, n) => U(r, [re(e), Uo(t), i ?? []], n), Pd = (r) => r.isQuickTime ? U("ftyp", [
  $("qt  "),
  // Major brand
  B(512),
  // Minor version
  // Compatible brands
  $("qt  ")
]) : r.fragmented ? r.cmaf ? U("ftyp", [
  $("iso5"),
  // Major brand
  B(512),
  // Minor version
  // Compatible brands
  $("iso5"),
  $("iso6"),
  $("mp41"),
  $("cmfc"),
  $("dash")
]) : U("ftyp", [
  $("iso5"),
  // Major brand
  B(512),
  // Minor version
  // Compatible brands
  $("iso5"),
  $("iso6"),
  $("mp41")
]) : U("ftyp", [
  $("isom"),
  // Major brand
  B(512),
  // Minor version
  // Compatible brands
  $("isom"),
  r.holdsAvc ? $("avc1") : [],
  $("mp41")
]), da = () => U("styp", [
  $("iso5"),
  // Major brand
  B(0),
  // Minor version
  // Compatible brands
  $("iso5"),
  $("iso6"),
  $("mp41"),
  $("cmfc"),
  $("dash")
]), fa = (r, e) => {
  let t = r.maxWrittenEndTimestamp - r.minWrittenTimestamp;
  return Number.isFinite(t) || (t = 0), X("sidx", 1, 0, [
    B(1),
    // Reference ID
    B(De),
    // Timescale
    Xe(ee(r.minWrittenTimestamp, De)),
    // Earliest presentation time
    Xe(0),
    // First offset
    W(0),
    // Reserved
    W(1),
    // Reference count
    B(e & 2147483647),
    // Reference type (0) + referenced size
    B(ee(t, De)),
    // Subsegment duration
    B(0)
    // Starts with SAP + SAP type + SAP delta time (no information provided)
  ]);
}, qr = (r) => ({ type: "mdat", largeSize: r }), Cd = (r) => ({ type: "free", size: r }), hr = (r) => U("moov", void 0, [
  Ed(r.creationTime, r.trackDatas),
  ...r.trackDatas.map((e) => Id(e, r.creationTime)),
  r.isFragmented ? pf(r.trackDatas) : null,
  If(r)
]), Ed = (r, e) => {
  const t = Math.max(0, ...e.map((a) => ee(Ii(a), De) + ee(a.startTimestampOffset ?? 0, De))), i = Math.max(0, ...e.map((a) => a.track.id)) + 1, n = !yt(r) || !yt(t), s = n ? Xe : B;
  return X("mvhd", +n, 0, [
    s(r),
    // Creation time
    s(r),
    // Modification time
    B(De),
    // Timescale
    s(t),
    // Duration
    Oe(1),
    // Preferred rate
    Wo(1),
    // Preferred volume
    Array(10).fill(0),
    // Reserved
    Ho(Lo),
    // Matrix
    Array(24).fill(0),
    // Pre-defined
    B(i)
    // Next track ID
  ]);
}, Ii = (r) => {
  if (r.samples.length === 0)
    return 0;
  let e = 1 / 0, t = -1 / 0;
  for (let i = 0; i < r.samples.length; i++) {
    const n = r.samples[i];
    n.timestamp < e && (e = n.timestamp), n.timestamp + n.duration > t && (t = n.timestamp + n.duration);
  }
  return e === 1 / 0 ? 0 : t - e;
}, Id = (r, e) => {
  const t = Uf(r), i = r.startTimestampOffset !== null && r.startTimestampOffset > 0;
  return U("trak", void 0, [
    _d(r, e),
    i ? vd(r, r.startTimestampOffset) : null,
    Bd(r, e),
    t.name !== void 0 ? U("udta", void 0, [
      U("name", [
        ...Ke.encode(t.name)
      ])
    ]) : null
  ]);
}, _d = (r, e) => {
  const t = ee(Ii(r), De) + ee(r.startTimestampOffset ?? 0, De), i = !yt(e) || !yt(t), n = i ? Xe : B;
  let s;
  if (r.type === "video") {
    const c = r.track.metadata.rotation;
    s = qo(c ?? 0);
  } else
    s = Lo;
  let a = 2;
  r.track.metadata.disposition?.default !== !1 && (a |= 1);
  const o = r.type === "video" ? 0 : r.type === "audio" ? 1 : r.type === "subtitle" ? 2 : Re(r);
  return X("tkhd", +i, a, [
    n(e),
    // Creation time
    n(e),
    // Modification time
    B(r.track.id),
    // Track ID
    B(0),
    // Reserved
    n(t),
    // Duration
    Array(8).fill(0),
    // Reserved
    W(0),
    // Layer
    W(o),
    // Alternate group
    Wo(r.type === "audio" ? 1 : 0),
    // Volume
    W(0),
    // Reserved
    Ho(s),
    // Matrix
    Oe(r.type === "video" ? r.info.width : 0),
    // Track width
    Oe(r.type === "video" ? r.info.height : 0)
    // Track height
  ]);
}, vd = (r, e) => {
  const t = ee(e, De), i = ee(Ii(r), De), n = !yt(t) || !yt(i), s = n ? Xe : B, a = n ? xd : nt;
  return U("edts", void 0, [
    X("elst", n ? 1 : 0, 0, [
      B(2),
      // Entry count
      // #1
      s(t),
      // Segment duration
      a(-1),
      // Media time
      Oe(1),
      // Media rate
      // #2
      s(i),
      // Segment duration
      a(0),
      // Media time
      Oe(1)
      // Media rate
    ])
  ]);
}, Bd = (r, e) => U("mdia", void 0, [
  Rd(r, e),
  es(!0, Fd[r.type], Md[r.type]),
  zd(r)
]), Rd = (r, e) => {
  const t = ee(Ii(r), r.timescale), i = !yt(e) || !yt(t), n = i ? Xe : B;
  return X("mdhd", +i, 0, [
    n(e),
    // Creation time
    n(e),
    // Modification time
    B(r.timescale),
    // Timescale
    n(t),
    // Duration
    W(Go(r.track.metadata.languageCode ?? ge)),
    // Language
    W(0)
    // Quality
  ]);
}, Fd = {
  video: "vide",
  audio: "soun",
  subtitle: "text"
}, Md = {
  video: "MediabunnyVideoHandler",
  audio: "MediabunnySoundHandler",
  subtitle: "MediabunnyTextHandler"
}, es = (r, e, t, i = "\0\0\0\0") => X("hdlr", 0, 0, [
  r ? $("mhlr") : B(0),
  // Component type
  $(e),
  // Component subtype
  $(i),
  // Component manufacturer
  B(0),
  // Component flags
  B(0),
  // Component flags mask
  $(t, !0)
  // Component name
]), zd = (r) => U("minf", void 0, [
  Vd[r.type](),
  Ud(),
  Ld(r)
]), Od = () => X("vmhd", 0, 1, [
  W(0),
  // Graphics mode
  W(0),
  // Opcolor R
  W(0),
  // Opcolor G
  W(0)
  // Opcolor B
]), Dd = () => X("smhd", 0, 0, [
  W(0),
  // Balance
  W(0)
  // Reserved
]), Nd = () => X("nmhd", 0, 0), Vd = {
  video: Od,
  audio: Dd,
  subtitle: Nd
}, Ud = () => U("dinf", void 0, [
  Wd()
]), Wd = () => X("dref", 0, 0, [
  B(1)
  // Entry count
], [
  qd()
]), qd = () => X("url ", 0, 1), Ld = (r) => {
  const e = r.compositionTimeOffsetTable.length > 1 || r.compositionTimeOffsetTable.some((t) => t.sampleCompositionTimeOffset !== 0);
  return U("stbl", void 0, [
    Hd(r),
    cf(r),
    e ? hf(r) : null,
    e ? mf(r) : null,
    uf(r),
    df(r),
    ff(r),
    lf(r)
  ]);
}, Hd = (r) => {
  let e;
  if (r.type === "video")
    e = jd(Rf(r.track.source._codec, r.info.decoderConfig.codec), r);
  else if (r.type === "audio") {
    const t = Qo(r.track.source._codec, r.info.decoderConfig.codec, r.muxer.isQuickTime);
    g(t), e = Yd(t, r);
  } else r.type === "subtitle" && (e = af(zf[r.track.source._codec], r));
  return g(e), X("stsd", 0, 0, [
    B(1)
    // Entry count
  ], [
    e
  ]);
}, jd = (r, e) => U(r, [
  Array(6).fill(0),
  // Reserved
  W(1),
  // Data reference index
  W(0),
  // Pre-defined
  W(0),
  // Reserved
  Array(12).fill(0),
  // Pre-defined
  W(e.info.width),
  // Width
  W(e.info.height),
  // Height
  B(4718592),
  // Horizontal resolution
  B(4718592),
  // Vertical resolution
  B(0),
  // Reserved
  W(1),
  // Frame count
  // Compressor name
  re(10),
  // Weird Pascal-style string
  $("Mediabunny"),
  Array(21).fill(0),
  W(e.info.hasAlphaChannel ? 32 : 24),
  // Depth
  Jn(65535)
  // Pre-defined
], [
  Ff[e.track.source._codec]?.(e) ?? null,
  Kd(e),
  Zo(e.info.decoderConfig.colorSpace) ? Qd(e) : null
]), Kd = (r) => r.info.pixelAspectRatio.num === r.info.pixelAspectRatio.den ? null : U("pasp", [
  B(r.info.pixelAspectRatio.num),
  B(r.info.pixelAspectRatio.den)
]), Qd = (r) => U("colr", [
  $(r.muxer.isQuickTime ? "nclc" : "nclx"),
  // Colour type
  W(tr[r.info.decoderConfig.colorSpace.primaries]),
  // Colour primaries
  W(rr[r.info.decoderConfig.colorSpace.transfer]),
  // Transfer characteristics
  W(ir[r.info.decoderConfig.colorSpace.matrix]),
  // Matrix coefficients
  r.muxer.isQuickTime ? [] : re((r.info.decoderConfig.colorSpace.fullRange ? 1 : 0) << 7)
  // Full range flag
]), Gd = (r) => r.info.decoderConfig && U("avcC", [
  // For AVC, description is an AVCDecoderConfigurationRecord, so nothing else to do here
  ...be(r.info.decoderConfig.description)
]), Xd = (r) => r.info.decoderConfig && U("hvcC", [
  // For HEVC, description is an HEVCDecoderConfigurationRecord, so nothing else to do here
  ...be(r.info.decoderConfig.description)
]), ha = (r) => {
  if (!r.info.decoderConfig)
    return null;
  const e = r.info.decoderConfig, t = e.codec.split("."), i = Number(t[1]), n = Number(t[2]), s = Number(t[3]), a = t[4] ? Number(t[4]) : 1, o = t[8] ? Number(t[8]) : Number(e.colorSpace?.fullRange ?? 0), c = (s << 4) + (a << 1) + o, l = t[5] ? Number(t[5]) : e.colorSpace?.primaries ? tr[e.colorSpace.primaries] : 2, u = t[6] ? Number(t[6]) : e.colorSpace?.transfer ? rr[e.colorSpace.transfer] : 2, d = t[7] ? Number(t[7]) : e.colorSpace?.matrix ? ir[e.colorSpace.matrix] : 2;
  return X("vpcC", 1, 0, [
    re(i),
    // Profile
    re(n),
    // Level
    re(c),
    // Bit depth, chroma subsampling, full range
    re(l),
    // Colour primaries
    re(u),
    // Transfer characteristics
    re(d),
    // Matrix coefficients
    W(0)
    // Codec initialization data size
  ]);
}, $d = (r) => U("av1C", pc(r.info.decoderConfig.codec)), Yd = (r, e) => {
  let t = 0, i, n = 16;
  const s = ye.includes(e.track.source._codec);
  if (s) {
    const a = e.track.source._codec, { sampleSize: o } = at(a);
    n = 8 * o, n > 16 && (t = 1);
  }
  if (e.muxer.isQuickTime && (t = 1), t === 0)
    i = [
      Array(6).fill(0),
      // Reserved
      W(1),
      // Data reference index
      W(t),
      // Version
      W(0),
      // Revision level
      B(0),
      // Vendor
      W(e.info.numberOfChannels),
      // Number of channels
      W(n),
      // Sample size (bits)
      W(0),
      // Compression ID
      W(0),
      // Packet size
      W(e.info.sampleRate < 2 ** 16 ? e.info.sampleRate : 0),
      // Sample rate (upper)
      W(0)
      // Sample rate (lower)
    ];
  else {
    const a = s ? 0 : -2;
    i = [
      Array(6).fill(0),
      // Reserved
      W(1),
      // Data reference index
      W(t),
      // Version
      W(0),
      // Revision level
      B(0),
      // Vendor
      W(e.info.numberOfChannels),
      // Number of channels
      W(Math.min(n, 16)),
      // Sample size (bits)
      Jn(a),
      // Compression ID
      W(0),
      // Packet size
      W(e.info.sampleRate < 2 ** 16 ? e.info.sampleRate : 0),
      // Sample rate (upper)
      W(0),
      // Sample rate (lower)
      s ? [
        B(1),
        // Samples per packet (must be 1 for uncompressed formats)
        B(n / 8),
        // Bytes per packet
        B(e.info.numberOfChannels * n / 8)
        // Bytes per frame
      ] : [
        B(0),
        // Samples per packet (don't bother, still works with 0)
        B(0),
        // Bytes per packet (variable)
        B(0)
        // Bytes per frame (variable)
      ],
      B(2)
      // Bytes per sample (constant in FFmpeg)
    ];
  }
  return U(r, i, [
    Mf(e.track.source._codec, e.muxer.isQuickTime)?.(e) ?? null
  ]);
}, Yi = (r) => {
  let e;
  switch (r.track.source._codec) {
    case "aac":
      e = 64;
      break;
    case "mp3":
      e = 107;
      break;
    case "vorbis":
      e = 221;
      break;
    default:
      throw new Error(`Unhandled audio codec: ${r.track.source._codec}`);
  }
  let t = [
    ...re(e),
    // Object type indication
    ...re(21),
    // stream type(6bits)=5 audio, flags(2bits)=1
    ...Uo(0),
    // 24bit buffer size
    ...B(0),
    // max bitrate
    ...B(0)
    // avg bitrate
  ];
  if (r.info.decoderConfig.description) {
    const i = be(r.info.decoderConfig.description);
    t = [
      ...t,
      ...re(5),
      // TAG(5) = DecoderSpecificInfo
      ...$i(i.byteLength),
      ...i
    ];
  }
  return t = [
    ...W(1),
    // ES_ID = 1
    ...re(0),
    // flags etc = 0
    ...re(4),
    // TAG(4) = ES Descriptor
    ...$i(t.length),
    ...t,
    ...re(6),
    // TAG(6)
    ...re(1),
    // length
    ...re(2)
    // data
  ], t = [
    ...re(3),
    // TAG(3) = Object Descriptor
    ...$i(t.length),
    ...t
  ], X("esds", 0, 0, t);
}, ut = (r) => U("wave", void 0, [
  Zd(r),
  Jd(r),
  U("\0\0\0\0")
  // NULL tag at the end
]), Zd = (r) => U("frma", [
  $(Qo(r.track.source._codec, r.info.decoderConfig.codec, r.muxer.isQuickTime))
]), Jd = (r) => {
  const { littleEndian: e } = at(r.track.source._codec);
  return U("enda", [
    W(+e)
  ]);
}, ef = (r) => {
  let e = r.info.numberOfChannels, t = 3840, i = r.info.sampleRate, n = 0, s = 0, a = new Uint8Array(0);
  const o = r.info.decoderConfig?.description;
  if (o) {
    g(o.byteLength >= 18);
    const c = be(o), l = Ha(c);
    e = l.outputChannelCount, t = l.preSkip, i = l.inputSampleRate, n = l.outputGain, s = l.channelMappingFamily, l.channelMappingTable && (a = l.channelMappingTable);
  }
  return U("dOps", [
    re(0),
    // Version
    re(e),
    // OutputChannelCount
    W(t),
    // PreSkip
    B(i),
    // InputSampleRate
    Jn(n),
    // OutputGain
    re(s),
    // ChannelMappingFamily
    ...a
  ]);
}, tf = (r) => {
  const e = r.info.decoderConfig?.description;
  g(e);
  const t = be(e);
  return X("dfLa", 0, 0, [
    ...t.subarray(4)
  ]);
}, Ue = (r) => {
  const { littleEndian: e, sampleSize: t } = at(r.track.source._codec), i = +e;
  return X("pcmC", 0, 0, [
    re(i),
    re(8 * t)
  ]);
}, rf = (r) => {
  g(r.info.primingPacket);
  const e = ja(r.info.primingPacket.data);
  if (!e)
    throw new Error("Couldn't extract AC-3 frame info from the audio packet. Ensure the packets contain valid AC-3 sync frames (as specified in ETSI TS 102 366).");
  const t = new Uint8Array(3), i = new Q(t);
  return i.writeBits(2, e.fscod), i.writeBits(5, e.bsid), i.writeBits(3, e.bsmod), i.writeBits(3, e.acmod), i.writeBits(1, e.lfeon), i.writeBits(5, e.bitRateCode), i.writeBits(5, 0), U("dac3", [...t]);
}, nf = (r) => {
  g(r.info.primingPacket);
  const e = Qa(r.info.primingPacket.data);
  if (!e)
    throw new Error("Couldn't extract E-AC-3 frame info from the audio packet. Ensure the packets contain valid E-AC-3 sync frames (as specified in ETSI TS 102 366).");
  let t = 16;
  for (const a of e.substreams)
    t += 23, a.numDepSub > 0 ? t += 9 : t += 1;
  const i = Math.ceil(t / 8), n = new Uint8Array(i), s = new Q(n);
  s.writeBits(13, e.dataRate), s.writeBits(3, e.substreams.length - 1);
  for (const a of e.substreams)
    s.writeBits(2, a.fscod), s.writeBits(5, a.bsid), s.writeBits(1, 0), s.writeBits(1, 0), s.writeBits(3, a.bsmod), s.writeBits(3, a.acmod), s.writeBits(1, a.lfeon), s.writeBits(3, 0), s.writeBits(4, a.numDepSub), a.numDepSub > 0 ? s.writeBits(9, a.chanLoc) : s.writeBits(1, 0);
  return U("dec3", [...n]);
}, sf = (r) => {
  g(r.info.primingPacket);
  const e = jn(r.info.primingPacket.data);
  if (!e)
    throw new Error("Couldn't extract DTS frame info from the audio packet. Ensure the packets contain valid DTS frames as specified in ETSI TS 102 114.");
  return U("ddts", [...al(e)]);
}, af = (r, e) => U(r, [
  Array(6).fill(0),
  // Reserved
  W(1)
  // Data reference index
], [
  Of[e.track.source._codec](e)
]), of = (r) => U("vttC", [
  ...Ke.encode(r.info.config.description)
]), cf = (r) => X("stts", 0, 0, [
  B(r.timeToSampleTable.length),
  // Number of entries
  r.timeToSampleTable.map((e) => [
    B(e.sampleCount),
    // Sample count
    B(e.sampleDelta)
    // Sample duration
  ])
]), lf = (r) => {
  if (r.samples.every((t) => t.type === "key"))
    return null;
  const e = [...r.samples.entries()].filter(([, t]) => t.type === "key");
  return X("stss", 0, 0, [
    B(e.length),
    // Number of entries
    e.map(([t]) => B(t + 1))
    // Sync sample table
  ]);
}, uf = (r) => X("stsc", 0, 0, [
  B(r.compactlyCodedChunkTable.length),
  // Number of entries
  r.compactlyCodedChunkTable.map((e) => [
    B(e.firstChunk),
    // First chunk
    B(e.samplesPerChunk),
    // Samples per chunk
    B(1)
    // Sample description index
  ])
]), df = (r) => {
  if (r.type === "audio" && r.info.requiresPcmTransformation) {
    const { sampleSize: e } = at(r.track.source._codec);
    return X("stsz", 0, 0, [
      B(e * r.info.numberOfChannels),
      // Sample size
      B(r.samples.reduce((t, i) => t + ee(i.duration, r.timescale), 0))
    ]);
  }
  return X("stsz", 0, 0, [
    B(0),
    // Sample size (0 means non-constant size)
    B(r.samples.length),
    // Number of entries
    r.samples.map((e) => B(e.size))
    // Sample size table
  ]);
}, ff = (r) => r.finalizedChunks.length > 0 && te(r.finalizedChunks).offset >= 2 ** 32 ? X("co64", 0, 0, [
  B(r.finalizedChunks.length),
  // Number of entries
  r.finalizedChunks.map((e) => Xe(e.offset))
  // Chunk offset table
]) : X("stco", 0, 0, [
  B(r.finalizedChunks.length),
  // Number of entries
  r.finalizedChunks.map((e) => B(e.offset))
  // Chunk offset table
]), hf = (r) => X("ctts", 1, 0, [
  B(r.compositionTimeOffsetTable.length),
  // Number of entries
  r.compositionTimeOffsetTable.map((e) => [
    B(e.sampleCount),
    // Sample count
    nt(e.sampleCompositionTimeOffset)
    // Sample offset
  ])
]), mf = (r) => {
  let e = 1 / 0, t = -1 / 0, i = 1 / 0, n = -1 / 0;
  g(r.compositionTimeOffsetTable.length > 0), g(r.samples.length > 0);
  for (let a = 0; a < r.compositionTimeOffsetTable.length; a++) {
    const o = r.compositionTimeOffsetTable[a];
    e = Math.min(e, o.sampleCompositionTimeOffset), t = Math.max(t, o.sampleCompositionTimeOffset);
  }
  for (let a = 0; a < r.samples.length; a++) {
    const o = r.samples[a];
    i = Math.min(i, ee(o.timestamp, r.timescale)), n = Math.max(n, ee(o.timestamp + o.duration, r.timescale));
  }
  const s = Math.max(-e, 0);
  return n >= 2 ** 31 ? null : X("cslg", 0, 0, [
    nt(s),
    // Composition to DTS shift
    nt(e),
    // Least decode to display delta
    nt(t),
    // Greatest decode to display delta
    nt(i),
    // Composition start time
    nt(n)
    // Composition end time
  ]);
}, pf = (r) => U("mvex", void 0, r.map(gf)), gf = (r) => X("trex", 0, 0, [
  B(r.track.id),
  // Track ID
  B(1),
  // Default sample description index
  B(0),
  // Default sample duration
  B(0),
  // Default sample size
  B(0)
  // Default sample flags
]), ma = (r, e) => U("moof", void 0, [
  yf(r),
  ...e.map(wf)
]), yf = (r) => X("mfhd", 0, 0, [
  B(r)
  // Sequence number
]), jo = (r) => {
  let e = 0, t = 0;
  const i = 0, n = 0, s = r.type === "delta";
  return t |= +s, s ? e |= 1 : e |= 2, e << 24 | t << 16 | i << 8 | n;
}, wf = (r) => U("traf", void 0, [
  bf(r),
  kf(r),
  Tf(r)
]), bf = (r) => {
  g(r.currentChunk);
  let e = 0;
  e |= 8, e |= 16, e |= 32, e |= 131072;
  const t = r.currentChunk.samples[1] ?? r.currentChunk.samples[0], i = {
    duration: t.timescaleUnitsToNextSample,
    size: t.size,
    flags: jo(t)
  };
  return X("tfhd", 0, e, [
    B(r.track.id),
    // Track ID
    B(i.duration),
    // Default sample duration
    B(i.size),
    // Default sample size
    B(i.flags)
    // Default sample flags
  ]);
}, kf = (r) => (g(r.currentChunk), X("tfdt", 1, 0, [
  Xe(ee(r.currentChunk.startTimestamp, r.timescale))
  // Base Media Decode Time
])), Tf = (r) => {
  g(r.currentChunk);
  const e = r.currentChunk.samples.map((m) => m.timescaleUnitsToNextSample), t = r.currentChunk.samples.map((m) => m.size), i = r.currentChunk.samples.map(jo), n = r.currentChunk.samples.map((m) => ee(m.timestamp - m.decodeTimestamp, r.timescale)), s = new Set(e), a = new Set(t), o = new Set(i), c = new Set(n), l = o.size === 2 && i[0] !== i[1], u = s.size > 1, d = a.size > 1, f = !l && o.size > 1, h = c.size > 1 || [...c].some((m) => m !== 0);
  let p = 0;
  return p |= 1, p |= 4 * +l, p |= 256 * +u, p |= 512 * +d, p |= 1024 * +f, p |= 2048 * +h, X("trun", 1, p, [
    B(r.currentChunk.samples.length),
    // Sample count
    B(r.currentChunk.offset - r.currentChunk.moofOffset || 0),
    // Data offset
    l ? B(i[0]) : [],
    r.currentChunk.samples.map((m, y) => [
      u ? B(e[y]) : [],
      // Sample duration
      d ? B(t[y]) : [],
      // Sample size
      f ? B(i[y]) : [],
      // Sample flags
      // Sample composition time offsets
      h ? nt(n[y]) : []
    ])
  ]);
}, Af = (r) => U("mfra", void 0, [
  ...r.map(Sf),
  xf()
]), Sf = (r) => X("tfra", 1, 0, [
  B(r.track.id),
  // Track ID
  B(63),
  // This specifies that traf number, trun number and sample number are 32-bit ints
  B(r.finalizedChunks.length),
  // Number of entries
  r.finalizedChunks.map((t) => [
    Xe(ee(t.samples[0].timestamp, r.timescale)),
    // Time (in presentation time)
    Xe(t.moofOffset),
    // moof offset
    B(t.trafIndex + 1),
    // traf number
    B(1),
    // trun number
    B(1)
    // Sample number
  ])
]), xf = () => X("mfro", 0, 0, [
  // This value needs to be overwritten manually from the outside, where the actual size of the enclosing mfra box
  // is known
  B(0)
  // Size
]), Pf = () => U("vtte"), Cf = (r, e, t, i, n) => U("vttc", void 0, [
  n !== null ? U("vsid", [nt(n)]) : null,
  t !== null ? U("iden", [...Ke.encode(t)]) : null,
  e !== null ? U("ctim", [...Ke.encode(Sd(e))]) : null,
  i !== null ? U("sttg", [...Ke.encode(i)]) : null,
  U("payl", [...Ke.encode(r)])
]), Ef = (r) => U("vtta", [...Ke.encode(r)]), If = (r) => {
  const e = [], t = r.format._options.metadataFormat ?? "auto", i = r.output._metadataTags;
  if (t === "mdir" || t === "auto" && !r.isQuickTime) {
    const n = vf(i);
    n && e.push(n);
  } else if (t === "mdta") {
    const n = Bf(i);
    n && e.push(n);
  } else (t === "udta" || t === "auto" && r.isQuickTime) && _f(e, r.output._metadataTags);
  return e.length === 0 ? null : U("udta", void 0, e);
}, _f = (r, e) => {
  for (const { key: t, value: i } of xa(e))
    switch (t) {
      case "title":
        r.push(We("©nam", i));
        break;
      case "description":
        r.push(We("©des", i));
        break;
      case "artist":
        r.push(We("©ART", i));
        break;
      case "album":
        r.push(We("©alb", i));
        break;
      case "albumArtist":
        r.push(We("albr", i));
        break;
      case "genre":
        r.push(We("©gen", i));
        break;
      case "date":
        r.push(We("©day", i.toISOString().slice(0, 10)));
        break;
      case "comment":
        r.push(We("©cmt", i));
        break;
      case "lyrics":
        r.push(We("©lyr", i));
        break;
      case "raw":
        break;
      case "discNumber":
      case "discsTotal":
      case "trackNumber":
      case "tracksTotal":
      case "images":
        break;
      default:
        Re(t);
    }
  if (e.raw)
    for (const t in e.raw) {
      const i = e.raw[t];
      i == null || t.length !== 4 || r.some((n) => n.type === t) || (typeof i == "string" ? r.push(We(t, i)) : i instanceof Uint8Array && r.push(U(t, Array.from(i))));
    }
}, We = (r, e) => {
  const t = Ke.encode(e);
  return U(r, [
    W(t.length),
    W(Go("und")),
    Array.from(t)
  ]);
}, pa = {
  "image/jpeg": 13,
  "image/png": 14,
  "image/bmp": 27
}, Ko = (r, e) => {
  const t = [];
  for (const { key: i, value: n } of xa(r))
    switch (i) {
      case "title":
        t.push({ key: e ? "title" : "©nam", value: ze(n) });
        break;
      case "description":
        t.push({ key: e ? "description" : "©des", value: ze(n) });
        break;
      case "artist":
        t.push({ key: e ? "artist" : "©ART", value: ze(n) });
        break;
      case "album":
        t.push({ key: e ? "album" : "©alb", value: ze(n) });
        break;
      case "albumArtist":
        t.push({ key: e ? "album_artist" : "aART", value: ze(n) });
        break;
      case "comment":
        t.push({ key: e ? "comment" : "©cmt", value: ze(n) });
        break;
      case "genre":
        t.push({ key: e ? "genre" : "©gen", value: ze(n) });
        break;
      case "lyrics":
        t.push({ key: e ? "lyrics" : "©lyr", value: ze(n) });
        break;
      case "date":
        t.push({
          key: e ? "date" : "©day",
          value: ze(n.toISOString().slice(0, 10))
        });
        break;
      case "images":
        for (const s of n)
          s.kind === "coverFront" && t.push({ key: "covr", value: U("data", [
            B(pa[s.mimeType] ?? 0),
            // Type indicator
            B(0),
            // Locale indicator
            Array.from(s.data)
            // Kinda slow, hopefully temp
          ]) });
        break;
      case "trackNumber":
        if (e) {
          const s = r.tracksTotal !== void 0 ? `${n}/${r.tracksTotal}` : n.toString();
          t.push({ key: "track", value: ze(s) });
        } else
          t.push({ key: "trkn", value: U("data", [
            B(0),
            // 8 bytes empty
            B(0),
            W(0),
            // Empty
            W(n),
            W(r.tracksTotal ?? 0),
            W(0)
            // Empty
          ]) });
        break;
      case "discNumber":
        e || t.push({ key: "disc", value: U("data", [
          B(0),
          // 8 bytes empty
          B(0),
          W(0),
          // Empty
          W(n),
          W(r.discsTotal ?? 0),
          W(0)
          // Empty
        ]) });
        break;
      case "tracksTotal":
      case "discsTotal":
        break;
      case "raw":
        break;
      default:
        Re(i);
    }
  if (r.raw)
    for (const i in r.raw) {
      const n = r.raw[i];
      n == null || !e && i.length !== 4 || t.some((s) => s.key === i) || (typeof n == "string" ? t.push({ key: i, value: ze(n) }) : n instanceof Uint8Array ? t.push({ key: i, value: U("data", [
        B(0),
        // Type indicator
        B(0),
        // Locale indicator
        Array.from(n)
      ]) }) : n instanceof Qt && t.push({ key: i, value: U("data", [
        B(pa[n.mimeType] ?? 0),
        // Type indicator
        B(0),
        // Locale indicator
        Array.from(n.data)
        // Kinda slow, hopefully temp
      ]) }));
    }
  return t;
}, vf = (r) => {
  const e = Ko(r, !1);
  return e.length === 0 ? null : X("meta", 0, 0, void 0, [
    es(!1, "mdir", "", "appl"),
    // mdir handler
    U("ilst", void 0, e.map((t) => U(t.key, void 0, [t.value])))
    // Item list without keys box
  ]);
}, Bf = (r) => {
  const e = Ko(r, !0);
  return e.length === 0 ? null : U("meta", void 0, [
    es(!1, "mdta", ""),
    // mdta handler
    X("keys", 0, 0, [
      B(e.length)
    ], e.map((t) => U("mdta", [
      ...Ke.encode(t.key)
    ]))),
    U("ilst", void 0, e.map((t, i) => {
      const n = String.fromCharCode(...B(i + 1));
      return U(n, void 0, [t.value]);
    }))
  ]);
}, ze = (r) => U("data", [
  B(1),
  // Type indicator (UTF-8)
  B(0),
  // Locale indicator
  ...Ke.encode(r)
]), Rf = (r, e) => {
  switch (r) {
    case "avc":
      return e.startsWith("avc3") ? "avc3" : "avc1";
    case "hevc":
      return "hvc1";
    case "vp8":
      return "vp08";
    case "vp9":
      return "vp09";
    case "av1":
      return "av01";
    case "prores":
      return e;
  }
}, Ff = {
  avc: Gd,
  hevc: Xd,
  vp8: ha,
  vp9: ha,
  av1: $d,
  prores: null
}, Qo = (r, e, t) => {
  switch (r) {
    case "aac":
      return "mp4a";
    case "mp3":
      return "mp4a";
    case "opus":
      return "Opus";
    case "vorbis":
      return "mp4a";
    case "flac":
      return "fLaC";
    case "ulaw":
      return "ulaw";
    case "alaw":
      return "alaw";
    case "pcm-u8":
      return "raw ";
    case "pcm-s8":
      return "sowt";
    case "ac3":
      return "ac-3";
    case "eac3":
      return "ec-3";
    case "dts":
      return e;
  }
  if (t)
    switch (r) {
      case "pcm-s16":
        return "sowt";
      case "pcm-s16be":
        return "twos";
      case "pcm-s24":
        return "in24";
      case "pcm-s24be":
        return "in24";
      case "pcm-s32":
        return "in32";
      case "pcm-s32be":
        return "in32";
      case "pcm-f32":
        return "fl32";
      case "pcm-f32be":
        return "fl32";
      case "pcm-f64":
        return "fl64";
      case "pcm-f64be":
        return "fl64";
    }
  else
    switch (r) {
      case "pcm-s16":
        return "ipcm";
      case "pcm-s16be":
        return "ipcm";
      case "pcm-s24":
        return "ipcm";
      case "pcm-s24be":
        return "ipcm";
      case "pcm-s32":
        return "ipcm";
      case "pcm-s32be":
        return "ipcm";
      case "pcm-f32":
        return "fpcm";
      case "pcm-f32be":
        return "fpcm";
      case "pcm-f64":
        return "fpcm";
      case "pcm-f64be":
        return "fpcm";
    }
}, Mf = (r, e) => {
  switch (r) {
    case "aac":
      return Yi;
    case "mp3":
      return Yi;
    case "opus":
      return ef;
    case "vorbis":
      return Yi;
    case "flac":
      return tf;
    case "ac3":
      return rf;
    case "eac3":
      return nf;
    case "dts":
      return sf;
  }
  if (e)
    switch (r) {
      case "pcm-s24":
        return ut;
      case "pcm-s24be":
        return ut;
      case "pcm-s32":
        return ut;
      case "pcm-s32be":
        return ut;
      case "pcm-f32":
        return ut;
      case "pcm-f32be":
        return ut;
      case "pcm-f64":
        return ut;
      case "pcm-f64be":
        return ut;
    }
  else
    switch (r) {
      case "pcm-s16":
        return Ue;
      case "pcm-s16be":
        return Ue;
      case "pcm-s24":
        return Ue;
      case "pcm-s24be":
        return Ue;
      case "pcm-s32":
        return Ue;
      case "pcm-s32be":
        return Ue;
      case "pcm-f32":
        return Ue;
      case "pcm-f32be":
        return Ue;
      case "pcm-f64":
        return Ue;
      case "pcm-f64be":
        return Ue;
    }
  return null;
}, zf = {
  webvtt: "wvtt"
}, Of = {
  webvtt: of
}, Go = (r) => {
  g(r.length === 3);
  let e = 0;
  for (let t = 0; t < 3; t++)
    e <<= 5, e += r.charCodeAt(t) - 96;
  return e;
};
class In {
  constructor(e, t) {
    if (this.finalized = !1, this.started = !1, this.pos = 0, this.trackedWrites = null, this.trackedStart = -1, this.trackedEnd = -1, e._writerAcquired)
      throw new Error("Can't have multiple Writers for the same Target.");
    this.target = e, e._setMonotonicity(t), e._writerAcquired = !0;
  }
  start() {
    g(!this.started), this.target._start(), this.started = !0;
  }
  /** Writes the given data to the target, at the current position. */
  write(e) {
    g(this.started && !this.finalized), this.maybeTrackWrites(e), this.target._write(e, this.pos), this.pos += e.byteLength;
  }
  /** Sets the current position for future writes to a new one. */
  seek(e) {
    this.pos = e;
  }
  /** Returns the current position. */
  getPos() {
    return this.pos;
  }
  /** Signals to the writer that it may be time to flush. */
  async flush() {
    return g(this.started && !this.finalized), this.target._flush();
  }
  /** Called after muxing has finished. */
  async finalize() {
    g(this.started && !this.finalized), await this.target._finalize(), this.finalized = !0;
  }
  maybeTrackWrites(e) {
    if (!this.trackedWrites)
      return;
    let t = this.getPos();
    if (t < this.trackedStart) {
      if (t + e.byteLength <= this.trackedStart)
        return;
      e = e.subarray(this.trackedStart - t), t = 0;
    }
    const i = t + e.byteLength - this.trackedStart;
    let n = this.trackedWrites.byteLength;
    for (; n < i; )
      n *= 2;
    if (n !== this.trackedWrites.byteLength) {
      const s = new Uint8Array(n);
      s.set(this.trackedWrites, 0), this.trackedWrites = s;
    }
    this.trackedWrites.set(e, t - this.trackedStart), this.trackedEnd = Math.max(this.trackedEnd, t + e.byteLength);
  }
  startTrackingWrites() {
    this.trackedWrites = new Uint8Array(2 ** 10), this.trackedStart = this.getPos(), this.trackedEnd = this.trackedStart;
  }
  stopTrackingWrites() {
    if (!this.trackedWrites)
      throw new Error("Internal error: Can't get tracked writes since nothing was tracked.");
    const t = {
      data: this.trackedWrites.subarray(0, this.trackedEnd - this.trackedStart),
      start: this.trackedStart,
      end: this.trackedEnd
    };
    return this.trackedWrites = null, t;
  }
}
class He extends Fr {
  constructor() {
    super(...arguments), this._writerAcquired = !1, this._monotonicity = null, this.onwrite = null;
  }
  /** @internal */
  _setMonotonicity(e) {
    this._monotonicity !== !1 && (this._monotonicity = e);
  }
  /** @internal */
  _dispatchWrite(e, t) {
    this.onwrite?.(e, t), this._emit("write", { start: e, end: t });
  }
  /**
   * Returns a new {@link RangedTarget} that writes data to this target using the given offset.
   *
   * Useful for writing a file into a section of a larger file.
   */
  slice(e) {
    if (!Number.isInteger(e) || e < 0)
      throw new TypeError("offset must be a non-negative integer.");
    return new Nf(this, e);
  }
}
const Zi = 2 ** 16, Ji = 2 ** 32;
class Zr extends He {
  /** Creates a new {@link BufferTarget}. The buffer holding the data will be created and managed internally. */
  constructor(e = {}) {
    if (super(), this.buffer = null, this._maxPos = 0, !e || typeof e != "object")
      throw new TypeError("BufferTarget options, when provided, must be an object.");
    if (e.onFinalize !== void 0 && typeof e.onFinalize != "function")
      throw new TypeError("options.onFinalize, when provided, must be a function.");
    if (this._options = e, this._supportsResize = "resize" in new ArrayBuffer(0), this._supportsResize)
      try {
        this._buffer = new ArrayBuffer(Zi, { maxByteLength: Ji });
      } catch {
        this._buffer = new ArrayBuffer(Zi), this._supportsResize = !1;
      }
    else
      this._buffer = new ArrayBuffer(Zi);
    this._bytes = new Uint8Array(this._buffer);
  }
  /** @internal */
  _ensureSize(e) {
    let t = this._buffer.byteLength;
    for (; t < e; )
      t *= 2;
    if (t !== this._buffer.byteLength) {
      if (t > Ji)
        throw new Error(`ArrayBuffer exceeded maximum size of ${Ji} bytes. Please consider using another target.`);
      if (this._supportsResize)
        this._buffer.resize(t);
      else {
        const i = new ArrayBuffer(t), n = new Uint8Array(i);
        n.set(this._bytes, 0), this._buffer = i, this._bytes = n;
      }
    }
  }
  /** @internal */
  _start() {
  }
  /** @internal */
  _write(e, t) {
    this._ensureSize(t + e.byteLength), this._bytes.set(e, t), this._maxPos = Math.max(this._maxPos, t + e.byteLength), this._dispatchWrite(t, t + e.byteLength);
  }
  /** @internal */
  async _flush() {
  }
  /** @internal */
  async _finalize() {
    this.buffer = this._buffer.slice(0, this._maxPos), this._options.onFinalize && await this._options.onFinalize(this.buffer), this._emit("finalized");
  }
  /** @internal */
  async _close() {
  }
  /** @internal */
  _getSlice(e, t) {
    return this._bytes.slice(e, t);
  }
}
class Df extends He {
  /** @internal */
  _start() {
  }
  /** @internal */
  _write(e, t) {
    this._dispatchWrite(t, t + e.byteLength);
  }
  /** @internal */
  async _flush() {
  }
  /** @internal */
  async _finalize() {
    this._emit("finalized");
  }
  /** @internal */
  async _close() {
  }
}
class Nf extends He {
  /** @internal */
  constructor(e, t) {
    super(), this._baseTarget = e, this._offset = t;
  }
  /** @internal */
  _start() {
  }
  /** @internal */
  _write(e, t) {
    this._baseTarget._write(e, this._offset + t), this._dispatchWrite(t, t + e.byteLength);
  }
  /** @internal */
  _flush() {
    return this._baseTarget._flush();
  }
  /** @internal */
  async _finalize() {
    this._emit("finalized");
  }
  /** @internal */
  async _close() {
  }
  /** @internal */
  _setMonotonicity(e) {
    super._setMonotonicity(e), this._baseTarget._setMonotonicity(e);
  }
}
class en {
  /** Creates a new {@link PathedTarget} from a root path and a callback. */
  constructor(e, t) {
    if (this.rootPath = e, this.getTarget = t, typeof e != "string")
      throw new TypeError("rootPath must be a string.");
    if (typeof t != "function")
      throw new TypeError("getTarget must be a function.");
  }
}
const De = 57600, Vf = 2082844800, Uf = (r) => {
  const e = {}, t = r.track;
  return t.metadata.name !== void 0 && (e.name = t.metadata.name), e;
}, ee = (r, e, t = !0) => {
  const i = r * e;
  return t ? Math.round(i) : i;
};
class Wf extends Ad {
  constructor(e, t) {
    super(e), this.writer = null, this.boxWriter = null, this.initWriter = null, this.initBoxWriter = null, this.auxTarget = new Zr(), this.auxWriter = new In(this.auxTarget, !1), this.auxBoxWriter = new Wr(this.auxWriter), this.mdat = null, this.ftypSize = null, this.trackDatas = [], this.allTracksKnown = ne(), this.creationTime = Math.floor(Date.now() / 1e3) + Vf, this.finalizedChunks = [], this.wroteFragmentedHeader = !1, this.nextFragmentNumber = 1, this.maxWrittenTimestamp = -1 / 0, this.minWrittenTimestamp = 1 / 0, this.maxWrittenEndTimestamp = -1 / 0, this.segmentHeaderSize = null, this.format = t, this.formatOptions = { ...t._options }, this.isQuickTime = t instanceof $o, this.isCmaf = t instanceof ya, this.minimumFragmentDuration = this.formatOptions.minimumFragmentDuration ?? (t instanceof ya ? 1 / 0 : 1), this.auxWriter.start();
  }
  async start() {
    const e = await this.mutex.acquire();
    if (this.isCmaf ? (this.fastStart = "fragmented", this.isFragmented = !0) : (this.writer = await this.output._getRootWriter((i) => this.formatOptions.fastStart !== void 0 ? this.formatOptions.fastStart === "fragmented" : i instanceof Zr), this.boxWriter = new Wr(this.writer), this.fastStart = this.formatOptions.fastStart ?? (this.writer.target instanceof Zr ? "in-memory" : !1), this.isFragmented = this.fastStart === "fragmented"), this.isCmaf) {
      if (!this.output._hasInitTarget())
        throw new Error("CMAF outputs require the initTarget field in OutputOptions to be set; the init segment will be written to it.");
      const i = await this.output._getInitTarget(), n = new In(i, !0);
      n.start(), this.initWriter = n, this.initBoxWriter = new Wr(n);
    }
    const t = this.output.tracks.some((i) => i.isVideoTrack() && i.source._codec === "avc");
    {
      const i = this.initBoxWriter ?? this.boxWriter;
      if (g(i), this.formatOptions.onFtyp && i.writer.startTrackingWrites(), i.writeBox(Pd({
        isQuickTime: this.isQuickTime,
        holdsAvc: t,
        fragmented: this.isFragmented,
        cmaf: this.isCmaf
      })), this.formatOptions.onFtyp) {
        const { data: n, start: s } = i.writer.stopTrackingWrites();
        this.formatOptions.onFtyp(n, s);
      }
      this.ftypSize = i.writer.getPos(), this.isCmaf && await this.initWriter.flush();
    }
    if (this.fastStart !== "in-memory") if (this.fastStart === "reserve") {
      for (const i of this.output.tracks)
        if (i.metadata.maximumPacketCount === void 0)
          throw new Error("All tracks must specify maximumPacketCount in their metadata when using fastStart: 'reserve'.");
    } else this.isFragmented || (g(this.writer), g(this.boxWriter), this.formatOptions.onMdat && this.writer.startTrackingWrites(), this.mdat = qr(!0), this.boxWriter.writeBox(this.mdat));
    await this.writer?.flush();
    for (const i of this.output.tracks)
      i.isVideoTrack() && i.metadata.decoderConfig ? this.getVideoTrackData(i, i.metadata.primingPacket ?? null, { decoderConfig: i.metadata.decoderConfig }) : i.isAudioTrack() && i.metadata.decoderConfig && this.getAudioTrackData(i, i.metadata.primingPacket ?? null, { decoderConfig: i.metadata.decoderConfig });
    e();
  }
  allTracksAreKnown() {
    for (const e of this.output.tracks)
      if (!e.source._closed && !this.trackDatas.some((t) => t.track === e))
        return !1;
    return !0;
  }
  async getMimeType() {
    await this.allTracksKnown.promise;
    const e = this.trackDatas.map((t) => t.type === "video" || t.type === "audio" ? t.info.decoderConfig.codec : {
      webvtt: "wvtt"
    }[t.track.source._codec]);
    return Ja({
      isQuickTime: this.isQuickTime,
      hasVideo: this.trackDatas.some((t) => t.type === "video"),
      hasAudio: this.trackDatas.some((t) => t.type === "audio"),
      codecStrings: e
    });
  }
  getVideoTrackData(e, t, i) {
    const n = this.trackDatas.find((h) => h.track === e);
    if (n)
      return n;
    va(i, e.source._codec), g(i), g(i.decoderConfig);
    const s = { ...i.decoderConfig };
    g(s.codedWidth !== void 0), g(s.codedHeight !== void 0);
    let a = !1;
    if (e.source._codec === "avc" && !s.description) {
      if (!t)
        throw new Error("No AVC description provided; you must therefore provide a priming packet.");
      const h = Ai(t.data);
      if (!h)
        throw new Error("Couldn't extract an AVCDecoderConfigurationRecord from the AVC packet. Make sure the packets are in Annex B format (as specified in ITU-T-REC-H.264) when not providing a description, or provide a description (must be an AVCDecoderConfigurationRecord as specified in ISO 14496-15) and ensure the packets are in AVCC format.");
      s.description = Bc(h), a = !0;
    } else if (e.source._codec === "hevc" && !s.description) {
      if (!t)
        throw new Error("No HEVC description provided; you must therefore provide a priming packet.");
      const h = Si(t.data);
      if (!h)
        throw new Error("Couldn't extract an HEVCDecoderConfigurationRecord from the HEVC packet. Make sure the packets are in Annex B format (as specified in ITU-T-REC-H.265) when not providing a description, or provide a description (must be an HEVCDecoderConfigurationRecord as specified in ISO 14496-15) and ensure the packets are in HEVC format.");
      s.description = Uc(h), a = !0;
    }
    const o = cc(1 / (e.metadata.frameRate ?? De), 1e6).den, c = s.displayAspectWidth, l = s.displayAspectHeight, u = c === void 0 || l === void 0 ? { num: 1, den: 1 } : Cr({
      num: c * s.codedHeight,
      den: l * s.codedWidth
    }), d = s.codec === "ap4h" || s.codec === "ap4x", f = {
      muxer: this,
      track: e,
      type: "video",
      info: {
        width: s.codedWidth,
        height: s.codedHeight,
        pixelAspectRatio: u,
        decoderConfig: s,
        requiresAnnexBTransformation: a,
        hasAlphaChannel: d
      },
      timescale: o,
      samples: [],
      sampleQueue: [],
      timestampProcessingQueue: [],
      timeToSampleTable: [],
      compositionTimeOffsetTable: [],
      lastTimescaleUnits: null,
      lastSample: null,
      startTimestampOffset: null,
      finalizedChunks: [],
      currentChunk: null,
      compactlyCodedChunkTable: [],
      closed: !1
    };
    return this.trackDatas.push(f), this.trackDatas.sort((h, p) => h.track.id - p.track.id), this.allTracksAreKnown() && this.allTracksKnown.resolve(), f;
  }
  getAudioTrackData(e, t, i) {
    const n = this.trackDatas.find((c) => c.track === e);
    if (n)
      return n;
    Ba(i, e.source._codec), g(i), g(i.decoderConfig);
    const s = { ...i.decoderConfig };
    let a = !1;
    if (e.source._codec === "aac" && !s.description) {
      if (!t)
        throw new Error("No AAC description provided; you must therefore provide a priming packet.");
      const c = Ft(Pe.tempFromBytes(t.data));
      if (!c)
        throw new Error("Couldn't parse ADTS header from the AAC packet. Make sure the packets are in ADTS format (as specified in ISO 13818-7) when not providing a description, or provide a description (must be an AudioSpecificConfig as specified in ISO 14496-3) and ensure the packets are raw AAC data.");
      const l = Rt[c.samplingFrequencyIndex], u = Mr[c.channelConfiguration];
      if (l === void 0 || u === void 0)
        throw new Error("Invalid ADTS frame header.");
      s.description = Ea({
        objectType: c.objectType,
        sampleRate: l,
        numberOfChannels: u
      }), a = !0;
    }
    if (!t) {
      if (e.source._codec === "ac3" || e.source._codec === "eac3")
        throw new Error("AC-3/E-AC-3 require a priming packet.");
      if (e.source._codec === "dts")
        throw new Error("DTS requires a priming packet.");
    }
    const o = {
      muxer: this,
      track: e,
      type: "audio",
      info: {
        numberOfChannels: i.decoderConfig.numberOfChannels,
        sampleRate: i.decoderConfig.sampleRate,
        decoderConfig: s,
        requiresPcmTransformation: !this.isFragmented && ye.includes(e.source._codec),
        expectedNextPcmPacketTimestamp: null,
        requiresAdtsStripping: a,
        primingPacket: t
      },
      timescale: s.sampleRate,
      samples: [],
      sampleQueue: [],
      timestampProcessingQueue: [],
      timeToSampleTable: [],
      compositionTimeOffsetTable: [],
      lastTimescaleUnits: null,
      lastSample: null,
      startTimestampOffset: null,
      finalizedChunks: [],
      currentChunk: null,
      compactlyCodedChunkTable: [],
      closed: !1
    };
    return this.trackDatas.push(o), this.trackDatas.sort((c, l) => c.track.id - l.track.id), this.allTracksAreKnown() && this.allTracksKnown.resolve(), o;
  }
  getSubtitleTrackData(e, t) {
    const i = this.trackDatas.find((s) => s.track === e);
    if (i)
      return i;
    Pc(t), g(t), g(t.config);
    const n = {
      muxer: this,
      track: e,
      type: "subtitle",
      info: {
        config: t.config
      },
      timescale: 1e3,
      // Reasonable
      samples: [],
      sampleQueue: [],
      timestampProcessingQueue: [],
      timeToSampleTable: [],
      compositionTimeOffsetTable: [],
      lastTimescaleUnits: null,
      lastSample: null,
      startTimestampOffset: null,
      finalizedChunks: [],
      currentChunk: null,
      compactlyCodedChunkTable: [],
      closed: !1,
      lastCueEndTimestamp: 0,
      cueQueue: [],
      nextSourceId: 0,
      cueToSourceId: /* @__PURE__ */ new WeakMap()
    };
    return this.trackDatas.push(n), this.trackDatas.sort((s, a) => s.track.id - a.track.id), this.allTracksAreKnown() && this.allTracksKnown.resolve(), n;
  }
  async addEncodedVideoPacket(e, t, i) {
    const n = await this.mutex.acquire();
    try {
      const s = this.getVideoTrackData(e, t, i);
      let a = t.data;
      if (s.info.requiresAnnexBTransformation) {
        const c = [...zr(a)].map((l) => a.subarray(l.offset, l.offset + l.length));
        if (c.length === 0)
          throw new Error("Failed to transform packet data. Make sure all packets are provided in Annex B format, as specified in ITU-T-REC-H.264 and ITU-T-REC-H.265.");
        a = Wn(c, 4);
      }
      this.validateTimestamp(s.track, t.timestamp, t.type === "key");
      const o = this.createSampleForTrack(s, a, t.timestamp, t.duration, t.type);
      await this.registerSample(s, o);
    } finally {
      n();
    }
  }
  async addEncodedAudioPacket(e, t, i) {
    const n = await this.mutex.acquire();
    try {
      const s = this.getAudioTrackData(e, t, i);
      let a = t.data;
      if (s.info.requiresAdtsStripping) {
        const u = Ft(Pe.tempFromBytes(a));
        if (!u)
          throw new Error("Expected ADTS frame, didn't get one.");
        const d = u.crcCheck === null ? ui : vt;
        a = a.subarray(d);
      }
      this.validateTimestamp(s.track, t.timestamp, t.type === "key");
      let o = t.timestamp, c = t.duration;
      if (s.info.requiresPcmTransformation) {
        const d = at(s.info.decoderConfig.codec).sampleSize * s.info.numberOfChannels;
        if (c = a.byteLength / d / s.info.sampleRate, s.info.expectedNextPcmPacketTimestamp !== null) {
          const f = o - s.info.expectedNextPcmPacketTimestamp;
          if (f < 0.01)
            o = s.info.expectedNextPcmPacketTimestamp;
          else {
            const h = await this.padWithSilence(s, s.info.expectedNextPcmPacketTimestamp, f);
            o = s.info.expectedNextPcmPacketTimestamp + h;
          }
        }
        s.info.expectedNextPcmPacketTimestamp = o + c;
      }
      const l = this.createSampleForTrack(s, a, o, c, t.type);
      await this.registerSample(s, l);
    } finally {
      n();
    }
  }
  async padWithSilence(e, t, i) {
    const n = ee(i, e.timescale);
    if (i = n / e.timescale, n > 0) {
      const { sampleSize: s, silentValue: a } = at(e.info.decoderConfig.codec), o = n * e.info.numberOfChannels, c = new Uint8Array(s * o).fill(a), l = this.createSampleForTrack(e, new Uint8Array(c.buffer), t, i, "key");
      await this.registerSample(e, l);
    }
    return i;
  }
  async addSubtitleCue(e, t, i) {
    const n = await this.mutex.acquire();
    try {
      const s = this.getSubtitleTrackData(e, i);
      this.validateTimestamp(s.track, t.timestamp, !0), e.source._codec === "webvtt" && (s.cueQueue.push(t), await this.processWebVTTCues(s, t.timestamp));
    } finally {
      n();
    }
  }
  async processWebVTTCues(e, t) {
    for (; e.cueQueue.length > 0; ) {
      const i = /* @__PURE__ */ new Set([]);
      for (const l of e.cueQueue)
        g(l.timestamp <= t), g(e.lastCueEndTimestamp <= l.timestamp + l.duration), i.add(Math.max(l.timestamp, e.lastCueEndTimestamp)), i.add(l.timestamp + l.duration);
      const n = [...i].sort((l, u) => l - u), s = n[0], a = n[1] ?? s;
      if (t < a)
        break;
      if (e.lastCueEndTimestamp < s) {
        this.auxWriter.seek(0);
        const l = Pf();
        this.auxBoxWriter.writeBox(l);
        const u = this.auxTarget._getSlice(0, this.auxWriter.getPos()), d = this.createSampleForTrack(e, u, e.lastCueEndTimestamp, s - e.lastCueEndTimestamp, "key");
        await this.registerSample(e, d), e.lastCueEndTimestamp = s;
      }
      this.auxWriter.seek(0);
      for (let l = 0; l < e.cueQueue.length; l++) {
        const u = e.cueQueue[l];
        if (u.timestamp >= a)
          break;
        ua.lastIndex = 0;
        const d = ua.test(u.text), f = u.timestamp + u.duration;
        let h = e.cueToSourceId.get(u);
        if (h === void 0 && a < f && (h = e.nextSourceId++, e.cueToSourceId.set(u, h)), u.notes) {
          const m = Ef(u.notes);
          this.auxBoxWriter.writeBox(m);
        }
        const p = Cf(u.text, d ? s : null, u.identifier ?? null, u.settings ?? null, h ?? null);
        this.auxBoxWriter.writeBox(p), f === a && e.cueQueue.splice(l--, 1);
      }
      const o = this.auxTarget._getSlice(0, this.auxWriter.getPos()), c = this.createSampleForTrack(e, o, s, a - s, "key");
      await this.registerSample(e, c), e.lastCueEndTimestamp = a;
    }
  }
  createSampleForTrack(e, t, i, n, s) {
    return {
      timestamp: i,
      decodeTimestamp: i,
      // This may be refined later
      duration: n,
      data: t,
      size: t.byteLength,
      type: s,
      timescaleUnitsToNextSample: ee(n, e.timescale)
      // Will be refined
    };
  }
  processTimestamps(e, t) {
    if (e.timestampProcessingQueue.length === 0)
      return;
    if (e.type === "audio" && e.info.requiresPcmTransformation) {
      this.isFragmented || (e.startTimestampOffset ??= e.timestampProcessingQueue[0].timestamp);
      let n = 0;
      for (let s = 0; s < e.timestampProcessingQueue.length; s++) {
        const a = e.timestampProcessingQueue[s], o = ee(a.duration, e.timescale);
        n += o;
      }
      if (e.timeToSampleTable.length === 0)
        e.timeToSampleTable.push({
          sampleCount: n,
          sampleDelta: 1
        });
      else {
        const s = te(e.timeToSampleTable);
        s.sampleCount += n;
      }
      e.timestampProcessingQueue.length = 0;
      return;
    }
    const i = e.timestampProcessingQueue.map((n) => n.timestamp).sort((n, s) => n - s);
    this.isFragmented || (e.startTimestampOffset ??= i[0]);
    for (let n = 0; n < e.timestampProcessingQueue.length; n++) {
      const s = e.timestampProcessingQueue[n];
      s.decodeTimestamp = i[n];
      const a = ee(s.timestamp - s.decodeTimestamp, e.timescale), o = ee(s.duration, e.timescale);
      if (e.lastTimescaleUnits !== null) {
        g(e.lastSample);
        const c = ee(s.decodeTimestamp, e.timescale, !1), l = Math.round(c - e.lastTimescaleUnits);
        if (g(l >= 0), e.lastTimescaleUnits += l, e.lastSample.timescaleUnitsToNextSample = l, !this.isFragmented) {
          let u = te(e.timeToSampleTable);
          if (g(u), u.sampleCount === 1) {
            u.sampleDelta = l;
            const f = e.timeToSampleTable[e.timeToSampleTable.length - 2];
            f && f.sampleDelta === l && (f.sampleCount++, e.timeToSampleTable.pop(), u = f);
          } else u.sampleDelta !== l && (u.sampleCount--, e.timeToSampleTable.push(u = {
            sampleCount: 1,
            sampleDelta: l
          }));
          u.sampleDelta === o ? u.sampleCount++ : e.timeToSampleTable.push({
            sampleCount: 1,
            sampleDelta: o
          });
          const d = te(e.compositionTimeOffsetTable);
          g(d), d.sampleCompositionTimeOffset === a ? d.sampleCount++ : e.compositionTimeOffsetTable.push({
            sampleCount: 1,
            sampleCompositionTimeOffset: a
          });
        }
      } else
        e.lastTimescaleUnits = ee(s.decodeTimestamp, e.timescale, !1), this.isFragmented || (e.timeToSampleTable.push({
          sampleCount: 1,
          sampleDelta: o
        }), e.compositionTimeOffsetTable.push({
          sampleCount: 1,
          sampleCompositionTimeOffset: a
        }));
      e.lastSample = s;
    }
    if (e.timestampProcessingQueue.length = 0, g(e.lastSample), g(e.lastTimescaleUnits !== null), t !== void 0 && e.lastSample.timescaleUnitsToNextSample === 0) {
      g(t.type === "key");
      const n = ee(t.timestamp, e.timescale, !1), s = Math.round(n - e.lastTimescaleUnits);
      e.lastSample.timescaleUnitsToNextSample = s;
    }
  }
  async registerSample(e, t) {
    t.type === "key" && this.processTimestamps(e, t), e.timestampProcessingQueue.push(t), this.isFragmented ? (e.sampleQueue.push(t), await this.interleaveSamples()) : this.fastStart === "reserve" ? await this.registerSampleFastStartReserve(e, t) : await this.addSampleToTrack(e, t);
  }
  async addSampleToTrack(e, t) {
    if (!this.isFragmented && (e.samples.push(t), this.fastStart === "reserve")) {
      const n = e.track.metadata.maximumPacketCount;
      if (g(n !== void 0), e.samples.length > n)
        throw new Error(`Track #${e.track.id} has already reached the maximum packet count (${n}). Either add less packets or increase the maximum packet count.`);
    }
    let i = !1;
    if (!e.currentChunk)
      i = !0;
    else {
      e.currentChunk.startTimestamp = Math.min(e.currentChunk.startTimestamp, t.timestamp);
      const n = t.timestamp - e.currentChunk.startTimestamp;
      if (this.isFragmented) {
        const s = this.trackDatas.every((a) => {
          if (e === a)
            return t.type === "key";
          const o = a.sampleQueue[0];
          return o ? o.type === "key" : a.closed;
        });
        n >= this.minimumFragmentDuration && s && t.timestamp > this.maxWrittenTimestamp && (i = !0, await this.finalizeFragment());
      } else
        i = n >= 0.5;
    }
    i && (e.currentChunk && await this.finalizeCurrentChunk(e), e.currentChunk = {
      startTimestamp: t.timestamp,
      samples: [],
      offset: null,
      moofOffset: null,
      trafIndex: null
    }), g(e.currentChunk), e.currentChunk.samples.push(t), this.isFragmented && (this.maxWrittenTimestamp = Math.max(this.maxWrittenTimestamp, t.timestamp), this.maxWrittenEndTimestamp = Math.max(this.maxWrittenEndTimestamp, t.timestamp + t.duration), this.minWrittenTimestamp = Math.min(this.minWrittenTimestamp, t.timestamp));
  }
  async finalizeCurrentChunk(e) {
    if (g(!this.isFragmented), g(this.writer), !e.currentChunk)
      return;
    e.finalizedChunks.push(e.currentChunk), this.finalizedChunks.push(e.currentChunk);
    let t = e.currentChunk.samples.length;
    if (e.type === "audio" && e.info.requiresPcmTransformation && (t = e.currentChunk.samples.reduce((i, n) => i + ee(n.duration, e.timescale), 0)), (e.compactlyCodedChunkTable.length === 0 || te(e.compactlyCodedChunkTable).samplesPerChunk !== t) && e.compactlyCodedChunkTable.push({
      firstChunk: e.finalizedChunks.length,
      // 1-indexed
      samplesPerChunk: t
    }), this.fastStart === "in-memory") {
      e.currentChunk.offset = 0;
      return;
    }
    e.currentChunk.offset = this.writer.getPos();
    for (const i of e.currentChunk.samples)
      g(i.data), this.writer.write(i.data), i.data = null;
    await this.writer.flush();
  }
  async interleaveSamples(e = !1) {
    if (g(this.isFragmented), !(!e && !this.allTracksAreKnown()))
      e: for (; ; ) {
        let t = null, i = 1 / 0;
        for (const s of this.trackDatas) {
          if (!e && s.sampleQueue.length === 0 && !s.closed)
            break e;
          s.sampleQueue.length > 0 && s.sampleQueue[0].timestamp < i && (t = s, i = s.sampleQueue[0].timestamp);
        }
        if (!t)
          break;
        const n = t.sampleQueue.shift();
        await this.addSampleToTrack(t, n);
      }
  }
  async finalizeFragment(e = !this.isCmaf) {
    if (g(this.isFragmented), !this.wroteFragmentedHeader) {
      this.wroteFragmentedHeader = !0;
      const h = this.initBoxWriter ?? this.boxWriter;
      g(h), this.formatOptions.onMoov && h.writer.startTrackingWrites(), this.ensureOneEnabledTrack();
      const p = hr(this);
      if (h.writeBox(p), this.formatOptions.onMoov) {
        const { data: m, start: y } = h.writer.stopTrackingWrites();
        this.formatOptions.onMoov(m, y);
      }
      if (this.isCmaf) {
        g(this.initWriter), await this.initWriter.flush(), await this.initWriter.finalize(), this.writer = await this.output._getRootWriter(!0), this.boxWriter = new Wr(this.writer);
        const m = this.boxWriter.measureBox(da()), y = this.boxWriter.measureBox(fa(this, 0));
        this.segmentHeaderSize = m + y, this.writer.seek(this.segmentHeaderSize);
      }
    }
    g(this.writer), g(this.boxWriter);
    const t = this.trackDatas.filter((h) => h.currentChunk);
    if (t.length === 0) {
      e && await this.writer.flush();
      return;
    }
    const i = this.nextFragmentNumber++, n = ma(i, t), s = this.writer.getPos(), a = s + this.boxWriter.measureBox(n);
    let o = a + rt, c = 1 / 0;
    for (let h = 0; h < t.length; h++) {
      const p = t[h];
      p.currentChunk.offset = o, p.currentChunk.moofOffset = s, p.currentChunk.trafIndex = h;
      for (const m of p.currentChunk.samples)
        o += m.size;
      c = Math.min(c, p.currentChunk.startTimestamp);
    }
    const l = o - a, u = l >= 2 ** 32;
    if (u)
      for (const h of t)
        h.currentChunk.offset += xt - rt;
    this.formatOptions.onMoof && this.writer.startTrackingWrites();
    const d = ma(i, t);
    if (this.boxWriter.writeBox(d), this.formatOptions.onMoof) {
      const { data: h, start: p } = this.writer.stopTrackingWrites();
      this.formatOptions.onMoof(h, p, c);
    }
    g(this.writer.getPos() === a), this.formatOptions.onMdat && this.writer.startTrackingWrites();
    const f = qr(u);
    f.size = l, this.boxWriter.writeBox(f), this.writer.seek(a + (u ? xt : rt));
    for (const h of t)
      for (const p of h.currentChunk.samples)
        this.writer.write(p.data), p.data = null;
    if (this.formatOptions.onMdat) {
      const { data: h, start: p } = this.writer.stopTrackingWrites();
      this.formatOptions.onMdat(h, p);
    }
    for (const h of t)
      h.finalizedChunks.push(h.currentChunk), this.finalizedChunks.push(h.currentChunk), h.currentChunk = null;
    e && await this.writer.flush();
  }
  async registerSampleFastStartReserve(e, t) {
    this.allTracksAreKnown() ? (this.mdat || await this.createFastStartReserveMdat(), await this.addSampleToTrack(e, t)) : e.sampleQueue.push(t);
  }
  async createFastStartReserveMdat() {
    g(this.writer), g(this.boxWriter), this.ensureOneEnabledTrack();
    const e = hr(this), i = this.boxWriter.measureBox(e) + this.computeSampleTableSizeUpperBound() + 4096;
    g(this.ftypSize !== null), this.writer.seek(this.ftypSize + i), this.formatOptions.onMdat && this.writer.startTrackingWrites(), this.mdat = qr(!0), this.boxWriter.writeBox(this.mdat);
    for (const n of this.trackDatas) {
      for (const s of n.sampleQueue)
        await this.addSampleToTrack(n, s);
      n.sampleQueue.length = 0;
    }
  }
  computeSampleTableSizeUpperBound() {
    g(this.fastStart === "reserve");
    let e = 0;
    for (const t of this.trackDatas) {
      const i = t.track.metadata.maximumPacketCount;
      g(i !== void 0), e += 8 * Math.ceil(2 / 3 * i), e += 4 * i, e += 8 * Math.ceil(2 / 3 * i), e += 12 * Math.ceil(2 / 3 * i), e += 4 * i, e += 8 * i;
    }
    return e;
  }
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async onTrackClose(e) {
    const t = await this.mutex.acquire(), i = this.trackDatas.find((n) => n.track === e);
    i && (i.closed = !0, i.type === "subtitle" && e.source._codec === "webvtt" && await this.processWebVTTCues(i, 1 / 0), this.processTimestamps(i)), this.allTracksAreKnown() && this.allTracksKnown.resolve(), this.isFragmented && await this.interleaveSamples(), t();
  }
  ensureOneEnabledTrack() {
    for (const e of ["video", "audio", "subtitle"]) {
      const t = this.trackDatas.filter((n) => n.type === e);
      if (t.length === 0)
        continue;
      if (!t.some((n) => n.track.metadata.disposition?.default !== !1)) {
        const n = t[0];
        n.track.metadata.disposition = {
          ...n.track.metadata.disposition,
          default: !0
        };
      }
    }
  }
  /** Internal function for external callers who want to full control fragment boundaries. */
  async forceFragmentFinalization() {
    g(this.isFragmented);
    const e = await this.mutex.acquire();
    try {
      for (const t of this.trackDatas)
        t.type === "subtitle" && t.track.source._codec === "webvtt" && await this.processWebVTTCues(t, 1 / 0), this.processTimestamps(t);
      await this.interleaveSamples(!0), await this.finalizeFragment();
    } finally {
      e();
    }
  }
  /** Finalizes the file, making it ready for use. Must be called after all video and audio chunks have been added. */
  async finalize() {
    const e = await this.mutex.acquire();
    this.allTracksKnown.resolve(), this.ensureOneEnabledTrack(), !this.mdat && this.fastStart === "reserve" && await this.createFastStartReserveMdat();
    for (const t of this.trackDatas)
      t.closed = !0, t.type === "subtitle" && t.track.source._codec === "webvtt" && await this.processWebVTTCues(t, 1 / 0), this.processTimestamps(t);
    if (this.isFragmented)
      await this.interleaveSamples(!0), await this.finalizeFragment(!1);
    else
      for (const t of this.trackDatas)
        if (await this.finalizeCurrentChunk(t), t.startTimestampOffset !== null)
          for (let i = 0; i < t.samples.length; i++) {
            const n = t.samples[i];
            n.timestamp -= t.startTimestampOffset, n.decodeTimestamp -= t.startTimestampOffset;
          }
    if (g(this.writer), g(this.boxWriter), this.fastStart === "in-memory") {
      this.mdat = qr(!1);
      let t;
      for (let n = 0; n < 2; n++) {
        const s = hr(this), a = this.boxWriter.measureBox(s);
        t = this.boxWriter.measureBox(this.mdat);
        let o = this.writer.getPos() + a + t;
        for (const c of this.finalizedChunks) {
          c.offset = o;
          for (const { data: l } of c.samples)
            g(l), o += l.byteLength, t += l.byteLength;
        }
        if (o < 2 ** 32)
          break;
        t >= 2 ** 32 && (this.mdat.largeSize = !0);
      }
      this.formatOptions.onMoov && this.writer.startTrackingWrites();
      const i = hr(this);
      if (this.boxWriter.writeBox(i), this.formatOptions.onMoov) {
        const { data: n, start: s } = this.writer.stopTrackingWrites();
        this.formatOptions.onMoov(n, s);
      }
      this.formatOptions.onMdat && this.writer.startTrackingWrites(), this.mdat.size = t, this.boxWriter.writeBox(this.mdat);
      for (const n of this.finalizedChunks)
        for (const s of n.samples)
          g(s.data), this.writer.write(s.data), s.data = null;
      if (this.formatOptions.onMdat) {
        const { data: n, start: s } = this.writer.stopTrackingWrites();
        this.formatOptions.onMdat(n, s);
      }
    } else if (this.isFragmented)
      if (this.isCmaf) {
        const t = this.segmentHeaderSize !== null ? this.writer.getPos() - this.segmentHeaderSize : 0;
        this.writer.seek(0), this.boxWriter.writeBox(da()), this.boxWriter.writeBox(fa(this, t));
      } else {
        const t = this.writer.getPos(), i = Af(this.trackDatas);
        this.boxWriter.writeBox(i);
        const n = this.writer.getPos() - t;
        this.writer.seek(this.writer.getPos() - 4), this.boxWriter.writeU32(n);
      }
    else {
      g(this.mdat);
      const t = this.boxWriter.offsets.get(this.mdat);
      g(t !== void 0);
      const i = this.writer.getPos() - t;
      if (this.mdat.size = i, this.mdat.largeSize = i >= 2 ** 32, this.boxWriter.patchBox(this.mdat), this.formatOptions.onMdat) {
        const { data: s, start: a } = this.writer.stopTrackingWrites();
        this.formatOptions.onMdat(s, a);
      }
      const n = hr(this);
      if (this.fastStart === "reserve") {
        g(this.ftypSize !== null), this.writer.seek(this.ftypSize), this.formatOptions.onMoov && this.writer.startTrackingWrites(), this.boxWriter.writeBox(n);
        const s = this.boxWriter.offsets.get(this.mdat) - this.writer.getPos();
        this.boxWriter.writeBox(Cd(s));
      } else
        this.formatOptions.onMoov && this.writer.startTrackingWrites(), this.boxWriter.writeBox(n);
      if (this.formatOptions.onMoov) {
        const { data: s, start: a } = this.writer.stopTrackingWrites();
        this.formatOptions.onMoov(s, a);
      }
    }
    e();
  }
}
class qf {
  constructor(e) {
    this.sourceSampleRate = null, this.sourceNumberOfChannels = null, this.startTime = null, this.bufferStartFrame = 0, this.maxWrittenFrame = null, this.targetSampleRate = e.targetSampleRate, this.targetNumberOfChannels = e.targetNumberOfChannels, this.onSample = e.onSample, this.bufferSizeInFrames = Math.floor(this.targetSampleRate * 5), this.bufferSizeInSamples = this.bufferSizeInFrames * this.targetNumberOfChannels, this.outputBuffer = new Float32Array(this.bufferSizeInSamples);
  }
  /**
   * Sets up the channel mixer to handle up/downmixing in the case where input and output channel counts don't match.
   */
  doChannelMixerSetup() {
    g(this.sourceNumberOfChannels !== null);
    const e = this.sourceNumberOfChannels, t = this.targetNumberOfChannels;
    e === 1 && t === 2 ? this.channelMixer = (i, n) => i[n * e] : e === 1 && t === 4 ? this.channelMixer = (i, n, s) => i[n * e] * +(s < 2) : e === 1 && t === 6 ? this.channelMixer = (i, n, s) => i[n * e] * +(s === 2) : e === 2 && t === 1 ? this.channelMixer = (i, n) => {
      const s = n * e;
      return 0.5 * (i[s] + i[s + 1]);
    } : e === 2 && t === 4 ? this.channelMixer = (i, n, s) => i[n * e + s] * +(s < 2) : e === 2 && t === 6 ? this.channelMixer = (i, n, s) => i[n * e + s] * +(s < 2) : e === 4 && t === 1 ? this.channelMixer = (i, n) => {
      const s = n * e;
      return 0.25 * (i[s] + i[s + 1] + i[s + 2] + i[s + 3]);
    } : e === 4 && t === 2 ? this.channelMixer = (i, n, s) => {
      const a = n * e;
      return 0.5 * (i[a + s] + i[a + s + 2]);
    } : e === 4 && t === 6 ? this.channelMixer = (i, n, s) => {
      const a = n * e;
      return s < 2 ? i[a + s] : s === 2 || s === 3 ? 0 : i[a + s - 2];
    } : e === 6 && t === 1 ? this.channelMixer = (i, n) => {
      const s = n * e;
      return Math.SQRT1_2 * (i[s] + i[s + 1]) + i[s + 2] + 0.5 * (i[s + 4] + i[s + 5]);
    } : e === 6 && t === 2 ? this.channelMixer = (i, n, s) => {
      const a = n * e;
      return i[a + s] + Math.SQRT1_2 * (i[a + 2] + i[a + s + 4]);
    } : e === 6 && t === 4 ? this.channelMixer = (i, n, s) => {
      const a = n * e;
      return s < 2 ? i[a + s] + Math.SQRT1_2 * i[a + 2] : i[a + s + 2];
    } : this.channelMixer = (i, n, s) => s < e ? i[n * e + s] : 0;
  }
  ensureTempBufferSize(e) {
    let t = this.tempSourceBuffer.length;
    for (; t < e; )
      t *= 2;
    if (t !== this.tempSourceBuffer.length) {
      const i = new Float32Array(t);
      i.set(this.tempSourceBuffer), this.tempSourceBuffer = i;
    }
  }
  async add(e) {
    this.sourceSampleRate === null && (this.sourceSampleRate = e.sampleRate, this.sourceNumberOfChannels = e.numberOfChannels, this.startTime = e.timestamp, this.tempSourceBuffer = new Float32Array(this.sourceSampleRate * this.sourceNumberOfChannels), this.doChannelMixerSetup()), g(this.startTime !== null);
    const t = e.numberOfFrames * e.numberOfChannels;
    this.ensureTempBufferSize(t);
    const i = e.allocationSize({ planeIndex: 0, format: "f32" }), n = new Float32Array(this.tempSourceBuffer.buffer, 0, i / 4);
    e.copyTo(n, { planeIndex: 0, format: "f32" });
    const s = e.timestamp - this.startTime, a = s + e.duration, o = Math.floor((s - 1 / this.sourceSampleRate) * this.targetSampleRate) + 1, c = Math.ceil(a * this.targetSampleRate);
    for (let l = o; l < c; l++) {
      if (l < this.bufferStartFrame)
        continue;
      for (; l >= this.bufferStartFrame + this.bufferSizeInFrames; )
        await this.finalizeCurrentBuffer(), this.bufferStartFrame += this.bufferSizeInFrames;
      const u = l - this.bufferStartFrame;
      g(u < this.bufferSizeInFrames);
      const h = (l / this.targetSampleRate - s) * this.sourceSampleRate, p = Math.floor(h), m = Math.ceil(h), y = h - p;
      for (let w = 0; w < this.targetNumberOfChannels; w++) {
        let b = 0, k = 0;
        p >= 0 && p < e.numberOfFrames && (b = this.channelMixer(n, p, w)), m >= 0 && m < e.numberOfFrames && (k = this.channelMixer(n, m, w));
        const A = b + y * (k - b), T = u * this.targetNumberOfChannels + w;
        this.outputBuffer[T] += A;
      }
      this.maxWrittenFrame === null ? this.maxWrittenFrame = u : this.maxWrittenFrame = Math.max(this.maxWrittenFrame, u);
    }
  }
  async finalizeCurrentBuffer() {
    if (this.maxWrittenFrame === null)
      return;
    g(this.startTime !== null);
    const e = (this.maxWrittenFrame + 1) * this.targetNumberOfChannels, t = new Float32Array(e);
    t.set(this.outputBuffer.subarray(0, e));
    const i = new fe({
      format: "f32",
      sampleRate: this.targetSampleRate,
      numberOfChannels: this.targetNumberOfChannels,
      timestamp: this.startTime + this.bufferStartFrame / this.targetSampleRate,
      data: t
    });
    await this.onSample(i), this.outputBuffer.fill(0), this.maxWrittenFrame = null;
  }
  finalize() {
    return this.finalizeCurrentBuffer();
  }
}
var Lf = function(r, e, t) {
  if (e != null) {
    if (typeof e != "object" && typeof e != "function") throw new TypeError("Object expected.");
    var i, n;
    if (t) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      i = e[Symbol.asyncDispose];
    }
    if (i === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      i = e[Symbol.dispose], t && (n = i);
    }
    if (typeof i != "function") throw new TypeError("Object not disposable.");
    n && (i = function() {
      try {
        n.call(this);
      } catch (s) {
        return Promise.reject(s);
      }
    }), r.stack.push({ value: e, dispose: i, async: t });
  } else t && r.stack.push({ async: !0 });
  return e;
}, Hf = /* @__PURE__ */ (function(r) {
  return function(e) {
    function t(a) {
      e.error = e.hasError ? new r(a, e.error, "An error was suppressed during disposal.") : a, e.hasError = !0;
    }
    var i, n = 0;
    function s() {
      for (; i = e.stack.pop(); )
        try {
          if (!i.async && n === 1) return n = 0, e.stack.push(i), Promise.resolve().then(s);
          if (i.dispose) {
            var a = i.dispose.call(i.value);
            if (i.async) return n |= 2, Promise.resolve(a).then(s, function(o) {
              return t(o), s();
            });
          } else n |= 1;
        } catch (o) {
          t(o);
        }
      if (n === 1) return e.hasError ? Promise.reject(e.error) : Promise.resolve();
      if (e.hasError) throw e.error;
    }
    return s();
  };
})(typeof SuppressedError == "function" ? SuppressedError : function(r, e, t) {
  var i = new Error(t);
  return i.name = "SuppressedError", i.error = r, i.suppressed = e, i;
});
class ts {
  constructor() {
    this._connectedTrack = null, this._closingPromise = null, this._closed = !1;
  }
  /** @internal */
  _ensureValidAdd() {
    if (!this._connectedTrack)
      throw new Error("Source is not connected to an output track.");
    if (this._connectedTrack.output.state === "canceled")
      throw new Error("Output has been canceled.");
    if (this._connectedTrack.output.state === "finalizing" || this._connectedTrack.output.state === "finalized")
      throw new Error("Output has been finalized.");
    if (this._connectedTrack.output.state === "pending")
      throw new Error("Output has not started.");
    if (this._closed)
      throw new Error("Source is closed.");
  }
  /** @internal */
  async _start() {
  }
  /** @internal */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async _flushAndClose(e) {
  }
  /**
   * Closes this source. This prevents future samples from being added and signals to the output file that no further
   * samples will come in for this track. Calling `.close()` is optional but recommended after adding the
   * last sample - for improved performance and reduced memory usage.
   */
  close() {
    if (this._closingPromise)
      return;
    const e = this._connectedTrack;
    if (!e)
      throw new Error("Cannot call close without connecting the source to an output track.");
    if (e.output.state === "pending")
      throw new Error("Cannot call close before output has been started.");
    this._closingPromise = (async () => {
      await this._flushAndClose(!1), this._closed = !0, !(e.output.state === "finalizing" || e.output.state === "finalized") && e.output._muxer.onTrackClose(e);
    })();
  }
  /** @internal */
  async _flushOrWaitForOngoingClose(e) {
    return this._closingPromise ??= (async () => {
      await this._flushAndClose(e), this._closed = !0;
    })();
  }
}
class rs extends ts {
  /** Internal constructor. */
  constructor(e) {
    if (super(), this._connectedTrack = null, !Ce.includes(e))
      throw new TypeError(`Invalid video codec '${e}'. Must be one of: ${Ce.join(", ")}.`);
    this._codec = e;
  }
}
const _n = (r, e) => {
  if (r.metadata.hasOnlyKeyPackets && e.type !== "key")
    throw new Error("Cannot add non-key packets to a hasOnlyKeyPackets video track.");
};
class jf extends rs {
  /** Creates a new {@link EncodedVideoPacketSource} whose packets are encoded using `codec`. */
  constructor(e) {
    super(e);
  }
  /**
   * Adds an encoded packet to the output video track. Packets must be added in *decode order*, while a packet's
   * timestamp must be its *presentation timestamp*. B-frames are handled automatically.
   *
   * @param meta - Additional metadata from the encoder. You should pass this for the first call, including a valid
   * decoder config.
   *
   * @returns A Promise that resolves once the output is ready to receive more samples. You should await this Promise
   * to respect writer and encoder backpressure.
   */
  add(e, t) {
    if (!(e instanceof Y))
      throw new TypeError("packet must be an EncodedPacket.");
    if (e.isMetadataOnly)
      throw new TypeError("Metadata-only packets cannot be added.");
    if (t !== void 0 && (!t || typeof t != "object"))
      throw new TypeError("meta, when provided, must be an object.");
    return this._ensureValidAdd(), _n(this._connectedTrack, e), this._connectedTrack.output._muxer.addEncodedVideoPacket(this._connectedTrack, e, t);
  }
}
class Kf {
  setError(e) {
    this.errorSet || (this.error = e, this.errorSet = !0);
  }
  constructor(e, t) {
    this.source = e, this.encodingConfig = t, this.ensureEncoderPromise = null, this.encoderInitialized = !1, this.encoder = null, this.muxer = null, this.lastMultipleOfKeyFrameInterval = -1, this.emittedEncoderPackets = 0, this.codedWidth = null, this.codedHeight = null, this.outputWidth = null, this.outputHeight = null, this.frameRateLastSample = null, this.frameRateLastTimestamp = null, this.frameRateLastEndTimestamp = null, this.preciseTimings = [], this.customEncoder = null, this.customEncoderCallSerializer = new gi(), this.customEncoderQueueSize = 0, this.defaultEncodeOptions = {}, this.alphaEncoder = null, this.splitter = null, this.splitterCreationFailed = !1, this.alphaFrameQueue = [], this.error = null, this.errorSet = !1, this.lastMuxerPromise = Promise.resolve(), this.closed = !1;
  }
  async add(e, t, i) {
    const n = e;
    try {
      this.checkForEncoderError(), this.source._ensureValidAdd();
      const s = this.encodingConfig, a = s.sizeChangeBehavior ?? "deny";
      let o = !1;
      if (this.codedWidth !== null && this.codedHeight !== null) {
        if ((e.codedWidth !== this.codedWidth || e.codedHeight !== this.codedHeight) && (o = !0, a === "deny"))
          throw new Error(`Video sample size must remain constant. Expected ${this.codedWidth}x${this.codedHeight}, got ${e.codedWidth}x${e.codedHeight}. To allow the sample size to change over time, set \`sizeChangeBehavior\` to a value other than 'deny' in the encoding options.`);
      } else
        this.codedWidth = e.codedWidth, this.codedHeight = e.codedHeight;
      if (s.transform?.width !== void 0 || s.transform?.height !== void 0 || s.transform?.rotate !== void 0 || s.transform?.crop !== void 0 || s.transform?.force === !0 || o && a !== "passThrough") {
        let d = s.transform?.width, f = s.transform?.height, h = s.transform?.fit ?? "fill";
        o && a !== "passThrough" && (g(this.outputWidth), g(this.outputHeight), g(a !== "deny"), d = this.outputWidth, f = this.outputHeight, h = a);
        const p = await e.transform({
          width: d,
          height: f,
          roundDimensionsTo: 2,
          crop: s.transform?.crop,
          rotate: s.transform?.rotate,
          fit: h,
          alpha: s.alpha
        });
        (this.outputWidth === null || this.outputHeight === null) && (this.outputWidth = p.displayWidth, this.outputHeight = p.displayHeight), t && e.close(), e = p, t = !0;
      } else
        (this.outputWidth === null || this.outputHeight === null) && (this.outputWidth = e.codedWidth, this.outputHeight = e.codedHeight);
      const u = s.transform?.frameRate;
      if (u !== void 0) {
        const d = e.timestamp + e.duration, f = ls(e.timestamp, u);
        if (this.frameRateLastSample !== null)
          if (f <= this.frameRateLastTimestamp) {
            this.frameRateLastSample.close(), this.frameRateLastSample = e.clone(), this.frameRateLastEndTimestamp = d;
            return;
          } else
            await this.padFrameRate(f, i);
        e === n && (e = e.clone(), t = !0), e.setTimestamp(f), e.setDuration(1 / u), this.frameRateLastSample?.close(), this.frameRateLastSample = e.clone(), this.frameRateLastTimestamp = f, this.frameRateLastEndTimestamp = d;
      }
      await this.processAndEncode(e, i);
    } finally {
      t && e.close();
    }
  }
  /**
   * Runs the process function (if any) and encodes the resulting samples.
   */
  async processAndEncode(e, t) {
    const i = this.encodingConfig;
    let n;
    if (i.transform?.process) {
      let s = i.transform.process(e);
      if (s instanceof Promise && (s = await s), s === null)
        return;
      Array.isArray(s) || (s = [s]);
      const a = [];
      try {
        for (const o of s)
          o instanceof me ? a.push(o) : typeof VideoFrame < "u" && o instanceof VideoFrame ? a.push(new me(o)) : a.push(new me(o, {
            timestamp: e.timestamp,
            duration: e.duration
          }));
      } catch (o) {
        for (const c of a)
          c !== e && c.close();
        for (const c of s)
          (c instanceof me && c !== e || typeof VideoFrame < "u" && c instanceof VideoFrame) && c.close();
        throw o;
      }
      n = a;
    } else
      n = [e];
    try {
      for (const s of n) {
        if (this.encoderInitialized || (this.ensureEncoderPromise || this.ensureEncoder(s), this.encoderInitialized || await this.ensureEncoderPromise), g(this.encoderInitialized), this.closed)
          break;
        const a = this.encodingConfig.keyFrameInterval ?? 2, o = Math.floor(s.timestamp / a), c = {
          ...this.defaultEncodeOptions,
          ...s.encodeOptions,
          ...t
        }, l = {
          ...c,
          keyFrame: c.keyFrame !== void 0 ? c.keyFrame : a === 0 || o !== this.lastMultipleOfKeyFrameInterval
        };
        if (this.lastMultipleOfKeyFrameInterval = o, this.encodingConfig.onEncodedSample?.(s), this.customEncoder) {
          this.customEncoderQueueSize++;
          const u = s.clone(), d = this.customEncoderCallSerializer.call(() => this.customEncoder.encode(u, l)).catch((f) => this.setError(f)).finally(() => {
            this.customEncoderQueueSize--, u.close();
          });
          this.customEncoderQueueSize >= 4 && await d;
        } else {
          g(this.encoder);
          const u = s.toVideoFrame(), d = G(this.preciseTimings, u.timestamp, (h) => h.microsecondTimestamp), f = d !== -1 ? this.preciseTimings[d] : null;
          if (f && f.microsecondTimestamp === u.timestamp ? (f.timestamp !== s.timestamp && (f.timestampIsValid = !1), f.duration !== s.duration && (f.durationIsValid = !1)) : (this.preciseTimings.splice(d + 1, 0, {
            microsecondTimestamp: u.timestamp,
            timestamp: s.timestamp,
            duration: s.duration,
            timestampIsValid: !0,
            durationIsValid: !0
          }), this.preciseTimings.length > 128 && this.preciseTimings.shift()), this.alphaEncoder)
            if (!!u.format && !u.format.includes("A") || this.splitterCreationFailed) {
              this.alphaFrameQueue.push(null);
              try {
                this.encoder.encode(u, l);
              } finally {
                u.close();
              }
            } else {
              this.splitter || (this.splitter = new Qf());
              const { colorFrame: p, alphaFrame: m } = await this.splitter.split(u);
              this.alphaFrameQueue.push(m);
              try {
                this.encoder.encode(p, l);
              } finally {
                p.close();
              }
            }
          else
            try {
              this.encoder.encode(u, l);
            } finally {
              u.close();
            }
          this.encoder.encodeQueueSize >= 4 && await new Promise((h) => this.encoder.addEventListener("dequeue", h, { once: !0 }));
        }
        await this.lastMuxerPromise;
      }
    } finally {
      for (const s of n)
        s !== e && s.close();
    }
  }
  /** Repeats the last frame rate sample to fill the gap up to the given timestamp. */
  async padFrameRate(e, t) {
    const i = this.encodingConfig.transform.frameRate;
    g(this.frameRateLastSample);
    const n = Math.round((e - this.frameRateLastTimestamp) * i);
    for (let s = 1; s < n; s++) {
      const a = { stack: [], error: void 0, hasError: !1 };
      try {
        const o = Lf(a, this.frameRateLastSample.clone(), !1);
        o.setTimestamp(this.frameRateLastTimestamp + s / i), o.setDuration(1 / i), await this.processAndEncode(o, t);
      } catch (o) {
        a.error = o, a.hasError = !0;
      } finally {
        Hf(a);
      }
    }
  }
  ensureEncoder(e) {
    this.ensureEncoderPromise = (async () => {
      const t = Zt(this.encodingConfig.quality, this.encodingConfig.bitrate);
      g(t !== void 0);
      const i = Bo({
        ...this.encodingConfig,
        quality: t,
        width: e.codedWidth,
        height: e.codedHeight,
        squarePixelWidth: e.squarePixelWidth,
        squarePixelHeight: e.squarePixelHeight,
        framerate: this.source._connectedTrack?.metadata.frameRate
      });
      let n = null, s;
      for (const o of i) {
        const c = o.config;
        if (this.encodingConfig.onEncoderConfig?.(c), s = hi.find((u) => u.supports(this.encodingConfig.codec, c)), s) {
          n = o;
          break;
        }
        if (typeof VideoEncoder > "u")
          continue;
        if (c.alpha = "discard", this.encodingConfig.alpha === "keep" && (c.latencyMode = "quality"), (c.width % 2 === 1 || c.height % 2 === 1) && (this.encodingConfig.codec === "avc" || this.encodingConfig.codec === "hevc"))
          throw new Error(`The dimensions ${c.width}x${c.height} are not supported for codec '${this.encodingConfig.codec}'; both width and height must be even numbers. Make sure to round your dimensions to the nearest even number.`);
        try {
          if ((await VideoEncoder.isConfigSupported(c)).supported) {
            n = o;
            break;
          }
        } catch {
        }
      }
      if (!n) {
        if (typeof VideoEncoder > "u")
          throw new Error(yi("VideoEncoder"));
        const o = i[0].config, c = i.map(({ config: l, quantizer: u }) => u !== null ? `quantizer ${u}` : `${l.bitrate} bps`);
        throw new Error(`This specific encoder configuration (${o.codec}, ${c.join(" / ")}, ${o.width}x${o.height}, hardware acceleration: ${o.hardwareAcceleration ?? "no-preference"}) is not supported in this environment. Consider using another codec or changing your video parameters.`);
      }
      const a = n.config;
      if (n.quantizer !== null && (this.defaultEncodeOptions = Mo(this.encodingConfig.codec, n.quantizer)), s)
        this.customEncoder = new s(), this.customEncoder.codec = this.encodingConfig.codec, this.customEncoder.config = a, this.customEncoder.onPacket = (o, c) => {
          if (!(o instanceof Y))
            throw new TypeError("The first argument passed to onPacket must be an EncodedPacket.");
          if (c !== void 0 && (!c || typeof c != "object"))
            throw new TypeError("The second argument passed to onPacket must be an object or undefined.");
          _n(this.source._connectedTrack, o), this.encodingConfig.onEncodedPacket?.(o, c), this.lastMuxerPromise = this.muxer.addEncodedVideoPacket(this.source._connectedTrack, o, c).catch((l) => {
            this.setError(l);
          });
        }, this.customEncoder.onError = (o) => {
          this.setError(o);
        }, await this.customEncoder.init();
      else {
        const o = [], c = [];
        let l = 0, u = 0;
        const d = (h, p, m) => {
          const y = {};
          if (p) {
            const T = new Uint8Array(p.byteLength);
            p.copyTo(T), y.alpha = T;
          }
          let w = Y.fromEncodedChunk(h, y);
          const b = G(this.preciseTimings, h.timestamp, (T) => T.microsecondTimestamp), k = b !== -1 ? this.preciseTimings[b] : null;
          let A = null;
          this.emittedEncoderPackets === 0 && w.type === "delta" && m?.decoderConfig && (A = xi(this.encodingConfig.codec, m.decoderConfig, w.data)), (k && k.microsecondTimestamp === h.timestamp || A !== null) && (w = w.clone({
            timestamp: k?.timestampIsValid ? k.timestamp : void 0,
            duration: k?.durationIsValid ? k.duration : void 0,
            type: A ?? void 0
          })), _n(this.source._connectedTrack, w), this.encodingConfig.onEncodedPacket?.(w, m), this.lastMuxerPromise = this.muxer.addEncodedVideoPacket(this.source._connectedTrack, w, m).catch((T) => {
            this.setError(T);
          }), this.emittedEncoderPackets++;
        }, f = new Error("Encoding error").stack;
        if (this.encoder = new VideoEncoder({
          output: (h, p) => {
            if (!this.alphaEncoder) {
              d(h, null, p);
              return;
            }
            const m = this.alphaFrameQueue.shift();
            g(m !== void 0), m ? (this.alphaEncoder.encode(m, {
              ...this.defaultEncodeOptions,
              // Crucial: The alpha frame is forced to be a key frame whenever the color frame
              // also is. Without this, playback can glitch and even crash in some browsers.
              // This is the reason why the two encoders are wired in series and not in parallel.
              keyFrame: h.type === "key"
            }), u++, m.close(), o.push({ chunk: h, meta: p })) : u === 0 ? d(h, null, p) : (c.push(l + u), o.push({ chunk: h, meta: p }));
          },
          error: (h) => {
            h.stack = f, this.setError(h);
          }
        }), this.encoder.configure(a), this.encodingConfig.alpha === "keep") {
          const h = new Error("Encoding error").stack;
          this.alphaEncoder = new VideoEncoder({
            // We ignore the alpha chunk's metadata
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            output: (p, m) => {
              u--;
              const y = o.shift();
              for (g(y !== void 0), d(y.chunk, p, y.meta), l++; c.length > 0 && c[0] === l; ) {
                c.shift();
                const w = o.shift();
                g(w !== void 0), d(w.chunk, null, w.meta);
              }
            },
            error: (p) => {
              p.stack = h, this.setError(p);
            }
          }), this.alphaEncoder.configure(a);
        }
      }
      g(this.source._connectedTrack), this.muxer = this.source._connectedTrack.output._muxer, this.encoderInitialized = !0;
    })();
  }
  async flushAndClose(e) {
    try {
      if (!e && (this.checkForEncoderError(), this.frameRateLastSample)) {
        const t = this.encodingConfig.transform.frameRate, i = ls(this.frameRateLastEndTimestamp, t);
        await this.padFrameRate(i);
      }
      this.closed = !0, e || (this.customEncoder ? this.customEncoderCallSerializer.call(() => this.customEncoder.flush()) : this.encoder && (await this.encoder.flush(), await this.alphaEncoder?.flush(), await Pa(25)));
    } finally {
      this.closed = !0, this.frameRateLastSample?.close(), this.frameRateLastSample = null, this.customEncoder ? await this.customEncoderCallSerializer.call(() => this.customEncoder.close()).catch((t) => this.setError(t)) : this.encoder && (this.encoder.state !== "closed" && this.encoder.close(), this.alphaEncoder && this.alphaEncoder.state !== "closed" && this.alphaEncoder.close(), this.alphaFrameQueue.forEach((t) => t?.close()), this.alphaFrameQueue.length = 0, this.splitter?.close());
    }
    e || this.checkForEncoderError();
  }
  getQueueSize() {
    return this.customEncoder ? this.customEncoderQueueSize : this.encoder?.encodeQueueSize ?? 0;
  }
  checkForEncoderError() {
    if (this.errorSet)
      throw this.error;
  }
}
let tn = null;
class Qf {
  constructor() {
    this.worker = null, this.pendingRequests = /* @__PURE__ */ new Map(), this.nextRequestId = 0;
  }
  split(e) {
    if (!this.worker) {
      if (!tn) {
        const n = new Blob([`(${Gf.toString()})()`], { type: "application/javascript" });
        tn = URL.createObjectURL(n);
      }
      this.worker = new Worker(tn), this.worker.addEventListener("message", (n) => {
        const s = n.data, a = this.pendingRequests.get(s.id);
        a && (this.pendingRequests.delete(s.id), "error" in s ? a.reject(new Error(s.error)) : a.resolve({ colorFrame: s.colorFrame, alphaFrame: s.alphaFrame }));
      }), this.worker.addEventListener("error", (n) => {
        const s = new Error(n.message || "Color/alpha splitter worker error.");
        for (const a of this.pendingRequests.values())
          a.reject(s);
        this.pendingRequests.clear();
      });
    }
    const t = this.nextRequestId++, i = ne();
    return this.pendingRequests.set(t, i), this.worker.postMessage({ id: t, sourceFrame: e }, { transfer: [e] }), i.promise;
  }
  close() {
    this.worker?.terminate(), this.worker = null;
    const e = new Error("Color/alpha splitter closed.");
    for (const t of this.pendingRequests.values())
      t.reject(e);
    this.pendingRequests.clear();
  }
}
const Gf = () => {
  let r = null, e = Promise.resolve();
  self.addEventListener("message", (s) => {
    const { id: a, sourceFrame: o } = s.data;
    e = e.then(async () => {
      try {
        const { colorFrame: c, alphaFrame: l } = await t(o);
        self.postMessage({ id: a, colorFrame: c, alphaFrame: l }, { transfer: [c, l] });
      } catch (c) {
        self.postMessage({ id: a, error: c.message });
      } finally {
        o.close();
      }
    });
  });
  const t = async (s) => {
    const a = s.format;
    if (!a)
      throw new Error("CPU color/alpha splitting requires a known VideoFrame format.");
    const o = s.allocationSize();
    if ((!r || r.byteLength !== o) && (r = new Uint8Array(o)), await s.copyTo(r), a === "RGBA" || a === "BGRA")
      return i(r, a, s);
    if (a === "I420A" || a === "I420AP10" || a === "I420AP12" || a === "I422A" || a === "I422AP10" || a === "I422AP12" || a === "I444A" || a === "I444AP10" || a === "I444AP12")
      return n(r, a, s);
    throw new Error(`CPU color/alpha splitting does not support format '${a}'.`);
  }, i = (s, a, o) => {
    const c = o.visibleRect?.width ?? o.codedWidth, l = o.visibleRect?.height ?? o.codedHeight, u = c * l, d = Math.ceil(c / 2), f = Math.ceil(l / 2), h = u + d * f * 2, p = new Uint8Array(h);
    for (let b = 0, k = 3; b < u; b++, k += 4)
      p[b] = s[k];
    p.fill(128, u);
    const m = new VideoFrame(s, {
      format: a === "RGBA" ? "RGBX" : "BGRX",
      codedWidth: c,
      codedHeight: l,
      timestamp: o.timestamp,
      duration: o.duration ?? void 0
      // No transfer!
    }), y = {
      format: "I420",
      codedWidth: c,
      codedHeight: l,
      timestamp: o.timestamp,
      duration: o.duration ?? void 0,
      transfer: [p.buffer]
    }, w = new VideoFrame(p, y);
    return { colorFrame: m, alphaFrame: w };
  }, n = (s, a, o) => {
    const c = o.visibleRect?.width ?? o.codedWidth, l = o.visibleRect?.height ?? o.codedHeight, u = a.includes("P10"), d = a.includes("P12"), f = u || d ? 2 : 1;
    let h, p;
    a.startsWith("I420") ? (h = Math.ceil(c / 2), p = Math.ceil(l / 2)) : a.startsWith("I422") ? (h = Math.ceil(c / 2), p = l) : (h = c, p = l);
    const m = c * l, y = h * p, w = m * f, b = y * f, k = m * f, A = w + b * 2, T = a.replace("A", ""), x = Math.ceil(c / 2), C = Math.ceil(l / 2), P = x * C, S = P * f, E = k + 2 * S, I = new Uint8Array(E), _ = A;
    I.set(s.subarray(_, _ + k), 0);
    const F = k, O = u ? 512 : d ? 2048 : 128;
    f === 1 ? I.fill(O, F) : new Uint16Array(I.buffer, F, 2 * P).fill(O);
    const D = u ? "I420P10" : d ? "I420P12" : "I420", z = new VideoFrame(s.subarray(0, A), {
      format: T,
      codedWidth: c,
      codedHeight: l,
      timestamp: o.timestamp,
      duration: o.duration ?? void 0
    }), j = {
      format: D,
      codedWidth: c,
      codedHeight: l,
      timestamp: o.timestamp,
      duration: o.duration ?? void 0,
      transfer: [I.buffer]
    }, Z = new VideoFrame(I, j);
    return { colorFrame: z, alphaFrame: Z };
  };
};
class ga extends rs {
  /**
   * Creates a new {@link VideoSampleSource} whose samples are encoded according to the specified
   * {@link VideoEncodingConfig}.
   */
  constructor(e) {
    Ku(e), super(e.codec), this._encoder = new Kf(this, e);
  }
  /**
   * Encodes a video sample (frame) and then adds it to the output.
   *
   * @returns A Promise that resolves once the output is ready to receive more samples. You should await this Promise
   * to respect writer and encoder backpressure.
   */
  add(e, t) {
    if (!(e instanceof me))
      throw new TypeError("videoSample must be a VideoSample.");
    return this._encoder.add(e, !1, t);
  }
  /** @internal */
  _flushAndClose(e) {
    return this._encoder.flushAndClose(e);
  }
}
class is extends ts {
  /** Internal constructor. */
  constructor(e) {
    if (super(), this._connectedTrack = null, !Ee.includes(e))
      throw new TypeError(`Invalid audio codec '${e}'. Must be one of: ${Ee.join(", ")}.`);
    this._codec = e;
  }
}
class Xf extends is {
  /** Creates a new {@link EncodedAudioPacketSource} whose packets are encoded using `codec`. */
  constructor(e) {
    super(e);
  }
  /**
   * Adds an encoded packet to the output audio track. Packets must be added in *decode order*.
   *
   * @param meta - Additional metadata from the encoder. You should pass this for the first call, including a valid
   * decoder config.
   *
   * @returns A Promise that resolves once the output is ready to receive more samples. You should await this Promise
   * to respect writer and encoder backpressure.
   */
  add(e, t) {
    if (!(e instanceof Y))
      throw new TypeError("packet must be an EncodedPacket.");
    if (e.isMetadataOnly)
      throw new TypeError("Metadata-only packets cannot be added.");
    if (t !== void 0 && (!t || typeof t != "object"))
      throw new TypeError("meta, when provided, must be an object.");
    return this._ensureValidAdd(), this._connectedTrack.output._muxer.addEncodedAudioPacket(this._connectedTrack, e, t);
  }
}
class $f {
  setError(e) {
    this.errorSet || (this.error = e, this.errorSet = !0);
  }
  constructor(e, t) {
    this.source = e, this.encodingConfig = t, this.ensureEncoderPromise = null, this.encoderInitialized = !1, this.encoder = null, this.muxer = null, this.lastNumberOfChannels = null, this.lastSampleRate = null, this.isPcmEncoder = !1, this.outputSampleSize = null, this.writeOutputValue = null, this.customEncoder = null, this.customEncoderCallSerializer = new gi(), this.customEncoderQueueSize = 0, this.lastEndSampleIndex = null, this.resampler = null, this.error = null, this.errorSet = !1, this.lastMuxerPromise = Promise.resolve(), this.closed = !1;
  }
  async add(e, t) {
    try {
      if (this.checkForEncoderError(), this.source._ensureValidAdd(), this.lastNumberOfChannels !== null && this.lastSampleRate !== null) {
        if (e.numberOfChannels !== this.lastNumberOfChannels || e.sampleRate !== this.lastSampleRate)
          throw new Error(`Audio parameters must remain constant. Expected ${this.lastNumberOfChannels} channels at ${this.lastSampleRate} Hz, got ${e.numberOfChannels} channels at ${e.sampleRate} Hz.`);
      } else
        this.lastNumberOfChannels = e.numberOfChannels, this.lastSampleRate = e.sampleRate;
      const i = this.encodingConfig;
      i.transform?.numberOfChannels !== void 0 || i.transform?.sampleRate !== void 0 ? (this.resampler || (this.resampler = new qf({
        targetNumberOfChannels: i.transform.numberOfChannels ?? e.numberOfChannels,
        targetSampleRate: i.transform.sampleRate ?? e.sampleRate,
        onSample: async (s) => {
          await this.processAndEncode(s, !0);
        }
      })), await this.resampler.add(e)) : await this.processAndEncode(e, t);
    } finally {
      t && e.close();
    }
  }
  /**
   * Runs the process function (if any) and encodes the resulting samples.
   */
  async processAndEncode(e, t) {
    const i = this.encodingConfig;
    if (i.transform?.sampleFormat !== void 0 && Lu(e.format) !== i.transform.sampleFormat) {
      const n = ju(e, i.transform.sampleFormat);
      t && e.close(), e = n, t = !0;
    }
    if (i.transform?.process)
      try {
        let n = i.transform.process(e);
        if (n instanceof Promise && (n = await n), n === null)
          return;
        Array.isArray(n) || (n = [n]);
        try {
          for (const s of n)
            if (!(s instanceof fe))
              throw new TypeError("The audio process function must return an AudioSample, null, or an array of AudioSamples.");
          for (const s of n)
            await this.encodeSample(s, !0);
        } finally {
          for (const s of n)
            s instanceof fe && s.close();
        }
      } finally {
        t && e.close();
      }
    else
      await this.encodeSample(e, t);
  }
  /**
   * Encodes a single audio sample, handling encoder init, gap padding, and backpressure.
   */
  async encodeSample(e, t) {
    try {
      if (this.encoderInitialized || (this.ensureEncoderPromise || this.ensureEncoder(e), this.encoderInitialized || await this.ensureEncoderPromise), g(this.encoderInitialized), this.closed)
        return;
      {
        const i = Math.round(e.timestamp * e.sampleRate), n = Math.round((e.timestamp + e.duration) * e.sampleRate);
        if (this.lastEndSampleIndex === null)
          this.lastEndSampleIndex = n;
        else {
          const s = i - this.lastEndSampleIndex;
          if (s >= 64) {
            const a = new fe({
              data: new Float32Array(s * e.numberOfChannels),
              format: "f32-planar",
              sampleRate: e.sampleRate,
              numberOfChannels: e.numberOfChannels,
              numberOfFrames: s,
              timestamp: this.lastEndSampleIndex / e.sampleRate
            });
            await this.encodeSample(a, !0);
          }
          this.lastEndSampleIndex += e.numberOfFrames;
        }
      }
      if (this.encodingConfig.onEncodedSample?.(e), this.customEncoder) {
        this.customEncoderQueueSize++;
        const i = e.clone(), n = this.customEncoderCallSerializer.call(() => this.customEncoder.encode(i)).catch((s) => this.setError(s)).finally(() => {
          this.customEncoderQueueSize--, i.close();
        });
        this.customEncoderQueueSize >= 4 && await n, await this.lastMuxerPromise;
      } else if (this.isPcmEncoder)
        await this.doPcmEncoding(e, t);
      else {
        g(this.encoder);
        const i = e.toAudioData();
        this.encoder.encode(i), i.close(), t && e.close(), this.encoder.encodeQueueSize >= 4 && await new Promise((n) => this.encoder.addEventListener("dequeue", n, { once: !0 })), await this.lastMuxerPromise;
      }
    } finally {
      t && e.close();
    }
  }
  async doPcmEncoding(e, t) {
    g(this.outputSampleSize), g(this.writeOutputValue);
    const { numberOfChannels: i, numberOfFrames: n, sampleRate: s, timestamp: a } = e, o = 2048, c = [];
    for (let f = 0; f < n; f += o) {
      const h = Math.min(o, e.numberOfFrames - f), p = h * i * this.outputSampleSize, m = new ArrayBuffer(p), y = new DataView(m);
      c.push({ frameCount: h, view: y });
    }
    const l = e.allocationSize({ planeIndex: 0, format: "f32-planar" }), u = new Float32Array(l / Float32Array.BYTES_PER_ELEMENT);
    for (let f = 0; f < i; f++) {
      e.copyTo(u, { planeIndex: f, format: "f32-planar" });
      for (let h = 0; h < c.length; h++) {
        const { frameCount: p, view: m } = c[h];
        for (let y = 0; y < p; y++)
          this.writeOutputValue(m, (y * i + f) * this.outputSampleSize, u[h * o + y]);
      }
    }
    t && e.close();
    const d = {
      decoderConfig: {
        codec: this.encodingConfig.codec,
        numberOfChannels: i,
        sampleRate: s
      }
    };
    for (let f = 0; f < c.length; f++) {
      const { frameCount: h, view: p } = c[f], m = p.buffer, y = f * o, w = new Y(new Uint8Array(m), "key", a + y / s, h / s);
      this.encodingConfig.onEncodedPacket?.(w, d), await this.muxer.addEncodedAudioPacket(this.source._connectedTrack, w, d);
    }
  }
  ensureEncoder(e) {
    this.ensureEncoderPromise = (async () => {
      const { numberOfChannels: t, sampleRate: i } = e, n = Zt(this.encodingConfig.quality, this.encodingConfig.bitrate), s = Fo({
        numberOfChannels: t,
        sampleRate: i,
        ...this.encodingConfig,
        quality: n
      });
      this.encodingConfig.onEncoderConfig?.(s);
      const a = mi.find((o) => o.supports(this.encodingConfig.codec, s));
      if (a)
        this.customEncoder = new a(), this.customEncoder.codec = this.encodingConfig.codec, this.customEncoder.config = s, this.customEncoder.onPacket = (o, c) => {
          if (!(o instanceof Y))
            throw new TypeError("The first argument passed to onPacket must be an EncodedPacket.");
          if (c !== void 0 && (!c || typeof c != "object"))
            throw new TypeError("The second argument passed to onPacket must be an object or undefined.");
          this.encodingConfig.onEncodedPacket?.(o, c), this.lastMuxerPromise = this.muxer.addEncodedAudioPacket(this.source._connectedTrack, o, c).catch((l) => {
            this.setError(l);
          });
        }, this.customEncoder.onError = (o) => {
          this.setError(o);
        }, await this.customEncoder.init();
      else if (ye.includes(this.encodingConfig.codec))
        this.initPcmEncoder();
      else {
        if (typeof AudioEncoder > "u")
          throw new Error(yi("AudioEncoder"));
        let o;
        try {
          o = (await AudioEncoder.isConfigSupported(s)).supported ?? !1;
        } catch {
          o = !1;
        }
        if (!o)
          throw new Error(`This specific encoder configuration (${s.codec}, ${s.bitrate} bps, ${s.numberOfChannels} channels, ${s.sampleRate} Hz) is not supported in this environment. Consider using another codec or changing your audio parameters.`);
        const c = new Error("Encoding error").stack;
        this.encoder = new AudioEncoder({
          output: (l, u) => {
            if (this.encodingConfig.codec === "aac" && u?.decoderConfig) {
              let f = !1;
              if (!u.decoderConfig.description || u.decoderConfig.description.byteLength < 2 ? f = !0 : f = Dn(be(u.decoderConfig.description)).objectType === 0, f) {
                const h = Number(te(s.codec.split(".")));
                u.decoderConfig.description = Ea({
                  objectType: h,
                  numberOfChannels: u.decoderConfig.numberOfChannels,
                  sampleRate: u.decoderConfig.sampleRate
                });
              }
            }
            let d = Y.fromEncodedChunk(l);
            d = d.clone({
              timestamp: ri(d.timestamp, s.sampleRate),
              duration: l.duration != null ? ri(d.duration, s.sampleRate) : void 0
            }), this.encodingConfig.onEncodedPacket?.(d, u), this.lastMuxerPromise = this.muxer.addEncodedAudioPacket(this.source._connectedTrack, d, u).catch((f) => {
              this.setError(f);
            });
          },
          error: (l) => {
            l.stack = c, this.setError(l);
          }
        }), this.encoder.configure(s);
      }
      g(this.source._connectedTrack), this.muxer = this.source._connectedTrack.output._muxer, this.encoderInitialized = !0;
    })();
  }
  initPcmEncoder() {
    this.isPcmEncoder = !0;
    const e = this.encodingConfig.codec, { dataType: t, sampleSize: i, littleEndian: n } = at(e);
    switch (this.outputSampleSize = i, i) {
      case 1:
        t === "unsigned" ? this.writeOutputValue = (s, a, o) => s.setUint8(a, ae((o + 1) * 127.5, 0, 255)) : t === "signed" ? this.writeOutputValue = (s, a, o) => {
          s.setInt8(a, ae(Math.round(o * 128), -128, 127));
        } : t === "ulaw" ? this.writeOutputValue = (s, a, o) => {
          const c = ae(Math.floor(o * 32767), -32768, 32767);
          s.setUint8(a, td(c));
        } : t === "alaw" ? this.writeOutputValue = (s, a, o) => {
          const c = ae(Math.floor(o * 32767), -32768, 32767);
          s.setUint8(a, id(c));
        } : g(!1);
        break;
      case 2:
        t === "unsigned" ? this.writeOutputValue = (s, a, o) => s.setUint16(a, ae((o + 1) * 32767.5, 0, 65535), n) : t === "signed" ? this.writeOutputValue = (s, a, o) => s.setInt16(a, ae(Math.round(o * 32767), -32768, 32767), n) : g(!1);
        break;
      case 3:
        t === "unsigned" ? this.writeOutputValue = (s, a, o) => Fn(s, a, ae((o + 1) * 83886075e-1, 0, 16777215), n) : t === "signed" ? this.writeOutputValue = (s, a, o) => nc(s, a, ae(Math.round(o * 8388607), -8388608, 8388607), n) : g(!1);
        break;
      case 4:
        t === "unsigned" ? this.writeOutputValue = (s, a, o) => s.setUint32(a, ae((o + 1) * 21474836475e-1, 0, 4294967295), n) : t === "signed" ? this.writeOutputValue = (s, a, o) => s.setInt32(a, ae(Math.round(o * 2147483647), -2147483648, 2147483647), n) : t === "float" ? this.writeOutputValue = (s, a, o) => s.setFloat32(a, o, n) : g(!1);
        break;
      case 8:
        t === "float" ? this.writeOutputValue = (s, a, o) => s.setFloat64(a, o, n) : g(!1);
        break;
      default:
        Re(i), g(!1);
    }
  }
  async flushAndClose(e) {
    try {
      e || (this.checkForEncoderError(), this.resampler && await this.resampler.finalize()), this.closed = !0, e || (this.customEncoder ? this.customEncoderCallSerializer.call(() => this.customEncoder.flush()) : this.encoder && await this.encoder.flush());
    } finally {
      this.closed = !0, this.resampler = null, this.customEncoder ? await this.customEncoderCallSerializer.call(() => this.customEncoder.close()).catch((t) => this.setError(t)) : this.encoder && this.encoder.state !== "closed" && this.encoder.close();
    }
    e || this.checkForEncoderError();
  }
  getQueueSize() {
    return this.customEncoder ? this.customEncoderQueueSize : this.isPcmEncoder ? 0 : this.encoder?.encodeQueueSize ?? 0;
  }
  checkForEncoderError() {
    if (this.errorSet)
      throw this.error;
  }
}
class Yf extends is {
  /**
   * Creates a new {@link AudioSampleSource} whose samples are encoded according to the specified
   * {@link AudioEncodingConfig}.
   */
  constructor(e) {
    Qu(e), super(e.codec), this._encoder = new $f(this, e);
  }
  /**
   * Encodes an audio sample and then adds it to the output.
   *
   * @returns A Promise that resolves once the output is ready to receive more samples. You should await this Promise
   * to respect writer and encoder backpressure.
   */
  add(e) {
    if (!(e instanceof fe))
      throw new TypeError("audioSample must be an AudioSample.");
    return this._encoder.add(e, !1);
  }
  /** @internal */
  _flushAndClose(e) {
    return this._encoder.flushAndClose(e);
  }
}
class Zf extends ts {
  /** Internal constructor. */
  constructor(e) {
    if (super(), this._connectedTrack = null, !Er.includes(e))
      throw new TypeError(`Invalid subtitle codec '${e}'. Must be one of: ${Er.join(", ")}.`);
    this._codec = e;
  }
}
class Xo {
  /** Returns a list of video codecs that this output format can contain. */
  getSupportedVideoCodecs() {
    return this.getSupportedCodecs().filter((e) => Ce.includes(e));
  }
  /** Returns a list of audio codecs that this output format can contain. */
  getSupportedAudioCodecs() {
    return this.getSupportedCodecs().filter((e) => Ee.includes(e));
  }
  /** Returns a list of subtitle codecs that this output format can contain. */
  getSupportedSubtitleCodecs() {
    return this.getSupportedCodecs().filter((e) => Er.includes(e));
  }
  /** @internal */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _codecUnsupportedHint(e) {
    return "";
  }
  /** @internal */
  _isFragmentedIsobmff() {
    return !1;
  }
}
class ns extends Xo {
  /** Internal constructor. */
  constructor(e = {}) {
    if (!e || typeof e != "object")
      throw new TypeError("options must be an object.");
    if (e.fastStart !== void 0 && ![!1, "in-memory", "reserve", "fragmented"].includes(e.fastStart))
      throw new TypeError("options.fastStart, when provided, must be false, 'in-memory', 'reserve', or 'fragmented'.");
    if (e.minimumFragmentDuration !== void 0 && (!Number.isFinite(e.minimumFragmentDuration) || e.minimumFragmentDuration < 0))
      throw new TypeError("options.minimumFragmentDuration, when provided, must be a non-negative number.");
    if (e.onFtyp !== void 0 && typeof e.onFtyp != "function")
      throw new TypeError("options.onFtyp, when provided, must be a function.");
    if (e.onMoov !== void 0 && typeof e.onMoov != "function")
      throw new TypeError("options.onMoov, when provided, must be a function.");
    if (e.onMdat !== void 0 && typeof e.onMdat != "function")
      throw new TypeError("options.onMdat, when provided, must be a function.");
    if (e.onMoof !== void 0 && typeof e.onMoof != "function")
      throw new TypeError("options.onMoof, when provided, must be a function.");
    if (e.metadataFormat !== void 0 && !["mdir", "mdta", "udta", "auto"].includes(e.metadataFormat))
      throw new TypeError("options.metadataFormat, when provided, must be either 'auto', 'mdir', 'mdta', or 'udta'.");
    super(), this._options = e;
  }
  getSupportedTrackCounts() {
    return {
      video: { min: 0, max: 4294967295 },
      audio: { min: 0, max: 4294967295 },
      subtitle: { min: 0, max: 4294967295 },
      total: { min: 0, max: 4294967295 }
    };
  }
  get supportsVideoRotationMetadata() {
    return !0;
  }
  get supportsTimestampedMediaData() {
    return !0;
  }
  /** @internal */
  _createMuxer(e) {
    return new Wf(e, this);
  }
  /** @internal */
  _isFragmentedIsobmff() {
    return this._options.fastStart === "fragmented";
  }
}
class ss extends ns {
  /** Creates a new {@link Mp4OutputFormat} configured with the specified `options`. */
  constructor(e) {
    super(e);
  }
  /** @internal */
  get _name() {
    return "MP4";
  }
  get fileExtension() {
    return ".mp4";
  }
  get mimeType() {
    return "video/mp4";
  }
  getSupportedCodecs() {
    return [
      ...Ce,
      ...Gt,
      // These are supported via ISO/IEC 23003-5:
      "pcm-s16",
      "pcm-s16be",
      "pcm-s24",
      "pcm-s24be",
      "pcm-s32",
      "pcm-s32be",
      "pcm-f32",
      "pcm-f32be",
      "pcm-f64",
      "pcm-f64be",
      ...Er
    ];
  }
  /** @internal */
  _codecUnsupportedHint(e) {
    return new $o().getSupportedCodecs().includes(e) ? " Switching to MOV will grant support for this codec." : "";
  }
}
class ya extends ns {
  /** Creates a new {@link CmafOutputFormat} configured with the specified `options`. */
  constructor(e) {
    super(e);
  }
  /** @internal */
  get _name() {
    return "CMAF";
  }
  get fileExtension() {
    return ".m4s";
  }
  get mimeType() {
    return "video/mp4";
  }
  getSupportedCodecs() {
    return [
      ...Ce,
      ...Gt,
      // These are supported via ISO/IEC 23003-5:
      "pcm-s16",
      "pcm-s16be",
      "pcm-s24",
      "pcm-s24be",
      "pcm-s32",
      "pcm-s32be",
      "pcm-f32",
      "pcm-f32be",
      "pcm-f64",
      "pcm-f64be",
      ...Er
    ];
  }
}
class $o extends ns {
  /** Creates a new {@link MovOutputFormat} configured with the specified `options`. */
  constructor(e) {
    super(e);
  }
  /** @internal */
  get _name() {
    return "MOV";
  }
  get fileExtension() {
    return ".mov";
  }
  get mimeType() {
    return "video/quicktime";
  }
  getSupportedCodecs() {
    return [
      ...Ce,
      ...Ee
    ];
  }
  /** @internal */
  _codecUnsupportedHint(e) {
    return new ss().getSupportedCodecs().includes(e) ? " Switching to MP4 will grant support for this codec." : "";
  }
}
const wa = ["video", "audio", "subtitle"];
class Nr {
  /** @internal */
  constructor(e, t, i, n, s) {
    this.id = e, this.output = t, this.type = i, this.source = n, this.metadata = s;
  }
  /** Returns true if and only if this track is a video track. */
  isVideoTrack() {
    return this.type === "video";
  }
  /** Returns true if and only if this track is an audio track. */
  isAudioTrack() {
    return this.type === "audio";
  }
  /** Returns true if and only if this track is a subtitle track. */
  isSubtitleTrack() {
    return this.type === "subtitle";
  }
  /**
   * Returns true if and only if this track can be paired with the given other track. Pairability can be set using
   * the {@link BaseTrackMetadata.group} option.
   */
  canBePairedWith(e) {
    if (!(e instanceof Nr))
      throw new TypeError("other must be an OutputTrack.");
    if (this === e)
      return !1;
    const t = ds(this.metadata.group), i = ds(e.metadata.group);
    for (const n of t)
      if (this.type !== e.type && i.some((o) => n === o) || i.some((o) => n._pairedGroups.has(o)))
        return !0;
    return !1;
  }
}
class Jf extends Nr {
  /** @internal */
  constructor(e, t, i, n) {
    super(e, t, "video", i, n);
  }
}
class eh extends Nr {
  /** @internal */
  constructor(e, t, i, n) {
    super(e, t, "audio", i, n);
  }
}
class th extends Nr {
  /** @internal */
  constructor(e, t, i, n) {
    super(e, t, "subtitle", i, n);
  }
}
class Ne {
  /** Creates a new {@link OutputTrackGroup}. */
  constructor() {
    this._pairedGroups = /* @__PURE__ */ new Set();
  }
  /**
   * Marks this group as being pairable with another group, symmetrically. Output tracks where each track is assigned
   * to one half of a group pairing are then considered pairable.
   *
   * You cannot pair a group with itself.
   */
  pairWith(e) {
    if (!(e instanceof Ne))
      throw new TypeError("other must be an OutputTrackGroup.");
    if (this === e)
      throw new TypeError("Cannot pair a group with itself.");
    this._pairedGroups.add(e), e._pairedGroups.add(this);
  }
}
const rn = (r) => {
  if (!r || typeof r != "object")
    throw new TypeError("metadata must be an object.");
  if (r.languageCode !== void 0 && !Pr(r.languageCode))
    throw new TypeError("metadata.languageCode, when provided, must be a three-letter, ISO 639-2/T language code.");
  if (r.name !== void 0 && typeof r.name != "string")
    throw new TypeError("metadata.name, when provided, must be a string.");
  if (r.disposition !== void 0 && fc(r.disposition), r.maximumPacketCount !== void 0 && (!Number.isInteger(r.maximumPacketCount) || r.maximumPacketCount < 0))
    throw new TypeError("metadata.maximumPacketCount, when provided, must be a non-negative integer.");
  if (r.group !== void 0 && !(r.group instanceof Ne) && (!Array.isArray(r.group) || r.group.some((e) => !(e instanceof Ne))))
    throw new TypeError("metadata.group, when provided, must be an OutputTrackGroup instance or an array of OutputTrackGroup instances.");
};
class vn extends Fr {
  /**
   * The target to which the root file will be written. Throws when using {@link PathedTarget} with an async callback;
   * prefer the `'target'` event for those cases.
   */
  get target() {
    const e = "Output.target cannot be used when using PathedTarget with an async callback. Use the 'target' event instead.";
    if (this._rootTargetPromise)
      throw new TypeError(e);
    const t = this._getRootTarget();
    if (t instanceof Promise)
      throw new TypeError(e);
    return t;
  }
  /**
   * Creates a new instance of {@link Output} which can then be used to create a new media file according to the
   * specified {@link OutputOptions}.
   */
  constructor(e) {
    if (super(), this.state = "pending", this.defaultTrackGroup = new Ne(), this.tracks = [], this._onFinalize = null, this._unfinalizedTargets = /* @__PURE__ */ new Set(), this._rootWriterPromise = null, this._startPromise = null, this._cancelPromise = null, this._finalizePromise = null, this._mutex = new nr(), this._metadataTags = {}, this._rootTarget = null, this._rootTargetPromise = null, this._firstMediaStreamTimestamp = null, !e || typeof e != "object")
      throw new TypeError("options must be an object.");
    if (!(e.format instanceof Xo))
      throw new TypeError("options.format must be an OutputFormat.");
    if (!(e.target instanceof He || e.target instanceof en))
      throw new TypeError("options.target must be a Target or a PathedTarget.");
    if (e.target instanceof He && this._rememberTarget(e.target), e.initTarget !== void 0 && !(e.initTarget instanceof He) && typeof e.initTarget != "function")
      throw new Error("options.initTarget, when provided, must be a Target or a function that returns or resolves to a Target.");
    if (e.onFinalize !== void 0 && typeof e.onFinalize != "function")
      throw new TypeError("options.onFinalize, when provided, must be a function.");
    this.format = e.format, this._target = e.target, this._onFinalize = e.onFinalize ?? null, this._initTarget = e.initTarget ?? null, this._initTarget instanceof He && this._rememberTarget(this._initTarget), this._muxer = e.format._createMuxer(this);
  }
  /** @internal */
  _getTargetValidated(e) {
    g(this._target instanceof en);
    const t = this._target.getTarget(e), i = (n) => {
      if (!(n instanceof He))
        throw new TypeError("getTarget must return a Target.");
      return n;
    };
    return t instanceof Promise ? t.then(i) : i(t);
  }
  /** @internal */
  async _getTarget(e) {
    g(this._target instanceof en);
    const t = await this._getTargetValidated(e);
    return this._emit("target", { target: t, request: e, isRoot: e.isRoot }), this.state === "canceled" ? await t._close() : this._rememberTarget(t), t;
  }
  /** @internal */
  _rememberTarget(e) {
    this._unfinalizedTargets.add(e), e.on("finalized", () => this._unfinalizedTargets.delete(e), { once: !0 });
  }
  /** @internal */
  async _getInitTarget() {
    if (g(this._initTarget !== null), this._initTarget instanceof He)
      return this._initTarget;
    const e = await this._initTarget();
    return this.state === "canceled" ? await e._close() : this._rememberTarget(e), e;
  }
  /** @internal */
  _hasInitTarget() {
    return this._initTarget !== null;
  }
  /** @internal */
  _getRootTarget() {
    if (this._rootTarget)
      return this._rootTarget;
    if (this._rootTargetPromise)
      return this._rootTargetPromise;
    if (this._target instanceof He)
      return this._emit("target", { target: this._target, request: null, isRoot: !0 }), this._rootTarget = this._target, this._target;
    const e = {
      path: this._target.rootPath,
      isRoot: !0,
      mimeType: this.format.mimeType
    }, t = this._getTargetValidated(e), i = (n) => (this.state === "canceled" ? n._close() : this._rememberTarget(n), this._emit("target", { target: n, request: e, isRoot: !0 }), this._rootTarget = n, n);
    return t instanceof Promise ? this._rootTargetPromise = t.then(i) : i(t);
  }
  /** @internal */
  _getRootWriter(e) {
    return this._rootWriterPromise ??= (async () => {
      const t = await this._getRootTarget(), i = new In(t, typeof e == "boolean" ? e : e(t));
      return i.start(), i;
    })();
  }
  /** Adds a video track to the output with the given source. Can only be called before the output is started. */
  addVideoTrack(e, t = {}) {
    if (!(e instanceof rs))
      throw new TypeError("source must be a VideoSource.");
    if (rn(t), t.rotation !== void 0 && ![0, 90, 180, 270].includes(t.rotation))
      throw new TypeError(`Invalid video rotation: ${t.rotation}. Has to be 0, 90, 180 or 270.`);
    if (!this.format.supportsVideoRotationMetadata && t.rotation)
      throw new Error(`${this.format._name} does not support video rotation metadata.`);
    if (t.frameRate !== void 0 && (!Number.isFinite(t.frameRate) || t.frameRate <= 0))
      throw new TypeError(`Invalid video frame rate: ${t.frameRate}. Must be a positive number.`);
    if (t.decoderConfig !== void 0 && va({ decoderConfig: t.decoderConfig }, e._codec), t.primingPacket !== void 0) {
      if (!(t.primingPacket instanceof Y))
        throw new TypeError("metadata.primingPacket, when provided, must be an EncodedPacket.");
      if (t.decoderConfig === void 0)
        throw new TypeError("metadata.primingPacket can only be provided alongside metadata.decoderConfig.");
    }
    const i = { ...t };
    return i.group ??= this.defaultTrackGroup, this._addTrack(new Jf(this.tracks.length + 1, this, e, i));
  }
  /** Adds an audio track to the output with the given source. Can only be called before the output is started. */
  addAudioTrack(e, t = {}) {
    if (!(e instanceof is))
      throw new TypeError("source must be an AudioSource.");
    if (rn(t), t.decoderConfig !== void 0 && Ba({ decoderConfig: t.decoderConfig }, e._codec), t.primingPacket !== void 0) {
      if (!(t.primingPacket instanceof Y))
        throw new TypeError("metadata.primingPacket, when provided, must be an EncodedPacket.");
      if (t.decoderConfig === void 0)
        throw new TypeError("metadata.primingPacket can only be provided alongside metadata.decoderConfig.");
    }
    const i = { ...t };
    return i.group ??= this.defaultTrackGroup, this._addTrack(new eh(this.tracks.length + 1, this, e, i));
  }
  /** Adds a subtitle track to the output with the given source. Can only be called before the output is started. */
  addSubtitleTrack(e, t = {}) {
    if (!(e instanceof Zf))
      throw new TypeError("source must be a SubtitleSource.");
    rn(t);
    const i = { ...t };
    return i.group ??= this.defaultTrackGroup, this._addTrack(new th(this.tracks.length + 1, this, e, i));
  }
  /**
   * Sets descriptive metadata tags about the media file, such as title, author, date, or cover art. When called
   * multiple times, only the metadata from the last call will be used.
   *
   * Can only be called before the output is started.
   */
  setMetadataTags(e) {
    if (fn(e), this.state !== "pending")
      throw new Error("Cannot set metadata tags after output has been started or canceled.");
    this._metadataTags = e;
  }
  /** @internal */
  _addTrack(e) {
    if (this.state !== "pending")
      throw new Error("Cannot add track after output has been started or canceled.");
    if (e.source._connectedTrack)
      throw new Error("Source is already used for a track.");
    const t = this.format.getSupportedTrackCounts(), i = this.tracks.reduce((a, o) => a + (o.type === e.type ? 1 : 0), 0), n = t[e.type].max;
    if (i === n)
      throw new Error(n === 0 ? `${this.format._name} does not support ${e.type} tracks.` : `${this.format._name} does not support more than ${n} ${e.type} track${n === 1 ? "" : "s"}.`);
    const s = t.total.max;
    if (this.tracks.length === s)
      throw new Error(`${this.format._name} does not support more than ${s} tracks${s === 1 ? "" : "s"} in total.`);
    if (e.isVideoTrack()) {
      const a = this.format.getSupportedVideoCodecs();
      if (a.length === 0)
        throw new Error(`${this.format._name} does not support video tracks.` + this.format._codecUnsupportedHint(e.source._codec));
      if (!a.includes(e.source._codec))
        throw new Error(`Codec '${e.source._codec}' cannot be contained within ${this.format._name}. Supported video codecs are: ${a.map((o) => `'${o}'`).join(", ")}.` + this.format._codecUnsupportedHint(e.source._codec));
    } else if (e.isAudioTrack()) {
      const a = this.format.getSupportedAudioCodecs();
      if (a.length === 0)
        throw new Error(`${this.format._name} does not support audio tracks.` + this.format._codecUnsupportedHint(e.source._codec));
      if (!a.includes(e.source._codec))
        throw new Error(`Codec '${e.source._codec}' cannot be contained within ${this.format._name}. Supported audio codecs are: ${a.map((o) => `'${o}'`).join(", ")}.` + this.format._codecUnsupportedHint(e.source._codec));
    } else if (e.isSubtitleTrack()) {
      const a = this.format.getSupportedSubtitleCodecs();
      if (a.length === 0)
        throw new Error(`${this.format._name} does not support subtitle tracks.` + this.format._codecUnsupportedHint(e.source._codec));
      if (!a.includes(e.source._codec))
        throw new Error(`Codec '${e.source._codec}' cannot be contained within ${this.format._name}. Supported subtitle codecs are: ${a.map((o) => `'${o}'`).join(", ")}.` + this.format._codecUnsupportedHint(e.source._codec));
    }
    return this.tracks.push(e), e.source._connectedTrack = e, e;
  }
  /**
   * Whether the output has enough tracks (of the correct type) to be started, based on the requirements of the output
   * format.
   */
  hasEnoughTracks() {
    const e = this.format.getSupportedTrackCounts();
    for (const i of wa) {
      const n = this.tracks.reduce((a, o) => a + (o.type === i ? 1 : 0), 0), s = e[i].min;
      if (n < s)
        return !1;
    }
    const t = e.total.min;
    return !(this.tracks.length < t);
  }
  /**
   * Starts the creation of the output file. This method should be called after all tracks have been added. Only after
   * the output has started can media samples be added to the tracks.
   *
   * @returns A promise that resolves when the output has successfully started and is ready to receive media samples.
   */
  async start() {
    const e = this.format.getSupportedTrackCounts();
    for (const i of wa) {
      const n = this.tracks.reduce((a, o) => a + (o.type === i ? 1 : 0), 0), s = e[i].min;
      if (n < s)
        throw new Error(s === e[i].max ? `${this.format._name} requires exactly ${s} ${i} track${s === 1 ? "" : "s"}.` : `${this.format._name} requires at least ${s} ${i} track${s === 1 ? "" : "s"}.`);
    }
    const t = e.total.min;
    if (this.tracks.length < t)
      throw new Error(t === e.total.max ? `${this.format._name} requires exactly ${t} track${t === 1 ? "" : "s"}.` : `${this.format._name} requires at least ${t} track${t === 1 ? "" : "s"}.`);
    if (this.state === "canceled")
      throw new Error("Output has been canceled.");
    return this._startPromise ? (q._warn("Output has already been started."), this._startPromise) : this._startPromise = (async () => {
      this.state = "started";
      const i = this._mutex.acquire();
      try {
        await this._muxer.start();
        const n = this.tracks.map((s) => s.source._start());
        await Promise.all(n);
      } finally {
        (await i)();
      }
    })();
  }
  /**
   * Resolves with the full MIME type of the output file, including track codecs.
   *
   * The returned promise will resolve only once the precise codec strings of all tracks are known.
   */
  getMimeType() {
    return this._muxer.getMimeType();
  }
  /**
   * Cancels the creation of the output file, releasing internal resources like encoders and preventing further
   * samples from being added.
   *
   * @returns A promise that resolves once all internal resources have been released.
   */
  async cancel() {
    if (this._cancelPromise)
      return q._warn("Output has already been canceled."), this._cancelPromise;
    if (this.state === "finalizing" || this.state === "finalized") {
      this.state === "finalized" && q._warn("Output has already been finalized.");
      return;
    }
    return this._cancelPromise = (async () => {
      this.state = "canceled";
      const e = await this._mutex.acquire();
      try {
        const t = this.tracks.map((i) => i.source._flushOrWaitForOngoingClose(!0));
        await Promise.all(t), await Promise.all([...this._unfinalizedTargets].map((i) => i._close())), this._unfinalizedTargets.clear();
      } finally {
        e();
      }
    })();
  }
  /**
   * Finalizes the output file. This method must be called after all media samples across all tracks have been added.
   * Once the Promise returned by this method completes, the output file is ready.
   */
  async finalize() {
    if (this.state === "pending")
      throw new Error("Cannot finalize before starting.");
    if (this.state === "canceled")
      throw new Error("Cannot finalize after canceling.");
    return this._finalizePromise ? (q._warn("Output has already been finalized."), this._finalizePromise) : this._finalizePromise = (async () => {
      this.state = "finalizing";
      const e = await this._mutex.acquire();
      try {
        const t = this.tracks.map((i) => i.source._flushOrWaitForOngoingClose(!1));
        if (await Promise.all(t), await this._muxer.finalize(), this._rootWriterPromise) {
          const i = await this._rootWriterPromise;
          i.finalized || (await i.flush(), await i.finalize());
        }
        this._onFinalize && await this._onFinalize(), this.state = "finalized";
      } finally {
        await Promise.all([...this._unfinalizedTargets].map((t) => t._close().catch(() => {
        }))), this._unfinalizedTargets.clear(), e();
      }
    })();
  }
}
var mr = function(r, e, t) {
  if (e != null) {
    if (typeof e != "object" && typeof e != "function") throw new TypeError("Object expected.");
    var i, n;
    if (t) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      i = e[Symbol.asyncDispose];
    }
    if (i === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      i = e[Symbol.dispose], t && (n = i);
    }
    if (typeof i != "function") throw new TypeError("Object not disposable.");
    n && (i = function() {
      try {
        n.call(this);
      } catch (s) {
        return Promise.reject(s);
      }
    }), r.stack.push({ value: e, dispose: i, async: t });
  } else t && r.stack.push({ async: !0 });
  return e;
}, Lr = /* @__PURE__ */ (function(r) {
  return function(e) {
    function t(a) {
      e.error = e.hasError ? new r(a, e.error, "An error was suppressed during disposal.") : a, e.hasError = !0;
    }
    var i, n = 0;
    function s() {
      for (; i = e.stack.pop(); )
        try {
          if (!i.async && n === 1) return n = 0, e.stack.push(i), Promise.resolve().then(s);
          if (i.dispose) {
            var a = i.dispose.call(i.value);
            if (i.async) return n |= 2, Promise.resolve(a).then(s, function(o) {
              return t(o), s();
            });
          } else n |= 1;
        } catch (o) {
          t(o);
        }
      if (n === 1) return e.hasError ? Promise.reject(e.error) : Promise.resolve();
      if (e.hasError) throw e.error;
    }
    return s();
  };
})(typeof SuppressedError == "function" ? SuppressedError : function(r, e, t) {
  var i = new Error(t);
  return i.name = "SuppressedError", i.error = r, i.suppressed = e, i;
});
const Hr = (r) => {
  if (!r || typeof r != "object")
    throw new TypeError("options.video, when provided, must be an object.");
  if (r?.discard !== void 0 && typeof r.discard != "boolean")
    throw new TypeError("options.video.discard, when provided, must be a boolean.");
  if (r?.forceTranscode !== void 0 && typeof r.forceTranscode != "boolean")
    throw new TypeError("options.video.forceTranscode, when provided, must be a boolean.");
  if (r?.codec !== void 0 && !Ce.includes(r.codec))
    throw new TypeError(`options.video.codec, when provided, must be one of: ${Ce.join(", ")}.`);
  const e = r?.bitrate;
  if (r?.quality !== void 0 && !(r.quality instanceof oe))
    throw new TypeError("options.video.quality, when provided, must be a Quality.");
  if (r?.quality !== void 0 && e !== void 0)
    throw new TypeError("options.video.quality and options.video.bitrate cannot both be provided.");
  if (e !== void 0 && !(e instanceof oe) && (!Number.isInteger(e) || e <= 0))
    throw new TypeError("options.video.bitrate, when provided, must be a positive integer or a quality.");
  if (r?.width !== void 0 && (!Number.isInteger(r.width) || r.width <= 0))
    throw new TypeError("options.video.width, when provided, must be a positive integer.");
  if (r?.height !== void 0 && (!Number.isInteger(r.height) || r.height <= 0))
    throw new TypeError("options.video.height, when provided, must be a positive integer.");
  if (r?.fit !== void 0 && !["fill", "contain", "cover"].includes(r.fit))
    throw new TypeError("options.video.fit, when provided, must be one of 'fill', 'contain', or 'cover'.");
  if (r?.width !== void 0 && r.height !== void 0 && r.fit === void 0)
    throw new TypeError("When both options.video.width and options.video.height are provided, options.video.fit must also be provided.");
  if (r?.rotate !== void 0 && ![0, 90, 180, 270].includes(r.rotate))
    throw new TypeError("options.video.rotate, when provided, must be 0, 90, 180 or 270.");
  if (r?.allowRotationMetadata !== void 0 && typeof r.allowRotationMetadata != "boolean")
    throw new TypeError("options.video.allowRotationMetadata, when provided, must be a boolean.");
  if (r?.crop !== void 0 && fi(r.crop, "options.video."), r?.frameRate !== void 0 && (!Number.isFinite(r.frameRate) || r.frameRate <= 0))
    throw new TypeError("options.video.frameRate, when provided, must be a finite positive number.");
  if (r?.alpha !== void 0 && !["discard", "keep"].includes(r.alpha))
    throw new TypeError("options.video.alpha, when provided, must be either 'discard' or 'keep'.");
  if (r?.keyFrameInterval !== void 0 && (!Number.isFinite(r.keyFrameInterval) || r.keyFrameInterval < 0))
    throw new TypeError("options.video.keyFrameInterval, when provided, must be a non-negative number.");
  if (r?.process !== void 0 && typeof r.process != "function")
    throw new TypeError("options.video.process, when provided, must be a function.");
  if (r?.processedWidth !== void 0 && (!Number.isInteger(r.processedWidth) || r.processedWidth <= 0))
    throw new TypeError("options.video.processedWidth, when provided, must be a positive integer.");
  if (r?.processedHeight !== void 0 && (!Number.isInteger(r.processedHeight) || r.processedHeight <= 0))
    throw new TypeError("options.video.processedHeight, when provided, must be a positive integer.");
  if (r?.hardwareAcceleration !== void 0 && !["no-preference", "prefer-hardware", "prefer-software"].includes(r.hardwareAcceleration))
    throw new TypeError("options.video.hardwareAcceleration, when provided, must be 'no-preference', 'prefer-hardware' or 'prefer-software'.");
  if (r?.group !== void 0 && !(r.group instanceof Ne || Array.isArray(r.group) && r.group.every((t) => t instanceof Ne)))
    throw new TypeError("options.video.group, when provided, must be an OutputTrackGroup or an array of OutputTrackGroups.");
}, jr = (r) => {
  if (!r || typeof r != "object")
    throw new TypeError("options.audio, when provided, must be an object.");
  if (r?.discard !== void 0 && typeof r.discard != "boolean")
    throw new TypeError("options.audio.discard, when provided, must be a boolean.");
  if (r?.forceTranscode !== void 0 && typeof r.forceTranscode != "boolean")
    throw new TypeError("options.audio.forceTranscode, when provided, must be a boolean.");
  if (r?.codec !== void 0 && !Ee.includes(r.codec))
    throw new TypeError(`options.audio.codec, when provided, must be one of: ${Ee.join(", ")}.`);
  const e = r?.bitrate;
  if (r?.quality !== void 0 && !(r.quality instanceof oe))
    throw new TypeError("options.audio.quality, when provided, must be a Quality.");
  if (r?.quality !== void 0 && e !== void 0)
    throw new TypeError("options.audio.quality and options.audio.bitrate cannot both be provided.");
  if (e !== void 0 && !(e instanceof oe) && (!Number.isInteger(e) || e <= 0))
    throw new TypeError("options.audio.bitrate, when provided, must be a positive integer or a quality.");
  if (r?.numberOfChannels !== void 0 && (!Number.isInteger(r.numberOfChannels) || r.numberOfChannels <= 0))
    throw new TypeError("options.audio.numberOfChannels, when provided, must be a positive integer.");
  if (r?.sampleRate !== void 0 && (!Number.isInteger(r.sampleRate) || r.sampleRate <= 0))
    throw new TypeError("options.audio.sampleRate, when provided, must be a positive integer.");
  if (r?.sampleFormat !== void 0 && !["u8", "s16", "s32", "f32"].includes(r.sampleFormat))
    throw new TypeError("options.audio.sampleFormat, when provided, must be one of: u8, s16, s32, f32.");
  if (r?.process !== void 0 && typeof r.process != "function")
    throw new TypeError("options.audio.process, when provided, must be a function.");
  if (r?.processedNumberOfChannels !== void 0 && (!Number.isInteger(r.processedNumberOfChannels) || r.processedNumberOfChannels <= 0))
    throw new TypeError("options.audio.processedNumberOfChannels, when provided, must be a positive integer.");
  if (r?.processedSampleRate !== void 0 && (!Number.isInteger(r.processedSampleRate) || r.processedSampleRate <= 0))
    throw new TypeError("options.audio.processedSampleRate, when provided, must be a positive integer.");
  if (r?.group !== void 0 && !(r.group instanceof Ne || Array.isArray(r.group) && r.group.every((t) => t instanceof Ne)))
    throw new TypeError("options.audio.group, when provided, must be an OutputTrackGroup or an array of OutputTrackGroups.");
}, nn = 2, sn = 48e3;
class as {
  /** Initializes a new conversion process without starting the conversion. */
  static async init(e) {
    const t = new as(e);
    return await t._init(), t;
  }
  /** Creates a new Conversion instance (duh). */
  constructor(e) {
    if (this.state = "idle", this._nextOutputTrackId = 0, this._outputTrackIds = [], this._outputOwnTrackGroups = [], this._trackPumps = [], this._composable = !1, this._executed = !1, this._executionUntil = 1 / 0, this._pauseRequested = !1, this._synchronizer = new rh(this), this._totalDuration = null, this._maxTimestamps = /* @__PURE__ */ new Map(), this.onProgress = void 0, this._computeProgress = !1, this._lastProgress = 0, this.isValid = !1, this.utilizedTracks = [], this.discardedTracks = [], !e || typeof e != "object")
      throw new TypeError("options must be an object.");
    if (!(e.input instanceof er))
      throw new TypeError("options.input must be an Input.");
    if (!(e.output instanceof vn))
      throw new TypeError("options.output must be an Output.");
    if (e.tracks !== void 0 && e.tracks !== "all" && e.tracks !== "primary")
      throw new TypeError("options.tracks, when provided, must be either 'all' or 'primary'.");
    if (e.composable !== void 0 && typeof e.composable != "boolean")
      throw new TypeError("options.composable, when provided, must be a boolean.");
    const t = e.composable ?? !1;
    if (t) {
      if (e.tags !== void 0)
        throw new TypeError("options.tags cannot be set by a composable conversion; set metadata directly on the output instead.");
      if (e.output.state !== "pending")
        throw new TypeError("options.output must not have been started yet.");
    } else if (e.output.tracks.length > 0 || Object.keys(e.output._metadataTags).length > 0 || e.output.state !== "pending")
      throw new TypeError("options.output must be fresh: no tracks or metadata tags added and not started.");
    if (e.video !== void 0 && typeof e.video != "function")
      if (Array.isArray(e.video))
        for (const i of e.video)
          Hr(i);
      else
        Hr(e.video);
    if (e.audio !== void 0 && typeof e.audio != "function")
      if (Array.isArray(e.audio))
        for (const i of e.audio)
          jr(i);
      else
        jr(e.audio);
    if (e.trim !== void 0 && (!e.trim || typeof e.trim != "object"))
      throw new TypeError("options.trim, when provided, must be an object.");
    if (e.trim?.start !== void 0 && !Number.isFinite(e.trim.start))
      throw new TypeError("options.trim.start, when provided, must be a finite number.");
    if (e.trim?.end !== void 0 && !Number.isFinite(e.trim.end))
      throw new TypeError("options.trim.end, when provided, must be a finite number.");
    if (e.trim?.start !== void 0 && e.trim.end !== void 0 && e.trim.start >= e.trim.end)
      throw new TypeError("options.trim.start must be less than options.trim.end.");
    if (e.tags !== void 0 && (typeof e.tags != "object" || !e.tags) && typeof e.tags != "function")
      throw new TypeError("options.tags, when provided, must be an object or a function.");
    if (typeof e.tags == "object" && fn(e.tags), e.showWarnings !== void 0 && typeof e.showWarnings != "boolean")
      throw new TypeError("options.showWarnings, when provided, must be a boolean.");
    this._options = e, this._composable = t, this.input = e.input, this.output = e.output;
  }
  /** @internal */
  async _init() {
    const e = await this.input.getFormat();
    let t, i = this._options.tracks;
    if (i === void 0 && (i = e.name.includes("(HLS)") ? "primary" : "all"), i === "all")
      t = await this.input.getTracks();
    else if (i === "primary") {
      const l = await this.input.getPrimaryVideoTrack(), u = await this.input.getPrimaryAudioTrack();
      t = [l, u].filter((d) => d !== null);
    } else
      Re(i), g(!1);
    const n = this.output.format.getSupportedTrackCounts();
    let s = 1, a = 1;
    const o = [], c = [];
    for (const l of t) {
      let u;
      if (l.isVideoTrack())
        if (this._options.video)
          if (typeof this._options.video == "function") {
            const h = await this._options.video(l, s) ?? {};
            if (Array.isArray(h))
              for (const p of h)
                Hr(p);
            else
              Hr(h);
            u = Array.isArray(h) ? h : [h], s++;
          } else
            u = Array.isArray(this._options.video) ? this._options.video : [this._options.video];
        else
          u = [{}];
      else if (l.isAudioTrack())
        if (this._options.audio)
          if (typeof this._options.audio == "function") {
            const h = await this._options.audio(l, a) ?? {};
            if (Array.isArray(h))
              for (const p of h)
                jr(p);
            else
              jr(h);
            u = Array.isArray(h) ? h : [h], a++;
          } else
            u = Array.isArray(this._options.audio) ? this._options.audio : [this._options.audio];
        else
          u = [{}];
      else
        g(!1);
      const d = u.filter((h) => h.discard);
      for (const h of d)
        this.discardedTracks.push({
          track: l,
          reason: "discarded_by_user",
          trackOptions: h
        });
      if (u.length === d.length) {
        u.length === 0 && this.discardedTracks.push({
          track: l,
          reason: "discarded_by_user",
          trackOptions: {}
        });
        continue;
      }
      const f = u.filter((h) => !h.discard);
      o.push(l), c.push(f);
    }
    this._options.trim?.start !== void 0 ? this._startTimestamp = this._options.trim.start : this._startTimestamp = Math.max(
      await this.input.getFirstTimestamp(o),
      // Samples can also have negative timestamps, but the meaning typically is "don't present me", so let's
      // cut those out by default.
      0
    ), this._endTimestamp = Math.max(this._options.trim?.end ?? 1 / 0, this._startTimestamp);
    for (let l = 0; l < o.length; l++) {
      const u = o[l], d = c[l];
      for (const f of d) {
        if (this.output.tracks.length === n.total.max) {
          this.discardedTracks.push({
            track: u,
            reason: "max_track_count_reached",
            trackOptions: f
          });
          continue;
        }
        if (this.output.tracks.reduce((m, y) => m + (y.type === u.type ? 1 : 0), 0) === n[u.type].max) {
          this.discardedTracks.push({
            track: u,
            reason: "max_track_count_of_type_reached",
            trackOptions: f
          });
          continue;
        }
        const p = this._nextOutputTrackId++;
        u.isVideoTrack() ? await this._processVideoTrack(u, f, p) : u.isAudioTrack() ? await this._processAudioTrack(u, f, p) : g(!1);
      }
    }
    for (let l = 0; l < this.utilizedTracks.length - 1; l++)
      for (let u = l + 1; u < this.utilizedTracks.length; u++) {
        const d = this.utilizedTracks[l], f = this.utilizedTracks[u], h = this._outputOwnTrackGroups[l], p = this._outputOwnTrackGroups[u];
        g(h !== void 0), g(p !== void 0), h && p && d.canBePairedWith(f) && h.pairWith(p);
      }
    if (!this._composable) {
      const l = await this.input.getMetadataTags();
      let u;
      if (this._options.tags) {
        const h = typeof this._options.tags == "function" ? await this._options.tags(l) : this._options.tags;
        fn(h), u = h;
      } else
        u = l;
      const d = e.mimeType === this.output.format.mimeType, f = l.raw === u.raw;
      l.raw && f && !d && delete u.raw, this.output.setMetadataTags(u);
    }
    if (this._composable ? this.isValid = !0 : this.isValid = this.output.hasEnoughTracks() && this.output.tracks.length > 0, this._options.showWarnings ?? !0) {
      const l = [], u = this.discardedTracks.filter((d) => d.reason !== "discarded_by_user");
      u.length > 0 && l.push("Some tracks had to be discarded from the conversion:", u), this.isValid || (l.length > 0 && l.push(`

`), l.push(this._getInvalidityExplanation().join(""))), l.length > 0 && q._warn(...l);
    }
  }
  /** @internal */
  _getInvalidityExplanation() {
    const e = [];
    if (this.discardedTracks.length === 0)
      e.push("Due to missing tracks, this conversion cannot be executed.");
    else {
      const t = this.discardedTracks.every((i) => i.reason === "discarded_by_user" || i.reason === "no_encodable_target_codec") && this.discardedTracks.some((i) => i.reason === "no_encodable_target_codec");
      if (e.push("Due to discarded tracks, this conversion cannot be executed."), t) {
        const i = this.discardedTracks.flatMap((s) => {
          if (s.reason === "discarded_by_user")
            return [];
          let a;
          return s.track.type === "video" ? a = this.output.format.getSupportedVideoCodecs() : s.track.type === "audio" ? a = this.output.format.getSupportedAudioCodecs() : a = this.output.format.getSupportedSubtitleCodecs(), a.filter((o) => !s.trackOptions.codec || o === s.trackOptions.codec);
        }), n = [...new Set(i)];
        n.length === 1 ? e.push(`
Tracks were discarded because your environment is not able to encode '${n[0]}' with the provided parameters.`) : e.push(`
Tracks were discarded because your environment is not able to encode any of the codecs ${n.map((s) => `'${s}'`).join(", ")} with the provided parameters.`), n.includes("mp3") && e.push(`
The @mediabunny/mp3-encoder extension package provides support for encoding MP3.`), n.includes("aac") && e.push(`
The @mediabunny/aac-encoder extension package provides support for encoding AAC.`), (n.includes("ac3") || n.includes("eac3")) && e.push(`
The @mediabunny/ac3 extension package provides support for encoding and decoding AC-3/E-AC-3.`), n.includes("flac") && e.push(`
The @mediabunny/flac-encoder extension package provides support for encoding FLAC.`);
      } else
        e.push(`
Check the discardedTracks field for more info.`);
    }
    return e;
  }
  /**
   * Executes the conversion process and resolves when the conversion is complete. When
   * {@link ConversionExecuteOptions.until} is provided, the conversion will be suspended once that output timestamp
   * is reached and can be resumed with another call to `execute`. An ongoing execution may also be suspended via
   * {@link ConversionExecuteOptions.pauseSignal}.
   *
   * Execution will throw if `isValid` is `false`.
   */
  async execute(e = {}) {
    if (!e || typeof e != "object")
      throw new TypeError("options must be an object.");
    if (e.until !== void 0 && (typeof e.until != "number" || Number.isNaN(e.until)))
      throw new TypeError("options.until, when provided, must be a number.");
    if (e.pauseSignal !== void 0 && !(e.pauseSignal instanceof AbortSignal))
      throw new TypeError("options.pauseSignal, when provided, must be an AbortSignal.");
    if (!this.isValid)
      throw new Error(`Cannot execute this conversion because its output configuration is invalid. Make sure to always check the isValid field before executing a conversion.
` + this._getInvalidityExplanation().join(""));
    if (this.state === "executing")
      throw new Error("Cannot call execute() while a previous call to execute() is still running.");
    if (this.state === "canceled")
      throw new ba();
    if (this.state === "done")
      return;
    if (this._composable && this.output.state === "pending")
      throw new Error("A composable conversion requires the output to be started. Call start() on the output before executing the conversion.");
    this.state = "executing", this._executionUntil = e.until ?? 1 / 0, this._pauseRequested = e.pauseSignal?.aborted ?? !1;
    const t = () => {
      this.state === "executing" && (this._pauseRequested = !0, this._synchronizer.resolveAll());
    };
    e.pauseSignal?.addEventListener("abort", t);
    for (const n of this._trackPumps)
      n.done || (n.resolvers = ne());
    if (this._executed)
      for (const n of this._trackPumps)
        n.wake?.();
    else {
      this._executed = !0;
      for (const n of this._outputTrackIds)
        this._synchronizer.declareTrack(n);
      if (this.onProgress) {
        const s = [...new Set(this.utilizedTracks)].map(async (o) => await o.isLive() ? 1 / 0 : await o.getDurationFromMetadata() ?? await o.computeDuration()), a = Math.max(0, ...await Promise.all(s));
        this._computeProgress = !0, this._totalDuration = Math.min(a - this._startTimestamp, this._endTimestamp - this._startTimestamp);
        for (const o of this._outputTrackIds)
          this._maxTimestamps.set(o, 0);
        this.onProgress?.(0, 0);
      }
      this._composable || await this.output.start();
      for (const n of this._trackPumps)
        n.start();
    }
    try {
      await Promise.all(this._trackPumps.map((n) => n.resolvers.promise));
    } catch (n) {
      throw this.state !== "canceled" && this.cancel(), n;
    } finally {
      e.pauseSignal?.removeEventListener("abort", t);
    }
    if (this.state === "canceled")
      throw new ba();
    const i = this._trackPumps.every((n) => n.done);
    if (this.state = i ? "done" : "idle", i && (this._composable || await this.output.finalize(), this._computeProgress)) {
      const n = Math.min(...this._maxTimestamps.values());
      this.onProgress?.(1, n);
    }
  }
  /**
   * Cancels the conversion process, causing any ongoing `execute` call to throw a `ConversionCanceledError`.
   * Does nothing if the conversion is already complete.
   */
  async cancel() {
    if (this.state !== "done") {
      if (this.state === "canceled") {
        q._warn("Conversion already canceled.");
        return;
      }
      this.state = "canceled";
      for (const e of this._trackPumps)
        e.wake?.();
      this._synchronizer.resolveAll(), this._composable || await this.output.cancel();
    }
  }
  /** @internal */
  async _processVideoTrack(e, t, i) {
    const n = await e.getCodec();
    if (!n) {
      this.discardedTracks.push({
        track: e,
        reason: "unknown_source_codec",
        trackOptions: t
      });
      return;
    }
    let s;
    const a = await e.getRotation(), o = Ar(a + (t.rotate ?? 0));
    let c = o;
    const l = this.output.format.supportsVideoRotationMetadata && (t.allowRotationMetadata ?? !0), u = await e.getSquarePixelWidth(), d = await e.getSquarePixelHeight(), [f, h] = o % 180 === 0 ? [u, d] : [d, u];
    let p = t.crop;
    p && (p = Sn(p, f, h));
    const [m, y] = p ? [p.width, p.height] : [f, h];
    let w = m, b = y;
    const k = w / b;
    t.width !== void 0 && t.height === void 0 ? (w = Mt(t.width), b = Mt(Math.round(w / k))) : t.width === void 0 && t.height !== void 0 ? (b = Mt(t.height), w = Mt(Math.round(b * k))) : t.width !== void 0 && t.height !== void 0 && (w = Mt(t.width), b = Mt(t.height));
    const A = await e.getFirstTimestamp();
    let T = this.output.format.getSupportedVideoCodecs();
    const x = !!t.forceTranscode || A < this._startTimestamp || !!t.frameRate || t.keyFrameInterval !== void 0 || t.process !== void 0 || t.quality !== void 0 || t.bitrate !== void 0 || !T.includes(n) || t.codec && t.codec !== n || w !== m || b !== y || o !== 0 && !l || !!p, C = t.alpha ?? "discard";
    if (x) {
      if (!await e.canDecode()) {
        this.discardedTracks.push({
          track: e,
          reason: "undecodable_source_codec",
          trackOptions: t
        });
        return;
      }
      t.codec && (T = T.filter((j) => j === t.codec));
      const I = Zt(t.quality, t.bitrate) ?? new oe("high"), _ = await Zu(T, {
        width: t.process && t.processedWidth ? t.processedWidth : w,
        height: t.process && t.processedHeight ? t.processedHeight : b,
        quality: I
      });
      if (!_) {
        this.discardedTracks.push({
          track: e,
          reason: "no_encodable_target_codec",
          trackOptions: t
        });
        return;
      }
      const F = {
        codec: _,
        quality: I,
        keyFrameInterval: t.keyFrameInterval,
        sizeChangeBehavior: t.fit ?? "passThrough",
        alpha: C,
        hardwareAcceleration: t.hardwareAcceleration,
        transform: {}
      };
      g(F.transform);
      let O = w !== m || b !== y || o !== 0 && (!l || t.process !== void 0) || !!p || u !== await e.getCodedWidth() || d !== await e.getCodedHeight();
      if (!O) {
        const j = { stack: [], error: void 0, hasError: !1 };
        try {
          const Z = new vn({
            format: new ss(),
            // Supports all video codecs
            target: new Df()
          }), le = new ga(F);
          Z.addVideoTrack(le), await Z.start();
          const _e = new sa(e), ke = mr(j, await _e.getSample(A), !1);
          if (ke)
            try {
              await le.add(ke), ke.close(), await Z.finalize();
            } catch (_i) {
              q._warn("An error occurred when probing encoder support. Falling back to rerender path.", _i), Z.cancel(), O = !0, F.transform.force = !0;
            }
          else
            await Z.cancel();
        } catch (Z) {
          j.error = Z, j.hasError = !0;
        } finally {
          Lr(j);
        }
      }
      t.frameRate && (F.transform.frameRate = t.frameRate), t.process && (F.transform.process = t.process), O && (c = 0, F.transform.width = w, F.transform.height = b, F.transform.fit = t.fit ?? "fill", F.transform.rotate = Ar(o - a), F.transform.crop = p, F.transform.alpha = C);
      let D = null;
      F.onEncodedSample = (j) => {
        D = j.timestamp;
      };
      const z = new ga(F);
      s = z, this._registerTrackPump(async (j) => {
        const Z = new sa(e);
        for await (const le of Z.samples(this._startTimestamp, this._endTimestamp)) {
          const _e = { stack: [], error: void 0, hasError: !1 };
          try {
            const ke = mr(_e, le, !1);
            if (this.state === "canceled")
              break;
            const _i = Math.max(ke.timestamp - this._startTimestamp, 0);
            ke.setTimestamp(_i), this._reportProgress(i, ke.timestamp + ke.duration), await z.add(ke), ke.close(), D !== null && (this._synchronizer.shouldWait(i, D) && await this._synchronizer.wait(D), await this._checkpoint(j, D));
          } catch (ke) {
            _e.error = ke, _e.hasError = !0;
          } finally {
            Lr(_e);
          }
        }
        z.close(), this._synchronizer.closeTrack(i);
      });
    } else {
      const E = new jf(n);
      s = E, this._registerTrackPump(async (I) => {
        const _ = new Jt(e), O = { decoderConfig: await e.getDecoderConfig() ?? void 0 };
        for await (const D of _.packets(void 0, void 0, { verifyKeyPackets: !0 })) {
          if (this.state === "canceled" || D.timestamp >= this._endTimestamp)
            break;
          const z = D.clone({
            timestamp: D.timestamp - this._startTimestamp,
            sideData: C === "discard" ? {} : D.sideData
          });
          g(z.timestamp >= 0), this._reportProgress(i, z.timestamp + z.duration), await E.add(z, O), this._synchronizer.shouldWait(i, z.timestamp) && await this._synchronizer.wait(z.timestamp), await this._checkpoint(I, z.timestamp);
        }
        E.close(), this._synchronizer.closeTrack(i);
      });
    }
    let P = null;
    !t.group && !this._composable && (P = new Ne());
    const S = await e.getLanguageCode();
    this.output.addVideoTrack(s, {
      frameRate: t.frameRate,
      // TODO: This condition can be removed when all demuxers properly homogenize to BCP47 in v2
      languageCode: Pr(S) ? S : void 0,
      name: await e.getName() ?? void 0,
      disposition: await e.getDisposition(),
      rotation: c,
      group: P ?? t.group
    }), this.utilizedTracks.push(e), this._outputTrackIds.push(i), this._outputOwnTrackGroups.push(P);
  }
  /** @internal */
  async _processAudioTrack(e, t, i) {
    const n = await e.getCodec();
    if (!n) {
      this.discardedTracks.push({
        track: e,
        reason: "unknown_source_codec",
        trackOptions: t
      });
      return;
    }
    let s;
    const a = await e.getNumberOfChannels(), o = await e.getSampleRate(), c = await e.getFirstTimestamp();
    let l = t.numberOfChannels ?? a, u = t.sampleRate ?? o;
    const d = c < this._startTimestamp;
    let f = c > this._startTimestamp && !this.output.format.supportsTimestampedMediaData, h = this.output.format.getSupportedAudioCodecs();
    if (!t.forceTranscode && !t.quality && !t.bitrate && l === a && u === o && !d && !f && h.includes(n) && (!t.codec || t.codec === n) && !t.process && t.sampleFormat === void 0) {
      const y = new Xf(n);
      s = y, this._registerTrackPump(async (w) => {
        const b = new Jt(e), A = { decoderConfig: await e.getDecoderConfig() ?? void 0 };
        for await (const T of b.packets()) {
          if (this.state === "canceled" || T.timestamp >= this._endTimestamp)
            break;
          const x = T.clone({
            timestamp: T.timestamp - this._startTimestamp
          });
          g(x.timestamp >= 0), this._reportProgress(i, x.timestamp + x.duration), await y.add(x, A), this._synchronizer.shouldWait(i, x.timestamp) && await this._synchronizer.wait(x.timestamp), await this._checkpoint(w, x.timestamp);
        }
        y.close(), this._synchronizer.closeTrack(i);
      });
    } else {
      if (!await e.canDecode()) {
        this.discardedTracks.push({
          track: e,
          reason: "undecodable_source_codec",
          trackOptions: t
        });
        return;
      }
      let w = null;
      t.codec && (h = h.filter((C) => C === t.codec));
      const b = Zt(t.quality, t.bitrate) ?? new oe("high"), k = await ia(h, {
        numberOfChannels: t.process && t.processedNumberOfChannels ? t.processedNumberOfChannels : l,
        sampleRate: t.process && t.processedSampleRate ? t.processedSampleRate : u,
        quality: b
      });
      if (!k.some((C) => Gt.includes(C)) && h.some((C) => Gt.includes(C)) && (l !== nn || u !== sn)) {
        const P = (await ia(h, {
          numberOfChannels: nn,
          sampleRate: sn,
          quality: b
        })).find((S) => Gt.includes(S));
        P && (w = P, l = nn, u = sn);
      } else
        w = k[0] ?? null;
      if (w === null) {
        this.discardedTracks.push({
          track: e,
          reason: "no_encodable_target_codec",
          trackOptions: t
        });
        return;
      }
      const A = {
        codec: w,
        quality: b,
        transform: {
          sampleFormat: t.sampleFormat,
          process: t.process
        }
      };
      g(A.transform), l !== a && (A.transform.numberOfChannels = l), u !== o && (A.transform.sampleRate = u);
      let T = null;
      A.onEncodedSample = (C) => {
        T = C.timestamp;
      };
      const x = new Yf(A);
      s = x, this._registerTrackPump(async (C) => {
        const P = new dd(e);
        for await (const S of P.samples(this._startTimestamp, this._endTimestamp)) {
          const E = { stack: [], error: void 0, hasError: !1 };
          try {
            const I = mr(E, S, !1);
            if (this.state === "canceled")
              break;
            if (f) {
              const z = { stack: [], error: void 0, hasError: !1 };
              try {
                const j = c - this._startTimestamp, Z = Math.round(j * o), le = tt(I.format), _e = new Uint8Array(le * Z * a);
                (I.format === "u8" || I.format === "u8-planar") && _e.fill(2 ** 7);
                const ke = mr(z, new fe({
                  data: _e,
                  // Use the same format the decoder is spitting out. This avoids feeding changing sample
                  // formats to the audio encoder.
                  format: I.format,
                  numberOfChannels: a,
                  sampleRate: o,
                  timestamp: 0
                }), !1);
                await this._registerAudioSample(C, ke, x, i, () => T), f = !1;
              } catch (j) {
                z.error = j, z.hasError = !0;
              } finally {
                Lr(z);
              }
            }
            let _ = 0, F = I.numberOfFrames;
            I.timestamp < this._startTimestamp && (_ = Math.round((this._startTimestamp - I.timestamp) * I.sampleRate)), I.timestamp + I.duration > this._endTimestamp && (F = Math.round((this._endTimestamp - I.timestamp) * I.sampleRate));
            let O;
            if (_ > 0 || F < I.numberOfFrames) {
              const z = I.trim(_, F);
              if (I.close(), O = z, z.numberOfFrames === 0) {
                z.close();
                continue;
              }
            } else
              O = I;
            const D = mr(E, O, !1);
            D.setTimestamp(D.timestamp - this._startTimestamp), await this._registerAudioSample(C, D, x, i, () => T);
          } catch (I) {
            E.error = I, E.hasError = !0;
          } finally {
            Lr(E);
          }
        }
        x.close(), this._synchronizer.closeTrack(i);
      });
    }
    let p = null;
    !t.group && !this._composable && (p = new Ne());
    const m = await e.getLanguageCode();
    this.output.addAudioTrack(s, {
      // TODO: This condition can be removed when all demuxers properly homogenize to BCP47 in v2
      languageCode: Pr(m) ? m : void 0,
      name: await e.getName() ?? void 0,
      disposition: await e.getDisposition(),
      group: p ?? t.group
    }), this.utilizedTracks.push(e), this._outputTrackIds.push(i), this._outputOwnTrackGroups.push(p);
  }
  /** @internal */
  async _registerAudioSample(e, t, i, n, s) {
    this._reportProgress(n, t.timestamp + t.duration), await i.add(t), t.close();
    const a = s();
    a !== null && (this._synchronizer.shouldWait(n, a) && await this._synchronizer.wait(a), await this._checkpoint(e, a));
  }
  /** @internal */
  _registerTrackPump(e) {
    const t = {
      done: !1,
      resolvers: ne(),
      wake: null,
      start: () => {
        e(t).then(() => {
          t.done = !0, t.resolvers.resolve();
        }, (i) => {
          t.resolvers.reject(i);
        });
      }
    };
    this._trackPumps.push(t);
  }
  /** @internal */
  async _checkpoint(e, t) {
    for (; this.state !== "canceled" && (t >= this._executionUntil || this._pauseRequested); ) {
      e.resolvers.resolve();
      const { promise: i, resolve: n } = ne();
      e.wake = n, await i;
    }
  }
  /** @internal */
  _reportProgress(e, t) {
    if (!this._computeProgress)
      return;
    g(this._totalDuration !== null), this._maxTimestamps.set(e, Math.max(t, this._maxTimestamps.get(e)));
    const i = Math.min(...this._maxTimestamps.values()), n = ae(i / this._totalDuration, 0, 1);
    n !== this._lastProgress && (this._lastProgress = n, this.onProgress?.(n, i));
  }
}
class ba extends Error {
  /** Creates a new {@link ConversionCanceledError}. */
  constructor(e = "Conversion has been canceled.") {
    super(e), this.name = "ConversionCanceledError";
  }
}
const ka = 1;
class rh {
  constructor(e) {
    this.maxTimestamps = /* @__PURE__ */ new Map(), this.resolvers = [], this.conversion = e;
  }
  declareTrack(e) {
    this.maxTimestamps.set(e, 0);
  }
  shouldWait(e, t) {
    const i = this.maxTimestamps.get(e);
    g(i !== void 0), this.maxTimestamps.set(e, Math.max(t, i));
    const n = this.computeMinAndMaybeResolve();
    return this.conversion.state === "canceled" || this.conversion._pauseRequested || t >= this.conversion._executionUntil ? !1 : t - n > ka;
  }
  wait(e) {
    const { promise: t, resolve: i } = ne();
    return this.resolvers.push({
      timestamp: e,
      resolve: i
    }), t;
  }
  closeTrack(e) {
    this.maxTimestamps.delete(e), this.computeMinAndMaybeResolve();
  }
  resolveAll() {
    for (const e of this.resolvers)
      e.resolve();
    this.resolvers.length = 0;
  }
  computeMinAndMaybeResolve() {
    let e = 1 / 0;
    for (const [, t] of this.maxTimestamps)
      e = Math.min(e, t);
    for (let t = 0; t < this.resolvers.length; t++) {
      const i = this.resolvers[t];
      i.timestamp - e < ka && (i.resolve(), this.resolvers.splice(t, 1), t--);
    }
    return e;
  }
}
let an = null;
function on(...r) {
}
function Ta(...r) {
}
function Kr(r) {
  return Math.ceil(r / 2) * 2;
}
function ih(r) {
  switch (r) {
    case "high":
      return Yu;
    case "medium":
      return $u;
    case "low":
      return Xu;
  }
}
function nh(r, e) {
  if (r.size >= e.size)
    return { file: e, wasCompressed: !1 };
  const t = e.name.replace(/\.[^.]+$/, "");
  return { file: new File([r], `${t}_compressed.mp4`, { type: "video/mp4" }), wasCompressed: !0 };
}
async function sh() {
  an || (an = import("./mediabunny-aac-encoder-DKvBBm-8.js").then(({ registerAacEncoder: r }) => {
    r();
  })), await an;
}
class ah {
  constructor(e = Yo) {
    this.isUploadAborted = e;
  }
  abortController = null;
  abortRequested = !1;
  onProgress;
  abort() {
    this.abortRequested = !0, this.resetProgress(), this.abortController?.abort();
  }
  async cleanup() {
    this.abortController = null;
  }
  setProgressCallback(e) {
    this.onProgress = e;
  }
  resetProgress() {
    this.onProgress?.(0);
  }
  updateProgress(e) {
    this.onProgress?.(Math.round(e));
  }
  getAbortedResult(e) {
    return this.isUploadAborted() ? (this.resetProgress(), { file: e, wasCompressed: !1, wasSkipped: !0, aborted: !0 }) : null;
  }
  async canTranscodeVideo(e, t, i) {
    return await e.canDecode() ? zo("avc", { ...t, quality: i }) : !1;
  }
  async buildAudioOptions(e, t, i) {
    if (!e.codec || !await Fu(e.codec))
      return on("Audio decode is unavailable; preserving packets without transcoding.", { codec: e.codec }), {};
    const n = {
      numberOfChannels: t.audioChannels ?? e.numberOfChannels,
      sampleRate: t.audioSampleRate ?? e.sampleRate,
      bitrate: i
    };
    return await Cn("aac", n) || await sh(), await Cn("aac", n) ? { codec: "aac", forceTranscode: !0, ...n } : (on("AAC encoding is unavailable; preserving packets without transcoding.", { codec: e.codec }), {});
  }
  async buildVideoOptions(e, t, i) {
    const n = await e.getDisplayWidth(), s = await e.getDisplayHeight(), a = {
      codec: "avc",
      forceTranscode: !0,
      quality: i
    };
    n > s ? a.width = Math.min(n, t.maxSize) : a.height = Math.min(s, t.maxSize);
    let o = n, c = s;
    return a.width !== void 0 ? (o = Kr(a.width), c = Kr(Math.round(o / (n / s)))) : a.height !== void 0 && (c = Kr(a.height), o = Kr(Math.round(c * (n / s)))), { options: a, dimensions: { width: o, height: c } };
  }
  async outputPreservesAudio(e, t) {
    const i = new er({ source: new Ws(e), formats: Qs });
    try {
      return (await i.getAudioTracks()).length >= t;
    } finally {
      i.dispose();
    }
  }
  async compress(e, t) {
    let i = null;
    try {
      this.abortRequested = !1, this.abortController = new AbortController(), i = new er({ source: new Ws(e), formats: Qs });
      const n = await i.getVideoTracks(), s = await i.getAudioTracks(), a = ih(t.qualityPreset), o = n.length > 0 ? await this.buildVideoOptions(n[0], t, a) : null;
      if (!o || !await this.canTranscodeVideo(n[0], o.dimensions, a))
        return on("Required video decode or AVC encode capability is unavailable; skipping compression."), { file: e, wasCompressed: !1, wasSkipped: !0 };
      const c = new Zr(), l = new vn({ target: c, format: new ss({ fastStart: "in-memory" }) }), u = await as.init({
        input: i,
        output: l,
        video: async (h) => h === n[0] ? o.options : (await this.buildVideoOptions(h, t, a)).options,
        audio: (h) => this.buildAudioOptions(h, t, a),
        showWarnings: !1
      });
      if (!u.isValid || u.discardedTracks.some(({ track: h }) => h.isVideoTrack() || h.isAudioTrack()))
        return Ta("MediaBunny cannot preserve all required tracks; skipping compression.", u.discardedTracks), { file: e, wasCompressed: !1, wasSkipped: !0 };
      u.onProgress = (h) => this.updateProgress(h * 100), this.abortController.signal.addEventListener("abort", () => void u.cancel(), { once: !0 }), await u.execute();
      const d = this.abortRequested ? (this.resetProgress(), { file: e, wasCompressed: !1, wasSkipped: !0, aborted: !0 }) : this.getAbortedResult(e);
      if (d) return d;
      if (!c.buffer) throw new Error("MediaBunny did not produce an output buffer.");
      const f = nh(new Blob([c.buffer], { type: "video/mp4" }), e);
      return f.wasCompressed ? s.length > 0 && !await this.outputPreservesAudio(f.file, s.length) ? (Ta("MediaBunny output lost input audio; keeping the original file."), { file: e, wasCompressed: !1, wasSkipped: !0 }) : (this.updateProgress(100), f) : f;
    } catch {
      const s = this.abortRequested ? (this.resetProgress(), { file: e, wasCompressed: !1, wasSkipped: !0, aborted: !0 }) : this.getAbortedResult(e);
      return s || { file: e, wasCompressed: !1, wasSkipped: !0 };
    } finally {
      i?.dispose(), this.abortController = null;
    }
  }
}
const lh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  MediaBunnyCompression: ah
}, Symbol.toStringTag, { value: "Module" }));
export {
  ed as C,
  Y as E,
  q as L,
  lh as m,
  ch as r
};
