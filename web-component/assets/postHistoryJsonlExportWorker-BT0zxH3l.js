var qu = Object.defineProperty, $u = (e, t, r) => t in e ? qu(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, Ae = (e, t, r) => $u(e, typeof t != "symbol" ? t + "" : t, r);
function Ku(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in e && e.BYTES_PER_ELEMENT === 1;
}
function aa(e, t = "") {
  if (typeof e != "number") {
    const r = t && `"${t}" `;
    throw new TypeError(`${r}expected number, got ${typeof e}`);
  }
  if (!Number.isSafeInteger(e) || e < 0) {
    const r = t && `"${t}" `;
    throw new RangeError(`${r}expected integer >= 0, got ${e}`);
  }
}
function Hn(e, t, r = "") {
  const o = Ku(e), s = e?.length;
  if (!o || t !== void 0) {
    const f = r && `"${r}" `, p = "", h = o ? `length=${s}` : `type=${typeof e}`, m = f + "expected Uint8Array" + p + ", got " + h;
    throw o ? new RangeError(m) : new TypeError(m);
  }
  return e;
}
function Bs(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function Uu(e, t) {
  Hn(e, void 0, "digestInto() output");
  const r = t.outputLen;
  if (e.length < r)
    throw new RangeError('"digestInto() output" expected to be of length >=' + r);
}
function Wo(...e) {
  for (let t = 0; t < e.length; t++)
    e[t].fill(0);
}
function Po(e) {
  return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function lt(e, t) {
  return e << 32 - t | e >>> t;
}
const ca = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", Mu = /* @__PURE__ */ Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function si(e) {
  if (Hn(e), ca)
    return e.toHex();
  let t = "";
  for (let r = 0; r < e.length; r++)
    t += Mu[e[r]];
  return t;
}
const wt = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Os(e) {
  if (e >= wt._0 && e <= wt._9)
    return e - wt._0;
  if (e >= wt.A && e <= wt.F)
    return e - (wt.A - 10);
  if (e >= wt.a && e <= wt.f)
    return e - (wt.a - 10);
}
function ju(e) {
  if (typeof e != "string")
    throw new TypeError("hex string expected, got " + typeof e);
  if (ca)
    try {
      return Uint8Array.fromHex(e);
    } catch (s) {
      throw s instanceof SyntaxError ? new RangeError(s.message) : s;
    }
  const t = e.length, r = t / 2;
  if (t % 2)
    throw new RangeError("hex string expected, got unpadded hex of length " + t);
  const o = new Uint8Array(r);
  for (let s = 0, u = 0; s < r; s++, u += 2) {
    const f = Os(e.charCodeAt(u)), p = Os(e.charCodeAt(u + 1));
    if (f === void 0 || p === void 0) {
      const h = e[u] + e[u + 1];
      throw new RangeError('hex string expected, got non-hex character "' + h + '" at index ' + u);
    }
    o[s] = f * 16 + p;
  }
  return o;
}
function Fu(e, t = {}) {
  const r = (s, u) => e(u).update(s).digest(), o = e(void 0);
  return r.outputLen = o.outputLen, r.blockLen = o.blockLen, r.canXOF = o.canXOF, r.create = (s) => e(s), Object.assign(r, t), Object.freeze(r);
}
const Hu = (e) => ({
  // Current NIST hashAlgs suffixes used here fit in one DER subidentifier octet.
  // Larger suffix values would need base-128 OID encoding and a different length byte.
  oid: Uint8Array.from([6, 9, 96, 134, 72, 1, 101, 3, 4, 2, e])
});
function Vu(e, t, r) {
  return e & t ^ ~e & r;
}
function zu(e, t, r) {
  return e & t ^ e & r ^ t & r;
}
let Zu = class {
  constructor(t, r, o, s) {
    Ae(this, "blockLen"), Ae(this, "outputLen"), Ae(this, "canXOF", !1), Ae(this, "padOffset"), Ae(this, "isLE"), Ae(this, "buffer"), Ae(this, "view"), Ae(this, "finished", !1), Ae(this, "length", 0), Ae(this, "pos", 0), Ae(this, "destroyed", !1), this.blockLen = t, this.outputLen = r, this.padOffset = o, this.isLE = s, this.buffer = new Uint8Array(t), this.view = Po(this.buffer);
  }
  update(t) {
    Bs(this), Hn(t);
    const { view: r, buffer: o, blockLen: s } = this, u = t.length;
    for (let f = 0; f < u; ) {
      const p = Math.min(s - this.pos, u - f);
      if (p === s) {
        const h = Po(t);
        for (; s <= u - f; f += s)
          this.process(h, f);
        continue;
      }
      o.set(t.subarray(f, f + p), this.pos), this.pos += p, f += p, this.pos === s && (this.process(r, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Bs(this), Uu(t, this), this.finished = !0;
    const { buffer: r, view: o, blockLen: s, isLE: u } = this;
    let { pos: f } = this;
    r[f++] = 128, Wo(this.buffer.subarray(f)), this.padOffset > s - f && (this.process(o, 0), f = 0);
    for (let w = f; w < s; w++)
      r[w] = 0;
    o.setBigUint64(s - 8, BigInt(this.length * 8), u), this.process(o, 0);
    const p = Po(t), h = this.outputLen;
    if (h % 4)
      throw new Error("_sha2: outputLen must be aligned to 32bit");
    const m = h / 4, v = this.get();
    if (m > v.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let w = 0; w < m; w++)
      p.setUint32(4 * w, v[w], u);
  }
  digest() {
    const { buffer: t, outputLen: r } = this;
    this.digestInto(t);
    const o = t.slice(0, r);
    return this.destroy(), o;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: r, buffer: o, length: s, finished: u, destroyed: f, pos: p } = this;
    return t.destroyed = f, t.finished = u, t.length = s, t.pos = p, s % r && t.buffer.set(o), t;
  }
  clone() {
    return this._cloneInto();
  }
};
const Pt = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Gu = /* @__PURE__ */ Uint32Array.from([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]), Nt = /* @__PURE__ */ new Uint32Array(64);
let Wu = class extends Zu {
  constructor(t) {
    super(64, t, 8, !1);
  }
  get() {
    const { A: t, B: r, C: o, D: s, E: u, F: f, G: p, H: h } = this;
    return [t, r, o, s, u, f, p, h];
  }
  // prettier-ignore
  set(t, r, o, s, u, f, p, h) {
    this.A = t | 0, this.B = r | 0, this.C = o | 0, this.D = s | 0, this.E = u | 0, this.F = f | 0, this.G = p | 0, this.H = h | 0;
  }
  process(t, r) {
    for (let w = 0; w < 16; w++, r += 4)
      Nt[w] = t.getUint32(r, !1);
    for (let w = 16; w < 64; w++) {
      const P = Nt[w - 15], T = Nt[w - 2], L = lt(P, 7) ^ lt(P, 18) ^ P >>> 3, D = lt(T, 17) ^ lt(T, 19) ^ T >>> 10;
      Nt[w] = D + Nt[w - 7] + L + Nt[w - 16] | 0;
    }
    let { A: o, B: s, C: u, D: f, E: p, F: h, G: m, H: v } = this;
    for (let w = 0; w < 64; w++) {
      const P = lt(p, 6) ^ lt(p, 11) ^ lt(p, 25), T = v + P + Vu(p, h, m) + Gu[w] + Nt[w] | 0, D = (lt(o, 2) ^ lt(o, 13) ^ lt(o, 22)) + zu(o, s, u) | 0;
      v = m, m = h, h = p, p = f + T | 0, f = u, u = s, s = o, o = T + D | 0;
    }
    o = o + this.A | 0, s = s + this.B | 0, u = u + this.C | 0, f = f + this.D | 0, p = p + this.E | 0, h = h + this.F | 0, m = m + this.G | 0, v = v + this.H | 0, this.set(o, s, u, f, p, h, m, v);
  }
  roundClean() {
    Wo(Nt);
  }
  destroy() {
    this.destroyed = !0, this.set(0, 0, 0, 0, 0, 0, 0, 0), Wo(this.buffer);
  }
}, Yu = class extends Wu {
  constructor() {
    super(32), Ae(this, "A", Pt[0] | 0), Ae(this, "B", Pt[1] | 0), Ae(this, "C", Pt[2] | 0), Ae(this, "D", Pt[3] | 0), Ae(this, "E", Pt[4] | 0), Ae(this, "F", Pt[5] | 0), Ae(this, "G", Pt[6] | 0), Ae(this, "H", Pt[7] | 0);
  }
};
const Xu = /* @__PURE__ */ Fu(
  () => new Yu(),
  /* @__PURE__ */ Hu(1)
);
const Tr = (e, t, r) => Hn(e, t, r), ua = aa, Cr = /* @__PURE__ */ BigInt(0), Ju = /* @__PURE__ */ BigInt(1);
function Qu(e, t = "") {
  if (typeof e != "boolean") {
    const r = t && `"${t}" `;
    throw new TypeError(r + "expected boolean, got type=" + typeof e);
  }
  return e;
}
function ai(e) {
  if (typeof e == "bigint") {
    if (!ol(e))
      throw new RangeError("positive bigint expected, got " + e);
  } else
    ua(e);
  return e;
}
function el(e, t = "") {
  if (typeof e != "number") {
    const r = t && `"${t}" `;
    throw new TypeError(r + "expected number, got type=" + typeof e);
  }
  if (!Number.isSafeInteger(e)) {
    const r = t && `"${t}" `;
    throw new RangeError(r + "expected safe integer, got " + e);
  }
}
function Er(e) {
  const t = ai(e).toString(16);
  return t.length & 1 ? "0" + t : t;
}
function la(e) {
  if (typeof e != "string")
    throw new TypeError("hex string expected, got " + typeof e);
  return e === "" ? Cr : BigInt("0x" + e);
}
function fa(e) {
  return la(si(e));
}
function tl(e) {
  return la(si(rl(Hn(e)).reverse()));
}
function da(e, t) {
  if (aa(t), t === 0)
    throw new RangeError("zero length");
  e = ai(e);
  const r = e.toString(16);
  if (r.length > t * 2)
    throw new RangeError("number too large");
  return ju(r.padStart(t * 2, "0"));
}
function nl(e, t) {
  return da(e, t).reverse();
}
function rl(e) {
  return Uint8Array.from(Tr(e));
}
const ol = (e) => typeof e == "bigint" && Cr <= e;
function il(e) {
  if (e < Cr)
    throw new Error("expected non-negative bigint, got " + e);
  let t;
  for (t = 0; e > Cr; e >>= Ju, t += 1)
    ;
  return t;
}
const Ve = /* @__PURE__ */ BigInt(0), Xe = /* @__PURE__ */ BigInt(1), tn = /* @__PURE__ */ BigInt(2), ha = /* @__PURE__ */ BigInt(3), pa = /* @__PURE__ */ BigInt(4), ya = /* @__PURE__ */ BigInt(5), sl = /* @__PURE__ */ BigInt(7), ga = /* @__PURE__ */ BigInt(8), al = /* @__PURE__ */ BigInt(9), ma = /* @__PURE__ */ BigInt(16);
function dt(e, t) {
  if (t <= Ve)
    throw new Error("mod: expected positive modulus, got " + t);
  const r = e % t;
  return r >= Ve ? r : t + r;
}
function rt(e, t, r) {
  if (t < Ve)
    throw new Error("pow2: expected non-negative exponent, got " + t);
  let o = e;
  for (; t-- > Ve; )
    o *= o, o %= r;
  return o;
}
function Is(e, t) {
  if (e === Ve)
    throw new Error("invert: expected non-zero number");
  if (t <= Ve)
    throw new Error("invert: expected positive modulus, got " + t);
  let r = dt(e, t), o = t, s = Ve, u = Xe;
  for (; r !== Ve; ) {
    const p = o / r, h = o - r * p, m = s - u * p;
    o = r, r = h, s = u, u = m;
  }
  if (o !== Xe)
    throw new Error("invert: does not exist");
  return dt(s, t);
}
function ci(e, t, r) {
  const o = e;
  if (!o.eql(o.sqr(t), r))
    throw new Error("Cannot find square root");
}
function va(e, t) {
  const r = e, o = (r.ORDER + Xe) / pa, s = r.pow(t, o);
  return ci(r, s, t), s;
}
function cl(e, t) {
  const r = e, o = (r.ORDER - ya) / ga, s = r.mul(t, tn), u = r.pow(s, o), f = r.mul(t, u), p = r.mul(r.mul(f, tn), u), h = r.mul(f, r.sub(p, r.ONE));
  return ci(r, h, t), h;
}
function ul(e) {
  const t = ui(e), r = wa(e), o = r(t, t.neg(t.ONE)), s = r(t, o), u = r(t, t.neg(o)), f = (e + sl) / ma;
  return (p, h) => {
    const m = p;
    let v = m.pow(h, f), w = m.mul(v, o);
    const P = m.mul(v, s), T = m.mul(v, u), L = m.eql(m.sqr(w), h), D = m.eql(m.sqr(P), h);
    v = m.cmov(v, w, L), w = m.cmov(T, P, D);
    const F = m.eql(m.sqr(w), h), Z = m.cmov(v, w, F);
    return ci(m, Z, h), Z;
  };
}
function wa(e) {
  if (e < ha)
    throw new Error("sqrt is not defined for small field");
  let t = e - Xe, r = 0;
  for (; t % tn === Ve; )
    t /= tn, r++;
  let o = tn;
  const s = ui(e);
  for (; Ts(s, o) === 1; )
    if (o++ > 1e3)
      throw new Error("Cannot find square root: probably non-prime P");
  if (r === 1)
    return va;
  let u = s.pow(o, t);
  const f = (t + Xe) / tn;
  return function(h, m) {
    const v = h;
    if (v.is0(m))
      return m;
    if (Ts(v, m) !== 1)
      throw new Error("Cannot find square root");
    let w = r, P = v.mul(v.ONE, u), T = v.pow(m, t), L = v.pow(m, f);
    for (; !v.eql(T, v.ONE); ) {
      if (v.is0(T))
        return v.ZERO;
      let D = 1, F = v.sqr(T);
      for (; !v.eql(F, v.ONE); )
        if (D++, F = v.sqr(F), D === w)
          throw new Error("Cannot find square root");
      const Z = Xe << BigInt(w - D - 1), M = v.pow(P, Z);
      w = D, P = v.sqr(M), T = v.mul(T, P), L = v.mul(L, M);
    }
    return L;
  };
}
function ll(e) {
  return e % pa === ha ? va : e % ga === ya ? cl : e % ma === al ? ul(e) : wa(e);
}
function fl(e, t, r) {
  const o = e;
  if (r < Ve)
    throw new Error("invalid exponent, negatives unsupported");
  if (r === Ve)
    return o.ONE;
  if (r === Xe)
    return t;
  let s = o.ONE, u = t;
  for (; r > Ve; )
    r & Xe && (s = o.mul(s, u)), u = o.sqr(u), r >>= Xe;
  return s;
}
function dl(e, t, r = !1) {
  const o = e, s = new Array(t.length).fill(r ? o.ZERO : void 0), u = t.reduce((p, h, m) => o.is0(h) ? p : (s[m] = p, o.mul(p, h)), o.ONE), f = o.inv(u);
  return t.reduceRight((p, h, m) => o.is0(h) ? p : (s[m] = o.mul(p, s[m]), o.mul(p, h)), f), s;
}
function Ts(e, t) {
  const r = e, o = (r.ORDER - Xe) / tn, s = r.pow(t, o), u = r.eql(s, r.ONE), f = r.eql(s, r.ZERO), p = r.eql(s, r.neg(r.ONE));
  if (!u && !f && !p)
    throw new Error("invalid Legendre symbol result");
  return u ? 1 : f ? 0 : -1;
}
function hl(e, t) {
  if (t !== void 0 && ua(t), e <= Ve)
    throw new Error("invalid n length: expected positive n, got " + e);
  if (t !== void 0 && t < 1)
    throw new Error("invalid n length: expected positive bit length, got " + t);
  const r = il(e);
  if (t !== void 0 && t < r)
    throw new Error(`invalid n length: expected bit length (${r}) >= n.length (${t})`);
  const o = t !== void 0 ? t : r, s = Math.ceil(o / 8);
  return { nBitLength: o, nByteLength: s };
}
const Cs = /* @__PURE__ */ new WeakMap();
let ba = class {
  constructor(t, r = {}) {
    if (Ae(this, "ORDER"), Ae(this, "BITS"), Ae(this, "BYTES"), Ae(this, "isLE"), Ae(this, "ZERO", Ve), Ae(this, "ONE", Xe), Ae(this, "_lengths"), Ae(this, "_mod"), t <= Xe)
      throw new Error("invalid field: expected ORDER > 1, got " + t);
    let o;
    this.isLE = !1, r != null && typeof r == "object" && (typeof r.BITS == "number" && (o = r.BITS), typeof r.sqrt == "function" && Object.defineProperty(this, "sqrt", { value: r.sqrt, enumerable: !0 }), typeof r.isLE == "boolean" && (this.isLE = r.isLE), r.allowedLengths && (this._lengths = Object.freeze(r.allowedLengths.slice())), typeof r.modFromBytes == "boolean" && (this._mod = r.modFromBytes));
    const { nBitLength: s, nByteLength: u } = hl(t, o);
    if (u > 2048)
      throw new Error("invalid field: expected ORDER of <= 2048 bytes");
    this.ORDER = t, this.BITS = s, this.BYTES = u, Object.freeze(this);
  }
  create(t) {
    return dt(t, this.ORDER);
  }
  isValid(t) {
    if (typeof t != "bigint")
      throw new TypeError("invalid field element: expected bigint, got " + typeof t);
    return Ve <= t && t < this.ORDER;
  }
  is0(t) {
    return t === Ve;
  }
  // is valid and invertible
  isValidNot0(t) {
    return !this.is0(t) && this.isValid(t);
  }
  isOdd(t) {
    return (t & Xe) === Xe;
  }
  neg(t) {
    return dt(-t, this.ORDER);
  }
  eql(t, r) {
    return t === r;
  }
  sqr(t) {
    return dt(t * t, this.ORDER);
  }
  add(t, r) {
    return dt(t + r, this.ORDER);
  }
  sub(t, r) {
    return dt(t - r, this.ORDER);
  }
  mul(t, r) {
    return dt(t * r, this.ORDER);
  }
  pow(t, r) {
    return fl(this, t, r);
  }
  div(t, r) {
    return dt(t * Is(r, this.ORDER), this.ORDER);
  }
  // Same as above, but doesn't normalize
  sqrN(t) {
    return t * t;
  }
  addN(t, r) {
    return t + r;
  }
  subN(t, r) {
    return t - r;
  }
  mulN(t, r) {
    return t * r;
  }
  inv(t) {
    return Is(t, this.ORDER);
  }
  sqrt(t) {
    let r = Cs.get(this);
    return r || Cs.set(this, r = ll(this.ORDER)), r(this, t);
  }
  toBytes(t) {
    return this.isLE ? nl(t, this.BYTES) : da(t, this.BYTES);
  }
  fromBytes(t, r = !1) {
    Tr(t);
    const { _lengths: o, BYTES: s, isLE: u, ORDER: f, _mod: p } = this;
    if (o) {
      if (t.length < 1 || !o.includes(t.length) || t.length > s)
        throw new Error("Field.fromBytes: expected " + o + " bytes, got " + t.length);
      const m = new Uint8Array(s);
      m.set(t, u ? 0 : m.length - t.length), t = m;
    }
    if (t.length !== s)
      throw new Error("Field.fromBytes: expected " + s + " bytes, got " + t.length);
    let h = u ? tl(t) : fa(t);
    if (p && (h = dt(h, f)), !r && !this.isValid(h))
      throw new Error("invalid field element: outside of range 0..ORDER");
    return h;
  }
  // TODO: we don't need it here, move out to separate fn
  invertBatch(t) {
    return dl(this, t);
  }
  // We can't move this out because Fp6, Fp12 implement it
  // and it's unclear what to return in there.
  cmov(t, r, o) {
    return Qu(o, "condition"), o ? r : t;
  }
};
Object.freeze(ba.prototype);
function ui(e, t = {}) {
  return new ba(e, t);
}
let pl = class extends Error {
  constructor(t = "") {
    super(t);
  }
};
const _t = {
  // asn.1 DER encoding utils
  Err: pl,
  // Basic building block is TLV (Tag-Length-Value)
  _tlv: {
    encode: (e, t) => {
      const { Err: r } = _t;
      if (el(e, "tag"), e < 0 || e > 255)
        throw new r("tlv.encode: wrong tag");
      if (typeof t != "string")
        throw new TypeError('"data" expected string, got type=' + typeof t);
      if (t.length & 1)
        throw new r("tlv.encode: unpadded data");
      const o = t.length / 2, s = Er(o);
      if (s.length / 2 & 128)
        throw new r("tlv.encode: long form length too big");
      const u = o > 127 ? Er(s.length / 2 | 128) : "";
      return Er(e) + u + s + t;
    },
    // v - value, l - left bytes (unparsed)
    decode(e, t) {
      const { Err: r } = _t;
      t = Tr(t, void 0, "DER data");
      let o = 0;
      if (e < 0 || e > 255)
        throw new r("tlv.encode: wrong tag");
      if (t.length < 2 || t[o++] !== e)
        throw new r("tlv.decode: wrong tlv");
      const s = t[o++], u = !!(s & 128);
      let f = 0;
      if (!u)
        f = s;
      else {
        const h = s & 127;
        if (!h)
          throw new r("tlv.decode(long): indefinite length not supported");
        if (h > 4)
          throw new r("tlv.decode(long): byte length is too big");
        const m = t.subarray(o, o + h);
        if (m.length !== h)
          throw new r("tlv.decode: length bytes not complete");
        if (m[0] === 0)
          throw new r("tlv.decode(long): zero leftmost byte");
        for (const v of m)
          f = f << 8 | v;
        if (o += h, f < 128)
          throw new r("tlv.decode(long): not minimal encoding");
      }
      const p = t.subarray(o, o + f);
      if (p.length !== f)
        throw new r("tlv.decode: wrong value length");
      return { v: p, l: t.subarray(o + f) };
    }
  },
  // https://crypto.stackexchange.com/a/57734 Leftmost bit of first byte is 'negative' flag,
  // since we always use positive integers here. It must always be empty:
  // - add zero byte if exists
  // - if next byte doesn't have a flag, leading zero is not allowed (minimal encoding)
  _int: {
    encode(e) {
      const { Err: t } = _t;
      if (ai(e), e < yl)
        throw new t("integer: negative integers are not allowed");
      let r = Er(e);
      if (Number.parseInt(r[0], 16) & 8 && (r = "00" + r), r.length & 1)
        throw new t("unexpected DER parsing assertion: unpadded hex");
      return r;
    },
    decode(e) {
      const { Err: t } = _t;
      if (e.length < 1)
        throw new t("invalid signature integer: empty");
      if (e[0] & 128)
        throw new t("invalid signature integer: negative");
      if (e.length > 1 && e[0] === 0 && !(e[1] & 128))
        throw new t("invalid signature integer: unnecessary leading zero");
      return fa(e);
    }
  },
  toSig(e) {
    const { Err: t, _int: r, _tlv: o } = _t, s = Tr(e, void 0, "signature"), { v: u, l: f } = o.decode(48, s);
    if (f.length)
      throw new t("invalid signature: left bytes after parsing");
    const { v: p, l: h } = o.decode(2, u), { v: m, l: v } = o.decode(2, h);
    if (v.length)
      throw new t("invalid signature: left bytes after parsing");
    return { r: r.decode(p), s: r.decode(m) };
  },
  hexFromSig(e) {
    const { _tlv: t, _int: r } = _t, o = t.encode(2, r.encode(e.r)), s = t.encode(2, r.encode(e.s)), u = o + s;
    return t.encode(48, u);
  }
};
Object.freeze(_t._tlv);
Object.freeze(_t._int);
Object.freeze(_t);
const yl = /* @__PURE__ */ BigInt(0);
const Ea = {
  p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: BigInt(1),
  a: BigInt(0),
  b: BigInt(7),
  Gx: BigInt("0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"),
  Gy: BigInt("0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8")
};
BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"), BigInt("0x3086d221a7d46bcde86c90e49284eb15"), -BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), BigInt("0x3086d221a7d46bcde86c90e49284eb15");
const Ls = /* @__PURE__ */ BigInt(2);
function gl(e) {
  const t = Ea.p, r = BigInt(3), o = BigInt(6), s = BigInt(11), u = BigInt(22), f = BigInt(23), p = BigInt(44), h = BigInt(88), m = e * e * e % t, v = m * m * e % t, w = rt(v, r, t) * v % t, P = rt(w, r, t) * v % t, T = rt(P, Ls, t) * m % t, L = rt(T, s, t) * T % t, D = rt(L, u, t) * L % t, F = rt(D, p, t) * D % t, Z = rt(F, h, t) * F % t, M = rt(Z, p, t) * D % t, fe = rt(M, r, t) * v % t, ae = rt(fe, f, t) * L % t, Ke = rt(ae, o, t) * m % t, de = rt(Ke, Ls, t);
  if (!Ps.eql(Ps.sqr(de), e))
    throw new Error("Cannot find square root");
  return de;
}
const Ps = ui(Ea.p, { sqrt: gl }), ml = new TextEncoder();
function vl(e) {
  return si(Xu(ml.encode(e)));
}
function li(e) {
  const t = JSON.stringify([
    0,
    e.pubkey,
    e.created_at,
    e.kind,
    e.tags,
    e.content
  ]);
  return vl(t);
}
function fi(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function Mt(e, t = "") {
  if (!Number.isSafeInteger(e) || e < 0) {
    const r = t && `"${t}" `;
    throw new Error(`${r}expected integer >= 0, got ${e}`);
  }
}
function ke(e, t, r = "") {
  const o = fi(e), s = e?.length, u = t !== void 0;
  if (!o || u && s !== t) {
    const f = r && `"${r}" `, p = u ? ` of length ${t}` : "", h = o ? `length=${s}` : `type=${typeof e}`;
    throw new Error(f + "expected Uint8Array" + p + ", got " + h);
  }
  return e;
}
function Fr(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash must wrapped by utils.createHasher");
  Mt(e.outputLen), Mt(e.blockLen);
}
function Lr(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function wl(e, t) {
  ke(e, void 0, "digestInto() output");
  const r = t.outputLen;
  if (e.length < r)
    throw new Error('"digestInto() output" expected to be of length >=' + r);
}
function Fn(...e) {
  for (let t = 0; t < e.length; t++)
    e[t].fill(0);
}
function No(e) {
  return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function ft(e, t) {
  return e << 32 - t | e >>> t;
}
const _a = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", bl = /* @__PURE__ */ Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Pe(e) {
  if (ke(e), _a)
    return e.toHex();
  let t = "";
  for (let r = 0; r < e.length; r++)
    t += bl[e[r]];
  return t;
}
const bt = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Ns(e) {
  if (e >= bt._0 && e <= bt._9)
    return e - bt._0;
  if (e >= bt.A && e <= bt.F)
    return e - (bt.A - 10);
  if (e >= bt.a && e <= bt.f)
    return e - (bt.a - 10);
}
function Ne(e) {
  if (typeof e != "string")
    throw new Error("hex string expected, got " + typeof e);
  if (_a)
    return Uint8Array.fromHex(e);
  const t = e.length, r = t / 2;
  if (t % 2)
    throw new Error("hex string expected, got unpadded hex of length " + t);
  const o = new Uint8Array(r);
  for (let s = 0, u = 0; s < r; s++, u += 2) {
    const f = Ns(e.charCodeAt(u)), p = Ns(e.charCodeAt(u + 1));
    if (f === void 0 || p === void 0) {
      const h = e[u] + e[u + 1];
      throw new Error('hex string expected, got non-hex character "' + h + '" at index ' + u);
    }
    o[s] = f * 16 + p;
  }
  return o;
}
function Je(...e) {
  let t = 0;
  for (let o = 0; o < e.length; o++) {
    const s = e[o];
    ke(s), t += s.length;
  }
  const r = new Uint8Array(t);
  for (let o = 0, s = 0; o < e.length; o++) {
    const u = e[o];
    r.set(u, s), s += u.length;
  }
  return r;
}
function El(e, t = {}) {
  const r = (s, u) => e(u).update(s).digest(), o = e(void 0);
  return r.outputLen = o.outputLen, r.blockLen = o.blockLen, r.create = (s) => e(s), Object.assign(r, t), Object.freeze(r);
}
function An(e = 32) {
  const t = typeof globalThis == "object" ? globalThis.crypto : null;
  if (typeof t?.getRandomValues != "function")
    throw new Error("crypto.getRandomValues must be defined");
  return t.getRandomValues(new Uint8Array(e));
}
const _l = (e) => ({
  oid: Uint8Array.from([6, 9, 96, 134, 72, 1, 101, 3, 4, 2, e])
});
function xl(e, t, r) {
  return e & t ^ ~e & r;
}
function Al(e, t, r) {
  return e & t ^ e & r ^ t & r;
}
class kl {
  blockLen;
  outputLen;
  padOffset;
  isLE;
  // For partial updates less than block size
  buffer;
  view;
  finished = !1;
  length = 0;
  pos = 0;
  destroyed = !1;
  constructor(t, r, o, s) {
    this.blockLen = t, this.outputLen = r, this.padOffset = o, this.isLE = s, this.buffer = new Uint8Array(t), this.view = No(this.buffer);
  }
  update(t) {
    Lr(this), ke(t);
    const { view: r, buffer: o, blockLen: s } = this, u = t.length;
    for (let f = 0; f < u; ) {
      const p = Math.min(s - this.pos, u - f);
      if (p === s) {
        const h = No(t);
        for (; s <= u - f; f += s)
          this.process(h, f);
        continue;
      }
      o.set(t.subarray(f, f + p), this.pos), this.pos += p, f += p, this.pos === s && (this.process(r, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Lr(this), wl(t, this), this.finished = !0;
    const { buffer: r, view: o, blockLen: s, isLE: u } = this;
    let { pos: f } = this;
    r[f++] = 128, Fn(this.buffer.subarray(f)), this.padOffset > s - f && (this.process(o, 0), f = 0);
    for (let w = f; w < s; w++)
      r[w] = 0;
    o.setBigUint64(s - 8, BigInt(this.length * 8), u), this.process(o, 0);
    const p = No(t), h = this.outputLen;
    if (h % 4)
      throw new Error("_sha2: outputLen must be aligned to 32bit");
    const m = h / 4, v = this.get();
    if (m > v.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let w = 0; w < m; w++)
      p.setUint32(4 * w, v[w], u);
  }
  digest() {
    const { buffer: t, outputLen: r } = this;
    this.digestInto(t);
    const o = t.slice(0, r);
    return this.destroy(), o;
  }
  _cloneInto(t) {
    t ||= new this.constructor(), t.set(...this.get());
    const { blockLen: r, buffer: o, length: s, finished: u, destroyed: f, pos: p } = this;
    return t.destroyed = f, t.finished = u, t.length = s, t.pos = p, s % r && t.buffer.set(o), t;
  }
  clone() {
    return this._cloneInto();
  }
}
const Dt = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Sl = /* @__PURE__ */ Uint32Array.from([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]), qt = /* @__PURE__ */ new Uint32Array(64);
class Rl extends kl {
  constructor(t) {
    super(64, t, 8, !1);
  }
  get() {
    const { A: t, B: r, C: o, D: s, E: u, F: f, G: p, H: h } = this;
    return [t, r, o, s, u, f, p, h];
  }
  // prettier-ignore
  set(t, r, o, s, u, f, p, h) {
    this.A = t | 0, this.B = r | 0, this.C = o | 0, this.D = s | 0, this.E = u | 0, this.F = f | 0, this.G = p | 0, this.H = h | 0;
  }
  process(t, r) {
    for (let w = 0; w < 16; w++, r += 4)
      qt[w] = t.getUint32(r, !1);
    for (let w = 16; w < 64; w++) {
      const P = qt[w - 15], T = qt[w - 2], L = ft(P, 7) ^ ft(P, 18) ^ P >>> 3, D = ft(T, 17) ^ ft(T, 19) ^ T >>> 10;
      qt[w] = D + qt[w - 7] + L + qt[w - 16] | 0;
    }
    let { A: o, B: s, C: u, D: f, E: p, F: h, G: m, H: v } = this;
    for (let w = 0; w < 64; w++) {
      const P = ft(p, 6) ^ ft(p, 11) ^ ft(p, 25), T = v + P + xl(p, h, m) + Sl[w] + qt[w] | 0, D = (ft(o, 2) ^ ft(o, 13) ^ ft(o, 22)) + Al(o, s, u) | 0;
      v = m, m = h, h = p, p = f + T | 0, f = u, u = s, s = o, o = T + D | 0;
    }
    o = o + this.A | 0, s = s + this.B | 0, u = u + this.C | 0, f = f + this.D | 0, p = p + this.E | 0, h = h + this.F | 0, m = m + this.G | 0, v = v + this.H | 0, this.set(o, s, u, f, p, h, m, v);
  }
  roundClean() {
    Fn(qt);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), Fn(this.buffer);
  }
}
class Bl extends Rl {
  // We cannot use array here since array allows indexing by variable
  // which means optimizer/compiler cannot use registers.
  A = Dt[0] | 0;
  B = Dt[1] | 0;
  C = Dt[2] | 0;
  D = Dt[3] | 0;
  E = Dt[4] | 0;
  F = Dt[5] | 0;
  G = Dt[6] | 0;
  H = Dt[7] | 0;
  constructor() {
    super(32);
  }
}
const pt = /* @__PURE__ */ El(
  () => new Bl(),
  /* @__PURE__ */ _l(1)
);
const di = /* @__PURE__ */ BigInt(0), Yo = /* @__PURE__ */ BigInt(1);
function Pr(e, t = "") {
  if (typeof e != "boolean") {
    const r = t && `"${t}" `;
    throw new Error(r + "expected boolean, got type=" + typeof e);
  }
  return e;
}
function xa(e) {
  if (typeof e == "bigint") {
    if (!Sr(e))
      throw new Error("positive bigint expected, got " + e);
  } else
    Mt(e);
  return e;
}
function _r(e) {
  const t = xa(e).toString(16);
  return t.length & 1 ? "0" + t : t;
}
function Aa(e) {
  if (typeof e != "string")
    throw new Error("hex string expected, got " + typeof e);
  return e === "" ? di : BigInt("0x" + e);
}
function Vn(e) {
  return Aa(Pe(e));
}
function ka(e) {
  return Aa(Pe(Ol(ke(e)).reverse()));
}
function hi(e, t) {
  Mt(t), e = xa(e);
  const r = Ne(e.toString(16).padStart(t * 2, "0"));
  if (r.length !== t)
    throw new Error("number too large");
  return r;
}
function Sa(e, t) {
  return hi(e, t).reverse();
}
function Ol(e) {
  return Uint8Array.from(e);
}
function Il(e) {
  return Uint8Array.from(e, (t, r) => {
    const o = t.charCodeAt(0);
    if (t.length !== 1 || o > 127)
      throw new Error(`string contains non-ASCII character "${e[r]}" with code ${o} at position ${r}`);
    return o;
  });
}
const Sr = (e) => typeof e == "bigint" && di <= e;
function Tl(e, t, r) {
  return Sr(e) && Sr(t) && Sr(r) && t <= e && e < r;
}
function Cl(e, t, r, o) {
  if (!Tl(t, r, o))
    throw new Error("expected valid " + e + ": " + r + " <= n < " + o + ", got " + t);
}
function Ll(e) {
  let t;
  for (t = 0; e > di; e >>= Yo, t += 1)
    ;
  return t;
}
const pi = (e) => (Yo << BigInt(e)) - Yo;
function Pl(e, t, r) {
  if (Mt(e, "hashLen"), Mt(t, "qByteLen"), typeof r != "function")
    throw new Error("hmacFn must be a function");
  const o = (F) => new Uint8Array(F), s = Uint8Array.of(), u = Uint8Array.of(0), f = Uint8Array.of(1), p = 1e3;
  let h = o(e), m = o(e), v = 0;
  const w = () => {
    h.fill(1), m.fill(0), v = 0;
  }, P = (...F) => r(m, Je(h, ...F)), T = (F = s) => {
    m = P(u, F), h = P(), F.length !== 0 && (m = P(f, F), h = P());
  }, L = () => {
    if (v++ >= p)
      throw new Error("drbg: tried max amount of iterations");
    let F = 0;
    const Z = [];
    for (; F < t; ) {
      h = P();
      const M = h.slice();
      Z.push(M), F += h.length;
    }
    return Je(...Z);
  };
  return (F, Z) => {
    w(), T(F);
    let M;
    for (; !(M = Z(L())); )
      T();
    return w(), M;
  };
}
function yi(e, t = {}, r = {}) {
  if (!e || typeof e != "object")
    throw new Error("expected valid options object");
  function o(u, f, p) {
    const h = e[u];
    if (p && h === void 0)
      return;
    const m = typeof h;
    if (m !== f || h === null)
      throw new Error(`param "${u}" is invalid: expected ${f}, got ${m}`);
  }
  const s = (u, f) => Object.entries(u).forEach(([p, h]) => o(p, h, f));
  s(t, !1), s(r, !0);
}
function Ds(e) {
  const t = /* @__PURE__ */ new WeakMap();
  return (r, ...o) => {
    const s = t.get(r);
    if (s !== void 0)
      return s;
    const u = e(r, ...o);
    return t.set(r, u), u;
  };
}
const Qe = /* @__PURE__ */ BigInt(0), Ge = /* @__PURE__ */ BigInt(1), nn = /* @__PURE__ */ BigInt(2), Ra = /* @__PURE__ */ BigInt(3), Ba = /* @__PURE__ */ BigInt(4), Oa = /* @__PURE__ */ BigInt(5), Nl = /* @__PURE__ */ BigInt(7), Ia = /* @__PURE__ */ BigInt(8), Dl = /* @__PURE__ */ BigInt(9), Ta = /* @__PURE__ */ BigInt(16);
function at(e, t) {
  const r = e % t;
  return r >= Qe ? r : t + r;
}
function ot(e, t, r) {
  let o = e;
  for (; t-- > Qe; )
    o *= o, o %= r;
  return o;
}
function qs(e, t) {
  if (e === Qe)
    throw new Error("invert: expected non-zero number");
  if (t <= Qe)
    throw new Error("invert: expected positive modulus, got " + t);
  let r = at(e, t), o = t, s = Qe, u = Ge;
  for (; r !== Qe; ) {
    const p = o / r, h = o % r, m = s - u * p;
    o = r, r = h, s = u, u = m;
  }
  if (o !== Ge)
    throw new Error("invert: does not exist");
  return at(s, t);
}
function gi(e, t, r) {
  if (!e.eql(e.sqr(t), r))
    throw new Error("Cannot find square root");
}
function Ca(e, t) {
  const r = (e.ORDER + Ge) / Ba, o = e.pow(t, r);
  return gi(e, o, t), o;
}
function ql(e, t) {
  const r = (e.ORDER - Oa) / Ia, o = e.mul(t, nn), s = e.pow(o, r), u = e.mul(t, s), f = e.mul(e.mul(u, nn), s), p = e.mul(u, e.sub(f, e.ONE));
  return gi(e, p, t), p;
}
function $l(e) {
  const t = Hr(e), r = La(e), o = r(t, t.neg(t.ONE)), s = r(t, o), u = r(t, t.neg(o)), f = (e + Nl) / Ta;
  return (p, h) => {
    let m = p.pow(h, f), v = p.mul(m, o);
    const w = p.mul(m, s), P = p.mul(m, u), T = p.eql(p.sqr(v), h), L = p.eql(p.sqr(w), h);
    m = p.cmov(m, v, T), v = p.cmov(P, w, L);
    const D = p.eql(p.sqr(v), h), F = p.cmov(m, v, D);
    return gi(p, F, h), F;
  };
}
function La(e) {
  if (e < Ra)
    throw new Error("sqrt is not defined for small field");
  let t = e - Ge, r = 0;
  for (; t % nn === Qe; )
    t /= nn, r++;
  let o = nn;
  const s = Hr(e);
  for (; $s(s, o) === 1; )
    if (o++ > 1e3)
      throw new Error("Cannot find square root: probably non-prime P");
  if (r === 1)
    return Ca;
  let u = s.pow(o, t);
  const f = (t + Ge) / nn;
  return function(h, m) {
    if (h.is0(m))
      return m;
    if ($s(h, m) !== 1)
      throw new Error("Cannot find square root");
    let v = r, w = h.mul(h.ONE, u), P = h.pow(m, t), T = h.pow(m, f);
    for (; !h.eql(P, h.ONE); ) {
      if (h.is0(P))
        return h.ZERO;
      let L = 1, D = h.sqr(P);
      for (; !h.eql(D, h.ONE); )
        if (L++, D = h.sqr(D), L === v)
          throw new Error("Cannot find square root");
      const F = Ge << BigInt(v - L - 1), Z = h.pow(w, F);
      v = L, w = h.sqr(Z), P = h.mul(P, w), T = h.mul(T, Z);
    }
    return T;
  };
}
function Kl(e) {
  return e % Ba === Ra ? Ca : e % Ia === Oa ? ql : e % Ta === Dl ? $l(e) : La(e);
}
const Ul = [
  "create",
  "isValid",
  "is0",
  "neg",
  "inv",
  "sqrt",
  "sqr",
  "eql",
  "add",
  "sub",
  "mul",
  "pow",
  "div",
  "addN",
  "subN",
  "mulN",
  "sqrN"
];
function Ml(e) {
  const t = {
    ORDER: "bigint",
    BYTES: "number",
    BITS: "number"
  }, r = Ul.reduce((o, s) => (o[s] = "function", o), t);
  return yi(e, r), e;
}
function jl(e, t, r) {
  if (r < Qe)
    throw new Error("invalid exponent, negatives unsupported");
  if (r === Qe)
    return e.ONE;
  if (r === Ge)
    return t;
  let o = e.ONE, s = t;
  for (; r > Qe; )
    r & Ge && (o = e.mul(o, s)), s = e.sqr(s), r >>= Ge;
  return o;
}
function Pa(e, t, r = !1) {
  const o = new Array(t.length).fill(r ? e.ZERO : void 0), s = t.reduce((f, p, h) => e.is0(p) ? f : (o[h] = f, e.mul(f, p)), e.ONE), u = e.inv(s);
  return t.reduceRight((f, p, h) => e.is0(p) ? f : (o[h] = e.mul(f, o[h]), e.mul(f, p)), u), o;
}
function $s(e, t) {
  const r = (e.ORDER - Ge) / nn, o = e.pow(t, r), s = e.eql(o, e.ONE), u = e.eql(o, e.ZERO), f = e.eql(o, e.neg(e.ONE));
  if (!s && !u && !f)
    throw new Error("invalid Legendre symbol result");
  return s ? 1 : u ? 0 : -1;
}
function Fl(e, t) {
  t !== void 0 && Mt(t);
  const r = t !== void 0 ? t : e.toString(2).length, o = Math.ceil(r / 8);
  return { nBitLength: r, nByteLength: o };
}
class Hl {
  ORDER;
  BITS;
  BYTES;
  isLE;
  ZERO = Qe;
  ONE = Ge;
  _lengths;
  _sqrt;
  // cached sqrt
  _mod;
  constructor(t, r = {}) {
    if (t <= Qe)
      throw new Error("invalid field: expected ORDER > 0, got " + t);
    let o;
    this.isLE = !1, r != null && typeof r == "object" && (typeof r.BITS == "number" && (o = r.BITS), typeof r.sqrt == "function" && (this.sqrt = r.sqrt), typeof r.isLE == "boolean" && (this.isLE = r.isLE), r.allowedLengths && (this._lengths = r.allowedLengths?.slice()), typeof r.modFromBytes == "boolean" && (this._mod = r.modFromBytes));
    const { nBitLength: s, nByteLength: u } = Fl(t, o);
    if (u > 2048)
      throw new Error("invalid field: expected ORDER of <= 2048 bytes");
    this.ORDER = t, this.BITS = s, this.BYTES = u, this._sqrt = void 0, Object.preventExtensions(this);
  }
  create(t) {
    return at(t, this.ORDER);
  }
  isValid(t) {
    if (typeof t != "bigint")
      throw new Error("invalid field element: expected bigint, got " + typeof t);
    return Qe <= t && t < this.ORDER;
  }
  is0(t) {
    return t === Qe;
  }
  // is valid and invertible
  isValidNot0(t) {
    return !this.is0(t) && this.isValid(t);
  }
  isOdd(t) {
    return (t & Ge) === Ge;
  }
  neg(t) {
    return at(-t, this.ORDER);
  }
  eql(t, r) {
    return t === r;
  }
  sqr(t) {
    return at(t * t, this.ORDER);
  }
  add(t, r) {
    return at(t + r, this.ORDER);
  }
  sub(t, r) {
    return at(t - r, this.ORDER);
  }
  mul(t, r) {
    return at(t * r, this.ORDER);
  }
  pow(t, r) {
    return jl(this, t, r);
  }
  div(t, r) {
    return at(t * qs(r, this.ORDER), this.ORDER);
  }
  // Same as above, but doesn't normalize
  sqrN(t) {
    return t * t;
  }
  addN(t, r) {
    return t + r;
  }
  subN(t, r) {
    return t - r;
  }
  mulN(t, r) {
    return t * r;
  }
  inv(t) {
    return qs(t, this.ORDER);
  }
  sqrt(t) {
    return this._sqrt || (this._sqrt = Kl(this.ORDER)), this._sqrt(this, t);
  }
  toBytes(t) {
    return this.isLE ? Sa(t, this.BYTES) : hi(t, this.BYTES);
  }
  fromBytes(t, r = !1) {
    ke(t);
    const { _lengths: o, BYTES: s, isLE: u, ORDER: f, _mod: p } = this;
    if (o) {
      if (!o.includes(t.length) || t.length > s)
        throw new Error("Field.fromBytes: expected " + o + " bytes, got " + t.length);
      const m = new Uint8Array(s);
      m.set(t, u ? 0 : m.length - t.length), t = m;
    }
    if (t.length !== s)
      throw new Error("Field.fromBytes: expected " + s + " bytes, got " + t.length);
    let h = u ? ka(t) : Vn(t);
    if (p && (h = at(h, f)), !r && !this.isValid(h))
      throw new Error("invalid field element: outside of range 0..ORDER");
    return h;
  }
  // TODO: we don't need it here, move out to separate fn
  invertBatch(t) {
    return Pa(this, t);
  }
  // We can't move this out because Fp6, Fp12 implement it
  // and it's unclear what to return in there.
  cmov(t, r, o) {
    return o ? r : t;
  }
}
function Hr(e, t = {}) {
  return new Hl(e, t);
}
function Na(e) {
  if (typeof e != "bigint")
    throw new Error("field order must be bigint");
  const t = e.toString(2).length;
  return Math.ceil(t / 8);
}
function Da(e) {
  const t = Na(e);
  return t + Math.ceil(t / 2);
}
function qa(e, t, r = !1) {
  ke(e);
  const o = e.length, s = Na(t), u = Da(t);
  if (o < 16 || o < u || o > 1024)
    throw new Error("expected " + u + "-1024 bytes of input, got " + o);
  const f = r ? ka(e) : Vn(e), p = at(f, t - Ge) + Ge;
  return r ? Sa(p, s) : hi(p, s);
}
const En = /* @__PURE__ */ BigInt(0), rn = /* @__PURE__ */ BigInt(1);
function Nr(e, t) {
  const r = t.negate();
  return e ? r : t;
}
function Ks(e, t) {
  const r = Pa(e.Fp, t.map((o) => o.Z));
  return t.map((o, s) => e.fromAffine(o.toAffine(r[s])));
}
function $a(e, t) {
  if (!Number.isSafeInteger(e) || e <= 0 || e > t)
    throw new Error("invalid window size, expected [1.." + t + "], got W=" + e);
}
function Do(e, t) {
  $a(e, t);
  const r = Math.ceil(t / e) + 1, o = 2 ** (e - 1), s = 2 ** e, u = pi(e), f = BigInt(e);
  return { windows: r, windowSize: o, mask: u, maxNumber: s, shiftBy: f };
}
function Us(e, t, r) {
  const { windowSize: o, mask: s, maxNumber: u, shiftBy: f } = r;
  let p = Number(e & s), h = e >> f;
  p > o && (p -= u, h += rn);
  const m = t * o, v = m + Math.abs(p) - 1, w = p === 0, P = p < 0, T = t % 2 !== 0;
  return { nextN: h, offset: v, isZero: w, isNeg: P, isNegF: T, offsetF: m };
}
const qo = /* @__PURE__ */ new WeakMap(), Ka = /* @__PURE__ */ new WeakMap();
function $o(e) {
  return Ka.get(e) || 1;
}
function Ms(e) {
  if (e !== En)
    throw new Error("invalid wNAF");
}
class Vl {
  BASE;
  ZERO;
  Fn;
  bits;
  // Parametrized with a given Point class (not individual point)
  constructor(t, r) {
    this.BASE = t.BASE, this.ZERO = t.ZERO, this.Fn = t.Fn, this.bits = r;
  }
  // non-const time multiplication ladder
  _unsafeLadder(t, r, o = this.ZERO) {
    let s = t;
    for (; r > En; )
      r & rn && (o = o.add(s)), s = s.double(), r >>= rn;
    return o;
  }
  /**
   * Creates a wNAF precomputation window. Used for caching.
   * Default window size is set by `utils.precompute()` and is equal to 8.
   * Number of precomputed points depends on the curve size:
   * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
   * - 𝑊 is the window size
   * - 𝑛 is the bitlength of the curve order.
   * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
   * @param point Point instance
   * @param W window size
   * @returns precomputed point tables flattened to a single array
   */
  precomputeWindow(t, r) {
    const { windows: o, windowSize: s } = Do(r, this.bits), u = [];
    let f = t, p = f;
    for (let h = 0; h < o; h++) {
      p = f, u.push(p);
      for (let m = 1; m < s; m++)
        p = p.add(f), u.push(p);
      f = p.double();
    }
    return u;
  }
  /**
   * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
   * More compact implementation:
   * https://github.com/paulmillr/noble-secp256k1/blob/47cb1669b6e506ad66b35fe7d76132ae97465da2/index.ts#L502-L541
   * @returns real and fake (for const-time) points
   */
  wNAF(t, r, o) {
    if (!this.Fn.isValid(o))
      throw new Error("invalid scalar");
    let s = this.ZERO, u = this.BASE;
    const f = Do(t, this.bits);
    for (let p = 0; p < f.windows; p++) {
      const { nextN: h, offset: m, isZero: v, isNeg: w, isNegF: P, offsetF: T } = Us(o, p, f);
      o = h, v ? u = u.add(Nr(P, r[T])) : s = s.add(Nr(w, r[m]));
    }
    return Ms(o), { p: s, f: u };
  }
  /**
   * Implements ec unsafe (non const-time) multiplication using precomputed tables and w-ary non-adjacent form.
   * @param acc accumulator point to add result of multiplication
   * @returns point
   */
  wNAFUnsafe(t, r, o, s = this.ZERO) {
    const u = Do(t, this.bits);
    for (let f = 0; f < u.windows && o !== En; f++) {
      const { nextN: p, offset: h, isZero: m, isNeg: v } = Us(o, f, u);
      if (o = p, !m) {
        const w = r[h];
        s = s.add(v ? w.negate() : w);
      }
    }
    return Ms(o), s;
  }
  getPrecomputes(t, r, o) {
    let s = qo.get(r);
    return s || (s = this.precomputeWindow(r, t), t !== 1 && (typeof o == "function" && (s = o(s)), qo.set(r, s))), s;
  }
  cached(t, r, o) {
    const s = $o(t);
    return this.wNAF(s, this.getPrecomputes(s, t, o), r);
  }
  unsafe(t, r, o, s) {
    const u = $o(t);
    return u === 1 ? this._unsafeLadder(t, r, s) : this.wNAFUnsafe(u, this.getPrecomputes(u, t, o), r, s);
  }
  // We calculate precomputes for elliptic curve point multiplication
  // using windowed method. This specifies window size and
  // stores precomputed values. Usually only base point would be precomputed.
  createCache(t, r) {
    $a(r, this.bits), Ka.set(t, r), qo.delete(t);
  }
  hasCache(t) {
    return $o(t) !== 1;
  }
}
function zl(e, t, r, o) {
  let s = t, u = e.ZERO, f = e.ZERO;
  for (; r > En || o > En; )
    r & rn && (u = u.add(s)), o & rn && (f = f.add(s)), s = s.double(), r >>= rn, o >>= rn;
  return { p1: u, p2: f };
}
function js(e, t, r) {
  if (t) {
    if (t.ORDER !== e)
      throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
    return Ml(t), t;
  } else
    return Hr(e, { isLE: r });
}
function Zl(e, t, r = {}, o) {
  if (o === void 0 && (o = e === "edwards"), !t || typeof t != "object")
    throw new Error(`expected valid ${e} CURVE object`);
  for (const h of ["p", "n", "h"]) {
    const m = t[h];
    if (!(typeof m == "bigint" && m > En))
      throw new Error(`CURVE.${h} must be positive bigint`);
  }
  const s = js(t.p, r.Fp, o), u = js(t.n, r.Fn, o), p = ["Gx", "Gy", "a", "b"];
  for (const h of p)
    if (!s.isValid(t[h]))
      throw new Error(`CURVE.${h} must be valid field element of CURVE.Fp`);
  return t = Object.freeze(Object.assign({}, t)), { CURVE: t, Fp: s, Fn: u };
}
function Ua(e, t) {
  return function(o) {
    const s = e(o);
    return { secretKey: s, publicKey: t(s) };
  };
}
class Ma {
  oHash;
  iHash;
  blockLen;
  outputLen;
  finished = !1;
  destroyed = !1;
  constructor(t, r) {
    if (Fr(t), ke(r, void 0, "key"), this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const o = this.blockLen, s = new Uint8Array(o);
    s.set(r.length > o ? t.create().update(r).digest() : r);
    for (let u = 0; u < s.length; u++)
      s[u] ^= 54;
    this.iHash.update(s), this.oHash = t.create();
    for (let u = 0; u < s.length; u++)
      s[u] ^= 106;
    this.oHash.update(s), Fn(s);
  }
  update(t) {
    return Lr(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    Lr(this), ke(t, this.outputLen, "output"), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t ||= Object.create(Object.getPrototypeOf(this), {});
    const { oHash: r, iHash: o, finished: s, destroyed: u, blockLen: f, outputLen: p } = this;
    return t = t, t.finished = s, t.destroyed = u, t.blockLen = f, t.outputLen = p, t.oHash = r._cloneInto(t.oHash), t.iHash = o._cloneInto(t.iHash), t;
  }
  clone() {
    return this._cloneInto();
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const zn = (e, t, r) => new Ma(e, t).update(r).digest();
zn.create = (e, t) => new Ma(e, t);
const Fs = (e, t) => (e + (e >= 0 ? t : -t) / ja) / t;
function Gl(e, t, r) {
  const [[o, s], [u, f]] = t, p = Fs(f * e, r), h = Fs(-s * e, r);
  let m = e - p * o - h * u, v = -p * s - h * f;
  const w = m < kt, P = v < kt;
  w && (m = -m), P && (v = -v);
  const T = pi(Math.ceil(Ll(r) / 2)) + vn;
  if (m < kt || m >= T || v < kt || v >= T)
    throw new Error("splitScalar (endomorphism): failed, k=" + e);
  return { k1neg: w, k1: m, k2neg: P, k2: v };
}
function Xo(e) {
  if (!["compact", "recovered", "der"].includes(e))
    throw new Error('Signature format must be "compact", "recovered", or "der"');
  return e;
}
function Ko(e, t) {
  const r = {};
  for (let o of Object.keys(t))
    r[o] = e[o] === void 0 ? t[o] : e[o];
  return Pr(r.lowS, "lowS"), Pr(r.prehash, "prehash"), r.format !== void 0 && Xo(r.format), r;
}
class Wl extends Error {
  constructor(t = "") {
    super(t);
  }
}
const $t = {
  // asn.1 DER encoding utils
  Err: Wl,
  // Basic building block is TLV (Tag-Length-Value)
  _tlv: {
    encode: (e, t) => {
      const { Err: r } = $t;
      if (e < 0 || e > 256)
        throw new r("tlv.encode: wrong tag");
      if (t.length & 1)
        throw new r("tlv.encode: unpadded data");
      const o = t.length / 2, s = _r(o);
      if (s.length / 2 & 128)
        throw new r("tlv.encode: long form length too big");
      const u = o > 127 ? _r(s.length / 2 | 128) : "";
      return _r(e) + u + s + t;
    },
    // v - value, l - left bytes (unparsed)
    decode(e, t) {
      const { Err: r } = $t;
      let o = 0;
      if (e < 0 || e > 256)
        throw new r("tlv.encode: wrong tag");
      if (t.length < 2 || t[o++] !== e)
        throw new r("tlv.decode: wrong tlv");
      const s = t[o++], u = !!(s & 128);
      let f = 0;
      if (!u)
        f = s;
      else {
        const h = s & 127;
        if (!h)
          throw new r("tlv.decode(long): indefinite length not supported");
        if (h > 4)
          throw new r("tlv.decode(long): byte length is too big");
        const m = t.subarray(o, o + h);
        if (m.length !== h)
          throw new r("tlv.decode: length bytes not complete");
        if (m[0] === 0)
          throw new r("tlv.decode(long): zero leftmost byte");
        for (const v of m)
          f = f << 8 | v;
        if (o += h, f < 128)
          throw new r("tlv.decode(long): not minimal encoding");
      }
      const p = t.subarray(o, o + f);
      if (p.length !== f)
        throw new r("tlv.decode: wrong value length");
      return { v: p, l: t.subarray(o + f) };
    }
  },
  // https://crypto.stackexchange.com/a/57734 Leftmost bit of first byte is 'negative' flag,
  // since we always use positive integers here. It must always be empty:
  // - add zero byte if exists
  // - if next byte doesn't have a flag, leading zero is not allowed (minimal encoding)
  _int: {
    encode(e) {
      const { Err: t } = $t;
      if (e < kt)
        throw new t("integer: negative integers are not allowed");
      let r = _r(e);
      if (Number.parseInt(r[0], 16) & 8 && (r = "00" + r), r.length & 1)
        throw new t("unexpected DER parsing assertion: unpadded hex");
      return r;
    },
    decode(e) {
      const { Err: t } = $t;
      if (e[0] & 128)
        throw new t("invalid signature integer: negative");
      if (e[0] === 0 && !(e[1] & 128))
        throw new t("invalid signature integer: unnecessary leading zero");
      return Vn(e);
    }
  },
  toSig(e) {
    const { Err: t, _int: r, _tlv: o } = $t, s = ke(e, void 0, "signature"), { v: u, l: f } = o.decode(48, s);
    if (f.length)
      throw new t("invalid signature: left bytes after parsing");
    const { v: p, l: h } = o.decode(2, u), { v: m, l: v } = o.decode(2, h);
    if (v.length)
      throw new t("invalid signature: left bytes after parsing");
    return { r: r.decode(p), s: r.decode(m) };
  },
  hexFromSig(e) {
    const { _tlv: t, _int: r } = $t, o = t.encode(2, r.encode(e.r)), s = t.encode(2, r.encode(e.s)), u = o + s;
    return t.encode(48, u);
  }
}, kt = BigInt(0), vn = BigInt(1), ja = BigInt(2), xr = BigInt(3), Yl = BigInt(4);
function Xl(e, t = {}) {
  const r = Zl("weierstrass", e, t), { Fp: o, Fn: s } = r;
  let u = r.CURVE;
  const { h: f, n: p } = u;
  yi(t, {}, {
    allowInfinityPoint: "boolean",
    clearCofactor: "function",
    isTorsionFree: "function",
    fromBytes: "function",
    toBytes: "function",
    endo: "object"
  });
  const { endo: h } = t;
  if (h && (!o.is0(u.a) || typeof h.beta != "bigint" || !Array.isArray(h.basises)))
    throw new Error('invalid endo: expected "beta": bigint and "basises": array');
  const m = Ha(o, s);
  function v() {
    if (!o.isOdd)
      throw new Error("compression is not supported: Field does not have .isOdd()");
  }
  function w(se, K, j) {
    const { x: N, y: G } = K.toAffine(), ee = o.toBytes(N);
    if (Pr(j, "isCompressed"), j) {
      v();
      const J = !o.isOdd(G);
      return Je(Fa(J), ee);
    } else
      return Je(Uint8Array.of(4), ee, o.toBytes(G));
  }
  function P(se) {
    ke(se, void 0, "Point");
    const { publicKey: K, publicKeyUncompressed: j } = m, N = se.length, G = se[0], ee = se.subarray(1);
    if (N === K && (G === 2 || G === 3)) {
      const J = o.fromBytes(ee);
      if (!o.isValid(J))
        throw new Error("bad point: is not on curve, wrong x");
      const Q = D(J);
      let W;
      try {
        W = o.sqrt(Q);
      } catch (Ie) {
        const Ee = Ie instanceof Error ? ": " + Ie.message : "";
        throw new Error("bad point: is not on curve, sqrt error" + Ee);
      }
      v();
      const oe = o.isOdd(W);
      return (G & 1) === 1 !== oe && (W = o.neg(W)), { x: J, y: W };
    } else if (N === j && G === 4) {
      const J = o.BYTES, Q = o.fromBytes(ee.subarray(0, J)), W = o.fromBytes(ee.subarray(J, J * 2));
      if (!F(Q, W))
        throw new Error("bad point: is not on curve");
      return { x: Q, y: W };
    } else
      throw new Error(`bad point: got length ${N}, expected compressed=${K} or uncompressed=${j}`);
  }
  const T = t.toBytes || w, L = t.fromBytes || P;
  function D(se) {
    const K = o.sqr(se), j = o.mul(K, se);
    return o.add(o.add(j, o.mul(se, u.a)), u.b);
  }
  function F(se, K) {
    const j = o.sqr(K), N = D(se);
    return o.eql(j, N);
  }
  if (!F(u.Gx, u.Gy))
    throw new Error("bad curve params: generator point");
  const Z = o.mul(o.pow(u.a, xr), Yl), M = o.mul(o.sqr(u.b), BigInt(27));
  if (o.is0(o.add(Z, M)))
    throw new Error("bad curve params: a or b");
  function fe(se, K, j = !1) {
    if (!o.isValid(K) || j && o.is0(K))
      throw new Error(`bad point coordinate ${se}`);
    return K;
  }
  function ae(se) {
    if (!(se instanceof le))
      throw new Error("Weierstrass Point expected");
  }
  function Ke(se) {
    if (!h || !h.basises)
      throw new Error("no endo");
    return Gl(se, h.basises, s.ORDER);
  }
  const de = Ds((se, K) => {
    const { X: j, Y: N, Z: G } = se;
    if (o.eql(G, o.ONE))
      return { x: j, y: N };
    const ee = se.is0();
    K == null && (K = ee ? o.ONE : o.inv(G));
    const J = o.mul(j, K), Q = o.mul(N, K), W = o.mul(G, K);
    if (ee)
      return { x: o.ZERO, y: o.ZERO };
    if (!o.eql(W, o.ONE))
      throw new Error("invZ was invalid");
    return { x: J, y: Q };
  }), ve = Ds((se) => {
    if (se.is0()) {
      if (t.allowInfinityPoint && !o.is0(se.Y))
        return;
      throw new Error("bad point: ZERO");
    }
    const { x: K, y: j } = se.toAffine();
    if (!o.isValid(K) || !o.isValid(j))
      throw new Error("bad point: x or y not field elements");
    if (!F(K, j))
      throw new Error("bad point: equation left != right");
    if (!se.isTorsionFree())
      throw new Error("bad point: not in prime-order subgroup");
    return !0;
  });
  function Be(se, K, j, N, G) {
    return j = new le(o.mul(j.X, se), j.Y, j.Z), K = Nr(N, K), j = Nr(G, j), K.add(j);
  }
  class le {
    // base / generator point
    static BASE = new le(u.Gx, u.Gy, o.ONE);
    // zero / infinity / identity point
    static ZERO = new le(o.ZERO, o.ONE, o.ZERO);
    // 0, 1, 0
    // math field
    static Fp = o;
    // scalar field
    static Fn = s;
    X;
    Y;
    Z;
    /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
    constructor(K, j, N) {
      this.X = fe("x", K), this.Y = fe("y", j, !0), this.Z = fe("z", N), Object.freeze(this);
    }
    static CURVE() {
      return u;
    }
    /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
    static fromAffine(K) {
      const { x: j, y: N } = K || {};
      if (!K || !o.isValid(j) || !o.isValid(N))
        throw new Error("invalid affine point");
      if (K instanceof le)
        throw new Error("projective point not allowed");
      return o.is0(j) && o.is0(N) ? le.ZERO : new le(j, N, o.ONE);
    }
    static fromBytes(K) {
      const j = le.fromAffine(L(ke(K, void 0, "point")));
      return j.assertValidity(), j;
    }
    static fromHex(K) {
      return le.fromBytes(Ne(K));
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    /**
     *
     * @param windowSize
     * @param isLazy true will defer table computation until the first multiplication
     * @returns
     */
    precompute(K = 8, j = !0) {
      return Oe.createCache(this, K), j || this.multiply(xr), this;
    }
    // TODO: return `this`
    /** A point on curve is valid if it conforms to equation. */
    assertValidity() {
      ve(this);
    }
    hasEvenY() {
      const { y: K } = this.toAffine();
      if (!o.isOdd)
        throw new Error("Field doesn't support isOdd");
      return !o.isOdd(K);
    }
    /** Compare one point to another. */
    equals(K) {
      ae(K);
      const { X: j, Y: N, Z: G } = this, { X: ee, Y: J, Z: Q } = K, W = o.eql(o.mul(j, Q), o.mul(ee, G)), oe = o.eql(o.mul(N, Q), o.mul(J, G));
      return W && oe;
    }
    /** Flips point to one corresponding to (x, -y) in Affine coordinates. */
    negate() {
      return new le(this.X, o.neg(this.Y), this.Z);
    }
    // Renes-Costello-Batina exception-free doubling formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 3
    // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
    double() {
      const { a: K, b: j } = u, N = o.mul(j, xr), { X: G, Y: ee, Z: J } = this;
      let Q = o.ZERO, W = o.ZERO, oe = o.ZERO, ne = o.mul(G, G), Ie = o.mul(ee, ee), Ee = o.mul(J, J), ge = o.mul(G, ee);
      return ge = o.add(ge, ge), oe = o.mul(G, J), oe = o.add(oe, oe), Q = o.mul(K, oe), W = o.mul(N, Ee), W = o.add(Q, W), Q = o.sub(Ie, W), W = o.add(Ie, W), W = o.mul(Q, W), Q = o.mul(ge, Q), oe = o.mul(N, oe), Ee = o.mul(K, Ee), ge = o.sub(ne, Ee), ge = o.mul(K, ge), ge = o.add(ge, oe), oe = o.add(ne, ne), ne = o.add(oe, ne), ne = o.add(ne, Ee), ne = o.mul(ne, ge), W = o.add(W, ne), Ee = o.mul(ee, J), Ee = o.add(Ee, Ee), ne = o.mul(Ee, ge), Q = o.sub(Q, ne), oe = o.mul(Ee, Ie), oe = o.add(oe, oe), oe = o.add(oe, oe), new le(Q, W, oe);
    }
    // Renes-Costello-Batina exception-free addition formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 1
    // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
    add(K) {
      ae(K);
      const { X: j, Y: N, Z: G } = this, { X: ee, Y: J, Z: Q } = K;
      let W = o.ZERO, oe = o.ZERO, ne = o.ZERO;
      const Ie = u.a, Ee = o.mul(u.b, xr);
      let ge = o.mul(j, ee), xe = o.mul(N, J), Te = o.mul(G, Q), We = o.add(j, N), Ce = o.add(ee, J);
      We = o.mul(We, Ce), Ce = o.add(ge, xe), We = o.sub(We, Ce), Ce = o.add(j, G);
      let X = o.add(ee, Q);
      return Ce = o.mul(Ce, X), X = o.add(ge, Te), Ce = o.sub(Ce, X), X = o.add(N, G), W = o.add(J, Q), X = o.mul(X, W), W = o.add(xe, Te), X = o.sub(X, W), ne = o.mul(Ie, Ce), W = o.mul(Ee, Te), ne = o.add(W, ne), W = o.sub(xe, ne), ne = o.add(xe, ne), oe = o.mul(W, ne), xe = o.add(ge, ge), xe = o.add(xe, ge), Te = o.mul(Ie, Te), Ce = o.mul(Ee, Ce), xe = o.add(xe, Te), Te = o.sub(ge, Te), Te = o.mul(Ie, Te), Ce = o.add(Ce, Te), ge = o.mul(xe, Ce), oe = o.add(oe, ge), ge = o.mul(X, Ce), W = o.mul(We, W), W = o.sub(W, ge), ge = o.mul(We, xe), ne = o.mul(X, ne), ne = o.add(ne, ge), new le(W, oe, ne);
    }
    subtract(K) {
      return this.add(K.negate());
    }
    is0() {
      return this.equals(le.ZERO);
    }
    /**
     * Constant time multiplication.
     * Uses wNAF method. Windowed method may be 10% faster,
     * but takes 2x longer to generate and consumes 2x memory.
     * Uses precomputes when available.
     * Uses endomorphism for Koblitz curves.
     * @param scalar by which the point would be multiplied
     * @returns New point
     */
    multiply(K) {
      const { endo: j } = t;
      if (!s.isValidNot0(K))
        throw new Error("invalid scalar: out of range");
      let N, G;
      const ee = (J) => Oe.cached(this, J, (Q) => Ks(le, Q));
      if (j) {
        const { k1neg: J, k1: Q, k2neg: W, k2: oe } = Ke(K), { p: ne, f: Ie } = ee(Q), { p: Ee, f: ge } = ee(oe);
        G = Ie.add(ge), N = Be(j.beta, ne, Ee, J, W);
      } else {
        const { p: J, f: Q } = ee(K);
        N = J, G = Q;
      }
      return Ks(le, [N, G])[0];
    }
    /**
     * Non-constant-time multiplication. Uses double-and-add algorithm.
     * It's faster, but should only be used when you don't care about
     * an exposed secret key e.g. sig verification, which works over *public* keys.
     */
    multiplyUnsafe(K) {
      const { endo: j } = t, N = this;
      if (!s.isValid(K))
        throw new Error("invalid scalar: out of range");
      if (K === kt || N.is0())
        return le.ZERO;
      if (K === vn)
        return N;
      if (Oe.hasCache(this))
        return this.multiply(K);
      if (j) {
        const { k1neg: G, k1: ee, k2neg: J, k2: Q } = Ke(K), { p1: W, p2: oe } = zl(le, N, ee, Q);
        return Be(j.beta, W, oe, G, J);
      } else
        return Oe.unsafe(N, K);
    }
    /**
     * Converts Projective point to affine (x, y) coordinates.
     * @param invertedZ Z^-1 (inverted zero) - optional, precomputation is useful for invertBatch
     */
    toAffine(K) {
      return de(this, K);
    }
    /**
     * Checks whether Point is free of torsion elements (is in prime subgroup).
     * Always torsion-free for cofactor=1 curves.
     */
    isTorsionFree() {
      const { isTorsionFree: K } = t;
      return f === vn ? !0 : K ? K(le, this) : Oe.unsafe(this, p).is0();
    }
    clearCofactor() {
      const { clearCofactor: K } = t;
      return f === vn ? this : K ? K(le, this) : this.multiplyUnsafe(f);
    }
    isSmallOrder() {
      return this.multiplyUnsafe(f).is0();
    }
    toBytes(K = !0) {
      return Pr(K, "isCompressed"), this.assertValidity(), T(le, this, K);
    }
    toHex(K = !0) {
      return Pe(this.toBytes(K));
    }
    toString() {
      return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
    }
  }
  const De = s.BITS, Oe = new Vl(le, t.endo ? Math.ceil(De / 2) : De);
  return le.BASE.precompute(8), le;
}
function Fa(e) {
  return Uint8Array.of(e ? 2 : 3);
}
function Ha(e, t) {
  return {
    secretKey: t.BYTES,
    publicKey: 1 + e.BYTES,
    publicKeyUncompressed: 1 + 2 * e.BYTES,
    publicKeyHasPrefix: !0,
    signature: 2 * t.BYTES
  };
}
function Jl(e, t = {}) {
  const { Fn: r } = e, o = t.randomBytes || An, s = Object.assign(Ha(e.Fp, r), { seed: Da(r.ORDER) });
  function u(T) {
    try {
      const L = r.fromBytes(T);
      return r.isValidNot0(L);
    } catch {
      return !1;
    }
  }
  function f(T, L) {
    const { publicKey: D, publicKeyUncompressed: F } = s;
    try {
      const Z = T.length;
      return L === !0 && Z !== D || L === !1 && Z !== F ? !1 : !!e.fromBytes(T);
    } catch {
      return !1;
    }
  }
  function p(T = o(s.seed)) {
    return qa(ke(T, s.seed, "seed"), r.ORDER);
  }
  function h(T, L = !0) {
    return e.BASE.multiply(r.fromBytes(T)).toBytes(L);
  }
  function m(T) {
    const { secretKey: L, publicKey: D, publicKeyUncompressed: F } = s;
    if (!fi(T) || "_lengths" in r && r._lengths || L === D)
      return;
    const Z = ke(T, void 0, "key").length;
    return Z === D || Z === F;
  }
  function v(T, L, D = !0) {
    if (m(T) === !0)
      throw new Error("first arg must be private key");
    if (m(L) === !1)
      throw new Error("second arg must be public key");
    const F = r.fromBytes(T);
    return e.fromBytes(L).multiply(F).toBytes(D);
  }
  const w = {
    isValidSecretKey: u,
    isValidPublicKey: f,
    randomSecretKey: p
  }, P = Ua(p, h);
  return Object.freeze({ getPublicKey: h, getSharedSecret: v, keygen: P, Point: e, utils: w, lengths: s });
}
function Ql(e, t, r = {}) {
  Fr(t), yi(r, {}, {
    hmac: "function",
    lowS: "boolean",
    randomBytes: "function",
    bits2int: "function",
    bits2int_modN: "function"
  }), r = Object.assign({}, r);
  const o = r.randomBytes || An, s = r.hmac || ((j, N) => zn(t, j, N)), { Fp: u, Fn: f } = e, { ORDER: p, BITS: h } = f, { keygen: m, getPublicKey: v, getSharedSecret: w, utils: P, lengths: T } = Jl(e, r), L = {
    prehash: !0,
    lowS: typeof r.lowS == "boolean" ? r.lowS : !0,
    format: "compact",
    extraEntropy: !1
  }, D = p * ja < u.ORDER;
  function F(j) {
    const N = p >> vn;
    return j > N;
  }
  function Z(j, N) {
    if (!f.isValidNot0(N))
      throw new Error(`invalid signature ${j}: out of range 1..Point.Fn.ORDER`);
    return N;
  }
  function M() {
    if (D)
      throw new Error('"recovered" sig type is not supported for cofactor >2 curves');
  }
  function fe(j, N) {
    Xo(N);
    const G = T.signature, ee = N === "compact" ? G : N === "recovered" ? G + 1 : void 0;
    return ke(j, ee);
  }
  class ae {
    r;
    s;
    recovery;
    constructor(N, G, ee) {
      if (this.r = Z("r", N), this.s = Z("s", G), ee != null) {
        if (M(), ![0, 1, 2, 3].includes(ee))
          throw new Error("invalid recovery id");
        this.recovery = ee;
      }
      Object.freeze(this);
    }
    static fromBytes(N, G = L.format) {
      fe(N, G);
      let ee;
      if (G === "der") {
        const { r: oe, s: ne } = $t.toSig(ke(N));
        return new ae(oe, ne);
      }
      G === "recovered" && (ee = N[0], G = "compact", N = N.subarray(1));
      const J = T.signature / 2, Q = N.subarray(0, J), W = N.subarray(J, J * 2);
      return new ae(f.fromBytes(Q), f.fromBytes(W), ee);
    }
    static fromHex(N, G) {
      return this.fromBytes(Ne(N), G);
    }
    assertRecovery() {
      const { recovery: N } = this;
      if (N == null)
        throw new Error("invalid recovery id: must be present");
      return N;
    }
    addRecoveryBit(N) {
      return new ae(this.r, this.s, N);
    }
    recoverPublicKey(N) {
      const { r: G, s: ee } = this, J = this.assertRecovery(), Q = J === 2 || J === 3 ? G + p : G;
      if (!u.isValid(Q))
        throw new Error("invalid recovery id: sig.r+curve.n != R.x");
      const W = u.toBytes(Q), oe = e.fromBytes(Je(Fa((J & 1) === 0), W)), ne = f.inv(Q), Ie = de(ke(N, void 0, "msgHash")), Ee = f.create(-Ie * ne), ge = f.create(ee * ne), xe = e.BASE.multiplyUnsafe(Ee).add(oe.multiplyUnsafe(ge));
      if (xe.is0())
        throw new Error("invalid recovery: point at infinify");
      return xe.assertValidity(), xe;
    }
    // Signatures should be low-s, to prevent malleability.
    hasHighS() {
      return F(this.s);
    }
    toBytes(N = L.format) {
      if (Xo(N), N === "der")
        return Ne($t.hexFromSig(this));
      const { r: G, s: ee } = this, J = f.toBytes(G), Q = f.toBytes(ee);
      return N === "recovered" ? (M(), Je(Uint8Array.of(this.assertRecovery()), J, Q)) : Je(J, Q);
    }
    toHex(N) {
      return Pe(this.toBytes(N));
    }
  }
  const Ke = r.bits2int || function(N) {
    if (N.length > 8192)
      throw new Error("input is too large");
    const G = Vn(N), ee = N.length * 8 - h;
    return ee > 0 ? G >> BigInt(ee) : G;
  }, de = r.bits2int_modN || function(N) {
    return f.create(Ke(N));
  }, ve = pi(h);
  function Be(j) {
    return Cl("num < 2^" + h, j, kt, ve), f.toBytes(j);
  }
  function le(j, N) {
    return ke(j, void 0, "message"), N ? ke(t(j), void 0, "prehashed message") : j;
  }
  function De(j, N, G) {
    const { lowS: ee, prehash: J, extraEntropy: Q } = Ko(G, L);
    j = le(j, J);
    const W = de(j), oe = f.fromBytes(N);
    if (!f.isValidNot0(oe))
      throw new Error("invalid private key");
    const ne = [Be(oe), Be(W)];
    if (Q != null && Q !== !1) {
      const xe = Q === !0 ? o(T.secretKey) : Q;
      ne.push(ke(xe, void 0, "extraEntropy"));
    }
    const Ie = Je(...ne), Ee = W;
    function ge(xe) {
      const Te = Ke(xe);
      if (!f.isValidNot0(Te))
        return;
      const We = f.inv(Te), Ce = e.BASE.multiply(Te).toAffine(), X = f.create(Ce.x);
      if (X === kt)
        return;
      const Ft = f.create(We * f.create(Ee + X * oe));
      if (Ft === kt)
        return;
      let _e = (Ce.x === X ? 0 : 2) | Number(Ce.y & vn), Rt = Ft;
      return ee && F(Ft) && (Rt = f.neg(Ft), _e ^= 1), new ae(X, Rt, D ? void 0 : _e);
    }
    return { seed: Ie, k2sig: ge };
  }
  function Oe(j, N, G = {}) {
    const { seed: ee, k2sig: J } = De(j, N, G);
    return Pl(t.outputLen, f.BYTES, s)(ee, J).toBytes(G.format);
  }
  function se(j, N, G, ee = {}) {
    const { lowS: J, prehash: Q, format: W } = Ko(ee, L);
    if (G = ke(G, void 0, "publicKey"), N = le(N, Q), !fi(j)) {
      const oe = j instanceof ae ? ", use sig.toBytes()" : "";
      throw new Error("verify expects Uint8Array signature" + oe);
    }
    fe(j, W);
    try {
      const oe = ae.fromBytes(j, W), ne = e.fromBytes(G);
      if (J && oe.hasHighS())
        return !1;
      const { r: Ie, s: Ee } = oe, ge = de(N), xe = f.inv(Ee), Te = f.create(ge * xe), We = f.create(Ie * xe), Ce = e.BASE.multiplyUnsafe(Te).add(ne.multiplyUnsafe(We));
      return Ce.is0() ? !1 : f.create(Ce.x) === Ie;
    } catch {
      return !1;
    }
  }
  function K(j, N, G = {}) {
    const { prehash: ee } = Ko(G, L);
    return N = le(N, ee), ae.fromBytes(j, "recovered").recoverPublicKey(N).toBytes();
  }
  return Object.freeze({
    keygen: m,
    getPublicKey: v,
    getSharedSecret: w,
    utils: P,
    lengths: T,
    Point: e,
    sign: Oe,
    verify: se,
    recoverPublicKey: K,
    Signature: ae,
    hash: t
  });
}
const Vr = {
  p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: BigInt(1),
  a: BigInt(0),
  b: BigInt(7),
  Gx: BigInt("0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"),
  Gy: BigInt("0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8")
}, ef = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  basises: [
    [BigInt("0x3086d221a7d46bcde86c90e49284eb15"), -BigInt("0xe4437ed6010e88286f547fa90abfe4c3")],
    [BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), BigInt("0x3086d221a7d46bcde86c90e49284eb15")]
  ]
}, tf = /* @__PURE__ */ BigInt(0), Jo = /* @__PURE__ */ BigInt(2);
function nf(e) {
  const t = Vr.p, r = BigInt(3), o = BigInt(6), s = BigInt(11), u = BigInt(22), f = BigInt(23), p = BigInt(44), h = BigInt(88), m = e * e * e % t, v = m * m * e % t, w = ot(v, r, t) * v % t, P = ot(w, r, t) * v % t, T = ot(P, Jo, t) * m % t, L = ot(T, s, t) * T % t, D = ot(L, u, t) * L % t, F = ot(D, p, t) * D % t, Z = ot(F, h, t) * F % t, M = ot(Z, p, t) * D % t, fe = ot(M, r, t) * v % t, ae = ot(fe, f, t) * L % t, Ke = ot(ae, o, t) * m % t, de = ot(Ke, Jo, t);
  if (!Dr.eql(Dr.sqr(de), e))
    throw new Error("Cannot find square root");
  return de;
}
const Dr = Hr(Vr.p, { sqrt: nf }), an = /* @__PURE__ */ Xl(Vr, {
  Fp: Dr,
  endo: ef
}), mi = /* @__PURE__ */ Ql(an, pt), Hs = {};
function qr(e, ...t) {
  let r = Hs[e];
  if (r === void 0) {
    const o = pt(Il(e));
    r = Je(o, o), Hs[e] = r;
  }
  return pt(Je(r, ...t));
}
const vi = (e) => e.toBytes(!0).slice(1), wi = (e) => e % Jo === tf;
function Qo(e) {
  const { Fn: t, BASE: r } = an, o = t.fromBytes(e), s = r.multiply(o);
  return { scalar: wi(s.y) ? o : t.neg(o), bytes: vi(s) };
}
function Va(e) {
  const t = Dr;
  if (!t.isValidNot0(e))
    throw new Error("invalid x: Fail if x ≥ p");
  const r = t.create(e * e), o = t.create(r * e + BigInt(7));
  let s = t.sqrt(o);
  wi(s) || (s = t.neg(s));
  const u = an.fromAffine({ x: e, y: s });
  return u.assertValidity(), u;
}
const jn = Vn;
function za(...e) {
  return an.Fn.create(jn(qr("BIP0340/challenge", ...e)));
}
function Vs(e) {
  return Qo(e).bytes;
}
function rf(e, t, r = An(32)) {
  const { Fn: o } = an, s = ke(e, void 0, "message"), { bytes: u, scalar: f } = Qo(t), p = ke(r, 32, "auxRand"), h = o.toBytes(f ^ jn(qr("BIP0340/aux", p))), m = qr("BIP0340/nonce", h, u, s), { bytes: v, scalar: w } = Qo(m), P = za(v, u, s), T = new Uint8Array(64);
  if (T.set(v, 0), T.set(o.toBytes(o.create(w + P * f)), 32), !Za(T, s, u))
    throw new Error("sign: Invalid signature produced");
  return T;
}
function Za(e, t, r) {
  const { Fp: o, Fn: s, BASE: u } = an, f = ke(e, 64, "signature"), p = ke(t, void 0, "message"), h = ke(r, 32, "publicKey");
  try {
    const m = Va(jn(h)), v = jn(f.subarray(0, 32));
    if (!o.isValidNot0(v))
      return !1;
    const w = jn(f.subarray(32, 64));
    if (!s.isValidNot0(w))
      return !1;
    const P = za(s.toBytes(v), vi(m), p), T = u.multiplyUnsafe(w).add(m.multiplyUnsafe(s.neg(P))), { x: L, y: D } = T.toAffine();
    return !(T.is0() || !wi(D) || L !== v);
  } catch {
    return !1;
  }
}
const Un = /* @__PURE__ */ (() => {
  const r = (o = An(48)) => qa(o, Vr.n);
  return {
    keygen: Ua(r, Vs),
    getPublicKey: Vs,
    sign: rf,
    verify: Za,
    Point: an,
    utils: {
      randomSecretKey: r,
      taggedHash: qr,
      lift_x: Va,
      pointToBytes: vi
    },
    lengths: {
      secretKey: 32,
      publicKey: 32,
      publicKeyHasPrefix: !1,
      signature: 64,
      seed: 48
    }
  };
})();
function bi(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function of(e) {
  if (!bi(e))
    throw new Error("Uint8Array expected");
}
function Ga(e, t) {
  return Array.isArray(t) ? t.length === 0 ? !0 : e ? t.every((r) => typeof r == "string") : t.every((r) => Number.isSafeInteger(r)) : !1;
}
function sf(e) {
  if (typeof e != "function")
    throw new Error("function expected");
  return !0;
}
function sn(e, t) {
  if (typeof t != "string")
    throw new Error(`${e}: string expected`);
  return !0;
}
function Ei(e) {
  if (!Number.isSafeInteger(e))
    throw new Error(`invalid integer: ${e}`);
}
function ei(e) {
  if (!Array.isArray(e))
    throw new Error("array expected");
}
function $r(e, t) {
  if (!Ga(!0, t))
    throw new Error(`${e}: array of strings expected`);
}
function Wa(e, t) {
  if (!Ga(!1, t))
    throw new Error(`${e}: array of numbers expected`);
}
// @__NO_SIDE_EFFECTS__
function Ya(...e) {
  const t = (u) => u, r = (u, f) => (p) => u(f(p)), o = e.map((u) => u.encode).reduceRight(r, t), s = e.map((u) => u.decode).reduce(r, t);
  return { encode: o, decode: s };
}
// @__NO_SIDE_EFFECTS__
function Xa(e) {
  const t = typeof e == "string" ? e.split("") : e, r = t.length;
  $r("alphabet", t);
  const o = new Map(t.map((s, u) => [s, u]));
  return {
    encode: (s) => (ei(s), s.map((u) => {
      if (!Number.isSafeInteger(u) || u < 0 || u >= r)
        throw new Error(`alphabet.encode: digit index outside alphabet "${u}". Allowed: ${e}`);
      return t[u];
    })),
    decode: (s) => (ei(s), s.map((u) => {
      sn("alphabet.decode", u);
      const f = o.get(u);
      if (f === void 0)
        throw new Error(`Unknown letter: "${u}". Allowed: ${e}`);
      return f;
    }))
  };
}
// @__NO_SIDE_EFFECTS__
function Ja(e = "") {
  return sn("join", e), {
    encode: (t) => ($r("join.decode", t), t.join(e)),
    decode: (t) => (sn("join.decode", t), t.split(e))
  };
}
// @__NO_SIDE_EFFECTS__
function af(e, t = "=") {
  return Ei(e), sn("padding", t), {
    encode(r) {
      for ($r("padding.encode", r); r.length * e % 8; )
        r.push(t);
      return r;
    },
    decode(r) {
      $r("padding.decode", r);
      let o = r.length;
      if (o * e % 8)
        throw new Error("padding: invalid, string should have whole number of bytes");
      for (; o > 0 && r[o - 1] === t; o--)
        if ((o - 1) * e % 8 === 0)
          throw new Error("padding: invalid, string has too much padding");
      return r.slice(0, o);
    }
  };
}
const Qa = (e, t) => t === 0 ? e : Qa(t, e % t), Kr = /* @__NO_SIDE_EFFECTS__ */ (e, t) => e + (t - Qa(e, t)), Rr = /* @__PURE__ */ (() => {
  let e = [];
  for (let t = 0; t < 40; t++)
    e.push(2 ** t);
  return e;
})();
function ti(e, t, r, o) {
  if (ei(e), t <= 0 || t > 32)
    throw new Error(`convertRadix2: wrong from=${t}`);
  if (r <= 0 || r > 32)
    throw new Error(`convertRadix2: wrong to=${r}`);
  if (/* @__PURE__ */ Kr(t, r) > 32)
    throw new Error(`convertRadix2: carry overflow from=${t} to=${r} carryBits=${/* @__PURE__ */ Kr(t, r)}`);
  let s = 0, u = 0;
  const f = Rr[t], p = Rr[r] - 1, h = [];
  for (const m of e) {
    if (Ei(m), m >= f)
      throw new Error(`convertRadix2: invalid data word=${m} from=${t}`);
    if (s = s << t | m, u + t > 32)
      throw new Error(`convertRadix2: carry overflow pos=${u} from=${t}`);
    for (u += t; u >= r; u -= r)
      h.push((s >> u - r & p) >>> 0);
    const v = Rr[u];
    if (v === void 0)
      throw new Error("invalid carry");
    s &= v - 1;
  }
  if (s = s << r - u & p, !o && u >= t)
    throw new Error("Excess padding");
  if (!o && s > 0)
    throw new Error(`Non-zero padding: ${s}`);
  return o && u > 0 && h.push(s >>> 0), h;
}
// @__NO_SIDE_EFFECTS__
function ec(e, t = !1) {
  if (Ei(e), e <= 0 || e > 32)
    throw new Error("radix2: bits should be in (0..32]");
  if (/* @__PURE__ */ Kr(8, e) > 32 || /* @__PURE__ */ Kr(e, 8) > 32)
    throw new Error("radix2: carry overflow");
  return {
    encode: (r) => {
      if (!bi(r))
        throw new Error("radix2.encode input should be Uint8Array");
      return ti(Array.from(r), 8, e, !t);
    },
    decode: (r) => (Wa("radix2.decode", r), Uint8Array.from(ti(r, e, 8, t)))
  };
}
function zs(e) {
  return sf(e), function(...t) {
    try {
      return e.apply(null, t);
    } catch {
    }
  };
}
const cf = typeof Uint8Array.from([]).toBase64 == "function" && typeof Uint8Array.fromBase64 == "function", uf = (e, t) => {
  sn("base64", e);
  const r = /^[A-Za-z0-9=+/]+$/, o = "base64";
  if (e.length > 0 && !r.test(e))
    throw new Error("invalid base64");
  return Uint8Array.fromBase64(e, { alphabet: o, lastChunkHandling: "strict" });
}, jt = cf ? {
  encode(e) {
    return of(e), e.toBase64();
  },
  decode(e) {
    return uf(e);
  }
} : /* @__PURE__ */ Ya(/* @__PURE__ */ ec(6), /* @__PURE__ */ Xa("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), /* @__PURE__ */ af(6), /* @__PURE__ */ Ja("")), ni = /* @__PURE__ */ Ya(/* @__PURE__ */ Xa("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), /* @__PURE__ */ Ja("")), Zs = [996825010, 642813549, 513874426, 1027748829, 705979059];
function Mn(e) {
  const t = e >> 25;
  let r = (e & 33554431) << 5;
  for (let o = 0; o < Zs.length; o++)
    (t >> o & 1) === 1 && (r ^= Zs[o]);
  return r;
}
function Gs(e, t, r = 1) {
  const o = e.length;
  let s = 1;
  for (let u = 0; u < o; u++) {
    const f = e.charCodeAt(u);
    if (f < 33 || f > 126)
      throw new Error(`Invalid prefix (${e})`);
    s = Mn(s) ^ f >> 5;
  }
  s = Mn(s);
  for (let u = 0; u < o; u++)
    s = Mn(s) ^ e.charCodeAt(u) & 31;
  for (let u of t)
    s = Mn(s) ^ u;
  for (let u = 0; u < 6; u++)
    s = Mn(s);
  return s ^= r, ni.encode(ti([s % Rr[30]], 30, 5, !1));
}
// @__NO_SIDE_EFFECTS__
function lf(e) {
  const t = e === "bech32" ? 1 : 734539939, r = /* @__PURE__ */ ec(5), o = r.decode, s = r.encode, u = zs(o);
  function f(w, P, T = 90) {
    sn("bech32.encode prefix", w), bi(P) && (P = Array.from(P)), Wa("bech32.encode", P);
    const L = w.length;
    if (L === 0)
      throw new TypeError(`Invalid prefix length ${L}`);
    const D = L + 7 + P.length;
    if (T !== !1 && D > T)
      throw new TypeError(`Length ${D} exceeds limit ${T}`);
    const F = w.toLowerCase(), Z = Gs(F, P, t);
    return `${F}1${ni.encode(P)}${Z}`;
  }
  function p(w, P = 90) {
    sn("bech32.decode input", w);
    const T = w.length;
    if (T < 8 || P !== !1 && T > P)
      throw new TypeError(`invalid string length: ${T} (${w}). Expected (8..${P})`);
    const L = w.toLowerCase();
    if (w !== L && w !== w.toUpperCase())
      throw new Error("String must be lowercase or uppercase");
    const D = L.lastIndexOf("1");
    if (D === 0 || D === -1)
      throw new Error('Letter "1" must be present between prefix and data only');
    const F = L.slice(0, D), Z = L.slice(D + 1);
    if (Z.length < 6)
      throw new Error("Data must be at least 6 characters long");
    const M = ni.decode(Z).slice(0, -6), fe = Gs(F, M, t);
    if (!Z.endsWith(fe))
      throw new Error(`Invalid checksum in ${w}: expected "${fe}"`);
    return { prefix: F, words: M };
  }
  const h = zs(p);
  function m(w) {
    const { prefix: P, words: T } = p(w, !1);
    return { prefix: P, words: T, bytes: o(T) };
  }
  function v(w, P) {
    return f(w, s(P));
  }
  return {
    encode: f,
    decode: p,
    encodeFromBytes: v,
    decodeToBytes: m,
    decodeUnsafe: h,
    fromWords: o,
    fromWordsUnsafe: u,
    toWords: s
  };
}
const _n = /* @__PURE__ */ lf("bech32");
function ff(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function Ws(e) {
  if (typeof e != "boolean")
    throw new Error(`boolean expected, not ${e}`);
}
function Uo(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error("positive integer expected, got " + e);
}
function Ye(e, t, r = "") {
  const o = ff(e), s = e?.length, u = t !== void 0;
  if (!o || u && s !== t) {
    const f = r && `"${r}" `, p = u ? ` of length ${t}` : "", h = o ? `length=${s}` : `type=${typeof e}`;
    throw new Error(f + "expected Uint8Array" + p + ", got " + h);
  }
  return e;
}
function ze(e) {
  return new Uint32Array(e.buffer, e.byteOffset, Math.floor(e.byteLength / 4));
}
function xn(...e) {
  for (let t = 0; t < e.length; t++)
    e[t].fill(0);
}
const df = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function hf(e, t) {
  return e.buffer === t.buffer && // best we can do, may fail with an obscure Proxy
  e.byteOffset < t.byteOffset + t.byteLength && // a starts before b end
  t.byteOffset < e.byteOffset + e.byteLength;
}
function tc(e, t) {
  if (hf(e, t) && e.byteOffset < t.byteOffset)
    throw new Error("complex overlap of input and output is not supported");
}
function pf(e, t) {
  if (t == null || typeof t != "object")
    throw new Error("options must be defined");
  return Object.assign(e, t);
}
function yf(e, t) {
  if (e.length !== t.length)
    return !1;
  let r = 0;
  for (let o = 0; o < e.length; o++)
    r |= e[o] ^ t[o];
  return r === 0;
}
const gf = /* @__NO_SIDE_EFFECTS__ */ (e, t) => {
  function r(o, ...s) {
    if (Ye(o, void 0, "key"), !df)
      throw new Error("Non little-endian hardware is not yet supported");
    if (e.nonceLength !== void 0) {
      const v = s[0];
      Ye(v, e.varSizeNonce ? void 0 : e.nonceLength, "nonce");
    }
    const u = e.tagLength;
    u && s[1] !== void 0 && Ye(s[1], void 0, "AAD");
    const f = t(o, ...s), p = (v, w) => {
      if (w !== void 0) {
        if (v !== 2)
          throw new Error("cipher output not supported");
        Ye(w, void 0, "output");
      }
    };
    let h = !1;
    return {
      encrypt(v, w) {
        if (h)
          throw new Error("cannot encrypt() twice with same key + nonce");
        return h = !0, Ye(v), p(f.encrypt.length, w), f.encrypt(v, w);
      },
      decrypt(v, w) {
        if (Ye(v), u && v.length < u)
          throw new Error('"ciphertext" expected length bigger than tagLength=' + u);
        return p(f.decrypt.length, w), f.decrypt(v, w);
      }
    };
  }
  return Object.assign(r, e), r;
};
function nc(e, t, r = !0) {
  if (t === void 0)
    return new Uint8Array(e);
  if (t.length !== e)
    throw new Error('"output" expected Uint8Array of length ' + e + ", got: " + t.length);
  if (r && !wn(t))
    throw new Error("invalid output, must be aligned");
  return t;
}
function wn(e) {
  return e.byteOffset % 4 === 0;
}
function on(e) {
  return Uint8Array.from(e);
}
const Ut = 16, mf = 283;
function vf(e) {
  if (![16, 24, 32].includes(e.length))
    throw new Error('"aes key" expected Uint8Array of length 16/24/32, got length=' + e.length);
}
function _i(e) {
  return e << 1 ^ mf & -(e >> 7);
}
function mn(e, t) {
  let r = 0;
  for (; t > 0; t >>= 1)
    r ^= e & -(t & 1), e = _i(e);
  return r;
}
const ri = /* @__PURE__ */ (() => {
  const e = new Uint8Array(256);
  for (let r = 0, o = 1; r < 256; r++, o ^= _i(o))
    e[r] = o;
  const t = new Uint8Array(256);
  t[0] = 99;
  for (let r = 0; r < 255; r++) {
    let o = e[255 - r];
    o |= o << 8, t[e[r]] = (o ^ o >> 4 ^ o >> 5 ^ o >> 6 ^ o >> 7 ^ 99) & 255;
  }
  return xn(e), t;
})(), wf = /* @__PURE__ */ ri.map((e, t) => ri.indexOf(t)), bf = (e) => e << 24 | e >>> 8, Mo = (e) => e << 8 | e >>> 24;
function rc(e, t) {
  if (e.length !== 256)
    throw new Error("Wrong sbox length");
  const r = new Uint32Array(256).map((m, v) => t(e[v])), o = r.map(Mo), s = o.map(Mo), u = s.map(Mo), f = new Uint32Array(256 * 256), p = new Uint32Array(256 * 256), h = new Uint16Array(256 * 256);
  for (let m = 0; m < 256; m++)
    for (let v = 0; v < 256; v++) {
      const w = m * 256 + v;
      f[w] = r[m] ^ o[v], p[w] = s[m] ^ u[v], h[w] = e[m] << 8 | e[v];
    }
  return { sbox: e, sbox2: h, T0: r, T1: o, T2: s, T3: u, T01: f, T23: p };
}
const xi = /* @__PURE__ */ rc(ri, (e) => mn(e, 3) << 24 | e << 16 | e << 8 | mn(e, 2)), oc = /* @__PURE__ */ rc(wf, (e) => mn(e, 11) << 24 | mn(e, 13) << 16 | mn(e, 9) << 8 | mn(e, 14)), Ef = /* @__PURE__ */ (() => {
  const e = new Uint8Array(16);
  for (let t = 0, r = 1; t < 16; t++, r = _i(r))
    e[t] = r;
  return e;
})();
function ic(e) {
  Ye(e);
  const t = e.length;
  vf(e);
  const { sbox2: r } = xi, o = [];
  wn(e) || o.push(e = on(e));
  const s = ze(e), u = s.length, f = (h) => ht(r, h, h, h, h), p = new Uint32Array(t + 28);
  p.set(s);
  for (let h = u; h < p.length; h++) {
    let m = p[h - 1];
    h % u === 0 ? m = f(bf(m)) ^ Ef[h / u - 1] : u > 6 && h % u === 4 && (m = f(m)), p[h] = p[h - u] ^ m;
  }
  return xn(...o), p;
}
function _f(e) {
  const t = ic(e), r = t.slice(), o = t.length, { sbox2: s } = xi, { T0: u, T1: f, T2: p, T3: h } = oc;
  for (let m = 0; m < o; m += 4)
    for (let v = 0; v < 4; v++)
      r[m + v] = t[o - m - 4 + v];
  xn(t);
  for (let m = 4; m < o - 4; m++) {
    const v = r[m], w = ht(s, v, v, v, v);
    r[m] = u[w & 255] ^ f[w >>> 8 & 255] ^ p[w >>> 16 & 255] ^ h[w >>> 24];
  }
  return r;
}
function Kt(e, t, r, o, s, u) {
  return e[r << 8 & 65280 | o >>> 8 & 255] ^ t[s >>> 8 & 65280 | u >>> 24 & 255];
}
function ht(e, t, r, o, s) {
  return e[t & 255 | r & 65280] | e[o >>> 16 & 255 | s >>> 16 & 65280] << 16;
}
function Ys(e, t, r, o, s) {
  const { sbox2: u, T01: f, T23: p } = xi;
  let h = 0;
  t ^= e[h++], r ^= e[h++], o ^= e[h++], s ^= e[h++];
  const m = e.length / 4 - 2;
  for (let L = 0; L < m; L++) {
    const D = e[h++] ^ Kt(f, p, t, r, o, s), F = e[h++] ^ Kt(f, p, r, o, s, t), Z = e[h++] ^ Kt(f, p, o, s, t, r), M = e[h++] ^ Kt(f, p, s, t, r, o);
    t = D, r = F, o = Z, s = M;
  }
  const v = e[h++] ^ ht(u, t, r, o, s), w = e[h++] ^ ht(u, r, o, s, t), P = e[h++] ^ ht(u, o, s, t, r), T = e[h++] ^ ht(u, s, t, r, o);
  return { s0: v, s1: w, s2: P, s3: T };
}
function xf(e, t, r, o, s) {
  const { sbox2: u, T01: f, T23: p } = oc;
  let h = 0;
  t ^= e[h++], r ^= e[h++], o ^= e[h++], s ^= e[h++];
  const m = e.length / 4 - 2;
  for (let L = 0; L < m; L++) {
    const D = e[h++] ^ Kt(f, p, t, s, o, r), F = e[h++] ^ Kt(f, p, r, t, s, o), Z = e[h++] ^ Kt(f, p, o, r, t, s), M = e[h++] ^ Kt(f, p, s, o, r, t);
    t = D, r = F, o = Z, s = M;
  }
  const v = e[h++] ^ ht(u, t, s, o, r), w = e[h++] ^ ht(u, r, t, s, o), P = e[h++] ^ ht(u, o, r, t, s), T = e[h++] ^ ht(u, s, o, r, t);
  return { s0: v, s1: w, s2: P, s3: T };
}
function Af(e) {
  if (Ye(e), e.length % Ut !== 0)
    throw new Error("aes-(cbc/ecb).decrypt ciphertext should consist of blocks with size " + Ut);
}
function kf(e, t, r) {
  Ye(e);
  let o = e.length;
  const s = o % Ut;
  if (!t && s !== 0)
    throw new Error("aec/(cbc-ecb): unpadded plaintext with disabled padding");
  wn(e) || (e = on(e));
  const u = ze(e);
  if (t) {
    let p = Ut - s;
    p || (p = Ut), o = o + p;
  }
  r = nc(o, r), tc(e, r);
  const f = ze(r);
  return { b: u, o: f, out: r };
}
function Sf(e, t) {
  if (!t)
    return e;
  const r = e.length;
  if (!r)
    throw new Error("aes/pcks5: empty ciphertext not allowed");
  const o = e[r - 1];
  if (o <= 0 || o > 16)
    throw new Error("aes/pcks5: wrong padding");
  const s = e.subarray(0, -o);
  for (let u = 0; u < o; u++)
    if (e[r - u - 1] !== o)
      throw new Error("aes/pcks5: wrong padding");
  return s;
}
function Rf(e) {
  const t = new Uint8Array(16), r = ze(t);
  t.set(e);
  const o = Ut - e.length;
  for (let s = Ut - o; s < Ut; s++)
    t[s] = o;
  return r;
}
const sc = /* @__PURE__ */ gf({ blockSize: 16, nonceLength: 16 }, function(t, r, o = {}) {
  const s = !o.disablePadding;
  return {
    encrypt(u, f) {
      const p = ic(t), { b: h, o: m, out: v } = kf(u, s, f);
      let w = r;
      const P = [p];
      wn(w) || P.push(w = on(w));
      const T = ze(w);
      let L = T[0], D = T[1], F = T[2], Z = T[3], M = 0;
      for (; M + 4 <= h.length; )
        L ^= h[M + 0], D ^= h[M + 1], F ^= h[M + 2], Z ^= h[M + 3], { s0: L, s1: D, s2: F, s3: Z } = Ys(p, L, D, F, Z), m[M++] = L, m[M++] = D, m[M++] = F, m[M++] = Z;
      if (s) {
        const fe = Rf(u.subarray(M * 4));
        L ^= fe[0], D ^= fe[1], F ^= fe[2], Z ^= fe[3], { s0: L, s1: D, s2: F, s3: Z } = Ys(p, L, D, F, Z), m[M++] = L, m[M++] = D, m[M++] = F, m[M++] = Z;
      }
      return xn(...P), v;
    },
    decrypt(u, f) {
      Af(u);
      const p = _f(t);
      let h = r;
      const m = [p];
      wn(h) || m.push(h = on(h));
      const v = ze(h);
      f = nc(u.length, f), wn(u) || m.push(u = on(u)), tc(u, f);
      const w = ze(u), P = ze(f);
      let T = v[0], L = v[1], D = v[2], F = v[3];
      for (let Z = 0; Z + 4 <= w.length; ) {
        const M = T, fe = L, ae = D, Ke = F;
        T = w[Z + 0], L = w[Z + 1], D = w[Z + 2], F = w[Z + 3];
        const { s0: de, s1: ve, s2: Be, s3: le } = xf(p, T, L, D, F);
        P[Z++] = de ^ M, P[Z++] = ve ^ fe, P[Z++] = Be ^ ae, P[Z++] = le ^ Ke;
      }
      return xn(...m), Sf(f, s);
    }
  };
}), ac = (e) => Uint8Array.from(e.split(""), (t) => t.charCodeAt(0)), Bf = ac("expand 16-byte k"), Of = ac("expand 32-byte k"), If = ze(Bf), Tf = ze(Of);
function be(e, t) {
  return e << t | e >>> 32 - t;
}
function oi(e) {
  return e.byteOffset % 4 === 0;
}
const Ar = 64, Cf = 16, cc = 2 ** 32 - 1, Xs = Uint32Array.of();
function Lf(e, t, r, o, s, u, f, p) {
  const h = s.length, m = new Uint8Array(Ar), v = ze(m), w = oi(s) && oi(u), P = w ? ze(s) : Xs, T = w ? ze(u) : Xs;
  for (let L = 0; L < h; f++) {
    if (e(t, r, o, v, f, p), f >= cc)
      throw new Error("arx: counter overflow");
    const D = Math.min(Ar, h - L);
    if (w && D === Ar) {
      const F = L / 4;
      if (L % 4 !== 0)
        throw new Error("arx: invalid block position");
      for (let Z = 0, M; Z < Cf; Z++)
        M = F + Z, T[M] = P[M] ^ v[Z];
      L += Ar;
      continue;
    }
    for (let F = 0, Z; F < D; F++)
      Z = L + F, u[Z] = s[Z] ^ m[F];
    L += D;
  }
}
function Pf(e, t) {
  const { allowShortKeys: r, extendNonceFn: o, counterLength: s, counterRight: u, rounds: f } = pf({ allowShortKeys: !1, counterLength: 8, counterRight: !1, rounds: 20 }, t);
  if (typeof e != "function")
    throw new Error("core must be a function");
  return Uo(s), Uo(f), Ws(u), Ws(r), (p, h, m, v, w = 0) => {
    Ye(p, void 0, "key"), Ye(h, void 0, "nonce"), Ye(m, void 0, "data");
    const P = m.length;
    if (v === void 0 && (v = new Uint8Array(P)), Ye(v, void 0, "output"), Uo(w), w < 0 || w >= cc)
      throw new Error("arx: counter overflow");
    if (v.length < P)
      throw new Error(`arx: output (${v.length}) is shorter than data (${P})`);
    const T = [];
    let L = p.length, D, F;
    if (L === 32)
      T.push(D = on(p)), F = Tf;
    else if (L === 16 && r)
      D = new Uint8Array(32), D.set(p), D.set(p, 16), F = If, T.push(D);
    else
      throw Ye(p, 32, "arx key"), new Error("invalid key size");
    oi(h) || T.push(h = on(h));
    const Z = ze(D);
    if (o) {
      if (h.length !== 24)
        throw new Error("arx: extended nonce must be 24 bytes");
      o(F, Z, ze(h.subarray(0, 16)), Z), h = h.subarray(16);
    }
    const M = 16 - s;
    if (M !== h.length)
      throw new Error(`arx: nonce must be ${M} or 16 bytes`);
    if (M !== 12) {
      const ae = new Uint8Array(12);
      ae.set(h, u ? 0 : 12 - h.length), h = ae, T.push(h);
    }
    const fe = ze(h);
    return Lf(e, F, Z, fe, m, v, w, f), xn(...T), v;
  };
}
function Nf(e, t, r, o, s, u = 20) {
  let f = e[0], p = e[1], h = e[2], m = e[3], v = t[0], w = t[1], P = t[2], T = t[3], L = t[4], D = t[5], F = t[6], Z = t[7], M = s, fe = r[0], ae = r[1], Ke = r[2], de = f, ve = p, Be = h, le = m, De = v, Oe = w, se = P, K = T, j = L, N = D, G = F, ee = Z, J = M, Q = fe, W = ae, oe = Ke;
  for (let Ie = 0; Ie < u; Ie += 2)
    de = de + De | 0, J = be(J ^ de, 16), j = j + J | 0, De = be(De ^ j, 12), de = de + De | 0, J = be(J ^ de, 8), j = j + J | 0, De = be(De ^ j, 7), ve = ve + Oe | 0, Q = be(Q ^ ve, 16), N = N + Q | 0, Oe = be(Oe ^ N, 12), ve = ve + Oe | 0, Q = be(Q ^ ve, 8), N = N + Q | 0, Oe = be(Oe ^ N, 7), Be = Be + se | 0, W = be(W ^ Be, 16), G = G + W | 0, se = be(se ^ G, 12), Be = Be + se | 0, W = be(W ^ Be, 8), G = G + W | 0, se = be(se ^ G, 7), le = le + K | 0, oe = be(oe ^ le, 16), ee = ee + oe | 0, K = be(K ^ ee, 12), le = le + K | 0, oe = be(oe ^ le, 8), ee = ee + oe | 0, K = be(K ^ ee, 7), de = de + Oe | 0, oe = be(oe ^ de, 16), G = G + oe | 0, Oe = be(Oe ^ G, 12), de = de + Oe | 0, oe = be(oe ^ de, 8), G = G + oe | 0, Oe = be(Oe ^ G, 7), ve = ve + se | 0, J = be(J ^ ve, 16), ee = ee + J | 0, se = be(se ^ ee, 12), ve = ve + se | 0, J = be(J ^ ve, 8), ee = ee + J | 0, se = be(se ^ ee, 7), Be = Be + K | 0, Q = be(Q ^ Be, 16), j = j + Q | 0, K = be(K ^ j, 12), Be = Be + K | 0, Q = be(Q ^ Be, 8), j = j + Q | 0, K = be(K ^ j, 7), le = le + De | 0, W = be(W ^ le, 16), N = N + W | 0, De = be(De ^ N, 12), le = le + De | 0, W = be(W ^ le, 8), N = N + W | 0, De = be(De ^ N, 7);
  let ne = 0;
  o[ne++] = f + de | 0, o[ne++] = p + ve | 0, o[ne++] = h + Be | 0, o[ne++] = m + le | 0, o[ne++] = v + De | 0, o[ne++] = w + Oe | 0, o[ne++] = P + se | 0, o[ne++] = T + K | 0, o[ne++] = L + j | 0, o[ne++] = D + N | 0, o[ne++] = F + G | 0, o[ne++] = Z + ee | 0, o[ne++] = M + J | 0, o[ne++] = fe + Q | 0, o[ne++] = ae + W | 0, o[ne++] = Ke + oe | 0;
}
const uc = /* @__PURE__ */ Pf(Nf, {
  counterRight: !1,
  counterLength: 4,
  allowShortKeys: !1
});
function Df(e, t, r) {
  return Fr(e), r === void 0 && (r = new Uint8Array(e.outputLen)), zn(e, r, t);
}
const jo = /* @__PURE__ */ Uint8Array.of(0), Js = /* @__PURE__ */ Uint8Array.of();
function qf(e, t, r, o = 32) {
  Fr(e), Mt(o, "length");
  const s = e.outputLen;
  if (o > 255 * s)
    throw new Error("Length must be <= 255*HashLen");
  const u = Math.ceil(o / s);
  r === void 0 ? r = Js : ke(r, void 0, "info");
  const f = new Uint8Array(u * s), p = zn.create(e, t), h = p._cloneInto(), m = new Uint8Array(p.outputLen);
  for (let v = 0; v < u; v++)
    jo[0] = v + 1, h.update(v === 0 ? Js : m).update(r).update(jo).digestInto(m), f.set(m, s * v), p._cloneInto(h);
  return p.destroy(), h.destroy(), Fn(m, jo), f.slice(0, o);
}
var $f = Object.defineProperty, Re = (e, t) => {
  for (var r in t)
    $f(e, r, { get: t[r], enumerable: !0 });
}, gn = Symbol("verified"), Kf = (e) => e instanceof Object;
function kn(e) {
  if (!Kf(e) || typeof e.kind != "number" || typeof e.content != "string" || typeof e.created_at != "number" || typeof e.pubkey != "string" || !e.pubkey.match(/^[a-f0-9]{64}$/) || !Array.isArray(e.tags))
    return !1;
  for (let t = 0; t < e.tags.length; t++) {
    let r = e.tags[t];
    if (!Array.isArray(r))
      return !1;
    for (let o = 0; o < r.length; o++)
      if (typeof r[o] != "string")
        return !1;
  }
  return !0;
}
var Uf = {};
Re(Uf, {
  binarySearch: () => Ai,
  bytesToHex: () => Pe,
  hexToBytes: () => Ne,
  insertEventIntoAscendingList: () => Ff,
  insertEventIntoDescendingList: () => jf,
  mergeReverseSortedLists: () => Hf,
  normalizeURL: () => Mf,
  utf8Decoder: () => St,
  utf8Encoder: () => it
});
var St = new TextDecoder("utf-8"), it = new TextEncoder();
function Mf(e) {
  try {
    e.indexOf("://") === -1 && (e = "wss://" + e);
    let t = new URL(e);
    return t.protocol === "http:" ? t.protocol = "ws:" : t.protocol === "https:" && (t.protocol = "wss:"), t.pathname = t.pathname.replace(/\/+/g, "/"), t.pathname.endsWith("/") && (t.pathname = t.pathname.slice(0, -1)), (t.port === "80" && t.protocol === "ws:" || t.port === "443" && t.protocol === "wss:") && (t.port = ""), t.searchParams.sort(), t.hash = "", t.toString();
  } catch {
    throw new Error(`Invalid URL: ${e}`);
  }
}
function jf(e, t) {
  const [r, o] = Ai(e, (s) => t.id === s.id ? 0 : t.created_at === s.created_at ? -1 : s.created_at - t.created_at);
  return o || e.splice(r, 0, t), e;
}
function Ff(e, t) {
  const [r, o] = Ai(e, (s) => t.id === s.id ? 0 : t.created_at === s.created_at ? -1 : t.created_at - s.created_at);
  return o || e.splice(r, 0, t), e;
}
function Ai(e, t) {
  let r = 0, o = e.length - 1;
  for (; r <= o; ) {
    const s = Math.floor((r + o) / 2), u = t(e[s]);
    if (u === 0)
      return [s, !0];
    u < 0 ? o = s - 1 : r = s + 1;
  }
  return [r, !1];
}
function Hf(e, t) {
  const r = new Array(e.length + t.length);
  r.length = 0;
  let o = 0, s = 0, u = [];
  for (; o < e.length && s < t.length; ) {
    let f;
    if (e[o]?.created_at > t[s]?.created_at ? (f = e[o], o++) : (f = t[s], s++), r.length > 0 && r[r.length - 1].created_at === f.created_at) {
      if (u.includes(f.id))
        continue;
    } else
      u.length = 0;
    r.push(f), u.push(f.id);
  }
  for (; o < e.length; ) {
    const f = e[o];
    if (o++, r.length > 0 && r[r.length - 1].created_at === f.created_at) {
      if (u.includes(f.id))
        continue;
    } else
      u.length = 0;
    r.push(f), u.push(f.id);
  }
  for (; s < t.length; ) {
    const f = t[s];
    if (s++, r.length > 0 && r[r.length - 1].created_at === f.created_at) {
      if (u.includes(f.id))
        continue;
    } else
      u.length = 0;
    r.push(f), u.push(f.id);
  }
  return r;
}
var Vf = class {
  generateSecretKey() {
    return Un.utils.randomSecretKey();
  }
  getPublicKey(e) {
    return Pe(Un.getPublicKey(e));
  }
  finalizeEvent(e, t) {
    const r = e;
    return r.pubkey = Pe(Un.getPublicKey(t)), r.id = Br(r), r.sig = Pe(Un.sign(Ne(Br(r)), t)), r[gn] = !0, r;
  }
  verifyEvent(e) {
    if (typeof e[gn] == "boolean")
      return e[gn];
    try {
      const t = Br(e);
      if (t !== e.id)
        return e[gn] = !1, !1;
      const r = Un.verify(Ne(e.sig), Ne(t), Ne(e.pubkey));
      return e[gn] = r, r;
    } catch {
      return e[gn] = !1, !1;
    }
  }
};
function zf(e) {
  if (!kn(e))
    throw new Error("can't serialize event with wrong or missing properties");
  return JSON.stringify([0, e.pubkey, e.created_at, e.kind, e.tags, e.content]);
}
function Br(e) {
  let t = pt(it.encode(zf(e)));
  return Pe(t);
}
var zr = new Vf(), Zf = zr.generateSecretKey, ki = zr.getPublicKey, yt = zr.finalizeEvent, Zn = zr.verifyEvent, Gf = {};
Re(Gf, {
  Application: () => sh,
  BadgeAward: () => nd,
  BadgeDefinition: () => Qd,
  BlockedRelaysList: () => Nd,
  BlossomServerList: () => jd,
  BookmarkList: () => Cd,
  Bookmarksets: () => Yd,
  Calendar: () => hh,
  CalendarEventRSVP: () => ph,
  ChannelCreation: () => yc,
  ChannelHideMessage: () => vc,
  ChannelMessage: () => mc,
  ChannelMetadata: () => gc,
  ChannelMuteUser: () => wc,
  ChatMessage: () => rd,
  ClassifiedListing: () => uh,
  ClientAuth: () => Ec,
  Comment: () => dd,
  CommunitiesList: () => Ld,
  CommunityDefinition: () => vh,
  CommunityPostApproval: () => bd,
  Contacts: () => Qf,
  CreateOrUpdateProduct: () => nh,
  CreateOrUpdateStall: () => th,
  Curationsets: () => Xd,
  Date: () => fh,
  DirectMessageRelaysList: () => Ud,
  DraftClassifiedListing: () => lh,
  DraftLong: () => oh,
  Emojisets: () => ih,
  EncryptedDirectMessage: () => ed,
  EventDeletion: () => td,
  FavoriteRelays: () => qd,
  FileMessage: () => id,
  FileMetadata: () => fd,
  FileServerPreference: () => Md,
  Followsets: () => Zd,
  ForumThread: () => od,
  GenericRepost: () => Ii,
  Genericlists: () => Gd,
  GiftWrap: () => bc,
  GroupMetadata: () => wh,
  HTTPAuth: () => Ti,
  Handlerinformation: () => mh,
  Handlerrecommendation: () => gh,
  Highlights: () => Rd,
  InterestsList: () => $d,
  Interestsets: () => eh,
  JobFeedback: () => xd,
  JobRequest: () => Ed,
  JobResult: () => _d,
  Label: () => wd,
  LightningPubRPC: () => Hd,
  LiveChatMessage: () => hd,
  LiveEvent: () => ah,
  LongFormArticle: () => rh,
  Metadata: () => Xf,
  Mutelist: () => Od,
  NWCWalletInfo: () => Fd,
  NWCWalletRequest: () => _c,
  NWCWalletResponse: () => Vd,
  NormalVideo: () => ad,
  NostrConnect: () => zd,
  OpenTimestamps: () => ud,
  Photo: () => sd,
  Pinlist: () => Id,
  Poll: () => ld,
  PollResponse: () => Bd,
  PrivateDirectMessage: () => pc,
  ProblemTracker: () => gd,
  ProfileBadges: () => Jd,
  PublicChatsList: () => Pd,
  Reaction: () => Oi,
  RecommendRelay: () => Jf,
  RelayList: () => Td,
  RelayReview: () => yh,
  Relaysets: () => Wd,
  Report: () => md,
  Reporting: () => vd,
  Repost: () => Bi,
  Seal: () => hc,
  SearchRelaysList: () => Dd,
  ShortTextNote: () => dc,
  ShortVideo: () => cd,
  Time: () => dh,
  UserEmojiList: () => Kd,
  UserStatuses: () => ch,
  Voice: () => pd,
  VoiceComment: () => yd,
  Zap: () => Sd,
  ZapGoal: () => Ad,
  ZapRequest: () => kd,
  classifyKind: () => Wf,
  isAddressableKind: () => Ri,
  isEphemeralKind: () => fc,
  isKind: () => Yf,
  isRegularKind: () => lc,
  isReplaceableKind: () => Si
});
function lc(e) {
  return e < 1e4 && e !== 0 && e !== 3;
}
function Si(e) {
  return e === 0 || e === 3 || 1e4 <= e && e < 2e4;
}
function fc(e) {
  return 2e4 <= e && e < 3e4;
}
function Ri(e) {
  return 3e4 <= e && e < 4e4;
}
function Wf(e) {
  return lc(e) ? "regular" : Si(e) ? "replaceable" : fc(e) ? "ephemeral" : Ri(e) ? "parameterized" : "unknown";
}
function Yf(e, t) {
  const r = t instanceof Array ? t : [t];
  return kn(e) && r.includes(e.kind) || !1;
}
var Xf = 0, dc = 1, Jf = 2, Qf = 3, ed = 4, td = 5, Bi = 6, Oi = 7, nd = 8, rd = 9, od = 11, hc = 13, pc = 14, id = 15, Ii = 16, sd = 20, ad = 21, cd = 22, yc = 40, gc = 41, mc = 42, vc = 43, wc = 44, ud = 1040, bc = 1059, ld = 1068, fd = 1063, dd = 1111, hd = 1311, pd = 1222, yd = 1244, gd = 1971, md = 1984, vd = 1984, wd = 1985, bd = 4550, Ed = 5999, _d = 6999, xd = 7e3, Ad = 9041, kd = 9734, Sd = 9735, Rd = 9802, Bd = 1018, Od = 1e4, Id = 10001, Td = 10002, Cd = 10003, Ld = 10004, Pd = 10005, Nd = 10006, Dd = 10007, qd = 10012, $d = 10015, Kd = 10030, Ud = 10050, Md = 10096, jd = 10063, Fd = 13194, Hd = 21e3, Ec = 22242, _c = 23194, Vd = 23195, zd = 24133, Ti = 27235, Zd = 3e4, Gd = 30001, Wd = 30002, Yd = 30003, Xd = 30004, Jd = 30008, Qd = 30009, eh = 30015, th = 30017, nh = 30018, rh = 30023, oh = 30024, ih = 30030, sh = 30078, ah = 30311, ch = 30315, uh = 30402, lh = 30403, fh = 31922, dh = 31923, hh = 31924, ph = 31925, yh = 31987, gh = 31989, mh = 31990, vh = 34550, wh = 39e3, bh = {};
Re(bh, {
  getHex64: () => Ci,
  getInt: () => xc,
  getSubscriptionId: () => Eh,
  matchEventId: () => _h,
  matchEventKind: () => Ah,
  matchEventPubkey: () => xh
});
function Ci(e, t) {
  let r = t.length + 3, o = e.indexOf(`"${t}":`) + r, s = e.slice(o).indexOf('"') + o + 1;
  return e.slice(s, s + 64);
}
function xc(e, t) {
  let r = t.length, o = e.indexOf(`"${t}":`) + r + 3, s = e.slice(o), u = Math.min(s.indexOf(","), s.indexOf("}"));
  return parseInt(s.slice(0, u), 10);
}
function Eh(e) {
  let t = e.slice(0, 22).indexOf('"EVENT"');
  if (t === -1)
    return null;
  let r = e.slice(t + 7 + 1).indexOf('"');
  if (r === -1)
    return null;
  let o = t + 7 + 1 + r, s = e.slice(o + 1, 80).indexOf('"');
  if (s === -1)
    return null;
  let u = o + 1 + s;
  return e.slice(o + 1, u);
}
function _h(e, t) {
  return t === Ci(e, "id");
}
function xh(e, t) {
  return t === Ci(e, "pubkey");
}
function Ah(e, t) {
  return t === xc(e, "kind");
}
var kh = {};
Re(kh, {
  makeAuthEvent: () => Sh
});
function Sh(e, t) {
  return {
    kind: Ec,
    created_at: Math.floor(Date.now() / 1e3),
    tags: [
      ["relay", e],
      ["challenge", t]
    ],
    content: ""
  };
}
var Rh;
try {
  Rh = WebSocket;
} catch {
}
var Bh;
try {
  Bh = WebSocket;
} catch {
}
var Oh = {};
Re(Oh, {
  BECH32_REGEX: () => Ac,
  Bech32MaxSize: () => Li,
  NostrTypeGuard: () => Ih,
  decode: () => Zr,
  decodeNostrURI: () => Ch,
  encodeBytes: () => Wr,
  naddrEncode: () => $h,
  neventEncode: () => qh,
  noteEncode: () => Nh,
  nprofileEncode: () => Dh,
  npubEncode: () => Ph,
  nsecEncode: () => Lh
});
var Ih = {
  isNProfile: (e) => /^nprofile1[a-z\d]+$/.test(e || ""),
  isNEvent: (e) => /^nevent1[a-z\d]+$/.test(e || ""),
  isNAddr: (e) => /^naddr1[a-z\d]+$/.test(e || ""),
  isNSec: (e) => /^nsec1[a-z\d]{58}$/.test(e || ""),
  isNPub: (e) => /^npub1[a-z\d]{58}$/.test(e || ""),
  isNote: (e) => /^note1[a-z\d]+$/.test(e || ""),
  isNcryptsec: (e) => /^ncryptsec1[a-z\d]+$/.test(e || "")
}, Li = 5e3, Ac = /[\x21-\x7E]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/;
function Th(e) {
  const t = new Uint8Array(4);
  return t[0] = e >> 24 & 255, t[1] = e >> 16 & 255, t[2] = e >> 8 & 255, t[3] = e & 255, t;
}
function Ch(e) {
  try {
    return e.startsWith("nostr:") && (e = e.substring(6)), Zr(e);
  } catch {
    return { type: "invalid", data: null };
  }
}
function Zr(e) {
  let { prefix: t, words: r } = _n.decode(e, Li), o = new Uint8Array(_n.fromWords(r));
  switch (t) {
    case "nprofile": {
      let s = Fo(o);
      if (!s[0]?.[0])
        throw new Error("missing TLV 0 for nprofile");
      if (s[0][0].length !== 32)
        throw new Error("TLV 0 should be 32 bytes");
      return {
        type: "nprofile",
        data: {
          pubkey: Pe(s[0][0]),
          relays: s[1] ? s[1].map((u) => St.decode(u)) : []
        }
      };
    }
    case "nevent": {
      let s = Fo(o);
      if (!s[0]?.[0])
        throw new Error("missing TLV 0 for nevent");
      if (s[0][0].length !== 32)
        throw new Error("TLV 0 should be 32 bytes");
      if (s[2] && s[2][0].length !== 32)
        throw new Error("TLV 2 should be 32 bytes");
      if (s[3] && s[3][0].length !== 4)
        throw new Error("TLV 3 should be 4 bytes");
      return {
        type: "nevent",
        data: {
          id: Pe(s[0][0]),
          relays: s[1] ? s[1].map((u) => St.decode(u)) : [],
          author: s[2]?.[0] ? Pe(s[2][0]) : void 0,
          kind: s[3]?.[0] ? parseInt(Pe(s[3][0]), 16) : void 0
        }
      };
    }
    case "naddr": {
      let s = Fo(o);
      if (!s[0]?.[0])
        throw new Error("missing TLV 0 for naddr");
      if (!s[2]?.[0])
        throw new Error("missing TLV 2 for naddr");
      if (s[2][0].length !== 32)
        throw new Error("TLV 2 should be 32 bytes");
      if (!s[3]?.[0])
        throw new Error("missing TLV 3 for naddr");
      if (s[3][0].length !== 4)
        throw new Error("TLV 3 should be 4 bytes");
      return {
        type: "naddr",
        data: {
          identifier: St.decode(s[0][0]),
          pubkey: Pe(s[2][0]),
          kind: parseInt(Pe(s[3][0]), 16),
          relays: s[1] ? s[1].map((u) => St.decode(u)) : []
        }
      };
    }
    case "nsec":
      return { type: t, data: o };
    case "npub":
    case "note":
      return { type: t, data: Pe(o) };
    default:
      throw new Error(`unknown prefix ${t}`);
  }
}
function Fo(e) {
  let t = {}, r = e;
  for (; r.length > 0; ) {
    let o = r[0], s = r[1], u = r.slice(2, 2 + s);
    if (r = r.slice(2 + s), u.length < s)
      throw new Error(`not enough data to read on TLV ${o}`);
    t[o] = t[o] || [], t[o].push(u);
  }
  return t;
}
function Lh(e) {
  return Wr("nsec", e);
}
function Ph(e) {
  return Wr("npub", Ne(e));
}
function Nh(e) {
  return Wr("note", Ne(e));
}
function Gr(e, t) {
  let r = _n.toWords(t);
  return _n.encode(e, r, Li);
}
function Wr(e, t) {
  return Gr(e, t);
}
function Dh(e) {
  let t = Pi({
    0: [Ne(e.pubkey)],
    1: (e.relays || []).map((r) => it.encode(r))
  });
  return Gr("nprofile", t);
}
function qh(e) {
  let t;
  e.kind !== void 0 && (t = Th(e.kind));
  let r = Pi({
    0: [Ne(e.id)],
    1: (e.relays || []).map((o) => it.encode(o)),
    2: e.author ? [Ne(e.author)] : [],
    3: t ? [new Uint8Array(t)] : []
  });
  return Gr("nevent", r);
}
function $h(e) {
  let t = new ArrayBuffer(4);
  new DataView(t).setUint32(0, e.kind, !1);
  let r = Pi({
    0: [it.encode(e.identifier)],
    1: (e.relays || []).map((o) => it.encode(o)),
    2: [Ne(e.pubkey)],
    3: [new Uint8Array(t)]
  });
  return Gr("naddr", r);
}
function Pi(e) {
  let t = [];
  return Object.entries(e).reverse().forEach(([r, o]) => {
    o.forEach((s) => {
      let u = new Uint8Array(s.length + 2);
      u.set([parseInt(r)], 0), u.set([s.length], 1), u.set(s, 2), t.push(u);
    });
  }), Je(...t);
}
var Kh = {};
Re(Kh, {
  decrypt: () => Uh,
  encrypt: () => kc
});
function kc(e, t, r) {
  const o = e instanceof Uint8Array ? e : Ne(e), s = mi.getSharedSecret(o, Ne("02" + t)), u = Sc(s);
  let f = Uint8Array.from(An(16)), p = it.encode(r), h = sc(u, f).encrypt(p), m = jt.encode(new Uint8Array(h)), v = jt.encode(new Uint8Array(f.buffer));
  return `${m}?iv=${v}`;
}
function Uh(e, t, r) {
  const o = e instanceof Uint8Array ? e : Ne(e);
  let [s, u] = r.split("?iv="), f = mi.getSharedSecret(o, Ne("02" + t)), p = Sc(f), h = jt.decode(u), m = jt.decode(s), v = sc(p, h).decrypt(m);
  return St.decode(v);
}
function Sc(e) {
  return e.slice(1, 33);
}
var Mh = {};
Re(Mh, {
  NIP05_REGEX: () => Ni,
  isNip05: () => jh,
  isValid: () => Vh,
  queryProfile: () => Rc,
  searchDomain: () => Hh,
  useFetchImplementation: () => Fh
});
var Ni = /^(?:([\w.+-]+)@)?([\w_-]+(\.[\w_-]+)+)$/, jh = (e) => Ni.test(e || ""), Yr;
try {
  Yr = fetch;
} catch {
}
function Fh(e) {
  Yr = e;
}
async function Hh(e, t = "") {
  try {
    const r = `https://${e}/.well-known/nostr.json?name=${t}`, o = await Yr(r, { redirect: "manual" });
    if (o.status !== 200)
      throw Error("Wrong response code");
    return (await o.json()).names;
  } catch {
    return {};
  }
}
async function Rc(e) {
  const t = e.match(Ni);
  if (!t)
    return null;
  const [, r = "_", o] = t;
  try {
    const s = `https://${o}/.well-known/nostr.json?name=${r}`, u = await Yr(s, { redirect: "manual" });
    if (u.status !== 200)
      throw Error("Wrong response code");
    const f = await u.json(), p = f.names[r];
    return p ? { pubkey: p, relays: f.relays?.[p] } : null;
  } catch {
    return null;
  }
}
async function Vh(e, t) {
  const r = await Rc(t);
  return r ? r.pubkey === e : !1;
}
var zh = {};
Re(zh, {
  parse: () => Zh
});
function Zh(e) {
  const t = {
    reply: void 0,
    root: void 0,
    mentions: [],
    profiles: [],
    quotes: []
  };
  let r, o;
  for (let s = e.tags.length - 1; s >= 0; s--) {
    const u = e.tags[s];
    if (u[0] === "e" && u[1]) {
      const [f, p, h, m, v] = u, w = {
        id: p,
        relays: h ? [h] : [],
        author: v
      };
      if (m === "root") {
        t.root = w;
        continue;
      }
      if (m === "reply") {
        t.reply = w;
        continue;
      }
      if (m === "mention") {
        t.mentions.push(w);
        continue;
      }
      r ? o = w : r = w, t.mentions.push(w);
      continue;
    }
    if (u[0] === "q" && u[1]) {
      const [f, p, h] = u;
      t.quotes.push({
        id: p,
        relays: h ? [h] : []
      });
    }
    if (u[0] === "p" && u[1]) {
      t.profiles.push({
        pubkey: u[1],
        relays: u[2] ? [u[2]] : []
      });
      continue;
    }
  }
  return t.root || (t.root = o || r || t.reply), t.reply || (t.reply = r || t.root), [t.reply, t.root].forEach((s) => {
    if (!s)
      return;
    let u = t.mentions.indexOf(s);
    if (u !== -1 && t.mentions.splice(u, 1), s.author) {
      let f = t.profiles.find((p) => p.pubkey === s.author);
      f && f.relays && (s.relays || (s.relays = []), f.relays.forEach((p) => {
        s.relays?.indexOf(p) === -1 && s.relays.push(p);
      }), f.relays = s.relays);
    }
  }), t.mentions.forEach((s) => {
    if (s.author) {
      let u = t.profiles.find((f) => f.pubkey === s.author);
      u && u.relays && (s.relays || (s.relays = []), u.relays.forEach((f) => {
        s.relays.indexOf(f) === -1 && s.relays.push(f);
      }), u.relays = s.relays);
    }
  }), t;
}
var Gh = {};
Re(Gh, {
  fetchRelayInformation: () => Yh,
  useFetchImplementation: () => Wh
});
var Bc;
try {
  Bc = fetch;
} catch {
}
function Wh(e) {
  Bc = e;
}
async function Yh(e) {
  return await (await fetch(e.replace("ws://", "http://").replace("wss://", "https://"), {
    headers: { Accept: "application/nostr+json" }
  })).json();
}
var Xh = {};
Re(Xh, {
  getPow: () => Jh,
  minePow: () => ep
});
function Jh(e) {
  let t = 0;
  for (let r = 0; r < 64; r += 8) {
    const o = parseInt(e.substring(r, r + 8), 16);
    if (o === 0)
      t += 32;
    else {
      t += Math.clz32(o);
      break;
    }
  }
  return t;
}
function Qh(e) {
  let t = 0;
  for (let r = 0; r < e.length; r++) {
    const o = e[r];
    if (o === 0)
      t += 8;
    else {
      t += Math.clz32(o) - 24;
      break;
    }
  }
  return t;
}
function ep(e, t) {
  let r = 0;
  const o = e, s = ["nonce", r.toString(), t.toString()];
  for (o.tags.push(s); ; ) {
    const u = Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3);
    u !== o.created_at && (r = 0, o.created_at = u), s[1] = (++r).toString();
    const f = pt(
      it.encode(JSON.stringify([0, o.pubkey, o.created_at, o.kind, o.tags, o.content]))
    );
    if (Qh(f) >= t) {
      o.id = Pe(f);
      break;
    }
  }
  return o;
}
var tp = {};
Re(tp, {
  unwrapEvent: () => hp,
  unwrapManyEvents: () => pp,
  wrapEvent: () => Mc,
  wrapManyEvents: () => dp
});
var np = {};
Re(np, {
  createRumor: () => qc,
  createSeal: () => $c,
  createWrap: () => Kc,
  unwrapEvent: () => Ui,
  unwrapManyEvents: () => Uc,
  wrapEvent: () => Ur,
  wrapManyEvents: () => lp
});
var rp = {};
Re(rp, {
  decrypt: () => Ki,
  encrypt: () => $i,
  getConversationKey: () => Di,
  v2: () => cp
});
var Oc = 1, Ic = 65535;
function Di(e, t) {
  const r = mi.getSharedSecret(e, Ne("02" + t)).subarray(1, 33);
  return Df(pt, r, it.encode("nip44-v2"));
}
function Tc(e, t) {
  const r = qf(pt, e, t, 76);
  return {
    chacha_key: r.subarray(0, 32),
    chacha_nonce: r.subarray(32, 44),
    hmac_key: r.subarray(44, 76)
  };
}
function qi(e) {
  if (!Number.isSafeInteger(e) || e < 1)
    throw new Error("expected positive integer");
  if (e <= 32)
    return 32;
  const t = 1 << Math.floor(Math.log2(e - 1)) + 1, r = t <= 256 ? 32 : t / 8;
  return r * (Math.floor((e - 1) / r) + 1);
}
function op(e) {
  if (!Number.isSafeInteger(e) || e < Oc || e > Ic)
    throw new Error("invalid plaintext size: must be between 1 and 65535 bytes");
  const t = new Uint8Array(2);
  return new DataView(t.buffer).setUint16(0, e, !1), t;
}
function ip(e) {
  const t = it.encode(e), r = t.length, o = op(r), s = new Uint8Array(qi(r) - r);
  return Je(o, t, s);
}
function sp(e) {
  const t = new DataView(e.buffer).getUint16(0), r = e.subarray(2, 2 + t);
  if (t < Oc || t > Ic || r.length !== t || e.length !== 2 + qi(t))
    throw new Error("invalid padding");
  return St.decode(r);
}
function Cc(e, t, r) {
  if (r.length !== 32)
    throw new Error("AAD associated data must be 32 bytes");
  const o = Je(r, t);
  return zn(pt, e, o);
}
function ap(e) {
  if (typeof e != "string")
    throw new Error("payload must be a valid string");
  const t = e.length;
  if (t < 132 || t > 87472)
    throw new Error("invalid payload length: " + t);
  if (e[0] === "#")
    throw new Error("unknown encryption version");
  let r;
  try {
    r = jt.decode(e);
  } catch (u) {
    throw new Error("invalid base64: " + u.message);
  }
  const o = r.length;
  if (o < 99 || o > 65603)
    throw new Error("invalid data length: " + o);
  const s = r[0];
  if (s !== 2)
    throw new Error("unknown encryption version " + s);
  return {
    nonce: r.subarray(1, 33),
    ciphertext: r.subarray(33, -32),
    mac: r.subarray(-32)
  };
}
function $i(e, t, r = An(32)) {
  const { chacha_key: o, chacha_nonce: s, hmac_key: u } = Tc(t, r), f = ip(e), p = uc(o, s, f), h = Cc(u, p, r);
  return jt.encode(Je(new Uint8Array([2]), r, p, h));
}
function Ki(e, t) {
  const { nonce: r, ciphertext: o, mac: s } = ap(e), { chacha_key: u, chacha_nonce: f, hmac_key: p } = Tc(t, r), h = Cc(p, o, r);
  if (!yf(h, s))
    throw new Error("invalid MAC");
  const m = uc(u, f, o);
  return sp(m);
}
var cp = {
  utils: {
    getConversationKey: Di,
    calcPaddedLen: qi
  },
  encrypt: $i,
  decrypt: Ki
}, up = 2880 * 60, Lc = () => Math.round(Date.now() / 1e3), Pc = () => Math.round(Lc() - Math.random() * up), Nc = (e, t) => Di(e, t), Dc = (e, t, r) => $i(JSON.stringify(e), Nc(t, r)), Qs = (e, t) => JSON.parse(Ki(e.content, Nc(t, e.pubkey)));
function qc(e, t) {
  const r = {
    created_at: Lc(),
    content: "",
    tags: [],
    ...e,
    pubkey: ki(t)
  };
  return r.id = Br(r), r;
}
function $c(e, t, r) {
  return yt(
    {
      kind: hc,
      content: Dc(e, t, r),
      created_at: Pc(),
      tags: []
    },
    t
  );
}
function Kc(e, t) {
  const r = Zf();
  return yt(
    {
      kind: bc,
      content: Dc(e, r, t),
      created_at: Pc(),
      tags: [["p", t]]
    },
    r
  );
}
function Ur(e, t, r) {
  const o = qc(e, t), s = $c(o, t, r);
  return Kc(s, r);
}
function lp(e, t, r) {
  if (!r || r.length === 0)
    throw new Error("At least one recipient is required.");
  const o = ki(t), s = [Ur(e, t, o)];
  return r.forEach((u) => {
    s.push(Ur(e, t, u));
  }), s;
}
function Ui(e, t) {
  const r = Qs(e, t);
  return Qs(r, t);
}
function Uc(e, t) {
  let r = [];
  return e.forEach((o) => {
    r.push(Ui(o, t));
  }), r.sort((o, s) => o.created_at - s.created_at), r;
}
function fp(e, t, r, o) {
  const s = {
    created_at: Math.ceil(Date.now() / 1e3),
    kind: pc,
    tags: [],
    content: t
  };
  return (Array.isArray(e) ? e : [e]).forEach(({ publicKey: f, relayUrl: p }) => {
    s.tags.push(p ? ["p", f, p] : ["p", f]);
  }), o && s.tags.push(["e", o.eventId, o.relayUrl || "", "reply"]), r && s.tags.push(["subject", r]), s;
}
function Mc(e, t, r, o, s) {
  const u = fp(t, r, o, s);
  return Ur(u, e, t.publicKey);
}
function dp(e, t, r, o, s) {
  if (!t || t.length === 0)
    throw new Error("At least one recipient is required.");
  return [{ publicKey: ki(e) }, ...t].map(
    (f) => Mc(e, f, r, o, s)
  );
}
var hp = Ui, pp = Uc, yp = {};
Re(yp, {
  finishRepostEvent: () => gp,
  getRepostedEvent: () => mp,
  getRepostedEventPointer: () => jc
});
function gp(e, t, r, o) {
  let s;
  const u = [...e.tags ?? [], ["e", t.id, r], ["p", t.pubkey]];
  return t.kind === dc ? s = Bi : (s = Ii, u.push(["k", String(t.kind)])), yt(
    {
      kind: s,
      tags: u,
      content: e.content === "" || t.tags?.find((f) => f[0] === "-") ? "" : JSON.stringify(t),
      created_at: e.created_at
    },
    o
  );
}
function jc(e) {
  if (![Bi, Ii].includes(e.kind))
    return;
  let t, r;
  for (let o = e.tags.length - 1; o >= 0 && (t === void 0 || r === void 0); o--) {
    const s = e.tags[o];
    s.length >= 2 && (s[0] === "e" && t === void 0 ? t = s : s[0] === "p" && r === void 0 && (r = s));
  }
  if (t !== void 0)
    return {
      id: t[1],
      relays: [t[2], r?.[2]].filter((o) => typeof o == "string"),
      author: r?.[1]
    };
}
function mp(e, { skipVerification: t } = {}) {
  const r = jc(e);
  if (r === void 0 || e.content === "")
    return;
  let o;
  try {
    o = JSON.parse(e.content);
  } catch {
    return;
  }
  if (o.id === r.id && !(!t && !Zn(o)))
    return o;
}
var vp = {};
Re(vp, {
  NOSTR_URI_REGEX: () => Mi,
  parse: () => bp,
  test: () => wp
});
var Mi = new RegExp(`nostr:(${Ac.source})`);
function wp(e) {
  return typeof e == "string" && new RegExp(`^${Mi.source}$`).test(e);
}
function bp(e) {
  const t = e.match(new RegExp(`^${Mi.source}$`));
  if (!t)
    throw new Error(`Invalid Nostr URI: ${e}`);
  return {
    uri: t[0],
    value: t[1],
    decoded: Zr(t[1])
  };
}
var Ep = {};
Re(Ep, {
  finishReactionEvent: () => _p,
  getReactedEventPointer: () => xp
});
function _p(e, t, r) {
  const o = t.tags.filter((s) => s.length >= 2 && (s[0] === "e" || s[0] === "p"));
  return yt(
    {
      ...e,
      kind: Oi,
      tags: [...e.tags ?? [], ...o, ["e", t.id], ["p", t.pubkey]],
      content: e.content ?? "+"
    },
    r
  );
}
function xp(e) {
  if (e.kind !== Oi)
    return;
  let t, r;
  for (let o = e.tags.length - 1; o >= 0 && (t === void 0 || r === void 0); o--) {
    const s = e.tags[o];
    s.length >= 2 && (s[0] === "e" && t === void 0 ? t = s : s[0] === "p" && r === void 0 && (r = s));
  }
  if (!(t === void 0 || r === void 0))
    return {
      id: t[1],
      relays: [t[2], r[2]].filter((o) => o !== void 0),
      author: r[1]
    };
}
var Ap = {};
Re(Ap, {
  parse: () => Sp
});
var Ho = /\W/m, ea = /[^\w\/] |[^\w\/]$|$|,| /m, kp = 42;
function* Sp(e) {
  let t = [];
  if (typeof e != "string") {
    for (let u = 0; u < e.tags.length; u++) {
      const f = e.tags[u];
      f[0] === "emoji" && f.length >= 3 && t.push({ type: "emoji", shortcode: f[1], url: f[2] });
    }
    e = e.content;
  }
  const r = e.length;
  let o = 0, s = 0;
  e:
    for (; s < r; ) {
      const u = e.indexOf(":", s), f = e.indexOf("#", s);
      if (u === -1 && f === -1)
        break e;
      if (u === -1 || f >= 0 && f < u) {
        if (f === 0 || e[f - 1].match(Ho)) {
          const p = e.slice(f + 1, f + kp).match(Ho), h = p ? f + 1 + p.index : r;
          yield { type: "text", text: e.slice(o, f) }, yield { type: "hashtag", value: e.slice(f + 1, h) }, s = h, o = s;
          continue e;
        }
        s = f + 1;
        continue e;
      }
      if (e.slice(u - 5, u) === "nostr") {
        const p = e.slice(u + 60).match(Ho), h = p ? u + 60 + p.index : r;
        try {
          let m, { data: v, type: w } = Zr(e.slice(u + 1, h));
          switch (w) {
            case "npub":
              m = { pubkey: v };
              break;
            case "note":
              m = { id: v };
              break;
            case "nsec":
              s = h + 1;
              continue;
            default:
              m = v;
          }
          o !== u - 5 && (yield { type: "text", text: e.slice(o, u - 5) }), yield { type: "reference", pointer: m }, s = h, o = s;
          continue e;
        } catch {
          s = u + 1;
          continue e;
        }
      } else if (e.slice(u - 5, u) === "https" || e.slice(u - 4, u) === "http") {
        const p = e.slice(u + 4).match(ea), h = p ? u + 4 + p.index : r, m = e[u - 1] === "s" ? 5 : 4;
        try {
          let v = new URL(e.slice(u - m, h));
          if (v.hostname.indexOf(".") === -1)
            throw new Error("invalid url");
          if (o !== u - m && (yield { type: "text", text: e.slice(o, u - m) }), /\.(png|jpe?g|gif|webp|heic|svg)$/i.test(v.pathname)) {
            yield { type: "image", url: v.toString() }, s = h, o = s;
            continue e;
          }
          if (/\.(mp4|avi|webm|mkv|mov)$/i.test(v.pathname)) {
            yield { type: "video", url: v.toString() }, s = h, o = s;
            continue e;
          }
          if (/\.(mp3|aac|ogg|opus|wav|flac)$/i.test(v.pathname)) {
            yield { type: "audio", url: v.toString() }, s = h, o = s;
            continue e;
          }
          yield { type: "url", url: v.toString() }, s = h, o = s;
          continue e;
        } catch {
          s = h + 1;
          continue e;
        }
      } else if (e.slice(u - 3, u) === "wss" || e.slice(u - 2, u) === "ws") {
        const p = e.slice(u + 4).match(ea), h = p ? u + 4 + p.index : r, m = e[u - 1] === "s" ? 3 : 2;
        try {
          let v = new URL(e.slice(u - m, h));
          if (v.hostname.indexOf(".") === -1)
            throw new Error("invalid ws url");
          o !== u - m && (yield { type: "text", text: e.slice(o, u - m) }), yield { type: "relay", url: v.toString() }, s = h, o = s;
          continue e;
        } catch {
          s = h + 1;
          continue e;
        }
      } else {
        for (let p = 0; p < t.length; p++) {
          const h = t[p];
          if (e[u + h.shortcode.length + 1] === ":" && e.slice(u + 1, u + h.shortcode.length + 1) === h.shortcode) {
            o !== u && (yield { type: "text", text: e.slice(o, u) }), yield h, s = u + h.shortcode.length + 2, o = s;
            continue e;
          }
        }
        s = u + 1;
        continue e;
      }
    }
  o !== r && (yield { type: "text", text: e.slice(o) });
}
var Rp = {};
Re(Rp, {
  channelCreateEvent: () => Bp,
  channelHideMessageEvent: () => Tp,
  channelMessageEvent: () => Ip,
  channelMetadataEvent: () => Op,
  channelMuteUserEvent: () => Cp
});
var Bp = (e, t) => {
  let r;
  if (typeof e.content == "object")
    r = JSON.stringify(e.content);
  else if (typeof e.content == "string")
    r = e.content;
  else
    return;
  return yt(
    {
      kind: yc,
      tags: [...e.tags ?? []],
      content: r,
      created_at: e.created_at
    },
    t
  );
}, Op = (e, t) => {
  let r;
  if (typeof e.content == "object")
    r = JSON.stringify(e.content);
  else if (typeof e.content == "string")
    r = e.content;
  else
    return;
  return yt(
    {
      kind: gc,
      tags: [["e", e.channel_create_event_id], ...e.tags ?? []],
      content: r,
      created_at: e.created_at
    },
    t
  );
}, Ip = (e, t) => {
  const r = [["e", e.channel_create_event_id, e.relay_url, "root"]];
  return e.reply_to_channel_message_event_id && r.push(["e", e.reply_to_channel_message_event_id, e.relay_url, "reply"]), yt(
    {
      kind: mc,
      tags: [...r, ...e.tags ?? []],
      content: e.content,
      created_at: e.created_at
    },
    t
  );
}, Tp = (e, t) => {
  let r;
  if (typeof e.content == "object")
    r = JSON.stringify(e.content);
  else if (typeof e.content == "string")
    r = e.content;
  else
    return;
  return yt(
    {
      kind: vc,
      tags: [["e", e.channel_message_event_id], ...e.tags ?? []],
      content: r,
      created_at: e.created_at
    },
    t
  );
}, Cp = (e, t) => {
  let r;
  if (typeof e.content == "object")
    r = JSON.stringify(e.content);
  else if (typeof e.content == "string")
    r = e.content;
  else
    return;
  return yt(
    {
      kind: wc,
      tags: [["p", e.pubkey_to_mute], ...e.tags ?? []],
      content: r,
      created_at: e.created_at
    },
    t
  );
}, Lp = {};
Re(Lp, {
  EMOJI_SHORTCODE_REGEX: () => Fc,
  matchAll: () => Pp,
  regex: () => ji,
  replaceAll: () => Np
});
var Fc = /:(\w+):/, ji = () => new RegExp(`\\B${Fc.source}\\B`, "g");
function* Pp(e) {
  const t = e.matchAll(ji());
  for (const r of t)
    try {
      const [o, s] = r;
      yield {
        shortcode: o,
        name: s,
        start: r.index,
        end: r.index + o.length
      };
    } catch {
    }
}
function Np(e, t) {
  return e.replaceAll(ji(), (r, o) => t({
    shortcode: r,
    name: o
  }));
}
var Dp = {};
Re(Dp, {
  useFetchImplementation: () => qp,
  validateGithub: () => $p
});
var Fi;
try {
  Fi = fetch;
} catch {
}
function qp(e) {
  Fi = e;
}
async function $p(e, t, r) {
  try {
    return await (await Fi(`https://gist.github.com/${t}/${r}/raw`)).text() === `Verifying that I control the following Nostr public key: ${e}`;
  } catch {
    return !1;
  }
}
var Kp = {};
Re(Kp, {
  makeNwcRequestEvent: () => Mp,
  parseConnectionString: () => Up
});
function Up(e) {
  const { host: t, pathname: r, searchParams: o } = new URL(e), s = r || t, u = o.get("relay"), f = o.get("secret");
  if (!s || !u || !f)
    throw new Error("invalid connection string");
  return { pubkey: s, relay: u, secret: f };
}
async function Mp(e, t, r) {
  const s = kc(t, e, JSON.stringify({
    method: "pay_invoice",
    params: {
      invoice: r
    }
  })), u = {
    kind: _c,
    created_at: Math.round(Date.now() / 1e3),
    content: s,
    tags: [["p", e]]
  };
  return yt(u, t);
}
var jp = {};
Re(jp, {
  normalizeIdentifier: () => Fp
});
function Fp(e) {
  return e = e.trim().toLowerCase(), e = e.normalize("NFKC"), Array.from(e).map((t) => new RegExp("\\p{Letter}", "u").test(t) || new RegExp("\\p{Number}", "u").test(t) ? t : "-").join("");
}
var Hp = {};
Re(Hp, {
  getSatoshisAmountFromBolt11: () => Yp,
  getZapEndpoint: () => zp,
  makeZapReceipt: () => Wp,
  makeZapRequest: () => Zp,
  useFetchImplementation: () => Vp,
  validateZapRequest: () => Gp
});
var Hi;
try {
  Hi = fetch;
} catch {
}
function Vp(e) {
  Hi = e;
}
async function zp(e) {
  try {
    let t = "", { lud06: r, lud16: o } = JSON.parse(e.content);
    if (o) {
      let [f, p] = o.split("@");
      t = new URL(`/.well-known/lnurlp/${f}`, `https://${p}`).toString();
    } else if (r) {
      let { words: f } = _n.decode(r, 1e3), p = _n.fromWords(f);
      t = St.decode(p);
    } else
      return null;
    let u = await (await Hi(t)).json();
    if (u.allowsNostr && u.nostrPubkey)
      return u.callback;
  } catch {
  }
  return null;
}
function Zp(e) {
  let t = {
    kind: 9734,
    created_at: Math.round(Date.now() / 1e3),
    content: e.comment || "",
    tags: [
      ["p", "pubkey" in e ? e.pubkey : e.event.pubkey],
      ["amount", e.amount.toString()],
      ["relays", ...e.relays]
    ]
  };
  if ("event" in e) {
    if (t.tags.push(["e", e.event.id]), Si(e.event.kind)) {
      const r = ["a", `${e.event.kind}:${e.event.pubkey}:`];
      t.tags.push(r);
    } else if (Ri(e.event.kind)) {
      let r = e.event.tags.find(([s, u]) => s === "d" && u);
      if (!r)
        throw new Error("d tag not found or is empty");
      const o = ["a", `${e.event.kind}:${e.event.pubkey}:${r[1]}`];
      t.tags.push(o);
    }
    t.tags.push(["k", e.event.kind.toString()]);
  }
  return t;
}
function Gp(e) {
  let t;
  try {
    t = JSON.parse(e);
  } catch {
    return "Invalid zap request JSON.";
  }
  if (!kn(t))
    return "Zap request is not a valid Nostr event.";
  if (!Zn(t))
    return "Invalid signature on zap request.";
  let r = t.tags.find(([u, f]) => u === "p" && f);
  if (!r)
    return "Zap request doesn't have a 'p' tag.";
  if (!r[1].match(/^[a-f0-9]{64}$/))
    return "Zap request 'p' tag is not valid hex.";
  let o = t.tags.find(([u, f]) => u === "e" && f);
  return o && !o[1].match(/^[a-f0-9]{64}$/) ? "Zap request 'e' tag is not valid hex." : t.tags.find(([u, f]) => u === "relays" && f) ? null : "Zap request doesn't have a 'relays' tag.";
}
function Wp({
  zapRequest: e,
  preimage: t,
  bolt11: r,
  paidAt: o
}) {
  let s = JSON.parse(e), u = s.tags.filter(([p]) => p === "e" || p === "p" || p === "a"), f = {
    kind: 9735,
    created_at: Math.round(o.getTime() / 1e3),
    content: "",
    tags: [...u, ["P", s.pubkey], ["bolt11", r], ["description", e]]
  };
  return t && f.tags.push(["preimage", t]), f;
}
function Yp(e) {
  if (e.length < 50)
    return 0;
  e = e.substring(0, 50);
  const t = e.lastIndexOf("1");
  if (t === -1)
    return 0;
  const r = e.substring(0, t);
  if (!r.startsWith("lnbc"))
    return 0;
  const o = r.substring(4);
  if (o.length < 1)
    return 0;
  const s = o[o.length - 1], u = s.charCodeAt(0) - 48, f = u >= 0 && u <= 9;
  let p = o.length - 1;
  if (f && p++, p < 1)
    return 0;
  const h = parseInt(o.substring(0, p));
  switch (s) {
    case "m":
      return h * 1e5;
    case "u":
      return h * 100;
    case "n":
      return h / 10;
    case "p":
      return h / 1e4;
    default:
      return h * 1e8;
  }
}
var Xp = {};
Re(Xp, {
  Negentropy: () => Vc,
  NegentropyStorageVector: () => ey,
  NegentropySync: () => ty
});
var Vo = 97, bn = 32, Hc = 16, en = {
  Skip: 0,
  Fingerprint: 1,
  IdList: 2
}, At = class {
  _raw;
  length;
  constructor(e) {
    typeof e == "number" ? (this._raw = new Uint8Array(e), this.length = 0) : e instanceof Uint8Array ? (this._raw = new Uint8Array(e), this.length = e.length) : (this._raw = new Uint8Array(512), this.length = 0);
  }
  unwrap() {
    return this._raw.subarray(0, this.length);
  }
  get capacity() {
    return this._raw.byteLength;
  }
  extend(e) {
    if (e instanceof At && (e = e.unwrap()), typeof e.length != "number")
      throw Error("bad length");
    const t = e.length + this.length;
    if (this.capacity < t) {
      const r = this._raw, o = Math.max(this.capacity * 2, t);
      this._raw = new Uint8Array(o), this._raw.set(r);
    }
    this._raw.set(e, this.length), this.length += e.length;
  }
  shift() {
    const e = this._raw[0];
    return this._raw = this._raw.subarray(1), this.length--, e;
  }
  shiftN(e = 1) {
    const t = this._raw.subarray(0, e);
    return this._raw = this._raw.subarray(e), this.length -= e, t;
  }
};
function kr(e) {
  let t = 0;
  for (; ; ) {
    if (e.length === 0)
      throw Error("parse ends prematurely");
    let r = e.shift();
    if (t = t << 7 | r & 127, (r & 128) === 0)
      break;
  }
  return t;
}
function Et(e) {
  if (e === 0)
    return new At(new Uint8Array([0]));
  let t = [];
  for (; e !== 0; )
    t.push(e & 127), e >>>= 7;
  t.reverse();
  for (let r = 0; r < t.length - 1; r++)
    t[r] |= 128;
  return new At(new Uint8Array(t));
}
function Jp(e) {
  return Or(e, 1)[0];
}
function Or(e, t) {
  if (e.length < t)
    throw Error("parse ends prematurely");
  return e.shiftN(t);
}
var Qp = class {
  buf;
  constructor() {
    this.setToZero();
  }
  setToZero() {
    this.buf = new Uint8Array(bn);
  }
  add(e) {
    let t = 0, r = 0, o = new DataView(this.buf.buffer), s = new DataView(e.buffer);
    for (let u = 0; u < 8; u++) {
      let f = u * 4, p = o.getUint32(f, !0), h = s.getUint32(f, !0), m = p;
      m += t, m += h, m > 4294967295 && (r = 1), o.setUint32(f, m & 4294967295, !0), t = r, r = 0;
    }
  }
  negate() {
    let e = new DataView(this.buf.buffer);
    for (let r = 0; r < 8; r++) {
      let o = r * 4;
      e.setUint32(o, ~e.getUint32(o, !0));
    }
    let t = new Uint8Array(bn);
    t[0] = 1, this.add(t);
  }
  getFingerprint(e) {
    let t = new At();
    return t.extend(this.buf), t.extend(Et(e)), pt(t.unwrap()).subarray(0, Hc);
  }
}, ey = class {
  items;
  sealed;
  constructor() {
    this.items = [], this.sealed = !1;
  }
  insert(e, t) {
    if (this.sealed)
      throw Error("already sealed");
    const r = Ne(t);
    if (r.byteLength !== bn)
      throw Error("bad id size for added item");
    this.items.push({ timestamp: e, id: r });
  }
  seal() {
    if (this.sealed)
      throw Error("already sealed");
    this.sealed = !0, this.items.sort(zo);
    for (let e = 1; e < this.items.length; e++)
      if (zo(this.items[e - 1], this.items[e]) === 0)
        throw Error("duplicate item inserted");
  }
  unseal() {
    this.sealed = !1;
  }
  size() {
    return this._checkSealed(), this.items.length;
  }
  getItem(e) {
    if (this._checkSealed(), e >= this.items.length)
      throw Error("out of range");
    return this.items[e];
  }
  iterate(e, t, r) {
    this._checkSealed(), this._checkBounds(e, t);
    for (let o = e; o < t && r(this.items[o], o); ++o)
      ;
  }
  findLowerBound(e, t, r) {
    return this._checkSealed(), this._checkBounds(e, t), this._binarySearch(this.items, e, t, (o) => zo(o, r) < 0);
  }
  fingerprint(e, t) {
    let r = new Qp();
    return r.setToZero(), this.iterate(e, t, (o) => (r.add(o.id), !0)), r.getFingerprint(t - e);
  }
  _checkSealed() {
    if (!this.sealed)
      throw Error("not sealed");
  }
  _checkBounds(e, t) {
    if (e > t || t > this.items.length)
      throw Error("bad range");
  }
  _binarySearch(e, t, r, o) {
    let s = r - t;
    for (; s > 0; ) {
      let u = t, f = Math.floor(s / 2);
      u += f, o(e[u]) ? (t = ++u, s -= f + 1) : s = f;
    }
    return t;
  }
}, Vc = class {
  storage;
  frameSizeLimit;
  lastTimestampIn;
  lastTimestampOut;
  constructor(e, t = 6e4) {
    if (t < 4096)
      throw Error("frameSizeLimit too small");
    this.storage = e, this.frameSizeLimit = t, this.lastTimestampIn = 0, this.lastTimestampOut = 0;
  }
  _bound(e, t) {
    return { timestamp: e, id: t || new Uint8Array(0) };
  }
  initiate() {
    let e = new At();
    return e.extend(new Uint8Array([Vo])), this.splitRange(0, this.storage.size(), this._bound(Number.MAX_VALUE), e), Pe(e.unwrap());
  }
  reconcile(e, t, r) {
    const o = new At(Ne(e));
    this.lastTimestampIn = this.lastTimestampOut = 0;
    let s = new At();
    s.extend(new Uint8Array([Vo]));
    let u = Jp(o);
    if (u < 96 || u > 111)
      throw Error("invalid negentropy protocol version byte");
    if (u !== Vo)
      throw Error("unsupported negentropy protocol version requested: " + (u - 96));
    let f = this.storage.size(), p = this._bound(0), h = 0, m = !1;
    for (; o.length !== 0; ) {
      let v = new At(), w = () => {
        m && (m = !1, v.extend(this.encodeBound(p)), v.extend(Et(en.Skip)));
      }, P = this.decodeBound(o), T = kr(o), L = h, D = this.storage.findLowerBound(h, f, P);
      if (T === en.Skip)
        m = !0;
      else if (T === en.Fingerprint) {
        let F = Or(o, Hc), Z = this.storage.fingerprint(L, D);
        zc(F, Z) !== 0 ? (w(), this.splitRange(L, D, P, v)) : m = !0;
      } else if (T === en.IdList) {
        let F = kr(o), Z = {};
        for (let M = 0; M < F; M++) {
          let fe = Or(o, bn);
          Z[Pe(fe)] = fe;
        }
        if (m = !0, this.storage.iterate(L, D, (M) => {
          let fe = M.id;
          const ae = Pe(fe);
          return Z[ae] ? delete Z[Pe(fe)] : t?.(ae), !0;
        }), r)
          for (let M of Object.values(Z))
            r(Pe(M));
      } else
        throw Error("unexpected mode");
      if (this.exceededFrameSizeLimit(s.length + v.length)) {
        let F = this.storage.fingerprint(D, f);
        s.extend(this.encodeBound(this._bound(Number.MAX_VALUE))), s.extend(Et(en.Fingerprint)), s.extend(F);
        break;
      } else
        s.extend(v);
      h = D, p = P;
    }
    return s.length === 1 ? null : Pe(s.unwrap());
  }
  splitRange(e, t, r, o) {
    let s = t - e, u = 16;
    if (s < u * 2)
      o.extend(this.encodeBound(r)), o.extend(Et(en.IdList)), o.extend(Et(s)), this.storage.iterate(e, t, (f) => (o.extend(f.id), !0));
    else {
      let f = Math.floor(s / u), p = s % u, h = e;
      for (let m = 0; m < u; m++) {
        let v = f + (m < p ? 1 : 0), w = this.storage.fingerprint(h, h + v);
        h += v;
        let P;
        if (h === t)
          P = r;
        else {
          let T, L;
          this.storage.iterate(h - 1, h + 1, (D, F) => (F === h - 1 ? T = D : L = D, !0)), P = this.getMinimalBound(T, L);
        }
        o.extend(this.encodeBound(P)), o.extend(Et(en.Fingerprint)), o.extend(w);
      }
    }
  }
  exceededFrameSizeLimit(e) {
    return e > this.frameSizeLimit - 200;
  }
  decodeTimestampIn(e) {
    let t = kr(e);
    return t = t === 0 ? Number.MAX_VALUE : t - 1, this.lastTimestampIn === Number.MAX_VALUE || t === Number.MAX_VALUE ? (this.lastTimestampIn = Number.MAX_VALUE, Number.MAX_VALUE) : (t += this.lastTimestampIn, this.lastTimestampIn = t, t);
  }
  decodeBound(e) {
    let t = this.decodeTimestampIn(e), r = kr(e);
    if (r > bn)
      throw Error("bound key too long");
    let o = Or(e, r);
    return { timestamp: t, id: o };
  }
  encodeTimestampOut(e) {
    if (e === Number.MAX_VALUE)
      return this.lastTimestampOut = Number.MAX_VALUE, Et(0);
    let t = e;
    return e -= this.lastTimestampOut, this.lastTimestampOut = t, Et(e + 1);
  }
  encodeBound(e) {
    let t = new At();
    return t.extend(this.encodeTimestampOut(e.timestamp)), t.extend(Et(e.id.length)), t.extend(e.id), t;
  }
  getMinimalBound(e, t) {
    if (t.timestamp !== e.timestamp)
      return this._bound(t.timestamp);
    {
      let r = 0, o = t.id, s = e.id;
      for (let u = 0; u < bn && o[u] === s[u]; u++)
        r++;
      return this._bound(t.timestamp, t.id.subarray(0, r + 1));
    }
  }
};
function zc(e, t) {
  for (let r = 0; r < e.byteLength; r++) {
    if (e[r] < t[r])
      return -1;
    if (e[r] > t[r])
      return 1;
  }
  return e.byteLength > t.byteLength ? 1 : e.byteLength < t.byteLength ? -1 : 0;
}
function zo(e, t) {
  return e.timestamp === t.timestamp ? zc(e.id, t.id) : e.timestamp - t.timestamp;
}
var ty = class {
  relay;
  storage;
  neg;
  filter;
  subscription;
  onhave;
  onneed;
  constructor(e, t, r, o = {}) {
    this.relay = e, this.storage = t, this.neg = new Vc(t), this.onhave = o.onhave, this.onneed = o.onneed, this.filter = r, this.subscription = this.relay.prepareSubscription([{}], { label: o.label || "negentropy" }), this.subscription.oncustom = (s) => {
      switch (s[0]) {
        case "NEG-MSG": {
          s.length < 3 && console.warn(`got invalid NEG-MSG from ${this.relay.url}: ${s}`);
          try {
            const u = this.neg.reconcile(s[2], this.onhave, this.onneed);
            u ? this.relay.send(`["NEG-MSG", "${this.subscription.id}", "${u}"]`) : (this.close(), o.onclose?.());
          } catch (u) {
            console.error("negentropy reconcile error:", u), o?.onclose?.(`reconcile error: ${u}`);
          }
          break;
        }
        case "NEG-CLOSE": {
          const u = s[2];
          console.warn("negentropy error:", u), o.onclose?.(u);
          break;
        }
        case "NEG-ERR":
          o.onclose?.();
      }
    };
  }
  async start() {
    const e = this.neg.initiate();
    this.relay.send(`["NEG-OPEN","${this.subscription.id}",${JSON.stringify(this.filter)},"${e}"]`);
  }
  close() {
    this.relay.send(`["NEG-CLOSE","${this.subscription.id}"]`), this.subscription.close();
  }
}, ny = {};
Re(ny, {
  getToken: () => ry,
  hashPayload: () => Vi,
  unpackEventFromToken: () => Gc,
  validateEvent: () => eu,
  validateEventKind: () => Yc,
  validateEventMethodTag: () => Jc,
  validateEventPayloadTag: () => Qc,
  validateEventTimestamp: () => Wc,
  validateEventUrlTag: () => Xc,
  validateToken: () => oy
});
var Zc = "Nostr ";
async function ry(e, t, r, o = !1, s) {
  const u = {
    kind: Ti,
    tags: [
      ["u", e],
      ["method", t]
    ],
    created_at: Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3),
    content: ""
  };
  s && u.tags.push(["payload", Vi(s)]);
  const f = await r(u);
  return (o ? Zc : "") + jt.encode(it.encode(JSON.stringify(f)));
}
async function oy(e, t, r) {
  const o = await Gc(e).catch((u) => {
    throw u;
  });
  return await eu(o, t, r).catch((u) => {
    throw u;
  });
}
async function Gc(e) {
  if (!e)
    throw new Error("Missing token");
  e = e.replace(Zc, "");
  const t = St.decode(jt.decode(e));
  if (!t || t.length === 0 || !t.startsWith("{"))
    throw new Error("Invalid token");
  return JSON.parse(t);
}
function Wc(e) {
  return e.created_at ? Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3) - e.created_at < 60 : !1;
}
function Yc(e) {
  return e.kind === Ti;
}
function Xc(e, t) {
  const r = e.tags.find((o) => o[0] === "u");
  return r ? r.length > 0 && r[1] === t : !1;
}
function Jc(e, t) {
  const r = e.tags.find((o) => o[0] === "method");
  return r ? r.length > 0 && r[1].toLowerCase() === t.toLowerCase() : !1;
}
function Vi(e) {
  const t = pt(it.encode(JSON.stringify(e)));
  return Pe(t);
}
function Qc(e, t) {
  const r = e.tags.find((s) => s[0] === "payload");
  if (!r)
    return !1;
  const o = Vi(t);
  return r.length > 0 && r[1] === o;
}
async function eu(e, t, r, o) {
  if (!Zn(e))
    throw new Error("Invalid nostr event, signature invalid");
  if (!Yc(e))
    throw new Error("Invalid nostr event, kind invalid");
  if (!Wc(e))
    throw new Error("Invalid nostr event, created_at timestamp invalid");
  if (!Xc(e, t))
    throw new Error("Invalid nostr event, url tag invalid");
  if (!Jc(e, r))
    throw new Error("Invalid nostr event, method tag invalid");
  if (o && typeof o == "object" && Object.keys(o).length > 0 && !Qc(e, o))
    throw new Error("Invalid nostr event, payload tag does not match request body hash");
  return !0;
}
const iy = [
  "wss://relay.damus.io/",
  "wss://relay.nostr.band/",
  "wss://nrelay.c-stellar.net/",
  "wss://nrelay-jp.c-stellar.net/"
];
new Set(iy);
const sy = /^[0-9a-f]{64}$/i;
function ay(e) {
  return typeof e == "string" && sy.test(e);
}
function cy(e) {
  return e.map((t) => [...t]);
}
function uy(e, t) {
  return !Array.isArray(e) || e.length !== t.length ? !1 : e.every((r, o) => !Array.isArray(r) || r.length !== t[o].length ? !1 : r.every((s, u) => s === t[o][u]));
}
function tu(e) {
  return {
    id: e.id,
    pubkey: e.pubkey,
    created_at: e.created_at,
    kind: e.kind,
    tags: cy(e.tags),
    content: e.content,
    sig: e.sig
  };
}
function Gn(e) {
  if (!e || typeof e != "object")
    return !1;
  const t = e;
  return typeof t.id == "string" && typeof t.pubkey == "string" && typeof t.kind == "number" && typeof t.content == "string" && typeof t.created_at == "number" && typeof t.sig == "string" && Array.isArray(t.tags) && t.tags.every(
    (r) => Array.isArray(r) && r.every((o) => typeof o == "string")
  );
}
function ly(e, t) {
  return Gn(e) && e.id === t.eventId && e.pubkey === t.pubkeyHex && e.kind === t.kind && e.content === t.content && e.created_at === t.createdAt && uy(e.tags, t.tags);
}
function nu(e) {
  if (!e || e.kind !== 5)
    return [];
  const t = e.tags.filter((r) => r[0] === "e" && typeof r[1] == "string" && r[1].length > 0).map((r) => r[1]);
  return Array.from(new Set(t));
}
const Xr = 1;
function ru(e) {
  try {
    if (!Gn(e)) return !1;
    const t = tu(e);
    return kn(t) && Zn(t);
  } catch {
    return !1;
  }
}
const fy = 36, dy = [1, 42, 1111];
function zi(e) {
  if (!dy.includes(
    e.kind
  ) || e.content !== "" || !e.tags.some((o) => o[0] === "content-warning"))
    return null;
  const t = e.tags.filter((o) => o[0] === "c");
  if (t.length !== 1) return null;
  const r = t[0];
  return !ay(r[1]) || r.length > 3 ? null : {
    eventId: r[1],
    relayHint: r[2] || null
  };
}
function hy(e) {
  return zi(e) !== null && ru(e);
}
function py(e, t, r = zi(e)?.eventId) {
  if (!r || !hy(e) || !t || t.id !== r || t.kind !== fy || t.pubkey !== e.pubkey || !ru(t))
    return !1;
  const o = t.tags.filter((s) => s[0] === "k");
  return o.length === 1 && o[0].length >= 2 && o[0][1] === String(e.kind);
}
const yy = 1024 * 1024, gy = 100, my = {
  status: "valid",
  ruleVersion: Xr
}, Zo = {
  status: "invalid",
  ruleVersion: Xr
};
function vy(e) {
  return e?.ruleVersion === Xr && (e.status === "valid" || e.status === "invalid");
}
function ou(e) {
  return e?.status === "valid" && e.ruleVersion === Xr;
}
function iu(e) {
  if (Gn(e))
    try {
      return `nostr:${li(e)}\0${e.id}\0${e.sig}`;
    } catch {
    }
  try {
    return `raw:${JSON.stringify(e)}`;
  } catch {
    return "raw:unserializable";
  }
}
function wy(e) {
  if (!Gn(e))
    return { ...Zo };
  try {
    const t = tu(e);
    return kn(t) && li(t) === t.id && Zn(t) ? { ...my } : { ...Zo };
  } catch {
    return { ...Zo };
  }
}
async function ta(e, t) {
  for (const { id: r, fingerprint: o, verification: s } of e) {
    const u = await t.get(r);
    !u || iu(u.rawEvent) !== o || await t.update(r, {
      rawEventVerification: s
    });
  }
}
function by(e, t) {
  const r = (o) => ({
    get: async (s) => o.find((u) => u.id === s),
    update: async (s, u) => {
      const f = o.find((p) => p.id === s);
      f && Object.assign(f, u);
    }
  });
  return {
    post: r(e),
    deletion: r(t)
  };
}
async function Ey(e, t, r, o) {
  const s = [
    ...e.map((w) => ({ type: "post", record: w })),
    ...t.map((w) => ({ type: "deletion", record: w }))
  ].filter((w) => !vy(w.record.rawEventVerification)), u = s.length;
  if (u === 0)
    return;
  let f = 0;
  const p = /* @__PURE__ */ new Map(), h = [], m = [];
  async function v() {
    if (h.length > 0) {
      const w = h.splice(0), P = () => ta(w, r.post);
      await (r.transaction?.post ?? (async (T) => T()))(P);
    }
    if (m.length > 0) {
      const w = m.splice(0), P = () => ta(w, r.deletion);
      await (r.transaction?.deletion ?? (async (T) => T()))(P);
    }
  }
  o?.({ phase: "verifying", processed: f, total: u });
  for (const w of s) {
    const P = iu(w.record.rawEvent), T = p.get(P) ?? wy(w.record.rawEvent);
    p.set(P, T), w.record.rawEventVerification = T;
    const L = { id: w.record.id, fingerprint: P, verification: T };
    w.type === "post" ? h.push(L) : m.push(L), f += 1, f % gy === 0 && (await v(), o?.({ phase: "verifying", processed: f, total: u }));
  }
  await v(), o?.({ phase: "verifying", processed: u, total: u });
}
function su(e, t) {
  if (!Gn(e) || e.kind !== t)
    return !1;
  try {
    return kn(e) && li(e) === e.id;
  } catch {
    return !1;
  }
}
function Go(e) {
  return {
    id: e.id,
    pubkey: e.pubkey,
    created_at: e.created_at,
    kind: e.kind,
    tags: e.tags.map((t) => [...t]),
    content: e.content,
    sig: e.sig
  };
}
function na(e, t) {
  return e.created_at !== t.created_at ? e.created_at - t.created_at : e.id === t.id ? 0 : e.id < t.id ? -1 : 1;
}
function _y(e) {
  return e.rawEvent !== null && e.rawEvent !== void 0;
}
function xy(e, t, r) {
  return !ou(e.rawEventVerification) || !su(t, 5) || t.pubkey !== r || e.targetAuthorPubkey !== r || e.deletionEventPubkey !== r || t.id !== e.deletionEventId ? !1 : nu(t).includes(e.targetEventId);
}
function Ay() {
  return {
    exportedEventCount: 0,
    exportedPostEventCount: 0,
    exportedDeletionEventCount: 0,
    exportedPayloadEventCount: 0,
    skippedPostCount: 0,
    missingDeletionRawEventCount: 0,
    invalidDeletionRawEventCount: 0,
    missingPayloadEventCount: 0,
    isPartial: !1
  };
}
function ky(e, t) {
  if (e.length === 0)
    return {
      blob: new Blob([], { type: "application/x-ndjson;charset=utf-8" }),
      ...t ? { jsonl: "" } : {}
    };
  const r = [];
  let o = "";
  for (const s of e) {
    const u = `${JSON.stringify(s)}
`;
    o.length > 0 && o.length + u.length > yy && (r.push(o), o = ""), o += u;
  }
  return o.length > 0 && r.push(o), {
    blob: new Blob(r, { type: "application/x-ndjson;charset=utf-8" }),
    ...t ? { jsonl: r.join("") } : {}
  };
}
async function Sy(e, t, r, o = {}) {
  const s = Ay(), u = [], f = [], p = /* @__PURE__ */ new Set(), h = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Set(), v = t.filter((M) => M.pubkeyHex === e), w = r.filter(
    (M) => M.targetAuthorPubkey === e
  ), P = new Map(
    (o.sensitivePayloadRecords ?? []).filter((M) => M.pubkeyHex === e && M.deletedAt === void 0).map((M) => [M.id, M])
  ), T = /* @__PURE__ */ new Set();
  for (const M of v) {
    if (![1, 42, 1111].includes(M.kind))
      continue;
    if (!ou(M.rawEventVerification) || !ly(M.rawEvent, M) || !su(M.rawEvent, M.kind)) {
      s.skippedPostCount += 1;
      continue;
    }
    u.push(Go(M.rawEvent)), p.add(M.eventId), s.exportedPostEventCount += 1;
    const fe = M.rawEvent, ae = zi(fe);
    if (!ae) continue;
    const de = P.get(ae.eventId)?.rawEvent;
    if (!de || !py(fe, de, ae.eventId)) {
      s.missingPayloadEventCount += 1;
      continue;
    }
    T.has(de.id) || (T.add(de.id), u.push(Go(de)), s.exportedPayloadEventCount += 1);
  }
  const L = /* @__PURE__ */ new Map();
  for (const M of w) {
    const fe = L.get(M.deletionEventId) ?? [];
    fe.push(M), L.set(M.deletionEventId, fe);
  }
  for (const M of L.values()) {
    const fe = M.find((ae) => xy(ae, ae.rawEvent, e));
    if (fe) {
      const ae = Go(fe.rawEvent);
      f.push(ae);
      for (const Ke of nu(ae))
        h.add(Ke);
      s.exportedDeletionEventCount += 1;
      continue;
    }
    for (const ae of M)
      m.add(ae.targetEventId);
    M.every((ae) => !_y(ae)) ? s.missingDeletionRawEventCount += 1 : s.invalidDeletionRawEventCount += 1;
  }
  const D = /* @__PURE__ */ new Set();
  for (const M of v)
    ![1, 42, 1111].includes(M.kind) || M.deletedAt === void 0 || !p.has(M.eventId) || h.has(M.eventId) || m.has(M.eventId) || D.add(M.eventId);
  s.missingDeletionRawEventCount += D.size, u.sort(na), f.sort(na);
  const F = [...u, ...f];
  s.exportedEventCount = F.length, s.isPartial = s.skippedPostCount > 0 || s.missingDeletionRawEventCount > 0 || s.invalidDeletionRawEventCount > 0 || s.missingPayloadEventCount > 0, o.onProgress?.({ phase: "creating" });
  const Z = ky(F, o.includeJsonl === !0);
  return { result: s, ...Z };
}
async function Ry(e) {
  const t = e.postRecords.filter(
    (s) => s.pubkeyHex === e.pubkeyHex
  ), r = e.deletionRecords.filter(
    (s) => s.targetAuthorPubkey === e.pubkeyHex
  ), o = e.verificationStores ?? by(t, r);
  return await Ey(
    t,
    r,
    o,
    e.onProgress
  ), Sy(
    e.pubkeyHex,
    t,
    r,
    e
  );
}
var By = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Oy(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Ir = { exports: {} }, Iy = Ir.exports, ra;
function Ty() {
  return ra || (ra = 1, (function(e, t) {
    ((r, o) => {
      e.exports = o();
    })(Iy, function() {
      var r = function(n, i) {
        return (r = Object.setPrototypeOf || ({ __proto__: [] } instanceof Array ? function(a, c) {
          a.__proto__ = c;
        } : function(a, c) {
          for (var l in c) Object.prototype.hasOwnProperty.call(c, l) && (a[l] = c[l]);
        }))(n, i);
      }, o = function() {
        return (o = Object.assign || function(n) {
          for (var i, a = 1, c = arguments.length; a < c; a++) for (var l in i = arguments[a]) Object.prototype.hasOwnProperty.call(i, l) && (n[l] = i[l]);
          return n;
        }).apply(this, arguments);
      };
      function s(n, i, a) {
        for (var c, l = 0, d = i.length; l < d; l++) !c && l in i || ((c = c || Array.prototype.slice.call(i, 0, l))[l] = i[l]);
        return n.concat(c || Array.prototype.slice.call(i));
      }
      var u = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : By, f = Object.keys, p = Array.isArray;
      function h(n, i) {
        return typeof i == "object" && f(i).forEach(function(a) {
          n[a] = i[a];
        }), n;
      }
      typeof Promise > "u" || u.Promise || (u.Promise = Promise);
      var m = Object.getPrototypeOf, v = {}.hasOwnProperty;
      function w(n, i) {
        return v.call(n, i);
      }
      function P(n, i) {
        typeof i == "function" && (i = i(m(n))), (typeof Reflect > "u" ? f : Reflect.ownKeys)(i).forEach(function(a) {
          L(n, a, i[a]);
        });
      }
      var T = Object.defineProperty;
      function L(n, i, a, c) {
        T(n, i, h(a && w(a, "get") && typeof a.get == "function" ? { get: a.get, set: a.set, configurable: !0 } : { value: a, configurable: !0, writable: !0 }, c));
      }
      function D(n) {
        return { from: function(i) {
          return n.prototype = Object.create(i.prototype), L(n.prototype, "constructor", n), { extend: P.bind(null, n.prototype) };
        } };
      }
      var F = Object.getOwnPropertyDescriptor, Z = [].slice;
      function M(n, i, a) {
        return Z.call(n, i, a);
      }
      function fe(n, i) {
        return i(n);
      }
      function ae(n) {
        if (!n) throw new Error("Assertion Failed");
      }
      function Ke(n) {
        u.setImmediate ? setImmediate(n) : setTimeout(n, 0);
      }
      function de(n, i) {
        if (typeof i == "string" && w(n, i)) return n[i];
        if (!i) return n;
        if (typeof i != "string") {
          for (var a = [], c = 0, l = i.length; c < l; ++c) {
            var d = de(n, i[c]);
            a.push(d);
          }
          return a;
        }
        var y, g = i.indexOf(".");
        return g === -1 || (y = n[i.substr(0, g)]) == null ? void 0 : de(y, i.substr(g + 1));
      }
      function ve(n, i, a) {
        if (n && i !== void 0 && !("isFrozen" in Object && Object.isFrozen(n))) if (typeof i != "string" && "length" in i) {
          ae(typeof a != "string" && "length" in a);
          for (var c = 0, l = i.length; c < l; ++c) ve(n, i[c], a[c]);
        } else {
          var d, y, g = i.indexOf(".");
          g !== -1 ? (d = i.substr(0, g), (g = i.substr(g + 1)) === "" ? a === void 0 ? p(n) && !isNaN(parseInt(d)) ? n.splice(d, 1) : delete n[d] : n[d] = a : ve(y = (y = n[d]) && w(n, d) ? y : n[d] = {}, g, a)) : a === void 0 ? p(n) && !isNaN(parseInt(i)) ? n.splice(i, 1) : delete n[i] : n[i] = a;
        }
      }
      function Be(n) {
        var i, a = {};
        for (i in n) w(n, i) && (a[i] = n[i]);
        return a;
      }
      var le = [].concat;
      function De(n) {
        return le.apply([], n);
      }
      var ne = "BigUint64Array,BigInt64Array,Array,Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,FileSystemDirectoryHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey".split(",").concat(De([8, 16, 32, 64].map(function(n) {
        return ["Int", "Uint", "Float"].map(function(i) {
          return i + n + "Array";
        });
      }))).filter(function(n) {
        return u[n];
      }), Oe = new Set(ne.map(function(n) {
        return u[n];
      })), se = null;
      function K(n) {
        return se = /* @__PURE__ */ new WeakMap(), n = (function i(a) {
          if (!a || typeof a != "object") return a;
          var c = se.get(a);
          if (c) return c;
          if (p(a)) {
            c = [], se.set(a, c);
            for (var l = 0, d = a.length; l < d; ++l) c.push(i(a[l]));
          } else if (Oe.has(a.constructor)) c = a;
          else {
            var y, g = m(a);
            for (y in c = g === Object.prototype ? {} : Object.create(g), se.set(a, c), a) w(a, y) && (c[y] = i(a[y]));
          }
          return c;
        })(n), se = null, n;
      }
      var j = {}.toString;
      function N(n) {
        return j.call(n).slice(8, -1);
      }
      var G = typeof Symbol < "u" ? Symbol.iterator : "@@iterator", ee = typeof G == "symbol" ? function(n) {
        var i;
        return n != null && (i = n[G]) && i.apply(n);
      } : function() {
        return null;
      };
      function J(n, i) {
        i = n.indexOf(i), 0 <= i && n.splice(i, 1);
      }
      var Q = {};
      function W(n) {
        var i, a, c, l;
        if (arguments.length === 1) {
          if (p(n)) return n.slice();
          if (this === Q && typeof n == "string") return [n];
          if (l = ee(n)) for (a = []; !(c = l.next()).done; ) a.push(c.value);
          else {
            if (n == null) return [n];
            if (typeof (i = n.length) != "number") return [n];
            for (a = new Array(i); i--; ) a[i] = n[i];
          }
        } else for (i = arguments.length, a = new Array(i); i--; ) a[i] = arguments[i];
        return a;
      }
      var oe = typeof Symbol < "u" ? function(n) {
        return n[Symbol.toStringTag] === "AsyncFunction";
      } : function() {
        return !1;
      }, ne = ["Unknown", "Constraint", "Data", "TransactionInactive", "ReadOnly", "Version", "NotFound", "InvalidState", "InvalidAccess", "Abort", "Timeout", "QuotaExceeded", "Syntax", "DataClone"], et = ["Modify", "Bulk", "OpenFailed", "VersionChange", "Schema", "Upgrade", "InvalidTable", "MissingAPI", "NoSuchDatabase", "InvalidArgument", "SubTransaction", "Unsupported", "Internal", "DatabaseClosed", "PrematureCommit", "ForeignAwait"].concat(ne), Ie = { VersionChanged: "Database version changed by other database connection", DatabaseClosed: "Database has been closed", Abort: "Transaction aborted", TransactionInactive: "Transaction has already completed or failed", MissingAPI: "IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb" };
      function Ee(n, i) {
        this.name = n, this.message = i;
      }
      function ge(n, i) {
        return n + ". Errors: " + Object.keys(i).map(function(a) {
          return i[a].toString();
        }).filter(function(a, c, l) {
          return l.indexOf(a) === c;
        }).join(`
`);
      }
      function xe(n, i, a, c) {
        this.failures = i, this.failedKeys = c, this.successCount = a, this.message = ge(n, i);
      }
      function Te(n, i) {
        this.name = "BulkError", this.failures = Object.keys(i).map(function(a) {
          return i[a];
        }), this.failuresByPos = i, this.message = ge(n, this.failures);
      }
      D(Ee).from(Error).extend({ toString: function() {
        return this.name + ": " + this.message;
      } }), D(xe).from(Ee), D(Te).from(Ee);
      var We = et.reduce(function(n, i) {
        return n[i] = i + "Error", n;
      }, {}), Ce = Ee, X = et.reduce(function(n, i) {
        var a = i + "Error";
        function c(l, d) {
          this.name = a, l ? typeof l == "string" ? (this.message = "".concat(l).concat(d ? `
 ` + d : ""), this.inner = d || null) : typeof l == "object" && (this.message = "".concat(l.name, " ").concat(l.message), this.inner = l) : (this.message = Ie[i] || a, this.inner = null);
        }
        return D(c).from(Ce), n[i] = c, n;
      }, {}), Ft = (X.Syntax = SyntaxError, X.Type = TypeError, X.Range = RangeError, ne.reduce(function(n, i) {
        return n[i + "Error"] = X[i], n;
      }, {}));
      ne = et.reduce(function(n, i) {
        return ["Syntax", "Type", "Range"].indexOf(i) === -1 && (n[i + "Error"] = X[i]), n;
      }, {});
      function _e() {
      }
      function Rt(n) {
        return n;
      }
      function au(n, i) {
        return n == null || n === Rt ? i : function(a) {
          return i(n(a));
        };
      }
      function Ht(n, i) {
        return function() {
          n.apply(this, arguments), i.apply(this, arguments);
        };
      }
      function cu(n, i) {
        return n === _e ? i : function() {
          var a = n.apply(this, arguments), c = (a !== void 0 && (arguments[0] = a), this.onsuccess), l = this.onerror, d = (this.onsuccess = null, this.onerror = null, i.apply(this, arguments));
          return c && (this.onsuccess = this.onsuccess ? Ht(c, this.onsuccess) : c), l && (this.onerror = this.onerror ? Ht(l, this.onerror) : l), d !== void 0 ? d : a;
        };
      }
      function uu(n, i) {
        return n === _e ? i : function() {
          n.apply(this, arguments);
          var a = this.onsuccess, c = this.onerror;
          this.onsuccess = this.onerror = null, i.apply(this, arguments), a && (this.onsuccess = this.onsuccess ? Ht(a, this.onsuccess) : a), c && (this.onerror = this.onerror ? Ht(c, this.onerror) : c);
        };
      }
      function lu(n, i) {
        return n === _e ? i : function(l) {
          var c = n.apply(this, arguments), l = (h(l, c), this.onsuccess), d = this.onerror, y = (this.onsuccess = null, this.onerror = null, i.apply(this, arguments));
          return l && (this.onsuccess = this.onsuccess ? Ht(l, this.onsuccess) : l), d && (this.onerror = this.onerror ? Ht(d, this.onerror) : d), c === void 0 ? y === void 0 ? void 0 : y : h(c, y);
        };
      }
      function fu(n, i) {
        return n === _e ? i : function() {
          return i.apply(this, arguments) !== !1 && n.apply(this, arguments);
        };
      }
      function Jr(n, i) {
        return n === _e ? i : function() {
          var a = n.apply(this, arguments);
          if (a && typeof a.then == "function") {
            for (var c = this, l = arguments.length, d = new Array(l); l--; ) d[l] = arguments[l];
            return a.then(function() {
              return i.apply(c, d);
            });
          }
          return i.apply(this, arguments);
        };
      }
      ne.ModifyError = xe, ne.DexieError = Ee, ne.BulkError = Te;
      var ct = typeof location < "u" && /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
      function Zi(n) {
        ct = n;
      }
      var Sn = {}, Gi = 100, Rn = typeof Promise > "u" ? [] : (et = Promise.resolve(), typeof crypto < "u" && crypto.subtle ? [Rn = crypto.subtle.digest("SHA-512", new Uint8Array([0])), m(Rn), et] : [et, m(et), et]), et = Rn[0], pn = Rn[1], pn = pn && pn.then, Vt = et && et.constructor, Qr = !!Rn[2], Bn = function(n, i) {
        On.push([n, i]), Wn && (queueMicrotask(hu), Wn = !1);
      }, eo = !0, Wn = !0, zt = [], Yn = [], to = Rt, gt = { id: "global", global: !0, ref: 0, unhandleds: [], onunhandled: _e, pgp: !1, env: {}, finalize: _e }, ie = gt, On = [], Zt = 0, Xn = [];
      function Y(n) {
        if (typeof this != "object") throw new TypeError("Promises must be constructed via new");
        this._listeners = [], this._lib = !1;
        var i = this._PSD = ie;
        if (typeof n != "function") {
          if (n !== Sn) throw new TypeError("Not a function");
          this._state = arguments[1], this._value = arguments[2], this._state === !1 && ro(this, this._value);
        } else this._state = null, this._value = null, ++i.ref, (function a(c, l) {
          try {
            l(function(d) {
              if (c._state === null) {
                if (d === c) throw new TypeError("A promise cannot be resolved with itself.");
                var y = c._lib && cn();
                d && typeof d.then == "function" ? a(c, function(g, E) {
                  d instanceof Y ? d._then(g, E) : d.then(g, E);
                }) : (c._state = !0, c._value = d, Yi(c)), y && un();
              }
            }, ro.bind(null, c));
          } catch (d) {
            ro(c, d);
          }
        })(this, n);
      }
      var no = { get: function() {
        var n = ie, i = tr;
        function a(c, l) {
          var d = this, y = !n.global && (n !== ie || i !== tr), g = y && !Ot(), E = new Y(function(B, x) {
            oo(d, new Wi(Ji(c, n, y, g), Ji(l, n, y, g), B, x, n));
          });
          return this._consoleTask && (E._consoleTask = this._consoleTask), E;
        }
        return a.prototype = Sn, a;
      }, set: function(n) {
        L(this, "then", n && n.prototype === Sn ? no : { get: function() {
          return n;
        }, set: no.set });
      } };
      function Wi(n, i, a, c, l) {
        this.onFulfilled = typeof n == "function" ? n : null, this.onRejected = typeof i == "function" ? i : null, this.resolve = a, this.reject = c, this.psd = l;
      }
      function ro(n, i) {
        var a, c;
        Yn.push(i), n._state === null && (a = n._lib && cn(), i = to(i), n._state = !1, n._value = i, c = n, zt.some(function(l) {
          return l._value === c._value;
        }) || zt.push(c), Yi(n), a) && un();
      }
      function Yi(n) {
        var i = n._listeners;
        n._listeners = [];
        for (var a = 0, c = i.length; a < c; ++a) oo(n, i[a]);
        var l = n._PSD;
        --l.ref || l.finalize(), Zt === 0 && (++Zt, Bn(function() {
          --Zt == 0 && io();
        }, []));
      }
      function oo(n, i) {
        if (n._state === null) n._listeners.push(i);
        else {
          var a = n._state ? i.onFulfilled : i.onRejected;
          if (a === null) return (n._state ? i.resolve : i.reject)(n._value);
          ++i.psd.ref, ++Zt, Bn(du, [a, n, i]);
        }
      }
      function du(n, i, a) {
        try {
          var c, l = i._value;
          !i._state && Yn.length && (Yn = []), c = ct && i._consoleTask ? i._consoleTask.run(function() {
            return n(l);
          }) : n(l), i._state || Yn.indexOf(l) !== -1 || ((d) => {
            for (var y = zt.length; y; ) if (zt[--y]._value === d._value) return zt.splice(y, 1);
          })(i), a.resolve(c);
        } catch (d) {
          a.reject(d);
        } finally {
          --Zt == 0 && io(), --a.psd.ref || a.psd.finalize();
        }
      }
      function hu() {
        Gt(gt, function() {
          cn() && un();
        });
      }
      function cn() {
        var n = eo;
        return Wn = eo = !1, n;
      }
      function un() {
        var n, i, a;
        do
          for (; 0 < On.length; ) for (n = On, On = [], a = n.length, i = 0; i < a; ++i) {
            var c = n[i];
            c[0].apply(null, c[1]);
          }
        while (0 < On.length);
        Wn = eo = !0;
      }
      function io() {
        for (var n = zt, i = (zt = [], n.forEach(function(c) {
          c._PSD.onunhandled.call(null, c._value, c);
        }), Xn.slice(0)), a = i.length; a; ) i[--a]();
      }
      function Jn(n) {
        return new Y(Sn, !1, n);
      }
      function Le(n, i) {
        var a = ie;
        return function() {
          var c = cn(), l = ie;
          try {
            return It(a, !0), n.apply(this, arguments);
          } catch (d) {
            i && i(d);
          } finally {
            It(l, !1), c && un();
          }
        };
      }
      P(Y.prototype, { then: no, _then: function(n, i) {
        oo(this, new Wi(null, null, n, i, ie));
      }, catch: function(n) {
        var i, a;
        return arguments.length === 1 ? this.then(null, n) : (i = n, a = arguments[1], typeof i == "function" ? this.then(null, function(c) {
          return (c instanceof i ? a : Jn)(c);
        }) : this.then(null, function(c) {
          return (c && c.name === i ? a : Jn)(c);
        }));
      }, finally: function(n) {
        return this.then(function(i) {
          return Y.resolve(n()).then(function() {
            return i;
          });
        }, function(i) {
          return Y.resolve(n()).then(function() {
            return Jn(i);
          });
        });
      }, timeout: function(n, i) {
        var a = this;
        return n < 1 / 0 ? new Y(function(c, l) {
          var d = setTimeout(function() {
            return l(new X.Timeout(i));
          }, n);
          a.then(c, l).finally(clearTimeout.bind(null, d));
        }) : this;
      } }), typeof Symbol < "u" && Symbol.toStringTag && L(Y.prototype, Symbol.toStringTag, "Dexie.Promise"), gt.env = Xi(), P(Y, { all: function() {
        var n = W.apply(null, arguments).map(nr);
        return new Y(function(i, a) {
          n.length === 0 && i([]);
          var c = n.length;
          n.forEach(function(l, d) {
            return Y.resolve(l).then(function(y) {
              n[d] = y, --c || i(n);
            }, a);
          });
        });
      }, resolve: function(n) {
        return n instanceof Y ? n : n && typeof n.then == "function" ? new Y(function(i, a) {
          n.then(i, a);
        }) : new Y(Sn, !0, n);
      }, reject: Jn, race: function() {
        var n = W.apply(null, arguments).map(nr);
        return new Y(function(i, a) {
          n.map(function(c) {
            return Y.resolve(c).then(i, a);
          });
        });
      }, PSD: { get: function() {
        return ie;
      }, set: function(n) {
        return ie = n;
      } }, totalEchoes: { get: function() {
        return tr;
      } }, newPSD: Bt, usePSD: Gt, scheduler: { get: function() {
        return Bn;
      }, set: function(n) {
        Bn = n;
      } }, rejectionMapper: { get: function() {
        return to;
      }, set: function(n) {
        to = n;
      } }, follow: function(n, i) {
        return new Y(function(a, c) {
          return Bt(function(l, d) {
            var y = ie;
            y.unhandleds = [], y.onunhandled = d, y.finalize = Ht(function() {
              var g, E = this;
              g = function() {
                E.unhandleds.length === 0 ? l() : d(E.unhandleds[0]);
              }, Xn.push(function B() {
                g(), Xn.splice(Xn.indexOf(B), 1);
              }), ++Zt, Bn(function() {
                --Zt == 0 && io();
              }, []);
            }, y.finalize), n();
          }, i, a, c);
        });
      } }), Vt && (Vt.allSettled && L(Y, "allSettled", function() {
        var n = W.apply(null, arguments).map(nr);
        return new Y(function(i) {
          n.length === 0 && i([]);
          var a = n.length, c = new Array(a);
          n.forEach(function(l, d) {
            return Y.resolve(l).then(function(y) {
              return c[d] = { status: "fulfilled", value: y };
            }, function(y) {
              return c[d] = { status: "rejected", reason: y };
            }).then(function() {
              return --a || i(c);
            });
          });
        });
      }), Vt.any && typeof AggregateError < "u" && L(Y, "any", function() {
        var n = W.apply(null, arguments).map(nr);
        return new Y(function(i, a) {
          n.length === 0 && a(new AggregateError([]));
          var c = n.length, l = new Array(c);
          n.forEach(function(d, y) {
            return Y.resolve(d).then(function(g) {
              return i(g);
            }, function(g) {
              l[y] = g, --c || a(new AggregateError(l));
            });
          });
        });
      }), Vt.withResolvers) && (Y.withResolvers = Vt.withResolvers);
      var Ue = { awaits: 0, echoes: 0, id: 0 }, pu = 0, Qn = [], er = 0, tr = 0, yu = 0;
      function Bt(n, y, a, c) {
        var l = ie, d = Object.create(l), y = (d.parent = l, d.ref = 0, d.global = !1, d.id = ++yu, gt.env, d.env = Qr ? { Promise: Y, PromiseProp: { value: Y, configurable: !0, writable: !0 }, all: Y.all, race: Y.race, allSettled: Y.allSettled, any: Y.any, resolve: Y.resolve, reject: Y.reject } : {}, y && h(d, y), ++l.ref, d.finalize = function() {
          --this.parent.ref || this.parent.finalize();
        }, Gt(d, n, a, c));
        return d.ref === 0 && d.finalize(), y;
      }
      function ln() {
        return Ue.id || (Ue.id = ++pu), ++Ue.awaits, Ue.echoes += Gi, Ue.id;
      }
      function Ot() {
        return !!Ue.awaits && (--Ue.awaits == 0 && (Ue.id = 0), Ue.echoes = Ue.awaits * Gi, !0);
      }
      function nr(n) {
        return Ue.echoes && n && n.constructor === Vt ? (ln(), n.then(function(i) {
          return Ot(), i;
        }, function(i) {
          return Ot(), qe(i);
        })) : n;
      }
      function gu() {
        var n = Qn[Qn.length - 1];
        Qn.pop(), It(n, !1);
      }
      function It(n, i) {
        var a, c, l = ie;
        (i ? !Ue.echoes || er++ && n === ie : !er || --er && n === ie) || queueMicrotask(i ? (function(d) {
          ++tr, Ue.echoes && --Ue.echoes != 0 || (Ue.echoes = Ue.awaits = Ue.id = 0), Qn.push(ie), It(d, !0);
        }).bind(null, n) : gu), n !== ie && (ie = n, l === gt && (gt.env = Xi()), Qr) && (a = gt.env.Promise, c = n.env, l.global || n.global) && (Object.defineProperty(u, "Promise", c.PromiseProp), a.all = c.all, a.race = c.race, a.resolve = c.resolve, a.reject = c.reject, c.allSettled && (a.allSettled = c.allSettled), c.any) && (a.any = c.any);
      }
      function Xi() {
        var n = u.Promise;
        return Qr ? { Promise: n, PromiseProp: Object.getOwnPropertyDescriptor(u, "Promise"), all: n.all, race: n.race, allSettled: n.allSettled, any: n.any, resolve: n.resolve, reject: n.reject } : {};
      }
      function Gt(n, i, a, c, l) {
        var d = ie;
        try {
          return It(n, !0), i(a, c, l);
        } finally {
          It(d, !1);
        }
      }
      function Ji(n, i, a, c) {
        return typeof n != "function" ? n : function() {
          var l = ie;
          a && ln(), It(i, !0);
          try {
            return n.apply(this, arguments);
          } finally {
            It(l, !1), c && queueMicrotask(Ot);
          }
        };
      }
      function so(n) {
        Promise === Vt && Ue.echoes === 0 ? er === 0 ? n() : enqueueNativeMicroTask(n) : setTimeout(n, 0);
      }
      ("" + pn).indexOf("[native code]") === -1 && (ln = Ot = _e);
      var qe = Y.reject, Wt = "￿", mt = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.", Qi = "String expected.", rr = "__dbnames", ao = "readonly", co = "readwrite";
      function Yt(n, i) {
        return n ? i ? function() {
          return n.apply(this, arguments) && i.apply(this, arguments);
        } : n : i;
      }
      var es = { type: 3, lower: -1 / 0, lowerOpen: !1, upper: [[]], upperOpen: !1 };
      function or(n) {
        return typeof n != "string" || /\./.test(n) ? function(i) {
          return i;
        } : function(i) {
          return i[n] === void 0 && n in i && delete (i = K(i))[n], i;
        };
      }
      function ts() {
        throw X.Type("Entity instances must never be new:ed. Instances are generated by the framework bypassing the constructor.");
      }
      function me(n, i) {
        try {
          var a = ns(n), c = ns(i);
          if (a !== c) return a === "Array" ? 1 : c === "Array" ? -1 : a === "binary" ? 1 : c === "binary" ? -1 : a === "string" ? 1 : c === "string" ? -1 : a === "Date" ? 1 : c !== "Date" ? NaN : -1;
          switch (a) {
            case "number":
            case "Date":
            case "string":
              return i < n ? 1 : n < i ? -1 : 0;
            case "binary":
              for (var l = rs(n), d = rs(i), y = l.length, g = d.length, E = y < g ? y : g, B = 0; B < E; ++B) if (l[B] !== d[B]) return l[B] < d[B] ? -1 : 1;
              return y === g ? 0 : y < g ? -1 : 1;
            case "Array":
              for (var x = n, b = i, _ = x.length, R = b.length, A = _ < R ? _ : R, k = 0; k < A; ++k) {
                var S = me(x[k], b[k]);
                if (S !== 0) return S;
              }
              return _ === R ? 0 : _ < R ? -1 : 1;
          }
        } catch {
        }
        return NaN;
      }
      function ns(n) {
        var i = typeof n;
        return i == "object" && (ArrayBuffer.isView(n) || (i = N(n)) === "ArrayBuffer") ? "binary" : i;
      }
      function rs(n) {
        return n instanceof Uint8Array ? n : ArrayBuffer.isView(n) ? new Uint8Array(n.buffer, n.byteOffset, n.byteLength) : new Uint8Array(n);
      }
      function ir(n, i, a) {
        var c = n.schema.yProps;
        return c ? (i && 0 < a.numFailures && (i = i.filter(function(l, d) {
          return !a.failures[d];
        })), Promise.all(c.map(function(l) {
          return l = l.updatesTable, i ? n.db.table(l).where("k").anyOf(i).delete() : n.db.table(l).clear();
        })).then(function() {
          return a;
        })) : a;
      }
      os.prototype.execute = function(n) {
        var i = this["@@propmod"];
        if (i.add !== void 0) {
          var a = i.add;
          if (p(a)) return s(s([], p(n) ? n : [], !0), a).sort();
          if (typeof a == "number") return (Number(n) || 0) + a;
          if (typeof a == "bigint") try {
            return BigInt(n) + a;
          } catch {
            return BigInt(0) + a;
          }
          throw new TypeError("Invalid term ".concat(a));
        }
        if (i.remove !== void 0) {
          var c = i.remove;
          if (p(c)) return p(n) ? n.filter(function(l) {
            return !c.includes(l);
          }).sort() : [];
          if (typeof c == "number") return Number(n) - c;
          if (typeof c == "bigint") try {
            return BigInt(n) - c;
          } catch {
            return BigInt(0) - c;
          }
          throw new TypeError("Invalid subtrahend ".concat(c));
        }
        return a = (a = i.replacePrefix) == null ? void 0 : a[0], a && typeof n == "string" && n.startsWith(a) ? i.replacePrefix[1] + n.substring(a.length) : n;
      };
      var In = os;
      function os(n) {
        this["@@propmod"] = n;
      }
      function is(n, i) {
        for (var a = f(i), c = a.length, l = !1, d = 0; d < c; ++d) {
          var y = a[d], g = i[y], E = de(n, y);
          g instanceof In ? (ve(n, y, g.execute(E)), l = !0) : E !== g && (ve(n, y, g), l = !0);
        }
        return l;
      }
      Se.prototype._trans = function(n, i, a) {
        var c = this._tx || ie.trans, l = this.name, d = ct && typeof console < "u" && console.createTask && console.createTask("Dexie: ".concat(n === "readonly" ? "read" : "write", " ").concat(this.name));
        function y(B, x, b) {
          if (b.schema[l]) return i(b.idbtrans, b);
          throw new X.NotFound("Table " + l + " not part of transaction");
        }
        var g = cn();
        try {
          var E = c && c.db._novip === this.db._novip ? c === ie.trans ? c._promise(n, y, a) : Bt(function() {
            return c._promise(n, y, a);
          }, { trans: c, transless: ie.transless || ie }) : (function B(x, b, _, R) {
            if (x.idbdb && (x._state.openComplete || ie.letThrough || x._vip)) {
              var A = x._createTransaction(b, _, x._dbSchema);
              try {
                A.create(), x._state.PR1398_maxLoop = 3;
              } catch (k) {
                return k.name === We.InvalidState && x.isOpen() && 0 < --x._state.PR1398_maxLoop ? (console.warn("Dexie: Need to reopen db"), x.close({ disableAutoOpen: !1 }), x.open().then(function() {
                  return B(x, b, _, R);
                })) : qe(k);
              }
              return A._promise(b, function(k, S) {
                return Bt(function() {
                  return ie.trans = A, R(k, S, A);
                });
              }).then(function(k) {
                if (b === "readwrite") try {
                  A.idbtrans.commit();
                } catch {
                }
                return b === "readonly" ? k : A._completion.then(function() {
                  return k;
                });
              });
            }
            if (x._state.openComplete) return qe(new X.DatabaseClosed(x._state.dbOpenError));
            if (!x._state.isBeingOpened) {
              if (!x._state.autoOpen) return qe(new X.DatabaseClosed());
              x.open().catch(_e);
            }
            return x._state.dbReadyPromise.then(function() {
              return B(x, b, _, R);
            });
          })(this.db, n, [this.name], y);
          return d && (E._consoleTask = d, E = E.catch(function(B) {
            return console.trace(B), qe(B);
          })), E;
        } finally {
          g && un();
        }
      }, Se.prototype.get = function(n, i) {
        var a = this;
        return n && n.constructor === Object ? this.where(n).first(i) : n == null ? qe(new X.Type("Invalid argument to Table.get()")) : this._trans("readonly", function(c) {
          return a.core.get({ trans: c, key: n }).then(function(l) {
            return a.hook.reading.fire(l);
          });
        }).then(i);
      }, Se.prototype.where = function(n) {
        if (typeof n == "string") return new this.db.WhereClause(this, n);
        if (p(n)) return new this.db.WhereClause(this, "[".concat(n.join("+"), "]"));
        var i = f(n);
        if (i.length === 1) return this.where(i[0]).equals(n[i[0]]);
        var a = this.schema.indexes.concat(this.schema.primKey).filter(function(g) {
          if (g.compound && i.every(function(B) {
            return 0 <= g.keyPath.indexOf(B);
          })) {
            for (var E = 0; E < i.length; ++E) if (i.indexOf(g.keyPath[E]) === -1) return !1;
            return !0;
          }
          return !1;
        }).sort(function(g, E) {
          return g.keyPath.length - E.keyPath.length;
        })[0];
        if (a && this.db._maxKey !== Wt) return y = a.keyPath.slice(0, i.length), this.where(y).equals(y.map(function(g) {
          return n[g];
        }));
        !a && ct && console.warn("The query ".concat(JSON.stringify(n), " on ").concat(this.name, " would benefit from a ") + "compound index [".concat(i.join("+"), "]"));
        var c = this.schema.idxByName;
        function l(g, E) {
          return me(g, E) === 0;
        }
        var y = i.reduce(function(x, E) {
          var B = x[0], x = x[1], b = c[E], _ = n[E];
          return [B || b, B || !b ? Yt(x, b && b.multi ? function(R) {
            return R = de(R, E), p(R) && R.some(function(A) {
              return l(_, A);
            });
          } : function(R) {
            return l(_, de(R, E));
          }) : x];
        }, [null, null]), d = y[0], y = y[1];
        return d ? this.where(d.name).equals(n[d.keyPath]).filter(y) : a ? this.filter(y) : this.where(i).equals("");
      }, Se.prototype.filter = function(n) {
        return this.toCollection().and(n);
      }, Se.prototype.count = function(n) {
        return this.toCollection().count(n);
      }, Se.prototype.offset = function(n) {
        return this.toCollection().offset(n);
      }, Se.prototype.limit = function(n) {
        return this.toCollection().limit(n);
      }, Se.prototype.each = function(n) {
        return this.toCollection().each(n);
      }, Se.prototype.toArray = function(n) {
        return this.toCollection().toArray(n);
      }, Se.prototype.toCollection = function() {
        return new this.db.Collection(new this.db.WhereClause(this));
      }, Se.prototype.orderBy = function(n) {
        return new this.db.Collection(new this.db.WhereClause(this, p(n) ? "[".concat(n.join("+"), "]") : n));
      }, Se.prototype.reverse = function() {
        return this.toCollection().reverse();
      }, Se.prototype.mapToClass = function(n) {
        for (var i = this.db, a = this.name, c = ((this.schema.mappedClass = n).prototype instanceof ts && (n = ((y) => {
          var g = x, E = y;
          if (typeof E != "function" && E !== null) throw new TypeError("Class extends value " + String(E) + " is not a constructor or null");
          function B() {
            this.constructor = g;
          }
          function x() {
            return y !== null && y.apply(this, arguments) || this;
          }
          return r(g, E), g.prototype = E === null ? Object.create(E) : (B.prototype = E.prototype, new B()), Object.defineProperty(x.prototype, "db", { get: function() {
            return i;
          }, enumerable: !1, configurable: !0 }), x.prototype.table = function() {
            return a;
          }, x;
        })(n)), /* @__PURE__ */ new Set()), l = n.prototype; l; l = m(l)) Object.getOwnPropertyNames(l).forEach(function(y) {
          return c.add(y);
        });
        function d(y) {
          if (!y) return y;
          var g, E = Object.create(n.prototype);
          for (g in y) if (!c.has(g)) try {
            E[g] = y[g];
          } catch {
          }
          return E;
        }
        return this.schema.readHook && this.hook.reading.unsubscribe(this.schema.readHook), this.schema.readHook = d, this.hook("reading", d), n;
      }, Se.prototype.defineClass = function() {
        return this.mapToClass(function(n) {
          h(this, n);
        });
      }, Se.prototype.add = function(n, i) {
        var a = this, c = this.schema.primKey, l = c.auto, d = c.keyPath, y = n;
        return d && l && (y = or(d)(n)), this._trans("readwrite", function(g) {
          return a.core.mutate({ trans: g, type: "add", keys: i != null ? [i] : null, values: [y] });
        }).then(function(g) {
          return g.numFailures ? Y.reject(g.failures[0]) : g.lastResult;
        }).then(function(g) {
          if (d) try {
            ve(n, d, g);
          } catch {
          }
          return g;
        });
      }, Se.prototype.upsert = function(n, i) {
        var a = this, c = this.schema.primKey.keyPath;
        return this._trans("readwrite", function(l) {
          return a.core.get({ trans: l, key: n }).then(function(d) {
            var y = d ?? {};
            return is(y, i), c && ve(y, c, n), a.core.mutate({ trans: l, type: "put", values: [y], keys: [n], upsert: !0, updates: { keys: [n], changeSpecs: [i] } }).then(function(g) {
              return g.numFailures ? Y.reject(g.failures[0]) : !!d;
            });
          });
        });
      }, Se.prototype.update = function(n, i) {
        return typeof n != "object" || p(n) ? this.where(":id").equals(n).modify(i) : (n = de(n, this.schema.primKey.keyPath)) === void 0 ? qe(new X.InvalidArgument("Given object does not contain its primary key")) : this.where(":id").equals(n).modify(i);
      }, Se.prototype.put = function(n, i) {
        var a = this, c = this.schema.primKey, l = c.auto, d = c.keyPath, y = n;
        return d && l && (y = or(d)(n)), this._trans("readwrite", function(g) {
          return a.core.mutate({ trans: g, type: "put", values: [y], keys: i != null ? [i] : null });
        }).then(function(g) {
          return g.numFailures ? Y.reject(g.failures[0]) : g.lastResult;
        }).then(function(g) {
          if (d) try {
            ve(n, d, g);
          } catch {
          }
          return g;
        });
      }, Se.prototype.delete = function(n) {
        var i = this;
        return this._trans("readwrite", function(a) {
          return i.core.mutate({ trans: a, type: "delete", keys: [n] }).then(function(c) {
            return ir(i, [n], c);
          }).then(function(c) {
            return c.numFailures ? Y.reject(c.failures[0]) : void 0;
          });
        });
      }, Se.prototype.clear = function() {
        var n = this;
        return this._trans("readwrite", function(i) {
          return n.core.mutate({ trans: i, type: "deleteRange", range: es }).then(function(a) {
            return ir(n, null, a);
          });
        }).then(function(i) {
          return i.numFailures ? Y.reject(i.failures[0]) : void 0;
        });
      }, Se.prototype.bulkGet = function(n) {
        var i = this;
        return this._trans("readonly", function(a) {
          return i.core.getMany({ keys: n, trans: a }).then(function(c) {
            return c.map(function(l) {
              return i.hook.reading.fire(l);
            });
          });
        });
      }, Se.prototype.bulkAdd = function(n, i, a) {
        var c = this, l = Array.isArray(i) ? i : void 0, d = (a = a || (l ? void 0 : i)) ? a.allKeys : void 0;
        return this._trans("readwrite", function(y) {
          var g = c.schema.primKey, B = g.auto, g = g.keyPath;
          if (g && l) throw new X.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
          if (l && l.length !== n.length) throw new X.InvalidArgument("Arguments objects and keys must have the same length");
          var E = n.length, B = g && B ? n.map(or(g)) : n;
          return c.core.mutate({ trans: y, type: "add", keys: l, values: B, wantResults: d }).then(function(x) {
            var b = x.numFailures, _ = x.failures;
            if (b === 0) return d ? x.results : x.lastResult;
            throw new Te("".concat(c.name, ".bulkAdd(): ").concat(b, " of ").concat(E, " operations failed"), _);
          });
        });
      }, Se.prototype.bulkPut = function(n, i, a) {
        var c = this, l = Array.isArray(i) ? i : void 0, d = (a = a || (l ? void 0 : i)) ? a.allKeys : void 0;
        return this._trans("readwrite", function(y) {
          var g = c.schema.primKey, B = g.auto, g = g.keyPath;
          if (g && l) throw new X.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
          if (l && l.length !== n.length) throw new X.InvalidArgument("Arguments objects and keys must have the same length");
          var E = n.length, B = g && B ? n.map(or(g)) : n;
          return c.core.mutate({ trans: y, type: "put", keys: l, values: B, wantResults: d }).then(function(x) {
            var b = x.numFailures, _ = x.failures;
            if (b === 0) return d ? x.results : x.lastResult;
            throw new Te("".concat(c.name, ".bulkPut(): ").concat(b, " of ").concat(E, " operations failed"), _);
          });
        });
      }, Se.prototype.bulkUpdate = function(n) {
        var i = this, a = this.core, c = n.map(function(y) {
          return y.key;
        }), l = n.map(function(y) {
          return y.changes;
        }), d = [];
        return this._trans("readwrite", function(y) {
          return a.getMany({ trans: y, keys: c, cache: "clone" }).then(function(g) {
            var E = [], B = [], x = (n.forEach(function(b, _) {
              var R = b.key, A = b.changes, k = g[_];
              if (k) {
                for (var S = 0, I = Object.keys(A); S < I.length; S++) {
                  var O = I[S], C = A[O];
                  if (O === i.schema.primKey.keyPath) {
                    if (me(C, R) !== 0) throw new X.Constraint("Cannot update primary key in bulkUpdate()");
                  } else ve(k, O, C);
                }
                d.push(_), E.push(R), B.push(k);
              }
            }), E.length);
            return a.mutate({ trans: y, type: "put", keys: E, values: B, updates: { keys: c, changeSpecs: l } }).then(function(b) {
              var _ = b.numFailures, R = b.failures;
              if (_ === 0) return x;
              for (var A = 0, k = Object.keys(R); A < k.length; A++) {
                var S, I = k[A], O = d[Number(I)];
                O != null && (S = R[I], delete R[I], R[O] = S);
              }
              throw new Te("".concat(i.name, ".bulkUpdate(): ").concat(_, " of ").concat(x, " operations failed"), R);
            });
          });
        });
      }, Se.prototype.bulkDelete = function(n) {
        var i = this, a = n.length;
        return this._trans("readwrite", function(c) {
          return i.core.mutate({ trans: c, type: "delete", keys: n }).then(function(l) {
            return ir(i, n, l);
          });
        }).then(function(c) {
          var l = c.numFailures, d = c.failures;
          if (l === 0) return c.lastResult;
          throw new Te("".concat(i.name, ".bulkDelete(): ").concat(l, " of ").concat(a, " operations failed"), d);
        });
      };
      var ss = Se;
      function Se() {
      }
      function Tn(n) {
        function i(y, g) {
          if (g) {
            for (var E = arguments.length, B = new Array(E - 1); --E; ) B[E - 1] = arguments[E];
            return a[y].subscribe.apply(null, B), n;
          }
          if (typeof y == "string") return a[y];
        }
        var a = {};
        i.addEventType = d;
        for (var c = 1, l = arguments.length; c < l; ++c) d(arguments[c]);
        return i;
        function d(y, g, E) {
          var B, x;
          if (typeof y != "object") return g = g || fu, x = { subscribers: [], fire: E = E || _e, subscribe: function(b) {
            x.subscribers.indexOf(b) === -1 && (x.subscribers.push(b), x.fire = g(x.fire, b));
          }, unsubscribe: function(b) {
            x.subscribers = x.subscribers.filter(function(_) {
              return _ !== b;
            }), x.fire = x.subscribers.reduce(g, E);
          } }, a[y] = i[y] = x;
          f(B = y).forEach(function(b) {
            var _ = B[b];
            if (p(_)) d(b, B[b][0], B[b][1]);
            else {
              if (_ !== "asap") throw new X.InvalidArgument("Invalid event config");
              var R = d(b, Rt, function() {
                for (var A = arguments.length, k = new Array(A); A--; ) k[A] = arguments[A];
                R.subscribers.forEach(function(S) {
                  Ke(function() {
                    S.apply(null, k);
                  });
                });
              });
            }
          });
        }
      }
      function Cn(n, i) {
        return D(i).from({ prototype: n }), i;
      }
      function fn(n, i) {
        return !(n.filter || n.algorithm || n.or) && (i ? n.justLimit : !n.replayFilter);
      }
      function uo(n, i) {
        n.filter = Yt(n.filter, i);
      }
      function lo(n, i, a) {
        var c = n.replayFilter;
        n.replayFilter = c ? function() {
          return Yt(c(), i());
        } : i, n.justLimit = a && !c;
      }
      function sr(n, i) {
        if (n.isPrimKey) return i.primaryKey;
        var a = i.getIndexByKeyPath(n.index);
        if (a) return a;
        throw new X.Schema("KeyPath " + n.index + " on object store " + i.name + " is not indexed");
      }
      function as(n, i, a) {
        var c = sr(n, i.schema);
        return i.openCursor({ trans: a, values: !n.keysOnly, reverse: n.dir === "prev", unique: !!n.unique, query: { index: c, range: n.range } });
      }
      function ar(n, i, a, c) {
        var l, d, y = n.replayFilter ? Yt(n.filter, n.replayFilter()) : n.filter;
        return n.or ? (l = {}, d = function(g, E, B) {
          var x, b;
          y && !y(E, B, function(_) {
            return E.stop(_);
          }, function(_) {
            return E.fail(_);
          }) || ((b = "" + (x = E.primaryKey)) == "[object ArrayBuffer]" && (b = "" + new Uint8Array(x)), w(l, b)) || (l[b] = !0, i(g, E, B));
        }, Promise.all([n.or._iterate(d, a), cs(as(n, c, a), n.algorithm, d, !n.keysOnly && n.valueMapper)])) : cs(as(n, c, a), Yt(n.algorithm, y), i, !n.keysOnly && n.valueMapper);
      }
      function cs(n, i, a, c) {
        var l = Le(c ? function(d, y, g) {
          return a(c(d), y, g);
        } : a);
        return n.then(function(d) {
          if (d) return d.start(function() {
            var y = function() {
              return d.continue();
            };
            i && !i(d, function(g) {
              return y = g;
            }, function(g) {
              d.stop(g), y = _e;
            }, function(g) {
              d.fail(g), y = _e;
            }) || l(d.value, d, function(g) {
              return y = g;
            }), y();
          });
        });
      }
      we.prototype._read = function(n, i) {
        var a = this._ctx;
        return a.error ? a.table._trans(null, qe.bind(null, a.error)) : a.table._trans("readonly", n).then(i);
      }, we.prototype._write = function(n) {
        var i = this._ctx;
        return i.error ? i.table._trans(null, qe.bind(null, i.error)) : i.table._trans("readwrite", n, "locked");
      }, we.prototype._addAlgorithm = function(n) {
        var i = this._ctx;
        i.algorithm = Yt(i.algorithm, n);
      }, we.prototype._iterate = function(n, i) {
        return ar(this._ctx, n, i, this._ctx.table.core);
      }, we.prototype.clone = function(n) {
        var i = Object.create(this.constructor.prototype), a = Object.create(this._ctx);
        return n && h(a, n), i._ctx = a, i;
      }, we.prototype.raw = function() {
        return this._ctx.valueMapper = null, this;
      }, we.prototype.each = function(n) {
        var i = this._ctx;
        return this._read(function(a) {
          return ar(i, n, a, i.table.core);
        });
      }, we.prototype.count = function(n) {
        var i = this;
        return this._read(function(a) {
          var c, l = i._ctx, d = l.table.core;
          return fn(l, !0) ? d.count({ trans: a, query: { index: sr(l, d.schema), range: l.range } }).then(function(y) {
            return Math.min(y, l.limit);
          }) : (c = 0, ar(l, function() {
            return ++c, !1;
          }, a, d).then(function() {
            return c;
          }));
        }).then(n);
      }, we.prototype.sortBy = function(n, i) {
        var a = n.split(".").reverse(), c = a[0], l = a.length - 1;
        function d(E, B) {
          return B ? d(E[a[B]], B - 1) : E[c];
        }
        var y = this._ctx.dir === "next" ? 1 : -1;
        function g(E, B) {
          return me(d(E, l), d(B, l)) * y;
        }
        return this.toArray(function(E) {
          return E.sort(g);
        }).then(i);
      }, we.prototype.toArray = function(n) {
        var i = this;
        return this._read(function(a) {
          var c, l, d, y = i._ctx;
          return fn(y, !0) && 0 < y.limit ? (c = y.valueMapper, l = sr(y, y.table.core.schema), y.table.core.query({ trans: a, limit: y.limit, values: !0, direction: y.dir === "prev" ? "prev" : void 0, query: { index: l, range: y.range } }).then(function(g) {
            return g = g.result, c ? g.map(c) : g;
          })) : (d = [], ar(y, function(g) {
            return d.push(g);
          }, a, y.table.core).then(function() {
            return d;
          }));
        }, n);
      }, we.prototype.offset = function(n) {
        var i = this._ctx;
        return n <= 0 || (i.offset += n, fn(i) ? lo(i, function() {
          var a = n;
          return function(c, l) {
            return a === 0 || (a === 1 ? --a : l(function() {
              c.advance(a), a = 0;
            }), !1);
          };
        }) : lo(i, function() {
          var a = n;
          return function() {
            return --a < 0;
          };
        })), this;
      }, we.prototype.limit = function(n) {
        return this._ctx.limit = Math.min(this._ctx.limit, n), lo(this._ctx, function() {
          var i = n;
          return function(a, c, l) {
            return --i <= 0 && c(l), 0 <= i;
          };
        }, !0), this;
      }, we.prototype.until = function(n, i) {
        return uo(this._ctx, function(a, c, l) {
          return !n(a.value) || (c(l), i);
        }), this;
      }, we.prototype.first = function(n) {
        return this.limit(1).toArray(function(i) {
          return i[0];
        }).then(n);
      }, we.prototype.last = function(n) {
        return this.reverse().first(n);
      }, we.prototype.filter = function(n) {
        var i;
        return uo(this._ctx, function(a) {
          return n(a.value);
        }), (i = this._ctx).isMatch = Yt(i.isMatch, n), this;
      }, we.prototype.and = function(n) {
        return this.filter(n);
      }, we.prototype.or = function(n) {
        return new this.db.WhereClause(this._ctx.table, n, this);
      }, we.prototype.reverse = function() {
        return this._ctx.dir = this._ctx.dir === "prev" ? "next" : "prev", this._ondirectionchange && this._ondirectionchange(this._ctx.dir), this;
      }, we.prototype.desc = function() {
        return this.reverse();
      }, we.prototype.eachKey = function(n) {
        var i = this._ctx;
        return i.keysOnly = !i.isMatch, this.each(function(a, c) {
          n(c.key, c);
        });
      }, we.prototype.eachUniqueKey = function(n) {
        return this._ctx.unique = "unique", this.eachKey(n);
      }, we.prototype.eachPrimaryKey = function(n) {
        var i = this._ctx;
        return i.keysOnly = !i.isMatch, this.each(function(a, c) {
          n(c.primaryKey, c);
        });
      }, we.prototype.keys = function(n) {
        var i = this._ctx, a = (i.keysOnly = !i.isMatch, []);
        return this.each(function(c, l) {
          a.push(l.key);
        }).then(function() {
          return a;
        }).then(n);
      }, we.prototype.primaryKeys = function(n) {
        var i = this._ctx;
        if (fn(i, !0) && 0 < i.limit) return this._read(function(c) {
          var l = sr(i, i.table.core.schema);
          return i.table.core.query({ trans: c, values: !1, limit: i.limit, direction: i.dir === "prev" ? "prev" : void 0, query: { index: l, range: i.range } });
        }).then(function(c) {
          return c.result;
        }).then(n);
        i.keysOnly = !i.isMatch;
        var a = [];
        return this.each(function(c, l) {
          a.push(l.primaryKey);
        }).then(function() {
          return a;
        }).then(n);
      }, we.prototype.uniqueKeys = function(n) {
        return this._ctx.unique = "unique", this.keys(n);
      }, we.prototype.firstKey = function(n) {
        return this.limit(1).keys(function(i) {
          return i[0];
        }).then(n);
      }, we.prototype.lastKey = function(n) {
        return this.reverse().firstKey(n);
      }, we.prototype.distinct = function() {
        var n, i = this._ctx, i = i.index && i.table.schema.idxByName[i.index];
        return i && i.multi && (n = {}, uo(this._ctx, function(c) {
          var c = c.primaryKey.toString(), l = w(n, c);
          return n[c] = !0, !l;
        })), this;
      }, we.prototype.modify = function(n) {
        var i = this, a = this._ctx;
        return this._write(function(c) {
          function l(k, S) {
            var I = S.failures;
            _ += k - S.numFailures;
            for (var O = 0, C = f(I); O < C.length; O++) {
              var q = C[O];
              b.push(I[q]);
            }
          }
          var d = typeof n == "function" ? n : function(k) {
            return is(k, n);
          }, y = a.table.core, x = y.schema.primaryKey, g = x.outbound, E = x.extractKey, B = 200, x = i.db._options.modifyChunkSize, b = (x && (B = typeof x == "object" ? x[y.name] || x["*"] || 200 : x), []), _ = 0, R = [], A = n === us;
          return i.clone().primaryKeys().then(function(k) {
            function S(O) {
              var C = Math.min(B, k.length - O), q = k.slice(O, O + C);
              return (A ? Promise.resolve([]) : y.getMany({ trans: c, keys: q, cache: "immutable" })).then(function(U) {
                var z = [], H = [], te = g ? [] : null, V = A ? q : [];
                if (!A) for (var re = 0; re < C; ++re) {
                  var $ = U[re], ce = { value: K($), primKey: k[O + re] };
                  d.call(ce, ce.value, ce) !== !1 && (ce.value == null ? V.push(k[O + re]) : g || me(E($), E(ce.value)) === 0 ? (H.push(ce.value), g && te.push(k[O + re])) : (V.push(k[O + re]), z.push(ce.value)));
                }
                return Promise.resolve(0 < z.length && y.mutate({ trans: c, type: "add", values: z }).then(function(ue) {
                  for (var pe in ue.failures) V.splice(parseInt(pe), 1);
                  l(z.length, ue);
                })).then(function() {
                  return (0 < H.length || I && typeof n == "object") && y.mutate({ trans: c, type: "put", keys: te, values: H, criteria: I, changeSpec: typeof n != "function" && n, isAdditionalChunk: 0 < O }).then(function(ue) {
                    return l(H.length, ue);
                  });
                }).then(function() {
                  return (0 < V.length || I && A) && y.mutate({ trans: c, type: "delete", keys: V, criteria: I, isAdditionalChunk: 0 < O }).then(function(ue) {
                    return ir(a.table, V, ue);
                  }).then(function(ue) {
                    return l(V.length, ue);
                  });
                }).then(function() {
                  return k.length > O + C && S(O + B);
                });
              });
            }
            var I = fn(a) && a.limit === 1 / 0 && (typeof n != "function" || A) && { index: a.index, range: a.range };
            return S(0).then(function() {
              if (0 < b.length) throw new xe("Error modifying one or more objects", b, _, R);
              return k.length;
            });
          });
        });
      }, we.prototype.delete = function() {
        var n = this._ctx, i = n.range;
        return !fn(n) || n.table.schema.yProps || !n.isPrimKey && i.type !== 3 ? this.modify(us) : this._write(function(a) {
          var c = n.table.core.schema.primaryKey, l = i;
          return n.table.core.count({ trans: a, query: { index: c, range: l } }).then(function(d) {
            return n.table.core.mutate({ trans: a, type: "deleteRange", range: l }).then(function(E) {
              var g = E.failures, E = E.numFailures;
              if (E) throw new xe("Could not delete some values", Object.keys(g).map(function(B) {
                return g[B];
              }), d - E);
              return d - E;
            });
          });
        });
      };
      var mu = we;
      function we() {
      }
      var us = function(n, i) {
        return i.value = null;
      };
      function vu(n, i) {
        return n < i ? -1 : n === i ? 0 : 1;
      }
      function wu(n, i) {
        return i < n ? -1 : n === i ? 0 : 1;
      }
      function tt(n, i, a) {
        return n = n instanceof fs ? new n.Collection(n) : n, n._ctx.error = new (a || TypeError)(i), n;
      }
      function dn(n) {
        return new n.Collection(n, function() {
          return ls("");
        }).limit(0);
      }
      function cr(R, i, a, c) {
        var l, d, y, g, E, B, x, b = a.length;
        if (!a.every(function(k) {
          return typeof k == "string";
        })) return tt(R, Qi);
        function _(k) {
          l = k === "next" ? function(I) {
            return I.toUpperCase();
          } : function(I) {
            return I.toLowerCase();
          }, d = k === "next" ? function(I) {
            return I.toLowerCase();
          } : function(I) {
            return I.toUpperCase();
          }, y = k === "next" ? vu : wu;
          var S = a.map(function(I) {
            return { lower: d(I), upper: l(I) };
          }).sort(function(I, O) {
            return y(I.lower, O.lower);
          });
          g = S.map(function(I) {
            return I.upper;
          }), E = S.map(function(I) {
            return I.lower;
          }), x = (B = k) === "next" ? "" : c;
        }
        _("next");
        var R = new R.Collection(R, function() {
          return Tt(g[0], E[b - 1] + c);
        }), A = (R._ondirectionchange = function(k) {
          _(k);
        }, 0);
        return R._addAlgorithm(function(k, S, I) {
          var O = k.key;
          if (typeof O == "string") {
            var C = d(O);
            if (i(C, E, A)) return !0;
            for (var q = null, U = A; U < b; ++U) {
              var z = ((H, te, V, re, $, ce) => {
                for (var ue = Math.min(H.length, re.length), pe = -1, ye = 0; ye < ue; ++ye) {
                  var nt = te[ye];
                  if (nt !== re[ye]) return $(H[ye], V[ye]) < 0 ? H.substr(0, ye) + V[ye] + V.substr(ye + 1) : $(H[ye], re[ye]) < 0 ? H.substr(0, ye) + re[ye] + V.substr(ye + 1) : 0 <= pe ? H.substr(0, pe) + te[pe] + V.substr(pe + 1) : null;
                  $(H[ye], nt) < 0 && (pe = ye);
                }
                return ue < re.length && ce === "next" ? H + V.substr(H.length) : ue < H.length && ce === "prev" ? H.substr(0, V.length) : pe < 0 ? null : H.substr(0, pe) + re[pe] + V.substr(pe + 1);
              })(O, C, g[U], E[U], y, B);
              z === null && q === null ? A = U + 1 : (q === null || 0 < y(q, z)) && (q = z);
            }
            S(q !== null ? function() {
              k.continue(q + x);
            } : I);
          }
          return !1;
        }), R;
      }
      function Tt(n, i, a, c) {
        return { type: 2, lower: n, upper: i, lowerOpen: a, upperOpen: c };
      }
      function ls(n) {
        return { type: 1, lower: n, upper: n };
      }
      Object.defineProperty(Me.prototype, "Collection", { get: function() {
        return this._ctx.table.db.Collection;
      }, enumerable: !1, configurable: !0 }), Me.prototype.between = function(n, i, a, c) {
        a = a !== !1, c = c === !0;
        try {
          return 0 < this._cmp(n, i) || this._cmp(n, i) === 0 && (a || c) && (!a || !c) ? dn(this) : new this.Collection(this, function() {
            return Tt(n, i, !a, !c);
          });
        } catch {
          return tt(this, mt);
        }
      }, Me.prototype.equals = function(n) {
        return n == null ? tt(this, mt) : new this.Collection(this, function() {
          return ls(n);
        });
      }, Me.prototype.above = function(n) {
        return n == null ? tt(this, mt) : new this.Collection(this, function() {
          return Tt(n, void 0, !0);
        });
      }, Me.prototype.aboveOrEqual = function(n) {
        return n == null ? tt(this, mt) : new this.Collection(this, function() {
          return Tt(n, void 0, !1);
        });
      }, Me.prototype.below = function(n) {
        return n == null ? tt(this, mt) : new this.Collection(this, function() {
          return Tt(void 0, n, !1, !0);
        });
      }, Me.prototype.belowOrEqual = function(n) {
        return n == null ? tt(this, mt) : new this.Collection(this, function() {
          return Tt(void 0, n);
        });
      }, Me.prototype.startsWith = function(n) {
        return typeof n != "string" ? tt(this, Qi) : this.between(n, n + Wt, !0, !0);
      }, Me.prototype.startsWithIgnoreCase = function(n) {
        return n === "" ? this.startsWith(n) : cr(this, function(i, a) {
          return i.indexOf(a[0]) === 0;
        }, [n], Wt);
      }, Me.prototype.equalsIgnoreCase = function(n) {
        return cr(this, function(i, a) {
          return i === a[0];
        }, [n], "");
      }, Me.prototype.anyOfIgnoreCase = function() {
        var n = W.apply(Q, arguments);
        return n.length === 0 ? dn(this) : cr(this, function(i, a) {
          return a.indexOf(i) !== -1;
        }, n, "");
      }, Me.prototype.startsWithAnyOfIgnoreCase = function() {
        var n = W.apply(Q, arguments);
        return n.length === 0 ? dn(this) : cr(this, function(i, a) {
          return a.some(function(c) {
            return i.indexOf(c) === 0;
          });
        }, n, Wt);
      }, Me.prototype.anyOf = function() {
        var n, i, a = this, c = W.apply(Q, arguments), l = this._cmp;
        try {
          c.sort(l);
        } catch {
          return tt(this, mt);
        }
        return c.length === 0 ? dn(this) : ((n = new this.Collection(this, function() {
          return Tt(c[0], c[c.length - 1]);
        }))._ondirectionchange = function(d) {
          l = d === "next" ? a._ascending : a._descending, c.sort(l);
        }, i = 0, n._addAlgorithm(function(d, y, g) {
          for (var E = d.key; 0 < l(E, c[i]); ) if (++i === c.length) return y(g), !1;
          return l(E, c[i]) === 0 || (y(function() {
            d.continue(c[i]);
          }), !1);
        }), n);
      }, Me.prototype.notEqual = function(n) {
        return this.inAnyRange([[-1 / 0, n], [n, this.db._maxKey]], { includeLowers: !1, includeUppers: !1 });
      }, Me.prototype.noneOf = function() {
        var n = W.apply(Q, arguments);
        if (n.length === 0) return new this.Collection(this);
        try {
          n.sort(this._ascending);
        } catch {
          return tt(this, mt);
        }
        var i = n.reduce(function(a, c) {
          return a ? a.concat([[a[a.length - 1][1], c]]) : [[-1 / 0, c]];
        }, null);
        return i.push([n[n.length - 1], this.db._maxKey]), this.inAnyRange(i, { includeLowers: !1, includeUppers: !1 });
      }, Me.prototype.inAnyRange = function(n, I) {
        var a = this, c = this._cmp, l = this._ascending, d = this._descending, y = this._min, g = this._max;
        if (n.length === 0) return dn(this);
        if (!n.every(function(O) {
          return O[0] !== void 0 && O[1] !== void 0 && l(O[0], O[1]) <= 0;
        })) return tt(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", X.InvalidArgument);
        var E = !I || I.includeLowers !== !1, B = I && I.includeUppers === !0, x, b = l;
        function _(O, C) {
          return b(O[0], C[0]);
        }
        try {
          (x = n.reduce(function(O, C) {
            for (var q = 0, U = O.length; q < U; ++q) {
              var z = O[q];
              if (c(C[0], z[1]) < 0 && 0 < c(C[1], z[0])) {
                z[0] = y(z[0], C[0]), z[1] = g(z[1], C[1]);
                break;
              }
            }
            return q === U && O.push(C), O;
          }, [])).sort(_);
        } catch {
          return tt(this, mt);
        }
        var R = 0, A = B ? function(O) {
          return 0 < l(O, x[R][1]);
        } : function(O) {
          return 0 <= l(O, x[R][1]);
        }, k = E ? function(O) {
          return 0 < d(O, x[R][0]);
        } : function(O) {
          return 0 <= d(O, x[R][0]);
        }, S = A, I = new this.Collection(this, function() {
          return Tt(x[0][0], x[x.length - 1][1], !E, !B);
        });
        return I._ondirectionchange = function(O) {
          b = O === "next" ? (S = A, l) : (S = k, d), x.sort(_);
        }, I._addAlgorithm(function(O, C, q) {
          for (var U, z = O.key; S(z); ) if (++R === x.length) return C(q), !1;
          return !A(U = z) && !k(U) || (a._cmp(z, x[R][1]) === 0 || a._cmp(z, x[R][0]) === 0 || C(function() {
            b === l ? O.continue(x[R][0]) : O.continue(x[R][1]);
          }), !1);
        }), I;
      }, Me.prototype.startsWithAnyOf = function() {
        var n = W.apply(Q, arguments);
        return n.every(function(i) {
          return typeof i == "string";
        }) ? n.length === 0 ? dn(this) : this.inAnyRange(n.map(function(i) {
          return [i, i + Wt];
        })) : tt(this, "startsWithAnyOf() only works with strings");
      };
      var fs = Me;
      function Me() {
      }
      function st(n) {
        return Le(function(i) {
          return Ln(i), n(i.target.error), !1;
        });
      }
      function Ln(n) {
        n.stopPropagation && n.stopPropagation(), n.preventDefault && n.preventDefault();
      }
      var Pn = "storagemutated", fo = "x-storagemutated-1", Ct = Tn(null, Pn), bu = (ut.prototype._lock = function() {
        return ae(!ie.global), ++this._reculock, this._reculock !== 1 || ie.global || (ie.lockOwnerFor = this), this;
      }, ut.prototype._unlock = function() {
        if (ae(!ie.global), --this._reculock == 0) for (ie.global || (ie.lockOwnerFor = null); 0 < this._blockedFuncs.length && !this._locked(); ) {
          var n = this._blockedFuncs.shift();
          try {
            Gt(n[1], n[0]);
          } catch {
          }
        }
        return this;
      }, ut.prototype._locked = function() {
        return this._reculock && ie.lockOwnerFor !== this;
      }, ut.prototype.create = function(n) {
        var i = this;
        if (this.mode) {
          var a = this.db.idbdb, c = this.db._state.dbOpenError;
          if (ae(!this.idbtrans), !n && !a) switch (c && c.name) {
            case "DatabaseClosedError":
              throw new X.DatabaseClosed(c);
            case "MissingAPIError":
              throw new X.MissingAPI(c.message, c);
            default:
              throw new X.OpenFailed(c);
          }
          if (!this.active) throw new X.TransactionInactive();
          ae(this._completion._state === null), (n = this.idbtrans = n || (this.db.core || a).transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability })).onerror = Le(function(l) {
            Ln(l), i._reject(n.error);
          }), n.onabort = Le(function(l) {
            Ln(l), i.active && i._reject(new X.Abort(n.error)), i.active = !1, i.on("abort").fire(l);
          }), n.oncomplete = Le(function() {
            i.active = !1, i._resolve(), "mutatedParts" in n && Ct.storagemutated.fire(n.mutatedParts);
          });
        }
        return this;
      }, ut.prototype._promise = function(n, i, a) {
        var c, l = this;
        return n === "readwrite" && this.mode !== "readwrite" ? qe(new X.ReadOnly("Transaction is readonly")) : this.active ? this._locked() ? new Y(function(d, y) {
          l._blockedFuncs.push([function() {
            l._promise(n, i, a).then(d, y);
          }, ie]);
        }) : a ? Bt(function() {
          var d = new Y(function(y, g) {
            l._lock();
            var E = i(y, g, l);
            E && E.then && E.then(y, g);
          });
          return d.finally(function() {
            return l._unlock();
          }), d._lib = !0, d;
        }) : ((c = new Y(function(d, y) {
          var g = i(d, y, l);
          g && g.then && g.then(d, y);
        }))._lib = !0, c) : qe(new X.TransactionInactive());
      }, ut.prototype._root = function() {
        return this.parent ? this.parent._root() : this;
      }, ut.prototype.waitFor = function(n) {
        var i, a = this._root(), c = Y.resolve(n), l = (a._waitingFor ? a._waitingFor = a._waitingFor.then(function() {
          return c;
        }) : (a._waitingFor = c, a._waitingQueue = [], i = a.idbtrans.objectStore(a.storeNames[0]), (function d() {
          for (++a._spinCount; a._waitingQueue.length; ) a._waitingQueue.shift()();
          a._waitingFor && (i.get(-1 / 0).onsuccess = d);
        })()), a._waitingFor);
        return new Y(function(d, y) {
          c.then(function(g) {
            return a._waitingQueue.push(Le(d.bind(null, g)));
          }, function(g) {
            return a._waitingQueue.push(Le(y.bind(null, g)));
          }).finally(function() {
            a._waitingFor === l && (a._waitingFor = null);
          });
        });
      }, ut.prototype.abort = function() {
        this.active && (this.active = !1, this.idbtrans && this.idbtrans.abort(), this._reject(new X.Abort()));
      }, ut.prototype.table = function(n) {
        var i = this._memoizedTables || (this._memoizedTables = {});
        if (w(i, n)) return i[n];
        var a = this.schema[n];
        if (a) return (a = new this.db.Table(n, a, this)).core = this.db.core.table(n), i[n] = a;
        throw new X.NotFound("Table " + n + " not part of transaction");
      }, ut);
      function ut() {
      }
      function ho(n, i, a, c, l, d, y, g) {
        return { name: n, keyPath: i, unique: a, multi: c, auto: l, compound: d, src: (a && !y ? "&" : "") + (c ? "*" : "") + (l ? "++" : "") + ds(i), type: g };
      }
      function ds(n) {
        return typeof n == "string" ? n : n ? "[" + [].join.call(n, "+") + "]" : "";
      }
      function po(n, i, a) {
        return { name: n, primKey: i, indexes: a, mappedClass: null, idxByName: (c = function(l) {
          return [l.name, l];
        }, a.reduce(function(l, d, y) {
          return d = c(d, y), d && (l[d[0]] = d[1]), l;
        }, {})) };
        var c;
      }
      var Nn = function(n) {
        try {
          return n.only([[]]), Nn = function() {
            return [[]];
          }, [[]];
        } catch {
          return Nn = function() {
            return Wt;
          }, Wt;
        }
      };
      function yo(n) {
        return n == null ? function() {
        } : typeof n == "string" ? (i = n).split(".").length === 1 ? function(a) {
          return a[i];
        } : function(a) {
          return de(a, i);
        } : function(a) {
          return de(a, n);
        };
        var i;
      }
      function hs(n) {
        return [].slice.call(n);
      }
      var Eu = 0;
      function Dn(n) {
        return n == null ? ":id" : typeof n == "string" ? n : "[".concat(n.join("+"), "]");
      }
      function _u(n, i, y) {
        function c(S) {
          if (S.type === 3) return null;
          if (S.type === 4) throw new Error("Cannot convert never type to IDBKeyRange");
          var R = S.lower, A = S.upper, k = S.lowerOpen, S = S.upperOpen;
          return R === void 0 ? A === void 0 ? null : i.upperBound(A, !!S) : A === void 0 ? i.lowerBound(R, !!k) : i.bound(R, A, !!k, !!S);
        }
        function l(_) {
          var R, A, k = _.name;
          return { name: k, schema: _, mutate: function(S) {
            var I = S.trans, O = S.type, C = S.keys, q = S.values, U = S.range;
            return new Promise(function(z, H) {
              z = Le(z);
              var te = I.objectStore(k), V = te.keyPath == null, re = O === "put" || O === "add";
              if (!re && O !== "delete" && O !== "deleteRange") throw new Error("Invalid operation type: " + O);
              var $, ce = (C || q || { length: 1 }).length;
              if (C && q && C.length !== q.length) throw new Error("Given keys array must have same length as given values array.");
              if (ce === 0) return z({ numFailures: 0, failures: {}, results: [], lastResult: void 0 });
              function ue(Ze) {
                ++nt, Ln(Ze);
              }
              var pe = [], ye = [], nt = 0;
              if (O === "deleteRange") {
                if (U.type === 4) return z({ numFailures: nt, failures: ye, results: [], lastResult: void 0 });
                U.type === 3 ? pe.push($ = te.clear()) : pe.push($ = te.delete(c(U)));
              } else {
                var V = re ? V ? [q, C] : [q, null] : [C, null], he = V[0], Fe = V[1];
                if (re) for (var He = 0; He < ce; ++He) pe.push($ = Fe && Fe[He] !== void 0 ? te[O](he[He], Fe[He]) : te[O](he[He])), $.onerror = ue;
                else for (He = 0; He < ce; ++He) pe.push($ = te[O](he[He])), $.onerror = ue;
              }
              function br(Ze) {
                Ze = Ze.target.result, pe.forEach(function(Qt, Lo) {
                  return Qt.error != null && (ye[Lo] = Qt.error);
                }), z({ numFailures: nt, failures: ye, results: O === "delete" ? C : pe.map(function(Qt) {
                  return Qt.result;
                }), lastResult: Ze });
              }
              $.onerror = function(Ze) {
                ue(Ze), br(Ze);
              }, $.onsuccess = br;
            });
          }, getMany: function(S) {
            var I = S.trans, O = S.keys;
            return new Promise(function(C, q) {
              C = Le(C);
              for (var U, z = I.objectStore(k), H = O.length, te = new Array(H), V = 0, re = 0, $ = function(pe) {
                pe = pe.target, te[pe._pos] = pe.result, ++re === V && C(te);
              }, ce = st(q), ue = 0; ue < H; ++ue) O[ue] != null && ((U = z.get(O[ue]))._pos = ue, U.onsuccess = $, U.onerror = ce, ++V);
              V === 0 && C(te);
            });
          }, get: function(S) {
            var I = S.trans, O = S.key;
            return new Promise(function(C, q) {
              C = Le(C);
              var U = I.objectStore(k).get(O);
              U.onsuccess = function(z) {
                return C(z.target.result);
              }, U.onerror = st(q);
            });
          }, query: (R = E, A = B, function(S) {
            return new Promise(function(I, O) {
              I = Le(I);
              var C, q, U, z, ce = S.trans, H = S.values, te = S.limit, $ = S.query, V = (V = S.direction) != null ? V : "next", re = te === 1 / 0 ? void 0 : te, ue = $.index, $ = $.range, ce = ce.objectStore(k), ce = ue.isPrimaryKey ? ce : ce.index(ue.name), ue = c($);
              if (te === 0) return I({ result: [] });
              A ? ($ = { query: ue, count: re, direction: V }, (C = H ? ce.getAll($) : ce.getAllKeys($)).onsuccess = function(pe) {
                return I({ result: pe.target.result });
              }, C.onerror = st(O)) : R && V === "next" ? ((C = H ? ce.getAll(ue, re) : ce.getAllKeys(ue, re)).onsuccess = function(pe) {
                return I({ result: pe.target.result });
              }, C.onerror = st(O)) : (q = 0, U = !H && "openKeyCursor" in ce ? ce.openKeyCursor(ue, V) : ce.openCursor(ue, V), z = [], U.onsuccess = function() {
                var pe = U.result;
                return !pe || (z.push(H ? pe.value : pe.primaryKey), ++q === te) ? I({ result: z }) : void pe.continue();
              }, U.onerror = st(O));
            });
          }), openCursor: function(S) {
            var I = S.trans, O = S.values, C = S.query, q = S.reverse, U = S.unique;
            return new Promise(function(z, H) {
              z = Le(z);
              var re = C.index, te = C.range, V = I.objectStore(k), V = re.isPrimaryKey ? V : V.index(re.name), re = q ? U ? "prevunique" : "prev" : U ? "nextunique" : "next", $ = !O && "openKeyCursor" in V ? V.openKeyCursor(c(te), re) : V.openCursor(c(te), re);
              $.onerror = st(H), $.onsuccess = Le(function(ce) {
                var ue, pe, ye, nt, he = $.result;
                he ? (he.___id = ++Eu, he.done = !1, ue = he.continue.bind(he), pe = (pe = he.continuePrimaryKey) && pe.bind(he), ye = he.advance.bind(he), nt = function() {
                  throw new Error("Cursor not stopped");
                }, he.trans = I, he.stop = he.continue = he.continuePrimaryKey = he.advance = function() {
                  throw new Error("Cursor not started");
                }, he.fail = Le(H), he.next = function() {
                  var Fe = this, He = 1;
                  return this.start(function() {
                    return He-- ? Fe.continue() : Fe.stop();
                  }).then(function() {
                    return Fe;
                  });
                }, he.start = function(Fe) {
                  function He() {
                    if ($.result) try {
                      Fe();
                    } catch (Ze) {
                      he.fail(Ze);
                    }
                    else he.done = !0, he.start = function() {
                      throw new Error("Cursor behind last entry");
                    }, he.stop();
                  }
                  var br = new Promise(function(Ze, Qt) {
                    Ze = Le(Ze), $.onerror = st(Qt), he.fail = Qt, he.stop = function(Lo) {
                      he.stop = he.continue = he.continuePrimaryKey = he.advance = nt, Ze(Lo);
                    };
                  });
                  return $.onsuccess = Le(function(Ze) {
                    $.onsuccess = He, He();
                  }), he.continue = ue, he.continuePrimaryKey = pe, he.advance = ye, He(), br;
                }, z(he)) : z(null);
              }, H);
            });
          }, count: function(S) {
            var I = S.query, O = S.trans, C = I.index, q = I.range;
            return new Promise(function(U, z) {
              var H = O.objectStore(k), H = C.isPrimaryKey ? H : H.index(C.name), te = c(q), te = te ? H.count(te) : H.count();
              te.onsuccess = Le(function(V) {
                return U(V.target.result);
              }), te.onerror = st(z);
            });
          } };
        }
        d = y, g = hs((y = n).objectStoreNames), x = 0 < g.length ? d.objectStore(g[0]) : {};
        var d, y = { schema: { name: y.name, tables: g.map(function(_) {
          return d.objectStore(_);
        }).map(function(_) {
          var R = _.keyPath, A = _.autoIncrement, S = p(R), k = {}, S = { name: _.name, primaryKey: { name: null, isPrimaryKey: !0, outbound: R == null, compound: S, keyPath: R, autoIncrement: A, unique: !0, extractKey: yo(R) }, indexes: hs(_.indexNames).map(function(I) {
            return _.index(I);
          }).map(function(q) {
            var U = q.name, O = q.unique, C = q.multiEntry, q = q.keyPath, U = { name: U, compound: p(q), keyPath: q, unique: O, multiEntry: C, extractKey: yo(q) };
            return k[Dn(q)] = U;
          }), getIndexByKeyPath: function(I) {
            return k[Dn(I)];
          } };
          return k[":id"] = S.primaryKey, R != null && (k[Dn(R)] = S.primaryKey), S;
        }) }, hasGetAll: 0 < g.length && "getAll" in x && !(typeof navigator < "u" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604), hasIdb3Features: "getAllRecords" in x }, g = y.schema, E = y.hasGetAll, B = y.hasIdb3Features, x = g.tables.map(l), b = {};
        return x.forEach(function(_) {
          return b[_.name] = _;
        }), { stack: "dbcore", transaction: n.transaction.bind(n), table: function(_) {
          if (b[_]) return b[_];
          throw new Error("Table '".concat(_, "' not found"));
        }, MIN_KEY: -1 / 0, MAX_KEY: Nn(i), schema: g };
      }
      function xu(n, i, a, c) {
        return a = a.IDBKeyRange, i = _u(i, a, c), { dbcore: n.dbcore.reduce(function(l, d) {
          return d = d.create, o(o({}, l), d(l));
        }, i) };
      }
      function ur(n, i) {
        var a = i.db, a = xu(n._middlewares, a, n._deps, i);
        n.core = a.dbcore, n.tables.forEach(function(c) {
          var l = c.name;
          n.core.schema.tables.some(function(d) {
            return d.name === l;
          }) && (c.core = n.core.table(l), n[l] instanceof n.Table) && (n[l].core = c.core);
        });
      }
      function lr(n, i, a, c) {
        a.forEach(function(l) {
          var d = c[l];
          i.forEach(function(y) {
            var g = (function E(B, x) {
              return F(B, x) || (B = m(B)) && E(B, x);
            })(y, l);
            (!g || "value" in g && g.value === void 0) && (y === n.Transaction.prototype || y instanceof n.Transaction ? L(y, l, { get: function() {
              return this.table(l);
            }, set: function(E) {
              T(this, l, { value: E, writable: !0, configurable: !0, enumerable: !0 });
            } }) : y[l] = new n.Table(l, d));
          });
        });
      }
      function go(n, i) {
        i.forEach(function(a) {
          for (var c in a) a[c] instanceof n.Table && delete a[c];
        });
      }
      function Au(n, i) {
        return n._cfg.version - i._cfg.version;
      }
      function ku(n, i, a, c) {
        var l = n._dbSchema, d = (a.objectStoreNames.contains("$meta") && !l.$meta && (l.$meta = po("$meta", ys("")[0], []), n._storeNames.push("$meta")), n._createTransaction("readwrite", n._storeNames, l)), y = (d.create(a), d._completion.catch(c), d._reject.bind(d)), g = ie.transless || ie;
        Bt(function() {
          if (ie.trans = d, ie.transless = g, i !== 0) return ur(n, a), B = i, ((E = d).storeNames.includes("$meta") ? E.table("$meta").get("version").then(function(x) {
            return x ?? B;
          }) : Y.resolve(B)).then(function(S) {
            var b = n, _ = S, R = d, A = a, k = [], S = b._versions, I = b._dbSchema = dr(0, b.idbdb, A);
            return (S = S.filter(function(O) {
              return O._cfg.version >= _;
            })).length === 0 ? Y.resolve() : (S.forEach(function(O) {
              k.push(function() {
                var C, q, U, z = I, H = O._cfg.dbschema, te = (hr(b, z, A), hr(b, H, A), I = b._dbSchema = H, mo(z, H)), V = (te.add.forEach(function(re) {
                  vo(A, re[0], re[1].primKey, re[1].indexes);
                }), te.change.forEach(function(re) {
                  if (re.recreate) throw new X.Upgrade("Not yet support for changing primary key");
                  var $ = A.objectStore(re.name);
                  re.add.forEach(function(ce) {
                    return fr($, ce);
                  }), re.change.forEach(function(ce) {
                    $.deleteIndex(ce.name), fr($, ce);
                  }), re.del.forEach(function(ce) {
                    return $.deleteIndex(ce);
                  });
                }), O._cfg.contentUpgrade);
                if (V && O._cfg.version > _) return ur(b, A), R._memoizedTables = {}, C = Be(H), te.del.forEach(function(re) {
                  C[re] = z[re];
                }), go(b, [b.Transaction.prototype]), lr(b, [b.Transaction.prototype], f(C), C), R.schema = C, (q = oe(V)) && ln(), H = Y.follow(function() {
                  var re;
                  (U = V(R)) && q && (re = Ot.bind(null, null), U.then(re, re));
                }), U && typeof U.then == "function" ? Y.resolve(U) : H.then(function() {
                  return U;
                });
              }), k.push(function(C) {
                var q, U, z = O._cfg.dbschema;
                q = z, U = C, [].slice.call(U.db.objectStoreNames).forEach(function(H) {
                  return q[H] == null && U.db.deleteObjectStore(H);
                }), go(b, [b.Transaction.prototype]), lr(b, [b.Transaction.prototype], b._storeNames, b._dbSchema), R.schema = b._dbSchema;
              }), k.push(function(C) {
                b.idbdb.objectStoreNames.contains("$meta") && (Math.ceil(b.idbdb.version / 10) === O._cfg.version ? (b.idbdb.deleteObjectStore("$meta"), delete b._dbSchema.$meta, b._storeNames = b._storeNames.filter(function(q) {
                  return q !== "$meta";
                })) : C.objectStore("$meta").put(O._cfg.version, "version"));
              });
            }), (function O() {
              return k.length ? Y.resolve(k.shift()(R.idbtrans)).then(O) : Y.resolve();
            })().then(function() {
              ps(I, A);
            }));
          }).catch(y);
          var E, B;
          f(l).forEach(function(x) {
            vo(a, x, l[x].primKey, l[x].indexes);
          }), ur(n, a), Y.follow(function() {
            return n.on.populate.fire(d);
          }).catch(y);
        });
      }
      function Su(n, i) {
        ps(n._dbSchema, i), i.db.version % 10 != 0 || i.objectStoreNames.contains("$meta") || i.db.createObjectStore("$meta").add(Math.ceil(i.db.version / 10 - 1), "version");
        var a = dr(0, n.idbdb, i);
        hr(n, n._dbSchema, i);
        for (var c = 0, l = mo(a, n._dbSchema).change; c < l.length; c++) {
          var d = ((y) => {
            if (y.change.length || y.recreate) return console.warn("Unable to patch indexes of table ".concat(y.name, " because it has changes on the type of index or primary key.")), { value: void 0 };
            var g = i.objectStore(y.name);
            y.add.forEach(function(E) {
              ct && console.debug("Dexie upgrade patch: Creating missing index ".concat(y.name, ".").concat(E.src)), fr(g, E);
            });
          })(l[c]);
          if (typeof d == "object") return d.value;
        }
      }
      function mo(n, i) {
        var a, c = { del: [], add: [], change: [] };
        for (a in n) i[a] || c.del.push(a);
        for (a in i) {
          var l = n[a], d = i[a];
          if (l) {
            var y = { name: a, def: d, recreate: !1, del: [], add: [], change: [] };
            if ("" + (l.primKey.keyPath || "") != "" + (d.primKey.keyPath || "") || l.primKey.auto !== d.primKey.auto) y.recreate = !0, c.change.push(y);
            else {
              var g = l.idxByName, E = d.idxByName, B = void 0;
              for (B in g) E[B] || y.del.push(B);
              for (B in E) {
                var x = g[B], b = E[B];
                x ? x.src !== b.src && y.change.push(b) : y.add.push(b);
              }
              (0 < y.del.length || 0 < y.add.length || 0 < y.change.length) && c.change.push(y);
            }
          } else c.add.push([a, d]);
        }
        return c;
      }
      function vo(n, i, a, c) {
        var l = n.db.createObjectStore(i, a.keyPath ? { keyPath: a.keyPath, autoIncrement: a.auto } : { autoIncrement: a.auto });
        c.forEach(function(d) {
          return fr(l, d);
        });
      }
      function ps(n, i) {
        f(n).forEach(function(a) {
          i.db.objectStoreNames.contains(a) || (ct && console.debug("Dexie: Creating missing table", a), vo(i, a, n[a].primKey, n[a].indexes));
        });
      }
      function fr(n, i) {
        n.createIndex(i.name, i.keyPath, { unique: i.unique, multiEntry: i.multi });
      }
      function dr(n, i, a) {
        var c = {};
        return M(i.objectStoreNames, 0).forEach(function(l) {
          for (var d = a.objectStore(l), y = ho(ds(B = d.keyPath), B || "", !0, !1, !!d.autoIncrement, B && typeof B != "string", !0), g = [], E = 0; E < d.indexNames.length; ++E) {
            var x = d.index(d.indexNames[E]), B = x.keyPath, x = ho(x.name, B, !!x.unique, !!x.multiEntry, !1, B && typeof B != "string", !1);
            g.push(x);
          }
          c[l] = po(l, y, g);
        }), c;
      }
      function hr(n, i, a) {
        for (var c = a.db.objectStoreNames, l = 0; l < c.length; ++l) {
          var d = c[l], y = a.objectStore(d);
          n._hasGetAll = "getAll" in y;
          for (var g = 0; g < y.indexNames.length; ++g) {
            var E, B = y.indexNames[g], x = y.index(B).keyPath, x = typeof x == "string" ? x : "[" + M(x).join("+") + "]";
            i[d] && (E = i[d].idxByName[x]) && (E.name = B, delete i[d].idxByName[x], i[d].idxByName[B] = E);
          }
        }
        typeof navigator < "u" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && u.WorkerGlobalScope && u instanceof u.WorkerGlobalScope && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604 && (n._hasGetAll = !1);
      }
      function ys(n) {
        return n.split(",").map(function(i, a) {
          var l = i.split(":"), c = (c = l[1]) == null ? void 0 : c.trim(), l = (i = l[0].trim()).replace(/([&*]|\+\+)/g, ""), d = /^\[/.test(l) ? l.match(/^\[(.*)\]$/)[1].split("+") : l;
          return ho(l, d || null, /\&/.test(i), /\*/.test(i), /\+\+/.test(i), p(d), a === 0, c);
        });
      }
      hn.prototype._createTableSchema = po, hn.prototype._parseIndexSyntax = ys, hn.prototype._parseStoresSpec = function(n, i) {
        var a = this;
        f(n).forEach(function(c) {
          if (n[c] !== null) {
            var l = a._parseIndexSyntax(n[c]), d = l.shift();
            if (!d) throw new X.Schema("Invalid schema for table " + c + ": " + n[c]);
            if (d.unique = !0, d.multi) throw new X.Schema("Primary key cannot be multiEntry*");
            l.forEach(function(y) {
              if (y.auto) throw new X.Schema("Only primary key can be marked as autoIncrement (++)");
              if (!y.keyPath) throw new X.Schema("Index must have a name and cannot be an empty string");
            }), d = a._createTableSchema(c, d, l), i[c] = d;
          }
        });
      }, hn.prototype.stores = function(a) {
        var i = this.db, a = (this._cfg.storesSource = this._cfg.storesSource ? h(this._cfg.storesSource, a) : a, i._versions), c = {}, l = {};
        return a.forEach(function(d) {
          h(c, d._cfg.storesSource), l = d._cfg.dbschema = {}, d._parseStoresSpec(c, l);
        }), i._dbSchema = l, go(i, [i._allTables, i, i.Transaction.prototype]), lr(i, [i._allTables, i, i.Transaction.prototype, this._cfg.tables], f(l), l), i._storeNames = f(l), this;
      }, hn.prototype.upgrade = function(n) {
        return this._cfg.contentUpgrade = Jr(this._cfg.contentUpgrade || _e, n), this;
      };
      var Ru = hn;
      function hn() {
      }
      var qn = (() => {
        var n, i, a;
        return typeof FinalizationRegistry < "u" && typeof WeakRef < "u" ? (n = /* @__PURE__ */ new Set(), i = new FinalizationRegistry(function(c) {
          n.delete(c);
        }), { toArray: function() {
          return Array.from(n).map(function(c) {
            return c.deref();
          }).filter(function(c) {
            return c !== void 0;
          });
        }, add: function(c) {
          var l = new WeakRef(c._novip);
          n.add(l), i.register(c._novip, l, l), n.size > c._options.maxConnections && (l = n.values().next().value, n.delete(l), i.unregister(l));
        }, remove: function(c) {
          if (c) for (var l = n.values(), d = l.next(); !d.done; ) {
            var y = d.value;
            if (y.deref() === c._novip) return n.delete(y), void i.unregister(y);
            d = l.next();
          }
        } }) : (a = [], { toArray: function() {
          return a;
        }, add: function(c) {
          a.push(c._novip);
        }, remove: function(c) {
          c && (c = a.indexOf(c._novip)) !== -1 && a.splice(c, 1);
        } });
      })();
      function wo(n, i) {
        var a = n._dbNamesDB;
        return a || (a = n._dbNamesDB = new vt(rr, { addons: [], indexedDB: n, IDBKeyRange: i })).version(1).stores({ dbnames: "name" }), a.table("dbnames");
      }
      function bo(n) {
        return n && typeof n.databases == "function";
      }
      function Eo(n) {
        return Bt(function() {
          return ie.letThrough = !0, n();
        });
      }
      function _o(n) {
        return !("from" in n);
      }
      var je = function(n, i) {
        var a;
        if (!this) return a = new je(), n && "d" in n && h(a, n), a;
        h(this, arguments.length ? { d: 1, from: n, to: 1 < arguments.length ? i : n } : { d: 0 });
      };
      function $n(n, i, a) {
        var c = me(i, a);
        if (!isNaN(c)) {
          if (0 < c) throw RangeError();
          if (_o(n)) return h(n, { from: i, to: a, d: 1 });
          var c = n.l, l = n.r;
          if (me(a, n.from) < 0) return c ? $n(c, i, a) : n.l = { from: i, to: a, d: 1, l: null, r: null }, ms(n);
          if (0 < me(i, n.to)) return l ? $n(l, i, a) : n.r = { from: i, to: a, d: 1, l: null, r: null }, ms(n);
          me(i, n.from) < 0 && (n.from = i, n.l = null, n.d = l ? l.d + 1 : 1), 0 < me(a, n.to) && (n.to = a, n.r = null, n.d = n.l ? n.l.d + 1 : 1), i = !n.r, c && !n.l && Kn(n, c), l && i && Kn(n, l);
        }
      }
      function Kn(n, i) {
        _o(i) || (function a(c, l) {
          var d = l.from, y = l.l, g = l.r;
          $n(c, d, l.to), y && a(c, y), g && a(c, g);
        })(n, i);
      }
      function gs(n, i) {
        var a = pr(i), c = a.next();
        if (!c.done) for (var l = c.value, d = pr(n), y = d.next(l.from), g = y.value; !c.done && !y.done; ) {
          if (me(g.from, l.to) <= 0 && 0 <= me(g.to, l.from)) return !0;
          me(l.from, g.from) < 0 ? l = (c = a.next(g.from)).value : g = (y = d.next(l.from)).value;
        }
        return !1;
      }
      function pr(n) {
        var i = _o(n) ? null : { s: 0, n };
        return { next: function(a) {
          for (var c = 0 < arguments.length; i; ) switch (i.s) {
            case 0:
              if (i.s = 1, c) for (; i.n.l && me(a, i.n.from) < 0; ) i = { up: i, n: i.n.l, s: 1 };
              else for (; i.n.l; ) i = { up: i, n: i.n.l, s: 1 };
            case 1:
              if (i.s = 2, !c || me(a, i.n.to) <= 0) return { value: i.n, done: !1 };
            case 2:
              if (i.n.r) {
                i.s = 3, i = { up: i, n: i.n.r, s: 0 };
                continue;
              }
            case 3:
              i = i.up;
          }
          return { done: !0 };
        } };
      }
      function ms(n) {
        var i, a, c, l = (((l = n.r) == null ? void 0 : l.d) || 0) - (((l = n.l) == null ? void 0 : l.d) || 0), l = 1 < l ? "r" : l < -1 ? "l" : "";
        l && (i = l == "r" ? "l" : "r", a = o({}, n), c = n[l], n.from = c.from, n.to = c.to, n[l] = c[l], a[l] = c[i], (n[i] = a).d = vs(a)), n.d = vs(n);
      }
      function vs(a) {
        var i = a.r, a = a.l;
        return (i ? a ? Math.max(i.d, a.d) : i.d : a ? a.d : 0) + 1;
      }
      function yr(n, i) {
        return f(i).forEach(function(a) {
          n[a] ? Kn(n[a], i[a]) : n[a] = (function c(l) {
            var d, y, g = {};
            for (d in l) w(l, d) && (y = l[d], g[d] = !y || typeof y != "object" || Oe.has(y.constructor) ? y : c(y));
            return g;
          })(i[a]);
        }), n;
      }
      function xo(n, i) {
        return n.all || i.all || Object.keys(n).some(function(a) {
          return i[a] && gs(i[a], n[a]);
        });
      }
      P(je.prototype, ((et = { add: function(n) {
        return Kn(this, n), this;
      }, addKey: function(n) {
        return $n(this, n, n), this;
      }, addKeys: function(n) {
        var i = this;
        return n.forEach(function(a) {
          return $n(i, a, a);
        }), this;
      }, hasKey: function(n) {
        var i = pr(this).next(n).value;
        return i && me(i.from, n) <= 0 && 0 <= me(i.to, n);
      } })[G] = function() {
        return pr(this);
      }, et));
      var Xt = {}, Ao = {}, ko = !1;
      function gr(n) {
        yr(Ao, n), ko || (ko = !0, setTimeout(function() {
          ko = !1, So(Ao, !(Ao = {}));
        }, 0));
      }
      function So(n, i) {
        i === void 0 && (i = !1);
        var a = /* @__PURE__ */ new Set();
        if (n.all) for (var c = 0, l = Object.values(Xt); c < l.length; c++) ws(g = l[c], n, a, i);
        else for (var d in n) {
          var y, g, d = /^idb\:\/\/(.*)\/(.*)\//.exec(d);
          d && (y = d[1], d = d[2], g = Xt["idb://".concat(y, "/").concat(d)]) && ws(g, n, a, i);
        }
        a.forEach(function(E) {
          return E();
        });
      }
      function ws(n, i, a, c) {
        for (var l = [], d = 0, y = Object.entries(n.queries.query); d < y.length; d++) {
          for (var g = y[d], E = g[0], B = [], x = 0, b = g[1]; x < b.length; x++) {
            var _ = b[x];
            xo(i, _.obsSet) ? _.subscribers.forEach(function(S) {
              return a.add(S);
            }) : c && B.push(_);
          }
          c && l.push([E, B]);
        }
        if (c) for (var R = 0, A = l; R < A.length; R++) {
          var k = A[R], E = k[0], B = k[1];
          n.queries.query[E] = B;
        }
      }
      function Bu(n) {
        var i = n._state, a = n._deps.indexedDB;
        if (i.isBeingOpened || n.idbdb) return i.dbReadyPromise.then(function() {
          return i.dbOpenError ? qe(i.dbOpenError) : n;
        });
        i.isBeingOpened = !0, i.dbOpenError = null, i.openComplete = !1;
        var c = i.openCanceller, l = Math.round(10 * n.verno), d = !1;
        function y() {
          if (i.openCanceller !== c) throw new X.DatabaseClosed("db.open() was cancelled");
        }
        function g() {
          return new Y(function(_, R) {
            if (y(), !a) throw new X.MissingAPI();
            var A = n.name, k = i.autoSchema || !l ? a.open(A) : a.open(A, l);
            if (!k) throw new X.MissingAPI();
            k.onerror = st(R), k.onblocked = Le(n._fireOnBlocked), k.onupgradeneeded = Le(function(S) {
              var I;
              x = k.transaction, i.autoSchema && !n._options.allowEmptyDB ? (k.onerror = Ln, x.abort(), k.result.close(), (I = a.deleteDatabase(A)).onsuccess = I.onerror = Le(function() {
                R(new X.NoSuchDatabase("Database ".concat(A, " doesnt exist")));
              })) : (x.onerror = st(R), I = S.oldVersion > Math.pow(2, 62) ? 0 : S.oldVersion, b = I < 1, n.idbdb = k.result, d && Su(n, x), ku(n, I / 10, x, R));
            }, R), k.onsuccess = Le(function() {
              x = null;
              var S, I, O, C, q, U, z = n.idbdb = k.result, H = M(z.objectStoreNames);
              if (0 < H.length) try {
                var te = z.transaction((q = H).length === 1 ? q[0] : q, "readonly");
                if (i.autoSchema) U = z, C = te, (O = n).verno = U.version / 10, C = O._dbSchema = dr(0, U, C), O._storeNames = M(U.objectStoreNames, 0), lr(O, [O._allTables], f(C), C);
                else if (hr(n, n._dbSchema, te), I = te, ((I = mo(dr(0, (S = n).idbdb, I), S._dbSchema)).add.length || I.change.some(function(V) {
                  return V.add.length || V.change.length;
                })) && !d) return console.warn("Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Dexie will add missing parts and increment native version number to workaround this."), z.close(), l = z.version + 1, d = !0, _(g());
                ur(n, te);
              } catch {
              }
              qn.add(n), z.onversionchange = Le(function(V) {
                i.vcFired = !0, n.on("versionchange").fire(V);
              }), z.onclose = Le(function() {
                n.close({ disableAutoOpen: !1 });
              }), b && (H = n._deps, q = A, bo(U = H.indexedDB) || q === rr || wo(U, H.IDBKeyRange).put({ name: q }).catch(_e)), _();
            }, R);
          }).catch(function(_) {
            switch (_?.name) {
              case "UnknownError":
                if (0 < i.PR1398_maxLoop) return i.PR1398_maxLoop--, console.warn("Dexie: Workaround for Chrome UnknownError on open()"), g();
                break;
              case "VersionError":
                if (0 < l) return l = 0, g();
            }
            return Y.reject(_);
          });
        }
        var E, B = i.dbReadyResolve, x = null, b = !1;
        return Y.race([c, (typeof navigator > "u" ? Y.resolve() : !navigator.userAgentData && /Safari\//.test(navigator.userAgent) && !/Chrom(e|ium)\//.test(navigator.userAgent) && indexedDB.databases ? new Promise(function(_) {
          function R() {
            return indexedDB.databases().finally(_);
          }
          E = setInterval(R, 100), R();
        }).finally(function() {
          return clearInterval(E);
        }) : Promise.resolve()).then(g)]).then(function() {
          return y(), i.onReadyBeingFired = [], Y.resolve(Eo(function() {
            return n.on.ready.fire(n.vip);
          })).then(function _() {
            var R;
            if (0 < i.onReadyBeingFired.length) return R = i.onReadyBeingFired.reduce(Jr, _e), i.onReadyBeingFired = [], Y.resolve(Eo(function() {
              return R(n.vip);
            })).then(_);
          });
        }).finally(function() {
          i.openCanceller === c && (i.onReadyBeingFired = null, i.isBeingOpened = !1);
        }).catch(function(_) {
          i.dbOpenError = _;
          try {
            x && x.abort();
          } catch {
          }
          return c === i.openCanceller && n._close(), qe(_);
        }).finally(function() {
          i.openComplete = !0, B();
        }).then(function() {
          var _;
          return b && (_ = {}, n.tables.forEach(function(R) {
            R.schema.indexes.forEach(function(A) {
              A.name && (_["idb://".concat(n.name, "/").concat(R.name, "/").concat(A.name)] = new je(-1 / 0, [[[]]]));
            }), _["idb://".concat(n.name, "/").concat(R.name, "/")] = _["idb://".concat(n.name, "/").concat(R.name, "/:dels")] = new je(-1 / 0, [[[]]]);
          }), Ct(Pn).fire(_), So(_, !0)), n;
        });
      }
      function Ro(n) {
        function i(d) {
          return n.next(d);
        }
        var a = l(i), c = l(function(d) {
          return n.throw(d);
        });
        function l(d) {
          return function(g) {
            var g = d(g), E = g.value;
            return g.done ? E : E && typeof E.then == "function" ? E.then(a, c) : p(E) ? Promise.all(E).then(a, c) : a(E);
          };
        }
        return l(i)();
      }
      function mr(n, i, a) {
        for (var c = p(n) ? n.slice() : [n], l = 0; l < a; ++l) c.push(i);
        return c;
      }
      var Ou = { stack: "dbcore", name: "VirtualIndexMiddleware", level: 1, create: function(n) {
        return o(o({}, n), { table: function(c) {
          var a = n.table(c), c = a.schema, l = {}, d = [];
          function y(_, R, A) {
            var O = Dn(_), k = l[O] = l[O] || [], S = _ == null ? 0 : typeof _ == "string" ? 1 : _.length, I = 0 < R, O = o(o({}, A), { name: I ? "".concat(O, "(virtual-from:").concat(A.name, ")") : A.name, lowLevelIndex: A, isVirtual: I, keyTail: R, keyLength: S, extractKey: yo(_), unique: !I && A.unique });
            return k.push(O), O.isPrimaryKey || d.push(O), 1 < S && y(S === 2 ? _[0] : _.slice(0, S - 1), R + 1, A), k.sort(function(C, q) {
              return C.keyTail - q.keyTail;
            }), O;
          }
          var g = y(c.primaryKey.keyPath, 0, c.primaryKey);
          l[":id"] = [g];
          for (var E = 0, B = c.indexes; E < B.length; E++) {
            var x = B[E];
            y(x.keyPath, 0, x);
          }
          function b(_) {
            var R, A = _.query.index;
            return A.isVirtual ? o(o({}, _), { query: { index: A.lowLevelIndex, range: (R = _.query.range, A = A.keyTail, { type: R.type === 1 ? 2 : R.type, lower: mr(R.lower, R.lowerOpen ? n.MAX_KEY : n.MIN_KEY, A), lowerOpen: !0, upper: mr(R.upper, R.upperOpen ? n.MIN_KEY : n.MAX_KEY, A), upperOpen: !0 }) } }) : _;
          }
          return o(o({}, a), { schema: o(o({}, c), { primaryKey: g, indexes: d, getIndexByKeyPath: function(_) {
            return (_ = l[Dn(_)]) && _[0];
          } }), count: function(_) {
            return a.count(b(_));
          }, query: function(_) {
            return a.query(b(_));
          }, openCursor: function(_) {
            var R = _.query.index, A = R.keyTail, k = R.keyLength;
            return R.isVirtual ? a.openCursor(b(_)).then(function(I) {
              return I && S(I);
            }) : a.openCursor(_);
            function S(I) {
              return Object.create(I, { continue: { value: function(O) {
                O != null ? I.continue(mr(O, _.reverse ? n.MAX_KEY : n.MIN_KEY, A)) : _.unique ? I.continue(I.key.slice(0, k).concat(_.reverse ? n.MIN_KEY : n.MAX_KEY, A)) : I.continue();
              } }, continuePrimaryKey: { value: function(O, C) {
                I.continuePrimaryKey(mr(O, n.MAX_KEY, A), C);
              } }, primaryKey: { get: function() {
                return I.primaryKey;
              } }, key: { get: function() {
                var O = I.key;
                return k === 1 ? O[0] : O.slice(0, k);
              } }, value: { get: function() {
                return I.value;
              } } });
            }
          } });
        } });
      } };
      function Bo(n, i, a, c) {
        return a = a || {}, c = c || "", f(n).forEach(function(l) {
          var d, y, g;
          w(i, l) ? (d = n[l], y = i[l], typeof d == "object" && typeof y == "object" && d && y ? (g = N(d)) !== N(y) ? a[c + l] = i[l] : g === "Object" ? Bo(d, y, a, c + l + ".") : d !== y && (a[c + l] = i[l]) : d !== y && (a[c + l] = i[l])) : a[c + l] = void 0;
        }), f(i).forEach(function(l) {
          w(n, l) || (a[c + l] = i[l]);
        }), a;
      }
      function Oo(n, i) {
        return i.type === "delete" ? i.keys : i.keys || i.values.map(n.extractKey);
      }
      var Iu = { stack: "dbcore", name: "HooksMiddleware", level: 2, create: function(n) {
        return o(o({}, n), { table: function(i) {
          var a = n.table(i), c = a.schema.primaryKey;
          return o(o({}, a), { mutate: function(l) {
            var d = ie.trans, y = d.table(i).hook, g = y.deleting, E = y.creating, B = y.updating;
            switch (l.type) {
              case "add":
                if (E.fire === _e) break;
                return d._promise("readwrite", function() {
                  return x(l);
                }, !0);
              case "put":
                if (E.fire === _e && B.fire === _e) break;
                return d._promise("readwrite", function() {
                  return x(l);
                }, !0);
              case "delete":
                if (g.fire === _e) break;
                return d._promise("readwrite", function() {
                  return x(l);
                }, !0);
              case "deleteRange":
                if (g.fire === _e) break;
                return d._promise("readwrite", function() {
                  return (function b(_, R, A) {
                    return a.query({ trans: _, values: !1, query: { index: c, range: R }, limit: A }).then(function(k) {
                      var S = k.result;
                      return x({ type: "delete", keys: S, trans: _ }).then(function(I) {
                        return 0 < I.numFailures ? Promise.reject(I.failures[0]) : S.length < A ? { failures: [], numFailures: 0, lastResult: void 0 } : b(_, o(o({}, R), { lower: S[S.length - 1], lowerOpen: !0 }), A);
                      });
                    });
                  })(l.trans, l.range, 1e4);
                }, !0);
            }
            return a.mutate(l);
            function x(b) {
              var _, R, A, k = ie.trans, S = b.keys || Oo(c, b);
              if (S) return (b = b.type === "add" || b.type === "put" ? o(o({}, b), { keys: S }) : o({}, b)).type !== "delete" && (b.values = s([], b.values)), b.keys && (b.keys = s([], b.keys)), _ = a, A = S, ((R = b).type === "add" ? Promise.resolve([]) : _.getMany({ trans: R.trans, keys: A, cache: "immutable" })).then(function(I) {
                var O = S.map(function(C, q) {
                  var U, z, H, te = I[q], V = { onerror: null, onsuccess: null };
                  return b.type === "delete" ? g.fire.call(V, C, te, k) : b.type === "add" || te === void 0 ? (U = E.fire.call(V, C, b.values[q], k), C == null && U != null && (b.keys[q] = C = U, c.outbound || ve(b.values[q], c.keyPath, C))) : (U = Bo(te, b.values[q]), (z = B.fire.call(V, U, C, te, k)) && (H = b.values[q], Object.keys(z).forEach(function(re) {
                    w(H, re) ? H[re] = z[re] : ve(H, re, z[re]);
                  }))), V;
                });
                return a.mutate(b).then(function(C) {
                  for (var q = C.failures, U = C.results, z = C.numFailures, C = C.lastResult, H = 0; H < S.length; ++H) {
                    var te = (U || S)[H], V = O[H];
                    te == null ? V.onerror && V.onerror(q[H]) : V.onsuccess && V.onsuccess(b.type === "put" && I[H] ? b.values[H] : te);
                  }
                  return { failures: q, results: U, numFailures: z, lastResult: C };
                }).catch(function(C) {
                  return O.forEach(function(q) {
                    return q.onerror && q.onerror(C);
                  }), Promise.reject(C);
                });
              });
              throw new Error("Keys missing");
            }
          } });
        } });
      } };
      function bs(n, i, a) {
        try {
          if (!i || i.keys.length < n.length) return null;
          for (var c = [], l = 0, d = 0; l < i.keys.length && d < n.length; ++l) me(i.keys[l], n[d]) === 0 && (c.push(a ? K(i.values[l]) : i.values[l]), ++d);
          return c.length === n.length ? c : null;
        } catch {
          return null;
        }
      }
      var Tu = { stack: "dbcore", level: -1, create: function(n) {
        return { table: function(i) {
          var a = n.table(i);
          return o(o({}, a), { getMany: function(c) {
            var l;
            return c.cache ? (l = bs(c.keys, c.trans._cache, c.cache === "clone")) ? Y.resolve(l) : a.getMany(c).then(function(d) {
              return c.trans._cache = { keys: c.keys, values: c.cache === "clone" ? K(d) : d }, d;
            }) : a.getMany(c);
          }, mutate: function(c) {
            return c.type !== "add" && (c.trans._cache = null), a.mutate(c);
          } });
        } };
      } };
      function Es(n, i) {
        return n.trans.mode === "readonly" && !!n.subscr && !n.trans.explicit && n.trans.db._options.cache !== "disabled" && !i.schema.primaryKey.outbound;
      }
      function _s(n, i) {
        switch (n) {
          case "query":
            return i.values && !i.unique;
          case "get":
          case "getMany":
          case "count":
          case "openCursor":
            return !1;
        }
      }
      var Cu = { stack: "dbcore", level: 0, name: "Observability", create: function(n) {
        var i = n.schema.name, a = new je(n.MIN_KEY, n.MAX_KEY);
        return o(o({}, n), { transaction: function(c, l, d) {
          if (ie.subscr && l !== "readonly") throw new X.ReadOnly("Readwrite transaction in liveQuery context. Querier source: ".concat(ie.querier));
          return n.transaction(c, l, d);
        }, table: function(c) {
          function l(S) {
            var k, S = S.query;
            return [k = S.index, new je((k = (S = S.range).lower) != null ? k : n.MIN_KEY, (k = S.upper) != null ? k : n.MAX_KEY)];
          }
          var d = n.table(c), y = d.schema, g = y.primaryKey, E = y.indexes, B = g.extractKey, x = g.outbound, b = g.autoIncrement && E.filter(function(A) {
            return A.compound && A.keyPath.includes(g.keyPath);
          }), _ = o(o({}, d), { mutate: function(A) {
            function k($) {
              return $ = "idb://".concat(i, "/").concat(c, "/").concat($), q[$] || (q[$] = new je());
            }
            var S, I, O, C = A.trans, q = A.mutatedParts || (A.mutatedParts = {}), U = k(""), z = k(":dels"), H = A.type, V = A.type === "deleteRange" ? [A.range] : A.type === "delete" ? [A.keys] : A.values.length < 50 ? [Oo(g, A).filter(function($) {
              return $;
            }), A.values] : [], te = V[0], V = V[1], re = A.trans._cache;
            return p(te) ? (U.addKeys(te), (H = H === "delete" || te.length === V.length ? bs(te, re) : null) || z.addKeys(te), (H || V) && (S = k, I = H, O = V, y.indexes.forEach(function($) {
              var ce = S($.name || "");
              function ue(ye) {
                return ye != null ? $.extractKey(ye) : null;
              }
              function pe(ye) {
                $.multiEntry && p(ye) ? ye.forEach(function(nt) {
                  return ce.addKey(nt);
                }) : ce.addKey(ye);
              }
              (I || O).forEach(function(ye, Fe) {
                var he = I && ue(I[Fe]), Fe = O && ue(O[Fe]);
                me(he, Fe) !== 0 && (he != null && pe(he), Fe != null) && pe(Fe);
              });
            }))) : te ? (V = { from: (re = te.lower) != null ? re : n.MIN_KEY, to: (H = te.upper) != null ? H : n.MAX_KEY }, z.add(V), U.add(V)) : (U.add(a), z.add(a), y.indexes.forEach(function($) {
              return k($.name).add(a);
            })), d.mutate(A).then(function($) {
              return !te || A.type !== "add" && A.type !== "put" || (U.addKeys($.results), b && b.forEach(function(ce) {
                for (var ue = A.values.map(function(he) {
                  return ce.extractKey(he);
                }), pe = ce.keyPath.findIndex(function(he) {
                  return he === g.keyPath;
                }), ye = 0, nt = $.results.length; ye < nt; ++ye) ue[ye][pe] = $.results[ye];
                k(ce.name).addKeys(ue);
              })), C.mutatedParts = yr(C.mutatedParts || {}, q), $;
            });
          } }), R = { get: function(A) {
            return [g, new je(A.key)];
          }, getMany: function(A) {
            return [g, new je().addKeys(A.keys)];
          }, count: l, query: l, openCursor: l };
          return f(R).forEach(function(A) {
            _[A] = function(k) {
              var S = ie.subscr, I = !!S, O = Es(ie, d) && _s(A, k) ? k.obsSet = {} : S;
              if (I) {
                var C, S = function(V) {
                  return V = "idb://".concat(i, "/").concat(c, "/").concat(V), O[V] || (O[V] = new je());
                }, q = S(""), U = S(":dels"), I = R[A](k), z = I[0], I = I[1];
                if ((A === "query" && z.isPrimaryKey && !k.values ? U : S(z.name || "")).add(I), !z.isPrimaryKey) {
                  if (A !== "count") return C = A === "query" && x && k.values && d.query(o(o({}, k), { values: !1 })), d[A].apply(this, arguments).then(function(V) {
                    if (A === "query") {
                      if (x && k.values) return C.then(function(ue) {
                        return ue = ue.result, q.addKeys(ue), V;
                      });
                      var re = k.values ? V.result.map(B) : V.result;
                      (k.values ? q : U).addKeys(re);
                    } else {
                      var $, ce;
                      if (A === "openCursor") return ce = k.values, ($ = V) && Object.create($, { key: { get: function() {
                        return U.addKey($.primaryKey), $.key;
                      } }, primaryKey: { get: function() {
                        var ue = $.primaryKey;
                        return U.addKey(ue), ue;
                      } }, value: { get: function() {
                        return ce && q.addKey($.primaryKey), $.value;
                      } } });
                    }
                    return V;
                  });
                  U.add(a);
                }
              }
              return d[A].apply(this, arguments);
            };
          }), _;
        } });
      } };
      function xs(n, i, a) {
        var c;
        return a.numFailures === 0 ? i : i.type === "deleteRange" || (c = i.keys ? i.keys.length : "values" in i && i.values ? i.values.length : 1, a.numFailures === c) ? null : (c = o({}, i), p(c.keys) && (c.keys = c.keys.filter(function(l, d) {
          return !(d in a.failures);
        })), "values" in c && p(c.values) && (c.values = c.values.filter(function(l, d) {
          return !(d in a.failures);
        })), c);
      }
      function Io(n, i) {
        return a = n, ((c = i).lower === void 0 || (c.lowerOpen ? 0 < me(a, c.lower) : 0 <= me(a, c.lower))) && (a = n, (c = i).upper === void 0 || (c.upperOpen ? me(a, c.upper) < 0 : me(a, c.upper) <= 0));
        var a, c;
      }
      function As(n, i, a, c, l, d) {
        var y, g, E, B, x, b, _;
        return !a || a.length === 0 || (y = i.query.index, g = y.multiEntry, E = i.query.range, B = c.schema.primaryKey.extractKey, x = y.extractKey, b = (y.lowLevelIndex || y).extractKey, (c = a.reduce(function(R, A) {
          var k = R, S = [];
          if (A.type === "add" || A.type === "put") for (var I = new je(), O = A.values.length - 1; 0 <= O; --O) {
            var C, q = A.values[O], U = B(q);
            !I.hasKey(U) && (C = x(q), g && p(C) ? C.some(function(re) {
              return Io(re, E);
            }) : Io(C, E)) && (I.addKey(U), S.push(q));
          }
          switch (A.type) {
            case "add":
              var z = new je().addKeys(i.values ? R.map(function($) {
                return B($);
              }) : R), k = R.concat(i.values ? S.filter(function($) {
                return $ = B($), !z.hasKey($) && (z.addKey($), !0);
              }) : S.map(function($) {
                return B($);
              }).filter(function($) {
                return !z.hasKey($) && (z.addKey($), !0);
              }));
              break;
            case "put":
              var H = new je().addKeys(A.values.map(function($) {
                return B($);
              }));
              k = R.filter(function($) {
                return !H.hasKey(i.values ? B($) : $);
              }).concat(i.values ? S : S.map(function($) {
                return B($);
              }));
              break;
            case "delete":
              var te = new je().addKeys(A.keys);
              k = R.filter(function($) {
                return !te.hasKey(i.values ? B($) : $);
              });
              break;
            case "deleteRange":
              var V = A.range;
              k = R.filter(function($) {
                return !Io(B($), V);
              });
          }
          return k;
        }, n)) === n) ? n : (_ = function(R, A) {
          return me(b(R), b(A)) || me(B(R), B(A));
        }, c.sort(i.direction === "prev" || i.direction === "prevunique" ? function(R, A) {
          return _(A, R);
        } : _), i.limit && i.limit < 1 / 0 && (c.length > i.limit ? c.length = i.limit : n.length === i.limit && c.length < i.limit && (l.dirty = !0)), d ? Object.freeze(c) : c);
      }
      function ks(n, i) {
        return me(n.lower, i.lower) === 0 && me(n.upper, i.upper) === 0 && !!n.lowerOpen == !!i.lowerOpen && !!n.upperOpen == !!i.upperOpen;
      }
      function Lu(n, i) {
        return ((a, c, l, d) => {
          if (a === void 0) return c !== void 0 ? -1 : 0;
          if (c === void 0) return 1;
          if ((a = me(a, c)) === 0) {
            if (l && d) return 0;
            if (l) return 1;
            if (d) return -1;
          }
          return a;
        })(n.lower, i.lower, n.lowerOpen, i.lowerOpen) <= 0 && 0 <= ((a, c, l, d) => {
          if (a === void 0) return c !== void 0 ? 1 : 0;
          if (c === void 0) return -1;
          if ((a = me(a, c)) === 0) {
            if (l && d) return 0;
            if (l) return -1;
            if (d) return 1;
          }
          return a;
        })(n.upper, i.upper, n.upperOpen, i.upperOpen);
      }
      function Pu(n, i, a, c) {
        n.subscribers.add(a), c.addEventListener("abort", function() {
          var l, d;
          n.subscribers.delete(a), n.subscribers.size === 0 && (l = n, d = i, setTimeout(function() {
            l.subscribers.size === 0 && J(d, l);
          }, 3e3));
        });
      }
      var Nu = { stack: "dbcore", level: 0, name: "Cache", create: function(n) {
        var i = n.schema.name;
        return o(o({}, n), { transaction: function(a, c, l) {
          var d, y, g = n.transaction(a, c, l);
          return c === "readwrite" && (l = (d = new AbortController()).signal, g.addEventListener("abort", (y = function(E) {
            return function() {
              if (d.abort(), c === "readwrite") {
                for (var B = /* @__PURE__ */ new Set(), x = 0, b = a; x < b.length; x++) {
                  var _ = b[x], R = Xt["idb://".concat(i, "/").concat(_)];
                  if (R) {
                    var A = n.table(_), k = R.optimisticOps.filter(function($) {
                      return $.trans === g;
                    });
                    if (g._explicit && E && g.mutatedParts) for (var S = 0, I = Object.values(R.queries.query); S < I.length; S++) for (var O = 0, C = (z = I[S]).slice(); O < C.length; O++) xo((H = C[O]).obsSet, g.mutatedParts) && (J(z, H), H.subscribers.forEach(function($) {
                      return B.add($);
                    }));
                    else if (0 < k.length) {
                      R.optimisticOps = R.optimisticOps.filter(function($) {
                        return $.trans !== g;
                      });
                      for (var q = 0, U = Object.values(R.queries.query); q < U.length; q++) for (var z, H, te, V = 0, re = (z = U[q]).slice(); V < re.length; V++) (H = re[V]).res != null && g.mutatedParts && (E && !H.dirty ? (te = Object.isFrozen(H.res), te = As(H.res, H.req, k, A, H, te), H.dirty ? (J(z, H), H.subscribers.forEach(function($) {
                        return B.add($);
                      })) : te !== H.res && (H.res = te, H.promise = Y.resolve({ result: te }))) : (H.dirty && J(z, H), H.subscribers.forEach(function($) {
                        return B.add($);
                      })));
                    }
                  }
                }
                B.forEach(function($) {
                  return $();
                });
              }
            };
          })(!1), { signal: l }), g.addEventListener("error", y(!1), { signal: l }), g.addEventListener("complete", y(!0), { signal: l })), g;
        }, table: function(a) {
          var c = n.table(a), l = c.schema.primaryKey;
          return o(o({}, c), { mutate: function(d) {
            var y, g = ie.trans;
            return !l.outbound && g.db._options.cache !== "disabled" && !g.explicit && g.idbtrans.mode === "readwrite" && (y = Xt["idb://".concat(i, "/").concat(a)]) ? (g = c.mutate(d), d.type !== "add" && d.type !== "put" || !(50 <= d.values.length || Oo(l, d).some(function(E) {
              return E == null;
            })) ? (y.optimisticOps.push(d), d.mutatedParts && gr(d.mutatedParts), g.then(function(E) {
              0 < E.numFailures && (J(y.optimisticOps, d), (E = xs(0, d, E)) && y.optimisticOps.push(E), d.mutatedParts) && gr(d.mutatedParts);
            }), g.catch(function() {
              J(y.optimisticOps, d), d.mutatedParts && gr(d.mutatedParts);
            })) : g.then(function(E) {
              var B = xs(0, o(o({}, d), { values: d.values.map(function(x, b) {
                var _;
                return E.failures[b] ? x : (ve(_ = (_ = l.keyPath) != null && _.includes(".") ? K(x) : o({}, x), l.keyPath, E.results[b]), _);
              }) }), E);
              y.optimisticOps.push(B), queueMicrotask(function() {
                return d.mutatedParts && gr(d.mutatedParts);
              });
            }), g) : c.mutate(d);
          }, query: function(d) {
            var y, g, E, B, x, b, _;
            return Es(ie, c) && _s("query", d) ? (y = ((E = ie.trans) == null ? void 0 : E.db._options.cache) === "immutable", g = (E = ie).requery, E = E.signal, b = ((R, A, k, S) => {
              var I = Xt["idb://".concat(R, "/").concat(A)];
              if (!I) return [];
              if (!(R = I.queries[k])) return [null, !1, I, null];
              var O = R[(S.query ? S.query.index.name : null) || ""];
              if (!O) return [null, !1, I, null];
              switch (k) {
                case "query":
                  var C = (q = S.direction) != null ? q : "next", q = O.find(function(U) {
                    var z;
                    return U.req.limit === S.limit && U.req.values === S.values && ((z = U.req.direction) != null ? z : "next") === C && ks(U.req.query.range, S.query.range);
                  });
                  return q ? [q, !0, I, O] : [O.find(function(U) {
                    var z;
                    return ("limit" in U.req ? U.req.limit : 1 / 0) >= S.limit && ((z = U.req.direction) != null ? z : "next") === C && (!S.values || U.req.values) && Lu(U.req.query.range, S.query.range);
                  }), !1, I, O];
                case "count":
                  return q = O.find(function(U) {
                    return ks(U.req.query.range, S.query.range);
                  }), [q, !!q, I, O];
              }
            })(i, a, "query", d), _ = b[0], B = b[2], x = b[3], _ && b[1] ? _.obsSet = d.obsSet : (b = c.query(d).then(function(R) {
              var A = R.result;
              if (_ && (_.res = A), y) {
                for (var k = 0, S = A.length; k < S; ++k) Object.freeze(A[k]);
                Object.freeze(A);
              } else R.result = K(A);
              return R;
            }).catch(function(R) {
              return x && _ && J(x, _), Promise.reject(R);
            }), _ = { obsSet: d.obsSet, promise: b, subscribers: /* @__PURE__ */ new Set(), type: "query", req: d, dirty: !1 }, x ? x.push(_) : (x = [_], (B = B || (Xt["idb://".concat(i, "/").concat(a)] = { queries: { query: {}, count: {} }, objs: /* @__PURE__ */ new Map(), optimisticOps: [], unsignaledParts: {} })).queries.query[d.query.index.name || ""] = x)), Pu(_, x, g, E), _.promise.then(function(R) {
              return { result: As(R.result, d, B?.optimisticOps, c, _, y) };
            })) : c.query(d);
          } });
        } });
      } };
      function vr(n, i) {
        return new Proxy(n, { get: function(a, c, l) {
          return c === "db" ? i : Reflect.get(a, c, l);
        } });
      }
      $e.prototype.version = function(n) {
        if (isNaN(n) || n < 0.1) throw new X.Type("Given version is not a positive number");
        if (n = Math.round(10 * n) / 10, this.idbdb || this._state.isBeingOpened) throw new X.Schema("Cannot add version when database is open");
        this.verno = Math.max(this.verno, n);
        var i = this._versions, a = i.filter(function(c) {
          return c._cfg.version === n;
        })[0];
        return a || (a = new this.Version(n), i.push(a), i.sort(Au), a.stores({}), this._state.autoSchema = !1), a;
      }, $e.prototype._whenReady = function(n) {
        var i = this;
        return this.idbdb && (this._state.openComplete || ie.letThrough || this._vip) ? n() : new Y(function(a, c) {
          if (i._state.openComplete) return c(new X.DatabaseClosed(i._state.dbOpenError));
          if (!i._state.isBeingOpened) {
            if (!i._state.autoOpen) return void c(new X.DatabaseClosed());
            i.open().catch(_e);
          }
          i._state.dbReadyPromise.then(a, c);
        }).then(n);
      }, $e.prototype.use = function(l) {
        var i = l.stack, a = l.create, c = l.level, l = l.name, d = (l && this.unuse({ stack: i, name: l }), this._middlewares[i] || (this._middlewares[i] = []));
        return d.push({ stack: i, create: a, level: c ?? 10, name: l }), d.sort(function(y, g) {
          return y.level - g.level;
        }), this;
      }, $e.prototype.unuse = function(n) {
        var i = n.stack, a = n.name, c = n.create;
        return i && this._middlewares[i] && (this._middlewares[i] = this._middlewares[i].filter(function(l) {
          return c ? l.create !== c : !!a && l.name !== a;
        })), this;
      }, $e.prototype.open = function() {
        var n = this;
        return Gt(gt, function() {
          return Bu(n);
        });
      }, $e.prototype._close = function() {
        this.on.close.fire(new CustomEvent("close"));
        var n = this._state;
        if (qn.remove(this), this.idbdb) {
          try {
            this.idbdb.close();
          } catch {
          }
          this.idbdb = null;
        }
        n.isBeingOpened || (n.dbReadyPromise = new Y(function(i) {
          n.dbReadyResolve = i;
        }), n.openCanceller = new Y(function(i, a) {
          n.cancelOpen = a;
        }));
      }, $e.prototype.close = function(i) {
        var i = (i === void 0 ? { disableAutoOpen: !0 } : i).disableAutoOpen, a = this._state;
        i ? (a.isBeingOpened && a.cancelOpen(new X.DatabaseClosed()), this._close(), a.autoOpen = !1, a.dbOpenError = new X.DatabaseClosed()) : (this._close(), a.autoOpen = this._options.autoOpen || a.isBeingOpened, a.openComplete = !1, a.dbOpenError = null);
      }, $e.prototype.delete = function(n) {
        var i = this, a = (n === void 0 && (n = { disableAutoOpen: !0 }), 0 < arguments.length && typeof arguments[0] != "object"), c = this._state;
        return new Y(function(l, d) {
          function y() {
            i.close(n);
            var g = i._deps.indexedDB.deleteDatabase(i.name);
            g.onsuccess = Le(function() {
              var E, B, x;
              E = i._deps, B = i.name, bo(x = E.indexedDB) || B === rr || wo(x, E.IDBKeyRange).delete(B).catch(_e), l();
            }), g.onerror = st(d), g.onblocked = i._fireOnBlocked;
          }
          if (a) throw new X.InvalidArgument("Invalid closeOptions argument to db.delete()");
          c.isBeingOpened ? c.dbReadyPromise.then(y) : y();
        });
      }, $e.prototype.backendDB = function() {
        return this.idbdb;
      }, $e.prototype.isOpen = function() {
        return this.idbdb !== null;
      }, $e.prototype.hasBeenClosed = function() {
        var n = this._state.dbOpenError;
        return n && n.name === "DatabaseClosed";
      }, $e.prototype.hasFailed = function() {
        return this._state.dbOpenError !== null;
      }, $e.prototype.dynamicallyOpened = function() {
        return this._state.autoSchema;
      }, Object.defineProperty($e.prototype, "tables", { get: function() {
        var n = this;
        return f(this._allTables).map(function(i) {
          return n._allTables[i];
        });
      }, enumerable: !1, configurable: !0 }), $e.prototype.transaction = function() {
        var n = (function(i, a, c) {
          var l = arguments.length;
          if (l < 2) throw new X.InvalidArgument("Too few arguments");
          for (var d = new Array(l - 1); --l; ) d[l - 1] = arguments[l];
          return c = d.pop(), [i, De(d), c];
        }).apply(this, arguments);
        return this._transaction.apply(this, n);
      }, $e.prototype._transaction = function(n, i, a) {
        var c, l, d = this, y = ie.trans, g = (y && y.db === this && n.indexOf("!") === -1 || (y = null), n.indexOf("?") !== -1);
        n = n.replace("!", "").replace("?", "");
        try {
          if (l = i.map(function(B) {
            if (B = B instanceof d.Table ? B.name : B, typeof B != "string") throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
            return B;
          }), n == "r" || n === ao) c = ao;
          else {
            if (n != "rw" && n != co) throw new X.InvalidArgument("Invalid transaction mode: " + n);
            c = co;
          }
          if (y) {
            if (y.mode === ao && c === co) {
              if (!g) throw new X.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
              y = null;
            }
            y && l.forEach(function(B) {
              if (y && y.storeNames.indexOf(B) === -1) {
                if (!g) throw new X.SubTransaction("Table " + B + " not included in parent transaction.");
                y = null;
              }
            }), g && y && !y.active && (y = null);
          }
        } catch (B) {
          return y ? y._promise(null, function(x, b) {
            b(B);
          }) : qe(B);
        }
        var E = (function B(x, b, _, R, A) {
          return Y.resolve().then(function() {
            var O = ie.transless || ie, k = x._createTransaction(b, _, x._dbSchema, R), O = (k.explicit = !0, { trans: k, transless: O });
            if (R) k.idbtrans = R.idbtrans;
            else try {
              k.create(), k.idbtrans._explicit = !0, x._state.PR1398_maxLoop = 3;
            } catch (C) {
              return C.name === We.InvalidState && x.isOpen() && 0 < --x._state.PR1398_maxLoop ? (console.warn("Dexie: Need to reopen db"), x.close({ disableAutoOpen: !1 }), x.open().then(function() {
                return B(x, b, _, null, A);
              })) : qe(C);
            }
            var S, I = oe(A), O = (I && ln(), Y.follow(function() {
              var C;
              (S = A.call(k, k)) && (I ? (C = Ot.bind(null, null), S.then(C, C)) : typeof S.next == "function" && typeof S.throw == "function" && (S = Ro(S)));
            }, O));
            return (S && typeof S.then == "function" ? Y.resolve(S).then(function(C) {
              return k.active ? C : qe(new X.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn"));
            }) : O.then(function() {
              return S;
            })).then(function(C) {
              return R && k._resolve(), k._completion.then(function() {
                return C;
              });
            }).catch(function(C) {
              return k._reject(C), qe(C);
            });
          });
        }).bind(null, this, c, l, y, a);
        return y ? y._promise(c, E, "lock") : ie.trans ? Gt(ie.transless, function() {
          return d._whenReady(E);
        }) : this._whenReady(E);
      }, $e.prototype.table = function(n) {
        if (w(this._allTables, n)) return this._allTables[n];
        throw new X.InvalidTable("Table ".concat(n, " does not exist"));
      };
      var vt = $e;
      function $e(n, i) {
        var a, c, l, d, y, g = this, E = (this._middlewares = {}, this.verno = 0, $e.dependencies), E = (this._options = i = o({ addons: $e.addons, autoOpen: !0, indexedDB: E.indexedDB, IDBKeyRange: E.IDBKeyRange, cache: "cloned", maxConnections: 1e3 }, i), this._deps = { indexedDB: i.indexedDB, IDBKeyRange: i.IDBKeyRange }, i.addons), B = (this._dbSchema = {}, this._versions = [], this._storeNames = [], this._allTables = {}, this.idbdb = null, this._novip = this, { dbOpenError: null, isBeingOpened: !1, onReadyBeingFired: null, openComplete: !1, dbReadyResolve: _e, dbReadyPromise: null, cancelOpen: _e, openCanceller: null, autoSchema: !0, PR1398_maxLoop: 3, autoOpen: i.autoOpen }), x = (B.dbReadyPromise = new Y(function(b) {
          B.dbReadyResolve = b;
        }), B.openCanceller = new Y(function(b, _) {
          B.cancelOpen = _;
        }), this._state = B, this.name = n, this.on = Tn(this, "populate", "blocked", "versionchange", "close", { ready: [Jr, _e] }), this.once = function(b, _) {
          var R = function() {
            for (var A = [], k = 0; k < arguments.length; k++) A[k] = arguments[k];
            g.on(b).unsubscribe(R), _.apply(g, A);
          };
          return g.on(b, R);
        }, this.on.ready.subscribe = fe(this.on.ready.subscribe, function(b) {
          return function(_, R) {
            $e.vip(function() {
              var A, k = g._state;
              k.openComplete ? (k.dbOpenError || Y.resolve().then(_), R && b(_)) : k.onReadyBeingFired ? (k.onReadyBeingFired.push(_), R && b(_)) : (b(_), A = g, R || b(function S() {
                A.on.ready.unsubscribe(_), A.on.ready.unsubscribe(S);
              }));
            });
          };
        }), this.Collection = (a = this, Cn(mu.prototype, function(S, k) {
          this.db = a;
          var R = es, A = null;
          if (k) try {
            R = k();
          } catch (O) {
            A = O;
          }
          var k = S._ctx, S = k.table, I = S.hook.reading.fire;
          this._ctx = { table: S, index: k.index, isPrimKey: !k.index || S.schema.primKey.keyPath && k.index === S.schema.primKey.name, range: R, keysOnly: !1, dir: "next", unique: "", algorithm: null, filter: null, replayFilter: null, justLimit: !0, isMatch: null, offset: 0, limit: 1 / 0, error: A, or: k.or, valueMapper: I !== Rt ? I : null };
        })), this.Table = (c = this, Cn(ss.prototype, function(b, _, R) {
          this.db = c, this._tx = R, this.name = b, this.schema = _, this.hook = c._allTables[b] ? c._allTables[b].hook : Tn(null, { creating: [cu, _e], reading: [au, Rt], updating: [lu, _e], deleting: [uu, _e] });
        })), this.Transaction = (l = this, Cn(bu.prototype, function(b, _, R, A, k) {
          var S = this;
          b !== "readonly" && _.forEach(function(I) {
            I = (I = R[I]) == null ? void 0 : I.yProps, I && (_ = _.concat(I.map(function(O) {
              return O.updatesTable;
            })));
          }), this.db = l, this.mode = b, this.storeNames = _, this.schema = R, this.chromeTransactionDurability = A, this.idbtrans = null, this.on = Tn(this, "complete", "error", "abort"), this.parent = k || null, this.active = !0, this._reculock = 0, this._blockedFuncs = [], this._resolve = null, this._reject = null, this._waitingFor = null, this._waitingQueue = null, this._spinCount = 0, this._completion = new Y(function(I, O) {
            S._resolve = I, S._reject = O;
          }), this._completion.then(function() {
            S.active = !1, S.on.complete.fire();
          }, function(I) {
            var O = S.active;
            return S.active = !1, S.on.error.fire(I), S.parent ? S.parent._reject(I) : O && S.idbtrans && S.idbtrans.abort(), qe(I);
          });
        })), this.Version = (d = this, Cn(Ru.prototype, function(b) {
          this.db = d, this._cfg = { version: b, storesSource: null, dbschema: {}, tables: {}, contentUpgrade: null };
        })), this.WhereClause = (y = this, Cn(fs.prototype, function(b, _, R) {
          if (this.db = y, this._ctx = { table: b, index: _ === ":id" ? null : _, or: R }, this._cmp = this._ascending = me, this._descending = function(A, k) {
            return me(k, A);
          }, this._max = function(A, k) {
            return 0 < me(A, k) ? A : k;
          }, this._min = function(A, k) {
            return me(A, k) < 0 ? A : k;
          }, this._IDBKeyRange = y._deps.IDBKeyRange, !this._IDBKeyRange) throw new X.MissingAPI();
        })), this.on("versionchange", function(b) {
          0 < b.newVersion ? console.warn("Another connection wants to upgrade database '".concat(g.name, "'. Closing db now to resume the upgrade.")) : console.warn("Another connection wants to delete database '".concat(g.name, "'. Closing db now to resume the delete request.")), g.close({ disableAutoOpen: !1 });
        }), this.on("blocked", function(b) {
          !b.newVersion || b.newVersion < b.oldVersion ? console.warn("Dexie.delete('".concat(g.name, "') was blocked")) : console.warn("Upgrade '".concat(g.name, "' blocked by other connection holding version ").concat(b.oldVersion / 10));
        }), this._maxKey = Nn(i.IDBKeyRange), this._createTransaction = function(b, _, R, A) {
          return new g.Transaction(b, _, R, g._options.chromeTransactionDurability, A);
        }, this._fireOnBlocked = function(b) {
          g.on("blocked").fire(b), qn.toArray().filter(function(_) {
            return _.name === g.name && _ !== g && !_._state.vcFired;
          }).map(function(_) {
            return _.on("versionchange").fire(b);
          });
        }, this.use(Tu), this.use(Nu), this.use(Cu), this.use(Ou), this.use(Iu), new Proxy(this, { get: function(b, _, R) {
          var A;
          return _ === "_vip" || (_ === "table" ? function(k) {
            return vr(g.table(k), x);
          } : (A = Reflect.get(b, _, R)) instanceof ss ? vr(A, x) : _ === "tables" ? A.map(function(k) {
            return vr(k, x);
          }) : _ === "_createTransaction" ? function() {
            return vr(A.apply(this, arguments), x);
          } : A);
        } }));
        this.vip = x, E.forEach(function(b) {
          return b(g);
        });
      }
      var wr, pn = typeof Symbol < "u" && "observable" in Symbol ? Symbol.observable : "@@observable", Du = (To.prototype.subscribe = function(n, i, a) {
        return this._subscribe(n && typeof n != "function" ? n : { next: n, error: i, complete: a });
      }, To.prototype[pn] = function() {
        return this;
      }, To);
      function To(n) {
        this._subscribe = n;
      }
      try {
        wr = { indexedDB: u.indexedDB || u.mozIndexedDB || u.webkitIndexedDB || u.msIndexedDB, IDBKeyRange: u.IDBKeyRange || u.webkitIDBKeyRange };
      } catch {
        wr = { indexedDB: null, IDBKeyRange: null };
      }
      function Ss(n) {
        var i, a = !1, c = new Du(function(l) {
          var d = oe(n), y, g = !1, E = {}, B = {}, x = { get closed() {
            return g;
          }, unsubscribe: function() {
            g || (g = !0, y && y.abort(), b && Ct.storagemutated.unsubscribe(A));
          } }, b = (l.start && l.start(x), !1), _ = function() {
            return so(k);
          };
          function R() {
            return xo(B, E);
          }
          var A = function(S) {
            yr(E, S), R() && _();
          }, k = function() {
            var S, I, O;
            !g && wr.indexedDB && (E = {}, S = {}, y && y.abort(), y = new AbortController(), O = ((C) => {
              var q = cn();
              try {
                d && ln();
                var U = Bt(n, C);
                return U = d ? U.finally(Ot) : U;
              } finally {
                q && un();
              }
            })(I = { subscr: S, signal: y.signal, requery: _, querier: n, trans: null }), b || (Ct(Pn, A), b = !0), Promise.resolve(O).then(function(C) {
              a = !0, i = C, g || I.signal.aborted || (R() || (B = S, R()) ? _() : (E = {}, so(function() {
                return !g && l.next && l.next(C);
              })));
            }, function(C) {
              a = !1, ["DatabaseClosedError", "AbortError"].includes(C?.name) || g || so(function() {
                g || l.error && l.error(C);
              });
            }));
          };
          return setTimeout(_, 0), x;
        });
        return c.hasValue = function() {
          return a;
        }, c.getValue = function() {
          return i;
        }, c;
      }
      var Jt = vt;
      function Co(n) {
        var i = Lt;
        try {
          Lt = !0, Ct.storagemutated.fire(n), So(n, !0);
        } finally {
          Lt = i;
        }
      }
      P(Jt, o(o({}, ne), { delete: function(n) {
        return new Jt(n, { addons: [] }).delete();
      }, exists: function(n) {
        return new Jt(n, { addons: [] }).open().then(function(i) {
          return i.close(), !0;
        }).catch("NoSuchDatabaseError", function() {
          return !1;
        });
      }, getDatabaseNames: function(n) {
        try {
          return i = Jt.dependencies, a = i.indexedDB, i = i.IDBKeyRange, (bo(a) ? Promise.resolve(a.databases()).then(function(c) {
            return c.map(function(l) {
              return l.name;
            }).filter(function(l) {
              return l !== rr;
            });
          }) : wo(a, i).toCollection().primaryKeys()).then(n);
        } catch {
          return qe(new X.MissingAPI());
        }
        var i, a;
      }, defineClass: function() {
        return function(n) {
          h(this, n);
        };
      }, ignoreTransaction: function(n) {
        return ie.trans ? Gt(ie.transless || gt, n) : n();
      }, vip: Eo, async: function(n) {
        return function() {
          try {
            var i = Ro(n.apply(this, arguments));
            return i && typeof i.then == "function" ? i : Y.resolve(i);
          } catch (a) {
            return qe(a);
          }
        };
      }, spawn: function(n, i, a) {
        try {
          var c = Ro(n.apply(a, i || []));
          return c && typeof c.then == "function" ? c : Y.resolve(c);
        } catch (l) {
          return qe(l);
        }
      }, currentTransaction: { get: function() {
        return ie.trans || null;
      } }, waitFor: function(n, i) {
        return n = Y.resolve(typeof n == "function" ? Jt.ignoreTransaction(n) : n).timeout(i || 6e4), ie.trans ? ie.trans.waitFor(n) : n;
      }, Promise: Y, debug: { get: function() {
        return ct;
      }, set: function(n) {
        Zi(n);
      } }, derive: D, extend: h, props: P, override: fe, Events: Tn, on: Ct, liveQuery: Ss, extendObservabilitySet: yr, getByKeyPath: de, setByKeyPath: ve, delByKeyPath: function(n, i) {
        typeof i == "string" ? ve(n, i, void 0) : "length" in i && [].map.call(i, function(a) {
          ve(n, a, void 0);
        });
      }, shallowClone: Be, deepClone: K, getObjectDiff: Bo, cmp: me, asap: Ke, minKey: -1 / 0, addons: [], connections: { get: qn.toArray }, errnames: We, dependencies: wr, cache: Xt, semVer: "4.4.2", version: "4.4.2".split(".").map(function(n) {
        return parseInt(n);
      }).reduce(function(n, i, a) {
        return n + i / Math.pow(10, 2 * a);
      }) })), Jt.maxKey = Nn(Jt.dependencies.IDBKeyRange), typeof dispatchEvent < "u" && typeof addEventListener < "u" && (Ct(Pn, function(n) {
        Lt || (n = new CustomEvent(fo, { detail: n }), Lt = !0, dispatchEvent(n), Lt = !1);
      }), addEventListener(fo, function(n) {
        n = n.detail, Lt || Co(n);
      }));
      var yn, Lt = !1, Rs = function() {
      };
      return typeof BroadcastChannel < "u" && ((Rs = function() {
        (yn = new BroadcastChannel(fo)).onmessage = function(n) {
          return n.data && Co(n.data);
        };
      })(), typeof yn.unref == "function" && yn.unref(), Ct(Pn, function(n) {
        Lt || yn.postMessage(n);
      })), typeof addEventListener < "u" && (addEventListener("pagehide", function(n) {
        if (!vt.disableBfCache && n.persisted) {
          ct && console.debug("Dexie: handling persisted pagehide"), yn?.close();
          for (var i = 0, a = qn.toArray(); i < a.length; i++) a[i].close({ disableAutoOpen: !1 });
        }
      }), addEventListener("pageshow", function(n) {
        !vt.disableBfCache && n.persisted && (ct && console.debug("Dexie: handling persisted pageshow"), Rs(), Co({ all: new je(-1 / 0, [[]]) }));
      })), Y.rejectionMapper = function(n, i) {
        return !n || n instanceof Ee || n instanceof TypeError || n instanceof SyntaxError || !n.name || !Ft[n.name] ? n : (i = new Ft[n.name](i || n.message, n), "stack" in n && L(i, "stack", { get: function() {
          return this.inner.stack;
        } }), i);
      }, Zi(ct), o(vt, Object.freeze({ __proto__: null, DEFAULT_MAX_CONNECTIONS: 1e3, Dexie: vt, Entity: ts, PropModification: In, RangeSet: je, add: function(n) {
        return new In({ add: n });
      }, cmp: me, default: vt, liveQuery: Ss, mergeRanges: Kn, rangesOverlap: gs, remove: function(n) {
        return new In({ remove: n });
      }, replacePrefix: function(n, i) {
        return new In({ replacePrefix: [n, i] });
      } }), { default: vt }), vt;
    });
  })(Ir)), Ir.exports;
}
var Cy = Ty(), ii = /* @__PURE__ */ Oy(Cy);
const oa = Symbol.for("Dexie"), Mr = globalThis[oa] || (globalThis[oa] = ii);
if (ii.semVer !== Mr.semVer)
  throw new Error(`Two different versions of Dexie loaded in the same app: ${ii.semVer} and ${Mr.semVer}`);
const {
  liveQuery: zy,
  mergeRanges: Zy,
  rangesOverlap: Gy,
  RangeSet: Wy,
  cmp: Yy,
  Entity: Xy,
  PropModification: Jy,
  replacePrefix: Qy,
  add: eg,
  remove: tg,
  DexieYProvider: ng
} = Mr, Ly = "eHagakiDB", Py = 16, Ny = "[pubkeyHex+postedAt+createdAt+eventId]", Dy = /* @__PURE__ */ new Set(), qy = /* @__PURE__ */ new Set();
let ia = !1;
function sa(e) {
  ia !== e && (ia = e, qy.forEach((t) => t(e)), e && Dy.forEach((t) => t()));
}
class $y extends Mr {
  meta;
  emojiItems;
  emojiCacheMeta;
  drafts;
  profiles;
  relayConfigs;
  sharedMedia;
  hashtagHistory;
  customEmojiUsage;
  customEmojiImageMeta;
  uploadDestinations;
  postHistory;
  sensitivePayloads;
  postHistoryChildInteractions;
  postHistoryDeletionRequests;
  postMediaCache;
  channelMetadata;
  channelImageCacheMeta;
  constructor(t = Ly) {
    super(t), this.on("blocked", () => {
      sa(!0);
    }), this.on("ready", () => sa(!1)), this.version(Py).stores({
      meta: "key, updatedAt",
      emojiItems: "id, pubkeyHex, identityKey, shortcodeLower, sortIndex, sourceType, sourceAddress, fetchedAt, updatedAt, [pubkeyHex+sortIndex], [pubkeyHex+identityKey]",
      emojiCacheMeta: "pubkeyHex, fetchedAt, updatedAt, schemaVersion",
      drafts: "id, scopeKey, pubkeyHex, updatedAt, timestamp, [scopeKey+updatedAt]",
      profiles: "pubkeyHex, fetchedAt, updatedAt, updatedAtFromEvent, schemaVersion",
      relayConfigs: "pubkeyHex, fetchedAt, updatedAt, updatedAtFromEvent, schemaVersion",
      sharedMedia: "id, createdAt, updatedAt, schemaVersion",
      hashtagHistory: "tagLower, useCount, lastUsed, updatedAt, schemaVersion",
      customEmojiUsage: "id, pubkeyHex, shortcodeLower, src, lastUsedAt, count, updatedAt, schemaVersion, [pubkeyHex+lastUsedAt], [pubkeyHex+shortcodeLower+src]",
      customEmojiImageMeta: "url, width, height, aspectRatio, fetchedAt, lastAccessedAt, updatedAt, schemaVersion",
      uploadDestinations: "id, scopeKey, pubkeyHex, protocol, presetId, isDefault, enabled, updatedAt, [scopeKey+isDefault], [scopeKey+enabled]",
      postHistory: `id, eventId, pubkeyHex, kind, createdAt, postedAt, updatedAt, deletedAt, fetchedAt, lastSeenAt, schemaVersion, [pubkeyHex+postedAt], [pubkeyHex+createdAt], ${Ny}`,
      sensitivePayloads: "id, pubkeyHex, structureKind, createdAt, updatedAt, deletedAt",
      postHistoryChildInteractions: "id, eventId, parentEventId, rootEventId, authorPubkey, kind, createdAt, fetchedAt, updatedAt, schemaVersion, [parentEventId+createdAt]",
      postHistoryDeletionRequests: "id, targetEventId, targetAuthorPubkey, deletionEventId, fetchedAt, [targetAuthorPubkey+targetEventId]",
      postMediaCache: "cacheKey, url, normalizedUrl, size, createdAt, lastAccessedAt, updatedAt, source, schemaVersion",
      channelMetadata: "channelEventId, fetchedAt, metadataCreatedAt, creatorPubkey, updatedAt, schemaVersion",
      channelImageCacheMeta: "url, responseType, fetchedAt, lastAttemptAt, lastAccessedAt, schemaVersion"
    });
  }
}
const xt = new $y();
function jr(e) {
  self.postMessage(e);
}
function Ky() {
  return {
    post: xt.postHistory,
    deletion: xt.postHistoryDeletionRequests,
    transaction: {
      post: (e) => xt.transaction(
        "rw",
        xt.postHistory,
        e
      ),
      deletion: (e) => xt.transaction(
        "rw",
        xt.postHistoryDeletionRequests,
        e
      )
    }
  };
}
async function Uy(e) {
  jr({ type: "progress", progress: { phase: "loading" } });
  const [t, r] = await Promise.all([
    xt.postHistory.where("pubkeyHex").equals(e).toArray(),
    xt.postHistoryDeletionRequests.where("targetAuthorPubkey").equals(e).toArray()
  ]), o = await xt.sensitivePayloads.where("pubkeyHex").equals(e).toArray(), { result: s, blob: u } = await Ry({
    pubkeyHex: e,
    postRecords: t,
    deletionRecords: r,
    sensitivePayloadRecords: o,
    verificationStores: Ky(),
    onProgress: (f) => jr({ type: "progress", progress: f })
  });
  return { result: s, blob: u };
}
self.addEventListener("message", (e) => {
  e.data?.type === "export" && Uy(e.data.pubkeyHex).then(({ result: t, blob: r }) => jr({ type: "complete", result: t, blob: r })).catch((t) => jr({
    type: "error",
    message: t instanceof Error ? t.message : "post_history_export_worker_failed"
  }));
});
