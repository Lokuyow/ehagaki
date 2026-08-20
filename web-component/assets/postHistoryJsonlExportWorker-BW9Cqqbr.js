var Nu = Object.defineProperty, Pu = (e, t, r) => t in e ? Nu(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, Ae = (e, t, r) => Pu(e, typeof t != "symbol" ? t + "" : t, r);
function Du(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in e && e.BYTES_PER_ELEMENT === 1;
}
function sa(e, t = "") {
  if (typeof e != "number") {
    const r = t && `"${t}" `;
    throw new TypeError(`${r}expected number, got ${typeof e}`);
  }
  if (!Number.isSafeInteger(e) || e < 0) {
    const r = t && `"${t}" `;
    throw new RangeError(`${r}expected integer >= 0, got ${e}`);
  }
}
function Fn(e, t, r = "") {
  const o = Du(e), s = e?.length;
  if (!o || t !== void 0) {
    const f = r && `"${r}" `, p = "", h = o ? `length=${s}` : `type=${typeof e}`, m = f + "expected Uint8Array" + p + ", got " + h;
    throw o ? new RangeError(m) : new TypeError(m);
  }
  return e;
}
function Ss(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function qu(e, t) {
  Fn(e, void 0, "digestInto() output");
  const r = t.outputLen;
  if (e.length < r)
    throw new RangeError('"digestInto() output" expected to be of length >=' + r);
}
function Go(...e) {
  for (let t = 0; t < e.length; t++)
    e[t].fill(0);
}
function No(e) {
  return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function lt(e, t) {
  return e << 32 - t | e >>> t;
}
const aa = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", $u = /* @__PURE__ */ Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function ii(e) {
  if (Fn(e), aa)
    return e.toHex();
  let t = "";
  for (let r = 0; r < e.length; r++)
    t += $u[e[r]];
  return t;
}
const wt = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Bs(e) {
  if (e >= wt._0 && e <= wt._9)
    return e - wt._0;
  if (e >= wt.A && e <= wt.F)
    return e - (wt.A - 10);
  if (e >= wt.a && e <= wt.f)
    return e - (wt.a - 10);
}
function Ku(e) {
  if (typeof e != "string")
    throw new TypeError("hex string expected, got " + typeof e);
  if (aa)
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
    const f = Bs(e.charCodeAt(u)), p = Bs(e.charCodeAt(u + 1));
    if (f === void 0 || p === void 0) {
      const h = e[u] + e[u + 1];
      throw new RangeError('hex string expected, got non-hex character "' + h + '" at index ' + u);
    }
    o[s] = f * 16 + p;
  }
  return o;
}
function Uu(e, t = {}) {
  const r = (s, u) => e(u).update(s).digest(), o = e(void 0);
  return r.outputLen = o.outputLen, r.blockLen = o.blockLen, r.canXOF = o.canXOF, r.create = (s) => e(s), Object.assign(r, t), Object.freeze(r);
}
const Mu = (e) => ({
  // Current NIST hashAlgs suffixes used here fit in one DER subidentifier octet.
  // Larger suffix values would need base-128 OID encoding and a different length byte.
  oid: Uint8Array.from([6, 9, 96, 134, 72, 1, 101, 3, 4, 2, e])
});
function ju(e, t, r) {
  return e & t ^ ~e & r;
}
function Fu(e, t, r) {
  return e & t ^ e & r ^ t & r;
}
let Hu = class {
  constructor(t, r, o, s) {
    Ae(this, "blockLen"), Ae(this, "outputLen"), Ae(this, "canXOF", !1), Ae(this, "padOffset"), Ae(this, "isLE"), Ae(this, "buffer"), Ae(this, "view"), Ae(this, "finished", !1), Ae(this, "length", 0), Ae(this, "pos", 0), Ae(this, "destroyed", !1), this.blockLen = t, this.outputLen = r, this.padOffset = o, this.isLE = s, this.buffer = new Uint8Array(t), this.view = No(this.buffer);
  }
  update(t) {
    Ss(this), Fn(t);
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
    Ss(this), qu(t, this), this.finished = !0;
    const { buffer: r, view: o, blockLen: s, isLE: u } = this;
    let { pos: f } = this;
    r[f++] = 128, Go(this.buffer.subarray(f)), this.padOffset > s - f && (this.process(o, 0), f = 0);
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
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: r, buffer: o, length: s, finished: u, destroyed: f, pos: p } = this;
    return t.destroyed = f, t.finished = u, t.length = s, t.pos = p, s % r && t.buffer.set(o), t;
  }
  clone() {
    return this._cloneInto();
  }
};
const Lt = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Vu = /* @__PURE__ */ Uint32Array.from([
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
let zu = class extends Hu {
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
      const N = Nt[w - 15], T = Nt[w - 2], P = lt(N, 7) ^ lt(N, 18) ^ N >>> 3, q = lt(T, 17) ^ lt(T, 19) ^ T >>> 10;
      Nt[w] = q + Nt[w - 7] + P + Nt[w - 16] | 0;
    }
    let { A: o, B: s, C: u, D: f, E: p, F: h, G: m, H: v } = this;
    for (let w = 0; w < 64; w++) {
      const N = lt(p, 6) ^ lt(p, 11) ^ lt(p, 25), T = v + N + ju(p, h, m) + Vu[w] + Nt[w] | 0, q = (lt(o, 2) ^ lt(o, 13) ^ lt(o, 22)) + Fu(o, s, u) | 0;
      v = m, m = h, h = p, p = f + T | 0, f = u, u = s, s = o, o = T + q | 0;
    }
    o = o + this.A | 0, s = s + this.B | 0, u = u + this.C | 0, f = f + this.D | 0, p = p + this.E | 0, h = h + this.F | 0, m = m + this.G | 0, v = v + this.H | 0, this.set(o, s, u, f, p, h, m, v);
  }
  roundClean() {
    Go(Nt);
  }
  destroy() {
    this.destroyed = !0, this.set(0, 0, 0, 0, 0, 0, 0, 0), Go(this.buffer);
  }
}, Zu = class extends zu {
  constructor() {
    super(32), Ae(this, "A", Lt[0] | 0), Ae(this, "B", Lt[1] | 0), Ae(this, "C", Lt[2] | 0), Ae(this, "D", Lt[3] | 0), Ae(this, "E", Lt[4] | 0), Ae(this, "F", Lt[5] | 0), Ae(this, "G", Lt[6] | 0), Ae(this, "H", Lt[7] | 0);
  }
};
const Gu = /* @__PURE__ */ Uu(
  () => new Zu(),
  /* @__PURE__ */ Mu(1)
);
const Or = (e, t, r) => Fn(e, t, r), ca = sa, Ir = /* @__PURE__ */ BigInt(0), Wu = /* @__PURE__ */ BigInt(1);
function Yu(e, t = "") {
  if (typeof e != "boolean") {
    const r = t && `"${t}" `;
    throw new TypeError(r + "expected boolean, got type=" + typeof e);
  }
  return e;
}
function si(e) {
  if (typeof e == "bigint") {
    if (!tl(e))
      throw new RangeError("positive bigint expected, got " + e);
  } else
    ca(e);
  return e;
}
function Xu(e, t = "") {
  if (typeof e != "number") {
    const r = t && `"${t}" `;
    throw new TypeError(r + "expected number, got type=" + typeof e);
  }
  if (!Number.isSafeInteger(e)) {
    const r = t && `"${t}" `;
    throw new RangeError(r + "expected safe integer, got " + e);
  }
}
function wr(e) {
  const t = si(e).toString(16);
  return t.length & 1 ? "0" + t : t;
}
function ua(e) {
  if (typeof e != "string")
    throw new TypeError("hex string expected, got " + typeof e);
  return e === "" ? Ir : BigInt("0x" + e);
}
function la(e) {
  return ua(ii(e));
}
function Ju(e) {
  return ua(ii(el(Fn(e)).reverse()));
}
function fa(e, t) {
  if (sa(t), t === 0)
    throw new RangeError("zero length");
  e = si(e);
  const r = e.toString(16);
  if (r.length > t * 2)
    throw new RangeError("number too large");
  return Ku(r.padStart(t * 2, "0"));
}
function Qu(e, t) {
  return fa(e, t).reverse();
}
function el(e) {
  return Uint8Array.from(Or(e));
}
const tl = (e) => typeof e == "bigint" && Ir <= e;
function nl(e) {
  if (e < Ir)
    throw new Error("expected non-negative bigint, got " + e);
  let t;
  for (t = 0; e > Ir; e >>= Wu, t += 1)
    ;
  return t;
}
const Ve = /* @__PURE__ */ BigInt(0), Xe = /* @__PURE__ */ BigInt(1), tn = /* @__PURE__ */ BigInt(2), da = /* @__PURE__ */ BigInt(3), ha = /* @__PURE__ */ BigInt(4), pa = /* @__PURE__ */ BigInt(5), rl = /* @__PURE__ */ BigInt(7), ya = /* @__PURE__ */ BigInt(8), ol = /* @__PURE__ */ BigInt(9), ga = /* @__PURE__ */ BigInt(16);
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
function Rs(e, t) {
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
function ai(e, t, r) {
  const o = e;
  if (!o.eql(o.sqr(t), r))
    throw new Error("Cannot find square root");
}
function ma(e, t) {
  const r = e, o = (r.ORDER + Xe) / ha, s = r.pow(t, o);
  return ai(r, s, t), s;
}
function il(e, t) {
  const r = e, o = (r.ORDER - pa) / ya, s = r.mul(t, tn), u = r.pow(s, o), f = r.mul(t, u), p = r.mul(r.mul(f, tn), u), h = r.mul(f, r.sub(p, r.ONE));
  return ai(r, h, t), h;
}
function sl(e) {
  const t = ci(e), r = va(e), o = r(t, t.neg(t.ONE)), s = r(t, o), u = r(t, t.neg(o)), f = (e + rl) / ga;
  return (p, h) => {
    const m = p;
    let v = m.pow(h, f), w = m.mul(v, o);
    const N = m.mul(v, s), T = m.mul(v, u), P = m.eql(m.sqr(w), h), q = m.eql(m.sqr(N), h);
    v = m.cmov(v, w, P), w = m.cmov(T, N, q);
    const L = m.eql(m.sqr(w), h), H = m.cmov(v, w, L);
    return ai(m, H, h), H;
  };
}
function va(e) {
  if (e < da)
    throw new Error("sqrt is not defined for small field");
  let t = e - Xe, r = 0;
  for (; t % tn === Ve; )
    t /= tn, r++;
  let o = tn;
  const s = ci(e);
  for (; Os(s, o) === 1; )
    if (o++ > 1e3)
      throw new Error("Cannot find square root: probably non-prime P");
  if (r === 1)
    return ma;
  let u = s.pow(o, t);
  const f = (t + Xe) / tn;
  return function(h, m) {
    const v = h;
    if (v.is0(m))
      return m;
    if (Os(v, m) !== 1)
      throw new Error("Cannot find square root");
    let w = r, N = v.mul(v.ONE, u), T = v.pow(m, t), P = v.pow(m, f);
    for (; !v.eql(T, v.ONE); ) {
      if (v.is0(T))
        return v.ZERO;
      let q = 1, L = v.sqr(T);
      for (; !v.eql(L, v.ONE); )
        if (q++, L = v.sqr(L), q === w)
          throw new Error("Cannot find square root");
      const H = Xe << BigInt(w - q - 1), Y = v.pow(N, H);
      w = q, N = v.sqr(Y), T = v.mul(T, N), P = v.mul(P, Y);
    }
    return P;
  };
}
function al(e) {
  return e % ha === da ? ma : e % ya === pa ? il : e % ga === ol ? sl(e) : va(e);
}
function cl(e, t, r) {
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
function ul(e, t, r = !1) {
  const o = e, s = new Array(t.length).fill(r ? o.ZERO : void 0), u = t.reduce((p, h, m) => o.is0(h) ? p : (s[m] = p, o.mul(p, h)), o.ONE), f = o.inv(u);
  return t.reduceRight((p, h, m) => o.is0(h) ? p : (s[m] = o.mul(p, s[m]), o.mul(p, h)), f), s;
}
function Os(e, t) {
  const r = e, o = (r.ORDER - Xe) / tn, s = r.pow(t, o), u = r.eql(s, r.ONE), f = r.eql(s, r.ZERO), p = r.eql(s, r.neg(r.ONE));
  if (!u && !f && !p)
    throw new Error("invalid Legendre symbol result");
  return u ? 1 : f ? 0 : -1;
}
function ll(e, t) {
  if (t !== void 0 && ca(t), e <= Ve)
    throw new Error("invalid n length: expected positive n, got " + e);
  if (t !== void 0 && t < 1)
    throw new Error("invalid n length: expected positive bit length, got " + t);
  const r = nl(e);
  if (t !== void 0 && t < r)
    throw new Error(`invalid n length: expected bit length (${r}) >= n.length (${t})`);
  const o = t !== void 0 ? t : r, s = Math.ceil(o / 8);
  return { nBitLength: o, nByteLength: s };
}
const Is = /* @__PURE__ */ new WeakMap();
let wa = class {
  constructor(t, r = {}) {
    if (Ae(this, "ORDER"), Ae(this, "BITS"), Ae(this, "BYTES"), Ae(this, "isLE"), Ae(this, "ZERO", Ve), Ae(this, "ONE", Xe), Ae(this, "_lengths"), Ae(this, "_mod"), t <= Xe)
      throw new Error("invalid field: expected ORDER > 1, got " + t);
    let o;
    this.isLE = !1, r != null && typeof r == "object" && (typeof r.BITS == "number" && (o = r.BITS), typeof r.sqrt == "function" && Object.defineProperty(this, "sqrt", { value: r.sqrt, enumerable: !0 }), typeof r.isLE == "boolean" && (this.isLE = r.isLE), r.allowedLengths && (this._lengths = Object.freeze(r.allowedLengths.slice())), typeof r.modFromBytes == "boolean" && (this._mod = r.modFromBytes));
    const { nBitLength: s, nByteLength: u } = ll(t, o);
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
    return cl(this, t, r);
  }
  div(t, r) {
    return dt(t * Rs(r, this.ORDER), this.ORDER);
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
    return Rs(t, this.ORDER);
  }
  sqrt(t) {
    let r = Is.get(this);
    return r || Is.set(this, r = al(this.ORDER)), r(this, t);
  }
  toBytes(t) {
    return this.isLE ? Qu(t, this.BYTES) : fa(t, this.BYTES);
  }
  fromBytes(t, r = !1) {
    Or(t);
    const { _lengths: o, BYTES: s, isLE: u, ORDER: f, _mod: p } = this;
    if (o) {
      if (t.length < 1 || !o.includes(t.length) || t.length > s)
        throw new Error("Field.fromBytes: expected " + o + " bytes, got " + t.length);
      const m = new Uint8Array(s);
      m.set(t, u ? 0 : m.length - t.length), t = m;
    }
    if (t.length !== s)
      throw new Error("Field.fromBytes: expected " + s + " bytes, got " + t.length);
    let h = u ? Ju(t) : la(t);
    if (p && (h = dt(h, f)), !r && !this.isValid(h))
      throw new Error("invalid field element: outside of range 0..ORDER");
    return h;
  }
  // TODO: we don't need it here, move out to separate fn
  invertBatch(t) {
    return ul(this, t);
  }
  // We can't move this out because Fp6, Fp12 implement it
  // and it's unclear what to return in there.
  cmov(t, r, o) {
    return Yu(o, "condition"), o ? r : t;
  }
};
Object.freeze(wa.prototype);
function ci(e, t = {}) {
  return new wa(e, t);
}
let fl = class extends Error {
  constructor(t = "") {
    super(t);
  }
};
const _t = {
  // asn.1 DER encoding utils
  Err: fl,
  // Basic building block is TLV (Tag-Length-Value)
  _tlv: {
    encode: (e, t) => {
      const { Err: r } = _t;
      if (Xu(e, "tag"), e < 0 || e > 255)
        throw new r("tlv.encode: wrong tag");
      if (typeof t != "string")
        throw new TypeError('"data" expected string, got type=' + typeof t);
      if (t.length & 1)
        throw new r("tlv.encode: unpadded data");
      const o = t.length / 2, s = wr(o);
      if (s.length / 2 & 128)
        throw new r("tlv.encode: long form length too big");
      const u = o > 127 ? wr(s.length / 2 | 128) : "";
      return wr(e) + u + s + t;
    },
    // v - value, l - left bytes (unparsed)
    decode(e, t) {
      const { Err: r } = _t;
      t = Or(t, void 0, "DER data");
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
      if (si(e), e < dl)
        throw new t("integer: negative integers are not allowed");
      let r = wr(e);
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
      return la(e);
    }
  },
  toSig(e) {
    const { Err: t, _int: r, _tlv: o } = _t, s = Or(e, void 0, "signature"), { v: u, l: f } = o.decode(48, s);
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
const dl = /* @__PURE__ */ BigInt(0);
const ba = {
  p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: BigInt(1),
  a: BigInt(0),
  b: BigInt(7),
  Gx: BigInt("0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"),
  Gy: BigInt("0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8")
};
BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"), BigInt("0x3086d221a7d46bcde86c90e49284eb15"), -BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), BigInt("0x3086d221a7d46bcde86c90e49284eb15");
const Ts = /* @__PURE__ */ BigInt(2);
function hl(e) {
  const t = ba.p, r = BigInt(3), o = BigInt(6), s = BigInt(11), u = BigInt(22), f = BigInt(23), p = BigInt(44), h = BigInt(88), m = e * e * e % t, v = m * m * e % t, w = rt(v, r, t) * v % t, N = rt(w, r, t) * v % t, T = rt(N, Ts, t) * m % t, P = rt(T, s, t) * T % t, q = rt(P, u, t) * P % t, L = rt(q, p, t) * q % t, H = rt(L, h, t) * L % t, Y = rt(H, p, t) * q % t, he = rt(Y, r, t) * v % t, ve = rt(he, f, t) * P % t, Me = rt(ve, o, t) * m % t, de = rt(Me, Ts, t);
  if (!Cs.eql(Cs.sqr(de), e))
    throw new Error("Cannot find square root");
  return de;
}
const Cs = ci(ba.p, { sqrt: hl }), pl = new TextEncoder();
function yl(e) {
  return ii(Gu(pl.encode(e)));
}
function ui(e) {
  const t = JSON.stringify([
    0,
    e.pubkey,
    e.created_at,
    e.kind,
    e.tags,
    e.content
  ]);
  return yl(t);
}
function li(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function Mt(e, t = "") {
  if (!Number.isSafeInteger(e) || e < 0) {
    const r = t && `"${t}" `;
    throw new Error(`${r}expected integer >= 0, got ${e}`);
  }
}
function ke(e, t, r = "") {
  const o = li(e), s = e?.length, u = t !== void 0;
  if (!o || u && s !== t) {
    const f = r && `"${r}" `, p = u ? ` of length ${t}` : "", h = o ? `length=${s}` : `type=${typeof e}`;
    throw new Error(f + "expected Uint8Array" + p + ", got " + h);
  }
  return e;
}
function Mr(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash must wrapped by utils.createHasher");
  Mt(e.outputLen), Mt(e.blockLen);
}
function Tr(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function gl(e, t) {
  ke(e, void 0, "digestInto() output");
  const r = t.outputLen;
  if (e.length < r)
    throw new Error('"digestInto() output" expected to be of length >=' + r);
}
function jn(...e) {
  for (let t = 0; t < e.length; t++)
    e[t].fill(0);
}
function Po(e) {
  return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function ft(e, t) {
  return e << 32 - t | e >>> t;
}
const Ea = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", ml = /* @__PURE__ */ Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Ne(e) {
  if (ke(e), Ea)
    return e.toHex();
  let t = "";
  for (let r = 0; r < e.length; r++)
    t += ml[e[r]];
  return t;
}
const bt = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Ls(e) {
  if (e >= bt._0 && e <= bt._9)
    return e - bt._0;
  if (e >= bt.A && e <= bt.F)
    return e - (bt.A - 10);
  if (e >= bt.a && e <= bt.f)
    return e - (bt.a - 10);
}
function Pe(e) {
  if (typeof e != "string")
    throw new Error("hex string expected, got " + typeof e);
  if (Ea)
    return Uint8Array.fromHex(e);
  const t = e.length, r = t / 2;
  if (t % 2)
    throw new Error("hex string expected, got unpadded hex of length " + t);
  const o = new Uint8Array(r);
  for (let s = 0, u = 0; s < r; s++, u += 2) {
    const f = Ls(e.charCodeAt(u)), p = Ls(e.charCodeAt(u + 1));
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
function vl(e, t = {}) {
  const r = (s, u) => e(u).update(s).digest(), o = e(void 0);
  return r.outputLen = o.outputLen, r.blockLen = o.blockLen, r.create = (s) => e(s), Object.assign(r, t), Object.freeze(r);
}
function An(e = 32) {
  const t = typeof globalThis == "object" ? globalThis.crypto : null;
  if (typeof t?.getRandomValues != "function")
    throw new Error("crypto.getRandomValues must be defined");
  return t.getRandomValues(new Uint8Array(e));
}
const wl = (e) => ({
  oid: Uint8Array.from([6, 9, 96, 134, 72, 1, 101, 3, 4, 2, e])
});
function bl(e, t, r) {
  return e & t ^ ~e & r;
}
function El(e, t, r) {
  return e & t ^ e & r ^ t & r;
}
class _l {
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
    this.blockLen = t, this.outputLen = r, this.padOffset = o, this.isLE = s, this.buffer = new Uint8Array(t), this.view = Po(this.buffer);
  }
  update(t) {
    Tr(this), ke(t);
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
    Tr(this), gl(t, this), this.finished = !0;
    const { buffer: r, view: o, blockLen: s, isLE: u } = this;
    let { pos: f } = this;
    r[f++] = 128, jn(this.buffer.subarray(f)), this.padOffset > s - f && (this.process(o, 0), f = 0);
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
    t ||= new this.constructor(), t.set(...this.get());
    const { blockLen: r, buffer: o, length: s, finished: u, destroyed: f, pos: p } = this;
    return t.destroyed = f, t.finished = u, t.length = s, t.pos = p, s % r && t.buffer.set(o), t;
  }
  clone() {
    return this._cloneInto();
  }
}
const Pt = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), xl = /* @__PURE__ */ Uint32Array.from([
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
]), Dt = /* @__PURE__ */ new Uint32Array(64);
class Al extends _l {
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
      Dt[w] = t.getUint32(r, !1);
    for (let w = 16; w < 64; w++) {
      const N = Dt[w - 15], T = Dt[w - 2], P = ft(N, 7) ^ ft(N, 18) ^ N >>> 3, q = ft(T, 17) ^ ft(T, 19) ^ T >>> 10;
      Dt[w] = q + Dt[w - 7] + P + Dt[w - 16] | 0;
    }
    let { A: o, B: s, C: u, D: f, E: p, F: h, G: m, H: v } = this;
    for (let w = 0; w < 64; w++) {
      const N = ft(p, 6) ^ ft(p, 11) ^ ft(p, 25), T = v + N + bl(p, h, m) + xl[w] + Dt[w] | 0, q = (ft(o, 2) ^ ft(o, 13) ^ ft(o, 22)) + El(o, s, u) | 0;
      v = m, m = h, h = p, p = f + T | 0, f = u, u = s, s = o, o = T + q | 0;
    }
    o = o + this.A | 0, s = s + this.B | 0, u = u + this.C | 0, f = f + this.D | 0, p = p + this.E | 0, h = h + this.F | 0, m = m + this.G | 0, v = v + this.H | 0, this.set(o, s, u, f, p, h, m, v);
  }
  roundClean() {
    jn(Dt);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), jn(this.buffer);
  }
}
class kl extends Al {
  // We cannot use array here since array allows indexing by variable
  // which means optimizer/compiler cannot use registers.
  A = Pt[0] | 0;
  B = Pt[1] | 0;
  C = Pt[2] | 0;
  D = Pt[3] | 0;
  E = Pt[4] | 0;
  F = Pt[5] | 0;
  G = Pt[6] | 0;
  H = Pt[7] | 0;
  constructor() {
    super(32);
  }
}
const pt = /* @__PURE__ */ vl(
  () => new kl(),
  /* @__PURE__ */ wl(1)
);
const fi = /* @__PURE__ */ BigInt(0), Wo = /* @__PURE__ */ BigInt(1);
function Cr(e, t = "") {
  if (typeof e != "boolean") {
    const r = t && `"${t}" `;
    throw new Error(r + "expected boolean, got type=" + typeof e);
  }
  return e;
}
function _a(e) {
  if (typeof e == "bigint") {
    if (!Ar(e))
      throw new Error("positive bigint expected, got " + e);
  } else
    Mt(e);
  return e;
}
function br(e) {
  const t = _a(e).toString(16);
  return t.length & 1 ? "0" + t : t;
}
function xa(e) {
  if (typeof e != "string")
    throw new Error("hex string expected, got " + typeof e);
  return e === "" ? fi : BigInt("0x" + e);
}
function Hn(e) {
  return xa(Ne(e));
}
function Aa(e) {
  return xa(Ne(Sl(ke(e)).reverse()));
}
function di(e, t) {
  Mt(t), e = _a(e);
  const r = Pe(e.toString(16).padStart(t * 2, "0"));
  if (r.length !== t)
    throw new Error("number too large");
  return r;
}
function ka(e, t) {
  return di(e, t).reverse();
}
function Sl(e) {
  return Uint8Array.from(e);
}
function Bl(e) {
  return Uint8Array.from(e, (t, r) => {
    const o = t.charCodeAt(0);
    if (t.length !== 1 || o > 127)
      throw new Error(`string contains non-ASCII character "${e[r]}" with code ${o} at position ${r}`);
    return o;
  });
}
const Ar = (e) => typeof e == "bigint" && fi <= e;
function Rl(e, t, r) {
  return Ar(e) && Ar(t) && Ar(r) && t <= e && e < r;
}
function Ol(e, t, r, o) {
  if (!Rl(t, r, o))
    throw new Error("expected valid " + e + ": " + r + " <= n < " + o + ", got " + t);
}
function Il(e) {
  let t;
  for (t = 0; e > fi; e >>= Wo, t += 1)
    ;
  return t;
}
const hi = (e) => (Wo << BigInt(e)) - Wo;
function Tl(e, t, r) {
  if (Mt(e, "hashLen"), Mt(t, "qByteLen"), typeof r != "function")
    throw new Error("hmacFn must be a function");
  const o = (L) => new Uint8Array(L), s = Uint8Array.of(), u = Uint8Array.of(0), f = Uint8Array.of(1), p = 1e3;
  let h = o(e), m = o(e), v = 0;
  const w = () => {
    h.fill(1), m.fill(0), v = 0;
  }, N = (...L) => r(m, Je(h, ...L)), T = (L = s) => {
    m = N(u, L), h = N(), L.length !== 0 && (m = N(f, L), h = N());
  }, P = () => {
    if (v++ >= p)
      throw new Error("drbg: tried max amount of iterations");
    let L = 0;
    const H = [];
    for (; L < t; ) {
      h = N();
      const Y = h.slice();
      H.push(Y), L += h.length;
    }
    return Je(...H);
  };
  return (L, H) => {
    w(), T(L);
    let Y;
    for (; !(Y = H(P())); )
      T();
    return w(), Y;
  };
}
function pi(e, t = {}, r = {}) {
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
function Ns(e) {
  const t = /* @__PURE__ */ new WeakMap();
  return (r, ...o) => {
    const s = t.get(r);
    if (s !== void 0)
      return s;
    const u = e(r, ...o);
    return t.set(r, u), u;
  };
}
const Qe = /* @__PURE__ */ BigInt(0), Ge = /* @__PURE__ */ BigInt(1), nn = /* @__PURE__ */ BigInt(2), Sa = /* @__PURE__ */ BigInt(3), Ba = /* @__PURE__ */ BigInt(4), Ra = /* @__PURE__ */ BigInt(5), Cl = /* @__PURE__ */ BigInt(7), Oa = /* @__PURE__ */ BigInt(8), Ll = /* @__PURE__ */ BigInt(9), Ia = /* @__PURE__ */ BigInt(16);
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
function Ps(e, t) {
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
function yi(e, t, r) {
  if (!e.eql(e.sqr(t), r))
    throw new Error("Cannot find square root");
}
function Ta(e, t) {
  const r = (e.ORDER + Ge) / Ba, o = e.pow(t, r);
  return yi(e, o, t), o;
}
function Nl(e, t) {
  const r = (e.ORDER - Ra) / Oa, o = e.mul(t, nn), s = e.pow(o, r), u = e.mul(t, s), f = e.mul(e.mul(u, nn), s), p = e.mul(u, e.sub(f, e.ONE));
  return yi(e, p, t), p;
}
function Pl(e) {
  const t = jr(e), r = Ca(e), o = r(t, t.neg(t.ONE)), s = r(t, o), u = r(t, t.neg(o)), f = (e + Cl) / Ia;
  return (p, h) => {
    let m = p.pow(h, f), v = p.mul(m, o);
    const w = p.mul(m, s), N = p.mul(m, u), T = p.eql(p.sqr(v), h), P = p.eql(p.sqr(w), h);
    m = p.cmov(m, v, T), v = p.cmov(N, w, P);
    const q = p.eql(p.sqr(v), h), L = p.cmov(m, v, q);
    return yi(p, L, h), L;
  };
}
function Ca(e) {
  if (e < Sa)
    throw new Error("sqrt is not defined for small field");
  let t = e - Ge, r = 0;
  for (; t % nn === Qe; )
    t /= nn, r++;
  let o = nn;
  const s = jr(e);
  for (; Ds(s, o) === 1; )
    if (o++ > 1e3)
      throw new Error("Cannot find square root: probably non-prime P");
  if (r === 1)
    return Ta;
  let u = s.pow(o, t);
  const f = (t + Ge) / nn;
  return function(h, m) {
    if (h.is0(m))
      return m;
    if (Ds(h, m) !== 1)
      throw new Error("Cannot find square root");
    let v = r, w = h.mul(h.ONE, u), N = h.pow(m, t), T = h.pow(m, f);
    for (; !h.eql(N, h.ONE); ) {
      if (h.is0(N))
        return h.ZERO;
      let P = 1, q = h.sqr(N);
      for (; !h.eql(q, h.ONE); )
        if (P++, q = h.sqr(q), P === v)
          throw new Error("Cannot find square root");
      const L = Ge << BigInt(v - P - 1), H = h.pow(w, L);
      v = P, w = h.sqr(H), N = h.mul(N, w), T = h.mul(T, H);
    }
    return T;
  };
}
function Dl(e) {
  return e % Ba === Sa ? Ta : e % Oa === Ra ? Nl : e % Ia === Ll ? Pl(e) : Ca(e);
}
const ql = [
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
function $l(e) {
  const t = {
    ORDER: "bigint",
    BYTES: "number",
    BITS: "number"
  }, r = ql.reduce((o, s) => (o[s] = "function", o), t);
  return pi(e, r), e;
}
function Kl(e, t, r) {
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
function La(e, t, r = !1) {
  const o = new Array(t.length).fill(r ? e.ZERO : void 0), s = t.reduce((f, p, h) => e.is0(p) ? f : (o[h] = f, e.mul(f, p)), e.ONE), u = e.inv(s);
  return t.reduceRight((f, p, h) => e.is0(p) ? f : (o[h] = e.mul(f, o[h]), e.mul(f, p)), u), o;
}
function Ds(e, t) {
  const r = (e.ORDER - Ge) / nn, o = e.pow(t, r), s = e.eql(o, e.ONE), u = e.eql(o, e.ZERO), f = e.eql(o, e.neg(e.ONE));
  if (!s && !u && !f)
    throw new Error("invalid Legendre symbol result");
  return s ? 1 : u ? 0 : -1;
}
function Ul(e, t) {
  t !== void 0 && Mt(t);
  const r = t !== void 0 ? t : e.toString(2).length, o = Math.ceil(r / 8);
  return { nBitLength: r, nByteLength: o };
}
class Ml {
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
    const { nBitLength: s, nByteLength: u } = Ul(t, o);
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
    return Kl(this, t, r);
  }
  div(t, r) {
    return at(t * Ps(r, this.ORDER), this.ORDER);
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
    return Ps(t, this.ORDER);
  }
  sqrt(t) {
    return this._sqrt || (this._sqrt = Dl(this.ORDER)), this._sqrt(this, t);
  }
  toBytes(t) {
    return this.isLE ? ka(t, this.BYTES) : di(t, this.BYTES);
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
    let h = u ? Aa(t) : Hn(t);
    if (p && (h = at(h, f)), !r && !this.isValid(h))
      throw new Error("invalid field element: outside of range 0..ORDER");
    return h;
  }
  // TODO: we don't need it here, move out to separate fn
  invertBatch(t) {
    return La(this, t);
  }
  // We can't move this out because Fp6, Fp12 implement it
  // and it's unclear what to return in there.
  cmov(t, r, o) {
    return o ? r : t;
  }
}
function jr(e, t = {}) {
  return new Ml(e, t);
}
function Na(e) {
  if (typeof e != "bigint")
    throw new Error("field order must be bigint");
  const t = e.toString(2).length;
  return Math.ceil(t / 8);
}
function Pa(e) {
  const t = Na(e);
  return t + Math.ceil(t / 2);
}
function Da(e, t, r = !1) {
  ke(e);
  const o = e.length, s = Na(t), u = Pa(t);
  if (o < 16 || o < u || o > 1024)
    throw new Error("expected " + u + "-1024 bytes of input, got " + o);
  const f = r ? Aa(e) : Hn(e), p = at(f, t - Ge) + Ge;
  return r ? ka(p, s) : di(p, s);
}
const En = /* @__PURE__ */ BigInt(0), rn = /* @__PURE__ */ BigInt(1);
function Lr(e, t) {
  const r = t.negate();
  return e ? r : t;
}
function qs(e, t) {
  const r = La(e.Fp, t.map((o) => o.Z));
  return t.map((o, s) => e.fromAffine(o.toAffine(r[s])));
}
function qa(e, t) {
  if (!Number.isSafeInteger(e) || e <= 0 || e > t)
    throw new Error("invalid window size, expected [1.." + t + "], got W=" + e);
}
function Do(e, t) {
  qa(e, t);
  const r = Math.ceil(t / e) + 1, o = 2 ** (e - 1), s = 2 ** e, u = hi(e), f = BigInt(e);
  return { windows: r, windowSize: o, mask: u, maxNumber: s, shiftBy: f };
}
function $s(e, t, r) {
  const { windowSize: o, mask: s, maxNumber: u, shiftBy: f } = r;
  let p = Number(e & s), h = e >> f;
  p > o && (p -= u, h += rn);
  const m = t * o, v = m + Math.abs(p) - 1, w = p === 0, N = p < 0, T = t % 2 !== 0;
  return { nextN: h, offset: v, isZero: w, isNeg: N, isNegF: T, offsetF: m };
}
const qo = /* @__PURE__ */ new WeakMap(), $a = /* @__PURE__ */ new WeakMap();
function $o(e) {
  return $a.get(e) || 1;
}
function Ks(e) {
  if (e !== En)
    throw new Error("invalid wNAF");
}
class jl {
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
      const { nextN: h, offset: m, isZero: v, isNeg: w, isNegF: N, offsetF: T } = $s(o, p, f);
      o = h, v ? u = u.add(Lr(N, r[T])) : s = s.add(Lr(w, r[m]));
    }
    return Ks(o), { p: s, f: u };
  }
  /**
   * Implements ec unsafe (non const-time) multiplication using precomputed tables and w-ary non-adjacent form.
   * @param acc accumulator point to add result of multiplication
   * @returns point
   */
  wNAFUnsafe(t, r, o, s = this.ZERO) {
    const u = Do(t, this.bits);
    for (let f = 0; f < u.windows && o !== En; f++) {
      const { nextN: p, offset: h, isZero: m, isNeg: v } = $s(o, f, u);
      if (o = p, !m) {
        const w = r[h];
        s = s.add(v ? w.negate() : w);
      }
    }
    return Ks(o), s;
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
    qa(r, this.bits), $a.set(t, r), qo.delete(t);
  }
  hasCache(t) {
    return $o(t) !== 1;
  }
}
function Fl(e, t, r, o) {
  let s = t, u = e.ZERO, f = e.ZERO;
  for (; r > En || o > En; )
    r & rn && (u = u.add(s)), o & rn && (f = f.add(s)), s = s.double(), r >>= rn, o >>= rn;
  return { p1: u, p2: f };
}
function Us(e, t, r) {
  if (t) {
    if (t.ORDER !== e)
      throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
    return $l(t), t;
  } else
    return jr(e, { isLE: r });
}
function Hl(e, t, r = {}, o) {
  if (o === void 0 && (o = e === "edwards"), !t || typeof t != "object")
    throw new Error(`expected valid ${e} CURVE object`);
  for (const h of ["p", "n", "h"]) {
    const m = t[h];
    if (!(typeof m == "bigint" && m > En))
      throw new Error(`CURVE.${h} must be positive bigint`);
  }
  const s = Us(t.p, r.Fp, o), u = Us(t.n, r.Fn, o), p = ["Gx", "Gy", "a", "b"];
  for (const h of p)
    if (!s.isValid(t[h]))
      throw new Error(`CURVE.${h} must be valid field element of CURVE.Fp`);
  return t = Object.freeze(Object.assign({}, t)), { CURVE: t, Fp: s, Fn: u };
}
function Ka(e, t) {
  return function(o) {
    const s = e(o);
    return { secretKey: s, publicKey: t(s) };
  };
}
class Ua {
  oHash;
  iHash;
  blockLen;
  outputLen;
  finished = !1;
  destroyed = !1;
  constructor(t, r) {
    if (Mr(t), ke(r, void 0, "key"), this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const o = this.blockLen, s = new Uint8Array(o);
    s.set(r.length > o ? t.create().update(r).digest() : r);
    for (let u = 0; u < s.length; u++)
      s[u] ^= 54;
    this.iHash.update(s), this.oHash = t.create();
    for (let u = 0; u < s.length; u++)
      s[u] ^= 106;
    this.oHash.update(s), jn(s);
  }
  update(t) {
    return Tr(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    Tr(this), ke(t, this.outputLen, "output"), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
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
const Vn = (e, t, r) => new Ua(e, t).update(r).digest();
Vn.create = (e, t) => new Ua(e, t);
const Ms = (e, t) => (e + (e >= 0 ? t : -t) / Ma) / t;
function Vl(e, t, r) {
  const [[o, s], [u, f]] = t, p = Ms(f * e, r), h = Ms(-s * e, r);
  let m = e - p * o - h * u, v = -p * s - h * f;
  const w = m < At, N = v < At;
  w && (m = -m), N && (v = -v);
  const T = hi(Math.ceil(Il(r) / 2)) + vn;
  if (m < At || m >= T || v < At || v >= T)
    throw new Error("splitScalar (endomorphism): failed, k=" + e);
  return { k1neg: w, k1: m, k2neg: N, k2: v };
}
function Yo(e) {
  if (!["compact", "recovered", "der"].includes(e))
    throw new Error('Signature format must be "compact", "recovered", or "der"');
  return e;
}
function Ko(e, t) {
  const r = {};
  for (let o of Object.keys(t))
    r[o] = e[o] === void 0 ? t[o] : e[o];
  return Cr(r.lowS, "lowS"), Cr(r.prehash, "prehash"), r.format !== void 0 && Yo(r.format), r;
}
class zl extends Error {
  constructor(t = "") {
    super(t);
  }
}
const qt = {
  // asn.1 DER encoding utils
  Err: zl,
  // Basic building block is TLV (Tag-Length-Value)
  _tlv: {
    encode: (e, t) => {
      const { Err: r } = qt;
      if (e < 0 || e > 256)
        throw new r("tlv.encode: wrong tag");
      if (t.length & 1)
        throw new r("tlv.encode: unpadded data");
      const o = t.length / 2, s = br(o);
      if (s.length / 2 & 128)
        throw new r("tlv.encode: long form length too big");
      const u = o > 127 ? br(s.length / 2 | 128) : "";
      return br(e) + u + s + t;
    },
    // v - value, l - left bytes (unparsed)
    decode(e, t) {
      const { Err: r } = qt;
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
      const { Err: t } = qt;
      if (e < At)
        throw new t("integer: negative integers are not allowed");
      let r = br(e);
      if (Number.parseInt(r[0], 16) & 8 && (r = "00" + r), r.length & 1)
        throw new t("unexpected DER parsing assertion: unpadded hex");
      return r;
    },
    decode(e) {
      const { Err: t } = qt;
      if (e[0] & 128)
        throw new t("invalid signature integer: negative");
      if (e[0] === 0 && !(e[1] & 128))
        throw new t("invalid signature integer: unnecessary leading zero");
      return Hn(e);
    }
  },
  toSig(e) {
    const { Err: t, _int: r, _tlv: o } = qt, s = ke(e, void 0, "signature"), { v: u, l: f } = o.decode(48, s);
    if (f.length)
      throw new t("invalid signature: left bytes after parsing");
    const { v: p, l: h } = o.decode(2, u), { v: m, l: v } = o.decode(2, h);
    if (v.length)
      throw new t("invalid signature: left bytes after parsing");
    return { r: r.decode(p), s: r.decode(m) };
  },
  hexFromSig(e) {
    const { _tlv: t, _int: r } = qt, o = t.encode(2, r.encode(e.r)), s = t.encode(2, r.encode(e.s)), u = o + s;
    return t.encode(48, u);
  }
}, At = BigInt(0), vn = BigInt(1), Ma = BigInt(2), Er = BigInt(3), Zl = BigInt(4);
function Gl(e, t = {}) {
  const r = Hl("weierstrass", e, t), { Fp: o, Fn: s } = r;
  let u = r.CURVE;
  const { h: f, n: p } = u;
  pi(t, {}, {
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
  const m = Fa(o, s);
  function v() {
    if (!o.isOdd)
      throw new Error("compression is not supported: Field does not have .isOdd()");
  }
  function w(se, U, j) {
    const { x: D, y: Z } = U.toAffine(), ee = o.toBytes(D);
    if (Cr(j, "isCompressed"), j) {
      v();
      const J = !o.isOdd(Z);
      return Je(ja(J), ee);
    } else
      return Je(Uint8Array.of(4), ee, o.toBytes(Z));
  }
  function N(se) {
    ke(se, void 0, "Point");
    const { publicKey: U, publicKeyUncompressed: j } = m, D = se.length, Z = se[0], ee = se.subarray(1);
    if (D === U && (Z === 2 || Z === 3)) {
      const J = o.fromBytes(ee);
      if (!o.isValid(J))
        throw new Error("bad point: is not on curve, wrong x");
      const Q = q(J);
      let G;
      try {
        G = o.sqrt(Q);
      } catch (Ie) {
        const Ee = Ie instanceof Error ? ": " + Ie.message : "";
        throw new Error("bad point: is not on curve, sqrt error" + Ee);
      }
      v();
      const oe = o.isOdd(G);
      return (Z & 1) === 1 !== oe && (G = o.neg(G)), { x: J, y: G };
    } else if (D === j && Z === 4) {
      const J = o.BYTES, Q = o.fromBytes(ee.subarray(0, J)), G = o.fromBytes(ee.subarray(J, J * 2));
      if (!L(Q, G))
        throw new Error("bad point: is not on curve");
      return { x: Q, y: G };
    } else
      throw new Error(`bad point: got length ${D}, expected compressed=${U} or uncompressed=${j}`);
  }
  const T = t.toBytes || w, P = t.fromBytes || N;
  function q(se) {
    const U = o.sqr(se), j = o.mul(U, se);
    return o.add(o.add(j, o.mul(se, u.a)), u.b);
  }
  function L(se, U) {
    const j = o.sqr(U), D = q(se);
    return o.eql(j, D);
  }
  if (!L(u.Gx, u.Gy))
    throw new Error("bad curve params: generator point");
  const H = o.mul(o.pow(u.a, Er), Zl), Y = o.mul(o.sqr(u.b), BigInt(27));
  if (o.is0(o.add(H, Y)))
    throw new Error("bad curve params: a or b");
  function he(se, U, j = !1) {
    if (!o.isValid(U) || j && o.is0(U))
      throw new Error(`bad point coordinate ${se}`);
    return U;
  }
  function ve(se) {
    if (!(se instanceof ue))
      throw new Error("Weierstrass Point expected");
  }
  function Me(se) {
    if (!h || !h.basises)
      throw new Error("no endo");
    return Vl(se, h.basises, s.ORDER);
  }
  const de = Ns((se, U) => {
    const { X: j, Y: D, Z } = se;
    if (o.eql(Z, o.ONE))
      return { x: j, y: D };
    const ee = se.is0();
    U == null && (U = ee ? o.ONE : o.inv(Z));
    const J = o.mul(j, U), Q = o.mul(D, U), G = o.mul(Z, U);
    if (ee)
      return { x: o.ZERO, y: o.ZERO };
    if (!o.eql(G, o.ONE))
      throw new Error("invZ was invalid");
    return { x: J, y: Q };
  }), me = Ns((se) => {
    if (se.is0()) {
      if (t.allowInfinityPoint && !o.is0(se.Y))
        return;
      throw new Error("bad point: ZERO");
    }
    const { x: U, y: j } = se.toAffine();
    if (!o.isValid(U) || !o.isValid(j))
      throw new Error("bad point: x or y not field elements");
    if (!L(U, j))
      throw new Error("bad point: equation left != right");
    if (!se.isTorsionFree())
      throw new Error("bad point: not in prime-order subgroup");
    return !0;
  });
  function Re(se, U, j, D, Z) {
    return j = new ue(o.mul(j.X, se), j.Y, j.Z), U = Lr(D, U), j = Lr(Z, j), U.add(j);
  }
  class ue {
    // base / generator point
    static BASE = new ue(u.Gx, u.Gy, o.ONE);
    // zero / infinity / identity point
    static ZERO = new ue(o.ZERO, o.ONE, o.ZERO);
    // 0, 1, 0
    // math field
    static Fp = o;
    // scalar field
    static Fn = s;
    X;
    Y;
    Z;
    /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
    constructor(U, j, D) {
      this.X = he("x", U), this.Y = he("y", j, !0), this.Z = he("z", D), Object.freeze(this);
    }
    static CURVE() {
      return u;
    }
    /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
    static fromAffine(U) {
      const { x: j, y: D } = U || {};
      if (!U || !o.isValid(j) || !o.isValid(D))
        throw new Error("invalid affine point");
      if (U instanceof ue)
        throw new Error("projective point not allowed");
      return o.is0(j) && o.is0(D) ? ue.ZERO : new ue(j, D, o.ONE);
    }
    static fromBytes(U) {
      const j = ue.fromAffine(P(ke(U, void 0, "point")));
      return j.assertValidity(), j;
    }
    static fromHex(U) {
      return ue.fromBytes(Pe(U));
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
    precompute(U = 8, j = !0) {
      return Oe.createCache(this, U), j || this.multiply(Er), this;
    }
    // TODO: return `this`
    /** A point on curve is valid if it conforms to equation. */
    assertValidity() {
      me(this);
    }
    hasEvenY() {
      const { y: U } = this.toAffine();
      if (!o.isOdd)
        throw new Error("Field doesn't support isOdd");
      return !o.isOdd(U);
    }
    /** Compare one point to another. */
    equals(U) {
      ve(U);
      const { X: j, Y: D, Z } = this, { X: ee, Y: J, Z: Q } = U, G = o.eql(o.mul(j, Q), o.mul(ee, Z)), oe = o.eql(o.mul(D, Q), o.mul(J, Z));
      return G && oe;
    }
    /** Flips point to one corresponding to (x, -y) in Affine coordinates. */
    negate() {
      return new ue(this.X, o.neg(this.Y), this.Z);
    }
    // Renes-Costello-Batina exception-free doubling formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 3
    // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
    double() {
      const { a: U, b: j } = u, D = o.mul(j, Er), { X: Z, Y: ee, Z: J } = this;
      let Q = o.ZERO, G = o.ZERO, oe = o.ZERO, ne = o.mul(Z, Z), Ie = o.mul(ee, ee), Ee = o.mul(J, J), ye = o.mul(Z, ee);
      return ye = o.add(ye, ye), oe = o.mul(Z, J), oe = o.add(oe, oe), Q = o.mul(U, oe), G = o.mul(D, Ee), G = o.add(Q, G), Q = o.sub(Ie, G), G = o.add(Ie, G), G = o.mul(Q, G), Q = o.mul(ye, Q), oe = o.mul(D, oe), Ee = o.mul(U, Ee), ye = o.sub(ne, Ee), ye = o.mul(U, ye), ye = o.add(ye, oe), oe = o.add(ne, ne), ne = o.add(oe, ne), ne = o.add(ne, Ee), ne = o.mul(ne, ye), G = o.add(G, ne), Ee = o.mul(ee, J), Ee = o.add(Ee, Ee), ne = o.mul(Ee, ye), Q = o.sub(Q, ne), oe = o.mul(Ee, Ie), oe = o.add(oe, oe), oe = o.add(oe, oe), new ue(Q, G, oe);
    }
    // Renes-Costello-Batina exception-free addition formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 1
    // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
    add(U) {
      ve(U);
      const { X: j, Y: D, Z } = this, { X: ee, Y: J, Z: Q } = U;
      let G = o.ZERO, oe = o.ZERO, ne = o.ZERO;
      const Ie = u.a, Ee = o.mul(u.b, Er);
      let ye = o.mul(j, ee), xe = o.mul(D, J), Te = o.mul(Z, Q), We = o.add(j, D), Ce = o.add(ee, J);
      We = o.mul(We, Ce), Ce = o.add(ye, xe), We = o.sub(We, Ce), Ce = o.add(j, Z);
      let X = o.add(ee, Q);
      return Ce = o.mul(Ce, X), X = o.add(ye, Te), Ce = o.sub(Ce, X), X = o.add(D, Z), G = o.add(J, Q), X = o.mul(X, G), G = o.add(xe, Te), X = o.sub(X, G), ne = o.mul(Ie, Ce), G = o.mul(Ee, Te), ne = o.add(G, ne), G = o.sub(xe, ne), ne = o.add(xe, ne), oe = o.mul(G, ne), xe = o.add(ye, ye), xe = o.add(xe, ye), Te = o.mul(Ie, Te), Ce = o.mul(Ee, Ce), xe = o.add(xe, Te), Te = o.sub(ye, Te), Te = o.mul(Ie, Te), Ce = o.add(Ce, Te), ye = o.mul(xe, Ce), oe = o.add(oe, ye), ye = o.mul(X, Ce), G = o.mul(We, G), G = o.sub(G, ye), ye = o.mul(We, xe), ne = o.mul(X, ne), ne = o.add(ne, ye), new ue(G, oe, ne);
    }
    subtract(U) {
      return this.add(U.negate());
    }
    is0() {
      return this.equals(ue.ZERO);
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
    multiply(U) {
      const { endo: j } = t;
      if (!s.isValidNot0(U))
        throw new Error("invalid scalar: out of range");
      let D, Z;
      const ee = (J) => Oe.cached(this, J, (Q) => qs(ue, Q));
      if (j) {
        const { k1neg: J, k1: Q, k2neg: G, k2: oe } = Me(U), { p: ne, f: Ie } = ee(Q), { p: Ee, f: ye } = ee(oe);
        Z = Ie.add(ye), D = Re(j.beta, ne, Ee, J, G);
      } else {
        const { p: J, f: Q } = ee(U);
        D = J, Z = Q;
      }
      return qs(ue, [D, Z])[0];
    }
    /**
     * Non-constant-time multiplication. Uses double-and-add algorithm.
     * It's faster, but should only be used when you don't care about
     * an exposed secret key e.g. sig verification, which works over *public* keys.
     */
    multiplyUnsafe(U) {
      const { endo: j } = t, D = this;
      if (!s.isValid(U))
        throw new Error("invalid scalar: out of range");
      if (U === At || D.is0())
        return ue.ZERO;
      if (U === vn)
        return D;
      if (Oe.hasCache(this))
        return this.multiply(U);
      if (j) {
        const { k1neg: Z, k1: ee, k2neg: J, k2: Q } = Me(U), { p1: G, p2: oe } = Fl(ue, D, ee, Q);
        return Re(j.beta, G, oe, Z, J);
      } else
        return Oe.unsafe(D, U);
    }
    /**
     * Converts Projective point to affine (x, y) coordinates.
     * @param invertedZ Z^-1 (inverted zero) - optional, precomputation is useful for invertBatch
     */
    toAffine(U) {
      return de(this, U);
    }
    /**
     * Checks whether Point is free of torsion elements (is in prime subgroup).
     * Always torsion-free for cofactor=1 curves.
     */
    isTorsionFree() {
      const { isTorsionFree: U } = t;
      return f === vn ? !0 : U ? U(ue, this) : Oe.unsafe(this, p).is0();
    }
    clearCofactor() {
      const { clearCofactor: U } = t;
      return f === vn ? this : U ? U(ue, this) : this.multiplyUnsafe(f);
    }
    isSmallOrder() {
      return this.multiplyUnsafe(f).is0();
    }
    toBytes(U = !0) {
      return Cr(U, "isCompressed"), this.assertValidity(), T(ue, this, U);
    }
    toHex(U = !0) {
      return Ne(this.toBytes(U));
    }
    toString() {
      return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
    }
  }
  const De = s.BITS, Oe = new jl(ue, t.endo ? Math.ceil(De / 2) : De);
  return ue.BASE.precompute(8), ue;
}
function ja(e) {
  return Uint8Array.of(e ? 2 : 3);
}
function Fa(e, t) {
  return {
    secretKey: t.BYTES,
    publicKey: 1 + e.BYTES,
    publicKeyUncompressed: 1 + 2 * e.BYTES,
    publicKeyHasPrefix: !0,
    signature: 2 * t.BYTES
  };
}
function Wl(e, t = {}) {
  const { Fn: r } = e, o = t.randomBytes || An, s = Object.assign(Fa(e.Fp, r), { seed: Pa(r.ORDER) });
  function u(T) {
    try {
      const P = r.fromBytes(T);
      return r.isValidNot0(P);
    } catch {
      return !1;
    }
  }
  function f(T, P) {
    const { publicKey: q, publicKeyUncompressed: L } = s;
    try {
      const H = T.length;
      return P === !0 && H !== q || P === !1 && H !== L ? !1 : !!e.fromBytes(T);
    } catch {
      return !1;
    }
  }
  function p(T = o(s.seed)) {
    return Da(ke(T, s.seed, "seed"), r.ORDER);
  }
  function h(T, P = !0) {
    return e.BASE.multiply(r.fromBytes(T)).toBytes(P);
  }
  function m(T) {
    const { secretKey: P, publicKey: q, publicKeyUncompressed: L } = s;
    if (!li(T) || "_lengths" in r && r._lengths || P === q)
      return;
    const H = ke(T, void 0, "key").length;
    return H === q || H === L;
  }
  function v(T, P, q = !0) {
    if (m(T) === !0)
      throw new Error("first arg must be private key");
    if (m(P) === !1)
      throw new Error("second arg must be public key");
    const L = r.fromBytes(T);
    return e.fromBytes(P).multiply(L).toBytes(q);
  }
  const w = {
    isValidSecretKey: u,
    isValidPublicKey: f,
    randomSecretKey: p
  }, N = Ka(p, h);
  return Object.freeze({ getPublicKey: h, getSharedSecret: v, keygen: N, Point: e, utils: w, lengths: s });
}
function Yl(e, t, r = {}) {
  Mr(t), pi(r, {}, {
    hmac: "function",
    lowS: "boolean",
    randomBytes: "function",
    bits2int: "function",
    bits2int_modN: "function"
  }), r = Object.assign({}, r);
  const o = r.randomBytes || An, s = r.hmac || ((j, D) => Vn(t, j, D)), { Fp: u, Fn: f } = e, { ORDER: p, BITS: h } = f, { keygen: m, getPublicKey: v, getSharedSecret: w, utils: N, lengths: T } = Wl(e, r), P = {
    prehash: !0,
    lowS: typeof r.lowS == "boolean" ? r.lowS : !0,
    format: "compact",
    extraEntropy: !1
  }, q = p * Ma < u.ORDER;
  function L(j) {
    const D = p >> vn;
    return j > D;
  }
  function H(j, D) {
    if (!f.isValidNot0(D))
      throw new Error(`invalid signature ${j}: out of range 1..Point.Fn.ORDER`);
    return D;
  }
  function Y() {
    if (q)
      throw new Error('"recovered" sig type is not supported for cofactor >2 curves');
  }
  function he(j, D) {
    Yo(D);
    const Z = T.signature, ee = D === "compact" ? Z : D === "recovered" ? Z + 1 : void 0;
    return ke(j, ee);
  }
  class ve {
    r;
    s;
    recovery;
    constructor(D, Z, ee) {
      if (this.r = H("r", D), this.s = H("s", Z), ee != null) {
        if (Y(), ![0, 1, 2, 3].includes(ee))
          throw new Error("invalid recovery id");
        this.recovery = ee;
      }
      Object.freeze(this);
    }
    static fromBytes(D, Z = P.format) {
      he(D, Z);
      let ee;
      if (Z === "der") {
        const { r: oe, s: ne } = qt.toSig(ke(D));
        return new ve(oe, ne);
      }
      Z === "recovered" && (ee = D[0], Z = "compact", D = D.subarray(1));
      const J = T.signature / 2, Q = D.subarray(0, J), G = D.subarray(J, J * 2);
      return new ve(f.fromBytes(Q), f.fromBytes(G), ee);
    }
    static fromHex(D, Z) {
      return this.fromBytes(Pe(D), Z);
    }
    assertRecovery() {
      const { recovery: D } = this;
      if (D == null)
        throw new Error("invalid recovery id: must be present");
      return D;
    }
    addRecoveryBit(D) {
      return new ve(this.r, this.s, D);
    }
    recoverPublicKey(D) {
      const { r: Z, s: ee } = this, J = this.assertRecovery(), Q = J === 2 || J === 3 ? Z + p : Z;
      if (!u.isValid(Q))
        throw new Error("invalid recovery id: sig.r+curve.n != R.x");
      const G = u.toBytes(Q), oe = e.fromBytes(Je(ja((J & 1) === 0), G)), ne = f.inv(Q), Ie = de(ke(D, void 0, "msgHash")), Ee = f.create(-Ie * ne), ye = f.create(ee * ne), xe = e.BASE.multiplyUnsafe(Ee).add(oe.multiplyUnsafe(ye));
      if (xe.is0())
        throw new Error("invalid recovery: point at infinify");
      return xe.assertValidity(), xe;
    }
    // Signatures should be low-s, to prevent malleability.
    hasHighS() {
      return L(this.s);
    }
    toBytes(D = P.format) {
      if (Yo(D), D === "der")
        return Pe(qt.hexFromSig(this));
      const { r: Z, s: ee } = this, J = f.toBytes(Z), Q = f.toBytes(ee);
      return D === "recovered" ? (Y(), Je(Uint8Array.of(this.assertRecovery()), J, Q)) : Je(J, Q);
    }
    toHex(D) {
      return Ne(this.toBytes(D));
    }
  }
  const Me = r.bits2int || function(D) {
    if (D.length > 8192)
      throw new Error("input is too large");
    const Z = Hn(D), ee = D.length * 8 - h;
    return ee > 0 ? Z >> BigInt(ee) : Z;
  }, de = r.bits2int_modN || function(D) {
    return f.create(Me(D));
  }, me = hi(h);
  function Re(j) {
    return Ol("num < 2^" + h, j, At, me), f.toBytes(j);
  }
  function ue(j, D) {
    return ke(j, void 0, "message"), D ? ke(t(j), void 0, "prehashed message") : j;
  }
  function De(j, D, Z) {
    const { lowS: ee, prehash: J, extraEntropy: Q } = Ko(Z, P);
    j = ue(j, J);
    const G = de(j), oe = f.fromBytes(D);
    if (!f.isValidNot0(oe))
      throw new Error("invalid private key");
    const ne = [Re(oe), Re(G)];
    if (Q != null && Q !== !1) {
      const xe = Q === !0 ? o(T.secretKey) : Q;
      ne.push(ke(xe, void 0, "extraEntropy"));
    }
    const Ie = Je(...ne), Ee = G;
    function ye(xe) {
      const Te = Me(xe);
      if (!f.isValidNot0(Te))
        return;
      const We = f.inv(Te), Ce = e.BASE.multiply(Te).toAffine(), X = f.create(Ce.x);
      if (X === At)
        return;
      const Ft = f.create(We * f.create(Ee + X * oe));
      if (Ft === At)
        return;
      let _e = (Ce.x === X ? 0 : 2) | Number(Ce.y & vn), St = Ft;
      return ee && L(Ft) && (St = f.neg(Ft), _e ^= 1), new ve(X, St, q ? void 0 : _e);
    }
    return { seed: Ie, k2sig: ye };
  }
  function Oe(j, D, Z = {}) {
    const { seed: ee, k2sig: J } = De(j, D, Z);
    return Tl(t.outputLen, f.BYTES, s)(ee, J).toBytes(Z.format);
  }
  function se(j, D, Z, ee = {}) {
    const { lowS: J, prehash: Q, format: G } = Ko(ee, P);
    if (Z = ke(Z, void 0, "publicKey"), D = ue(D, Q), !li(j)) {
      const oe = j instanceof ve ? ", use sig.toBytes()" : "";
      throw new Error("verify expects Uint8Array signature" + oe);
    }
    he(j, G);
    try {
      const oe = ve.fromBytes(j, G), ne = e.fromBytes(Z);
      if (J && oe.hasHighS())
        return !1;
      const { r: Ie, s: Ee } = oe, ye = de(D), xe = f.inv(Ee), Te = f.create(ye * xe), We = f.create(Ie * xe), Ce = e.BASE.multiplyUnsafe(Te).add(ne.multiplyUnsafe(We));
      return Ce.is0() ? !1 : f.create(Ce.x) === Ie;
    } catch {
      return !1;
    }
  }
  function U(j, D, Z = {}) {
    const { prehash: ee } = Ko(Z, P);
    return D = ue(D, ee), ve.fromBytes(j, "recovered").recoverPublicKey(D).toBytes();
  }
  return Object.freeze({
    keygen: m,
    getPublicKey: v,
    getSharedSecret: w,
    utils: N,
    lengths: T,
    Point: e,
    sign: Oe,
    verify: se,
    recoverPublicKey: U,
    Signature: ve,
    hash: t
  });
}
const Fr = {
  p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: BigInt(1),
  a: BigInt(0),
  b: BigInt(7),
  Gx: BigInt("0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"),
  Gy: BigInt("0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8")
}, Xl = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  basises: [
    [BigInt("0x3086d221a7d46bcde86c90e49284eb15"), -BigInt("0xe4437ed6010e88286f547fa90abfe4c3")],
    [BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), BigInt("0x3086d221a7d46bcde86c90e49284eb15")]
  ]
}, Jl = /* @__PURE__ */ BigInt(0), Xo = /* @__PURE__ */ BigInt(2);
function Ql(e) {
  const t = Fr.p, r = BigInt(3), o = BigInt(6), s = BigInt(11), u = BigInt(22), f = BigInt(23), p = BigInt(44), h = BigInt(88), m = e * e * e % t, v = m * m * e % t, w = ot(v, r, t) * v % t, N = ot(w, r, t) * v % t, T = ot(N, Xo, t) * m % t, P = ot(T, s, t) * T % t, q = ot(P, u, t) * P % t, L = ot(q, p, t) * q % t, H = ot(L, h, t) * L % t, Y = ot(H, p, t) * q % t, he = ot(Y, r, t) * v % t, ve = ot(he, f, t) * P % t, Me = ot(ve, o, t) * m % t, de = ot(Me, Xo, t);
  if (!Nr.eql(Nr.sqr(de), e))
    throw new Error("Cannot find square root");
  return de;
}
const Nr = jr(Fr.p, { sqrt: Ql }), an = /* @__PURE__ */ Gl(Fr, {
  Fp: Nr,
  endo: Xl
}), gi = /* @__PURE__ */ Yl(an, pt), js = {};
function Pr(e, ...t) {
  let r = js[e];
  if (r === void 0) {
    const o = pt(Bl(e));
    r = Je(o, o), js[e] = r;
  }
  return pt(Je(r, ...t));
}
const mi = (e) => e.toBytes(!0).slice(1), vi = (e) => e % Xo === Jl;
function Jo(e) {
  const { Fn: t, BASE: r } = an, o = t.fromBytes(e), s = r.multiply(o);
  return { scalar: vi(s.y) ? o : t.neg(o), bytes: mi(s) };
}
function Ha(e) {
  const t = Nr;
  if (!t.isValidNot0(e))
    throw new Error("invalid x: Fail if x ≥ p");
  const r = t.create(e * e), o = t.create(r * e + BigInt(7));
  let s = t.sqrt(o);
  vi(s) || (s = t.neg(s));
  const u = an.fromAffine({ x: e, y: s });
  return u.assertValidity(), u;
}
const Mn = Hn;
function Va(...e) {
  return an.Fn.create(Mn(Pr("BIP0340/challenge", ...e)));
}
function Fs(e) {
  return Jo(e).bytes;
}
function ef(e, t, r = An(32)) {
  const { Fn: o } = an, s = ke(e, void 0, "message"), { bytes: u, scalar: f } = Jo(t), p = ke(r, 32, "auxRand"), h = o.toBytes(f ^ Mn(Pr("BIP0340/aux", p))), m = Pr("BIP0340/nonce", h, u, s), { bytes: v, scalar: w } = Jo(m), N = Va(v, u, s), T = new Uint8Array(64);
  if (T.set(v, 0), T.set(o.toBytes(o.create(w + N * f)), 32), !za(T, s, u))
    throw new Error("sign: Invalid signature produced");
  return T;
}
function za(e, t, r) {
  const { Fp: o, Fn: s, BASE: u } = an, f = ke(e, 64, "signature"), p = ke(t, void 0, "message"), h = ke(r, 32, "publicKey");
  try {
    const m = Ha(Mn(h)), v = Mn(f.subarray(0, 32));
    if (!o.isValidNot0(v))
      return !1;
    const w = Mn(f.subarray(32, 64));
    if (!s.isValidNot0(w))
      return !1;
    const N = Va(s.toBytes(v), mi(m), p), T = u.multiplyUnsafe(w).add(m.multiplyUnsafe(s.neg(N))), { x: P, y: q } = T.toAffine();
    return !(T.is0() || !vi(q) || P !== v);
  } catch {
    return !1;
  }
}
const Kn = /* @__PURE__ */ (() => {
  const r = (o = An(48)) => Da(o, Fr.n);
  return {
    keygen: Ka(r, Fs),
    getPublicKey: Fs,
    sign: ef,
    verify: za,
    Point: an,
    utils: {
      randomSecretKey: r,
      taggedHash: Pr,
      lift_x: Ha,
      pointToBytes: mi
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
function wi(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function tf(e) {
  if (!wi(e))
    throw new Error("Uint8Array expected");
}
function Za(e, t) {
  return Array.isArray(t) ? t.length === 0 ? !0 : e ? t.every((r) => typeof r == "string") : t.every((r) => Number.isSafeInteger(r)) : !1;
}
function nf(e) {
  if (typeof e != "function")
    throw new Error("function expected");
  return !0;
}
function sn(e, t) {
  if (typeof t != "string")
    throw new Error(`${e}: string expected`);
  return !0;
}
function bi(e) {
  if (!Number.isSafeInteger(e))
    throw new Error(`invalid integer: ${e}`);
}
function Qo(e) {
  if (!Array.isArray(e))
    throw new Error("array expected");
}
function Dr(e, t) {
  if (!Za(!0, t))
    throw new Error(`${e}: array of strings expected`);
}
function Ga(e, t) {
  if (!Za(!1, t))
    throw new Error(`${e}: array of numbers expected`);
}
// @__NO_SIDE_EFFECTS__
function Wa(...e) {
  const t = (u) => u, r = (u, f) => (p) => u(f(p)), o = e.map((u) => u.encode).reduceRight(r, t), s = e.map((u) => u.decode).reduce(r, t);
  return { encode: o, decode: s };
}
// @__NO_SIDE_EFFECTS__
function Ya(e) {
  const t = typeof e == "string" ? e.split("") : e, r = t.length;
  Dr("alphabet", t);
  const o = new Map(t.map((s, u) => [s, u]));
  return {
    encode: (s) => (Qo(s), s.map((u) => {
      if (!Number.isSafeInteger(u) || u < 0 || u >= r)
        throw new Error(`alphabet.encode: digit index outside alphabet "${u}". Allowed: ${e}`);
      return t[u];
    })),
    decode: (s) => (Qo(s), s.map((u) => {
      sn("alphabet.decode", u);
      const f = o.get(u);
      if (f === void 0)
        throw new Error(`Unknown letter: "${u}". Allowed: ${e}`);
      return f;
    }))
  };
}
// @__NO_SIDE_EFFECTS__
function Xa(e = "") {
  return sn("join", e), {
    encode: (t) => (Dr("join.decode", t), t.join(e)),
    decode: (t) => (sn("join.decode", t), t.split(e))
  };
}
// @__NO_SIDE_EFFECTS__
function rf(e, t = "=") {
  return bi(e), sn("padding", t), {
    encode(r) {
      for (Dr("padding.encode", r); r.length * e % 8; )
        r.push(t);
      return r;
    },
    decode(r) {
      Dr("padding.decode", r);
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
const Ja = (e, t) => t === 0 ? e : Ja(t, e % t), qr = /* @__NO_SIDE_EFFECTS__ */ (e, t) => e + (t - Ja(e, t)), kr = /* @__PURE__ */ (() => {
  let e = [];
  for (let t = 0; t < 40; t++)
    e.push(2 ** t);
  return e;
})();
function ei(e, t, r, o) {
  if (Qo(e), t <= 0 || t > 32)
    throw new Error(`convertRadix2: wrong from=${t}`);
  if (r <= 0 || r > 32)
    throw new Error(`convertRadix2: wrong to=${r}`);
  if (/* @__PURE__ */ qr(t, r) > 32)
    throw new Error(`convertRadix2: carry overflow from=${t} to=${r} carryBits=${/* @__PURE__ */ qr(t, r)}`);
  let s = 0, u = 0;
  const f = kr[t], p = kr[r] - 1, h = [];
  for (const m of e) {
    if (bi(m), m >= f)
      throw new Error(`convertRadix2: invalid data word=${m} from=${t}`);
    if (s = s << t | m, u + t > 32)
      throw new Error(`convertRadix2: carry overflow pos=${u} from=${t}`);
    for (u += t; u >= r; u -= r)
      h.push((s >> u - r & p) >>> 0);
    const v = kr[u];
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
function Qa(e, t = !1) {
  if (bi(e), e <= 0 || e > 32)
    throw new Error("radix2: bits should be in (0..32]");
  if (/* @__PURE__ */ qr(8, e) > 32 || /* @__PURE__ */ qr(e, 8) > 32)
    throw new Error("radix2: carry overflow");
  return {
    encode: (r) => {
      if (!wi(r))
        throw new Error("radix2.encode input should be Uint8Array");
      return ei(Array.from(r), 8, e, !t);
    },
    decode: (r) => (Ga("radix2.decode", r), Uint8Array.from(ei(r, e, 8, t)))
  };
}
function Hs(e) {
  return nf(e), function(...t) {
    try {
      return e.apply(null, t);
    } catch {
    }
  };
}
const of = typeof Uint8Array.from([]).toBase64 == "function" && typeof Uint8Array.fromBase64 == "function", sf = (e, t) => {
  sn("base64", e);
  const r = /^[A-Za-z0-9=+/]+$/, o = "base64";
  if (e.length > 0 && !r.test(e))
    throw new Error("invalid base64");
  return Uint8Array.fromBase64(e, { alphabet: o, lastChunkHandling: "strict" });
}, jt = of ? {
  encode(e) {
    return tf(e), e.toBase64();
  },
  decode(e) {
    return sf(e);
  }
} : /* @__PURE__ */ Wa(/* @__PURE__ */ Qa(6), /* @__PURE__ */ Ya("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), /* @__PURE__ */ rf(6), /* @__PURE__ */ Xa("")), ti = /* @__PURE__ */ Wa(/* @__PURE__ */ Ya("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), /* @__PURE__ */ Xa("")), Vs = [996825010, 642813549, 513874426, 1027748829, 705979059];
function Un(e) {
  const t = e >> 25;
  let r = (e & 33554431) << 5;
  for (let o = 0; o < Vs.length; o++)
    (t >> o & 1) === 1 && (r ^= Vs[o]);
  return r;
}
function zs(e, t, r = 1) {
  const o = e.length;
  let s = 1;
  for (let u = 0; u < o; u++) {
    const f = e.charCodeAt(u);
    if (f < 33 || f > 126)
      throw new Error(`Invalid prefix (${e})`);
    s = Un(s) ^ f >> 5;
  }
  s = Un(s);
  for (let u = 0; u < o; u++)
    s = Un(s) ^ e.charCodeAt(u) & 31;
  for (let u of t)
    s = Un(s) ^ u;
  for (let u = 0; u < 6; u++)
    s = Un(s);
  return s ^= r, ti.encode(ei([s % kr[30]], 30, 5, !1));
}
// @__NO_SIDE_EFFECTS__
function af(e) {
  const t = e === "bech32" ? 1 : 734539939, r = /* @__PURE__ */ Qa(5), o = r.decode, s = r.encode, u = Hs(o);
  function f(w, N, T = 90) {
    sn("bech32.encode prefix", w), wi(N) && (N = Array.from(N)), Ga("bech32.encode", N);
    const P = w.length;
    if (P === 0)
      throw new TypeError(`Invalid prefix length ${P}`);
    const q = P + 7 + N.length;
    if (T !== !1 && q > T)
      throw new TypeError(`Length ${q} exceeds limit ${T}`);
    const L = w.toLowerCase(), H = zs(L, N, t);
    return `${L}1${ti.encode(N)}${H}`;
  }
  function p(w, N = 90) {
    sn("bech32.decode input", w);
    const T = w.length;
    if (T < 8 || N !== !1 && T > N)
      throw new TypeError(`invalid string length: ${T} (${w}). Expected (8..${N})`);
    const P = w.toLowerCase();
    if (w !== P && w !== w.toUpperCase())
      throw new Error("String must be lowercase or uppercase");
    const q = P.lastIndexOf("1");
    if (q === 0 || q === -1)
      throw new Error('Letter "1" must be present between prefix and data only');
    const L = P.slice(0, q), H = P.slice(q + 1);
    if (H.length < 6)
      throw new Error("Data must be at least 6 characters long");
    const Y = ti.decode(H).slice(0, -6), he = zs(L, Y, t);
    if (!H.endsWith(he))
      throw new Error(`Invalid checksum in ${w}: expected "${he}"`);
    return { prefix: L, words: Y };
  }
  const h = Hs(p);
  function m(w) {
    const { prefix: N, words: T } = p(w, !1);
    return { prefix: N, words: T, bytes: o(T) };
  }
  function v(w, N) {
    return f(w, s(N));
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
const _n = /* @__PURE__ */ af("bech32");
function cf(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function Zs(e) {
  if (typeof e != "boolean")
    throw new Error(`boolean expected, not ${e}`);
}
function Uo(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error("positive integer expected, got " + e);
}
function Ye(e, t, r = "") {
  const o = cf(e), s = e?.length, u = t !== void 0;
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
const uf = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function lf(e, t) {
  return e.buffer === t.buffer && // best we can do, may fail with an obscure Proxy
  e.byteOffset < t.byteOffset + t.byteLength && // a starts before b end
  t.byteOffset < e.byteOffset + e.byteLength;
}
function ec(e, t) {
  if (lf(e, t) && e.byteOffset < t.byteOffset)
    throw new Error("complex overlap of input and output is not supported");
}
function ff(e, t) {
  if (t == null || typeof t != "object")
    throw new Error("options must be defined");
  return Object.assign(e, t);
}
function df(e, t) {
  if (e.length !== t.length)
    return !1;
  let r = 0;
  for (let o = 0; o < e.length; o++)
    r |= e[o] ^ t[o];
  return r === 0;
}
const hf = /* @__NO_SIDE_EFFECTS__ */ (e, t) => {
  function r(o, ...s) {
    if (Ye(o, void 0, "key"), !uf)
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
function tc(e, t, r = !0) {
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
const Ut = 16, pf = 283;
function yf(e) {
  if (![16, 24, 32].includes(e.length))
    throw new Error('"aes key" expected Uint8Array of length 16/24/32, got length=' + e.length);
}
function Ei(e) {
  return e << 1 ^ pf & -(e >> 7);
}
function mn(e, t) {
  let r = 0;
  for (; t > 0; t >>= 1)
    r ^= e & -(t & 1), e = Ei(e);
  return r;
}
const ni = /* @__PURE__ */ (() => {
  const e = new Uint8Array(256);
  for (let r = 0, o = 1; r < 256; r++, o ^= Ei(o))
    e[r] = o;
  const t = new Uint8Array(256);
  t[0] = 99;
  for (let r = 0; r < 255; r++) {
    let o = e[255 - r];
    o |= o << 8, t[e[r]] = (o ^ o >> 4 ^ o >> 5 ^ o >> 6 ^ o >> 7 ^ 99) & 255;
  }
  return xn(e), t;
})(), gf = /* @__PURE__ */ ni.map((e, t) => ni.indexOf(t)), mf = (e) => e << 24 | e >>> 8, Mo = (e) => e << 8 | e >>> 24;
function nc(e, t) {
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
const _i = /* @__PURE__ */ nc(ni, (e) => mn(e, 3) << 24 | e << 16 | e << 8 | mn(e, 2)), rc = /* @__PURE__ */ nc(gf, (e) => mn(e, 11) << 24 | mn(e, 13) << 16 | mn(e, 9) << 8 | mn(e, 14)), vf = /* @__PURE__ */ (() => {
  const e = new Uint8Array(16);
  for (let t = 0, r = 1; t < 16; t++, r = Ei(r))
    e[t] = r;
  return e;
})();
function oc(e) {
  Ye(e);
  const t = e.length;
  yf(e);
  const { sbox2: r } = _i, o = [];
  wn(e) || o.push(e = on(e));
  const s = ze(e), u = s.length, f = (h) => ht(r, h, h, h, h), p = new Uint32Array(t + 28);
  p.set(s);
  for (let h = u; h < p.length; h++) {
    let m = p[h - 1];
    h % u === 0 ? m = f(mf(m)) ^ vf[h / u - 1] : u > 6 && h % u === 4 && (m = f(m)), p[h] = p[h - u] ^ m;
  }
  return xn(...o), p;
}
function wf(e) {
  const t = oc(e), r = t.slice(), o = t.length, { sbox2: s } = _i, { T0: u, T1: f, T2: p, T3: h } = rc;
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
function Gs(e, t, r, o, s) {
  const { sbox2: u, T01: f, T23: p } = _i;
  let h = 0;
  t ^= e[h++], r ^= e[h++], o ^= e[h++], s ^= e[h++];
  const m = e.length / 4 - 2;
  for (let P = 0; P < m; P++) {
    const q = e[h++] ^ Kt(f, p, t, r, o, s), L = e[h++] ^ Kt(f, p, r, o, s, t), H = e[h++] ^ Kt(f, p, o, s, t, r), Y = e[h++] ^ Kt(f, p, s, t, r, o);
    t = q, r = L, o = H, s = Y;
  }
  const v = e[h++] ^ ht(u, t, r, o, s), w = e[h++] ^ ht(u, r, o, s, t), N = e[h++] ^ ht(u, o, s, t, r), T = e[h++] ^ ht(u, s, t, r, o);
  return { s0: v, s1: w, s2: N, s3: T };
}
function bf(e, t, r, o, s) {
  const { sbox2: u, T01: f, T23: p } = rc;
  let h = 0;
  t ^= e[h++], r ^= e[h++], o ^= e[h++], s ^= e[h++];
  const m = e.length / 4 - 2;
  for (let P = 0; P < m; P++) {
    const q = e[h++] ^ Kt(f, p, t, s, o, r), L = e[h++] ^ Kt(f, p, r, t, s, o), H = e[h++] ^ Kt(f, p, o, r, t, s), Y = e[h++] ^ Kt(f, p, s, o, r, t);
    t = q, r = L, o = H, s = Y;
  }
  const v = e[h++] ^ ht(u, t, s, o, r), w = e[h++] ^ ht(u, r, t, s, o), N = e[h++] ^ ht(u, o, r, t, s), T = e[h++] ^ ht(u, s, o, r, t);
  return { s0: v, s1: w, s2: N, s3: T };
}
function Ef(e) {
  if (Ye(e), e.length % Ut !== 0)
    throw new Error("aes-(cbc/ecb).decrypt ciphertext should consist of blocks with size " + Ut);
}
function _f(e, t, r) {
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
  r = tc(o, r), ec(e, r);
  const f = ze(r);
  return { b: u, o: f, out: r };
}
function xf(e, t) {
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
function Af(e) {
  const t = new Uint8Array(16), r = ze(t);
  t.set(e);
  const o = Ut - e.length;
  for (let s = Ut - o; s < Ut; s++)
    t[s] = o;
  return r;
}
const ic = /* @__PURE__ */ hf({ blockSize: 16, nonceLength: 16 }, function(t, r, o = {}) {
  const s = !o.disablePadding;
  return {
    encrypt(u, f) {
      const p = oc(t), { b: h, o: m, out: v } = _f(u, s, f);
      let w = r;
      const N = [p];
      wn(w) || N.push(w = on(w));
      const T = ze(w);
      let P = T[0], q = T[1], L = T[2], H = T[3], Y = 0;
      for (; Y + 4 <= h.length; )
        P ^= h[Y + 0], q ^= h[Y + 1], L ^= h[Y + 2], H ^= h[Y + 3], { s0: P, s1: q, s2: L, s3: H } = Gs(p, P, q, L, H), m[Y++] = P, m[Y++] = q, m[Y++] = L, m[Y++] = H;
      if (s) {
        const he = Af(u.subarray(Y * 4));
        P ^= he[0], q ^= he[1], L ^= he[2], H ^= he[3], { s0: P, s1: q, s2: L, s3: H } = Gs(p, P, q, L, H), m[Y++] = P, m[Y++] = q, m[Y++] = L, m[Y++] = H;
      }
      return xn(...N), v;
    },
    decrypt(u, f) {
      Ef(u);
      const p = wf(t);
      let h = r;
      const m = [p];
      wn(h) || m.push(h = on(h));
      const v = ze(h);
      f = tc(u.length, f), wn(u) || m.push(u = on(u)), ec(u, f);
      const w = ze(u), N = ze(f);
      let T = v[0], P = v[1], q = v[2], L = v[3];
      for (let H = 0; H + 4 <= w.length; ) {
        const Y = T, he = P, ve = q, Me = L;
        T = w[H + 0], P = w[H + 1], q = w[H + 2], L = w[H + 3];
        const { s0: de, s1: me, s2: Re, s3: ue } = bf(p, T, P, q, L);
        N[H++] = de ^ Y, N[H++] = me ^ he, N[H++] = Re ^ ve, N[H++] = ue ^ Me;
      }
      return xn(...m), xf(f, s);
    }
  };
}), sc = (e) => Uint8Array.from(e.split(""), (t) => t.charCodeAt(0)), kf = sc("expand 16-byte k"), Sf = sc("expand 32-byte k"), Bf = ze(kf), Rf = ze(Sf);
function be(e, t) {
  return e << t | e >>> 32 - t;
}
function ri(e) {
  return e.byteOffset % 4 === 0;
}
const _r = 64, Of = 16, ac = 2 ** 32 - 1, Ws = Uint32Array.of();
function If(e, t, r, o, s, u, f, p) {
  const h = s.length, m = new Uint8Array(_r), v = ze(m), w = ri(s) && ri(u), N = w ? ze(s) : Ws, T = w ? ze(u) : Ws;
  for (let P = 0; P < h; f++) {
    if (e(t, r, o, v, f, p), f >= ac)
      throw new Error("arx: counter overflow");
    const q = Math.min(_r, h - P);
    if (w && q === _r) {
      const L = P / 4;
      if (P % 4 !== 0)
        throw new Error("arx: invalid block position");
      for (let H = 0, Y; H < Of; H++)
        Y = L + H, T[Y] = N[Y] ^ v[H];
      P += _r;
      continue;
    }
    for (let L = 0, H; L < q; L++)
      H = P + L, u[H] = s[H] ^ m[L];
    P += q;
  }
}
function Tf(e, t) {
  const { allowShortKeys: r, extendNonceFn: o, counterLength: s, counterRight: u, rounds: f } = ff({ allowShortKeys: !1, counterLength: 8, counterRight: !1, rounds: 20 }, t);
  if (typeof e != "function")
    throw new Error("core must be a function");
  return Uo(s), Uo(f), Zs(u), Zs(r), (p, h, m, v, w = 0) => {
    Ye(p, void 0, "key"), Ye(h, void 0, "nonce"), Ye(m, void 0, "data");
    const N = m.length;
    if (v === void 0 && (v = new Uint8Array(N)), Ye(v, void 0, "output"), Uo(w), w < 0 || w >= ac)
      throw new Error("arx: counter overflow");
    if (v.length < N)
      throw new Error(`arx: output (${v.length}) is shorter than data (${N})`);
    const T = [];
    let P = p.length, q, L;
    if (P === 32)
      T.push(q = on(p)), L = Rf;
    else if (P === 16 && r)
      q = new Uint8Array(32), q.set(p), q.set(p, 16), L = Bf, T.push(q);
    else
      throw Ye(p, 32, "arx key"), new Error("invalid key size");
    ri(h) || T.push(h = on(h));
    const H = ze(q);
    if (o) {
      if (h.length !== 24)
        throw new Error("arx: extended nonce must be 24 bytes");
      o(L, H, ze(h.subarray(0, 16)), H), h = h.subarray(16);
    }
    const Y = 16 - s;
    if (Y !== h.length)
      throw new Error(`arx: nonce must be ${Y} or 16 bytes`);
    if (Y !== 12) {
      const ve = new Uint8Array(12);
      ve.set(h, u ? 0 : 12 - h.length), h = ve, T.push(h);
    }
    const he = ze(h);
    return If(e, L, H, he, m, v, w, f), xn(...T), v;
  };
}
function Cf(e, t, r, o, s, u = 20) {
  let f = e[0], p = e[1], h = e[2], m = e[3], v = t[0], w = t[1], N = t[2], T = t[3], P = t[4], q = t[5], L = t[6], H = t[7], Y = s, he = r[0], ve = r[1], Me = r[2], de = f, me = p, Re = h, ue = m, De = v, Oe = w, se = N, U = T, j = P, D = q, Z = L, ee = H, J = Y, Q = he, G = ve, oe = Me;
  for (let Ie = 0; Ie < u; Ie += 2)
    de = de + De | 0, J = be(J ^ de, 16), j = j + J | 0, De = be(De ^ j, 12), de = de + De | 0, J = be(J ^ de, 8), j = j + J | 0, De = be(De ^ j, 7), me = me + Oe | 0, Q = be(Q ^ me, 16), D = D + Q | 0, Oe = be(Oe ^ D, 12), me = me + Oe | 0, Q = be(Q ^ me, 8), D = D + Q | 0, Oe = be(Oe ^ D, 7), Re = Re + se | 0, G = be(G ^ Re, 16), Z = Z + G | 0, se = be(se ^ Z, 12), Re = Re + se | 0, G = be(G ^ Re, 8), Z = Z + G | 0, se = be(se ^ Z, 7), ue = ue + U | 0, oe = be(oe ^ ue, 16), ee = ee + oe | 0, U = be(U ^ ee, 12), ue = ue + U | 0, oe = be(oe ^ ue, 8), ee = ee + oe | 0, U = be(U ^ ee, 7), de = de + Oe | 0, oe = be(oe ^ de, 16), Z = Z + oe | 0, Oe = be(Oe ^ Z, 12), de = de + Oe | 0, oe = be(oe ^ de, 8), Z = Z + oe | 0, Oe = be(Oe ^ Z, 7), me = me + se | 0, J = be(J ^ me, 16), ee = ee + J | 0, se = be(se ^ ee, 12), me = me + se | 0, J = be(J ^ me, 8), ee = ee + J | 0, se = be(se ^ ee, 7), Re = Re + U | 0, Q = be(Q ^ Re, 16), j = j + Q | 0, U = be(U ^ j, 12), Re = Re + U | 0, Q = be(Q ^ Re, 8), j = j + Q | 0, U = be(U ^ j, 7), ue = ue + De | 0, G = be(G ^ ue, 16), D = D + G | 0, De = be(De ^ D, 12), ue = ue + De | 0, G = be(G ^ ue, 8), D = D + G | 0, De = be(De ^ D, 7);
  let ne = 0;
  o[ne++] = f + de | 0, o[ne++] = p + me | 0, o[ne++] = h + Re | 0, o[ne++] = m + ue | 0, o[ne++] = v + De | 0, o[ne++] = w + Oe | 0, o[ne++] = N + se | 0, o[ne++] = T + U | 0, o[ne++] = P + j | 0, o[ne++] = q + D | 0, o[ne++] = L + Z | 0, o[ne++] = H + ee | 0, o[ne++] = Y + J | 0, o[ne++] = he + Q | 0, o[ne++] = ve + G | 0, o[ne++] = Me + oe | 0;
}
const cc = /* @__PURE__ */ Tf(Cf, {
  counterRight: !1,
  counterLength: 4,
  allowShortKeys: !1
});
function Lf(e, t, r) {
  return Mr(e), r === void 0 && (r = new Uint8Array(e.outputLen)), Vn(e, r, t);
}
const jo = /* @__PURE__ */ Uint8Array.of(0), Ys = /* @__PURE__ */ Uint8Array.of();
function Nf(e, t, r, o = 32) {
  Mr(e), Mt(o, "length");
  const s = e.outputLen;
  if (o > 255 * s)
    throw new Error("Length must be <= 255*HashLen");
  const u = Math.ceil(o / s);
  r === void 0 ? r = Ys : ke(r, void 0, "info");
  const f = new Uint8Array(u * s), p = Vn.create(e, t), h = p._cloneInto(), m = new Uint8Array(p.outputLen);
  for (let v = 0; v < u; v++)
    jo[0] = v + 1, h.update(v === 0 ? Ys : m).update(r).update(jo).digestInto(m), f.set(m, s * v), p._cloneInto(h);
  return p.destroy(), h.destroy(), jn(m, jo), f.slice(0, o);
}
var Pf = Object.defineProperty, Be = (e, t) => {
  for (var r in t)
    Pf(e, r, { get: t[r], enumerable: !0 });
}, gn = Symbol("verified"), Df = (e) => e instanceof Object;
function zn(e) {
  if (!Df(e) || typeof e.kind != "number" || typeof e.content != "string" || typeof e.created_at != "number" || typeof e.pubkey != "string" || !e.pubkey.match(/^[a-f0-9]{64}$/) || !Array.isArray(e.tags))
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
var qf = {};
Be(qf, {
  binarySearch: () => xi,
  bytesToHex: () => Ne,
  hexToBytes: () => Pe,
  insertEventIntoAscendingList: () => Uf,
  insertEventIntoDescendingList: () => Kf,
  mergeReverseSortedLists: () => Mf,
  normalizeURL: () => $f,
  utf8Decoder: () => kt,
  utf8Encoder: () => it
});
var kt = new TextDecoder("utf-8"), it = new TextEncoder();
function $f(e) {
  try {
    e.indexOf("://") === -1 && (e = "wss://" + e);
    let t = new URL(e);
    return t.protocol === "http:" ? t.protocol = "ws:" : t.protocol === "https:" && (t.protocol = "wss:"), t.pathname = t.pathname.replace(/\/+/g, "/"), t.pathname.endsWith("/") && (t.pathname = t.pathname.slice(0, -1)), (t.port === "80" && t.protocol === "ws:" || t.port === "443" && t.protocol === "wss:") && (t.port = ""), t.searchParams.sort(), t.hash = "", t.toString();
  } catch {
    throw new Error(`Invalid URL: ${e}`);
  }
}
function Kf(e, t) {
  const [r, o] = xi(e, (s) => t.id === s.id ? 0 : t.created_at === s.created_at ? -1 : s.created_at - t.created_at);
  return o || e.splice(r, 0, t), e;
}
function Uf(e, t) {
  const [r, o] = xi(e, (s) => t.id === s.id ? 0 : t.created_at === s.created_at ? -1 : t.created_at - s.created_at);
  return o || e.splice(r, 0, t), e;
}
function xi(e, t) {
  let r = 0, o = e.length - 1;
  for (; r <= o; ) {
    const s = Math.floor((r + o) / 2), u = t(e[s]);
    if (u === 0)
      return [s, !0];
    u < 0 ? o = s - 1 : r = s + 1;
  }
  return [r, !1];
}
function Mf(e, t) {
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
var jf = class {
  generateSecretKey() {
    return Kn.utils.randomSecretKey();
  }
  getPublicKey(e) {
    return Ne(Kn.getPublicKey(e));
  }
  finalizeEvent(e, t) {
    const r = e;
    return r.pubkey = Ne(Kn.getPublicKey(t)), r.id = Sr(r), r.sig = Ne(Kn.sign(Pe(Sr(r)), t)), r[gn] = !0, r;
  }
  verifyEvent(e) {
    if (typeof e[gn] == "boolean")
      return e[gn];
    try {
      const t = Sr(e);
      if (t !== e.id)
        return e[gn] = !1, !1;
      const r = Kn.verify(Pe(e.sig), Pe(t), Pe(e.pubkey));
      return e[gn] = r, r;
    } catch {
      return e[gn] = !1, !1;
    }
  }
};
function Ff(e) {
  if (!zn(e))
    throw new Error("can't serialize event with wrong or missing properties");
  return JSON.stringify([0, e.pubkey, e.created_at, e.kind, e.tags, e.content]);
}
function Sr(e) {
  let t = pt(it.encode(Ff(e)));
  return Ne(t);
}
var Hr = new jf(), Hf = Hr.generateSecretKey, Ai = Hr.getPublicKey, yt = Hr.finalizeEvent, Vr = Hr.verifyEvent, Vf = {};
Be(Vf, {
  Application: () => rh,
  BadgeAward: () => Qf,
  BadgeDefinition: () => Yd,
  BlockedRelaysList: () => Cd,
  BlossomServerList: () => Kd,
  BookmarkList: () => Od,
  Bookmarksets: () => Zd,
  Calendar: () => lh,
  CalendarEventRSVP: () => fh,
  ChannelCreation: () => pc,
  ChannelHideMessage: () => mc,
  ChannelMessage: () => gc,
  ChannelMetadata: () => yc,
  ChannelMuteUser: () => vc,
  ChatMessage: () => ed,
  ClassifiedListing: () => sh,
  ClientAuth: () => bc,
  Comment: () => ud,
  CommunitiesList: () => Id,
  CommunityDefinition: () => yh,
  CommunityPostApproval: () => md,
  Contacts: () => Yf,
  CreateOrUpdateProduct: () => Qd,
  CreateOrUpdateStall: () => Jd,
  Curationsets: () => Gd,
  Date: () => ch,
  DirectMessageRelaysList: () => qd,
  DraftClassifiedListing: () => ah,
  DraftLong: () => th,
  Emojisets: () => nh,
  EncryptedDirectMessage: () => Xf,
  EventDeletion: () => Jf,
  FavoriteRelays: () => Nd,
  FileMessage: () => nd,
  FileMetadata: () => cd,
  FileServerPreference: () => $d,
  Followsets: () => Hd,
  ForumThread: () => td,
  GenericRepost: () => Oi,
  Genericlists: () => Vd,
  GiftWrap: () => wc,
  GroupMetadata: () => gh,
  HTTPAuth: () => Ii,
  Handlerinformation: () => ph,
  Handlerrecommendation: () => hh,
  Highlights: () => Ad,
  InterestsList: () => Pd,
  Interestsets: () => Xd,
  JobFeedback: () => bd,
  JobRequest: () => vd,
  JobResult: () => wd,
  Label: () => gd,
  LightningPubRPC: () => Md,
  LiveChatMessage: () => ld,
  LiveEvent: () => oh,
  LongFormArticle: () => eh,
  Metadata: () => Gf,
  Mutelist: () => Sd,
  NWCWalletInfo: () => Ud,
  NWCWalletRequest: () => Ec,
  NWCWalletResponse: () => jd,
  NormalVideo: () => od,
  NostrConnect: () => Fd,
  OpenTimestamps: () => sd,
  Photo: () => rd,
  Pinlist: () => Bd,
  Poll: () => ad,
  PollResponse: () => kd,
  PrivateDirectMessage: () => hc,
  ProblemTracker: () => hd,
  ProfileBadges: () => Wd,
  PublicChatsList: () => Td,
  Reaction: () => Ri,
  RecommendRelay: () => Wf,
  RelayList: () => Rd,
  RelayReview: () => dh,
  Relaysets: () => zd,
  Report: () => pd,
  Reporting: () => yd,
  Repost: () => Bi,
  Seal: () => dc,
  SearchRelaysList: () => Ld,
  ShortTextNote: () => fc,
  ShortVideo: () => id,
  Time: () => uh,
  UserEmojiList: () => Dd,
  UserStatuses: () => ih,
  Voice: () => fd,
  VoiceComment: () => dd,
  Zap: () => xd,
  ZapGoal: () => Ed,
  ZapRequest: () => _d,
  classifyKind: () => zf,
  isAddressableKind: () => Si,
  isEphemeralKind: () => lc,
  isKind: () => Zf,
  isRegularKind: () => uc,
  isReplaceableKind: () => ki
});
function uc(e) {
  return e < 1e4 && e !== 0 && e !== 3;
}
function ki(e) {
  return e === 0 || e === 3 || 1e4 <= e && e < 2e4;
}
function lc(e) {
  return 2e4 <= e && e < 3e4;
}
function Si(e) {
  return 3e4 <= e && e < 4e4;
}
function zf(e) {
  return uc(e) ? "regular" : ki(e) ? "replaceable" : lc(e) ? "ephemeral" : Si(e) ? "parameterized" : "unknown";
}
function Zf(e, t) {
  const r = t instanceof Array ? t : [t];
  return zn(e) && r.includes(e.kind) || !1;
}
var Gf = 0, fc = 1, Wf = 2, Yf = 3, Xf = 4, Jf = 5, Bi = 6, Ri = 7, Qf = 8, ed = 9, td = 11, dc = 13, hc = 14, nd = 15, Oi = 16, rd = 20, od = 21, id = 22, pc = 40, yc = 41, gc = 42, mc = 43, vc = 44, sd = 1040, wc = 1059, ad = 1068, cd = 1063, ud = 1111, ld = 1311, fd = 1222, dd = 1244, hd = 1971, pd = 1984, yd = 1984, gd = 1985, md = 4550, vd = 5999, wd = 6999, bd = 7e3, Ed = 9041, _d = 9734, xd = 9735, Ad = 9802, kd = 1018, Sd = 1e4, Bd = 10001, Rd = 10002, Od = 10003, Id = 10004, Td = 10005, Cd = 10006, Ld = 10007, Nd = 10012, Pd = 10015, Dd = 10030, qd = 10050, $d = 10096, Kd = 10063, Ud = 13194, Md = 21e3, bc = 22242, Ec = 23194, jd = 23195, Fd = 24133, Ii = 27235, Hd = 3e4, Vd = 30001, zd = 30002, Zd = 30003, Gd = 30004, Wd = 30008, Yd = 30009, Xd = 30015, Jd = 30017, Qd = 30018, eh = 30023, th = 30024, nh = 30030, rh = 30078, oh = 30311, ih = 30315, sh = 30402, ah = 30403, ch = 31922, uh = 31923, lh = 31924, fh = 31925, dh = 31987, hh = 31989, ph = 31990, yh = 34550, gh = 39e3, mh = {};
Be(mh, {
  getHex64: () => Ti,
  getInt: () => _c,
  getSubscriptionId: () => vh,
  matchEventId: () => wh,
  matchEventKind: () => Eh,
  matchEventPubkey: () => bh
});
function Ti(e, t) {
  let r = t.length + 3, o = e.indexOf(`"${t}":`) + r, s = e.slice(o).indexOf('"') + o + 1;
  return e.slice(s, s + 64);
}
function _c(e, t) {
  let r = t.length, o = e.indexOf(`"${t}":`) + r + 3, s = e.slice(o), u = Math.min(s.indexOf(","), s.indexOf("}"));
  return parseInt(s.slice(0, u), 10);
}
function vh(e) {
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
function wh(e, t) {
  return t === Ti(e, "id");
}
function bh(e, t) {
  return t === Ti(e, "pubkey");
}
function Eh(e, t) {
  return t === _c(e, "kind");
}
var _h = {};
Be(_h, {
  makeAuthEvent: () => xh
});
function xh(e, t) {
  return {
    kind: bc,
    created_at: Math.floor(Date.now() / 1e3),
    tags: [
      ["relay", e],
      ["challenge", t]
    ],
    content: ""
  };
}
var Ah;
try {
  Ah = WebSocket;
} catch {
}
var kh;
try {
  kh = WebSocket;
} catch {
}
var Sh = {};
Be(Sh, {
  BECH32_REGEX: () => xc,
  Bech32MaxSize: () => Ci,
  NostrTypeGuard: () => Bh,
  decode: () => zr,
  decodeNostrURI: () => Oh,
  encodeBytes: () => Gr,
  naddrEncode: () => Ph,
  neventEncode: () => Nh,
  noteEncode: () => Ch,
  nprofileEncode: () => Lh,
  npubEncode: () => Th,
  nsecEncode: () => Ih
});
var Bh = {
  isNProfile: (e) => /^nprofile1[a-z\d]+$/.test(e || ""),
  isNEvent: (e) => /^nevent1[a-z\d]+$/.test(e || ""),
  isNAddr: (e) => /^naddr1[a-z\d]+$/.test(e || ""),
  isNSec: (e) => /^nsec1[a-z\d]{58}$/.test(e || ""),
  isNPub: (e) => /^npub1[a-z\d]{58}$/.test(e || ""),
  isNote: (e) => /^note1[a-z\d]+$/.test(e || ""),
  isNcryptsec: (e) => /^ncryptsec1[a-z\d]+$/.test(e || "")
}, Ci = 5e3, xc = /[\x21-\x7E]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/;
function Rh(e) {
  const t = new Uint8Array(4);
  return t[0] = e >> 24 & 255, t[1] = e >> 16 & 255, t[2] = e >> 8 & 255, t[3] = e & 255, t;
}
function Oh(e) {
  try {
    return e.startsWith("nostr:") && (e = e.substring(6)), zr(e);
  } catch {
    return { type: "invalid", data: null };
  }
}
function zr(e) {
  let { prefix: t, words: r } = _n.decode(e, Ci), o = new Uint8Array(_n.fromWords(r));
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
          pubkey: Ne(s[0][0]),
          relays: s[1] ? s[1].map((u) => kt.decode(u)) : []
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
          id: Ne(s[0][0]),
          relays: s[1] ? s[1].map((u) => kt.decode(u)) : [],
          author: s[2]?.[0] ? Ne(s[2][0]) : void 0,
          kind: s[3]?.[0] ? parseInt(Ne(s[3][0]), 16) : void 0
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
          identifier: kt.decode(s[0][0]),
          pubkey: Ne(s[2][0]),
          kind: parseInt(Ne(s[3][0]), 16),
          relays: s[1] ? s[1].map((u) => kt.decode(u)) : []
        }
      };
    }
    case "nsec":
      return { type: t, data: o };
    case "npub":
    case "note":
      return { type: t, data: Ne(o) };
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
function Ih(e) {
  return Gr("nsec", e);
}
function Th(e) {
  return Gr("npub", Pe(e));
}
function Ch(e) {
  return Gr("note", Pe(e));
}
function Zr(e, t) {
  let r = _n.toWords(t);
  return _n.encode(e, r, Ci);
}
function Gr(e, t) {
  return Zr(e, t);
}
function Lh(e) {
  let t = Li({
    0: [Pe(e.pubkey)],
    1: (e.relays || []).map((r) => it.encode(r))
  });
  return Zr("nprofile", t);
}
function Nh(e) {
  let t;
  e.kind !== void 0 && (t = Rh(e.kind));
  let r = Li({
    0: [Pe(e.id)],
    1: (e.relays || []).map((o) => it.encode(o)),
    2: e.author ? [Pe(e.author)] : [],
    3: t ? [new Uint8Array(t)] : []
  });
  return Zr("nevent", r);
}
function Ph(e) {
  let t = new ArrayBuffer(4);
  new DataView(t).setUint32(0, e.kind, !1);
  let r = Li({
    0: [it.encode(e.identifier)],
    1: (e.relays || []).map((o) => it.encode(o)),
    2: [Pe(e.pubkey)],
    3: [new Uint8Array(t)]
  });
  return Zr("naddr", r);
}
function Li(e) {
  let t = [];
  return Object.entries(e).reverse().forEach(([r, o]) => {
    o.forEach((s) => {
      let u = new Uint8Array(s.length + 2);
      u.set([parseInt(r)], 0), u.set([s.length], 1), u.set(s, 2), t.push(u);
    });
  }), Je(...t);
}
var Dh = {};
Be(Dh, {
  decrypt: () => qh,
  encrypt: () => Ac
});
function Ac(e, t, r) {
  const o = e instanceof Uint8Array ? e : Pe(e), s = gi.getSharedSecret(o, Pe("02" + t)), u = kc(s);
  let f = Uint8Array.from(An(16)), p = it.encode(r), h = ic(u, f).encrypt(p), m = jt.encode(new Uint8Array(h)), v = jt.encode(new Uint8Array(f.buffer));
  return `${m}?iv=${v}`;
}
function qh(e, t, r) {
  const o = e instanceof Uint8Array ? e : Pe(e);
  let [s, u] = r.split("?iv="), f = gi.getSharedSecret(o, Pe("02" + t)), p = kc(f), h = jt.decode(u), m = jt.decode(s), v = ic(p, h).decrypt(m);
  return kt.decode(v);
}
function kc(e) {
  return e.slice(1, 33);
}
var $h = {};
Be($h, {
  NIP05_REGEX: () => Ni,
  isNip05: () => Kh,
  isValid: () => jh,
  queryProfile: () => Sc,
  searchDomain: () => Mh,
  useFetchImplementation: () => Uh
});
var Ni = /^(?:([\w.+-]+)@)?([\w_-]+(\.[\w_-]+)+)$/, Kh = (e) => Ni.test(e || ""), Wr;
try {
  Wr = fetch;
} catch {
}
function Uh(e) {
  Wr = e;
}
async function Mh(e, t = "") {
  try {
    const r = `https://${e}/.well-known/nostr.json?name=${t}`, o = await Wr(r, { redirect: "manual" });
    if (o.status !== 200)
      throw Error("Wrong response code");
    return (await o.json()).names;
  } catch {
    return {};
  }
}
async function Sc(e) {
  const t = e.match(Ni);
  if (!t)
    return null;
  const [, r = "_", o] = t;
  try {
    const s = `https://${o}/.well-known/nostr.json?name=${r}`, u = await Wr(s, { redirect: "manual" });
    if (u.status !== 200)
      throw Error("Wrong response code");
    const f = await u.json(), p = f.names[r];
    return p ? { pubkey: p, relays: f.relays?.[p] } : null;
  } catch {
    return null;
  }
}
async function jh(e, t) {
  const r = await Sc(t);
  return r ? r.pubkey === e : !1;
}
var Fh = {};
Be(Fh, {
  parse: () => Hh
});
function Hh(e) {
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
var Vh = {};
Be(Vh, {
  fetchRelayInformation: () => Zh,
  useFetchImplementation: () => zh
});
var Bc;
try {
  Bc = fetch;
} catch {
}
function zh(e) {
  Bc = e;
}
async function Zh(e) {
  return await (await fetch(e.replace("ws://", "http://").replace("wss://", "https://"), {
    headers: { Accept: "application/nostr+json" }
  })).json();
}
var Gh = {};
Be(Gh, {
  getPow: () => Wh,
  minePow: () => Xh
});
function Wh(e) {
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
function Yh(e) {
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
function Xh(e, t) {
  let r = 0;
  const o = e, s = ["nonce", r.toString(), t.toString()];
  for (o.tags.push(s); ; ) {
    const u = Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3);
    u !== o.created_at && (r = 0, o.created_at = u), s[1] = (++r).toString();
    const f = pt(
      it.encode(JSON.stringify([0, o.pubkey, o.created_at, o.kind, o.tags, o.content]))
    );
    if (Yh(f) >= t) {
      o.id = Ne(f);
      break;
    }
  }
  return o;
}
var Jh = {};
Be(Jh, {
  unwrapEvent: () => lp,
  unwrapManyEvents: () => fp,
  wrapEvent: () => Uc,
  wrapManyEvents: () => up
});
var Qh = {};
Be(Qh, {
  createRumor: () => Dc,
  createSeal: () => qc,
  createWrap: () => $c,
  unwrapEvent: () => Ki,
  unwrapManyEvents: () => Kc,
  wrapEvent: () => $r,
  wrapManyEvents: () => ap
});
var ep = {};
Be(ep, {
  decrypt: () => $i,
  encrypt: () => qi,
  getConversationKey: () => Pi,
  v2: () => ip
});
var Rc = 1, Oc = 65535;
function Pi(e, t) {
  const r = gi.getSharedSecret(e, Pe("02" + t)).subarray(1, 33);
  return Lf(pt, r, it.encode("nip44-v2"));
}
function Ic(e, t) {
  const r = Nf(pt, e, t, 76);
  return {
    chacha_key: r.subarray(0, 32),
    chacha_nonce: r.subarray(32, 44),
    hmac_key: r.subarray(44, 76)
  };
}
function Di(e) {
  if (!Number.isSafeInteger(e) || e < 1)
    throw new Error("expected positive integer");
  if (e <= 32)
    return 32;
  const t = 1 << Math.floor(Math.log2(e - 1)) + 1, r = t <= 256 ? 32 : t / 8;
  return r * (Math.floor((e - 1) / r) + 1);
}
function tp(e) {
  if (!Number.isSafeInteger(e) || e < Rc || e > Oc)
    throw new Error("invalid plaintext size: must be between 1 and 65535 bytes");
  const t = new Uint8Array(2);
  return new DataView(t.buffer).setUint16(0, e, !1), t;
}
function np(e) {
  const t = it.encode(e), r = t.length, o = tp(r), s = new Uint8Array(Di(r) - r);
  return Je(o, t, s);
}
function rp(e) {
  const t = new DataView(e.buffer).getUint16(0), r = e.subarray(2, 2 + t);
  if (t < Rc || t > Oc || r.length !== t || e.length !== 2 + Di(t))
    throw new Error("invalid padding");
  return kt.decode(r);
}
function Tc(e, t, r) {
  if (r.length !== 32)
    throw new Error("AAD associated data must be 32 bytes");
  const o = Je(r, t);
  return Vn(pt, e, o);
}
function op(e) {
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
function qi(e, t, r = An(32)) {
  const { chacha_key: o, chacha_nonce: s, hmac_key: u } = Ic(t, r), f = np(e), p = cc(o, s, f), h = Tc(u, p, r);
  return jt.encode(Je(new Uint8Array([2]), r, p, h));
}
function $i(e, t) {
  const { nonce: r, ciphertext: o, mac: s } = op(e), { chacha_key: u, chacha_nonce: f, hmac_key: p } = Ic(t, r), h = Tc(p, o, r);
  if (!df(h, s))
    throw new Error("invalid MAC");
  const m = cc(u, f, o);
  return rp(m);
}
var ip = {
  utils: {
    getConversationKey: Pi,
    calcPaddedLen: Di
  },
  encrypt: qi,
  decrypt: $i
}, sp = 2880 * 60, Cc = () => Math.round(Date.now() / 1e3), Lc = () => Math.round(Cc() - Math.random() * sp), Nc = (e, t) => Pi(e, t), Pc = (e, t, r) => qi(JSON.stringify(e), Nc(t, r)), Xs = (e, t) => JSON.parse($i(e.content, Nc(t, e.pubkey)));
function Dc(e, t) {
  const r = {
    created_at: Cc(),
    content: "",
    tags: [],
    ...e,
    pubkey: Ai(t)
  };
  return r.id = Sr(r), r;
}
function qc(e, t, r) {
  return yt(
    {
      kind: dc,
      content: Pc(e, t, r),
      created_at: Lc(),
      tags: []
    },
    t
  );
}
function $c(e, t) {
  const r = Hf();
  return yt(
    {
      kind: wc,
      content: Pc(e, r, t),
      created_at: Lc(),
      tags: [["p", t]]
    },
    r
  );
}
function $r(e, t, r) {
  const o = Dc(e, t), s = qc(o, t, r);
  return $c(s, r);
}
function ap(e, t, r) {
  if (!r || r.length === 0)
    throw new Error("At least one recipient is required.");
  const o = Ai(t), s = [$r(e, t, o)];
  return r.forEach((u) => {
    s.push($r(e, t, u));
  }), s;
}
function Ki(e, t) {
  const r = Xs(e, t);
  return Xs(r, t);
}
function Kc(e, t) {
  let r = [];
  return e.forEach((o) => {
    r.push(Ki(o, t));
  }), r.sort((o, s) => o.created_at - s.created_at), r;
}
function cp(e, t, r, o) {
  const s = {
    created_at: Math.ceil(Date.now() / 1e3),
    kind: hc,
    tags: [],
    content: t
  };
  return (Array.isArray(e) ? e : [e]).forEach(({ publicKey: f, relayUrl: p }) => {
    s.tags.push(p ? ["p", f, p] : ["p", f]);
  }), o && s.tags.push(["e", o.eventId, o.relayUrl || "", "reply"]), r && s.tags.push(["subject", r]), s;
}
function Uc(e, t, r, o, s) {
  const u = cp(t, r, o, s);
  return $r(u, e, t.publicKey);
}
function up(e, t, r, o, s) {
  if (!t || t.length === 0)
    throw new Error("At least one recipient is required.");
  return [{ publicKey: Ai(e) }, ...t].map(
    (f) => Uc(e, f, r, o, s)
  );
}
var lp = Ki, fp = Kc, dp = {};
Be(dp, {
  finishRepostEvent: () => hp,
  getRepostedEvent: () => pp,
  getRepostedEventPointer: () => Mc
});
function hp(e, t, r, o) {
  let s;
  const u = [...e.tags ?? [], ["e", t.id, r], ["p", t.pubkey]];
  return t.kind === fc ? s = Bi : (s = Oi, u.push(["k", String(t.kind)])), yt(
    {
      kind: s,
      tags: u,
      content: e.content === "" || t.tags?.find((f) => f[0] === "-") ? "" : JSON.stringify(t),
      created_at: e.created_at
    },
    o
  );
}
function Mc(e) {
  if (![Bi, Oi].includes(e.kind))
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
function pp(e, { skipVerification: t } = {}) {
  const r = Mc(e);
  if (r === void 0 || e.content === "")
    return;
  let o;
  try {
    o = JSON.parse(e.content);
  } catch {
    return;
  }
  if (o.id === r.id && !(!t && !Vr(o)))
    return o;
}
var yp = {};
Be(yp, {
  NOSTR_URI_REGEX: () => Ui,
  parse: () => mp,
  test: () => gp
});
var Ui = new RegExp(`nostr:(${xc.source})`);
function gp(e) {
  return typeof e == "string" && new RegExp(`^${Ui.source}$`).test(e);
}
function mp(e) {
  const t = e.match(new RegExp(`^${Ui.source}$`));
  if (!t)
    throw new Error(`Invalid Nostr URI: ${e}`);
  return {
    uri: t[0],
    value: t[1],
    decoded: zr(t[1])
  };
}
var vp = {};
Be(vp, {
  finishReactionEvent: () => wp,
  getReactedEventPointer: () => bp
});
function wp(e, t, r) {
  const o = t.tags.filter((s) => s.length >= 2 && (s[0] === "e" || s[0] === "p"));
  return yt(
    {
      ...e,
      kind: Ri,
      tags: [...e.tags ?? [], ...o, ["e", t.id], ["p", t.pubkey]],
      content: e.content ?? "+"
    },
    r
  );
}
function bp(e) {
  if (e.kind !== Ri)
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
var Ep = {};
Be(Ep, {
  parse: () => xp
});
var Ho = /\W/m, Js = /[^\w\/] |[^\w\/]$|$|,| /m, _p = 42;
function* xp(e) {
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
          const p = e.slice(f + 1, f + _p).match(Ho), h = p ? f + 1 + p.index : r;
          yield { type: "text", text: e.slice(o, f) }, yield { type: "hashtag", value: e.slice(f + 1, h) }, s = h, o = s;
          continue e;
        }
        s = f + 1;
        continue e;
      }
      if (e.slice(u - 5, u) === "nostr") {
        const p = e.slice(u + 60).match(Ho), h = p ? u + 60 + p.index : r;
        try {
          let m, { data: v, type: w } = zr(e.slice(u + 1, h));
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
        const p = e.slice(u + 4).match(Js), h = p ? u + 4 + p.index : r, m = e[u - 1] === "s" ? 5 : 4;
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
        const p = e.slice(u + 4).match(Js), h = p ? u + 4 + p.index : r, m = e[u - 1] === "s" ? 3 : 2;
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
var Ap = {};
Be(Ap, {
  channelCreateEvent: () => kp,
  channelHideMessageEvent: () => Rp,
  channelMessageEvent: () => Bp,
  channelMetadataEvent: () => Sp,
  channelMuteUserEvent: () => Op
});
var kp = (e, t) => {
  let r;
  if (typeof e.content == "object")
    r = JSON.stringify(e.content);
  else if (typeof e.content == "string")
    r = e.content;
  else
    return;
  return yt(
    {
      kind: pc,
      tags: [...e.tags ?? []],
      content: r,
      created_at: e.created_at
    },
    t
  );
}, Sp = (e, t) => {
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
      tags: [["e", e.channel_create_event_id], ...e.tags ?? []],
      content: r,
      created_at: e.created_at
    },
    t
  );
}, Bp = (e, t) => {
  const r = [["e", e.channel_create_event_id, e.relay_url, "root"]];
  return e.reply_to_channel_message_event_id && r.push(["e", e.reply_to_channel_message_event_id, e.relay_url, "reply"]), yt(
    {
      kind: gc,
      tags: [...r, ...e.tags ?? []],
      content: e.content,
      created_at: e.created_at
    },
    t
  );
}, Rp = (e, t) => {
  let r;
  if (typeof e.content == "object")
    r = JSON.stringify(e.content);
  else if (typeof e.content == "string")
    r = e.content;
  else
    return;
  return yt(
    {
      kind: mc,
      tags: [["e", e.channel_message_event_id], ...e.tags ?? []],
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
      kind: vc,
      tags: [["p", e.pubkey_to_mute], ...e.tags ?? []],
      content: r,
      created_at: e.created_at
    },
    t
  );
}, Ip = {};
Be(Ip, {
  EMOJI_SHORTCODE_REGEX: () => jc,
  matchAll: () => Tp,
  regex: () => Mi,
  replaceAll: () => Cp
});
var jc = /:(\w+):/, Mi = () => new RegExp(`\\B${jc.source}\\B`, "g");
function* Tp(e) {
  const t = e.matchAll(Mi());
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
function Cp(e, t) {
  return e.replaceAll(Mi(), (r, o) => t({
    shortcode: r,
    name: o
  }));
}
var Lp = {};
Be(Lp, {
  useFetchImplementation: () => Np,
  validateGithub: () => Pp
});
var ji;
try {
  ji = fetch;
} catch {
}
function Np(e) {
  ji = e;
}
async function Pp(e, t, r) {
  try {
    return await (await ji(`https://gist.github.com/${t}/${r}/raw`)).text() === `Verifying that I control the following Nostr public key: ${e}`;
  } catch {
    return !1;
  }
}
var Dp = {};
Be(Dp, {
  makeNwcRequestEvent: () => $p,
  parseConnectionString: () => qp
});
function qp(e) {
  const { host: t, pathname: r, searchParams: o } = new URL(e), s = r || t, u = o.get("relay"), f = o.get("secret");
  if (!s || !u || !f)
    throw new Error("invalid connection string");
  return { pubkey: s, relay: u, secret: f };
}
async function $p(e, t, r) {
  const s = Ac(t, e, JSON.stringify({
    method: "pay_invoice",
    params: {
      invoice: r
    }
  })), u = {
    kind: Ec,
    created_at: Math.round(Date.now() / 1e3),
    content: s,
    tags: [["p", e]]
  };
  return yt(u, t);
}
var Kp = {};
Be(Kp, {
  normalizeIdentifier: () => Up
});
function Up(e) {
  return e = e.trim().toLowerCase(), e = e.normalize("NFKC"), Array.from(e).map((t) => new RegExp("\\p{Letter}", "u").test(t) || new RegExp("\\p{Number}", "u").test(t) ? t : "-").join("");
}
var Mp = {};
Be(Mp, {
  getSatoshisAmountFromBolt11: () => Zp,
  getZapEndpoint: () => Fp,
  makeZapReceipt: () => zp,
  makeZapRequest: () => Hp,
  useFetchImplementation: () => jp,
  validateZapRequest: () => Vp
});
var Fi;
try {
  Fi = fetch;
} catch {
}
function jp(e) {
  Fi = e;
}
async function Fp(e) {
  try {
    let t = "", { lud06: r, lud16: o } = JSON.parse(e.content);
    if (o) {
      let [f, p] = o.split("@");
      t = new URL(`/.well-known/lnurlp/${f}`, `https://${p}`).toString();
    } else if (r) {
      let { words: f } = _n.decode(r, 1e3), p = _n.fromWords(f);
      t = kt.decode(p);
    } else
      return null;
    let u = await (await Fi(t)).json();
    if (u.allowsNostr && u.nostrPubkey)
      return u.callback;
  } catch {
  }
  return null;
}
function Hp(e) {
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
    if (t.tags.push(["e", e.event.id]), ki(e.event.kind)) {
      const r = ["a", `${e.event.kind}:${e.event.pubkey}:`];
      t.tags.push(r);
    } else if (Si(e.event.kind)) {
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
function Vp(e) {
  let t;
  try {
    t = JSON.parse(e);
  } catch {
    return "Invalid zap request JSON.";
  }
  if (!zn(t))
    return "Zap request is not a valid Nostr event.";
  if (!Vr(t))
    return "Invalid signature on zap request.";
  let r = t.tags.find(([u, f]) => u === "p" && f);
  if (!r)
    return "Zap request doesn't have a 'p' tag.";
  if (!r[1].match(/^[a-f0-9]{64}$/))
    return "Zap request 'p' tag is not valid hex.";
  let o = t.tags.find(([u, f]) => u === "e" && f);
  return o && !o[1].match(/^[a-f0-9]{64}$/) ? "Zap request 'e' tag is not valid hex." : t.tags.find(([u, f]) => u === "relays" && f) ? null : "Zap request doesn't have a 'relays' tag.";
}
function zp({
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
function Zp(e) {
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
var Gp = {};
Be(Gp, {
  Negentropy: () => Hc,
  NegentropyStorageVector: () => Xp,
  NegentropySync: () => Jp
});
var Vo = 97, bn = 32, Fc = 16, en = {
  Skip: 0,
  Fingerprint: 1,
  IdList: 2
}, xt = class {
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
    if (e instanceof xt && (e = e.unwrap()), typeof e.length != "number")
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
function xr(e) {
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
    return new xt(new Uint8Array([0]));
  let t = [];
  for (; e !== 0; )
    t.push(e & 127), e >>>= 7;
  t.reverse();
  for (let r = 0; r < t.length - 1; r++)
    t[r] |= 128;
  return new xt(new Uint8Array(t));
}
function Wp(e) {
  return Br(e, 1)[0];
}
function Br(e, t) {
  if (e.length < t)
    throw Error("parse ends prematurely");
  return e.shiftN(t);
}
var Yp = class {
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
    let t = new xt();
    return t.extend(this.buf), t.extend(Et(e)), pt(t.unwrap()).subarray(0, Fc);
  }
}, Xp = class {
  items;
  sealed;
  constructor() {
    this.items = [], this.sealed = !1;
  }
  insert(e, t) {
    if (this.sealed)
      throw Error("already sealed");
    const r = Pe(t);
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
    let r = new Yp();
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
}, Hc = class {
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
    let e = new xt();
    return e.extend(new Uint8Array([Vo])), this.splitRange(0, this.storage.size(), this._bound(Number.MAX_VALUE), e), Ne(e.unwrap());
  }
  reconcile(e, t, r) {
    const o = new xt(Pe(e));
    this.lastTimestampIn = this.lastTimestampOut = 0;
    let s = new xt();
    s.extend(new Uint8Array([Vo]));
    let u = Wp(o);
    if (u < 96 || u > 111)
      throw Error("invalid negentropy protocol version byte");
    if (u !== Vo)
      throw Error("unsupported negentropy protocol version requested: " + (u - 96));
    let f = this.storage.size(), p = this._bound(0), h = 0, m = !1;
    for (; o.length !== 0; ) {
      let v = new xt(), w = () => {
        m && (m = !1, v.extend(this.encodeBound(p)), v.extend(Et(en.Skip)));
      }, N = this.decodeBound(o), T = xr(o), P = h, q = this.storage.findLowerBound(h, f, N);
      if (T === en.Skip)
        m = !0;
      else if (T === en.Fingerprint) {
        let L = Br(o, Fc), H = this.storage.fingerprint(P, q);
        Vc(L, H) !== 0 ? (w(), this.splitRange(P, q, N, v)) : m = !0;
      } else if (T === en.IdList) {
        let L = xr(o), H = {};
        for (let Y = 0; Y < L; Y++) {
          let he = Br(o, bn);
          H[Ne(he)] = he;
        }
        if (m = !0, this.storage.iterate(P, q, (Y) => {
          let he = Y.id;
          const ve = Ne(he);
          return H[ve] ? delete H[Ne(he)] : t?.(ve), !0;
        }), r)
          for (let Y of Object.values(H))
            r(Ne(Y));
      } else
        throw Error("unexpected mode");
      if (this.exceededFrameSizeLimit(s.length + v.length)) {
        let L = this.storage.fingerprint(q, f);
        s.extend(this.encodeBound(this._bound(Number.MAX_VALUE))), s.extend(Et(en.Fingerprint)), s.extend(L);
        break;
      } else
        s.extend(v);
      h = q, p = N;
    }
    return s.length === 1 ? null : Ne(s.unwrap());
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
        let N;
        if (h === t)
          N = r;
        else {
          let T, P;
          this.storage.iterate(h - 1, h + 1, (q, L) => (L === h - 1 ? T = q : P = q, !0)), N = this.getMinimalBound(T, P);
        }
        o.extend(this.encodeBound(N)), o.extend(Et(en.Fingerprint)), o.extend(w);
      }
    }
  }
  exceededFrameSizeLimit(e) {
    return e > this.frameSizeLimit - 200;
  }
  decodeTimestampIn(e) {
    let t = xr(e);
    return t = t === 0 ? Number.MAX_VALUE : t - 1, this.lastTimestampIn === Number.MAX_VALUE || t === Number.MAX_VALUE ? (this.lastTimestampIn = Number.MAX_VALUE, Number.MAX_VALUE) : (t += this.lastTimestampIn, this.lastTimestampIn = t, t);
  }
  decodeBound(e) {
    let t = this.decodeTimestampIn(e), r = xr(e);
    if (r > bn)
      throw Error("bound key too long");
    let o = Br(e, r);
    return { timestamp: t, id: o };
  }
  encodeTimestampOut(e) {
    if (e === Number.MAX_VALUE)
      return this.lastTimestampOut = Number.MAX_VALUE, Et(0);
    let t = e;
    return e -= this.lastTimestampOut, this.lastTimestampOut = t, Et(e + 1);
  }
  encodeBound(e) {
    let t = new xt();
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
function Vc(e, t) {
  for (let r = 0; r < e.byteLength; r++) {
    if (e[r] < t[r])
      return -1;
    if (e[r] > t[r])
      return 1;
  }
  return e.byteLength > t.byteLength ? 1 : e.byteLength < t.byteLength ? -1 : 0;
}
function zo(e, t) {
  return e.timestamp === t.timestamp ? Vc(e.id, t.id) : e.timestamp - t.timestamp;
}
var Jp = class {
  relay;
  storage;
  neg;
  filter;
  subscription;
  onhave;
  onneed;
  constructor(e, t, r, o = {}) {
    this.relay = e, this.storage = t, this.neg = new Hc(t), this.onhave = o.onhave, this.onneed = o.onneed, this.filter = r, this.subscription = this.relay.prepareSubscription([{}], { label: o.label || "negentropy" }), this.subscription.oncustom = (s) => {
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
}, Qp = {};
Be(Qp, {
  getToken: () => ey,
  hashPayload: () => Hi,
  unpackEventFromToken: () => Zc,
  validateEvent: () => Qc,
  validateEventKind: () => Wc,
  validateEventMethodTag: () => Xc,
  validateEventPayloadTag: () => Jc,
  validateEventTimestamp: () => Gc,
  validateEventUrlTag: () => Yc,
  validateToken: () => ty
});
var zc = "Nostr ";
async function ey(e, t, r, o = !1, s) {
  const u = {
    kind: Ii,
    tags: [
      ["u", e],
      ["method", t]
    ],
    created_at: Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3),
    content: ""
  };
  s && u.tags.push(["payload", Hi(s)]);
  const f = await r(u);
  return (o ? zc : "") + jt.encode(it.encode(JSON.stringify(f)));
}
async function ty(e, t, r) {
  const o = await Zc(e).catch((u) => {
    throw u;
  });
  return await Qc(o, t, r).catch((u) => {
    throw u;
  });
}
async function Zc(e) {
  if (!e)
    throw new Error("Missing token");
  e = e.replace(zc, "");
  const t = kt.decode(jt.decode(e));
  if (!t || t.length === 0 || !t.startsWith("{"))
    throw new Error("Invalid token");
  return JSON.parse(t);
}
function Gc(e) {
  return e.created_at ? Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3) - e.created_at < 60 : !1;
}
function Wc(e) {
  return e.kind === Ii;
}
function Yc(e, t) {
  const r = e.tags.find((o) => o[0] === "u");
  return r ? r.length > 0 && r[1] === t : !1;
}
function Xc(e, t) {
  const r = e.tags.find((o) => o[0] === "method");
  return r ? r.length > 0 && r[1].toLowerCase() === t.toLowerCase() : !1;
}
function Hi(e) {
  const t = pt(it.encode(JSON.stringify(e)));
  return Ne(t);
}
function Jc(e, t) {
  const r = e.tags.find((s) => s[0] === "payload");
  if (!r)
    return !1;
  const o = Hi(t);
  return r.length > 0 && r[1] === o;
}
async function Qc(e, t, r, o) {
  if (!Vr(e))
    throw new Error("Invalid nostr event, signature invalid");
  if (!Wc(e))
    throw new Error("Invalid nostr event, kind invalid");
  if (!Gc(e))
    throw new Error("Invalid nostr event, created_at timestamp invalid");
  if (!Yc(e, t))
    throw new Error("Invalid nostr event, url tag invalid");
  if (!Xc(e, r))
    throw new Error("Invalid nostr event, method tag invalid");
  if (o && typeof o == "object" && Object.keys(o).length > 0 && !Jc(e, o))
    throw new Error("Invalid nostr event, payload tag does not match request body hash");
  return !0;
}
const ny = [
  "wss://relay.nostr.band/",
  "wss://nrelay.c-stellar.net/",
  "wss://nrelay-jp.c-stellar.net/"
];
new Set(ny);
function ry(e) {
  return e.map((t) => [...t]);
}
function oy(e, t) {
  return !Array.isArray(e) || e.length !== t.length ? !1 : e.every((r, o) => !Array.isArray(r) || r.length !== t[o].length ? !1 : r.every((s, u) => s === t[o][u]));
}
function iy(e) {
  return {
    id: e.id,
    pubkey: e.pubkey,
    created_at: e.created_at,
    kind: e.kind,
    tags: ry(e.tags),
    content: e.content,
    sig: e.sig
  };
}
function Yr(e) {
  if (!e || typeof e != "object")
    return !1;
  const t = e;
  return typeof t.id == "string" && typeof t.pubkey == "string" && typeof t.kind == "number" && typeof t.content == "string" && typeof t.created_at == "number" && typeof t.sig == "string" && Array.isArray(t.tags) && t.tags.every(
    (r) => Array.isArray(r) && r.every((o) => typeof o == "string")
  );
}
function sy(e, t) {
  return Yr(e) && e.id === t.eventId && e.pubkey === t.pubkeyHex && e.kind === t.kind && e.content === t.content && e.created_at === t.createdAt && oy(e.tags, t.tags);
}
function eu(e) {
  if (!e || e.kind !== 5)
    return [];
  const t = e.tags.filter((r) => r[0] === "e" && typeof r[1] == "string" && r[1].length > 0).map((r) => r[1]);
  return Array.from(new Set(t));
}
const Xr = 1, ay = 1024 * 1024, cy = 100, uy = {
  status: "valid",
  ruleVersion: Xr
}, Zo = {
  status: "invalid",
  ruleVersion: Xr
};
function ly(e) {
  return e?.ruleVersion === Xr && (e.status === "valid" || e.status === "invalid");
}
function tu(e) {
  return e?.status === "valid" && e.ruleVersion === Xr;
}
function nu(e) {
  if (Yr(e))
    try {
      return `nostr:${ui(e)}\0${e.id}\0${e.sig}`;
    } catch {
    }
  try {
    return `raw:${JSON.stringify(e)}`;
  } catch {
    return "raw:unserializable";
  }
}
function fy(e) {
  if (!Yr(e))
    return { ...Zo };
  try {
    const t = iy(e);
    return zn(t) && ui(t) === t.id && Vr(t) ? { ...uy } : { ...Zo };
  } catch {
    return { ...Zo };
  }
}
async function Qs(e, t) {
  for (const { id: r, fingerprint: o, verification: s } of e) {
    const u = await t.get(r);
    !u || nu(u.rawEvent) !== o || await t.update(r, {
      rawEventVerification: s
    });
  }
}
function dy(e, t) {
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
async function hy(e, t, r, o) {
  const s = [
    ...e.map((w) => ({ type: "post", record: w })),
    ...t.map((w) => ({ type: "deletion", record: w }))
  ].filter((w) => !ly(w.record.rawEventVerification)), u = s.length;
  if (u === 0)
    return;
  let f = 0;
  const p = /* @__PURE__ */ new Map(), h = [], m = [];
  async function v() {
    if (h.length > 0) {
      const w = h.splice(0), N = () => Qs(w, r.post);
      await (r.transaction?.post ?? (async (T) => T()))(N);
    }
    if (m.length > 0) {
      const w = m.splice(0), N = () => Qs(w, r.deletion);
      await (r.transaction?.deletion ?? (async (T) => T()))(N);
    }
  }
  o?.({ phase: "verifying", processed: f, total: u });
  for (const w of s) {
    const N = nu(w.record.rawEvent), T = p.get(N) ?? fy(w.record.rawEvent);
    p.set(N, T), w.record.rawEventVerification = T;
    const P = { id: w.record.id, fingerprint: N, verification: T };
    w.type === "post" ? h.push(P) : m.push(P), f += 1, f % cy === 0 && (await v(), o?.({ phase: "verifying", processed: f, total: u }));
  }
  await v(), o?.({ phase: "verifying", processed: u, total: u });
}
function ru(e, t) {
  if (!Yr(e) || e.kind !== t)
    return !1;
  try {
    return zn(e) && ui(e) === e.id;
  } catch {
    return !1;
  }
}
function ea(e) {
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
function ta(e, t) {
  return e.created_at !== t.created_at ? e.created_at - t.created_at : e.id === t.id ? 0 : e.id < t.id ? -1 : 1;
}
function py(e) {
  return e.rawEvent !== null && e.rawEvent !== void 0;
}
function yy(e, t, r) {
  return !tu(e.rawEventVerification) || !ru(t, 5) || t.pubkey !== r || e.targetAuthorPubkey !== r || e.deletionEventPubkey !== r || t.id !== e.deletionEventId ? !1 : eu(t).includes(e.targetEventId);
}
function gy() {
  return {
    exportedEventCount: 0,
    exportedPostEventCount: 0,
    exportedDeletionEventCount: 0,
    skippedPostCount: 0,
    missingDeletionRawEventCount: 0,
    invalidDeletionRawEventCount: 0,
    isPartial: !1
  };
}
function my(e, t) {
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
    o.length > 0 && o.length + u.length > ay && (r.push(o), o = ""), o += u;
  }
  return o.length > 0 && r.push(o), {
    blob: new Blob(r, { type: "application/x-ndjson;charset=utf-8" }),
    ...t ? { jsonl: r.join("") } : {}
  };
}
async function vy(e, t, r, o = {}) {
  const s = gy(), u = [], f = [], p = /* @__PURE__ */ new Set(), h = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Set(), v = t.filter((L) => L.pubkeyHex === e), w = r.filter(
    (L) => L.targetAuthorPubkey === e
  );
  for (const L of v)
    if (!(L.kind !== 1 && L.kind !== 42)) {
      if (!tu(L.rawEventVerification) || !sy(L.rawEvent, L) || !ru(L.rawEvent, L.kind)) {
        s.skippedPostCount += 1;
        continue;
      }
      u.push(ea(L.rawEvent)), p.add(L.eventId), s.exportedPostEventCount += 1;
    }
  const N = /* @__PURE__ */ new Map();
  for (const L of w) {
    const H = N.get(L.deletionEventId) ?? [];
    H.push(L), N.set(L.deletionEventId, H);
  }
  for (const L of N.values()) {
    const H = L.find((Y) => yy(Y, Y.rawEvent, e));
    if (H) {
      const Y = ea(H.rawEvent);
      f.push(Y);
      for (const he of eu(Y))
        h.add(he);
      s.exportedDeletionEventCount += 1;
      continue;
    }
    for (const Y of L)
      m.add(Y.targetEventId);
    L.every((Y) => !py(Y)) ? s.missingDeletionRawEventCount += 1 : s.invalidDeletionRawEventCount += 1;
  }
  const T = /* @__PURE__ */ new Set();
  for (const L of v)
    L.kind !== 1 && L.kind !== 42 || L.deletedAt === void 0 || !p.has(L.eventId) || h.has(L.eventId) || m.has(L.eventId) || T.add(L.eventId);
  s.missingDeletionRawEventCount += T.size, u.sort(ta), f.sort(ta);
  const P = [...u, ...f];
  s.exportedEventCount = P.length, s.isPartial = s.skippedPostCount > 0 || s.missingDeletionRawEventCount > 0 || s.invalidDeletionRawEventCount > 0, o.onProgress?.({ phase: "creating" });
  const q = my(P, o.includeJsonl === !0);
  return { result: s, ...q };
}
async function wy(e) {
  const t = e.postRecords.filter(
    (s) => s.pubkeyHex === e.pubkeyHex
  ), r = e.deletionRecords.filter(
    (s) => s.targetAuthorPubkey === e.pubkeyHex
  ), o = e.verificationStores ?? dy(t, r);
  return await hy(
    t,
    r,
    o,
    e.onProgress
  ), vy(
    e.pubkeyHex,
    t,
    r,
    e
  );
}
var by = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ey(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Rr = { exports: {} }, _y = Rr.exports, na;
function xy() {
  return na || (na = 1, (function(e, t) {
    ((r, o) => {
      e.exports = o();
    })(_y, function() {
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
      var u = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : by, f = Object.keys, p = Array.isArray;
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
      function N(n, i) {
        typeof i == "function" && (i = i(m(n))), (typeof Reflect > "u" ? f : Reflect.ownKeys)(i).forEach(function(a) {
          P(n, a, i[a]);
        });
      }
      var T = Object.defineProperty;
      function P(n, i, a, c) {
        T(n, i, h(a && w(a, "get") && typeof a.get == "function" ? { get: a.get, set: a.set, configurable: !0 } : { value: a, configurable: !0, writable: !0 }, c));
      }
      function q(n) {
        return { from: function(i) {
          return n.prototype = Object.create(i.prototype), P(n.prototype, "constructor", n), { extend: N.bind(null, n.prototype) };
        } };
      }
      var L = Object.getOwnPropertyDescriptor, H = [].slice;
      function Y(n, i, a) {
        return H.call(n, i, a);
      }
      function he(n, i) {
        return i(n);
      }
      function ve(n) {
        if (!n) throw new Error("Assertion Failed");
      }
      function Me(n) {
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
      function me(n, i, a) {
        if (n && i !== void 0 && !("isFrozen" in Object && Object.isFrozen(n))) if (typeof i != "string" && "length" in i) {
          ve(typeof a != "string" && "length" in a);
          for (var c = 0, l = i.length; c < l; ++c) me(n, i[c], a[c]);
        } else {
          var d, y, g = i.indexOf(".");
          g !== -1 ? (d = i.substr(0, g), (g = i.substr(g + 1)) === "" ? a === void 0 ? p(n) && !isNaN(parseInt(d)) ? n.splice(d, 1) : delete n[d] : n[d] = a : me(y = (y = n[d]) && w(n, d) ? y : n[d] = {}, g, a)) : a === void 0 ? p(n) && !isNaN(parseInt(i)) ? n.splice(i, 1) : delete n[i] : n[i] = a;
        }
      }
      function Re(n) {
        var i, a = {};
        for (i in n) w(n, i) && (a[i] = n[i]);
        return a;
      }
      var ue = [].concat;
      function De(n) {
        return ue.apply([], n);
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
      function U(n) {
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
      function D(n) {
        return j.call(n).slice(8, -1);
      }
      var Z = typeof Symbol < "u" ? Symbol.iterator : "@@iterator", ee = typeof Z == "symbol" ? function(n) {
        var i;
        return n != null && (i = n[Z]) && i.apply(n);
      } : function() {
        return null;
      };
      function J(n, i) {
        i = n.indexOf(i), 0 <= i && n.splice(i, 1);
      }
      var Q = {};
      function G(n) {
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
      function ye(n, i) {
        return n + ". Errors: " + Object.keys(i).map(function(a) {
          return i[a].toString();
        }).filter(function(a, c, l) {
          return l.indexOf(a) === c;
        }).join(`
`);
      }
      function xe(n, i, a, c) {
        this.failures = i, this.failedKeys = c, this.successCount = a, this.message = ye(n, i);
      }
      function Te(n, i) {
        this.name = "BulkError", this.failures = Object.keys(i).map(function(a) {
          return i[a];
        }), this.failuresByPos = i, this.message = ye(n, this.failures);
      }
      q(Ee).from(Error).extend({ toString: function() {
        return this.name + ": " + this.message;
      } }), q(xe).from(Ee), q(Te).from(Ee);
      var We = et.reduce(function(n, i) {
        return n[i] = i + "Error", n;
      }, {}), Ce = Ee, X = et.reduce(function(n, i) {
        var a = i + "Error";
        function c(l, d) {
          this.name = a, l ? typeof l == "string" ? (this.message = "".concat(l).concat(d ? `
 ` + d : ""), this.inner = d || null) : typeof l == "object" && (this.message = "".concat(l.name, " ").concat(l.message), this.inner = l) : (this.message = Ie[i] || a, this.inner = null);
        }
        return q(c).from(Ce), n[i] = c, n;
      }, {}), Ft = (X.Syntax = SyntaxError, X.Type = TypeError, X.Range = RangeError, ne.reduce(function(n, i) {
        return n[i + "Error"] = X[i], n;
      }, {}));
      ne = et.reduce(function(n, i) {
        return ["Syntax", "Type", "Range"].indexOf(i) === -1 && (n[i + "Error"] = X[i]), n;
      }, {});
      function _e() {
      }
      function St(n) {
        return n;
      }
      function ou(n, i) {
        return n == null || n === St ? i : function(a) {
          return i(n(a));
        };
      }
      function Ht(n, i) {
        return function() {
          n.apply(this, arguments), i.apply(this, arguments);
        };
      }
      function iu(n, i) {
        return n === _e ? i : function() {
          var a = n.apply(this, arguments), c = (a !== void 0 && (arguments[0] = a), this.onsuccess), l = this.onerror, d = (this.onsuccess = null, this.onerror = null, i.apply(this, arguments));
          return c && (this.onsuccess = this.onsuccess ? Ht(c, this.onsuccess) : c), l && (this.onerror = this.onerror ? Ht(l, this.onerror) : l), d !== void 0 ? d : a;
        };
      }
      function su(n, i) {
        return n === _e ? i : function() {
          n.apply(this, arguments);
          var a = this.onsuccess, c = this.onerror;
          this.onsuccess = this.onerror = null, i.apply(this, arguments), a && (this.onsuccess = this.onsuccess ? Ht(a, this.onsuccess) : a), c && (this.onerror = this.onerror ? Ht(c, this.onerror) : c);
        };
      }
      function au(n, i) {
        return n === _e ? i : function(l) {
          var c = n.apply(this, arguments), l = (h(l, c), this.onsuccess), d = this.onerror, y = (this.onsuccess = null, this.onerror = null, i.apply(this, arguments));
          return l && (this.onsuccess = this.onsuccess ? Ht(l, this.onsuccess) : l), d && (this.onerror = this.onerror ? Ht(d, this.onerror) : d), c === void 0 ? y === void 0 ? void 0 : y : h(c, y);
        };
      }
      function cu(n, i) {
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
      function Vi(n) {
        ct = n;
      }
      var kn = {}, zi = 100, Sn = typeof Promise > "u" ? [] : (et = Promise.resolve(), typeof crypto < "u" && crypto.subtle ? [Sn = crypto.subtle.digest("SHA-512", new Uint8Array([0])), m(Sn), et] : [et, m(et), et]), et = Sn[0], pn = Sn[1], pn = pn && pn.then, Vt = et && et.constructor, Qr = !!Sn[2], Bn = function(n, i) {
        Rn.push([n, i]), Zn && (queueMicrotask(lu), Zn = !1);
      }, eo = !0, Zn = !0, zt = [], Gn = [], to = St, gt = { id: "global", global: !0, ref: 0, unhandleds: [], onunhandled: _e, pgp: !1, env: {}, finalize: _e }, ie = gt, Rn = [], Zt = 0, Wn = [];
      function W(n) {
        if (typeof this != "object") throw new TypeError("Promises must be constructed via new");
        this._listeners = [], this._lib = !1;
        var i = this._PSD = ie;
        if (typeof n != "function") {
          if (n !== kn) throw new TypeError("Not a function");
          this._state = arguments[1], this._value = arguments[2], this._state === !1 && ro(this, this._value);
        } else this._state = null, this._value = null, ++i.ref, (function a(c, l) {
          try {
            l(function(d) {
              if (c._state === null) {
                if (d === c) throw new TypeError("A promise cannot be resolved with itself.");
                var y = c._lib && cn();
                d && typeof d.then == "function" ? a(c, function(g, E) {
                  d instanceof W ? d._then(g, E) : d.then(g, E);
                }) : (c._state = !0, c._value = d, Gi(c)), y && un();
              }
            }, ro.bind(null, c));
          } catch (d) {
            ro(c, d);
          }
        })(this, n);
      }
      var no = { get: function() {
        var n = ie, i = Qn;
        function a(c, l) {
          var d = this, y = !n.global && (n !== ie || i !== Qn), g = y && !Rt(), E = new W(function(R, x) {
            oo(d, new Zi(Yi(c, n, y, g), Yi(l, n, y, g), R, x, n));
          });
          return this._consoleTask && (E._consoleTask = this._consoleTask), E;
        }
        return a.prototype = kn, a;
      }, set: function(n) {
        P(this, "then", n && n.prototype === kn ? no : { get: function() {
          return n;
        }, set: no.set });
      } };
      function Zi(n, i, a, c, l) {
        this.onFulfilled = typeof n == "function" ? n : null, this.onRejected = typeof i == "function" ? i : null, this.resolve = a, this.reject = c, this.psd = l;
      }
      function ro(n, i) {
        var a, c;
        Gn.push(i), n._state === null && (a = n._lib && cn(), i = to(i), n._state = !1, n._value = i, c = n, zt.some(function(l) {
          return l._value === c._value;
        }) || zt.push(c), Gi(n), a) && un();
      }
      function Gi(n) {
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
          ++i.psd.ref, ++Zt, Bn(uu, [a, n, i]);
        }
      }
      function uu(n, i, a) {
        try {
          var c, l = i._value;
          !i._state && Gn.length && (Gn = []), c = ct && i._consoleTask ? i._consoleTask.run(function() {
            return n(l);
          }) : n(l), i._state || Gn.indexOf(l) !== -1 || ((d) => {
            for (var y = zt.length; y; ) if (zt[--y]._value === d._value) return zt.splice(y, 1);
          })(i), a.resolve(c);
        } catch (d) {
          a.reject(d);
        } finally {
          --Zt == 0 && io(), --a.psd.ref || a.psd.finalize();
        }
      }
      function lu() {
        Gt(gt, function() {
          cn() && un();
        });
      }
      function cn() {
        var n = eo;
        return Zn = eo = !1, n;
      }
      function un() {
        var n, i, a;
        do
          for (; 0 < Rn.length; ) for (n = Rn, Rn = [], a = n.length, i = 0; i < a; ++i) {
            var c = n[i];
            c[0].apply(null, c[1]);
          }
        while (0 < Rn.length);
        Zn = eo = !0;
      }
      function io() {
        for (var n = zt, i = (zt = [], n.forEach(function(c) {
          c._PSD.onunhandled.call(null, c._value, c);
        }), Wn.slice(0)), a = i.length; a; ) i[--a]();
      }
      function Yn(n) {
        return new W(kn, !1, n);
      }
      function Le(n, i) {
        var a = ie;
        return function() {
          var c = cn(), l = ie;
          try {
            return Ot(a, !0), n.apply(this, arguments);
          } catch (d) {
            i && i(d);
          } finally {
            Ot(l, !1), c && un();
          }
        };
      }
      N(W.prototype, { then: no, _then: function(n, i) {
        oo(this, new Zi(null, null, n, i, ie));
      }, catch: function(n) {
        var i, a;
        return arguments.length === 1 ? this.then(null, n) : (i = n, a = arguments[1], typeof i == "function" ? this.then(null, function(c) {
          return (c instanceof i ? a : Yn)(c);
        }) : this.then(null, function(c) {
          return (c && c.name === i ? a : Yn)(c);
        }));
      }, finally: function(n) {
        return this.then(function(i) {
          return W.resolve(n()).then(function() {
            return i;
          });
        }, function(i) {
          return W.resolve(n()).then(function() {
            return Yn(i);
          });
        });
      }, timeout: function(n, i) {
        var a = this;
        return n < 1 / 0 ? new W(function(c, l) {
          var d = setTimeout(function() {
            return l(new X.Timeout(i));
          }, n);
          a.then(c, l).finally(clearTimeout.bind(null, d));
        }) : this;
      } }), typeof Symbol < "u" && Symbol.toStringTag && P(W.prototype, Symbol.toStringTag, "Dexie.Promise"), gt.env = Wi(), N(W, { all: function() {
        var n = G.apply(null, arguments).map(er);
        return new W(function(i, a) {
          n.length === 0 && i([]);
          var c = n.length;
          n.forEach(function(l, d) {
            return W.resolve(l).then(function(y) {
              n[d] = y, --c || i(n);
            }, a);
          });
        });
      }, resolve: function(n) {
        return n instanceof W ? n : n && typeof n.then == "function" ? new W(function(i, a) {
          n.then(i, a);
        }) : new W(kn, !0, n);
      }, reject: Yn, race: function() {
        var n = G.apply(null, arguments).map(er);
        return new W(function(i, a) {
          n.map(function(c) {
            return W.resolve(c).then(i, a);
          });
        });
      }, PSD: { get: function() {
        return ie;
      }, set: function(n) {
        return ie = n;
      } }, totalEchoes: { get: function() {
        return Qn;
      } }, newPSD: Bt, usePSD: Gt, scheduler: { get: function() {
        return Bn;
      }, set: function(n) {
        Bn = n;
      } }, rejectionMapper: { get: function() {
        return to;
      }, set: function(n) {
        to = n;
      } }, follow: function(n, i) {
        return new W(function(a, c) {
          return Bt(function(l, d) {
            var y = ie;
            y.unhandleds = [], y.onunhandled = d, y.finalize = Ht(function() {
              var g, E = this;
              g = function() {
                E.unhandleds.length === 0 ? l() : d(E.unhandleds[0]);
              }, Wn.push(function R() {
                g(), Wn.splice(Wn.indexOf(R), 1);
              }), ++Zt, Bn(function() {
                --Zt == 0 && io();
              }, []);
            }, y.finalize), n();
          }, i, a, c);
        });
      } }), Vt && (Vt.allSettled && P(W, "allSettled", function() {
        var n = G.apply(null, arguments).map(er);
        return new W(function(i) {
          n.length === 0 && i([]);
          var a = n.length, c = new Array(a);
          n.forEach(function(l, d) {
            return W.resolve(l).then(function(y) {
              return c[d] = { status: "fulfilled", value: y };
            }, function(y) {
              return c[d] = { status: "rejected", reason: y };
            }).then(function() {
              return --a || i(c);
            });
          });
        });
      }), Vt.any && typeof AggregateError < "u" && P(W, "any", function() {
        var n = G.apply(null, arguments).map(er);
        return new W(function(i, a) {
          n.length === 0 && a(new AggregateError([]));
          var c = n.length, l = new Array(c);
          n.forEach(function(d, y) {
            return W.resolve(d).then(function(g) {
              return i(g);
            }, function(g) {
              l[y] = g, --c || a(new AggregateError(l));
            });
          });
        });
      }), Vt.withResolvers) && (W.withResolvers = Vt.withResolvers);
      var Ke = { awaits: 0, echoes: 0, id: 0 }, fu = 0, Xn = [], Jn = 0, Qn = 0, du = 0;
      function Bt(n, y, a, c) {
        var l = ie, d = Object.create(l), y = (d.parent = l, d.ref = 0, d.global = !1, d.id = ++du, gt.env, d.env = Qr ? { Promise: W, PromiseProp: { value: W, configurable: !0, writable: !0 }, all: W.all, race: W.race, allSettled: W.allSettled, any: W.any, resolve: W.resolve, reject: W.reject } : {}, y && h(d, y), ++l.ref, d.finalize = function() {
          --this.parent.ref || this.parent.finalize();
        }, Gt(d, n, a, c));
        return d.ref === 0 && d.finalize(), y;
      }
      function ln() {
        return Ke.id || (Ke.id = ++fu), ++Ke.awaits, Ke.echoes += zi, Ke.id;
      }
      function Rt() {
        return !!Ke.awaits && (--Ke.awaits == 0 && (Ke.id = 0), Ke.echoes = Ke.awaits * zi, !0);
      }
      function er(n) {
        return Ke.echoes && n && n.constructor === Vt ? (ln(), n.then(function(i) {
          return Rt(), i;
        }, function(i) {
          return Rt(), qe(i);
        })) : n;
      }
      function hu() {
        var n = Xn[Xn.length - 1];
        Xn.pop(), Ot(n, !1);
      }
      function Ot(n, i) {
        var a, c, l = ie;
        (i ? !Ke.echoes || Jn++ && n === ie : !Jn || --Jn && n === ie) || queueMicrotask(i ? (function(d) {
          ++Qn, Ke.echoes && --Ke.echoes != 0 || (Ke.echoes = Ke.awaits = Ke.id = 0), Xn.push(ie), Ot(d, !0);
        }).bind(null, n) : hu), n !== ie && (ie = n, l === gt && (gt.env = Wi()), Qr) && (a = gt.env.Promise, c = n.env, l.global || n.global) && (Object.defineProperty(u, "Promise", c.PromiseProp), a.all = c.all, a.race = c.race, a.resolve = c.resolve, a.reject = c.reject, c.allSettled && (a.allSettled = c.allSettled), c.any) && (a.any = c.any);
      }
      function Wi() {
        var n = u.Promise;
        return Qr ? { Promise: n, PromiseProp: Object.getOwnPropertyDescriptor(u, "Promise"), all: n.all, race: n.race, allSettled: n.allSettled, any: n.any, resolve: n.resolve, reject: n.reject } : {};
      }
      function Gt(n, i, a, c, l) {
        var d = ie;
        try {
          return Ot(n, !0), i(a, c, l);
        } finally {
          Ot(d, !1);
        }
      }
      function Yi(n, i, a, c) {
        return typeof n != "function" ? n : function() {
          var l = ie;
          a && ln(), Ot(i, !0);
          try {
            return n.apply(this, arguments);
          } finally {
            Ot(l, !1), c && queueMicrotask(Rt);
          }
        };
      }
      function so(n) {
        Promise === Vt && Ke.echoes === 0 ? Jn === 0 ? n() : enqueueNativeMicroTask(n) : setTimeout(n, 0);
      }
      ("" + pn).indexOf("[native code]") === -1 && (ln = Rt = _e);
      var qe = W.reject, Wt = "￿", mt = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.", Xi = "String expected.", tr = "__dbnames", ao = "readonly", co = "readwrite";
      function Yt(n, i) {
        return n ? i ? function() {
          return n.apply(this, arguments) && i.apply(this, arguments);
        } : n : i;
      }
      var Ji = { type: 3, lower: -1 / 0, lowerOpen: !1, upper: [[]], upperOpen: !1 };
      function nr(n) {
        return typeof n != "string" || /\./.test(n) ? function(i) {
          return i;
        } : function(i) {
          return i[n] === void 0 && n in i && delete (i = U(i))[n], i;
        };
      }
      function Qi() {
        throw X.Type("Entity instances must never be new:ed. Instances are generated by the framework bypassing the constructor.");
      }
      function ge(n, i) {
        try {
          var a = es(n), c = es(i);
          if (a !== c) return a === "Array" ? 1 : c === "Array" ? -1 : a === "binary" ? 1 : c === "binary" ? -1 : a === "string" ? 1 : c === "string" ? -1 : a === "Date" ? 1 : c !== "Date" ? NaN : -1;
          switch (a) {
            case "number":
            case "Date":
            case "string":
              return i < n ? 1 : n < i ? -1 : 0;
            case "binary":
              for (var l = ts(n), d = ts(i), y = l.length, g = d.length, E = y < g ? y : g, R = 0; R < E; ++R) if (l[R] !== d[R]) return l[R] < d[R] ? -1 : 1;
              return y === g ? 0 : y < g ? -1 : 1;
            case "Array":
              for (var x = n, b = i, _ = x.length, B = b.length, A = _ < B ? _ : B, k = 0; k < A; ++k) {
                var S = ge(x[k], b[k]);
                if (S !== 0) return S;
              }
              return _ === B ? 0 : _ < B ? -1 : 1;
          }
        } catch {
        }
        return NaN;
      }
      function es(n) {
        var i = typeof n;
        return i == "object" && (ArrayBuffer.isView(n) || (i = D(n)) === "ArrayBuffer") ? "binary" : i;
      }
      function ts(n) {
        return n instanceof Uint8Array ? n : ArrayBuffer.isView(n) ? new Uint8Array(n.buffer, n.byteOffset, n.byteLength) : new Uint8Array(n);
      }
      function rr(n, i, a) {
        var c = n.schema.yProps;
        return c ? (i && 0 < a.numFailures && (i = i.filter(function(l, d) {
          return !a.failures[d];
        })), Promise.all(c.map(function(l) {
          return l = l.updatesTable, i ? n.db.table(l).where("k").anyOf(i).delete() : n.db.table(l).clear();
        })).then(function() {
          return a;
        })) : a;
      }
      ns.prototype.execute = function(n) {
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
      var On = ns;
      function ns(n) {
        this["@@propmod"] = n;
      }
      function rs(n, i) {
        for (var a = f(i), c = a.length, l = !1, d = 0; d < c; ++d) {
          var y = a[d], g = i[y], E = de(n, y);
          g instanceof On ? (me(n, y, g.execute(E)), l = !0) : E !== g && (me(n, y, g), l = !0);
        }
        return l;
      }
      Se.prototype._trans = function(n, i, a) {
        var c = this._tx || ie.trans, l = this.name, d = ct && typeof console < "u" && console.createTask && console.createTask("Dexie: ".concat(n === "readonly" ? "read" : "write", " ").concat(this.name));
        function y(R, x, b) {
          if (b.schema[l]) return i(b.idbtrans, b);
          throw new X.NotFound("Table " + l + " not part of transaction");
        }
        var g = cn();
        try {
          var E = c && c.db._novip === this.db._novip ? c === ie.trans ? c._promise(n, y, a) : Bt(function() {
            return c._promise(n, y, a);
          }, { trans: c, transless: ie.transless || ie }) : (function R(x, b, _, B) {
            if (x.idbdb && (x._state.openComplete || ie.letThrough || x._vip)) {
              var A = x._createTransaction(b, _, x._dbSchema);
              try {
                A.create(), x._state.PR1398_maxLoop = 3;
              } catch (k) {
                return k.name === We.InvalidState && x.isOpen() && 0 < --x._state.PR1398_maxLoop ? (console.warn("Dexie: Need to reopen db"), x.close({ disableAutoOpen: !1 }), x.open().then(function() {
                  return R(x, b, _, B);
                })) : qe(k);
              }
              return A._promise(b, function(k, S) {
                return Bt(function() {
                  return ie.trans = A, B(k, S, A);
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
              return R(x, b, _, B);
            });
          })(this.db, n, [this.name], y);
          return d && (E._consoleTask = d, E = E.catch(function(R) {
            return console.trace(R), qe(R);
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
          if (g.compound && i.every(function(R) {
            return 0 <= g.keyPath.indexOf(R);
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
          return ge(g, E) === 0;
        }
        var y = i.reduce(function(x, E) {
          var R = x[0], x = x[1], b = c[E], _ = n[E];
          return [R || b, R || !b ? Yt(x, b && b.multi ? function(B) {
            return B = de(B, E), p(B) && B.some(function(A) {
              return l(_, A);
            });
          } : function(B) {
            return l(_, de(B, E));
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
        for (var i = this.db, a = this.name, c = ((this.schema.mappedClass = n).prototype instanceof Qi && (n = ((y) => {
          var g = x, E = y;
          if (typeof E != "function" && E !== null) throw new TypeError("Class extends value " + String(E) + " is not a constructor or null");
          function R() {
            this.constructor = g;
          }
          function x() {
            return y !== null && y.apply(this, arguments) || this;
          }
          return r(g, E), g.prototype = E === null ? Object.create(E) : (R.prototype = E.prototype, new R()), Object.defineProperty(x.prototype, "db", { get: function() {
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
        return d && l && (y = nr(d)(n)), this._trans("readwrite", function(g) {
          return a.core.mutate({ trans: g, type: "add", keys: i != null ? [i] : null, values: [y] });
        }).then(function(g) {
          return g.numFailures ? W.reject(g.failures[0]) : g.lastResult;
        }).then(function(g) {
          if (d) try {
            me(n, d, g);
          } catch {
          }
          return g;
        });
      }, Se.prototype.upsert = function(n, i) {
        var a = this, c = this.schema.primKey.keyPath;
        return this._trans("readwrite", function(l) {
          return a.core.get({ trans: l, key: n }).then(function(d) {
            var y = d ?? {};
            return rs(y, i), c && me(y, c, n), a.core.mutate({ trans: l, type: "put", values: [y], keys: [n], upsert: !0, updates: { keys: [n], changeSpecs: [i] } }).then(function(g) {
              return g.numFailures ? W.reject(g.failures[0]) : !!d;
            });
          });
        });
      }, Se.prototype.update = function(n, i) {
        return typeof n != "object" || p(n) ? this.where(":id").equals(n).modify(i) : (n = de(n, this.schema.primKey.keyPath)) === void 0 ? qe(new X.InvalidArgument("Given object does not contain its primary key")) : this.where(":id").equals(n).modify(i);
      }, Se.prototype.put = function(n, i) {
        var a = this, c = this.schema.primKey, l = c.auto, d = c.keyPath, y = n;
        return d && l && (y = nr(d)(n)), this._trans("readwrite", function(g) {
          return a.core.mutate({ trans: g, type: "put", values: [y], keys: i != null ? [i] : null });
        }).then(function(g) {
          return g.numFailures ? W.reject(g.failures[0]) : g.lastResult;
        }).then(function(g) {
          if (d) try {
            me(n, d, g);
          } catch {
          }
          return g;
        });
      }, Se.prototype.delete = function(n) {
        var i = this;
        return this._trans("readwrite", function(a) {
          return i.core.mutate({ trans: a, type: "delete", keys: [n] }).then(function(c) {
            return rr(i, [n], c);
          }).then(function(c) {
            return c.numFailures ? W.reject(c.failures[0]) : void 0;
          });
        });
      }, Se.prototype.clear = function() {
        var n = this;
        return this._trans("readwrite", function(i) {
          return n.core.mutate({ trans: i, type: "deleteRange", range: Ji }).then(function(a) {
            return rr(n, null, a);
          });
        }).then(function(i) {
          return i.numFailures ? W.reject(i.failures[0]) : void 0;
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
          var g = c.schema.primKey, R = g.auto, g = g.keyPath;
          if (g && l) throw new X.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
          if (l && l.length !== n.length) throw new X.InvalidArgument("Arguments objects and keys must have the same length");
          var E = n.length, R = g && R ? n.map(nr(g)) : n;
          return c.core.mutate({ trans: y, type: "add", keys: l, values: R, wantResults: d }).then(function(x) {
            var b = x.numFailures, _ = x.failures;
            if (b === 0) return d ? x.results : x.lastResult;
            throw new Te("".concat(c.name, ".bulkAdd(): ").concat(b, " of ").concat(E, " operations failed"), _);
          });
        });
      }, Se.prototype.bulkPut = function(n, i, a) {
        var c = this, l = Array.isArray(i) ? i : void 0, d = (a = a || (l ? void 0 : i)) ? a.allKeys : void 0;
        return this._trans("readwrite", function(y) {
          var g = c.schema.primKey, R = g.auto, g = g.keyPath;
          if (g && l) throw new X.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
          if (l && l.length !== n.length) throw new X.InvalidArgument("Arguments objects and keys must have the same length");
          var E = n.length, R = g && R ? n.map(nr(g)) : n;
          return c.core.mutate({ trans: y, type: "put", keys: l, values: R, wantResults: d }).then(function(x) {
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
            var E = [], R = [], x = (n.forEach(function(b, _) {
              var B = b.key, A = b.changes, k = g[_];
              if (k) {
                for (var S = 0, I = Object.keys(A); S < I.length; S++) {
                  var O = I[S], C = A[O];
                  if (O === i.schema.primKey.keyPath) {
                    if (ge(C, B) !== 0) throw new X.Constraint("Cannot update primary key in bulkUpdate()");
                  } else me(k, O, C);
                }
                d.push(_), E.push(B), R.push(k);
              }
            }), E.length);
            return a.mutate({ trans: y, type: "put", keys: E, values: R, updates: { keys: c, changeSpecs: l } }).then(function(b) {
              var _ = b.numFailures, B = b.failures;
              if (_ === 0) return x;
              for (var A = 0, k = Object.keys(B); A < k.length; A++) {
                var S, I = k[A], O = d[Number(I)];
                O != null && (S = B[I], delete B[I], B[O] = S);
              }
              throw new Te("".concat(i.name, ".bulkUpdate(): ").concat(_, " of ").concat(x, " operations failed"), B);
            });
          });
        });
      }, Se.prototype.bulkDelete = function(n) {
        var i = this, a = n.length;
        return this._trans("readwrite", function(c) {
          return i.core.mutate({ trans: c, type: "delete", keys: n }).then(function(l) {
            return rr(i, n, l);
          });
        }).then(function(c) {
          var l = c.numFailures, d = c.failures;
          if (l === 0) return c.lastResult;
          throw new Te("".concat(i.name, ".bulkDelete(): ").concat(l, " of ").concat(a, " operations failed"), d);
        });
      };
      var os = Se;
      function Se() {
      }
      function In(n) {
        function i(y, g) {
          if (g) {
            for (var E = arguments.length, R = new Array(E - 1); --E; ) R[E - 1] = arguments[E];
            return a[y].subscribe.apply(null, R), n;
          }
          if (typeof y == "string") return a[y];
        }
        var a = {};
        i.addEventType = d;
        for (var c = 1, l = arguments.length; c < l; ++c) d(arguments[c]);
        return i;
        function d(y, g, E) {
          var R, x;
          if (typeof y != "object") return g = g || cu, x = { subscribers: [], fire: E = E || _e, subscribe: function(b) {
            x.subscribers.indexOf(b) === -1 && (x.subscribers.push(b), x.fire = g(x.fire, b));
          }, unsubscribe: function(b) {
            x.subscribers = x.subscribers.filter(function(_) {
              return _ !== b;
            }), x.fire = x.subscribers.reduce(g, E);
          } }, a[y] = i[y] = x;
          f(R = y).forEach(function(b) {
            var _ = R[b];
            if (p(_)) d(b, R[b][0], R[b][1]);
            else {
              if (_ !== "asap") throw new X.InvalidArgument("Invalid event config");
              var B = d(b, St, function() {
                for (var A = arguments.length, k = new Array(A); A--; ) k[A] = arguments[A];
                B.subscribers.forEach(function(S) {
                  Me(function() {
                    S.apply(null, k);
                  });
                });
              });
            }
          });
        }
      }
      function Tn(n, i) {
        return q(i).from({ prototype: n }), i;
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
      function or(n, i) {
        if (n.isPrimKey) return i.primaryKey;
        var a = i.getIndexByKeyPath(n.index);
        if (a) return a;
        throw new X.Schema("KeyPath " + n.index + " on object store " + i.name + " is not indexed");
      }
      function is(n, i, a) {
        var c = or(n, i.schema);
        return i.openCursor({ trans: a, values: !n.keysOnly, reverse: n.dir === "prev", unique: !!n.unique, query: { index: c, range: n.range } });
      }
      function ir(n, i, a, c) {
        var l, d, y = n.replayFilter ? Yt(n.filter, n.replayFilter()) : n.filter;
        return n.or ? (l = {}, d = function(g, E, R) {
          var x, b;
          y && !y(E, R, function(_) {
            return E.stop(_);
          }, function(_) {
            return E.fail(_);
          }) || ((b = "" + (x = E.primaryKey)) == "[object ArrayBuffer]" && (b = "" + new Uint8Array(x)), w(l, b)) || (l[b] = !0, i(g, E, R));
        }, Promise.all([n.or._iterate(d, a), ss(is(n, c, a), n.algorithm, d, !n.keysOnly && n.valueMapper)])) : ss(is(n, c, a), Yt(n.algorithm, y), i, !n.keysOnly && n.valueMapper);
      }
      function ss(n, i, a, c) {
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
        return ir(this._ctx, n, i, this._ctx.table.core);
      }, we.prototype.clone = function(n) {
        var i = Object.create(this.constructor.prototype), a = Object.create(this._ctx);
        return n && h(a, n), i._ctx = a, i;
      }, we.prototype.raw = function() {
        return this._ctx.valueMapper = null, this;
      }, we.prototype.each = function(n) {
        var i = this._ctx;
        return this._read(function(a) {
          return ir(i, n, a, i.table.core);
        });
      }, we.prototype.count = function(n) {
        var i = this;
        return this._read(function(a) {
          var c, l = i._ctx, d = l.table.core;
          return fn(l, !0) ? d.count({ trans: a, query: { index: or(l, d.schema), range: l.range } }).then(function(y) {
            return Math.min(y, l.limit);
          }) : (c = 0, ir(l, function() {
            return ++c, !1;
          }, a, d).then(function() {
            return c;
          }));
        }).then(n);
      }, we.prototype.sortBy = function(n, i) {
        var a = n.split(".").reverse(), c = a[0], l = a.length - 1;
        function d(E, R) {
          return R ? d(E[a[R]], R - 1) : E[c];
        }
        var y = this._ctx.dir === "next" ? 1 : -1;
        function g(E, R) {
          return ge(d(E, l), d(R, l)) * y;
        }
        return this.toArray(function(E) {
          return E.sort(g);
        }).then(i);
      }, we.prototype.toArray = function(n) {
        var i = this;
        return this._read(function(a) {
          var c, l, d, y = i._ctx;
          return fn(y, !0) && 0 < y.limit ? (c = y.valueMapper, l = or(y, y.table.core.schema), y.table.core.query({ trans: a, limit: y.limit, values: !0, direction: y.dir === "prev" ? "prev" : void 0, query: { index: l, range: y.range } }).then(function(g) {
            return g = g.result, c ? g.map(c) : g;
          })) : (d = [], ir(y, function(g) {
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
          var l = or(i, i.table.core.schema);
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
              var $ = C[O];
              b.push(I[$]);
            }
          }
          var d = typeof n == "function" ? n : function(k) {
            return rs(k, n);
          }, y = a.table.core, x = y.schema.primaryKey, g = x.outbound, E = x.extractKey, R = 200, x = i.db._options.modifyChunkSize, b = (x && (R = typeof x == "object" ? x[y.name] || x["*"] || 200 : x), []), _ = 0, B = [], A = n === as;
          return i.clone().primaryKeys().then(function(k) {
            function S(O) {
              var C = Math.min(R, k.length - O), $ = k.slice(O, O + C);
              return (A ? Promise.resolve([]) : y.getMany({ trans: c, keys: $, cache: "immutable" })).then(function(M) {
                var z = [], F = [], te = g ? [] : null, V = A ? $ : [];
                if (!A) for (var re = 0; re < C; ++re) {
                  var K = M[re], ae = { value: U(K), primKey: k[O + re] };
                  d.call(ae, ae.value, ae) !== !1 && (ae.value == null ? V.push(k[O + re]) : g || ge(E(K), E(ae.value)) === 0 ? (F.push(ae.value), g && te.push(k[O + re])) : (V.push(k[O + re]), z.push(ae.value)));
                }
                return Promise.resolve(0 < z.length && y.mutate({ trans: c, type: "add", values: z }).then(function(ce) {
                  for (var fe in ce.failures) V.splice(parseInt(fe), 1);
                  l(z.length, ce);
                })).then(function() {
                  return (0 < F.length || I && typeof n == "object") && y.mutate({ trans: c, type: "put", keys: te, values: F, criteria: I, changeSpec: typeof n != "function" && n, isAdditionalChunk: 0 < O }).then(function(ce) {
                    return l(F.length, ce);
                  });
                }).then(function() {
                  return (0 < V.length || I && A) && y.mutate({ trans: c, type: "delete", keys: V, criteria: I, isAdditionalChunk: 0 < O }).then(function(ce) {
                    return rr(a.table, V, ce);
                  }).then(function(ce) {
                    return l(V.length, ce);
                  });
                }).then(function() {
                  return k.length > O + C && S(O + R);
                });
              });
            }
            var I = fn(a) && a.limit === 1 / 0 && (typeof n != "function" || A) && { index: a.index, range: a.range };
            return S(0).then(function() {
              if (0 < b.length) throw new xe("Error modifying one or more objects", b, _, B);
              return k.length;
            });
          });
        });
      }, we.prototype.delete = function() {
        var n = this._ctx, i = n.range;
        return !fn(n) || n.table.schema.yProps || !n.isPrimKey && i.type !== 3 ? this.modify(as) : this._write(function(a) {
          var c = n.table.core.schema.primaryKey, l = i;
          return n.table.core.count({ trans: a, query: { index: c, range: l } }).then(function(d) {
            return n.table.core.mutate({ trans: a, type: "deleteRange", range: l }).then(function(E) {
              var g = E.failures, E = E.numFailures;
              if (E) throw new xe("Could not delete some values", Object.keys(g).map(function(R) {
                return g[R];
              }), d - E);
              return d - E;
            });
          });
        });
      };
      var pu = we;
      function we() {
      }
      var as = function(n, i) {
        return i.value = null;
      };
      function yu(n, i) {
        return n < i ? -1 : n === i ? 0 : 1;
      }
      function gu(n, i) {
        return i < n ? -1 : n === i ? 0 : 1;
      }
      function tt(n, i, a) {
        return n = n instanceof us ? new n.Collection(n) : n, n._ctx.error = new (a || TypeError)(i), n;
      }
      function dn(n) {
        return new n.Collection(n, function() {
          return cs("");
        }).limit(0);
      }
      function sr(B, i, a, c) {
        var l, d, y, g, E, R, x, b = a.length;
        if (!a.every(function(k) {
          return typeof k == "string";
        })) return tt(B, Xi);
        function _(k) {
          l = k === "next" ? function(I) {
            return I.toUpperCase();
          } : function(I) {
            return I.toLowerCase();
          }, d = k === "next" ? function(I) {
            return I.toLowerCase();
          } : function(I) {
            return I.toUpperCase();
          }, y = k === "next" ? yu : gu;
          var S = a.map(function(I) {
            return { lower: d(I), upper: l(I) };
          }).sort(function(I, O) {
            return y(I.lower, O.lower);
          });
          g = S.map(function(I) {
            return I.upper;
          }), E = S.map(function(I) {
            return I.lower;
          }), x = (R = k) === "next" ? "" : c;
        }
        _("next");
        var B = new B.Collection(B, function() {
          return It(g[0], E[b - 1] + c);
        }), A = (B._ondirectionchange = function(k) {
          _(k);
        }, 0);
        return B._addAlgorithm(function(k, S, I) {
          var O = k.key;
          if (typeof O == "string") {
            var C = d(O);
            if (i(C, E, A)) return !0;
            for (var $ = null, M = A; M < b; ++M) {
              var z = ((F, te, V, re, K, ae) => {
                for (var ce = Math.min(F.length, re.length), fe = -1, pe = 0; pe < ce; ++pe) {
                  var nt = te[pe];
                  if (nt !== re[pe]) return K(F[pe], V[pe]) < 0 ? F.substr(0, pe) + V[pe] + V.substr(pe + 1) : K(F[pe], re[pe]) < 0 ? F.substr(0, pe) + re[pe] + V.substr(pe + 1) : 0 <= fe ? F.substr(0, fe) + te[fe] + V.substr(fe + 1) : null;
                  K(F[pe], nt) < 0 && (fe = pe);
                }
                return ce < re.length && ae === "next" ? F + V.substr(F.length) : ce < F.length && ae === "prev" ? F.substr(0, V.length) : fe < 0 ? null : F.substr(0, fe) + re[fe] + V.substr(fe + 1);
              })(O, C, g[M], E[M], y, R);
              z === null && $ === null ? A = M + 1 : ($ === null || 0 < y($, z)) && ($ = z);
            }
            S($ !== null ? function() {
              k.continue($ + x);
            } : I);
          }
          return !1;
        }), B;
      }
      function It(n, i, a, c) {
        return { type: 2, lower: n, upper: i, lowerOpen: a, upperOpen: c };
      }
      function cs(n) {
        return { type: 1, lower: n, upper: n };
      }
      Object.defineProperty(Ue.prototype, "Collection", { get: function() {
        return this._ctx.table.db.Collection;
      }, enumerable: !1, configurable: !0 }), Ue.prototype.between = function(n, i, a, c) {
        a = a !== !1, c = c === !0;
        try {
          return 0 < this._cmp(n, i) || this._cmp(n, i) === 0 && (a || c) && (!a || !c) ? dn(this) : new this.Collection(this, function() {
            return It(n, i, !a, !c);
          });
        } catch {
          return tt(this, mt);
        }
      }, Ue.prototype.equals = function(n) {
        return n == null ? tt(this, mt) : new this.Collection(this, function() {
          return cs(n);
        });
      }, Ue.prototype.above = function(n) {
        return n == null ? tt(this, mt) : new this.Collection(this, function() {
          return It(n, void 0, !0);
        });
      }, Ue.prototype.aboveOrEqual = function(n) {
        return n == null ? tt(this, mt) : new this.Collection(this, function() {
          return It(n, void 0, !1);
        });
      }, Ue.prototype.below = function(n) {
        return n == null ? tt(this, mt) : new this.Collection(this, function() {
          return It(void 0, n, !1, !0);
        });
      }, Ue.prototype.belowOrEqual = function(n) {
        return n == null ? tt(this, mt) : new this.Collection(this, function() {
          return It(void 0, n);
        });
      }, Ue.prototype.startsWith = function(n) {
        return typeof n != "string" ? tt(this, Xi) : this.between(n, n + Wt, !0, !0);
      }, Ue.prototype.startsWithIgnoreCase = function(n) {
        return n === "" ? this.startsWith(n) : sr(this, function(i, a) {
          return i.indexOf(a[0]) === 0;
        }, [n], Wt);
      }, Ue.prototype.equalsIgnoreCase = function(n) {
        return sr(this, function(i, a) {
          return i === a[0];
        }, [n], "");
      }, Ue.prototype.anyOfIgnoreCase = function() {
        var n = G.apply(Q, arguments);
        return n.length === 0 ? dn(this) : sr(this, function(i, a) {
          return a.indexOf(i) !== -1;
        }, n, "");
      }, Ue.prototype.startsWithAnyOfIgnoreCase = function() {
        var n = G.apply(Q, arguments);
        return n.length === 0 ? dn(this) : sr(this, function(i, a) {
          return a.some(function(c) {
            return i.indexOf(c) === 0;
          });
        }, n, Wt);
      }, Ue.prototype.anyOf = function() {
        var n, i, a = this, c = G.apply(Q, arguments), l = this._cmp;
        try {
          c.sort(l);
        } catch {
          return tt(this, mt);
        }
        return c.length === 0 ? dn(this) : ((n = new this.Collection(this, function() {
          return It(c[0], c[c.length - 1]);
        }))._ondirectionchange = function(d) {
          l = d === "next" ? a._ascending : a._descending, c.sort(l);
        }, i = 0, n._addAlgorithm(function(d, y, g) {
          for (var E = d.key; 0 < l(E, c[i]); ) if (++i === c.length) return y(g), !1;
          return l(E, c[i]) === 0 || (y(function() {
            d.continue(c[i]);
          }), !1);
        }), n);
      }, Ue.prototype.notEqual = function(n) {
        return this.inAnyRange([[-1 / 0, n], [n, this.db._maxKey]], { includeLowers: !1, includeUppers: !1 });
      }, Ue.prototype.noneOf = function() {
        var n = G.apply(Q, arguments);
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
      }, Ue.prototype.inAnyRange = function(n, I) {
        var a = this, c = this._cmp, l = this._ascending, d = this._descending, y = this._min, g = this._max;
        if (n.length === 0) return dn(this);
        if (!n.every(function(O) {
          return O[0] !== void 0 && O[1] !== void 0 && l(O[0], O[1]) <= 0;
        })) return tt(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", X.InvalidArgument);
        var E = !I || I.includeLowers !== !1, R = I && I.includeUppers === !0, x, b = l;
        function _(O, C) {
          return b(O[0], C[0]);
        }
        try {
          (x = n.reduce(function(O, C) {
            for (var $ = 0, M = O.length; $ < M; ++$) {
              var z = O[$];
              if (c(C[0], z[1]) < 0 && 0 < c(C[1], z[0])) {
                z[0] = y(z[0], C[0]), z[1] = g(z[1], C[1]);
                break;
              }
            }
            return $ === M && O.push(C), O;
          }, [])).sort(_);
        } catch {
          return tt(this, mt);
        }
        var B = 0, A = R ? function(O) {
          return 0 < l(O, x[B][1]);
        } : function(O) {
          return 0 <= l(O, x[B][1]);
        }, k = E ? function(O) {
          return 0 < d(O, x[B][0]);
        } : function(O) {
          return 0 <= d(O, x[B][0]);
        }, S = A, I = new this.Collection(this, function() {
          return It(x[0][0], x[x.length - 1][1], !E, !R);
        });
        return I._ondirectionchange = function(O) {
          b = O === "next" ? (S = A, l) : (S = k, d), x.sort(_);
        }, I._addAlgorithm(function(O, C, $) {
          for (var M, z = O.key; S(z); ) if (++B === x.length) return C($), !1;
          return !A(M = z) && !k(M) || (a._cmp(z, x[B][1]) === 0 || a._cmp(z, x[B][0]) === 0 || C(function() {
            b === l ? O.continue(x[B][0]) : O.continue(x[B][1]);
          }), !1);
        }), I;
      }, Ue.prototype.startsWithAnyOf = function() {
        var n = G.apply(Q, arguments);
        return n.every(function(i) {
          return typeof i == "string";
        }) ? n.length === 0 ? dn(this) : this.inAnyRange(n.map(function(i) {
          return [i, i + Wt];
        })) : tt(this, "startsWithAnyOf() only works with strings");
      };
      var us = Ue;
      function Ue() {
      }
      function st(n) {
        return Le(function(i) {
          return Cn(i), n(i.target.error), !1;
        });
      }
      function Cn(n) {
        n.stopPropagation && n.stopPropagation(), n.preventDefault && n.preventDefault();
      }
      var Ln = "storagemutated", fo = "x-storagemutated-1", Tt = In(null, Ln), mu = (ut.prototype._lock = function() {
        return ve(!ie.global), ++this._reculock, this._reculock !== 1 || ie.global || (ie.lockOwnerFor = this), this;
      }, ut.prototype._unlock = function() {
        if (ve(!ie.global), --this._reculock == 0) for (ie.global || (ie.lockOwnerFor = null); 0 < this._blockedFuncs.length && !this._locked(); ) {
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
          if (ve(!this.idbtrans), !n && !a) switch (c && c.name) {
            case "DatabaseClosedError":
              throw new X.DatabaseClosed(c);
            case "MissingAPIError":
              throw new X.MissingAPI(c.message, c);
            default:
              throw new X.OpenFailed(c);
          }
          if (!this.active) throw new X.TransactionInactive();
          ve(this._completion._state === null), (n = this.idbtrans = n || (this.db.core || a).transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability })).onerror = Le(function(l) {
            Cn(l), i._reject(n.error);
          }), n.onabort = Le(function(l) {
            Cn(l), i.active && i._reject(new X.Abort(n.error)), i.active = !1, i.on("abort").fire(l);
          }), n.oncomplete = Le(function() {
            i.active = !1, i._resolve(), "mutatedParts" in n && Tt.storagemutated.fire(n.mutatedParts);
          });
        }
        return this;
      }, ut.prototype._promise = function(n, i, a) {
        var c, l = this;
        return n === "readwrite" && this.mode !== "readwrite" ? qe(new X.ReadOnly("Transaction is readonly")) : this.active ? this._locked() ? new W(function(d, y) {
          l._blockedFuncs.push([function() {
            l._promise(n, i, a).then(d, y);
          }, ie]);
        }) : a ? Bt(function() {
          var d = new W(function(y, g) {
            l._lock();
            var E = i(y, g, l);
            E && E.then && E.then(y, g);
          });
          return d.finally(function() {
            return l._unlock();
          }), d._lib = !0, d;
        }) : ((c = new W(function(d, y) {
          var g = i(d, y, l);
          g && g.then && g.then(d, y);
        }))._lib = !0, c) : qe(new X.TransactionInactive());
      }, ut.prototype._root = function() {
        return this.parent ? this.parent._root() : this;
      }, ut.prototype.waitFor = function(n) {
        var i, a = this._root(), c = W.resolve(n), l = (a._waitingFor ? a._waitingFor = a._waitingFor.then(function() {
          return c;
        }) : (a._waitingFor = c, a._waitingQueue = [], i = a.idbtrans.objectStore(a.storeNames[0]), (function d() {
          for (++a._spinCount; a._waitingQueue.length; ) a._waitingQueue.shift()();
          a._waitingFor && (i.get(-1 / 0).onsuccess = d);
        })()), a._waitingFor);
        return new W(function(d, y) {
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
        return { name: n, keyPath: i, unique: a, multi: c, auto: l, compound: d, src: (a && !y ? "&" : "") + (c ? "*" : "") + (l ? "++" : "") + ls(i), type: g };
      }
      function ls(n) {
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
      function fs(n) {
        return [].slice.call(n);
      }
      var vu = 0;
      function Pn(n) {
        return n == null ? ":id" : typeof n == "string" ? n : "[".concat(n.join("+"), "]");
      }
      function wu(n, i, y) {
        function c(S) {
          if (S.type === 3) return null;
          if (S.type === 4) throw new Error("Cannot convert never type to IDBKeyRange");
          var B = S.lower, A = S.upper, k = S.lowerOpen, S = S.upperOpen;
          return B === void 0 ? A === void 0 ? null : i.upperBound(A, !!S) : A === void 0 ? i.lowerBound(B, !!k) : i.bound(B, A, !!k, !!S);
        }
        function l(_) {
          var B, A, k = _.name;
          return { name: k, schema: _, mutate: function(S) {
            var I = S.trans, O = S.type, C = S.keys, $ = S.values, M = S.range;
            return new Promise(function(z, F) {
              z = Le(z);
              var te = I.objectStore(k), V = te.keyPath == null, re = O === "put" || O === "add";
              if (!re && O !== "delete" && O !== "deleteRange") throw new Error("Invalid operation type: " + O);
              var K, ae = (C || $ || { length: 1 }).length;
              if (C && $ && C.length !== $.length) throw new Error("Given keys array must have same length as given values array.");
              if (ae === 0) return z({ numFailures: 0, failures: {}, results: [], lastResult: void 0 });
              function ce(Ze) {
                ++nt, Cn(Ze);
              }
              var fe = [], pe = [], nt = 0;
              if (O === "deleteRange") {
                if (M.type === 4) return z({ numFailures: nt, failures: pe, results: [], lastResult: void 0 });
                M.type === 3 ? fe.push(K = te.clear()) : fe.push(K = te.delete(c(M)));
              } else {
                var V = re ? V ? [$, C] : [$, null] : [C, null], le = V[0], Fe = V[1];
                if (re) for (var He = 0; He < ae; ++He) fe.push(K = Fe && Fe[He] !== void 0 ? te[O](le[He], Fe[He]) : te[O](le[He])), K.onerror = ce;
                else for (He = 0; He < ae; ++He) fe.push(K = te[O](le[He])), K.onerror = ce;
              }
              function vr(Ze) {
                Ze = Ze.target.result, fe.forEach(function(Qt, Lo) {
                  return Qt.error != null && (pe[Lo] = Qt.error);
                }), z({ numFailures: nt, failures: pe, results: O === "delete" ? C : fe.map(function(Qt) {
                  return Qt.result;
                }), lastResult: Ze });
              }
              K.onerror = function(Ze) {
                ce(Ze), vr(Ze);
              }, K.onsuccess = vr;
            });
          }, getMany: function(S) {
            var I = S.trans, O = S.keys;
            return new Promise(function(C, $) {
              C = Le(C);
              for (var M, z = I.objectStore(k), F = O.length, te = new Array(F), V = 0, re = 0, K = function(fe) {
                fe = fe.target, te[fe._pos] = fe.result, ++re === V && C(te);
              }, ae = st($), ce = 0; ce < F; ++ce) O[ce] != null && ((M = z.get(O[ce]))._pos = ce, M.onsuccess = K, M.onerror = ae, ++V);
              V === 0 && C(te);
            });
          }, get: function(S) {
            var I = S.trans, O = S.key;
            return new Promise(function(C, $) {
              C = Le(C);
              var M = I.objectStore(k).get(O);
              M.onsuccess = function(z) {
                return C(z.target.result);
              }, M.onerror = st($);
            });
          }, query: (B = E, A = R, function(S) {
            return new Promise(function(I, O) {
              I = Le(I);
              var C, $, M, z, ae = S.trans, F = S.values, te = S.limit, K = S.query, V = (V = S.direction) != null ? V : "next", re = te === 1 / 0 ? void 0 : te, ce = K.index, K = K.range, ae = ae.objectStore(k), ae = ce.isPrimaryKey ? ae : ae.index(ce.name), ce = c(K);
              if (te === 0) return I({ result: [] });
              A ? (K = { query: ce, count: re, direction: V }, (C = F ? ae.getAll(K) : ae.getAllKeys(K)).onsuccess = function(fe) {
                return I({ result: fe.target.result });
              }, C.onerror = st(O)) : B && V === "next" ? ((C = F ? ae.getAll(ce, re) : ae.getAllKeys(ce, re)).onsuccess = function(fe) {
                return I({ result: fe.target.result });
              }, C.onerror = st(O)) : ($ = 0, M = !F && "openKeyCursor" in ae ? ae.openKeyCursor(ce, V) : ae.openCursor(ce, V), z = [], M.onsuccess = function() {
                var fe = M.result;
                return !fe || (z.push(F ? fe.value : fe.primaryKey), ++$ === te) ? I({ result: z }) : void fe.continue();
              }, M.onerror = st(O));
            });
          }), openCursor: function(S) {
            var I = S.trans, O = S.values, C = S.query, $ = S.reverse, M = S.unique;
            return new Promise(function(z, F) {
              z = Le(z);
              var re = C.index, te = C.range, V = I.objectStore(k), V = re.isPrimaryKey ? V : V.index(re.name), re = $ ? M ? "prevunique" : "prev" : M ? "nextunique" : "next", K = !O && "openKeyCursor" in V ? V.openKeyCursor(c(te), re) : V.openCursor(c(te), re);
              K.onerror = st(F), K.onsuccess = Le(function(ae) {
                var ce, fe, pe, nt, le = K.result;
                le ? (le.___id = ++vu, le.done = !1, ce = le.continue.bind(le), fe = (fe = le.continuePrimaryKey) && fe.bind(le), pe = le.advance.bind(le), nt = function() {
                  throw new Error("Cursor not stopped");
                }, le.trans = I, le.stop = le.continue = le.continuePrimaryKey = le.advance = function() {
                  throw new Error("Cursor not started");
                }, le.fail = Le(F), le.next = function() {
                  var Fe = this, He = 1;
                  return this.start(function() {
                    return He-- ? Fe.continue() : Fe.stop();
                  }).then(function() {
                    return Fe;
                  });
                }, le.start = function(Fe) {
                  function He() {
                    if (K.result) try {
                      Fe();
                    } catch (Ze) {
                      le.fail(Ze);
                    }
                    else le.done = !0, le.start = function() {
                      throw new Error("Cursor behind last entry");
                    }, le.stop();
                  }
                  var vr = new Promise(function(Ze, Qt) {
                    Ze = Le(Ze), K.onerror = st(Qt), le.fail = Qt, le.stop = function(Lo) {
                      le.stop = le.continue = le.continuePrimaryKey = le.advance = nt, Ze(Lo);
                    };
                  });
                  return K.onsuccess = Le(function(Ze) {
                    K.onsuccess = He, He();
                  }), le.continue = ce, le.continuePrimaryKey = fe, le.advance = pe, He(), vr;
                }, z(le)) : z(null);
              }, F);
            });
          }, count: function(S) {
            var I = S.query, O = S.trans, C = I.index, $ = I.range;
            return new Promise(function(M, z) {
              var F = O.objectStore(k), F = C.isPrimaryKey ? F : F.index(C.name), te = c($), te = te ? F.count(te) : F.count();
              te.onsuccess = Le(function(V) {
                return M(V.target.result);
              }), te.onerror = st(z);
            });
          } };
        }
        d = y, g = fs((y = n).objectStoreNames), x = 0 < g.length ? d.objectStore(g[0]) : {};
        var d, y = { schema: { name: y.name, tables: g.map(function(_) {
          return d.objectStore(_);
        }).map(function(_) {
          var B = _.keyPath, A = _.autoIncrement, S = p(B), k = {}, S = { name: _.name, primaryKey: { name: null, isPrimaryKey: !0, outbound: B == null, compound: S, keyPath: B, autoIncrement: A, unique: !0, extractKey: yo(B) }, indexes: fs(_.indexNames).map(function(I) {
            return _.index(I);
          }).map(function($) {
            var M = $.name, O = $.unique, C = $.multiEntry, $ = $.keyPath, M = { name: M, compound: p($), keyPath: $, unique: O, multiEntry: C, extractKey: yo($) };
            return k[Pn($)] = M;
          }), getIndexByKeyPath: function(I) {
            return k[Pn(I)];
          } };
          return k[":id"] = S.primaryKey, B != null && (k[Pn(B)] = S.primaryKey), S;
        }) }, hasGetAll: 0 < g.length && "getAll" in x && !(typeof navigator < "u" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604), hasIdb3Features: "getAllRecords" in x }, g = y.schema, E = y.hasGetAll, R = y.hasIdb3Features, x = g.tables.map(l), b = {};
        return x.forEach(function(_) {
          return b[_.name] = _;
        }), { stack: "dbcore", transaction: n.transaction.bind(n), table: function(_) {
          if (b[_]) return b[_];
          throw new Error("Table '".concat(_, "' not found"));
        }, MIN_KEY: -1 / 0, MAX_KEY: Nn(i), schema: g };
      }
      function bu(n, i, a, c) {
        return a = a.IDBKeyRange, i = wu(i, a, c), { dbcore: n.dbcore.reduce(function(l, d) {
          return d = d.create, o(o({}, l), d(l));
        }, i) };
      }
      function ar(n, i) {
        var a = i.db, a = bu(n._middlewares, a, n._deps, i);
        n.core = a.dbcore, n.tables.forEach(function(c) {
          var l = c.name;
          n.core.schema.tables.some(function(d) {
            return d.name === l;
          }) && (c.core = n.core.table(l), n[l] instanceof n.Table) && (n[l].core = c.core);
        });
      }
      function cr(n, i, a, c) {
        a.forEach(function(l) {
          var d = c[l];
          i.forEach(function(y) {
            var g = (function E(R, x) {
              return L(R, x) || (R = m(R)) && E(R, x);
            })(y, l);
            (!g || "value" in g && g.value === void 0) && (y === n.Transaction.prototype || y instanceof n.Transaction ? P(y, l, { get: function() {
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
      function Eu(n, i) {
        return n._cfg.version - i._cfg.version;
      }
      function _u(n, i, a, c) {
        var l = n._dbSchema, d = (a.objectStoreNames.contains("$meta") && !l.$meta && (l.$meta = po("$meta", hs("")[0], []), n._storeNames.push("$meta")), n._createTransaction("readwrite", n._storeNames, l)), y = (d.create(a), d._completion.catch(c), d._reject.bind(d)), g = ie.transless || ie;
        Bt(function() {
          if (ie.trans = d, ie.transless = g, i !== 0) return ar(n, a), R = i, ((E = d).storeNames.includes("$meta") ? E.table("$meta").get("version").then(function(x) {
            return x ?? R;
          }) : W.resolve(R)).then(function(S) {
            var b = n, _ = S, B = d, A = a, k = [], S = b._versions, I = b._dbSchema = lr(0, b.idbdb, A);
            return (S = S.filter(function(O) {
              return O._cfg.version >= _;
            })).length === 0 ? W.resolve() : (S.forEach(function(O) {
              k.push(function() {
                var C, $, M, z = I, F = O._cfg.dbschema, te = (fr(b, z, A), fr(b, F, A), I = b._dbSchema = F, mo(z, F)), V = (te.add.forEach(function(re) {
                  vo(A, re[0], re[1].primKey, re[1].indexes);
                }), te.change.forEach(function(re) {
                  if (re.recreate) throw new X.Upgrade("Not yet support for changing primary key");
                  var K = A.objectStore(re.name);
                  re.add.forEach(function(ae) {
                    return ur(K, ae);
                  }), re.change.forEach(function(ae) {
                    K.deleteIndex(ae.name), ur(K, ae);
                  }), re.del.forEach(function(ae) {
                    return K.deleteIndex(ae);
                  });
                }), O._cfg.contentUpgrade);
                if (V && O._cfg.version > _) return ar(b, A), B._memoizedTables = {}, C = Re(F), te.del.forEach(function(re) {
                  C[re] = z[re];
                }), go(b, [b.Transaction.prototype]), cr(b, [b.Transaction.prototype], f(C), C), B.schema = C, ($ = oe(V)) && ln(), F = W.follow(function() {
                  var re;
                  (M = V(B)) && $ && (re = Rt.bind(null, null), M.then(re, re));
                }), M && typeof M.then == "function" ? W.resolve(M) : F.then(function() {
                  return M;
                });
              }), k.push(function(C) {
                var $, M, z = O._cfg.dbschema;
                $ = z, M = C, [].slice.call(M.db.objectStoreNames).forEach(function(F) {
                  return $[F] == null && M.db.deleteObjectStore(F);
                }), go(b, [b.Transaction.prototype]), cr(b, [b.Transaction.prototype], b._storeNames, b._dbSchema), B.schema = b._dbSchema;
              }), k.push(function(C) {
                b.idbdb.objectStoreNames.contains("$meta") && (Math.ceil(b.idbdb.version / 10) === O._cfg.version ? (b.idbdb.deleteObjectStore("$meta"), delete b._dbSchema.$meta, b._storeNames = b._storeNames.filter(function($) {
                  return $ !== "$meta";
                })) : C.objectStore("$meta").put(O._cfg.version, "version"));
              });
            }), (function O() {
              return k.length ? W.resolve(k.shift()(B.idbtrans)).then(O) : W.resolve();
            })().then(function() {
              ds(I, A);
            }));
          }).catch(y);
          var E, R;
          f(l).forEach(function(x) {
            vo(a, x, l[x].primKey, l[x].indexes);
          }), ar(n, a), W.follow(function() {
            return n.on.populate.fire(d);
          }).catch(y);
        });
      }
      function xu(n, i) {
        ds(n._dbSchema, i), i.db.version % 10 != 0 || i.objectStoreNames.contains("$meta") || i.db.createObjectStore("$meta").add(Math.ceil(i.db.version / 10 - 1), "version");
        var a = lr(0, n.idbdb, i);
        fr(n, n._dbSchema, i);
        for (var c = 0, l = mo(a, n._dbSchema).change; c < l.length; c++) {
          var d = ((y) => {
            if (y.change.length || y.recreate) return console.warn("Unable to patch indexes of table ".concat(y.name, " because it has changes on the type of index or primary key.")), { value: void 0 };
            var g = i.objectStore(y.name);
            y.add.forEach(function(E) {
              ct && console.debug("Dexie upgrade patch: Creating missing index ".concat(y.name, ".").concat(E.src)), ur(g, E);
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
              var g = l.idxByName, E = d.idxByName, R = void 0;
              for (R in g) E[R] || y.del.push(R);
              for (R in E) {
                var x = g[R], b = E[R];
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
          return ur(l, d);
        });
      }
      function ds(n, i) {
        f(n).forEach(function(a) {
          i.db.objectStoreNames.contains(a) || (ct && console.debug("Dexie: Creating missing table", a), vo(i, a, n[a].primKey, n[a].indexes));
        });
      }
      function ur(n, i) {
        n.createIndex(i.name, i.keyPath, { unique: i.unique, multiEntry: i.multi });
      }
      function lr(n, i, a) {
        var c = {};
        return Y(i.objectStoreNames, 0).forEach(function(l) {
          for (var d = a.objectStore(l), y = ho(ls(R = d.keyPath), R || "", !0, !1, !!d.autoIncrement, R && typeof R != "string", !0), g = [], E = 0; E < d.indexNames.length; ++E) {
            var x = d.index(d.indexNames[E]), R = x.keyPath, x = ho(x.name, R, !!x.unique, !!x.multiEntry, !1, R && typeof R != "string", !1);
            g.push(x);
          }
          c[l] = po(l, y, g);
        }), c;
      }
      function fr(n, i, a) {
        for (var c = a.db.objectStoreNames, l = 0; l < c.length; ++l) {
          var d = c[l], y = a.objectStore(d);
          n._hasGetAll = "getAll" in y;
          for (var g = 0; g < y.indexNames.length; ++g) {
            var E, R = y.indexNames[g], x = y.index(R).keyPath, x = typeof x == "string" ? x : "[" + Y(x).join("+") + "]";
            i[d] && (E = i[d].idxByName[x]) && (E.name = R, delete i[d].idxByName[x], i[d].idxByName[R] = E);
          }
        }
        typeof navigator < "u" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && u.WorkerGlobalScope && u instanceof u.WorkerGlobalScope && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604 && (n._hasGetAll = !1);
      }
      function hs(n) {
        return n.split(",").map(function(i, a) {
          var l = i.split(":"), c = (c = l[1]) == null ? void 0 : c.trim(), l = (i = l[0].trim()).replace(/([&*]|\+\+)/g, ""), d = /^\[/.test(l) ? l.match(/^\[(.*)\]$/)[1].split("+") : l;
          return ho(l, d || null, /\&/.test(i), /\*/.test(i), /\+\+/.test(i), p(d), a === 0, c);
        });
      }
      hn.prototype._createTableSchema = po, hn.prototype._parseIndexSyntax = hs, hn.prototype._parseStoresSpec = function(n, i) {
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
        }), i._dbSchema = l, go(i, [i._allTables, i, i.Transaction.prototype]), cr(i, [i._allTables, i, i.Transaction.prototype, this._cfg.tables], f(l), l), i._storeNames = f(l), this;
      }, hn.prototype.upgrade = function(n) {
        return this._cfg.contentUpgrade = Jr(this._cfg.contentUpgrade || _e, n), this;
      };
      var Au = hn;
      function hn() {
      }
      var Dn = (() => {
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
        return a || (a = n._dbNamesDB = new vt(tr, { addons: [], indexedDB: n, IDBKeyRange: i })).version(1).stores({ dbnames: "name" }), a.table("dbnames");
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
      function qn(n, i, a) {
        var c = ge(i, a);
        if (!isNaN(c)) {
          if (0 < c) throw RangeError();
          if (_o(n)) return h(n, { from: i, to: a, d: 1 });
          var c = n.l, l = n.r;
          if (ge(a, n.from) < 0) return c ? qn(c, i, a) : n.l = { from: i, to: a, d: 1, l: null, r: null }, ys(n);
          if (0 < ge(i, n.to)) return l ? qn(l, i, a) : n.r = { from: i, to: a, d: 1, l: null, r: null }, ys(n);
          ge(i, n.from) < 0 && (n.from = i, n.l = null, n.d = l ? l.d + 1 : 1), 0 < ge(a, n.to) && (n.to = a, n.r = null, n.d = n.l ? n.l.d + 1 : 1), i = !n.r, c && !n.l && $n(n, c), l && i && $n(n, l);
        }
      }
      function $n(n, i) {
        _o(i) || (function a(c, l) {
          var d = l.from, y = l.l, g = l.r;
          qn(c, d, l.to), y && a(c, y), g && a(c, g);
        })(n, i);
      }
      function ps(n, i) {
        var a = dr(i), c = a.next();
        if (!c.done) for (var l = c.value, d = dr(n), y = d.next(l.from), g = y.value; !c.done && !y.done; ) {
          if (ge(g.from, l.to) <= 0 && 0 <= ge(g.to, l.from)) return !0;
          ge(l.from, g.from) < 0 ? l = (c = a.next(g.from)).value : g = (y = d.next(l.from)).value;
        }
        return !1;
      }
      function dr(n) {
        var i = _o(n) ? null : { s: 0, n };
        return { next: function(a) {
          for (var c = 0 < arguments.length; i; ) switch (i.s) {
            case 0:
              if (i.s = 1, c) for (; i.n.l && ge(a, i.n.from) < 0; ) i = { up: i, n: i.n.l, s: 1 };
              else for (; i.n.l; ) i = { up: i, n: i.n.l, s: 1 };
            case 1:
              if (i.s = 2, !c || ge(a, i.n.to) <= 0) return { value: i.n, done: !1 };
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
      function ys(n) {
        var i, a, c, l = (((l = n.r) == null ? void 0 : l.d) || 0) - (((l = n.l) == null ? void 0 : l.d) || 0), l = 1 < l ? "r" : l < -1 ? "l" : "";
        l && (i = l == "r" ? "l" : "r", a = o({}, n), c = n[l], n.from = c.from, n.to = c.to, n[l] = c[l], a[l] = c[i], (n[i] = a).d = gs(a)), n.d = gs(n);
      }
      function gs(a) {
        var i = a.r, a = a.l;
        return (i ? a ? Math.max(i.d, a.d) : i.d : a ? a.d : 0) + 1;
      }
      function hr(n, i) {
        return f(i).forEach(function(a) {
          n[a] ? $n(n[a], i[a]) : n[a] = (function c(l) {
            var d, y, g = {};
            for (d in l) w(l, d) && (y = l[d], g[d] = !y || typeof y != "object" || Oe.has(y.constructor) ? y : c(y));
            return g;
          })(i[a]);
        }), n;
      }
      function xo(n, i) {
        return n.all || i.all || Object.keys(n).some(function(a) {
          return i[a] && ps(i[a], n[a]);
        });
      }
      N(je.prototype, ((et = { add: function(n) {
        return $n(this, n), this;
      }, addKey: function(n) {
        return qn(this, n, n), this;
      }, addKeys: function(n) {
        var i = this;
        return n.forEach(function(a) {
          return qn(i, a, a);
        }), this;
      }, hasKey: function(n) {
        var i = dr(this).next(n).value;
        return i && ge(i.from, n) <= 0 && 0 <= ge(i.to, n);
      } })[Z] = function() {
        return dr(this);
      }, et));
      var Xt = {}, Ao = {}, ko = !1;
      function pr(n) {
        hr(Ao, n), ko || (ko = !0, setTimeout(function() {
          ko = !1, So(Ao, !(Ao = {}));
        }, 0));
      }
      function So(n, i) {
        i === void 0 && (i = !1);
        var a = /* @__PURE__ */ new Set();
        if (n.all) for (var c = 0, l = Object.values(Xt); c < l.length; c++) ms(g = l[c], n, a, i);
        else for (var d in n) {
          var y, g, d = /^idb\:\/\/(.*)\/(.*)\//.exec(d);
          d && (y = d[1], d = d[2], g = Xt["idb://".concat(y, "/").concat(d)]) && ms(g, n, a, i);
        }
        a.forEach(function(E) {
          return E();
        });
      }
      function ms(n, i, a, c) {
        for (var l = [], d = 0, y = Object.entries(n.queries.query); d < y.length; d++) {
          for (var g = y[d], E = g[0], R = [], x = 0, b = g[1]; x < b.length; x++) {
            var _ = b[x];
            xo(i, _.obsSet) ? _.subscribers.forEach(function(S) {
              return a.add(S);
            }) : c && R.push(_);
          }
          c && l.push([E, R]);
        }
        if (c) for (var B = 0, A = l; B < A.length; B++) {
          var k = A[B], E = k[0], R = k[1];
          n.queries.query[E] = R;
        }
      }
      function ku(n) {
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
          return new W(function(_, B) {
            if (y(), !a) throw new X.MissingAPI();
            var A = n.name, k = i.autoSchema || !l ? a.open(A) : a.open(A, l);
            if (!k) throw new X.MissingAPI();
            k.onerror = st(B), k.onblocked = Le(n._fireOnBlocked), k.onupgradeneeded = Le(function(S) {
              var I;
              x = k.transaction, i.autoSchema && !n._options.allowEmptyDB ? (k.onerror = Cn, x.abort(), k.result.close(), (I = a.deleteDatabase(A)).onsuccess = I.onerror = Le(function() {
                B(new X.NoSuchDatabase("Database ".concat(A, " doesnt exist")));
              })) : (x.onerror = st(B), I = S.oldVersion > Math.pow(2, 62) ? 0 : S.oldVersion, b = I < 1, n.idbdb = k.result, d && xu(n, x), _u(n, I / 10, x, B));
            }, B), k.onsuccess = Le(function() {
              x = null;
              var S, I, O, C, $, M, z = n.idbdb = k.result, F = Y(z.objectStoreNames);
              if (0 < F.length) try {
                var te = z.transaction(($ = F).length === 1 ? $[0] : $, "readonly");
                if (i.autoSchema) M = z, C = te, (O = n).verno = M.version / 10, C = O._dbSchema = lr(0, M, C), O._storeNames = Y(M.objectStoreNames, 0), cr(O, [O._allTables], f(C), C);
                else if (fr(n, n._dbSchema, te), I = te, ((I = mo(lr(0, (S = n).idbdb, I), S._dbSchema)).add.length || I.change.some(function(V) {
                  return V.add.length || V.change.length;
                })) && !d) return console.warn("Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Dexie will add missing parts and increment native version number to workaround this."), z.close(), l = z.version + 1, d = !0, _(g());
                ar(n, te);
              } catch {
              }
              Dn.add(n), z.onversionchange = Le(function(V) {
                i.vcFired = !0, n.on("versionchange").fire(V);
              }), z.onclose = Le(function() {
                n.close({ disableAutoOpen: !1 });
              }), b && (F = n._deps, $ = A, bo(M = F.indexedDB) || $ === tr || wo(M, F.IDBKeyRange).put({ name: $ }).catch(_e)), _();
            }, B);
          }).catch(function(_) {
            switch (_?.name) {
              case "UnknownError":
                if (0 < i.PR1398_maxLoop) return i.PR1398_maxLoop--, console.warn("Dexie: Workaround for Chrome UnknownError on open()"), g();
                break;
              case "VersionError":
                if (0 < l) return l = 0, g();
            }
            return W.reject(_);
          });
        }
        var E, R = i.dbReadyResolve, x = null, b = !1;
        return W.race([c, (typeof navigator > "u" ? W.resolve() : !navigator.userAgentData && /Safari\//.test(navigator.userAgent) && !/Chrom(e|ium)\//.test(navigator.userAgent) && indexedDB.databases ? new Promise(function(_) {
          function B() {
            return indexedDB.databases().finally(_);
          }
          E = setInterval(B, 100), B();
        }).finally(function() {
          return clearInterval(E);
        }) : Promise.resolve()).then(g)]).then(function() {
          return y(), i.onReadyBeingFired = [], W.resolve(Eo(function() {
            return n.on.ready.fire(n.vip);
          })).then(function _() {
            var B;
            if (0 < i.onReadyBeingFired.length) return B = i.onReadyBeingFired.reduce(Jr, _e), i.onReadyBeingFired = [], W.resolve(Eo(function() {
              return B(n.vip);
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
          i.openComplete = !0, R();
        }).then(function() {
          var _;
          return b && (_ = {}, n.tables.forEach(function(B) {
            B.schema.indexes.forEach(function(A) {
              A.name && (_["idb://".concat(n.name, "/").concat(B.name, "/").concat(A.name)] = new je(-1 / 0, [[[]]]));
            }), _["idb://".concat(n.name, "/").concat(B.name, "/")] = _["idb://".concat(n.name, "/").concat(B.name, "/:dels")] = new je(-1 / 0, [[[]]]);
          }), Tt(Ln).fire(_), So(_, !0)), n;
        });
      }
      function Bo(n) {
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
      function yr(n, i, a) {
        for (var c = p(n) ? n.slice() : [n], l = 0; l < a; ++l) c.push(i);
        return c;
      }
      var Su = { stack: "dbcore", name: "VirtualIndexMiddleware", level: 1, create: function(n) {
        return o(o({}, n), { table: function(c) {
          var a = n.table(c), c = a.schema, l = {}, d = [];
          function y(_, B, A) {
            var O = Pn(_), k = l[O] = l[O] || [], S = _ == null ? 0 : typeof _ == "string" ? 1 : _.length, I = 0 < B, O = o(o({}, A), { name: I ? "".concat(O, "(virtual-from:").concat(A.name, ")") : A.name, lowLevelIndex: A, isVirtual: I, keyTail: B, keyLength: S, extractKey: yo(_), unique: !I && A.unique });
            return k.push(O), O.isPrimaryKey || d.push(O), 1 < S && y(S === 2 ? _[0] : _.slice(0, S - 1), B + 1, A), k.sort(function(C, $) {
              return C.keyTail - $.keyTail;
            }), O;
          }
          var g = y(c.primaryKey.keyPath, 0, c.primaryKey);
          l[":id"] = [g];
          for (var E = 0, R = c.indexes; E < R.length; E++) {
            var x = R[E];
            y(x.keyPath, 0, x);
          }
          function b(_) {
            var B, A = _.query.index;
            return A.isVirtual ? o(o({}, _), { query: { index: A.lowLevelIndex, range: (B = _.query.range, A = A.keyTail, { type: B.type === 1 ? 2 : B.type, lower: yr(B.lower, B.lowerOpen ? n.MAX_KEY : n.MIN_KEY, A), lowerOpen: !0, upper: yr(B.upper, B.upperOpen ? n.MIN_KEY : n.MAX_KEY, A), upperOpen: !0 }) } }) : _;
          }
          return o(o({}, a), { schema: o(o({}, c), { primaryKey: g, indexes: d, getIndexByKeyPath: function(_) {
            return (_ = l[Pn(_)]) && _[0];
          } }), count: function(_) {
            return a.count(b(_));
          }, query: function(_) {
            return a.query(b(_));
          }, openCursor: function(_) {
            var B = _.query.index, A = B.keyTail, k = B.keyLength;
            return B.isVirtual ? a.openCursor(b(_)).then(function(I) {
              return I && S(I);
            }) : a.openCursor(_);
            function S(I) {
              return Object.create(I, { continue: { value: function(O) {
                O != null ? I.continue(yr(O, _.reverse ? n.MAX_KEY : n.MIN_KEY, A)) : _.unique ? I.continue(I.key.slice(0, k).concat(_.reverse ? n.MIN_KEY : n.MAX_KEY, A)) : I.continue();
              } }, continuePrimaryKey: { value: function(O, C) {
                I.continuePrimaryKey(yr(O, n.MAX_KEY, A), C);
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
      function Ro(n, i, a, c) {
        return a = a || {}, c = c || "", f(n).forEach(function(l) {
          var d, y, g;
          w(i, l) ? (d = n[l], y = i[l], typeof d == "object" && typeof y == "object" && d && y ? (g = D(d)) !== D(y) ? a[c + l] = i[l] : g === "Object" ? Ro(d, y, a, c + l + ".") : d !== y && (a[c + l] = i[l]) : d !== y && (a[c + l] = i[l])) : a[c + l] = void 0;
        }), f(i).forEach(function(l) {
          w(n, l) || (a[c + l] = i[l]);
        }), a;
      }
      function Oo(n, i) {
        return i.type === "delete" ? i.keys : i.keys || i.values.map(n.extractKey);
      }
      var Bu = { stack: "dbcore", name: "HooksMiddleware", level: 2, create: function(n) {
        return o(o({}, n), { table: function(i) {
          var a = n.table(i), c = a.schema.primaryKey;
          return o(o({}, a), { mutate: function(l) {
            var d = ie.trans, y = d.table(i).hook, g = y.deleting, E = y.creating, R = y.updating;
            switch (l.type) {
              case "add":
                if (E.fire === _e) break;
                return d._promise("readwrite", function() {
                  return x(l);
                }, !0);
              case "put":
                if (E.fire === _e && R.fire === _e) break;
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
                  return (function b(_, B, A) {
                    return a.query({ trans: _, values: !1, query: { index: c, range: B }, limit: A }).then(function(k) {
                      var S = k.result;
                      return x({ type: "delete", keys: S, trans: _ }).then(function(I) {
                        return 0 < I.numFailures ? Promise.reject(I.failures[0]) : S.length < A ? { failures: [], numFailures: 0, lastResult: void 0 } : b(_, o(o({}, B), { lower: S[S.length - 1], lowerOpen: !0 }), A);
                      });
                    });
                  })(l.trans, l.range, 1e4);
                }, !0);
            }
            return a.mutate(l);
            function x(b) {
              var _, B, A, k = ie.trans, S = b.keys || Oo(c, b);
              if (S) return (b = b.type === "add" || b.type === "put" ? o(o({}, b), { keys: S }) : o({}, b)).type !== "delete" && (b.values = s([], b.values)), b.keys && (b.keys = s([], b.keys)), _ = a, A = S, ((B = b).type === "add" ? Promise.resolve([]) : _.getMany({ trans: B.trans, keys: A, cache: "immutable" })).then(function(I) {
                var O = S.map(function(C, $) {
                  var M, z, F, te = I[$], V = { onerror: null, onsuccess: null };
                  return b.type === "delete" ? g.fire.call(V, C, te, k) : b.type === "add" || te === void 0 ? (M = E.fire.call(V, C, b.values[$], k), C == null && M != null && (b.keys[$] = C = M, c.outbound || me(b.values[$], c.keyPath, C))) : (M = Ro(te, b.values[$]), (z = R.fire.call(V, M, C, te, k)) && (F = b.values[$], Object.keys(z).forEach(function(re) {
                    w(F, re) ? F[re] = z[re] : me(F, re, z[re]);
                  }))), V;
                });
                return a.mutate(b).then(function(C) {
                  for (var $ = C.failures, M = C.results, z = C.numFailures, C = C.lastResult, F = 0; F < S.length; ++F) {
                    var te = (M || S)[F], V = O[F];
                    te == null ? V.onerror && V.onerror($[F]) : V.onsuccess && V.onsuccess(b.type === "put" && I[F] ? b.values[F] : te);
                  }
                  return { failures: $, results: M, numFailures: z, lastResult: C };
                }).catch(function(C) {
                  return O.forEach(function($) {
                    return $.onerror && $.onerror(C);
                  }), Promise.reject(C);
                });
              });
              throw new Error("Keys missing");
            }
          } });
        } });
      } };
      function vs(n, i, a) {
        try {
          if (!i || i.keys.length < n.length) return null;
          for (var c = [], l = 0, d = 0; l < i.keys.length && d < n.length; ++l) ge(i.keys[l], n[d]) === 0 && (c.push(a ? U(i.values[l]) : i.values[l]), ++d);
          return c.length === n.length ? c : null;
        } catch {
          return null;
        }
      }
      var Ru = { stack: "dbcore", level: -1, create: function(n) {
        return { table: function(i) {
          var a = n.table(i);
          return o(o({}, a), { getMany: function(c) {
            var l;
            return c.cache ? (l = vs(c.keys, c.trans._cache, c.cache === "clone")) ? W.resolve(l) : a.getMany(c).then(function(d) {
              return c.trans._cache = { keys: c.keys, values: c.cache === "clone" ? U(d) : d }, d;
            }) : a.getMany(c);
          }, mutate: function(c) {
            return c.type !== "add" && (c.trans._cache = null), a.mutate(c);
          } });
        } };
      } };
      function ws(n, i) {
        return n.trans.mode === "readonly" && !!n.subscr && !n.trans.explicit && n.trans.db._options.cache !== "disabled" && !i.schema.primaryKey.outbound;
      }
      function bs(n, i) {
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
      var Ou = { stack: "dbcore", level: 0, name: "Observability", create: function(n) {
        var i = n.schema.name, a = new je(n.MIN_KEY, n.MAX_KEY);
        return o(o({}, n), { transaction: function(c, l, d) {
          if (ie.subscr && l !== "readonly") throw new X.ReadOnly("Readwrite transaction in liveQuery context. Querier source: ".concat(ie.querier));
          return n.transaction(c, l, d);
        }, table: function(c) {
          function l(S) {
            var k, S = S.query;
            return [k = S.index, new je((k = (S = S.range).lower) != null ? k : n.MIN_KEY, (k = S.upper) != null ? k : n.MAX_KEY)];
          }
          var d = n.table(c), y = d.schema, g = y.primaryKey, E = y.indexes, R = g.extractKey, x = g.outbound, b = g.autoIncrement && E.filter(function(A) {
            return A.compound && A.keyPath.includes(g.keyPath);
          }), _ = o(o({}, d), { mutate: function(A) {
            function k(K) {
              return K = "idb://".concat(i, "/").concat(c, "/").concat(K), $[K] || ($[K] = new je());
            }
            var S, I, O, C = A.trans, $ = A.mutatedParts || (A.mutatedParts = {}), M = k(""), z = k(":dels"), F = A.type, V = A.type === "deleteRange" ? [A.range] : A.type === "delete" ? [A.keys] : A.values.length < 50 ? [Oo(g, A).filter(function(K) {
              return K;
            }), A.values] : [], te = V[0], V = V[1], re = A.trans._cache;
            return p(te) ? (M.addKeys(te), (F = F === "delete" || te.length === V.length ? vs(te, re) : null) || z.addKeys(te), (F || V) && (S = k, I = F, O = V, y.indexes.forEach(function(K) {
              var ae = S(K.name || "");
              function ce(pe) {
                return pe != null ? K.extractKey(pe) : null;
              }
              function fe(pe) {
                K.multiEntry && p(pe) ? pe.forEach(function(nt) {
                  return ae.addKey(nt);
                }) : ae.addKey(pe);
              }
              (I || O).forEach(function(pe, Fe) {
                var le = I && ce(I[Fe]), Fe = O && ce(O[Fe]);
                ge(le, Fe) !== 0 && (le != null && fe(le), Fe != null) && fe(Fe);
              });
            }))) : te ? (V = { from: (re = te.lower) != null ? re : n.MIN_KEY, to: (F = te.upper) != null ? F : n.MAX_KEY }, z.add(V), M.add(V)) : (M.add(a), z.add(a), y.indexes.forEach(function(K) {
              return k(K.name).add(a);
            })), d.mutate(A).then(function(K) {
              return !te || A.type !== "add" && A.type !== "put" || (M.addKeys(K.results), b && b.forEach(function(ae) {
                for (var ce = A.values.map(function(le) {
                  return ae.extractKey(le);
                }), fe = ae.keyPath.findIndex(function(le) {
                  return le === g.keyPath;
                }), pe = 0, nt = K.results.length; pe < nt; ++pe) ce[pe][fe] = K.results[pe];
                k(ae.name).addKeys(ce);
              })), C.mutatedParts = hr(C.mutatedParts || {}, $), K;
            });
          } }), B = { get: function(A) {
            return [g, new je(A.key)];
          }, getMany: function(A) {
            return [g, new je().addKeys(A.keys)];
          }, count: l, query: l, openCursor: l };
          return f(B).forEach(function(A) {
            _[A] = function(k) {
              var S = ie.subscr, I = !!S, O = ws(ie, d) && bs(A, k) ? k.obsSet = {} : S;
              if (I) {
                var C, S = function(V) {
                  return V = "idb://".concat(i, "/").concat(c, "/").concat(V), O[V] || (O[V] = new je());
                }, $ = S(""), M = S(":dels"), I = B[A](k), z = I[0], I = I[1];
                if ((A === "query" && z.isPrimaryKey && !k.values ? M : S(z.name || "")).add(I), !z.isPrimaryKey) {
                  if (A !== "count") return C = A === "query" && x && k.values && d.query(o(o({}, k), { values: !1 })), d[A].apply(this, arguments).then(function(V) {
                    if (A === "query") {
                      if (x && k.values) return C.then(function(ce) {
                        return ce = ce.result, $.addKeys(ce), V;
                      });
                      var re = k.values ? V.result.map(R) : V.result;
                      (k.values ? $ : M).addKeys(re);
                    } else {
                      var K, ae;
                      if (A === "openCursor") return ae = k.values, (K = V) && Object.create(K, { key: { get: function() {
                        return M.addKey(K.primaryKey), K.key;
                      } }, primaryKey: { get: function() {
                        var ce = K.primaryKey;
                        return M.addKey(ce), ce;
                      } }, value: { get: function() {
                        return ae && $.addKey(K.primaryKey), K.value;
                      } } });
                    }
                    return V;
                  });
                  M.add(a);
                }
              }
              return d[A].apply(this, arguments);
            };
          }), _;
        } });
      } };
      function Es(n, i, a) {
        var c;
        return a.numFailures === 0 ? i : i.type === "deleteRange" || (c = i.keys ? i.keys.length : "values" in i && i.values ? i.values.length : 1, a.numFailures === c) ? null : (c = o({}, i), p(c.keys) && (c.keys = c.keys.filter(function(l, d) {
          return !(d in a.failures);
        })), "values" in c && p(c.values) && (c.values = c.values.filter(function(l, d) {
          return !(d in a.failures);
        })), c);
      }
      function Io(n, i) {
        return a = n, ((c = i).lower === void 0 || (c.lowerOpen ? 0 < ge(a, c.lower) : 0 <= ge(a, c.lower))) && (a = n, (c = i).upper === void 0 || (c.upperOpen ? ge(a, c.upper) < 0 : ge(a, c.upper) <= 0));
        var a, c;
      }
      function _s(n, i, a, c, l, d) {
        var y, g, E, R, x, b, _;
        return !a || a.length === 0 || (y = i.query.index, g = y.multiEntry, E = i.query.range, R = c.schema.primaryKey.extractKey, x = y.extractKey, b = (y.lowLevelIndex || y).extractKey, (c = a.reduce(function(B, A) {
          var k = B, S = [];
          if (A.type === "add" || A.type === "put") for (var I = new je(), O = A.values.length - 1; 0 <= O; --O) {
            var C, $ = A.values[O], M = R($);
            !I.hasKey(M) && (C = x($), g && p(C) ? C.some(function(re) {
              return Io(re, E);
            }) : Io(C, E)) && (I.addKey(M), S.push($));
          }
          switch (A.type) {
            case "add":
              var z = new je().addKeys(i.values ? B.map(function(K) {
                return R(K);
              }) : B), k = B.concat(i.values ? S.filter(function(K) {
                return K = R(K), !z.hasKey(K) && (z.addKey(K), !0);
              }) : S.map(function(K) {
                return R(K);
              }).filter(function(K) {
                return !z.hasKey(K) && (z.addKey(K), !0);
              }));
              break;
            case "put":
              var F = new je().addKeys(A.values.map(function(K) {
                return R(K);
              }));
              k = B.filter(function(K) {
                return !F.hasKey(i.values ? R(K) : K);
              }).concat(i.values ? S : S.map(function(K) {
                return R(K);
              }));
              break;
            case "delete":
              var te = new je().addKeys(A.keys);
              k = B.filter(function(K) {
                return !te.hasKey(i.values ? R(K) : K);
              });
              break;
            case "deleteRange":
              var V = A.range;
              k = B.filter(function(K) {
                return !Io(R(K), V);
              });
          }
          return k;
        }, n)) === n) ? n : (_ = function(B, A) {
          return ge(b(B), b(A)) || ge(R(B), R(A));
        }, c.sort(i.direction === "prev" || i.direction === "prevunique" ? function(B, A) {
          return _(A, B);
        } : _), i.limit && i.limit < 1 / 0 && (c.length > i.limit ? c.length = i.limit : n.length === i.limit && c.length < i.limit && (l.dirty = !0)), d ? Object.freeze(c) : c);
      }
      function xs(n, i) {
        return ge(n.lower, i.lower) === 0 && ge(n.upper, i.upper) === 0 && !!n.lowerOpen == !!i.lowerOpen && !!n.upperOpen == !!i.upperOpen;
      }
      function Iu(n, i) {
        return ((a, c, l, d) => {
          if (a === void 0) return c !== void 0 ? -1 : 0;
          if (c === void 0) return 1;
          if ((a = ge(a, c)) === 0) {
            if (l && d) return 0;
            if (l) return 1;
            if (d) return -1;
          }
          return a;
        })(n.lower, i.lower, n.lowerOpen, i.lowerOpen) <= 0 && 0 <= ((a, c, l, d) => {
          if (a === void 0) return c !== void 0 ? 1 : 0;
          if (c === void 0) return -1;
          if ((a = ge(a, c)) === 0) {
            if (l && d) return 0;
            if (l) return -1;
            if (d) return 1;
          }
          return a;
        })(n.upper, i.upper, n.upperOpen, i.upperOpen);
      }
      function Tu(n, i, a, c) {
        n.subscribers.add(a), c.addEventListener("abort", function() {
          var l, d;
          n.subscribers.delete(a), n.subscribers.size === 0 && (l = n, d = i, setTimeout(function() {
            l.subscribers.size === 0 && J(d, l);
          }, 3e3));
        });
      }
      var Cu = { stack: "dbcore", level: 0, name: "Cache", create: function(n) {
        var i = n.schema.name;
        return o(o({}, n), { transaction: function(a, c, l) {
          var d, y, g = n.transaction(a, c, l);
          return c === "readwrite" && (l = (d = new AbortController()).signal, g.addEventListener("abort", (y = function(E) {
            return function() {
              if (d.abort(), c === "readwrite") {
                for (var R = /* @__PURE__ */ new Set(), x = 0, b = a; x < b.length; x++) {
                  var _ = b[x], B = Xt["idb://".concat(i, "/").concat(_)];
                  if (B) {
                    var A = n.table(_), k = B.optimisticOps.filter(function(K) {
                      return K.trans === g;
                    });
                    if (g._explicit && E && g.mutatedParts) for (var S = 0, I = Object.values(B.queries.query); S < I.length; S++) for (var O = 0, C = (z = I[S]).slice(); O < C.length; O++) xo((F = C[O]).obsSet, g.mutatedParts) && (J(z, F), F.subscribers.forEach(function(K) {
                      return R.add(K);
                    }));
                    else if (0 < k.length) {
                      B.optimisticOps = B.optimisticOps.filter(function(K) {
                        return K.trans !== g;
                      });
                      for (var $ = 0, M = Object.values(B.queries.query); $ < M.length; $++) for (var z, F, te, V = 0, re = (z = M[$]).slice(); V < re.length; V++) (F = re[V]).res != null && g.mutatedParts && (E && !F.dirty ? (te = Object.isFrozen(F.res), te = _s(F.res, F.req, k, A, F, te), F.dirty ? (J(z, F), F.subscribers.forEach(function(K) {
                        return R.add(K);
                      })) : te !== F.res && (F.res = te, F.promise = W.resolve({ result: te }))) : (F.dirty && J(z, F), F.subscribers.forEach(function(K) {
                        return R.add(K);
                      })));
                    }
                  }
                }
                R.forEach(function(K) {
                  return K();
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
            })) ? (y.optimisticOps.push(d), d.mutatedParts && pr(d.mutatedParts), g.then(function(E) {
              0 < E.numFailures && (J(y.optimisticOps, d), (E = Es(0, d, E)) && y.optimisticOps.push(E), d.mutatedParts) && pr(d.mutatedParts);
            }), g.catch(function() {
              J(y.optimisticOps, d), d.mutatedParts && pr(d.mutatedParts);
            })) : g.then(function(E) {
              var R = Es(0, o(o({}, d), { values: d.values.map(function(x, b) {
                var _;
                return E.failures[b] ? x : (me(_ = (_ = l.keyPath) != null && _.includes(".") ? U(x) : o({}, x), l.keyPath, E.results[b]), _);
              }) }), E);
              y.optimisticOps.push(R), queueMicrotask(function() {
                return d.mutatedParts && pr(d.mutatedParts);
              });
            }), g) : c.mutate(d);
          }, query: function(d) {
            var y, g, E, R, x, b, _;
            return ws(ie, c) && bs("query", d) ? (y = ((E = ie.trans) == null ? void 0 : E.db._options.cache) === "immutable", g = (E = ie).requery, E = E.signal, b = ((B, A, k, S) => {
              var I = Xt["idb://".concat(B, "/").concat(A)];
              if (!I) return [];
              if (!(B = I.queries[k])) return [null, !1, I, null];
              var O = B[(S.query ? S.query.index.name : null) || ""];
              if (!O) return [null, !1, I, null];
              switch (k) {
                case "query":
                  var C = ($ = S.direction) != null ? $ : "next", $ = O.find(function(M) {
                    var z;
                    return M.req.limit === S.limit && M.req.values === S.values && ((z = M.req.direction) != null ? z : "next") === C && xs(M.req.query.range, S.query.range);
                  });
                  return $ ? [$, !0, I, O] : [O.find(function(M) {
                    var z;
                    return ("limit" in M.req ? M.req.limit : 1 / 0) >= S.limit && ((z = M.req.direction) != null ? z : "next") === C && (!S.values || M.req.values) && Iu(M.req.query.range, S.query.range);
                  }), !1, I, O];
                case "count":
                  return $ = O.find(function(M) {
                    return xs(M.req.query.range, S.query.range);
                  }), [$, !!$, I, O];
              }
            })(i, a, "query", d), _ = b[0], R = b[2], x = b[3], _ && b[1] ? _.obsSet = d.obsSet : (b = c.query(d).then(function(B) {
              var A = B.result;
              if (_ && (_.res = A), y) {
                for (var k = 0, S = A.length; k < S; ++k) Object.freeze(A[k]);
                Object.freeze(A);
              } else B.result = U(A);
              return B;
            }).catch(function(B) {
              return x && _ && J(x, _), Promise.reject(B);
            }), _ = { obsSet: d.obsSet, promise: b, subscribers: /* @__PURE__ */ new Set(), type: "query", req: d, dirty: !1 }, x ? x.push(_) : (x = [_], (R = R || (Xt["idb://".concat(i, "/").concat(a)] = { queries: { query: {}, count: {} }, objs: /* @__PURE__ */ new Map(), optimisticOps: [], unsignaledParts: {} })).queries.query[d.query.index.name || ""] = x)), Tu(_, x, g, E), _.promise.then(function(B) {
              return { result: _s(B.result, d, R?.optimisticOps, c, _, y) };
            })) : c.query(d);
          } });
        } });
      } };
      function gr(n, i) {
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
        return a || (a = new this.Version(n), i.push(a), i.sort(Eu), a.stores({}), this._state.autoSchema = !1), a;
      }, $e.prototype._whenReady = function(n) {
        var i = this;
        return this.idbdb && (this._state.openComplete || ie.letThrough || this._vip) ? n() : new W(function(a, c) {
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
          return ku(n);
        });
      }, $e.prototype._close = function() {
        this.on.close.fire(new CustomEvent("close"));
        var n = this._state;
        if (Dn.remove(this), this.idbdb) {
          try {
            this.idbdb.close();
          } catch {
          }
          this.idbdb = null;
        }
        n.isBeingOpened || (n.dbReadyPromise = new W(function(i) {
          n.dbReadyResolve = i;
        }), n.openCanceller = new W(function(i, a) {
          n.cancelOpen = a;
        }));
      }, $e.prototype.close = function(i) {
        var i = (i === void 0 ? { disableAutoOpen: !0 } : i).disableAutoOpen, a = this._state;
        i ? (a.isBeingOpened && a.cancelOpen(new X.DatabaseClosed()), this._close(), a.autoOpen = !1, a.dbOpenError = new X.DatabaseClosed()) : (this._close(), a.autoOpen = this._options.autoOpen || a.isBeingOpened, a.openComplete = !1, a.dbOpenError = null);
      }, $e.prototype.delete = function(n) {
        var i = this, a = (n === void 0 && (n = { disableAutoOpen: !0 }), 0 < arguments.length && typeof arguments[0] != "object"), c = this._state;
        return new W(function(l, d) {
          function y() {
            i.close(n);
            var g = i._deps.indexedDB.deleteDatabase(i.name);
            g.onsuccess = Le(function() {
              var E, R, x;
              E = i._deps, R = i.name, bo(x = E.indexedDB) || R === tr || wo(x, E.IDBKeyRange).delete(R).catch(_e), l();
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
          if (l = i.map(function(R) {
            if (R = R instanceof d.Table ? R.name : R, typeof R != "string") throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
            return R;
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
            y && l.forEach(function(R) {
              if (y && y.storeNames.indexOf(R) === -1) {
                if (!g) throw new X.SubTransaction("Table " + R + " not included in parent transaction.");
                y = null;
              }
            }), g && y && !y.active && (y = null);
          }
        } catch (R) {
          return y ? y._promise(null, function(x, b) {
            b(R);
          }) : qe(R);
        }
        var E = (function R(x, b, _, B, A) {
          return W.resolve().then(function() {
            var O = ie.transless || ie, k = x._createTransaction(b, _, x._dbSchema, B), O = (k.explicit = !0, { trans: k, transless: O });
            if (B) k.idbtrans = B.idbtrans;
            else try {
              k.create(), k.idbtrans._explicit = !0, x._state.PR1398_maxLoop = 3;
            } catch (C) {
              return C.name === We.InvalidState && x.isOpen() && 0 < --x._state.PR1398_maxLoop ? (console.warn("Dexie: Need to reopen db"), x.close({ disableAutoOpen: !1 }), x.open().then(function() {
                return R(x, b, _, null, A);
              })) : qe(C);
            }
            var S, I = oe(A), O = (I && ln(), W.follow(function() {
              var C;
              (S = A.call(k, k)) && (I ? (C = Rt.bind(null, null), S.then(C, C)) : typeof S.next == "function" && typeof S.throw == "function" && (S = Bo(S)));
            }, O));
            return (S && typeof S.then == "function" ? W.resolve(S).then(function(C) {
              return k.active ? C : qe(new X.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn"));
            }) : O.then(function() {
              return S;
            })).then(function(C) {
              return B && k._resolve(), k._completion.then(function() {
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
        var a, c, l, d, y, g = this, E = (this._middlewares = {}, this.verno = 0, $e.dependencies), E = (this._options = i = o({ addons: $e.addons, autoOpen: !0, indexedDB: E.indexedDB, IDBKeyRange: E.IDBKeyRange, cache: "cloned", maxConnections: 1e3 }, i), this._deps = { indexedDB: i.indexedDB, IDBKeyRange: i.IDBKeyRange }, i.addons), R = (this._dbSchema = {}, this._versions = [], this._storeNames = [], this._allTables = {}, this.idbdb = null, this._novip = this, { dbOpenError: null, isBeingOpened: !1, onReadyBeingFired: null, openComplete: !1, dbReadyResolve: _e, dbReadyPromise: null, cancelOpen: _e, openCanceller: null, autoSchema: !0, PR1398_maxLoop: 3, autoOpen: i.autoOpen }), x = (R.dbReadyPromise = new W(function(b) {
          R.dbReadyResolve = b;
        }), R.openCanceller = new W(function(b, _) {
          R.cancelOpen = _;
        }), this._state = R, this.name = n, this.on = In(this, "populate", "blocked", "versionchange", "close", { ready: [Jr, _e] }), this.once = function(b, _) {
          var B = function() {
            for (var A = [], k = 0; k < arguments.length; k++) A[k] = arguments[k];
            g.on(b).unsubscribe(B), _.apply(g, A);
          };
          return g.on(b, B);
        }, this.on.ready.subscribe = he(this.on.ready.subscribe, function(b) {
          return function(_, B) {
            $e.vip(function() {
              var A, k = g._state;
              k.openComplete ? (k.dbOpenError || W.resolve().then(_), B && b(_)) : k.onReadyBeingFired ? (k.onReadyBeingFired.push(_), B && b(_)) : (b(_), A = g, B || b(function S() {
                A.on.ready.unsubscribe(_), A.on.ready.unsubscribe(S);
              }));
            });
          };
        }), this.Collection = (a = this, Tn(pu.prototype, function(S, k) {
          this.db = a;
          var B = Ji, A = null;
          if (k) try {
            B = k();
          } catch (O) {
            A = O;
          }
          var k = S._ctx, S = k.table, I = S.hook.reading.fire;
          this._ctx = { table: S, index: k.index, isPrimKey: !k.index || S.schema.primKey.keyPath && k.index === S.schema.primKey.name, range: B, keysOnly: !1, dir: "next", unique: "", algorithm: null, filter: null, replayFilter: null, justLimit: !0, isMatch: null, offset: 0, limit: 1 / 0, error: A, or: k.or, valueMapper: I !== St ? I : null };
        })), this.Table = (c = this, Tn(os.prototype, function(b, _, B) {
          this.db = c, this._tx = B, this.name = b, this.schema = _, this.hook = c._allTables[b] ? c._allTables[b].hook : In(null, { creating: [iu, _e], reading: [ou, St], updating: [au, _e], deleting: [su, _e] });
        })), this.Transaction = (l = this, Tn(mu.prototype, function(b, _, B, A, k) {
          var S = this;
          b !== "readonly" && _.forEach(function(I) {
            I = (I = B[I]) == null ? void 0 : I.yProps, I && (_ = _.concat(I.map(function(O) {
              return O.updatesTable;
            })));
          }), this.db = l, this.mode = b, this.storeNames = _, this.schema = B, this.chromeTransactionDurability = A, this.idbtrans = null, this.on = In(this, "complete", "error", "abort"), this.parent = k || null, this.active = !0, this._reculock = 0, this._blockedFuncs = [], this._resolve = null, this._reject = null, this._waitingFor = null, this._waitingQueue = null, this._spinCount = 0, this._completion = new W(function(I, O) {
            S._resolve = I, S._reject = O;
          }), this._completion.then(function() {
            S.active = !1, S.on.complete.fire();
          }, function(I) {
            var O = S.active;
            return S.active = !1, S.on.error.fire(I), S.parent ? S.parent._reject(I) : O && S.idbtrans && S.idbtrans.abort(), qe(I);
          });
        })), this.Version = (d = this, Tn(Au.prototype, function(b) {
          this.db = d, this._cfg = { version: b, storesSource: null, dbschema: {}, tables: {}, contentUpgrade: null };
        })), this.WhereClause = (y = this, Tn(us.prototype, function(b, _, B) {
          if (this.db = y, this._ctx = { table: b, index: _ === ":id" ? null : _, or: B }, this._cmp = this._ascending = ge, this._descending = function(A, k) {
            return ge(k, A);
          }, this._max = function(A, k) {
            return 0 < ge(A, k) ? A : k;
          }, this._min = function(A, k) {
            return ge(A, k) < 0 ? A : k;
          }, this._IDBKeyRange = y._deps.IDBKeyRange, !this._IDBKeyRange) throw new X.MissingAPI();
        })), this.on("versionchange", function(b) {
          0 < b.newVersion ? console.warn("Another connection wants to upgrade database '".concat(g.name, "'. Closing db now to resume the upgrade.")) : console.warn("Another connection wants to delete database '".concat(g.name, "'. Closing db now to resume the delete request.")), g.close({ disableAutoOpen: !1 });
        }), this.on("blocked", function(b) {
          !b.newVersion || b.newVersion < b.oldVersion ? console.warn("Dexie.delete('".concat(g.name, "') was blocked")) : console.warn("Upgrade '".concat(g.name, "' blocked by other connection holding version ").concat(b.oldVersion / 10));
        }), this._maxKey = Nn(i.IDBKeyRange), this._createTransaction = function(b, _, B, A) {
          return new g.Transaction(b, _, B, g._options.chromeTransactionDurability, A);
        }, this._fireOnBlocked = function(b) {
          g.on("blocked").fire(b), Dn.toArray().filter(function(_) {
            return _.name === g.name && _ !== g && !_._state.vcFired;
          }).map(function(_) {
            return _.on("versionchange").fire(b);
          });
        }, this.use(Ru), this.use(Cu), this.use(Ou), this.use(Su), this.use(Bu), new Proxy(this, { get: function(b, _, B) {
          var A;
          return _ === "_vip" || (_ === "table" ? function(k) {
            return gr(g.table(k), x);
          } : (A = Reflect.get(b, _, B)) instanceof os ? gr(A, x) : _ === "tables" ? A.map(function(k) {
            return gr(k, x);
          }) : _ === "_createTransaction" ? function() {
            return gr(A.apply(this, arguments), x);
          } : A);
        } }));
        this.vip = x, E.forEach(function(b) {
          return b(g);
        });
      }
      var mr, pn = typeof Symbol < "u" && "observable" in Symbol ? Symbol.observable : "@@observable", Lu = (To.prototype.subscribe = function(n, i, a) {
        return this._subscribe(n && typeof n != "function" ? n : { next: n, error: i, complete: a });
      }, To.prototype[pn] = function() {
        return this;
      }, To);
      function To(n) {
        this._subscribe = n;
      }
      try {
        mr = { indexedDB: u.indexedDB || u.mozIndexedDB || u.webkitIndexedDB || u.msIndexedDB, IDBKeyRange: u.IDBKeyRange || u.webkitIDBKeyRange };
      } catch {
        mr = { indexedDB: null, IDBKeyRange: null };
      }
      function As(n) {
        var i, a = !1, c = new Lu(function(l) {
          var d = oe(n), y, g = !1, E = {}, R = {}, x = { get closed() {
            return g;
          }, unsubscribe: function() {
            g || (g = !0, y && y.abort(), b && Tt.storagemutated.unsubscribe(A));
          } }, b = (l.start && l.start(x), !1), _ = function() {
            return so(k);
          };
          function B() {
            return xo(R, E);
          }
          var A = function(S) {
            hr(E, S), B() && _();
          }, k = function() {
            var S, I, O;
            !g && mr.indexedDB && (E = {}, S = {}, y && y.abort(), y = new AbortController(), O = ((C) => {
              var $ = cn();
              try {
                d && ln();
                var M = Bt(n, C);
                return M = d ? M.finally(Rt) : M;
              } finally {
                $ && un();
              }
            })(I = { subscr: S, signal: y.signal, requery: _, querier: n, trans: null }), b || (Tt(Ln, A), b = !0), Promise.resolve(O).then(function(C) {
              a = !0, i = C, g || I.signal.aborted || (B() || (R = S, B()) ? _() : (E = {}, so(function() {
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
        var i = Ct;
        try {
          Ct = !0, Tt.storagemutated.fire(n), So(n, !0);
        } finally {
          Ct = i;
        }
      }
      N(Jt, o(o({}, ne), { delete: function(n) {
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
              return l !== tr;
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
            var i = Bo(n.apply(this, arguments));
            return i && typeof i.then == "function" ? i : W.resolve(i);
          } catch (a) {
            return qe(a);
          }
        };
      }, spawn: function(n, i, a) {
        try {
          var c = Bo(n.apply(a, i || []));
          return c && typeof c.then == "function" ? c : W.resolve(c);
        } catch (l) {
          return qe(l);
        }
      }, currentTransaction: { get: function() {
        return ie.trans || null;
      } }, waitFor: function(n, i) {
        return n = W.resolve(typeof n == "function" ? Jt.ignoreTransaction(n) : n).timeout(i || 6e4), ie.trans ? ie.trans.waitFor(n) : n;
      }, Promise: W, debug: { get: function() {
        return ct;
      }, set: function(n) {
        Vi(n);
      } }, derive: q, extend: h, props: N, override: he, Events: In, on: Tt, liveQuery: As, extendObservabilitySet: hr, getByKeyPath: de, setByKeyPath: me, delByKeyPath: function(n, i) {
        typeof i == "string" ? me(n, i, void 0) : "length" in i && [].map.call(i, function(a) {
          me(n, a, void 0);
        });
      }, shallowClone: Re, deepClone: U, getObjectDiff: Ro, cmp: ge, asap: Me, minKey: -1 / 0, addons: [], connections: { get: Dn.toArray }, errnames: We, dependencies: mr, cache: Xt, semVer: "4.4.2", version: "4.4.2".split(".").map(function(n) {
        return parseInt(n);
      }).reduce(function(n, i, a) {
        return n + i / Math.pow(10, 2 * a);
      }) })), Jt.maxKey = Nn(Jt.dependencies.IDBKeyRange), typeof dispatchEvent < "u" && typeof addEventListener < "u" && (Tt(Ln, function(n) {
        Ct || (n = new CustomEvent(fo, { detail: n }), Ct = !0, dispatchEvent(n), Ct = !1);
      }), addEventListener(fo, function(n) {
        n = n.detail, Ct || Co(n);
      }));
      var yn, Ct = !1, ks = function() {
      };
      return typeof BroadcastChannel < "u" && ((ks = function() {
        (yn = new BroadcastChannel(fo)).onmessage = function(n) {
          return n.data && Co(n.data);
        };
      })(), typeof yn.unref == "function" && yn.unref(), Tt(Ln, function(n) {
        Ct || yn.postMessage(n);
      })), typeof addEventListener < "u" && (addEventListener("pagehide", function(n) {
        if (!vt.disableBfCache && n.persisted) {
          ct && console.debug("Dexie: handling persisted pagehide"), yn?.close();
          for (var i = 0, a = Dn.toArray(); i < a.length; i++) a[i].close({ disableAutoOpen: !1 });
        }
      }), addEventListener("pageshow", function(n) {
        !vt.disableBfCache && n.persisted && (ct && console.debug("Dexie: handling persisted pageshow"), ks(), Co({ all: new je(-1 / 0, [[]]) }));
      })), W.rejectionMapper = function(n, i) {
        return !n || n instanceof Ee || n instanceof TypeError || n instanceof SyntaxError || !n.name || !Ft[n.name] ? n : (i = new Ft[n.name](i || n.message, n), "stack" in n && P(i, "stack", { get: function() {
          return this.inner.stack;
        } }), i);
      }, Vi(ct), o(vt, Object.freeze({ __proto__: null, DEFAULT_MAX_CONNECTIONS: 1e3, Dexie: vt, Entity: Qi, PropModification: On, RangeSet: je, add: function(n) {
        return new On({ add: n });
      }, cmp: ge, default: vt, liveQuery: As, mergeRanges: $n, rangesOverlap: ps, remove: function(n) {
        return new On({ remove: n });
      }, replacePrefix: function(n, i) {
        return new On({ replacePrefix: [n, i] });
      } }), { default: vt }), vt;
    });
  })(Rr)), Rr.exports;
}
var Ay = xy(), oi = /* @__PURE__ */ Ey(Ay);
const ra = Symbol.for("Dexie"), Kr = globalThis[ra] || (globalThis[ra] = oi);
if (oi.semVer !== Kr.semVer)
  throw new Error(`Two different versions of Dexie loaded in the same app: ${oi.semVer} and ${Kr.semVer}`);
const {
  liveQuery: $y,
  mergeRanges: Ky,
  rangesOverlap: Uy,
  RangeSet: My,
  cmp: jy,
  Entity: Fy,
  PropModification: Hy,
  replacePrefix: Vy,
  add: zy,
  remove: Zy,
  DexieYProvider: Gy
} = Kr, ky = "eHagakiDB", Sy = 15, By = "[pubkeyHex+postedAt+createdAt+eventId]", Ry = /* @__PURE__ */ new Set(), Oy = /* @__PURE__ */ new Set();
let oa = !1;
function ia(e) {
  oa !== e && (oa = e, Oy.forEach((t) => t(e)), e && Ry.forEach((t) => t()));
}
class Iy extends Kr {
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
  postHistoryChildInteractions;
  postHistoryDeletionRequests;
  postMediaCache;
  channelMetadata;
  channelImageCacheMeta;
  constructor(t = ky) {
    super(t), this.on("blocked", () => {
      ia(!0);
    }), this.on("ready", () => ia(!1)), this.version(Sy).stores({
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
      postHistory: `id, eventId, pubkeyHex, kind, createdAt, postedAt, updatedAt, deletedAt, fetchedAt, lastSeenAt, schemaVersion, [pubkeyHex+postedAt], [pubkeyHex+createdAt], ${By}`,
      postHistoryChildInteractions: "id, eventId, parentEventId, rootEventId, authorPubkey, kind, createdAt, fetchedAt, updatedAt, schemaVersion, [parentEventId+createdAt]",
      postHistoryDeletionRequests: "id, targetEventId, targetAuthorPubkey, deletionEventId, fetchedAt, [targetAuthorPubkey+targetEventId]",
      postMediaCache: "cacheKey, url, normalizedUrl, size, createdAt, lastAccessedAt, updatedAt, source, schemaVersion",
      channelMetadata: "channelEventId, fetchedAt, metadataCreatedAt, creatorPubkey, updatedAt, schemaVersion",
      channelImageCacheMeta: "url, responseType, fetchedAt, lastAttemptAt, lastAccessedAt, schemaVersion"
    });
  }
}
const $t = new Iy();
function Ur(e) {
  self.postMessage(e);
}
function Ty() {
  return {
    post: $t.postHistory,
    deletion: $t.postHistoryDeletionRequests,
    transaction: {
      post: (e) => $t.transaction(
        "rw",
        $t.postHistory,
        e
      ),
      deletion: (e) => $t.transaction(
        "rw",
        $t.postHistoryDeletionRequests,
        e
      )
    }
  };
}
async function Cy(e) {
  Ur({ type: "progress", progress: { phase: "loading" } });
  const [t, r] = await Promise.all([
    $t.postHistory.where("pubkeyHex").equals(e).toArray(),
    $t.postHistoryDeletionRequests.where("targetAuthorPubkey").equals(e).toArray()
  ]), { result: o, blob: s } = await wy({
    pubkeyHex: e,
    postRecords: t,
    deletionRecords: r,
    verificationStores: Ty(),
    onProgress: (u) => Ur({ type: "progress", progress: u })
  });
  return { result: o, blob: s };
}
self.addEventListener("message", (e) => {
  e.data?.type === "export" && Cy(e.data.pubkeyHex).then(({ result: t, blob: r }) => Ur({ type: "complete", result: t, blob: r })).catch((t) => Ur({
    type: "error",
    message: t instanceof Error ? t.message : "post_history_export_worker_failed"
  }));
});
