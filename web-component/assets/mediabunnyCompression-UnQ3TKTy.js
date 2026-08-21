import { i as bn, f5 as Je, f6 as wn, f7 as yn } from "./App-qNXS1jWJ.js";
import { B as Tn } from "./baseCompression-CbXukwNa.js";
function m(r) {
  if (!r)
    throw new Error("Assertion failed.");
}
const li = (r) => {
  const e = (r % 360 + 360) % 360;
  if (e === 0 || e === 90 || e === 180 || e === 270)
    return e;
  throw new Error(`Invalid rotation ${r}.`);
}, K = (r) => r && r[r.length - 1], Ft = (r) => r >= 0 && r < 2 ** 32;
class Q {
  constructor(e) {
    this.bytes = e, this.pos = 0;
  }
  seekToByte(e) {
    this.pos = 8 * e;
  }
  readBit() {
    const e = Math.floor(this.pos / 8), t = this.bytes[e] ?? 0, i = 7 - (this.pos & 7), s = (t & 1 << i) >> i;
    return this.pos++, s;
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
    for (let s = this.pos; s < i; s++) {
      const n = Math.floor(s / 8);
      let a = this.bytes[n];
      const o = 7 - (s & 7);
      a &= ~(1 << o), a |= (t & 1 << i - s - 1) >> i - s - 1 << o, this.bytes[n] = a;
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
const I = (r) => {
  let e = 0;
  for (; r.readBits(1) === 0 && e < 32; )
    e++;
  if (e >= 32)
    throw new Error("Invalid exponential-Golomb code.");
  return (1 << e) - 1 + r.readBits(e);
}, Ne = (r) => {
  const e = I(r);
  return (e & 1) === 0 ? -(e >> 1) : e + 1 >> 1;
}, he = (r) => r.constructor === Uint8Array ? r : ArrayBuffer.isView(r) ? new Uint8Array(r.buffer, r.byteOffset, r.byteLength) : new Uint8Array(r), G = (r) => r.constructor === DataView ? r : ArrayBuffer.isView(r) ? new DataView(r.buffer, r.byteOffset, r.byteLength) : new DataView(r), ge = /* @__PURE__ */ new TextDecoder(), Ce = /* @__PURE__ */ new TextEncoder(), ui = (r) => Object.fromEntries(Object.entries(r).map(([e, t]) => [t, e])), Xt = {
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
}, or = /* @__PURE__ */ ui(Xt), Yt = {
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
}, cr = /* @__PURE__ */ ui(Yt), Zt = {
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
}, lr = /* @__PURE__ */ ui(Zt), Sn = (r) => !!r && !!r.primaries && !!r.transfer && !!r.matrix && r.fullRange !== void 0, kr = (r) => r instanceof ArrayBuffer || typeof SharedArrayBuffer < "u" && r instanceof SharedArrayBuffer || ArrayBuffer.isView(r);
class ut {
  constructor() {
    this.currentPromise = Promise.resolve(), this.pending = 0;
  }
  async acquire() {
    let e;
    const t = new Promise((s) => {
      let n = !1;
      e = () => {
        n || (s(), this.pending--, n = !0);
      };
    }), i = this.currentPromise;
    return this.currentPromise = t, this.pending++, await i, e;
  }
}
const Di = (r) => [...r].map((e) => e.toString(16).padStart(2, "0")).join(""), Mi = (r) => (r = r >> 1 & 1431655765 | (r & 1431655765) << 1, r = r >> 2 & 858993459 | (r & 858993459) << 2, r = r >> 4 & 252645135 | (r & 252645135) << 4, r = r >> 8 & 16711935 | (r & 16711935) << 8, r = r >> 16 & 65535 | (r & 65535) << 16, r >>> 0), Jt = (r, e, t) => {
  let i = 0, s = r.length - 1, n = -1;
  for (; i <= s; ) {
    const a = i + s >> 1, o = t(r[a]);
    o === e ? (n = a, s = a - 1) : o < e ? i = a + 1 : s = a - 1;
  }
  return n;
}, L = (r, e, t) => {
  let i = 0, s = r.length - 1, n = -1;
  for (; i <= s; ) {
    const a = i + (s - i + 1) / 2 | 0;
    t(r[a]) <= e ? (n = a, i = a + 1) : s = a - 1;
  }
  return n;
}, Oi = (r, e, t) => {
  const i = L(r, t(e), t);
  r.splice(i + 1, 0, e);
}, se = () => {
  let r, e;
  return { promise: new Promise((i, s) => {
    r = i, e = s;
  }), resolve: r, reject: e };
}, ms = (r, e) => {
  for (let t = r.length - 1; t >= 0; t--)
    if (e(r[t]))
      return r[t];
}, di = (r, e) => {
  for (let t = r.length - 1; t >= 0; t--)
    if (e(r[t]))
      return t;
  return -1;
}, Pn = async function* (r) {
  Symbol.iterator in r ? yield* r[Symbol.iterator]() : yield* r[Symbol.asyncIterator]();
}, xn = (r) => {
  if (!(Symbol.iterator in r) && !(Symbol.asyncIterator in r))
    throw new TypeError("Argument must be an iterable or async iterable.");
}, Ge = (r) => {
  throw new Error(`Unexpected value: ${r}`);
}, br = (r, e, t) => {
  const i = r.getUint8(e), s = r.getUint8(e + 1), n = r.getUint8(e + 2);
  return t ? i | s << 8 | n << 16 : i << 16 | s << 8 | n;
}, Cn = (r, e, t) => br(r, e, t) << 8 >> 8, hi = (r, e, t, i) => {
  t = t >>> 0, t = t & 16777215, i ? (r.setUint8(e, t & 255), r.setUint8(e + 1, t >>> 8 & 255), r.setUint8(e + 2, t >>> 16 & 255)) : (r.setUint8(e, t >>> 16 & 255), r.setUint8(e + 1, t >>> 8 & 255), r.setUint8(e + 2, t & 255));
}, vn = (r, e, t, i) => {
  t = ee(t, -8388608, 8388607), t < 0 && (t = t + 16777216 & 16777215), hi(r, e, t, i);
}, Ni = (r, e) => ({
  async next() {
    const t = await r.next();
    return t.done ? { value: void 0, done: !0 } : { value: e(t.value), done: !1 };
  },
  return() {
    return r.return();
  },
  throw(t) {
    return r.throw(t);
  },
  [Symbol.asyncIterator]() {
    return this;
  }
}), ee = (r, e, t) => Math.max(e, Math.min(t, r)), de = "und", qt = (r) => {
  const e = Math.round(r);
  return Math.abs(r / e - 1) < 10 * Number.EPSILON ? e : r;
}, ps = (r, e) => Math.round(r / e) * e, In = (r) => {
  let e = 0;
  for (; r; )
    e++, r >>= 1;
  return e;
}, _n = /^[a-z]{3}$/, jt = (r) => _n.test(r), je = 1e6 * (1 + Number.EPSILON), En = (r, e) => {
  const t = r < 0 ? -1 : 1;
  r = Math.abs(r);
  let i = 0, s = 1, n = 1, a = 0, o = r;
  for (; ; ) {
    const c = Math.floor(o), l = c * n + i, u = c * a + s;
    if (u > e)
      return {
        numerator: t * n,
        denominator: a
      };
    if (i = n, s = a, n = l, a = u, o = 1 / (o - c), !isFinite(o))
      break;
  }
  return {
    numerator: t * n,
    denominator: a
  };
};
class wr {
  constructor() {
    this.currentPromise = Promise.resolve();
  }
  call(e) {
    return this.currentPromise = this.currentPromise.then(e);
  }
}
let Pr = null;
const Vt = () => Pr !== null ? Pr : Pr = !!(typeof navigator < "u" && (navigator.vendor?.match(/apple/i) || /AppleWebKit/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) || /\b(iPad|iPhone|iPod)\b/.test(navigator.userAgent)));
let xr = null;
const At = () => xr !== null ? xr : xr = typeof navigator < "u" && navigator.userAgent?.includes("Firefox");
let Cr = null;
const qr = () => Cr !== null ? Cr : Cr = !!(typeof navigator < "u" && (navigator.vendor?.includes("Google Inc") || /Chrome/.test(navigator.userAgent)));
let vr = null;
const Fn = () => {
  if (vr !== null)
    return vr;
  if (typeof navigator > "u")
    return null;
  const r = /\bChrome\/(\d+)/.exec(navigator.userAgent);
  return r ? vr = Number(r[1]) : null;
}, pt = (r, e) => r !== -1 ? r : e, Vi = (r, e, t, i) => r <= i && t <= e, gs = function* (r) {
  for (const e in r) {
    const t = r[e];
    t !== void 0 && (yield { key: e, value: t });
  }
}, An = (r) => {
  const e = atob(r), t = new Uint8Array(e.length);
  for (let i = 0; i < e.length; i++)
    t[i] = e.charCodeAt(i);
  return t;
}, ks = () => {
  Symbol.dispose ??= Symbol("Symbol.dispose");
}, bs = (r) => typeof r == "number" && !Number.isNaN(r);
class It {
  /** Creates a new {@link RichImageData}. */
  constructor(e, t) {
    if (this.data = e, this.mimeType = t, !(e instanceof Uint8Array))
      throw new TypeError("data must be a Uint8Array.");
    if (typeof t != "string")
      throw new TypeError("mimeType must be a string.");
  }
}
class ws {
  /** Creates a new {@link AttachedFile}. */
  constructor(e, t, i, s) {
    if (this.data = e, this.mimeType = t, this.name = i, this.description = s, !(e instanceof Uint8Array))
      throw new TypeError("data must be a Uint8Array.");
    if (t !== void 0 && typeof t != "string")
      throw new TypeError("mimeType, when provided, must be a string.");
    if (i !== void 0 && typeof i != "string")
      throw new TypeError("name, when provided, must be a string.");
    if (s !== void 0 && typeof s != "string")
      throw new TypeError("description, when provided, must be a string.");
  }
}
const jr = (r) => {
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
      if (e !== null && typeof e != "string" && !(e instanceof Uint8Array) && !(e instanceof It) && !(e instanceof ws))
        throw new TypeError("Each value in tags.raw must be a string, Uint8Array, RichImageData, AttachedFile, or null.");
  }
}, Xe = {
  default: !0,
  forced: !1,
  original: !1,
  commentary: !1,
  hearingImpaired: !1,
  visuallyImpaired: !1
}, Bn = (r) => {
  if (!r || typeof r != "object")
    throw new TypeError("disposition must be an object.");
  if (r.default !== void 0 && typeof r.default != "boolean")
    throw new TypeError("disposition.default must be a boolean.");
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
const Ie = [
  "avc",
  "hevc",
  "vp9",
  "av1",
  "vp8"
], oe = [
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
], Ut = [
  "aac",
  "opus",
  "mp3",
  "vorbis",
  "flac"
], _e = [
  ...Ut,
  ...oe
], ur = [
  "webvtt"
], dr = [
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
], Ui = [
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
], $e = [
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
], Li = [
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
], Wi = ".01.01.01.01.00", Hi = ".0.110.01.01.01.0", Rn = (r, e, t, i) => {
  if (r === "avc") {
    const n = Math.ceil(e / 16) * Math.ceil(t / 16), a = dr.find((d) => n <= d.maxMacroblocks && i <= d.maxBitrate) ?? K(dr), o = a ? a.level : 0, c = "64".padStart(2, "0"), l = "00", u = o.toString(16).padStart(2, "0");
    return `avc1.${c}${l}${u}`;
  } else if (r === "hevc") {
    const o = e * t, c = Ui.find((u) => o <= u.maxPictureSize && i <= u.maxBitrate) ?? K(Ui);
    return `hev1.1.6.${c.tier}${c.level}.B0`;
  } else {
    if (r === "vp8")
      return "vp8";
    if (r === "vp9") {
      const n = e * t;
      return `vp09.00.${($e.find((c) => n <= c.maxPictureSize && i <= c.maxBitrate) ?? K($e)).level.toString().padStart(2, "0")}.08`;
    } else if (r === "av1") {
      const n = e * t, a = Li.find((l) => n <= l.maxPictureSize && i <= l.maxBitrate) ?? K(Li);
      return `av01.0.${a.level.toString().padStart(2, "0")}${a.tier}.08`;
    }
  }
  throw new TypeError(`Unhandled codec '${r}'.`);
}, zn = (r) => {
  const e = r.split("."), s = (1 << 7) + 1, n = Number(e[1]), a = e[2], o = Number(a.slice(0, -1)), c = (n << 5) + o, l = a.slice(-1) === "H" ? 1 : 0, d = Number(e[3]) === 8 ? 0 : 1, h = 0, f = e[4] ? Number(e[4]) : 0, p = e[5] ? Number(e[5][0]) : 1, g = e[5] ? Number(e[5][1]) : 1, k = e[5] ? Number(e[5][2]) : 0, w = (l << 7) + (d << 6) + (h << 5) + (f << 4) + (p << 3) + (g << 2) + k;
  return [s, c, w, 0];
}, fi = (r) => {
  const { codec: e, codecDescription: t, colorSpace: i, avcCodecInfo: s, hevcCodecInfo: n, vp9CodecInfo: a, av1CodecInfo: o } = r;
  if (e === "avc") {
    if (m(r.avcType !== null), s) {
      const c = new Uint8Array([
        s.avcProfileIndication,
        s.profileCompatibility,
        s.avcLevelIndication
      ]);
      return `avc${r.avcType}.${Di(c)}`;
    }
    if (!t || t.byteLength < 4)
      throw new TypeError("AVC decoder description is not provided or is not at least 4 bytes long.");
    return `avc${r.avcType}.${Di(t.subarray(1, 4))}`;
  } else if (e === "hevc") {
    let c, l, u, d, h, f;
    if (n)
      c = n.generalProfileSpace, l = n.generalProfileIdc, u = Mi(n.generalProfileCompatibilityFlags), d = n.generalTierFlag, h = n.generalLevelIdc, f = [...n.generalConstraintIndicatorFlags];
    else {
      if (!t || t.byteLength < 23)
        throw new TypeError("HEVC decoder description is not provided or is not at least 23 bytes long.");
      const g = G(t), k = g.getUint8(1);
      c = k >> 6 & 3, l = k & 31, u = Mi(g.getUint32(2)), d = k >> 5 & 1, h = g.getUint8(12), f = [];
      for (let w = 0; w < 6; w++)
        f.push(g.getUint8(6 + w));
    }
    let p = "hev1.";
    for (p += ["", "A", "B", "C"][c] + l, p += ".", p += u.toString(16).toUpperCase(), p += ".", p += d === 0 ? "L" : "H", p += h; f.length > 0 && f[f.length - 1] === 0; )
      f.pop();
    return f.length > 0 && (p += ".", p += f.map((g) => g.toString(16).toUpperCase()).join(".")), p;
  } else {
    if (e === "vp8")
      return "vp8";
    if (e === "vp9") {
      if (!a) {
        const w = r.width * r.height;
        let b = K($e).level;
        for (const y of $e)
          if (w <= y.maxPictureSize) {
            b = y.level;
            break;
          }
        return `vp09.00.${b.toString().padStart(2, "0")}.08`;
      }
      const c = a.profile.toString().padStart(2, "0"), l = a.level.toString().padStart(2, "0"), u = a.bitDepth.toString().padStart(2, "0"), d = a.chromaSubsampling.toString().padStart(2, "0"), h = a.colourPrimaries.toString().padStart(2, "0"), f = a.transferCharacteristics.toString().padStart(2, "0"), p = a.matrixCoefficients.toString().padStart(2, "0"), g = a.videoFullRangeFlag.toString().padStart(2, "0");
      let k = `vp09.${c}.${l}.${u}.${d}`;
      return k += `.${h}.${f}.${p}.${g}`, k.endsWith(Wi) && (k = k.slice(0, -Wi.length)), k;
    } else if (e === "av1") {
      if (!o) {
        const y = r.width * r.height;
        let T = K($e).level;
        for (const x of $e)
          if (y <= x.maxPictureSize) {
            T = x.level;
            break;
          }
        return `av01.0.${T.toString().padStart(2, "0")}M.08`;
      }
      const c = o.profile, l = o.level.toString().padStart(2, "0"), u = o.tier ? "H" : "M", d = o.bitDepth.toString().padStart(2, "0"), h = o.monochrome ? "1" : "0", f = 100 * o.chromaSubsamplingX + 10 * o.chromaSubsamplingY + 1 * (o.chromaSubsamplingX && o.chromaSubsamplingY ? o.chromaSamplePosition : 0), p = i?.primaries ? Xt[i.primaries] : 1, g = i?.transfer ? Yt[i.transfer] : 1, k = i?.matrix ? Zt[i.matrix] : 1, w = i?.fullRange ? 1 : 0;
      let b = `av01.${c}.${l}${u}.${d}`;
      return b += `.${h}.${f.toString().padStart(3, "0")}`, b += `.${p.toString().padStart(2, "0")}`, b += `.${g.toString().padStart(2, "0")}`, b += `.${k.toString().padStart(2, "0")}`, b += `.${w}`, b.endsWith(Hi) && (b = b.slice(0, -Hi.length)), b;
    }
  }
  throw new TypeError(`Unhandled codec '${e}'.`);
}, Dn = (r, e, t) => {
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
  if (oe.includes(r))
    return r;
  throw new TypeError(`Unhandled codec '${r}'.`);
}, mi = (r) => {
  const { codec: e, codecDescription: t, aacCodecInfo: i } = r;
  if (e === "aac") {
    if (!i)
      throw new TypeError("AAC codec info must be provided.");
    if (i.isMpeg2)
      return "mp4a.67";
    {
      let s;
      return i.objectType !== null ? s = i.objectType : s = pi(t).objectType, `mp4a.40.${s}`;
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
    if (e && oe.includes(e))
      return e;
  }
  throw new TypeError(`Unhandled codec '${e}'.`);
}, ot = [
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
], er = [-1, 1, 2, 3, 4, 5, 6, 8], pi = (r) => {
  if (!r || r.byteLength < 2)
    throw new TypeError("AAC description must be at least 2 bytes long.");
  const e = new Q(r);
  let t = e.readBits(5);
  t === 31 && (t = 32 + e.readBits(6));
  const i = e.readBits(4);
  let s = null;
  i === 15 ? s = e.readBits(24) : i < ot.length && (s = ot[i]);
  const n = e.readBits(4);
  let a = null;
  return n >= 1 && n <= 7 && (a = er[n]), {
    objectType: t,
    frequencyIndex: i,
    sampleRate: s,
    channelConfiguration: n,
    numberOfChannels: a
  };
}, ys = (r) => {
  let e = ot.indexOf(r.sampleRate), t = null;
  e === -1 && (e = 15, t = r.sampleRate);
  const i = er.indexOf(r.numberOfChannels);
  if (i === -1)
    throw new TypeError(`Unsupported number of channels: ${r.numberOfChannels}`);
  let s = 13;
  r.objectType >= 32 && (s += 6), e === 15 && (s += 24);
  const n = Math.ceil(s / 8), a = new Uint8Array(n), o = new Q(a);
  return r.objectType < 32 ? o.writeBits(5, r.objectType) : (o.writeBits(5, 31), o.writeBits(6, r.objectType - 32)), o.writeBits(4, e), e === 15 && o.writeBits(24, t), o.writeBits(4, i), a;
}, yr = 48e3, Ts = /^pcm-([usf])(\d+)+(be)?$/, Ye = (r) => {
  if (m(oe.includes(r)), r === "ulaw")
    return { dataType: "ulaw", sampleSize: 1, littleEndian: !0, silentValue: 255 };
  if (r === "alaw")
    return { dataType: "alaw", sampleSize: 1, littleEndian: !0, silentValue: 213 };
  const e = Ts.exec(r);
  m(e);
  let t;
  e[1] === "u" ? t = "unsigned" : e[1] === "s" ? t = "signed" : t = "float";
  const i = Number(e[2]) / 8, s = e[3] !== "be", n = r === "pcm-u8" ? 2 ** 7 : 0;
  return { dataType: t, sampleSize: i, littleEndian: s, silentValue: n };
}, Ss = (r) => r.startsWith("avc1") || r.startsWith("avc3") ? "avc" : r.startsWith("hev1") || r.startsWith("hvc1") ? "hevc" : r === "vp8" ? "vp8" : r.startsWith("vp09") ? "vp9" : r.startsWith("av01") ? "av1" : r.startsWith("mp4a.40") || r === "mp4a.67" ? "aac" : r === "mp3" || r === "mp4a.69" || r === "mp4a.6B" || r === "mp4a.6b" ? "mp3" : r === "opus" ? "opus" : r === "vorbis" ? "vorbis" : r === "flac" ? "flac" : r === "ulaw" ? "ulaw" : r === "alaw" ? "alaw" : Ts.test(r) ? r : r === "webvtt" ? "webvtt" : null, Mn = (r) => r === "avc" ? {
  avc: {
    format: "avc"
    // Ensure the format is not Annex B
  }
} : r === "hevc" ? {
  hevc: {
    format: "hevc"
    // Ensure the format is not Annex B
  }
} : {}, On = (r) => r === "aac" ? {
  aac: {
    format: "aac"
    // Ensure the format is not ADTS
  }
} : r === "opus" ? {
  opus: {
    format: "opus"
  }
} : {}, Nn = ["avc1", "avc3", "hev1", "hvc1", "vp8", "vp09", "av01"], Vn = /^(avc1|avc3)\.[0-9a-fA-F]{6}$/, Un = /^(hev1|hvc1)\.(?:[ABC]?\d+)\.[0-9a-fA-F]{1,8}\.[LH]\d+(?:\.[0-9a-fA-F]{1,2}){0,6}$/, Ln = /^vp09(?:\.\d{2}){3}(?:(?:\.\d{2}){5})?$/, Wn = /^av01\.\d\.\d{2}[MH]\.\d{2}(?:\.\d\.\d{3}\.\d{2}\.\d{2}\.\d{2}\.\d)?$/, Hn = (r) => {
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
  if (!Nn.some((e) => r.decoderConfig.codec.startsWith(e)))
    throw new TypeError("Video chunk metadata decoder configuration codec string must be a valid video codec string as specified in the WebCodecs Codec Registry.");
  if (!Number.isInteger(r.decoderConfig.codedWidth) || r.decoderConfig.codedWidth <= 0)
    throw new TypeError("Video chunk metadata decoder configuration must specify a valid codedWidth (positive integer).");
  if (!Number.isInteger(r.decoderConfig.codedHeight) || r.decoderConfig.codedHeight <= 0)
    throw new TypeError("Video chunk metadata decoder configuration must specify a valid codedHeight (positive integer).");
  if (r.decoderConfig.description !== void 0 && !kr(r.decoderConfig.description))
    throw new TypeError("Video chunk metadata decoder configuration description, when defined, must be an ArrayBuffer or an ArrayBuffer view.");
  if (r.decoderConfig.colorSpace !== void 0) {
    const { colorSpace: e } = r.decoderConfig;
    if (typeof e != "object")
      throw new TypeError("Video chunk metadata decoder configuration colorSpace, when provided, must be an object.");
    const t = Object.keys(Xt);
    if (e.primaries != null && !t.includes(e.primaries))
      throw new TypeError(`Video chunk metadata decoder configuration colorSpace primaries, when defined, must be one of ${t.join(", ")}.`);
    const i = Object.keys(Yt);
    if (e.transfer != null && !i.includes(e.transfer))
      throw new TypeError(`Video chunk metadata decoder configuration colorSpace transfer, when defined, must be one of ${i.join(", ")}.`);
    const s = Object.keys(Zt);
    if (e.matrix != null && !s.includes(e.matrix))
      throw new TypeError(`Video chunk metadata decoder configuration colorSpace matrix, when defined, must be one of ${s.join(", ")}.`);
    if (e.fullRange != null && typeof e.fullRange != "boolean")
      throw new TypeError("Video chunk metadata decoder configuration colorSpace fullRange, when defined, must be a boolean.");
  }
  if (r.decoderConfig.codec.startsWith("avc1") || r.decoderConfig.codec.startsWith("avc3")) {
    if (!Vn.test(r.decoderConfig.codec))
      throw new TypeError("Video chunk metadata decoder configuration codec string for AVC must be a valid AVC codec string as specified in Section 3.4 of RFC 6381.");
  } else if (r.decoderConfig.codec.startsWith("hev1") || r.decoderConfig.codec.startsWith("hvc1")) {
    if (!Un.test(r.decoderConfig.codec))
      throw new TypeError("Video chunk metadata decoder configuration codec string for HEVC must be a valid HEVC codec string as specified in Section E.3 of ISO 14496-15.");
  } else if (r.decoderConfig.codec.startsWith("vp8")) {
    if (r.decoderConfig.codec !== "vp8")
      throw new TypeError('Video chunk metadata decoder configuration codec string for VP8 must be "vp8".');
  } else if (r.decoderConfig.codec.startsWith("vp09")) {
    if (!Ln.test(r.decoderConfig.codec))
      throw new TypeError('Video chunk metadata decoder configuration codec string for VP9 must be a valid VP9 codec string as specified in Section "Codecs Parameter String" of https://www.webmproject.org/vp9/mp4/.');
  } else if (r.decoderConfig.codec.startsWith("av01") && !Wn.test(r.decoderConfig.codec))
    throw new TypeError('Video chunk metadata decoder configuration codec string for AV1 must be a valid AV1 codec string as specified in Section "Codecs Parameter String" of https://aomediacodec.github.io/av1-isobmff/.');
}, qn = ["mp4a", "mp3", "opus", "vorbis", "flac", "ulaw", "alaw", "pcm"], jn = (r) => {
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
  if (!qn.some((e) => r.decoderConfig.codec.startsWith(e)))
    throw new TypeError("Audio chunk metadata decoder configuration codec string must be a valid audio codec string as specified in the WebCodecs Codec Registry.");
  if (!Number.isInteger(r.decoderConfig.sampleRate) || r.decoderConfig.sampleRate <= 0)
    throw new TypeError("Audio chunk metadata decoder configuration must specify a valid sampleRate (positive integer).");
  if (!Number.isInteger(r.decoderConfig.numberOfChannels) || r.decoderConfig.numberOfChannels <= 0)
    throw new TypeError("Audio chunk metadata decoder configuration must specify a valid numberOfChannels (positive integer).");
  if (r.decoderConfig.description !== void 0 && !kr(r.decoderConfig.description))
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
  } else if ((r.decoderConfig.codec.startsWith("pcm") || r.decoderConfig.codec.startsWith("ulaw") || r.decoderConfig.codec.startsWith("alaw")) && !oe.includes(r.decoderConfig.codec))
    throw new TypeError(`Audio chunk metadata decoder configuration codec string for PCM must be one of the supported PCM codecs (${oe.join(", ")}).`);
}, $n = (r) => {
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
class Qn {
  constructor(e) {
    this.mutex = new ut(), this.firstMediaStreamTimestamp = null, this.trackTimestampInfo = /* @__PURE__ */ new WeakMap(), this.output = e;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onTrackClose(e) {
  }
  validateAndNormalizeTimestamp(e, t, i) {
    t += e.source._timestampOffset;
    let s = this.trackTimestampInfo.get(e);
    if (!s) {
      if (!i)
        throw new Error("First packet must be a key packet.");
      s = {
        maxTimestamp: t,
        maxTimestampBeforeLastKeyPacket: t
      }, this.trackTimestampInfo.set(e, s);
    }
    if (t < 0)
      throw new Error(`Timestamps must be non-negative (got ${t}s).`);
    if (i && (s.maxTimestampBeforeLastKeyPacket = s.maxTimestamp), t < s.maxTimestampBeforeLastKeyPacket)
      throw new Error(`Timestamps cannot be smaller than the largest timestamp of the previous GOP (a GOP begins with a key packet and ends right before the next key packet). Got ${t}s, but largest timestamp is ${s.maxTimestampBeforeLastKeyPacket}s.`);
    return s.maxTimestamp = Math.max(s.maxTimestamp, t), t;
  }
}
var ve;
(function(r) {
  r[r.NON_IDR_SLICE = 1] = "NON_IDR_SLICE", r[r.SLICE_DPA = 2] = "SLICE_DPA", r[r.SLICE_DPB = 3] = "SLICE_DPB", r[r.SLICE_DPC = 4] = "SLICE_DPC", r[r.IDR = 5] = "IDR", r[r.SEI = 6] = "SEI", r[r.SPS = 7] = "SPS", r[r.PPS = 8] = "PPS", r[r.AUD = 9] = "AUD", r[r.SPS_EXT = 13] = "SPS_EXT";
})(ve || (ve = {}));
var ne;
(function(r) {
  r[r.RASL_N = 8] = "RASL_N", r[r.RASL_R = 9] = "RASL_R", r[r.BLA_W_LP = 16] = "BLA_W_LP", r[r.RSV_IRAP_VCL23 = 23] = "RSV_IRAP_VCL23", r[r.VPS_NUT = 32] = "VPS_NUT", r[r.SPS_NUT = 33] = "SPS_NUT", r[r.PPS_NUT = 34] = "PPS_NUT", r[r.AUD_NUT = 35] = "AUD_NUT", r[r.PREFIX_SEI_NUT = 39] = "PREFIX_SEI_NUT", r[r.SUFFIX_SEI_NUT = 40] = "SUFFIX_SEI_NUT";
})(ne || (ne = {}));
const tr = function* (r) {
  let e = 0, t = -1;
  for (; e < r.length - 2; ) {
    const i = r.indexOf(0, e);
    if (i === -1 || i >= r.length - 2)
      break;
    e = i;
    let s = 0;
    if (e + 3 < r.length && r[e + 1] === 0 && r[e + 2] === 0 && r[e + 3] === 1 ? s = 4 : r[e + 1] === 0 && r[e + 2] === 1 && (s = 3), s === 0) {
      e++;
      continue;
    }
    t !== -1 && e > t && (yield {
      offset: t,
      length: e - t
    }), t = e + s, e = t;
  }
  t !== -1 && t < r.length && (yield {
    offset: t,
    length: r.length - t
  });
}, Ps = function* (r, e) {
  let t = 0;
  const i = new DataView(r.buffer, r.byteOffset, r.byteLength);
  for (; t + e <= r.length; ) {
    let s;
    e === 1 ? s = i.getUint8(t) : e === 2 ? s = i.getUint16(t, !1) : e === 3 ? s = br(i, t, !1) : (m(e === 4), s = i.getUint32(t, !1)), t += e, yield {
      offset: t,
      length: s
    }, t += s;
  }
}, xs = (r, e) => {
  if (e.description) {
    const s = (he(e.description)[4] & 3) + 1;
    return Ps(r, s);
  } else
    return tr(r);
}, Kn = function* (r) {
  yield* tr(r);
}, Tr = (r) => r & 31, Sr = (r) => {
  const e = [], t = r.length;
  for (let i = 0; i < t; i++)
    i + 2 < t && r[i] === 0 && r[i + 1] === 0 && r[i + 2] === 3 ? (e.push(0, 0), i += 2) : e.push(r[i]);
  return new Uint8Array(e);
}, Ir = new Uint8Array([0, 0, 0, 1]), Gn = (r) => {
  const e = r.reduce((s, n) => s + Ir.byteLength + n.byteLength, 0), t = new Uint8Array(e);
  let i = 0;
  for (const s of r)
    t.set(Ir, i), i += Ir.byteLength, t.set(s, i), i += s.byteLength;
  return t;
}, Cs = (r, e) => {
  const t = r.reduce((n, a) => n + e + a.byteLength, 0), i = new Uint8Array(t);
  let s = 0;
  for (const n of r) {
    const a = new DataView(i.buffer, i.byteOffset, i.byteLength);
    switch (e) {
      case 1:
        a.setUint8(s, n.byteLength);
        break;
      case 2:
        a.setUint16(s, n.byteLength, !1);
        break;
      case 3:
        hi(a, s, n.byteLength, !1);
        break;
      case 4:
        a.setUint32(s, n.byteLength, !1);
        break;
    }
    s += e, i.set(n, s), s += n.byteLength;
  }
  return i;
}, Xn = (r, e) => {
  if (e.description) {
    const s = (he(e.description)[4] & 3) + 1;
    return Cs(r, s);
  } else
    return Gn(r);
}, gi = (r) => {
  try {
    const e = [], t = [], i = [];
    for (const o of Kn(r)) {
      const c = r.subarray(o.offset, o.offset + o.length), l = Tr(c[0]);
      l === ve.SPS ? e.push(c) : l === ve.PPS ? t.push(c) : l === ve.SPS_EXT && i.push(c);
    }
    if (e.length === 0 || t.length === 0)
      return null;
    const s = e[0], n = ki(s);
    m(n !== null);
    const a = n.profileIdc === 100 || n.profileIdc === 110 || n.profileIdc === 122 || n.profileIdc === 144;
    return {
      configurationVersion: 1,
      avcProfileIndication: n.profileIdc,
      profileCompatibility: n.constraintFlags,
      avcLevelIndication: n.levelIdc,
      lengthSizeMinusOne: 3,
      // Typically 4 bytes for length field
      sequenceParameterSets: e,
      pictureParameterSets: t,
      chromaFormat: a ? n.chromaFormatIdc : null,
      bitDepthLumaMinus8: a ? n.bitDepthLumaMinus8 : null,
      bitDepthChromaMinus8: a ? n.bitDepthChromaMinus8 : null,
      sequenceParameterSetExt: a ? i : null
    };
  } catch (e) {
    return console.error("Error building AVC Decoder Configuration Record:", e), null;
  }
}, Yn = (r) => {
  const e = [];
  e.push(r.configurationVersion), e.push(r.avcProfileIndication), e.push(r.profileCompatibility), e.push(r.avcLevelIndication), e.push(252 | r.lengthSizeMinusOne & 3), e.push(224 | r.sequenceParameterSets.length & 31);
  for (const t of r.sequenceParameterSets) {
    const i = t.byteLength;
    e.push(i >> 8), e.push(i & 255);
    for (let s = 0; s < i; s++)
      e.push(t[s]);
  }
  e.push(r.pictureParameterSets.length);
  for (const t of r.pictureParameterSets) {
    const i = t.byteLength;
    e.push(i >> 8), e.push(i & 255);
    for (let s = 0; s < i; s++)
      e.push(t[s]);
  }
  if (r.avcProfileIndication === 100 || r.avcProfileIndication === 110 || r.avcProfileIndication === 122 || r.avcProfileIndication === 144) {
    m(r.chromaFormat !== null), m(r.bitDepthLumaMinus8 !== null), m(r.bitDepthChromaMinus8 !== null), m(r.sequenceParameterSetExt !== null), e.push(252 | r.chromaFormat & 3), e.push(248 | r.bitDepthLumaMinus8 & 7), e.push(248 | r.bitDepthChromaMinus8 & 7), e.push(r.sequenceParameterSetExt.length);
    for (const t of r.sequenceParameterSetExt) {
      const i = t.byteLength;
      e.push(i >> 8), e.push(i & 255);
      for (let s = 0; s < i; s++)
        e.push(t[s]);
    }
  }
  return new Uint8Array(e);
}, Zn = (r) => {
  try {
    const e = G(r);
    let t = 0;
    const i = e.getUint8(t++), s = e.getUint8(t++), n = e.getUint8(t++), a = e.getUint8(t++), o = e.getUint8(t++) & 3, c = e.getUint8(t++) & 31, l = [];
    for (let f = 0; f < c; f++) {
      const p = e.getUint16(t, !1);
      t += 2, l.push(r.subarray(t, t + p)), t += p;
    }
    const u = e.getUint8(t++), d = [];
    for (let f = 0; f < u; f++) {
      const p = e.getUint16(t, !1);
      t += 2, d.push(r.subarray(t, t + p)), t += p;
    }
    const h = {
      configurationVersion: i,
      avcProfileIndication: s,
      profileCompatibility: n,
      avcLevelIndication: a,
      lengthSizeMinusOne: o,
      sequenceParameterSets: l,
      pictureParameterSets: d,
      chromaFormat: null,
      bitDepthLumaMinus8: null,
      bitDepthChromaMinus8: null,
      sequenceParameterSetExt: null
    };
    if ((s === 100 || s === 110 || s === 122 || s === 144) && t + 4 <= r.length) {
      const f = e.getUint8(t++) & 3, p = e.getUint8(t++) & 7, g = e.getUint8(t++) & 7, k = e.getUint8(t++);
      h.chromaFormat = f, h.bitDepthLumaMinus8 = p, h.bitDepthChromaMinus8 = g;
      const w = [];
      for (let b = 0; b < k; b++) {
        const y = e.getUint16(t, !1);
        t += 2, w.push(r.subarray(t, t + y)), t += y;
      }
      h.sequenceParameterSetExt = w;
    }
    return h;
  } catch (e) {
    return console.error("Error deserializing AVC Decoder Configuration Record:", e), null;
  }
}, ki = (r) => {
  try {
    const e = new Q(Sr(r));
    if (e.skipBits(1), e.skipBits(2), e.readBits(5) !== 7)
      return null;
    const i = e.readAlignedByte(), s = e.readAlignedByte(), n = e.readAlignedByte();
    I(e);
    let a = 1, o = 0, c = 0, l = 0;
    if ((i === 100 || i === 110 || i === 122 || i === 244 || i === 44 || i === 83 || i === 86 || i === 118 || i === 128) && (a = I(e), a === 3 && (l = e.readBits(1)), o = I(e), c = I(e), e.skipBits(1), e.readBits(1))) {
      for (let F = 0; F < (a !== 3 ? 8 : 12); F++)
        if (e.readBits(1)) {
          const W = F < 6 ? 16 : 64;
          let j = 8, $ = 8;
          for (let H = 0; H < W; H++) {
            if ($ !== 0) {
              const Y = Ne(e);
              $ = (j + Y + 256) % 256;
            }
            j = $ === 0 ? j : $;
          }
        }
    }
    I(e);
    const u = I(e);
    if (u === 0)
      I(e);
    else if (u === 1) {
      e.skipBits(1), Ne(e), Ne(e);
      const M = I(e);
      for (let F = 0; F < M; F++)
        Ne(e);
    }
    I(e), e.skipBits(1);
    const d = I(e), h = I(e), f = 16 * (d + 1), p = 16 * (h + 1);
    let g = f, k = p;
    const w = e.readBits(1);
    if (w || e.skipBits(1), e.skipBits(1), e.readBits(1)) {
      const M = I(e), F = I(e), D = I(e), W = I(e);
      let j, $;
      if ((l === 0 ? a : 0) === 0)
        j = 1, $ = 2 - w;
      else {
        const Y = a === 3 ? 1 : 2, re = a === 1 ? 2 : 1;
        j = Y, $ = re * (2 - w);
      }
      g -= j * (M + F), k -= $ * (D + W);
    }
    let y = 2, T = 2, x = 2, S = 0, E = null, C = null;
    if (e.readBits(1)) {
      e.readBits(1) && e.readBits(8) === 255 && (e.skipBits(16), e.skipBits(16)), e.readBits(1) && e.skipBits(1), e.readBits(1) && (e.skipBits(3), S = e.readBits(1), e.readBits(1) && (y = e.readBits(8), T = e.readBits(8), x = e.readBits(8))), e.readBits(1) && (I(e), I(e)), e.readBits(1) && (e.skipBits(32), e.skipBits(32), e.skipBits(1));
      const $ = e.readBits(1);
      $ && qi(e);
      const H = e.readBits(1);
      H && qi(e), ($ || H) && e.skipBits(1), e.skipBits(1), e.readBits(1) && (e.skipBits(1), I(e), I(e), I(e), I(e), E = I(e), C = I(e));
    }
    if (E === null) {
      m(C === null);
      const M = s & 16;
      if ((i === 44 || i === 86 || i === 100 || i === 110 || i === 122 || i === 244) && M)
        E = 0, C = 0;
      else {
        const F = d + 1, D = h + 1, W = (2 - w) * D, j = dr.find((H) => H.level >= n) ?? K(dr), $ = Math.min(Math.floor(j.maxDpbMbs / (F * W)), 16);
        E = $, C = $;
      }
    }
    return m(C !== null), {
      profileIdc: i,
      constraintFlags: s,
      levelIdc: n,
      frameMbsOnlyFlag: w,
      chromaFormatIdc: a,
      bitDepthLumaMinus8: o,
      bitDepthChromaMinus8: c,
      codedWidth: f,
      codedHeight: p,
      displayWidth: g,
      displayHeight: k,
      colourPrimaries: y,
      matrixCoefficients: x,
      transferCharacteristics: T,
      fullRangeFlag: S,
      numReorderFrames: E,
      maxDecFrameBuffering: C
    };
  } catch (e) {
    return console.error("Error parsing AVC SPS:", e), null;
  }
}, qi = (r) => {
  const e = I(r);
  r.skipBits(4), r.skipBits(4);
  for (let t = 0; t <= e; t++)
    I(r), I(r), r.skipBits(1);
  r.skipBits(5), r.skipBits(5), r.skipBits(5), r.skipBits(5);
}, vs = (r, e) => {
  if (e.description) {
    const s = (he(e.description)[21] & 3) + 1;
    return Ps(r, s);
  } else
    return tr(r);
}, Jn = function* (r) {
  yield* tr(r);
}, $t = (r) => r >> 1 & 63, Is = (r) => {
  try {
    const e = new Q(Sr(r));
    e.skipBits(16), e.readBits(4);
    const t = e.readBits(3), i = e.readBits(1), { general_profile_space: s, general_tier_flag: n, general_profile_idc: a, general_profile_compatibility_flags: o, general_constraint_indicator_flags: c, general_level_idc: l } = ea(e, t);
    I(e);
    const u = I(e);
    let d = 0;
    u === 3 && (d = e.readBits(1));
    const h = I(e), f = I(e);
    let p = h, g = f;
    if (e.readBits(1)) {
      const F = I(e), D = I(e), W = I(e), j = I(e);
      let $ = 1, H = 1;
      const Y = d === 0 ? u : 0;
      Y === 1 ? ($ = 2, H = 2) : Y === 2 && ($ = 2, H = 1), p -= (F + D) * $, g -= (W + j) * H;
    }
    const k = I(e), w = I(e);
    I(e);
    const y = e.readBits(1) ? 0 : t;
    let T = 0;
    for (let F = y; F <= t; F++)
      I(e), T = I(e), I(e);
    I(e), I(e), I(e), I(e), I(e), I(e), e.readBits(1) && e.readBits(1) && ta(e), e.skipBits(1), e.skipBits(1), e.readBits(1) && (e.skipBits(4), e.skipBits(4), I(e), I(e), e.skipBits(1));
    const x = I(e);
    if (ra(e, x), e.readBits(1)) {
      const F = I(e);
      for (let D = 0; D < F; D++)
        I(e), e.skipBits(1);
    }
    e.skipBits(1), e.skipBits(1);
    let S = 2, E = 2, C = 2, R = 0, M = 0;
    if (e.readBits(1)) {
      const F = sa(e, t);
      S = F.colourPrimaries, E = F.transferCharacteristics, C = F.matrixCoefficients, R = F.fullRangeFlag, M = F.minSpatialSegmentationIdc;
    }
    return {
      displayWidth: p,
      displayHeight: g,
      colourPrimaries: S,
      transferCharacteristics: E,
      matrixCoefficients: C,
      fullRangeFlag: R,
      maxDecFrameBuffering: T + 1,
      spsMaxSubLayersMinus1: t,
      spsTemporalIdNestingFlag: i,
      generalProfileSpace: s,
      generalTierFlag: n,
      generalProfileIdc: a,
      generalProfileCompatibilityFlags: o,
      generalConstraintIndicatorFlags: c,
      generalLevelIdc: l,
      chromaFormatIdc: u,
      bitDepthLumaMinus8: k,
      bitDepthChromaMinus8: w,
      minSpatialSegmentationIdc: M
    };
  } catch (e) {
    return console.error("Error parsing HEVC SPS:", e), null;
  }
}, bi = (r) => {
  try {
    const e = [], t = [], i = [], s = [];
    for (const l of Jn(r)) {
      const u = r.subarray(l.offset, l.offset + l.length), d = $t(u[0]);
      d === ne.VPS_NUT ? e.push(u) : d === ne.SPS_NUT ? t.push(u) : d === ne.PPS_NUT ? i.push(u) : (d === ne.PREFIX_SEI_NUT || d === ne.SUFFIX_SEI_NUT) && s.push(u);
    }
    if (t.length === 0 || i.length === 0)
      return null;
    const n = Is(t[0]);
    if (!n)
      return null;
    let a = 0;
    if (i.length > 0) {
      const l = i[0], u = new Q(Sr(l));
      u.skipBits(16), I(u), I(u), u.skipBits(1), u.skipBits(1), u.skipBits(3), u.skipBits(1), u.skipBits(1), I(u), I(u), Ne(u), u.skipBits(1), u.skipBits(1), u.readBits(1) && I(u), Ne(u), Ne(u), u.skipBits(1), u.skipBits(1), u.skipBits(1), u.skipBits(1);
      const d = u.readBits(1), h = u.readBits(1);
      !d && !h ? a = 0 : d && !h ? a = 2 : !d && h ? a = 3 : a = 0;
    }
    const o = [
      ...e.length ? [
        {
          arrayCompleteness: 1,
          nalUnitType: ne.VPS_NUT,
          nalUnits: e
        }
      ] : [],
      ...t.length ? [
        {
          arrayCompleteness: 1,
          nalUnitType: ne.SPS_NUT,
          nalUnits: t
        }
      ] : [],
      ...i.length ? [
        {
          arrayCompleteness: 1,
          nalUnitType: ne.PPS_NUT,
          nalUnits: i
        }
      ] : [],
      ...s.length ? [
        {
          arrayCompleteness: 1,
          nalUnitType: $t(s[0][0]),
          nalUnits: s
        }
      ] : []
    ];
    return {
      configurationVersion: 1,
      generalProfileSpace: n.generalProfileSpace,
      generalTierFlag: n.generalTierFlag,
      generalProfileIdc: n.generalProfileIdc,
      generalProfileCompatibilityFlags: n.generalProfileCompatibilityFlags,
      generalConstraintIndicatorFlags: n.generalConstraintIndicatorFlags,
      generalLevelIdc: n.generalLevelIdc,
      minSpatialSegmentationIdc: n.minSpatialSegmentationIdc,
      parallelismType: a,
      chromaFormatIdc: n.chromaFormatIdc,
      bitDepthLumaMinus8: n.bitDepthLumaMinus8,
      bitDepthChromaMinus8: n.bitDepthChromaMinus8,
      avgFrameRate: 0,
      constantFrameRate: 0,
      numTemporalLayers: n.spsMaxSubLayersMinus1 + 1,
      temporalIdNested: n.spsTemporalIdNestingFlag,
      lengthSizeMinusOne: 3,
      arrays: o
    };
  } catch (e) {
    return console.error("Error building HEVC Decoder Configuration Record:", e), null;
  }
}, ea = (r, e) => {
  const t = r.readBits(2), i = r.readBits(1), s = r.readBits(5);
  let n = 0;
  for (let u = 0; u < 32; u++)
    n = n << 1 | r.readBits(1);
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
    general_profile_idc: s,
    general_profile_compatibility_flags: n,
    general_constraint_indicator_flags: a,
    general_level_idc: o
  };
}, ta = (r) => {
  for (let e = 0; e < 4; e++)
    for (let t = 0; t < (e === 3 ? 2 : 6); t++)
      if (!r.readBits(1))
        I(r);
      else {
        const s = Math.min(64, 1 << 4 + (e << 1));
        e > 1 && Ne(r);
        for (let n = 0; n < s; n++)
          Ne(r);
      }
}, ra = (r, e) => {
  const t = [];
  for (let i = 0; i < e; i++)
    t[i] = ia(r, i, e, t);
}, ia = (r, e, t, i) => {
  let s = 0, n = 0, a = 0;
  if (e !== 0 && (n = r.readBits(1)), n) {
    if (e === t) {
      const c = I(r);
      a = e - (c + 1);
    } else
      a = e - 1;
    r.readBits(1), I(r);
    const o = i[a] ?? 0;
    for (let c = 0; c <= o; c++)
      r.readBits(1) || r.readBits(1);
    s = i[a];
  } else {
    const o = I(r), c = I(r);
    for (let l = 0; l < o; l++)
      I(r), r.readBits(1);
    for (let l = 0; l < c; l++)
      I(r), r.readBits(1);
    s = o + c;
  }
  return s;
}, sa = (r, e) => {
  let t = 2, i = 2, s = 2, n = 0, a = 0;
  return r.readBits(1) && r.readBits(8) === 255 && (r.readBits(16), r.readBits(16)), r.readBits(1) && r.readBits(1), r.readBits(1) && (r.readBits(3), n = r.readBits(1), r.readBits(1) && (t = r.readBits(8), i = r.readBits(8), s = r.readBits(8))), r.readBits(1) && (I(r), I(r)), r.readBits(1), r.readBits(1), r.readBits(1), r.readBits(1) && (I(r), I(r), I(r), I(r)), r.readBits(1) && (r.readBits(32), r.readBits(32), r.readBits(1) && I(r), r.readBits(1) && na(r, !0, e)), r.readBits(1) && (r.readBits(1), r.readBits(1), r.readBits(1), a = I(r), I(r), I(r), I(r), I(r)), {
    colourPrimaries: t,
    transferCharacteristics: i,
    matrixCoefficients: s,
    fullRangeFlag: n,
    minSpatialSegmentationIdc: a
  };
}, na = (r, e, t) => {
  let i = !1, s = !1, n = !1;
  i = r.readBits(1) === 1, s = r.readBits(1) === 1, (i || s) && (n = r.readBits(1) === 1, n && (r.readBits(8), r.readBits(5), r.readBits(1), r.readBits(5)), r.readBits(4), r.readBits(4), n && r.readBits(4), r.readBits(5), r.readBits(5), r.readBits(5));
  for (let a = 0; a <= t; a++) {
    const o = r.readBits(1) === 1;
    let c = !0;
    o || (c = r.readBits(1) === 1);
    let l = !1;
    c ? I(r) : l = r.readBits(1) === 1;
    let u = 1;
    l || (u = I(r) + 1), i && ji(r, u, n), s && ji(r, u, n);
  }
}, ji = (r, e, t) => {
  for (let i = 0; i < e; i++)
    I(r), I(r), t && (I(r), I(r)), r.readBits(1);
}, aa = (r) => {
  const e = [];
  e.push(r.configurationVersion), e.push((r.generalProfileSpace & 3) << 6 | (r.generalTierFlag & 1) << 5 | r.generalProfileIdc & 31), e.push(r.generalProfileCompatibilityFlags >>> 24 & 255), e.push(r.generalProfileCompatibilityFlags >>> 16 & 255), e.push(r.generalProfileCompatibilityFlags >>> 8 & 255), e.push(r.generalProfileCompatibilityFlags & 255), e.push(...r.generalConstraintIndicatorFlags), e.push(r.generalLevelIdc & 255), e.push(240 | r.minSpatialSegmentationIdc >> 8 & 15), e.push(r.minSpatialSegmentationIdc & 255), e.push(252 | r.parallelismType & 3), e.push(252 | r.chromaFormatIdc & 3), e.push(248 | r.bitDepthLumaMinus8 & 7), e.push(248 | r.bitDepthChromaMinus8 & 7), e.push(r.avgFrameRate >> 8 & 255), e.push(r.avgFrameRate & 255), e.push((r.constantFrameRate & 3) << 6 | (r.numTemporalLayers & 7) << 3 | (r.temporalIdNested & 1) << 2 | r.lengthSizeMinusOne & 3), e.push(r.arrays.length & 255);
  for (const t of r.arrays) {
    e.push((t.arrayCompleteness & 1) << 7 | 0 | t.nalUnitType & 63), e.push(t.nalUnits.length >> 8 & 255), e.push(t.nalUnits.length & 255);
    for (const i of t.nalUnits) {
      e.push(i.length >> 8 & 255), e.push(i.length & 255);
      for (let s = 0; s < i.length; s++)
        e.push(i[s]);
    }
  }
  return new Uint8Array(e);
}, _s = (r) => {
  const e = new Q(r);
  if (e.readBits(2) !== 2)
    return null;
  const i = e.readBits(1), n = (e.readBits(1) << 1) + i;
  if (n === 3 && e.skipBits(1), e.readBits(1) === 1 || e.readBits(1) !== 0 || (e.skipBits(2), e.readBits(24) !== 4817730))
    return null;
  let l = 8;
  n >= 2 && (l = e.readBits(1) ? 12 : 10);
  const u = e.readBits(3);
  let d = 0, h = 0;
  if (u !== 7)
    if (h = e.readBits(1), n === 1 || n === 3) {
      const E = e.readBits(1), C = e.readBits(1);
      d = !E && !C ? 3 : E && !C ? 2 : 1, e.skipBits(1);
    } else
      d = 1;
  else
    d = 3, h = 1;
  const f = e.readBits(16), p = e.readBits(16), g = f + 1, k = p + 1, w = g * k;
  let b = K($e).level;
  for (const S of $e)
    if (w <= S.maxPictureSize) {
      b = S.level;
      break;
    }
  return {
    profile: n,
    level: b,
    bitDepth: l,
    chromaSubsampling: d,
    videoFullRangeFlag: h,
    colourPrimaries: u === 2 ? 1 : u === 1 ? 6 : 2,
    transferCharacteristics: u === 2 ? 1 : u === 1 ? 6 : 2,
    matrixCoefficients: u === 7 ? 0 : u === 2 ? 1 : u === 1 ? 6 : 2
  };
}, Es = function* (r) {
  const e = new Q(r), t = () => {
    let i = 0;
    for (let s = 0; s < 8; s++) {
      const n = e.readAlignedByte();
      if (i |= (n & 127) << s * 7, !(n & 128))
        break;
      if (s === 7 && n & 128)
        return null;
    }
    return i >= 2 ** 32 - 1 ? null : i;
  };
  for (; e.getBitsLeft() >= 8; ) {
    e.skipBits(1);
    const i = e.readBits(4), s = e.readBits(1), n = e.readBits(1);
    e.skipBits(1), s && e.skipBits(8);
    let a;
    if (n) {
      const o = t();
      if (o === null)
        return;
      a = o;
    } else
      a = Math.floor(e.getBitsLeft() / 8);
    m(e.pos % 8 === 0), yield {
      type: i,
      data: r.subarray(e.pos / 8, e.pos / 8 + a)
    }, e.skipBits(a * 8);
  }
}, Fs = (r) => {
  for (const { type: e, data: t } of Es(r)) {
    if (e !== 1)
      continue;
    const i = new Q(t), s = i.readBits(3);
    i.readBits(1);
    const n = i.readBits(1);
    let a = 0, o = 0, c = 0;
    if (n)
      a = i.readBits(5);
    else {
      if (i.readBits(1) && (i.skipBits(32), i.skipBits(32), i.readBits(1)))
        return null;
      const x = i.readBits(1);
      x && (c = i.readBits(5), i.skipBits(32), i.skipBits(5), i.skipBits(5));
      const S = i.readBits(5);
      for (let E = 0; E <= S; E++) {
        i.skipBits(12);
        const C = i.readBits(5);
        if (E === 0 && (a = C), C > 7) {
          const M = i.readBits(1);
          E === 0 && (o = M);
        }
        if (x && i.readBits(1)) {
          const F = c + 1;
          i.skipBits(F), i.skipBits(F), i.skipBits(1);
        }
        i.readBits(1) && i.skipBits(4);
      }
    }
    const l = i.readBits(4), u = i.readBits(4), d = l + 1;
    i.skipBits(d);
    const h = u + 1;
    i.skipBits(h);
    let f = 0;
    if (n ? f = 0 : f = i.readBits(1), f && (i.skipBits(4), i.skipBits(3)), i.skipBits(1), i.skipBits(1), i.skipBits(1), !n) {
      i.skipBits(1), i.skipBits(1), i.skipBits(1), i.skipBits(1);
      const T = i.readBits(1);
      T && (i.skipBits(1), i.skipBits(1));
      const x = i.readBits(1);
      let S = 0;
      x ? S = 2 : S = i.readBits(1), S > 0 && (i.readBits(1) || i.skipBits(1)), T && i.skipBits(3);
    }
    i.skipBits(1), i.skipBits(1), i.skipBits(1);
    const p = i.readBits(1);
    let g = 8;
    s === 2 && p ? g = i.readBits(1) ? 12 : 10 : s <= 2 && (g = p ? 10 : 8);
    let k = 0;
    s !== 1 && (k = i.readBits(1));
    let w = 1, b = 1, y = 0;
    return k || (s === 0 ? (w = 1, b = 1) : s === 1 ? (w = 0, b = 0) : g === 12 && (w = i.readBits(1), w && (b = i.readBits(1))), w && b && (y = i.readBits(2))), {
      profile: s,
      level: a,
      tier: o,
      bitDepth: g,
      monochrome: k,
      chromaSubsamplingX: w,
      chromaSubsamplingY: b,
      chromaSamplePosition: y
    };
  }
  return null;
}, As = (r) => {
  const e = G(r), t = e.getUint8(9), i = e.getUint16(10, !0), s = e.getUint32(12, !0), n = e.getInt16(16, !0), a = e.getUint8(18);
  let o = null;
  return a && (o = r.subarray(19, 21 + t)), {
    outputChannelCount: t,
    preSkip: i,
    inputSampleRate: s,
    outputGain: n,
    channelMappingFamily: a,
    channelMappingTable: o
  };
}, oa = [
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
], ca = (r) => {
  const e = r[0] >> 3;
  return {
    durationInSamples: oa[e]
  };
}, la = (r) => {
  if (r.length < 7)
    throw new Error("Setup header is too short.");
  if (r[0] !== 5)
    throw new Error("Wrong packet type in Setup header.");
  if (String.fromCharCode(...r.slice(1, 7)) !== "vorbis")
    throw new Error("Invalid packet signature in Setup header.");
  const t = r.length, i = new Uint8Array(t);
  for (let d = 0; d < t; d++)
    i[d] = r[t - 1 - d];
  const s = new Q(i);
  let n = 0;
  for (; s.getBitsLeft() > 97; )
    if (s.readBits(1) === 1) {
      n = s.pos;
      break;
    }
  if (n === 0)
    throw new Error("Invalid Setup header: framing bit not found.");
  let a = 0, o = !1, c = 0;
  for (; s.getBitsLeft() >= 97; ) {
    const d = s.pos, h = s.readBits(8), f = s.readBits(16), p = s.readBits(16);
    if (h > 63 || f !== 0 || p !== 0) {
      s.pos = d;
      break;
    }
    if (s.skipBits(1), a++, a > 64)
      break;
    s.clone().readBits(6) + 1 === a && (o = !0, c = a);
  }
  if (!o)
    throw new Error("Invalid Setup header: mode header not found.");
  if (c > 63)
    throw new Error(`Unsupported mode count: ${c}.`);
  const l = c;
  s.pos = 0, s.skipBits(n);
  const u = Array(l).fill(0);
  for (let d = l - 1; d >= 0; d--)
    s.skipBits(40), u[d] = s.readBits(1);
  return { modeBlockflags: u };
}, wi = (r, e, t) => {
  switch (r) {
    case "avc": {
      for (const i of xs(t, e)) {
        const s = t[i.offset], n = Tr(s);
        if (n >= ve.NON_IDR_SLICE && n <= ve.SLICE_DPC)
          return "delta";
        if (n === ve.IDR)
          return "key";
        if (n === ve.SEI && (!qr() || Fn() >= 144)) {
          const a = t.subarray(i.offset, i.offset + i.length), o = Sr(a);
          let c = 1;
          do {
            let l = 0;
            for (; ; ) {
              const h = o[c++];
              if (h === void 0 || (l += h, h < 255))
                break;
            }
            let u = 0;
            for (; ; ) {
              const h = o[c++];
              if (h === void 0 || (u += h, h < 255))
                break;
            }
            if (l === 6) {
              const h = new Q(o);
              h.pos = 8 * c;
              const f = I(h), p = h.readBits(1);
              if (f === 0 && p === 1)
                return "key";
            }
            c += u;
          } while (c < o.length - 1);
        }
      }
      return "delta";
    }
    case "hevc": {
      for (const i of vs(t, e)) {
        const s = $t(t[i.offset]);
        if (s < ne.BLA_W_LP)
          return "delta";
        if (s <= ne.RSV_IRAP_VCL23)
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
      const s = i.readBits(1);
      return (i.readBits(1) << 1) + s === 3 && i.skipBits(1), i.readBits(1) ? null : i.readBits(1) === 0 ? "key" : "delta";
    }
    case "av1": {
      let i = !1;
      for (const { type: s, data: n } of Es(t))
        if (s === 1) {
          const a = new Q(n);
          a.skipBits(4), i = !!a.readBits(1);
        } else if (s === 3 || s === 6 || s === 7) {
          if (i)
            return "key";
          const a = new Q(n);
          return a.readBits(1) ? null : a.readBits(2) === 0 ? "key" : "delta";
        }
      return null;
    }
    default:
      Ge(r), m(!1);
  }
};
var _t;
(function(r) {
  r[r.STREAMINFO = 0] = "STREAMINFO", r[r.VORBIS_COMMENT = 4] = "VORBIS_COMMENT", r[r.PICTURE = 6] = "PICTURE";
})(_t || (_t = {}));
const $r = (r, e) => {
  const t = G(r);
  let i = 0;
  const s = t.getUint32(i, !0);
  i += 4;
  const n = ge.decode(r.subarray(i, i + s));
  i += s, s > 0 && (e.raw ??= {}, e.raw.vendor ??= n);
  const a = t.getUint32(i, !0);
  i += 4;
  for (let o = 0; o < a; o++) {
    const c = t.getUint32(i, !0);
    i += 4;
    const l = ge.decode(r.subarray(i, i + c));
    i += c;
    const u = l.indexOf("=");
    if (u === -1)
      continue;
    const d = l.slice(0, u).toUpperCase(), h = l.slice(u + 1);
    switch (e.raw ??= {}, e.raw[d] ??= h, d) {
      case "TITLE":
        e.title ??= h;
        break;
      case "DESCRIPTION":
        e.description ??= h;
        break;
      case "ARTIST":
        e.artist ??= h;
        break;
      case "ALBUM":
        e.album ??= h;
        break;
      case "ALBUMARTIST":
        e.albumArtist ??= h;
        break;
      case "COMMENT":
        e.comment ??= h;
        break;
      case "LYRICS":
        e.lyrics ??= h;
        break;
      case "TRACKNUMBER":
        {
          const f = h.split("/"), p = Number.parseInt(f[0], 10), g = f[1] && Number.parseInt(f[1], 10);
          Number.isInteger(p) && p > 0 && (e.trackNumber ??= p), g && Number.isInteger(g) && g > 0 && (e.tracksTotal ??= g);
        }
        break;
      case "TRACKTOTAL":
        {
          const f = Number.parseInt(h, 10);
          Number.isInteger(f) && f > 0 && (e.tracksTotal ??= f);
        }
        break;
      case "DISCNUMBER":
        {
          const f = h.split("/"), p = Number.parseInt(f[0], 10), g = f[1] && Number.parseInt(f[1], 10);
          Number.isInteger(p) && p > 0 && (e.discNumber ??= p), g && Number.isInteger(g) && g > 0 && (e.discsTotal ??= g);
        }
        break;
      case "DISCTOTAL":
        {
          const f = Number.parseInt(h, 10);
          Number.isInteger(f) && f > 0 && (e.discsTotal ??= f);
        }
        break;
      case "DATE":
        {
          const f = new Date(h);
          Number.isNaN(f.getTime()) || (e.date ??= f);
        }
        break;
      case "GENRE":
        e.genre ??= h;
        break;
      case "METADATA_BLOCK_PICTURE":
        {
          const f = An(h), p = G(f), g = p.getUint32(0, !1), k = p.getUint32(4, !1), w = String.fromCharCode(...f.subarray(8, 8 + k)), b = p.getUint32(8 + k, !1), y = ge.decode(f.subarray(12 + k, 12 + k + b)), T = p.getUint32(k + b + 28), x = f.subarray(k + b + 32, k + b + 32 + T);
          e.images ??= [], e.images.push({
            data: x,
            mimeType: w,
            kind: g === 3 ? "coverFront" : g === 4 ? "coverBack" : "unknown",
            name: void 0,
            description: y || void 0
          });
        }
        break;
    }
  }
};
class Ze {
  constructor(e) {
    this.input = e;
  }
}
const Bs = [], Rs = [], Qr = [], Kr = [];
const fe = /* @__PURE__ */ new Uint8Array(0);
class q {
  /** Creates a new {@link EncodedPacket} from raw bytes and timing information. */
  constructor(e, t, i, s, n = -1, a, o) {
    if (this.data = e, this.type = t, this.timestamp = i, this.duration = s, this.sequenceNumber = n, e === fe && a === void 0)
      throw new Error("Internal error: byteLength must be explicitly provided when constructing metadata-only packets.");
    if (a === void 0 && (a = e.byteLength), !(e instanceof Uint8Array))
      throw new TypeError("data must be a Uint8Array.");
    if (t !== "key" && t !== "delta")
      throw new TypeError('type must be either "key" or "delta".');
    if (!Number.isFinite(i))
      throw new TypeError("timestamp must be a number.");
    if (!Number.isFinite(s) || s < 0)
      throw new TypeError("duration must be a non-negative number.");
    if (!Number.isFinite(n))
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
    return this.data === fe;
  }
  /** The timestamp of this packet in microseconds. */
  get microsecondTimestamp() {
    return Math.trunc(je * this.timestamp);
  }
  /** The duration of this packet in microseconds. */
  get microsecondDuration() {
    return Math.trunc(je * this.duration);
  }
  /** Converts this packet to an
   * [`EncodedVideoChunk`](https://developer.mozilla.org/en-US/docs/Web/API/EncodedVideoChunk) for use with the
   * WebCodecs API. */
  toEncodedVideoChunk() {
    if (this.isMetadataOnly)
      throw new TypeError("Metadata-only packets cannot be converted to a video chunk.");
    if (typeof EncodedVideoChunk > "u")
      throw new Error("Your browser does not support EncodedVideoChunk.");
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
      throw new Error("Your browser does not support EncodedVideoChunk.");
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
      throw new Error("Your browser does not support EncodedAudioChunk.");
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
    return e.copyTo(i), new q(i, e.type, e.timestamp / 1e6, (e.duration ?? 0) / 1e6, void 0, void 0, t);
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
    return new q(e?.data ?? this.data, e?.type ?? this.type, e?.timestamp ?? this.timestamp, e?.duration ?? this.duration, e?.sequenceNumber ?? this.sequenceNumber, this.byteLength, e?.sideData ?? this.sideData);
  }
}
const ua = (r) => {
  let i = r, s = 4096, n = 0, a = 12, o = 0;
  for (i < 0 && (i = -i, n = 128), i += 33, i > 8191 && (i = 8191); (i & s) !== s && a >= 5; )
    s >>= 1, a--;
  return o = i >> a - 4 & 15, ~(n | a - 5 << 4 | o) & 255;
}, da = (r) => {
  let t = 0, i = 0, s = ~r;
  s & 128 && (s &= -129, t = -1), i = ((s & 240) >> 4) + 5;
  const n = (1 << i | (s & 15) << i - 4 | 1 << i - 5) - 33;
  return t === 0 ? n : -n;
}, ha = (r) => {
  let t = 2048, i = 0, s = 11, n = 0, a = r;
  for (a < 0 && (a = -a, i = 128), a > 4095 && (a = 4095); (a & t) !== t && s >= 5; )
    t >>= 1, s--;
  return n = a >> (s === 4 ? 1 : s - 4) & 15, (i | s - 4 << 4 | n) ^ 85;
}, fa = (r) => {
  let e = 0, t = 0, i = r ^ 85;
  i & 128 && (i &= -129, e = -1), t = ((i & 240) >> 4) + 4;
  let s = 0;
  return t !== 4 ? s = 1 << t | (i & 15) << t - 4 | 1 << t - 5 : s = i << 1 | 1, e === 0 ? s : -s;
};
ks();
let $i = -1 / 0, Qi = -1 / 0, Qt = null;
typeof FinalizationRegistry < "u" && (Qt = new FinalizationRegistry((r) => {
  const e = Date.now();
  r.type === "video" ? (e - $i >= 1e3 && (console.error("A VideoSample was garbage collected without first being closed. For proper resource management, make sure to call close() on all your VideoSamples as soon as you're done using them."), $i = e), typeof VideoFrame < "u" && r.data instanceof VideoFrame && r.data.close()) : (e - Qi >= 1e3 && (console.error("An AudioSample was garbage collected without first being closed. For proper resource management, make sure to call close() on all your AudioSamples as soon as you're done using them."), Qi = e), typeof AudioData < "u" && r.data instanceof AudioData && r.data.close());
}));
const zs = [
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
], ma = new Set(zs);
class ae {
  /** The width of the frame in pixels after rotation. */
  get displayWidth() {
    return this.rotation % 180 === 0 ? this.codedWidth : this.codedHeight;
  }
  /** The height of the frame in pixels after rotation. */
  get displayHeight() {
    return this.rotation % 180 === 0 ? this.codedHeight : this.codedWidth;
  }
  /** The presentation timestamp of the frame in microseconds. */
  get microsecondTimestamp() {
    return Math.trunc(je * this.timestamp);
  }
  /** The duration of the frame in microseconds. */
  get microsecondDuration() {
    return Math.trunc(je * this.duration);
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
      if (t.format === void 0 || !ma.has(t.format))
        throw new TypeError("init.format must be one of: " + zs.join(", "));
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
      this._data = he(e).slice(), this._layout = t.layout ?? pa(t.format, t.codedWidth, t.codedHeight), this.format = t.format, this.codedWidth = t.codedWidth, this.codedHeight = t.codedHeight, this.rotation = t.rotation ?? 0, this.timestamp = t.timestamp, this.duration = t.duration ?? 0, this.colorSpace = new _r(t.colorSpace);
    } else if (typeof VideoFrame < "u" && e instanceof VideoFrame) {
      if (t?.rotation !== void 0 && ![0, 90, 180, 270].includes(t.rotation))
        throw new TypeError("init.rotation, when provided, must be 0, 90, 180, or 270.");
      if (t?.timestamp !== void 0 && !Number.isFinite(t?.timestamp))
        throw new TypeError("init.timestamp, when provided, must be a number.");
      if (t?.duration !== void 0 && (!Number.isFinite(t.duration) || t.duration < 0))
        throw new TypeError("init.duration, when provided, must be a non-negative number.");
      this._data = e, this._layout = null, this.format = e.format, this.codedWidth = e.displayWidth, this.codedHeight = e.displayHeight, this.rotation = t?.rotation ?? 0, this.timestamp = t?.timestamp ?? e.timestamp / 1e6, this.duration = t?.duration ?? (e.duration ?? 0) / 1e6, this.colorSpace = new _r(e.colorSpace);
    } else if (typeof HTMLImageElement < "u" && e instanceof HTMLImageElement || typeof SVGImageElement < "u" && e instanceof SVGImageElement || typeof ImageBitmap < "u" && e instanceof ImageBitmap || typeof HTMLVideoElement < "u" && e instanceof HTMLVideoElement || typeof HTMLCanvasElement < "u" && e instanceof HTMLCanvasElement || typeof OffscreenCanvas < "u" && e instanceof OffscreenCanvas) {
      if (!t || typeof t != "object")
        throw new TypeError("init must be an object.");
      if (t.rotation !== void 0 && ![0, 90, 180, 270].includes(t.rotation))
        throw new TypeError("init.rotation, when provided, must be 0, 90, 180, or 270.");
      if (!Number.isFinite(t.timestamp))
        throw new TypeError("init.timestamp must be a number.");
      if (t.duration !== void 0 && (!Number.isFinite(t.duration) || t.duration < 0))
        throw new TypeError("init.duration, when provided, must be a non-negative number.");
      if (typeof VideoFrame < "u")
        return new ae(new VideoFrame(e, {
          timestamp: Math.trunc(t.timestamp * je),
          // Drag 0 to undefined
          duration: Math.trunc((t.duration ?? 0) * je) || void 0
        }), t);
      let i = 0, s = 0;
      if ("naturalWidth" in e ? (i = e.naturalWidth, s = e.naturalHeight) : "videoWidth" in e ? (i = e.videoWidth, s = e.videoHeight) : "width" in e && (i = Number(e.width), s = Number(e.height)), !i || !s)
        throw new TypeError("Could not determine dimensions.");
      const n = new OffscreenCanvas(i, s), a = n.getContext("2d", {
        alpha: At(),
        // Firefox has VideoFrame glitches with opaque canvases
        willReadFrequently: !0
      });
      m(a), a.drawImage(e, 0, 0), this._data = n, this._layout = null, this.format = "RGBX", this.codedWidth = i, this.codedHeight = s, this.rotation = t.rotation ?? 0, this.timestamp = t.timestamp, this.duration = t.duration ?? 0, this.colorSpace = new _r({
        matrix: "rgb",
        primaries: "bt709",
        transfer: "iec61966-2-1",
        fullRange: !0
      });
    } else
      throw new TypeError("Invalid data type: Must be a BufferSource or CanvasImageSource.");
    Qt?.register(this, { type: "video", data: this._data }, this);
  }
  /** Clones this video sample. */
  clone() {
    if (this._closed)
      throw new Error("VideoSample is closed.");
    return m(this._data !== null), et(this._data) ? new ae(this._data.clone(), {
      timestamp: this.timestamp,
      duration: this.duration,
      rotation: this.rotation
    }) : this._data instanceof Uint8Array ? (m(this._layout), new ae(this._data, {
      format: this.format,
      layout: this._layout,
      codedWidth: this.codedWidth,
      codedHeight: this.codedHeight,
      timestamp: this.timestamp,
      duration: this.duration,
      colorSpace: this.colorSpace,
      rotation: this.rotation
    })) : new ae(this._data, {
      format: this.format,
      codedWidth: this.codedWidth,
      codedHeight: this.codedHeight,
      timestamp: this.timestamp,
      duration: this.duration,
      colorSpace: this.colorSpace,
      rotation: this.rotation
    });
  }
  /**
   * Closes this video sample, releasing held resources. Video samples should be closed as soon as they are not
   * needed anymore.
   */
  close() {
    this._closed || (Qt?.unregister(this), et(this._data) ? this._data.close() : this._data = null, this._closed = !0);
  }
  /**
   * Returns the number of bytes required to hold this video sample's pixel data. Throws if `format` is `null`.
   */
  allocationSize(e = {}) {
    if (Ki(e), this._closed)
      throw new Error("VideoSample is closed.");
    if (this.format === null)
      throw new Error("Cannot get allocation size when format is null. Sorry!");
    if (m(this._data !== null), !et(this._data) && (e.colorSpace || e.format && e.format !== this.format || e.layout || e.rect)) {
      const t = this.toVideoFrame(), i = t.allocationSize(e);
      return t.close(), i;
    }
    return et(this._data) ? this._data.allocationSize(e) : this._data instanceof Uint8Array ? this._data.byteLength : this.codedWidth * this.codedHeight * 4;
  }
  /**
   * Copies this video sample's pixel data to an ArrayBuffer or ArrayBufferView. Throws if `format` is `null`.
   * @returns The byte layout of the planes of the copied data.
   */
  async copyTo(e, t = {}) {
    if (!kr(e))
      throw new TypeError("destination must be an ArrayBuffer or an ArrayBuffer view.");
    if (Ki(t), this._closed)
      throw new Error("VideoSample is closed.");
    if (this.format === null)
      throw new Error("Cannot copy video sample data when format is null. Sorry!");
    if (m(this._data !== null), !et(this._data) && (t.colorSpace || t.format && t.format !== this.format || t.layout || t.rect)) {
      const i = this.toVideoFrame(), s = await i.copyTo(e, t);
      return i.close(), s;
    }
    if (et(this._data))
      return this._data.copyTo(e, t);
    if (this._data instanceof Uint8Array)
      return m(this._layout), he(e).set(this._data), this._layout;
    {
      const s = this._data.getContext("2d");
      m(s);
      const n = s.getImageData(0, 0, this.codedWidth, this.codedHeight);
      return he(e).set(n.data), [{
        offset: 0,
        stride: 4 * this.codedWidth
      }];
    }
  }
  /**
   * Converts this video sample to a VideoFrame for use with the WebCodecs API. The VideoFrame returned by this
   * method *must* be closed separately from this video sample.
   */
  toVideoFrame() {
    if (this._closed)
      throw new Error("VideoSample is closed.");
    return m(this._data !== null), et(this._data) ? new VideoFrame(this._data, {
      timestamp: this.microsecondTimestamp,
      duration: this.microsecondDuration || void 0
      // Drag 0 duration to undefined, glitches some codecs
    }) : this._data instanceof Uint8Array ? new VideoFrame(this._data, {
      format: this.format,
      codedWidth: this.codedWidth,
      codedHeight: this.codedHeight,
      timestamp: this.microsecondTimestamp,
      duration: this.microsecondDuration || void 0,
      colorSpace: this.colorSpace
    }) : new VideoFrame(this._data, {
      timestamp: this.microsecondTimestamp,
      duration: this.microsecondDuration || void 0
    });
  }
  draw(e, t, i, s, n, a, o, c, l) {
    let u = 0, d = 0, h = this.displayWidth, f = this.displayHeight, p = 0, g = 0, k = this.displayWidth, w = this.displayHeight;
    if (a !== void 0 ? (u = t, d = i, h = s, f = n, p = a, g = o, c !== void 0 ? (k = c, w = l) : (k = h, w = f)) : (p = t, g = i, s !== void 0 && (k = s, w = n)), !(typeof CanvasRenderingContext2D < "u" && e instanceof CanvasRenderingContext2D || typeof OffscreenCanvasRenderingContext2D < "u" && e instanceof OffscreenCanvasRenderingContext2D))
      throw new TypeError("context must be a CanvasRenderingContext2D or OffscreenCanvasRenderingContext2D.");
    if (!Number.isFinite(u))
      throw new TypeError("sx must be a number.");
    if (!Number.isFinite(d))
      throw new TypeError("sy must be a number.");
    if (!Number.isFinite(h) || h < 0)
      throw new TypeError("sWidth must be a non-negative number.");
    if (!Number.isFinite(f) || f < 0)
      throw new TypeError("sHeight must be a non-negative number.");
    if (!Number.isFinite(p))
      throw new TypeError("dx must be a number.");
    if (!Number.isFinite(g))
      throw new TypeError("dy must be a number.");
    if (!Number.isFinite(k) || k < 0)
      throw new TypeError("dWidth must be a non-negative number.");
    if (!Number.isFinite(w) || w < 0)
      throw new TypeError("dHeight must be a non-negative number.");
    if (this._closed)
      throw new Error("VideoSample is closed.");
    ({ sx: u, sy: d, sWidth: h, sHeight: f } = this._rotateSourceRegion(u, d, h, f, this.rotation));
    const b = this.toCanvasImageSource();
    e.save();
    const y = p + k / 2, T = g + w / 2;
    e.translate(y, T), e.rotate(this.rotation * Math.PI / 180);
    const x = this.rotation % 180 === 0 ? 1 : k / w;
    e.scale(1 / x, x), e.drawImage(b, u, d, h, f, -k / 2, -w / 2, k, w), e.restore();
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
    t.crop !== void 0 && Ti(t.crop, "options.");
    const i = e.canvas.width, s = e.canvas.height, n = t.rotation ?? this.rotation, [a, o] = n % 180 === 0 ? [this.codedWidth, this.codedHeight] : [this.codedHeight, this.codedWidth];
    t.crop && yi(t.crop, a, o);
    let c, l, u, d;
    const { sx: h, sy: f, sWidth: p, sHeight: g } = this._rotateSourceRegion(t.crop?.left ?? 0, t.crop?.top ?? 0, t.crop?.width ?? a, t.crop?.height ?? o, n);
    if (t.fit === "fill")
      c = 0, l = 0, u = i, d = s;
    else {
      const [w, b] = t.crop ? [t.crop.width, t.crop.height] : [a, o], y = t.fit === "contain" ? Math.min(i / w, s / b) : Math.max(i / w, s / b);
      u = w * y, d = b * y, c = (i - u) / 2, l = (s - d) / 2;
    }
    e.save();
    const k = n % 180 === 0 ? 1 : u / d;
    e.translate(i / 2, s / 2), e.rotate(n * Math.PI / 180), e.scale(1 / k, k), e.translate(-i / 2, -s / 2), e.drawImage(this.toCanvasImageSource(), h, f, p, g, c, l, u, d), e.restore();
  }
  /** @internal */
  _rotateSourceRegion(e, t, i, s, n) {
    return n === 90 ? [e, t, i, s] = [
      t,
      this.codedHeight - e - i,
      s,
      i
    ] : n === 180 ? [e, t] = [
      this.codedWidth - e - i,
      this.codedHeight - t - s
    ] : n === 270 && ([e, t, i, s] = [
      this.codedWidth - t - s,
      e,
      s,
      i
    ]), { sx: e, sy: t, sWidth: i, sHeight: s };
  }
  /**
   * Converts this video sample to a
   * [`CanvasImageSource`](https://udn.realityripple.com/docs/Web/API/CanvasImageSource) for drawing to a canvas.
   *
   * You must use the value returned by this method immediately, as any VideoFrame created internally will
   * automatically be closed in the next microtask.
   */
  toCanvasImageSource() {
    if (this._closed)
      throw new Error("VideoSample is closed.");
    if (m(this._data !== null), this._data instanceof Uint8Array) {
      const e = this.toVideoFrame();
      return queueMicrotask(() => e.close()), e;
    } else
      return this._data;
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
  /** Calls `.close()`. */
  [Symbol.dispose]() {
    this.close();
  }
}
class _r {
  /** Creates a new VideoSampleColorSpace. */
  constructor(e) {
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
const et = (r) => typeof VideoFrame < "u" && r instanceof VideoFrame, yi = (r, e, t) => {
  r.left = Math.min(r.left, e), r.top = Math.min(r.top, t), r.width = Math.min(r.width, e - r.left), r.height = Math.min(r.height, t - r.top), m(r.width >= 0), m(r.height >= 0);
}, Ti = (r, e) => {
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
}, Ki = (r) => {
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
}, pa = (r, e, t) => {
  const i = ga(r), s = [];
  let n = 0;
  for (const a of i) {
    const o = Math.ceil(e / a.widthDivisor), c = Math.ceil(t / a.heightDivisor), l = o * a.sampleBytes, u = l * c;
    s.push({
      offset: n,
      stride: l
    }), n += u;
  }
  return s;
}, ga = (r) => {
  const e = (t, i, s, n, a) => {
    const o = [
      { sampleBytes: t, widthDivisor: 1, heightDivisor: 1 },
      { sampleBytes: i, widthDivisor: s, heightDivisor: n },
      { sampleBytes: i, widthDivisor: s, heightDivisor: n }
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
      Ge(r), m(!1);
  }
}, Er = /* @__PURE__ */ new Set(["f32", "f32-planar", "s16", "s16-planar", "s32", "s32-planar", "u8", "u8-planar"]);
class pe {
  /** The presentation timestamp of the sample in microseconds. */
  get microsecondTimestamp() {
    return Math.trunc(je * this.timestamp);
  }
  /** The duration of the sample in microseconds. */
  get microsecondDuration() {
    return Math.trunc(je * this.duration);
  }
  /**
   * Creates a new {@link AudioSample}, either from an existing
   * [`AudioData`](https://developer.mozilla.org/en-US/docs/Web/API/AudioData) or from raw bytes specified in
   * {@link AudioSampleInit}.
   */
  constructor(e) {
    if (this._closed = !1, Rt(e)) {
      if (e.format === null)
        throw new TypeError("AudioData with null format is not supported.");
      this._data = e, this.format = e.format, this.sampleRate = e.sampleRate, this.numberOfFrames = e.numberOfFrames, this.numberOfChannels = e.numberOfChannels, this.timestamp = e.timestamp / 1e6, this.duration = e.numberOfFrames / e.sampleRate;
    } else {
      if (!e || typeof e != "object")
        throw new TypeError("Invalid AudioDataInit: must be an object.");
      if (!Er.has(e.format))
        throw new TypeError("Invalid AudioDataInit: invalid format.");
      if (!Number.isFinite(e.sampleRate) || e.sampleRate <= 0)
        throw new TypeError("Invalid AudioDataInit: sampleRate must be > 0.");
      if (!Number.isInteger(e.numberOfChannels) || e.numberOfChannels === 0)
        throw new TypeError("Invalid AudioDataInit: numberOfChannels must be an integer > 0.");
      if (!Number.isFinite(e?.timestamp))
        throw new TypeError("init.timestamp must be a number.");
      const t = e.data.byteLength / (rt(e.format) * e.numberOfChannels);
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
      const s = this.numberOfFrames * this.numberOfChannels * rt(this.format);
      if (i.byteLength < s)
        throw new TypeError("Invalid AudioDataInit: insufficient data size.");
      this._data = i;
    }
    Qt?.register(this, { type: "audio", data: this._data }, this);
  }
  /** Returns the number of bytes required to hold the audio sample's data as specified by the given options. */
  allocationSize(e) {
    if (!e || typeof e != "object")
      throw new TypeError("options must be an object.");
    if (!Number.isInteger(e.planeIndex) || e.planeIndex < 0)
      throw new TypeError("planeIndex must be a non-negative integer.");
    if (e.format !== void 0 && !Er.has(e.format))
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
    const s = e.frameCount !== void 0 ? e.frameCount : this.numberOfFrames - i;
    if (s > this.numberOfFrames - i)
      throw new RangeError("frameCount out of range");
    const n = rt(t), a = yt(t);
    if (a && e.planeIndex >= this.numberOfChannels)
      throw new RangeError("planeIndex out of range");
    if (!a && e.planeIndex !== 0)
      throw new RangeError("planeIndex out of range");
    return (a ? s : s * this.numberOfChannels) * n;
  }
  /** Copies the audio sample's data to an ArrayBuffer or ArrayBufferView as specified by the given options. */
  copyTo(e, t) {
    if (!kr(e))
      throw new TypeError("destination must be an ArrayBuffer or an ArrayBuffer view.");
    if (!t || typeof t != "object")
      throw new TypeError("options must be an object.");
    if (!Number.isInteger(t.planeIndex) || t.planeIndex < 0)
      throw new TypeError("planeIndex must be a non-negative integer.");
    if (t.format !== void 0 && !Er.has(t.format))
      throw new TypeError("Invalid format.");
    if (t.frameOffset !== void 0 && (!Number.isInteger(t.frameOffset) || t.frameOffset < 0))
      throw new TypeError("frameOffset must be a non-negative integer.");
    if (t.frameCount !== void 0 && (!Number.isInteger(t.frameCount) || t.frameCount < 0))
      throw new TypeError("frameCount must be a non-negative integer.");
    if (this._closed)
      throw new Error("AudioSample is closed.");
    const { planeIndex: i, format: s, frameCount: n, frameOffset: a } = t, o = this.format, c = s ?? this.format;
    if (!c)
      throw new Error("Destination format not determined");
    const l = this.numberOfFrames, u = this.numberOfChannels, d = a ?? 0;
    if (d >= l)
      throw new RangeError("frameOffset out of range");
    const h = n !== void 0 ? n : l - d;
    if (h > l - d)
      throw new RangeError("frameCount out of range");
    const f = rt(c), p = yt(c);
    if (p && i >= u)
      throw new RangeError("planeIndex out of range");
    if (!p && i !== 0)
      throw new RangeError("planeIndex out of range");
    const k = (p ? h : h * u) * f;
    if (e.byteLength < k)
      throw new RangeError("Destination buffer is too small");
    const w = G(e), b = Ms(c);
    if (Rt(this._data))
      Vt() && u > 2 && c !== o ? ka(this._data, w, o, c, u, i, d, h) : this._data.copyTo(e, {
        planeIndex: i,
        frameOffset: d,
        frameCount: h,
        format: c
      });
    else {
      const y = this._data, T = G(y), x = Ds(o), S = rt(o), E = yt(o);
      for (let C = 0; C < h; C++)
        if (p) {
          const R = C * f;
          let M;
          E ? M = (i * l + (C + d)) * S : M = ((C + d) * u + i) * S;
          const F = x(T, M);
          b(w, R, F);
        } else
          for (let R = 0; R < u; R++) {
            const F = (C * u + R) * f;
            let D;
            E ? D = (R * l + (C + d)) * S : D = ((C + d) * u + R) * S;
            const W = x(T, D);
            b(w, F, W);
          }
    }
  }
  /** Clones this audio sample. */
  clone() {
    if (this._closed)
      throw new Error("AudioSample is closed.");
    if (Rt(this._data)) {
      const e = new pe(this._data.clone());
      return e.setTimestamp(this.timestamp), e;
    } else
      return new pe({
        format: this.format,
        sampleRate: this.sampleRate,
        numberOfFrames: this.numberOfFrames,
        numberOfChannels: this.numberOfChannels,
        timestamp: this.timestamp,
        data: this._data
      });
  }
  /**
   * Closes this audio sample, releasing held resources. Audio samples should be closed as soon as they are not
   * needed anymore.
   */
  close() {
    this._closed || (Qt?.unregister(this), Rt(this._data) ? this._data.close() : this._data = new Uint8Array(0), this._closed = !0);
  }
  /**
   * Converts this audio sample to an AudioData for use with the WebCodecs API. The AudioData returned by this
   * method *must* be closed separately from this audio sample.
   */
  toAudioData() {
    if (this._closed)
      throw new Error("AudioSample is closed.");
    if (Rt(this._data)) {
      if (this._data.timestamp === this.microsecondTimestamp)
        return this._data.clone();
      if (yt(this.format)) {
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
    } else
      return new AudioData({
        format: this.format,
        sampleRate: this.sampleRate,
        numberOfFrames: this.numberOfFrames,
        numberOfChannels: this.numberOfChannels,
        timestamp: this.microsecondTimestamp,
        data: this._data.buffer instanceof ArrayBuffer ? this._data.buffer : this._data.slice()
        // In the case of SharedArrayBuffer, convert to ArrayBuffer
      });
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
    const i = 48e3 * 5, s = e.numberOfChannels, n = e.sampleRate, a = e.length, o = Math.floor(i / s);
    let c = 0, l = a;
    for (; l > 0; ) {
      const u = Math.min(o, l), d = new Float32Array(s * u);
      for (let h = 0; h < s; h++)
        e.copyFromChannel(d.subarray(h * u, (h + 1) * u), h, c);
      yield new pe({
        format: "f32-planar",
        sampleRate: n,
        numberOfFrames: u,
        numberOfChannels: s,
        timestamp: t + c / n,
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
    const i = 48e3 * 5, s = e.numberOfChannels, n = e.sampleRate, a = e.length, o = Math.floor(i / s);
    let c = 0, l = a;
    const u = [];
    for (; l > 0; ) {
      const d = Math.min(o, l), h = new Float32Array(s * d);
      for (let p = 0; p < s; p++)
        e.copyFromChannel(h.subarray(p * d, (p + 1) * d), p, c);
      const f = new pe({
        format: "f32-planar",
        sampleRate: n,
        numberOfFrames: d,
        numberOfChannels: s,
        timestamp: t + c / n,
        data: h
      });
      u.push(f), c += d, l -= d;
    }
    return u;
  }
}
const rt = (r) => {
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
}, yt = (r) => {
  switch (r) {
    case "u8-planar":
    case "s16-planar":
    case "s32-planar":
    case "f32-planar":
      return !0;
    default:
      return !1;
  }
}, Ds = (r) => {
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
}, Ms = (r) => {
  switch (r) {
    case "u8":
    case "u8-planar":
      return (e, t, i) => e.setUint8(t, ee((i + 1) * 127.5, 0, 255));
    case "s16":
    case "s16-planar":
      return (e, t, i) => e.setInt16(t, ee(Math.round(i * 32767), -32768, 32767), !0);
    case "s32":
    case "s32-planar":
      return (e, t, i) => e.setInt32(t, ee(Math.round(i * 2147483647), -2147483648, 2147483647), !0);
    case "f32":
    case "f32-planar":
      return (e, t, i) => e.setFloat32(t, i, !0);
  }
}, Rt = (r) => typeof AudioData < "u" && r instanceof AudioData, ka = (r, e, t, i, s, n, a, o) => {
  const c = Ds(t), l = Ms(i), u = rt(t), d = rt(i), h = yt(t);
  if (yt(i))
    if (h) {
      const p = new ArrayBuffer(o * u), g = G(p);
      r.copyTo(p, {
        planeIndex: n,
        frameOffset: a,
        frameCount: o,
        format: t
      });
      for (let k = 0; k < o; k++) {
        const w = k * u, b = k * d, y = c(g, w);
        l(e, b, y);
      }
    } else {
      const p = new ArrayBuffer(o * s * u), g = G(p);
      r.copyTo(p, {
        planeIndex: 0,
        frameOffset: a,
        frameCount: o,
        format: t
      });
      for (let k = 0; k < o; k++) {
        const w = (k * s + n) * u, b = k * d, y = c(g, w);
        l(e, b, y);
      }
    }
  else if (h) {
    const p = o * u, g = new ArrayBuffer(p), k = G(g);
    for (let w = 0; w < s; w++) {
      r.copyTo(g, {
        planeIndex: w,
        frameOffset: a,
        frameCount: o,
        format: t
      });
      for (let b = 0; b < o; b++) {
        const y = b * u, T = (b * s + w) * d, x = c(k, y);
        l(e, T, x);
      }
    }
  } else {
    const p = new ArrayBuffer(o * s * u), g = G(p);
    r.copyTo(p, {
      planeIndex: 0,
      frameOffset: a,
      frameCount: o,
      format: t
    });
    for (let k = 0; k < o; k++)
      for (let w = 0; w < s; w++) {
        const b = k * s + w, y = b * u, T = b * d, x = c(g, y);
        l(e, T, x);
      }
  }
};
const ht = (r) => {
  if (!r || typeof r != "object")
    throw new TypeError("options must be an object.");
  if (r.metadataOnly !== void 0 && typeof r.metadataOnly != "boolean")
    throw new TypeError("options.metadataOnly, when defined, must be a boolean.");
  if (r.verifyKeyPackets !== void 0 && typeof r.verifyKeyPackets != "boolean")
    throw new TypeError("options.verifyKeyPackets, when defined, must be a boolean.");
  if (r.verifyKeyPackets && r.metadataOnly)
    throw new TypeError("options.verifyKeyPackets and options.metadataOnly cannot be enabled together.");
}, Ke = (r) => {
  if (!bs(r))
    throw new TypeError("timestamp must be a number.");
}, Fr = (r, e, t) => t.verifyKeyPackets ? e.then(async (i) => {
  if (!i || i.type === "delta")
    return i;
  const s = await r.determinePacketType(i);
  return s && (i.type = s), i;
}) : e;
class Kt {
  /** Creates a new {@link EncodedPacketSink} for the given {@link InputTrack}. */
  constructor(e) {
    if (!(e instanceof Pi))
      throw new TypeError("track must be an InputTrack.");
    this._track = e;
  }
  /**
   * Retrieves the track's first packet (in decode order), or null if it has no packets. The first packet is very
   * likely to be a key packet.
   */
  getFirstPacket(e = {}) {
    if (ht(e), this._track.input._disposed)
      throw new ue();
    return Fr(this._track, this._track._backing.getFirstPacket(e), e);
  }
  /**
   * Retrieves the packet corresponding to the given timestamp, in seconds. More specifically, returns the last packet
   * (in presentation order) with a start timestamp less than or equal to the given timestamp. This method can be
   * used to retrieve a track's last packet using `getPacket(Infinity)`. The method returns null if the timestamp
   * is before the first packet in the track.
   *
   * @param timestamp - The timestamp used for retrieval, in seconds.
   */
  getPacket(e, t = {}) {
    if (Ke(e), ht(t), this._track.input._disposed)
      throw new ue();
    return Fr(this._track, this._track._backing.getPacket(e, t), t);
  }
  /**
   * Retrieves the packet following the given packet (in decode order), or null if the given packet is the
   * last packet.
   */
  getNextPacket(e, t = {}) {
    if (!(e instanceof q))
      throw new TypeError("packet must be an EncodedPacket.");
    if (ht(t), this._track.input._disposed)
      throw new ue();
    return Fr(this._track, this._track._backing.getNextPacket(e, t), t);
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
    if (Ke(e), ht(t), this._track.input._disposed)
      throw new ue();
    if (!t.verifyKeyPackets)
      return this._track._backing.getKeyPacket(e, t);
    const i = await this._track._backing.getKeyPacket(e, t);
    return i && (m(i.type === "key"), await this._track.determinePacketType(i) === "delta" ? this.getKeyPacket(i.timestamp - 1 / this._track.timeResolution, t) : i);
  }
  /**
   * Retrieves the key packet following the given packet (in decode order), or null if the given packet is the last
   * key packet.
   *
   * To ensure that the returned packet is guaranteed to be a real key frame, enable `options.verifyKeyPackets`.
   */
  async getNextKeyPacket(e, t = {}) {
    if (!(e instanceof q))
      throw new TypeError("packet must be an EncodedPacket.");
    if (ht(t), this._track.input._disposed)
      throw new ue();
    if (!t.verifyKeyPackets)
      return this._track._backing.getNextKeyPacket(e, t);
    const i = await this._track._backing.getNextKeyPacket(e, t);
    return i && (m(i.type === "key"), await this._track.determinePacketType(i) === "delta" ? this.getNextKeyPacket(i, t) : i);
  }
  /**
   * Creates an async iterator that yields the packets in this track in decode order. To enable fast iteration, this
   * method will intelligently preload packets based on the speed of the consumer.
   *
   * @param startPacket - (optional) The packet from which iteration should begin. This packet will also be yielded.
   * @param endTimestamp - (optional) The timestamp at which iteration should end. This packet will _not_ be yielded.
   */
  packets(e, t, i = {}) {
    if (e !== void 0 && !(e instanceof q))
      throw new TypeError("startPacket must be an EncodedPacket.");
    if (e !== void 0 && e.isMetadataOnly && !i?.metadataOnly)
      throw new TypeError("startPacket can only be metadata-only if options.metadataOnly is enabled.");
    if (t !== void 0 && !(t instanceof q))
      throw new TypeError("endPacket must be an EncodedPacket.");
    if (ht(i), this._track.input._disposed)
      throw new ue();
    const s = [];
    let { promise: n, resolve: a } = se(), { promise: o, resolve: c } = se(), l = !1, u = !1, d = null;
    const h = [], f = () => Math.max(2, h.length);
    (async () => {
      let g = e ?? await this.getFirstPacket(i);
      for (; g && !u && !this._track.input._disposed && !(t && g.sequenceNumber >= t?.sequenceNumber); ) {
        if (s.length > f()) {
          ({ promise: o, resolve: c } = se()), await o;
          continue;
        }
        s.push(g), a(), { promise: n, resolve: a } = se(), g = await this.getNextPacket(g, i);
      }
      l = !0, a();
    })().catch((g) => {
      d || (d = g, a());
    });
    const p = this._track;
    return {
      async next() {
        for (; ; ) {
          if (p.input._disposed)
            throw new ue();
          if (u)
            return { value: void 0, done: !0 };
          if (d)
            throw d;
          if (s.length > 0) {
            const g = s.shift(), k = performance.now();
            for (h.push(k); h.length > 0 && k - h[0] >= 1e3; )
              h.shift();
            return c(), { value: g, done: !1 };
          } else {
            if (l)
              return { value: void 0, done: !0 };
            await n;
          }
        }
      },
      async return() {
        return u = !0, c(), a(), { value: void 0, done: !0 };
      },
      async throw(g) {
        throw g;
      },
      [Symbol.asyncIterator]() {
        return this;
      }
    };
  }
}
class Si {
  constructor(e, t) {
    this.onSample = e, this.onError = t;
  }
}
class Os {
  /** @internal */
  mediaSamplesInRange(e = 0, t = 1 / 0) {
    Ke(e), Ke(t);
    const i = [];
    let s = !1, n = null, { promise: a, resolve: o } = se(), { promise: c, resolve: l } = se(), u = !1, d = !1, h = !1, f = null;
    (async () => {
      const k = await this._createDecoder((S) => {
        if (l(), S.timestamp >= t && (d = !0), d) {
          S.close();
          return;
        }
        n && (S.timestamp > e ? (i.push(n), s = !0) : n.close()), S.timestamp >= e && (i.push(S), s = !0), n = s ? null : S, i.length > 0 && (o(), { promise: a, resolve: o } = se());
      }, (S) => {
        f || (f = S, o());
      }), w = this._createPacketSink(), b = await w.getKeyPacket(e, { verifyKeyPackets: !0 }) ?? await w.getFirstPacket();
      let y = b;
      const x = w.packets(b ?? void 0, void 0);
      for (await x.next(); y && !d && !this._track.input._disposed; ) {
        const S = Gi(i.length);
        if (i.length + k.getDecodeQueueSize() > S) {
          ({ promise: c, resolve: l } = se()), await c;
          continue;
        }
        k.decode(y);
        const E = await x.next();
        if (E.done)
          break;
        y = E.value;
      }
      await x.return(), !h && !this._track.input._disposed && await k.flush(), k.close(), !s && n && i.push(n), u = !0, o();
    })().catch((k) => {
      f || (f = k, o());
    });
    const p = this._track, g = () => {
      n?.close();
      for (const k of i)
        k.close();
    };
    return {
      async next() {
        for (; ; ) {
          if (p.input._disposed)
            throw g(), new ue();
          if (h)
            return { value: void 0, done: !0 };
          if (f)
            throw g(), f;
          if (i.length > 0) {
            const k = i.shift();
            return l(), { value: k, done: !1 };
          } else if (!u)
            await a;
          else
            return { value: void 0, done: !0 };
        }
      },
      async return() {
        return h = !0, d = !0, l(), o(), g(), { value: void 0, done: !0 };
      },
      async throw(k) {
        throw k;
      },
      [Symbol.asyncIterator]() {
        return this;
      }
    };
  }
  /** @internal */
  mediaSamplesAtTimestamps(e) {
    xn(e);
    const t = Pn(e), i = [], s = [];
    let { promise: n, resolve: a } = se(), { promise: o, resolve: c } = se(), l = !1, u = !1, d = null;
    const h = (g) => {
      s.push(g), a(), { promise: n, resolve: a } = se();
    };
    (async () => {
      const g = await this._createDecoder((S) => {
        if (c(), u) {
          S.close();
          return;
        }
        let E = 0;
        for (; i.length > 0 && S.timestamp - i[0] > -1e-10; )
          E++, i.shift();
        if (E > 0)
          for (let C = 0; C < E; C++)
            h(C < E - 1 ? S.clone() : S);
        else
          S.close();
      }, (S) => {
        d || (d = S, a());
      }), k = this._createPacketSink();
      let w = null, b = null, y = -1;
      const T = async () => {
        m(b);
        let S = b;
        for (g.decode(S); S.sequenceNumber < y; ) {
          const E = Gi(s.length);
          for (; s.length + g.getDecodeQueueSize() > E && !u; )
            ({ promise: o, resolve: c } = se()), await o;
          if (u)
            break;
          const C = await k.getNextPacket(S);
          m(C), g.decode(C), S = C;
        }
        y = -1;
      }, x = async () => {
        await g.flush();
        for (let S = 0; S < i.length; S++)
          h(null);
        i.length = 0;
      };
      for await (const S of t) {
        if (Ke(S), u || this._track.input._disposed)
          break;
        const E = await k.getPacket(S), C = E && await k.getKeyPacket(S, { verifyKeyPackets: !0 });
        if (!C) {
          y !== -1 && (await T(), await x()), h(null), w = null;
          continue;
        }
        w && (C.sequenceNumber !== b.sequenceNumber || E.timestamp < w.timestamp) && (await T(), await x()), i.push(E.timestamp), y = Math.max(E.sequenceNumber, y), w = E, b = C;
      }
      !u && !this._track.input._disposed && (y !== -1 && await T(), await x()), g.close(), l = !0, a();
    })().catch((g) => {
      d || (d = g, a());
    });
    const f = this._track, p = () => {
      for (const g of s)
        g?.close();
    };
    return {
      async next() {
        for (; ; ) {
          if (f.input._disposed)
            throw p(), new ue();
          if (u)
            return { value: void 0, done: !0 };
          if (d)
            throw p(), d;
          if (s.length > 0) {
            const g = s.shift();
            return m(g !== void 0), c(), { value: g, done: !1 };
          } else if (!l)
            await n;
          else
            return { value: void 0, done: !0 };
        }
      },
      async return() {
        return u = !0, c(), a(), p(), { value: void 0, done: !0 };
      },
      async throw(g) {
        throw g;
      },
      [Symbol.asyncIterator]() {
        return this;
      }
    };
  }
}
const Gi = (r) => r === 0 ? 40 : 8;
class ba extends Si {
  constructor(e, t, i, s, n, a) {
    super(e, t), this.codec = i, this.decoderConfig = s, this.rotation = n, this.timeResolution = a, this.decoder = null, this.customDecoder = null, this.customDecoderCallSerializer = new wr(), this.customDecoderQueueSize = 0, this.inputTimestamps = [], this.sampleQueue = [], this.currentPacketIndex = 0, this.raslSkipped = !1, this.alphaDecoder = null, this.alphaHadKeyframe = !1, this.colorQueue = [], this.alphaQueue = [], this.merger = null, this.mergerCreationFailed = !1, this.decodedAlphaChunkCount = 0, this.alphaDecoderQueueSize = 0, this.nullAlphaFrameQueue = [], this.currentAlphaPacketIndex = 0, this.alphaRaslSkipped = !1;
    const o = Bs.find((c) => c.supports(i, s));
    if (o)
      this.customDecoder = new o(), this.customDecoder.codec = i, this.customDecoder.config = s, this.customDecoder.onSample = (c) => {
        if (!(c instanceof ae))
          throw new TypeError("The argument passed to onSample must be a VideoSample.");
        this.finalizeAndEmitSample(c);
      }, this.customDecoderCallSerializer.call(() => this.customDecoder.init());
    else {
      const c = (u) => {
        if (this.alphaQueue.length > 0) {
          const d = this.alphaQueue.shift();
          m(d !== void 0), this.mergeAlpha(u, d);
        } else
          this.colorQueue.push(u);
      };
      if (i === "avc" && this.decoderConfig.description && qr()) {
        const u = Zn(he(this.decoderConfig.description));
        if (u && u.sequenceParameterSets.length > 0) {
          const d = ki(u.sequenceParameterSets[0]);
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
    return this.customDecoder ? this.customDecoderQueueSize : (m(this.decoder), Math.max(this.decoder.decodeQueueSize, this.alphaDecoder?.decodeQueueSize ?? 0));
  }
  decode(e) {
    if (this.codec === "hevc" && this.currentPacketIndex > 0 && !this.raslSkipped) {
      if (this.hasHevcRaslPicture(e.data))
        return;
      this.raslSkipped = !0;
    }
    if (this.customDecoder)
      this.customDecoderQueueSize++, this.customDecoderCallSerializer.call(() => this.customDecoder.decode(e)).then(() => this.customDecoderQueueSize--);
    else {
      if (m(this.decoder), Vt() || Oi(this.inputTimestamps, e.timestamp, (t) => t), qr() && this.currentPacketIndex === 0 && this.codec === "avc") {
        const t = [];
        for (const s of xs(e.data, this.decoderConfig)) {
          const n = Tr(e.data[s.offset]);
          n >= 20 && n <= 31 || t.push(e.data.subarray(s.offset, s.offset + s.length));
        }
        const i = Xn(t, this.decoderConfig);
        e = new q(i, e.type, e.timestamp, e.duration);
      }
      this.decoder.decode(e.toEncodedVideoChunk()), this.decodeAlphaData(e);
    }
    this.currentPacketIndex++;
  }
  decodeAlphaData(e) {
    if (!e.sideData.alpha || this.mergerCreationFailed) {
      this.pushNullAlphaFrame();
      return;
    }
    if (!this.merger)
      try {
        this.merger = new wa();
      } catch (i) {
        console.error("Due to an error, only color data will be decoded.", i), this.mergerCreationFailed = !0, this.decodeAlphaData(e);
        return;
      }
    if (!this.alphaDecoder) {
      const i = (n) => {
        if (this.alphaDecoderQueueSize--, this.colorQueue.length > 0) {
          const a = this.colorQueue.shift();
          m(a !== void 0), this.mergeAlpha(a, n);
        } else
          this.alphaQueue.push(n);
        for (this.decodedAlphaChunkCount++; this.nullAlphaFrameQueue.length > 0 && this.nullAlphaFrameQueue[0] === this.decodedAlphaChunkCount; )
          if (this.nullAlphaFrameQueue.shift(), this.colorQueue.length > 0) {
            const a = this.colorQueue.shift();
            m(a !== void 0), this.mergeAlpha(a, null);
          } else
            this.alphaQueue.push(null);
      }, s = new Error("Decoding error").stack;
      this.alphaDecoder = new VideoDecoder({
        output: (n) => {
          try {
            i(n);
          } catch (a) {
            this.onError(a);
          }
        },
        error: (n) => {
          n.stack = s, this.onError(n);
        }
      }), this.alphaDecoder.configure(this.decoderConfig);
    }
    const t = wi(this.codec, this.decoderConfig, e.sideData.alpha);
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
    for (const t of vs(e, this.decoderConfig)) {
      const i = $t(e[t.offset]);
      if (i === ne.RASL_N || i === ne.RASL_R)
        return !0;
    }
    return !1;
  }
  /** Handler for the WebCodecs VideoDecoder for ironing out browser differences. */
  sampleHandler(e) {
    if (Vt()) {
      if (this.sampleQueue.length > 0 && e.timestamp >= K(this.sampleQueue).timestamp) {
        for (const t of this.sampleQueue)
          this.finalizeAndEmitSample(t);
        this.sampleQueue.length = 0;
      }
      Oi(this.sampleQueue, e, (t) => t.timestamp);
    } else {
      const t = this.inputTimestamps.shift();
      m(t !== void 0), e.setTimestamp(t), this.finalizeAndEmitSample(e);
    }
  }
  finalizeAndEmitSample(e) {
    e.setTimestamp(Math.round(e.timestamp * this.timeResolution) / this.timeResolution), e.setDuration(Math.round(e.duration * this.timeResolution) / this.timeResolution), e.setRotation(this.rotation), this.onSample(e);
  }
  mergeAlpha(e, t) {
    if (!t) {
      const n = new ae(e);
      this.sampleHandler(n);
      return;
    }
    m(this.merger), this.merger.update(e, t), e.close(), t.close();
    const i = new VideoFrame(this.merger.canvas, {
      timestamp: e.timestamp,
      duration: e.duration ?? void 0
    }), s = new ae(i);
    this.sampleHandler(s);
  }
  async flush() {
    if (this.customDecoder ? await this.customDecoderCallSerializer.call(() => this.customDecoder.flush()) : (m(this.decoder), await Promise.all([
      this.decoder.flush(),
      this.alphaDecoder?.flush()
    ]), this.colorQueue.forEach((e) => e.close()), this.colorQueue.length = 0, this.alphaQueue.forEach((e) => e?.close()), this.alphaQueue.length = 0, this.alphaHadKeyframe = !1, this.decodedAlphaChunkCount = 0, this.alphaDecoderQueueSize = 0, this.nullAlphaFrameQueue.length = 0, this.currentAlphaPacketIndex = 0, this.alphaRaslSkipped = !1), Vt()) {
      for (const e of this.sampleQueue)
        this.finalizeAndEmitSample(e);
      this.sampleQueue.length = 0;
    }
    this.currentPacketIndex = 0, this.raslSkipped = !1;
  }
  close() {
    this.customDecoder ? this.customDecoderCallSerializer.call(() => this.customDecoder.close()) : (m(this.decoder), this.decoder.close(), this.alphaDecoder?.close(), this.colorQueue.forEach((e) => e.close()), this.colorQueue.length = 0, this.alphaQueue.forEach((e) => e?.close()), this.alphaQueue.length = 0, this.merger?.close());
    for (const e of this.sampleQueue)
      e.close();
    this.sampleQueue.length = 0;
  }
}
class wa {
  constructor() {
    typeof OffscreenCanvas < "u" ? this.canvas = new OffscreenCanvas(300, 150) : this.canvas = document.createElement("canvas");
    const e = this.canvas.getContext("webgl2", {
      premultipliedAlpha: !1
    });
    if (!e)
      throw new Error("Couldn't acquire WebGL 2 context.");
    this.gl = e, this.program = this.createProgram(), this.vao = this.createVAO(), this.colorTexture = this.createTexture(), this.alphaTexture = this.createTexture(), this.gl.useProgram(this.program), this.gl.uniform1i(this.gl.getUniformLocation(this.program, "u_colorTexture"), 0), this.gl.uniform1i(this.gl.getUniformLocation(this.program, "u_alphaTexture"), 1);
  }
  createProgram() {
    const e = this.createShader(this.gl.VERTEX_SHADER, `#version 300 es
			in vec2 a_position;
			in vec2 a_texCoord;
			out vec2 v_texCoord;
			
			void main() {
				gl_Position = vec4(a_position, 0.0, 1.0);
				v_texCoord = a_texCoord;
			}
		`), t = this.createShader(this.gl.FRAGMENT_SHADER, `#version 300 es
			precision highp float;
			
			uniform sampler2D u_colorTexture;
			uniform sampler2D u_alphaTexture;
			in vec2 v_texCoord;
			out vec4 fragColor;
			
			void main() {
				vec3 color = texture(u_colorTexture, v_texCoord).rgb;
				float alpha = texture(u_alphaTexture, v_texCoord).r;
				fragColor = vec4(color, alpha);
			}
		`), i = this.gl.createProgram();
    return this.gl.attachShader(i, e), this.gl.attachShader(i, t), this.gl.linkProgram(i), i;
  }
  createShader(e, t) {
    const i = this.gl.createShader(e);
    return this.gl.shaderSource(i, t), this.gl.compileShader(i), i;
  }
  createVAO() {
    const e = this.gl.createVertexArray();
    this.gl.bindVertexArray(e);
    const t = new Float32Array([
      -1,
      -1,
      0,
      1,
      1,
      -1,
      1,
      1,
      -1,
      1,
      0,
      0,
      1,
      1,
      1,
      0
    ]), i = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, i), this.gl.bufferData(this.gl.ARRAY_BUFFER, t, this.gl.STATIC_DRAW);
    const s = this.gl.getAttribLocation(this.program, "a_position"), n = this.gl.getAttribLocation(this.program, "a_texCoord");
    return this.gl.enableVertexAttribArray(s), this.gl.vertexAttribPointer(s, 2, this.gl.FLOAT, !1, 16, 0), this.gl.enableVertexAttribArray(n), this.gl.vertexAttribPointer(n, 2, this.gl.FLOAT, !1, 16, 8), e;
  }
  createTexture() {
    const e = this.gl.createTexture();
    return this.gl.bindTexture(this.gl.TEXTURE_2D, e), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR), e;
  }
  update(e, t) {
    (e.displayWidth !== this.canvas.width || e.displayHeight !== this.canvas.height) && (this.canvas.width = e.displayWidth, this.canvas.height = e.displayHeight), this.gl.activeTexture(this.gl.TEXTURE0), this.gl.bindTexture(this.gl.TEXTURE_2D, this.colorTexture), this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, e), this.gl.activeTexture(this.gl.TEXTURE1), this.gl.bindTexture(this.gl.TEXTURE_2D, this.alphaTexture), this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, t), this.gl.viewport(0, 0, this.canvas.width, this.canvas.height), this.gl.clear(this.gl.COLOR_BUFFER_BIT), this.gl.bindVertexArray(this.vao), this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }
  close() {
    this.gl.getExtension("WEBGL_lose_context")?.loseContext(), this.gl = null;
  }
}
class Gr extends Os {
  /** Creates a new {@link VideoSampleSink} for the given {@link InputVideoTrack}. */
  constructor(e) {
    if (!(e instanceof Bt))
      throw new TypeError("videoTrack must be an InputVideoTrack.");
    super(), this._track = e;
  }
  /** @internal */
  async _createDecoder(e, t) {
    if (!await this._track.canDecode())
      throw new Error("This video track cannot be decoded by this browser. Make sure to check decodability before using a track.");
    const i = this._track.codec, s = this._track.rotation, n = await this._track.getDecoderConfig(), a = this._track.timeResolution;
    return m(i && n), new ba(e, t, i, n, s, a);
  }
  /** @internal */
  _createPacketSink() {
    return new Kt(this._track);
  }
  /**
   * Retrieves the video sample (frame) corresponding to the given timestamp, in seconds. More specifically, returns
   * the last video sample (in presentation order) with a start timestamp less than or equal to the given timestamp.
   * Returns null if the timestamp is before the track's first timestamp.
   *
   * @param timestamp - The timestamp used for retrieval, in seconds.
   */
  async getSample(e) {
    Ke(e);
    for await (const t of this.mediaSamplesAtTimestamps([e]))
      return t;
    throw new Error("Internal error: Iterator returned nothing.");
  }
  /**
   * Creates an async iterator that yields the video samples (frames) of this track in presentation order. This method
   * will intelligently pre-decode a few frames ahead to enable fast iteration.
   *
   * @param startTimestamp - The timestamp in seconds at which to start yielding samples (inclusive).
   * @param endTimestamp - The timestamp in seconds at which to stop yielding samples (exclusive).
   */
  samples(e = 0, t = 1 / 0) {
    return this.mediaSamplesInRange(e, t);
  }
  /**
   * Creates an async iterator that yields a video sample (frame) for each timestamp in the argument. This method
   * uses an optimized decoding pipeline if these timestamps are monotonically sorted, decoding each packet at most
   * once, and is therefore more efficient than manually getting the sample for every timestamp. The iterator may
   * yield null if no frame is available for a given timestamp.
   *
   * @param timestamps - An iterable or async iterable of timestamps in seconds.
   */
  samplesAtTimestamps(e) {
    return this.mediaSamplesAtTimestamps(e);
  }
}
class ya {
  /** Creates a new {@link CanvasSink} for the given {@link InputVideoTrack}. */
  constructor(e, t = {}) {
    if (this._nextCanvasIndex = 0, !(e instanceof Bt))
      throw new TypeError("videoTrack must be an InputVideoTrack.");
    if (t && typeof t != "object")
      throw new TypeError("options must be an object.");
    if (t.alpha !== void 0 && typeof t.alpha != "boolean")
      throw new TypeError("options.alpha, when provided, must be a boolean.");
    if (t.width !== void 0 && (!Number.isInteger(t.width) || t.width <= 0))
      throw new TypeError("options.width, when defined, must be a positive integer.");
    if (t.height !== void 0 && (!Number.isInteger(t.height) || t.height <= 0))
      throw new TypeError("options.height, when defined, must be a positive integer.");
    if (t.fit !== void 0 && !["fill", "contain", "cover"].includes(t.fit))
      throw new TypeError('options.fit, when provided, must be one of "fill", "contain", or "cover".');
    if (t.width !== void 0 && t.height !== void 0 && t.fit === void 0)
      throw new TypeError("When both options.width and options.height are provided, options.fit must also be provided.");
    if (t.rotation !== void 0 && ![0, 90, 180, 270].includes(t.rotation))
      throw new TypeError("options.rotation, when provided, must be 0, 90, 180 or 270.");
    if (t.crop !== void 0 && Ti(t.crop, "options."), t.poolSize !== void 0 && (typeof t.poolSize != "number" || !Number.isInteger(t.poolSize) || t.poolSize < 0))
      throw new TypeError("poolSize must be a non-negative integer.");
    const i = t.rotation ?? e.rotation, [s, n] = i % 180 === 0 ? [e.codedWidth, e.codedHeight] : [e.codedHeight, e.codedWidth], a = t.crop;
    a && yi(a, s, n);
    let [o, c] = a ? [a.width, a.height] : [s, n];
    const l = o / c;
    t.width !== void 0 && t.height === void 0 ? (o = t.width, c = Math.round(o / l)) : t.width === void 0 && t.height !== void 0 ? (c = t.height, o = Math.round(c * l)) : t.width !== void 0 && t.height !== void 0 && (o = t.width, c = t.height), this._videoTrack = e, this._alpha = t.alpha ?? !1, this._width = o, this._height = c, this._rotation = i, this._crop = a, this._fit = t.fit ?? "fill", this._videoSampleSink = new Gr(e), this._canvasPool = Array.from({ length: t.poolSize ?? 0 }, () => null);
  }
  /** @internal */
  _videoSampleToWrappedCanvas(e) {
    let t = this._canvasPool[this._nextCanvasIndex], i = !1;
    t || (typeof document < "u" ? (t = document.createElement("canvas"), t.width = this._width, t.height = this._height) : t = new OffscreenCanvas(this._width, this._height), this._canvasPool.length > 0 && (this._canvasPool[this._nextCanvasIndex] = t), i = !0), this._canvasPool.length > 0 && (this._nextCanvasIndex = (this._nextCanvasIndex + 1) % this._canvasPool.length);
    const s = t.getContext("2d", {
      alpha: this._alpha || At()
      // Firefox has VideoFrame glitches with opaque canvases
    });
    m(s), s.resetTransform(), i || (!this._alpha && At() ? (s.fillStyle = "black", s.fillRect(0, 0, this._width, this._height)) : s.clearRect(0, 0, this._width, this._height)), e.drawWithFit(s, {
      fit: this._fit,
      rotation: this._rotation,
      crop: this._crop
    });
    const n = {
      canvas: t,
      timestamp: e.timestamp,
      duration: e.duration
    };
    return e.close(), n;
  }
  /**
   * Retrieves a canvas with the video frame corresponding to the given timestamp, in seconds. More specifically,
   * returns the last video frame (in presentation order) with a start timestamp less than or equal to the given
   * timestamp. Returns null if the timestamp is before the track's first timestamp.
   *
   * @param timestamp - The timestamp used for retrieval, in seconds.
   */
  async getCanvas(e) {
    Ke(e);
    const t = await this._videoSampleSink.getSample(e);
    return t && this._videoSampleToWrappedCanvas(t);
  }
  /**
   * Creates an async iterator that yields canvases with the video frames of this track in presentation order. This
   * method will intelligently pre-decode a few frames ahead to enable fast iteration.
   *
   * @param startTimestamp - The timestamp in seconds at which to start yielding canvases (inclusive).
   * @param endTimestamp - The timestamp in seconds at which to stop yielding canvases (exclusive).
   */
  canvases(e = 0, t = 1 / 0) {
    return Ni(this._videoSampleSink.samples(e, t), (i) => this._videoSampleToWrappedCanvas(i));
  }
  /**
   * Creates an async iterator that yields a canvas for each timestamp in the argument. This method uses an optimized
   * decoding pipeline if these timestamps are monotonically sorted, decoding each packet at most once, and is
   * therefore more efficient than manually getting the canvas for every timestamp. The iterator may yield null if
   * no frame is available for a given timestamp.
   *
   * @param timestamps - An iterable or async iterable of timestamps in seconds.
   */
  canvasesAtTimestamps(e) {
    return Ni(this._videoSampleSink.samplesAtTimestamps(e), (t) => t && this._videoSampleToWrappedCanvas(t));
  }
}
class Ta extends Si {
  constructor(e, t, i, s) {
    super(e, t), this.decoder = null, this.customDecoder = null, this.customDecoderCallSerializer = new wr(), this.customDecoderQueueSize = 0, this.currentTimestamp = null;
    const n = (o) => {
      (this.currentTimestamp === null || Math.abs(o.timestamp - this.currentTimestamp) >= o.duration) && (this.currentTimestamp = o.timestamp);
      const c = this.currentTimestamp;
      if (this.currentTimestamp += o.duration, o.numberOfFrames === 0) {
        o.close();
        return;
      }
      const l = s.sampleRate;
      o.setTimestamp(Math.round(c * l) / l), e(o);
    }, a = Rs.find((o) => o.supports(i, s));
    if (a)
      this.customDecoder = new a(), this.customDecoder.codec = i, this.customDecoder.config = s, this.customDecoder.onSample = (o) => {
        if (!(o instanceof pe))
          throw new TypeError("The argument passed to onSample must be an AudioSample.");
        n(o);
      }, this.customDecoderCallSerializer.call(() => this.customDecoder.init());
    else {
      const o = new Error("Decoding error").stack;
      this.decoder = new AudioDecoder({
        output: (c) => {
          try {
            n(new pe(c));
          } catch (l) {
            this.onError(l);
          }
        },
        error: (c) => {
          c.stack = o, this.onError(c);
        }
      }), this.decoder.configure(s);
    }
  }
  getDecodeQueueSize() {
    return this.customDecoder ? this.customDecoderQueueSize : (m(this.decoder), this.decoder.decodeQueueSize);
  }
  decode(e) {
    this.customDecoder ? (this.customDecoderQueueSize++, this.customDecoderCallSerializer.call(() => this.customDecoder.decode(e)).then(() => this.customDecoderQueueSize--)) : (m(this.decoder), this.decoder.decode(e.toEncodedAudioChunk()));
  }
  flush() {
    return this.customDecoder ? this.customDecoderCallSerializer.call(() => this.customDecoder.flush()) : (m(this.decoder), this.decoder.flush());
  }
  close() {
    this.customDecoder ? this.customDecoderCallSerializer.call(() => this.customDecoder.close()) : (m(this.decoder), this.decoder.close());
  }
}
class Sa extends Si {
  constructor(e, t, i) {
    super(e, t), this.decoderConfig = i, this.currentTimestamp = null, m(oe.includes(i.codec)), this.codec = i.codec;
    const { dataType: s, sampleSize: n, littleEndian: a } = Ye(this.codec);
    switch (this.inputSampleSize = n, n) {
      case 1:
        s === "unsigned" ? this.readInputValue = (o, c) => o.getUint8(c) - 2 ** 7 : s === "signed" ? this.readInputValue = (o, c) => o.getInt8(c) : s === "ulaw" ? this.readInputValue = (o, c) => da(o.getUint8(c)) : s === "alaw" ? this.readInputValue = (o, c) => fa(o.getUint8(c)) : m(!1);
        break;
      case 2:
        s === "unsigned" ? this.readInputValue = (o, c) => o.getUint16(c, a) - 2 ** 15 : s === "signed" ? this.readInputValue = (o, c) => o.getInt16(c, a) : m(!1);
        break;
      case 3:
        s === "unsigned" ? this.readInputValue = (o, c) => br(o, c, a) - 2 ** 23 : s === "signed" ? this.readInputValue = (o, c) => Cn(o, c, a) : m(!1);
        break;
      case 4:
        s === "unsigned" ? this.readInputValue = (o, c) => o.getUint32(c, a) - 2 ** 31 : s === "signed" ? this.readInputValue = (o, c) => o.getInt32(c, a) : s === "float" ? this.readInputValue = (o, c) => o.getFloat32(c, a) : m(!1);
        break;
      case 8:
        s === "float" ? this.readInputValue = (o, c) => o.getFloat64(c, a) : m(!1);
        break;
      default:
        Ge(n), m(!1);
    }
    switch (n) {
      case 1:
        s === "ulaw" || s === "alaw" ? (this.outputSampleSize = 2, this.outputFormat = "s16", this.writeOutputValue = (o, c, l) => o.setInt16(c, l, !0)) : (this.outputSampleSize = 1, this.outputFormat = "u8", this.writeOutputValue = (o, c, l) => o.setUint8(c, l + 2 ** 7));
        break;
      case 2:
        this.outputSampleSize = 2, this.outputFormat = "s16", this.writeOutputValue = (o, c, l) => o.setInt16(c, l, !0);
        break;
      case 3:
        this.outputSampleSize = 4, this.outputFormat = "s32", this.writeOutputValue = (o, c, l) => o.setInt32(c, l << 8, !0);
        break;
      case 4:
        this.outputSampleSize = 4, s === "float" ? (this.outputFormat = "f32", this.writeOutputValue = (o, c, l) => o.setFloat32(c, l, !0)) : (this.outputFormat = "s32", this.writeOutputValue = (o, c, l) => o.setInt32(c, l, !0));
        break;
      case 8:
        this.outputSampleSize = 4, this.outputFormat = "f32", this.writeOutputValue = (o, c, l) => o.setFloat32(c, l, !0);
        break;
      default:
        Ge(n), m(!1);
    }
  }
  getDecodeQueueSize() {
    return 0;
  }
  decode(e) {
    const t = G(e.data), i = e.byteLength / this.decoderConfig.numberOfChannels / this.inputSampleSize, s = i * this.decoderConfig.numberOfChannels * this.outputSampleSize, n = new ArrayBuffer(s), a = new DataView(n);
    for (let u = 0; u < i * this.decoderConfig.numberOfChannels; u++) {
      const d = u * this.inputSampleSize, h = u * this.outputSampleSize, f = this.readInputValue(t, d);
      this.writeOutputValue(a, h, f);
    }
    const o = i / this.decoderConfig.sampleRate;
    (this.currentTimestamp === null || Math.abs(e.timestamp - this.currentTimestamp) >= o) && (this.currentTimestamp = e.timestamp);
    const c = this.currentTimestamp;
    this.currentTimestamp += o;
    const l = new pe({
      format: this.outputFormat,
      data: n,
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
class Xi extends Os {
  /** Creates a new {@link AudioSampleSink} for the given {@link InputAudioTrack}. */
  constructor(e) {
    if (!(e instanceof Fe))
      throw new TypeError("audioTrack must be an InputAudioTrack.");
    super(), this._track = e;
  }
  /** @internal */
  async _createDecoder(e, t) {
    if (!await this._track.canDecode())
      throw new Error("This audio track cannot be decoded by this browser. Make sure to check decodability before using a track.");
    const i = this._track.codec, s = await this._track.getDecoderConfig();
    return m(i && s), oe.includes(s.codec) ? new Sa(e, t, s) : new Ta(e, t, i, s);
  }
  /** @internal */
  _createPacketSink() {
    return new Kt(this._track);
  }
  /**
   * Retrieves the audio sample corresponding to the given timestamp, in seconds. More specifically, returns
   * the last audio sample (in presentation order) with a start timestamp less than or equal to the given timestamp.
   * Returns null if the timestamp is before the track's first timestamp.
   *
   * @param timestamp - The timestamp used for retrieval, in seconds.
   */
  async getSample(e) {
    Ke(e);
    for await (const t of this.mediaSamplesAtTimestamps([e]))
      return t;
    throw new Error("Internal error: Iterator returned nothing.");
  }
  /**
   * Creates an async iterator that yields the audio samples of this track in presentation order. This method
   * will intelligently pre-decode a few samples ahead to enable fast iteration.
   *
   * @param startTimestamp - The timestamp in seconds at which to start yielding samples (inclusive).
   * @param endTimestamp - The timestamp in seconds at which to stop yielding samples (exclusive).
   */
  samples(e = 0, t = 1 / 0) {
    return this.mediaSamplesInRange(e, t);
  }
  /**
   * Creates an async iterator that yields an audio sample for each timestamp in the argument. This method
   * uses an optimized decoding pipeline if these timestamps are monotonically sorted, decoding each packet at most
   * once, and is therefore more efficient than manually getting the sample for every timestamp. The iterator may
   * yield null if no sample is available for a given timestamp.
   *
   * @param timestamps - An iterable or async iterable of timestamps in seconds.
   */
  samplesAtTimestamps(e) {
    return this.mediaSamplesAtTimestamps(e);
  }
}
class Pi {
  /** @internal */
  constructor(e, t) {
    this.input = e, this._backing = t;
  }
  /** Returns true if and only if this track is a video track. */
  isVideoTrack() {
    return this instanceof Bt;
  }
  /** Returns true if and only if this track is an audio track. */
  isAudioTrack() {
    return this instanceof Fe;
  }
  /** The unique ID of this track in the input file. */
  get id() {
    return this._backing.getId();
  }
  /**
   * The identifier of the codec used internally by the container. It is not homogenized by Mediabunny
   * and depends entirely on the container format.
   *
   * This field can be used to determine the codec of a track in case Mediabunny doesn't know that codec.
   *
   * - For ISOBMFF files, this field returns the name of the Sample Description Box (e.g. `'avc1'`).
   * - For Matroska files, this field returns the value of the `CodecID` element.
   * - For WAVE files, this field returns the value of the format tag in the `'fmt '` chunk.
   * - For ADTS files, this field contains the `MPEG-4 Audio Object Type`.
   * - For MPEG-TS files, this field contains the `streamType` value from the Program Map Table.
   * - In all other cases, this field is `null`.
   */
  get internalCodecId() {
    return this._backing.getInternalCodecId();
  }
  /**
   * The ISO 639-2/T language code for this track. If the language is unknown, this field is `'und'` (undetermined).
   */
  get languageCode() {
    return this._backing.getLanguageCode();
  }
  /** A user-defined name for this track. */
  get name() {
    return this._backing.getName();
  }
  /**
   * A positive number x such that all timestamps and durations of all packets of this track are
   * integer multiples of 1/x.
   */
  get timeResolution() {
    return this._backing.getTimeResolution();
  }
  /** The track's disposition, i.e. information about its intended usage. */
  get disposition() {
    return this._backing.getDisposition();
  }
  /**
   * Returns the start timestamp of the first packet of this track, in seconds. While often near zero, this value
   * may be positive or even negative. A negative starting timestamp means the track's timing has been offset. Samples
   * with a negative timestamp should not be presented.
   */
  getFirstTimestamp() {
    return this._backing.getFirstTimestamp();
  }
  /** Returns the end timestamp of the last packet of this track, in seconds. */
  computeDuration() {
    return this._backing.computeDuration();
  }
  /**
   * Computes aggregate packet statistics for this track, such as average packet rate or bitrate.
   *
   * @param targetPacketCount - This optional parameter sets a target for how many packets this method must have
   * looked at before it can return early; this means, you can use it to aggregate only a subset (prefix) of all
   * packets. This is very useful for getting a great estimate of video frame rate without having to scan through the
   * entire file.
   */
  async computePacketStats(e = 1 / 0) {
    const t = new Kt(this);
    let i = 1 / 0, s = -1 / 0, n = 0, a = 0;
    for await (const o of t.packets(void 0, void 0, { metadataOnly: !0 })) {
      if (n >= e && o.timestamp >= s)
        break;
      i = Math.min(i, o.timestamp), s = Math.max(s, o.timestamp + o.duration), n++, a += o.byteLength;
    }
    return {
      packetCount: n,
      averagePacketRate: n ? Number((n / (s - i)).toPrecision(16)) : 0,
      averageBitrate: n ? Number((8 * a / (s - i)).toPrecision(16)) : 0
    };
  }
}
class Bt extends Pi {
  /** @internal */
  constructor(e, t) {
    super(e, t), this._backing = t;
  }
  get type() {
    return "video";
  }
  get codec() {
    return this._backing.getCodec();
  }
  /** The width in pixels of the track's coded samples, before any transformations or rotations. */
  get codedWidth() {
    return this._backing.getCodedWidth();
  }
  /** The height in pixels of the track's coded samples, before any transformations or rotations. */
  get codedHeight() {
    return this._backing.getCodedHeight();
  }
  /** The angle in degrees by which the track's frames should be rotated (clockwise). */
  get rotation() {
    return this._backing.getRotation();
  }
  /** The width in pixels of the track's frames after rotation. */
  get displayWidth() {
    return this._backing.getRotation() % 180 === 0 ? this._backing.getCodedWidth() : this._backing.getCodedHeight();
  }
  /** The height in pixels of the track's frames after rotation. */
  get displayHeight() {
    return this._backing.getRotation() % 180 === 0 ? this._backing.getCodedHeight() : this._backing.getCodedWidth();
  }
  /** Returns the color space of the track's samples. */
  getColorSpace() {
    return this._backing.getColorSpace();
  }
  /** If this method returns true, the track's samples use a high dynamic range (HDR). */
  async hasHighDynamicRange() {
    const e = await this._backing.getColorSpace();
    return e.primaries === "bt2020" || e.primaries === "smpte432" || e.transfer === "pg" || e.transfer === "hlg" || e.matrix === "bt2020-ncl";
  }
  /** Checks if this track may contain transparent samples with alpha data. */
  canBeTransparent() {
    return this._backing.canBeTransparent();
  }
  /**
   * Returns the [decoder configuration](https://www.w3.org/TR/webcodecs/#video-decoder-config) for decoding the
   * track's packets using a [`VideoDecoder`](https://developer.mozilla.org/en-US/docs/Web/API/VideoDecoder). Returns
   * null if the track's codec is unknown.
   */
  getDecoderConfig() {
    return this._backing.getDecoderConfig();
  }
  async getCodecParameterString() {
    return (await this._backing.getDecoderConfig())?.codec ?? null;
  }
  async canDecode() {
    try {
      const e = await this._backing.getDecoderConfig();
      if (!e)
        return !1;
      const t = this._backing.getCodec();
      return m(t !== null), Bs.some((s) => s.supports(t, e)) ? !0 : typeof VideoDecoder > "u" ? !1 : (await VideoDecoder.isConfigSupported(e)).supported === !0;
    } catch (e) {
      return console.error("Error during decodability check:", e), !1;
    }
  }
  async determinePacketType(e) {
    if (!(e instanceof q))
      throw new TypeError("packet must be an EncodedPacket.");
    if (e.isMetadataOnly)
      throw new TypeError("packet must not be metadata-only to determine its type.");
    if (this.codec === null)
      return null;
    const t = await this.getDecoderConfig();
    return m(t), wi(this.codec, t, e.data);
  }
}
class Fe extends Pi {
  /** @internal */
  constructor(e, t) {
    super(e, t), this._backing = t;
  }
  get type() {
    return "audio";
  }
  get codec() {
    return this._backing.getCodec();
  }
  /** The number of audio channels in the track. */
  get numberOfChannels() {
    return this._backing.getNumberOfChannels();
  }
  /** The track's audio sample rate in hertz. */
  get sampleRate() {
    return this._backing.getSampleRate();
  }
  /**
   * Returns the [decoder configuration](https://www.w3.org/TR/webcodecs/#audio-decoder-config) for decoding the
   * track's packets using an [`AudioDecoder`](https://developer.mozilla.org/en-US/docs/Web/API/AudioDecoder). Returns
   * null if the track's codec is unknown.
   */
  getDecoderConfig() {
    return this._backing.getDecoderConfig();
  }
  async getCodecParameterString() {
    return (await this._backing.getDecoderConfig())?.codec ?? null;
  }
  async canDecode() {
    try {
      const e = await this._backing.getDecoderConfig();
      if (!e)
        return !1;
      const t = this._backing.getCodec();
      return m(t !== null), Rs.some((i) => i.supports(t, e)) || e.codec.startsWith("pcm-") ? !0 : typeof AudioDecoder > "u" ? !1 : (await AudioDecoder.isConfigSupported(e)).supported === !0;
    } catch (e) {
      return console.error("Error during decodability check:", e), !1;
    }
  }
  async determinePacketType(e) {
    if (!(e instanceof q))
      throw new TypeError("packet must be an EncodedPacket.");
    return this.codec === null ? null : "key";
  }
}
const Ns = (r) => {
  let t = (r.hasVideo ? "video/" : r.hasAudio ? "audio/" : "application/") + (r.isQuickTime ? "quicktime" : "mp4");
  if (r.codecStrings.length > 0) {
    const i = [...new Set(r.codecStrings)];
    t += `; codecs="${i.join(", ")}"`;
  }
  return t;
};
const Me = 8, it = 16, He = (r) => {
  let e = _(r);
  const t = te(r, 4);
  let i = 8;
  e === 1 && (e = be(r), i = 16);
  const n = e - i;
  return n < 0 ? null : { name: t, totalSize: e, headerSize: i, contentSize: n };
}, tt = (r) => nt(r) / 65536, Ar = (r) => nt(r) / 1073741824, Br = (r) => {
  let e = 0;
  for (let t = 0; t < 4; t++) {
    e <<= 7;
    const i = A(r);
    if (e |= i & 127, (i & 128) === 0)
      break;
  }
  return e;
}, Te = (r) => {
  let e = J(r);
  return r.skip(2), e = Math.min(e, r.remainingLength), ge.decode(O(r, e));
}, Pa = (r) => {
  const e = He(r);
  if (!e || e.name !== "data" || r.remainingLength < 8)
    return null;
  const t = _(r);
  r.skip(4);
  const i = O(r, e.contentSize - 8);
  switch (t) {
    case 1:
      return ge.decode(i);
    // UTF-8
    case 2:
      return new TextDecoder("utf-16be").decode(i);
    // UTF-16-BE
    case 13:
      return new It(i, "image/jpeg");
    case 14:
      return new It(i, "image/png");
    case 27:
      return new It(i, "image/bmp");
    default:
      return i;
  }
};
class xa extends Ze {
  constructor(e) {
    super(e), this.moovSlice = null, this.currentTrack = null, this.tracks = [], this.metadataPromise = null, this.movieTimescale = -1, this.movieDurationInTimescale = -1, this.isQuickTime = !1, this.metadataTags = {}, this.currentMetadataKeys = null, this.isFragmented = !1, this.fragmentTrackDefaults = [], this.currentFragment = null, this.lastReadFragment = null, this.reader = e._reader;
  }
  async computeDuration() {
    const e = await this.getTracks(), t = await Promise.all(e.map((i) => i.computeDuration()));
    return Math.max(0, ...t);
  }
  async getTracks() {
    return await this.readMetadata(), this.tracks.map((e) => e.inputTrack);
  }
  async getMimeType() {
    await this.readMetadata();
    const e = await Promise.all(this.tracks.map((t) => t.inputTrack.getCodecParameterString()));
    return Ns({
      isQuickTime: this.isQuickTime,
      hasVideo: this.tracks.some((t) => t.info?.type === "video"),
      hasAudio: this.tracks.some((t) => t.info?.type === "audio"),
      codecStrings: e.filter(Boolean)
    });
  }
  async getMetadataTags() {
    return await this.readMetadata(), this.metadataTags;
  }
  readMetadata() {
    return this.metadataPromise ??= (async () => {
      let e = 0;
      for (; ; ) {
        let t = this.reader.requestSliceRange(e, Me, it);
        if (t instanceof Promise && (t = await t), !t)
          break;
        const i = e, s = He(t);
        if (!s)
          break;
        if (s.name === "ftyp") {
          const n = te(t, 4);
          this.isQuickTime = n === "qt  ";
        } else if (s.name === "moov") {
          let n = this.reader.requestSlice(t.filePos, s.contentSize);
          if (n instanceof Promise && (n = await n), !n)
            break;
          this.moovSlice = n, this.readContiguousBoxes(this.moovSlice), this.tracks.sort((a, o) => Number(o.disposition.default) - Number(a.disposition.default));
          for (const a of this.tracks) {
            const o = a.editListPreviousSegmentDurations / this.movieTimescale;
            a.editListOffset -= Math.round(o * a.timescale);
          }
          break;
        }
        e = i + s.totalSize;
      }
      if (this.isFragmented && this.reader.fileSize !== null) {
        let t = this.reader.requestSlice(this.reader.fileSize - 4, 4);
        t instanceof Promise && (t = await t), m(t);
        const i = _(t), s = this.reader.fileSize - i;
        if (s >= 0 && s <= this.reader.fileSize - it) {
          let n = this.reader.requestSliceRange(s, Me, it);
          if (n instanceof Promise && (n = await n), n) {
            const a = He(n);
            if (a && a.name === "mfra") {
              let o = this.reader.requestSlice(n.filePos, a.contentSize);
              o instanceof Promise && (o = await o), o && this.readContiguousBoxes(o);
            }
          }
        }
      }
    })();
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
    e.sampleTable = t, m(this.moovSlice);
    const i = this.moovSlice.slice(e.sampleTableByteOffset);
    if (this.currentTrack = e, this.traverseBox(i), this.currentTrack = null, e.info?.type === "audio" && e.info.codec && oe.includes(e.info.codec) && t.sampleCompositionTimeOffsets.length === 0) {
      m(e.info?.type === "audio");
      const n = Ye(e.info.codec), a = [], o = [];
      for (let c = 0; c < t.sampleToChunk.length; c++) {
        const l = t.sampleToChunk[c], u = t.sampleToChunk[c + 1], d = (u ? u.startChunkIndex : t.chunkOffsets.length) - l.startChunkIndex;
        for (let h = 0; h < d; h++) {
          const f = l.startSampleIndex + h * l.samplesPerChunk, p = f + l.samplesPerChunk, g = L(t.sampleTimingEntries, f, (C) => C.startIndex), k = t.sampleTimingEntries[g], w = L(t.sampleTimingEntries, p, (C) => C.startIndex), b = t.sampleTimingEntries[w], y = k.startDecodeTimestamp + (f - k.startIndex) * k.delta, x = b.startDecodeTimestamp + (p - b.startIndex) * b.delta - y, S = K(a);
          S && S.delta === x ? S.count++ : a.push({
            startIndex: l.startChunkIndex + h,
            startDecodeTimestamp: y,
            count: 1,
            delta: x
          });
          const E = l.samplesPerChunk * n.sampleSize * e.info.numberOfChannels;
          o.push(E);
        }
        l.startSampleIndex = l.startChunkIndex, l.samplesPerChunk = 1;
      }
      t.sampleTimingEntries = a, t.sampleSizes = o;
    }
    if (t.sampleCompositionTimeOffsets.length > 0) {
      t.presentationTimestamps = [];
      for (const n of t.sampleTimingEntries)
        for (let a = 0; a < n.count; a++)
          t.presentationTimestamps.push({
            presentationTimestamp: n.startDecodeTimestamp + a * n.delta,
            sampleIndex: n.startIndex + a
          });
      for (const n of t.sampleCompositionTimeOffsets)
        for (let a = 0; a < n.count; a++) {
          const o = n.startIndex + a, c = t.presentationTimestamps[o];
          c && (c.presentationTimestamp += n.offset);
        }
      t.presentationTimestamps.sort((n, a) => n.presentationTimestamp - a.presentationTimestamp), t.presentationTimestampIndexMap = Array(t.presentationTimestamps.length).fill(-1);
      for (let n = 0; n < t.presentationTimestamps.length; n++)
        t.presentationTimestampIndexMap[t.presentationTimestamps[n].sampleIndex] = n;
    }
    return t;
  }
  async readFragment(e) {
    if (this.lastReadFragment?.moofOffset === e)
      return this.lastReadFragment;
    let t = this.reader.requestSliceRange(e, Me, it);
    t instanceof Promise && (t = await t), m(t);
    const i = He(t);
    m(i?.name === "moof");
    let s = this.reader.requestSlice(e, i.totalSize);
    s instanceof Promise && (s = await s), m(s), this.traverseBox(s);
    const n = this.lastReadFragment;
    m(n && n.moofOffset === e);
    for (const [, a] of n.trackData) {
      const o = a.track, { fragmentPositionCache: c } = o;
      if (!a.startTimestampIsFinal) {
        const u = o.fragmentLookupTable.find((d) => d.moofOffset === n.moofOffset);
        if (u)
          Rr(a, u.timestamp);
        else {
          const d = L(c, n.moofOffset - 1, (h) => h.moofOffset);
          if (d !== -1) {
            const h = c[d];
            Rr(a, h.endTimestamp);
          }
        }
        a.startTimestampIsFinal = !0;
      }
      const l = L(c, a.startTimestamp, (u) => u.startTimestamp);
      (l === -1 || c[l].moofOffset !== n.moofOffset) && c.splice(l + 1, 0, {
        moofOffset: n.moofOffset,
        startTimestamp: a.startTimestamp,
        endTimestamp: a.endTimestamp
      });
    }
    return n;
  }
  readContiguousBoxes(e) {
    const t = e.filePos;
    for (; e.filePos - t <= e.length - Me && this.traverseBox(e); )
      ;
  }
  // eslint-disable-next-line @stylistic/generator-star-spacing
  *iterateContiguousBoxes(e) {
    const t = e.filePos;
    for (; e.filePos - t <= e.length - Me; ) {
      const i = e.filePos, s = He(e);
      if (!s)
        break;
      yield { boxInfo: s, slice: e }, e.filePos = i + s.totalSize;
    }
  }
  traverseBox(e) {
    const t = e.filePos, i = He(e);
    if (!i)
      return !1;
    const s = e.filePos, n = t + i.totalSize;
    switch (i.name) {
      case "mdia":
      case "minf":
      case "dinf":
      case "mfra":
      case "edts":
        this.readContiguousBoxes(e.slice(s, i.contentSize));
        break;
      case "mvhd":
        {
          const a = A(e);
          e.skip(3), a === 1 ? (e.skip(16), this.movieTimescale = _(e), this.movieDurationInTimescale = be(e)) : (e.skip(8), this.movieTimescale = _(e), this.movieDurationInTimescale = _(e));
        }
        break;
      case "trak":
        {
          const a = {
            id: -1,
            demuxer: this,
            inputTrack: null,
            disposition: {
              ...Xe
            },
            info: null,
            timescale: -1,
            durationInMovieTimescale: -1,
            durationInMediaTimescale: -1,
            rotation: 0,
            internalCodecId: null,
            name: null,
            languageCode: de,
            sampleTableByteOffset: -1,
            sampleTable: null,
            fragmentLookupTable: [],
            currentFragmentState: null,
            fragmentPositionCache: [],
            editListPreviousSegmentDurations: 0,
            editListOffset: 0
          };
          if (this.currentTrack = a, this.readContiguousBoxes(e.slice(s, i.contentSize)), a.id !== -1 && a.timescale !== -1 && a.info !== null) {
            if (a.info.type === "video" && a.info.width !== -1) {
              const o = a;
              a.inputTrack = new Bt(this.input, new Ca(o)), this.tracks.push(a);
            } else if (a.info.type === "audio" && a.info.numberOfChannels !== -1) {
              const o = a;
              a.inputTrack = new Fe(this.input, new va(o)), this.tracks.push(a);
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
          const o = A(e), l = !!(wt(e) & 1);
          if (a.disposition.default = l, o === 0)
            e.skip(8), a.id = _(e), e.skip(4), a.durationInMovieTimescale = _(e);
          else if (o === 1)
            e.skip(16), a.id = _(e), e.skip(4), a.durationInMovieTimescale = be(e);
          else
            throw new Error(`Incorrect track header version ${o}.`);
          e.skip(16);
          const u = [
            tt(e),
            tt(e),
            Ar(e),
            tt(e),
            tt(e),
            Ar(e),
            tt(e),
            tt(e),
            Ar(e)
          ], d = li(ps(Fa(u), 90));
          m(d === 0 || d === 90 || d === 180 || d === 270), a.rotation = d;
        }
        break;
      case "elst":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          const o = A(e);
          e.skip(3);
          let c = !1, l = 0;
          const u = _(e);
          for (let d = 0; d < u; d++) {
            const h = o === 1 ? be(e) : _(e), f = o === 1 ? Lo(e) : nt(e), p = tt(e);
            if (h !== 0) {
              if (c) {
                console.warn("Unsupported edit list: multiple edits are not currently supported. Only using first edit.");
                break;
              }
              if (f === -1) {
                l += h;
                continue;
              }
              if (p !== 1) {
                console.warn("Unsupported edit list entry: media rate must be 1.");
                break;
              }
              a.editListPreviousSegmentDurations = l, a.editListOffset = f, c = !0;
            }
          }
        }
        break;
      case "mdhd":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          const o = A(e);
          e.skip(3), o === 0 ? (e.skip(8), a.timescale = _(e), a.durationInMediaTimescale = _(e)) : o === 1 && (e.skip(16), a.timescale = _(e), a.durationInMediaTimescale = be(e));
          let c = J(e);
          if (c > 0) {
            a.languageCode = "";
            for (let l = 0; l < 3; l++)
              a.languageCode = String.fromCharCode(96 + (c & 31)) + a.languageCode, c >>= 5;
            jt(a.languageCode) || (a.languageCode = de);
          }
        }
        break;
      case "hdlr":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          e.skip(8);
          const o = te(e, 4);
          o === "vide" ? a.info = {
            type: "video",
            width: -1,
            height: -1,
            codec: null,
            codecDescription: null,
            colorSpace: null,
            avcType: null,
            avcCodecInfo: null,
            hevcCodecInfo: null,
            vp9CodecInfo: null,
            av1CodecInfo: null
          } : o === "soun" && (a.info = {
            type: "audio",
            numberOfChannels: -1,
            sampleRate: -1,
            codec: null,
            codecDescription: null,
            aacCodecInfo: null
          });
        }
        break;
      case "stbl":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          a.sampleTableByteOffset = t, this.readContiguousBoxes(e.slice(s, i.contentSize));
        }
        break;
      case "stsd":
        {
          const a = this.currentTrack;
          if (!a || a.info === null || a.sampleTable)
            break;
          const o = A(e);
          e.skip(3);
          const c = _(e);
          for (let l = 0; l < c; l++) {
            const u = e.filePos, d = He(e);
            if (!d)
              break;
            a.internalCodecId = d.name;
            const h = d.name.toLowerCase();
            if (a.info.type === "video")
              h === "avc1" || h === "avc3" ? (a.info.codec = "avc", a.info.avcType = h === "avc1" ? 1 : 3) : h === "hvc1" || h === "hev1" ? a.info.codec = "hevc" : h === "vp08" ? a.info.codec = "vp8" : h === "vp09" ? a.info.codec = "vp9" : h === "av01" ? a.info.codec = "av1" : console.warn(`Unsupported video codec (sample entry type '${d.name}').`), e.skip(24), a.info.width = J(e), a.info.height = J(e), e.skip(50), this.readContiguousBoxes(e.slice(e.filePos, u + d.totalSize - e.filePos));
            else {
              h === "mp4a" || (h === "opus" ? a.info.codec = "opus" : h === "flac" ? a.info.codec = "flac" : h === "twos" || h === "sowt" || h === "raw " || h === "in24" || h === "in32" || h === "fl32" || h === "fl64" || h === "lpcm" || h === "ipcm" || h === "fpcm" || (h === "ulaw" ? a.info.codec = "ulaw" : h === "alaw" ? a.info.codec = "alaw" : console.warn(`Unsupported audio codec (sample entry type '${d.name}').`))), e.skip(8);
              const f = J(e);
              e.skip(6);
              let p = J(e), g = J(e);
              e.skip(4);
              let k = _(e) / 65536;
              if (o === 0 && f > 0) {
                if (f === 1)
                  e.skip(4), g = 8 * _(e), e.skip(8);
                else if (f === 2) {
                  e.skip(4), k = Zs(e), p = _(e), e.skip(4), g = _(e);
                  const w = _(e);
                  if (e.skip(8), h === "lpcm") {
                    const b = g + 7 >> 3, y = !!(w & 1), T = !!(w & 2), x = w & 4 ? -1 : 0;
                    g > 0 && g <= 64 && (y ? g === 32 && (a.info.codec = T ? "pcm-f32be" : "pcm-f32") : x & 1 << b - 1 ? b === 1 ? a.info.codec = "pcm-s8" : b === 2 ? a.info.codec = T ? "pcm-s16be" : "pcm-s16" : b === 3 ? a.info.codec = T ? "pcm-s24be" : "pcm-s24" : b === 4 && (a.info.codec = T ? "pcm-s32be" : "pcm-s32") : b === 1 && (a.info.codec = "pcm-u8")), a.info.codec === null && console.warn("Unsupported PCM format.");
                  }
                }
              }
              a.info.codec === "opus" && (k = yr), a.info.numberOfChannels = p, a.info.sampleRate = k, h === "twos" ? g === 8 ? a.info.codec = "pcm-s8" : g === 16 ? a.info.codec = "pcm-s16be" : (console.warn(`Unsupported sample size ${g} for codec 'twos'.`), a.info.codec = null) : h === "sowt" ? g === 8 ? a.info.codec = "pcm-s8" : g === 16 ? a.info.codec = "pcm-s16" : (console.warn(`Unsupported sample size ${g} for codec 'sowt'.`), a.info.codec = null) : h === "raw " ? a.info.codec = "pcm-u8" : h === "in24" ? a.info.codec = "pcm-s24be" : h === "in32" ? a.info.codec = "pcm-s32be" : h === "fl32" ? a.info.codec = "pcm-f32be" : h === "fl64" ? a.info.codec = "pcm-f64be" : h === "ipcm" ? a.info.codec = "pcm-s16be" : h === "fpcm" && (a.info.codec = "pcm-f32be"), this.readContiguousBoxes(e.slice(e.filePos, u + d.totalSize - e.filePos));
            }
          }
        }
        break;
      case "avcC":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          m(a.info), a.info.codecDescription = O(e, i.contentSize);
        }
        break;
      case "hvcC":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          m(a.info), a.info.codecDescription = O(e, i.contentSize);
        }
        break;
      case "vpcC":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          m(a.info?.type === "video"), e.skip(4);
          const o = A(e), c = A(e), l = A(e), u = l >> 4, d = l >> 1 & 7, h = l & 1, f = A(e), p = A(e), g = A(e);
          a.info.vp9CodecInfo = {
            profile: o,
            level: c,
            bitDepth: u,
            chromaSubsampling: d,
            videoFullRangeFlag: h,
            colourPrimaries: f,
            transferCharacteristics: p,
            matrixCoefficients: g
          };
        }
        break;
      case "av1C":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          m(a.info?.type === "video"), e.skip(1);
          const o = A(e), c = o >> 5, l = o & 31, u = A(e), d = u >> 7, h = u >> 6 & 1, f = u >> 5 & 1, p = u >> 4 & 1, g = u >> 3 & 1, k = u >> 2 & 1, w = u & 3, b = c === 2 && h ? f ? 12 : 10 : h ? 10 : 8;
          a.info.av1CodecInfo = {
            profile: c,
            level: l,
            tier: d,
            bitDepth: b,
            monochrome: p,
            chromaSubsamplingX: g,
            chromaSubsamplingY: k,
            chromaSamplePosition: w
          };
        }
        break;
      case "colr":
        {
          const a = this.currentTrack;
          if (!a || (m(a.info?.type === "video"), te(e, 4) !== "nclx"))
            break;
          const c = J(e), l = J(e), u = J(e), d = !!(A(e) & 128);
          a.info.colorSpace = {
            primaries: or[c],
            transfer: cr[l],
            matrix: lr[u],
            fullRange: d
          };
        }
        break;
      case "wave":
        this.readContiguousBoxes(e.slice(s, i.contentSize));
        break;
      case "esds":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          m(a.info?.type === "audio"), e.skip(4);
          const o = A(e);
          m(o === 3), Br(e), e.skip(2);
          const c = A(e), l = (c & 128) !== 0, u = (c & 64) !== 0, d = (c & 32) !== 0;
          if (l && e.skip(2), u) {
            const k = A(e);
            e.skip(k);
          }
          d && e.skip(2);
          const h = A(e);
          m(h === 4);
          const f = Br(e), p = e.filePos, g = A(e);
          if (g === 64 || g === 103 ? (a.info.codec = "aac", a.info.aacCodecInfo = {
            isMpeg2: g === 103,
            objectType: null
          }) : g === 105 || g === 107 ? a.info.codec = "mp3" : g === 221 ? a.info.codec = "vorbis" : console.warn(`Unsupported audio codec (objectTypeIndication ${g}) - discarding track.`), e.skip(12), f > e.filePos - p) {
            const k = A(e);
            m(k === 5);
            const w = Br(e);
            if (a.info.codecDescription = O(e, w), a.info.codec === "aac") {
              const b = pi(a.info.codecDescription);
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
          m(a.info?.type === "audio"), J(e) & 255 && (a.info.codec === "pcm-s16be" ? a.info.codec = "pcm-s16" : a.info.codec === "pcm-s24be" ? a.info.codec = "pcm-s24" : a.info.codec === "pcm-s32be" ? a.info.codec = "pcm-s32" : a.info.codec === "pcm-f32be" ? a.info.codec = "pcm-f32" : a.info.codec === "pcm-f64be" && (a.info.codec = "pcm-f64"));
        }
        break;
      case "pcmC": {
        const a = this.currentTrack;
        if (!a)
          break;
        m(a.info?.type === "audio"), e.skip(4);
        const c = !!(A(e) & 1), l = A(e);
        a.info.codec === "pcm-s16be" ? c ? l === 16 ? a.info.codec = "pcm-s16" : l === 24 ? a.info.codec = "pcm-s24" : l === 32 ? a.info.codec = "pcm-s32" : (console.warn(`Invalid ipcm sample size ${l}.`), a.info.codec = null) : l === 16 ? a.info.codec = "pcm-s16be" : l === 24 ? a.info.codec = "pcm-s24be" : l === 32 ? a.info.codec = "pcm-s32be" : (console.warn(`Invalid ipcm sample size ${l}.`), a.info.codec = null) : a.info.codec === "pcm-f32be" && (c ? l === 32 ? a.info.codec = "pcm-f32" : l === 64 ? a.info.codec = "pcm-f64" : (console.warn(`Invalid fpcm sample size ${l}.`), a.info.codec = null) : l === 32 ? a.info.codec = "pcm-f32be" : l === 64 ? a.info.codec = "pcm-f64be" : (console.warn(`Invalid fpcm sample size ${l}.`), a.info.codec = null));
        break;
      }
      case "dOps":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          m(a.info?.type === "audio"), e.skip(1);
          const o = A(e), c = J(e), l = _(e), u = ri(e), d = A(e);
          let h;
          d !== 0 ? h = O(e, 2 + o) : h = new Uint8Array(0);
          const f = new Uint8Array(19 + h.byteLength), p = new DataView(f.buffer);
          p.setUint32(0, 1332770163, !1), p.setUint32(4, 1214603620, !1), p.setUint8(8, 1), p.setUint8(9, o), p.setUint16(10, c, !0), p.setUint32(12, l, !0), p.setInt16(16, u, !0), p.setUint8(18, d), f.set(h, 19), a.info.codecDescription = f, a.info.numberOfChannels = o;
        }
        break;
      case "dfLa":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          m(a.info?.type === "audio"), e.skip(4);
          const o = 127, c = 128, l = e.filePos;
          for (; e.filePos < n; ) {
            const p = A(e), g = wt(e);
            if ((p & o) === _t.STREAMINFO) {
              e.skip(10);
              const w = _(e), b = w >>> 12, y = (w >> 9 & 7) + 1;
              a.info.sampleRate = b, a.info.numberOfChannels = y, e.skip(20);
            } else
              e.skip(g);
            if (p & c)
              break;
          }
          const u = e.filePos;
          e.filePos = l;
          const d = O(e, u - l), h = new Uint8Array(4 + d.byteLength);
          new DataView(h.buffer).setUint32(0, 1716281667, !1), h.set(d, 4), a.info.codecDescription = h;
        }
        break;
      case "stts":
        {
          const a = this.currentTrack;
          if (!a || !a.sampleTable)
            break;
          e.skip(4);
          const o = _(e);
          let c = 0, l = 0;
          for (let u = 0; u < o; u++) {
            const d = _(e), h = _(e);
            a.sampleTable.sampleTimingEntries.push({
              startIndex: c,
              startDecodeTimestamp: l,
              count: d,
              delta: h
            }), c += d, l += d * h;
          }
        }
        break;
      case "ctts":
        {
          const a = this.currentTrack;
          if (!a || !a.sampleTable)
            break;
          e.skip(4);
          const o = _(e);
          let c = 0;
          for (let l = 0; l < o; l++) {
            const u = _(e), d = nt(e);
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
          const o = _(e), c = _(e);
          if (o === 0)
            for (let l = 0; l < c; l++) {
              const u = _(e);
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
          const o = A(e), c = _(e), l = O(e, Math.ceil(c * o / 8)), u = new Q(l);
          for (let d = 0; d < c; d++) {
            const h = u.readBits(o);
            a.sampleTable.sampleSizes.push(h);
          }
        }
        break;
      case "stss":
        {
          const a = this.currentTrack;
          if (!a || !a.sampleTable)
            break;
          e.skip(4), a.sampleTable.keySampleIndices = [];
          const o = _(e);
          for (let c = 0; c < o; c++) {
            const l = _(e) - 1;
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
          const o = _(e);
          for (let l = 0; l < o; l++) {
            const u = _(e) - 1, d = _(e), h = _(e);
            a.sampleTable.sampleToChunk.push({
              startSampleIndex: -1,
              startChunkIndex: u,
              samplesPerChunk: d,
              sampleDescriptionIndex: h
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
          const o = _(e);
          for (let c = 0; c < o; c++) {
            const l = _(e);
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
          const o = _(e);
          for (let c = 0; c < o; c++) {
            const l = be(e);
            a.sampleTable.chunkOffsets.push(l);
          }
        }
        break;
      case "mvex":
        this.isFragmented = !0, this.readContiguousBoxes(e.slice(s, i.contentSize));
        break;
      case "mehd":
        {
          const a = A(e);
          e.skip(3);
          const o = a === 1 ? be(e) : _(e);
          this.movieDurationInTimescale = o;
        }
        break;
      case "trex":
        {
          e.skip(4);
          const a = _(e), o = _(e), c = _(e), l = _(e), u = _(e);
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
          const a = A(e);
          e.skip(3);
          const o = _(e), c = this.tracks.find((b) => b.id === o);
          if (!c)
            break;
          const l = _(e), u = (l & 48) >> 4, d = (l & 12) >> 2, h = l & 3, f = [A, J, wt, _], p = f[u], g = f[d], k = f[h], w = _(e);
          for (let b = 0; b < w; b++) {
            const y = a === 1 ? be(e) : _(e), T = a === 1 ? be(e) : _(e);
            p(e), g(e), k(e), c.fragmentLookupTable.push({
              timestamp: y,
              moofOffset: T
            });
          }
          c.fragmentLookupTable.sort((b, y) => b.timestamp - y.timestamp);
          for (let b = 0; b < c.fragmentLookupTable.length - 1; b++) {
            const y = c.fragmentLookupTable[b], T = c.fragmentLookupTable[b + 1];
            y.timestamp === T.timestamp && (c.fragmentLookupTable.splice(b + 1, 1), b--);
          }
        }
        break;
      case "moof":
        this.currentFragment = {
          moofOffset: t,
          moofSize: i.totalSize,
          implicitBaseDataOffset: t,
          trackData: /* @__PURE__ */ new Map()
        }, this.readContiguousBoxes(e.slice(s, i.contentSize)), this.lastReadFragment = this.currentFragment, this.currentFragment = null;
        break;
      case "traf":
        if (m(this.currentFragment), this.readContiguousBoxes(e.slice(s, i.contentSize)), this.currentTrack) {
          const a = this.currentFragment.trackData.get(this.currentTrack.id);
          if (a) {
            const { currentFragmentState: o } = this.currentTrack;
            m(o), o.startTimestamp !== null && (Rr(a, o.startTimestamp), a.startTimestampIsFinal = !0);
          }
          this.currentTrack.currentFragmentState = null, this.currentTrack = null;
        }
        break;
      case "tfhd":
        {
          m(this.currentFragment), e.skip(1);
          const a = wt(e), o = !!(a & 1), c = !!(a & 2), l = !!(a & 8), u = !!(a & 16), d = !!(a & 32), h = !!(a & 65536), f = !!(a & 131072), p = _(e), g = this.tracks.find((w) => w.id === p);
          if (!g)
            break;
          const k = this.fragmentTrackDefaults.find((w) => w.trackId === p);
          this.currentTrack = g, g.currentFragmentState = {
            baseDataOffset: this.currentFragment.implicitBaseDataOffset,
            sampleDescriptionIndex: k?.defaultSampleDescriptionIndex ?? null,
            defaultSampleDuration: k?.defaultSampleDuration ?? null,
            defaultSampleSize: k?.defaultSampleSize ?? null,
            defaultSampleFlags: k?.defaultSampleFlags ?? null,
            startTimestamp: null
          }, o ? g.currentFragmentState.baseDataOffset = be(e) : f && (g.currentFragmentState.baseDataOffset = this.currentFragment.moofOffset), c && (g.currentFragmentState.sampleDescriptionIndex = _(e)), l && (g.currentFragmentState.defaultSampleDuration = _(e)), u && (g.currentFragmentState.defaultSampleSize = _(e)), d && (g.currentFragmentState.defaultSampleFlags = _(e)), h && (g.currentFragmentState.defaultSampleDuration = 0);
        }
        break;
      case "tfdt":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          m(a.currentFragmentState);
          const o = A(e);
          e.skip(3);
          const c = o === 0 ? _(e) : be(e);
          a.currentFragmentState.startTimestamp = c;
        }
        break;
      case "trun":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          if (m(this.currentFragment), m(a.currentFragmentState), this.currentFragment.trackData.has(a.id)) {
            console.warn("Can't have two trun boxes for the same track in one fragment. Ignoring...");
            break;
          }
          const o = A(e), c = wt(e), l = !!(c & 1), u = !!(c & 4), d = !!(c & 256), h = !!(c & 512), f = !!(c & 1024), p = !!(c & 2048), g = _(e);
          let k = a.currentFragmentState.baseDataOffset;
          l && (k += nt(e));
          let w = null;
          u && (w = _(e));
          let b = k;
          if (g === 0) {
            this.currentFragment.implicitBaseDataOffset = b;
            break;
          }
          let y = 0;
          const T = {
            track: a,
            startTimestamp: 0,
            endTimestamp: 0,
            firstKeyFrameTimestamp: null,
            samples: [],
            presentationTimestamps: [],
            startTimestampIsFinal: !1
          };
          this.currentFragment.trackData.set(a.id, T);
          for (let E = 0; E < g; E++) {
            let C;
            d ? C = _(e) : (m(a.currentFragmentState.defaultSampleDuration !== null), C = a.currentFragmentState.defaultSampleDuration);
            let R;
            h ? R = _(e) : (m(a.currentFragmentState.defaultSampleSize !== null), R = a.currentFragmentState.defaultSampleSize);
            let M;
            f ? M = _(e) : (m(a.currentFragmentState.defaultSampleFlags !== null), M = a.currentFragmentState.defaultSampleFlags), E === 0 && w !== null && (M = w);
            let F = 0;
            p && (o === 0 ? F = _(e) : F = nt(e));
            const D = !(M & 65536);
            T.samples.push({
              presentationTimestamp: y + F,
              duration: C,
              byteOffset: b,
              byteSize: R,
              isKeyFrame: D
            }), b += R, y += C;
          }
          T.presentationTimestamps = T.samples.map((E, C) => ({ presentationTimestamp: E.presentationTimestamp, sampleIndex: C })).sort((E, C) => E.presentationTimestamp - C.presentationTimestamp);
          for (let E = 0; E < T.presentationTimestamps.length; E++) {
            const C = T.presentationTimestamps[E], R = T.samples[C.sampleIndex];
            if (T.firstKeyFrameTimestamp === null && R.isKeyFrame && (T.firstKeyFrameTimestamp = R.presentationTimestamp), E < T.presentationTimestamps.length - 1) {
              const M = T.presentationTimestamps[E + 1];
              R.duration = M.presentationTimestamp - C.presentationTimestamp;
            }
          }
          const x = T.samples[T.presentationTimestamps[0].sampleIndex], S = T.samples[K(T.presentationTimestamps).sampleIndex];
          T.startTimestamp = x.presentationTimestamp, T.endTimestamp = S.presentationTimestamp + S.duration, this.currentFragment.implicitBaseDataOffset = b;
        }
        break;
      // Metadata section
      // https://exiftool.org/TagNames/QuickTime.html
      // https://mp4workshop.com/about
      case "udta":
        {
          const a = this.iterateContiguousBoxes(e.slice(s, i.contentSize));
          for (const { boxInfo: o, slice: c } of a) {
            if (o.name !== "meta" && !this.currentTrack) {
              const l = c.filePos;
              this.metadataTags.raw ??= {}, o.name[0] === "©" ? this.metadataTags.raw[o.name] ??= Te(c) : this.metadataTags.raw[o.name] ??= O(c, o.contentSize), c.filePos = l;
            }
            switch (o.name) {
              case "meta":
                c.skip(-o.headerSize), this.traverseBox(c);
                break;
              case "©nam":
              case "name":
                this.currentTrack ? this.currentTrack.name = ge.decode(O(c, o.contentSize)) : this.metadataTags.title ??= Te(c);
                break;
              case "©des":
                this.currentTrack || (this.metadataTags.description ??= Te(c));
                break;
              case "©ART":
                this.currentTrack || (this.metadataTags.artist ??= Te(c));
                break;
              case "©alb":
                this.currentTrack || (this.metadataTags.album ??= Te(c));
                break;
              case "albr":
                this.currentTrack || (this.metadataTags.albumArtist ??= Te(c));
                break;
              case "©gen":
                this.currentTrack || (this.metadataTags.genre ??= Te(c));
                break;
              case "©day":
                if (!this.currentTrack) {
                  const l = new Date(Te(c));
                  Number.isNaN(l.getTime()) || (this.metadataTags.date ??= l);
                }
                break;
              case "©cmt":
                this.currentTrack || (this.metadataTags.comment ??= Te(c));
                break;
              case "©lyr":
                this.currentTrack || (this.metadataTags.lyrics ??= Te(c));
                break;
            }
          }
        }
        break;
      case "meta":
        {
          if (this.currentTrack)
            break;
          const o = _(e) !== 0;
          this.currentMetadataKeys = /* @__PURE__ */ new Map(), o ? this.readContiguousBoxes(e.slice(s, i.contentSize)) : this.readContiguousBoxes(e.slice(s + 4, i.contentSize - 4)), this.currentMetadataKeys = null;
        }
        break;
      case "keys":
        {
          if (!this.currentMetadataKeys)
            break;
          e.skip(4);
          const a = _(e);
          for (let o = 0; o < a; o++) {
            const c = _(e);
            e.skip(4);
            const l = ge.decode(O(e, c - 8));
            this.currentMetadataKeys.set(o + 1, l);
          }
        }
        break;
      case "ilst":
        {
          if (!this.currentMetadataKeys)
            break;
          const a = this.iterateContiguousBoxes(e.slice(s, i.contentSize));
          for (const { boxInfo: o, slice: c } of a) {
            let l = o.name;
            const u = (l.charCodeAt(0) << 24) + (l.charCodeAt(1) << 16) + (l.charCodeAt(2) << 8) + l.charCodeAt(3);
            this.currentMetadataKeys.has(u) && (l = this.currentMetadataKeys.get(u));
            const d = Pa(c);
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
                  const h = new Date(d);
                  Number.isNaN(h.getTime()) || (this.metadataTags.date ??= h);
                }
                break;
              case "covr":
              case "com.apple.quicktime.artwork":
                d instanceof It ? (this.metadataTags.images ??= [], this.metadataTags.images.push({
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
                  const h = d.split("/"), f = Number.parseInt(h[0], 10), p = h[1] && Number.parseInt(h[1], 10);
                  Number.isInteger(f) && f > 0 && (this.metadataTags.trackNumber ??= f), p && Number.isInteger(p) && p > 0 && (this.metadataTags.tracksTotal ??= p);
                }
                break;
              case "trkn":
                if (d instanceof Uint8Array && d.length >= 6) {
                  const h = G(d), f = h.getUint16(2, !1), p = h.getUint16(4, !1);
                  f > 0 && (this.metadataTags.trackNumber ??= f), p > 0 && (this.metadataTags.tracksTotal ??= p);
                }
                break;
              case "disc":
              case "disk":
                if (d instanceof Uint8Array && d.length >= 6) {
                  const h = G(d), f = h.getUint16(2, !1), p = h.getUint16(4, !1);
                  f > 0 && (this.metadataTags.discNumber ??= f), p > 0 && (this.metadataTags.discsTotal ??= p);
                }
                break;
            }
          }
        }
        break;
    }
    return e.filePos = n, !0;
  }
}
class Vs {
  constructor(e) {
    this.internalTrack = e, this.packetToSampleIndex = /* @__PURE__ */ new WeakMap(), this.packetToFragmentLocation = /* @__PURE__ */ new WeakMap();
  }
  getId() {
    return this.internalTrack.id;
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
  getDisposition() {
    return this.internalTrack.disposition;
  }
  async computeDuration() {
    const e = await this.getPacket(1 / 0, { metadataOnly: !0 });
    return (e?.timestamp ?? 0) + (e?.duration ?? 0);
  }
  async getFirstTimestamp() {
    return (await this.getFirstPacket({ metadataOnly: !0 }))?.timestamp ?? 0;
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
    return qt(e * this.internalTrack.timescale) + this.internalTrack.editListOffset;
  }
  async getPacket(e, t) {
    const i = this.mapTimestampIntoTimescale(e), s = this.internalTrack.demuxer.getSampleTableForTrack(this.internalTrack), n = Xr(s, i), a = await this.fetchPacketForSampleIndex(n, t);
    return !Yi(s) || !this.internalTrack.demuxer.isFragmented ? a : this.performFragmentedLookup(null, (o) => {
      const c = o.trackData.get(this.internalTrack.id);
      if (!c)
        return { sampleIndex: -1, correctSampleFound: !1 };
      const l = L(c.presentationTimestamps, i, (h) => h.presentationTimestamp), u = l !== -1 ? c.presentationTimestamps[l].sampleIndex : -1, d = l !== -1 && i < c.endTimestamp;
      return { sampleIndex: u, correctSampleFound: d };
    }, i, i, t);
  }
  async getNextPacket(e, t) {
    const i = this.packetToSampleIndex.get(e);
    if (i !== void 0)
      return this.fetchPacketForSampleIndex(i + 1, t);
    const s = this.packetToFragmentLocation.get(e);
    if (s === void 0)
      throw new Error("Packet was not created from this track.");
    return this.performFragmentedLookup(
      s.fragment,
      (n) => {
        if (n === s.fragment) {
          const a = n.trackData.get(this.internalTrack.id);
          if (s.sampleIndex + 1 < a.samples.length)
            return {
              sampleIndex: s.sampleIndex + 1,
              correctSampleFound: !0
            };
        } else if (n.trackData.get(this.internalTrack.id))
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
    const i = this.mapTimestampIntoTimescale(e), s = this.internalTrack.demuxer.getSampleTableForTrack(this.internalTrack), n = Ia(s, i), a = await this.fetchPacketForSampleIndex(n, t);
    return !Yi(s) || !this.internalTrack.demuxer.isFragmented ? a : this.performFragmentedLookup(null, (o) => {
      const c = o.trackData.get(this.internalTrack.id);
      if (!c)
        return { sampleIndex: -1, correctSampleFound: !1 };
      const l = di(c.presentationTimestamps, (h) => c.samples[h.sampleIndex].isKeyFrame && h.presentationTimestamp <= i), u = l !== -1 ? c.presentationTimestamps[l].sampleIndex : -1, d = l !== -1 && i < c.endTimestamp;
      return { sampleIndex: u, correctSampleFound: d };
    }, i, i, t);
  }
  async getNextKeyPacket(e, t) {
    const i = this.packetToSampleIndex.get(e);
    if (i !== void 0) {
      const n = this.internalTrack.demuxer.getSampleTableForTrack(this.internalTrack), a = Ea(n, i);
      return this.fetchPacketForSampleIndex(a, t);
    }
    const s = this.packetToFragmentLocation.get(e);
    if (s === void 0)
      throw new Error("Packet was not created from this track.");
    return this.performFragmentedLookup(
      s.fragment,
      (n) => {
        if (n === s.fragment) {
          const o = n.trackData.get(this.internalTrack.id).samples.findIndex((c, l) => c.isKeyFrame && l > s.sampleIndex);
          if (o !== -1)
            return {
              sampleIndex: o,
              correctSampleFound: !0
            };
        } else {
          const a = n.trackData.get(this.internalTrack.id);
          if (a && a.firstKeyFrameTimestamp !== null) {
            const o = a.samples.findIndex((c) => c.isKeyFrame);
            return m(o !== -1), {
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
    const i = this.internalTrack.demuxer.getSampleTableForTrack(this.internalTrack), s = _a(i, e);
    if (!s)
      return null;
    let n;
    if (t.metadataOnly)
      n = fe;
    else {
      let l = this.internalTrack.demuxer.reader.requestSlice(s.sampleOffset, s.sampleSize);
      l instanceof Promise && (l = await l), m(l), n = O(l, s.sampleSize);
    }
    const a = (s.presentationTimestamp - this.internalTrack.editListOffset) / this.internalTrack.timescale, o = s.duration / this.internalTrack.timescale, c = new q(n, s.isKeyFrame ? "key" : "delta", a, o, e, s.sampleSize);
    return this.packetToSampleIndex.set(c, e), c;
  }
  async fetchPacketInFragment(e, t, i) {
    if (t === -1)
      return null;
    const n = e.trackData.get(this.internalTrack.id).samples[t];
    m(n);
    let a;
    if (i.metadataOnly)
      a = fe;
    else {
      let u = this.internalTrack.demuxer.reader.requestSlice(n.byteOffset, n.byteSize);
      u instanceof Promise && (u = await u), m(u), a = O(u, n.byteSize);
    }
    const o = (n.presentationTimestamp - this.internalTrack.editListOffset) / this.internalTrack.timescale, c = n.duration / this.internalTrack.timescale, l = new q(a, n.isKeyFrame ? "key" : "delta", o, c, e.moofOffset + t, n.byteSize);
    return this.packetToFragmentLocation.set(l, { fragment: e, sampleIndex: t }), l;
  }
  /** Looks for a packet in the fragments while trying to load as few fragments as possible to retrieve it. */
  async performFragmentedLookup(e, t, i, s, n) {
    const a = this.internalTrack.demuxer;
    let o = null, c = null, l = -1;
    if (e) {
      const { sampleIndex: k, correctSampleFound: w } = t(e);
      if (w)
        return this.fetchPacketInFragment(e, k, n);
      k !== -1 && (c = e, l = k);
    }
    const u = L(this.internalTrack.fragmentLookupTable, i, (k) => k.timestamp), d = u !== -1 ? this.internalTrack.fragmentLookupTable[u] : null, h = L(this.internalTrack.fragmentPositionCache, i, (k) => k.startTimestamp), f = h !== -1 ? this.internalTrack.fragmentPositionCache[h] : null, p = Math.max(d?.moofOffset ?? 0, f?.moofOffset ?? 0) || null;
    let g;
    for (e ? p === null || e.moofOffset >= p ? (g = e.moofOffset + e.moofSize, o = e) : g = p : g = p ?? 0; ; ) {
      if (o) {
        const y = o.trackData.get(this.internalTrack.id);
        if (y && y.startTimestamp > s)
          break;
      }
      let k = a.reader.requestSliceRange(g, Me, it);
      if (k instanceof Promise && (k = await k), !k)
        break;
      const w = g, b = He(k);
      if (!b)
        break;
      if (b.name === "moof") {
        o = await a.readFragment(w);
        const { sampleIndex: y, correctSampleFound: T } = t(o);
        if (T)
          return this.fetchPacketInFragment(o, y, n);
        y !== -1 && (c = o, l = y);
      }
      g = w + b.totalSize;
    }
    if (d && (!c || c.moofOffset < d.moofOffset)) {
      const k = this.internalTrack.fragmentLookupTable[u - 1];
      m(!k || k.timestamp < d.timestamp);
      const w = k?.timestamp ?? -1 / 0;
      return this.performFragmentedLookup(null, t, w, s, n);
    }
    return c ? this.fetchPacketInFragment(c, l, n) : null;
  }
}
class Ca extends Vs {
  constructor(e) {
    super(e), this.decoderConfigPromise = null, this.internalTrack = e;
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
    return !1;
  }
  async getDecoderConfig() {
    return this.internalTrack.info.codec ? this.decoderConfigPromise ??= (async () => {
      if (this.internalTrack.info.codec === "vp9" && !this.internalTrack.info.vp9CodecInfo) {
        const e = await this.getFirstPacket({});
        this.internalTrack.info.vp9CodecInfo = e && _s(e.data);
      } else if (this.internalTrack.info.codec === "av1" && !this.internalTrack.info.av1CodecInfo) {
        const e = await this.getFirstPacket({});
        this.internalTrack.info.av1CodecInfo = e && Fs(e.data);
      }
      return {
        codec: fi(this.internalTrack.info),
        codedWidth: this.internalTrack.info.width,
        codedHeight: this.internalTrack.info.height,
        description: this.internalTrack.info.codecDescription ?? void 0,
        colorSpace: this.internalTrack.info.colorSpace ?? void 0
      };
    })() : null;
  }
}
class va extends Vs {
  constructor(e) {
    super(e), this.decoderConfig = null, this.internalTrack = e;
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
    return this.internalTrack.info.codec ? this.decoderConfig ??= {
      codec: mi(this.internalTrack.info),
      numberOfChannels: this.internalTrack.info.numberOfChannels,
      sampleRate: this.internalTrack.info.sampleRate,
      description: this.internalTrack.info.codecDescription ?? void 0
    } : null;
  }
}
const Xr = (r, e) => {
  if (r.presentationTimestamps) {
    const t = L(r.presentationTimestamps, e, (i) => i.presentationTimestamp);
    return t === -1 ? -1 : r.presentationTimestamps[t].sampleIndex;
  } else {
    const t = L(r.sampleTimingEntries, e, (s) => s.startDecodeTimestamp);
    if (t === -1)
      return -1;
    const i = r.sampleTimingEntries[t];
    return i.startIndex + Math.min(Math.floor((e - i.startDecodeTimestamp) / i.delta), i.count - 1);
  }
}, Ia = (r, e) => {
  if (!r.keySampleIndices)
    return Xr(r, e);
  if (r.presentationTimestamps) {
    const t = L(r.presentationTimestamps, e, (i) => i.presentationTimestamp);
    if (t === -1)
      return -1;
    for (let i = t; i >= 0; i--) {
      const s = r.presentationTimestamps[i].sampleIndex;
      if (Jt(r.keySampleIndices, s, (a) => a) !== -1)
        return s;
    }
    return -1;
  } else {
    const t = Xr(r, e), i = L(r.keySampleIndices, t, (s) => s);
    return r.keySampleIndices[i] ?? -1;
  }
}, _a = (r, e) => {
  const t = L(r.sampleTimingEntries, e, (w) => w.startIndex), i = r.sampleTimingEntries[t];
  if (!i || i.startIndex + i.count <= e)
    return null;
  let n = i.startDecodeTimestamp + (e - i.startIndex) * i.delta;
  const a = L(r.sampleCompositionTimeOffsets, e, (w) => w.startIndex), o = r.sampleCompositionTimeOffsets[a];
  o && e - o.startIndex < o.count && (n += o.offset);
  const c = r.sampleSizes[Math.min(e, r.sampleSizes.length - 1)], l = L(r.sampleToChunk, e, (w) => w.startSampleIndex), u = r.sampleToChunk[l];
  m(u);
  const d = u.startChunkIndex + Math.floor((e - u.startSampleIndex) / u.samplesPerChunk), h = r.chunkOffsets[d], f = u.startSampleIndex + (d - u.startChunkIndex) * u.samplesPerChunk;
  let p = 0, g = h;
  if (r.sampleSizes.length === 1)
    g += c * (e - f), p += c * u.samplesPerChunk;
  else
    for (let w = f; w < f + u.samplesPerChunk; w++) {
      const b = r.sampleSizes[w];
      w < e && (g += b), p += b;
    }
  let k = i.delta;
  if (r.presentationTimestamps) {
    const w = r.presentationTimestampIndexMap[e];
    m(w !== void 0), w < r.presentationTimestamps.length - 1 && (k = r.presentationTimestamps[w + 1].presentationTimestamp - n);
  }
  return {
    presentationTimestamp: n,
    duration: k,
    sampleOffset: g,
    sampleSize: c,
    chunkOffset: h,
    chunkSize: p,
    isKeyFrame: r.keySampleIndices ? Jt(r.keySampleIndices, e, (w) => w) !== -1 : !0
  };
}, Ea = (r, e) => {
  if (!r.keySampleIndices)
    return e + 1;
  const t = L(r.keySampleIndices, e, (i) => i);
  return r.keySampleIndices[t + 1] ?? -1;
}, Rr = (r, e) => {
  r.startTimestamp += e, r.endTimestamp += e;
  for (const t of r.samples)
    t.presentationTimestamp += e;
  for (const t of r.presentationTimestamps)
    t.presentationTimestamp += e;
}, Fa = (r) => {
  const [e, , , t] = r, i = Math.hypot(e, t), s = e / i, n = t / i, a = -Math.atan2(n, s) * (180 / Math.PI);
  return Number.isFinite(a) ? a : 0;
}, Yi = (r) => r.sampleSizes.length === 0;
var P;
(function(r) {
  r[r.EBML = 440786851] = "EBML", r[r.EBMLVersion = 17030] = "EBMLVersion", r[r.EBMLReadVersion = 17143] = "EBMLReadVersion", r[r.EBMLMaxIDLength = 17138] = "EBMLMaxIDLength", r[r.EBMLMaxSizeLength = 17139] = "EBMLMaxSizeLength", r[r.DocType = 17026] = "DocType", r[r.DocTypeVersion = 17031] = "DocTypeVersion", r[r.DocTypeReadVersion = 17029] = "DocTypeReadVersion", r[r.Void = 236] = "Void", r[r.Segment = 408125543] = "Segment", r[r.SeekHead = 290298740] = "SeekHead", r[r.Seek = 19899] = "Seek", r[r.SeekID = 21419] = "SeekID", r[r.SeekPosition = 21420] = "SeekPosition", r[r.Duration = 17545] = "Duration", r[r.Info = 357149030] = "Info", r[r.TimestampScale = 2807729] = "TimestampScale", r[r.MuxingApp = 19840] = "MuxingApp", r[r.WritingApp = 22337] = "WritingApp", r[r.Tracks = 374648427] = "Tracks", r[r.TrackEntry = 174] = "TrackEntry", r[r.TrackNumber = 215] = "TrackNumber", r[r.TrackUID = 29637] = "TrackUID", r[r.TrackType = 131] = "TrackType", r[r.FlagEnabled = 185] = "FlagEnabled", r[r.FlagDefault = 136] = "FlagDefault", r[r.FlagForced = 21930] = "FlagForced", r[r.FlagOriginal = 21934] = "FlagOriginal", r[r.FlagHearingImpaired = 21931] = "FlagHearingImpaired", r[r.FlagVisualImpaired = 21932] = "FlagVisualImpaired", r[r.FlagCommentary = 21935] = "FlagCommentary", r[r.FlagLacing = 156] = "FlagLacing", r[r.Name = 21358] = "Name", r[r.Language = 2274716] = "Language", r[r.LanguageBCP47 = 2274717] = "LanguageBCP47", r[r.CodecID = 134] = "CodecID", r[r.CodecPrivate = 25506] = "CodecPrivate", r[r.CodecDelay = 22186] = "CodecDelay", r[r.SeekPreRoll = 22203] = "SeekPreRoll", r[r.DefaultDuration = 2352003] = "DefaultDuration", r[r.Video = 224] = "Video", r[r.PixelWidth = 176] = "PixelWidth", r[r.PixelHeight = 186] = "PixelHeight", r[r.AlphaMode = 21440] = "AlphaMode", r[r.Audio = 225] = "Audio", r[r.SamplingFrequency = 181] = "SamplingFrequency", r[r.Channels = 159] = "Channels", r[r.BitDepth = 25188] = "BitDepth", r[r.SimpleBlock = 163] = "SimpleBlock", r[r.BlockGroup = 160] = "BlockGroup", r[r.Block = 161] = "Block", r[r.BlockAdditions = 30113] = "BlockAdditions", r[r.BlockMore = 166] = "BlockMore", r[r.BlockAdditional = 165] = "BlockAdditional", r[r.BlockAddID = 238] = "BlockAddID", r[r.BlockDuration = 155] = "BlockDuration", r[r.ReferenceBlock = 251] = "ReferenceBlock", r[r.Cluster = 524531317] = "Cluster", r[r.Timestamp = 231] = "Timestamp", r[r.Cues = 475249515] = "Cues", r[r.CuePoint = 187] = "CuePoint", r[r.CueTime = 179] = "CueTime", r[r.CueTrackPositions = 183] = "CueTrackPositions", r[r.CueTrack = 247] = "CueTrack", r[r.CueClusterPosition = 241] = "CueClusterPosition", r[r.Colour = 21936] = "Colour", r[r.MatrixCoefficients = 21937] = "MatrixCoefficients", r[r.TransferCharacteristics = 21946] = "TransferCharacteristics", r[r.Primaries = 21947] = "Primaries", r[r.Range = 21945] = "Range", r[r.Projection = 30320] = "Projection", r[r.ProjectionType = 30321] = "ProjectionType", r[r.ProjectionPoseRoll = 30325] = "ProjectionPoseRoll", r[r.Attachments = 423732329] = "Attachments", r[r.AttachedFile = 24999] = "AttachedFile", r[r.FileDescription = 18046] = "FileDescription", r[r.FileName = 18030] = "FileName", r[r.FileMediaType = 18016] = "FileMediaType", r[r.FileData = 18012] = "FileData", r[r.FileUID = 18094] = "FileUID", r[r.Chapters = 272869232] = "Chapters", r[r.Tags = 307544935] = "Tags", r[r.Tag = 29555] = "Tag", r[r.Targets = 25536] = "Targets", r[r.TargetTypeValue = 26826] = "TargetTypeValue", r[r.TargetType = 25546] = "TargetType", r[r.TagTrackUID = 25541] = "TagTrackUID", r[r.TagEditionUID = 25545] = "TagEditionUID", r[r.TagChapterUID = 25540] = "TagChapterUID", r[r.TagAttachmentUID = 25542] = "TagAttachmentUID", r[r.SimpleTag = 26568] = "SimpleTag", r[r.TagName = 17827] = "TagName", r[r.TagLanguage = 17530] = "TagLanguage", r[r.TagString = 17543] = "TagString", r[r.TagBinary = 17541] = "TagBinary", r[r.ContentEncodings = 28032] = "ContentEncodings", r[r.ContentEncoding = 25152] = "ContentEncoding", r[r.ContentEncodingOrder = 20529] = "ContentEncodingOrder", r[r.ContentEncodingScope = 20530] = "ContentEncodingScope", r[r.ContentCompression = 20532] = "ContentCompression", r[r.ContentCompAlgo = 16980] = "ContentCompAlgo", r[r.ContentCompSettings = 16981] = "ContentCompSettings", r[r.ContentEncryption = 20533] = "ContentEncryption";
})(P || (P = {}));
const Aa = [
  P.EBML,
  P.Segment
], Gt = [
  P.SeekHead,
  P.Info,
  P.Cluster,
  P.Tracks,
  P.Cues,
  P.Attachments,
  P.Chapters,
  P.Tags
], nr = [
  ...Aa,
  ...Gt
], Yr = 8, me = 2, Oe = 2 * Yr, Us = (r) => {
  if (r.remainingLength < 1)
    return null;
  const e = A(r);
  if (r.skip(-1), e === 0)
    return null;
  let t = 1, i = 128;
  for (; (e & i) === 0; )
    t++, i >>= 1;
  return r.remainingLength < t ? null : t;
}, Nt = (r) => {
  if (r.remainingLength < 1)
    return null;
  const e = A(r);
  if (e === 0)
    return null;
  let t = 1, i = 128;
  for (; (e & i) === 0; )
    t++, i >>= 1;
  if (r.remainingLength < t - 1)
    return null;
  let s = e & i - 1;
  for (let n = 1; n < t; n++)
    s *= 256, s += A(r);
  return s;
}, N = (r, e) => {
  if (e < 1 || e > 8)
    throw new Error("Bad unsigned int size " + e);
  let t = 0;
  for (let i = 0; i < e; i++)
    t *= 256, t += A(r);
  return t;
}, Ba = (r, e) => {
  if (e < 1)
    throw new Error("Bad unsigned int size " + e);
  let t = 0n;
  for (let i = 0; i < e; i++)
    t <<= 8n, t += BigInt(A(r));
  return t;
}, xi = (r) => {
  const e = Us(r);
  return e === null || r.remainingLength < e ? null : N(r, e);
}, Ls = (r) => {
  if (r.remainingLength < 1)
    return null;
  if (A(r) === 255)
    return;
  r.skip(-1);
  const t = Nt(r);
  if (t === null)
    return null;
  if (t !== 72057594037927940)
    return t;
}, ze = (r) => {
  m(r.remainingLength >= me);
  const e = xi(r);
  if (e === null)
    return null;
  const t = Ls(r);
  return t === null ? null : { id: e, size: t };
}, gt = (r, e) => {
  const t = O(r, e);
  let i = 0;
  for (; i < e && t[i] !== 0; )
    i += 1;
  return String.fromCharCode(...t.subarray(0, i));
}, zt = (r, e) => {
  const t = O(r, e);
  let i = 0;
  for (; i < e && t[i] !== 0; )
    i += 1;
  return ge.decode(t.subarray(0, i));
}, zr = (r, e) => {
  if (e === 0)
    return 0;
  if (e !== 4 && e !== 8)
    throw new Error("Bad float size " + e);
  return e === 4 ? Ho(r) : Zs(r);
}, Zr = async (r, e, t, i) => {
  const s = new Set(t);
  let n = e;
  for (; i === null || n < i; ) {
    let a = r.requestSliceRange(n, me, Oe);
    if (a instanceof Promise && (a = await a), !a)
      break;
    const o = ze(a);
    if (!o)
      break;
    if (s.has(o.id))
      return { pos: n, found: !0 };
    We(o.size), n = a.filePos + o.size;
  }
  return { pos: i !== null && i > n ? i : n, found: !1 };
}, Ws = async (r, e, t, i) => {
  const n = new Set(t);
  let a = e;
  for (; a < i; ) {
    let o = r.requestSliceRange(a, 0, Math.min(65536, i - a));
    if (o instanceof Promise && (o = await o), !o || o.length < Yr)
      break;
    for (let c = 0; c < o.length - Yr; c++) {
      o.filePos = a;
      const l = xi(o);
      if (l !== null && n.has(l))
        return a;
      a++;
    }
  }
  return null;
}, Se = {
  avc: "V_MPEG4/ISO/AVC",
  hevc: "V_MPEGH/ISO/HEVC",
  vp8: "V_VP8",
  vp9: "V_VP9",
  av1: "V_AV1",
  aac: "A_AAC",
  mp3: "A_MPEG/L3",
  opus: "A_OPUS",
  vorbis: "A_VORBIS",
  flac: "A_FLAC"
};
function We(r) {
  if (r === void 0)
    throw new Error("Undefined element size is used in a place where it is not supported.");
}
const Ra = (r) => {
  let t = (r.hasVideo ? "video/" : r.hasAudio ? "audio/" : "application/") + (r.isWebM ? "webm" : "x-matroska");
  if (r.codecStrings.length > 0) {
    const i = [...new Set(r.codecStrings.filter(Boolean))];
    t += `; codecs="${i.join(", ")}"`;
  }
  return t;
};
var Ae;
(function(r) {
  r[r.None = 0] = "None", r[r.Xiph = 1] = "Xiph", r[r.FixedSize = 2] = "FixedSize", r[r.Ebml = 3] = "Ebml";
})(Ae || (Ae = {}));
var hr;
(function(r) {
  r[r.Block = 1] = "Block", r[r.Private = 2] = "Private", r[r.Next = 4] = "Next";
})(hr || (hr = {}));
var Lt;
(function(r) {
  r[r.Zlib = 0] = "Zlib", r[r.Bzlib = 1] = "Bzlib", r[r.lzo1x = 2] = "lzo1x", r[r.HeaderStripping = 3] = "HeaderStripping";
})(Lt || (Lt = {}));
const Dr = [
  { id: P.SeekHead, flag: "seekHeadSeen" },
  { id: P.Info, flag: "infoSeen" },
  { id: P.Tracks, flag: "tracksSeen" },
  { id: P.Cues, flag: "cuesSeen" }
], Hs = 10 * 2 ** 20;
class za extends Ze {
  constructor(e) {
    super(e), this.readMetadataPromise = null, this.segments = [], this.currentSegment = null, this.currentTrack = null, this.currentCluster = null, this.currentBlock = null, this.currentBlockAdditional = null, this.currentCueTime = null, this.currentDecodingInstruction = null, this.currentTagTargetIsMovie = !0, this.currentSimpleTagName = null, this.currentAttachedFile = null, this.isWebM = !1, this.reader = e._reader;
  }
  async computeDuration() {
    const e = await this.getTracks(), t = await Promise.all(e.map((i) => i.computeDuration()));
    return Math.max(0, ...t);
  }
  async getTracks() {
    return await this.readMetadata(), this.segments.flatMap((e) => e.tracks.map((t) => t.inputTrack));
  }
  async getMimeType() {
    await this.readMetadata();
    const e = await this.getTracks(), t = await Promise.all(e.map((i) => i.getCodecParameterString()));
    return Ra({
      isWebM: this.isWebM,
      hasVideo: this.segments.some((i) => i.tracks.some((s) => s.info?.type === "video")),
      hasAudio: this.segments.some((i) => i.tracks.some((s) => s.info?.type === "audio")),
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
        let t = this.reader.requestSliceRange(e, me, Oe);
        if (t instanceof Promise && (t = await t), !t)
          break;
        const i = ze(t);
        if (!i)
          break;
        const s = i.id;
        let n = i.size;
        const a = t.filePos;
        if (s === P.EBML) {
          We(n);
          let o = this.reader.requestSlice(a, n);
          if (o instanceof Promise && (o = await o), !o)
            break;
          this.readContiguousElements(o);
        } else if (s === P.Segment) {
          if (await this.readSegment(a, n), n === void 0 || this.reader.fileSize === null)
            break;
        } else if (s === P.Cluster) {
          if (this.reader.fileSize === null)
            break;
          n === void 0 && (n = (await Zr(this.reader, a, nr, this.reader.fileSize)).pos - a);
          const o = K(this.segments);
          o && (o.elementEndPos = a + n);
        }
        We(n), e = a + n;
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
      let o = this.reader.requestSliceRange(i, me, Oe);
      if (o instanceof Promise && (o = await o), !o)
        break;
      const c = i, l = ze(o);
      if (!l || !Gt.includes(l.id) && l.id !== P.Void) {
        const p = await Ws(this.reader, c, Gt, Math.min(this.currentSegment.elementEndPos ?? 1 / 0, c + Hs));
        if (p) {
          i = p;
          continue;
        } else
          break;
      }
      const { id: u, size: d } = l, h = o.filePos, f = Dr.findIndex((p) => p.id === u);
      if (f !== -1) {
        const p = Dr[f].flag;
        this.currentSegment[p] = !0, We(d);
        let g = this.reader.requestSlice(h, d);
        g instanceof Promise && (g = await g), g && this.readContiguousElements(g);
      } else if (u === P.Tags || u === P.Attachments) {
        u === P.Tags ? this.currentSegment.tagsSeen = !0 : this.currentSegment.attachmentsSeen = !0, We(d);
        let p = this.reader.requestSlice(h, d);
        p instanceof Promise && (p = await p), p && this.readContiguousElements(p);
      } else if (u === P.Cluster) {
        this.currentSegment.clusterSeekStartPos = c;
        break;
      }
      if (d === void 0)
        break;
      i = h + d;
    }
    if (this.currentSegment.seekEntries.sort((o, c) => o.segmentPosition - c.segmentPosition), this.reader.fileSize !== null)
      for (const o of this.currentSegment.seekEntries) {
        const c = Dr.find((p) => p.id === o.id);
        if (!c || this.currentSegment[c.flag])
          continue;
        let l = this.reader.requestSliceRange(e + o.segmentPosition, me, Oe);
        if (l instanceof Promise && (l = await l), !l)
          continue;
        const u = ze(l);
        if (!u)
          continue;
        const { id: d, size: h } = u;
        if (d !== c.id)
          continue;
        We(h), this.currentSegment[c.flag] = !0;
        let f = this.reader.requestSlice(l.filePos, h);
        f instanceof Promise && (f = await f), f && this.readContiguousElements(f);
      }
    this.currentSegment.timestampScale === -1 && (this.currentSegment.timestampScale = 1e6, this.currentSegment.timestampFactor = 1e9 / 1e6);
    for (const o of this.currentSegment.tracks)
      o.defaultDurationNs !== null && (o.defaultDuration = this.currentSegment.timestampFactor * o.defaultDurationNs / 1e9);
    this.currentSegment.tracks.sort((o, c) => Number(c.disposition.default) - Number(o.disposition.default));
    const s = new Map(this.currentSegment.tracks.map((o) => [o.id, o]));
    for (const o of this.currentSegment.cuePoints) {
      const c = s.get(o.trackId);
      c && c.cuePoints.push(o);
    }
    for (const o of this.currentSegment.tracks) {
      o.cuePoints.sort((c, l) => c.time - l.time);
      for (let c = 0; c < o.cuePoints.length - 1; c++) {
        const l = o.cuePoints[c], u = o.cuePoints[c + 1];
        l.time === u.time && (o.cuePoints.splice(c + 1, 1), c--);
      }
    }
    let n = null, a = -1 / 0;
    for (const o of this.currentSegment.tracks)
      o.cuePoints.length > a && (a = o.cuePoints.length, n = o);
    for (const o of this.currentSegment.tracks)
      o.cuePoints.length === 0 && (o.cuePoints = n.cuePoints);
    this.currentSegment = null;
  }
  async readCluster(e, t) {
    if (t.lastReadCluster?.elementStartPos === e)
      return t.lastReadCluster;
    let i = this.reader.requestSliceRange(e, me, Oe);
    i instanceof Promise && (i = await i), m(i);
    const s = e, n = ze(i);
    m(n);
    const a = n.id;
    m(a === P.Cluster);
    let o = n.size;
    const c = i.filePos;
    o === void 0 && (o = (await Zr(this.reader, c, nr, t.elementEndPos)).pos - c);
    let l = this.reader.requestSlice(c, o);
    l instanceof Promise && (l = await l);
    const u = {
      segment: t,
      elementStartPos: s,
      elementEndPos: c + o,
      dataStartPos: c,
      timestamp: -1,
      trackData: /* @__PURE__ */ new Map()
    };
    if (this.currentCluster = u, l) {
      const d = this.readContiguousElements(l, nr);
      u.elementEndPos = d;
    }
    for (const [, d] of u.trackData) {
      const h = d.track;
      m(d.blocks.length > 0);
      let f = !1;
      for (let w = 0; w < d.blocks.length; w++) {
        const b = d.blocks[w];
        b.timestamp += u.timestamp, f ||= b.lacing !== Ae.None;
      }
      d.presentationTimestamps = d.blocks.map((w, b) => ({ timestamp: w.timestamp, blockIndex: b })).sort((w, b) => w.timestamp - b.timestamp);
      for (let w = 0; w < d.presentationTimestamps.length; w++) {
        const b = d.presentationTimestamps[w], y = d.blocks[b.blockIndex];
        if (d.firstKeyFrameTimestamp === null && y.isKeyFrame && (d.firstKeyFrameTimestamp = y.timestamp), w < d.presentationTimestamps.length - 1) {
          const T = d.presentationTimestamps[w + 1];
          y.duration = T.timestamp - y.timestamp;
        } else y.duration === 0 && h.defaultDuration != null && y.lacing === Ae.None && (y.duration = h.defaultDuration);
      }
      f && (this.expandLacedBlocks(d.blocks, h), d.presentationTimestamps = d.blocks.map((w, b) => ({ timestamp: w.timestamp, blockIndex: b })).sort((w, b) => w.timestamp - b.timestamp));
      const p = d.blocks[d.presentationTimestamps[0].blockIndex], g = d.blocks[K(d.presentationTimestamps).blockIndex];
      d.startTimestamp = p.timestamp, d.endTimestamp = g.timestamp + g.duration;
      const k = L(h.clusterPositionCache, d.startTimestamp, (w) => w.startTimestamp);
      (k === -1 || h.clusterPositionCache[k].elementStartPos !== s) && h.clusterPositionCache.splice(k + 1, 0, {
        elementStartPos: u.elementStartPos,
        startTimestamp: d.startTimestamp
      });
    }
    return t.lastReadCluster = u, u;
  }
  getTrackDataInCluster(e, t) {
    let i = e.trackData.get(t);
    if (!i) {
      const s = e.segment.tracks.find((n) => n.id === t);
      if (!s)
        return null;
      i = {
        track: s,
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
      const s = e[i];
      if (s.lacing === Ae.None)
        continue;
      s.decoded || (s.data = this.decodeBlockData(t, s.data), s.decoded = !0);
      const n = we.tempFromBytes(s.data), a = [], o = A(n) + 1;
      switch (s.lacing) {
        case Ae.Xiph:
          {
            let l = 0;
            for (let u = 0; u < o - 1; u++) {
              let d = 0;
              for (; n.bufferPos < n.length; ) {
                const h = A(n);
                if (d += h, h < 255) {
                  a.push(d), l += d;
                  break;
                }
              }
            }
            a.push(n.length - (n.bufferPos + l));
          }
          break;
        case Ae.FixedSize:
          {
            const l = n.length - 1, u = Math.floor(l / o);
            for (let d = 0; d < o; d++)
              a.push(u);
          }
          break;
        case Ae.Ebml:
          {
            const l = Nt(n);
            m(l !== null);
            let u = l;
            a.push(u);
            let d = u;
            for (let h = 1; h < o - 1; h++) {
              const f = n.bufferPos, p = Nt(n);
              m(p !== null);
              const g = p, w = (1 << (n.bufferPos - f) * 7 - 1) - 1, b = g - w;
              u += b, a.push(u), d += u;
            }
            a.push(n.length - (n.bufferPos + d));
          }
          break;
        default:
          m(!1);
      }
      m(a.length === o), e.splice(i, 1);
      const c = s.duration || o * (t.defaultDuration ?? 0);
      for (let l = 0; l < o; l++) {
        const u = a[l], d = O(n, u), h = s.timestamp + c * l / o, f = c / o;
        e.splice(i + l, 0, {
          timestamp: h,
          duration: f,
          isKeyFrame: s.isKeyFrame,
          data: d,
          lacing: Ae.None,
          decoded: !0,
          mainAdditional: s.mainAdditional
        });
      }
      i += o, i--;
    }
  }
  async loadSegmentMetadata(e) {
    for (const t of e.seekEntries) {
      if (!(t.id === P.Tags && !e.tagsSeen)) {
        if (!(t.id === P.Attachments && !e.attachmentsSeen)) continue;
      }
      let i = this.reader.requestSliceRange(e.dataStartPos + t.segmentPosition, me, Oe);
      if (i instanceof Promise && (i = await i), !i)
        continue;
      const s = ze(i);
      if (!s || s.id !== t.id)
        continue;
      const { size: n } = s;
      We(n), m(!this.currentSegment), this.currentSegment = e;
      let a = this.reader.requestSlice(i.filePos, n);
      a instanceof Promise && (a = await a), a && this.readContiguousElements(a), this.currentSegment = null, t.id === P.Tags ? e.tagsSeen = !0 : t.id === P.Attachments && (e.attachmentsSeen = !0);
    }
  }
  readContiguousElements(e, t) {
    for (; e.remainingLength >= me; ) {
      const i = e.filePos;
      if (!this.traverseElement(e, t))
        return i;
    }
    return e.filePos;
  }
  traverseElement(e, t) {
    const i = ze(e);
    if (!i || t && t.includes(i.id))
      return !1;
    const { id: s, size: n } = i, a = e.filePos;
    switch (We(n), s) {
      case P.DocType:
        this.isWebM = gt(e, n) === "webm";
        break;
      case P.Seek:
        {
          if (!this.currentSegment)
            break;
          const o = { id: -1, segmentPosition: -1 };
          this.currentSegment.seekEntries.push(o), this.readContiguousElements(e.slice(a, n)), (o.id === -1 || o.segmentPosition === -1) && this.currentSegment.seekEntries.pop();
        }
        break;
      case P.SeekID:
        {
          const o = this.currentSegment?.seekEntries[this.currentSegment.seekEntries.length - 1];
          if (!o)
            break;
          o.id = N(e, n);
        }
        break;
      case P.SeekPosition:
        {
          const o = this.currentSegment?.seekEntries[this.currentSegment.seekEntries.length - 1];
          if (!o)
            break;
          o.segmentPosition = N(e, n);
        }
        break;
      case P.TimestampScale:
        {
          if (!this.currentSegment)
            break;
          this.currentSegment.timestampScale = N(e, n), this.currentSegment.timestampFactor = 1e9 / this.currentSegment.timestampScale;
        }
        break;
      case P.Duration:
        {
          if (!this.currentSegment)
            break;
          this.currentSegment.duration = zr(e, n);
        }
        break;
      case P.TrackEntry:
        {
          if (!this.currentSegment || (this.currentTrack = {
            id: -1,
            segment: this.currentSegment,
            demuxer: this,
            clusterPositionCache: [],
            cuePoints: [],
            disposition: {
              ...Xe
            },
            inputTrack: null,
            codecId: null,
            codecPrivate: null,
            defaultDuration: null,
            defaultDurationNs: null,
            name: null,
            languageCode: de,
            decodingInstructions: [],
            info: null
          }, this.readContiguousElements(e.slice(a, n)), !this.currentTrack))
            break;
          if (this.currentTrack.decodingInstructions.some((o) => o.data?.type !== "decompress" || o.scope !== hr.Block || o.data.algorithm !== Lt.HeaderStripping) && (console.warn(`Track #${this.currentTrack.id} has an unsupported content encoding; dropping.`), this.currentTrack = null), this.currentTrack && this.currentTrack.id !== -1 && this.currentTrack.codecId && this.currentTrack.info) {
            const o = this.currentTrack.codecId.indexOf("/"), c = o === -1 ? this.currentTrack.codecId : this.currentTrack.codecId.slice(0, o);
            if (this.currentTrack.info.type === "video" && this.currentTrack.info.width !== -1 && this.currentTrack.info.height !== -1) {
              this.currentTrack.codecId === Se.avc ? (this.currentTrack.info.codec = "avc", this.currentTrack.info.codecDescription = this.currentTrack.codecPrivate) : this.currentTrack.codecId === Se.hevc ? (this.currentTrack.info.codec = "hevc", this.currentTrack.info.codecDescription = this.currentTrack.codecPrivate) : c === Se.vp8 ? this.currentTrack.info.codec = "vp8" : c === Se.vp9 ? this.currentTrack.info.codec = "vp9" : c === Se.av1 && (this.currentTrack.info.codec = "av1");
              const l = this.currentTrack, u = new Bt(this.input, new Da(l));
              this.currentTrack.inputTrack = u, this.currentSegment.tracks.push(this.currentTrack);
            } else if (this.currentTrack.info.type === "audio" && this.currentTrack.info.numberOfChannels !== -1 && this.currentTrack.info.sampleRate !== -1) {
              c === Se.aac ? (this.currentTrack.info.codec = "aac", this.currentTrack.info.aacCodecInfo = {
                isMpeg2: this.currentTrack.codecId.includes("MPEG2"),
                objectType: null
              }, this.currentTrack.info.codecDescription = this.currentTrack.codecPrivate) : this.currentTrack.codecId === Se.mp3 ? this.currentTrack.info.codec = "mp3" : c === Se.opus ? (this.currentTrack.info.codec = "opus", this.currentTrack.info.codecDescription = this.currentTrack.codecPrivate, this.currentTrack.info.sampleRate = yr) : c === Se.vorbis ? (this.currentTrack.info.codec = "vorbis", this.currentTrack.info.codecDescription = this.currentTrack.codecPrivate) : c === Se.flac ? (this.currentTrack.info.codec = "flac", this.currentTrack.info.codecDescription = this.currentTrack.codecPrivate) : this.currentTrack.codecId === "A_PCM/INT/LIT" ? this.currentTrack.info.bitDepth === 8 ? this.currentTrack.info.codec = "pcm-u8" : this.currentTrack.info.bitDepth === 16 ? this.currentTrack.info.codec = "pcm-s16" : this.currentTrack.info.bitDepth === 24 ? this.currentTrack.info.codec = "pcm-s24" : this.currentTrack.info.bitDepth === 32 && (this.currentTrack.info.codec = "pcm-s32") : this.currentTrack.codecId === "A_PCM/INT/BIG" ? this.currentTrack.info.bitDepth === 8 ? this.currentTrack.info.codec = "pcm-u8" : this.currentTrack.info.bitDepth === 16 ? this.currentTrack.info.codec = "pcm-s16be" : this.currentTrack.info.bitDepth === 24 ? this.currentTrack.info.codec = "pcm-s24be" : this.currentTrack.info.bitDepth === 32 && (this.currentTrack.info.codec = "pcm-s32be") : this.currentTrack.codecId === "A_PCM/FLOAT/IEEE" && (this.currentTrack.info.bitDepth === 32 ? this.currentTrack.info.codec = "pcm-f32" : this.currentTrack.info.bitDepth === 64 && (this.currentTrack.info.codec = "pcm-f64"));
              const l = this.currentTrack, u = new Fe(this.input, new Ma(l));
              this.currentTrack.inputTrack = u, this.currentSegment.tracks.push(this.currentTrack);
            }
          }
          this.currentTrack = null;
        }
        break;
      case P.TrackNumber:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.id = N(e, n);
        }
        break;
      case P.TrackType:
        {
          if (!this.currentTrack)
            break;
          const o = N(e, n);
          o === 1 ? this.currentTrack.info = {
            type: "video",
            width: -1,
            height: -1,
            rotation: 0,
            codec: null,
            codecDescription: null,
            colorSpace: null,
            alphaMode: !1
          } : o === 2 && (this.currentTrack.info = {
            type: "audio",
            numberOfChannels: -1,
            sampleRate: -1,
            bitDepth: -1,
            codec: null,
            codecDescription: null,
            aacCodecInfo: null
          });
        }
        break;
      case P.FlagEnabled:
        {
          if (!this.currentTrack)
            break;
          N(e, n) || (this.currentTrack = null);
        }
        break;
      case P.FlagDefault:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.disposition.default = !!N(e, n);
        }
        break;
      case P.FlagForced:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.disposition.forced = !!N(e, n);
        }
        break;
      case P.FlagOriginal:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.disposition.original = !!N(e, n);
        }
        break;
      case P.FlagHearingImpaired:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.disposition.hearingImpaired = !!N(e, n);
        }
        break;
      case P.FlagVisualImpaired:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.disposition.visuallyImpaired = !!N(e, n);
        }
        break;
      case P.FlagCommentary:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.disposition.commentary = !!N(e, n);
        }
        break;
      case P.CodecID:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.codecId = gt(e, n);
        }
        break;
      case P.CodecPrivate:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.codecPrivate = O(e, n);
        }
        break;
      case P.DefaultDuration:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.defaultDurationNs = N(e, n);
        }
        break;
      case P.Name:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.name = zt(e, n);
        }
        break;
      case P.Language:
        {
          if (!this.currentTrack || this.currentTrack.languageCode !== de)
            break;
          this.currentTrack.languageCode = gt(e, n), jt(this.currentTrack.languageCode) || (this.currentTrack.languageCode = de);
        }
        break;
      case P.LanguageBCP47:
        {
          if (!this.currentTrack)
            break;
          const c = gt(e, n).split("-")[0];
          c ? this.currentTrack.languageCode = c : this.currentTrack.languageCode = de;
        }
        break;
      case P.Video:
        {
          if (this.currentTrack?.info?.type !== "video")
            break;
          this.readContiguousElements(e.slice(a, n));
        }
        break;
      case P.PixelWidth:
        {
          if (this.currentTrack?.info?.type !== "video")
            break;
          this.currentTrack.info.width = N(e, n);
        }
        break;
      case P.PixelHeight:
        {
          if (this.currentTrack?.info?.type !== "video")
            break;
          this.currentTrack.info.height = N(e, n);
        }
        break;
      case P.AlphaMode:
        {
          if (this.currentTrack?.info?.type !== "video")
            break;
          this.currentTrack.info.alphaMode = N(e, n) === 1;
        }
        break;
      case P.Colour:
        {
          if (this.currentTrack?.info?.type !== "video")
            break;
          this.currentTrack.info.colorSpace = {}, this.readContiguousElements(e.slice(a, n));
        }
        break;
      case P.MatrixCoefficients:
        {
          if (this.currentTrack?.info?.type !== "video" || !this.currentTrack.info.colorSpace)
            break;
          const o = N(e, n), c = lr[o] ?? null;
          this.currentTrack.info.colorSpace.matrix = c;
        }
        break;
      case P.Range:
        {
          if (this.currentTrack?.info?.type !== "video" || !this.currentTrack.info.colorSpace)
            break;
          this.currentTrack.info.colorSpace.fullRange = N(e, n) === 2;
        }
        break;
      case P.TransferCharacteristics:
        {
          if (this.currentTrack?.info?.type !== "video" || !this.currentTrack.info.colorSpace)
            break;
          const o = N(e, n), c = cr[o] ?? null;
          this.currentTrack.info.colorSpace.transfer = c;
        }
        break;
      case P.Primaries:
        {
          if (this.currentTrack?.info?.type !== "video" || !this.currentTrack.info.colorSpace)
            break;
          const o = N(e, n), c = or[o] ?? null;
          this.currentTrack.info.colorSpace.primaries = c;
        }
        break;
      case P.Projection:
        {
          if (this.currentTrack?.info?.type !== "video")
            break;
          this.readContiguousElements(e.slice(a, n));
        }
        break;
      case P.ProjectionPoseRoll:
        {
          if (this.currentTrack?.info?.type !== "video")
            break;
          const c = -zr(e, n);
          try {
            this.currentTrack.info.rotation = li(c);
          } catch {
          }
        }
        break;
      case P.Audio:
        {
          if (this.currentTrack?.info?.type !== "audio")
            break;
          this.readContiguousElements(e.slice(a, n));
        }
        break;
      case P.SamplingFrequency:
        {
          if (this.currentTrack?.info?.type !== "audio")
            break;
          this.currentTrack.info.sampleRate = zr(e, n);
        }
        break;
      case P.Channels:
        {
          if (this.currentTrack?.info?.type !== "audio")
            break;
          this.currentTrack.info.numberOfChannels = N(e, n);
        }
        break;
      case P.BitDepth:
        {
          if (this.currentTrack?.info?.type !== "audio")
            break;
          this.currentTrack.info.bitDepth = N(e, n);
        }
        break;
      case P.CuePoint:
        {
          if (!this.currentSegment)
            break;
          this.readContiguousElements(e.slice(a, n)), this.currentCueTime = null;
        }
        break;
      case P.CueTime:
        this.currentCueTime = N(e, n);
        break;
      case P.CueTrackPositions:
        {
          if (this.currentCueTime === null)
            break;
          m(this.currentSegment);
          const o = { time: this.currentCueTime, trackId: -1, clusterPosition: -1 };
          this.currentSegment.cuePoints.push(o), this.readContiguousElements(e.slice(a, n)), (o.trackId === -1 || o.clusterPosition === -1) && this.currentSegment.cuePoints.pop();
        }
        break;
      case P.CueTrack:
        {
          const o = this.currentSegment?.cuePoints[this.currentSegment.cuePoints.length - 1];
          if (!o)
            break;
          o.trackId = N(e, n);
        }
        break;
      case P.CueClusterPosition:
        {
          const o = this.currentSegment?.cuePoints[this.currentSegment.cuePoints.length - 1];
          if (!o)
            break;
          m(this.currentSegment), o.clusterPosition = this.currentSegment.dataStartPos + N(e, n);
        }
        break;
      case P.Timestamp:
        {
          if (!this.currentCluster)
            break;
          this.currentCluster.timestamp = N(e, n);
        }
        break;
      case P.SimpleBlock:
        {
          if (!this.currentCluster)
            break;
          const o = Nt(e);
          if (o === null)
            break;
          const c = this.getTrackDataInCluster(this.currentCluster, o);
          if (!c)
            break;
          const l = ri(e), u = A(e), d = u >> 1 & 3;
          let h = !!(u & 128);
          c.track.info?.type === "audio" && c.track.info.codec && (h = !0);
          const f = O(e, n - (e.filePos - a)), p = c.track.decodingInstructions.length > 0;
          c.blocks.push({
            timestamp: l,
            // We'll add the cluster's timestamp to this later
            duration: 0,
            // Will set later
            isKeyFrame: h,
            data: f,
            lacing: d,
            decoded: !p,
            mainAdditional: null
          });
        }
        break;
      case P.BlockGroup:
        {
          if (!this.currentCluster)
            break;
          this.readContiguousElements(e.slice(a, n)), this.currentBlock = null;
        }
        break;
      case P.Block:
        {
          if (!this.currentCluster)
            break;
          const o = Nt(e);
          if (o === null)
            break;
          const c = this.getTrackDataInCluster(this.currentCluster, o);
          if (!c)
            break;
          const l = ri(e), d = A(e) >> 1 & 3, h = O(e, n - (e.filePos - a)), f = c.track.decodingInstructions.length > 0;
          this.currentBlock = {
            timestamp: l,
            // We'll add the cluster's timestamp to this later
            duration: 0,
            // Will set later
            isKeyFrame: !0,
            data: h,
            lacing: d,
            decoded: !f,
            mainAdditional: null
          }, c.blocks.push(this.currentBlock);
        }
        break;
      case P.BlockAdditions:
        this.readContiguousElements(e.slice(a, n));
        break;
      case P.BlockMore:
        {
          if (!this.currentBlock)
            break;
          this.currentBlockAdditional = {
            addId: 1,
            data: null
          }, this.readContiguousElements(e.slice(a, n)), this.currentBlockAdditional.data && this.currentBlockAdditional.addId === 1 && (this.currentBlock.mainAdditional = this.currentBlockAdditional.data), this.currentBlockAdditional = null;
        }
        break;
      case P.BlockAdditional:
        {
          if (!this.currentBlockAdditional)
            break;
          this.currentBlockAdditional.data = O(e, n);
        }
        break;
      case P.BlockAddID:
        {
          if (!this.currentBlockAdditional)
            break;
          this.currentBlockAdditional.addId = N(e, n);
        }
        break;
      case P.BlockDuration:
        {
          if (!this.currentBlock)
            break;
          this.currentBlock.duration = N(e, n);
        }
        break;
      case P.ReferenceBlock:
        {
          if (!this.currentBlock)
            break;
          this.currentBlock.isKeyFrame = !1;
        }
        break;
      case P.Tag:
        this.currentTagTargetIsMovie = !0, this.readContiguousElements(e.slice(a, n));
        break;
      case P.Targets:
        this.readContiguousElements(e.slice(a, n));
        break;
      case P.TargetTypeValue:
        N(e, n) !== 50 && (this.currentTagTargetIsMovie = !1);
        break;
      case P.TagTrackUID:
      case P.TagEditionUID:
      case P.TagChapterUID:
      case P.TagAttachmentUID:
        this.currentTagTargetIsMovie = !1;
        break;
      case P.SimpleTag:
        {
          if (!this.currentTagTargetIsMovie)
            break;
          this.currentSimpleTagName = null, this.readContiguousElements(e.slice(a, n));
        }
        break;
      case P.TagName:
        this.currentSimpleTagName = zt(e, n);
        break;
      case P.TagString:
        {
          if (!this.currentSimpleTagName)
            break;
          const o = zt(e, n);
          this.processTagValue(this.currentSimpleTagName, o);
        }
        break;
      case P.TagBinary:
        {
          if (!this.currentSimpleTagName)
            break;
          const o = O(e, n);
          this.processTagValue(this.currentSimpleTagName, o);
        }
        break;
      case P.AttachedFile:
        {
          if (!this.currentSegment)
            break;
          this.currentAttachedFile = {
            fileUid: null,
            fileName: null,
            fileMediaType: null,
            fileData: null,
            fileDescription: null
          }, this.readContiguousElements(e.slice(a, n));
          const o = this.currentSegment.metadataTags;
          if (this.currentAttachedFile.fileUid && this.currentAttachedFile.fileData && (o.raw ??= {}, o.raw[this.currentAttachedFile.fileUid.toString()] = new ws(this.currentAttachedFile.fileData, this.currentAttachedFile.fileMediaType ?? void 0, this.currentAttachedFile.fileName ?? void 0, this.currentAttachedFile.fileDescription ?? void 0)), this.currentAttachedFile.fileMediaType?.startsWith("image/") && this.currentAttachedFile.fileData) {
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
      case P.FileUID:
        {
          if (!this.currentAttachedFile)
            break;
          this.currentAttachedFile.fileUid = Ba(e, n);
        }
        break;
      case P.FileName:
        {
          if (!this.currentAttachedFile)
            break;
          this.currentAttachedFile.fileName = zt(e, n);
        }
        break;
      case P.FileMediaType:
        {
          if (!this.currentAttachedFile)
            break;
          this.currentAttachedFile.fileMediaType = gt(e, n);
        }
        break;
      case P.FileData:
        {
          if (!this.currentAttachedFile)
            break;
          this.currentAttachedFile.fileData = O(e, n);
        }
        break;
      case P.FileDescription:
        {
          if (!this.currentAttachedFile)
            break;
          this.currentAttachedFile.fileDescription = zt(e, n);
        }
        break;
      case P.ContentEncodings:
        {
          if (!this.currentTrack)
            break;
          this.readContiguousElements(e.slice(a, n)), this.currentTrack.decodingInstructions.sort((o, c) => c.order - o.order);
        }
        break;
      case P.ContentEncoding:
        this.currentDecodingInstruction = {
          order: 0,
          scope: hr.Block,
          data: null
        }, this.readContiguousElements(e.slice(a, n)), this.currentDecodingInstruction.data && this.currentTrack.decodingInstructions.push(this.currentDecodingInstruction), this.currentDecodingInstruction = null;
        break;
      case P.ContentEncodingOrder:
        {
          if (!this.currentDecodingInstruction)
            break;
          this.currentDecodingInstruction.order = N(e, n);
        }
        break;
      case P.ContentEncodingScope:
        {
          if (!this.currentDecodingInstruction)
            break;
          this.currentDecodingInstruction.scope = N(e, n);
        }
        break;
      case P.ContentCompression:
        {
          if (!this.currentDecodingInstruction)
            break;
          this.currentDecodingInstruction.data = {
            type: "decompress",
            algorithm: Lt.Zlib,
            settings: null
          }, this.readContiguousElements(e.slice(a, n));
        }
        break;
      case P.ContentCompAlgo:
        {
          if (this.currentDecodingInstruction?.data?.type !== "decompress")
            break;
          this.currentDecodingInstruction.data.algorithm = N(e, n);
        }
        break;
      case P.ContentCompSettings:
        {
          if (this.currentDecodingInstruction?.data?.type !== "decompress")
            break;
          this.currentDecodingInstruction.data.settings = O(e, n);
        }
        break;
      case P.ContentEncryption:
        {
          if (!this.currentDecodingInstruction)
            break;
          this.currentDecodingInstruction.data = {
            type: "decrypt"
          };
        }
        break;
    }
    return e.filePos = a + n, !0;
  }
  decodeBlockData(e, t) {
    m(e.decodingInstructions.length > 0);
    let i = t;
    for (const s of e.decodingInstructions)
      switch (m(s.data), s.data.type) {
        case "decompress":
          switch (s.data.algorithm) {
            case Lt.HeaderStripping:
              if (s.data.settings && s.data.settings.length > 0) {
                const n = s.data.settings, a = new Uint8Array(n.length + i.length);
                a.set(n, 0), a.set(i, n.length), i = a;
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
            const s = new Date(t);
            Number.isNaN(s.getTime()) || (i.date ??= s);
          }
          break;
        case "track_number":
        case "part_number":
          {
            const s = t.split("/"), n = Number.parseInt(s[0], 10), a = s[1] && Number.parseInt(s[1], 10);
            Number.isInteger(n) && n > 0 && (i.trackNumber ??= n), a && Number.isInteger(a) && a > 0 && (i.tracksTotal ??= a);
          }
          break;
        case "disc_number":
        case "disc":
          {
            const s = t.split("/"), n = Number.parseInt(s[0], 10), a = s[1] && Number.parseInt(s[1], 10);
            Number.isInteger(n) && n > 0 && (i.discNumber ??= n), a && Number.isInteger(a) && a > 0 && (i.discsTotal ??= a);
          }
          break;
      }
  }
}
class qs {
  constructor(e) {
    this.internalTrack = e, this.packetToClusterLocation = /* @__PURE__ */ new WeakMap();
  }
  getId() {
    return this.internalTrack.id;
  }
  getCodec() {
    throw new Error("Not implemented on base class.");
  }
  getInternalCodecId() {
    return this.internalTrack.codecId;
  }
  async computeDuration() {
    const e = await this.getPacket(1 / 0, { metadataOnly: !0 });
    return (e?.timestamp ?? 0) + (e?.duration ?? 0);
  }
  getName() {
    return this.internalTrack.name;
  }
  getLanguageCode() {
    return this.internalTrack.languageCode;
  }
  async getFirstTimestamp() {
    return (await this.getFirstPacket({ metadataOnly: !0 }))?.timestamp ?? 0;
  }
  getTimeResolution() {
    return this.internalTrack.segment.timestampFactor;
  }
  getDisposition() {
    return this.internalTrack.disposition;
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
    return qt(e * this.internalTrack.segment.timestampFactor);
  }
  async getPacket(e, t) {
    const i = this.intoTimescale(e);
    return this.performClusterLookup(null, (s) => {
      const n = s.trackData.get(this.internalTrack.id);
      if (!n)
        return { blockIndex: -1, correctBlockFound: !1 };
      const a = L(n.presentationTimestamps, i, (l) => l.timestamp), o = a !== -1 ? n.presentationTimestamps[a].blockIndex : -1, c = a !== -1 && i < n.endTimestamp;
      return { blockIndex: o, correctBlockFound: c };
    }, i, i, t);
  }
  async getNextPacket(e, t) {
    const i = this.packetToClusterLocation.get(e);
    if (i === void 0)
      throw new Error("Packet was not created from this track.");
    return this.performClusterLookup(
      i.cluster,
      (s) => {
        if (s === i.cluster) {
          const n = s.trackData.get(this.internalTrack.id);
          if (i.blockIndex + 1 < n.blocks.length)
            return {
              blockIndex: i.blockIndex + 1,
              correctBlockFound: !0
            };
        } else if (s.trackData.get(this.internalTrack.id))
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
    return this.performClusterLookup(null, (s) => {
      const n = s.trackData.get(this.internalTrack.id);
      if (!n)
        return { blockIndex: -1, correctBlockFound: !1 };
      const a = di(n.presentationTimestamps, (l) => n.blocks[l.blockIndex].isKeyFrame && l.timestamp <= i), o = a !== -1 ? n.presentationTimestamps[a].blockIndex : -1, c = a !== -1 && i < n.endTimestamp;
      return { blockIndex: o, correctBlockFound: c };
    }, i, i, t);
  }
  async getNextKeyPacket(e, t) {
    const i = this.packetToClusterLocation.get(e);
    if (i === void 0)
      throw new Error("Packet was not created from this track.");
    return this.performClusterLookup(
      i.cluster,
      (s) => {
        if (s === i.cluster) {
          const a = s.trackData.get(this.internalTrack.id).blocks.findIndex((o, c) => o.isKeyFrame && c > i.blockIndex);
          if (a !== -1)
            return {
              blockIndex: a,
              correctBlockFound: !0
            };
        } else {
          const n = s.trackData.get(this.internalTrack.id);
          if (n && n.firstKeyFrameTimestamp !== null) {
            const a = n.blocks.findIndex((o) => o.isKeyFrame);
            return m(a !== -1), {
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
    const n = e.trackData.get(this.internalTrack.id).blocks[t];
    m(n), n.decoded || (n.data = this.internalTrack.demuxer.decodeBlockData(this.internalTrack, n.data), n.decoded = !0);
    const a = i.metadataOnly ? fe : n.data, o = n.timestamp / this.internalTrack.segment.timestampFactor, c = n.duration / this.internalTrack.segment.timestampFactor, l = {};
    n.mainAdditional && this.internalTrack.info?.type === "video" && this.internalTrack.info.alphaMode && (l.alpha = i.metadataOnly ? fe : n.mainAdditional, l.alphaByteLength = n.mainAdditional.byteLength);
    const u = new q(a, n.isKeyFrame ? "key" : "delta", o, c, e.dataStartPos + t, n.data.byteLength, l);
    return this.packetToClusterLocation.set(u, { cluster: e, blockIndex: t }), u;
  }
  /** Looks for a packet in the clusters while trying to load as few clusters as possible to retrieve it. */
  async performClusterLookup(e, t, i, s, n) {
    const { demuxer: a, segment: o } = this.internalTrack;
    let c = null, l = null, u = -1;
    if (e) {
      const { blockIndex: w, correctBlockFound: b } = t(e);
      if (b)
        return this.fetchPacketInCluster(e, w, n);
      w !== -1 && (l = e, u = w);
    }
    const d = L(this.internalTrack.cuePoints, i, (w) => w.time), h = d !== -1 ? this.internalTrack.cuePoints[d] : null, f = L(this.internalTrack.clusterPositionCache, i, (w) => w.startTimestamp), p = f !== -1 ? this.internalTrack.clusterPositionCache[f] : null, g = Math.max(h?.clusterPosition ?? 0, p?.elementStartPos ?? 0) || null;
    let k;
    for (e ? g === null || e.elementStartPos >= g ? (k = e.elementEndPos, c = e) : k = g : k = g ?? o.clusterSeekStartPos; o.elementEndPos === null || k <= o.elementEndPos - me; ) {
      if (c) {
        const C = c.trackData.get(this.internalTrack.id);
        if (C && C.startTimestamp > s)
          break;
      }
      let w = a.reader.requestSliceRange(k, me, Oe);
      if (w instanceof Promise && (w = await w), !w)
        break;
      const b = k, y = ze(w);
      if (!y || !Gt.includes(y.id) && y.id !== P.Void) {
        const C = await Ws(a.reader, b, Gt, Math.min(o.elementEndPos ?? 1 / 0, b + Hs));
        if (C) {
          k = C;
          continue;
        } else
          break;
      }
      const T = y.id;
      let x = y.size;
      const S = w.filePos;
      if (T === P.Cluster) {
        c = await a.readCluster(b, o), x = c.elementEndPos - S;
        const { blockIndex: C, correctBlockFound: R } = t(c);
        if (R)
          return this.fetchPacketInCluster(c, C, n);
        C !== -1 && (l = c, u = C);
      }
      x === void 0 && (m(T !== P.Cluster), x = (await Zr(a.reader, S, nr, o.elementEndPos)).pos - S);
      const E = S + x;
      if (o.elementEndPos === null) {
        let C = a.reader.requestSliceRange(E, me, Oe);
        if (C instanceof Promise && (C = await C), !C)
          break;
        if (xi(C) === P.Segment) {
          o.elementEndPos = E;
          break;
        }
      }
      k = E;
    }
    if (h && (!l || l.elementStartPos < h.clusterPosition)) {
      const w = this.internalTrack.cuePoints[d - 1];
      m(!w || w.time < h.time);
      const b = w?.time ?? -1 / 0;
      return this.performClusterLookup(null, t, b, s, n);
    }
    return l ? this.fetchPacketInCluster(l, u, n) : null;
  }
}
class Da extends qs {
  constructor(e) {
    super(e), this.decoderConfigPromise = null, this.internalTrack = e;
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
    return this.internalTrack.info.alphaMode;
  }
  async getDecoderConfig() {
    return this.internalTrack.info.codec ? this.decoderConfigPromise ??= (async () => {
      let e = null;
      return (this.internalTrack.info.codec === "vp9" || this.internalTrack.info.codec === "av1" || this.internalTrack.info.codec === "avc" && !this.internalTrack.info.codecDescription || this.internalTrack.info.codec === "hevc" && !this.internalTrack.info.codecDescription) && (e = await this.getFirstPacket({})), {
        codec: fi({
          width: this.internalTrack.info.width,
          height: this.internalTrack.info.height,
          codec: this.internalTrack.info.codec,
          codecDescription: this.internalTrack.info.codecDescription,
          colorSpace: this.internalTrack.info.colorSpace,
          avcType: 1,
          // We don't know better (or do we?) so just assume 'avc1'
          avcCodecInfo: this.internalTrack.info.codec === "avc" && e ? gi(e.data) : null,
          hevcCodecInfo: this.internalTrack.info.codec === "hevc" && e ? bi(e.data) : null,
          vp9CodecInfo: this.internalTrack.info.codec === "vp9" && e ? _s(e.data) : null,
          av1CodecInfo: this.internalTrack.info.codec === "av1" && e ? Fs(e.data) : null
        }),
        codedWidth: this.internalTrack.info.width,
        codedHeight: this.internalTrack.info.height,
        description: this.internalTrack.info.codecDescription ?? void 0,
        colorSpace: this.internalTrack.info.colorSpace ?? void 0
      };
    })() : null;
  }
}
class Ma extends qs {
  constructor(e) {
    super(e), this.decoderConfig = null, this.internalTrack = e;
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
    return this.internalTrack.info.codec ? this.decoderConfig ??= {
      codec: mi({
        codec: this.internalTrack.info.codec,
        codecDescription: this.internalTrack.info.codecDescription,
        aacCodecInfo: this.internalTrack.info.aacCodecInfo
      }),
      numberOfChannels: this.internalTrack.info.numberOfChannels,
      sampleRate: this.internalTrack.info.sampleRate,
      description: this.internalTrack.info.codecDescription ?? void 0
    } : null;
  }
}
const Wt = 4, Oa = [44100, 48e3, 32e3], Na = [
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
], Va = 1483304551, Ua = 1231971951, La = (r, e, t, i, s) => e === 0 ? 0 : e === 1 ? Math.floor(144 * t / (i << r)) + s : e === 2 ? Math.floor(144 * t / i) + s : (Math.floor(12 * t / i) + s) * 4, Wa = (r, e) => r === 3 ? e === 3 ? 21 : 36 : e === 3 ? 13 : 21, Ci = (r, e) => {
  const t = r >>> 24, i = r >>> 16 & 255, s = r >>> 8 & 255, n = r & 255;
  if (t !== 255 && i !== 255 && s !== 255 && n !== 255)
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
  const c = i >> 3 & 3, l = i >> 1 & 3, u = s >> 4 & 15, d = (s >> 2 & 3) % 3, h = s >> 1 & 1, f = n >> 6 & 3, p = n >> 4 & 3, g = n >> 3 & 1, k = n >> 2 & 1, w = n & 3, b = Na[a * 16 * 4 + l * 16 + u];
  if (b === -1)
    return { header: null, bytesAdvanced: 1 };
  const y = b * 1e3, T = Oa[d] >> a + o, x = La(a, l, y, T, h);
  if (e !== null && e < x)
    return { header: null, bytesAdvanced: 1 };
  let S;
  return c === 3 ? S = l === 3 ? 384 : 1152 : l === 3 ? S = 384 : l === 2 ? S = 1152 : S = 576, {
    header: {
      totalSize: x,
      mpegVersionId: c,
      layer: l,
      bitrate: y,
      frequencyIndex: d,
      sampleRate: T,
      channel: f,
      modeExtension: p,
      copyright: g,
      original: k,
      emphasis: w,
      audioSamplesInFrame: S
    },
    bytesAdvanced: 1
  };
}, Jr = (r) => {
  let e = 2130706432, t = 0;
  for (; e !== 0; )
    t >>= 1, t |= r & e, e >>= 8;
  return t;
};
var Tt;
(function(r) {
  r[r.Unsynchronisation = 128] = "Unsynchronisation", r[r.ExtendedHeader = 64] = "ExtendedHeader", r[r.ExperimentalIndicator = 32] = "ExperimentalIndicator", r[r.Footer = 16] = "Footer";
})(Tt || (Tt = {}));
var St;
(function(r) {
  r[r.ISO_8859_1 = 0] = "ISO_8859_1", r[r.UTF_16_WITH_BOM = 1] = "UTF_16_WITH_BOM", r[r.UTF_16_BE_NO_BOM = 2] = "UTF_16_BE_NO_BOM", r[r.UTF_8 = 3] = "UTF_8";
})(St || (St = {}));
const ar = 128, fr = 10, Pt = [
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
], Ha = (r, e) => {
  const t = r.filePos;
  e.raw ??= {}, e.raw.TAG ??= O(r, ar - 3), r.filePos = t;
  const i = ft(r, 30);
  i && (e.title ??= i);
  const s = ft(r, 30);
  s && (e.artist ??= s);
  const n = ft(r, 30);
  n && (e.album ??= n);
  const a = ft(r, 4), o = Number.parseInt(a, 10);
  Number.isInteger(o) && o > 0 && (e.date ??= new Date(o, 0, 1));
  const c = O(r, 30);
  let l;
  if (c[28] === 0 && c[29] !== 0) {
    const d = c[29];
    d > 0 && (e.trackNumber ??= d), r.skip(-30), l = ft(r, 28), r.skip(2);
  } else
    r.skip(-30), l = ft(r, 30);
  l && (e.comment ??= l);
  const u = A(r);
  u < Pt.length && (e.genre ??= Pt[u]);
}, ft = (r, e) => {
  const t = O(r, e), i = pt(t.indexOf(0), t.length), s = t.subarray(0, i);
  let n = "";
  for (let a = 0; a < s.length; a++)
    n += String.fromCharCode(s[a]);
  return n.trimEnd();
}, mr = (r) => {
  const e = r.filePos, t = te(r, 3), i = A(r), s = A(r), n = A(r), a = _(r);
  if (t !== "ID3" || i === 255 || s === 255 || (a & 2155905152) !== 0)
    return r.filePos = e, null;
  const o = Jr(a);
  return { majorVersion: i, revision: s, flags: n, size: o };
}, js = (r, e, t) => {
  if (![2, 3, 4].includes(e.majorVersion)) {
    console.warn(`Unsupported ID3v2 major version: ${e.majorVersion}`);
    return;
  }
  const i = O(r, e.size), s = new qa(e, i);
  if (e.flags & Tt.Footer && s.removeFooter(), e.flags & Tt.Unsynchronisation && e.majorVersion === 3 && s.ununsynchronizeAll(), e.flags & Tt.ExtendedHeader) {
    const n = s.readU32();
    e.majorVersion === 3 ? s.pos += n : s.pos += n - 4;
  }
  for (; s.pos <= s.bytes.length - s.frameHeaderSize(); ) {
    const n = s.readId3V2Frame();
    if (!n)
      break;
    const a = s.pos, o = s.pos + n.size;
    let c = !1, l = !1, u = !1;
    if (e.majorVersion === 3 ? (c = !!(n.flags & 64), l = !!(n.flags & 128)) : e.majorVersion === 4 && (c = !!(n.flags & 4), l = !!(n.flags & 8), u = !!(n.flags & 2) || !!(e.flags & Tt.Unsynchronisation)), c) {
      console.warn(`Skipping encrypted ID3v2 frame ${n.id}`), s.pos = o;
      continue;
    }
    if (l) {
      console.warn(`Skipping compressed ID3v2 frame ${n.id}`), s.pos = o;
      continue;
    }
    switch (u && s.ununsynchronizeRegion(s.pos, o), t.raw ??= {}, n.id[0] === "T" ? t.raw[n.id] ??= s.readId3V2EncodingAndText(o) : t.raw[n.id] ??= s.readBytes(n.size), s.pos = a, n.id) {
      case "TIT2":
      case "TT2":
        t.title ??= s.readId3V2EncodingAndText(o);
        break;
      case "TIT3":
      case "TT3":
        t.description ??= s.readId3V2EncodingAndText(o);
        break;
      case "TPE1":
      case "TP1":
        t.artist ??= s.readId3V2EncodingAndText(o);
        break;
      case "TALB":
      case "TAL":
        t.album ??= s.readId3V2EncodingAndText(o);
        break;
      case "TPE2":
      case "TP2":
        t.albumArtist ??= s.readId3V2EncodingAndText(o);
        break;
      case "TRCK":
      case "TRK":
        {
          const h = s.readId3V2EncodingAndText(o).split("/"), f = Number.parseInt(h[0], 10), p = h[1] && Number.parseInt(h[1], 10);
          Number.isInteger(f) && f > 0 && (t.trackNumber ??= f), p && Number.isInteger(p) && p > 0 && (t.tracksTotal ??= p);
        }
        break;
      case "TPOS":
      case "TPA":
        {
          const h = s.readId3V2EncodingAndText(o).split("/"), f = Number.parseInt(h[0], 10), p = h[1] && Number.parseInt(h[1], 10);
          Number.isInteger(f) && f > 0 && (t.discNumber ??= f), p && Number.isInteger(p) && p > 0 && (t.discsTotal ??= p);
        }
        break;
      case "TCON":
      case "TCO":
        {
          const d = s.readId3V2EncodingAndText(o);
          let h = /^\((\d+)\)/.exec(d);
          if (h) {
            const f = Number.parseInt(h[1]);
            if (Pt[f] !== void 0) {
              t.genre ??= Pt[f];
              break;
            }
          }
          if (h = /^\d+$/.exec(d), h) {
            const f = Number.parseInt(h[0]);
            if (Pt[f] !== void 0) {
              t.genre ??= Pt[f];
              break;
            }
          }
          t.genre ??= d;
        }
        break;
      case "TDRC":
      case "TDAT":
        {
          const d = s.readId3V2EncodingAndText(o), h = new Date(d);
          Number.isNaN(h.getTime()) || (t.date ??= h);
        }
        break;
      case "TYER":
      case "TYE":
        {
          const d = s.readId3V2EncodingAndText(o), h = Number.parseInt(d, 10);
          Number.isInteger(h) && (t.date ??= new Date(h, 0, 1));
        }
        break;
      case "USLT":
      case "ULT":
        {
          const d = s.readU8();
          s.pos += 3, s.readId3V2Text(d, o), t.lyrics ??= s.readId3V2Text(d, o);
        }
        break;
      case "COMM":
      case "COM":
        {
          const d = s.readU8();
          s.pos += 3, s.readId3V2Text(d, o), t.comment ??= s.readId3V2Text(d, o);
        }
        break;
      case "APIC":
      case "PIC":
        {
          const d = s.readId3V2TextEncoding();
          let h;
          if (e.majorVersion === 2) {
            const k = s.readAscii(3);
            h = k === "PNG" ? "image/png" : k === "JPG" ? "image/jpeg" : "image/*";
          } else
            h = s.readId3V2Text(d, o);
          const f = s.readU8(), p = s.readId3V2Text(d, o).trimEnd(), g = o - s.pos;
          if (g >= 0) {
            const k = s.readBytes(g);
            t.images || (t.images = []), t.images.push({
              data: k,
              mimeType: h,
              kind: f === 3 ? "coverFront" : f === 4 ? "coverBack" : "unknown",
              description: p
            });
          }
        }
        break;
      default:
        s.pos += n.size;
        break;
    }
    s.pos = o;
  }
};
class qa {
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
    const s = this.bytes.subarray(0, e), n = this.bytes.subarray(t);
    this.bytes = new Uint8Array(s.length + i.length + n.length), this.bytes.set(s, 0), this.bytes.set(i, s.length), this.bytes.set(n, s.length + i.length), this.view = new DataView(this.bytes.buffer);
  }
  removeFooter() {
    this.bytes = this.bytes.subarray(0, this.bytes.length - fr), this.view = new DataView(this.bytes.buffer);
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
    const e = this.view.getUint16(this.pos, !1), t = this.view.getUint8(this.pos + 1);
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
      let i = this.header.majorVersion === 4 ? Jr(t) : t;
      const s = this.readU16(), n = this.pos, a = (o) => {
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
        const o = this.header.majorVersion === 4 ? t : Jr(t);
        a(o) && (i = o);
      }
      return this.pos = n, { id: e, size: i, flags: s };
    }
  }
  readId3V2TextEncoding() {
    const e = this.readU8();
    if (e > 3)
      throw new Error(`Unsupported text encoding: ${e}`);
    return e;
  }
  readId3V2Text(e, t) {
    const i = this.pos, s = this.readBytes(t - this.pos);
    switch (e) {
      case St.ISO_8859_1: {
        let n = "";
        for (let a = 0; a < s.length; a++) {
          const o = s[a];
          if (o === 0) {
            this.pos = i + a + 1;
            break;
          }
          n += String.fromCharCode(o);
        }
        return n;
      }
      case St.UTF_16_WITH_BOM:
        if (s[0] === 255 && s[1] === 254) {
          const n = new TextDecoder("utf-16le"), a = pt(s.findIndex((o, c) => o === 0 && s[c + 1] === 0 && c % 2 === 0), s.length);
          return this.pos = i + Math.min(a + 2, s.length), n.decode(s.subarray(2, a));
        } else if (s[0] === 254 && s[1] === 255) {
          const n = new TextDecoder("utf-16be"), a = pt(s.findIndex((o, c) => o === 0 && s[c + 1] === 0 && c % 2 === 0), s.length);
          return this.pos = i + Math.min(a + 2, s.length), n.decode(s.subarray(2, a));
        } else {
          const n = pt(s.findIndex((a) => a === 0), s.length);
          return this.pos = i + Math.min(n + 1, s.length), ge.decode(s.subarray(0, n));
        }
      case St.UTF_16_BE_NO_BOM: {
        const n = new TextDecoder("utf-16be"), a = pt(s.findIndex((o, c) => o === 0 && s[c + 1] === 0 && c % 2 === 0), s.length);
        return this.pos = i + Math.min(a + 2, s.length), n.decode(s.subarray(0, a));
      }
      case St.UTF_8: {
        const n = pt(s.findIndex((a) => a === 0), s.length);
        return this.pos = i + Math.min(n + 1, s.length), ge.decode(s.subarray(0, n));
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
const ei = async (r, e, t) => {
  let i = e;
  for (; t === null || i < t; ) {
    let s = r.requestSlice(i, Wt);
    if (s instanceof Promise && (s = await s), !s)
      break;
    const n = _(s), a = Ci(n, r.fileSize !== null ? r.fileSize - i : null);
    if (a.header)
      return { header: a.header, startPos: i };
    i += a.bytesAdvanced;
  }
  return null;
};
class ja extends Ze {
  constructor(e) {
    super(e), this.metadataPromise = null, this.firstFrameHeader = null, this.loadedSamples = [], this.metadataTags = null, this.tracks = [], this.readingMutex = new ut(), this.lastSampleLoaded = !1, this.lastLoadedPos = 0, this.nextTimestampInSamples = 0, this.reader = e._reader;
  }
  async readMetadata() {
    return this.metadataPromise ??= (async () => {
      for (; !this.firstFrameHeader && !this.lastSampleLoaded; )
        await this.advanceReader();
      if (!this.firstFrameHeader)
        throw new Error("No valid MP3 frame found.");
      this.tracks = [new Fe(this.input, new $a(this))];
    })();
  }
  async advanceReader() {
    if (this.lastLoadedPos === 0)
      for (; ; ) {
        let o = this.reader.requestSlice(this.lastLoadedPos, fr);
        if (o instanceof Promise && (o = await o), !o) {
          this.lastSampleLoaded = !0;
          return;
        }
        const c = mr(o);
        if (!c)
          break;
        this.lastLoadedPos = o.filePos + c.size;
      }
    const e = await ei(this.reader, this.lastLoadedPos, this.reader.fileSize);
    if (!e) {
      this.lastSampleLoaded = !0;
      return;
    }
    const t = e.header;
    this.lastLoadedPos = e.startPos + t.totalSize - 1;
    const i = Wa(t.mpegVersionId, t.channel);
    let s = this.reader.requestSlice(e.startPos + i, 4);
    if (s instanceof Promise && (s = await s), s) {
      const o = _(s);
      if (o === Va || o === Ua)
        return;
    }
    this.firstFrameHeader || (this.firstFrameHeader = t), t.sampleRate !== this.firstFrameHeader.sampleRate && console.warn(`MP3 changed sample rate mid-file: ${this.firstFrameHeader.sampleRate} Hz to ${t.sampleRate} Hz. Might be a bug, so please report this file.`);
    const n = t.audioSamplesInFrame / this.firstFrameHeader.sampleRate, a = {
      timestamp: this.nextTimestampInSamples / this.firstFrameHeader.sampleRate,
      duration: n,
      dataStart: e.startPos,
      dataSize: t.totalSize
    };
    this.loadedSamples.push(a), this.nextTimestampInSamples += t.audioSamplesInFrame;
  }
  async getMimeType() {
    return "audio/mpeg";
  }
  async getTracks() {
    return await this.readMetadata(), this.tracks;
  }
  async computeDuration() {
    await this.readMetadata();
    const e = this.tracks[0];
    return m(e), e.computeDuration();
  }
  async getMetadataTags() {
    const e = await this.readingMutex.acquire();
    try {
      if (await this.readMetadata(), this.metadataTags)
        return this.metadataTags;
      this.metadataTags = {};
      let t = 0, i = !1;
      for (; ; ) {
        let s = this.reader.requestSlice(t, fr);
        if (s instanceof Promise && (s = await s), !s)
          break;
        const n = mr(s);
        if (!n)
          break;
        i = !0;
        let a = this.reader.requestSlice(s.filePos, n.size);
        if (a instanceof Promise && (a = await a), !a)
          break;
        js(a, n, this.metadataTags), t = s.filePos + n.size;
      }
      if (!i && this.reader.fileSize !== null && this.reader.fileSize >= ar) {
        let s = this.reader.requestSlice(this.reader.fileSize - ar, ar);
        s instanceof Promise && (s = await s), m(s), te(s, 3) === "TAG" && Ha(s, this.metadataTags);
      }
      return this.metadataTags;
    } finally {
      e();
    }
  }
}
class $a {
  constructor(e) {
    this.demuxer = e;
  }
  getId() {
    return 1;
  }
  async getFirstTimestamp() {
    return 0;
  }
  getTimeResolution() {
    return m(this.demuxer.firstFrameHeader), this.demuxer.firstFrameHeader.sampleRate / this.demuxer.firstFrameHeader.audioSamplesInFrame;
  }
  async computeDuration() {
    const e = await this.getPacket(1 / 0, { metadataOnly: !0 });
    return (e?.timestamp ?? 0) + (e?.duration ?? 0);
  }
  getName() {
    return null;
  }
  getLanguageCode() {
    return de;
  }
  getCodec() {
    return "mp3";
  }
  getInternalCodecId() {
    return null;
  }
  getNumberOfChannels() {
    return m(this.demuxer.firstFrameHeader), this.demuxer.firstFrameHeader.channel === 3 ? 1 : 2;
  }
  getSampleRate() {
    return m(this.demuxer.firstFrameHeader), this.demuxer.firstFrameHeader.sampleRate;
  }
  getDisposition() {
    return {
      ...Xe
    };
  }
  async getDecoderConfig() {
    return m(this.demuxer.firstFrameHeader), {
      codec: "mp3",
      numberOfChannels: this.demuxer.firstFrameHeader.channel === 3 ? 1 : 2,
      sampleRate: this.demuxer.firstFrameHeader.sampleRate
    };
  }
  async getPacketAtIndex(e, t) {
    if (e === -1)
      return null;
    const i = this.demuxer.loadedSamples[e];
    if (!i)
      return null;
    let s;
    if (t.metadataOnly)
      s = fe;
    else {
      let n = this.demuxer.reader.requestSlice(i.dataStart, i.dataSize);
      if (n instanceof Promise && (n = await n), !n)
        return null;
      s = O(n, i.dataSize);
    }
    return new q(s, "key", i.timestamp, i.duration, e, i.dataSize);
  }
  getFirstPacket(e) {
    return this.getPacketAtIndex(0, e);
  }
  async getNextPacket(e, t) {
    const i = await this.demuxer.readingMutex.acquire();
    try {
      const s = Jt(this.demuxer.loadedSamples, e.timestamp, (a) => a.timestamp);
      if (s === -1)
        throw new Error("Packet was not created from this track.");
      const n = s + 1;
      for (; n >= this.demuxer.loadedSamples.length && !this.demuxer.lastSampleLoaded; )
        await this.demuxer.advanceReader();
      return this.getPacketAtIndex(n, t);
    } finally {
      i();
    }
  }
  async getPacket(e, t) {
    const i = await this.demuxer.readingMutex.acquire();
    try {
      for (; ; ) {
        const s = L(this.demuxer.loadedSamples, e, (n) => n.timestamp);
        if (s === -1 && this.demuxer.loadedSamples.length > 0)
          return null;
        if (this.demuxer.lastSampleLoaded)
          return this.getPacketAtIndex(s, t);
        if (s >= 0 && s + 1 < this.demuxer.loadedSamples.length)
          return this.getPacketAtIndex(s, t);
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
const $s = 1399285583, Qa = 79764919, Qs = new Uint32Array(256);
for (let r = 0; r < 256; r++) {
  let e = r << 24;
  for (let t = 0; t < 8; t++)
    e = e & 2147483648 ? e << 1 ^ Qa : e << 1;
  Qs[r] = e >>> 0 & 4294967295;
}
const Ka = (r) => {
  const e = G(r), t = e.getUint32(22, !0);
  e.setUint32(22, 0, !0);
  let i = 0;
  for (let s = 0; s < r.length; s++) {
    const n = r[s];
    i = (i << 8 ^ Qs[i >>> 24 ^ n]) >>> 0;
  }
  return e.setUint32(22, t, !0), i;
}, Ga = (r, e, t) => {
  let i = 0, s = null;
  if (r.length > 0)
    if (e.codec === "vorbis") {
      m(e.vorbisInfo);
      const n = e.vorbisInfo.modeBlockflags.length, o = (1 << In(n - 1)) - 1 << 1, c = (r[0] & o) >> 1;
      if (c >= e.vorbisInfo.modeBlockflags.length)
        throw new Error("Invalid mode number.");
      let l = t;
      const u = e.vorbisInfo.modeBlockflags[c];
      if (s = e.vorbisInfo.blocksizes[u], u === 1) {
        const d = (o | 1) + 1, h = r[0] & d ? 1 : 0;
        l = e.vorbisInfo.blocksizes[h];
      }
      i = l !== null ? l + s >> 2 : 0;
    } else e.codec === "opus" && (i = ca(r).durationInSamples);
  return {
    durationInSamples: i,
    vorbisBlockSize: s
  };
}, Xa = (r) => {
  let e = "audio/ogg";
  if (r.codecStrings) {
    const t = [...new Set(r.codecStrings)];
    e += `; codecs="${t.join(", ")}"`;
  }
  return e;
};
const st = 27, Et = 282, Ya = Et + 65025, Ht = (r) => {
  const e = r.filePos;
  if (vt(r) !== $s)
    return null;
  r.skip(1);
  const i = A(r), s = Wo(r), n = vt(r), a = vt(r), o = vt(r), c = A(r), l = new Uint8Array(c);
  for (let f = 0; f < c; f++)
    l[f] = A(r);
  const u = 27 + c, d = l.reduce((f, p) => f + p, 0), h = u + d;
  return {
    headerStartPos: e,
    totalSize: h,
    dataStartPos: e + u,
    dataSize: d,
    headerType: i,
    granulePosition: s,
    serialNumber: n,
    sequenceNumber: a,
    checksum: o,
    lacingValues: l
  };
}, Za = (r, e) => {
  for (; r.filePos < e - 3; ) {
    const t = vt(r), i = t & 255, s = t >>> 8 & 255, n = t >>> 16 & 255, a = t >>> 24 & 255, o = 79;
    if (!(i !== o && s !== o && n !== o && a !== o)) {
      if (r.skip(-4), t === $s)
        return !0;
      r.skip(1);
    }
  }
  return !1;
};
class Ja extends Ze {
  constructor(e) {
    super(e), this.metadataPromise = null, this.bitstreams = [], this.tracks = [], this.metadataTags = {}, this.reader = e._reader;
  }
  async readMetadata() {
    return this.metadataPromise ??= (async () => {
      let e = 0;
      for (; ; ) {
        let t = this.reader.requestSliceRange(e, st, Et);
        if (t instanceof Promise && (t = await t), !t)
          break;
        const i = Ht(t);
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
        ), t.codecInfo.codec !== null && this.tracks.push(new Fe(this.input, new eo(t, this))));
      }
    })();
  }
  async readVorbisMetadata(e, t) {
    let i = await this.findNextPacketStart(e);
    if (!i)
      return;
    const s = await this.readPacket(i.startPage, i.startSegmentIndex);
    if (!s || (i = await this.findNextPacketStart(s), !i))
      return;
    const n = await this.readPacket(i.startPage, i.startSegmentIndex);
    if (!n || s.data[0] !== 3 || n.data[0] !== 5)
      return;
    const a = [], o = (d) => {
      for (; a.push(Math.min(255, d)), !(d < 255); )
        d -= 255;
    };
    o(e.data.length), o(s.data.length);
    const c = new Uint8Array(1 + a.length + e.data.length + s.data.length + n.data.length);
    c[0] = 2, c.set(a, 1), c.set(e.data, 1 + a.length), c.set(s.data, 1 + a.length + e.data.length), c.set(n.data, 1 + a.length + e.data.length + s.data.length), t.codecInfo.codec = "vorbis", t.description = c, t.lastMetadataPacket = n;
    const l = G(e.data);
    t.numberOfChannels = l.getUint8(11), t.sampleRate = l.getUint32(12, !0);
    const u = l.getUint8(28);
    t.codecInfo.vorbisInfo = {
      blocksizes: [
        1 << (u & 15),
        1 << (u >> 4)
      ],
      modeBlockflags: la(n.data).modeBlockflags
    }, $r(s.data.subarray(7), this.metadataTags);
  }
  async readOpusMetadata(e, t) {
    const i = await this.findNextPacketStart(e);
    if (!i)
      return;
    const s = await this.readPacket(i.startPage, i.startSegmentIndex);
    if (!s)
      return;
    t.codecInfo.codec = "opus", t.description = e.data, t.lastMetadataPacket = s;
    const n = As(e.data);
    t.numberOfChannels = n.outputChannelCount, t.sampleRate = yr, t.codecInfo.opusInfo = {
      preSkip: n.preSkip
    }, $r(s.data.subarray(8), this.metadataTags);
  }
  async readPacket(e, t) {
    m(t < e.lacingValues.length);
    let i = 0;
    for (let d = 0; d < t; d++)
      i += e.lacingValues[d];
    let s = e, n = i, a = t;
    const o = [];
    e: for (; ; ) {
      let d = this.reader.requestSlice(s.dataStartPos, s.dataSize);
      d instanceof Promise && (d = await d), m(d);
      const h = O(d, s.dataSize);
      for (; ; ) {
        if (a === s.lacingValues.length) {
          o.push(h.subarray(i, n));
          break;
        }
        const p = s.lacingValues[a];
        if (n += p, p < 255) {
          o.push(h.subarray(i, n));
          break e;
        }
        a++;
      }
      let f = s.headerStartPos + s.totalSize;
      for (; ; ) {
        let p = this.reader.requestSliceRange(f, st, Et);
        if (p instanceof Promise && (p = await p), !p)
          return null;
        const g = Ht(p);
        if (!g)
          return null;
        if (s = g, s.serialNumber === e.serialNumber)
          break;
        f = s.headerStartPos + s.totalSize;
      }
      i = 0, n = 0, a = 0;
    }
    const c = o.reduce((d, h) => d + h.length, 0);
    if (c === 0)
      return null;
    const l = new Uint8Array(c);
    let u = 0;
    for (let d = 0; d < o.length; d++) {
      const h = o[d];
      l.set(h, u), u += h.length;
    }
    return {
      data: l,
      endPage: s,
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
      let s = this.reader.requestSliceRange(i, st, Et);
      if (s instanceof Promise && (s = await s), !s)
        return null;
      const n = Ht(s);
      if (!n)
        return null;
      if (n.serialNumber === e.endPage.serialNumber)
        return { startPage: n, startSegmentIndex: 0 };
      i = n.headerStartPos + n.totalSize;
    }
  }
  async getMimeType() {
    await this.readMetadata();
    const e = await Promise.all(this.tracks.map((t) => t.getCodecParameterString()));
    return Xa({
      codecStrings: e.filter(Boolean)
    });
  }
  async getTracks() {
    return await this.readMetadata(), this.tracks;
  }
  async computeDuration() {
    const e = await this.getTracks(), t = await Promise.all(e.map((i) => i.computeDuration()));
    return Math.max(0, ...t);
  }
  async getMetadataTags() {
    return await this.readMetadata(), this.metadataTags;
  }
}
class eo {
  constructor(e, t) {
    this.bitstream = e, this.demuxer = t, this.encodedPacketToMetadata = /* @__PURE__ */ new WeakMap(), this.sequentialScanCache = [], this.sequentialScanMutex = new ut(), this.internalSampleRate = e.codecInfo.codec === "opus" ? yr : e.sampleRate;
  }
  getId() {
    return this.bitstream.serialNumber;
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
  getCodec() {
    return this.bitstream.codecInfo.codec;
  }
  getInternalCodecId() {
    return null;
  }
  async getDecoderConfig() {
    return m(this.bitstream.codecInfo.codec), {
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
    return de;
  }
  getDisposition() {
    return {
      ...Xe
    };
  }
  async getFirstTimestamp() {
    return 0;
  }
  async computeDuration() {
    const e = await this.getPacket(1 / 0, { metadataOnly: !0 });
    return (e?.timestamp ?? 0) + (e?.duration ?? 0);
  }
  granulePositionToTimestampInSamples(e) {
    return this.bitstream.codecInfo.codec === "opus" ? (m(this.bitstream.codecInfo.opusInfo), e - this.bitstream.codecInfo.opusInfo.preSkip) : e;
  }
  createEncodedPacketFromOggPacket(e, t, i) {
    if (!e)
      return null;
    const { durationInSamples: s, vorbisBlockSize: n } = Ga(e.data, this.bitstream.codecInfo, t.vorbisLastBlocksize), a = new q(i.metadataOnly ? fe : e.data, "key", Math.max(0, t.timestampInSamples) / this.internalSampleRate, s / this.internalSampleRate, e.endPage.headerStartPos + e.endSegmentIndex, e.data.byteLength);
    return this.encodedPacketToMetadata.set(a, {
      packet: e,
      timestampInSamples: t.timestampInSamples,
      durationInSamples: s,
      vorbisLastBlockSize: t.vorbisLastBlocksize,
      vorbisBlockSize: n
    }), a;
  }
  async getFirstPacket(e) {
    m(this.bitstream.lastMetadataPacket);
    const t = await this.demuxer.findNextPacketStart(this.bitstream.lastMetadataPacket);
    if (!t)
      return null;
    let i = 0;
    this.bitstream.codecInfo.codec === "opus" && (m(this.bitstream.codecInfo.opusInfo), i -= this.bitstream.codecInfo.opusInfo.preSkip);
    const s = await this.demuxer.readPacket(t.startPage, t.startSegmentIndex);
    return this.createEncodedPacketFromOggPacket(s, {
      timestampInSamples: i,
      vorbisLastBlocksize: null
    }, e);
  }
  async getNextPacket(e, t) {
    const i = this.encodedPacketToMetadata.get(e);
    if (!i)
      throw new Error("Packet was not created from this track.");
    const s = await this.demuxer.findNextPacketStart(i.packet);
    if (!s)
      return null;
    const n = i.timestampInSamples + i.durationInSamples, a = await this.demuxer.readPacket(s.startPage, s.startSegmentIndex);
    return this.createEncodedPacketFromOggPacket(a, {
      timestampInSamples: n,
      vorbisLastBlocksize: i.vorbisBlockSize
    }, t);
  }
  async getPacket(e, t) {
    if (this.demuxer.reader.fileSize === null)
      return this.getPacketSequential(e, t);
    const i = qt(e * this.internalSampleRate);
    if (i === 0)
      return this.getFirstPacket(t);
    if (i < 0)
      return null;
    m(this.bitstream.lastMetadataPacket);
    const s = await this.demuxer.findNextPacketStart(this.bitstream.lastMetadataPacket);
    if (!s)
      return null;
    let n = s.startPage, a = this.demuxer.reader.fileSize;
    const o = [n];
    e: for (; n.headerStartPos + n.totalSize < a; ) {
      const b = n.headerStartPos, y = Math.floor((b + a) / 2);
      let T = y;
      for (; ; ) {
        const x = Math.min(T + Ya, a - st);
        let S = this.demuxer.reader.requestSlice(T, x - T);
        if (S instanceof Promise && (S = await S), m(S), !Za(S, x)) {
          a = y + st;
          continue e;
        }
        let C = this.demuxer.reader.requestSliceRange(S.filePos, st, Et);
        C instanceof Promise && (C = await C), m(C);
        const R = Ht(C);
        m(R);
        let M = !1;
        if (R.serialNumber === this.bitstream.serialNumber)
          M = !0;
        else {
          let D = this.demuxer.reader.requestSlice(R.headerStartPos, R.totalSize);
          D instanceof Promise && (D = await D), m(D);
          const W = O(D, R.totalSize);
          M = Ka(W) === R.checksum;
        }
        if (!M) {
          T = R.headerStartPos + 4;
          continue;
        }
        if (M && R.serialNumber !== this.bitstream.serialNumber) {
          T = R.headerStartPos + R.totalSize;
          continue;
        }
        if (R.granulePosition === -1) {
          T = R.headerStartPos + R.totalSize;
          continue;
        }
        this.granulePositionToTimestampInSamples(R.granulePosition) > i ? a = R.headerStartPos : (n = R, o.push(R));
        continue e;
      }
    }
    let c = s.startPage;
    for (const b of o) {
      if (b.granulePosition === n.granulePosition)
        break;
      (!c || b.headerStartPos > c.headerStartPos) && (c = b);
    }
    let l = c;
    const u = [l];
    for (; !(l.serialNumber === this.bitstream.serialNumber && l.granulePosition === n.granulePosition); ) {
      const b = l.headerStartPos + l.totalSize;
      let y = this.demuxer.reader.requestSliceRange(b, st, Et);
      y instanceof Promise && (y = await y), m(y);
      const T = Ht(y);
      m(T), l = T, l.serialNumber === this.bitstream.serialNumber && u.push(l);
    }
    m(l.granulePosition !== -1);
    let d = null, h, f, p = l, g = 0;
    if (l.headerStartPos === s.startPage.headerStartPos)
      h = this.granulePositionToTimestampInSamples(0), f = !0, d = 0;
    else {
      h = 0, f = !1;
      for (let T = l.lacingValues.length - 1; T >= 0; T--)
        if (l.lacingValues[T] < 255) {
          d = T + 1;
          break;
        }
      if (d === null)
        throw new Error("Invalid page with granule position: no packets end on this page.");
      g = d - 1;
      const b = {
        data: fe,
        endPage: p,
        endSegmentIndex: g
      };
      if (await this.demuxer.findNextPacketStart(b)) {
        const T = Ji(u, l, d);
        m(T);
        const x = Zi(u, T.page, T.segmentIndex);
        x && (l = x.page, d = x.segmentIndex);
      } else
        for (; ; ) {
          const T = Ji(u, l, d);
          if (!T)
            break;
          const x = Zi(u, T.page, T.segmentIndex);
          if (!x)
            break;
          if (l = x.page, d = x.segmentIndex, T.page.headerStartPos !== p.headerStartPos) {
            p = T.page, g = T.segmentIndex;
            break;
          }
        }
    }
    let k = null, w = null;
    for (; l !== null; ) {
      m(d !== null);
      const b = await this.demuxer.readPacket(l, d);
      if (!b)
        break;
      if (!(l.headerStartPos === s.startPage.headerStartPos && d < s.startSegmentIndex)) {
        let x = this.createEncodedPacketFromOggPacket(b, {
          timestampInSamples: h,
          vorbisLastBlocksize: w?.vorbisBlockSize ?? null
        }, t);
        m(x);
        let S = this.encodedPacketToMetadata.get(x);
        if (m(S), !f && b.endPage.headerStartPos === p.headerStartPos && b.endSegmentIndex === g ? (h = this.granulePositionToTimestampInSamples(l.granulePosition), f = !0, x = this.createEncodedPacketFromOggPacket(b, {
          timestampInSamples: h - S.durationInSamples,
          vorbisLastBlocksize: w?.vorbisBlockSize ?? null
        }, t), m(x), S = this.encodedPacketToMetadata.get(x), m(S)) : h += S.durationInSamples, k = x, w = S, f && // Next timestamp will be too late
        (Math.max(h, 0) > i || Math.max(S.timestampInSamples, 0) === i))
          break;
      }
      const T = await this.demuxer.findNextPacketStart(b);
      if (!T)
        break;
      l = T.startPage, d = T.startSegmentIndex;
    }
    return k;
  }
  // A slower but simpler and sequential algorithm for finding a packet in a file
  async getPacketSequential(e, t) {
    const i = await this.sequentialScanMutex.acquire();
    try {
      const s = qt(e * this.internalSampleRate);
      e = s / this.internalSampleRate;
      const n = L(this.sequentialScanCache, s, (c) => c.timestampInSamples);
      let a;
      if (n !== -1) {
        const c = this.sequentialScanCache[n];
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
          m(l), this.sequentialScanCache.length > 0 && m(K(this.sequentialScanCache).timestampInSamples <= l.timestampInSamples), this.sequentialScanCache.push(l);
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
const Zi = (r, e, t) => {
  let i = e, s = t;
  e: for (; ; ) {
    for (s--, s; s >= 0; s--)
      if (i.lacingValues[s] < 255) {
        s++;
        break e;
      }
    if (m(s === -1), !(i.headerType & 1)) {
      s = 0;
      break;
    }
    const a = ms(r, (o) => o.headerStartPos < i.headerStartPos);
    if (!a)
      return null;
    i = a, s = i.lacingValues.length;
  }
  if (m(s !== -1), s === i.lacingValues.length) {
    const n = r[r.indexOf(i) + 1];
    m(n), i = n, s = 0;
  }
  return { page: i, segmentIndex: s };
}, Ji = (r, e, t) => {
  if (t > 0)
    return { page: e, segmentIndex: t - 1 };
  const i = ms(r, (s) => s.headerStartPos < e.headerStartPos);
  return i ? { page: i, segmentIndex: i.lacingValues.length - 1 } : null;
};
var Be;
(function(r) {
  r[r.PCM = 1] = "PCM", r[r.IEEE_FLOAT = 3] = "IEEE_FLOAT", r[r.ALAW = 6] = "ALAW", r[r.MULAW = 7] = "MULAW", r[r.EXTENSIBLE = 65534] = "EXTENSIBLE";
})(Be || (Be = {}));
class to extends Ze {
  constructor(e) {
    super(e), this.metadataPromise = null, this.dataStart = -1, this.dataSize = -1, this.audioInfo = null, this.tracks = [], this.lastKnownPacketIndex = 0, this.metadataTags = {}, this.reader = e._reader;
  }
  async readMetadata() {
    return this.metadataPromise ??= (async () => {
      let e = this.reader.requestSlice(0, 12);
      e instanceof Promise && (e = await e), m(e);
      const t = te(e, 4), i = t !== "RIFX", s = t === "RF64", n = Qe(e, i);
      let a = s ? this.reader.fileSize : Math.min(n + 8, this.reader.fileSize ?? 1 / 0);
      if (te(e, 4) !== "WAVE")
        throw new Error("Invalid WAVE file - wrong format");
      let c = 0, l = null, u = e.filePos;
      for (; a === null || u < a; ) {
        let h = this.reader.requestSlice(u, 8);
        if (h instanceof Promise && (h = await h), !h)
          break;
        const f = te(h, 4), p = Qe(h, i), g = h.filePos;
        if (s && c === 0 && f !== "ds64")
          throw new Error('Invalid RF64 file: First chunk must be "ds64".');
        if (f === "fmt ")
          await this.parseFmtChunk(g, p, i);
        else if (f === "data") {
          if (l ??= p, this.dataStart = h.filePos, this.dataSize = Math.min(l, (a ?? 1 / 0) - this.dataStart), this.reader.fileSize === null)
            break;
        } else if (f === "ds64") {
          let k = this.reader.requestSlice(g, p);
          if (k instanceof Promise && (k = await k), !k)
            break;
          const w = rs(k, i);
          l = rs(k, i), a = Math.min(w + 8, this.reader.fileSize ?? 1 / 0);
        } else f === "LIST" ? await this.parseListChunk(g, p, i) : (f === "ID3 " || f === "id3 ") && await this.parseId3Chunk(g, p);
        u = g + p + (p & 1), c++;
      }
      if (!this.audioInfo)
        throw new Error('Invalid WAVE file - missing "fmt " chunk');
      if (this.dataStart === -1)
        throw new Error('Invalid WAVE file - missing "data" chunk');
      const d = this.audioInfo.blockSizeInBytes;
      this.dataSize = Math.floor(this.dataSize / d) * d, this.tracks.push(new Fe(this.input, new ro(this)));
    })();
  }
  async parseFmtChunk(e, t, i) {
    let s = this.reader.requestSlice(e, t);
    if (s instanceof Promise && (s = await s), !s)
      return;
    let n = Dt(s, i);
    const a = Dt(s, i), o = Qe(s, i);
    s.skip(4);
    const c = Dt(s, i);
    let l;
    if (t === 14 ? l = 8 : l = Dt(s, i), t >= 18 && n !== 357) {
      const u = Dt(s, i), d = t - 18;
      if (Math.min(d, u) >= 22 && n === Be.EXTENSIBLE) {
        s.skip(6);
        const f = O(s, 16);
        n = f[0] | f[1] << 8;
      }
    }
    (n === Be.MULAW || n === Be.ALAW) && (l = 8), this.audioInfo = {
      format: n,
      numberOfChannels: a,
      sampleRate: o,
      sampleSizeInBytes: Math.ceil(l / 8),
      blockSizeInBytes: c
    };
  }
  async parseListChunk(e, t, i) {
    let s = this.reader.requestSlice(e, t);
    if (s instanceof Promise && (s = await s), !s)
      return;
    const n = te(s, 4);
    if (n !== "INFO" && n !== "INF0")
      return;
    let a = s.filePos;
    for (; a <= e + t - 8; ) {
      s.filePos = a;
      const o = te(s, 4), c = Qe(s, i), l = O(s, c);
      let u = 0;
      for (let h = 0; h < l.length && l[h] !== 0; h++)
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
            const h = d.split("/"), f = Number.parseInt(h[0], 10), p = h[1] && Number.parseInt(h[1], 10);
            Number.isInteger(f) && f > 0 && (this.metadataTags.trackNumber ??= f), p && Number.isInteger(p) && p > 0 && (this.metadataTags.tracksTotal ??= p);
          }
          break;
        case "ICRD":
        case "IDIT":
          {
            const h = new Date(d);
            Number.isNaN(h.getTime()) || (this.metadataTags.date ??= h);
          }
          break;
        case "YEAR":
          {
            const h = Number.parseInt(d, 10);
            Number.isInteger(h) && h > 0 && (this.metadataTags.date ??= new Date(h, 0, 1));
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
    const s = mr(i);
    if (s) {
      const n = i.slice(e + 10, s.size);
      js(n, s, this.metadataTags);
    }
  }
  getCodec() {
    if (m(this.audioInfo), this.audioInfo.format === Be.MULAW)
      return "ulaw";
    if (this.audioInfo.format === Be.ALAW)
      return "alaw";
    if (this.audioInfo.format === Be.PCM) {
      if (this.audioInfo.sampleSizeInBytes === 1)
        return "pcm-u8";
      if (this.audioInfo.sampleSizeInBytes === 2)
        return "pcm-s16";
      if (this.audioInfo.sampleSizeInBytes === 3)
        return "pcm-s24";
      if (this.audioInfo.sampleSizeInBytes === 4)
        return "pcm-s32";
    }
    return this.audioInfo.format === Be.IEEE_FLOAT && this.audioInfo.sampleSizeInBytes === 4 ? "pcm-f32" : null;
  }
  async getMimeType() {
    return "audio/wav";
  }
  async computeDuration() {
    await this.readMetadata();
    const e = this.tracks[0];
    return m(e), e.computeDuration();
  }
  async getTracks() {
    return await this.readMetadata(), this.tracks;
  }
  async getMetadataTags() {
    return await this.readMetadata(), this.metadataTags;
  }
}
const mt = 2048;
class ro {
  constructor(e) {
    this.demuxer = e;
  }
  getId() {
    return 1;
  }
  getCodec() {
    return this.demuxer.getCodec();
  }
  getInternalCodecId() {
    return m(this.demuxer.audioInfo), this.demuxer.audioInfo.format;
  }
  async getDecoderConfig() {
    const e = this.demuxer.getCodec();
    return e ? (m(this.demuxer.audioInfo), {
      codec: e,
      numberOfChannels: this.demuxer.audioInfo.numberOfChannels,
      sampleRate: this.demuxer.audioInfo.sampleRate
    }) : null;
  }
  async computeDuration() {
    const e = await this.getPacket(1 / 0, { metadataOnly: !0 });
    return (e?.timestamp ?? 0) + (e?.duration ?? 0);
  }
  getNumberOfChannels() {
    return m(this.demuxer.audioInfo), this.demuxer.audioInfo.numberOfChannels;
  }
  getSampleRate() {
    return m(this.demuxer.audioInfo), this.demuxer.audioInfo.sampleRate;
  }
  getTimeResolution() {
    return m(this.demuxer.audioInfo), this.demuxer.audioInfo.sampleRate;
  }
  getName() {
    return null;
  }
  getLanguageCode() {
    return de;
  }
  getDisposition() {
    return {
      ...Xe
    };
  }
  async getFirstTimestamp() {
    return 0;
  }
  async getPacketAtIndex(e, t) {
    m(this.demuxer.audioInfo);
    const i = e * mt * this.demuxer.audioInfo.blockSizeInBytes;
    if (i >= this.demuxer.dataSize)
      return null;
    const s = Math.min(mt * this.demuxer.audioInfo.blockSizeInBytes, this.demuxer.dataSize - i);
    if (this.demuxer.reader.fileSize === null) {
      let c = this.demuxer.reader.requestSlice(this.demuxer.dataStart + i, s);
      if (c instanceof Promise && (c = await c), !c)
        return null;
    }
    let n;
    if (t.metadataOnly)
      n = fe;
    else {
      let c = this.demuxer.reader.requestSlice(this.demuxer.dataStart + i, s);
      c instanceof Promise && (c = await c), m(c), n = O(c, s);
    }
    const a = e * mt / this.demuxer.audioInfo.sampleRate, o = s / this.demuxer.audioInfo.blockSizeInBytes / this.demuxer.audioInfo.sampleRate;
    return this.demuxer.lastKnownPacketIndex = Math.max(e, a), new q(n, "key", a, o, e, s);
  }
  getFirstPacket(e) {
    return this.getPacketAtIndex(0, e);
  }
  async getPacket(e, t) {
    m(this.demuxer.audioInfo);
    const i = Math.floor(Math.min(e * this.demuxer.audioInfo.sampleRate / mt, (this.demuxer.dataSize - 1) / (mt * this.demuxer.audioInfo.blockSizeInBytes))), s = await this.getPacketAtIndex(i, t);
    if (s)
      return s;
    if (i === 0)
      return null;
    m(this.demuxer.reader.fileSize === null);
    let n = await this.getPacketAtIndex(this.demuxer.lastKnownPacketIndex, t);
    for (; n; ) {
      const a = await this.getNextPacket(n, t);
      if (!a)
        break;
      n = a;
    }
    return n;
  }
  getNextPacket(e, t) {
    m(this.demuxer.audioInfo);
    const i = Math.round(e.timestamp * this.demuxer.audioInfo.sampleRate / mt);
    return this.getPacketAtIndex(i + 1, t);
  }
  getKeyPacket(e, t) {
    return this.getPacket(e, t);
  }
  getNextKeyPacket(e, t) {
    return this.getNextPacket(e, t);
  }
}
const pr = 7, at = 9, ct = (r) => {
  const e = r.filePos, t = O(r, 9), i = new Q(t);
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
  let h = null;
  return a === 1 ? r.filePos -= 2 : h = i.readBits(16), {
    objectType: o,
    samplingFrequencyIndex: c,
    channelConfiguration: l,
    frameLength: u,
    numberOfAacFrames: d,
    crcCheck: h,
    startPos: e
  };
};
const gr = 1024;
class io extends Ze {
  constructor(e) {
    super(e), this.metadataPromise = null, this.firstFrameHeader = null, this.loadedSamples = [], this.tracks = [], this.readingMutex = new ut(), this.lastSampleLoaded = !1, this.lastLoadedPos = 0, this.nextTimestampInSamples = 0, this.reader = e._reader;
  }
  async readMetadata() {
    return this.metadataPromise ??= (async () => {
      for (; !this.firstFrameHeader && !this.lastSampleLoaded; )
        await this.advanceReader();
      m(this.firstFrameHeader), this.tracks = [new Fe(this.input, new so(this))];
    })();
  }
  async advanceReader() {
    let e = this.reader.requestSliceRange(this.lastLoadedPos, pr, at);
    if (e instanceof Promise && (e = await e), !e) {
      this.lastSampleLoaded = !0;
      return;
    }
    const t = ct(e);
    if (!t) {
      this.lastSampleLoaded = !0;
      return;
    }
    if (this.reader.fileSize !== null && t.startPos + t.frameLength > this.reader.fileSize) {
      this.lastSampleLoaded = !0;
      return;
    }
    this.firstFrameHeader || (this.firstFrameHeader = t);
    const i = ot[t.samplingFrequencyIndex];
    m(i !== void 0);
    const s = gr / i, n = {
      timestamp: this.nextTimestampInSamples / i,
      duration: s,
      dataStart: t.startPos,
      dataSize: t.frameLength
    };
    this.loadedSamples.push(n), this.nextTimestampInSamples += gr, this.lastLoadedPos = t.startPos + t.frameLength;
  }
  async getMimeType() {
    return "audio/aac";
  }
  async getTracks() {
    return await this.readMetadata(), this.tracks;
  }
  async computeDuration() {
    await this.readMetadata();
    const e = this.tracks[0];
    return m(e), e.computeDuration();
  }
  async getMetadataTags() {
    return {};
  }
}
class so {
  constructor(e) {
    this.demuxer = e;
  }
  getId() {
    return 1;
  }
  async getFirstTimestamp() {
    return 0;
  }
  getTimeResolution() {
    return this.getSampleRate() / gr;
  }
  async computeDuration() {
    const e = await this.getPacket(1 / 0, { metadataOnly: !0 });
    return (e?.timestamp ?? 0) + (e?.duration ?? 0);
  }
  getName() {
    return null;
  }
  getLanguageCode() {
    return de;
  }
  getCodec() {
    return "aac";
  }
  getInternalCodecId() {
    return m(this.demuxer.firstFrameHeader), this.demuxer.firstFrameHeader.objectType;
  }
  getNumberOfChannels() {
    m(this.demuxer.firstFrameHeader);
    const e = er[this.demuxer.firstFrameHeader.channelConfiguration];
    return m(e !== void 0), e;
  }
  getSampleRate() {
    m(this.demuxer.firstFrameHeader);
    const e = ot[this.demuxer.firstFrameHeader.samplingFrequencyIndex];
    return m(e !== void 0), e;
  }
  getDisposition() {
    return {
      ...Xe
    };
  }
  async getDecoderConfig() {
    return m(this.demuxer.firstFrameHeader), {
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
    let s;
    if (t.metadataOnly)
      s = fe;
    else {
      let n = this.demuxer.reader.requestSlice(i.dataStart, i.dataSize);
      if (n instanceof Promise && (n = await n), !n)
        return null;
      s = O(n, i.dataSize);
    }
    return new q(s, "key", i.timestamp, i.duration, e, i.dataSize);
  }
  getFirstPacket(e) {
    return this.getPacketAtIndex(0, e);
  }
  async getNextPacket(e, t) {
    const i = await this.demuxer.readingMutex.acquire();
    try {
      const s = Jt(this.demuxer.loadedSamples, e.timestamp, (a) => a.timestamp);
      if (s === -1)
        throw new Error("Packet was not created from this track.");
      const n = s + 1;
      for (; n >= this.demuxer.loadedSamples.length && !this.demuxer.lastSampleLoaded; )
        await this.demuxer.advanceReader();
      return this.getPacketAtIndex(n, t);
    } finally {
      i();
    }
  }
  async getPacket(e, t) {
    const i = await this.demuxer.readingMutex.acquire();
    try {
      for (; ; ) {
        const s = L(this.demuxer.loadedSamples, e, (n) => n.timestamp);
        if (s === -1 && this.demuxer.loadedSamples.length > 0)
          return null;
        if (this.demuxer.lastSampleLoaded)
          return this.getPacketAtIndex(s, t);
        if (s >= 0 && s + 1 < this.demuxer.loadedSamples.length)
          return this.getPacketAtIndex(s, t);
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
const no = (r) => r === 0 ? null : r === 1 ? 192 : r >= 2 && r <= 5 ? 144 * 2 ** r : r === 6 ? "uncommon-u8" : r === 7 ? "uncommon-u16" : r >= 8 && r <= 15 ? 2 ** r : null, ao = (r, e) => {
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
}, oo = (r) => {
  let e = 0;
  const t = new Q(O(r, 1));
  for (; t.readBits(1) === 1; )
    e++;
  if (e === 0)
    return t.readBits(7);
  const i = [], s = e - 1, n = new Q(O(r, s)), a = 8 - e - 1;
  for (let c = 0; c < a; c++)
    i.unshift(t.readBits(1));
  for (let c = 0; c < s; c++)
    for (let l = 0; l < 8; l++) {
      const u = n.readBits(1);
      l < 2 || i.unshift(u);
    }
  return i.reduce((c, l, u) => c | l << u, 0);
}, co = (r, e) => {
  if (e === "uncommon-u16")
    return J(r) + 1;
  if (e === "uncommon-u8")
    return A(r) + 1;
  if (typeof e == "number")
    return e;
  Ge(e), m(!1);
}, lo = (r, e) => e === "uncommon-u16" ? J(r) : e === "uncommon-u16-10" ? J(r) * 10 : e === "uncommon-u8" ? A(r) : typeof e == "number" ? e : null, uo = (r) => {
  let t = 0;
  for (const i of r) {
    t ^= i;
    for (let s = 0; s < 8; s++)
      (t & 128) !== 0 ? t = t << 1 ^ 7 : t <<= 1, t &= 255;
  }
  return t;
};
class ho extends Ze {
  constructor(e) {
    super(e), this.loadedSamples = [], this.metadataPromise = null, this.track = null, this.metadataTags = {}, this.audioInfo = null, this.lastLoadedPos = null, this.blockingBit = null, this.readingMutex = new ut(), this.lastSampleLoaded = !1, this.reader = e._reader;
  }
  async computeDuration() {
    return await this.readMetadata(), m(this.track), this.track.computeDuration();
  }
  async getMetadataTags() {
    return await this.readMetadata(), this.metadataTags;
  }
  async getTracks() {
    return await this.readMetadata(), m(this.track), [this.track];
  }
  async getMimeType() {
    return "audio/flac";
  }
  async readMetadata() {
    let e = 4;
    return this.metadataPromise ??= (async () => {
      for (; this.reader.fileSize === null || e < this.reader.fileSize; ) {
        let t = this.reader.requestSlice(e, 4);
        if (t instanceof Promise && (t = await t), e += 4, t === null)
          throw new Error(`Metadata block at position ${e} is too small! Corrupted file.`);
        m(t);
        const i = A(t), s = wt(t), n = (i & 128) !== 0;
        switch (i & 127) {
          case _t.STREAMINFO: {
            let o = this.reader.requestSlice(e, s);
            if (o instanceof Promise && (o = await o), m(o), o === null)
              throw new Error(`StreamInfo block at position ${e} is too small! Corrupted file.`);
            const c = O(o, 34), l = new Q(c), u = l.readBits(16), d = l.readBits(16), h = l.readBits(24), f = l.readBits(24), p = l.readBits(20), g = l.readBits(3) + 1;
            l.readBits(5);
            const k = l.readBits(36);
            l.skipBits(128);
            const w = new Uint8Array(42);
            w.set(new Uint8Array([102, 76, 97, 67]), 0), w.set(new Uint8Array([128, 0, 0, 34]), 4), w.set(c, 8), this.audioInfo = {
              numberOfChannels: g,
              sampleRate: p,
              totalSamples: k,
              minimumBlockSize: u,
              maximumBlockSize: d,
              minimumFrameSize: h,
              maximumFrameSize: f,
              description: w
            }, this.track = new Fe(this.input, new fo(this));
            break;
          }
          case _t.VORBIS_COMMENT: {
            let o = this.reader.requestSlice(e, s);
            o instanceof Promise && (o = await o), m(o), $r(O(o, s), this.metadataTags);
            break;
          }
          case _t.PICTURE: {
            let o = this.reader.requestSlice(e, s);
            o instanceof Promise && (o = await o), m(o);
            const c = _(o), l = _(o), u = ge.decode(O(o, l)), d = _(o), h = ge.decode(O(o, d));
            o.skip(16);
            const f = _(o), p = O(o, f);
            this.metadataTags.images ??= [], this.metadataTags.images.push({
              data: p,
              mimeType: u,
              // https://www.rfc-editor.org/rfc/rfc9639.html#table13
              kind: c === 3 ? "coverFront" : c === 4 ? "coverBack" : "unknown",
              description: h
            });
            break;
          }
        }
        if (e += s, n) {
          this.lastLoadedPos = e;
          break;
        }
      }
    })();
  }
  async readNextFlacFrame({ startPos: e, isFirstPacket: t }) {
    m(this.audioInfo);
    const i = 6, n = this.audioInfo.maximumFrameSize + 16, a = await this.reader.requestSliceRange(e, this.audioInfo.minimumFrameSize, n);
    if (!a)
      return null;
    const o = this.readFlacFrameHeader({
      slice: a,
      isFirstPacket: t
    });
    if (!o)
      return null;
    for (a.filePos = e + this.audioInfo.minimumFrameSize; ; ) {
      if (a.filePos > a.end - i)
        return {
          num: o.num,
          blockSize: o.blockSize,
          sampleRate: o.sampleRate,
          size: a.end - e,
          isLastFrame: !0
        };
      if (A(a) === 255) {
        const l = a.filePos, u = A(a), d = this.blockingBit === 1 ? 249 : 248;
        if (u !== d) {
          a.filePos = l;
          continue;
        }
        a.skip(-2);
        const h = a.filePos - e, f = this.readFlacFrameHeader({
          slice: a,
          isFirstPacket: !1
        });
        if (!f) {
          a.filePos = l;
          continue;
        }
        if (this.blockingBit === 0) {
          if (f.num - o.num !== 1) {
            a.filePos = l;
            continue;
          }
        } else if (f.num - o.num !== o.blockSize) {
          a.filePos = l;
          continue;
        }
        return {
          num: o.num,
          blockSize: o.blockSize,
          sampleRate: o.sampleRate,
          size: h,
          isLastFrame: !1
        };
      }
    }
  }
  readFlacFrameHeader({ slice: e, isFirstPacket: t }) {
    const i = e.filePos, s = O(e, 4), n = new Q(s);
    if (n.readBits(15) !== 32764)
      return null;
    if (this.blockingBit === null) {
      m(t);
      const k = n.readBits(1);
      this.blockingBit = k;
    } else if (this.blockingBit === 1) {
      if (m(!t), n.readBits(1) !== 1)
        return null;
    } else if (this.blockingBit === 0) {
      if (m(!t), n.readBits(1) !== 0)
        return null;
    } else
      throw new Error("Invalid blocking bit");
    const o = no(n.readBits(4));
    if (!o)
      return null;
    m(this.audioInfo);
    const c = ao(n.readBits(4), this.audioInfo.sampleRate);
    if (!c || (n.readBits(4), n.readBits(3), n.readBits(1) !== 0))
      return null;
    const u = oo(e), d = co(e, o), h = lo(e, c);
    if (h === null || h !== this.audioInfo.sampleRate)
      return null;
    const f = e.filePos - i, p = A(e);
    e.skip(-f), e.skip(-1);
    const g = uo(O(e, f));
    return p !== g ? null : { num: u, blockSize: d, sampleRate: h };
  }
  async advanceReader() {
    await this.readMetadata(), m(this.lastLoadedPos !== null), m(this.audioInfo);
    const e = this.lastLoadedPos, t = await this.readNextFlacFrame({
      startPos: e,
      isFirstPacket: this.loadedSamples.length === 0
    });
    if (!t) {
      this.lastSampleLoaded = !0;
      return;
    }
    const i = this.loadedSamples[this.loadedSamples.length - 1], n = {
      blockOffset: i ? i.blockOffset + i.blockSize : 0,
      blockSize: t.blockSize,
      byteOffset: e,
      byteSize: t.size
    };
    if (this.lastLoadedPos = this.lastLoadedPos + t.size, this.loadedSamples.push(n), t.isLastFrame) {
      this.lastSampleLoaded = !0;
      return;
    }
  }
}
class fo {
  constructor(e) {
    this.demuxer = e;
  }
  getId() {
    return 1;
  }
  getCodec() {
    return "flac";
  }
  getInternalCodecId() {
    return null;
  }
  getNumberOfChannels() {
    return m(this.demuxer.audioInfo), this.demuxer.audioInfo.numberOfChannels;
  }
  async computeDuration() {
    const e = await this.getPacket(1 / 0, { metadataOnly: !0 });
    return (e?.timestamp ?? 0) + (e?.duration ?? 0);
  }
  getSampleRate() {
    return m(this.demuxer.audioInfo), this.demuxer.audioInfo.sampleRate;
  }
  getName() {
    return null;
  }
  getLanguageCode() {
    return de;
  }
  getTimeResolution() {
    return m(this.demuxer.audioInfo), this.demuxer.audioInfo.sampleRate;
  }
  getDisposition() {
    return {
      ...Xe
    };
  }
  async getFirstTimestamp() {
    return 0;
  }
  async getDecoderConfig() {
    return m(this.demuxer.audioInfo), {
      codec: "flac",
      numberOfChannels: this.demuxer.audioInfo.numberOfChannels,
      sampleRate: this.demuxer.audioInfo.sampleRate,
      description: this.demuxer.audioInfo.description
    };
  }
  async getPacket(e, t) {
    if (m(this.demuxer.audioInfo), e < 0)
      throw new Error("Timestamp cannot be negative");
    const i = await this.demuxer.readingMutex.acquire();
    try {
      for (; ; ) {
        const s = L(this.demuxer.loadedSamples, e, (c) => c.blockOffset / this.demuxer.audioInfo.sampleRate);
        if (s === -1) {
          await this.demuxer.advanceReader();
          continue;
        }
        const n = this.demuxer.loadedSamples[s], a = n.blockOffset / this.demuxer.audioInfo.sampleRate, o = n.blockSize / this.demuxer.audioInfo.sampleRate;
        if (a + o <= e) {
          if (this.demuxer.lastSampleLoaded)
            return this.getPacketAtIndex(this.demuxer.loadedSamples.length - 1, t);
          await this.demuxer.advanceReader();
          continue;
        }
        return this.getPacketAtIndex(s, t);
      }
    } finally {
      i();
    }
  }
  async getNextPacket(e, t) {
    const i = await this.demuxer.readingMutex.acquire();
    try {
      const s = e.sequenceNumber + 1;
      if (this.demuxer.lastSampleLoaded && s >= this.demuxer.loadedSamples.length)
        return null;
      for (; s >= this.demuxer.loadedSamples.length && !this.demuxer.lastSampleLoaded; )
        await this.demuxer.advanceReader();
      return this.getPacketAtIndex(s, t);
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
    let s;
    if (t.metadataOnly)
      s = fe;
    else {
      let o = this.demuxer.reader.requestSlice(i.byteOffset, i.byteSize);
      if (o instanceof Promise && (o = await o), !o)
        return null;
      s = O(o, i.byteSize);
    }
    m(this.demuxer.audioInfo);
    const n = i.blockOffset / this.demuxer.audioInfo.sampleRate, a = i.blockSize / this.demuxer.audioInfo.sampleRate;
    return new q(s, "key", n, a, e, i.byteSize);
  }
  async getFirstPacket(e) {
    for (; this.demuxer.loadedSamples.length === 0 && !this.demuxer.lastSampleLoaded; )
      await this.demuxer.advanceReader();
    return this.getPacketAtIndex(0, e);
  }
}
const Re = 9e4, le = 188, mo = (r) => {
  let e = "video/MP2T";
  const t = [...new Set(r.filter(Boolean))];
  return t.length > 0 && (e += `; codecs="${t.join(", ")}"`), e;
};
const kt = "No PES packet found where one was expected.";
class po extends Ze {
  constructor(e) {
    super(e), this.metadataPromise = null, this.elementaryStreams = [], this.tracks = [], this.packetOffset = 0, this.packetStride = -1, this.sectionEndPositions = [], this.reader = e._reader;
  }
  async readMetadata() {
    return this.metadataPromise ??= (async () => {
      const e = le + 16 + 1;
      let t = this.reader.requestSlice(0, e);
      t instanceof Promise && (t = await t), m(t);
      const i = O(t, e);
      if (i[0] === 71 && i[le] === 71)
        this.packetOffset = 0, this.packetStride = le;
      else if (i[0] === 71 && i[le + 16] === 71)
        this.packetOffset = 0, this.packetStride = le + 16;
      else if (i[4] === 71 && i[4 + le] === 71)
        this.packetOffset = 4, this.packetStride = le;
      else
        throw new Error("Unreachable.");
      let s = this.packetOffset, n = null, a = !1, o = !1;
      for (; ; ) {
        const c = await this.readSection(s, !0, !o);
        if (!c)
          break;
        const l = 3, u = 32;
        if (c.pid === 0 && !a) {
          const h = new Q(c.payload), f = h.readAlignedByte();
          h.skipBits(8 * f), h.skipBits(14);
          const p = h.readBits(10);
          for (h.skipBits(40); 8 * (p + l) - h.pos > u; ) {
            const g = h.readBits(16);
            if (h.skipBits(3), g !== 0) {
              if (n !== null)
                throw new Error("Only files with a single program are supported.");
              n = h.readBits(13);
            }
          }
          if (n === null)
            throw new Error("Program Association Table must link to a Program Map Table.");
          a = !0;
        } else if (c.pid === n && !o) {
          const h = new Q(c.payload), f = h.readAlignedByte();
          h.skipBits(8 * f), h.skipBits(12);
          const p = h.readBits(12);
          h.skipBits(43), h.readBits(13), h.skipBits(6);
          const g = h.readBits(10);
          for (h.skipBits(8 * g); 8 * (p + l) - h.pos > u; ) {
            const k = h.readBits(8);
            h.skipBits(3);
            const w = h.readBits(13);
            h.skipBits(6);
            const b = h.readBits(10);
            h.skipBits(8 * b);
            let y = null;
            switch (k) {
              case 3:
              case 4:
              case 15:
                y = {
                  type: "audio",
                  codec: k === 15 ? "aac" : "mp3",
                  aacCodecInfo: null,
                  numberOfChannels: -1,
                  sampleRate: -1
                };
                break;
              case 27:
              case 36:
                y = {
                  type: "video",
                  codec: k === 27 ? "avc" : "hevc",
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
                  reorderSize: -1
                };
                break;
            }
            y && this.elementaryStreams.push({
              demuxer: this,
              pid: w,
              streamType: k,
              initialized: !1,
              firstSection: null,
              info: y
            });
          }
          o = !0;
        } else {
          const h = this.elementaryStreams.find((f) => f.pid === c.pid);
          if (h && !h.initialized) {
            const f = xt(c);
            if (!f)
              throw new Error(`Couldn't read first PES packet for Elementary Stream with PID ${h.pid}`);
            if (h.firstSection = c, h.info.type === "video")
              if (h.info.codec === "avc") {
                if (h.info.avcCodecInfo = gi(f.data), !h.info.avcCodecInfo)
                  throw new Error("Invalid AVC video stream; could not extract AVCDecoderConfigurationRecord from first packet.");
                const p = h.info.avcCodecInfo.sequenceParameterSets[0];
                m(p);
                const g = ki(p);
                h.info.width = g.displayWidth, h.info.height = g.displayHeight, h.info.colorSpace = {
                  primaries: or[g.colourPrimaries],
                  transfer: cr[g.transferCharacteristics],
                  matrix: lr[g.matrixCoefficients],
                  fullRange: !!g.fullRangeFlag
                }, h.info.reorderSize = g.maxDecFrameBuffering, h.initialized = !0;
              } else if (h.info.codec === "hevc") {
                if (h.info.hevcCodecInfo = bi(f.data), !h.info.hevcCodecInfo)
                  throw new Error("Invalid HEVC video stream; could not extract HVCDecoderConfigurationRecord from first packet.");
                const g = h.info.hevcCodecInfo.arrays.find((w) => w.nalUnitType === ne.SPS_NUT).nalUnits[0];
                m(g);
                const k = Is(g);
                h.info.width = k.displayWidth, h.info.height = k.displayHeight, h.info.colorSpace = {
                  primaries: or[k.colourPrimaries],
                  transfer: cr[k.transferCharacteristics],
                  matrix: lr[k.matrixCoefficients],
                  fullRange: !!k.fullRangeFlag
                }, h.info.reorderSize = k.maxDecFrameBuffering, h.initialized = !0;
              } else
                throw new Error("Unhandled.");
            else if (h.info.codec === "aac") {
              const p = we.tempFromBytes(f.data), g = ct(p);
              if (!g)
                throw new Error("Invalid AAC audio stream; could not read ADTS frame header from first packet.");
              h.info.aacCodecInfo = {
                isMpeg2: !1,
                objectType: g.objectType
              }, h.info.numberOfChannels = er[g.channelConfiguration], h.info.sampleRate = ot[g.samplingFrequencyIndex], h.initialized = !0;
            } else if (h.info.codec === "mp3") {
              const p = _(we.tempFromBytes(f.data)), g = Ci(p, f.data.byteLength);
              if (!g.header)
                throw new Error("Invalid MP3 audio stream; could not read frame header from first packet.");
              h.info.numberOfChannels = g.header.channel === 3 ? 1 : 2, h.info.sampleRate = g.header.sampleRate, h.initialized = !0;
            } else
              throw new Error("Unhandled.");
          }
        }
        if (o && this.elementaryStreams.every((h) => h.initialized))
          break;
        m(c.endPos !== null), s = c.endPos;
      }
      for (const c of this.elementaryStreams)
        c.info.type === "video" ? this.tracks.push(new Bt(this.input, new go(c))) : this.tracks.push(new Fe(this.input, new ko(c)));
    })();
  }
  async getTracks() {
    return await this.readMetadata(), this.tracks;
  }
  async getMetadataTags() {
    return {};
  }
  async computeDuration() {
    const e = await this.getTracks(), t = await Promise.all(e.map((i) => i.computeDuration()));
    return Math.max(0, ...t);
  }
  async getMimeType() {
    await this.readMetadata();
    const e = await this.getTracks(), t = await Promise.all(e.map((i) => i.getCodecParameterString()));
    return mo(t);
  }
  async readSection(e, t, i = !1) {
    let s = e, n = e;
    const a = [];
    let o = 0, c = null, l = !0;
    for (; ; ) {
      const d = await this.readPacket(n);
      if (n += this.packetStride, !d)
        break;
      if (c) {
        if (d.pid !== c.pid) {
          if (i)
            break;
          continue;
        }
        if (d.payloadUnitStartIndicator === 1)
          break;
      } else {
        if (d.payloadUnitStartIndicator === 0)
          break;
        c = d;
      }
      const h = !!(d.adaptationFieldControl & 2), f = !!(d.adaptationFieldControl & 1);
      let p = 0;
      if (h && (p = 1 + d.body[0]), f && (p === 0 ? (a.push(d.body), o += d.body.byteLength) : (a.push(d.body.subarray(p)), o += d.body.byteLength - p)), s = n, !t && o >= 64) {
        l = !1;
        break;
      }
      if (Jt(this.sectionEndPositions, s, (k) => k) !== -1) {
        l = !1;
        break;
      }
    }
    if (l) {
      const d = L(this.sectionEndPositions, s, (h) => h);
      this.sectionEndPositions.splice(d + 1, 0, s);
    }
    if (!c)
      return null;
    let u;
    if (a.length === 1)
      u = a[0];
    else {
      const d = a.reduce((f, p) => f + p.length, 0);
      u = new Uint8Array(d);
      let h = 0;
      for (const f of a)
        u.set(f, h), h += f.length;
    }
    return {
      startPos: e,
      endPos: t ? s : null,
      pid: c.pid,
      payload: u
    };
  }
  async readPacketHeader(e) {
    let t = this.reader.requestSlice(e, 4);
    if (t instanceof Promise && (t = await t), !t)
      return null;
    if (A(t) !== 71)
      throw new Error("Invalid TS packet sync byte. Likely an internal bug, please report this file.");
    const s = J(t), n = s >> 14 & 1, a = s & 8191, c = A(t) >> 4 & 3;
    return {
      payloadUnitStartIndicator: n,
      pid: a,
      adaptationFieldControl: c
    };
  }
  async readPacket(e) {
    let t = this.reader.requestSlice(e, le);
    if (t instanceof Promise && (t = await t), !t)
      return null;
    const i = O(t, le);
    if (i[0] !== 71)
      throw new Error("Invalid TS packet sync byte. Likely an internal bug, please report this file.");
    const n = (i[1] << 8) + i[2], a = n >> 14 & 1, o = n & 8191, l = i[3] >> 4 & 3;
    return {
      payloadUnitStartIndicator: a,
      pid: o,
      adaptationFieldControl: l,
      body: i.subarray(4)
    };
  }
}
const bt = (r) => {
  const e = new Q(r.payload);
  if (e.readBits(24) !== 1)
    return null;
  const i = e.readBits(8);
  if (e.skipBits(16), i === 188 || i === 190 || i === 191 || i === 240 || i === 241 || i === 255 || i === 242 || i === 248)
    return null;
  e.skipBits(8);
  const s = e.readBits(2);
  e.skipBits(14);
  let n = 0;
  if (s === 2 || s === 3)
    e.skipBits(4), n += e.readBits(3) * (1 << 30), e.skipBits(1), n += e.readBits(15) * 32768, e.skipBits(1), n += e.readBits(15);
  else
    throw new Error("PES packets without PTS are not currently supported. If you think this file should be supported, please report it.");
  return {
    sectionStartPos: r.startPos,
    sectionEndPos: r.endPos,
    pts: n
  };
}, xt = (r) => {
  m(r.endPos !== null);
  const e = bt(r);
  if (!e)
    return null;
  const t = new Q(r.payload);
  t.skipBits(32);
  const i = t.readBits(16), s = 6;
  t.skipBits(16);
  const n = t.readBits(8), a = t.pos + 8 * n;
  t.pos = a;
  const o = a / 8;
  m(Number.isInteger(o));
  const c = r.payload.subarray(
    o,
    // "A value of 0 indicates that the PES packet length is neither specified nor bounded and is allowed only in
    // PES packets whose payload consists of bytes from a video elementary stream contained in
    // transport stream packets."
    i > 0 ? s + i : r.payload.byteLength
  );
  return {
    ...e,
    data: c
  };
};
class Ks {
  constructor(e) {
    this.elementaryStream = e, this.referencePesPackets = [], this.endReferencePesPacketAdded = !1, this.packetBuffers = /* @__PURE__ */ new WeakMap(), this.packetSectionStarts = /* @__PURE__ */ new WeakMap(), this.mutex = new ut();
  }
  getId() {
    return this.elementaryStream.pid;
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
    return de;
  }
  getDisposition() {
    return Xe;
  }
  getTimeResolution() {
    return Re;
  }
  async computeDuration() {
    const e = await this.getPacket(1 / 0, { metadataOnly: !0 });
    return (e?.timestamp ?? 0) + (e?.duration ?? 0);
  }
  async getFirstTimestamp() {
    return (await this.getFirstPacket({ metadataOnly: !0 }))?.timestamp ?? 0;
  }
  createEncodedPacket(e, t, i) {
    return new q(i.metadataOnly ? fe : e.data, this.getPacketType(e.data), e.pts / Re, Math.max(t / Re, 0), e.sequenceNumber, e.data.byteLength);
  }
  maybeInsertReferencePacket(e, t, i) {
    if (i && this.mutex.pending > 0)
      return;
    const s = L(this.referencePesPackets, e.pts, (n) => n.pts);
    if (s >= 0) {
      const n = this.referencePesPackets[s];
      if (e.sectionStartPos <= n.sectionStartPos || !t && e.pts - n.pts < Re / 2)
        return !1;
      if (s < this.referencePesPackets.length - 1) {
        const a = this.referencePesPackets[s + 1];
        if (a.sectionStartPos < e.sectionStartPos || !t && a.pts - e.pts < Re / 2)
          return !1;
      }
    }
    return this.referencePesPackets.splice(s + 1, 0, e), !0;
  }
  async getFirstPacket(e) {
    const t = this.elementaryStream.firstSection;
    m(t);
    const i = xt(t);
    m(i);
    const s = new Ct(this, i, !0), n = new ir(this, s), a = await n.readNext();
    if (!a)
      return null;
    const o = this.createEncodedPacket(a.packet, a.duration, e);
    return this.packetBuffers.set(o, n), this.packetSectionStarts.set(o, a.packet.sectionStartPos), o;
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
    const s = this.packetSectionStarts.get(e);
    if (s === void 0)
      throw new Error("Packet was not created from this track.");
    const a = await this.elementaryStream.demuxer.readSection(s, !0);
    m(a);
    const o = xt(a);
    m(o);
    const c = new Ct(this, o, !0);
    i = new ir(this, c);
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
   * of binary search and linear refinement.
   */
  async doPacketLookup(e, t, i) {
    const s = qt(e * Re), n = this.elementaryStream.demuxer, a = n.reader, o = await this.mutex.acquire();
    let c;
    try {
      if (this.referencePesPackets.length === 0) {
        const b = this.elementaryStream.firstSection;
        m(b);
        const y = bt(b);
        m(y), this.maybeInsertReferencePacket(y, !1, !1), m(this.referencePesPackets.length === 1);
      }
      let k = L(this.referencePesPackets, s, (b) => b.pts);
      if (k === -1)
        return null;
      if (a.fileSize !== null && k === this.referencePesPackets.length - 1 && !this.endReferencePesPacketAdded) {
        let b = a.fileSize - n.packetStride + n.packetOffset, y = await n.readPacketHeader(b);
        if (!y)
          return null;
        for (; y.pid !== this.elementaryStream.pid || y.payloadUnitStartIndicator === 0; ) {
          b -= n.packetStride;
          const S = await n.readPacketHeader(b);
          if (!S)
            return null;
          y = S;
        }
        const T = await n.readSection(b, !1);
        m(T);
        const x = bt(T);
        if (!x)
          throw new Error(kt);
        this.maybeInsertReferencePacket(x, !0, !1), this.endReferencePesPacketAdded = !0;
      }
      for (k = L(this.referencePesPackets, s, (b) => b.pts), m(k !== -1); a.fileSize !== null; ) {
        const b = this.referencePesPackets[k], y = this.referencePesPackets[k + 1];
        if (s - b.pts < Re || !y)
          break;
        let x = ps((b.sectionStartPos + y.sectionStartPos) / 2, n.packetStride) + n.packetOffset, S = await n.readPacketHeader(x);
        for (m(S); x < y.sectionStartPos && (S.pid !== this.elementaryStream.pid || S.payloadUnitStartIndicator === 0); ) {
          x += n.packetStride;
          const M = await n.readPacketHeader(x);
          if (!M)
            return null;
          S = M;
        }
        if (x >= y.sectionStartPos)
          break;
        const E = await n.readSection(x, !1);
        m(E);
        const C = bt(E);
        if (!C)
          throw new Error(kt);
        if (!this.maybeInsertReferencePacket(C, !1, !1))
          break;
        C.pts <= s && k++;
      }
      c = this.referencePesPackets[k], m(c.pts <= s);
    } finally {
      o();
    }
    o();
    e: for (; ; ) {
      let k = c.sectionStartPos + n.packetStride;
      for (; ; ) {
        const y = await n.readPacketHeader(k);
        if (!y)
          break e;
        if (y.pid === this.elementaryStream.pid && y.payloadUnitStartIndicator === 1)
          break;
        k += n.packetStride;
      }
      const w = await n.readSection(k, !1);
      if (!w)
        break;
      const b = bt(w);
      if (!b)
        throw new Error(kt);
      if (b.pts > s)
        break;
      c = b, a.fileSize === null && this.maybeInsertReferencePacket(b, !1, !0);
    }
    const l = this.getReorderSize();
    for (let k = 0; k < l; k++) {
      let w = c.sectionStartPos - n.packetStride;
      for (; ; ) {
        const b = await n.readPacketHeader(w);
        if (!b)
          break;
        if (b.pid === this.elementaryStream.pid && b.payloadUnitStartIndicator === 1) {
          const y = await n.readSection(w, !1);
          m(y);
          const T = bt(y);
          if (!T)
            throw new Error(kt);
          c = T;
          break;
        }
        w -= n.packetStride;
      }
    }
    const u = await n.readSection(c.sectionStartPos, !0);
    m(u);
    const d = xt(u);
    m(d);
    const h = new Ct(this, d, !0), f = new ir(this, h);
    for (; !((K(f.presentationOrderPackets)?.pts ?? -1 / 0) >= s || !await f.readNextDecodeOrderPacket()); )
      ;
    const p = di(f.presentationOrderPackets, (k) => k.pts <= s && (!t || this.getPacketType(k.data) === "key"));
    if (p !== -1) {
      const k = f.presentationOrderPackets[p], w = p === 0 ? 0 : k.pts - f.presentationOrderPackets[p - 1].pts;
      for (; f.decodeOrderPackets[0] !== k; )
        f.decodeOrderPackets.shift();
      f.lastDuration = w;
      const b = await f.readNext();
      m(b);
      const y = this.createEncodedPacket(b.packet, b.duration, i);
      return this.packetBuffers.set(y, f), this.packetSectionStarts.set(y, b.packet.sectionStartPos), y;
    }
    if (!t)
      return null;
    let g = c.sectionStartPos;
    for (; ; ) {
      g -= n.packetStride;
      const k = await n.readPacketHeader(g);
      if (!k)
        return null;
      if (k.pid !== this.elementaryStream.pid || k.payloadUnitStartIndicator !== 1)
        continue;
      const w = await n.readSection(g, !0);
      m(w);
      const b = xt(w);
      if (!b)
        throw new Error(kt);
      const y = new Ct(this, b, !1);
      if (await this.markNextPacket(y), !y.suppliedPacket || this.getPacketType(y.suppliedPacket.data) !== "key")
        continue;
      y.uncapped = !0;
      const T = new ir(this, y), x = await T.readNext();
      m(x);
      const S = this.createEncodedPacket(x.packet, x.duration, i);
      return this.packetBuffers.set(S, T), this.packetSectionStarts.set(S, x.packet.sectionStartPos), S;
    }
  }
}
class go extends Ks {
  constructor(e) {
    super(e), this.elementaryStream = e, this.decoderConfig = {
      codec: fi({
        width: this.elementaryStream.info.width,
        height: this.elementaryStream.info.height,
        codec: this.elementaryStream.info.codec,
        codecDescription: null,
        colorSpace: this.elementaryStream.info.colorSpace,
        avcType: 1,
        avcCodecInfo: this.elementaryStream.info.avcCodecInfo,
        hevcCodecInfo: this.elementaryStream.info.hevcCodecInfo,
        vp9CodecInfo: null,
        av1CodecInfo: null
      }),
      codedWidth: this.elementaryStream.info.width,
      codedHeight: this.elementaryStream.info.height,
      colorSpace: this.elementaryStream.info.colorSpace
    };
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
    return this.decoderConfig;
  }
  getPacketType(e) {
    return wi(this.elementaryStream.info.codec, this.decoderConfig, e) ?? "key";
  }
  getReorderSize() {
    return this.elementaryStream.info.reorderSize;
  }
  async markNextPacket(e) {
    m(!e.suppliedPacket);
    const t = this.elementaryStream.info.codec, i = 1024;
    if (t !== "avc" && t !== "hevc")
      throw new Error("Unhandled.");
    let s = null;
    for (; ; ) {
      let n = e.ensureBuffered(i);
      if (n instanceof Promise && (n = await n), n === 0)
        break;
      const a = e.currentPos, o = e.readBytes(n), c = o.byteLength;
      let l = 0;
      for (; l < c; ) {
        const u = o.indexOf(0, l);
        if (u === -1 || u >= c)
          break;
        l = u;
        const d = a + l;
        if (l + 4 >= c) {
          e.seekTo(d);
          break;
        }
        const h = o[l + 1], f = o[l + 2], p = o[l + 3];
        let g = 0, k = null;
        if (h === 0 && f === 0 && p === 1 ? (g = 4, k = o[l + 4]) : h === 0 && f === 1 && (g = 3, k = p), g === 0) {
          l++;
          continue;
        }
        const w = d;
        if (s === null) {
          s = w, l += g;
          continue;
        }
        if (k !== null) {
          const b = t === "avc" ? Tr(k) : $t(k);
          if (t === "avc" ? b === ve.AUD : b === ne.AUD_NUT) {
            const T = w - s;
            return e.seekTo(s), e.supplyPacket(T, 0);
          }
        }
        l += g;
      }
      if (n < i)
        break;
    }
    if (s !== null) {
      const n = e.endPos - s;
      return e.seekTo(s), e.supplyPacket(n, 0);
    }
  }
}
class ko extends Ks {
  constructor(e) {
    super(e), this.elementaryStream = e;
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
    return {
      codec: mi({
        codec: this.elementaryStream.info.codec,
        codecDescription: null,
        aacCodecInfo: this.elementaryStream.info.aacCodecInfo
      }),
      numberOfChannels: this.elementaryStream.info.numberOfChannels,
      sampleRate: this.elementaryStream.info.sampleRate
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getPacketType(e) {
    return "key";
  }
  getReorderSize() {
    return 1;
  }
  async markNextPacket(e) {
    m(!e.suppliedPacket);
    const t = this.elementaryStream.info.codec, i = 128;
    for (; ; ) {
      let s = e.ensureBuffered(i);
      s instanceof Promise && (s = await s);
      const n = e.currentPos;
      for (; e.currentPos - n < s; ) {
        const a = e.readU8();
        if (t === "aac") {
          if (a !== 255)
            continue;
          e.skip(-1);
          const o = e.currentPos;
          let c = e.ensureBuffered(at);
          if (c instanceof Promise && (c = await c), c < at)
            return;
          const l = e.readBytes(at), u = ct(we.tempFromBytes(l));
          if (u) {
            e.seekTo(o);
            let d = e.ensureBuffered(u.frameLength);
            return d instanceof Promise && (d = await d), e.supplyPacket(d, Math.round(gr * Re / this.elementaryStream.info.sampleRate));
          } else
            e.seekTo(o + 1);
        } else if (t === "mp3") {
          if (a !== 255)
            continue;
          e.skip(-1);
          const o = e.currentPos;
          let c = e.ensureBuffered(Wt);
          if (c instanceof Promise && (c = await c), c < Wt)
            return;
          const l = e.readBytes(Wt), u = G(l).getUint32(0), d = Ci(u, null);
          if (d.header) {
            e.seekTo(o);
            let h = e.ensureBuffered(d.header.totalSize);
            h instanceof Promise && (h = await h);
            const f = d.header.audioSamplesInFrame * Re / this.elementaryStream.info.sampleRate;
            return e.supplyPacket(h, Math.round(f));
          } else
            e.seekTo(o + 1);
        } else
          throw new Error("Unhandled.");
      }
      if (s < i)
        break;
    }
  }
}
class Ct {
  constructor(e, t, i) {
    this.currentPos = 0, this.pesPackets = [], this.currentPesPacketIndex = 0, this.currentPesPacketPos = 0, this.endPos = 0, this.nextPts = 0, this.suppliedPacket = null, this.backing = e, this.pid = e.elementaryStream.pid, this.demuxer = e.elementaryStream.demuxer, this.startingPesPacket = t, this.uncapped = i;
  }
  clone() {
    const e = new Ct(this.backing, this.startingPesPacket, !0);
    return e.currentPos = this.currentPos, e.pesPackets = [...this.pesPackets], e.currentPesPacketIndex = this.currentPesPacketIndex, e.currentPesPacketPos = this.currentPesPacketPos, e.endPos = this.endPos, e.nextPts = this.nextPts, e;
  }
  ensureBuffered(e) {
    const t = this.endPos - this.currentPos;
    return t >= e ? e : this.bufferData(e - t).then(() => Math.min(this.endPos - this.currentPos, e));
  }
  getCurrentPesPacket() {
    const e = this.pesPackets[this.currentPesPacketIndex];
    return m(e), e;
  }
  async bufferData(e) {
    const t = this.endPos + e;
    for (; this.endPos < t; ) {
      let i;
      if (this.pesPackets.length === 0)
        i = this.startingPesPacket;
      else {
        let s = K(this.pesPackets).sectionEndPos;
        for (m(s !== null); ; ) {
          const o = await this.demuxer.readPacketHeader(s);
          if (!o)
            return;
          if (o.pid === this.pid)
            break;
          s += this.demuxer.packetStride;
        }
        const n = await this.demuxer.readSection(s, !0);
        if (!n)
          return;
        const a = xt(n);
        if (!a)
          throw new Error(kt);
        i = a;
      }
      this.pesPackets.push(i), this.endPos += i.data.byteLength, this.pesPackets.length === 1 && (this.nextPts = i.pts);
    }
  }
  readBytes(e) {
    const t = this.getCurrentPesPacket(), i = this.currentPos - this.currentPesPacketPos, s = i + e;
    if (this.currentPos += e, s <= t.data.byteLength)
      return t.data.subarray(i, s);
    const n = new Uint8Array(e);
    n.set(t.data.subarray(i));
    let a = t.data.byteLength - i;
    for (; ; ) {
      this.advanceCurrentPacket();
      const o = this.getCurrentPesPacket(), c = e - a;
      if (c <= o.data.byteLength) {
        n.set(o.data.subarray(0, c), a);
        break;
      }
      n.set(o.data, a), a += o.data.byteLength;
    }
    return n;
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
          this.currentPesPacketPos -= t.data.byteLength, this.nextPts = t.pts;
        }
      else
        for (; ; ) {
          const t = this.getCurrentPesPacket(), i = this.currentPesPacketPos + t.data.byteLength;
          if (e < i)
            break;
          this.currentPesPacketPos += t.data.byteLength, this.currentPesPacketIndex++, this.nextPts = this.getCurrentPesPacket().pts;
        }
      this.currentPos = e;
    }
  }
  skip(e) {
    this.seekTo(this.currentPos + e);
  }
  advanceCurrentPacket() {
    this.currentPesPacketPos += this.getCurrentPesPacket().data.byteLength, this.currentPesPacketIndex++, this.nextPts = this.getCurrentPesPacket().pts;
  }
  /** Supplies the context with a new encoded packet, beginning at the current position. */
  supplyPacket(e, t) {
    const i = this.getCurrentPesPacket();
    if (!this.uncapped && i !== this.startingPesPacket) {
      this.suppliedPacket = null;
      return;
    }
    this.backing.maybeInsertReferencePacket(i, !1, !0);
    const s = this.nextPts;
    this.nextPts += t;
    const n = i.sectionStartPos, a = n + (this.currentPos - this.currentPesPacketPos), o = this.readBytes(e);
    this.suppliedPacket = {
      pts: s,
      data: o,
      sequenceNumber: a,
      sectionStartPos: n
    }, this.pesPackets.splice(0, this.currentPesPacketIndex), this.currentPesPacketIndex = 0;
  }
}
class ir {
  constructor(e, t) {
    this.decodeOrderPackets = [], this.reorderBuffer = [], this.presentationOrderPackets = [], this.reachedEnd = !1, this.lastDuration = 0, this.backing = e, this.context = t, this.reorderSize = e.getReorderSize(), m(this.reorderSize >= 0);
  }
  async readNext() {
    if (this.decodeOrderPackets.length === 0 && !await this.readNextDecodeOrderPacket())
      return null;
    await this.ensureCurrentPacketHasNext();
    const e = this.decodeOrderPackets[0], t = this.presentationOrderPackets.indexOf(e);
    m(t !== -1);
    let i;
    for (t === this.presentationOrderPackets.length - 1 ? i = this.lastDuration : (i = this.presentationOrderPackets[t + 1].pts - e.pts, this.lastDuration = i), this.decodeOrderPackets.shift(); this.presentationOrderPackets.length > 0; ) {
      const s = this.presentationOrderPackets[0];
      if (this.decodeOrderPackets.includes(s))
        break;
      this.presentationOrderPackets.shift();
    }
    return { packet: e, duration: i };
  }
  async readNextDecodeOrderPacket() {
    if (this.reachedEnd)
      return !1;
    let e;
    return this.context.suppliedPacket ? e = this.context.suppliedPacket : (await this.backing.markNextPacket(this.context), e = this.context.suppliedPacket), this.context.suppliedPacket = null, e ? (this.decodeOrderPackets.push(e), this.processPacketThroughReorderBuffer(e), !0) : (this.reachedEnd = !0, this.flushReorderBuffer(), !1);
  }
  async ensureCurrentPacketHasNext() {
    const e = this.decodeOrderPackets[0];
    for (m(e); ; ) {
      const t = this.presentationOrderPackets.indexOf(e);
      if (t !== -1 && t <= this.presentationOrderPackets.length - 2 || !await this.readNextDecodeOrderPacket())
        break;
    }
  }
  processPacketThroughReorderBuffer(e) {
    if (this.reorderBuffer.push(e), this.reorderBuffer.length >= this.reorderSize) {
      let t = 0;
      for (let s = 1; s < this.reorderBuffer.length; s++)
        this.reorderBuffer[s].pts < this.reorderBuffer[t].pts && (t = s);
      const i = this.reorderBuffer.splice(t, 1)[0];
      this.presentationOrderPackets.push(i);
    }
  }
  flushReorderBuffer() {
    this.reorderBuffer.sort((e, t) => e.pts - t.pts), this.presentationOrderPackets.push(...this.reorderBuffer), this.reorderBuffer.length = 0;
  }
}
class Ve {
}
class Gs extends Ve {
  /** @internal */
  async _getMajorBrand(e) {
    let t = e._reader.requestSlice(0, 12);
    return t instanceof Promise && (t = await t), !t || (t.skip(4), te(t, 4) !== "ftyp") ? null : te(t, 4);
  }
  /** @internal */
  _createDemuxer(e) {
    return new xa(e);
  }
}
class bo extends Gs {
  /** @internal */
  async _canReadInput(e) {
    const t = await this._getMajorBrand(e);
    return !!t && t !== "qt  ";
  }
  get name() {
    return "MP4";
  }
  get mimeType() {
    return "video/mp4";
  }
}
class wo extends Gs {
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
class Xs extends Ve {
  /** @internal */
  async isSupportedEBMLOfDocType(e, t) {
    let i = e._reader.requestSlice(0, Oe);
    if (i instanceof Promise && (i = await i), !i)
      return !1;
    const s = Us(i);
    if (s === null || s < 1 || s > 8 || N(i, s) !== P.EBML)
      return !1;
    const a = Ls(i);
    if (typeof a != "number")
      return !1;
    let o = e._reader.requestSlice(i.filePos, a);
    if (o instanceof Promise && (o = await o), !o)
      return !1;
    const c = i.filePos;
    for (; o.filePos <= c + a - me; ) {
      const l = ze(o);
      if (!l)
        break;
      const { id: u, size: d } = l, h = o.filePos;
      if (d === void 0)
        return !1;
      switch (u) {
        case P.EBMLVersion:
          if (N(o, d) !== 1)
            return !1;
          break;
        case P.EBMLReadVersion:
          if (N(o, d) !== 1)
            return !1;
          break;
        case P.DocType:
          if (gt(o, d) !== t)
            return !1;
          break;
        case P.DocTypeVersion:
          if (N(o, d) > 4)
            return !1;
          break;
      }
      o.filePos = h + d;
    }
    return !0;
  }
  /** @internal */
  _canReadInput(e) {
    return this.isSupportedEBMLOfDocType(e, "matroska");
  }
  /** @internal */
  _createDemuxer(e) {
    return new za(e);
  }
  get name() {
    return "Matroska";
  }
  get mimeType() {
    return "video/x-matroska";
  }
}
class yo extends Xs {
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
class To extends Ve {
  /** @internal */
  async _canReadInput(e) {
    let t = e._reader.requestSlice(0, 10);
    if (t instanceof Promise && (t = await t), !t)
      return !1;
    let i = 0, s = !1;
    for (; ; ) {
      let l = e._reader.requestSlice(i, fr);
      if (l instanceof Promise && (l = await l), !l)
        break;
      const u = mr(l);
      if (!u)
        break;
      s = !0, i = l.filePos + u.size;
    }
    const n = await ei(e._reader, i, i + 4096);
    if (!n)
      return !1;
    if (s)
      return !0;
    i = n.startPos + n.header.totalSize;
    const a = await ei(e._reader, i, i + Wt);
    if (!a)
      return !1;
    const o = n.header, c = a.header;
    return !(o.channel !== c.channel || o.sampleRate !== c.sampleRate);
  }
  /** @internal */
  _createDemuxer(e) {
    return new ja(e);
  }
  get name() {
    return "MP3";
  }
  get mimeType() {
    return "audio/mpeg";
  }
}
class So extends Ve {
  /** @internal */
  async _canReadInput(e) {
    let t = e._reader.requestSlice(0, 12);
    if (t instanceof Promise && (t = await t), !t)
      return !1;
    const i = te(t, 4);
    return i !== "RIFF" && i !== "RIFX" && i !== "RF64" ? !1 : (t.skip(4), te(t, 4) === "WAVE");
  }
  /** @internal */
  _createDemuxer(e) {
    return new to(e);
  }
  get name() {
    return "WAVE";
  }
  get mimeType() {
    return "audio/wav";
  }
}
class Po extends Ve {
  /** @internal */
  async _canReadInput(e) {
    let t = e._reader.requestSlice(0, 4);
    return t instanceof Promise && (t = await t), t ? te(t, 4) === "OggS" : !1;
  }
  /** @internal */
  _createDemuxer(e) {
    return new Ja(e);
  }
  get name() {
    return "Ogg";
  }
  get mimeType() {
    return "application/ogg";
  }
}
class xo extends Ve {
  /** @internal */
  async _canReadInput(e) {
    let t = e._reader.requestSlice(0, 4);
    return t instanceof Promise && (t = await t), t ? te(t, 4) === "fLaC" : !1;
  }
  get name() {
    return "FLAC";
  }
  get mimeType() {
    return "audio/flac";
  }
  /** @internal */
  _createDemuxer(e) {
    return new ho(e);
  }
}
class Co extends Ve {
  /** @internal */
  async _canReadInput(e) {
    let t = e._reader.requestSliceRange(0, pr, at);
    if (t instanceof Promise && (t = await t), !t)
      return !1;
    const i = ct(t);
    if (!i || (t = e._reader.requestSliceRange(i.frameLength, pr, at), t instanceof Promise && (t = await t), !t))
      return !1;
    const s = ct(t);
    return s ? i.objectType === s.objectType && i.samplingFrequencyIndex === s.samplingFrequencyIndex && i.channelConfiguration === s.channelConfiguration : !1;
  }
  /** @internal */
  _createDemuxer(e) {
    return new io(e);
  }
  get name() {
    return "ADTS";
  }
  get mimeType() {
    return "audio/aac";
  }
}
class vo extends Ve {
  /** @internal */
  async _canReadInput(e) {
    const t = le + 16 + 1;
    let i = e._reader.requestSlice(0, t);
    if (i instanceof Promise && (i = await i), !i)
      return !1;
    const s = O(i, t);
    return s[0] === 71 && s[le] === 71 || s[0] === 71 && s[le + 16] === 71 ? !0 : s[4] === 71 && s[4 + le] === 71;
  }
  /** @internal */
  _createDemuxer(e) {
    return new po(e);
  }
  get name() {
    return "MPEG Transport Stream";
  }
  get mimeType() {
    return "video/MP2T";
  }
}
const Io = /* @__PURE__ */ new bo(), _o = /* @__PURE__ */ new wo(), Eo = /* @__PURE__ */ new Xs(), Fo = /* @__PURE__ */ new yo(), Ao = /* @__PURE__ */ new To(), Bo = /* @__PURE__ */ new So(), Ro = /* @__PURE__ */ new Po(), zo = /* @__PURE__ */ new Co(), Do = /* @__PURE__ */ new xo(), Mo = /* @__PURE__ */ new vo(), es = [Io, _o, Eo, Fo, Bo, Ro, Do, Ao, zo, Mo];
class Ys {
  constructor() {
    this._disposed = !1, this._sizePromise = null, this.onread = null;
  }
  /**
   * Resolves with the total size of the file in bytes. This function is memoized, meaning only the first call
   * will retrieve the size.
   *
   * Returns null if the source is unsized.
   */
  async getSizeOrNull() {
    if (this._disposed)
      throw new ue();
    return this._sizePromise ??= Promise.resolve(this._retrieveSize());
  }
  /**
   * Resolves with the total size of the file in bytes. This function is memoized, meaning only the first call
   * will retrieve the size.
   *
   * Throws an error if the source is unsized.
   */
  async getSize() {
    if (this._disposed)
      throw new ue();
    const e = await this.getSizeOrNull();
    if (e === null)
      throw new Error("Cannot determine the size of an unsized source.");
    return e;
  }
}
class ts extends Ys {
  /**
   * Creates a new {@link BlobSource} backed by the specified
   * [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob).
   */
  constructor(e, t = {}) {
    if (!(e instanceof Blob))
      throw new TypeError("blob must be a Blob.");
    if (!t || typeof t != "object")
      throw new TypeError("options must be an object.");
    if (t.maxCacheSize !== void 0 && (!bs(t.maxCacheSize) || t.maxCacheSize < 0))
      throw new TypeError("options.maxCacheSize, when provided, must be a non-negative number.");
    super(), this._readers = /* @__PURE__ */ new WeakMap(), this._blob = e, this._orchestrator = new No({
      maxCacheSize: t.maxCacheSize ?? 8 * 2 ** 20,
      maxWorkerCount: 4,
      runWorker: this._runWorker.bind(this),
      prefetchProfile: Oo.fileSystem
    });
  }
  /** @internal */
  _retrieveSize() {
    const e = this._blob.size;
    return this._orchestrator.fileSize = e, e;
  }
  /** @internal */
  _read(e, t) {
    return this._orchestrator.read(e, t);
  }
  /** @internal */
  async _runWorker(e) {
    let t = this._readers.get(e);
    for (t === void 0 && ("stream" in this._blob && !Vt() ? t = this._blob.slice(e.currentPos).stream().getReader() : t = null, this._readers.set(e, t)); e.currentPos < e.targetPos && !e.aborted; )
      if (t) {
        const { done: i, value: s } = await t.read();
        if (i)
          throw this._orchestrator.forgetWorker(e), new Error("Blob reader stopped unexpectedly before all requested data was read.");
        if (e.aborted)
          break;
        this.onread?.(e.currentPos, e.currentPos + s.length), this._orchestrator.supplyWorkerData(e, s);
      } else {
        const i = await this._blob.slice(e.currentPos, e.targetPos).arrayBuffer();
        if (e.aborted)
          break;
        this.onread?.(e.currentPos, e.currentPos + i.byteLength), this._orchestrator.supplyWorkerData(e, new Uint8Array(i));
      }
    e.running = !1, e.aborted && await t?.cancel();
  }
  /** @internal */
  _dispose() {
    this._orchestrator.dispose();
  }
}
const Oo = {
  fileSystem: (r, e) => (r = Math.floor((r - 65536) / 65536) * 65536, e = Math.ceil((e + 65536) / 65536) * 65536, { start: r, end: e })
};
class No {
  constructor(e) {
    this.options = e, this.fileSize = null, this.nextAge = 0, this.workers = [], this.cache = [], this.currentCacheSize = 0, this.disposed = !1;
  }
  read(e, t) {
    m(this.fileSize !== null);
    const i = this.options.prefetchProfile(e, t, this.workers), s = Math.max(i.start, 0), n = Math.min(i.end, this.fileSize);
    m(s <= e && t <= n);
    let a = null;
    const o = L(this.cache, e, (b) => b.start), c = o !== -1 ? this.cache[o] : null;
    c && c.start <= e && t <= c.end && (c.age = this.nextAge++, a = {
      bytes: c.bytes,
      view: c.view,
      offset: c.start
    });
    const l = L(this.cache, s, (b) => b.start), u = a ? null : new Uint8Array(t - e);
    let d = 0, h = s;
    const f = [];
    if (l !== -1) {
      for (let b = l; b < this.cache.length; b++) {
        const y = this.cache[b];
        if (y.start >= n)
          break;
        if (y.end <= s)
          continue;
        const T = Math.max(s, y.start), x = Math.min(n, y.end);
        if (m(T <= x), h < T && f.push({ start: h, end: T }), h = x, u) {
          const S = Math.max(e, y.start), E = Math.min(t, y.end);
          if (S < E) {
            const C = S - e;
            u.set(y.bytes.subarray(S - y.start, E - y.start), C), C === d && (d = E - e);
          }
        }
        y.age = this.nextAge++;
      }
      h < n && f.push({ start: h, end: n });
    } else
      f.push({ start: s, end: n });
    if (u && d >= u.length && (a = {
      bytes: u,
      view: G(u),
      offset: e
    }), f.length === 0)
      return m(a), a;
    const { promise: p, resolve: g, reject: k } = se(), w = [];
    for (const b of f) {
      const y = Math.max(e, b.start), T = Math.min(t, b.end);
      y === b.start && T === b.end ? w.push(b) : y < T && w.push({ start: y, end: T });
    }
    for (const b of f) {
      const y = u && {
        start: e,
        bytes: u,
        holes: w,
        resolve: g,
        reject: k
      };
      let T = !1;
      for (const x of this.workers)
        if (Vi(b.start - 131072, b.start, x.currentPos, x.targetPos)) {
          x.targetPos = Math.max(x.targetPos, b.end), T = !0, y && !x.pendingSlices.includes(y) && x.pendingSlices.push(y), x.running || this.runWorker(x);
          break;
        }
      if (!T) {
        const x = this.createWorker(b.start, b.end);
        y && (x.pendingSlices = [y]), this.runWorker(x);
      }
    }
    return a || (m(u), a = p.then((b) => ({
      bytes: b,
      view: G(b),
      offset: e
    }))), a;
  }
  createWorker(e, t) {
    const i = {
      startPos: e,
      currentPos: e,
      targetPos: t,
      running: !1,
      // Due to async shenanigans, it can happen that workers are started after disposal. In this case, instead of
      // simply not creating the worker, we allow it to run but immediately label it as aborted, so it can then
      // shut itself down.
      aborted: this.disposed,
      pendingSlices: [],
      age: this.nextAge++
    };
    for (this.workers.push(i); this.workers.length > this.options.maxWorkerCount; ) {
      let s = 0, n = this.workers[0];
      for (let a = 1; a < this.workers.length; a++) {
        const o = this.workers[a];
        o.age < n.age && (s = a, n = o);
      }
      if (n.running && n.pendingSlices.length > 0)
        break;
      n.aborted = !0, this.workers.splice(s, 1);
    }
    return i;
  }
  runWorker(e) {
    m(!e.running), m(e.currentPos < e.targetPos), e.running = !0, e.age = this.nextAge++, this.options.runWorker(e).catch((t) => {
      if (e.running = !1, e.pendingSlices.length > 0)
        e.pendingSlices.forEach((i) => i.reject(t)), e.pendingSlices.length = 0;
      else
        throw t;
    });
  }
  /** Called by a worker when it has read some data. */
  supplyWorkerData(e, t) {
    m(!e.aborted);
    const i = e.currentPos, s = i + t.length;
    this.insertIntoCache({
      start: i,
      end: s,
      bytes: t,
      view: G(t),
      age: this.nextAge++
    }), e.currentPos += t.length, e.targetPos = Math.max(e.targetPos, e.currentPos);
    for (let n = 0; n < e.pendingSlices.length; n++) {
      const a = e.pendingSlices[n], o = Math.max(i, a.start), c = Math.min(s, a.start + a.bytes.length);
      o < c && a.bytes.set(t.subarray(o - i, c - i), o - a.start);
      for (let l = 0; l < a.holes.length; l++) {
        const u = a.holes[l];
        i <= u.start && s > u.start && (u.start = s), u.end <= u.start && (a.holes.splice(l, 1), l--);
      }
      a.holes.length === 0 && (a.resolve(a.bytes), e.pendingSlices.splice(n, 1), n--);
    }
    for (let n = 0; n < this.workers.length; n++) {
      const a = this.workers[n];
      e === a || a.running || Vi(i, s, a.currentPos, a.targetPos) && (this.workers.splice(n, 1), n--);
    }
  }
  forgetWorker(e) {
    const t = this.workers.indexOf(e);
    m(t !== -1), this.workers.splice(t, 1);
  }
  insertIntoCache(e) {
    if (this.options.maxCacheSize === 0)
      return;
    let t = L(this.cache, e.start, (i) => i.start) + 1;
    if (t > 0) {
      const i = this.cache[t - 1];
      if (i.end >= e.end)
        return;
      if (i.end > e.start) {
        const s = new Uint8Array(e.end - i.start);
        s.set(i.bytes, 0), s.set(e.bytes, e.start - i.start), this.currentCacheSize += e.end - i.end, i.bytes = s, i.view = G(s), i.end = e.end, t--, e = i;
      } else
        this.cache.splice(t, 0, e), this.currentCacheSize += e.bytes.length;
    } else
      this.cache.splice(t, 0, e), this.currentCacheSize += e.bytes.length;
    for (let i = t + 1; i < this.cache.length; i++) {
      const s = this.cache[i];
      if (e.end <= s.start)
        break;
      if (e.end >= s.end) {
        this.cache.splice(i, 1), this.currentCacheSize -= s.bytes.length, i--;
        continue;
      }
      const n = new Uint8Array(s.end - e.start);
      n.set(e.bytes, 0), n.set(s.bytes, s.start - e.start), this.currentCacheSize -= e.end - s.start, e.bytes = n, e.view = G(n), e.end = s.end, this.cache.splice(i, 1);
      break;
    }
    for (; this.currentCacheSize > this.options.maxCacheSize; ) {
      let i = 0, s = this.cache[0];
      for (let n = 1; n < this.cache.length; n++) {
        const a = this.cache[n];
        a.age < s.age && (i = n, s = a);
      }
      if (this.currentCacheSize - s.bytes.length <= this.options.maxCacheSize)
        break;
      this.cache.splice(i, 1), this.currentCacheSize -= s.bytes.length;
    }
  }
  dispose() {
    for (const e of this.workers)
      e.aborted = !0;
    this.workers.length = 0, this.cache.length = 0, this.disposed = !0;
  }
}
ks();
class ti {
  /** True if the input has been disposed. */
  get disposed() {
    return this._disposed;
  }
  /**
   * Creates a new input file from the specified options. No reading operations will be performed until methods are
   * called on this instance.
   */
  constructor(e) {
    if (this._demuxerPromise = null, this._format = null, this._disposed = !1, !e || typeof e != "object")
      throw new TypeError("options must be an object.");
    if (!Array.isArray(e.formats) || e.formats.some((t) => !(t instanceof Ve)))
      throw new TypeError("options.formats must be an array of InputFormat.");
    if (!(e.source instanceof Ys))
      throw new TypeError("options.source must be a Source.");
    if (e.source._disposed)
      throw new Error("options.source must not be disposed.");
    this._formats = e.formats, this._source = e.source, this._reader = new Vo(e.source);
  }
  /** @internal */
  _getDemuxer() {
    return this._demuxerPromise ??= (async () => {
      this._reader.fileSize = await this._source.getSizeOrNull();
      for (const e of this._formats)
        if (await e._canReadInput(this))
          return this._format = e, e._createDemuxer(this);
      throw new Error("Input has an unsupported or unrecognizable format.");
    })();
  }
  /**
   * Returns the source from which this input file reads its data. This is the same source that was passed to the
   * constructor.
   */
  get source() {
    return this._source;
  }
  /**
   * Returns the format of the input file. You can compare this result directly to the {@link InputFormat} singletons
   * or use `instanceof` checks for subset-aware logic (for example, `format instanceof MatroskaInputFormat` is true
   * for both MKV and WebM).
   */
  async getFormat() {
    return await this._getDemuxer(), m(this._format), this._format;
  }
  /**
   * Computes the duration of the input file, in seconds. More precisely, returns the largest end timestamp among
   * all tracks.
   */
  async computeDuration() {
    return (await this._getDemuxer()).computeDuration();
  }
  /**
   * Returns the timestamp at which the input file starts. More precisely, returns the smallest starting timestamp
   * among all tracks.
   */
  async getFirstTimestamp() {
    const e = await this.getTracks();
    if (e.length === 0)
      return 0;
    const t = await Promise.all(e.map((i) => i.getFirstTimestamp()));
    return Math.min(...t);
  }
  /** Returns the list of all tracks of this input file. */
  async getTracks() {
    return (await this._getDemuxer()).getTracks();
  }
  /** Returns the list of all video tracks of this input file. */
  async getVideoTracks() {
    return (await this.getTracks()).filter((t) => t.isVideoTrack());
  }
  /** Returns the list of all audio tracks of this input file. */
  async getAudioTracks() {
    return (await this.getTracks()).filter((t) => t.isAudioTrack());
  }
  /** Returns the primary video track of this input file, or null if there are no video tracks. */
  async getPrimaryVideoTrack() {
    return (await this.getTracks()).find((t) => t.isVideoTrack()) ?? null;
  }
  /** Returns the primary audio track of this input file, or null if there are no audio tracks. */
  async getPrimaryAudioTrack() {
    return (await this.getTracks()).find((t) => t.isAudioTrack()) ?? null;
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
    this._disposed || (this._disposed = !0, this._source._disposed = !0, this._source._dispose());
  }
  /**
   * Calls `.dispose()` on the input, implementing the `Disposable` interface for use with
   * JavaScript Explicit Resource Management features.
   */
  [Symbol.dispose]() {
    this.dispose();
  }
}
class ue extends Error {
  /** Creates a new {@link InputDisposedError}. */
  constructor(e = "Input has been disposed.") {
    super(e), this.name = "InputDisposedError";
  }
}
class Vo {
  constructor(e) {
    this.source = e;
  }
  requestSlice(e, t) {
    if (this.source._disposed)
      throw new ue();
    if (e < 0 || this.fileSize !== null && e + t > this.fileSize)
      return null;
    const i = e + t, s = this.source._read(e, i);
    return s instanceof Promise ? s.then((n) => n ? new we(n.bytes, n.view, n.offset, e, i) : null) : s ? new we(s.bytes, s.view, s.offset, e, i) : null;
  }
  requestSliceRange(e, t, i) {
    if (this.source._disposed)
      throw new ue();
    if (e < 0)
      return null;
    if (this.fileSize !== null)
      return this.requestSlice(e, ee(this.fileSize - e, t, i));
    {
      const s = this.requestSlice(e, i), n = (a) => {
        if (a)
          return a;
        const o = (l) => (m(l !== null), this.requestSlice(e, ee(l - e, t, i))), c = this.source._retrieveSize();
        return c instanceof Promise ? c.then(o) : o(c);
      };
      return s instanceof Promise ? s.then(n) : n(s);
    }
  }
}
class we {
  constructor(e, t, i, s, n) {
    this.bytes = e, this.view = t, this.offset = i, this.start = s, this.end = n, this.bufferPos = s - i;
  }
  static tempFromBytes(e) {
    return new we(e, G(e), 0, 0, e.length);
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
    return new we(this.bytes, this.view, this.offset, e, e + t);
  }
}
const ce = (r, e) => {
  if (r.filePos < r.start || r.filePos + e > r.end)
    throw new RangeError(`Tried reading [${r.filePos}, ${r.filePos + e}), but slice is [${r.start}, ${r.end}). This is likely an internal error, please report it alongside the file that caused it.`);
}, O = (r, e) => {
  ce(r, e);
  const t = r.bytes.subarray(r.bufferPos, r.bufferPos + e);
  return r.bufferPos += e, t;
}, A = (r) => (ce(r, 1), r.view.getUint8(r.bufferPos++)), Dt = (r, e) => {
  ce(r, 2);
  const t = r.view.getUint16(r.bufferPos, e);
  return r.bufferPos += 2, t;
}, J = (r) => {
  ce(r, 2);
  const e = r.view.getUint16(r.bufferPos, !1);
  return r.bufferPos += 2, e;
}, wt = (r) => {
  ce(r, 3);
  const e = br(r.view, r.bufferPos, !1);
  return r.bufferPos += 3, e;
}, ri = (r) => {
  ce(r, 2);
  const e = r.view.getInt16(r.bufferPos, !1);
  return r.bufferPos += 2, e;
}, Qe = (r, e) => {
  ce(r, 4);
  const t = r.view.getUint32(r.bufferPos, e);
  return r.bufferPos += 4, t;
}, _ = (r) => {
  ce(r, 4);
  const e = r.view.getUint32(r.bufferPos, !1);
  return r.bufferPos += 4, e;
}, vt = (r) => {
  ce(r, 4);
  const e = r.view.getUint32(r.bufferPos, !0);
  return r.bufferPos += 4, e;
}, nt = (r) => {
  ce(r, 4);
  const e = r.view.getInt32(r.bufferPos, !1);
  return r.bufferPos += 4, e;
}, Uo = (r) => {
  ce(r, 4);
  const e = r.view.getInt32(r.bufferPos, !0);
  return r.bufferPos += 4, e;
}, rs = (r, e) => {
  let t, i;
  return e ? (t = Qe(r, !0), i = Qe(r, !0)) : (i = Qe(r, !1), t = Qe(r, !1)), i * 4294967296 + t;
}, be = (r) => {
  const e = _(r), t = _(r);
  return e * 4294967296 + t;
}, Lo = (r) => {
  const e = nt(r), t = _(r);
  return e * 4294967296 + t;
}, Wo = (r) => {
  const e = vt(r);
  return Uo(r) * 4294967296 + e;
}, Ho = (r) => {
  ce(r, 4);
  const e = r.view.getFloat32(r.bufferPos, !1);
  return r.bufferPos += 4, e;
}, Zs = (r) => {
  ce(r, 8);
  const e = r.view.getFloat64(r.bufferPos, !1);
  return r.bufferPos += 8, e;
}, te = (r, e) => {
  ce(r, e);
  let t = "";
  for (let i = 0; i < e; i++)
    t += String.fromCharCode(r.bytes[r.bufferPos++]);
  return t;
};
const is = /<(?:(\d{2}):)?(\d{2}):(\d{2}).(\d{3})>/g, qo = (r) => {
  const e = Math.floor(r / 36e5), t = Math.floor(r % (3600 * 1e3) / (60 * 1e3)), i = Math.floor(r % (60 * 1e3) / 1e3), s = r % 1e3;
  return e.toString().padStart(2, "0") + ":" + t.toString().padStart(2, "0") + ":" + i.toString().padStart(2, "0") + "." + s.toString().padStart(3, "0");
};
class ss {
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
        for (const n of e.children)
          n && this.writeBox(n);
      const i = this.writer.getPos(), s = e.size ?? i - t;
      this.writer.seek(t), this.writeBoxHeader(e, s), this.writer.seek(i);
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
    m(t !== void 0);
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
const V = /* @__PURE__ */ new Uint8Array(8), Ee = /* @__PURE__ */ new DataView(V.buffer), X = (r) => [(r % 256 + 256) % 256], B = (r) => (Ee.setUint16(0, r, !1), [V[0], V[1]]), Js = (r) => (Ee.setInt16(0, r, !1), [V[0], V[1]]), en = (r) => (Ee.setUint32(0, r, !1), [V[1], V[2], V[3]]), v = (r) => (Ee.setUint32(0, r, !1), [V[0], V[1], V[2], V[3]]), qe = (r) => (Ee.setInt32(0, r, !1), [V[0], V[1], V[2], V[3]]), lt = (r) => (Ee.setUint32(0, Math.floor(r / 2 ** 32), !1), Ee.setUint32(4, r, !1), [V[0], V[1], V[2], V[3], V[4], V[5], V[6], V[7]]), tn = (r) => (Ee.setInt16(0, 2 ** 8 * r, !1), [V[0], V[1]]), De = (r) => (Ee.setInt32(0, 2 ** 16 * r, !1), [V[0], V[1], V[2], V[3]]), Mr = (r) => (Ee.setInt32(0, 2 ** 30 * r, !1), [V[0], V[1], V[2], V[3]]), Or = (r, e) => {
  const t = [];
  let i = r;
  do {
    let s = i & 127;
    i >>= 7, t.length > 0 && (s |= 128), t.push(s);
  } while (i > 0 || e);
  return t.reverse();
}, ie = (r, e = !1) => {
  const t = Array(r.length).fill(null).map((i, s) => r.charCodeAt(s));
  return e && t.push(0), t;
}, vi = (r) => {
  let e = null;
  for (const t of r)
    (!e || t.timestamp > e.timestamp) && (e = t);
  return e;
}, rn = (r) => {
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
}, sn = /* @__PURE__ */ rn(0), nn = (r) => [
  De(r[0]),
  De(r[1]),
  Mr(r[2]),
  De(r[3]),
  De(r[4]),
  Mr(r[5]),
  De(r[6]),
  De(r[7]),
  Mr(r[8])
], z = (r, e, t) => ({
  type: r,
  contents: e && new Uint8Array(e.flat(10)),
  children: t
}), U = (r, e, t, i, s) => z(r, [X(e), en(t), i ?? []], s), jo = (r) => r.isQuickTime ? z("ftyp", [
  ie("qt  "),
  // Major brand
  v(512),
  // Minor version
  // Compatible brands
  ie("qt  ")
]) : r.fragmented ? z("ftyp", [
  ie("iso5"),
  // Major brand
  v(512),
  // Minor version
  // Compatible brands
  ie("iso5"),
  ie("iso6"),
  ie("mp41")
]) : z("ftyp", [
  ie("isom"),
  // Major brand
  v(512),
  // Minor version
  // Compatible brands
  ie("isom"),
  r.holdsAvc ? ie("avc1") : [],
  ie("mp41")
]), sr = (r) => ({ type: "mdat", largeSize: r }), $o = (r) => ({ type: "free", size: r }), Mt = (r) => z("moov", void 0, [
  Qo(r.creationTime, r.trackDatas),
  ...r.trackDatas.map((e) => Ko(e, r.creationTime)),
  r.isFragmented ? Ec(r.trackDatas) : null,
  Wc(r)
]), Qo = (r, e) => {
  const t = Z(Math.max(0, ...e.filter((a) => a.samples.length > 0).map((a) => {
    const o = vi(a.samples);
    return o.timestamp + o.duration;
  })), ii), i = Math.max(0, ...e.map((a) => a.track.id)) + 1, s = !Ft(r) || !Ft(t), n = s ? lt : v;
  return U("mvhd", +s, 0, [
    n(r),
    // Creation time
    n(r),
    // Modification time
    v(ii),
    // Timescale
    n(t),
    // Duration
    De(1),
    // Preferred rate
    tn(1),
    // Preferred volume
    Array(10).fill(0),
    // Reserved
    nn(sn),
    // Matrix
    Array(24).fill(0),
    // Pre-defined
    v(i)
    // Next track ID
  ]);
}, Ko = (r, e) => {
  const t = el(r);
  return z("trak", void 0, [
    Go(r, e),
    Xo(r, e),
    t.name !== void 0 ? z("udta", void 0, [
      z("name", [
        ...Ce.encode(t.name)
      ])
    ]) : null
  ]);
}, Go = (r, e) => {
  const t = vi(r.samples), i = Z(t ? t.timestamp + t.duration : 0, ii), s = !Ft(e) || !Ft(i), n = s ? lt : v;
  let a;
  if (r.type === "video") {
    const c = r.track.metadata.rotation;
    a = rn(c ?? 0);
  } else
    a = sn;
  let o = 2;
  return r.track.metadata.disposition?.default !== !1 && (o |= 1), U("tkhd", +s, o, [
    n(e),
    // Creation time
    n(e),
    // Modification time
    v(r.track.id),
    // Track ID
    v(0),
    // Reserved
    n(i),
    // Duration
    Array(8).fill(0),
    // Reserved
    B(0),
    // Layer
    B(r.track.id),
    // Alternate group
    tn(r.type === "audio" ? 1 : 0),
    // Volume
    B(0),
    // Reserved
    nn(a),
    // Matrix
    De(r.type === "video" ? r.info.width : 0),
    // Track width
    De(r.type === "video" ? r.info.height : 0)
    // Track height
  ]);
}, Xo = (r, e) => z("mdia", void 0, [
  Yo(r, e),
  Ii(!0, Zo[r.type], Jo[r.type]),
  ec(r)
]), Yo = (r, e) => {
  const t = vi(r.samples), i = Z(t ? t.timestamp + t.duration : 0, r.timescale), s = !Ft(e) || !Ft(i), n = s ? lt : v;
  return U("mdhd", +s, 0, [
    n(e),
    // Creation time
    n(e),
    // Modification time
    v(r.timescale),
    // Timescale
    n(i),
    // Duration
    B(ln(r.track.metadata.languageCode ?? de)),
    // Language
    B(0)
    // Quality
  ]);
}, Zo = {
  video: "vide",
  audio: "soun",
  subtitle: "text"
}, Jo = {
  video: "MediabunnyVideoHandler",
  audio: "MediabunnySoundHandler",
  subtitle: "MediabunnyTextHandler"
}, Ii = (r, e, t, i = "\0\0\0\0") => U("hdlr", 0, 0, [
  r ? ie("mhlr") : v(0),
  // Component type
  ie(e),
  // Component subtype
  ie(i),
  // Component manufacturer
  v(0),
  // Component flags
  v(0),
  // Component flags mask
  ie(t, !0)
  // Component name
]), ec = (r) => z("minf", void 0, [
  sc[r.type](),
  nc(),
  cc(r)
]), tc = () => U("vmhd", 0, 1, [
  B(0),
  // Graphics mode
  B(0),
  // Opcolor R
  B(0),
  // Opcolor G
  B(0)
  // Opcolor B
]), rc = () => U("smhd", 0, 0, [
  B(0),
  // Balance
  B(0)
  // Reserved
]), ic = () => U("nmhd", 0, 0), sc = {
  video: tc,
  audio: rc,
  subtitle: ic
}, nc = () => z("dinf", void 0, [
  ac()
]), ac = () => U("dref", 0, 0, [
  v(1)
  // Entry count
], [
  oc()
]), oc = () => U("url ", 0, 1), cc = (r) => {
  const e = r.compositionTimeOffsetTable.length > 1 || r.compositionTimeOffsetTable.some((t) => t.sampleCompositionTimeOffset !== 0);
  return z("stbl", void 0, [
    lc(r),
    Sc(r),
    e ? Ic(r) : null,
    e ? _c(r) : null,
    xc(r),
    Cc(r),
    vc(r),
    Pc(r)
  ]);
}, lc = (r) => {
  let e;
  if (r.type === "video")
    e = uc($c(r.track.source._codec, r.info.decoderConfig.codec), r);
  else if (r.type === "audio") {
    const t = cn(r.track.source._codec, r.muxer.isQuickTime);
    m(t), e = pc(t, r);
  } else r.type === "subtitle" && (e = yc(Gc[r.track.source._codec], r));
  return m(e), U("stsd", 0, 0, [
    v(1)
    // Entry count
  ], [
    e
  ]);
}, uc = (r, e) => z(r, [
  Array(6).fill(0),
  // Reserved
  B(1),
  // Data reference index
  B(0),
  // Pre-defined
  B(0),
  // Reserved
  Array(12).fill(0),
  // Pre-defined
  B(e.info.width),
  // Width
  B(e.info.height),
  // Height
  v(4718592),
  // Horizontal resolution
  v(4718592),
  // Vertical resolution
  v(0),
  // Reserved
  B(1),
  // Frame count
  Array(32).fill(0),
  // Compressor name
  B(24),
  // Depth
  Js(65535)
  // Pre-defined
], [
  Qc[e.track.source._codec](e),
  Sn(e.info.decoderConfig.colorSpace) ? dc(e) : null
]), dc = (r) => z("colr", [
  ie("nclx"),
  // Colour type
  B(Xt[r.info.decoderConfig.colorSpace.primaries]),
  // Colour primaries
  B(Yt[r.info.decoderConfig.colorSpace.transfer]),
  // Transfer characteristics
  B(Zt[r.info.decoderConfig.colorSpace.matrix]),
  // Matrix coefficients
  X((r.info.decoderConfig.colorSpace.fullRange ? 1 : 0) << 7)
  // Full range flag
]), hc = (r) => r.info.decoderConfig && z("avcC", [
  // For AVC, description is an AVCDecoderConfigurationRecord, so nothing else to do here
  ...he(r.info.decoderConfig.description)
]), fc = (r) => r.info.decoderConfig && z("hvcC", [
  // For HEVC, description is an HEVCDecoderConfigurationRecord, so nothing else to do here
  ...he(r.info.decoderConfig.description)
]), ns = (r) => {
  if (!r.info.decoderConfig)
    return null;
  const e = r.info.decoderConfig, t = e.codec.split("."), i = Number(t[1]), s = Number(t[2]), n = Number(t[3]), a = t[4] ? Number(t[4]) : 1, o = t[8] ? Number(t[8]) : Number(e.colorSpace?.fullRange ?? 0), c = (n << 4) + (a << 1) + o, l = t[5] ? Number(t[5]) : e.colorSpace?.primaries ? Xt[e.colorSpace.primaries] : 2, u = t[6] ? Number(t[6]) : e.colorSpace?.transfer ? Yt[e.colorSpace.transfer] : 2, d = t[7] ? Number(t[7]) : e.colorSpace?.matrix ? Zt[e.colorSpace.matrix] : 2;
  return U("vpcC", 1, 0, [
    X(i),
    // Profile
    X(s),
    // Level
    X(c),
    // Bit depth, chroma subsampling, full range
    X(l),
    // Colour primaries
    X(u),
    // Transfer characteristics
    X(d),
    // Matrix coefficients
    B(0)
    // Codec initialization data size
  ]);
}, mc = (r) => z("av1C", zn(r.info.decoderConfig.codec)), pc = (r, e) => {
  let t = 0, i, s = 16;
  if (oe.includes(e.track.source._codec)) {
    const n = e.track.source._codec, { sampleSize: a } = Ye(n);
    s = 8 * a, s > 16 && (t = 1);
  }
  return t === 0 ? i = [
    Array(6).fill(0),
    // Reserved
    B(1),
    // Data reference index
    B(t),
    // Version
    B(0),
    // Revision level
    v(0),
    // Vendor
    B(e.info.numberOfChannels),
    // Number of channels
    B(s),
    // Sample size (bits)
    B(0),
    // Compression ID
    B(0),
    // Packet size
    B(e.info.sampleRate < 2 ** 16 ? e.info.sampleRate : 0),
    // Sample rate (upper)
    B(0)
    // Sample rate (lower)
  ] : i = [
    Array(6).fill(0),
    // Reserved
    B(1),
    // Data reference index
    B(t),
    // Version
    B(0),
    // Revision level
    v(0),
    // Vendor
    B(e.info.numberOfChannels),
    // Number of channels
    B(Math.min(s, 16)),
    // Sample size (bits)
    B(0),
    // Compression ID
    B(0),
    // Packet size
    B(e.info.sampleRate < 2 ** 16 ? e.info.sampleRate : 0),
    // Sample rate (upper)
    B(0),
    // Sample rate (lower)
    v(1),
    // Samples per packet (must be 1 for uncompressed formats)
    v(s / 8),
    // Bytes per packet
    v(e.info.numberOfChannels * s / 8),
    // Bytes per frame
    v(2)
    // Bytes per sample (constant in FFmpeg)
  ], z(r, i, [
    Kc(e.track.source._codec, e.muxer.isQuickTime)?.(e) ?? null
  ]);
}, Nr = (r) => {
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
    ...X(e),
    // Object type indication
    ...X(21),
    // stream type(6bits)=5 audio, flags(2bits)=1
    ...en(0),
    // 24bit buffer size
    ...v(0),
    // max bitrate
    ...v(0)
    // avg bitrate
  ];
  if (r.info.decoderConfig.description) {
    const i = he(r.info.decoderConfig.description);
    t = [
      ...t,
      ...X(5),
      // TAG(5) = DecoderSpecificInfo
      ...Or(i.byteLength),
      ...i
    ];
  }
  return t = [
    ...B(1),
    // ES_ID = 1
    ...X(0),
    // flags etc = 0
    ...X(4),
    // TAG(4) = ES Descriptor
    ...Or(t.length),
    ...t,
    ...X(6),
    // TAG(6)
    ...X(1),
    // length
    ...X(2)
    // data
  ], t = [
    ...X(3),
    // TAG(3) = Object Descriptor
    ...Or(t.length),
    ...t
  ], U("esds", 0, 0, t);
}, Le = (r) => z("wave", void 0, [
  gc(r),
  kc(r),
  z("\0\0\0\0")
  // NULL tag at the end
]), gc = (r) => z("frma", [
  ie(cn(r.track.source._codec, r.muxer.isQuickTime))
]), kc = (r) => {
  const { littleEndian: e } = Ye(r.track.source._codec);
  return z("enda", [
    B(+e)
  ]);
}, bc = (r) => {
  let e = r.info.numberOfChannels, t = 3840, i = r.info.sampleRate, s = 0, n = 0, a = new Uint8Array(0);
  const o = r.info.decoderConfig?.description;
  if (o) {
    m(o.byteLength >= 18);
    const c = he(o), l = As(c);
    e = l.outputChannelCount, t = l.preSkip, i = l.inputSampleRate, s = l.outputGain, n = l.channelMappingFamily, l.channelMappingTable && (a = l.channelMappingTable);
  }
  return z("dOps", [
    X(0),
    // Version
    X(e),
    // OutputChannelCount
    B(t),
    // PreSkip
    v(i),
    // InputSampleRate
    Js(s),
    // OutputGain
    X(n),
    // ChannelMappingFamily
    ...a
  ]);
}, wc = (r) => {
  const e = r.info.decoderConfig?.description;
  m(e);
  const t = he(e);
  return U("dfLa", 0, 0, [
    ...t.subarray(4)
  ]);
}, Pe = (r) => {
  const { littleEndian: e, sampleSize: t } = Ye(r.track.source._codec), i = +e;
  return U("pcmC", 0, 0, [
    X(i),
    X(8 * t)
  ]);
}, yc = (r, e) => z(r, [
  Array(6).fill(0),
  // Reserved
  B(1)
  // Data reference index
], [
  Xc[e.track.source._codec](e)
]), Tc = (r) => z("vttC", [
  ...Ce.encode(r.info.config.description)
]), Sc = (r) => U("stts", 0, 0, [
  v(r.timeToSampleTable.length),
  // Number of entries
  r.timeToSampleTable.map((e) => [
    v(e.sampleCount),
    // Sample count
    v(e.sampleDelta)
    // Sample duration
  ])
]), Pc = (r) => {
  if (r.samples.every((t) => t.type === "key"))
    return null;
  const e = [...r.samples.entries()].filter(([, t]) => t.type === "key");
  return U("stss", 0, 0, [
    v(e.length),
    // Number of entries
    e.map(([t]) => v(t + 1))
    // Sync sample table
  ]);
}, xc = (r) => U("stsc", 0, 0, [
  v(r.compactlyCodedChunkTable.length),
  // Number of entries
  r.compactlyCodedChunkTable.map((e) => [
    v(e.firstChunk),
    // First chunk
    v(e.samplesPerChunk),
    // Samples per chunk
    v(1)
    // Sample description index
  ])
]), Cc = (r) => {
  if (r.type === "audio" && r.info.requiresPcmTransformation) {
    const { sampleSize: e } = Ye(r.track.source._codec);
    return U("stsz", 0, 0, [
      v(e * r.info.numberOfChannels),
      // Sample size
      v(r.samples.reduce((t, i) => t + Z(i.duration, r.timescale), 0))
    ]);
  }
  return U("stsz", 0, 0, [
    v(0),
    // Sample size (0 means non-constant size)
    v(r.samples.length),
    // Number of entries
    r.samples.map((e) => v(e.size))
    // Sample size table
  ]);
}, vc = (r) => r.finalizedChunks.length > 0 && K(r.finalizedChunks).offset >= 2 ** 32 ? U("co64", 0, 0, [
  v(r.finalizedChunks.length),
  // Number of entries
  r.finalizedChunks.map((e) => lt(e.offset))
  // Chunk offset table
]) : U("stco", 0, 0, [
  v(r.finalizedChunks.length),
  // Number of entries
  r.finalizedChunks.map((e) => v(e.offset))
  // Chunk offset table
]), Ic = (r) => U("ctts", 1, 0, [
  v(r.compositionTimeOffsetTable.length),
  // Number of entries
  r.compositionTimeOffsetTable.map((e) => [
    v(e.sampleCount),
    // Sample count
    qe(e.sampleCompositionTimeOffset)
    // Sample offset
  ])
]), _c = (r) => {
  let e = 1 / 0, t = -1 / 0, i = 1 / 0, s = -1 / 0;
  m(r.compositionTimeOffsetTable.length > 0), m(r.samples.length > 0);
  for (let a = 0; a < r.compositionTimeOffsetTable.length; a++) {
    const o = r.compositionTimeOffsetTable[a];
    e = Math.min(e, o.sampleCompositionTimeOffset), t = Math.max(t, o.sampleCompositionTimeOffset);
  }
  for (let a = 0; a < r.samples.length; a++) {
    const o = r.samples[a];
    i = Math.min(i, Z(o.timestamp, r.timescale)), s = Math.max(s, Z(o.timestamp + o.duration, r.timescale));
  }
  const n = Math.max(-e, 0);
  return s >= 2 ** 31 ? null : U("cslg", 0, 0, [
    qe(n),
    // Composition to DTS shift
    qe(e),
    // Least decode to display delta
    qe(t),
    // Greatest decode to display delta
    qe(i),
    // Composition start time
    qe(s)
    // Composition end time
  ]);
}, Ec = (r) => z("mvex", void 0, r.map(Fc)), Fc = (r) => U("trex", 0, 0, [
  v(r.track.id),
  // Track ID
  v(1),
  // Default sample description index
  v(0),
  // Default sample duration
  v(0),
  // Default sample size
  v(0)
  // Default sample flags
]), as = (r, e) => z("moof", void 0, [
  Ac(r),
  ...e.map(Bc)
]), Ac = (r) => U("mfhd", 0, 0, [
  v(r)
  // Sequence number
]), an = (r) => {
  let e = 0, t = 0;
  const i = 0, s = 0, n = r.type === "delta";
  return t |= +n, n ? e |= 1 : e |= 2, e << 24 | t << 16 | i << 8 | s;
}, Bc = (r) => z("traf", void 0, [
  Rc(r),
  zc(r),
  Dc(r)
]), Rc = (r) => {
  m(r.currentChunk);
  let e = 0;
  e |= 8, e |= 16, e |= 32, e |= 131072;
  const t = r.currentChunk.samples[1] ?? r.currentChunk.samples[0], i = {
    duration: t.timescaleUnitsToNextSample,
    size: t.size,
    flags: an(t)
  };
  return U("tfhd", 0, e, [
    v(r.track.id),
    // Track ID
    v(i.duration),
    // Default sample duration
    v(i.size),
    // Default sample size
    v(i.flags)
    // Default sample flags
  ]);
}, zc = (r) => (m(r.currentChunk), U("tfdt", 1, 0, [
  lt(Z(r.currentChunk.startTimestamp, r.timescale))
  // Base Media Decode Time
])), Dc = (r) => {
  m(r.currentChunk);
  const e = r.currentChunk.samples.map((g) => g.timescaleUnitsToNextSample), t = r.currentChunk.samples.map((g) => g.size), i = r.currentChunk.samples.map(an), s = r.currentChunk.samples.map((g) => Z(g.timestamp - g.decodeTimestamp, r.timescale)), n = new Set(e), a = new Set(t), o = new Set(i), c = new Set(s), l = o.size === 2 && i[0] !== i[1], u = n.size > 1, d = a.size > 1, h = !l && o.size > 1, f = c.size > 1 || [...c].some((g) => g !== 0);
  let p = 0;
  return p |= 1, p |= 4 * +l, p |= 256 * +u, p |= 512 * +d, p |= 1024 * +h, p |= 2048 * +f, U("trun", 1, p, [
    v(r.currentChunk.samples.length),
    // Sample count
    v(r.currentChunk.offset - r.currentChunk.moofOffset || 0),
    // Data offset
    l ? v(i[0]) : [],
    r.currentChunk.samples.map((g, k) => [
      u ? v(e[k]) : [],
      // Sample duration
      d ? v(t[k]) : [],
      // Sample size
      h ? v(i[k]) : [],
      // Sample flags
      // Sample composition time offsets
      f ? qe(s[k]) : []
    ])
  ]);
}, Mc = (r) => z("mfra", void 0, [
  ...r.map(Oc),
  Nc()
]), Oc = (r, e) => U("tfra", 1, 0, [
  v(r.track.id),
  // Track ID
  v(63),
  // This specifies that traf number, trun number and sample number are 32-bit ints
  v(r.finalizedChunks.length),
  // Number of entries
  r.finalizedChunks.map((i) => [
    lt(Z(i.samples[0].timestamp, r.timescale)),
    // Time (in presentation time)
    lt(i.moofOffset),
    // moof offset
    v(e + 1),
    // traf number
    v(1),
    // trun number
    v(1)
    // Sample number
  ])
]), Nc = () => U("mfro", 0, 0, [
  // This value needs to be overwritten manually from the outside, where the actual size of the enclosing mfra box
  // is known
  v(0)
  // Size
]), Vc = () => z("vtte"), Uc = (r, e, t, i, s) => z("vttc", void 0, [
  s !== null ? z("vsid", [qe(s)]) : null,
  t !== null ? z("iden", [...Ce.encode(t)]) : null,
  e !== null ? z("ctim", [...Ce.encode(qo(e))]) : null,
  i !== null ? z("sttg", [...Ce.encode(i)]) : null,
  z("payl", [...Ce.encode(r)])
]), Lc = (r) => z("vtta", [...Ce.encode(r)]), Wc = (r) => {
  const e = [], t = r.format._options.metadataFormat ?? "auto", i = r.output._metadataTags;
  if (t === "mdir" || t === "auto" && !r.isQuickTime) {
    const s = qc(i);
    s && e.push(s);
  } else if (t === "mdta") {
    const s = jc(i);
    s && e.push(s);
  } else (t === "udta" || t === "auto" && r.isQuickTime) && Hc(e, r.output._metadataTags);
  return e.length === 0 ? null : z("udta", void 0, e);
}, Hc = (r, e) => {
  for (const { key: t, value: i } of gs(e))
    switch (t) {
      case "title":
        r.push(xe("©nam", i));
        break;
      case "description":
        r.push(xe("©des", i));
        break;
      case "artist":
        r.push(xe("©ART", i));
        break;
      case "album":
        r.push(xe("©alb", i));
        break;
      case "albumArtist":
        r.push(xe("albr", i));
        break;
      case "genre":
        r.push(xe("©gen", i));
        break;
      case "date":
        r.push(xe("©day", i.toISOString().slice(0, 10)));
        break;
      case "comment":
        r.push(xe("©cmt", i));
        break;
      case "lyrics":
        r.push(xe("©lyr", i));
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
        Ge(t);
    }
  if (e.raw)
    for (const t in e.raw) {
      const i = e.raw[t];
      i == null || t.length !== 4 || r.some((s) => s.type === t) || (typeof i == "string" ? r.push(xe(t, i)) : i instanceof Uint8Array && r.push(z(t, Array.from(i))));
    }
}, xe = (r, e) => {
  const t = Ce.encode(e);
  return z(r, [
    B(t.length),
    B(ln("und")),
    Array.from(t)
  ]);
}, os = {
  "image/jpeg": 13,
  "image/png": 14,
  "image/bmp": 27
}, on = (r, e) => {
  const t = [];
  for (const { key: i, value: s } of gs(r))
    switch (i) {
      case "title":
        t.push({ key: e ? "title" : "©nam", value: ke(s) });
        break;
      case "description":
        t.push({ key: e ? "description" : "©des", value: ke(s) });
        break;
      case "artist":
        t.push({ key: e ? "artist" : "©ART", value: ke(s) });
        break;
      case "album":
        t.push({ key: e ? "album" : "©alb", value: ke(s) });
        break;
      case "albumArtist":
        t.push({ key: e ? "album_artist" : "aART", value: ke(s) });
        break;
      case "comment":
        t.push({ key: e ? "comment" : "©cmt", value: ke(s) });
        break;
      case "genre":
        t.push({ key: e ? "genre" : "©gen", value: ke(s) });
        break;
      case "lyrics":
        t.push({ key: e ? "lyrics" : "©lyr", value: ke(s) });
        break;
      case "date":
        t.push({
          key: e ? "date" : "©day",
          value: ke(s.toISOString().slice(0, 10))
        });
        break;
      case "images":
        for (const n of s)
          n.kind === "coverFront" && t.push({ key: "covr", value: z("data", [
            v(os[n.mimeType] ?? 0),
            // Type indicator
            v(0),
            // Locale indicator
            Array.from(n.data)
            // Kinda slow, hopefully temp
          ]) });
        break;
      case "trackNumber":
        if (e) {
          const n = r.tracksTotal !== void 0 ? `${s}/${r.tracksTotal}` : s.toString();
          t.push({ key: "track", value: ke(n) });
        } else
          t.push({ key: "trkn", value: z("data", [
            v(0),
            // 8 bytes empty
            v(0),
            B(0),
            // Empty
            B(s),
            B(r.tracksTotal ?? 0),
            B(0)
            // Empty
          ]) });
        break;
      case "discNumber":
        e || t.push({ key: "disc", value: z("data", [
          v(0),
          // 8 bytes empty
          v(0),
          B(0),
          // Empty
          B(s),
          B(r.discsTotal ?? 0),
          B(0)
          // Empty
        ]) });
        break;
      case "tracksTotal":
      case "discsTotal":
        break;
      case "raw":
        break;
      default:
        Ge(i);
    }
  if (r.raw)
    for (const i in r.raw) {
      const s = r.raw[i];
      s == null || !e && i.length !== 4 || t.some((n) => n.key === i) || (typeof s == "string" ? t.push({ key: i, value: ke(s) }) : s instanceof Uint8Array ? t.push({ key: i, value: z("data", [
        v(0),
        // Type indicator
        v(0),
        // Locale indicator
        Array.from(s)
      ]) }) : s instanceof It && t.push({ key: i, value: z("data", [
        v(os[s.mimeType] ?? 0),
        // Type indicator
        v(0),
        // Locale indicator
        Array.from(s.data)
        // Kinda slow, hopefully temp
      ]) }));
    }
  return t;
}, qc = (r) => {
  const e = on(r, !1);
  return e.length === 0 ? null : U("meta", 0, 0, void 0, [
    Ii(!1, "mdir", "", "appl"),
    // mdir handler
    z("ilst", void 0, e.map((t) => z(t.key, void 0, [t.value])))
    // Item list without keys box
  ]);
}, jc = (r) => {
  const e = on(r, !0);
  return e.length === 0 ? null : z("meta", void 0, [
    Ii(!1, "mdta", ""),
    // mdta handler
    U("keys", 0, 0, [
      v(e.length)
    ], e.map((t) => z("mdta", [
      ...Ce.encode(t.key)
    ]))),
    z("ilst", void 0, e.map((t, i) => {
      const s = String.fromCharCode(...v(i + 1));
      return z(s, void 0, [t.value]);
    }))
  ]);
}, ke = (r) => z("data", [
  v(1),
  // Type indicator (UTF-8)
  v(0),
  // Locale indicator
  ...Ce.encode(r)
]), $c = (r, e) => {
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
  }
}, Qc = {
  avc: hc,
  hevc: fc,
  vp8: ns,
  vp9: ns,
  av1: mc
}, cn = (r, e) => {
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
  }
  if (e)
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
}, Kc = (r, e) => {
  switch (r) {
    case "aac":
      return Nr;
    case "mp3":
      return Nr;
    case "opus":
      return bc;
    case "vorbis":
      return Nr;
    case "flac":
      return wc;
  }
  if (e)
    switch (r) {
      case "pcm-s24":
        return Le;
      case "pcm-s24be":
        return Le;
      case "pcm-s32":
        return Le;
      case "pcm-s32be":
        return Le;
      case "pcm-f32":
        return Le;
      case "pcm-f32be":
        return Le;
      case "pcm-f64":
        return Le;
      case "pcm-f64be":
        return Le;
    }
  else
    switch (r) {
      case "pcm-s16":
        return Pe;
      case "pcm-s16be":
        return Pe;
      case "pcm-s24":
        return Pe;
      case "pcm-s24be":
        return Pe;
      case "pcm-s32":
        return Pe;
      case "pcm-s32be":
        return Pe;
      case "pcm-f32":
        return Pe;
      case "pcm-f32be":
        return Pe;
      case "pcm-f64":
        return Pe;
      case "pcm-f64be":
        return Pe;
    }
  return null;
}, Gc = {
  webvtt: "wvtt"
}, Xc = {
  webvtt: Tc
}, ln = (r) => {
  m(r.length === 3);
  let e = 0;
  for (let t = 0; t < 3; t++)
    e <<= 5, e += r.charCodeAt(t) - 96;
  return e;
};
class un {
  constructor() {
    this.ensureMonotonicity = !1, this.trackedWrites = null, this.trackedStart = -1, this.trackedEnd = -1;
  }
  start() {
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
    let s = this.trackedWrites.byteLength;
    for (; s < i; )
      s *= 2;
    if (s !== this.trackedWrites.byteLength) {
      const n = new Uint8Array(s);
      n.set(this.trackedWrites, 0), this.trackedWrites = n;
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
const Vr = 2 ** 16, Ur = 2 ** 32;
class dn extends un {
  constructor(e) {
    if (super(), this.pos = 0, this.maxPos = 0, this.target = e, this.supportsResize = "resize" in new ArrayBuffer(0), this.supportsResize)
      try {
        this.buffer = new ArrayBuffer(Vr, { maxByteLength: Ur });
      } catch {
        this.buffer = new ArrayBuffer(Vr), this.supportsResize = !1;
      }
    else
      this.buffer = new ArrayBuffer(Vr);
    this.bytes = new Uint8Array(this.buffer);
  }
  ensureSize(e) {
    let t = this.buffer.byteLength;
    for (; t < e; )
      t *= 2;
    if (t !== this.buffer.byteLength) {
      if (t > Ur)
        throw new Error(`ArrayBuffer exceeded maximum size of ${Ur} bytes. Please consider using another target.`);
      if (this.supportsResize)
        this.buffer.resize(t);
      else {
        const i = new ArrayBuffer(t), s = new Uint8Array(i);
        s.set(this.bytes, 0), this.buffer = i, this.bytes = s;
      }
    }
  }
  write(e) {
    this.maybeTrackWrites(e), this.ensureSize(this.pos + e.byteLength), this.bytes.set(e, this.pos), this.target.onwrite?.(this.pos, this.pos + e.byteLength), this.pos += e.byteLength, this.maxPos = Math.max(this.maxPos, this.pos);
  }
  seek(e) {
    this.pos = e;
  }
  getPos() {
    return this.pos;
  }
  async flush() {
  }
  async finalize() {
    this.ensureSize(this.pos), this.target.buffer = this.buffer.slice(0, Math.max(this.maxPos, this.pos));
  }
  async close() {
  }
  getSlice(e, t) {
    return this.bytes.slice(e, t);
  }
}
class Yc extends un {
  constructor(e) {
    super(), this.target = e, this.pos = 0;
  }
  write(e) {
    this.maybeTrackWrites(e), this.target.onwrite?.(this.pos, this.pos + e.byteLength), this.pos += e.byteLength;
  }
  getPos() {
    return this.pos;
  }
  seek(e) {
    this.pos = e;
  }
  async flush() {
  }
  async finalize() {
  }
  async close() {
  }
}
class _i {
  constructor() {
    this._output = null, this.onwrite = null;
  }
}
class hn extends _i {
  constructor() {
    super(...arguments), this.buffer = null;
  }
  /** @internal */
  _createWriter() {
    return new dn(this);
  }
}
class Zc extends _i {
  /** @internal */
  _createWriter() {
    return new Yc(this);
  }
}
const ii = 1e3, Jc = 2082844800, el = (r) => {
  const e = {}, t = r.track;
  return t.metadata.name !== void 0 && (e.name = t.metadata.name), e;
}, Z = (r, e, t = !0) => {
  const i = r * e;
  return t ? Math.round(i) : i;
};
class tl extends Qn {
  constructor(e, t) {
    super(e), this.auxTarget = new hn(), this.auxWriter = this.auxTarget._createWriter(), this.auxBoxWriter = new ss(this.auxWriter), this.mdat = null, this.ftypSize = null, this.trackDatas = [], this.allTracksKnown = se(), this.creationTime = Math.floor(Date.now() / 1e3) + Jc, this.finalizedChunks = [], this.nextFragmentNumber = 1, this.maxWrittenTimestamp = -1 / 0, this.format = t, this.writer = e._writer, this.boxWriter = new ss(this.writer), this.isQuickTime = t instanceof pn;
    const i = this.writer instanceof dn ? "in-memory" : !1;
    this.fastStart = t._options.fastStart ?? i, this.isFragmented = this.fastStart === "fragmented", (this.fastStart === "in-memory" || this.isFragmented) && (this.writer.ensureMonotonicity = !0), this.minimumFragmentDuration = t._options.minimumFragmentDuration ?? 1;
  }
  async start() {
    const e = await this.mutex.acquire(), t = this.output._tracks.some((i) => i.type === "video" && i.source._codec === "avc");
    if (this.format._options.onFtyp && this.writer.startTrackingWrites(), this.boxWriter.writeBox(jo({
      isQuickTime: this.isQuickTime,
      holdsAvc: t,
      fragmented: this.isFragmented
    })), this.format._options.onFtyp) {
      const { data: i, start: s } = this.writer.stopTrackingWrites();
      this.format._options.onFtyp(i, s);
    }
    if (this.ftypSize = this.writer.getPos(), this.fastStart !== "in-memory") if (this.fastStart === "reserve") {
      for (const i of this.output._tracks)
        if (i.metadata.maximumPacketCount === void 0)
          throw new Error("All tracks must specify maximumPacketCount in their metadata when using fastStart: 'reserve'.");
    } else this.isFragmented || (this.format._options.onMdat && this.writer.startTrackingWrites(), this.mdat = sr(!0), this.boxWriter.writeBox(this.mdat));
    await this.writer.flush(), e();
  }
  allTracksAreKnown() {
    for (const e of this.output._tracks)
      if (!e.source._closed && !this.trackDatas.some((t) => t.track === e))
        return !1;
    return !0;
  }
  async getMimeType() {
    await this.allTracksKnown.promise;
    const e = this.trackDatas.map((t) => t.type === "video" || t.type === "audio" ? t.info.decoderConfig.codec : {
      webvtt: "wvtt"
    }[t.track.source._codec]);
    return Ns({
      isQuickTime: this.isQuickTime,
      hasVideo: this.trackDatas.some((t) => t.type === "video"),
      hasAudio: this.trackDatas.some((t) => t.type === "audio"),
      codecStrings: e
    });
  }
  getVideoTrackData(e, t, i) {
    const s = this.trackDatas.find((l) => l.track === e);
    if (s)
      return s;
    Hn(i), m(i), m(i.decoderConfig);
    const n = { ...i.decoderConfig };
    m(n.codedWidth !== void 0), m(n.codedHeight !== void 0);
    let a = !1;
    if (e.source._codec === "avc" && !n.description) {
      const l = gi(t.data);
      if (!l)
        throw new Error("Couldn't extract an AVCDecoderConfigurationRecord from the AVC packet. Make sure the packets are in Annex B format (as specified in ITU-T-REC-H.264) when not providing a description, or provide a description (must be an AVCDecoderConfigurationRecord as specified in ISO 14496-15) and ensure the packets are in AVCC format.");
      n.description = Yn(l), a = !0;
    } else if (e.source._codec === "hevc" && !n.description) {
      const l = bi(t.data);
      if (!l)
        throw new Error("Couldn't extract an HEVCDecoderConfigurationRecord from the HEVC packet. Make sure the packets are in Annex B format (as specified in ITU-T-REC-H.265) when not providing a description, or provide a description (must be an HEVCDecoderConfigurationRecord as specified in ISO 14496-15) and ensure the packets are in HEVC format.");
      n.description = aa(l), a = !0;
    }
    const o = En(1 / (e.metadata.frameRate ?? 57600), 1e6).denominator, c = {
      muxer: this,
      track: e,
      type: "video",
      info: {
        width: n.codedWidth,
        height: n.codedHeight,
        decoderConfig: n,
        requiresAnnexBTransformation: a
      },
      timescale: o,
      samples: [],
      sampleQueue: [],
      timestampProcessingQueue: [],
      timeToSampleTable: [],
      compositionTimeOffsetTable: [],
      lastTimescaleUnits: null,
      lastSample: null,
      finalizedChunks: [],
      currentChunk: null,
      compactlyCodedChunkTable: []
    };
    return this.trackDatas.push(c), this.trackDatas.sort((l, u) => l.track.id - u.track.id), this.allTracksAreKnown() && this.allTracksKnown.resolve(), c;
  }
  getAudioTrackData(e, t, i) {
    const s = this.trackDatas.find((c) => c.track === e);
    if (s)
      return s;
    jn(i), m(i), m(i.decoderConfig);
    const n = { ...i.decoderConfig };
    let a = !1;
    if (e.source._codec === "aac" && !n.description) {
      const c = ct(we.tempFromBytes(t.data));
      if (!c)
        throw new Error("Couldn't parse ADTS header from the AAC packet. Make sure the packets are in ADTS format (as specified in ISO 13818-7) when not providing a description, or provide a description (must be an AudioSpecificConfig as specified in ISO 14496-3) and ensure the packets are raw AAC data.");
      const l = ot[c.samplingFrequencyIndex], u = er[c.channelConfiguration];
      if (l === void 0 || u === void 0)
        throw new Error("Invalid ADTS frame header.");
      n.description = ys({
        objectType: c.objectType,
        sampleRate: l,
        numberOfChannels: u
      }), a = !0;
    }
    const o = {
      muxer: this,
      track: e,
      type: "audio",
      info: {
        numberOfChannels: i.decoderConfig.numberOfChannels,
        sampleRate: i.decoderConfig.sampleRate,
        decoderConfig: n,
        requiresPcmTransformation: !this.isFragmented && oe.includes(e.source._codec),
        requiresAdtsStripping: a
      },
      timescale: i.decoderConfig.sampleRate,
      samples: [],
      sampleQueue: [],
      timestampProcessingQueue: [],
      timeToSampleTable: [],
      compositionTimeOffsetTable: [],
      lastTimescaleUnits: null,
      lastSample: null,
      finalizedChunks: [],
      currentChunk: null,
      compactlyCodedChunkTable: []
    };
    return this.trackDatas.push(o), this.trackDatas.sort((c, l) => c.track.id - l.track.id), this.allTracksAreKnown() && this.allTracksKnown.resolve(), o;
  }
  getSubtitleTrackData(e, t) {
    const i = this.trackDatas.find((n) => n.track === e);
    if (i)
      return i;
    $n(t), m(t), m(t.config);
    const s = {
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
      finalizedChunks: [],
      currentChunk: null,
      compactlyCodedChunkTable: [],
      lastCueEndTimestamp: 0,
      cueQueue: [],
      nextSourceId: 0,
      cueToSourceId: /* @__PURE__ */ new WeakMap()
    };
    return this.trackDatas.push(s), this.trackDatas.sort((n, a) => n.track.id - a.track.id), this.allTracksAreKnown() && this.allTracksKnown.resolve(), s;
  }
  async addEncodedVideoPacket(e, t, i) {
    const s = await this.mutex.acquire();
    try {
      const n = this.getVideoTrackData(e, t, i);
      let a = t.data;
      if (n.info.requiresAnnexBTransformation) {
        const l = [...tr(a)].map((u) => a.subarray(u.offset, u.offset + u.length));
        if (l.length === 0)
          throw new Error("Failed to transform packet data. Make sure all packets are provided in Annex B format, as specified in ITU-T-REC-H.264 and ITU-T-REC-H.265.");
        a = Cs(l, 4);
      }
      const o = this.validateAndNormalizeTimestamp(n.track, t.timestamp, t.type === "key"), c = this.createSampleForTrack(n, a, o, t.duration, t.type);
      await this.registerSample(n, c);
    } finally {
      s();
    }
  }
  async addEncodedAudioPacket(e, t, i) {
    const s = await this.mutex.acquire();
    try {
      const n = this.getAudioTrackData(e, t, i);
      let a = t.data;
      if (n.info.requiresAdtsStripping) {
        const l = ct(we.tempFromBytes(a));
        if (!l)
          throw new Error("Expected ADTS frame, didn't get one.");
        const u = l.crcCheck === null ? pr : at;
        a = a.subarray(u);
      }
      const o = this.validateAndNormalizeTimestamp(n.track, t.timestamp, t.type === "key"), c = this.createSampleForTrack(n, a, o, t.duration, t.type);
      n.info.requiresPcmTransformation && await this.maybePadWithSilence(n, o), await this.registerSample(n, c);
    } finally {
      s();
    }
  }
  async maybePadWithSilence(e, t) {
    const i = K(e.samples), s = i ? i.timestamp + i.duration : 0, n = t - s, a = Z(n, e.timescale);
    if (a > 0) {
      const { sampleSize: o, silentValue: c } = Ye(e.info.decoderConfig.codec), l = a * e.info.numberOfChannels, u = new Uint8Array(o * l).fill(c), d = this.createSampleForTrack(e, new Uint8Array(u.buffer), s, n, "key");
      await this.registerSample(e, d);
    }
  }
  async addSubtitleCue(e, t, i) {
    const s = await this.mutex.acquire();
    try {
      const n = this.getSubtitleTrackData(e, i);
      this.validateAndNormalizeTimestamp(n.track, t.timestamp, !0), e.source._codec === "webvtt" && (n.cueQueue.push(t), await this.processWebVTTCues(n, t.timestamp));
    } finally {
      s();
    }
  }
  async processWebVTTCues(e, t) {
    for (; e.cueQueue.length > 0; ) {
      const i = /* @__PURE__ */ new Set([]);
      for (const l of e.cueQueue)
        m(l.timestamp <= t), m(e.lastCueEndTimestamp <= l.timestamp + l.duration), i.add(Math.max(l.timestamp, e.lastCueEndTimestamp)), i.add(l.timestamp + l.duration);
      const s = [...i].sort((l, u) => l - u), n = s[0], a = s[1] ?? n;
      if (t < a)
        break;
      if (e.lastCueEndTimestamp < n) {
        this.auxWriter.seek(0);
        const l = Vc();
        this.auxBoxWriter.writeBox(l);
        const u = this.auxWriter.getSlice(0, this.auxWriter.getPos()), d = this.createSampleForTrack(e, u, e.lastCueEndTimestamp, n - e.lastCueEndTimestamp, "key");
        await this.registerSample(e, d), e.lastCueEndTimestamp = n;
      }
      this.auxWriter.seek(0);
      for (let l = 0; l < e.cueQueue.length; l++) {
        const u = e.cueQueue[l];
        if (u.timestamp >= a)
          break;
        is.lastIndex = 0;
        const d = is.test(u.text), h = u.timestamp + u.duration;
        let f = e.cueToSourceId.get(u);
        if (f === void 0 && a < h && (f = e.nextSourceId++, e.cueToSourceId.set(u, f)), u.notes) {
          const g = Lc(u.notes);
          this.auxBoxWriter.writeBox(g);
        }
        const p = Uc(u.text, d ? n : null, u.identifier ?? null, u.settings ?? null, f ?? null);
        this.auxBoxWriter.writeBox(p), h === a && e.cueQueue.splice(l--, 1);
      }
      const o = this.auxWriter.getSlice(0, this.auxWriter.getPos()), c = this.createSampleForTrack(e, o, n, a - n, "key");
      await this.registerSample(e, c), e.lastCueEndTimestamp = a;
    }
  }
  createSampleForTrack(e, t, i, s, n) {
    return {
      timestamp: i,
      decodeTimestamp: i,
      // This may be refined later
      duration: s,
      data: t,
      size: t.byteLength,
      type: n,
      timescaleUnitsToNextSample: Z(s, e.timescale)
      // Will be refined
    };
  }
  processTimestamps(e, t) {
    if (e.timestampProcessingQueue.length === 0)
      return;
    if (e.type === "audio" && e.info.requiresPcmTransformation) {
      let s = 0;
      for (let n = 0; n < e.timestampProcessingQueue.length; n++) {
        const a = e.timestampProcessingQueue[n], o = Z(a.duration, e.timescale);
        s += o;
      }
      if (e.timeToSampleTable.length === 0)
        e.timeToSampleTable.push({
          sampleCount: s,
          sampleDelta: 1
        });
      else {
        const n = K(e.timeToSampleTable);
        n.sampleCount += s;
      }
      e.timestampProcessingQueue.length = 0;
      return;
    }
    const i = e.timestampProcessingQueue.map((s) => s.timestamp).sort((s, n) => s - n);
    for (let s = 0; s < e.timestampProcessingQueue.length; s++) {
      const n = e.timestampProcessingQueue[s];
      n.decodeTimestamp = i[s], !this.isFragmented && e.lastTimescaleUnits === null && (n.decodeTimestamp = 0);
      const a = Z(n.timestamp - n.decodeTimestamp, e.timescale), o = Z(n.duration, e.timescale);
      if (e.lastTimescaleUnits !== null) {
        m(e.lastSample);
        const c = Z(n.decodeTimestamp, e.timescale, !1), l = Math.round(c - e.lastTimescaleUnits);
        if (m(l >= 0), e.lastTimescaleUnits += l, e.lastSample.timescaleUnitsToNextSample = l, !this.isFragmented) {
          let u = K(e.timeToSampleTable);
          if (m(u), u.sampleCount === 1) {
            u.sampleDelta = l;
            const h = e.timeToSampleTable[e.timeToSampleTable.length - 2];
            h && h.sampleDelta === l && (h.sampleCount++, e.timeToSampleTable.pop(), u = h);
          } else u.sampleDelta !== l && (u.sampleCount--, e.timeToSampleTable.push(u = {
            sampleCount: 1,
            sampleDelta: l
          }));
          u.sampleDelta === o ? u.sampleCount++ : e.timeToSampleTable.push({
            sampleCount: 1,
            sampleDelta: o
          });
          const d = K(e.compositionTimeOffsetTable);
          m(d), d.sampleCompositionTimeOffset === a ? d.sampleCount++ : e.compositionTimeOffsetTable.push({
            sampleCount: 1,
            sampleCompositionTimeOffset: a
          });
        }
      } else
        e.lastTimescaleUnits = Z(n.decodeTimestamp, e.timescale, !1), this.isFragmented || (e.timeToSampleTable.push({
          sampleCount: 1,
          sampleDelta: o
        }), e.compositionTimeOffsetTable.push({
          sampleCount: 1,
          sampleCompositionTimeOffset: a
        }));
      e.lastSample = n;
    }
    if (e.timestampProcessingQueue.length = 0, m(e.lastSample), m(e.lastTimescaleUnits !== null), t !== void 0 && e.lastSample.timescaleUnitsToNextSample === 0) {
      m(t.type === "key");
      const s = Z(t.timestamp, e.timescale, !1), n = Math.round(s - e.lastTimescaleUnits);
      e.lastSample.timescaleUnitsToNextSample = n;
    }
  }
  async registerSample(e, t) {
    t.type === "key" && this.processTimestamps(e, t), e.timestampProcessingQueue.push(t), this.isFragmented ? (e.sampleQueue.push(t), await this.interleaveSamples()) : this.fastStart === "reserve" ? await this.registerSampleFastStartReserve(e, t) : await this.addSampleToTrack(e, t);
  }
  async addSampleToTrack(e, t) {
    if (!this.isFragmented && (e.samples.push(t), this.fastStart === "reserve")) {
      const s = e.track.metadata.maximumPacketCount;
      if (m(s !== void 0), e.samples.length > s)
        throw new Error(`Track #${e.track.id} has already reached the maximum packet count (${s}). Either add less packets or increase the maximum packet count.`);
    }
    let i = !1;
    if (!e.currentChunk)
      i = !0;
    else {
      e.currentChunk.startTimestamp = Math.min(e.currentChunk.startTimestamp, t.timestamp);
      const s = t.timestamp - e.currentChunk.startTimestamp;
      if (this.isFragmented) {
        const n = this.trackDatas.every((a) => {
          if (e === a)
            return t.type === "key";
          const o = a.sampleQueue[0];
          return o ? o.type === "key" : a.track.source._closed;
        });
        s >= this.minimumFragmentDuration && n && t.timestamp > this.maxWrittenTimestamp && (i = !0, await this.finalizeFragment());
      } else
        i = s >= 0.5;
    }
    i && (e.currentChunk && await this.finalizeCurrentChunk(e), e.currentChunk = {
      startTimestamp: t.timestamp,
      samples: [],
      offset: null,
      moofOffset: null
    }), m(e.currentChunk), e.currentChunk.samples.push(t), this.isFragmented && (this.maxWrittenTimestamp = Math.max(this.maxWrittenTimestamp, t.timestamp));
  }
  async finalizeCurrentChunk(e) {
    if (m(!this.isFragmented), !e.currentChunk)
      return;
    e.finalizedChunks.push(e.currentChunk), this.finalizedChunks.push(e.currentChunk);
    let t = e.currentChunk.samples.length;
    if (e.type === "audio" && e.info.requiresPcmTransformation && (t = e.currentChunk.samples.reduce((i, s) => i + Z(s.duration, e.timescale), 0)), (e.compactlyCodedChunkTable.length === 0 || K(e.compactlyCodedChunkTable).samplesPerChunk !== t) && e.compactlyCodedChunkTable.push({
      firstChunk: e.finalizedChunks.length,
      // 1-indexed
      samplesPerChunk: t
    }), this.fastStart === "in-memory") {
      e.currentChunk.offset = 0;
      return;
    }
    e.currentChunk.offset = this.writer.getPos();
    for (const i of e.currentChunk.samples)
      m(i.data), this.writer.write(i.data), i.data = null;
    await this.writer.flush();
  }
  async interleaveSamples(e = !1) {
    if (m(this.isFragmented), !(!e && !this.allTracksAreKnown()))
      e: for (; ; ) {
        let t = null, i = 1 / 0;
        for (const n of this.trackDatas) {
          if (!e && n.sampleQueue.length === 0 && !n.track.source._closed)
            break e;
          n.sampleQueue.length > 0 && n.sampleQueue[0].timestamp < i && (t = n, i = n.sampleQueue[0].timestamp);
        }
        if (!t)
          break;
        const s = t.sampleQueue.shift();
        await this.addSampleToTrack(t, s);
      }
  }
  async finalizeFragment(e = !0) {
    m(this.isFragmented);
    const t = this.nextFragmentNumber++;
    if (t === 1) {
      this.format._options.onMoov && this.writer.startTrackingWrites();
      const f = Mt(this);
      if (this.boxWriter.writeBox(f), this.format._options.onMoov) {
        const { data: p, start: g } = this.writer.stopTrackingWrites();
        this.format._options.onMoov(p, g);
      }
    }
    const i = this.trackDatas.filter((f) => f.currentChunk), s = as(t, i), n = this.writer.getPos(), a = n + this.boxWriter.measureBox(s);
    let o = a + Me, c = 1 / 0;
    for (const f of i) {
      f.currentChunk.offset = o, f.currentChunk.moofOffset = n;
      for (const p of f.currentChunk.samples)
        o += p.size;
      c = Math.min(c, f.currentChunk.startTimestamp);
    }
    const l = o - a, u = l >= 2 ** 32;
    if (u)
      for (const f of i)
        f.currentChunk.offset += it - Me;
    this.format._options.onMoof && this.writer.startTrackingWrites();
    const d = as(t, i);
    if (this.boxWriter.writeBox(d), this.format._options.onMoof) {
      const { data: f, start: p } = this.writer.stopTrackingWrites();
      this.format._options.onMoof(f, p, c);
    }
    m(this.writer.getPos() === a), this.format._options.onMdat && this.writer.startTrackingWrites();
    const h = sr(u);
    h.size = l, this.boxWriter.writeBox(h), this.writer.seek(a + (u ? it : Me));
    for (const f of i)
      for (const p of f.currentChunk.samples)
        this.writer.write(p.data), p.data = null;
    if (this.format._options.onMdat) {
      const { data: f, start: p } = this.writer.stopTrackingWrites();
      this.format._options.onMdat(f, p);
    }
    for (const f of i)
      f.finalizedChunks.push(f.currentChunk), this.finalizedChunks.push(f.currentChunk), f.currentChunk = null;
    e && await this.writer.flush();
  }
  async registerSampleFastStartReserve(e, t) {
    if (this.allTracksAreKnown()) {
      if (!this.mdat) {
        const i = Mt(this), n = this.boxWriter.measureBox(i) + this.computeSampleTableSizeUpperBound() + 4096;
        m(this.ftypSize !== null), this.writer.seek(this.ftypSize + n), this.format._options.onMdat && this.writer.startTrackingWrites(), this.mdat = sr(!0), this.boxWriter.writeBox(this.mdat);
        for (const a of this.trackDatas) {
          for (const o of a.sampleQueue)
            await this.addSampleToTrack(a, o);
          a.sampleQueue.length = 0;
        }
      }
      await this.addSampleToTrack(e, t);
    } else
      e.sampleQueue.push(t);
  }
  computeSampleTableSizeUpperBound() {
    m(this.fastStart === "reserve");
    let e = 0;
    for (const t of this.trackDatas) {
      const i = t.track.metadata.maximumPacketCount;
      m(i !== void 0), e += 8 * Math.ceil(2 / 3 * i), e += 4 * i, e += 8 * Math.ceil(2 / 3 * i), e += 12 * Math.ceil(2 / 3 * i), e += 4 * i, e += 8 * i;
    }
    return e;
  }
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async onTrackClose(e) {
    const t = await this.mutex.acquire();
    if (e.type === "subtitle" && e.source._codec === "webvtt") {
      const i = this.trackDatas.find((s) => s.track === e);
      i && await this.processWebVTTCues(i, 1 / 0);
    }
    this.allTracksAreKnown() && this.allTracksKnown.resolve(), this.isFragmented && await this.interleaveSamples(), t();
  }
  /** Finalizes the file, making it ready for use. Must be called after all video and audio chunks have been added. */
  async finalize() {
    const e = await this.mutex.acquire();
    this.allTracksKnown.resolve();
    for (const t of this.trackDatas)
      t.type === "subtitle" && t.track.source._codec === "webvtt" && await this.processWebVTTCues(t, 1 / 0);
    if (this.isFragmented) {
      await this.interleaveSamples(!0);
      for (const t of this.trackDatas)
        this.processTimestamps(t);
      await this.finalizeFragment(!1);
    } else
      for (const t of this.trackDatas)
        this.processTimestamps(t), await this.finalizeCurrentChunk(t);
    if (this.fastStart === "in-memory") {
      this.mdat = sr(!1);
      let t;
      for (let s = 0; s < 2; s++) {
        const n = Mt(this), a = this.boxWriter.measureBox(n);
        t = this.boxWriter.measureBox(this.mdat);
        let o = this.writer.getPos() + a + t;
        for (const c of this.finalizedChunks) {
          c.offset = o;
          for (const { data: l } of c.samples)
            m(l), o += l.byteLength, t += l.byteLength;
        }
        if (o < 2 ** 32)
          break;
        t >= 2 ** 32 && (this.mdat.largeSize = !0);
      }
      this.format._options.onMoov && this.writer.startTrackingWrites();
      const i = Mt(this);
      if (this.boxWriter.writeBox(i), this.format._options.onMoov) {
        const { data: s, start: n } = this.writer.stopTrackingWrites();
        this.format._options.onMoov(s, n);
      }
      this.format._options.onMdat && this.writer.startTrackingWrites(), this.mdat.size = t, this.boxWriter.writeBox(this.mdat);
      for (const s of this.finalizedChunks)
        for (const n of s.samples)
          m(n.data), this.writer.write(n.data), n.data = null;
      if (this.format._options.onMdat) {
        const { data: s, start: n } = this.writer.stopTrackingWrites();
        this.format._options.onMdat(s, n);
      }
    } else if (this.isFragmented) {
      const t = this.writer.getPos(), i = Mc(this.trackDatas);
      this.boxWriter.writeBox(i);
      const s = this.writer.getPos() - t;
      this.writer.seek(this.writer.getPos() - 4), this.boxWriter.writeU32(s);
    } else {
      m(this.mdat);
      const t = this.boxWriter.offsets.get(this.mdat);
      m(t !== void 0);
      const i = this.writer.getPos() - t;
      if (this.mdat.size = i, this.mdat.largeSize = i >= 2 ** 32, this.boxWriter.patchBox(this.mdat), this.format._options.onMdat) {
        const { data: n, start: a } = this.writer.stopTrackingWrites();
        this.format._options.onMdat(n, a);
      }
      const s = Mt(this);
      if (this.fastStart === "reserve") {
        m(this.ftypSize !== null), this.writer.seek(this.ftypSize), this.format._options.onMoov && this.writer.startTrackingWrites(), this.boxWriter.writeBox(s);
        const n = this.boxWriter.offsets.get(this.mdat) - this.writer.getPos();
        this.boxWriter.writeBox($o(n));
      } else
        this.format._options.onMoov && this.writer.startTrackingWrites(), this.boxWriter.writeBox(s);
      if (this.format._options.onMoov) {
        const { data: n, start: a } = this.writer.stopTrackingWrites();
        this.format._options.onMoov(n, a);
      }
    }
    e();
  }
}
class fn {
  /** Returns a list of video codecs that this output format can contain. */
  getSupportedVideoCodecs() {
    return this.getSupportedCodecs().filter((e) => Ie.includes(e));
  }
  /** Returns a list of audio codecs that this output format can contain. */
  getSupportedAudioCodecs() {
    return this.getSupportedCodecs().filter((e) => _e.includes(e));
  }
  /** Returns a list of subtitle codecs that this output format can contain. */
  getSupportedSubtitleCodecs() {
    return this.getSupportedCodecs().filter((e) => ur.includes(e));
  }
  /** @internal */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _codecUnsupportedHint(e) {
    return "";
  }
}
class mn extends fn {
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
      total: { min: 1, max: 4294967295 }
    };
  }
  get supportsVideoRotationMetadata() {
    return !0;
  }
  /** @internal */
  _createMuxer(e) {
    return new tl(e, this);
  }
}
class Ei extends mn {
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
      ...Ie,
      ...Ut,
      // These are supported via ISO/IEC 23003-5
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
      ...ur
    ];
  }
  /** @internal */
  _codecUnsupportedHint(e) {
    return new pn().getSupportedCodecs().includes(e) ? " Switching to MOV will grant support for this codec." : "";
  }
}
class pn extends mn {
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
      ...Ie,
      ..._e
    ];
  }
  /** @internal */
  _codecUnsupportedHint(e) {
    return new Ei().getSupportedCodecs().includes(e) ? " Switching to MP4 will grant support for this codec." : "";
  }
}
const rl = (r) => {
  if (!r || typeof r != "object")
    throw new TypeError("Encoding config must be an object.");
  if (!Ie.includes(r.codec))
    throw new TypeError(`Invalid video codec '${r.codec}'. Must be one of: ${Ie.join(", ")}.`);
  if (!(r.bitrate instanceof ye) && (!Number.isInteger(r.bitrate) || r.bitrate <= 0))
    throw new TypeError("config.bitrate must be a positive integer or a quality.");
  if (r.keyFrameInterval !== void 0 && (!Number.isFinite(r.keyFrameInterval) || r.keyFrameInterval < 0))
    throw new TypeError("config.keyFrameInterval, when provided, must be a non-negative number.");
  if (r.sizeChangeBehavior !== void 0 && !["deny", "passThrough", "fill", "contain", "cover"].includes(r.sizeChangeBehavior))
    throw new TypeError("config.sizeChangeBehavior, when provided, must be 'deny', 'passThrough', 'fill', 'contain' or 'cover'.");
  if (r.onEncodedPacket !== void 0 && typeof r.onEncodedPacket != "function")
    throw new TypeError("config.onEncodedChunk, when provided, must be a function.");
  if (r.onEncoderConfig !== void 0 && typeof r.onEncoderConfig != "function")
    throw new TypeError("config.onEncoderConfig, when provided, must be a function.");
  gn(r.codec, r);
}, gn = (r, e) => {
  if (!e || typeof e != "object")
    throw new TypeError("Encoding options must be an object.");
  if (e.alpha !== void 0 && !["discard", "keep"].includes(e.alpha))
    throw new TypeError("options.alpha, when provided, must be 'discard' or 'keep'.");
  if (e.bitrateMode !== void 0 && !["constant", "variable"].includes(e.bitrateMode))
    throw new TypeError("bitrateMode, when provided, must be 'constant' or 'variable'.");
  if (e.latencyMode !== void 0 && !["quality", "realtime"].includes(e.latencyMode))
    throw new TypeError("latencyMode, when provided, must be 'quality' or 'realtime'.");
  if (e.fullCodecString !== void 0 && typeof e.fullCodecString != "string")
    throw new TypeError("fullCodecString, when provided, must be a string.");
  if (e.fullCodecString !== void 0 && Ss(e.fullCodecString) !== r)
    throw new TypeError(`fullCodecString, when provided, must be a string that matches the specified codec (${r}).`);
  if (e.hardwareAcceleration !== void 0 && !["no-preference", "prefer-hardware", "prefer-software"].includes(e.hardwareAcceleration))
    throw new TypeError("hardwareAcceleration, when provided, must be 'no-preference', 'prefer-hardware' or 'prefer-software'.");
  if (e.scalabilityMode !== void 0 && typeof e.scalabilityMode != "string")
    throw new TypeError("scalabilityMode, when provided, must be a string.");
  if (e.contentHint !== void 0 && typeof e.contentHint != "string")
    throw new TypeError("contentHint, when provided, must be a string.");
}, si = (r) => {
  const e = r.bitrate instanceof ye ? r.bitrate._toVideoBitrate(r.codec, r.width, r.height) : r.bitrate;
  return {
    codec: r.fullCodecString ?? Rn(r.codec, r.width, r.height, e),
    width: r.width,
    height: r.height,
    bitrate: e,
    bitrateMode: r.bitrateMode,
    alpha: r.alpha ?? "discard",
    framerate: r.framerate,
    latencyMode: r.latencyMode,
    hardwareAcceleration: r.hardwareAcceleration,
    scalabilityMode: r.scalabilityMode,
    contentHint: r.contentHint,
    ...Mn(r.codec)
  };
}, il = (r) => {
  if (!r || typeof r != "object")
    throw new TypeError("Encoding config must be an object.");
  if (!_e.includes(r.codec))
    throw new TypeError(`Invalid audio codec '${r.codec}'. Must be one of: ${_e.join(", ")}.`);
  if (r.bitrate === void 0 && (!oe.includes(r.codec) || r.codec === "flac"))
    throw new TypeError("config.bitrate must be provided for compressed audio codecs.");
  if (r.bitrate !== void 0 && !(r.bitrate instanceof ye) && (!Number.isInteger(r.bitrate) || r.bitrate <= 0))
    throw new TypeError("config.bitrate, when provided, must be a positive integer or a quality.");
  if (r.onEncodedPacket !== void 0 && typeof r.onEncodedPacket != "function")
    throw new TypeError("config.onEncodedChunk, when provided, must be a function.");
  if (r.onEncoderConfig !== void 0 && typeof r.onEncoderConfig != "function")
    throw new TypeError("config.onEncoderConfig, when provided, must be a function.");
  kn(r.codec, r);
}, kn = (r, e) => {
  if (!e || typeof e != "object")
    throw new TypeError("Encoding options must be an object.");
  if (e.bitrateMode !== void 0 && !["constant", "variable"].includes(e.bitrateMode))
    throw new TypeError("bitrateMode, when provided, must be 'constant' or 'variable'.");
  if (e.fullCodecString !== void 0 && typeof e.fullCodecString != "string")
    throw new TypeError("fullCodecString, when provided, must be a string.");
  if (e.fullCodecString !== void 0 && Ss(e.fullCodecString) !== r)
    throw new TypeError(`fullCodecString, when provided, must be a string that matches the specified codec (${r}).`);
}, ni = (r) => {
  const e = r.bitrate instanceof ye ? r.bitrate._toAudioBitrate(r.codec) : r.bitrate;
  return {
    codec: r.fullCodecString ?? Dn(r.codec, r.numberOfChannels, r.sampleRate),
    numberOfChannels: r.numberOfChannels,
    sampleRate: r.sampleRate,
    bitrate: e,
    bitrateMode: r.bitrateMode,
    ...On(r.codec)
  };
};
class ye {
  /** @internal */
  constructor(e) {
    this._factor = e;
  }
  /** @internal */
  _toVideoBitrate(e, t, i) {
    const s = t * i, n = {
      avc: 1,
      // H.264/AVC (baseline)
      hevc: 0.6,
      // H.265/HEVC (~40% more efficient than AVC)
      vp9: 0.6,
      // Similar to HEVC
      av1: 0.4,
      // ~60% more efficient than AVC
      vp8: 1.2
      // Slightly less efficient than AVC
    }, a = 1920 * 1080, o = 3e6, c = Math.pow(s / a, 0.95), d = o * c * n[e] * this._factor;
    return Math.ceil(d / 1e3) * 1e3;
  }
  /** @internal */
  _toAudioBitrate(e) {
    if (oe.includes(e) || e === "flac")
      return;
    const i = {
      aac: 128e3,
      // 128kbps base for AAC
      opus: 64e3,
      // 64kbps base for Opus
      mp3: 16e4,
      // 160kbps base for MP3
      vorbis: 64e3
      // 64kbps base for Vorbis
    }[e];
    if (!i)
      throw new Error(`Unhandled codec: ${e}`);
    let s = i * this._factor;
    return e === "aac" ? s = [96e3, 128e3, 16e4, 192e3].reduce((a, o) => Math.abs(o - s) < Math.abs(a - s) ? o : a) : e === "opus" || e === "vorbis" ? s = Math.max(6e3, s) : e === "mp3" && (s = [
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
    ].reduce((a, o) => Math.abs(o - s) < Math.abs(a - s) ? o : a)), Math.round(s / 1e3) * 1e3;
  }
}
const sl = /* @__PURE__ */ new ye(0.3), nl = /* @__PURE__ */ new ye(1), ai = /* @__PURE__ */ new ye(2), al = async (r, e = {}) => {
  const { width: t = 1280, height: i = 720, bitrate: s = 1e6, ...n } = e;
  if (!Ie.includes(r))
    return !1;
  if (!Number.isInteger(t) || t <= 0)
    throw new TypeError("width must be a positive integer.");
  if (!Number.isInteger(i) || i <= 0)
    throw new TypeError("height must be a positive integer.");
  if (!(s instanceof ye) && (!Number.isInteger(s) || s <= 0))
    throw new TypeError("bitrate must be a positive integer or a quality.");
  gn(r, n);
  let a = null;
  return Qr.length > 0 && (a ??= si({
    codec: r,
    width: t,
    height: i,
    bitrate: s,
    framerate: void 0,
    ...n
  }), Qr.some((l) => l.supports(r, a))) ? !0 : typeof VideoEncoder > "u" || (t % 2 === 1 || i % 2 === 1) && (r === "avc" || r === "hevc") || (a ??= si({
    codec: r,
    width: t,
    height: i,
    bitrate: s,
    framerate: void 0,
    ...n,
    alpha: "discard"
    // Since we handle alpha ourselves
  }), !(await VideoEncoder.isConfigSupported(a)).supported) ? !1 : At() ? new Promise(async (l) => {
    try {
      const u = new VideoEncoder({
        output: () => {
        },
        error: () => l(!1)
      });
      u.configure(a);
      const d = new Uint8Array(t * i * 4), h = new VideoFrame(d, {
        format: "RGBA",
        codedWidth: t,
        codedHeight: i,
        timestamp: 0
      });
      u.encode(h), h.close(), await u.flush(), l(!0);
    } catch {
      l(!1);
    }
  }) : !0;
}, ol = async (r, e = {}) => {
  const { numberOfChannels: t = 2, sampleRate: i = 48e3, bitrate: s = 128e3, ...n } = e;
  if (!_e.includes(r))
    return !1;
  if (!Number.isInteger(t) || t <= 0)
    throw new TypeError("numberOfChannels must be a positive integer.");
  if (!Number.isInteger(i) || i <= 0)
    throw new TypeError("sampleRate must be a positive integer.");
  if (!(s instanceof ye) && (!Number.isInteger(s) || s <= 0))
    throw new TypeError("bitrate must be a positive integer.");
  kn(r, n);
  let a = null;
  return Kr.length > 0 && (a ??= ni({
    codec: r,
    numberOfChannels: t,
    sampleRate: i,
    bitrate: s,
    ...n
  }), Kr.some((c) => c.supports(r, a))) || oe.includes(r) ? !0 : typeof AudioEncoder > "u" ? !1 : (a ??= ni({
    codec: r,
    numberOfChannels: t,
    sampleRate: i,
    bitrate: s,
    ...n
  }), (await AudioEncoder.isConfigSupported(a)).supported === !0);
}, oi = async (r = _e, e) => {
  const t = await Promise.all(r.map((i) => ol(i, e)));
  return r.filter((i, s) => t[s]);
}, cl = async (r, e) => {
  for (const t of r)
    if (await al(t, e))
      return t;
  return null;
};
class Fi {
  constructor() {
    this._connectedTrack = null, this._closingPromise = null, this._closed = !1, this._timestampOffset = 0;
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
class Ai extends Fi {
  /** Internal constructor. */
  constructor(e) {
    if (super(), this._connectedTrack = null, !Ie.includes(e))
      throw new TypeError(`Invalid video codec '${e}'. Must be one of: ${Ie.join(", ")}.`);
    this._codec = e;
  }
}
class ll extends Ai {
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
    if (!(e instanceof q))
      throw new TypeError("packet must be an EncodedPacket.");
    if (e.isMetadataOnly)
      throw new TypeError("Metadata-only packets cannot be added.");
    if (t !== void 0 && (!t || typeof t != "object"))
      throw new TypeError("meta, when provided, must be an object.");
    return this._ensureValidAdd(), this._connectedTrack.output._muxer.addEncodedVideoPacket(this._connectedTrack, e, t);
  }
}
class ul {
  constructor(e, t) {
    this.source = e, this.encodingConfig = t, this.ensureEncoderPromise = null, this.encoderInitialized = !1, this.encoder = null, this.muxer = null, this.lastMultipleOfKeyFrameInterval = -1, this.codedWidth = null, this.codedHeight = null, this.resizeCanvas = null, this.customEncoder = null, this.customEncoderCallSerializer = new wr(), this.customEncoderQueueSize = 0, this.alphaEncoder = null, this.splitter = null, this.splitterCreationFailed = !1, this.alphaFrameQueue = [], this.error = null, this.errorNeedsNewStack = !0;
  }
  async add(e, t, i) {
    try {
      if (this.checkForEncoderError(), this.source._ensureValidAdd(), this.codedWidth !== null && this.codedHeight !== null) {
        if (e.codedWidth !== this.codedWidth || e.codedHeight !== this.codedHeight) {
          const o = this.encodingConfig.sizeChangeBehavior ?? "deny";
          if (o !== "passThrough") {
            if (o === "deny")
              throw new Error(`Video sample size must remain constant. Expected ${this.codedWidth}x${this.codedHeight}, got ${e.codedWidth}x${e.codedHeight}. To allow the sample size to change over time, set \`sizeChangeBehavior\` to a value other than 'strict' in the encoding options.`);
            {
              let c = !1;
              this.resizeCanvas || (typeof document < "u" ? (this.resizeCanvas = document.createElement("canvas"), this.resizeCanvas.width = this.codedWidth, this.resizeCanvas.height = this.codedHeight) : this.resizeCanvas = new OffscreenCanvas(this.codedWidth, this.codedHeight), c = !0);
              const l = this.resizeCanvas.getContext("2d", {
                alpha: At()
                // Firefox has VideoFrame glitches with opaque canvases
              });
              m(l), c || (At() ? (l.fillStyle = "black", l.fillRect(0, 0, this.codedWidth, this.codedHeight)) : l.clearRect(0, 0, this.codedWidth, this.codedHeight)), e.drawWithFit(l, { fit: o }), t && e.close(), e = new ae(this.resizeCanvas, {
                timestamp: e.timestamp,
                duration: e.duration,
                rotation: e.rotation
              }), t = !0;
            }
          }
        }
      } else
        this.codedWidth = e.codedWidth, this.codedHeight = e.codedHeight;
      this.encoderInitialized || (this.ensureEncoderPromise || this.ensureEncoder(e), this.encoderInitialized || await this.ensureEncoderPromise), m(this.encoderInitialized);
      const s = this.encodingConfig.keyFrameInterval ?? 5, n = Math.floor(e.timestamp / s), a = {
        ...i,
        keyFrame: i?.keyFrame || s === 0 || n !== this.lastMultipleOfKeyFrameInterval
      };
      if (this.lastMultipleOfKeyFrameInterval = n, this.customEncoder) {
        this.customEncoderQueueSize++;
        const o = e.clone(), c = this.customEncoderCallSerializer.call(() => this.customEncoder.encode(o, a)).then(() => this.customEncoderQueueSize--).catch((l) => this.error ??= l).finally(() => {
          o.close();
        });
        this.customEncoderQueueSize >= 4 && await c;
      } else {
        m(this.encoder);
        const o = e.toVideoFrame();
        if (!this.alphaEncoder)
          this.encoder.encode(o, a), o.close();
        else if (!!o.format && !o.format.includes("A") || this.splitterCreationFailed)
          this.alphaFrameQueue.push(null), this.encoder.encode(o, a), o.close();
        else {
          const l = o.displayWidth, u = o.displayHeight;
          if (!this.splitter)
            try {
              this.splitter = new dl(l, u);
            } catch (d) {
              console.error("Due to an error, only color data will be encoded.", d), this.splitterCreationFailed = !0, this.alphaFrameQueue.push(null), this.encoder.encode(o, a), o.close();
            }
          if (this.splitter) {
            const d = this.splitter.extractColor(o), h = this.splitter.extractAlpha(o);
            this.alphaFrameQueue.push(h), this.encoder.encode(d, a), d.close(), o.close();
          }
        }
        t && e.close(), this.encoder.encodeQueueSize >= 4 && await new Promise((c) => this.encoder.addEventListener("dequeue", c, { once: !0 }));
      }
      await this.muxer.mutex.currentPromise;
    } finally {
      t && e.close();
    }
  }
  ensureEncoder(e) {
    const t = new Error();
    this.ensureEncoderPromise = (async () => {
      const i = si({
        width: e.codedWidth,
        height: e.codedHeight,
        ...this.encodingConfig,
        framerate: this.source._connectedTrack?.metadata.frameRate
      });
      this.encodingConfig.onEncoderConfig?.(i);
      const s = Qr.find((n) => n.supports(this.encodingConfig.codec, i));
      if (s)
        this.customEncoder = new s(), this.customEncoder.codec = this.encodingConfig.codec, this.customEncoder.config = i, this.customEncoder.onPacket = (n, a) => {
          if (!(n instanceof q))
            throw new TypeError("The first argument passed to onPacket must be an EncodedPacket.");
          if (a !== void 0 && (!a || typeof a != "object"))
            throw new TypeError("The second argument passed to onPacket must be an object or undefined.");
          this.encodingConfig.onEncodedPacket?.(n, a), this.muxer.addEncodedVideoPacket(this.source._connectedTrack, n, a).catch((o) => {
            this.error ??= o, this.errorNeedsNewStack = !1;
          });
        }, await this.customEncoder.init();
      else {
        if (typeof VideoEncoder > "u")
          throw new Error("VideoEncoder is not supported by this browser.");
        if (i.alpha = "discard", this.encodingConfig.alpha === "keep" && (i.latencyMode = "quality"), (i.width % 2 === 1 || i.height % 2 === 1) && (this.encodingConfig.codec === "avc" || this.encodingConfig.codec === "hevc"))
          throw new Error(`The dimensions ${i.width}x${i.height} are not supported for codec '${this.encodingConfig.codec}'; both width and height must be even numbers. Make sure to round your dimensions to the nearest even number.`);
        if (!(await VideoEncoder.isConfigSupported(i)).supported)
          throw new Error(`This specific encoder configuration (${i.codec}, ${i.bitrate} bps, ${i.width}x${i.height}, hardware acceleration: ${i.hardwareAcceleration ?? "no-preference"}) is not supported by this browser. Consider using another codec or changing your video parameters.`);
        const o = [], c = [];
        let l = 0, u = 0;
        const d = (h, f, p) => {
          const g = {};
          if (f) {
            const w = new Uint8Array(f.byteLength);
            f.copyTo(w), g.alpha = w;
          }
          const k = q.fromEncodedChunk(h, g);
          this.encodingConfig.onEncodedPacket?.(k, p), this.muxer.addEncodedVideoPacket(this.source._connectedTrack, k, p).catch((w) => {
            this.error ??= w, this.errorNeedsNewStack = !1;
          });
        };
        this.encoder = new VideoEncoder({
          output: (h, f) => {
            if (!this.alphaEncoder) {
              d(h, null, f);
              return;
            }
            const p = this.alphaFrameQueue.shift();
            m(p !== void 0), p ? (this.alphaEncoder.encode(p, {
              // Crucial: The alpha frame is forced to be a key frame whenever the color frame
              // also is. Without this, playback can glitch and even crash in some browsers.
              // This is the reason why the two encoders are wired in series and not in parallel.
              keyFrame: h.type === "key"
            }), u++, p.close(), o.push({ chunk: h, meta: f })) : u === 0 ? d(h, null, f) : (c.push(l + u), o.push({ chunk: h, meta: f }));
          },
          error: (h) => {
            h.stack = t.stack, this.error ??= h;
          }
        }), this.encoder.configure(i), this.encodingConfig.alpha === "keep" && (this.alphaEncoder = new VideoEncoder({
          // We ignore the alpha chunk's metadata
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          output: (h, f) => {
            u--;
            const p = o.shift();
            for (m(p !== void 0), d(p.chunk, h, p.meta), l++; c.length > 0 && c[0] === l; ) {
              c.shift();
              const g = o.shift();
              m(g !== void 0), d(g.chunk, null, g.meta);
            }
          },
          error: (h) => {
            h.stack = t.stack, this.error ??= h;
          }
        }), this.alphaEncoder.configure(i));
      }
      m(this.source._connectedTrack), this.muxer = this.source._connectedTrack.output._muxer, this.encoderInitialized = !0;
    })();
  }
  async flushAndClose(e) {
    e || this.checkForEncoderError(), this.customEncoder ? (e || this.customEncoderCallSerializer.call(() => this.customEncoder.flush()), await this.customEncoderCallSerializer.call(() => this.customEncoder.close())) : this.encoder && (e || (await this.encoder.flush(), await this.alphaEncoder?.flush()), this.encoder.state !== "closed" && this.encoder.close(), this.alphaEncoder && this.alphaEncoder.state !== "closed" && this.alphaEncoder.close(), this.alphaFrameQueue.forEach((t) => t?.close()), this.splitter?.close()), e || this.checkForEncoderError();
  }
  getQueueSize() {
    return this.customEncoder ? this.customEncoderQueueSize : this.encoder?.encodeQueueSize ?? 0;
  }
  checkForEncoderError() {
    if (this.error)
      throw this.errorNeedsNewStack && (this.error.stack = new Error().stack), this.error;
  }
}
class dl {
  constructor(e, t) {
    this.lastFrame = null, typeof OffscreenCanvas < "u" ? this.canvas = new OffscreenCanvas(e, t) : (this.canvas = document.createElement("canvas"), this.canvas.width = e, this.canvas.height = t);
    const i = this.canvas.getContext("webgl2", {
      alpha: !0
      // Needed due to the YUV thing we do for alpha
    });
    if (!i)
      throw new Error("Couldn't acquire WebGL 2 context.");
    this.gl = i, this.colorProgram = this.createColorProgram(), this.alphaProgram = this.createAlphaProgram(), this.vao = this.createVAO(), this.sourceTexture = this.createTexture(), this.alphaResolutionLocation = this.gl.getUniformLocation(this.alphaProgram, "u_resolution"), this.gl.useProgram(this.colorProgram), this.gl.uniform1i(this.gl.getUniformLocation(this.colorProgram, "u_sourceTexture"), 0), this.gl.useProgram(this.alphaProgram), this.gl.uniform1i(this.gl.getUniformLocation(this.alphaProgram, "u_sourceTexture"), 0);
  }
  createVertexShader() {
    return this.createShader(this.gl.VERTEX_SHADER, `#version 300 es
			in vec2 a_position;
			in vec2 a_texCoord;
			out vec2 v_texCoord;
			
			void main() {
				gl_Position = vec4(a_position, 0.0, 1.0);
				v_texCoord = a_texCoord;
			}
		`);
  }
  createColorProgram() {
    const e = this.createVertexShader(), t = this.createShader(this.gl.FRAGMENT_SHADER, `#version 300 es
			precision highp float;
			
			uniform sampler2D u_sourceTexture;
			in vec2 v_texCoord;
			out vec4 fragColor;
			
			void main() {
				vec4 source = texture(u_sourceTexture, v_texCoord);
				fragColor = vec4(source.rgb, 1.0);
			}
		`), i = this.gl.createProgram();
    return this.gl.attachShader(i, e), this.gl.attachShader(i, t), this.gl.linkProgram(i), i;
  }
  createAlphaProgram() {
    const e = this.createVertexShader(), t = this.createShader(this.gl.FRAGMENT_SHADER, `#version 300 es
			precision highp float;
			
			uniform sampler2D u_sourceTexture;
			uniform vec2 u_resolution; // The width and height of the canvas
			in vec2 v_texCoord;
			out vec4 fragColor;

			// This function determines the value for a single byte in the YUV stream
			float getByteValue(float byteOffset) {
				float width = u_resolution.x;
				float height = u_resolution.y;

				float yPlaneSize = width * height;

				if (byteOffset < yPlaneSize) {
					// This byte is in the luma plane. Find the corresponding pixel coordinates to sample from
					float y = floor(byteOffset / width);
					float x = mod(byteOffset, width);
					
					// Add 0.5 to sample the center of the texel
					vec2 sampleCoord = (vec2(x, y) + 0.5) / u_resolution;
					
					// The luma value is the alpha from the source texture
					return texture(u_sourceTexture, sampleCoord).a;
				} else {
					// Write a fixed value for chroma and beyond
					return 128.0 / 255.0;
				}
			}
			
			void main() {
				// Each fragment writes 4 bytes (R, G, B, A)
				float pixelIndex = floor(gl_FragCoord.y) * u_resolution.x + floor(gl_FragCoord.x);
				float baseByteOffset = pixelIndex * 4.0;

				vec4 result;
				for (int i = 0; i < 4; i++) {
					float currentByteOffset = baseByteOffset + float(i);
					result[i] = getByteValue(currentByteOffset);
				}
				
				fragColor = result;
			}
		`), i = this.gl.createProgram();
    return this.gl.attachShader(i, e), this.gl.attachShader(i, t), this.gl.linkProgram(i), i;
  }
  createShader(e, t) {
    const i = this.gl.createShader(e);
    return this.gl.shaderSource(i, t), this.gl.compileShader(i), this.gl.getShaderParameter(i, this.gl.COMPILE_STATUS) || console.error("Shader compile error:", this.gl.getShaderInfoLog(i)), i;
  }
  createVAO() {
    const e = this.gl.createVertexArray();
    this.gl.bindVertexArray(e);
    const t = new Float32Array([
      -1,
      -1,
      0,
      1,
      1,
      -1,
      1,
      1,
      -1,
      1,
      0,
      0,
      1,
      1,
      1,
      0
    ]), i = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, i), this.gl.bufferData(this.gl.ARRAY_BUFFER, t, this.gl.STATIC_DRAW);
    const s = this.gl.getAttribLocation(this.colorProgram, "a_position"), n = this.gl.getAttribLocation(this.colorProgram, "a_texCoord");
    return this.gl.enableVertexAttribArray(s), this.gl.vertexAttribPointer(s, 2, this.gl.FLOAT, !1, 16, 0), this.gl.enableVertexAttribArray(n), this.gl.vertexAttribPointer(n, 2, this.gl.FLOAT, !1, 16, 8), e;
  }
  createTexture() {
    const e = this.gl.createTexture();
    return this.gl.bindTexture(this.gl.TEXTURE_2D, e), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR), e;
  }
  updateTexture(e) {
    this.lastFrame !== e && ((e.displayWidth !== this.canvas.width || e.displayHeight !== this.canvas.height) && (this.canvas.width = e.displayWidth, this.canvas.height = e.displayHeight), this.gl.activeTexture(this.gl.TEXTURE0), this.gl.bindTexture(this.gl.TEXTURE_2D, this.sourceTexture), this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, e), this.lastFrame = e);
  }
  extractColor(e) {
    return this.updateTexture(e), this.gl.useProgram(this.colorProgram), this.gl.viewport(0, 0, this.canvas.width, this.canvas.height), this.gl.clear(this.gl.COLOR_BUFFER_BIT), this.gl.bindVertexArray(this.vao), this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4), new VideoFrame(this.canvas, {
      timestamp: e.timestamp,
      duration: e.duration ?? void 0,
      alpha: "discard"
    });
  }
  extractAlpha(e) {
    this.updateTexture(e), this.gl.useProgram(this.alphaProgram), this.gl.uniform2f(this.alphaResolutionLocation, this.canvas.width, this.canvas.height), this.gl.viewport(0, 0, this.canvas.width, this.canvas.height), this.gl.clear(this.gl.COLOR_BUFFER_BIT), this.gl.bindVertexArray(this.vao), this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    const { width: t, height: i } = this.canvas, s = Math.ceil(t / 2) * Math.ceil(i / 2), n = t * i + s * 2, a = Math.ceil(n / (t * 4));
    let o = new Uint8Array(4 * t * a);
    this.gl.readPixels(0, 0, t, a, this.gl.RGBA, this.gl.UNSIGNED_BYTE, o), o = o.subarray(0, n), m(o[t * i] === 128), m(o[o.length - 1] === 128);
    const c = {
      format: "I420",
      codedWidth: t,
      codedHeight: i,
      timestamp: e.timestamp,
      duration: e.duration ?? void 0,
      transfer: [o.buffer]
    };
    return new VideoFrame(o, c);
  }
  close() {
    this.gl.getExtension("WEBGL_lose_context")?.loseContext(), this.gl = null;
  }
}
class cs extends Ai {
  /**
   * Creates a new {@link VideoSampleSource} whose samples are encoded according to the specified
   * {@link VideoEncodingConfig}.
   */
  constructor(e) {
    rl(e), super(e.codec), this._encoder = new ul(this, e);
  }
  /**
   * Encodes a video sample (frame) and then adds it to the output.
   *
   * @returns A Promise that resolves once the output is ready to receive more samples. You should await this Promise
   * to respect writer and encoder backpressure.
   */
  add(e, t) {
    if (!(e instanceof ae))
      throw new TypeError("videoSample must be a VideoSample.");
    return this._encoder.add(e, !1, t);
  }
  /** @internal */
  _flushAndClose(e) {
    return this._encoder.flushAndClose(e);
  }
}
class Bi extends Fi {
  /** Internal constructor. */
  constructor(e) {
    if (super(), this._connectedTrack = null, !_e.includes(e))
      throw new TypeError(`Invalid audio codec '${e}'. Must be one of: ${_e.join(", ")}.`);
    this._codec = e;
  }
}
class hl extends Bi {
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
    if (!(e instanceof q))
      throw new TypeError("packet must be an EncodedPacket.");
    if (e.isMetadataOnly)
      throw new TypeError("Metadata-only packets cannot be added.");
    if (t !== void 0 && (!t || typeof t != "object"))
      throw new TypeError("meta, when provided, must be an object.");
    return this._ensureValidAdd(), this._connectedTrack.output._muxer.addEncodedAudioPacket(this._connectedTrack, e, t);
  }
}
class fl {
  constructor(e, t) {
    this.source = e, this.encodingConfig = t, this.ensureEncoderPromise = null, this.encoderInitialized = !1, this.encoder = null, this.muxer = null, this.lastNumberOfChannels = null, this.lastSampleRate = null, this.isPcmEncoder = !1, this.outputSampleSize = null, this.writeOutputValue = null, this.customEncoder = null, this.customEncoderCallSerializer = new wr(), this.customEncoderQueueSize = 0, this.lastEndSampleIndex = null, this.error = null, this.errorNeedsNewStack = !0;
  }
  async add(e, t) {
    try {
      if (this.checkForEncoderError(), this.source._ensureValidAdd(), this.lastNumberOfChannels !== null && this.lastSampleRate !== null) {
        if (e.numberOfChannels !== this.lastNumberOfChannels || e.sampleRate !== this.lastSampleRate)
          throw new Error(`Audio parameters must remain constant. Expected ${this.lastNumberOfChannels} channels at ${this.lastSampleRate} Hz, got ${e.numberOfChannels} channels at ${e.sampleRate} Hz.`);
      } else
        this.lastNumberOfChannels = e.numberOfChannels, this.lastSampleRate = e.sampleRate;
      this.encoderInitialized || (this.ensureEncoderPromise || this.ensureEncoder(e), this.encoderInitialized || await this.ensureEncoderPromise), m(this.encoderInitialized);
      {
        const i = Math.round(e.timestamp * e.sampleRate), s = Math.round((e.timestamp + e.duration) * e.sampleRate);
        if (this.lastEndSampleIndex === null)
          this.lastEndSampleIndex = s;
        else {
          const n = i - this.lastEndSampleIndex;
          if (n >= 64) {
            const a = new pe({
              data: new Float32Array(n * e.numberOfChannels),
              format: "f32-planar",
              sampleRate: e.sampleRate,
              numberOfChannels: e.numberOfChannels,
              numberOfFrames: n,
              timestamp: this.lastEndSampleIndex / e.sampleRate
            });
            await this.add(a, !0);
          }
          this.lastEndSampleIndex += e.numberOfFrames;
        }
      }
      if (this.customEncoder) {
        this.customEncoderQueueSize++;
        const i = e.clone(), s = this.customEncoderCallSerializer.call(() => this.customEncoder.encode(i)).then(() => this.customEncoderQueueSize--).catch((n) => this.error ??= n).finally(() => {
          i.close();
        });
        this.customEncoderQueueSize >= 4 && await s, await this.muxer.mutex.currentPromise;
      } else if (this.isPcmEncoder)
        await this.doPcmEncoding(e, t);
      else {
        m(this.encoder);
        const i = e.toAudioData();
        this.encoder.encode(i), i.close(), t && e.close(), this.encoder.encodeQueueSize >= 4 && await new Promise((s) => this.encoder.addEventListener("dequeue", s, { once: !0 })), await this.muxer.mutex.currentPromise;
      }
    } finally {
      t && e.close();
    }
  }
  async doPcmEncoding(e, t) {
    m(this.outputSampleSize), m(this.writeOutputValue);
    const { numberOfChannels: i, numberOfFrames: s, sampleRate: n, timestamp: a } = e, o = 2048, c = [];
    for (let h = 0; h < s; h += o) {
      const f = Math.min(o, e.numberOfFrames - h), p = f * i * this.outputSampleSize, g = new ArrayBuffer(p), k = new DataView(g);
      c.push({ frameCount: f, view: k });
    }
    const l = e.allocationSize({ planeIndex: 0, format: "f32-planar" }), u = new Float32Array(l / Float32Array.BYTES_PER_ELEMENT);
    for (let h = 0; h < i; h++) {
      e.copyTo(u, { planeIndex: h, format: "f32-planar" });
      for (let f = 0; f < c.length; f++) {
        const { frameCount: p, view: g } = c[f];
        for (let k = 0; k < p; k++)
          this.writeOutputValue(g, (k * i + h) * this.outputSampleSize, u[f * o + k]);
      }
    }
    t && e.close();
    const d = {
      decoderConfig: {
        codec: this.encodingConfig.codec,
        numberOfChannels: i,
        sampleRate: n
      }
    };
    for (let h = 0; h < c.length; h++) {
      const { frameCount: f, view: p } = c[h], g = p.buffer, k = h * o, w = new q(new Uint8Array(g), "key", a + k / n, f / n);
      this.encodingConfig.onEncodedPacket?.(w, d), await this.muxer.addEncodedAudioPacket(this.source._connectedTrack, w, d);
    }
  }
  ensureEncoder(e) {
    const t = new Error();
    this.ensureEncoderPromise = (async () => {
      const { numberOfChannels: i, sampleRate: s } = e, n = ni({
        numberOfChannels: i,
        sampleRate: s,
        ...this.encodingConfig
      });
      this.encodingConfig.onEncoderConfig?.(n);
      const a = Kr.find((o) => o.supports(this.encodingConfig.codec, n));
      if (a)
        this.customEncoder = new a(), this.customEncoder.codec = this.encodingConfig.codec, this.customEncoder.config = n, this.customEncoder.onPacket = (o, c) => {
          if (!(o instanceof q))
            throw new TypeError("The first argument passed to onPacket must be an EncodedPacket.");
          if (c !== void 0 && (!c || typeof c != "object"))
            throw new TypeError("The second argument passed to onPacket must be an object or undefined.");
          this.encodingConfig.onEncodedPacket?.(o, c), this.muxer.addEncodedAudioPacket(this.source._connectedTrack, o, c).catch((l) => {
            this.error ??= l, this.errorNeedsNewStack = !1;
          });
        }, await this.customEncoder.init();
      else if (oe.includes(this.encodingConfig.codec))
        this.initPcmEncoder();
      else {
        if (typeof AudioEncoder > "u")
          throw new Error("AudioEncoder is not supported by this browser.");
        if (!(await AudioEncoder.isConfigSupported(n)).supported)
          throw new Error(`This specific encoder configuration (${n.codec}, ${n.bitrate} bps, ${n.numberOfChannels} channels, ${n.sampleRate} Hz) is not supported by this browser. Consider using another codec or changing your audio parameters.`);
        this.encoder = new AudioEncoder({
          output: (c, l) => {
            if (this.encodingConfig.codec === "aac" && l?.decoderConfig) {
              let d = !1;
              if (!l.decoderConfig.description || l.decoderConfig.description.byteLength < 2 ? d = !0 : d = pi(he(l.decoderConfig.description)).objectType === 0, d) {
                const h = Number(K(n.codec.split(".")));
                l.decoderConfig.description = ys({
                  objectType: h,
                  numberOfChannels: l.decoderConfig.numberOfChannels,
                  sampleRate: l.decoderConfig.sampleRate
                });
              }
            }
            const u = q.fromEncodedChunk(c);
            this.encodingConfig.onEncodedPacket?.(u, l), this.muxer.addEncodedAudioPacket(this.source._connectedTrack, u, l).catch((d) => {
              this.error ??= d, this.errorNeedsNewStack = !1;
            });
          },
          error: (c) => {
            c.stack = t.stack, this.error ??= c;
          }
        }), this.encoder.configure(n);
      }
      m(this.source._connectedTrack), this.muxer = this.source._connectedTrack.output._muxer, this.encoderInitialized = !0;
    })();
  }
  initPcmEncoder() {
    this.isPcmEncoder = !0;
    const e = this.encodingConfig.codec, { dataType: t, sampleSize: i, littleEndian: s } = Ye(e);
    switch (this.outputSampleSize = i, i) {
      case 1:
        t === "unsigned" ? this.writeOutputValue = (n, a, o) => n.setUint8(a, ee((o + 1) * 127.5, 0, 255)) : t === "signed" ? this.writeOutputValue = (n, a, o) => {
          n.setInt8(a, ee(Math.round(o * 128), -128, 127));
        } : t === "ulaw" ? this.writeOutputValue = (n, a, o) => {
          const c = ee(Math.floor(o * 32767), -32768, 32767);
          n.setUint8(a, ua(c));
        } : t === "alaw" ? this.writeOutputValue = (n, a, o) => {
          const c = ee(Math.floor(o * 32767), -32768, 32767);
          n.setUint8(a, ha(c));
        } : m(!1);
        break;
      case 2:
        t === "unsigned" ? this.writeOutputValue = (n, a, o) => n.setUint16(a, ee((o + 1) * 32767.5, 0, 65535), s) : t === "signed" ? this.writeOutputValue = (n, a, o) => n.setInt16(a, ee(Math.round(o * 32767), -32768, 32767), s) : m(!1);
        break;
      case 3:
        t === "unsigned" ? this.writeOutputValue = (n, a, o) => hi(n, a, ee((o + 1) * 83886075e-1, 0, 16777215), s) : t === "signed" ? this.writeOutputValue = (n, a, o) => vn(n, a, ee(Math.round(o * 8388607), -8388608, 8388607), s) : m(!1);
        break;
      case 4:
        t === "unsigned" ? this.writeOutputValue = (n, a, o) => n.setUint32(a, ee((o + 1) * 21474836475e-1, 0, 4294967295), s) : t === "signed" ? this.writeOutputValue = (n, a, o) => n.setInt32(a, ee(Math.round(o * 2147483647), -2147483648, 2147483647), s) : t === "float" ? this.writeOutputValue = (n, a, o) => n.setFloat32(a, o, s) : m(!1);
        break;
      case 8:
        t === "float" ? this.writeOutputValue = (n, a, o) => n.setFloat64(a, o, s) : m(!1);
        break;
      default:
        Ge(i), m(!1);
    }
  }
  async flushAndClose(e) {
    e || this.checkForEncoderError(), this.customEncoder ? (e || this.customEncoderCallSerializer.call(() => this.customEncoder.flush()), await this.customEncoderCallSerializer.call(() => this.customEncoder.close())) : this.encoder && (e || await this.encoder.flush(), this.encoder.state !== "closed" && this.encoder.close()), e || this.checkForEncoderError();
  }
  getQueueSize() {
    return this.customEncoder ? this.customEncoderQueueSize : this.isPcmEncoder ? 0 : this.encoder?.encodeQueueSize ?? 0;
  }
  checkForEncoderError() {
    if (this.error)
      throw this.errorNeedsNewStack && (this.error.stack = new Error().stack), this.error;
  }
}
class ls extends Bi {
  /**
   * Creates a new {@link AudioSampleSource} whose samples are encoded according to the specified
   * {@link AudioEncodingConfig}.
   */
  constructor(e) {
    il(e), super(e.codec), this._encoder = new fl(this, e);
  }
  /**
   * Encodes an audio sample and then adds it to the output.
   *
   * @returns A Promise that resolves once the output is ready to receive more samples. You should await this Promise
   * to respect writer and encoder backpressure.
   */
  add(e) {
    if (!(e instanceof pe))
      throw new TypeError("audioSample must be an AudioSample.");
    return this._encoder.add(e, !1);
  }
  /** @internal */
  _flushAndClose(e) {
    return this._encoder.flushAndClose(e);
  }
}
class ml extends Fi {
  /** Internal constructor. */
  constructor(e) {
    if (super(), this._connectedTrack = null, !ur.includes(e))
      throw new TypeError(`Invalid subtitle codec '${e}'. Must be one of: ${ur.join(", ")}.`);
    this._codec = e;
  }
}
const pl = ["video", "audio", "subtitle"], Lr = (r) => {
  if (!r || typeof r != "object")
    throw new TypeError("metadata must be an object.");
  if (r.languageCode !== void 0 && !jt(r.languageCode))
    throw new TypeError("metadata.languageCode, when provided, must be a three-letter, ISO 639-2/T language code.");
  if (r.name !== void 0 && typeof r.name != "string")
    throw new TypeError("metadata.name, when provided, must be a string.");
  if (r.disposition !== void 0 && Bn(r.disposition), r.maximumPacketCount !== void 0 && (!Number.isInteger(r.maximumPacketCount) || r.maximumPacketCount < 0))
    throw new TypeError("metadata.maximumPacketCount, when provided, must be a non-negative integer.");
};
class ci {
  /**
   * Creates a new instance of {@link Output} which can then be used to create a new media file according to the
   * specified {@link OutputOptions}.
   */
  constructor(e) {
    if (this.state = "pending", this._tracks = [], this._startPromise = null, this._cancelPromise = null, this._finalizePromise = null, this._mutex = new ut(), this._metadataTags = {}, !e || typeof e != "object")
      throw new TypeError("options must be an object.");
    if (!(e.format instanceof fn))
      throw new TypeError("options.format must be an OutputFormat.");
    if (!(e.target instanceof _i))
      throw new TypeError("options.target must be a Target.");
    if (e.target._output)
      throw new Error("Target is already used for another output.");
    e.target._output = this, this.format = e.format, this.target = e.target, this._writer = e.target._createWriter(), this._muxer = e.format._createMuxer(this);
  }
  /** Adds a video track to the output with the given source. Can only be called before the output is started. */
  addVideoTrack(e, t = {}) {
    if (!(e instanceof Ai))
      throw new TypeError("source must be a VideoSource.");
    if (Lr(t), t.rotation !== void 0 && ![0, 90, 180, 270].includes(t.rotation))
      throw new TypeError(`Invalid video rotation: ${t.rotation}. Has to be 0, 90, 180 or 270.`);
    if (!this.format.supportsVideoRotationMetadata && t.rotation)
      throw new Error(`${this.format._name} does not support video rotation metadata.`);
    if (t.frameRate !== void 0 && (!Number.isFinite(t.frameRate) || t.frameRate <= 0))
      throw new TypeError(`Invalid video frame rate: ${t.frameRate}. Must be a positive number.`);
    this._addTrack("video", e, t);
  }
  /** Adds an audio track to the output with the given source. Can only be called before the output is started. */
  addAudioTrack(e, t = {}) {
    if (!(e instanceof Bi))
      throw new TypeError("source must be an AudioSource.");
    Lr(t), this._addTrack("audio", e, t);
  }
  /** Adds a subtitle track to the output with the given source. Can only be called before the output is started. */
  addSubtitleTrack(e, t = {}) {
    if (!(e instanceof ml))
      throw new TypeError("source must be a SubtitleSource.");
    Lr(t), this._addTrack("subtitle", e, t);
  }
  /**
   * Sets descriptive metadata tags about the media file, such as title, author, date, or cover art. When called
   * multiple times, only the metadata from the last call will be used.
   *
   * Can only be called before the output is started.
   */
  setMetadataTags(e) {
    if (jr(e), this.state !== "pending")
      throw new Error("Cannot set metadata tags after output has been started or canceled.");
    this._metadataTags = e;
  }
  /** @internal */
  _addTrack(e, t, i) {
    if (this.state !== "pending")
      throw new Error("Cannot add track after output has been started or canceled.");
    if (t._connectedTrack)
      throw new Error("Source is already used for a track.");
    const s = this.format.getSupportedTrackCounts(), n = this._tracks.reduce((l, u) => l + (u.type === e ? 1 : 0), 0), a = s[e].max;
    if (n === a)
      throw new Error(a === 0 ? `${this.format._name} does not support ${e} tracks.` : `${this.format._name} does not support more than ${a} ${e} track${a === 1 ? "" : "s"}.`);
    const o = s.total.max;
    if (this._tracks.length === o)
      throw new Error(`${this.format._name} does not support more than ${o} tracks${o === 1 ? "" : "s"} in total.`);
    const c = {
      id: this._tracks.length + 1,
      output: this,
      type: e,
      source: t,
      metadata: i
    };
    if (c.type === "video") {
      const l = this.format.getSupportedVideoCodecs();
      if (l.length === 0)
        throw new Error(`${this.format._name} does not support video tracks.` + this.format._codecUnsupportedHint(c.source._codec));
      if (!l.includes(c.source._codec))
        throw new Error(`Codec '${c.source._codec}' cannot be contained within ${this.format._name}. Supported video codecs are: ${l.map((u) => `'${u}'`).join(", ")}.` + this.format._codecUnsupportedHint(c.source._codec));
    } else if (c.type === "audio") {
      const l = this.format.getSupportedAudioCodecs();
      if (l.length === 0)
        throw new Error(`${this.format._name} does not support audio tracks.` + this.format._codecUnsupportedHint(c.source._codec));
      if (!l.includes(c.source._codec))
        throw new Error(`Codec '${c.source._codec}' cannot be contained within ${this.format._name}. Supported audio codecs are: ${l.map((u) => `'${u}'`).join(", ")}.` + this.format._codecUnsupportedHint(c.source._codec));
    } else if (c.type === "subtitle") {
      const l = this.format.getSupportedSubtitleCodecs();
      if (l.length === 0)
        throw new Error(`${this.format._name} does not support subtitle tracks.` + this.format._codecUnsupportedHint(c.source._codec));
      if (!l.includes(c.source._codec))
        throw new Error(`Codec '${c.source._codec}' cannot be contained within ${this.format._name}. Supported subtitle codecs are: ${l.map((u) => `'${u}'`).join(", ")}.` + this.format._codecUnsupportedHint(c.source._codec));
    }
    this._tracks.push(c), t._connectedTrack = c;
  }
  /**
   * Starts the creation of the output file. This method should be called after all tracks have been added. Only after
   * the output has started can media samples be added to the tracks.
   *
   * @returns A promise that resolves when the output has successfully started and is ready to receive media samples.
   */
  async start() {
    const e = this.format.getSupportedTrackCounts();
    for (const i of pl) {
      const s = this._tracks.reduce((a, o) => a + (o.type === i ? 1 : 0), 0), n = e[i].min;
      if (s < n)
        throw new Error(n === e[i].max ? `${this.format._name} requires exactly ${n} ${i} track${n === 1 ? "" : "s"}.` : `${this.format._name} requires at least ${n} ${i} track${n === 1 ? "" : "s"}.`);
    }
    const t = e.total.min;
    if (this._tracks.length < t)
      throw new Error(t === e.total.max ? `${this.format._name} requires exactly ${t} track${t === 1 ? "" : "s"}.` : `${this.format._name} requires at least ${t} track${t === 1 ? "" : "s"}.`);
    if (this.state === "canceled")
      throw new Error("Output has been canceled.");
    return this._startPromise ? (console.warn("Output has already been started."), this._startPromise) : this._startPromise = (async () => {
      this.state = "started", this._writer.start();
      const i = await this._mutex.acquire();
      await this._muxer.start();
      const s = this._tracks.map((n) => n.source._start());
      await Promise.all(s), i();
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
      return console.warn("Output has already been canceled."), this._cancelPromise;
    if (this.state === "finalizing" || this.state === "finalized") {
      console.warn("Output has already been finalized.");
      return;
    }
    return this._cancelPromise = (async () => {
      this.state = "canceled";
      const e = await this._mutex.acquire(), t = this._tracks.map((i) => i.source._flushOrWaitForOngoingClose(!0));
      await Promise.all(t), await this._writer.close(), e();
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
    return this._finalizePromise ? (console.warn("Output has already been finalized."), this._finalizePromise) : this._finalizePromise = (async () => {
      this.state = "finalizing";
      const e = await this._mutex.acquire(), t = this._tracks.map((i) => i.source._flushOrWaitForOngoingClose(!1));
      await Promise.all(t), await this._muxer.finalize(), await this._writer.flush(), await this._writer.finalize(), this.state = "finalized", e();
    })();
  }
}
const us = (r) => {
  if (r !== void 0 && (!r || typeof r != "object"))
    throw new TypeError("options.video, when provided, must be an object.");
  if (r?.discard !== void 0 && typeof r.discard != "boolean")
    throw new TypeError("options.video.discard, when provided, must be a boolean.");
  if (r?.forceTranscode !== void 0 && typeof r.forceTranscode != "boolean")
    throw new TypeError("options.video.forceTranscode, when provided, must be a boolean.");
  if (r?.codec !== void 0 && !Ie.includes(r.codec))
    throw new TypeError(`options.video.codec, when provided, must be one of: ${Ie.join(", ")}.`);
  if (r?.bitrate !== void 0 && !(r.bitrate instanceof ye) && (!Number.isInteger(r.bitrate) || r.bitrate <= 0))
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
  if (r?.crop !== void 0 && Ti(r.crop, "options.video."), r?.frameRate !== void 0 && (!Number.isFinite(r.frameRate) || r.frameRate <= 0))
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
}, ds = (r) => {
  if (r !== void 0 && (!r || typeof r != "object"))
    throw new TypeError("options.audio, when provided, must be an object.");
  if (r?.discard !== void 0 && typeof r.discard != "boolean")
    throw new TypeError("options.audio.discard, when provided, must be a boolean.");
  if (r?.forceTranscode !== void 0 && typeof r.forceTranscode != "boolean")
    throw new TypeError("options.audio.forceTranscode, when provided, must be a boolean.");
  if (r?.codec !== void 0 && !_e.includes(r.codec))
    throw new TypeError(`options.audio.codec, when provided, must be one of: ${_e.join(", ")}.`);
  if (r?.bitrate !== void 0 && !(r.bitrate instanceof ye) && (!Number.isInteger(r.bitrate) || r.bitrate <= 0))
    throw new TypeError("options.audio.bitrate, when provided, must be a positive integer or a quality.");
  if (r?.numberOfChannels !== void 0 && (!Number.isInteger(r.numberOfChannels) || r.numberOfChannels <= 0))
    throw new TypeError("options.audio.numberOfChannels, when provided, must be a positive integer.");
  if (r?.sampleRate !== void 0 && (!Number.isInteger(r.sampleRate) || r.sampleRate <= 0))
    throw new TypeError("options.audio.sampleRate, when provided, must be a positive integer.");
  if (r?.process !== void 0 && typeof r.process != "function")
    throw new TypeError("options.audio.process, when provided, must be a function.");
  if (r?.processedNumberOfChannels !== void 0 && (!Number.isInteger(r.processedNumberOfChannels) || r.processedNumberOfChannels <= 0))
    throw new TypeError("options.audio.processedNumberOfChannels, when provided, must be a positive integer.");
  if (r?.processedSampleRate !== void 0 && (!Number.isInteger(r.processedSampleRate) || r.processedSampleRate <= 0))
    throw new TypeError("options.audio.processedSampleRate, when provided, must be a positive integer.");
}, Wr = 2, Hr = 48e3;
class Ri {
  /** Initializes a new conversion process without starting the conversion. */
  static async init(e) {
    const t = new Ri(e);
    return await t._init(), t;
  }
  /** Creates a new Conversion instance (duh). */
  constructor(e) {
    if (this._addedCounts = {
      video: 0,
      audio: 0,
      subtitle: 0
    }, this._totalTrackCount = 0, this._trackPromises = [], this._executed = !1, this._synchronizer = new kl(), this._totalDuration = null, this._maxTimestamps = /* @__PURE__ */ new Map(), this._canceled = !1, this.onProgress = void 0, this._computeProgress = !1, this._lastProgress = 0, this.isValid = !1, this.utilizedTracks = [], this.discardedTracks = [], !e || typeof e != "object")
      throw new TypeError("options must be an object.");
    if (!(e.input instanceof ti))
      throw new TypeError("options.input must be an Input.");
    if (!(e.output instanceof ci))
      throw new TypeError("options.output must be an Output.");
    if (e.output._tracks.length > 0 || Object.keys(e.output._metadataTags).length > 0 || e.output.state !== "pending")
      throw new TypeError("options.output must be fresh: no tracks or metadata tags added and not started.");
    if (typeof e.video != "function" && us(e.video), typeof e.audio != "function" && ds(e.audio), e.trim !== void 0 && (!e.trim || typeof e.trim != "object"))
      throw new TypeError("options.trim, when provided, must be an object.");
    if (e.trim?.start !== void 0 && (!Number.isFinite(e.trim.start) || e.trim.start < 0))
      throw new TypeError("options.trim.start, when provided, must be a non-negative number.");
    if (e.trim?.end !== void 0 && (!Number.isFinite(e.trim.end) || e.trim.end < 0))
      throw new TypeError("options.trim.end, when provided, must be a non-negative number.");
    if (e.trim?.start !== void 0 && e.trim.end !== void 0 && e.trim.start >= e.trim.end)
      throw new TypeError("options.trim.start must be less than options.trim.end.");
    if (e.tags !== void 0 && (typeof e.tags != "object" || !e.tags) && typeof e.tags != "function")
      throw new TypeError("options.tags, when provided, must be an object or a function.");
    if (typeof e.tags == "object" && jr(e.tags), e.showWarnings !== void 0 && typeof e.showWarnings != "boolean")
      throw new TypeError("options.showWarnings, when provided, must be a boolean.");
    this._options = e, this.input = e.input, this.output = e.output;
    const { promise: t, resolve: i } = se();
    this._started = t, this._start = i;
  }
  /** @internal */
  async _init() {
    this._startTimestamp = this._options.trim?.start ?? Math.max(
      await this.input.getFirstTimestamp(),
      // Samples can also have negative timestamps, but the meaning typically is "don't present me", so let's cut
      // those out by default.
      0
    ), this._endTimestamp = this._options.trim?.end ?? 1 / 0;
    const e = await this.input.getTracks(), t = this.output.format.getSupportedTrackCounts();
    let i = 1, s = 1;
    for (const l of e) {
      let u;
      if (l.isVideoTrack() ? this._options.video && (typeof this._options.video == "function" ? (u = await this._options.video(l, i), us(u), i++) : u = this._options.video) : l.isAudioTrack() ? this._options.audio && (typeof this._options.audio == "function" ? (u = await this._options.audio(l, s), ds(u), s++) : u = this._options.audio) : m(!1), u?.discard) {
        this.discardedTracks.push({
          track: l,
          reason: "discarded_by_user"
        });
        continue;
      }
      if (this._totalTrackCount === t.total.max) {
        this.discardedTracks.push({
          track: l,
          reason: "max_track_count_reached"
        });
        continue;
      }
      if (this._addedCounts[l.type] === t[l.type].max) {
        this.discardedTracks.push({
          track: l,
          reason: "max_track_count_of_type_reached"
        });
        continue;
      }
      l.isVideoTrack() ? await this._processVideoTrack(l, u ?? {}) : l.isAudioTrack() && await this._processAudioTrack(l, u ?? {});
    }
    const n = await this.input.getMetadataTags();
    let a;
    if (this._options.tags) {
      const l = typeof this._options.tags == "function" ? await this._options.tags(n) : this._options.tags;
      jr(l), a = l;
    } else
      a = n;
    const o = (await this.input.getFormat()).mimeType === this.output.format.mimeType, c = n.raw === a.raw;
    if (n.raw && c && !o && delete a.raw, this.output.setMetadataTags(a), this.isValid = this._totalTrackCount >= t.total.min && this._addedCounts.video >= t.video.min && this._addedCounts.audio >= t.audio.min && this._addedCounts.subtitle >= t.subtitle.min, this._options.showWarnings ?? !0) {
      const l = [], u = this.discardedTracks.filter((d) => d.reason !== "discarded_by_user");
      u.length > 0 && l.push("Some tracks had to be discarded from the conversion:", u), this.isValid || l.push(`

` + this._getInvalidityExplanation().join("")), l.length > 0 && console.warn(...l);
    }
  }
  /** @internal */
  _getInvalidityExplanation() {
    const e = [];
    if (this.discardedTracks.length === 0)
      e.push("Due to missing tracks, this conversion cannot be executed.");
    else {
      const t = this.discardedTracks.every((i) => i.reason === "discarded_by_user" || i.reason === "no_encodable_target_codec");
      if (e.push("Due to discarded tracks, this conversion cannot be executed."), t) {
        const i = this.discardedTracks.flatMap((s) => s.reason === "discarded_by_user" ? [] : s.track.type === "video" ? this.output.format.getSupportedVideoCodecs() : s.track.type === "audio" ? this.output.format.getSupportedAudioCodecs() : this.output.format.getSupportedSubtitleCodecs());
        i.length === 1 ? e.push(`
Tracks were discarded because your environment is not able to encode '${i[0]}'.`) : e.push(`
Tracks were discarded because your environment is not able to encode any of the following codecs: ${i.map((s) => `'${s}'`).join(", ")}.`), i.includes("mp3") && e.push(`
The @mediabunny/mp3-encoder extension package provides support for encoding MP3.`);
      } else
        e.push(`
Check the discardedTracks field for more info.`);
    }
    return e;
  }
  /**
   * Executes the conversion process. Resolves once conversion is complete.
   *
   * Will throw if `isValid` is `false`.
   */
  async execute() {
    if (!this.isValid)
      throw new Error(`Cannot execute this conversion because its output configuration is invalid. Make sure to always check the isValid field before executing a conversion.
` + this._getInvalidityExplanation().join(""));
    if (this._executed)
      throw new Error("Conversion cannot be executed twice.");
    if (this._executed = !0, this.onProgress) {
      this._computeProgress = !0, this._totalDuration = Math.min(await this.input.computeDuration() - this._startTimestamp, this._endTimestamp - this._startTimestamp);
      for (const e of this.utilizedTracks)
        this._maxTimestamps.set(e.id, 0);
      this.onProgress?.(0);
    }
    await this.output.start(), this._start();
    try {
      await Promise.all(this._trackPromises);
    } catch (e) {
      throw this._canceled || this.cancel(), e;
    }
    if (this._canceled)
      throw new gl();
    await this.output.finalize(), this._computeProgress && this.onProgress?.(1);
  }
  /**
   * Cancels the conversion process, causing any ongoing `execute` call to throw a `ConversionCanceledError`.
   * Does nothing if the conversion is already complete.
   */
  async cancel() {
    if (!(this.output.state === "finalizing" || this.output.state === "finalized")) {
      if (this._canceled) {
        console.warn("Conversion already canceled.");
        return;
      }
      this._canceled = !0, await this.output.cancel();
    }
  }
  /** @internal */
  async _processVideoTrack(e, t) {
    const i = e.codec;
    if (!i) {
      this.discardedTracks.push({
        track: e,
        reason: "unknown_source_codec"
      });
      return;
    }
    let s;
    const n = li(e.rotation + (t.rotate ?? 0)), a = this.output.format.supportsVideoRotationMetadata && (t.allowRotationMetadata ?? !0), [o, c] = n % 180 === 0 ? [e.codedWidth, e.codedHeight] : [e.codedHeight, e.codedWidth], l = t.crop;
    l && yi(l, o, c);
    const [u, d] = l ? [l.width, l.height] : [o, c];
    let h = u, f = d;
    const p = h / f, g = (x) => Math.ceil(x / 2) * 2;
    t.width !== void 0 && t.height === void 0 ? (h = g(t.width), f = g(Math.round(h / p))) : t.width === void 0 && t.height !== void 0 ? (f = g(t.height), h = g(Math.round(f * p))) : t.width !== void 0 && t.height !== void 0 && (h = g(t.width), f = g(t.height));
    const k = await e.getFirstTimestamp(), w = !!t.forceTranscode || k < this._startTimestamp || !!t.frameRate || t.keyFrameInterval !== void 0 || t.process !== void 0;
    let b = h !== u || f !== d || n !== 0 && (!a || t.process !== void 0) || !!l;
    const y = t.alpha ?? "discard";
    let T = this.output.format.getSupportedVideoCodecs();
    if (!w && !t.bitrate && !b && T.includes(i) && (!t.codec || t.codec === i)) {
      const x = new ll(i);
      s = x, this._trackPromises.push((async () => {
        await this._started;
        const S = new Kt(e), C = { decoderConfig: await e.getDecoderConfig() ?? void 0 }, R = Number.isFinite(this._endTimestamp) ? await S.getPacket(this._endTimestamp, { metadataOnly: !0 }) ?? void 0 : void 0;
        for await (const M of S.packets(void 0, R, { verifyKeyPackets: !0 })) {
          if (this._canceled)
            return;
          const F = M.clone({
            timestamp: M.timestamp - this._startTimestamp,
            sideData: y === "discard" ? {} : M.sideData
          });
          m(F.timestamp >= 0), this._reportProgress(e.id, F.timestamp), await x.add(F, C), this._synchronizer.shouldWait(e.id, F.timestamp) && await this._synchronizer.wait(F.timestamp);
        }
        x.close(), this._synchronizer.closeTrack(e.id);
      })());
    } else {
      if (!await e.canDecode()) {
        this.discardedTracks.push({
          track: e,
          reason: "undecodable_source_codec"
        });
        return;
      }
      t.codec && (T = T.filter((M) => M === t.codec));
      const S = t.bitrate ?? ai, E = await cl(T, {
        width: t.process && t.processedWidth ? t.processedWidth : h,
        height: t.process && t.processedHeight ? t.processedHeight : f,
        bitrate: S
      });
      if (!E) {
        this.discardedTracks.push({
          track: e,
          reason: "no_encodable_target_codec"
        });
        return;
      }
      const C = {
        codec: E,
        bitrate: S,
        keyFrameInterval: t.keyFrameInterval,
        sizeChangeBehavior: t.fit ?? "passThrough",
        alpha: y,
        hardwareAcceleration: t.hardwareAcceleration
      }, R = new cs(C);
      if (s = R, !b) {
        const M = new ci({
          format: new Ei(),
          // Supports all video codecs
          target: new Zc()
        }), F = new cs(C);
        M.addVideoTrack(F), await M.start();
        const W = await new Gr(e).getSample(k);
        if (W)
          try {
            await F.add(W), W.close(), await M.finalize();
          } catch (j) {
            console.info("Error when probing encoder support. Falling back to rerender path.", j), b = !0, M.cancel();
          }
        else
          await M.cancel();
      }
      b ? this._trackPromises.push((async () => {
        await this._started;
        const F = new ya(e, {
          width: h,
          height: f,
          fit: t.fit ?? "fill",
          rotation: n,
          // Bake the rotation into the output
          crop: t.crop,
          poolSize: 1,
          alpha: y === "keep"
        }).canvases(this._startTimestamp, this._endTimestamp), D = t.frameRate;
        let W = null, j = null, $ = null;
        const H = async (Y) => {
          m(W), m(D !== void 0);
          const re = Math.round((Y - j) * D);
          for (let dt = 1; dt < re; dt++) {
            const Ue = new ae(W, {
              timestamp: j + dt / D,
              duration: 1 / D
            });
            await this._registerVideoSample(e, t, R, Ue), Ue.close();
          }
        };
        for await (const { canvas: Y, timestamp: re, duration: dt } of F) {
          if (this._canceled)
            return;
          let Ue = Math.max(re - this._startTimestamp, 0);
          if ($ = Ue + dt, D !== void 0) {
            const rr = Math.floor(Ue * D) / D;
            if (W !== null)
              if (rr <= j) {
                W = Y, j = rr;
                continue;
              } else
                await H(rr);
            Ue = rr;
          }
          const zi = new ae(Y, {
            timestamp: Ue,
            duration: D !== void 0 ? 1 / D : dt
          });
          await this._registerVideoSample(e, t, R, zi), zi.close(), D !== void 0 && (W = Y, j = Ue);
        }
        W && (m($ !== null), m(D !== void 0), await H(Math.floor($ * D) / D)), R.close(), this._synchronizer.closeTrack(e.id);
      })()) : this._trackPromises.push((async () => {
        await this._started;
        const M = new Gr(e), F = t.frameRate;
        let D = null, W = null, j = null;
        const $ = async (H) => {
          m(D), m(F !== void 0);
          const Y = Math.round((H - W) * F);
          for (let re = 1; re < Y; re++)
            D.setTimestamp(W + re / F), D.setDuration(1 / F), await this._registerVideoSample(e, t, R, D);
          D.close();
        };
        for await (const H of M.samples(this._startTimestamp, this._endTimestamp)) {
          if (this._canceled) {
            H.close(), D?.close();
            return;
          }
          let Y = Math.max(H.timestamp - this._startTimestamp, 0);
          if (j = Y + H.duration, F !== void 0) {
            const re = Math.floor(Y * F) / F;
            if (D !== null)
              if (re <= W) {
                D.close(), D = H, W = re;
                continue;
              } else
                await $(re);
            Y = re, H.setDuration(1 / F);
          }
          H.setTimestamp(Y), await this._registerVideoSample(e, t, R, H), F !== void 0 ? (D = H, W = Y) : H.close();
        }
        D && (m(j !== null), m(F !== void 0), await $(Math.floor(j * F) / F)), R.close(), this._synchronizer.closeTrack(e.id);
      })());
    }
    this.output.addVideoTrack(s, {
      frameRate: t.frameRate,
      // TODO: This condition can be removed when all demuxers properly homogenize to BCP47 in v2
      languageCode: jt(e.languageCode) ? e.languageCode : void 0,
      name: e.name ?? void 0,
      disposition: e.disposition,
      rotation: b ? 0 : n
      // Rerendering will bake the rotation into the output
    }), this._addedCounts.video++, this._totalTrackCount++, this.utilizedTracks.push(e);
  }
  /** @internal */
  async _registerVideoSample(e, t, i, s) {
    if (this._canceled)
      return;
    this._reportProgress(e.id, s.timestamp);
    let n;
    if (!t.process)
      n = [s];
    else {
      let a = t.process(s);
      a instanceof Promise && (a = await a), Array.isArray(a) || (a = a === null ? [] : [a]), n = a.map((o) => o instanceof ae ? o : typeof VideoFrame < "u" && o instanceof VideoFrame ? new ae(o) : new ae(o, {
        timestamp: s.timestamp,
        duration: s.duration
      }));
    }
    for (const a of n) {
      if (this._canceled)
        break;
      await i.add(a), this._synchronizer.shouldWait(e.id, a.timestamp) && await this._synchronizer.wait(a.timestamp);
    }
    for (const a of n)
      a !== s && a.close();
  }
  /** @internal */
  async _processAudioTrack(e, t) {
    const i = e.codec;
    if (!i) {
      this.discardedTracks.push({
        track: e,
        reason: "unknown_source_codec"
      });
      return;
    }
    let s;
    const n = e.numberOfChannels, a = e.sampleRate, o = await e.getFirstTimestamp();
    let c = t.numberOfChannels ?? n, l = t.sampleRate ?? a, u = c !== n || l !== a || o < this._startTimestamp, d = this.output.format.getSupportedAudioCodecs();
    if (!t.forceTranscode && !t.bitrate && !u && d.includes(i) && (!t.codec || t.codec === i) && !t.process) {
      const h = new hl(i);
      s = h, this._trackPromises.push((async () => {
        await this._started;
        const f = new Kt(e), g = { decoderConfig: await e.getDecoderConfig() ?? void 0 }, k = Number.isFinite(this._endTimestamp) ? await f.getPacket(this._endTimestamp, { metadataOnly: !0 }) ?? void 0 : void 0;
        for await (const w of f.packets(void 0, k)) {
          if (this._canceled)
            return;
          const b = w.clone({
            timestamp: w.timestamp - this._startTimestamp
          });
          m(b.timestamp >= 0), this._reportProgress(e.id, b.timestamp), await h.add(b, g), this._synchronizer.shouldWait(e.id, b.timestamp) && await this._synchronizer.wait(b.timestamp);
        }
        h.close(), this._synchronizer.closeTrack(e.id);
      })());
    } else {
      if (!await e.canDecode()) {
        this.discardedTracks.push({
          track: e,
          reason: "undecodable_source_codec"
        });
        return;
      }
      let f = null;
      t.codec && (d = d.filter((k) => k === t.codec));
      const p = t.bitrate ?? ai, g = await oi(d, {
        numberOfChannels: t.process && t.processedNumberOfChannels ? t.processedNumberOfChannels : c,
        sampleRate: t.process && t.processedSampleRate ? t.processedSampleRate : l,
        bitrate: p
      });
      if (!g.some((k) => Ut.includes(k)) && d.some((k) => Ut.includes(k)) && (c !== Wr || l !== Hr)) {
        const w = (await oi(d, {
          numberOfChannels: Wr,
          sampleRate: Hr,
          bitrate: p
        })).find((b) => Ut.includes(b));
        w && (u = !0, f = w, c = Wr, l = Hr);
      } else
        f = g[0] ?? null;
      if (f === null) {
        this.discardedTracks.push({
          track: e,
          reason: "no_encodable_target_codec"
        });
        return;
      }
      if (u)
        s = this._resampleAudio(e, t, f, c, l, p);
      else {
        const k = new ls({
          codec: f,
          bitrate: p
        });
        s = k, this._trackPromises.push((async () => {
          await this._started;
          const w = new Xi(e);
          for await (const b of w.samples(void 0, this._endTimestamp)) {
            if (this._canceled) {
              b.close();
              return;
            }
            b.setTimestamp(b.timestamp - this._startTimestamp), await this._registerAudioSample(e, t, k, b), b.close();
          }
          k.close(), this._synchronizer.closeTrack(e.id);
        })());
      }
    }
    this.output.addAudioTrack(s, {
      // TODO: This condition can be removed when all demuxers properly homogenize to BCP47 in v2
      languageCode: jt(e.languageCode) ? e.languageCode : void 0,
      name: e.name ?? void 0,
      disposition: e.disposition
    }), this._addedCounts.audio++, this._totalTrackCount++, this.utilizedTracks.push(e);
  }
  /** @internal */
  async _registerAudioSample(e, t, i, s) {
    if (this._canceled)
      return;
    this._reportProgress(e.id, s.timestamp);
    let n;
    if (!t.process)
      n = [s];
    else {
      let a = t.process(s);
      if (a instanceof Promise && (a = await a), Array.isArray(a) || (a = a === null ? [] : [a]), !a.every((o) => o instanceof pe))
        throw new TypeError("The audio process function must return an AudioSample, null, or an array of AudioSamples.");
      n = a;
    }
    for (const a of n) {
      if (this._canceled)
        break;
      await i.add(a), this._synchronizer.shouldWait(e.id, a.timestamp) && await this._synchronizer.wait(a.timestamp);
    }
    for (const a of n)
      a !== s && a.close();
  }
  /** @internal */
  _resampleAudio(e, t, i, s, n, a) {
    const o = new ls({
      codec: i,
      bitrate: a
    });
    return this._trackPromises.push((async () => {
      await this._started;
      const c = new bl({
        targetNumberOfChannels: s,
        targetSampleRate: n,
        startTime: this._startTimestamp,
        endTime: this._endTimestamp,
        onSample: async (d) => {
          await this._registerAudioSample(e, t, o, d), d.close();
        }
      }), u = new Xi(e).samples(this._startTimestamp, this._endTimestamp);
      for await (const d of u) {
        if (this._canceled) {
          d.close();
          return;
        }
        await c.add(d), d.close();
      }
      await c.finalize(), o.close(), this._synchronizer.closeTrack(e.id);
    })()), o;
  }
  /** @internal */
  _reportProgress(e, t) {
    if (!this._computeProgress)
      return;
    m(this._totalDuration !== null), this._maxTimestamps.set(e, Math.max(t, this._maxTimestamps.get(e)));
    const i = Math.min(...this._maxTimestamps.values()), s = ee(i / this._totalDuration, 0, 1);
    s !== this._lastProgress && (this._lastProgress = s, this.onProgress?.(s));
  }
}
class gl extends Error {
  /** Creates a new {@link ConversionCanceledError}. */
  constructor(e = "Conversion has been canceled.") {
    super(e), this.name = "ConversionCanceledError";
  }
}
const hs = 5;
class kl {
  constructor() {
    this.maxTimestamps = /* @__PURE__ */ new Map(), this.resolvers = [];
  }
  computeMinAndMaybeResolve() {
    let e = 1 / 0;
    for (const [, t] of this.maxTimestamps)
      e = Math.min(e, t);
    for (let t = 0; t < this.resolvers.length; t++) {
      const i = this.resolvers[t];
      i.timestamp - e < hs && (i.resolve(), this.resolvers.splice(t, 1), t--);
    }
    return e;
  }
  shouldWait(e, t) {
    this.maxTimestamps.set(e, Math.max(t, this.maxTimestamps.get(e) ?? -1 / 0));
    const i = this.computeMinAndMaybeResolve();
    return t - i >= hs;
  }
  wait(e) {
    const { promise: t, resolve: i } = se();
    return this.resolvers.push({
      timestamp: e,
      resolve: i
    }), t;
  }
  closeTrack(e) {
    this.maxTimestamps.delete(e), this.computeMinAndMaybeResolve();
  }
}
class bl {
  constructor(e) {
    this.sourceSampleRate = null, this.sourceNumberOfChannels = null, this.targetSampleRate = e.targetSampleRate, this.targetNumberOfChannels = e.targetNumberOfChannels, this.startTime = e.startTime, this.endTime = e.endTime, this.onSample = e.onSample, this.bufferSizeInFrames = Math.floor(this.targetSampleRate * 5), this.bufferSizeInSamples = this.bufferSizeInFrames * this.targetNumberOfChannels, this.outputBuffer = new Float32Array(this.bufferSizeInSamples), this.bufferStartFrame = 0, this.maxWrittenFrame = -1;
  }
  /**
   * Sets up the channel mixer to handle up/downmixing in the case where input and output channel counts don't match.
   */
  doChannelMixerSetup() {
    m(this.sourceNumberOfChannels !== null);
    const e = this.sourceNumberOfChannels, t = this.targetNumberOfChannels;
    e === 1 && t === 2 ? this.channelMixer = (i, s) => i[s * e] : e === 1 && t === 4 ? this.channelMixer = (i, s, n) => i[s * e] * +(n < 2) : e === 1 && t === 6 ? this.channelMixer = (i, s, n) => i[s * e] * +(n === 2) : e === 2 && t === 1 ? this.channelMixer = (i, s) => {
      const n = s * e;
      return 0.5 * (i[n] + i[n + 1]);
    } : e === 2 && t === 4 ? this.channelMixer = (i, s, n) => i[s * e + n] * +(n < 2) : e === 2 && t === 6 ? this.channelMixer = (i, s, n) => i[s * e + n] * +(n < 2) : e === 4 && t === 1 ? this.channelMixer = (i, s) => {
      const n = s * e;
      return 0.25 * (i[n] + i[n + 1] + i[n + 2] + i[n + 3]);
    } : e === 4 && t === 2 ? this.channelMixer = (i, s, n) => {
      const a = s * e;
      return 0.5 * (i[a + n] + i[a + n + 2]);
    } : e === 4 && t === 6 ? this.channelMixer = (i, s, n) => {
      const a = s * e;
      return n < 2 ? i[a + n] : n === 2 || n === 3 ? 0 : i[a + n - 2];
    } : e === 6 && t === 1 ? this.channelMixer = (i, s) => {
      const n = s * e;
      return Math.SQRT1_2 * (i[n] + i[n + 1]) + i[n + 2] + 0.5 * (i[n + 4] + i[n + 5]);
    } : e === 6 && t === 2 ? this.channelMixer = (i, s, n) => {
      const a = s * e;
      return i[a + n] + Math.SQRT1_2 * (i[a + 2] + i[a + n + 4]);
    } : e === 6 && t === 4 ? this.channelMixer = (i, s, n) => {
      const a = s * e;
      return n < 2 ? i[a + n] + Math.SQRT1_2 * i[a + 2] : i[a + n + 2];
    } : this.channelMixer = (i, s, n) => n < e ? i[s * e + n] : 0;
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
    this.sourceSampleRate === null && (this.sourceSampleRate = e.sampleRate, this.sourceNumberOfChannels = e.numberOfChannels, this.tempSourceBuffer = new Float32Array(this.sourceSampleRate * this.sourceNumberOfChannels), this.doChannelMixerSetup());
    const t = e.numberOfFrames * e.numberOfChannels;
    this.ensureTempBufferSize(t);
    const i = e.allocationSize({ planeIndex: 0, format: "f32" }), s = new Float32Array(this.tempSourceBuffer.buffer, 0, i / 4);
    e.copyTo(s, { planeIndex: 0, format: "f32" });
    const n = e.timestamp - this.startTime, a = e.numberOfFrames / this.sourceSampleRate, o = Math.min(n + a, this.endTime - this.startTime), c = Math.floor(n * this.targetSampleRate), l = Math.ceil(o * this.targetSampleRate);
    for (let u = c; u < l; u++) {
      if (u < this.bufferStartFrame)
        continue;
      for (; u >= this.bufferStartFrame + this.bufferSizeInFrames; )
        await this.finalizeCurrentBuffer(), this.bufferStartFrame += this.bufferSizeInFrames;
      const d = u - this.bufferStartFrame;
      m(d < this.bufferSizeInFrames);
      const p = (u / this.targetSampleRate - n) * this.sourceSampleRate, g = Math.floor(p), k = Math.ceil(p), w = p - g;
      for (let b = 0; b < this.targetNumberOfChannels; b++) {
        let y = 0, T = 0;
        g >= 0 && g < e.numberOfFrames && (y = this.channelMixer(s, g, b)), k >= 0 && k < e.numberOfFrames && (T = this.channelMixer(s, k, b));
        const x = y + w * (T - y), S = d * this.targetNumberOfChannels + b;
        this.outputBuffer[S] += x;
      }
      this.maxWrittenFrame = Math.max(this.maxWrittenFrame, d);
    }
  }
  async finalizeCurrentBuffer() {
    if (this.maxWrittenFrame < 0)
      return;
    const e = (this.maxWrittenFrame + 1) * this.targetNumberOfChannels, t = new Float32Array(e);
    t.set(this.outputBuffer.subarray(0, e));
    const i = this.bufferStartFrame / this.targetSampleRate, s = new pe({
      format: "f32",
      sampleRate: this.targetSampleRate,
      numberOfChannels: this.targetNumberOfChannels,
      timestamp: i,
      data: t
    });
    await this.onSample(s), this.outputBuffer.fill(0), this.maxWrittenFrame = -1;
  }
  finalize() {
    return this.finalizeCurrentBuffer();
  }
}
function fs(r) {
  if (r != null) {
    if (r === 0.3) return sl;
    if (r === 1) return nl;
    if (r === 2) return ai;
  }
}
async function Pl() {
  if (!(typeof VideoEncoder < "u" && typeof VideoDecoder < "u") || /Android.*Firefox/.test(navigator.userAgent))
    return !1;
  try {
    const i = (await oi()).includes("opus");
    return yn("MediaBunnyCompression", "MediaBunny supported - Video encoding available, Opus codec available:", i), !0;
  } catch {
    return !0;
  }
}
async function wl() {
  if (typeof AudioEncoder > "u")
    return !1;
  try {
    const r = {
      codec: "opus",
      sampleRate: 48e3,
      numberOfChannels: 2,
      bitrate: 128e3
    };
    return (await AudioEncoder.isConfigSupported(r)).supported || !1;
  } catch {
    return !1;
  }
}
async function yl(r, e, t) {
  if (typeof AudioEncoder > "u")
    return !1;
  try {
    const i = { codec: "opus", sampleRate: r, numberOfChannels: e, bitrate: t };
    return (await AudioEncoder.isConfigSupported(i)).supported || !1;
  } catch {
    return !1;
  }
}
function Ot(r, e, t = !1) {
  if (r)
    try {
      r.dispose();
    } catch {
    }
  if (e && t)
    try {
      e.finalize();
    } catch {
    }
}
class xl extends Tn {
  constructor(e, t, i, s = bn) {
    super("MediaBunnyCompression", s), this.parseAudioBitrate = e, this.mergeVideoAndAudioWithFFmpeg = t, this.compressWithFFmpeg = i;
  }
  abortController = null;
  /**
   * 圧縮処理を中止
   */
  abort() {
    this.log("Abort requested"), this.resetProgress(), this.abortController && (this.log("Aborting Mediabunny conversion"), this.abortController.abort(), this.abortController = null);
  }
  /**
   * リソースのクリーンアップ
   */
  async cleanup() {
    this.abortController = null;
  }
  /**
   * Opus対応設定を検索
   */
  async findSupportedOpusConfig(e, t, i, s) {
    const n = Math.max(s, 64e3), a = Array.from(/* @__PURE__ */ new Set([
      i,
      48e3,
      24e3,
      e.sampleRate
    ])).filter((c) => Number.isFinite(c) && c > 0), o = [
      { sampleRate: i, bitrate: s },
      ...a.map((c) => ({ sampleRate: c, bitrate: n }))
    ];
    for (const { sampleRate: c, bitrate: l } of o) {
      if (!Number.isFinite(c) || c <= 0 || !Number.isFinite(l) || l <= 0) continue;
      const u = Math.round(c), d = Math.round(l), h = await yl(u, t, d);
      if (this.log("Opus encoding support probe:", {
        trackId: e.id,
        codec: e.codec,
        targetChannels: t,
        sampleRate: u,
        bitrate: d,
        supported: h
      }), h)
        return { sampleRate: u, bitrate: d };
    }
    return null;
  }
  /**
   * Mediabunny用オーディオ設定を検証
   */
  async validateMediabunnyAudioConfig(e, t, i) {
    const s = /* @__PURE__ */ new Map();
    let n = await wl(), a = i ? null : this.parseAudioBitrate(t?.audioBitrate), o = i ? null : typeof t?.audioSampleRate == "number" ? t.audioSampleRate : null;
    if (this.log("Opus encoding supported (global check):", n), n && e.length > 0)
      for (const c of e) {
        const l = t.audioChannels ?? c.numberOfChannels, u = t.audioSampleRate ?? c.sampleRate, d = i ? 64e3 : this.parseAudioBitrate(t.audioBitrate) ?? 128e3, h = await this.findSupportedOpusConfig(
          c,
          l,
          u,
          d
        );
        if (!h) {
          n = !1, this.log("Opus encoder does not support requested settings; will copy audio track as-is via Mediabunny.", {
            trackId: c.id,
            preferredSampleRate: u,
            preferredBitrate: d,
            targetChannels: l
          });
          break;
        }
        s.set(c.id, {
          sampleRate: h.sampleRate,
          bitrate: h.bitrate,
          channels: l
        }), (h.sampleRate !== u || h.bitrate !== d) && this.log("Adjusted Mediabunny audio target due to encoder support limitations.", {
          trackId: c.id,
          preferredSampleRate: u,
          preferredBitrate: d,
          resolvedSampleRate: h.sampleRate,
          resolvedBitrate: h.bitrate
        }), i || (o = h.sampleRate, a = h.bitrate);
      }
    return { canEncodeOpus: n, audioConfigByTrack: s, desiredAudioSampleRate: o, desiredAudioBitrate: a };
  }
  /**
   * MediaBunny Conversion APIのオプションを構築
   * MediaBunnyの推奨パターンに従い、Quality定数を優先的に使用
   */
  buildConversionOptions(e, t, i, s, n, a, o, c) {
    return {
      input: e,
      output: t,
      // 動画設定: MediaBunnyの推奨パターン（Quality定数を優先）
      // maxSizeは常に適用する
      video: (u) => {
        const d = {
          codec: "avc",
          // Quality定数が設定されている場合はそれを使用
          ...a ? { bitrate: a } : {}
        }, h = i.maxSize;
        return typeof h == "number" && Number.isFinite(h) && (u.displayWidth > u.displayHeight ? d.width = Math.min(u.displayWidth, h) : d.height = Math.min(u.displayHeight, h), this.log("Applying video resize:", {
          originalWidth: u.displayWidth,
          originalHeight: u.displayHeight,
          maxSize: h,
          targetWidth: d.width,
          targetHeight: d.height,
          bitrate: a || "custom"
        })), d;
      },
      // 音声設定: MediaBunnyの推奨パターン
      // Opusエンコードができない場合はオーディオトラックをそのままコピー
      audio: o ? s && n ? { codec: "opus", bitrate: n, forceTranscode: !0 } : (u) => {
        const d = c.get(u.id), h = d?.channels ?? i.audioChannels ?? u.numberOfChannels, f = d?.sampleRate ?? i.audioSampleRate ?? u.sampleRate;
        this.log("Configuring audio track for compression:", {
          inputCodec: u.codec,
          inputChannels: u.numberOfChannels,
          inputSampleRate: u.sampleRate,
          targetChannels: h,
          targetSampleRate: f
        });
        const p = d?.bitrate ?? this.parseAudioBitrate(i.audioBitrate) ?? 128e3;
        return {
          codec: "opus",
          forceTranscode: !0,
          ...typeof h == "number" ? { numberOfChannels: h } : {},
          ...typeof f == "number" ? { sampleRate: f } : {},
          bitrate: p
        };
      } : (u) => {
        this.log("Copying audio track as-is (Opus encoding not supported):", {
          trackId: u.id,
          codec: u.codec,
          channels: u.numberOfChannels,
          sampleRate: u.sampleRate
        });
      },
      // 字幕トラック等の破棄は正常動作のため警告を抑制
      showWarnings: !1
    };
  }
  /**
   * Conversionの妥当性とトラック破棄を検証
   */
  validateConversion(e, t, i, s) {
    if (e.discardedTracks.length > 0) {
      this.log("Discarded tracks:", e.discardedTracks.map((a) => ({ type: a.track.type, reason: a.reason })));
      const n = e.discardedTracks.filter(
        (a) => a.track.type === "video" || a.track.type === "audio"
      );
      if (n.length > 0 && (console.warn("[MediaBunnyCompression] Important tracks discarded:", n.map((o) => ({
        type: o.track.type,
        reason: o.reason,
        codec: o.track.type === "audio" ? o.track.codec : void 0
      }))), n.some(
        (o) => o.track.type === "audio" && o.reason === "no_encodable_target_codec"
      ) && s))
        throw Je(this.context, "Mediabunny cannot encode audio for this environment, falling back to FFmpeg."), Ot(t, i, !0), new Error("mediabunny-unsupported-audio-codec");
    }
    return e.isValid ? null : (Je(this.context, "Conversion is not valid:", e.discardedTracks), Ot(t, i, !0), { file: new File([], ""), wasCompressed: !1, wasSkipped: !0 });
  }
  /**
   * Conversionを実行（中止処理を含む）
   */
  async executeConversion(e, t) {
    const i = new Promise((s) => {
      this.abortController.signal.addEventListener("abort", () => {
        this.log("Mediabunny conversion aborted"), e.cancel().then(s);
      });
    });
    return await Promise.race([e.execute(), i]), this.checkAbort(t);
  }
  /**
   * Mediabunnyを使用して動画を圧縮
   */
  async compressWithMediabunny(e, t) {
    let i = null, s = null, n = null;
    const a = typeof t?.mediabunnyAudioQualityFactor == "number", o = fs(t?.mediabunnyAudioQualityFactor), c = fs(t?.mediabunnyVideoQualityFactor) || o;
    try {
      this.log("Starting Mediabunny compression"), this.abortController = new AbortController(), i = new ti({
        source: new ts(e),
        formats: es
      }), n = new hn(), s = new ci({
        target: n,
        format: new Ei({ fastStart: "in-memory" })
        // ストリーミング最適化
      });
      const l = await i.getAudioTracks(), u = l.length > 0;
      this.log("Input audio tracks:", l.length), l.length > 0 && this.log("First audio track codec:", l[0].codec);
      const d = await this.validateMediabunnyAudioConfig(l, t, a);
      let { canEncodeOpus: h, audioConfigByTrack: f, desiredAudioSampleRate: p, desiredAudioBitrate: g } = d;
      const k = this.buildConversionOptions(
        i,
        s,
        t,
        a,
        o,
        c,
        h,
        f
      ), w = await Ri.init(k), b = this.validateConversion(w, i, s, h);
      if (b)
        return this.abortController = null, b;
      w.onProgress = (E) => {
        this.onProgress && this.onProgress(Math.round(E * 100));
      };
      const y = await this.executeConversion(w, e);
      if (y)
        return Ot(i, null), this.abortController = null, y;
      const T = n.buffer;
      if (!T)
        throw new Error("Output buffer is null");
      let x = new Blob([T], { type: "video/mp4" });
      if (Ot(i, null), !h && u) {
        this.log("Attempting to mux original audio track via FFmpeg copy");
        const E = await this.mergeVideoAndAudioWithFFmpeg(x, e), C = this.checkAbort(e);
        if (C)
          return this.abortController = null, C;
        if (!E)
          return Je(this.context, "Audio mux failed; falling back to FFmpeg compression."), this.abortController = null, await this.compressWithFFmpeg(e, t);
        x = E, this.log("Successfully muxed original audio track.");
      }
      const S = wn(x, e, this.context);
      if (!S.wasCompressed)
        return this.abortController = null, S;
      if (h && u && (g || p)) {
        if (!(await this.verifyMediabunnyAudio(
          S.file,
          p,
          g
        )).passed)
          return this.abortController = null, await this.compressWithFFmpeg(e, t);
      } else !h && u && this.log("Audio was copied as-is, skipping audio verification");
      return this.onProgress && this.onProgress(100), this.abortController = null, S;
    } catch (l) {
      Ot(i, null);
      const u = this.checkAbort(e);
      return u ? (this.abortController = null, u) : (console.error("[MediaBunnyCompression] Mediabunny compression failed:", l), this.abortController = null, { file: e, wasCompressed: !1, wasSkipped: !0 });
    }
  }
  /**
   * Mediabunny圧縮後の音声品質を検証
   */
  async verifyMediabunnyAudio(e, t, i) {
    const s = typeof i == "number" && Number.isFinite(i), n = typeof t == "number" && Number.isFinite(t);
    if (!s && !n)
      return { passed: !0 };
    let a = null;
    try {
      a = new ti({
        source: new ts(e),
        formats: es
      });
      const o = await a.getAudioTracks();
      if (o.length === 0)
        return Je(this.context, "Mediabunny output lost audio track; falling back to FFmpeg"), { passed: !1 };
      const c = o[0], l = await c.computePacketStats(120), u = c.sampleRate, d = l.averageBitrate;
      if (this.log("Mediabunny audio verification:", {
        expectedBitrate: i,
        actualBitrate: d,
        expectedSampleRate: t,
        actualSampleRate: u
      }), n && Math.abs(u - t) > 1)
        return Je(this.context, "Audio sample rate mismatch detected, falling back to FFmpeg"), { passed: !1 };
      if (s) {
        const h = i * 1.25;
        if (!Number.isFinite(d) || d > h)
          return Je(this.context, "Audio bitrate exceeds expected range, falling back to FFmpeg", {
            actualBitrate: d,
            allowedUpperBitrate: h
          }), { passed: !1 };
      }
      return { passed: !0 };
    } catch (o) {
      return Je(this.context, "Audio verification error, falling back to FFmpeg:", o), { passed: !1 };
    } finally {
      a?.dispose();
    }
  }
}
export {
  xl as MediaBunnyCompression,
  Ot as cleanupMediabunny,
  Pl as isMediaBunnySupported,
  yl as isOpusEncodingConfigSupported,
  wl as isOpusEncodingSupported
};
