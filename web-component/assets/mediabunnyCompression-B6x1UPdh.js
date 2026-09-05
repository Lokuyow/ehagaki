import { er as Ao } from "./App-CT56EfFO.js";
function g(r) {
  if (!r)
    throw new Error("Assertion failed.");
}
const ii = (r) => {
  const e = (r % 360 + 360) % 360;
  if (e === 0 || e === 90 || e === 180 || e === 270)
    return e;
  throw new Error(`Invalid rotation ${r}.`);
}, ee = (r) => r && r[r.length - 1], yt = (r) => r >= 0 && r < 2 ** 32, F = (r) => {
  let e = 0;
  for (; r.readBits(1) === 0 && e < 32; )
    e++;
  if (e >= 32)
    throw new Error("Invalid exponential-Golomb code.");
  return (1 << e) - 1 + r.readBits(e);
}, tt = (r) => {
  const e = F(r);
  return (e & 1) === 0 ? -(e >> 1) : e + 1 >> 1;
}, pe = (r) => r.constructor === Uint8Array ? r : ArrayBuffer.isView(r) ? new Uint8Array(r.buffer, r.byteOffset, r.byteLength) : new Uint8Array(r), Q = (r) => r.constructor === DataView ? r : ArrayBuffer.isView(r) ? new DataView(r.buffer, r.byteOffset, r.byteLength) : new DataView(r), Te = /* @__PURE__ */ new TextDecoder(), Ue = /* @__PURE__ */ new TextEncoder(), fn = (r) => Object.fromEntries(Object.entries(r).map(([e, t]) => [t, e])), rr = {
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
}, Hr = /* @__PURE__ */ fn(rr), ir = {
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
}, qr = /* @__PURE__ */ fn(ir), nr = {
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
}, Kr = /* @__PURE__ */ fn(nr), So = (r) => !!r && !!r.primaries && !!r.transfer && !!r.matrix && r.fullRange !== void 0, Cr = (r) => r instanceof ArrayBuffer || typeof SharedArrayBuffer < "u" && r instanceof SharedArrayBuffer || ArrayBuffer.isView(r);
class sr {
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
const xo = /^[0-9a-fA-F]+$/, br = (r) => [...r].map((e) => e.toString(16).padStart(2, "0")).join(""), Po = (r) => {
  g(r.length % 2 === 0);
  const e = new Uint8Array(r.length / 2);
  for (let t = 0; t < r.length; t += 2)
    e[t / 2] = parseInt(r.slice(t, t + 2), 16);
  return e;
}, Hn = (r) => (r = r >> 1 & 1431655765 | (r & 1431655765) << 1, r = r >> 2 & 858993459 | (r & 858993459) << 2, r = r >> 4 & 252645135 | (r & 252645135) << 4, r = r >> 8 & 16711935 | (r & 16711935) << 8, r = r >> 16 & 65535 | (r & 65535) << 16, r >>> 0), Ir = (r, e, t) => {
  let i = 0, n = r.length - 1, s = -1;
  for (; i <= n; ) {
    const a = i + n >> 1, o = t(r[a]);
    o === e ? (s = a, n = a - 1) : o < e ? i = a + 1 : n = a - 1;
  }
  return s;
}, K = (r, e, t) => {
  let i = 0, n = r.length - 1, s = -1;
  for (; i <= n; ) {
    const a = i + (n - i + 1) / 2 | 0;
    t(r[a]) <= e ? (s = a, i = a + 1) : n = a - 1;
  }
  return s;
}, qn = (r, e, t) => {
  const i = K(r, t(e), t);
  r.splice(i + 1, 0, e);
}, ce = () => {
  let r, e;
  return { promise: new Promise((i, n) => {
    r = i, e = n;
  }), resolve: r, reject: e };
}, Co = (r, e) => {
  const t = r.indexOf(e);
  t !== -1 && r.splice(t, 1);
}, $s = (r, e) => {
  for (let t = r.length - 1; t >= 0; t--)
    if (e(r[t]))
      return r[t];
}, hn = (r, e) => {
  for (let t = r.length - 1; t >= 0; t--)
    if (e(r[t]))
      return t;
  return -1;
}, Io = async function* (r) {
  Symbol.iterator in r ? yield* r[Symbol.iterator]() : yield* r[Symbol.asyncIterator]();
}, Eo = (r) => {
  if (!(Symbol.iterator in r) && !(Symbol.asyncIterator in r))
    throw new TypeError("Argument must be an iterable or async iterable.");
}, rt = (r) => {
  throw new Error(`Unexpected value: ${r}`);
}, ni = (r, e, t) => {
  const i = r.getUint8(e), n = r.getUint8(e + 1), s = r.getUint8(e + 2);
  return t ? i | n << 8 | s << 16 : i << 16 | n << 8 | s;
}, _o = (r, e, t) => ni(r, e, t) << 8 >> 8, mn = (r, e, t, i) => {
  t = t >>> 0, t = t & 16777215, i ? (r.setUint8(e, t & 255), r.setUint8(e + 1, t >>> 8 & 255), r.setUint8(e + 2, t >>> 16 & 255)) : (r.setUint8(e, t >>> 16 & 255), r.setUint8(e + 1, t >>> 8 & 255), r.setUint8(e + 2, t & 255));
}, vo = (r, e, t, i) => {
  t = se(t, -8388608, 8388607), t < 0 && (t = t + 16777216 & 16777215), mn(r, e, t, i);
}, Kn = (r, e) => ({
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
}), se = (r, e, t) => Math.max(e, Math.min(t, r)), de = "und", wr = (r) => {
  const e = Math.round(r);
  return Math.abs(r / e - 1) < 10 * Number.EPSILON ? e : r;
}, Bo = (r, e) => Math.round(r / e) * e, jr = (r, e) => Math.round(r * e) / e, ki = (r, e) => Math.floor(r / e) * e, Lt = (r, e) => Math.floor(r * e) / e, Fo = (r) => {
  let e = 0;
  for (; r; )
    e++, r >>= 1;
  return e;
}, Ro = /^[a-z]{3}$/, Tr = (r) => Ro.test(r), ht = 1e6 * (1 + Number.EPSILON), Mo = (r, e) => {
  const t = r < 0 ? -1 : 1;
  r = Math.abs(r);
  let i = 0, n = 1, s = 1, a = 0, o = r;
  for (; ; ) {
    const c = Math.floor(o), l = c * s + i, d = c * a + n;
    if (d > e)
      return {
        numerator: t * s,
        denominator: a
      };
    if (i = s, n = a, s = l, a = d, o = 1 / (o - c), !isFinite(o))
      break;
  }
  return {
    numerator: t * s,
    denominator: a
  };
};
class si {
  constructor() {
    this.currentPromise = Promise.resolve();
  }
  call(e) {
    return this.currentPromise = this.currentPromise.then(e);
  }
}
let yi = null;
const pr = () => yi !== null ? yi : yi = !!(typeof navigator < "u" && // eslint-disable-next-line @typescript-eslint/no-deprecated
(navigator.vendor?.match(/apple/i) || /AppleWebKit/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) || /\b(iPad|iPhone|iPod)\b/.test(navigator.userAgent)));
let bi = null;
const Jt = () => bi !== null ? bi : bi = typeof navigator < "u" && navigator.userAgent?.includes("Firefox");
let wi = null;
const Ki = () => wi !== null ? wi : wi = !!(typeof navigator < "u" && (navigator.vendor?.includes("Google Inc") || /Chrome/.test(navigator.userAgent)));
let Ti = null;
const zo = () => {
  if (Ti !== null)
    return Ti;
  if (typeof navigator > "u")
    return null;
  const r = /\bChrome\/(\d+)/.exec(navigator.userAgent);
  return r ? Ti = Number(r[1]) : null;
}, Dt = (r, e) => r !== -1 ? r : e, jn = (r, e, t, i) => r <= i && t <= e, Ys = function* (r) {
  for (const e in r) {
    const t = r[e];
    t !== void 0 && (yield { key: e, value: t });
  }
}, Qr = (r) => {
  const e = atob(r), t = new Uint8Array(e.length);
  for (let i = 0; i < e.length; i++)
    t[i] = e.charCodeAt(i);
  return t;
}, Do = (r, e) => {
  if (r.length !== e.length)
    return !1;
  for (let t = 0; t < r.length; t++)
    if (r[t] !== e[t])
      return !1;
  return !0;
}, pn = () => {
  Symbol.dispose ??= Symbol("Symbol.dispose");
}, gn = (r) => typeof r == "number" && !Number.isNaN(r), ft = (r, e) => {
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
}, fr = (r, e) => {
  let t = 0;
  for (let i = 0; i < r.length; i++)
    e(r[i]) && t++;
  return t;
}, Zs = (r, e) => {
  let t = -1, i = 1 / 0;
  for (let n = 0; n < r.length; n++) {
    const s = e(r[n]);
    s < i && (i = s, t = n);
  }
  return t;
}, Gr = (r) => {
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
}, Qn = (r, e) => {
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
}, Oo = (r) => new Promise((e) => setTimeout(e, r)), Gn = (r) => Array.isArray(r) ? r : [r];
class ai {
  constructor() {
    this._listeners = /* @__PURE__ */ new Map();
  }
  /** Registers a listener for the given event. */
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
const ut = (r) => Math.ceil(r / 2) * 2, No = (r) => r !== null && typeof r == "object" && Object.getPrototypeOf(r) === Object.prototype && Object.values(r).every((e) => typeof e == "string");
class Xt {
  /** Creates a new {@link RichImageData}. */
  constructor(e, t) {
    if (this.data = e, this.mimeType = t, !(e instanceof Uint8Array))
      throw new TypeError("data must be a Uint8Array.");
    if (typeof t != "string")
      throw new TypeError("mimeType must be a string.");
  }
}
class Js {
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
const ji = (r) => {
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
      if (e !== null && typeof e != "string" && !(e instanceof Uint8Array) && !(e instanceof Xt) && !(e instanceof Js) && !No(e))
        throw new TypeError("Each value in tags.raw must be a string, Uint8Array, RichImageData, AttachedFile, Record<string, string>, or null.");
  }
}, st = {
  default: !0,
  primary: !0,
  forced: !1,
  original: !1,
  commentary: !1,
  hearingImpaired: !1,
  visuallyImpaired: !1
}, Vo = (r) => {
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
class G {
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
    const e = new G(this.bytes);
    return e.pos = this.pos, e;
  }
}
const vt = [
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
], Er = [-1, 1, 2, 3, 4, 5, 6, 8], kn = (r) => {
  if (!r || r.byteLength < 2)
    throw new TypeError("AAC description must be at least 2 bytes long.");
  const e = new G(r);
  let t = e.readBits(5);
  t === 31 && (t = 32 + e.readBits(6));
  const i = e.readBits(4);
  let n = null;
  i === 15 ? n = e.readBits(24) : i < vt.length && (n = vt[i]);
  const s = e.readBits(4);
  let a = null;
  return s >= 1 && s <= 7 && (a = Er[s]), {
    objectType: t,
    frequencyIndex: i,
    sampleRate: n,
    channelConfiguration: s,
    numberOfChannels: a
  };
}, ea = (r) => {
  let e = vt.indexOf(r.sampleRate), t = null;
  e === -1 && (e = 15, t = r.sampleRate);
  const i = Er.indexOf(r.numberOfChannels);
  if (i === -1)
    throw new TypeError(`Unsupported number of channels: ${r.numberOfChannels}`);
  let n = 13;
  r.objectType >= 32 && (n += 6), e === 15 && (n += 24);
  const s = Math.ceil(n / 8), a = new Uint8Array(s), o = new G(a);
  return r.objectType < 32 ? o.writeBits(5, r.objectType) : (o.writeBits(5, 31), o.writeBits(6, r.objectType - 32)), o.writeBits(4, e), e === 15 && o.writeBits(24, t), o.writeBits(4, i), a;
};
const Ae = [
  "avc",
  "hevc",
  "vp9",
  "av1",
  "vp8"
], fe = [
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
], $t = [
  "aac",
  "opus",
  "mp3",
  "vorbis",
  "flac",
  "ac3",
  "eac3"
], Se = [
  ...$t,
  ...fe
], Ar = [
  "webvtt"
], Xr = [
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
], Xn = [
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
], mt = [
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
], $n = [
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
], Yn = ".01.01.01.01.00", Zn = ".0.110.01.01.01.0", Uo = (r, e, t, i) => {
  if (r === "avc") {
    const s = Math.ceil(e / 16) * Math.ceil(t / 16), a = Xr.find((u) => s <= u.maxMacroblocks && i <= u.maxBitrate) ?? ee(Xr), o = a ? a.level : 0, c = "64".padStart(2, "0"), l = "00", d = o.toString(16).padStart(2, "0");
    return `avc1.${c}${l}${d}`;
  } else if (r === "hevc") {
    const o = e * t, c = Xn.find((d) => o <= d.maxPictureSize && i <= d.maxBitrate) ?? ee(Xn);
    return `hev1.1.6.${c.tier}${c.level}.B0`;
  } else {
    if (r === "vp8")
      return "vp8";
    if (r === "vp9") {
      const s = e * t;
      return `vp09.00.${(mt.find((c) => s <= c.maxPictureSize && i <= c.maxBitrate) ?? ee(mt)).level.toString().padStart(2, "0")}.08`;
    } else if (r === "av1") {
      const s = e * t, a = $n.find((l) => s <= l.maxPictureSize && i <= l.maxBitrate) ?? ee($n);
      return `av01.0.${a.level.toString().padStart(2, "0")}${a.tier}.08`;
    }
  }
  throw new TypeError(`Unhandled codec '${r}'.`);
}, Wo = (r) => {
  const e = r.split("."), n = (1 << 7) + 1, s = Number(e[1]), a = e[2], o = Number(a.slice(0, -1)), c = (s << 5) + o, l = a.slice(-1) === "H" ? 1 : 0, u = Number(e[3]) === 8 ? 0 : 1, f = 0, h = e[4] ? Number(e[4]) : 0, p = e[5] ? Number(e[5][0]) : 1, m = e[5] ? Number(e[5][1]) : 1, b = e[5] ? Number(e[5][2]) : 0, k = (l << 7) + (u << 6) + (f << 5) + (h << 4) + (p << 3) + (m << 2) + b;
  return [n, c, k, 0];
}, yn = (r) => {
  const { codec: e, codecDescription: t, colorSpace: i, avcCodecInfo: n, hevcCodecInfo: s, vp9CodecInfo: a, av1CodecInfo: o } = r;
  if (e === "avc") {
    if (g(r.avcType !== null), n) {
      const c = new Uint8Array([
        n.avcProfileIndication,
        n.profileCompatibility,
        n.avcLevelIndication
      ]);
      return `avc${r.avcType}.${br(c)}`;
    }
    if (!t || t.byteLength < 4)
      throw new TypeError("AVC decoder description is not provided or is not at least 4 bytes long.");
    return `avc${r.avcType}.${br(t.subarray(1, 4))}`;
  } else if (e === "hevc") {
    let c, l, d, u, f, h;
    if (s)
      c = s.generalProfileSpace, l = s.generalProfileIdc, d = Hn(s.generalProfileCompatibilityFlags), u = s.generalTierFlag, f = s.generalLevelIdc, h = [...s.generalConstraintIndicatorFlags];
    else {
      if (!t || t.byteLength < 23)
        throw new TypeError("HEVC decoder description is not provided or is not at least 23 bytes long.");
      const m = Q(t), b = m.getUint8(1);
      c = b >> 6 & 3, l = b & 31, d = Hn(m.getUint32(2)), u = b >> 5 & 1, f = m.getUint8(12), h = [];
      for (let k = 0; k < 6; k++)
        h.push(m.getUint8(6 + k));
    }
    let p = "hev1.";
    for (p += ["", "A", "B", "C"][c] + l, p += ".", p += d.toString(16).toUpperCase(), p += ".", p += u === 0 ? "L" : "H", p += f; h.length > 0 && h[h.length - 1] === 0; )
      h.pop();
    return h.length > 0 && (p += ".", p += h.map((m) => m.toString(16).toUpperCase()).join(".")), p;
  } else {
    if (e === "vp8")
      return "vp8";
    if (e === "vp9") {
      if (!a) {
        const k = r.width * r.height;
        let y = ee(mt).level;
        for (const w of mt)
          if (k <= w.maxPictureSize) {
            y = w.level;
            break;
          }
        return `vp09.00.${y.toString().padStart(2, "0")}.08`;
      }
      const c = a.profile.toString().padStart(2, "0"), l = a.level.toString().padStart(2, "0"), d = a.bitDepth.toString().padStart(2, "0"), u = a.chromaSubsampling.toString().padStart(2, "0"), f = a.colourPrimaries.toString().padStart(2, "0"), h = a.transferCharacteristics.toString().padStart(2, "0"), p = a.matrixCoefficients.toString().padStart(2, "0"), m = a.videoFullRangeFlag.toString().padStart(2, "0");
      let b = `vp09.${c}.${l}.${d}.${u}`;
      return b += `.${f}.${h}.${p}.${m}`, b.endsWith(Yn) && (b = b.slice(0, -Yn.length)), b;
    } else if (e === "av1") {
      if (!o) {
        const w = r.width * r.height;
        let T = ee(mt).level;
        for (const A of mt)
          if (w <= A.maxPictureSize) {
            T = A.level;
            break;
          }
        return `av01.0.${T.toString().padStart(2, "0")}M.08`;
      }
      const c = o.profile, l = o.level.toString().padStart(2, "0"), d = o.tier ? "H" : "M", u = o.bitDepth.toString().padStart(2, "0"), f = o.monochrome ? "1" : "0", h = 100 * o.chromaSubsamplingX + 10 * o.chromaSubsamplingY + 1 * (o.chromaSubsamplingX && o.chromaSubsamplingY ? o.chromaSamplePosition : 0), p = i?.primaries ? rr[i.primaries] : 1, m = i?.transfer ? ir[i.transfer] : 1, b = i?.matrix ? nr[i.matrix] : 1, k = i?.fullRange ? 1 : 0;
      let y = `av01.${c}.${l}${d}.${u}`;
      return y += `.${f}.${h.toString().padStart(3, "0")}`, y += `.${p.toString().padStart(2, "0")}`, y += `.${m.toString().padStart(2, "0")}`, y += `.${b.toString().padStart(2, "0")}`, y += `.${k}`, y.endsWith(Zn) && (y = y.slice(0, -Zn.length)), y;
    }
  }
  throw new TypeError(`Unhandled codec '${e}'.`);
}, ta = (r, e, t) => {
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
  if (fe.includes(r))
    return r;
  throw new TypeError(`Unhandled codec '${r}'.`);
}, bn = (r) => {
  const { codec: e, codecDescription: t, aacCodecInfo: i } = r;
  if (e === "aac") {
    if (!i)
      throw new TypeError("AAC codec info must be provided.");
    if (i.isMpeg2)
      return "mp4a.67";
    {
      let n;
      return i.objectType !== null ? n = i.objectType : n = kn(t).objectType, `mp4a.40.${n}`;
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
    if (e && fe.includes(e))
      return e;
  }
  throw new TypeError(`Unhandled codec '${e}'.`);
}, Lo = (r) => {
  switch (r.codec) {
    case "flac": {
      const e = Qr("ZkxhQ4AAACIQABAAAAYtACWtCsRC8AANRBhVFucAcYu5ASE2m1Dxv8tw");
      return r.sampleRate >= 1 << 20 || r.numberOfChannels > 8 ? !1 : (e[18] = r.sampleRate >>> 12, e[19] = r.sampleRate >>> 4, e[20] = (r.sampleRate & 15) << 4 | r.numberOfChannels - 1 << 1, e);
    }
    case "vorbis": {
      const e = Qr("Ah7/AgF2b3JiaXMAAAAAAoC7AAAAAAAAgLUBAAAAAAC4AQN2b3JiaXMNAAAATGF2ZjU4Ljc2LjEwMAgAAAAMAAAAbGFuZ3VhZ2U9dW5kGQAAAGhhbmRsZXJfbmFtZT1Tb3VuZEhhbmRsZXIWAAAAdmVuZG9yX2lkPVswXVswXVswXVswXSAAAABlbmNvZGVyPUxhdmM1OC4xMzQuMTAwIGxpYnZvcmJpcxAAAABtYWpvcl9icmFuZD1pc29tEQAAAG1pbm9yX3ZlcnNpb249NTEyIgAAAGNvbXBhdGlibGVfYnJhbmRzPWlzb21pc28yYXZjMW1wNDEmAAAAREVTQ1JJUFRJT049TWFkZSB3aXRoIFJlbW90aW9uIDQuMC4yNzgBBXZvcmJpcyVCQ1YBAEAAACRzGCpGpXMWhBAaQlAZ4xxCzmvsGUJMEYIcMkxbyyVzkCGkoEKIWyiB0JBVAABAAACHQXgUhIpBCCGEJT1YkoMnPQghhIg5eBSEaUEIIYQQQgghhBBCCCGERTlokoMnQQgdhOMwOAyD5Tj4HIRFOVgQgydB6CCED0K4moOsOQghhCQ1SFCDBjnoHITCLCiKgsQwuBaEBDUojILkMMjUgwtCiJqDSTX4GoRnQXgWhGlBCCGEJEFIkIMGQcgYhEZBWJKDBjm4FITLQagahCo5CB+EIDRkFQCQAACgoiiKoigKEBqyCgDIAAAQQFEUx3EcyZEcybEcCwgNWQUAAAEACAAAoEiKpEiO5EiSJFmSJVmSJVmS5omqLMuyLMuyLMsyEBqyCgBIAABQUQxFcRQHCA1ZBQBkAAAIoDiKpViKpWiK54iOCISGrAIAgAAABAAAEDRDUzxHlETPVFXXtm3btm3btm3btm3btm1blmUZCA1ZBQBAAAAQ0mlmqQaIMAMZBkJDVgEACAAAgBGKMMSA0JBVAABAAACAGEoOogmtOd+c46BZDppKsTkdnEi1eZKbirk555xzzsnmnDHOOeecopxZDJoJrTnnnMSgWQqaCa0555wnsXnQmiqtOeeccc7pYJwRxjnnnCateZCajbU555wFrWmOmkuxOeecSLl5UptLtTnnnHPOOeecc84555zqxekcnBPOOeecqL25lpvQxTnnnE/G6d6cEM4555xzzjnnnHPOOeecIDRkFQAABABAEIaNYdwpCNLnaCBGEWIaMulB9+gwCRqDnELq0ehopJQ6CCWVcVJKJwgNWQUAAAIAQAghhRRSSCGFFFJIIYUUYoghhhhyyimnoIJKKqmooowyyyyzzDLLLLPMOuyssw47DDHEEEMrrcRSU2011lhr7jnnmoO0VlprrbVSSimllFIKQkNWAQAgAAAEQgYZZJBRSCGFFGKIKaeccgoqqIDQkFUAACAAgAAAAABP8hzRER3RER3RER3RER3R8RzPESVREiVREi3TMjXTU0VVdWXXlnVZt31b2IVd933d933d+HVhWJZlWZZlWZZlWZZlWZZlWZYgNGQVAAACAAAghBBCSCGFFFJIKcYYc8w56CSUEAgNWQUAAAIACAAAAHAUR3EcyZEcSbIkS9IkzdIsT/M0TxM9URRF0zRV0RVdUTdtUTZl0zVdUzZdVVZtV5ZtW7Z125dl2/d93/d93/d93/d93/d9XQdCQ1YBABIAADqSIymSIimS4ziOJElAaMgqAEAGAEAAAIriKI7jOJIkSZIlaZJneZaomZrpmZ4qqkBoyCoAABAAQAAAAAAAAIqmeIqpeIqoeI7oiJJomZaoqZoryqbsuq7ruq7ruq7ruq7ruq7ruq7ruq7ruq7ruq7ruq7ruq7ruq4LhIasAgAkAAB0JEdyJEdSJEVSJEdygNCQVQCADACAAAAcwzEkRXIsy9I0T/M0TxM90RM901NFV3SB0JBVAAAgAIAAAAAAAAAMybAUy9EcTRIl1VItVVMt1VJF1VNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVN0zRNEwgNWQkAkAEAkBBTLS3GmgmLJGLSaqugYwxS7KWxSCpntbfKMYUYtV4ah5RREHupJGOKQcwtpNApJq3WVEKFFKSYYyoVUg5SIDRkhQAQmgHgcBxAsixAsiwAAAAAAAAAkDQN0DwPsDQPAAAAAAAAACRNAyxPAzTPAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABA0jRA8zxA8zwAAAAAAAAA0DwP8DwR8EQRAAAAAAAAACzPAzTRAzxRBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABA0jRA8zxA8zwAAAAAAAAAsDwP8EQR0DwRAAAAAAAAACzPAzxRBDzRAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAEOAAABBgIRQasiIAiBMAcEgSJAmSBM0DSJYFTYOmwTQBkmVB06BpME0AAAAAAAAAAAAAJE2DpkHTIIoASdOgadA0iCIAAAAAAAAAAAAAkqZB06BpEEWApGnQNGgaRBEAAAAAAAAAAAAAzzQhihBFmCbAM02IIkQRpgkAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAGHAAAAgwoQwUGrIiAIgTAHA4imUBAIDjOJYFAACO41gWAABYliWKAABgWZooAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAYcAAACDChDBQashIAiAIAcCiKZQHHsSzgOJYFJMmyAJYF0DyApgFEEQAIAAAocAAACLBBU2JxgEJDVgIAUQAABsWxLE0TRZKkaZoniiRJ0zxPFGma53meacLzPM80IYqiaJoQRVE0TZimaaoqME1VFQAAUOAAABBgg6bE4gCFhqwEAEICAByKYlma5nmeJ4qmqZokSdM8TxRF0TRNU1VJkqZ5niiKommapqqyLE3zPFEURdNUVVWFpnmeKIqiaaqq6sLzPE8URdE0VdV14XmeJ4qiaJqq6roQRVE0TdNUTVV1XSCKpmmaqqqqrgtETxRNU1Vd13WB54miaaqqq7ouEE3TVFVVdV1ZBpimaaqq68oyQFVV1XVdV5YBqqqqruu6sgxQVdd1XVmWZQCu67qyLMsCAAAOHAAAAoygk4wqi7DRhAsPQKEhKwKAKAAAwBimFFPKMCYhpBAaxiSEFEImJaXSUqogpFJSKRWEVEoqJaOUUmopVRBSKamUCkIqJZVSAADYgQMA2IGFUGjISgAgDwCAMEYpxhhzTiKkFGPOOScRUoox55yTSjHmnHPOSSkZc8w556SUzjnnnHNSSuacc845KaVzzjnnnJRSSuecc05KKSWEzkEnpZTSOeecEwAAVOAAABBgo8jmBCNBhYasBABSAQAMjmNZmuZ5omialiRpmud5niiapiZJmuZ5nieKqsnzPE8URdE0VZXneZ4oiqJpqirXFUXTNE1VVV2yLIqmaZqq6rowTdNUVdd1XZimaaqq67oubFtVVdV1ZRm2raqq6rqyDFzXdWXZloEsu67s2rIAAPAEBwCgAhtWRzgpGgssNGQlAJABAEAYg5BCCCFlEEIKIYSUUggJAAAYcAAACDChDBQashIASAUAAIyx1lprrbXWQGettdZaa62AzFprrbXWWmuttdZaa6211lJrrbXWWmuttdZaa6211lprrbXWWmuttdZaa6211lprrbXWWmuttdZaa6211lprrbXWWmstpZRSSimllFJKKaWUUkoppZRSSgUA+lU4APg/2LA6wknRWGChISsBgHAAAMAYpRhzDEIppVQIMeacdFRai7FCiDHnJKTUWmzFc85BKCGV1mIsnnMOQikpxVZjUSmEUlJKLbZYi0qho5JSSq3VWIwxqaTWWoutxmKMSSm01FqLMRYjbE2ptdhqq7EYY2sqLbQYY4zFCF9kbC2m2moNxggjWywt1VprMMYY3VuLpbaaizE++NpSLDHWXAAAd4MDAESCjTOsJJ0VjgYXGrISAAgJACAQUooxxhhzzjnnpFKMOeaccw5CCKFUijHGnHMOQgghlIwx5pxzEEIIIYRSSsaccxBCCCGEkFLqnHMQQgghhBBKKZ1zDkIIIYQQQimlgxBCCCGEEEoopaQUQgghhBBCCKmklEIIIYRSQighlZRSCCGEEEIpJaSUUgohhFJCCKGElFJKKYUQQgillJJSSimlEkoJJYQSUikppRRKCCGUUkpKKaVUSgmhhBJKKSWllFJKIYQQSikFAAAcOAAABBhBJxlVFmGjCRcegEJDVgIAZAAAkKKUUiktRYIipRikGEtGFXNQWoqocgxSzalSziDmJJaIMYSUk1Qy5hRCDELqHHVMKQYtlRhCxhik2HJLoXMOAAAAQQCAgJAAAAMEBTMAwOAA4XMQdAIERxsAgCBEZohEw0JweFAJEBFTAUBigkIuAFRYXKRdXECXAS7o4q4DIQQhCEEsDqCABByccMMTb3jCDU7QKSp1IAAAAAAADADwAACQXAAREdHMYWRobHB0eHyAhIiMkAgAAAAAABcAfAAAJCVAREQ0cxgZGhscHR4fICEiIyQBAIAAAgAAAAAggAAEBAQAAAAAAAIAAAAEBA=="), t = Q(e);
      return t.setUint8(15, r.numberOfChannels), t.setUint32(16, r.sampleRate, !0), e;
    }
    default:
      return;
  }
}, oi = 48e3, ra = /^pcm-([usf])(\d+)+(be)?$/, it = (r) => {
  if (g(fe.includes(r)), r === "ulaw")
    return { dataType: "ulaw", sampleSize: 1, littleEndian: !0, silentValue: 255 };
  if (r === "alaw")
    return { dataType: "alaw", sampleSize: 1, littleEndian: !0, silentValue: 213 };
  const e = ra.exec(r);
  g(e);
  let t;
  e[1] === "u" ? t = "unsigned" : e[1] === "s" ? t = "signed" : t = "float";
  const i = Number(e[2]) / 8, n = e[3] !== "be", s = r === "pcm-u8" ? 2 ** 7 : 0;
  return { dataType: t, sampleSize: i, littleEndian: n, silentValue: s };
}, gt = (r) => r.startsWith("avc1") || r.startsWith("avc3") ? "avc" : r.startsWith("hev1") || r.startsWith("hvc1") ? "hevc" : r === "vp8" ? "vp8" : r.startsWith("vp09") ? "vp9" : r.startsWith("av01") ? "av1" : r === "mp3" || r === "mp4a.69" || r === "mp4a.6B" || r === "mp4a.6b" || r === "mp4a.40.34" ? "mp3" : r.startsWith("mp4a.40.") || r === "mp4a.67" ? "aac" : r === "opus" ? "opus" : r === "vorbis" ? "vorbis" : r === "flac" ? "flac" : r === "ac-3" || r === "ac3" ? "ac3" : r === "ec-3" || r === "eac3" ? "eac3" : r === "ulaw" ? "ulaw" : r === "alaw" ? "alaw" : ra.test(r) ? r : r === "webvtt" ? "webvtt" : null, Ho = (r) => r === "avc" ? {
  avc: {
    format: "avc"
    // Ensure the format is not Annex B
  }
} : r === "hevc" ? {
  hevc: {
    format: "hevc"
    // Ensure the format is not Annex B
  }
} : {}, qo = (r) => r === "aac" ? {
  aac: {
    format: "aac"
    // Ensure the format is not ADTS
  }
} : r === "opus" ? {
  opus: {
    format: "opus"
  }
} : {}, Ko = ["avc1", "avc3", "hev1", "hvc1", "vp8", "vp09", "av01"], jo = /^(avc1|avc3)\.[0-9a-fA-F]{6}$/, Qo = /^(hev1|hvc1)\.(?:[ABC]?\d+)\.[0-9a-fA-F]{1,8}\.[LH]\d+(?:\.[0-9a-fA-F]{1,2}){0,6}$/, Go = /^vp09(?:\.\d{2}){3}(?:(?:\.\d{2}){5})?$/, Xo = /^av01\.\d\.\d{2}[MH]\.\d{2}(?:\.\d\.\d{3}\.\d{2}\.\d{2}\.\d{2}\.\d)?$/, $o = (r) => {
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
  if (!Ko.some((e) => r.decoderConfig.codec.startsWith(e)))
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
  if (r.decoderConfig.description !== void 0 && !Cr(r.decoderConfig.description))
    throw new TypeError("Video chunk metadata decoder configuration description, when defined, must be an ArrayBuffer or an ArrayBuffer view.");
  if (r.decoderConfig.colorSpace !== void 0) {
    const { colorSpace: e } = r.decoderConfig;
    if (typeof e != "object")
      throw new TypeError("Video chunk metadata decoder configuration colorSpace, when provided, must be an object.");
    const t = Object.keys(rr);
    if (e.primaries != null && !t.includes(e.primaries))
      throw new TypeError(`Video chunk metadata decoder configuration colorSpace primaries, when defined, must be one of ${t.join(", ")}.`);
    const i = Object.keys(ir);
    if (e.transfer != null && !i.includes(e.transfer))
      throw new TypeError(`Video chunk metadata decoder configuration colorSpace transfer, when defined, must be one of ${i.join(", ")}.`);
    const n = Object.keys(nr);
    if (e.matrix != null && !n.includes(e.matrix))
      throw new TypeError(`Video chunk metadata decoder configuration colorSpace matrix, when defined, must be one of ${n.join(", ")}.`);
    if (e.fullRange != null && typeof e.fullRange != "boolean")
      throw new TypeError("Video chunk metadata decoder configuration colorSpace fullRange, when defined, must be a boolean.");
  }
  if (r.decoderConfig.codec.startsWith("avc1") || r.decoderConfig.codec.startsWith("avc3")) {
    if (!jo.test(r.decoderConfig.codec))
      throw new TypeError("Video chunk metadata decoder configuration codec string for AVC must be a valid AVC codec string as specified in Section 3.4 of RFC 6381.");
  } else if (r.decoderConfig.codec.startsWith("hev1") || r.decoderConfig.codec.startsWith("hvc1")) {
    if (!Qo.test(r.decoderConfig.codec))
      throw new TypeError("Video chunk metadata decoder configuration codec string for HEVC must be a valid HEVC codec string as specified in Section E.3 of ISO 14496-15.");
  } else if (r.decoderConfig.codec.startsWith("vp8")) {
    if (r.decoderConfig.codec !== "vp8")
      throw new TypeError('Video chunk metadata decoder configuration codec string for VP8 must be "vp8".');
  } else if (r.decoderConfig.codec.startsWith("vp09")) {
    if (!Go.test(r.decoderConfig.codec))
      throw new TypeError('Video chunk metadata decoder configuration codec string for VP9 must be a valid VP9 codec string as specified in Section "Codecs Parameter String" of https://www.webmproject.org/vp9/mp4/.');
  } else if (r.decoderConfig.codec.startsWith("av01") && !Xo.test(r.decoderConfig.codec))
    throw new TypeError('Video chunk metadata decoder configuration codec string for AV1 must be a valid AV1 codec string as specified in Section "Codecs Parameter String" of https://aomediacodec.github.io/av1-isobmff/.');
}, Yo = [
  "mp4a",
  "mp3",
  "opus",
  "vorbis",
  "flac",
  "ulaw",
  "alaw",
  "pcm",
  "ac-3",
  "ec-3"
], Zo = (r) => {
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
  if (!Yo.some((e) => r.decoderConfig.codec.startsWith(e)))
    throw new TypeError("Audio chunk metadata decoder configuration codec string must be a valid audio codec string as specified in the Mediabunny Codec Registry.");
  if (!Number.isInteger(r.decoderConfig.sampleRate) || r.decoderConfig.sampleRate <= 0)
    throw new TypeError("Audio chunk metadata decoder configuration must specify a valid sampleRate (positive integer).");
  if (!Number.isInteger(r.decoderConfig.numberOfChannels) || r.decoderConfig.numberOfChannels <= 0)
    throw new TypeError("Audio chunk metadata decoder configuration must specify a valid numberOfChannels (positive integer).");
  if (r.decoderConfig.description !== void 0 && !Cr(r.decoderConfig.description))
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
  } else if ((r.decoderConfig.codec.startsWith("pcm") || r.decoderConfig.codec.startsWith("ulaw") || r.decoderConfig.codec.startsWith("alaw")) && !fe.includes(r.decoderConfig.codec))
    throw new TypeError(`Audio chunk metadata decoder configuration codec string for PCM must be one of the supported PCM codecs (${fe.join(", ")}).`);
}, Jo = (r) => {
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
const Et = 4, ec = [44100, 48e3, 32e3], tc = [
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
], ia = 1483304551, na = 1231971951, rc = (r, e, t, i, n) => e === 0 ? 0 : e === 1 ? Math.floor(144 * t / (i << r)) + n : e === 2 ? Math.floor(144 * t / i) + n : (Math.floor(12 * t / i) + n) * 4, ic = (r, e, t, i) => e === 0 ? 0 : e === 1 ? 144 * t / (i << r) : e === 2 ? 144 * t / i : 12 * t / i * 4, sa = (r, e) => r === 3 ? e === 3 ? 21 : 36 : e === 3 ? 13 : 21, wn = (r, e) => {
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
  const c = i >> 3 & 3, l = i >> 1 & 3, d = n >> 4 & 15, u = (n >> 2 & 3) % 3, f = n >> 1 & 1, h = s >> 6 & 3, p = s >> 4 & 3, m = s >> 3 & 1, b = s >> 2 & 1, k = s & 3, y = tc[a * 16 * 4 + l * 16 + d];
  if (y === -1)
    return { header: null, bytesAdvanced: 1 };
  const w = y * 1e3, T = ec[u] >> a + o, A = rc(a, l, w, T, f);
  if (e !== null && e < A)
    return { header: null, bytesAdvanced: 1 };
  let x;
  return c === 3 ? x = l === 3 ? 384 : 1152 : l === 3 ? x = 384 : l === 2 ? x = 1152 : x = 576, {
    header: {
      totalSize: A,
      mpegVersionId: c,
      lowSamplingFrequency: a,
      layer: l,
      bitrate: w,
      frequencyIndex: u,
      sampleRate: T,
      channel: h,
      modeExtension: p,
      copyright: m,
      original: b,
      emphasis: k,
      audioSamplesInFrame: x
    },
    bytesAdvanced: 1
  };
}, Qi = (r) => {
  let e = 2130706432, t = 0;
  for (; e !== 0; )
    t >>= 1, t |= r & e, e >>= 8;
  return t;
};
var $r;
(function(r) {
  r[r.FrameCount = 1] = "FrameCount", r[r.FileSize = 2] = "FileSize", r[r.Toc = 4] = "Toc";
})($r || ($r = {}));
const ci = [48e3, 44100, 32e3], aa = [24e3, 22050, 16e3];
var We;
(function(r) {
  r[r.NON_IDR_SLICE = 1] = "NON_IDR_SLICE", r[r.SLICE_DPA = 2] = "SLICE_DPA", r[r.SLICE_DPB = 3] = "SLICE_DPB", r[r.SLICE_DPC = 4] = "SLICE_DPC", r[r.IDR = 5] = "IDR", r[r.SEI = 6] = "SEI", r[r.SPS = 7] = "SPS", r[r.PPS = 8] = "PPS", r[r.AUD = 9] = "AUD", r[r.SPS_EXT = 13] = "SPS_EXT";
})(We || (We = {}));
var ue;
(function(r) {
  r[r.RASL_N = 8] = "RASL_N", r[r.RASL_R = 9] = "RASL_R", r[r.BLA_W_LP = 16] = "BLA_W_LP", r[r.RSV_IRAP_VCL23 = 23] = "RSV_IRAP_VCL23", r[r.VPS_NUT = 32] = "VPS_NUT", r[r.SPS_NUT = 33] = "SPS_NUT", r[r.PPS_NUT = 34] = "PPS_NUT", r[r.AUD_NUT = 35] = "AUD_NUT", r[r.PREFIX_SEI_NUT = 39] = "PREFIX_SEI_NUT", r[r.SUFFIX_SEI_NUT = 40] = "SUFFIX_SEI_NUT";
})(ue || (ue = {}));
const _r = function* (r) {
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
}, oa = function* (r, e) {
  let t = 0;
  const i = new DataView(r.buffer, r.byteOffset, r.byteLength);
  for (; t + e <= r.length; ) {
    let n;
    e === 1 ? n = i.getUint8(t) : e === 2 ? n = i.getUint16(t, !1) : e === 3 ? n = ni(i, t, !1) : (g(e === 4), n = i.getUint32(t, !1)), t += e, yield {
      offset: t,
      length: n
    }, t += n;
  }
}, ca = (r, e) => {
  if (e.description) {
    const n = (pe(e.description)[4] & 3) + 1;
    return oa(r, n);
  } else
    return _r(r);
}, li = (r) => r & 31, ui = (r) => {
  const e = [], t = r.length;
  for (let i = 0; i < t; i++)
    i + 2 < t && r[i] === 0 && r[i + 1] === 0 && r[i + 2] === 3 ? (e.push(0, 0), i += 2) : e.push(r[i]);
  return new Uint8Array(e);
}, Ai = new Uint8Array([0, 0, 0, 1]), la = (r) => {
  const e = r.reduce((n, s) => n + Ai.byteLength + s.byteLength, 0), t = new Uint8Array(e);
  let i = 0;
  for (const n of r)
    t.set(Ai, i), i += Ai.byteLength, t.set(n, i), i += n.byteLength;
  return t;
}, Tn = (r, e) => {
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
        mn(a, n, s.byteLength, !1);
        break;
      case 4:
        a.setUint32(n, s.byteLength, !1);
        break;
    }
    n += e, i.set(s, n), n += s.byteLength;
  }
  return i;
}, nc = (r, e) => {
  if (e.description) {
    const n = (pe(e.description)[4] & 3) + 1;
    return Tn(r, n);
  } else
    return la(r);
}, An = (r) => {
  try {
    const e = [], t = [], i = [];
    for (const o of _r(r)) {
      const c = r.subarray(o.offset, o.offset + o.length), l = li(c[0]);
      l === We.SPS ? e.push(c) : l === We.PPS ? t.push(c) : l === We.SPS_EXT && i.push(c);
    }
    if (e.length === 0 || t.length === 0)
      return null;
    const n = e[0], s = Sn(n);
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
    return console.error("Error building AVC Decoder Configuration Record:", e), null;
  }
}, sc = (r) => {
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
}, ac = (r) => {
  try {
    const e = Q(r);
    let t = 0;
    const i = e.getUint8(t++), n = e.getUint8(t++), s = e.getUint8(t++), a = e.getUint8(t++), o = e.getUint8(t++) & 3, c = e.getUint8(t++) & 31, l = [];
    for (let h = 0; h < c; h++) {
      const p = e.getUint16(t, !1);
      t += 2, l.push(r.subarray(t, t + p)), t += p;
    }
    const d = e.getUint8(t++), u = [];
    for (let h = 0; h < d; h++) {
      const p = e.getUint16(t, !1);
      t += 2, u.push(r.subarray(t, t + p)), t += p;
    }
    const f = {
      configurationVersion: i,
      avcProfileIndication: n,
      profileCompatibility: s,
      avcLevelIndication: a,
      lengthSizeMinusOne: o,
      sequenceParameterSets: l,
      pictureParameterSets: u,
      chromaFormat: null,
      bitDepthLumaMinus8: null,
      bitDepthChromaMinus8: null,
      sequenceParameterSetExt: null
    };
    if ((n === 100 || n === 110 || n === 122 || n === 144) && t + 4 <= r.length) {
      const h = e.getUint8(t++) & 3, p = e.getUint8(t++) & 7, m = e.getUint8(t++) & 7, b = e.getUint8(t++);
      f.chromaFormat = h, f.bitDepthLumaMinus8 = p, f.bitDepthChromaMinus8 = m;
      const k = [];
      for (let y = 0; y < b; y++) {
        const w = e.getUint16(t, !1);
        t += 2, k.push(r.subarray(t, t + w)), t += w;
      }
      f.sequenceParameterSetExt = k;
    }
    return f;
  } catch (e) {
    return console.error("Error deserializing AVC Decoder Configuration Record:", e), null;
  }
}, ua = {
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
}, Sn = (r) => {
  try {
    const e = new G(ui(r));
    if (e.skipBits(1), e.skipBits(2), e.readBits(5) !== 7)
      return null;
    const i = e.readAlignedByte(), n = e.readAlignedByte(), s = e.readAlignedByte();
    F(e);
    let a = 1, o = 0, c = 0, l = 0;
    if ((i === 100 || i === 110 || i === 122 || i === 244 || i === 44 || i === 83 || i === 86 || i === 118 || i === 128) && (a = F(e), a === 3 && (l = e.readBits(1)), o = F(e), c = F(e), e.skipBits(1), e.readBits(1))) {
      for (let B = 0; B < (a !== 3 ? 8 : 12); B++)
        if (e.readBits(1)) {
          const W = B < 6 ? 16 : 64;
          let U = 8, M = 8;
          for (let L = 0; L < W; L++) {
            if (M !== 0) {
              const X = tt(e);
              M = (U + X + 256) % 256;
            }
            U = M === 0 ? U : M;
          }
        }
    }
    F(e);
    const d = F(e);
    if (d === 0)
      F(e);
    else if (d === 1) {
      e.skipBits(1), tt(e), tt(e);
      const D = F(e);
      for (let B = 0; B < D; B++)
        tt(e);
    }
    F(e), e.skipBits(1);
    const u = F(e), f = F(e), h = 16 * (u + 1), p = 16 * (f + 1);
    let m = h, b = p;
    const k = e.readBits(1);
    if (k || e.skipBits(1), e.skipBits(1), e.readBits(1)) {
      const D = F(e), B = F(e), O = F(e), W = F(e);
      let U, M;
      if ((l === 0 ? a : 0) === 0)
        U = 1, M = 2 - k;
      else {
        const X = a === 3 ? 1 : 2, ie = a === 1 ? 2 : 1;
        U = X, M = ie * (2 - k);
      }
      m -= U * (D + B), b -= M * (O + W);
    }
    let w = 2, T = 2, A = 2, x = 0, I = { num: 1, den: 1 }, P = null, S = null;
    if (e.readBits(1)) {
      if (e.readBits(1)) {
        const ie = e.readBits(8);
        if (ie === 255)
          I = {
            num: e.readBits(16),
            den: e.readBits(16)
          };
        else {
          const Ke = ua[ie];
          Ke && (I = Ke);
        }
      }
      e.readBits(1) && e.skipBits(1), e.readBits(1) && (e.skipBits(3), x = e.readBits(1), e.readBits(1) && (w = e.readBits(8), T = e.readBits(8), A = e.readBits(8))), e.readBits(1) && (F(e), F(e)), e.readBits(1) && (e.skipBits(32), e.skipBits(32), e.skipBits(1));
      const M = e.readBits(1);
      M && Jn(e);
      const L = e.readBits(1);
      L && Jn(e), (M || L) && e.skipBits(1), e.skipBits(1), e.readBits(1) && (e.skipBits(1), F(e), F(e), F(e), F(e), P = F(e), S = F(e));
    }
    if (P === null) {
      g(S === null);
      const D = n & 16;
      if ((i === 44 || i === 86 || i === 100 || i === 110 || i === 122 || i === 244) && D)
        P = 0, S = 0;
      else {
        const B = u + 1, O = f + 1, W = (2 - k) * O, U = Xr.find((L) => L.level >= s) ?? ee(Xr), M = Math.min(Math.floor(U.maxDpbMbs / (B * W)), 16);
        P = M, S = M;
      }
    }
    return g(S !== null), {
      profileIdc: i,
      constraintFlags: n,
      levelIdc: s,
      frameMbsOnlyFlag: k,
      chromaFormatIdc: a,
      bitDepthLumaMinus8: o,
      bitDepthChromaMinus8: c,
      codedWidth: h,
      codedHeight: p,
      displayWidth: m,
      displayHeight: b,
      pixelAspectRatio: I,
      colourPrimaries: w,
      matrixCoefficients: A,
      transferCharacteristics: T,
      fullRangeFlag: x,
      numReorderFrames: P,
      maxDecFrameBuffering: S
    };
  } catch (e) {
    return console.error("Error parsing AVC SPS:", e), null;
  }
}, Jn = (r) => {
  const e = F(r);
  r.skipBits(4), r.skipBits(4);
  for (let t = 0; t <= e; t++)
    F(r), F(r), r.skipBits(1);
  r.skipBits(5), r.skipBits(5), r.skipBits(5), r.skipBits(5);
}, oc = (r, e) => {
  if (e.description) {
    const n = (pe(e.description)[21] & 3) + 1;
    return Tn(r, n);
  } else
    return la(r);
}, Yr = (r, e) => {
  if (e.description) {
    const n = (pe(e.description)[21] & 3) + 1;
    return oa(r, n);
  } else
    return _r(r);
}, er = (r) => r >> 1 & 63, da = (r) => {
  try {
    const e = new G(ui(r));
    e.skipBits(16), e.readBits(4);
    const t = e.readBits(3), i = e.readBits(1), { general_profile_space: n, general_tier_flag: s, general_profile_idc: a, general_profile_compatibility_flags: o, general_constraint_indicator_flags: c, general_level_idc: l } = cc(e, t);
    F(e);
    const d = F(e);
    let u = 0;
    d === 3 && (u = e.readBits(1));
    const f = F(e), h = F(e);
    let p = f, m = h;
    if (e.readBits(1)) {
      const B = F(e), O = F(e), W = F(e), U = F(e);
      let M = 1, L = 1;
      const X = u === 0 ? d : 0;
      X === 1 ? (M = 2, L = 2) : X === 2 && (M = 2, L = 1), p -= (B + O) * M, m -= (W + U) * L;
    }
    const b = F(e), k = F(e);
    F(e);
    const w = e.readBits(1) ? 0 : t;
    let T = 0;
    for (let B = w; B <= t; B++)
      F(e), T = F(e), F(e);
    F(e), F(e), F(e), F(e), F(e), F(e), e.readBits(1) && e.readBits(1) && lc(e), e.skipBits(1), e.skipBits(1), e.readBits(1) && (e.skipBits(4), e.skipBits(4), F(e), F(e), e.skipBits(1));
    const A = F(e);
    if (uc(e, A), e.readBits(1)) {
      const B = F(e);
      for (let O = 0; O < B; O++)
        F(e), e.skipBits(1);
    }
    e.skipBits(1), e.skipBits(1);
    let x = 2, I = 2, P = 2, S = 0, E = 0, D = { num: 1, den: 1 };
    if (e.readBits(1)) {
      const B = fc(e, t);
      D = B.pixelAspectRatio, x = B.colourPrimaries, I = B.transferCharacteristics, P = B.matrixCoefficients, S = B.fullRangeFlag, E = B.minSpatialSegmentationIdc;
    }
    return {
      displayWidth: p,
      displayHeight: m,
      pixelAspectRatio: D,
      colourPrimaries: x,
      transferCharacteristics: I,
      matrixCoefficients: P,
      fullRangeFlag: S,
      maxDecFrameBuffering: T + 1,
      spsMaxSubLayersMinus1: t,
      spsTemporalIdNestingFlag: i,
      generalProfileSpace: n,
      generalTierFlag: s,
      generalProfileIdc: a,
      generalProfileCompatibilityFlags: o,
      generalConstraintIndicatorFlags: c,
      generalLevelIdc: l,
      chromaFormatIdc: d,
      bitDepthLumaMinus8: b,
      bitDepthChromaMinus8: k,
      minSpatialSegmentationIdc: E
    };
  } catch (e) {
    return console.error("Error parsing HEVC SPS:", e), null;
  }
}, xn = (r) => {
  try {
    const e = [], t = [], i = [], n = [];
    for (const l of _r(r)) {
      const d = r.subarray(l.offset, l.offset + l.length), u = er(d[0]);
      u === ue.VPS_NUT ? e.push(d) : u === ue.SPS_NUT ? t.push(d) : u === ue.PPS_NUT ? i.push(d) : (u === ue.PREFIX_SEI_NUT || u === ue.SUFFIX_SEI_NUT) && n.push(d);
    }
    if (t.length === 0 || i.length === 0)
      return null;
    const s = da(t[0]);
    if (!s)
      return null;
    let a = 0;
    if (i.length > 0) {
      const l = i[0], d = new G(ui(l));
      d.skipBits(16), F(d), F(d), d.skipBits(1), d.skipBits(1), d.skipBits(3), d.skipBits(1), d.skipBits(1), F(d), F(d), tt(d), d.skipBits(1), d.skipBits(1), d.readBits(1) && F(d), tt(d), tt(d), d.skipBits(1), d.skipBits(1), d.skipBits(1), d.skipBits(1);
      const u = d.readBits(1), f = d.readBits(1);
      !u && !f ? a = 0 : u && !f ? a = 2 : !u && f ? a = 3 : a = 0;
    }
    const o = [
      ...e.length ? [
        {
          arrayCompleteness: 1,
          nalUnitType: ue.VPS_NUT,
          nalUnits: e
        }
      ] : [],
      ...t.length ? [
        {
          arrayCompleteness: 1,
          nalUnitType: ue.SPS_NUT,
          nalUnits: t
        }
      ] : [],
      ...i.length ? [
        {
          arrayCompleteness: 1,
          nalUnitType: ue.PPS_NUT,
          nalUnits: i
        }
      ] : [],
      ...n.length ? [
        {
          arrayCompleteness: 1,
          nalUnitType: er(n[0][0]),
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
    return console.error("Error building HEVC Decoder Configuration Record:", e), null;
  }
}, cc = (r, e) => {
  const t = r.readBits(2), i = r.readBits(1), n = r.readBits(5);
  let s = 0;
  for (let d = 0; d < 32; d++)
    s = s << 1 | r.readBits(1);
  const a = new Uint8Array(6);
  for (let d = 0; d < 6; d++)
    a[d] = r.readBits(8);
  const o = r.readBits(8), c = [], l = [];
  for (let d = 0; d < e; d++)
    c.push(r.readBits(1)), l.push(r.readBits(1));
  if (e > 0)
    for (let d = e; d < 8; d++)
      r.skipBits(2);
  for (let d = 0; d < e; d++)
    c[d] && r.skipBits(88), l[d] && r.skipBits(8);
  return {
    general_profile_space: t,
    general_tier_flag: i,
    general_profile_idc: n,
    general_profile_compatibility_flags: s,
    general_constraint_indicator_flags: a,
    general_level_idc: o
  };
}, lc = (r) => {
  for (let e = 0; e < 4; e++)
    for (let t = 0; t < (e === 3 ? 2 : 6); t++)
      if (!r.readBits(1))
        F(r);
      else {
        const n = Math.min(64, 1 << 4 + (e << 1));
        e > 1 && tt(r);
        for (let s = 0; s < n; s++)
          tt(r);
      }
}, uc = (r, e) => {
  const t = [];
  for (let i = 0; i < e; i++)
    t[i] = dc(r, i, e, t);
}, dc = (r, e, t, i) => {
  let n = 0, s = 0, a = 0;
  if (e !== 0 && (s = r.readBits(1)), s) {
    if (e === t) {
      const c = F(r);
      a = e - (c + 1);
    } else
      a = e - 1;
    r.readBits(1), F(r);
    const o = i[a] ?? 0;
    for (let c = 0; c <= o; c++)
      r.readBits(1) || r.readBits(1);
    n = i[a];
  } else {
    const o = F(r), c = F(r);
    for (let l = 0; l < o; l++)
      F(r), r.readBits(1);
    for (let l = 0; l < c; l++)
      F(r), r.readBits(1);
    n = o + c;
  }
  return n;
}, fc = (r, e) => {
  let t = 2, i = 2, n = 2, s = 0, a = 0, o = { num: 1, den: 1 };
  if (r.readBits(1)) {
    const c = r.readBits(8);
    if (c === 255)
      o = {
        num: r.readBits(16),
        den: r.readBits(16)
      };
    else {
      const l = ua[c];
      l && (o = l);
    }
  }
  return r.readBits(1) && r.readBits(1), r.readBits(1) && (r.readBits(3), s = r.readBits(1), r.readBits(1) && (t = r.readBits(8), i = r.readBits(8), n = r.readBits(8))), r.readBits(1) && (F(r), F(r)), r.readBits(1), r.readBits(1), r.readBits(1), r.readBits(1) && (F(r), F(r), F(r), F(r)), r.readBits(1) && (r.readBits(32), r.readBits(32), r.readBits(1) && F(r), r.readBits(1) && hc(r, !0, e)), r.readBits(1) && (r.readBits(1), r.readBits(1), r.readBits(1), a = F(r), F(r), F(r), F(r), F(r)), {
    pixelAspectRatio: o,
    colourPrimaries: t,
    transferCharacteristics: i,
    matrixCoefficients: n,
    fullRangeFlag: s,
    minSpatialSegmentationIdc: a
  };
}, hc = (r, e, t) => {
  let i = !1, n = !1, s = !1;
  i = r.readBits(1) === 1, n = r.readBits(1) === 1, (i || n) && (s = r.readBits(1) === 1, s && (r.readBits(8), r.readBits(5), r.readBits(1), r.readBits(5)), r.readBits(4), r.readBits(4), s && r.readBits(4), r.readBits(5), r.readBits(5), r.readBits(5));
  for (let a = 0; a <= t; a++) {
    const o = r.readBits(1) === 1;
    let c = !0;
    o || (c = r.readBits(1) === 1);
    let l = !1;
    c ? F(r) : l = r.readBits(1) === 1;
    let d = 1;
    l || (d = F(r) + 1), i && es(r, d, s), n && es(r, d, s);
  }
}, es = (r, e, t) => {
  for (let i = 0; i < e; i++)
    F(r), F(r), t && (F(r), F(r)), r.readBits(1);
}, mc = (r) => {
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
var le;
(function(r) {
  r[r.audAllowed = 0] = "audAllowed", r[r.beforeFirstVcl = 1] = "beforeFirstVcl", r[r.afterFirstVcl = 2] = "afterFirstVcl", r[r.eoBitstreamAllowed = 3] = "eoBitstreamAllowed", r[r.noMoreDataAllowed = 4] = "noMoreDataAllowed";
})(le || (le = {}));
const pc = (r, e) => {
  const t = /* @__PURE__ */ new Set();
  let i = le.audAllowed;
  for (const s of Yr(r, e)) {
    if (i === le.noMoreDataAllowed) {
      t.add(s.offset);
      continue;
    }
    const a = er(r[s.offset]);
    if (i === le.eoBitstreamAllowed && a !== 37) {
      t.add(s.offset);
      continue;
    }
    let o = !1;
    a === 35 ? i > le.audAllowed ? o = !0 : i = le.beforeFirstVcl : a <= 31 ? i > le.afterFirstVcl ? o = !0 : i = le.afterFirstVcl : a === 36 ? i !== le.afterFirstVcl ? o = !0 : i = le.eoBitstreamAllowed : a === 37 ? i < le.afterFirstVcl ? o = !0 : i = le.noMoreDataAllowed : a === 32 || a === 33 || a === 34 || a === 39 || a >= 41 && a <= 44 || a >= 48 && a <= 55 ? i > le.beforeFirstVcl ? o = !0 : i = le.beforeFirstVcl : (a === 38 || a === 40 || a >= 45 && a <= 47 || a >= 56 && a <= 63) && i < le.afterFirstVcl && (o = !0), o && t.add(s.offset);
  }
  if (t.size === 0)
    return null;
  const n = [];
  for (const s of Yr(r, e))
    t.has(s.offset) || n.push(r.subarray(s.offset, s.offset + s.length));
  return oc(n, e);
}, fa = (r) => {
  const e = new G(r);
  if (e.readBits(2) !== 2)
    return null;
  const i = e.readBits(1), s = (e.readBits(1) << 1) + i;
  if (s === 3 && e.skipBits(1), e.readBits(1) === 1 || e.readBits(1) !== 0 || (e.skipBits(2), e.readBits(24) !== 4817730))
    return null;
  let l = 8;
  s >= 2 && (l = e.readBits(1) ? 12 : 10);
  const d = e.readBits(3);
  let u = 0, f = 0;
  if (d !== 7)
    if (f = e.readBits(1), s === 1 || s === 3) {
      const I = e.readBits(1), P = e.readBits(1);
      u = !I && !P ? 3 : I && !P ? 2 : 1, e.skipBits(1);
    } else
      u = 1;
  else
    u = 3, f = 1;
  const h = e.readBits(16), p = e.readBits(16), m = h + 1, b = p + 1, k = m * b;
  let y = ee(mt).level;
  for (const x of mt)
    if (k <= x.maxPictureSize) {
      y = x.level;
      break;
    }
  return {
    profile: s,
    level: y,
    bitDepth: l,
    chromaSubsampling: u,
    videoFullRangeFlag: f,
    colourPrimaries: d === 2 ? 1 : d === 1 ? 6 : 2,
    transferCharacteristics: d === 2 ? 1 : d === 1 ? 6 : 2,
    matrixCoefficients: d === 7 ? 0 : d === 2 ? 1 : d === 1 ? 6 : 2
  };
}, ha = function* (r) {
  const e = new G(r), t = () => {
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
}, ma = (r) => {
  for (const { type: e, data: t } of ha(r)) {
    if (e !== 1)
      continue;
    const i = new G(t), n = i.readBits(3);
    i.readBits(1);
    const s = i.readBits(1);
    let a = 0, o = 0, c = 0;
    if (s)
      a = i.readBits(5);
    else {
      if (i.readBits(1) && (i.skipBits(32), i.skipBits(32), i.readBits(1)))
        return null;
      const A = i.readBits(1);
      A && (c = i.readBits(5), i.skipBits(32), i.skipBits(5), i.skipBits(5));
      const x = i.readBits(5);
      for (let I = 0; I <= x; I++) {
        i.skipBits(12);
        const P = i.readBits(5);
        if (I === 0 && (a = P), P > 7) {
          const E = i.readBits(1);
          I === 0 && (o = E);
        }
        if (A && i.readBits(1)) {
          const D = c + 1;
          i.skipBits(D), i.skipBits(D), i.skipBits(1);
        }
        i.readBits(1) && i.skipBits(4);
      }
    }
    const l = i.readBits(4), d = i.readBits(4), u = l + 1;
    i.skipBits(u);
    const f = d + 1;
    i.skipBits(f);
    let h = 0;
    if (s ? h = 0 : h = i.readBits(1), h && (i.skipBits(4), i.skipBits(3)), i.skipBits(1), i.skipBits(1), i.skipBits(1), !s) {
      i.skipBits(1), i.skipBits(1), i.skipBits(1), i.skipBits(1);
      const T = i.readBits(1);
      T && (i.skipBits(1), i.skipBits(1));
      const A = i.readBits(1);
      let x = 0;
      A ? x = 2 : x = i.readBits(1), x > 0 && (i.readBits(1) || i.skipBits(1)), T && i.skipBits(3);
    }
    i.skipBits(1), i.skipBits(1), i.skipBits(1);
    const p = i.readBits(1);
    let m = 8;
    n === 2 && p ? m = i.readBits(1) ? 12 : 10 : n <= 2 && (m = p ? 10 : 8);
    let b = 0;
    n !== 1 && (b = i.readBits(1));
    let k = 1, y = 1, w = 0;
    return b || (n === 0 ? (k = 1, y = 1) : n === 1 ? (k = 0, y = 0) : m === 12 && (k = i.readBits(1), k && (y = i.readBits(1))), k && y && (w = i.readBits(2))), {
      profile: n,
      level: a,
      tier: o,
      bitDepth: m,
      monochrome: b,
      chromaSubsamplingX: k,
      chromaSubsamplingY: y,
      chromaSamplePosition: w
    };
  }
  return null;
}, pa = (r) => {
  const e = Q(r), t = e.getUint8(9), i = e.getUint16(10, !0), n = e.getUint32(12, !0), s = e.getInt16(16, !0), a = e.getUint8(18);
  let o = null;
  return a && (o = r.subarray(19, 21 + t)), {
    outputChannelCount: t,
    preSkip: i,
    inputSampleRate: n,
    outputGain: s,
    channelMappingFamily: a,
    channelMappingTable: o
  };
}, gc = [
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
], kc = (r) => {
  const e = r[0] >> 3;
  return {
    durationInSamples: gc[e]
  };
}, yc = (r) => {
  if (r.length < 7)
    throw new Error("Setup header is too short.");
  if (r[0] !== 5)
    throw new Error("Wrong packet type in Setup header.");
  if (String.fromCharCode(...r.slice(1, 7)) !== "vorbis")
    throw new Error("Invalid packet signature in Setup header.");
  const t = r.length, i = new Uint8Array(t);
  for (let u = 0; u < t; u++)
    i[u] = r[t - 1 - u];
  const n = new G(i);
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
    const u = n.pos, f = n.readBits(8), h = n.readBits(16), p = n.readBits(16);
    if (f > 63 || h !== 0 || p !== 0) {
      n.pos = u;
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
  const d = Array(l).fill(0);
  for (let u = l - 1; u >= 0; u--)
    n.skipBits(40), d[u] = n.readBits(1);
  return { modeBlockflags: d };
}, Pn = (r, e, t) => {
  switch (r) {
    case "avc": {
      for (const i of ca(t, e)) {
        const n = t[i.offset], s = li(n);
        if (s >= We.NON_IDR_SLICE && s <= We.SLICE_DPC)
          return "delta";
        if (s === We.IDR)
          return "key";
        if (s === We.SEI && (!Ki() || zo() >= 144)) {
          const a = t.subarray(i.offset, i.offset + i.length), o = ui(a);
          let c = 1;
          do {
            let l = 0;
            for (; ; ) {
              const f = o[c++];
              if (f === void 0 || (l += f, f < 255))
                break;
            }
            let d = 0;
            for (; ; ) {
              const f = o[c++];
              if (f === void 0 || (d += f, f < 255))
                break;
            }
            if (l === 6) {
              const f = new G(o);
              f.pos = 8 * c;
              const h = F(f), p = f.readBits(1);
              if (h === 0 && p === 1)
                return "key";
            }
            c += d;
          } while (c < o.length - 1);
        }
      }
      return "delta";
    }
    case "hevc": {
      for (const i of Yr(t, e)) {
        const n = er(t[i.offset]);
        if (n < ue.BLA_W_LP)
          return "delta";
        if (n <= ue.RSV_IRAP_VCL23)
          return "key";
      }
      return "delta";
    }
    case "vp8":
      return (t[0] & 1) === 0 ? "key" : "delta";
    case "vp9": {
      const i = new G(t);
      if (i.readBits(2) !== 2)
        return null;
      const n = i.readBits(1);
      return (i.readBits(1) << 1) + n === 3 && i.skipBits(1), i.readBits(1) ? null : i.readBits(1) === 0 ? "key" : "delta";
    }
    case "av1": {
      let i = !1;
      for (const { type: n, data: s } of ha(t))
        if (n === 1) {
          const a = new G(s);
          a.skipBits(4), i = !!a.readBits(1);
        } else if (n === 3 || n === 6 || n === 7) {
          if (i)
            return "key";
          const a = new G(s);
          return a.readBits(1) ? null : a.readBits(2) === 0 ? "key" : "delta";
        }
      return null;
    }
    default:
      rt(r), g(!1);
  }
};
var Yt;
(function(r) {
  r[r.STREAMINFO = 0] = "STREAMINFO", r[r.VORBIS_COMMENT = 4] = "VORBIS_COMMENT", r[r.PICTURE = 6] = "PICTURE";
})(Yt || (Yt = {}));
const Gi = (r, e) => {
  const t = Q(r);
  let i = 0;
  const n = t.getUint32(i, !0);
  i += 4;
  const s = Te.decode(r.subarray(i, i + n));
  i += n, n > 0 && (e.raw ??= {}, e.raw.vendor ??= s);
  const a = t.getUint32(i, !0);
  i += 4;
  for (let o = 0; o < a; o++) {
    const c = t.getUint32(i, !0);
    i += 4;
    const l = Te.decode(r.subarray(i, i + c));
    i += c;
    const d = l.indexOf("=");
    if (d === -1)
      continue;
    const u = l.slice(0, d).toUpperCase(), f = l.slice(d + 1);
    switch (e.raw ??= {}, e.raw[u] ??= f, u) {
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
          const h = Qr(f), p = Q(h), m = p.getUint32(0, !1), b = p.getUint32(4, !1), k = String.fromCharCode(...h.subarray(8, 8 + b)), y = p.getUint32(8 + b, !1), w = Te.decode(h.subarray(12 + b, 12 + b + y)), T = p.getUint32(b + y + 28), A = h.subarray(b + y + 32, b + y + 32 + T);
          e.images ??= [], e.images.push({
            data: A,
            mimeType: k,
            kind: m === 3 ? "coverFront" : m === 4 ? "coverBack" : "unknown",
            name: void 0,
            description: w || void 0
          });
        }
        break;
    }
  }
}, Cn = [2, 1, 2, 3, 3, 4, 4, 5], ga = (r) => {
  if (r.length < 7 || r[0] !== 11 || r[1] !== 119)
    return null;
  const e = new G(r);
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
}, bc = [
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
], wc = 1536, ka = [1, 2, 3, 6], ya = (r) => {
  if (r.length < 6 || r[0] !== 11 || r[1] !== 119)
    return null;
  const e = new G(r);
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
  const d = ka[a];
  let u;
  return n < 3 ? u = ci[n] / 1e3 : u = aa[s] / 1e3, {
    dataRate: Math.round((i + 1) * u / (d * 16)),
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
}, Tc = (r) => {
  if (r.length < 2)
    return null;
  const e = new G(r), t = e.readBits(13), i = e.readBits(3), n = [];
  for (let s = 0; s <= i && !(Math.ceil(e.pos / 8) + 3 > r.length); s++) {
    const a = e.readBits(2), o = e.readBits(5);
    e.skipBits(1), e.skipBits(1);
    const c = e.readBits(3), l = e.readBits(3), d = e.readBits(1);
    e.skipBits(3);
    const u = e.readBits(4);
    let f = 0;
    u > 0 ? f = e.readBits(9) : e.skipBits(1), n.push({
      fscod: a,
      fscod2: null,
      bsid: o,
      bsmod: c,
      acmod: l,
      lfeon: d,
      numDepSub: u,
      chanLoc: f
    });
  }
  return n.length === 0 ? null : { dataRate: t, substreams: n };
}, ba = (r) => {
  const e = r.substreams[0];
  return g(e), e.fscod < 3 ? ci[e.fscod] : e.fscod2 !== null && e.fscod2 < 3 ? aa[e.fscod2] : null;
}, wa = (r) => {
  const e = r.substreams[0];
  g(e);
  let t = Cn[e.acmod] + e.lfeon;
  if (e.numDepSub > 0) {
    const i = [2, 2, 1, 1, 2, 2, 2, 1, 1];
    for (let n = 0; n < 9; n++)
      e.chanLoc & 1 << 8 - n && (t += i[n]);
  }
  return t;
};
class at {
  constructor(e) {
    this.input = e;
  }
  dispose() {
  }
}
const xe = /* @__PURE__ */ new Uint8Array(0);
class Y {
  /** Creates a new {@link EncodedPacket} from raw bytes and timing information. */
  constructor(e, t, i, n, s = -1, a, o) {
    if (this.data = e, this.type = t, this.timestamp = i, this.duration = n, this.sequenceNumber = s, e === xe && a === void 0)
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
    return this.data === xe;
  }
  /** The timestamp of this packet in microseconds. */
  get microsecondTimestamp() {
    return Math.trunc(ht * this.timestamp);
  }
  /** The duration of this packet in microseconds. */
  get microsecondDuration() {
    return Math.trunc(ht * this.duration);
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
const Ta = (r) => {
  let t = (r.hasVideo ? "video/" : r.hasAudio ? "audio/" : "application/") + (r.isQuickTime ? "quicktime" : "mp4");
  if (r.codecStrings.length > 0) {
    const i = [...new Set(r.codecStrings)];
    t += `; codecs="${i.join(", ")}"`;
  }
  return t;
}, Aa = (r) => {
  const e = Q(r);
  let t = 0;
  const i = e.getUint8(t);
  t += 1, t += 3;
  const n = br(r.subarray(t, t + 16));
  t += 16;
  let s = null;
  if (i > 0) {
    const o = e.getUint32(t);
    if (t += 4, o > 0) {
      s = [];
      for (let c = 0; c < o; c++)
        s.push(br(r.subarray(t, t + 16))), t += 16;
    }
  }
  const a = e.getUint32(t);
  return t += 4, {
    systemId: n,
    keyIds: s,
    data: r.slice(t, t + a)
  };
}, Sa = (r, e) => r.systemId === e.systemId && Do(r.data, e.data);
const Ye = 8, Pt = 16, dt = (r) => {
  let e = v(r);
  const t = te(r, 4);
  let i = 8;
  e === 1 && (e = Ie(r), i = 16);
  const s = e - i;
  return s < 0 ? null : { name: t, totalSize: e, headerSize: i, contentSize: s };
}, bt = (r) => It(r) / 65536, Si = (r) => It(r) / 1073741824, xi = (r) => {
  let e = 0;
  for (let t = 0; t < 4; t++) {
    e <<= 7;
    const i = R(r);
    if (e |= i & 127, (i & 128) === 0)
      break;
  }
  return e;
}, ze = (r) => {
  let e = ne(r);
  return r.skip(2), e = Math.min(e, r.remainingLength), Te.decode(z(r, e));
}, Ac = (r) => {
  const e = dt(r);
  if (!e || e.name !== "data" || r.remainingLength < 8)
    return null;
  const t = v(r);
  r.skip(4);
  const i = z(r, e.contentSize - 8);
  switch (t) {
    case 1:
      return Te.decode(i);
    // UTF-8
    case 2:
      return new TextDecoder("utf-16be").decode(i);
    // UTF-16-BE
    case 13:
      return new Xt(i, "image/jpeg");
    case 14:
      return new Xt(i, "image/png");
    case 27:
      return new Xt(i, "image/bmp");
    default:
      return i;
  }
};
const Ne = 16, je = new Uint32Array(256), Ot = new Uint32Array(256), Nt = new Uint32Array(256), Vt = new Uint32Array(256), Ut = new Uint32Array(256), oe = new Uint32Array(256), xa = new Uint32Array(10);
let Pa = !1;
const Sc = () => {
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
    je[s] = a << 24 | a << 16 | a << 8 | a, oe[s] = o << 24 | o << 16 | o << 8 | o;
    const c = i(o, 14), l = i(o, 9), d = i(o, 13), u = i(o, 11), f = c << 24 | l << 16 | d << 8 | u;
    Ot[s] = f, Nt[s] = f >>> 8 | f << 24, Vt[s] = f >>> 16 | f << 16, Ut[s] = f >>> 24 | f << 8;
  }
  let n = 1;
  for (let s = 0; s < 10; s++)
    xa[s] = n << 24, n = n << 1 ^ (n & 128 ? 283 : 0);
  Pa = !0;
};
class Ca {
  constructor() {
    this.roundkey = new Uint32Array(44), this.iv = new Uint32Array(Ne / Uint32Array.BYTES_PER_ELEMENT), this.in = new Uint8Array(Ne), this.out = new Uint8Array(Ne), this.inView = new DataView(this.in.buffer), this.outView = new DataView(this.out.buffer);
  }
  init({ key: e, iv: t }) {
    g(e.byteLength === 16), g(t.byteLength === 16), Pa || Sc();
    const i = new DataView(e.buffer, e.byteOffset, e.byteLength), n = new DataView(t.buffer, t.byteOffset, t.byteLength);
    this.roundkey[0] = i.getUint32(0, !1), this.roundkey[1] = i.getUint32(4, !1), this.roundkey[2] = i.getUint32(8, !1), this.roundkey[3] = i.getUint32(12, !1), this.iv[0] = n.getUint32(0, !1), this.iv[1] = n.getUint32(4, !1), this.iv[2] = n.getUint32(8, !1), this.iv[3] = n.getUint32(12, !1);
    for (let s = 4; s < 44; s += 4) {
      const a = this.roundkey[s - 1];
      this.roundkey[s] = this.roundkey[s - 4] ^ je[a >>> 16 & 255] & 4278190080 ^ je[a >>> 8 & 255] & 16711680 ^ je[a >>> 0 & 255] & 65280 ^ je[a >>> 24 & 255] & 255 ^ xa[s / 4 - 1], this.roundkey[s + 1] = this.roundkey[s - 3] ^ this.roundkey[s], this.roundkey[s + 2] = this.roundkey[s - 2] ^ this.roundkey[s + 1], this.roundkey[s + 3] = this.roundkey[s - 1] ^ this.roundkey[s + 2];
    }
    for (let s = 0, a = 40; s < a; s += 4, a -= 4)
      for (let o = 0; o < 4; o++) {
        const c = this.roundkey[s + o];
        this.roundkey[s + o] = this.roundkey[a + o], this.roundkey[a + o] = c;
      }
    for (let s = 4; s < 40; s += 4)
      for (let a = 0; a < 4; a++) {
        const o = this.roundkey[s + a];
        this.roundkey[s + a] = Ot[je[o >>> 24 & 255] & 255] ^ Nt[je[o >>> 16 & 255] & 255] ^ Vt[je[o >>> 8 & 255] & 255] ^ Ut[je[o >>> 0 & 255] & 255];
      }
  }
  decrypt() {
    let e = this.inView.getUint32(0, !1) ^ this.roundkey[0], t = this.inView.getUint32(4, !1) ^ this.roundkey[1], i = this.inView.getUint32(8, !1) ^ this.roundkey[2], n = this.inView.getUint32(12, !1) ^ this.roundkey[3];
    const s = this.inView.getUint32(0, !1), a = this.inView.getUint32(4, !1), o = this.inView.getUint32(8, !1), c = this.inView.getUint32(12, !1);
    let l, d, u, f;
    for (let k = 1; k < 10; k++) {
      const y = k * 4;
      l = Ot[e >>> 24] ^ Nt[n >>> 16 & 255] ^ Vt[i >>> 8 & 255] ^ Ut[t & 255] ^ this.roundkey[y], d = Ot[t >>> 24] ^ Nt[e >>> 16 & 255] ^ Vt[n >>> 8 & 255] ^ Ut[i & 255] ^ this.roundkey[y + 1], u = Ot[i >>> 24] ^ Nt[t >>> 16 & 255] ^ Vt[e >>> 8 & 255] ^ Ut[n & 255] ^ this.roundkey[y + 2], f = Ot[n >>> 24] ^ Nt[i >>> 16 & 255] ^ Vt[t >>> 8 & 255] ^ Ut[e & 255] ^ this.roundkey[y + 3], e = l, t = d, i = u, n = f;
    }
    const h = oe[e >>> 24 & 255] & 4278190080 ^ oe[n >>> 16 & 255] & 16711680 ^ oe[i >>> 8 & 255] & 65280 ^ oe[t >>> 0 & 255] & 255 ^ this.roundkey[40], p = oe[t >>> 24 & 255] & 4278190080 ^ oe[e >>> 16 & 255] & 16711680 ^ oe[n >>> 8 & 255] & 65280 ^ oe[i >>> 0 & 255] & 255 ^ this.roundkey[41], m = oe[i >>> 24 & 255] & 4278190080 ^ oe[t >>> 16 & 255] & 16711680 ^ oe[e >>> 8 & 255] & 65280 ^ oe[n >>> 0 & 255] & 255 ^ this.roundkey[42], b = oe[n >>> 24 & 255] & 4278190080 ^ oe[i >>> 16 & 255] & 16711680 ^ oe[t >>> 8 & 255] & 65280 ^ oe[e >>> 0 & 255] & 255 ^ this.roundkey[43];
    this.outView.setUint32(0, h ^ this.iv[0], !1), this.outView.setUint32(4, p ^ this.iv[1], !1), this.outView.setUint32(8, m ^ this.iv[2], !1), this.outView.setUint32(12, b ^ this.iv[3], !1), this.iv[0] = s, this.iv[1] = a, this.iv[2] = o, this.iv[3] = c;
  }
}
const xc = (r, e, t) => {
  let i = !1, n = 0;
  const s = 2 ** 16, a = 16, o = new Ca();
  return new ReadableStream({
    pull: async (c) => {
      i || (o.init(await e()), i = !0);
      const l = s + a;
      let d = r.requestSliceRange(n, 0, l);
      if (d instanceof Promise && (d = await d), !d || d.length === 0)
        throw new Error("Invalid ciphertext.");
      const u = d.length;
      if (u % 16 !== 0)
        throw new Error("Invalid ciphertext.");
      const f = u === l ? u - a : u, h = z(d, f), p = new Uint8Array(f);
      for (let m = 0; m < f; m += 16)
        o.in.set(h.subarray(m, m + 16)), o.decrypt(), p.set(o.out, m);
      if (f < u)
        c.enqueue(p), n += f;
      else {
        const m = p[f - 1];
        if (m === 0 || m > 16)
          throw new Error("Invalid PKCS#7 padding. Incorrect key or corrupted data.");
        const b = p.subarray(0, f - m);
        c.enqueue(b), c.close(), t();
      }
    },
    cancel: () => {
      t();
    }
  });
};
class In extends at {
  constructor(e) {
    super(e), this.moovSlice = null, this.currentTrack = null, this.tracks = [], this.metadataPromise = null, this.movieTimescale = -1, this.movieDurationInTimescale = -1, this.isQuickTime = !1, this.metadataTags = {}, this.currentMetadataKeys = null, this.isFragmented = !1, this.fragmentTrackDefaults = [], this.psshBoxes = [], this.currentFragment = null, this.lastReadFragment = null, this.decryptionKeyCache = /* @__PURE__ */ new Map(), this.reader = e._reader;
  }
  async getTrackBackings() {
    return await this.readMetadata(), this.tracks.map((e) => e.trackBacking);
  }
  async getMimeType() {
    await this.readMetadata();
    const e = await this.getTrackBackings(), t = await Promise.all(e.map((i) => i.getDecoderConfig().then((n) => n?.codec ?? null)));
    return Ta({
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
      let e = 0, t = !1;
      for (; ; ) {
        let i = this.reader.requestSliceRange(e, Ye, Pt);
        if (i instanceof Promise && (i = await i), !i)
          break;
        const n = e, s = dt(i);
        if (!s)
          break;
        if (s.name === "ftyp" || s.name === "styp") {
          const a = te(i, 4);
          this.isQuickTime = a === "qt  ";
        } else if (s.name === "moov") {
          let a = this.reader.requestSlice(i.filePos, s.contentSize);
          if (a instanceof Promise && (a = await a), !a)
            break;
          this.moovSlice = a, this.readContiguousBoxes(this.moovSlice);
          for (const o of this.tracks) {
            const c = o.editListPreviousSegmentDurations / this.movieTimescale;
            o.editListOffset -= Math.round(c * o.timescale);
          }
          t = this.isFragmented && this.reader.fileSize !== null && this.reader.fileSize > n + s.totalSize;
          break;
        } else if (s.name === "moof") {
          if (!this.input._initInput)
            throw new Error('"moof" box encountered with no "moov" box present; this file is likely a Segment as described in ISO/IEC 14496-12 Section 8.16. A separate init file that contains a "moov" box is required to read this file, please provide it using InputOptions.initInput.');
          const a = await this.input._initInput._getDemuxer();
          if (a.constructor !== In)
            throw new Error("Init input must match the input's format.");
          await a.readMetadata(), this.movieTimescale = a.movieTimescale, this.movieDurationInTimescale = a.movieDurationInTimescale, this.metadataTags = a.metadataTags, this.isFragmented = !0, this.fragmentTrackDefaults = a.fragmentTrackDefaults, this.psshBoxes = a.psshBoxes;
          for (const o of a.tracks) {
            const c = {
              id: o.id,
              demuxer: this,
              trackBacking: null,
              disposition: o.disposition,
              timescale: o.timescale,
              durationInMediaTimescale: o.durationInMediaTimescale,
              durationInMovieTimescale: o.durationInMovieTimescale,
              rotation: o.rotation,
              internalCodecId: o.internalCodecId,
              name: o.name,
              languageCode: o.languageCode,
              sampleTableByteOffset: null,
              sampleTable: null,
              fragmentLookupTable: [],
              currentFragmentState: null,
              fragmentPositionCache: [],
              editListPreviousSegmentDurations: o.editListPreviousSegmentDurations,
              editListOffset: o.editListOffset,
              encryptionInfo: o.encryptionInfo,
              encryptionAuxInfo: null,
              frmaCodecString: null,
              info: o.info
            };
            if (o.trackBacking) {
              if (g(c.info), c.info.type === "video" && c.info.width !== -1) {
                const l = c;
                c.trackBacking = new ts(l), this.tracks.push(c);
              } else if (c.info.type === "audio" && c.info.numberOfChannels !== -1) {
                const l = c;
                c.trackBacking = new rs(l), this.tracks.push(c);
              }
            }
          }
          t = !1;
          break;
        }
        e = n + s.totalSize;
      }
      if (t) {
        g(this.reader.fileSize !== null);
        let i = this.reader.requestSlice(this.reader.fileSize - 4, 4);
        i instanceof Promise && (i = await i), g(i);
        const n = v(i), s = this.reader.fileSize - n;
        if (s >= 0 && s <= this.reader.fileSize - Pt) {
          let a = this.reader.requestSliceRange(s, Ye, Pt);
          if (a instanceof Promise && (a = await a), a) {
            const o = dt(a);
            if (o && o.name === "mfra") {
              let c = this.reader.requestSlice(a.filePos, o.contentSize);
              c instanceof Promise && (c = await c), c && this.readContiguousBoxes(c);
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
    if (e.sampleTable = t, e.sampleTableByteOffset === null)
      return t;
    g(this.moovSlice);
    const i = this.moovSlice.slice(e.sampleTableByteOffset);
    if (this.currentTrack = e, this.traverseBox(i), this.currentTrack = null, e.info?.type === "audio" && e.info.codec && fe.includes(e.info.codec) && t.sampleCompositionTimeOffsets.length === 0) {
      g(e.info?.type === "audio");
      const s = it(e.info.codec), a = [], o = [];
      for (let c = 0; c < t.sampleToChunk.length; c++) {
        const l = t.sampleToChunk[c], d = t.sampleToChunk[c + 1], u = (d ? d.startChunkIndex : t.chunkOffsets.length) - l.startChunkIndex;
        for (let f = 0; f < u; f++) {
          const h = l.startSampleIndex + f * l.samplesPerChunk, p = h + l.samplesPerChunk, m = K(t.sampleTimingEntries, h, (P) => P.startIndex), b = t.sampleTimingEntries[m], k = K(t.sampleTimingEntries, p, (P) => P.startIndex), y = t.sampleTimingEntries[k], w = b.startDecodeTimestamp + (h - b.startIndex) * b.delta, A = y.startDecodeTimestamp + (p - y.startIndex) * y.delta - w, x = ee(a);
          x && x.delta === A ? x.count++ : a.push({
            startIndex: l.startChunkIndex + f,
            startDecodeTimestamp: w,
            count: 1,
            delta: A
          });
          const I = l.samplesPerChunk * s.sampleSize * e.info.numberOfChannels;
          o.push(I);
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
    let t = this.reader.requestSliceRange(e, Ye, Pt);
    t instanceof Promise && (t = await t), g(t);
    const i = dt(t);
    g(i?.name === "moof");
    let n = this.reader.requestSlice(e, i.totalSize);
    n instanceof Promise && (n = await n), g(n), this.traverseBox(n);
    const s = this.lastReadFragment;
    g(s && s.moofOffset === e);
    for (const [, a] of s.trackData) {
      const o = a.track, { fragmentPositionCache: c } = o;
      if (!a.startTimestampIsFinal) {
        const d = o.fragmentLookupTable.find((u) => u.moofOffset === s.moofOffset);
        if (d)
          Pi(a, d.timestamp);
        else {
          const u = K(c, s.moofOffset - 1, (f) => f.moofOffset);
          if (u !== -1) {
            const f = c[u];
            Pi(a, f.endTimestamp);
          }
        }
        a.startTimestampIsFinal = !0;
      }
      const l = K(c, a.startTimestamp, (d) => d.startTimestamp);
      if ((l === -1 || c[l].moofOffset !== s.moofOffset) && c.splice(l + 1, 0, {
        moofOffset: s.moofOffset,
        startTimestamp: a.startTimestamp,
        endTimestamp: a.endTimestamp
      }), a.encryptionAuxInfo && o.encryptionInfo) {
        const d = await Ea(this.reader, o.encryptionInfo, a.encryptionAuxInfo);
        for (let u = 0; u < Math.min(a.samples.length, d.length); u++) {
          const f = d[u];
          a.samples[u].encryption = f;
        }
      }
    }
    return s;
  }
  readContiguousBoxes(e) {
    const t = e.filePos;
    for (; e.filePos - t <= e.length - Ye && this.traverseBox(e); )
      ;
  }
  // eslint-disable-next-line @stylistic/generator-star-spacing
  *iterateContiguousBoxes(e) {
    const t = e.filePos;
    for (; e.filePos - t <= e.length - Ye; ) {
      const i = e.filePos, n = dt(e);
      if (!n)
        break;
      yield { boxInfo: n, slice: e }, e.filePos = i + n.totalSize;
    }
  }
  traverseBox(e) {
    const t = e.filePos, i = dt(e);
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
          const a = R(e);
          e.skip(3), a === 1 ? (e.skip(16), this.movieTimescale = v(e), this.movieDurationInTimescale = Ie(e)) : (e.skip(8), this.movieTimescale = v(e), this.movieDurationInTimescale = v(e));
        }
        break;
      case "trak":
        {
          const a = {
            id: -1,
            demuxer: this,
            trackBacking: null,
            disposition: {
              ...st,
              primary: !1
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
            editListOffset: 0,
            encryptionInfo: null,
            encryptionAuxInfo: null,
            frmaCodecString: null
          };
          if (this.currentTrack = a, this.readContiguousBoxes(e.slice(n, i.contentSize)), a.id !== -1 && a.timescale !== -1 && a.info !== null) {
            if (a.info.type === "video" && a.info.width !== -1) {
              const o = a;
              a.trackBacking = new ts(o), this.tracks.push(a);
            } else if (a.info.type === "audio" && a.info.numberOfChannels !== -1) {
              const o = a;
              a.trackBacking = new rs(o), this.tracks.push(a);
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
          const o = R(e), l = !!(Qe(e) & 1);
          if (a.disposition.default = l, o === 0)
            e.skip(8), a.id = v(e), e.skip(4), a.durationInMovieTimescale = v(e);
          else if (o === 1)
            e.skip(16), a.id = v(e), e.skip(4), a.durationInMovieTimescale = Ie(e);
          else
            throw new Error(`Incorrect track header version ${o}.`);
          e.skip(16);
          const d = [
            bt(e),
            bt(e),
            Si(e),
            bt(e),
            bt(e),
            Si(e),
            bt(e),
            bt(e),
            Si(e)
          ], u = ii(Bo(Ec(d), 90));
          g(u === 0 || u === 90 || u === 180 || u === 270), a.rotation = u;
        }
        break;
      case "elst":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          const o = R(e);
          e.skip(3);
          let c = !1, l = 0;
          const d = v(e);
          for (let u = 0; u < d; u++) {
            const f = o === 1 ? Ie(e) : v(e), h = o === 1 ? hu(e) : It(e), p = bt(e);
            if (f !== 0) {
              if (c) {
                console.warn("Unsupported edit list: multiple edits are not currently supported. Only using first edit.");
                break;
              }
              if (h === -1) {
                l += f;
                continue;
              }
              if (p !== 1) {
                console.warn("Unsupported edit list entry: media rate must be 1.");
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
          const o = R(e);
          e.skip(3), o === 0 ? (e.skip(8), a.timescale = v(e), a.durationInMediaTimescale = v(e)) : o === 1 && (e.skip(16), a.timescale = v(e), a.durationInMediaTimescale = Ie(e));
          let c = ne(e);
          if (c > 0) {
            a.languageCode = "";
            for (let l = 0; l < 3; l++)
              a.languageCode = String.fromCharCode(96 + (c & 31)) + a.languageCode, c >>= 5;
            Tr(a.languageCode) || (a.languageCode = de);
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
            squarePixelWidth: -1,
            squarePixelHeight: -1,
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
            aacCodecInfo: null,
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
          const o = R(e);
          e.skip(3);
          const c = v(e);
          for (let l = 0; l < c; l++) {
            const d = e.filePos, u = dt(e);
            if (!u)
              break;
            a.internalCodecId = u.name;
            const f = u.name.toLowerCase();
            if (a.info.type === "video") {
              e.skip(24), a.info.width = ne(e), a.info.height = ne(e), a.info.squarePixelWidth = a.info.width, a.info.squarePixelHeight = a.info.height, e.skip(50), a.frmaCodecString = null, this.readContiguousBoxes(e.slice(e.filePos, d + u.totalSize - e.filePos));
              const h = f === "encv" ? a.frmaCodecString : f;
              a.frmaCodecString = null, h === "avc1" || h === "avc3" ? (a.info.codec = "avc", a.info.avcType = h === "avc1" ? 1 : 3) : h === "hvc1" || h === "hev1" ? a.info.codec = "hevc" : h === "vp08" ? a.info.codec = "vp8" : h === "vp09" ? a.info.codec = "vp9" : h === "av01" ? a.info.codec = "av1" : console.warn(h === null ? "Unknown encrypted video codec due to missing frma box." : `Unsupported video codec (sample entry type '${u.name}').`);
            } else {
              e.skip(8);
              const h = ne(e);
              e.skip(6);
              let p = ne(e), m = ne(e);
              e.skip(4);
              let b = v(e) / 65536, k = null;
              o === 0 && h > 0 && (h === 1 ? (e.skip(4), m = 8 * v(e), e.skip(8)) : h === 2 && (e.skip(4), b = oo(e), p = v(e), e.skip(4), m = v(e), k = v(e), e.skip(8))), a.info.numberOfChannels = p, a.info.sampleRate = b, a.frmaCodecString = null, this.readContiguousBoxes(e.slice(e.filePos, d + u.totalSize - e.filePos));
              const y = f === "enca" ? a.frmaCodecString : f;
              if (a.frmaCodecString = null, y !== "mp4a") if (y === "opus")
                a.info.codec = "opus", a.info.sampleRate = oi;
              else if (y === "flac")
                a.info.codec = "flac";
              else if (y === "ulaw")
                a.info.codec = "ulaw";
              else if (y === "alaw")
                a.info.codec = "alaw";
              else if (y === "ac-3")
                a.info.codec = "ac3";
              else if (y === "ec-3")
                a.info.codec = "eac3";
              else if (y === "twos")
                m === 8 ? a.info.codec = "pcm-s8" : m === 16 ? a.info.codec = a.info.pcmLittleEndian ? "pcm-s16" : "pcm-s16be" : (console.warn(`Unsupported sample size ${m} for codec 'twos'.`), a.info.codec = null);
              else if (y === "sowt")
                m === 8 ? a.info.codec = "pcm-s8" : m === 16 ? a.info.codec = "pcm-s16" : (console.warn(`Unsupported sample size ${m} for codec 'sowt'.`), a.info.codec = null);
              else if (y === "raw ")
                a.info.codec = "pcm-u8";
              else if (y === "in24")
                a.info.codec = a.info.pcmLittleEndian ? "pcm-s24" : "pcm-s24be";
              else if (y === "in32")
                a.info.codec = a.info.pcmLittleEndian ? "pcm-s32" : "pcm-s32be";
              else if (y === "fl32")
                a.info.codec = a.info.pcmLittleEndian ? "pcm-f32" : "pcm-f32be";
              else if (y === "fl64")
                a.info.codec = a.info.pcmLittleEndian ? "pcm-f64" : "pcm-f64be";
              else if (y === "ipcm") {
                const w = a.info.pcmSampleSize;
                a.info.pcmLittleEndian ? w === 16 ? a.info.codec = "pcm-s16" : w === 24 ? a.info.codec = "pcm-s24" : w === 32 ? a.info.codec = "pcm-s32" : (console.warn(`Invalid ipcm sample size ${w}.`), a.info.codec = null) : w === 16 ? a.info.codec = "pcm-s16be" : w === 24 ? a.info.codec = "pcm-s24be" : w === 32 ? a.info.codec = "pcm-s32be" : (console.warn(`Invalid ipcm sample size ${w}.`), a.info.codec = null);
              } else if (y === "fpcm") {
                const w = a.info.pcmSampleSize;
                a.info.pcmLittleEndian ? w === 32 ? a.info.codec = "pcm-f32" : w === 64 ? a.info.codec = "pcm-f64" : (console.warn(`Invalid fpcm sample size ${w}.`), a.info.codec = null) : w === 32 ? a.info.codec = "pcm-f32be" : w === 64 ? a.info.codec = "pcm-f64be" : (console.warn(`Invalid fpcm sample size ${w}.`), a.info.codec = null);
              } else if (y === "lpcm" && k !== null) {
                const w = m + 7 >> 3, T = !!(k & 1), A = !!(k & 2), x = k & 4 ? -1 : 0;
                m > 0 && m <= 64 && (T ? m === 32 && (a.info.codec = A ? "pcm-f32be" : "pcm-f32") : x & 1 << w - 1 ? w === 1 ? a.info.codec = "pcm-s8" : w === 2 ? a.info.codec = A ? "pcm-s16be" : "pcm-s16" : w === 3 ? a.info.codec = A ? "pcm-s24be" : "pcm-s24" : w === 4 && (a.info.codec = A ? "pcm-s32be" : "pcm-s32") : w === 1 && (a.info.codec = "pcm-u8")), a.info.codec === null && console.warn("Unsupported PCM format.");
              } else console.warn(y === null ? "Unknown encrypted audio codec due to missing frma box." : `Unsupported audio codec (sample entry type '${u.name}').`);
            }
            e.filePos = d + u.totalSize;
          }
        }
        break;
      case "frma":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          const c = te(e, 4).toLowerCase();
          a.frmaCodecString = c;
        }
        break;
      case "schm":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          e.skip(4);
          const o = te(e, 4);
          o === "cenc" || o === "cens" || o === "cbcs" ? a.encryptionInfo = {
            scheme: o,
            defaultKid: null,
            defaultIsProtected: null,
            defaultPerSampleIvSize: null,
            defaultConstantIv: null,
            defaultCryptByteBlock: null,
            defaultSkipByteBlock: null
          } : console.warn(`Unsupported encryption scheme '${o}'.`);
        }
        break;
      case "tenc":
        {
          const a = this.currentTrack;
          if (!a || !a.encryptionInfo)
            break;
          const o = R(e);
          e.skip(3), e.skip(1);
          const c = R(e);
          if (o > 0 ? (a.encryptionInfo.defaultCryptByteBlock = c >> 4, a.encryptionInfo.defaultSkipByteBlock = c & 15) : (a.encryptionInfo.defaultCryptByteBlock = 0, a.encryptionInfo.defaultSkipByteBlock = 0), a.encryptionInfo.defaultIsProtected = R(e) !== 0, a.encryptionInfo.defaultPerSampleIvSize = R(e), a.encryptionInfo.defaultKid = br(z(e, 16)), a.encryptionInfo.defaultIsProtected && a.encryptionInfo.defaultPerSampleIvSize === 0) {
            const l = R(e), d = new Uint8Array(16);
            d.set(z(e, l), 0), a.encryptionInfo.defaultConstantIv = d;
          }
        }
        break;
      case "avcC":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          g(a.info), a.info.codecDescription = z(e, i.contentSize);
        }
        break;
      case "hvcC":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          g(a.info), a.info.codecDescription = z(e, i.contentSize);
        }
        break;
      case "vpcC":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          g(a.info?.type === "video"), e.skip(4);
          const o = R(e), c = R(e), l = R(e), d = l >> 4, u = l >> 1 & 7, f = l & 1, h = R(e), p = R(e), m = R(e);
          a.info.vp9CodecInfo = {
            profile: o,
            level: c,
            bitDepth: d,
            chromaSubsampling: u,
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
          const o = R(e), c = o >> 5, l = o & 31, d = R(e), u = d >> 7, f = d >> 6 & 1, h = d >> 5 & 1, p = d >> 4 & 1, m = d >> 3 & 1, b = d >> 2 & 1, k = d & 3, y = c === 2 && f ? h ? 12 : 10 : f ? 10 : 8;
          a.info.av1CodecInfo = {
            profile: c,
            level: l,
            tier: u,
            bitDepth: y,
            monochrome: p,
            chromaSubsamplingX: m,
            chromaSubsamplingY: b,
            chromaSamplePosition: k
          };
        }
        break;
      case "colr":
        {
          const a = this.currentTrack;
          if (!a || (g(a.info?.type === "video"), te(e, 4) !== "nclx"))
            break;
          const c = ne(e), l = ne(e), d = ne(e), u = !!(R(e) & 128);
          a.info.colorSpace = {
            primaries: Hr[c],
            transfer: qr[l],
            matrix: Kr[d],
            fullRange: u
          };
        }
        break;
      case "pasp":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          g(a.info?.type === "video");
          const o = v(e), c = v(e);
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
          const o = R(e);
          g(o === 3), xi(e), e.skip(2);
          const c = R(e), l = (c & 128) !== 0, d = (c & 64) !== 0, u = (c & 32) !== 0;
          if (l && e.skip(2), d) {
            const b = R(e);
            e.skip(b);
          }
          u && e.skip(2);
          const f = R(e);
          g(f === 4);
          const h = xi(e), p = e.filePos, m = R(e);
          if (m === 64 || m === 103 ? (a.info.codec = "aac", a.info.aacCodecInfo = {
            isMpeg2: m === 103,
            objectType: null
          }) : m === 105 || m === 107 ? a.info.codec = "mp3" : m === 221 ? a.info.codec = "vorbis" : console.warn(`Unsupported audio codec (objectTypeIndication ${m}) - discarding track.`), e.skip(12), h > e.filePos - p) {
            const b = R(e);
            g(b === 5);
            const k = xi(e);
            if (a.info.codecDescription = z(e, k), a.info.codec === "aac") {
              const y = kn(a.info.codecDescription);
              y.numberOfChannels !== null && (a.info.numberOfChannels = y.numberOfChannels), y.sampleRate !== null && (a.info.sampleRate = y.sampleRate);
            }
          }
        }
        break;
      case "enda":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          g(a.info?.type === "audio"), a.info.pcmLittleEndian = !!(ne(e) & 255);
        }
        break;
      case "pcmC":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          g(a.info?.type === "audio"), e.skip(4);
          const o = R(e);
          a.info.pcmLittleEndian = !!(o & 1), a.info.pcmSampleSize = R(e);
        }
        break;
      case "dOps":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          g(a.info?.type === "audio"), e.skip(1);
          const o = R(e), c = ne(e), l = v(e), d = cn(e), u = R(e);
          let f;
          u !== 0 ? f = z(e, 2 + o) : f = new Uint8Array(0);
          const h = new Uint8Array(19 + f.byteLength), p = new DataView(h.buffer);
          p.setUint32(0, 1332770163, !1), p.setUint32(4, 1214603620, !1), p.setUint8(8, 1), p.setUint8(9, o), p.setUint16(10, c, !0), p.setUint32(12, l, !0), p.setInt16(16, d, !0), p.setUint8(18, u), h.set(f, 19), a.info.codecDescription = h, a.info.numberOfChannels = o;
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
            const p = R(e), m = Qe(e);
            if ((p & o) === Yt.STREAMINFO) {
              e.skip(10);
              const k = v(e), y = k >>> 12, w = (k >> 9 & 7) + 1;
              a.info.sampleRate = y, a.info.numberOfChannels = w, e.skip(20);
            } else
              e.skip(m);
            if (p & c)
              break;
          }
          const d = e.filePos;
          e.filePos = l;
          const u = z(e, d - l), f = new Uint8Array(4 + u.byteLength);
          new DataView(f.buffer).setUint32(0, 1716281667, !1), f.set(u, 4), a.info.codecDescription = f;
        }
        break;
      case "dac3":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          g(a.info?.type === "audio");
          const o = z(e, 3), c = new G(o), l = c.readBits(2);
          c.skipBits(8);
          const d = c.readBits(3), u = c.readBits(1);
          l < 3 && (a.info.sampleRate = ci[l]), a.info.numberOfChannels = Cn[d] + u;
        }
        break;
      case "dec3":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          g(a.info?.type === "audio");
          const o = z(e, i.contentSize), c = Tc(o);
          if (!c) {
            console.warn("Invalid dec3 box contents, ignoring.");
            break;
          }
          const l = ba(c);
          l !== null && (a.info.sampleRate = l), a.info.numberOfChannels = wa(c);
        }
        break;
      case "stts":
        {
          const a = this.currentTrack;
          if (!a || !a.sampleTable)
            break;
          e.skip(4);
          const o = v(e);
          let c = 0, l = 0;
          for (let d = 0; d < o; d++) {
            const u = v(e), f = v(e);
            a.sampleTable.sampleTimingEntries.push({
              startIndex: c,
              startDecodeTimestamp: l,
              count: u,
              delta: f
            }), c += u, l += u * f;
          }
        }
        break;
      case "ctts":
        {
          const a = this.currentTrack;
          if (!a || !a.sampleTable)
            break;
          e.skip(4);
          const o = v(e);
          let c = 0;
          for (let l = 0; l < o; l++) {
            const d = v(e), u = It(e);
            a.sampleTable.sampleCompositionTimeOffsets.push({
              startIndex: c,
              count: d,
              offset: u
            }), c += d;
          }
        }
        break;
      case "stsz":
        {
          const a = this.currentTrack;
          if (!a || !a.sampleTable)
            break;
          e.skip(4);
          const o = v(e), c = v(e);
          if (o === 0)
            for (let l = 0; l < c; l++) {
              const d = v(e);
              a.sampleTable.sampleSizes.push(d);
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
          const o = R(e), c = v(e), l = z(e, Math.ceil(c * o / 8)), d = new G(l);
          for (let u = 0; u < c; u++) {
            const f = d.readBits(o);
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
          const o = v(e);
          for (let c = 0; c < o; c++) {
            const l = v(e) - 1;
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
          const o = v(e);
          for (let l = 0; l < o; l++) {
            const d = v(e) - 1, u = v(e), f = v(e);
            a.sampleTable.sampleToChunk.push({
              startSampleIndex: -1,
              startChunkIndex: d,
              samplesPerChunk: u,
              sampleDescriptionIndex: f
            });
          }
          let c = 0;
          for (let l = 0; l < a.sampleTable.sampleToChunk.length; l++)
            if (a.sampleTable.sampleToChunk[l].startSampleIndex = c, l < a.sampleTable.sampleToChunk.length - 1) {
              const u = a.sampleTable.sampleToChunk[l + 1].startChunkIndex - a.sampleTable.sampleToChunk[l].startChunkIndex;
              c += u * a.sampleTable.sampleToChunk[l].samplesPerChunk;
            }
        }
        break;
      case "stco":
        {
          const a = this.currentTrack;
          if (!a || !a.sampleTable)
            break;
          e.skip(4);
          const o = v(e);
          for (let c = 0; c < o; c++) {
            const l = v(e);
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
          const o = v(e);
          for (let c = 0; c < o; c++) {
            const l = Ie(e);
            a.sampleTable.chunkOffsets.push(l);
          }
        }
        break;
      case "mvex":
        this.isFragmented = !0, this.readContiguousBoxes(e.slice(n, i.contentSize));
        break;
      case "mehd":
        {
          const a = R(e);
          e.skip(3);
          const o = a === 1 ? Ie(e) : v(e);
          this.movieDurationInTimescale = o;
        }
        break;
      case "trex":
        {
          e.skip(4);
          const a = v(e), o = v(e), c = v(e), l = v(e), d = v(e);
          this.fragmentTrackDefaults.push({
            trackId: a,
            defaultSampleDescriptionIndex: o,
            defaultSampleDuration: c,
            defaultSampleSize: l,
            defaultSampleFlags: d
          });
        }
        break;
      case "tfra":
        {
          const a = R(e);
          e.skip(3);
          const o = v(e), c = this.tracks.find((y) => y.id === o);
          if (!c)
            break;
          const l = v(e), d = (l & 48) >> 4, u = (l & 12) >> 2, f = l & 3, h = [R, ne, Qe, v], p = h[d], m = h[u], b = h[f], k = v(e);
          for (let y = 0; y < k; y++) {
            const w = a === 1 ? Ie(e) : v(e), T = a === 1 ? Ie(e) : v(e);
            p(e), m(e), b(e), c.fragmentLookupTable.push({
              timestamp: w,
              moofOffset: T
            });
          }
          c.fragmentLookupTable.sort((y, w) => y.timestamp - w.timestamp);
          for (let y = 0; y < c.fragmentLookupTable.length - 1; y++) {
            const w = c.fragmentLookupTable[y], T = c.fragmentLookupTable[y + 1];
            w.timestamp === T.timestamp && (c.fragmentLookupTable.splice(y + 1, 1), y--);
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
          if (a) {
            this.currentFragment.implicitBaseDataOffset = a.currentOffset, a.presentationTimestamps = a.samples.map((d, u) => ({ presentationTimestamp: d.presentationTimestamp, sampleIndex: u })).sort((d, u) => d.presentationTimestamp - u.presentationTimestamp);
            for (let d = 0; d < a.presentationTimestamps.length; d++) {
              const u = a.presentationTimestamps[d], f = a.samples[u.sampleIndex];
              if (a.firstKeyFrameTimestamp === null && f.isKeyFrame && (a.firstKeyFrameTimestamp = f.presentationTimestamp), d < a.presentationTimestamps.length - 1) {
                const p = a.presentationTimestamps[d + 1].presentationTimestamp - u.presentationTimestamp;
                f.duration = p;
              }
            }
            const o = a.samples[a.presentationTimestamps[0].sampleIndex], c = a.samples[ee(a.presentationTimestamps).sampleIndex];
            a.startTimestamp = o.presentationTimestamp, a.endTimestamp = c.presentationTimestamp + c.duration;
            const { currentFragmentState: l } = this.currentTrack;
            g(l), l.startTimestamp !== null && (Pi(a, l.startTimestamp), a.startTimestampIsFinal = !0), l.encryptionAuxInfo && !a.samples[0].encryption && (a.encryptionAuxInfo = l.encryptionAuxInfo);
          }
          this.currentTrack.currentFragmentState = null, this.currentTrack = null;
        }
        break;
      case "pssh":
        {
          if (this.input._formatOptions.isobmff?._suppressPsshParsing)
            break;
          const a = Aa(z(e, i.contentSize));
          this.currentFragment ? this.currentFragment.psshBoxes.push(a) : this.currentTrack || this.psshBoxes.push(a);
        }
        break;
      case "tfhd":
        {
          g(this.currentFragment), e.skip(1);
          const a = Qe(e), o = !!(a & 1), c = !!(a & 2), l = !!(a & 8), d = !!(a & 16), u = !!(a & 32), f = !!(a & 65536), h = !!(a & 131072), p = v(e), m = this.tracks.find((k) => k.id === p);
          if (!m)
            break;
          const b = this.fragmentTrackDefaults.find((k) => k.trackId === p);
          this.currentTrack = m, m.currentFragmentState = {
            baseDataOffset: this.currentFragment.implicitBaseDataOffset,
            sampleDescriptionIndex: b?.defaultSampleDescriptionIndex ?? null,
            defaultSampleDuration: b?.defaultSampleDuration ?? null,
            defaultSampleSize: b?.defaultSampleSize ?? null,
            defaultSampleFlags: b?.defaultSampleFlags ?? null,
            startTimestamp: null,
            encryptionAuxInfo: null
          }, o ? m.currentFragmentState.baseDataOffset = Ie(e) : h && (m.currentFragmentState.baseDataOffset = this.currentFragment.moofOffset), c && (m.currentFragmentState.sampleDescriptionIndex = v(e)), l && (m.currentFragmentState.defaultSampleDuration = v(e)), d && (m.currentFragmentState.defaultSampleSize = v(e)), u && (m.currentFragmentState.defaultSampleFlags = v(e)), f && (m.currentFragmentState.defaultSampleDuration = 0);
        }
        break;
      case "tfdt":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          g(a.currentFragmentState);
          const o = R(e);
          e.skip(3);
          const c = o === 0 ? v(e) : Ie(e);
          a.currentFragmentState.startTimestamp = c;
        }
        break;
      case "trun":
        {
          const a = this.currentTrack;
          if (!a)
            break;
          g(this.currentFragment), g(a.currentFragmentState);
          const o = R(e), c = Qe(e), l = !!(c & 1), d = !!(c & 4), u = !!(c & 256), f = !!(c & 512), h = !!(c & 1024), p = !!(c & 2048), m = v(e);
          let b = null;
          l && (b = It(e));
          let k = null;
          d && (k = v(e));
          let y;
          if (this.currentFragment.trackData.has(a.id) ? (y = this.currentFragment.trackData.get(a.id), b !== null && (y.currentOffset = a.currentFragmentState.baseDataOffset + b)) : (y = {
            track: a,
            currentTimestamp: 0,
            currentOffset: a.currentFragmentState.baseDataOffset + (b ?? 0),
            startTimestamp: 0,
            endTimestamp: 0,
            firstKeyFrameTimestamp: null,
            samples: [],
            presentationTimestamps: [],
            startTimestampIsFinal: !1,
            encryptionAuxInfo: null
          }, this.currentFragment.trackData.set(a.id, y)), m === 0) {
            this.currentFragment.implicitBaseDataOffset = y.currentOffset;
            break;
          }
          for (let w = 0; w < m; w++) {
            let T;
            u ? T = v(e) : (g(a.currentFragmentState.defaultSampleDuration !== null), T = a.currentFragmentState.defaultSampleDuration);
            let A;
            f ? A = v(e) : (g(a.currentFragmentState.defaultSampleSize !== null), A = a.currentFragmentState.defaultSampleSize);
            let x;
            h ? x = v(e) : (g(a.currentFragmentState.defaultSampleFlags !== null), x = a.currentFragmentState.defaultSampleFlags), w === 0 && k !== null && (x = k);
            let I = 0;
            p && (o === 0 ? I = v(e) : I = It(e));
            const P = !(x & 65536);
            y.samples.push({
              presentationTimestamp: y.currentTimestamp + I,
              duration: T,
              byteOffset: y.currentOffset,
              byteSize: A,
              isKeyFrame: P,
              encryption: null
            }), y.currentOffset += A, y.currentTimestamp += T;
          }
        }
        break;
      case "saiz":
        {
          const a = this.currentTrack;
          if (!a || !a.encryptionInfo)
            break;
          if (e.skip(1), Qe(e) & 1) {
            const f = te(e, 4), h = v(e);
            if (f !== a.encryptionInfo.scheme || h !== 0)
              break;
          }
          const c = R(e), l = v(e);
          let d = null;
          c === 0 && l > 0 && (d = z(e, l));
          const u = ns(a);
          u.defaultSampleInfoSize = c, u.sampleSizes = d, u.sampleCount = l;
        }
        break;
      case "saio":
        {
          const a = this.currentTrack;
          if (!a || !a.encryptionInfo)
            break;
          const o = R(e);
          if (Qe(e) & 1) {
            const f = te(e, 4), h = v(e);
            if (f !== a.encryptionInfo.scheme || h !== 0)
              break;
          }
          const l = v(e);
          if (l === 0)
            break;
          l > 1 && console.warn("Multiple saio entries are not supported; using the first offset only.");
          let d = o === 0 ? v(e) : Number(Ie(e));
          this.currentFragment && (d += this.currentFragment.moofOffset);
          const u = ns(a);
          u.offset = d;
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
          const l = !!(Qe(e) & 2), d = v(e), u = a.encryptionInfo.defaultPerSampleIvSize;
          g(u !== null);
          for (let f = 0; f < Math.min(d, o.samples.length); f++) {
            const h = new Uint8Array(16);
            u > 0 ? h.set(z(e, u), 0) : h.set(a.encryptionInfo.defaultConstantIv, 0);
            let p = null;
            if (l) {
              const b = ne(e);
              p = [];
              for (let k = 0; k < b; k++) {
                const y = ne(e), w = v(e);
                p.push({ clearLen: y, protectedLen: w });
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
              this.metadataTags.raw ??= {}, o.name[0] === "©" ? this.metadataTags.raw[o.name] ??= ze(c) : this.metadataTags.raw[o.name] ??= z(c, o.contentSize), c.filePos = l;
            }
            switch (o.name) {
              case "meta":
                c.skip(-o.headerSize), this.traverseBox(c);
                break;
              case "©nam":
              case "name":
                this.currentTrack ? this.currentTrack.name = Te.decode(z(c, o.contentSize)) : this.metadataTags.title ??= ze(c);
                break;
              case "©des":
                this.currentTrack || (this.metadataTags.description ??= ze(c));
                break;
              case "©ART":
                this.currentTrack || (this.metadataTags.artist ??= ze(c));
                break;
              case "©alb":
                this.currentTrack || (this.metadataTags.album ??= ze(c));
                break;
              case "albr":
                this.currentTrack || (this.metadataTags.albumArtist ??= ze(c));
                break;
              case "©gen":
                this.currentTrack || (this.metadataTags.genre ??= ze(c));
                break;
              case "©day":
                if (!this.currentTrack) {
                  const l = new Date(ze(c));
                  Number.isNaN(l.getTime()) || (this.metadataTags.date ??= l);
                }
                break;
              case "©cmt":
                this.currentTrack || (this.metadataTags.comment ??= ze(c));
                break;
              case "©lyr":
                this.currentTrack || (this.metadataTags.lyrics ??= ze(c));
                break;
            }
          }
        }
        break;
      case "meta":
        {
          if (this.currentTrack)
            break;
          const o = v(e) !== 0;
          this.currentMetadataKeys = /* @__PURE__ */ new Map(), o ? this.readContiguousBoxes(e.slice(n, i.contentSize)) : this.readContiguousBoxes(e.slice(n + 4, i.contentSize - 4)), this.currentMetadataKeys = null;
        }
        break;
      case "keys":
        {
          if (!this.currentMetadataKeys)
            break;
          e.skip(4);
          const a = v(e);
          for (let o = 0; o < a; o++) {
            const c = v(e);
            e.skip(4);
            const l = Te.decode(z(e, c - 8));
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
            const d = (l.charCodeAt(0) << 24) + (l.charCodeAt(1) << 16) + (l.charCodeAt(2) << 8) + l.charCodeAt(3);
            this.currentMetadataKeys.has(d) && (l = this.currentMetadataKeys.get(d));
            const u = Ac(c);
            switch (this.metadataTags.raw ??= {}, this.metadataTags.raw[l] ??= u, l) {
              case "©nam":
              case "titl":
              case "com.apple.quicktime.title":
              case "title":
                typeof u == "string" && (this.metadataTags.title ??= u);
                break;
              case "©des":
              case "desc":
              case "dscp":
              case "com.apple.quicktime.description":
              case "description":
                typeof u == "string" && (this.metadataTags.description ??= u);
                break;
              case "©ART":
              case "com.apple.quicktime.artist":
              case "artist":
                typeof u == "string" && (this.metadataTags.artist ??= u);
                break;
              case "©alb":
              case "albm":
              case "com.apple.quicktime.album":
              case "album":
                typeof u == "string" && (this.metadataTags.album ??= u);
                break;
              case "aART":
              case "album_artist":
                typeof u == "string" && (this.metadataTags.albumArtist ??= u);
                break;
              case "©cmt":
              case "com.apple.quicktime.comment":
              case "comment":
                typeof u == "string" && (this.metadataTags.comment ??= u);
                break;
              case "©gen":
              case "gnre":
              case "com.apple.quicktime.genre":
              case "genre":
                typeof u == "string" && (this.metadataTags.genre ??= u);
                break;
              case "©lyr":
              case "lyrics":
                typeof u == "string" && (this.metadataTags.lyrics ??= u);
                break;
              case "©day":
              case "rldt":
              case "com.apple.quicktime.creationdate":
              case "date":
                if (typeof u == "string") {
                  const f = new Date(u);
                  Number.isNaN(f.getTime()) || (this.metadataTags.date ??= f);
                }
                break;
              case "covr":
              case "com.apple.quicktime.artwork":
                u instanceof Xt ? (this.metadataTags.images ??= [], this.metadataTags.images.push({
                  data: u.data,
                  kind: "coverFront",
                  mimeType: u.mimeType
                })) : u instanceof Uint8Array && (this.metadataTags.images ??= [], this.metadataTags.images.push({
                  data: u,
                  kind: "coverFront",
                  mimeType: "image/*"
                }));
                break;
              case "track":
                if (typeof u == "string") {
                  const f = u.split("/"), h = Number.parseInt(f[0], 10), p = f[1] && Number.parseInt(f[1], 10);
                  Number.isInteger(h) && h > 0 && (this.metadataTags.trackNumber ??= h), p && Number.isInteger(p) && p > 0 && (this.metadataTags.tracksTotal ??= p);
                }
                break;
              case "trkn":
                if (u instanceof Uint8Array && u.length >= 6) {
                  const f = Q(u), h = f.getUint16(2, !1), p = f.getUint16(4, !1);
                  h > 0 && (this.metadataTags.trackNumber ??= h), p > 0 && (this.metadataTags.tracksTotal ??= p);
                }
                break;
              case "disc":
              case "disk":
                if (u instanceof Uint8Array && u.length >= 6) {
                  const f = Q(u), h = f.getUint16(2, !1), p = f.getUint16(4, !1);
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
class Ia {
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
    return wr(e * this.internalTrack.timescale) + this.internalTrack.editListOffset;
  }
  async getPacket(e, t) {
    const i = this.mapTimestampIntoTimescale(e), n = this.internalTrack.demuxer.getSampleTableForTrack(this.internalTrack), s = Xi(n, i), a = await this.fetchPacketForSampleIndex(s, t);
    return !is(n) || !this.internalTrack.demuxer.isFragmented ? a : this.performFragmentedLookup(null, (o) => {
      const c = o.trackData.get(this.internalTrack.id);
      if (!c)
        return { sampleIndex: -1, correctSampleFound: !1 };
      const l = K(c.presentationTimestamps, i, (f) => f.presentationTimestamp), d = l !== -1 ? c.presentationTimestamps[l].sampleIndex : -1, u = l !== -1 && i < c.endTimestamp;
      return { sampleIndex: d, correctSampleFound: u };
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
    const i = this.mapTimestampIntoTimescale(e), n = this.internalTrack.demuxer.getSampleTableForTrack(this.internalTrack), s = Pc(n, i), a = await this.fetchPacketForSampleIndex(s, t);
    return !is(n) || !this.internalTrack.demuxer.isFragmented ? a : this.performFragmentedLookup(null, (o) => {
      const c = o.trackData.get(this.internalTrack.id);
      if (!c)
        return { sampleIndex: -1, correctSampleFound: !1 };
      const l = hn(c.presentationTimestamps, (f) => c.samples[f.sampleIndex].isKeyFrame && f.presentationTimestamp <= i), d = l !== -1 ? c.presentationTimestamps[l].sampleIndex : -1, u = l !== -1 && i < c.endTimestamp;
      return { sampleIndex: d, correctSampleFound: u };
    }, i, i, t);
  }
  async getNextKeyPacket(e, t) {
    const i = this.packetToSampleIndex.get(e);
    if (i !== void 0) {
      const s = this.internalTrack.demuxer.getSampleTableForTrack(this.internalTrack), a = Ic(s, i);
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
    const i = this.internalTrack.demuxer.getSampleTableForTrack(this.internalTrack), n = Cc(i, e);
    if (!n)
      return null;
    let s;
    if (t.metadataOnly)
      s = xe;
    else {
      let l = this.internalTrack.demuxer.reader.requestSlice(n.sampleOffset, n.sampleSize);
      if (l instanceof Promise && (l = await l), !l)
        return null;
      if (s = z(l, n.sampleSize), this.internalTrack.encryptionAuxInfo) {
        g(this.internalTrack.encryptionInfo);
        const d = await Ea(this.internalTrack.demuxer.reader, this.internalTrack.encryptionInfo, this.internalTrack.encryptionAuxInfo);
        e < d.length && (s = await ss(this.internalTrack, d[e], s, null));
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
      a = xe;
    else {
      let d = this.internalTrack.demuxer.reader.requestSlice(s.byteOffset, s.byteSize);
      if (d instanceof Promise && (d = await d), !d)
        return null;
      a = z(d, s.byteSize), s.encryption && (a = await ss(this.internalTrack, s.encryption, a, e));
    }
    const o = (s.presentationTimestamp - this.internalTrack.editListOffset) / this.internalTrack.timescale, c = s.duration / this.internalTrack.timescale, l = new Y(a, s.isKeyFrame ? "key" : "delta", o, c, e.moofOffset + t, s.byteSize);
    return this.packetToFragmentLocation.set(l, { fragment: e, sampleIndex: t }), l;
  }
  /** Looks for a packet in the fragments while trying to load as few fragments as possible to retrieve it. */
  async performFragmentedLookup(e, t, i, n, s) {
    const a = this.internalTrack.demuxer;
    let o = null, c = null, l = -1;
    if (e) {
      const { sampleIndex: b, correctSampleFound: k } = t(e);
      if (k)
        return this.fetchPacketInFragment(e, b, s);
      b !== -1 && (c = e, l = b);
    }
    const d = K(this.internalTrack.fragmentLookupTable, i, (b) => b.timestamp), u = d !== -1 ? this.internalTrack.fragmentLookupTable[d] : null, f = K(this.internalTrack.fragmentPositionCache, i, (b) => b.startTimestamp), h = f !== -1 ? this.internalTrack.fragmentPositionCache[f] : null, p = Math.max(u?.moofOffset ?? 0, h?.moofOffset ?? 0) || null;
    let m;
    for (e ? p === null || e.moofOffset >= p ? (m = e.moofOffset + e.moofSize, o = e) : m = p : m = p ?? 0; ; ) {
      if (o) {
        const w = o.trackData.get(this.internalTrack.id);
        if (w && w.startTimestamp > n)
          break;
      }
      let b = a.reader.requestSliceRange(m, Ye, Pt);
      if (b instanceof Promise && (b = await b), !b)
        break;
      const k = m, y = dt(b);
      if (!y)
        break;
      if (y.name === "moof") {
        o = await a.readFragment(k);
        const { sampleIndex: w, correctSampleFound: T } = t(o);
        if (T)
          return this.fetchPacketInFragment(o, w, s);
        w !== -1 && (c = o, l = w);
      }
      m = k + y.totalSize;
    }
    if (u && (!c || c.moofOffset < u.moofOffset)) {
      const b = this.internalTrack.fragmentLookupTable[d - 1];
      g(!b || b.timestamp < u.timestamp);
      const k = b?.timestamp ?? -1 / 0;
      return this.performFragmentedLookup(null, t, k, n, s);
    }
    return c ? this.fetchPacketInFragment(c, l, s) : null;
  }
}
class ts extends Ia {
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
    return !1;
  }
  async getDecoderConfig() {
    return this.internalTrack.info.codec ? this.decoderConfigPromise ??= (async () => {
      if (this.internalTrack.info.codec === "vp9" && !this.internalTrack.info.vp9CodecInfo) {
        const t = await this.getFirstPacket({});
        this.internalTrack.info.vp9CodecInfo = t && fa(t.data);
      } else if (this.internalTrack.info.codec === "av1" && !this.internalTrack.info.av1CodecInfo) {
        const t = await this.getFirstPacket({});
        this.internalTrack.info.av1CodecInfo = t && ma(t.data);
      }
      const e = {
        codec: yn(this.internalTrack.info),
        codedWidth: this.internalTrack.info.width,
        codedHeight: this.internalTrack.info.height,
        description: this.internalTrack.info.codecDescription ?? void 0,
        colorSpace: this.internalTrack.info.colorSpace ?? void 0
      };
      return (this.internalTrack.info.width !== this.internalTrack.info.squarePixelWidth || this.internalTrack.info.height !== this.internalTrack.info.squarePixelHeight) && (e.displayAspectWidth = this.internalTrack.info.squarePixelWidth, e.displayAspectHeight = this.internalTrack.info.squarePixelHeight), e;
    })() : null;
  }
}
class rs extends Ia {
  constructor(e) {
    super(e), this.decoderConfig = null, this.internalTrack = e;
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
    return this.internalTrack.info.codec ? this.decoderConfig ??= {
      codec: bn(this.internalTrack.info),
      numberOfChannels: this.internalTrack.info.numberOfChannels,
      sampleRate: this.internalTrack.info.sampleRate,
      description: this.internalTrack.info.codecDescription ?? void 0
    } : null;
  }
}
const Xi = (r, e) => {
  if (r.presentationTimestamps) {
    const t = K(r.presentationTimestamps, e, (i) => i.presentationTimestamp);
    return t === -1 ? -1 : r.presentationTimestamps[t].sampleIndex;
  } else {
    const t = K(r.sampleTimingEntries, e, (n) => n.startDecodeTimestamp);
    if (t === -1)
      return -1;
    const i = r.sampleTimingEntries[t];
    return i.startIndex + Math.min(Math.floor((e - i.startDecodeTimestamp) / i.delta), i.count - 1);
  }
}, Pc = (r, e) => {
  if (!r.keySampleIndices)
    return Xi(r, e);
  if (r.presentationTimestamps) {
    const t = K(r.presentationTimestamps, e, (i) => i.presentationTimestamp);
    if (t === -1)
      return -1;
    for (let i = t; i >= 0; i--) {
      const n = r.presentationTimestamps[i].sampleIndex;
      if (Ir(r.keySampleIndices, n, (a) => a) !== -1)
        return n;
    }
    return -1;
  } else {
    const t = Xi(r, e), i = K(r.keySampleIndices, t, (n) => n);
    return r.keySampleIndices[i] ?? -1;
  }
}, Cc = (r, e) => {
  const t = K(r.sampleTimingEntries, e, (k) => k.startIndex), i = r.sampleTimingEntries[t];
  if (!i || i.startIndex + i.count <= e)
    return null;
  let s = i.startDecodeTimestamp + (e - i.startIndex) * i.delta;
  const a = K(r.sampleCompositionTimeOffsets, e, (k) => k.startIndex), o = r.sampleCompositionTimeOffsets[a];
  o && e - o.startIndex < o.count && (s += o.offset);
  const c = r.sampleSizes[Math.min(e, r.sampleSizes.length - 1)], l = K(r.sampleToChunk, e, (k) => k.startSampleIndex), d = r.sampleToChunk[l];
  g(d);
  const u = d.startChunkIndex + Math.floor((e - d.startSampleIndex) / d.samplesPerChunk), f = r.chunkOffsets[u], h = d.startSampleIndex + (u - d.startChunkIndex) * d.samplesPerChunk;
  let p = 0, m = f;
  if (r.sampleSizes.length === 1)
    m += c * (e - h), p += c * d.samplesPerChunk;
  else
    for (let k = h; k < h + d.samplesPerChunk; k++) {
      const y = r.sampleSizes[k];
      k < e && (m += y), p += y;
    }
  let b = i.delta;
  if (r.presentationTimestamps) {
    const k = r.presentationTimestampIndexMap[e];
    g(k !== void 0), k < r.presentationTimestamps.length - 1 && (b = r.presentationTimestamps[k + 1].presentationTimestamp - s);
  }
  return {
    presentationTimestamp: s,
    duration: b,
    sampleOffset: m,
    sampleSize: c,
    chunkOffset: f,
    chunkSize: p,
    isKeyFrame: r.keySampleIndices ? Ir(r.keySampleIndices, e, (k) => k) !== -1 : !0
  };
}, Ic = (r, e) => {
  if (!r.keySampleIndices)
    return e + 1;
  const t = K(r.keySampleIndices, e, (i) => i);
  return r.keySampleIndices[t + 1] ?? -1;
}, Pi = (r, e) => {
  r.startTimestamp += e, r.endTimestamp += e;
  for (const t of r.samples)
    t.presentationTimestamp += e;
  for (const t of r.presentationTimestamps)
    t.presentationTimestamp += e;
}, Ec = (r) => {
  const [e, t] = r, i = Math.atan2(t, e);
  return Number.isFinite(i) ? i * (180 / Math.PI) : 0;
}, is = (r) => r.sampleSizes.length === 0, ns = (r) => r.currentFragmentState ? r.currentFragmentState.encryptionAuxInfo ??= {
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
}, Ea = async (r, e, t) => {
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
    s > 0 ? l.set(z(n, s), 0) : l.set(e.defaultConstantIv, 0);
    let d = null;
    if (c > s) {
      const u = ne(n);
      d = [];
      for (let f = 0; f < u; f++) {
        const h = ne(n), p = v(n);
        d.push({ clearLen: h, protectedLen: p });
      }
    }
    a.push({ iv: l, subsamples: d });
  }
  return t.resolved = a, a;
}, ss = async (r, e, t, i) => {
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
        ].filter((u) => u.keyIds === null || u.keyIds.includes(s));
        for (let u = 0; u < l.length - 1; u++)
          for (let f = u + 1; f < l.length; f++)
            Sa(l[u], l[f]) && (l.splice(f, 1), f--);
      }
      const d = await r.demuxer.input._formatOptions.isobmff.resolveKeyId({ keyId: s, psshBoxes: l });
      if (!(typeof d == "string" && d.length === 32 && xo.test(d) || d instanceof Uint8Array && d.byteLength === 16))
        throw new TypeError("resolveKeyId must return a 32-character hex string or a 16-byte Uint8Array containing the decryption key.");
      return d instanceof Uint8Array ? d : Po(d);
    })();
    r.demuxer.decryptionKeyCache.set(s, c), a = await c;
  }
  return n.scheme === "cenc" || n.scheme === "cens" ? _c(a, n, e, t) : vc(a, n, e, t);
}, _c = async (r, e, t, i) => {
  const n = new Uint8Array(16);
  n.set(t.iv, 0);
  const s = await crypto.subtle.importKey("raw", r, { name: "AES-CTR" }, !1, ["decrypt"]), a = async (p) => {
    const m = await crypto.subtle.decrypt({ name: "AES-CTR", counter: n, length: 64 }, s, p);
    return new Uint8Array(m);
  };
  if (!t.subsamples)
    return a(i);
  g(e.defaultCryptByteBlock !== null && e.defaultSkipByteBlock !== null);
  const o = _a(t.subsamples, e.defaultCryptByteBlock, e.defaultSkipByteBlock);
  let c = 0;
  for (const p of o)
    for (const m of p.perSubsample)
      c += m.length;
  const l = new Uint8Array(c);
  let d = 0;
  for (const p of o)
    for (const m of p.perSubsample)
      l.set(i.subarray(m.offset, m.offset + m.length), d), d += m.length;
  const u = await a(l), f = new Uint8Array(i);
  let h = 0;
  for (const p of o)
    for (const m of p.perSubsample)
      f.set(u.subarray(h, h + m.length), m.offset), h += m.length;
  return f;
}, vc = (r, e, t, i) => {
  const n = new Ca();
  n.init({ key: r, iv: t.iv });
  const s = e.defaultCryptByteBlock, a = e.defaultSkipByteBlock;
  if (g(s !== null && a !== null), !t.subsamples) {
    const d = new Uint8Array(i), u = Math.floor(i.length / 16);
    for (let f = 0; f < u; f++) {
      const h = f * 16;
      n.in.set(i.subarray(h, h + 16)), n.decrypt(), d.set(n.out, h);
    }
    return d;
  }
  if (s === 0 && a === 0)
    throw new Error("cbcs with subsamples requires pattern encryption.");
  const o = new Uint8Array(i), c = _a(t.subsamples, s, a), l = new DataView(t.iv.buffer, t.iv.byteOffset, 16);
  for (const d of c) {
    n.iv[0] = l.getUint32(0, !1), n.iv[1] = l.getUint32(4, !1), n.iv[2] = l.getUint32(8, !1), n.iv[3] = l.getUint32(12, !1);
    for (const u of d.perSubsample) {
      const f = u.length / 16;
      for (let h = 0; h < f; h++) {
        const p = u.offset + h * 16;
        n.in.set(i.subarray(p, p + 16)), n.decrypt(), o.set(n.out, p);
      }
    }
  }
  return o;
}, _a = (r, e, t) => {
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
        const d = 16 * e;
        o.push({ offset: l, length: d }), l += d, c -= d;
        const u = Math.min(16 * t, c);
        l += u, c -= u;
      }
      s += a.protectedLen;
    }
    i.push({ perSubsample: o });
  }
  return i;
};
var C;
(function(r) {
  r[r.EBML = 440786851] = "EBML", r[r.EBMLVersion = 17030] = "EBMLVersion", r[r.EBMLReadVersion = 17143] = "EBMLReadVersion", r[r.EBMLMaxIDLength = 17138] = "EBMLMaxIDLength", r[r.EBMLMaxSizeLength = 17139] = "EBMLMaxSizeLength", r[r.DocType = 17026] = "DocType", r[r.DocTypeVersion = 17031] = "DocTypeVersion", r[r.DocTypeReadVersion = 17029] = "DocTypeReadVersion", r[r.Void = 236] = "Void", r[r.Segment = 408125543] = "Segment", r[r.SeekHead = 290298740] = "SeekHead", r[r.Seek = 19899] = "Seek", r[r.SeekID = 21419] = "SeekID", r[r.SeekPosition = 21420] = "SeekPosition", r[r.Duration = 17545] = "Duration", r[r.Info = 357149030] = "Info", r[r.TimestampScale = 2807729] = "TimestampScale", r[r.MuxingApp = 19840] = "MuxingApp", r[r.WritingApp = 22337] = "WritingApp", r[r.Tracks = 374648427] = "Tracks", r[r.TrackEntry = 174] = "TrackEntry", r[r.TrackNumber = 215] = "TrackNumber", r[r.TrackUID = 29637] = "TrackUID", r[r.TrackType = 131] = "TrackType", r[r.FlagEnabled = 185] = "FlagEnabled", r[r.FlagDefault = 136] = "FlagDefault", r[r.FlagForced = 21930] = "FlagForced", r[r.FlagOriginal = 21934] = "FlagOriginal", r[r.FlagHearingImpaired = 21931] = "FlagHearingImpaired", r[r.FlagVisualImpaired = 21932] = "FlagVisualImpaired", r[r.FlagCommentary = 21935] = "FlagCommentary", r[r.FlagLacing = 156] = "FlagLacing", r[r.Name = 21358] = "Name", r[r.Language = 2274716] = "Language", r[r.LanguageBCP47 = 2274717] = "LanguageBCP47", r[r.CodecID = 134] = "CodecID", r[r.CodecPrivate = 25506] = "CodecPrivate", r[r.CodecDelay = 22186] = "CodecDelay", r[r.SeekPreRoll = 22203] = "SeekPreRoll", r[r.DefaultDuration = 2352003] = "DefaultDuration", r[r.Video = 224] = "Video", r[r.PixelWidth = 176] = "PixelWidth", r[r.PixelHeight = 186] = "PixelHeight", r[r.DisplayWidth = 21680] = "DisplayWidth", r[r.DisplayHeight = 21690] = "DisplayHeight", r[r.DisplayUnit = 21682] = "DisplayUnit", r[r.AlphaMode = 21440] = "AlphaMode", r[r.Audio = 225] = "Audio", r[r.SamplingFrequency = 181] = "SamplingFrequency", r[r.Channels = 159] = "Channels", r[r.BitDepth = 25188] = "BitDepth", r[r.SimpleBlock = 163] = "SimpleBlock", r[r.BlockGroup = 160] = "BlockGroup", r[r.Block = 161] = "Block", r[r.BlockAdditions = 30113] = "BlockAdditions", r[r.BlockMore = 166] = "BlockMore", r[r.BlockAdditional = 165] = "BlockAdditional", r[r.BlockAddID = 238] = "BlockAddID", r[r.BlockDuration = 155] = "BlockDuration", r[r.ReferenceBlock = 251] = "ReferenceBlock", r[r.Cluster = 524531317] = "Cluster", r[r.Timestamp = 231] = "Timestamp", r[r.Cues = 475249515] = "Cues", r[r.CuePoint = 187] = "CuePoint", r[r.CueTime = 179] = "CueTime", r[r.CueTrackPositions = 183] = "CueTrackPositions", r[r.CueTrack = 247] = "CueTrack", r[r.CueClusterPosition = 241] = "CueClusterPosition", r[r.Colour = 21936] = "Colour", r[r.MatrixCoefficients = 21937] = "MatrixCoefficients", r[r.TransferCharacteristics = 21946] = "TransferCharacteristics", r[r.Primaries = 21947] = "Primaries", r[r.Range = 21945] = "Range", r[r.Projection = 30320] = "Projection", r[r.ProjectionType = 30321] = "ProjectionType", r[r.ProjectionPoseRoll = 30325] = "ProjectionPoseRoll", r[r.Attachments = 423732329] = "Attachments", r[r.AttachedFile = 24999] = "AttachedFile", r[r.FileDescription = 18046] = "FileDescription", r[r.FileName = 18030] = "FileName", r[r.FileMediaType = 18016] = "FileMediaType", r[r.FileData = 18012] = "FileData", r[r.FileUID = 18094] = "FileUID", r[r.Chapters = 272869232] = "Chapters", r[r.Tags = 307544935] = "Tags", r[r.Tag = 29555] = "Tag", r[r.Targets = 25536] = "Targets", r[r.TargetTypeValue = 26826] = "TargetTypeValue", r[r.TargetType = 25546] = "TargetType", r[r.TagTrackUID = 25541] = "TagTrackUID", r[r.TagEditionUID = 25545] = "TagEditionUID", r[r.TagChapterUID = 25540] = "TagChapterUID", r[r.TagAttachmentUID = 25542] = "TagAttachmentUID", r[r.SimpleTag = 26568] = "SimpleTag", r[r.TagName = 17827] = "TagName", r[r.TagLanguage = 17530] = "TagLanguage", r[r.TagString = 17543] = "TagString", r[r.TagBinary = 17541] = "TagBinary", r[r.ContentEncodings = 28032] = "ContentEncodings", r[r.ContentEncoding = 25152] = "ContentEncoding", r[r.ContentEncodingOrder = 20529] = "ContentEncodingOrder", r[r.ContentEncodingScope = 20530] = "ContentEncodingScope", r[r.ContentCompression = 20532] = "ContentCompression", r[r.ContentCompAlgo = 16980] = "ContentCompAlgo", r[r.ContentCompSettings = 16981] = "ContentCompSettings", r[r.ContentEncryption = 20533] = "ContentEncryption";
})(C || (C = {}));
const Bc = [
  C.EBML,
  C.Segment
], Sr = [
  C.SeekHead,
  C.Info,
  C.Cluster,
  C.Tracks,
  C.Cues,
  C.Attachments,
  C.Chapters,
  C.Tags
], Vr = [
  ...Bc,
  ...Sr
], $i = 8, Ee = 2, Ze = 2 * $i, va = (r) => {
  if (r.remainingLength < 1)
    return null;
  const e = R(r);
  if (r.skip(-1), e === 0)
    return null;
  let t = 1, i = 128;
  for (; (e & i) === 0; )
    t++, i >>= 1;
  return r.remainingLength < t ? null : t;
}, hr = (r) => {
  if (r.remainingLength < 1)
    return null;
  const e = R(r);
  if (e === 0)
    return null;
  let t = 1, i = 128;
  for (; (e & i) === 0; )
    t++, i >>= 1;
  if (r.remainingLength < t - 1)
    return null;
  let n = e & i - 1;
  for (let s = 1; s < t; s++)
    n *= 256, n += R(r);
  return n;
}, q = (r, e) => {
  if (e < 1 || e > 8)
    throw new Error("Bad unsigned int size " + e);
  let t = 0;
  for (let i = 0; i < e; i++)
    t *= 256, t += R(r);
  return t;
}, Fc = (r, e) => {
  if (e < 1)
    throw new Error("Bad unsigned int size " + e);
  let t = 0n;
  for (let i = 0; i < e; i++)
    t <<= 8n, t += BigInt(R(r));
  return t;
}, En = (r) => {
  const e = va(r);
  return e === null || r.remainingLength < e ? null : q(r, e);
}, Ba = (r) => {
  if (r.remainingLength < 1)
    return null;
  if (R(r) === 255)
    return;
  r.skip(-1);
  const t = hr(r);
  if (t === null)
    return null;
  if (t !== 72057594037927940)
    return t;
}, $e = (r) => {
  g(r.remainingLength >= Ee);
  const e = En(r);
  if (e === null)
    return null;
  const t = Ba(r);
  return t === null ? null : { id: e, size: t };
}, Wt = (r, e) => {
  const t = z(r, e);
  let i = 0;
  for (; i < e && t[i] !== 0; )
    i += 1;
  return String.fromCharCode(...t.subarray(0, i));
}, ar = (r, e) => {
  const t = z(r, e);
  let i = 0;
  for (; i < e && t[i] !== 0; )
    i += 1;
  return Te.decode(t.subarray(0, i));
}, Ci = (r, e) => {
  if (e === 0)
    return 0;
  if (e !== 4 && e !== 8)
    throw new Error("Bad float size " + e);
  return e === 4 ? pu(r) : oo(r);
}, Yi = async (r, e, t, i) => {
  const n = new Set(t);
  let s = e;
  for (; i === null || s < i; ) {
    let a = r.requestSliceRange(s, Ee, Ze);
    if (a instanceof Promise && (a = await a), !a)
      break;
    const o = $e(a);
    if (!o)
      break;
    if (n.has(o.id))
      return { pos: s, found: !0 };
    lt(o.size), s = a.filePos + o.size;
  }
  return { pos: i !== null && i > s ? i : s, found: !1 };
}, Fa = async (r, e, t, i) => {
  const s = new Set(t);
  let a = e;
  for (; a < i; ) {
    let o = r.requestSliceRange(a, 0, Math.min(65536, i - a));
    if (o instanceof Promise && (o = await o), !o || o.length < $i)
      break;
    for (let c = 0; c < o.length - $i; c++) {
      o.filePos = a;
      const l = En(o);
      if (l !== null && s.has(l))
        return a;
      a++;
    }
  }
  return null;
}, Ce = {
  avc: "V_MPEG4/ISO/AVC",
  hevc: "V_MPEGH/ISO/HEVC",
  vp8: "V_VP8",
  vp9: "V_VP9",
  av1: "V_AV1",
  aac: "A_AAC",
  mp3: "A_MPEG/L3",
  opus: "A_OPUS",
  vorbis: "A_VORBIS",
  flac: "A_FLAC",
  ac3: "A_AC3",
  eac3: "A_EAC3"
};
function lt(r) {
  if (r === void 0)
    throw new Error("Undefined element size is used in a place where it is not supported.");
}
const Rc = (r) => {
  let t = (r.hasVideo ? "video/" : r.hasAudio ? "audio/" : "application/") + (r.isWebM ? "webm" : "x-matroska");
  if (r.codecStrings.length > 0) {
    const i = [...new Set(r.codecStrings.filter(Boolean))];
    t += `; codecs="${i.join(", ")}"`;
  }
  return t;
};
var Ge;
(function(r) {
  r[r.None = 0] = "None", r[r.Xiph = 1] = "Xiph", r[r.FixedSize = 2] = "FixedSize", r[r.Ebml = 3] = "Ebml";
})(Ge || (Ge = {}));
var Zr;
(function(r) {
  r[r.Block = 1] = "Block", r[r.Private = 2] = "Private", r[r.Next = 4] = "Next";
})(Zr || (Zr = {}));
var gr;
(function(r) {
  r[r.Zlib = 0] = "Zlib", r[r.Bzlib = 1] = "Bzlib", r[r.lzo1x = 2] = "lzo1x", r[r.HeaderStripping = 3] = "HeaderStripping";
})(gr || (gr = {}));
const Ii = [
  { id: C.SeekHead, flag: "seekHeadSeen" },
  { id: C.Info, flag: "infoSeen" },
  { id: C.Tracks, flag: "tracksSeen" },
  { id: C.Cues, flag: "cuesSeen" }
], Ra = 10 * 2 ** 20;
class Mc extends at {
  constructor(e) {
    super(e), this.readMetadataPromise = null, this.segments = [], this.currentSegment = null, this.currentTrack = null, this.currentCluster = null, this.currentBlock = null, this.currentBlockAdditional = null, this.currentCueTime = null, this.currentDecodingInstruction = null, this.currentTagTargetIsMovie = !0, this.currentSimpleTagName = null, this.currentAttachedFile = null, this.isWebM = !1, this.reader = e._reader;
  }
  async getTrackBackings() {
    return await this.readMetadata(), this.segments.flatMap((e) => e.tracks.map((t) => t.trackBacking));
  }
  async getMimeType() {
    await this.readMetadata();
    const e = await this.getTrackBackings(), t = await Promise.all(e.map((i) => i.getDecoderConfig().then((n) => n?.codec ?? null)));
    return Rc({
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
        let t = this.reader.requestSliceRange(e, Ee, Ze);
        if (t instanceof Promise && (t = await t), !t)
          break;
        const i = $e(t);
        if (!i)
          break;
        const n = i.id;
        let s = i.size;
        const a = t.filePos;
        if (n === C.EBML) {
          lt(s);
          let o = this.reader.requestSlice(a, s);
          if (o instanceof Promise && (o = await o), !o)
            break;
          this.readContiguousElements(o);
        } else if (n === C.Segment) {
          if (await this.readSegment(a, s), s === void 0 || this.reader.fileSize === null)
            break;
        } else if (n === C.Cluster) {
          if (this.reader.fileSize === null)
            break;
          s === void 0 && (s = (await Yi(this.reader, a, Vr, this.reader.fileSize)).pos - a);
          const o = ee(this.segments);
          o && (o.elementEndPos = a + s);
        }
        lt(s), e = a + s;
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
      let o = this.reader.requestSliceRange(i, Ee, Ze);
      if (o instanceof Promise && (o = await o), !o)
        break;
      const c = i, l = $e(o);
      if (!l || !Sr.includes(l.id) && l.id !== C.Void) {
        const p = await Fa(this.reader, c, Sr, Math.min(this.currentSegment.elementEndPos ?? 1 / 0, c + Ra));
        if (p) {
          i = p;
          continue;
        } else
          break;
      }
      const { id: d, size: u } = l, f = o.filePos, h = Ii.findIndex((p) => p.id === d);
      if (h !== -1) {
        const p = Ii[h].flag;
        this.currentSegment[p] = !0, lt(u);
        let m = this.reader.requestSlice(f, u);
        m instanceof Promise && (m = await m), m && this.readContiguousElements(m);
      } else if (d === C.Tags || d === C.Attachments) {
        d === C.Tags ? this.currentSegment.tagsSeen = !0 : this.currentSegment.attachmentsSeen = !0, lt(u);
        let p = this.reader.requestSlice(f, u);
        p instanceof Promise && (p = await p), p && this.readContiguousElements(p);
      } else if (d === C.Cluster) {
        this.currentSegment.clusterSeekStartPos = c;
        break;
      }
      if (u === void 0)
        break;
      i = f + u;
    }
    if (this.currentSegment.seekEntries.sort((o, c) => o.segmentPosition - c.segmentPosition), this.reader.fileSize !== null)
      for (const o of this.currentSegment.seekEntries) {
        const c = Ii.find((p) => p.id === o.id);
        if (!c || this.currentSegment[c.flag])
          continue;
        let l = this.reader.requestSliceRange(e + o.segmentPosition, Ee, Ze);
        if (l instanceof Promise && (l = await l), !l)
          continue;
        const d = $e(l);
        if (!d)
          continue;
        const { id: u, size: f } = d;
        if (u !== c.id)
          continue;
        lt(f), this.currentSegment[c.flag] = !0;
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
        const l = o.cuePoints[c], d = o.cuePoints[c + 1];
        l.time === d.time && (o.cuePoints.splice(c + 1, 1), c--);
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
    let i = this.reader.requestSliceRange(e, Ee, Ze);
    i instanceof Promise && (i = await i), g(i);
    const n = e, s = $e(i);
    g(s);
    const a = s.id;
    g(a === C.Cluster);
    let o = s.size;
    const c = i.filePos;
    o === void 0 && (o = (await Yi(this.reader, c, Vr, t.elementEndPos)).pos - c);
    let l = this.reader.requestSlice(c, o);
    l instanceof Promise && (l = await l);
    const d = {
      segment: t,
      elementStartPos: n,
      elementEndPos: c + o,
      dataStartPos: c,
      timestamp: -1,
      trackData: /* @__PURE__ */ new Map()
    };
    if (this.currentCluster = d, l) {
      const u = this.readContiguousElements(l, Vr);
      d.elementEndPos = u;
    }
    for (const [, u] of d.trackData) {
      const f = u.track;
      g(u.blocks.length > 0);
      let h = !1;
      for (let k = 0; k < u.blocks.length; k++) {
        const y = u.blocks[k];
        y.timestamp += d.timestamp, h ||= y.lacing !== Ge.None;
      }
      u.presentationTimestamps = u.blocks.map((k, y) => ({ timestamp: k.timestamp, blockIndex: y })).sort((k, y) => k.timestamp - y.timestamp);
      for (let k = 0; k < u.presentationTimestamps.length; k++) {
        const y = u.presentationTimestamps[k], w = u.blocks[y.blockIndex];
        if (u.firstKeyFrameTimestamp === null && w.isKeyFrame && (u.firstKeyFrameTimestamp = w.timestamp), k < u.presentationTimestamps.length - 1) {
          const T = u.presentationTimestamps[k + 1];
          w.duration = T.timestamp - w.timestamp;
        } else w.duration === 0 && f.defaultDuration != null && w.lacing === Ge.None && (w.duration = f.defaultDuration);
      }
      h && (this.expandLacedBlocks(u.blocks, f), u.presentationTimestamps = u.blocks.map((k, y) => ({ timestamp: k.timestamp, blockIndex: y })).sort((k, y) => k.timestamp - y.timestamp));
      const p = u.blocks[u.presentationTimestamps[0].blockIndex], m = u.blocks[ee(u.presentationTimestamps).blockIndex];
      u.startTimestamp = p.timestamp, u.endTimestamp = m.timestamp + m.duration;
      const b = K(f.clusterPositionCache, u.startTimestamp, (k) => k.startTimestamp);
      (b === -1 || f.clusterPositionCache[b].elementStartPos !== n) && f.clusterPositionCache.splice(b + 1, 0, {
        elementStartPos: d.elementStartPos,
        startTimestamp: u.startTimestamp
      });
    }
    return t.lastReadCluster = d, d;
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
      if (n.lacing === Ge.None)
        continue;
      n.decoded || (n.data = this.decodeBlockData(t, n.data), n.decoded = !0);
      const s = we.tempFromBytes(n.data), a = [], o = R(s) + 1;
      switch (n.lacing) {
        case Ge.Xiph:
          {
            let l = 0;
            for (let d = 0; d < o - 1; d++) {
              let u = 0;
              for (; s.bufferPos < s.length; ) {
                const f = R(s);
                if (u += f, f < 255) {
                  a.push(u), l += u;
                  break;
                }
              }
            }
            a.push(s.length - (s.bufferPos + l));
          }
          break;
        case Ge.FixedSize:
          {
            const l = s.length - 1, d = Math.floor(l / o);
            for (let u = 0; u < o; u++)
              a.push(d);
          }
          break;
        case Ge.Ebml:
          {
            const l = hr(s);
            g(l !== null);
            let d = l;
            a.push(d);
            let u = d;
            for (let f = 1; f < o - 1; f++) {
              const h = s.bufferPos, p = hr(s);
              g(p !== null);
              const m = p, k = (1 << (s.bufferPos - h) * 7 - 1) - 1, y = m - k;
              d += y, a.push(d), u += d;
            }
            a.push(s.length - (s.bufferPos + u));
          }
          break;
        default:
          g(!1);
      }
      g(a.length === o), e.splice(i, 1);
      const c = n.duration || o * (t.defaultDuration ?? 0);
      for (let l = 0; l < o; l++) {
        const d = a[l], u = z(s, d), f = n.timestamp + c * l / o, h = c / o;
        e.splice(i + l, 0, {
          timestamp: f,
          duration: h,
          isKeyFrame: n.isKeyFrame,
          data: u,
          lacing: Ge.None,
          decoded: !0,
          mainAdditional: n.mainAdditional
        });
      }
      i += o, i--;
    }
  }
  async loadSegmentMetadata(e) {
    for (const t of e.seekEntries) {
      if (!(t.id === C.Tags && !e.tagsSeen)) {
        if (!(t.id === C.Attachments && !e.attachmentsSeen)) continue;
      }
      let i = this.reader.requestSliceRange(e.dataStartPos + t.segmentPosition, Ee, Ze);
      if (i instanceof Promise && (i = await i), !i)
        continue;
      const n = $e(i);
      if (!n || n.id !== t.id)
        continue;
      const { size: s } = n;
      lt(s), g(!this.currentSegment), this.currentSegment = e;
      let a = this.reader.requestSlice(i.filePos, s);
      a instanceof Promise && (a = await a), a && this.readContiguousElements(a), this.currentSegment = null, t.id === C.Tags ? e.tagsSeen = !0 : t.id === C.Attachments && (e.attachmentsSeen = !0);
    }
  }
  readContiguousElements(e, t) {
    for (; e.remainingLength >= Ee; ) {
      const i = e.filePos;
      if (!this.traverseElement(e, t))
        return i;
    }
    return e.filePos;
  }
  traverseElement(e, t) {
    const i = $e(e);
    if (!i || t && t.includes(i.id))
      return !1;
    const { id: n, size: s } = i, a = e.filePos;
    switch (lt(s), n) {
      case C.DocType:
        this.isWebM = Wt(e, s) === "webm";
        break;
      case C.Seek:
        {
          if (!this.currentSegment)
            break;
          const o = { id: -1, segmentPosition: -1 };
          this.currentSegment.seekEntries.push(o), this.readContiguousElements(e.slice(a, s)), (o.id === -1 || o.segmentPosition === -1) && this.currentSegment.seekEntries.pop();
        }
        break;
      case C.SeekID:
        {
          const o = this.currentSegment?.seekEntries[this.currentSegment.seekEntries.length - 1];
          if (!o)
            break;
          o.id = q(e, s);
        }
        break;
      case C.SeekPosition:
        {
          const o = this.currentSegment?.seekEntries[this.currentSegment.seekEntries.length - 1];
          if (!o)
            break;
          o.segmentPosition = q(e, s);
        }
        break;
      case C.TimestampScale:
        {
          if (!this.currentSegment)
            break;
          this.currentSegment.timestampScale = q(e, s), this.currentSegment.timestampFactor = 1e9 / this.currentSegment.timestampScale;
        }
        break;
      case C.Duration:
        {
          if (!this.currentSegment)
            break;
          this.currentSegment.duration = Ci(e, s);
        }
        break;
      case C.TrackEntry:
        {
          if (!this.currentSegment || (this.currentTrack = {
            id: -1,
            segment: this.currentSegment,
            demuxer: this,
            clusterPositionCache: [],
            cuePoints: [],
            disposition: {
              ...st,
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
          if (this.currentTrack.decodingInstructions.some((o) => o.data?.type !== "decompress" || o.scope !== Zr.Block || o.data.algorithm !== gr.HeaderStripping) && (console.warn(`Track #${this.currentTrack.id} has an unsupported content encoding; dropping.`), this.currentTrack = null), this.currentTrack && this.currentTrack.id !== -1 && this.currentTrack.codecId && this.currentTrack.info) {
            const o = this.currentTrack.codecId.indexOf("/"), c = o === -1 ? this.currentTrack.codecId : this.currentTrack.codecId.slice(0, o);
            if (this.currentTrack.info.type === "video" && this.currentTrack.info.width !== -1 && this.currentTrack.info.height !== -1) {
              if (this.currentTrack.info.squarePixelWidth = this.currentTrack.info.width, this.currentTrack.info.squarePixelHeight = this.currentTrack.info.height, this.currentTrack.info.displayWidth !== null && this.currentTrack.info.displayHeight !== null) {
                const d = this.currentTrack.info.displayWidth * this.currentTrack.info.height, u = this.currentTrack.info.displayHeight * this.currentTrack.info.width;
                d > 0 && u > 0 && (d > u ? this.currentTrack.info.squarePixelWidth = Math.round(this.currentTrack.info.width * d / u) : this.currentTrack.info.squarePixelHeight = Math.round(this.currentTrack.info.height * u / d));
              }
              this.currentTrack.codecId === Ce.avc ? (this.currentTrack.info.codec = "avc", this.currentTrack.info.codecDescription = this.currentTrack.codecPrivate) : this.currentTrack.codecId === Ce.hevc ? (this.currentTrack.info.codec = "hevc", this.currentTrack.info.codecDescription = this.currentTrack.codecPrivate) : c === Ce.vp8 ? this.currentTrack.info.codec = "vp8" : c === Ce.vp9 ? this.currentTrack.info.codec = "vp9" : c === Ce.av1 && (this.currentTrack.info.codec = "av1");
              const l = this.currentTrack;
              this.currentTrack.trackBacking = new zc(l), this.currentSegment.tracks.push(this.currentTrack);
            } else if (this.currentTrack.info.type === "audio") {
              c === Ce.aac ? (this.currentTrack.info.codec = "aac", this.currentTrack.info.aacCodecInfo = {
                isMpeg2: this.currentTrack.codecId.includes("MPEG2"),
                objectType: null
              }, this.currentTrack.info.codecDescription = this.currentTrack.codecPrivate) : this.currentTrack.codecId === Ce.mp3 ? this.currentTrack.info.codec = "mp3" : c === Ce.opus ? (this.currentTrack.info.codec = "opus", this.currentTrack.info.codecDescription = this.currentTrack.codecPrivate, this.currentTrack.info.sampleRate = oi) : c === Ce.vorbis ? (this.currentTrack.info.codec = "vorbis", this.currentTrack.info.codecDescription = this.currentTrack.codecPrivate) : c === Ce.flac ? (this.currentTrack.info.codec = "flac", this.currentTrack.info.codecDescription = this.currentTrack.codecPrivate) : c === Ce.ac3 ? (this.currentTrack.info.codec = "ac3", this.currentTrack.info.codecDescription = this.currentTrack.codecPrivate) : c === Ce.eac3 ? (this.currentTrack.info.codec = "eac3", this.currentTrack.info.codecDescription = this.currentTrack.codecPrivate) : this.currentTrack.codecId === "A_PCM/INT/LIT" ? this.currentTrack.info.bitDepth === 8 ? this.currentTrack.info.codec = "pcm-u8" : this.currentTrack.info.bitDepth === 16 ? this.currentTrack.info.codec = "pcm-s16" : this.currentTrack.info.bitDepth === 24 ? this.currentTrack.info.codec = "pcm-s24" : this.currentTrack.info.bitDepth === 32 && (this.currentTrack.info.codec = "pcm-s32") : this.currentTrack.codecId === "A_PCM/INT/BIG" ? this.currentTrack.info.bitDepth === 8 ? this.currentTrack.info.codec = "pcm-u8" : this.currentTrack.info.bitDepth === 16 ? this.currentTrack.info.codec = "pcm-s16be" : this.currentTrack.info.bitDepth === 24 ? this.currentTrack.info.codec = "pcm-s24be" : this.currentTrack.info.bitDepth === 32 && (this.currentTrack.info.codec = "pcm-s32be") : this.currentTrack.codecId === "A_PCM/FLOAT/IEEE" && (this.currentTrack.info.bitDepth === 32 ? this.currentTrack.info.codec = "pcm-f32" : this.currentTrack.info.bitDepth === 64 && (this.currentTrack.info.codec = "pcm-f64"));
              const l = this.currentTrack;
              this.currentTrack.trackBacking = new Dc(l), this.currentSegment.tracks.push(this.currentTrack);
            }
          }
          this.currentTrack = null;
        }
        break;
      case C.TrackNumber:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.id = q(e, s);
        }
        break;
      case C.TrackType:
        {
          if (!this.currentTrack)
            break;
          const o = q(e, s);
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
            alphaMode: !1
          } : o === 2 && (this.currentTrack.info = {
            type: "audio",
            numberOfChannels: 1,
            // Default value
            sampleRate: 8e3,
            // Default value
            bitDepth: -1,
            codec: null,
            codecDescription: null,
            aacCodecInfo: null
          });
        }
        break;
      case C.FlagEnabled:
        {
          if (!this.currentTrack)
            break;
          q(e, s) || (this.currentTrack = null);
        }
        break;
      case C.FlagDefault:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.disposition.default = !!q(e, s);
        }
        break;
      case C.FlagForced:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.disposition.forced = !!q(e, s);
        }
        break;
      case C.FlagOriginal:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.disposition.original = !!q(e, s);
        }
        break;
      case C.FlagHearingImpaired:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.disposition.hearingImpaired = !!q(e, s);
        }
        break;
      case C.FlagVisualImpaired:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.disposition.visuallyImpaired = !!q(e, s);
        }
        break;
      case C.FlagCommentary:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.disposition.commentary = !!q(e, s);
        }
        break;
      case C.CodecID:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.codecId = Wt(e, s);
        }
        break;
      case C.CodecPrivate:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.codecPrivate = z(e, s);
        }
        break;
      case C.DefaultDuration:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.defaultDurationNs = q(e, s);
        }
        break;
      case C.Name:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.name = ar(e, s);
        }
        break;
      case C.Language:
        {
          if (!this.currentTrack || this.currentTrack.hasLanguageBcp47)
            break;
          this.currentTrack.languageCode = Wt(e, s), Tr(this.currentTrack.languageCode) || (this.currentTrack.languageCode = de);
        }
        break;
      case C.LanguageBCP47:
        {
          if (!this.currentTrack)
            break;
          const c = Wt(e, s).split("-")[0];
          c ? this.currentTrack.languageCode = c : this.currentTrack.languageCode = de, this.currentTrack.hasLanguageBcp47 = !0;
        }
        break;
      case C.Video:
        {
          if (this.currentTrack?.info?.type !== "video")
            break;
          this.readContiguousElements(e.slice(a, s));
        }
        break;
      case C.PixelWidth:
        {
          if (this.currentTrack?.info?.type !== "video")
            break;
          this.currentTrack.info.width = q(e, s);
        }
        break;
      case C.PixelHeight:
        {
          if (this.currentTrack?.info?.type !== "video")
            break;
          this.currentTrack.info.height = q(e, s);
        }
        break;
      case C.DisplayWidth:
        {
          if (this.currentTrack?.info?.type !== "video")
            break;
          this.currentTrack.info.displayWidth = q(e, s);
        }
        break;
      case C.DisplayHeight:
        {
          if (this.currentTrack?.info?.type !== "video")
            break;
          this.currentTrack.info.displayHeight = q(e, s);
        }
        break;
      case C.DisplayUnit:
        {
          if (this.currentTrack?.info?.type !== "video")
            break;
          this.currentTrack.info.displayUnit = q(e, s);
        }
        break;
      case C.AlphaMode:
        {
          if (this.currentTrack?.info?.type !== "video")
            break;
          this.currentTrack.info.alphaMode = q(e, s) === 1;
        }
        break;
      case C.Colour:
        {
          if (this.currentTrack?.info?.type !== "video")
            break;
          this.currentTrack.info.colorSpace = {}, this.readContiguousElements(e.slice(a, s));
        }
        break;
      case C.MatrixCoefficients:
        {
          if (this.currentTrack?.info?.type !== "video" || !this.currentTrack.info.colorSpace)
            break;
          const o = q(e, s), c = Kr[o] ?? null;
          this.currentTrack.info.colorSpace.matrix = c;
        }
        break;
      case C.Range:
        {
          if (this.currentTrack?.info?.type !== "video" || !this.currentTrack.info.colorSpace)
            break;
          this.currentTrack.info.colorSpace.fullRange = q(e, s) === 2;
        }
        break;
      case C.TransferCharacteristics:
        {
          if (this.currentTrack?.info?.type !== "video" || !this.currentTrack.info.colorSpace)
            break;
          const o = q(e, s), c = qr[o] ?? null;
          this.currentTrack.info.colorSpace.transfer = c;
        }
        break;
      case C.Primaries:
        {
          if (this.currentTrack?.info?.type !== "video" || !this.currentTrack.info.colorSpace)
            break;
          const o = q(e, s), c = Hr[o] ?? null;
          this.currentTrack.info.colorSpace.primaries = c;
        }
        break;
      case C.Projection:
        {
          if (this.currentTrack?.info?.type !== "video")
            break;
          this.readContiguousElements(e.slice(a, s));
        }
        break;
      case C.ProjectionPoseRoll:
        {
          if (this.currentTrack?.info?.type !== "video")
            break;
          const c = -Ci(e, s);
          try {
            this.currentTrack.info.rotation = ii(c);
          } catch {
          }
        }
        break;
      case C.Audio:
        {
          if (this.currentTrack?.info?.type !== "audio")
            break;
          this.readContiguousElements(e.slice(a, s));
        }
        break;
      case C.SamplingFrequency:
        {
          if (this.currentTrack?.info?.type !== "audio")
            break;
          this.currentTrack.info.sampleRate = Ci(e, s);
        }
        break;
      case C.Channels:
        {
          if (this.currentTrack?.info?.type !== "audio")
            break;
          this.currentTrack.info.numberOfChannels = q(e, s);
        }
        break;
      case C.BitDepth:
        {
          if (this.currentTrack?.info?.type !== "audio")
            break;
          this.currentTrack.info.bitDepth = q(e, s);
        }
        break;
      case C.CuePoint:
        {
          if (!this.currentSegment)
            break;
          this.readContiguousElements(e.slice(a, s)), this.currentCueTime = null;
        }
        break;
      case C.CueTime:
        this.currentCueTime = q(e, s);
        break;
      case C.CueTrackPositions:
        {
          if (this.currentCueTime === null)
            break;
          g(this.currentSegment);
          const o = { time: this.currentCueTime, trackId: -1, clusterPosition: -1 };
          this.currentSegment.cuePoints.push(o), this.readContiguousElements(e.slice(a, s)), (o.trackId === -1 || o.clusterPosition === -1) && this.currentSegment.cuePoints.pop();
        }
        break;
      case C.CueTrack:
        {
          const o = this.currentSegment?.cuePoints[this.currentSegment.cuePoints.length - 1];
          if (!o)
            break;
          o.trackId = q(e, s);
        }
        break;
      case C.CueClusterPosition:
        {
          const o = this.currentSegment?.cuePoints[this.currentSegment.cuePoints.length - 1];
          if (!o)
            break;
          g(this.currentSegment), o.clusterPosition = this.currentSegment.dataStartPos + q(e, s);
        }
        break;
      case C.Timestamp:
        {
          if (!this.currentCluster)
            break;
          this.currentCluster.timestamp = q(e, s);
        }
        break;
      case C.SimpleBlock:
        {
          if (!this.currentCluster)
            break;
          const o = hr(e);
          if (o === null)
            break;
          const c = this.getTrackDataInCluster(this.currentCluster, o);
          if (!c)
            break;
          const l = cn(e), d = R(e), u = d >> 1 & 3;
          let f = !!(d & 128);
          c.track.info?.type === "audio" && c.track.info.codec && (f = !0);
          const h = z(e, s - (e.filePos - a)), p = c.track.decodingInstructions.length > 0;
          c.blocks.push({
            timestamp: l,
            // We'll add the cluster's timestamp to this later
            duration: 0,
            // Will set later
            isKeyFrame: f,
            data: h,
            lacing: u,
            decoded: !p,
            mainAdditional: null
          });
        }
        break;
      case C.BlockGroup:
        {
          if (!this.currentCluster)
            break;
          this.readContiguousElements(e.slice(a, s)), this.currentBlock = null;
        }
        break;
      case C.Block:
        {
          if (!this.currentCluster)
            break;
          const o = hr(e);
          if (o === null)
            break;
          const c = this.getTrackDataInCluster(this.currentCluster, o);
          if (!c)
            break;
          const l = cn(e), u = R(e) >> 1 & 3, f = z(e, s - (e.filePos - a)), h = c.track.decodingInstructions.length > 0;
          this.currentBlock = {
            timestamp: l,
            // We'll add the cluster's timestamp to this later
            duration: 0,
            // Will set later
            isKeyFrame: !0,
            data: f,
            lacing: u,
            decoded: !h,
            mainAdditional: null
          }, c.blocks.push(this.currentBlock);
        }
        break;
      case C.BlockAdditions:
        this.readContiguousElements(e.slice(a, s));
        break;
      case C.BlockMore:
        {
          if (!this.currentBlock)
            break;
          this.currentBlockAdditional = {
            addId: 1,
            data: null
          }, this.readContiguousElements(e.slice(a, s)), this.currentBlockAdditional.data && this.currentBlockAdditional.addId === 1 && (this.currentBlock.mainAdditional = this.currentBlockAdditional.data), this.currentBlockAdditional = null;
        }
        break;
      case C.BlockAdditional:
        {
          if (!this.currentBlockAdditional)
            break;
          this.currentBlockAdditional.data = z(e, s);
        }
        break;
      case C.BlockAddID:
        {
          if (!this.currentBlockAdditional)
            break;
          this.currentBlockAdditional.addId = q(e, s);
        }
        break;
      case C.BlockDuration:
        {
          if (!this.currentBlock)
            break;
          this.currentBlock.duration = q(e, s);
        }
        break;
      case C.ReferenceBlock:
        {
          if (!this.currentBlock)
            break;
          this.currentBlock.isKeyFrame = !1;
        }
        break;
      case C.Tag:
        this.currentTagTargetIsMovie = !0, this.readContiguousElements(e.slice(a, s));
        break;
      case C.Targets:
        this.readContiguousElements(e.slice(a, s));
        break;
      case C.TargetTypeValue:
        q(e, s) !== 50 && (this.currentTagTargetIsMovie = !1);
        break;
      case C.TagTrackUID:
      case C.TagEditionUID:
      case C.TagChapterUID:
      case C.TagAttachmentUID:
        this.currentTagTargetIsMovie = !1;
        break;
      case C.SimpleTag:
        {
          if (!this.currentTagTargetIsMovie)
            break;
          this.currentSimpleTagName = null, this.readContiguousElements(e.slice(a, s));
        }
        break;
      case C.TagName:
        this.currentSimpleTagName = ar(e, s);
        break;
      case C.TagString:
        {
          if (!this.currentSimpleTagName)
            break;
          const o = ar(e, s);
          this.processTagValue(this.currentSimpleTagName, o);
        }
        break;
      case C.TagBinary:
        {
          if (!this.currentSimpleTagName)
            break;
          const o = z(e, s);
          this.processTagValue(this.currentSimpleTagName, o);
        }
        break;
      case C.AttachedFile:
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
          if (this.currentAttachedFile.fileUid && this.currentAttachedFile.fileData && (o.raw ??= {}, o.raw[this.currentAttachedFile.fileUid.toString()] = new Js(this.currentAttachedFile.fileData, this.currentAttachedFile.fileMediaType ?? void 0, this.currentAttachedFile.fileName ?? void 0, this.currentAttachedFile.fileDescription ?? void 0)), this.currentAttachedFile.fileMediaType?.startsWith("image/") && this.currentAttachedFile.fileData) {
            const c = this.currentAttachedFile.fileName;
            let l = "unknown";
            if (c) {
              const d = c.toLowerCase();
              d.startsWith("cover.") ? l = "coverFront" : d.startsWith("back.") && (l = "coverBack");
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
      case C.FileUID:
        {
          if (!this.currentAttachedFile)
            break;
          this.currentAttachedFile.fileUid = Fc(e, s);
        }
        break;
      case C.FileName:
        {
          if (!this.currentAttachedFile)
            break;
          this.currentAttachedFile.fileName = ar(e, s);
        }
        break;
      case C.FileMediaType:
        {
          if (!this.currentAttachedFile)
            break;
          this.currentAttachedFile.fileMediaType = Wt(e, s);
        }
        break;
      case C.FileData:
        {
          if (!this.currentAttachedFile)
            break;
          this.currentAttachedFile.fileData = z(e, s);
        }
        break;
      case C.FileDescription:
        {
          if (!this.currentAttachedFile)
            break;
          this.currentAttachedFile.fileDescription = ar(e, s);
        }
        break;
      case C.ContentEncodings:
        {
          if (!this.currentTrack)
            break;
          this.readContiguousElements(e.slice(a, s)), this.currentTrack.decodingInstructions.sort((o, c) => c.order - o.order);
        }
        break;
      case C.ContentEncoding:
        this.currentDecodingInstruction = {
          order: 0,
          scope: Zr.Block,
          data: null
        }, this.readContiguousElements(e.slice(a, s)), this.currentDecodingInstruction.data && this.currentTrack.decodingInstructions.push(this.currentDecodingInstruction), this.currentDecodingInstruction = null;
        break;
      case C.ContentEncodingOrder:
        {
          if (!this.currentDecodingInstruction)
            break;
          this.currentDecodingInstruction.order = q(e, s);
        }
        break;
      case C.ContentEncodingScope:
        {
          if (!this.currentDecodingInstruction)
            break;
          this.currentDecodingInstruction.scope = q(e, s);
        }
        break;
      case C.ContentCompression:
        {
          if (!this.currentDecodingInstruction)
            break;
          this.currentDecodingInstruction.data = {
            type: "decompress",
            algorithm: gr.Zlib,
            settings: null
          }, this.readContiguousElements(e.slice(a, s));
        }
        break;
      case C.ContentCompAlgo:
        {
          if (this.currentDecodingInstruction?.data?.type !== "decompress")
            break;
          this.currentDecodingInstruction.data.algorithm = q(e, s);
        }
        break;
      case C.ContentCompSettings:
        {
          if (this.currentDecodingInstruction?.data?.type !== "decompress")
            break;
          this.currentDecodingInstruction.data.settings = z(e, s);
        }
        break;
      case C.ContentEncryption:
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
            case gr.HeaderStripping:
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
class Ma {
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
    return wr(e * this.internalTrack.segment.timestampFactor);
  }
  async getPacket(e, t) {
    const i = this.intoTimescale(e);
    return this.performClusterLookup(null, (n) => {
      const s = n.trackData.get(this.internalTrack.id);
      if (!s)
        return { blockIndex: -1, correctBlockFound: !1 };
      const a = K(s.presentationTimestamps, i, (l) => l.timestamp), o = a !== -1 ? s.presentationTimestamps[a].blockIndex : -1, c = a !== -1 && i < s.endTimestamp;
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
      const a = hn(s.presentationTimestamps, (l) => s.blocks[l.blockIndex].isKeyFrame && l.timestamp <= i), o = a !== -1 ? s.presentationTimestamps[a].blockIndex : -1, c = a !== -1 && i < s.endTimestamp;
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
    g(s), s.decoded || (s.data = this.internalTrack.demuxer.decodeBlockData(this.internalTrack, s.data), s.decoded = !0);
    const a = i.metadataOnly ? xe : s.data, o = s.timestamp / this.internalTrack.segment.timestampFactor, c = s.duration / this.internalTrack.segment.timestampFactor, l = {};
    s.mainAdditional && this.internalTrack.info?.type === "video" && this.internalTrack.info.alphaMode && (l.alpha = i.metadataOnly ? xe : s.mainAdditional, l.alphaByteLength = s.mainAdditional.byteLength);
    const d = new Y(a, s.isKeyFrame ? "key" : "delta", o, c, e.dataStartPos + t, s.data.byteLength, l);
    return this.packetToClusterLocation.set(d, { cluster: e, blockIndex: t }), d;
  }
  /** Looks for a packet in the clusters while trying to load as few clusters as possible to retrieve it. */
  async performClusterLookup(e, t, i, n, s) {
    const { demuxer: a, segment: o } = this.internalTrack;
    let c = null, l = null, d = -1;
    if (e) {
      const { blockIndex: k, correctBlockFound: y } = t(e);
      if (y)
        return this.fetchPacketInCluster(e, k, s);
      k !== -1 && (l = e, d = k);
    }
    const u = K(this.internalTrack.cuePoints, i, (k) => k.time), f = u !== -1 ? this.internalTrack.cuePoints[u] : null, h = K(this.internalTrack.clusterPositionCache, i, (k) => k.startTimestamp), p = h !== -1 ? this.internalTrack.clusterPositionCache[h] : null, m = Math.max(f?.clusterPosition ?? 0, p?.elementStartPos ?? 0) || null;
    let b;
    for (e ? m === null || e.elementStartPos >= m ? (b = e.elementEndPos, c = e) : b = m : b = m ?? o.clusterSeekStartPos; o.elementEndPos === null || b <= o.elementEndPos - Ee; ) {
      if (c) {
        const P = c.trackData.get(this.internalTrack.id);
        if (P && P.startTimestamp > n)
          break;
      }
      let k = a.reader.requestSliceRange(b, Ee, Ze);
      if (k instanceof Promise && (k = await k), !k)
        break;
      const y = b, w = $e(k);
      if (!w || !Sr.includes(w.id) && w.id !== C.Void) {
        const P = await Fa(a.reader, y, Sr, Math.min(o.elementEndPos ?? 1 / 0, y + Ra));
        if (P) {
          b = P;
          continue;
        } else
          break;
      }
      const T = w.id;
      let A = w.size;
      const x = k.filePos;
      if (T === C.Cluster) {
        c = await a.readCluster(y, o), A = c.elementEndPos - x;
        const { blockIndex: P, correctBlockFound: S } = t(c);
        if (S)
          return this.fetchPacketInCluster(c, P, s);
        P !== -1 && (l = c, d = P);
      }
      A === void 0 && (g(T !== C.Cluster), A = (await Yi(a.reader, x, Vr, o.elementEndPos)).pos - x);
      const I = x + A;
      if (o.elementEndPos === null) {
        let P = a.reader.requestSliceRange(I, Ee, Ze);
        if (P instanceof Promise && (P = await P), !P)
          break;
        if (En(P) === C.Segment) {
          o.elementEndPos = I;
          break;
        }
      }
      b = I;
    }
    if (f && (!l || l.elementStartPos < f.clusterPosition)) {
      const k = this.internalTrack.cuePoints[u - 1];
      g(!k || k.time < f.time);
      const y = k?.time ?? -1 / 0;
      return this.performClusterLookup(null, t, y, n, s);
    }
    return l ? this.fetchPacketInCluster(l, d, s) : null;
  }
}
class zc extends Ma {
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
    return this.internalTrack.info.alphaMode;
  }
  async getDecoderConfig() {
    return this.internalTrack.info.codec ? this.decoderConfigPromise ??= (async () => {
      let e = null;
      (this.internalTrack.info.codec === "vp9" || this.internalTrack.info.codec === "av1" || this.internalTrack.info.codec === "avc" && !this.internalTrack.info.codecDescription || this.internalTrack.info.codec === "hevc" && !this.internalTrack.info.codecDescription) && (e = await this.getFirstPacket({}));
      const i = {
        codec: yn({
          width: this.internalTrack.info.width,
          height: this.internalTrack.info.height,
          codec: this.internalTrack.info.codec,
          codecDescription: this.internalTrack.info.codecDescription,
          colorSpace: this.internalTrack.info.colorSpace,
          avcType: 1,
          // We don't know better (or do we?) so just assume 'avc1'
          avcCodecInfo: this.internalTrack.info.codec === "avc" && e ? An(e.data) : null,
          hevcCodecInfo: this.internalTrack.info.codec === "hevc" && e ? xn(e.data) : null,
          vp9CodecInfo: this.internalTrack.info.codec === "vp9" && e ? fa(e.data) : null,
          av1CodecInfo: this.internalTrack.info.codec === "av1" && e ? ma(e.data) : null
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
class Dc extends Ma {
  constructor(e) {
    super(e), this.decoderConfig = null, this.internalTrack = e;
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
    return this.internalTrack.info.codec ? this.decoderConfig ??= {
      codec: bn({
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
const Zi = async (r, e, t) => {
  let n = e;
  for (; t === null || n < t; ) {
    const s = t !== null ? Math.min(65536, t - n) : 65536;
    let a = r.requestSliceRange(n, Et, s);
    if (a instanceof Promise && (a = await a), !a || a.length < Et)
      break;
    for (; a.remainingLength >= Et; ) {
      const o = a.filePos, c = v(a), l = r.fileSize !== null ? r.fileSize - n : null, d = wn(c, l);
      if (d.header)
        return { header: d.header, startPos: n };
      a.filePos = o + d.bytesAdvanced, n = a.filePos;
    }
  }
  return null;
};
class Oc extends at {
  constructor(e) {
    super(e), this.metadataPromise = null, this.firstFrameHeader = null, this.firstFrameHeaderPos = null, this.loadedSamples = [], this.metadataTags = null, this.xingData = null, this.trackBackings = [], this.readingMutex = new sr(), this.lastSampleLoaded = !1, this.lastLoadedPos = 0, this.nextTimestampInSamples = 0, this.reader = e._reader;
  }
  async readMetadata() {
    return this.metadataPromise ??= (async () => {
      for (; !this.firstFrameHeader && !this.lastSampleLoaded; )
        await this.advanceReader();
      if (!this.firstFrameHeader)
        throw new Error("No valid MP3 frame found.");
      this.trackBackings = [new Nc(this)];
    })();
  }
  async advanceReader() {
    if (this.lastLoadedPos === 0)
      for (; ; ) {
        let o = this.reader.requestSlice(this.lastLoadedPos, nt);
        if (o instanceof Promise && (o = await o), !o) {
          this.lastSampleLoaded = !0;
          return;
        }
        const c = Ft(o);
        if (!c)
          break;
        this.lastLoadedPos = o.filePos + c.size;
      }
    const e = await Zi(this.reader, this.lastLoadedPos, this.reader.fileSize);
    if (!e) {
      this.lastSampleLoaded = !0;
      return;
    }
    const t = e.header;
    this.lastLoadedPos = e.startPos + t.totalSize - 1;
    const i = sa(t.mpegVersionId, t.channel);
    let n = this.reader.requestSlice(e.startPos + i, 4);
    if (n instanceof Promise && (n = await n), n) {
      const o = v(n);
      if (o === ia || o === na) {
        if (!this.xingData) {
          let l = this.reader.requestSlice(e.startPos + i + 4, 12);
          if (l instanceof Promise && (l = await l), l) {
            const d = z(l, 12), u = Q(d), f = u.getUint32(0, !1);
            this.xingData = {
              frameCount: f & $r.FrameCount ? u.getUint32(4, !1) : null,
              fileSize: f & $r.FileSize ? u.getUint32(8, !1) : null
            };
          }
        }
        return;
      }
    }
    this.firstFrameHeader || (this.firstFrameHeader = t, this.firstFrameHeaderPos = e.startPos), t.sampleRate !== this.firstFrameHeader.sampleRate && console.warn(`MP3 changed sample rate mid-file: ${this.firstFrameHeader.sampleRate} Hz to ${t.sampleRate} Hz. Might be a bug, so please report this file.`);
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
        let n = this.reader.requestSlice(t, nt);
        if (n instanceof Promise && (n = await n), !n)
          break;
        const s = Ft(n);
        if (!s)
          break;
        i = !0;
        let a = this.reader.requestSlice(n.filePos, s.size);
        if (a instanceof Promise && (a = await a), !a)
          break;
        Rn(a, s, this.metadataTags), t = n.filePos + s.size;
      }
      if (!i && this.reader.fileSize !== null && this.reader.fileSize >= Wr) {
        let n = this.reader.requestSlice(this.reader.fileSize - Wr, Wr);
        n instanceof Promise && (n = await n), g(n), te(n, 3) === "TAG" && gu(n, this.metadataTags);
      }
      return this.metadataTags;
    } finally {
      e();
    }
  }
}
class Nc {
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
      const t = ic(e.firstFrameHeader.lowSamplingFrequency, e.firstFrameHeader.layer, e.firstFrameHeader.bitrate, e.firstFrameHeader.sampleRate), i = (e.reader.fileSize - e.firstFrameHeaderPos) / t;
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
    return de;
  }
  getCodec() {
    return "mp3";
  }
  getInternalCodecId() {
    return null;
  }
  getNumberOfChannels() {
    return g(this.demuxer.firstFrameHeader), this.demuxer.firstFrameHeader.channel === 3 ? 1 : 2;
  }
  getSampleRate() {
    return g(this.demuxer.firstFrameHeader), this.demuxer.firstFrameHeader.sampleRate;
  }
  getDisposition() {
    return {
      ...st
    };
  }
  async getDecoderConfig() {
    return g(this.demuxer.firstFrameHeader), {
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
    let n;
    if (t.metadataOnly)
      n = xe;
    else {
      let s = this.demuxer.reader.requestSlice(i.dataStart, i.dataSize);
      if (s instanceof Promise && (s = await s), !s)
        return null;
      n = z(s, i.dataSize);
    }
    return new Y(n, "key", i.timestamp, i.duration, e, i.dataSize);
  }
  getFirstPacket(e) {
    return this.getPacketAtIndex(0, e);
  }
  async getNextPacket(e, t) {
    const i = await this.demuxer.readingMutex.acquire();
    try {
      const n = Ir(this.demuxer.loadedSamples, e.timestamp, (a) => a.timestamp);
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
        const n = K(this.demuxer.loadedSamples, e, (s) => s.timestamp);
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
const za = 1399285583, Vc = 79764919, Da = new Uint32Array(256);
for (let r = 0; r < 256; r++) {
  let e = r << 24;
  for (let t = 0; t < 8; t++)
    e = e & 2147483648 ? e << 1 ^ Vc : e << 1;
  Da[r] = e >>> 0 & 4294967295;
}
const Uc = (r) => {
  const e = Q(r), t = e.getUint32(22, !0);
  e.setUint32(22, 0, !0);
  let i = 0;
  for (let n = 0; n < r.length; n++) {
    const s = r[n];
    i = (i << 8 ^ Da[i >>> 24 ^ s]) >>> 0;
  }
  return e.setUint32(22, t, !0), i;
}, Wc = (r, e, t) => {
  let i = 0, n = null;
  if (r.length > 0)
    if (e.codec === "vorbis") {
      g(e.vorbisInfo);
      const s = e.vorbisInfo.modeBlockflags.length, o = (1 << Fo(s - 1)) - 1 << 1, c = (r[0] & o) >> 1;
      if (c >= e.vorbisInfo.modeBlockflags.length)
        throw new Error("Invalid mode number.");
      let l = t;
      const d = e.vorbisInfo.modeBlockflags[c];
      if (n = e.vorbisInfo.blocksizes[d], d === 1) {
        const u = (o | 1) + 1, f = r[0] & u ? 1 : 0;
        l = e.vorbisInfo.blocksizes[f];
      }
      i = l !== null ? l + n >> 2 : 0;
    } else e.codec === "opus" && (i = kc(r).durationInSamples);
  return {
    durationInSamples: i,
    vorbisBlockSize: n
  };
}, Lc = (r) => {
  let e = "audio/ogg";
  if (r.codecStrings) {
    const t = [...new Set(r.codecStrings)];
    e += `; codecs="${t.join(", ")}"`;
  }
  return e;
};
const Ct = 27, Zt = 282, Hc = Zt + 65025, kr = (r) => {
  const e = r.filePos;
  if (Kt(r) !== za)
    return null;
  r.skip(1);
  const i = R(r), n = mu(r), s = Kt(r), a = Kt(r), o = Kt(r), c = R(r), l = new Uint8Array(c);
  for (let h = 0; h < c; h++)
    l[h] = R(r);
  const d = 27 + c, u = l.reduce((h, p) => h + p, 0), f = d + u;
  return {
    headerStartPos: e,
    totalSize: f,
    dataStartPos: e + d,
    dataSize: u,
    headerType: i,
    granulePosition: n,
    serialNumber: s,
    sequenceNumber: a,
    checksum: o,
    lacingValues: l
  };
}, qc = (r, e) => {
  for (; r.filePos < e - 3; ) {
    const t = Kt(r), i = t & 255, n = t >>> 8 & 255, s = t >>> 16 & 255, a = t >>> 24 & 255, o = 79;
    if (!(i !== o && n !== o && s !== o && a !== o)) {
      if (r.skip(-4), t === za)
        return !0;
      r.skip(1);
    }
  }
  return !1;
};
class Kc extends at {
  constructor(e) {
    super(e), this.metadataPromise = null, this.bitstreams = [], this.trackBackings = [], this.metadataTags = {}, this.reader = e._reader;
  }
  async readMetadata() {
    return this.metadataPromise ??= (async () => {
      let e = 0;
      for (; ; ) {
        let t = this.reader.requestSliceRange(e, Ct, Zt);
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
        ), t.codecInfo.codec !== null && this.trackBackings.push(new jc(t, this)));
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
    const a = [], o = (u) => {
      for (; a.push(Math.min(255, u)), !(u < 255); )
        u -= 255;
    };
    o(e.data.length), o(n.data.length);
    const c = new Uint8Array(1 + a.length + e.data.length + n.data.length + s.data.length);
    c[0] = 2, c.set(a, 1), c.set(e.data, 1 + a.length), c.set(n.data, 1 + a.length + e.data.length), c.set(s.data, 1 + a.length + e.data.length + n.data.length), t.codecInfo.codec = "vorbis", t.description = c, t.lastMetadataPacket = s;
    const l = Q(e.data);
    t.numberOfChannels = l.getUint8(11), t.sampleRate = l.getUint32(12, !0);
    const d = l.getUint8(28);
    t.codecInfo.vorbisInfo = {
      blocksizes: [
        1 << (d & 15),
        1 << (d >> 4)
      ],
      modeBlockflags: yc(s.data).modeBlockflags
    }, Gi(n.data.subarray(7), this.metadataTags);
  }
  async readOpusMetadata(e, t) {
    const i = await this.findNextPacketStart(e);
    if (!i)
      return;
    const n = await this.readPacket(i.startPage, i.startSegmentIndex);
    if (!n)
      return;
    t.codecInfo.codec = "opus", t.description = e.data, t.lastMetadataPacket = n;
    const s = pa(e.data);
    t.numberOfChannels = s.outputChannelCount, t.sampleRate = oi, t.codecInfo.opusInfo = {
      preSkip: s.preSkip
    }, Gi(n.data.subarray(8), this.metadataTags);
  }
  async readPacket(e, t) {
    g(t < e.lacingValues.length);
    let i = 0;
    for (let u = 0; u < t; u++)
      i += e.lacingValues[u];
    let n = e, s = i, a = t;
    const o = [];
    e: for (; ; ) {
      let u = this.reader.requestSlice(n.dataStartPos, n.dataSize);
      u instanceof Promise && (u = await u), g(u);
      const f = z(u, n.dataSize);
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
        let p = this.reader.requestSliceRange(h, Ct, Zt);
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
    const c = o.reduce((u, f) => u + f.length, 0);
    if (c === 0)
      return null;
    const l = new Uint8Array(c);
    let d = 0;
    for (let u = 0; u < o.length; u++) {
      const f = o[u];
      l.set(f, d), d += f.length;
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
      let n = this.reader.requestSliceRange(i, Ct, Zt);
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
    return Lc({
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
class jc {
  constructor(e, t) {
    this.bitstream = e, this.demuxer = t, this.encodedPacketToMetadata = /* @__PURE__ */ new WeakMap(), this.sequentialScanCache = [], this.sequentialScanMutex = new sr(), this.internalSampleRate = e.codecInfo.codec === "opus" ? oi : e.sampleRate;
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
    return de;
  }
  getDisposition() {
    return {
      ...st,
      primary: !1
    };
  }
  granulePositionToTimestampInSamples(e) {
    return this.bitstream.codecInfo.codec === "opus" ? (g(this.bitstream.codecInfo.opusInfo), e - this.bitstream.codecInfo.opusInfo.preSkip) : e;
  }
  createEncodedPacketFromOggPacket(e, t, i) {
    if (!e)
      return null;
    const { durationInSamples: n, vorbisBlockSize: s } = Wc(e.data, this.bitstream.codecInfo, t.vorbisLastBlocksize), a = new Y(i.metadataOnly ? xe : e.data, "key", Math.max(0, t.timestampInSamples) / this.internalSampleRate, n / this.internalSampleRate, e.endPage.headerStartPos + e.endSegmentIndex, e.data.byteLength);
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
    const i = wr(e * this.internalSampleRate);
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
      const y = s.headerStartPos, w = Math.floor((y + a) / 2);
      let T = w;
      for (; ; ) {
        const A = Math.min(T + Hc, a - Ct);
        let x = this.demuxer.reader.requestSlice(T, A - T);
        if (x instanceof Promise && (x = await x), g(x), !qc(x, A)) {
          a = w + Ct;
          continue e;
        }
        let P = this.demuxer.reader.requestSliceRange(x.filePos, Ct, Zt);
        P instanceof Promise && (P = await P), g(P);
        const S = kr(P);
        g(S);
        let E = !1;
        if (S.serialNumber === this.bitstream.serialNumber)
          E = !0;
        else {
          let B = this.demuxer.reader.requestSlice(S.headerStartPos, S.totalSize);
          B instanceof Promise && (B = await B), g(B);
          const O = z(B, S.totalSize);
          E = Uc(O) === S.checksum;
        }
        if (!E) {
          T = S.headerStartPos + 4;
          continue;
        }
        if (E && S.serialNumber !== this.bitstream.serialNumber) {
          T = S.headerStartPos + S.totalSize;
          continue;
        }
        if (S.granulePosition === -1) {
          T = S.headerStartPos + S.totalSize;
          continue;
        }
        this.granulePositionToTimestampInSamples(S.granulePosition) > i ? a = S.headerStartPos : (s = S, o.push(S));
        continue e;
      }
    }
    let c = n.startPage;
    for (const y of o) {
      if (y.granulePosition === s.granulePosition)
        break;
      (!c || y.headerStartPos > c.headerStartPos) && (c = y);
    }
    let l = c;
    const d = [l];
    for (; !(l.serialNumber === this.bitstream.serialNumber && l.granulePosition === s.granulePosition); ) {
      const y = l.headerStartPos + l.totalSize;
      let w = this.demuxer.reader.requestSliceRange(y, Ct, Zt);
      w instanceof Promise && (w = await w), g(w);
      const T = kr(w);
      g(T), l = T, l.serialNumber === this.bitstream.serialNumber && d.push(l);
    }
    g(l.granulePosition !== -1);
    let u = null, f, h, p = l, m = 0;
    if (l.headerStartPos === n.startPage.headerStartPos)
      f = this.granulePositionToTimestampInSamples(0), h = !0, u = 0;
    else {
      f = 0, h = !1;
      for (let T = l.lacingValues.length - 1; T >= 0; T--)
        if (l.lacingValues[T] < 255) {
          u = T + 1;
          break;
        }
      if (u === null)
        throw new Error("Invalid page with granule position: no packets end on this page.");
      m = u - 1;
      const y = {
        data: xe,
        endPage: p,
        endSegmentIndex: m
      };
      if (await this.demuxer.findNextPacketStart(y)) {
        const T = os(d, l, u);
        g(T);
        const A = as(d, T.page, T.segmentIndex);
        A && (l = A.page, u = A.segmentIndex);
      } else
        for (; ; ) {
          const T = os(d, l, u);
          if (!T)
            break;
          const A = as(d, T.page, T.segmentIndex);
          if (!A)
            break;
          if (l = A.page, u = A.segmentIndex, T.page.headerStartPos !== p.headerStartPos) {
            p = T.page, m = T.segmentIndex;
            break;
          }
        }
    }
    let b = null, k = null;
    for (; l !== null; ) {
      g(u !== null);
      const y = await this.demuxer.readPacket(l, u);
      if (!y)
        break;
      if (!(l.headerStartPos === n.startPage.headerStartPos && u < n.startSegmentIndex)) {
        let A = this.createEncodedPacketFromOggPacket(y, {
          timestampInSamples: f,
          vorbisLastBlocksize: k?.vorbisBlockSize ?? null
        }, t);
        g(A);
        let x = this.encodedPacketToMetadata.get(A);
        if (g(x), !h && y.endPage.headerStartPos === p.headerStartPos && y.endSegmentIndex === m ? (f = this.granulePositionToTimestampInSamples(l.granulePosition), h = !0, A = this.createEncodedPacketFromOggPacket(y, {
          timestampInSamples: f - x.durationInSamples,
          vorbisLastBlocksize: k?.vorbisBlockSize ?? null
        }, t), g(A), x = this.encodedPacketToMetadata.get(A), g(x)) : f += x.durationInSamples, b = A, k = x, h && // Next timestamp will be too late
        (Math.max(f, 0) > i || Math.max(x.timestampInSamples, 0) === i))
          break;
      }
      const T = await this.demuxer.findNextPacketStart(y);
      if (!T)
        break;
      l = T.startPage, u = T.startSegmentIndex;
    }
    return b;
  }
  // A slower but simpler and sequential algorithm for finding a packet in a file
  async getPacketSequential(e, t) {
    const i = await this.sequentialScanMutex.acquire();
    try {
      const n = wr(e * this.internalSampleRate);
      e = n / this.internalSampleRate;
      const s = K(this.sequentialScanCache, n, (c) => c.timestampInSamples);
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
          g(l), this.sequentialScanCache.length > 0 && g(ee(this.sequentialScanCache).timestampInSamples <= l.timestampInSamples), this.sequentialScanCache.push(l);
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
const as = (r, e, t) => {
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
    const a = $s(r, (o) => o.headerStartPos < i.headerStartPos);
    if (!a)
      return null;
    i = a, n = i.lacingValues.length;
  }
  if (g(n !== -1), n === i.lacingValues.length) {
    const s = r[r.indexOf(i) + 1];
    g(s), i = s, n = 0;
  }
  return { page: i, segmentIndex: n };
}, os = (r, e, t) => {
  if (t > 0)
    return { page: e, segmentIndex: t - 1 };
  const i = $s(r, (n) => n.headerStartPos < e.headerStartPos);
  return i ? { page: i, segmentIndex: i.lacingValues.length - 1 } : null;
};
var Xe;
(function(r) {
  r[r.PCM = 1] = "PCM", r[r.IEEE_FLOAT = 3] = "IEEE_FLOAT", r[r.ALAW = 6] = "ALAW", r[r.MULAW = 7] = "MULAW", r[r.EXTENSIBLE = 65534] = "EXTENSIBLE";
})(Xe || (Xe = {}));
class Qc extends at {
  constructor(e) {
    super(e), this.metadataPromise = null, this.dataStart = -1, this.dataSize = -1, this.audioInfo = null, this.trackBackings = [], this.lastKnownPacketIndex = 0, this.metadataTags = {}, this.reader = e._reader;
  }
  async readMetadata() {
    return this.metadataPromise ??= (async () => {
      let e = this.reader.requestSlice(0, 12);
      e instanceof Promise && (e = await e), g(e);
      const t = te(e, 4), i = t !== "RIFX", n = t === "RF64", s = pt(e, i);
      let a = n ? this.reader.fileSize : Math.min(s + 8, this.reader.fileSize ?? 1 / 0);
      if (te(e, 4) !== "WAVE")
        throw new Error("Invalid WAVE file - wrong format");
      let c = 0, l = null, d = e.filePos;
      for (; a === null || d < a; ) {
        let f = this.reader.requestSlice(d, 8);
        if (f instanceof Promise && (f = await f), !f)
          break;
        const h = te(f, 4), p = pt(f, i), m = f.filePos;
        if (n && c === 0 && h !== "ds64")
          throw new Error('Invalid RF64 file: First chunk must be "ds64".');
        if (h === "fmt ")
          await this.parseFmtChunk(m, p, i);
        else if (h === "data") {
          if (l ??= p, this.dataStart = f.filePos, this.dataSize = Math.min(l, (a ?? 1 / 0) - this.dataStart), this.reader.fileSize === null)
            break;
        } else if (h === "ds64") {
          let b = this.reader.requestSlice(m, p);
          if (b instanceof Promise && (b = await b), !b)
            break;
          const k = Ns(b, i);
          l = Ns(b, i), a = Math.min(k + 8, this.reader.fileSize ?? 1 / 0);
        } else h === "LIST" ? await this.parseListChunk(m, p, i) : (h === "ID3 " || h === "id3 ") && await this.parseId3Chunk(m, p);
        d = m + p + (p & 1), c++;
      }
      if (!this.audioInfo)
        throw new Error('Invalid WAVE file - missing "fmt " chunk');
      if (this.dataStart === -1)
        throw new Error('Invalid WAVE file - missing "data" chunk');
      const u = this.audioInfo.blockSizeInBytes;
      this.dataSize = Math.floor(this.dataSize / u) * u, this.trackBackings.push(new Gc(this));
    })();
  }
  async parseFmtChunk(e, t, i) {
    let n = this.reader.requestSlice(e, t);
    if (n instanceof Promise && (n = await n), !n)
      return;
    let s = ur(n, i);
    const a = ur(n, i), o = pt(n, i);
    n.skip(4);
    const c = ur(n, i);
    let l;
    if (t === 14 ? l = 8 : l = ur(n, i), t >= 18 && s !== 357) {
      const d = ur(n, i), u = t - 18;
      if (Math.min(u, d) >= 22 && s === Xe.EXTENSIBLE) {
        n.skip(6);
        const h = z(n, 16);
        s = h[0] | h[1] << 8;
      }
    }
    (s === Xe.MULAW || s === Xe.ALAW) && (l = 8), this.audioInfo = {
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
    const s = te(n, 4);
    if (s !== "INFO" && s !== "INF0")
      return;
    let a = n.filePos;
    for (; a <= e + t - 8; ) {
      n.filePos = a;
      const o = te(n, 4), c = pt(n, i), l = z(n, c);
      let d = 0;
      for (let f = 0; f < l.length && l[f] !== 0; f++)
        d++;
      const u = String.fromCharCode(...l.subarray(0, d));
      switch (this.metadataTags.raw ??= {}, this.metadataTags.raw[o] = u, o) {
        case "INAM":
        case "TITL":
          this.metadataTags.title ??= u;
          break;
        case "TIT3":
          this.metadataTags.description ??= u;
          break;
        case "IART":
          this.metadataTags.artist ??= u;
          break;
        case "IPRD":
          this.metadataTags.album ??= u;
          break;
        case "IPRT":
        case "ITRK":
        case "TRCK":
          {
            const f = u.split("/"), h = Number.parseInt(f[0], 10), p = f[1] && Number.parseInt(f[1], 10);
            Number.isInteger(h) && h > 0 && (this.metadataTags.trackNumber ??= h), p && Number.isInteger(p) && p > 0 && (this.metadataTags.tracksTotal ??= p);
          }
          break;
        case "ICRD":
        case "IDIT":
          {
            const f = new Date(u);
            Number.isNaN(f.getTime()) || (this.metadataTags.date ??= f);
          }
          break;
        case "YEAR":
          {
            const f = Number.parseInt(u, 10);
            Number.isInteger(f) && f > 0 && (this.metadataTags.date ??= new Date(f, 0, 1));
          }
          break;
        case "IGNR":
        case "GENR":
          this.metadataTags.genre ??= u;
          break;
        case "ICMT":
        case "CMNT":
        case "COMM":
          this.metadataTags.comment ??= u;
          break;
      }
      a += 8 + c + (c & 1);
    }
  }
  async parseId3Chunk(e, t) {
    let i = this.reader.requestSlice(e, t);
    if (i instanceof Promise && (i = await i), !i)
      return;
    const n = Ft(i);
    if (n) {
      const s = t - nt;
      if (n.size = Math.min(n.size, s), n.size > 0) {
        const a = i.slice(e + nt, n.size);
        Rn(a, n, this.metadataTags);
      }
    }
  }
  getCodec() {
    if (g(this.audioInfo), this.audioInfo.format === Xe.MULAW)
      return "ulaw";
    if (this.audioInfo.format === Xe.ALAW)
      return "alaw";
    if (this.audioInfo.format === Xe.PCM) {
      if (this.audioInfo.sampleSizeInBytes === 1)
        return "pcm-u8";
      if (this.audioInfo.sampleSizeInBytes === 2)
        return "pcm-s16";
      if (this.audioInfo.sampleSizeInBytes === 3)
        return "pcm-s24";
      if (this.audioInfo.sampleSizeInBytes === 4)
        return "pcm-s32";
    }
    return this.audioInfo.format === Xe.IEEE_FLOAT && this.audioInfo.sampleSizeInBytes === 4 ? "pcm-f32" : null;
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
const Mt = 2048;
class Gc {
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
    return de;
  }
  getDisposition() {
    return {
      ...st
    };
  }
  async getPacketAtIndex(e, t) {
    g(e >= 0), g(this.demuxer.audioInfo);
    const i = e * Mt * this.demuxer.audioInfo.blockSizeInBytes;
    if (i >= this.demuxer.dataSize)
      return null;
    const n = Math.min(Mt * this.demuxer.audioInfo.blockSizeInBytes, this.demuxer.dataSize - i);
    if (this.demuxer.reader.fileSize === null) {
      let c = this.demuxer.reader.requestSlice(this.demuxer.dataStart + i, n);
      if (c instanceof Promise && (c = await c), !c)
        return null;
    }
    let s;
    if (t.metadataOnly)
      s = xe;
    else {
      let c = this.demuxer.reader.requestSlice(this.demuxer.dataStart + i, n);
      c instanceof Promise && (c = await c), g(c), s = z(c, n);
    }
    const a = e * Mt / this.demuxer.audioInfo.sampleRate, o = n / this.demuxer.audioInfo.blockSizeInBytes / this.demuxer.audioInfo.sampleRate;
    return this.demuxer.lastKnownPacketIndex = Math.max(e, this.demuxer.lastKnownPacketIndex), new Y(s, "key", a, o, e, n);
  }
  getFirstPacket(e) {
    return this.getPacketAtIndex(0, e);
  }
  async getPacket(e, t) {
    g(this.demuxer.audioInfo);
    const i = Math.floor(Math.min(e * this.demuxer.audioInfo.sampleRate / Mt, (this.demuxer.dataSize - 1) / (Mt * this.demuxer.audioInfo.blockSizeInBytes)));
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
    const i = Math.round(e.timestamp * this.demuxer.audioInfo.sampleRate / Mt);
    return this.getPacketAtIndex(i + 1, t);
  }
  getKeyPacket(e, t) {
    return this.getPacket(e, t);
  }
  getNextKeyPacket(e, t) {
    return this.getNextPacket(e, t);
  }
}
const Jr = 7, _t = 9, Bt = (r) => {
  const e = r.filePos, t = z(r, 9), i = new G(t);
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
  const d = i.readBits(13);
  i.skipBits(11);
  const u = i.readBits(2) + 1;
  if (u !== 1)
    throw new Error("ADTS frames with more than one AAC frame are not supported.");
  let f = null;
  return a === 1 ? r.filePos -= 2 : f = i.readBits(16), {
    objectType: o,
    samplingFrequencyIndex: c,
    channelConfiguration: l,
    frameLength: d,
    numberOfAacFrames: u,
    crcCheck: f,
    startPos: e
  };
};
const ei = 1024;
class Xc extends at {
  constructor(e) {
    super(e), this.metadataPromise = null, this.firstFrameHeader = null, this.loadedSamples = [], this.metadataTags = null, this.trackBackings = [], this.readingMutex = new sr(), this.lastSampleLoaded = !1, this.lastLoadedPos = 0, this.nextTimestampInSamples = 0, this.reader = e._reader;
  }
  async readMetadata() {
    return this.metadataPromise ??= (async () => {
      for (; !this.firstFrameHeader && !this.lastSampleLoaded; )
        await this.advanceReader();
      g(this.firstFrameHeader), this.trackBackings = [new $c(this)];
    })();
  }
  async advanceReader() {
    if (this.lastLoadedPos === 0)
      for (; ; ) {
        let a = this.reader.requestSlice(this.lastLoadedPos, nt);
        if (a instanceof Promise && (a = await a), !a) {
          this.lastSampleLoaded = !0;
          return;
        }
        const o = Ft(a);
        if (!o)
          break;
        this.lastLoadedPos = a.filePos + o.size;
      }
    let e = this.reader.requestSliceRange(this.lastLoadedPos, Jr, _t);
    if (e instanceof Promise && (e = await e), !e) {
      this.lastSampleLoaded = !0;
      return;
    }
    const t = Bt(e);
    if (!t) {
      this.lastSampleLoaded = !0;
      return;
    }
    if (this.reader.fileSize !== null && t.startPos + t.frameLength > this.reader.fileSize) {
      this.lastSampleLoaded = !0;
      return;
    }
    this.firstFrameHeader || (this.firstFrameHeader = t);
    const i = vt[t.samplingFrequencyIndex];
    g(i !== void 0);
    const n = ei / i, s = {
      timestamp: this.nextTimestampInSamples / i,
      duration: n,
      dataStart: t.startPos,
      dataSize: t.frameLength
    };
    this.loadedSamples.push(s), this.nextTimestampInSamples += ei, this.lastLoadedPos = t.startPos + t.frameLength;
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
        let i = this.reader.requestSlice(t, nt);
        if (i instanceof Promise && (i = await i), !i)
          break;
        const n = Ft(i);
        if (!n)
          break;
        let s = this.reader.requestSlice(i.filePos, n.size);
        if (s instanceof Promise && (s = await s), !s)
          break;
        Rn(s, n, this.metadataTags), t = i.filePos + n.size;
      }
      return this.metadataTags;
    } finally {
      e();
    }
  }
}
class $c {
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
    return this.getSampleRate() / ei;
  }
  isRelativeToUnixEpoch() {
    return !1;
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
    return de;
  }
  getCodec() {
    return "aac";
  }
  getInternalCodecId() {
    return g(this.demuxer.firstFrameHeader), this.demuxer.firstFrameHeader.objectType;
  }
  getNumberOfChannels() {
    g(this.demuxer.firstFrameHeader);
    const e = Er[this.demuxer.firstFrameHeader.channelConfiguration];
    return g(e !== void 0), e;
  }
  getSampleRate() {
    g(this.demuxer.firstFrameHeader);
    const e = vt[this.demuxer.firstFrameHeader.samplingFrequencyIndex];
    return g(e !== void 0), e;
  }
  getDisposition() {
    return {
      ...st
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
      n = xe;
    else {
      let s = this.demuxer.reader.requestSlice(i.dataStart, i.dataSize);
      if (s instanceof Promise && (s = await s), !s)
        return null;
      n = z(s, i.dataSize);
    }
    return new Y(n, "key", i.timestamp, i.duration, e, i.dataSize);
  }
  getFirstPacket(e) {
    return this.getPacketAtIndex(0, e);
  }
  async getNextPacket(e, t) {
    const i = await this.demuxer.readingMutex.acquire();
    try {
      const n = Ir(this.demuxer.loadedSamples, e.timestamp, (a) => a.timestamp);
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
        const n = K(this.demuxer.loadedSamples, e, (s) => s.timestamp);
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
const Yc = (r) => r === 0 ? null : r === 1 ? 192 : r >= 2 && r <= 5 ? 144 * 2 ** r : r === 6 ? "uncommon-u8" : r === 7 ? "uncommon-u16" : r >= 8 && r <= 15 ? 2 ** r : null, Zc = (r, e) => {
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
}, Jc = (r) => {
  let e = 0;
  const t = new G(z(r, 1));
  for (; t.readBits(1) === 1; )
    e++;
  if (e === 0)
    return t.readBits(7);
  const i = [], n = e - 1, s = new G(z(r, n)), a = 8 - e - 1;
  for (let c = 0; c < a; c++)
    i.unshift(t.readBits(1));
  for (let c = 0; c < n; c++)
    for (let l = 0; l < 8; l++) {
      const d = s.readBits(1);
      l < 2 || i.unshift(d);
    }
  return i.reduce((c, l, d) => c | l << d, 0);
}, el = (r, e) => {
  if (e === "uncommon-u16")
    return ne(r) + 1;
  if (e === "uncommon-u8")
    return R(r) + 1;
  if (typeof e == "number")
    return e;
  rt(e), g(!1);
}, tl = (r, e) => e === "uncommon-u16" ? ne(r) : e === "uncommon-u16-10" ? ne(r) * 10 : e === "uncommon-u8" ? R(r) : typeof e == "number" ? e : null, rl = (r) => {
  let t = 0;
  for (const i of r) {
    t ^= i;
    for (let n = 0; n < 8; n++)
      (t & 128) !== 0 ? t = t << 1 ^ 7 : t <<= 1, t &= 255;
  }
  return t;
};
class il extends at {
  constructor(e) {
    super(e), this.loadedSamples = [], this.metadataPromise = null, this.trackBacking = null, this.metadataTags = {}, this.audioInfo = null, this.lastLoadedPos = null, this.blockingBit = null, this.readingMutex = new sr(), this.lastSampleLoaded = !1, this.reader = e._reader;
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
    let e = 4;
    return this.metadataPromise ??= (async () => {
      for (; this.reader.fileSize === null || e < this.reader.fileSize; ) {
        let t = this.reader.requestSlice(e, 4);
        if (t instanceof Promise && (t = await t), e += 4, t === null)
          throw new Error(`Metadata block at position ${e} is too small! Corrupted file.`);
        g(t);
        const i = R(t), n = Qe(t), s = (i & 128) !== 0;
        switch (i & 127) {
          case Yt.STREAMINFO: {
            let o = this.reader.requestSlice(e, n);
            if (o instanceof Promise && (o = await o), g(o), o === null)
              throw new Error(`StreamInfo block at position ${e} is too small! Corrupted file.`);
            const c = z(o, 34), l = new G(c), d = l.readBits(16), u = l.readBits(16), f = l.readBits(24), h = l.readBits(24), p = l.readBits(20), m = l.readBits(3) + 1;
            l.readBits(5);
            const b = l.readBits(36);
            l.skipBits(128);
            const k = new Uint8Array(42);
            k.set(new Uint8Array([102, 76, 97, 67]), 0), k.set(new Uint8Array([128, 0, 0, 34]), 4), k.set(c, 8), this.audioInfo = {
              numberOfChannels: m,
              sampleRate: p,
              totalSamples: b,
              minimumBlockSize: d,
              maximumBlockSize: u,
              minimumFrameSize: f,
              maximumFrameSize: h,
              description: k
            }, this.trackBacking = new nl(this);
            break;
          }
          case Yt.VORBIS_COMMENT: {
            let o = this.reader.requestSlice(e, n);
            o instanceof Promise && (o = await o), g(o), Gi(z(o, n), this.metadataTags);
            break;
          }
          case Yt.PICTURE: {
            let o = this.reader.requestSlice(e, n);
            o instanceof Promise && (o = await o), g(o);
            const c = v(o), l = v(o), d = Te.decode(z(o, l)), u = v(o), f = Te.decode(z(o, u));
            o.skip(16);
            const h = v(o), p = z(o, h);
            this.metadataTags.images ??= [], this.metadataTags.images.push({
              data: p,
              mimeType: d,
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
    const i = 6, n = 16, s = 10, a = this.audioInfo.maximumBlockSize * this.audioInfo.numberOfChannels * 4 + n + 2, o = this.audioInfo.minimumFrameSize || s, l = (this.audioInfo.maximumFrameSize || a) + n, d = await this.reader.requestSliceRange(e, n, l);
    if (!d)
      return null;
    const u = this.readFlacFrameHeader({
      slice: d,
      isFirstPacket: t
    });
    if (!u)
      return null;
    for (d.filePos = e + o; ; ) {
      if (d.filePos > d.end - i)
        return {
          num: u.num,
          blockSize: u.blockSize,
          sampleRate: u.sampleRate,
          size: d.end - e,
          isLastFrame: !0
        };
      if (R(d) === 255) {
        const h = d.filePos, p = R(d), m = this.blockingBit === 1 ? 249 : 248;
        if (p !== m) {
          d.filePos = h;
          continue;
        }
        d.skip(-2);
        const b = d.filePos - e, k = this.readFlacFrameHeader({
          slice: d,
          isFirstPacket: !1
        });
        if (!k) {
          d.filePos = h;
          continue;
        }
        if (this.blockingBit === 0) {
          if (k.num - u.num !== 1) {
            d.filePos = h;
            continue;
          }
        } else if (k.num - u.num !== u.blockSize) {
          d.filePos = h;
          continue;
        }
        return {
          num: u.num,
          blockSize: u.blockSize,
          sampleRate: u.sampleRate,
          size: b,
          isLastFrame: !1
        };
      }
    }
  }
  readFlacFrameHeader({ slice: e, isFirstPacket: t }) {
    const i = e.filePos, n = z(e, 4), s = new G(n);
    if (s.readBits(15) !== 32764)
      return null;
    if (this.blockingBit === null) {
      g(t);
      const b = s.readBits(1);
      this.blockingBit = b;
    } else if (this.blockingBit === 1) {
      if (g(!t), s.readBits(1) !== 1)
        return null;
    } else if (this.blockingBit === 0) {
      if (g(!t), s.readBits(1) !== 0)
        return null;
    } else
      throw new Error("Invalid blocking bit");
    const o = Yc(s.readBits(4));
    if (!o)
      return null;
    g(this.audioInfo);
    const c = Zc(s.readBits(4), this.audioInfo.sampleRate);
    if (!c || (s.readBits(4), s.readBits(3), s.readBits(1) !== 0))
      return null;
    const d = Jc(e), u = el(e, o), f = tl(e, c);
    if (f === null || f !== this.audioInfo.sampleRate)
      return null;
    const h = e.filePos - i, p = R(e);
    e.skip(-h), e.skip(-1);
    const m = rl(z(e, h));
    return p !== m ? null : { num: d, blockSize: u, sampleRate: f };
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
class nl {
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
    return de;
  }
  getTimeResolution() {
    return g(this.demuxer.audioInfo), this.demuxer.audioInfo.sampleRate;
  }
  isRelativeToUnixEpoch() {
    return !1;
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
      ...st
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
      throw new Error("Timestamp cannot be negative");
    const i = await this.demuxer.readingMutex.acquire();
    try {
      for (; ; ) {
        const n = K(this.demuxer.loadedSamples, e, (c) => c.blockOffset / this.demuxer.audioInfo.sampleRate);
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
      n = xe;
    else {
      let o = this.demuxer.reader.requestSlice(i.byteOffset, i.byteSize);
      if (o instanceof Promise && (o = await o), !o)
        return null;
      n = z(o, i.byteSize);
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
const Je = 9e4, ye = 188, sl = (r) => {
  let e = "video/MP2T";
  const t = [...new Set(r.filter(Boolean))];
  return t.length > 0 && (e += `; codecs="${t.join(", ")}"`), e;
};
const Oa = "PES packet is missing PTS where it was expected. PES packets without PTS are not currently supported. If you think this file should be supported, please report it.", cs = /* @__PURE__ */ new Set();
class al extends at {
  constructor(e) {
    super(e), this.metadataPromise = null, this.elementaryStreams = [], this.trackBackingEntries = [], this.packetOffset = 0, this.packetStride = -1, this.sectionEndPositions = [], this.seekChunkSize = 5 * 1024 * 1024, this.minReferencePointByteDistance = -1, this.reader = e._reader;
  }
  async readMetadata() {
    return this.metadataPromise ??= (async () => {
      const e = ye + 16 + 1;
      let t = this.reader.requestSlice(0, e);
      t instanceof Promise && (t = await t), g(t);
      const i = z(t, e);
      if (i[0] === 71 && i[ye] === 71)
        this.packetOffset = 0, this.packetStride = ye;
      else if (i[0] === 71 && i[ye + 16] === 71)
        this.packetOffset = 0, this.packetStride = ye + 16;
      else if (i[4] === 71 && i[4 + ye + 4] === 71)
        this.packetOffset = 4, this.packetStride = ye + 4;
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
        const d = await this.readSection(s, !0, !c);
        if (!d)
          break;
        const u = 3, f = 32;
        let h = !1;
        if (!c && d.pid !== 0 && !(d.payload[0] === 0 && d.payload[1] === 0 && d.payload[2] === 1)) {
          const b = new G(d.payload), k = b.readAlignedByte();
          b.skipBits(8 * k), h = b.readBits(8) === 2;
        }
        if (d.pid === 0 && !o) {
          const m = new G(d.payload), b = m.readAlignedByte();
          m.skipBits(8 * b), m.skipBits(14);
          const k = m.readBits(10);
          for (m.skipBits(40); 8 * (k + u) - m.pos > f; ) {
            const y = m.readBits(16);
            m.skipBits(3);
            const w = m.readBits(13);
            if (y !== 0) {
              if (a !== null)
                throw new Error("Only files with a single program are supported.");
              a = w;
            }
          }
          if (a === null)
            throw new Error("Program Association Table must link to a Program Map Table.");
          o = !0;
        } else if ((d.pid === a || h) && !c) {
          const m = new G(d.payload), b = m.readAlignedByte();
          m.skipBits(8 * b), m.skipBits(12);
          const k = m.readBits(12);
          m.skipBits(43), m.readBits(13), m.skipBits(6);
          const y = m.readBits(10);
          for (m.skipBits(8 * y); 8 * (k + u) - m.pos > f; ) {
            const w = m.readBits(8);
            m.skipBits(3);
            const T = m.readBits(13);
            m.skipBits(6);
            const A = m.readBits(10), x = m.pos + 8 * A;
            let I = !1, P = !1;
            for (; m.pos < x; ) {
              const E = m.readBits(8), D = m.readBits(8);
              E === 106 ? I = !0 : (E === 122 || E === 204) && (P = !0), m.skipBits(8 * D);
            }
            let S = null;
            switch (w) {
              case 27:
              case 36:
                S = {
                  type: "video",
                  codec: w === 27 ? "avc" : "hevc",
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
                {
                  let E;
                  if (w === 3 || w === 4)
                    E = "mp3";
                  else if (w === 15)
                    E = "aac";
                  else if (w === 129)
                    E = "ac3";
                  else if (w === 135)
                    E = "eac3";
                  else
                    throw new Error("Unreachable.");
                  S = {
                    type: "audio",
                    codec: E,
                    decoderConfig: null,
                    aacCodecInfo: null,
                    numberOfChannels: -1,
                    sampleRate: -1
                  };
                }
                break;
              case 6:
                P ? S = {
                  type: "audio",
                  codec: "eac3",
                  decoderConfig: null,
                  aacCodecInfo: null,
                  numberOfChannels: -1,
                  sampleRate: -1
                } : I && (S = {
                  type: "audio",
                  codec: "ac3",
                  decoderConfig: null,
                  aacCodecInfo: null,
                  numberOfChannels: -1,
                  sampleRate: -1
                });
                break;
              default:
                cs.has(w) || (console.warn(`Note: MPEG-TS streams with stream_type 0x${w.toString(16)} are not currently supported.`), cs.add(w));
            }
            S && this.elementaryStreams.push({
              demuxer: this,
              pid: T,
              streamType: w,
              initialized: !1,
              firstSection: null,
              canBeTrustedWithKeyPackets: !1,
              info: S,
              referencePesPackets: []
            });
          }
          c = !0;
        } else {
          const m = this.elementaryStreams.find((b) => b.pid === d.pid);
          e: if (m && !m.initialized) {
            const b = Ht(d, !0);
            if (!b)
              throw new Error(`Couldn't read first PES packet for Elementary Stream with PID ${m.pid}`);
            if (m.firstSection = d, m.canBeTrustedWithKeyPackets = d.randomAccessIndicator === 1, this.input._initInput) {
              const w = (await this.input._initInput._getDemuxer()).elementaryStreams.find((T) => T.pid === d.pid && T.info.codec === m.info.codec);
              if (w) {
                m.info = w.info, m.initialized = !0;
                break e;
              }
            }
            const k = new mr(m, b);
            if (m.info.type === "video") {
              for (; ; ) {
                const y = k;
                if (y.suppliedPacket = null, await k.markNextPacket(), m.info.codec === "avc") {
                  if (!k.suppliedPacket)
                    throw new Error("Invalid AVC video stream; could not extract AVCDecoderConfigurationRecord from any packet.");
                  if (m.info.avcCodecInfo = An(k.suppliedPacket.data), !m.info.avcCodecInfo)
                    continue;
                  const w = m.info.avcCodecInfo.sequenceParameterSets[0];
                  g(w);
                  const T = Sn(w);
                  m.info.width = T.displayWidth, m.info.height = T.displayHeight;
                  const A = T.pixelAspectRatio.num, x = T.pixelAspectRatio.den;
                  A > 0 && x > 0 && (A > x ? (m.info.squarePixelWidth = Math.round(m.info.width * A / x), m.info.squarePixelHeight = m.info.height) : (m.info.squarePixelWidth = m.info.width, m.info.squarePixelHeight = Math.round(m.info.height * x / A))), m.info.colorSpace = {
                    primaries: Hr[T.colourPrimaries],
                    transfer: qr[T.transferCharacteristics],
                    matrix: Kr[T.matrixCoefficients],
                    fullRange: !!T.fullRangeFlag
                  }, m.info.reorderSize = T.maxDecFrameBuffering;
                  break;
                } else if (m.info.codec === "hevc") {
                  if (!k.suppliedPacket)
                    throw new Error("Invalid HEVC video stream; could not extract HVCDecoderConfigurationRecord from first packet.");
                  if (m.info.hevcCodecInfo = xn(k.suppliedPacket.data), !m.info.hevcCodecInfo)
                    continue;
                  const T = m.info.hevcCodecInfo.arrays.find((x) => x.nalUnitType === ue.SPS_NUT).nalUnits[0];
                  g(T);
                  const A = da(T);
                  m.info.width = A.displayWidth, m.info.height = A.displayHeight, A.pixelAspectRatio.num > A.pixelAspectRatio.den ? (m.info.squarePixelWidth = Math.round(m.info.width * A.pixelAspectRatio.num / A.pixelAspectRatio.den), m.info.squarePixelHeight = m.info.height) : (m.info.squarePixelWidth = m.info.width, m.info.squarePixelHeight = Math.round(m.info.height * A.pixelAspectRatio.den / A.pixelAspectRatio.num)), m.info.colorSpace = {
                    primaries: Hr[A.colourPrimaries],
                    transfer: qr[A.transferCharacteristics],
                    matrix: Kr[A.matrixCoefficients],
                    fullRange: !!A.fullRangeFlag
                  }, m.info.reorderSize = A.maxDecFrameBuffering;
                  break;
                } else
                  throw new Error("Unhandled.");
              }
              m.info.decoderConfig = {
                codec: yn({
                  width: m.info.width,
                  height: m.info.height,
                  codec: m.info.codec,
                  codecDescription: null,
                  colorSpace: m.info.colorSpace,
                  avcType: 1,
                  avcCodecInfo: m.info.avcCodecInfo,
                  hevcCodecInfo: m.info.hevcCodecInfo,
                  vp9CodecInfo: null,
                  av1CodecInfo: null
                }),
                codedWidth: m.info.width,
                codedHeight: m.info.height,
                colorSpace: m.info.colorSpace
              }, (m.info.width !== m.info.squarePixelWidth || m.info.height !== m.info.squarePixelHeight) && (m.info.decoderConfig.displayAspectWidth = m.info.squarePixelWidth, m.info.decoderConfig.displayAspectHeight = m.info.squarePixelHeight), m.initialized = !0;
            } else {
              if (await k.markNextPacket(), !k.suppliedPacket)
                throw new Error(`Couldn't parse first media packet for Elementary Stream with PID ${m.pid}`);
              if (m.info.codec === "aac") {
                const y = we.tempFromBytes(k.suppliedPacket.data), w = Bt(y);
                if (!w)
                  throw new Error("Invalid AAC audio stream; could not read ADTS frame header from first packet.");
                m.info.aacCodecInfo = {
                  isMpeg2: !1,
                  objectType: w.objectType
                }, m.info.numberOfChannels = Er[w.channelConfiguration], m.info.sampleRate = vt[w.samplingFrequencyIndex];
              } else if (m.info.codec === "mp3") {
                const y = v(we.tempFromBytes(k.suppliedPacket.data)), w = wn(y, k.suppliedPacket.data.byteLength);
                if (!w.header)
                  throw new Error("Invalid MP3 audio stream; could not read frame header from first packet.");
                m.info.numberOfChannels = w.header.channel === 3 ? 1 : 2, m.info.sampleRate = w.header.sampleRate;
              } else if (m.info.codec === "ac3") {
                const y = ga(k.suppliedPacket.data);
                if (!y)
                  throw new Error("Invalid AC-3 audio stream; could not read sync frame from first packet.");
                if (y.fscod === 3)
                  throw new Error("Invalid AC-3 audio stream; reserved sample rate code found in first packet.");
                m.info.numberOfChannels = Cn[y.acmod] + y.lfeon, m.info.sampleRate = ci[y.fscod];
              } else if (m.info.codec === "eac3") {
                const y = ya(k.suppliedPacket.data);
                if (!y)
                  throw new Error("Invalid E-AC-3 audio stream; could not read sync frame from first packet.");
                const w = ba(y);
                if (w === null)
                  throw new Error("Invalid E-AC-3 audio stream; reserved sample rate code found in first packet.");
                m.info.numberOfChannels = wa(y), m.info.sampleRate = w;
              } else
                throw new Error("Unhandled.");
              m.info.decoderConfig = {
                codec: bn({
                  codec: m.info.codec,
                  codecDescription: null,
                  aacCodecInfo: m.info.aacCodecInfo
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
        l.info.type === "video" ? this.trackBackingEntries.push(new ol(l)) : this.trackBackingEntries.push(new cl(l));
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
    return sl(e);
  }
  async readSection(e, t, i = !1) {
    let n = e, s = e;
    const a = [];
    let o = 0, c = null, l = !0, d = 0;
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
      if (h && (m = 1 + f.body[0], f === c && m > 1 && (d = f.body[1] >> 6 & 1)), p && (m === 0 ? (a.push(f.body), o += f.body.byteLength) : (a.push(f.body.subarray(m)), o += f.body.byteLength - m)), n = s, !t && o >= 64) {
        l = !1;
        break;
      }
      if (Ir(this.sectionEndPositions, n, (k) => k) !== -1) {
        l = !1;
        break;
      }
    }
    if (l) {
      const f = K(this.sectionEndPositions, n, (h) => h);
      this.sectionEndPositions.splice(f + 1, 0, n);
    }
    if (!c)
      return null;
    let u;
    if (a.length === 1)
      u = a[0];
    else {
      const f = a.reduce((p, m) => p + m.length, 0);
      u = new Uint8Array(f);
      let h = 0;
      for (const p of a)
        u.set(p, h), h += p.length;
    }
    return {
      startPos: e,
      endPos: t ? n : null,
      pid: c.pid,
      payload: u,
      randomAccessIndicator: d
    };
  }
  async readPacketHeader(e) {
    let t = this.reader.requestSlice(e, 4);
    if (t instanceof Promise && (t = await t), !t)
      return null;
    if (R(t) !== 71)
      throw new Error("Invalid TS packet sync byte. Likely an internal bug, please report this file.");
    const n = ne(t), s = n >> 14 & 1, a = n & 8191, c = R(t) >> 4 & 3;
    return {
      payloadUnitStartIndicator: s,
      pid: a,
      adaptationFieldControl: c
    };
  }
  async readPacket(e) {
    let t = this.reader.requestSlice(e, ye);
    if (t instanceof Promise && (t = await t), !t)
      return null;
    const i = z(t, ye);
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
const At = (r, e) => {
  if (r.payload.byteLength < 3)
    return null;
  const t = new G(r.payload);
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
    throw new Error(Oa);
  return {
    sectionStartPos: r.startPos,
    sectionEndPos: r.endPos,
    pts: a,
    randomAccessIndicator: r.randomAccessIndicator
  };
}, Ht = (r, e) => {
  g(r.endPos !== null);
  const t = At(r, e);
  if (!t)
    return null;
  const i = new G(r.payload);
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
class di {
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
      if (n.getType() === t && i++, g(n instanceof di), n.elementaryStream === this.elementaryStream)
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
    return de;
  }
  getDisposition() {
    return {
      ...st,
      primary: !1
    };
  }
  getTimeResolution() {
    return Je;
  }
  isRelativeToUnixEpoch() {
    return !1;
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
    return this.allPacketsAreKeyPackets() ? n = "key" : n = e.randomAccessIndicator === 1 ? "key" : "delta", new Y(i.metadataOnly ? xe : e.data, n, e.pts / Je, Math.max(t / Je, 0), e.sequenceNumber, e.data.byteLength);
  }
  async getFirstPacket(e) {
    const t = this.elementaryStream.firstSection;
    g(t);
    const i = Ht(t, !0);
    g(i);
    const n = new mr(this.elementaryStream, i), s = new Ei(this, n), a = await s.readNext();
    if (!a)
      return null;
    const o = this.createEncodedPacket(a.packet, a.duration, e);
    return this.packetBuffers.set(o, s), this.packetSectionStarts.set(o, a.packet.sectionStartPos), o;
  }
  async getNextPacket(e, t) {
    let i = this.packetBuffers.get(e);
    if (i) {
      const d = await i.readNext();
      if (!d)
        return null;
      this.packetBuffers.delete(e);
      const u = this.createEncodedPacket(d.packet, d.duration, t);
      return this.packetBuffers.set(u, i), this.packetSectionStarts.set(u, d.packet.sectionStartPos), u;
    }
    const n = this.packetSectionStarts.get(e);
    if (n === void 0)
      throw new Error("Packet was not created from this track.");
    const a = await this.elementaryStream.demuxer.readSection(n, !0);
    g(a);
    const o = Ht(a, !0);
    g(o);
    const c = new mr(this.elementaryStream, o);
    i = new Ei(this, c);
    const l = e.sequenceNumber;
    for (; ; ) {
      const d = await i.readNext();
      if (!d)
        return null;
      if (d.packet.sequenceNumber > l) {
        const u = this.createEncodedPacket(d.packet, d.duration, t);
        return this.packetBuffers.set(u, i), this.packetSectionStarts.set(u, d.packet.sectionStartPos), u;
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
    const n = wr(e * Je), s = this.elementaryStream.demuxer, { reader: a, seekChunkSize: o } = s, c = this.elementaryStream.pid, l = async (T, A, x) => {
      let I = T;
      for (; I < A; ) {
        const P = await s.readPacketHeader(I);
        if (!P)
          return null;
        if (P.pid === c && P.payloadUnitStartIndicator === 1) {
          const S = await s.readSection(I, x);
          if (!S)
            return null;
          const E = At(S, !1);
          if (E && E.pts !== null)
            return {
              pesPacketHeader: E,
              section: S
            };
        }
        I += s.packetStride;
      }
      return null;
    }, d = this.elementaryStream.firstSection;
    g(d);
    const u = At(d, !0);
    if (g(u), n < u.pts)
      return null;
    let f;
    const h = this.elementaryStream.referencePesPackets, p = K(h, n, (T) => T.pts), m = p !== -1 ? h[p] : null;
    if (m && n - m.pts < Je / 2)
      f = m.sectionStartPos;
    else {
      let T = 0;
      if (a.fileSize !== null) {
        const A = Math.ceil(a.fileSize / o);
        if (A > 1) {
          let x = 0, I = A - 1;
          for (T = x; x <= I; ) {
            const P = Math.floor((x + I) / 2), S = ki(P * o, s.packetStride) + u.sectionStartPos, E = S + o, D = await l(S, E, !1);
            if (!D) {
              I = P - 1;
              continue;
            }
            D.pesPacketHeader.pts <= n ? (T = P, x = P + 1) : I = P - 1;
          }
        }
      }
      f = ki(T * o, s.packetStride) + u.sectionStartPos;
    }
    let k = (await l(f, a.fileSize ?? 1 / 0, !1))?.pesPacketHeader ?? null;
    k || (k = u);
    const y = this.getReorderSize(), w = async (T, A) => {
      const x = await s.readSection(T, !0);
      g(x);
      const I = Ht(x, !0);
      g(I);
      const P = new mr(this.elementaryStream, I), S = new Ei(this, P);
      for (; !((ee(S.presentationOrderPackets)?.pts ?? -1 / 0) >= n || !await S.readNextPacket()); )
        ;
      const E = hn(S.presentationOrderPackets, A);
      if (E === -1)
        return null;
      const D = S.presentationOrderPackets[E], B = E === 0 ? 0 : D.pts - S.presentationOrderPackets[E - 1].pts;
      for (; S.decodeOrderPackets[0] !== D; )
        S.decodeOrderPackets.shift();
      S.lastDuration = B;
      const O = await S.readNext();
      g(O);
      const W = this.createEncodedPacket(O.packet, O.duration, i);
      return this.packetBuffers.set(W, S), this.packetSectionStarts.set(W, O.packet.sectionStartPos), W;
    };
    if (!t || this.allPacketsAreKeyPackets()) {
      e: for (; ; ) {
        let T = k.sectionStartPos + s.packetStride;
        for (; ; ) {
          const A = await s.readPacketHeader(T);
          if (!A)
            break e;
          if (A.pid === c && A.payloadUnitStartIndicator === 1) {
            const x = await s.readSection(T, !1);
            if (x) {
              const I = At(x, !1);
              if (I && I.pts !== null) {
                if (I.pts > n)
                  break e;
                k = I, Ji(this.elementaryStream, k);
                break;
              }
            }
          }
          T += s.packetStride;
        }
      }
      e: for (let T = 0; T < y + 1; T++) {
        let A = k.sectionStartPos - s.packetStride;
        for (; A >= s.packetOffset; ) {
          const x = await s.readPacketHeader(A);
          if (!x)
            break e;
          if (x.pid === c && x.payloadUnitStartIndicator === 1) {
            const I = await s.readSection(A, !1);
            if (I) {
              const P = At(I, !1);
              if (P && P.pts !== null) {
                k = P;
                break;
              }
            }
          }
          A -= s.packetStride;
        }
      }
      return w(k.sectionStartPos, (T) => T.pts <= n);
    } else {
      let T = f, A = null;
      const x = !this.elementaryStream.canBeTrustedWithKeyPackets;
      for (; ; ) {
        let I = null;
        const P = T <= u.sectionStartPos;
        let S, E = null;
        if (P)
          S = u, E = d;
        else {
          const O = await l(T, a.fileSize ?? 1 / 0, x);
          S = O?.pesPacketHeader ?? null, E = O?.section ?? null;
        }
        let D = !1, B = 0;
        e: for (; S && !(A !== null && S.sectionStartPos >= A); ) {
          if (S.pts <= n) {
            let W;
            if (this.elementaryStream.canBeTrustedWithKeyPackets)
              W = S.randomAccessIndicator === 1;
            else {
              g(E);
              const U = Ht(E, !0);
              g(U);
              const M = new mr(this.elementaryStream, U);
              await M.markNextPacket(), W = M.suppliedPacket?.randomAccessIndicator === 1;
            }
            W && (I = S);
          }
          if (S.pts > n && (D = !0), D && (B++, B > y))
            break;
          let O = S.sectionStartPos + s.packetStride;
          for (; ; ) {
            const W = await s.readPacketHeader(O);
            if (!W)
              break e;
            if (W.pid === c && W.payloadUnitStartIndicator === 1) {
              const U = await s.readSection(O, x);
              if (U) {
                const M = At(U, !1);
                if (M && M.pts !== null) {
                  S = M, E = U, Ji(this.elementaryStream, S);
                  break;
                }
              }
            }
            O += s.packetStride;
          }
        }
        if (I) {
          let O = I;
          if (B === 0)
            e: for (let U = 0; U < y; U++) {
              let M = O.sectionStartPos - s.packetStride;
              for (; M >= s.packetOffset; ) {
                const L = await s.readPacketHeader(M);
                if (!L)
                  break e;
                if (L.pid === c && L.payloadUnitStartIndicator === 1) {
                  const X = await s.readSection(M, x);
                  if (X) {
                    const ie = At(X, !1);
                    if (ie && ie.pts !== null) {
                      O = ie;
                      break;
                    }
                  }
                }
                M -= s.packetStride;
              }
            }
          const W = await w(O.sectionStartPos, (U) => U.pts <= n && U.randomAccessIndicator === 1);
          return g(W), W;
        }
        if (P)
          return null;
        A = T, T = Math.max(ki(T - u.sectionStartPos - o, s.packetStride) + u.sectionStartPos, u.sectionStartPos);
      }
    }
  }
}
class ol extends di {
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
class cl extends di {
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
const Ji = (r, e) => {
  const t = r.referencePesPackets, i = K(t, e.sectionStartPos, (n) => n.sectionStartPos);
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
class mr {
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
        let n = ee(this.pesPackets).sectionEndPos;
        for (g(n !== null); ; ) {
          const s = await this.demuxer.readPacketHeader(n);
          if (!s)
            return;
          if (s.pid === this.pid) {
            const a = await this.demuxer.readSection(n, !0);
            if (!a)
              return;
            const o = Ht(a, !1);
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
      let n = null;
      for (; ; ) {
        let s = this.ensureBuffered(i);
        if (s instanceof Promise && (s = await s), s === 0)
          break;
        const a = this.currentPos, o = this.readBytes(s), c = o.byteLength;
        let l = 0;
        for (; l < c; ) {
          const d = o.indexOf(0, l);
          if (d === -1 || d >= c)
            break;
          l = d;
          const u = a + l;
          if (l + 4 >= c) {
            this.seekTo(u);
            break;
          }
          const f = o[l + 1], h = o[l + 2], p = o[l + 3];
          let m = 0, b = null;
          if (f === 0 && h === 0 && p === 1 ? (m = 4, b = o[l + 4]) : f === 0 && h === 1 && (m = 3, b = p), m === 0) {
            l++;
            continue;
          }
          const k = u;
          if (n === null) {
            n = k, l += m;
            continue;
          }
          if (b !== null) {
            const y = t === "avc" ? li(b) : er(b);
            if (t === "avc" ? y === We.AUD : y === ue.AUD_NUT) {
              const T = k - n;
              return this.seekTo(n), this.supplyPacket(T, 0);
            }
          }
          l += m;
        }
        if (s < i)
          break;
      }
      if (n !== null) {
        const s = this.endPos - n;
        return this.seekTo(n), this.supplyPacket(s, 0);
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
            let c = this.ensureBuffered(_t);
            if (c instanceof Promise && (c = await c), c < _t)
              return;
            const l = this.readBytes(_t), d = Bt(we.tempFromBytes(l));
            if (d) {
              this.seekTo(o);
              let u = this.ensureBuffered(d.frameLength);
              return u instanceof Promise && (u = await u), this.supplyPacket(u, Math.round(ei * Je / e.info.sampleRate));
            } else
              this.seekTo(o + 1);
          } else if (t === "mp3") {
            if (a !== 255)
              continue;
            this.skip(-1);
            const o = this.currentPos;
            let c = this.ensureBuffered(Et);
            if (c instanceof Promise && (c = await c), c < Et)
              return;
            const l = this.readBytes(Et), d = Q(l).getUint32(0), u = wn(d, null);
            if (u.header) {
              this.seekTo(o);
              let f = this.ensureBuffered(u.header.totalSize);
              f instanceof Promise && (f = await f);
              const h = u.header.audioSamplesInFrame * Je / e.info.sampleRate;
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
            const d = l[4] >> 6, u = l[4] & 63;
            if (d === 3 || u > 37) {
              this.seekTo(o + 1);
              continue;
            }
            const f = bc[3 * u + d];
            g(f !== void 0), this.seekTo(o), c = this.ensureBuffered(f), c instanceof Promise && (c = await c);
            const h = Math.round(wc * Je / e.info.sampleRate);
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
            const u = (((l[2] & 7) << 8 | l[3]) + 1) * 2, h = l[4] >> 6 === 3 ? 3 : l[4] >> 4 & 3, p = ka[h];
            this.seekTo(o), c = this.ensureBuffered(u), c instanceof Promise && (c = await c);
            const m = p * 256, b = Math.round(m * Je / e.info.sampleRate);
            return this.supplyPacket(c, b);
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
        throw new Error(Oa);
      n = i.pts, Ji(this.elementaryStream, i);
    }
    this.lastSuppliedPesPacket = i, this.nextPts = n + t;
    const s = i.sectionStartPos, a = s + (this.currentPos - this.currentPesPacketPos), o = this.readBytes(e);
    let c = i.randomAccessIndicator;
    if (c === 0 && !this.elementaryStream.canBeTrustedWithKeyPackets) {
      if (this.elementaryStream.info.type === "audio")
        c = 1;
      else if (this.elementaryStream.info.decoderConfig) {
        const l = Pn(this.elementaryStream.info.codec, this.elementaryStream.info.decoderConfig, o) === "key";
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
class Ei {
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
const Na = "application/vnd.apple.mpegurl", ls = "#EXT-X-STREAM-INF:", us = "#EXT-X-I-FRAME-STREAM-INF:", ds = "#EXT-X-MEDIA:", en = "#EXTINF:", fs = "#EXT-X-MAP:", hs = "#EXT-X-KEY:", ms = "#EXT-X-MEDIA-SEQUENCE:", ps = "#EXT-X-BYTERANGE:", gs = "#EXT-X-PROGRAM-DATE-TIME:", ll = "#EXT-X-DISCONTINUITY", ks = "#EXT-X-TARGETDURATION:", ul = "#EXT-X-ENDLIST", ys = "#EXT-X-PLAYLIST-TYPE:", dl = "#EXT-X-I-FRAMES-ONLY", Va = (r) => r.length === 0 || r.startsWith("#") && !r.startsWith("#EXT");
class yr {
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
class fl {
  constructor(e, t, i) {
    this.nextInputCacheAge = 0, this.inputCache = [], this.trackBackingsPromise = null, this.firstSegment = null, this.firstSegmentFirstTimestamps = /* @__PURE__ */ new WeakMap(), this.firstTimestampCache = /* @__PURE__ */ new WeakMap(), this.input = e, this.path = t, this.trackDeclarations = i;
  }
  async getDurationFromMetadata(e) {
    const t = await this.getSegmentAt(1 / 0, {
      skipLiveWait: e.skipLiveWait
    });
    return t ? t.timestamp + t.duration : null;
  }
  async getTrackBackings() {
    return this.trackBackingsPromise ??= (async () => {
      const e = [];
      if (this.trackDeclarations) {
        for (const t of this.trackDeclarations)
          if (t.type === "video") {
            const i = fr(e, (n) => n.getType() === "video") + 1;
            e.push(new bs(this, t, i));
          } else if (t.type === "audio") {
            const i = fr(e, (n) => n.getType() === "audio") + 1;
            e.push(new ws(this, t, i));
          }
      } else {
        if (this.firstSegment = await this.getFirstSegment({}), !this.firstSegment)
          return [];
        const i = await this.getInputForSegment(this.firstSegment).getTracks();
        for (const n of i)
          if (n.type === "video") {
            const s = fr(e, (a) => a.getType() === "video") + 1;
            e.push(new bs(this, {
              id: e.length + 1,
              type: "video"
            }, s));
          } else if (n.type === "audio") {
            const s = fr(e, (a) => a.getType() === "audio") + 1;
            e.push(new ws(this, {
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
class Ua {
  constructor(e, t, i) {
    this.packetInfos = /* @__PURE__ */ new WeakMap(), this.hydrationPromise = null, this.firstInputTrack = null, this.segmentedInput = e, this.decl = t, this.number = i;
  }
  hydrate() {
    return this.hydrationPromise ??= (async () => {
      if (this.segmentedInput.firstSegment ??= await this.segmentedInput.getFirstSegment({}), !this.segmentedInput.firstSegment)
        throw new Error("Missing first segment, can't retrieve track.");
      const i = (await this.segmentedInput.getInputForSegment(this.segmentedInput.firstSegment).getTracks()).find((n) => n.type === this.decl.type && n.number === this.number);
      if (!i)
        throw new Error("No matching track found in underlying media data.");
      this.firstInputTrack = i;
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
    return await this.hydrate(), g(this.segmentedInput.firstSegment), this.segmentedInput.firstSegment.relativeToUnixEpoch;
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
      timestamp: jr(e.timestamp + n, await i.getTimeResolution()),
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
    await this.hydrate(), g(this.segmentedInput.firstSegment), g(this.firstInputTrack);
    const t = await this.firstInputTrack._backing.getFirstPacket(e);
    return t ? this.createAdjustedPacket(t, this.segmentedInput.firstSegment, this.firstInputTrack) : null;
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
      const d = (await this.segmentedInput.getInputForSegment(o).getTracks()).find((f) => f.type === n.track.type && f.number === n.track.number);
      if (!d) {
        a = o;
        continue;
      }
      const u = await d._backing.getFirstPacket(t);
      return u ? this.createAdjustedPacket(u, o, d) : null;
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
      const s = this.segmentedInput.getInputForSegment(n), o = (await s.getTracks()).find((u) => u.type === this.firstInputTrack.type && u.number === this.firstInputTrack.number);
      if (!o) {
        n = await this.segmentedInput.getPreviousSegment(n, {
          skipLiveWait: t.skipLiveWait
        });
        continue;
      }
      const c = await this.segmentedInput.getMediaOffset(n, s), l = e - c, d = i ? await o._backing.getKeyPacket(l, t) : await o._backing.getPacket(l, t);
      if (!d) {
        n = await this.segmentedInput.getPreviousSegment(n, {
          skipLiveWait: t.skipLiveWait
        });
        continue;
      }
      return this.createAdjustedPacket(d, n, o);
    }
    return null;
  }
}
class bs extends Ua {
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
class ws extends Ua {
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
pn();
const Wa = 0, La = 1 / 0;
class Le extends ai {
  constructor() {
    super(...arguments), this._disposed = !1, this._refCount = 0, this._usedForHls = !1, this._sizePromise = null, this.onread = null;
  }
  /**
   * Resolves with the total size of the file in bytes. This function is memoized, meaning only the first call
   * will retrieve the size.
   *
   * Returns null if the source is unsized.
   */
  async getSizeOrNull() {
    if (this._disposed)
      throw new be();
    return this._sizePromise ??= (async () => {
      let e = this._getFileSize();
      return e !== void 0 || (await this._read(0, 1, Wa, La), e = this._getFileSize(), g(e !== void 0)), e;
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
      throw new be();
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
    return new kl(this, e, t);
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
    return new _n(this);
  }
}
class _n {
  /** @internal */
  constructor(e) {
    if (this._freed = !1, e._disposed)
      throw new Error("Cannot ref a disposed source.");
    e._refCount++, this._source = e;
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
    g(e._refCount > 0), e._refCount--, e._refCount === 0 && (e._dispose(), e._disposed = !0), this._freed = !0, this._source = null;
  }
  /**
   * Calls {@link SourceRef.free}.
   */
  [Symbol.dispose]() {
    this.freed || this.free();
  }
}
class fi extends Le {
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
      if (!(n instanceof Le || n instanceof _n))
        throw new TypeError("requestHandler must return or resolve to a Source or SourceRef.");
      const s = n instanceof Le ? n.ref() : n;
      return s.source._usedForHls ||= this._usedForHls, s;
    };
    return t instanceof Promise ? t.then(i) : i(t);
  }
}
const Ts = (r, e) => r.path === e.path;
class hl extends fi {
  constructor() {
    super(...arguments), this._root = null, this._rootRequest = null;
  }
  /** @internal */
  _read(e, t, i, n) {
    if (!this._root) {
      if (!this._rootRequest) {
        const s = this._resolveRequest({ path: this.rootPath, isRoot: !0 }), a = (o) => {
          const c = o instanceof Le ? o.ref() : o;
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
class As extends Le {
  /**
   * Creates a new {@link BlobSource} backed by the specified
   * [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob).
   */
  constructor(e, t = {}) {
    if (!(e instanceof Blob))
      throw new TypeError("blob must be a Blob.");
    if (!t || typeof t != "object")
      throw new TypeError("options must be an object.");
    if (t.maxCacheSize !== void 0 && (!gn(t.maxCacheSize) || t.maxCacheSize < 0))
      throw new TypeError("options.maxCacheSize, when provided, must be a non-negative number.");
    if (t.useStreamReader !== void 0 && typeof t.useStreamReader != "boolean")
      throw new TypeError("options.useStreamReader, when provided, must be a boolean.");
    super(), this._readers = /* @__PURE__ */ new WeakMap(), this._blob = e, this._options = t, this._orchestrator = new gl({
      maxCacheSize: t.maxCacheSize ?? 8 * 2 ** 20,
      maxWorkerCount: 4,
      runWorker: this._runWorker.bind(this),
      prefetchProfile: pl.fileSystem
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
    for (t === void 0 && ("stream" in this._blob && !pr() && this._options.useStreamReader !== !1 ? t = this._blob.slice(e.currentPos).stream().getReader() : t = null, this._readers.set(e, t)); e.currentPos < e.targetPos && !e.aborted; )
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
class ml extends Le {
  /** Creates a new {@link ReadableStreamSource} backed by the specified `ReadableStream<Uint8Array>`. */
  constructor(e, t = {}) {
    if (!(e instanceof ReadableStream))
      throw new TypeError("stream must be a ReadableStream.");
    if (!t || typeof t != "object")
      throw new TypeError("options must be an object.");
    if (t.maxCacheSize !== void 0 && (!gn(t.maxCacheSize) || t.maxCacheSize < 0))
      throw new TypeError("options.maxCacheSize, when provided, must be a non-negative number.");
    super(), this._reader = null, this._cache = [], this._pendingSlices = [], this._currentIndex = 0, this._targetIndex = 0, this._maxRequestedIndex = 0, this._endIndex = null, this._pulling = !1, this._stream = e, this._maxCacheSize = t.maxCacheSize ?? 16 * 2 ** 20;
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
    const i = K(this._cache, e, (d) => d.start), n = i !== -1 ? this._cache[i] : null;
    if (n && n.start <= e && t <= n.end)
      return {
        bytes: n.bytes,
        view: n.view,
        offset: n.start
      };
    let s = e;
    const a = new Uint8Array(t - e);
    if (i !== -1)
      for (let d = i; d < this._cache.length; d++) {
        const u = this._cache[d];
        if (u.start >= t)
          break;
        const f = Math.max(e, u.start);
        f > s && this._throwDueToCacheMiss();
        const h = Math.min(t, u.end);
        f < h && (a.set(u.bytes.subarray(f - u.start, h - u.start), f - e), s = h);
      }
    if (s === t)
      return {
        bytes: a,
        view: Q(a),
        offset: e
      };
    this._currentIndex > s && this._throwDueToCacheMiss();
    const { promise: o, resolve: c, reject: l } = ce();
    return this._pendingSlices.push({
      start: e,
      end: t,
      bytes: a,
      resolve: c,
      reject: l
    }), this._targetIndex = Math.max(this._targetIndex, t), this._pulling || (this._pulling = !0, this._pull().catch((d) => {
      if (this._pulling = !1, this._pendingSlices.length > 0)
        this._pendingSlices.forEach((u) => u.reject(d)), this._pendingSlices.length = 0;
      else
        throw d;
    })), o;
  }
  /** @internal */
  _throwDueToCacheMiss() {
    throw new Error("Read is before the cached region. With ReadableStreamSource, you must access the data more sequentially or increase the size of its cache.");
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
      for (let s = 0; s < this._pendingSlices.length; s++) {
        const a = this._pendingSlices[s], o = Math.max(i, a.start), c = Math.min(n, a.end);
        o < c && (a.bytes.set(t.subarray(o - i, c - i), o - a.start), c === a.end && (a.resolve({
          bytes: a.bytes,
          view: Q(a.bytes),
          offset: a.start
        }), this._pendingSlices.splice(s, 1), s--));
      }
      for (this._cache.push({
        start: i,
        end: n,
        bytes: t,
        view: Q(t),
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
    this._pendingSlices.length = 0, this._cache.length = 0, this._reader?.cancel();
  }
}
const pl = {
  fileSystem: (r, e) => (r = Math.floor((r - 65536) / 65536) * 65536, e = Math.ceil((e + 65536) / 65536) * 65536, { start: r, end: e })
};
class gl {
  constructor(e) {
    this.options = e, this.fileSize = null, this.nextAge = 0, this.workers = [], this.cache = [], this.currentCacheSize = 0, this.disposed = !1, this.queuedReads = [];
  }
  read(e, t, i, n) {
    g(!this.disposed);
    const s = this.options.prefetchProfile(e, t, this.workers), a = Math.max(s.start, i), o = Math.min(s.end, this.fileSize ?? 1 / 0, n);
    g(a <= e && t <= o);
    let c = null;
    const l = K(this.cache, e, (A) => A.start), d = l !== -1 ? this.cache[l] : null;
    d && d.start <= e && t <= d.end && (d.age = this.nextAge++, c = {
      bytes: d.bytes,
      view: d.view,
      offset: d.start
    });
    const u = K(this.cache, a, (A) => A.start), f = c ? null : new Uint8Array(t - e);
    let h = 0, p = a;
    const m = [];
    if (u !== -1) {
      for (let A = u; A < this.cache.length; A++) {
        const x = this.cache[A];
        if (x.start >= o)
          break;
        if (x.end <= a)
          continue;
        const I = Math.max(a, x.start), P = Math.min(o, x.end);
        if (g(I <= P), p < I && m.push({ start: p, end: I }), p = P, f) {
          const S = Math.max(e, x.start), E = Math.min(t, x.end);
          if (S < E) {
            const D = S - e;
            f.set(x.bytes.subarray(S - x.start, E - x.start), D), D === h && (h = E - e);
          }
        }
        x.age = this.nextAge++;
      }
      p < o && m.push({ start: p, end: o });
    } else
      m.push({ start: a, end: o });
    if (f && h >= f.length && (c = {
      bytes: f,
      view: Q(f),
      offset: e
    }), m.length === 0)
      return g(c), c;
    const { promise: b, resolve: k, reject: y } = ce(), w = [];
    for (const A of m) {
      const x = Math.max(e, A.start), I = Math.min(t, A.end);
      x === A.start && I === A.end ? w.push(A) : x < I && w.push({ start: x, end: I });
    }
    const T = f && {
      start: e,
      bytes: f,
      holes: w,
      resolve: k,
      reject: y
    };
    e: for (const A of m) {
      for (const P of this.workers)
        if (this.checkHoleAgainstWorker(P, A, T ? [T] : [])) {
          this.checkQueuedReadsAgainstWorker(P);
          continue e;
        }
      const x = A.end < o || this.fileSize !== null, I = this.createWorker(A.start, A.end, x);
      if (I)
        T && (I.pendingSlices = [T]), this.runWorker(I);
      else {
        let P = K(this.queuedReads, A.start, (E) => E.hole.start), S = P !== -1 ? this.queuedReads[P] : null;
        for (S && A.start <= S.hole.end ? (S.hole.end = Math.max(S.hole.end, A.end), S.strictTarget &&= x, T && S.pendingSlices.push(T)) : (P++, S = {
          hole: {
            // Clone the hole because it might be mutated later
            start: A.start,
            end: A.end
          },
          strictTarget: x,
          pendingSlices: T ? [T] : [],
          age: this.nextAge++
        }, this.queuedReads.splice(P, 0, S)); P + 1 < this.queuedReads.length; ) {
          const E = this.queuedReads[P + 1];
          if (E.hole.start > S.hole.end)
            break;
          S.hole.end = Math.max(S.hole.end, E.hole.end), S.pendingSlices.push(...E.pendingSlices), S.strictTarget &&= E.strictTarget, S.age = Math.min(S.age, E.age), this.queuedReads.splice(P + 1, 1);
        }
      }
    }
    return c || (g(f), c = b.then((A) => A && {
      bytes: A,
      view: Q(A),
      offset: e
    })), c;
  }
  checkHoleAgainstWorker(e, t, i) {
    if (jn(t.start - 131072, t.start, e.currentPos, e.targetPos)) {
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
      else
        throw t;
    }).finally(() => {
      if (!e.running && this.queuedReads.length > 0) {
        let t = 0;
        for (let s = 1; s < this.queuedReads.length; s++)
          this.queuedReads[s].age < this.queuedReads[t].age && (t = s);
        const i = this.queuedReads[t];
        this.queuedReads.splice(t, 1);
        const n = this.createWorker(i.hole.start, i.hole.end, i.strictTarget);
        g(n), n.pendingSlices = i.pendingSlices, this.runWorker(n);
      }
    });
  }
  consolidateEverythingIntoOneWorker(e) {
    const t = new Set(e.pendingSlices);
    for (let i = 0; i < this.workers.length; i++) {
      const n = this.workers[i];
      if (n !== e) {
        for (const s of n.pendingSlices)
          t.add(s);
        n.aborted = !0, n.pendingSlices.length = 0, this.workers.splice(i, 1), i--;
      }
    }
    for (let i = 0; i < this.queuedReads.length; i++) {
      const n = this.queuedReads[i];
      for (const s of n.pendingSlices)
        t.add(s);
    }
    e.pendingSlices = [...t], this.queuedReads.length = 0;
  }
  /** Called by a worker when it has read some data. */
  supplyWorkerData(e, t) {
    g(!e.aborted);
    const i = e.currentPos, n = i + t.length;
    this.insertIntoCache({
      start: i,
      end: n,
      bytes: t,
      view: Q(t),
      age: this.nextAge++
    }), e.currentPos += t.length, e.currentPos > e.targetPos && (e.targetPos = e.currentPos, this.checkQueuedReadsAgainstWorker(e));
    for (let s = 0; s < e.pendingSlices.length; s++) {
      const a = e.pendingSlices[s], o = Math.max(i, a.start), c = Math.min(n, a.start + a.bytes.length);
      o < c && a.bytes.set(t.subarray(o - i, c - i), o - a.start);
      for (let l = 0; l < a.holes.length; l++) {
        const d = a.holes[l];
        i <= d.start && n > d.start && (d.start = n), d.end <= d.start && (a.holes.splice(l, 1), l--);
      }
      a.holes.length === 0 && (a.resolve(a.bytes), e.pendingSlices.splice(s, 1), s--);
    }
    for (let s = 0; s < this.workers.length; s++) {
      const a = this.workers[s];
      e === a || a.running || jn(i, n, a.currentPos, a.targetPos) && (this.workers.splice(s, 1), s--);
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
    e.running = !1, e.pendingSlices.length = 0;
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
    let t = K(this.cache, e.start, (i) => i.start) + 1;
    if (t > 0) {
      const i = this.cache[t - 1];
      if (i.end >= e.end)
        return;
      if (i.end > e.start) {
        const n = new Uint8Array(e.end - i.start);
        n.set(i.bytes, 0), n.set(e.bytes, e.start - i.start), this.currentCacheSize += e.end - i.end, i.bytes = n, i.view = Q(n), i.end = e.end, t--, e = i;
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
      s.set(e.bytes, 0), s.set(n.bytes, n.start - e.start), this.currentCacheSize -= e.end - n.start, e.bytes = s, e.view = Q(s), e.end = n.end, this.cache.splice(i, 1);
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
    for (const e of this.workers)
      e.aborted = !0;
    this.workers.length = 0, this.cache.length = 0, this.disposed = !0;
  }
}
class kl extends Le {
  /** @internal */
  constructor(e, t, i) {
    if (super(), this._ref = null, e._disposed)
      throw new Error("Cannot create a slice of a disposed source.");
    this._baseSource = e, this._offset = t, this._length = i ?? null;
  }
  /** @internal */
  _getFileSize() {
    const e = this._baseSource._getFileSize();
    return e === void 0 ? this._length !== null ? this._length : void 0 : e === null ? this._length !== null ? this._length : null : se(e - this._offset, 0, this._length ?? 1 / 0);
  }
  /** @internal */
  _read(e, t, i, n) {
    if (this._length !== null && t > this._length)
      return null;
    const s = this._baseSource._read(this._offset + e, this._offset + t, this._offset + i, this._offset + n);
    return s instanceof Promise ? s.then((a) => a ? (a.offset -= this._offset, a) : null) : s ? (s.offset -= this._offset, s) : null;
  }
  /** @internal */
  _dispose() {
    this._ref?.free();
  }
  ref() {
    return this._ref ??= this._baseSource.ref(), super.ref();
  }
}
var Ss = function(r, e, t) {
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
}, xs = /* @__PURE__ */ (function(r) {
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
const yl = /^0[xX][0-9a-fA-F]+$/, bl = /^data:.*;base64,/i;
class Ps extends fl {
  constructor(e, t, i, n) {
    super(e.input, t, i), this.segments = [], this.nextLines = null, this.currentUpdateSegmentsPromise = null, this.streamHasEnded = !1, this.lastSegmentUpdateTime = -1 / 0, this.refreshInterval = 5, this.demuxer = e, this.nextLines = n;
  }
  runUpdateSegments() {
    return this.currentUpdateSegmentsPromise ??= (async () => {
      try {
        const e = this.getRemainingWaitTimeMs();
        e > 0 && await Oo(e), this.lastSegmentUpdateTime = performance.now(), await this.updateSegments();
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
        const y = Ss(k, await this.demuxer.input._getSourceUncached({ path: this.path, isRoot: !1 }), !1), T = await new Ur(y.source).requestEntireFile();
        g(T), e = co(T, T.length, { ignore: Va });
      } catch (y) {
        k.error = y, k.hasError = !0;
      } finally {
        xs(k);
      }
    }
    let t = !1, i = 0, n = null, s = null, a = 0, o = null, c = null, l = null, d = null, u = null, f = null, h = !1, p = ee(this.segments) ?? null;
    const m = (k) => {
      const y = k.indexOf("@"), w = Number(y === -1 ? k : k.slice(0, y));
      if (!Number.isInteger(w) || w < 0)
        throw new Error(`Invalid #EXT-X-BYTERANGE length '${k}'.`);
      let T = null;
      if (y !== -1 && (T = Number(k.slice(y + 1)), !Number.isInteger(T) || T < 0))
        throw new Error(`Invalid #EXT-X-BYTERANGE offset '${k}'.`);
      return { length: w, offset: T };
    }, b = (k) => {
      a = k, p && (g(p.sequenceNumber !== null), p.sequenceNumber < k && (i = p.timestamp + p.duration, o = p.firstSegment, c = p.initSegment, u = p.lastProgramDateTimeSeconds, p = null));
    };
    for (let k = 0; k < e.length; k++) {
      const y = e[k];
      if (!t) {
        if (y !== "#EXTM3U")
          throw new Error("Invalid M3U8 file; expected first line to be #EXTM3U.");
        t = !0;
        continue;
      }
      if (!y.startsWith("#")) {
        if (!p) {
          if (n === null)
            throw new Error("Invalid M3U8 file; a segment must be preceded by an #EXTINF tag.");
          let w = s;
          if (w && w.method === "AES-128" && !w.iv) {
            const I = new Uint8Array(Ne), P = Q(I);
            P.setUint32(8, Math.floor(a / 2 ** 32)), P.setUint32(12, a), w = { ...w, iv: I };
          }
          const A = {
            path: ft(this.path, y),
            offset: d?.offset ?? 0,
            length: d?.length ?? null
          }, x = {
            timestamp: i,
            relativeToUnixEpoch: u !== null,
            firstSegment: o,
            sequenceNumber: a,
            location: A,
            duration: n,
            encryption: w,
            initSegment: c,
            lastProgramDateTimeSeconds: u
          };
          o ??= x, i += n, this.segments.push(x);
        }
        n = null, d === null ? l = null : d = null, b(a + 1);
      }
      if (y.startsWith(en)) {
        if (p) {
          h = !0;
          continue;
        }
        h || (u === null && a > 0 && f !== null && (i = a * f), h = !0);
        const w = y.slice(en.length), T = w.indexOf(","), A = T === -1 ? w : w.slice(0, T), x = Number(A);
        if (!Number.isFinite(x) || x < 0)
          throw new Error(`Invalid #EXTINF tag duration '${A}'.`);
        n = x;
      } else if (y.startsWith(fs)) {
        const w = new yr(y.slice(fs.length)), T = w.get("uri");
        if (!T)
          throw new Error("Invalid #EXT-X-MAP tag; missing URI attribute.");
        const A = w.get("byterange");
        let x = null;
        if (A !== null && (x = m(A)), x && x.offset === null)
          throw new Error("Invalid #EXT-X-MAP tag; BYTERANGE attribute must have a specified offset.");
        if (!p) {
          const P = {
            path: ft(this.path, T),
            offset: x?.offset ?? 0,
            length: x?.length ?? null
          };
          if (s?.method === "AES-128" && !s.iv)
            throw new Error("IV attribute must be set on #EXT-X-KEY tag preceding the #EXT-X-MAP tag.");
          c = {
            timestamp: i,
            relativeToUnixEpoch: u !== null,
            firstSegment: null,
            sequenceNumber: null,
            location: P,
            duration: 0,
            encryption: s,
            initSegment: null,
            lastProgramDateTimeSeconds: u
          };
        }
        n = null, d === null ? l = null : d = null;
      } else if (y.startsWith(hs)) {
        const w = new yr(y.slice(hs.length)), T = w.get("method");
        if (T === "NONE")
          s = null;
        else if (T === "AES-128") {
          const A = w.get("uri");
          if (!A)
            throw new Error("Invalid #EXT-X-KEY: AES-128 requires a URI attribute.");
          let x = null;
          const I = w.get("iv");
          if (I) {
            if (!yl.test(I))
              throw new Error(`Unsupported IV format '${I}'.`);
            let S = I.slice(2);
            S = S.padStart(Ne * 2, "0"), x = new Uint8Array(Ne);
            for (let E = 0; E < Ne; E++) {
              const D = -Ne * 2 + E;
              x[E] = parseInt(S.slice(D, D + 2), 16);
            }
          }
          const P = w.get("keyformat") ?? "identity";
          if (P !== "identity")
            throw new Error("For AES-128 encryption, only the 'identity' KEYFORMAT is currently supported. If you think other formats should be supported, please raise an issue.");
          s = {
            method: "AES-128",
            keyUri: ft(this.path, A),
            iv: x,
            keyFormat: P
          };
        } else if (T === "SAMPLE-AES" || T === "SAMPLE-AES-CTR") {
          const A = w.get("uri");
          if (!A)
            throw new Error(`Invalid #EXT-X-KEY: ${T} requires a URI attribute.`);
          if ((w.get("keyformat") ?? "identity") === "identity")
            throw new Error("For SAMPLE-AES and SAMPLE-AES-CTR encryption, the 'identity' KEYFORMAT is not supported. If you think this format should be supported, please raise an issue.");
          let I = null;
          if (bl.test(A)) {
            const P = A.indexOf(","), S = Qr(A.slice(P + 1));
            if (S.length >= 8 && S[4] === 112 && S[5] === 115 && S[6] === 115 && S[7] === 104) {
              const E = Q(S).getUint32(0);
              I = Aa(S.subarray(8, Math.min(E, S.length)));
            }
          }
          s = {
            method: T,
            psshBox: I
          };
        } else
          throw new Error(`Unsupported encryption method '${T}'. If you think this method should be supported, please raise an issue.`);
      } else if (y.startsWith(ms)) {
        const w = y.slice(ms.length), T = Number(w);
        if (!Number.isInteger(T) || T < 0)
          throw new Error(`Invalid EXT-X-MEDIA-SEQUENCE value '${w}'.`);
        b(T);
      } else if (y.startsWith(ps)) {
        const w = m(y.slice(ps.length));
        if (w.offset === null) {
          if (l === null)
            throw new Error("Invalid M3U8 file; #EXT-X-BYTERANGE without offset requires a previous byte range.");
          w.offset = l;
        }
        d = w, l = w.offset + w.length;
      } else if (y.startsWith(gs)) {
        if (p)
          continue;
        const w = y.slice(gs.length), T = Date.parse(w);
        if (!Number.isFinite(T))
          continue;
        const A = T / 1e3;
        if (u === A)
          continue;
        if (u === null && this.segments.length > 0) {
          const x = ee(this.segments), I = x.timestamp + x.duration, P = A - I;
          for (const S of this.segments)
            S.timestamp += P, S.relativeToUnixEpoch = !0;
          i += P;
        }
        u = A, i = A;
      } else if (y === ll)
        o = null;
      else if (y.startsWith(ks)) {
        const w = y.slice(ks.length), T = Number(w);
        if (!Number.isFinite(T) || T < 0)
          throw new Error(`Invalid EXT-X-TARGETDURATION value '${w}'.`);
        this.refreshInterval = T, f = T;
      } else if (y === ul) {
        this.streamHasEnded = !0;
        break;
      } else y.startsWith(ys) && y.slice(ys.length).toLowerCase() === "vod" && (this.streamHasEnded = !0);
    }
    if (!t)
      throw new Error("Invalid M3U8 file; no #EXTM3U header.");
  }
  async getFirstSegment() {
    return this.segments.length === 0 && await this.runUpdateSegments(), this.segments[0] ?? null;
  }
  async getSegmentAt(e, t) {
    this.segments.length === 0 && await this.runUpdateSegments();
    let i = !!t.skipLiveWait && this.getRemainingWaitTimeMs() > 0;
    for (; ; ) {
      const n = K(this.segments, e, (a) => a.timestamp);
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
          const { psshBox: d } = t.encryption;
          return (d.keyIds === null || d.keyIds.includes(c.keyId)) && !l.some((u) => Sa(u, d)) && (l = [...l, d]), this.input._formatOptions.isobmff.resolveKeyId({ ...c, psshBoxes: l });
        })
      }
    }, a = new tr({
      source: new hl(t.location.path, async (c) => {
        g(c.isRoot);
        const l = {
          ...c,
          isRoot: !1
        };
        let d;
        const u = t.location.offset > 0 || t.location.length !== null;
        if (!t.encryption || t.encryption.method === "SAMPLE-AES" || t.encryption.method === "SAMPLE-AES-CTR") {
          if (d = await this.input._getSourceCached(l), u) {
            const h = d.source.slice(t.location.offset, t.location.length ?? void 0).ref();
            d.free(), d = h;
          }
        } else if (t.encryption.method === "AES-128") {
          const f = t.encryption;
          g(f.iv);
          let h = await this.input._getSourceCached(l);
          if (u) {
            const k = h.source.slice(t.location.offset, t.location.length ?? void 0).ref();
            h.free(), h = k;
          }
          const p = new Ur(h.source), m = xc(p, async () => {
            const b = { stack: [], error: void 0, hasError: !1 };
            try {
              const k = Ss(b, await this.input._getSourceCached({ path: f.keyUri, isRoot: !1 }, du), !1), w = await new Ur(k.source).requestSlice(0, Ne);
              if (!w)
                throw new Error("Invalid AES-128 key; expected at least 16 bytes of data.");
              return { key: z(w, Ne), iv: f.iv };
            } catch (k) {
              b.error = k, b.hasError = !0;
            } finally {
              xs(b);
            }
          }, () => {
            h.free();
          });
          d = new ml(m).ref();
        } else
          g(!1);
        return d;
      }),
      // Do not allow recursive HLS. Cool on paper, but allows for nasty infinite-depth request trees.
      formats: this.input._formats.filter((c) => !(c instanceof Ga)),
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
      const c = Zs(this.inputCache, (l) => l.age);
      g(c !== -1), this.inputCache.splice(c, 1);
    }
    return a;
  }
  async getLiveRefreshInterval() {
    return this.getRemainingWaitTimeMs() === 0 && await this.runUpdateSegments(), this.streamHasEnded ? null : this.refreshInterval;
  }
}
class wl extends at {
  constructor(e) {
    super(e), this.metadataPromise = null, this.trackBackings = null, this.internalTracks = null, this.segmentedInputs = [], this.hasMasterPlaylist = !0;
  }
  readMetadata() {
    return this.metadataPromise ??= (async () => {
      g(this.input._rootSource instanceof fi);
      const { rootPath: e } = this.input._rootSource, t = await this.input._reader.requestEntireFile();
      g(t);
      const i = co(t, t.length, { ignore: Va }), n = [], s = [];
      for (let u = 1; u < i.length; u++) {
        const f = i[u];
        if (f.startsWith(ls)) {
          const h = u, p = i[++u];
          if (p === void 0)
            throw new Error("Incorrect M3U8 file; a line must follow the #EXT-X-STREAM-INF tag.");
          const m = ft(e, p), b = new yr(f.slice(ls.length));
          if (b.getAsNumber("bandwidth") === null)
            throw new Error("Invalid M3U8 file; #EXT-X-STREAM-INF tag requires a BANDWIDTH attribute with a valid numerical value.");
          n.push({
            fullPath: m,
            attributes: b,
            lineNumber: h,
            hasOnlyKeyPackets: !1
          });
        } else if (f.startsWith(us)) {
          const h = new yr(f.slice(us.length)), p = h.get("uri");
          if (p === null)
            throw new Error("Invalid M3U8 file; #EXT-X-I-FRAME-STREAM-INF tag requires a URI attribute.");
          if (h.getAsNumber("bandwidth") === null)
            throw new Error("Invalid M3U8 file; #EXT-X-I-FRAME-STREAM-INF tag requires a BANDWIDTH attribute with a valid numerical value.");
          const b = ft(e, p);
          n.push({
            fullPath: b,
            attributes: h,
            lineNumber: u,
            hasOnlyKeyPackets: !0
          });
        } else if (f.startsWith(ds)) {
          const h = new yr(f.slice(ds.length));
          if (h.get("type") === null)
            throw new Error("Invalid M3U8 file; #EXT-X-MEDIA tag requires a TYPE attribute.");
          if (h.get("group-id") === null)
            throw new Error("Invalid M3U8 file; #EXT-X-MEDIA tag requires a GROUP-ID attribute.");
          let b = null;
          const k = h.get("uri");
          k !== null && (b = ft(e, k)), s.push({ fullPath: b, attributes: h, lineNumber: u });
        } else if (f !== dl) {
          if (f.startsWith(en)) {
            const h = new Ps(this, e, null, i);
            this.segmentedInputs = [h], this.hasMasterPlaylist = !1, this.trackBackings = await h.getTrackBackings();
            return;
          }
        }
      }
      const a = [
        ...new Set(s.filter((u) => u.attributes.get("type").toLowerCase() === "video").map((u) => u.attributes.get("group-id")))
      ], o = [
        ...new Set(s.filter((u) => u.attributes.get("type").toLowerCase() === "audio").map((u) => u.attributes.get("group-id")))
      ], c = await Promise.all(n.map(async (u, f) => {
        const h = [], p = u.attributes.get("codecs");
        let m;
        if (p)
          m = p.split(",").map((S) => S.trim());
        else {
          const E = await this.getSegmentedInputForPath(u.fullPath).getTrackBackings(), D = await Promise.all(E.map(async (B) => ({ track: B, codec: await B.getCodec() })));
          m = await Promise.all(D.filter((B) => B.codec !== null).map((B) => B.track.getDecoderConfig().then((O) => O.codec)));
        }
        const b = u.attributes.get("video"), k = u.attributes.get("audio"), y = m.some((S) => Ae.includes(gt(S))), w = m.some((S) => Se.includes(gt(S)));
        if (b !== null && !y) {
          if (!a.includes(b))
            throw new Error(`Invalid M3U8 file; variant stream references video group "${b}" which is not defined in any #EXT-X-MEDIA tags.`);
          const S = s.find((E) => {
            const D = E.attributes.get("group-id"), B = E.attributes.get("type");
            return D === b && B.toLowerCase() === "video";
          });
          e: if (S) {
            const E = S.attributes.get("uri");
            if (E === null)
              break e;
            const D = ft(e, E), W = (await this.getSegmentedInputForPath(D).getTrackBackings()).find((M) => M.getType() === "video");
            if (!W || await W.getCodec() === null)
              break e;
            const U = await W.getDecoderConfig().then((M) => M?.codec ?? null);
            g(U !== null), m.push(U);
          }
        }
        if (k !== null && !w) {
          if (!o.includes(k))
            throw new Error(`Invalid M3U8 file; variant stream references audio group "${k}" which is not defined in any #EXT-X-MEDIA tags.`);
          const S = s.find((E) => {
            const D = E.attributes.get("group-id"), B = E.attributes.get("type");
            return D === k && B.toLowerCase() === "audio";
          });
          e: if (S) {
            const E = S.attributes.get("uri");
            if (E === null)
              break e;
            const D = ft(e, E), W = (await this.getSegmentedInputForPath(D).getTrackBackings()).find((M) => M.getType() === "audio");
            if (!W || await W.getCodec() === null)
              break e;
            const U = await W.getDecoderConfig().then((M) => M?.codec ?? null);
            g(U !== null), m.push(U);
          }
        }
        m = [...new Set(m)];
        let T = null, A = null;
        const x = u.attributes.getAsNumber("bandwidth");
        g(x !== null);
        const I = u.attributes.getAsNumber("average-bandwidth"), P = u.attributes.get("name");
        for (const S of m) {
          const E = gt(S);
          if (E !== null) {
            if (Ae.includes(E)) {
              if (T !== null)
                throw new Error("Unsupported M3U8 file; multiple video codecs found in the CODECS attribute of a variant stream.");
              T = S;
              const D = u.attributes.get("video");
              if (D === null) {
                const B = u.attributes.get("resolution");
                let O = null, W = null;
                if (B) {
                  const U = B.match(/^(\d+)x(\d+)$/);
                  U && (O = Number(U[1]), W = Number(U[2]));
                }
                h.push({
                  id: -1,
                  demuxer: this,
                  backingTrack: null,
                  default: !0,
                  autoselect: !0,
                  languageCode: de,
                  lineNumber: u.lineNumber,
                  fullPath: u.fullPath,
                  fullCodecString: T,
                  pairingMask: 1n << BigInt(f),
                  peakBitrate: x,
                  averageBitrate: I,
                  name: P,
                  hasOnlyKeyPackets: u.hasOnlyKeyPackets,
                  info: {
                    type: "video",
                    width: O,
                    height: W
                  }
                });
              } else {
                if (!a.includes(D))
                  throw new Error(`Invalid M3U8 file; variant stream references video group "${D}" which is not defined in any #EXT-X-MEDIA tags.`);
                for (const B of s) {
                  const O = B.attributes.get("group-id"), W = B.attributes.get("type");
                  if (O !== D || W.toLowerCase() !== "video")
                    continue;
                  const U = B.attributes.get("resolution") ?? u.attributes.get("resolution");
                  let M = null, L = null;
                  if (U) {
                    const X = U.match(/^(\d+)x(\d+)$/);
                    X && (M = Number(X[1]), L = Number(X[2]));
                  }
                  h.push({
                    id: -1,
                    demuxer: this,
                    backingTrack: null,
                    default: Rr(B.attributes),
                    // Autoselect is inferred to be true if the default is true
                    autoselect: Rr(B.attributes) || Cs(B.attributes),
                    languageCode: Is(B.attributes.get("language")),
                    lineNumber: B.lineNumber,
                    fullPath: B.fullPath ?? u.fullPath,
                    fullCodecString: T,
                    pairingMask: 1n << BigInt(f),
                    peakBitrate: null,
                    averageBitrate: null,
                    name: B.attributes.get("name"),
                    hasOnlyKeyPackets: u.hasOnlyKeyPackets,
                    info: {
                      type: "video",
                      width: M,
                      height: L
                    }
                  });
                }
              }
            } else if (Se.includes(E)) {
              if (A !== null)
                throw new Error("Unsupported M3U8 file; multiple audio codecs found in the CODECS attribute of a variant stream.");
              A = S;
              const D = u.attributes.get("audio");
              if (D === null) {
                const B = u.attributes.get("channels"), O = B !== null ? Number(B.split("/")[0]) : null;
                h.push({
                  id: -1,
                  demuxer: this,
                  backingTrack: null,
                  default: !0,
                  autoselect: !0,
                  languageCode: de,
                  lineNumber: u.lineNumber,
                  fullPath: u.fullPath,
                  fullCodecString: A,
                  pairingMask: 1n << BigInt(f),
                  peakBitrate: x,
                  averageBitrate: I,
                  name: P,
                  hasOnlyKeyPackets: u.hasOnlyKeyPackets,
                  info: {
                    type: "audio",
                    numberOfChannels: O !== null && Number.isInteger(O) && O > 0 ? O : null
                  }
                });
              } else {
                if (!o.includes(D))
                  throw new Error(`Invalid M3U8 file; variant stream references audio group "${D}" which is not defined in any #EXT-X-MEDIA tags.`);
                for (const B of s) {
                  const O = B.attributes.get("group-id"), W = B.attributes.get("type");
                  if (O !== D || W.toLowerCase() !== "audio")
                    continue;
                  const U = B.attributes.get("channels") ?? u.attributes.get("channels"), M = U !== null ? Number(U.split("/")[0]) : null;
                  h.push({
                    id: -1,
                    demuxer: this,
                    backingTrack: null,
                    default: Rr(B.attributes),
                    // Autoselect is inferred to be true if the default is true
                    autoselect: Rr(B.attributes) || Cs(B.attributes),
                    languageCode: Is(B.attributes.get("language")),
                    lineNumber: B.lineNumber,
                    fullPath: B.fullPath ?? u.fullPath,
                    fullCodecString: A,
                    pairingMask: 1n << BigInt(f),
                    peakBitrate: null,
                    averageBitrate: null,
                    name: B.attributes.get("name"),
                    hasOnlyKeyPackets: u.hasOnlyKeyPackets,
                    info: {
                      type: "audio",
                      numberOfChannels: M !== null && Number.isInteger(M) && M > 0 ? M : null
                    }
                  });
                }
              }
            }
          }
        }
        return h;
      })), l = [], d = (u) => {
        const f = l.find((h) => h.fullPath === u.fullPath && h.info.type === u.info.type);
        f ? (f.pairingMask |= u.pairingMask, f.default ||= u.default, f.autoselect ||= u.autoselect, f.lineNumber = Math.min(f.lineNumber, u.lineNumber), u.peakBitrate !== null && (f.peakBitrate = Math.max(f.peakBitrate ?? -1 / 0, u.peakBitrate)), u.averageBitrate !== null && (f.averageBitrate = Math.max(f.averageBitrate ?? -1 / 0, u.averageBitrate)), f.languageCode === de && (f.languageCode = u.languageCode)) : (u.id = l.length + 1, l.push(u));
      };
      for (const u of c)
        for (const f of u)
          d(f);
      l.sort((u, f) => u.lineNumber - f.lineNumber), this.trackBackings = [];
      for (const u of l)
        u.info.type === "video" ? this.trackBackings.push(new qa(u)) : this.trackBackings.push(new Ka(u));
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
    }))), t = new Ps(this, e, i, null), this.segmentedInputs.push(t), t;
  }
  async getMetadataTags() {
    return {};
  }
  async getMimeType() {
    return Na;
  }
  dispose() {
    if (this.segmentedInputs) {
      for (const e of this.segmentedInputs)
        e.dispose();
      this.segmentedInputs.length = 0;
    }
  }
}
class Ha {
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
      else if (this instanceof qa) {
        for (const s of n)
          if (await s.getCodec() === this.getCodec()) {
            t = s;
            break;
          }
      } else {
        g(this instanceof Ka);
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
      ...st,
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
class qa extends Ha {
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
    return gt(this.internalTrack.fullCodecString);
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
class Ka extends Ha {
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
    return gt(this.internalTrack.fullCodecString);
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
const Rr = (r) => {
  const e = r.get("default");
  if (e === null)
    return !1;
  const t = e.toUpperCase();
  if (t === "YES")
    return !0;
  if (t === "NO")
    return !1;
  throw new Error(`Invalid M3U8 file; #EXT-X-MEDIA DEFAULT attribute must be YES or NO, got "${e}".`);
}, Cs = (r) => {
  const e = r.get("autoselect");
  if (e === null)
    return !1;
  const t = e.toUpperCase();
  if (t === "YES")
    return !0;
  if (t === "NO")
    return !1;
  throw new Error(`Invalid M3U8 file; #EXT-X-MEDIA AUTOSELECT attribute must be YES or NO, got "${e}".`);
}, Is = (r) => {
  if (r === null)
    return de;
  const e = r.split("-")[0];
  return e || de;
};
class qe {
  constructor() {
    this._isIsobmff = !1;
  }
}
class ja extends qe {
  constructor() {
    super(...arguments), this._isIsobmff = !0;
  }
  /** @internal */
  async _getMajorBrand(e) {
    let t = e._reader.requestSlice(0, 12);
    if (t instanceof Promise && (t = await t), !t)
      return null;
    t.skip(4);
    const i = te(t, 4);
    return i !== "ftyp" && i !== "styp" ? null : te(t, 4);
  }
  /** @internal */
  _createDemuxer(e) {
    return new In(e);
  }
}
class Tl extends ja {
  /** @internal */
  async _canReadInput(e) {
    const t = await this._getMajorBrand(e);
    if (t !== null)
      return t !== "qt  ";
    let i = e._reader.requestSlice(4, 4);
    return i instanceof Promise && (i = await i), i ? te(i, 4) === "moof" : !1;
  }
  get name() {
    return "MP4";
  }
  get mimeType() {
    return "video/mp4";
  }
}
class Al extends ja {
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
class Qa extends qe {
  /** @internal */
  async isSupportedEBMLOfDocType(e, t) {
    let i = e._reader.requestSlice(0, Ze);
    if (i instanceof Promise && (i = await i), !i)
      return !1;
    const n = va(i);
    if (n === null || n < 1 || n > 8 || q(i, n) !== C.EBML)
      return !1;
    const a = Ba(i);
    if (typeof a != "number")
      return !1;
    let o = e._reader.requestSlice(i.filePos, a);
    if (o instanceof Promise && (o = await o), !o)
      return !1;
    const c = i.filePos;
    for (; o.filePos <= c + a - Ee; ) {
      const l = $e(o);
      if (!l)
        break;
      const { id: d, size: u } = l, f = o.filePos;
      if (u === void 0)
        return !1;
      switch (d) {
        case C.EBMLVersion:
          if (q(o, u) !== 1)
            return !1;
          break;
        case C.EBMLReadVersion:
          if (q(o, u) !== 1)
            return !1;
          break;
        case C.DocType:
          if (Wt(o, u) !== t)
            return !1;
          break;
        case C.DocTypeVersion:
          if (q(o, u) > 4)
            return !1;
          break;
      }
      o.filePos = f + u;
    }
    return !0;
  }
  /** @internal */
  _canReadInput(e) {
    return this.isSupportedEBMLOfDocType(e, "matroska");
  }
  /** @internal */
  _createDemuxer(e) {
    return new Mc(e);
  }
  get name() {
    return "Matroska";
  }
  get mimeType() {
    return "video/x-matroska";
  }
}
class Sl extends Qa {
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
class xl extends qe {
  /** @internal */
  async _canReadInput(e) {
    let t = 0;
    for (; ; ) {
      let u = e._reader.requestSlice(t, nt);
      if (u instanceof Promise && (u = await u), !u)
        break;
      const f = Ft(u);
      if (!f)
        break;
      t = u.filePos + f.size;
    }
    const i = await Zi(e._reader, t, t + 4096);
    if (!i)
      return !1;
    const n = i.header, s = sa(n.mpegVersionId, n.channel);
    let a = e._reader.requestSlice(i.startPos + s, 4);
    if (a instanceof Promise && (a = await a), !a)
      return !1;
    const o = v(a);
    if (o === ia || o === na)
      return !0;
    t = i.startPos + i.header.totalSize;
    const l = await Zi(e._reader, t, t + Et);
    if (!l)
      return !1;
    const d = l.header;
    return !(n.channel !== d.channel || n.sampleRate !== d.sampleRate);
  }
  /** @internal */
  _createDemuxer(e) {
    return new Oc(e);
  }
  get name() {
    return "MP3";
  }
  get mimeType() {
    return "audio/mpeg";
  }
}
class Pl extends qe {
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
    return new Qc(e);
  }
  get name() {
    return "WAVE";
  }
  get mimeType() {
    return "audio/wav";
  }
}
class Cl extends qe {
  /** @internal */
  async _canReadInput(e) {
    let t = e._reader.requestSlice(0, 4);
    return t instanceof Promise && (t = await t), t ? te(t, 4) === "OggS" : !1;
  }
  /** @internal */
  _createDemuxer(e) {
    return new Kc(e);
  }
  get name() {
    return "Ogg";
  }
  get mimeType() {
    return "application/ogg";
  }
}
class Il extends qe {
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
    return new il(e);
  }
}
class El extends qe {
  /** @internal */
  async _canReadInput(e) {
    let t = 0;
    for (; ; ) {
      let a = e._reader.requestSlice(t, nt);
      if (a instanceof Promise && (a = await a), !a)
        break;
      const o = Ft(a);
      if (!o)
        break;
      t = a.filePos + o.size;
    }
    let i = e._reader.requestSliceRange(t, Jr, _t);
    if (i instanceof Promise && (i = await i), !i)
      return !1;
    const n = Bt(i);
    if (!n || (t += n.frameLength, i = e._reader.requestSliceRange(t, Jr, _t), i instanceof Promise && (i = await i), !i))
      return !1;
    const s = Bt(i);
    return s ? n.objectType === s.objectType && n.samplingFrequencyIndex === s.samplingFrequencyIndex && n.channelConfiguration === s.channelConfiguration : !1;
  }
  /** @internal */
  _createDemuxer(e) {
    return new Xc(e);
  }
  get name() {
    return "ADTS";
  }
  get mimeType() {
    return "audio/aac";
  }
}
class _l extends qe {
  /** @internal */
  async _canReadInput(e) {
    const t = ye + 16 + 1;
    let i = e._reader.requestSlice(0, t);
    if (i instanceof Promise && (i = await i), !i)
      return !1;
    const n = z(i, t);
    return n[0] === 71 && n[ye] === 71 || n[0] === 71 && n[ye + 16] === 71 ? !0 : n[4] === 71 && n[4 + ye + 4] === 71;
  }
  /** @internal */
  _createDemuxer(e) {
    return new al(e);
  }
  get name() {
    return "MPEG Transport Stream";
  }
  get mimeType() {
    return "video/MP2T";
  }
}
class Ga extends qe {
  /** @internal */
  async _canReadInput(e) {
    let t = e._reader.requestSlice(0, 7);
    if (t instanceof Promise && (t = await t), !t || !(te(t, 7) === "#EXTM3U"))
      return !1;
    if (!(e._rootSource instanceof fi))
      throw new TypeError("HLS inputs require `InputOptions.source` to be a PathedSource or a ref to one.");
    return e._rootSource._usedForHls = !0, !0;
  }
  /** @internal */
  _createDemuxer(e) {
    return new wl(e);
  }
  get name() {
    return "HTTP Live Streaming (HLS)";
  }
  get mimeType() {
    return Na;
  }
}
const vl = /* @__PURE__ */ new Tl(), Bl = /* @__PURE__ */ new Al(), Fl = /* @__PURE__ */ new Qa(), Rl = /* @__PURE__ */ new Sl(), Ml = /* @__PURE__ */ new xl(), zl = /* @__PURE__ */ new Pl(), Dl = /* @__PURE__ */ new Cl(), Ol = /* @__PURE__ */ new El(), Nl = /* @__PURE__ */ new Il(), Vl = /* @__PURE__ */ new _l(), Ul = /* @__PURE__ */ new Ga(), Es = [Ul, vl, Bl, Fl, Rl, zl, Dl, Nl, Ml, Ol, Vl], Wl = (r, e) => {
  if (!r || typeof r != "object")
    throw new TypeError(`${e}, when provided, must be an object.`);
  if (r.isobmff !== void 0) {
    if (!r.isobmff || typeof r.isobmff != "object")
      throw new TypeError(`${e}.isobmff, when provided, must be an object.`);
    if (r.isobmff.resolveKeyId !== void 0 && typeof r.isobmff.resolveKeyId != "function")
      throw new TypeError(`${e}.isobmff.resolveKeyId, when provided, must be a function.`);
  }
};
const _s = /* @__PURE__ */ new Map(), Ll = (r, e) => {
  if (!e || typeof e != "object")
    throw new TypeError("options must be an object.");
  if (e.codec !== void 0 && typeof e.codec != "string")
    throw new TypeError("options.codec, when provided, must be a string.");
  if (e.codec !== void 0 && gt(e.codec) !== r)
    throw new TypeError(`options.codec, when provided, must match the specified codec (${r}).`);
  if (e.numberOfChannels !== void 0 && (!Number.isInteger(e.numberOfChannels) || e.numberOfChannels <= 0))
    throw new TypeError("options.numberOfChannels, when provided, must be a positive integer.");
  if (e.sampleRate !== void 0 && (!Number.isInteger(e.sampleRate) || e.sampleRate <= 0))
    throw new TypeError("options.sampleRate, when provided, must be a positive integer.");
  if (e.description !== void 0 && !Cr(e.description))
    throw new TypeError("options.description, when provided, must be a buffer source.");
}, Hl = async (r, e = {}) => {
  if (!Se.includes(r))
    return !1;
  Ll(r, e);
  const t = {
    ...e,
    numberOfChannels: e.numberOfChannels ?? 2,
    sampleRate: e.sampleRate ?? 48e3,
    codec: e.codec ?? ta(r, 2, 48e3)
  };
  if (t.description === void 0) {
    const a = Lo(t);
    if (a === !1)
      return !1;
    t.description = a;
  }
  const i = JSON.stringify(t), n = _s.get(i);
  if (n)
    return n;
  const s = (async () => vn.some((o) => o.supports(r, t)) || fe.includes(r) ? !0 : typeof AudioDecoder > "u" ? !1 : (await AudioDecoder.isConfigSupported(t)).supported === !0)();
  return _s.set(i, s), s;
};
pn();
let vs = -1 / 0, Bs = -1 / 0, xr = null;
typeof FinalizationRegistry < "u" && (xr = new FinalizationRegistry((r) => {
  const e = performance.now();
  r.type === "video" ? (e - vs >= 1e3 && (console.error("A VideoSample was garbage collected without first being closed. For proper resource management, make sure to call close() on all your VideoSamples as soon as you're done using them."), vs = e), typeof VideoFrame < "u" && r.data instanceof VideoFrame && r.data.close()) : (e - Bs >= 1e3 && (console.error("An AudioSample was garbage collected without first being closed. For proper resource management, make sure to call close() on all your AudioSamples as soon as you're done using them."), Bs = e), typeof AudioData < "u" && r.data instanceof AudioData && r.data.close());
}));
const Xa = [
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
], ql = new Set(Xa);
class ae {
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
    return Math.trunc(ht * this.timestamp);
  }
  /** The duration of the frame in microseconds. */
  get microsecondDuration() {
    return Math.trunc(ht * this.duration);
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
      if (t.format === void 0 || !ql.has(t.format))
        throw new TypeError("init.format must be one of: " + Xa.join(", "));
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
        for (const i of t.layout) {
          if (!i || typeof i != "object" || Array.isArray(i))
            throw new TypeError("Each entry in init.layout must be an object.");
          if (!Number.isInteger(i.offset) || i.offset < 0)
            throw new TypeError("plane.offset must be a non-negative integer.");
          if (!Number.isInteger(i.stride) || i.stride < 0)
            throw new TypeError("plane.stride must be a non-negative integer.");
        }
      }
      if (t.visibleRect !== void 0 && Qn(t.visibleRect, "init.visibleRect"), t.displayWidth !== void 0 && (!Number.isInteger(t.displayWidth) || t.displayWidth <= 0))
        throw new TypeError("init.displayWidth, when provided, must be a positive integer.");
      if (t.displayHeight !== void 0 && (!Number.isInteger(t.displayHeight) || t.displayHeight <= 0))
        throw new TypeError("init.displayHeight, when provided, must be a positive integer.");
      if (t.displayWidth !== void 0 != (t.displayHeight !== void 0))
        throw new TypeError("init.displayWidth and init.displayHeight must be either both provided or both omitted.");
      this._data = pe(e).slice(), this._layout = t.layout ?? Kl(t.format, t.codedWidth, t.codedHeight), this.format = t.format, this.rotation = t.rotation ?? 0, this.timestamp = t.timestamp, this.duration = t.duration ?? 0, this.colorSpace = new _i(t.colorSpace), this.visibleRect = {
        left: t.visibleRect?.left ?? 0,
        top: t.visibleRect?.top ?? 0,
        width: t.visibleRect?.width ?? t.codedWidth,
        height: t.visibleRect?.height ?? t.codedHeight
      }, t.displayWidth !== void 0 ? (this.squarePixelWidth = this.rotation % 180 === 0 ? t.displayWidth : t.displayHeight, this.squarePixelHeight = this.rotation % 180 === 0 ? t.displayHeight : t.displayWidth) : (this.squarePixelWidth = this.codedWidth, this.squarePixelHeight = this.codedHeight);
    } else if (typeof VideoFrame < "u" && e instanceof VideoFrame) {
      if (t?.rotation !== void 0 && ![0, 90, 180, 270].includes(t.rotation))
        throw new TypeError("init.rotation, when provided, must be 0, 90, 180, or 270.");
      if (t?.timestamp !== void 0 && !Number.isFinite(t?.timestamp))
        throw new TypeError("init.timestamp, when provided, must be a number.");
      if (t?.duration !== void 0 && (!Number.isFinite(t.duration) || t.duration < 0))
        throw new TypeError("init.duration, when provided, must be a non-negative number.");
      t?.visibleRect !== void 0 && Qn(t.visibleRect, "init.visibleRect"), this._data = e, this._layout = null, this.format = e.format, this.visibleRect = {
        left: e.visibleRect?.x ?? 0,
        top: e.visibleRect?.y ?? 0,
        width: e.visibleRect?.width ?? e.codedWidth,
        height: e.visibleRect?.height ?? e.codedHeight
      }, this.rotation = t?.rotation ?? 0, this.squarePixelWidth = e.displayWidth, this.squarePixelHeight = e.displayHeight, this.timestamp = t?.timestamp ?? e.timestamp / 1e6, this.duration = t?.duration ?? (e.duration ?? 0) / 1e6, this.colorSpace = new _i(e.colorSpace);
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
          timestamp: Math.trunc(t.timestamp * ht),
          // Drag 0 to undefined
          duration: Math.trunc((t.duration ?? 0) * ht) || void 0
        }), t);
      let i = 0, n = 0;
      if ("naturalWidth" in e ? (i = e.naturalWidth, n = e.naturalHeight) : "videoWidth" in e ? (i = e.videoWidth, n = e.videoHeight) : "width" in e && (i = Number(e.width), n = Number(e.height)), !i || !n)
        throw new TypeError("Could not determine dimensions.");
      const s = new OffscreenCanvas(i, n), a = s.getContext("2d", {
        alpha: Jt(),
        // Firefox has VideoFrame glitches with opaque canvases
        willReadFrequently: !0
      });
      g(a), a.drawImage(e, 0, 0), this._data = s, this._layout = null, this.format = "RGBX", this.visibleRect = { left: 0, top: 0, width: i, height: n }, this.squarePixelWidth = i, this.squarePixelHeight = n, this.rotation = t.rotation ?? 0, this.timestamp = t.timestamp, this.duration = t.duration ?? 0, this.colorSpace = new _i({
        matrix: "rgb",
        primaries: "bt709",
        transfer: "iec61966-2-1",
        fullRange: !0
      });
    } else
      throw new TypeError("Invalid data type: Must be a BufferSource or CanvasImageSource.");
    this.pixelAspectRatio = Gr({
      num: this.squarePixelWidth * this.codedHeight,
      den: this.squarePixelHeight * this.codedWidth
    }), xr?.register(this, { type: "video", data: this._data }, this);
  }
  /** Clones this video sample. */
  clone() {
    if (this._closed)
      throw new Error("VideoSample is closed.");
    return g(this._data !== null), wt(this._data) ? new ae(this._data.clone(), {
      timestamp: this.timestamp,
      duration: this.duration,
      rotation: this.rotation
    }) : this._data instanceof Uint8Array ? (g(this._layout), new ae(this._data, {
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
      displayHeight: this.displayHeight
    })) : new ae(this._data, {
      format: this.format,
      codedWidth: this.codedWidth,
      codedHeight: this.codedHeight,
      timestamp: this.timestamp,
      duration: this.duration,
      colorSpace: this.colorSpace,
      rotation: this.rotation,
      visibleRect: this.visibleRect,
      displayWidth: this.displayWidth,
      displayHeight: this.displayHeight
    });
  }
  /**
   * Closes this video sample, releasing held resources. Video samples should be closed as soon as they are not
   * needed anymore.
   */
  close() {
    this._closed || (xr?.unregister(this), wt(this._data) ? this._data.close() : this._data = null, this._closed = !0);
  }
  /**
   * Returns the number of bytes required to hold this video sample's pixel data. Throws if `format` is `null`.
   */
  allocationSize(e = {}) {
    if (Fs(e), this._closed)
      throw new Error("VideoSample is closed.");
    if (this.format === null)
      throw new Error("Cannot get allocation size when format is null. Sorry!");
    if (g(this._data !== null), !wt(this._data) && (e.colorSpace || e.format && e.format !== this.format || e.layout || e.rect)) {
      const t = this.toVideoFrame(), i = t.allocationSize(e);
      return t.close(), i;
    }
    return wt(this._data) ? this._data.allocationSize(e) : this._data instanceof Uint8Array ? this._data.byteLength : this.codedWidth * this.codedHeight * 4;
  }
  /**
   * Copies this video sample's pixel data to an ArrayBuffer or ArrayBufferView. Throws if `format` is `null`.
   * @returns The byte layout of the planes of the copied data.
   */
  async copyTo(e, t = {}) {
    if (!Cr(e))
      throw new TypeError("destination must be an ArrayBuffer or an ArrayBuffer view.");
    if (Fs(t), this._closed)
      throw new Error("VideoSample is closed.");
    if (this.format === null)
      throw new Error("Cannot copy video sample data when format is null. Sorry!");
    if (g(this._data !== null), !wt(this._data) && (t.colorSpace || t.format && t.format !== this.format || t.layout || t.rect)) {
      const i = this.toVideoFrame(), n = await i.copyTo(e, t);
      return i.close(), n;
    }
    if (wt(this._data))
      return this._data.copyTo(e, t);
    if (this._data instanceof Uint8Array)
      return g(this._layout), pe(e).set(this._data), this._layout;
    {
      const n = this._data.getContext("2d");
      g(n);
      const s = n.getImageData(0, 0, this.codedWidth, this.codedHeight);
      return pe(e).set(s.data), [{
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
    return g(this._data !== null), wt(this._data) ? new VideoFrame(this._data, {
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
  draw(e, t, i, n, s, a, o, c, l) {
    let d = 0, u = 0, f = this.displayWidth, h = this.displayHeight, p = 0, m = 0, b = this.displayWidth, k = this.displayHeight;
    if (a !== void 0 ? (d = t, u = i, f = n, h = s, p = a, m = o, c !== void 0 ? (b = c, k = l) : (b = f, k = h)) : (p = t, m = i, n !== void 0 && (b = n, k = s)), !(typeof CanvasRenderingContext2D < "u" && e instanceof CanvasRenderingContext2D || typeof OffscreenCanvasRenderingContext2D < "u" && e instanceof OffscreenCanvasRenderingContext2D))
      throw new TypeError("context must be a CanvasRenderingContext2D or OffscreenCanvasRenderingContext2D.");
    if (!Number.isFinite(d))
      throw new TypeError("sx must be a number.");
    if (!Number.isFinite(u))
      throw new TypeError("sy must be a number.");
    if (!Number.isFinite(f) || f < 0)
      throw new TypeError("sWidth must be a non-negative number.");
    if (!Number.isFinite(h) || h < 0)
      throw new TypeError("sHeight must be a non-negative number.");
    if (!Number.isFinite(p))
      throw new TypeError("dx must be a number.");
    if (!Number.isFinite(m))
      throw new TypeError("dy must be a number.");
    if (!Number.isFinite(b) || b < 0)
      throw new TypeError("dWidth must be a non-negative number.");
    if (!Number.isFinite(k) || k < 0)
      throw new TypeError("dHeight must be a non-negative number.");
    if (this._closed)
      throw new Error("VideoSample is closed.");
    ({ sx: d, sy: u, sWidth: f, sHeight: h } = this._rotateSourceRegion(d, u, f, h, this.rotation));
    const y = this.toCanvasImageSource();
    e.save();
    const w = p + b / 2, T = m + k / 2;
    e.translate(w, T), e.rotate(this.rotation * Math.PI / 180);
    const A = this.rotation % 180 === 0 ? 1 : b / k;
    e.scale(1 / A, A), e.drawImage(y, d, u, f, h, -b / 2, -k / 2, b, k), e.restore();
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
    t.crop !== void 0 && mi(t.crop, "options.");
    const i = e.canvas.width, n = e.canvas.height, s = t.rotation ?? this.rotation, [a, o] = s % 180 === 0 ? [this.squarePixelWidth, this.squarePixelHeight] : [this.squarePixelHeight, this.squarePixelWidth];
    t.crop && hi(t.crop, a, o);
    let c, l, d, u;
    const { sx: f, sy: h, sWidth: p, sHeight: m } = this._rotateSourceRegion(t.crop?.left ?? 0, t.crop?.top ?? 0, t.crop?.width ?? a, t.crop?.height ?? o, s);
    if (t.fit === "fill")
      c = 0, l = 0, d = i, u = n;
    else {
      const [k, y] = t.crop ? [t.crop.width, t.crop.height] : [a, o], w = t.fit === "contain" ? Math.min(i / k, n / y) : Math.max(i / k, n / y);
      d = k * w, u = y * w, c = (i - d) / 2, l = (n - u) / 2;
    }
    e.save();
    const b = s % 180 === 0 ? 1 : d / u;
    e.translate(i / 2, n / 2), e.rotate(s * Math.PI / 180), e.scale(1 / b, b), e.translate(-i / 2, -n / 2), e.drawImage(this.toCanvasImageSource(), f, h, p, m, c, l, d, u), e.restore();
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
   * Converts this video sample to a
   * [`CanvasImageSource`](https://udn.realityripple.com/docs/Web/API/CanvasImageSource) for drawing to a canvas.
   *
   * You must use the value returned by this method immediately, as any VideoFrame created internally will
   * automatically be closed in the next microtask.
   */
  toCanvasImageSource() {
    if (this._closed)
      throw new Error("VideoSample is closed.");
    if (g(this._data !== null), this._data instanceof Uint8Array) {
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
class _i {
  /** Creates a new VideoSampleColorSpace. */
  constructor(e) {
    if (e !== void 0) {
      if (!e || typeof e != "object")
        throw new TypeError("init.colorSpace, when provided, must be an object.");
      const t = Object.keys(rr);
      if (e.primaries != null && !t.includes(e.primaries))
        throw new TypeError(`init.colorSpace.primaries, when provided, must be one of ${t.join(", ")}.`);
      const i = Object.keys(ir);
      if (e.transfer != null && !i.includes(e.transfer))
        throw new TypeError(`init.colorSpace.transfer, when provided, must be one of ${i.join(", ")}.`);
      const n = Object.keys(nr);
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
const wt = (r) => typeof VideoFrame < "u" && r instanceof VideoFrame, hi = (r, e, t) => {
  const i = Math.min(r.left, e), n = Math.min(r.top, t), s = Math.min(r.width, e - i), a = Math.min(r.height, t - n);
  return g(s >= 0), g(a >= 0), { left: i, top: n, width: s, height: a };
}, mi = (r, e) => {
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
}, Fs = (r) => {
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
}, Kl = (r, e, t) => {
  const i = jl(r), n = [];
  let s = 0;
  for (const a of i) {
    const o = Math.ceil(e / a.widthDivisor), c = Math.ceil(t / a.heightDivisor), l = o * a.sampleBytes, d = l * c;
    n.push({
      offset: s,
      stride: l
    }), s += d;
  }
  return n;
}, jl = (r) => {
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
      rt(r), g(!1);
  }
}, vi = /* @__PURE__ */ new Set(["f32", "f32-planar", "s16", "s16-planar", "s32", "s32-planar", "u8", "u8-planar"]);
class me {
  /** The presentation timestamp of the sample in microseconds. */
  get microsecondTimestamp() {
    return Math.trunc(ht * this.timestamp);
  }
  /** The duration of the sample in microseconds. */
  get microsecondDuration() {
    return Math.trunc(ht * this.duration);
  }
  /**
   * Creates a new {@link AudioSample}, either from an existing
   * [`AudioData`](https://developer.mozilla.org/en-US/docs/Web/API/AudioData) or from raw bytes specified in
   * {@link AudioSampleInit}.
   */
  constructor(e) {
    if (this._closed = !1, or(e)) {
      if (e.format === null)
        throw new TypeError("AudioData with null format is not supported.");
      this._data = e, this.format = e.format, this.sampleRate = e.sampleRate, this.numberOfFrames = e.numberOfFrames, this.numberOfChannels = e.numberOfChannels, this.timestamp = e.timestamp / 1e6, this.duration = e.numberOfFrames / e.sampleRate;
    } else {
      if (!e || typeof e != "object")
        throw new TypeError("Invalid AudioDataInit: must be an object.");
      if (!vi.has(e.format))
        throw new TypeError("Invalid AudioDataInit: invalid format.");
      if (!Number.isFinite(e.sampleRate) || e.sampleRate <= 0)
        throw new TypeError("Invalid AudioDataInit: sampleRate must be > 0.");
      if (!Number.isInteger(e.numberOfChannels) || e.numberOfChannels === 0)
        throw new TypeError("Invalid AudioDataInit: numberOfChannels must be an integer > 0.");
      if (!Number.isFinite(e?.timestamp))
        throw new TypeError("init.timestamp must be a number.");
      const t = e.data.byteLength / (St(e.format) * e.numberOfChannels);
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
      const n = this.numberOfFrames * this.numberOfChannels * St(this.format);
      if (i.byteLength < n)
        throw new TypeError("Invalid AudioDataInit: insufficient data size.");
      this._data = i;
    }
    xr?.register(this, { type: "audio", data: this._data }, this);
  }
  /** Returns the number of bytes required to hold the audio sample's data as specified by the given options. */
  allocationSize(e) {
    if (!e || typeof e != "object")
      throw new TypeError("options must be an object.");
    if (!Number.isInteger(e.planeIndex) || e.planeIndex < 0)
      throw new TypeError("planeIndex must be a non-negative integer.");
    if (e.format !== void 0 && !vi.has(e.format))
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
    const s = St(t), a = qt(t);
    if (a && e.planeIndex >= this.numberOfChannels)
      throw new RangeError("planeIndex out of range");
    if (!a && e.planeIndex !== 0)
      throw new RangeError("planeIndex out of range");
    return (a ? n : n * this.numberOfChannels) * s;
  }
  /** Copies the audio sample's data to an ArrayBuffer or ArrayBufferView as specified by the given options. */
  copyTo(e, t) {
    if (!Cr(e))
      throw new TypeError("destination must be an ArrayBuffer or an ArrayBuffer view.");
    if (!t || typeof t != "object")
      throw new TypeError("options must be an object.");
    if (!Number.isInteger(t.planeIndex) || t.planeIndex < 0)
      throw new TypeError("planeIndex must be a non-negative integer.");
    if (t.format !== void 0 && !vi.has(t.format))
      throw new TypeError("Invalid format.");
    if (t.frameOffset !== void 0 && (!Number.isInteger(t.frameOffset) || t.frameOffset < 0))
      throw new TypeError("frameOffset must be a non-negative integer.");
    if (t.frameCount !== void 0 && (!Number.isInteger(t.frameCount) || t.frameCount < 0))
      throw new TypeError("frameCount must be a non-negative integer.");
    if (this._closed)
      throw new Error("AudioSample is closed.");
    const { planeIndex: i, format: n, frameCount: s, frameOffset: a } = t, o = this.format, c = n ?? this.format;
    if (!c)
      throw new Error("Destination format not determined");
    const l = this.numberOfFrames, d = this.numberOfChannels, u = a ?? 0;
    if (u >= l)
      throw new RangeError("frameOffset out of range");
    const f = s !== void 0 ? s : l - u;
    if (f > l - u)
      throw new RangeError("frameCount out of range");
    const h = St(c), p = qt(c);
    if (p && i >= d)
      throw new RangeError("planeIndex out of range");
    if (!p && i !== 0)
      throw new RangeError("planeIndex out of range");
    const b = (p ? f : f * d) * h;
    if (e.byteLength < b)
      throw new RangeError("Destination buffer is too small");
    const k = Q(e), y = Ya(c);
    if (or(this._data))
      pr() && d > 2 && c !== o ? Ql(this._data, k, o, c, d, i, u, f) : this._data.copyTo(e, {
        planeIndex: i,
        frameOffset: u,
        frameCount: f,
        format: c
      });
    else {
      const w = this._data, T = Q(w), A = $a(o), x = St(o), I = qt(o);
      for (let P = 0; P < f; P++)
        if (p) {
          const S = P * h;
          let E;
          I ? E = (i * l + (P + u)) * x : E = ((P + u) * d + i) * x;
          const D = A(T, E);
          y(k, S, D);
        } else
          for (let S = 0; S < d; S++) {
            const D = (P * d + S) * h;
            let B;
            I ? B = (S * l + (P + u)) * x : B = ((P + u) * d + S) * x;
            const O = A(T, B);
            y(k, D, O);
          }
    }
  }
  /** Clones this audio sample. */
  clone() {
    if (this._closed)
      throw new Error("AudioSample is closed.");
    if (or(this._data)) {
      const e = new me(this._data.clone());
      return e.setTimestamp(this.timestamp), e;
    } else
      return new me({
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
    this._closed || (xr?.unregister(this), or(this._data) ? this._data.close() : this._data = new Uint8Array(0), this._closed = !0);
  }
  /**
   * Converts this audio sample to an AudioData for use with the WebCodecs API. The AudioData returned by this
   * method *must* be closed separately from this audio sample.
   */
  toAudioData() {
    if (this._closed)
      throw new Error("AudioSample is closed.");
    if (or(this._data)) {
      if (this._data.timestamp === this.microsecondTimestamp)
        return this._data.clone();
      if (qt(this.format)) {
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
    const i = 48e3 * 5, n = e.numberOfChannels, s = e.sampleRate, a = e.length, o = Math.floor(i / n);
    let c = 0, l = a;
    for (; l > 0; ) {
      const d = Math.min(o, l), u = new Float32Array(n * d);
      for (let f = 0; f < n; f++)
        e.copyFromChannel(u.subarray(f * d, (f + 1) * d), f, c);
      yield new me({
        format: "f32-planar",
        sampleRate: s,
        numberOfFrames: d,
        numberOfChannels: n,
        timestamp: t + c / s,
        data: u
      }), c += d, l -= d;
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
    const d = [];
    for (; l > 0; ) {
      const u = Math.min(o, l), f = new Float32Array(n * u);
      for (let p = 0; p < n; p++)
        e.copyFromChannel(f.subarray(p * u, (p + 1) * u), p, c);
      const h = new me({
        format: "f32-planar",
        sampleRate: s,
        numberOfFrames: u,
        numberOfChannels: n,
        timestamp: t + c / s,
        data: f
      });
      d.push(h), c += u, l -= u;
    }
    return d;
  }
}
const St = (r) => {
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
}, qt = (r) => {
  switch (r) {
    case "u8-planar":
    case "s16-planar":
    case "s32-planar":
    case "f32-planar":
      return !0;
    default:
      return !1;
  }
}, $a = (r) => {
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
}, Ya = (r) => {
  switch (r) {
    case "u8":
    case "u8-planar":
      return (e, t, i) => e.setUint8(t, se((i + 1) * 127.5, 0, 255));
    case "s16":
    case "s16-planar":
      return (e, t, i) => e.setInt16(t, se(Math.round(i * 32767), -32768, 32767), !0);
    case "s32":
    case "s32-planar":
      return (e, t, i) => e.setInt32(t, se(Math.round(i * 2147483647), -2147483648, 2147483647), !0);
    case "f32":
    case "f32-planar":
      return (e, t, i) => e.setFloat32(t, i, !0);
  }
}, or = (r) => typeof AudioData < "u" && r instanceof AudioData, Za = (r) => {
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
}, Ql = (r, e, t, i, n, s, a, o) => {
  const c = $a(t), l = Ya(i), d = St(t), u = St(i), f = qt(t);
  if (qt(i))
    if (f) {
      const p = new ArrayBuffer(o * d), m = Q(p);
      r.copyTo(p, {
        planeIndex: s,
        frameOffset: a,
        frameCount: o,
        format: t
      });
      for (let b = 0; b < o; b++) {
        const k = b * d, y = b * u, w = c(m, k);
        l(e, y, w);
      }
    } else {
      const p = new ArrayBuffer(o * n * d), m = Q(p);
      r.copyTo(p, {
        planeIndex: 0,
        frameOffset: a,
        frameCount: o,
        format: t
      });
      for (let b = 0; b < o; b++) {
        const k = (b * n + s) * d, y = b * u, w = c(m, k);
        l(e, y, w);
      }
    }
  else if (f) {
    const p = o * d, m = new ArrayBuffer(p), b = Q(m);
    for (let k = 0; k < n; k++) {
      r.copyTo(m, {
        planeIndex: k,
        frameOffset: a,
        frameCount: o,
        format: t
      });
      for (let y = 0; y < o; y++) {
        const w = y * d, T = (y * n + k) * u, A = c(b, w);
        l(e, T, A);
      }
    }
  } else {
    const p = new ArrayBuffer(o * n * d), m = Q(p);
    r.copyTo(p, {
      planeIndex: 0,
      frameOffset: a,
      frameCount: o,
      format: t
    });
    for (let b = 0; b < o; b++)
      for (let k = 0; k < n; k++) {
        const y = b * n + k, w = y * d, T = y * u, A = c(m, w);
        l(e, T, A);
      }
  }
}, Ja = (r, e) => {
  const t = r.allocationSize({ format: e, planeIndex: 0 }), i = new ArrayBuffer(t);
  return r.copyTo(i, { format: e, planeIndex: 0 }), new me({
    data: i,
    format: e,
    numberOfChannels: r.numberOfChannels,
    sampleRate: r.sampleRate,
    timestamp: r.timestamp,
    duration: r.duration
  });
};
const tn = /* @__PURE__ */ new Map(), rn = /* @__PURE__ */ new Map(), Gl = (r) => {
  if (!r || typeof r != "object")
    throw new TypeError("Encoding config must be an object.");
  if (!Ae.includes(r.codec))
    throw new TypeError(`Invalid video codec '${r.codec}'. Must be one of: ${Ae.join(", ")}.`);
  if (!(r.bitrate instanceof Me) && (!Number.isInteger(r.bitrate) || r.bitrate <= 0))
    throw new TypeError("config.bitrate must be a positive integer or a quality.");
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
    if (r.transform.fit !== void 0 && ["fill", "contain", "cover"].includes(r.sizeChangeBehavior))
      throw new TypeError("config.transform.fit cannot be used when config.sizeChangeBehavior is 'fill', 'contain' or 'cover', as sizeChangeBehavior already determines the fitting algorithm.");
    if (r.transform.rotate !== void 0 && ![0, 90, 180, 270].includes(r.transform.rotate))
      throw new TypeError("config.transform.rotate, when provided, must be 0, 90, 180 or 270.");
    if (r.transform.crop !== void 0 && mi(r.transform.crop, "config.transform."), r.transform.process !== void 0 && typeof r.transform.process != "function")
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
  eo(r.codec, r);
}, eo = (r, e) => {
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
  if (e.fullCodecString !== void 0 && gt(e.fullCodecString) !== r)
    throw new TypeError(`fullCodecString, when provided, must be a string that matches the specified codec (${r}).`);
  if (e.hardwareAcceleration !== void 0 && !["no-preference", "prefer-hardware", "prefer-software"].includes(e.hardwareAcceleration))
    throw new TypeError("hardwareAcceleration, when provided, must be 'no-preference', 'prefer-hardware' or 'prefer-software'.");
  if (e.scalabilityMode !== void 0 && typeof e.scalabilityMode != "string")
    throw new TypeError("scalabilityMode, when provided, must be a string.");
  if (e.contentHint !== void 0 && typeof e.contentHint != "string")
    throw new TypeError("contentHint, when provided, must be a string.");
}, to = (r) => {
  const e = r.bitrate instanceof Me ? r.bitrate._toVideoBitrate(r.codec, r.width, r.height) : r.bitrate;
  return {
    codec: r.fullCodecString ?? Uo(r.codec, r.width, r.height, e),
    width: r.width,
    height: r.height,
    displayWidth: r.squarePixelWidth,
    displayHeight: r.squarePixelHeight,
    bitrate: e,
    bitrateMode: r.bitrateMode,
    alpha: r.alpha ?? "discard",
    framerate: r.framerate,
    latencyMode: r.latencyMode,
    hardwareAcceleration: r.hardwareAcceleration,
    scalabilityMode: r.scalabilityMode,
    contentHint: r.contentHint,
    ...Ho(r.codec)
  };
}, Xl = (r) => {
  if (!r || typeof r != "object")
    throw new TypeError("Encoding config must be an object.");
  if (!Se.includes(r.codec))
    throw new TypeError(`Invalid audio codec '${r.codec}'. Must be one of: ${Se.join(", ")}.`);
  if (r.bitrate === void 0 && !(fe.includes(r.codec) || r.codec === "flac"))
    throw new TypeError("config.bitrate must be provided for compressed audio codecs.");
  if (r.bitrate !== void 0 && !(r.bitrate instanceof Me) && (!Number.isInteger(r.bitrate) || r.bitrate <= 0))
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
  ro(r.codec, r);
}, ro = (r, e) => {
  if (!e || typeof e != "object")
    throw new TypeError("Encoding options must be an object.");
  if (e.bitrateMode !== void 0 && !["constant", "variable"].includes(e.bitrateMode))
    throw new TypeError("bitrateMode, when provided, must be 'constant' or 'variable'.");
  if (e.fullCodecString !== void 0 && typeof e.fullCodecString != "string")
    throw new TypeError("fullCodecString, when provided, must be a string.");
  if (e.fullCodecString !== void 0 && gt(e.fullCodecString) !== r)
    throw new TypeError(`fullCodecString, when provided, must be a string that matches the specified codec (${r}).`);
}, io = (r) => {
  const e = r.bitrate instanceof Me ? r.bitrate._toAudioBitrate(r.codec) : r.bitrate;
  return {
    codec: r.fullCodecString ?? ta(r.codec, r.numberOfChannels, r.sampleRate),
    numberOfChannels: r.numberOfChannels,
    sampleRate: r.sampleRate,
    bitrate: e,
    bitrateMode: r.bitrateMode,
    ...qo(r.codec)
  };
};
class Me {
  /** @internal */
  constructor(e) {
    this._factor = e;
  }
  /** @internal */
  _toVideoBitrate(e, t, i) {
    const n = t * i, s = {
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
    }, a = 1920 * 1080, o = 3e6, c = Math.pow(n / a, 0.95), u = o * c * s[e] * this._factor;
    return Math.ceil(u / 1e3) * 1e3;
  }
  /** @internal */
  _toAudioBitrate(e) {
    if (fe.includes(e) || e === "flac")
      return;
    const i = {
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
      eac3: 192e3
      // 192kbps base for E-AC-3
    }[e];
    if (!i)
      throw new Error(`Unhandled codec: ${e}`);
    let n = i * this._factor;
    return e === "aac" ? n = [96e3, 128e3, 16e4, 192e3].reduce((a, o) => Math.abs(o - n) < Math.abs(a - n) ? o : a) : e === "opus" || e === "vorbis" ? n = Math.max(6e3, n) : e === "mp3" && (n = [
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
    ].reduce((a, o) => Math.abs(o - n) < Math.abs(a - n) ? o : a)), Math.round(n / 1e3) * 1e3;
  }
}
const $l = /* @__PURE__ */ new Me(0.3), Yl = /* @__PURE__ */ new Me(1), nn = /* @__PURE__ */ new Me(2), no = async (r, e = {}) => {
  const { width: t = 1280, height: i = 720, bitrate: n = 1e6, ...s } = e;
  if (!Ae.includes(r))
    return !1;
  if (!Number.isInteger(t) || t <= 0)
    throw new TypeError("width must be a positive integer.");
  if (!Number.isInteger(i) || i <= 0)
    throw new TypeError("height must be a positive integer.");
  if (!(n instanceof Me) && (!Number.isInteger(n) || n <= 0))
    throw new TypeError("bitrate must be a positive integer or a quality.");
  eo(r, s);
  const a = to({
    codec: r,
    width: t,
    height: i,
    bitrate: n,
    framerate: void 0,
    ...s,
    alpha: "discard"
    // Since we handle alpha ourselves
  }), o = JSON.stringify(a), c = tn.get(o);
  if (c)
    return c;
  const l = (async () => ti.some((f) => f.supports(r, a)) ? !0 : typeof VideoEncoder > "u" || (t % 2 === 1 || i % 2 === 1) && (r === "avc" || r === "hevc") || !(await VideoEncoder.isConfigSupported(a)).supported ? !1 : Jt() ? new Promise(async (f) => {
    try {
      const h = new VideoEncoder({
        output: () => {
        },
        error: () => f(!1)
      });
      h.configure(a);
      const p = new Uint8Array(t * i * 4), m = new VideoFrame(p, {
        format: "RGBA",
        codedWidth: t,
        codedHeight: i,
        timestamp: 0
      });
      h.encode(m), m.close(), await h.flush(), f(!0);
    } catch {
      f(!1);
    }
  }) : !0)();
  return tn.set(o, l), l;
}, sn = async (r, e = {}) => {
  const { numberOfChannels: t = 2, sampleRate: i = 48e3, bitrate: n = 128e3, ...s } = e;
  if (!Se.includes(r))
    return !1;
  if (!Number.isInteger(t) || t <= 0)
    throw new TypeError("numberOfChannels must be a positive integer.");
  if (!Number.isInteger(i) || i <= 0)
    throw new TypeError("sampleRate must be a positive integer.");
  if (!(n instanceof Me) && (!Number.isInteger(n) || n <= 0))
    throw new TypeError("bitrate must be a positive integer.");
  ro(r, s);
  const a = io({
    codec: r,
    numberOfChannels: t,
    sampleRate: i,
    bitrate: n,
    ...s
  }), o = JSON.stringify(a), c = rn.get(o);
  if (c)
    return c;
  const l = (async () => ri.some((u) => u.supports(r, a)) || fe.includes(r) ? !0 : typeof AudioEncoder > "u" ? !1 : (await AudioEncoder.isConfigSupported(a)).supported === !0)();
  return rn.set(o, l), l;
}, Rs = async (r = Se, e) => {
  const t = await Promise.all(r.map((i) => sn(i, e)));
  return r.filter((i, n) => t[n]);
}, Zl = async (r, e) => {
  for (const t of r)
    if (await no(t, e))
      return t;
  return null;
};
class Jl {
  /** Returns true if and only if the encoder can encode the given codec configuration. */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static supports(e, t) {
    return !1;
  }
}
class eu {
  /** Returns true if and only if the encoder can encode the given codec configuration. */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static supports(e, t) {
    return !1;
  }
}
const so = [], vn = [], ti = [], ri = [], Jd = (r) => {
  if (r.prototype instanceof Jl) {
    const e = r;
    if (ti.includes(e)) {
      console.warn("Video encoder already registered.");
      return;
    }
    ti.push(e), tn.clear();
  } else if (r.prototype instanceof eu) {
    const e = r;
    if (ri.includes(e)) {
      console.warn("Audio encoder already registered.");
      return;
    }
    ri.push(e), rn.clear();
  } else
    throw new TypeError("Encoder must be a CustomVideoEncoder or CustomAudioEncoder.");
};
const tu = (r) => {
  let i = r, n = 4096, s = 0, a = 12, o = 0;
  for (i < 0 && (i = -i, s = 128), i += 33, i > 8191 && (i = 8191); (i & n) !== n && a >= 5; )
    n >>= 1, a--;
  return o = i >> a - 4 & 15, ~(s | a - 5 << 4 | o) & 255;
}, ru = (r) => {
  let t = 0, i = 0, n = ~r;
  n & 128 && (n &= -129, t = -1), i = ((n & 240) >> 4) + 5;
  const s = (1 << i | (n & 15) << i - 4 | 1 << i - 5) - 33;
  return t === 0 ? s : -s;
}, iu = (r) => {
  let t = 2048, i = 0, n = 11, s = 0, a = r;
  for (a < 0 && (a = -a, i = 128), a > 4095 && (a = 4095); (a & t) !== t && n >= 5; )
    t >>= 1, n--;
  return s = a >> (n === 4 ? 1 : n - 4) & 15, (i | n - 4 << 4 | s) ^ 85;
}, nu = (r) => {
  let e = 0, t = 0, i = r ^ 85;
  i & 128 && (i &= -129, e = -1), t = ((i & 240) >> 4) + 4;
  let n = 0;
  return t !== 4 ? n = 1 << t | (i & 15) << t - 4 | 1 << t - 5 : n = i << 1 | 1, e === 0 ? n : -n;
};
const Tt = (r) => {
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
}, kt = (r) => {
  if (!gn(r))
    throw new TypeError("timestamp must be a number.");
}, Bi = (r, e, t) => t.verifyKeyPackets ? e.then(async (i) => {
  if (!i || i.type === "delta")
    return i;
  const n = await r.determinePacketType(i);
  return n && (i.type = n), i;
}) : e;
class Pr {
  /** Creates a new {@link EncodedPacketSink} for the given {@link InputTrack}. */
  constructor(e) {
    if (!(e instanceof vr))
      throw new TypeError("track must be an InputTrack.");
    this._track = e;
  }
  /**
   * Retrieves the track's first packet (in decode order), or null if it has no packets. The first packet is very
   * likely to be a key packet, but it doesn't have to be.
   */
  async getFirstPacket(e = {}) {
    if (Tt(e), this._track.input._disposed)
      throw new be();
    return Bi(this._track, this._track._backing.getFirstPacket(e), e);
  }
  /** Retrieves the track's first key packet (in decode order), or null if it has no key packets. */
  async getFirstKeyPacket(e = {}) {
    Tt(e);
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
    if (kt(e), Tt(t), this._track.input._disposed)
      throw new be();
    return Bi(this._track, this._track._backing.getPacket(e, t), t);
  }
  /**
   * Retrieves the packet following the given packet (in decode order), or null if the given packet is the
   * last packet.
   */
  async getNextPacket(e, t = {}) {
    if (!(e instanceof Y))
      throw new TypeError("packet must be an EncodedPacket.");
    if (Tt(t), this._track.input._disposed)
      throw new be();
    return Bi(this._track, this._track._backing.getNextPacket(e, t), t);
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
    if (kt(e), Tt(t), this._track.input._disposed)
      throw new be();
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
    if (Tt(t), this._track.input._disposed)
      throw new be();
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
    if (Tt(i), this._track.input._disposed)
      throw new be();
    const n = [];
    let { promise: s, resolve: a } = ce(), { promise: o, resolve: c } = ce(), l = !1, d = !1, u = null;
    const f = [], h = () => Math.max(2, f.length);
    (async () => {
      let m = e ?? await this.getFirstPacket(i);
      for (; m && !d && !this._track.input._disposed && !(t && m.sequenceNumber >= t?.sequenceNumber); ) {
        if (n.length > h()) {
          ({ promise: o, resolve: c } = ce()), await o;
          continue;
        }
        n.push(m), a(), { promise: s, resolve: a } = ce(), m = await this.getNextPacket(m, i);
      }
      l = !0, a();
    })().catch((m) => {
      u || (u = m, a());
    });
    const p = this._track;
    return {
      async next() {
        for (; ; ) {
          if (p.input._disposed)
            throw new be();
          if (d)
            return { value: void 0, done: !0 };
          if (u)
            throw u;
          if (n.length > 0) {
            const m = n.shift(), b = performance.now();
            for (f.push(b); f.length > 0 && b - f[0] >= 1e3; )
              f.shift();
            return c(), { value: m, done: !1 };
          } else {
            if (l)
              return { value: void 0, done: !0 };
            await s;
          }
        }
      },
      async return() {
        return d = !0, c(), a(), { value: void 0, done: !0 };
      },
      async throw(m) {
        throw m;
      },
      [Symbol.asyncIterator]() {
        return this;
      }
    };
  }
}
class Bn {
  constructor(e, t) {
    this.onSample = e, this.onError = t;
  }
}
class ao {
  /** @internal */
  mediaSamplesInRange(e = 0, t = 1 / 0, i) {
    kt(e), kt(t);
    const n = [];
    let s = !1, a = null, { promise: o, resolve: c } = ce(), { promise: l, resolve: d } = ce(), u = !1, f = !1, h = !1, p = null;
    const m = {
      ...i,
      verifyKeyPackets: !0,
      metadataOnly: !1
    };
    (async () => {
      const y = await this._createDecoder((P) => {
        if (d(), P.timestamp >= t && (f = !0), f) {
          P.close();
          return;
        }
        a && (P.timestamp > e ? (n.push(a), s = !0) : a.close()), P.timestamp >= e && (n.push(P), s = !0), a = s ? null : P, n.length > 0 && (c(), { promise: o, resolve: c } = ce());
      }, (P) => {
        p || (p = P, c());
      }), w = this._createPacketSink(), T = await w.getKeyPacket(e, m) ?? await w.getFirstKeyPacket(m);
      let A = T;
      const I = w.packets(T ?? void 0, void 0, m);
      for (await I.next(); A && !f && !this._track.input._disposed; ) {
        const P = Ms(n.length);
        if (n.length + y.getDecodeQueueSize() > P) {
          ({ promise: l, resolve: d } = ce()), await l;
          continue;
        }
        y.decode(A);
        const S = await I.next();
        if (S.done)
          break;
        A = S.value;
      }
      await I.return(), !h && !this._track.input._disposed && await y.flush(), y.close(), !s && a && n.push(a), u = !0, c();
    })().catch((y) => {
      p || (p = y, c());
    });
    const b = this._track, k = () => {
      a?.close();
      for (const y of n)
        y.close();
    };
    return {
      async next() {
        for (; ; ) {
          if (b.input._disposed)
            throw k(), new be();
          if (h)
            return { value: void 0, done: !0 };
          if (p)
            throw k(), p;
          if (n.length > 0) {
            const y = n.shift();
            return d(), { value: y, done: !1 };
          } else if (!u)
            await o;
          else
            return { value: void 0, done: !0 };
        }
      },
      async return() {
        return h = !0, f = !0, d(), c(), k(), { value: void 0, done: !0 };
      },
      async throw(y) {
        throw y;
      },
      [Symbol.asyncIterator]() {
        return this;
      }
    };
  }
  /** @internal */
  mediaSamplesAtTimestamps(e, t) {
    Eo(e);
    const i = Io(e), n = [], s = [];
    let { promise: a, resolve: o } = ce(), { promise: c, resolve: l } = ce(), d = !1, u = !1, f = null;
    const h = (k) => {
      s.push(k), o(), { promise: a, resolve: o } = ce();
    }, p = {
      ...t,
      verifyKeyPackets: !0,
      metadataOnly: !1
    };
    (async () => {
      const k = await this._createDecoder((P) => {
        if (l(), u) {
          P.close();
          return;
        }
        let S = 0;
        for (; n.length > 0 && P.timestamp - n[0] > -1e-10; )
          S++, n.shift();
        if (S > 0)
          for (let E = 0; E < S; E++)
            h(E < S - 1 ? P.clone() : P);
        else
          P.close();
      }, (P) => {
        f || (f = P, o());
      }), y = this._createPacketSink();
      let w = null, T = null, A = -1;
      const x = async () => {
        g(T);
        let P = T;
        for (k.decode(P); P.sequenceNumber < A; ) {
          const S = Ms(s.length);
          for (; s.length + k.getDecodeQueueSize() > S && !u; )
            ({ promise: c, resolve: l } = ce()), await c;
          if (u)
            break;
          const E = await y.getNextPacket(P, p);
          g(E), k.decode(E), P = E;
        }
        A = -1;
      }, I = async () => {
        await k.flush();
        for (let P = 0; P < n.length; P++)
          h(null);
        n.length = 0;
      };
      for await (const P of i) {
        if (kt(P), u || this._track.input._disposed)
          break;
        const S = await y.getPacket(P, p), E = S && await y.getKeyPacket(P, p);
        if (!E) {
          A !== -1 && (await x(), await I()), h(null), w = null;
          continue;
        }
        w && (E.sequenceNumber !== T.sequenceNumber || S.timestamp < w.timestamp) && (await x(), await I()), n.push(S.timestamp), A = Math.max(S.sequenceNumber, A), w = S, T = E;
      }
      !u && !this._track.input._disposed && (A !== -1 && await x(), await I()), k.close(), d = !0, o();
    })().catch((k) => {
      f || (f = k, o());
    });
    const m = this._track, b = () => {
      for (const k of s)
        k?.close();
    };
    return {
      async next() {
        for (; ; ) {
          if (m.input._disposed)
            throw b(), new be();
          if (u)
            return { value: void 0, done: !0 };
          if (f)
            throw b(), f;
          if (s.length > 0) {
            const k = s.shift();
            return g(k !== void 0), l(), { value: k, done: !1 };
          } else if (!d)
            await a;
          else
            return { value: void 0, done: !0 };
        }
      },
      async return() {
        return u = !0, l(), o(), b(), { value: void 0, done: !0 };
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
const Ms = (r) => r === 0 ? 40 : 8;
class su extends Bn {
  constructor(e, t, i, n, s, a) {
    super(e, t), this.codec = i, this.decoderConfig = n, this.rotation = s, this.timeResolution = a, this.decoder = null, this.customDecoder = null, this.customDecoderCallSerializer = new si(), this.customDecoderQueueSize = 0, this.inputTimestamps = [], this.sampleQueue = [], this.currentPacketIndex = 0, this.raslSkipped = !1, this.alphaDecoder = null, this.alphaHadKeyframe = !1, this.colorQueue = [], this.alphaQueue = [], this.merger = null, this.mergerCreationFailed = !1, this.decodedAlphaChunkCount = 0, this.alphaDecoderQueueSize = 0, this.nullAlphaFrameQueue = [], this.currentAlphaPacketIndex = 0, this.alphaRaslSkipped = !1;
    const o = so.find((c) => c.supports(i, n));
    if (o)
      this.customDecoder = new o(), this.customDecoder.codec = i, this.customDecoder.config = n, this.customDecoder.onSample = (c) => {
        if (!(c instanceof ae))
          throw new TypeError("The argument passed to onSample must be a VideoSample.");
        this.finalizeAndEmitSample(c);
      }, this.customDecoderCallSerializer.call(() => this.customDecoder.init());
    else {
      const c = (d) => {
        if (this.alphaQueue.length > 0) {
          const u = this.alphaQueue.shift();
          g(u !== void 0), this.mergeAlpha(d, u);
        } else
          this.colorQueue.push(d);
      };
      if (i === "avc" && this.decoderConfig.description && Ki()) {
        const d = ac(pe(this.decoderConfig.description));
        if (d && d.sequenceParameterSets.length > 0) {
          const u = Sn(d.sequenceParameterSets[0]);
          u && u.frameMbsOnlyFlag === 0 && (this.decoderConfig = {
            ...this.decoderConfig,
            hardwareAcceleration: "prefer-software"
          });
        }
      }
      const l = new Error("Decoding error").stack;
      this.decoder = new VideoDecoder({
        output: (d) => {
          try {
            c(d);
          } catch (u) {
            this.onError(u);
          }
        },
        error: (d) => {
          d.stack = l, this.onError(d);
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
      this.customDecoderQueueSize++, this.customDecoderCallSerializer.call(() => this.customDecoder.decode(e)).then(() => this.customDecoderQueueSize--);
    else {
      if (g(this.decoder), pr() || qn(this.inputTimestamps, e.timestamp, (t) => t), Ki() && this.currentPacketIndex === 0) {
        if (this.codec === "avc") {
          const t = [];
          for (const n of ca(e.data, this.decoderConfig)) {
            const s = li(e.data[n.offset]);
            s >= 20 && s <= 31 || t.push(e.data.subarray(n.offset, n.offset + n.length));
          }
          const i = nc(t, this.decoderConfig);
          e = new Y(i, e.type, e.timestamp, e.duration);
        } else if (this.codec === "hevc") {
          const t = pc(e.data, this.decoderConfig);
          t && (e = new Y(t, e.type, e.timestamp, e.duration));
        }
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
        this.merger = new au();
      } catch (i) {
        console.error("Due to an error, only color data will be decoded.", i), this.mergerCreationFailed = !0, this.decodeAlphaData(e);
        return;
      }
    if (!this.alphaDecoder) {
      const i = (s) => {
        if (this.alphaDecoderQueueSize--, this.colorQueue.length > 0) {
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
    const t = Pn(this.codec, this.decoderConfig, e.sideData.alpha);
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
    for (const t of Yr(e, this.decoderConfig)) {
      const i = er(e[t.offset]);
      if (i === ue.RASL_N || i === ue.RASL_R)
        return !0;
    }
    return !1;
  }
  /** Handler for the WebCodecs VideoDecoder for ironing out browser differences. */
  sampleHandler(e) {
    if (pr()) {
      if (this.sampleQueue.length > 0 && e.timestamp >= ee(this.sampleQueue).timestamp) {
        for (const t of this.sampleQueue)
          this.finalizeAndEmitSample(t);
        this.sampleQueue.length = 0;
      }
      qn(this.sampleQueue, e, (t) => t.timestamp);
    } else {
      const t = this.inputTimestamps.shift();
      g(t !== void 0), e.setTimestamp(t), this.finalizeAndEmitSample(e);
    }
  }
  finalizeAndEmitSample(e) {
    e.setTimestamp(Math.round(e.timestamp * this.timeResolution) / this.timeResolution), e.setDuration(Math.round(e.duration * this.timeResolution) / this.timeResolution), e.setRotation(this.rotation), this.onSample(e);
  }
  mergeAlpha(e, t) {
    if (!t) {
      const s = new ae(e);
      this.sampleHandler(s);
      return;
    }
    g(this.merger), this.merger.update(e, t), e.close(), t.close();
    const i = new VideoFrame(this.merger.canvas, {
      timestamp: e.timestamp,
      duration: e.duration ?? void 0
    }), n = new ae(i);
    this.sampleHandler(n);
  }
  async flush() {
    if (this.customDecoder ? await this.customDecoderCallSerializer.call(() => this.customDecoder.flush()) : (g(this.decoder), await Promise.all([
      this.decoder.flush(),
      this.alphaDecoder?.flush()
    ]), this.colorQueue.forEach((e) => e.close()), this.colorQueue.length = 0, this.alphaQueue.forEach((e) => e?.close()), this.alphaQueue.length = 0, this.alphaHadKeyframe = !1, this.decodedAlphaChunkCount = 0, this.alphaDecoderQueueSize = 0, this.nullAlphaFrameQueue.length = 0, this.currentAlphaPacketIndex = 0, this.alphaRaslSkipped = !1), pr()) {
      for (const e of this.sampleQueue)
        this.finalizeAndEmitSample(e);
      this.sampleQueue.length = 0;
    }
    this.currentPacketIndex = 0, this.raslSkipped = !1;
  }
  close() {
    this.customDecoder ? this.customDecoderCallSerializer.call(() => this.customDecoder.close()) : (g(this.decoder), this.decoder.close(), this.alphaDecoder?.close(), this.colorQueue.forEach((e) => e.close()), this.colorQueue.length = 0, this.alphaQueue.forEach((e) => e?.close()), this.alphaQueue.length = 0, this.merger?.close());
    for (const e of this.sampleQueue)
      e.close();
    this.sampleQueue.length = 0;
  }
}
class au {
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
    const n = this.gl.getAttribLocation(this.program, "a_position"), s = this.gl.getAttribLocation(this.program, "a_texCoord");
    return this.gl.enableVertexAttribArray(n), this.gl.vertexAttribPointer(n, 2, this.gl.FLOAT, !1, 16, 0), this.gl.enableVertexAttribArray(s), this.gl.vertexAttribPointer(s, 2, this.gl.FLOAT, !1, 16, 8), e;
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
class an extends ao {
  /** Creates a new {@link VideoSampleSink} for the given {@link InputVideoTrack}. */
  constructor(e) {
    if (!(e instanceof pi))
      throw new TypeError("videoTrack must be an InputVideoTrack.");
    super(), this._track = e;
  }
  /** @internal */
  async _createDecoder(e, t) {
    if (!await this._track.canDecode())
      throw new Error("This video track cannot be decoded by this browser. Make sure to check decodability before using a track.");
    const i = await this._track.getCodec(), n = await this._track.getRotation(), s = await this._track.getDecoderConfig(), a = await this._track.getTimeResolution();
    return g(i && s), new su(e, t, i, s, n, a);
  }
  /** @internal */
  _createPacketSink() {
    return new Pr(this._track);
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
    kt(e);
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
  samples(e = 0, t = 1 / 0, i = {}) {
    return this.mediaSamplesInRange(e, t, i);
  }
  /**
   * Creates an async iterator that yields a video sample (frame) for each timestamp in the argument. This method
   * uses an optimized decoding pipeline if these timestamps are monotonically sorted, decoding each packet at most
   * once, and is therefore more efficient than manually getting the sample for every timestamp. The iterator may
   * yield null if no frame is available for a given timestamp.
   *
   * @param timestamps - An iterable or async iterable of timestamps in seconds.
   * @param options - Options used for the underlying packet retrieval.
   */
  samplesAtTimestamps(e, t = {}) {
    return this.mediaSamplesAtTimestamps(e, t);
  }
}
class ou {
  /** Creates a new {@link CanvasSink} for the given {@link InputVideoTrack}. */
  constructor(e, t = {}) {
    if (this._rotation = 0, this._initPromise = null, this._nextCanvasIndex = 0, !(e instanceof pi))
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
    if (t.crop !== void 0 && mi(t.crop, "options."), t.poolSize !== void 0 && (typeof t.poolSize != "number" || !Number.isInteger(t.poolSize) || t.poolSize < 0))
      throw new TypeError("poolSize must be a non-negative integer.");
    this._videoTrack = e, this._alpha = t.alpha ?? !1, this._options = t, this._fit = t.fit ?? "fill", this._videoSampleSink = new an(e), this._canvasPool = Array.from({ length: t.poolSize ?? 0 }, () => null);
  }
  /** @internal */
  _ensureInit() {
    return this._initPromise ??= (async () => {
      const e = this._options, t = this._videoTrack, i = e.rotation ?? await t.getRotation(), n = await t.getSquarePixelWidth(), s = await t.getSquarePixelHeight(), [a, o] = i % 180 === 0 ? [n, s] : [s, n];
      let c = e.crop;
      c && (c = hi(c, a, o));
      let [l, d] = c ? [c.width, c.height] : [a, o];
      const u = l / d;
      e.width !== void 0 && e.height === void 0 ? (l = e.width, d = Math.round(l / u)) : e.width === void 0 && e.height !== void 0 ? (d = e.height, l = Math.round(d * u)) : e.width !== void 0 && e.height !== void 0 && (l = e.width, d = e.height), this._width = l, this._height = d, this._rotation = i, this._crop = c;
    })();
  }
  /** @internal */
  _videoSampleToWrappedCanvas(e) {
    const t = this._width, i = this._height;
    let n = this._canvasPool[this._nextCanvasIndex], s = !1;
    n || (typeof document < "u" ? (n = document.createElement("canvas"), n.width = t, n.height = i) : n = new OffscreenCanvas(t, i), this._canvasPool.length > 0 && (this._canvasPool[this._nextCanvasIndex] = n), s = !0), this._canvasPool.length > 0 && (this._nextCanvasIndex = (this._nextCanvasIndex + 1) % this._canvasPool.length);
    const a = n.getContext("2d", {
      alpha: this._alpha || Jt()
      // Firefox has VideoFrame glitches with opaque canvases
    });
    g(a), a.resetTransform(), s || (!this._alpha && Jt() ? (a.fillStyle = "black", a.fillRect(0, 0, t, i)) : a.clearRect(0, 0, t, i)), e.drawWithFit(a, {
      fit: this._fit,
      rotation: this._rotation,
      crop: this._crop
    });
    const o = {
      canvas: n,
      timestamp: e.timestamp,
      duration: e.duration
    };
    return e.close(), o;
  }
  /**
   * Retrieves a canvas with the video frame corresponding to the given timestamp, in seconds. More specifically,
   * returns the last video frame (in presentation order) with a start timestamp less than or equal to the given
   * timestamp. Returns null if the timestamp is before the track's first timestamp.
   *
   * @param timestamp - The timestamp used for retrieval, in seconds.
   * @param options - Options used for the underlying packet retrieval.
   */
  async getCanvas(e, t) {
    kt(e), await this._ensureInit();
    const i = await this._videoSampleSink.getSample(e, t);
    return i && this._videoSampleToWrappedCanvas(i);
  }
  /**
   * Creates an async iterator that yields canvases with the video frames of this track in presentation order. This
   * method will intelligently pre-decode a few frames ahead to enable fast iteration.
   *
   * @param startTimestamp - The timestamp in seconds at which to start yielding canvases (inclusive).
   * @param endTimestamp - The timestamp in seconds at which to stop yielding canvases (exclusive).
   * @param options - Options used for the underlying packet retrieval.
   */
  async *canvases(e = 0, t = 1 / 0, i) {
    await this._ensureInit(), yield* Kn(this._videoSampleSink.samples(e, t, i), (n) => this._videoSampleToWrappedCanvas(n));
  }
  /**
   * Creates an async iterator that yields a canvas for each timestamp in the argument. This method uses an optimized
   * decoding pipeline if these timestamps are monotonically sorted, decoding each packet at most once, and is
   * therefore more efficient than manually getting the canvas for every timestamp. The iterator may yield null if
   * no frame is available for a given timestamp.
   *
   * @param timestamps - An iterable or async iterable of timestamps in seconds.
   * @param options - Options used for the underlying packet retrieval.
   */
  async *canvasesAtTimestamps(e, t) {
    await this._ensureInit(), yield* Kn(this._videoSampleSink.samplesAtTimestamps(e, t), (i) => i && this._videoSampleToWrappedCanvas(i));
  }
}
class cu extends Bn {
  constructor(e, t, i, n) {
    super(e, t), this.decoder = null, this.customDecoder = null, this.customDecoderCallSerializer = new si(), this.customDecoderQueueSize = 0, this.currentTimestamp = null;
    const s = (o) => {
      (this.currentTimestamp === null || Math.abs(o.timestamp - this.currentTimestamp) >= o.duration) && (this.currentTimestamp = o.timestamp);
      const c = this.currentTimestamp;
      if (this.currentTimestamp += o.duration, o.numberOfFrames === 0) {
        o.close();
        return;
      }
      const l = n.sampleRate;
      o.setTimestamp(Math.round(c * l) / l), e(o);
    }, a = vn.find((o) => o.supports(i, n));
    if (a)
      this.customDecoder = new a(), this.customDecoder.codec = i, this.customDecoder.config = n, this.customDecoder.onSample = (o) => {
        if (!(o instanceof me))
          throw new TypeError("The argument passed to onSample must be an AudioSample.");
        s(o);
      }, this.customDecoderCallSerializer.call(() => this.customDecoder.init());
    else {
      const o = new Error("Decoding error").stack;
      this.decoder = new AudioDecoder({
        output: (c) => {
          try {
            s(new me(c));
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
    this.customDecoder ? (this.customDecoderQueueSize++, this.customDecoderCallSerializer.call(() => this.customDecoder.decode(e)).then(() => this.customDecoderQueueSize--)) : (g(this.decoder), this.decoder.decode(e.toEncodedAudioChunk()));
  }
  flush() {
    return this.customDecoder ? this.customDecoderCallSerializer.call(() => this.customDecoder.flush()) : (g(this.decoder), this.decoder.flush());
  }
  close() {
    this.customDecoder ? this.customDecoderCallSerializer.call(() => this.customDecoder.close()) : (g(this.decoder), this.decoder.close());
  }
}
class lu extends Bn {
  constructor(e, t, i) {
    super(e, t), this.decoderConfig = i, this.currentTimestamp = null, g(fe.includes(i.codec)), this.codec = i.codec;
    const { dataType: n, sampleSize: s, littleEndian: a } = it(this.codec);
    switch (this.inputSampleSize = s, s) {
      case 1:
        n === "unsigned" ? this.readInputValue = (o, c) => o.getUint8(c) - 2 ** 7 : n === "signed" ? this.readInputValue = (o, c) => o.getInt8(c) : n === "ulaw" ? this.readInputValue = (o, c) => ru(o.getUint8(c)) : n === "alaw" ? this.readInputValue = (o, c) => nu(o.getUint8(c)) : g(!1);
        break;
      case 2:
        n === "unsigned" ? this.readInputValue = (o, c) => o.getUint16(c, a) - 2 ** 15 : n === "signed" ? this.readInputValue = (o, c) => o.getInt16(c, a) : g(!1);
        break;
      case 3:
        n === "unsigned" ? this.readInputValue = (o, c) => ni(o, c, a) - 2 ** 23 : n === "signed" ? this.readInputValue = (o, c) => _o(o, c, a) : g(!1);
        break;
      case 4:
        n === "unsigned" ? this.readInputValue = (o, c) => o.getUint32(c, a) - 2 ** 31 : n === "signed" ? this.readInputValue = (o, c) => o.getInt32(c, a) : n === "float" ? this.readInputValue = (o, c) => o.getFloat32(c, a) : g(!1);
        break;
      case 8:
        n === "float" ? this.readInputValue = (o, c) => o.getFloat64(c, a) : g(!1);
        break;
      default:
        rt(s), g(!1);
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
        rt(s), g(!1);
    }
  }
  getDecodeQueueSize() {
    return 0;
  }
  decode(e) {
    const t = Q(e.data), i = e.byteLength / this.decoderConfig.numberOfChannels / this.inputSampleSize, n = i * this.decoderConfig.numberOfChannels * this.outputSampleSize, s = new ArrayBuffer(n), a = new DataView(s);
    for (let d = 0; d < i * this.decoderConfig.numberOfChannels; d++) {
      const u = d * this.inputSampleSize, f = d * this.outputSampleSize, h = this.readInputValue(t, u);
      this.writeOutputValue(a, f, h);
    }
    const o = i / this.decoderConfig.sampleRate;
    (this.currentTimestamp === null || Math.abs(e.timestamp - this.currentTimestamp) >= o) && (this.currentTimestamp = e.timestamp);
    const c = this.currentTimestamp;
    this.currentTimestamp += o;
    const l = new me({
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
class zs extends ao {
  /** Creates a new {@link AudioSampleSink} for the given {@link InputAudioTrack}. */
  constructor(e) {
    if (!(e instanceof Fn))
      throw new TypeError("audioTrack must be an InputAudioTrack.");
    super(), this._track = e;
  }
  /** @internal */
  async _createDecoder(e, t) {
    if (!await this._track.canDecode())
      throw new Error("This audio track cannot be decoded by this browser. Make sure to check decodability before using a track.");
    const i = await this._track.getCodec(), n = await this._track.getDecoderConfig();
    return g(i && n), fe.includes(n.codec) ? new lu(e, t, n) : new cu(e, t, i, n);
  }
  /** @internal */
  _createPacketSink() {
    return new Pr(this._track);
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
    kt(e);
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
  samples(e = 0, t = 1 / 0, i = {}) {
    return this.mediaSamplesInRange(e, t, i);
  }
  /**
   * Creates an async iterator that yields an audio sample for each timestamp in the argument. This method
   * uses an optimized decoding pipeline if these timestamps are monotonically sorted, decoding each packet at most
   * once, and is therefore more efficient than manually getting the sample for every timestamp. The iterator may
   * yield null if no sample is available for a given timestamp.
   *
   * @param timestamps - An iterable or async iterable of timestamps in seconds.
   * @param options - Options used for the underlying packet retrieval.
   */
  samplesAtTimestamps(e, t = {}) {
    return this.mediaSamplesAtTimestamps(e, t);
  }
}
class vr {
  /** @internal */
  constructor(e, t) {
    this.input = e, this._backing = t;
  }
  /** Returns true if and only if this track is a video track. */
  isVideoTrack() {
    return this instanceof pi;
  }
  /** Returns true if and only if this track is an audio track. */
  isAudioTrack() {
    return this instanceof Fn;
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
    return Z(this._backing.getInternalCodecId(), "internalCodecId", "getInternalCodecId");
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
    return Z(this._backing.getLanguageCode(), "languageCode", "getLanguageCode");
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
    return Z(this._backing.getName(), "name", "getName");
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
    return Z(this._backing.getTimeResolution(), "timeResolution", "getTimeResolution");
  }
  /**
   * Returns whether the timestamps of this track are relative to the Unix epoch (January 1, 1970 00:00:00 UTC).
   * When `true`, each timestamp maps to a definitive point in time.
   */
  async isRelativeToUnixEpoch() {
    return this._backing.isRelativeToUnixEpoch();
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
    return Z(this._backing.getDisposition(), "disposition", "getDisposition");
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
    return jr(i, await this.getTimeResolution());
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
    const i = new Pr(this);
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
    if (!(e instanceof vr))
      throw new TypeError("other must be an InputTrack.");
    return this.input !== e.input || this === e ? !1 : (this._backing.getPairingMask() & e._backing.getPairingMask()) !== 0n;
  }
  /**
   * Gets the list of other tracks that can be paired with this track. An optional query can be provided to narrow
   * down the results.
   */
  async getPairableTracks(e) {
    return this.input.getTracks(xt({
      filter: (t) => t.canBePairedWith(this)
    }, e));
  }
  /**
   * Gets the list of other video tracks that can be paired with this track. An optional query can be provided to
   * narrow down the results.
   */
  async getPairableVideoTracks(e) {
    return this.input.getVideoTracks(xt({
      filter: (t) => t.canBePairedWith(this)
    }, e));
  }
  /**
   * Gets the list of other audio tracks that can be paired with this track. An optional query can be provided to
   * narrow down the results.
   */
  async getPairableAudioTracks(e) {
    return this.input.getAudioTracks(xt({
      filter: (t) => t.canBePairedWith(this)
    }, e));
  }
  /** Returns the primary track that can be paired with this track, optionally steered by the provided query. */
  async getPrimaryPairableVideoTrack(e) {
    return this.input.getPrimaryVideoTrack(xt({
      filter: (t) => t.canBePairedWith(this)
    }, e));
  }
  /** Returns the primary track that can be paired with this track, optionally steered by the provided query. */
  async getPrimaryPairableAudioTrack(e) {
    return this.input.getPrimaryAudioTrack(xt({
      filter: (t) => t.canBePairedWith(this)
    }, e));
  }
  /** Returns `true` if there is another track that can be paired with this track. */
  async hasPairableTrack(e) {
    e &&= Fi(e);
    const t = await this.input.getTracks();
    for (const i of t)
      if (this.canBePairedWith(i) && (!e || await e(i)))
        return !0;
    return !1;
  }
  /** Returns `true` if there is a video track that can be paired with this track. */
  hasPairableVideoTrack(e) {
    return e &&= Fi(e), this.hasPairableTrack(async (t) => t.isVideoTrack() && (!e || await e(t)));
  }
  /** Returns `true` if there is an audio track that can be paired with this track. */
  hasPairableAudioTrack(e) {
    return e &&= Fi(e), this.hasPairableTrack(async (t) => t.isAudioTrack() && (!e || await e(t)));
  }
}
const Z = (r, e, t) => {
  if (r instanceof Promise)
    throw new Error(`'${e}' is deprecated and not available synchronously for this track. Use the preferred '${t}()' instead.`);
  return r;
}, Fi = (r) => {
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
class pi extends vr {
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
    return Z(this._backing.getCodec(), "codec", "getCodec");
  }
  async hasOnlyKeyPackets() {
    return await this._backing.getHasOnlyKeyPackets?.() ?? !1;
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
    return Z(this._backing.getCodedWidth(), "codedWidth", "getCodedWidth");
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
    return Z(this._backing.getCodedHeight(), "codedHeight", "getCodedHeight");
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
    return Z(this._backing.getRotation(), "rotation", "getRotation");
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
    return Z(this._backing.getSquarePixelWidth(), "squarePixelWidth", "getSquarePixelWidth");
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
    return Z(this._backing.getSquarePixelHeight(), "squarePixelHeight", "getSquarePixelHeight");
  }
  /**
   * Returns the pixel aspect ratio of the track's frames as a rational number in its reduced form. Most videos use
   * square pixels (1:1).
   */
  async getPixelAspectRatio() {
    return this._pixelAspectRatioCache ??= Gr({
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
    return this._pixelAspectRatioCache ??= Gr({
      num: Z(this._backing.getSquarePixelWidth(), "pixelAspectRatio", "getPixelAspectRatio") * Z(this._backing.getCodedHeight(), "pixelAspectRatio", "getPixelAspectRatio"),
      den: Z(this._backing.getSquarePixelHeight(), "pixelAspectRatio", "getPixelAspectRatio") * Z(this._backing.getCodedWidth(), "pixelAspectRatio", "getPixelAspectRatio")
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
      const n = Z(e, "displayWidth", "getDisplayWidth");
      if (n !== null)
        return n;
    }
    const i = Z(this._backing.getRotation(), "displayWidth", "getDisplayWidth") % 180 === 0 ? this._backing.getSquarePixelWidth() : this._backing.getSquarePixelHeight();
    return Z(i, "displayWidth", "getDisplayWidth");
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
      const n = Z(e, "displayHeight", "getDisplayHeight");
      if (n !== null)
        return n;
    }
    const i = Z(this._backing.getRotation(), "displayHeight", "getDisplayHeight") % 180 === 0 ? this._backing.getSquarePixelHeight() : this._backing.getSquarePixelWidth();
    return Z(i, "displayHeight", "getDisplayHeight");
  }
  /** Returns the color space of the track's samples. */
  async getColorSpace() {
    return this._backing.getColorSpace();
  }
  /** If this method returns true, the track's samples use a high dynamic range (HDR). */
  async hasHighDynamicRange() {
    const e = await this._backing.getColorSpace();
    return e.primaries === "bt2020" || e.primaries === "smpte432" || e.transfer === "pg" || e.transfer === "hlg" || e.matrix === "bt2020-ncl";
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
      return g(t !== null), so.some((n) => n.supports(t, e)) ? !0 : typeof VideoDecoder > "u" ? !1 : (await VideoDecoder.isConfigSupported(e)).supported === !0;
    } catch (e) {
      return console.error("Error during decodability check:", e), !1;
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
    return g(i), Pn(t, i, e.data);
  }
}
class Fn extends vr {
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
    return Z(this._backing.getCodec(), "codec", "getCodec");
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
    return Z(this._backing.getNumberOfChannels(), "numberOfChannels", "getNumberOfChannels");
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
    return Z(this._backing.getSampleRate(), "sampleRate", "getSampleRate");
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
      return g(t !== null), vn.some((i) => i.supports(t, e)) || e.codec.startsWith("pcm-") ? !0 : typeof AudioDecoder > "u" ? !1 : (await AudioDecoder.isConfigSupported(e)).supported === !0;
    } catch (e) {
      return console.error("Error during decodability check:", e), !1;
    }
  }
  async determinePacketType(e) {
    if (!(e instanceof Y))
      throw new TypeError("packet must be an EncodedPacket.");
    return await this.getCodec() === null ? null : "key";
  }
}
const Ds = (r) => -(r ?? -1 / 0), cr = (r) => -r, lr = (r) => {
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
}, xt = (r, e) => ({
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
}), Ri = async (r, e) => {
  let t = r;
  if (e?.filter) {
    const a = r.map((c) => e.filter(c));
    if (a.some((c) => c instanceof Promise)) {
      const c = await Promise.all(a);
      t = r.filter((l, d) => c[d]);
    } else
      t = r.filter((c, l) => a[l]);
  }
  if (!e?.sortBy)
    return t;
  const i = t.map((a) => e.sortBy(a)), s = i.some((a) => a instanceof Promise) ? await Promise.all(i) : i;
  return t.map((a, o) => ({ track: a, sortValue: s[o] })).sort((a, o) => {
    const c = Array.isArray(a.sortValue) ? a.sortValue : [a.sortValue], l = Array.isArray(o.sortValue) ? o.sortValue : [o.sortValue], d = Math.max(c.length, l.length);
    for (let u = 0; u < d; u++) {
      const f = c[u] ?? 0, h = l[u] ?? 0;
      if (f !== h)
        return f - h;
    }
    return 0;
  }).map((a) => a.track);
};
pn();
const uu = 1, du = 2;
let on = null;
typeof FinalizationRegistry < "u" && (on = new FinalizationRegistry((r) => {
  for (const e of r)
    e.freed || e.free();
}));
class tr extends ai {
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
    if (!Array.isArray(e.formats) || e.formats.some((t) => !(t instanceof qe)))
      throw new TypeError("options.formats must be an array of InputFormat.");
    if (!(e.source instanceof Le || e.source instanceof _n))
      throw new TypeError("options.source must be a Source or SourceRef.");
    if (e.source instanceof Le && e.source._disposed)
      throw new TypeError("options.source must not be a disposed Source.");
    if (e.initInput !== void 0 && !(e.initInput instanceof tr))
      throw new TypeError("options.initInput, when provided, must be an Input.");
    e.formatOptions !== void 0 && Wl(e.formatOptions, "formatOptions"), this._formats = e.formats, this._initInput = e.initInput ?? null, this._formatOptions = e.formatOptions ?? {}, e.source instanceof Le ? this._rootRef = e.source.ref() : this._rootRef = e.source, this._sourceRefs.push(this._rootRef), on?.register(this, this._sourceRefs, this);
  }
  /** @internal */
  get _rootSource() {
    return this._rootRef.source;
  }
  /** @internal */
  async _getSourceUncached(e) {
    g(this._rootSource instanceof fi);
    const t = await this._rootSource._resolveRequest(e);
    return this._emit("source", { source: t.source, request: e, isRoot: e.isRoot }), t;
  }
  /** @internal */
  _getSourceCached(e, t = uu) {
    const i = this._sourceCache.find((a) => a.cacheGroup === t && Ts(a.request, e));
    if (i)
      return i.age++, Promise.resolve(i.sourceRef.source.ref());
    const n = this._sourceCachePromises.find((a) => a.cacheGroup === t && Ts(a.request, e));
    if (n)
      return n.promise.then((a) => a.sourceRef.source.ref());
    const s = (async () => {
      const a = await this._getSourceUncached(e);
      if (fr(this._sourceCache, (u) => u.cacheGroup === t && u.sourceRef.source._refCount === 1) >= 4) {
        const u = Zs(this._sourceCache, (h) => h.cacheGroup === t && h.sourceRef.source._refCount === 1 ? h.age : 1 / 0);
        g(u !== -1);
        const f = this._sourceCache[u];
        this._sourceCache.splice(u, 1), f.sourceRef.free(), Co(this._sourceRefs, f.sourceRef);
      }
      this._sourceRefs.push(a);
      const l = this._sourceCachePromises.findIndex((u) => u.request === e);
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
      this._reader = new Ur(this._rootSource), this._emit("source", { source: this._rootSource, request: null, isRoot: !0 });
      for (const e of this._formats)
        if (await e._canReadInput(this))
          return this._format = e, this._onFormatDetermined?.(e), e._createDemuxer(this);
      throw new Os();
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
      if (e instanceof Os)
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
    const t = e.filter((n) => n !== null);
    if (t.length === 0)
      return 0;
    const i = await Promise.all(t.map((n) => n.getFirstTimestamp()));
    return Math.min(...i);
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
    e &&= lr(e);
    const i = (await this._getTrackBackings()).map((n) => this._wrapBackingAsTrack(n));
    return Ri(i, e);
  }
  /** Returns the list of all video tracks of this input file. An optional query can be provided. */
  async getVideoTracks(e) {
    e &&= lr(e);
    const i = (await this.getTracks()).filter((n) => n.isVideoTrack());
    return Ri(i, e);
  }
  /** Returns the list of all audio tracks of this input file. An optional query can be provided. */
  async getAudioTracks(e) {
    e &&= lr(e);
    const i = (await this.getTracks()).filter((n) => n.isAudioTrack());
    return Ri(i, e);
  }
  /**
   * Returns the primary video track of this input file, or null if there are no video tracks.
   *
   * Multiple factors determine which track is considered primary, including its position in the file, disposition,
   * bitrate (higher bitrate is preferred), and if it can be paired with an audio track.
   */
  async getPrimaryVideoTrack(e) {
    e &&= lr(e);
    const t = xt(e, {
      sortBy: async (n) => [
        cr((await n.getDisposition()).default),
        cr(await n.hasPairableAudioTrack()),
        cr(!await n.hasOnlyKeyPackets()),
        Ds(await n.getBitrate())
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
    e &&= lr(e);
    const t = await this.getPrimaryVideoTrack(), i = xt(e, {
      sortBy: async (s) => [
        cr(!t || s.canBePairedWith(t)),
        cr((await s.getDisposition()).default),
        Ds(await s.getBitrate())
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
    const n = e.getType() === "video" ? new pi(this, e) : new Fn(this, e);
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
      this._sourceRefs.length = 0, on?.unregister(this), this._demuxerPromise?.then((e) => e.dispose());
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
class Os extends Error {
  /** Creates a new {@link UnsupportedInputFormatError}. */
  constructor(e = "Input has an unsupported or unrecognizable format.") {
    super(e), this.name = "UnsupportedInputFormatError";
  }
}
class be extends Error {
  /** Creates a new {@link InputDisposedError}. */
  constructor(e = "Input has been disposed.") {
    super(e), this.name = "InputDisposedError";
  }
}
class Ur {
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
      throw new be();
    if (e < 0 || this.fileSizeNonStrict !== null && e + t > this.fileSizeNonStrict)
      return null;
    if (t === 0) {
      const s = new Uint8Array(0);
      return new we(s, Q(s), 0, e, e);
    }
    const i = e + t, n = this.source._read(e, i, Wa, La);
    return n instanceof Promise ? n.then((s) => s ? new we(s.bytes, s.view, s.offset, e, i) : null) : n ? new we(n.bytes, n.view, n.offset, e, i) : null;
  }
  requestSliceRange(e, t, i) {
    if (this.source._disposed)
      throw new be();
    if (e < 0)
      return null;
    if (this.fileSizeNonStrict !== null)
      return this.requestSlice(e, se(this.fileSizeNonStrict - e, t, i));
    {
      const n = this.requestSlice(e, i), s = (a) => a || (g(this.fileSizeNonStrict !== null), this.requestSlice(e, se(this.fileSizeNonStrict - e, t, i)));
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
        const a = t.length * e;
        let o = this.requestSliceRange(a, 0, e);
        if (o instanceof Promise && (o = await o), !o)
          break;
        t.push(z(o, o.length)), i += o.length;
      }
      const n = new Uint8Array(i);
      let s = 0;
      for (const a of t)
        n.set(a, s), s += a.length;
      return new we(n, Q(n), 0, 0, i);
    })();
  }
}
class we {
  constructor(e, t, i, n, s) {
    this.bytes = e, this.view = t, this.offset = i, this.start = n, this.end = s, this.bufferPos = n - i;
  }
  static tempFromBytes(e) {
    return new we(e, Q(e), 0, 0, e.length);
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
const ge = (r, e) => {
  if (r.filePos < r.start || r.filePos + e > r.end)
    throw new RangeError(`Tried reading [${r.filePos}, ${r.filePos + e}), but slice is [${r.start}, ${r.end}). This is likely an internal error, please report it alongside the file that caused it.`);
}, z = (r, e) => {
  ge(r, e);
  const t = r.bytes.subarray(r.bufferPos, r.bufferPos + e);
  return r.bufferPos += e, t;
}, R = (r) => (ge(r, 1), r.view.getUint8(r.bufferPos++)), ur = (r, e) => {
  ge(r, 2);
  const t = r.view.getUint16(r.bufferPos, e);
  return r.bufferPos += 2, t;
}, ne = (r) => {
  ge(r, 2);
  const e = r.view.getUint16(r.bufferPos, !1);
  return r.bufferPos += 2, e;
}, Qe = (r) => {
  ge(r, 3);
  const e = ni(r.view, r.bufferPos, !1);
  return r.bufferPos += 3, e;
}, cn = (r) => {
  ge(r, 2);
  const e = r.view.getInt16(r.bufferPos, !1);
  return r.bufferPos += 2, e;
}, pt = (r, e) => {
  ge(r, 4);
  const t = r.view.getUint32(r.bufferPos, e);
  return r.bufferPos += 4, t;
}, v = (r) => {
  ge(r, 4);
  const e = r.view.getUint32(r.bufferPos, !1);
  return r.bufferPos += 4, e;
}, Kt = (r) => {
  ge(r, 4);
  const e = r.view.getUint32(r.bufferPos, !0);
  return r.bufferPos += 4, e;
}, It = (r) => {
  ge(r, 4);
  const e = r.view.getInt32(r.bufferPos, !1);
  return r.bufferPos += 4, e;
}, fu = (r) => {
  ge(r, 4);
  const e = r.view.getInt32(r.bufferPos, !0);
  return r.bufferPos += 4, e;
}, Ns = (r, e) => {
  let t, i;
  return e ? (t = pt(r, !0), i = pt(r, !0)) : (i = pt(r, !1), t = pt(r, !1)), i * 4294967296 + t;
}, Ie = (r) => {
  const e = v(r), t = v(r);
  return e * 4294967296 + t;
}, hu = (r) => {
  const e = It(r), t = v(r);
  return e * 4294967296 + t;
}, mu = (r) => {
  const e = Kt(r);
  return fu(r) * 4294967296 + e;
}, pu = (r) => {
  ge(r, 4);
  const e = r.view.getFloat32(r.bufferPos, !1);
  return r.bufferPos += 4, e;
}, oo = (r) => {
  ge(r, 8);
  const e = r.view.getFloat64(r.bufferPos, !1);
  return r.bufferPos += 8, e;
}, te = (r, e) => {
  ge(r, e);
  let t = "";
  for (let i = 0; i < e; i++)
    t += String.fromCharCode(r.bytes[r.bufferPos++]);
  return t;
}, co = (r, e, t) => Te.decode(z(r, e)).split(`
`).map((s) => s.trim()).filter((s) => s.length > 0 && !t?.ignore?.(s));
var jt;
(function(r) {
  r[r.Unsynchronisation = 128] = "Unsynchronisation", r[r.ExtendedHeader = 64] = "ExtendedHeader", r[r.ExperimentalIndicator = 32] = "ExperimentalIndicator", r[r.Footer = 16] = "Footer";
})(jt || (jt = {}));
var Qt;
(function(r) {
  r[r.ISO_8859_1 = 0] = "ISO_8859_1", r[r.UTF_16_WITH_BOM = 1] = "UTF_16_WITH_BOM", r[r.UTF_16_BE_NO_BOM = 2] = "UTF_16_BE_NO_BOM", r[r.UTF_8 = 3] = "UTF_8";
})(Qt || (Qt = {}));
const Wr = 128, nt = 10, Gt = [
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
], gu = (r, e) => {
  const t = r.filePos;
  e.raw ??= {}, e.raw.TAG ??= z(r, Wr - 3), r.filePos = t;
  const i = zt(r, 30);
  i && (e.title ??= i);
  const n = zt(r, 30);
  n && (e.artist ??= n);
  const s = zt(r, 30);
  s && (e.album ??= s);
  const a = zt(r, 4), o = Number.parseInt(a, 10);
  Number.isInteger(o) && o > 0 && (e.date ??= new Date(o, 0, 1));
  const c = z(r, 30);
  let l;
  if (c[28] === 0 && c[29] !== 0) {
    const u = c[29];
    u > 0 && (e.trackNumber ??= u), r.skip(-30), l = zt(r, 28), r.skip(2);
  } else
    r.skip(-30), l = zt(r, 30);
  l && (e.comment ??= l);
  const d = R(r);
  d < Gt.length && (e.genre ??= Gt[d]);
}, zt = (r, e) => {
  const t = z(r, e), i = Dt(t.indexOf(0), t.length), n = t.subarray(0, i);
  let s = "";
  for (let a = 0; a < n.length; a++)
    s += String.fromCharCode(n[a]);
  return s.trimEnd();
}, Ft = (r) => {
  const e = r.filePos, t = te(r, 3), i = R(r), n = R(r), s = R(r), a = v(r);
  if (t !== "ID3" || i === 255 || n === 255 || (a & 2155905152) !== 0)
    return r.filePos = e, null;
  const o = Qi(a);
  return { majorVersion: i, revision: n, flags: s, size: o };
}, Rn = (r, e, t) => {
  if (![2, 3, 4].includes(e.majorVersion)) {
    console.warn(`Unsupported ID3v2 major version: ${e.majorVersion}`);
    return;
  }
  const i = z(r, e.size), n = new ku(e, i);
  if (e.flags & jt.Footer && n.removeFooter(), e.flags & jt.Unsynchronisation && e.majorVersion === 3 && n.ununsynchronizeAll(), e.flags & jt.ExtendedHeader) {
    const s = n.readU32();
    e.majorVersion === 3 ? n.pos += s : n.pos += s - 4;
  }
  for (; n.pos <= n.bytes.length - n.frameHeaderSize(); ) {
    const s = n.readId3V2Frame();
    if (!s)
      break;
    const a = n.pos, o = n.pos + s.size;
    let c = !1, l = !1, d = !1;
    if (e.majorVersion === 3 ? (c = !!(s.flags & 64), l = !!(s.flags & 128)) : e.majorVersion === 4 && (c = !!(s.flags & 4), l = !!(s.flags & 8), d = !!(s.flags & 2) || !!(e.flags & jt.Unsynchronisation)), c) {
      console.warn(`Skipping encrypted ID3v2 frame ${s.id}`), n.pos = o;
      continue;
    }
    if (l) {
      console.warn(`Skipping compressed ID3v2 frame ${s.id}`), n.pos = o;
      continue;
    }
    if (d && n.ununsynchronizeRegion(n.pos, o), t.raw ??= {}, s.id === "TXXX") {
      const u = t.raw.TXXX ??= {}, f = n.readId3V2TextEncoding(), h = n.readId3V2Text(f, o), p = n.readId3V2Text(f, o);
      u[h] ??= p;
    } else s.id[0] === "T" ? t.raw[s.id] ??= n.readId3V2EncodingAndText(o) : t.raw[s.id] ??= n.readBytes(s.size);
    switch (n.pos = a, s.id) {
      case "TIT2":
      case "TT2":
        t.title ??= n.readId3V2EncodingAndText(o);
        break;
      case "TIT3":
      case "TT3":
        t.description ??= n.readId3V2EncodingAndText(o);
        break;
      case "TPE1":
      case "TP1":
        t.artist ??= n.readId3V2EncodingAndText(o);
        break;
      case "TALB":
      case "TAL":
        t.album ??= n.readId3V2EncodingAndText(o);
        break;
      case "TPE2":
      case "TP2":
        t.albumArtist ??= n.readId3V2EncodingAndText(o);
        break;
      case "TRCK":
      case "TRK":
        {
          const f = n.readId3V2EncodingAndText(o).split("/"), h = Number.parseInt(f[0], 10), p = f[1] && Number.parseInt(f[1], 10);
          Number.isInteger(h) && h > 0 && (t.trackNumber ??= h), p && Number.isInteger(p) && p > 0 && (t.tracksTotal ??= p);
        }
        break;
      case "TPOS":
      case "TPA":
        {
          const f = n.readId3V2EncodingAndText(o).split("/"), h = Number.parseInt(f[0], 10), p = f[1] && Number.parseInt(f[1], 10);
          Number.isInteger(h) && h > 0 && (t.discNumber ??= h), p && Number.isInteger(p) && p > 0 && (t.discsTotal ??= p);
        }
        break;
      case "TCON":
      case "TCO":
        {
          const u = n.readId3V2EncodingAndText(o);
          let f = /^\((\d+)\)/.exec(u);
          if (f) {
            const h = Number.parseInt(f[1]);
            if (Gt[h] !== void 0) {
              t.genre ??= Gt[h];
              break;
            }
          }
          if (f = /^\d+$/.exec(u), f) {
            const h = Number.parseInt(f[0]);
            if (Gt[h] !== void 0) {
              t.genre ??= Gt[h];
              break;
            }
          }
          t.genre ??= u;
        }
        break;
      case "TDRC":
      case "TDAT":
        {
          const u = n.readId3V2EncodingAndText(o), f = new Date(u);
          Number.isNaN(f.getTime()) || (t.date ??= f);
        }
        break;
      case "TYER":
      case "TYE":
        {
          const u = n.readId3V2EncodingAndText(o), f = Number.parseInt(u, 10);
          Number.isInteger(f) && (t.date ??= new Date(f, 0, 1));
        }
        break;
      case "USLT":
      case "ULT":
        {
          const u = n.readU8();
          n.pos += 3, n.readId3V2Text(u, o), t.lyrics ??= n.readId3V2Text(u, o);
        }
        break;
      case "COMM":
      case "COM":
        {
          const u = n.readU8();
          n.pos += 3, n.readId3V2Text(u, o), t.comment ??= n.readId3V2Text(u, o);
        }
        break;
      case "APIC":
      case "PIC":
        {
          const u = n.readId3V2TextEncoding();
          let f;
          if (e.majorVersion === 2) {
            const b = n.readAscii(3);
            f = b === "PNG" ? "image/png" : b === "JPG" ? "image/jpeg" : "image/*";
          } else
            f = n.readId3V2Text(u, o);
          const h = n.readU8(), p = n.readId3V2Text(u, o).trimEnd(), m = o - n.pos;
          if (m >= 0) {
            const b = n.readBytes(m);
            t.images || (t.images = []), t.images.push({
              data: b,
              mimeType: f,
              kind: h === 3 ? "coverFront" : h === 4 ? "coverBack" : "unknown",
              description: p
            });
          }
        }
        break;
      default:
        n.pos += s.size;
        break;
    }
    n.pos = o;
  }
};
class ku {
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
  removeFooter() {
    this.bytes = this.bytes.subarray(0, this.bytes.length - nt), this.view = new DataView(this.bytes.buffer);
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
      let i = this.header.majorVersion === 4 ? Qi(t) : t;
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
        const o = this.header.majorVersion === 4 ? t : Qi(t);
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
      case Qt.ISO_8859_1: {
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
      case Qt.UTF_16_WITH_BOM:
        if (n[0] === 255 && n[1] === 254) {
          const s = new TextDecoder("utf-16le"), a = Dt(n.findIndex((o, c) => o === 0 && n[c + 1] === 0 && c % 2 === 0), n.length);
          return this.pos = i + Math.min(a + 2, n.length), s.decode(n.subarray(2, a));
        } else if (n[0] === 254 && n[1] === 255) {
          const s = new TextDecoder("utf-16be"), a = Dt(n.findIndex((o, c) => o === 0 && n[c + 1] === 0 && c % 2 === 0), n.length);
          return this.pos = i + Math.min(a + 2, n.length), s.decode(n.subarray(2, a));
        } else {
          const s = Dt(n.findIndex((a) => a === 0), n.length);
          return this.pos = i + Math.min(s + 1, n.length), Te.decode(n.subarray(0, s));
        }
      case Qt.UTF_16_BE_NO_BOM: {
        const s = new TextDecoder("utf-16be"), a = Dt(n.findIndex((o, c) => o === 0 && n[c + 1] === 0 && c % 2 === 0), n.length);
        return this.pos = i + Math.min(a + 2, n.length), s.decode(n.subarray(0, a));
      }
      case Qt.UTF_8: {
        const s = Dt(n.findIndex((a) => a === 0), n.length);
        return this.pos = i + Math.min(s + 1, n.length), Te.decode(n.subarray(0, s));
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
class yu {
  constructor(e) {
    this.mutex = new sr(), this.trackTimestampInfo = /* @__PURE__ */ new WeakMap(), this.output = e;
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
const Vs = /<(?:(\d{2}):)?(\d{2}):(\d{2}).(\d{3})>/g, bu = (r) => {
  const e = Math.floor(r / 36e5), t = Math.floor(r % (3600 * 1e3) / (60 * 1e3)), i = Math.floor(r % (60 * 1e3) / 1e3), n = r % 1e3;
  return e.toString().padStart(2, "0") + ":" + t.toString().padStart(2, "0") + ":" + i.toString().padStart(2, "0") + "." + n.toString().padStart(3, "0");
};
class Mr {
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
const H = /* @__PURE__ */ new Uint8Array(8), _e = /* @__PURE__ */ new DataView(H.buffer), re = (r) => [(r % 256 + 256) % 256], V = (r) => (_e.setUint16(0, r, !1), [H[0], H[1]]), Mn = (r) => (_e.setInt16(0, r, !1), [H[0], H[1]]), lo = (r) => (_e.setUint32(0, r, !1), [H[1], H[2], H[3]]), _ = (r) => (_e.setUint32(0, r, !1), [H[0], H[1], H[2], H[3]]), et = (r) => (_e.setInt32(0, r, !1), [H[0], H[1], H[2], H[3]]), He = (r) => (_e.setUint32(0, Math.floor(r / 2 ** 32), !1), _e.setUint32(4, r, !1), [H[0], H[1], H[2], H[3], H[4], H[5], H[6], H[7]]), wu = (r) => (_e.setInt32(0, Math.floor(r / 2 ** 32), !1), _e.setUint32(4, r, !1), [H[0], H[1], H[2], H[3], H[4], H[5], H[6], H[7]]), uo = (r) => (_e.setInt16(0, 2 ** 8 * r, !1), [H[0], H[1]]), Be = (r) => (_e.setInt32(0, 2 ** 16 * r, !1), [H[0], H[1], H[2], H[3]]), Mi = (r) => (_e.setInt32(0, 2 ** 30 * r, !1), [H[0], H[1], H[2], H[3]]), zi = (r, e) => {
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
}, fo = (r) => {
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
}, ho = /* @__PURE__ */ fo(0), mo = (r) => [
  Be(r[0]),
  Be(r[1]),
  Mi(r[2]),
  Be(r[3]),
  Be(r[4]),
  Mi(r[5]),
  Be(r[6]),
  Be(r[7]),
  Mi(r[8])
], N = (r, e, t) => ({
  type: r,
  contents: e && new Uint8Array(e.flat(10)),
  children: t
}), j = (r, e, t, i, n) => N(r, [re(e), lo(t), i ?? []], n), Tu = (r) => r.isQuickTime ? N("ftyp", [
  $("qt  "),
  // Major brand
  _(512),
  // Minor version
  // Compatible brands
  $("qt  ")
]) : r.fragmented ? r.cmaf ? N("ftyp", [
  $("iso5"),
  // Major brand
  _(512),
  // Minor version
  // Compatible brands
  $("iso5"),
  $("iso6"),
  $("mp41"),
  $("cmfc"),
  $("dash")
]) : N("ftyp", [
  $("iso5"),
  // Major brand
  _(512),
  // Minor version
  // Compatible brands
  $("iso5"),
  $("iso6"),
  $("mp41")
]) : N("ftyp", [
  $("isom"),
  // Major brand
  _(512),
  // Minor version
  // Compatible brands
  $("isom"),
  r.holdsAvc ? $("avc1") : [],
  $("mp41")
]), Us = () => N("styp", [
  $("iso5"),
  // Major brand
  _(0),
  // Minor version
  // Compatible brands
  $("iso5"),
  $("iso6"),
  $("mp41"),
  $("cmfc"),
  $("dash")
]), Ws = (r, e) => {
  let t = r.maxWrittenEndTimestamp - r.minWrittenTimestamp;
  return Number.isFinite(t) || (t = 0), j("sidx", 1, 0, [
    _(1),
    // Reference ID
    _(Fe),
    // Timescale
    He(J(r.minWrittenTimestamp, Fe)),
    // Earliest presentation time
    He(0),
    // First offset
    V(0),
    // Reserved
    V(1),
    // Reference count
    _(e & 2147483647),
    // Reference type (0) + referenced size
    _(J(t, Fe)),
    // Subsegment duration
    _(0)
    // Starts with SAP + SAP type + SAP delta time (no information provided)
  ]);
}, zr = (r) => ({ type: "mdat", largeSize: r }), Au = (r) => ({ type: "free", size: r }), dr = (r) => N("moov", void 0, [
  Su(r.creationTime, r.trackDatas),
  ...r.trackDatas.map((e) => xu(e, r.creationTime)),
  r.isFragmented ? ld(r.trackDatas) : null,
  Ad(r)
]), Su = (r, e) => {
  const t = Math.max(0, ...e.map((a) => J(gi(a), Fe) + J(a.startTimestampOffset ?? 0, Fe))), i = Math.max(0, ...e.map((a) => a.track.id)) + 1, n = !yt(r) || !yt(t), s = n ? He : _;
  return j("mvhd", +n, 0, [
    s(r),
    // Creation time
    s(r),
    // Modification time
    _(Fe),
    // Timescale
    s(t),
    // Duration
    Be(1),
    // Preferred rate
    uo(1),
    // Preferred volume
    Array(10).fill(0),
    // Reserved
    mo(ho),
    // Matrix
    Array(24).fill(0),
    // Pre-defined
    _(i)
    // Next track ID
  ]);
}, gi = (r) => {
  if (r.samples.length === 0)
    return 0;
  let e = 1 / 0, t = -1 / 0;
  for (let i = 0; i < r.samples.length; i++) {
    const n = r.samples[i];
    n.timestamp < e && (e = n.timestamp), n.timestamp + n.duration > t && (t = n.timestamp + n.duration);
  }
  return e === 1 / 0 ? 0 : t - e;
}, xu = (r, e) => {
  const t = Md(r), i = r.startTimestampOffset !== null && r.startTimestampOffset > 0;
  return N("trak", void 0, [
    Pu(r, e),
    i ? Cu(r, r.startTimestampOffset) : null,
    Iu(r, e),
    t.name !== void 0 ? N("udta", void 0, [
      N("name", [
        ...Ue.encode(t.name)
      ])
    ]) : null
  ]);
}, Pu = (r, e) => {
  const t = J(gi(r), Fe) + J(r.startTimestampOffset ?? 0, Fe), i = !yt(e) || !yt(t), n = i ? He : _;
  let s;
  if (r.type === "video") {
    const o = r.track.metadata.rotation;
    s = fo(o ?? 0);
  } else
    s = ho;
  let a = 2;
  return r.track.metadata.disposition?.default !== !1 && (a |= 1), j("tkhd", +i, a, [
    n(e),
    // Creation time
    n(e),
    // Modification time
    _(r.track.id),
    // Track ID
    _(0),
    // Reserved
    n(t),
    // Duration
    Array(8).fill(0),
    // Reserved
    V(0),
    // Layer
    V(r.track.id),
    // Alternate group
    uo(r.type === "audio" ? 1 : 0),
    // Volume
    V(0),
    // Reserved
    mo(s),
    // Matrix
    Be(r.type === "video" ? r.info.width : 0),
    // Track width
    Be(r.type === "video" ? r.info.height : 0)
    // Track height
  ]);
}, Cu = (r, e) => {
  const t = J(e, Fe), i = J(gi(r), Fe), n = !yt(t) || !yt(i), s = n ? He : _, a = n ? wu : et;
  return N("edts", void 0, [
    j("elst", n ? 1 : 0, 0, [
      _(2),
      // Entry count
      // #1
      s(t),
      // Segment duration
      a(-1),
      // Media time
      Be(1),
      // Media rate
      // #2
      s(i),
      // Segment duration
      a(0),
      // Media time
      Be(1)
      // Media rate
    ])
  ]);
}, Iu = (r, e) => N("mdia", void 0, [
  Eu(r, e),
  zn(!0, _u[r.type], vu[r.type]),
  Bu(r)
]), Eu = (r, e) => {
  const t = J(gi(r), r.timescale), i = !yt(e) || !yt(t), n = i ? He : _;
  return j("mdhd", +i, 0, [
    n(e),
    // Creation time
    n(e),
    // Modification time
    _(r.timescale),
    // Timescale
    n(t),
    // Duration
    V(yo(r.track.metadata.languageCode ?? de)),
    // Language
    V(0)
    // Quality
  ]);
}, _u = {
  video: "vide",
  audio: "soun",
  subtitle: "text"
}, vu = {
  video: "MediabunnyVideoHandler",
  audio: "MediabunnySoundHandler",
  subtitle: "MediabunnyTextHandler"
}, zn = (r, e, t, i = "\0\0\0\0") => j("hdlr", 0, 0, [
  r ? $("mhlr") : _(0),
  // Component type
  $(e),
  // Component subtype
  $(i),
  // Component manufacturer
  _(0),
  // Component flags
  _(0),
  // Component flags mask
  $(t, !0)
  // Component name
]), Bu = (r) => N("minf", void 0, [
  zu[r.type](),
  Du(),
  Vu(r)
]), Fu = () => j("vmhd", 0, 1, [
  V(0),
  // Graphics mode
  V(0),
  // Opcolor R
  V(0),
  // Opcolor G
  V(0)
  // Opcolor B
]), Ru = () => j("smhd", 0, 0, [
  V(0),
  // Balance
  V(0)
  // Reserved
]), Mu = () => j("nmhd", 0, 0), zu = {
  video: Fu,
  audio: Ru,
  subtitle: Mu
}, Du = () => N("dinf", void 0, [
  Ou()
]), Ou = () => j("dref", 0, 0, [
  _(1)
  // Entry count
], [
  Nu()
]), Nu = () => j("url ", 0, 1), Vu = (r) => {
  const e = r.compositionTimeOffsetTable.length > 1 || r.compositionTimeOffsetTable.some((t) => t.sampleCompositionTimeOffset !== 0);
  return N("stbl", void 0, [
    Uu(r),
    rd(r),
    e ? od(r) : null,
    e ? cd(r) : null,
    nd(r),
    sd(r),
    ad(r),
    id(r)
  ]);
}, Uu = (r) => {
  let e;
  if (r.type === "video")
    e = Wu(Cd(r.track.source._codec, r.info.decoderConfig.codec), r);
  else if (r.type === "audio") {
    const t = ko(r.track.source._codec, r.muxer.isQuickTime);
    g(t), e = Qu(t, r);
  } else r.type === "subtitle" && (e = ed(_d[r.track.source._codec], r));
  return g(e), j("stsd", 0, 0, [
    _(1)
    // Entry count
  ], [
    e
  ]);
}, Wu = (r, e) => N(r, [
  Array(6).fill(0),
  // Reserved
  V(1),
  // Data reference index
  V(0),
  // Pre-defined
  V(0),
  // Reserved
  Array(12).fill(0),
  // Pre-defined
  V(e.info.width),
  // Width
  V(e.info.height),
  // Height
  _(4718592),
  // Horizontal resolution
  _(4718592),
  // Vertical resolution
  _(0),
  // Reserved
  V(1),
  // Frame count
  Array(32).fill(0),
  // Compressor name
  V(24),
  // Depth
  Mn(65535)
  // Pre-defined
], [
  Id[e.track.source._codec](e),
  Lu(e),
  So(e.info.decoderConfig.colorSpace) ? Hu(e) : null
]), Lu = (r) => r.info.pixelAspectRatio.num === r.info.pixelAspectRatio.den ? null : N("pasp", [
  _(r.info.pixelAspectRatio.num),
  _(r.info.pixelAspectRatio.den)
]), Hu = (r) => N("colr", [
  $("nclx"),
  // Colour type
  V(rr[r.info.decoderConfig.colorSpace.primaries]),
  // Colour primaries
  V(ir[r.info.decoderConfig.colorSpace.transfer]),
  // Transfer characteristics
  V(nr[r.info.decoderConfig.colorSpace.matrix]),
  // Matrix coefficients
  re((r.info.decoderConfig.colorSpace.fullRange ? 1 : 0) << 7)
  // Full range flag
]), qu = (r) => r.info.decoderConfig && N("avcC", [
  // For AVC, description is an AVCDecoderConfigurationRecord, so nothing else to do here
  ...pe(r.info.decoderConfig.description)
]), Ku = (r) => r.info.decoderConfig && N("hvcC", [
  // For HEVC, description is an HEVCDecoderConfigurationRecord, so nothing else to do here
  ...pe(r.info.decoderConfig.description)
]), Ls = (r) => {
  if (!r.info.decoderConfig)
    return null;
  const e = r.info.decoderConfig, t = e.codec.split("."), i = Number(t[1]), n = Number(t[2]), s = Number(t[3]), a = t[4] ? Number(t[4]) : 1, o = t[8] ? Number(t[8]) : Number(e.colorSpace?.fullRange ?? 0), c = (s << 4) + (a << 1) + o, l = t[5] ? Number(t[5]) : e.colorSpace?.primaries ? rr[e.colorSpace.primaries] : 2, d = t[6] ? Number(t[6]) : e.colorSpace?.transfer ? ir[e.colorSpace.transfer] : 2, u = t[7] ? Number(t[7]) : e.colorSpace?.matrix ? nr[e.colorSpace.matrix] : 2;
  return j("vpcC", 1, 0, [
    re(i),
    // Profile
    re(n),
    // Level
    re(c),
    // Bit depth, chroma subsampling, full range
    re(l),
    // Colour primaries
    re(d),
    // Transfer characteristics
    re(u),
    // Matrix coefficients
    V(0)
    // Codec initialization data size
  ]);
}, ju = (r) => N("av1C", Wo(r.info.decoderConfig.codec)), Qu = (r, e) => {
  let t = 0, i, n = 16;
  const s = fe.includes(e.track.source._codec);
  if (s) {
    const a = e.track.source._codec, { sampleSize: o } = it(a);
    n = 8 * o, n > 16 && (t = 1);
  }
  if (e.muxer.isQuickTime && (t = 1), t === 0)
    i = [
      Array(6).fill(0),
      // Reserved
      V(1),
      // Data reference index
      V(t),
      // Version
      V(0),
      // Revision level
      _(0),
      // Vendor
      V(e.info.numberOfChannels),
      // Number of channels
      V(n),
      // Sample size (bits)
      V(0),
      // Compression ID
      V(0),
      // Packet size
      V(e.info.sampleRate < 2 ** 16 ? e.info.sampleRate : 0),
      // Sample rate (upper)
      V(0)
      // Sample rate (lower)
    ];
  else {
    const a = s ? 0 : -2;
    i = [
      Array(6).fill(0),
      // Reserved
      V(1),
      // Data reference index
      V(t),
      // Version
      V(0),
      // Revision level
      _(0),
      // Vendor
      V(e.info.numberOfChannels),
      // Number of channels
      V(Math.min(n, 16)),
      // Sample size (bits)
      Mn(a),
      // Compression ID
      V(0),
      // Packet size
      V(e.info.sampleRate < 2 ** 16 ? e.info.sampleRate : 0),
      // Sample rate (upper)
      V(0),
      // Sample rate (lower)
      s ? [
        _(1),
        // Samples per packet (must be 1 for uncompressed formats)
        _(n / 8),
        // Bytes per packet
        _(e.info.numberOfChannels * n / 8)
        // Bytes per frame
      ] : [
        _(0),
        // Samples per packet (don't bother, still works with 0)
        _(0),
        // Bytes per packet (variable)
        _(0)
        // Bytes per frame (variable)
      ],
      _(2)
      // Bytes per sample (constant in FFmpeg)
    ];
  }
  return N(r, i, [
    Ed(e.track.source._codec, e.muxer.isQuickTime)?.(e) ?? null
  ]);
}, Di = (r) => {
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
    ...lo(0),
    // 24bit buffer size
    ..._(0),
    // max bitrate
    ..._(0)
    // avg bitrate
  ];
  if (r.info.decoderConfig.description) {
    const i = pe(r.info.decoderConfig.description);
    t = [
      ...t,
      ...re(5),
      // TAG(5) = DecoderSpecificInfo
      ...zi(i.byteLength),
      ...i
    ];
  }
  return t = [
    ...V(1),
    // ES_ID = 1
    ...re(0),
    // flags etc = 0
    ...re(4),
    // TAG(4) = ES Descriptor
    ...zi(t.length),
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
    ...zi(t.length),
    ...t
  ], j("esds", 0, 0, t);
}, ct = (r) => N("wave", void 0, [
  Gu(r),
  Xu(r),
  N("\0\0\0\0")
  // NULL tag at the end
]), Gu = (r) => N("frma", [
  $(ko(r.track.source._codec, r.muxer.isQuickTime))
]), Xu = (r) => {
  const { littleEndian: e } = it(r.track.source._codec);
  return N("enda", [
    V(+e)
  ]);
}, $u = (r) => {
  let e = r.info.numberOfChannels, t = 3840, i = r.info.sampleRate, n = 0, s = 0, a = new Uint8Array(0);
  const o = r.info.decoderConfig?.description;
  if (o) {
    g(o.byteLength >= 18);
    const c = pe(o), l = pa(c);
    e = l.outputChannelCount, t = l.preSkip, i = l.inputSampleRate, n = l.outputGain, s = l.channelMappingFamily, l.channelMappingTable && (a = l.channelMappingTable);
  }
  return N("dOps", [
    re(0),
    // Version
    re(e),
    // OutputChannelCount
    V(t),
    // PreSkip
    _(i),
    // InputSampleRate
    Mn(n),
    // OutputGain
    re(s),
    // ChannelMappingFamily
    ...a
  ]);
}, Yu = (r) => {
  const e = r.info.decoderConfig?.description;
  g(e);
  const t = pe(e);
  return j("dfLa", 0, 0, [
    ...t.subarray(4)
  ]);
}, De = (r) => {
  const { littleEndian: e, sampleSize: t } = it(r.track.source._codec), i = +e;
  return j("pcmC", 0, 0, [
    re(i),
    re(8 * t)
  ]);
}, Zu = (r) => {
  const e = ga(r.info.firstPacket.data);
  if (!e)
    throw new Error("Couldn't extract AC-3 frame info from the audio packet. Ensure the packets contain valid AC-3 sync frames (as specified in ETSI TS 102 366).");
  const t = new Uint8Array(3), i = new G(t);
  return i.writeBits(2, e.fscod), i.writeBits(5, e.bsid), i.writeBits(3, e.bsmod), i.writeBits(3, e.acmod), i.writeBits(1, e.lfeon), i.writeBits(5, e.bitRateCode), i.writeBits(5, 0), N("dac3", [...t]);
}, Ju = (r) => {
  const e = ya(r.info.firstPacket.data);
  if (!e)
    throw new Error("Couldn't extract E-AC-3 frame info from the audio packet. Ensure the packets contain valid E-AC-3 sync frames (as specified in ETSI TS 102 366).");
  let t = 16;
  for (const a of e.substreams)
    t += 23, a.numDepSub > 0 ? t += 9 : t += 1;
  const i = Math.ceil(t / 8), n = new Uint8Array(i), s = new G(n);
  s.writeBits(13, e.dataRate), s.writeBits(3, e.substreams.length - 1);
  for (const a of e.substreams)
    s.writeBits(2, a.fscod), s.writeBits(5, a.bsid), s.writeBits(1, 0), s.writeBits(1, 0), s.writeBits(3, a.bsmod), s.writeBits(3, a.acmod), s.writeBits(1, a.lfeon), s.writeBits(3, 0), s.writeBits(4, a.numDepSub), a.numDepSub > 0 ? s.writeBits(9, a.chanLoc) : s.writeBits(1, 0);
  return N("dec3", [...n]);
}, ed = (r, e) => N(r, [
  Array(6).fill(0),
  // Reserved
  V(1)
  // Data reference index
], [
  vd[e.track.source._codec](e)
]), td = (r) => N("vttC", [
  ...Ue.encode(r.info.config.description)
]), rd = (r) => j("stts", 0, 0, [
  _(r.timeToSampleTable.length),
  // Number of entries
  r.timeToSampleTable.map((e) => [
    _(e.sampleCount),
    // Sample count
    _(e.sampleDelta)
    // Sample duration
  ])
]), id = (r) => {
  if (r.samples.every((t) => t.type === "key"))
    return null;
  const e = [...r.samples.entries()].filter(([, t]) => t.type === "key");
  return j("stss", 0, 0, [
    _(e.length),
    // Number of entries
    e.map(([t]) => _(t + 1))
    // Sync sample table
  ]);
}, nd = (r) => j("stsc", 0, 0, [
  _(r.compactlyCodedChunkTable.length),
  // Number of entries
  r.compactlyCodedChunkTable.map((e) => [
    _(e.firstChunk),
    // First chunk
    _(e.samplesPerChunk),
    // Samples per chunk
    _(1)
    // Sample description index
  ])
]), sd = (r) => {
  if (r.type === "audio" && r.info.requiresPcmTransformation) {
    const { sampleSize: e } = it(r.track.source._codec);
    return j("stsz", 0, 0, [
      _(e * r.info.numberOfChannels),
      // Sample size
      _(r.samples.reduce((t, i) => t + J(i.duration, r.timescale), 0))
    ]);
  }
  return j("stsz", 0, 0, [
    _(0),
    // Sample size (0 means non-constant size)
    _(r.samples.length),
    // Number of entries
    r.samples.map((e) => _(e.size))
    // Sample size table
  ]);
}, ad = (r) => r.finalizedChunks.length > 0 && ee(r.finalizedChunks).offset >= 2 ** 32 ? j("co64", 0, 0, [
  _(r.finalizedChunks.length),
  // Number of entries
  r.finalizedChunks.map((e) => He(e.offset))
  // Chunk offset table
]) : j("stco", 0, 0, [
  _(r.finalizedChunks.length),
  // Number of entries
  r.finalizedChunks.map((e) => _(e.offset))
  // Chunk offset table
]), od = (r) => j("ctts", 1, 0, [
  _(r.compositionTimeOffsetTable.length),
  // Number of entries
  r.compositionTimeOffsetTable.map((e) => [
    _(e.sampleCount),
    // Sample count
    et(e.sampleCompositionTimeOffset)
    // Sample offset
  ])
]), cd = (r) => {
  let e = 1 / 0, t = -1 / 0, i = 1 / 0, n = -1 / 0;
  g(r.compositionTimeOffsetTable.length > 0), g(r.samples.length > 0);
  for (let a = 0; a < r.compositionTimeOffsetTable.length; a++) {
    const o = r.compositionTimeOffsetTable[a];
    e = Math.min(e, o.sampleCompositionTimeOffset), t = Math.max(t, o.sampleCompositionTimeOffset);
  }
  for (let a = 0; a < r.samples.length; a++) {
    const o = r.samples[a];
    i = Math.min(i, J(o.timestamp, r.timescale)), n = Math.max(n, J(o.timestamp + o.duration, r.timescale));
  }
  const s = Math.max(-e, 0);
  return n >= 2 ** 31 ? null : j("cslg", 0, 0, [
    et(s),
    // Composition to DTS shift
    et(e),
    // Least decode to display delta
    et(t),
    // Greatest decode to display delta
    et(i),
    // Composition start time
    et(n)
    // Composition end time
  ]);
}, ld = (r) => N("mvex", void 0, r.map(ud)), ud = (r) => j("trex", 0, 0, [
  _(r.track.id),
  // Track ID
  _(1),
  // Default sample description index
  _(0),
  // Default sample duration
  _(0),
  // Default sample size
  _(0)
  // Default sample flags
]), Hs = (r, e) => N("moof", void 0, [
  dd(r),
  ...e.map(fd)
]), dd = (r) => j("mfhd", 0, 0, [
  _(r)
  // Sequence number
]), po = (r) => {
  let e = 0, t = 0;
  const i = 0, n = 0, s = r.type === "delta";
  return t |= +s, s ? e |= 1 : e |= 2, e << 24 | t << 16 | i << 8 | n;
}, fd = (r) => N("traf", void 0, [
  hd(r),
  md(r),
  pd(r)
]), hd = (r) => {
  g(r.currentChunk);
  let e = 0;
  e |= 8, e |= 16, e |= 32, e |= 131072;
  const t = r.currentChunk.samples[1] ?? r.currentChunk.samples[0], i = {
    duration: t.timescaleUnitsToNextSample,
    size: t.size,
    flags: po(t)
  };
  return j("tfhd", 0, e, [
    _(r.track.id),
    // Track ID
    _(i.duration),
    // Default sample duration
    _(i.size),
    // Default sample size
    _(i.flags)
    // Default sample flags
  ]);
}, md = (r) => (g(r.currentChunk), j("tfdt", 1, 0, [
  He(J(r.currentChunk.startTimestamp, r.timescale))
  // Base Media Decode Time
])), pd = (r) => {
  g(r.currentChunk);
  const e = r.currentChunk.samples.map((m) => m.timescaleUnitsToNextSample), t = r.currentChunk.samples.map((m) => m.size), i = r.currentChunk.samples.map(po), n = r.currentChunk.samples.map((m) => J(m.timestamp - m.decodeTimestamp, r.timescale)), s = new Set(e), a = new Set(t), o = new Set(i), c = new Set(n), l = o.size === 2 && i[0] !== i[1], d = s.size > 1, u = a.size > 1, f = !l && o.size > 1, h = c.size > 1 || [...c].some((m) => m !== 0);
  let p = 0;
  return p |= 1, p |= 4 * +l, p |= 256 * +d, p |= 512 * +u, p |= 1024 * +f, p |= 2048 * +h, j("trun", 1, p, [
    _(r.currentChunk.samples.length),
    // Sample count
    _(r.currentChunk.offset - r.currentChunk.moofOffset || 0),
    // Data offset
    l ? _(i[0]) : [],
    r.currentChunk.samples.map((m, b) => [
      d ? _(e[b]) : [],
      // Sample duration
      u ? _(t[b]) : [],
      // Sample size
      f ? _(i[b]) : [],
      // Sample flags
      // Sample composition time offsets
      h ? et(n[b]) : []
    ])
  ]);
}, gd = (r) => N("mfra", void 0, [
  ...r.map(kd),
  yd()
]), kd = (r, e) => j("tfra", 1, 0, [
  _(r.track.id),
  // Track ID
  _(63),
  // This specifies that traf number, trun number and sample number are 32-bit ints
  _(r.finalizedChunks.length),
  // Number of entries
  r.finalizedChunks.map((i) => [
    He(J(i.samples[0].timestamp, r.timescale)),
    // Time (in presentation time)
    He(i.moofOffset),
    // moof offset
    _(e + 1),
    // traf number
    _(1),
    // trun number
    _(1)
    // Sample number
  ])
]), yd = () => j("mfro", 0, 0, [
  // This value needs to be overwritten manually from the outside, where the actual size of the enclosing mfra box
  // is known
  _(0)
  // Size
]), bd = () => N("vtte"), wd = (r, e, t, i, n) => N("vttc", void 0, [
  n !== null ? N("vsid", [et(n)]) : null,
  t !== null ? N("iden", [...Ue.encode(t)]) : null,
  e !== null ? N("ctim", [...Ue.encode(bu(e))]) : null,
  i !== null ? N("sttg", [...Ue.encode(i)]) : null,
  N("payl", [...Ue.encode(r)])
]), Td = (r) => N("vtta", [...Ue.encode(r)]), Ad = (r) => {
  const e = [], t = r.format._options.metadataFormat ?? "auto", i = r.output._metadataTags;
  if (t === "mdir" || t === "auto" && !r.isQuickTime) {
    const n = xd(i);
    n && e.push(n);
  } else if (t === "mdta") {
    const n = Pd(i);
    n && e.push(n);
  } else (t === "udta" || t === "auto" && r.isQuickTime) && Sd(e, r.output._metadataTags);
  return e.length === 0 ? null : N("udta", void 0, e);
}, Sd = (r, e) => {
  for (const { key: t, value: i } of Ys(e))
    switch (t) {
      case "title":
        r.push(Oe("©nam", i));
        break;
      case "description":
        r.push(Oe("©des", i));
        break;
      case "artist":
        r.push(Oe("©ART", i));
        break;
      case "album":
        r.push(Oe("©alb", i));
        break;
      case "albumArtist":
        r.push(Oe("albr", i));
        break;
      case "genre":
        r.push(Oe("©gen", i));
        break;
      case "date":
        r.push(Oe("©day", i.toISOString().slice(0, 10)));
        break;
      case "comment":
        r.push(Oe("©cmt", i));
        break;
      case "lyrics":
        r.push(Oe("©lyr", i));
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
        rt(t);
    }
  if (e.raw)
    for (const t in e.raw) {
      const i = e.raw[t];
      i == null || t.length !== 4 || r.some((n) => n.type === t) || (typeof i == "string" ? r.push(Oe(t, i)) : i instanceof Uint8Array && r.push(N(t, Array.from(i))));
    }
}, Oe = (r, e) => {
  const t = Ue.encode(e);
  return N(r, [
    V(t.length),
    V(yo("und")),
    Array.from(t)
  ]);
}, qs = {
  "image/jpeg": 13,
  "image/png": 14,
  "image/bmp": 27
}, go = (r, e) => {
  const t = [];
  for (const { key: i, value: n } of Ys(r))
    switch (i) {
      case "title":
        t.push({ key: e ? "title" : "©nam", value: ve(n) });
        break;
      case "description":
        t.push({ key: e ? "description" : "©des", value: ve(n) });
        break;
      case "artist":
        t.push({ key: e ? "artist" : "©ART", value: ve(n) });
        break;
      case "album":
        t.push({ key: e ? "album" : "©alb", value: ve(n) });
        break;
      case "albumArtist":
        t.push({ key: e ? "album_artist" : "aART", value: ve(n) });
        break;
      case "comment":
        t.push({ key: e ? "comment" : "©cmt", value: ve(n) });
        break;
      case "genre":
        t.push({ key: e ? "genre" : "©gen", value: ve(n) });
        break;
      case "lyrics":
        t.push({ key: e ? "lyrics" : "©lyr", value: ve(n) });
        break;
      case "date":
        t.push({
          key: e ? "date" : "©day",
          value: ve(n.toISOString().slice(0, 10))
        });
        break;
      case "images":
        for (const s of n)
          s.kind === "coverFront" && t.push({ key: "covr", value: N("data", [
            _(qs[s.mimeType] ?? 0),
            // Type indicator
            _(0),
            // Locale indicator
            Array.from(s.data)
            // Kinda slow, hopefully temp
          ]) });
        break;
      case "trackNumber":
        if (e) {
          const s = r.tracksTotal !== void 0 ? `${n}/${r.tracksTotal}` : n.toString();
          t.push({ key: "track", value: ve(s) });
        } else
          t.push({ key: "trkn", value: N("data", [
            _(0),
            // 8 bytes empty
            _(0),
            V(0),
            // Empty
            V(n),
            V(r.tracksTotal ?? 0),
            V(0)
            // Empty
          ]) });
        break;
      case "discNumber":
        e || t.push({ key: "disc", value: N("data", [
          _(0),
          // 8 bytes empty
          _(0),
          V(0),
          // Empty
          V(n),
          V(r.discsTotal ?? 0),
          V(0)
          // Empty
        ]) });
        break;
      case "tracksTotal":
      case "discsTotal":
        break;
      case "raw":
        break;
      default:
        rt(i);
    }
  if (r.raw)
    for (const i in r.raw) {
      const n = r.raw[i];
      n == null || !e && i.length !== 4 || t.some((s) => s.key === i) || (typeof n == "string" ? t.push({ key: i, value: ve(n) }) : n instanceof Uint8Array ? t.push({ key: i, value: N("data", [
        _(0),
        // Type indicator
        _(0),
        // Locale indicator
        Array.from(n)
      ]) }) : n instanceof Xt && t.push({ key: i, value: N("data", [
        _(qs[n.mimeType] ?? 0),
        // Type indicator
        _(0),
        // Locale indicator
        Array.from(n.data)
        // Kinda slow, hopefully temp
      ]) }));
    }
  return t;
}, xd = (r) => {
  const e = go(r, !1);
  return e.length === 0 ? null : j("meta", 0, 0, void 0, [
    zn(!1, "mdir", "", "appl"),
    // mdir handler
    N("ilst", void 0, e.map((t) => N(t.key, void 0, [t.value])))
    // Item list without keys box
  ]);
}, Pd = (r) => {
  const e = go(r, !0);
  return e.length === 0 ? null : N("meta", void 0, [
    zn(!1, "mdta", ""),
    // mdta handler
    j("keys", 0, 0, [
      _(e.length)
    ], e.map((t) => N("mdta", [
      ...Ue.encode(t.key)
    ]))),
    N("ilst", void 0, e.map((t, i) => {
      const n = String.fromCharCode(..._(i + 1));
      return N(n, void 0, [t.value]);
    }))
  ]);
}, ve = (r) => N("data", [
  _(1),
  // Type indicator (UTF-8)
  _(0),
  // Locale indicator
  ...Ue.encode(r)
]), Cd = (r, e) => {
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
}, Id = {
  avc: qu,
  hevc: Ku,
  vp8: Ls,
  vp9: Ls,
  av1: ju
}, ko = (r, e) => {
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
}, Ed = (r, e) => {
  switch (r) {
    case "aac":
      return Di;
    case "mp3":
      return Di;
    case "opus":
      return $u;
    case "vorbis":
      return Di;
    case "flac":
      return Yu;
    case "ac3":
      return Zu;
    case "eac3":
      return Ju;
  }
  if (e)
    switch (r) {
      case "pcm-s24":
        return ct;
      case "pcm-s24be":
        return ct;
      case "pcm-s32":
        return ct;
      case "pcm-s32be":
        return ct;
      case "pcm-f32":
        return ct;
      case "pcm-f32be":
        return ct;
      case "pcm-f64":
        return ct;
      case "pcm-f64be":
        return ct;
    }
  else
    switch (r) {
      case "pcm-s16":
        return De;
      case "pcm-s16be":
        return De;
      case "pcm-s24":
        return De;
      case "pcm-s24be":
        return De;
      case "pcm-s32":
        return De;
      case "pcm-s32be":
        return De;
      case "pcm-f32":
        return De;
      case "pcm-f32be":
        return De;
      case "pcm-f64":
        return De;
      case "pcm-f64be":
        return De;
    }
  return null;
}, _d = {
  webvtt: "wvtt"
}, vd = {
  webvtt: td
}, yo = (r) => {
  g(r.length === 3);
  let e = 0;
  for (let t = 0; t < 3; t++)
    e <<= 5, e += r.charCodeAt(t) - 96;
  return e;
};
class ln {
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
class Ve extends ai {
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
    return new Fd(this, e);
  }
}
const Oi = 2 ** 16, Ni = 2 ** 32;
class Lr extends Ve {
  /** Creates a new {@link BufferTarget}. The buffer holding the data will be created and managed internally. */
  constructor(e = {}) {
    if (super(), this.buffer = null, this._maxPos = 0, !e || typeof e != "object")
      throw new TypeError("BufferTarget options, when provided, must be an object.");
    if (e.onFinalize !== void 0 && typeof e.onFinalize != "function")
      throw new TypeError("options.onFinalize, when provided, must be a function.");
    if (this._options = e, this._supportsResize = "resize" in new ArrayBuffer(0), this._supportsResize)
      try {
        this._buffer = new ArrayBuffer(Oi, { maxByteLength: Ni });
      } catch {
        this._buffer = new ArrayBuffer(Oi), this._supportsResize = !1;
      }
    else
      this._buffer = new ArrayBuffer(Oi);
    this._bytes = new Uint8Array(this._buffer);
  }
  /** @internal */
  _ensureSize(e) {
    let t = this._buffer.byteLength;
    for (; t < e; )
      t *= 2;
    if (t !== this._buffer.byteLength) {
      if (t > Ni)
        throw new Error(`ArrayBuffer exceeded maximum size of ${Ni} bytes. Please consider using another target.`);
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
class Bd extends Ve {
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
class Fd extends Ve {
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
class Vi {
  /** Creates a new {@link PathedTarget} from a root path and a callback. */
  constructor(e, t) {
    if (this.rootPath = e, this.getTarget = t, typeof e != "string")
      throw new TypeError("rootPath must be a string.");
    if (typeof t != "function")
      throw new TypeError("getTarget must be a function.");
  }
}
const Fe = 57600, Rd = 2082844800, Md = (r) => {
  const e = {}, t = r.track;
  return t.metadata.name !== void 0 && (e.name = t.metadata.name), e;
}, J = (r, e, t = !0) => {
  const i = r * e;
  return t ? Math.round(i) : i;
};
class zd extends yu {
  constructor(e, t) {
    super(e), this.writer = null, this.boxWriter = null, this.initWriter = null, this.initBoxWriter = null, this.auxTarget = new Lr(), this.auxWriter = new ln(this.auxTarget, !1), this.auxBoxWriter = new Mr(this.auxWriter), this.mdat = null, this.ftypSize = null, this.trackDatas = [], this.allTracksKnown = ce(), this.creationTime = Math.floor(Date.now() / 1e3) + Rd, this.finalizedChunks = [], this.nextFragmentNumber = 1, this.maxWrittenTimestamp = -1 / 0, this.minWrittenTimestamp = 1 / 0, this.maxWrittenEndTimestamp = -1 / 0, this.segmentHeaderSize = null, this.format = t, this.isQuickTime = t instanceof To, this.isCmaf = t instanceof Qs, this.minimumFragmentDuration = t._options.minimumFragmentDuration ?? (t instanceof Qs ? 1 / 0 : 1);
  }
  async start() {
    const e = await this.mutex.acquire();
    if (this.isCmaf ? (this.fastStart = "fragmented", this.isFragmented = !0) : (this.writer = await this.output._getRootWriter((i) => this.format._options.fastStart !== void 0 ? this.format._options.fastStart === "fragmented" : i instanceof Lr), this.boxWriter = new Mr(this.writer), this.fastStart = this.format._options.fastStart ?? (this.writer.target instanceof Lr ? "in-memory" : !1), this.isFragmented = this.fastStart === "fragmented"), this.isCmaf) {
      if (!this.output._hasInitTarget())
        throw new Error("CMAF outputs require the initTarget field in OutputOptions to be set; the init segment will be written to it.");
      const i = await this.output._getInitTarget(), n = new ln(i, !0);
      n.start(), this.initWriter = n, this.initBoxWriter = new Mr(n);
    }
    const t = this.output._tracks.some((i) => i.isVideoTrack() && i.source._codec === "avc");
    {
      const i = this.initBoxWriter ?? this.boxWriter;
      if (g(i), this.format._options.onFtyp && i.writer.startTrackingWrites(), i.writeBox(Tu({
        isQuickTime: this.isQuickTime,
        holdsAvc: t,
        fragmented: this.isFragmented,
        cmaf: this.isCmaf
      })), this.format._options.onFtyp) {
        const { data: n, start: s } = i.writer.stopTrackingWrites();
        this.format._options.onFtyp(n, s);
      }
      this.ftypSize = i.writer.getPos(), this.isCmaf && await this.initWriter.flush();
    }
    if (this.fastStart !== "in-memory") if (this.fastStart === "reserve") {
      for (const i of this.output._tracks)
        if (i.metadata.maximumPacketCount === void 0)
          throw new Error("All tracks must specify maximumPacketCount in their metadata when using fastStart: 'reserve'.");
    } else this.isFragmented || (g(this.writer), g(this.boxWriter), this.format._options.onMdat && this.writer.startTrackingWrites(), this.mdat = zr(!0), this.boxWriter.writeBox(this.mdat));
    await this.writer?.flush(), e();
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
    return Ta({
      isQuickTime: this.isQuickTime,
      hasVideo: this.trackDatas.some((t) => t.type === "video"),
      hasAudio: this.trackDatas.some((t) => t.type === "audio"),
      codecStrings: e
    });
  }
  getVideoTrackData(e, t, i) {
    const n = this.trackDatas.find((f) => f.track === e);
    if (n)
      return n;
    $o(i), g(i), g(i.decoderConfig);
    const s = { ...i.decoderConfig };
    g(s.codedWidth !== void 0), g(s.codedHeight !== void 0);
    let a = !1;
    if (e.source._codec === "avc" && !s.description) {
      const f = An(t.data);
      if (!f)
        throw new Error("Couldn't extract an AVCDecoderConfigurationRecord from the AVC packet. Make sure the packets are in Annex B format (as specified in ITU-T-REC-H.264) when not providing a description, or provide a description (must be an AVCDecoderConfigurationRecord as specified in ISO 14496-15) and ensure the packets are in AVCC format.");
      s.description = sc(f), a = !0;
    } else if (e.source._codec === "hevc" && !s.description) {
      const f = xn(t.data);
      if (!f)
        throw new Error("Couldn't extract an HEVCDecoderConfigurationRecord from the HEVC packet. Make sure the packets are in Annex B format (as specified in ITU-T-REC-H.265) when not providing a description, or provide a description (must be an HEVCDecoderConfigurationRecord as specified in ISO 14496-15) and ensure the packets are in HEVC format.");
      s.description = mc(f), a = !0;
    }
    const o = Mo(1 / (e.metadata.frameRate ?? Fe), 1e6).denominator, c = s.displayAspectWidth, l = s.displayAspectHeight, d = c === void 0 || l === void 0 ? { num: 1, den: 1 } : Gr({
      num: c * s.codedHeight,
      den: l * s.codedWidth
    }), u = {
      muxer: this,
      track: e,
      type: "video",
      info: {
        width: s.codedWidth,
        height: s.codedHeight,
        pixelAspectRatio: d,
        decoderConfig: s,
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
      startTimestampOffset: null,
      finalizedChunks: [],
      currentChunk: null,
      compactlyCodedChunkTable: [],
      closed: !1
    };
    return this.trackDatas.push(u), this.trackDatas.sort((f, h) => f.track.id - h.track.id), this.allTracksAreKnown() && this.allTracksKnown.resolve(), u;
  }
  getAudioTrackData(e, t, i) {
    const n = this.trackDatas.find((c) => c.track === e);
    if (n)
      return n;
    Zo(i), g(i), g(i.decoderConfig);
    const s = { ...i.decoderConfig };
    let a = !1;
    if (e.source._codec === "aac" && !s.description) {
      const c = Bt(we.tempFromBytes(t.data));
      if (!c)
        throw new Error("Couldn't parse ADTS header from the AAC packet. Make sure the packets are in ADTS format (as specified in ISO 13818-7) when not providing a description, or provide a description (must be an AudioSpecificConfig as specified in ISO 14496-3) and ensure the packets are raw AAC data.");
      const l = vt[c.samplingFrequencyIndex], d = Er[c.channelConfiguration];
      if (l === void 0 || d === void 0)
        throw new Error("Invalid ADTS frame header.");
      s.description = ea({
        objectType: c.objectType,
        sampleRate: l,
        numberOfChannels: d
      }), a = !0;
    }
    const o = {
      muxer: this,
      track: e,
      type: "audio",
      info: {
        numberOfChannels: i.decoderConfig.numberOfChannels,
        sampleRate: i.decoderConfig.sampleRate,
        decoderConfig: s,
        requiresPcmTransformation: !this.isFragmented && fe.includes(e.source._codec),
        expectedNextPcmPacketTimestamp: null,
        requiresAdtsStripping: a,
        firstPacket: t
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
    Jo(t), g(t), g(t.config);
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
        const c = [..._r(a)].map((l) => a.subarray(l.offset, l.offset + l.length));
        if (c.length === 0)
          throw new Error("Failed to transform packet data. Make sure all packets are provided in Annex B format, as specified in ITU-T-REC-H.264 and ITU-T-REC-H.265.");
        a = Tn(c, 4);
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
        const d = Bt(we.tempFromBytes(a));
        if (!d)
          throw new Error("Expected ADTS frame, didn't get one.");
        const u = d.crcCheck === null ? Jr : _t;
        a = a.subarray(u);
      }
      this.validateTimestamp(s.track, t.timestamp, t.type === "key");
      let o = t.timestamp, c = t.duration;
      if (s.info.requiresPcmTransformation) {
        const u = it(s.info.decoderConfig.codec).sampleSize * s.info.numberOfChannels;
        if (c = a.byteLength / u / s.info.sampleRate, s.info.expectedNextPcmPacketTimestamp !== null) {
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
    const n = J(i, e.timescale);
    if (i = n / e.timescale, n > 0) {
      const { sampleSize: s, silentValue: a } = it(e.info.decoderConfig.codec), o = n * e.info.numberOfChannels, c = new Uint8Array(s * o).fill(a), l = this.createSampleForTrack(e, new Uint8Array(c.buffer), t, i, "key");
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
      const n = [...i].sort((l, d) => l - d), s = n[0], a = n[1] ?? s;
      if (t < a)
        break;
      if (e.lastCueEndTimestamp < s) {
        this.auxWriter.seek(0);
        const l = bd();
        this.auxBoxWriter.writeBox(l);
        const d = this.auxTarget._getSlice(0, this.auxWriter.getPos()), u = this.createSampleForTrack(e, d, e.lastCueEndTimestamp, s - e.lastCueEndTimestamp, "key");
        await this.registerSample(e, u), e.lastCueEndTimestamp = s;
      }
      this.auxWriter.seek(0);
      for (let l = 0; l < e.cueQueue.length; l++) {
        const d = e.cueQueue[l];
        if (d.timestamp >= a)
          break;
        Vs.lastIndex = 0;
        const u = Vs.test(d.text), f = d.timestamp + d.duration;
        let h = e.cueToSourceId.get(d);
        if (h === void 0 && a < f && (h = e.nextSourceId++, e.cueToSourceId.set(d, h)), d.notes) {
          const m = Td(d.notes);
          this.auxBoxWriter.writeBox(m);
        }
        const p = wd(d.text, u ? s : null, d.identifier ?? null, d.settings ?? null, h ?? null);
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
      timescaleUnitsToNextSample: J(n, e.timescale)
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
        const a = e.timestampProcessingQueue[s], o = J(a.duration, e.timescale);
        n += o;
      }
      if (e.timeToSampleTable.length === 0)
        e.timeToSampleTable.push({
          sampleCount: n,
          sampleDelta: 1
        });
      else {
        const s = ee(e.timeToSampleTable);
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
      const a = J(s.timestamp - s.decodeTimestamp, e.timescale), o = J(s.duration, e.timescale);
      if (e.lastTimescaleUnits !== null) {
        g(e.lastSample);
        const c = J(s.decodeTimestamp, e.timescale, !1), l = Math.round(c - e.lastTimescaleUnits);
        if (g(l >= 0), e.lastTimescaleUnits += l, e.lastSample.timescaleUnitsToNextSample = l, !this.isFragmented) {
          let d = ee(e.timeToSampleTable);
          if (g(d), d.sampleCount === 1) {
            d.sampleDelta = l;
            const f = e.timeToSampleTable[e.timeToSampleTable.length - 2];
            f && f.sampleDelta === l && (f.sampleCount++, e.timeToSampleTable.pop(), d = f);
          } else d.sampleDelta !== l && (d.sampleCount--, e.timeToSampleTable.push(d = {
            sampleCount: 1,
            sampleDelta: l
          }));
          d.sampleDelta === o ? d.sampleCount++ : e.timeToSampleTable.push({
            sampleCount: 1,
            sampleDelta: o
          });
          const u = ee(e.compositionTimeOffsetTable);
          g(u), u.sampleCompositionTimeOffset === a ? u.sampleCount++ : e.compositionTimeOffsetTable.push({
            sampleCount: 1,
            sampleCompositionTimeOffset: a
          });
        }
      } else
        e.lastTimescaleUnits = J(s.decodeTimestamp, e.timescale, !1), this.isFragmented || (e.timeToSampleTable.push({
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
      const n = J(t.timestamp, e.timescale, !1), s = Math.round(n - e.lastTimescaleUnits);
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
      moofOffset: null
    }), g(e.currentChunk), e.currentChunk.samples.push(t), this.isFragmented && (this.maxWrittenTimestamp = Math.max(this.maxWrittenTimestamp, t.timestamp), this.maxWrittenEndTimestamp = Math.max(this.maxWrittenEndTimestamp, t.timestamp + t.duration), this.minWrittenTimestamp = Math.min(this.minWrittenTimestamp, t.timestamp));
  }
  async finalizeCurrentChunk(e) {
    if (g(!this.isFragmented), g(this.writer), !e.currentChunk)
      return;
    e.finalizedChunks.push(e.currentChunk), this.finalizedChunks.push(e.currentChunk);
    let t = e.currentChunk.samples.length;
    if (e.type === "audio" && e.info.requiresPcmTransformation && (t = e.currentChunk.samples.reduce((i, n) => i + J(n.duration, e.timescale), 0)), (e.compactlyCodedChunkTable.length === 0 || ee(e.compactlyCodedChunkTable).samplesPerChunk !== t) && e.compactlyCodedChunkTable.push({
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
    g(this.isFragmented);
    const t = this.nextFragmentNumber++;
    if (t === 1) {
      const h = this.initBoxWriter ?? this.boxWriter;
      g(h), this.format._options.onMoov && h.writer.startTrackingWrites();
      const p = dr(this);
      if (h.writeBox(p), this.format._options.onMoov) {
        const { data: m, start: b } = h.writer.stopTrackingWrites();
        this.format._options.onMoov(m, b);
      }
      if (this.isCmaf) {
        g(this.initWriter), await this.initWriter.flush(), await this.initWriter.finalize(), this.writer = await this.output._getRootWriter(!0), this.boxWriter = new Mr(this.writer);
        const m = this.boxWriter.measureBox(Us()), b = this.boxWriter.measureBox(Ws(this, 0));
        this.segmentHeaderSize = m + b, this.writer.seek(this.segmentHeaderSize);
      }
    }
    g(this.writer), g(this.boxWriter);
    const i = this.trackDatas.filter((h) => h.currentChunk), n = Hs(t, i), s = this.writer.getPos(), a = s + this.boxWriter.measureBox(n);
    let o = a + Ye, c = 1 / 0;
    for (const h of i) {
      h.currentChunk.offset = o, h.currentChunk.moofOffset = s;
      for (const p of h.currentChunk.samples)
        o += p.size;
      c = Math.min(c, h.currentChunk.startTimestamp);
    }
    const l = o - a, d = l >= 2 ** 32;
    if (d)
      for (const h of i)
        h.currentChunk.offset += Pt - Ye;
    this.format._options.onMoof && this.writer.startTrackingWrites();
    const u = Hs(t, i);
    if (this.boxWriter.writeBox(u), this.format._options.onMoof) {
      const { data: h, start: p } = this.writer.stopTrackingWrites();
      this.format._options.onMoof(h, p, c);
    }
    g(this.writer.getPos() === a), this.format._options.onMdat && this.writer.startTrackingWrites();
    const f = zr(d);
    f.size = l, this.boxWriter.writeBox(f), this.writer.seek(a + (d ? Pt : Ye));
    for (const h of i)
      for (const p of h.currentChunk.samples)
        this.writer.write(p.data), p.data = null;
    if (this.format._options.onMdat) {
      const { data: h, start: p } = this.writer.stopTrackingWrites();
      this.format._options.onMdat(h, p);
    }
    for (const h of i)
      h.finalizedChunks.push(h.currentChunk), this.finalizedChunks.push(h.currentChunk), h.currentChunk = null;
    e && await this.writer.flush();
  }
  async registerSampleFastStartReserve(e, t) {
    if (g(this.writer), g(this.boxWriter), this.allTracksAreKnown()) {
      if (!this.mdat) {
        const i = dr(this), s = this.boxWriter.measureBox(i) + this.computeSampleTableSizeUpperBound() + 4096;
        g(this.ftypSize !== null), this.writer.seek(this.ftypSize + s), this.format._options.onMdat && this.writer.startTrackingWrites(), this.mdat = zr(!0), this.boxWriter.writeBox(this.mdat);
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
  /** Finalizes the file, making it ready for use. Must be called after all video and audio chunks have been added. */
  async finalize() {
    const e = await this.mutex.acquire();
    this.allTracksKnown.resolve();
    for (const t of this.trackDatas)
      t.closed = !0, t.type === "subtitle" && t.track.source._codec === "webvtt" && await this.processWebVTTCues(t, 1 / 0), this.processTimestamps(t);
    if (this.isFragmented)
      await this.interleaveSamples(!0), await this.finalizeFragment(!1);
    else
      for (const t of this.trackDatas) {
        await this.finalizeCurrentChunk(t), g(t.startTimestampOffset !== null);
        for (let i = 0; i < t.samples.length; i++) {
          const n = t.samples[i];
          n.timestamp -= t.startTimestampOffset, n.decodeTimestamp -= t.startTimestampOffset;
        }
      }
    if (g(this.writer), g(this.boxWriter), this.fastStart === "in-memory") {
      this.mdat = zr(!1);
      let t;
      for (let n = 0; n < 2; n++) {
        const s = dr(this), a = this.boxWriter.measureBox(s);
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
      this.format._options.onMoov && this.writer.startTrackingWrites();
      const i = dr(this);
      if (this.boxWriter.writeBox(i), this.format._options.onMoov) {
        const { data: n, start: s } = this.writer.stopTrackingWrites();
        this.format._options.onMoov(n, s);
      }
      this.format._options.onMdat && this.writer.startTrackingWrites(), this.mdat.size = t, this.boxWriter.writeBox(this.mdat);
      for (const n of this.finalizedChunks)
        for (const s of n.samples)
          g(s.data), this.writer.write(s.data), s.data = null;
      if (this.format._options.onMdat) {
        const { data: n, start: s } = this.writer.stopTrackingWrites();
        this.format._options.onMdat(n, s);
      }
    } else if (this.isFragmented)
      if (this.isCmaf) {
        const t = this.segmentHeaderSize !== null ? this.writer.getPos() - this.segmentHeaderSize : 0;
        this.writer.seek(0), this.boxWriter.writeBox(Us()), this.boxWriter.writeBox(Ws(this, t));
      } else {
        const t = this.writer.getPos(), i = gd(this.trackDatas);
        this.boxWriter.writeBox(i);
        const n = this.writer.getPos() - t;
        this.writer.seek(this.writer.getPos() - 4), this.boxWriter.writeU32(n);
      }
    else {
      g(this.mdat);
      const t = this.boxWriter.offsets.get(this.mdat);
      g(t !== void 0);
      const i = this.writer.getPos() - t;
      if (this.mdat.size = i, this.mdat.largeSize = i >= 2 ** 32, this.boxWriter.patchBox(this.mdat), this.format._options.onMdat) {
        const { data: s, start: a } = this.writer.stopTrackingWrites();
        this.format._options.onMdat(s, a);
      }
      const n = dr(this);
      if (this.fastStart === "reserve") {
        g(this.ftypSize !== null), this.writer.seek(this.ftypSize), this.format._options.onMoov && this.writer.startTrackingWrites(), this.boxWriter.writeBox(n);
        const s = this.boxWriter.offsets.get(this.mdat) - this.writer.getPos();
        this.boxWriter.writeBox(Au(s));
      } else
        this.format._options.onMoov && this.writer.startTrackingWrites(), this.boxWriter.writeBox(n);
      if (this.format._options.onMoov) {
        const { data: s, start: a } = this.writer.stopTrackingWrites();
        this.format._options.onMoov(s, a);
      }
    }
    e();
  }
}
class bo {
  constructor(e) {
    this.sourceSampleRate = null, this.sourceNumberOfChannels = null, this.maxWrittenFrame = null, this.targetSampleRate = e.targetSampleRate, this.targetNumberOfChannels = e.targetNumberOfChannels, this.endTime = e.endTime, this.onSample = e.onSample, this.bufferSizeInFrames = Math.floor(this.targetSampleRate * 5), this.bufferSizeInSamples = this.bufferSizeInFrames * this.targetNumberOfChannels, this.outputBuffer = new Float32Array(this.bufferSizeInSamples), this.bufferStartFrame = Math.floor(e.startTime * this.targetSampleRate), this.timestampOffset = e.startTime - this.bufferStartFrame / this.targetSampleRate;
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
    this.sourceSampleRate === null && (this.sourceSampleRate = e.sampleRate, this.sourceNumberOfChannels = e.numberOfChannels, this.tempSourceBuffer = new Float32Array(this.sourceSampleRate * this.sourceNumberOfChannels), this.doChannelMixerSetup());
    const t = e.numberOfFrames * e.numberOfChannels;
    this.ensureTempBufferSize(t);
    const i = e.allocationSize({ planeIndex: 0, format: "f32" }), n = new Float32Array(this.tempSourceBuffer.buffer, 0, i / 4);
    e.copyTo(n, { planeIndex: 0, format: "f32" });
    const s = e.timestamp, a = Math.min(e.timestamp + e.duration, this.endTime), o = Math.floor(s * this.targetSampleRate), c = Math.ceil(a * this.targetSampleRate);
    for (let l = o; l < c; l++) {
      if (l < this.bufferStartFrame)
        continue;
      for (; l >= this.bufferStartFrame + this.bufferSizeInFrames; )
        await this.finalizeCurrentBuffer(), this.bufferStartFrame += this.bufferSizeInFrames;
      const d = l - this.bufferStartFrame;
      g(d < this.bufferSizeInFrames);
      const h = (l / this.targetSampleRate - s) * this.sourceSampleRate, p = Math.floor(h), m = Math.ceil(h), b = h - p;
      for (let k = 0; k < this.targetNumberOfChannels; k++) {
        let y = 0, w = 0;
        p >= 0 && p < e.numberOfFrames && (y = this.channelMixer(n, p, k)), m >= 0 && m < e.numberOfFrames && (w = this.channelMixer(n, m, k));
        const T = y + b * (w - y), A = d * this.targetNumberOfChannels + k;
        this.outputBuffer[A] += T;
      }
      this.maxWrittenFrame === null ? this.maxWrittenFrame = d : this.maxWrittenFrame = Math.max(this.maxWrittenFrame, d);
    }
  }
  async finalizeCurrentBuffer() {
    if (this.maxWrittenFrame === null)
      return;
    const e = (this.maxWrittenFrame + 1) * this.targetNumberOfChannels, t = new Float32Array(e);
    t.set(this.outputBuffer.subarray(0, e));
    const i = this.bufferStartFrame / this.targetSampleRate, n = new me({
      format: "f32",
      sampleRate: this.targetSampleRate,
      numberOfChannels: this.targetNumberOfChannels,
      timestamp: i + this.timestampOffset,
      data: t
    });
    await this.onSample(n), this.outputBuffer.fill(0), this.maxWrittenFrame = null;
  }
  finalize() {
    return this.finalizeCurrentBuffer();
  }
}
class Dn {
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
class On extends Dn {
  /** Internal constructor. */
  constructor(e) {
    if (super(), this._connectedTrack = null, !Ae.includes(e))
      throw new TypeError(`Invalid video codec '${e}'. Must be one of: ${Ae.join(", ")}.`);
    this._codec = e;
  }
}
const un = (r, e) => {
  if (r.metadata.hasOnlyKeyPackets && e.type !== "key")
    throw new Error("Cannot add non-key packets to a hasOnlyKeyPackets video track.");
};
class Dd extends On {
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
    return this._ensureValidAdd(), un(this._connectedTrack, e), this._connectedTrack.output._muxer.addEncodedVideoPacket(this._connectedTrack, e, t);
  }
}
class Od {
  constructor(e, t) {
    this.source = e, this.encodingConfig = t, this.ensureEncoderPromise = null, this.encoderInitialized = !1, this.encoder = null, this.muxer = null, this.lastMultipleOfKeyFrameInterval = -1, this.resizeCanvas = null, this.codedWidth = null, this.codedHeight = null, this.outputWidth = null, this.outputHeight = null, this.frameRateLastSample = null, this.frameRateLastTimestamp = null, this.frameRateLastEndTimestamp = null, this.preciseTimings = [], this.customEncoder = null, this.customEncoderCallSerializer = new si(), this.customEncoderQueueSize = 0, this.alphaEncoder = null, this.splitter = null, this.splitterCreationFailed = !1, this.alphaFrameQueue = [], this.error = null, this.lastMuxerPromise = Promise.resolve();
    const i = t.sizeChangeBehavior ?? "deny";
    if (["fill", "contain", "cover"].includes(i) && t.transform?.fit !== void 0)
      throw new TypeError(`Cannot set 'fit' when 'sizeChangeBehavior' is '${i}'. The size change behavior determines the fit in this case.`);
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
        const u = ii(e.rotation + (s.transform?.rotate ?? 0)), [f, h] = u % 180 === 0 ? [e.codedWidth, e.codedHeight] : [e.codedHeight, e.codedWidth];
        let p = s.transform?.crop;
        p && (p = hi(p, f, h));
        const m = p ? p.width : f, b = p ? p.height : h, k = m / b;
        let y, w, T = s.transform?.fit ?? "fill";
        o && a !== "passThrough" ? (g(this.outputWidth), g(this.outputHeight), g(a !== "deny"), y = this.outputWidth, w = this.outputHeight, T = a) : s.transform?.width !== void 0 && s.transform?.height === void 0 ? (y = s.transform.width, w = ut(Math.round(y / k))) : s.transform?.width === void 0 && s.transform?.height !== void 0 ? (w = s.transform.height, y = ut(Math.round(w * k))) : s.transform?.width !== void 0 && s.transform?.height !== void 0 ? (y = s.transform?.width, w = s.transform?.height) : (y = m, w = b), (this.outputWidth === null || this.outputHeight === null) && (this.outputWidth = y, this.outputHeight = w);
        let A = !1;
        this.resizeCanvas ? (this.resizeCanvas.width !== y || this.resizeCanvas.height !== w) && (this.resizeCanvas.width = y, this.resizeCanvas.height = w) : (typeof document < "u" ? (this.resizeCanvas = document.createElement("canvas"), this.resizeCanvas.width = y, this.resizeCanvas.height = w) : this.resizeCanvas = new OffscreenCanvas(y, w), A = !0);
        const x = this.resizeCanvas.getContext("2d", {
          // Firefox has VideoFrame glitches with opaque canvases
          alpha: this.encodingConfig.alpha === "keep" || Jt()
        });
        g(x), typeof x.resetTransform == "function" && x.resetTransform(), A || (Jt() ? (x.fillStyle = "black", x.fillRect(0, 0, y, w)) : x.clearRect(0, 0, y, w)), e.drawWithFit(x, {
          fit: T,
          rotation: u,
          crop: p
        }), t && e.close(), e = new ae(this.resizeCanvas, {
          timestamp: e.timestamp,
          duration: e.duration,
          rotation: 0
          // Rotation is now baked into the canvas
        }), t = !0;
      } else
        (this.outputWidth === null || this.outputHeight === null) && (this.outputWidth = e.codedWidth, this.outputHeight = e.codedHeight);
      const d = s.transform?.frameRate;
      if (d !== void 0) {
        const u = e.timestamp + e.duration, f = Lt(e.timestamp, d);
        if (this.frameRateLastSample !== null)
          if (f <= this.frameRateLastTimestamp) {
            this.frameRateLastSample.close(), this.frameRateLastSample = e.clone(), this.frameRateLastEndTimestamp = u;
            return;
          } else
            await this.padFrameRate(f, i);
        e === n && (e = e.clone(), t = !0), e.setTimestamp(f), e.setDuration(1 / d), this.frameRateLastSample?.close(), this.frameRateLastSample = e.clone(), this.frameRateLastTimestamp = f, this.frameRateLastEndTimestamp = u;
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
      Array.isArray(s) || (s = [s]), n = s.map((a) => a instanceof ae ? a : typeof VideoFrame < "u" && a instanceof VideoFrame ? new ae(a) : new ae(a, {
        timestamp: e.timestamp,
        duration: e.duration
      }));
    } else
      n = [e];
    try {
      for (const s of n) {
        this.encoderInitialized || (this.ensureEncoderPromise || this.ensureEncoder(s), this.encoderInitialized || await this.ensureEncoderPromise), g(this.encoderInitialized);
        const a = this.encodingConfig.keyFrameInterval ?? 2, o = Math.floor(s.timestamp / a), c = {
          ...t,
          keyFrame: t?.keyFrame || a === 0 || o !== this.lastMultipleOfKeyFrameInterval
        };
        if (this.lastMultipleOfKeyFrameInterval = o, this.customEncoder) {
          this.customEncoderQueueSize++;
          const l = s.clone(), d = this.customEncoderCallSerializer.call(() => this.customEncoder.encode(l, c)).then(() => this.customEncoderQueueSize--).catch((u) => this.error ??= u).finally(() => {
            l.close();
          });
          this.customEncoderQueueSize >= 4 && await d;
        } else {
          g(this.encoder);
          const l = s.toVideoFrame(), d = K(this.preciseTimings, l.timestamp, (f) => f.microsecondTimestamp), u = d !== -1 ? this.preciseTimings[d] : null;
          if (u && u.microsecondTimestamp === l.timestamp ? (u.timestamp !== s.timestamp && (u.timestampIsValid = !1), u.duration !== s.duration && (u.durationIsValid = !1)) : (this.preciseTimings.splice(d + 1, 0, {
            microsecondTimestamp: l.timestamp,
            timestamp: s.timestamp,
            duration: s.duration,
            timestampIsValid: !0,
            durationIsValid: !0
          }), this.preciseTimings.length > 128 && this.preciseTimings.shift()), !this.alphaEncoder)
            this.encoder.encode(l, c), l.close();
          else if (!!l.format && !l.format.includes("A") || this.splitterCreationFailed)
            this.alphaFrameQueue.push(null), this.encoder.encode(l, c), l.close();
          else {
            const h = l.displayWidth, p = l.displayHeight;
            if (!this.splitter)
              try {
                this.splitter = new Nd(h, p);
              } catch (m) {
                console.error("Due to an error, only color data will be encoded.", m), this.splitterCreationFailed = !0, this.alphaFrameQueue.push(null), this.encoder.encode(l, c), l.close();
              }
            if (this.splitter) {
              const m = this.splitter.extractColor(l), b = this.splitter.extractAlpha(l);
              this.alphaFrameQueue.push(b), this.encoder.encode(m, c), m.close(), l.close();
            }
          }
          this.encoder.encodeQueueSize >= 4 && await new Promise((f) => this.encoder.addEventListener("dequeue", f, { once: !0 }));
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
      const a = this.frameRateLastSample.clone();
      a.setTimestamp(this.frameRateLastTimestamp + s / i), a.setDuration(1 / i), await this.processAndEncode(a, t), a.close();
    }
  }
  ensureEncoder(e) {
    this.ensureEncoderPromise = (async () => {
      const t = to({
        ...this.encodingConfig,
        width: e.codedWidth,
        height: e.codedHeight,
        squarePixelWidth: e.squarePixelWidth,
        squarePixelHeight: e.squarePixelHeight,
        framerate: this.source._connectedTrack?.metadata.frameRate
      });
      this.encodingConfig.onEncoderConfig?.(t);
      const i = ti.find((n) => n.supports(this.encodingConfig.codec, t));
      if (i)
        this.customEncoder = new i(), this.customEncoder.codec = this.encodingConfig.codec, this.customEncoder.config = t, this.customEncoder.onPacket = (n, s) => {
          if (!(n instanceof Y))
            throw new TypeError("The first argument passed to onPacket must be an EncodedPacket.");
          if (s !== void 0 && (!s || typeof s != "object"))
            throw new TypeError("The second argument passed to onPacket must be an object or undefined.");
          un(this.source._connectedTrack, n), this.encodingConfig.onEncodedPacket?.(n, s), this.lastMuxerPromise = this.muxer.addEncodedVideoPacket(this.source._connectedTrack, n, s).catch((a) => {
            this.error ??= a;
          });
        }, await this.customEncoder.init();
      else {
        if (typeof VideoEncoder > "u")
          throw new Error("VideoEncoder is not supported by this browser.");
        if (t.alpha = "discard", this.encodingConfig.alpha === "keep" && (t.latencyMode = "quality"), (t.width % 2 === 1 || t.height % 2 === 1) && (this.encodingConfig.codec === "avc" || this.encodingConfig.codec === "hevc"))
          throw new Error(`The dimensions ${t.width}x${t.height} are not supported for codec '${this.encodingConfig.codec}'; both width and height must be even numbers. Make sure to round your dimensions to the nearest even number.`);
        if (!(await VideoEncoder.isConfigSupported(t)).supported)
          throw new Error(`This specific encoder configuration (${t.codec}, ${t.bitrate} bps, ${t.width}x${t.height}, hardware acceleration: ${t.hardwareAcceleration ?? "no-preference"}) is not supported by this browser. Consider using another codec or changing your video parameters.`);
        const a = [], o = [];
        let c = 0, l = 0;
        const d = (f, h, p) => {
          const m = {};
          if (h) {
            const w = new Uint8Array(h.byteLength);
            h.copyTo(w), m.alpha = w;
          }
          let b = Y.fromEncodedChunk(f, m);
          const k = K(this.preciseTimings, f.timestamp, (w) => w.microsecondTimestamp), y = k !== -1 ? this.preciseTimings[k] : null;
          y && y.microsecondTimestamp === f.timestamp && (b = b.clone({
            timestamp: y.timestampIsValid ? y.timestamp : void 0,
            duration: y.durationIsValid ? y.duration : void 0
          })), un(this.source._connectedTrack, b), this.encodingConfig.onEncodedPacket?.(b, p), this.lastMuxerPromise = this.muxer.addEncodedVideoPacket(this.source._connectedTrack, b, p).catch((w) => {
            this.error ??= w;
          });
        }, u = new Error("Encoding error").stack;
        if (this.encoder = new VideoEncoder({
          output: (f, h) => {
            if (!this.alphaEncoder) {
              d(f, null, h);
              return;
            }
            const p = this.alphaFrameQueue.shift();
            g(p !== void 0), p ? (this.alphaEncoder.encode(p, {
              // Crucial: The alpha frame is forced to be a key frame whenever the color frame
              // also is. Without this, playback can glitch and even crash in some browsers.
              // This is the reason why the two encoders are wired in series and not in parallel.
              keyFrame: f.type === "key"
            }), l++, p.close(), a.push({ chunk: f, meta: h })) : l === 0 ? d(f, null, h) : (o.push(c + l), a.push({ chunk: f, meta: h }));
          },
          error: (f) => {
            f.stack = u, this.error ??= f;
          }
        }), this.encoder.configure(t), this.encodingConfig.alpha === "keep") {
          const f = new Error("Encoding error").stack;
          this.alphaEncoder = new VideoEncoder({
            // We ignore the alpha chunk's metadata
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            output: (h, p) => {
              l--;
              const m = a.shift();
              for (g(m !== void 0), d(m.chunk, h, m.meta), c++; o.length > 0 && o[0] === c; ) {
                o.shift();
                const b = a.shift();
                g(b !== void 0), d(b.chunk, null, b.meta);
              }
            },
            error: (h) => {
              h.stack = f, this.error ??= h;
            }
          }), this.alphaEncoder.configure(t);
        }
      }
      g(this.source._connectedTrack), this.muxer = this.source._connectedTrack.output._muxer, this.encoderInitialized = !0;
    })();
  }
  async flushAndClose(e) {
    if (e || this.checkForEncoderError(), !e && this.frameRateLastSample) {
      const t = this.encodingConfig.transform.frameRate, i = Lt(this.frameRateLastEndTimestamp, t);
      await this.padFrameRate(i);
    }
    this.frameRateLastSample?.close(), this.frameRateLastSample = null, this.customEncoder ? (e || this.customEncoderCallSerializer.call(() => this.customEncoder.flush()), await this.customEncoderCallSerializer.call(() => this.customEncoder.close())) : this.encoder && (e || (await this.encoder.flush(), await this.alphaEncoder?.flush()), this.encoder.state !== "closed" && this.encoder.close(), this.alphaEncoder && this.alphaEncoder.state !== "closed" && this.alphaEncoder.close(), this.alphaFrameQueue.forEach((t) => t?.close()), this.splitter?.close()), e || this.checkForEncoderError();
  }
  getQueueSize() {
    return this.customEncoder ? this.customEncoderQueueSize : this.encoder?.encodeQueueSize ?? 0;
  }
  checkForEncoderError() {
    if (this.error)
      throw this.error;
  }
}
class Nd {
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
    const n = this.gl.getAttribLocation(this.colorProgram, "a_position"), s = this.gl.getAttribLocation(this.colorProgram, "a_texCoord");
    return this.gl.enableVertexAttribArray(n), this.gl.vertexAttribPointer(n, 2, this.gl.FLOAT, !1, 16, 0), this.gl.enableVertexAttribArray(s), this.gl.vertexAttribPointer(s, 2, this.gl.FLOAT, !1, 16, 8), e;
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
    const { width: t, height: i } = this.canvas, n = Math.ceil(t / 2) * Math.ceil(i / 2), s = t * i + n * 2, a = Math.ceil(s / (t * 4));
    let o = new Uint8Array(4 * t * a);
    this.gl.readPixels(0, 0, t, a, this.gl.RGBA, this.gl.UNSIGNED_BYTE, o), o = o.subarray(0, s), g(o[t * i] === 128), g(o[o.length - 1] === 128);
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
class Ks extends On {
  /**
   * Creates a new {@link VideoSampleSource} whose samples are encoded according to the specified
   * {@link VideoEncodingConfig}.
   */
  constructor(e) {
    Gl(e), super(e.codec), this._encoder = new Od(this, e);
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
class Nn extends Dn {
  /** Internal constructor. */
  constructor(e) {
    if (super(), this._connectedTrack = null, !Se.includes(e))
      throw new TypeError(`Invalid audio codec '${e}'. Must be one of: ${Se.join(", ")}.`);
    this._codec = e;
  }
}
class Vd extends Nn {
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
class Ud {
  constructor(e, t) {
    this.source = e, this.encodingConfig = t, this.ensureEncoderPromise = null, this.encoderInitialized = !1, this.encoder = null, this.muxer = null, this.lastNumberOfChannels = null, this.lastSampleRate = null, this.isPcmEncoder = !1, this.outputSampleSize = null, this.writeOutputValue = null, this.customEncoder = null, this.customEncoderCallSerializer = new si(), this.customEncoderQueueSize = 0, this.lastEndSampleIndex = null, this.resampler = null, this.error = null, this.lastMuxerPromise = Promise.resolve();
  }
  async add(e, t) {
    try {
      if (this.checkForEncoderError(), this.source._ensureValidAdd(), this.lastNumberOfChannels !== null && this.lastSampleRate !== null) {
        if (e.numberOfChannels !== this.lastNumberOfChannels || e.sampleRate !== this.lastSampleRate)
          throw new Error(`Audio parameters must remain constant. Expected ${this.lastNumberOfChannels} channels at ${this.lastSampleRate} Hz, got ${e.numberOfChannels} channels at ${e.sampleRate} Hz.`);
      } else
        this.lastNumberOfChannels = e.numberOfChannels, this.lastSampleRate = e.sampleRate;
      const i = this.encodingConfig;
      i.transform?.numberOfChannels !== void 0 || i.transform?.sampleRate !== void 0 ? (this.resampler || (this.resampler = new bo({
        targetNumberOfChannels: i.transform.numberOfChannels ?? e.numberOfChannels,
        targetSampleRate: i.transform.sampleRate ?? e.sampleRate,
        startTime: e.timestamp,
        endTime: 1 / 0,
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
    if (i.transform?.sampleFormat !== void 0 && Za(e.format) !== i.transform.sampleFormat) {
      const n = Ja(e, i.transform.sampleFormat);
      t && e.close(), e = n, t = !0;
    }
    if (i.transform?.process) {
      let n = i.transform.process(e);
      if (n instanceof Promise && (n = await n), n === null)
        return;
      Array.isArray(n) || (n = [n]);
      for (const s of n) {
        if (!(s instanceof me))
          throw new TypeError("The audio process function must return an AudioSample, null, or an array of AudioSamples.");
        await this.encodeSample(s, !0);
      }
      t && e.close();
    } else
      await this.encodeSample(e, t);
  }
  /**
   * Encodes a single audio sample, handling encoder init, gap padding, and backpressure.
   */
  async encodeSample(e, t) {
    try {
      this.encoderInitialized || (this.ensureEncoderPromise || this.ensureEncoder(e), this.encoderInitialized || await this.ensureEncoderPromise), g(this.encoderInitialized);
      {
        const i = Math.round(e.timestamp * e.sampleRate), n = Math.round((e.timestamp + e.duration) * e.sampleRate);
        if (this.lastEndSampleIndex === null)
          this.lastEndSampleIndex = n;
        else {
          const s = i - this.lastEndSampleIndex;
          if (s >= 64) {
            const a = new me({
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
      if (this.customEncoder) {
        this.customEncoderQueueSize++;
        const i = e.clone(), n = this.customEncoderCallSerializer.call(() => this.customEncoder.encode(i)).then(() => this.customEncoderQueueSize--).catch((s) => this.error ??= s).finally(() => {
          i.close();
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
      const h = Math.min(o, e.numberOfFrames - f), p = h * i * this.outputSampleSize, m = new ArrayBuffer(p), b = new DataView(m);
      c.push({ frameCount: h, view: b });
    }
    const l = e.allocationSize({ planeIndex: 0, format: "f32-planar" }), d = new Float32Array(l / Float32Array.BYTES_PER_ELEMENT);
    for (let f = 0; f < i; f++) {
      e.copyTo(d, { planeIndex: f, format: "f32-planar" });
      for (let h = 0; h < c.length; h++) {
        const { frameCount: p, view: m } = c[h];
        for (let b = 0; b < p; b++)
          this.writeOutputValue(m, (b * i + f) * this.outputSampleSize, d[h * o + b]);
      }
    }
    t && e.close();
    const u = {
      decoderConfig: {
        codec: this.encodingConfig.codec,
        numberOfChannels: i,
        sampleRate: s
      }
    };
    for (let f = 0; f < c.length; f++) {
      const { frameCount: h, view: p } = c[f], m = p.buffer, b = f * o, k = new Y(new Uint8Array(m), "key", a + b / s, h / s);
      this.encodingConfig.onEncodedPacket?.(k, u), await this.muxer.addEncodedAudioPacket(this.source._connectedTrack, k, u);
    }
  }
  ensureEncoder(e) {
    this.ensureEncoderPromise = (async () => {
      const { numberOfChannels: t, sampleRate: i } = e, n = io({
        numberOfChannels: t,
        sampleRate: i,
        ...this.encodingConfig
      });
      this.encodingConfig.onEncoderConfig?.(n);
      const s = ri.find((a) => a.supports(this.encodingConfig.codec, n));
      if (s)
        this.customEncoder = new s(), this.customEncoder.codec = this.encodingConfig.codec, this.customEncoder.config = n, this.customEncoder.onPacket = (a, o) => {
          if (!(a instanceof Y))
            throw new TypeError("The first argument passed to onPacket must be an EncodedPacket.");
          if (o !== void 0 && (!o || typeof o != "object"))
            throw new TypeError("The second argument passed to onPacket must be an object or undefined.");
          this.encodingConfig.onEncodedPacket?.(a, o), this.lastMuxerPromise = this.muxer.addEncodedAudioPacket(this.source._connectedTrack, a, o).catch((c) => {
            this.error ??= c;
          });
        }, await this.customEncoder.init();
      else if (fe.includes(this.encodingConfig.codec))
        this.initPcmEncoder();
      else {
        if (typeof AudioEncoder > "u")
          throw new Error("AudioEncoder is not supported by this browser.");
        if (!(await AudioEncoder.isConfigSupported(n)).supported)
          throw new Error(`This specific encoder configuration (${n.codec}, ${n.bitrate} bps, ${n.numberOfChannels} channels, ${n.sampleRate} Hz) is not supported by this browser. Consider using another codec or changing your audio parameters.`);
        const o = new Error("Encoding error").stack;
        this.encoder = new AudioEncoder({
          output: (c, l) => {
            if (this.encodingConfig.codec === "aac" && l?.decoderConfig) {
              let u = !1;
              if (!l.decoderConfig.description || l.decoderConfig.description.byteLength < 2 ? u = !0 : u = kn(pe(l.decoderConfig.description)).objectType === 0, u) {
                const f = Number(ee(n.codec.split(".")));
                l.decoderConfig.description = ea({
                  objectType: f,
                  numberOfChannels: l.decoderConfig.numberOfChannels,
                  sampleRate: l.decoderConfig.sampleRate
                });
              }
            }
            let d = Y.fromEncodedChunk(c);
            d = d.clone({
              timestamp: jr(d.timestamp, n.sampleRate),
              duration: c.duration != null ? jr(d.duration, n.sampleRate) : void 0
            }), this.encodingConfig.onEncodedPacket?.(d, l), this.lastMuxerPromise = this.muxer.addEncodedAudioPacket(this.source._connectedTrack, d, l).catch((u) => {
              this.error ??= u;
            });
          },
          error: (c) => {
            c.stack = o, this.error ??= c;
          }
        }), this.encoder.configure(n);
      }
      g(this.source._connectedTrack), this.muxer = this.source._connectedTrack.output._muxer, this.encoderInitialized = !0;
    })();
  }
  initPcmEncoder() {
    this.isPcmEncoder = !0;
    const e = this.encodingConfig.codec, { dataType: t, sampleSize: i, littleEndian: n } = it(e);
    switch (this.outputSampleSize = i, i) {
      case 1:
        t === "unsigned" ? this.writeOutputValue = (s, a, o) => s.setUint8(a, se((o + 1) * 127.5, 0, 255)) : t === "signed" ? this.writeOutputValue = (s, a, o) => {
          s.setInt8(a, se(Math.round(o * 128), -128, 127));
        } : t === "ulaw" ? this.writeOutputValue = (s, a, o) => {
          const c = se(Math.floor(o * 32767), -32768, 32767);
          s.setUint8(a, tu(c));
        } : t === "alaw" ? this.writeOutputValue = (s, a, o) => {
          const c = se(Math.floor(o * 32767), -32768, 32767);
          s.setUint8(a, iu(c));
        } : g(!1);
        break;
      case 2:
        t === "unsigned" ? this.writeOutputValue = (s, a, o) => s.setUint16(a, se((o + 1) * 32767.5, 0, 65535), n) : t === "signed" ? this.writeOutputValue = (s, a, o) => s.setInt16(a, se(Math.round(o * 32767), -32768, 32767), n) : g(!1);
        break;
      case 3:
        t === "unsigned" ? this.writeOutputValue = (s, a, o) => mn(s, a, se((o + 1) * 83886075e-1, 0, 16777215), n) : t === "signed" ? this.writeOutputValue = (s, a, o) => vo(s, a, se(Math.round(o * 8388607), -8388608, 8388607), n) : g(!1);
        break;
      case 4:
        t === "unsigned" ? this.writeOutputValue = (s, a, o) => s.setUint32(a, se((o + 1) * 21474836475e-1, 0, 4294967295), n) : t === "signed" ? this.writeOutputValue = (s, a, o) => s.setInt32(a, se(Math.round(o * 2147483647), -2147483648, 2147483647), n) : t === "float" ? this.writeOutputValue = (s, a, o) => s.setFloat32(a, o, n) : g(!1);
        break;
      case 8:
        t === "float" ? this.writeOutputValue = (s, a, o) => s.setFloat64(a, o, n) : g(!1);
        break;
      default:
        rt(i), g(!1);
    }
  }
  async flushAndClose(e) {
    e || this.checkForEncoderError(), !e && this.resampler && await this.resampler.finalize(), this.resampler = null, this.customEncoder ? (e || this.customEncoderCallSerializer.call(() => this.customEncoder.flush()), await this.customEncoderCallSerializer.call(() => this.customEncoder.close())) : this.encoder && (e || await this.encoder.flush(), this.encoder.state !== "closed" && this.encoder.close()), e || this.checkForEncoderError();
  }
  getQueueSize() {
    return this.customEncoder ? this.customEncoderQueueSize : this.isPcmEncoder ? 0 : this.encoder?.encodeQueueSize ?? 0;
  }
  checkForEncoderError() {
    if (this.error)
      throw this.error;
  }
}
class js extends Nn {
  /**
   * Creates a new {@link AudioSampleSource} whose samples are encoded according to the specified
   * {@link AudioEncodingConfig}.
   */
  constructor(e) {
    Xl(e), super(e.codec), this._encoder = new Ud(this, e);
  }
  /**
   * Encodes an audio sample and then adds it to the output.
   *
   * @returns A Promise that resolves once the output is ready to receive more samples. You should await this Promise
   * to respect writer and encoder backpressure.
   */
  add(e) {
    if (!(e instanceof me))
      throw new TypeError("audioSample must be an AudioSample.");
    return this._encoder.add(e, !1);
  }
  /** @internal */
  _flushAndClose(e) {
    return this._encoder.flushAndClose(e);
  }
}
class Wd extends Dn {
  /** Internal constructor. */
  constructor(e) {
    if (super(), this._connectedTrack = null, !Ar.includes(e))
      throw new TypeError(`Invalid subtitle codec '${e}'. Must be one of: ${Ar.join(", ")}.`);
    this._codec = e;
  }
}
class wo {
  /** Returns a list of video codecs that this output format can contain. */
  getSupportedVideoCodecs() {
    return this.getSupportedCodecs().filter((e) => Ae.includes(e));
  }
  /** Returns a list of audio codecs that this output format can contain. */
  getSupportedAudioCodecs() {
    return this.getSupportedCodecs().filter((e) => Se.includes(e));
  }
  /** Returns a list of subtitle codecs that this output format can contain. */
  getSupportedSubtitleCodecs() {
    return this.getSupportedCodecs().filter((e) => Ar.includes(e));
  }
  /** @internal */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _codecUnsupportedHint(e) {
    return "";
  }
}
class Vn extends wo {
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
  get supportsTimestampedMediaData() {
    return !0;
  }
  /** @internal */
  _createMuxer(e) {
    return new zd(e, this);
  }
}
class Un extends Vn {
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
      ...Ae,
      ...$t,
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
      ...Ar
    ];
  }
  /** @internal */
  _codecUnsupportedHint(e) {
    return new To().getSupportedCodecs().includes(e) ? " Switching to MOV will grant support for this codec." : "";
  }
}
class Qs extends Vn {
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
      ...Ae,
      ...$t,
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
      ...Ar
    ];
  }
}
class To extends Vn {
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
      ...Ae,
      ...Se
    ];
  }
  /** @internal */
  _codecUnsupportedHint(e) {
    return new Un().getSupportedCodecs().includes(e) ? " Switching to MP4 will grant support for this codec." : "";
  }
}
const Ld = ["video", "audio", "subtitle"];
class Br {
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
    if (!(e instanceof Br))
      throw new TypeError("other must be an OutputTrack.");
    if (this === e)
      return !1;
    const t = Gn(this.metadata.group), i = Gn(e.metadata.group);
    for (const n of t)
      if (this.type !== e.type && i.some((o) => n === o) || i.some((o) => n._pairedGroups.has(o)))
        return !0;
    return !1;
  }
}
class Hd extends Br {
  /** @internal */
  constructor(e, t, i, n) {
    super(e, t, "video", i, n);
  }
}
class qd extends Br {
  /** @internal */
  constructor(e, t, i, n) {
    super(e, t, "audio", i, n);
  }
}
class Kd extends Br {
  /** @internal */
  constructor(e, t, i, n) {
    super(e, t, "subtitle", i, n);
  }
}
class Re {
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
    if (!(e instanceof Re))
      throw new TypeError("other must be an OutputTrackGroup.");
    if (this === e)
      throw new TypeError("Cannot pair a group with itself.");
    this._pairedGroups.add(e), e._pairedGroups.add(this);
  }
}
const Ui = (r) => {
  if (!r || typeof r != "object")
    throw new TypeError("metadata must be an object.");
  if (r.languageCode !== void 0 && !Tr(r.languageCode))
    throw new TypeError("metadata.languageCode, when provided, must be a three-letter, ISO 639-2/T language code.");
  if (r.name !== void 0 && typeof r.name != "string")
    throw new TypeError("metadata.name, when provided, must be a string.");
  if (r.disposition !== void 0 && Vo(r.disposition), r.maximumPacketCount !== void 0 && (!Number.isInteger(r.maximumPacketCount) || r.maximumPacketCount < 0))
    throw new TypeError("metadata.maximumPacketCount, when provided, must be a non-negative integer.");
  if (r.group !== void 0 && !(r.group instanceof Re) && (!Array.isArray(r.group) || r.group.some((e) => !(e instanceof Re))))
    throw new TypeError("metadata.group, when provided, must be an OutputTrackGroup instance or an array of OutputTrackGroup instances.");
};
class dn extends ai {
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
    if (super(), this.state = "pending", this.defaultTrackGroup = new Re(), this._onFinalize = null, this._unfinalizedTargets = /* @__PURE__ */ new Set(), this._rootWriterPromise = null, this._tracks = [], this._startPromise = null, this._cancelPromise = null, this._finalizePromise = null, this._mutex = new sr(), this._metadataTags = {}, this._rootTarget = null, this._rootTargetPromise = null, this._firstMediaStreamTimestamp = null, !e || typeof e != "object")
      throw new TypeError("options must be an object.");
    if (!(e.format instanceof wo))
      throw new TypeError("options.format must be an OutputFormat.");
    if (!(e.target instanceof Ve || e.target instanceof Vi))
      throw new TypeError("options.target must be a Target or a PathedTarget.");
    if (e.target instanceof Ve && this._rememberTarget(e.target), e.initTarget !== void 0 && !(e.initTarget instanceof Ve) && typeof e.initTarget != "function")
      throw new Error("options.initTarget, when provided, must be a Target or a function that returns or resolves to a Target.");
    if (e.onFinalize !== void 0 && typeof e.onFinalize != "function")
      throw new TypeError("options.onFinalize, when provided, must be a function.");
    this.format = e.format, this._target = e.target, this._onFinalize = e.onFinalize ?? null, this._initTarget = e.initTarget ?? null, this._initTarget instanceof Ve && this._rememberTarget(this._initTarget), this._muxer = e.format._createMuxer(this);
  }
  /** @internal */
  _getTargetValidated(e) {
    g(this._target instanceof Vi);
    const t = this._target.getTarget(e), i = (n) => {
      if (!(n instanceof Ve))
        throw new TypeError("getTarget must return a Target.");
      return n;
    };
    return t instanceof Promise ? t.then(i) : i(t);
  }
  /** @internal */
  async _getTarget(e) {
    g(this._target instanceof Vi);
    const t = await this._getTargetValidated(e);
    return this._emit("target", { target: t, request: e, isRoot: e.isRoot }), this.state === "canceled" ? await t._close() : this._rememberTarget(t), t;
  }
  /** @internal */
  _rememberTarget(e) {
    this._unfinalizedTargets.add(e), e.on("finalized", () => this._unfinalizedTargets.delete(e), { once: !0 });
  }
  /** @internal */
  async _getInitTarget() {
    if (g(this._initTarget !== null), this._initTarget instanceof Ve)
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
    if (this._target instanceof Ve)
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
      const t = await this._getRootTarget(), i = new ln(t, typeof e == "boolean" ? e : e(t));
      return i.start(), i;
    })();
  }
  /** Adds a video track to the output with the given source. Can only be called before the output is started. */
  addVideoTrack(e, t = {}) {
    if (!(e instanceof On))
      throw new TypeError("source must be a VideoSource.");
    if (Ui(t), t.rotation !== void 0 && ![0, 90, 180, 270].includes(t.rotation))
      throw new TypeError(`Invalid video rotation: ${t.rotation}. Has to be 0, 90, 180 or 270.`);
    if (!this.format.supportsVideoRotationMetadata && t.rotation)
      throw new Error(`${this.format._name} does not support video rotation metadata.`);
    if (t.frameRate !== void 0 && (!Number.isFinite(t.frameRate) || t.frameRate <= 0))
      throw new TypeError(`Invalid video frame rate: ${t.frameRate}. Must be a positive number.`);
    const i = { ...t };
    return i.group ??= this.defaultTrackGroup, this._addTrack(new Hd(this._tracks.length + 1, this, e, i));
  }
  /** Adds an audio track to the output with the given source. Can only be called before the output is started. */
  addAudioTrack(e, t = {}) {
    if (!(e instanceof Nn))
      throw new TypeError("source must be an AudioSource.");
    Ui(t);
    const i = { ...t };
    return i.group ??= this.defaultTrackGroup, this._addTrack(new qd(this._tracks.length + 1, this, e, i));
  }
  /** Adds a subtitle track to the output with the given source. Can only be called before the output is started. */
  addSubtitleTrack(e, t = {}) {
    if (!(e instanceof Wd))
      throw new TypeError("source must be a SubtitleSource.");
    Ui(t);
    const i = { ...t };
    return i.group ??= this.defaultTrackGroup, this._addTrack(new Kd(this._tracks.length + 1, this, e, i));
  }
  /**
   * Sets descriptive metadata tags about the media file, such as title, author, date, or cover art. When called
   * multiple times, only the metadata from the last call will be used.
   *
   * Can only be called before the output is started.
   */
  setMetadataTags(e) {
    if (ji(e), this.state !== "pending")
      throw new Error("Cannot set metadata tags after output has been started or canceled.");
    this._metadataTags = e;
  }
  /** @internal */
  _addTrack(e) {
    if (this.state !== "pending")
      throw new Error("Cannot add track after output has been started or canceled.");
    if (e.source._connectedTrack)
      throw new Error("Source is already used for a track.");
    const t = this.format.getSupportedTrackCounts(), i = this._tracks.reduce((a, o) => a + (o.type === e.type ? 1 : 0), 0), n = t[e.type].max;
    if (i === n)
      throw new Error(n === 0 ? `${this.format._name} does not support ${e.type} tracks.` : `${this.format._name} does not support more than ${n} ${e.type} track${n === 1 ? "" : "s"}.`);
    const s = t.total.max;
    if (this._tracks.length === s)
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
    return this._tracks.push(e), e.source._connectedTrack = e, e;
  }
  /**
   * Starts the creation of the output file. This method should be called after all tracks have been added. Only after
   * the output has started can media samples be added to the tracks.
   *
   * @returns A promise that resolves when the output has successfully started and is ready to receive media samples.
   */
  async start() {
    const e = this.format.getSupportedTrackCounts();
    for (const i of Ld) {
      const n = this._tracks.reduce((a, o) => a + (o.type === i ? 1 : 0), 0), s = e[i].min;
      if (n < s)
        throw new Error(s === e[i].max ? `${this.format._name} requires exactly ${s} ${i} track${s === 1 ? "" : "s"}.` : `${this.format._name} requires at least ${s} ${i} track${s === 1 ? "" : "s"}.`);
    }
    const t = e.total.min;
    if (this._tracks.length < t)
      throw new Error(t === e.total.max ? `${this.format._name} requires exactly ${t} track${t === 1 ? "" : "s"}.` : `${this.format._name} requires at least ${t} track${t === 1 ? "" : "s"}.`);
    if (this.state === "canceled")
      throw new Error("Output has been canceled.");
    return this._startPromise ? (console.warn("Output has already been started."), this._startPromise) : this._startPromise = (async () => {
      this.state = "started";
      const i = await this._mutex.acquire();
      try {
        await this._muxer.start();
        const n = this._tracks.map((s) => s.source._start());
        await Promise.all(n);
      } finally {
        i();
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
      return console.warn("Output has already been canceled."), this._cancelPromise;
    if (this.state === "finalizing" || this.state === "finalized") {
      this.state === "finalized" && console.warn("Output has already been finalized.");
      return;
    }
    return this._cancelPromise = (async () => {
      this.state = "canceled";
      const e = await this._mutex.acquire();
      try {
        const t = this._tracks.map((i) => i.source._flushOrWaitForOngoingClose(!0));
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
    return this._finalizePromise ? (console.warn("Output has already been finalized."), this._finalizePromise) : this._finalizePromise = (async () => {
      this.state = "finalizing";
      const e = await this._mutex.acquire();
      try {
        const t = this._tracks.map((i) => i.source._flushOrWaitForOngoingClose(!1));
        if (await Promise.all(t), await this._muxer.finalize(), this._rootWriterPromise) {
          const i = await this._rootWriterPromise;
          i.finalized || (await i.flush(), await i.finalize());
        }
        this._onFinalize && await this._onFinalize(), this.state = "finalized";
      } finally {
        e();
      }
    })();
  }
}
const Dr = (r) => {
  if (!r || typeof r != "object")
    throw new TypeError("options.video, when provided, must be an object.");
  if (r?.discard !== void 0 && typeof r.discard != "boolean")
    throw new TypeError("options.video.discard, when provided, must be a boolean.");
  if (r?.forceTranscode !== void 0 && typeof r.forceTranscode != "boolean")
    throw new TypeError("options.video.forceTranscode, when provided, must be a boolean.");
  if (r?.codec !== void 0 && !Ae.includes(r.codec))
    throw new TypeError(`options.video.codec, when provided, must be one of: ${Ae.join(", ")}.`);
  if (r?.bitrate !== void 0 && !(r.bitrate instanceof Me) && (!Number.isInteger(r.bitrate) || r.bitrate <= 0))
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
  if (r?.crop !== void 0 && mi(r.crop, "options.video."), r?.frameRate !== void 0 && (!Number.isFinite(r.frameRate) || r.frameRate <= 0))
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
  if (r?.group !== void 0 && !(r.group instanceof Re || Array.isArray(r.group) && r.group.every((e) => e instanceof Re)))
    throw new TypeError("options.video.group, when provided, must be an OutputTrackGroup or an array of OutputTrackGroups.");
}, Or = (r) => {
  if (!r || typeof r != "object")
    throw new TypeError("options.audio, when provided, must be an object.");
  if (r?.discard !== void 0 && typeof r.discard != "boolean")
    throw new TypeError("options.audio.discard, when provided, must be a boolean.");
  if (r?.forceTranscode !== void 0 && typeof r.forceTranscode != "boolean")
    throw new TypeError("options.audio.forceTranscode, when provided, must be a boolean.");
  if (r?.codec !== void 0 && !Se.includes(r.codec))
    throw new TypeError(`options.audio.codec, when provided, must be one of: ${Se.join(", ")}.`);
  if (r?.bitrate !== void 0 && !(r.bitrate instanceof Me) && (!Number.isInteger(r.bitrate) || r.bitrate <= 0))
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
  if (r?.group !== void 0 && !(r.group instanceof Re || Array.isArray(r.group) && r.group.every((e) => e instanceof Re)))
    throw new TypeError("options.audio.group, when provided, must be an OutputTrackGroup or an array of OutputTrackGroups.");
}, Wi = 2, Li = 48e3;
class Wn {
  /** Initializes a new conversion process without starting the conversion. */
  static async init(e) {
    const t = new Wn(e);
    return await t._init(), t;
  }
  /** Creates a new Conversion instance (duh). */
  constructor(e) {
    if (this._addedCounts = {
      video: 0,
      audio: 0,
      subtitle: 0
    }, this._totalTrackCount = 0, this._nextOutputTrackId = 0, this._outputTrackIds = [], this._outputOwnTrackGroups = [], this._trackPromises = [], this._executed = !1, this._synchronizer = new Qd(), this._totalDuration = null, this._maxTimestamps = /* @__PURE__ */ new Map(), this._canceled = !1, this.onProgress = void 0, this._computeProgress = !1, this._lastProgress = 0, this.isValid = !1, this.utilizedTracks = [], this.discardedTracks = [], !e || typeof e != "object")
      throw new TypeError("options must be an object.");
    if (!(e.input instanceof tr))
      throw new TypeError("options.input must be an Input.");
    if (!(e.output instanceof dn))
      throw new TypeError("options.output must be an Output.");
    if (e.tracks !== void 0 && e.tracks !== "all" && e.tracks !== "primary")
      throw new TypeError("options.tracks, when provided, must be either 'all' or 'primary'.");
    if (e.output._tracks.length > 0 || Object.keys(e.output._metadataTags).length > 0 || e.output.state !== "pending")
      throw new TypeError("options.output must be fresh: no tracks or metadata tags added and not started.");
    if (e.video !== void 0 && typeof e.video != "function")
      if (Array.isArray(e.video))
        for (const n of e.video)
          Dr(n);
      else
        Dr(e.video);
    if (e.audio !== void 0 && typeof e.audio != "function")
      if (Array.isArray(e.audio))
        for (const n of e.audio)
          Or(n);
      else
        Or(e.audio);
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
    if (typeof e.tags == "object" && ji(e.tags), e.showWarnings !== void 0 && typeof e.showWarnings != "boolean")
      throw new TypeError("options.showWarnings, when provided, must be a boolean.");
    this._options = e, this.input = e.input, this.output = e.output;
    const { promise: t, resolve: i } = ce();
    this._started = t, this._start = i;
  }
  /** @internal */
  async _init() {
    const e = await this.input.getFormat();
    let t, i = this._options.tracks;
    if (i === void 0 && (i = e.name.includes("(HLS)") ? "primary" : "all"), i === "all")
      t = await this.input.getTracks();
    else if (i === "primary") {
      const h = await this.input.getPrimaryVideoTrack(), p = await this.input.getPrimaryAudioTrack();
      t = [h, p].filter((m) => m !== null);
    } else
      rt(i), g(!1);
    const n = this.output.format.getSupportedTrackCounts();
    let s = 1, a = 1;
    const o = [], c = [];
    for (const h of t) {
      let p;
      if (h.isVideoTrack())
        if (this._options.video)
          if (typeof this._options.video == "function") {
            const k = await this._options.video(h, s) ?? {};
            if (Array.isArray(k))
              for (const y of k)
                Dr(y);
            else
              Dr(k);
            p = Array.isArray(k) ? k : [k], s++;
          } else
            p = Array.isArray(this._options.video) ? this._options.video : [this._options.video];
        else
          p = [{}];
      else if (h.isAudioTrack())
        if (this._options.audio)
          if (typeof this._options.audio == "function") {
            const k = await this._options.audio(h, a) ?? {};
            if (Array.isArray(k))
              for (const y of k)
                Or(y);
            else
              Or(k);
            p = Array.isArray(k) ? k : [k], a++;
          } else
            p = Array.isArray(this._options.audio) ? this._options.audio : [this._options.audio];
        else
          p = [{}];
      else
        g(!1);
      const m = p.filter((k) => k.discard);
      for (const k of m)
        this.discardedTracks.push({
          track: h,
          reason: "discarded_by_user",
          trackOptions: k
        });
      if (p.length === m.length) {
        p.length === 0 && this.discardedTracks.push({
          track: h,
          reason: "discarded_by_user",
          trackOptions: {}
        });
        continue;
      }
      const b = p.filter((k) => !k.discard);
      o.push(h), c.push(b);
    }
    this._options.trim?.start !== void 0 ? this._startTimestamp = this._options.trim.start : this._startTimestamp = Math.max(
      await this.input.getFirstTimestamp(o),
      // Samples can also have negative timestamps, but the meaning typically is "don't present me", so let's
      // cut those out by default.
      0
    ), this._endTimestamp = Math.max(this._options.trim?.end ?? 1 / 0, this._startTimestamp);
    for (let h = 0; h < o.length; h++) {
      const p = o[h], m = c[h];
      for (const b of m) {
        if (this._totalTrackCount === n.total.max) {
          this.discardedTracks.push({
            track: p,
            reason: "max_track_count_reached",
            trackOptions: b
          });
          continue;
        }
        if (this._addedCounts[p.type] === n[p.type].max) {
          this.discardedTracks.push({
            track: p,
            reason: "max_track_count_of_type_reached",
            trackOptions: b
          });
          continue;
        }
        const k = this._nextOutputTrackId++;
        p.isVideoTrack() ? await this._processVideoTrack(p, b, k) : p.isAudioTrack() ? await this._processAudioTrack(p, b, k) : g(!1);
      }
    }
    for (let h = 0; h < this.utilizedTracks.length - 1; h++)
      for (let p = h + 1; p < this.utilizedTracks.length; p++) {
        const m = this.utilizedTracks[h], b = this.utilizedTracks[p], k = this._outputOwnTrackGroups[h], y = this._outputOwnTrackGroups[p];
        g(k !== void 0), g(y !== void 0), k && y && m.canBePairedWith(b) && k.pairWith(y);
      }
    const l = await this.input.getMetadataTags();
    let d;
    if (this._options.tags) {
      const h = typeof this._options.tags == "function" ? await this._options.tags(l) : this._options.tags;
      ji(h), d = h;
    } else
      d = l;
    const u = e.mimeType === this.output.format.mimeType, f = l.raw === d.raw;
    if (l.raw && f && !u && delete d.raw, this.output.setMetadataTags(d), this.isValid = this._totalTrackCount >= n.total.min && this._addedCounts.video >= n.video.min && this._addedCounts.audio >= n.audio.min && this._addedCounts.subtitle >= n.subtitle.min, this._options.showWarnings ?? !0) {
      const h = [], p = this.discardedTracks.filter((m) => m.reason !== "discarded_by_user");
      p.length > 0 && h.push("Some tracks had to be discarded from the conversion:", p), this.isValid || (h.length > 0 && h.push(`

`), h.push(this._getInvalidityExplanation().join(""))), h.length > 0 && console.warn(...h);
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
        const i = this.discardedTracks.flatMap((s) => s.reason === "discarded_by_user" ? [] : s.track.type === "video" ? this.output.format.getSupportedVideoCodecs() : s.track.type === "audio" ? this.output.format.getSupportedAudioCodecs() : this.output.format.getSupportedSubtitleCodecs()), n = [...new Set(i)];
        n.length === 1 ? e.push(`
Tracks were discarded because your environment is not able to encode '${n[0]}'.`) : e.push(`
Tracks were discarded because your environment is not able to encode any of the following codecs: ${n.map((s) => `'${s}'`).join(", ")}.`), n.includes("mp3") && e.push(`
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
      const t = [...new Set(this.utilizedTracks)].map(async (n) => await n.isLive() ? 1 / 0 : await n.getDurationFromMetadata() ?? await n.computeDuration()), i = Math.max(0, ...await Promise.all(t));
      this._computeProgress = !0, this._totalDuration = Math.min(i - this._startTimestamp, this._endTimestamp - this._startTimestamp);
      for (const n of this._outputTrackIds)
        this._maxTimestamps.set(n, 0);
      this.onProgress?.(0, 0);
    }
    await this.output.start(), this._start();
    try {
      await Promise.all(this._trackPromises);
    } catch (e) {
      throw this._canceled || this.cancel(), e;
    }
    if (this._canceled)
      throw new jd();
    if (await this.output.finalize(), this._computeProgress) {
      const e = Math.min(...this._maxTimestamps.values());
      this.onProgress?.(1, e);
    }
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
    const a = ii(await e.getRotation() + (t.rotate ?? 0));
    let o = a;
    const c = this.output.format.supportsVideoRotationMetadata && (t.allowRotationMetadata ?? !0), l = await e.getSquarePixelWidth(), d = await e.getSquarePixelHeight(), [u, f] = a % 180 === 0 ? [l, d] : [d, l];
    let h = t.crop;
    h && (h = hi(h, u, f));
    const [p, m] = h ? [h.width, h.height] : [u, f];
    let b = p, k = m;
    const y = b / k;
    t.width !== void 0 && t.height === void 0 ? (b = ut(t.width), k = ut(Math.round(b / y))) : t.width === void 0 && t.height !== void 0 ? (k = ut(t.height), b = ut(Math.round(k * y))) : t.width !== void 0 && t.height !== void 0 && (b = ut(t.width), k = ut(t.height));
    const w = await e.getFirstTimestamp();
    let T = this.output.format.getSupportedVideoCodecs();
    const A = !!t.forceTranscode || w < this._startTimestamp || !!t.frameRate || t.keyFrameInterval !== void 0 || t.process !== void 0 || t.bitrate !== void 0 || !T.includes(n) || t.codec && t.codec !== n || b !== p || k !== m || a !== 0 && !c || !!h, x = t.alpha ?? "discard";
    if (A) {
      if (!await e.canDecode()) {
        this.discardedTracks.push({
          track: e,
          reason: "undecodable_source_codec",
          trackOptions: t
        });
        return;
      }
      t.codec && (T = T.filter((U) => U === t.codec));
      const E = t.bitrate ?? nn, D = await Zl(T, {
        width: t.process && t.processedWidth ? t.processedWidth : b,
        height: t.process && t.processedHeight ? t.processedHeight : k,
        bitrate: E
      });
      if (!D) {
        this.discardedTracks.push({
          track: e,
          reason: "no_encodable_target_codec",
          trackOptions: t
        });
        return;
      }
      const B = {
        codec: D,
        bitrate: E,
        keyFrameInterval: t.keyFrameInterval,
        sizeChangeBehavior: t.fit ?? "passThrough",
        alpha: x,
        hardwareAcceleration: t.hardwareAcceleration
      }, O = new Ks(B);
      s = O;
      let W = b !== p || k !== m || a !== 0 && (!c || t.process !== void 0) || !!h || l !== await e.getCodedWidth() || d !== await e.getCodedHeight();
      if (!W) {
        const U = new dn({
          format: new Un(),
          // Supports all video codecs
          target: new Bd()
        }), M = new Ks(B);
        U.addVideoTrack(M), await U.start();
        const X = await new an(e).getSample(w);
        if (X)
          try {
            await M.add(X), X.close(), await U.finalize();
          } catch (ie) {
            console.info("Error when probing encoder support. Falling back to rerender path.", ie), W = !0, U.cancel();
          }
        else
          await U.cancel();
      }
      W ? (o = 0, this._trackPromises.push((async () => {
        await this._started;
        const M = new ou(e, {
          width: b,
          height: k,
          fit: t.fit ?? "fill",
          rotation: a,
          // Bake the rotation into the output
          crop: t.crop,
          poolSize: 1,
          alpha: x === "keep"
        }).canvases(this._startTimestamp, this._endTimestamp), L = t.frameRate;
        let X = null, ie = null, Ke = null;
        const he = async (ke) => {
          g(X), g(L !== void 0);
          const Pe = Math.round((ke - ie) * L);
          for (let Rt = 1; Rt < Pe; Rt++) {
            const ot = new ae(X, {
              timestamp: ie + Rt / L,
              duration: 1 / L
            });
            await this._registerVideoSample(t, i, O, ot), ot.close();
          }
        };
        for await (const { canvas: ke, timestamp: Pe, duration: Rt } of M) {
          if (this._canceled)
            return;
          let ot = Math.max(Pe - this._startTimestamp, 0);
          if (Ke = ot + Rt, L !== void 0) {
            const Fr = Lt(ot, L);
            if (X !== null)
              if (Fr <= ie) {
                X = ke, ie = Fr;
                continue;
              } else
                await he(Fr);
            ot = Fr;
          }
          const Ln = new ae(ke, {
            timestamp: ot,
            duration: L !== void 0 ? 1 / L : Rt
          });
          await this._registerVideoSample(t, i, O, Ln), Ln.close(), L !== void 0 && (X = ke, ie = ot);
        }
        X && (g(Ke !== null), g(L !== void 0), await he(Lt(Ke, L))), O.close(), this._synchronizer.closeTrack(i);
      })())) : this._trackPromises.push((async () => {
        await this._started;
        const U = new an(e), M = t.frameRate;
        let L = null, X = null, ie = null;
        const Ke = async (he) => {
          g(L), g(M !== void 0);
          const ke = Math.round((he - X) * M);
          for (let Pe = 1; Pe < ke; Pe++)
            L.setTimestamp(X + Pe / M), L.setDuration(1 / M), await this._registerVideoSample(t, i, O, L);
          L.close();
        };
        for await (const he of U.samples(this._startTimestamp, this._endTimestamp)) {
          if (this._canceled) {
            he.close(), L?.close();
            return;
          }
          let ke = Math.max(he.timestamp - this._startTimestamp, 0);
          if (ie = ke + he.duration, M !== void 0) {
            const Pe = Lt(ke, M);
            if (L !== null)
              if (Pe <= X) {
                L.close(), L = he, X = Pe;
                continue;
              } else
                await Ke(Pe);
            ke = Pe, he.setDuration(1 / M);
          }
          he.setTimestamp(ke), await this._registerVideoSample(t, i, O, he), M !== void 0 ? (L = he, X = ke) : he.close();
        }
        L && (g(ie !== null), g(M !== void 0), await Ke(Lt(ie, M))), O.close(), this._synchronizer.closeTrack(i);
      })());
    } else {
      const S = new Dd(n);
      s = S, this._trackPromises.push((async () => {
        await this._started;
        const E = new Pr(e), B = { decoderConfig: await e.getDecoderConfig() ?? void 0 };
        for await (const O of E.packets(void 0, void 0, { verifyKeyPackets: !0 })) {
          if (this._canceled)
            return;
          if (O.timestamp >= this._endTimestamp)
            break;
          const W = O.clone({
            timestamp: O.timestamp - this._startTimestamp,
            sideData: x === "discard" ? {} : O.sideData
          });
          g(W.timestamp >= 0), this._reportProgress(i, W.timestamp + W.duration), await S.add(W, B), this._synchronizer.shouldWait(i, W.timestamp) && await this._synchronizer.wait(W.timestamp);
        }
        S.close(), this._synchronizer.closeTrack(i);
      })());
    }
    let I = null;
    t.group || (I = new Re());
    const P = await e.getLanguageCode();
    this.output.addVideoTrack(s, {
      frameRate: t.frameRate,
      // TODO: This condition can be removed when all demuxers properly homogenize to BCP47 in v2
      languageCode: Tr(P) ? P : void 0,
      name: await e.getName() ?? void 0,
      disposition: await e.getDisposition(),
      rotation: o,
      group: I ?? t.group
    }), this._addedCounts.video++, this._totalTrackCount++, this.utilizedTracks.push(e), this._outputTrackIds.push(i), this._outputOwnTrackGroups.push(I);
  }
  /** @internal */
  async _registerVideoSample(e, t, i, n) {
    if (this._canceled)
      return;
    this._reportProgress(t, n.timestamp + n.duration);
    let s;
    if (!e.process)
      s = [n];
    else {
      let a = e.process(n);
      a instanceof Promise && (a = await a), Array.isArray(a) || (a = a === null ? [] : [a]), s = a.map((o) => o instanceof ae ? o : typeof VideoFrame < "u" && o instanceof VideoFrame ? new ae(o) : new ae(o, {
        timestamp: n.timestamp,
        duration: n.duration
      }));
    }
    try {
      for (const a of s) {
        if (this._canceled)
          break;
        await i.add(a), this._synchronizer.shouldWait(t, a.timestamp) && await this._synchronizer.wait(a.timestamp);
      }
    } finally {
      for (const a of s)
        a !== n && a.close();
    }
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
    let l = t.numberOfChannels ?? a, d = t.sampleRate ?? o, u = l !== a || d !== o || c < this._startTimestamp || c > this._startTimestamp && !this.output.format.supportsTimestampedMediaData, f = this.output.format.getSupportedAudioCodecs();
    if (!t.forceTranscode && !t.bitrate && !u && f.includes(n) && (!t.codec || t.codec === n) && !t.process && t.sampleFormat === void 0) {
      const m = new Vd(n);
      s = m, this._trackPromises.push((async () => {
        await this._started;
        const b = new Pr(e), y = { decoderConfig: await e.getDecoderConfig() ?? void 0 };
        for await (const w of b.packets()) {
          if (this._canceled)
            return;
          if (w.timestamp >= this._endTimestamp)
            break;
          const T = w.clone({
            timestamp: w.timestamp - this._startTimestamp
          });
          g(T.timestamp >= 0), this._reportProgress(i, T.timestamp + T.duration), await m.add(T, y), this._synchronizer.shouldWait(i, T.timestamp) && await this._synchronizer.wait(T.timestamp);
        }
        m.close(), this._synchronizer.closeTrack(i);
      })());
    } else {
      if (!await e.canDecode()) {
        this.discardedTracks.push({
          track: e,
          reason: "undecodable_source_codec",
          trackOptions: t
        });
        return;
      }
      let b = null;
      t.codec && (f = f.filter((w) => w === t.codec));
      const k = t.bitrate ?? nn, y = await Rs(f, {
        numberOfChannels: t.process && t.processedNumberOfChannels ? t.processedNumberOfChannels : l,
        sampleRate: t.process && t.processedSampleRate ? t.processedSampleRate : d,
        bitrate: k
      });
      if (!y.some((w) => $t.includes(w)) && f.some((w) => $t.includes(w)) && (l !== Wi || d !== Li)) {
        const T = (await Rs(f, {
          numberOfChannels: Wi,
          sampleRate: Li,
          bitrate: k
        })).find((A) => $t.includes(A));
        T && (u = !0, b = T, l = Wi, d = Li);
      } else
        b = y[0] ?? null;
      if (b === null) {
        this.discardedTracks.push({
          track: e,
          reason: "no_encodable_target_codec",
          trackOptions: t
        });
        return;
      }
      if (u)
        s = this._resampleAudio(e, t, i, b, l, d, k);
      else {
        const w = new js({
          codec: b,
          bitrate: k
        });
        s = w, this._trackPromises.push((async () => {
          await this._started;
          const T = new zs(e);
          for await (const A of T.samples(void 0, this._endTimestamp)) {
            if (this._canceled) {
              A.close();
              return;
            }
            A.setTimestamp(A.timestamp - this._startTimestamp), await this._registerAudioSample(t, i, w, A), A.close();
          }
          w.close(), this._synchronizer.closeTrack(i);
        })());
      }
    }
    let h = null;
    t.group || (h = new Re());
    const p = await e.getLanguageCode();
    this.output.addAudioTrack(s, {
      // TODO: This condition can be removed when all demuxers properly homogenize to BCP47 in v2
      languageCode: Tr(p) ? p : void 0,
      name: await e.getName() ?? void 0,
      disposition: await e.getDisposition(),
      group: h ?? t.group
    }), this._addedCounts.audio++, this._totalTrackCount++, this.utilizedTracks.push(e), this._outputTrackIds.push(i), this._outputOwnTrackGroups.push(h);
  }
  /** @internal */
  async _registerAudioSample(e, t, i, n) {
    if (this._canceled)
      return;
    let s = n;
    e.sampleFormat !== void 0 && Za(s.format) !== e.sampleFormat && (s = Ja(s, e.sampleFormat)), this._reportProgress(t, s.timestamp + s.duration);
    let a;
    if (!e.process)
      a = [s];
    else {
      let o = e.process(s);
      if (o instanceof Promise && (o = await o), Array.isArray(o) || (o = o === null ? [] : [o]), !o.every((c) => c instanceof me))
        throw new TypeError("The audio process function must return an AudioSample, null, or an array of AudioSamples.");
      a = o;
    }
    try {
      for (const o of a) {
        if (this._canceled)
          break;
        await i.add(o), this._synchronizer.shouldWait(t, o.timestamp) && await this._synchronizer.wait(o.timestamp);
      }
    } finally {
      s !== n && s.close();
      for (const o of a)
        o !== n && o.close();
    }
  }
  /** @internal */
  _resampleAudio(e, t, i, n, s, a, o) {
    const c = new js({
      codec: n,
      bitrate: o
    });
    return this._trackPromises.push((async () => {
      await this._started;
      const l = new bo({
        targetNumberOfChannels: s,
        targetSampleRate: a,
        startTime: this._startTimestamp,
        endTime: this._endTimestamp,
        onSample: async (f) => {
          g(f.timestamp >= this._startTimestamp), f.setTimestamp(f.timestamp - this._startTimestamp), await this._registerAudioSample(t, i, c, f), f.close();
        }
      }), u = new zs(e).samples(this._startTimestamp, this._endTimestamp);
      for await (const f of u) {
        if (this._canceled) {
          f.close();
          return;
        }
        await l.add(f), f.close();
      }
      await l.finalize(), c.close(), this._synchronizer.closeTrack(i);
    })()), c;
  }
  /** @internal */
  _reportProgress(e, t) {
    if (!this._computeProgress)
      return;
    g(this._totalDuration !== null), this._maxTimestamps.set(e, Math.max(t, this._maxTimestamps.get(e)));
    const i = Math.min(...this._maxTimestamps.values()), n = se(i / this._totalDuration, 0, 1);
    n !== this._lastProgress && (this._lastProgress = n, this.onProgress?.(n, i));
  }
}
class jd extends Error {
  /** Creates a new {@link ConversionCanceledError}. */
  constructor(e = "Conversion has been canceled.") {
    super(e), this.name = "ConversionCanceledError";
  }
}
const Gs = 5;
class Qd {
  constructor() {
    this.maxTimestamps = /* @__PURE__ */ new Map(), this.resolvers = [];
  }
  computeMinAndMaybeResolve() {
    let e = 1 / 0;
    for (const [, t] of this.maxTimestamps)
      e = Math.min(e, t);
    for (let t = 0; t < this.resolvers.length; t++) {
      const i = this.resolvers[t];
      i.timestamp - e < Gs && (i.resolve(), this.resolvers.splice(t, 1), t--);
    }
    return e;
  }
  shouldWait(e, t) {
    this.maxTimestamps.set(e, Math.max(t, this.maxTimestamps.get(e) ?? -1 / 0));
    const i = this.computeMinAndMaybeResolve();
    return t - i >= Gs;
  }
  wait(e) {
    const { promise: t, resolve: i } = ce();
    return this.resolvers.push({
      timestamp: e,
      resolve: i
    }), t;
  }
  closeTrack(e) {
    this.maxTimestamps.delete(e), this.computeMinAndMaybeResolve();
  }
}
let Hi = null;
function qi(...r) {
}
function Xs(...r) {
}
function Nr(r) {
  return Math.ceil(r / 2) * 2;
}
function Gd(r) {
  switch (r) {
    case "high":
      return nn;
    case "medium":
      return Yl;
    case "low":
      return $l;
  }
}
function Xd(r, e) {
  if (r.size >= e.size)
    return { file: e, wasCompressed: !1 };
  const t = e.name.replace(/\.[^.]+$/, "");
  return { file: new File([r], `${t}_compressed.mp4`, { type: "video/mp4" }), wasCompressed: !0 };
}
async function $d() {
  Hi || (Hi = import("./mediabunny-aac-encoder-DTBTjJKy.js").then(({ registerAacEncoder: r }) => {
    r();
  })), await Hi;
}
class Yd {
  constructor(e = Ao) {
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
    return await e.canDecode() ? no("avc", { ...t, quality: i }) : !1;
  }
  async buildAudioOptions(e, t, i) {
    if (!e.codec || !await Hl(e.codec))
      return qi("Audio decode is unavailable; preserving packets without transcoding.", { codec: e.codec }), {};
    const n = {
      numberOfChannels: t.audioChannels ?? e.numberOfChannels,
      sampleRate: t.audioSampleRate ?? e.sampleRate,
      bitrate: i
    };
    return await sn("aac", n) || await $d(), await sn("aac", n) ? { codec: "aac", forceTranscode: !0, ...n } : (qi("AAC encoding is unavailable; preserving packets without transcoding.", { codec: e.codec }), {});
  }
  async buildVideoOptions(e, t, i) {
    const n = await e.getDisplayWidth(), s = await e.getDisplayHeight(), a = {
      codec: "avc",
      forceTranscode: !0,
      quality: i
    };
    n > s ? a.width = Math.min(n, t.maxSize) : a.height = Math.min(s, t.maxSize);
    let o = n, c = s;
    return a.width !== void 0 ? (o = Nr(a.width), c = Nr(Math.round(o / (n / s)))) : a.height !== void 0 && (c = Nr(a.height), o = Nr(Math.round(c * (n / s)))), { options: a, dimensions: { width: o, height: c } };
  }
  async outputPreservesAudio(e, t) {
    const i = new tr({ source: new As(e), formats: Es });
    try {
      return (await i.getAudioTracks()).length >= t;
    } finally {
      i.dispose();
    }
  }
  async compress(e, t) {
    let i = null;
    try {
      this.abortRequested = !1, this.abortController = new AbortController(), i = new tr({ source: new As(e), formats: Es });
      const n = await i.getVideoTracks(), s = await i.getAudioTracks(), a = Gd(t.qualityPreset), o = n.length > 0 ? await this.buildVideoOptions(n[0], t, a) : null;
      if (!o || !await this.canTranscodeVideo(n[0], o.dimensions, a))
        return qi("Required video decode or AVC encode capability is unavailable; skipping compression."), { file: e, wasCompressed: !1, wasSkipped: !0 };
      const c = new Lr(), l = new dn({ target: c, format: new Un({ fastStart: "in-memory" }) }), d = await Wn.init({
        input: i,
        output: l,
        video: async (h) => h === n[0] ? o.options : (await this.buildVideoOptions(h, t, a)).options,
        audio: (h) => this.buildAudioOptions(h, t, a),
        showWarnings: !1
      });
      if (!d.isValid || d.discardedTracks.some(({ track: h }) => h.isVideoTrack() || h.isAudioTrack()))
        return Xs("MediaBunny cannot preserve all required tracks; skipping compression.", d.discardedTracks), { file: e, wasCompressed: !1, wasSkipped: !0 };
      d.onProgress = (h) => this.updateProgress(h * 100), this.abortController.signal.addEventListener("abort", () => void d.cancel(), { once: !0 }), await d.execute();
      const u = this.abortRequested ? (this.resetProgress(), { file: e, wasCompressed: !1, wasSkipped: !0, aborted: !0 }) : this.getAbortedResult(e);
      if (u) return u;
      if (!c.buffer) throw new Error("MediaBunny did not produce an output buffer.");
      const f = Xd(new Blob([c.buffer], { type: "video/mp4" }), e);
      return f.wasCompressed ? s.length > 0 && !await this.outputPreservesAudio(f.file, s.length) ? (Xs("MediaBunny output lost input audio; keeping the original file."), { file: e, wasCompressed: !1, wasSkipped: !0 }) : (this.updateProgress(100), f) : f;
    } catch {
      const s = this.abortRequested ? (this.resetProgress(), { file: e, wasCompressed: !1, wasSkipped: !0, aborted: !0 }) : this.getAbortedResult(e);
      return s || { file: e, wasCompressed: !1, wasSkipped: !0 };
    } finally {
      i?.dispose(), this.abortController = null;
    }
  }
}
const ef = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  MediaBunnyCompression: Yd
}, Symbol.toStringTag, { value: "Module" }));
export {
  eu as C,
  Y as E,
  ef as m,
  Jd as r
};
